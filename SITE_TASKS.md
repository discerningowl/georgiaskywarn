# Site tasks

Step-by-step recipes moved out of `CLAUDE.md` (they only matter when you do that task).

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
2. Update the `<title>` tag, and the `canonical`, `og:url` and JSON-LD URLs (no `.html`: `https://georgiaskywarn.com/newpage`). Add a `<loc>` for it to `sitemap.xml`
3. Add the new page to **both nav lists** in `js/components.js` `loadHeader()`:
   ```html
   <!-- Add to BOTH #desktopNav and #mobileNav blocks -->
   <a href="/newpage">New Page</a>
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
