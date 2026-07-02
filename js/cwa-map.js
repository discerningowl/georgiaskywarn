/**
 * ──────────────────────────────────────────────────────────────
 * File:   cwa-map.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Interactive Georgia NWS County Warning Area choropleth map
 *          Loaded on about.html via loader.js postScripts
 *
 * CWA data sources (all in data/ directory):
 *   data/ffc-counties.json  — 96 FFC counties (NWS Peachtree City)
 *   data/gsp-counties.json  —  6 GSP counties (NWS Greenville-Spartanburg)
 *   data/cae-counties.json  —  5 CAE counties (NWS Columbia)
 *   data/chs-counties.json  — 12 CHS counties (NWS Charleston)
 *   data/jax-counties.json  — 14 JAX counties (NWS Jacksonville)
 *   data/tae-counties.json  — 26 TAE counties (NWS Tallahassee)
 *   Total: 159 Georgia counties
 *
 * Boundary geometry: Census Bureau TIGERweb (primary)
 *   https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1
 * ──────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  // ── CWA office metadata ───────────────────────────────────────────────────
  // Colors chosen for maximum distinctiveness across all 6 offices.
  // These same colors are used in the .nws-office-* CSS rules in style.css.
  // headerGrad: [darkStart, lightEnd] for modal header gradient — dark enough
  //   for white text on all offices including JAX (amber instead of pure yellow).
  const CWA_CONFIG = {
    FFC: { label: 'NWS Peachtree City (FFC)',         fill: '#5c6bc0', url: 'https://www.weather.gov/ffc/skywarn',          file: 'data/ffc-counties.json', headerGrad: ['#3c4b8a', '#5c6bc0'] },
    GSP: { label: 'NWS Greenville-Spartanburg (GSP)', fill: '#039be5', url: 'https://www.weather.gov/gsp/skywarn',          file: 'data/gsp-counties.json', headerGrad: ['#0277bd', '#039be5'] },
    CAE: { label: 'NWS Columbia (CAE)',               fill: '#f4511e', url: 'https://www.weather.gov/cae/skywarn.html',     file: 'data/cae-counties.json', headerGrad: ['#bf360c', '#f4511e'] },
    CHS: { label: 'NWS Charleston (CHS)',             fill: '#43a047', url: 'https://www.weather.gov/chs/skywarn',          file: 'data/chs-counties.json', headerGrad: ['#2e7d32', '#43a047'] },
    JAX: { label: 'NWS Jacksonville (JAX)',           fill: '#fdd835', url: 'https://www.weather.gov/jax/skywarn_schedule', file: 'data/jax-counties.json', headerGrad: ['#7f5800', '#b36f00'] },
    TAE: { label: 'NWS Tallahassee (TAE)',            fill: '#d81b60', url: 'https://www.weather.gov/tae/taeskywarn',       file: 'data/tae-counties.json', headerGrad: ['#880e4f', '#d81b60'] }
  };
  // Color palette rationale (maximally distinct):
  //  FFC  #5c6bc0  indigo       – primary office, authoritative blue-purple
  //  GSP  #039be5  sky blue     – NE mountains, clearly distinct from indigo
  //  CAE  #f4511e  tomato/red   – east central, warm red-orange
  //  CHS  #43a047  green        – coastal, natural green
  //  JAX  #fdd835  yellow       – SE inland, warm yellow (distinct from tomato)
  //  TAE  #d81b60  magenta/pink – SW, cool pink (distinct from all above)

  // ── SVG viewport & projection ─────────────────────────────────────────────
  const SVG_W = 560, SVG_H = 600;
  const LON_MIN = -85.7, LON_MAX = -80.8;
  const LAT_MIN = 30.3,  LAT_MAX = 35.1;

  function project(lon, lat) {
    const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * SVG_W;
    const y = (1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * SVG_H;
    return [x.toFixed(1), y.toFixed(1)];
  }

  function ringToPath(ring) {
    return ring.map((c, i) => {
      const [x, y] = project(c[0], c[1]);
      return (i === 0 ? 'M' : 'L') + x + ',' + y;
    }).join('') + 'Z';
  }

  function geometryToD(geom) {
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
    return polys.map(poly => poly.map(ringToPath).join('')).join('');
  }

  // ── Per-CWA county lists (populated during JSON load) ────────────────────
  // Sorted alphabetically; used to populate the county modal.
  const cwaCountyLists = {};

  // ── County → CWA lookup + full sorted list (populated during JSON load) ──
  // nameToCWA: lowercase county name → CWA code  (used by map render + search)
  // allCounties: [{name, cwa}, ...] sorted A-Z    (used by search dropdown)
  const nameToCWA = {};
  let allCounties = [];

  // ── CWA Office Modal ─────────────────────────────────────────────────────
  // openCWAOfficeModal(cwa, preFilter?)
  //   cwa       — one of 'FFC','GSP','CAE','CHS','JAX','TAE'
  //   preFilter — optional county name to pre-populate the filter input
  //               (used when the user clicks a county on the map)

  function openCWAOfficeModal(cwa, preFilter) {
    const conf = CWA_CONFIG[cwa];
    if (!conf) return;

    const backdrop    = document.getElementById('cwaOfficeModal');
    const header      = document.getElementById('cwaOfficeModalHeader');
    const titleEl     = document.getElementById('cwaOfficeModalTitle');
    const filterInput = document.getElementById('cwaCountyFilterInput');
    const filterClear = document.getElementById('cwaCountyFilterClear');
    const listEl      = document.getElementById('cwaCountyList');
    const linkEl      = document.getElementById('cwaOfficeSkywarnLink');
    // header and filterInput are used unconditionally below (no individual
    // `if` guard like filterClear/linkEl get), so they belong in the early
    // return too — otherwise a future markup change to the modal would throw
    // a silent JS error instead of failing safe.
    if (!backdrop || !header || !titleEl || !filterInput || !listEl) return;

    // ── Header: gradient matching the CWA office color ───────────────────────
    header.style.background =
      'linear-gradient(135deg, ' + conf.headerGrad[0] + ' 0%, ' + conf.headerGrad[1] + ' 100%)';

    // ── Title & SKYWARN link ─────────────────────────────────────────────────
    titleEl.textContent = conf.label;
    if (linkEl) {
      linkEl.href = conf.url;
      linkEl.style.setProperty('--btn-bg', conf.headerGrad[1]);
      linkEl.textContent = 'Visit the ' + cwa + ' SKYWARN Page ↗';
    }

    // ── Build county list ────────────────────────────────────────────────────
    const counties = cwaCountyLists[cwa] || [];
    listEl.innerHTML = '';
    counties.forEach(function (county) {
      const li = document.createElement('li');
      li.textContent = county;
      li.dataset.county = county.toLowerCase();
      listEl.appendChild(li);
    });

    // ── Apply pre-filter or reset ────────────────────────────────────────────
    if (preFilter) {
      filterInput.value = preFilter;
      if (filterClear) filterClear.hidden = false;
      applyCountyFilter(preFilter);
    } else {
      filterInput.value = '';
      if (filterClear) filterClear.hidden = true;
      applyCountyFilter('');
    }

    backdrop.classList.add('active');
    // Focus the filter input so keyboard users can type immediately
    setTimeout(function () { filterInput.focus(); }, 50);
  }

  function closeCWAOfficeModal() {
    const backdrop = document.getElementById('cwaOfficeModal');
    if (backdrop) backdrop.classList.remove('active');
  }

  function applyCountyFilter(term) {
    const listEl = document.getElementById('cwaCountyList');
    if (!listEl) return;
    const lower = term.trim().toLowerCase();
    listEl.querySelectorAll('li').forEach(function (li) {
      const match = !lower || li.dataset.county.includes(lower);
      // Exact match (county name fully typed) → highlight
      const exact = lower && li.dataset.county === lower;
      li.hidden = !match;
      li.classList.toggle('cwa-county-highlighted', exact);
    });
  }

  // ── County Search Bar ────────────────────────────────────────────────────
  // Called once after allCounties is populated. Wires the input in about.html.
  function wireCountySearch() {
    const input   = document.getElementById('countySearchInput');
    const results = document.getElementById('countySearchResults');
    const clear   = document.getElementById('countySearchClear');
    const wrap    = document.getElementById('countySearchWrap');
    if (!input || !results) return;

    let activeIdx = -1; // keyboard-navigation cursor

    function showResults(term) {
      const q = term.trim().toLowerCase();
      results.innerHTML = '';
      activeIdx = -1;

      if (!q) {
        results.hidden = true;
        if (clear) clear.hidden = true;
        return;
      }

      if (clear) clear.hidden = false;

      const matches = allCounties.filter(c => c.name.toLowerCase().startsWith(q));
      // Fall back to contains-match if no starts-with hits
      const list = matches.length
        ? matches
        : allCounties.filter(c => c.name.toLowerCase().includes(q));

      if (!list.length) {
        results.hidden = true;
        return;
      }

      list.slice(0, 12).forEach(function (county, i) {
        const li = document.createElement('li');
        li.className = 'county-search-result';
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.dataset.idx = String(i);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'county-search-result-name';
        nameSpan.textContent = county.name + ' County';

        const cwaSpan = document.createElement('span');
        cwaSpan.className = 'county-search-result-cwa';
        cwaSpan.textContent = county.cwa;

        li.appendChild(nameSpan);
        li.appendChild(cwaSpan);

        li.addEventListener('mousedown', function (e) {
          e.preventDefault(); // keep input focused
          selectCounty(county);
        });
        results.appendChild(li);
      });

      results.hidden = false;
    }

    function selectCounty(county) {
      input.value = county.name + ' County';
      results.hidden = true;
      if (clear) clear.hidden = false;
      openCWAOfficeModal(county.cwa, county.name);
    }

    function setActive(idx) {
      const items = results.querySelectorAll('.county-search-result');
      items.forEach(function (li, i) {
        const active = i === idx;
        li.setAttribute('aria-selected', String(active));
        if (active) li.scrollIntoView({ block: 'nearest' });
      });
      activeIdx = idx;
    }

    input.addEventListener('input', function () {
      showResults(input.value);
    });

    input.addEventListener('keydown', function (e) {
      const items = results.querySelectorAll('.county-search-result');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(Math.min(activeIdx + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(Math.max(activeIdx - 1, 0));
      } else if (e.key === 'Enter') {
        if (activeIdx >= 0 && items[activeIdx]) {
          e.preventDefault();
          const idx = Number(items[activeIdx].dataset.idx);
          const visible = allCounties.filter(c =>
            c.name.toLowerCase().includes(input.value.trim().toLowerCase())
          );
          if (visible[idx]) selectCounty(visible[idx]);
        }
      } else if (e.key === 'Escape') {
        results.hidden = true;
      }
    });

    input.addEventListener('blur', function () {
      // Delay so mousedown on a result fires first
      setTimeout(function () { results.hidden = true; }, 150);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim()) showResults(input.value);
    });

    if (clear) {
      clear.addEventListener('click', function () {
        input.value = '';
        results.hidden = true;
        clear.hidden = true;
        input.focus();
      });
    }
  }

  // ── Main initializer ──────────────────────────────────────────────────────
  async function initCWAMap() {
    const svg       = document.getElementById('ga-cwa-map');
    const countyG   = document.getElementById('ga-counties');
    const loadingEl = document.getElementById('ga-cwa-loading');
    const errorEl   = document.getElementById('ga-cwa-error');
    if (!svg || !countyG) return;

    // Tooltip appended to <body> to escape backdrop-filter containing blocks
    const tip = document.createElement('div');
    tip.className = 'ga-cwa-tooltip';
    document.body.appendChild(tip);

    // ── 1. Load all 6 CWA county files in parallel ────────────────────────
    // Each file: { "CountyName": { "gac": "GAC###", "same": "0#####", "gaz": [...] }, ... }
    // (as of 2026-07-01, restructured from the old { "GAC###": "CountyName" }
    // shape so county name is the anchor and every NWS-referenceable code
    // lives alongside it — this map only needs the names, not the codes)
    // Populates module-level nameToCWA, cwaCountyLists, and allCounties.

    const loadResults = await Promise.allSettled(
      Object.entries(CWA_CONFIG).map(async ([cwa, conf]) => {
        const r = await fetch(conf.file);
        if (!r.ok) throw new Error(conf.file + ' HTTP ' + r.status);
        const j = await r.json();
        const names = Object.keys(j);
        names.forEach(function (name) {
          nameToCWA[name.toLowerCase()] = cwa;
        });
        cwaCountyLists[cwa] = names.slice().sort();
        return cwa;
      })
    );

    const failed = loadResults.filter(r => r.status === 'rejected');
    if (failed.length) {
      failed.forEach(r => console.warn('[CWA Map] CWA data load failed:', r.reason));
    }
    console.log('[CWA Map] County lookup built:', Object.keys(nameToCWA).length, 'entries');

    // Build full sorted county list for the search bar
    allCounties = Object.entries(nameToCWA)
      .map(([lower, cwa]) => ({
        name: lower.replace(/\b\w/g, c => c.toUpperCase()), // Title-case
        cwa: cwa
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    wireCountySearch();

    function getCWA(name) {
      const lower = name.toLowerCase();
      const cwa = nameToCWA[lower];
      if (!cwa) console.warn('[CWA Map] Unmatched county (check JSON files):', name);
      return cwa || 'FFC';
    }

    // ── 2. Fetch county boundaries (sessionStorage cache) ─────────────────
    const CACHE_KEY = 'ga-county-geo-v1';
    let features;

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        features = JSON.parse(cached);
        console.log('[CWA Map] Loaded ' + features.length + ' features from session cache');
      } catch (e) {
        sessionStorage.removeItem(CACHE_KEY);
      }
    }

    if (!features) {
      const URLS = [
        // Primary: Census Bureau TIGERweb — authoritative, no auth required
        'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1/query' +
          '?where=STATE%3D%2713%27' +
          '&outFields=NAME%2CCOUNTY&returnGeometry=true&outSR=4326' +
          '&maxAllowableOffset=0.005&f=geojson',
        // Fallback: Esri USA Counties Generalized
        'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/' +
          'USA_Counties_Generalized/FeatureServer/0/query' +
          '?where=STATE_NAME+%3D+%27Georgia%27' +
          '&outFields=NAME%2CFIPS&returnGeometry=true&outSR=4326&f=geojson'
      ];

      let lastError;
      for (const url of URLS) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);
          const resp = await fetch(url, { signal: controller.signal });
          clearTimeout(timeout);
          if (!resp.ok) throw new Error('HTTP ' + resp.status);
          const data = await resp.json();
          const feats = data.features;
          if (!Array.isArray(feats) || feats.length === 0) throw new Error('Empty response');
          features = feats;
          console.log('[CWA Map] Loaded ' + features.length + ' features from ' + url.split('?')[0]);
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(features)); } catch (_) {}
          break;
        } catch (e) {
          lastError = e;
          console.warn('[CWA Map] Source failed (' + url.split('?')[0] + '):', e.message);
        }
      }

      if (!features) {
        console.error('[CWA Map] All boundary sources failed:', lastError && lastError.message);
        if (loadingEl) loadingEl.hidden = true;
        if (errorEl)   errorEl.hidden   = false;
        return;
      }
    }

    if (loadingEl) loadingEl.hidden = true;

    // ── 3. Render county paths ────────────────────────────────────────────
    const seenCWAs = new Set();
    const fragment = document.createDocumentFragment();

    features.forEach(feat => {
      if (!feat.geometry) return;

      const name = (feat.properties.NAME || '')
        .replace(/ County$/i, '').replace(/\s+/g, ' ').trim();
      const cwa  = getCWA(name);
      const conf = CWA_CONFIG[cwa];
      seenCWAs.add(cwa);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', geometryToD(feat.geometry));
      path.setAttribute('fill', conf.fill);
      path.setAttribute('class', 'ga-cwa-path');
      path.setAttribute('data-county', name);
      path.setAttribute('data-cwa', cwa);
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', name + ' County — ' + conf.label + ' — click to view counties');

      path.addEventListener('mousemove', (e) => {
        tip.textContent = name + ' County — ' + conf.label;
        tip.style.left = (e.clientX + 14) + 'px';
        tip.style.top  = (e.clientY - 36) + 'px';
        tip.classList.add('visible');
      });
      path.addEventListener('mouseleave', () => tip.classList.remove('visible'));
      path.addEventListener('focus', () => {
        tip.textContent = name + ' County — ' + conf.label;
        tip.classList.add('visible');
      });
      path.addEventListener('blur', () => tip.classList.remove('visible'));

      // Click → open modal pre-filtered to this county
      path.addEventListener('click', () => openCWAOfficeModal(cwa, name));
      path.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCWAOfficeModal(cwa, name);
        }
      });

      fragment.appendChild(path);
    });

    countyG.appendChild(fragment);
    console.log('[CWA Map] Rendered', features.length, 'counties across',
      seenCWAs.size, 'CWAs:', [...seenCWAs].sort().join(', '));

    // ── 4. Wire up CWA Office Modal ───────────────────────────────────────
    const modalBackdrop = document.getElementById('cwaOfficeModal');
    const modalClose    = document.getElementById('cwaOfficeModalClose');
    const filterInput   = document.getElementById('cwaCountyFilterInput');
    const filterClear   = document.getElementById('cwaCountyFilterClear');

    if (modalClose) {
      modalClose.addEventListener('click', closeCWAOfficeModal);
    }
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function (e) {
        if (e.target === modalBackdrop) closeCWAOfficeModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCWAOfficeModal();
    });

    if (filterInput) {
      filterInput.addEventListener('input', function () {
        const v = filterInput.value;
        applyCountyFilter(v);
        if (filterClear) filterClear.hidden = !v.trim();
      });
    }
    if (filterClear) {
      filterClear.addEventListener('click', function () {
        if (filterInput) {
          filterInput.value = '';
          filterInput.focus();
        }
        filterClear.hidden = true;
        applyCountyFilter('');
      });
    }

    // ── 6. Wire up NWS office card buttons ────────────────────────────────
    // Buttons are in about.html as <button class="nws-office-btn" data-cwa="FFC">
    document.querySelectorAll('.nws-office-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cwa = btn.dataset.cwa;
        if (cwa) openCWAOfficeModal(cwa, '');
      });
    });
  }

  if (document.readyState !== 'loading') {
    initCWAMap();
  } else {
    document.addEventListener('DOMContentLoaded', initCWAMap);
  }

})();
