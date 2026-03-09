// ===== RENDER ENGINE =====
// Shared by index.html (resources) and free-labs.html (labs).
// Expects a global `categories` array to exist before this script loads.

const container = document.getElementById("categoriesContainer");
let totalTools = 0;

// Slugify helper — turns "Reverse Engineering" → "reverse-engineering"
const slugify = (s) => s.toLowerCase().replace(/[^\w]+/g, "-").replace(/-+$/,"");

function getFavicon(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

function renderCategories(filter = "") {
  container.innerHTML = "";
  let visibleTools = 0;
  let visibleCategories = 0;
  const filterLower = filter.toLowerCase();

  categories.forEach((cat) => {
    const filteredLinks = cat.links.filter(
      (link) =>
        !filter ||
        link.name.toLowerCase().includes(filterLower) ||
        link.desc.toLowerCase().includes(filterLower) ||
        link.url.toLowerCase().includes(filterLower) ||
        cat.name.toLowerCase().includes(filterLower),
    );

    if (filteredLinks.length === 0) return;
    visibleCategories++;
    visibleTools += filteredLinks.length;

    const section = document.createElement("section");
    section.className = `category ${cat.theme}`;
    section.id = `cat-${slugify(cat.name)}`;
    section.innerHTML = `
      <div class="category-header">
        <div class="category-icon">${cat.icon}</div>
        <h2 class="category-title">${cat.name}</h2>
        <span class="category-count">${filteredLinks.length} tool${filteredLinks.length > 1 ? "s" : ""}</span>
      </div>
      <div class="links-grid"> 
        ${filteredLinks
          .map((link) => {
            const tags = link.tags ? JSON.stringify(link.tags) : "[]";
            return `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card tool-card-btn"
             data-name="${link.name.replace(/"/g, '&quot;')}"
             data-desc="${link.desc.replace(/"/g, '&quot;')}"
             data-url="${link.url}"
             data-tags='${tags.replace(/'/g, "&#39;")}'
             title="${link.desc.replace(/"/g, '&quot;')}">
            <div class="link-favicon">
              <img src="${getFavicon(link.url)}" alt="" loading="lazy" onerror="this.style.display='none'">
            </div>
            <div class="link-info">
              <div class="link-name">${link.name}</div>
              <div class="link-domain">${link.desc}</div>
            </div>
            <span class="card-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
              </svg>
            </span>
          </a>
        `})
          .join("")}
      </div>
    `;
    container.appendChild(section);
  });

  // Toggle no results
  document
    .getElementById("noResults")
    .classList.toggle("visible", visibleTools === 0);

  // Update stats if no filter
  if (!filter) {
    totalTools = visibleTools;
    document.getElementById("totalTools").textContent = totalTools;
    document.getElementById("totalCategories").textContent = visibleCategories;
  }
}

// Initial render
renderCategories();

// ===== NAV LINKS =====
const navLinksContainer = document.getElementById("navLinks");
if (navLinksContainer) {
  categories.forEach((cat) => {
    const a = document.createElement("a");
    a.href = `#cat-${slugify(cat.name)}`;
    a.className = "nav-link";
    a.textContent = `${cat.icon} ${cat.name}`;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(`cat-${slugify(cat.name)}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Close mobile nav
      navLinksContainer.classList.remove("open");
      document.getElementById("navToggle").classList.remove("open");
    });
    navLinksContainer.appendChild(a);
  });
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}

// ===== SCROLL SPY =====
function updateActiveNav() {
  const sections = document.querySelectorAll(".category");
  const navLinks = document.querySelectorAll(".nav-link");
  let currentId = "";

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) {
      currentId = section.id;

    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}
window.addEventListener("scroll", updateActiveNav);

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById("navToggle");
if (navToggle && navLinksContainer) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinksContainer.classList.toggle("open");
  });
}

// ===== SEARCH =====
const searchInput = document.getElementById("searchInput");
let debounceTimer;
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderCategories(e.target.value.trim());
    }, 200);
  });
}

// ===== SCROLL TO TOP =====
const scrollBtn = document.getElementById("scrollTop");
if (scrollBtn) {
  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("visible", window.scrollY > 400);
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== Animate stats on load =====
function animateNumber(el, target, duration = 1200) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

window.addEventListener("load", () => {
  setTimeout(() => {
    animateNumber(document.getElementById("totalTools"), totalTools);
    animateNumber(
      document.getElementById("totalCategories"),
      categories.length,
      800,
    );
  }, 300);
});

// ===== EVENT DELEGATION FOR MODAL =====
const toolModal = document.getElementById("toolModal");
const modalCloseBtn = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalDesc = document.getElementById("modalDesc");
const modalTags = document.getElementById("modalTags");
const modalOpenBtn = document.getElementById("modalOpenBtn");

document.body.addEventListener("click", (e) => {
  const card = e.target.closest(".tool-card-btn");
  if (card && toolModal) {
    e.preventDefault();

    const name = card.dataset.name;
    const desc = card.dataset.desc;
    const url = card.dataset.url;
    let tags = [];
    try { tags = JSON.parse(card.dataset.tags || "[]"); } catch (err) { /* ignore */ }

    modalTitle.textContent = name;
    modalDesc.textContent = desc;

    if (url.includes("tryhackme.com")) {
      modalSubtitle.textContent = "Intro • Intro";
      modalOpenBtn.textContent = "Go to Room";
    } else {
      modalSubtitle.textContent = "Tool Details";
      modalOpenBtn.textContent = "Open Tool";
    }

    // Render tags — hide section if no real tags
    const skillsSection = document.querySelector('.modal-skills');
    if (tags.length > 0) {
      modalTags.innerHTML = tags.map(t => `<span class="modal-tag">${t}</span>`).join("");
      if (skillsSection) skillsSection.style.display = 'block';
    } else {
      modalTags.innerHTML = '';
      if (skillsSection) skillsSection.style.display = 'none';
    }

    // Set open action
    modalOpenBtn.onclick = () => {
      window.open(url, "_blank");
    };

    // Show modal
    toolModal.classList.add("active");
  }
});

function closeToolModal() {
  if (toolModal) toolModal.classList.remove("active");
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeToolModal);
}

if (toolModal) {
  toolModal.addEventListener("click", (e) => {
    if (e.target === toolModal) closeToolModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && toolModal && toolModal.classList.contains("active")) {
    closeToolModal();
  }
});

// ===== MOUSE-FOLLOW GLOW =====
// Professional spotlight: rAF loop with lerp for silky-smooth movement.
// Single mousemove listener — no heavy loops or recalculations.

(() => {
  const root = document.documentElement;
  const body = document.body;

  let mouseX = 0, mouseY = 0;   // raw cursor position
  let glowX  = 0, glowY  = 0;   // interpolated (smooth) position
  let isOnPage = false;
  let rafId = null;

  // Lerp factor: 0.08 = smooth trailing, 0.2 = snappy, 1 = instant
  const LERP = 0.12;  // ← adjust smoothness here

  // --- Single mousemove listener ---
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isOnPage) {
      isOnPage = true;
      glowX = mouseX;
      glowY = mouseY;
      root.style.setProperty("--glow-opacity", "1");
      startLoop();
    }
  });

  // --- Fade out when cursor leaves ---
  document.addEventListener("mouseleave", () => {
    isOnPage = false;
    root.style.setProperty("--glow-opacity", "0");
    cancelAnimationFrame(rafId);
    rafId = null;
  });

  // --- Hover-amplify on interactive elements ---
  body.addEventListener("mouseover", (e) => {
    if (e.target.closest(".link-card, .page-nav-btn, .modal-btn, button")) {
      body.classList.add("glow-hover");
    }
  });
  body.addEventListener("mouseout", (e) => {
    if (e.target.closest(".link-card, .page-nav-btn, .modal-btn, button")) {
      body.classList.remove("glow-hover");
    }
  });

  // --- rAF loop: lerp toward cursor for fluid trailing ---
  function tick() {
    glowX += (mouseX - glowX) * LERP;
    glowY += (mouseY - glowY) * LERP;

    root.style.setProperty("--x", glowX + "px");
    root.style.setProperty("--y", glowY + "px");

    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }
})();

