-- ============================================================
-- Migration: 014_challenge_split_colors.sql
-- Description: Adds the 4-color palette columns the ChallengeForm
--              has been writing to. The legacy single `theme` text
--              column stays in place so existing rows keep rendering;
--              new rows populate the four split columns.
-- ============================================================

alter table challenges
  add column if not exists "bgColorHeader" varchar(7),
  add column if not exists "txColorHeader" varchar(7),
  add column if not exists "bgColorBody"   varchar(7),
  add column if not exists "txColorBody"   varchar(7);
