---
name: human-prose
description: Draft, revise, or review authorial prose so it reads as deliberate human writing rather than generic AI-assisted copy. Preserve the author's existing voice while removing synthetic structure, false authority, canned rhetoric, and over-neat conclusions. Use for books, essays, narrative nonfiction, introductions, conclusions, and other voice-sensitive prose.
---

# Human Prose

## Purpose

Make prose sound like a particular thoughtful person wrote it, not like a model performed "good writing."

The goal is not to add randomness, slang, mistakes, or eccentricity. Human prose comes from selective attention, judgment, specificity, restraint, memory, uncertainty, and an identifiable point of view. Preserve those qualities when they already exist. Build them from the material when they do not.

This skill is subordinate to explicit author instructions and to repository-level `AGENTS.md` rules.

## Inputs

Use whatever the task provides:

- the passage or chapter to draft, review, or edit
- surrounding prose that establishes the author's voice
- research notes, citations, quotations, or source links
- the requested audience, genre, and degree of intervention

If surrounding prose is available, read enough of it to hear the author's normal sentence length, diction, humor, level of formality, use of first person, and appetite for metaphor before editing.

## Core rule

**Do not replace one generic style with another.**

Preserve the author's voice, facts, argument, tense, and useful idiosyncrasies. Change only what is making the prose feel synthetic, unearned, inaccurate, repetitive, or structurally canned.

## Workflow

### 1. Diagnose before rewriting

Separate structural problems from sentence-level problems. Look first for repeated rhetorical machinery, not isolated words.

Flag the strongest tells before editing when the user asked for review or diagnosis. When the user asked for an edit, fix them directly and keep the intervention surgical.

### 2. Remove false authority

Never manufacture or retain a quotation merely because it sounds like a famous thinker.

High-risk forms include:

- `— [person]-style`
- `— inspired by [person]`
- `— in the spirit of [person]`
- invented aphorisms placed in quotation marks beside a real person's name
- quotation marks around a paraphrase that cannot be traced to a source

If the wording is not a verified quotation, either find and cite the real source when the task permits research, or absorb the thought into the author's own prose without quotation marks. Do not create a plausible attribution.

### 3. Prefer scene, observation, and consequence to slogans

When prose states the lesson before the reader has experienced the material, reverse the order.

Prefer:

1. a concrete event, person, object, decision, or detail
2. the pressure or uncertainty inside it
3. what changed or was noticed
4. the principle that follows

Do not force every anecdote to end in a one-line moral. Sometimes the next paragraph can carry the implication. Sometimes the reader can infer it.

### 4. Reduce framework density

Models tend to turn every idea into a named system. Humans usually name only the concepts worth remembering.

Be suspicious when a short span contains several of these:

- "The Five Pillars"
- "The X Framework"
- "The Y Protocol"
- "The Z Engine"
- equations for qualitative ideas
- checklists that answer their own questions
- branded labels for ordinary advice

Keep a framework only when it adds genuine compression, is supported by evidence, or is important enough to recur. Otherwise write the thought as prose.

### 5. Break canned rhetorical symmetry

Use rhetorical balance deliberately, not continuously.

Common machine-like patterns include:

- "Not X. Not Y. Z."
- "It is not X; it is Y."
- "X without Y is A. Y without X is B."
- three perfectly parallel clauses in repeated succession
- "This isn't the end. It's the beginning."
- "Here's the secret..."
- "Here's what I discovered..."
- "Here's everything distilled..."

A strong antithesis can stay. A page full of them cannot. Replace repeated symmetry with ordinary syntax, qualification, example, or a more specific observation.

### 6. Remove presentation voice

Book prose should not sound like a slide deck, course funnel, keynote, or generated explainer unless that is explicitly the genre.

Watch for:

- "Here's what we'll cover"
- "By the end, you will..."
- check-mark benefit lists
- "This is the goal"
- "Your move"
- "Act now"
- "Now go do it"
- "watch the magic happen"
- "optimize every factor"
- "10x" claims without evidence

Replace presenter language with argument, narrative, or a quiet transition.

### 7. Avoid pseudo-precision

Do not turn qualitative relationships into equations merely to make them feel rigorous.

For example, a formula such as `Luck = Exposure × Recognition × Action × Mindset` implies measurement and functional relationships that may not exist. Unless the formula comes from a source or a deliberately defined model, explain the interaction in prose.

The same rule applies to arbitrary percentages, universal deadlines, ranked "levels," and claims that one factor is "the highest" or "the secret" without support.

### 8. Use fewer examples more deeply

A rapid montage of famous people, each compressed to obstacle → persistence → triumph, feels generated and usually distorts history.

Prefer a smaller number of examples with:

- dates, places, objects, and constraints
- what the person knew at the time
- what they did not know
- competing explanations
- other people and institutions involved
- the cost of the decision
- what might have happened otherwise

History should contain uncertainty until the outcome actually arrives.

### 9. Let uncertainty survive

Human judgment is often provisional. Do not inflate a reasonable claim into certainty.

Prefer accurate qualifiers such as:

- "often"
- "in this case"
- "may"
- "suggests"
- "one explanation is"
- "the difficulty is"
- "in retrospect"

Do not hedge every sentence. Use uncertainty where the evidence or the lived situation was actually uncertain.

### 10. Humanize with specificity, not decoration

Specific nouns and verbs beat ornamental adjectives.

Instead of adding generic sensory prose, ask what detail changes the reader's understanding. A delayed train, a stained lab dish, an unanswered email, a name mentioned in a room, a bill on the kitchen table, or the fact that somebody had already rehearsed the procedure can carry more human weight than a paragraph of atmosphere.

Do not invent sensory details, inner thoughts, dialogue, or biographical facts to make a scene vivid.

### 11. Vary rhythm for meaning

Do not mechanically alternate sentence lengths. Rhythm should follow thought.

Use a short sentence when something lands. Let a longer sentence hold qualification, history, accumulation, or doubt. Permit an occasional fragment if it belongs to the established voice. Avoid sequences where every paragraph has the same setup, pivot, and aphoristic close.

### 12. Earn aphorisms

Aphorisms are strongest after evidence and weakest when used as scaffolding.

Keep a memorable line when it compresses something the reader has just seen. Cut it when it merely restates the paragraph in more polished language.

A useful test: if the line could be pasted onto a motivational image without losing anything, it probably needs more context or less grandeur.

## Common transformations

### Generated reveal

Before:

> Here's the secret: strategies compound.

Better:

> No single habit does much by itself. The interesting effects begin when a new skill changes the people you can speak to, those people expose you to different problems, and one of those problems gives the skill an unexpected use.

### Symmetrical slogan

Before:

> Mindset without action is meditation. Action without strategy is busyness.

Better:

> Optimism does little by itself. You eventually have to place a bet. The trick is to place enough of them to encounter surprise without mistaking constant motion for progress.

### Synthetic moral after history

Before:

> The mold was sheer chance; the trained mind that saw its meaning was the real discovery.

Better:

> The contamination was accidental. The reaction to it was not. Plenty of laboratory mistakes end in the sink; this one encountered a scientist curious enough to ask why the bacteria had died.

### Over-neat adversity

Before:

> The job you didn't get would have trapped you in a dying industry. Two years later, you started your own company.

Better:

> A rejection remains a rejection on Tuesday afternoon. It may redirect a career; it may simply hurt. We are usually poor judges of an event's final meaning while we are still living through it.

## Narrative nonfiction mode

For serious narrative nonfiction, history, biography, and researched trade books, aim for calm authority rather than motivational certainty.

- Start concrete, then widen toward principle.
- Use history as suspense, not ornament.
- Treat psychology as a lens, not a lecture.
- Distinguish what was known then from what hindsight makes obvious now.
- Let institutions, timing, class, geography, networks, and other people share causal credit with the protagonist.
- Prefer understatement after tragedy or suffering.
- Let wit appear as judgment rather than as a constant performance.
- Make an aphorism earn its place.

The reader should feel that the author has metabolized the research, not pasted a bibliography or a list of quotations into the prose.

## Review mode

When the user asks for a critique before changes:

1. identify the highest-impact recurring patterns
2. quote only enough of each passage to identify it
3. explain why the pattern feels synthetic or weak
4. propose a humanistic rewrite
5. distinguish voice problems from factual or sourcing problems
6. do not modify files until the user asks

Prioritize structural tells over exhaustive copyediting.

## Edit mode

When the user asks to revise prose:

1. preserve factual claims and citations unless separately asked to fact-check
2. preserve distinctive authorial phrases that work
3. remove false quotations and unsupported attribution
4. consolidate repetitive frameworks and lists
5. deepen or compress examples rather than decorating them
6. vary cadence only where the thought calls for it
7. stop before the text becomes "perfectly smooth"

Do not rewrite neighboring material merely for consistency.

## Final checks

Before returning or committing prose, ask:

- Could this passage belong to almost any self-help or business book? If yes, make it more specific to this author, subject, and evidence.
- Did I turn several ideas into named frameworks for no reason?
- Did I leave any unverified quotation or imitation attribution?
- Did every anecdote receive the same polished moral?
- Did I use repeated "not X but Y," triads, em dashes, or "Here's..." reveals as a crutch?
- Did I add certainty the sources do not justify?
- Did I preserve ambiguity where the people in the story actually faced it?
- Did I invent detail to make the prose feel alive?
- Does the ending trust the reader, or bark instructions at them?
- Most importantly: does this sound more like the author, or merely more like an editor?

If the last answer is "more like an editor," restore the author's texture and intervene less.