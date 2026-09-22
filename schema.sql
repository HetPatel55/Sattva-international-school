-- SATTVA website database (Cloudflare D1 / SQLite).
-- Safe to run more than once: every statement is IF NOT EXISTS.

-- Editable website content, one row per area (school, home, about, ...).
-- `draft` is what the admin is editing; `published` is what visitors see.
CREATE TABLE IF NOT EXISTS content (
  key          TEXT PRIMARY KEY,
  draft        TEXT NOT NULL,
  published    TEXT,
  updated_at   INTEGER NOT NULL,
  published_at INTEGER
);

-- Small key/value store (content_version, events_version, last_publish ...).
CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  start_date  TEXT,            -- YYYY-MM-DD
  end_date    TEXT,
  show_from   TEXT,            -- home page window; empty = from now
  show_until  TEXT,            -- empty = until the event ends
  cover       TEXT,            -- JSON image { key, src, thumb, w, h }
  published   INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS event_photos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id   INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image      TEXT NOT NULL,    -- JSON image { key, src, thumb, w, h }
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_event_photos_event ON event_photos (event_id, sort);

CREATE TABLE IF NOT EXISTS enquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  type       TEXT NOT NULL,    -- admission | general
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT NOT NULL DEFAULT '',
  child      TEXT NOT NULL DEFAULT '',
  standard   TEXT NOT NULL DEFAULT '',
  medium     TEXT NOT NULL DEFAULT '',
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'new',
  notes      TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);

-- Rate limiting for login attempts and form submissions.
CREATE TABLE IF NOT EXISTS hits (
  scope TEXT NOT NULL,
  ip    TEXT NOT NULL,
  at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_hits ON hits (scope, ip, at);
