# AGENTS.md — คู่มือสำหรับ AI Coding Agents

**Project:** นางฟ้า · แกลเลอรี่ครีเอเตอร์ X  
**Purpose:** ให้ AI agents (เช่น Cursor, Claude, Codex, Grok) ทำงานบนโปรเจกต์นี้อย่างสอดคล้องกัน

---

## 1. Project Summary

นี่คือเวอร์ชันภาษาไทยของแพลตฟอร์มคัดสรรครีเอเตอร์บน X (Twitter)  
ปัจจุบันเป็น Static site และกำลังพัฒนาไปสู่ระบบที่มี D1 + Admin + API

**Repo:** https://github.com/aodxx/nv-pu-sa  
**Primary language:** Thai UI + English code/docs mixed

---

## 2. Current Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, Vanilla JS |
| Data (now) | `data/creators.json` |
| Target DB | Cloudflare D1 |
| Target Backend | Cloudflare Pages Functions |
| Hosting | Cloudflare Pages |
| Docs | Markdown ใน `docs/` |

---

## 3. Key Files

| Path | Role |
|------|------|
| `index.html` | หน้า Public Gallery |
| `js/app.js` | Client logic ปัจจุบัน |
| `css/style.css` | Styles |
| `data/creators.json` | Seed / current data |
| `docs/PRD.md` | Product requirements |
| `docs/ARCHITECTURE.md` | System design |
| `docs/DATABASE.md` | Schema |
| `docs/API.md` | API contract |
| `docs/DECISIONS.md` | Architecture Decision Records |
| `docs/CONTEXT.md` | บริบทปัจจุบัน |
| `docs/CHANGELOG.md` | ประวัติการเปลี่ยนแปลง |

---

## 4. Coding Conventions

- **ภาษา UI:** ภาษาไทย
- **Code comments:** อังกฤษหรือไทยได้ แต่ชื่อตัวแปร/ฟังก์ชันเป็นภาษาอังกฤษ
- **Indent:** 2 spaces
- **ไม่มี framework หนัก** ใน Phase 1 (อย่าใส่ React/Vue/Svelte โดยไม่ขอ)
- ใช้ `async/await` แทน `.then` chain ที่ยาว
- หลีกเลี่ยง dependency ที่ไม่จำเป็น

### Naming
- Functions: `camelCase`
- Constants: `UPPER_SNAKE` หรือ `camelCase`
- DOM ids: `camelCase` หรือ `kebab-case` ตามที่มีอยู่

---

## 5. How Agents Should Work

1. **อ่านเอกสารก่อนลงมือ**  
   โดยเฉพาะ `PRD.md`, `ARCHITECTURE.md`, `CONTEXT.md`

2. **อย่าเปลี่ยน scope โดยพลการ**  
   ถ้าอยากเพิ่มฟีเจอร์ใหญ่ → เสนอใน DECISIONS หรือสร้าง Issue ก่อน

3. **เมื่อแก้ Frontend**  
   - รักษา dark theme และ responsive
   - ทดสอบ keyboard shortcuts (`/`, `R`, `Esc`)

4. **เมื่อเพิ่ม Backend**  
   - ทำตาม `API.md` และ `DATABASE.md`
   - ใช้ prepared statements กับ D1
   - อย่า hardcode secret

5. **Commit message**  
   ใช้รูปแบบ:
   ```
   feat: add admin create creator endpoint
   fix: correct follower sorting
   docs: update DATABASE schema
   chore: seed initial data
   ```

---

## 6. Safety Rules for Agents

- **ห้าม** commit ไฟล์ที่มี token, password, หรือ secret
- **ห้าม** ลบข้อมูล creators จริงโดยไม่ backup
- **ห้าม** เปลี่ยน public API response shape โดยไม่อัปเดต `API.md`
- ถ้าต้องใช้ X cookies / tokens → เก็บเฉพาะใน Cloudflare Secrets

---

## 7. Preferred Task Order (สำหรับ Agent)

1. อ่าน `CONTEXT.md` และ `CHANGELOG.md`
2. ดู Issue ที่เกี่ยวข้อง (ถ้ามี)
3. ทำตามแผนใน PRD milestones
4. อัปเดตเอกสารที่เกี่ยวข้องหลังเปลี่ยนโค้ด
5. เพิ่ม entry ใน `CHANGELOG.md`

---

## 8. Useful Commands

```bash
# Local static
npx serve .

# D1 (เมื่อมี wrangler)
wrangler d1 execute <DB> --command="SELECT COUNT(*) FROM creators"
wrangler pages dev
```

---

## 9. Contact / Ownership

- Repo owner: **aodxx**
- เอกสารนี้ดูแลโดยทีมพัฒนาโปรเจกต์

เมื่อ AI agent ทำงานเสร็จ ควรสรุปสิ่งที่ทำ + ไฟล์ที่แก้ + ขั้นตอนถัดไปที่แนะนำ
