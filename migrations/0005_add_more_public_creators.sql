-- Migration 0005: Add more public Thai adult creators
-- Avatar URLs are generated non-identifying placeholders; source URLs are retained in notes.

INSERT OR IGNORE INTO creators (
  name, handle, followers, verified, bio, avatar_url, banner_url,
  links_json, tags_json, is_hidden, is_deleted, added_at, updated_at, notes
) VALUES
(
  'Yanisa Samohom (Noey Yanisa / Yingnoey)',
  'yingnoey2808',
  991400,
  0,
  'นางแบบและโซเชียลครีเอเตอร์ไทยสายไลฟ์สไตล์ โมเดลลิง และคอนเทนต์แบบสมัครสมาชิก · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=yingnoey2808',
  NULL,
  '{"instagram":"https://www.instagram.com/yingnoey2808/","threads":"https://www.threads.com/@yingnoey2808","x":"https://x.com/yingnoey2808"}',
  '["Popular","18+","Thailand"]',
  0, 0, '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://www.famousbirthdays.com/people/yanisa-samohom.html ; https://modelsearcher.com/profile/noey_yanisa ; https://influencers.feedspot.com/thai_onlyfans_instagram_influencers/ ; https://www.threads.com/@yingnoey2808. Public sources identify adult status and current public activity; follower count is approximate.'
),
(
  'Saranya Jarsry (JaJar)',
  'jarja.saranya',
  764000,
  0,
  'นางแบบและครีเอเตอร์ไทยสายแฟชั่น ไลฟ์สไตล์ และคอนเทนต์แบบสมัครสมาชิก · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=jarja.saranya',
  NULL,
  '{"instagram":"https://www.instagram.com/jarja.saranya/","x":"https://x.com/jarja.saranya"}',
  '["Popular","18+","Thailand"]',
  0, 0, '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://zapjung.com/jarja-saranya/ ; https://www.instagram.com/jarja.saranya/ ; https://influencers.feedspot.com/thai_onlyfans_instagram_influencers/. Public sources identify adult status and active public Instagram; follower count is approximate.'
),
(
  'Sumitra Sarakorn (Kluaykhek)',
  'su.mitra_sa',
  268000,
  0,
  'นางแบบและอินฟลูเอนเซอร์ไทยสายถ่ายแบบและคอนเทนต์สำหรับผู้ใหญ่ พร้อมช่องทางรวมจากเจ้าตัว · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=su.mitra_sa',
  NULL,
  '{"instagram":"https://www.instagram.com/su.mitra_sa/","linktree":"https://linktr.ee/kluaykhek","onlyfans":"https://onlyfans.com/sumitra.kluay","x":"https://x.com/sumitra245"}',
  '["Known","18+","Thailand"]',
  0, 0, '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://www.boobpedia.com/boobs/Sumitra_Sarakorn ; https://linktr.ee/kluaykhek ; https://www.instagram.com/su.mitra_sa/?hl=en ; https://onlyfans.com/sumitra.kluay. Public sources identify adult status and active public channels; follower count is approximate.'
),
(
  'Wila Thai',
  'ThaiWila',
  12600,
  0,
  'นางแบบและอินฟลูเอนเซอร์ไทยสายแฟชั่น ไลฟ์สไตล์ และคอนเทนต์สำหรับผู้ใหญ่ผ่านช่องทางสาธารณะ · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=ThaiWila',
  NULL,
  '{"x":"https://x.com/ThaiWila","instagram":"https://www.instagram.com/wila_thai_beauty/"}',
  '["18+","Thailand","Creator"]',
  0, 0, '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://x.com/ThaiWila ; https://thaigirlmag.com/wila-thai/ ; https://www.instagram.com/wila_thai_beauty/ ; https://influencers.feedspot.com/thai_onlyfans_instagram_influencers/. Public profile states adult birth year and links to public channels; follower count is approximate.'
),
(
  'Sirikhwan Triwiset (Fuji Chan)',
  'nong_fuji_chan',
  62100,
  0,
  'ครีเอเตอร์และนางแบบไทยสายไลฟ์สไตล์ งานถ่ายแบบ และคอนเทนต์ R18+ ผ่านแพลตฟอร์มสมัครสมาชิก · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=nong_fuji_chan',
  NULL,
  '{"instagram":"https://www.instagram.com/nong.fuji.chan/","x":"https://x.com/N_FUJI_CHAN","fansly":"https://fansly.com/FUJI_CHAN","linktree":"https://linktr.ee/Fujichan"}',
  '["18+","Thailand","Creator"]',
  0, 0, '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://fansly.com/FUJI_CHAN ; https://www.instagram.com/nong.fuji.chan/?hl=en ; https://x.com/N_FUJI_CHAN ; https://linktr.ee/Fujichan. Public profile states age 28 and R18+ status; follower count is approximate.'
),
(
  'Macy Nihongo',
  'macy_nihongo_thai',
  68300,
  0,
  'ครีเอเตอร์และนางแบบไทย-ญี่ปุ่นสายภาพถ่าย วิดีโอ และคอนเทนต์สำหรับผู้ใหญ่ผ่านช่องทางสาธารณะ · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=macy_nihongo_thai',
  NULL,
  '{"instagram":"https://www.instagram.com/macy_nihongo_thai/","x":"https://x.com/Thai_Jpn_Queen","onlyfans":"https://onlyfans.com/macynihongo/c18"}',
  '["Known","18+","Thailand"]',
  0, 0, '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://www.instagram.com/macy_nihongo_thai/?hl=en ; https://www.instagram.com/reel/C-2dl1JPxqK/ ; https://x.com/Thai_Jpn_Queen?lang=en ; https://onlyfans.com/macynihongo/c18. Public post states adult age and public profiles link to adult creator channels; follower count is approximate.'
);
