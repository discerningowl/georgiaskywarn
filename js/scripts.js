/*
 * ──────────────────────────────────────────────────────────────
 * File:   scripts.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Consolidated JavaScript for Georgia SKYWARN website
 *          - Footer loading
 *          - Site navigation toggle (site-nav hamburger menu on mobile)
 *          - Page navigation (sticky horizontal bar, always visible)
 *          - Back-to-top button
 *          - NWS Alert fetching (consolidated from inline scripts)
 *          - Repeater search functionality (repeaters.html)
 *          - Security hardening (XSS prevention, error handling)
 *          - Performance optimizations (debouncing, caching)
 * Change-log:
 *   • 2026-01-02 – Security fixes: URL sanitization, tone sanitization
 *   • 2025-12-06 – Created consolidated script file to replace
 *     inline scripts across all pages
 *   • 2025-12-06 – Security & performance review fixes:
 *     - Added XSS sanitization for alert content
 *     - Added localStorage error handling
 *     - Pre-computed FFC zones constant
 *     - Debounced scroll events
 *     - Added interval cleanup on page unload
 *     - Consolidated alert fetching logic
 *   • 2025-12-06 – Fixed repeater search functionality:
 *     - Moved inline search script to external file (CSP compliance)
 *     - Added repeater search and clear button functionality
 *     - Includes Ctrl/Cmd+K keyboard shortcut for search focus
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ========================================================================
  // CONSTANTS & CONFIGURATION (using centralized CONFIG module)
  // ========================================================================
  const { CACHE_KEYS, CACHE_TTL } = window.CONFIG;

  // Global interval reference for cleanup
  let alertRefreshInterval = null;

  // Lazy-initialize cache manager only when needed
  let alertCache = null;
  function getAlertCache() {
    if (!alertCache && window.UTILS) {
      alertCache = window.UTILS.createCache(CACHE_KEYS.ALERTS, CACHE_TTL.ALERTS);
    }
    return alertCache;
  }

  // ========================================================================
  // NOTE: Theme toggle is now handled in header.js
  // ========================================================================

  // ========================================================================
  // MODAL SYSTEM FOR ALERT DETAILS
  // ========================================================================

  // Global alert data cache (for modal access)
  let alertDataCache = [];

  // Initialize modal manager using UTILS
  const alertModal = window.UTILS.createModalManager('alertModal', 'modalClose');

  function openAlertModal(alertData) {
    if (!alertModal) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    if (!modalTitle || !modalBody) return;

    const p = alertData.properties;
    const sanitize = window.UTILS.sanitizeHTML;

    const content = `
      <p><strong>${sanitize(p.event || 'Weather Alert')}</strong></p>
      ${p.sent ? `<p><strong>Issued:</strong> ${new Date(p.sent).toLocaleString()}</p>` : ''}
      ${p.expires ? `<p><strong>Expires:</strong> ${new Date(p.expires).toLocaleString()}</p>` : ''}
      ${p.areaDesc ? `<p><strong>Areas:</strong> ${sanitize(p.areaDesc)}</p>` : ''}
      ${p.description ? `<p><strong>Description:</strong><br>${sanitize(p.description)}</p>` : ''}
      ${p.instruction ? `<p><strong>Instructions:</strong><br>${sanitize(p.instruction)}</p>` : ''}
      <p style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-primary);">
        <strong>Source:</strong> ${sanitize(p.senderName || 'NWS')}
      </p>
    `;

    modalTitle.textContent = p.headline || p.event || 'Alert Details';
    modalBody.innerHTML = content;
    alertModal.open();
    document.getElementById('modalClose')?.focus();
  }

  // ========================================================================
  // SECURITY: XSS SANITIZATION (local variant with newline handling)
  // ========================================================================

  /**
   * Sanitizes HTML content to prevent XSS attacks
   * Uses UTILS.sanitizeHTML with additional newline-to-br conversion
   * @param {string} str - The string to sanitize
   * @returns {string} - HTML-safe string with newlines as <br>
   */
  function sanitizeHTML(str) {
    if (!str) return '';
    return window.UTILS.sanitizeHTML(str).replace(/\n/g, '<br>');
  }

  // ========================================================================
  // NOTE: Cache management now handled by NWSAPI.createCache()
  // ========================================================================

  // ========================================================================
  // NWS ALERT FETCHING (NOW USES NWSAPI MODULE)
  // ========================================================================

  /**
   * Fetches active alerts from NWS API with caching
   * Uses NWSAPI.fetchAlerts() for actual API calls
   * @returns {Promise<Object>} - Alert data from API or cache
   */
  async function fetchAlerts() {
    const cache = getAlertCache();

    // Check cache first
    const cached = cache ? cache.get() : null;
    if (cached) return cached;

    // Fetch from API using shared NWSAPI module
    const data = await window.NWSAPI.fetchAlerts();

    // Cache the result
    if (cache) cache.set(data);

    return data;
  }

  /**
   * Updates the timestamp display
   */
  function updateTimestamp() {
    const timeElement = document.getElementById('alert-last-update');
    if (timeElement) {
      const now = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      timeElement.textContent = `Updated: ${now}`;
    }
  }

  /**
   * Renders alerts for the main page (warnings only)
   * @param {Object} data - Alert data from API
   * @returns {string} - HTML string for alerts
   */
  function renderWarningsOnly(data) {
    const features = (data.features || []).filter(f => {
      const p = f.properties;
      // 1. Must be issued by NWS Peachtree City
      // 2. Event name must contain "Warning" (case-insensitive)
      return p.senderName?.includes('NWS Peachtree City') &&
             p.event?.toLowerCase().includes('warning');
    });

    // Deduplicate alerts by unique ID only
    // NWS API returns same alert multiple times for different zones
    const uniqueFeatures = [];
    const seenIds = new Set();

    features.forEach(f => {
      const p = f.properties;
      const id = f.id || p?.id;

      // Skip if we've seen this ID
      if (id && seenIds.has(id)) {
        return; // Duplicate by ID
      }

      // New unique alert
      if (id) seenIds.add(id);
      uniqueFeatures.push(f);
    });

    updateTimestamp();

    if (uniqueFeatures.length === 0) {
      return `<p class="no-alerts center"><strong>No active warnings in NWS Atlanta (FFC) area.</strong></p>`;
    }

    return uniqueFeatures.map((f, index) => {
      alertDataCache[index] = f; // Cache for modal access
      const p = f.properties;
      // Truncate BEFORE sanitizing to avoid breaking HTML tags
      const rawDesc = p.description || '';
      const truncatedDesc = rawDesc.length > 200 ? rawDesc.substring(0, 200) + '...' : rawDesc;
      const shortDesc = sanitizeHTML(truncatedDesc);
      const headline = sanitizeHTML(p.headline || p.event);
      const areaDesc = sanitizeHTML(p.areaDesc);

      return `
        <div class="alert-item alert-warning"
             data-alert-index="${index}"
             role="button"
             tabindex="0"
             aria-label="Click for full alert details">
          <div class="alert-header">${headline} – <strong>WARNING</strong></div>
          <div class="alert-description">${shortDesc}</div>
          <div class="alert-meta">
            <small><strong>Areas:</strong> ${areaDesc} | <strong>Expires:</strong> ${new Date(p.expires).toLocaleString()}</small>
          </div>
          <div class="alert-more">Click for full details →</div>
        </div>`;
    }).join('');
  }

  /**
   * Renders all alerts for the alerts page (warnings, watches, other)
   * @param {Object} data - Alert data from API
   * @returns {string} - HTML string for alerts
   */
  function renderAllAlerts(data) {
    const features = (data.features || []).filter(f => {
      const p = f.properties;
      // Filter by NWS Peachtree City only
      return p.senderName?.includes('NWS Peachtree City');
    });

    // Deduplicate alerts by unique ID only
    // NWS API returns same alert multiple times for different zones
    const uniqueFeatures = [];
    const seenIds = new Set();

    features.forEach(f => {
      const p = f.properties;
      const id = f.id || p?.id;

      // Skip if we've seen this ID
      if (id && seenIds.has(id)) {
        return; // Duplicate by ID
      }

      // New unique alert
      if (id) seenIds.add(id);
      uniqueFeatures.push(f);
    });

    updateTimestamp();

    if (uniqueFeatures.length === 0) {
      return `<p class="no-alerts center"><strong>No active watches or warnings in NWS Atlanta (FFC) area.</strong></p>`;
    }

    return uniqueFeatures.map((f, index) => {
      alertDataCache[index] = f; // Cache for modal access
      const p = f.properties;
      const isWarning = p.event?.toLowerCase().includes('warning');
      const isWatch = p.event?.toLowerCase().includes('watch');
      const type = isWarning ? 'WARNING' : isWatch ? 'WATCH' : 'ALERT';
      const colorClass = isWarning ? 'alert-warning' : isWatch ? 'alert-watch' : 'alert-other';

      // Truncate BEFORE sanitizing to avoid breaking HTML tags
      const rawDesc = p.description || '';
      const truncatedDesc = rawDesc.length > 200 ? rawDesc.substring(0, 200) + '...' : rawDesc;
      const shortDesc = sanitizeHTML(truncatedDesc);
      const headline = sanitizeHTML(p.headline || p.event);
      const areaDesc = sanitizeHTML(p.areaDesc);

      return `
        <div class="alert-item ${colorClass}"
             data-alert-index="${index}"
             role="button"
             tabindex="0"
             aria-label="Click for full alert details">
          <div class="alert-header">${headline} – <strong>${type}</strong></div>
          <div class="alert-description">${shortDesc}</div>
          <div class="alert-meta">
            <small><strong>Areas:</strong> ${areaDesc} | <strong>Expires:</strong> ${new Date(p.expires).toLocaleString()}</small>
          </div>
          <div class="alert-more">Click for full details →</div>
        </div>`;
    }).join('');
  }

  /**
   * Initializes alert loading for a page
   * @param {boolean} warningsOnly - If true, show only warnings; if false, show all alerts
   */
  async function initAlerts(warningsOnly = false) {
    const container = document.getElementById('alerts-container');
    const loading = document.getElementById('alerts-loading');

    if (!container || !loading) return; // Not on an alerts page

    const hide = el => el.style.display = 'none';
    const show = (el, html = '') => { el.innerHTML = html; el.style.display = 'block'; };

    try {
      const data = await fetchAlerts();
      hide(loading);
      const rendered = warningsOnly ? renderWarningsOnly(data) : renderAllAlerts(data);
      show(container, rendered);

      // Attach click handlers for modal (CSP-compliant event delegation)
      attachAlertClickHandlers();

      // Background refresh every 5 minutes (respects cache)
      alertRefreshInterval = setInterval(async () => {
        try {
          const freshData = await fetchAlerts();
          const rendered = warningsOnly ? renderWarningsOnly(freshData) : renderAllAlerts(freshData);
          show(container, rendered);
          // Re-attach handlers after refresh (container innerHTML was replaced)
          attachAlertClickHandlers();
        } catch (err) {
          console.error('Background refresh failed:', err);
          // Don't clear existing alerts - keep showing cached data
        }
      }, window.CONFIG.UI.AUTO_REFRESH_INTERVAL);
    } catch (err) {
      hide(loading);
      const errorMsg = `
        <div class="callout warning">
          <p class="center">
            <strong>Unable to load alerts at this time.</strong><br>
            The National Weather Service API may be temporarily unavailable.<br>
            Please check <a href="https://www.weather.gov/ffc/" target="_blank" rel="noopener noreferrer">NWS Atlanta</a> directly for current alerts.
          </p>
        </div>
      `;
      show(container, errorMsg);
      console.error('Alert fetch error:', err);
    }
  }

  /**
   * Click handler for alert items (defined once, reused via delegation)
   */
  function handleAlertClick(e) {
    const alertItem = e.target.closest('.alert-item');
    if (alertItem) {
      const index = alertItem.getAttribute('data-alert-index');
      if (alertDataCache[index]) {
        openAlertModal(alertDataCache[index]);
      }
    }
  }

  /**
   * Keyboard handler for alert items
   */
  function handleAlertKeypress(e) {
    if (e.key === 'Enter') {
      const alertItem = e.target.closest('.alert-item');
      if (alertItem) {
        const index = alertItem.getAttribute('data-alert-index');
        if (alertDataCache[index]) {
          openAlertModal(alertDataCache[index]);
        }
      }
    }
  }

  /**
   * Attaches click handlers to alert items for modal display (CSP-compliant)
   * Removes old listeners before adding new ones to prevent stacking
   */
  function attachAlertClickHandlers() {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    // Remove old listeners first (prevent duplicates on refresh)
    container.removeEventListener('click', handleAlertClick);
    container.removeEventListener('keypress', handleAlertKeypress);

    // Add fresh listeners
    container.addEventListener('click', handleAlertClick);
    container.addEventListener('keypress', handleAlertKeypress);
  }

  // ========================================================================
  // NOTE: Footer injection is now handled in footer.js
  // ========================================================================

  // ========================================================================
  // NOTE: Site navigation toggle is now handled in header.js
  // ========================================================================

  // ========================================================================
  // NOTE: Back-to-top button is now handled in header.js
  // ========================================================================

  // ========================================================================
  // PAGE-SPECIFIC INITIALIZATION
  // ========================================================================

  // Detect which page we're on and initialize alerts accordingly
  const currentPage = window.UTILS.getCurrentPage();

  if (currentPage === 'index.html' || currentPage === '') {
    // Main page - warnings only
    initAlerts(true);
  } else if (currentPage === 'alerts.html') {
    // Alerts page - all alerts
    initAlerts(false);
  }

  // ========================================================================
  // REPEATER SEARCH FUNCTIONALITY (repeaters.html only)
  // ========================================================================
  if (currentPage === 'repeaters.html') {
    const searchInput = document.getElementById('repeater-search');
    const clearButton = document.getElementById('clear-search');
    const resultsCount = document.getElementById('search-results');

    if (searchInput) {
      function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        // Query rows dynamically to include JSON-loaded content and badges
        const tables = document.querySelectorAll('.repeater-table tbody');
        const allRows = Array.from(tables).flatMap(tbody =>
          Array.from(tbody.querySelectorAll('tr'))
        );

        allRows.forEach(row => {
          // Get all text content including badges
          const text = row.textContent.toLowerCase();
          const matches = text.includes(searchTerm);

          if (matches) {
            row.classList.remove('hidden');
            visibleCount++;
          } else {
            row.classList.add('hidden');
          }
        });

        // Update results count
        if (searchTerm === '') {
          resultsCount.textContent = '';
        } else if (visibleCount === 0) {
          resultsCount.textContent = '⚠️ No repeaters found matching your search.';
          resultsCount.style.color = 'var(--accent-red)';
        } else if (visibleCount === allRows.length) {
          resultsCount.textContent = `✅ Showing all ${visibleCount} repeaters.`;
          resultsCount.style.color = 'var(--text-secondary)';
        } else {
          resultsCount.textContent = `✅ Found ${visibleCount} of ${allRows.length} repeaters.`;
          resultsCount.style.color = 'var(--accent-green)';
        }

        // Show/hide clear button based on search input
        if (clearButton) {
          clearButton.classList.toggle('visible', searchTerm.length > 0);
        }
      }

      function clearSearch() {
        searchInput.value = '';
        performSearch();
        searchInput.focus();
      }

      // Event listeners
      searchInput.addEventListener('input', performSearch);
      searchInput.addEventListener('search', performSearch); // Triggered by ESC or clear button in browser
      if (clearButton) {
        clearButton.addEventListener('click', clearSearch);
      }

      // Keyboard shortcut: Ctrl/Cmd + K to focus search
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      });
    }
  }

  // ========================================================================
  // REPEATER DATA RENDERING (JSON-based)
  // ========================================================================

  /**
   * Fetches repeater data from JSON file
   * @param {string} filename - JSON filename (linked-repeaters.json or nonlinked-repeaters.json)
   * @returns {Promise<Array>} - Array of repeater objects
   */
  async function fetchRepeaterData(filename) {
    try {
      const response = await fetch(filename);
      if (!response.ok) throw new Error(`Failed to load ${filename}`);
      return await response.json();
    } catch (error) {
      console.error(`Error loading repeater data: ${error}`);
      return [];
    }
  }

  /**
   * Renders a repeater table row with badges from tags array
   * @param {Object} repeater - Repeater object from JSON
   * @returns {string} - HTML table row
   */
  function renderRepeaterRow(repeater) {
    const locationHTML = repeater.url
      ? `<a href="${window.UTILS.sanitizeURL(repeater.url)}" target="_blank" rel="noopener noreferrer">${sanitizeHTML(repeater.location)}</a>`
      : sanitizeHTML(repeater.location);

    // Render badges from tags array - displayed below location
    const badges = (repeater.tags && repeater.tags.length > 0)
      ? '<div class="repeater-badges">' + repeater.tags.map(tag => {
          const tagLower = tag.toLowerCase();
          let badgeClass = 'badge';

          if (tagLower === 'hub') badgeClass = 'badge-hub';
          else if (tagLower === 'wx4ptc') badgeClass = 'badge-wx4ptc';
          else if (tagLower === 'peach state') badgeClass = 'badge-peach-state';
          else if (tagLower === 'cherry blossom') badgeClass = 'badge-cherry-blossom';

          return `<span class="${badgeClass}">${sanitizeHTML(tag)}</span>`;
        }).join('') + '</div>'
      : '';

    const toneText = repeater.tone ? ` (${sanitizeHTML(repeater.tone)})` : '';

    return `
      <tr>
        <td><div>${locationHTML}</div>${badges}</td>
        <td class="freq">${sanitizeHTML(repeater.frequency)}${toneText}</td>
        <td>${sanitizeHTML(repeater.description)}</td>
      </tr>`;
  }

  /**
   * Renders all linked repeaters for repeaters.html
   */
  async function renderLinkedRepeaters() {
    const container = document.getElementById('linked-repeaters-tbody');
    if (!container) return;

    const repeaters = await fetchRepeaterData('data/linked-repeaters.json');

    if (repeaters.length === 0) {
      container.innerHTML = '<tr><td colspan="3">No linked repeaters available.</td></tr>';
      return;
    }

    container.innerHTML = repeaters.map(r => renderRepeaterRow(r)).join('');
  }

  /**
   * Renders all non-linked repeaters for repeaters.html
   */
  async function renderNonLinkedRepeaters() {
    const container = document.getElementById('nonlinked-repeaters-tbody');
    if (!container) return;

    const repeaters = await fetchRepeaterData('data/nonlinked-repeaters.json');

    if (repeaters.length === 0) {
      container.innerHTML = '<tr><td colspan="3">No non-linked repeaters available.</td></tr>';
      return;
    }

    container.innerHTML = repeaters.map(r => renderRepeaterRow(r)).join('');
  }

  // Initialize repeater tables for repeaters.html
  if (currentPage === 'repeaters.html') {
    Promise.all([
      renderLinkedRepeaters(),
      renderNonLinkedRepeaters()
    ]).then(() => {
      // Re-initialize search after tables are loaded
      const searchInput = document.getElementById('repeater-search');
      if (searchInput) {
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  }

  // ========================================================================
  // PAGE NAVIGATION TOGGLE (Mobile Hamburger Menu)
  // ========================================================================
  const pageNav = document.querySelector('.page-nav');

  if (pageNav) {
    // Toggle page-nav menu on mobile when clicking the page-nav container
    pageNav.addEventListener('click', (e) => {
      // Only toggle if clicking on the page-nav itself (not links) and on mobile
      if (window.innerWidth <= 768 && !e.target.closest('a')) {
        pageNav.classList.toggle('active');
      }
    });

    // Close page-nav when clicking a link
    const pageNavLinks = pageNav.querySelectorAll('a');
    pageNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        pageNav.classList.remove('active');
      });
    });

    // Close page-nav when clicking outside (on mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 &&
          !pageNav.contains(e.target) &&
          pageNav.classList.contains('active')) {
        pageNav.classList.remove('active');
      }
    });
  }

  // ========================================================================
  // CLEANUP ON PAGE UNLOAD
  // ========================================================================
  window.addEventListener('beforeunload', () => {
    if (alertRefreshInterval) {
      clearInterval(alertRefreshInterval);
      alertRefreshInterval = null;
    }
  });

})();
