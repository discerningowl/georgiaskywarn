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
- **Flat Directory Structure**: Simple deployment and hosting
- **Component-Based CSS**: BEM naming conventions
- **Progressive Enhancement**: Works without JavaScript (footer excluded)

---

## 📁 Directory Structure

```
georgiaskywarn/
├── index.html              # Main landing page
├── alerts.html             # All NWS Atlanta alerts
├── wx4ptc.html             # WX4PTC station information
├── about.html              # Site overview and structure
├── photoarchive.html       # Historical station photos
├── style.css               # Shared stylesheet (all pages)
├── footer.html             # Reusable footer component
├── robots.txt              # Search engine directives
├── sitemap.xml             # Site map for SEO
├── favicon.ico             # Site favicon
├── nws.gif                 # NWS logo
├── ganwsareacoverage.png   # NWS coverage area map
├── CLAUDE.md               # AI assistant documentation
├── PRODUCTION_READINESS_REPORT.md  # Production readiness analysis
├── archive/                # Historical photos
│   └── WX4PTC*.jpg
├── www/                    # Legacy redirect (DO NOT REMOVE)
│   └── index.html
└── wx4ptc/                 # Legacy redirect (DO NOT REMOVE)
    ├── index.html
    └── ReadMe.md
```

### ⚠️ Important: Directory Structure

**The flat directory structure MUST be maintained.** Do not move files into subdirectories (`pages/`, `css/`, `js/`, `images/`, etc.) or rename existing directories. This structure is required for:

1. **External Links**: Many websites link directly to these file paths
2. **Legacy Redirects**: The `wx4ptc/` and `www/` directories handle old URLs still in use
3. **Static Hosting**: Deployment configuration depends on this structure

See [CLAUDE.md](CLAUDE.md) for detailed documentation.

---

## 🚀 Recent Improvements

### December 2025 - Production Readiness Updates

**Security Enhancements** ✅
- Added Content Security Policy (CSP) headers to all pages
- Secured all 76 external links with `rel="noopener noreferrer"`
- Implemented proper error handling throughout

**SEO & Social Media** ✅
- Comprehensive meta descriptions for all pages
- Open Graph tags for rich social media previews
- Twitter Card integration
- Created `robots.txt` and `sitemap.xml`
- Added DNS prefetch hints for NWS API

**Performance & Reliability** ✅
- NWS API retry logic with exponential backoff
- 10-second request timeout to prevent hanging
- Background refresh every 5 minutes (respects cache)
- Skeleton loader for better perceived performance

**UX Improvements** ✅
- Enhanced mobile navigation with proper error handling
- Friendly error messages for API failures
- Print stylesheet for optimal printing
- Improved accessibility throughout

**Code Quality** ✅
- Fixed duplicate IDs
- Consistent IIFE pattern for all scripts
- Proper null checks and guard clauses
- Clean HTML entity encoding

**Production Status**: 9.5/10 ⭐ (Previously 7.5/10)

---

## 💻 Development

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for testing footer.html loading)
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
5. **Maintain flat structure** - DO NOT reorganize files or directories

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

1. Ensure all files are in the root directory (flat structure)
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

1. Read [CLAUDE.md](CLAUDE.md) for comprehensive documentation
2. Check [PRODUCTION_READINESS_REPORT.md](PRODUCTION_READINESS_REPORT.md) for known issues
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

- ❌ Don't reorganize the directory structure
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

**Last Updated**: December 2, 2025
**Maintained By**: Georgia SKYWARN Team
**For Questions**: Contact webmaster at kq4jp@pm.me
