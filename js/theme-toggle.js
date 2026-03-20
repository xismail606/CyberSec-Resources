// ===== THEME TOGGLE =====
// Lazy-loads theme-light.css, persists preference via localStorage.

(() => {
  "use strict";

  const STORAGE_KEY = "theme";
  const LIGHT_CSS   = "./css/theme-light.css";
  const html        = document.documentElement;

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
    if (lightLink) return;
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
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleUI(theme);
  }

  // ===== Smooth transition helper =====
  function transitionTheme(theme) {
    html.classList.add("theme-transitioning");
    applyTheme(theme);
    // Remove class after transitions finish
    setTimeout(() => html.classList.remove("theme-transitioning"), 400);
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
    transitionTheme(next);
  });

  // ===== Respond to system preference changes =====
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      transitionTheme(e.matches ? "light" : "dark");
    }
  });
})();
