#!/usr/bin/env python3
"""Run the Bookself Reader browser contract matrix without project dependencies."""

from __future__ import annotations

import argparse
import html
import http.server
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import threading

ROOT = Path(__file__).resolve().parents[1]
LAB_PATH = "/tests/reader-quality/index.html"
RESULT_RE = re.compile(
    r'<script[^>]+id="reader-quality-result"[^>]*>(.*?)</script>',
    re.IGNORECASE | re.DOTALL,
)
BROWSER_NAMES = (
    "chromium",
    "chromium-browser",
    "google-chrome",
    "google-chrome-stable",
    "chrome",
    "msedge",
    "microsoft-edge",
)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, _format: str, *args: object) -> None:
        return


def find_browser(explicit: str | None) -> str | None:
    if explicit:
        path = shutil.which(explicit) or explicit
        return path if Path(path).exists() else None
    for name in BROWSER_NAMES:
        path = shutil.which(name)
        if path:
            return path
    return None


def serve() -> tuple[http.server.ThreadingHTTPServer, threading.Thread]:
    handler = lambda *args, **kwargs: QuietHandler(*args, directory=str(ROOT), **kwargs)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, thread


def extract_payload(dom: str) -> dict:
    match = RESULT_RE.search(dom)
    if not match:
        raise RuntimeError("Browser output did not contain the Reader quality result payload")
    raw = html.unescape(match.group(1)).strip()
    payload = json.loads(raw or "{}")
    if not isinstance(payload, dict):
        raise RuntimeError("Reader quality result payload was not an object")
    return payload


def print_payload(payload: dict) -> int:
    summary = payload.get("summary") or {}
    results = payload.get("results") or []
    for result in results:
        label = result.get("label") or result.get("id") or "scenario"
        pointer = result.get("pointer") or "unknown"
        status = "PASS" if result.get("pass") else "FAIL"
        print(f"{status:4}  {label}  [{pointer}]")
        for failure in result.get("failures") or []:
            print(f"      - {failure.get('id')}: {failure.get('message')}")
    if payload.get("error"):
        print(f"ERROR  {payload['error']}")
    total = int(summary.get("total") or 0)
    passed = int(summary.get("passed") or 0)
    failed = int(summary.get("failed") or 0)
    print(f"reader quality lab: {passed}/{total} scenarios passed ({failed} failed)")
    return 0 if summary.get("pass") else 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", help="Chromium-family browser executable or path")
    parser.add_argument("--timeout", type=int, default=35, help="Browser timeout in seconds (default: 35)")
    args = parser.parse_args()

    browser = find_browser(args.browser)
    if not browser:
        print("No Chromium-family browser found.", file=sys.stderr)
        print(
            "Serve the repo with `python3 -m http.server 8000` and open /tests/reader-quality/ manually.",
            file=sys.stderr,
        )
        return 2

    server, thread = serve()
    try:
        port = server.server_address[1]
        url = f"http://127.0.0.1:{port}{LAB_PATH}?autorun=1"
        command = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--disable-background-networking",
            "--disable-default-apps",
            "--disable-extensions",
            "--disable-sync",
            "--metrics-recording-only",
            "--no-first-run",
            "--virtual-time-budget=12000",
            "--dump-dom",
            url,
        ]
        env = dict(os.environ)
        env.setdefault("HOME", str(ROOT))
        completed = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=max(5, args.timeout),
            check=False,
            env=env,
        )
        if not completed.stdout.strip():
            detail = completed.stderr.strip().splitlines()[-1:] or ["no browser output"]
            raise RuntimeError(f"Headless browser produced no DOM output ({'; '.join(detail)})")
        payload = extract_payload(completed.stdout)
        return print_payload(payload)
    except subprocess.TimeoutExpired:
        print(f"Reader quality browser run exceeded {args.timeout}s", file=sys.stderr)
        return 3
    except (OSError, RuntimeError, json.JSONDecodeError) as error:
        print(f"Reader quality browser run failed: {error}", file=sys.stderr)
        return 3
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


if __name__ == "__main__":
    raise SystemExit(main())
