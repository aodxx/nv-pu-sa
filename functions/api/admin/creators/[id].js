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

  // Action shortcuts: hide / unhide / restore / refresh_x
  const action = body.action || new URL(request.url).searchParams.get("action");
  if (action === "hide" || action === "unhide" || action === "restore") {
    return runAction(env.DB, id, action, existing);
  }
  if (action === "refresh_x") {
    return refreshFromX(env, id, existing);
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


/**
 * Refresh profile fields from X API v2 (requires env.X_BEARER_TOKEN)
 * Updates: name, followers, verified, bio, avatar_url
 */
async function refreshFromX(env, id, existing) {
  const token = env.X_BEARER_TOKEN;
  if (!token) {
    return jsonError(
      "X_NOT_CONFIGURED",
      "ตั้ง secret X_BEARER_TOKEN (Twitter API Bearer) ก่อน",
      503
    );
  }

  const handle = existing.handle;
  try {
    const url =
      "https://api.x.com/2/users/by/username/" +
      encodeURIComponent(handle) +
      "?user.fields=public_metrics,profile_image_url,description,verified,verified_type,name";
    const res = await fetch(url, {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    if (!res.ok) {
      return jsonError(
        "X_API_ERROR",
        (data && data.detail) || (data && data.title) || "HTTP " + res.status,
        502
      );
    }
    const u = data.data;
    if (!u) return jsonError("X_NOT_FOUND", "ไม่พบ @" + handle + " บน X", 404);

    const followers = u.public_metrics?.followers_count ?? existing.followers;
    const name = u.name || existing.name;
    const bio = u.description != null ? u.description : existing.bio;
    const avatar = u.profile_image_url
      ? String(u.profile_image_url).replace("_normal", "_400x400")
      : existing.avatar_url;
    const verified =
      u.verified || u.verified_type === "blue" || u.verified_type === "business"
        ? 1
        : existing.verified;
    const ts = nowIso();

    await env.DB.prepare(
      `UPDATE creators SET name = ?, followers = ?, verified = ?, bio = ?, avatar_url = ?, updated_at = ? WHERE id = ?`
    )
      .bind(name, followers, verified, bio, avatar, ts, id)
      .run();

    await audit(env.DB, "refresh_x", id, { handle, followers });
    const row = await getById(env.DB, id);
    return jsonOk({ creator: mapRow(row), syncedFrom: "x" });
  } catch (err) {
    return jsonError("INTERNAL", String(err?.message || err), 500);
  }
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
