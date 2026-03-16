# RepeaterBook Validation Report

**Date:** 2026-03-16
**Validated By:** Claude AI (automated internal audit)
**Database:** `data/repeaters.json`
**Total Repeaters:** 58 (46 linked, 12 non-linked)

---

## Validation Method

RepeaterBook.com returns HTTP 403 for automated/programmatic requests, blocking
live cross-referencing. This report documents an **internal consistency audit**
of `data/repeaters.json`. Live validation against RepeaterBook must be done
manually using the URLs in the **Manual Validation** section at the bottom.

---

## Internal Audit Results

### ✅ No Issues Found

- All `refurl` fields are populated (no missing or placeholder URLs)
- All frequency values use correct format (`NNN.NNN+` or `NNN.NNN-`)
- No `linked: false` repeaters have system tags (no tag/linked contradictions)
- No duplicate IDs

---

### ⚠️ Action Required

#### 1. Unknown Callsigns (`n0call`) — 2 repeaters

These repeaters are in the linked network but their callsign is not known.
Research required via RepeaterBook or local coordinator.

| Frequency | Location | Tags | verified |
|-----------|----------|------|----------|
| 146.910-  | Griffin | *(none)* | false |
| 147.135+  | Milledgeville | *(none)* | false |

**Action:** Look up callsign on RepeaterBook or contact the repeater trustee.
Update `callsign`, set `verified: true`, and add correct `tags`.

---

#### 2. Unverified Repeaters (`verified: false`) — 4 repeaters

These have not been confirmed against RepeaterBook since they were added.

| Callsign | Frequency | Location | linked | Tags |
|----------|-----------|----------|--------|------|
| n0call   | 146.910-  | Griffin | true | *(none)* |
| K4DBN    | 444.925+  | Irwinton | true | Peach State Intertie |
| n0call   | 147.135+  | Milledgeville | true | *(none)* |
| WC4RG    | 147.270+  | Walton County | false | *(none)* |

**Action:** Visit each repeater's `refurl` on RepeaterBook to confirm frequency,
tone, callsign, and system membership. Set `verified: true` when confirmed.

---

#### 3. Linked but No Network Tags — 12 repeaters

These repeaters are marked `linked: true` (part of the SKYWARN network) but
have no tag identifying which system/intertie they belong to. This means they
display in the linked repeater table without any badge, making their affiliation
unclear to spotters.

| Callsign | Frequency | Location | Notes |
|----------|-----------|----------|-------|
| KA3JIJ   | 145.310-  | Clermont | |
| KF4DGN   | 146.850-  | Commerce | |
| WA4ASI   | 146.925-  | Covington | |
| WA4ASI   | 444.800+  | Covington | |
| n0call   | 146.910-  | Griffin | Also unknown callsign |
| W4GTA    | 145.350-  | Lookout Mountain | |
| n0call   | 147.135+  | Milledgeville | Also unknown callsign |
| WB4GQX   | 441.900+  | Sawnee Mtn | |
| KN4FE    | 146.985-  | Warm Springs | |
| WM4B     | 146.670-  | Warner Robins | |
| WM4B     | 443.150+  | Warner Robins | |
| WB4GWA   | 443.800+  | Woodbury | |

**Action:** For each repeater, check:
- Does it appear on a RepeaterBook system list? If yes, add the matching tag.
- If it is SKYWARN-affiliated but not on a named intertie, confirm with the
  local coordinator and document accordingly.
- If it should not be `linked: true`, change to `false`.

---

#### 4. Null Tone — 1 repeater

| Callsign | Frequency | Location | linked |
|----------|-----------|----------|--------|
| W8JI     | 147.225+  | Lamar County | false |

`tone` is `null`. If this repeater requires a CTCSS tone to access, update the
field. If it is genuinely open carrier (no tone), set `tone: null` intentionally
and confirm it is documented correctly.

**Action:** Verify on RepeaterBook whether a tone is required.

---

### ℹ️ Informational (No Action Required)

#### Duplicate Frequencies Among Linked Repeaters

These are geographically separated repeaters that share a frequency — normal
and expected for a statewide network.

| Frequency | Repeaters |
|-----------|-----------|
| 145.210-  | KK4GQ (Fayetteville), KB4MQ (Eastman) |
| 146.850-  | KF4DGN (Commerce), WA4ORT (Warner Robins) |

---

#### Tag Distribution

| Tag | Count |
|-----|-------|
| SE Linked Repeater | 24 |
| Peach State Intertie | 15 |
| Cherry Blossom Intertie | 4 |
| WX4PTC System | 3 |
| WX4EMA | 2 |

---

## Manual Validation (Required)

RepeaterBook must be checked manually to cross-reference our data against live
system membership lists. Use these URLs:

| System | URL |
|--------|-----|
| Georgia SKYWARN Linked | https://www.repeaterbook.com/repeaters/feature_search.php?system=Georgia+SKYWARN+Linked+Repeaters+System&type=systems |
| Peach State Intertie | https://www.repeaterbook.com/repeaters/feature_search.php?system=Peach+State+Intertie+System&type=systems |
| Cherry Blossom Intertie | https://www.repeaterbook.com/repeaters/feature_search.php?system=Cherry+Blossom+Intertie+System&type=systems |
| Southeastern Linked | https://www.repeaterbook.com/repeaters/feature_search.php?system=Southeastern+Linked+Repeater+System&type=systems |

For each system, check:
1. Any repeater on RepeaterBook **not in our database** → add to `repeaters.json`
2. Any repeater in our database **not on RepeaterBook** → confirm affiliation or remove tag
3. Frequency, tone, and callsign match for all entries

---

## Summary of Action Items

| Priority | Issue | Count |
|----------|-------|-------|
| High | Unknown callsigns (`n0call`) | 2 |
| High | Unverified repeaters | 4 |
| Medium | Linked repeaters with no network tags | 12 |
| Low | Null tone on non-linked repeater | 1 |
| Manual | Live RepeaterBook cross-reference | — |

---

*Next validation recommended: 2026-06-16 (quarterly)*
