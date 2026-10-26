# Georgia SKYWARN — developer changelog

Moved out of `CLAUDE.md` on 2026-10-25 so it is not loaded into every session. Newest first. The public changelog is `data/changelog.json`.

### 2026-10-26 — `ADMIN_GUIDE.md` rewritten for Cloudflare Pages (v1.6)

- The guide still described the Apache host: SFTP uploads to `public_html/`, a root `index.html` for `www`, "How Apache Maps URLs", and the georgiaskywarn.org nightly sync. Replaced "Server File Placement & Deployment" with "Publishing & Hosting (Cloudflare Pages)": merging to `main` publishes; every PR gets a `*.georgiaskywarn.pages.dev` preview; how to verify (`APP_VERSION` live vs pages.dev) and roll back (Revert PR, or Cloudflare → Deployments → Rollback); the address table (www → apex 301 rule, extensionless URLs, `/wx4ptc/` → `/wx4ptc`, `404.html`); `_redirects` rules (targets without `.html`, which loops); DNS, Namecheap/Cloudflare, null-mail records, who holds the logins.
- georgiaskywarn.org: as of today it has Cloudflare nameservers (Namecheap, expires 2027-04-12) but no DNS records and does not resolve. The guide says so and says not to treat it as a backup. What to do with the name is undecided. Jim Lynch (K4GVO) still controls the registration; it was not transferred to Jack, so the guide leaves the decision to him.
- Also updated: Prerequisites (Cloudflare access, not SFTP), the GitHub "your changes are live" step, the Local Testing note (the local server ignores `_redirects` and `404.html`), "Changes Not Showing After Merging", the contacts' roles, the file listing, and the version and dates.

### 2026-10-26 — `wx4ptc/` folder removed; `_redirects` does its job

- PR #101's `_redirects` was confirmed on the live site: `/wx4ptc/` and `/wx4ptc/index.html` each return one 301 to `/wx4ptc`. The `wx4ptc/` folder (a meta-refresh stub plus a ReadMe) was the old host's way to keep NWS's link working, so it is gone. `CLAUDE.md`, `README.md` and `ADMIN_GUIDE.md` now say to keep the `/wx4ptc/` rules in `_redirects` instead.
- `ADMIN_GUIDE.md`'s deployment sections (Apache, `public_html`, manual uploads, "How Apache Maps URLs") still describe the old host. They need rewriting for Cloudflare Pages; left for a separate pass.

### 2026-10-26 — 404 page, `_redirects`, and the old host's `www/` folder removed

- The site moved from Apache to Cloudflare Pages (DNS cut over the same day; `www` 301s to the apex via a Cloudflare redirect rule). With no `404.html`, Pages treated the site as a single-page app and answered every unknown URL with `index.html` and a 200. Added `404.html`: Pages now serves it, with a real 404, for any missing URL. It is a radar scope that finds no echo, in the site's header, footer and theme. `<base href="/">` keeps its links, stylesheet and scripts working at any depth (`/a/b/c`). `noindex`, and not in `sitemap.xml`. Styles are at the end of `css/style.css` (`.notfound-*`, `.radar-*`); the sweep and pings stop under `prefers-reduced-motion`. Known quirk: the footer's "last updated" `HEAD` request returns 404 here, logging one console error; the footer falls back to "recently".
- Added `_redirects`: `/wx4ptc/` and `/wx4ptc/index.html` 301 to `/wx4ptc`. The target has no `.html` on purpose: Pages answers `/wx4ptc.html` with a 308 back to `/wx4ptc`, so a rule to `/wx4ptc.html` would loop. NWS and other pages still link to the old `/wx4ptc/` URL and will not change it. The `wx4ptc/` folder stays until the rule is confirmed on a deploy.
- Removed `www/`. On the old host `www.georgiaskywarn.com` and `georgiaskywarn.com` were two separate document roots, and `www/index.html` was the redirect for one of them. Cloudflare does that with a rule now, and nothing links to `/www/`. `CLAUDE.md` no longer lists it as protected.
- `APP_VERSION` → `20261026` (stamps the new CSS).

### 2026-10-25 — 18px card titles and a visible table stripe, shared with the dashboard; repeater tags stay in their columns

- Jack wanted the two apps' cards and tables to look more alike: the site's card titles smaller, like the dashboard's, and the dashboard's tables rounded and striped, like the site's. The shared rules are in `../DESIGN.md` ("Cards, tabs, tables, fields and dialogs") and `../skeleton.css`; the dashboard side is a separate wx4ptc-transwx PR.
- **Card titles**: `.card-header h2` is a fixed 18px (`1.125rem`, was the fluid `--text-xl`: 24px on desktop, 20px on phones), and `.card-header` padding is `0.75rem 1.25rem` (was `1rem 1.5rem`). The bar is 47px (was 63px). That is the dashboard's card title and both apps' dialog title size. Gradients and colour modifiers are unchanged. `--text-xl` itself is unchanged, since `h3` uses it.
- **Headings inside cards** stay under the 18px title (Jack's call, same day): `.section-subheader` is 16px (`1rem`, was `1.25rem`). index.html's Quick Maps intro line is still an `h3`, now with a new `.card-intro` class (16px, with the `margin-bottom: 1.75rem` that was an inline style); it was the fluid `--text-xl`, 24px on desktop. `.changelog-month-header` (the coloured month titles on about.html and changelog.html) is 16px too (was `1.25rem`). No heading inside a card on any page is now larger than the card's title.
- **Table stripe**: new `--table-stripe` (`#f4f6f9` light, `#132133` dark) on `.repeater-table tbody tr:nth-child(even)`. The old 2% tint was close to invisible. The dashboard uses the same light value, with `#172a40` in dark, one step up from its `#132133` tables.
- **Fix, tags spilling into the next column**: `.tags-container` (Tags and Internet Access cells on repeaters.html and repeater-audit.html) was a fixed two-across grid, wider than those columns. At 1024px, pills in 8 of 52 rows overlapped the next column by up to 70px, and 3 still did at 1440px. It is now a wrapping flex row, and a pill wider than its whole column wraps its own text ("Amateur Wire VOIP" is 145px; the Internet Access column has 98px at 1024px; "Cherry Blossom Intertie" and "Hams Over IP" wrap too). That rule is `.repeater-table .tags-container > *` so it outranks the badge rule's `white-space: nowrap`, which comes later in the file. Measured every tag group on both pages at 375, 1024 and 1440px: no pill overflows its cell, and no pill's text overflows the pill.
- `APP_VERSION` → `20261025c`.

### 2026-10-25 — Repeater data no longer goes stale in the browser; "Repeater Linking"; Covington pair is `direct`

- **Stale data**: after #97 went live, Covington's popup still showed `rf` for the hub link: new heading, old data. The host (Apache) sends `Last-Modified` and `ETag` but no `Cache-Control` for `data/repeaters.json`, so browsers cache it for a guessed time (about 10% of the file's age, a day or two here). `scripts.js` is `?v=`-stamped and loaded fresh; the JSON is not. All three `repeaters.json` fetches in `js/scripts.js` (`fetchRepeaterData()`, `updateRepeaterValidationDate()`, and the export-date `HEAD`) now pass `cache: 'no-cache'`, so the browser checks with the server every load (a small 304 when unchanged). A data-only change now shows on the next load, with no version bump needed for it.
- That makes the `rflinks`/`iplinks` mapping in `fetchRepeaterData()` unnecessary, so it's gone.
- The detail modal's "Links to Other Repeaters" is now "Repeater Linking".
- `data/repeaters.json`: `WA4ASI-146.925` ↔ `WA4ASI-444.800` is `linkMethod: "direct"` both ways (was `"rf"`), per Jack. On the network map the 444.800+ is now Primary through its companion (was Secondary). `linksToLoc` still reads "Covington Fire Tower", a site George no longer has; fix it when the new site is confirmed.
- `APP_VERSION` → `20261025b`.

### 2026-10-25 — `rflinks` → `repeaterLinks`, `iplinks` → `userAccess`

- The old names said how a connection travels; the lists are really split by who is connecting. `rflinks` stopped being true once a repeater-to-repeater link went over AllStar (Covington, below). Renamed across all 59 records in `data/repeaters.json` (47 `repeaterLinks`, 13 `userAccess`); entries inside are unchanged, and the field order (16, 17) holds. See the schema table under "Adding a New Repeater" for the rule on which list a link belongs in.
- `js/scripts.js`: every reader uses the new names. `fetchRepeaterData()`, the one loader every page uses, maps `rflinks`/`iplinks` across when it gets a cached pre-rename `repeaters.json` (that file has no `?v=` stamp). Drop that shim after a release or two.
- Labels: the table columns are "Internet Access" and "Repeater Links" (were "Internet Links" and "Radio Links"); the detail modal's sections are "Connect from the Internet" and "Links to Other Repeaters". Column classes `col-ilinks`/`col-rlinks` → `col-access`/`col-replinks` in `repeaters.html` and `style.css`, widths unchanged.
- Docs: this file, README.md, ADMIN_GUIDE.md, and the Network Map blurb in `repeater-audit.html`. Older changelog entries keep the old names, since they describe what was true then.
- `APP_VERSION` → `20261025a`.

### 2026-10-25 — Covington 146.925- links to the hub over AllStar

- Per Robert's 2026-10-25 email: George (WA4ASI) lost the Covington fire tower site that held the radio link into the WX4PTC system. The new site has no UHF antenna and has intermod/desense problems, so the link is now an on-demand AllStar link, set up from either end.
- `data/repeaters.json` `WA4ASI-146.925`: the hub link (`W4PSZ` 444.600+) is `linkMethod: "allstar"` (was `"rf"`). The description no longer says "Links to 444.675+ WX4PTC backup hub" (stale since the 2026-09-23 hub fix). The AllStar entry in `iplinks` is spelled `"AllStar"` (was `"Allstar"`).
- `js/scripts.js`: no logic change, since `computeNetworkStatus()` already counts anything other than `"direct"` as one hop; comments updated. The detail modal's "Radio Linking" heading is now "Links to Other Repeaters".
- Still open: Robert isn't sure whether the 2m (146.925-) or 440 (444.800+) machine should be listed, so the AllStar hub link may belong on the other record. Also open: the new site's location, whether `WA4ASI-444.800` (and its full-time link to 146.925-) survived the move, and the node numbers. AllStarLink's stats (2026-10-25) show WA4ASI node 27457 registered as "146.925-/444.800+" and 29795, which we list, as 446.500, both on one server.
- `APP_VERSION` → `20261025`.

### 2026-10-23 — Header grid from 1220px

- The true-centre header grid starts at 1220px (was 1600px), where the title, nav and icons first fit on one row. The nav is exactly centred from about 1540px; below that the wider title side pulls it a little right (46px off at 1440px, where the flex row was 162px off). Measured every 20px from 1220 to 1600: no overflow, subtitle on one line, at least 16px between title and nav.
- `APP_VERSION` → `20261023g`.

### 2026-10-23 — Skip link, focus ring, back-to-top; tables, fields, dialogs, badge contrast

- **Skip link**: `components.js` puts "Skip to content" first in the page and gives `<main>` `id="main"` and `tabindex="-1"`, so Enter lands focus in the page. `.skip-link` is hidden until focused.
- **Focus ring**: `--focus-ring` is `2px solid var(--focus)` with a 2px offset; the new `--focus` is light `#1d6fd1`, dark `#6aa8f0` (it was a 75% mix of `--accent-blue`, 3px out). On `.header`, `.mobile-nav` and the page nav it is `#e2e8f0`. The map counties, search clear button, report cards and ☰ PAGE button use the same ring.
- **Fix**: `a:hover, a:focus-visible` set `outline: none`, which outranked the `:where()` ring, so no link on the site showed one. Removed.
- **Back to top**: a 48px solid `--brand-blue` circle (was 50px, 85% see-through with a blur), the same as the dashboard's.
- **Tables**: `.repeater-table th` uses `--table-head-bg` (`--brand-navy`) with semibold white text (was a blue from `--header-bg-th`, now removed); rows use `--table-line`.
- **Fields**: `--field-border` (light `#7b8794`, dark `#6f86a3`, 3.4:1+) on `.search-pill` and `.cwa-county-filter-input`; the pill shows the shared focus ring instead of a soft glow. The county filter is 36px.
- **Dialogs**: `.modal-header` padding `1rem 1.25rem`, titles 18px (`1.125rem`), `.modal-body` padding `1.25rem`; corners stay `--radius`.
- **Network badges**: text is `--badge-hue` darkened 35% (light) or lightened 25% (dark). The bare hue failed for most networks (WX4EMA 1.7:1, County Only 1.9:1 in light); every badge is now 4.9:1 or more.
- `APP_VERSION` → `20261023f`.

### 2026-10-23 — Nav links share the dashboard's size; menu accessibility

- **Size**: `#desktopNav a` and `.page-nav .nav-list a` are the size both apps now share: 36px tall, 15px semibold (`0.9375rem`, line-height 1.2), `0.5rem 0.875rem` padding, 8px corners. `.page-nav` links lost their resting tinted pill; the current section is still a solid `--brand-blue` fill. `#desktopNav` gap is `0.75rem` (was `1.5rem`).
- **Page nav bar** is 61px (60 + its 1px rule; was 79). The site-wide `li { margin-bottom: 0.8rem }` had added 13px under the links; `.page-nav .nav-list li` sets `margin: 0` above 768px.
- **Hover**: both navs use `--blue-300` (`#93c5fd`) text on the faint blue tint. `--blue-400` is 3.9:1 on the navy page nav.
- **Header, 769–1219px**: the nav takes its own centred row under the title and icons. With the narrower links it had fitted beside the title from 1100px and left the icons alone on a second row.
- **Accessibility**: `#mobileMenuBtn` has `aria-expanded` (kept in step on open, link click and outside click), `aria-controls="mobileNav"` and the label "Menu". `#desktopNav` and `#mobileNav` are labelled "Main" and "Main menu".
- **Phone ☰ PAGE button** is `--brand-blue` (its green gradient's light end was 3.3:1 under white).
- `APP_VERSION` → `20261023e`.

### 2026-10-23 — Button contrast, fonts and sizes

- **Contrast**: `.btn-red` fills with the new `--btn-red-bg` (`#c62828`, both themes): white on it is 5.6:1, where `--accent-red` gave 4.2:1 light and 2.8:1 dark. `.btn-green` and `.btn-orange` take black text (white was 1.9:1 and 2.2:1).
- **Colour meaning**: the RT Systems training video (repeaters.html) and View Archived Station Photos (wx4ptc.html) buttons are now `btn-blue`.
- **Fonts**: `button { font: inherit; }`, so the header icons, Back to top and the CHIRP/RT Systems download buttons use the page font, not Arial. `.nws-office-btn` sets `line-height: 1.3` to keep its height.
- **Size**: `#themeToggle` is a 44px square with the same hover tint as `.ncs-btn` (was 36px and grew on hover); its inline styles moved into `css/style.css`.

### 2026-10-23 — Net Control Dashboard button; repeater-validation.html → repeater-audit.html

- **Header** (`js/components.js`, `css/style.css`): a headset button (`.ncs-btn`) in `#desktopNav` and next to the mobile hamburger opens `#ncsModal`, which says the Net Control Dashboard is a restricted service for WX4PTC team members, then opens `NCS_DASHBOARD_URL` in a new tab. Cancel, ×, Esc and a backdrop click close it; focus goes to Continue on open and back to the button on close. The hamburger now sits inside `.header-mobile-actions` with the mobile headset. On phones narrower than ~400px, "Georgia SKYWARN" wraps to two lines to make room (`.logo-text` max-width is `calc(100vw - 220px)`, was `180px`).
- **Rename**: `repeater-validation.html` → `repeater-audit.html` (`git mv`), page title "Repeater Audit". Updated the `currentPage` gate in `js/scripts.js`, CSS comments, README, ADMIN_GUIDE and the reference sections above. Older changelog entries keep the old name. Nothing else links to the page, so there is no redirect.
- **Footer**: the faint "⋯" link in Connect is now a faint "Audit" link (same 0.4 opacity).
- **Fix**: `setActiveNavLink()` now adds `.html` to Cloudflare Pages' extensionless paths (`/repeaters`), the same as `UTILS.getCurrentPage()` and `loader.js`, so the active-page highlight works there.
- `APP_VERSION` → `20261023`.
- Verified on a local Python static server at 1280px (light) and 375px / 430px (dark): the modal opens from both buttons, Continue is `target="_blank"` to the dashboard, every close path works, the header stays on one row, the footer link renders, and repeater-audit.html loads its tables with no console errors.

### 2026-10-22 — Brand alignment with the net control dashboard; Auto / Dark / Light theme

#### Background
- Jack wants georgiaskywarn.com and the WX4PTC net control dashboard to read as one Georgia SKYWARN brand. The dashboard side shipped first (wx4ptc-transwx PR #183). Both now take their colours from the logo: its background `#0a2234` (`--brand-ink`) and its ring blue, darkened to `#0b5ed7` to carry white text (`--brand-blue`, `--link`). The ring colour itself (`#4484e4`) is only 3.7:1 on white, so it is never used for text. Spelling was already right (SKYWARN in capitals; "Bank 22: Skywarn" on `repeaters.html` is a literal radio bank name and stays).

#### `css/style.css`
- New "Brand core" block at the top of `:root`: `--brand-ink`, `--brand-blue`, `--link`, plus site-only `--brand-navy` (`#1a3a5c`, the dashboard's nav-bar navy). `--brand-blue-dark` sits next to `--accent-blue-dark` for hovers.
- **Header**: `.header` is opaque `--brand-ink` (was translucent slate `rgba(15,23,42,.95)` with a blur), so the logo has no visible square. `.logo-image` lost its tile background, padding and shadow. `.page-nav` and the mobile menu rows went from slate to `--brand-navy`; the mobile menu overlays use `--brand-ink`.
- **Blue**: `--accent-blue` is now `var(--link)` (light `#0b5ed7`, was `#0066cc`; dark `#60a5fa` unchanged) and is for text and borders only. Every blue **fill behind white text** moved to `--brand-blue`, which is the same in both themes: `.btn` / `.btn-blue`, `#desktopNav a.is-active`, `.page-nav .nav-list a.is-active`, `.site-banner`, `--header-gradient-blue` (blue card/modal headers), step badges, `.map-card-icon`, `.back-to-top`. In dark mode these were `#60a5fa` behind white text, 2.5:1; now 5.8:1. The old `rgba(0,102,204,…)` tints are `color-mix()` of `--brand-blue`.
- **Dark navy**: `--bg-body` dark `#0f172a` → `#0b1522` (the dashboard's dark page). `--card-bg`, `--nav-btn-bg` and `--bg-primary/secondary/tertiary` dark values moved from slate to the same navy family (`#0b1522` / `#132133` / `#1a2b40`).
- **The `@media (prefers-color-scheme: dark)` block is gone.** It only applied when the *device* was dark, so choosing Dark on a light-mode device left callouts, contact cards, table striping, the repeater search fill, the loading skeleton and the back-to-top button light. Each is now a `light-dark()` value on its own rule. Keep it that way: a dark-only override in a media query breaks forced Dark.
- New `.theme-toggle` icon rules: CSS shows the icon for the current setting from `data-theme` on `<html>` (none = Auto).

#### `js/components.js`
- Theme control is **Auto / Dark / Light** (was a two-way sun/moon toggle with no way back to following the device), with the dashboard's three icons: half-filled circle, moon, sun. Each click moves to the next. Auto removes `data-theme` and the saved key, so `color-scheme: light dark` follows the device live; the old `prefers-color-scheme` listener is removed. Dark/Light are saved under the **existing** `localStorage['theme']` key, so choices made before this change carry over. `core.js`'s version-change cache clearing only removes `ffc-`/`georgiaskywarn-` keys, so the theme survives version bumps. The label (aria-label and title) says the current setting and the next one; the mobile button reads "Theme: Auto/Dark/Light".
- `initializeTheme()` now only applies a saved Dark/Light (fallback for the head script below); it no longer writes `data-theme` from the device setting.

#### All nine HTML pages
- New inline `<script>` in `<head>`, just before the stylesheet, applies a saved Dark/Light before first paint. Before, the theme was applied by `components.js` at the end of the page, so anyone whose choice differed from their device saw the other theme flash on every load.
- Every page's CSP has `script-src 'self'`, which blocks inline scripts, so the script's hash is allowed: `script-src 'self' 'sha256-eeVXfdf7yPkDfRd1jtfsOW0DJLIGnyYfwI5V0q/A/Yk='`. **The script text must stay byte-identical on every page**; changing it means recomputing the hash (`printf '%s' '<script body>' | openssl dgst -sha256 -binary | base64`) and updating all nine CSPs. `www/` and `wx4ptc/` untouched.

#### Verification
- Local preview (Python static server) at 1280px and 375px, light and dark: Auto on a light and a dark device, the Auto → Dark → Light cycle (icons, labels, saved key), Light carried across pages, forced Dark on a light device (table striping, search fill, contact icons take their dark values), no CSP errors in the console. Contrast checked by hand: `--link` 5.5:1 on the light page and 7.2:1 on the dark page; white on `--brand-blue` 5.8:1; header text on `--brand-ink` 13.2:1, subtitle 6.3:1; page-nav pill text 9.9:1.
- Known, not changed: `--text-muted` (`#6b7280`) is 3.8:1 on the dark page (3.7:1 before). An empty "Alert Details" modal appeared in the preview tool's first screenshot after each load on this branch **and on `main`**; the modals reported `display: none`, so it looks like a capture artifact, but it's unconfirmed on real devices.
- Version bumped to `20261022`. Public `data/changelog.json` October 2026 entry gained an "Updated Colors and Theme Setting" item; `sitemap.xml` `lastmod` updated on all eight listed pages.

### 2026-10-12 — Alert type filter (Warnings / Watches / Advisories) on the dashboard

#### Background
- A visitor asked to filter Active Area Alerts by watches, warnings and advisories. Chose the lowest-chrome option: the existing "Warnings | Watches | Alerts" count row in the alerts status bar became the control (three toggle buttons) rather than adding a second row or a dropdown. The blue bucket is now labeled **Advisories** (was "Alerts"); it still contains every event that isn't a warning or watch (advisories, special weather statements, etc.), and the card tag on individual alerts still reads `ALERT` — unchanged on purpose.

#### `js/nws-api.js`
- `renderAllAlerts()` now filters in two stages: **county** → counts/severity → **type**. Counts and the card header color are computed from the county-filtered set *before* the type filter, so hiding a type never zeroes its own count and never makes the header look calmer than reality (hide Warnings while a Tornado Warning is active → header stays red). It returns `counts.shown` / `counts.total` in addition to the three type counts.
- New `getAlertType(event)` is the single classifier (`'warning'|'watch'|'advisory'`), replacing three copy-pasted `.includes('warning'/'watch')` chains. `ALERT_TYPES` holds the per-type metadata (key, count key, color class, labels).
- `updateAlertCountSummary()` builds the three buttons **once** and updates them in place — rebuilding them on every toggle would destroy keyboard focus. It also calls the new `updateAlertFilterNote()`.
- **Not persisted, on purpose.** `activeTypeFilter` is in-memory only (unlike the county filter, which uses `localStorage['county-filter']`). A spotter who hides Warnings and forgets must not come back mid-event to a page that silently omits them. Do not add persistence without addressing that.
- `#alert-filter-note` ("Hiding Watches and Advisories — showing 2 of 6 alerts. Show all") is visible whenever *any* type is off, even if nothing is currently hidden, because the next 5-minute refresh could bring in an alert of a hidden type. When the type filter hides everything, the empty state says how many alerts are hidden so "No active warnings" can't be read as all-clear.
- Toggle clicks call `refreshAlertView()`, which re-renders from cache, or falls back to `loadAlerts()` if the 5-minute cache expired so a click is never a silent no-op. "Show all" returns focus to the first toggle because the note hides itself.

#### `index.html` / `css/style.css`
- Static markup in `#alert-count-summary` matches what JS builds (no layout shift before the first fetch); the old " | " text separators are gone — the buttons are flex items with a gap. New `<p id="alert-filter-note" role="status" hidden>` sits above `#alerts-loading`.
- New `.alert-type-filter` / `.alert-type-toggle` / `.alert-filter-note` / `.alert-filter-reset` styles next to `.alert-status-text`. "Off" is signaled by a dashed border, struck-through label and dimmed triangle — never color alone.

#### Verification
- Headless Chromium against the local site with `api.weather.gov` mocked (6 alerts: 2 warnings, 1 watch, 3 advisories): initial state, mouse and keyboard (Enter/Space) toggling with focus retained, all-off and warnings-only states, county + type combinations, scoped empty-state message, header severity unchanged while a type is hidden, reset on reload, expired-cache fallback, 390px dark-mode layout (no horizontal overflow, tap targets ≥ 24px). Not tested against live NWS data.
- Version bumped to `20261012a`. Public `data/changelog.json` October 2026 entry gained a "Filter Alerts by Type" item.

### 2026-10-07 — `location` is now a `{ city, county, site? }` object (city/county hierarchy)

#### Background
- Jack uploaded the Georgia ARES ArcGIS repeater export (`Georgia Amateur Radio Infrastructure.xlsx`, 2,003 rows across 9 overlapping layers) as a supplementary source to add city + county to every repeater. `repeaters.json` stays the master; the spreadsheet was used only to fill and cross-check. Matching was by callsign + frequency (then frequency + county), and the sheet's lat/long was tested against Census county boundaries as an independent county check (3 sheet rows plot in the wrong county, so its coordinates were *not* imported).
- Result: 37 of 59 already agreed; 12 had a placeholder `location` ("Butts County", "Walton County", etc.) that the sheet filled with a real city; 5 used a landmark/community name where the sheet had a town. Frequency mismatches between the sheet and JSON were ignored by decision — the JSON is correct (e.g. WR4BC is 145.280 here, 145.130 in the sheet).

#### `data/repeaters.json` — schema change (all 59 records)
- `location` (string) → `location` (object): `{ "city": ..., "county": ..., "site": ... }`. `site` is optional and only present on 8 records: Biskey Mtn ×3 (city Jasper), Sawnee Mtn (city Cumming), Round Oak (city Gray), Pine Mountain (city Warm Springs), Cedar Grove (city Dublin), Sun City (city Griffin).
- The separate top-level `county` field was **removed** (folded into `location.county`) so there is one source of truth. Field order is otherwise unchanged; schema positions after the old #5 each shifted down by one (see the table below).
- 18 location values changed; every county value was carried over unchanged.
- **Follow-up same day (Jack's decisions on the leftovers):** `WB4GWA-145.390` → county **Pike** (city stays Concord; Concord proper is in Pike, which also overrides the spreadsheet's Griffin/Spalding main-layer row). `WB4ULJ-145.190` → city **Warm Springs**, county Meriwether, `site` **"Pine Mountain"** (the mountain area people refer to; the repeater itself is in Warm Springs) — this is the sixth `site` value. Two more followed in the next round (below). `K4DBN-145.490`, `KF4DGN-146.850`, `K4DBN-146.610` (not in the spreadsheet) carried over unchanged, no action needed. `KA3JIJ-145.310` stays Clermont (sheet said Gainesville) and `WC4RG-147.270` stays Monroe (sheet lists two Walton sites, Between and Monroe) — both intentionally left alone.

- **Third round (Jack's decisions):** `K4DBN-147.150` → city **Dublin**, `site` **"Cedar Grove"** so it still displays as "Cedar Grove (Dublin)". `W4SCP-443.600` → city **Griffin**, `site` **"Sun City"** (Sun City Peachtree's addresses are Griffin, GA 30223; county Spalding unchanged), displays as "Sun City (Griffin)". `WB4GWA 145.250` (in the spreadsheet, not in the JSON) intentionally **not** added — if it isn't in our JSON it isn't part of this project.
- **Array ordering rule changed:** `repeaters.json` is now sorted alphabetically by `location.city`, with repeaters tagged `WX4PTC System` (KK4GQ-145.210, W4PSZ-444.600, KN4YZ-444.675) first as their own alphabetical group. Ties within a city keep their prior relative order. The repeater tables render in file order, so this is also the on-page order.
- Public `data/changelog.json` entry added (October 2026) covering the restructure and the city/county/site cleanup.
- Stale docs refreshed: `ADMIN_GUIDE.md` rewritten for the current unified-JSON workflow, README repeater schema table completed, and `.claude/agents/website-coder.md` field list corrected.

#### `js/scripts.js` — every reader of `location` / `county` updated
- New helpers next to `tagToBadgeClass()`/`getValidationTier()` (same single-source-of-truth pattern): `formatLocation(r)` → `"Biskey Mtn (Jasper)"` or `"Jasper"`; `shortLocation(r)` → site if present else city (map labels and radio-memory names, where space is tight); `locationCounty(r)` → county string.
- Updated call sites: repeater table row + County column, repeater detail modal (title, Location row, new County row), CHIRP and RT Systems CSV name/comment builders (names keep the landmark, e.g. `KC4JNN Biskey Mtn`; comments carry the full `Biskey Mtn (Jasper)`), Network Map (flagged list, tooltip `labelFor()`, node labels), and the repeater-validation.html tables and audit modal title.
- The audit-modal data-quality check in repeater-validation.html "Missing county field" replaced with checks for a missing `location` object, `location.city`, and `location.county`.
- Repeater search (`repeaters.html`) filters the rendered table text, so it picks up the new city/site/county text automatically — searching "Jasper" or "Biskey" both find the KC4JNN records.
- Verified in a headless Chromium pass against a local server: repeaters.html (55 active rows) and repeater-validation.html (72 rows + Network Map) render with no `undefined`/`[object Object]`, both CSV exports generate correctly.

#### `scripts/verify_repeaters.py`
- `r.get("location", "")` now builds a `"City, County"` string when `location` is an object (used only for the issue report's Location column). Note `scripts/` is in `.gitignore`, so this edit isn't tracked by git.

#### Version
- Bumped to `20261007a`.

#### Follow-up same day: `repeaters.html` table column alignment + anchor naming
- Jack noticed the column balance was off in the repeater tables and different between the Linked and Non-Linked tables, and asked for consistent CSS and link naming.
- **Cause**: both `<table class="repeater-table">` elements used automatic table layout, so each sized its columns from its own rows (the Linked table's long Radio Links lists and multi-badge Tags vs. the Non-Linked table's mostly "—" cells). `repeater-validation.html`'s `.sources-table` already solved the same problem with a `<colgroup>` + `table-layout: fixed`; `repeaters.html` never got it.
- **Fix** (`css/style.css`, `repeaters.html`): new `.directory-table` modifier (added next to `.repeater-table` as `<table class="repeater-table directory-table">`) sets `table-layout: fixed` and `min-width: 900px` (the `.table-wrapper` scrolls horizontally on mobile). Both tables carry the same `<colgroup>` using `.col-location` 20% / `.col-freq` 13% / `.col-county` 10% / `.col-tags` 23% / `.col-ilinks` 14% / `.col-rlinks` 20%. **Any new repeater table that shares these headers must reuse this colgroup**, not rely on auto layout. Verified in headless Chromium at 1400px: all six `<th>` widths identical in both tables.
- **Anchor naming**: section IDs renamed to a matching pair, `#repeater-table` → `#linkedcard` and `#nonlinkcard` → `#nonlinkedcard` (the old `#repeater-table` also collided with the `.repeater-table` class name). Page-nav links updated. Legacy IDs are preserved as empty `<span id="repeater-table">` / `<span id="nonlinkcard">` anchors at the top of each section because external sites may deep-link to them — do not remove. tbody IDs (`linked-repeaters-tbody`, `nonlinked-repeaters-tbody`) were already consistent and unchanged.
- **Known nit**: at 13% the "Frequency & Tone" header wraps to two lines on desktop; widening `.col-freq` by 1% (taking it from `.col-tags`) would fix it.
- Public `data/changelog.json` October 2026 entry gained a "Repeater Table Column Alignment" item.
- Version bumped to `20261007b`.

### 2026-08-27 — Active-page indicator on the site nav

#### `js/components.js` / `css/style.css`
- Jack asked for the site nav (`#desktopNav` / mobile `.mobile-nav`, the Home/Spotters/Repeaters/WX4PTC/Resources/About row) to highlight whichever page the visitor is currently on, the same way `.page-nav`'s pills already highlight the in-page section currently in view (the T2.8 scroll-spy `.is-active` treatment from 2026-05-16).
- `js/components.js`: new `setActiveNavLink()`, called from `loadHeader()` right after the other post-insert init calls. Compares `window.location.pathname`'s last segment against each `#desktopNav`/`.mobile-nav` link's `href` and adds `.is-active` + `aria-current="page"` to the match (root path falls back to `index.html`).
- `css/style.css`: `#desktopNav a.is-active` fills solid with `var(--accent-blue)` / white text — the same "filled pill wins" idiom `.page-nav .nav-list a.is-active` already uses, just applied to the site nav's own rounded-rect link style instead of a pill. `.mobile-nav a.is-active` gets a tinted background plus a 4px left accent border (the same left-accent idiom `.section-subheader` uses) since the mobile menu's full-width rows don't read well as a filled block against the fixed-open-menu backdrop.
- Version bumped to `20260827a`.

### 2026-08-16 — Spotter Activation infographic (wx4ptc.html)

#### New reusable component: `.activation-flow`
- Jack asked to redesign `wx4ptc.html`'s "Spotter Activation" section as an infographic rather than a 2×2 `.sub-cards` grid, since the four items (HWO → Coordinator Notification → Severe Weather Trigger → Station Staffing) are a strict sequence, not an unordered set — the grid was hiding that. Reviewed a mockup first (icon-circle + numbered-badge steps connected by a line, escalating blue → indigo → orange → red to imply rising urgency) before building it into the site.
- Added `.activation-flow` / `.activation-step` / `.step-icon` to `css/style.css` (inserted after the `.sub-card` block, before `.section-subheader`). Container-query driven like `.sub-cards` (`@container cardbody`, not a viewport media query) so it responds to the card's actual width. Default: single column, vertical left-rail connecting line, icon+text laid out side-by-side. At `≥640px` container width: horizontal row (`--flow-count` custom property sets column count, default 4), centered text under each icon, horizontal connecting line. A CSS `counter` (`activation-step`) drives the numbered badge on each icon — no manual numbering in the markup.
- `.activation-flow--escalate` modifier: sets each step's `--step-color` via `:nth-child` (blue/indigo/orange/red) and the connecting line to a matching gradient. Used only on Spotter Activation, to visually communicate escalation from routine outlook to net actually staffed.
- Applied `.activation-flow` (without `--escalate`, flat blue) to the existing "Activation Flow" section too, once the pattern existed — that section was already a numbered `<ol>` describing the same kind of strict sequence (statement issued → team activated → net operating → reports submitted), so it got the same treatment for visual consistency between the two back-to-back sections. Content unchanged, just restyled with icons (📢/🤝/🎙️/📨) and shortened heading labels (previously unheaded list items).
- **Left unchanged, on purpose**: "Net Operations" and "Station Overview" sections stay `.sub-cards` — their items are genuinely parallel/unordered facts, not a sequence, so the grid is still the right component there.
- Verified in a local Playwright screenshot pass (both the ≥640px horizontal layout and the <640px vertical-rail layout) before committing, since this is a new CSS component rather than a copy-paste of an existing one.
- Version bumped to `20260816a`.

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

#### Third follow-up same day: hid the RepeaterBook link row in the public repeater detail modal
- Jack asked to hide the "RepeaterBook: View on RepeaterBook →" row from the public repeater detail modal (`repeaters.html`, click any repeater row), while leaving the underlying `refurl` field and value untouched in `data/repeaters.json`.
- `js/scripts.js`: `openRepeaterModal()` — removed the `<div class="detail-label">RepeaterBook:</div>` / `<div class="detail-value">...View on RepeaterBook →</a></div>` row from the "Basic Information" detail grid template literal (was directly below "Tone:"). No other detail rows changed; `repeater.refurl` is simply no longer read in this function.
- **Left unchanged, on purpose**: `data/repeaters.json`'s `refurl` field (name and values) — data stays in the file. The `RepeaterBook →` reference links on `repeater-validation.html`'s Inactive/Not-Validated admin tables (`js/scripts.js` lines ~1109, ~1129) still use `r.refurl` and still render — those are on the internal noindex dashboard, not the public modal, and weren't part of this ask.
- Version bumped to `20260804d`.

#### Fourth follow-up same day: multi-source `validation` object replaces the `verified` boolean
- Jack pointed out the single `verified` boolean overstated things — in reality the site's data quality rests on three separate, independently-confirmed sources (repeater owners directly, RepeaterBook comparison, and club website/roster confirmation), and asked for that to actually be captured in the schema rather than collapsed into one flag.
- **Schema change** (`data/repeaters.json`, all 59 entries): field #11 `verified` (boolean) → `validation` (object): `{ "repeaterbook": bool, "owner": bool, "club": bool }`. Migrated programmatically (Python, preserving field order and 2-space formatting) rather than by hand — every entry's old `verified` value became `validation.repeaterbook`; `owner` and `club` start `false` for all 59 records since neither has ever been tracked before now and both require manual confirmation (no existing process to backfill them from).
- **`scripts/verify_repeaters.py`**: this script only ever automates the RepeaterBook comparison, so it was updated to read/write `validation.repeaterbook` exclusively — it has no way to confirm `owner` or `club` and must never touch them. `apply_fixes()` gained support for one level of dotted-path fixes (e.g. `"validation.repeaterbook"`) so it can flip a nested field without disturbing the sibling `owner`/`club` flags. `compare()`'s "Verified flag" section, the markdown report's field-name column, and all `--help`/docstring text updated to match.
- **`js/scripts.js`**: new shared helper `getValidationTier(repeater)` (added right after `tagToBadgeClass()`, same "single source of truth" pattern) reduces the three booleans to a tier: **Fully Validated** (all 3 true, blue), **Partially Validated** (1-2 true, yellow), **Not Validated** (0 true, red). `openRepeaterModal()`'s badge now calls this helper instead of checking a flat `repeater.verified`. `repeater-validation.html`'s dashboard render function (`renderAdminPage()`) was rewired the same way: `fullyValidated`/`partiallyValidated`/`unverified` (kept this variable name since it still feeds the existing `unverified-*` ids) replace the old `verified`/`unverified` filters, all now driven by `getValidationTier()` counts instead of a flat boolean check.
- **`repeater-validation.html`**: added a third stat card, "Partially Validated" (new `id="stat-partial"`), between the existing "Fully Validated" (`stat-verified`, relabeled) and "Not Validated" (`stat-unverified`) cards. The Not Validated section's intro prose rewritten to explain the three-source model and clarify that a repeater only lands in that table if **none** of the three are confirmed — a repeater with e.g. only `owner: true` now shows as "Partially Validated" in the summary stats, not in the Not Validated table, which is a real behavior change from the single-boolean version (previously anything with `verified: false` — which was really just "not RepeaterBook-confirmed" — landed in that table).
- **`CLAUDE.md`**: schema table field #11 rewritten with a sub-table describing all three sources and how each is confirmed (automated vs. manual); "Validating Repeater Data" section's "Validation Source" (singular, RepeaterBook-only) rewritten to "Validation Sources" (plural, three-way) with the same source/key/process table and the tiering rule, plus an explicit note that RepeaterBook is one input among three, not an authority the whole object defers to.
- **Left unchanged, on purpose**: `refurl` (still the RepeaterBook reference link, unaffected by this — it's a citation URL, not a validation flag) and every RepeaterBook system-membership URL/process in the rest of the "Validating Repeater Data" section (those describe the `repeaterbook` sub-source specifically, not the whole object).
- Version bumped to `20260804e`.

#### Fifth follow-up same day: bulk-populated `validation.owner` and `validation.club` from existing data + a screenshot
- Jack provided a screenshot of a folder/list view (location+frequency names, some combined for RF-linked pairs/trios) representing repeaters he's personally confirmed with owners, and gave three rules to apply against all 59 records:
  1. Any repeater tagged `WX4PTC System`, `SE Linked Repeater`, `Peach State Intertie`, `Cherry Blossom Intertie`, or `WX4EMA` → `validation.owner: true` (36 records newly flipped).
  2. Any repeater matching an entry in the screenshot by location + frequency → `validation.owner: true` (7 additional records not already covered by rule 1: Clermont `KA3JIJ-145.310`, Commerce `KF4DGN-146.850`, Covington `WA4ASI-146.925`, Lookout Mountain `W4GTA-145.350`, Sawnee Mtn `WB4GQX-441.900` — screenshot listed this as "Cumming 441.900," Cumming being the coverage-area text in the description, not the `location` field — Warm Springs `KN4FE-146.985`, Woodbury `WB4GWA-443.800`).
  3. Any repeater with a non-null `clubName` → `validation.club: true` (50 records newly flipped).
- Applied programmatically (Python, same in-place-mutate-and-redump approach as the schema migration) rather than by hand, to avoid transcription errors across 59 records.
- **Two screenshot entries flagged, not guessed on**: "Griffin 147.390" had no match in `data/repeaters.json` — Griffin's actual repeater is `K4HYB-146.910`, and `147.390` belongs to Thomaston (`W4OHH-147.390`) — left `K4HYB-146.910`'s `owner` untouched (still `false`) rather than assume a typo; Jack should confirm what this entry was meant to reference. "Concord 145.250" doesn't match `WB4GWA-145.390` (Concord) — likely a screenshot transcription of 145.390, and moot either way since that record already gets `owner: true` via the tag rule (carries `SE Linked Repeater`).
- Net effect: every repeater now has `validation.owner: true` (either via tag or direct screenshot confirmation) except `K4HYB-146.910` (Griffin) and a handful of others not tagged with a qualifying network and not in the screenshot (e.g. `WR4BC-145.280`, `WX4BCA-147.285`, `W4FWD-146.640`, `KG4VUB-145.270`, `WX4NN-443.075`, `K4NRC-145.130`, `W8JI-147.225`, `WX4PCA-146.955`, `WC4RG-147.270`, `WC4RG-442.050`, `WM4B-146.670`, `WM4B-443.150`, `K4GAR-146.910`, `N4BZJ-147.135`, `WA4ASI-444.800`).
- Version bumped to `20260804f`.

#### Sixth follow-up same day: split the middle tier into "Validated" (2/3) and "Partially Validated" (1/3)
- Jack asked for a 4-way tier instead of 3: 0 confirmed = Not Validated, 1 confirmed = Partially Validated, 2 confirmed = Validated, 3 confirmed = Fully Validated (previously 1-2 confirmed was collapsed into a single "Partially Validated" bucket).
- `js/scripts.js`: `getValidationTier()` now has four branches instead of three — added the `count === 2` case returning `{ label: 'Validated', colorVar: 'var(--accent-green)' }`, sitting between `count === 3` (Fully Validated, blue) and `count === 1` (Partially Validated, yellow, unchanged). `renderAdminPage()` gained a new `validated` bucket (`count === 2`) alongside the existing `fullyValidated`/`partiallyValidated`/`unverified` (renamed `partiallyValidated`'s filter from `count > 0 && count < 3` to exactly `count === 1` now that 2 has its own bucket) and wires it to a new `set('stat-validated', ...)` call.
- `repeater-validation.html`: added a fourth stat card, "Validated" (`id="stat-validated"`, green), between "Fully Validated" (`stat-verified`, recolored from green to blue to match `getValidationTier()`'s blue-for-3 convention) and "Partially Validated" (`stat-partial`, yellow, unchanged). Not Validated section's prose updated to name all three non-zero tiers ("Partially Validated," "Validated," or "Fully Validated") instead of just one, since the "at least one source confirmed" rule for exclusion from that table is unchanged but now maps to three possible labels instead of one.
- **Left unchanged, on purpose**: the "Not Validated" table's underlying rule (`count === 0`) — this tier split only affects the three non-zero buckets, not what counts as needing staff attention.
- Version bumped to `20260804g`.

#### Seventh follow-up same day: added a per-repeater "Validation Sources" table
- Jack asked for a new card near the top of `repeater-validation.html` listing every repeater with a check/x per source, rather than only the aggregate tier counts in the Summary stats.
- `repeater-validation.html`: new `<section class="card" id="sources-card">` inserted between Summary Stats and Inactive Repeaters (and in the page-nav as "Sources"). Table columns: Location/Callsign, Frequency/Tone, Owner, RepeaterBook, Club — one row per repeater (all 59, unfiltered), each source column showing a green ✓ or red ✗.
- `js/scripts.js`: `renderAdminPage()` gained a `sourceCell(isConfirmed)` helper (green ✓/red ✗ span) and a render block populating `#sources-repeaters-tbody` from the full `all` array — placed right after `adminRow()`, ahead of the existing Inactive/Not-Validated/etc. table renders. Rows use the same `.repeater-row` / `data-repeater-id` pattern as every other table on this page, so clicking a row opens the standard detail modal — no extra wiring needed since `setupRepeaterModalHandlers()` already runs after `renderAdminPage()` resolves and re-queries `.repeater-row` fresh each load.
- Version bumped to `20260804h`.

#### Eighth follow-up same day: removed the empty "Not Validated Repeaters" section, grouped Validation Sources by tier
- With every repeater now having at least one confirmed source (see the fifth follow-up above), the "Not Validated Repeaters" section always showed 0 rows — Jack asked to remove it, and to group the new Validation Sources table (seventh follow-up) by tier instead of listing all 59 repeaters flat.
- `repeater-validation.html`: removed the entire `#unverified-card` section and its page-nav entry. `#sources-card` restructured from one 59-row table into four, each preceded by a `.section-subheader` label (the site's standard in-card group-label component) and its own count span: "Not Validated" (`#sources-none-count`/`#sources-none-tbody`), "Partially Validated" (`#sources-partial-*`), "Validated" (`#sources-validated-*`), "Fully Validated" (`#sources-fully-*`). Ordered worst-to-best to keep the same "issues first" convention as the rest of the dashboard.
- `js/scripts.js`: extracted the old flat-table renderer into two reusable helpers — `sourceRow(r)` (single row) and `renderSourceGroup(tbodyId, countId, list)` (fills a tbody + count span from a filtered array, shows "None." when empty) — called once per tier using the same `unverified`/`partiallyValidated`/`validated`/`fullyValidated` arrays already computed for the Summary stats. Removed the old `unverified-count`/`unverified-repeaters-tbody` render block entirely (used `adminRow()`, now dead in that spot but `adminRow()` itself is still used by the Unknown Callsigns and Missing Club tables).
- **Left unchanged, on purpose**: the "Not Validated" stat card in the Summary section (`#stat-unverified`) — still useful as a live 0 count confirming nothing has silently regressed, even with the standalone section gone.
- Version bumped to `20260804i`.

#### Ninth follow-up same day: removed the RepeaterBook reference link from the Inactive Repeaters table
- Jack asked to drop the "Reference" column (the `RepeaterBook →` link) from `repeater-validation.html`'s Inactive Repeaters table specifically.
- `repeater-validation.html`: removed the `<th>Reference</th>` header and dropped the loading-row `colspan` from 5 to 4.
- `js/scripts.js`: `renderAdminPage()`'s inactive-table renderer — removed the `<td class="center"><a ...>RepeaterBook →</a></td>` cell and updated the empty-state `colspan` from 5 to 4.
- **Left unchanged, on purpose**: the RepeaterBook reference links on the Unknown Callsigns and Missing Club tables (`adminRow()`, still used by both) — this ask was specific to Inactive Repeaters only.
- Version bumped to `20260804j`.

#### Tenth follow-up same day: removed the RepeaterBook reference link from Missing Club Info
- Jack asked to also drop the "Reference" column from `repeater-validation.html`'s Missing Club Info table (the ninth follow-up above already removed it from Inactive Repeaters). Unlike Inactive Repeaters, Missing Club Info shares its row-rendering helper (`adminRow()`) with the Unknown Callsigns table, which was NOT part of this ask — needed a way to omit the column for one caller without affecting the other.
- `js/scripts.js`: `adminRow(r, col3Label)` gained a third parameter, `showRef = true`, that conditionally includes the trailing `<td>...RepeaterBook →</a></td>` cell. Missing Club Info's call site changed to `adminRow(r, undefined, false)`; Unknown Callsigns' call site (`adminRow(r)`) is untouched and still gets the link, defaulting to `true`.
- `repeater-validation.html`: removed the `<th>Reference</th>` header from the Missing Club Info table and dropped its loading/empty-state `colspan` from 5 to 4.
- **Left unchanged, on purpose**: the Missing Club Info intro prose ("Check RepeaterBook or contact the trustee...") — that's guidance text, not a data reference link, so it wasn't part of this ask. Unknown Callsigns keeps its RepeaterBook link since Jack only asked about Missing Club Info this time.
- Version bumped to `20260804k`.

#### Eleventh follow-up same day: attribution text now names the three validation sources
- Jack asked for the public attribution block on `repeaters.html` (added in the first round above) to explicitly reference the three-source validation model documented in CLAUDE.md's "Validating Repeater Data" section, rather than only mentioning RepeaterBook comparison.
- `repeaters.html`: `#repeaterbook-attribution` reworded — "Selected records are periodically compared with RepeaterBook" → "Each repeater is validated against up to three independent sources — direct confirmation from the repeater owner, comparison with RepeaterBook, and confirmation from the sponsoring club — rather than relying on any single source." The bolded opening/closing sentences and the CSV-export section's separate attribution line were left unchanged.
- HTML-only change (no JS touched), so no version bump — consistent with prior HTML-only attribution edits this session.

#### Twelfth follow-up same day: dropped the "RepeaterBook detail links are provided for reference" sentence
- Jack pointed out `repeaters.html` no longer links out to RepeaterBook anywhere (the modal's "View on RepeaterBook →" row was removed in the third follow-up above, and the public repeater table/search results never linked to it either — confirmed via grep that the only remaining `RepeaterBook →` link in `js/scripts.js` lives in `repeater-validation.html`'s internal admin tables), so the attribution sentence claiming those links exist was stale.
- `repeaters.html`: removed "RepeaterBook detail links are provided for reference." from `#repeaterbook-attribution`. The three-source validation sentence and the CSV-export sentence are unchanged.
- HTML-only change, no version bump.

#### Thirteenth follow-up same day: added a public changelog.html entry for the validation overhaul
- Jack asked for the site's public changelog (`data/changelog.json`, rendered on `changelog.html`/`about.html` via `js/changelog.js`) to reflect this session's work — previously only `CLAUDE.md`'s internal dev log had it.
- `data/changelog.json`: new `"August" 2026-08-04` entry (first of the month, inserted at the top per newest-first ordering) with two items: "Multi-Source Repeater Validation" (the `validation` object schema, four-tier badge, and the Sources dashboard) and "RepeaterBook Attribution" (the public attribution text). Written in the site's existing user-facing tone, not internal implementation detail.
- No version bump — `data/changelog.json` isn't part of the `?v=` cache-busting scheme (that only applies to JS files); `js/changelog.js` itself wasn't touched.
- No new year container needed on `changelog.html` since 2026's `#y2026` div already exists (see "Adding a Changelog Year" — only required for the first entry of a new year).

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

## Old "Last Updated" summary (was at the end of `CLAUDE.md`)

**Last Updated**: 2026-10-07 (repeaters.html Linked/Non-Linked tables now share a fixed-layout colgroup via `.directory-table`, section anchors renamed to `#linkedcard`/`#nonlinkedcard` with legacy anchors kept; repeaters.json `location` converted from a string to a `{ city, county, site? }` object and the top-level `county` field folded into it — all consumers in js/scripts.js and scripts/verify_repeaters.py updated; 2026-09-23 (same-day follow-up — corrected 5 repeaters (`W4DOC-146.820`, `WA4ASI-146.925`, `WD4LUQ-146.895`, `WD4LUQ-224.880`, `WB4GQX-441.900`) whose on-demand `rflinks` pointed at the Tyrone backup repeater (`KN4YZ-444.675`) instead of the actual WX4PTC hub (`W4PSZ-444.600`), per Jack's confirmation and the Peach State Intertie's own published diagram (peachstateintertie.com/diagram.html); deduplicated 3 of those records that already carried a separate, correct `W4PSZ-444.600` link alongside the wrong one; `KN4YZ-444.675` (Tyrone) itself is unchanged and still on-air as a backup/net-control repeater — it's simply no longer modeled as a second hub root in `computeNetworkStatus()`/`renderNetworkMap()`, so it now renders as a normal Primary-tier node reached via its own existing link to the hub; updated the Network Map's JSDoc, hub-seed filters, single-hub anchor placement, and the repeater-validation.html callout text to match; version bumped to 20260923a; full repeater-linking data review — audited every `rflinks` edge against the actual WX4PTC hub topology and corrected multiple missing/incorrect links: Jasper’s NW Georgia chain (Lookout Mtn, Commerce, Clermont), Biskey Mtn’s RF link into the hub’s own 220MHz linking radio plus its tri-band companions, Peach State Intertie’s real structure (Thomaston → Irwinton `K4DBN-443.275` as PSI’s own sub-hub, not a flat fan off Thomaston — all 12+ PSI leaf spokes re-pointed to Irwinton), Irwinton’s own tri-band companions (147.240/444.925), WM4B (Warner Robins) linked into PSI via a dedicated MAXTRAC radio, and Cherry Blossom Intertie bridged into PSI via Irwinton’s 147.240 companion frequency (superseding an earlier plan to add a schema-exception record for an unlisted `KI4KHO-147.315`); fixed a pre-existing `WA4ASI-444.800` rflink offset-sign bug and a self-inflicted duplicate `AA4RI↔WB4JOE` rflink; added a new **Network Map** card to repeater-validation.html — `computeNetworkStatus()` in scripts.js derives Tier (hop-distance from the hub, 0-1 BFS so same-site companion links cost 0 hops) and Role (Relay/Spoke, by in-degree) live from `rflinks`, and `renderNetworkMap()` draws it as an SVG with a "needs a link" panel for any tagged/linked repeater the graph can’t reach (should stay empty — a hit there means a missing rflinks edge, not a misclassification); the `linked:true` flag itself was never touched — every fix added the missing edge that explains it, none reclassified a repeater; version bumped to 20260923; site nav now shows an active-page highlight — #desktopNav/.mobile-nav links get .is-active + aria-current="page" via setActiveNavLink() in components.js, styled to match the existing .page-nav scroll-spy pill treatment; 2026-08-16 (wx4ptc.html's Spotter Activation and Activation Flow sections redesigned as a numbered infographic — new reusable `.activation-flow` component, container-query responsive, escalating blue→red color on Spotter Activation only; 2026-07-08 — repeater-health.html renamed to repeater-validation.html to match its actual quarterly data-validation use; footer Connect-column link moved in from footer-bottom, replacing rather than duplicating the old "..." entry point; 2026-07-01 — County data integrity overhaul — all 6 data/*-counties.json files rebuilt keyed by county name instead of GAC code, after discovering ffc-counties.json had systematically wrong GAC codes for 68 of 96 counties, causing a "Floyd" filter to silently return Fayette County's alerts; each county now stores gac, same, and gaz (forecast zone, array — not FIPS-derivable) codes, sourced from live NWS lookups; nws-api.js's county filter gained a fourth match layer using real per-county GAZ codes and dropped the old FIPS-arithmetic gacToSameCode() helper; cwa-map.js updated for the new schema; same-day follow-up closed all 5 remaining gaz gaps — Colquitt/Cook/Quitman/Thomas (TAE) confirmed live via forecast.weather.gov MapClick zone pages, Bryan/Liberty/McIntosh CHS coastal-inland split zones confirmed via NWS Charleston's 2026 rezoning notice — all 159 counties now have complete gac/same/gaz data with zero gaps; 2026-06-30 — Standard search-pill component rolled out to repeaters.html, index.html, and about.html, replacing three inconsistent search boxes with one shared icon/clear/error pill; county search bar spacing fix; callout h4 centered; Repeater table header theming fix — .repeater-table th switched from a gradient (rejected on visual grounds) to a flat solid color, still light-dark()-aware via color-mix derived from the card-header token; Dead CSS sweep — 15 abandoned rules removed via automated cross-reference, print stylesheet's broken .nav-toggle selector fixed, .section-subheader dark-mode color-mix fix; Established site-wide subheader standard — .section-subheader now used everywhere instead of inline-styled one-off h3/h4 group labels; Established site-wide card-header color standard — default dark navy for informational cards, color reserved for functional use; about.html and repeaters.html reverted from card-header--blue to default; nwsffclinks.html documentation corrected to match actual plain-default headers; County filter now also matches areaDesc text as a third fallback layer, since geocode.SAME isn't reliably populated for non-EAS advisory products; County filter partial-match bug fixed — typing an incomplete county name no longer silently clears the active filter; second review pass fixes — repeaters.json id typo, statusNote schema doc, cwa-map.js null-guard, duplicate footer link removed; County alert filter bug fix — zone-geocoded advisories/watches now match via geocode.SAME, not just geocode.UGC; code review fixes — loader.js cache-busting bug, dead weather-station code removed, badge-class mapping consolidated, repeaters.json schema docs corrected; about.html Service Area/Contacts reorder + unified blue card banners; dedicated changelog.html history page replacing the archived-updates modal; about.html now shows a fixed 6-entry recent count; CWA county modal system; Georgia county search bar; forecast area layout restructure — map on top, 3-col office grid below; legend removed; map scaling fix)
