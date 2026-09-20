// ===== Admin Console · นางฟ้า =====

const TOKEN_KEY = "nangfa_admin_token";
const $ = (s) => document.querySelector(s);

let token = localStorage.getItem(TOKEN_KEY) || "";
let allCreators = [];
let editingId = null;

function formatFollowers(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n ?? 0);
}

function toast(msg, type = "ok") {
  const el = $("#toast");
  el.textContent = msg;
  el.className = "toast " + type;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 2800);
}

async function api(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(path, { ...options, headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (res.status === 401) {
    logout(false);
    throw new Error(data.message || "Unauthorized");
  }
  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP ${res.status}`);
  }
  return data;
}

function showLogin() {
  $("#loginView").hidden = false;
  $("#dashView").hidden = true;
}

function showDash() {
  $("#loginView").hidden = true;
  $("#dashView").hidden = false;
}

function logout(showMsg = true) {
  token = "";
  localStorage.removeItem(TOKEN_KEY);
  showLogin();
  if (showMsg) toast("ออกจากระบบแล้ว");
}

async function tryRestoreSession() {
  if (!token) {
    showLogin();
    return;
  }
  try {
    await api("../api/admin/stats");
    showDash();
    await loadAll();
  } catch {
    token = "";
    localStorage.removeItem(TOKEN_KEY);
    showLogin();
  }
}

async function doLogin(e) {
  e.preventDefault();
  const password = $("#passwordInput").value;
  const err = $("#loginError");
  const btn = $("#loginBtn");
  err.hidden = true;
  btn.disabled = true;
  btn.textContent = "กำลังเข้าสู่ระบบ...";
  try {
    const data = await api("../api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    token = data.token;
    localStorage.setItem(TOKEN_KEY, token);
    $("#passwordInput").value = "";
    showDash();
    toast("เข้าสู่ระบบสำเร็จ");
    await loadAll();
  } catch (ex) {
    err.textContent = ex.message || "เข้าสู่ระบบไม่สำเร็จ";
    err.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = "เข้าสู่ระบบ";
  }
}

async function loadStats() {
  try {
    const s = await api("../api/admin/stats");
    $("#sVisible").textContent = s.visible ?? "-";
    $("#sHidden").textContent = s.hidden ?? "-";
    $("#sVerified").textContent =
      s.verified != null ? `${s.verified} (${s.verifiedPercent || 0}%)` : "-";
    $("#sMax").textContent = formatFollowers(s.maxFollowers || 0);
  } catch (e) {
    console.warn("stats", e);
  }
}

async function loadAll() {
  $("#tableBody").innerHTML =
    '<tr><td colspan="7" class="loading-cell">กำลังโหลด...</td></tr>';
  try {
    const data = await api("../api/admin/creators?includeDeleted=1");
    allCreators = data.creators || [];
    renderTable();
    await loadStats();
  } catch (e) {
    $("#tableBody").innerHTML = `<tr><td colspan="7" class="loading-cell">${escapeHtml(
      e.message
    )}</td></tr>`;
  }
}

function getFiltered() {
  const q = ($("#adminSearch").value || "").toLowerCase().trim();
  const f = $("#adminFilter").value;
  let list = [...allCreators];

  if (f === "visible") list = list.filter((c) => !c.isHidden && !c.isDeleted);
  else if (f === "hidden") list = list.filter((c) => c.isHidden && !c.isDeleted);
  else if (f === "deleted") list = list.filter((c) => c.isDeleted);
  else list = list.filter((c) => !c.isDeleted);

  if (q) {
    list = list.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.handle || "").toLowerCase().includes(q)
    );
  }
  return list;
}

function statusBadge(c) {
  if (c.isDeleted) return '<span class="badge badge-del">ลบแล้ว</span>';
  if (c.isHidden) return '<span class="badge badge-hide">ซ่อน</span>';
  return '<span class="badge badge-ok">แสดง</span>';
}

function renderTable() {
  const list = getFiltered();
  if (!list.length) {
    $("#tableBody").innerHTML =
      '<tr><td colspan="7" class="loading-cell">ไม่พบข้อมูล</td></tr>';
    return;
  }
  $("#tableBody").innerHTML = list
    .map((c) => {
      const tags = (c.tags || []).slice(0, 3).join(", ");
      return `<tr data-id="${c.id}">
        <td>${c.id}</td>
        <td>${escapeHtml(c.name)}${c.verified ? ' <span class="badge badge-ver">✓</span>' : ""}</td>
        <td>@${escapeHtml(c.handle)}</td>
        <td>${formatFollowers(c.followers)}</td>
        <td>${statusBadge(c)}</td>
        <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(tags)}</td>
        <td class="row-actions">
          <button class="btn btn-ghost btn-sm" data-act="edit">แก้ไข</button>
          ${
            c.isDeleted
              ? `<button class="btn btn-ghost btn-sm" data-act="restore">กู้คืน</button>`
              : c.isHidden
                ? `<button class="btn btn-ghost btn-sm" data-act="unhide">แสดง</button>`
                : `<button class="btn btn-ghost btn-sm" data-act="hide">ซ่อน</button>`
          }
          ${
            !c.isDeleted
              ? `<button class="btn btn-ghost btn-sm btn-danger" data-act="delete">ลบ</button>`
              : `<button class="btn btn-ghost btn-sm btn-danger" data-act="hard">ลบถาวร</button>`
          }
        </td>
      </tr>`;
    })
    .join("");
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function openForm(creator = null) {
  editingId = creator ? creator.id : null;
  $("#formTitle").textContent = creator ? "แก้ไขครีเอเตอร์" : "เพิ่มครีเอเตอร์";
  $("#fId").value = creator?.id || "";
  $("#fName").value = creator?.name || "";
  $("#fHandle").value = creator?.handle || "";
  $("#fFollowers").value = creator?.followers ?? 0;
  $("#fVerified").checked = !!creator?.verified;
  $("#fBio").value = creator?.bio || "";
  $("#fAvatar").value = creator?.avatar || "";
  const links = creator?.links || {};
  $("#fLinkX").value = links.x || "";
  $("#fLinkOf").value = links.onlyfans || "";
  $("#fLinkTg").value = links.telegram || "";
  $("#fLinkLt").value = links.linktree || "";
  $("#fTags").value = (creator?.tags || []).join(", ");
  $("#fNotes").value = creator?.notes || "";
  $("#formError").hidden = true;
  $("#formModal").hidden = false;
}

function closeForm() {
  $("#formModal").hidden = true;
  editingId = null;
}

function collectForm() {
  const tags = ($("#fTags").value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    name: $("#fName").value.trim(),
    handle: $("#fHandle").value.trim().replace(/^@/, ""),
    followers: Number($("#fFollowers").value) || 0,
    verified: $("#fVerified").checked,
    bio: $("#fBio").value.trim() || null,
    avatar: $("#fAvatar").value.trim() || null,
    links: {
      x: $("#fLinkX").value.trim() || null,
      onlyfans: $("#fLinkOf").value.trim() || null,
      telegram: $("#fLinkTg").value.trim() || null,
      linktree: $("#fLinkLt").value.trim() || null,
    },
    tags,
    notes: $("#fNotes").value.trim() || null,
  };
}

async function submitForm(e) {
  e.preventDefault();
  const body = collectForm();
  const err = $("#formError");
  const btn = $("#formSubmit");
  err.hidden = true;
  btn.disabled = true;
  try {
    if (editingId) {
      await api(`../api/admin/creators/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      toast("บันทึกการแก้ไขแล้ว");
    } else {
      await api("../api/admin/creators", {
        method: "POST",
        body: JSON.stringify(body),
      });
      toast("เพิ่มครีเอเตอร์แล้ว");
    }
    closeForm();
    await loadAll();
  } catch (ex) {
    err.textContent = ex.message;
    err.hidden = false;
  } finally {
    btn.disabled = false;
  }
}

async function rowAction(id, act) {
  try {
    if (act === "edit") {
      const c = allCreators.find((x) => x.id === id);
      if (c) openForm(c);
      return;
    }
    if (act === "hide" || act === "unhide" || act === "restore") {
      await api(`../api/admin/creators/${id}`, {
        method: "POST",
        body: JSON.stringify({ action: act }),
      });
      toast(
        act === "hide" ? "ซ่อนแล้ว" : act === "unhide" ? "แสดงแล้ว" : "กู้คืนแล้ว"
      );
      await loadAll();
      return;
    }
    if (act === "delete") {
      if (!confirm("Soft delete ครีเอเตอร์นี้?")) return;
      await api(`../api/admin/creators/${id}`, { method: "DELETE" });
      toast("ลบแล้ว (soft)");
      await loadAll();
      return;
    }
    if (act === "hard") {
      if (!confirm("ลบถาวร? กู้คืนไม่ได้")) return;
      await api(`../api/admin/creators/${id}?hard=true`, { method: "DELETE" });
      toast("ลบถาวรแล้ว");
      await loadAll();
    }
  } catch (e) {
    toast(e.message, "err");
  }
}

function bindEvents() {
  $("#loginForm").addEventListener("submit", doLogin);
  $("#logoutBtn").addEventListener("click", () => logout());
  $("#btnAdd").addEventListener("click", () => openForm());
  $("#btnRefresh").addEventListener("click", () => loadAll());
  $("#adminSearch").addEventListener("input", renderTable);
  $("#adminFilter").addEventListener("change", renderTable);
  $("#formCancel").addEventListener("click", closeForm);
  $("#formBackdrop").addEventListener("click", closeForm);
  $("#creatorForm").addEventListener("submit", submitForm);

  $("#tableBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const tr = btn.closest("tr[data-id]");
    if (!tr) return;
    rowAction(Number(tr.dataset.id), btn.dataset.act);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  tryRestoreSession();
});
