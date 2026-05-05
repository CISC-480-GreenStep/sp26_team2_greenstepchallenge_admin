-- ============================================================
-- 012: auth_email_is_registered should ignore deactivated users
-- ============================================================
-- Otherwise the login pre-flight passes for deactivated emails and
-- sends them a code they can't actually use; they only see the
-- "deactivated" error after entering it. Filtering on status here
-- shifts the error to before the code is sent.
-- ============================================================

create or replace function public.auth_email_is_registered(email_to_check text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where email = email_to_check
      and status = 'Active'
  );
$$;
