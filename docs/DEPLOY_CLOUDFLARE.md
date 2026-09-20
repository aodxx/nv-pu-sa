# Deploy บน Cloudflare Pages (ระบบเต็ม)

ใช้สำหรับ: Gallery + **API** + **Admin** + **D1**

เอกสารนี้เป็น checklist ทีละขั้น

---

## สิ่งที่ต้องมี

- [ ] บัญชี [Cloudflare](https://dash.cloudflare.com/)
- [ ] Node.js 18+
- [ ] Repo บน GitHub: `aodxx/nv-pu-sa`
- [ ] ติดตั้ง wrangler: `npm install` ในโปรเจกต์

```bash
npm install
npx wrangler login
```

---

## ขั้นที่ 1 — สร้าง D1 Database

```bash
npx wrangler d1 create nv-pu-sa-db
```

คัดลอก `database_id` ที่ได้

เปิด `wrangler.toml` แก้:

```toml
[[d1_databases]]
binding = "DB"
database_name = "nv-pu-sa-db"
database_id = "วาง-id-จริงตรงนี้"
```

Commit + push การแก้ `database_id` (ไม่ใช่ secret)

---

## ขั้นที่ 2 — รัน Migration

**Local ทดสอบ:**

```bash
npm run db:migrate:local
npm run db:console:local
```

**Remote (production DB):**

```bash
npm run db:migrate:remote
# หรือ
npx wrangler d1 execute nv-pu-sa-db --remote --file=./migrations/0001_init.sql
npx wrangler d1 execute nv-pu-sa-db --remote --file=./migrations/0002_seed.sql
```

ควรเห็นครีเอเตอร์ 12 คน

---

## ขั้นที่ 3 — สร้าง Cloudflare Pages Project

### ทาง Dashboard (แนะนำครั้งแรก)

1. เข้า [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. **Create** → **Pages** → **Connect to Git**
3. เลือก repo `nv-pu-sa`
4. ตั้งค่า Build:
   - **Framework preset:** None
   - **Build command:** *(เว้นว่าง)*
   - **Build output directory:** `/` หรือ `.`
   - **Root directory:** `/`
5. **Environment variables / Secrets** ยังไม่ต้องใส่ตอนนี้
6. **Save and Deploy**

### ผูก D1 กับ Pages

1. เข้า Pages project → **Settings → Bindings**
2. **Add** → **D1 database**
   - Variable name: `DB`  (ต้องตรงกับ `binding` ใน wrangler.toml)
   - Database: `nv-pu-sa-db`
3. Save → **Redeploy** ครั้งล่าสุด

---

## ขั้นที่ 4 — ตั้ง ADMIN_PASSWORD

```bash
# ผูกกับ Pages project (ชื่อ project ต้องตรง)
npx wrangler pages secret put ADMIN_PASSWORD --project-name=nv-pu-sa
```

หรือใน Dashboard:  
Pages project → Settings → Environment variables → **Encrypted** →  
Name: `ADMIN_PASSWORD` → Value: รหัสของคุณ → Production

จากนั้น **Retry deployment**

---

## ขั้นที่ 5 — ทดสอบ

หลัง deploy ได้ URL แบบ:

`https://nv-pu-sa.pages.dev`  
(หรือ custom domain)

| URL | ผลที่ควรได้ |
|-----|----------------|
| `/` | Gallery |
| `/api/creators` | JSON รายการครีเอเตอร์ |
| `/api/creators/random` | สุ่ม 1 คน |
| `/admin/` | หน้า Login |
| Login แล้ว | ตาราง + CRUD |

ทดสอบ API เร็ว ๆ:

```bash
curl https://YOUR_SUBDOMAIN.pages.dev/api/creators | head

curl -X POST https://YOUR_SUBDOMAIN.pages.dev/api/admin/auth \
  -H 'Content-Type: application/json' \
  -d '{"password":"YOUR_PASSWORD"}'
```

---

## ขั้นที่ 6 — Deploy ครั้งถัดไป

- Push ไป `main` → Cloudflare เชื่อม Git จะ build ใหม่อัตโนมัติ  
- หรือมือ: `npx wrangler pages deploy . --project-name=nv-pu-sa`

---

## Checklist สรุป

- [ ] `wrangler d1 create nv-pu-sa-db`
- [ ] ใส่ `database_id` ใน `wrangler.toml` + push
- [ ] `db:migrate:remote`
- [ ] สร้าง Pages project เชื่อม Git
- [ ] Binding `DB` → D1
- [ ] Secret `ADMIN_PASSWORD`
- [ ] Redeploy
- [ ] ทดสอบ `/api/creators` และ `/admin/`

---

## ปัญหาที่พบบ่อย

| อาการ | แก้ |
|--------|-----|
| API ตอบ 503 D1_NOT_CONFIGURED | ยังไม่ผูก Binding ชื่อ `DB` หรือยังไม่ redeploy |
| Admin login 500 SERVER_MISCONFIGURED | ยังไม่มี secret `ADMIN_PASSWORD` |
| 401 หลัง login | token หมดอายุ (1 ชม.) หรือรหัสผิด |
| Gallery ยังเป็น JSON เก่า | ปกติถ้า API พัง — เปิด DevTools ดู network ของ `/api/creators` |
| Build ล้ม | ใช้ preset None, output `.` ไม่ต้องมี build command |

---

## เปรียบเทียบกับ GitHub Pages

| | GitHub Pages | Cloudflare Pages |
|--|--------------|------------------|
| Gallery static | ✅ | ✅ |
| D1 + API | ❌ | ✅ |
| Admin จริง | ❌ | ✅ |
| URL | `*.github.io/nv-pu-sa/` | `*.pages.dev` |

แนะนำ: ใช้ **Cloudflare เป็นของจริง**  
ใช้ GitHub Pages เป็น mirror ดูอย่างเดียวได้
