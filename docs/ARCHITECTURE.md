# Architecture

**Project:** นางฟ้า · แกลเลอรี่ครีเอเตอร์ X  
**Last Updated:** 2026-09-21

---

## 1. High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Users / Browsers                      │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────┐
│                   Cloudflare Pages                           │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │  Static Assets      │    │  Pages Functions (API)      │ │
│  │  index.html, css,   │    │  /api/creators              │ │
│  │  js, assets         │    │  /api/admin/*               │ │
│  └─────────────────────┘    └──────────────┬──────────────┘ │
└────────────────────────────────────────────┼────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐     ┌─────────▼─────────┐   ┌──────────▼─────────┐
           │  Cloudflare D1  │     │ Cloudflare R2     │   │ Cloudflare KV      │
           │  (SQLite)       │     │ (Images / Backup) │   │ (Cache / Sessions) │
           │  creators,      │     │  Optional Phase 2 │   │  Optional          │
           │  stats, admin   │     │                   │   │                    │
           └─────────────────┘     └───────────────────┘   └────────────────────┘
```

---

## 2. Current State (M0 – Static)

- Pure static site
- Data: `data/creators.json`
- Logic: client-side only (`js/app.js`)
- Deploy: Cloudflare Pages / GitHub Pages

**Limitations:**
- แก้ไขข้อมูลต้องแก้ไฟล์ + redeploy
- ไม่มี auth / admin
- ไม่มี analytics จริง
- ไม่ scale การจัดการข้อมูล

---

## 3. Target Architecture (Phase 1)

### 3.1 Frontend
- Single Page (หรือ multi-page เล็กน้อย)
- Vanilla JS + Tailwind หรือ CSS ที่มีอยู่
- ดึงข้อมูลจาก `/api/creators`
- Admin แยก path `/admin` (protected)

### 3.2 Backend (Pages Functions)
- `functions/api/creators.ts` → public list + filters
- `functions/api/admin/creators.ts` → CRUD
- `functions/api/admin/auth.ts` → simple password / JWT-like token
- ใช้ D1 binding

### 3.3 Database
ดู `DATABASE.md`

### 3.4 Auth (Phase 1 – Simple)
- Admin password เก็บใน Cloudflare Secret (`ADMIN_PASSWORD`)
- Session token สั้น ๆ เก็บใน cookie หรือ localStorage + server verify
- ไม่ใช้ OAuth ใน Phase 1

### 3.5 Storage
- รูป avatar: ใช้ URL ภายนอก (DiceBear / X CDN) ก่อน
- Phase 2: mirror ไป R2

---

## 4. Directory Structure (Target)

```
nv-pu-sa/
├── index.html                 # Public gallery
├── admin/
│   └── index.html             # Admin console
├── css/
├── js/
│   ├── app.js                 # Public
│   └── admin.js               # Admin
├── functions/                 # Cloudflare Pages Functions
│   └── api/
│       ├── creators.ts
│       └── admin/
│           ├── creators.ts
│           └── auth.ts
├── data/                      # seed / migration helpers
├── docs/                      # เอกสารทั้งหมด
├── migrations/                # D1 SQL migrations
├── wrangler.toml
├── package.json
├── README.md
└── ...
```

---

## 5. Data Flow

### Public Read
```
Browser → GET /api/creators?filter=...&q=... 
       → Pages Function 
       → D1 SELECT 
       → JSON response
```

### Admin Write
```
Browser (Admin) → POST /api/admin/creators (with auth header)
               → Verify secret/token
               → D1 INSERT/UPDATE/DELETE
               → Response
```

---

## 6. Security Considerations

- Admin endpoints ต้องตรวจสอบ Authorization header หรือ cookie
- ใช้ Cloudflare Secrets สำหรับ password / tokens
- Rate limit พื้นฐานบน Functions
- ไม่ expose raw SQL error ไป client
- CORS จำกัดเฉพาะ domain ของตัวเอง

---

## 7. Deployment

1. `wrangler pages project create ...` (ถ้ายังไม่มี)
2. เชื่อม GitHub repo
3. ตั้ง D1 database + binding ใน `wrangler.toml`
4. ตั้ง Secrets: `ADMIN_PASSWORD`
5. Deploy ผ่าน Git push หรือ `wrangler pages deploy`

---

## 8. Evolution Path

| Phase | Key Change |
|-------|------------|
| M0 | Static JSON |
| M1 | Docs + Planning |
| M2 | D1 + Functions + Admin CRUD |
| M3 | Public API เชื่อม D1 |
| M4 | Auth + Soft delete + Stats |
| Phase 2 | R2 images, X sync engine, Analytics dashboard |

---

**ดูเพิ่มเติม**
- [DATABASE.md](./DATABASE.md)
- [API.md](./API.md)
- [DECISIONS.md](./DECISIONS.md)
