# THE COORDINATION TAX — FIELD NOTES

## Twelve Practices for Systems That Need to Move Together

### Sven Hard Benson

These notes turn the book’s thesis into operating practice. The objective is not frictionless organization. Friction can buy safety, legitimacy, resilience, and learning. The objective is to identify which friction is purchasing something valuable and which friction is simply the residue of unclear boundaries.

---

## 1. Map the Edges, Not the Boxes

Choose one important outcome: a launch, a renewal, an incident response, a hiring decision, a capital allocation, a product change.

Draw every ownership transition required to complete it.

For each transition, record what moves, who initiates, who accepts, what completion means, how long the work waits, how often it returns for clarification, and who bears the cost when the handoff fails.

Most organizations begin analysis with departments. Coordination problems often live between departments.

A useful question is:

> If every team became twenty percent better tomorrow, which dependency would break first?

That dependency may matter more than any individual team’s efficiency.

---

## 2. Separate Labor Time from Calendar Time

A task can require two hours of labor and consume three weeks of calendar time.

The difference is coordination latency.

Measure both.

Active work is the time someone spends producing the thing.

Wait time is the time spent waiting for access, information, decisions, reviews, approvals, meetings, procurement, external responses, or another team.

Organizations tend to automate active work because active work is visible.

The larger opportunity can be eliminating the queue.

A tool that drafts a document ten times faster may matter less than a redesigned process that removes a ten-day approval gap.

Organizations live in calendar time.

---

## 3. Treat Recurring Meetings as Interface Tests

Do not cancel recurring meetings simply because meetings are unpopular.

Interrogate them.

If the same people gather every week to resolve the same category of ambiguity, a meeting may be compensating for an unstable interface.

Ask:

- Which boundary requires this meeting?
- Which decisions recur?
- Which conflicts recur?
- What information cannot move without synchronous translation?
- What ownership rule, schema, standard, or protocol could remove the repeated portion?

The ambition is to graduate repeated coordination into infrastructure.

Keep synchronous attention for novelty.

---

## 4. Define Decision Rights Explicitly

A common failure mode is universal consultation combined with ambiguous authority.

Everyone can comment.

Nobody knows who decides.

Separate the roles:

Who supplies evidence?

Who must be consulted?

Who has a narrow blocking right?

Who decides?

Who executes?

Who reviews the result later?

The word “stakeholder” often hides these distinctions.

Consultation is not consent. Consent is not execution. Execution is not review.

Clarity lowers the cost of inference.

---

## 5. Give Important Interfaces an Owner

Teams have leaders. Products have owners. Interfaces often have nobody.

When two teams repeatedly create friction for one another, assign responsibility for the health of the boundary itself.

The interface owner should watch definition quality, handoff latency, exceptions, shared metrics, recurring failures, documentation, and escalation.

This is especially useful for sales-to-implementation, research-to-production, product-to-security, headquarters-to-region, and human-to-agent boundaries.

If a boundary matters, someone must care about the boundary as a system rather than merely defend one side.

---

## 6. Track Rework as a Coordination Signal

A document is completed, then redone after a late stakeholder appears.

A feature is completed, then redesigned after security review.

A strategy is completed, then rewritten when operations reveals an impossible assumption.

Rework is often the fossil record of missing context.

Track how often outputs move backward across a boundary.

Do not use the metric to punish people. Use it to ask what information should have crossed earlier.

Some rework is learning. Experiments should generate revision.

The expensive form is translation rework: the work was correct for the wrong assumptions because the system failed to transmit the assumptions in time.

---

## 7. Price Exceptions

Standards need exceptions because reality is not uniform.

The danger is free exceptions.

If one team can create custom promises while another team bears the complexity, exceptions multiply.

Make exceptional treatment carry some visible cost: explicit approval, added documentation, a complexity budget, a reduced service level, a time limit, or ownership of future maintenance.

The purpose is not punishment.

It is to make local convenience confront system cost.

---

## 8. Keep a Coordination Debt Register

Technical debt is familiar. Coordination debt deserves equal attention.

Examples include:

- one employee who translates between incompatible systems;
- a spreadsheet that manually reconciles two databases;
- a weekly meeting caused by unclear ownership;
- a customer promise that requires repeated heroics;
- two teams using different definitions for the same metric;
- a founder approval embedded in ordinary processes;
- exceptions known only through oral memory.

List these explicitly.

Estimate which are cheap to carry, which compound with scale, and which create key-person risk.

Growth often converts tolerable coordination debt into a bottleneck.

---

## 9. Use New Employees as Architecture Auditors

Long-tenured employees carry hidden maps.

They know which policy is real, which system field is unreliable, which executive must be consulted, which customer exception dates back years, and which process only exists because of a historical incident.

New employees do not possess the map.

Observe their questions.

Repeated questions from competent newcomers reveal information stored in the wrong place.

Surprising exceptions reveal undocumented state.

Dependencies discovered by accident reveal architectural opacity.

Onboarding is not merely orientation. It is a test of institutional legibility.

---

## 10. Preserve a Minority View

Action requires convergence. Learning requires memory of disagreement.

When making a major uncertain decision, record the strongest dissenting view fairly.

Write down what the minority predicts, which assumptions differ, what evidence would support it, and when the decision should be revisited.

This prevents consensus from rewriting history.

It also gives dissenters dignity without granting permanent veto.

After the outcome, the organization can compare models rather than personalities.

That turns disagreement into a learning asset.

---

## 11. Give AI Agents Attention Budgets

Machine agents can create coordination demand faster than humans can absorb it.

Therefore give agents budgets for human escalations, messages, generated documents, tool calls, permissions requested, and unresolved tasks carried forward.

An agent that repeatedly consumes scarce human attention should justify the consumption.

This is not only a compute problem.

It is a constitutional problem.

When generation is cheap, the right to interrupt another mind becomes scarce.

Attention should be treated as a resource rather than an infinite sink.

---

## 12. Delete Deliberately

Processes accumulate.

A review appears after a miss. A report appears after an executive asks a question. A policy appears after an incident. A committee appears after a conflict.

Each addition can be rational.

Few additions are later removed.

The organization becomes a geological record of old anxieties.

Once a quarter, identify one meeting, report, approval, metric, exception, tool, policy, or role that no longer earns its coordination cost.

Retire or simplify it.

A learning institution is not one that only adds safeguards.

It is one that knows when yesterday’s safeguard has become today’s drag.

---

# The Coordination Tax Audit

Choose one workflow and score it qualitatively across ten dimensions.

### Boundary count
How many ownership transitions occur?

### Definition clarity
Do participants agree on terms, completion criteria, and data definitions?

### Authority clarity
Is it obvious who decides when disagreement persists?

### Wait-time ratio
How much of calendar time is waiting rather than doing?

### Rework
How often do outputs travel backward because context arrived late?

### Exception load
How much local variation must be remembered manually?

### Trust load
How much verification and approval exists because participants do not trust one another’s judgment?

### Status load
How difficult is it for lower-status participants to challenge assumptions?

### Tool fragmentation
How many systems must be reconciled manually?

### Change saturation
How many simultaneous initiatives require the same people to alter behavior?

Do not add the scores to create false precision.

Use the pattern to diagnose the type of tax.

High boundary count suggests architecture work.

High status load suggests cultural work.

High exception load suggests product or policy simplification.

High trust load suggests governance and relationship work.

High wait-time ratio suggests decision redesign.

Different coordination taxes require different interventions.

---

# The Coordination Budget Memo

Before approving a major initiative, write a one-page memo with five sections.

### New dependencies created
What must now coordinate that did not need to coordinate before?

### Existing dependencies intensified
Which interfaces become more critical?

### Behavioral changes required
Who must do something differently rather than merely understand something differently?

### Coordination debt added
Which temporary manual workarounds are acceptable, and when must they disappear?

### Deletions funded
What old meeting, process, report, system, metric, or commitment becomes unnecessary because of this change?

The final section matters.

Transformation that only adds eventually becomes bureaucracy.

A healthy initiative should delete something.

---

# The Human API Exercise

Choose a colleague whose absence would make several teams suddenly confused.

Ask what questions they receive repeatedly, which groups rely on them to translate, which exceptions only they remember, and which recurring conflicts they personally resolve.

Then distinguish two kinds of value.

The first is genuine judgment that should remain human and scarce.

The second is preventable routing caused by weak interfaces.

Encode the routing. Preserve the judgment.

The goal is not to eliminate valuable people.

It is to stop wasting valuable people on avoidable coordination.

---

# Closing Note — Coordination as Craft

Coordination is often treated as administrative residue around real work.

In complex systems, coordination is part of the work.

The engineer who clarifies an interface is doing engineering.

The manager who removes an approval is doing systems design.

The diplomat who finds language several governments can accept is building infrastructure.

The maintainer who writes documentation is increasing everyone else’s effective intelligence.

The colleague who tells the truth early is reducing future latency.

The designer who removes one dependency may create more value than the team that optimizes ten tasks.

Coordination deserves to be treated as a craft because the alternative is paying for it accidentally.

The tax exists either way.

The choice is whether we understand what we are buying.

## End of Field Notes
