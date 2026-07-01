/**
 * ──────────────────────────────────────────────────────────────
 * File:   changelog.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Load and display changelog from changelog.json.
 *          Renders two different views depending on which page loaded it:
 *            • about.html      → #changelog        → most recent N month-cards only
 *            • changelog.html  → #changelogHistory  → full history, grouped by year
 * Change-log:
 *   • 2026-06-30b – Site-wide card-header color standard: the dynamic
 *     "Recent Site Updates" header on about.html now uses the default
 *     card-header (no color modifier) instead of card-header--blue, to
 *     match the new default-navy standard for informational cards.
 *   • 2026-06-30 – Replaced date-window cutoff + "View Older" modal with a
 *     fixed recent-entry count (CONFIG.UI.CHANGELOG_RECENT_COUNT) and a
 *     dedicated changelog.html history page. The modal didn't scale: it
 *     stuffed unbounded history into a small box with no deep links and no
 *     SEO value. Year-grouped sections on their own page do.
 *   • 2026-01-02 – Initial creation for dynamic changelog display
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const RECENT_COUNT = window.CONFIG.UI.CHANGELOG_RECENT_COUNT;
  const HEADER_COLORS = ['blue', 'indigo', 'green', 'orange', 'red', 'yellow'];

  async function loadChangelog() {
    try {
      const data = await window.UTILS.fetchJSON('data/changelog.json', 'changelog');
      const updates = data.updates; // Newest-first order (source of truth in changelog.json)

      // about.html: recent N entries + a link to the full history if more exist
      const recentContainer = document.getElementById('changelog');
      if (recentContainer) {
        renderRecentUpdates(updates.slice(0, RECENT_COUNT), recentContainer);

        const moreContainer = document.getElementById('archived-updates-container');
        if (moreContainer && updates.length > RECENT_COUNT) {
          moreContainer.style.display = 'block';
        }
      }

      // changelog.html: full history grouped by year
      const historyRoot = document.getElementById('changelogHistory');
      if (historyRoot) {
        renderFullHistory(updates, historyRoot);
      }
    } catch (err) {
      console.error('Error loading changelog:', err);
      const fallback = document.getElementById('changelog') || document.getElementById('changelogHistory');
      if (fallback) {
        fallback.innerHTML = '<section class="card"><div class="card-body"><p>Unable to load updates. Please check the console for errors.</p></div></section>';
      }
    }
  }

  // Build a single month's card (shared by both render paths)
  function buildMonthCard(update, colorClass) {
    const monthCard = document.createElement('div');
    monthCard.className = 'changelog-month-card';

    const monthHeader = document.createElement('h3');
    monthHeader.className = `changelog-month-header changelog-month-header--${colorClass}`;
    monthHeader.textContent = `${update.month} ${update.year}`;

    const list = document.createElement('ul');
    list.className = 'changelog-list';

    update.items.forEach(item => {
      const li = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = item.title + ':';
      li.appendChild(strong);
      li.appendChild(document.createTextNode(' ' + item.description));
      list.appendChild(li);
    });

    monthCard.appendChild(monthHeader);
    monthCard.appendChild(list);
    return monthCard;
  }

  // about.html: render the most recent N updates as sub-cards in one card
  function renderRecentUpdates(updates, container) {
    if (updates.length === 0) {
      container.innerHTML = '<section class="card"><div class="card-body"><p>No recent updates.</p></div></section>';
      return;
    }

    const mainSection = document.createElement('section');
    mainSection.className = 'card';
    mainSection.id = 'changelog-card';

    const mainHeader = document.createElement('header');
    mainHeader.className = 'card-header';
    mainHeader.innerHTML = '<h2 class="card-title">Recent Site Updates</h2>';

    const mainBody = document.createElement('div');
    mainBody.className = 'card-body';

    const grid = document.createElement('div');
    grid.className = 'changelog-grid';

    updates.forEach((update, index) => {
      grid.appendChild(buildMonthCard(update, HEADER_COLORS[index % HEADER_COLORS.length]));
    });

    mainBody.appendChild(grid);
    mainSection.appendChild(mainHeader);
    mainSection.appendChild(mainBody);
    container.appendChild(mainSection);
  }

  // changelog.html: render ALL updates, grouped by year, into static #y{year}
  // container divs already present in the page HTML. Year containers must be
  // added to changelog.html when a new year's first entry is added — see
  // CLAUDE.md "Adding a Changelog Year" for instructions.
  function renderFullHistory(updates, historyRoot) {
    const byYear = new Map();
    updates.forEach(update => {
      if (!byYear.has(update.year)) byYear.set(update.year, []);
      byYear.get(update.year).push(update);
    });

    const years = Array.from(byYear.keys()).sort((a, b) => b - a);

    years.forEach((year, yearIndex) => {
      const target = document.getElementById(`y${year}`);
      if (!target) {
        console.warn(`[CHANGELOG] No #y${year} container found in changelog.html — add one for this year's entries.`);
        return;
      }

      const section = document.createElement('section');
      section.className = 'card';

      const header = document.createElement('header');
      header.className = `card-header card-header--${HEADER_COLORS[yearIndex % HEADER_COLORS.length]}`;
      header.innerHTML = `<h2 class="card-title">${year}</h2>`;

      const body = document.createElement('div');
      body.className = 'card-body';

      const grid = document.createElement('div');
      grid.className = 'changelog-grid';

      byYear.get(year).forEach((update, index) => {
        grid.appendChild(buildMonthCard(update, HEADER_COLORS[index % HEADER_COLORS.length]));
      });

      body.appendChild(grid);
      section.appendChild(header);
      section.appendChild(body);
      target.appendChild(section);
    });
  }

  // Load changelog on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadChangelog);
  } else {
    loadChangelog();
  }
})();
