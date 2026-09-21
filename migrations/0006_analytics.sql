-- Click / view analytics
CREATE TABLE IF NOT EXISTS creator_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id  INTEGER NOT NULL,
  event_type  TEXT NOT NULL,  -- view | click_x | click_of | click_tg | click_lt | click_card
  created_at  TEXT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);

CREATE INDEX IF NOT EXISTS idx_events_creator ON creator_events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON creator_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON creator_events(created_at DESC);
