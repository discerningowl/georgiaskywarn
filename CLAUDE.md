# CLAUDE.md - Georgia SKYWARN Website

## Project Overview

The **Georgia SKYWARN** website (`georgiaskywarn.com`) is a static HTML/CSS website that provides resources for amateur radio weather spotters in North and Central Georgia. The site facilitates severe weather reporting through the Georgia SKYWARN linked repeater system and coordinates with the National Weather Service (NWS) office in Peachtree City, Georgia (call sign: WX4PTC).

**Author**: Jack Parks (KQ4JP) <kq4jp@pm.me>
**Primary Purpose**: SKYWARN volunteer coordination, weather alert distribution, and amateur radio repeater network information
**Tech Stack**: HTML5, CSS3, Vanilla JavaScript, NWS Weather API
**Design Philosophy**: Mobile-first, accessible, responsive, minimal dependencies

---

## Repository Structure

Layout: HTML pages in the root; `css/style.css`; `js/` (loaded through `js/loader.js`); `data/` (JSON); `assets/`;
`404.html` (Cloudflare Pages serves it, with a 404 status, for any unknown URL); `_redirects` (Pages redirects). Run `ls` for the current file list.

### ⚠️ CRITICAL: Directory Structure Requirements

**HTML files MUST remain in the root directory. This is a hard requirement.**

**DO NOT**:
- ❌ Move HTML files into subdirectories (e.g., `pages/`, `src/`, `public/`)
- ❌ Move `css/style.css` out of `css/` or back to root
- ❌ Move files out of `assets/` back to root
- ❌ Rename or remove `css/`, `js/`, `data/`, or `assets/` directories
- ❌ Move `assets/archive/` photos out of `assets/`
- ❌ Remove a URL from `_redirects` without checking who still links to it

**WHY**: This structure is required for:
1. **External links** - Many external websites link directly to HTML files at their current root paths
2. **Legacy redirects** - `_redirects` sends the old `/wx4ptc/` URL to `/wx4ptc` (the NWS SKYWARN page still links to it)
3. **Static hosting** - Deployment configuration depends on HTML files being in root
4. **Code organization** - The `css/`, `js/`, `data/`, and `assets/` directories follow standard conventions

### Important Notes

1. **DO NOT REMOVE** the `/wx4ptc/` rules in `_redirects` - external links from NWS and other official sources still use that URL. Write redirect targets without `.html`: Pages 308s `/x.html` to `/x`, so a rule to `.html` loops
2. All HTML pages MUST remain in the root directory
3. All HTML pages share the same stylesheet at `css/style.css`
4. **Component architecture**: Header and footer loaded via `js/components.js` (merged for efficiency)

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

New JS files are registered in `js/loader.js`; read it for the current script lists.


---

## Page notes

- `index.html`: the Warnings / Watches / Advisories count row is three `aria-pressed` toggle buttons; the filter resets on every page load by design (see `DEV_CHANGELOG.md`, 2026-10-12).
- `repeaters.html`: the tables are generated from `data/repeaters.json`; never edit the table HTML.
- `spotters.html`: sections run learn → prepare → understand → act.

---

## CSS Architecture (style.css)

### Design System

**Brand core** (2026-10-22, top of `:root`): `--brand-ink` (header; the logo's own
background), `--brand-blue` (fills behind white text, same in both themes), `--link`
(link text). Shared with the WX4PTC net control dashboard, which keeps the same names
and values; change both together. `--brand-navy` (`.page-nav` and mobile menu rows) is
site-only for now.

**Themes**: colours use `light-dark()`; there is no `prefers-color-scheme` block (since 2026-10-22), so a colour set outside `light-dark()` stays the same in both themes. Auto follows the device; Dark/Light are saved in `localStorage['theme']` and applied as `data-theme` on `<html>`.

### CSS Conventions

**Component standards**:

- **`.card-header` color standard (set 2026-06-30)**: the plain `.card-header` (no color modifier — dark navy gradient) is the **site-wide default for every purely-informational card banner**. Do NOT add `.card-header--blue` or any other color modifier to a card just to make it stand out. Color modifiers (`--red`, `--yellow`, `--blue`, `--orange`, `--green`) are reserved for **functional/semantic** meaning only: index.html's Spotter Activation and Active Area Alerts headers change color dynamically based on real severity (red/yellow/blue/green), and `repeater-audit.html`'s section headers use color to flag data-quality categories (red = inactive, yellow = needs review, blue = informational summary). If you're tempted to color a header purely for visual variety, don't — use the default.
- **`.section-subheader` standard (set 2026-06-30)**: use this class — not inline styles — for any `<h3>` that introduces a labeled cluster of content *within* a `.card-body` (e.g. "Radar Maps", "How to Import into CHIRP", "Our Forecast Area..."). It renders as a centered, bold, blue-tinted banner with a left accent border, 16px so it stays under the 18px card title (`css/style.css`, "Section subheaders"); the first one in a card automatically gets `margin-top: 0` via `.section-subheader:first-of-type`. Originally only used on `spotters.html`; standardized across `about.html`, `repeaters.html`, and `index.html` in the same pass that fixed `.card-header`. Do NOT reinvent this with inline `style="color: var(--accent-blue);"` on a bare `<h3>`/`<h4>` — that's exactly the drift this class exists to prevent. Plain intro/tagline text that isn't really a section label (e.g. index.html's "Essential weather and situational awareness tools for spotters.") should stay plain text, not `.section-subheader`; give it `.card-intro` (16px) so it doesn't outsize the card title. This is a different component from `.sub-card h4` (the title *inside* an individual sub-card, not a group label).
- **`.search-pill` standard (set 2026-06-30)**: the single shared search/filter box component (`css/style.css`, "Standard Search Pill" block just above the repeater-search section) used by the repeater search (`repeaters.html`), the county alert filter (`index.html`), and the county coverage search (`about.html`). Structure: `.search-pill` wraps a `.search-pill-icon` (magnifying glass, shown when idle), a `.search-pill-error-icon` (amber warning triangle with a `data-tooltip` CSS tooltip, only shown when the wrapping `.search-pill` has `.has-error` — currently only the county alert filter ever toggles this), a `.search-pill-clear` (circular red × button, left-justified, toggled via the `hidden` attribute — NOT a `.visible` class, that pattern was retired), and the `.search-pill-input` itself. A `:has()` rule hides the idle search icon automatically whenever the clear button or error triangle is showing, so only one indicator ever occupies the leading slot. Page-specific wrapper markup (labels, autocomplete dropdowns, outer padding bars like `.county-filter-bar` or `.county-search-wrap`) stays in each page's own CSS — only the pill itself (icon/error/clear/input) is shared. Do NOT hand-roll a new search box style; add `.search-pill` + the four child classes to any new search/filter UI instead.
- `.btn` - Button component with color modifiers (`btn-blue`, `btn-red`, `btn-green`, `btn-orange`, `btn-yellow`). Blue is the ordinary link button; red is for the storm-report links. Green, orange and yellow are light fills and take black text. No page uses green or orange now.

### Navigation System

The site uses a **two-tier navigation system**:

#### ⚠️ CRITICAL: Site navigation is component-injected

**DO NOT write site navigation markup manually.** The site-wide header and navigation are automatically injected by `js/components.js` into every page via `loadHeader()`. The injected HTML uses:
- `<header class="header">` — main header element
- `<nav id="desktopNav">` — desktop nav with plain `<a>` links only (no extra classes)
- `<div class="header-actions">` — the desktop headset button and theme toggle, right of the nav (2026-10-23; they were inside `#desktopNav`). The header is three zones across the full width: title flush left, nav in the middle, `.header-actions` flush right. From 1220px a grid centres the nav on the page (exactly from about 1540px; below that the wider title side pulls it a little right). From 769px to 1219px the nav gets its own centred row under the title and buttons. Hidden at 768px and below, like `#desktopNav`.
- `<button class="ncs-btn" data-ncs-open>` — operator icon (a person in a headset, `NCS_HEADSET_ICON`) for the WX4PTC Net Control Dashboard (2026-10-23). One sits in `.header-actions` before the theme toggle; one sits beside the hamburger in `.header-mobile-actions`. Both open `#ncsModal`, a "restricted, WX4PTC team only" notice whose Continue link opens `NCS_DASHBOARD_URL` (top of `components.js`, currently `https://skywarn.tytonest.xyz/`) in a new tab. The dashboard's own Cloudflare Access login is what actually restricts it. To move the dashboard to another hostname, change only that constant.
- `<div class="header-mobile-actions">` wrapping `<button class="mobile-menu-btn" id="mobileMenuBtn">` — mobile hamburger
- `<nav class="mobile-nav" id="mobileNav">` — mobile nav (toggled with `.active` class)

**To add a page to site navigation**: Edit `js/components.js` `loadHeader()` function — add an `<a href="newpage.html">New Page</a>` to **both** `#desktopNav` and `#mobileNav`.

Page nav (`.page-nav`) is written directly in each page's HTML (not injected); its mobile toggle is in `scripts.js`. Both menus close on outside click and Escape.

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

Alerts are filtered to `senderName` containing "NWS Peachtree City"; responses are cached 5 minutes (HWO 4 hours).

**Alert Classification**:
- **WARNING** (Red): Contains "warning" in `event` field
- **WATCH** (Orange): Contains "watch" in `event` field
- **OTHER** (Teal): All other alert types

---

## Key Conventions for AI Assistants

### 1. File Modifications

**DO**:
- Edit existing files rather than creating new ones
- Maintain consistent code formatting (2-space indentation)
- Preserve existing comments and changelog entries
- Add significant changes to `DEV_CHANGELOG.md` (not this file)
- Keep HTML attribute order: `class`, `id`, `role`, `aria-*`, `href`/`src`, `target`
- Keep all HTML files in the root directory

**DON'T**:
- Create new CSS files (use `style.css`)
- Add `<script>` tags to pages (new JS files are registered in `js/loader.js`)
- Remove the `/wx4ptc/` rules from `_redirects`
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

## Common Tasks

**Repeater data** (`data/repeaters.json` schema, field order, validation tiers, RepeaterBook checks): see `REPEATER_DATA.md`. Read it before adding, editing or validating a repeater.

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

---

## Contacts

- **Webmaster**: Jack Parks (KQ4JP) <kq4jp@pm.me>
- **NWS Warnings Coordinator**: David Nadler <David.Nadler@noaa.gov>
- **DEC ARES / NWS**: Robert Burton (KD4YDC) <kd4ydc@gmail.com>

---

## Changelog

The developer changelog is in `DEV_CHANGELOG.md` (not loaded automatically; read or grep it for the history and reasoning behind a past change). Add new entries there, newest first. The public changelog is `data/changelog.json`.

---

## Spotter-activation detection (`js/nws-api.js`)

Patterns are checked in order RED → YELLOW → GREEN → default GREEN, against the `.SPOTTER INFORMATION STATEMENT...` section of the HWO. Every RED and YELLOW pattern carries a negative lookahead `(?!NOT\s+)`, so "will NOT be needed" never reads as RED or YELLOW. No activation language defaults to GREEN. When you change a pattern, re-check that "MAY BE NEEDED" matches only YELLOW, "IS REQUESTED" only RED, and "will not be needed through tonight" is GREEN (it once read RED).

---

## AI Assistant Quick Reference

### Before Making Changes

1. **READ THE DIRECTORY STRUCTURE REQUIREMENTS** (the Directory Structure Requirements section near the top)
2. Read this entire CLAUDE.md file
3. Verify you will NOT move, rename, or reorganize any files or directories
4. Understand the mobile-first CSS approach
5. Review existing code patterns (IIFE, BEM, semantic HTML)
6. Test in multiple viewports (mobile, tablet, desktop)
7. Verify light and dark modes

### After Completing Session Work

When a user indicates the session is ending (e.g., "this session is over", "wrap up", "finalize documentation"), always:

1. **Update sitemap.xml**: Change `<lastmod>` date to current date (YYYY-MM-DD) for any modified pages
2. **Update `DEV_CHANGELOG.md`** (not this file): Add comprehensive entry for current date including:
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
- ❌ Don't remove the `/wx4ptc/` rules from `_redirects`
- ❌ Don't add external libraries (jQuery, Bootstrap, etc.)
- ❌ Don't create new CSS files (use `style.css`); new JS files are fine but must be registered in `js/loader.js`
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

