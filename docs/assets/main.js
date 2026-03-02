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
      { title: "Getting Started",       path: "claude-code/getting-started.html" },
      { title: "CLI Commands & Flags",  path: "claude-code/cli-commands.html" },
      { title: "Slash Commands",        path: "claude-code/slash-commands.html" },
      { title: "Keyboard Shortcuts",    path: "claude-code/keyboard-shortcuts.html" },
      { title: "CLAUDE.md",             path: "claude-code/claude-md.html" },
      { title: "Memory System",         path: "claude-code/memory-system.html" },
      { title: "Permissions & Safety",  path: "claude-code/permissions.html" },
      { title: "Plan Mode",             path: "claude-code/plan-mode.html" },
      { title: "Extended Thinking",     path: "claude-code/thinking-mode.html" },
      { title: "Fast Mode",             path: "claude-code/fast-mode.html" },
      { title: "Subagents",             path: "claude-code/subagents.html" },
      { title: "Skills",                path: "claude-code/skills.html" },
      { title: "Hooks",                 path: "claude-code/hooks.html" },
      { title: "MCP Servers",           path: "claude-code/mcp-servers.html" },
      { title: "Git Integration",       path: "claude-code/git-integration.html" },
      { title: "IDE Integration",       path: "claude-code/ide-integration.html" },
      { title: "Settings & Config",     path: "claude-code/settings.html" },
      { title: "Context Management",    path: "claude-code/context-management.html" },
      { title: "Task List",             path: "claude-code/task-list.html" },
      { title: "Output Formats",        path: "claude-code/output-formats.html" },
      { title: "Vision & Multimodal",   path: "claude-code/vision-multimodal.html" },
      { title: "Chrome Integration",    path: "claude-code/chrome-integration.html" },
      { title: "Headless Mode",         path: "claude-code/headless-mode.html" },
      { title: "Cost Tracking",         path: "claude-code/cost-tracking.html" }
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

// ── Init ──────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  buildSidebar();
  initMobileMenu();
  initSearch();
  scrollActiveLink();
});
