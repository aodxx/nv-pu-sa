/**
 * GET /api/avatar/:handle
 * Proxy profile image — tries unavatar, then ui-avatars fallback
 * Cache 1 day at edge
 */

export async function onRequestGet(context) {
  const { params, request } = context;
  const raw = (params.path || "").replace(/^@/, "").trim();
  const handle = raw.split("/")[0].replace(/[^a-zA-Z0-9_]/g, "");

  if (!handle) {
    return new Response("handle required", { status: 400 });
  }

  const sources = [
    `https://unavatar.io/twitter/${encodeURIComponent(handle)}?fallback=false`,
    `https://unavatar.io/x/${encodeURIComponent(handle)}?fallback=false`,
    `https://ui-avatars.com/api/?name=${encodeURIComponent(handle)}&size=256&background=1a1a24&color=a78bfa&bold=true`,
  ];

  for (const url of sources) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "nv-pu-sa-avatar-proxy/1.0",
          Accept: "image/*,*/*",
        },
        cf: { cacheTtl: 86400, cacheEverything: true },
      });
      if (!res.ok) continue;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("json") || ct.includes("text/html")) continue;
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 100) continue;
      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Type": ct.startsWith("image/") ? ct : "image/jpeg",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (_) {
      /* try next */
    }
  }

  // SVG placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect fill="#1a1a24" width="256" height="256"/>
  <circle cx="128" cy="100" r="48" fill="#2a2a38"/>
  <ellipse cx="128" cy="220" rx="72" ry="56" fill="#2a2a38"/>
  <text x="128" y="248" text-anchor="middle" fill="#a78bfa" font-size="20" font-family="sans-serif">@${handle.slice(0, 12)}</text>
</svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
