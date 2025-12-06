/*
 * ──────────────────────────────────────────────────────────────
 * File:   scripts.js
 * Author: Jack Parks (KQ4JP) <kq4jp@pm.me>
 * Purpose: Consolidated JavaScript for Georgia SKYWARN website
 *          - Footer loading
 *          - Dual navigation toggle (site-nav + page-nav)
 *          - Back-to-top button
 * Change-log:
 *   • 2025-12-06 – Created consolidated script file to replace
 *     inline scripts across all pages
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ========================================================================
  // FOOTER INJECTION – Direct HTML injection (no fetch required)
  // ========================================================================
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
      <footer class="site-footer" role="contentinfo">
        <p><a href="about.html">About Georgia SKYWARN</a></p>
        <p>&copy; 2025 Georgia SKYWARN &middot; All Rights Reserved</p>
        <p><a href="mailto:kq4jp&#64;pm&#46;me">Contact Webmaster - KQ4JP</a></p>
      </footer>
    `;
  }

  // ========================================================================
  // DUAL NAVIGATION TOGGLE – Supports both site-nav and page-nav
  // ========================================================================
  const navToggles = document.querySelectorAll('.nav-toggle');
  navToggles.forEach(button => {
    const targetId = button.getAttribute('aria-controls');
    const menu = document.getElementById(targetId);

    if (!menu) return; // Skip if target menu doesn't exist

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Toggle ARIA state
      button.setAttribute('aria-expanded', String(!isExpanded));

      // Toggle menu visibility
      menu.classList.toggle('open');
    });
  });

  // ========================================================================
  // BACK TO TOP BUTTON – Smooth scroll to top with visibility toggle
  // ========================================================================
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

})();
