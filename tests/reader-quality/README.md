# Reader Quality Lab

This is a zero-build browser contract matrix for the shared Bookself Reader. It exists because pure model tests can prove policy and source-position logic, but they cannot catch CSS-cascade regressions, viewport escape, undersized rendered controls, or mode-specific rendering collisions.

The lab renders the real Reader stylesheets inside exact iframe viewports for seven baseline scenarios:

- desktop Pages spread — 1280×800
- tablet landscape Pages spread — 1024×768
- tablet portrait Pages single — 768×1024
- phone portrait Pages — 390×844
- short phone landscape Pages — 844×390
- desktop Continuous — 1280×800
- phone portrait Continuous — 390×844

Each scenario checks viewport/header/page containment, 44px header controls, 48px fine-pointer or 52px coarse-pointer page-turn controls, Pages/Continuous isolation, emergency wrapping for long inline tokens, and local horizontal scrolling for wide code/tables.

## Run it

From the repository root:

```bash
python3 scripts/reader-quality.py
```

The runner uses Python's standard library and an installed Chromium-family browser; it does not add npm, Playwright, Selenium, a build step, or CI dependency. It starts a temporary loopback server, runs the browser matrix headlessly, prints failures, and exits non-zero if a contract fails.

If no supported headless browser is installed, serve the repository and open the lab manually in any browser:

```bash
python3 -m http.server 8000
# open http://127.0.0.1:8000/tests/reader-quality/
```

Manual Firefox/Safari/Chromium runs are useful because pointer/media-query behavior is browser/device dependent. The lab reports whether each fixture is currently seeing a fine or coarse pointer and applies the matching page-turn target contract.

This tooling is developer-only. It does not change publication data, Reader storage, routing, preferences, or the no-build Reader runtime.
