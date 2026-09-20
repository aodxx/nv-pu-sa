import { requireAdmin, jsonError, jsonOk, corsHeaders } from "../../../_lib/auth.js";

const MAX_IMPORT = 250;

function normalizeHandle(value) {
  return String(value || "")
    .trim()
    .replace(/^@/, "")
    .toLowerCase();
}

function cleanText(value, max = 2000) {
  const text = value == null ? "" : String(value).trim();
  return text.slice(0, max);
}

function normalizeTags(value) {
  if (Array.isArray(value)) return value.map((x) => cleanText(x, 40)).filter(Boolean).slice(0, 20);
  return cleanText(value, 500)
    .split(/[|,]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function normalizeLinks(value) {
  if (!value || typeof value !== "object") return {};
  const out = {};
  for (const key of ["x", "instagram", "onlyfans", "telegram", "linktree", "tiktok", "youtube", "website"]) {
    const url = cleanText(value[key], 500);
    if (url) out[key] = url;
  }
  return out;
}

function normalizeCreator(raw, index) {
  const name = cleanText(raw?.name, 200);
  const handle = normalizeHandle(raw?.handle);
  const followers = Number(raw?.followers ?? 0);
  const errors = [];
  if (!name) errors.push("ต้องมี name");
  if (!handle || !/^[a-z0-9._-]{2,80}$/.test(handle)) errors.push("handle ไม่ถูกต้อง");
  if (!Number.isFinite(followers) || followers < 0 || !Number.isInteger(followers)) errors.push("followers ต้องเป็นจำนวนเต็มไม่ติดลบ");
  if (errors.length) return { index, errors };

  const avatar = cleanText(raw?.avatar ?? raw?.avatar_url, 500) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(handle)}`;
  const links = normalizeLinks(raw?.links || {
    x: raw?.x_url || raw?.x,
    instagram: raw?.instagram_url || raw?.instagram,
    onlyfans: raw?.onlyfans_url || raw?.onlyfans,
    telegram: raw?.telegram_url || raw?.telegram,
    linktree: raw?.linktree_url || raw?.linktree,
  });
  const tags = normalizeTags(raw?.tags);
  const now = new Date().toISOString();
  return {
    value: {
      name,
      handle,
      followers,
      verified: raw?.verified === true || raw?.verified === 1 || raw?.verified === "1" ? 1 : 0,
      bio: cleanText(raw?.bio, 2000) || null,
      avatar_url: avatar,
      banner_url: cleanText(raw?.banner ?? raw?.banner_url, 500) || null,
      links_json: JSON.stringify(links),
      tags_json: JSON.stringify(tags),
      is_hidden: 0,
      is_deleted: 0,
      added_at: cleanText(raw?.addedAt ?? raw?.added_at, 40) ? `${cleanText(raw?.addedAt ?? raw?.added_at, 40)}T00:00:00Z` : now,
      updated_at: now,
      notes: cleanText(raw?.notes, 4000) || null,
    },
    index,
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return jsonError("D1_NOT_CONFIGURED", "D1 ยังไม่พร้อม", 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Body ต้องเป็น JSON");
  }

  const rows = Array.isArray(body) ? body : body?.creators;
  if (!Array.isArray(rows)) return jsonError("VALIDATION_ERROR", "ต้องส่ง creators เป็น array");
  if (!rows.length) return jsonError("VALIDATION_ERROR", "ไม่มีข้อมูลสำหรับนำเข้า");
  if (rows.length > MAX_IMPORT) return jsonError("VALIDATION_ERROR", `นำเข้าได้ครั้งละไม่เกิน ${MAX_IMPORT} รายการ`);

  const normalized = rows.map(normalizeCreator);
  const errors = normalized.filter((x) => x.errors).map((x) => ({ index: x.index, errors: x.errors }));
  const valid = normalized.filter((x) => x.value).map((x) => x.value);
  const seen = new Set();
  const duplicates = [];
  const unique = valid.filter((row) => {
    if (seen.has(row.handle)) {
      duplicates.push({ handle: row.handle, reason: "ซ้ำในไฟล์" });
      return false;
    }
    seen.add(row.handle);
    return true;
  });

  if (errors.length) return jsonError("VALIDATION_ERROR", "มีข้อมูลไม่ผ่านการตรวจสอบ", 422, { errors, duplicates });

  const placeholders = unique.map(() => "?").join(",");
  const existing = placeholders
    ? await env.DB.prepare(`SELECT handle FROM creators WHERE handle IN (${placeholders})`).bind(...unique.map((x) => x.handle)).all()
    : { results: [] };
  const existingSet = new Set((existing.results || []).map((x) => x.handle));
  const skipped = unique.filter((x) => existingSet.has(x.handle)).map((x) => ({ handle: x.handle, reason: "มีอยู่แล้ว" }));
  const toInsert = unique.filter((x) => !existingSet.has(x.handle));
  if (!toInsert.length) return jsonOk({ total: rows.length, created: 0, skipped: [...duplicates, ...skipped], errors: [] });

  const statements = toInsert.map((row) => env.DB.prepare(
    `INSERT INTO creators (
      name, handle, followers, verified, bio, avatar_url, banner_url,
      links_json, tags_json, is_hidden, is_deleted, added_at, updated_at, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    row.name, row.handle, row.followers, row.verified, row.bio, row.avatar_url,
    row.banner_url, row.links_json, row.tags_json, row.is_hidden, row.is_deleted,
    row.added_at, row.updated_at, row.notes
  ));

  try {
    await env.DB.batch(statements);
    return jsonOk({ total: rows.length, created: toInsert.length, skipped: [...duplicates, ...skipped], errors: [] }, 201);
  } catch (err) {
    return jsonError("IMPORT_FAILED", String(err?.message || err), 500);
  }
}
