#!/usr/bin/env python3
"""
File:   scripts/serve.py
Purpose: Run the site on your own computer the way Cloudflare Pages serves it,
         so what you test is what visitors get. Python 3 only, nothing to install.

Usage:   python3 scripts/serve.py [port]      (default port 8000)
         then open http://localhost:8000

What it copies from Cloudflare Pages:
  - /about serves about.html; /about.html redirects to /about (and /index.html to /)
  - the plain-line rules in _redirects (/old /new 301) are applied
  - an address that doesn't exist gets 404.html with a real 404 status
What it does not do: _headers (headers only matter on the live site) and the
www redirect, which is a Cloudflare dashboard rule.
"""
import http.server
import os
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))


def load_redirects():
    rules = {}
    path = os.path.join(ROOT, "_redirects")
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            parts = line.split("#")[0].split()
            if len(parts) >= 2 and "*" not in parts[0]:
                rules[parts[0]] = (parts[1], int(parts[2]) if len(parts) > 2 else 302)
    return rules


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def _redirect(self, location, code):
        self.send_response(code)
        self.send_header("Location", location)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _not_found(self):
        body = open(os.path.join(ROOT, "404.html"), "rb").read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        return body

    def _route(self):
        """Return a redirect (location, code), a rewritten path, or None for a 404."""
        url_path, _, query = self.path.partition("?")
        suffix = ("?" + query) if query else ""
        redirects = load_redirects()
        if url_path in redirects:
            target, code = redirects[url_path]
            return ("redirect", target + suffix, code)
        if url_path == "/index.html":
            return ("redirect", "/" + suffix, 308)
        if url_path.endswith(".html") and os.path.exists(os.path.join(ROOT, url_path.lstrip("/"))):
            return ("redirect", url_path[:-5] + suffix, 308)
        if url_path.endswith("/"):
            return ("rewrite", url_path + "index.html")
        fs = os.path.join(ROOT, url_path.lstrip("/"))
        if os.path.isfile(fs):
            return ("rewrite", url_path)
        if os.path.isfile(fs + ".html"):
            return ("rewrite", url_path + ".html")
        return None

    def do_GET(self):
        route = self._route()
        if route is None:
            body = self._not_found()
            self.wfile.write(body)
        elif route[0] == "redirect":
            self._redirect(route[1], route[2])
        else:
            self.path = route[1]
            super().do_GET()

    def do_HEAD(self):
        route = self._route()
        if route is None:
            self._not_found()
        elif route[0] == "redirect":
            self._redirect(route[1], route[2])
        else:
            self.path = route[1]
            super().do_HEAD()

    def end_headers(self):
        # A dev server should never let the browser reuse an old copy.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s\n" % (fmt % args))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print("Serving %s at http://localhost:%d  (Ctrl+C to stop)" % (ROOT, port))
    http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
