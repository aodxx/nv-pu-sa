# Project Context

**Last Updated:** 2026-09-21 03:13 +07

---

## 1. What is this project?

**นางฟ้า · แกลเลอรี่ครีเอเตอร์ X**  
เวอร์ชันภาษาไทยของแพลตฟอร์มคัดสรรครีเอเตอร์บน X (Twitter)  
แรงบันดาลใจจาก https://nv-pu-sa.pages.dev/ (女菩萨 · X 博主精选画廊)

เป้าหมาย: ให้คนไทยค้นพบครีเอเตอร์คุณภาพได้ง่าย มีระบบคัดสรรและ admin

---

## 2. Current Status (as of 2026-09-21)

| Item | Status |
|------|--------|
| Static Gallery (HTML/CSS/JS) | ✅ Done |
| Sample data (12 creators) | ✅ Done |
| GitHub Repo | ✅ https://github.com/aodxx/nv-pu-sa |
| Documentation set | ✅ Done |
| Cloudflare D1 setup files | ✅ Done (wrangler + migrations) — ต้องสร้าง DB จริงด้วยบัญชี Cloudflare |
| Admin API (auth + CRUD + stats) | ✅ Done |
| Admin Console UI | ✅ Done (`/admin/`) |
| Public API (creators + random) | ✅ Done (ต้องมี D1 ถึงใช้งานได้) |
| X Sync | ❌ Future |

**Current branch:** `main`  
**Latest commit (before docs):** Initial static version

---

## 3. Important Decisions Already Made

- ใช้ Cloudflare ecosystem (Pages + D1)
- Phase 1 ไม่ใช้ heavy frontend framework
- Soft delete + soft hide
- Admin auth แบบ password ง่าย ๆ ก่อน
- ข้อมูล links/tags เก็บเป็น JSON text

ดูรายละเอียดใน `DECISIONS.md`

---

## 4. Immediate Next Steps

1. เสร็จสิ้นชุดเอกสาร (PRD, Architecture, DB, API, Agents, etc.)
2. สร้าง GitHub Issues สำหรับ backlog
3. เพิ่ม `wrangler.toml` + D1 schema
4. ~~สร้าง Pages Functions สำหรับ `/api/creators`~~ ✅
5. สร้างหน้า Admin พื้นฐาน / Admin CRUD

---

## 5. Key People / Roles

- **Owner / Curator:** aodxx
- **AI Agents:** ใช้เอกสารใน `docs/` และ `AGENTS.md` เป็นหลัก

---

## 6. Known Limitations (Current)

- ข้อมูลตัวอย่างเป็นข้อมูลสมมติ
- แก้ไขข้อมูลต้องแก้ JSON + redeploy
- ไม่มีระบบ auth
- ไม่มี analytics จริง
- ยังไม่มีระบบซิงก์จาก X

---

## 7. Reference Links

- Live original (Chinese): https://nv-pu-sa.pages.dev/
- This repo: https://github.com/aodxx/nv-pu-sa
- Cloudflare D1 docs: https://developers.cloudflare.com/d1/
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/

---

## 8. How to update this file

ทุกครั้งที่มี milestone สำเร็จหรือเปลี่ยนทิศทางสำคัญ ให้มาอัปเดตส่วน **Current Status** และ **Immediate Next Steps**
