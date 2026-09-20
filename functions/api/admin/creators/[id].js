/**
 * Admin single creator
 * GET    /api/admin/creators/:id
 * PUT    /api/admin/creators/:id  — full/partial update
 * PATCH  /api/admin/creators/:id
 * DELETE /api/admin/creators/:id  — soft delete (?hard=true for hard)
 *
 * Also action routes via query: ?action=hide|unhide|restore
 * or POST body { "action": "hide" }
 */

import {
  requireAdmin,
  jsonError,
  jsonOk,
  corsHeaders,
} from "../../../_lib/auth.js";

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

function normalizeHandle(h) {
  return String(h || "")
    .trim()
    .replace(/^@/, "")
    .toLowerCase();
}

async function getById(db, id) {
  return db.prepare(`SELECT * FROM creators WHERE id = ?`).bind(id).first();
}

async function audit(db, action, creatorId, detail) {
  try {
    await db
      .prepare(
        `INSERT INTO admin_actions (action, creator_id, detail_json, created_at) VALUES (?, ?, ?, ?)`
      )
      .bind(action, creatorId, JSON.stringify(detail || {}), nowIso())
      .run();
  } catch (_) {}
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) {
  const { env, request, params } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return jsonError("D1_NOT_CONFIGURED", "D1 ยังไม่พร้อม", 503);

  const id = parseInt(params.id, 10);
  if (!id) return jsonError("VALIDATION_ERROR", "id ไม่ถูกต้อง");

  const row = await getById(env.DB, id);
  if (!row) return jsonError("NOT_FOUND", "ไม่พบครีเอเตอร์", 404);
  return jsonOk({ creator: mapRow(row) });
}

export async function onRequestPut(context) {
  return updateCreator(context);
}

export async function onRequestPatch(context) {
  return updateCreator(context);
}

async function updateCreator(context) {
  const { env, request, params } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return jsonError("D1_NOT_CONFIGURED", "D1 ยังไม่พร้อม", 503);

  const id = parseInt(params.id, 10);
  if (!id) return jsonError("VALIDATION_ERROR", "id ไม่ถูกต้อง");

  const existing = await getById(env.DB, id);
  if (!existing) return jsonError("NOT_FOUND", "ไม่พบครีเอเตอร์", 404);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Body ต้องเป็น JSON");
  }

  // Action shortcuts: hide / unhide / restore
  const action = body.action || new URL(request.url).searchParams.get("action");
  if (action === "hide" || action === "unhide" || action === "restore") {
    return runAction(env.DB, id, action, existing);
  }

  const name = body.name != null ? String(body.name).trim() : existing.name;
  const handle =
    body.handle != null ? normalizeHandle(body.handle) : existing.handle;
  const followers =
    body.followers != null ? Number(body.followers) || 0 : existing.followers;
  const verified =
    body.verified != null ? (body.verified ? 1 : 0) : existing.verified;
  const bio = body.bio !== undefined ? body.bio : existing.bio;
  const avatar =
    body.avatar !== undefined || body.avatar_url !== undefined
      ? body.avatar || body.avatar_url
      : existing.avatar_url;
  const banner =
    body.banner !== undefined || body.banner_url !== undefined
      ? body.banner || body.banner_url
      : existing.banner_url;
  const links =
    body.links && typeof body.links === "object"
      ? body.links
      : parseJson(existing.links_json, {});
  const tags = Array.isArray(body.tags)
    ? body.tags
    : parseJson(existing.tags_json, []);
  const notes = body.notes !== undefined ? body.notes : existing.notes;
  const ts = nowIso();

  if (!name) return jsonError("VALIDATION_ERROR", "name ว่างไม่ได้");
  if (!handle) return jsonError("VALIDATION_ERROR", "handle ว่างไม่ได้");

  try {
    await env.DB.prepare(
      `UPDATE creators SET
        name = ?, handle = ?, followers = ?, verified = ?, bio = ?,
        avatar_url = ?, banner_url = ?, links_json = ?, tags_json = ?,
        notes = ?, updated_at = ?
       WHERE id = ?`
    )
      .bind(
        name,
        handle,
        followers,
        verified,
        bio,
        avatar,
        banner,
        JSON.stringify(links),
        JSON.stringify(tags),
        notes,
        ts,
        id
      )
      .run();

    await audit(env.DB, "update", id, { handle });
    const row = await getById(env.DB, id);
    return jsonOk({ creator: mapRow(row) });
  } catch (err) {
    const msg = String(err?.message || err);
    if (msg.includes("UNIQUE") || msg.includes("unique")) {
      return jsonError("DUPLICATE_HANDLE", `handle @${handle} มีอยู่แล้ว`);
    }
    return jsonError("INTERNAL", msg, 500);
  }
}

async function runAction(db, id, action, existing) {
  const ts = nowIso();
  if (action === "hide") {
    await db
      .prepare(`UPDATE creators SET is_hidden = 1, updated_at = ? WHERE id = ?`)
      .bind(ts, id)
      .run();
    await audit(db, "hide", id, {});
  } else if (action === "unhide") {
    await db
      .prepare(`UPDATE creators SET is_hidden = 0, updated_at = ? WHERE id = ?`)
      .bind(ts, id)
      .run();
    await audit(db, "unhide", id, {});
  } else if (action === "restore") {
    await db
      .prepare(
        `UPDATE creators SET is_deleted = 0, is_hidden = 0, updated_at = ? WHERE id = ?`
      )
      .bind(ts, id)
      .run();
    await audit(db, "restore", id, {});
  }
  const row = await getById(db, id);
  return jsonOk({ creator: mapRow(row) });
}

export async function onRequestDelete(context) {
  const { env, request, params } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return jsonError("D1_NOT_CONFIGURED", "D1 ยังไม่พร้อม", 503);

  const id = parseInt(params.id, 10);
  if (!id) return jsonError("VALIDATION_ERROR", "id ไม่ถูกต้อง");

  const existing = await getById(env.DB, id);
  if (!existing) return jsonError("NOT_FOUND", "ไม่พบครีเอเตอร์", 404);

  const hard = new URL(request.url).searchParams.get("hard") === "true";
  const ts = nowIso();

  try {
    if (hard) {
      await env.DB.prepare(`DELETE FROM creators WHERE id = ?`).bind(id).run();
      await audit(env.DB, "hard_delete", id, { handle: existing.handle });
      return jsonOk({ deleted: true, hard: true, id });
    }

    await env.DB.prepare(
      `UPDATE creators SET is_deleted = 1, updated_at = ? WHERE id = ?`
    )
      .bind(ts, id)
      .run();
    await audit(env.DB, "delete", id, { handle: existing.handle });
    const row = await getById(env.DB, id);
    return jsonOk({ creator: mapRow(row), softDeleted: true });
  } catch (err) {
    return jsonError("INTERNAL", String(err?.message || err), 500);
  }
}

export async function onRequestPost(context) {
  // Allow POST with { action: "hide"|"unhide"|"restore" }
  return updateCreator(context);
}
