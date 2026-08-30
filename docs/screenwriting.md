# Screenwriting with Bookself

Bookself can treat a screenplay, teleplay, stage-oriented script draft, or other dialogue-heavy production text as a first-class publication while keeping the source as inspectable plain text.

The design goal is simple: **writers should be able to write and review a script in Git; actors should be able to read and rehearse the same committed text in the Reader.** No proprietary binary project file is required for the Bookself workflow.

## Start a screenplay

Use `books/_SCREENPLAY_TEMPLATE/` or choose **Screenplay / teleplay** in the New Publication Studio.

A screenplay publication uses the same Bookself folder contract as other work:

```text
books/your-script/
├── README.md
├── RIGHTS.md
├── rights.json
├── reader.json
├── manuscript/
│   └── script.md
└── media/
```

The publication README should use `Format: Screenplay`, `Teleplay`, or `Script`. The recommended `reader.json` starting point is:

```json
{
  "version": 1,
  "preset": "screenplay"
}
```

That preset begins with a Courier-style screenplay page, ragged-right text, no hyphenation, and paged reading. It is a recommendation, not a lock: every reader can still enlarge the type, switch to Scroll, change the palette, or choose a different typeface locally.

## The source is a Fountain-compatible core

Bookself intentionally supports a small, useful subset of Fountain-style plain-text screenplay conventions. The aim is portability and readable Git diffs, not a claim of complete Fountain or Final Draft compatibility.

| Purpose | Plain-text source | Reader treatment |
|---|---|---|
| Scene heading | `INT. KITCHEN - NIGHT` | uppercase scene heading + navigation point |
| Forced scene heading | `.MONTAGE - VARIOUS` | scene heading |
| Action | ordinary text | full script measure |
| Forced action | `!THE DOOR SLAMS` | action even when all caps |
| Character cue | `MARA` | character cue |
| Forced character cue | `@Dr. Rivera` | character cue even when mixed case |
| Cue extension | `MARA (V.O.)` | cue; rehearsal role is normalized to `MARA` |
| Parenthetical | `(quietly)` | parenthetical within the dialogue block |
| Dialogue | text immediately after a character cue | dialogue measure |
| Transition | `CUT TO:` or `> SMASH CUT TO:` | right-aligned transition |
| Centered text | `> ACT ONE <` | centered printed text |
| Writer-room section | `# ACT ONE` | outline/navigation metadata; not printed |
| Explicit page break | `===` | page break |
| Dual-dialogue marker | `ELI ^` | marker preserved for screenplay semantics |

A useful opening therefore looks like this:

```text
# ACT ONE

> ACT ONE <

INT. WRITER'S ROOM - DAY

Rain stipples the windows. A half-erased beat sheet covers the wall.

MARA
We can keep arguing about the ending.

ELI
(considering)
Or we can write the scene and find out.
```

The `# ACT ONE` line is deliberately an **outline section**, like Fountain sections: it helps writers organize and navigate the script but does not print as screenplay content. If the audience should actually see `ACT ONE`, add the centered `> ACT ONE <` line as shown above.

### Ambiguous all-caps lines

In plain-text screenplay syntax, an all-caps line followed by text can look like a character cue. When an all-caps action line could be mistaken for a cue, force it to action with `!`:

```text
!THE GENERATOR HUMS
Still too loud to ignore.
```

Use `@` for the opposite case when a character cue is intentionally not all caps:

```text
@Dr. Rivera
Come in.
```

These marks remain useful in raw GitHub source and are removed or interpreted by the Reader presentation.

## Collaboration: the repository becomes the writers' room

A script gets the normal advantages of Bookself's Git-native model without turning the screenplay into software.

A writer can put one meaningful scene change in a commit. A collaborator can branch an alternate version of a sequence. A pull request can hold a conversation around exact changed lines. Git history preserves cuts and earlier approaches without forcing them into the current script. A Reader proof lets collaborators review the text as a script instead of evaluating only a diff.

For a private project, keep the working screenplay on a private Desk. Send collaborators the appropriate repository or private proof access. Release a deliberate snapshot to Shelf only when the rightsholder intends that edition to become public.

## Actor rehearsal

When the Reader opens a publication whose `Format` is Screenplay, Teleplay, or Script, it exposes a **Lines** control. Press `r` to open the same rehearsal controls from the keyboard.

The Reader derives speaking roles from character cues in the committed script. An actor can choose a role and then:

- **Hide my lines** — conceal only that character's dialogue while preserving the exact page geometry.
- **Tap / Enter to reveal** — reveal an individual hidden speech without causing the script to reflow.
- **Previous cue / Next cue** — move between that role's speeches across scenes and script sections.
- Keep other characters' dialogue, action, parentheticals, and scene context visible as cues.

Role choice and masking are stored only in that browser. They do not edit `script.md`, create commits, alter the published edition, or expose a private annotation to collaborators.

This makes the Reader useful for table reads, self-tapes, rehearsals, line memorization, and blocking conversations while keeping one canonical script source.

## Why hiding lines does not remove them

The rehearsal mask changes paint, not layout. A hidden line retains its width and height so page breaks and cue positions do not jump when an actor reveals it. This matters for muscle memory and for comparing a rehearsal copy with the writer's current proof.

Printing always restores the full dialogue; rehearsal masking is not a redaction or secrecy feature.

## Pages, Scroll, and printing

The screenplay preset starts in **Pages** because screenplay rhythm is strongly page-shaped. The Reader uses Courier Prime when available, conventional cue/dialogue narrowing, uppercase scene headings, right-aligned transitions, and US Letter print pages with screenplay-oriented margins.

Actors and readers can still switch to **Scroll**, especially on phones or tablets. Screenplay semantic classes remain intact in both modes, so rehearsal masking and cue navigation continue to work.

Bookself aims for a credible, comfortable screenplay reading and rehearsal surface. It does **not** currently promise page-count identity with Final Draft, Fade In, WriterDuet, studio templates, or a particular production company's pagination rules.

## What Bookself does not claim yet

The screenplay layer is intentionally a writing/review/rehearsal layer, not a complete production-management replacement.

Current Bookself does not claim full support for:

- every Fountain syntax feature or edge case;
- `.fdx` round-trip fidelity;
- locked production pages or A/B revision pages;
- colored revision sets and production revision marks;
- scene-number locking for shooting scripts;
- cast scheduling, call sheets, breakdowns, stripboards, or budgeting;
- exact studio-standard pagination equivalence;
- full side-generation packages or rehearsal analytics.

Those can be added as explicit layers later without weakening the plain-text source model.

## Rights and public proofs

A screenplay is copyrightable writing just like other Bookself publication content. The screenplay starter carries the same All Rights Reserved default as other real Bookself publications once the author replaces the placeholders.

Public readability does not itself grant adaptation, performance, production, training, distribution, or other rights. `RIGHTS.md` and `rights.json` travel with a released screenplay snapshot, but access control—not a notice—is what keeps confidential development material confidential.

See [Rights, copyright, and AI](rights-and-ai.md) before exposing a working screenplay publicly, especially when the script is under option, assignment, collaboration, guild, producer, studio, or other contractual terms.

## The useful invariant

**One script. Many views.**

The writer sees plain text and history. The collaborator sees diffs and review. The reader sees screenplay typography. The actor sees cues and rehearsal controls. The released edition can still become a normal Shelf snapshot.

Bookself changes the interface around the words without requiring the words to stop being durable files.
