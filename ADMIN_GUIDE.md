# Georgia SKYWARN Website - Administrator's Guide

**Quick Start Guide for Website Administrators**

**Version**: 1.6
**Last Updated**: October 26, 2026
**Maintained By**: Georgia SKYWARN Website Team
- Jim Lynch (K4GVO) - Site Administrator
- Robert Burton (KD4YDC) - Content Moderator & SKYWARN EC
- Jack Parks (KQ4JP) - Website Administrator

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Who This Guide Is For](#who-this-guide-is-for)
3. [Prerequisites & Access](#prerequisites--access)
4. [Understanding the Website Structure](#understanding-the-website-structure)
5. [Getting Started with GitHub](#getting-started-with-github)
6. [Common Administrative Tasks](#common-administrative-tasks)
7. [Publishing & Hosting (Cloudflare Pages)](#publishing--hosting-cloudflare-pages)
8. [Testing Your Changes](#testing-your-changes)
9. [Troubleshooting](#troubleshooting)
10. [Getting Help](#getting-help)

---

## Introduction

This guide will walk you through common website maintenance tasks for the Georgia SKYWARN website. You don't need to be a programmer to maintain this site, but you'll need to understand a few basic concepts about files, folders, and version control.

### What This Guide Covers

- ✅ How to update repeater information
- ✅ How to update contact information
- ✅ How to add new pages or sections
- ✅ How to use GitHub (even if you've never used it before)
- ✅ How to test your changes before they go live
- ✅ Common problems and how to fix them

### What This Guide Does NOT Cover

This guide focuses on non-technical administration. For additional documentation:

- **[README.md](README.md)** - Project overview, features, and production status
- **[CLAUDE.md](CLAUDE.md)** - Comprehensive technical documentation including:
  - Complete file structure and architecture
  - CSS/JavaScript patterns and conventions
  - Development workflow and testing
  - Detailed API integration information
  - Advanced troubleshooting

**When to use each guide**:
- **ADMIN_GUIDE.md** (this guide) - For routine website updates and maintenance
- **CLAUDE.md** - For technical development, architecture questions, or AI-assisted coding
- **README.md** - For project overview, deployment information, and general features

---

## Who This Guide Is For

This guide is designed for:

- **New webmasters** taking over site maintenance
- **SKYWARN coordinators** who need to update repeater information
- **NWS liaison officers** who need to update contact information
- **Anyone with basic computer skills** who can edit text files

**You do NOT need to know:**
- Programming languages
- Web design
- Command-line interfaces
- Advanced Git operations

---

## Prerequisites & Access

Before you can make changes to the website, you'll need:

### 1. GitHub Account

- Create a free account at [github.com](https://github.com)
- Request access to the `discerningowl/georgiaskywarn` repository from the current webmaster
- You'll receive an invitation email - click "Accept invitation"

### 2. Text Editor

You'll need a program to edit HTML files. Good free options:

- **Windows**: [Notepad++](https://notepad-plus-plus.org/) or [VS Code](https://code.visualstudio.com/)
- **Mac**: [TextEdit](https://support.apple.com/guide/textedit/) (built-in) or [VS Code](https://code.visualstudio.com/)
- **Linux**: gedit, nano, or [VS Code](https://code.visualstudio.com/)

**Important**: Do NOT use Microsoft Word, LibreOffice Writer, or other word processors. These will corrupt the HTML files.

### 3. Modern Web Browser

- Chrome, Firefox, Safari, or Edge (updated to the latest version)
- Used for testing your changes

### 4. Cloudflare access (only for domain and hosting tasks)

- Publishing the site needs only GitHub: merging a pull request publishes it
- Cloudflare is where the domain, DNS records and redirects are managed. You only need it for those jobs, and the Website Administrator (Jack Parks, KQ4JP) holds the login
- Never share account passwords. Ask Jack to make the change, or to add you to the account

---

## Understanding the Website Structure

### File Organization

The Georgia SKYWARN website keeps every **HTML page in the main folder** (the "root"), while styles, scripts, data, and images live in four named folders (`css/`, `js/`, `data/`, `assets/`). This layout is intentional and **MUST NOT be changed**.

```
georgiaskywarn/
├── index.html              ← Main page / spotter dashboard with HWO and all alerts
├── repeaters.html          ← Repeater directory page (displays data from JSON)
├── nwsffclinks.html        ← NWS links and resources page
├── wx4ptc.html             ← WX4PTC station information page
├── about.html              ← About the site page
├── photoarchive.html       ← Historical photos page
├── spotters.html           ← Spotter resources and training
├── changelog.html          ← Full website changelog history (linked from the About page)
├── repeater-audit.html ← Internal quarterly repeater-data review dashboard (hidden from search engines)
├── sitemap.xml             ← Site map for search engines
├── robots.txt              ← Search engine directives
├── css/                    ← Stylesheets
│   └── style.css           ← Stylesheet (colors, layout, design)
├── js/                     ← JavaScript files
│   ├── version.js          ← Version number for cache busting
│   ├── loader.js           ← Dynamic script loader
│   ├── core.js             ← Core utilities
│   ├── components.js       ← Header and footer components
│   ├── scripts.js          ← Page-specific JavaScript (alerts, repeater search)
│   ├── nws-api.js          ← NWS API integration and HWO
│   ├── changelog.js        ← Changelog display
│   └── cwa-map.js          ← Interactive NWS CWA map (about.html only)
├── data/                   ← Data files
│   ├── repeaters.json      ← **YOU EDIT THIS** - All repeater data (linked + non-linked)
│   ├── changelog.json      ← Website changelog/updates
│   ├── ffc-counties.json   ← NWS Atlanta (FFC) county list (96 counties)
│   ├── gsp-counties.json   ← NWS Greenville-Spartanburg (GSP) counties
│   ├── cae-counties.json   ← NWS Columbia (CAE) counties
│   ├── chs-counties.json   ← NWS Charleston (CHS) counties
│   ├── jax-counties.json   ← NWS Jacksonville (JAX) counties
│   └── tae-counties.json   ← NWS Tallahassee (TAE) counties
├── assets/                 ← Static assets
│   ├── favicon.ico         ← Browser tab icon
│   ├── georgiaskywarnlogo.png  ← Site logo
│   ├── nws.gif             ← NWS logo image
│   └── archive/            ← Historical photos folder
│       └── WX4PTC*.jpg     ← Station photos
├── 404.html                ← Page shown for any address that doesn't exist
├── _redirects              ← DO NOT DELETE (sends the old /wx4ptc/ link to the right page)
├── _headers                ← DO NOT DELETE (browser-caching and security rules for Cloudflare)
└── scripts/
    └── serve.py            ← Runs the site on your own computer for testing
```

### ⚠️ CRITICAL: What NOT to Do

**NEVER** do the following:

- ❌ Move HTML files into folders like `pages/` or `site/`
- ❌ Delete `_redirects` (it handles an old link that NWS still uses) or `_headers` (it keeps browsers from showing stale pages)
- ❌ Rename files unless you know ALL places they're referenced

**Why?** Many external websites (NWS, RepeaterBook, ham radio forums) link directly to these files. Moving them would break those links.

### Key Files You'll Edit Often

| File | What It Contains | How Often Updated |
|------|------------------|-------------------|
| `data/repeaters.json` | **All repeater data** (linked + non-linked) | When repeaters change |
| `data/changelog.json` | Public "what's new" list shown on the About and Changelog pages | When something notable changes |
| `about.html` | Contact information | When contacts change |
| `nwsffclinks.html` | NWS resource links | Annual check |
| `css/style.css` | Visual design and colors | Rarely |

**Important**: You do NOT directly edit `index.html` or `repeaters.html` for repeater information. These pages automatically load data from the JSON files.

---

## Understanding JSON Files

### What is JSON?

JSON (JavaScript Object Notation) is a simple text format for storing data. The Georgia SKYWARN website uses JSON files to store repeater information. When you visit the site, JavaScript automatically reads these files and displays the data in nicely formatted tables.

### Why Use JSON Instead of HTML?

**Advantages**:
- ✅ **Easier to edit** - Simple text format, no HTML tags to worry about
- ✅ **Less error-prone** - Structured format that's easy to validate
- ✅ **Single source of truth** - One file updates multiple pages automatically
- ✅ **Automatic display** - Changes appear immediately on both `index.html` and `repeaters.html`

### JSON File Structure

`data/repeaters.json` contains an **array** (list) of repeater objects. Each repeater is a set of key-value pairs enclosed in curly braces `{ }`. The file is kept in this order: repeaters tagged `WX4PTC System` first, then everything else, each group alphabetical by city.

**Example record** (real entry, trimmed to the common fields):

```json
{
  "id": "W4DOC-146.820",
  "location": {
    "city": "Atlanta",
    "county": "Fulton"
  },
  "frequency": "146.820-",
  "tone": "146.2 Hz",
  "tags": ["SE Linked Repeater"],
  "description": "Atlanta Radio Club repeater with excellent metro Atlanta coverage.",
  "callsign": "W4DOC",
  "refurl": "https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=6482",
  "linked": true,
  "validation": { "repeaterbook": true, "owner": true, "club": true },
  "active": true,
  "clubName": "Atlanta Radio Club (ARC)",
  "clubUrl": "https://www.w4doc.org"
}
```

**`location` has three parts**:

```json
"location": { "city": "Jasper", "county": "Pickens", "site": "Biskey Mtn" }
```

- `city` - the nearest city or town (never a placeholder like "Barrow County")
- `county` - the Georgia county, written without the word "County"
- `site` - **optional**; a landmark or community people know the repeater by (Biskey Mtn, Sawnee Mtn, Pine Mountain). Leave it out when the city is enough. When present, the site displays with its city, like "Biskey Mtn (Jasper)".

### JSON Syntax Rules (CRITICAL!)

**Follow these rules exactly or the file won't work**:

1. **Square brackets `[ ]`** - Wrap the entire list of repeaters
2. **Curly braces `{ }`** - Wrap each individual repeater (and each `location`, `validation`, and link entry)
3. **Double quotes `" "`** - ALL text values must be in double quotes (not single quotes)
4. **Commas between entries** - Separate repeaters with commas
5. **NO comma after last entry** - The last repeater should NOT have a comma after its closing `}`
6. **Commas between fields** - Separate fields within a repeater with commas
7. **Colon `:`** - Separates the field name from its value
8. **Tags array `["tag1", "tag2"]`** - Multiple tags enclosed in square brackets with quotes
9. **`true` / `false` / `null`** - Written without quotes

### Field Descriptions

Fields must appear **in this order** in every entry:

| Field | Description | Example | Required |
|-------|-------------|---------|----------|
| `id` | Unique ID: `CALLSIGN-FREQUENCY` | `"W4PSZ-444.600"` | Yes |
| `location` | Object with `city`, `county`, and optional `site` | `{ "city": "Fayetteville", "county": "Fayette" }` | Yes |
| `frequency` | Frequency with offset | `"147.390+"` or `"444.600-"` | Yes |
| `tone` | PL/CTCSS tone, or `null` for none | `"141.3 Hz"` | Yes |
| `tags` | Network affiliations (can be empty `[]`). Valid values: `WX4PTC System`, `Peach State Intertie`, `Cherry Blossom Intertie`, `SE Linked Repeater`, `WX4EMA` | `["WX4PTC System"]` | Yes |
| `description` | Coverage, power info | `"Wide coverage, generator backup"` | Yes |
| `callsign` | Amateur radio callsign, or `"n0call"` if unknown | `"W4PSZ"` | Yes |
| `refurl` | RepeaterBook reference URL | `".../details.php?state_id=13&ID=12345"` | Yes |
| `linked` | `true` if part of the linked SKYWARN network | `true` | Yes |
| `validation` | Three independent confirmations: `{ "repeaterbook": bool, "owner": bool, "club": bool }` | see example above | Yes |
| `active` | `true` if on the air, `false` if confirmed off the air | `true` | Yes |
| `statusNote` | Why it's off the air and who to follow up with | `"DOWN - needs new antenna"` | Only when `active` is `false` |
| `picUrl` | Station photo link (only a few repeaters) | `"https://photos.app.goo.gl/..."` | Only when applicable |
| `clubName` | Sponsoring club, or `null` | `"Atlanta Radio Club (ARC)"` | Yes |
| `clubUrl` | Club website, or `null` | `"https://www.w4doc.org"` | Yes |
| `userAccess` | How a person can get on this repeater from the internet (AllStar node, EchoLink, etc.) | see REPEATER_DATA.md | No - omit if none |
| `repeaterLinks` | Links to other repeaters, whether by radio, at the same site, or over AllStar | see REPEATER_DATA.md | No - omit if none |

[REPEATER_DATA.md](REPEATER_DATA.md) has the complete technical reference, including the `userAccess` / `repeaterLinks` formats and how the validation tiers work.

### Common JSON Mistakes to Avoid

❌ **Missing comma between repeaters**:
```json
[
  {
    "callsign": "W1AAA",
    "frequency": "146.520"
  }
  {
    "callsign": "W1BBB",
    "frequency": "147.390"
  }
]
```
✅ **Correct**:
```json
[
  {
    "callsign": "W1AAA",
    "frequency": "146.520"
  },  ← COMMA HERE!
  {
    "callsign": "W1BBB",
    "frequency": "147.390"
  }
]
```

❌ **Comma after last entry**:
```json
[
  {
    "callsign": "W1AAA",
    "frequency": "146.520"
  },
]  ← NO COMMA AFTER LAST ENTRY!
```

❌ **Single quotes instead of double quotes**:
```json
{
  'callsign': 'W1AAA'  ← WRONG! Use double quotes
}
```

❌ **Missing quotes around text**:
```json
{
  callsign: W1AAA  ← WRONG! Needs quotes
}
```

### How to Validate Your JSON

**ALWAYS validate your JSON before committing**:

1. Go to [jsonlint.com](https://jsonlint.com/)
2. Copy and paste your entire JSON file
3. Click "Validate JSON"
4. Fix any errors it reports

**Common error messages**:
- "Expecting 'STRING'" - You're missing quotes around text
- "Expecting ','" - You need a comma between entries
- "Trailing comma" - Remove the comma after the last entry

---

## Getting Started with GitHub

GitHub is like a "track changes" system for websites. It keeps a history of every change, who made it, and when. You can always go back to an older version if something breaks.

### Understanding GitHub Basics

**Repository (Repo)**: The folder containing all website files
**Commit**: Saving your changes with a description of what you did
**Push**: Uploading your changes to GitHub
**Pull**: Downloading the latest changes from GitHub
**Branch**: A separate version of the site for testing changes

### Method 1: GitHub Web Interface (Easiest for Beginners)

This method works entirely in your web browser - no software to install!

#### Step 1: Navigate to the File

1. Go to [github.com/discerningowl/georgiaskywarn](https://github.com/discerningowl/georgiaskywarn)
2. Click on the file you want to edit (e.g., `index.html`)

#### Step 2: Edit the File

1. Click the pencil icon (✏️) in the top-right corner
2. Make your changes in the editor
3. Use the "Preview" tab to see formatting (limited for HTML)

#### Step 3: Save Your Changes (Commit)

1. Scroll to the bottom of the page
2. In the "Commit changes" box:
   - **Top field**: Write a brief description (e.g., "Update Fayetteville repeater frequency")
   - **Bottom field**: Add more details if needed (optional)
3. Select "Create a new branch for this commit and start a pull request"
   - Branch name: Use something descriptive like `update-repeater-info`
4. Click "Propose changes"
5. On the next page, click "Create pull request"

#### Step 4: Review and Merge

1. Review your changes in the pull request
2. Ask someone to review if you're not sure
3. If everything looks good, click "Merge pull request"
4. Click "Confirm merge"
5. Cloudflare Pages rebuilds the site automatically, and your changes go live at georgiaskywarn.com in a minute or two. See [Publishing & Hosting](#publishing--hosting-cloudflare-pages) for how to check, and how to undo a change.

### Method 2: GitHub Desktop (Better for Multiple Changes)

If you're making lots of changes, this method is easier.

#### Step 1: Install GitHub Desktop

1. Download from [desktop.github.com](https://desktop.github.com/)
2. Install and sign in with your GitHub account

#### Step 2: Clone the Repository

1. Open GitHub Desktop
2. Click "File" → "Clone repository"
3. Find `discerningowl/georgiaskywarn` in the list
4. Choose where to save it on your computer (e.g., `Documents/Websites/`)
5. Click "Clone"

Now you have a complete copy of the website on your computer!

#### Step 3: Make Your Changes

1. Open the file in your text editor (Notepad++, VS Code, etc.)
2. Make your changes
3. Save the file (Ctrl+S or Cmd+S)

#### Step 4: Commit Your Changes

1. Go back to GitHub Desktop
2. You'll see your changed files listed on the left
3. Check the boxes next to files you want to save
4. In the bottom-left corner:
   - **Summary field**: Brief description (e.g., "Update repeater table")
   - **Description field**: More details (optional)
5. Click "Commit to main"

#### Step 5: Push to GitHub

1. Click "Push origin" in the top bar
2. Your changes are now uploaded to GitHub

#### Step 6: Update Your Computer (Pull)

Before starting new work, always click "Fetch origin" to download the latest changes from GitHub. This ensures you're working with the most recent version.

---

## Common Administrative Tasks

### Task 1: Adding a New Repeater

**File to edit**: `data/repeaters.json`

All repeaters (linked and non-linked) live in this one file. The tables on `repeaters.html`, the repeater detail popups, the network map, and the CHIRP / RT Systems CSV downloads are all generated from it automatically. You never edit the HTML for repeater information.

**Steps**:

1. **Open `data/repeaters.json`** in your text editor.

2. **Add a new entry in alphabetical order by city** (`location.city`). Repeaters tagged `WX4PTC System` stay grouped at the very top of the file, also alphabetical.

3. **Fill in every required field, in this order**:

```json
{
  "id": "W4ABC-147.390",
  "location": {
    "city": "Peachtree City",
    "county": "Fayette"
  },
  "frequency": "147.390+",
  "tone": "141.3 Hz",
  "tags": ["WX4PTC System"],
  "description": "Wide coverage, generator backup",
  "callsign": "W4ABC",
  "refurl": "https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=12345",
  "linked": true,
  "validation": { "repeaterbook": true, "owner": false, "club": false },
  "active": true,
  "clubName": "Club Name Here",
  "clubUrl": "https://example.com"
}
```

4. **Notes on specific fields**:
   - `id`: callsign, a dash, then the frequency without the offset sign (e.g., `W4PSZ-444.600`)
   - `location`: `city` and `county` are required; add `"site": "Landmark Name"` only if people know the repeater by a landmark or community name (see the Field Descriptions table above)
   - `tags`: use only the five valid tag values listed in the table above
   - `validation`: set `repeaterbook` to `true` only if the details match RepeaterBook; `owner` and `club` are `true` only after you have confirmed with the repeater's owner or sponsoring club
   - `userAccess` / `repeaterLinks`: add only if the repeater has them; leave them out entirely otherwise

5. **Follow the JSON syntax rules** (commas between entries, no comma after the last one, double quotes around all text).

6. **Validate your JSON** at [jsonlint.com](https://jsonlint.com/) before saving.

7. **Save the file**, load `repeaters.html` locally to confirm the new repeater appears with the right city and county, and commit your changes.

**Note**: If you are not sure about a field, ask Jack (KQ4JP) - the data file is the source of truth for the whole site, so it's better to confirm than guess.

### Task 2: Updating Contact Information

**File to edit**: `about.html`

1. Search for `<section id="contactcard">`
2. Update email addresses or names as needed
3. For email addresses, use HTML entities to reduce spam:
   - Replace `@` with `&#64;`
   - Replace `.` with `&#46;`

**Example**:
```html
<p><strong>NWS Warning Coordination Meteorologist:</strong> David Nadler -
  <a href="mailto:David.Nadler@noaa.gov">David&#46;Nadler&#64;noaa&#46;gov</a>
</p>
```

### Task 3: Updating Links on Any Page

**Files you might edit**: `nwsffclinks.html`, `about.html`, `index.html`, etc.

This task covers updating any links on the website (resource links, documentation links, etc.).

**Steps**:

1. Open the appropriate HTML file in your text editor
2. Search for the section you want to update (e.g., "Core NWS Resources")
3. Find the link you want to change
4. Update the URL and/or link text:

```html
<li><a href="https://www.weather.gov/ffc/resource" target="_blank" rel="noopener noreferrer">Link Description</a></li>
```

**Important**: Always include `target="_blank" rel="noopener noreferrer"` for external links. This opens links in a new tab and provides security.

**Examples**:

Update a link in nwsffclinks.html:
```html
<li><a href="https://www.weather.gov/ffc/winter" target="_blank" rel="noopener noreferrer">Winter Weather Information</a></li>
```

Update a link in about.html:
```html
<p>For more information, visit <a href="https://example.com" target="_blank" rel="noopener noreferrer">our resources page</a>.</p>
```

### Understanding Weather Alerts and Dashboard (Automatic - No Manual Updates Needed)

**Important**: Weather alerts on `index.html` are **automatically fetched from the NWS API**. You should NOT manually update these.

**How Weather Alerts and Dashboard Work**:
- The site automatically fetches live weather alerts from the National Weather Service API
- Alerts refresh every minute, and the HWO (Hazardous Weather Outlook, which sets the spotter activation status) every 2 minutes, matching how often NWS updates them
- If the site can't reach NWS for a few minutes, the alerts already on screen stay, and the "Updated" time turns red with a warning sign ("Not updated since ...") so nobody mistakes old alerts for current ones
- The system filters for NWS Peachtree City (FFC) warnings, watches, and advisories
- No manual intervention is needed - alerts appear and disappear automatically

**If weather alerts are not displaying**:
- See the [Troubleshooting](#problem-weather-alerts-not-loading) section
- The NWS API may be temporarily down
- Contact the Website Administrator (KQ4JP) if problems persist

**Do NOT attempt to**:
- Manually add or remove weather alerts from the HTML
- Modify the JavaScript code that fetches alerts
- Change the NWS API endpoints

Only experienced developers should modify the weather alert system. For all alert-related issues, contact the Website Administrator.

**For developers**: See [CLAUDE.md](CLAUDE.md) "NWS Weather API Integration" section for technical details about the alert system.

### Task 4: Changing Site Colors or Appearance

**File to edit**: `css/style.css`

The site uses "CSS Custom Properties" (variables) for colors. Find this section near the top of `css/style.css`:

```css
:root {
  --bg-body: #f8f9fa;           /* Background color */
  --text-primary: #212529;      /* Main text color */
  --accent-blue: #3b82f6;       /* Blue buttons */
  --accent-red: #e63946;        /* Red alerts */
  --accent-green: #06d6a0;      /* Green success */
  /* ... more colors ... */
}
```

To change a color:
1. Find the color variable (e.g., `--accent-blue`)
2. Change the hex code (e.g., `#3b82f6` to `#1d4ed8`)
3. Save and test in both light and dark mode

**Tip**: Use a color picker tool like [colorpicker.me](https://colorpicker.me/) to find hex codes.

**For advanced CSS customization** (layouts, fonts, spacing, media queries), see [CLAUDE.md](CLAUDE.md) "CSS Architecture" section.

### Task 5: Adding a New Page

This is more advanced. Refer to [CLAUDE.md](CLAUDE.md) section "Adding a New Page" for detailed instructions.

**Quick summary**:
1. Copy an existing page (e.g., `about.html`)
2. Rename it (e.g., `training.html`)
3. Update the `<title>` and `<h1>` tags
4. Add the new page to the site navigation on **ALL** other pages
5. Test thoroughly

### Task 6: Updating the Photo Archive

**File to edit**: `photoarchive.html`

1. Upload new photos to the `assets/archive/` folder (use descriptive names)
2. Edit `photoarchive.html` to add the new photos
3. Follow the existing pattern for photo display

---

## Publishing & Hosting (Cloudflare Pages)

**The short version: merging a change into the `main` branch on GitHub publishes it.** There is no server to upload to. Nobody copies files by hand.

*(Until October 26, 2026 the site ran on an Apache web server and was published by SFTP, with a separate `www` folder. That is all gone. If an older note, email or video tells you to upload to `public_html/`, ignore it.)*

### How a change reaches the live site

```
You edit a file on GitHub
        ↓
Pull request (a preview copy of the whole site is built for it automatically)
        ↓
You check the preview, then click "Merge pull request"
        ↓
Cloudflare Pages rebuilds the site from `main`
        ↓
georgiaskywarn.com shows the change (usually within a minute or two)
```

- **Every pull request gets its own preview site.** Open the pull request on GitHub and look at the "Cloudflare Pages" check near the bottom. Click **Details** to open the preview. The preview address looks like `https://<branch-name>.georgiaskywarn.pages.dev` (slashes in the branch name become hyphens).
- **Merging is publishing.** Treat "Merge pull request" the way you used to treat "upload to the server."
- **Nothing is ever lost.** GitHub keeps every version, and Cloudflare keeps every build.

### Publishing a change, step by step

1. Make your change in a pull request (see [Getting Started with GitHub](#getting-started-with-github)).
2. Wait for the **Cloudflare Pages** check on the pull request to turn green. If it turns red, click **Details** to read why. Do not merge.
3. Open the preview and test it (see the [checklist](#pre-publish-checklist) below).
4. Click **Merge pull request**, then **Confirm merge**.
5. Wait a minute or two, then open **georgiaskywarn.com** and press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) to bypass your browser's saved copy.
6. **Check that it really went out.** Open `https://georgiaskywarn.com/js/version.js` and compare the `APP_VERSION` line with the same file on `https://georgiaskywarn.pages.dev/js/version.js`. If they match, the live site has the latest build.

### If something goes wrong after publishing

- **Quickest fix:** on GitHub, open the pull request you merged and click **Revert**. That makes a new pull request that undoes it. Merge that one.
- **Fastest rollback (needs the Cloudflare login):** Cloudflare dashboard → Workers & Pages → **georgiaskywarn** → **Deployments**. Find the last good deployment, click the **⋯** menu and choose **Rollback to this deployment**. Then fix the problem properly in GitHub.

### Web addresses and redirects

| Address someone types | What they get |
|---|---|
| `georgiaskywarn.com` | The site. This is the real address. |
| `www.georgiaskywarn.com` | Redirected (permanently, with the page kept) to `georgiaskywarn.com`. `www.georgiaskywarn.com/spotters.html` goes to `georgiaskywarn.com/spotters`. |
| `georgiaskywarn.com/spotters.html` or `/spotters` | The same page either way. Cloudflare sends `/spotters.html` to `/spotters`. The site's own links, page addresses and sitemap all use the short form (`/spotters`, `/about`), and the home page is just `/`. |
| `georgiaskywarn.com/wx4ptc/` | Redirected to `georgiaskywarn.com/wx4ptc` (the WX4PTC page). The NWS SKYWARN page still links to this old address, so the rule must stay. |
| Any address that doesn't exist | The "Page not found" page (`404.html`), with a real 404 status so search engines don't index it. |
| `georgiaskywarn.pages.dev` | The same site at Cloudflare's own address. Fine to use for checking; not for sharing. |

Three files in the repository control this. Do not delete any of them:

- **`_redirects`**: the list of redirects handled by Cloudflare Pages. Right now it holds the two `/wx4ptc/` rules. To add one, add a line: `/old-address   /new-address   301`. Write the new address **without `.html`**. If you write `/new-page.html`, Cloudflare sends the visitor back to `/new-page` and the redirect loops.
- **`404.html`**: the "Page not found" page.
- **`_headers`**: rules Cloudflare adds to every reply. It tells browsers to ask before reusing a saved copy of a script, style sheet or data file (so a change shows up without a hard refresh), adds security headers, and keeps Cloudflare's own `pages.dev` copies of the site out of search results. You will almost never edit it. If you add a *new top-level folder* of scripts, styles or data, ask Jack to add a rule for it.

The `www` redirect is **not** in the repository. It is a rule in the Cloudflare dashboard (Rules → Redirect Rules → "Redirect www to apex").

### Domain, DNS and email (as of October 26, 2026)

These live in the Cloudflare account, not on GitHub. You only need them to change the domain setup. **Jack Parks (KQ4JP) holds the Cloudflare and Namecheap logins for georgiaskywarn.com** (the `.org` name is Jim's, below). Ask him rather than sharing passwords.

| Item | Setting |
|---|---|
| **Registrar** | Namecheap. georgiaskywarn.com expires **May 23, 2027**. |
| **Nameservers** | Cloudflare (`anton.ns.cloudflare.com`, `novalee.ns.cloudflare.com`). DNS records are edited in Cloudflare, not Namecheap. |
| **SSL certificate** | Automatic. Cloudflare issues and renews it. |
| **`georgiaskywarn.com`** | CNAME to `georgiaskywarn.pages.dev`, proxied (orange cloud). |
| **`www`** | CNAME to `georgiaskywarn.pages.dev`, proxied. It has to stay proxied for the redirect rule to work. |
| **Email** | **This domain sends and receives no email.** Four records say so, which stops others from forging mail that appears to come from `@georgiaskywarn.com`: a null MX record, an SPF record (`v=spf1 -all`), a DMARC record (`p=reject`) and an empty wildcard DKIM record. If someone ever wants a `@georgiaskywarn.com` address, those records have to be replaced first. Ask Jack. |

**Domain tasks, and where they are done**

- **Renewing the domain:** Namecheap (auto-renew should stay on). Renew well before May 2027.
- **Changing a DNS record:** Cloudflare → georgiaskywarn.com → DNS → Records.
- **Seeing the redirect rule:** Cloudflare → georgiaskywarn.com → Rules → Redirect Rules.
- **Adding or removing a custom domain on the site:** Cloudflare → Workers & Pages → georgiaskywarn → Custom domains.
- **Clearing Cloudflare's saved copy of a file:** Cloudflare → georgiaskywarn.com → Caching → Configuration → Purge Cache → Custom Purge (enter the full address).

### The old backup site (georgiaskywarn.org)

The old setup copied the site to a backup at **georgiaskywarn.org** every day. As of October 26, 2026 that no longer happens. The domain is registered at Namecheap (expires April 12, 2027) and **is still controlled by Jim Lynch (K4GVO); it has not been transferred to Jack**. Its nameservers point to Cloudflare, but it has no DNS records and shows nothing. **Do not rely on it as a backup.** The backup now is GitHub (every version of every file) plus Cloudflare's deployment history. Jim decides what happens to the `.org` name, such as redirecting it to georgiaskywarn.com. Renewals and DNS changes for it go through Jim.

### Good to know

- **A change can take a minute or two** to appear. If it still isn't there after five minutes, see [Changes Not Showing After Merging](#problem-changes-not-showing-after-merging).
- **Browsers keep saved copies.** The site's scripts and styles are stamped with a version number (`js/version.js`) so browsers fetch fresh copies. When you change a JavaScript or CSS file, also change `APP_VERSION` in `js/version.js`. [CLAUDE.md](CLAUDE.md) explains the format.
- **Site-wide files only change through GitHub.** Don't edit anything in the Cloudflare dashboard except the domain tasks above.

### Pre-publish checklist

Before clicking **Merge pull request**:

- [ ] The Cloudflare Pages check on the pull request is green
- [ ] Changes tested on the preview (all pages you touched)
- [ ] Mobile view tested (phone or browser dev tools)
- [ ] Links checked (no broken links)
- [ ] Contact information verified
- [ ] Spelling and grammar checked
- [ ] Light and dark modes tested
- [ ] If you changed JavaScript or CSS: `APP_VERSION` in `js/version.js` updated

### Common mistakes

- ❌ **Merging while the Cloudflare Pages check is red or still running.** Wait for green.
- ❌ **Deleting `_redirects` or `404.html`.** The first keeps an NWS link working. The second is the "Page not found" page.
- ❌ **Writing a redirect that ends in `.html`.** It loops. Leave the `.html` off.
- ❌ **Turning off the orange cloud (proxy) on `www`.** The redirect to `georgiaskywarn.com` stops working.
- ❌ **Editing DNS records without asking.** A wrong record can take the site, or its security settings, offline.

---

## Testing Your Changes

### Local Testing (Before Going Live)

**Test your changes before you merge them.** You have two ways: the preview site that Cloudflare builds for every pull request (see [Publishing & Hosting](#publishing--hosting-cloudflare-pages)), or a copy running on your own computer, described below.

**Two differences to know about:** the local server reads `_redirects` and `404.html` but not `_headers`, so caching and security headers only apply on the preview or the live site. The `www` → `georgiaskywarn.com` redirect lives in Cloudflare and also only works there.

#### Step 1: Start a Local Web Server

**Why?** Opening HTML files directly (`file:///C:/...`) doesn't work properly with JavaScript and dynamic content loading. The site's own `scripts/serve.py` also acts like Cloudflare: `/about` opens `about.html`, redirects work, and a missing address shows the "Page not found" page. Python's plain built-in server (`python -m http.server`) and the VS Code "Live Server" extension do **not** do this, so the menu links would show "Page not found" there. Use `serve.py`.

**Windows Users**:
```
1. Install Python (python.org)
2. Open Command Prompt (search "cmd")
3. Navigate to your website folder:
   cd C:\Users\YourName\Documents\Websites\georgiaskywarn
4. Run: python scripts\serve.py
5. Open browser to: http://localhost:8000
```

**Mac/Linux Users**:
```
1. Open Terminal
2. Navigate to your website folder:
   cd ~/Documents/Websites/georgiaskywarn
3. Run: python3 scripts/serve.py
4. Open browser to: http://localhost:8000
```

Press Ctrl+C in that window to stop it. To use a different port: `python3 scripts/serve.py 8080`.

#### Step 2: Test All Pages

Click through every page and verify:
- [ ] Navigation works (all links go to the correct pages)
- [ ] Images load correctly
- [ ] Text is readable and properly formatted
- [ ] No error messages in browser console (F12 → Console tab)
- [ ] Weather alerts load (if testing alerts page)

#### Step 3: Test Mobile View

In your browser:
1. Press F12 (opens Developer Tools)
2. Click the phone/tablet icon (Toggle Device Toolbar)
3. Select "iPhone 12 Pro" or "Galaxy S20" from the dropdown
4. Verify the site looks good and navigation works

#### Step 4: Test Light and Dark Mode

**Mac**: System Preferences → General → Appearance (Light/Dark)
**Windows 10/11**: Settings → Personalization → Colors → Choose your mode
**Browser DevTools**: F12 → Console → Type:
```javascript
// Test dark mode
document.documentElement.setAttribute('data-theme', 'dark');
// Test light mode
document.documentElement.setAttribute('data-theme', 'light');
```

### Testing Checklist

| Item | Status | Notes |
|------|--------|-------|
| All pages load | ☐ | |
| Navigation works | ☐ | |
| Images display | ☐ | |
| Links work (no 404 errors) | ☐ | |
| Mobile responsive | ☐ | Test on phone or use DevTools |
| Dark mode works | ☐ | Check colors and readability |
| Light mode works | ☐ | Check colors and readability |
| Weather alerts load | ☐ | Check index.html |
| No console errors | ☐ | F12 → Console (should be empty) |
| Contact emails work | ☐ | Click mailto: links |
| External links open | ☐ | Should open in new tabs |

---

## Troubleshooting

### Problem: Weather Alerts or Dashboard Not Loading

**Symptoms**: Empty alerts section or "Error loading alerts" message

**Causes & Fixes**:

1. **NWS API is down**
   - Check [weather.gov](https://www.weather.gov/) - if it's down, wait for it to come back
   - No action needed on your part

2. **Internet connection issue**
   - Verify your internet is working
   - Try loading weather.gov in a new tab

3. **Cache issue**
   - Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Clear localStorage:
     1. Press F12 (Developer Tools)
     2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
     3. Click "Local Storage" → your domain
     4. Right-click and "Clear All"

4. **JavaScript error**
   - Press F12 and check the Console tab
   - Look for red error messages
   - If you see errors, contact the webmaster

### Problem: Footer Not Showing

**Symptoms**: Pages cut off abruptly with no footer

**Causes & Fixes**:

1. **Missing components.js file**
   - Check that `js/components.js` exists in the js directory
   - Re-upload if missing
   - The footer is dynamically loaded by `components.js`, not a separate HTML file

2. **Local testing without web server**
   - Don't open HTML files directly (`file:///`)
   - Use a local web server (see "Local Testing" section)
   - JavaScript file loading requires a proper HTTP server

3. **JavaScript disabled**
   - Check browser settings to ensure JavaScript is enabled

4. **Corrupted components.js file**
   - Re-upload `js/components.js` from GitHub
   - Clear browser cache

### Problem: Mobile Menu Not Working

**Symptoms**: Hamburger menu (☰) doesn't open on mobile

**Causes & Fixes**:

1. **JavaScript error**
   - Press F12 → Console tab
   - Look for errors in red
   - Usually caused by incorrect HTML structure

2. **Corrupted components.js file**
   - Re-upload `js/components.js` from GitHub (the site navigation is injected by this file)
   - Clear browser cache

3. **Test on actual mobile device**
   - Sometimes desktop browser mobile simulators have issues
   - Test on your actual phone to verify

### Problem: Changes Not Showing After Merging

**Symptoms**: You merged a pull request but georgiaskywarn.com still shows the old content

**Causes & Fixes**:

1. **The build hasn't finished**
   - Wait two minutes. Open the merged pull request on GitHub and look at the "Cloudflare Pages" check: it must be green
   - If it is red, click **Details** to see the error. Fix it in a new pull request

2. **Browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open the site in a private window

3. **Check what is actually live**
   - Open `https://georgiaskywarn.com/js/version.js` and compare `APP_VERSION` with `https://georgiaskywarn.pages.dev/js/version.js`
   - If they differ, the live site is behind. Ask Jack to look at the deployments in Cloudflare
   - If they match but the page is still wrong, your change may not have been in the merge. Check the file on GitHub's `main` branch

4. **Cloudflare is serving a saved copy of one file**
   - Rare, and usually for a file that was changed or deleted. Add `?x=1` to the end of the address to see whether the newest version loads
   - Ask Jack to purge that file in Cloudflare (Caching → Configuration → Purge Cache → Custom Purge)

5. **A JavaScript or CSS change doesn't show for some people**
   - Did you update `APP_VERSION` in `js/version.js`? Without that, browsers may keep using the old file

### Problem: Dark Mode Not Working

**Symptoms**: Site stays in light mode even when system is set to dark

**Causes & Fixes**:

1. **Browser doesn't support prefers-color-scheme**
   - Update browser to latest version
   - Use Chrome, Firefox, Safari, or Edge

2. **CSS file not loading**
   - Press F12 → Network tab
   - Reload page and check for `css/style.css` in red (failed to load)
   - Re-upload `css/style.css` if missing

3. **CSS cache issue**
   - Hard refresh: Ctrl+Shift+R
   - Clear browser cache

### Problem: Page Looks Broken After Editing

**Symptoms**: Layout is wrong, colors missing, or content overlapping

**Causes & Fixes**:

1. **HTML syntax error**
   - Check for missing closing tags (`</div>`, `</section>`, etc.)
   - Validate HTML: [validator.w3.org](https://validator.w3.org/)
   - Compare with a working backup

2. **CSS syntax error**
   - Check for missing semicolons or curly braces in `css/style.css`
   - Press F12 → Console for CSS errors
   - Restore `css/style.css` from GitHub if needed

3. **Incorrect class names**
   - Verify you didn't change or remove CSS classes
   - Example: `<div class="card">` should stay as `card`, not `card2`

**Emergency Fix**: Revert to Previous Version
1. Go to GitHub
2. Find the file
3. Click "History"
4. Click on a previous version
5. Copy the content and paste it back

---

## Getting Help

### Before Asking for Help

1. **Check this guide** - read the relevant troubleshooting section
2. **Check the browser console** - Press F12 and look for errors
3. **Try on a different browser** - does it work in Chrome? Firefox?
4. **Check GitHub history** - what changed recently that might have caused this?

### Who to Contact

**Georgia SKYWARN Website Team**:

- **Site Administrator**: Jim Lynch (K4GVO)
  - Overall site administration

- **Content Moderator & SKYWARN Emergency Coordinator**: Robert Burton (KD4YDC) - kd4ydc@gmail.com
  - Content updates and repeater information
  - SKYWARN coordination and operations
  - Weather spotter liaison

- **Website Administrator**: Jack Parks (KQ4JP) - kq4jp@pm.me
  - Technical website issues and maintenance
  - GitHub repository management
  - Code updates and troubleshooting

**When reporting technical issues to the website administrator, include**:
- What you were trying to do
- What happened instead
- What browser/device you're using
- Screenshots if possible
- Any error messages from the browser console (F12 → Console)

**For NWS contact or policy questions**:
- **NWS Warning Coordination Meteorologist**: David Nadler - David.Nadler@noaa.gov

### Reporting a Bug

If something is broken on the live site:

1. **Create a GitHub issue**:
   - Go to [github.com/discerningowl/georgiaskywarn/issues](https://github.com/discerningowl/georgiaskywarn/issues)
   - Click "New issue"
   - Describe the problem clearly
   - Include steps to reproduce
   - Add screenshots if helpful

2. **Include this information**:
   - **What page**: URL of the broken page
   - **What's wrong**: Clear description
   - **Expected behavior**: What should happen instead
   - **Browser**: Chrome 120, Firefox 115, etc.
   - **Device**: Desktop, iPhone 14, Samsung Galaxy, etc.
   - **Steps to reproduce**: How to make the problem happen

### Getting Technical Documentation

For developers or AI assistants:
- **[CLAUDE.md](CLAUDE.md)** - Comprehensive technical documentation
- **[README.md](README.md)** - Project overview and features

---

## Additional Resources

### Web Development Basics

If you want to learn more:
- [MDN Web Docs](https://developer.mozilla.org/en-US/) - Best HTML/CSS reference
- [W3Schools](https://www.w3schools.com/) - Beginner-friendly tutorials
- [GitHub Guides](https://guides.github.com/) - Learn Git and GitHub

### Tools

- **HTML Validator**: [validator.w3.org](https://validator.w3.org/)
- **CSS Validator**: [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/)
- **Color Picker**: [colorpicker.me](https://colorpicker.me/)
- **Image Optimizer**: [tinypng.com](https://tinypng.com/)

### Ham Radio Resources

- **RepeaterBook**: [repeaterbook.com](https://www.repeaterbook.com/)
- **NWS Atlanta**: [weather.gov/ffc](https://www.weather.gov/ffc/)
- **SKYWARN Training**: [weather.gov/ffc/SKYWARNsched](https://www.weather.gov/ffc/SKYWARNsched)

---

## Changelog

### Version 1.6 (October 26, 2026)
- Rewrote the hosting and publishing sections for **Cloudflare Pages**. The site moved from an Apache web server (SFTP uploads, a `public_html` folder and a separate `www` folder) to Cloudflare Pages. Merging a pull request into `main` now publishes the site; there is nothing to upload
- Replaced "Server File Placement & Deployment" with "Publishing & Hosting (Cloudflare Pages)": how a change goes live, previews on every pull request, how to check and roll back, the web addresses and redirects (`www` → apex, `/wx4ptc/`), `_redirects` and `404.html`, the domain, DNS and email setup, and a pre-publish checklist
- Removed the old SFTP, `public_html`, `www/` and `wx4ptc/` folder instructions and the georgiaskywarn.org automatic-backup description (that sync no longer runs)
- Replaced "Changes Not Showing After Upload" with "Changes Not Showing After Merging"
- Updated Prerequisites: Cloudflare access instead of SFTP credentials
- Added `404.html`, `_redirects`, `_headers` and `scripts/serve.py` to the file listing; removed `www/` and `wx4ptc/`
- Local testing now uses `python3 scripts/serve.py` (it behaves like Cloudflare; the plain Python server and VS Code Live Server don't work with the shorter addresses)

### Version 1.5 (October 7, 2026)
- Repeater `location` is now an object with `city`, `county`, and an optional `site`, instead of a single text line; the old top-level `county` field no longer exists
- Rewrote "Understanding JSON Files" and "Task 1: Adding a New Repeater" for the current single-file layout (`data/repeaters.json`): full field list in required order, the five valid tags, the three-source `validation` object, `active` / `statusNote`, and the new ordering rule (alphabetical by city, `WX4PTC System` repeaters first)
- Removed references to the retired `linked-repeaters.json` / `nonlinked-repeaters.json` files and the old `"Hub"` / `"WX4PTC"` tag names
- Added `changelog.html`, `repeater-validation.html`, `sitemap.xml`, `robots.txt`, and `data/changelog.json` to the file listings

### Version 1.4 (July 1, 2026)
- Fixed a data-accuracy bug in the six county JSON files (`data/*-counties.json`): county codes had been silently wrong for many counties, causing the county alert filter to occasionally show the wrong county's weather alerts
- No administrator action needed — this was a developer-side data fix, not a change to how repeater or contact information is maintained

### Version 1.3 (June 30, 2026)
- Updated `js/` directory listing: removed `search.js` (removed April 2026), added `cwa-map.js` (added June 2026)
- Updated `data/` directory listing: removed `search-index.json`, added six CWA county JSON files (`ffc-counties.json` through `tae-counties.json`)
- Updated server deployment layout to match current file set
- Fixed troubleshooting references: `footer.js` and `header.js` → `components.js` (these were merged January 2026)

### Version 1.2 (February 8, 2026)
- Added clickable IP links feature documentation
- Updated version references throughout guide

### Version 1.1 (January 2, 2026)
- Updated directory structure documentation (js/ and data/ folders)
- Updated file references throughout guide
- Updated deployment instructions for new folder structure

### Version 1.0 (December 31, 2025)
- Initial release of Administrator's Guide
- GitHub basics for non-technical users
- Common administrative tasks
- Troubleshooting section
- Testing procedures
- Server deployment with two-folder structure (www vs non-www)
- Backup site information (georgiaskywarn.org automatic sync)
- Complete contact information for website team

---

**Questions or Suggestions?**

If you have ideas for improving this guide, please contact:

- **Technical/Website Issues, hosting and domain**: Jack Parks (KQ4JP) - kq4jp@pm.me
- **Content/SKYWARN Operations**: Robert Burton (KD4YDC) - kd4ydc@gmail.com
- **Site Administration**: Jim Lynch (K4GVO)

---

**Last Updated**: October 26, 2026
**Document Version**: 1.6
**Website Version**: See [README.md](README.md) for current production status
