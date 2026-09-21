/**
 * POST /api/admin/upload
 * multipart form: file + optional creatorId
 * Requires R2 binding AVATARS and admin auth
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

export async function onRequestPost(context) {
  const { env, request } = context;
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;

  if (!env.AVATARS) {
    return jsonError(
      "R2_NOT_CONFIGURED",
      "ยังไม่ได้ผูก R2 bucket (binding ชื่อ AVATARS) — ดู docs/DEPLOY_CLOUDFLARE.md",
      503
    );
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return jsonError("VALIDATION_ERROR", "ต้องส่ง multipart/form-data");
  }

  const file = form.get("file");
  if (!file || typeof file === "string" || !file.stream) {
    return jsonError("VALIDATION_ERROR", "ต้องมีไฟล์ field ชื่อ file");
  }

  const contentType = file.type || "application/octet-stream";
  if (!contentType.startsWith("image/")) {
    return jsonError("VALIDATION_ERROR", "รับเฉพาะไฟล์รูปภาพ");
  }

  const maxBytes = 2 * 1024 * 1024; // 2MB
  const buf = await file.arrayBuffer();
  if (buf.byteLength > maxBytes) {
    return jsonError("VALIDATION_ERROR", "ไฟล์ใหญ่เกิน 2MB");
  }

  const ext =
    contentType === "image/png"
      ? "png"
      : contentType === "image/webp"
        ? "webp"
        : contentType === "image/gif"
          ? "gif"
          : "jpg";

  const creatorId = form.get("creatorId") || form.get("creator_id") || "misc";
  const key = `avatars/${creatorId}/${Date.now()}.${ext}`;

  try {
    await env.AVATARS.put(key, buf, {
      httpMetadata: { contentType },
    });

    // Public URL depends on R2 custom domain or r2.dev
    const base = env.R2_PUBLIC_BASE || "";
    const url = base ? `${base.replace(/\/$/, "")}/${key}` : key;

    return jsonOk({ key, url, contentType, size: buf.byteLength }, 201);
  } catch (err) {
    return jsonError("INTERNAL", String(err?.message || err), 500);
  }
}
