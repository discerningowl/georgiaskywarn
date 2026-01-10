/**
 * ──────────────────────────────────────────────────────────────
 * File:   components.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Common UI components (header + footer) for Georgia SKYWARN website
 *          Merged from header.js + footer.js for better code organization
 * Based on: atlantahamradio.org header structure
 * Change-log:
 *   • 2026-01-10b – BUGFIX: Fixed search button color and click functionality
 *                  - Added white color to match nav text (was dark gray)
 *                  - Added retry logic for click handler (timing issue with search.js loading)
 *                  - Added hover effects matching nav link behavior
 *   • 2026-01-10 – Added sitewide search button and modal to header
 *   • 2026-01-09 – Created by merging header.js + footer.js
 *                  - Reduced total file count from 9 to 7 (-22%)
 *                  - Fixed footer Quick Links: dashboard.html → spotters.html
 * ──────────────────────────────────────────────────────────────
 */

// ============================================================================
// HEADER COMPONENT
// ============================================================================

/**
 * Load common header with logo, navigation, and theme toggle
 */
function loadHeader() {
    const headerHTML = `
        <header class="header">
            <div class="header-content">
                <a href="index.html" class="logo">
                    <img src="georgiaskywarnlogo.png" alt="Georgia SKYWARN Logo" class="logo-image">
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
                    <button id="site-search-button" aria-label="Search site (Ctrl+Shift+K)" title="Search site (Ctrl+Shift+K)" style="background: none; border: none; cursor: pointer; padding: 0.5rem; display: flex; align-items: center; color: white; transition: opacity 0.3s ease;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    </button>
                    <button id="themeToggle" aria-label="Toggle theme" style="background: none; border: none; cursor: pointer; padding: 0.5rem; display: flex; align-items: center;">
                        <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                        <svg id="moonIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    </button>
                </nav>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle mobile menu">
                    <svg class="hamburger-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <nav class="mobile-nav" id="mobileNav">
                <a href="index.html">Home</a>
                <a href="spotters.html">Spotters</a>
                <a href="repeaters.html">Repeaters</a>
                <a href="wx4ptc.html">WX4PTC</a>
                <a href="nwsffclinks.html">Resources</a>
                <a href="about.html">About</a>
                <button id="site-search-button-mobile" aria-label="Search site">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <span>Search Site</span>
                </button>
                <button id="themeToggleMobile" aria-label="Toggle theme">
                    <svg id="sunIconMobile" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                    <svg id="moonIconMobile" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    <span id="themeToggleText">Light Mode</span>
                </button>
            </nav>
        </header>

        <!-- Search Modal -->
        <div class="modal-backdrop" id="searchModal">
            <div class="modal-content modal-content--search">
                <div class="modal-header modal-header--blue">
                    <h2 class="modal-title">Search Georgia SKYWARN</h2>
                    <button class="modal-close" id="searchModalClose" aria-label="Close search">×</button>
                </div>
                <div class="modal-body">
                    <div class="search-input-container">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input
                            type="search"
                            id="site-search-input"
                            placeholder="Search pages, sections, and content..."
                            aria-label="Search site"
                            autocomplete="off"
                        >
                        <kbd class="search-shortcut">Ctrl+Shift+K</kbd>
                    </div>
                    <div id="searchModalBody"></div>
                </div>
            </div>
        </div>
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

    // Initialize mobile menu, theme toggle, back to top, and search after DOM insertion
    initMobileMenu();
    initThemeToggle();
    initBackToTop();
    initSearchButton();
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
 * Theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const sunIconMobile = document.getElementById('sunIconMobile');
    const moonIconMobile = document.getElementById('moonIconMobile');
    const themeToggleText = document.getElementById('themeToggleText');

    // Function to update theme icons and text
    function updateThemeUI(theme) {
        if (theme === 'dark') {
            // Show moon icon (dark mode active)
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIconMobile) sunIconMobile.style.display = 'none';
            if (moonIconMobile) moonIconMobile.style.display = 'block';
            if (themeToggleText) themeToggleText.textContent = 'Dark Mode';
        } else {
            // Show sun icon (light mode active)
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIconMobile) sunIconMobile.style.display = 'block';
            if (moonIconMobile) moonIconMobile.style.display = 'none';
            if (themeToggleText) themeToggleText.textContent = 'Light Mode';
        }
    }

    // Function to set theme
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
        updateThemeUI(theme);
    }

    // Function to toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Add click listeners to both toggle buttons
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // Set initial UI state based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeUI(currentTheme);
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
 * Search button functionality (connects to search.js)
 * Handles timing issue where search.js loads after components.js
 */
function initSearchButton() {
    const searchButton = document.getElementById('site-search-button');
    const searchButtonMobile = document.getElementById('site-search-button-mobile');
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    // Function to open search modal
    function openSearch() {
        if (window.SEARCH && typeof window.SEARCH.openSearch === 'function') {
            window.SEARCH.openSearch();

            // Close mobile menu if open
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                const hamburgerIcon = mobileMenuBtn?.querySelector('.hamburger-icon');
                const closeIcon = mobileMenuBtn?.querySelector('.close-icon');
                if (hamburgerIcon && closeIcon) {
                    hamburgerIcon.style.display = 'block';
                    closeIcon.style.display = 'none';
                }
                document.body.style.overflow = '';
            }
        } else {
            console.warn('[SEARCH] Search functionality not yet loaded, retrying...');
            // Retry after short delay (search.js should be loading)
            setTimeout(() => {
                if (window.SEARCH && typeof window.SEARCH.openSearch === 'function') {
                    window.SEARCH.openSearch();
                } else {
                    console.error('[SEARCH] Search module failed to load');
                }
            }, 500);
        }
    }

    // Add click listeners
    if (searchButton) {
        searchButton.addEventListener('click', openSearch);
        // Add hover effect
        searchButton.addEventListener('mouseenter', () => {
            searchButton.style.opacity = '0.8';
        });
        searchButton.addEventListener('mouseleave', () => {
            searchButton.style.opacity = '1';
        });
    }
    if (searchButtonMobile) {
        searchButtonMobile.addEventListener('click', openSearch);
    }
}

/**
 * Initialize theme on page load (before header loads)
 */
function initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        // Use saved preference
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
}

// Initialize theme immediately (before DOM loads to prevent flash)
initializeTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only update if user hasn't set a manual preference
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

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
                            <li><a href="spotters.html">Spotters</a></li>
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
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2026 Georgia SKYWARN &middot; All Rights Reserved &middot; Serving North and Central Georgia</p>
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
