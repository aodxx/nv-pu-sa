/**
 * Admin creators collection
 * GET  /api/admin/creators  — list all (รวม hidden)
 * POST /api/admin/creators  — create
 */

import {
  requireAdmin,
  jsonError,
  jsonOk,
  corsHeaders,
} from "../../_lib/auth.js";

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    followers: row.followers,
    verified: !!row.verified,
    bio: row.bio,
    avatar: row.avatar_url,
    banner: row.banner_url,
    links: parseJson(row.links_json, {}),
    tags: parseJson(row.tags_json, []),
    isHidden: !!row.is_hidden,
    isDeleted: !!row.is_deleted,
    addedAt: row.added_at ? String(row.added_at).slice(0, 10) : null,
    updatedAt: row.updated_at || null,
    notes: row.notes || null,
  };
}

function parseJson(val, fallback) {
  if (val == null) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function validateCreate(body) {
  if (!body || typeof body !== "object") return "Body ต้องเป็น object";
  if (!body.name || !String(body.name).trim()) return "ต้องมี name";
  if (!body.handle || !String(body.handle).trim()) return "ต้องมี handle";
  return null;
}

function normalizeHandle(h) {
  return String(h || "")
    .trim()
    .replace(/^@/, "")
    .toLowerCase();
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return jsonError("D1_NOT_CONFIGURED", "D1 ยังไม่พร้อม", 503);

  try {
    const url = new URL(request.url);
    const includeDeleted = url.searchParams.get("includeDeleted") === "1";
    const where = includeDeleted ? "1=1" : "is_deleted = 0";

    const { results } = await env.DB.prepare(
      `SELECT * FROM creators WHERE ${where} ORDER BY followers DESC`
    ).all();

    const creators = (results || []).map(mapRow);
    return jsonOk({ total: creators.length, creators });
  } catch (err) {
    return jsonError("INTERNAL", String(err?.message || err), 500);
  }
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

  const errMsg = validateCreate(body);
  if (errMsg) return jsonError("VALIDATION_ERROR", errMsg);

  const handle = normalizeHandle(body.handle);
  const ts = nowIso();
  const links = body.links && typeof body.links === "object" ? body.links : {};
  const tags = Array.isArray(body.tags) ? body.tags : [];

  try {
    const result = await env.DB.prepare(
      `INSERT INTO creators (
        name, handle, followers, verified, bio, avatar_url, banner_url,
        links_json, tags_json, is_hidden, is_deleted, added_at, updated_at, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?)`
    )
      .bind(
        String(body.name).trim(),
        handle,
        Number(body.followers) || 0,
        body.verified ? 1 : 0,
        body.bio || null,
        body.avatar || body.avatar_url || null,
        body.banner || body.banner_url || null,
        JSON.stringify(links),
        JSON.stringify(tags),
        body.addedAt ? `${body.addedAt}T00:00:00Z` : ts,
        ts,
        body.notes || null
      )
      .run();

    const id = result.meta?.last_row_id;
    const row = await env.DB.prepare(`SELECT * FROM creators WHERE id = ?`)
      .bind(id)
      .first();

    // audit
    try {
      await env.DB.prepare(
        `INSERT INTO admin_actions (action, creator_id, detail_json, created_at) VALUES (?, ?, ?, ?)`
      )
        .bind("create", id, JSON.stringify({ handle }), ts)
        .run();
    } catch (_) {}

    return jsonOk({ creator: mapRow(row) }, 201);
  } catch (err) {
    const msg = String(err?.message || err);
    if (msg.includes("UNIQUE") || msg.includes("unique")) {
      return jsonError("DUPLICATE_HANDLE", `handle @${handle} มีอยู่แล้ว`);
    }
    return jsonError("INTERNAL", msg, 500);
  }
}
