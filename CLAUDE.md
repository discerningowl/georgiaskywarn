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
├── scripts.js              # Page-specific JavaScript (alerts, modals, repeater search)
├── header.js               # Header component (logo, nav, theme toggle, back-to-top)
├── footer.js               # Footer component (dynamically loaded)
├── linked-repeaters.json   # Linked repeater data (dynamically loaded)
├── nonlinked-repeaters.json # Non-linked repeater data (dynamically loaded)
├── GeorgiaSkywarnLogo.png  # Site logo (500x500px)
├── favicon.ico             # Site favicon
├── nws.gif                 # NWS logo
├── ganwsareacoverage.png   # NWS Atlanta coverage area map
├── archive/                # Photo archive directory
│   └── WX4PTC*.jpg         # Station photos (1-8)
├── www/                    # Legacy redirect folder
│   └── index.html
└── wx4ptc/                 # Legacy redirect folder (DO NOT REMOVE)
    ├── index.html          # Redirect script
    └── ReadMe.md           # Explains external link preservation
```

### ⚠️ CRITICAL: Directory Structure Requirements

**The directory structure MUST remain similar to its existing layout. This is a hard requirement.**

**DO NOT**:
- ❌ Move HTML files into subdirectories (e.g., `pages/`, `src/`, `public/`)
- ❌ Create new directories for organization (e.g., `css/`, `js/`, `images/`)
- ❌ Rename existing directories (`archive/`, `www/`, `wx4ptc/`)
- ❌ Change file locations or create nested structures
- ❌ Move `style.css`, `footer.js`, or `header.js` from the root directory
- ❌ Reorganize image files into an `assets/` or `images/` folder

**WHY**: The flat directory structure is required for:
1. **External links** - Many external websites and references link directly to files at their current paths
2. **Legacy redirects** - The `wx4ptc/` and `www/` directories handle old URLs that are still in use
3. **Simplicity** - Static hosting and deployment depend on the current flat structure
4. **Relative paths** - All CSS, JavaScript, and HTML use relative paths based on the flat structure

### Important Notes

1. **DO NOT REMOVE** the `wx4ptc/` directory - it contains redirect scripts for external links that are referenced by NWS and other official sources
2. **DO NOT REMOVE** the `www/` directory - legacy redirect for old bookmarks
3. All HTML pages MUST remain in the root directory
4. All HTML pages share the same `style.css` stylesheet (root level)
5. **Component architecture**: Header loaded via `header.js`, Footer loaded via `footer.js`
6. All JavaScript files (`header.js`, `footer.js`, `scripts.js`) MUST remain in root directory
7. Images and assets MUST remain in the root directory (flat structure)

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
**Purpose**: Dedicated page for SKYWARN repeater information

**Navigation**:
- **Site-nav**: Links to other pages (back to index, dashboard, wx4ptc, nwsffclinks, about)
- **Page-nav**: Links to page sections (Linked Repeaters, Non-Linked Repeaters)

**Contains**:
- Complete linked repeater table (primary SKYWARN network)
- Non-linked repeaters table (local SKYWARN nets)
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
- ❌ Moving `style.css`, `footer.js`, `header.js`, or any `.html` files from root

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

**Files**: `linked-repeaters.json` or `nonlinked-repeaters.json`

Repeater tables are dynamically generated from JSON files. Edit the appropriate file:

**JSON Structure**:
```json
{
  "location": "Peachtree City",
  "frequency": "147.390+",
  "tone": "141.3 Hz",
  "tags": ["WX4PTC"],
  "description": "Wide coverage, generator backup",
  "url": "https://www.repeaterbook.com/repeaters/details.php?ID=12345"
}
```

**Steps**:
1. Open `linked-repeaters.json` or `nonlinked-repeaters.json`
2. Add new entry in alphabetical order by location
3. Follow JSON syntax rules:
   - Entries separated by commas
   - Last entry has NO trailing comma
   - All strings in double quotes
   - Tags array: `["Hub"]`, `["WX4PTC"]`, or `["Hub", "WX4PTC"]`
4. Validate JSON at [jsonlint.com](https://jsonlint.com/)
5. Verify frequency on RepeaterBook
6. Test on mobile (repeater tables are responsive)

**Important**: The HTML tables on `index.html` and `repeaters.html` are auto-generated from these JSON files via JavaScript. Do NOT edit the HTML tables directly.

**For detailed non-technical instructions**, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md) Task 1.

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

### 2026-01-02
- **MAJOR UPDATE**: Consolidated alerts.html into dashboard.html
  - Created unified spotter dashboard with HWO, activation status, and all alerts
  - Added Quick Maps section with 6 essential weather/situational awareness tools
  - HWO cached for 4 hours, alerts refresh every 5 minutes
  - Updated all navigation references from "Alerts" to "Dashboard"
  - Deleted alerts.html (functionality merged into dashboard.html)

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

**Last Updated**: 2025-12-05
**Maintained By**: Claude AI Assistant (based on codebase analysis)
**For Questions**: Contact Jack Parks (KQ4JP) <kq4jp@pm.me>
