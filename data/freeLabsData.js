// ===== TryHackMe Free Labs — Category Grouper =====
// Groups the flat roomsData array into categories for app.js

const _meta = {
  'Intro': ['🎓', 'cat-thm'],
  'Linux': ['🐧', 'cat-thm'],
  'Windows': ['🪟', 'cat-thm'],
  'Web': ['🌐', 'cat-thm'],
  'Basics': ['📘', 'cat-thm'],
  'Recon': ['🔍', 'cat-thm'],
  'Scripting': ['💻', 'cat-thm'],
  'Networking': ['🔗', 'cat-thm'],
  'Tooling': ['🔧', 'cat-thm'],
  'Cryptography': ['🔐', 'cat-thm'],
  'Steganography': ['🖼️', 'cat-thm'],
  'Forensics': ['🔬', 'cat-thm'],
  'Reverse Engineering': ['⚙️', 'cat-thm'],
  'Malware Analysis': ['🦠', 'cat-thm'],
  'PrivEsc': ['⬆️', 'cat-thm'],
  'Active Directory': ['🏢', 'cat-thm'],
  'CTF': ['🚩', 'cat-thm'],
  'PCAP Analysis': ['📡', 'cat-thm'],
  'Buffer Overflow': ['💥', 'cat-thm'],
  'Android': ['📱', 'cat-thm'],
  'Wi-Fi Hacking': ['📶', 'cat-thm'],
  'Misc': ['📦', 'cat-thm'],
  'Special Events': ['🎄', 'cat-thm'],
  'Container Security': ['🐳', 'cat-thm'],
  'Exploit Development': ['🎯', 'cat-thm']
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
      url: 'https://tryhackme.com/room/' + _urlName(r.name),
      desc: r.description,
      tags: r.tags,
      difficulty: r.difficulty
    }))
  };
});
