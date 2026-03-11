// ===== TryHackMe Free Labs — Category Grouper =====
// Groups the flat roomsData array into categories for app.js

const _meta = {
  // 🟢 Foundation
  'Intro':                ['🎓', 'cat-thm'],
  'Basics':               ['📘', 'cat-thm'],
  'Linux':                ['🐧', 'cat-thm'],
  'Windows':              ['🪟', 'cat-thm'],
  'Web':                  ['🌐', 'cat-thm'],

  // 🔵 Core Skills
  'Networking':           ['🔗', 'cat-thm'],
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

  // 🔴 Advanced Topics
  'Privilege Escalation': ['⬆️', 'cat-thm'],
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

// Build categories array for app.js
const categories = Object.keys(_grouped).map(c => {
  const m = _meta[c] || ['📁', 'cat-thm'];
  return {
    name: c,
    icon: m[0],
    theme: m[1],
    links: _grouped[c].map(r => ({
      name: r.name,
      url: 'https://tryhackme.com/room/' + (r.slug || _urlName(r.name)),
      desc: r.description,
      tags: r.tags,
      difficulty: r.difficulty
    }))
  };
});
