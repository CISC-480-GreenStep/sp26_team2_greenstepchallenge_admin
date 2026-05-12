-- ============================================================
-- GreenStep Challenge Admin -- Performance Indexes
-- Closes issue #32: keep report generation under 5 seconds.
--
-- The base schema (001) indexes foreign keys. This migration adds
-- indexes for the timestamp/date-range/composite query patterns the
-- admin console actually runs against participation and activity_logs
-- (the two largest tables).
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor).
-- ============================================================

-- activity_logs: dashboard "Recent Activity" widget reads the whole
-- table ordered by timestamp desc. Without this, sorting requires a
-- full scan + sort.
create index if not exists idx_activity_logs_timestamp
  on activity_logs(timestamp desc);
-- activity_logs: UserDetail reads a single user's logs ordered by
-- timestamp desc. A composite (userId, timestamp desc) lets Postgres
-- satisfy both the filter and the order with one index.
create index if not exists idx_activity_logs_user_timestamp
  on activity_logs("userId", timestamp desc);
-- participation: getUserPoints() filters by userId and joins on
-- challengeId; per-user-per-challenge reports filter on both.
create index if not exists idx_participation_user_challenge
  on participation("userId", "challengeId");
-- participation: date-range report filters and any future "activity
-- over time" charts will scan by completedAt.
create index if not exists idx_participation_completed_at
  on participation("completedAt");
