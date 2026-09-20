-- Migration 0004: Add public Thai adult creator Sweetie Smooth
INSERT OR IGNORE INTO creators (
  name, handle, followers, verified, bio, avatar_url, banner_url,
  links_json, tags_json, is_hidden, is_deleted, added_at, updated_at, notes
) VALUES (
  'กี้ (Gyi) / Sweetie Smooth',
  'sweetiesmooth',
  0,
  0,
  'ครีเอเตอร์หญิงไทยในชื่อ Sweetie Smooth ที่เผยแพร่คอนเทนต์แบบสมัครสมาชิก · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=sweetiesmooth',
  NULL,
  '{"x":"https://x.com/Smsmsmooth","instagram":"https://www.instagram.com/Sweetie_Smooth.ss/","onlyfans":"https://onlyfans.com/sweetiesmooth"}',
  '["18+","Thailand","Creator"]',
  0, 0,
  '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://thematter.co/social/behind-the-screen-sex-creator/167713 ; https://onlyfans.com/sweetiesmooth ; https://x.com/Smsmsmooth. Public interview identifies Gyi as age 23 in 2022 and a sex creator; public profiles identify the Sweetie Smooth brand. Follower count is not published reliably, so it is set to 0 rather than estimated.'
);
