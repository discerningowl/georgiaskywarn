/**
 * ──────────────────────────────────────────────────────────────
 * File:   nws-api.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Shared NWS API utilities for Georgia SKYWARN website
 *          - Fetch functions with timeout and retry logic
 *          - Cache management
 *          - Common constants and configuration
 * Version: 20260701a
 * Change-log:
 *   • 2026-07-01a – DATA INTEGRITY FIX: data/*-counties.json restructured
 *                  - Root cause of a real false-match bug: ffc-counties.json's
 *                    GAC codes were systematically wrong (off by -2 or -4 FIPS)
 *                    for ~68 of 96 counties. Filtering by "Floyd" resolved to
 *                    GAC113, which is really Fayette's code, so any Fayette
 *                    alert incorrectly matched a Floyd filter.
 *                  - All 6 data/*-counties.json files rebuilt keyed by county
 *                    name (not GAC code), each storing every NWS code that
 *                    might reference that county: gac, same, and gaz (array,
 *                    since a few counties split into 2 forecast zones).
 *                  - loadFFCCounties() and renderAllAlerts()'s county filter
 *                    updated for the new schema; gacToSameCode() removed now
 *                    that real same/gaz codes are on file instead of derived.
 *                  - Filter now matches on GAC OR GAZ OR SAME OR areaDesc —
 *                    GAZ is a new, authoritative fourth layer (previously
 *                    zone-based products relied on SAME + areaDesc only).
 *   • 2026-06-30c – ROBUSTNESS FIX: County filter now also matches areaDesc
 *                  - geocode.SAME (added in 20260630a) is meant to always be
 *                    county-level, but in practice NWS only reliably
 *                    populates it for EAS-significant warning products.
 *                    Advisory-level products (Heat Advisory, etc.) aren't
 *                    EAS-required, so their SAME arrays can be sparse/empty
 *                    even though the county is plainly named in the alert
 *                  - Added a third match layer: parse properties.areaDesc
 *                    (the "Areas:" county list, always fully populated by
 *                    NWS regardless of product/geocode type) and match
 *                    county names directly as a final, most-reliable check
 *                  - Filter now matches on UGC OR SAME OR areaDesc
 *   • 2026-06-30b – BUG FIX: County filter silently cleared on partial input
 *                  - validateAndFilter() overwrote activeCountyFilter with an
 *                    empty Set whenever the in-progress token was an
 *                    unresolved-but-valid prefix (e.g. typing "Fayet" before
 *                    finishing "Fayette" or picking it from autocomplete)
 *                  - No error was shown (a partial match exists, so
 *                    hasError stayed false), so the alert list silently fell
 *                    back to showing ALL statewide alerts mid-keystroke, with
 *                    no indication the filter wasn't actually applied
 *                  - Fix: when every token is still an unresolved prefix
 *                    (newFilter empty, no error, input non-empty), keep
 *                    whatever activeCountyFilter was already set instead of
 *                    clearing it — display only changes once a token resolves
 *   • 2026-06-30 – BUG FIX: County filter missed zone-based alert products
 *                  - renderAllAlerts() only checked geocode.UGC against GAC
 *                    (county) codes. Warnings (Tornado, Flash Flood, etc.) are
 *                    county-geocoded so this worked for them, but advisory/
 *                    watch products (Heat Advisory, Wind Advisory, etc.) are
 *                    geocoded by forecast ZONE (GAZxxx) — the county filter
 *                    silently matched nothing for those, even when the county
 *                    was clearly listed in areaDesc (reported by Jack: Heat
 *                    Advisory listing "Fayette" didn't show when filtering by
 *                    Fayette county)
 *                  - Added gacToSameCode() + a geocode.SAME check, since SAME
 *                    (EAS FIPS codes) are always county-level regardless of
 *                    product type. Filter now matches on UGC OR SAME.
 *   • 2026-01-10b – ENHANCEMENT: Dynamic alert card header color based on severity
 *                  - Header now changes color: red (warnings), yellow (watches), blue (other), green (none)
 *                  - Matches spotter activation card behavior
 *                  - Updates on both initial load and auto-refresh
 *   • 2026-01-10 – CRITICAL FIX: Changed alert query from zone-based to area-based
 *                  - Now queries ?area=GA instead of ?zone=GAZ001,...
 *                  - Flash flood warnings use COUNTY codes (GAC###), not zone codes
 *                  - Previous zone query missed county-based warnings
 *                  - Now retrieves ALL GA alerts, filters to FFC on client side
 *   • 2026-01-09g – CRITICAL FIX: Added color detection to openAlertModal()
 *                  - Was missing from nws-api.js causing watches to show red
 *                  - Now properly applies --red, --yellow, --blue classes
 *                  - Dashboard alerts now show correct modal colors
 *   • 2026-01-06c – UX: Improved alert formatting - "Expires" now on separate line
 *   • 2026-01-06b – CORS FIX: Removed custom headers that trigger CORS preflight
 *                  - Custom Cache-Control/Pragma headers cause CORS preflight (OPTIONS request)
 *                  - NWS API doesn't support CORS preflight requests, blocks all requests
 *                  - Changed to cache: 'reload' (simple request, no CORS preflight)
 *                  - Only User-Agent header remains (required by NWS, doesn't trigger CORS)
 *   • 2026-01-06a – CRITICAL FIX: Changed cache-busting strategy from URL params to HTTP headers
 *                  - NWS API rejects unknown query parameters with HTTP 400 errors
 *                  - Removed getCacheBustingParam() function (no longer needed)
 *   • 2026-01-06 – MAJOR UPDATE: Dynamic cache-busting and separate refresh timers
 *                  - Changed HWO cache TTL from 4 hours to 15 minutes (in config.js)
 *                  - Split auto-refresh into separate timers: Alerts=5min, HWO=15min
 *                  - Guarantees fresh data while respecting NWS rate limits
 *   • 2026-01-03f – CLEANUP: Remove $$ end-of-message marker from spotter statement display
 *   • 2026-01-03e – UX ENHANCEMENT: Display full SPOTTER INFORMATION STATEMENT
 *                  - Now shows entire spotter statement section instead of just matched phrase
 *                  - Changed label from "Matched Text" to "Spotter Information Statement"
 *                  - Keeps matchedText for pattern detection, displays fullText to users
 *                  - Provides complete context for spotters to understand activation status
 *   • 2026-01-03c – UX IMPROVEMENT: Reformatted activation status display
 *                  - Moved "Matched Text" to bottom of description (was at top)
 *                  - Removed bold formatting from matched text for consistency
 *                  - Changed "Outlook Issued" from <small> to <p> for readability
 *                  - Applied changes to all three levels (RED/YELLOW/GREEN)
 *   • 2026-01-03b – CRITICAL FIX: Improved parseSpotterActivation() accuracy
 *                  - Now extracts and focuses on .SPOTTER INFORMATION STATEMENT. section
 *                  - Added debug logging for pattern matches
 *                  - Changed to use textToSearch instead of full productText
 *   • 2026-01-03 – CRITICAL FIX: Fixed displayActivationStatus() function
 *                  - Replaced non-existent .activated and .confidence properties
 *                  - Now correctly checks activationInfo.level (red/yellow/green)
 *                  - Added proper header color changes for each level
 *   • 2026-01-02j – Added defensive error checking for browser cache issues
 *   • 2026-01-02h – Updated spotter activation to three-level system (RED/YELLOW/GREEN)
 *                   parseSpotterActivation() now returns {level, matchedText}
 *                   displayActivationStatus() handles all three urgency levels
 *   • 2026-01-02 – Initial creation, consolidating NWS API logic
 *                  from scripts.js and dashboard-scripts.js
 * ──────────────────────────────────────────────────────────────
 */

// Export as IIFE to avoid polluting global scope
// Exposes single global: window.NWSAPI
(function () {
  'use strict';

  // ========================================================================
  // CONFIGURATION (using centralized CONFIG module)
  // ========================================================================

  // Import constants from CONFIG module
  const { NWS_API, CACHE_TTL, CACHE_KEYS } = window.CONFIG;

  // ========================================================================
  // COUNTY FILTER STATE
  // ========================================================================
  let ffcCounties = {};        // { "GAC111": "Fayette", ... } (derived from ffcCountyData)
  let ffcCountiesReverse = {}; // { "fayette": "GAC111", ... }
  let ffcCountyData = {};      // { "GAC111": { same: "013111", gaz: ["GAZ054"] }, ... }
  let activeCountyFilter = new Set(); // GAC codes currently filtering alerts

  // NOTE: data/ffc-counties.json (and the other 5 CWA county files) are keyed
  // by county name and store every NWS code that might reference that county:
  //   gac  - county-based UGC code, used by warnings (Tornado, Flash Flood, etc.)
  //   same - 6-digit EAS/SAME FIPS code, always county-level regardless of
  //          product type (drives EAS broadcast triggering)
  //   gaz  - public forecast zone UGC code(s), used by advisory/watch-level
  //          products (Heat Advisory, Wind Advisory, etc.). NOT derivable from
  //          FIPS - independently assigned per NWS directive 10-507. A county
  //          can have more than one zone (e.g. Fulton splits into north/south).
  // Previously this file derived `same` via a FIPS-arithmetic formula
  // (gacToSameCode()) and had no way to match `gaz` at all, silently falling
  // back to the areaDesc text-match layer for every zone-based product. Both
  // gaps are closed now that the data files carry real, NWS-sourced codes.

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  /**
   * Fetch with timeout support
   * @param {string} url - The URL to fetch
   * @param {Object} options - Fetch options
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Response>} - Fetch response
   */
  async function fetchWithTimeout(url, options = {}, timeout = NWS_API.TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: 'reload', // Force revalidation with server, bypass browser cache (no CORS preflight)
        headers: {
          'User-Agent': NWS_API.USER_AGENT,
          ...options.headers
        }
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  // Note: createCache() function now provided by UTILS module

  // ========================================================================
  // NWS API FUNCTIONS
  // ========================================================================

  /**
   * Fetches active alerts from NWS API with retry logic and exponential backoff
   * Query by area=GA to get ALL Georgia alerts (both zone and county-based)
   * Filter to NWS Peachtree City alerts on client side
   * @param {number} retries - Number of retry attempts
   * @returns {Promise<Object>} - Alert data from API
   */
  async function fetchAlerts(retries = 3) {
    console.log('[NWS API] Fetching alerts...');

    // Fetch from API with retry logic
    // IMPORTANT: Query by area=GA to get BOTH zone-based AND county-based alerts
    // (Flash flood warnings use county codes, not zone codes)
    for (let i = 0; i < retries; i++) {
      try {
        const url = `${NWS_API.BASE_URL}/alerts/active?area=GA`;
        console.log('[NWS API] Fetching fresh Georgia alerts (cache: reload)...');
        const resp = await fetchWithTimeout(url);

        // Handle rate limiting and service unavailability
        if (resp.status === 503 || resp.status === 429) {
          if (i < retries - 1) {
            const delay = NWS_API.RETRY_DELAY_BASE * Math.pow(2, i); // Exponential backoff: 2s, 4s, 8s
            console.warn(`[NWS API] Rate limited or service unavailable (${resp.status}), retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }

        if (!resp.ok) {
          throw new Error(`NWS API error: ${resp.status} ${resp.statusText}`);
        }

        const json = await resp.json();
        console.log(`[NWS API] Successfully fetched ${json.features?.length || 0} alerts`);
        return json;

      } catch (err) {
        if (i === retries - 1) {
          console.error('[NWS API] All retry attempts failed:', err);
          throw err;
        }
        // Exponential backoff before retry
        const delay = NWS_API.RETRY_DELAY_BASE * Math.pow(2, i);
        console.warn(`[NWS API] Fetch failed, retrying in ${delay}ms...`, err.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Fetches the latest Hazardous Weather Outlook (HWO) from NWS Atlanta
   * @returns {Promise<Object>} - HWO product data {issuanceTime, productText, id}
   */
  async function fetchHazardousOutlook() {
    console.log('[NWS API] Fetching Hazardous Weather Outlook...');

    try {
      // First, get the list of HWO products for FFC
      const listUrl = `${NWS_API.BASE_URL}/products/types/HWO/locations/${NWS_API.OFFICE}`;
      console.log('[NWS API] Fetching HWO list (cache: reload)...');
      const listResp = await fetchWithTimeout(listUrl);

      if (!listResp.ok) {
        throw new Error(`NWS API error: ${listResp.status} ${listResp.statusText}`);
      }

      const listData = await listResp.json();

      if (!listData['@graph'] || listData['@graph'].length === 0) {
        throw new Error('No HWO products found for FFC');
      }

      // Get the most recent product (first in list)
      const latestProduct = listData['@graph'][0];
      const productUrl = latestProduct['@id'];

      console.log('[NWS API] Fetching latest HWO product (cache: reload)...');
      const productResp = await fetchWithTimeout(productUrl);

      if (!productResp.ok) {
        throw new Error(`Product fetch error: ${productResp.status}`);
      }

      const productData = await productResp.json();

      console.log('[NWS API] Successfully fetched HWO');
      return {
        issuanceTime: productData.issuanceTime,
        productText: productData.productText,
        id: productData.id
      };

    } catch (err) {
      console.error('[NWS API] HWO fetch error:', err);
      throw err;
    }
  }

  // ========================================================================
  // DASHBOARD FUNCTIONS
  // ========================================================================

  // Dashboard-specific cache and state (using UTILS.createCache)
  const dashboardCache = window.UTILS.createCache(CACHE_KEYS.HWO, CACHE_TTL.HWO);
  const alertsCache = window.UTILS.createCache(CACHE_KEYS.ALERTS, CACHE_TTL.ALERTS);
  let currentOutlookData = null;
  let currentActivationLevel = 'green'; // Track current activation level for modal colors
  let alertDataCache = [];
  const AUTO_REFRESH = window.CONFIG.UI.AUTO_REFRESH_INTERVAL;

  /**
   * Sanitize HTML to prevent XSS
   * Uses UTILS.sanitizeHTML with newline conversion
   */
  function sanitizeHTML(str) {
    return window.UTILS.sanitizeHTML(str, true);
  }

  /**
   * Parse HWO text to determine spotter activation status
   * @param {string} productText - HWO product text
   * @returns {Object} - {level: 'red'|'yellow'|'green', matchedText: string, fullText: string}
   */
  function parseSpotterActivation(productText) {
    if (!productText) {
      return { level: 'green', matchedText: '', fullText: '' };
    }

    // Verify CONFIG is loaded correctly
    if (!window.CONFIG || !window.CONFIG.ACTIVATION_PATTERNS) {
      console.error('[NWS API] CONFIG not loaded! Browser may be using cached config.js');
      console.error('[NWS API] Please hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)');
      return { level: 'green', matchedText: '', fullText: '' };
    }

    // Use activation patterns from CONFIG (three-level system)
    const { RED, YELLOW, GREEN } = window.CONFIG.ACTIVATION_PATTERNS;

    // Verify all pattern arrays exist
    if (!RED || !YELLOW || !GREEN) {
      console.error('[NWS API] ACTIVATION_PATTERNS incomplete! Loaded patterns:', Object.keys(window.CONFIG.ACTIVATION_PATTERNS));
      console.error('[NWS API] Expected: RED, YELLOW, GREEN');
      console.error('[NWS API] Browser is loading OLD cached config.js - please hard refresh!');
      return { level: 'green', matchedText: '', fullText: '' };
    }

    // Extract the SPOTTER INFORMATION STATEMENT section for more accurate parsing
    // This section contains the official spotter activation status
    const spotterSectionMatch = productText.match(/\.SPOTTER INFORMATION STATEMENT\.\.\.([\s\S]*?)(?=\n\.\w+|$)/i);
    const textToSearch = spotterSectionMatch ? spotterSectionMatch[1] : productText;
    const fullText = spotterSectionMatch ? spotterSectionMatch[1].trim().replace(/\$\$/g, '') : '';

    console.log('[NWS API] Parsing spotter activation from:', spotterSectionMatch ? 'SPOTTER INFORMATION STATEMENT section' : 'full HWO text');

    // Check RED patterns first (activation requested/likely)
    for (const pattern of RED) {
      const match = textToSearch.match(pattern);
      if (match) {
        console.log('[NWS API] RED activation detected:', match[0]);
        return { level: 'red', matchedText: match[0], fullText };
      }
    }

    // Check YELLOW patterns second (encouraged but not requested)
    // Must check before GREEN to catch "not requested but encouraged" phrasing
    for (const pattern of YELLOW) {
      const match = textToSearch.match(pattern);
      if (match) {
        console.log('[NWS API] YELLOW activation detected:', match[0]);
        return { level: 'yellow', matchedText: match[0], fullText };
      }
    }

    // Check GREEN patterns third (explicit stand down language)
    for (const pattern of GREEN) {
      const match = textToSearch.match(pattern);
      if (match) {
        console.log('[NWS API] GREEN (stand down) detected:', match[0]);
        return { level: 'green', matchedText: match[0], fullText };
      }
    }

    // Default to GREEN if no patterns match (no mention = no activation)
    return { level: 'green', matchedText: '', fullText };
  }

  /**
   * Display spotter activation status in the dashboard
   * @param {Object} activationInfo - Activation info from parseSpotterActivation
   * @param {string} issuanceTime - ISO timestamp
   */
  function displayActivationStatus(activationInfo, issuanceTime) {
    const container = document.getElementById('activation-container');
    const header = document.getElementById('activation-header');

    if (!container || !header) return;

    // Store current activation level for modal header color
    currentActivationLevel = activationInfo.level || 'green';

    let statusHTML = '';
    let headerClass = 'card-header--green';

    if (activationInfo.level === 'red') {
      // RED - Activation requested or likely needed
      headerClass = 'card-header--red';
      statusHTML = `
        <div class="alert-item alert-warning outlook-trigger"
             role="button"
             tabindex="0"
             aria-label="Click to view full hazardous weather outlook">
          <div class="alert-header">🚨 SPOTTER ACTIVATION REQUESTED</div>
          <div class="alert-description">
            <p><strong>Action Required:</strong> Monitor weather conditions and report severe weather to NWS Atlanta via the SKYWARN repeater network. Activation is requested or likely needed.</p>
            ${activationInfo.fullText ? `<p><strong>Spotter Information Statement:</strong><br>${sanitizeHTML(activationInfo.fullText)}</p>` : ''}
          </div>
          <div class="alert-meta">
            <p><strong>Outlook Issued:</strong> ${new Date(issuanceTime).toLocaleString()}</p>
          </div>
          <div class="alert-more">Click to view full outlook →</div>
        </div>
        <div style="margin-top: 1rem;">
          <a href="spotters.html#submitcard" class="btn btn-red">How to Submit Reports →</a>
        </div>
      `;
    } else if (activationInfo.level === 'yellow') {
      // YELLOW - Monitor & report if seen (encouraged but not requested)
      headerClass = 'card-header--yellow';
      statusHTML = `
        <div class="alert-item alert-watch outlook-trigger"
             role="button"
             tabindex="0"
             aria-label="Click to view full hazardous weather outlook">
          <div class="alert-header">⚠️ SPOTTER REPORTS ENCOURAGED</div>
          <div class="alert-description">
            <p><strong>Action:</strong> While spotter activation is not formally requested, you are encouraged to monitor conditions and report any observed severe weather, damaging winds, hail, or heavy rain to NWS Atlanta.</p>
            ${activationInfo.fullText ? `<p><strong>Spotter Information Statement:</strong><br>${sanitizeHTML(activationInfo.fullText)}</p>` : ''}
          </div>
          <div class="alert-meta">
            <p><strong>Outlook Issued:</strong> ${new Date(issuanceTime).toLocaleString()}</p>
          </div>
          <div class="alert-more">Click to view full outlook →</div>
        </div>
        <div style="margin-top: 1rem;">
          <a href="spotters.html#submitcard" class="btn btn-yellow">How to Submit Reports →</a>
        </div>
      `;
    } else {
      statusHTML = `
        <div class="alert-item outlook-trigger"
             role="button"
             tabindex="0"
             aria-label="Click to view full hazardous weather outlook"
             style="background: rgba(74, 211, 142, 0.15); border-left: 4px solid var(--accent-green);">
          <div class="alert-header">✓ No Spotter Activation Currently Required</div>
          <div class="alert-description">
            <p>The latest Hazardous Weather Outlook does not indicate spotter activation at this time. Continue to monitor conditions and always report any severe weather you observe.</p>
            ${activationInfo.fullText ? `<p><strong>Spotter Information Statement:</strong><br>${sanitizeHTML(activationInfo.fullText)}</p>` : ''}
          </div>
          <div class="alert-meta">
            <p><strong>Outlook Issued:</strong> ${new Date(issuanceTime).toLocaleString()}</p>
          </div>
          <div class="alert-more">Click to view full outlook →</div>
        </div>
      `;
    }

    header.className = `card-header ${headerClass}`;
    container.innerHTML = statusHTML;

    // Add event listener to the outlook trigger (CSP-compliant)
    const trigger = container.querySelector('.outlook-trigger');
    if (trigger) {
      trigger.addEventListener('click', openOutlookModal);
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openOutlookModal();
        }
      });
    }
  }

  /**
   * Open the HWO modal
   */
  function openOutlookModal() {
    const modal = document.getElementById('outlookModal');
    const modalTitle = document.getElementById('outlookModalTitle');
    const modalBody = document.getElementById('outlookModalBody');
    const modalHeader = modal?.querySelector('.modal-header');

    if (!modal || !modalTitle || !modalBody || !modalHeader || !currentOutlookData) return;

    // Set modal header color based on current activation level
    modalHeader.classList.remove('modal-header--red', 'modal-header--yellow', 'modal-header--green');
    if (currentActivationLevel === 'red') {
      modalHeader.classList.add('modal-header--red');
    } else if (currentActivationLevel === 'yellow') {
      modalHeader.classList.add('modal-header--yellow');
    } else {
      modalHeader.classList.add('modal-header--green');
    }

    const formattedTime = new Date(currentOutlookData.issuanceTime).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const formattedText = currentOutlookData.productText
      .split('\n')
      .map(line => line.trim())
      .join('\n');

    // Sanitize API-sourced values before inserting into innerHTML
    const safeText = window.UTILS.sanitizeHTML(formattedText, true).replace(/<br>/g, '\n');
    const safeId = window.UTILS.sanitizeHTML(currentOutlookData.id || 'N/A');

    const content = `
      <div class="outlook-meta" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-primary);">
        <p><strong>Issued:</strong> ${formattedTime}</p>
        <p><strong>Product ID:</strong> ${safeId}</p>
      </div>
      <div class="outlook-text">
        <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.5; background: var(--bg-body); padding: 1rem; border-radius: 8px; overflow-x: auto; max-height: 60vh; overflow-y: auto;">${safeText}</pre>
      </div>
    `;

    modalTitle.textContent = 'Hazardous Weather Outlook - NWS Atlanta (FFC)';
    modalBody.innerHTML = content;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('outlookModalClose')?.focus();
  }

  /**
   * Close HWO outlook modal (uses UTILS.closeModal)
   */
  function closeOutlookModal() {
    window.UTILS.closeModal('outlookModal');
  }

  /**
   * Open alert details modal (uses UTILS.openAlertModal)
   */
  function openAlertModal(alertData) {
    window.UTILS.openAlertModal(alertData, 'alertModal');
  }

  /**
   * Close alert modal (uses UTILS.closeModal)
   */
  function closeAlertModal() {
    window.UTILS.closeModal('alertModal');
  }

  /**
   * Initialize dashboard modals
   */
  function initDashboardModals() {
    // Initialize outlook modal
    const outlookModal = document.getElementById('outlookModal');
    if (outlookModal) {
      outlookModal.addEventListener('click', (e) => {
        if (e.target.id === 'outlookModal') closeOutlookModal();
      });

      const outlookCloseBtn = document.getElementById('outlookModalClose');
      if (outlookCloseBtn) outlookCloseBtn.addEventListener('click', closeOutlookModal);
    }

    // Initialize alert modal
    const alertModal = document.getElementById('alertModal');
    if (alertModal) {
      alertModal.addEventListener('click', (e) => {
        if (e.target.id === 'alertModal') closeAlertModal();
      });

      const alertCloseBtn = document.getElementById('modalClose');
      if (alertCloseBtn) alertCloseBtn.addEventListener('click', closeAlertModal);
    }

    // Escape key handler for both modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (outlookModal && outlookModal.classList.contains('active')) {
          closeOutlookModal();
        }
        if (alertModal && alertModal.classList.contains('active')) {
          closeAlertModal();
        }
      }
    });
  }

  /**
   * Format an ISO expiry timestamp as absolute time + relative offset
   * e.g. "5:45 PM EST (in 18 min)" or "5:45 PM EST (expired)"
   * @param {string} isoString - ISO 8601 expiry timestamp
   * @returns {string}
   */
  function formatRelativeExpiry(isoString) {
    if (!isoString) return 'Unknown';
    const expires = new Date(isoString);
    const diffMin = Math.round((expires - Date.now()) / 60000);

    const absTime = expires.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    if (diffMin <= 0) return `${absTime} (expired)`;
    if (diffMin < 60) return `${absTime} (in ${diffMin} min)`;
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return `${absTime} (in ${m === 0 ? `${h}h` : `${h}h ${m}m`})`;
  }

  /**
   * Update the alert-count-summary span in the status bar with live counts.
   * Renders CSS triangle shapes (.legend-shape--triangle) instead of emoji so the
   * alerts row stays visually distinct from the activation-status row (which uses
   * circles). DOM-built to avoid innerHTML/XSS surface.
   * @param {{warnings: number, watches: number, advisories: number}} counts
   */
  function updateAlertCountSummary(counts) {
    const el = document.getElementById('alert-count-summary');
    if (!el) return;
    const { warnings, watches, advisories } = counts;
    const showCounts = (warnings + watches + advisories) > 0;

    // Clear existing content (safe — no HTML injection)
    while (el.firstChild) el.removeChild(el.firstChild);

    function appendSegment(colorClass, count, label) {
      const shape = document.createElement('span');
      shape.className = `legend-shape legend-shape--triangle ${colorClass}`;
      shape.setAttribute('aria-hidden', 'true');
      el.appendChild(shape);
      const text = showCounts ? ` ${count} ${label}` : ` ${label}`;
      el.appendChild(document.createTextNode(text));
    }

    const wLabel  = showCounts && warnings === 1   ? 'Warning'  : 'Warnings';
    const wtLabel = showCounts && watches === 1    ? 'Watch'    : 'Watches';
    const aLabel  = showCounts && advisories === 1 ? 'Advisory' : 'Alerts';

    appendSegment('legend-red',    warnings,    wLabel);
    el.appendChild(document.createTextNode(' | '));
    appendSegment('legend-yellow', watches,     wtLabel);
    el.appendChild(document.createTextNode(' | '));
    appendSegment('legend-blue',   advisories,  aLabel);
  }

  /**
   * Render all alerts for dashboard
   * Filters to show only NWS Peachtree City (FFC) alerts
   * Handles both "NWS Peachtree City" and "NWS Peachtree City GA" sender names
   * @returns {Object} - {html: string, severity: 'red'|'yellow'|'blue'|'green', counts: Object}
   */
  function renderAllAlerts(data) {
    const features = (data.features || []).filter(f => {
      const p = f.properties;
      // Filter for NWS Peachtree City/FFC alerts (includes both zone and county-based alerts)
      return p.senderName?.includes('NWS Peachtree City');
    });

    // Deduplicate by ID
    const uniqueFeatures = [];
    const seenIds = new Set();

    features.forEach(f => {
      const id = f.id || f.properties?.id;
      if (id && seenIds.has(id)) return;
      if (id) seenIds.add(id);
      uniqueFeatures.push(f);
    });

    // Apply county filter if active. Four layers, weakest-to-strongest
    // guarantee, checked in order of cheapness:
    //   1. geocode.UGC vs GAC  — matches county-based warnings (UGC IS a GAC code)
    //   2. geocode.UGC vs GAZ  — matches zone-based advisories/watches directly,
    //      using the real per-county forecast-zone code(s) from ffcCountyData
    //      (a county can have more than one zone, e.g. Fulton N/S)
    //   3. geocode.SAME        — SAME is meant to always carry county FIPS
    //      regardless of product type; used as a second cross-check
    //   4. areaDesc text — NWS's own human-readable "Areas:" county list.
    //      Always fully populated on every alert regardless of product type,
    //      because forecasters write it directly into the product. Kept as a
    //      final fallback for the handful of counties where a GAZ code isn't
    //      yet on file (data/*-counties.json ships an empty `gaz` array for
    //      those rather than a guessed value).
    const activeSameCodes = activeCountyFilter.size > 0
      ? new Set([...activeCountyFilter].map(code => ffcCountyData[code]?.same).filter(Boolean))
      : null;
    const activeGazCodes = activeCountyFilter.size > 0
      ? new Set([...activeCountyFilter].flatMap(code => ffcCountyData[code]?.gaz || []))
      : null;
    const activeCountyNames = activeCountyFilter.size > 0
      ? new Set([...activeCountyFilter].map(code => (ffcCounties[code] || '').toLowerCase()))
      : null;
    const displayFeatures = activeCountyFilter.size > 0
      ? uniqueFeatures.filter(f => {
          const p = f.properties || {};
          const geocode = p.geocode || {};
          const ugc = geocode.UGC || [];
          const ugcMatch = ugc.some(code => activeCountyFilter.has(code));
          const gazMatch = ugc.some(code => activeGazCodes.has(code));
          const sameMatch = (geocode.SAME || []).some(code => activeSameCodes.has(code));
          const areaMatch = (p.areaDesc || '')
            .split(';')
            .map(name => name.trim().toLowerCase())
            .some(name => activeCountyNames.has(name));
          return ugcMatch || gazMatch || sameMatch || areaMatch;
        })
      : uniqueFeatures;

    updateAlertsTimestamp();

    if (displayFeatures.length === 0) {
      const msg = activeCountyFilter.size > 0
        ? '<strong>No active alerts for the selected counties.</strong>'
        : '<strong>No active alerts in NWS Atlanta (FFC) area.</strong>';
      return {
        html: `<p class="no-alerts center">${msg}</p>`,
        severity: 'green',
        counts: { warnings: 0, watches: 0, advisories: 0 }
      };
    }

    // Determine highest severity for header color and count each type
    // Priority: warning (red) > watch (yellow) > other (blue)
    let highestSeverity = 'blue'; // Default to blue for advisories/other
    let warningCount = 0;
    let watchCount = 0;
    let advisoryCount = 0;

    displayFeatures.forEach(f => {
      const p = f.properties;
      if (p.event?.toLowerCase().includes('warning')) warningCount++;
      else if (p.event?.toLowerCase().includes('watch')) watchCount++;
      else advisoryCount++;
    });

    const hasWarning = warningCount > 0;
    const hasWatch = watchCount > 0;

    // Set severity based on highest priority alert type
    if (hasWarning) {
      highestSeverity = 'red';
    } else if (hasWatch) {
      highestSeverity = 'yellow';
    }

    const html = displayFeatures.map((f, index) => {
      alertDataCache[index] = f;
      const p = f.properties;
      const isWarning = p.event?.toLowerCase().includes('warning');
      const isWatch = p.event?.toLowerCase().includes('watch');
      const type = isWarning ? 'WARNING' : isWatch ? 'WATCH' : 'ALERT';
      const colorClass = isWarning ? 'alert-warning' : isWatch ? 'alert-watch' : 'alert-other';

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
            <small><strong>Areas:</strong> ${areaDesc}<br><strong>Expires:</strong> ${formatRelativeExpiry(p.expires)}</small>
          </div>
          <div class="alert-more">Click for full details →</div>
        </div>`;
    }).join('');

    return { html, severity: highestSeverity, counts: { warnings: warningCount, watches: watchCount, advisories: advisoryCount } };
  }

  /**
   * Attach click handlers to alert items
   */
  function attachAlertClickHandlers() {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    const alertItems = container.querySelectorAll('.alert-item');
    alertItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = item.getAttribute('data-alert-index');
        if (alertDataCache[index]) {
          openAlertModal(alertDataCache[index]);
        }
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const index = item.getAttribute('data-alert-index');
          if (alertDataCache[index]) {
            openAlertModal(alertDataCache[index]);
          }
        }
      });
    });
  }

  /**
   * Update alerts timestamp (uses UTILS.updateTimestampElement)
   */
  function updateAlertsTimestamp() {
    window.UTILS.updateTimestampElement('alert-last-update');
  }

  /**
   * Update alert card header color based on severity
   * @param {string} severity - 'red'|'yellow'|'blue'|'green'
   */
  function updateAlertHeaderColor(severity) {
    const header = document.querySelector('#active-alerts .card-header');
    if (!header) return;

    // Remove all color classes
    header.classList.remove('card-header--red', 'card-header--yellow', 'card-header--blue', 'card-header--green');

    // Apply new color class based on severity
    header.classList.add(`card-header--${severity}`);

    console.log(`[Dashboard] Alert header color set to ${severity}`);
  }

  /**
   * Load and display alerts
   * Updates both alert content and card header color based on highest severity
   */
  async function loadAlerts() {
    const container = document.getElementById('alerts-container');
    const loading = document.getElementById('alerts-loading');

    if (!container || !loading) return;

    try {
      // Check cache first
      const cached = alertsCache.get();
      if (cached) {
        loading.style.display = 'none';
        const result = renderAllAlerts(cached);
        container.innerHTML = result.html;
        updateAlertHeaderColor(result.severity);
        updateAlertCountSummary(result.counts);
        attachAlertClickHandlers();
        return;
      }

      // Fetch fresh data
      const data = await fetchAlerts();
      alertsCache.set(data);

      loading.style.display = 'none';
      const result = renderAllAlerts(data);
      container.innerHTML = result.html;
      updateAlertHeaderColor(result.severity);
      updateAlertCountSummary(result.counts);
      attachAlertClickHandlers();

    } catch (err) {
      console.error('[Dashboard] Alerts load error:', err);
      loading.style.display = 'none';
      container.innerHTML = `
        <div class="callout warning">
          <p class="center">
            <strong>Unable to load alerts at this time.</strong><br>
            The National Weather Service API may be temporarily unavailable.<br>
            Please check <a href="https://www.weather.gov/ffc/" target="_blank" rel="noopener noreferrer">NWS Atlanta</a> directly.
          </p>
        </div>
      `;
      // Set header to gray/neutral on error
      updateAlertHeaderColor('blue');
    }
  }

  /**
   * Load and display dashboard
   */
  async function loadDashboard() {
    try {
      // Check cache first
      const cached = dashboardCache.get();
      if (cached) {
        currentOutlookData = cached;
        const activationInfo = parseSpotterActivation(cached.productText);
        displayActivationStatus(activationInfo, cached.issuanceTime);
        hideLoading();
        updateTimestamp();
        return;
      }

      // Fetch fresh data
      const outlook = await fetchHazardousOutlook();
      dashboardCache.set(outlook);
      currentOutlookData = outlook;

      const activationInfo = parseSpotterActivation(outlook.productText);
      displayActivationStatus(activationInfo, outlook.issuanceTime);

      hideLoading();
      updateTimestamp();

    } catch (err) {
      console.error('[Dashboard] Load error:', err);
      hideLoading();
      displayError(err.message || 'Unable to load Hazardous Weather Outlook');
    }
  }

  /**
   * Hide loading skeletons
   */
  function hideLoading() {
    const loadingElements = document.querySelectorAll('.skeleton-loader');
    loadingElements.forEach(elem => {
      elem.style.display = 'none';
    });
  }

  /**
   * Update timestamp display (uses UTILS.updateTimestampElement)
   */
  function updateTimestamp() {
    window.UTILS.updateTimestampElement('dashboard-last-update');
  }

  /**
   * Display error message
   */
  function displayError(message) {
    const container = document.getElementById('activation-container');
    if (container) {
      container.innerHTML = `
        <div class="callout callout-danger">
          <p><strong>Error:</strong> ${message}</p>
          <p>Please try refreshing the page. If the problem persists, visit the <a href="https://www.weather.gov/ffc/" target="_blank" rel="noopener noreferrer">NWS Atlanta website</a> directly.</p>
        </div>
      `;
    }
  }

  // ========================================================================
  // COUNTY FILTER
  // ========================================================================

  /**
   * Load FFC county codes from JSON
   * File format: { "CountyName": { "gac": "GAC111", "same": "013111", "gaz": ["GAZ054"] }, ... }
   */
  async function loadFFCCounties() {
    try {
      const resp = await fetch('data/ffc-counties.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      ffcCounties = {};
      ffcCountiesReverse = {};
      ffcCountyData = {};
      Object.entries(data).forEach(([name, codes]) => {
        ffcCounties[codes.gac] = name;
        ffcCountiesReverse[name.toLowerCase()] = codes.gac;
        ffcCountyData[codes.gac] = codes;
      });
      console.log(`[County Filter] Loaded ${Object.keys(ffcCounties).length} FFC counties`);
    } catch (e) {
      console.error('[County Filter] Failed to load county data:', e);
    }
  }

  /**
   * Get the token currently being typed (text after the last comma)
   */
  function getCurrentToken(value) {
    const parts = value.split(',');
    return parts[parts.length - 1].trim();
  }

  /**
   * Show autocomplete suggestions for the current token
   */
  function showAutocomplete(inputValue) {
    const token = getCurrentToken(inputValue);
    const list = document.getElementById('county-autocomplete-list');
    if (!list) return;

    if (token.length < 3 || Object.keys(ffcCounties).length === 0) {
      list.hidden = true;
      list.innerHTML = '';
      return;
    }

    const tokenLower = token.toLowerCase();
    const matches = Object.entries(ffcCounties)
      .filter(([, name]) => name.toLowerCase().startsWith(tokenLower))
      .sort(([, a], [, b]) => a.localeCompare(b));

    if (matches.length === 0) {
      list.hidden = true;
      list.innerHTML = '';
      return;
    }

    list.innerHTML = matches
      .map(([code, name]) =>
        `<li role="option" data-code="${code}" data-name="${name}" tabindex="-1">${name}</li>`
      )
      .join('');
    // Position below the input wrap (fixed, escapes overflow:hidden on .card)
    const wrap = document.getElementById('county-filter-wrap');
    if (wrap) {
      const rect = wrap.getBoundingClientRect();
      list.style.top   = `${rect.bottom + 4}px`;
      list.style.left  = `${rect.left}px`;
      list.style.width = `${rect.width}px`;
    }
    list.hidden = false;

    list.querySelectorAll('li').forEach(li => {
      li.addEventListener('mousedown', e => {
        e.preventDefault(); // prevent blur firing before click
        selectSuggestion(li.dataset.name);
      });
      li.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); selectSuggestion(li.dataset.name); }
        if (e.key === 'ArrowDown') { e.preventDefault(); (li.nextElementSibling || li).focus(); }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (li.previousElementSibling) li.previousElementSibling.focus();
          else document.getElementById('county-filter-input')?.focus();
        }
        if (e.key === 'Escape') {
          closeAutocomplete();
          document.getElementById('county-filter-input')?.focus();
        }
      });
    });
  }

  /**
   * Replace the current token in the input with the selected county name
   */
  function selectSuggestion(name) {
    const input = document.getElementById('county-filter-input');
    if (!input) return;

    const parts = input.value.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) {
      input.value = name + ', ';
    } else {
      parts[parts.length - 1] = name;
      input.value = parts.join(', ') + ', ';
    }

    closeAutocomplete();
    input.focus();
    const len = input.value.length;
    input.setSelectionRange(len, len);
    validateAndFilter(input.value);
    updateClearButton(input.value);
    localStorage.setItem('county-filter', input.value);
  }

  /**
   * Hide the autocomplete dropdown
   */
  function closeAutocomplete() {
    const list = document.getElementById('county-autocomplete-list');
    if (list) { list.hidden = true; list.innerHTML = ''; }
  }

  /**
   * Toggle the clear button visibility based on input content
   */
  function updateClearButton(value) {
    const btn = document.getElementById('county-filter-clear');
    if (btn) btn.hidden = !value.trim();
  }

  /**
   * Validate all typed tokens, update error state, and apply the filter
   * Error logic:
   *   - Committed tokens (followed by a comma) must exactly match a county name
   *   - Last token (still being typed) only errors if it has 3+ chars and NO autocomplete matches
   */
  function validateAndFilter(inputValue) {
    const wrap = document.getElementById('county-filter-wrap');
    const tokens = inputValue.split(',').map(t => t.trim()).filter(Boolean);

    if (tokens.length === 0) {
      activeCountyFilter.clear();
      if (wrap) wrap.classList.remove('has-error');
      reRenderAlerts();
      return;
    }

    const newFilter = new Set();
    let hasError = false;
    const rawParts = inputValue.split(',');
    const lastPartIsComplete = rawParts[rawParts.length - 1].trim() === '' ||
                               inputValue.trimEnd().endsWith(',');

    tokens.forEach((token, i) => {
      const isLast = i === tokens.length - 1;
      const code = ffcCountiesReverse[token.toLowerCase()];

      if (code) {
        newFilter.add(code);
      } else if (!isLast || lastPartIsComplete) {
        // Committed token that doesn't match → error
        hasError = true;
      } else {
        // Last token still being typed — only error if no partial matches exist
        const hasPartialMatch = token.length >= 3 &&
          !Object.values(ffcCounties).some(name =>
            name.toLowerCase().startsWith(token.toLowerCase())
          );
        if (hasPartialMatch) hasError = true;
      }
    });

    if (wrap) wrap.classList.toggle('has-error', hasError);

    // If every token is still an unresolved-but-valid prefix (nothing
    // committed/selected yet), newFilter is empty with no error. Don't
    // overwrite activeCountyFilter in that case — without this guard, typing
    // a partial county name (e.g. "Fayet") silently clears whatever filter
    // was active and the alert list reverts to showing everything statewide,
    // with no error indicator that the filter isn't actually applied. Keep
    // showing whatever was already filtered until a token resolves.
    if (newFilter.size === 0 && !hasError && tokens.length > 0) {
      reRenderAlerts();
      return;
    }

    activeCountyFilter = newFilter;
    reRenderAlerts();
  }

  /**
   * Re-render the alerts container from cached data (used when filter changes)
   */
  function reRenderAlerts() {
    const container = document.getElementById('alerts-container');
    if (!container) return;
    const cached = alertsCache.get();
    if (!cached) return; // data not loaded yet; loadAlerts() applies filter when it runs

    const result = renderAllAlerts(cached);
    container.innerHTML = result.html;
    updateAlertHeaderColor(result.severity);
    updateAlertCountSummary(result.counts);
    attachAlertClickHandlers();
  }

  /**
   * Initialize the county filter search box and restore any saved filter
   */
  function initCountyFilter() {
    const input = document.getElementById('county-filter-input');
    const clearBtn = document.getElementById('county-filter-clear');
    const list = document.getElementById('county-autocomplete-list');
    if (!input) return;

    // Move dropdown to <body> so position:fixed is relative to the viewport,
    // not the nearest backdrop-filter ancestor (.card has backdrop-filter: blur).
    if (list && list.parentElement !== document.body) {
      document.body.appendChild(list);
    }

    // Restore persisted filter
    const saved = localStorage.getItem('county-filter');
    if (saved) {
      input.value = saved;
      updateClearButton(saved);
      validateAndFilter(saved);
    }

    input.addEventListener('input', () => {
      const val = input.value;
      updateClearButton(val);
      showAutocomplete(val);
      validateAndFilter(val);
      localStorage.setItem('county-filter', val);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        list?.querySelector('li')?.focus();
      }
      if (e.key === 'Escape') closeAutocomplete();
      if (e.key === 'Enter') closeAutocomplete();
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      activeCountyFilter.clear();
      const wrap = document.getElementById('county-filter-wrap');
      if (wrap) wrap.classList.remove('has-error');
      closeAutocomplete();
      updateClearButton('');
      localStorage.removeItem('county-filter');
      reRenderAlerts();
      input.focus();
    });

    // Close dropdown on outside click — check both the filter bar and the list
    // (list is appended to <body> so it's no longer inside #county-filter-bar in DOM)
    document.addEventListener('click', e => {
      const inBar  = e.target.closest('#county-filter-bar');
      const inList = e.target.closest('#county-autocomplete-list');
      if (!inBar && !inList) closeAutocomplete();
    });
  }

  /**
   * Initialize dashboard (called from index.html via loader.js auto-detection)
   */
  function initDashboard() {
    console.log('[Dashboard] Initializing...');

    initDashboardModals();

    // Initial load on page ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', async () => {
        await loadFFCCounties();
        initCountyFilter();
        await Promise.all([loadDashboard(), loadAlerts()]);
      });
    } else {
      (async () => {
        await loadFFCCounties();
        initCountyFilter();
        await Promise.all([loadDashboard(), loadAlerts()]);
      })();
    }

    // Separate auto-refresh timers for alerts and HWO
    // Alerts: Refresh every 5 minutes (time-sensitive)
    setInterval(() => {
      console.log('[Dashboard] Auto-refreshing alerts...');
      loadAlerts();
    }, CACHE_TTL.ALERTS);

    // HWO: Refresh every 15 minutes (slower-changing)
    setInterval(() => {
      console.log('[Dashboard] Auto-refreshing HWO...');
      loadDashboard();
    }, CACHE_TTL.HWO);
  }

  // ========================================================================
  // AUTO-INITIALIZATION
  // ========================================================================

  /**
   * Auto-detect and initialize dashboard if on dashboard page
   */
  function autoInit() {
    // Check if we're on the dashboard page by looking for dashboard-specific elements
    const isDashboardPage = document.getElementById('activation-container') &&
                           document.getElementById('alerts-container') &&
                           document.getElementById('outlookModal');

    if (isDashboardPage) {
      console.log('[NWS API] Dashboard page detected, auto-initializing...');
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
      } else {
        initDashboard();
      }
    }
  }

  // Run auto-initialization
  autoInit();

  // ========================================================================
  // EXPORTS
  // ========================================================================

  // Expose API as global object
  window.NWSAPI = {
    // Utilities
    fetchWithTimeout,

    // API Functions
    fetchAlerts,
    fetchHazardousOutlook,

    // Dashboard Functions
    initDashboard,
    openOutlookModal,
    closeOutlookModal
  };

  console.log('[NWS API] Module loaded successfully');

})();
