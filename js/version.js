/**
 * ──────────────────────────────────────────────────────────────
 * File:   version.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Single source of truth for cache-busting version number
 *          UPDATE THIS VERSION NUMBER to force cache refresh across ALL pages
 * Change-log:
 *   • 2026-01-02 – Created centralized version management
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ========================================================================
  // UPDATE THIS VERSION NUMBER TO FORCE CACHE REFRESH ACROSS ENTIRE SITE
  // ========================================================================
  const APP_VERSION = '20260208h';

  // Export to global namespace
  window.APP_VERSION = APP_VERSION;

  console.log(`[VERSION] Georgia SKYWARN v${APP_VERSION}`);

})();
