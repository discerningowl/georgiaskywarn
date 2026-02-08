# RepeaterBook API Query

Query the RepeaterBook API to validate Georgia SKYWARN repeater data.

## Instructions

Use the RepeaterBook API to fetch Georgia amateur radio repeater data and cross-reference it against `data/repeaters.json`.

**API Endpoint:** `https://www.repeaterbook.com/api/export.php?state_id=13`

**Required Headers:**
- `User-Agent: GeorgiaSKYWARN-RepeaterValidation (kq4jp@pm.me)`

**Steps:**

1. Fetch all Georgia repeaters from the RepeaterBook API using curl:
   ```
   curl -s -H "User-Agent: GeorgiaSKYWARN-RepeaterValidation (kq4jp@pm.me)" "https://www.repeaterbook.com/api/export.php?state_id=13"
   ```

2. Parse the JSON response and cross-reference against `data/repeaters.json`

3. For each repeater in our JSON, check if RepeaterBook has matching data by callsign + frequency

4. Report:
   - **Matches**: Repeaters that exist in both datasets with matching info
   - **Discrepancies**: Frequency, tone, location, or callsign differences
   - **Missing from RepeaterBook**: Repeaters in our JSON but not in RepeaterBook
   - **Potential additions**: RepeaterBook repeaters tagged as SKYWARN that we don't have

5. If the user provides a specific argument (e.g., `/repeaterbook KC4AQS` or `/repeaterbook 146.805`), filter results to only that callsign or frequency

**Rate Limiting:** Do NOT make more than one API call per invocation. Cache the response if multiple lookups are needed. If you receive a 429 error, stop immediately and inform the user to wait 60 seconds.

**Attribution:** RepeaterBook is the source of validation data. Our `data/repeaters.json` is the source of truth for this site; RepeaterBook is used for verification only.
