/* =============================================================
   Claude Code Documentation — Navigation & Interactivity
   ============================================================= */

const NAV = [
  {
    title: "Getting Started",
    icon: "🏠",
    items: [
      { title: "Documentation Hub",    path: "index.html" },
      { title: "Feature Overview",     path: "overview.html" },
      { title: "Developer Cheatsheet", path: "cheatsheet.html" }
    ]
  },
  {
    title: "Claude Code CLI",
    icon: "⌨️",
    items: [
      { title: "Overview",              path: "claude-code/index.html" },
      // Phase 1 — Get Up and Running
      { title: "Getting Started",       path: "claude-code/getting-started.html" },
      { title: "Permissions & Safety",  path: "claude-code/permissions.html" },
      { title: "CLI Commands & Flags",  path: "claude-code/cli-commands.html" },
      { title: "Slash Commands",        path: "claude-code/slash-commands.html" },
      { title: "Keyboard Shortcuts",    path: "claude-code/keyboard-shortcuts.html" },
      // Phase 2 — Work Smarter Every Day
      { title: "CLAUDE.md",             path: "claude-code/claude-md.html" },
      { title: "Plan Mode",             path: "claude-code/plan-mode.html" },
      { title: "Context Management",    path: "claude-code/context-management.html" },
      { title: "Git Integration",       path: "claude-code/git-integration.html" },
      { title: "Memory System",         path: "claude-code/memory-system.html" },
      { title: "Cost Tracking",         path: "claude-code/cost-tracking.html" },
      // Phase 3 — Unlock Power Features
      { title: "Subagents",             path: "claude-code/subagents.html" },
      { title: "Skills",                path: "claude-code/skills.html" },
      { title: "Hooks",                 path: "claude-code/hooks.html" },
      { title: "MCP Servers",           path: "claude-code/mcp-servers.html" },
      { title: "Settings & Config",     path: "claude-code/settings.html" },
      { title: "Extended Thinking",     path: "claude-code/thinking-mode.html" },
      // Phase 4 — Specialise for Your Setup
      { title: "Headless Mode",         path: "claude-code/headless-mode.html" },
      { title: "Output Formats",        path: "claude-code/output-formats.html" },
      { title: "IDE Integration",       path: "claude-code/ide-integration.html" },
      { title: "Fast Mode",             path: "claude-code/fast-mode.html" },
      { title: "Task List",             path: "claude-code/task-list.html" },
      { title: "Vision & Multimodal",   path: "claude-code/vision-multimodal.html" },
      { title: "Chrome Integration",    path: "claude-code/chrome-integration.html" }
    ]
  },
  {
    title: "VS Code Extension",
    icon: "💻",
    items: [
      { title: "Overview",              path: "vscode/index.html" },
      { title: "Installation",          path: "vscode/installation.html" },
      { title: "Connecting to IDE",     path: "vscode/connecting-to-ide.html" },
      { title: "Prompt Box",            path: "vscode/prompt-box.html" },
      { title: "File References (@)",   path: "vscode/file-references.html" },
      { title: "Selected Code Context", path: "vscode/selected-code-context.html" },
      { title: "Clickable Links",       path: "vscode/clickable-links.html" },
      { title: "Session Management",    path: "vscode/session-management.html" },
      { title: "Keyboard Shortcuts",    path: "vscode/keyboard-shortcuts.html" },
      { title: "Remote Development",    path: "vscode/remote-development.html" },
      { title: "Settings & Config",     path: "vscode/settings-configuration.html" },
      { title: "Slash Commands",        path: "vscode/slash-commands-in-vscode.html" },
      { title: "Workflow Tips",         path: "vscode/workflow-tips.html" }
    ]
  },
  {
    title: "Workflows",
    icon: "🔄",
    items: [
      { title: "Overview",               path: "workflows/index.html" },
      { title: "Team Lead Setup",        path: "workflows/team-lead-setup.html" },
      { title: "Backend Developer",      path: "workflows/backend.html" },
      { title: "Frontend Developer",     path: "workflows/frontend.html" },
      { title: "Fullstack Developer",    path: "workflows/fullstack.html" },
      { title: "Figma to Frontend",      path: "workflows/figma-to-frontend.html" },
      { title: "Frontend to Backend",    path: "workflows/frontend-to-backend.html" },
      { title: "Testing",                path: "workflows/testing.html" },
      { title: "Code Review",            path: "workflows/code-review.html" }
    ]
  },
  {
    title: "Laravel Workflows",
    icon: "🔴",
    items: [
      { title: "Overview",    path: "workflows/laravel/index.html" },
      { title: "Fullstack",   path: "workflows/laravel/fullstack.html" },
      { title: "Backend",     path: "workflows/laravel/backend.html" },
      { title: "Frontend",    path: "workflows/laravel/frontend.html" },
      { title: "Database",    path: "workflows/laravel/database.html" },
      { title: "Testing",     path: "workflows/laravel/testing.html" },
      { title: "PR Review",   path: "workflows/laravel/pr-review.html" }
    ]
  }
];

// ── Helpers ──────────────────────────────────────────────────

function getDepth() {
  return parseInt(document.documentElement.dataset.depth || "0", 10);
}

function getPrefix() {
  return "../".repeat(getDepth());
}

/** Return path relative to docs root for current page */
function getCurrentRelPath() {
  const depth = getDepth();
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts.slice(-(depth + 1)).join("/");
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ── Sidebar Build ─────────────────────────────────────────────

function buildSidebar() {
  const nav = document.getElementById("sidebarNav");
  if (!nav) return;

  const prefix    = getPrefix();
  const curPath   = getCurrentRelPath();

  let html = "";
  NAV.forEach((section, i) => {
    const id       = "sec-" + i;
    const hasActive = section.items.some(it => it.path === curPath);
    // Keep active section expanded by default; others collapsed if many sections
    const collapsed = (!hasActive && i > 0) ? "" : "";

    html += `<div class="nav-section ${collapsed}" id="${id}">`;
    html += `<div class="nav-section-header" onclick="toggleSection('${id}')">`;
    html += `<span class="sec-title"><span class="sec-icon">${section.icon}</span>${section.title}</span>`;
    html += `<span class="sec-chevron">▾</span>`;
    html += `</div><ul class="nav-items">`;

    section.items.forEach(item => {
      const href    = prefix + item.path;
      const active  = item.path === curPath ? " active" : "";
      html += `<li><a href="${href}" class="${active.trim()}">${item.title}</a></li>`;
    });

    html += `</ul></div>`;
  });

  nav.innerHTML = html;
}

function toggleSection(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("collapsed");
}

// ── Mobile Menu ───────────────────────────────────────────────

function initMobileMenu() {
  const btn     = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (!btn) return;

  function close() {
    btn.classList.remove("open");
    sidebar.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  btn.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
    overlay.classList.toggle("visible", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  overlay.addEventListener("click", close);

  // Close on nav click (mobile)
  document.querySelectorAll(".nav-items a").forEach(a =>
    a.addEventListener("click", close)
  );
}

// ── Sidebar Search ────────────────────────────────────────────

function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();

    document.querySelectorAll(".nav-section").forEach(section => {
      const items   = section.querySelectorAll(".nav-items li");
      let anyVisible = false;

      items.forEach(li => {
        const match = !q || li.textContent.toLowerCase().includes(q);
        li.classList.toggle("search-hidden", !match);
        if (match) anyVisible = true;
      });

      // Expand sections with matches; collapse empty ones
      if (q) {
        section.classList.toggle("collapsed", !anyVisible);
      }
    });
  });
}

// ── Scroll active link into view ──────────────────────────────

function scrollActiveLink() {
  const active = document.querySelector(".nav-items a.active");
  if (active) {
    setTimeout(() => active.scrollIntoView({ block: "nearest", behavior: "instant" }), 50);
  }
}

// ── Full-Text Search Modal ────────────────────────────────────

let _searchIndex = null;

async function loadIndex() {
  if (_searchIndex) return _searchIndex;
  try {
    const res = await fetch(getPrefix() + "search-index.json");
    _searchIndex = await res.json();
  } catch (e) {
    _searchIndex = [];
  }
  return _searchIndex;
}

function scoreAndSearch(query) {
  if (!_searchIndex || !query.trim()) return [];
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  if (!words.length) return [];
  return _searchIndex
    .map(page => {
      const tl = page.title.toLowerCase();
      const cl = page.content.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (tl === w)           score += 50;
        else if (tl.startsWith(w)) score += 30;
        else if (tl.includes(w))   score += 20;
        let i = 0;
        while ((i = cl.indexOf(w, i)) !== -1) { score++; i += w.length; }
      }
      return { ...page, score };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function makeSnippet(content, words, len = 180) {
  const lo = content.toLowerCase();
  let pos = content.length;
  for (const w of words) {
    const i = lo.indexOf(w);
    if (i !== -1 && i < pos) pos = i;
  }
  const start = Math.max(0, pos - 60);
  const end   = Math.min(content.length, start + len);
  return (start > 0 ? "…" : "") + content.slice(start, end) + (end < content.length ? "…" : "");
}

function hlText(text, words) {
  let out = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  for (const w of words) {
    const re = new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    out = out.replace(re, "<mark>$1</mark>");
  }
  return out;
}

let _selIdx = -1;

function renderSearchResults(results, query) {
  const box = document.getElementById("smResults");
  if (!box) return;
  _selIdx = -1;

  if (!query.trim()) {
    box.innerHTML = `<p class="sm-hint">Type to search across all docs…</p>`;
    return;
  }
  if (!results.length) {
    box.innerHTML = `<p class="sm-hint">No results for <strong>${query}</strong></p>`;
    return;
  }

  const words  = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const prefix = getPrefix();
  box.innerHTML = results.map((p, i) => {
    const snip  = makeSnippet(p.content, words);
    const crumb = p.url.replace(/\.html$/, "").replace(/\//g, " › ");
    return `<a class="sm-result" href="${prefix + p.url}" data-idx="${i}">
      <div class="sm-result-title">${hlText(p.title, words)}</div>
      <div class="sm-result-crumb">${crumb}</div>
      <div class="sm-result-snip">${hlText(snip, words)}</div>
    </a>`;
  }).join("");

  box.querySelectorAll(".sm-result").forEach(el =>
    el.addEventListener("click", closeSearchModal)
  );
}

function updateSearchSel() {
  const items = document.querySelectorAll(".sm-result");
  items.forEach((el, i) => el.classList.toggle("selected", i === _selIdx));
  if (_selIdx >= 0) items[_selIdx]?.scrollIntoView({ block: "nearest" });
}

function openSearchModal() {
  const modal = document.getElementById("searchModal");
  if (!modal) return;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  const input = document.getElementById("smInput");
  if (input) { input.value = ""; input.focus(); }
  const box = document.getElementById("smResults");
  if (box) box.innerHTML = `<p class="sm-hint">Type to search across all docs…</p>`;
  loadIndex();
}

function closeSearchModal() {
  const modal = document.getElementById("searchModal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function injectSearchModal() {
  // ── Trigger button injected into sidebar ──
  const sidebarSearch = document.querySelector(".sidebar-search");
  if (sidebarSearch) {
    const btn = document.createElement("button");
    btn.id = "searchTrigger";
    btn.className = "search-trigger";
    btn.setAttribute("aria-label", "Search documentation");
    btn.innerHTML = `<svg class="st-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="14" y2="14"/></svg><span class="st-label">Search docs…</span><kbd class="st-kbd">⌘K</kbd>`;
    btn.addEventListener("click", openSearchModal);
    sidebarSearch.parentNode.insertBefore(btn, sidebarSearch);
  }

  // ── Modal markup ──
  const modal = document.createElement("div");
  modal.id = "searchModal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="sm-backdrop" id="smBackdrop"></div>
    <div class="sm-dialog" role="dialog" aria-modal="true" aria-label="Search documentation">
      <div class="sm-input-row">
        <svg class="sm-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="14" y2="14"/></svg>
        <input id="smInput" type="search" placeholder="Search documentation…" autocomplete="off" spellcheck="false">
        <button class="sm-close" id="smClose" aria-label="Close search">✕</button>
      </div>
      <div class="sm-results" id="smResults">
        <p class="sm-hint">Type to search across all docs…</p>
      </div>
      <div class="sm-footer">
        <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span><kbd>↵</kbd> open</span>
        <span><kbd>Esc</kbd> close</span>
      </div>
    </div>`;
  document.body.appendChild(modal);

  // ── Events ──
  document.getElementById("smBackdrop")?.addEventListener("click", closeSearchModal);
  document.getElementById("smClose")?.addEventListener("click", closeSearchModal);

  let _debounce;
  document.getElementById("smInput")?.addEventListener("input", e => {
    clearTimeout(_debounce);
    const q = e.target.value;
    _debounce = setTimeout(async () => {
      await loadIndex();
      renderSearchResults(scoreAndSearch(q), q);
    }, 120);
  });

  document.getElementById("smInput")?.addEventListener("keydown", e => {
    const items = document.querySelectorAll(".sm-result");
    if      (e.key === "ArrowDown")              { e.preventDefault(); _selIdx = Math.min(_selIdx + 1, items.length - 1); updateSearchSel(); }
    else if (e.key === "ArrowUp")                { e.preventDefault(); _selIdx = Math.max(_selIdx - 1, -1); updateSearchSel(); }
    else if (e.key === "Enter" && _selIdx >= 0)  { closeSearchModal(); items[_selIdx]?.click(); }
    else if (e.key === "Escape")                 { closeSearchModal(); }
  });

  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("searchModal")?.classList.contains("open")
        ? closeSearchModal() : openSearchModal();
    } else if (e.key === "Escape") {
      closeSearchModal();
    }
  });
}

// ── Init ──────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  buildSidebar();
  initMobileMenu();
  initSearch();
  scrollActiveLink();
  injectSearchModal();
});
