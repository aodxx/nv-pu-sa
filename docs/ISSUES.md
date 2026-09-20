# GitHub Issues Backlog (แนะนำ)

สร้าง Issues เหล่านี้ใน GitHub ตามลำดับความสำคัญ  
(หรือใช้ไฟล์นี้เป็น checklist ชั่วคราว)

---

## Milestone: M1 – Documentation & Planning
- [x] สร้างชุดเอกสาร PRD / Architecture / DB / API / Agents / Decisions / Context / Changelog
- [ ] สร้าง Issue templates
- [ ] ตั้ง Labels: `enhancement`, `bug`, `task`, `phase-1`, `phase-2`, `docs`, `good-first-issue`

---

## Milestone: M2 – Database & Admin Foundation

### Issue: Setup Cloudflare D1 + wrangler
**Labels:** `task`, `phase-1`  
**Description:**  
- เพิ่ม `wrangler.toml`  
- สร้าง D1 database  
- เขียน migration `0001_init.sql` ตาม DATABASE.md  
- Seed ข้อมูลจาก `creators.json`

### Issue: สร้าง Admin Auth endpoint พื้นฐาน
**Labels:** `enhancement`, `phase-1`  
**Description:**  
- `POST /api/admin/auth`  
- ใช้ `ADMIN_PASSWORD` จาก secrets  
- คืน token ชั่วคราว

### Issue: Admin CRUD Creators (API)
**Labels:** `enhancement`, `phase-1`  
**Description:**  
Implement ตาม API.md:
- GET /api/admin/creators
- POST /api/admin/creators
- PUT/PATCH /api/admin/creators/:id
- Soft hide / delete / restore

### Issue: หน้า Admin Console (UI พื้นฐาน)
**Labels:** `enhancement`, `phase-1`  
**Description:**  
- หน้า `/admin`  
- Login form  
- ตารางรายการครีเอเตอร์  
- ฟอร์มเพิ่ม/แก้ไข

---

## Milestone: M3 – Public API เชื่อม D1

### Issue: Public GET /api/creators
**Labels:** `enhancement`, `phase-1`  
รองรับ filter, sort, search, pagination

### Issue: เปลี่ยน Frontend จาก JSON ไฟล์ → เรียก API
**Labels:** `enhancement`, `phase-1`  
แก้ `js/app.js` ให้ fetch จาก `/api/creators` แทน `data/creators.json`

### Issue: Random / Spotlight endpoint
**Labels:** `enhancement`, `phase-1`

---

## Milestone: M4 – Polish & Stats

### Issue: Soft delete + Hide ใน Admin UI
### Issue: Stats summary endpoint + แสดงใน Admin
### Issue: Import / Export JSON
### Issue: Loading / Empty / Error states ปรับปรุง

---

## Phase 2 (Future)

- X Sync engine (cookies / GraphQL)
- Cloudflare R2 สำหรับรูป
- Analytics dashboard
- NSFW level filter
- Multi-admin roles

---

## วิธีสร้าง Issue จริงบน GitHub

1. ไปที่ https://github.com/aodxx/nv-pu-sa/issues/new/choose  
2. เลือก template  
3. หรือสร้างจากรายการด้านบนทีละอัน

สามารถใช้ GitHub CLI ได้ถ้ามี:
```bash
gh issue create --title "feat: Setup Cloudflare D1 + wrangler" --body "..." --label "task,phase-1"
```
