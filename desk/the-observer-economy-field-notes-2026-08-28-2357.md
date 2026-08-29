# THE OBSERVER ECONOMY — FIELD NOTES

## How to Measure Without Becoming the Metric

### Sven Hard Benson

This field guide is the practical third movement of *The Observer Economy: How Measurement Changes Minds, Markets, and Machines*.

The main manuscript develops the theory. The casebook shows the theory under pressure. These notes turn the theory into operating practice.

The objective is not to create a perfect measurement system. Perfect measurement is impossible in any institution complex enough to matter. The objective is to build a system that remains capable of discovering when its own measures have become misleading.

That is a different standard.

It asks not, “Is the metric correct?”

It asks, “How quickly will we notice when the metric stops being correct?”

A good observer system is therefore designed for revision from the beginning.

---

# Field Note 1 — Write the Purpose Before the Proxy

Most metric failures begin before the metric exists.

A team opens a dashboard tool and asks what data is available. The available fields become candidate metrics. The organization then reverse-engineers a story about why those fields matter.

This is convenient and backward.

Start with a sentence that contains no number.

What are we trying to make true?

For a customer-support function, the purpose might be: **Customers with problems should return to normal use quickly, with confidence that the company understood and solved the issue.**

For a school: **Students should develop durable knowledge, reasoning ability, curiosity, and the capacity to learn independently.**

For a cybersecurity team: **The organization should prevent, detect, contain, and recover from malicious activity with minimal harm.**

For a sales organization: **Acquire customers whose problems we can solve profitably and whose relationship becomes more valuable over time.**

For an AI evaluation program: **Estimate how reliably a system performs capabilities that matter under unfamiliar, realistic, and adversarial conditions.**

The purpose sentence should be broad enough to preserve meaning and specific enough to exclude obvious counterfeits.

Then ask what can be observed.

This creates a visible gap between purpose and proxy.

The gap is healthy.

It reminds everyone that the measure is not the objective itself.

## The Purpose-Proxy Sheet

For every important metric, write five lines:

**Purpose:** What reality do we actually care about?

**Proxy:** What observable quantity are we using?

**Assumption:** Why do we believe the proxy tracks the purpose?

**Known failure modes:** How could the proxy improve while the purpose worsens?

**Independent check:** What evidence could reveal that divergence?

Example:

**Purpose:** Customers receive durable solutions.

**Proxy:** First-contact resolution.

**Assumption:** Problems solved completely should require fewer follow-up contacts.

**Known failure modes:** Customers may give up; contacts may occur through another channel; agents may classify cases as resolved prematurely.

**Independent check:** Repeat behavior across channels, complaint review, sampled case audits, retention, qualitative interviews.

This exercise appears elementary.

That is its strength.

Organizations become confused when they stop being able to say which assumption connects a number to a purpose.

A metric without an explicit assumption becomes a ritual.

## The Counterfeit Test

Ask a hostile but useful question:

**How could we make this number look excellent while making the underlying reality worse?**

Do not ask whether employees would do such a thing. Ask whether it is structurally possible.

If the answer is easy, the metric needs a countermeasure.

If a salesperson can maximize compensation by selling to customers likely to churn, add retention or collected cash.

If a warehouse can maximize throughput by increasing damage, pair throughput with quality.

If a research team can maximize experiment count by running trivial experiments, include information gain or milestone relevance.

If an AI system can maximize a score through narrow benchmark familiarity, add hidden transfer tests.

If a hospital can meet a waiting threshold by moving patients without improving care, measure the actual care pathway.

The counterfeit test is a form of adversarial design.

Before people game the metric, game it yourself.

## Keep the Purpose Linguistic

There is a reason the purpose statement should remain verbal rather than numerical.

Language is less precise, but it can preserve multidimensional meaning. The moment the purpose itself becomes a formula, the formula becomes another target.

The verbal purpose functions like a constitutional principle. It guides interpretation when measures conflict.

Numbers administer.

Purpose adjudicates.

---

# Field Note 2 — Build a Metric Portfolio, Not a Metric Monarch

Single metrics are attractive because they create clarity.

They also create monoculture.

A metric portfolio uses a small number of measures whose failure modes differ. The design principle is not “more data.” It is **independent error**.

If all your metrics are derived from the same behavior, adding more of them creates false confidence.

Clicks, page views, sessions, and time spent may all be different columns and one underlying attention process. Revenue, bookings, and pipeline may all depend on the same commercial optimism. defect counts and quality scores may share the same inspection process.

Diversity matters.

## The Four-Lens Portfolio

For a consequential objective, try to observe four lenses:

### 1. Activity

What work is being done?

Calls handled. tests run. proposals sent. lessons delivered. inspections completed. models trained.

Activity is fast and controllable. It is also easy to game.

### 2. Quality

How good is the work?

Resolution quality. defect rate. conversion quality. rubric score. review outcome. factual accuracy.

Quality is closer to purpose but usually requires sampling or judgment.

### 3. Outcome

What happened to the world afterward?

Retention. learning progress. health outcome. loss rate. customer value. real-world task success.

Outcomes matter most but move slowly and can be influenced by factors outside the team's control.

### 4. Integrity

Can we trust the observation process?

Audit findings. reporting rates. missing data. exception patterns. unusual clustering. survey participation. detector coverage.

Integrity metrics measure the sensors.

This fourth lens is often missing.

Organizations measure the object and forget to measure the instrument.

## A Balanced Metric Is Not a Balanced Scorecard

Do not turn the framework into dozens of weighted indicators that produce another composite score.

Composite scores often hide conflict.

If volume rises and quality falls, you should see the tension. Averaging them into 82.4 can destroy the most important information.

A good dashboard allows disagreement among measures.

Contradiction is evidence.

Green activity plus red outcome asks a question. Green outcome plus red integrity asks a different question. The colors should not be forced to agree.

## Use Veto Metrics Sparingly

Some outcomes are unacceptable regardless of aggregate performance: catastrophic safety failures, severe legal violations, certain security breaches, fraud, abuse.

These deserve veto status.

But if everything is a veto, the organization becomes paralyzed. Reserve hard constraints for truly non-negotiable boundaries.

The rest should remain a portfolio requiring judgment.

---

# Field Note 3 — Measure the Measurement Process

A thermometer can be miscalibrated.

A survey can have response bias.

A defect count can fall because inspectors are understaffed.

A safety report can fall because workers are afraid.

A customer score can rise because unhappy customers stopped responding.

The observation process is itself a system.

Treat it as one.

## Sensor Health Questions

For every important data stream, ask:

Who generates the data?

What incentives do they face?

Can they avoid being counted?

Can they influence classification?

Who defines exclusions?

What happens when data is missing?

Has the collection method changed?

Has the population being measured changed?

Does the metric depend on voluntary reporting?

What would cause reporting to rise even if underlying reality improved?

What would cause reporting to fall even if underlying reality worsened?

These questions often reveal more than the headline score.

## The Bad-News Paradox

Strong systems can produce worse-looking data because they detect more.

A company that installs better cybersecurity monitoring may report more incidents. A hospital that encourages safety reporting may receive more near misses. An organization that opens a trusted complaint channel may record more complaints. A police department that wins community trust may receive more reports of certain offenses.

Leaders must communicate this paradox explicitly.

Otherwise managers learn that improving detection damages performance ratings.

That is how sensors go dark.

One of the strongest possible cultural signals is to celebrate detection separately from occurrence.

“Thank you for finding this” should be institutionally credible.

## Random Audits Beat Predictable Rituals

If inspections always occur at month end, month end becomes theater.

If quality audits inspect the same sample, the sample becomes optimized.

If managers visit only during scheduled reviews, reality cleans itself before they arrive.

Randomization can preserve informational value.

Use unannounced sampling where appropriate and ethical. Rotate questions. vary evaluators. inspect cases selected by risk and cases selected randomly.

Random samples reveal ordinary reality.

Risk-based samples reveal concentrated danger.

Use both.

---

# Field Note 4 — Design for Adaptation

Assume people will learn the metric.

This is not cynicism. It is respect for intelligence.

A metric system designed under the assumption that nobody will optimize against it is a temporary system.

## The Adaptation Forecast

Before launching a target, hold a short session with the people who will live under it.

Ask:

What behavior will increase?

What behavior will decrease?

What work will become invisible?

What shortcuts become rational?

Which customers or cases become unattractive?

Which calendar boundary becomes important?

Which classifications become valuable?

What new conflict appears between teams?

What will an excellent employee do to succeed under this rule?

What will a cynical employee do?

What will an exhausted employee do?

What will a brilliant optimizer do?

The last question is especially important in AI-mediated organizations. Agents, optimization systems, and automated workflows can discover strategies faster than human managers expect.

The future of incentive design will increasingly involve nonhuman optimizers.

Goodhart's law becomes an engineering problem.

## Separate Discovery Metrics From Compensation Metrics

Not every useful measure should determine pay.

A diagnostic metric can remain informative precisely because people do not have strong reasons to manipulate it.

The moment compensation attaches, behavior changes.

Therefore maintain a larger set of exploratory measures for learning and a smaller set of carefully chosen consequential measures for rewards.

Do not automatically promote every informative dashboard into an incentive system.

Observation and control are different jobs.

## Reward the Underlying Tradeoff

If a role contains an unavoidable tradeoff, compensation should acknowledge both sides.

Sales: growth and quality.

Operations: speed and reliability.

Research: progress and intellectual risk.

Customer service: efficiency and durable resolution.

Software engineering: delivery and maintainability.

Manufacturing: throughput and defects.

Leadership: results and organizational health.

The exact weights will never be perfect. The point is to prevent one dimension from becoming a tunnel.

## Avoid Excessive Formula Complexity

A metric system with thirty weighted variables may appear sophisticated, but employees will either ignore it or learn which variables actually dominate.

Complexity can conceal discretion rather than eliminate it.

Use formulas where relationships are stable and interpretable. Use judgment openly where they are not.

Pretending judgment has vanished because it was encoded into weights is administrative theater.

---

# Field Note 5 — Build a Bad-News Market

Information inside organizations behaves like a market.

People decide whether to produce it, suppress it, package it, escalate it, or delay it based on expected consequences.

If bad news is punished, its price rises.

Leaders then receive less of it.

This is one of the most dangerous measurement distortions because it creates confidence precisely when skepticism is needed.

## Pay for Disconfirmation

Create explicit rewards for finding evidence that a favored assumption is wrong.

This does not require literal cash bonuses in every case. Recognition, promotion, authority, and protection matter.

Examples:

A product team that cancels a weak project after decisive evidence should not automatically be treated as a failure.

A security engineer who discovers a serious vulnerability before an attacker does has created value, not embarrassment.

A salesperson who rejects a bad-fit customer may protect future margin.

A scientist who produces a rigorous negative result may save others from pursuing a dead end.

A risk manager who blocks a profitable but dangerous exposure is doing the job.

The institution must make these statements true in practice.

## The Pre-Mortem

Before a major initiative, imagine that it failed badly.

Ask every participant to write the story of failure.

Why did it happen?

Which warning signs existed?

Which metric looked good until late?

What did everyone know but nobody say?

What did the dashboard miss?

Pre-mortems work because they temporarily reverse social pressure. Instead of being disloyal for imagining failure, participants are assigned to do so.

The method makes skepticism legitimate.

## The Red-Team Metric Review

Once per quarter or at another suitable interval, choose one important metric and attack it.

The red team should answer:

How would we manipulate this without technically violating policy?

Which subgroup is harmed while the average improves?

What behavior is shifting outside the measurement perimeter?

What changed since this metric was created?

Which competitor, customer, employee, regulator, or model has learned to exploit it?

Can we reproduce the metric independently?

What evidence would make us retire it?

The last question prevents immortality.

Metrics need sunset conditions.

---

# Field Note 6 — Use Time as an Antidote

Many measurement failures are horizon failures.

A short-term metric rewards borrowing from the future.

Revenue is pulled forward. maintenance deferred. employees exhausted. customers oversold. research narrowed. capital underinvested.

The present looks efficient because the future has not yet submitted its report.

## Pair Horizons

For every fast metric, ask for a slower companion.

Bookings with renewal.

Acquisition with cohort retention.

Delivery speed with maintenance burden.

Cost reduction with defect trend.

Engagement with long-term satisfaction.

Model benchmark performance with fresh transfer evaluation.

Hiring speed with twelve-month performance and retention.

The lagging measure should not micromanage daily action. Its job is to audit whether the leading indicator remains honest.

## Track Cohorts

Averages mix history.

Cohort analysis separates generations of behavior.

A company whose aggregate retention looks stable may have deteriorating new cohorts hidden by loyal old customers. A hospital's average outcome may hide changes in specific patient groups. A model's aggregate accuracy may conceal failures on new distributions.

Cohorts reveal whether recent optimization is producing a different future.

## Measure Decay

Some improvements are temporary.

Training gains fade. campaign lifts decay. new processes regress. employees adapt around controls. fraudsters learn detectors.

Do not only measure peak effect.

Measure persistence.

A policy that produces a spectacular month and no durable improvement is a different intervention from one that produces a modest but compounding gain.

Time is a verifier.

---

# Field Note 7 — Preserve the Unmeasured Domain

A fully quantified organization would be blind in a special way.

It would see only what it had already decided to encode.

Novelty often begins outside categories.

A customer uses a product strangely. An employee has a concern that does not fit the risk taxonomy. A competitor serves a market considered too small. A researcher notices an anomaly. A machine generates a behavior the benchmark never anticipated.

These are weak signals.

They arrive as stories before they become statistics.

## Maintain Qualitative Channels

Executives should hear customer calls.

Product leaders should observe real users.

Factory leaders should walk the floor.

Boards should hear risk narratives, not only heat maps.

Researchers should inspect failures manually.

AI labs should read strange model transcripts, not only aggregate scores.

Numbers show pattern.

Stories show mechanism.

Use both.

## The Ethnographic Audit

Once in a while, stop asking people what the process is supposed to be and watch what actually happens.

Where do workers create spreadsheets outside the official system?

Which steps are skipped?

What do customers do that the funnel does not represent?

Which workarounds are universal but undocumented?

Where do people wait?

Which unofficial expert does everyone call?

Which metric does nobody believe?

Ethnography is useful because institutions often have two architectures: the formal architecture and the lived architecture.

The distance between them is strategic information.

## Protect Serendipity

If every research project must satisfy a short-term ROI score, foundational exploration declines.

If every creative work must satisfy an engagement model before release, aesthetic variation narrows.

If every employee hour must be allocated to a measurable deliverable, organizational slack disappears.

Some resources should remain option value.

This is not an argument for unlimited waste.

It is an argument that exploration has a different measurement regime from exploitation.

Treating both identically is a category error.

---

# Field Note 8 — Rotate and Retire Metrics

Metrics age.

A measure can begin honest, become useful, attract optimization, and eventually turn into ritual.

Organizations rarely retire metrics because history creates attachment. Dashboards accumulate. reports gain owners. targets enter compensation plans. software pipelines depend on them. executives remember how hard the metric was to establish.

The result is metric sediment.

New layers pile on old ones.

## Give Every Metric an Owner and an Expiration Review

Ownership should include responsibility for questioning the metric, not merely producing it.

At a predetermined interval, review:

Why was this metric created?

Does the original problem still exist?

Has behavior adapted?

Has the population changed?

Has the collection method changed?

Does the metric still predict the outcome we care about?

What decisions depend on it?

What happens if we remove it?

Can a simpler measure replace it?

A metric that cannot survive these questions should be retired or demoted.

## Rotate Tests, Not Purposes

Purpose should be stable enough to orient people.

Tests can change.

A security program keeps the purpose of resilience while rotating penetration scenarios. An AI lab keeps the purpose of general capability while refreshing evaluation tasks. A school keeps the purpose of learning while varying assessment forms. A quality team keeps the purpose of reliability while changing audit samples.

Rotating evidence makes memorization less valuable and underlying competence more valuable.

This is how measurement can reward generality.

## Beware the Metric Graveyard

Deleting a metric is not enough if people still believe it governs decisions.

Retirement must be explicit.

Tell the organization which number no longer carries authority and why. Otherwise shadow incentives persist.

People optimize old constitutions surprisingly long after the law changes.

---

# Field Note 9 — Evaluate the Evaluators

Who watches the metric makers?

This question becomes increasingly important as AI systems mediate evaluation.

Credit decisions, hiring screens, fraud detection, content ranking, insurance pricing, performance analysis, and model evaluation can all involve automated scores. The evaluator is itself a model with data, assumptions, objectives, and failure modes.

## Separate Model Performance From Decision Performance

A predictive model can be statistically accurate and operationally harmful if the decision policy built around it is poor.

Suppose a churn model accurately ranks customers by risk. The company targets the highest-risk customers with aggressive discounts. Some would have stayed anyway. some learn to threaten cancellation to receive discounts. some low-risk customers feel neglected.

The model predicted risk.

The intervention changed behavior.

Evaluation must therefore include policy effects, not only prediction accuracy.

## Test for Distribution Shift

Models learn historical relationships.

Deployment can change those relationships.

Fraud models alter fraud tactics. recommendation models alter content. pricing models alter customer selection. hiring models alter applicant behavior.

Monitor not only accuracy but the stability of the data-generating process.

If inputs, outcomes, or strategic behavior shift, retraining on recent data may be necessary—but retraining can also absorb the model's own previous influence.

The dataset becomes recursive.

This is the machine version of the Lucas critique.

## Keep Human Appeal Where Stakes Are High

Automated systems create consistency and scale. They can also create opaque error.

For high-stakes decisions, preserve mechanisms for challenge, explanation, correction, and exceptional context.

Appeal is not a flaw in automation.

Appeal is a sensor for model failure.

A flood of successful appeals is evidence that the evaluator needs repair.

---

# Field Note 10 — Build a Culture That Can Survive a Red Number

Every measurement system eventually produces bad news.

What happens next determines whether the system remains informative.

If a red number triggers immediate blame, people learn to prevent red numbers from appearing.

If a red number triggers curiosity, resources, and accountability proportionate to actual behavior, people keep reporting.

This is not an argument against standards.

It is an argument for distinguishing **bad outcome**, **bad luck**, **bad process**, **bad judgment**, and **bad faith**.

These are not the same thing.

A good process can produce a bad outcome under uncertainty. A bad process can produce a good outcome by luck. A measurement system that rewards outcomes alone eventually teaches risk-taking it does not understand.

## Review Decisions, Not Only Results

After major successes and failures, reconstruct what was known at the time.

Was the decision reasonable given available evidence?

Were dissenting views heard?

Were assumptions explicit?

Were risk limits followed?

Did new evidence cause updating?

This protects institutions from outcome bias.

It also prevents successful recklessness from becoming doctrine.

## Publicly Correct the Dashboard

When a metric is found to be misleading, say so.

Do not quietly change the definition and pretend history is continuous.

Explain what failed, what changed, and how historical interpretation should be adjusted.

Institutional credibility grows when correction is visible.

The alternative teaches everyone that leadership cares more about the appearance of consistency than truth.

## Leadership as Epistemic Character

The deepest responsibility of leaders in the observer economy is epistemic.

They decide which truths remain speakable.

A leader who humiliates bearers of bad news changes future data. A leader who rewards convenient forecasts changes future forecasts. A leader who asks only for the headline number changes future analysis.

Management style enters the measurement system.

Character becomes statistical infrastructure.

---

# The Observer Audit — A 20-Question Checklist

Use this checklist for any consequential metric, score, benchmark, target, ranking, or automated evaluator.

1. What underlying reality are we trying to understand or improve?
2. Why do we believe this measure tracks it?
3. What behavior changes when people learn the measure?
4. What behavior changes when money or status attaches to it?
5. How could the metric improve while reality worsens?
6. Which subgroup could be harmed while the average improves?
7. Which activity becomes invisible?
8. What time horizon does the metric privilege?
9. Can performance be borrowed from the future?
10. Who generates or classifies the data?
11. What incentives do those people or systems face?
12. What independent evidence could contradict the metric?
13. What would a brilliant optimizer do to maximize the score?
14. How would a tired or fearful employee respond?
15. How does the measure alter customers, competitors, or other external actors?
16. How often is the metric revalidated against outcomes?
17. What is the appeal or exception mechanism?
18. What evidence would cause us to retire the metric?
19. Who is rewarded for discovering that the metric is wrong?
20. If this number disappeared tomorrow, what reality would we still care about?

If a leadership team cannot answer question twenty, the proxy has probably become the purpose.

---

# A Worked Example — Designing a Better Innovation Metric

Consider a large company worried that it is becoming less innovative.

The chief executive asks for an innovation KPI.

The dangerous response is to choose a count immediately: patents, product launches, experiments, R&D spending, percentage of revenue from new products, startup partnerships.

Each measure contains information.

Each can be gamed.

Patent count can reward low-value filings. Launch count can reward fragmentation. Experiment count can reward trivial tests. R&D spending can reward expense. “New product” revenue can be manipulated by definitions. Partnerships can become innovation theater.

Begin with purpose:

**The company should repeatedly create valuable new capabilities, products, and business models before changing technology or customer behavior makes the current portfolio obsolete.**

Now build a portfolio.

**Activity:** number of meaningful experiments reaching real customers; percentage of technical staff exposed to exploration work.

**Quality:** independent review of experimental learning; novelty relative to existing portfolio; technical feasibility.

**Outcome:** revenue or strategic adoption from cohorts launched three to five years earlier; capability created even when individual projects fail.

**Integrity:** project-kill rate; evidence that teams can stop weak ideas; audit of what counts as an experiment; distribution of resources between core, adjacent, and exploratory work.

Then add qualitative review.

Which customer behaviors are emerging outside existing segments?

Which technologies look economically unattractive under current margins but improve quickly?

Which small projects are rejected because existing sales channels dislike them?

Which teams have learned something important that produced no product yet?

Now examine time.

Innovation has delayed outcomes. A metric system that demands current-year revenue will systematically bias toward incremental work. Therefore some exploratory projects need milestone logic rather than near-term financial returns.

Finally add retirement.

Every two years, review whether the portfolio still predicts actual adaptation.

The result is messier than a single innovation score.

It is also harder to fool.

---

# A Worked Example — Measuring AI Agent Reliability

Suppose an organization deploys an AI agent to perform multi-step business tasks.

A naive metric is task completion rate.

The purpose is broader:

**The agent should complete authorized work correctly, efficiently, safely, transparently, and recoverably under realistic conditions.**

The metric portfolio might include:

**Activity:** tasks attempted and completed.

**Quality:** correctness of outputs, verification pass rate, human rework.

**Outcome:** real business value, cycle-time improvement, error reduction.

**Safety:** unauthorized actions, policy violations, data exposure, irreversible mistakes.

**Integrity:** logging completeness, evaluator coverage, proportion of tasks with independent checks, distribution shift.

Now apply the counterfeit test.

Could the agent maximize completion by taking unsafe shortcuts?

Could it mark tasks complete without verifying downstream state?

Could it avoid difficult cases and inflate success?

Could human supervisors silently repair outputs while the agent receives credit?

Could benchmark tasks become familiar through training?

Each possibility demands independent evidence.

The observer economy becomes especially important with agents because the optimized actor may literally search for paths through the measurement system. Reward hacking is Goodhart's law executed at machine speed.

Therefore agent metrics must include adversarial evaluation and authority boundaries.

The rule should be: the easier a score is for the agent to influence directly, the less the score can be trusted alone.

---

# A Worked Example — Personal Ambition Without Personal Surveillance

Suppose a person wants to become healthier, more knowledgeable, financially secure, and creatively productive.

Modern tools make it possible to measure everything.

The temptation is to build a personal dashboard.

Steps. calories. sleep score. pages. books. words. income. savings. net worth. workouts. streaks. posts. followers. deep-work hours.

Soon life resembles a holding company reporting quarterly results to itself.

A healthier approach begins with purposes in language:

**Health:** enough strength, endurance, sleep, and medical stability to participate fully in life.

**Learning:** the ability to understand, remember, connect, and use ideas.

**Finance:** resilience, freedom of choice, and capacity to support obligations and opportunities.

**Creative work:** sustained production of things worth making, whether or not every artifact receives public attention.

Metrics can support each purpose, but they should remain temporary instruments.

Track what changes behavior. Stop tracking what creates obsession without insight.

Use periodic audits rather than continuous self-surveillance.

Preserve unmeasured days.

Do some work nobody sees.

Read some books too slowly to improve the annual count.

Walk without a device.

Have conversations that produce no network value.

The unmeasured domain is where identity retains sovereignty.

---

# Closing Field Note — Keep One Eye on the World

The observer economy creates a seductive fantasy: if we can measure enough, we can govern complexity from the dashboard.

The fantasy fails because measurement changes the measured, because proxies age, because adaptive agents learn, because rare events matter, because values conflict, because context resists compression, and because reality always contains more variables than the institution can display.

Yet the opposite fantasy fails too: that wise intuition can replace measurement.

Humans are biased storytellers. We remember selectively. Powerful people attract flattering anecdotes. organizations hide bad news. memory rewrites history. charisma impersonates evidence.

The answer is a disciplined tension.

Measure aggressively.

Believe provisionally.

Investigate contradictions.

Protect dissent.

Rotate tests.

Track outcomes.

Audit sensors.

Retire stale proxies.

Preserve judgment.

And periodically leave the dashboard.

Visit the factory.

Call the customer.

Read the complaint.

Watch the user.

Inspect the failure.

Sit with the employee who knows the workaround.

Look at the machine doing the work.

Look at the person living with the policy.

Numbers are compressed experience.

When the compression begins to replace experience, return to the world.

That is the final discipline of the observer.

Do not stop measuring.

Do not stop looking.
