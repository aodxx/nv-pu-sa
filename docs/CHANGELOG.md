# Changelog

รูปแบบตาม [Keep a Changelog](https://keepachangelog.com/)  
และ Semantic Versioning โดยประมาณ

---

## [Unreleased]

### Added
- Migration 0007: soft-hide demo seed creators (12 ราย dicebear)
- Admin: กรองตัวอย่าง, สถิติคลิก, ปุ่ม ↻ X (refresh จาก X API)
- `POST /api/admin/upload` สำหรับอัปโหลดรูปขึ้น R2 (binding AVATARS)
- `docs/OPS_PENDING.md` คำสั่ง migration ที่ต้องรันด้วยมือ



### Added
- Analytics Phase 2: `creator_events` + `POST /api/events/track`
- Gallery ส่ง beacon เมื่อเปิด modal / คลิกลิงก์ X, OnlyFans, Telegram, Linktree
- Admin stats แสดง eventsTotal, eventsToday, topClicked
- CI Cloudflare สำเร็จหลังตั้ง `CLOUDFLARE_API_TOKEN`



### Fixed
- ซิงก์ `data/creators.json` จาก production D1 (22 creators) สำหรับ GitHub Pages fallback
- ปรับ Cloudflare Actions workflow ให้แจ้ง error ชัดเมื่อขาด `CLOUDFLARE_API_TOKEN`

### Added (โดย owner บน main)
- ครีเอเตอร์ไทยจริงหลายราย + migrations 0003–0005
- Bulk import CSV/JSON ใน Admin (`/api/admin/creators/import`)
- Cloudflare D1 production + MAINTENANCE_GUIDE.md
- CI deploy Cloudflare Pages

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
