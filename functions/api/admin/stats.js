/**
 * GET /api/admin/stats
 */

import {
  requireAdmin,
  jsonError,
  jsonOk,
  corsHeaders,
} from "../../_lib/auth.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;
  if (!env.DB) return jsonError("D1_NOT_CONFIGURED", "D1 ยังไม่พร้อม", 503);

  try {
    const row = await env.DB.prepare(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN is_deleted = 0 THEN 1 ELSE 0 END) AS notDeleted,
        SUM(CASE WHEN is_hidden = 0 AND is_deleted = 0 THEN 1 ELSE 0 END) AS visible,
        SUM(CASE WHEN is_hidden = 1 AND is_deleted = 0 THEN 1 ELSE 0 END) AS hidden,
        SUM(CASE WHEN is_deleted = 1 THEN 1 ELSE 0 END) AS deleted,
        SUM(CASE WHEN verified = 1 AND is_deleted = 0 THEN 1 ELSE 0 END) AS verified,
        MAX(CASE WHEN is_deleted = 0 THEN followers ELSE 0 END) AS maxFollowers
       FROM creators`
    ).first();

    const totalActive = Number(row?.notDeleted || 0);
    const verified = Number(row?.verified || 0);

    const { results: top } = await env.DB.prepare(
      `SELECT id, name, handle, followers, verified
       FROM creators
       WHERE is_deleted = 0
       ORDER BY followers DESC
       LIMIT 5`
    ).all();

    // Analytics (optional until migration 0006)
    let eventsTotal = 0;
    let eventsToday = 0;
    let topClicked = [];
    try {
      const ev = await env.DB.prepare(
        `SELECT
           COUNT(*) AS total,
           SUM(CASE WHEN date(created_at) = date('now') THEN 1 ELSE 0 END) AS today
         FROM creator_events`
      ).first();
      eventsTotal = Number(ev?.total || 0);
      eventsToday = Number(ev?.today || 0);

      const { results: clicked } = await env.DB.prepare(
        `SELECT c.id, c.name, c.handle, COUNT(e.id) AS clicks
         FROM creator_events e
         JOIN creators c ON c.id = e.creator_id
         WHERE e.event_type LIKE 'click%'
         GROUP BY c.id
         ORDER BY clicks DESC
         LIMIT 5`
      ).all();
      topClicked = (clicked || []).map((r) => ({
        id: r.id,
        name: r.name,
        handle: r.handle,
        clicks: Number(r.clicks || 0),
      }));
    } catch (_) {
      /* table may not exist yet */
    }

    return jsonOk({
      total: Number(row?.total || 0),
      visible: Number(row?.visible || 0),
      hidden: Number(row?.hidden || 0),
      deleted: Number(row?.deleted || 0),
      verified,
      verifiedPercent: totalActive
        ? Math.round((verified / totalActive) * 100)
        : 0,
      maxFollowers: Number(row?.maxFollowers || 0),
      topCreators: (top || []).map((r) => ({
        id: r.id,
        name: r.name,
        handle: r.handle,
        followers: r.followers,
        verified: !!r.verified,
      })),
      eventsTotal,
      eventsToday,
      topClicked,
    });
  } catch (err) {
    return jsonError("INTERNAL", String(err?.message || err), 500);
  }
}
