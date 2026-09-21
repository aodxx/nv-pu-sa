/**
 * POST /api/events/track
 * Public beacon — record creator interaction
 * Body: { creatorId: number, type: "view"|"click_x"|"click_of"|"click_tg"|"click_lt"|"click_card" }
 */

const ALLOWED = new Set([
  "view",
  "click_x",
  "click_of",
  "click_tg",
  "click_lt",
  "click_card",
]);

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors() });
}

export async function onRequestPost(context) {
  const { env, request } = context;

  if (!env.DB) {
    return Response.json(
      { error: "D1_NOT_CONFIGURED" },
      { status: 503, headers: cors() }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "VALIDATION_ERROR", message: "JSON body required" },
      { status: 400, headers: cors() }
    );
  }

  const creatorId = parseInt(body?.creatorId ?? body?.creator_id, 10);
  const type = String(body?.type || body?.event_type || "").toLowerCase();

  if (!creatorId || !ALLOWED.has(type)) {
    return Response.json(
      {
        error: "VALIDATION_ERROR",
        message: "ต้องมี creatorId และ type ที่ถูกต้อง",
        allowed: [...ALLOWED],
      },
      { status: 400, headers: cors() }
    );
  }

  try {
    const exists = await env.DB.prepare(
      `SELECT id FROM creators WHERE id = ? AND is_deleted = 0`
    )
      .bind(creatorId)
      .first();

    if (!exists) {
      return Response.json(
        { error: "NOT_FOUND" },
        { status: 404, headers: cors() }
      );
    }

    const ts = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO creator_events (creator_id, event_type, created_at) VALUES (?, ?, ?)`
    )
      .bind(creatorId, type, ts)
      .run();

    return Response.json({ ok: true }, { status: 201, headers: cors() });
  } catch (err) {
    // Table may not exist yet before migration
    const msg = String(err?.message || err);
    if (msg.includes("no such table")) {
      return Response.json(
        { error: "MIGRATION_REQUIRED", message: "รัน migrations/0006_analytics.sql ก่อน" },
        { status: 503, headers: cors() }
      );
    }
    return Response.json(
      { error: "INTERNAL", message: msg },
      { status: 500, headers: cors() }
    );
  }
}
