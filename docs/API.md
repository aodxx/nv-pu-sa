# API Specification

**Project:** นางฟ้า · แกลเลอรี่ครีเอเตอร์ X  
**Base URL:** `/api` (Cloudflare Pages Functions)  
**Last Updated:** 2026-09-21

---

## 1. Conventions

- Format: JSON
- Auth สำหรับ Admin: Header `Authorization: Bearer <token>` หรือ `X-Admin-Secret: <password>`
- Error format:
  ```json
  { "error": "message", "code": "ERROR_CODE" }
  ```
- HTTP Status: 200, 201, 400, 401, 403, 404, 500

---

## 2. Public Endpoints

### 2.1 List Creators
```
GET /api/creators
```

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | ค้นหา name / handle / bio |
| `filter` | string | `all` \| `hot` \| `verified` \| `top` \| `known` \| `new` |
| `sort` | string | `followers-desc` \| `followers-asc` \| `name-asc` \| `newest` |
| `limit` | number | default 50, max 200 |
| `offset` | number | default 0 |

**Response 200**
```json
{
  "total": 12,
  "count": 12,
  "creators": [
    {
      "id": 1,
      "name": "มินนี่",
      "handle": "minnie_th",
      "followers": 285000,
      "verified": true,
      "bio": "...",
      "avatar": "https://...",
      "links": {
        "x": "https://x.com/...",
        "onlyfans": "...",
        "telegram": null,
        "linktree": "..."
      },
      "tags": ["Top Creator", "NSFW"],
      "addedAt": "2026-08-15"
    }
  ]
}
```

### 2.2 Get Single Creator
```
GET /api/creators/:id
```
หรือ
```
GET /api/creators/by-handle/:handle
```

### 2.3 Random / Spotlight
```
GET /api/creators/random
```
คืนครีเอเตอร์ 1 คน (ไม่ hidden)

---

## 3. Admin Endpoints

**ทุก endpoint ต้องมี Auth**

### 3.1 Login / Get Token
```
POST /api/admin/auth
Body: { "password": "..." }
```
Response:
```json
{ "token": "eyJ...", "expiresIn": 3600 }
```

### 3.2 List All (รวม hidden)
```
GET /api/admin/creators
```

### 3.3 Create
```
POST /api/admin/creators
Body: {
  "name": "...",
  "handle": "...",
  "followers": 0,
  "verified": false,
  "bio": "...",
  "avatar": "...",
  "links": { ... },
  "tags": [ ... ],
  "notes": "..."
}
```

### 3.4 Update
```
PUT /api/admin/creators/:id
PATCH /api/admin/creators/:id
```

### 3.5 Soft Hide / Unhide
```
POST /api/admin/creators/:id/hide
POST /api/admin/creators/:id/unhide
```

### 3.6 Soft Delete / Restore
```
DELETE /api/admin/creators/:id          # soft delete
POST /api/admin/creators/:id/restore
```

### 3.7 Hard Delete (ระวัง)
```
DELETE /api/admin/creators/:id?hard=true
```

### 3.8 Stats Summary
```
GET /api/admin/stats
```
Response:
```json
{
  "total": 12,
  "visible": 11,
  "hidden": 1,
  "verified": 5,
  "verifiedPercent": 42,
  "maxFollowers": 421000,
  "topCreators": [ ... ]
}
```

### 3.9 Import / Export
```
GET /api/admin/export          → JSON download
POST /api/admin/import         → body = array of creators
```

---

## 4. Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | ไม่มี / token ผิด |
| `FORBIDDEN` | 403 | สิทธิ์ไม่พอ |
| `NOT_FOUND` | 404 | ไม่พบครีเอเตอร์ |
| `VALIDATION_ERROR` | 400 | ข้อมูลไม่ครบ / ผิดรูปแบบ |
| `DUPLICATE_HANDLE` | 400 | handle ซ้ำ |
| `INTERNAL` | 500 | ข้อผิดพลาดภายใน |

---

## 5. Implementation Notes (Pages Functions)

- ใช้ `env.DB` (D1 binding)
- ใช้ `env.ADMIN_PASSWORD` หรือ `env.ADMIN_SECRET`
- Parse query ด้วย `url.searchParams`
- ควรมี CORS headers ที่เหมาะสม

ตัวอย่าง skeleton:

```ts
// functions/api/creators.ts
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  // ... query D1
  return Response.json({ total, creators });
}
```

---

**Related**
- [DATABASE.md](./DATABASE.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
