# นางฟ้า · แกลเลอรี่ครีเอเตอร์ X

เวอร์ชันภาษาไทยของแพลตฟอร์มคัดสรรครีเอเตอร์บน X (Twitter)  
แรงบันดาลใจจาก [nv-pu-sa.pages.dev](https://nv-pu-sa.pages.dev/)

> **สถานะปัจจุบัน:** Static Gallery (v0.1.0) → กำลังพัฒนาเป็นระบบเต็มรูปแบบ (D1 + Admin + API)

---

## Quick Links

| เอกสาร | คำอธิบาย |
|--------|----------|
| [PRD.md](docs/PRD.md) | Product Requirements |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | สถาปัตยกรรมระบบ |
| [DATABASE.md](docs/DATABASE.md) | Schema & Migrations |
| [API.md](docs/API.md) | API Specification |
| [AGENTS.md](docs/AGENTS.md) | คู่มือสำหรับ AI Agents |
| [DECISIONS.md](docs/DECISIONS.md) | Architecture Decision Records |
| [CONTEXT.md](docs/CONTEXT.md) | บริบทปัจจุบันของโปรเจกต์ |
| [CHANGELOG.md](docs/CHANGELOG.md) | ประวัติการเปลี่ยนแปลง |
| [ISSUES.md](docs/ISSUES.md) | Backlog & Issue แนะนำ |
| [SETUP_D1.md](docs/SETUP_D1.md) | คู่มือ Setup Cloudflare D1 |

---

## ฟีเจอร์ปัจจุบัน (v0.1.0)

- แกลเลอรี่ครีเอเตอร์แบบการ์ดสวย (ธีมมืด)
- ค้นหาชื่อ / @handle / Bio
- กรอง: ทั้งหมด · ความนิยม · ยืนยันตัวตน · Top 100K+ · รู้จัก 10K+ · ใหม่ล่าสุด
- เรียงลำดับหลายแบบ
- Spotlight แนะนำสุ่ม + ปุ่มสุ่มสำรวจ (`R`)
- Responsive

---

## Roadmap สั้น ๆ

| Phase | รายละเอียด | สถานะ |
|-------|------------|--------|
| M0 | Static site | ✅ Done |
| M1 | เอกสารครบ + Issue backlog | 🔄 Now |
| M2 | D1 + Admin CRUD | Planned |
| M3 | Public API เชื่อม D1 | Planned |
| M4 | Auth + Soft delete + Stats | Planned |
| Phase 2 | X Sync, R2 images, Analytics | Future |

รายละเอียดเต็มใน [PRD.md](docs/PRD.md)

---

## โครงสร้างโปรเจกต์

```
nv-pu-sa/
├── index.html              # Public gallery
├── css/style.css
├── js/app.js
├── data/creators.json      # ข้อมูลตัวอย่างปัจจุบัน
├── docs/                   # เอกสารพัฒนาระบบทั้งหมด
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── AGENTS.md
│   ├── DECISIONS.md
│   ├── CONTEXT.md
│   ├── CHANGELOG.md
│   └── ISSUES.md
├── .github/
│   └── ISSUE_TEMPLATE/
└── README.md
```

---

## วิธีรันตอนนี้ (Static)

```bash
npx serve .
# หรือ
python -m http.server 3000
```

เปิด http://localhost:3000

---

## Deploy

### Cloudflare Pages (แนะนำ)
1. Connect repo `aodxx/nv-pu-sa`
2. Framework preset: **None**
3. Build command: เว้นว่าง
4. Output directory: `/`

### GitHub Pages
Settings → Pages → Deploy from branch `main` / root

---

## การเพิ่มครีเอเตอร์ (ตอนนี้)

แก้ไข `data/creators.json` แล้ว commit + push  
(ในอนาคตจะทำผ่าน Admin Console)

---

## สำหรับ AI Agents / Contributors

อ่าน [docs/AGENTS.md](docs/AGENTS.md) และ [docs/CONTEXT.md](docs/CONTEXT.md) ก่อนเริ่มงาน

---

## License

MIT
