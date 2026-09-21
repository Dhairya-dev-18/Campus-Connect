/*
# Production Schema Upgrade — Role System, Admin Policies, Storage, Column Additions

## Overview
Upgrades the existing Campus Connect schema to support a secure role-based authorization system,
admin management capabilities, file storage, and additional profile/resource columns.

## Changes to Existing Tables

1. **profiles** — Add columns:
   - `role` (text, NOT NULL, DEFAULT 'student', CHECK in ('student','admin'))
   - `bio` (text, nullable) — student bio/about section
   - `semester` (text, nullable) — current semester/year
   - `avatar_url` (text, nullable) — profile picture URL from storage

2. **lost_found_items** — Add column:
   - `image_url` (text, nullable) — uploaded image URL from storage

3. **academic_resources** — Add columns:
   - `semester` (text, nullable) — which semester the resource is for
   - `file_url` (text, nullable) — file URL from storage
   - `description` (text, nullable) — resource description

4. **events** — Add column:
   - `image_url` (text, nullable) — event poster image URL

## Security Changes (RLS)

### profiles
- REVOKE UPDATE on all columns, then GRANT UPDATE only on user-editable columns
  (full_name, roll_number, branch, avatar_color, bio, semester, avatar_url).
  The `role` column is NOT user-writable — prevents privilege escalation.
- SELECT policy stays open (anon, authenticated) so chat names work.

### events
- Add INSERT/UPDATE/DELETE policies for admin-only management.
  Uses a SECURITY DEFINER function `is_admin()` to check the caller's role.

### communities
- Add INSERT/UPDATE/DELETE policies for admin-only management.

### lost_found_items
- Add admin UPDATE policy so admins can moderate (mark resolved, remove).
  Student UPDATE stays owner-only.

### academic_resources
- Add UPDATE policy for admin-only editing.
- Keep student INSERT (owner) and admin DELETE.

### chat_messages
- Add admin DELETE policy for moderation.

## New Functions

1. **is_admin()** — SECURITY DEFINER function that checks if auth.uid()'s profile
   has role='admin'. Used in RLS policies. EXECUTE revoked from anon.

2. **handle_new_user()** — Updated to set role='student' on new profiles.
   EXECUTE revoked from anon and authenticated (was publicly callable — security fix).

## Storage Buckets

1. **avatars** — public read, authenticated write to own folder (auth.uid()/filename)
2. **lost-found** — public read, authenticated write to own folder
3. **event-images** — public read, admin-only write
4. **academic-resources** — public read, authenticated write to own folder

## Important Notes
1. The `role` column has a CHECK constraint ensuring only 'student' or 'admin' values.
2. `role` defaults to 'student' — every new signup automatically gets student role.
3. Users CANNOT change their own role because UPDATE on `role` is revoked.
4. To make someone admin, run: UPDATE profiles SET role='admin' WHERE id='<uuid>';
5. The is_admin() function is the single source of truth for admin checks in RLS.
6. Storage policies enforce folder-based isolation (auth.uid()/filename pattern).
*/

-- ===== ADD COLUMNS TO PROFILES =====
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS semester text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- ===== ADD COLUMNS TO LOST_FOUND_ITEMS =====
ALTER TABLE lost_found_items ADD COLUMN IF NOT EXISTS image_url text;

-- ===== ADD COLUMNS TO ACADEMIC_RESOURCES =====
ALTER TABLE academic_resources ADD COLUMN IF NOT EXISTS semester text;
ALTER TABLE academic_resources ADD COLUMN IF NOT EXISTS file_url text;
ALTER TABLE academic_resources ADD COLUMN IF NOT EXISTS description text;

-- ===== ADD COLUMN TO EVENTS =====
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url text;

-- ===== IS_ADMIN FUNCTION =====
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ===== FIX handle_new_user: add role, revoke public execute =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, roll_number, branch, avatar_color, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    NEW.raw_user_meta_data->>'roll_number',
    NEW.raw_user_meta_data->>'branch',
    CASE
      WHEN (NEW.raw_user_meta_data->>'avatar_color') IS NOT NULL
      THEN NEW.raw_user_meta_data->>'avatar_color'
      ELSE '#3b82f6'
    END,
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- ===== PROFILES: Column-level UPDATE security =====
-- Revoke table-wide UPDATE, grant only on user-editable columns
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (full_name, roll_number, branch, avatar_color, bio, semester, avatar_url) ON profiles TO authenticated;

-- ===== EVENTS: Admin management policies =====
DROP POLICY IF EXISTS "events_insert_admin" ON events;
CREATE POLICY "events_insert_admin" ON events FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "events_update_admin" ON events;
CREATE POLICY "events_update_admin" ON events FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "events_delete_admin" ON events;
CREATE POLICY "events_delete_admin" ON events FOR DELETE
  TO authenticated USING (public.is_admin());

-- ===== COMMUNITIES: Admin management policies =====
DROP POLICY IF EXISTS "communities_insert_admin" ON communities;
CREATE POLICY "communities_insert_admin" ON communities FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "communities_update_admin" ON communities;
CREATE POLICY "communities_update_admin" ON communities FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "communities_delete_admin" ON communities;
CREATE POLICY "communities_delete_admin" ON communities FOR DELETE
  TO authenticated USING (public.is_admin());

-- ===== LOST_FOUND: Admin moderation policy =====
DROP POLICY IF EXISTS "lf_update_admin" ON lost_found_items;
CREATE POLICY "lf_update_admin" ON lost_found_items FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "lf_delete_admin" ON lost_found_items;
CREATE POLICY "lf_delete_admin" ON lost_found_items FOR DELETE
  TO authenticated USING (public.is_admin());

-- ===== ACADEMIC_RESOURCES: Admin management policies =====
DROP POLICY IF EXISTS "ar_update_admin" ON academic_resources;
CREATE POLICY "ar_update_admin" ON academic_resources FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "ar_delete_admin" ON academic_resources;
CREATE POLICY "ar_delete_admin" ON academic_resources FOR DELETE
  TO authenticated USING (public.is_admin());

-- ===== CHAT_MESSAGES: Admin moderation policy =====
DROP POLICY IF EXISTS "chat_msg_delete_admin" ON chat_messages;
CREATE POLICY "chat_msg_delete_admin" ON chat_messages FOR DELETE
  TO authenticated USING (public.is_admin());

-- ===== STORAGE BUCKETS =====
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('lost-found', 'lost-found', true),
  ('event-images', 'event-images', true),
  ('academic-resources', 'academic-resources', true)
ON CONFLICT (id) DO NOTHING;

-- ===== STORAGE POLICIES: avatars =====
DROP POLICY IF EXISTS "avatars_select_all" ON storage.objects;
CREATE POLICY "avatars_select_all" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
CREATE POLICY "avatars_insert_own" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
CREATE POLICY "avatars_update_own" ON storage.objects FOR UPDATE
  TO authenticated USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ===== STORAGE POLICIES: lost-found =====
DROP POLICY IF EXISTS "lf_storage_select_all" ON storage.objects;
CREATE POLICY "lf_storage_select_all" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'lost-found');

DROP POLICY IF EXISTS "lf_storage_insert_own" ON storage.objects;
CREATE POLICY "lf_storage_insert_own" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'lost-found'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ===== STORAGE POLICIES: event-images (admin only) =====
DROP POLICY IF EXISTS "event_images_select_all" ON storage.objects;
CREATE POLICY "event_images_select_all" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'event-images');

DROP POLICY IF EXISTS "event_images_insert_admin" ON storage.objects;
CREATE POLICY "event_images_insert_admin" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'event-images' AND public.is_admin()
  );

-- ===== STORAGE POLICIES: academic-resources =====
DROP POLICY IF EXISTS "ar_storage_select_all" ON storage.objects;
CREATE POLICY "ar_storage_select_all" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'academic-resources');

DROP POLICY IF EXISTS "ar_storage_insert_own" ON storage.objects;
CREATE POLICY "ar_storage_insert_own" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'academic-resources'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ===== ADDITIONAL INDEXES =====
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_lost_found_user_id ON lost_found_items(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_resources_subject ON academic_resources(subject);
CREATE INDEX IF NOT EXISTS idx_event_reg_user ON event_registrations(user_id);
