/*
# ABES Campus Platform — Initial Schema

## Overview
Creates the full database schema for the ABES Engineering College campus platform.
This is a multi-user app: students sign in with email/password, then can chat,
report lost/found items, register for events, and join communities.

## New Tables

1. **profiles** — Student profile data linked to auth.users
   - `id` (uuid, PK, references auth.users)
   - `full_name` (text)
   - `roll_number` (text, unique)
   - `branch` (text)
   - `avatar_color` (text, for chat avatar coloring)

2. **communities** — Student communities/clubs
   - `id` (uuid, PK)
   - `name` (text, unique)
   - `slug` (text, unique)
   - `description` (text)
   - `icon` (text, lucide icon name)
   - `color` (text, hex color)
   - `created_at` (timestamptz)

3. **community_members** — Join/leave communities
   - `id` (uuid, PK)
   - `community_id` (uuid, FK → communities)
   - `user_id` (uuid, FK → auth.users, defaults to auth.uid())
   - `joined_at` (timestamptz)
   - Unique constraint on (community_id, user_id)

4. **chat_rooms** — Chat rooms for each community + general rooms
   - `id` (uuid, PK)
   - `name` (text, unique)
   - `community_id` (uuid, FK → communities, nullable for general rooms)

5. **chat_messages** — Real-time chat messages
   - `id` (uuid, PK)
   - `room_id` (uuid, FK → chat_rooms)
   - `user_id` (uuid, FK → auth.users, defaults to auth.uid())
   - `text` (text)
   - `created_at` (timestamptz)

6. **lost_found_items** — Lost & found reports
   - `id` (uuid, PK)
   - `type` (text: 'LOST' or 'FOUND')
   - `title` (text)
   - `description` (text)
   - `location` (text)
   - `icon` (text, lucide icon name)
   - `user_id` (uuid, FK → auth.users, defaults to auth.uid())
   - `resolved` (boolean, default false)
   - `created_at` (timestamptz)

7. **events** — Campus events
   - `id` (uuid, PK)
   - `title` (text)
   - `category` (text)
   - `status` (text: 'upcoming', 'open', 'closed')
   - `event_date` (text)
   - `description` (text)
   - `icon` (text, lucide icon name)
   - `capacity` (integer)
   - `created_at` (timestamptz)

8. **event_registrations** — Event registrations
   - `id` (uuid, PK)
   - `event_id` (uuid, FK → events)
   - `user_id` (uuid, FK → auth.users, defaults to auth.uid())
   - `registered_at` (timestamptz)
   - Unique constraint on (event_id, user_id)

9. **academic_resources** — Academic notes/resources
   - `id` (uuid, PK)
   - `subject` (text)
   - `title` (text)
   - `resource_type` (text)
   - `user_id` (uuid, FK → auth.users, defaults to auth.uid())
   - `created_at` (timestamptz)

## Security (RLS)
- All tables have RLS enabled.
- profiles: users can read all profiles, update only their own.
- communities: everyone can read; members table is owner-scoped.
- chat_messages: authenticated users can read/write in all rooms; messages are owner-scoped for delete.
- lost_found_items: everyone can read; owner can insert/update/delete their own.
- events: everyone can read; registrations are owner-scoped.
- academic_resources: everyone can read; owner can insert/delete their own.

## Important Notes
1. All user_id columns default to auth.uid() so inserts from the frontend work without passing user_id.
2. A trigger function auto-creates a profile row when a new auth.users row is inserted (on signup).
3. Seed data is inserted for communities, chat_rooms, and events.
*/

-- ===== PROFILES =====
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  roll_number text UNIQUE,
  branch text,
  avatar_color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, roll_number, branch, avatar_color)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    NEW.raw_user_meta_data->>'roll_number',
    NEW.raw_user_meta_data->>'branch',
    CASE
      WHEN (NEW.raw_user_meta_data->>'avatar_color') IS NOT NULL
      THEN NEW.raw_user_meta_data->>'avatar_color'
      ELSE '#3b82f6'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== COMMUNITIES =====
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  icon text DEFAULT 'Users',
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "communities_select_all" ON communities;
CREATE POLICY "communities_select_all" ON communities FOR SELECT
  TO anon, authenticated USING (true);

-- ===== COMMUNITY MEMBERS =====
CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE (community_id, user_id)
);

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cm_select_all" ON community_members;
CREATE POLICY "cm_select_all" ON community_members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "cm_insert_own" ON community_members;
CREATE POLICY "cm_insert_own" ON community_members FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cm_delete_own" ON community_members;
CREATE POLICY "cm_delete_own" ON community_members FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===== CHAT ROOMS =====
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  community_id uuid REFERENCES communities(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_rooms_select_all" ON chat_rooms;
CREATE POLICY "chat_rooms_select_all" ON chat_rooms FOR SELECT
  TO anon, authenticated USING (true);

-- ===== CHAT MESSAGES =====
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_msg_select_all" ON chat_messages;
CREATE POLICY "chat_msg_select_all" ON chat_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "chat_msg_insert_own" ON chat_messages;
CREATE POLICY "chat_msg_insert_own" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_msg_delete_own" ON chat_messages;
CREATE POLICY "chat_msg_delete_own" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===== LOST & FOUND =====
CREATE TABLE IF NOT EXISTS lost_found_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('LOST', 'FOUND')),
  title text NOT NULL,
  description text DEFAULT '',
  location text DEFAULT '',
  icon text DEFAULT 'Search',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lost_found_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lf_select_all" ON lost_found_items;
CREATE POLICY "lf_select_all" ON lost_found_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "lf_insert_own" ON lost_found_items;
CREATE POLICY "lf_insert_own" ON lost_found_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lf_update_own" ON lost_found_items;
CREATE POLICY "lf_update_own" ON lost_found_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lf_delete_own" ON lost_found_items;
CREATE POLICY "lf_delete_own" ON lost_found_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===== EVENTS =====
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  event_date text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'Calendar',
  capacity integer DEFAULT 500,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_all" ON events;
CREATE POLICY "events_select_all" ON events FOR SELECT
  TO anon, authenticated USING (true);

-- ===== EVENT REGISTRATIONS =====
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  UNIQUE (event_id, user_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "er_select_all" ON event_registrations;
CREATE POLICY "er_select_all" ON event_registrations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "er_insert_own" ON event_registrations;
CREATE POLICY "er_insert_own" ON event_registrations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "er_delete_own" ON event_registrations;
CREATE POLICY "er_delete_own" ON event_registrations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===== ACADEMIC RESOURCES =====
CREATE TABLE IF NOT EXISTS academic_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  title text NOT NULL,
  resource_type text DEFAULT 'Notes',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE academic_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ar_select_all" ON academic_resources;
CREATE POLICY "ar_select_all" ON academic_resources FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "ar_insert_own" ON academic_resources;
CREATE POLICY "ar_insert_own" ON academic_resources FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ar_delete_own" ON academic_resources;
CREATE POLICY "ar_delete_own" ON academic_resources FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ===== SEED DATA: COMMUNITIES =====
INSERT INTO communities (name, slug, description, icon, color) VALUES
  ('Coding Club', 'coding', 'For competitive programmers and developers.', 'Code', '#3b82f6'),
  ('AI & Innovation', 'ai-innovation', 'Explore AI, ML and cutting-edge tech.', 'BrainCircuit', '#8b5cf6'),
  ('Entrepreneurship', 'entrepreneurship', 'Build startups and learn business.', 'Rocket', '#f59e0b'),
  ('Photography', 'photography', 'Capture moments, share your art.', 'Camera', '#ec4899'),
  ('Sports', 'sports', 'Cricket, football, badminton and more.', 'Trophy', '#10b981'),
  ('Music & Arts', 'music-arts', 'For musicians, singers and artists.', 'Music', '#f97316')
ON CONFLICT (name) DO NOTHING;

-- ===== SEED DATA: CHAT ROOMS =====
INSERT INTO chat_rooms (name, community_id) VALUES
  ('DSA', NULL),
  ('Web Dev', NULL),
  ('Placements', NULL),
  ('First Year', NULL),
  ('AI & ML', NULL),
  ('Projects', NULL),
  ('General', NULL)
ON CONFLICT (name) DO NOTHING;

-- ===== SEED DATA: EVENTS =====
INSERT INTO events (title, category, status, event_date, description, icon, capacity) VALUES
  ('ABES Hackathon', 'Technology', 'open', 'Jan 2026', '48 hours of coding, innovation and building solutions.', 'Code2', 500),
  ('TechFest', 'Innovation', 'open', 'Feb 2026', 'A celebration of technology, ideas and student projects.', 'Sparkles', 1000),
  ('Placement Preparation', 'Career', 'open', 'Dec 2025', 'Mock interviews, aptitude tests and resume reviews.', 'Briefcase', 300),
  ('Cultural Fest', 'Campus Life', 'open', 'Mar 2026', 'Music, dance, drama and the vibrant culture of ABES.', 'PartyPopper', 2000)
ON CONFLICT DO NOTHING;

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_found_created ON lost_found_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_cm_community ON community_members(community_id);
