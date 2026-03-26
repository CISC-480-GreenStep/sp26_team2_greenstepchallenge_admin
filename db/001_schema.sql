-- GreenStep Sustainability Challenge - PostgreSQL Schema

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_status AS ENUM ('Active', 'Deactivated');
CREATE TYPE challenge_status AS ENUM ('Active', 'Upcoming', 'Completed', 'Archived');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE user_roles (
  id            SERIAL PRIMARY KEY,
  role_type     VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  first_name    VARCHAR(255) NOT NULL,
  last_name     VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  username      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id       INTEGER NOT NULL REFERENCES user_roles(id) ON DELETE RESTRICT,
  status        user_status NOT NULL DEFAULT 'Active',
  date_joined   DATE NOT NULL DEFAULT CURRENT_DATE,
  last_active   TIMESTAMP
);

CREATE TABLE categories (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL UNIQUE,
  description   TEXT
);

CREATE TABLE actions (
  id            SERIAL PRIMARY KEY,
  category_id   INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  points        INTEGER NOT NULL DEFAULT 1,

  CONSTRAINT positive_points_actions CHECK (points > 0)
);

CREATE TABLE themes (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL UNIQUE,
  description   TEXT,
  bg_color_dark_1    VARCHAR(7) -- e.g., #RRGGBB
  bg_color_light_1    VARCHAR(7) -- e.g., #RRGGBB
  bg_color_dark_2    VARCHAR(7) -- e.g., #RRGGBB
  bg_color_light_2   VARCHAR(7) -- e.g., #RRGGB
  accent_color_1     VARCHAR(7) -- e.g., #RRGGBB
  accent_color_2     VARCHAR(7) -- e.g., #RRGGBB
  accent_color_3     VARCHAR(7) -- e.g., #RRGGBB
  accent_color_4     VARCHAR(7) -- e.g., #RRGGBB
  accent_color_5     VARCHAR(7) -- e.g., #RRGGBB
  accent_color_6     VARCHAR(7) -- e.g., #RRGGBB
  hyperlink_color     VARCHAR(7) -- e.g., #RRGGBB
  followed_hyperlink_color VARCHAR(7) -- e.g., #RRGGBB
  created_by        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE groups (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL UNIQUE,
  description   TEXT,
  created_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  member        INTEGER REFERENCES users(id) ON DELETE SET NULL,
);

CREATE TABLE templates (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(255) NOT NULL,
  description       TEXT,
  category_id       INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  theme_id          INTEGER NOT NULL REFERENCES themes(id) ON DELETE RESTRICT,
  created_by        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

CREATE TABLE challenges (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(255) NOT NULL,
  description       TEXT,
  category_id       INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  theme_id          INTEGER NOT NULL REFERENCES themes(id) ON DELETE RESTRICT,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  start_time        TIME,
  end_time          TIME,
  status            challenge_status NOT NULL DEFAULT 'Upcoming',
  created_by        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  participant_count INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);



CREATE TABLE participation (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id  INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  action_id     INTEGER NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  completed_at  DATE NOT NULL DEFAULT CURRENT_DATE,
  notes         TEXT,
  photo_url     TEXT
);

CREATE TABLE activity_logs (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type   VARCHAR(255) NOT NULL,
  timestamp     TIMESTAMP NOT NULL DEFAULT NOW(),
  details       TEXT
);

CREATE TABLE reports (
  id            SERIAL PRIMARY KEY,
  challenge_id  INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  generated_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  generated_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  title         VARCHAR(255),
  filters       JSONB,
  file_url      TEXT
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_status ON users(status);

-- Challenges
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_category ON challenges(category_id);
CREATE INDEX idx_challenges_created_by ON challenges(created_by);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);

-- Actions
CREATE INDEX idx_actions_challenge ON actions(challenge_id);
CREATE INDEX idx_actions_category ON actions(category_id);

-- Participation
CREATE INDEX idx_participation_user ON participation(user_id);
CREATE INDEX idx_participation_challenge ON participation(challenge_id);
CREATE INDEX idx_participation_action ON participation(action_id);
CREATE INDEX idx_participation_completed ON participation(completed_at);

-- Activity Logs
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp);

-- Reports
CREATE INDEX idx_reports_challenge ON reports(challenge_id);
CREATE INDEX idx_reports_generated_by ON reports(generated_by);
