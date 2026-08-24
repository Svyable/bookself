# Reader, atmosphere, and audiobook roadmap

This is a living backlog for the platform's automated hourly enhancement pass.
It exists so each run — which starts with no memory of previous runs — can
pick up the next small, concrete step instead of re-deciding scope from
scratch every hour.

Ground rules for every item on this list, no exceptions:

- Read [AGENTS.md](../AGENTS.md) first. Everything here is a `reader/` /
  `desk/` / `docs/` / `books/_TEMPLATE`-style platform change, never book
  manuscript prose under `books/<slug>/manuscript/`.
- One checklist item (or a natural sub-slice of one) per pull request. Small,
  reviewable, reversible.
- After touching anything under `reader/` or `desk/`, run
  `scripts/sync-ui.sh` in the same change.
- Stay inside the [local-first publishing invariant](../AGENTS.md): every
  feature below must work fully offline, from a plain checkout plus a
  browser, with no server, build step, or paid API required for the base
  experience. Anything that benefits from a network resource (e.g. a webfont)
  needs a graceful local/system fallback, following the existing pattern in
  `reader/js/experience.js`.
- Prefer refining what already exists over adding a parallel system. Before
  building something new, check `reader/js/experience.js` (font, size,
  layout controls) and `reader/js/atmosphere.js` (palettes) — both are
  already fairly capable; the goal is steady, tasteful iteration, not a
  rewrite.
- Check an item off (`- [x]`) in the same PR that ships it, and feel free to
  add newly discovered small sub-items under the relevant phase.

## Phase A — Reading comfort (the "better than Kindle" bar)

`reader/js/experience.js` already drives font size (14–32px), several font
families, and a pagination/scroll toggle. Round it out:

- [ ] Line-height control (comfortable / standard / tight), persisted like
      font size.
- [ ] Measure / line-width control (narrow, medium, wide column), not just
      whatever the viewport gives.
- [ ] Paragraph spacing control (compact vs. airy).
- [ ] Text alignment toggle (justified vs. ragged-right), since justified
      Markdown prose can ladder badly on narrow columns without hyphenation.
- [ ] Per-book "resume where I left off" and settings recall confirmed
      working across Pages and Scroll modes (audit + fix if it regresses).
- [ ] A single "Reading" settings panel that groups font, size, line-height,
      measure, and spacing together, so the controls read as one coherent
      system instead of scattered toggles.

## Phase B — Fonts and atmosphere, iteratively

`reader/js/atmosphere.js` already ships 18 coordinated palettes;
`experience.js` already offers multiple font families with solid
Georgia/system fallbacks.

- [ ] Add one well-justified new reading font per pass (open-license,
      genuinely distinct role — e.g. a dyslexia-friendly option, a compact
      sans for small screens — not lookalikes of what's already offered).
      Follow the existing Google Fonts + local-fallback pattern in
      `reader/index.html` / `experience.js`.
- [ ] Add one new atmosphere palette per pass at most, only when it fills a
      real gap (e.g. a genuinely high-contrast accessible theme) rather than
      a minor hue variant of an existing one.
- [ ] Audit existing palettes and fonts for contrast/accessibility
      (WCAG AA) and fix any that fall short.

Keep this phase slow and curated — the point is a refined, coherent set, not
the largest possible dropdown.

## Phase C — Template chapters and worked examples

- [ ] Expand `books/_TEMPLATE/` with one more worked example chapter
      demonstrating a feature authors often miss (footnotes, citations, a
      captioned figure, a math block) with a short comment on how to use it,
      then remove the placeholder before publishing.
- [ ] Add worked, runnable examples to `docs/academic-writing.md` and
      `docs/latex.md` for any apparatus that's documented but not yet shown
      in context.
- [ ] Consider one additional book template (e.g. a poetry/verse-friendly
      layout) only once Phases A/B have made real progress — don't start a
      new template scaffold every week just to have one.

## Phase D — Audiobook support (new capability, build incrementally)

Authors record their own voice per chapter; the Reader plays it back
alongside — eventually instead of — the text. Keep the base flow local-first:
no required server-side transcoding.

- [ ] **D0 — Design doc.** Write `docs/audiobook.md`: the file convention
      (e.g. `media/audio/chNN-slug.<ext>`, one audio file per chapter,
      author's choice of format), the book README convention (an
      `Audiobook:` row or similar, optional/blank when unused), and an
      explicit non-goal list (no required transcoding pipeline, no cloud
      storage dependency). Get this reviewed via its own PR before writing
      code against it — it's the contract everything else in this phase
      follows.
- [ ] **D1 — Desk: record or attach chapter audio.** In `desk/`, add a
      per-chapter control using the browser `MediaRecorder` API so an author
      can record straight from the page, or attach an existing audio file.
      Since Desk is static with no server, saving means offering the
      recording as a download (or, where supported, the File System Access
      API) for the author to commit themselves — same trust model as every
      other Desk edit today.
- [ ] **D2 — Reader: chapter audio playback.** When a chapter has a matching
      audio file per the D0 convention, show a lightweight player in the
      Reader for that chapter (play/pause/seek), styled consistently with
      the current atmosphere.
- [ ] **D3 — Reader: sequential audiobook playback.** A "play as audiobook"
      mode that advances chapter-to-chapter as a playlist. This is the
      pragmatic v1 "compile audiobook" — no client- or server-side audio
      merging required.
- [ ] **D4 — Stretch: single-file export.** Only after D0–D3 are solid and
      real authors are using them: an optional, clearly-labeled "export
      combined audiobook file" using an on-demand, client-side tool (e.g.
      ffmpeg.wasm loaded lazily). This must stay strictly optional — the
      base record/attach/play flow from D1–D3 must keep working with zero
      added dependency weight for authors who never touch it.

Do not skip ahead to D2+ before D0 exists and has been committed — the file
and README convention is what keeps Reader, Desk, and any future importer
speaking the same format.
