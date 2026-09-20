// ===== นางฟ้า · แกลเลอรี่ครีเอเตอร์ X =====

let creators = [];
let filtered = [];
let currentFilter = "all";
let currentSort = "followers-desc";
let searchQuery = "";
let dataSource = "json"; // "api" | "json"

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function formatFollowers(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function normalizeCreator(c) {
  return {
    id: c.id,
    name: c.name || "",
    handle: c.handle || "",
    followers: Number(c.followers) || 0,
    verified: !!c.verified,
    bio: c.bio || "",
    avatar: c.avatar || c.avatar_url || "",
    links: c.links || {},
    tags: Array.isArray(c.tags) ? c.tags : [],
    addedAt: c.addedAt || c.added_at || "",
  };
}

/**
 * โหลดข้อมูล: ลอง API ก่อน → ถ้าไม่ได้ใช้ JSON ไฟล์
 */
async function loadData() {
  const grid = $("#creatorGrid");
  try {
    // 1) ลอง Public API
    const apiRes = await fetch("/api/creators?limit=200&sort=followers-desc", {
      headers: { Accept: "application/json" },
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (Array.isArray(data.creators) && data.creators.length > 0) {
        creators = data.creators.map(normalizeCreator);
        dataSource = "api";
        console.info("[นางฟ้า] โหลดจาก API สำเร็จ:", creators.length, "คน");
        afterLoad();
        return;
      }
    } else if (apiRes.status === 503) {
      console.warn("[นางฟ้า] D1 ยังไม่พร้อม — ใช้ JSON แทน");
    }
  } catch (e) {
    console.warn("[นางฟ้า] API ไม่พร้อม:", e.message);
  }

  // 2) Fallback: static JSON
  try {
    const res = await fetch("data/creators.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const raw = await res.json();
    creators = (Array.isArray(raw) ? raw : []).map(normalizeCreator);
    dataSource = "json";
    console.info("[นางฟ้า] โหลดจาก JSON สำเร็จ:", creators.length, "คน");
    afterLoad();
  } catch (e) {
    console.error("โหลดข้อมูลไม่สำเร็จ:", e);
    grid.innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center;">ไม่สามารถโหลดข้อมูลครีเอเตอร์ได้</p>`;
  }
}

function afterLoad() {
  updateStats();
  applyFilters();
  renderSpotlight();
}

function updateStats() {
  const total = creators.length;
  const verified = creators.filter((c) => c.verified).length;
  const maxFollowers = Math.max(...creators.map((c) => c.followers), 0);

  $("#statTotal").textContent = total;
  $("#statVerified").textContent = total ? Math.round((verified / total) * 100) + "%" : "0%";
  $("#statTopFollowers").textContent = formatFollowers(maxFollowers);

  $("#countAll").textContent = total;
  $("#countHot").textContent = creators.filter((c) => c.followers >= 50000).length;
  $("#countVerified").textContent = verified;
  $("#countTop").textContent = creators.filter((c) => c.followers >= 100000).length;
  $("#countKnown").textContent = creators.filter(
    (c) => c.followers >= 10000 && c.followers < 100000
  ).length;
  $("#countNew").textContent = creators.filter((c) => {
    if (!c.addedAt) return false;
    const d = new Date(c.addedAt);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 30;
  }).length;
}

function applyFilters() {
  let list = [...creators];

  switch (currentFilter) {
    case "hot":
      list = list.filter((c) => c.followers >= 50000);
      break;
    case "verified":
      list = list.filter((c) => c.verified);
      break;
    case "top":
      list = list.filter((c) => c.followers >= 100000);
      break;
    case "known":
      list = list.filter((c) => c.followers >= 10000 && c.followers < 100000);
      break;
    case "new":
      list = list.filter((c) => {
        if (!c.addedAt) return false;
        const d = new Date(c.addedAt);
        return (Date.now() - d) / (1000 * 60 * 60 * 24) <= 30;
      });
      break;
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        (c.bio && c.bio.toLowerCase().includes(q))
    );
  }

  switch (currentSort) {
    case "followers-desc":
      list.sort((a, b) => b.followers - a.followers);
      break;
    case "followers-asc":
      list.sort((a, b) => a.followers - b.followers);
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name, "th"));
      break;
    case "newest":
      list.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
      break;
  }

  filtered = list;
  renderGrid();
}

function renderGrid() {
  const grid = $("#creatorGrid");
  const empty = $("#emptyState");

  $("#showingCount").textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  grid.innerHTML = filtered
    .map((c) => {
      const tags = c.tags || [];
      const links = c.links || {};
      return `
    <article class="card" data-id="${c.id}">
      <div class="card-banner"></div>
      <img class="card-avatar" src="${escapeAttr(c.avatar)}" alt="${escapeAttr(c.name)}" loading="lazy" />
      <div class="card-body">
        <div class="card-name">
          ${escapeHtml(c.name)}
          ${c.verified ? '<span class="card-verified" title="ยืนยันตัวตน">✓</span>' : ""}
          ${tags.includes("Top Creator") ? '<span class="card-tag">Top Creator</span>' : ""}
        </div>
        <div class="card-handle">@${escapeHtml(c.handle)}</div>
        <div class="card-followers">👥 <strong>${formatFollowers(c.followers)}</strong> ผู้ติดตาม</div>
        <div class="card-bio">${escapeHtml(c.bio || "")}</div>
        <div class="card-links">
          ${links.x ? `<a class="card-link" href="${escapeAttr(links.x)}" target="_blank" rel="noopener">X</a>` : ""}
          ${links.onlyfans ? `<a class="card-link" href="${escapeAttr(links.onlyfans)}" target="_blank" rel="noopener">OnlyFans</a>` : ""}
          ${links.telegram ? `<a class="card-link" href="${escapeAttr(links.telegram)}" target="_blank" rel="noopener">Telegram</a>` : ""}
          ${links.linktree ? `<a class="card-link" href="${escapeAttr(links.linktree)}" target="_blank" rel="noopener">Linktree</a>` : ""}
        </div>
        <div class="card-footer">
          <span style="font-size:0.75rem;color:var(--text-muted)">เพิ่มเมื่อ ${escapeHtml(c.addedAt || "-")}</span>
          <a class="btn-visit" href="${escapeAttr(links.x || "#")}" target="_blank" rel="noopener">เยี่ยมชม X ↗</a>
        </div>
      </div>
    </article>`;
    })
    .join("");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

function renderSpotlight() {
  if (creators.length === 0) return;
  const c = creators[Math.floor(Math.random() * creators.length)];
  const body = $("#spotlightBody");
  body.innerHTML = `
    <img class="spotlight-avatar" src="${escapeAttr(c.avatar)}" alt="${escapeAttr(c.name)}" />
    <div class="spotlight-info">
      <h3>${escapeHtml(c.name)} ${c.verified ? "✓" : ""} <span class="spotlight-tag">Creator</span></h3>
      <div class="spotlight-handle">@${escapeHtml(c.handle)} · ${formatFollowers(c.followers)} ผู้ติดตาม</div>
      <div class="spotlight-bio">${escapeHtml(c.bio || "")}</div>
    </div>
  `;
  body.onclick = () => openModal(c);
  body.style.cursor = "pointer";
}

function openModal(c) {
  const links = c.links || {};
  const modal = $("#modal");
  const content = $("#modalContent");
  content.innerHTML = `
    <img class="modal-avatar" src="${escapeAttr(c.avatar)}" alt="${escapeAttr(c.name)}" />
    <div class="modal-name">${escapeHtml(c.name)} ${c.verified ? "✓" : ""}</div>
    <div class="modal-handle">@${escapeHtml(c.handle)} · ${formatFollowers(c.followers)} ผู้ติดตาม</div>
    <div class="modal-bio">${escapeHtml(c.bio || "")}</div>
    <div class="modal-actions">
      ${links.x ? `<a class="btn btn-primary" href="${escapeAttr(links.x)}" target="_blank" rel="noopener">ไปที่ X</a>` : ""}
      ${links.onlyfans ? `<a class="btn btn-ghost" href="${escapeAttr(links.onlyfans)}" target="_blank" rel="noopener">OnlyFans</a>` : ""}
      ${links.telegram ? `<a class="btn btn-ghost" href="${escapeAttr(links.telegram)}" target="_blank" rel="noopener">Telegram</a>` : ""}
      <button class="btn btn-ghost" id="btnCloseModal">ปิด</button>
    </div>
  `;
  modal.hidden = false;
  $("#btnCloseModal").onclick = closeModal;
}

function closeModal() {
  $("#modal").hidden = true;
}

async function randomExplore() {
  // ลอง API random ก่อน
  try {
    const res = await fetch("/api/creators/random");
    if (res.ok) {
      const data = await res.json();
      if (data.creator) {
        openModal(normalizeCreator(data.creator));
        return;
      }
    }
  } catch (_) {
    /* fallback */
  }
  if (creators.length === 0) return;
  openModal(creators[Math.floor(Math.random() * creators.length)]);
}

function bindEvents() {
  $("#searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    applyFilters();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      $("#searchInput").focus();
    }
    if (e.key === "Escape") closeModal();
    if ((e.key === "r" || e.key === "R") && document.activeElement.tagName !== "INPUT") {
      randomExplore();
    }
  });

  $$(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      applyFilters();
    });
  });

  $("#sortSelect").addEventListener("change", (e) => {
    currentSort = e.target.value;
    applyFilters();
  });

  $("#btnRandom").addEventListener("click", randomExplore);
  $("#btnNextSpotlight").addEventListener("click", renderSpotlight);
  $("#btnResetFilter").addEventListener("click", () => {
    searchQuery = "";
    $("#searchInput").value = "";
    currentFilter = "all";
    $$(".filter-tab").forEach((t) => t.classList.remove("active"));
    const allTab = $$('.filter-tab[data-filter="all"]')[0];
    if (allTab) allTab.classList.add("active");
    applyFilters();
  });

  $("#modalBackdrop").addEventListener("click", closeModal);
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  loadData();
});
