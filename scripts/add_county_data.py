#!/usr/bin/env python3
"""
Add County Data to repeaters.json

Fetches the RepeaterBook API for all Georgia repeaters and adds a `county`
field (inserted after `tone`) to every entry in data/repeaters.json.

Usage:
    export REPEATERBOOK_API_KEY=app_...
    python3 scripts/add_county_data.py [options]

Options:
    --probe       Fetch one record and print all raw API fields, then exit.
                  Use this first to confirm the county field name constant below.
    --dry-run     Show what would change without writing to repeaters.json.
    --help        Show this message.

Environment Variables:
    REPEATERBOOK_API_KEY    Required. Your RepeaterBook API token.

Field Matching:
    Each repeater in repeaters.json has a `refurl` pointing to a RepeaterBook
    details page (e.g. ...?state_id=13&ID=6482).  The numeric ID is extracted
    and used to look up the matching record in the API export.

Output Field Order (after this script runs):
    id → location → frequency → tone → county → tags → ...

Notes:
    - Repeaters with no matching API record get county: null.
    - Repeaters that already have a `county` field are updated, not duplicated.
    - Run --probe first if the RepeaterBook API response shape is uncertain.
"""

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

# ---------------------------------------------------------------------------
# API configuration
# ---------------------------------------------------------------------------

API_URL   = "https://www.repeaterbook.com/api/export.php"
STATE_ID  = "13"  # Georgia
USER_AGENT = "User-Agent: GeorgiaSKYWARN-RepeaterValidation (kq4jp@pm.me)"

# ---------------------------------------------------------------------------
# RepeaterBook API field name constants
#
# Run --probe to print a raw record and verify these match the live API.
# ---------------------------------------------------------------------------

F_RPTR_ID  = "Rptr ID"       # Integer ID — cast to str for matching
F_COUNTY   = "County"        # County name string (e.g. "Fulton")

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT      = Path(__file__).parent.parent
REPEATERS_JSON = REPO_ROOT / "data" / "repeaters.json"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_api_key() -> str:
    key = os.environ.get("REPEATERBOOK_API_KEY", "").strip()
    if not key:
        sys.exit(
            "Error: REPEATERBOOK_API_KEY environment variable is not set.\n"
            "  export REPEATERBOOK_API_KEY=app_..."
        )
    return key


def fetch_georgia_repeaters(api_key: str) -> list:
    """Fetch all Georgia repeaters from the RepeaterBook export API."""
    url = f"{API_URL}?state_id={STATE_ID}"
    req = urllib.request.Request(
        url,
        headers={
            "X-RB-App-Token": api_key,
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
        },
    )
    print(f"Fetching Georgia repeaters from RepeaterBook API ...")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status       = resp.status
            content_type = resp.headers.get("Content-Type", "")
            raw          = resp.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        sys.exit(
            f"API error {exc.code}: {exc.reason}\n"
            f"URL: {url}\n"
            f"Response body: {body[:500]}"
        )
    except urllib.error.URLError as exc:
        sys.exit(f"Network error: {exc.reason}")

    if not raw.strip():
        sys.exit(
            f"API returned an empty response (HTTP {status}, Content-Type: {content_type}).\n"
            f"Check that REPEATERBOOK_API_KEY is set correctly and the token is valid.\n"
            f"URL tried: {url}"
        )

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        sys.exit(
            f"API returned non-JSON response (HTTP {status}, Content-Type: {content_type}):\n"
            f"{exc}\n"
            f"First 500 chars of response:\n{raw[:500]}"
        )

    results = data.get("results", [])
    count   = data.get("count", len(results))
    print(f"  Received {count} records")
    return results


def build_rb_index(records: list) -> dict:
    """Build a dict keyed by Rptr ID string → record."""
    index = {}
    for r in records:
        rid = str(r.get(F_RPTR_ID, "")).strip()
        if rid:
            index[rid] = r
    return index


def extract_rb_id(refurl: str):
    """Extract numeric RepeaterBook ID from a refurl like '...&ID=405'."""
    m = re.search(r"[?&]ID=(\d+)", refurl or "")
    return m.group(1) if m else None


def insert_county_after_tone(repeater: dict, county_value) -> dict:
    """
    Return a new dict with the same key-value pairs but with `county` inserted
    immediately after `tone`.  Handles repeaters that already have a `county`
    field (drops the old one first so position is correct).
    """
    # Remove existing county key if present so we can reinsert at the right spot
    cleaned = {k: v for k, v in repeater.items() if k != "county"}

    result = {}
    inserted = False
    for key, value in cleaned.items():
        result[key] = value
        if key == "tone" and not inserted:
            result["county"] = county_value
            inserted = True

    # Fallback: if tone wasn't found, append county at end
    if not inserted:
        result["county"] = county_value

    return result

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Add county data from RepeaterBook API to data/repeaters.json.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--probe", action="store_true",
        help=(
            "Print all raw API fields from the first returned record, then exit. "
            "Use to verify the F_COUNTY constant ('County') matches the live API."
        ),
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show what would change without writing to repeaters.json.",
    )
    args = parser.parse_args()

    api_key    = get_api_key()
    rb_records = fetch_georgia_repeaters(api_key)

    # --probe: show raw schema and exit
    if args.probe:
        if not rb_records:
            print("No records returned from API.")
        else:
            print(f"\n--- First record ({len(rb_records)} total) ---")
            print(json.dumps(rb_records[0], indent=2))
            print("\n--- All field names ---")
            for k in rb_records[0]:
                print(f"  {k!r}")
        return

    rb_index = build_rb_index(rb_records)
    print(f"  Indexed {len(rb_index)} records by '{F_RPTR_ID}'")

    our_repeaters = json.loads(REPEATERS_JSON.read_text())
    print(f"  Loaded {len(our_repeaters)} repeaters from {REPEATERS_JSON.name}")

    updated    = []
    changed    = 0
    no_match   = []
    no_refurl  = []

    for repeater in our_repeaters:
        rid    = repeater.get("id", "?")
        refurl = repeater.get("refurl", "")
        rb_id  = extract_rb_id(refurl)

        if not rb_id:
            no_refurl.append(rid)
            county_value = None
        else:
            rb = rb_index.get(rb_id)
            if rb is None:
                no_match.append(rid)
                county_value = None
            else:
                raw_county = rb.get(F_COUNTY)
                # Normalize: strip whitespace, treat empty string as None
                county_value = raw_county.strip() if isinstance(raw_county, str) and raw_county.strip() else None

        old_county = repeater.get("county", "MISSING")
        new_entry  = insert_county_after_tone(repeater, county_value)

        if args.dry_run:
            if old_county == "MISSING":
                print(f"  [{rid}]  ADD  county = {county_value!r}")
                changed += 1
            elif old_county != county_value:
                print(f"  [{rid}]  UPDATE  county: {old_county!r} → {county_value!r}")
                changed += 1
            else:
                print(f"  [{rid}]  no change  (county = {county_value!r})")
        else:
            if old_county != county_value:
                changed += 1

        updated.append(new_entry)

    # Summary
    print()
    if no_refurl:
        print(f"  WARNING: {len(no_refurl)} repeater(s) have no parseable refurl — county set to null:")
        for rid in no_refurl:
            print(f"    {rid}")

    if no_match:
        print(f"  WARNING: {len(no_match)} repeater(s) not found in API response — county set to null:")
        for rid in no_match:
            print(f"    {rid}")

    if args.dry_run:
        print(f"\nDry run complete. {changed} field(s) would change. No files written.")
        return

    REPEATERS_JSON.write_text(json.dumps(updated, indent=2) + "\n")
    print(f"Updated {changed} county field(s) in {REPEATERS_JSON}")
    print("Done.")


if __name__ == "__main__":
    main()
