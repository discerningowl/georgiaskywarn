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
 *   • 2026-01-09 – Standardized modal header color classes
 *     - Unified color classes: --red, --yellow, --blue, --green
 *     - Warnings: red, Watches: yellow, Other alerts: blue
 *     - Fixed bug where watches were incorrectly showing red
 *     - Now consistent with HWO activation colors
 *   • 2026-01-09 – Major restructuring: dashboard.html → index.html
 *     - Removed renderWarningsOnly() function (no longer needed)
 *     - Updated initAlerts() to always show all alert types
 *     - Removed page detection for old index.html warnings-only view
 *     - Dashboard initialization now handled by nws-api.js auto-detection
 *   • 2026-01-09 – Added dynamic repeater validation date display
 *     - Fetches Last-Modified header from data/repeaters.json
 *     - Displays formatted date (e.g., "January 9th, 2026") on repeaters.html
 *     - Auto-updates when repeaters.json file is modified
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

  // Use UTILS.openAlertModal directly (no need for local wrapper)
  // Kept for backwards compatibility, but simply delegates to UTILS
  function openAlertModal(alertData) {
    window.UTILS.openAlertModal(alertData, 'alertModal');
  }

  // ========================================================================
  // SECURITY: XSS SANITIZATION (local wrapper for UTILS)
  // ========================================================================

  /**
   * Sanitizes HTML content to prevent XSS attacks
   * Uses UTILS.sanitizeHTML with newline conversion enabled
   * @param {string} str - The string to sanitize
   * @returns {string} - HTML-safe string with newlines as <br>
   */
  function sanitizeHTML(str) {
    return window.UTILS.sanitizeHTML(str, true);
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
    window.UTILS.updateTimestampElement('alert-last-update');
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
   * Initializes alert loading for a page (displays all alert types)
   */
  async function initAlerts() {
    const container = document.getElementById('alerts-container');
    const loading = document.getElementById('alerts-loading');

    if (!container || !loading) return; // Not on an alerts page

    const hide = el => el.style.display = 'none';
    const show = (el, html = '') => { el.innerHTML = html; el.style.display = 'block'; };

    try {
      const data = await fetchAlerts();
      hide(loading);
      const rendered = renderAllAlerts(data);
      show(container, rendered);

      // Attach click handlers for modal (CSP-compliant event delegation)
      attachAlertClickHandlers();

      // Background refresh every 5 minutes (respects cache)
      alertRefreshInterval = setInterval(async () => {
        try {
          const freshData = await fetchAlerts();
          const rendered = renderAllAlerts(freshData);
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

  // Detect which page we're on for repeater functionality
  const currentPage = window.UTILS.getCurrentPage();

  // Note: Dashboard page (index.html) initialization is handled by nws-api.js
  // which auto-detects dashboard elements and initializes HWO + alerts

  // ========================================================================
  // REPEATER SEARCH FUNCTIONALITY (repeaters.html only)
  // ========================================================================
  if (currentPage === 'repeaters.html') {
    const searchInput = document.getElementById('repeater-search-input');
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
   * Fetches repeater data from merged JSON file
   * @returns {Promise<Array>} - Array of repeater objects
   */
  async function fetchRepeaterData() {
    try {
      const response = await fetch('data/repeaters.json');
      if (!response.ok) throw new Error('Failed to load repeaters.json');
      return await response.json();
    } catch (error) {
      console.error(`Error loading repeater data: ${error}`);
      return [];
    }
  }

  /**
   * Updates the repeater validation date display with last modified date of repeaters.json
   */
  async function updateRepeaterValidationDate() {
    const dateElement = document.getElementById('repeater-last-updated');
    if (!dateElement) return;

    try {
      const response = await fetch('data/repeaters.json');

      // Get Last-Modified header from response
      const lastModified = response.headers.get('Last-Modified');

      if (lastModified) {
        const date = new Date(lastModified);

        // Format as "January 9th, 2026"
        const formatter = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        let formattedDate = formatter.format(date);

        // Add ordinal suffix (st, nd, rd, th)
        const day = date.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'][
          (day % 100 > 10 && day % 100 < 14) ? 0 : (day % 10 < 4) ? day % 10 : 0
        ];

        // Replace day number with day + suffix
        formattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`);

        dateElement.textContent = formattedDate;
      } else {
        // Fallback: use current date if no Last-Modified header
        const today = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const day = today.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'][
          (day % 100 > 10 && day % 100 < 14) ? 0 : (day % 10 < 4) ? day % 10 : 0
        ];
        let formattedDate = formatter.format(today);
        formattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`);
        dateElement.textContent = formattedDate;
      }
    } catch (error) {
      console.error('Error fetching repeater validation date:', error);
      dateElement.textContent = 'recently';
    }
  }

  /**
   * Renders a repeater table row with badges from tags array
   * @param {Object} repeater - Repeater object from JSON
   * @returns {string} - HTML table row
   */
  function renderRepeaterRow(repeater) {
    // Location link - always link to RepeaterBook refurl
    const locationHTML = repeater.refurl
      ? `<a href="${window.UTILS.sanitizeURL(repeater.refurl)}" target="_blank" rel="noopener noreferrer">${sanitizeHTML(repeater.location)}</a>`
      : sanitizeHTML(repeater.location);

    // Camera icon link (for repeaters with pictures)
    const cameraIcon = repeater.picUrl
      ? `<a href="${window.UTILS.sanitizeURL(repeater.picUrl)}" target="_blank" rel="noopener noreferrer" title="View station photos" style="margin-left: 0.5rem; text-decoration: none;">📷</a>`
      : '';

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
        <td><div>${locationHTML}${cameraIcon}</div>${badges}</td>
        <td class="freq">${sanitizeHTML(repeater.frequency)}${toneText}</td>
        <td>${sanitizeHTML(repeater.description)}</td>
      </tr>`;
  }

  /**
   * Renders all repeaters for repeaters.html (filters by 'linked' attribute)
   */
  async function renderAllRepeaters() {
    const allRepeaters = await fetchRepeaterData();

    // Render linked repeaters
    const linkedContainer = document.getElementById('linked-repeaters-tbody');
    if (linkedContainer) {
      const linked = allRepeaters.filter(r => r.linked === true);
      linkedContainer.innerHTML = linked.length > 0
        ? linked.map(r => renderRepeaterRow(r)).join('')
        : '<tr><td colspan="3">No linked repeaters available.</td></tr>';
    }

    // Render non-linked repeaters
    const nonLinkedContainer = document.getElementById('nonlinked-repeaters-tbody');
    if (nonLinkedContainer) {
      const nonLinked = allRepeaters.filter(r => r.linked === false);
      nonLinkedContainer.innerHTML = nonLinked.length > 0
        ? nonLinked.map(r => renderRepeaterRow(r)).join('')
        : '<tr><td colspan="3">No non-linked repeaters available.</td></tr>';
    }
  }

  /**
   * Renders a weather station table row
   * @param {Object} station - Weather station object from JSON
   * @returns {string} - HTML table row
   */
  function renderWeatherStationRow(station) {
    const callsignBadge = station.callsign
      ? `<div class="repeater-badges"><span class="badge">${sanitizeHTML(station.callsign)}</span></div>`
      : '';

    const freqChannel = `${sanitizeHTML(station.frequency)} (${sanitizeHTML(station.wxChannel)})`;

    return `
      <tr>
        <td><div>${sanitizeHTML(station.location)}</div>${callsignBadge}</td>
        <td class="freq">${freqChannel}</td>
        <td>${sanitizeHTML(station.coverage)}</td>
      </tr>`;
  }

  /**
   * Renders all weather stations for repeaters.html
   */
  async function renderWeatherStations() {
    const container = document.getElementById('weather-stations-tbody');
    if (!container) return;

    try {
      const response = await fetch('data/weather-stations.json');
      if (!response.ok) throw new Error('Failed to load weather-stations.json');
      const stations = await response.json();

      container.innerHTML = stations.length > 0
        ? stations.map(s => renderWeatherStationRow(s)).join('')
        : '<tr><td colspan="3">No weather stations available.</td></tr>';
    } catch (error) {
      console.error(`Error loading weather stations: ${error}`);
      container.innerHTML = '<tr><td colspan="3">Error loading weather stations.</td></tr>';
    }
  }

  // ========================================================================
  // CHIRP CSV EXPORT FUNCTIONALITY
  // ========================================================================

  /**
   * Parses frequency string to extract components for CHIRP CSV
   * @param {string} freqStr - Frequency string like "444.600+" or "145.210-"
   * @returns {Object} - { frequency, duplex, offset }
   */
  function parseFrequency(freqStr) {
    if (!freqStr) return { frequency: '', duplex: '', offset: '0.000000' };

    // Extract duplex direction (last character)
    const lastChar = freqStr.slice(-1);
    const duplex = (lastChar === '+' || lastChar === '-') ? lastChar : '';

    // Extract base frequency (remove duplex character)
    const freqNum = duplex ? freqStr.slice(0, -1) : freqStr;
    const frequency = parseFloat(freqNum);

    // Determine offset based on band
    let offset = '0.000000';
    if (duplex) {
      if (frequency >= 144 && frequency < 148) {
        offset = '0.600000'; // 2 meter band
      } else if (frequency >= 222 && frequency < 225) {
        offset = '1.600000'; // 1.25 meter band
      } else if (frequency >= 420 && frequency < 450) {
        offset = '5.000000'; // 70 cm band
      } else if (frequency >= 50 && frequency < 54) {
        offset = '0.500000'; // 6 meter band
      }
    }

    return {
      frequency: frequency.toFixed(6),
      duplex: duplex,
      offset: offset
    };
  }

  /**
   * Parses tone string to extract numeric value
   * @param {string} toneStr - Tone string like "77.0 Hz" or null
   * @returns {string} - Numeric tone value or default "88.5"
   */
  function parseTone(toneStr) {
    if (!toneStr) return '88.5';
    const match = toneStr.match(/[\d.]+/);
    return match ? match[0] : '88.5';
  }

  /**
   * Converts repeater object to CHIRP CSV row
   * @param {Object} repeater - Repeater object from JSON
   * @param {number} index - Row index for Location column
   * @returns {string} - CSV row string
   */
  function repeaterToChirpRow(repeater, index) {
    const freq = parseFrequency(repeater.frequency);
    const tone = parseTone(repeater.tone);

    // Generate name (location + callsign, max ~20 chars for radio compatibility)
    let name = repeater.location;
    if (repeater.callsign && repeater.callsign !== 'Unknown') {
      name = `${repeater.location} ${repeater.callsign}`;
    }
    // Truncate to 20 chars if needed
    name = name.substring(0, 20);

    // Build comment from all tags (or location if no tags)
    const comment = repeater.tags && repeater.tags.length > 0
      ? repeater.tags.join(', ')
      : repeater.location;

    // CHIRP CSV columns:
    // Location,Name,Frequency,Duplex,Offset,Tone,rToneFreq,cToneFreq,DtcsCode,DtcsPolarity,RxDtcsCode,CrossMode,Mode,TStep,Skip,Power,Comment,URCALL,RPT1CALL,RPT2CALL,DVCODE
    return [
      index,                    // Location (channel number)
      name,                     // Name
      freq.frequency,           // Frequency
      freq.duplex,              // Duplex
      freq.offset,              // Offset
      'TSQL',                   // Tone (Tone Squelch)
      tone,                     // rToneFreq (transmit tone)
      tone,                     // cToneFreq (receive tone)
      '023',                    // DtcsCode
      'NN',                     // DtcsPolarity
      '023',                    // RxDtcsCode
      'Tone->Tone',             // CrossMode
      'FM',                     // Mode
      '5.00',                   // TStep
      '',                       // Skip
      '5.0W',                   // Power
      comment,                  // Comment
      '',                       // URCALL
      '',                       // RPT1CALL
      '',                       // RPT2CALL
      ''                        // DVCODE
    ].join(',');
  }

  /**
   * Downloads CHIRP CSV file for all SKYWARN repeaters
   */
  async function downloadChirpCSV() {
    try {
      // Fetch all repeaters
      const allRepeaters = await fetchRepeaterData();

      if (allRepeaters.length === 0) {
        alert('No repeaters found to export.');
        return;
      }

      // Build CSV header
      const header = 'Location,Name,Frequency,Duplex,Offset,Tone,rToneFreq,cToneFreq,DtcsCode,DtcsPolarity,RxDtcsCode,CrossMode,Mode,TStep,Skip,Power,Comment,URCALL,RPT1CALL,RPT2CALL,DVCODE';

      // Build CSV rows
      const rows = allRepeaters.map((r, index) => repeaterToChirpRow(r, index));

      // Combine header and rows
      const csvContent = [header, ...rows].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', 'ga-skywarn-repeaters-chirp.csv');
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`✅ Exported ${allRepeaters.length} SKYWARN repeaters to CHIRP CSV`);
    } catch (error) {
      console.error('Error generating CHIRP CSV:', error);
      alert('Error generating CSV file. Please try again.');
    }
  }

  /**
   * Opens CHIRP import instructions modal
   */
  function exportChirpLinked() {
    openChirpInstructionsModal();
  }

  // ========================================================================
  // RT SYSTEMS CSV EXPORT FUNCTIONALITY
  // ========================================================================

  /**
   * Calculates TX and RX frequencies from base frequency and duplex
   * @param {string} freqStr - Frequency string like "444.600+" or "145.210-"
   * @returns {Object} - { rxFreq, txFreq, offsetFreq, offsetDir }
   */
  function calculateTxRxFrequencies(freqStr) {
    if (!freqStr) return { rxFreq: '', txFreq: '', offsetFreq: '', offsetDir: 'Simplex' };

    const lastChar = freqStr.slice(-1);
    const duplex = (lastChar === '+' || lastChar === '-') ? lastChar : '';
    const baseFreq = parseFloat(duplex ? freqStr.slice(0, -1) : freqStr);

    // Determine offset based on band
    let offsetMHz = 0;
    if (duplex) {
      if (baseFreq >= 144 && baseFreq < 148) {
        offsetMHz = 0.6; // 2 meter
      } else if (baseFreq >= 222 && baseFreq < 225) {
        offsetMHz = 1.6; // 1.25 meter
      } else if (baseFreq >= 420 && baseFreq < 450) {
        offsetMHz = 5.0; // 70 cm
      } else if (baseFreq >= 50 && baseFreq < 54) {
        offsetMHz = 0.5; // 6 meter
      }
    }

    let rxFreq, txFreq;
    if (duplex === '+') {
      rxFreq = baseFreq;
      txFreq = baseFreq + offsetMHz;
    } else if (duplex === '-') {
      rxFreq = baseFreq;
      txFreq = baseFreq - offsetMHz;
    } else {
      // Simplex
      rxFreq = baseFreq;
      txFreq = baseFreq;
    }

    const offsetDir = duplex === '+' ? 'DUP+' : duplex === '-' ? 'DUP-' : 'Simplex';
    const offsetFreq = offsetMHz > 0 ? `${offsetMHz.toFixed(2)} MHz` : '';

    return {
      rxFreq: rxFreq.toFixed(5),
      txFreq: txFreq.toFixed(5),
      offsetFreq: offsetFreq,
      offsetDir: offsetDir
    };
  }

  /**
   * Determines operating mode based on frequency
   * @param {number} frequency - Frequency in MHz
   * @returns {string} - Operating mode (FM or FM Narrow)
   */
  function getOperatingMode(frequency) {
    // UHF repeaters typically use FM Narrow for better selectivity
    // VHF repeaters use standard FM
    if (frequency >= 420 && frequency < 450) {
      return 'FM'; // Most ham UHF repeaters use 25 kHz (FM)
    }
    return 'FM';
  }

  /**
   * Determines step size based on band
   * @param {number} frequency - Frequency in MHz
   * @returns {string} - Step size
   */
  function getStepSize(frequency) {
    if (frequency >= 420 && frequency < 450) {
      return '25 kHz'; // UHF
    }
    return '5 kHz'; // VHF
  }

  /**
   * Converts repeater object to RT Systems CSV row
   * @param {Object} repeater - Repeater object from JSON
   * @param {number} channelNum - Channel number
   * @param {number} bankChNum - Channel number within bank
   * @returns {string} - CSV row string
   */
  function repeaterToRTSystemsRow(repeater, channelNum, bankChNum) {
    const freqs = calculateTxRxFrequencies(repeater.frequency);
    const tone = parseTone(repeater.tone);
    const baseFreq = parseFloat(freqs.rxFreq);

    // Generate abbreviated name (max 16 chars for most radios)
    let name = repeater.location;
    if (repeater.callsign && repeater.callsign !== 'Unknown') {
      // Use callsign as name for brevity
      name = repeater.callsign;
    }
    name = name.substring(0, 16);

    // All repeaters go into Bank 22: Skywarn
    const bank = '22: Skywarn';

    // Build comment from location and tags
    const tagStr = repeater.tags && repeater.tags.length > 0 ? repeater.tags.join(', ') : '';
    const comment = tagStr || repeater.location;

    // RT Systems CSV columns:
    // Channel Number,Bank,Bank CH #,Receive Frequency,Transmit Frequency,Offset Frequency,Offset Direction,
    // Operating Mode,Name,Tone Mode,CTCSS,Rx CTCSS,DCS,DCS Polarity,Skip,Step,Digital Squelch,Digital Code,
    // Your Callsign,Rpt-1 CallSign,Rpt-2 CallSign,Comment
    return [
      channelNum,                         // Channel Number
      bank,                               // Bank
      bankChNum.toString().padStart(2, '0'), // Bank CH # (zero-padded)
      freqs.rxFreq,                       // Receive Frequency
      freqs.txFreq,                       // Transmit Frequency
      freqs.offsetFreq,                   // Offset Frequency
      freqs.offsetDir,                    // Offset Direction
      getOperatingMode(baseFreq),         // Operating Mode
      name,                               // Name
      'T Sql',                            // Tone Mode (Tone Squelch)
      `${tone} Hz`,                       // CTCSS (transmit tone with Hz)
      `${tone} Hz`,                       // Rx CTCSS (receive tone with Hz)
      '023',                              // DCS
      'Both N',                           // DCS Polarity
      'Off',                              // Skip
      getStepSize(baseFreq),              // Step
      'Off',                              // Digital Squelch
      '0',                                // Digital Code
      '',                                 // Your Callsign
      '',                                 // Rpt-1 CallSign
      '',                                 // Rpt-2 CallSign
      comment                             // Comment
    ].join(',');
  }

  /**
   * Downloads RT Systems CSV file for all SKYWARN repeaters
   */
  async function downloadRTSystemsCSV() {
    try {
      // Fetch all repeaters
      const allRepeaters = await fetchRepeaterData();

      if (allRepeaters.length === 0) {
        alert('No repeaters found to export.');
        return;
      }

      // Build CSV header
      const header = 'Channel Number,Bank,Bank CH #,Receive Frequency,Transmit Frequency,Offset Frequency,Offset Direction,Operating Mode,Name,Tone Mode,CTCSS,Rx CTCSS,DCS,DCS Polarity,Skip,Step,Digital Squelch,Digital Code,Your Callsign,Rpt-1 CallSign,Rpt-2 CallSign,Comment';

      // Build CSV rows - all repeaters in Bank 22: Skywarn
      const rows = allRepeaters.map((r, index) => {
        return repeaterToRTSystemsRow(r, index, index);
      });

      // Combine header and rows
      const csvContent = [header, ...rows].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', 'ga-skywarn-repeaters-rtsystems.csv');
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`✅ Exported ${allRepeaters.length} SKYWARN repeaters to RT Systems CSV`);
    } catch (error) {
      console.error('Error generating RT Systems CSV:', error);
      alert('Error generating CSV file. Please try again.');
    }
  }

  /**
   * Opens RT Systems import instructions modal
   */
  function exportRTSystemsLinked() {
    openRTSystemsInstructionsModal();
  }

  // ========================================================================
  // IMPORT INSTRUCTIONS MODALS
  // ========================================================================

  // Modal managers (initialized on repeaters.html page)
  let chirpInstructionsModal = null;
  let rtSystemsInstructionsModal = null;

  function openChirpInstructionsModal() {
    if (chirpInstructionsModal) chirpInstructionsModal.open();
  }

  function openRTSystemsInstructionsModal() {
    if (rtSystemsInstructionsModal) rtSystemsInstructionsModal.open();
  }

  // Initialize repeater tables for repeaters.html
  if (currentPage === 'repeaters.html') {
    // Initialize modal managers after DOM is ready
    if (window.UTILS) {
      chirpInstructionsModal = window.UTILS.createModalManager('chirpInstructionsModal', 'chirpModalClose');
      rtSystemsInstructionsModal = window.UTILS.createModalManager('rtSystemsInstructionsModal', 'rtSystemsModalClose');
    }

    // Update repeater validation date
    updateRepeaterValidationDate();

    Promise.all([
      renderAllRepeaters(),
      renderWeatherStations()
    ]).then(() => {
      // Re-initialize search after tables are loaded
      const searchInput = document.getElementById('repeater-search-input');
      if (searchInput) {
        searchInput.dispatchEvent(new Event('input'));
      }
    });

    // Attach CSV export button handlers (open modals)
    const exportChirpBtn = document.getElementById('export-chirp-linked');
    if (exportChirpBtn) {
      exportChirpBtn.addEventListener('click', exportChirpLinked);
    }

    const exportRTSystemsBtn = document.getElementById('export-rtsystems-linked');
    if (exportRTSystemsBtn) {
      exportRTSystemsBtn.addEventListener('click', exportRTSystemsLinked);
    }

    // Attach download button handlers inside modals (trigger actual downloads)
    const downloadChirpBtn = document.getElementById('download-chirp-csv');
    if (downloadChirpBtn) {
      downloadChirpBtn.addEventListener('click', downloadChirpCSV);
    }

    const downloadRTSystemsBtn = document.getElementById('download-rtsystems-csv');
    if (downloadRTSystemsBtn) {
      downloadRTSystemsBtn.addEventListener('click', downloadRTSystemsCSV);
    }
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
