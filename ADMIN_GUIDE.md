# Georgia SKYWARN Website - Administrator's Guide

**Quick Start Guide for Website Administrators**

**Version**: 1.0
**Last Updated**: December 31, 2025
**Maintained By**: Jack Parks (KQ4JP) <kq4jp@pm.me>

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Who This Guide Is For](#who-this-guide-is-for)
3. [Prerequisites & Access](#prerequisites--access)
4. [Understanding the Website Structure](#understanding-the-website-structure)
5. [Getting Started with GitHub](#getting-started-with-github)
6. [Common Administrative Tasks](#common-administrative-tasks)
7. [Server File Placement & Deployment](#server-file-placement--deployment)
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

For detailed technical documentation, see:
- **[README.md](README.md)** - Overview, features, and general information
- **[CLAUDE.md](CLAUDE.md)** - Comprehensive technical documentation for developers and AI assistants

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

### 4. Server Access (if deploying)

- FTP/SFTP credentials for the web server
- You'll need these from the current webmaster or hosting provider

---

## Understanding the Website Structure

### File Organization

The Georgia SKYWARN website uses a **flat directory structure** - all important files are in the main folder, not organized into subfolders. This is intentional and **MUST NOT be changed**.

```
georgiaskywarn/
├── index.html              ← Main page (what visitors see first)
├── alerts.html             ← All NWS weather alerts page
├── repeaters.html          ← Repeater directory page
├── nwsffclinks.html        ← NWS links and resources page
├── wx4ptc.html             ← WX4PTC station information page
├── about.html              ← About the site page
├── photoarchive.html       ← Historical photos page
├── header.js               ← Header component (logo, navigation, theme toggle)
├── footer.js               ← Footer component
├── scripts.js              ← Page-specific JavaScript (alerts, search)
├── style.css               ← Stylesheet (colors, layout, design)
├── GeorgiaSkywarnLogo.png  ← Site logo
├── favicon.ico             ← Browser tab icon
├── nws.gif                 ← NWS logo image
├── ganwsareacoverage.png   ← Coverage area map
├── archive/                ← Historical photos folder
│   └── WX4PTC*.jpg         ← Station photos
├── www/                    ← DO NOT DELETE (legacy redirects)
│   └── index.html
└── wx4ptc/                 ← DO NOT DELETE (legacy redirects)
    ├── index.html
    └── ReadMe.md
```

### ⚠️ CRITICAL: What NOT to Do

**NEVER** do the following:

- ❌ Move HTML files into folders like `pages/` or `site/`
- ❌ Create new folders like `css/`, `js/`, or `images/`
- ❌ Delete the `wx4ptc/` or `www/` folders (these handle old links that are still in use)
- ❌ Rename files unless you know ALL places they're referenced

**Why?** Many external websites (NWS, RepeaterBook, ham radio forums) link directly to these files. Moving them would break those links.

### Key Files You'll Edit Often

| File | What It Contains | How Often Updated |
|------|------------------|-------------------|
| `index.html` | Main page with repeater table and alerts | Monthly or as needed |
| `repeaters.html` | Full repeater directory | When repeaters change |
| `nwsffclinks.html` | NWS resource links | Rarely (annual check) |
| `style.css` | Visual design and colors | Rarely |

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
5. Your changes are now live!

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

**File to edit**: `index.html` and/or `repeaters.html`

1. **Find the repeater table** in the file:
   - Linked repeaters: Search for `<h2 id="repeatercardlinked">Linked Repeaters</h2>`
   - Non-linked repeaters: Search for `<h2 id="repeatercardnonlinked">Non-Linked Repeaters</h2>`

2. **Locate the table** (starts with `<table class="repeater-table">`)

3. **Add a new row** in alphabetical order by location:

```html
<tr>
  <td><a href="https://www.repeaterbook.com/repeaters/details.php?ID=XXXXX" target="_blank">Location Name</a></td>
  <td class="freq">146.520- (110.9 Hz)</td>
  <td>Coverage notes, emergency power status, etc.</td>
</tr>
```

4. **Replace the placeholders**:
   - `XXXXX`: RepeaterBook ID number (find on RepeaterBook.com)
   - `Location Name`: City or county name
   - `146.520-`: Frequency and offset (-, +, or blank)
   - `110.9 Hz`: PL/CTCSS tone
   - Coverage notes: Any important information

5. **Save the file** and commit your changes

**Example**:
```html
<tr>
  <td><a href="https://www.repeaterbook.com/repeaters/details.php?ID=12345" target="_blank">Peachtree City</a></td>
  <td class="freq">147.390+ (141.3 Hz)</td>
  <td>Wide coverage, generator backup</td>
</tr>
```

### Task 2: Updating Contact Information

**File to edit**: `index.html`

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

### Task 3: Updating Weather Alert Links

**File to edit**: `nwsffclinks.html`

1. Search for the section you want to update (e.g., "Core NWS Resources")
2. Update the link:

```html
<li><a href="https://www.weather.gov/ffc/resource" target="_blank" rel="noopener noreferrer">Link Description</a></li>
```

**Important**: Always include `target="_blank" rel="noopener noreferrer"` for external links. This opens links in a new tab and provides security.

### Task 4: Changing Site Colors or Appearance

**File to edit**: `style.css`

The site uses "CSS Custom Properties" (variables) for colors. Find this section near the top of `style.css`:

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

1. Upload new photos to the `archive/` folder (use descriptive names)
2. Edit `photoarchive.html` to add the new photos
3. Follow the existing pattern for photo display

---

## Server File Placement & Deployment

### Legacy Directory Requirements

**⚠️ IMPORTANT**: Due to external links from NWS, RepeaterBook, and other amateur radio sites, certain files and folders MUST remain at specific locations on the server.

### Critical Path Requirements

[**NOTE**: This section will be completed with specific server path requirements based on hosting configuration]

**To be documented**:
- Root-level file requirements
- Legacy redirect handling (`wx4ptc/` and `www/` folders)
- Subdomain configurations (if any)
- FTP/SFTP upload paths
- File permission requirements

### Deployment Process

**Method 1: FTP/SFTP Upload** (Traditional Hosting)

1. Connect to the server using your FTP client:
   - **Host**: [to be specified]
   - **Username**: [your FTP username]
   - **Password**: [your FTP password]
   - **Port**: 21 (FTP) or 22 (SFTP)

2. Navigate to the web root directory (usually `public_html/` or `www/`)

3. Upload changed files, maintaining the flat directory structure

4. **DO NOT DELETE** existing `wx4ptc/` or `www/` folders

5. Verify file permissions (usually 644 for files, 755 for folders)

**Method 2: GitHub Pages** (Automated)

If the site is hosted on GitHub Pages:
1. Push your changes to GitHub (see "Getting Started with GitHub")
2. GitHub automatically deploys changes within 1-2 minutes
3. Visit [georgiaskywarn.com](https://georgiaskywarn.com) to verify

**Method 3: Other Platforms** (Netlify, Vercel, etc.)

Follow the platform-specific deployment guide. Most platforms auto-deploy when you push to GitHub.

### Pre-Deployment Checklist

Before uploading to the live server:

- [ ] All changes tested locally
- [ ] Mobile view tested (phone or browser dev tools)
- [ ] Links checked (no broken links)
- [ ] Contact information verified
- [ ] Spelling and grammar checked
- [ ] Light and dark modes tested
- [ ] Changes committed to GitHub

---

## Testing Your Changes

### Local Testing (Before Going Live)

**You MUST test changes on your computer before uploading to the server.**

#### Step 1: Start a Local Web Server

**Why?** Opening HTML files directly (`file:///C:/...`) doesn't work properly with JavaScript and dynamic content loading.

**Windows Users**:
```
1. Install Python (python.org)
2. Open Command Prompt (search "cmd")
3. Navigate to your website folder:
   cd C:\Users\YourName\Documents\Websites\georgiaskywarn
4. Run: python -m http.server 8000
5. Open browser to: http://localhost:8000
```

**Mac/Linux Users**:
```
1. Open Terminal
2. Navigate to your website folder:
   cd ~/Documents/Websites/georgiaskywarn
3. Run: python3 -m http.server 8000
4. Open browser to: http://localhost:8000
```

**Alternative (Easier)**: Install [VS Code](https://code.visualstudio.com/) and the "Live Server" extension. Right-click any HTML file and select "Open with Live Server."

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
| Weather alerts load | ☐ | Check index.html and alerts.html |
| No console errors | ☐ | F12 → Console (should be empty) |
| Contact emails work | ☐ | Click mailto: links |
| External links open | ☐ | Should open in new tabs |

---

## Troubleshooting

### Problem: Weather Alerts Not Loading

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

1. **Missing footer.html file**
   - Check that `footer.html` exists in the root directory
   - Re-upload if missing

2. **Local testing without web server**
   - Don't open HTML files directly (`file:///`)
   - Use a local web server (see "Local Testing" section)

3. **JavaScript disabled**
   - Check browser settings to ensure JavaScript is enabled

### Problem: Mobile Menu Not Working

**Symptoms**: Hamburger menu (☰) doesn't open on mobile

**Causes & Fixes**:

1. **JavaScript error**
   - Press F12 → Console tab
   - Look for errors in red
   - Usually caused by incorrect HTML structure

2. **Corrupted header.js file**
   - Re-upload `header.js` from GitHub
   - Clear browser cache

3. **Test on actual mobile device**
   - Sometimes desktop browser mobile simulators have issues
   - Test on your actual phone to verify

### Problem: Changes Not Showing After Upload

**Symptoms**: Uploaded new files but website still shows old content

**Causes & Fixes**:

1. **Browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

2. **Wrong file uploaded**
   - Verify you uploaded the correct file
   - Check the file modification date on the server

3. **Uploaded to wrong directory**
   - Verify you're uploading to the correct folder (usually `public_html/`)
   - Check that files are in the root, not a subfolder

4. **Server cache** (if using CDN or caching)
   - Wait 5-10 minutes for server cache to clear
   - Or contact hosting support to manually clear cache

### Problem: Dark Mode Not Working

**Symptoms**: Site stays in light mode even when system is set to dark

**Causes & Fixes**:

1. **Browser doesn't support prefers-color-scheme**
   - Update browser to latest version
   - Use Chrome, Firefox, Safari, or Edge

2. **CSS file not loading**
   - Press F12 → Network tab
   - Reload page and check for `style.css` in red (failed to load)
   - Re-upload `style.css` if missing

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
   - Check for missing semicolons or curly braces in `style.css`
   - Press F12 → Console for CSS errors
   - Restore `style.css` from GitHub if needed

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

**For website technical issues**:
- **Webmaster**: Jack Parks (KQ4JP) - kq4jp@pm.me
- Include:
  - What you were trying to do
  - What happened instead
  - What browser/device you're using
  - Screenshots if possible
  - Any error messages from the browser console (F12 → Console)

**For repeater information updates**:
- **NWS Liaison**: Robert Burton (KD4YDC) - kd4ydc@gmail.com

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

### Version 1.0 (December 31, 2025)
- Initial release of Administrator's Guide
- GitHub basics for non-technical users
- Common administrative tasks
- Troubleshooting section
- Testing procedures

---

**Questions or Suggestions?**

If you have ideas for improving this guide, please contact:
**Jack Parks (KQ4JP)** - kq4jp@pm.me

---

**Last Updated**: December 31, 2025
**Document Version**: 1.0
**Website Version**: See [README.md](README.md) for current production status
