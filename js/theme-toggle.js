// ===== THEME TOGGLE =====
// Lazy-loads theme-light.css, persists preference via localStorage.

(() => {
  "use strict";

  const STORAGE_KEY = "theme";
  const LIGHT_CSS   = "./css/theme-light.css";
  const html        = document.documentElement;
  const TRANSITION_MS = 700; // must match CSS transition duration (0.7s)

  // ===== Detect preferred theme =====
  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  // ===== Lazy-load light CSS =====
  let lightLink = null;

  function ensureLightCSS() {
    if (lightLink && document.head.contains(lightLink)) return;
    // Check if already in DOM (e.g. from a previous load)
    lightLink = document.querySelector('link[href*="theme-light"]');
    if (lightLink) return;

    lightLink = document.createElement("link");
    lightLink.rel  = "stylesheet";
    lightLink.href = LIGHT_CSS;
    document.head.appendChild(lightLink);
  }

  // ===== Apply theme =====
  function applyTheme(theme) {
    if (theme === "light") ensureLightCSS();
    html.setAttribute("data-theme", theme);
    updateToggleUI(theme);
  }

  function applyThemeAndPersist(theme) {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // ===== Smooth transition helper =====
  function transitionTheme(theme) {
    html.classList.add("theme-transitioning");
    applyTheme(theme);
    // Remove class after transitions finish (+50ms buffer)
    setTimeout(() => html.classList.remove("theme-transitioning"), TRANSITION_MS + 50);
  }

  function transitionThemeAndPersist(theme) {
    html.classList.add("theme-transitioning");
    applyThemeAndPersist(theme);
    // Remove class after transitions finish (+50ms buffer)
    setTimeout(() => html.classList.remove("theme-transitioning"), TRANSITION_MS + 50);
  }

  // ===== Toggle button UI =====
  function updateToggleUI(theme) {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      if (theme === "light") {
        btn.textContent = "☀️";
        btn.setAttribute("aria-label", "Switch to dark mode");
        btn.setAttribute("title", "Switch to dark mode");
      } else {
        btn.textContent = "🌙";
        btn.setAttribute("aria-label", "Switch to light mode");
        btn.setAttribute("title", "Switch to light mode");
      }
    });
  }

  // ===== Initialize on load =====
  const initial = getPreferred();
  applyTheme(initial); // No transition on first load

  // ===== Wire up click handlers (event delegation) =====
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-toggle");
    if (!btn) return;

    const current = html.getAttribute("data-theme") || "dark";
    const next    = current === "dark" ? "light" : "dark";
    transitionThemeAndPersist(next); // Save user preference
  });

  // ===== Respond to system preference changes =====
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      transitionTheme(e.matches ? "light" : "dark");
    }
  });

  // ===== Cross-tab sync =====
  window.addEventListener("storage", (e) => {
    if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
      applyTheme(e.newValue);
    }
  });
})();
