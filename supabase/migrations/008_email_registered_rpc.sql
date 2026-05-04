-- ============================================================
-- 008: auth_email_is_registered RPC for the login pre-flight check
-- ============================================================
-- Anon-callable check used by the login page to decide whether to
-- send an OTP code. `security definer` + a qualified search_path so
-- the inner SELECT runs without RLS in effect; the function only
-- returns a boolean, so the only thing leaked is the existence of an
-- account for a given email -- already leakable by attempting to
-- send a magic link.
--
-- Split out from the RLS-enable migration (009) so we can deploy the
-- function ahead of the rest of the RLS work without breaking the
-- production app: the new login() code calls this RPC, so the
-- function must exist before the new bundle is deployed.
-- ============================================================

create or replace function public.auth_email_is_registered(email_to_check text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.users where email = email_to_check);
$$;

grant execute on function public.auth_email_is_registered(text) to anon, authenticated;
