/**
 * ──────────────────────────────────────────────────────────────
 * File:   config.js
 * Author: Georgia SKYWARN Development Team
 * Purpose: Centralized configuration constants for Georgia SKYWARN
 * Version: 20260102c
 * Change-log:
 *   • 2026-01-02c – Added version check console log for cache debugging
 *   • 2026-01-02a – Updated ACTIVATION_PATTERNS to three-level urgency system (RED/YELLOW/GREEN)
 *   • 2026-01-02 – Created centralized config module
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // Cache TTL values (in milliseconds)
  const CACHE_TTL = {
    ALERTS: 5 * 60 * 1000,        // 5 minutes
    HWO: 4 * 60 * 60 * 1000,      // 4 hours
    REPEATERS: 24 * 60 * 60 * 1000 // 24 hours (future use)
  };

  // Cache keys for localStorage
  const CACHE_KEYS = {
    ALERTS: 'ffc-all-watches-warnings',
    HWO: 'ffc-hwo-outlook'
  };

  // NWS API configuration
  const NWS_API = {
    BASE_URL: 'https://api.weather.gov',
    USER_AGENT: 'GeorgiaSKYWARN-Site (kq4jp@pm.me)',
    OFFICE: 'FFC',
    OFFICE_NAME: 'NWS Peachtree City',
    TIMEOUT: 10000, // 10 seconds
    RETRY_DELAY_BASE: 2000, // 2 seconds (for exponential backoff)
    MAX_RETRIES: 3
  };

  // NWS Atlanta forecast zones (96 counties in North and Central Georgia)
  const FFC_ZONES = 'GAZ001,GAZ002,GAZ003,GAZ004,GAZ005,GAZ006,GAZ007,GAZ008,' +
    'GAZ009,GAZ010,GAZ011,GAZ012,GAZ013,GAZ014,GAZ015,GAZ016,' +
    'GAZ017,GAZ018,GAZ019,GAZ020,GAZ021,GAZ022,GAZ023,GAZ024,' +
    'GAZ025,GAZ026,GAZ027,GAZ028,GAZ029,GAZ030,GAZ031,GAZ032,' +
    'GAZ033,GAZ034,GAZ035,GAZ036,GAZ037,GAZ038,GAZ039,GAZ040,' +
    'GAZ041,GAZ042,GAZ043,GAZ044,GAZ045,GAZ046,GAZ047,GAZ048,' +
    'GAZ049,GAZ050,GAZ051,GAZ052,GAZ053,GAZ054,GAZ055,GAZ056,' +
    'GAZ057,GAZ058,GAZ059,GAZ060,GAZ061,GAZ062,GAZ063,GAZ064,' +
    'GAZ065,GAZ066,GAZ067,GAZ068,GAZ069,GAZ070,GAZ071,GAZ072,' +
    'GAZ073,GAZ074,GAZ075,GAZ076,GAZ077,GAZ078,GAZ079,GAZ080,' +
    'GAZ081,GAZ082,GAZ083,GAZ084,GAZ085,GAZ086,GAZ087,GAZ088,' +
    'GAZ089,GAZ090,GAZ091,GAZ092,GAZ093,GAZ094,GAZ095,GAZ096,' +
    'GAZ097,GAZ098,GAZ099,GAZ100,GAZ101,GAZ102,GAZ103,GAZ104,' +
    'GAZ105,GAZ106,GAZ107,GAZ108,GAZ109,GAZ110,GAZ111,GAZ112,' +
    'GAZ113,GAZ114,GAZ115,GAZ116,GAZ117,GAZ118';

  // UI configuration
  const UI = {
    CHANGELOG_MONTHS_TO_SHOW: 6,
    AUTO_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
    SCROLL_OFFSET_MOBILE: 100,
    SCROLL_OFFSET_DESKTOP: 200,
    BACK_TO_TOP_THRESHOLD: 300 // pixels scrolled before showing back-to-top button
  };

  // Alert classification keywords
  const ALERT_TYPES = {
    WARNING: 'warning',
    WATCH: 'watch',
    ADVISORY: 'advisory'
  };

  // SKYWARN activation detection patterns (three-level system)
  const ACTIVATION_PATTERNS = {
    // RED - Activation requested/likely
    RED: [
      /SPOTTER\s+ACTIVATION\s+IS\s+REQUESTED/i,
      /SPOTTER\s+ACTIVATION\s+WILL\s+LIKELY\s+BE\s+NEEDED/i,
      /SKYWARN\s+ACTIVATION\s+IS\s+REQUESTED/i,
      /SKYWARN\s+ACTIVATION\s+WILL\s+LIKELY\s+BE\s+NEEDED/i,
      /ACTIVATE.*SKYWARN/i,
      /ACTIVATE.*SPOTTER/i
    ],
    MEDIUM_CONFIDENCE: [
      /SKYWARN.*(?:IS|ARE|WILL BE)\s+REQUESTED/i,
      /SPOTTER.*(?:IS|ARE|WILL BE)\s+REQUESTED/i,
      /SKYWARN.*(?:IS|ARE|WILL BE)\s+NEEDED/i,
      /SPOTTER.*(?:IS|ARE|WILL BE)\s+NEEDED/i
    ]
  };

  // Export configuration to global namespace
  window.CONFIG = {
    CACHE_TTL,
    CACHE_KEYS,
    NWS_API,
    FFC_ZONES,
    UI,
    ALERT_TYPES,
    ACTIVATION_PATTERNS
  };

  // Version check log
  console.log('[CONFIG] Loaded v20260102c with patterns:', Object.keys(ACTIVATION_PATTERNS));

})();
