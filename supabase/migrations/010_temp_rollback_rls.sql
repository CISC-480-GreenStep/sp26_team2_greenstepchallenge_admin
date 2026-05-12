-- ============================================================
-- 010: Temporary RLS rollback while waiting for PR merge
-- ============================================================
-- Migration 009 enabled RLS, which breaks the currently-deployed
-- production bundle (it queries the DB with the anon key, no JWT).
-- This migration disables RLS again so prod stays usable. Once the
-- new bundle (this branch) is live, run a follow-up migration to
-- re-enable RLS.
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
