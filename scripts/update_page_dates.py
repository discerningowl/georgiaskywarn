#!/usr/bin/env python3
"""
File:   scripts/update_page_dates.py
Purpose: Keep data/page-dates.json, the "Page last updated" dates in the footer
         and "Repeaters validated since" on the repeaters page.

Why:     Cloudflare Pages sends no Last-Modified header, so the page can't ask the
         server when a file changed. This file records it instead.

Usage:   python3 scripts/update_page_dates.py            (run by .githooks/pre-commit)
         python3 scripts/update_page_dates.py --rebuild  (every date from git history)

Normal run: a file staged for this commit gets today's date; the rest keep the date
already recorded. Run from the repo root. Python 3 only, nothing to install.
"""
import datetime
import glob
import json
import subprocess
import sys

DATES = "data/page-dates.json"
# The repeaters page is driven by its data file, so a change to either is a change to the page.
EXTRA_DEPS = {"repeaters.html": ["data/repeaters.json"]}
EXTRA_KEYS = ["data/repeaters.json"]


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True, check=True).stdout.strip()


def keys():
    return sorted(set(glob.glob("*.html")) | set(EXTRA_KEYS))


def deps(key):
    return [key] + EXTRA_DEPS.get(key, [])


def committed_date(key):
    dates = [git("log", "-1", "--format=%cs", "--", d) for d in deps(key)]
    return max((d for d in dates if d), default=None)


def main():
    rebuild = "--rebuild" in sys.argv
    try:
        with open(DATES) as f:
            recorded = json.load(f)
    except FileNotFoundError:
        recorded = {}
    staged = set(git("diff", "--cached", "--name-only").splitlines())
    today = datetime.date.today().isoformat()

    out = {}
    for key in keys():
        if rebuild:
            date = committed_date(key)
        elif staged & set(deps(key)):
            date = today
        else:
            date = recorded.get(key) or committed_date(key)
        if date:
            out[key] = date

    text = json.dumps(out, indent=2) + "\n"
    try:
        unchanged = open(DATES).read() == text
    except FileNotFoundError:
        unchanged = False
    if not unchanged:
        with open(DATES, "w") as f:
            f.write(text)
        print(f"{DATES} updated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
