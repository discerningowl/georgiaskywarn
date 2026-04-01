# Georgia SKYWARN

**Official website for the Georgia SKYWARN linked repeater system**

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()

A static website providing resources for amateur radio weather spotters in North and Central Georgia. The site facilitates severe weather reporting through the Georgia SKYWARN linked repeater system and coordinates with the National Weather Service (NWS) office in Peachtree City, Georgia (call sign: WX4PTC).

**🔗 Live Site**: [georgiaskywarn.com](https://georgiaskywarn.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Directory Structure](#-directory-structure)
- [Recent Improvements](#-recent-improvements)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Contact](#-contact)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- **Real-time Weather Alerts**: Live NWS weather alerts with 5-minute caching
- **Repeater Directory**: Comprehensive linked and non-linked repeater information
- **WX4PTC Station Info**: Details about the NWS Peachtree City amateur radio station
- **Photo Archive**: Historical photos of station equipment and operations
- **Reporting Resources**: Multiple ways to submit weather reports (radio, phone, online)

### Technical Features
- **Mobile-First Responsive Design**: Optimized for all screen sizes (320px+)
- **Dark Mode Support**: Automatic theme switching via `prefers-color-scheme`
- **Accessibility**: WCAG 2.1 AA compliant with full ARIA attributes
- **Performance**: localStorage caching, DNS prefetch, background refresh
- **Security**: Content Security Policy headers, secure external links
- **SEO Optimized**: Comprehensive meta tags, sitemap, robots.txt
- **Social Media Ready**: Open Graph and Twitter Card integration

---

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup with ARIA landmarks
- **CSS3**: Modern layout with Grid, Flexbox, and CSS Custom Properties
- **Vanilla JavaScript**: No external dependencies, IIFE pattern
- **NWS Weather API**: Real-time alerts from `api.weather.gov`

### Architecture
- **Static Site**: No backend, no build process
- **Standard Directory Layout**: `css/`, `js/`, `data/`, `assets/` with HTML in root
- **Component-Based CSS**: BEM naming conventions
- **Progressive Enhancement**: Works without JavaScript (footer excluded)

---

## 📁 Directory Structure

```
georgiaskywarn/
├── index.html              # Spotter dashboard with HWO and all alerts (home page)
├── spotters.html           # Spotter resources and training
├── repeaters.html          # Linked and non-linked repeaters
├── nwsffclinks.html        # NWS links and resources
├── wx4ptc.html             # WX4PTC station information
├── about.html              # Site overview and structure
├── photoarchive.html       # Historical station photos
├── robots.txt              # Search engine directives
├── sitemap.xml             # Site map for SEO
├── css/                    # Stylesheets
│   └── style.css           # Shared stylesheet (all pages)
├── js/                     # JavaScript files (8 files)
│   ├── version.js          # Version number for cache busting
│   ├── loader.js           # Dynamic script loader with versioning
│   ├── core.js             # Core utilities (merged config + utils)
│   ├── components.js       # UI components (merged header + footer)
│   ├── scripts.js          # Page-specific JavaScript (alerts, repeaters)
│   ├── nws-api.js          # NWS API integration and HWO
│   ├── search.js           # Sitewide search with fuzzy matching
│   └── changelog.js        # Changelog display
├── data/                   # Data files
│   ├── repeaters.json      # Unified repeater data (linked + non-linked)
│   ├── search-index.json   # Sitewide search index
│   └── changelog.json      # Website changelog/updates
├── assets/                 # Static assets
│   ├── favicon.ico         # Site favicon
│   ├── georgiaskywarnlogo.png  # Site logo
│   ├── nws.gif             # NWS logo
│   └── archive/            # Historical station photos
│       └── WX4PTC*.jpg
├── CLAUDE.md               # Technical documentation for developers
├── ADMIN_GUIDE.md          # Administrator's guide for non-technical users
├── README.md               # This file - project overview
├── www/                    # Legacy redirect (DO NOT REMOVE)
│   └── index.html
└── wx4ptc/                 # Legacy redirect (DO NOT REMOVE)
    ├── index.html
    └── ReadMe.md
```

### ⚠️ Important: Directory Structure

**HTML files MUST remain in the root directory.** CSS, JS, data, and static assets are organized into named subdirectories. Do not move HTML files into subdirectories, or rename/remove existing directories. This structure is required for:

1. **External Links**: NWS, RepeaterBook, and ham radio forums link directly to HTML file paths
2. **Legacy Redirects**: The `wx4ptc/` and `www/` directories handle old URLs still in use
3. **Static Hosting**: Deployment configuration depends on HTML files being in root

See [CLAUDE.md](CLAUDE.md) for detailed documentation.

---

## 📡 Repeater Data (`data/repeaters.json`)

All repeater data is stored in a single unified JSON file. Fields appear in the following order for every entry:

| # | Field | Type | Required | Description |
|---|-------|------|----------|-------------|
| 1 | `id` | string | Yes | Unique identifier: `CALLSIGN-FREQUENCY` (e.g., `W4PSZ-444.600`) |
| 2 | `location` | string | Yes | City or geographic location |
| 3 | `frequency` | string | Yes | Frequency with offset (e.g., `"147.390+"`, `"145.210-"`) |
| 4 | `tone` | string/null | Yes | CTCSS/PL tone in Hz (e.g., `"141.3 Hz"`) or `null` if no tone |
| 5 | `tags` | array | Yes | Network affiliations (can be empty `[]`) |
| 6 | `description` | string | Yes | Coverage area, features, emergency power, etc. |
| 7 | `callsign` | string | Yes | Amateur radio callsign or `"n0call"` if unknown |
| 8 | `refurl` | string | Yes | RepeaterBook reference URL |
| 9 | `linked` | boolean | Yes | `true` if part of linked SKYWARN network |
| 10 | `verified` | boolean | Yes | `true` if verified against RepeaterBook |
| 11 | `picUrl` | string | When applicable | Station photo link (only select repeaters) |
| 12 | `clubName` | string/null | Yes | Sponsoring club name, or `null` if unknown |
| 13 | `clubUrl` | string/null | Yes | Sponsoring club URL, or `null` if unknown |
| 14 | `iplinks` | array | No | Internet linking (AllStar, EchoLink, etc.). Omit if none. |
| 15 | `rflinks` | array | No | Radio frequency links. Omit if none. |

### Network Tags

| Tag Value | Badge Color | System |
|-----------|-------------|--------|
| `WX4PTC System` | Blue | Primary SKYWARN hub system |
| `WX4EMA` | Green | Macon-Bibb County Emergency Management |
| `Peach State Intertie` | Orange | Central Georgia linked system |
| `Cherry Blossom Intertie` | Pink | Central Georgia linked system |
| `SE Linked Repeater` | Indigo | Southeastern Linked Repeater System (multi-state RF network) |

### Validation Sources

- [Georgia SKYWARN Linked Repeaters System](https://www.repeaterbook.com/repeaters/feature_search.php?system=Georgia+SKYWARN+Linked+Repeaters+System&type=systems)
- [Peach State Intertie System](https://www.repeaterbook.com/repeaters/feature_search.php?system=Peach+State+Intertie+System&type=systems)
- [Cherry Blossom Intertie System](https://www.repeaterbook.com/repeaters/feature_search.php?system=Cherry+Blossom+Intertie+System&type=systems)
- [Southeastern Linked Repeater System](https://www.repeaterbook.com/repeaters/feature_search.php?system=Southeastern+Linked+Repeater+System&type=systems)

---

## 🚀 Recent Improvements

### February 8, 2026 - Clickable IP Links in Repeater Details

**Enhanced User Experience** ✅
- AllStar and EchoLink nodes in repeater detail modal are now clickable
- AllStar links open the AllStar Stats page for real-time node status
- EchoLink links open the RepeaterBook node status page
- External link icons (↗) indicate clickable rows
- Improved hover effects and visual feedback for interactive elements

### January 9, 2026 - JavaScript Consolidation & Code Deduplication

**Major Refactoring** ✅
- Reduced JavaScript files from 9 to 7 (-22% file count reduction)
- Eliminated ~185-270 lines of duplicate code
- Fixed root cause of modal color inconsistency bug
- Created `js/core.js` (merged config.js + utils.js)
- Created `js/components.js` (merged header.js + footer.js)
- Single source of truth for modal operations (prevents future duplication bugs)

**Consolidated Functions** ✅
- Moved `openAlertModal()` to UTILS (was duplicated in scripts.js and nws-api.js)
- Unified `sanitizeHTML()` with optional newline conversion
- Added `closeModal()`, `getAlertColorClass()`, `applyModalColor()` utilities
- Consolidated timestamp update functions across all pages

**Modal Styling Consistency** ✅
- Fixed CSV export modal headers (black text → white text)
- Standardized all modal header styling (fonts, colors, sizing)
- Added universal CSS rules for headings in modal headers
- All modals now match consistent appearance

**Website Restructuring** ✅
- Dashboard is now the home page (index.html)
- Renamed old home page to spotters.html
- Updated all navigation links across site
- Added dynamic repeater last-updated date display

### January 2, 2026 - Code Optimization & Enhanced Features

**Code Reorganization** ✅
- Eliminated ~450 lines of duplicate code through modular architecture
- Created centralized configuration system (`js/config.js`)
- Implemented shared utility functions (`js/utils.js`)
- Organized JavaScript files into `js/` directory and data files into `data/`
- Reduced bundle size and improved maintainability

**Enhanced Spotter Activation System** ✅
- Implemented three-level urgency detection (standard/enhanced/PDS)
- Automatic activation status from NWS Hazardous Weather Outlook
- Color-coded visual indicators for quick assessment
- Improved pattern matching for activation keywords

**Improved Reliability** ✅
- Added defensive error handling and cache diagnostics
- Robust fallbacks for configuration loading failures
- Enhanced API error handling with better user feedback
- Improved reliability during severe weather events

**Unified Spotter Dashboard** ✅
- Consolidated alerts into comprehensive dashboard
- HWO integration with 4-hour cache
- Quick access to 6 essential weather and situational awareness maps
- Real-time alerts refresh every 5 minutes

### December 30, 2025 - Component-Based Architecture

**Major Redesign** ✅
- Implemented dynamic header and footer components (`header.js`, `footer.js`)
- Unified header with integrated logo, navigation, and theme toggle
- Sticky floating page navigation with glassmorphism effects
- Enhanced mobile navigation with full-screen overlay
- All 7 pages updated to use component-based architecture

---

## 💻 Development

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for testing dynamic content loading)
- Text editor with HTML/CSS/JS support

### Local Development

```bash
# Clone the repository
git clone https://github.com/discerningowl/georgiaskywarn.git
cd georgiaskywarn

# Start a local web server (Python example)
python3 -m http.server 8000

# Or use Node.js http-server
npx http-server -p 8000

# Open browser to http://localhost:8000
```

### Development Guidelines

1. **Read [CLAUDE.md](CLAUDE.md) first** - Comprehensive documentation for contributors
2. **Mobile-first CSS** - Base styles for mobile, then desktop overrides
3. **Use existing patterns** - Follow IIFE, BEM naming, semantic HTML
4. **Test accessibility** - Keyboard navigation, screen readers, color contrast
5. **Respect directory layout** - HTML in root; assets/CSS/JS/data in their subdirectories

### Testing Checklist

- [ ] Mobile view (320px-767px)
- [ ] Tablet view (768px-1024px)
- [ ] Desktop view (1024px+)
- [ ] Light mode appearance
- [ ] Dark mode appearance
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] NWS API responses
- [ ] Cache expiration (5 minutes)
- [ ] Print layout

---

## 📦 Deployment

### Static Hosting

This site works with any static hosting provider:

- **GitHub Pages**: Recommended for free hosting
- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-config deployment
- **AWS S3**: With CloudFront CDN
- **Traditional hosting**: Upload files via FTP/SFTP

### Deployment Steps

1. Ensure HTML files are in root; `css/`, `js/`, `data/`, `assets/` in their subdirectories
2. Verify `sitemap.xml` has correct domain
3. Update `robots.txt` if needed
4. Upload all files maintaining directory structure
5. Configure HTTPS (required for NWS API)
6. Test all pages and API functionality

### Environment Requirements

- **HTTPS required**: NWS API calls need secure connection
- **No server-side processing**: Pure static files
- **No build step**: Upload files directly
- **CORS**: Ensure hosting allows external API calls to `api.weather.gov`

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Before Contributing

1. Read [CLAUDE.md](CLAUDE.md) for comprehensive technical documentation
2. Check [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for non-technical administrative tasks
3. Open an issue to discuss major changes

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes following existing patterns
4. Test thoroughly (mobile, desktop, light/dark modes)
5. Commit with descriptive messages (`git commit -m 'feat: Add feature'`)
6. Push to your fork (`git push origin feature/your-feature`)
7. Open a Pull Request

### Commit Message Format

```
feat: Add new feature
fix: Correct bug in alerts
docs: Update README
style: Improve mobile navigation
refactor: Simplify API error handling
```

### What NOT to Do

- ❌ Don't move HTML files out of root or rename `css/`, `js/`, `data/`, `assets/`
- ❌ Don't add external libraries (jQuery, Bootstrap, etc.)
- ❌ Don't create new CSS/JS files (use existing ones)
- ❌ Don't remove ARIA attributes
- ❌ Don't break mobile responsiveness
- ❌ Don't hardcode colors (use CSS custom properties)

---

## 📞 Contact

**Webmaster**: Jack Parks (KQ4JP)
**Email**: kq4jp@pm.me
**Website**: [georgiaskywarn.com](https://georgiaskywarn.com)

### Key Contacts

- **NWS Warnings Coordinator**: David Nadler - David.Nadler@noaa.gov
- **DEC ARES / NWS**: Robert Burton (KD4YDC) - kd4ydc@gmail.com

### Resources

- [NWS Atlanta Office](https://www.weather.gov/ffc/)
- [SKYWARN Spotter Training](https://www.weather.gov/ffc/SKYWARNsched)
- [NWS Weather API Documentation](https://www.weather.gov/documentation/services-web-api)
- [RepeaterBook](https://www.repeaterbook.com/)

---

## 📄 License

© 2025 Georgia SKYWARN · All Rights Reserved

This website is maintained by volunteer amateur radio operators in coordination with the National Weather Service Atlanta office. Content may be used for educational and public safety purposes with attribution.

---

## 🙏 Acknowledgments

- **National Weather Service** - Weather data and coordination
- **NWS Peachtree City (FFC)** - WX4PTC station support
- **Georgia ARES/SKYWARN volunteers** - Field reporting and net control
- **Amateur Radio Emergency Service (ARES)** - Emergency communications
- **RepeaterBook** - Repeater frequency data

---

**Last Updated**: April 1, 2026
**Maintained By**: Georgia SKYWARN Team
**For Questions**: Contact webmaster at kq4jp@pm.me
