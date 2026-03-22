-- PoliCard Database Schema

CREATE TYPE vote_position AS ENUM ('Yea', 'Nay', 'Absent');

-- Core politician record, keyed by name slug (e.g. 'bernie-sanders')
CREATE TABLE politicians (
  id                TEXT        PRIMARY KEY,
  name              TEXT        NOT NULL,
  summary           TEXT        NOT NULL,
  ideology_score    FLOAT,
  ideology_source   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Voting record entries, replaced wholesale on each ingestion run
CREATE TABLE politician_votes (
  vote_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  politician_id  TEXT        NOT NULL REFERENCES politicians(id) ON DELETE CASCADE,
  bill           TEXT        NOT NULL,
  date           TEXT        NOT NULL,
  position       vote_position NOT NULL,
  summary        TEXT        NOT NULL
);

-- News items, replaced wholesale on each ingestion run
CREATE TABLE politician_news (
  news_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  politician_id  TEXT        NOT NULL REFERENCES politicians(id) ON DELETE CASCADE,
  title          TEXT        NOT NULL,
  source         TEXT        NOT NULL,
  url            TEXT        NOT NULL,
  published_at   TEXT        NOT NULL,
  summary        TEXT        NOT NULL
);

CREATE INDEX ON politician_votes (politician_id);
CREATE INDEX ON politician_news (politician_id);
