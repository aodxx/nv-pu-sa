/**
 * Placeholder Public API — GET /api/creators
 * จะ implement จริงในข้อ 2
 *
 * เมื่อมี D1 binding แล้ว เปิดใช้โค้ดด้านล่างได้
 */

export async function onRequestGet(context) {
  const { env, request } = context;

  // ยังไม่มี DB binding หรือยังไม่ migrate → fallback บอกสถานะ
  if (!env.DB) {
    return Response.json(
      {
        error: "D1 not configured",
        message: "กรุณาตั้ง database_id ใน wrangler.toml และรัน migration ก่อน",
        docs: "/docs/SETUP_D1.md",
      },
      { status: 503 }
    );
  }

  try {
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const { results } = await env.DB.prepare(
      `SELECT id, name, handle, followers, verified, bio, avatar_url AS avatar,
              links_json, tags_json, added_at AS addedAt
       FROM creators
       WHERE is_hidden = 0 AND is_deleted = 0
       ORDER BY followers DESC
       LIMIT ? OFFSET ?`
    )
      .bind(limit, offset)
      .all();

    const creators = (results || []).map((row) => ({
      id: row.id,
      name: row.name,
      handle: row.handle,
      followers: row.followers,
      verified: !!row.verified,
      bio: row.bio,
      avatar: row.avatar,
      links: row.links_json ? JSON.parse(row.links_json) : {},
      tags: row.tags_json ? JSON.parse(row.tags_json) : [],
      addedAt: row.addedAt ? String(row.addedAt).slice(0, 10) : null,
    }));

    const countRow = await env.DB.prepare(
      `SELECT COUNT(*) AS total FROM creators WHERE is_hidden = 0 AND is_deleted = 0`
    ).first();

    return Response.json({
      total: countRow?.total ?? creators.length,
      count: creators.length,
      creators,
    });
  } catch (err) {
    return Response.json(
      { error: "INTERNAL", message: String(err?.message || err) },
      { status: 500 }
    );
  }
}
