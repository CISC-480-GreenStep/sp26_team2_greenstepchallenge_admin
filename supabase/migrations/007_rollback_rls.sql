-- ============================================================
-- 007: Roll back RLS from migration 006
-- ============================================================
-- Migration 006 enabled RLS, which broke the deployed admin app
-- because the deployed bundle still queries the DB with the anon
-- key directly (no JWT). RLS will be re-enabled in a follow-up
-- once the app is deployed with the new auth-aware code path.
-- ============================================================

alter table public.users                  disable row level security;
alter table public.departments            disable row level security;
alter table public.actions                disable row level security;
alter table public.challenges             disable row level security;
alter table public.challenge_actions      disable row level security;
alter table public.challenge_participants disable row level security;
alter table public.templates              disable row level security;
alter table public.participation          disable row level security;
alter table public.activity_logs          disable row level security;
grant select, insert, update, delete on all tables in schema public to anon;
grant usage, select on all sequences in schema public to anon;
