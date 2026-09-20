# Product Requirements Document (PRD)
## นางฟ้า · แกลเลอรี่ครีเอเตอร์ X

**Version:** 1.0  
**Last Updated:** 2026-09-21  
**Status:** Draft → Active Development  
**Owner:** aodxx

---

## 1. Vision

สร้างแพลตฟอร์มคัดสรรครีเอเตอร์บน X (Twitter) เวอร์ชันภาษาไทย ที่ใช้งานง่าย สวยงาม และขยายได้  
เป้าหมายคือให้ผู้ใช้ไทยค้นพบครีเอเตอร์คุณภาพ (โดยเฉพาะแนว Adult / Cosplay / Lifestyle) ได้อย่างรวดเร็วและปลอดภัย

อ้างอิงต้นแบบ: [nv-pu-sa.pages.dev](https://nv-pu-sa.pages.dev/) (女菩萨)

---

## 2. Goals & Success Metrics

| Goal | Metric | Target (Phase 1) |
|------|--------|------------------|
| ผู้ใช้ค้นพบครีเอเตอร์ได้ง่าย | เวลาเฉลี่ยในการหาครีเอเตอร์ที่สนใจ | < 30 วินาที |
| ข้อมูลครีเอเตอร์ถูกต้องและอัปเดต | % ครีเอเตอร์ที่มีข้อมูลครบ | ≥ 90% |
| ประสบการณ์ใช้งานดี | Bounce rate หน้าแรก | < 40% |
| ขยายข้อมูลได้ | จำนวนครีเอเตอร์ในระบบ | ≥ 100 (Phase 1) → 500+ |
| Admin ทำงานสะดวก | เวลาในการเพิ่ม/แก้ไขครีเอเตอร์ | < 2 นาที/คน |

---

## 3. Target Users

1. **ผู้ใช้ทั่วไป (Visitor)**  
   - คนไทยที่สนใจครีเอเตอร์บน X  
   - ต้องการค้นหา / กรอง / สุ่มดู

2. **Curator / Admin**  
   - คนที่คัดสรรและดูแลข้อมูลครีเอเตอร์  
   - ต้องการเครื่องมือ sync, แก้ไข, ดูสถิติ

3. **Developer / Maintainer**  
   - ดูแลระบบ, deploy, ขยายฟีเจอร์

---

## 4. Scope

### 4.1 In Scope (Phase 1 – MVP+)

- หน้าแกลเลอรี่สาธารณะ (ภาษาไทย)
- ค้นหา, กรอง, เรียงลำดับ, Spotlight สุ่ม
- ข้อมูลครีเอเตอร์: ชื่อ, handle, followers, bio, links, tags, verified
- หน้า Admin พื้นฐาน (login ด้วย password / secret)
- เพิ่ม / แก้ไข / ลบ / ซ่อนครีเอเตอร์
- เก็บข้อมูลใน Cloudflare D1
- Deploy บน Cloudflare Pages + Functions
- Responsive + Dark theme

### 4.2 Out of Scope (Phase 1)

- ระบบสมาชิกผู้ใช้ทั่วไป (login visitor)
- Payment / Subscription
- Auto-scrape แบบเต็มรูปแบบจาก X API (ใช้ manual + semi-auto ก่อน)
- Mobile App แยก
- Multi-language นอกจากไทย/อังกฤษ

### 4.3 Future Phases

- **Phase 2:** Sync จาก X (Cookies / GraphQL), Analytics dashboard, Image caching (R2)
- **Phase 3:** Recommendation engine, User favorites, Public API
- **Phase 4:** Multi-curator, Moderation tools, NSFW filter levels

---

## 5. Core Features

### 5.1 Public Gallery
- แสดงการ์ดครีเอเตอร์
- Filter tabs: ทั้งหมด, ความนิยม, ยืนยันตัวตน, Top, รู้จัก, ใหม่ล่าสุด
- Search (name, handle, bio)
- Sort (followers, name, newest)
- Spotlight (สุ่มแนะนำ)
- Random Explore (กด R)
- Modal รายละเอียดด่วน

### 5.2 Admin Console
- Login ป้องกัน
- CRUD ครีเอเตอร์
- นำเข้า/ส่งออก JSON
- ดูสถิติพื้นฐาน (จำนวน, verified %, top followers)
- Soft-delete / Hide ครีเอเตอร์

### 5.3 Data Model (สรุป)
ดูรายละเอียดใน `DATABASE.md`

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | หน้าแรกโหลด < 2s (LCP) |
| Availability | 99% uptime (Cloudflare) |
| Security | Admin ต้อง auth, ไม่เก็บ token X ใน client |
| Privacy | ไม่เก็บข้อมูลผู้เยี่ยมชมโดยไม่จำเป็น |
| Accessibility | รองรับ keyboard navigation พื้นฐาน |
| Cost | อยู่ใน Free tier ของ Cloudflare ให้ได้นานที่สุด |

---

## 7. Tech Constraints

- Hosting: Cloudflare Pages
- Database: Cloudflare D1 (SQLite)
- Storage (อนาคต): Cloudflare R2
- Runtime: Cloudflare Workers / Pages Functions
- Frontend: HTML + CSS + Vanilla JS (หรือ Alpine.js / lightweight framework ในภายหลัง)
- ไม่ใช้ framework หนักใน Phase 1

---

## 8. Milestones

| Milestone | Description | Target |
|-----------|-------------|--------|
| M0 | Static site (ปัจจุบัน) | Done |
| M1 | เอกสารครบ + Issue backlog | 2026-09-21 |
| M2 | D1 schema + Admin CRUD พื้นฐาน | Week 1-2 |
| M3 | เชื่อม Public gallery กับ D1 | Week 2-3 |
| M4 | Auth Admin + Soft delete | Week 3 |
| M5 | Analytics พื้นฐาน + Polish | Week 4 |
| M6 | Phase 2 planning (Sync X) | After M5 |

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| X เปลี่ยน API / บล็อก scrape | สูง | ใช้ manual entry เป็นหลักก่อน, sync เป็น optional |
| ข้อมูล NSFW ถูก report | กลาง | มีระบบ hide + clear policy |
| Free tier limit | กลาง | Monitor usage, optimize query |
| Token / secret รั่ว | สูง | ใช้ Cloudflare secrets, ไม่ commit |

---

## 10. Open Questions

1. จะใช้ X API อย่างเป็นทางการหรือ Cookies-based sync?
2. ต้องการระบบ NSFW rating (safe / soft / explicit) หรือไม่?
3. ใครจะเป็น Admin หลักและมีกี่คน?
4. ต้องการ domain ของตัวเองหรือใช้ `*.pages.dev` พอ?

---

**เอกสารที่เกี่ยวข้อง**
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DATABASE.md](./DATABASE.md)
- [API.md](./API.md)
- [DECISIONS.md](./DECISIONS.md)
