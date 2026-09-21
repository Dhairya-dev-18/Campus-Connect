/*
# Revoke public execute on SECURITY DEFINER functions

## Changes
1. Revoke EXECUTE on handle_new_user() from anon and authenticated — it's a trigger function, not meant to be called via REST.
2. Revoke EXECUTE on is_admin() from anon — only authenticated users should call it.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
