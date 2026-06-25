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
  const CWA_CONFIG = {
    FFC: { label: 'NWS Peachtree City (FFC)',         fill: '#5c6bc0', url: 'https://www.weather.gov/ffc/skywarn',          file: 'data/ffc-counties.json' },
    GSP: { label: 'NWS Greenville-Spartanburg (GSP)', fill: '#039be5', url: 'https://www.weather.gov/gsp/skywarn',          file: 'data/gsp-counties.json' },
    CAE: { label: 'NWS Columbia (CAE)',               fill: '#f4511e', url: 'https://www.weather.gov/cae/skywarn.html',     file: 'data/cae-counties.json' },
    CHS: { label: 'NWS Charleston (CHS)',             fill: '#43a047', url: 'https://www.weather.gov/chs/skywarn',          file: 'data/chs-counties.json' },
    JAX: { label: 'NWS Jacksonville (JAX)',           fill: '#fdd835', url: 'https://www.weather.gov/jax/skywarn_schedule', file: 'data/jax-counties.json' },
    TAE: { label: 'NWS Tallahassee (TAE)',            fill: '#d81b60', url: 'https://www.weather.gov/tae/taeskywarn',       file: 'data/tae-counties.json' }
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

  // ── Main initializer ──────────────────────────────────────────────────────
  async function initCWAMap() {
    const svg       = document.getElementById('ga-cwa-map');
    const countyG   = document.getElementById('ga-counties');
    const loadingEl = document.getElementById('ga-cwa-loading');
    const errorEl   = document.getElementById('ga-cwa-error');
    const legendEl  = document.getElementById('ga-cwa-legend');
    if (!svg || !countyG) return;

    // Tooltip appended to <body> to escape backdrop-filter containing blocks
    const tip = document.createElement('div');
    tip.className = 'ga-cwa-tooltip';
    document.body.appendChild(tip);

    // ── 1. Load all 6 CWA county files in parallel ────────────────────────
    // Each file: { "GAC###": "CountyName", ... }
    // We build a lowercase name → CWA code lookup for case-insensitive matching.
    const nameToCWA = {};

    const loadResults = await Promise.allSettled(
      Object.entries(CWA_CONFIG).map(async ([cwa, conf]) => {
        const r = await fetch(conf.file);
        if (!r.ok) throw new Error(conf.file + ' HTTP ' + r.status);
        const j = await r.json();
        Object.values(j).forEach(name => {
          nameToCWA[name.toLowerCase()] = cwa;
        });
        return cwa;
      })
    );

    const failed = loadResults.filter(r => r.status === 'rejected');
    if (failed.length) {
      failed.forEach(r => console.warn('[CWA Map] CWA data load failed:', r.reason));
    }
    console.log('[CWA Map] County lookup built:', Object.keys(nameToCWA).length, 'entries');

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
        // maxAllowableOffset simplifies geometry → smaller response, faster render
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
      path.setAttribute('aria-label', name + ' County — ' + conf.label + ' — click to open SKYWARN page');

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

      const activate = () => window.open(conf.url, '_blank', 'noopener,noreferrer');
      path.addEventListener('click', activate);
      path.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });

      fragment.appendChild(path);
    });

    countyG.appendChild(fragment);
    console.log('[CWA Map] Rendered', features.length, 'counties across',
      seenCWAs.size, 'CWAs:', [...seenCWAs].sort().join(', '));

    // ── 4. Build legend ───────────────────────────────────────────────────
    if (legendEl) {
      legendEl.hidden = false;
      const ORDER = ['FFC', 'GSP', 'CAE', 'CHS', 'JAX', 'TAE'];
      ORDER.filter(k => seenCWAs.has(k)).forEach(k => {
        const conf  = CWA_CONFIG[k];
        const item  = document.createElement('div');
        item.className = 'ga-cwa-legend-item';
        const swatch = document.createElement('span');
        swatch.className = 'ga-cwa-legend-swatch';
        swatch.style.background = conf.fill;
        swatch.setAttribute('aria-hidden', 'true');
        const label = document.createElement('span');
        label.textContent = conf.label;
        item.appendChild(swatch);
        item.appendChild(label);
        legendEl.appendChild(item);
      });
    }
  }

  if (document.readyState !== 'loading') {
    initCWAMap();
  } else {
    document.addEventListener('DOMContentLoaded', initCWAMap);
  }

})();
