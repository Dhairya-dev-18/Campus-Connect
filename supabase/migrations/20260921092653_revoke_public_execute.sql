/*
# Revoke execute from public role on SECURITY DEFINER functions

The `public` role is the default grant target in PostgreSQL. Revoking from anon/authenticated
is not enough if public still has execute. This migration revokes from public as well.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public;

-- Re-grant is_admin only to authenticated
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
