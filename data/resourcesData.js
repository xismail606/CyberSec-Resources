// ===== CyberSec Resources Data =====
const categories = [
  {
    name: "Data Breach & Password Security",
    icon: "🔓",
    theme: "cat-breach",
    links: [
      {
        name: "DeHashed",
        url: "https://dehashed.com/",
        desc: "Search leaked databases for compromised credentials",
      },
      {
        name: "Password Checker & Generator",
        url: "https://0xqenawy.github.io/password-checker/generator.html",
        desc: "Generate strong passwords & test their strength",
      },
      {
        name: "SECURE-PASSWORD-GENERATOR",
        url: "https://github.com/xismail606/SECURE-PASSWORD-GENERATOR",
        desc: "Bash script that generates cryptographically secure passwords",
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
        desc: "Encode & decode Base64 strings online",
      },
      {
        name: "dCode Tools",
        url: "https://www.dcode.fr/tools-list#character_encoding",
        desc: "Solve ciphers, decode encodings & analyze crypto",
      },
      {
        name: "CyberChef",
        url: "https://gchq.github.io/CyberChef/",
        desc: "Data encoding, encryption & analysis swiss army knife",
      },
      {
        name: "Binary to Text",
        url: "https://codebeautify.org/binary-to-text",
        desc: "Convert binary data to readable text format",
      },
      {
        name: "JWT.io",
        url: "https://www.jwt.io/",
        desc: "Decode, verify & debug JSON Web Tokens",
      },
      {
        name: "Dogbolt Decompiler",
        url: "https://dogbolt.org/",
        desc: "Decompile binaries online using multiple decompilers",
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
        desc: "Crack password hashes using massive lookup tables",
      },
      {
        name: "Hash Analyzer",
        url: "https://www.tunnelsup.com/hash-analyzer/",
        desc: "Identify unknown hash types automatically",
      },
      {
        name: "SHA256 Encrypt/Decrypt",
        url: "https://10015.io/tools/sha256-encrypt-decrypt",
        desc: "Generate & verify SHA256 hashes online",
      },
      {
        name: "SHA1 Online",
        url: "https://www.sha1-online.com/",
        desc: "Generate SHA1 hashes & reverse lookup",
      },
      {
        name: "Hashes.com",
        url: "https://hashes.com/en/decrypt/hash",
        desc: "Decrypt hashes with a large rainbow table database",
      },
      {
        name: "Hashcat Example Hashes",
        url: "https://hashcat.net/wiki/doku.php?id=example_hashes",
        desc: "Reference list of all Hashcat-supported hash types",
      },
      {
        name: "John the Ripper",
        url: "https://www.openwall.com/john/",
        desc: "Crack passwords offline using dictionary & brute-force attacks",
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
        desc: "Check if your email or phone was exposed in a breach",
      },
      {
        name: "OSINT Framework",
        url: "https://osintframework.com/",
        desc: "Organized collection of free OSINT tools & resources",
      },
      { name: "Who.is", url: "https://who.is/", desc: "Lookup domain registration & ownership details" },
      {
        name: "crt.sh",
        url: "https://crt.sh/",
        desc: "Search SSL/TLS certificate transparency logs",
      },
      {
        name: "ShrewdEye",
        url: "https://shrewdeye.app/search",
        desc: "Discover subdomains of any target domain",
      },
      {
        name: "Subdomain Finder",
        url: "https://subdomainfinder.c99.nl/",
        desc: "Enumerate & find hidden subdomains",
      },
      {
        name: "Pentest-Tools Subdomains",
        url: "https://pentest-tools.com/information-gathering/find-subdomains-of-domain",
        desc: "Scan & enumerate subdomains for pentesting",
      },
      {
        name: "Instant Username",
        url: "https://instantusername.com/#/",
        desc: "Check username availability across 100+ platforms",
      },
      {
        name: "NameCheckup",
        url: "https://namecheckup.com/",
        desc: "Search for a username across social media & websites",
      },
      {
        name: "WhatsMyName",
        url: "https://whatsmyname.app/",
        desc: "Enumerate usernames across hundreds of websites",
      },
      {
        name: "JIMPL EXIF",
        url: "https://jimpl.com/results/yVpnUit8xvpppmdCrCgWsVSN?target=exif",
        desc: "Extract & view EXIF metadata from images online",
      },
      {
        name: "ExifTool",
        url: "https://exiftool.org/",
        desc: "Read & edit metadata in images, docs & media files",
      },
      {
        name: "Aleph (OCCRP)",
        url: "https://aleph.occrp.org/",
        desc: "Search global investigative & leaked documents",
      },
      {
        name: "OCCRP",
        url: "https://www.occrp.org/en",
        desc: "Investigative journalism on organized crime & corruption",
      },
      {
        name: "CrunchBase",
        url: "https://www.crunchbase.com/",
        desc: "Research companies, startups & their key people",
      },
      {
        name: "SocRadar",
        url: "https://socradar.io/",
        desc: "Monitor digital assets & detect external threats",
      },
      {
        name: "Pastebin Archives",
        url: "https://deepweblinks.net/pastebin/",
        desc: "Browse archived deep web paste site content",
      },
      {
        name: "OSINT Gist — sundowndev",
        url: "https://gist.github.com/sundowndev/283efaddbcf896ab405488330d1bbc06",
        desc: "Curated list of OSINT techniques & resources",
      },
      {
        name: "Sherlock",
        url: "https://github.com/sherlock-project/sherlock",
        desc: "Track usernames across 400+ social networks",
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
        desc: "Search for internet-connected devices & exposed services",
      },
      {
        name: "Censys",
        url: "https://search.censys.io/",
        desc: "Discover & monitor internet-facing assets & certificates",
      },
      {
        name: "Netlas",
        url: "https://netlas.io/",
        desc: "Search & analyze internet attack surfaces",
      },
      {
        name: "FOFA",
        url: "https://en.fofa.info/",
        desc: "Map global cyberspace assets & network fingerprints",
      },
      {
        name: "BGP Hurricane Electric",
        url: "https://bgp.he.net/",
        desc: "Explore BGP routing, ASN & network peering data",
      },
      {
        name: "Security Headers",
        url: "https://securityheaders.com/",
        desc: "Scan & grade HTTP security headers of any website",
      },
      {
        name: "ViewDNS Reverse IP",
        url: "https://viewdns.info/reverseip/",
        desc: "Find all domains hosted on a specific IP address",
      },
      {
        name: "DNS Queries",
        url: "https://www.dnsqueries.com/en/",
        desc: "Run DNS queries like A, MX, NS & TXT lookups",
      },
      {
        name: "HakRevDNS",
        url: "https://github.com/hakluke/hakrevdns",
        desc: "Mass reverse DNS lookups for IP ranges",
      },
      {
        name: "PageSpeed Insights",
        url: "https://pagespeed.web.dev/",
        desc: "Analyze website speed & performance metrics",
      },
      {
        name: "WiGLE",
        url: "https://wigle.net/",
        desc: "Map & search wireless networks by location worldwide",
      },
      {
        name: "Wireshark",
        url: "https://www.wireshark.org/",
        desc: "Capture & inspect network traffic in real time",
      },
      {
        name: "Nmap",
        url: "https://nmap.org/",
        desc: "Scan networks to discover hosts, ports & services",
      },
      {
        name: "Snort",
        url: "https://www.snort.org/",
        desc: "Detect & block network intrusions in real time",
      },
      {
        name: "Tcpdump",
        url: "https://www.tcpdump.org/",
        desc: "Capture & filter network packets from the command line",
      },
      {
        name: "OpenVPN",
        url: "https://openvpn.net/",
        desc: "Create secure encrypted VPN tunnels",
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
        desc: "Search the official CVE vulnerability record database",
      },
      {
        name: "NVD (NIST)",
        url: "https://nvd.nist.gov/vuln/search#/nvd/home?resultType=records",
        desc: "Browse NIST's database of analyzed vulnerabilities & CVSS scores",
      },
      {
        name: "Zone-H Archive",
        url: "https://www.zone-h.org/archive/special=1?hz=1",
        desc: "Archive of website defacements & hacking incidents",
      },
      {
        name: "Exploit-DB",
        url: "https://www.exploit-db.com/",
        desc: "Search public exploits & shellcodes for known vulnerabilities",
      },
      {
        name: "VulDB",
        url: "https://vuldb.com/",
        desc: "Track & research latest vulnerability disclosures",
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
        desc: "Run & analyze malware behavior in a live sandbox",
      },
      {
        name: "Spectrum Analyzer",
        url: "https://academo.org/demos/spectrum-analyzer/",
        desc: "Visualize audio frequency spectrum in real time",
      },
      {
        name: "VirusTotal",
        url: "https://www.virustotal.com/gui/home/upload",
        desc: "Scan files, URLs & IPs with 70+ antivirus engines",
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
        desc: "Automatically detect & extract hidden data in images",
      },
      {
        name: "0xRick Stego Tools",
        url: "https://0xrick.github.io/lists/stego/#web-tools",
        desc: "Curated list of steganography tools & techniques",
      },
      {
        name: "StegSeek",
        url: "https://github.com/RickdeJager/StegSeek",
        desc: "Brute-force steghide passphrases at high speed",
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
        desc: "Find & verify professional email addresses by domain",
      },
      {
        name: "Snov.io",
        url: "https://app.snov.io/",
        desc: "Find emails, verify deliverability & run outreach",
      },
      {
        name: "AnyMailFinder",
        url: "https://newapp.anymailfinder.com/auth/login?successUrl=https%3A%2F%2Fnewapp.anymailfinder.com%2Fsearch%2Fsingle",
        desc: "Discover verified email addresses for any domain",
      },
      {
        name: "Prospeo",
        url: "https://prospeo.io/login",
        desc: "Find decision-maker emails for sales prospecting",
      },
      {
        name: "DB Lookup Bot (Telegram)",
        url: "https://t.me/database_lookupbot",
        desc: "Lookup leaked data directly via Telegram bot",
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
        desc: "Massive collection of wordlists for fuzzing & pentesting",
      },
    ],
  },
  {
    name: "Penetration Testing & Exploitation",
    icon: "🎯",
    theme: "cat-pentest",
    links: [
      {
        name: "Burp Suite",
        url: "https://portswigger.net/burp",
        desc: "Intercept, scan & exploit web app vulnerabilities",
      },
      {
        name: "Metasploit",
        url: "https://www.metasploit.com/",
        desc: "Develop & execute exploits against remote targets",
      },
      {
        name: "Sqlmap",
        url: "https://sqlmap.org/",
        desc: "Automate SQL injection detection & database extraction",
      },
      {
        name: "Aircrack-ng",
        url: "https://www.aircrack-ng.org/",
        desc: "Crack WPA/WEP keys & audit Wi-Fi network security",
      },
    ],
  },
  {
    name: "System & Process Analysis",
    icon: "🔧",
    theme: "cat-system",
    links: [
      {
        name: "Sysinternals Suite",
        url: "https://learn.microsoft.com/en-us/sysinternals/",
        desc: "Deep Windows troubleshooting & system analysis tools",
      },
      {
        name: "Autoruns",
        url: "https://learn.microsoft.com/en-us/sysinternals/downloads/autoruns",
        desc: "View & control all auto-start programs on Windows",
      },
      {
        name: "Process Explorer",
        url: "https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer",
        desc: "Inspect running processes, DLLs & system handles in detail",
      },
    ],
  },
];
