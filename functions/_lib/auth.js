/**
 * Simple signed admin token (HMAC-SHA256 via Web Crypto)
 * Token format: base64url(payloadJson).base64url(signature)
 */

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function b64url(buf) {
  const bytes = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function issueToken(secret) {
  const payload = {
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
    role: "admin",
  };
  const payloadB64 = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );
  return `${payloadB64}.${b64url(sig)}`;
}

export async function verifyToken(token, secret) {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlDecode(sigB64),
      new TextEncoder().encode(payloadB64)
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64)));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization: Bearer ... or X-Admin-Token
 */
export function extractToken(request) {
  const auth = request.headers.get("Authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  return request.headers.get("X-Admin-Token") || "";
}

export async function requireAdmin(request, env) {
  const secret = env.ADMIN_PASSWORD;
  if (!secret) {
    return {
      ok: false,
      response: jsonError("SERVER_MISCONFIGURED", "ADMIN_PASSWORD secret ยังไม่ได้ตั้ง", 500),
    };
  }
  const token = extractToken(request);
  const payload = await verifyToken(token, secret);
  if (!payload) {
    return {
      ok: false,
      response: jsonError("UNAUTHORIZED", "ต้อง login หรือ token หมดอายุ", 401),
    };
  }
  return { ok: true, payload };
}

export function jsonError(code, message, status = 400) {
  return Response.json({ error: code, message }, { status });
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
  };
}

export function jsonOk(data, status = 200) {
  return Response.json(data, { status, headers: corsHeaders() });
}
