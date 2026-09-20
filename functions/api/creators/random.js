/**
 * Public API — GET /api/creators/random
 * Returns one random visible creator
 */

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    followers: row.followers,
    verified: !!row.verified,
    bio: row.bio,
    avatar: row.avatar_url,
    links: safeJson(row.links_json, {}),
    tags: safeJson(row.tags_json, []),
    addedAt: row.added_at ? String(row.added_at).slice(0, 10) : null,
  };
}

function safeJson(val, fallback) {
  if (val == null) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export async function onRequestGet(context) {
  const { env } = context;

  if (!env.DB) {
    return Response.json(
      { error: "D1_NOT_CONFIGURED", message: "D1 not configured" },
      { status: 503 }
    );
  }

  try {
    const row = await env.DB.prepare(
      `SELECT id, name, handle, followers, verified, bio, avatar_url, links_json, tags_json, added_at
       FROM creators
       WHERE is_hidden = 0 AND is_deleted = 0
       ORDER BY RANDOM()
       LIMIT 1`
    ).first();

    if (!row) {
      return Response.json({ error: "NOT_FOUND", message: "ไม่มีครีเอเตอร์" }, { status: 404 });
    }

    return Response.json(
      { creator: mapRow(row) },
      {
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return Response.json(
      { error: "INTERNAL", message: String(err?.message || err) },
      { status: 500 }
    );
  }
}
