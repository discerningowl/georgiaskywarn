/**
 * ──────────────────────────────────────────────────────────────
 * File:   utils.js
 * Author: Jack Parks (KQ4JP) <kq4jp@pm.me>
 * Purpose: Shared utility functions for Georgia SKYWARN website
 * Change-log:
 *   • 2026-01-02b – Added version-based cache invalidation for mobile browsers
 *   • 2026-01-02 – Created shared utilities module
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // Version number for cache invalidation (update when cache structure changes)
  const UTILS_VERSION = '20260102c';
  const VERSION_KEY = 'georgiaskywarn-utils-version';

  /**
   * Clear all localStorage caches if version has changed
   * This forces mobile browsers to fetch fresh data when JavaScript updates
   */
  function checkAndClearOldCaches() {
    try {
      const storedVersion = localStorage.getItem(VERSION_KEY);

      if (storedVersion !== UTILS_VERSION) {
        console.log(`[UTILS] Version change detected (${storedVersion} → ${UTILS_VERSION}), clearing all caches...`);

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
        localStorage.setItem(VERSION_KEY, UTILS_VERSION);
        console.log(`[UTILS] Cache cleared. New version: ${UTILS_VERSION}`);
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
   * @returns {string} - Sanitized HTML
   */
  function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  // Export utilities to global namespace
  window.UTILS = {
    createCache,
    createModalManager,
    fetchJSON,
    sanitizeHTML,
    DOM,
    debounce,
    formatDate,
    getCurrentPage
  };

})();
