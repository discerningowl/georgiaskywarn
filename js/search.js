/**
 * ──────────────────────────────────────────────────────────────
 * File:   search.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Client-side sitewide search functionality with fuzzy matching
 * Dependencies: utils.js (for UTILS.createCache)
 * Change-log:
 *   • 2026-01-10c – BUGFIX: Modal now closes on same-page search results
 *                  - Added click handlers to search result items
 *                  - Modal closes for both same-page (#anchor) and cross-page navigation
 *   • 2026-01-10b – BUGFIX: Fixed cache function calls
 *                  - Changed from UTILS.getFromCache/saveToCache to UTILS.createCache pattern
 *                  - Now matches codebase cache usage pattern
 *   • 2026-01-10 – Initial creation with fuzzy search and modal results
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ============================================================================
  // SEARCH NAMESPACE
  // ============================================================================

  window.SEARCH = window.SEARCH || {};

  // Constants
  const SEARCH_INDEX_URL = 'data/search-index.json';
  const CACHE_KEY = 'site-search-index';
  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours (search index changes infrequently)
  const MIN_QUERY_LENGTH = 2;

  // State
  let searchIndex = null;
  let searchInput = null;
  let searchModal = null;

  // Create cache instance using UTILS.createCache
  const searchCache = window.UTILS.createCache(CACHE_KEY, CACHE_TTL);

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  /**
   * Load search index from cache or fetch from server
   */
  async function loadSearchIndex() {
    // Try cache first
    const cached = searchCache.get();
    if (cached) {
      console.log('[SEARCH] Loaded index from cache');
      return cached;
    }

    // Fetch from server
    try {
      const response = await fetch(SEARCH_INDEX_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch search index: ${response.status}`);
      }
      const data = await response.json();

      // Cache the index
      searchCache.set(data);
      console.log('[SEARCH] Fetched and cached search index');

      return data;
    } catch (error) {
      console.error('[SEARCH] Error loading search index:', error);
      return null;
    }
  }

  // ============================================================================
  // FUZZY SEARCH LOGIC
  // ============================================================================

  /**
   * Calculate similarity score between query and text (0-1 scale)
   * Uses simple fuzzy matching algorithm
   */
  function calculateSimilarity(query, text) {
    if (!query || !text) return 0;

    const q = query.toLowerCase();
    const t = text.toLowerCase();

    // Exact match = highest score
    if (t === q) return 1.0;

    // Contains exact query = high score
    if (t.includes(q)) return 0.8;

    // Check if all query characters appear in order
    let queryIndex = 0;
    for (let i = 0; i < t.length && queryIndex < q.length; i++) {
      if (t[i] === q[queryIndex]) {
        queryIndex++;
      }
    }

    if (queryIndex === q.length) {
      // All characters found in order = medium score
      return 0.5;
    }

    // Count matching characters (case-insensitive)
    const qChars = q.split('');
    const tChars = t.split('');
    let matchCount = 0;

    qChars.forEach(char => {
      if (tChars.includes(char)) {
        matchCount++;
      }
    });

    // Partial match score based on character overlap
    return matchCount / Math.max(q.length, t.length) * 0.3;
  }

  /**
   * Search through the index and return ranked results
   */
  function performSearch(query) {
    if (!searchIndex || !query || query.length < MIN_QUERY_LENGTH) {
      return [];
    }

    const results = [];
    const q = query.toLowerCase();

    // Search through all pages and sections
    for (const [page, pageData] of Object.entries(searchIndex)) {
      // Check page title and description
      const pageTitleScore = calculateSimilarity(q, pageData.title);
      const pageDescScore = calculateSimilarity(q, pageData.description);

      // Search through each section
      pageData.sections.forEach(section => {
        let maxScore = 0;
        let matchType = '';

        // Check heading
        const headingScore = calculateSimilarity(q, section.heading);
        if (headingScore > maxScore) {
          maxScore = headingScore;
          matchType = 'heading';
        }

        // Check keywords
        section.keywords.forEach(keyword => {
          const keywordScore = calculateSimilarity(q, keyword);
          if (keywordScore > maxScore) {
            maxScore = keywordScore;
            matchType = 'keyword';
          }
        });

        // Check preview text
        const previewScore = calculateSimilarity(q, section.preview);
        if (previewScore > maxScore) {
          maxScore = previewScore;
          matchType = 'content';
        }

        // Boost score if page title/description matches
        const pageBoost = Math.max(pageTitleScore, pageDescScore) * 0.3;
        maxScore += pageBoost;

        // Add result if score is above threshold
        if (maxScore > 0.3) {
          results.push({
            page: page,
            pageTitle: pageData.title,
            section: section,
            score: maxScore,
            matchType: matchType,
            url: section.id ? `${page}#${section.id}` : page
          });
        }
      });
    }

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);

    // Limit to top 10 results
    return results.slice(0, 10);
  }

  // ============================================================================
  // UI FUNCTIONS
  // ============================================================================

  /**
   * Highlight matching text in result
   */
  function highlightMatch(text, query) {
    if (!query || query.length < MIN_QUERY_LENGTH) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Display search results in modal
   */
  function displayResults(results, query) {
    const modalBody = document.getElementById('searchModalBody');

    if (!results || results.length === 0) {
      modalBody.innerHTML = `
        <div class="search-no-results">
          <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
          <p class="search-tip">Try different keywords or check spelling</p>
        </div>
      `;
      return;
    }

    const resultsHTML = results.map(result => {
      const matchBadge = getMatchBadge(result.matchType);
      return `
        <a href="${result.url}" class="search-result-item">
          <div class="search-result-header">
            <span class="search-result-page">${escapeHtml(result.pageTitle)}</span>
            ${matchBadge}
          </div>
          <h3 class="search-result-title">${highlightMatch(escapeHtml(result.section.heading), query)}</h3>
          <p class="search-result-preview">${highlightMatch(escapeHtml(result.section.preview), query)}</p>
        </a>
      `;
    }).join('');

    modalBody.innerHTML = `
      <div class="search-results-header">
        <p>Found ${results.length} result${results.length === 1 ? '' : 's'} for "<strong>${escapeHtml(query)}</strong>"</p>
      </div>
      <div class="search-results-list">
        ${resultsHTML}
      </div>
    `;

    // Add click handlers to close modal when result is clicked
    // This ensures modal closes for both same-page and cross-page navigation
    attachResultClickHandlers();
  }

  /**
   * Attach click handlers to search result items
   * Closes modal when a result is clicked (handles same-page navigation)
   */
  function attachResultClickHandlers() {
    const resultItems = document.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
      item.addEventListener('click', () => {
        // Close modal immediately when result is clicked
        closeSearchModal();
      });
    });
  }

  /**
   * Get match type badge HTML
   */
  function getMatchBadge(matchType) {
    const badges = {
      'heading': '<span class="match-badge match-badge--heading">Heading</span>',
      'keyword': '<span class="match-badge match-badge--keyword">Keyword</span>',
      'content': '<span class="match-badge match-badge--content">Content</span>'
    };
    return badges[matchType] || '';
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Open search modal
   */
  function openSearchModal() {
    if (searchModal) {
      searchModal.classList.add('open');
      // Focus the search input
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  /**
   * Close search modal
   */
  function closeSearchModal() {
    if (searchModal) {
      searchModal.classList.remove('open');
      // Clear input
      if (searchInput) searchInput.value = '';
    }
  }

  /**
   * Handle search input
   */
  function handleSearch(query) {
    if (query.length < MIN_QUERY_LENGTH) {
      const modalBody = document.getElementById('searchModalBody');
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="search-no-results">
            <p class="search-tip">Type at least ${MIN_QUERY_LENGTH} characters to search</p>
          </div>
        `;
      }
      return;
    }

    const results = performSearch(query);
    displayResults(results, query);
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize search functionality
   */
  async function init() {
    console.log('[SEARCH] Initializing site search...');

    // Load search index
    searchIndex = await loadSearchIndex();
    if (!searchIndex) {
      console.error('[SEARCH] Failed to load search index');
      return;
    }

    // Get DOM elements
    searchInput = document.getElementById('site-search-input');
    searchModal = document.getElementById('searchModal');
    const searchButton = document.getElementById('site-search-button');
    const closeButton = document.getElementById('searchModalClose');

    if (!searchInput || !searchModal) {
      console.warn('[SEARCH] Search UI elements not found in DOM');
      return;
    }

    // Set up event listeners
    if (searchButton) {
      searchButton.addEventListener('click', openSearchModal);
    }

    if (closeButton) {
      closeButton.addEventListener('click', closeSearchModal);
    }

    // Search input handler with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        handleSearch(e.target.value.trim());
      }, 300); // Debounce 300ms
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+K or Cmd+Shift+K to open search
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        openSearchModal();
      }

      // Escape to close modal
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
        closeSearchModal();
      }
    });

    // Click outside modal to close
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeSearchModal();
      }
    });

    console.log('[SEARCH] Site search initialized successfully');
    console.log('[SEARCH] Use Ctrl+Shift+K (Cmd+Shift+K on Mac) to open search');
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  SEARCH.init = init;
  SEARCH.openSearch = openSearchModal;
  SEARCH.closeSearch = closeSearchModal;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
