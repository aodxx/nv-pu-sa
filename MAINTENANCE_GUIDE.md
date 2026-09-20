# คู่มือดูแลโปรเจกต์ นางฟ้า · แกลเลอรี่ครีเอเตอร์ X

## 1. ภาพรวมระบบ

โปรเจกต์อยู่ที่ GitHub repository `https://github.com/aodxx/nv-pu-sa` และเผยแพร่บน Cloudflare Pages ชื่อโปรเจกต์ `nv-pu-sa` โดยใช้ Cloudflare D1 เป็นฐานข้อมูลสำหรับข้อมูลครีเอเตอร์และใช้ Pages Functions สำหรับ API/Admin

เว็บไซต์หลักคือ [https://nv-pu-sa-dh8.pages.dev](https://nv-pu-sa-dh8.pages.dev) ส่วน URL ที่มีรหัสนำหน้า เช่น `https://73e3c06a.nv-pu-sa-dh8.pages.dev` คือ URL ของ deployment รายครั้ง ใช้สำหรับตรวจเวอร์ชันเฉพาะได้ แต่ควรแจกจ่าย URL หลักเป็นหลัก

## 2. ทรัพยากร Cloudflare

| รายการ | ค่า |
|---|---|
| Cloudflare Pages project | `nv-pu-sa` |
| Cloudflare Account ID | `793f6dc7afb275fb3d03c869b1570a1a` |
| D1 database name | `nv-pu-sa-db` |
| D1 binding ในโค้ด | `DB` |
| D1 database ID | `e3e0d9a4-5afc-405b-9331-9cae0153106a` |
| Production URL | `https://nv-pu-sa-dh8.pages.dev` |

ค่าผูกฐานข้อมูลถูกเก็บไว้ใน `wrangler.toml` ภายใต้ `[[d1_databases]]` ห้ามเปลี่ยน `database_id` หากไม่ได้ตั้งใจย้ายฐานข้อมูล

## 3. URL ที่ใช้ตรวจระบบ

- เว็บไซต์: [https://nv-pu-sa-dh8.pages.dev](https://nv-pu-sa-dh8.pages.dev)
- Admin: [https://nv-pu-sa-dh8.pages.dev/admin/](https://nv-pu-sa-dh8.pages.dev/admin/)
- รายการครีเอเตอร์: [https://nv-pu-sa-dh8.pages.dev/api/creators](https://nv-pu-sa-dh8.pages.dev/api/creators)
- สุ่มครีเอเตอร์: [https://nv-pu-sa-dh8.pages.dev/api/creators/random](https://nv-pu-sa-dh8.pages.dev/api/creators/random)
- GitHub Actions: [https://github.com/aodxx/nv-pu-sa/actions](https://github.com/aodxx/nv-pu-sa/actions)

รหัสผ่าน Admin ถูกตั้งเป็น Cloudflare secret ชื่อ `ADMIN_PASSWORD` แล้ว ไม่ควรใส่รหัสผ่านลง Git หรือเขียนซ้ำในเอกสารนี้

## 4. วิธี deploy ที่ใช้งานได้ในปัจจุบัน

เครื่องมือ Wrangler เชื่อมต่อ Cloudflare ด้วย OAuth แล้ว และสามารถ deploy จากโฟลเดอร์โปรเจกต์ได้โดยตรง:

```bash
cd /home/ubuntu/nv-pu-sa
git pull origin main
npm install
npm run deploy
```

คำสั่ง `npm run deploy` เรียก `wrangler pages deploy .` และ deploy ไปยัง Pages project ที่กำหนดใน `wrangler.toml` หาก Wrangler ถามให้ล็อกอิน ให้รัน:

```bash
npx wrangler login
```

จากนั้นเปิดลิงก์ OAuth ที่แสดงใน terminal และอนุญาตบัญชี Cloudflare ที่ถูกต้อง

ตรวจสถานะ login ได้ด้วย:

```bash
npx wrangler whoami
```

หลัง deploy สำเร็จ Wrangler จะแสดง URL ของ deployment รายครั้ง ควรตรวจเว็บไซต์หลักต่อด้วย เพราะผู้ใช้ควรเข้า URL หลัก `https://nv-pu-sa-dh8.pages.dev`

## 5. การจัดการฐานข้อมูล D1

ไฟล์ migration อยู่ในโฟลเดอร์ `migrations/`:

- `0001_init.sql` สร้างตารางและโครงสร้างเริ่มต้น
- `0002_seed.sql` ใส่ข้อมูลครีเอเตอร์เริ่มต้น

คำสั่งที่มีใน `package.json`:

```bash
# ฐานข้อมูล local
npm run db:migrate:local

# ฐานข้อมูล production — ใช้ด้วยความระมัดระวัง
npm run db:migrate:remote

# ตรวจข้อมูล production
npm run db:console:remote
```

ก่อนรัน migration production ควรตรวจ SQL และสำรองหรือยืนยันผลกระทบก่อนเสมอ เพราะเป็นข้อมูลจริง

## 6. GitHub Actions

ไฟล์ `.github/workflows/deploy-cloudflare.yml` ถูกเพิ่มไว้เพื่อให้ push เข้า `main` แล้ว deploy อัตโนมัติ โดย workflow ใช้ secret:

```text
CLOUDFLARE_API_TOKEN
```

ในระหว่างการตั้งค่าพบว่า GitHub integration ของ session ไม่มีสิทธิ์สร้าง Actions Secret และ Cloudflare native Git integration ติด CAPTCHA ดังนั้นวิธีที่ใช้งานจริงและผ่านการตรวจสอบแล้วคือ **manual deploy ด้วย Wrangler OAuth** ตามหัวข้อ 4

หากต้องการเปิด auto deploy ในอนาคต ให้สร้าง Cloudflare API Token ใหม่แบบจำกัดสิทธิ์เฉพาะ account นี้ โดยใช้สิทธิ์อย่างน้อย:

- `Account: Read`
- `Pages: Edit`

จากนั้นเพิ่มที่ GitHub repository settings > Secrets and variables > Actions ด้วยชื่อ `CLOUDFLARE_API_TOKEN` ห้ามใช้ GitHub token ที่ขึ้นต้นด้วย `ghp_` และห้ามส่ง token ผ่านแชต

ใน repository ยังมี `.github/workflows/github-pages.yml` สำหรับ GitHub Pages ซึ่งเป็น static mirror เท่านั้น หากไม่ต้องการ deploy สองที่ สามารถปิด workflow ใน GitHub Actions หรือถอดไฟล์นี้ออกภายหลังได้ โดยไม่กระทบ Cloudflare Pages

## 7. ขั้นตอนดูแลเมื่อแก้โค้ด

ขั้นตอนปกติ:

```bash
cd /home/ubuntu/nv-pu-sa
git pull origin main
# แก้ไขโค้ด
npm install
npm run deploy
```

ถ้าการแก้ไขควรเก็บใน GitHub ให้ commit และ push ก่อนหรือหลัง deployตาม workflow ที่ต้องการ:

```bash
git add .
git commit -m "อธิบายการแก้ไขสั้น ๆ"
git push origin main
```

หลัง deploy ตรวจอย่างน้อย 3 จุด:

```bash
curl -I https://nv-pu-sa-dh8.pages.dev/
curl -I https://nv-pu-sa-dh8.pages.dev/api/creators
curl -I https://nv-pu-sa-dh8.pages.dev/admin/
```

ควรได้ HTTP `200` ทั้งสามรายการ

## 8. การแก้ปัญหาเบื้องต้น

| อาการ | แนวทางตรวจ |
|---|---|
| `wrangler whoami` ไม่ผ่าน | รัน `npx wrangler login` ใหม่ |
| Deploy สำเร็จแต่เว็บไม่เปลี่ยน | ตรวจว่า deploy ไป project `nv-pu-sa` และลอง refresh แบบไม่ใช้ cache |
| API error หรือข้อมูลหาย | ตรวจ D1 binding `DB` และ `database_id` ใน `wrangler.toml` |
| Admin เข้าไม่ได้ | ตรวจว่า Cloudflare secret `ADMIN_PASSWORD` ยังอยู่ อย่าใส่ค่าใน Git |
| GitHub Actions ล้มเหลว | ตรวจว่ามี `CLOUDFLARE_API_TOKEN` และ token มี `Pages: Edit` |
| มี URL ใหม่เป็นรหัสยาว | เป็น deployment URL รายครั้ง ไม่ใช่ URL หลัก ให้ใช้ `nv-pu-sa-dh8.pages.dev` |

## 9. ความปลอดภัย

Token ที่เคยแสดงในภาพหรือแชตถือว่าถูกเปิดเผยแล้ว ควร revoke และสร้างใหม่โดยจำกัดสิทธิ์ ไม่ควรเก็บ token, รหัสผ่าน Admin หรือค่า secret ในไฟล์ที่ commit เข้า GitHub หากสงสัยว่า credential รั่ว ให้ revoke ทันที แล้ว deploy ใหม่เฉพาะเมื่อระบบต้องการ

## 10. สถานะล่าสุด

การ deploy ล่าสุดผ่าน Wrangler สำเร็จ และได้ deployment URL `https://73e3c06a.nv-pu-sa-dh8.pages.dev` เว็บไซต์หลักยังคงใช้ `https://nv-pu-sa-dh8.pages.dev` ได้ตามปกติ

## 11. Bulk Import จากหน้า Admin

หน้า Admin รองรับปุ่ม **นำเข้า CSV/JSON** สำหรับเพิ่มครีเอเตอร์หลายรายการพร้อมกัน สูงสุด 250 รายการต่อครั้ง ระบบจะแสดง Preview ก่อนบันทึก ตรวจ `name`, `handle`, `followers` และ handle ซ้ำในไฟล์ หากพบ handle ที่มีอยู่ในฐานข้อมูล ระบบจะข้ามรายการนั้นโดยไม่สร้างข้อมูลซ้ำ

ตัวอย่าง JSON:

```json
[
  {
    "name": "ชื่อครีเอเตอร์",
    "handle": "creator_handle",
    "followers": 250000,
    "verified": false,
    "bio": "คำอธิบายสั้น ๆ",
    "avatar": "https://example.com/avatar.jpg",
    "links": {
      "x": "https://x.com/creator_handle",
      "instagram": "https://instagram.com/creator_handle"
    },
    "tags": ["18+", "Thailand"],
    "notes": "แหล่งข้อมูลและวันที่ตรวจสอบ"
  }
]
```

ตัวอย่าง CSV:

```csv
name,handle,followers,verified,bio,avatar,x_url,instagram_url,tags,notes
ชื่อครีเอเตอร์,creator_handle,250000,0,คำอธิบาย,https://example.com/avatar.jpg,https://x.com/creator_handle,https://instagram.com/creator_handle,"18+|Thailand",แหล่งข้อมูล
```

`avatar` เป็น URL รูปภาพที่ใช้งานได้ หากไม่ใส่ ระบบจะสร้างภาพอวตารสำรองจาก DiceBear ตาม handle ให้โดยอัตโนมัติ ควรใช้ภาพที่เจ้าของบัญชีเผยแพร่สาธารณะหรือภาพที่มีสิทธิ์ใช้งาน และไม่ควรคัดลอกภาพส่วนตัวหรือภาพที่มีข้อจำกัดด้านลิขสิทธิ์

ขั้นตอนใช้งานคือเข้าสู่ `/admin/` → กด **นำเข้า CSV/JSON** → เลือกไฟล์หรือวางข้อมูล → กด **ตรวจข้อมูล** → ตรวจ Preview → กด **นำเข้า** → กดรีเฟรชตาราง

ข้อมูลถูกส่งผ่าน endpoint ที่ต้องมี Admin token: `POST /api/admin/creators/import` และระบบจำกัด batch สูงสุด 250 รายการเพื่อป้องกัน request ใหญ่เกินไป
