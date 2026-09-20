# Changelog

รูปแบบตาม [Keep a Changelog](https://keepachangelog.com/)  
และ Semantic Versioning โดยประมาณ

---

## [Unreleased]

### Added
- GitHub Actions deploy workflow (`.github/workflows/github-pages.yml`)
- docs/DEPLOY_CLOUDFLARE.md + DEPLOY_GITHUB_PAGES.md
- Relative paths สำหรับ GitHub project site (`/nv-pu-sa/`)
- Admin Console UI ที่ `/admin/`
  - Login ด้วย password
  - สถิติสรุป
  - ตารางครีเอเตอร์ + ค้นหา/กรอง
  - เพิ่ม / แก้ไข / ซ่อน / ลบ / กู้คืน
- Admin API (ข้อ 3–4)
  - `POST /api/admin/auth` — login รับ signed token
  - `GET/POST /api/admin/creators` — list / create
  - `GET/PUT/PATCH/DELETE /api/admin/creators/:id` — อ่าน แก้ soft-delete hide restore
  - `GET /api/admin/stats`
  - shared auth helper (`functions/_lib/auth.js`)
- Public API ครบตาม spec (ข้อ 2)
  - `GET /api/creators` รองรับ q, filter, sort, limit, offset
  - `GET /api/creators/random`
- Frontend โหลดจาก API ก่อน แล้ว fallback เป็น `data/creators.json`

### Added
- Cloudflare D1 foundation (ข้อ 1)
  - `wrangler.toml`
  - `migrations/0001_init.sql` (schema + indexes)
  - `migrations/0002_seed.sql` (12 sample creators)
  - `package.json` + npm scripts สำหรับ migrate / console
  - `docs/SETUP_D1.md` คู่มือ setup


---

## [0.1.0] - 2026-09-21

### Added
- Static site เวอร์ชันภาษาไทยครั้งแรก
- หน้า Gallery พร้อมค้นหา / กรอง / เรียง / Spotlight / Random
- ข้อมูลตัวอย่างครีเอเตอร์ 12 คน (`data/creators.json`)
- Dark theme + Responsive
- README เบื้องต้น
- Deploy ไปที่ GitHub repo `aodxx/nv-pu-sa`

---

## Versioning Guide

- **0.x.y** = Pre-release / development
- **1.0.0** = Public gallery + Admin CRUD + D1 พร้อมใช้งานจริง
- **1.x** = ปรับปรุงและเพิ่มฟีเจอร์ Phase 1
- **2.0.0** = มี X Sync / R2 / Analytics เต็มรูปแบบ
