-- ============================================================
-- 011: Re-enable RLS after the new client bundle is deployed
-- ============================================================
-- Run this AFTER this PR is merged and Vercel has finished deploying
-- the updated bundle. The new bundle authenticates dev login via
-- signInWithPassword and runs the login pre-flight check via the
-- auth_email_is_registered RPC, so every client request will carry
-- a JWT and RLS won't break anything.
--
-- If you push this migration before the new bundle is live, prod
-- will start serving 401s on every request that uses the anon key
-- (e.g., the original loadAppUser call path) until Vercel catches up.
--
-- Policies from 006 are still on the tables (none of 007 / 010
-- dropped them, only RLS was disabled), so this migration just flips
-- RLS back on for the same set of tables.
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
-- Re-revoke anon's table privileges. With RLS on, anon should have
-- no direct table access -- only the auth_email_is_registered RPC.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
