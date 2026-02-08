/**
 * ──────────────────────────────────────────────────────────────
 * File:   loader.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Dynamically loads ALL JavaScript files with version-based cache busting
 *          To update cache across entire site: just update APP_VERSION in version.js
 * Change-log:
 *   • 2026-01-10 – Added search.js for sitewide search functionality
 *   • 2026-01-09 – CODE CONSOLIDATION: Updated for merged files (9 files → 7 files)
 *                   - components.js replaces header.js + footer.js
 *                   - core.js replaces config.js + utils.js
 *                   - Reduced file count by 22% while maintaining functionality
 *   • 2026-01-03b – CRITICAL FIX: Fixed script loading order for index.html
 *                   - nws-api.js now loads BEFORE scripts.js (was after)
 *                   - Prevents race condition where initAlerts() tries to use
 *                     window.NWSAPI before it's defined
 *                   - Split page scripts into preScripts (before scripts.js) and
 *                     postScripts (after scripts.js) for proper dependency order
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
    const page = window.location.pathname.split('/').pop() || 'index.html';
    // Cloudflare Pages serves pages without .html extension
    const currentPage = page.includes('.') ? page : page + '.html';

    // Components loads first (header + footer merged)
    const componentScripts = ['js/components.js'];

    // Core scripts loaded on every page (config + utils merged)
    // NOTE: For pages using NWS API, nws-api.js must load BEFORE scripts.js
    // search.js depends on utils.js (in core.js) for cache management
    const coreScripts = ['js/core.js', 'js/search.js'];

    // Page-specific scripts that must load BEFORE scripts.js
    const preScripts = {
      'index.html': ['js/nws-api.js']
    };

    // Page-specific scripts that load AFTER scripts.js
    const postScripts = {
      'about.html': ['js/changelog.js']
    };

    // Combine in correct order: components → core → page-specific pre-scripts → scripts.js → post-scripts
    const scripts = [...componentScripts, ...coreScripts];

    // Add page-specific pre-scripts (must load before scripts.js)
    if (preScripts[currentPage]) {
      scripts.push(...preScripts[currentPage]);
    }

    // Add scripts.js AFTER page-specific dependencies
    scripts.push('js/scripts.js');

    // Add page-specific post-scripts (load after scripts.js)
    if (postScripts[currentPage]) {
      scripts.push(...postScripts[currentPage]);
    }

    return scripts;
  }

  /**
   * Initialize script loading
   * Components loads immediately (synchronously) to avoid flash of unstyled content
   * Other scripts load after DOM is ready
   */
  async function init() {
    // Load components.js immediately (blocks to prevent FOUC)
    await loadScript('js/components.js');

    // Load remaining scripts when DOM is ready
    const loadRemaining = () => {
      const allScripts = getScriptsForPage();
      const remainingScripts = allScripts.slice(1); // Skip components.js (already loaded)
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
