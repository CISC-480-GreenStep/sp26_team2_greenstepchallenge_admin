-- ============================================================
-- Rename snake_case columns to camelCase to match the UI layer
-- ============================================================

-- departments
alter table departments rename column created_at to "createdAt";

-- users
alter table users rename column group_id to "groupId";
alter table users rename column created_at to "createdAt";
alter table users rename column last_active to "lastActive";

-- challenges
alter table challenges rename column start_date to "startDate";
alter table challenges rename column end_date to "endDate";
alter table challenges rename column join_by to "joinBy";
alter table challenges rename column created_by to "createdBy";
alter table challenges rename column participant_count to "participantCount";
alter table challenges rename column group_id to "groupId";

-- challenge_actions
alter table challenge_actions rename column challenge_id to "challengeId";
alter table challenge_actions rename column action_id to "actionId";

-- challenge_participants
alter table challenge_participants rename column challenge_id to "challengeId";
alter table challenge_participants rename column user_id to "userId";

-- templates
alter table templates rename column created_by to "createdBy";
alter table templates rename column created_at to "createdAt";
alter table templates rename column join_by to "joinBy";
alter table templates rename column participant_group to "participantGroup";

-- presets
alter table presets rename column created_at to "createdAt";

-- preset_actions
alter table preset_actions rename column preset_id to "presetId";

-- participation
alter table participation rename column user_id to "userId";
alter table participation rename column challenge_id to "challengeId";
alter table participation rename column action_id to "actionId";
alter table participation rename column completed_at to "completedAt";
alter table participation rename column photo_url to "photoUrl";

-- activity_logs
alter table activity_logs rename column user_id to "userId";
