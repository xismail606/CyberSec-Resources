// ===== RENDER ENGINE =====
// Shared by index.html (resources) and free-labs.html (labs).

(() => {
  "use strict";

  // ===== UTILITIES =====
  const $ = (sel) => document.getElementById(sel);
  const _esc = (s) => String(s || "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const slugify = (s) => s.toLowerCase().replace(/[^\w]+/g, "-").replace(/-+$/, "");

  // ===== DATA =====
  const categories = window.__cyberData || [];
  const container = $("categoriesContainer");
  const pageType = window.__cyberConfig?.pageType ?? 'default';
  const isLabsPage = pageType === 'labs';
  const isWriteupsPage = pageType === 'writeups';
  const itemLabel = isLabsPage ? "lab" : isWriteupsPage ? "writeup" : "tool";

  let totalTools = 0;
  let currentDiffFilter = "all";
  let selectedCategories = new Set();

  // ===== FAVICON CACHE =====
  const _faviconCache = {};
  /**
   * Returns a URL to a Google Favicon service image for the given URL.
   * @param {String} url - The URL to get a favicon for
   * @returns {String} The favicon URL
   */
  function getFavicon(url) {
    try {
      const match = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
      const domain = match ? match[1] : null;
      if (!domain) return "";
      
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

  const escAttr = (s) => String(s || "").replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /**
   * Builds and appends all resource cards to the DOM.
   * Uses highly optimized string-based rendering to eliminate layout thrashing.
   */
  function buildDOM() {
    if (!container) return;
    
    allCards = [];
    allSections = [];
    let _pendingSections = [];
    let toolCount = 0;
    let html = "";

    categories.forEach((cat) => {
      if (!cat.links || !Array.isArray(cat.links)) return;

      html += `
        <section class="category ${escAttr(cat.theme)}" id="cat-${slugify(cat.name)}">
          <div class="category-header">
            <div class="category-icon">${_esc(cat.icon)}</div>
            <h2 class="category-title">${_esc(cat.name)}</h2>
            <span class="category-count">${cat.links.length} ${itemLabel}${cat.links.length > 1 ? "s" : ""}</span>
          </div>
          <div class="links-grid">
      `;

      cat.links.forEach((link) => {
        const tagsJson = escAttr(JSON.stringify(link.tags || []));
        const diffAttr = link.difficulty ? `data-difficulty="${escAttr(link.difficulty)}"` : '';
        html += `
          <a href="${escAttr(link.url)}" target="_blank" rel="noopener noreferrer" 
             class="link-card tool-card-btn" title="${escAttr(link.desc)}"
             data-name="${escAttr(link.name)}" data-desc="${escAttr(link.desc)}" 
             data-url="${escAttr(link.url)}" data-tags="${tagsJson}" 
             data-category="${escAttr(cat.name)}" ${diffAttr}>
            <div class="link-favicon">
              <img src="${escAttr(getFavicon(link.url))}" alt="" loading="lazy" onerror="this.style.display='none'">
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
          </a>
        `;
      });

      html += `</div></section>`;

      // Pre-collect metadata in parallel with html building
      const cardsMeta = cat.links.map((link) => ({
        name: (link.name || "").toLowerCase(),
        desc: (link.desc || "").toLowerCase(),
        url: (link.url || "").toLowerCase(),
        catName: cat.name.toLowerCase(),
        tags: link.tags || [],
        difficulty: (link.difficulty || "").toLowerCase(),
      }));

      // Store for post-DOM wiring
      _pendingSections.push({ catName: cat.name, cardsMeta });
      toolCount += cat.links.length;
    });

    container.innerHTML = html;

    // Wire DOM elements to pre-built metadata (single traversal, no dataset reads)
    const sections = container.querySelectorAll(".category");
    sections.forEach((secEl, i) => {
      const pending = _pendingSections[i];
      const countEl = secEl.querySelector(".category-count");
      const cardEls = secEl.querySelectorAll(".link-card");
      const cards = [];
      cardEls.forEach((cardEl, j) => {
        const meta = { el: cardEl, sectionEl: secEl, ...pending.cardsMeta[j] };
        cards.push(meta);
        allCards.push(meta);
      });
      allSections.push({ el: secEl, catName: pending.catName, countEl, cards });
    });

    totalTools = toolCount;
    const totalToolsEl = $("totalTools");
    if (totalToolsEl) totalToolsEl.textContent = totalTools;
    const totalCatEl = $("totalCategories");
    if (totalCatEl) totalCatEl.textContent = allSections.length;
    
    // Re-apply filter if user typed something while loading
    const searchInput = $("searchInput");
    if (searchInput && searchInput.value) {
      applyFilter(searchInput.value.trim());
    }
  }

  // ===== FILTER (Visibility Toggle) =====
  /**
   * Filters the visible tool cards based on search text and selected filters.
   * @param {String} filter - The text search query
   */
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

        // Category match (Advanced Search)
        let catMatch = true;
        if (selectedCategories && selectedCategories.size > 0) {
          catMatch = selectedCategories.has(sec.catName);
        }

        const visible = textMatch && diffMatch && catMatch;
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
    const noResultsEl = $("noResults");
    if (noResultsEl) noResultsEl.classList.toggle("visible", visibleTools === 0);

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
  setTimeout(() => {
    animateNumber($("totalTools"), totalTools);
    animateNumber($("totalCategories"), allSections.length, 800);
  }, 100);



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

  // ===== DIFFICULTY FILTERS (chips inside advanced panel on labs page) =====
  const diffChipsContainer = $("difficultyChips");
  const diffLevels = [
    { key: "info", label: "Info/Intro", icon: "ℹ️" },
    { key: "easy", label: "Easy", icon: "🟢" },
    { key: "medium", label: "Medium", icon: "🟡" },
    { key: "hard", label: "Hard", icon: "🔴" },
    { key: "insane", label: "Insane", icon: "💀" },
    { key: "ctf", label: "CTF", icon: "🏴" },
  ];

  // Legacy: still support standalone diff-btn if they exist
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

  // Build difficulty chips in advanced panel
  if (diffChipsContainer) {
    diffLevels.forEach((diff) => {
      const chip = document.createElement("button");
      chip.className = "filter-chip diff-chip";
      chip.dataset.diff = diff.key;
      chip.innerHTML = `<span class="chip-icon">${diff.icon}</span><span>${diff.label}</span>`;
      chip.addEventListener("click", () => {
        const wasActive = chip.classList.contains("active");
        // Single-select: remove active from all diff chips
        diffChipsContainer.querySelectorAll(".diff-chip").forEach((c) => c.classList.remove("active"));
        if (wasActive) {
          currentDiffFilter = "all";
        } else {
          chip.classList.add("active");
          currentDiffFilter = diff.key;
        }
        updateAdvancedFilters();
        applyFilter(searchInput?.value.trim() || "");
      });
      diffChipsContainer.appendChild(chip);
    });
  }

  // ===== ADVANCED SEARCH =====
  const advToggle = $("advSearchToggle");
  const advPanel = $("advSearchPanel");
  const advBadge = $("advSearchBadge");
  const filterChipsContainer = $("filterChips");
  const activeFiltersBar = $("activeFiltersBar");
  const activeFiltersList = $("activeFiltersList");
  const advSelectAll = $("advSelectAll");
  const advClearAll = $("advClearAll");
  const activeFiltersClear = $("activeFiltersClear");



  if (advToggle && advPanel && filterChipsContainer) {
    // Build category chips from data
    categories.forEach((cat) => {
      const chip = document.createElement("button");
      chip.className = "filter-chip";
      chip.dataset.category = cat.name;
      chip.innerHTML = `<span class="chip-icon">${_esc(cat.icon)}</span><span>${_esc(cat.name)}</span><span class="chip-count">${cat.links.length}</span>`;
      chip.addEventListener("click", () => {
        chip.classList.toggle("active");
        if (chip.classList.contains("active")) {
          selectedCategories.add(cat.name);
        } else {
          selectedCategories.delete(cat.name);
        }
        updateAdvancedFilters();
        applyFilter(searchInput?.value.trim() || "");
      });
      filterChipsContainer.appendChild(chip);
    });

    // Toggle panel
    advToggle.addEventListener("click", () => {
      const isOpen = advPanel.classList.toggle("open");
      advToggle.setAttribute("aria-expanded", isOpen);
      advPanel.setAttribute("aria-hidden", !isOpen);
    });

    // Select All (categories only)
    if (advSelectAll) {
      advSelectAll.addEventListener("click", () => {
        selectedCategories.clear();
        categories.forEach((cat) => selectedCategories.add(cat.name));
        filterChipsContainer.querySelectorAll(".filter-chip").forEach((c) => c.classList.add("active"));
        updateAdvancedFilters();
        applyFilter(searchInput?.value.trim() || "");
      });
    }

    // Clear All
    if (advClearAll) {
      advClearAll.addEventListener("click", () => {
        clearAllAdvanced();
      });
    }

    // Active filters clear
    if (activeFiltersClear) {
      activeFiltersClear.addEventListener("click", () => {
        clearAllAdvanced();
      });
    }

    // Keyboard shortcut: Ctrl+Shift+F
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "F") {
        e.preventDefault();
        advToggle.click();
      }
    });
  }

  function clearAllAdvanced() {
    selectedCategories.clear();
    if (filterChipsContainer) filterChipsContainer.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    // Reset difficulty
    currentDiffFilter = "all";
    if (diffChipsContainer) diffChipsContainer.querySelectorAll(".diff-chip").forEach((c) => c.classList.remove("active"));
    updateAdvancedFilters();
    applyFilter(searchInput?.value.trim() || "");
  }

  function updateAdvancedFilters() {
    const catCount = selectedCategories.size;
    const hasDiff = currentDiffFilter !== "all";
    const totalCount = catCount + (hasDiff ? 1 : 0);

    // Badge
    if (advBadge) {
      if (totalCount > 0) {
        advBadge.textContent = totalCount;
        advBadge.classList.add("visible");
      } else {
        advBadge.classList.remove("visible");
      }
    }

    // Active filters bar
    if (activeFiltersBar && activeFiltersList) {
      if (totalCount > 0) {
        activeFiltersBar.classList.add("visible");
        activeFiltersList.innerHTML = "";

        // Category tags
        selectedCategories.forEach((catName) => {
          const cat = categories.find((c) => c.name === catName);
          const tag = document.createElement("span");
          tag.className = "active-filter-tag";
          tag.innerHTML = `${cat ? _esc(cat.icon) : ""} ${_esc(catName)} <span class="remove-tag">✕</span>`;
          tag.addEventListener("click", () => {
            selectedCategories.delete(catName);
            if (filterChipsContainer) {
              const chip = [...filterChipsContainer.querySelectorAll(".filter-chip")]
                .find(c => c.dataset.category === catName);
              if (chip) chip.classList.remove("active");
            }
            updateAdvancedFilters();
            applyFilter(searchInput?.value.trim() || "");
          });
          activeFiltersList.appendChild(tag);
        });

        // Difficulty tag
        if (hasDiff) {
          const diffInfo = diffLevels.find((d) => d.key === currentDiffFilter);
          const tag = document.createElement("span");
          tag.className = "active-filter-tag";
          tag.innerHTML = `${diffInfo ? diffInfo.icon : ""} ${diffInfo ? diffInfo.label : currentDiffFilter} <span class="remove-tag">✕</span>`;
          tag.addEventListener("click", () => {
            currentDiffFilter = "all";
            if (diffChipsContainer) diffChipsContainer.querySelectorAll(".diff-chip").forEach((c) => c.classList.remove("active"));
            updateAdvancedFilters();
            applyFilter(searchInput?.value.trim() || "");
          });
          activeFiltersList.appendChild(tag);
        }
      } else {
        activeFiltersBar.classList.remove("visible");
      }
    }
  }


  // ===== CONSOLIDATED SCROLL LISTENER =====
  const navbar = $("navbar");
  const scrollBtn = $("scrollTop");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle("scrolled", y > 50);
    if (scrollBtn) scrollBtn.classList.toggle("visible", y > 400);
  }, { passive: true });

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===== ANIMATE STATS ON LOAD =====
  function animateNumber(el, target, duration = 1200) {
    if (!el) return;
    let start = null;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Animation is now triggered after buildDOM completes.

  // ===== MODAL (Event Delegation) =====
  let _lastFocusedCard = null;
  let _modalFocusables = [];
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
    } else if (isWriteupsPage) {
      modalSubtitle.textContent = "Bug Bounty Writeup";
      modalOpenBtn.textContent = "Read Writeup";
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
    setTimeout(() => {
      _modalFocusables = getModalFocusables();
      modalCloseBtn?.focus();
    }, 100);
  }

  function closeModal() {
    if (!toolModal) return;
    toolModal.classList.remove("active");
    toolModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Restore focus
    if (_lastFocusedCard) {
      _lastFocusedCard.focus();
      _lastFocusedCard = null;
    }
  }

  // Card clicks via event delegation
  document.body.addEventListener("click", (e) => {
    const card = e.target.closest(".tool-card-btn");
    if (card && toolModal) {
      e.preventDefault();
      _lastFocusedCard = card;
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
      const focusables = _modalFocusables;
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
      if (body.classList.contains("no-glow")) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isOnPage) {
        isOnPage = true;
        glowX = mouseX;
        glowY = mouseY;
        root.style.setProperty("--glow-opacity", "1");
      }
      startLoop();
    });

    document.addEventListener("mouseleave", () => {
      isOnPage = false;
      root.style.setProperty("--glow-opacity", "0");
      cancelAnimationFrame(rafId);
      rafId = null;
    });

    body.addEventListener("mouseover", (e) => {
      if (body.classList.contains("no-glow")) return;
      if (e.target.closest(".link-card, .page-nav-btn, .modal-btn, button")) {
        body.classList.add("glow-hover");
      }
    });
    body.addEventListener("mouseout", (e) => {
      if (body.classList.contains("no-glow")) return;
      if (e.target.closest(".link-card, .page-nav-btn, .modal-btn, button")) {
        body.classList.remove("glow-hover");
      }
    });

    function tick() {
      const dx = mouseX - glowX;
      const dy = mouseY - glowY;
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        // Converged — idle until next mousemove
        rafId = null;
        return;
      }
      glowX += dx * LERP;
      glowY += dy * LERP;
      root.style.setProperty("--x", glowX + "px");
      root.style.setProperty("--y", glowY + "px");
      rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(tick);
    }
  })();

  // ===== SCROLL REVEAL =====
  (() => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach((el) => observer.observe(el));
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

  // ===== NAVBAR PILL LOGIC =====
  (() => {
    // close mobile menu on link click
    document.querySelectorAll('.nav-pill a').forEach(l =>
      l.addEventListener('click', () => {
        document.querySelector('.nav-pill')?.classList.remove('open');
        document.querySelector('.nav-hamburger')?.classList.remove('open');
      })
    );

    // active link highlight
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.pill-link').forEach(l => {
      if (l.getAttribute('href') === page || l.getAttribute('href') === `./${page}`) l.classList.add('active');
    });
  })();

})();
