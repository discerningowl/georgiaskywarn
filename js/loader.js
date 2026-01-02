/**
 * ──────────────────────────────────────────────────────────────
 * File:   loader.js
 * Author: Jack Parks (KQ4JP) <kq4jp@pm.me>
 * Purpose: Dynamically loads ALL JavaScript files with version-based cache busting
 *          To update cache across entire site: just update APP_VERSION in version.js
 * Change-log:
 *   • 2026-01-02b – Added header.js to centralized loading
 *   • 2026-01-02 – Created centralized script loader
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /**
   * Loads a script with version-based cache busting
   * @param {string} src - Script path (e.g., 'js/config.js')
   * @param {boolean} async - Load asynchronously (default: false for dependency order)
   * @returns {Promise} - Resolves when script loads
   */
  function loadScript(src, async = false) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const version = window.APP_VERSION || 'default';

      script.src = `${src}?v=${version}`;
      script.async = async;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));

      document.head.appendChild(script);
    });
  }

  /**
   * Loads scripts in sequence (maintains dependency order)
   * @param {Array<string>} scripts - Array of script paths
   */
  async function loadScriptsInOrder(scripts) {
    for (const src of scripts) {
      try {
        await loadScript(src);
      } catch (err) {
        console.error(`[LOADER] Error loading ${src}:`, err);
      }
    }
  }

  /**
   * Determines which scripts to load based on current page
   */
  function getScriptsForPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Header loads first (injects header component)
    const headerScripts = ['js/header.js'];

    // Core scripts loaded on every page (in dependency order)
    const coreScripts = [
      'js/config.js',
      'js/utils.js',
      'js/footer.js',
      'js/scripts.js'
    ];

    // Page-specific scripts
    const pageScripts = {
      'index.html': ['js/nws-api.js'],
      'dashboard.html': ['js/nws-api.js'],
      'about.html': ['js/changelog.js']
    };

    // Combine: header first, then core, then page-specific
    const scripts = [...headerScripts, ...coreScripts];

    if (pageScripts[currentPage]) {
      scripts.push(...pageScripts[currentPage]);
    }

    return scripts;
  }

  /**
   * Initialize script loading
   * Header loads immediately (synchronously) to avoid flash of unstyled content
   * Other scripts load after DOM is ready
   */
  async function init() {
    // Load header.js immediately (blocks to prevent FOUC)
    await loadScript('js/header.js');

    // Load remaining scripts when DOM is ready
    const loadRemaining = () => {
      const allScripts = getScriptsForPage();
      const remainingScripts = allScripts.slice(1); // Skip header.js (already loaded)
      loadScriptsInOrder(remainingScripts);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadRemaining);
    } else {
      loadRemaining();
    }
  }

  // Start loading scripts immediately
  init();

  // Export loader functions for manual use if needed
  window.ScriptLoader = {
    loadScript,
    loadScriptsInOrder
  };

})();
