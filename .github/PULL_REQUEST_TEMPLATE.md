## Change type

- [ ] Manuscript / publication
- [ ] Reader / Desk shared UI
- [ ] Publishing / setup tooling
- [ ] Documentation / templates / community
- [ ] Other

## What changed

## Why

## Scope

If this is a manuscript change:

- **Book / publication:**
- **Chapter:** (`chNN-slug`, front/back matter, or paper section)

If this is a platform change, name the smallest behavior this PR owns and any intentionally excluded follow-up work.

## Verification

What did you run or inspect locally?

```text
Add commands, Reader routes, browsers/devices, or a short manual check here.
```

## Checklist

Use the checks that apply to this PR; leave unrelated ones unchecked.

- [ ] Manuscript work is limited to one numbered chapter, plus its README TOC/count when needed
- [ ] Author voice is preserved; this is not a drive-by rewrite
- [ ] Reader / Desk changes remain instance-neutral and do not hard-code an owner, Binder, Shelf, or publication identity
- [ ] This change does not expose private Binder content; anything added to a public Shelf or public Git history is intentionally public
- [ ] Relevant zero-install parser or Python tests pass, or I explained why they do not apply
- [ ] I manually checked the visible Reader / Desk behavior when this changes UI
- [ ] If I maintain local instances, I synced shared `reader/` / `desk/` changes with `scripts/sync-ui.sh`
- [ ] If this PR was stacked, I re-checked its base branch after the parent landed and verified the intended files on `main`
- [ ] This change does not make hosted CI, GitHub Actions, or a build step mandatory for the normal Bookself lifecycle

See `docs/contributor-map.md` if you are not sure which checks apply.
