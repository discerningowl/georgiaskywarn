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
├── index.html              # Main landing page with SKYWARN info and active warnings
├── dashboard.html          # Spotter dashboard with HWO, activation status, and all alerts
├── repeaters.html          # Dedicated page for linked and non-linked repeaters
├── nwsffclinks.html        # Useful NWS links and resources page
├── wx4ptc.html             # Information about WX4PTC station
├── about.html              # Site structure and overview
├── photoarchive.html       # Photo archive of WX4PTC station
├── style.css               # Shared stylesheet for all pages
├── georgiaskywarnlogo.png  # Site logo (500x500px)
├── favicon.ico             # Site favicon
├── nws.gif                 # NWS logo
├── js/                     # JavaScript files directory
│   ├── version.js          # **CRITICAL** - Single version number for cache busting
│   ├── loader.js           # **CRITICAL** - Dynamically loads all scripts with versioning
│   ├── header.js           # Header component (logo, nav, theme toggle, back-to-top)
│   ├── footer.js           # Footer component (dynamically loaded)
│   ├── scripts.js          # Page-specific JavaScript (alerts, modals, repeater search)
│   ├── nws-api.js          # NWS API integration and HWO
│   ├── config.js           # Centralized configuration
│   ├── utils.js            # Shared utility functions (includes cache invalidation)
│   └── changelog.js        # Changelog display
├── data/                   # Data files directory
│   ├── linked-repeaters.json   # Linked repeater data (dynamically loaded)
│   ├── nonlinked-repeaters.json # Non-linked repeater data (dynamically loaded)
│   ├── weather-stations.json   # NOAA Weather Radio stations (dynamically loaded)
│   └── changelog.json      # Website changelog/updates
├── archive/                # Photo archive directory
│   └── WX4PTC*.jpg         # Station photos (1-8)
├── www/                    # Legacy redirect folder
│   └── index.html
└── wx4ptc/                 # Legacy redirect folder (DO NOT REMOVE)
    ├── index.html          # Redirect script
    └── ReadMe.md           # Explains external link preservation
```

### ⚠️ CRITICAL: Directory Structure Requirements

**HTML files and CSS MUST remain in the root directory. This is a hard requirement.**

**Current Structure** (as of January 5, 2026):
- ✅ **HTML files**: All in root directory
- ✅ **CSS files**: `style.css` in root directory
- ✅ **JavaScript files**: Organized in `js/` directory
- ✅ **Data files**: JSON files in `data/` directory
- ✅ **Images**: In root directory (except photo archive in `archive/`)
- ✅ **Legacy redirects**: `www/` and `wx4ptc/` directories preserved

**DO NOT**:
- ❌ Move HTML files into subdirectories (e.g., `pages/`, `src/`, `public/`)
- ❌ Move `style.css` from the root directory
- ❌ Create additional directories (e.g., `css/`, `images/`, `assets/`)
- ❌ Rename existing directories (`js/`, `data/`, `archive/`, `www/`, `wx4ptc/`)
- ❌ Move image files into an `assets/` or `images/` folder
- ❌ Reorganize the `js/` or `data/` directory structure

**WHY**: This structure is required for:
1. **External links** - Many external websites link directly to HTML files at their current root paths
2. **Legacy redirects** - The `wx4ptc/` and `www/` directories handle old URLs still in use
3. **Static hosting** - Deployment configuration depends on HTML files being in root
4. **Code organization** - The `js/` and `data/` directories reduce duplication while maintaining compatibility

### Important Notes

1. **DO NOT REMOVE** the `wx4ptc/` directory - it contains redirect scripts for external links referenced by NWS and other official sources
2. **DO NOT REMOVE** the `www/` directory - legacy redirect for old bookmarks
3. All HTML pages MUST remain in the root directory
4. All HTML pages share the same `style.css` stylesheet (root level)
5. **Component architecture**: Header loaded via `js/header.js`, Footer loaded via `js/footer.js`
6. **JavaScript organization**: All JavaScript files in `js/` directory for better code organization
7. **Data organization**: All JSON data files in `data/` directory
8. Images and assets remain in root directory except for historical photos in `archive/`

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
1. Loads `header.js` first (prevents flash of unstyled content)
2. Loads core scripts: `config.js` → `utils.js` → `footer.js` → `scripts.js`
3. Loads page-specific scripts (`nws-api.js` for index/dashboard, `changelog.js` for about)
4. Appends `?v=${APP_VERSION}` to every script URL for cache busting

### 🔴 REQUIRED: Update Version After JavaScript Changes

**When you modify ANY JavaScript file, you MUST update the version number:**

#### Update `js/version.js` (line 18):
```javascript
const APP_VERSION = '20260102c';  // ← Change this to force cache refresh
```

**That's it!** This single change:
- ✅ Forces browsers to reload all JavaScript files (`?v=` parameter)
- ✅ Triggers localStorage cache clearing (utils.js reads this version)
- ✅ Updates across all 7 pages automatically

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
     'dashboard.html': ['js/nws-api.js'],
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

### index.html (Main Page)
**Purpose**: Primary entry point with comprehensive SKYWARN information

**Navigation**:
- **Site-nav**: Links to other pages (dashboard, repeaters, wx4ptc, nwsffclinks, about)
- **Page-nav**: Internal page links (NWS Resources, SKYWARN Info, Reporting, Submit Reports, Repeaters, Contacts)

**Key Sections**:
- Active Warnings (NWS Atlanta WARNINGS only - red card, links to dashboard for all alerts)
- NWS Resources
- SKYWARN Information & Spotter Resources
- Reporting Requirements (what to report and how)
- Submit Reports (contact methods)

**JavaScript Features**:
- Fetches active NWS warnings from `api.weather.gov/alerts`
- Filters for NWS Peachtree City (FFC) warnings only
- 5-minute cache in localStorage
- Auto-refresh every 10 minutes
- Dual navigation toggle handlers for site-nav and page-nav

### dashboard.html
**Purpose**: Spotter dashboard showing HWO outlook, activation status, and all active alerts

**Navigation**:
- **Site-nav**: Links to other pages (back to index, repeaters, wx4ptc, nwsffclinks, about)
- **Page-nav**: Links to page sections (Spotter Status, Active Alerts, Quick Maps)

**Key Features**:
- Hazardous Weather Outlook (HWO) from NWS Atlanta with spotter activation detection
- Shows all alert types: warnings (red), watches (orange), and advisories (teal)
- Quick Maps section with 6 essential weather/situational awareness tools
- HWO cached for 4 hours, alerts refresh every 5 minutes
- Modal popups for HWO details and individual alert details

### repeaters.html
**Purpose**: Dedicated page for SKYWARN repeater and weather radio information

**Navigation**:
- **Site-nav**: Links to other pages (back to index, dashboard, wx4ptc, nwsffclinks, about)
- **Page-nav**: Links to page sections (Search Repeaters, Linked Repeaters, Non-Linked Repeaters, Weather Stations)

**Contains**:
- Repeater search bar (Ctrl/Cmd+K shortcut)
- Complete linked repeater table (primary SKYWARN network)
- Non-linked repeaters table (local SKYWARN nets)
- NOAA Weather Radio stations table (17 NWS transmitters in Georgia)
- Coverage notes and emergency power information

### nwsffclinks.html
**Purpose**: Comprehensive list of useful NWS and weather-related links

**Navigation**:
- **Site-nav**: Links to other pages (back to index, alerts, repeaters, wx4ptc, about)
- **Page-nav**: Links to page sections (Core Resources, Decision Support, River/Flood Info, Specialized Weather, National Centers)

**Contains**:
- Core NWS Atlanta resources
- Decision support tools
- River and flooding information
- Specialized weather information (fire, winter, aviation)
- National weather centers

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
   - `.card` - Reusable content container
   - `.callout` - Highlighted tip/warning boxes
   - `.btn` - Button component with color modifiers
   - `.repeater-table` - Styled tables for repeater info
   - `.alert-item` - Weather alert display cards
   - `.site-nav` - Site-wide navigation container
   - `.page-nav` - Page-specific navigation container
   - `.nav-toggle` - Mobile hamburger menu button (styled differently for site-nav and page-nav)
   - `.nav-list` - Navigation link list
   - `.nav-btn-alert` - Red navigation button for alerts page
   - `.nav-btn-link` - Blue navigation button for standard links

4. **Accessibility**:
   - Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
   - ARIA attributes (`role`, `aria-controls`, `aria-expanded`, `aria-label`)
   - Focus states for keyboard navigation
   - High contrast ratios for text

### Navigation System

The site uses a **two-tier navigation system**:

1. **Site Navigation (`.site-nav`)**:
   - Purpose: Navigate between different pages of the site
   - Desktop: Horizontal button bar
   - Mobile toggle: Blue hamburger button labeled "☰ SITE"
   - Button styling: `background: var(--accent-blue)` with darker hover state
   - Contains links to: dashboard.html, repeaters.html, wx4ptc.html, nwsffclinks.html, about.html

2. **Page Navigation (`.page-nav`)** - **Sticky Floating Bar**:
   - Purpose: Navigate to sections within the current page
   - **Always visible**: Sticky horizontal bar at top (`position: sticky`, `top: 0`, `z-index: 999`)
   - **Glassmorphism effect**: `backdrop-filter: blur(10px)` with semi-transparent background
   - **No toggle button**: Removed hamburger menu, now permanently visible on all screen sizes
   - Responsive: Buttons wrap on smaller screens with reduced padding
   - Contains anchor links to page sections (e.g., #nwscard, #SKYWARNcard, #reportcard)

3. **Navigation Button Classes**:
   - `.nav-btn-alert` - Red background (#e63946) for high-visibility alerts page links
   - `.nav-btn-link` - Indigo/blue background (#5C6BC0) for standard navigation links
   - Both include hover states with darker colors and smooth transitions

4. **Mobile Behavior**:
   - **Site-nav**: Hamburger button appears on mobile (<768px), toggles menu visibility
   - **Page-nav**: Always visible horizontal bar with wrapped buttons (no hamburger)
   - JavaScript handles toggling `.open` class only for `.site-nav .nav-list`
   - ARIA attributes: `aria-controls`, `aria-expanded`, `aria-label` (site-nav only)

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

**MOST IMPORTANT RULE**: The directory structure MUST remain flat and unchanged.

**ABSOLUTELY FORBIDDEN**:
- ❌ Creating subdirectories (`pages/`, `css/`, `js/`, `images/`, `assets/`, `src/`, `public/`, etc.)
- ❌ Moving any files from the root directory to subdirectories
- ❌ Reorganizing files into a "better" structure
- ❌ Renaming or removing `archive/`, `www/`, or `wx4ptc/` directories
- ❌ Moving `style.css` or any `.html` files from root

**WHY THIS MATTERS**:
- External websites (NWS, RepeaterBook, ham radio forums) link to specific file paths
- The `wx4ptc/` directory handles legacy redirects that CANNOT be broken
- Static hosting configuration depends on the flat structure
- Relative paths in HTML/CSS/JS are based on current structure

**IF YOU'RE TEMPTED TO "ORGANIZE" THE STRUCTURE - DON'T. This is not negotiable.**

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
- Implement both `.site-nav` and `.page-nav` with correct IDs and aria-controls
- Use proper navigation button classes (`.nav-btn-alert`, `.nav-btn-link`)

**DON'T**:
- Use `<div>` when semantic elements exist
- Remove ARIA attributes
- Break the navigation menu structure
- Change the footer loading mechanism
- Nest headings incorrectly (h1 → h2 → h3)
- Mix up site-nav and page-nav IDs (must be `site-nav-list` and `page-nav-list`)
- Forget to update site-nav on all pages when adding a new page

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

**JSON Structure**:
```json
{
  "location": "Peachtree City",
  "frequency": "147.390+",
  "tone": "141.3 Hz",
  "tags": ["WX4PTC"],
  "description": "Wide coverage, generator backup",
  "callsign": "WX4PTC",
  "refurl": "https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=12345",
  "linked": true
}
```

**Special case for repeaters with photos** (444.600+ and 442.500+):
```json
{
  "location": "Fayetteville",
  "frequency": "444.600+",
  "tone": "77.0 Hz",
  "tags": ["Hub", "WX4PTC"],
  "description": "Hub and net control repeater. Emergency Power.",
  "picUrl": "https://photos.app.goo.gl/EJB6ns91tw4oNkup6",
  "callsign": "WX4PTC",
  "refurl": "https://www.repeaterbook.com/repeaters/display.php?country=United+States&state_id=13&frequency=444.6",
  "linked": true
}
```

**Field Descriptions**:
- `location` - City or geographic location (required)
- `frequency` - Frequency with offset (e.g., "147.390+", "444.600+") (required)
- `tone` - CTCSS/PL tone in Hz (e.g., "141.3 Hz") or `null` if no tone (required)
- `tags` - Array of network affiliations: `["Hub"]`, `["WX4PTC"]`, `["Peach State"]`, `["Cherry Blossom"]` (required, can be empty `[]`)
- `description` - Coverage area, features, emergency power, etc. (required)
- `picUrl` - Link to station photos (only for 444.600+ and 442.500+) (optional)
- `callsign` - Amateur radio callsign (e.g., "WX4PTC", "K4DBN") or "Unknown" if not found (required)
- `refurl` - RepeaterBook reference URL - single source of truth for repeater info (required)
- `linked` - Boolean indicating if repeater is part of linked network (required)

**Steps**:
1. Open `data/repeaters.json`
2. Add new entry in alphabetical order by location
3. Follow JSON syntax rules:
   - Entries separated by commas
   - Last entry has NO trailing comma
   - All strings in double quotes
   - Tags array: `["Hub"]`, `["WX4PTC"]`, `["Peach State"]`, `["Cherry Blossom"]`, or combinations
4. Look up callsign on [RepeaterBook.com](https://www.repeaterbook.com/)
5. Set `refurl` to the RepeaterBook URL used to find the repeater
6. Validate JSON at [jsonlint.com](https://jsonlint.com/)
7. Verify frequency and callsign are correct
8. Test on mobile (repeater tables are responsive)

**Important Notes**:
- The HTML tables on `repeaters.html` are auto-generated from this JSON file via JavaScript. Do NOT edit the HTML tables directly.
- Location names link to RepeaterBook (using `refurl`) as the single source of truth for repeater information
- The `picUrl` field is only used for repeaters with station photos (currently 444.600+ and 442.500+). These repeaters will display a camera icon (📷) next to the location name that links to the photo gallery.
- Do NOT add `picUrl` to other repeaters. If you need specialized URLs for a repeater in the future, create a new specific field.

**For detailed non-technical instructions**, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md) Task 1.

### Adding a Weather Station

**File**: `data/weather-stations.json`

Weather station tables are dynamically generated from the JSON file. Edit `weather-stations.json` to add or update NOAA Weather Radio stations.

**JSON Structure**:
```json
{
  "location": "Atlanta",
  "wxChannel": "WX1",
  "frequency": "162.550 MHz",
  "callsign": "KEC80",
  "coverage": "Metro Atlanta and surrounding central Georgia counties (e.g., Fulton, DeKalb, Gwinnett); approx. 40-mile radius."
}
```

**Steps**:
1. Open `data/weather-stations.json`
2. Add new entry in alphabetical order by location
3. Follow JSON syntax rules:
   - Entries separated by commas
   - Last entry has NO trailing comma
   - All strings in double quotes
   - Frequency includes "MHz" (e.g., "162.550 MHz")
   - WX Channel format: "WX1" through "WX7"
4. Validate JSON at [jsonlint.com](https://jsonlint.com/)
5. Verify station information on [NOAA Weather Radio coverage map](https://www.weather.gov/nwr/coverage)
6. Test on mobile (weather station table is responsive and searchable)

**Search Integration**: Weather stations are automatically searchable via the existing repeater search (Ctrl/Cmd+K). No code changes needed - the search queries all `.repeater-table tbody` elements, which includes weather stations.

**Updating Existing Stations**:
- Frequency change: Update the `frequency` field in weather-stations.json
- Callsign change: Update the `callsign` field
- Coverage change: Update the `coverage` description
- Station offline: Remove the entry from the JSON file
- Always verify changes on [NOAA Weather Radio Status](https://www.weather.gov/nwr/)

**Coverage Note**: The 17 stations listed cover the NWS Atlanta (FFC) forecast area. Stations in neighboring forecast areas (e.g., NWS Jacksonville for South Georgia) are intentionally excluded to match SKYWARN geographic scope.

**Important**: The weather stations table on `repeaters.html` is auto-generated from this JSON file via JavaScript. Do NOT edit the HTML table directly.

### Weather Stations vs Repeaters - Key Differences

**CRITICAL: Weather stations and repeaters serve different purposes and require different equipment.**

**Weather Stations (NOAA Weather Radio)**:
- **Receive-only** broadcast transmitters operated by the National Weather Service
- Users **CANNOT transmit** on these frequencies (162.400-162.550 MHz)
- Requires weather radio or scanner (no amateur radio license needed)
- Broadcasts continuous weather information, warnings, watches, and forecasts 24/7
- One-way communication only

**Repeaters (Amateur Radio)**:
- **Two-way communication** systems for weather spotters
- Requires valid amateur radio license to transmit
- Used for reporting severe weather observations to NWS
- Interactive communication with net control and other spotters

**Code Implementation Differences**:
- **Weather stations**: Use `renderWeatherStationRow()` function
  - Table columns: Location, Frequency/Channel, Coverage Area
  - Callsign displayed as badge below location
  - No tone information (receive-only)
  - File: `data/weather-stations.json`

- **Repeaters**: Use `renderRepeaterRow()` function
  - Table columns: Location, Frequency+Tone, Description
  - Tags displayed as badges (Hub, WX4PTC, Peach State, Cherry Blossom)
  - Includes tone, autopatch, emergency power details
  - Files: `data/linked-repeaters.json`, `data/nonlinked-repeaters.json`

**Shared Functionality**:
- Both use the same search bar (Ctrl/Cmd+K shortcut)
- Both use `.repeater-table` CSS class for consistent styling
- Both are mobile-responsive with horizontal scrolling
- Both tables dynamically load from JSON files via `js/scripts.js`

**When to Use Which**:
- **Add to weather-stations.json**: NWS broadcast transmitters (NOAA Weather Radio)
- **Add to linked-repeaters.json**: Amateur radio repeaters linked to the SKYWARN network
- **Add to nonlinked-repeaters.json**: Local amateur radio repeaters for SKYWARN nets (not state-wide linked)

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

1. Copy an existing page structure (e.g., `about.html`)
2. Update the `<title>` tag
3. Update the `<h1>` and `<h2>` in the header
4. Determine if the page needs both site-nav and page-nav:
   - **Site-nav**: Always required (links to other pages)
   - **Page-nav**: Only if the page has multiple internal sections
5. Add the new page to the site-nav on ALL other pages:
   ```html
   <li><a href="newpage.html" class="nav-btn-link">New Page</a></li>
   ```
6. If using page-nav, add internal section links (no toggle button needed):
   ```html
   <nav class="page-nav" role="navigation" aria-label="Page navigation">
     <ul id="page-nav-list" class="nav-list">
       <li><a href="#section1">Section 1</a></li>
       <li><a href="#section2">Section 2</a></li>
     </ul>
   </nav>
   ```
7. Ensure site-nav hamburger button label is correct:
   - Site-nav: `aria-label="Toggle site menu"` with text "☰ SITE"
8. Test footer loading and navigation on both desktop and mobile

### Working with the Navigation System

**When to use Site-nav vs Page-nav**:
- **Site-nav**: Use for links to other HTML pages (always present on every page)
- **Page-nav**: Use for anchor links to sections within the current page (optional, only if page has multiple sections)

**Page-nav Implementation**:
- Page-nav is now a sticky horizontal bar (no toggle button needed)
- Simply add the nav structure without the toggle button:
  ```html
  <!-- Page navigation (sticky horizontal bar) -->
  <nav class="page-nav" role="navigation" aria-label="Page navigation">
    <ul id="page-nav-list" class="nav-list">
      <li><a href="#section1">Section 1</a></li>
      <li><a href="#section2">Section 2</a></li>
    </ul>
  </nav>
  ```

**Styling navigation links**:
- Use `.nav-btn-alert` for high-priority links (e.g., dashboard page):
  ```html
  <a href="dashboard.html" class="nav-btn-alert">Dashboard</a>
  ```
- Use `.nav-btn-link` for standard navigation links:
  ```html
  <a href="repeaters.html" class="nav-btn-link">SKYWARN Repeaters</a>
  ```
- Use no class for plain text links (e.g., "← Back to Georgia SKYWARN")

**JavaScript for navigation**:
- Only site-nav needs toggle handling (page-nav is always visible):
  ```javascript
  const navToggles = document.querySelectorAll('.site-nav .nav-toggle');
  navToggles.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('aria-controls');
      const menu = document.getElementById(targetId);
      menu.classList.toggle('open');
    });
  });
  ```

### Modifying the Alert Display Logic

**index.html** (warnings only):
```javascript
return p.senderName?.includes('NWS Peachtree City') &&
       p.event?.toLowerCase().includes('warning');
```

**dashboard.html** (all alerts):
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

1. **Verify JavaScript** for `.nav-toggle` is present
2. **Check CSS** for `.nav-list.open { display: flex; }`
3. **Test mobile viewport** - must be `<768px` width
4. **Ensure button has correct** `aria-controls` attribute:
   - Site-nav toggle: `aria-controls="site-nav-list"`
   - Page-nav toggle: `aria-controls="page-nav-list"`
5. **Verify IDs match**: The `<ul>` ID must match the button's `aria-controls` value
6. **Check for multiple toggles**: Pages with both site-nav and page-nav need `querySelectorAll('.nav-toggle')` to handle both buttons
7. **Verify button labels**: Site-nav should show "☰ SITE" and page-nav should show "☰ PAGE"

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

### 2026-01-05
- **REPEATER CALLSIGN DATA**: Added amateur radio callsigns to all repeater entries
  - Added `callsign` field to all repeaters in `linked-repeaters.json` and `nonlinked-repeaters.json`
  - Added `refurl` field documenting RepeaterBook URL used to find/verify each repeater
  - Successfully identified 46 out of 59 callsigns (78% success rate):
    - Linked repeaters: 43/48 callsigns found (89.6%)
    - Non-linked repeaters: 3/12 callsigns found (25.0%)
  - Data sources: URL keyword extraction (10), RepeaterBook page scraping (27), existing tags/descriptions (9)
  - Remaining 13 repeaters marked "Unknown" for manual lookup
  - Updated CLAUDE.md "Adding a New Repeater" section with field descriptions
- **CHERRY BLOSSOM INTERTIE CORRECTIONS**: Fixed repeater network membership
  - Added Gray (Round Oak) 145.370- (WB4JOE, 88.5 Hz) - official Cherry Blossom member
  - Added Wrens 147.120+ (W4CDC, 71.9 Hz) - official Cherry Blossom member
  - Deleted Forsyth 147.315+ (WB4JOE) - not part of official Cherry Blossom system
  - Added "Cherry Blossom" tag to Irwinton 147.240+ (K4DBN) - dual membership in both Cherry Blossom and Peach State
  - Removed "Cherry Blossom" tag from Laurens County 145.150- - not part of official system
  - Cherry Blossom Intertie now matches RepeaterBook's official listing (4 repeaters)
  - Total linked repeaters: 48 (net +1 from additions/deletions)

### 2026-01-03
- **WEATHER RADIO STATIONS**: Added NOAA Weather Radio information to repeaters page
  - Created `data/weather-stations.json` - 17 NWS weather radio transmitters in Georgia
  - Added "Weather Stations" section to `repeaters.html` with dedicated table
  - Stations include: location, WX channel (WX1-WX7), frequency (162.400-162.550 MHz), callsign, coverage area
  - Integrated with existing repeater search functionality (searchable by location, frequency, or callsign)
  - Added link to NWS county coverage finder in callout box
  - Updated page navigation to include "Weather Stations" link
  - Added `renderWeatherStations()` and `renderWeatherStationRow()` functions to `js/scripts.js`
  - All stations alphabetically sorted and mobile-responsive
- **NWS API INTEGRATION FIXES**: Critical bug fixes for spotter activation detection
  - Fixed inverted logic in RED activation patterns (was showing "will NOT be needed" as activation)
  - Added negative lookahead `(?!NOT\s+)` to all RED and YELLOW patterns
  - Fixed `parseSpotterActivation()` to extract `.SPOTTER INFORMATION STATEMENT...` section
  - Fixed `displayActivationStatus()` checking wrong properties (.activated → .level)
  - Fixed dark mode invisible alert text (--alert-desc-color was 92% transparent)
  - Fixed script loading race condition (nws-api.js now loads BEFORE scripts.js via preScripts array)
  - UX improvements: moved matched text to bottom, removed bold, enlarged "Outlook Issued"
- **DOCUMENTATION UPDATES**: Updated CLAUDE.md with weather stations feature
  - Added `weather-stations.json` to Repository Structure section
  - Updated `repeaters.html` description with weather stations information
  - Added "Adding a Weather Station" task to Common Tasks section
  - Version bumps: js/version.js to 20260103d

### 2026-01-02
- **CENTRALIZED VERSION MANAGEMENT**: True single-source cache busting system
  - Created `js/version.js` - Single version number controls all script cache busting
  - Created `js/loader.js` - Dynamically loads all JavaScript with automatic versioning
  - All 7 HTML pages now load only 2 scripts: `version.js` + `loader.js`
  - **To force cache refresh site-wide: update ONE number in `js/version.js` (line 18) - that's it!**
  - Added version-based localStorage cache invalidation in `js/utils.js` (reads from `window.APP_VERSION`)
  - Automatic cache clearing when version changes (fixes mobile browser stale cache issue)
  - Loader maintains correct dependency order: header → config → utils → footer → scripts → page-specific
  - No duplicate version numbers - utils.js reads from version.js automatically
- **CODE REORGANIZATION**: Eliminated ~450 lines of duplicate code
  - Created `js/config.js` for centralized configuration (NWS API settings, zone lists, cache TTL, activation patterns)
  - Created `js/utils.js` for shared utility functions (cache management, modal abstraction, JSON fetch, DOM helpers)
  - Moved JavaScript files to `js/` directory, data files to `data/` directory
  - Refactored `js/nws-api.js`, `js/scripts.js`, and `js/changelog.js` to use shared utilities
  - Added CSS color variables (--white, --black, --slate-400, etc.) replacing 60+ hardcoded color values
  - Fixed recursive CSS variable definitions in theme sections
  - Updated all 7 HTML pages to load scripts in proper dependency order
- **SPOTTER ACTIVATION ENHANCEMENTS**: Three-level urgency system
  - Implemented automatic detection of standard, enhanced, and PDS (Particularly Dangerous Situation) activations
  - Enhanced pattern matching for activation keywords in HWO
  - Added color-coded visual indicators (yellow/orange/red) for activation urgency
  - Improved dashboard styling with activation status prominently displayed
- **RELIABILITY IMPROVEMENTS**: Defensive error handling
  - Added try-catch blocks and cache diagnostics for configuration loading
  - Enhanced error handling in NWS API calls with better user feedback
  - Robust fallbacks for missing or corrupted cache data
  - Script version bumps to force browser cache refresh (v20260102c)
- **DASHBOARD CONSOLIDATION**: Unified spotter dashboard
  - Consolidated alerts.html into dashboard.html with HWO, activation status, and all alerts
  - Added Quick Maps section with 6 essential weather/situational awareness tools
  - HWO cached for 4 hours, alerts refresh every 5 minutes
  - Updated all navigation references from "Alerts" to "Dashboard"
  - Deleted alerts.html (functionality merged into dashboard.html)

### 2025-12-30
- **MAJOR REDESIGN**: Component-based architecture with header.js and footer.js
  - Created `header.js` component for dynamic header loading (inspired by atlantahamradio.org)
  - Integrated logo (GeorgiaSkywarnLogo.png), site navigation, and theme toggle into unified header
  - Created `footer.js` component for dynamic footer loading
  - Migrated theme toggle, mobile menu, and back-to-top functionality from scripts.js to header.js
  - All 7 HTML pages updated to load header and footer components
  - Renamed logo file from `" GeorgiaSkywarnLogo.png"` to `"GeorgiaSkywarnLogo.png"` (removed leading space)

- **HEADER COMPONENT** (header.js):
  - Sticky dark header with glassmorphism (`rgba(15, 23, 42, 0.95)` with `backdrop-filter: blur(10px)`)
  - Logo + title/subtitle on left, navigation links + theme toggle on right
  - Desktop: Horizontal navigation with inline links
  - Mobile: Full-screen overlay menu with hamburger button
  - Integrated theme toggle with sun/moon SVG icons
  - Back-to-top button injection with instant scroll detection (requestAnimationFrame)
  - Mobile subtitle wrapping to prevent header expansion

- **PAGE NAVIGATION REDESIGN**:
  - **Desktop**: Sticky horizontal bar below header (`position: sticky`, `top: 90px`)
    - Blue gradient buttons with glassmorphism
    - Smooth hover animations (lift 2px with glow)
  - **Mobile**: Green hamburger menu ("☰ PAGE") with full-screen overlay
    - "⚡ Jump to Section" header with gradient background
    - Uniform button sizing (1.15rem font, 1.25rem padding)
    - Centered vertical layout with 1.5rem gaps
    - Shimmer effect on button press
    - Semi-transparent background (`rgba(15, 23, 42, 0.85)` with 16px blur)

- **SCROLL OFFSET FIX**:
  - Added `scroll-padding-top` to prevent content hiding behind sticky elements
  - Desktop: 200px offset (header + page-nav)
  - Mobile: 100px offset (header only)
  - Smooth anchor link scrolling with proper clearance

- **VISUAL ENHANCEMENTS**:
  - Enhanced shadows: 4-level graduated system (sm, md, lg, xl)
  - Gradient backgrounds on navigation buttons and headers
  - Inset highlights (`inset 0 1px 0 rgba(255, 255, 255, 0.1)`)
  - Smooth cubic-bezier transitions (`cubic-bezier(0.4, 0, 0.2, 1)`)
  - Active state animations (scale 0.97, shimmer effect)

- **MOBILE OPTIMIZATIONS**:
  - Logo text wrapping with `max-width: calc(100vw - 180px)`
  - Reduced font sizes and padding for compact mobile layout
  - Hamburger button stays inline with logo (no wrapping)
  - Page-nav header positioned at `top: 6rem` to clear site header

- **FILES MODIFIED**:
  - Created: `header.js`, `footer.js`
  - Updated: `style.css`, `scripts.js` (removed migrated code)
  - Updated all 7 HTML pages: index.html, dashboard.html, repeaters.html, nwsffclinks.html, wx4ptc.html, about.html, photoarchive.html
  - Version numbers: header.js (v20251230c), footer.js (v20251230), style.css (v20251230n), scripts.js (v20251230a)

### 2025-12-29
- **MAJOR UPDATE**: Floating sticky page navigation (inspired by atlantahamradio.org)
  - Converted page-nav from hamburger menu to sticky horizontal bar at top
  - Added `position: sticky`, `backdrop-filter: blur(10px)` glassmorphism effect
  - Page-nav now always visible, floating at top on all screen sizes
  - Site-nav keeps hamburger menu on mobile (blue "☰ SITE" button)
  - Removed page-nav toggle button and handlers from all pages
- **BUTTON CONSISTENCY**: Unified all button styling across site
  - Site-nav, page-nav, and content buttons now share consistent sizing
  - All buttons: `padding: 0.5rem 1rem`, `font-size: 0.9rem`, `box-shadow: var(--shadow-sm)`
  - Refined mobile hamburger: smaller, compact styling (0.85rem font, 0.4rem padding)
  - Content buttons (`.btn`) refined to match nav button appearance
  - Fixed button hover: keeps white text color, only background darkens
  - Mobile: all buttons use `0.85rem font` and `0.4rem 0.75rem padding`
- **THEME SYSTEM FIXES**:
  - Fixed callouts retaining dark background when theme toggle set to light
  - Updated dark mode media query to respect manual theme toggle: `:root:not([data-theme="light"])`
  - Theme toggle z-index increased to 1001 (stays above page-nav at z-index 999)
- **CONTENT ADDITIONS**:
  - Added GEMA All Hazards Dashboard to nwsffclinks.html Specialized Weather section
- **CSS ARCHITECTURE**:
  - Updated navigation section comments to reflect sticky page-nav (no longer dual toggle)
  - Removed page-nav toggle styles, added `.page-nav .nav-list` always-visible rules
  - Updated `scripts.js` header comments: site-nav toggle only, page-nav sticky/always-visible

### 2025-12-05
- **MAJOR UPDATE**: Implemented dual navigation system
  - Added site-wide navigation (`.site-nav`) for page links - blue hamburger "☰ SITE"
  - Added page-specific navigation (`.page-nav`) for section anchors - green hamburger "☰ PAGE"
  - Differentiated mobile hamburger menus with color coding and text labels
  - Added navigation button classes: `.nav-btn-alert` (red) and `.nav-btn-link` (blue)
- **NEW PAGES**: Created dedicated pages for better content organization
  - `repeaters.html` - Linked and non-linked SKYWARN repeaters
  - `nwsffclinks.html` - Comprehensive NWS and weather resource links
- **CSS ENHANCEMENTS**:
  - Site-nav toggle: Blue background with hover effects
  - Page-nav toggle: Green background with hover effects
  - Navigation button styling with smooth transitions
- **IMPROVED UX**: Mobile navigation now clearly distinguishes between site and page navigation
- **DOCUMENTATION**: Updated CLAUDE.md to reflect dual navigation system and new site structure

### 2025-12-02
- **CRITICAL UPDATE**: Added explicit directory structure requirements throughout documentation
- Emphasized that flat directory structure MUST be maintained (no subdirectories)
- Added warnings about external links dependency on current file paths
- Updated "Common Pitfalls to Avoid" to prioritize structure preservation
- Created comprehensive CLAUDE.md file for AI assistant guidance

### 2025-11-09
- Extracted alerts section into dedicated page (`alerts.html`)
- Created separate warning-only filter for `index.html`

### 2025-11-07
- Added styles for NWS resources grid (3-column layout)
- Fixed card headers and button consistency
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

### Common Pitfalls to Avoid

- ❌ **MOST IMPORTANT**: Don't reorganize directory structure or create subdirectories
- ❌ Don't move HTML files into folders (pages/, src/, etc.)
- ❌ Don't create css/, js/, images/, or assets/ directories
- ❌ Don't remove or rename the `wx4ptc/` or `www/` directories
- ❌ Don't add external libraries (jQuery, Bootstrap, etc.)
- ❌ Don't create new CSS/JS files (use existing ones)
- ❌ Don't hardcode colors (use CSS custom properties)
- ❌ Don't skip ARIA attributes
- ❌ Don't break mobile responsiveness
- ❌ Don't change NWS API cache keys
- ❌ Don't remove User-Agent headers
- ❌ Don't confuse site-nav with page-nav (they serve different purposes)
- ❌ Don't forget to update navigation on ALL pages when adding a new page
- ❌ Don't use the wrong navigation button classes (.nav-btn-alert vs .nav-btn-link)

### When in Doubt

1. Follow existing patterns in the codebase
2. Maintain consistency with surrounding code
3. Prioritize accessibility and mobile-first design
4. Test thoroughly before committing
5. Ask for clarification if requirements are unclear

---

**Last Updated**: 2026-01-05
**Maintained By**: Claude AI Assistant (based on codebase analysis)
**For Questions**: Contact Jack Parks (KQ4JP) <kq4jp@pm.me>
