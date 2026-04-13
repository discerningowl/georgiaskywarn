#!/usr/bin/env python3
"""
Georgia SKYWARN Repeater Verification Script

Validates data/repeaters.json against the RepeaterBook API and generates
an updated REPEATERBOOK_VALIDATION.md report.

Usage:
    export REPEATERBOOK_API_KEY=app_...
    python3 scripts/verify_repeaters.py [options]

Options:
    --probe       Fetch one record and print raw API fields, then exit.
                  Use this first to confirm field name constants below.
    --fix         Write safe corrections to data/repeaters.json.
                  Safe = operational status and verified flag only.
                  Callsign/frequency/tone mismatches are always report-only.
    --output PATH Path for the markdown report.
                  Default: REPEATERBOOK_VALIDATION.md (repo root)
    --help        Show this message

Environment Variables:
    REPEATERBOOK_API_KEY    Required. Your RepeaterBook API token.

Run quarterly (next due date is in the generated report).

--- STATUS (2026-04-13) ---
Token has been rotated. Set REPEATERBOOK_API_KEY to the new token, then:
  1. Run --probe to verify field name constants (~line 45) match actual API response
  2. Run without flags to generate the full validation report
  3. Run --fix to apply safe corrections (active, verified fields only)
---
"""

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import date, timedelta
from pathlib import Path

# ---------------------------------------------------------------------------
# API configuration
# ---------------------------------------------------------------------------

API_URL = "https://www.repeaterbook.com/api/export.php"
STATE_ID = "13"  # Georgia
USER_AGENT = "User-Agent: GeorgiaSKYWARN-RepeaterValidation (kq4jp@pm.me)"

# ---------------------------------------------------------------------------
# RepeaterBook API field name constants
#
# Verified against live API response 2026-04-03.
# Run --probe to print a raw record and confirm these are still correct.
# ---------------------------------------------------------------------------

F_RPTR_ID    = "Rptr ID"           # Integer in response — cast to str for matching
F_CALLSIGN   = "Callsign"          # Callsign string
F_FREQUENCY  = "Frequency"         # Output freq, decimal string e.g. "444.60000"
F_INPUT_FREQ = "Input Freq"        # Input freq — compute offset direction vs Frequency
F_TONE       = "PL"                # CTCSS access tone e.g. "77.0" (empty string = none)
F_TONE_ALT   = "TSQ"               # Tone squelch / receive tone (fallback)
F_CITY       = "Nearest City"      # Nearest city string
F_STATUS     = "Operational Status"# "On-air", "Off-air", "Unknown", etc.
F_SKYWARN    = "SKYWARN"           # "Yes" / "No" — used to find candidate additions
F_LAST_MOD   = "Last Update"       # ISO date string e.g. "2025-10-09"

# Status strings that mean "active"
ACTIVE_STATUSES = {"on-air", "on air", "active", "operational"}

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT       = Path(__file__).parent.parent
REPEATERS_JSON  = REPO_ROOT / "data" / "repeaters.json"
DEFAULT_REPORT  = REPO_ROOT / "REPEATERBOOK_VALIDATION.md"

# ---------------------------------------------------------------------------
# API helpers
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
            status = resp.status
            content_type = resp.headers.get("Content-Type", "")
            raw = resp.read().decode("utf-8")
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
    count = data.get("count", len(results))
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

# ---------------------------------------------------------------------------
# Parsing helpers
# ---------------------------------------------------------------------------

def extract_rb_id(refurl: str):
    """Extract numeric RepeaterBook ID from a refurl like '...&ID=405'."""
    m = re.search(r"[?&]ID=(\d+)", refurl or "")
    return m.group(1) if m else None


def parse_our_freq(freq_str: str) -> tuple:
    """Parse '444.600+' → (444.6, '+'). Returns (None, None) on failure."""
    m = re.match(r"(\d+\.\d+)([+-])", freq_str or "")
    if m:
        return round(float(m.group(1)), 4), m.group(2)
    return None, None


def parse_rb_freq(rb: dict) -> tuple:
    """Parse API record → (output_freq_float, direction_str).
    Direction is computed from output vs input freq: input > output → '+', else '-'.
    """
    try:
        freq = round(float(rb.get(F_FREQUENCY) or 0), 4)
    except (ValueError, TypeError):
        return None, None
    try:
        input_freq = round(float(rb.get(F_INPUT_FREQ) or 0), 4)
    except (ValueError, TypeError):
        return freq, ""
    if input_freq == 0 or freq == 0:
        return freq, ""
    direction = "+" if input_freq > freq else "-"
    return freq, direction


def parse_our_tone(tone_str):
    """Parse '77.0 Hz' → 77.0. None input → None."""
    if tone_str is None:
        return None
    m = re.match(r"(\d+\.?\d*)", str(tone_str))
    return round(float(m.group(1)), 1) if m else None


def parse_rb_tone(rb: dict):
    """Parse access tone from API record → float or None.
    Uses PL field (access/transmit tone); falls back to TSQ.
    Empty string means no tone required.
    """
    raw = rb.get(F_TONE) or rb.get(F_TONE_ALT)
    if not raw:
        return None
    s = str(raw).strip()
    if s in ("", "0", "0.0"):
        return None
    try:
        return round(float(s), 1)
    except (ValueError, TypeError):
        return None


def rb_is_active(rb: dict) -> bool:
    return str(rb.get(F_STATUS, "")).strip().lower() in ACTIVE_STATUSES

# ---------------------------------------------------------------------------
# Issue tracking
# ---------------------------------------------------------------------------

SEVERITY_ORDER = {"high": 0, "medium": 1, "low": 2, "info": 3}
SEVERITY_ICON  = {"high": "🔴", "medium": "🟡", "low": "🔵", "info": "ℹ️"}


class Issue:
    def __init__(self, severity, category, repeater_id, location, field, ours, theirs, note=""):
        self.severity    = severity
        self.category    = category
        self.repeater_id = repeater_id
        self.location    = location
        self.field       = field
        self.ours        = str(ours) if ours is not None else "null"
        self.theirs      = str(theirs) if theirs is not None else "null"
        self.note        = note

# ---------------------------------------------------------------------------
# Comparison
# ---------------------------------------------------------------------------

def compare(our_repeaters: list, rb_index: dict) -> tuple:
    """
    Compare our database against RepeaterBook data.

    Returns:
        issues  — list of Issue objects
        fixes   — dict {repeater_id: {field: new_value}} for safe auto-fixes
        missing — list of our repeater dicts not found in the API
    """
    issues  = []
    fixes   = {}
    missing = []

    for r in our_repeaters:
        rid  = r["id"]
        loc  = r.get("location", "")
        rb_id = extract_rb_id(r.get("refurl", ""))

        if not rb_id:
            issues.append(Issue(
                "medium", "No RepeaterBook ID", rid, loc,
                "refurl", r.get("refurl"), None,
                "Cannot extract numeric ID — check refurl format",
            ))
            continue

        rb = rb_index.get(rb_id)
        if rb is None:
            missing.append(r)
            issues.append(Issue(
                "high", "Not found in API response", rid, loc,
                "refurl", f"ID={rb_id}", None,
                "Record absent from Georgia export — removed, inactive, or wrong state?",
            ))
            continue

        entry_fixes = {}

        # --- Callsign ---
        our_cs = r.get("callsign", "").strip().upper()
        rb_cs  = str(rb.get(F_CALLSIGN, "") or "").strip().upper()
        if our_cs == "N0CALL" and rb_cs:
            issues.append(Issue(
                "high", "Unknown callsign resolved", rid, loc,
                "callsign", r.get("callsign"), rb.get(F_CALLSIGN),
                "RepeaterBook has a real callsign — update manually and set verified: true",
            ))
        elif our_cs and rb_cs and our_cs != rb_cs:
            issues.append(Issue(
                "high", "Callsign mismatch", rid, loc,
                "callsign", r.get("callsign"), rb.get(F_CALLSIGN),
                "Verify on RepeaterBook before changing",
            ))

        # --- Frequency ---
        our_freq, our_dir = parse_our_freq(r.get("frequency", ""))
        rb_freq, rb_dir   = parse_rb_freq(rb)
        if our_freq is not None and rb_freq is not None:
            freq_match = abs(our_freq - rb_freq) <= 0.001
            dir_match  = our_dir == rb_dir
            if not freq_match or not dir_match:
                issues.append(Issue(
                    "high", "Frequency mismatch", rid, loc,
                    "frequency", r.get("frequency"),
                    f"{rb_freq}{rb_dir}",
                    "Verify on RepeaterBook before changing",
                ))

        # --- Tone ---
        our_tone = parse_our_tone(r.get("tone"))
        rb_tone  = parse_rb_tone(rb)
        if our_tone != rb_tone:
            our_tone_str = f"{our_tone} Hz" if our_tone is not None else "null"
            rb_tone_str  = f"{rb_tone} Hz"  if rb_tone  is not None else "null"
            issues.append(Issue(
                "medium", "Tone mismatch", rid, loc,
                "tone", r.get("tone"), rb_tone_str,
            ))

        # --- Operational status ---
        rb_active  = rb_is_active(rb)
        our_active = r.get("active", True)
        rb_status  = rb.get(F_STATUS, "unknown")

        if our_active and not rb_active:
            issues.append(Issue(
                "high", "Repeater appears off-air", rid, loc,
                "active", "true", "false",
                f"RepeaterBook status: {rb_status}",
            ))
            entry_fixes["active"] = False

        elif not our_active and rb_active:
            issues.append(Issue(
                "medium", "Repeater may be back on-air", rid, loc,
                "active", "false", "true",
                f"RepeaterBook status: {rb_status} — confirm before setting active: true",
            ))
            entry_fixes["active"] = True

        # --- Verified flag ---
        if not r.get("verified", False) and our_cs not in ("N0CALL", "") and our_cs == rb_cs:
            issues.append(Issue(
                "info", "Ready to mark verified", rid, loc,
                "verified", "false", "true",
                "Callsign confirmed against RepeaterBook",
            ))
            entry_fixes["verified"] = True

        if entry_fixes:
            fixes[rid] = entry_fixes

    return issues, fixes, missing


def find_candidates(our_repeaters: list, rb_index: dict) -> list:
    """
    Find RepeaterBook records flagged SKYWARN=Yes but not in our DB.
    The export API has no system/intertie membership data, so SKYWARN=Yes
    is the best available signal for potential additions.
    """
    our_rb_ids = set()
    for r in our_repeaters:
        rb_id = extract_rb_id(r.get("refurl", ""))
        if rb_id:
            our_rb_ids.add(rb_id)

    found = []
    for rb_id, rb in rb_index.items():
        if rb_id in our_rb_ids:
            continue
        if str(rb.get(F_SKYWARN, "")).strip().lower() == "yes":
            found.append(rb)
    return found

# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def md_row(*cells) -> str:
    return "| " + " | ".join(str(c) for c in cells) + " |"


def generate_report(our_repeaters, issues, fixes, missing, candidates, run_date) -> str:
    total      = len(our_repeaters)
    n_linked   = sum(1 for r in our_repeaters if r.get("linked"))
    n_nonlinked = total - n_linked

    by_sev = {s: [] for s in SEVERITY_ORDER}
    for issue in issues:
        by_sev.setdefault(issue.severity, []).append(issue)

    lines = []

    # Header
    lines += [
        "# RepeaterBook Validation Report",
        "",
        f"**Date:** {run_date}",
        f"**Validated By:** Claude AI (RepeaterBook API — live automated check)",
        f"**Database:** `data/repeaters.json`",
        f"**Total Repeaters:** {total} ({n_linked} linked, {n_nonlinked} non-linked)",
        "",
        "---",
        "",
        "## Summary",
        "",
        "| Severity | Count |",
        "|----------|-------|",
    ]
    for sev, icon in SEVERITY_ICON.items():
        lines.append(f"| {icon} {sev.capitalize()} | {len(by_sev.get(sev, []))} |")
    lines += [
        f"| 🆕 Potential missing repeaters | {len(candidates)} |",
        "",
        "---",
        "",
    ]

    # Issues grouped by category, ordered by severity
    by_category: dict[str, list] = {}
    for issue in issues:
        by_category.setdefault(issue.category, []).append(issue)

    if by_category:
        lines.append("## Issues")
        lines.append("")

    # Sort categories by worst severity within each group
    def cat_sort_key(item):
        cat, cat_issues = item
        return min(SEVERITY_ORDER.get(i.severity, 9) for i in cat_issues)

    for category, cat_issues in sorted(by_category.items(), key=cat_sort_key):
        worst_sev = min(cat_issues, key=lambda i: SEVERITY_ORDER.get(i.severity, 9)).severity
        icon = SEVERITY_ICON.get(worst_sev, "•")
        lines += [
            f"### {icon} {category} ({len(cat_issues)})",
            "",
            "| Repeater ID | Location | Field | Ours | RepeaterBook | Note |",
            "|-------------|----------|-------|------|-------------|------|",
        ]
        for i in sorted(cat_issues, key=lambda x: x.location):
            lines.append(md_row(
                f"`{i.repeater_id}`", i.location, i.field,
                f"`{i.ours}`", f"`{i.theirs}`", i.note,
            ))
        lines.append("")

    # Potential missing repeaters
    if candidates:
        lines += [
            "---",
            "",
            "## 🆕 Potential Missing Repeaters",
            "",
            "These RepeaterBook records appear SKYWARN/system-affiliated but are "
            "absent from our database. Review each and add to `data/repeaters.json` "
            "if appropriate.",
            "",
            "| RB ID | Callsign | Output Freq | Nearest City | Last Update |",
            "|-------|----------|-------------|--------------|-------------|",
        ]
        for rb in sorted(candidates, key=lambda x: x.get(F_CITY, "")):
            rb_id     = rb.get(F_RPTR_ID, "?")
            cs        = rb.get(F_CALLSIGN, "?")
            freq      = rb.get(F_FREQUENCY, "?")
            _, direction = parse_rb_freq(rb)
            city      = rb.get(F_CITY, "?")
            last_mod  = rb.get(F_LAST_MOD, "?")
            rb_url    = f"https://www.repeaterbook.com/repeaters/details.php?state_id=13&ID={rb_id}"
            lines.append(md_row(
                f"[{rb_id}]({rb_url})", cs, f"{freq}{direction}", city, last_mod,
            ))
        lines.append("")

    # Safe auto-fixes
    if fixes:
        lines += [
            "---",
            "",
            "## ✅ Safe Auto-Fixes Available",
            "",
            "Run with `--fix` to apply these changes to `data/repeaters.json`:",
            "",
            "| Repeater ID | Field | Current | New Value |",
            "|-------------|-------|---------|-----------|",
        ]
        for rid, fdict in sorted(fixes.items()):
            cur_r = next((r for r in our_repeaters if r["id"] == rid), {})
            for field, new_val in fdict.items():
                cur = cur_r.get(field, "?")
                lines.append(md_row(f"`{rid}`", field, f"`{cur}`", f"`{new_val}`"))
        lines += [
            "",
            "> **Note:** `active` and `verified` are the only fields auto-fixed. "
            "Callsign, frequency, and tone changes always require manual review.",
            "",
        ]
    else:
        lines += [
            "---",
            "",
            "## ✅ No Safe Auto-Fixes Needed",
            "",
            "`active` and `verified` fields are consistent with RepeaterBook.",
            "",
        ]

    # System membership (always manual)
    lines += [
        "---",
        "",
        "## System Membership (Manual Check Required)",
        "",
        "The RepeaterBook export API does not include full network/system membership "
        "details. Cross-reference these pages to validate `tags` in `repeaters.json`:",
        "",
        "| System | URL |",
        "|--------|-----|",
        "| Georgia SKYWARN Linked | https://www.repeaterbook.com/repeaters/feature_search.php?system=Georgia+SKYWARN+Linked+Repeaters+System&type=systems |",
        "| Peach State Intertie | https://www.repeaterbook.com/repeaters/feature_search.php?system=Peach+State+Intertie+System&type=systems |",
        "| Cherry Blossom Intertie | https://www.repeaterbook.com/repeaters/feature_search.php?system=Cherry+Blossom+Intertie+System&type=systems |",
        "| Southeastern Linked | https://www.repeaterbook.com/repeaters/feature_search.php?system=Southeastern+Linked+Repeater+System&type=systems |",
        "",
        "For each system:",
        "1. Any repeater on RepeaterBook **not in our database** → add to `repeaters.json`",
        "2. Any repeater in our database **not on RepeaterBook** → confirm affiliation or remove tag",
        "3. Frequency, tone, and callsign match for all entries",
        "",
    ]

    # Footer
    next_date = run_date + timedelta(days=91)
    lines += [
        "---",
        "",
        f"*Next validation recommended: {next_date} (quarterly)*",
        "",
    ]

    return "\n".join(lines)

# ---------------------------------------------------------------------------
# Fix mode
# ---------------------------------------------------------------------------

def apply_fixes(our_repeaters: list, fixes: dict) -> int:
    """Apply safe fixes to repeaters list in-place. Returns count of changed fields."""
    changed = 0
    for r in our_repeaters:
        rid = r["id"]
        if rid in fixes:
            for field, new_val in fixes[rid].items():
                old = r.get(field)
                r[field] = new_val
                print(f"  {rid}.{field}: {old!r} → {new_val!r}")
                changed += 1
    return changed

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate Georgia SKYWARN repeaters against the RepeaterBook API.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--probe", action="store_true",
        help="Print raw API fields from the first returned record, then exit. "
             "Use to verify field name constants at the top of this script.",
    )
    parser.add_argument(
        "--fix", action="store_true",
        help="Write safe corrections (active, verified) to data/repeaters.json.",
    )
    parser.add_argument(
        "--output", type=Path, default=DEFAULT_REPORT,
        metavar="PATH",
        help=f"Report output path (default: {DEFAULT_REPORT.name} in repo root)",
    )
    args = parser.parse_args()

    api_key = get_api_key()
    rb_records = fetch_georgia_repeaters(api_key)

    # --probe: show raw schema and exit
    if args.probe:
        if not rb_records:
            print("No records returned from API.")
        else:
            print(f"\n--- First record ({len(rb_records)} total) ---")
            print(json.dumps(rb_records[0], indent=2))
            print("\n--- Field names ---")
            for k in rb_records[0]:
                print(f"  {k!r}")
        return

    rb_index = build_rb_index(rb_records)
    print(f"  Indexed {len(rb_index)} records by {F_RPTR_ID!r}")

    our_repeaters = json.loads(REPEATERS_JSON.read_text())
    print(f"  Loaded {len(our_repeaters)} repeaters from {REPEATERS_JSON.name}")

    print("Comparing ...")
    issues, fixes, missing = compare(our_repeaters, rb_index)
    candidates = find_candidates(our_repeaters, rb_index)

    high_count = sum(1 for i in issues if i.severity == "high")
    print(f"  {len(issues)} issues ({high_count} high-priority), "
          f"{len(fixes)} safe fixes, {len(candidates)} potential additions")

    report = generate_report(our_repeaters, issues, fixes, missing, candidates, date.today())
    args.output.write_text(report)
    print(f"\nReport: {args.output}")

    if args.fix:
        if fixes:
            print(f"\nApplying {len(fixes)} fix(es) to {REPEATERS_JSON.name} ...")
            changed = apply_fixes(our_repeaters, fixes)
            REPEATERS_JSON.write_text(json.dumps(our_repeaters, indent=2) + "\n")
            print(f"  {changed} field(s) updated")
        else:
            print("\nNo safe fixes to apply.")
    elif fixes:
        print(f"\nTip: Run with --fix to apply {len(fixes)} safe correction(s).")


if __name__ == "__main__":
    main()
