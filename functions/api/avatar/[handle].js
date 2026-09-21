/**
 * GET /api/avatar/:handle
 * Proxy X profile image via unavatar, fallback ui-avatars
 */

export async function onRequestGet(context) {
  try {
    const { params } = context;
    let handle = String(params.handle || "").replace(/^@/, "").trim();
    handle = handle.replace(/[^a-zA-Z0-9_]/g, "");
    if (!handle) {
      return new Response("handle required", { status: 400 });
    }

    const sources = [
      "https://unavatar.io/twitter/" + encodeURIComponent(handle),
      "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(handle) +
        "&size=256&background=1a1a24&color=a78bfa&bold=true",
    ];

    for (const url of sources) {
      try {
        const res = await fetch(url, {
          headers: {
            Accept: "image/*",
            "User-Agent": "Mozilla/5.0 nv-pu-sa-avatar/1.0",
          },
        });
        if (!res.ok) continue;
        const ct = (res.headers.get("content-type") || "").toLowerCase();
        if (ct.includes("json") || ct.includes("text/html") || ct.includes("text/plain")) {
          continue;
        }
        const buf = await res.arrayBuffer();
        if (!buf || buf.byteLength < 200) continue;
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": ct.startsWith("image/") ? ct : "image/jpeg",
            "Cache-Control": "public, max-age=86400",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (e) {
        // try next source
      }
    }

    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">' +
      '<rect fill="#1a1a24" width="256" height="256"/>' +
      '<circle cx="128" cy="100" r="48" fill="#2a2a38"/>' +
      '<ellipse cx="128" cy="220" rx="72" ry="56" fill="#2a2a38"/>' +
      "</svg>";
    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(String(err && err.message ? err.message : err), {
      status: 500,
    });
  }
}
