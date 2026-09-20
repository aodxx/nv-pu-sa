# Database Design

**Project:** นางฟ้า · แกลเลอรี่ครีเอเตอร์ X  
**Engine:** Cloudflare D1 (SQLite)  
**Last Updated:** 2026-09-21

---

## 1. Overview

ใช้ D1 เป็น primary database  
เป้าหมาย Phase 1: เก็บข้อมูลครีเอเตอร์ + การกระทำของ admin + สถิติพื้นฐาน

---

## 2. Schema (Phase 1)

### 2.1 Table: `creators`

```sql
CREATE TABLE creators (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  handle        TEXT NOT NULL UNIQUE,          -- @username โดยไม่ใส่ @
  followers     INTEGER NOT NULL DEFAULT 0,
  verified      INTEGER NOT NULL DEFAULT 0,   -- 0/1
  bio           TEXT,
  avatar_url    TEXT,
  banner_url    TEXT,
  links_json    TEXT,                         -- JSON: {x, onlyfans, telegram, linktree, ...}
  tags_json     TEXT,                         -- JSON array: ["Top Creator", "NSFW"]
  is_hidden     INTEGER NOT NULL DEFAULT 0,   -- soft hide
  is_deleted    INTEGER NOT NULL DEFAULT 0,   -- soft delete
  added_at      TEXT NOT NULL,                -- ISO date
  updated_at    TEXT NOT NULL,
  notes         TEXT                          -- admin private notes
);

CREATE INDEX idx_creators_followers ON creators(followers DESC);
CREATE INDEX idx_creators_handle ON creators(handle);
CREATE INDEX idx_creators_visible ON creators(is_hidden, is_deleted);
CREATE INDEX idx_creators_added ON creators(added_at DESC);
```

### 2.2 Table: `admin_actions` (optional Phase 1.5)

```sql
CREATE TABLE admin_actions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  action      TEXT NOT NULL,          -- create | update | hide | delete | restore
  creator_id  INTEGER,
  detail_json TEXT,
  created_at  TEXT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES creators(id)
);
```

### 2.3 Table: `stats_daily` (Phase 2)

```sql
CREATE TABLE stats_daily (
  date          TEXT PRIMARY KEY,     -- YYYY-MM-DD
  total_views   INTEGER DEFAULT 0,
  card_clicks   INTEGER DEFAULT 0,
  spotlight_views INTEGER DEFAULT 0,
  random_opens  INTEGER DEFAULT 0
);
```

---

## 3. Field Conventions

| Field | Type | Notes |
|-------|------|-------|
| `handle` | TEXT | เก็บโดยไม่มี `@` และ lowercase |
| `followers` | INTEGER | ตัวเลขจริง ไม่ใช่ string "285K" |
| `verified` | INTEGER | 0 = false, 1 = true |
| `links_json` | TEXT | `{"x":"...","onlyfans":"...","telegram":null,"linktree":"..."}` |
| `tags_json` | TEXT | `["Top Creator","NSFW"]` |
| `added_at` / `updated_at` | TEXT | ISO 8601 (`2026-09-21T03:00:00Z`) |

---

## 4. Seed Data

แปลงจาก `data/creators.json` ปัจจุบันเป็น INSERT statements  
เก็บไฟล์ seed ไว้ที่ `migrations/0001_seed.sql` หรือ script แยก

---

## 5. Migration Strategy

ใช้ sequential SQL files:

```
migrations/
├── 0001_init.sql          # CREATE TABLE creators
├── 0002_indexes.sql
├── 0003_admin_actions.sql
└── ...
```

รันด้วย:

```bash
wrangler d1 execute <DB_NAME> --file=./migrations/0001_init.sql
```

หรือใน CI / deploy script

---

## 6. Query Patterns (สำคัญ)

### Public list (ไม่แสดง hidden/deleted)
```sql
SELECT * FROM creators
WHERE is_hidden = 0 AND is_deleted = 0
ORDER BY followers DESC
LIMIT 100 OFFSET 0;
```

### Search
```sql
SELECT * FROM creators
WHERE is_hidden = 0 AND is_deleted = 0
  AND (name LIKE ? OR handle LIKE ? OR bio LIKE ?)
ORDER BY followers DESC;
```

### Filter examples
- Top (100K+): `followers >= 100000`
- Verified: `verified = 1`
- New (30 days): `added_at >= date('now', '-30 days')`

---

## 7. Future Considerations

- Full-text search ด้วย FTS5 (ถ้าต้องการค้นหา bio ลึก ๆ)
- Separate table สำหรับ tags ถ้าต้องการ query ซับซ้อน
- Soft delete เก็บไว้ก่อน ลบถาวรภายหลังด้วย retention policy

---

**Related**
- [API.md](./API.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
