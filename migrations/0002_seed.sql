-- Migration 0002: Seed sample creators from data/creators.json
-- Run AFTER 0001_init.sql
-- wrangler d1 execute nv-pu-sa-db --file=./migrations/0002_seed.sql

INSERT OR IGNORE INTO creators (
  id, name, handle, followers, verified, bio, avatar_url, banner_url,
  links_json, tags_json, is_hidden, is_deleted, added_at, updated_at, notes
) VALUES
(1, 'มินนี่', 'minnie_th', 285000, 1,
 'ครีเอเตอร์เนื้อหา · ถ่ายภาพ · ไลฟ์สไตล์ 🇹🇭 OnlyFans & Telegram มีเนื้อหาพิเศษ',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=minnie', NULL,
 '{"x":"https://x.com/minnie_th","onlyfans":"https://onlyfans.com/minnie_th","telegram":"https://t.me/minnie_th","linktree":"https://linktr.ee/minnie_th"}',
 '["Top Creator","NSFW"]', 0, 0, '2026-08-15T00:00:00Z', '2026-08-15T00:00:00Z', NULL),

(2, 'น้องนุ่น', 'noon_sweet', 192000, 1,
 'Sweet Thai girl 💕 ถ่ายรูปสวย ๆ · วิดีโอพิเศษ · ติดตามได้ที่ลิงก์ด้านล่าง',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=noon', NULL,
 '{"x":"https://x.com/noon_sweet","onlyfans":"https://onlyfans.com/noon_sweet","telegram":null,"linktree":"https://linktr.ee/noon_sweet"}',
 '["Top Creator"]', 0, 0, '2026-08-20T00:00:00Z', '2026-08-20T00:00:00Z', NULL),

(3, 'พริม', 'primrose_th', 156000, 0,
 'Cosplay & Lifestyle · ชอบแต่งตัวสวย ๆ · มีคอนเทนต์พิเศษบน Telegram',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=prim', NULL,
 '{"x":"https://x.com/primrose_th","onlyfans":null,"telegram":"https://t.me/primrose_th","linktree":"https://linktr.ee/primrose_th"}',
 '["Cosplay"]', 0, 0, '2026-09-01T00:00:00Z', '2026-09-01T00:00:00Z', NULL),

(4, 'เบลล์', 'belle_thai', 421000, 1,
 'Thai model & content creator 🔥 All works available · DM for custom',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=belle', NULL,
 '{"x":"https://x.com/belle_thai","onlyfans":"https://onlyfans.com/belle_thai","telegram":"https://t.me/belle_thai","linktree":"https://linktr.ee/belle_thai"}',
 '["Top Creator","NSFW"]', 0, 0, '2026-07-10T00:00:00Z', '2026-07-10T00:00:00Z', NULL),

(5, 'ฟ้าใส', 'fahsai_xx', 98000, 0,
 'สาวไทยน่ารัก · อัปเดตทุกวัน · เนื้อหาพิเศษเฉพาะสมาชิก',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=fahsai', NULL,
 '{"x":"https://x.com/fahsai_xx","onlyfans":"https://onlyfans.com/fahsai","telegram":null,"linktree":null}',
 '["Known"]', 0, 0, '2026-09-05T00:00:00Z', '2026-09-05T00:00:00Z', NULL),

(6, 'จูน', 'june_cutie', 312000, 1,
 'Cutie from Bangkok 💋 Exclusive content · OnlyFans + TG',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=june', NULL,
 '{"x":"https://x.com/june_cutie","onlyfans":"https://onlyfans.com/june_cutie","telegram":"https://t.me/june_cutie","linktree":"https://linktr.ee/june_cutie"}',
 '["Top Creator","NSFW"]', 0, 0, '2026-08-01T00:00:00Z', '2026-08-01T00:00:00Z', NULL),

(7, 'มายด์', 'mind_th', 67000, 0,
 'นักศึกษา · ถ่ายรูปเล่น ๆ · มีคลิปพิเศษบ้าง',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=mind', NULL,
 '{"x":"https://x.com/mind_th","onlyfans":null,"telegram":"https://t.me/mind_th","linktree":null}',
 '[]', 0, 0, '2026-09-10T00:00:00Z', '2026-09-10T00:00:00Z', NULL),

(8, 'พลอย', 'ploy_diamond', 245000, 1,
 'Diamond girl 💎 High quality content · Custom available',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=ploy', NULL,
 '{"x":"https://x.com/ploy_diamond","onlyfans":"https://onlyfans.com/ploy_diamond","telegram":"https://t.me/ploy_diamond","linktree":"https://linktr.ee/ploy_diamond"}',
 '["Top Creator"]', 0, 0, '2026-07-25T00:00:00Z', '2026-07-25T00:00:00Z', NULL),

(9, 'แก้ม', 'kaem_smile', 134000, 0,
 'ยิ้มหวาน · คอนเทนต์น่ารัก · อัปเดตบ่อย',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=kaem', NULL,
 '{"x":"https://x.com/kaem_smile","onlyfans":"https://onlyfans.com/kaem_smile","telegram":null,"linktree":"https://linktr.ee/kaem_smile"}',
 '["Known"]', 0, 0, '2026-08-28T00:00:00Z', '2026-08-28T00:00:00Z', NULL),

(10, 'น้ำตาล', 'namtarn_sweet', 89000, 0,
 'Sweet as sugar 🍬 Thai content creator · New here!',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=namtarn', NULL,
 '{"x":"https://x.com/namtarn_sweet","onlyfans":null,"telegram":"https://t.me/namtarn_sweet","linktree":null}',
 '["New"]', 0, 0, '2026-09-12T00:00:00Z', '2026-09-12T00:00:00Z', NULL),

(11, 'มุก', 'mook_pearl', 178000, 1,
 'Pearl of Thailand 🦪 Exclusive photos & videos',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=mook', NULL,
 '{"x":"https://x.com/mook_pearl","onlyfans":"https://onlyfans.com/mook_pearl","telegram":"https://t.me/mook_pearl","linktree":"https://linktr.ee/mook_pearl"}',
 '["Top Creator"]', 0, 0, '2026-08-05T00:00:00Z', '2026-08-05T00:00:00Z', NULL),

(12, 'ส้ม', 'som_orange', 52000, 0,
 'สดใสเหมือนส้ม 🍊 คอนเทนต์สนุก ๆ ทุกวัน',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=som', NULL,
 '{"x":"https://x.com/som_orange","onlyfans":null,"telegram":null,"linktree":"https://linktr.ee/som_orange"}',
 '["New"]', 0, 0, '2026-09-15T00:00:00Z', '2026-09-15T00:00:00Z', NULL);
