// ===== TryHackMe Free Labs — Category Grouper =====
// Groups the flat roomsData array into categories for main.js

const _meta = {
  // 🟢 Foundation
  'Intro':                ['🎓', 'cat-thm'],
  'Basics':               ['📘', 'cat-thm'],
  'Linux':                ['🐧', 'cat-thm'],
  'Windows':              ['🪟', 'cat-thm'],

  // 🔵 Core Skills
  'Networking':           ['🔗', 'cat-thm'],
  'Web':                  ['🌐', 'cat-thm'],
  'Scripting':            ['💻', 'cat-thm'],
  'Recon':                ['🔍', 'cat-thm'],
  'Tooling':              ['🔧', 'cat-thm'],

  // 🟣 Analysis & Investigation
  'Cryptography':         ['🔐', 'cat-thm'],
  'Steganography':        ['🖼️', 'cat-thm'],
  'Forensics':            ['🔬', 'cat-thm'],
  'PCAP Analysis':        ['📡', 'cat-thm'],

  // 🟠 Offensive Skills
  'Reverse Engineering':  ['⚙️', 'cat-thm'],
  'Malware Analysis':     ['🦠', 'cat-thm'],
  'Buffer Overflow':      ['💥', 'cat-thm'],
  'Exploit Development':  ['🎯', 'cat-thm'],
  'Privilege Escalation': ['⬆️', 'cat-thm'],

  // 🔴 Advanced Topics
  'Active Directory':     ['🏢', 'cat-thm'],
  'Container Security':   ['🐳', 'cat-thm'],
  'Android':              ['📱', 'cat-thm'],
  'Wi-Fi Hacking':        ['📶', 'cat-thm'],

  // ⚪ Misc
  'CTF':                  ['🚩', 'cat-thm'],
  'Special Events':       ['🎄', 'cat-thm'],
  'Misc':                 ['📦', 'cat-thm'],
};

const _urlName = (n) => n.toLowerCase().replace(/ /g, '').replace(/[^\w-]+/g, '');

// Group flat roomsData by category
const _grouped = {};
roomsData.forEach(r => {
  if (!_grouped[r.category]) _grouped[r.category] = [];
  _grouped[r.category].push(r);
});

// Sort rooms alphabetically within each category
Object.values(_grouped).forEach(arr => arr.sort((a, b) => a.name.localeCompare(b.name)));

// Build categories array for main.js (ordered by _meta)
window.__cyberData = Object.keys(_meta)
  .filter(c => _grouped[c])
  .map(c => {
  const m = _meta[c];
  return {
    name: c,
    icon: m[0],
    theme: m[1],
    links: _grouped[c].map(r => ({
      name: r.name,
      url: 'https://tryhackme.com/room/' + (r.slug || _urlName(r.name)),
      desc: r.description,
      tags: [r.difficulty.toLowerCase(), ...r.tags],
      difficulty: r.difficulty
    }))
  };
});
