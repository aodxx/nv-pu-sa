-- Migration 0001: Initial schema for นางฟ้า
-- Run: wrangler d1 execute nv-pu-sa-db --file=./migrations/0001_init.sql
-- Local: wrangler d1 execute nv-pu-sa-db --local --file=./migrations/0001_init.sql

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS creators (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  handle        TEXT NOT NULL UNIQUE,
  followers     INTEGER NOT NULL DEFAULT 0,
  verified      INTEGER NOT NULL DEFAULT 0,
  bio           TEXT,
  avatar_url    TEXT,
  banner_url    TEXT,
  links_json    TEXT,
  tags_json     TEXT,
  is_hidden     INTEGER NOT NULL DEFAULT 0,
  is_deleted    INTEGER NOT NULL DEFAULT 0,
  added_at      TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  notes         TEXT
);

CREATE INDEX IF NOT EXISTS idx_creators_followers ON creators(followers DESC);
CREATE INDEX IF NOT EXISTS idx_creators_handle ON creators(handle);
CREATE INDEX IF NOT EXISTS idx_creators_visible ON creators(is_hidden, is_deleted);
CREATE INDEX IF NOT EXISTS idx_creators_added ON creators(added_at DESC);

-- Optional audit log (Phase 1.5)
CREATE TABLE IF NOT EXISTS admin_actions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  action      TEXT NOT NULL,
  creator_id  INTEGER,
  detail_json TEXT,
  created_at  TEXT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_actions_created ON admin_actions(created_at DESC);
