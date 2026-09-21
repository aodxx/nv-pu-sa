# Project Context

**Last Updated:** 2026-09-21 07:40 +07

---

## 1. What is this project?

**นางฟ้า · แกลเลอรี่ครีเอเตอร์ X**  
เวอร์ชันภาษาไทยของแพลตฟอร์มคัดสรรครีเอเตอร์บน X (Twitter)

---

## 2. Current Status

| Item | Status |
|------|--------|
| Static Gallery | ✅ |
| GitHub Repo | ✅ https://github.com/aodxx/nv-pu-sa |
| Cloudflare D1 | ✅ |
| Public API | ✅ Live |
| Admin API + UI + Bulk import | ✅ Live |
| Analytics (click track) | ✅ โค้ดพร้อม — ต้องรัน migration 0006 |
| Real Thai creators | ✅ ~22 คน |
| GitHub Pages | ✅ https://aodxx.github.io/nv-pu-sa/ |
| Cloudflare Pages | ✅ https://nv-pu-sa-dh8.pages.dev |
| CI GitHub Pages | ✅ |
| CI Cloudflare | ✅ (มี CLOUDFLARE_API_TOKEN แล้ว) |
| X Sync | ❌ Future |
| R2 image cache | ❌ Future |

**Production:** https://nv-pu-sa-dh8.pages.dev  
**Admin:** https://nv-pu-sa-dh8.pages.dev/admin/

---

## 3. Immediate Next Steps

1. รัน `migrations/0006_analytics.sql` บน D1 remote (หรือรอ deploy + migrate)
2. ทดสอบ login Admin ด้วย ADMIN_PASSWORD
3. ตรวจ/จัดระเบียบรายชื่อครีเอเตอร์
4. (ต่อไป) X profile refresh / R2

---

## 4. Known Issues

- `nv-pu-sa.pages.dev` = โปรเจกต์จีนต้นฉบับ ไม่ใช่ของเรา
- ข้อมูล seed บางรายอาจปนกับครีเอเตอร์จริง — ควรตรวจผ่าน Admin
