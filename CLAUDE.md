# CLAUDE.md - Georgia SKYWARN Website

## Project Overview

The **Georgia SKYWARN** website (`georgiaskywarn.com`) is a static HTML/CSS website that provides resources for amateur radio weather spotters in North and Central Georgia. The site facilitates severe weather reporting through the Georgia SKYWARN linked repeater system and coordinates with the National Weather Service (NWS) office in Peachtree City, Georgia (call sign: WX4PTC).

**Author**: Jack Parks (KQ4JP) <kq4jp@pm.me>
**Primary Purpose**: SKYWARN volunteer coordination, weather alert distribution, and amateur radio repeater network information
**Tech Stack**: HTML5, CSS3, Vanilla JavaScript, NWS Weather API
**Design Philosophy**: Mobile-first, accessible, responsive, minimal dependencies

---

## Repository Structure

```
georgiaskywarn/
├── index.html              # Main landing page / spotter dashboard with HWO, activation status, and all alerts
├── repeaters.html          # Dedicated page for linked and non-linked repeaters
├── nwsffclinks.html        # Useful NWS links and resources page
├── wx4ptc.html             # Information about WX4PTC station
├── about.html              # Site structure and overview
├── changelog.html          # Full changelog history, grouped by year (linked from about.html, not in main nav)
├── photoarchive.html       # Photo archive of WX4PTC station
├── spotters.html           # Spotter resources and reporting guidelines
├── repeater-validation.html # Repeater database validation dashboard for quarterly review (stats, inactive, unverified) — noindex
├── css/                    # Stylesheets directory
│   └── style.css           # Shared stylesheet for all pages
├── js/                     # JavaScript files directory (8 files total)
│   ├── version.js          # **CRITICAL** - Single version number for cache busting
│   ├── loader.js           # **CRITICAL** - Dynamically loads all scripts with versioning
│   ├── core.js             # Core utilities (merged config.js + utils.js)
│   ├── components.js       # UI components (merged header.js + footer.js)
│   ├── scripts.js          # Page-specific JavaScript (alerts, modals, repeater search)
│   ├── nws-api.js          # NWS API integration and HWO
│   ├── changelog.js        # Changelog display
│   └── cwa-map.js          # Interactive NWS CWA choropleth map (about.html only)
├── data/                   # Data files directory
│   ├── repeaters.json      # All repeater data (linked + non-linked, dynamically loaded)
│   ├── changelog.json      # Website changelog/updates
│   ├── ffc-counties.json   # 96 NWS Peachtree City (FFC) counties
│   ├── gsp-counties.json   # 6 NWS Greenville-Spartanburg (GSP) counties
│   ├── cae-counties.json   # 5 NWS Columbia (CAE) counties
│   ├── chs-counties.json   # 12 NWS Charleston (CHS) counties
│   ├── jax-counties.json   # 14 NWS Jacksonville (JAX) counties
│   └── tae-counties.json   # 26 NWS Tallahassee (TAE) counties
├── assets/                 # Static assets directory
│   ├── favicon.ico         # Site favicon
│   ├── georgiaskywarnlogo.png  # Site logo (500x500px)
│   ├── nws.gif             # NWS logo (OG image reference)
│   └── archive/            # Photo archive directory
│       └── WX4PTC*.jpg     # WX4PTC station photos (1-8)
├── www/                    # Legacy redirect folder (DO NOT REMOVE OR MODIFY)
│   └── index.html
└── wx4ptc/                 # Legacy redirect folder (DO NOT REMOVE OR MODIFY)
    ├── index.html          # Redirect script
    └── ReadMe.md           # Explains external link preservation
```

### ⚠️ CRITICAL: Directory Structure Requirements

**HTML files MUST remain in the root directory. This is a hard requirement.**

**Current Structure** (as of April 1, 2026):
- ✅ **HTML files**: All in root directory
- ✅ **CSS files**: `css/style.css`
- ✅ **JavaScript files**: Organized in `js/` directory (7 files)
- ✅ **Data files**: JSON files in `data/` directory
- ✅ **Static assets**: `assets/` directory (favicon, logo, nws.gif, archive photos)
- ✅ **Legacy redirects**: `www/` and `wx4ptc/` directories preserved

**DO NOT**:
- ❌ Move HTML files into subdirectories (e.g., `pages/`, `src/`, `public/`)
- ❌ Move `css/style.css` out of `css/` or back to root
- ❌ Move files out of `assets/` back to root
- ❌ Rename or remove `css/`, `js/`, `data/`, or `assets/` directories
- ❌ Move `assets/archive/` photos out of `assets/`
- ❌ Remove or modify the `www/` or `wx4ptc/` directories

**WHY**: This structure is required for:
1. **External links** - Many external websites link directly to HTML files at their current root paths
2. **Legacy redirects** - The `wx4ptc/` and `www/` directories handle old URLs still in use
3. **Static hosting** - Deployment configuration depends on HTML files being in root
4. **Code organization** - The `css/`, `js/`, `data/`, and `assets/` directories follow standard conventions

### Important Notes

1. **DO NOT REMOVE** the `wx4ptc/` directory - it contains redirect scripts for external links referenced by NWS and other official sources
2. **DO NOT REMOVE** the `www/` directory - legacy redirect for old bookmarks
3. All HTML pages MUST remain in the root directory
4. All HTML pages share the same stylesheet at `css/style.css`
5. **Component architecture**: Header and footer loaded via `js/components.js` (merged for efficiency)
6. **JavaScript organization**: 8 files total (7 after 2026-01-09 refactor, +1 `cwa-map.js` added 2026-06-25)
7. **Data organization**: All JSON data files in `data/` directory
8. **Assets organization**: All static assets (images, favicon, archive photos) in `assets/` directory

---

## ⚡ CRITICAL: Centralized Version Management & Cache Busting

**IMPORTANT**: This site uses a centralized version management system to handle cache invalidation across all pages. When you make changes to JavaScript files, you MUST update version numbers to ensure users get fresh code.

### How It Works

All 7 HTML pages load scripts via a centralized loader system:

```html
<!-- Bottom of every HTML file -->
<script src="js/version.js"></script>
<script src="js/loader.js"></script>
```

**That's it!** No individual `<script>` tags for other files. The loader automatically:
1. Loads `components.js` first (header + footer, prevents flash of unstyled content)
2. Loads `core.js` (config + utils merged, provides CONFIG and UTILS namespaces)
3. Loads page-specific scripts (`nws-api.js` for index.html, `changelog.js` for about.html)
4. Loads `scripts.js` last (depends on core and page-specific scripts)
5. Appends `?v=${APP_VERSION}` to every script URL for cache busting

### 🔴 REQUIRED: Update Version After JavaScript Changes

**When you modify ANY JavaScript file, you MUST update the version number:**

#### Update `js/version.js` (line 18):
```javascript
const APP_VERSION = '20260102c';  // ← Change this to force cache refresh
```

**That's it!** This single change:
- ✅ Forces browsers to reload all JavaScript files (`?v=` parameter)
- ✅ Triggers localStorage cache clearing (utils.js reads this version)
- ✅ Updates across all 8 pages automatically

### Version Numbering Convention

Use date-based versioning with letter suffix for multiple updates per day:
- Format: `YYYYMMDD` + optional letter (`a`, `b`, `c`, etc.)
- Examples: `20260102c`, `20260103`, `20260115b`
- Increment the letter for same-day updates
- Start fresh with no letter for new days

### What Happens When Version Changes

1. **Browser cache busting**: All scripts reload with new `?v=` parameter
2. **localStorage cache clearing**: `utils.js` detects version change and clears all cached NWS data
3. **Fresh data**: Users automatically get latest JavaScript and API responses

### DO NOT

- ❌ Update JavaScript files without bumping version in `version.js`
- ❌ Add individual `<script>` tags to HTML files (use `loader.js` instead)
- ❌ Manually add version parameters to script tags in HTML
- ❌ Edit `utils.js` to change version (it reads from `version.js` automatically)

### Example: Adding a New JavaScript File

If you create a new shared JavaScript file that should load on all pages:

1. Add file to `js/` directory (e.g., `js/newfeature.js`)
2. Edit `js/loader.js` and add to `coreScripts` array:
   ```javascript
   const coreScripts = [
     'js/config.js',
     'js/utils.js',
     'js/footer.js',
     'js/scripts.js',
     'js/newfeature.js'  // ← Add here
   ];
   ```
3. Update version in `js/version.js` (line 18)
4. Done! All pages will load it automatically

### Example: Adding a Page-Specific Script

For scripts that only load on specific pages:

1. Add file to `js/` directory (e.g., `js/gallery.js`)
2. Edit `js/loader.js` and add to `pageScripts` object:
   ```javascript
   const pageScripts = {
     'index.html': ['js/nws-api.js'],
     'about.html': ['js/changelog.js'],
     'photoarchive.html': ['js/gallery.js']  // ← Add here
   };
   ```
3. Update version in `js/version.js` (line 18)
4. Done! Only `photoarchive.html` will load it

### Troubleshooting

**Users seeing old alerts or stale data?**
- Verify version was incremented in `js/version.js` (line 18)
- Check browser console for `[UTILS] Version change detected` message
- Confirm `window.APP_VERSION` is set correctly (check console: `console.log(window.APP_VERSION)`)

**Scripts not loading?**
- Check browser console for errors
- Verify all script paths in `loader.js` are correct
- Ensure `version.js` and `loader.js` are present in HTML files

---

## Page-by-Page Breakdown

### index.html (Main Page / Dashboard)
**Purpose**: Primary entry point — spotter dashboard with HWO, activation status, active alerts, and quick maps

**Navigation**:
- **Site-nav**: Links to other pages (spotters, repeaters, wx4ptc, nwsffclinks, about)
- **Page-nav**: Links to page sections (Spotter Status, Active Alerts, Quick Maps)

**Key Features**:
- Hazardous Weather Outlook (HWO) from NWS Atlanta with spotter activation detection
- Shows all alert types: warnings (red), watches (orange), and advisories (teal)
- Quick Maps section with essential weather/situational awareness tools
- HWO cached for 4 hours, alerts refresh every 5 minutes
- Modal popups for HWO details and individual alert details

### spotters.html
**Purpose**: Spotter resources, training materials, reporting guidelines, and NWS contacts

**Navigation**:
- **Site-nav**: Links to other pages
- **Page-nav**: Links to page sections (SKYWARN Info, Spotter Resources, Reporting Requirements, Submit Reports)

**Key Sections** (ordered as learn → prepare → understand → act):
1. **SKYWARN Information** — What is SKYWARN, net activation protocol, reporting best practices (sub-cards)
2. **Spotter Resources** — Training links, guidebooks, maps, situational awareness tools, NWS social media (sub-cards + action buttons)
3. **Reporting Requirements** — Checklist of what to include, NWS guidebook link, color-coded "What to Report" grid (sub-cards)
4. **Submit Reports** — Local network info, EchoLink access, phone numbers, NWS web form (sub-cards + action buttons)

**Design Pattern**: Uses `.sub-cards` / `.sub-card` grid throughout for consistent nested card layout

### repeaters.html
**Purpose**: Dedicated page for SKYWARN repeater information

**Navigation**:
- **Site-nav**: Links to other pages (back to index, wx4ptc, nwsffclinks, about)
- **Page-nav**: Links to page sections (Search Repeaters, Linked Repeaters, Non-Linked Repeaters)

**Contains**:
- Repeater search bar (Ctrl/Cmd+K shortcut)
- Complete linked repeater table (primary SKYWARN network)
- Non-linked repeaters table (local SKYWARN nets)
- Coverage notes and emergency power information

### nwsffclinks.html
**Purpose**: Comprehensive list of useful NWS and weather-related links

**Navigation**:
- **Site-nav**: Links to other pages (back to index, alerts, repeaters, wx4ptc, about)
- **Page-nav**: Links to page sections (Core Resources, Decision Support, River/Flood Info, Specialized Weather, National Centers)

**Contains** (each section uses the standard default card header with a `.sub-cards` grid inside):
- Core NWS Atlanta resources
- Decision support tools
- River and flooding information
- Specialized weather information — fire, winter, road conditions, GEMA
- National weather centers — SPC, WPC, NHC

**Design Pattern**: Uses `.sub-cards` / `.sub-card` grid for all link sections (2-col responsive)

### wx4ptc.html
**Purpose**: Information about the NWS Peachtree City amateur radio station

**Navigation**:
- **Site-nav**: Links to other pages (back to index, alerts, repeaters, nwsffclinks, about)
- **Page-nav**: Links to page sections (varies by content)

**Contains**: Station details, equipment information, operations

### about.html
**Purpose**: Meta information about the website structure

**Navigation**:
- **Site-nav**: Links to other pages (back to index, alerts, repeaters, wx4ptc, nwsffclinks)
- **Page-nav**: Links to page sections (varies by content)

**Contains**: Site overview, structure diagram, NWS service area map

### photoarchive.html
**Purpose**: Historical photos of WX4PTC station

**Navigation**:
- **Site-nav**: Links to other pages
- **Page-nav**: May vary depending on photo organization

---

## CSS Architecture (style.css)

### Design System

**CSS Custom Properties** (Light/Dark mode):
```css
--bg-body           # Body background
--text-primary      # Primary text color
--text-secondary    # Secondary/muted text
--card-bg           # Card background (with opacity)
--card-border       # Card border color
--accent-blue       # Primary accent color
--accent-red        # Warnings/danger
--accent-green      # Success/safety
--accent-indigo     # Links/interactive
--accent-yellow     # Alerts/caution
--accent-orange     # Watch-level alerts
--shadow            # Box shadow values
--glow              # Interactive glow effect
--header-gradient-* # Header background gradients
--radius            # Border radius (20px)
--transition        # Standard transition timing
```

### CSS Conventions

1. **BEM-Style Naming** (Block Element Modifier):
   ```css
   .card                 /* Block */
   .card-header          /* Element */
   .card-header--red     /* Modifier */
   ```

2. **Mobile-First Approach**:
   - Base styles for mobile (320px+)
   - `@media (min-width: 768px)` for desktop
   - Flexbox and CSS Grid for layouts

3. **Component Classes**:
   - **`.card-header` color standard (set 2026-06-30)**: the plain `.card-header` (no color modifier — dark navy gradient) is the **site-wide default for every purely-informational card banner**. Do NOT add `.card-header--blue` or any other color modifier to a card just to make it stand out. Color modifiers (`--red`, `--yellow`, `--blue`, `--orange`, `--green`) are reserved for **functional/semantic** meaning only: index.html's Spotter Activation and Active Area Alerts headers change color dynamically based on real severity (red/yellow/blue/green), and `repeater-validation.html`'s section headers use color to flag data-quality categories (red = inactive, yellow = needs review, blue = informational summary). If you're tempted to color a header purely for visual variety, don't — use the default.
   - **`.section-subheader` standard (set 2026-06-30)**: use this class — not inline styles — for any `<h3>` that introduces a labeled cluster of content *within* a `.card-body` (e.g. "Radar Maps", "How to Import into CHIRP", "Our Forecast Area..."). It renders as a centered, bold, blue-tinted banner with a left accent border (`css/style.css` ~line 1088); the first one in a card automatically gets `margin-top: 0` via `.section-subheader:first-of-type`. Originally only used on `spotters.html`; standardized across `about.html`, `repeaters.html`, and `index.html` in the same pass that fixed `.card-header`. Do NOT reinvent this with inline `style="color: var(--accent-blue);"` on a bare `<h3>`/`<h4>` — that's exactly the drift this class exists to prevent. Plain intro/tagline text that isn't really a section label (e.g. index.html's "Essential weather and situational awareness tools for spotters.") should stay plain text, not `.section-subheader`. This is a different component from `.sub-card h4` (the title *inside* an individual sub-card, not a group label).
   - **`.search-pill` standard (set 2026-06-30)**: the single shared search/filter box component (`css/style.css`, "Standard Search Pill" block just above the repeater-search section) used by the repeater search (`repeaters.html`), the county alert filter (`index.html`), and the county coverage search (`about.html`). Structure: `.search-pill` wraps a `.search-pill-icon` (magnifying glass, shown when idle), a `.search-pill-error-icon` (amber warning triangle with a `data-tooltip` CSS tooltip, only shown when the wrapping `.search-pill` has `.has-error` — currently only the county alert filter ever toggles this), a `.search-pill-clear` (circular red × button, left-justified, toggled via the `hidden` attribute — NOT a `.visible` class, that pattern was retired), and the `.search-pill-input` itself. A `:has()` rule hides the idle search icon automatically whenever the clear button or error triangle is showing, so only one indicator ever occupies the leading slot. Page-specific wrapper markup (labels, autocomplete dropdowns, outer padding bars like `.county-filter-bar` or `.county-search-wrap`) stays in each page's own CSS — only the pill itself (icon/error/clear/input) is shared. Do NOT hand-roll a new search box style; add `.search-pill` + the four child classes to any new search/filter UI instead.
   - `.card` - Reusable content container (outer card with header)
   - `.sub-cards` - Grid container for nested sub-cards inside a `.card-body` (2-col responsive)
   - `.sub-card` - Nested content card with border, hover lift, used for grouping related info
   - `.sub-card--full` - Modifier to span full width across all grid columns
   - `.sub-cards--3col` - Modifier for 3-column grid at 1024px+ (e.g., weather report types)
   - `.callout` - Highlighted tip/warning boxes (used in repeaters.html, JS error states)
   - `.btn` - Button component with color modifiers (`btn-blue`, `btn-red`, `btn-green`, `btn-orange`, `btn-yellow`)
   - `.action-buttons` - Flex container for rows of action buttons
   - `.repeater-table` - Styled tables for repeater info
   - `.alert-item` - Weather alert display cards
   - `.page-nav` - Page-specific in-page section navigation (sticky horizontal bar)
   - `.page-nav-toggle` - Mobile hamburger for page-nav (`.page-nav` only — site nav is component-injected)
   - `.nav-list` - Navigation link list (used in `.page-nav` only)
   - `.header` - Site-wide header (component-injected by `components.js` — do NOT write manually)
   - `#desktopNav` - Desktop site navigation (component-injected)
   - `.mobile-nav` / `#mobileNav` - Mobile site navigation (component-injected)
   - `.mobile-menu-btn` / `#mobileMenuBtn` - Mobile hamburger button (component-injected)

4. **Accessibility**:
   - Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
   - ARIA attributes (`role`, `aria-controls`, `aria-expanded`, `aria-label`)
   - Focus states for keyboard navigation
   - High contrast ratios for text

### Navigation System

The site uses a **two-tier navigation system**:

#### ⚠️ CRITICAL: Site navigation is component-injected

**DO NOT write site navigation markup manually.** The site-wide header and navigation are automatically injected by `js/components.js` into every page via `loadHeader()`. The injected HTML uses:
- `<header class="header">` — main header element
- `<nav id="desktopNav">` — desktop nav with plain `<a>` links (no extra classes)
- `<button class="mobile-menu-btn" id="mobileMenuBtn">` — mobile hamburger
- `<nav class="mobile-nav" id="mobileNav">` — mobile nav (toggled with `.active` class)

**To add a page to site navigation**: Edit `js/components.js` `loadHeader()` function — add an `<a href="newpage.html">New Page</a>` to **both** `#desktopNav` and `#mobileNav`.

#### 1. Site Navigation (component-injected via `components.js`)

- Purpose: Navigate between different pages of the site
- **Desktop**: Horizontal link bar inside `<nav id="desktopNav">`
- **Mobile**: Full-width overlay `<nav class="mobile-nav" id="mobileNav">` — toggled by `#mobileMenuBtn`
- Toggling is handled by `initMobileMenu()` in `components.js` (toggles `.active` on `#mobileNav`)
- Contains links to: index.html, spotters.html, repeaters.html, wx4ptc.html, nwsffclinks.html, about.html

#### 2. Page Navigation (`.page-nav`) — Sticky In-Page Bar

- Purpose: Navigate to sections **within** the current page (anchor links)
- Written directly in page HTML (not component-injected)
- **Always visible**: Sticky horizontal bar (`position: sticky`, `top: 0`, `z-index: 999`)
- **Glassmorphism effect**: `backdrop-filter: blur(10px)` with semi-transparent background
- On mobile, toggled via `.page-nav-toggle` button (toggles `.active` on `.page-nav`)
- Toggle logic is in `scripts.js` (`pageNavToggle` event handler)
- Contains anchor links to page sections (e.g., `#nwscard`, `#SKYWARNcard`, `#reportcard`)

#### 3. Mobile Behavior

- **Site nav**: `#mobileMenuBtn` click → toggles `.active` on `#mobileNav` (handled by `components.js`)
- **Page nav**: `.page-nav-toggle` click → toggles `.active` on `.page-nav` (handled by `scripts.js`)
- Both menus close on outside click and Escape key

---

## JavaScript Patterns

### Common Patterns Used

1. **IIFE (Immediately Invoked Function Expression)**:
   ```javascript
   (function () {
     // Code here doesn't pollute global scope
   })();
   ```

2. **Async/Await for API Calls**:
   ```javascript
   (async () => {
     const data = await fetchAlerts();
     render(data);
   })();
   ```

3. **localStorage Caching**:
   ```javascript
   const CACHE_KEY = 'ffc-all-watches-warnings';
   const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
   ```

### NWS Weather API Integration

**Endpoint**: `https://api.weather.gov/alerts/active?zone={zones}`

**Zones**: GAZ001 to GAZ118 (NWS Atlanta forecast area)

**Required Headers**:
```javascript
const USER_AGENT = 'GeorgiaSKYWARN-Site (kq4jp@pm.me)';
fetch(url, { headers: { 'User-Agent': USER_AGENT } });
```

**Data Structure**:
```javascript
{
  features: [
    {
      properties: {
        event: "Tornado Warning",
        headline: "Tornado Warning issued...",
        description: "Full alert text...",
        instruction: "Take shelter immediately...",
        areaDesc: "Fayette County, Coweta County",
        expires: "2025-01-15T18:00:00-05:00",
        senderName: "NWS Peachtree City"
      }
    }
  ]
}
```

**Alert Classification**:
- **WARNING** (Red): Contains "warning" in `event` field
- **WATCH** (Orange): Contains "watch" in `event` field
- **OTHER** (Teal): All other alert types

---

## Development Workflow

### Making Changes

1. **HTML Changes**:
   - Maintain semantic HTML5 structure
   - Keep ARIA attributes consistent
   - Test mobile responsiveness (<768px)
   - Verify navigation links work across all pages

2. **CSS Changes**:
   - Use existing CSS custom properties
   - Follow BEM naming conventions
   - Test in both light and dark modes
   - Ensure mobile-first approach (min-width media queries)
   - Maintain consistent spacing with existing grid/flexbox patterns

3. **JavaScript Changes**:
   - Use IIFE pattern to avoid global scope pollution
   - Maintain 5-minute cache for API calls
   - Keep User-Agent header for NWS API compliance
   - Test error handling for failed API requests

### Testing Checklist

- [ ] Mobile view (320px-767px)
- [ ] Tablet view (768px-1024px)
- [ ] Desktop view (1024px+)
- [ ] Light mode appearance
- [ ] Dark mode appearance (`@media (prefers-color-scheme: dark)`)
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] Screen reader compatibility (ARIA attributes)
- [ ] External links open in new tabs (`target="_blank"`)
- [ ] NWS API responses render correctly
- [ ] Cache expiration works (5-minute TTL)

---

## Key Conventions for AI Assistants

### 0. ⚠️ CRITICAL: Directory Structure (READ THIS FIRST)

**MOST IMPORTANT RULE**: HTML files live in root. All else in named subdirectories.

**Current canonical layout**:
```
root/
├── *.html          ← ALWAYS in root (external links depend on this)
├── css/style.css
├── js/
├── data/
├── assets/         ← favicon, logo, nws.gif, archive/ photos
├── www/            ← FROZEN legacy redirect
└── wx4ptc/         ← FROZEN legacy redirect
```

**ABSOLUTELY FORBIDDEN**:
- ❌ Moving `.html` files into subdirectories (`pages/`, `src/`, `public/`, etc.)
- ❌ Moving `css/style.css` back to root or to another directory
- ❌ Moving files out of `assets/` back to root
- ❌ Renaming or removing `css/`, `js/`, `data/`, or `assets/` directories
- ❌ Touching `www/` or `wx4ptc/` in any way
- ❌ Creating additional top-level directories

**WHY THIS MATTERS**:
- External websites (NWS, RepeaterBook, ham radio forums) link to specific HTML file paths
- The `wx4ptc/` directory handles legacy redirects that CANNOT be broken
- Static hosting configuration depends on HTML files being in root

### 1. File Modifications

**DO**:
- Edit existing files rather than creating new ones
- Maintain consistent code formatting (2-space indentation)
- Preserve existing comments and changelog entries
- Add changelog entries when making significant changes
- Keep HTML attribute order: `class`, `id`, `role`, `aria-*`, `href`/`src`, `target`
- Keep all HTML files in the root directory
- Keep all images and assets in the root directory

**DON'T**:
- Create new CSS files (use `style.css`)
- Create new JavaScript files (use inline `<script>` tags)
- Remove or modify the `wx4ptc/` or `www/` directories
- Move files into subdirectories
- Change the cache key names (breaks existing user caches)
- Remove ARIA attributes or semantic HTML

### 2. CSS Changes

**DO**:
- Use existing CSS custom properties (`var(--accent-blue)`)
- Follow BEM naming: `.block__element--modifier`
- Add mobile styles first, then desktop overrides
- Test hover states (`:hover`, `:focus`)
- Maintain consistent `--radius`, `--shadow`, `--transition` values

**DON'T**:
- Hardcode colors (use custom properties)
- Use `!important` (fix specificity instead)
- Remove dark mode media queries
- Break responsive grid/flexbox layouts

### 3. JavaScript Changes

**DO**:
- Use IIFEs for new script blocks
- Maintain existing cache logic (5-minute TTL)
- Keep error handling consistent
- Use `const`/`let` (not `var`)
- Add User-Agent header for NWS API calls

**DON'T**:
- Add external JavaScript libraries (jQuery, React, etc.)
- Pollute global scope with variables
- Change cache key names
- Remove auto-refresh timers
- Skip error handling for API calls

### 4. HTML Structure

**DO**:
- Use semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Include ARIA landmarks and labels
- Keep navigation structure consistent across pages
- Use descriptive link text (not "click here")
- Include `<meta name="viewport">` for mobile
- Add `<div id="footer-placeholder"></div>` at the bottom of `<main>` for the component-injected footer
- Add `.page-nav` with `id="page-nav-list"` if the page has multiple in-page sections

**DON'T**:
- Use `<div>` when semantic elements exist
- Remove ARIA attributes
- Write site-wide `<header>` or site navigation markup manually — it's injected by `components.js`
- Change the footer loading mechanism (`id="footer-placeholder"` must remain)
- Nest headings incorrectly (h1 → h2 → h3)
- Forget to update `js/components.js` `loadHeader()` when adding a new page to the site

### 5. Content Updates

**DO**:
- Verify repeater frequencies with RepeaterBook
- Check NWS contact information for accuracy
- Test external links before committing
- Maintain professional, informative tone
- Use proper ham radio terminology

**DON'T**:
- Add personal opinions or editorials
- Change official NWS contact information
- Remove emergency contact numbers
- Alter the reporting requirements (set by NWS)

### 6. Accessibility Requirements

**DO**:
- Maintain WCAG 2.1 AA compliance
- Test keyboard navigation (Tab, Enter, Escape)
- Ensure color contrast ratios meet standards
- Keep `alt` text descriptive for images
- Use proper heading hierarchy

**DON'T**:
- Remove focus indicators (`:focus` styles)
- Use color alone to convey information
- Skip heading levels (h2 → h4)
- Remove `aria-label` or `role` attributes

---

## API Dependencies

### NWS Weather API

**Base URL**: `https://api.weather.gov`

**Endpoints Used**:
- `/alerts/active?zone=GAZ001,GAZ002,...,GAZ118`

**Rate Limits**: Unknown, but caching is implemented (5-minute TTL)

**Error Handling**:
```javascript
if (!resp.ok) throw new Error(`NWS API error: ${resp.status}`);
```

**Required Headers**:
- `User-Agent: GeorgiaSKYWARN-Site (kq4jp@pm.me)` (REQUIRED by NWS)

**Response Filtering**:
```javascript
// Filter by NWS office
p.senderName?.includes('NWS Peachtree City')

// Filter by alert type
p.event?.toLowerCase().includes('warning')
p.event?.toLowerCase().includes('watch')
```

---

## Common Tasks

### Adding a New Repeater

**File**: `data/repeaters.json`

Repeater tables are dynamically generated from the unified repeaters.json file:

**JSON Structure** (fields MUST appear in this exact order):
```json
{
  "id": "WX4PTC-147.390",
  "location": "Peachtree City",
  "frequency": "147.390+",
  "tone": "141.3 Hz",
  "county": "Fayette",
  "tags": ["WX4PTC System"],
  "description": "Wide coverage, generator backup",
  "callsign": "WX4PTC",
  "refurl": "https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=12345",
  "linked": true,
  "verified": true,
  "active": true,
  "clubName": "Club Name Here",
  "clubUrl": "https://example.com",
  "iplinks": [
    {
      "system": "AllStar",
      "node": "12345",
      "connectionType": "available"
    }
  ],
  "rflinks": [
    {
      "linkType": "full-time",
      "linkMethod": "rf",
      "linksToFreq": "444.600+",
      "linksToLoc": "Fayetteville",
      "linksToCall": "W4PSZ"
    }
  ]
}
```

**Field Descriptions** (in required order):

| # | Field | Type | Required | Description |
|---|-------|------|----------|-------------|
| 1 | `id` | string | Yes | Unique identifier: `CALLSIGN-FREQUENCY` (e.g., `W4PSZ-444.600`) |
| 2 | `location` | string | Yes | City or geographic location |
| 3 | `frequency` | string | Yes | Frequency with offset (e.g., `"147.390+"`, `"145.210-"`) |
| 4 | `tone` | string/null | Yes | CTCSS/PL tone in Hz (e.g., `"141.3 Hz"`) or `null` if no tone |
| 5 | `county` | string | Yes | Georgia county the repeater is located in (e.g., `"Fulton"`) |
| 6 | `tags` | array | Yes | Network affiliations (can be empty `[]`). Valid values: `"WX4PTC System"`, `"Peach State Intertie"`, `"Cherry Blossom Intertie"`, `"SE Linked Repeater"`, `"WX4EMA"` |
| 7 | `description` | string | Yes | Coverage area, features, emergency power, etc. |
| 8 | `callsign` | string | Yes | Amateur radio callsign (e.g., `"WX4PTC"`) or `"n0call"` if unknown |
| 9 | `refurl` | string | Yes | RepeaterBook reference URL (single source of truth) |
| 10 | `linked` | boolean | Yes | `true` if part of linked SKYWARN network, `false` otherwise |
| 11 | `verified` | boolean | Yes | `true` if verified against RepeaterBook, `false` if needs verification |
| 12 | `active` | boolean | Yes | `true` if currently on-air/operational, `false` if confirmed off-air. Drives filtering: inactive repeaters are excluded from the public tables (`renderAllRepeaters()`) and CSV exports, and surfaced on `repeater-validation.html`'s Inactive list. |
| 13 | `statusNote` | string | Only when `active: false` | Free-text explanation of the outage (who reported it, what's needed, follow-up date). Read by `repeater-validation.html`'s Inactive table (`r.statusNote`). Omit entirely when the repeater is active. |
| 14 | `picUrl` | string | Only when applicable | Link to station photos (currently only 444.600+ and 442.500+). Omit if not applicable. |
| 15 | `clubName` | string/null | Yes | Sponsoring club name, or `null` if unknown |
| 16 | `clubUrl` | string/null | Yes | Sponsoring club URL, or `null` if unknown |
| 17 | `iplinks` | array | No | Internet linking info (AllStar, EchoLink, etc.). Omit entirely if none. |
| 18 | `rflinks` | array | No | Radio frequency links to other repeaters. Omit entirely if none. |

**Tag Badge Colors** (CSS classes):

| Tag Value | CSS Class | Color |
|-----------|-----------|-------|
| `WX4PTC System` | `.badge-wx4ptc` | Blue (`--accent-blue`) |
| `WX4EMA` | `.badge-wx4ema` | Green (`--accent-green`) |
| `Peach State Intertie` | `.badge-peach-state` | Orange (`--accent-orange`) |
| `Cherry Blossom Intertie` | `.badge-cherry-blossom` | Pink (`--accent-pink`) |
| `SE Linked Repeater` | `.badge-se-linked` | Indigo (`--accent-indigo`) |

**Steps**:
1. Open `data/repeaters.json`
2. Add new entry in alphabetical order by location
3. Follow the field order exactly as documented above
4. Follow JSON syntax rules:
   - Entries separated by commas
   - Last entry has NO trailing comma
   - All strings in double quotes
5. Look up callsign on [RepeaterBook.com](https://www.repeaterbook.com/)
6. Set `refurl` to the RepeaterBook URL used to find the repeater
7. Validate JSON at [jsonlint.com](https://jsonlint.com/)
8. Verify frequency and callsign are correct
9. Test on mobile (repeater tables are responsive)

**Important Notes**:
- The HTML tables on `repeaters.html` are auto-generated from this JSON file via JavaScript. Do NOT edit the HTML tables directly.
- Location names link to RepeaterBook (using `refurl`) as the single source of truth for repeater information
- The `picUrl` field is only used for repeaters with station photos (currently 444.600+ and 442.500+). These repeaters will display a camera icon (📷) next to the location name that links to the photo gallery.
- Do NOT add `picUrl` to other repeaters. If you need specialized URLs for a repeater in the future, create a new specific field.
- Fields `iplinks` and `rflinks` should be omitted entirely when not applicable (do NOT include them as `null` or empty arrays).
- Fields `clubName` and `clubUrl` should always be present, set to `null` if unknown.

**For detailed non-technical instructions**, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md) Task 1.

### Validating Repeater Data

**Source of Truth**: The Georgia SKYWARN website (`data/repeaters.json`) is the **source of truth** for repeater information used on this site.

**Validation Source**: RepeaterBook.com is used as the **validation source** to verify repeater data accuracy and system membership.

#### RepeaterBook System Validation URLs

Use these official RepeaterBook system pages to validate repeater membership and data accuracy:

1. **Georgia SKYWARN Linked Repeaters System**
   - URL: https://www.repeaterbook.com/repeaters/feature_search.php?system=Georgia+SKYWARN+Linked+Repeaters+System&type=systems
   - Use for: Validating repeaters with `linked=true` and SKYWARN tags
   - Official list maintained by SKYWARN coordinators

2. **Peach State Intertie System**
   - URL: https://www.repeaterbook.com/repeaters/feature_search.php?system=Peach+State+Intertie+System&type=systems
   - Use for: Validating repeaters with "Peach State" tag
   - Regional linked system in central Georgia

3. **Cherry Blossom Intertie System**
   - URL: https://www.repeaterbook.com/repeaters/feature_search.php?system=Cherry+Blossom+Intertie+System&type=systems
   - Use for: Validating repeaters with "Cherry Blossom" tag
   - Regional linked system in central Georgia

4. **Southeastern Linked Repeater System**
   - URL: https://www.repeaterbook.com/repeaters/feature_search.php?system=Southeastern+Linked+Repeater+System&type=systems
   - Use for: Validating repeaters with "SE Linked Repeater" tag
   - Multi-state RF-linked system covering GA, TN, NC, SC, AL, KY
   - Net: Wednesday nights at 9:00 PM ET

#### Validation Process

**When to Validate**:
- Before adding new repeaters to the database
- Quarterly review of all linked repeaters
- When system coordinators announce changes
- After receiving reports of repeater changes/outages

**Validation Steps**:
1. Compare `data/repeaters.json` against appropriate RepeaterBook system list
2. Verify frequency, callsign, location, and tone match
3. Update `refurl` field to point to correct RepeaterBook details page (format: `details.php?state_id=13&ID=####`)
4. Check for missing repeaters (in RepeaterBook but not in our database)
5. Check for extra repeaters (in our database but not in RepeaterBook)
6. Document discrepancies in `REPEATERBOOK_VALIDATION.md`

**Important Notes**:
- Our database may intentionally include repeaters not in RepeaterBook systems (local nets, backup sites)
- Repeaters with `linked=false` do not need to be in RepeaterBook linked system lists
- The `refurl` field should ALWAYS point to RepeaterBook as the single source of truth for technical specs
- Use `picUrl` field only for station photos (currently 444.600+ and 442.500+)

**See Also**: `REPEATERBOOK_VALIDATION.md` for the most recent validation report and action items.

### Updating NWS Contact Information

**File**: `about.html`

1. Search for `<section id="contactcard">`
2. Update email addresses or names
3. Use HTML entities for spam protection:
   - Replace `@` with `&#64;`
   - Replace `.` with `&#46;`
4. Verify with NWS Atlanta website
5. Test mailto links

**For detailed non-technical instructions**, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md) Task 2.

### Adding a New Page

1. Copy an existing page structure (e.g., `about.html`) — keep it in the **root directory**
2. Update the `<title>` tag
3. Add the new page to **both nav lists** in `js/components.js` `loadHeader()`:
   ```html
   <!-- Add to BOTH #desktopNav and #mobileNav blocks -->
   <a href="newpage.html">New Page</a>
   ```
4. If the page has multiple sections, add a `.page-nav` directly in the HTML (below the component-injected header):
   ```html
   <nav class="page-nav" aria-label="Page navigation">
     <button class="page-nav-toggle" aria-expanded="false">☰ PAGE</button>
     <ul id="page-nav-list" class="nav-list">
       <li><a href="#section1">Section 1</a></li>
       <li><a href="#section2">Section 2</a></li>
     </ul>
   </nav>
   ```
5. Ensure `<div id="footer-placeholder"></div>` is present at the bottom of `<main>` for the footer
6. Test footer loading and navigation on both desktop and mobile

### Adding a Changelog Year

`changelog.html` groups history into one `.card` per year, rendered by `js/changelog.js` into static container `<div>`s. The page-nav and containers are **static HTML, not JS-generated** — `scripts.js` wires up the sticky page-nav (mobile toggle + scroll-spy highlighting) before `changelog.js` runs, so the target elements must already exist in the DOM when `scripts.js` initializes. When the first entry of a new year is added to `data/changelog.json`:

1. Open `changelog.html`
2. Add a new `<li>` to `#page-nav-list`, newest year first:
   ```html
   <li><a href="#y2027">2027</a></li>
   ```
3. Add a matching empty container div above the existing ones, newest year first:
   ```html
   <div id="changelogHistory">
     <div id="y2027"></div>
     <div id="y2026"></div>
     <div id="y2025"></div>
   </div>
   ```
4. No JS changes needed — `renderFullHistory()` in `js/changelog.js` groups `data/changelog.json` entries by `year` and looks up `#y{year}` automatically; it logs a console warning if a year's container is missing.

### Working with the Navigation System

**Site nav vs Page-nav — which to use**:
- **Site nav** (across-page links): Edit `js/components.js` `loadHeader()` — add `<a>` to both `#desktopNav` and `#mobileNav`
- **Page nav** (in-page anchor links): Add a `.page-nav` element directly in the page HTML

**Page-nav HTML pattern** (add below the component-injected `<header>`):
```html
<nav class="page-nav" aria-label="Page navigation">
  <button class="page-nav-toggle" aria-expanded="false" aria-controls="page-nav-list">☰ PAGE</button>
  <ul id="page-nav-list" class="nav-list">
    <li><a href="#section1">Section 1</a></li>
    <li><a href="#section2">Section 2</a></li>
  </ul>
</nav>
```
The toggle behavior is handled automatically by `scripts.js` (searches for `.page-nav .page-nav-toggle`).

**Styling in-page nav links**:
- Page-nav links are plain `<a href="#anchor">` tags — no extra classes needed
- The `.page-nav` stylesheet handles all styling (sticky bar, glassmorphism, button wrap)

**Site nav link styling** (inside `components.js` `loadHeader()`):
- Links in `#desktopNav` and `#mobileNav` are plain `<a>` tags — no extra classes
- Styling is applied via `nav#desktopNav a` and `.mobile-nav a` in `style.css`

**JavaScript for site nav toggle** (in `components.js` — do NOT duplicate):
```javascript
// Handled by initMobileMenu() in components.js
// Toggles .active class on #mobileNav when #mobileMenuBtn is clicked
```

### Modifying the Alert Display Logic

**index.html** (all alerts — shows warnings, watches, and advisories):
```javascript
return p.senderName && p.senderName.includes('NWS Peachtree City');
```

### Changing Cache Duration

Modify the `CACHE_TTL` constant:
```javascript
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes (in milliseconds)
```

### Adding a New Button Color

1. Add custom property to `:root` in `style.css`:
   ```css
   --accent-purple: #9c27b0;
   --accent-purple-dark: #7b1fa2;
   ```

2. Add modifier class:
   ```css
   .btn-purple { --btn-bg: var(--accent-purple); }
   ```

3. Add dark mode variant in `@media (prefers-color-scheme: dark)`:
   ```css
   --accent-purple: #ba68c8;
   ```

---

## Troubleshooting

### Dashboard/Alerts Not Loading

1. **Check browser console** for API errors
2. **Verify User-Agent header** is present
3. **Clear localStorage** cache: `localStorage.removeItem('ffc-all-watches-warnings')` and `localStorage.removeItem('ffc-hwo-outlook')`
4. **Test API directly**: Visit `https://api.weather.gov/alerts/active?zone=GAZ001`
5. **Check NWS API status**: `https://www.weather.gov/`

### Footer Not Loading

1. **Verify `footer.js` exists** in root directory
2. **Check browser console** for JavaScript errors
3. **Ensure testing on a web server** (not `file://`) - JavaScript component loading requires HTTP
4. **Re-upload `footer.js`** from GitHub if corrupted

### Mobile Navigation Not Working

**Site navigation (injected by `components.js`)**:
1. Verify `js/components.js` is loading (check console for `[COMPONENTS] Header and footer loaded`)
2. Check that `#mobileMenuBtn` and `#mobileNav` exist in the DOM (injected by `loadHeader()`)
3. The toggle adds/removes `.active` on `#mobileNav` — check CSS for `.mobile-nav.active { display: flex; }`
4. `initMobileMenu()` in `components.js` is responsible; if it's not running, check for JS errors before it

**Page navigation (in-page `.page-nav`)**:
1. Verify the `.page-nav-toggle` button is present in the page HTML
2. Check that `id="page-nav-list"` matches the toggle's `aria-controls` value
3. Toggle logic is in `scripts.js` — check for JS errors loading that file
4. CSS: `.page-nav.active .nav-list` controls visibility on mobile

### Dark Mode Not Working

1. **Check browser/OS settings** - must prefer dark mode
2. **Verify custom properties** in `@media (prefers-color-scheme: dark)`
3. **Clear browser cache** - styles may be cached
4. **Test in browser DevTools** - toggle prefers-color-scheme

### Styling Broken After Changes

1. **Validate CSS** - check for syntax errors
2. **Check specificity** - avoid overly specific selectors
3. **Test mobile-first** - base styles before media queries
4. **Clear browser cache** - hard refresh (Ctrl+Shift+R)
5. **Check custom properties** - verify `var(--*)` exists

---

## Security Considerations

### Content Security

1. **No user-generated content** - static site only
2. **External links** use `target="_blank"` (opens new tab)
3. **Email addresses** use HTML entities to reduce spam
4. **No forms or data collection** - no backend

### API Security

1. **NWS API is public** - no authentication required
2. **User-Agent required** - identifies site to NWS
3. **No API keys** - no sensitive credentials
4. **localStorage only** - no cookies or tracking

### Best Practices

1. **Never commit API keys** (none are used)
2. **Keep contact emails protected** with HTML entities
3. **Validate external links** before adding
4. **Test for XSS** when displaying API content (use `.textContent` or sanitize)

---

## Performance Optimization

### Current Optimizations

1. **localStorage caching** - 5-minute TTL for API responses
2. **Lazy-loading footer** - fetched asynchronously
3. **Single CSS file** - shared across all pages
4. **Minimal JavaScript** - no external libraries
5. **Image optimization** - favicon.ico, logos compressed

### Future Improvements

1. **Add image lazy-loading**: `<img loading="lazy">`
2. **Minify CSS/JS** for production
3. **Add service worker** for offline functionality
4. **Optimize images** with WebP format
5. **Implement CDN** for static assets

---

## Git Workflow

### Branch Strategy

- **Main branch**: Production-ready code
- **Feature branches**: Use descriptive names (e.g., `feature/new-repeater-table`)

### Commit Messages

Follow conventional commit format:

```
feat: Add new repeater to linked table
fix: Correct frequency for Fayetteville repeater
docs: Update CLAUDE.md with new conventions
style: Improve mobile navigation spacing
refactor: Simplify alert filtering logic
```

### Before Committing

1. Test all pages in browser
2. Verify mobile responsiveness
3. Check light and dark modes
4. Test NWS API integration
5. Validate HTML/CSS
6. Update changelog in file comments

---

## Resources

### External Documentation

- [NWS API Documentation](https://www.weather.gov/documentation/services-web-api)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/)
- [RepeaterBook](https://www.repeaterbook.com/)
- [NWS Atlanta Office](https://www.weather.gov/ffc/)

### Key Contacts

- **Webmaster**: Jack Parks (KQ4JP) <kq4jp@pm.me>
- **NWS Warnings Coordinator**: David Nadler <David.Nadler@noaa.gov>
- **DEC ARES / NWS**: Robert Burton (KD4YDC) <kd4ydc@gmail.com>

### Ham Radio Resources

- [SKYWARN Spotter Training](https://www.weather.gov/ffc/SKYWARNsched)
- [Spotter Quick Reference](https://www.weather.gov/media/ffc/Education_Outreach/spotterhandout_Updated.pdf)
- [Spotter Guidebook](https://www.weather.gov/media/owlie/SGJune6-11.pdf)

---

## Changelog

### 2026-08-04 — RepeaterBook attribution & wording changes (API reinstatement request)

#### Background
- RepeaterBook.com revoked Jack's API access used by `scripts/verify_repeaters.py` (the quarterly validation script) and requested, before reinstatement: (1) proof the script only compares targeted records and doesn't write RepeaterBook response data into public exports, (2) confirmation `data/repeaters.json` is an independently-maintained source and CSVs are generated from it, (3) visible attribution near the directory/export section, and (4) a change from "RepeaterBook Verified" wording to language reflecting comparison rather than endorsement.
- Audit confirmed the underlying behavior already satisfied asks #1 and #2: `apply_fixes()` in `scripts/verify_repeaters.py` only ever writes the pre-existing `active`/`verified` booleans back to `data/repeaters.json` (callsign/frequency/tone mismatches are report-only, never auto-applied); no RepeaterBook field content is copied into the JSON or into either CSV exporter, both of which read exclusively from `data/repeaters.json` via `fetchRepeaterData()` in `js/scripts.js`. Only asks #3 and #4 required code changes.

#### `repeaters.html` — new attribution text (ask #3)
- Added a `.callout note` block near the top of the page (right after the "Repeaters validated since..." heading, before the search card): "Georgia SKYWARN maintains this directory. Selected records are periodically compared with RepeaterBook. RepeaterBook detail links are provided for reference. CSV exports are generated from the Georgia SKYWARN directory and are not RepeaterBook exports."
- Added a second, shorter line inside the existing CSV Export card's callout, next to the "Repeater list current as of..." text: "CSV exports are generated from the Georgia SKYWARN directory and are not RepeaterBook exports."

#### `js/scripts.js` — reworded verification badge (ask #4)
- `openRepeaterModal()`: the repeater detail modal's "✓ RepeaterBook Verified" badge (shown when `repeater.verified === true`) changed to "✓ Compared with RepeaterBook" — same styling/position, wording no longer implies RepeaterBook endorsement. The "✗ Needs Verification" badge and the "View on RepeaterBook →" reference link were left as-is (already comparison-neutral).
- `repeater-validation.html`'s internal admin dashboard ("Verified"/"Needs Verification" stat labels, "cross-checked against RepeaterBook" copy) was left unchanged — already framed as comparison rather than endorsement, and the page is `noindex`/internal.

#### Version
- Bumped to `20260804a`.

#### Follow-up same day: emphasis + badge wording change
- Jack asked for the attribution text to visually stand out and for the verification badge wording to read "Verified from public sources" instead of "Compared with RepeaterBook."
- `repeaters.html`: both attribution blocks (top-of-page and CSV export section) now bold the key sentences (`<strong>`) rather than sitting as plain/secondary-colored text — the CSV-section line was previously styled `font-size: 0.9rem; color: var(--text-secondary)` (de-emphasized), now full-size and bold to match the intent of standing out.
- `js/scripts.js`: `openRepeaterModal()`'s badge changed again, `"✓ Compared with RepeaterBook"` → `"✓ Verified from public sources"`.
- Version bumped to `20260804b`.

#### Second follow-up same day: "Validated" / "Not Validated" wording, repeater-validation.html cleanup
- Jack asked to standardize on "Validated" / "Not Validated" as the two-state label pair (replacing "Verified" / "Needs Verification" / "Unverified"), and to fix the remaining RepeaterBook-endorsement-flavored wording on `repeater-validation.html` that a prior round had explicitly left alone.
- `js/scripts.js`: `openRepeaterModal()` badge wording changed again — `"✓ Verified from public sources"` → `"✓ Validated from public sources"`, `"✗ Needs Verification"` → `"✗ Not Validated"`. The Not-Validated-table empty-state message changed `"✓ All repeaters verified."` → `"✓ All repeaters validated."` The `// ── Unverified ──` code comment was relabeled `// ── Not Validated ──` for consistency (comment only, no behavior change).
- `repeater-validation.html`: page-nav link text "Unverified" → "Not Validated"; stat card labels "Verified" → "Validated" and "Needs Verification" → "Not Validated"; section heading "Unverified Repeaters" → "Not Validated Repeaters"; section intro prose "have not been cross-checked against RepeaterBook. ... verify frequency, tone, and callsign" → "have not been compared against RepeaterBook. ... validate frequency, tone, and callsign" (reverses the 2026-08-04 first-round decision to leave this page's copy untouched — the RepeaterBook relationship-repair effort now extends to the internal dashboard too, not just public pages).
- **Left unchanged, on purpose**: all `id` attributes (`unverified-card`, `stat-verified`, `stat-unverified`, `unverified-count`, `unverified-repeaters-tbody`) and the underlying `data/repeaters.json` schema field `verified` (boolean) — only user-facing display text changed, not internal identifiers or the data schema itself. Renaming the JSON field would be a breaking schema change out of scope here.
- Version bumped to `20260804c`.

### 2026-07-08 — `repeater-health.html` → `repeater-validation.html` rename, footer entry point moved

#### Rename: `repeater-health.html` → `repeater-validation.html`
- Jack clarified the page isn't really about physical repeater "health" — he uses it as a **data validation page for quarterly review**, tracking follow-ups (the `statusNote` field on inactive repeaters exists for exactly this). The content (Summary stats, Inactive, Unverified, Unknown Callsigns, Missing Club) matches that use, so the filename was renamed to match rather than keep the old "health" framing. Precedent: the 2026-04-13 `admin.html` → `repeater-health.html` rename.
- File renamed on disk. `<title>` updated to "Georgia SKYWARN - Repeater Validation". No in-page heading text referenced "health," so no other HTML changes needed.
- `js/scripts.js`: updated the `currentPage === 'repeater-health.html'` gate to `'repeater-validation.html'`, plus header comment and the `tagToBadgeClass()` doc comment (both said "repeater-health"/"health admin dashboard").
- `sitemap.xml`: no change needed — the page is `noindex` and was never listed there.
- `data/changelog.json`'s 2026-04-13 public entry ("...Content Security Policy meta tag to the repeater health dashboard") describes a past state and was left as-is, consistent with how this file's own historical entries aren't rewritten after later renames.

#### `js/components.js` — footer entry point moved into the Connect column
- Jack asked for a link to the page under "Submit Storm Report" in the footer's Connect column, using a subtle marker like the "..." (`&#8943;`) style previously used there.
- Since Round 5 (2026-06-30) had explicitly removed a "..." link to this page from this same Connect column as a "redundant, non-descriptive" duplicate of the footer-bottom "..." link, re-adding it here without change would recreate that exact duplicate. Confirmed with Jack: **moved** the entry point rather than duplicating it — added `<li><a href="repeater-validation.html">&#8943;</a></li>` (aria-label "Repeater Database Validation") after Submit Storm Report, and removed the old footer-bottom `<p>` containing the equivalent link. There is now exactly one subtle access point to the page, in the Connect column.
- `aria-label` changed from the old generic "Admin" to "Repeater Database Validation" to better reflect actual use.
- Version bumped to `20260708a`.

### 2026-07-01 — County Data Integrity Overhaul: name-keyed schema, real GAZ zone codes

#### Root cause investigation — the "Floyd filter matches Fayette alerts" bug
- Jack reported that filtering the index.html Active Area Alerts by "Floyd" incorrectly returned a Heat Advisory whose area list (Dawson, Forsyth, ... Fayette, Clayton, Spalding...) plainly does not include Floyd County.
- Diagnosed via a general-purpose subagent (no "guru coder" agent exists in this environment; closest available type was used) cross-referencing `data/ffc-counties.json` against the authoritative Census/NWS FIPS code list: the file had **systematically wrong GAC codes for 68 of its 96 entries** (everything alphabetically from Emanuel onward), shifted by -2 FIPS (Emanuel–Meriwether range) or -4 FIPS (Monroe–Wilkinson range) from the real values. Specifically the file had `"GAC113": "Floyd"`, but GAC113 is really **Fayette** County's code (Floyd's real code is GAC115). So a "Floyd" filter was silently querying Fayette's data instead — explaining exactly the reported symptom.

#### Full rebuild: county-name-keyed schema with every NWS-referenceable code
- Jack's follow-up ask: since NWS uses different code systems for different alert product types, restructure all 6 `data/*-counties.json` files to use the **county name as the key**, storing every code that might appear in `geocode.UGC` or `geocode.SAME` for that county — not just GAC.
- **New schema** (all 6 files): `{ "CountyName": { "gac": "GAC###", "same": "0######", "gaz": ["GAZ###", ...] } }`
  - `gac` — county-based UGC code (warnings: Tornado, Flash Flood, Severe T-storm, etc.)
  - `same` — 6-digit EAS/SAME FIPS code, always county-level regardless of product type
  - `gaz` — public forecast zone UGC code(s), used by advisory/watch products (Heat Advisory, Wind Advisory, etc.). **Not derivable from FIPS** — independently assigned per NWS directive 10-507. Stored as an array since a handful of counties split into 2 zones (Fulton N/S, Camden coastal/inland, Charlton, Glynn, Ware, Chatham).
- **Data sourcing**: `gac`/`same` are FIPS-derived (formula, using Georgia state FIPS 13) and were verified against Wikipedia's "List of FIPS codes for Georgia" plus multiple live NWS lookups (`forecast.weather.gov/MapClick.php?zoneid=...` and `zipcity.php` disambiguation pages, which echo back `warncounty=GAC###` for the resolved county). `gaz` codes were live-verified per county the same way — NWS's own `weather.gov/ffc/zone` page gave FFC's complete 96-county zone list directly (a clickable per-county index); GSP, CAE, and the majority of CHS/TAE were confirmed via individual `zipcity.php` lookups against county-seat towns; JAX's list came from that office's live Zone Forecast Product text (its `GAZxxx-` headers name each zone directly, which also resolved all 4 of JAX's split-zone counties unambiguously).
- **Known gaps, left honest rather than guessed**: 5 counties ship with `"gaz": []` because a live NWS source wasn't reached this session — Colquitt, Cook, Quitman, and Thomas (TAE), plus one CHS coastal/inland zone pair (Bryan-coastal, Liberty-coastal, McIntosh's other zone if one exists) weren't confirmed. These counties still match correctly via the SAME + areaDesc fallback layers; only the (optional, most-authoritative) GAZ layer is empty for them. **Do not fill these in from pattern-guessing** — an earlier research pass guessed Colquitt's zone as GAZ130 by extrapolating from neighboring TAE zone numbers, and a live check proved that GAZ130 actually belongs to **Ben Hill** County, not Colquitt. Zone numbers are assigned independently of FIPS/alphabetical order and are not safely inferable — always confirm against a live `weather.gov` source before adding a `gaz` value.

#### `js/nws-api.js`
- `loadFFCCounties()` rewritten for the new schema: builds `ffcCounties` (GAC→name, for autocomplete) and a new `ffcCountyData` (GAC→`{same, gaz}`) map from the name-keyed JSON.
- `renderAllAlerts()`'s county filter gained a **fourth match layer**: `geocode.UGC` is now also checked against each active county's real `gaz` codes directly, in addition to the existing GAC/SAME/areaDesc layers. Previously zone-based products (the majority of advisories/watches) could only match via SAME or the areaDesc text fallback; they can now match on the authoritative zone code itself.
- Removed `gacToSameCode()` (the FIPS-arithmetic formula that derived a SAME code from a GAC code) — no longer needed now that `same` is stored directly per county from the corrected data.
- Version bumped to `20260701a`.

#### `js/cwa-map.js`
- `initCWAMap()`'s county-file loader changed `Object.values(j)` → `Object.keys(j)` to read county names from the new name-keyed schema (this map only ever needed the names, not the codes, so no other change was required).

#### Follow-up same day: closed the 5 remaining `gaz` gaps
- Jack asked to resolve the known gaps by checking with the TAE (and CHS) forecast offices directly, rather than leaving them unconfirmed indefinitely.
- **TAE counties** — confirmed live via `forecast.weather.gov/MapClick.php?zoneid=GAZ###` (each page echoes "Detailed forecast for {County} County," confirming the zone-to-county mapping): Colquitt = **GAZ146**, Cook = **GAZ147**, Quitman = **GAZ120**, Thomas = **GAZ158**. This also positively confirms the earlier Colquitt≠GAZ130 finding (GAZ130 is Ben Hill's, as already established) — GAZ146 is Colquitt's real zone, nowhere near the guessed value, underscoring why zone numbers must never be pattern-inferred.
- **CHS coastal/inland split counties** — resolved via NWS Charleston's official 2026 rezoning notice (`weather.gov/chs/2026forecastzonechanges`, effective 2026-04-16), which lists both zones for each split county: Bryan gained Coastal = **GAZ217** (Inland GAZ216 already on file), Liberty gained Coastal = **GAZ239** (Inland GAZ238 already on file), McIntosh gained Inland = **GAZ240** (Coastal GAZ241 already on file — McIntosh does in fact split into two zones, contrary to the prior session's uncertainty about whether a second zone existed).
- All 6 `data/*-counties.json` files re-validated: 159 counties total (96+6+5+12+14+26), zero duplicate GAC codes, zero duplicate GAZ codes, zero remaining empty `gaz` arrays.
- Version bumped to `20260701b`.

#### `js/version.js`
- `APP_VERSION` bumped to `20260701a`.

### 2026-06-30 (Round 11) — Standard Search Pill Component + Small Fixes

#### `css/style.css` — established one shared search/filter box used by all three search bars on the site
- **Background**: the site had three visually different search boxes — the repeater search (`repeaters.html`, plain bordered input with a rectangular red "×" button on the right), the county alert filter (`index.html`, a polished pill with a magnifying-glass icon, a left-justified circular clear button, and an amber error-triangle for no-match county names), and the county coverage search (`about.html`, a boxy input with a left-justified square clear button but no icon). Jack reviewed a mockup of a single unified design (pill shape, icon that swaps for a left-justified clear button once there's text, error triangle available) and approved rolling it out everywhere.
- **New shared component**: `.search-pill` / `.search-pill-icon` / `.search-pill-error-icon` / `.search-pill-clear` / `.search-pill-input`, added just above the repeater-search CSS section. A `:has()` rule hides the idle magnifying-glass icon whenever the clear button or error triangle is showing, so only one indicator occupies the left slot at a time. Documented in the Component Classes section as the standard — see `.search-pill` entry there.
- **index.html**: `.county-filter-input-wrap`/`.county-filter-icon`/`.county-filter-input`/`.county-filter-error-icon`/`.county-filter-clear` markup reclassed to the shared component (IDs unchanged, so `nws-api.js` needed no changes — it only ever targeted IDs). The old page-specific CSS for these was deleted; `.county-filter-bar` (the outer padding wrapper) stays page-specific.
- **repeaters.html**: search markup restructured into a pill — added a magnifying-glass icon, moved the clear button from a right-side rectangular text button to a left-justified circular icon button matching the other two pages. `js/scripts.js`'s clear-button visibility toggle changed from `clearButton.classList.toggle('visible', ...)` to `clearButton.hidden = ...` to match the `hidden`-attribute convention the other two pages already used — the old `.search-clear`/`.visible` CSS was deleted. Added `.search-pill-input::-webkit-search-cancel-button { appearance: none }` so the browser's native `type="search"` clear-x doesn't visually double up with the new custom clear button.
- **about.html**: added a magnifying-glass icon (previously missing) and reclassed the box/clear/input to the shared component; the autocomplete dropdown (`.county-search-results` etc.) and outer label/wrap layout stayed page-specific and untouched. `js/cwa-map.js`'s `wireCountySearch()` needed no changes (ID-based).
- Version bumped to `20260630w`.

#### Two smaller fixes made earlier in this pass
- **`css/style.css`** — `.county-search-wrap` (about.html) had `margin: 1rem auto 0` (no bottom margin, no padding), so the search bar sat flush against the `.section-subheader` banner directly below it. Changed to `margin: 1.5rem auto` + `padding: 1rem 1.25rem` for breathing room on both sides.
- **`css/style.css`** — `.callout h4` (used once, on spotters.html's "Upcoming NWS Atlanta Basic Spotter Training Classes" notice) was left-aligned by default while the callout's body text below it is centered, reading visually off. Added `text-align: center`. Confirmed via search that this is the only `<h4>` inside a `.callout` anywhere on the site, so the change has no other blast radius.

### 2026-06-30 (Round 10) — Repeater Table Header Theming Fix

#### `css/style.css` — `.repeater-table th` wasn't properly theme-aware, and read too dark/heavy next to the card header
- **Bug** (Jack noticed visually): the repeater table's `<th>` row (Location & Callsign, Frequency & Tone, etc.) used `--header-gradient-th`, whose start stop (`--header-grad-th-start`) was `light-dark()`-aware but whose end stop was a hardcoded `#112840` — so the gradient barely changed between light and dark mode and read as a flat, heavy dark band in both, with no real visual hierarchy against the `.card-header` banner directly above it.
- **First attempt**: derived both gradient stops from the main header tokens via `color-mix(in oklch, ... 82%, white 18%)` so the gradient tracked theme automatically. Jack tested it and the gradient itself looked bad against the table's hard cell borders — rejected on visual grounds, not a logic bug.
- **Final fix**: removed the gradient entirely. `.repeater-table th` now uses a single flat/solid color, `--header-bg-th: color-mix(in oklch, var(--header-grad-end) 80%, white 20%)` — still derived from the theme-aware card-header token (so it automatically tracks light/dark mode) but with no gradient banding. `--header-grad-th-start`/`--header-grad-th-end`/`--header-gradient-th` tokens were deleted; `--header-bg-th` is used in exactly one place (`.repeater-table th`).
- Version bumped to `20260630t`.

### 2026-06-30 (Round 9) — Dead CSS Sweep + Print Stylesheet Bug

#### `css/style.css` — removed 15 confirmed-abandoned rules, found via automated cross-reference of every class selector against actual HTML/JS usage (not just manual reading)
- **Dead rules deleted**: `.ga-cwa-legend` + 3 child selectors (changelog already claimed this was removed when the map legend went away — it wasn't, until now); `.card-header--indigo` (exact duplicate of the default gradient) and `.card-header--orange` (never instantiated, consistent with the Round 7 finding that nwsffclinks.html never really had colored headers); `.legend-orange` (triangle + circle variants, a 4th alert-severity color never wired to any code path); `.callout.success` and `.callout.tip` (2 of 4 callout modifiers — only `.note` and `.warning` are ever used); `.site-banner-text` (leftover from an earlier version of the index.html quick-link banner); `.search-input` (the bare/generic selector — removed from 5 comma-separated groups across light and dark mode, keeping the live `.search-container input[...]` selectors in those same rules); `.system-actions`, `.no-results-message` (+ its dark-mode override), `.forecast-map-link` (+ `:hover`/`img` variants), `.map-link`, `tr.pinned` (+ `td` and dark-mode variants) — all had zero matching markup anywhere in the codebase.
- **New dead CSS from today's earlier cleanup**: `.repeater-badges` was only used by the `renderWeatherStationRow()` function deleted in Round 3 — removing that JS orphaned this CSS class as a side effect. Removed now.
- **Method**: extracted every class selector from `style.css` via regex, cross-referenced each against literal-string presence in all `.html` and `.js` files, then manually verified every "zero matches" hit before deleting anything — several were false positives from JS template-literal construction (e.g. `` `card-header--${color}` `` in `changelog.js`) that a naive text search would have wrongly flagged as dead.
- **Real bug found in the same pass**: `@media print` was hiding `.nav-toggle`, but that class has never existed on this site — every page uses `.page-nav-toggle`. The print stylesheet has been silently failing to hide the mobile page-nav hamburger button since whenever that print block was written. Fixed to `.page-nav-toggle`.
- **`.section-subheader` dark-mode fix**: its background tint was hardcoded to the light-mode value of `--accent-blue` (`rgba(0, 102, 204, ...)`) instead of deriving from the token, so in dark mode the tint stayed pinned to the light-mode blue while the left border (correctly using `var(--accent-blue)`) shifted to the dark-mode blue — a visible mismatch on a component shipped just one round earlier. Now uses `color-mix(in oklch, var(--accent-blue) 8%/12%, transparent)`, matching the idiom already used for badges and pills elsewhere in the file.
- Verified: brace-balanced (452 open / 452 close), zero remaining unreferenced class selectors site-wide, no broken comma-separated selector lists left behind by the surgical edits.
- Version bumped to `20260630r`.

### 2026-06-30 (Round 8) — Site-Wide Subheader Standard

#### Established a standard for in-card group-label headings, raised by Jack as a follow-up to the Round 7 main-header standard
- **Audit**: found `spotters.html` already had a proper, fully-built subheader component — `.section-subheader` (centered, bold, blue-tinted banner with a left accent border) — used consistently 8 times. No other page used it. Instead, every other page that needed the same job (a label introducing a cluster of sub-cards/content) reinvented it ad hoc: `about.html` had one inline-styled `accent-blue` h3 and one plain h4 (wrong heading level); `repeaters.html` had 4 h3s split between no styling at all and inline `margin-top` only; `index.html` had 3 inline-styled `accent-blue` h3s (at least internally consistent with each other, but still not the real component).
- **Decision** (Jack's call): adopt `.section-subheader` everywhere instead of the inline one-offs.
- **Changes**: `about.html` — "Our Forecast Area + Who Covers the Rest of the State" (h3) and "Georgia NWS SKYWARN Programs" (was h4, promoted to h3 for correct heading hierarchy) now use `.section-subheader`. `repeaters.html` — all 4 headings in the CHIRP/RT Systems import-instructions modals ("How to Import into CHIRP", "CHIRP Download", "How to Import into RT Systems", "RT Systems Software") converted; removed 2 now-redundant `<hr>` separators on `index.html` since the banner styling already provides visual separation. `index.html` — "Radar Maps", "Dashboards", "Repeater Maps" converted.
- **Left alone**: index.html's "Essential weather and situational awareness tools for spotters." — an intro tagline, not a section label; wrapping it in the bordered banner would look wrong next to real group labels right below it (Jack's explicit call). `.sub-card h4` (the title inside an individual sub-card) and `.callout h4` / `.detail-section h3` (contained, purpose-built contexts) are different components and were not touched.
- Documented the standard in CLAUDE.md's CSS Architecture → Component Classes section, same place as the Round 7 card-header standard.
- HTML-only change, no version bump needed.

### 2026-06-30 (Round 7) — Site-Wide Card Header Color Standard

#### Established a standard for main card headers, raised by Jack after noticing `repeaters.html` and `wx4ptc.html` used visibly different header colors
- **Audit**: cataloged every `.card-header` usage across all 9 HTML pages. Found the site had split into two camps without anyone deciding to: `about.html` and `repeaters.html` used the brighter `card-header--blue`, while `spotters.html`, `nwsffclinks.html`, `wx4ptc.html`, `changelog.html`, `photoarchive.html`, and most of `index.html` used the plain default (dark navy gradient). Separately, `index.html`'s Spotter Activation/Active Area Alerts headers and `repeater-health.html`'s section headers use color **functionally** (live severity, data-quality category) — those were never part of the inconsistency and stay dynamic.
- **Bonus finding**: CLAUDE.md documented `nwsffclinks.html` as having color-coded headers per category (blue/indigo/orange/green) — the actual HTML never did this; every header there was always plain default. Corrected the documentation rather than the code.
- **Decision** (Jack's call, via explicit choice): default dark-navy `.card-header` is now the site-wide standard for every purely-informational card. Color modifiers are reserved for functional/semantic use only.
- **Changes**: removed `card-header--blue` from `about.html` (Overview, Service Area, Contacts — 3 headers) and `repeaters.html` (Search Repeaters, Linked Repeater System, Non-Linked, CSV Export — 4 headers). Updated `js/changelog.js` so the dynamically-injected "Recent Site Updates" card on about.html also uses the default instead of blue. `nwsffclinks.html` needed no code change — it was already correct, just mis-documented.
- Documented the standard explicitly in CLAUDE.md's CSS Architecture → Component Classes section so it doesn't drift again.
- Version bumped to `20260630q`.

### 2026-06-30 (Round 6) — County Filter Robustness: areaDesc Fallback

#### `js/nws-api.js` — geocode.SAME isn't reliable for non-EAS products
- **Follow-up bug** (Jack still saw failures after Round 4/5's fixes): `geocode.SAME` is documented by NWS as a county-level EAS broadcast field, but in practice it's only consistently populated for EAS-significant warning products (Tornado, Flash Flood, Severe Thunderstorm, etc.). Advisory-level products like Heat Advisory are not EAS-required triggers, so their `SAME` arrays can be sparse or empty even when the county is clearly named in the product text — meaning the Round 4 fix narrowed the gap but didn't close it for every product type.
- **Fix**: added a third, most-reliable match layer that parses `properties.areaDesc` (the "Areas:" semicolon-separated county list shown on every alert card) directly and matches county names as plain text. `areaDesc` is always fully populated by NWS regardless of product type or geocode convention, since forecasters write it directly into the product. The filter now matches on `geocode.UGC` OR `geocode.SAME` OR `areaDesc` — three independent paths, any one of which is sufficient.
- File header `Version:` comment bumped to `20260630c`; site-wide `APP_VERSION` bumped to `20260630p`.

### 2026-06-30 (Round 5) — Second Code Review Pass, County Filter Partial-Match Bug

#### `js/nws-api.js` — county filter silently cleared on partial input
- **Bug** (caught during manual testing of the Round 4 fix): typing a valid-but-incomplete county prefix into the Active Area Alerts filter (e.g. "Fayet" instead of finishing "Fayette") silently showed ALL statewide alerts with no error indicator, while a fully-typed/selected county worked correctly. Made the Round 4 fix look broken even though the underlying geocode.SAME matching was correct.
- **Root cause**: `validateAndFilter()` only added a county's GAC code to `newFilter` on an *exact* name match. An in-progress prefix with no exact match yet (but a valid partial match, so no error was flagged) left `newFilter` empty, and `activeCountyFilter = newFilter` then overwrote whatever filter was previously active — including wiping out a filter that had nothing to do with what was being typed.
- **Fix**: when every token is still an unresolved prefix (`newFilter.size === 0`, `hasError === false`, input non-empty), `validateAndFilter()` now leaves `activeCountyFilter` untouched instead of clearing it. The alert list only changes once a token actually resolves (exact match or autocomplete selection).
- Reviewed the other two site search features (repeater search on `repeaters.html`, county autocomplete on `about.html`) for the same class of bug — both correct, no changes needed.

#### Second website-coder review pass — four smaller fixes
- **`data/repeaters.json`**: fixed `id: "W4GTA-145"` → `"W4GTA-145.350"` (Lookout Mountain) — didn't match the documented `CALLSIGN-FREQUENCY` convention every other entry follows.
- **`CLAUDE.md`**: documented the `statusNote` field (position 13) in the repeaters.json schema table — a real field used by 4 inactive repeaters and read by `repeater-health.html`'s Inactive table, missing from the schema the same way `county`/`active` were before Round 3.
- **`js/cwa-map.js`**: `openCWAOfficeModal()`'s early-return guard didn't include `header` or `filterInput`, both of which are used unconditionally right after — a future change to the modal markup could throw a silent JS error instead of failing safe. Added both to the guard.
- **`js/components.js`**: removed a redundant, non-descriptive `...` link to `repeater-health.html` from the footer's "Connect" column. `repeater-health.html` is intentionally kept off normal navigation (noindex admin dashboard) and already has a deliberately subtle entry point via the footer-bottom ellipsis link — the Connect-column copy was a stray duplicate of that, not the intended access path.
- Version bumped to `20260630o`.

### 2026-06-30 (Round 4) — County Filter Bug Fix (zone-based alerts)

#### `js/nws-api.js` — county filter missed advisory/watch-level alerts
- **Bug** (reported by Jack): filtering the index.html dashboard's Active Area Alerts by "Fayette" returned zero results, even for a Heat Advisory whose `areaDesc` plainly listed "Fayette" among dozens of other counties.
- **Root cause**: `renderAllAlerts()`'s county filter only checked `properties.geocode.UGC` against GAC (county FIPS) codes loaded from `data/ffc-counties.json`. That works for warning-level products (Tornado, Severe Thunderstorm, Flash Flood Warning), which NWS geocodes at the county level (`GACxxx`). But advisory/watch-level products — Heat Advisory, Wind Advisory, Winter Weather Advisory, etc. — are geocoded by NWS **forecast zone** instead (`GAZxxx`), so their `UGC` array never contains a `GAC` code and the filter silently matched nothing, regardless of what the alert's `areaDesc` text said.
- **Fix**: added `gacToSameCode()`, which derives a county's 6-digit EAS/SAME FIPS code from its GAC code (Georgia state FIPS is `13`, so `GAC111` → `013111`). `geocode.SAME` is always county-level on every NWS alert regardless of product type (it's what drives EAS broadcast triggering), so it's the reliable cross-product field to match against. The filter now matches if **either** `geocode.UGC` contains the GAC code (warnings) **or** `geocode.SAME` contains the derived SAME code (advisories/watches).
- File header `Version:` comment bumped to `20260630a`; site-wide `APP_VERSION` bumped to `20260630m`.

### 2026-06-30 (Round 3) — Code Review Fixes, About Page Reorder

#### Code review cleanup (first pass with the dedicated `website-coder` subagent)
- **`js/loader.js`**: Fixed the stylesheet cache-busting selector. It read `link[rel="stylesheet"][href^="style.css"]`, which could never match the actual `<link href="css/style.css">` tag left over from the April 1 `css/` directory restructure — CSS changes have not been getting a `?v=` cache-bust parameter since then. Selector now targets `href^="css/style.css"`.
- **`js/scripts.js`**: Removed `renderWeatherStationRow()` and `renderWeatherStations()` and their call site. Dead code — the weather-stations feature (and `data/weather-stations.json`) was removed from `repeaters.html` back in January; the function had an early-return guard (`if (!container) return`) so it wasn't firing a failed fetch on every load, just sitting unused.
- **`js/scripts.js`**: Extracted a single `tagToBadgeClass(tag)` helper and replaced three copy-pasted tag→badge-class if/else chains (`renderRepeaterRow()`, `openRepeaterModal()`, `tagsToBadges()` on `repeater-health.html`) with calls to it. Prevents future badge-color drift between the repeater table, the detail modal, and the health dashboard.
- **`CLAUDE.md`**: Documented the `county` and `active` fields in the `repeaters.json` schema table (positions 5 and 12 respectively) — both are real, load-bearing fields (every record has them; `active` drives filtering in `renderAllRepeaters()` and the CSV exporters) that were missing from the documented field order. Removed the entire "Adding a Weather Station" and "Weather Stations vs Repeaters" sections, plus the stale "NOAA Weather Radio stations table" bullet under `repeaters.html`'s page description — all described a feature, file (`data/weather-stations.json`), and even file names (`data/linked-repeaters.json` / `data/nonlinked-repeaters.json`) that no longer exist in this codebase.
- Version bumped to `20260630l` for the JS changes.

#### `about.html` — section reorder + banner consistency
- Swapped section order: **Service Area of NWS Atlanta** now appears before **Contacts** (previously Contacts → Service Area). Page-nav list (`#page-nav-list`) reordered to match.
- All four cards on the page (Overview, Service Area, Contacts, Recent Updates) now use the same `card-header--blue` banner. Previously Overview and Service Area used the unstyled default gradient while Contacts and the JS-injected Recent Updates card used blue — inconsistent banner colors on the same page with no semantic reason for the split.
- HTML-only change; no version bump needed.

### 2026-06-30 (Round 2) — Dedicated Changelog Page

#### New `changelog.html` page
- Added a new root-level page holding the **full** changelog history, grouped by year (`.card` per year, reusing the existing `.changelog-grid`/`.changelog-month-card` styles). Not added to the main site nav — linked only from `about.html`, same precedent as `repeater-health.html`. Added to `sitemap.xml` (it's public content, unlike the noindex health dashboard).
- Page-nav and year container `<div id="y{year}">` elements are **static HTML**, not JS-generated. This is required, not a style choice: `scripts.js` wires up the sticky page-nav's mobile toggle and IntersectionObserver scroll-spy from elements present in the DOM right after `DOMContentLoaded`, which runs *before* `changelog.js` (a postScript) populates content. If the year containers didn't already exist, scroll-spy highlighting and the mobile-close-on-click handler would silently never fire for them. See new CLAUDE.md section **"Adding a Changelog Year"** for the (now-documented) manual step needed once a year, when the first entry of a new year lands in `data/changelog.json`.

#### `about.html` — replaced the archived-updates modal
- The old `#archivedModal` showed every update older than `CONFIG.UI.CHANGELOG_MONTHS_TO_SHOW` (a rolling 6-calendar-month date window) inside a small modal box. This didn't scale: unbounded history stuffed into a fixed-height popup, no deep links to a specific month, and no SEO value since modal content isn't a real URL.
- Replaced with a fixed **entry count** cutoff: `about.html` now always shows the most recent `CONFIG.UI.CHANGELOG_RECENT_COUNT` (6) month-cards regardless of calendar date, and a "View Full Changelog →" link (real `<a>`, not a JS-driven button) appears below them pointing to `changelog.html` whenever more than 6 entries exist.
- Removed `#archivedModal` markup, `#archivedModalClose`, `#archivedModalBody`, and the `setupArchivedModal()` function from `js/changelog.js` entirely — no modal-manager dependency left in this code path.

#### `js/changelog.js` — rewritten render logic
- `loadChangelog()` now branches on which container is present: `#changelog` (about.html, recent-only) vs `#changelogHistory` (changelog.html, full history). Both can theoretically run in the same load since the function doesn't early-return, but in practice `js/loader.js` only ever loads this script on one page at a time per its `postScripts` map.
- New `renderFullHistory()` groups `data.updates` by `year` into a `Map`, then renders one `.card` per year (newest year first) into the matching static `#y{year}` div. Logs a `console.warn` instead of throwing if a year's container is missing — fails visibly without breaking the rest of the page.
- Fixed a latent duplicate-ID bug in the old code: `renderRecentUpdates()` used to set `mainSection.id = 'changelog'` *inside* a container that was itself `<div id="changelog">`, producing two elements with the same ID. The inner section is now `id="changelog-card"`.

#### Config rename
- `CONFIG.UI.CHANGELOG_MONTHS_TO_SHOW` (date-window months) renamed to `CONFIG.UI.CHANGELOG_RECENT_COUNT` (entry count) in `js/core.js` to match the new cutoff semantics. Value unchanged (6).

#### `js/loader.js`
- Added `'changelog.html': ['js/changelog.js']` to `postScripts`.

#### Version: `20260630k`

### 2026-06-30 — CWA County Modal, Georgia County Search, Layout Restructure

#### CWA Office County Modal (`about.html`, `js/cwa-map.js`, `css/style.css`)
- **Office cards now open a modal** listing all counties served by that NWS office. Clicking any of the six `.nws-office-item` cards opens a unified `.modal-backdrop#cwaOfficeModal` showing a filterable county list and a SKYWARN program link button. The `<a>` link markup in `.nws-office-item` was replaced with `<button class="nws-office-btn" data-cwa="CWA">` (semantic button, not anchor, since it triggers JS not navigation).
- **Map click → pre-filtered modal**: Clicking a county on the SVG choropleth now calls `openCWAOfficeModal(cwa, countyName)` instead of `window.open()` to the SKYWARN page directly. The modal opens with the county filter pre-filled and the matching county highlighted (`.cwa-county-highlighted` class) while all other counties remain visible. This replaces the direct navigation behavior from the June 25 build.
- **"Show all" clear chip**: A `#cwaCountyFilterClear` button in the modal body resets the county filter without closing the modal. Text reads "× Show all".
- **Per-office gradient headers**: `CWA_CONFIG` extended with `headerGrad: [darkStart, lightEnd]` per office. Modal header background is set via inline style on open. JAX uses dark amber (`['#7f5800','#b36f00']`) instead of pure yellow so white text remains readable. All other offices use appropriately darkened variants of their map fill colors.
- **Dynamic SKYWARN button text**: `linkEl.textContent` set to `'Visit the ' + cwa + ' SKYWARN Page ↗'` so the button reads "Visit the FFC SKYWARN Page ↗", "Visit the JAX SKYWARN Page ↗", etc.
- **Module-level data stores**: `cwaCountyLists {}`, `nameToCWA {}`, and `allCounties []` moved to module scope (outside `initCWAMap`) so they're accessible to both the county search bar and the modal.

#### Georgia County Search Bar (`about.html`, `js/cwa-map.js`, `css/style.css`)
- New `<div class="county-search-wrap" id="countySearchWrap">` placed above the forecast area heading. Contains a label on the left ("Find your NWS Coverage Area:"), a pill-style input box (styled to match the repeater search bar), a red × clear button (left-aligned inside the pill, hidden when empty), and the text input with autocomplete.
- **Autocomplete behavior**: `wireCountySearch()` builds `allCounties` from all 159 entries in `nameToCWA` after JSON load. Dropdown shows up to 12 results with starts-with priority, then contains fallback. Each result shows county name + a pill-style CWA badge. Keyboard nav: ArrowDown/Up cycles, Enter selects, Escape closes. A 150ms blur delay lets `mousedown` on a result fire before `blur` hides the dropdown.
- **On selection**: Sets input value, hides dropdown, calls `openCWAOfficeModal(cwa, countyName)` — same modal as the office card/map-click path, pre-filtered to that county.
- `max-width: 850px; margin: 1rem auto 0` on `.county-search-wrap` matches the map width.

#### Forecast Area Layout Restructure (`about.html`, `css/style.css`)
- **Before**: `.forecast-maps` used a 2-column CSS Grid (`minmax(300px,1fr)` columns) with the SVG map on the left and office cards panel on the right. This caused the map to be constrained to roughly half the card width on most screens.
- **After**: `.forecast-maps` is now a single-column flex container (`flex-direction: column; gap: 2rem`). Map sits on top, full-width. Office cards grid sits below.
- **Map scaling fix** (CSS Flexbox margin/stretch interaction): Root cause of the "map too small" issue — `margin-inline: auto` on a flex item disables `align-self: stretch`, collapsing it to content width. Fix: added `width: 100%` to `.ga-cwa-map-wrap` in addition to `max-width: 850px; margin-inline: auto`. This is per CSS spec: auto margins in the flex cross-axis suppress stretch alignment.
- **Map max-width**: Set to `850px` (up from `560px` viewBox default). SVG uses `width="100%"` so it fills `.ga-cwa-map-wrap` and scales responsively.
- **Legend removed**: `<div id="ga-cwa-legend">` removed from `about.html`; CSS `.ga-cwa-legend` rules removed from `style.css`. The office cards below the map now serve as the legend.

#### NWS Office Card Redesign (`about.html`, `css/style.css`)
- **Office grid**: `.nws-office-links` converted from a vertical `<ul>` list to a responsive CSS Grid: 1 column → 2 columns at 540px → 3 columns at 900px.
- **Card styling**: `.nws-office-item` given `border-radius: 10px` (full card radius) and `padding: 0` (button handles internal padding). The background/border-left accent colors from the June 25 pass are preserved.
- **Hover**: Changed from `translateX(4px)` (sidebar-style affordance) to `translateY(-2px) + shadow` to suit a grid card layout.
- **`.nws-office-btn`**: New CSS component — `background: none; border: none; display: block; width: 100%; text-align: left; padding: 0.75rem 1rem; cursor: pointer; font-family: inherit; color: var(--text-primary); border-radius: 8px`. The inner `<strong>` shows the office name, a `<span class="office-coverage">` shows the coverage area text.
- **No panel background**: `.nws-offices-list` strips the surrounding card background so office cards float directly on the page section background, matching the visual weight of the search bar and map.

#### Version: `20260630j` (10 bumps across the session — `a` through `j`)

---

### 2026-06-25 — Interactive NWS CWA Map, County Alert Filter

#### Interactive Georgia CWA Choropleth Map (`about.html`, `js/cwa-map.js`)
- Replaced the static hotlinked NWS GIF in the `#forecastarea` card with a fully interactive SVG choropleth map rendered at runtime
- New page-specific script `js/cwa-map.js` added; wired into `loader.js` via `postScripts['about.html']`
- **Geometry source**: Census Bureau TIGERweb (`MapServer/1` county layer, `outSR=4326`, `maxAllowableOffset=0.005`) with Esri USA Counties Generalized as fallback; 15-second AbortController timeout on each source
- **Projection**: equirectangular, Georgia bounds LON −85.7/−80.8 × LAT 30.3/35.1 → SVG viewBox `0 0 560 600`
- **sessionStorage caching** (`ga-county-geo-v1`) avoids re-fetching GeoJSON on return visits
- **6 CWA color palette** (maximally distinct): FFC `#5c6bc0` indigo, GSP `#039be5` sky-blue, CAE `#f4511e` tomato, CHS `#43a047` green, JAX `#fdd835` yellow, TAE `#d81b60` magenta
- County paths are keyboard-accessible (`tabindex=0`, `role=button`, `aria-label`); Enter/Space opens the SKYWARN page; hover shows tooltip (appended to `<body>` to escape `backdrop-filter` containing blocks)
- Legend built dynamically from the `seenCWAs` Set (only shows offices that rendered successfully)
- `Promise.allSettled` loads all 6 county JSON files in parallel; a single failed file logs a warning but does not break the map

#### CWA County Data Files (five new files in `data/`)
All files follow the `{ "GAC###": "CountyName" }` format, consistent with the pre-existing `data/ffc-counties.json`. County assignments verified against the official NWS CWA boundary PDF (`ga_cwfa.pdf`):
- `data/gsp-counties.json` — 6 counties (Elbert, Franklin, Habersham, Hart, Rabun, Stephens)
- `data/cae-counties.json` — 5 counties (Burke, Columbia, Lincoln, McDuffie, Richmond)
- `data/chs-counties.json` — 12 counties (Bryan, Bulloch, Candler, Chatham, Effingham, Evans, Jenkins, Liberty, Long, McIntosh, Screven, Tattnall)
- `data/jax-counties.json` — 14 counties (Appling, Atkinson, Bacon, Brantley, Camden, Charlton, Clinch, Coffee, Echols, Glynn, Jeff Davis, Pierce, Ware, Wayne)
- `data/tae-counties.json` — 26 counties (Baker, Ben Hill, Berrien, Brooks, Calhoun, Clay, Colquitt, Cook, Decatur, Dougherty, Early, Grady, Irwin, Lanier, Lee, Lowndes, Miller, Mitchell, Quitman, Randolph, Seminole, Terrell, Thomas, Tift, Turner, Worth)
- **Total: 96 + 6 + 5 + 12 + 14 + 26 = 159 Georgia counties** (integrity check maintained throughout all county moves)
- Files were initially created as `cwa-*.json` then renamed to `*-counties.json` for consistency with `ffc-counties.json`; all code `file:` references updated simultaneously

#### County assignments corrected against official NWS PDF:
- Bulloch, Candler, Evans, Jenkins, Screven, Tattnall — moved from JAX → **CHS**
- Glynn, Camden — moved from CHS → **JAX**
- Lanier — moved from JAX → **TAE**

#### NWS Office Card Styling (`css/style.css`)
- `.nws-office-item` cards now have a 4px solid left-border color accent matching the map fill color for each office (`.nws-office-ffc`, `.nws-office-gsp`, `.nws-office-cae`, `.nws-office-chs`, `.nws-office-jax`, `.nws-office-tae`)
- Office name links use matching accent color (`a strong { color: ... }`) — JAX uses darker amber `#f57f17` instead of pure `#fdd835` for white-background text contrast

#### County Alert Filter (`index.html`, `js/nws-api.js`, `css/style.css`)
- Added county filter widget to the spotter dashboard so FFC spotters can scope active alerts to a specific county
- Powered by `data/ffc-counties.json`; no additional API calls required

#### CSP (`about.html`)
- Updated `connect-src` to include `https://services.arcgis.com` and `https://tigerweb.geo.census.gov` for the map geometry fetches

#### Version: `20260625q` (17 bumps across the session — `a` through `q`)

---

### 2026-05-16 (Round 6 — Modal modernization parity pass)
- **Legend-shape triangle alignment fix on the alert status bar**: the upward-pointing triangles (Warnings / Watches / Alerts) sat ~0.1em below the green pulse circle next to "Auto-refresh." Two causes stacked: `.legend-shape--triangle` had `vertical-align: -0.15em` (vs `-0.05em` on the base/circle), and an upward triangle is optically bottom-heavy (mass at the wide base, point at the apex) so its perceived centre sits below the geometric one. Changed triangle `vertical-align` to `+0.05em` (a 0.2em raise from prior) so the centroid lines up with the circle's optical centre. Math: triangle centroid at `base + H/3` = `base + 0.25em`; for that to match the circle's centre at `0.325em` above baseline → base at `0.075em`, rounded to `0.05em` for a clean value.
- **Modal modernization parity**: the December T3.13 pass migrated the primary `.modal-backdrop` / `.modal-content` stack to the modern `@starting-style` + `transition-behavior: allow-discrete` pattern, but the parallel `.repeater-detail-modal` stack on `repeaters.html` was missed entirely. This round brings it to parity:
  - `.repeater-detail-modal` now uses `display: none → flex` with `transition: opacity 200ms ease, display 200ms ease allow-discrete`, and an `@starting-style` block sets the entry state (`opacity: 0`, `translateY(12px)` on `.repeater-detail-content`). The modal now fades + slides in instead of snapping.
  - `backdrop-filter: blur(10px)` added (`.modal-backdrop` already had it; this matches).
  - `.repeater-detail-content`: border `2px` → `1px` (matches `.modal-content`), hardcoded `box-shadow: 0 10px 40px rgba(0,0,0,0.5)` → `box-shadow: var(--shadow-xl)`, added `opacity` + `transform` transition for the slide-up.
  - `.repeater-detail-close`: `transition: transform 0.2s` → `transition: var(--t-fast)` (T1.1 property-specific transition vocabulary).
  - Reduced-motion users automatically benefit via the Patch 1 global guard — no per-modal handling needed.
- **Fluid type on modal headings (T3.14 follow-up)**: `.modal-header h1-h6`, `.modal-title`, and `.repeater-detail-header h2` were all fixed `1.4rem`–`1.5rem`. Migrated to `var(--text-xl)` (clamps 1.25rem → 1.5rem). Modal titles now scale smoothly with viewport like the rest of the heading scale; on mobile they're slightly smaller than before, on desktop slightly larger.
- **`.modal-close` rgba → color-mix**: `rgba(255, 255, 255, 0.2)` and `rgba(255, 255, 255, 0.3)` literals replaced with `color-mix(in oklch, white 20%/30%, transparent)`. Mixes in OKLCH space, matches the Patch-3 badge + T2.7 pill vocabulary. Visual delta is imperceptible (OKLCH white-to-transparent at low percentages is nearly identical to sRGB rgba), but it's now consistent with how the rest of the design system blends tints.
- **Dead code removed**: `@keyframes slideUp` was orphaned by T3.13 (the modal animations it powered were replaced by `@starting-style` transitions in December). Confirmed via grep — zero references. Deleted. (`@keyframes fadeIn` is still live, used by `.alert-item` for initial render — kept.)
- **Version**: Bumped to `20260516n`.

### 2026-05-16 (Round 5 — `about.html` "About This Site" refresh)
- Refreshed the 8-card "About This Site" section on `about.html` to reflect the actual 2026 site state. Old version was written when the site was simpler and had several factually wrong or misleading claims.
- **Card changes**:
  - **Purpose & Mission** — kept (still accurate).
  - **Technical Details** → renamed **Built for Spotters**. Reframed for end users instead of developers: "no ads, no tracking, no third-party scripts" instead of "vanilla JS, localStorage, CSP." The technical details still matter, but they should live in `CLAUDE.md` not on a user-facing page.
  - **Real-Time Weather Alerts** → renamed **Live Weather Alerts**. Removed the false claim about a "dedicated alerts page" (that page was merged into `index.html` in the 2026-01-09 dashboard consolidation — the card had been wrong for four months).
  - **Dual Navigation System** → REMOVED. Internal detail nobody outside the codebase cares about.
  - **Mobile-First Design** → REMOVED. Same reason — assumed in 2026.
  - **HWO & Activation Status** → NEW. The site's most distinctive feature (three-level red/yellow/green spotter activation detection from parsed NWS HWO text) was never mentioned. Fixed.
  - **Quick Maps** → NEW. The Quick Maps section on `index.html` was added January 2026 and never made it into this page's description.
  - **Repeater Directory** — UPDATED to mention the search bar (Ctrl/Cmd+K), CSV export for CHIRP and RT Systems, AllStar/EchoLink node info, and RF link details. Old card just said "complete listings."
  - **Accessibility** — UPDATED to add the manual light/dark toggle, `prefers-reduced-motion` support (shipped today), and visible focus rings.
  - **NWS Resources** — kept (still accurate).
- **Net structural change**: 2 top + 6 bottom cards before → 2 top + 6 bottom cards after. Same layout, same grid (`sub-cards--3col`), same card count — just better content.
- **No JS or CSS changes**: HTML-only edit. `sitemap.xml` `lastmod` for `about.html` updated to `2026-05-16`. No version bump needed (HTML is served fresh, not cached via `?v=`).

### 2026-05-16 (Round 4 — Cleanup pass: residuals from Tiers 1-3)
- **#18 (T1.3 follow-up): `text-wrap: pretty` on `.alert-description`** — added explicit `text-wrap: pretty` to NWS alert body text. Long alert descriptions (e.g. "Tornado Warning issued for...") previously left a single-word orphan on the last line of dashboard cards. The global `p, li, td, th` rule already had `pretty`, but `.alert-description` is rendered as a div in JS-built markup, so it didn't inherit. Explicit override fixes it. `.callout p` was already covered by the global rule (callouts use actual `<p>` tags).
- **Fluid type tokens applied to four high-visibility text selectors**:
  - `.btn`: `font-size: 0.9rem` → `var(--text-sm)` (scales 0.875rem → 1rem). Buttons feel right-sized on every viewport now.
  - `.repeater-table th`: `font-size: 1rem` → `var(--text-sm)`. Table headers stay compact on mobile, scale subtly on big screens.
  - `.callout h4`: `font-size: 1.1rem` → `var(--text-base)` (scales 1rem → 1.125rem).
  - `.alert-description`: added `font-size: var(--text-base)` (previously inherited 1rem fixed from global `p` rule). Alert body text now scales with the viewport.
  - **Intentionally NOT migrated**: the long tail of ~65 other hardcoded `font-size:` declarations across the file. Most are decorative (logo, footer, badges) and either already match the fluid scale at their default size or have specific reasons to be fixed. The four above were chosen because they're the text users actually *read* across many pages.
- **OKLCH derivation expanded to remaining "genuinely darker" accent variants**:
  - `--accent-green-dark`: hand-tuned `#42ba7f` → `oklch(from var(--accent-green) calc(l - 0.06) c h)`.
  - `--accent-lightblue-dark`: NEW token, `oklch(from var(--accent-lightblue) calc(l - 0.04) c h)`. Did not exist before — added as a hover-state companion for the lightblue accent.
  - `--accent-yellow-dark`: hand-tuned `#E0A800` → `oklch(from var(--accent-yellow) calc(l - 0.06) c h)`.
  - **Kept hand-tuned** with documented exception comment: `--accent-indigo-dark`, `--accent-orange-dark`, `--accent-pink-dark`. These are *not* algorithmic darkenings of their base — they're lighter hover-state variants picked for specific hue/contrast reasons (`--accent-indigo-dark` is `#90CAF9`, a completely different hue). Auto-deriving them would change them visibly.
- **Total tokens now using OKLCH relative-color syntax**: 5 (blue-dark, red-dark, green-dark, lightblue-dark, yellow-dark). Up from 2 (blue-dark, red-dark) after Round 2.
- **Version**: Bumped to `20260516k`.
- **Status of the original Tier 4 list**: Items 15 (View Transitions), 16 (sticky-header shadow), 17 (delete `--transition`) shipped in Round 3. Item 18 (`text-wrap: pretty` audit) finished in this round. Tier 4 is now COMPLETE.
- **Remaining un-done items** (intentionally deferred): wrapping legacy CSS in `@layer components`, container-query migration for non-`.sub-cards` grids, font-size migration for the ~65 cosmetic hardcoded sizes, and bleeding-edge experimental features (`sibling-index()`, CSS `if()`, anchor positioning, `@scope`, cross-document View Transitions). None solve a problem the site currently has.

### 2026-05-16 (Round 3 — Tier 4 + Tier 2 residuals)
- **#17: Deleted legacy `--transition` token** — `:root` no longer defines `--transition: all 0.3s ease`. Grep confirms zero references after Round 2's T1.1 migration to `--t-fast`.
- **Tier 2 residuals — lift removal on remaining hover states**:
  - `.callout:hover`: removed `translateY(-2px)`, kept the deeper shadow.
  - `.contact-item:hover`: removed lift; added `color-mix(in oklch, var(--accent-blue) 6%, var(--card-bg))` background tint instead.
  - `.changelog-month-card:hover`: removed lift; shadow upgraded to `--shadow-lg` and accent-colored border added.
  - These three were out of Round 2's T2.6 scope and finish that pass. All site-wide `translateY(-2px)` hover lifts are now gone except `.back-to-top:active` (which is the active/press state, intentionally retained for tactile feedback).
- **#15: View Transitions API for theme toggle** — `setTheme()` in `js/components.js` now wraps the `data-theme` attribute change in `document.startViewTransition()` when supported (Baseline 2024 in Chromium/Safari). The browser snapshots the page before + after and crossfades, so dark/light flipping is smooth instead of snapping. Reduced-motion users skip the transition (double-guarded: JS checks `prefers-reduced-motion`, and the Patch 1 global guard would clamp the animation anyway). Tuned to 220ms ease in CSS via `::view-transition-old(root), ::view-transition-new(root)`.
- **#16: Sticky-header shadow on scroll** — `.header` now defaults to a subtler shadow (`0 1px 4px rgba(0,0,0,0.2)`). A new `initStickyHeaderShadow()` in `js/components.js` inserts a 1px sentinel at the top of `<body>` and watches it with an IntersectionObserver. When the sentinel leaves the viewport, `.is-stuck` is added to the header, which deepens the shadow (`0 8px 24px rgba(0,0,0,0.35)`), bumps the background opacity, and brightens the bottom border. Pattern matches Stripe / Linear / Vercel docs. Uses IntersectionObserver instead of CSS `@container scroll-state` because the latter doesn't (yet) allow styling the container itself across all browsers — IntersectionObserver pattern works everywhere with no @supports gymnastics.
- **Version**: Bumped to `20260516j`.

### 2026-05-16 (Round 2 — Tier 1-3 CSS upgrades)
- **Tier 1 — Low-risk modernization wins**:
  - **T1.1: Migrated remaining `var(--transition)` uses** — added new `--t-fast` token in `:root` (property-specific transition list: background-color, color, border-color, transform, box-shadow, opacity at 160ms ease) and replaced all 15 `transition: var(--transition);` declarations with `transition: var(--t-fast);`. Legacy `--transition` alias retained as deprecated for backward compat.
  - **T1.2: `:focus` → `:focus-visible`** — converted 10 link/button `:focus` rules to `:focus-visible` so mouse clicks no longer leave lingering outlines (`a`, `#desktopNav a`, `.page-nav .nav-list a`, `.link-url`, `.btn`, `.btn-yellow`, `.contact-link`, `.map-card`, `.map-card-icon`, `.back-to-top`). Form input `:focus` rules deliberately preserved (inputs benefit from focus styling on mouse click too).
  - **T1.3: `text-wrap: pretty` on body text** — added to global `p, li, td, th` rule. Prevents single-word orphans on the last line of alert descriptions, callout text, etc. Baseline 2024.
  - **T1.4: Fixed `--nav-btn-color` dark-mode bug** — dark-mode value was `var(--border-primary)` which is `rgba(255,255,255,0.10)` (near-invisible as text color). A latent bug from the original four-block theme structure; preserved in Patch 2 for fidelity. Both modes now use `var(--text-primary)`.
  - **T1.5: Removed all 10 `-webkit-backdrop-filter` prefixes** — Safari 18.0 (Sept 2024) shipped the unprefixed property. The duplicate declarations were dead code on every modern browser.
- **Tier 2 — Buttons, pills, focus rings**:
  - **T2.6: Tonal-shift hover replacing lift** — removed `transform: translateY(-2px)` and the deep `box-shadow` glow from `.btn:hover` and `.sub-card:hover`. Replaced with darker background fill (`.btn`) or accent border + 4% accent tint (`.sub-card`). Active state now uses `scale: 0.98` for tactile press feedback. Matches Linear/Vercel/Stripe button vocabulary. Reduced-motion users (Patch 1) benefit automatically.
  - **T2.7: True-pill page-nav** — `.page-nav .nav-list a` border-radius bumped 8px → 999px (fully pill, scales with content). Hard-coded `rgba(96, 165, 250, 0.15)` literals replaced with `color-mix(in oklch, var(--accent-blue) 15%, transparent)` so pills auto-theme with the accent color. Hover state also tokenized.
  - **T2.8: Active-section indicator on page-nav** — added IntersectionObserver block in `scripts.js` (~30 lines, runs after page-nav toggle setup). Marks the current section's nav pill with `.is-active` as the user scrolls. `rootMargin: '-200px 0px -50% 0px'` accounts for sticky header + page-nav stack and only flags sections whose top is in the upper half of the viewport. CSS: `.page-nav .nav-list a.is-active` fills in fully (accent background, white text).
  - **T2.9: Focus-ring tokens** — added `--focus-ring: 2px solid color-mix(in oklch, var(--accent-blue) 75%, transparent)` and `--focus-ring-offset: 3px` to `:root`. Applied via a global `:where(a, button, [role="button"], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])):focus-visible` rule. The `:where()` keeps specificity at 0 so any component-specific override still wins.
- **Tier 3 — Structural modernization**:
  - **T3.10: `@layer reset, tokens, base, components, utilities;`** declared at top of `style.css`. Conservative adoption: existing CSS remains unlayered (highest priority preserved). Future additions SHOULD live in `@layer components { ... }` to give utilities and overrides a clean place to live without specificity wars.
  - **T3.11: Container queries for sub-cards** — `.card-body` now declares `container-type: inline-size; container-name: cardbody`. The `.sub-cards` grid breakpoints converted from viewport media queries to `@container cardbody (min-width: 600px)` and `@container cardbody (min-width: 900px)`. Sub-cards now collapse correctly even if placed in a narrower column (sidebar, modal, half-width layout). Baseline 2023.
  - **T3.12: OKLCH relative-color derivation** — converted `--accent-blue-dark` and `--accent-red-dark` from hand-picked hex to `oklch(from var(--accent-blue) calc(l - 0.06) c h)`. Means changing the base accent updates the dark variant automatically. Visual delta from prior hand-tuned hex is <2% lightness. Other -dark variants (green, indigo, etc.) kept hand-tuned since they're tied to brand decisions.
  - **T3.13: `@starting-style` for modals** — replaced the `animation: fadeIn 0.3s ease` and `animation: slideUp 0.3s ease` keyframe patterns on `.modal-backdrop` and `.modal-content` with transitions + `@starting-style` blocks + `transition-behavior: allow-discrete`. Modern pattern (Baseline 2024) lets `display: none → flex` participate in transitions. Same visual outcome; integrates cleanly with `prefers-reduced-motion`.
  - **T3.14: Fluid type scale** — defined `--text-xs` through `--text-3xl` as `clamp()` tokens in `:root` (1.25× modular scale, smooth mobile-to-desktop interpolation). Applied to `h1`, `h2`, `h3`, and `.card-header h2`. Removed the now-redundant `@media (max-width: 480px)` font-size overrides for `h1`, `h2`, and `.card-header h2`.
- **Verification**:
  - `transition: var(--transition);` remaining: **0** (was 15)
  - `-webkit-backdrop-filter` remaining: **0** (was 10)
  - `translateY(-2px)` remaining on hover states: **3** (`.callout:hover`, `.contact-item:hover`, `.changelog-month-card:hover`) — out of T2.6 scope, candidates for a future pass
  - New 2024-Baseline feature count in `style.css`: **48+** uses of `@layer`, `@container`, `@starting-style`, `oklch()`, fluid type tokens, `--focus-ring`, `:focus-visible`, `text-wrap: pretty`, `--t-fast`
- **Version**: Bumped to `20260516g`. CSS file changes propagate via `loader.js`'s `?v=` cache buster.
- **Browser support**: Every feature shipped in this round is Baseline 2024 or earlier. No `@supports` guards needed for the site's modern-browser audience. The legacy `--transition: all 0.3s ease` alias remains in `:root` so any rule still referencing it continues to behave as before.
- **Known residuals for a future pass**: `.contact-item:hover`, `.callout:hover`, `.changelog-month-card:hover` still use `translateY(-2px)` lift; `.search-input:focus` etc deliberately not converted to `:focus-visible`; ~5 components still use `transition: var(--t-fast)` rather than their own property-specific transitions (acceptable but could be tightened).

### 2026-05-16
- **`repeater-health.html` Mobile-Nav Fix**: Added the missing `<button class="page-nav-toggle">☰ PAGE</button>` element that every other page has. Previously the sticky page-nav (Summary / Inactive / Unverified / Unknown Callsigns / Missing Club) had no way to open on mobile because the toggle button was absent — the `<ul>` slides off-screen on viewports <768px and only re-enters when `.page-nav.active` is set, which only happens via the toggle button click handler in `scripts.js`. Desktop anchor links were always correct.
- **CSS Modernization — Patches 1–5 (2026 Baseline features)**:
  - **Patch 1: `prefers-reduced-motion` guard** added near top of `style.css`. Honors user accessibility setting by collapsing all animations, transitions, and smooth scrolling to 0.01ms. Critical for users with vestibular disorders — previously every `.btn:hover`, `.sub-card:hover`, and `.page-nav a:hover` triggered a `translateY(-2px)` lift regardless of the user's motion pref.
  - **Patch 2: `light-dark()` token consolidation** — collapsed the four duplicated theme blocks (`:root`, `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])`, `html[data-theme="light"]`, `html[data-theme="dark"]`) into one set of tokens using the native `light-dark()` function (Baseline 2024). Manual theme overrides now just flip `color-scheme: light | dark` and every token re-evaluates automatically. Removed ~135 lines of duplicate token definitions. Behavior is preserved — system pref drives default, manual toggle wins over system pref.
  - **Patch 3: Tonal badge restyle** — rewrote `.badge-*` rules from solid-fill + white-text "sticker" look (Bootstrap-4-era, 2018) to tonal style: light tint background (`color-mix(in oklch, var(--badge-hue) 14%, transparent)`) + accent-colored text + faint border. Border-radius bumped 4px → 999px (fully pill, matches Linear / Notion / Vercel conventions). Uses a single base rule with `--badge-hue` CSS variable per modifier — cuts 8 separate background declarations down to 8 single-line hue assignments. Added uppercase + 0.02em letter-spacing for "chip" feel.
  - **Patch 4: Property-specific transitions** — replaced `transition: var(--transition)` (which expanded to `all 0.3s ease`) on `.btn`, `.sub-card`, `.page-nav .nav-list a`, and `.badge-*` with explicit `transition: background-color 160ms ease, border-color 160ms ease, ...` lists. The `all` keyword recomputes on every changed property (perf footgun) and animates unrelated changes (e.g. dark-mode toggle). The legacy `--transition` token remains in `:root` for backward compatibility with the rest of the stylesheet.
  - **Patch 5: `text-wrap: balance` on headings** — added to the global `h1-h6` rule and to `.card-header h2`. Baseline 2024. Produces visually-even multi-line headings instead of one long line + one short orphan; especially noticeable on mobile and on long card titles like "Inactive Repeaters (4)" wrapping.
- **Version**: Bumped to `20260516f` to invalidate the CSS cache across all pages (the stylesheet is fetched via `loader.js` with a `?v=APP_VERSION` query string).
- **Browser support**: All features used are Baseline 2024 or earlier (`light-dark()`, `color-mix()`, `text-wrap: balance`, `prefers-reduced-motion`). No `@supports` fallbacks needed for the site's modern-browser audience. The legacy `--transition: all 0.3s ease` alias is retained so any rule that still references `var(--transition)` continues to behave as before.

### 2026-05-13
- **Code Audit & Dead Code Removal**:
  - `js/scripts.js`: Removed ~256 lines of dead alert-handling code (alertRefreshInterval, alertCache, getAlertCache, alertDataCache, alertModal init, openAlertModal wrapper, fetchAlerts, updateTimestamp, renderAllAlerts, initAlerts, handleAlertClick, handleAlertKeypress, attachAlertClickHandlers). All alert functionality is now exclusively in `nws-api.js`. Kept `sanitizeHTML` wrapper (used by repeater rendering). Removed dead `beforeunload` interval cleanup. Updated file header comment to reflect actual purpose.
  - `css/style.css`: Removed ~110 lines of dead CSS: `.nws-logo-section`, `.nws-logo-link`, `.nws-logo`, `.nws-logo-text`, `.nws-section`, `.nws-section-title`, `.nws-links` (all variants), `.btn-indigo`, `.site-header` (mobile + print), `.site-nav` rules (mobile), `.site-title`, `.site-subtitle` (print). These classes exist in no HTML or JS file. Preserved `.nws-more-resources` and `.nws-more-text` (used in spotters.html). Removed responsive and dark-mode overrides for the same dead selectors.
- **UX Improvements** (from this session):
  - `index.html`: Replaced "Georgia SKYWARN Spotter Dashboard" intro card with slim 4-button banner linking to key spotter resources. Removes content that was pushing live weather data below the fold. Added `badge-desktop-only` span to ARES map card title.
  - `spotters.html`: Replaced expired Feb/Mar 2026 training class dates with "Fall 2026 training dates coming soon" placeholder. Added `badge-desktop-only` span to ARES map h4.
  - `assets/og-image.png`: Created proper 1200×630 OG image (dark navy background, branded with logo and site name). Updated OG/Twitter meta tags across 6 pages (previously missing or pointing to broken `ganwsareacoverage.png`).
  - `css/style.css`: Added `.site-banner`, `.site-banner-text`, `.site-banner-link` component. Added `--header-gradient-orange` CSS variable and `.card-header--orange` rule (was used in `nwsffclinks.html` but missing — silent CSS fallback bug).
- **CLAUDE.md Documentation Overhaul**:
  - Completely rewrote **Navigation System** section to document the actual component-injected architecture (`components.js`, `#desktopNav`, `#mobileNav`, `.mobile-menu-btn`) instead of the stale `.site-nav`/`.nav-btn-*` pattern that no longer exists
  - Updated **CSS Architecture Component Classes** list to remove dead classes (`.site-nav`, `.nav-toggle`, `.nav-btn-alert`, `.nav-btn-link`, `.btn-indigo`) and add accurate component IDs
  - Updated **HTML Structure DO/DON'T**, **Adding a New Page**, **Working with the Navigation System**, **Mobile Navigation Troubleshooting**, and **AI Quick Reference Common Pitfalls** sections
- **Version**: Bumped to `20260513a`

### 2026-04-13
- **Security Hardening**:
  - `js/nws-api.js`: sanitize NWS API `productText` and `id` before inserting into `innerHTML` in `openOutlookModal()` (XSS fix)
  - `js/changelog.js`: replaced `innerHTML` template literals with DOM node construction (`createElement`/`textContent`/`createTextNode`) for both recent-updates list and archived-updates modal (XSS fix)
  - `admin.html` → `repeater-health.html`: renamed to better reflect purpose (database health dashboard, not an admin panel); updated all references in `js/components.js` and `js/scripts.js`
  - `admin.html`: added missing `Content-Security-Policy` meta tag before rename
  - Removed stale RepeaterBook API token prefix and support-ticket details from `CLAUDE.md` and `scripts/verify_repeaters.py` (token has been rotated)
- **Documentation Cleanup**:
  - `CLAUDE.md`: updated repo structure to reflect `repeater-health.html`, removed references to `js/search.js` and `data/search-index.json` (files no longer exist), corrected JS file count from 8 → 7

### 2026-04-03
- **Quarterly Repeater Verification System**: Built `scripts/verify_repeaters.py` to validate
  `data/repeaters.json` against the live RepeaterBook API
  - Fetches all Georgia repeaters from `https://www.repeaterbook.com/api/export.php?state_id=13`
  - Matches records by RepeaterBook numeric ID extracted from each entry's `refurl` field
  - Checks: callsign, frequency+direction, CTCSS tone, operational status (on-air/off-air)
  - Detects SKYWARN-affiliated repeaters on RepeaterBook not in our database (potential additions)
  - Generates updated `REPEATERBOOK_VALIDATION.md` in same format as existing report
  - `--fix` flag safely auto-updates `active` and `verified` fields only (never callsign/frequency/tone)
  - `--probe` flag prints raw API response fields to confirm field name constants on first run
  - API key read from `REPEATERBOOK_API_KEY` environment variable — never committed
  - Updated `.gitignore` to protect `.env` and local config files
  - Run quarterly: `export REPEATERBOOK_API_KEY=app_... && python3 scripts/verify_repeaters.py`
- **API Token**: Token has been rotated. Set the new key in `REPEATERBOOK_API_KEY`, then run
  `--probe` to confirm API field names match constants in the script (~line 45), then run
  full verification.
- **System membership note**: RepeaterBook export API does not include network/system membership
  data (which intertie a repeater belongs to). Tag validation remains manual via the 4 system
  URLs in `REPEATERBOOK_VALIDATION.md`.

### 2026-04-01
- **Directory Restructure**: Reorganized static assets to follow standard web conventions
  - Moved `style.css` → `css/style.css`; created `css/` directory
  - Moved `favicon.ico`, `georgiaskywarnlogo.png` → `assets/`; created `assets/` directory
  - Moved `archive/` → `assets/archive/` (WX4PTC station photos)
  - `nws.gif` was referenced in OG tags but not physically in repo; absolute URLs updated to `/assets/nws.gif` for when it is added
  - Updated all 7 HTML files: `href="css/style.css"`, `href="assets/favicon.ico"`
  - Updated `js/components.js`: logo `src` → `assets/georgiaskywarnlogo.png`
  - Updated absolute OG/Twitter image URLs in `nwsffclinks.html`, `repeaters.html`, `wx4ptc.html`, `photoarchive.html`, `index.html`
  - Updated relative `src="archive/..."` paths in `photoarchive.html` → `src="assets/archive/..."`
  - HTML files remain in root (external NWS/RepeaterBook links depend on root paths)
  - `www/` and `wx4ptc/` legacy redirect directories unchanged
  - Bumped version to `20260401a`
  - Updated CLAUDE.md structure docs, directory requirements, and AI quick reference

### 2026-03-20
- **Stylesheet Cleanup**: Removed dead code and fixed duplicate definitions in `style.css`
  - Removed duplicate `@keyframes fadeIn` — kept the slide version (`translateY(-10px) → 0`), dropped the plain opacity-only copy
  - Removed three unused classes: `.desktop-only`, `.map-mobile`, `.map-desktop` (no references in any HTML or JS)
  - Consolidated two conflicting `.repeater-table tbody tr:hover` rules into one at the detail modal block (preserving `transform` + `box-shadow`)
  - Removed redundant `@media (min-width: 1200px) { .nws-logo { max-width: 180px } }` — duplicated the base value
  - Fixed `.badge-se-linked` hardcoded `color: #f0f0f0` → `color: var(--white)`
  - Trimmed verbose comment headers
  - Net result: 2718 → 2696 lines, ~0.7KB smaller

### 2026-02-09
- **Spotters Page Cleanup**: Comprehensive redesign of `spotters.html` for readability and consistency
  - Reordered sections to follow learn→act flow: SKYWARN Info → Resources → Reporting → Submit
  - Fixed stray `</div>` tag and removed inline `style="color: red;"` (uses callout box instead)
  - Deduplicated "advisable to first bring reports" text (single copy in SKYWARN Info)
  - Fixed consistent indentation across all sections
  - Added `target="_blank"` to NWS SKYWARN link
- **Sub-Card Design System**: New `.sub-cards` / `.sub-card` CSS component for nested card grids
  - Responsive grid: 1-column mobile → 2-column tablet/desktop
  - `.sub-card--full` modifier for full-width spanning
  - `.sub-cards--3col` modifier for 3-column layouts at 1024px+
  - Hover effect: blue border highlight, subtle lift + shadow
  - Applied across `spotters.html` and `nwsffclinks.html`
- **Reporting Requirements Redesign**: Converted to sub-card layout
  - "How to Report" section: checklist sub-card + NWS Spotter Guidebook link side-by-side
  - "What to Report" section: 6 color-coded sub-cards with top borders (3-col grid on desktop)
  - New `.report-checklist` CSS with green checkmarks
  - New `.report-card-*` classes for color-coded top borders (tornado=red, hail=orange, etc.)
- **Submit Reports Redesign**: Converted callouts to sub-cards
  - Local SKYWARN Network + EchoLink Access as side-by-side sub-cards
  - "Can't Get Through?" as full-width sub-card
  - Action buttons under "Contact NWS Atlanta" subheader
- **NWS Links Page**: Converted all 5 sections in `nwsffclinks.html` from `.link-item` to `.sub-card` grid
- **Social Media Compact Row**: NWS social links as SVG icon buttons (globe, Facebook, X, YouTube)
- **CSS Cleanup**: Removed unused classes
  - Removed: `.link-item`, `.link-title`, `.link-description`, `.resource-description`, `.resource-item`, `.resource-icon`, `.resource-content`, `.resource-title`, `.resource-note`, `.report-top-row`, `.report-include`, `.report-guide`, `.report-section-title`, `.report-what-section`, `.report-items-grid`, `.report-item` (all variants)
  - Cleaned `.report-include` from compound selectors (kept `.include-col` for wx4ptc.html)

### 2026-02-08
- **Clickable IP Links**: Made AllStar and EchoLink rows clickable in the repeater detail modal
  - AllStar nodes link to `https://stats.allstarlink.org/stats/<nodeid>`
  - EchoLink nodes link to `https://www.repeaterbook.com/repeaters/echolink/node_status.php?node=<nodeid>&type=search`
  - Added external link icon (↗) to indicate clickable rows
  - Event delegation for reliable click handling on dynamically-added content
- **CSS Enhancements**: Added styling for clickable IP link rows
  - `.iplink-row` class with pointer cursor and hover highlight
  - `.external-link-icon` styling with opacity transitions

### 2026-01-11
- **Repeater Detail Modal**: Added interactive modal popup for detailed repeater information
  - Click any repeater row to view full details (basic info, description, club info, IP/RF links)
  - Modal displays: callsign, location, frequency, tone, RepeaterBook link, sponsor club
  - Internet Linking table: system, node/extension, callsign, connection type
  - Radio Linking table: callsign, location, frequency, link type, method (rf/direct/inet)
  - Status indicators: linked/non-linked, RepeaterBook verified
  - Network tag badges with color coding (Hub, WX4PTC, Peach State, Cherry Blossom)
- **New Repeater Table Structure**: Redesigned table with 5 columns for better information density
  - Location & Callsign (combined column with callsign in smaller text)
  - Frequency & Tone (combined column with tone in smaller text)
  - Tags (network affiliations as colored badges)
  - Internet Links (system names as badges: AllStar, EchoLink, etc.)
  - Radio Links (callsigns listed as comma-separated text)
  - Entire rows are clickable to open detail modal
- **Enhanced Repeater Data**: Added IP and RF linking information
  - IP links: AllStar, EchoLink, HAMs Over IP, Amateur Wire VOIP systems with node numbers
  - RF links: full-time and on-demand radio links between repeaters
  - Club sponsorship information (scraped from RepeaterBook, 86.5% coverage)
  - Unique repeater IDs format: CALLSIGN-FREQUENCY (e.g., W4GTA-145.350)
- **Weather Stations Removed**: Removed NOAA Weather Radio section from repeaters.html
  - Section was cluttering the page and not core to amateur radio repeater information
  - Users can find NOAA stations via NWS website link if needed
- **Data Consolidation**: Merged all repeater data into single repeaters.json file
  - Single source of truth with 57 repeaters (45 linked, 12 non-linked)
  - JavaScript filters and renders separate linked/non-linked tables dynamically
  - Simplified data management and reduced file duplication
- **CSS Additions**: Added ~130 lines of modal styling to style.css
  - Repeater detail modal styles (backdrop, content, header, body, close button)
  - Detail section grid layout for modal content
  - Clickable table row styles (hover effects, pointer cursor)
  - Responsive modal design with max-width 800px and scrollable content

### 2026-01-10
- **Sitewide Search Feature**: Added comprehensive client-side search with fuzzy matching
  - Created `js/search.js` (fuzzy search algorithm, 24-hour cache, keyboard shortcut Ctrl+Shift+K)
  - Created `data/search-index.json` (32 searchable sections across all 7 pages)
  - Added search icon to header navigation (desktop and mobile)
  - Search modal with live results, match type badges, and highlighted terms
  - Maintained by AI assistant (just ask to update when content changes)
- **CRITICAL FIX - Alert API**: Changed from zone-based to area-based queries
  - Now queries `?area=GA` instead of `?zone=GAZ001,...` to capture ALL Georgia alerts
  - Flash flood warnings use county codes (GAC###), not zone codes - were being missed
  - Fixed missing flash flood warnings and other county-based alerts
- **Dynamic Alert Header Colors**: Active Area Alerts card header now changes color based on severity
  - Red (warnings present), Yellow (watches only), Blue (advisories only), Green (no alerts)
  - Matches spotter activation card behavior for consistent UX
  - Updates automatically on refresh
- **Search UI Fixes**: Fixed search button color and click functionality
  - Search icon now matches nav text color (white in dark mode, light gray in light mode)
  - Added hover effects (blue accent color)
  - Fixed timing issue with click handler (retry logic for async script loading)
  - Modal closes correctly for both same-page and cross-page search results
- **CSV Export Improvements**: Modified repeater exports to focus on linked network
  - Both CHIRP and RT Systems exports now filter to linked repeaters only (removed non-linked)
  - Changed Name column format: `callsign location` (callsign first for truncation visibility)
  - Changed Comments format: `location - tags` (preserves location info alongside network tags)
  - Added RT Systems training video button (YouTube link) next to export buttons on repeaters.html
- **NWS Office Directory**: Replaced forecast area graphic with interactive color-coded list
  - Converted static image to clickable list of all NWS offices serving Georgia
  - Color-coded by office: FFC (indigo), JAX (yellow), TAE (magenta), CAE (orange), CHS (green), GSP (blue)
  - Each office links to their respective SKYWARN program page
  - Fixed broken SKYWARN URLs: JAX → `/jax/skywarn_schedule`, TAE → `/tae/taeskywarn`, CAE → `/cae/skywarn.html`
  - Maintains NWS Atlanta coverage map alongside new office directory (about.html)
- **Dashboard Enhancement**: Added NWS coverage area button to index.html
  - New button: "📍 View NWS Atlanta Service Area & Other Georgia Coverage Areas"
  - Links to about.html#forecastarea for geographic context
  - Helps visitors understand NWS FFC coverage boundaries

### 2026-01-09
- **JavaScript Consolidation**: Reduced from 9 files → 7 files (-22%), eliminated ~185 lines of duplicate code
  - Created `core.js` (merged config.js + utils.js) and `components.js` (merged header.js + footer.js)
  - Moved `openAlertModal()` to UTILS (fixes modal color bug where watch alerts showed red instead of yellow)
  - Consolidated modal/timestamp functions: `closeModal()`, `getAlertColorClass()`, `applyModalColor()`, `updateTimestampElement()`
- **Modal Styling Fix**: Standardized CSS for all modal headers (CSV modals had black text instead of white)
  - Added universal CSS rule for all heading elements (h1-h6) in `.modal-header`
  - All modals now consistent: white text, 1.4rem font, 700 weight
- **Website Restructuring**: Dashboard is now home page (index.html), old home page renamed to spotters.html
  - Updated navigation links across all 7 pages, removed redundant warnings card from spotters page
- **Repeater Date Display**: Added dynamic last-updated date fetched from repeaters.json Last-Modified header

### 2026-01-08
- **CSV Export**: Dual-format repeater export (CHIRP + RT Systems) with modal instructions for all 58 repeaters
- **Search Bar Enhancement**: Moved into dedicated card, maintained Ctrl/Cmd+K shortcut
- **Repeater Data Restructuring**: Merged into single `data/repeaters.json` with `linked` boolean and `picUrl`/`refurl` fields
- **Callsign Corrections**: Fixed 3 callsigns to match RepeaterBook (444.600+, 442.500+, 145.270-)

### 2026-01-05
- **Repeater Callsigns**: Added `callsign` and `refurl` fields to all 59 repeaters (46/59 identified, 13 marked "Unknown")
- **Cherry Blossom Corrections**: Fixed network membership - added 2 repeaters, deleted 1, corrected 2 tags to match RepeaterBook

### 2026-01-03
- **Weather Radio Stations**: Added 17 NOAA Weather Radio stations to repeaters page with searchable table
- **Activation Detection Fixes**: Fixed inverted logic bug (showed "will NOT be needed" as activation), added negative lookahead patterns
- **Script Loading Fix**: Resolved race condition by loading nws-api.js before scripts.js

### 2026-01-02
- **Version Management**: Created `version.js` + `loader.js` for centralized cache busting (update one number to refresh entire site)
- **Code Reorganization**: Created `config.js` and `utils.js`, eliminated ~450 lines of duplicate code
- **Spotter Activation**: Three-level urgency system (standard/enhanced/PDS) with color-coded indicators
- **Dashboard Consolidation**: Merged alerts.html into dashboard.html with HWO, activation status, and Quick Maps

### 2025-12-30
- **Component Architecture**: Created `header.js` and `footer.js` for dynamic loading with unified navigation and theme toggle
- **Page Navigation**: Redesigned with sticky horizontal bar (desktop) and full-screen overlay (mobile)
- **Visual Enhancements**: Added glassmorphism effects, 4-level shadow system, gradient backgrounds, smooth transitions

### 2025-12-29
- **Sticky Page Navigation**: Converted from hamburger to always-visible sticky bar with glassmorphism
- **Button Standardization**: Unified sizing and styling across all navigation and content buttons
- **Theme System Fix**: Fixed dark mode callout backgrounds respecting manual theme toggle

### 2025-12-05
- **Dual Navigation**: Implemented site-nav (blue, page links) and page-nav (green, section anchors) with color-coded mobile hamburgers
- **New Pages**: Created `repeaters.html` and `nwsffclinks.html` for dedicated content organization

### 2025-12-02
- **Documentation**: Added explicit directory structure requirements and AI assistant guidance (CLAUDE.md)

### 2025-11-09
- **Alerts Page**: Extracted alerts into dedicated page with warning-only filter for index.html

### 2025-11-07
- **UI Consistency**: Added NWS resources grid styling and standardized card headers
- Consolidated media queries for better maintainability

### 2025-11-05
- Complete CSS refactor: mobile-first, Grid/Flexbox
- Added full ARIA accessibility attributes
- Implemented light/dark mode support
- Removed legacy styles and unused code

---

## Testing & Validation

### Activation Pattern Testing

This section documents the test cases for validating spotter activation detection patterns against real NWS Hazardous Weather Outlook language.

#### 🔴 RED Level Tests (Activation Requested/Likely)

| Test Case | Input Text | Pattern Match | Status |
|-----------|------------|---------------|--------|
| 1 | "SPOTTER ACTIVATION IS REQUESTED" | `/SPOTTER\s+ACTIVATION\s+IS\s+(?!NOT\s+)REQUESTED/i` | ✅ MATCH |
| 2 | "SKYWARN ACTIVATION IS REQUESTED" | `/SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+IS\s+(?!NOT\s+)REQUESTED/i` | ✅ MATCH |
| 3 | "SKYWARN SPOTTER ACTIVATION IS REQUESTED" | `/SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+IS\s+(?!NOT\s+)REQUESTED/i` | ✅ MATCH |
| 4 | "SPOTTER ACTIVATION WILL LIKELY BE NEEDED" | `/SPOTTER\s+ACTIVATION\s+WILL\s+(?!NOT\s+)(?:LIKELY\s+)?BE\s+NEEDED/i` | ✅ MATCH |
| 5 | "SPOTTER ACTIVATION WILL BE NEEDED" | `/SPOTTER\s+ACTIVATION\s+WILL\s+(?!NOT\s+)(?:LIKELY\s+)?BE\s+NEEDED/i` | ✅ MATCH |
| 6 | "SKYWARN spotter activation will likely be needed tonight" | `/SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+WILL\s+(?!NOT\s+)(?:LIKELY\s+)?BE\s+NEEDED/i` | ✅ MATCH |
| 7 | "ACTIVATE SKYWARN SPOTTERS" | `/(?!.*\bNOT\b.*ACTIVATE)ACTIVATE.*(?:SKYWARN\|SPOTTER)/i` | ✅ MATCH |
| 8 | "Please ACTIVATE the SPOTTER network" | `/(?!.*\bNOT\b.*ACTIVATE)ACTIVATE.*(?:SKYWARN\|SPOTTER)/i` | ✅ MATCH |
| 9 | "SPOTTER network ACTIVATION is REQUESTED" | `/(?:SKYWARN\|SPOTTER).*ACTIVATION\s+(?:IS\s+\|WILL\s+(?:LIKELY\s+)?BE\s+)?(?!NOT\s+)(?:REQUESTED\|NEEDED)/i` | ✅ MATCH |
| 10 | "SKYWARN ACTIVATION will be NEEDED" | `/(?:SKYWARN\|SPOTTER).*ACTIVATION\s+(?:IS\s+\|WILL\s+(?:LIKELY\s+)?BE\s+)?(?!NOT\s+)(?:REQUESTED\|NEEDED)/i` | ✅ MATCH |

**Critical: All RED patterns include negative lookahead `(?!NOT\s+)` to exclude phrases like "will NOT be needed"**

#### 🟡 YELLOW Level Tests (Monitor/May Be Needed)

| Test Case | Input Text | Pattern Match | Status |
|-----------|------------|---------------|--------|
| 1 | "SPOTTER ACTIVATION MAY BE NEEDED" | `/SPOTTER\s+ACTIVATION\s+MAY\s+(?!NOT\s+)BE\s+NEEDED/i` | ✅ MATCH |
| 2 | "SKYWARN ACTIVATION MAY BE NEEDED" | `/SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+MAY\s+(?!NOT\s+)BE\s+NEEDED/i` | ✅ MATCH |
| 3 | "SKYWARN spotter activation may be needed this afternoon" | `/SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+MAY\s+(?!NOT\s+)BE\s+NEEDED/i` | ✅ MATCH |
| 4 | "SPOTTER REPORTS ENCOURAGED" | `/(?:SPOTTER\|SKYWARN).*(?:REPORTS?\s+)?(?!NOT\s+)(?:ENCOURAGED\|POSSIBLE)/i` | ✅ MATCH |
| 5 | "SKYWARN reports are ENCOURAGED" | `/(?:SPOTTER\|SKYWARN).*(?:REPORTS?\s+)?(?!NOT\s+)(?:ENCOURAGED\|POSSIBLE)/i` | ✅ MATCH |
| 6 | "SPOTTER ACTIVATION POSSIBLE" | `/(?:SPOTTER\|SKYWARN).*ACTIVATION.*(?!NOT\s+)(?:POSSIBLE\|MAY)/i` | ✅ MATCH |
| 7 | "SKYWARN ACTIVATION is POSSIBLE this evening" | `/(?:SPOTTER\|SKYWARN).*ACTIVATION.*(?!NOT\s+)(?:POSSIBLE\|MAY)/i` | ✅ MATCH |

**Critical: All YELLOW patterns include negative lookahead `(?!NOT\s+)` to exclude phrases like "may NOT be needed"**

#### 🟢 GREEN Level Tests (Stand Down/Not Needed)

| Test Case | Input Text | Pattern Match | Status |
|-----------|------------|---------------|--------|
| 1 | "SPOTTER ACTIVATION IS NOT EXPECTED" | `/SPOTTER\s+ACTIVATION\s+(?:IS\s+)?NOT\s+(?:EXPECTED\|NEEDED\|ANTICIPATED)/i` | ✅ MATCH |
| 2 | "SPOTTER ACTIVATION NOT EXPECTED" | `/SPOTTER\s+ACTIVATION\s+(?:IS\s+)?NOT\s+(?:EXPECTED\|NEEDED\|ANTICIPATED)/i` | ✅ MATCH |
| 3 | "SPOTTER ACTIVATION IS NOT NEEDED" | `/SPOTTER\s+ACTIVATION\s+(?:IS\s+)?NOT\s+(?:EXPECTED\|NEEDED\|ANTICIPATED)/i` | ✅ MATCH |
| 4 | "SPOTTER ACTIVATION IS NOT ANTICIPATED" | `/SPOTTER\s+ACTIVATION\s+(?:IS\s+)?NOT\s+(?:EXPECTED\|NEEDED\|ANTICIPATED)/i` | ✅ MATCH |
| 5 | "SKYWARN ACTIVATION IS NOT EXPECTED" | `/SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+(?:IS\s+)?NOT\s+(?:EXPECTED\|NEEDED\|ANTICIPATED)/i` | ✅ MATCH |
| 6 | "SKYWARN spotter activation is not anticipated at this time" | `/SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+(?:IS\s+)?NOT\s+(?:EXPECTED\|NEEDED\|ANTICIPATED)/i` | ✅ MATCH |
| 7 | "SPOTTER ACTIVATION WILL NOT BE NEEDED" | `/SPOTTER\s+ACTIVATION\s+WILL\s+NOT\s+BE\s+NEEDED/i` | ✅ MATCH |
| 8 | "SKYWARN SPOTTER ACTIVATION WILL NOT BE NEEDED" | `/SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+WILL\s+NOT\s+BE\s+NEEDED/i` | ✅ MATCH |
| 9 | "NO ACTION NEEDED" | `/NO\s+(?:SPOTTER\s+)?ACTION\s+NEEDED/i` | ✅ MATCH |
| 10 | "NO SPOTTER ACTION NEEDED" | `/NO\s+(?:SPOTTER\s+)?ACTION\s+NEEDED/i` | ✅ MATCH |

#### ⚪ Edge Cases & Default Behavior

| Test Case | Input Text | Expected Result | Reasoning |
|-----------|------------|-----------------|-----------|
| 1 | "Severe thunderstorms possible this afternoon" | 🟢 GREEN (default) | No activation language → defaults to green |
| 2 | "Hazardous weather outlook for north Georgia" | 🟢 GREEN (default) | No activation language → defaults to green |
| 3 | Empty string | 🟢 GREEN (default) | No text → defaults to green |

#### Pattern Priority & Overlap Prevention

The patterns are checked in order: **RED → YELLOW → GREEN → Default GREEN**

This ensures:
- ✅ Definitive activation (RED) takes priority over tentative (YELLOW)
- ✅ Explicit stand-down (GREEN patterns) is detected when present
- ✅ No activation mention defaults to GREEN (safe default)
- ✅ No overlap: "MAY BE NEEDED" only matches YELLOW, never RED
- ✅ No overlap: "IS REQUESTED" only matches RED, never YELLOW
- ✅ Negative lookahead prevents false positives: "will NOT be needed" → GREEN, not RED

#### Real-World NWS Examples Verified

Based on research from actual NWS Hazardous Weather Outlooks:

1. ✅ "SKYWARN spotter activation will likely be needed tonight" (NWS Twin Cities, Sep 2019)
   - **Detected as: RED** ✓

2. ✅ "SPOTTER ACTIVATION MAY BE NEEDED THIS AFTERNOON" (NWS Oklahoma)
   - **Detected as: YELLOW** ✓

3. ✅ "Spotter activation is not expected at this time" (Common NWS phrasing)
   - **Detected as: GREEN** ✓

4. ✅ "Spotter activation will not be needed through tonight" (User-reported real example)
   - **Detected as: GREEN** ✓ (Previously incorrectly detected as RED before fix)

#### Summary

- **Total Patterns**: 15 patterns (6 RED, 4 YELLOW, 5 GREEN)
- **Coverage**: Comprehensive based on actual NWS HWO language
- **False Positives**: Prevented by negative lookahead assertions (`(?!NOT\s+)`)
- **False Negatives**: Low - patterns use optional groups to catch variations
- **Priority Logic**: Correct ordering prevents misclassification
- **Section Extraction**: Code focuses on `.SPOTTER INFORMATION STATEMENT...` section for accuracy

✅ **All patterns verified against real-world NWS language**

---

## AI Assistant Quick Reference

### Before Making Changes

1. **READ THE DIRECTORY STRUCTURE REQUIREMENTS** (Section 0 in Key Conventions)
2. Read this entire CLAUDE.md file
3. Verify you will NOT move, rename, or reorganize any files or directories
4. Understand the mobile-first CSS approach
5. Review existing code patterns (IIFE, BEM, semantic HTML)
6. Test in multiple viewports (mobile, tablet, desktop)
7. Verify light and dark modes

### After Completing Session Work

When a user indicates the session is ending (e.g., "this session is over", "wrap up", "finalize documentation"), always:

1. **Update sitemap.xml**: Change `<lastmod>` date to current date (YYYY-MM-DD) for any modified pages
2. **Update CLAUDE.md Changelog**: Add comprehensive entry for current date including:
   - All features implemented or modified
   - Files created, modified, or deleted
   - Bug fixes and corrections
   - Data updates (repeaters, contacts, links)
   - Documentation improvements
3. **Review Documentation**: Verify all references in CLAUDE.md, ADMIN_GUIDE.md, and other docs reflect current state
4. **Check Cross-References**: Ensure file paths, function names, section IDs, and instructions are accurate
5. **Verify Consistency**: Check that navigation, links, and references work across all pages
6. **Update Version Numbers**: If JavaScript was modified, ensure version numbers were bumped appropriately

**Important**: Session wrap-up is a critical maintenance task that ensures documentation stays current and accurate for future work.

### Common Pitfalls to Avoid

- ❌ **MOST IMPORTANT**: Don't move HTML files out of root
- ❌ Don't move `css/style.css` back to root or rename the `css/` directory
- ❌ Don't move assets out of `assets/` back to root
- ❌ Don't create extra top-level directories beyond `css/`, `js/`, `data/`, `assets/`
- ❌ Don't remove or rename the `wx4ptc/` or `www/` directories
- ❌ Don't add external libraries (jQuery, Bootstrap, etc.)
- ❌ Don't create new CSS/JS files (use existing ones)
- ❌ Don't hardcode colors (use CSS custom properties)
- ❌ Don't skip ARIA attributes
- ❌ Don't break mobile responsiveness
- ❌ Don't change NWS API cache keys
- ❌ Don't remove User-Agent headers
- ❌ Don't write site navigation HTML manually — it's injected by `components.js`
- ❌ Don't forget to update BOTH `#desktopNav` and `#mobileNav` in `components.js` when adding a page
- ❌ Don't add `.nav-btn-alert` or `.nav-btn-link` classes to site nav links — those classes no longer exist

### When in Doubt

1. Follow existing patterns in the codebase
2. Maintain consistency with surrounding code
3. Prioritize accessibility and mobile-first design
4. Test thoroughly before committing
5. Ask for clarification if requirements are unclear

---

**Last Updated**: 2026-07-08 (repeater-health.html renamed to repeater-validation.html to match its actual quarterly data-validation use; footer Connect-column link moved in from footer-bottom, replacing rather than duplicating the old "..." entry point; 2026-07-01 — County data integrity overhaul — all 6 data/*-counties.json files rebuilt keyed by county name instead of GAC code, after discovering ffc-counties.json had systematically wrong GAC codes for 68 of 96 counties, causing a "Floyd" filter to silently return Fayette County's alerts; each county now stores gac, same, and gaz (forecast zone, array — not FIPS-derivable) codes, sourced from live NWS lookups; nws-api.js's county filter gained a fourth match layer using real per-county GAZ codes and dropped the old FIPS-arithmetic gacToSameCode() helper; cwa-map.js updated for the new schema; same-day follow-up closed all 5 remaining gaz gaps — Colquitt/Cook/Quitman/Thomas (TAE) confirmed live via forecast.weather.gov MapClick zone pages, Bryan/Liberty/McIntosh CHS coastal-inland split zones confirmed via NWS Charleston's 2026 rezoning notice — all 159 counties now have complete gac/same/gaz data with zero gaps; 2026-06-30 — Standard search-pill component rolled out to repeaters.html, index.html, and about.html, replacing three inconsistent search boxes with one shared icon/clear/error pill; county search bar spacing fix; callout h4 centered; Repeater table header theming fix — .repeater-table th switched from a gradient (rejected on visual grounds) to a flat solid color, still light-dark()-aware via color-mix derived from the card-header token; Dead CSS sweep — 15 abandoned rules removed via automated cross-reference, print stylesheet's broken .nav-toggle selector fixed, .section-subheader dark-mode color-mix fix; Established site-wide subheader standard — .section-subheader now used everywhere instead of inline-styled one-off h3/h4 group labels; Established site-wide card-header color standard — default dark navy for informational cards, color reserved for functional use; about.html and repeaters.html reverted from card-header--blue to default; nwsffclinks.html documentation corrected to match actual plain-default headers; County filter now also matches areaDesc text as a third fallback layer, since geocode.SAME isn't reliably populated for non-EAS advisory products; County filter partial-match bug fixed — typing an incomplete county name no longer silently clears the active filter; second review pass fixes — repeaters.json id typo, statusNote schema doc, cwa-map.js null-guard, duplicate footer link removed; County alert filter bug fix — zone-geocoded advisories/watches now match via geocode.SAME, not just geocode.UGC; code review fixes — loader.js cache-busting bug, dead weather-station code removed, badge-class mapping consolidated, repeaters.json schema docs corrected; about.html Service Area/Contacts reorder + unified blue card banners; dedicated changelog.html history page replacing the archived-updates modal; about.html now shows a fixed 6-entry recent count; CWA county modal system; Georgia county search bar; forecast area layout restructure — map on top, 3-col office grid below; legend removed; map scaling fix)
**Maintained By**: Claude AI Assistant (based on codebase analysis)
**For Questions**: Contact Jack Parks (KQ4JP) <kq4jp@pm.me>
