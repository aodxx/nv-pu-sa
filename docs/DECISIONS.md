# Architecture Decision Records (ADR)

**Project:** นางฟ้า · แกลเลอรี่ครีเอเตอร์ X

รูปแบบ: แต่ละ decision มีสถานะ `Accepted` / `Proposed` / `Superseded` / `Rejected`

---

## ADR-001: ใช้ Cloudflare Pages + D1 เป็นหลัก

- **Date:** 2026-09-21
- **Status:** Accepted
- **Context:** ต้องการ hosting ฟรี/ถูก, edge performance, และ database เบา
- **Decision:** ใช้ Cloudflare Pages สำหรับ static + Functions, D1 สำหรับ data
- **Consequences:** 
  - ข้อดี: ถูก, เร็ว, integrate ดี
  - ข้อเสีย: Vendor lock-in ระดับหนึ่ง, SQL จำกัดกว่า Postgres

---

## ADR-002: Phase 1 ใช้ Vanilla JS ไม่ใช้ Framework

- **Date:** 2026-09-21
- **Status:** Accepted
- **Context:** โปรเจกต์เริ่มจาก static และต้องการความเรียบง่าย
- **Decision:** Frontend Phase 1 ใช้ HTML/CSS/Vanilla JS (หรือ Alpine.js ถ้าจำเป็นจริง)
- **Consequences:** 
  - พัฒนาเร็วในระยะแรก
  - อาจ refactor เป็น framework ภายหลังถ้า complexity สูง

---

## ADR-003: Soft Delete + Soft Hide

- **Date:** 2026-09-21
- **Status:** Accepted
- **Context:** ครีเอเตอร์อาจถูกแบนชั่วคราว หรือต้องการซ่อนโดยไม่สูญเสียข้อมูล
- **Decision:** มี `is_hidden` และ `is_deleted` แยกกัน
- **Consequences:** Query ต้องกรองสอง flag เสมอสำหรับ public

---

## ADR-004: Admin Auth แบบ Simple Password ก่อน

- **Date:** 2026-09-21
- **Status:** Accepted (Phase 1)
- **Context:** มี Admin น้อยคน, ยังไม่ต้องการระบบ user ซับซ้อน
- **Decision:** ใช้ shared password เก็บใน Cloudflare Secret + short-lived token
- **Consequences:** 
  - ง่าย
  - ไม่เหมาะกับ multi-user ระยะยาว → จะทบทวนใน Phase 2

---

## ADR-005: เก็บ links และ tags เป็น JSON text

- **Date:** 2026-09-21
- **Status:** Accepted
- **Context:** โครงสร้างลิงก์ไม่คงที่และ tags ไม่ซับซ้อนมาก
- **Decision:** ใช้ `links_json` และ `tags_json` เป็น TEXT ใน SQLite
- **Consequences:** Query ตาม tag ลึก ๆ ยากขึ้น → ถ้าต้องการจะ normalize ภายหลัง

---

## ADR-006: ไม่ใช้ X Official API ใน Phase 1

- **Date:** 2026-09-21
- **Status:** Accepted
- **Context:** X API มีค่าใช้จ่ายและข้อจำกัด, ต้นฉบับใช้ cookies-based
- **Decision:** Phase 1 ใช้ manual entry + JSON import เป็นหลัก
- **Consequences:** ข้อมูลไม่อัปเดตอัตโนมัติ → Phase 2 จะพิจารณา sync engine

---

## ADR-007: ภาษาหลักของ UI คือภาษาไทย

- **Date:** 2026-09-21
- **Status:** Accepted
- **Context:** กลุ่มเป้าหมายคือคนไทย
- **Decision:** UI ข้อความทั้งหมดเป็นภาษาไทย, รองรับชื่อ/bio ไทย
- **Consequences:** ต้องใช้ฟอนต์ที่รองรับไทย (Noto Sans Thai)

---

## Template สำหรับ Decision ใหม่

```markdown
## ADR-XXX: Title

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded | Rejected
- **Context:** ...
- **Decision:** ...
- **Consequences:** ...
```
