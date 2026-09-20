# นางฟ้า · แกลเลอรี่ครีเอเตอร์ X

เวอร์ชันภาษาไทยของแพลตฟอร์มคัดสรรครีเอเตอร์บน X (Twitter)  
คล้าย [nv-pu-sa.pages.dev](https://nv-pu-sa.pages.dev/) แต่ปรับให้เหมาะกับคนไทย

## ฟีเจอร์

- แกลเลอรี่ครีเอเตอร์แบบการ์ดสวย
- ค้นหาชื่อ / @handle / Bio
- กรองตาม: ทั้งหมด, ความนิยม, ยืนยันตัวตน, Top 100K+, รู้จัก 10K+, ใหม่ล่าสุด
- เรียงลำดับหลายแบบ
- Spotlight แนะนำสุ่ม
- ปุ่มสุ่มสำรวจ (กด `R` หรือปุ่ม)
- ธีมมืดสวยงาม
- Responsive รองรับมือถือ

## โครงสร้างโปรเจกต์

```
nv-pu-sa-th/
├── index.html          # หน้าหลัก
├── css/
│   └── style.css       # สไตล์ทั้งหมด
├── js/
│   └── app.js          # ตรรกะทั้งหมด
├── data/
│   └── creators.json   # ข้อมูลครีเอเตอร์ (แก้ไขได้ง่าย)
├── assets/             # รูปภาพเพิ่มเติม (ถ้ามี)
└── README.md
```

## วิธีรัน

### แบบง่าย (Local)

เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ได้เลย  
หรือใช้ live server:

```bash
npx serve .
# หรือ
python -m http.server 3000
```

### Deploy บน Cloudflare Pages (แนะนำ)

1. ไปที่ [Cloudflare Pages](https://pages.cloudflare.com/)
2. Create project → เชื่อม GitHub repo นี้
3. Build settings:
   - Framework preset: **None**
   - Build command: *(เว้นว่าง)*
   - Output directory: `/` (หรือ `.`)
4. Deploy → ได้ URL แบบ `xxx.pages.dev`

### Deploy บน GitHub Pages

1. ไปที่ Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / folder: `/ (root)`
4. Save

## วิธีเพิ่มครีเอเตอร์

แก้ไขไฟล์ `data/creators.json` เพิ่ม object ตามรูปแบบนี้:

```json
{
  "id": 13,
  "name": "ชื่อที่แสดง",
  "handle": "username_บน_x",
  "followers": 50000,
  "verified": false,
  "bio": "คำอธิบายสั้น ๆ",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=ชื่ออะไรก็ได้",
  "banner": null,
  "links": {
    "x": "https://x.com/username",
    "onlyfans": "https://onlyfans.com/xxx",
    "telegram": "https://t.me/xxx",
    "linktree": "https://linktr.ee/xxx"
  },
  "tags": ["Top Creator", "NSFW"],
  "addedAt": "2026-09-20"
}
```

- `avatar` สามารถใช้ URL รูปจริง หรือ DiceBear
- `tags` ที่รองรับ: `"Top Creator"`, `"NSFW"`, `"Cosplay"`, `"Known"`, `"New"`
- `verified`: `true` ถ้าเป็นบัญชีที่ยืนยันตัวตนบน X

## หมายเหตุ

- ข้อมูลตัวอย่างเป็นข้อมูลสมมติเพื่อสาธิต
- คุณควรแทนที่ด้วยครีเอเตอร์จริงที่คุณคัดสรรเอง
- โปรเจกต์นี้เป็น Static Site 100% ไม่มี backend

## License

MIT — ใช้ได้อิสระ
