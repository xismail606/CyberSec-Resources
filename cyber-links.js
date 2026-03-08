// ===== DATA =====
const categories = [
  {
    name: "Data Breach & Password Security",
    icon: "🔓",
    theme: "cat-breach",
    links: [
      {
        name: "DeHashed",
        url: "https://dehashed.com/",
        desc: "Leaked database search engine",
      },
      {
        name: "Password Checker & Generator",
        url: "https://0xqenawy.github.io/password-checker/generator.html",
        desc: "Generate & check password strength",
      },
      {
        name: "SECURE-PASSWORD-GENERATOR",
        url: "https://github.com/xismail606/SECURE-PASSWORD-GENERATOR",
        desc: "Secure modular Bash password generator using /dev/urandom",
      },
    ],
  },
  {
    name: "Encoding, Decoding & Crypto",
    icon: "🔐",
    theme: "cat-encode",
    links: [
      {
        name: "Base64 Decode",
        url: "https://www.base64decode.org/",
        desc: "Encode / decode Base64 strings",
      },
      {
        name: "dCode Tools",
        url: "https://www.dcode.fr/tools-list#character_encoding",
        desc: "Crypto & encoding tools collection",
      },
      {
        name: "CyberChef",
        url: "https://gchq.github.io/CyberChef/",
        desc: "The cyber swiss army knife — GCHQ",
      },
      {
        name: "Binary to Text",
        url: "https://codebeautify.org/binary-to-text",
        desc: "Convert binary data to text",
      },
      {
        name: "JWT.io",
        url: "https://www.jwt.io/",
        desc: "JSON Web Token debugger",
      },
      {
        name: "Dogbolt Decompiler",
        url: "https://dogbolt.org/",
        desc: "Online decompilation engine",
      },
    ],
  },
  {
    name: "Hash Analysis & Cracking",
    icon: "🧬",
    theme: "cat-hash",
    links: [
      {
        name: "CrackStation",
        url: "https://crackstation.net/",
        desc: "Hash cracker & password security",
      },
      {
        name: "Hash Analyzer",
        url: "https://www.tunnelsup.com/hash-analyzer/",
        desc: "Identify hash types",
      },
      {
        name: "SHA256 Encrypt/Decrypt",
        url: "https://10015.io/tools/sha256-encrypt-decrypt",
        desc: "SHA256 hash tools",
      },
      {
        name: "SHA1 Online",
        url: "https://www.sha1-online.com/",
        desc: "SHA1 hash generator & lookup",
      },
      {
        name: "Hashes.com",
        url: "https://hashes.com/en/decrypt/hash",
        desc: "Hash decryption service",
      },
      {
        name: "Hashcat Example Hashes",
        url: "https://hashcat.net/wiki/doku.php?id=example_hashes",
        desc: "Reference for hash modes",
      },
    ],
  },
  {
    name: "OSINT & Reconnaissance",
    icon: "🕵️",
    theme: "cat-osint",
    links: [
      {
        name: "Have I Been Pwned",
        url: "https://haveibeenpwned.com/",
        desc: "Check if your email was in a data breach",
      },
      {
        name: "OSINT Framework",
        url: "https://osintframework.com/",
        desc: "Collection of OSINT tools",
      },
      { name: "Who.is", url: "https://who.is/", desc: "WHOIS domain lookup" },
      {
        name: "crt.sh",
        url: "https://crt.sh/",
        desc: "Certificate transparency search",
      },
      {
        name: "ShrewdEye",
        url: "https://shrewdeye.app/search",
        desc: "Subdomain discovery",
      },
      {
        name: "Subdomain Finder",
        url: "https://subdomainfinder.c99.nl/",
        desc: "Find subdomains of a target",
      },
      {
        name: "Pentest-Tools Subdomains",
        url: "https://pentest-tools.com/information-gathering/find-subdomains-of-domain",
        desc: "Subdomain discovery & enumeration",
      },
      {
        name: "Instant Username",
        url: "https://instantusername.com/#/",
        desc: "Username availability checker",
      },
      {
        name: "NameCheckup",
        url: "https://namecheckup.com/",
        desc: "Check username across platforms",
      },
      {
        name: "WhatsMyName",
        url: "https://whatsmyname.app/",
        desc: "Username enumeration",
      },
      {
        name: "JIMPL EXIF",
        url: "https://jimpl.com/results/yVpnUit8xvpppmdCrCgWsVSN?target=exif",
        desc: "Image EXIF data viewer",
      },
      {
        name: "ExifTool",
        url: "https://exiftool.org/",
        desc: "Metadata reader & editor for files",
      },
      {
        name: "Aleph (OCCRP)",
        url: "https://aleph.occrp.org/",
        desc: "Search investigative data",
      },
      {
        name: "OCCRP",
        url: "https://www.occrp.org/en",
        desc: "Organized crime reporting",
      },
      {
        name: "CrunchBase",
        url: "https://www.crunchbase.com/",
        desc: "Business intelligence platform",
      },
      {
        name: "SocRadar",
        url: "https://socradar.io/",
        desc: "Threat intelligence platform",
      },
      {
        name: "Pastebin Archives",
        url: "https://deepweblinks.net/pastebin/",
        desc: "Deep web paste sites",
      },
      {
        name: "OSINT Gist — sundowndev",
        url: "https://gist.github.com/sundowndev/283efaddbcf896ab405488330d1bbc06",
        desc: "Curated OSINT resources list",
      },
      {
        name: "Sherlock",
        url: "https://github.com/sherlock-project/sherlock",
        desc: "Hunt usernames across social networks",
      },
    ],
  },
  {
    name: "Network, DNS & Infrastructure",
    icon: "🌐",
    theme: "cat-network",
    links: [
      {
        name: "Shodan",
        url: "https://www.shodan.io/",
        desc: "Search engine for IoT & servers",
      },
      {
        name: "Censys",
        url: "https://search.censys.io/",
        desc: "Internet-wide scan data",
      },
      {
        name: "Netlas",
        url: "https://netlas.io/",
        desc: "Internet intelligence search",
      },
      {
        name: "FOFA",
        url: "https://en.fofa.info/",
        desc: "Cyberspace search engine",
      },
      {
        name: "BGP Hurricane Electric",
        url: "https://bgp.he.net/",
        desc: "BGP toolkit & looking glass",
      },
      {
        name: "Security Headers",
        url: "https://securityheaders.com/",
        desc: "Analyze HTTP security headers",
      },
      {
        name: "ViewDNS Reverse IP",
        url: "https://viewdns.info/reverseip/",
        desc: "Reverse IP lookup",
      },
      {
        name: "DNS Queries",
        url: "https://www.dnsqueries.com/en/",
        desc: "DNS lookup tools",
      },
      {
        name: "HakRevDNS",
        url: "https://github.com/hakluke/hakrevdns",
        desc: "Reverse DNS lookup tool",
      },
      {
        name: "PageSpeed Insights",
        url: "https://pagespeed.web.dev/",
        desc: "Web performance analysis",
      },
      {
        name: "WiGLE",
        url: "https://wigle.net/",
        desc: "Wireless network mapping & database",
      },
    ],
  },
  {
    name: "Vulnerability Databases",
    icon: "⚠️",
    theme: "cat-vuln",
    links: [
      {
        name: "CVE Records",
        url: "https://www.cve.org/CVERecord/SearchResults?query=laravel&source=post_page-----24a3bd5dda9a---------------------------------------",
        desc: "Search CVE vulnerability records",
      },
      {
        name: "NVD (NIST)",
        url: "https://nvd.nist.gov/vuln/search#/nvd/home?resultType=records",
        desc: "National Vulnerability Database",
      },
      {
        name: "Zone-H Archive",
        url: "https://www.zone-h.org/archive/special=1?hz=1",
        desc: "Web defacement archive",
      },
    ],
  },
  {
    name: "Malware Analysis",
    icon: "🦠",
    theme: "cat-malware",
    links: [
      {
        name: "ANY.RUN",
        url: "https://app.any.run/tasks/a66178de-7596-4a05-945d-704dbf6b3b90",
        desc: "Interactive malware sandbox",
      },
      {
        name: "Spectrum Analyzer",
        url: "https://academo.org/demos/spectrum-analyzer/",
        desc: "Audio frequency spectrum tool",
      },
    ],
  },
  {
    name: "Steganography & Image Analysis",
    icon: "🖼️",
    theme: "cat-stego",
    links: [
      {
        name: "Aperi'Solve",
        url: "https://www.aperisolve.com/",
        desc: "Image steganography solver",
      },
      {
        name: "0xRick Stego Tools",
        url: "https://0xrick.github.io/lists/stego/#web-tools",
        desc: "Stego tools list",
      },
    ],
  },
  {
    name: "Email Intelligence",
    icon: "📧",
    theme: "cat-email",
    links: [
      {
        name: "Hunter.io",
        url: "https://hunter.io/?via=annie&gad_source=1&gad_campaignid=22707266086&gclid=EAIaIQobChMInbi-ipnJkgMVuZRQBh1TTgv-EAAYASAAEgLNDfD_BwE",
        desc: "Email address finder",
      },
      {
        name: "Snov.io",
        url: "https://app.snov.io/",
        desc: "Email finder & verifier",
      },
      {
        name: "AnyMailFinder",
        url: "https://newapp.anymailfinder.com/auth/login?successUrl=https%3A%2F%2Fnewapp.anymailfinder.com%2Fsearch%2Fsingle",
        desc: "Find email addresses",
      },
      {
        name: "Prospeo",
        url: "https://prospeo.io/login",
        desc: "Email prospecting tool",
      },
      {
        name: "DB Lookup Bot (Telegram)",
        url: "https://t.me/database_lookupbot",
        desc: "Telegram database lookup bot",
      },
    ],
  },
  {
    name: "Security Resources & Wordlists",
    icon: "📚",
    theme: "cat-resources",
    links: [
      {
        name: "SecLists",
        url: "https://github.com/danielmiessler/SecLists",
        desc: "Security assessment wordlists",
      },
    ],
  },
];

// ===== RENDER =====
const container = document.getElementById("categoriesContainer");
let totalTools = 0;

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
    section.innerHTML = `
      <div class="category-header">
        <div class="category-icon">${cat.icon}</div>
        <h2 class="category-title">${cat.name}</h2>
        <span class="category-count">${filteredLinks.length} tool${filteredLinks.length > 1 ? "s" : ""}</span>
      </div>
      <div class="links-grid">
        ${filteredLinks
          .map(
            (link) => `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card" title="${link.desc}">
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
        `,
          )
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

// ===== SEARCH =====
const searchInput = document.getElementById("searchInput");
let debounceTimer;
searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    renderCategories(e.target.value.trim());
  }, 200);
});

// ===== SCROLL TO TOP =====
const scrollBtn = document.getElementById("scrollTop");
window.addEventListener("scroll", () => {
  scrollBtn.classList.toggle("visible", window.scrollY > 400);
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

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
