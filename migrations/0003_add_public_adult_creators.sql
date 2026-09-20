-- Migration 0003: Add verified public Thai adult creators
-- Sources are recorded in notes for editorial review.
-- Run: npx wrangler d1 execute nv-pu-sa-db --remote --file=./migrations/0003_add_public_adult_creators.sql

INSERT OR IGNORE INTO creators (
  name, handle, followers, verified, bio, avatar_url, banner_url,
  links_json, tags_json, is_hidden, is_deleted, added_at, updated_at, notes
) VALUES
(
  'ฝ้าย อรพรรณ สมอหอม (Faii Orapun)',
  'orapunfaii',
  1100000,
  1,
  'นางแบบและครีเอเตอร์ชาวไทยสายแฟชั่น ฟิตเนส และคอนเทนต์แบบสมัครสมาชิก · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=orapunfaii',
  NULL,
  '{"x":"https://x.com/orapun_fb","instagram":"https://www.instagram.com/orapunfaii/","onlyfans":"https://onlyfans.com/imfaii"}',
  '["Popular","18+","Thailand"]',
  0, 0,
  '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://www.instagram.com/orapunfaii/ ; https://www.instagram.com/p/CxJ9Bt3vb2j/?hl=en ; https://onlyfans.com/imfaii. Public Instagram indicated age 32 in 2023; OnlyFans identifies Thailand and adult subscription content. Follower count is approximate and should be refreshed before editorial use.'
),
(
  'Jintana Tingsa (Janny)',
  'jannyjintana',
  650000,
  0,
  'ครีเอเตอร์และนางแบบชาวไทย ใช้ชื่อ Jintana/Janny และเชื่อมช่องทางสมาชิกผ่านโปรไฟล์สาธารณะ · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=jannyjintana',
  NULL,
  '{"x":"https://x.com/jannybb7","instagram":"https://www.instagram.com/jannyjintana/","onlyfans":"https://onlyfans.com/jannybbxoxo","linktree":"https://linktr.ee/jintanap"}',
  '["Popular","18+","Thailand"]',
  0, 0,
  '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://www.babepedia.com/babe/Jintana_Tingsa ; https://linktr.ee/jintanap ; https://www.instagram.com/jannyjintana/. Public profiles identify her as an adult Thai creator and link to official channels. Follower count is approximate and should be refreshed before editorial use.'
),
(
  'อีฟ (Eve)',
  'letsplaywitheve',
  143300,
  0,
  'ครีเอเตอร์หญิงไทยสาย sapphic ที่ใช้ X สาธารณะสื่อสารและโปรโมตช่องทางแบบจำกัดการเข้าถึง · โปรดตรวจสอบอายุผู้ชมก่อนเข้าชมเนื้อหาภายนอก',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=letsplaywitheve',
  NULL,
  '{"x":"https://x.com/letsplaywitheve","x_alt":"https://x.com/callme_EVE_"}',
  '["Popular","18+","Thailand"]',
  0, 0,
  '2026-09-21T00:00:00Z', '2026-09-21T00:00:00Z',
  'Sources: https://thematter.co/social/behind-the-screen-sex-creator/167713 ; https://x.com/letsplaywitheve ; https://x.com/letsplaywitheve/status/1610255218503192577. The interview identifies Eve as age 22 in 2022 and a sex creator; current public X profile identifies adult/NSFW content. Follower count is approximate and should be refreshed before editorial use.'
);
