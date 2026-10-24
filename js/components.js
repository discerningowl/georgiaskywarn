/**
 * ──────────────────────────────────────────────────────────────
 * File:   components.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Common UI components (header + footer) for Georgia SKYWARN website
 *          Merged from header.js + footer.js for better code organization
 * Based on: atlantahamradio.org header structure
 * Change-log:
 *   • 2026-10-23 – Headset button in the header (desktop nav and beside the
 *                  mobile hamburger) opens a WX4PTC-only notice, then the
 *                  Net Control Dashboard in a new tab (NCS_DASHBOARD_URL).
 *                  Footer "⋯" link is now a faint "Audit" link to
 *                  repeater-audit.html (was repeater-validation.html).
 *                  Nav active-page highlight works on Pages' .html-less URLs.
 *   • 2026-10-22 – Theme control is Auto / Dark / Light (was a two-way
 *                  sun/moon toggle), matching the net control dashboard;
 *                  Auto saves nothing and follows the device
 *   • 2026-04-02 – Removed sitewide search button and modal (search feature removed)
 *   • 2026-01-09 – Created by merging header.js + footer.js
 *                  - Reduced total file count from 9 to 7 (-22%)
 *                  - Fixed footer Quick Links: dashboard.html → spotters.html
 * ──────────────────────────────────────────────────────────────
 */

// ============================================================================
// HEADER COMPONENT
// ============================================================================

/**
 * Net Control Dashboard (2026-10-23): the WX4PTC transcriber, behind
 * Cloudflare Access. The header's headset button opens a notice first, then
 * this opens in a new tab. Access does the real gatekeeping; the notice only
 * tells the public it isn't for them. Change the hostname here only.
 */
const NCS_DASHBOARD_URL = 'https://skywarn.tytonest.xyz/';

// A net control operator: head and shoulders in a headset with a mic boom
// (2026-10-23, Jack's ask; was a bare headset). Drawn for this site in the
// same 24px, 2px-stroke style as the theme icons.
const NCS_HEADSET_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="3"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/><path d="M5.5 9.5a6.5 6.5 0 0 1 13 0"/><rect x="4" y="9" width="2.5" height="4" rx="1"/><rect x="17.5" y="9" width="2.5" height="4" rx="1"/><path d="M5.25 13c0 1 1.5 1.5 4.25 1.5"/></svg>`;

/**
 * Load common header with logo, navigation, and theme toggle
 */
function loadHeader() {
    const headerHTML = `
        <header class="header">
            <div class="header-content">
                <a href="index.html" class="logo">
                    <img src="assets/georgiaskywarnlogo.png" alt="Georgia SKYWARN Logo" class="logo-image">
                    <div class="logo-text">
                        <h1>Georgia SKYWARN</h1>
                        <p>Linked Repeater System for Amateur Radio Spotters</p>
                    </div>
                </a>
                <nav id="desktopNav">
                    <a href="index.html">Home</a>
                    <a href="spotters.html">Spotters</a>
                    <a href="repeaters.html">Repeaters</a>
                    <a href="wx4ptc.html">WX4PTC</a>
                    <a href="nwsffclinks.html">Resources</a>
                    <a href="about.html">About</a>
                </nav>
                <div class="header-actions">
                    <button type="button" class="ncs-btn" data-ncs-open aria-haspopup="dialog" aria-label="Net Control Dashboard (WX4PTC team only)" title="Net Control Dashboard (WX4PTC team only)">${NCS_HEADSET_ICON}</button>
                    <button class="theme-toggle" id="themeToggle" aria-label="Theme: Auto. Click for Dark." title="Theme: Auto. Click for Dark.">
                        <svg class="theme-icon icon-auto" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>
                        <svg class="theme-icon icon-dark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        <svg class="theme-icon icon-light" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                    </button>
                </div>
                <div class="header-mobile-actions">
                    <button type="button" class="ncs-btn" data-ncs-open aria-haspopup="dialog" aria-label="Net Control Dashboard (WX4PTC team only)" title="Net Control Dashboard (WX4PTC team only)">${NCS_HEADSET_ICON}</button>
                    <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle mobile menu">
                        <svg class="hamburger-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                        <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            </div>
            <nav class="mobile-nav" id="mobileNav">
                <a href="index.html">Home</a>
                <a href="spotters.html">Spotters</a>
                <a href="repeaters.html">Repeaters</a>
                <a href="wx4ptc.html">WX4PTC</a>
                <a href="nwsffclinks.html">Resources</a>
                <a href="about.html">About</a>
                <button class="theme-toggle" id="themeToggleMobile" aria-label="Theme: Auto. Click for Dark.">
                    <svg class="theme-icon icon-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>
                    <svg class="theme-icon icon-dark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    <svg class="theme-icon icon-light" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                    <span id="themeToggleText">Theme: Auto</span>
                </button>
            </nav>
        </header>

    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Add back to top button
    const backToTopHTML = `
        <button class="back-to-top" id="backToTop" aria-label="Back to top" title="Back to top">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m18 15-6-6-6 6"/>
            </svg>
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', backToTopHTML);

    // Net Control Dashboard notice, opened by either headset button
    const ncsModalHTML = `
        <div class="modal-backdrop" id="ncsModal" role="dialog" aria-modal="true" aria-labelledby="ncsModalTitle">
            <div class="modal-content ncs-modal">
                <div class="modal-header modal-header--blue">
                    <h2 class="modal-title" id="ncsModalTitle">Net Control Dashboard</h2>
                    <button type="button" class="modal-close" data-ncs-close aria-label="Close">×</button>
                </div>
                <div class="modal-body">
                    <p class="ncs-modal-lead"><strong>Restricted service.</strong> The Net Control Dashboard is for WX4PTC team members only.</p>
                    <p>You'll be asked to sign in, and only approved team members get through. Spotters don't need it: check in on the repeaters as usual.</p>
                    <div class="ncs-modal-actions">
                        <button type="button" class="btn ncs-btn-cancel" data-ncs-close>Cancel</button>
                        <a href="${NCS_DASHBOARD_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-blue" id="ncsContinue">Continue to Dashboard ↗</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', ncsModalHTML);

    // Initialize mobile menu, theme toggle, and back to top after DOM insertion
    initMobileMenu();
    initThemeToggle();
    initNcsModal();
    initBackToTop();
    initStickyHeaderShadow();
    setActiveNavLink();
}

/**
 * Active-page indicator on the site nav (2026-08-27)
 *
 * Marks the #desktopNav / #mobileNav link matching the current page with
 * .is-active + aria-current="page", mirroring the .is-active scroll-spy
 * treatment T2.8 already applies to in-page .page-nav pills — so a visitor
 * can tell which page they're on the same way they can tell which page
 * section they're in.
 */
function setActiveNavLink() {
    // Last path segment, e.g. "repeaters.html". Root ("/" or "") means index.html.
    // Cloudflare Pages serves /repeaters without .html extension
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const currentPage = page.includes('.') ? page : page + '.html';

    document.querySelectorAll('#desktopNav a[href], .mobile-nav a[href]').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Sticky-header shadow on scroll (T4.16, 2026-05-16)
 *
 * Adds .is-stuck class to .header when the page has scrolled past a small
 * top sentinel element. Lets the header use a subtle shadow at rest and a
 * deeper shadow when actively floating over content — a small but distinctive
 * polish detail (Stripe, Linear, Vercel docs all do this).
 *
 * Pattern: 1px sentinel placed at the very top of <body>. When the sentinel
 * leaves the viewport (user has scrolled down at all), header gets .is-stuck.
 * IntersectionObserver fires only on the boundary crossing — no scroll-listener
 * cost on every frame.
 */
function initStickyHeaderShadow() {
    const header = document.querySelector('.header');
    if (!header || !('IntersectionObserver' in window)) return;

    // Insert a 1px sentinel as the first child of <body>, right above the
    // sticky header. When it scrolls out of view, we know the header is stuck.
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position: absolute; top: 0; left: 0; width: 1px; height: 1px; pointer-events: none;';
    document.body.insertBefore(sentinel, document.body.firstChild);

    const observer = new IntersectionObserver(
        ([entry]) => {
            // Sentinel is in viewport => at top of page => header NOT stuck.
            header.classList.toggle('is-stuck', !entry.isIntersecting);
        },
        { rootMargin: '0px', threshold: 0 }
    );
    observer.observe(sentinel);
}

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerIcon = mobileMenuBtn?.querySelector('.hamburger-icon');
    const closeIcon = mobileMenuBtn?.querySelector('.close-icon');

    if (!mobileMenuBtn || !mobileNav) return;

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('active');

        // Toggle icons
        if (hamburgerIcon && closeIcon) {
            hamburgerIcon.style.display = isOpen ? 'none' : 'block';
            closeIcon.style.display = isOpen ? 'block' : 'none';
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            if (hamburgerIcon && closeIcon) {
                hamburgerIcon.style.display = 'block';
                closeIcon.style.display = 'none';
            }
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                if (hamburgerIcon && closeIcon) {
                    hamburgerIcon.style.display = 'block';
                    closeIcon.style.display = 'none';
                }
                document.body.style.overflow = '';
            }
        }
    });
}

/**
 * Theme control: Auto / Dark / Light (2026-10-22, was a two-way toggle).
 * Auto follows the device: no data-theme on <html> and nothing saved, so
 * the stylesheet's `color-scheme: light dark` decides. Dark and Light
 * override it and are saved under the existing 'theme' key. Each click
 * moves to the next setting; CSS shows the matching icon from data-theme.
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const themeToggleText = document.getElementById('themeToggleText');

    const MODES = ['auto', 'dark', 'light'];
    const LABELS = { auto: 'Auto', dark: 'Dark', light: 'Light' };

    function currentMode() {
        return document.documentElement.getAttribute('data-theme') || 'auto';
    }

    function nextMode(mode) {
        return MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    }

    // Labels say the current setting and what a click does
    function updateThemeUI(mode) {
        const label = `Theme: ${LABELS[mode]}. Click for ${LABELS[nextMode(mode)]}.`;
        [themeToggle, themeToggleMobile].forEach(btn => {
            if (!btn) return;
            btn.setAttribute('aria-label', label);
            btn.title = label;
        });
        if (themeToggleText) themeToggleText.textContent = `Theme: ${LABELS[mode]}`;
    }

    // Function to set theme
    // ENHANCEMENT (2026-05-16): wraps theme change in View Transitions API
    // (Baseline 2024, Chromium/Safari). Supporting browsers snapshot the old
    // and new states and crossfade between them, smoothing out the dark/light
    // flip instead of snapping. Reduced-motion users skip the transition.
    // Browsers without the API just apply the change directly.
    function setTheme(mode) {
        const applyTheme = () => {
            if (mode === 'auto') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', mode);
            }
            try {
                if (mode === 'auto') localStorage.removeItem('theme');
                else localStorage.setItem('theme', mode);
            } catch (e) {
                // Storage blocked: the choice lasts until the page is left
            }
            updateThemeUI(mode);
        };

        const reduceMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (document.startViewTransition && !reduceMotion) {
            document.startViewTransition(applyTheme);
        } else {
            applyTheme();
        }
    }

    function toggleTheme() {
        setTheme(nextMode(currentMode()));
    }

    // Add click listeners to both toggle buttons
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // Set initial labels from the current setting
    updateThemeUI(currentMode());
}

/**
 * Net Control Dashboard notice (2026-10-23). Either headset button opens
 * it; Cancel, ×, Esc or a click on the backdrop closes it. Continue is a
 * real link (new tab), so it also closes the notice behind it.
 */
function initNcsModal() {
    const modal = document.getElementById('ncsModal');
    if (!modal) return;

    let opener = null;

    function open(e) {
        opener = e.currentTarget;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('ncsContinue')?.focus();
    }

    function close() {
        if (!modal.classList.contains('active')) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        opener?.focus();
    }

    document.querySelectorAll('[data-ncs-open]').forEach(btn => btn.addEventListener('click', open));
    modal.querySelectorAll('[data-ncs-close], #ncsContinue').forEach(el => el.addEventListener('click', close));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });
}

/**
 * Back to top button functionality
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    let ticking = false;

    // Immediate scroll handler using requestAnimationFrame for smooth, instant updates
    function updateBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateBackToTop);
            ticking = true;
        }
    }, { passive: true }); // passive: true for better scroll performance

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Apply a saved Dark or Light choice. Every page's <head> already does this
 * before first paint (2026-10-22), so the page never flashes the other
 * theme; this is the fallback. No saved choice means Auto: no data-theme,
 * and CSS follows the device live, so no prefers-color-scheme listener is
 * needed.
 */
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    } catch (e) {
        // Storage blocked: stay on Auto
    }
}

initializeTheme();

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

/**
 * Load common footer with site info, quick links, and connect links
 */
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (!footerPlaceholder) return;

    const footerHTML = `
        <footer class="site-footer" role="contentinfo">
            <div class="footer-content">
                <div class="footer-grid">
                    <div class="footer-section">
                        <h4>Georgia SKYWARN</h4>
                        <p>Linked repeater system for amateur radio weather spotters coordinating severe weather reporting with NWS Peachtree City across North and Central Georgia.</p>
                        <p>The WX4PTC team serves in direct coordination with the National Weather Service in Peachtree City, Georgia.</p>
                        <p style="margin-top: 1rem;">Maintained by <strong>Jack Parks (KQ4JP)</strong></p>
                    </div>

                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul class="footer-nav">
                            <li><a href="spotters.html">Spotter Information</a></li>
                            <li><a href="repeaters.html">SKYWARN Repeaters</a></li>
                            <li><a href="wx4ptc.html">WX4PTC Station</a></li>
                            <li><a href="nwsffclinks.html">NWS Resources</a></li>
                            <li><a href="about.html">About This Site</a></li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4>Connect</h4>
                        <ul class="footer-nav">
                            <li><a href="mailto:kq4jp&#64;pm&#46;me">Contact Webmaster</a></li>
                            <li><a href="https://www.weather.gov/ffc/" target="_blank" rel="noopener noreferrer">NWS Atlanta</a></li>
                            <li><a href="https://www.weather.gov/ffc/SKYWARNsched" target="_blank" rel="noopener noreferrer">Spotter Training</a></li>
                            <li><a href="https://www.weather.gov/ffc/strmsubm1" target="_blank" rel="noopener noreferrer">Submit Storm Report</a></li>
                            <li><a href="repeater-audit.html" style="opacity: 0.4;" aria-label="Repeater Database Audit">Audit</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2026 Georgia SKYWARN &middot; All Rights Reserved &middot; Serving North and Central Georgia</p>
                    <p class="footer-page-updated" id="page-last-updated-date" style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-secondary);">Page last updated <span id="page-last-updated">loading...</span></p>
                </div>
            </div>
        </footer>
    `;

    footerPlaceholder.innerHTML = footerHTML;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Load header when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}

console.log('[COMPONENTS] Header and footer loaded (merged from header.js + footer.js)');
