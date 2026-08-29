# THE ERROR ENGINE — FIELD NOTES

## Four Diagnostic Drills for Real Decisions

### Sven Hard Benson

These field notes are designed to turn the book’s theory into a repeatable practice. They are not summaries. Each drill asks the reader to confront a different failure mode: hidden assumptions, asymmetric exposure, distorted feedback, and institutional forgetting.

---

## Drill 1 — The Assumption Autopsy

Choose one important decision currently alive in your work or life.

It might be a product launch, investment, hiring decision, acquisition, career move, research program, policy proposal, technical architecture, or major purchase.

Write the decision at the top of a page.

Then write the sentence:

**This works if…**

Complete it at least ten times.

Do not write vague virtues such as “execution is good” or “the team performs.” Force the assumptions into observable form.

This works if customer acquisition cost remains below a certain level.

This works if a supplier can scale before a particular date.

This works if users return after thirty days.

This works if a key employee remains.

This works if regulators approve the structure.

This works if interest rates remain within a survivable range.

This works if the model performs outside the training distribution.

This works if integration takes less than six months.

This works if our estimate of total addressable demand is not inflated by duplicate customer categories.

This works if the board remains willing to fund the second stage.

Now rank the assumptions by two dimensions.

First: **importance**. If the assumption is wrong, how much of the thesis breaks?

Second: **uncertainty**. How weak is the evidence supporting the assumption?

The assumptions that are both important and uncertain are the live wires.

Most teams spend too much time discussing assumptions that are important but already well understood, because those are easiest to quantify. The dangerous assumptions are often socially awkward, cross-functional, or difficult to measure.

A founder may have excellent data on conversion rates and almost no serious evidence that the category will retain customers. An investor may model revenue carefully while hand-waving political risk. A technology team may benchmark performance while ignoring deployment complexity. A government may model program costs while assuming local administrative capacity that does not exist.

The autopsy should then ask a third question:

**What evidence would make this assumption less uncertain before we commit more?**

The answer might be a pilot, customer prepayment, prototype, reference check, stress test, independent technical review, legal opinion, supply-chain audit, or adversarial scenario.

Do not ask for “more research” in the abstract.

Specify the evidence.

Then ask how much it costs to obtain.

This creates an information budget. Some uncertainty is cheap to reduce and should be reduced before commitment. Other uncertainty is irreducible. The system must survive being wrong.

The final step is the hardest.

Write the sentence:

**If this assumption fails, we will know because…**

Define an observable signal and a decision response.

If retention is below X after Y cohorts, stop scaling acquisition.

If the supplier misses the prototype milestone by Z weeks, activate the second source.

If the technical benchmark fails under the adversarial workload, redesign before production.

If the investment thesis depends on a regulatory event that does not occur by the review date, cut exposure.

The point is not rigid automation. New information may justify changing criteria. The point is to establish a default update pathway before identity and sunk cost make revision politically expensive.

An assumption autopsy turns strategy from a story into a structure that can be contradicted.

That is the beginning of learning.

---

## Drill 2 — The Exposure Map

Take the same decision and temporarily ignore whether your forecast is right.

Assume it is wrong.

What happens?

This is the exposure map.

Many sophisticated decision makers spend enormous energy improving forecasts and too little energy studying the consequences of forecast error. The exposure map reverses that instinct.

Begin with four columns:

**Error. Consequence. Propagation. Recovery.**

Under Error, list plausible misses.

Demand is half the forecast.

The launch is six months late.

A critical employee leaves.

A supplier fails.

A competitor cuts price.

The scientific effect is real but much smaller than expected.

The AI system behaves well in testing and poorly in a new environment.

A foreign government changes export rules.

A market loses liquidity.

Under Consequence, record the immediate cost.

Under Propagation, ask what else fails because of the first failure.

This is where the map becomes interesting.

A six-month delay may cause only six months of delay. Or it may trigger financing problems, employee departures, customer cancellations, covenant breaches, and competitor advantage. The first error is temporal. The propagation is organizational and financial.

A supplier failure may stop one product line. Or the same supplier may support several supposedly independent products, revealing hidden concentration.

An AI model error may create one bad recommendation. Or autonomous integration may allow one bad recommendation to trigger transactions, messages, code changes, or physical actions.

The geometry of exposure matters more than the label of the initial mistake.

Then examine Recovery.

How long until normal operation?

What resources are required?

Which actions must be possible immediately?

Do we have cash, backups, contractual rights, rollback capability, spare capacity, alternative suppliers, independent expertise, or political room to reverse?

Recovery is where optionality becomes concrete.

A company with a second supplier has an option.

A software team with a tested rollback has an option.

An investor holding cash has an option.

A government with several diplomatic channels has an option.

A person with portable skills has an option.

Options are stored recovery capacity.

Now mark each failure as **local** or **cascading**.

Local failures deserve experimentation.

Cascading failures deserve barriers.

This prevents the common mistake of applying one attitude toward risk across all domains. Organizations that fear every failure become slow and stagnant. Organizations that celebrate every failure become reckless.

The exposure map asks where boldness is cheap and where humility must be engineered.

Finally, identify one change that reduces propagation without requiring a better forecast.

Maybe the answer is position sizing.

Maybe staged capital.

Maybe modular architecture.

Maybe a second supplier.

Maybe an independent approval threshold.

Maybe a kill switch.

Maybe more cash.

Maybe less leverage.

Maybe a smaller first market.

A powerful risk control often does not increase our ability to predict.

It increases our ability to survive prediction error.

---

## Drill 3 — The Feedback Audit

Every organization says it values truth.

The feedback audit asks where truth actually goes.

Choose a recurring decision process: product development, sales forecasting, investment approval, medical diagnosis, software deployment, hiring, budgeting, research, or policy design.

Draw the path from observation to authority.

Who notices problems first?

Where are they recorded?

Who interprets them?

Who has permission to escalate?

Who can change the decision?

What incentives apply at each step?

Now look for distortion.

Does the salesperson benefit from optimistic pipeline estimates?

Does the project manager lose status when a deadline slips?

Does the researcher need a positive result for publication?

Does the operator get blamed for reporting defects?

Does the executive who sponsored the project control the review of its success?

Does an AI evaluator come from the same model family as the system being evaluated?

Feedback channels are not neutral pipes. They are social and economic systems.

Information changes shape as it travels through incentives.

A useful audit identifies three specific distortions.

### Delay

How long between reality changing and authority knowing?

Delay converts small errors into large ones. A fraud detected in a day is different from a fraud detected in a year. A software regression caught during a one-percent rollout is different from one discovered after full deployment. A customer-retention problem visible by cohort is different from one hidden until acquisition slows.

Measure time to detection.

Measure time from detection to action.

Both matter.

### Filtering

What bad news is likely to disappear?

Some information is filtered because people fear consequences. Some because reporting systems are inconvenient. Some because the data does not fit dashboard categories. Some because the messenger lacks status.

Ask people anonymously what they know that senior leadership does not.

The answers can be uncomfortable.

That discomfort is the point.

### Correlation

Are supposedly independent feedback channels actually independent?

Three analysts using the same dataset are not three independent signals. Two safety checks performed by people with the same assumption may share one blind spot. A model grading its own outputs may reproduce its own preferences.

Independence is expensive because it creates disagreement and duplication.

It is also what makes redundancy meaningful.

The final step is to create one **protected negative channel**.

This might be a red-team review, anonymous escalation route, customer-loss interview, independent audit, incident review, outside board member, second model evaluator, or pre-mortem.

The channel should be designed specifically to carry information the normal hierarchy tends to suppress.

Do not ask merely whether employees feel comfortable speaking up.

Ask whether the institution has a reliable mechanism for bad news to reach power before bad news becomes history.

---

## Drill 4 — The Memory Test

Find one rule, ritual, control, review step, or piece of organizational folklore that everyone follows but few people can explain.

Ask why it exists.

Keep asking until you reach an event, risk, or assumption.

Sometimes you will find nothing. The procedure may be ritual accumulated through bureaucracy.

Sometimes you will find a scar.

A customer disaster.

A security incident.

A lawsuit.

A failed migration.

A financial loss.

A near miss.

A quality escape.

A political crisis.

The memory test has two purposes.

First, it prevents accidental forgetting.

Second, it prevents accidental fossilization.

Once the original purpose is known, evaluate the rule against the present.

Does the underlying risk still exist?

Has technology changed?

Has the control become redundant with a better mechanism?

Does the rule create new costs or distortions?

Could the same protection be achieved more simply?

This is how institutional memory remains adaptive.

Tradition without explanation becomes superstition.

Reform without history becomes amnesia.

The memory test also applies to personal beliefs.

Why do you avoid a certain kind of investment?

Why do you distrust a certain management style?

Why do you insist on a particular workflow?

Perhaps the belief came from one painful event and has been generalized too broadly. A lesson that once protected you can become a constraint after the environment changes.

Human beings are institutions in miniature. We carry policies written by prior versions of ourselves.

Some are wise.

Some are trauma wearing the uniform of strategy.

The mature learner revisits both.

A useful practice is to attach a short provenance note to important recurring rules:

**Purpose:** what failure class this rule addresses.

**Origin:** what event or evidence created it.

**Review:** when the rule should be reconsidered.

**Override:** who can make an exception and under what conditions.

This converts inherited procedure into living memory.

The same format can govern models, controls, policies, and personal commitments.

The final question is the one that closes the error engine:

**What have we learned that should change how we learn next time?**

Not merely what action changes.

What process changes?

Should forecasts be written earlier?

Should experiments be smaller?

Should dissent be assigned?

Should monitoring improve?

Should risk limits change?

Should a new source of evidence be added?

Should an obsolete control disappear?

Learning becomes recursive when the correction process itself is corrected.

That is the point where an error engine becomes an intelligence engine.

---

## Field Notes Conclusion

The four drills can be reduced to four verbs:

**Expose. Bound. Route. Remember.**

Expose the assumptions so reality can contradict them.

Bound the downside so the learner survives contradiction.

Route the feedback so truth can reach authority.

Remember the lesson without freezing it forever.

These verbs are useful because they do not depend on one industry or one personality type. They can be applied to a board meeting, research program, software release, portfolio, factory, classroom, public policy, or personal decision.

They also reveal why intelligence is not merely information processing.

A system can possess enormous information and remain unable to learn if assumptions are hidden, downside is fatal, feedback is censored, or memory is lost.

The architecture around information determines whether information becomes correction.

That architecture is the error engine.

## End of Field Notes
