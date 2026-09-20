/**
 * POST /api/admin/auth
 * Body: { "password": "..." }
 * Returns: { token, expiresIn }
 */

import {
  issueToken,
  jsonError,
  jsonOk,
  corsHeaders,
} from "../../_lib/auth.js";

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const secret = env.ADMIN_PASSWORD;

  if (!secret) {
    return jsonError(
      "SERVER_MISCONFIGURED",
      "ตั้ง ADMIN_PASSWORD ด้วย: npx wrangler pages secret put ADMIN_PASSWORD",
      500
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Body ต้องเป็น JSON");
  }

  const password = body?.password;
  if (!password || typeof password !== "string") {
    return jsonError("VALIDATION_ERROR", "ต้องส่ง password");
  }

  if (password !== secret) {
    return jsonError("UNAUTHORIZED", "รหัสผ่านไม่ถูกต้อง", 401);
  }

  const token = await issueToken(secret);
  return jsonOk({
    token,
    expiresIn: 3600,
    tokenType: "Bearer",
  });
}

export async function onRequestGet() {
  return jsonError("METHOD_NOT_ALLOWED", "ใช้ POST เท่านั้น", 405);
}
