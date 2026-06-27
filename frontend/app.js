const API_BASE = "https://bajaj-assignment-ek64.vercel.app";

let apiResponse = null;
let selectedFile = null;

const fileInput = document.getElementById("file-input");
const fileDropZone = document.getElementById("file-drop-zone");
const fileDropContent = document.getElementById("file-drop-content");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) attachFile(file);
});

// Drag-and-drop
fileDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileDropZone.classList.add("drag-over");
});
fileDropZone.addEventListener("dragleave", () => {
  fileDropZone.classList.remove("drag-over");
});
fileDropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  fileDropZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) attachFile(file);
});

function attachFile(file) {
  selectedFile = file;
  fileDropZone.classList.add("has-file");
  fileDropContent.innerHTML = `
    <span style="font-size:20px">✅</span>
    <span><strong>${escHtml(file.name)}</strong>&nbsp;&nbsp;
    <span style="color:var(--text-muted)">(${formatBytes(file.size)})</span></span>`;
}

// ─── Submit ───────────────────────────────────────────
async function submitData() {
  const jsonInput = document.getElementById("json-input").value.trim();
  const jsonError = document.getElementById("json-error");
  const submitBtn = document.getElementById("submit-btn");
  const spinner = document.getElementById("spinner");
  const btnText = document.getElementById("btn-text");

  jsonError.classList.add("hidden");
  jsonError.textContent = "⚠ Invalid JSON — please check your input";

  let parsed;
  try {
    if (!jsonInput) throw new Error("empty");
    parsed = JSON.parse(jsonInput);
  } catch {
    jsonError.classList.remove("hidden");
    shakeElement(document.getElementById("json-input"));
    return;
  }

  if (!parsed.data || !Array.isArray(parsed.data)) {
    jsonError.textContent = '⚠ JSON must contain a "data" key with an array value.';
    jsonError.classList.remove("hidden");
    return;
  }

  // Loading state
  submitBtn.disabled = true;
  spinner.classList.remove("hidden");
  btnText.textContent = "Processing…";

  try {
    if (selectedFile && !parsed.file_b64) {
      parsed.file_b64 = await fileToBase64(selectedFile);
    }

    const res = await fetch(`${API_BASE}/bfhl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    apiResponse = await res.json();

    document.getElementById("filter-card").classList.remove("hidden");
    document.getElementById("response-card").classList.remove("hidden");
    renderFiltered();

  } catch (err) {
    showError(`❌ ${err.message}. Is the backend running on ${API_BASE}?`);
  } finally {
    submitBtn.disabled = false;
    spinner.classList.add("hidden");
    btnText.textContent = "Submit →";
  }
}

// ─── Filter & Render ──────────────────────────────────
function renderFiltered() {
  if (!apiResponse) return;

  const statusBadge = document.getElementById("status-badge");
  const responseContent = document.getElementById("response-content");

  statusBadge.textContent = apiResponse.is_success ? "✓ 200 OK" : "✗ Error";
  statusBadge.className = `status-badge ${apiResponse.is_success ? "success" : "error"}`;

  const selectEl = document.getElementById("filter-select");
  const selected = Array.from(selectEl.selectedOptions).map(o => o.value);

  if (selected.length === 0) {
    responseContent.innerHTML = `
      <div class="empty-state">
        <span style="font-size:32px">☝️</span>
        <p>Select one or more fields above to see the response.</p>
      </div>`;
    return;
  }

  let html = "";

  if (selected.includes("numbers")) {
    html += renderBlock("🔢 Numbers", renderTags(apiResponse.numbers, "tag-number"));
  }
  if (selected.includes("alphabets")) {
    html += renderBlock("🔤 Alphabets", renderTags(apiResponse.alphabets, "tag-alpha"));
  }
  if (selected.includes("highest")) {
    html += renderBlock("⭐ Highest Alphabet", renderTags(apiResponse.highest_lowercase_alphabet, "tag-highest"));
  }
  if (selected.includes("prime")) {
    html += renderBlock("🔍 Prime Found?", renderBool(apiResponse.is_prime_found));
  }
  if (selected.includes("file")) {
    html += renderBlock("📎 File Info", renderFileInfo(apiResponse));
  }

  responseContent.innerHTML = html || "<p class='empty-msg'>Nothing to show.</p>";
}

// ─── Render Helpers ───────────────────────────────────
function renderBlock(label, inner) {
  return `
    <div class="response-block">
      <div class="response-block-label">${label}</div>
      <div class="response-block-body">${inner}</div>
    </div>`;
}

function renderTags(arr, cls) {
  if (!arr || arr.length === 0) return `<span class="empty-msg">None</span>`;
  return `<div class="tag-list">${arr.map(v => `<span class="tag ${cls}">${escHtml(v)}</span>`).join("")}</div>`;
}

function renderBool(val) {
  return val
    ? `<span class="bool-badge bool-true">✅ Yes — prime number found</span>`
    : `<span class="bool-badge bool-false">❌ No prime numbers found</span>`;
}

function renderFileInfo(d) {
  if (!d.file_valid) return `<span class="empty-msg">No file attached or invalid</span>`;
  return `
    <div class="file-info-grid">
      <div class="fi-row"><span class="fi-key">MIME Type</span><span class="fi-val">${escHtml(d.file_mime_type || "unknown")}</span></div>
      <div class="fi-row"><span class="fi-key">Size</span><span class="fi-val">${escHtml(String(d.file_size_kb))} KB</span></div>
    </div>`;
}

function showError(msg) {
  const responseCard = document.getElementById("response-card");
  const statusBadge = document.getElementById("status-badge");
  const responseContent = document.getElementById("response-content");

  responseCard.classList.remove("hidden");
  statusBadge.textContent = "✗ Error";
  statusBadge.className = "status-badge error";
  responseContent.innerHTML = `<div class="response-block"><div class="response-block-body" style="color:var(--error)">${msg}</div></div>`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shakeElement(el) {
  el.style.animation = "none";
  el.getBoundingClientRect();
  el.style.animation = "shake 0.35s ease";
  setTimeout(() => (el.style.animation = ""), 400);
}

const _ks = document.createElement("style");
_ks.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }`;
document.head.appendChild(_ks);

document.getElementById("json-input").addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submitData();
});
