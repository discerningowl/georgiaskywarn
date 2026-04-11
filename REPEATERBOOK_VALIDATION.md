# RepeaterBook Validation Report

**Date:** 2026-04-10
**Validated By:** Claude AI (RepeaterBook API — live automated check)
**Database:** `data/repeaters.json`
**Total Repeaters:** 59 (47 linked, 12 non-linked)

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 High | 2 |
| 🟡 Medium | 9 |
| 🔵 Low | 0 |
| ℹ️ Info | 0 |
| 🆕 Potential missing repeaters | 48 |

---

## Issues

### 🔴 Frequency mismatch (2)

| Repeater ID | Location | Field | Ours | RepeaterBook | Note |
|-------------|----------|-------|------|-------------|------|
| `KI4FVI-146.895` | Macon | frequency | `146.895-` | `146.715-` | Verify on RepeaterBook before changing |
| `WM4B-443.150` | Warner Robins | frequency | `443.150+` | `146.67-` | Verify on RepeaterBook before changing |

### 🟡 Repeater may be back on-air (3)

| Repeater ID | Location | Field | Ours | RepeaterBook | Note |
|-------------|----------|-------|------|-------------|------|
| `WB4NFG-146.835` | Bolingbroke | active | `false` | `true` | RepeaterBook status: On-air — confirm before setting active: true |
| `KB4MQ-145.210` | Eastman | active | `false` | `true` | RepeaterBook status: On-air — confirm before setting active: true |
| `KI4BEO-146.640` | Montezuma | active | `false` | `true` | RepeaterBook status: On-air — confirm before setting active: true |

### 🟡 Tone mismatch (2)

| Repeater ID | Location | Field | Ours | RepeaterBook | Note |
|-------------|----------|-------|------|-------------|------|
| `WX4NN-443.075` | Cherokee County | tone | `107.2 Hz` | `null` |  |
| `KI4FVI-146.895` | Macon | tone | `88.5 Hz` | `146.2 Hz` |  |

### 🟡 No RepeaterBook ID (4)

| Repeater ID | Location | Field | Ours | RepeaterBook | Note |
|-------------|----------|-------|------|-------------|------|
| `K4DBN-146.610` | Dublin | refurl | `https://www.repeaterbook.com/repeaters/callResult.php?call=K4DBN&status_id=%25` | `null` | Cannot extract numeric ID — check refurl format |
| `n0call-146.910` | Griffin | refurl | `https://www.repeaterbook.com/repeaters/display.php?country=United+States&state_id=13&frequency=146.91` | `null` | Cannot extract numeric ID — check refurl format |
| `K4DBN-444.925` | Irwinton | refurl | `https://www.repeaterbook.com/repeaters/callResult.php?call=K4DBN&status_id=%25` | `null` | Cannot extract numeric ID — check refurl format |
| `n0call-147.135` | Milledgeville | refurl | `https://www.repeaterbook.com/repeaters/display.php?country=United+States&state_id=13&frequency=147.135` | `null` | Cannot extract numeric ID — check refurl format |

---

## 🆕 Potential Missing Repeaters

These RepeaterBook records appear SKYWARN/system-affiliated but are absent from our database. Review each and add to `data/repeaters.json` if appropriate.

| RB ID | Callsign | Output Freq | Nearest City | Last Update |
|-------|----------|-------------|--------------|-------------|
| [38](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=38) | K5PRE | 147.27000+ | Americus | 2026-04-04 |
| [19745](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=19745) | KD4QHB | 145.33000- | Athens | 2026-04-05 |
| [12674](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=12674) | K4AEC | 146.95500- | Blairsville | 2025-10-19 |
| [21225](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=21225) | WX4PCH | 444.31250+ | Byron | 2023-04-24 |
| [23300](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=23300) | WD4EMA | 443.57500+ | Chatsworth | 2026-03-10 |
| [23187](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=23187) | WD4EMA | 444.17500+ | Chatsworth | 2025-09-14 |
| [18648](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=18648) | W4CBA | 145.20000- | Clermont | 2025-06-23 |
| [377](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=377) | W4CBA | 444.33750+ | Clermont | 2025-09-14 |
| [19415](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=19415) | WB4QOJ | 443.25000+ | Dallas | 2025-09-14 |
| [270](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=270) | N4BZJ | 224.68000- | Dalton | 2025-06-23 |
| [386](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=386) | N4BZJ | 442.17500+ | Dalton | 2025-06-23 |
| [16316](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=16316) | KB4MQ | 444.85000+ | Eastman | 2025-06-24 |
| [399](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=399) | KI4CCZ | 444.70000+ | Elberton | 2025-11-14 |
| [17525](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=17525) | KK4JPG | 145.08000+ | Forsyth | 2025-10-09 |
| [134](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=134) | KJ4ZLL | 145.12000- | Gainesville | 2026-03-31 |
| [408](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=408) | KJ4ZLL | 441.86250+ | Gainesville | 2025-06-23 |
| [13236](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=13236) | N5BI | 443.70000+ | Gray | 2025-06-23 |
| [289](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=289) | WR4SG | 224.22000- | Hahira | 2025-06-23 |
| [18402](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=18402) | WR4SG | 444.47500+ | Hahira | 2025-06-24 |
| [18410](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=18410) | WR4SG | 53.89000- | Lake Park | 2025-06-23 |
| [159](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=159) | WR4SG | 147.13500+ | Lake Park | 2025-06-23 |
| [509](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=509) | WR4SG | 444.35000+ | Lake Park | 2025-06-24 |
| [18](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=18) | W4GR | 53.11000- | Lawrenceville | 2026-01-17 |
| [282](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=282) | N4LMC | 224.56000- | Lookout Mountain | 2025-09-12 |
| [178](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=178) | W4PCF | 147.13500+ | Milledgeville | 2026-02-01 |
| [172](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=172) | K4NRC | 147.16500+ | Newnan | 2026-03-06 |
| [472](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=472) | W4PSZ | 442.50000+ | Peachtree City | 2026-01-09 |
| [18798](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=18798) | W4CVY | 146.62500- | Pine Mountain | 2026-03-07 |
| [16094](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=16094) | N4LMC | 443.52500+ | Ringgold | 2025-09-12 |
| [19416](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=19416) | WX4PCA | 145.34000- | Rockmart | 2025-06-23 |
| [19442](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=19442) | W4SAN | 145.32000- | Sandersville | 2025-11-11 |
| [20767](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=20767) | W4SAN | 444.53750+ | Sandersville | 2025-11-10 |
| [162](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=162) | W4GR | 147.07500+ | Snellville | 2026-01-26 |
| [213](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=213) | KJ4KPY | 145.17000- | Stockbridge | 2025-09-24 |
| [433](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=433) | KJ4KPY | 443.22500+ | Stockbridge | 2025-09-24 |
| [40](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=40) | W4PVW | 147.28500+ | Sumner | 2025-06-23 |
| [19980](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=19980) | W4PVW | 444.80000+ | Sumner | 2025-06-24 |
| [10457](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=10457) | W4UCJ | 145.37000- | Thomasville | 2025-06-23 |
| [292](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=292) | WR4SG | 224.32000- | Thomasville | 2025-06-23 |
| [10458](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=10458) | W4UCJ | 442.60000+ | Thomasville | 2025-06-23 |
| [19447](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=19447) | W4PVW | 1299.00000- | Tifton | 2026-04-06 |
| [11553](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=11553) | W4PVW | 145.12000- | Tifton | 2025-06-23 |
| [504](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=504) | KE4RJI | 444.87500+ | Tifton | 2026-02-07 |
| [11555](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=11555) | W4PVW | 1282.65000- | Tifton | 2025-06-23 |
| [222](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=222) | KR4CW | 147.33000+ | Toccoa | 2026-04-05 |
| [115](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=115) | K4NRC | 145.11000- | Turin | 2026-01-09 |
| [293](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=293) | WR4SG | 224.46000- | Valdosta | 2025-06-23 |
| [7453](https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=7453) | KJ4EX | 145.13000- | Winder | 2025-06-23 |

---

## ✅ Safe Auto-Fixes Available

Run with `--fix` to apply these changes to `data/repeaters.json`:

| Repeater ID | Field | Current | New Value |
|-------------|-------|---------|-----------|
| `KB4MQ-145.210` | active | `False` | `True` |
| `KI4BEO-146.640` | active | `False` | `True` |
| `WB4NFG-146.835` | active | `False` | `True` |

> **Note:** `active` and `verified` are the only fields auto-fixed. Callsign, frequency, and tone changes always require manual review.

---

## System Membership (Manual Check Required)

The RepeaterBook export API does not include full network/system membership details. Cross-reference these pages to validate `tags` in `repeaters.json`:

| System | URL |
|--------|-----|
| Georgia SKYWARN Linked | https://www.repeaterbook.com/repeaters/feature_search.php?system=Georgia+SKYWARN+Linked+Repeaters+System&type=systems |
| Peach State Intertie | https://www.repeaterbook.com/repeaters/feature_search.php?system=Peach+State+Intertie+System&type=systems |
| Cherry Blossom Intertie | https://www.repeaterbook.com/repeaters/feature_search.php?system=Cherry+Blossom+Intertie+System&type=systems |
| Southeastern Linked | https://www.repeaterbook.com/repeaters/feature_search.php?system=Southeastern+Linked+Repeater+System&type=systems |

For each system:
1. Any repeater on RepeaterBook **not in our database** → add to `repeaters.json`
2. Any repeater in our database **not on RepeaterBook** → confirm affiliation or remove tag
3. Frequency, tone, and callsign match for all entries

---

*Next validation recommended: 2026-07-10 (quarterly)*
