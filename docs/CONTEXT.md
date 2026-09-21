# Project Context

**Last Updated:** 2026-09-21 07:15 +07

---

## 1. What is this project?

**นางฟ้า · แกลเลอรี่ครีเอเตอร์ X**  
เวอร์ชันภาษาไทยของแพลตฟอร์มคัดสรรครีเอเตอร์บน X (Twitter)  
แรงบันดาลใจจาก https://nv-pu-sa.pages.dev/ (女菩萨)

เป้าหมาย: ให้คนไทยค้นพบครีเอเตอร์คุณภาพได้ง่าย มีระบบคัดสรรและ admin

---

## 2. Current Status (as of 2026-09-21)

| Item | Status |
|------|--------|
| Static Gallery | ✅ |
| GitHub Repo | ✅ https://github.com/aodxx/nv-pu-sa |
| Documentation | ✅ |
| Cloudflare D1 | ✅ `nv-pu-sa-db` |
| Public API | ✅ Live |
| Admin API + UI | ✅ Live |
| Bulk import CSV/JSON | ✅ |
| Real Thai creators in D1 | ✅ ~22 คน |
| GitHub Pages (static) | ✅ https://aodxx.github.io/nv-pu-sa/ |
| Cloudflare Pages (full) | ✅ https://nv-pu-sa-dh8.pages.dev |
| CI: Deploy GitHub Pages | ✅ success |
| CI: Deploy Cloudflare | ⚠️ ล้มเมื่อขาด secret `CLOUDFLARE_API_TOKEN` (deploy ด้วย `npm run deploy` ได้) |
| X Sync | ❌ Future |
| R2 image cache | ❌ Future |
| Analytics | ❌ Future |

**Production URL:** https://nv-pu-sa-dh8.pages.dev  
**Admin:** https://nv-pu-sa-dh8.pages.dev/admin/  
**API:** https://nv-pu-sa-dh8.pages.dev/api/creators

---

## 3. Stack

- Frontend: HTML / CSS / Vanilla JS
- Backend: Cloudflare Pages Functions
- DB: Cloudflare D1
- Auth admin: HMAC token + `ADMIN_PASSWORD` secret
- CI: GitHub Actions (Pages + Cloudflare)

---

## 4. Immediate Next Steps

1. ตั้ง GitHub secret `CLOUDFLARE_API_TOKEN` เพื่อให้ CI deploy Cloudflare ผ่าน
2. ยืนยัน login Admin ได้ด้วยรหัสที่ตั้งไว้
3. เติม/ตรวจครีเอเตอร์จริงผ่าน Admin หรือ bulk import
4. (Phase 2) Analytics / R2 / X profile refresh

---

## 5. Known Issues

- Workflow Cloudflare fail เมื่อไม่มี `CLOUDFLARE_API_TOKEN`
- `data/creators.json` = fallback สำหรับ GitHub Pages — ข้อมูลจริงอยู่ที่ D1
- URL `nv-pu-sa.pages.dev` เป็นโปรเจกต์จีนต้นฉบับ **ไม่ใช่** ของเรา

---

## 6. Key files

| Path | Role |
|------|------|
| `wrangler.toml` | D1 binding + project name |
| `functions/api/*` | Public + Admin API |
| `admin/` | Admin Console |
| `migrations/` | D1 SQL |
| `MAINTENANCE_GUIDE.md` | คู่มือดูแล production |
