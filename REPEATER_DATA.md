# Repeater data (`data/repeaters.json`)

Schema, field order, tag colours, how to add a repeater, and validation. Split out of `CLAUDE.md` on 2026-10-25; `CLAUDE.md` points here.

### Adding a New Repeater

**File**: `data/repeaters.json`

Repeater tables are dynamically generated from the unified repeaters.json file:

**JSON Structure** (fields MUST appear in this exact order):
```json
{
  "id": "WX4PTC-147.390",
  "location": {
    "city": "Peachtree City",
    "county": "Fayette",
    "site": "Optional landmark or community name"
  },
  "frequency": "147.390+",
  "tone": "141.3 Hz",
  "tags": ["WX4PTC System"],
  "description": "Wide coverage, generator backup",
  "callsign": "WX4PTC",
  "refurl": "https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID=12345",
  "linked": true,
  "validation": {
    "repeaterbook": true,
    "owner": false,
    "club": false
  },
  "active": true,
  "clubName": "Club Name Here",
  "clubUrl": "https://example.com",
  "userAccess": [
    {
      "system": "AllStar",
      "node": "12345",
      "connectionType": "available"
    }
  ],
  "repeaterLinks": [
    {
      "linkType": "full-time",
      "linkMethod": "rf",
      "linksToFreq": "444.600+",
      "linksToLoc": "Fayetteville",
      "linksToCall": "W4PSZ"
    }
  ]
}
```

**Field Descriptions** (in required order):

| # | Field | Type | Required | Description |
|---|-------|------|----------|-------------|
| 1 | `id` | string | Yes | Unique identifier: `CALLSIGN-FREQUENCY` (e.g., `W4PSZ-444.600`) |
| 2 | `location` | object | Yes | Where the repeater is, as `{ "city": string, "county": string, "site"?: string }`. `city` = nearest city/town (never a placeholder like "Barrow County"); `county` = Georgia county the repeater is located in, without the word "County" (e.g., `"Fulton"`); `site` = optional landmark or community (e.g., `"Biskey Mtn"`, `"Round Oak"`), omitted when the city alone is enough. Display strings are built in one place — `formatLocation()` / `shortLocation()` / `locationCounty()` in `js/scripts.js` — so never read `repeater.location` as a string. Added 2026-10-07; replaced the old string `location` and the separate top-level `county` field. |
| 3 | `frequency` | string | Yes | Frequency with offset (e.g., `"147.390+"`, `"145.210-"`) |
| 4 | `tone` | string/null | Yes | CTCSS/PL tone in Hz (e.g., `"141.3 Hz"`) or `null` if no tone |
| 5 | `tags` | array | Yes | Network affiliations (can be empty `[]`). Valid values: `"WX4PTC System"`, `"Peach State Intertie"`, `"Cherry Blossom Intertie"`, `"SE Linked Repeater"`, `"WX4EMA"` |
| 6 | `description` | string | Yes | Coverage area, features, emergency power, etc. |
| 7 | `callsign` | string | Yes | Amateur radio callsign (e.g., `"WX4PTC"`) or `"n0call"` if unknown |
| 8 | `refurl` | string | Yes | RepeaterBook reference URL (single source of truth) |
| 9 | `linked` | boolean | Yes | `true` if part of linked SKYWARN network, `false` otherwise |
| 10 | `validation` | object | Yes | Multi-source validation record: `{ "repeaterbook": bool, "owner": bool, "club": bool }`. Tracks three independent confirmation sources — RepeaterBook comparison, direct owner confirmation, and club website/roster confirmation — rather than a single boolean, since these are separate processes with separate reliability. `repeaterbook` is the only sub-field ever written automatically (by `scripts/verify_repeaters.py`); `owner` and `club` are set manually as Jack actually confirms with those sources. See "Validating Repeater Data" below and `getValidationTier()` in `js/scripts.js` for how these three flags are reduced to a display tier (Fully Validated/Validated/Partially Validated/Not Validated). |
| 11 | `active` | boolean | Yes | `true` if currently on-air/operational, `false` if confirmed off-air. Drives filtering: inactive repeaters are excluded from the public tables (`renderAllRepeaters()`) and CSV exports, and surfaced on `repeater-audit.html`'s Inactive list. |
| 12 | `statusNote` | string | Only when `active: false` | Free-text explanation of the outage (who reported it, what's needed, follow-up date). Read by `repeater-audit.html`'s Inactive table (`r.statusNote`). Omit entirely when the repeater is active. |
| 13 | `picUrl` | string | Only when applicable | Link to station photos (currently only 444.600+ and 442.500+). Omit if not applicable. |
| 14 | `clubName` | string/null | Yes | Sponsoring club name, or `null` if unknown |
| 15 | `clubUrl` | string/null | Yes | Sponsoring club URL, or `null` if unknown |
| 16 | `userAccess` | array | No | How one person can get on this repeater from the internet: EchoLink, an AllStar node, Hams Over IP, Amateur Wire VOIP. Each entry has `system`, `node` or `extension`, an optional `callsign` (EchoLink), and `connectionType` (`"available"`, `"full-time"` or `"on-demand"`). Omit entirely if none. Was `iplinks` until 2026-10-25. |
| 17 | `repeaterLinks` | array | No | How this repeater ties into other repeaters in the system; these are the network map's edges. Each entry has `linkType` (`"full-time"` or `"on-demand"`), `linkMethod`, and `linksToFreq`/`linksToLoc`/`linksToCall` naming the other repeater. `linkMethod` is `"rf"` (a radio link), `"direct"` (same-site companion, 0 hops on the map) or `"allstar"` (over AllStar, one hop like `"rf"`; added 2026-10-25 for Covington 146.925-). Omit entirely if none. Was `rflinks` until 2026-10-25. |

The two lists are split by purpose, not by medium. An AllStar node anyone can connect to goes in `userAccess`; an AllStar link that ties this repeater to another listed repeater goes in `repeaterLinks`. One repeater can have both. In anything people see, "link" means repeater to repeater (the Net Control Companion uses the word the same way), and "access" or "connect" means a person getting on.

**Tag Badge Colors** (CSS classes):

| Tag Value | CSS Class | Color |
|-----------|-----------|-------|
| `WX4PTC System` | `.badge-wx4ptc` | Blue (`--accent-blue`) |
| `WX4EMA` | `.badge-wx4ema` | Green (`--accent-green`) |
| `Peach State Intertie` | `.badge-peach-state` | Orange (`--accent-orange`) |
| `Cherry Blossom Intertie` | `.badge-cherry-blossom` | Pink (`--accent-pink`) |
| `SE Linked Repeater` | `.badge-se-linked` | Indigo (`--accent-indigo`) |

**Steps**:
1. Open `data/repeaters.json`
2. Add new entry in alphabetical order by `location.city` (repeaters tagged `WX4PTC System` stay grouped at the top, also alphabetical)
3. Follow the field order exactly as documented above
4. Follow JSON syntax rules:
   - Entries separated by commas
   - Last entry has NO trailing comma
   - All strings in double quotes
5. Look up callsign on [RepeaterBook.com](https://www.repeaterbook.com/)
6. Set `refurl` to the RepeaterBook URL used to find the repeater
7. Validate JSON at [jsonlint.com](https://jsonlint.com/)
8. Verify frequency and callsign are correct
9. Test on mobile (repeater tables are responsive)

**Important Notes**:
- The HTML tables on `repeaters.html` are auto-generated from this JSON file via JavaScript. Do NOT edit the HTML tables directly.
- Location names link to RepeaterBook (using `refurl`) as the single source of truth for repeater information
- The `picUrl` field is only used for repeaters with station photos (currently 444.600+ and 442.500+). These repeaters will display a camera icon (📷) next to the location name that links to the photo gallery.
- Do NOT add `picUrl` to other repeaters. If you need specialized URLs for a repeater in the future, create a new specific field.
- Fields `userAccess` and `repeaterLinks` should be omitted entirely when not applicable (do NOT include them as `null` or empty arrays).
- Fields `clubName` and `clubUrl` should always be present, set to `null` if unknown.

**For detailed non-technical instructions**, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md) Task 1.

### Validating Repeater Data

**Source of Truth**: The Georgia SKYWARN website (`data/repeaters.json`) is the **source of truth** for repeater information used on this site.

**Validation Sources**: We do not rely on any single external source to validate repeater data — the `validation` object on each record (see field #11 in the schema table above) tracks three independent sources, each confirmed through a different process:

| Source | `validation` key | How it's confirmed | Automated? |
|---|---|---|---|
| RepeaterBook.com | `repeaterbook` | Compared via `scripts/verify_repeaters.py` against the RepeaterBook export API (callsign, frequency, tone, operational status) | Yes — the only sub-field this script ever writes |
| Repeater owner/trustee | `owner` | Direct confirmation from the licensee or trustee (phone, email, in-person, net check-in) | No — set manually in the JSON when confirmed |
| Sponsoring club | `club` | Confirmed against the club's own website/roster (see `clubName`/`clubUrl`) | No — set manually in the JSON when confirmed |

A repeater's display tier (shown on the public detail modal and on `repeater-audit.html`) is derived from how many of these three are `true` — see `getValidationTier()` in `js/scripts.js`, the single source of truth for that reduction logic:
- **Fully Validated** — all three confirmed (3 of 3)
- **Validated** — two confirmed (2 of 3)
- **Partially Validated** — one confirmed (1 of 3)
- **Not Validated** — none confirmed (0 of 3; this is what drives `repeater-audit.html`'s "Not Validated" table — repeaters with at least one confirmed source are excluded from that list, even if RepeaterBook specifically hasn't confirmed them)

RepeaterBook is one input among three, not an authority the whole `validation` object defers to — this distinction matters for how we describe the relationship publicly (see the 2026-08-04 changelog entries in `DEV_CHANGELOG.md` on attribution wording).

#### RepeaterBook System Validation URLs

Use these official RepeaterBook system pages to validate repeater membership and data accuracy:

1. **Georgia SKYWARN Linked Repeaters System**
   - URL: https://www.repeaterbook.com/repeaters/feature_search.php?system=Georgia+SKYWARN+Linked+Repeaters+System&type=systems
   - Use for: Validating repeaters with `linked=true` and SKYWARN tags
   - Official list maintained by SKYWARN coordinators

2. **Peach State Intertie System**
   - URL: https://www.repeaterbook.com/repeaters/feature_search.php?system=Peach+State+Intertie+System&type=systems
   - Use for: Validating repeaters with "Peach State" tag
   - Regional linked system in central Georgia

3. **Cherry Blossom Intertie System**
   - URL: https://www.repeaterbook.com/repeaters/feature_search.php?system=Cherry+Blossom+Intertie+System&type=systems
   - Use for: Validating repeaters with "Cherry Blossom" tag
   - Regional linked system in central Georgia

4. **Southeastern Linked Repeater System**
   - URL: https://www.repeaterbook.com/repeaters/feature_search.php?system=Southeastern+Linked+Repeater+System&type=systems
   - Use for: Validating repeaters with "SE Linked Repeater" tag
   - Multi-state RF-linked system covering GA, TN, NC, SC, AL, KY
   - Net: Wednesday nights at 9:00 PM ET

#### Validation Process

**When to Validate**:
- Before adding new repeaters to the database
- Quarterly review of all linked repeaters
- When system coordinators announce changes
- After receiving reports of repeater changes/outages

**Validation Steps**:
1. Compare `data/repeaters.json` against appropriate RepeaterBook system list
2. Verify frequency, callsign, location, and tone match
3. Update `refurl` field to point to correct RepeaterBook details page (format: `details.php?state_id=13&ID=####`)
4. Check for missing repeaters (in RepeaterBook but not in our database)
5. Check for extra repeaters (in our database but not in RepeaterBook)
6. Document discrepancies in `REPEATERBOOK_VALIDATION.md`

**Important Notes**:
- Our database may intentionally include repeaters not in RepeaterBook systems (local nets, backup sites)
- Repeaters with `linked=false` do not need to be in RepeaterBook linked system lists
- The `refurl` field should ALWAYS point to RepeaterBook as the single source of truth for technical specs
- Use `picUrl` field only for station photos (currently 444.600+ and 442.500+)

**See Also**: `REPEATERBOOK_VALIDATION.md` for the most recent validation report and action items.
