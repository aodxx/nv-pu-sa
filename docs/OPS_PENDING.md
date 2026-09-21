# คำสั่งที่ต้องรันบนเครื่อง (สิทธิ์ D1)

Token CI ปัจจุบันมีแค่ Cloudflare Pages — **ไม่มีสิทธิ์ D1**  
จึงต้องรัน migration ด้วยบัญชีที่ login wrangler ได้

```bash
cd nv-pu-sa
npx wrangler login
npm run db:migrate:pending
```

หรือทีละไฟล์:

```bash
npx wrangler d1 execute nv-pu-sa-db --remote --file=./migrations/0006_analytics.sql
npx wrangler d1 execute nv-pu-sa-db --remote --file=./migrations/0007_hide_sample_seeds.sql
```

## ผลของ 0007

ซ่อน (soft-hide) ครีเอเตอร์ตัวอย่าง 12 คนจาก seed (dicebear)  
กู้คืนได้:

```sql
UPDATE creators SET is_hidden=0 WHERE notes LIKE '%sample_seed%';
```

## Secrets เพิ่ม (ถ้าใช้ฟีเจอร์เต็ม)

```bash
npx wrangler pages secret put ADMIN_PASSWORD --project-name=nv-pu-sa
npx wrangler pages secret put X_BEARER_TOKEN --project-name=nv-pu-sa   # สำหรับปุ่ม ↻ X
# R2: สร้าง bucket + ผูก binding AVATARS ใน Dashboard หรือ wrangler.toml
```

## ทดสอบ Admin

1. เปิด https://nv-pu-sa-dh8.pages.dev/admin/
2. ใส่รหัส ADMIN_PASSWORD ที่ตั้งไว้
3. ควรเห็นสถิติ + ตาราง + ปุ่ม ↻ X + กรอง "ตัวอย่าง"
