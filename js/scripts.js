/*
 * ──────────────────────────────────────────────────────────────
 * File:   scripts.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Consolidated JavaScript for Georgia SKYWARN website
 *          - XSS sanitization wrapper (sanitizeHTML)
 *          - Page last-updated date display
 *          - Repeater search functionality (repeaters.html)
 *          - Repeater data rendering from JSON (repeaters.html)
 *          - Repeater detail modal (repeaters.html)
 *          - CHIRP and RT Systems CSV export (repeaters.html)
 *          - Repeater health dashboard (repeater-health.html)
 *          - Page navigation toggle (mobile, all pages)
 *          - What to Report modals (spotters.html)
 * NOTE: NWS alert fetching is handled by nws-api.js
 * NOTE: Header/footer/navigation injection is handled by components.js
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
  // NOTE: Theme toggle is now handled in header.js / components.js
  // ========================================================================

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
  // PAGE LAST-UPDATED DATE (all pages except repeaters.html)
  // ========================================================================
  async function updatePageLastUpdated() {
    const dateElement = document.getElementById('page-last-updated');
    if (!dateElement) return;

    try {
      const response = await fetch(window.location.pathname, { method: 'HEAD' });
      const lastModified = response.headers.get('Last-Modified');

      if (lastModified) {
        const date = new Date(lastModified);
        const formatter = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        let formattedDate = formatter.format(date);
        const day = date.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'][
          (day % 100 > 10 && day % 100 < 14) ? 0 : (day % 10 < 4) ? day % 10 : 0
        ];
        formattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`);
        dateElement.textContent = formattedDate;
      } else {
        dateElement.textContent = 'recently';
      }
    } catch (error) {
      console.error('Error fetching page last-updated date:', error);
      dateElement.textContent = 'recently';
    }
  }

  updatePageLastUpdated();

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
   * Renders a repeater table row with new multi-column structure
   * @param {Object} repeater - Repeater object from JSON
   * @returns {string} - HTML table row
   */
  function renderRepeaterRow(repeater) {
    const toneDisplay = repeater.tone || 'None';

    // Build tags array including County Only for non-linked
    let allTags = [];

    // Add County Only badge for non-linked repeaters
    if (!repeater.linked) {
      allTags.push('<span class="badge-county-only">County Only</span>');
    }

    // Add network tags
    if (repeater.tags && repeater.tags.length > 0) {
      repeater.tags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        let badgeClass = 'badge';

        if (tagLower === 'wx4ema' || tagLower === 'wx4ema system') badgeClass = 'badge-wx4ema';
        else if (tagLower === 'wx4ptc' || tagLower === 'wx4ptc system') badgeClass = 'badge-wx4ptc';
        else if (tagLower === 'peach state' || tagLower === 'peach state intertie') badgeClass = 'badge-peach-state';
        else if (tagLower === 'cherry blossom' || tagLower === 'cherry blossom intertie') badgeClass = 'badge-cherry-blossom';
        else if (tagLower === 'se linked repeater') badgeClass = 'badge-se-linked';

        allTags.push(`<span class="${badgeClass}">${sanitizeHTML(tag)}</span>`);
      });
    }

    const tags = allTags.length > 0 ? `<div class="tags-container">${allTags.join('')}</div>` : '—';

    // Internet Links - show system names as badges with indigo color
    const ipLinks = (repeater.iplinks && repeater.iplinks.length > 0)
      ? `<div class="tags-container">${repeater.iplinks.map(link => `<span class="badge-iplink">${sanitizeHTML(link.system)}</span>`).join('')}</div>`
      : '—';

    // Radio Links - list callsigns
    const rfLinks = (repeater.rflinks && repeater.rflinks.length > 0)
      ? repeater.rflinks.map(link => sanitizeHTML(link.linksToCall)).join(', ')
      : '—';

    const countyDisplay = repeater.county ? sanitizeHTML(repeater.county) : '—';

    return `
      <tr class="repeater-row" data-repeater-id="${sanitizeHTML(repeater.id)}">
        <td>
          <strong>${sanitizeHTML(repeater.location)}</strong><br>
          <span style="color: var(--text-secondary); font-size: 0.9rem;">${sanitizeHTML(repeater.callsign)}</span>
        </td>
        <td class="center">
          <strong>${sanitizeHTML(repeater.frequency)}</strong><br>
          <span style="font-size: 0.9rem;">${sanitizeHTML(toneDisplay)}</span>
        </td>
        <td class="center">${countyDisplay}</td>
        <td class="center">${tags}</td>
        <td class="center">${ipLinks}</td>
        <td class="center" style="font-size: 0.9rem;">${rfLinks}</td>
      </tr>`;
  }

  /**
   * Renders all repeaters for repeaters.html (filters by 'linked' attribute)
   */
  async function renderAllRepeaters() {
    const allRepeaters = await fetchRepeaterData();

    // Store globally for modal access
    window.repeatersData = allRepeaters;

    // Render linked repeaters
    const linkedContainer = document.getElementById('linked-repeaters-tbody');
    if (linkedContainer) {
      const linked = allRepeaters
        .filter(r => r.linked === true && r.active !== false)
        .sort((a, b) => {
          const aIsWX4PTC = (a.tags && a.tags.includes('WX4PTC System')) ? 0 : 1;
          const bIsWX4PTC = (b.tags && b.tags.includes('WX4PTC System')) ? 0 : 1;
          return aIsWX4PTC - bIsWX4PTC;
        });
      linkedContainer.innerHTML = linked.length > 0
        ? linked.map(r => renderRepeaterRow(r)).join('')
        : '<tr><td colspan="6">No linked repeaters available.</td></tr>';
    }

    // Render non-linked repeaters
    const nonLinkedContainer = document.getElementById('nonlinked-repeaters-tbody');
    if (nonLinkedContainer) {
      const nonLinked = allRepeaters.filter(r => r.linked === false && r.active !== false);
      nonLinkedContainer.innerHTML = nonLinked.length > 0
        ? nonLinked.map(r => renderRepeaterRow(r)).join('')
        : '<tr><td colspan="6">No non-linked repeaters available.</td></tr>';
    }

    // Set up modal click handlers for all repeater rows
    setupRepeaterModalHandlers();
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
  // REPEATER DETAIL MODAL FUNCTIONALITY
  // ========================================================================

  /**
   * Opens the repeater detail modal with full information
   * @param {string} repeaterId - The repeater ID to display
   */
  function openRepeaterModal(repeaterId) {
    const repeater = window.repeatersData.find(r => r.id === repeaterId);
    if (!repeater) {
      console.error('Repeater not found:', repeaterId);
      return;
    }

    const modal = document.getElementById('repeaterDetailModal');
    const modalBody = document.getElementById('repeaterDetailBody');
    const modalTitle = document.getElementById('repeaterModalTitle');

    modalTitle.textContent = `${repeater.location} - ${repeater.frequency}`;

    // Build modal content
    let html = '';

    // Status messages at top
    html += '<div style="margin-bottom: 1.5rem;">';
    if (repeater.linked) {
      html += '<p style="color: var(--accent-green); font-weight: 700; font-size: 1.1rem;">📡 On demand linking to GA SKYWARN linked repeater system</p>';
    } else {
      html += '<p style="color: var(--accent-orange); font-weight: 700; font-size: 1.1rem;">🏛️ County SKYWARN Only</p>';
    }
    if (repeater.verified === true) {
      html += '<p style="color: var(--accent-blue); font-weight: 700;">✓ RepeaterBook Verified</p>';
    } else if (repeater.verified === false) {
      html += '<p style="color: var(--accent-red); font-weight: 700;">✗ Needs Verification</p>';
    }
    html += '</div>';

    // Tags as badges
    if (repeater.tags && repeater.tags.length > 0) {
      html += '<div style="margin-bottom: 1.5rem;">';
      repeater.tags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        let badgeClass = 'badge';
        if (tagLower === 'wx4ema' || tagLower === 'wx4ema system') badgeClass = 'badge-wx4ema';
        else if (tagLower === 'wx4ptc' || tagLower === 'wx4ptc system') badgeClass = 'badge-wx4ptc';
        else if (tagLower === 'peach state' || tagLower === 'peach state intertie') badgeClass = 'badge-peach-state';
        else if (tagLower === 'cherry blossom' || tagLower === 'cherry blossom intertie') badgeClass = 'badge-cherry-blossom';
        else if (tagLower === 'se linked repeater') badgeClass = 'badge-se-linked';
        html += `<span class="${badgeClass}">${sanitizeHTML(tag)}</span>`;
      });
      html += '</div>';
    }

    // Basic Info
    html += `
      <div class="detail-section">
        <h3>Basic Information</h3>
        <div class="detail-grid">
          <div class="detail-label">Callsign:</div>
          <div class="detail-value">${sanitizeHTML(repeater.callsign)}</div>
          <div class="detail-label">Location:</div>
          <div class="detail-value">${sanitizeHTML(repeater.location)}</div>
          <div class="detail-label">Frequency:</div>
          <div class="detail-value">${sanitizeHTML(repeater.frequency)}</div>
          <div class="detail-label">Tone:</div>
          <div class="detail-value">${sanitizeHTML(repeater.tone || 'None')}</div>
          <div class="detail-label">RepeaterBook:</div>
          <div class="detail-value"><a href="${window.UTILS.sanitizeURL(repeater.refurl)}" target="_blank" rel="noopener noreferrer">View on RepeaterBook →</a></div>`;

    if (repeater.clubName && repeater.clubUrl) {
      html += `
          <div class="detail-label">Sponsor Club:</div>
          <div class="detail-value"><a href="${window.UTILS.sanitizeURL(repeater.clubUrl)}" target="_blank" rel="noopener noreferrer">${sanitizeHTML(repeater.clubName)} →</a></div>`;
    } else if (repeater.clubName) {
      html += `
          <div class="detail-label">Sponsor Club:</div>
          <div class="detail-value">${sanitizeHTML(repeater.clubName)}</div>`;
    }

    html += `
        </div>
      </div>`;

    // Description
    html += `
      <div class="detail-section">
        <h3>Description</h3>
        <p>${sanitizeHTML(repeater.description)}</p>
      </div>`;

    // Internet Links
    if (repeater.iplinks && repeater.iplinks.length > 0) {
      html += '<div class="detail-section">';
      html += '<h3>Internet Linking</h3>';
      html += '<div class="table-wrapper">';
      html += '<table class="repeater-table" style="width: 100%;">';
      html += `
        <thead>
          <tr>
            <th>System</th>
            <th>Node/Extension</th>
            <th>Callsign</th>
            <th>Connection</th>
          </tr>
        </thead>
        <tbody>`;

      repeater.iplinks.forEach(link => {
        const nodeInfo = link.node ? `Node ${link.node}` :
                        link.extension ? `Ext ${link.extension}` : '—';
        const callsign = link.callsign || '—';

        // Generate clickable URL for AllStar and EchoLink
        let linkUrl = '';
        if (link.system && link.node) {
          const systemLower = link.system.toLowerCase();
          if (systemLower === 'allstar') {
            linkUrl = 'https://stats.allstarlink.org/stats/' + link.node;
          } else if (systemLower === 'echolink') {
            linkUrl = 'https://www.repeaterbook.com/repeaters/echolink/node_status.php?node=' + link.node + '&type=search';
          }
        }

        const dataAttr = linkUrl ? ` data-iplink-url="${linkUrl}"` : '';
        const clickableClass = linkUrl ? ' class="clickable-row iplink-row"' : '';

        html += `
          <tr${clickableClass}${dataAttr}>
            <td>${sanitizeHTML(link.system)}${linkUrl ? ' <span class="external-link-icon">↗</span>' : ''}</td>
            <td class="center">${sanitizeHTML(nodeInfo)}</td>
            <td class="center">${sanitizeHTML(callsign)}</td>
            <td class="center">${sanitizeHTML(link.connectionType)}</td>
          </tr>`;
      });

      html += '</tbody></table></div></div>';
    }

    // Radio Links
    if (repeater.rflinks && repeater.rflinks.length > 0) {
      html += '<div class="detail-section">';
      html += '<h3>Radio Linking</h3>';
      html += '<div class="table-wrapper">';
      html += '<table class="repeater-table" style="width: 100%;">';
      html += `
        <thead>
          <tr>
            <th>Callsign</th>
            <th>Location</th>
            <th>Frequency</th>
            <th>Link Type</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>`;

      repeater.rflinks.forEach(link => {
        html += `
          <tr>
            <td class="center">${sanitizeHTML(link.linksToCall)}</td>
            <td>${sanitizeHTML(link.linksToLoc)}</td>
            <td class="center">${sanitizeHTML(link.linksToFreq)}</td>
            <td class="center">${sanitizeHTML(link.linkType)}</td>
            <td class="center">${sanitizeHTML(link.linkMethod)}</td>
          </tr>`;
      });

      html += '</tbody></table></div></div>';
    }

    // Photo URL
    if (repeater.picUrl) {
      html += `
        <div class="detail-section">
          <h3>Station Photos</h3>
          <p><a href="${window.UTILS.sanitizeURL(repeater.picUrl)}" target="_blank" rel="noopener noreferrer">📷 View Photos →</a></p>
        </div>`;
    }

    modalBody.innerHTML = html;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  /**
   * Sets up modal handlers for repeater detail popup
   */
  function setupRepeaterModalHandlers() {
    const modal = document.getElementById('repeaterDetailModal');
    if (!modal) return;

    const closeBtn = document.getElementById('repeaterDetailClose');

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      });
    }

    // Click outside modal to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    // Handle clicks on IP link rows (AllStar, EchoLink)
    modal.addEventListener('click', (e) => {
      const row = e.target.closest('.iplink-row');
      if (row) {
        const url = row.getAttribute('data-iplink-url');
        if (url) {
          e.stopPropagation();
          window.open(url, '_blank');
        }
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    // Add click handlers to all repeater rows
    document.querySelectorAll('.repeater-row').forEach(row => {
      row.addEventListener('click', () => {
        const repeaterId = row.getAttribute('data-repeater-id');
        openRepeaterModal(repeaterId);
      });
    });
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

    // Generate name (callsign + location, max ~20 chars for radio compatibility)
    // Callsign first so truncation keeps callsign visible
    let name = repeater.location;
    if (repeater.callsign && repeater.callsign !== 'Unknown') {
      name = `${repeater.callsign} ${repeater.location}`;
    }
    // Truncate to 20 chars if needed
    name = name.substring(0, 20);

    // Build comment from location + tags
    let comment = repeater.location;
    if (repeater.tags && repeater.tags.length > 0) {
      const tagStr = repeater.tags.join(', ');
      comment = `${repeater.location} - ${tagStr}`;
    }

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
      // Fetch all repeaters and filter for active linked repeaters only
      const allRepeaters = await fetchRepeaterData();
      const linkedRepeaters = allRepeaters.filter(r => r.linked === true && r.active !== false);

      if (linkedRepeaters.length === 0) {
        alert('No linked repeaters found to export.');
        return;
      }

      // Build CSV header
      const header = 'Location,Name,Frequency,Duplex,Offset,Tone,rToneFreq,cToneFreq,DtcsCode,DtcsPolarity,RxDtcsCode,CrossMode,Mode,TStep,Skip,Power,Comment,URCALL,RPT1CALL,RPT2CALL,DVCODE';

      // Build CSV rows
      const rows = linkedRepeaters.map((r, index) => repeaterToChirpRow(r, index));

      // Combine header and rows
      const csvContent = [header, ...rows].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const chirpDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.setAttribute('href', url);
      link.setAttribute('download', `ga-skywarn-repeaters-chirp-${chirpDate}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`✅ Exported ${linkedRepeaters.length} linked SKYWARN repeaters to CHIRP CSV`);
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

    // Generate name (callsign + location, max 16 chars for most radios)
    // Callsign first so truncation keeps callsign visible
    let name = repeater.location;
    if (repeater.callsign && repeater.callsign !== 'Unknown') {
      name = `${repeater.callsign} ${repeater.location}`;
    }
    name = name.substring(0, 16);

    // All repeaters go into Bank 22: Skywarn
    const bank = '22: Skywarn';

    // Build comment from location + tags
    let comment = repeater.location;
    if (repeater.tags && repeater.tags.length > 0) {
      const tagStr = repeater.tags.join(', ');
      comment = `${repeater.location} - ${tagStr}`;
    }

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
      // Fetch all repeaters and filter for active linked repeaters only
      const allRepeaters = await fetchRepeaterData();
      const linkedRepeaters = allRepeaters.filter(r => r.linked === true && r.active !== false);

      if (linkedRepeaters.length === 0) {
        alert('No linked repeaters found to export.');
        return;
      }

      // Build CSV header
      const header = 'Channel Number,Bank,Bank CH #,Receive Frequency,Transmit Frequency,Offset Frequency,Offset Direction,Operating Mode,Name,Tone Mode,CTCSS,Rx CTCSS,DCS,DCS Polarity,Skip,Step,Digital Squelch,Digital Code,Your Callsign,Rpt-1 CallSign,Rpt-2 CallSign,Comment';

      // Build CSV rows - all linked repeaters in Bank 22: Skywarn
      const rows = linkedRepeaters.map((r, index) => {
        return repeaterToRTSystemsRow(r, index, index);
      });

      // Combine header and rows
      const csvContent = [header, ...rows].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const rtDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.setAttribute('href', url);
      link.setAttribute('download', `ga-skywarn-repeaters-rtsystems-${rtDate}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`✅ Exported ${linkedRepeaters.length} linked SKYWARN repeaters to RT Systems CSV`);
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

    // Update repeater validation date (header + export section)
    updateRepeaterValidationDate();

    // Mirror the same human-readable date into the export section
    const exportDateEl = document.getElementById('export-date-display');
    if (exportDateEl) {
      fetch('data/repeaters.json', { method: 'HEAD' }).then(resp => {
        const lm = resp.headers.get('Last-Modified');
        const d = lm ? new Date(lm) : new Date();
        const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        let formattedDate = formatter.format(d);
        const day = d.getDate();
        const suffix = ['th', 'st', 'nd', 'rd'][
          (day % 100 > 10 && day % 100 < 14) ? 0 : (day % 10 < 4) ? day % 10 : 0
        ];
        exportDateEl.textContent = formattedDate.replace(/\d+/, `${day}${suffix}`);
      }).catch(() => { exportDateEl.textContent = 'recently'; });
    }

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
  // REPEATER HEALTH PAGE (repeater-health.html) — Database quality dashboard
  // ========================================================================
  if (currentPage === 'repeater-health.html') {
    async function renderAdminPage() {
      const all = await fetchRepeaterData();

      // ── Categorize ──────────────────────────────────────────────────────
      const inactive   = all.filter(r => r.active === false);
      const active     = all.filter(r => r.active !== false);
      const linked     = all.filter(r => r.linked === true);
      const nonLinked  = all.filter(r => r.linked === false);
      const verified   = all.filter(r => r.verified === true);
      const unverified = all.filter(r => r.verified === false);
      const noCalls    = all.filter(r => r.callsign === 'n0call');
      const noClub     = all.filter(r => !r.clubName);

      // ── Summary stats ───────────────────────────────────────────────────
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('stat-total',      all.length);
      set('stat-active',     active.length);
      set('stat-inactive',   inactive.length);
      set('stat-linked',     linked.length);
      set('stat-nonlinked',  nonLinked.length);
      set('stat-verified',   verified.length);
      set('stat-unverified', unverified.length);
      set('stat-nocall',     noCalls.length);

      // ── Helper: render tags as styled badge pills ────────────────────────
      // Mirrors the badge-class mapping used in renderRepeaterRow() so the
      // health page matches the look of the public repeater tables.
      function tagsToBadges(tags) {
        if (!tags || tags.length === 0) return '—';
        const badges = tags.map(tag => {
          const tagLower = tag.toLowerCase();
          let badgeClass = 'badge';
          if (tagLower === 'wx4ema' || tagLower === 'wx4ema system') badgeClass = 'badge-wx4ema';
          else if (tagLower === 'wx4ptc' || tagLower === 'wx4ptc system') badgeClass = 'badge-wx4ptc';
          else if (tagLower === 'peach state' || tagLower === 'peach state intertie') badgeClass = 'badge-peach-state';
          else if (tagLower === 'cherry blossom' || tagLower === 'cherry blossom intertie') badgeClass = 'badge-cherry-blossom';
          else if (tagLower === 'se linked repeater') badgeClass = 'badge-se-linked';
          return `<span class="${badgeClass}">${sanitizeHTML(tag)}</span>`;
        }).join('');
        return `<div class="tags-container">${badges}</div>`;
      }

      // ── Helper: build a standard 5-col row ──────────────────────────────
      function adminRow(r, col3Label) {
        const tags = tagsToBadges(r.tags);
        const linkedBadge = r.linked
          ? '<span style="color:var(--accent-green);font-weight:700;">✓ Linked</span>'
          : '<span style="color:var(--accent-orange);">County Only</span>';
        return `
          <tr>
            <td><strong>${sanitizeHTML(r.location)}</strong><br>
              <span style="color:var(--text-secondary);font-size:0.9rem;">${sanitizeHTML(r.callsign)}</span></td>
            <td class="center"><strong>${sanitizeHTML(r.frequency)}</strong><br>
              <span style="font-size:0.9rem;">${sanitizeHTML(r.tone || 'None')}</span></td>
            <td class="center">${col3Label !== undefined ? col3Label : linkedBadge}</td>
            <td>${tags}</td>
            <td class="center"><a href="${window.UTILS.sanitizeURL(r.refurl)}" target="_blank" rel="noopener noreferrer">RepeaterBook →</a></td>
          </tr>`;
      }

      // ── Inactive ────────────────────────────────────────────────────────
      set('inactive-count', inactive.length);
      const inactiveTbody = document.getElementById('inactive-repeaters-tbody');
      if (inactiveTbody) {
        inactiveTbody.innerHTML = inactive.length === 0
          ? '<tr><td colspan="5" class="center" style="color:var(--accent-green);">✓ No inactive repeaters.</td></tr>'
          : inactive.map(r => {
              const tags = tagsToBadges(r.tags);
              return `
                <tr>
                  <td><strong>${sanitizeHTML(r.location)}</strong><br>
                    <span style="color:var(--text-secondary);font-size:0.9rem;">${sanitizeHTML(r.callsign)}</span></td>
                  <td class="center"><strong>${sanitizeHTML(r.frequency)}</strong><br>
                    <span style="font-size:0.9rem;">${sanitizeHTML(r.tone || 'None')}</span></td>
                  <td>${tags}</td>
                  <td>${sanitizeHTML(r.statusNote || '—')}</td>
                  <td class="center"><a href="${window.UTILS.sanitizeURL(r.refurl)}" target="_blank" rel="noopener noreferrer">RepeaterBook →</a></td>
                </tr>`;
            }).join('');
      }

      // ── Unverified ──────────────────────────────────────────────────────
      set('unverified-count', unverified.length);
      const unverifiedTbody = document.getElementById('unverified-repeaters-tbody');
      if (unverifiedTbody) {
        unverifiedTbody.innerHTML = unverified.length === 0
          ? '<tr><td colspan="5" class="center" style="color:var(--accent-green);">✓ All repeaters verified.</td></tr>'
          : unverified.map(r => adminRow(r)).join('');
      }

      // ── Unknown callsigns ────────────────────────────────────────────────
      set('nocall-count', noCalls.length);
      const noCallTbody = document.getElementById('nocall-repeaters-tbody');
      if (noCallTbody) {
        noCallTbody.innerHTML = noCalls.length === 0
          ? '<tr><td colspan="5" class="center" style="color:var(--accent-green);">✓ No unknown callsigns.</td></tr>'
          : noCalls.map(r => adminRow(r)).join('');
      }

      // ── Missing club ─────────────────────────────────────────────────────
      set('noclub-count', noClub.length);
      const noClubTbody = document.getElementById('noclub-repeaters-tbody');
      if (noClubTbody) {
        noClubTbody.innerHTML = noClub.length === 0
          ? '<tr><td colspan="5" class="center" style="color:var(--accent-green);">✓ All repeaters have club info.</td></tr>'
          : noClub.map(r => adminRow(r)).join('');
      }
    }

    renderAdminPage();
  }

  // ========================================================================
  // PAGE NAVIGATION TOGGLE (Mobile - accessible real button)
  // ========================================================================
  const pageNav = document.querySelector('.page-nav');
  const pageNavToggle = pageNav ? pageNav.querySelector('.page-nav-toggle') : null;

  if (pageNav && pageNavToggle) {
    // Toggle on button click (keyboard and pointer accessible)
    pageNavToggle.addEventListener('click', () => {
      const isOpen = pageNav.classList.toggle('active');
      pageNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when a link is clicked
    pageNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        pageNav.classList.remove('active');
        pageNavToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside the nav
    document.addEventListener('click', (e) => {
      if (!pageNav.contains(e.target) && pageNav.classList.contains('active')) {
        pageNav.classList.remove('active');
        pageNavToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pageNav.classList.contains('active')) {
        pageNav.classList.remove('active');
        pageNavToggle.setAttribute('aria-expanded', 'false');
        pageNavToggle.focus();
      }
    });
  }

  // ========================================================================
  // PAGE-NAV ACTIVE-SECTION INDICATOR (T2.8, 2026-05-16 — revised)
  // Marks the current section's nav pill with .is-active as the user scrolls.
  //
  // Why not IntersectionObserver: the first revision used a narrow rootMargin
  // band to detect "the section currently being read." On pages with tall
  // sections (e.g. repeaters.html where the Linked Repeaters table is 1000+px),
  // a section can fully OCCUPY the band without its bbox-edge intersection
  // changing, so no observer callback fires — the previous .is-active sticks.
  //
  // The revised approach: on every scroll/resize, find the LAST section whose
  // top edge has crossed below a trigger line near the top of the viewport.
  // Always picks the right section regardless of section height. The
  // `requestAnimationFrame` throttle keeps perf cost negligible.
  // ========================================================================
  if (pageNav) {
    const navLinks = Array.from(pageNav.querySelectorAll('a[href^="#"]'));
    const pairs = []; // [{ section, link }] in document order

    navLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const section = id ? document.getElementById(id) : null;
      if (section) pairs.push({ section, link });
    });

    // Sort by document order so we can walk top→bottom and pick the last
    // section whose top has crossed the trigger line.
    pairs.sort((a, b) => {
      const pos = a.section.compareDocumentPosition(b.section);
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    if (pairs.length) {
      // Trigger line: the LARGER of (sticky-stack bottom + 24px buffer) or
      // 33% down the viewport. The 33% lower-bound is the important part —
      // without it, the highlight only flips when a section header has
      // already scrolled past the sticky nav, which feels laggy. With it,
      // the highlight flips as soon as the next section's header reaches
      // the upper-third of the viewport, matching the user's reading focus.
      // (This matches the docs.stripe.com / Tailwind docs convention.)
      const getTriggerY = () => {
        const headerEl = document.querySelector('.header');
        const navEl = document.querySelector('.page-nav');
        const headerH = headerEl ? headerEl.getBoundingClientRect().height : 0;
        const navH = navEl ? navEl.getBoundingClientRect().height : 0;
        const stickyOffset = headerH + navH + 24;
        const upperThird = window.innerHeight * 0.33;
        return Math.max(stickyOffset, upperThird);
      };

      // End-of-page anchor: if the user scrolls to within 4px of the
      // document bottom, force the LAST section active. Otherwise the
      // last section may never trigger if its top doesn't cross the
      // trigger line before the scroll bottom is reached.
      const isAtBottom = () =>
        (window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight - 4;

      function updateActive() {
        const triggerY = getTriggerY();
        let activeLink = null;

        if (isAtBottom()) {
          activeLink = pairs[pairs.length - 1].link;
        } else {
          for (const { section, link } of pairs) {
            if (section.getBoundingClientRect().top <= triggerY) {
              activeLink = link; // keep walking; last one wins
            } else {
              break; // sections are sorted; remainder are further down
            }
          }
        }

        for (const { link } of pairs) {
          link.classList.toggle('is-active', link === activeLink);
        }
      }

      // rAF-throttled scroll/resize listeners. Passive scroll = no input blocking.
      let ticking = false;
      const schedule = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          updateActive();
          ticking = false;
        });
      };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);

      // Initial state (and re-run after a tick in case layout shifts).
      updateActive();
      setTimeout(updateActive, 100);
    }
  }

  // ========================================================================
  // WHAT TO REPORT MODALS (spotters.html)
  // ========================================================================

  const REPORT_DATA = {
    tornado: {
      title: 'Tornadoes, Funnel Clouds & Wall Clouds',
      colorClass: 'modal-header--tornado',
      sections: [
        {
          heading: 'What to Report',
          items: [
            '<strong>Tornado</strong> — A rotating column of air in contact with the ground. Report immediately.',
            '<strong>Funnel cloud</strong> — Rotating condensation funnel not touching the ground.',
            '<strong>Wall cloud</strong> — A persistent, lowering cloud base with visible rotation.'
          ]
        },
        {
          heading: 'Information to Include',
          items: [
            'Your location (county, nearest cross streets)',
            'Direction of movement and approximate speed',
            'Estimated width and appearance (rope, wedge, stovepipe)',
            'Any damage observed (structures, trees, vehicles)',
            'Time of observation'
          ]
        },
        {
          heading: 'Safety Reminder',
          items: [
            'Never chase a tornado. Report from a safe, sturdy shelter.',
            'Do not attempt to photograph if it puts you at risk.',
            'Move to an interior room on the lowest floor if a tornado is approaching.'
          ]
        }
      ]
    },
    hail: {
      title: 'Hail',
      colorClass: 'modal-header--hail',
      sections: [
        {
          heading: 'Reportable Threshold',
          items: [
            'Quarter size (1 inch) or larger is the official NWS reporting threshold for severe hail.',
            'Smaller hail is still worth reporting if it causes damage.'
          ]
        },
        {
          heading: 'Size Reference Chart',
          items: [
            'Pea — 1/4 inch',
            'Marble / Mothball — 1/2 inch',
            'Penny — 3/4 inch',
            'Nickel — 7/8 inch',
            '<strong>Quarter — 1 inch (severe threshold)</strong>',
            'Half Dollar — 1 1/4 inch',
            'Ping Pong Ball — 1 1/2 inch',
            'Golf Ball — 1 3/4 inch',
            'Tennis Ball — 2 1/2 inch',
            'Baseball — 2 3/4 inch',
            'Softball — 4 inch'
          ]
        },
        {
          heading: 'Information to Include',
          items: [
            'Size of the <em>largest</em> stone observed (use reference above)',
            'Measured diameter if possible (ruler is best)',
            'Any damage — vehicles, crops, windows, roofing',
            'Your location and time of observation'
          ]
        }
      ]
    },
    wind: {
      title: 'Damaging Winds',
      colorClass: 'modal-header--wind',
      sections: [
        {
          heading: 'Reportable Threshold',
          items: [
            'Measured gusts of <strong>58 mph or greater</strong> qualify as severe.',
            'Any wind causing structural damage should be reported regardless of measured speed.'
          ]
        },
        {
          heading: 'What Qualifies',
          items: [
            'Measured gust ≥58 mph from an anemometer or weather station',
            'Large branches (3 inches diameter or greater) broken or downed',
            'Entire trees uprooted or snapped',
            'Roof damage — shingles, panels, or structural damage',
            'Downed power lines (do NOT approach — call 911 and report to NWS)',
            'Vehicles pushed off road or overturned',
            'Any structural damage to buildings'
          ]
        },
        {
          heading: 'Information to Include',
          items: [
            'Measured wind speed and instrument used, if available',
            'Type and extent of damage',
            'Whether damage is isolated or widespread',
            'Your location and time of observation'
          ]
        }
      ]
    },
    flood: {
      title: 'Flooding',
      colorClass: 'modal-header--flood',
      sections: [
        {
          heading: 'What to Report',
          items: [
            'Water over any roadway — even a few inches is dangerous and reportable.',
            'Rising river or stream levels approaching or exceeding banks.',
            'Water entering structures or threatening property.',
            'Vehicles or people stranded by floodwater.'
          ]
        },
        {
          heading: 'Information to Include',
          items: [
            'Exact location — road name/number, mile marker, or cross streets',
            'Estimated water depth on roadway (ankle, knee, waist, etc.)',
            'Whether water is <strong>rising, steady, or falling</strong>',
            'Whether flow is standing or moving (and approximate speed)',
            'Any vehicles stranded or structures threatened',
            'Time flooding began or was first observed'
          ]
        },
        {
          heading: 'Safety Reminder',
          items: [
            '<strong>Turn Around, Don\'t Drown.</strong> Never drive through flooded roads.',
            'Just 6 inches of fast-moving water can knock a person down.',
            '12 inches of water can carry away a small vehicle.',
            'Report from a safe location — do not enter floodwater.'
          ]
        }
      ]
    },
    winter: {
      title: 'Winter Weather',
      colorClass: 'modal-header--winter',
      sections: [
        {
          heading: 'What to Report',
          items: [
            'Snow accumulation (any measurable amount)',
            'Ice accumulation on roads, trees, or power lines',
            'Sleet or freezing rain affecting travel',
            'Visibility reductions due to blowing snow'
          ]
        },
        {
          heading: 'Measurement Guidelines',
          items: [
            '<strong>Snow depth:</strong> Measure from an unobstructed, flat surface away from drifts. Take multiple measurements and average them.',
            '<strong>Ice glaze:</strong> Estimate thickness on a horizontal surface (e.g., car hood, deck railing).',
            '<strong>Sleet:</strong> Report accumulation depth the same as snow.',
            'Report new accumulation since your last observation, not total seasonal depth.'
          ]
        },
        {
          heading: 'Information to Include',
          items: [
            'Type of precipitation (snow, sleet, freezing rain, mixed)',
            'Accumulation depth in inches (snow/sleet) or ice thickness',
            'Road conditions — bare, wet, slushy, snow-covered, icy',
            'Visibility if significantly reduced',
            'Your location and time of observation'
          ]
        }
      ]
    },
    lightning: {
      title: 'Lightning',
      colorClass: 'modal-header--lightning',
      sections: [
        {
          heading: 'What to Report',
          items: [
            'Lightning-caused injury or death',
            'Structure fire caused by lightning strike',
            'Significant property damage from a lightning strike',
            'Power outage or utility equipment damage caused by lightning'
          ]
        },
        {
          heading: 'Information to Include',
          items: [
            'Nature of damage or injury',
            'Number of injuries or fatalities (if any)',
            'Address or location of structure/equipment affected',
            'Whether emergency services have been notified (911)',
            'Time of the strike'
          ]
        },
        {
          heading: 'Safety Reminder',
          items: [
            'If someone is struck, call 911 immediately — lightning strike victims are safe to touch.',
            'Do not shelter under trees, near metal fences, or in open water.',
            'The 30-30 rule: if thunder follows lightning in under 30 seconds, seek shelter.'
          ]
        }
      ]
    }
  };

  function buildReportModalContent(data) {
    return data.sections.map(section => {
      const items = section.items.map(item => `<li style="margin-bottom:0.4rem;">${item}</li>`).join('');
      return `<h4 style="margin:1rem 0 0.5rem; color:var(--text-primary);">${section.heading}</h4><ul style="margin:0 0 0 1.25rem; padding:0;">${items}</ul>`;
    }).join('');
  }

  const reportModal = document.getElementById('reportModal');
  const reportModalClose = document.getElementById('reportModalClose');
  const reportModalTitle = document.getElementById('reportModalTitle');
  const reportModalHeader = document.getElementById('reportModalHeader');
  const reportModalBody = document.getElementById('reportModalBody');

  if (reportModal) {
    // Open modal when clicking a report card
    document.querySelectorAll('.report-card-clickable').forEach(card => {
      const openModal = () => {
        const key = card.dataset.report;
        const data = REPORT_DATA[key];
        if (!data) return;
        reportModalTitle.textContent = data.title;
        reportModalHeader.className = `modal-header ${data.colorClass}`;
        reportModalBody.innerHTML = buildReportModalContent(data);
        reportModal.classList.add('active');
        reportModal.setAttribute('aria-hidden', 'false');
        reportModalClose.focus();
      };
      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
      });
    });

    // Close modal
    const closeReportModal = () => {
      reportModal.classList.remove('active');
      reportModal.setAttribute('aria-hidden', 'true');
    };
    reportModalClose.addEventListener('click', closeReportModal);
    reportModal.addEventListener('click', (e) => { if (e.target === reportModal) closeReportModal(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reportModal.classList.contains('active')) closeReportModal();
    });
  }

})();
