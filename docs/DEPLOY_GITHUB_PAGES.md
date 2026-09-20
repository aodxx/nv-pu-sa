# Deploy บน GitHub Pages (Static เท่านั้น)

URL ตัวอย่าง: `https://aodxx.github.io/nv-pu-sa/`

## สิ่งที่ได้ / ไม่ได้

| ได้ | ไม่ได้ |
|-----|--------|
| หน้า Gallery | API (`/api/*`) |
| ข้อมูลจาก `data/creators.json` | Admin ที่เชื่อม D1 |
| ค้นหา / กรอง ฝั่ง client | Cloudflare Functions |

สำหรับระบบเต็ม (API + Admin + D1) ใช้ **Cloudflare Pages** → [DEPLOY_CLOUDFLARE.md](./DEPLOY_CLOUDFLARE.md)

---

## วิธีที่ 1: GitHub Actions (แนะนำ — ติดตั้งใน repo แล้ว)

1. ไปที่ **Settings → Pages**
2. **Source** เลือก **GitHub Actions**
3. เปิด tab **Actions** ของ repo → workflow **Deploy GitHub Pages**
4. ถ้ายังไม่รัน: **Actions → Deploy GitHub Pages → Run workflow**
5. รอจน job เขียว แล้วเปิด  
   https://aodxx.github.io/nv-pu-sa/

ทุกครั้งที่ `git push` ไป `main` จะ deploy ใหม่อัตโนมัติ

---

## วิธีที่ 2: Deploy from a branch (ไม่ใช้ Actions)

1. **Settings → Pages**
2. Source = **Deploy from a branch**
3. Branch = **main** , folder = **/ (root)**
4. Save
5. รอ 1–3 นาที แล้ว hard refresh (Ctrl+Shift+R)

---

## แก้ปัญหาไม่อัปเดต

1. ดูว่า commit ล่าสุดอยู่บน `main` แล้ว
2. ไปที่ **Actions** มี workflow เขียวหรือยัง
3. Settings → Pages ดู **Source** ว่าเป็น Actions หรือ branch `main`
4. ลองเปิดแบบไม่ cache:  
   `https://aodxx.github.io/nv-pu-sa/?v=2`
5. ตรวจใน DevTools → Network ว่า `js/app.js` เป็นไฟล์ใหม่หรือยัง

---

## หมายเหตุ path

โปรเจกต์ใช้ **relative path** แล้ว เพื่อให้ทำงานภายใต้ `/nv-pu-sa/` ได้  
(เช่น `admin/`, `api/...`, `data/creators.json`)
