/**
 * ──────────────────────────────────────────────────────────────
 * File:   core.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Core configuration and utilities for Georgia SKYWARN website
 *          Merged from config.js + utils.js for better code organization
 * Change-log:
 *   • 2026-01-09 – Created by merging config.js + utils.js
 *                  - Consolidated duplicate functions (openAlertModal, sanitizeHTML, etc.)
 *                  - Reduced total file count from 9 to 7 (-22%)
 *                  - Added enhanced sanitizeHTML with newline conversion
 *                  - Added modal utilities (closeModal, getAlertColorClass, applyModalColor)
 *                  - Added timestamp utilities (updateTimestampElement)
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ========================================================================
  // CONFIGURATION CONSTANTS (from config.js)
  // ========================================================================

  // Cache TTL values (in milliseconds)
  const CACHE_TTL = {
    ALERTS: 5 * 60 * 1000,        // 5 minutes
    HWO: 15 * 60 * 1000,          // 15 minutes
    REPEATERS: 24 * 60 * 60 * 1000 // 24 hours (future use)
  };

  // Cache keys for localStorage
  const CACHE_KEYS = {
    ALERTS: 'ffc-all-watches-warnings',
    HWO: 'ffc-hwo-outlook'
  };

  // NWS API configuration
  const NWS_API = {
    BASE_URL: 'https://api.weather.gov',
    USER_AGENT: 'GeorgiaSKYWARN-Site (kq4jp@pm.me)',
    OFFICE: 'FFC',
    OFFICE_NAME: 'NWS Peachtree City',
    TIMEOUT: 10000, // 10 seconds
    RETRY_DELAY_BASE: 2000, // 2 seconds (for exponential backoff)
    MAX_RETRIES: 3
  };

  // NWS Atlanta forecast zones (96 counties in North and Central Georgia)
  const FFC_ZONES = 'GAZ001,GAZ002,GAZ003,GAZ004,GAZ005,GAZ006,GAZ007,GAZ008,' +
    'GAZ009,GAZ010,GAZ011,GAZ012,GAZ013,GAZ014,GAZ015,GAZ016,' +
    'GAZ017,GAZ018,GAZ019,GAZ020,GAZ021,GAZ022,GAZ023,GAZ024,' +
    'GAZ025,GAZ026,GAZ027,GAZ028,GAZ029,GAZ030,GAZ031,GAZ032,' +
    'GAZ033,GAZ034,GAZ035,GAZ036,GAZ037,GAZ038,GAZ039,GAZ040,' +
    'GAZ041,GAZ042,GAZ043,GAZ044,GAZ045,GAZ046,GAZ047,GAZ048,' +
    'GAZ049,GAZ050,GAZ051,GAZ052,GAZ053,GAZ054,GAZ055,GAZ056,' +
    'GAZ057,GAZ058,GAZ059,GAZ060,GAZ061,GAZ062,GAZ063,GAZ064,' +
    'GAZ065,GAZ066,GAZ067,GAZ068,GAZ069,GAZ070,GAZ071,GAZ072,' +
    'GAZ073,GAZ074,GAZ075,GAZ076,GAZ077,GAZ078,GAZ079,GAZ080,' +
    'GAZ081,GAZ082,GAZ083,GAZ084,GAZ085,GAZ086,GAZ087,GAZ088,' +
    'GAZ089,GAZ090,GAZ091,GAZ092,GAZ093,GAZ094,GAZ095,GAZ096,' +
    'GAZ097,GAZ098,GAZ099,GAZ100,GAZ101,GAZ102,GAZ103,GAZ104,' +
    'GAZ105,GAZ106,GAZ107,GAZ108,GAZ109,GAZ110,GAZ111,GAZ112,' +
    'GAZ113,GAZ114,GAZ115,GAZ116,GAZ117,GAZ118';

  // UI configuration
  const UI = {
    CHANGELOG_MONTHS_TO_SHOW: 6,
    AUTO_REFRESH_INTERVAL: 5 * 60 * 1000, // DEPRECATED: Now using CACHE_TTL values directly for refresh intervals
    SCROLL_OFFSET_MOBILE: 100,
    SCROLL_OFFSET_DESKTOP: 200,
    BACK_TO_TOP_THRESHOLD: 300 // pixels scrolled before showing back-to-top button
  };

  // Alert classification keywords
  const ALERT_TYPES = {
    WARNING: 'warning',
    WATCH: 'watch',
    ADVISORY: 'advisory'
  };

  // SKYWARN activation detection patterns (three-level urgency system)
  // Based on actual NWS Hazardous Weather Outlook language patterns
  // NOTE: Patterns use negative lookahead to exclude "NOT" (e.g., "will NOT be needed")
  const ACTIVATION_PATTERNS = {
    // RED - Activation requested or definitely needed (highest urgency)
    // Explicitly exclude "NOT" using negative lookahead in the right position
    RED: [
      /SPOTTER\s+ACTIVATION\s+IS\s+(?!NOT\s+)REQUESTED/i,
      /SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+IS\s+(?!NOT\s+)REQUESTED/i,
      /SPOTTER\s+ACTIVATION\s+WILL\s+(?!NOT\s+)(?:LIKELY\s+)?BE\s+NEEDED/i,
      /SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+WILL\s+(?!NOT\s+)(?:LIKELY\s+)?BE\s+NEEDED/i,
      /(?!.*\bNOT\b.*ACTIVATE)ACTIVATE.*(?:SKYWARN|SPOTTER)/i,
      /(?:SKYWARN|SPOTTER).*ACTIVATION\s+(?:IS\s+|WILL\s+(?:LIKELY\s+)?BE\s+)?(?!NOT\s+)(?:REQUESTED|NEEDED)/i
    ],

    // YELLOW - Monitor conditions, activation may be needed (medium urgency)
    // Also exclude "NOT" to prevent false positives (e.g., "may NOT be needed")
    YELLOW: [
      /SPOTTER\s+ACTIVATION\s+MAY\s+(?!NOT\s+)BE\s+NEEDED/i,
      /SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+MAY\s+(?!NOT\s+)BE\s+NEEDED/i,
      /(?:SPOTTER|SKYWARN).*(?:REPORTS?\s+)?(?!NOT\s+)(?:ENCOURAGED|POSSIBLE)/i,
      /(?:SPOTTER|SKYWARN).*ACTIVATION.*(?!NOT\s+)(?:POSSIBLE|MAY)/i
    ],

    // GREEN - Stand down, activation not needed (low urgency)
    GREEN: [
      /SPOTTER\s+ACTIVATION\s+(?:IS\s+)?NOT\s+(?:EXPECTED|NEEDED|ANTICIPATED)/i,
      /SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+(?:IS\s+)?NOT\s+(?:EXPECTED|NEEDED|ANTICIPATED)/i,
      /SPOTTER\s+ACTIVATION\s+WILL\s+NOT\s+BE\s+NEEDED/i,
      /SKYWARN\s+(?:SPOTTER\s+)?ACTIVATION\s+WILL\s+NOT\s+BE\s+NEEDED/i,
      /NO\s+(?:SPOTTER\s+)?ACTION\s+NEEDED/i
    ]
  };

  // ========================================================================
  // UTILITY FUNCTIONS (from utils.js)
  // ========================================================================

  // Use APP_VERSION from version.js (single source of truth)
  const VERSION_KEY = 'georgiaskywarn-utils-version';

  /**
   * Clear all localStorage caches if version has changed
   * This forces mobile browsers to fetch fresh data when JavaScript updates
   */
  function checkAndClearOldCaches() {
    try {
      const APP_VERSION = window.APP_VERSION || 'unknown';
      const storedVersion = localStorage.getItem(VERSION_KEY);

      if (storedVersion !== APP_VERSION) {
        console.log(`[UTILS] Version change detected (${storedVersion} → ${APP_VERSION}), clearing all caches...`);

        // Clear all Georgia SKYWARN caches
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('ffc-') || key.startsWith('georgiaskywarn-'))) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach(key => {
          console.log(`[UTILS] Removing stale cache: ${key}`);
          localStorage.removeItem(key);
        });

        // Update stored version
        localStorage.setItem(VERSION_KEY, APP_VERSION);
        console.log(`[UTILS] Cache cleared. New version: ${APP_VERSION}`);
      }
    } catch (err) {
      console.error('[UTILS] Error checking cache version:', err);
    }
  }

  // Run cache version check immediately on load
  checkAndClearOldCaches();

  /**
   * Creates a localStorage cache manager with TTL support
   * @param {string} cacheKey - localStorage key for this cache
   * @param {number} ttl - Time to live in milliseconds
   * @returns {Object} - Cache manager with get/set/clear methods
   */
  function createCache(cacheKey, ttl) {
    return {
      get: () => {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (!cached) return null;

          const { timestamp, data } = JSON.parse(cached);
          const age = Date.now() - timestamp;

          if (age > ttl) {
            localStorage.removeItem(cacheKey);
            return null;
          }

          return data;
        } catch (err) {
          console.error(`Cache get error for ${cacheKey}:`, err);
          return null;
        }
      },

      set: (data) => {
        try {
          const cacheData = {
            timestamp: Date.now(),
            data: data
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (err) {
          console.error(`Cache set error for ${cacheKey}:`, err);
        }
      },

      clear: () => {
        try {
          localStorage.removeItem(cacheKey);
        } catch (err) {
          console.error(`Cache clear error for ${cacheKey}:`, err);
        }
      }
    };
  }

  /**
   * Creates a modal manager for a given modal element
   * @param {string} modalId - ID of the modal backdrop element
   * @param {string} closeButtonId - ID of the close button
   * @returns {Object|null} - Modal manager with open/close methods, or null if modal not found
   */
  function createModalManager(modalId, closeButtonId) {
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeButtonId);

    if (!modal) {
      console.warn(`Modal element #${modalId} not found`);
      return null;
    }

    const open = (contentHTML) => {
      // If content provided and modal has a body element, update it
      const modalBody = modal.querySelector('.modal-body');
      if (contentHTML && modalBody) {
        modalBody.innerHTML = contentHTML;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Attach event listeners
    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }

    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        close();
      }
    });

    return { open, close, element: modal };
  }

  /**
   * Fetches JSON data with error handling
   * @param {string} url - URL to fetch from
   * @param {string} errorContext - Context description for error messages
   * @returns {Promise<any>} - Parsed JSON data
   * @throws {Error} - If fetch fails or response is not ok
   */
  async function fetchJSON(url, errorContext = 'data') {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${errorContext}:`, error);
      throw error;
    }
  }

  /**
   * Sanitizes HTML string to prevent XSS attacks
   * @param {string} str - String to sanitize
   * @param {boolean} convertNewlines - If true, converts \n to <br> tags
   * @returns {string} - Sanitized HTML
   */
  function sanitizeHTML(str, convertNewlines = false) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    let result = div.innerHTML;
    if (convertNewlines) {
      result = result.replace(/\n/g, '<br>');
    }
    return result;
  }

  /**
   * Validates and sanitizes URLs to prevent injection attacks
   * Only allows http: and https: protocols
   * @param {string} url - URL to validate
   * @returns {string} - Sanitized URL or '#' if invalid
   */
  function sanitizeURL(url) {
    if (!url) return '#';

    try {
      const parsed = new URL(url);
      // Only allow http and https protocols
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return url;
      }
      console.warn('[SECURITY] Blocked non-HTTP(S) URL:', url);
    } catch (e) {
      console.warn('[SECURITY] Invalid URL detected:', url);
    }

    return '#'; // Fallback for invalid URLs
  }

  /**
   * DOM manipulation helpers
   */
  const DOM = {
    show: (el, display = 'block') => {
      if (el) el.style.display = display;
    },

    hide: (el) => {
      if (el) el.style.display = 'none';
    },

    toggle: (el, className) => {
      if (el) el.classList.toggle(className);
    },

    addClass: (el, className) => {
      if (el) el.classList.add(className);
    },

    removeClass: (el, className) => {
      if (el) el.classList.remove(className);
    },

    hasClass: (el, className) => {
      return el ? el.classList.contains(className) : false;
    }
  };

  /**
   * Debounces a function call
   * @param {Function} func - Function to debounce
   * @param {number} wait - Milliseconds to wait
   * @returns {Function} - Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Formats a date string to locale string
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date string
   */
  function formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  }

  /**
   * Gets current page filename from URL
   * @returns {string} - Current page filename (e.g., 'index.html')
   */
  function getCurrentPage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    // Cloudflare Pages serves /repeaters without .html extension
    return page.includes('.') ? page : page + '.html';
  }

  /**
   * Closes a modal by removing active class and restoring body scroll
   * @param {string} modalId - ID of the modal element to close
   */
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Determines the color class for an alert based on its event type
   * @param {string} eventType - Alert event type (e.g., "Tornado Warning", "Flood Watch")
   * @returns {string} - Color class name ('red', 'yellow', or 'blue')
   */
  function getAlertColorClass(eventType) {
    if (!eventType) return 'blue';
    const eventLower = eventType.toLowerCase();
    if (eventLower.includes('warning')) return 'red';
    if (eventLower.includes('watch')) return 'yellow';
    return 'blue';
  }

  /**
   * Applies a color class to a modal header element
   * @param {HTMLElement} modalHeader - The modal header element
   * @param {string} colorClass - Color class to apply ('red', 'yellow', 'blue', or 'green')
   */
  function applyModalColor(modalHeader, colorClass) {
    if (!modalHeader) return;
    // Remove all existing color classes
    modalHeader.classList.remove('modal-header--red', 'modal-header--yellow', 'modal-header--blue', 'modal-header--green');
    // Add the new color class
    modalHeader.classList.add(`modal-header--${colorClass}`);
  }

  /**
   * Opens the alert modal and populates it with alert data
   * Unified function to prevent duplication between scripts.js and nws-api.js
   * @param {Object} alertData - Alert data object from NWS API
   * @param {string} modalId - ID of the modal element (default: 'alertModal')
   */
  function openAlertModal(alertData, modalId = 'alertModal') {
    const modal = document.getElementById(modalId);
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalHeader = modal?.querySelector('.modal-header');

    if (!modal || !modalTitle || !modalBody || !modalHeader) return;

    const p = alertData.properties;

    // Determine alert color and apply to modal header
    const colorClass = getAlertColorClass(p.event);
    applyModalColor(modalHeader, colorClass);

    // Set modal title
    modalTitle.textContent = p.event || 'Weather Alert';

    // Build modal body content
    let bodyHTML = `<p><strong>Area:</strong> ${sanitizeHTML(p.areaDesc || 'N/A')}</p>`;

    if (p.headline) {
      bodyHTML += `<p><strong>Headline:</strong> ${sanitizeHTML(p.headline)}</p>`;
    }

    if (p.description) {
      bodyHTML += `<p><strong>Description:</strong></p><p>${sanitizeHTML(p.description, true)}</p>`;
    }

    if (p.instruction) {
      bodyHTML += `<p><strong>Instructions:</strong></p><p>${sanitizeHTML(p.instruction, true)}</p>`;
    }

    if (p.expires) {
      const expiresDate = new Date(p.expires).toLocaleString();
      bodyHTML += `<p><strong>Expires:</strong> ${expiresDate}</p>`;
    }

    modalBody.innerHTML = bodyHTML;

    // Open the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Updates a timestamp element with the current time
   * @param {string} elementId - ID of the element to update
   * @param {string} prefix - Optional prefix text (default: 'Updated: ')
   */
  function updateTimestampElement(elementId, prefix = 'Updated: ') {
    const element = document.getElementById(elementId);
    if (element) {
      const now = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
      element.textContent = `${prefix}${now}`;
    }
  }

  // ========================================================================
  // EXPORTS
  // ========================================================================

  // Export configuration to global namespace
  window.CONFIG = {
    CACHE_TTL,
    CACHE_KEYS,
    NWS_API,
    FFC_ZONES,
    UI,
    ALERT_TYPES,
    ACTIVATION_PATTERNS
  };

  // Export utilities to global namespace
  window.UTILS = {
    createCache,
    createModalManager,
    fetchJSON,
    sanitizeHTML,
    sanitizeURL,
    DOM,
    debounce,
    formatDate,
    getCurrentPage,
    closeModal,
    getAlertColorClass,
    applyModalColor,
    openAlertModal,
    updateTimestampElement
  };

  // Version check logs
  console.log('[CONFIG] Loaded with activation patterns:', Object.keys(ACTIVATION_PATTERNS));
  console.log('[UTILS] Core utilities loaded (merged from config.js + utils.js)');

})();
