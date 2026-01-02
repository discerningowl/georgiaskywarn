/**
 * ──────────────────────────────────────────────────────────────
 * File:   nws-api.js
 * Author: Jack Parks (KQ4JP) <kq4jp@pm.me>
 * Purpose: Shared NWS API utilities for Georgia SKYWARN website
 *          - Fetch functions with timeout and retry logic
 *          - Cache management
 *          - Common constants and configuration
 * Version: 20260102
 * Change-log:
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
  const { NWS_API, FFC_ZONES, CACHE_TTL, CACHE_KEYS } = window.CONFIG;

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
   * @param {string} zones - Comma-separated zone list (default: FFC_ZONES)
   * @param {number} retries - Number of retry attempts
   * @returns {Promise<Object>} - Alert data from API
   */
  async function fetchAlerts(zones = FFC_ZONES, retries = 3) {
    console.log('[NWS API] Fetching alerts...');

    // Fetch from API with retry logic
    for (let i = 0; i < retries; i++) {
      try {
        const url = `${NWS_API.BASE_URL}/alerts/active?zone=${zones}`;
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

      console.log('[NWS API] Fetching latest HWO product...');
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
  let alertDataCache = [];
  const AUTO_REFRESH = window.CONFIG.UI.AUTO_REFRESH_INTERVAL;

  /**
   * Sanitize HTML to prevent XSS
   */
  function sanitizeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  /**
   * Parse HWO text to determine spotter activation status
   * @param {string} productText - HWO product text
   * @returns {Object} - {activated, confidence, matchedText}
   */
  function parseSpotterActivation(productText) {
    if (!productText) {
      return { activated: false, confidence: 'unknown', matchedText: '' };
    }

    // Use activation patterns from CONFIG
    const { HIGH_CONFIDENCE, MEDIUM_CONFIDENCE } = window.CONFIG.ACTIVATION_PATTERNS;

    // Check high confidence patterns
    for (const pattern of HIGH_CONFIDENCE) {
      const match = productText.match(pattern);
      if (match) {
        return { activated: true, confidence: 'high', matchedText: match[0] };
      }
    }

    // Check medium confidence patterns
    for (const pattern of MEDIUM_CONFIDENCE) {
      const match = productText.match(pattern);
      if (match) {
        return { activated: true, confidence: 'medium', matchedText: match[0] };
      }
    }

    return { activated: false, confidence: 'none', matchedText: '' };
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

    let statusHTML = '';
    const headerClass = 'card-header--green'; // Always green header

    if (activationInfo.activated) {
      const confidenceText = activationInfo.confidence === 'high'
        ? 'HIGH CONFIDENCE'
        : 'POSSIBLE ACTIVATION';

      statusHTML = `
        <div class="alert-item alert-warning outlook-trigger"
             role="button"
             tabindex="0"
             aria-label="Click to view full hazardous weather outlook">
          <div class="alert-header">⚠️ SPOTTER ACTIVATION ${confidenceText}</div>
          <div class="alert-description">
            <p><strong>Matched Text:</strong> "${activationInfo.matchedText}"</p>
            <p><strong>Action Required:</strong> Monitor weather conditions and be prepared to report severe weather to NWS Atlanta via the SKYWARN repeater network.</p>
          </div>
          <div class="alert-meta">
            <small><strong>Outlook Issued:</strong> ${new Date(issuanceTime).toLocaleString()}</small>
          </div>
          <div class="alert-more">Click to view full outlook →</div>
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
            <p>The latest Hazardous Weather Outlook does not indicate spotter activation at this time. Continue to monitor conditions.</p>
          </div>
          <div class="alert-meta">
            <small><strong>Outlook Issued:</strong> ${new Date(issuanceTime).toLocaleString()}</small>
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

    if (!modal || !modalTitle || !modalBody || !currentOutlookData) return;

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

    const content = `
      <div class="outlook-meta" style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-primary);">
        <p><strong>Issued:</strong> ${formattedTime}</p>
        <p><strong>Product ID:</strong> ${currentOutlookData.id || 'N/A'}</p>
      </div>
      <div class="outlook-text">
        <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.5; background: var(--bg-body); padding: 1rem; border-radius: 8px; overflow-x: auto; max-height: 60vh; overflow-y: auto;">${formattedText}</pre>
      </div>
    `;

    modalTitle.textContent = 'Hazardous Weather Outlook - NWS Atlanta (FFC)';
    modalBody.innerHTML = content;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('outlookModalClose')?.focus();
  }

  /**
   * Close the HWO modal
   */
  function closeOutlookModal() {
    const modal = document.getElementById('outlookModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Open alert details modal
   */
  function openAlertModal(alertData) {
    const modal = document.getElementById('alertModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalTitle || !modalBody) return;

    const p = alertData.properties;

    const content = `
      <p><strong>${sanitizeHTML(p.event || 'Weather Alert')}</strong></p>
      ${p.sent ? `<p><strong>Issued:</strong> ${new Date(p.sent).toLocaleString()}</p>` : ''}
      ${p.expires ? `<p><strong>Expires:</strong> ${new Date(p.expires).toLocaleString()}</p>` : ''}
      ${p.areaDesc ? `<p><strong>Areas:</strong> ${sanitizeHTML(p.areaDesc)}</p>` : ''}
      ${p.description ? `<p><strong>Description:</strong><br>${sanitizeHTML(p.description)}</p>` : ''}
      ${p.instruction ? `<p><strong>Instructions:</strong><br>${sanitizeHTML(p.instruction)}</p>` : ''}
      <p style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-primary);">
        <strong>Source:</strong> ${sanitizeHTML(p.senderName || 'NWS')}
      </p>
    `;

    modalTitle.textContent = p.headline || p.event || 'Alert Details';
    modalBody.innerHTML = content;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose')?.focus();
  }

  /**
   * Close alert modal
   */
  function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
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
   * Render all alerts for dashboard
   */
  function renderAllAlerts(data) {
    const features = (data.features || []).filter(f => {
      const p = f.properties;
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

    updateAlertsTimestamp();

    if (uniqueFeatures.length === 0) {
      return `<p class="no-alerts center"><strong>No active alerts in NWS Atlanta (FFC) area.</strong></p>`;
    }

    return uniqueFeatures.map((f, index) => {
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
            <small><strong>Areas:</strong> ${areaDesc} | <strong>Expires:</strong> ${new Date(p.expires).toLocaleString()}</small>
          </div>
          <div class="alert-more">Click for full details →</div>
        </div>`;
    }).join('');
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
   * Update alerts timestamp
   */
  function updateAlertsTimestamp() {
    const elem = document.getElementById('alert-last-update');
    if (elem) {
      const now = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      elem.textContent = `Updated: ${now}`;
    }
  }

  /**
   * Load and display alerts
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
        container.innerHTML = renderAllAlerts(cached);
        attachAlertClickHandlers();
        return;
      }

      // Fetch fresh data
      const data = await fetchAlerts();
      alertsCache.set(data);

      loading.style.display = 'none';
      container.innerHTML = renderAllAlerts(data);
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
   * Update timestamp display
   */
  function updateTimestamp() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const elem = document.getElementById('dashboard-last-update');
    if (elem) {
      elem.textContent = `Updated: ${timeStr}`;
    }
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

  /**
   * Initialize dashboard (call from dashboard.html)
   */
  function initDashboard() {
    console.log('[Dashboard] Initializing...');

    initDashboardModals();

    // Load both outlook and alerts
    const loadBoth = async () => {
      await Promise.all([loadDashboard(), loadAlerts()]);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadBoth);
    } else {
      loadBoth();
    }

    // Auto-refresh both every 5 minutes
    setInterval(loadBoth, AUTO_REFRESH);
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
