/*
# Fix anon read access for chat messages and profiles

## Changes
1. chat_messages SELECT policy: expand from `authenticated` only to `anon, authenticated` so visitors can read the conversation before signing in.
2. profiles SELECT policy: expand from `authenticated` only to `anon, authenticated` so the profile join in chat message queries works for unauthenticated users.
*/

DROP POLICY IF EXISTS "chat_msg_select_all" ON chat_messages;
CREATE POLICY "chat_msg_select_all" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT
  TO anon, authenticated USING (true);
