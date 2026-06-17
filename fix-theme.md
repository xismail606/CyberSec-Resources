# Fix: Theme Toggle Bugs & Improvements

You will receive two files: `theme-toggle.js` and `theme-light.css`.
Apply **all** fixes described below to each file as specified.
Do not alter anything not explicitly mentioned.
Return both complete updated files.

---

## FILE 1 — `theme-toggle.js`

---

### FIX 1 — Bug: `ensureLightCSS` uses a stale reference that may no longer be in the DOM

If `lightLink` was appended but then removed from `document.head` by any
external code, the `if (lightLink) return` guard would silently skip
re-adding it, leaving the page unstyled.

```js
// BEFORE
function ensureLightCSS() {
  if (lightLink) return;
  lightLink = document.querySelector('link[href*="theme-light"]');
  if (lightLink) return;

  lightLink = document.createElement("link");
  lightLink.rel  = "stylesheet";
  lightLink.href = LIGHT_CSS;
  document.head.appendChild(lightLink);
}

// AFTER
function ensureLightCSS() {
  if (lightLink && document.head.contains(lightLink)) return;
  lightLink = document.querySelector('link[href*="theme-light"]');
  if (lightLink) return;

  lightLink = document.createElement("link");
  lightLink.rel  = "stylesheet";
  lightLink.href = LIGHT_CSS;
  document.head.appendChild(lightLink);
}
```

---

### FIX 2 — Bug: Transition timeout (750ms) is out of sync with CSS duration (700ms)

The comment says "sync with CSS duration" but the value is 750ms while
the CSS uses `0.7s` = 700ms. Extract a shared constant and add a small
buffer to ensure the class is removed only after transitions are done.

```js
// BEFORE
function transitionTheme(theme, save = true) {
  html.classList.add("theme-transitioning");
  applyTheme(theme, save);
  // Remove class after transitions finish (sync with CSS duration)
  setTimeout(() => html.classList.remove("theme-transitioning"), 750);
}

// AFTER — add constant near the top of the IIFE, after existing constants:
const TRANSITION_MS = 700; // must match CSS transition duration (0.7s)

// Then update transitionTheme:
function transitionTheme(theme, save = true) {
  html.classList.add("theme-transitioning");
  applyTheme(theme, save);
  // Remove class after transitions finish (+50ms buffer)
  setTimeout(() => html.classList.remove("theme-transitioning"), TRANSITION_MS + 50);
}
```

---

### FIX 3 — Add cross-tab sync via `storage` event

If the user changes the theme in one browser tab, other open tabs
stay out of sync. Adding a `storage` listener fixes this.

Add at the very end of the IIFE, after the `matchMedia` listener:

```js
// ADD after the matchMedia addEventListener block:

// ===== Cross-tab sync =====
window.addEventListener("storage", (e) => {
  if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
    applyTheme(e.newValue, false);
  }
});
```

---

## FILE 2 — `theme-light.css`

---

### FIX 4 — Bug: `.hero h1` light mode override missing `background-clip` reset

`-webkit-background-clip` and `background-clip` are not being reset,
which can leave a clipping mask active and make the text invisible
in some browsers even after `background: none`.

```css
/* BEFORE */
html[data-theme="light"] .hero h1 {
  -webkit-text-fill-color: unset;
  background: none;
  color: var(--text-primary);
}

/* AFTER */
html[data-theme="light"] .hero h1 {
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
  -webkit-text-fill-color: unset;
  color: var(--text-primary);
}
```

---

### FIX 5 — Add missing elements to `.theme-transitioning` selector list

Several visible elements are absent from the transition list, causing
them to "snap" instantly instead of animating smoothly when the theme changes.

```css
/* BEFORE — end of the selector list */
html.theme-transitioning .modal-content {
  transition: background-color 0.7s ease,
              border-color 0.7s ease,
              box-shadow 0.7s ease !important;
}

/* AFTER — extend the selector list to include the missing elements */
html.theme-transitioning,
html.theme-transitioning body,
html.theme-transitioning .navbar,
html.theme-transitioning .nav-links a,
html.theme-transitioning .search-wrapper,
html.theme-transitioning .search-input,
html.theme-transitioning .card,
html.theme-transitioning .home-card,
html.theme-transitioning .about-section,
html.theme-transitioning .diff-btn,
html.theme-transitioning .page-nav-btn,
html.theme-transitioning .category-item,
html.theme-transitioning .sidebar,
html.theme-transitioning .social a,
html.theme-transitioning .footer,
html.theme-transitioning .thm-modal,
html.theme-transitioning .modal-content,
html.theme-transitioning .link-card,
html.theme-transitioning .category,
html.theme-transitioning .filter-chip,
html.theme-transitioning .adv-search-panel,
html.theme-transitioning .adv-search-inner,
html.theme-transitioning .stat-item,
html.theme-transitioning .hero-badge,
html.theme-transitioning .active-filter-tag,
html.theme-transitioning .active-filters-bar {
  transition: background-color 0.7s ease,
              border-color 0.7s ease,
              box-shadow 0.7s ease !important;
}
```

---

## FILE 3 — All HTML files (`index.html`, `resources.html`, `ai-tools.html`, `bug-bounty-writeups.html`, `free-labs.html`)

---

### FIX 6 — Bug: Flash of wrong theme (FOWT) on page load

Because `theme-toggle.js` is loaded with `defer`, it runs after
the browser has already rendered the page in dark mode. If the user
prefers light mode, they will see a brief flash before the theme switches.

Fix: Add a tiny inline `<script>` in `<head>` — **immediately after
`<meta charset="UTF-8">`** and **before any `<link>` tags** — in every HTML file.
This script runs synchronously before any rendering occurs.

```html
<!-- ADD immediately after <meta charset="UTF-8" /> in every HTML file -->
<script>
  (function () {
    var t = localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", t);
  })();
</script>
```

> This script must remain inline (no `src`, no `defer`, no `async`).
> It must come before any stylesheet `<link>` tags so the correct
> `data-theme` attribute is present when CSS variables are first evaluated.

---

## Summary

| # | File | Type | Fix |
|---|------|------|-----|
| 1 | `theme-toggle.js` | Bug | `ensureLightCSS` — check `document.head.contains` before skipping |
| 2 | `theme-toggle.js` | Bug | Extract `TRANSITION_MS = 700` constant; sync timeout with CSS |
| 3 | `theme-toggle.js` | Feature | Add `storage` event listener for cross-tab sync |
| 4 | `theme-light.css` | Bug | Add `background-clip: unset` reset to `.hero h1` override |
| 5 | `theme-light.css` | Quality | Add 8 missing elements to `.theme-transitioning` selector list |
| 6 | All HTML files | Bug | Add inline `<script>` in `<head>` to prevent flash of wrong theme |

Apply all fixes. Do not change anything else.
Return the complete updated versions of both files,
and the updated `<head>` snippet to apply to all HTML files.
