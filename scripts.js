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
  // FOOTER LOADING – Fetch and inject footer.html
  // ========================================================================
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
      })
      .catch(error => {
        console.error('Failed to load footer:', error);
        footerPlaceholder.innerHTML = '<p>Footer could not be loaded.</p>';
      });
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
