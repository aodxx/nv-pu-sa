-- Soft-hide demo seed creators (dicebear avatars / fictional handles from 0002_seed)
-- Recoverable: UPDATE creators SET is_hidden=0 WHERE notes='sample_seed';

UPDATE creators
SET
  is_hidden = 1,
  notes = COALESCE(notes, '') || CASE WHEN notes IS NULL OR notes = '' THEN 'sample_seed' ELSE ';sample_seed' END,
  updated_at = datetime('now')
WHERE handle IN (
  'minnie_th',
  'noon_sweet',
  'primrose_th',
  'belle_thai',
  'fahsai_xx',
  'june_cutie',
  'mind_th',
  'ploy_diamond',
  'kaem_smile',
  'namtarn_sweet',
  'mook_pearl',
  'som_orange'
)
AND is_deleted = 0
AND (avatar_url LIKE '%dicebear%' OR notes IS NULL OR notes NOT LIKE '%keep%');
