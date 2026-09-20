// ===== นางฟ้า · แกลเลอรี่ครีเอเตอร์ X =====

let creators = [];
let filtered = [];
let currentFilter = "all";
let currentSort = "followers-desc";
let searchQuery = "";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Format number
function formatFollowers(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

// Load data
async function loadData() {
  try {
    const res = await fetch("data/creators.json");
    creators = await res.json();
    updateStats();
    applyFilters();
    renderSpotlight();
  } catch (e) {
    console.error("โหลดข้อมูลไม่สำเร็จ:", e);
    $("#creatorGrid").innerHTML = `<p style="color:var(--text-muted);padding:40px;text-align:center;">ไม่สามารถโหลดข้อมูลครีเอเตอร์ได้</p>`;
  }
}

// Stats
function updateStats() {
  const total = creators.length;
  const verified = creators.filter((c) => c.verified).length;
  const maxFollowers = Math.max(...creators.map((c) => c.followers), 0);

  $("#statTotal").textContent = total;
  $("#statVerified").textContent = total ? Math.round((verified / total) * 100) + "%" : "0%";
  $("#statTopFollowers").textContent = formatFollowers(maxFollowers);

  // filter counts
  $("#countAll").textContent = total;
  $("#countHot").textContent = creators.filter((c) => c.followers >= 50000).length;
  $("#countVerified").textContent = verified;
  $("#countTop").textContent = creators.filter((c) => c.followers >= 100000).length;
  $("#countKnown").textContent = creators.filter((c) => c.followers >= 10000 && c.followers < 100000).length;
  $("#countNew").textContent = creators.filter((c) => {
    const d = new Date(c.addedAt);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 30;
  }).length;
}

// Filter + Search + Sort
function applyFilters() {
  let list = [...creators];

  // Filter
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
        const d = new Date(c.addedAt);
        const now = new Date();
        return (now - d) / (1000 * 60 * 60 * 24) <= 30;
      });
      break;
  }

  // Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        (c.bio && c.bio.toLowerCase().includes(q))
    );
  }

  // Sort
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
      list.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      break;
  }

  filtered = list;
  renderGrid();
}

// Render cards
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
    .map(
      (c) => `
    <article class="card" data-id="${c.id}">
      <div class="card-banner"></div>
      <img class="card-avatar" src="${c.avatar}" alt="${c.name}" loading="lazy" />
      <div class="card-body">
        <div class="card-name">
          ${escapeHtml(c.name)}
          ${c.verified ? '<span class="card-verified" title="ยืนยันตัวตน">✓</span>' : ""}
          ${c.tags.includes("Top Creator") ? '<span class="card-tag">Top Creator</span>' : ""}
        </div>
        <div class="card-handle">@${escapeHtml(c.handle)}</div>
        <div class="card-followers">👥 <strong>${formatFollowers(c.followers)}</strong> ผู้ติดตาม</div>
        <div class="card-bio">${escapeHtml(c.bio || "")}</div>
        <div class="card-links">
          ${c.links.x ? `<a class="card-link" href="${c.links.x}" target="_blank" rel="noopener">X</a>` : ""}
          ${c.links.onlyfans ? `<a class="card-link" href="${c.links.onlyfans}" target="_blank" rel="noopener">OnlyFans</a>` : ""}
          ${c.links.telegram ? `<a class="card-link" href="${c.links.telegram}" target="_blank" rel="noopener">Telegram</a>` : ""}
          ${c.links.linktree ? `<a class="card-link" href="${c.links.linktree}" target="_blank" rel="noopener">Linktree</a>` : ""}
        </div>
        <div class="card-footer">
          <span style="font-size:0.75rem;color:var(--text-muted)">เพิ่มเมื่อ ${c.addedAt}</span>
          <a class="btn-visit" href="${c.links.x || "#"}" target="_blank" rel="noopener">เยี่ยมชม X ↗</a>
        </div>
      </div>
    </article>
  `
    )
    .join("");
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Spotlight
function renderSpotlight() {
  if (creators.length === 0) return;
  const c = creators[Math.floor(Math.random() * creators.length)];
  const body = $("#spotlightBody");
  body.innerHTML = `
    <img class="spotlight-avatar" src="${c.avatar}" alt="${c.name}" />
    <div class="spotlight-info">
      <h3>${escapeHtml(c.name)} ${c.verified ? "✓" : ""} <span class="spotlight-tag">Creator</span></h3>
      <div class="spotlight-handle">@${escapeHtml(c.handle)} · ${formatFollowers(c.followers)} ผู้ติดตาม</div>
      <div class="spotlight-bio">${escapeHtml(c.bio || "")}</div>
    </div>
  `;
  body.onclick = () => openModal(c);
  body.style.cursor = "pointer";
}

// Modal (random / detail)
function openModal(c) {
  const modal = $("#modal");
  const content = $("#modalContent");
  content.innerHTML = `
    <img class="modal-avatar" src="${c.avatar}" alt="${c.name}" />
    <div class="modal-name">${escapeHtml(c.name)} ${c.verified ? "✓" : ""}</div>
    <div class="modal-handle">@${escapeHtml(c.handle)} · ${formatFollowers(c.followers)} ผู้ติดตาม</div>
    <div class="modal-bio">${escapeHtml(c.bio || "")}</div>
    <div class="modal-actions">
      ${c.links.x ? `<a class="btn btn-primary" href="${c.links.x}" target="_blank" rel="noopener">ไปที่ X</a>` : ""}
      ${c.links.onlyfans ? `<a class="btn btn-ghost" href="${c.links.onlyfans}" target="_blank" rel="noopener">OnlyFans</a>` : ""}
      ${c.links.telegram ? `<a class="btn btn-ghost" href="${c.links.telegram}" target="_blank" rel="noopener">Telegram</a>` : ""}
      <button class="btn btn-ghost" id="btnCloseModal">ปิด</button>
    </div>
  `;
  modal.hidden = false;
  $("#btnCloseModal").onclick = closeModal;
}

function closeModal() {
  $("#modal").hidden = true;
}

// Random explore
function randomExplore() {
  if (creators.length === 0) return;
  const c = creators[Math.floor(Math.random() * creators.length)];
  openModal(c);
}

// Events
function bindEvents() {
  // Search
  $("#searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    applyFilters();
  });

  // Keyboard shortcut /
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      $("#searchInput").focus();
    }
    if (e.key === "Escape") closeModal();
    if (e.key === "r" || e.key === "R") {
      if (document.activeElement.tagName !== "INPUT") randomExplore();
    }
  });

  // Filter tabs
  $$(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      applyFilters();
    });
  });

  // Sort
  $("#sortSelect").addEventListener("change", (e) => {
    currentSort = e.target.value;
    applyFilters();
  });

  // Buttons
  $("#btnRandom").addEventListener("click", randomExplore);
  $("#btnNextSpotlight").addEventListener("click", renderSpotlight);
  $("#btnResetFilter").addEventListener("click", () => {
    searchQuery = "";
    $("#searchInput").value = "";
    currentFilter = "all";
    $$(".filter-tab").forEach((t) => t.classList.remove("active"));
    $$('.filter-tab[data-filter="all"]')[0].classList.add("active");
    applyFilters();
  });

  // Modal backdrop
  $("#modalBackdrop").addEventListener("click", closeModal);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  loadData();
});
