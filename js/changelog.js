/**
 * ──────────────────────────────────────────────────────────────
 * File:   changelog.js
 * Author: Jack Parks (KQ4JP) <kq4jp@pm.me>
 * Purpose: Load and display changelog from changelog.json
 * Change-log:
 *   • 2026-01-02 – Initial creation for dynamic changelog display
 * ──────────────────────────────────────────────────────────────
 */

(function() {
  'use strict';

  // Use CONFIG for months to show
  const MONTHS_TO_SHOW = window.CONFIG.UI.CHANGELOG_MONTHS_TO_SHOW;
  const HEADER_COLORS = ['green', 'blue', 'indigo', 'orange', 'red', 'yellow'];

  // Fetch and display changelog
  async function loadChangelog() {
    try {
      const data = await window.UTILS.fetchJSON('data/changelog.json', 'changelog');
      const now = new Date();
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - MONTHS_TO_SHOW, 1);

      // Separate recent and archived updates
      const recentUpdates = [];
      const archivedUpdates = [];

      data.updates.forEach(update => {
        const updateDate = new Date(update.date);
        if (updateDate >= sixMonthsAgo) {
          recentUpdates.push(update);
        } else {
          archivedUpdates.push(update);
        }
      });

      // Render recent updates as cards
      renderRecentUpdates(recentUpdates);

      // Show archived button if there are archived updates
      if (archivedUpdates.length > 0) {
        document.getElementById('archived-updates-container').style.display = 'block';
        setupArchivedModal(archivedUpdates);
      }

    } catch (err) {
      console.error('Error loading changelog:', err);
      const container = document.getElementById('changelog');
      if (container) {
        container.innerHTML = '<section class="card"><div class="card-body"><p>Unable to load recent updates. Please check the console for errors.</p></div></section>';
      }
    }
  }

  // Render recent updates as sub-cards in a grid within main card
  function renderRecentUpdates(updates) {
    const container = document.getElementById('changelog');
    if (!container) {
      console.error('Changelog container not found');
      return;
    }

    if (updates.length === 0) {
      container.innerHTML = '<section class="card"><div class="card-body"><p>No recent updates.</p></div></section>';
      return;
    }

    // Create main card wrapper
    const mainSection = document.createElement('section');
    mainSection.className = 'card';
    mainSection.id = 'changelog';

    const mainHeader = document.createElement('header');
    mainHeader.className = 'card-header card-header--blue';
    mainHeader.innerHTML = '<h2 class="card-title">Recent Updates</h2>';

    const mainBody = document.createElement('div');
    mainBody.className = 'card-body';

    // Create grid container for month cards
    const grid = document.createElement('div');
    grid.className = 'changelog-grid';

    // Create individual month cards
    updates.forEach((update, index) => {
      const colorClass = HEADER_COLORS[index % HEADER_COLORS.length];

      const monthCard = document.createElement('div');
      monthCard.className = 'changelog-month-card';

      const monthHeader = document.createElement('h3');
      monthHeader.className = `changelog-month-header changelog-month-header--${colorClass}`;
      monthHeader.textContent = `${update.month} ${update.year}`;

      const list = document.createElement('ul');
      list.className = 'changelog-list';

      update.items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.title}:</strong> ${item.description}`;
        list.appendChild(li);
      });

      monthCard.appendChild(monthHeader);
      monthCard.appendChild(list);
      grid.appendChild(monthCard);
    });

    mainBody.appendChild(grid);
    mainSection.appendChild(mainHeader);
    mainSection.appendChild(mainBody);
    container.appendChild(mainSection);
  }

  // Setup archived updates modal (using UTILS.createModalManager)
  function setupArchivedModal(archivedUpdates) {
    const modalBody = document.getElementById('archivedModalBody');
    const viewBtn = document.getElementById('view-archived-btn');

    if (!modalBody || !viewBtn) {
      console.error('Archived modal elements not found');
      return;
    }

    // Initialize modal manager
    const modal = window.UTILS.createModalManager('archivedModal', 'archivedModalClose');
    if (!modal) return;

    // Render archived updates in modal body
    let html = '';
    archivedUpdates.forEach(update => {
      html += `
        <div style="margin-bottom: 2rem;">
          <h3 style="color: var(--accent-blue); margin-bottom: 0.5rem;">${update.month} ${update.year}</h3>
          <ul style="list-style: disc; padding-left: 1.5rem;">
      `;
      update.items.forEach(item => {
        html += `<li style="margin-bottom: 0.5rem;"><strong>${item.title}:</strong> ${item.description}</li>`;
      });
      html += `</ul></div>`;
    });
    modalBody.innerHTML = html;

    // Open modal when button clicked
    viewBtn.addEventListener('click', () => modal.open());
  }

  // Load changelog on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadChangelog);
  } else {
    loadChangelog();
  }
})();
