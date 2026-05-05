-- ============================================================
-- 009: Re-enable Row-Level Security (second attempt at #31)
-- ============================================================
-- The first RLS attempt (006) was rolled back (007) because the
-- deployed app's dev-login code path read users with the anon key
-- and broke when RLS started rejecting unauthenticated reads.
--
-- Since then:
--   * magic-link auth was replaced with 8-digit OTP codes (PR #61)
--     so every real user now has a Supabase Auth session, and
--   * dev login is being switched to signInWithPassword in this PR
--     so the Quick-Login shortcut also gets a real JWT, and
--   * the auth_email_is_registered RPC was added in 008 so the
--     pre-flight email check on the login page works under RLS.
--
-- Every client request can now carry a JWT, so we can turn RLS back
-- on without breaking the deployed app. Apply this migration AFTER
-- the new client bundle has been deployed; otherwise the in-flight
-- production app -- which talks to the DB with the anon key -- will
-- start hitting 401s.
--
-- Policies from 006 are still on the tables (007 only disabled RLS,
-- it did not drop policies), so this migration just flips RLS back
-- on for the same set of tables.
-- ============================================================

alter table public.users                  enable row level security;
alter table public.departments            enable row level security;
alter table public.actions                enable row level security;
alter table public.challenges             enable row level security;
alter table public.challenge_actions      enable row level security;
alter table public.challenge_participants enable row level security;
alter table public.templates              enable row level security;
alter table public.participation          enable row level security;
alter table public.activity_logs          enable row level security;

-- Re-revoke anon's table privileges that 007 restored. With RLS on,
-- anon should have no direct table access -- only the RPC from 008.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
