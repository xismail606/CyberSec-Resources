// ===== RENDER ENGINE =====
// Shared by index.html (resources) and free-labs.html (labs).

(() => {
  "use strict";

  // ===== UTILITIES =====
  const $ = (sel) => document.getElementById(sel);
  const _esc = (s) => {
    const d = document.createElement("span");
    d.textContent = s;
    return d.innerHTML;
  };
  const slugify = (s) => s.toLowerCase().replace(/[^\w]+/g, "-").replace(/-+$/, "");

  // ===== DATA =====
  const categories = window.__cyberData || [];
  const container = $("categoriesContainer");
  const isLabsPage = document.title.toLowerCase().includes("labs") || window.location.pathname.includes("free-labs");
  const itemLabel = isLabsPage ? "lab" : "tool";

  let totalTools = 0;
  let currentDiffFilter = "all";

  // ===== FAVICON CACHE =====
  const _faviconCache = {};
  function getFavicon(url) {
    try {
      const domain = new URL(url).hostname;
      if (!_faviconCache[domain]) {
        _faviconCache[domain] = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      }
      return _faviconCache[domain];
    } catch {
      return "";
    }
  }

  // ===== RENDER CATEGORIES =====
  // Builds DOM once, then toggles visibility on search/filter.
  let allCards = [];    // {el, name, desc, url, catName, tags, difficulty, sectionEl}
  let allSections = []; // {el, catName, countEl, cards[]}

  function buildDOM() {
    container.innerHTML = "";
    allCards = [];
    allSections = [];
    let toolCount = 0;

    categories.forEach((cat) => {
      const section = document.createElement("section");
      section.className = `category ${cat.theme}`;
      section.id = `cat-${slugify(cat.name)}`;

      const header = document.createElement("div");
      header.className = "category-header";
      header.innerHTML = `
        <div class="category-icon">${cat.icon}</div>
        <h2 class="category-title">${_esc(cat.name)}</h2>
        <span class="category-count">${cat.links.length} ${itemLabel}${cat.links.length > 1 ? "s" : ""}</span>
      `;
      section.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "links-grid";

      const sectionCards = [];

      cat.links.forEach((link) => {
        const card = document.createElement("a");
        card.href = link.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.className = "link-card tool-card-btn";
        card.title = link.desc;

        // Store data attributes for modal
        card.dataset.name = link.name;
        card.dataset.desc = link.desc;
        card.dataset.url = link.url;
        card.dataset.tags = JSON.stringify(link.tags || []);
        card.dataset.category = cat.name;
        if (link.difficulty) card.dataset.difficulty = link.difficulty;

        card.innerHTML = `
          <div class="link-favicon">
            <img src="${getFavicon(link.url)}" alt="" loading="lazy" onerror="this.style.display='none'">
          </div>
          <div class="link-info">
            <div class="link-name">${_esc(link.name)}</div>
            <div class="link-domain">${_esc(link.desc)}</div>
          </div>
          <span class="card-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
            </svg>
          </span>
        `;

        grid.appendChild(card);

        const cardMeta = {
          el: card,
          name: link.name.toLowerCase(),
          desc: link.desc.toLowerCase(),
          url: link.url.toLowerCase(),
          catName: cat.name.toLowerCase(),
          tags: link.tags || [],
          difficulty: (link.difficulty || "").toLowerCase(),
          sectionEl: section,
        };
        sectionCards.push(cardMeta);
        allCards.push(cardMeta);
        toolCount++;
      });

      section.appendChild(grid);
      container.appendChild(section);

      const countEl = header.querySelector(".category-count");
      allSections.push({ el: section, catName: cat.name, countEl, cards: sectionCards });
    });

    totalTools = toolCount;
    $("totalTools").textContent = totalTools;
    $("totalCategories").textContent = categories.length;
  }

  // ===== FILTER (Visibility Toggle) =====
  function applyFilter(filter = "") {
    const filterLower = filter.toLowerCase();
    let visibleTools = 0;
    let visibleCategories = 0;

    allSections.forEach((sec) => {
      let sectionVisible = 0;

      sec.cards.forEach((card) => {
        // Text match
        const textMatch = !filter ||
          card.name.includes(filterLower) ||
          card.desc.includes(filterLower) ||
          card.url.includes(filterLower) ||
          card.catName.includes(filterLower);

        // Difficulty match
        let diffMatch = true;
        if (currentDiffFilter !== "all") {
          const activeFilter = currentDiffFilter.toLowerCase();
          if (activeFilter === "info" || activeFilter === "intro") {
            diffMatch = card.difficulty === "info" || card.difficulty === "intro" ||
              card.tags.includes("info") || card.tags.includes("intro");
          } else {
            diffMatch = card.difficulty === activeFilter || card.tags.includes(activeFilter);
          }
        }

        const visible = textMatch && diffMatch;
        card.el.style.display = visible ? "" : "none";
        if (visible) sectionVisible++;
      });

      sec.el.style.display = sectionVisible > 0 ? "" : "none";
      sec.countEl.textContent = `${sectionVisible} ${itemLabel}${sectionVisible > 1 ? "s" : ""}`;
      if (sectionVisible > 0) {
        visibleCategories++;
        visibleTools += sectionVisible;
      }
    });

    // Update global stat boxes dynamically
    const totalToolsEl = $("totalTools");
    const totalCatEl = $("totalCategories");
    if (totalToolsEl) totalToolsEl.textContent = visibleTools;
    if (totalCatEl) totalCatEl.textContent = visibleCategories;

    // Toggle no results
    $("noResults").classList.toggle("visible", visibleTools === 0);

    // Update aria-live announcement
    const liveRegion = $("searchAnnounce");
    if (liveRegion) {
      liveRegion.textContent = filter
        ? `${visibleTools} ${itemLabel}${visibleTools !== 1 ? "s" : ""} found`
        : "";
    }
  }

  // ===== INITIAL BUILD =====
  buildDOM();

  // ===== NAV LINKS =====
  const navLinksContainer = $("navLinks");
  if (navLinksContainer) {
    let isDraggingNav = false;
    let isDown = false;
    let startX, scrollLeft;

    categories.forEach((cat) => {
      const a = document.createElement("a");
      a.href = `#cat-${slugify(cat.name)}`;
      a.className = "nav-link";
      a.textContent = `${cat.icon} ${cat.name}`;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (isDraggingNav) return;
        const target = $(`cat-${slugify(cat.name)}`);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        navLinksContainer.classList.remove("open");
        $("navToggle")?.classList.remove("open");
      });
      navLinksContainer.appendChild(a);
    });

    // Mouse Drag to Scroll with Momentum
    let momentumID, velX = 0;

    function beginMomentum() {
      cancelAnimationFrame(momentumID);
      momentumID = requestAnimationFrame(momentumLoop);
    }

    function momentumLoop() {
      if (Math.abs(velX) > 0.5) {
        navLinksContainer.scrollLeft -= velX;
        velX *= 0.95;
        momentumID = requestAnimationFrame(momentumLoop);
      }
    }

    navLinksContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      isDraggingNav = false;
      navLinksContainer.style.cursor = "grabbing";
      navLinksContainer.style.userSelect = "none";
      startX = e.pageX - navLinksContainer.offsetLeft;
      scrollLeft = navLinksContainer.scrollLeft;
      cancelAnimationFrame(momentumID);
    });

    navLinksContainer.addEventListener("mouseleave", () => {
      if (!isDown) return;
      isDown = false;
      navLinksContainer.style.cursor = "";
      navLinksContainer.style.removeProperty("user-select");
      beginMomentum();
    });

    navLinksContainer.addEventListener("mouseup", () => {
      isDown = false;
      setTimeout(() => { isDraggingNav = false; }, 50);
      navLinksContainer.style.cursor = "";
      navLinksContainer.style.removeProperty("user-select");
      beginMomentum();
    });

    navLinksContainer.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - navLinksContainer.offsetLeft;
      const walk = (x - startX) * 2;
      const prevScrollLeft = navLinksContainer.scrollLeft;
      navLinksContainer.scrollLeft = scrollLeft - walk;
      velX = prevScrollLeft - navLinksContainer.scrollLeft;
      if (Math.abs(walk) > 5) isDraggingNav = true;
    });
  }

  // ===== MOBILE NAV TOGGLE =====
  const navToggle = $("navToggle");
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinksContainer.classList.toggle("open");
    });
  }

  // ===== SEARCH (Debounced) =====
  const searchInput = $("searchInput");
  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        applyFilter(e.target.value.trim());
      }, 200);
    });
  }

  // ===== DIFFICULTY FILTERS =====
  const diffButtons = document.querySelectorAll(".diff-btn");
  if (diffButtons.length > 0) {
    diffButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        diffButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentDiffFilter = btn.dataset.diff;
        applyFilter(searchInput?.value.trim() || "");
      });
    });
  }

  // ===== CONSOLIDATED SCROLL LISTENER =====
  const navbar = $("navbar");
  const scrollBtn = $("scrollTop");

  function updateActiveNav() {
    const sections = document.querySelectorAll(".category");
    const navLinks = document.querySelectorAll(".nav-link");
    let currentId = "";
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 120) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  }

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", y > 50);
    if (scrollBtn) scrollBtn.classList.toggle("visible", y > 400);
    updateActiveNav();
  }, { passive: true });

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===== ANIMATE STATS ON LOAD =====
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
      animateNumber($("totalTools"), totalTools);
      animateNumber($("totalCategories"), categories.length, 800);
    }, 300);
  });

  // ===== MODAL (Event Delegation) =====
  const toolModal = $("toolModal");
  const modalCloseBtn = $("modalClose");
  const modalTitle = $("modalTitle");
  const modalSubtitle = $("modalSubtitle");
  const modalDesc = $("modalDesc");
  const modalTags = $("modalTags");
  const modalOpenBtn = $("modalOpenBtn");

  // Focusable elements inside modal for focus trapping
  function getModalFocusables() {
    if (!toolModal) return [];
    return [...toolModal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')];
  }

  function openModal(name, desc, url, tags) {
    if (!toolModal) return;

    modalTitle.textContent = name;
    modalDesc.textContent = desc;

    if (url.includes("tryhackme.com")) {
      modalSubtitle.textContent = "lab";
      modalOpenBtn.textContent = "Go to Room";
    } else {
      modalSubtitle.textContent = "Tool Details";
      modalOpenBtn.textContent = "Open Tool";
    }

    // Render tags safely
    const skillsSection = document.querySelector(".modal-skills");
    if (tags.length > 0) {
      modalTags.innerHTML = tags.map((t) => `<span class="modal-tag">${_esc(t)}</span>`).join("");
      if (skillsSection) skillsSection.style.display = "block";
    } else {
      modalTags.innerHTML = "";
      if (skillsSection) skillsSection.style.display = "none";
    }

    // Store URL for the open button
    modalOpenBtn.dataset.url = url;

    // Show modal
    toolModal.classList.add("active");
    toolModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Focus first element
    setTimeout(() => modalCloseBtn?.focus(), 100);
  }

  function closeModal() {
    if (!toolModal) return;
    toolModal.classList.remove("active");
    toolModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Card clicks via event delegation
  document.body.addEventListener("click", (e) => {
    const card = e.target.closest(".tool-card-btn");
    if (card && toolModal) {
      e.preventDefault();
      let tags = [];
      try { tags = JSON.parse(card.dataset.tags || "[]"); } catch { /* ignore */ }
      openModal(card.dataset.name, card.dataset.desc, card.dataset.url, tags);
    }
  });

  // Modal open button
  if (modalOpenBtn) {
    modalOpenBtn.addEventListener("click", () => {
      const url = modalOpenBtn.dataset.url;
      if (url) window.open(url, "_blank");
    });
  }

  // Modal close
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (toolModal) toolModal.addEventListener("click", (e) => {
    if (e.target === toolModal) closeModal();
  });

  // Keyboard: Escape closes, Tab traps focus
  document.addEventListener("keydown", (e) => {
    if (!toolModal || !toolModal.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeModal();
      return;
    }

    if (e.key === "Tab") {
      const focusables = getModalFocusables();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // ===== MOUSE-FOLLOW GLOW =====
  (() => {
    const root = document.documentElement;
    const body = document.body;
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let isOnPage = false;
    let rafId = null;
    const LERP = 0.12;

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

    document.addEventListener("mouseleave", () => {
      isOnPage = false;
      root.style.setProperty("--glow-opacity", "0");
      cancelAnimationFrame(rafId);
      rafId = null;
    });

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

  // ===== TYPEWRITER ANIMATION =====
  (() => {
    const el = document.querySelector(".typewriter");
    if (!el) return;
    const text = el.getAttribute("data-text") || "";
    let i = 0;

    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(type, 80);
      } else {
        setTimeout(() => el.classList.add("done"), 1500);
      }
    }
    setTimeout(type, 400);
  })();

})();
