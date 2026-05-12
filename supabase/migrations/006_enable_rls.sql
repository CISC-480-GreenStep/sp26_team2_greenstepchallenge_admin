-- ============================================================
-- 006: Enable Row-Level Security with role-based policies
-- ============================================================
-- Closes issue #31 (Data Validation & Security).
--
-- Enforces RBAC at the database layer so the API cannot be bypassed
-- by, e.g., calling supabase-js directly from the browser console.
--
-- Threat model after this migration:
--   * anon (signed-out) clients see nothing -- the public anon key
--     no longer reads or writes any admin table.
--   * authenticated clients can READ all admin data.
--   * Mutations (INSERT / UPDATE / DELETE) require Admin or
--     SuperAdmin role, looked up by email from public.users.
--   * Two narrow exceptions: anyone authenticated may INSERT into
--     participation (mobile users log their own actions) and
--     activity_logs (audit log writes ride along with admin actions).
--
-- Service role (used by the Vercel invite-user function) bypasses
-- RLS by default, so admin-only inserts via that path keep working.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- Helper functions
-- ──────────────────────────────────────────────────────────────
-- Look up the role of the currently-authenticated caller.
-- security definer + explicit search_path so the inner SELECT
-- bypasses RLS on public.users (otherwise the policy would
-- recursively call this function while evaluating itself).
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where email = auth.email() limit 1;
$$;
-- Convenience predicate for "may mutate admin data".
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('Admin', 'SuperAdmin'), false);
$$;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
-- ──────────────────────────────────────────────────────────────
-- Enable RLS on every admin table
-- ──────────────────────────────────────────────────────────────
alter table public.users                  enable row level security;
alter table public.departments            enable row level security;
alter table public.actions                enable row level security;
alter table public.challenges             enable row level security;
alter table public.challenge_actions      enable row level security;
alter table public.challenge_participants enable row level security;
alter table public.templates              enable row level security;
alter table public.participation          enable row level security;
alter table public.activity_logs          enable row level security;
-- ──────────────────────────────────────────────────────────────
-- Read policies: any authenticated user can read all admin data
-- ──────────────────────────────────────────────────────────────
create policy authenticated_read on public.users                  for select to authenticated using (true);
create policy authenticated_read on public.departments            for select to authenticated using (true);
create policy authenticated_read on public.actions                for select to authenticated using (true);
create policy authenticated_read on public.challenges             for select to authenticated using (true);
create policy authenticated_read on public.challenge_actions      for select to authenticated using (true);
create policy authenticated_read on public.challenge_participants for select to authenticated using (true);
create policy authenticated_read on public.templates              for select to authenticated using (true);
create policy authenticated_read on public.participation          for select to authenticated using (true);
create policy authenticated_read on public.activity_logs          for select to authenticated using (true);
-- ──────────────────────────────────────────────────────────────
-- Write policies: Admin / SuperAdmin only
-- (FOR ALL covers INSERT, UPDATE, and DELETE)
-- ──────────────────────────────────────────────────────────────
create policy admin_write on public.users                  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_write on public.departments            for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_write on public.actions                for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_write on public.challenges             for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_write on public.challenge_actions      for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_write on public.challenge_participants for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_write on public.templates              for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- ──────────────────────────────────────────────────────────────
-- Special cases
-- ──────────────────────────────────────────────────────────────
-- participation: any authenticated user may INSERT (mobile users
-- log their own action completions); only admins may UPDATE/DELETE.
create policy any_insert on public.participation for insert to authenticated with check (true);
create policy admin_update on public.participation for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_delete on public.participation for delete to authenticated using (public.is_admin());
-- activity_logs: any authenticated user may INSERT (logging happens
-- as a side effect of admin operations). Updates and deletes have
-- no policies, which means RLS denies them -- audit trail is
-- effectively immutable for normal users.
create policy any_insert on public.activity_logs for insert to authenticated with check (true);
-- ──────────────────────────────────────────────────────────────
-- Permissions
-- ──────────────────────────────────────────────────────────────
-- Postgres checks GRANTs before RLS, so policies only matter if the
-- role has the underlying privilege. Make sure authenticated does;
-- explicitly remove anon's access in case any earlier migration
-- granted it.
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
