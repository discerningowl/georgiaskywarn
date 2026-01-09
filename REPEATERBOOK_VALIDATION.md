# RepeaterBook Validation Report
**Date**: 2026-01-08
**Validated Against**: [Georgia SKYWARN Linked Repeaters System](https://www.repeaterbook.com/repeaters/feature_search.php?system=Georgia+SKYWARN+Linked+Repeaters+System&type=systems)

---

## Summary

- **RepeaterBook Official SKYWARN System**: 41 linked repeaters
- **Our Database (`linked=true`)**: 46 repeaters
- **Discrepancies**: 7 issues identified

---

## ✅ Fixed Issues

### 1. Sandersville 145.270- Callsign Correction
- **Was**: K3SRC
- **Corrected to**: W4SAN
- **RepeaterBook ID**: 203
- **Status**: ✅ Fixed

### 2. Fayetteville 444.600+ and Peachtree City 442.500+ Callsign Correction
- **Was**: WX4PTC (NWS station call)
- **Corrected to**: W4PSZ (FCC repeater license)
- **RepeaterBook IDs**: 405 and 472
- **Status**: ✅ Fixed

---

## ❌ Critical Issues Requiring Action

### 1. INCORRECT ENTRY - KI4FVI
**Current Entry in Our Database**:
- Location: Macon
- Frequency: 146.895-
- Callsign: KI4FVI
- Marked as: `linked=true`

**RepeaterBook Reality**:
- **Actual repeater**: McDonough 146.715- (KI4FVI) - ID=176
- **NOT** part of official SKYWARN linked system
- Wrong frequency AND wrong location

**Recommended Action**:
- **Option A**: Change frequency to 146.715- and location to McDonough, set `linked=false`
- **Option B**: Remove entry entirely if not SKYWARN-related
- **Option C**: Verify with owner if this is a data entry error

---

### 2. MISSING REPEATER - KD4UTQ
**Missing from Our Database**:
- Location: Macon
- Frequency: 146.895- (downlink) / 146.295- (uplink)
- Offset: -0.600 MHz
- Callsign: KD4UTQ
- Tone: 88.5 Hz
- RepeaterBook ID: 169
- **IS** part of official SKYWARN linked system
- Part of Peach State Emergency Intertie System
- On-demand link to Georgia SKYWARN

**Recommended Action**:
- **ADD** this repeater to database as `linked=true`

**Suggested JSON Entry**:
```json
{
  "location": "Macon",
  "frequency": "146.895-",
  "tone": "88.5 Hz",
  "tags": ["Peach State"],
  "description": "On-demand to the Georgia SKYWARN Linked Repeaters System. Full-time connection to Peach State Intertie. 40 mile radius omnidirectional coverage.",
  "callsign": "KD4UTQ",
  "refurl": "https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=169",
  "linked": true
}
```

---

## 🔵 Repeaters in Our Database NOT in Official SKYWARN System

These 5 repeaters are marked `linked=true` in our database but do NOT appear in RepeaterBook's official "Georgia SKYWARN Linked Repeaters System":

### 1. Tyrone: 444.675+ (KN4YZ)
- **Description**: Backup hub and net control/remote base repeater
- **RefURL**: https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=508
- **Note**: Listed as backup hub, may be linked but not in official system listing
- **Recommendation**: Verify if this should remain `linked=true` or change to `linked=false`

### 2. Griffin: 146.910- (Unknown)
- **Callsign**: Unknown
- **RefURL**: Generic display.php URL (no specific ID)
- **Recommendation**:
  - Find correct callsign from RepeaterBook
  - Verify if operational and SKYWARN-affiliated
  - May need to be `linked=false` or removed

### 3. Irwinton: 444.925+ (K4DBN)
- **RefURL**: https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=143
- **Note**: K4DBN has other repeaters that ARE in official SKYWARN system
- **Recommendation**: Verify if this specific frequency is linked or should be `linked=false`

### 4. Milledgeville: 147.135+ (Unknown)
- **Callsign**: Unknown
- **RefURL**: Generic display.php URL (no specific ID)
- **Recommendation**:
  - Find correct callsign from RepeaterBook
  - Verify if operational and SKYWARN-affiliated
  - May need to be `linked=false` or removed

### 5. Warner Robins: 443.150+ (WM4B)
- **RefURL**: https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=26308
- **Note**: WM4B has another repeater (146.6700) that IS in official SKYWARN system
- **Recommendation**: Verify if this specific frequency is linked or should be `linked=false`

---

## 📋 Official RepeaterBook SKYWARN System (41 Repeaters)

Complete list from RepeaterBook as of 2026-01-08:

| Frequency | Location | Callsign | ID | Band |
|-----------|----------|----------|-----|------|
| 53.0500 | Jasper, Biskey Mtn | KC4JNN | 13942 | 6m |
| 145.1900 | Warm Springs | WB4ULJ | 194 | 2m |
| 145.2100 | Eastman | KB4MQ | 120 | 2m |
| 145.2100 | Fayetteville | KK4GQ | 129 | 2m |
| 145.2700 | Sandersville | W4SAN | 203 | 2m |
| 145.2900 | Byron | WX4PCH | 16822 | 2m |
| 145.3100 | Clermont | KA3JIJ | 79 | 2m |
| 145.3500 | Lookout Mountain | W4GTA | 163 | 2m |
| 145.3700 | Gray, Round Oak | WB4JOE | 165 | 2m |
| 145.3900 | Griffin | WB4GWA | 137 | 2m |
| 145.4300 | Macon | AA4RI | 166 | 2m |
| 145.4900 | Cochran | K4DBN | 23269 | 2m |
| 146.6400 | Montezuma | KI4BEO | 180 | 2m |
| 146.6700 | Warner Robins | WM4B | 5525 | 2m |
| 146.8050 | Jasper | KC4AQS | 147 | 2m |
| 146.8200 | Atlanta | W4DOC | 6482 | 2m |
| 146.8350 | Bolingbroke | WB4NFG | 12976 | 2m |
| 146.8500 | Commerce | KF4DGN | 23184 | 2m |
| 146.8500 | Warner Robins | WA4ORT | 3139 | 2m |
| 146.8950 | Dallas | WD4LUQ | 104 | 2m |
| 146.8950 | Macon | KD4UTQ | 169 | 2m |
| 146.9250 | Covington | WA4ASI | 100 | 2m |
| 146.9850 | Warm Springs | KN4FE | 234 | 2m |
| 147.0150 | Macon | WX4EMA | 3141 | 2m |
| 147.1200 | Wrens | W4CDC | 244 | 2m |
| 147.1500 | Cedar Grove | K4DBN | 86 | 2m |
| 147.2400 | Irwinton | K4DBN | 144 | 2m |
| 147.3300 | LaGrange | WB4BXO | 158 | 2m |
| 147.3900 | Thomaston | W4OHH | 219 | 2m |
| 224.1600 | Jasper | KC4JNN | 259 | 1.25m |
| 224.8800 | Dallas | WD4LUQ | 299 | 1.25m |
| 441.9000 | Cumming | WB4GQX | 3862 | 70cm |
| 442.5000 | Peachtree City | W4PSZ | 472 | 70cm |
| 443.0750 | Macon | WX4EMA | 452 | 70cm |
| 443.2000 | Rome | N4RMG | 10212 | 70cm |
| 443.2750 | Irwinton | K4DBN | 10970 | 70cm |
| 443.5000 | Jasper | KC4JNN | 334 | 70cm |
| 443.6000 | Griffin | W4SCP | 18622 | 70cm |
| 443.8000 | Woodbury | WB4GWA | 18030 | 70cm |
| 444.6000 | Fayetteville | W4PSZ | 405 | 70cm |
| 444.9500 | Butler | WR4MG | 20322 | 70cm |

---

## 🔍 Verification Process Used

1. Fetched official list from RepeaterBook feature_search.php
2. Compared frequencies, callsigns, and locations
3. Verified refurl IDs against RepeaterBook details pages
4. Identified mismatches and missing entries
5. Cross-referenced individual repeater details pages

---

## 📝 Action Items for Future Review

### Priority 1 - Critical Data Errors
- [ ] Fix or remove KI4FVI entry (wrong frequency/location)
- [ ] Add missing KD4UTQ repeater (Macon 146.895-)

### Priority 2 - Verification Needed
- [ ] Verify Tyrone 444.675+ (KN4YZ) - Is it truly linked?
- [ ] Verify Irwinton 444.925+ (K4DBN) - Linked or local only?
- [ ] Verify Warner Robins 443.150+ (WM4B) - Linked or local only?

### Priority 3 - Missing Information
- [ ] Find callsign for Griffin 146.910-
- [ ] Find callsign for Milledgeville 147.135+
- [ ] Verify these repeaters exist and are operational

### Priority 4 - Documentation
- [ ] Update CLAUDE.md with guidance on verifying against official list
- [ ] Create process for periodic RepeaterBook validation
- [ ] Document criteria for `linked=true` vs `linked=false`

---

## 📚 Reference Links

- **Official SKYWARN System**: https://www.repeaterbook.com/repeaters/feature_search.php?system=Georgia+SKYWARN+Linked+Repeaters+System&type=systems
- **RepeaterBook Georgia**: https://www.repeaterbook.com/repeaters/index.php?state_id=13
- **NWS Atlanta SKYWARN**: https://www.weather.gov/ffc/skywarn

---

**Last Updated**: 2026-01-08
**Validated By**: Claude Code Assistant
**Next Validation Recommended**: Quarterly or when official system updates are announced
