# Setup Cloudflare D1 (ข้อ 1)

คู่มือสั้น ๆ สำหรับสร้าง database และรัน migration

---

## สิ่งที่ต้องมี

1. บัญชี [Cloudflare](https://dash.cloudflare.com/)
2. ติดตั้ง Node.js 18+
3. Login wrangler แล้ว

```bash
npm install
npx wrangler login
```

---

## ขั้นตอน

### 1. สร้าง D1 Database

```bash
npm run db:create
# หรือ
npx wrangler d1 create nv-pu-sa-db
```

คำสั่งจะคืนค่าประมาณนี้:

```
[[d1_databases]]
binding = "DB"
database_name = "nv-pu-sa-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. ใส่ database_id ลงใน wrangler.toml

เปิดไฟล์ `wrangler.toml` แล้วแทนที่:

```toml
database_id = "REPLACE_WITH_YOUR_D1_DATABASE_ID"
```

ด้วยค่าจริงที่ได้จากขั้นตอนที่ 1

### 3. รัน Migration (Local ก่อน)

```bash
npm run db:migrate:local
```

ตรวจสอบ:

```bash
npm run db:console:local
```

ควรเห็นครีเอเตอร์ 12 คนเรียงตาม followers

### 4. รัน Migration (Remote / Production)

```bash
npm run db:migrate:remote
```

### 5. ตั้ง Secret (สำหรับ Admin ภายหลัง)

```bash
npx wrangler pages secret put ADMIN_PASSWORD
# พิมพ์รหัสผ่านที่ต้องการ
```

---

## โครงสร้างที่เกี่ยวข้อง

```
wrangler.toml
migrations/
  0001_init.sql    # schema + indexes
  0002_seed.sql    # ข้อมูลตัวอย่าง 12 คน
package.json       # scripts สะดวก
```

---

## ปัญหาที่พบบ่อย

| ปัญหา | วิธีแก้ |
|--------|---------|
| `database_id` ยังเป็น REPLACE_... | ต้องสร้าง DB แล้วใส่ id จริง |
| Permission denied | รัน `wrangler login` ใหม่ |
| Table already exists | ใช้ `IF NOT EXISTS` แล้ว (ปลอดภัย) หรือลบ DB แล้วสร้างใหม่ |
| Seed ซ้ำ | ใช้ `INSERT OR IGNORE` แล้ว |

---

## ขั้นตอนถัดไปหลัง Setup นี้เสร็จ

→ สร้าง Public API `GET /api/creators` (ข้อ 2)
