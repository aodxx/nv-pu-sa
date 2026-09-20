/**
 * Public API — GET /api/creators
 * Query: q, filter, sort, limit, offset
 * See docs/API.md
 */

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    followers: row.followers,
    verified: !!row.verified,
    bio: row.bio,
    avatar: row.avatar_url || row.avatar,
    links: safeJson(row.links_json, {}),
    tags: safeJson(row.tags_json, []),
    addedAt: row.added_at
      ? String(row.added_at).slice(0, 10)
      : row.addedAt
        ? String(row.addedAt).slice(0, 10)
        : null,
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

function buildWhere(filter, q) {
  const clauses = ["is_hidden = 0", "is_deleted = 0"];
  const binds = [];

  switch (filter) {
    case "hot":
      clauses.push("followers >= 50000");
      break;
    case "verified":
      clauses.push("verified = 1");
      break;
    case "top":
      clauses.push("followers >= 100000");
      break;
    case "known":
      clauses.push("followers >= 10000 AND followers < 100000");
      break;
    case "new":
      clauses.push("added_at >= date('now', '-30 days')");
      break;
    default:
      break;
  }

  if (q && q.trim()) {
    const term = `%${q.trim().toLowerCase()}%`;
    clauses.push(
      "(LOWER(name) LIKE ? OR LOWER(handle) LIKE ? OR LOWER(IFNULL(bio, '')) LIKE ?)"
    );
    binds.push(term, term, term);
  }

  return { where: clauses.join(" AND "), binds };
}

function orderClause(sort) {
  switch (sort) {
    case "followers-asc":
      return "followers ASC";
    case "name-asc":
      return "name COLLATE NOCASE ASC";
    case "newest":
      return "added_at DESC";
    case "followers-desc":
    default:
      return "followers DESC";
  }
}

export async function onRequestGet(context) {
  const { env, request } = context;

  if (!env.DB) {
    return Response.json(
      {
        error: "D1_NOT_CONFIGURED",
        message: "กรุณาตั้ง database_id ใน wrangler.toml และรัน migration ก่อน",
        docs: "docs/SETUP_D1.md",
      },
      { status: 503 }
    );
  }

  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const filter = url.searchParams.get("filter") || "all";
    const sort = url.searchParams.get("sort") || "followers-desc";
    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 1),
      200
    );
    const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10) || 0, 0);

    const { where, binds } = buildWhere(filter, q);
    const order = orderClause(sort);

    const listSql = `
      SELECT id, name, handle, followers, verified, bio, avatar_url, links_json, tags_json, added_at
      FROM creators
      WHERE ${where}
      ORDER BY ${order}
      LIMIT ? OFFSET ?
    `;

    const countSql = `SELECT COUNT(*) AS total FROM creators WHERE ${where}`;

    const listStmt = env.DB.prepare(listSql).bind(...binds, limit, offset);
    const countStmt = env.DB.prepare(countSql).bind(...binds);

    const [{ results }, countRow] = await Promise.all([
      listStmt.all(),
      countStmt.first(),
    ]);

    const creators = (results || []).map(mapRow);

    return Response.json(
      {
        total: countRow?.total ?? creators.length,
        count: creators.length,
        filter,
        sort,
        creators,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/creators error:", err);
    return Response.json(
      { error: "INTERNAL", message: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
