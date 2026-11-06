#!/usr/bin/env node
// Spotter-activation detection check (2026-11-06).
//
// Runs js/core.js and js/nws-api.js in a stub page (no DOM, so the dashboard
// doesn't start) and feeds HWO text through the real parseSpotterActivation().
// Run it after any change to CONFIG.ACTIVATION_PATTERNS or to the parser:
//
//   node scripts/test_activation.js
//
// Exit 1 on any mismatch. The REAL cases are Peachtree City's own wording,
// copied from its HWOs; add a sentence here whenever the office uses a new one.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const store = new Map();
const window = {};
const sandbox = {
  window,
  console: { log() {}, warn() {}, error: console.error },
  localStorage: {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
    key: i => [...store.keys()][i],
    get length() { return store.size; }
  },
  document: { readyState: 'complete', getElementById: () => null, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] },
  setTimeout, clearTimeout, setInterval, clearInterval
};
sandbox.window.localStorage = sandbox.localStorage;
sandbox.window.document = sandbox.document;
vm.createContext(sandbox);
for (const f of ['js/core.js', 'js/nws-api.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
}
// core.js and nws-api.js publish on window; the parser reads window.CONFIG.
const parse = sandbox.window.NWSAPI && sandbox.window.NWSAPI.parseSpotterActivation;
if (!parse) { console.error('window.NWSAPI.parseSpotterActivation is missing'); process.exit(1); }

// Wrap a statement the way an HWO carries it.
const hwo = s => `.DAY ONE...Tonight.\n\nNo hazardous weather is expected.\n\n.SPOTTER INFORMATION STATEMENT...\n\n${s}\n\n$$\n`;

const cases = [
  // REAL: Peachtree City HWOs, 2026-10-30 to 2026-11-06
  ['green',  'REAL', 'Spotter activation will not be needed through tonight.'],
  ['green',  'REAL', 'Spotter activation is not requested at this time.'],
  ['yellow', 'REAL', 'Spotter activation is not requested but spotters are encouraged to submit reports of severe weather through the web by going to weather.gov/atlanta. Please relay any information about observed severe weather to the NWS.'],

  // Callouts that must stay red or yellow
  ['red',    'pos',  'Spotter activation is requested.'],
  ['red',    'pos',  'SKYWARN spotter activation is requested this afternoon.'],
  ['red',    'pos',  'Spotter activation will likely be needed this afternoon and evening.'],
  ['red',    'pos',  'Spotter activation will be needed tonight.'],
  ['red',    'pos',  'Please activate SKYWARN spotters.'],
  ['red',    'pos',  'Emergency managers will need to activate SKYWARN spotters this evening.'],
  ['yellow', 'pos',  'Spotter activation may be needed this afternoon.'],
  ['yellow', 'pos',  'SKYWARN activation may be requested later today.'],
  ['yellow', 'pos',  'Spotter activation is possible this evening.'],
  ['yellow', 'pos',  'Spotters are encouraged to report any severe weather.'],

  // Stand-downs the old patterns read as activation (2026-11-06 review)
  ['green',  'neg',  'Spotter activation may not be needed.'],
  ['green',  'neg',  'Do not activate SKYWARN spotters.'],
  ['green',  'neg',  'There is no need to activate SKYWARN spotters.'],
  ['green',  'neg',  'Spotter activation is not expected. Severe thunderstorms are possible.'],
  ['green',  'neg',  'Spotters are not encouraged to report.'],
  ['green',  'neg',  'Spotter activation will NOT be needed.'],
  ['green',  'neg',  'Spotter activation is not needed.'],
  ['green',  'neg',  'Spotter activation is not anticipated. Activation may be considered tomorrow if storms develop.'],
  ['green',  'none', ''],
];

let failures = 0;
for (const [want, tag, sentence] of cases) {
  const got = parse(sentence ? hwo(sentence) : '');
  const ok = got.level === want;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${want.padEnd(6)} ${tag.padEnd(4)} ${sentence || '(no HWO text)'}` +
    (ok ? '' : `\n      got ${got.level} on "${got.matchedText}"`));
}
console.log(failures ? `\n${failures} FAILED` : `\nALL ${cases.length} PASSED`);
process.exit(failures ? 1 : 0);
