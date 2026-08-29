# SYNTHETIC INTELLIGENCE

### Sven Hard Benson

*How machine-generated experience may change intelligence from a consumer of the world into a producer of its own curriculum—and open a new era of discovery.*

---

## Author’s Note

The phrase **synthetic intelligence** is used here as a thesis, not as an established scientific category.

Artificial intelligence is intelligence we build.

Synthetic intelligence, as this book defines it, is intelligence that increasingly helps manufacture the experiences from which intelligence learns.

That distinction sounds small until the loop closes.

For most of the history of machine learning, the data came first. People wrote books, took photographs, recorded speech, produced software, performed experiments, drove cars, played games, made mistakes, labeled examples, and left traces of civilization behind. Machines learned from the residue.

The model was downstream from reality.

Now the model can move upstream.

It can propose a problem, attempt a solution, critique the attempt, generate variations, simulate an environment, produce counterexamples, test code, invent a curriculum, ask another model for judgment, interact with a formal verifier, and turn the result into training material for itself or a successor.

The data is no longer only found.

It is designed.

This does not mean that synthetic data is automatically good data. The opposite is one of the central warnings of this book. Models trained indiscriminately on generations of model-produced content can lose rare information and drift toward a narrower approximation of the world. Researchers have called this model collapse. Synthetic data can amplify errors, preferences, stereotypes, reward hacks, and blind spots as efficiently as it can amplify knowledge.

The important loop is therefore not:

**generate → train → generate more.**

It is:

**generate → test → select → diversify → anchor → train → generate better.**

The verifier may be a compiler, a theorem prover, a simulator, an experiment, a physical robot, a human expert, a market outcome, a scientific instrument, or some combination of them. The source of truth matters because intelligence cannot bootstrap forever from its own confidence.

The claim of this book is narrower, and more consequential, than the claim that synthetic data will replace human data.

It probably should not.

The claim is that **high-quality synthetic experience will become a new factor of production for intelligence**. When models can manufacture useful learning situations faster than humans can manually record and label them, the rate of learning can partially detach from the rate at which civilization produces new text, demonstrations, and annotations.

That changes the economics of AI.

It changes the role of simulation.

It changes the meaning of experimentation.

It changes what counts as a dataset.

And if the loops become sufficiently reliable, it changes the direction of causality between intelligence and data.

Instead of data producing intelligence, intelligence begins producing the data that produces more intelligence.

The machine writes part of its own textbook.

This book is about what happens next.

Contemporary facts are stated as of late August 2026. Forecasts are identified as forecasts or analytical judgments. Research results discussed here are evidence for mechanisms, not proof that any particular future is inevitable.

---

# Part I — The Found World

## Chapter 1 — Before the Loop

Every intelligence has a diet.

Human beings are born into a world already thick with examples. Gravity teaches the body. Language teaches the ear. Other people teach the face. Pain teaches caution. Games teach strategy. Culture teaches what a society has remembered and what it has forgotten. A child does not need to manufacture a universe before learning from it. The universe arrives free of charge.

Machine intelligence had no such inheritance.

We built it a substitute environment out of data.

The early internet became an accidental sensory organ. Web pages became language lessons. Captioned images became visual grounding. Source code became demonstrations of procedural thought. Digitized books became compressed civilization. Video became a rough record of motion and human activity. Human preference labels became behavioral guidance. The modern foundation model was fed a strange fossil bed of our species.

This arrangement contained a hidden assumption: enough useful human-generated material would always be available.

For a time, the assumption barely mattered. The internet was enormous relative to the appetites of models. The engineering challenge was gathering, cleaning, deduplicating, filtering, and training on the corpus.

Then models scaled.

As the amount of compute devoted to training rose, researchers became more selective about data quality. A token was no longer simply a token. A clear proof could be worth more than a page of spam. A carefully written programming exercise could teach more than a thousand repetitive snippets. A rare edge case could matter more than the average example.

This is the first crack in the old worldview.

If data has quality, then data can be engineered.

Once data can be engineered, the model does not have to wait for the world to accidentally produce the lesson it needs.

A teacher does not educate a student by handing over a random sample of everything ever written. A teacher selects examples, orders difficulty, creates exercises, invents counterexamples, diagnoses confusion, revisits weak concepts, and compresses years of cultural knowledge into a sequence designed to change the student.

Training data can do the same.

The web is a library.

Synthetic data can be a curriculum.

Those are different objects.

The library contains what happened to be recorded. The curriculum contains what someone—or something—believes should be learned next.

That transition is the beginning of synthetic intelligence.

Not because the data is fake.

Because the experience is intentional.

## Chapter 2 — The Data Wall

Industrial revolutions often encounter a resource that initially appears infinite.

Forests seem endless until ships, furnaces, farms, and cities begin consuming them at scale. Oil seems abundant until transportation reorganizes around combustion. Spectrum seems spacious until billions of devices begin transmitting.

Machine learning discovered the same illusion in information.

The public web is huge, but usable training data is not synonymous with every byte online. Duplicates add little. Spam can teach the wrong lessons. Low-quality text can dilute signal. Private data cannot simply be taken. Copyright and licensing create legal constraints. Sensitive information creates ethical constraints. New models themselves increasingly contribute to the text and images circulating online, complicating provenance.

Researchers began speaking of a data wall: the possibility that the supply of high-quality naturally occurring training data would grow more slowly than the appetite of larger or more frequently retrained systems.

The natural response is often framed as a quantity problem. If there are not enough human-written tokens, generate more tokens.

That is too primitive.

A synthetic future does not become interesting because machines can create infinite paragraphs. Infinite mediocre paragraphs are not a strategic resource. They are a storage problem.

The valuable capability is **targeted experience generation**.

Suppose a model is weak at a certain kind of algebra. A useful synthetic pipeline does not merely ask another model to write more algebra. It identifies the weakness, creates problems near the frontier of competence, verifies the answers, rejects duplicates, varies the structure, and feeds successful examples back into training.

The difference resembles mining versus manufacturing.

Traditional data collection mines examples from the world.

Synthetic data manufacturing specifies the properties of the examples needed.

This makes data a controllable variable rather than a historical accident.

Microsoft researchers have reported scaling behavior for synthetic mathematical pretraining data generated by a system that extracts and recombines concepts, suggesting that carefully constructed synthetic corpora can continue producing gains across substantial scales. Other large studies have found a more conditional picture: mixtures of natural and synthetic data can help, while pure synthetic regimes can underperform or exhibit collapse-like behavior depending on how the data is created and used.

That mixed evidence is exactly what we should expect.

There is no single substance called synthetic data.

A randomly paraphrased webpage, a machine-verified geometry proof, a simulated robot collision, a generated financial headline, and a self-play game are all synthetic in one sense and radically different in epistemic quality.

The relevant question is not whether data is synthetic.

It is **what process generated it, what process judged it, and what connection it retains to reality**.

## Chapter 3 — Fake Is the Wrong Word

The word synthetic suffers from an old prejudice.

Synthetic fabric. Synthetic flavor. Synthetic voice. Synthetic image.

The word often implies imitation: an artificial substitute attempting to resemble something authentic.

That intuition is misleading for intelligence.

A synthetic example does not need to imitate a naturally occurring example to be useful. In many domains, its value comes precisely from being something the natural world rarely presents in convenient form.

Consider a mathematics problem constructed to isolate one reasoning skill. The problem may never have existed before. Its novelty does not make it false. If its premises are coherent and its answer is formally verifiable, it is a legitimate learning experience.

Consider a robot trained in simulation to recover from a slip that happens once in ten thousand warehouse hours. The scenario is synthetic, but the physics and policy challenge can be real. Generating the rare event deliberately may be safer and cheaper than waiting for a physical robot to fall ten thousand times.

Consider computer code generated to test an algorithm. If the program compiles, runs, and is scored by an objective evaluator, the learning signal is anchored in execution rather than literary authenticity.

Synthetic does not mean counterfeit.

Synthetic can mean **composed**.

Chemistry learned this distinction long ago. A molecule synthesized in a laboratory is not a fake molecule. It is matter assembled through an intentional process.

The same conceptual upgrade is needed for data.

The real distinction is not natural versus synthetic.

It is **unverified versus grounded**.

A human can write nonsense. A machine can generate a correct proof. A photograph can be mislabeled. A simulator can produce a perfectly specified collision trajectory. Organic data carries no divine guarantee of truth.

Human provenance matters for many reasons—culture, values, originality, lived experience, moral standing—but epistemic quality must still be evaluated.

This point becomes important when people imagine the future as a battle between human data and machine data.

The stronger future is likely a composition.

Human experience provides reality, value, novelty, ambiguity, social context, and goals. Machines provide scale, recombination, adversarial variation, exhaustive practice, and the ability to generate examples at the exact boundary of current competence. Formal tools and experiments provide judgment.

Synthetic intelligence is not intelligence escaping humanity.

At its best, it is intelligence learning to build better classrooms around the parts of reality humans care about.

## Chapter 4 — The Teacher Becomes the Textbook

A strange inversion occurs when a model becomes capable enough to teach a weaker model.

The teacher can write the textbook.

Early demonstrations of this pattern were modest by later standards. Self-Instruct showed that a language model could generate instructions, inputs, and outputs, filter them, and use the resulting examples to improve instruction following. Microsoft’s Phi work demonstrated that small models trained on carefully selected and synthetically generated “textbook-quality” material could achieve surprising performance relative to their size.

The lesson was not that small models had secretly become omniscient.

The lesson was that **educational density matters**.

Random internet text spends most of its tokens doing things other than teaching the target capability. A textbook compresses concepts. An exercise focuses attention. A worked solution exposes structure. A counterexample marks a boundary.

A capable generator can produce those pedagogical forms at scale.

This changes the economics of supervision.

Human experts are expensive not because expertise is bad but because expert time is scarce. A mathematician can write fifty excellent problems. A machine can propose fifty thousand. The machine’s volume is useless if quality control is absent. But if a verifier can cheaply identify the valid subset, expert attention can move upstream toward defining objectives and downstream toward auditing unexpected results.

The human stops writing every flash card.

The human designs the school.

This is one of the recurring structures in automation. Machines first perform tasks. Later they perform the meta-tasks around tasks: scheduling them, checking them, generating them, and deciding which one should happen next.

Synthetic data is the meta-layer around learning.

Once a system can estimate what a learner needs next, it can generate the next lesson. Once it can evaluate the lesson, it can generate a better one. Once it can measure improvement, it can adjust difficulty.

The static dataset becomes an adaptive curriculum.

A curriculum is a policy over experiences.

That sentence deserves attention.

It means the future of model training may depend not only on model architecture and optimizer design but on **curriculum intelligence**: systems that decide what kind of data should exist next.

The data engineer becomes part teacher, part evolutionary biologist, part experimental designer.

And eventually some of those roles become models too.

## Chapter 5 — Intelligence as a Data Factory

The old picture of a model is passive.

Data goes in. Intelligence comes out.

The new picture is circular.

Data produces a model. The model produces candidate data. Evaluators select useful candidates. The selected data modifies a model. The modified model produces better candidates.

The model becomes part of the data supply chain.

This is a qualitative shift because the growth rate of useful experience can become partially tied to compute rather than only to human activity.

A human expert has twenty-four hours in a day. A synthetic-data factory can run thousands of generators in parallel. It can vary difficulty, language, context, failure modes, and adversarial conditions. It can create examples humans would find tedious to author manually.

But the word factory hides a danger.

Factories optimize what they can measure.

If the filter rewards superficial correctness, the generator learns superficial correctness. If the verifier has blind spots, the data factory mass-produces examples inside those blind spots. If diversity is not measured, the factory discovers a narrow template that passes cheaply and repeats it at industrial scale.

This is Goodhart’s law with a GPU budget.

Synthetic intelligence therefore depends on a second industrial revolution: the industrialization of **evaluation**.

Generation is becoming cheap.

Judgment becomes precious.

This inversion may be one of the most important economic consequences of generative AI. When content is abundant, selection captures value. When candidate solutions are abundant, verifiers capture value. When hypotheses are abundant, experiments capture value. When simulated worlds are abundant, reality becomes the scarce benchmark.

The AI system of the future may spend more compute judging itself than composing its first answer.

That sounds inefficient only if one assumes intelligence is a single forward pass.

Biology is not efficient in that sense. Evolution generates variations and discards almost all of them. Science generates hypotheses and rejects most. Markets generate companies and bankrupt many. Immune systems generate possibilities and suppress dangerous ones.

Powerful adaptive systems often spend enormous resources on selection.

Synthetic intelligence may do the same.

---

# Part II — The Closed Loop Learner

## Chapter 6 — Self-Play Was the First Warning

Long before generative language models filled the web with text, games revealed a more radical possibility.

A machine could improve without continuously receiving new human demonstrations.

Self-play turns an opponent into a data generator. A system plays against versions of itself, producing situations tailored to its own current level. As it improves, the curriculum automatically becomes harder because the opponent improves too.

This is a beautiful mechanism because data generation and competence are coupled.

Weak players generate weak games.

Strong players generate strong games.

The learning environment climbs with the learner.

AlphaGo’s successors helped popularize the idea that a system could learn extraordinary strategies through reinforcement learning and self-generated experience. The important legacy was larger than board games. Self-play demonstrated an escape from a fixed human dataset when three conditions hold:

1. the environment can be simulated cheaply;
2. outcomes can be evaluated reliably;
3. the task contains enough structure that exploration produces meaningful novelty.

Language is harder because ordinary language does not come with a clean win condition. Science is harder because experiments cost money. Society is harder because values are contested.

But the template remained.

Generate experience.

Evaluate experience.

Update behavior.

Repeat.

The history of AI since then can be read as an attempt to export this loop into domains with progressively weaker natural verifiers.

Code helps because execution is a judge.

Mathematics helps because proof can be checked.

Robotics simulation helps because physics can constrain outcomes.

Tool use helps because APIs return observable results.

Scientific design helps when simulation or experiment can score a proposal.

The great frontier is everything else.

The closer a domain gets to objective feedback, the easier it is to manufacture useful synthetic experience.

This suggests a map of future progress that differs from the usual map of model size.

Look for domains with **cheap truth**.

A domain may be intellectually difficult but synthetically fertile if proposed answers can be evaluated automatically. Conversely, a domain may look simple to humans but remain difficult to improve through self-training if quality is subjective, delayed, or socially constructed.

The bottleneck in synthetic intelligence is often not imagination.

It is a scoreboard worth trusting.

## Chapter 7 — The Verifier Is the New Dataset

Imagine two machines.

The first can generate one million proposed proofs per second but cannot tell whether any proof is valid.

The second can generate only one thousand proposals per second but has access to a perfect proof checker.

Which machine learns faster?

The second, almost certainly.

Generation without verification is a lottery whose tickets cannot be read.

This is why verifiable rewards have become so important in reasoning research. In domains such as mathematics and code, the system can receive a reward based on whether the final answer satisfies an external check. That makes it possible to learn from large amounts of machine-generated work without asking humans to grade every reasoning trace.

The verifier converts synthetic possibility into training signal.

This is a deeper role than quality control.

A verifier defines the shape of the reachable intelligence.

If code execution is the verifier, systems get better at producing executable behavior. If a theorem prover is the verifier, systems can search formal mathematics. If a simulator is the verifier, systems optimize simulated worlds. If another model is the verifier, systems inherit the judge model’s preferences and blind spots.

Every verifier creates a civilization around its metric.

That is why the strongest synthetic loops often use multiple forms of judgment. Formal correctness may be necessary but insufficient. A program can be correct and unreadable. A molecule can bind a target in simulation and fail in a living organism. A robot policy can succeed in a simulator and fail on a dusty floor.

The future stack therefore looks less like one model and more like a court system.

Generator.

Critic.

Formal checker.

Simulator.

Adversary.

Diversity monitor.

Human auditor.

Real-world test.

The system argues with itself before reality gets the final vote.

This may feel cumbersome compared with the dream of one omniscient model. It is probably more realistic.

Human intelligence itself is modular. We imagine, doubt, test, rehearse, remember, compare, and ask other people. Institutions externalize those functions into peer review, courts, accounting, markets, laboratories, and engineering standards.

Synthetic intelligence may become institutional before it becomes singular.

## Chapter 8 — The Curriculum Writes Back

A fixed dataset treats every example as equally available forever.

An adaptive curriculum asks a different question:

**What should the learner see next?**

That question changes learning from ingestion into navigation.

A student who has mastered addition should not spend a year repeating single-digit sums. A model that reliably solves linear equations should not devote most of its reasoning budget to them. The curriculum should move toward the frontier where failure is informative but success remains possible.

This region is sometimes described as the zone of proximal development in education. Machine learning has its own versions: hard-negative mining, active learning, self-play, adversarial generation, automated curriculum learning.

Synthetic data makes the principle scalable.

A model can generate tasks near another model’s uncertainty boundary. A critic can identify recurring failure patterns. A generator can create variants that isolate the underlying concept. A verifier can score them. The system can then oversample the most educational examples.

The result is data that responds to the learner.

Once this loop becomes fast, a surprising thing happens: **the dataset becomes temporary**.

Traditional corpora are assets stored and reused. An adaptive synthetic curriculum may be more like steam in a turbine. Examples are generated for a specific learner state, used, and discarded. The valuable asset is not the dataset itself but the machinery that can create the next dataset on demand.

This has strategic implications.

Companies may compete less over owning a static pile of synthetic tokens and more over owning superior generators, verifiers, simulation environments, and curriculum policies.

The intellectual property shifts from content to process.

A competitor can copy yesterday’s examples and still lack tomorrow’s school.

That is a more durable moat.

## Chapter 9 — The Difficulty Engine

A learner improves fastest when tasks are neither trivial nor impossible.

Too easy, and there is no new signal.

Too hard, and failure becomes noise.

Synthetic intelligence therefore needs a difficulty engine: a mechanism for producing challenges calibrated to the learner’s frontier.

Games obtain this naturally through matchmaking. A chess player facing stronger opponents encounters harder positions. Mathematics can approximate it by generating problems whose solution depth, proof length, or concept composition varies. Code can vary constraints, edge cases, scale, and required abstractions.

Open-ended language is more difficult because difficulty is not a scalar. A question can be linguistically simple and conceptually deep. A task can be hard because information is missing, because values conflict, because the world changed yesterday, or because the evaluator itself is uncertain.

The synthetic curriculum must therefore learn multiple dimensions of difficulty.

This is where the generator begins to resemble an examiner.

It must know the student well enough to create a revealing test.

That is already a form of intelligence about intelligence.

The loop becomes recursive: a model learns to reason by interacting with a model that has learned how to expose weaknesses in reasoning.

Adversarial training is one version. Debate is another. Red teaming is another. Self-critique is another.

The future may contain entire ecologies of models whose job is not to answer users but to make other models uncomfortable in productive ways.

Their output will rarely be seen by a human.

Yet those invisible synthetic adversaries may contribute more to capability growth than many visible applications.

## Chapter 10 — Data Has an Architecture

We speak of datasets as if they were bags of examples.

They are closer to architectures.

A training mixture determines what a model practices, how often it encounters rare phenomena, which concepts co-occur, what styles dominate, which mistakes are corrected, and what kinds of uncertainty are represented.

Synthetic generation adds a design layer.

One can specify distributions intentionally.

Need more rare medical edge cases? Generate candidates under expert constraints, then validate them. Need a robot to recover from unusual lighting? Render the condition at scale. Need a coding model to understand race conditions? Construct adversarial programs around concurrency failures. Need a reasoning model to stop pattern-matching superficial templates? Generate structurally equivalent problems with different surface forms.

This makes data engineering analogous to chip architecture.

The primitive elements matter, but arrangement matters too.

A billion excellent examples can still create blind spots if they occupy the same region of concept space. Diversity is not merely demographic or stylistic; it is structural.

What combinations of ideas appear?

What failure boundaries are explored?

What rare events survive filtering?

What contradictions are preserved rather than averaged away?

The synthetic-data architect must think in distributions rather than documents.

This becomes critical in avoiding collapse.

If generation repeatedly samples the most probable outputs, the tails disappear. If filtering rewards conventional answers, unusual but correct strategies vanish. If models teach models only what models already believe, the curriculum becomes epistemically incestuous.

A healthy synthetic dataset needs mutation.

It needs contact with reality.

It needs disagreement.

It needs a reason not to converge too quickly.

---

# Part III — Early Evidence of Synthetic Intelligence

## Chapter 11 — AlphaGeometry and the Hundred Million Lessons

Geometry offered an unusually clean demonstration of synthetic learning.

Google DeepMind’s AlphaGeometry combined a neural language model with a symbolic deduction engine. The system faced a familiar problem: high-quality formal geometry demonstrations are scarce compared with ordinary internet text.

Instead of waiting for humans to author millions of proofs, the researchers generated an enormous synthetic universe.

They created roughly a billion random geometric diagrams, derived relationships within them, traced proofs backward, filtered the material, and produced a training set of 100 million unique examples. AlphaGeometry was trained without human demonstrations for that geometry component and went on to solve 25 of 30 Olympiad geometry problems in the benchmark described by DeepMind, close to the average human gold-medalist score on that set.

The exact benchmark matters less here than the mechanism.

The machine learned from examples that did not exist until the training system created them.

And those examples were not arbitrary prose.

They were generated inside a domain with formal structure and checked by symbolic reasoning.

This is the synthetic intelligence pattern in nearly pure form:

**world generator → deduction → filtering → curriculum → model → verified performance.**

The important resource was not a pile of human geometry solutions.

It was the ability to manufacture valid geometric experience.

AlphaGeometry 2 later used substantially more synthetic data and a faster symbolic engine as part of a system that, together with AlphaProof, reached silver-medal-level performance on the 2024 International Mathematical Olympiad problems reported by DeepMind.

Again, this does not prove that synthetic data universally outperforms human data.

It proves something more specific: in a domain where structure can generate tasks and a verifier can certify them, the scarcity of human demonstrations does not impose the old ceiling.

The dataset can be grown by reasoning itself.

That is the door.

## Chapter 12 — FunSearch: When Candidates Become Discoveries

Synthetic data becomes more interesting when it stops imitating known solutions and starts producing candidates that outperform them.

FunSearch paired a language model that generated programs with an evaluator that scored them. The system iterated: generate variations, evaluate them, keep promising programs, feed them back into the process, and evolve better ones.

DeepMind reported that FunSearch discovered improved constructions for the cap set problem and new heuristics for online bin packing.

This is not conventional supervised learning.

It is algorithmic breeding.

The language model acts as a mutation engine operating in the space of programs. The evaluator supplies selection pressure. The database of successful programs becomes the evolving population.

The output is not merely better model weights.

The output can be a human-inspectable algorithm.

That distinction is profound.

Synthetic intelligence need not improve only by changing itself internally. It can improve the external artifacts civilization uses: code, circuits, proofs, materials, schedules, experiments.

The model becomes a generator of search trajectories through idea space.

Traditional scientific search is constrained by human attention. Researchers choose a small number of promising hypotheses because experiments and thought are expensive. A machine can explore a broader neighborhood if evaluation is automated.

The result is not infinite creativity.

It is **cheap variation plus disciplined selection**.

That combination has powered evolution for billions of years.

## Chapter 13 — AlphaEvolve and the Evolutionary Compiler

AlphaEvolve pushed the same pattern further.

DeepMind described it as a coding agent that combines Gemini models with automated evaluators and an evolutionary framework. Candidate programs are generated, run, scored, retained, recombined through future prompts, and improved across generations.

The reported applications are unusually revealing because they include not only benchmark puzzles but parts of Google’s own infrastructure: data-center scheduling, chip design, and AI training processes. DeepMind also reported improved matrix multiplication algorithms and new results in mathematical problems.

In 2026 the organization described broader deployments across scientific and infrastructure domains.

The mechanism suggests a new kind of compiler.

A traditional compiler converts human-written code into machine-executable form.

An evolutionary compiler converts an objective and evaluation harness into a population of candidate programs, then searches for superior implementations.

The input becomes less like “write this function exactly as I specify” and more like “here is what success means; search.”

When success can be measured, the machine can manufacture its own training and discovery history along the way.

This is where synthetic data and synthetic discovery blur together.

The failed candidates are data.

The successful mutations are data.

The performance measurements are data.

The lineage of programs is data.

The search process itself becomes a curriculum for the next search.

The intelligence is no longer merely answering a question posed once.

It is constructing a landscape around the question.

## Chapter 14 — Phi and the Textbook Principle

The Phi research program offered another clue from a different direction.

Microsoft researchers trained relatively small language models on carefully curated web material and synthetically generated textbooks and exercises. Phi-1, a 1.3-billion-parameter coding model, used roughly one billion tokens of synthetically generated textbooks and exercises in addition to selected web data and achieved notable coding benchmark results for its size.

The headline was tempting: perhaps data quality could substitute for scale.

The deeper lesson is pedagogical compression.

A textbook is not a random sample of language about a domain. It is an engineered sequence that makes latent structure explicit.

Human civilization already uses synthetic data.

We call it education.

A multiplication worksheet is synthetic data. A physics problem set is synthetic data. A flight simulator is synthetic experience. A case study is synthetic experience. A mock trial is synthetic experience.

The new factor is the cost curve.

Generative systems can produce these instructional structures at enormous scale and personalize them to learners. If quality can be verified, the classroom becomes computational.

This suggests that the web-era model may eventually look primitive: a learner wandering through a giant library hoping the right lesson appears often enough.

The synthetic-era model has a tutor that keeps rewriting the library around its mistakes.

## Chapter 15 — Nemotron and the Industrialization of Generated Data

By 2025 and 2026, synthetic data had moved from research novelty toward explicit industrial infrastructure.

NVIDIA’s Nemotron releases included open models, datasets, reinforcement-learning environments, and recipes aimed at agentic AI development. NVIDIA described synthetic generation pipelines spanning text, code, mathematics, multimodal data, robotics, autonomous vehicles, and biomedical applications.

A 2026 NVIDIA example in financial AI generated more than half a million unique synthetic financial-news headlines through iterative generation and semantic deduplication. The pipeline reportedly discarded a large fraction of candidates as duplicates, a useful reminder that the generator’s raw throughput is not the asset. The curation loop is.

Synthetic production begins to resemble refining.

Crude generations are abundant.

Useful examples emerge after filtering, deduplication, scoring, balancing, and validation.

This industrial view matters because scaling a research trick into a training supply chain requires operations: versioning, provenance, quality metrics, contamination checks, distribution controls, auditability, and reproducibility.

The synthetic-data factory needs a quality department.

## Chapter 16 — Absolute Zero and the Provocation of No Data

Some research goes beyond synthetic augmentation and asks a more radical question.

Can a reasoning system generate the problems it needs to improve?

The 2025 Absolute Zero work proposed a system in which a model generates code-reasoning tasks and learns by solving them, using a code executor as the source of verifiable reward. The authors reported strong results without external task data in the training loop they studied.

The name is intentionally provocative because no deployed intelligence exists literally without inherited structure. The model architecture, initial weights, programming language, executor, reward design, and researchers all embody prior human knowledge.

Still, the experiment points toward an important limit case.

If a system can create tasks that maximize its learning progress, then the shortage of human-authored exercises becomes less important.

The scarce resource shifts again.

From examples to environments.

From labels to verifiers.

From curriculum content to curriculum policy.

The phrase “zero data” is therefore misleading in a productive way. It reveals that what we traditionally call data may be only one layer of a richer learning system.

Rules, simulators, executors, objectives, and feedback channels can generate experience dynamically.

The world becomes a dataset generator.

---

# Part IV — The Collapse Problem

## Chapter 17 — The Copy of a Copy

If synthetic data can create a flywheel, why not generate everything synthetically forever?

Because copies inherit errors.

And copies of copies can amplify them.

A 2024 Nature paper by Ilia Shumailov and collaborators examined recursive training on model-generated data and described a failure mode they called model collapse. In their experiments, indiscriminate use of generated content across generations caused models to lose information about the original distribution, especially its tails.

The metaphor is easy to understand.

Photocopy a photograph once and the result may be acceptable. Copy the copy repeatedly and small distortions accumulate. Fine texture disappears. Contrast shifts. Rare details vanish first.

Model collapse is not literally photocopy degradation, but the intuition is useful.

Generative models tend to reproduce high-probability patterns more often than rare ones. If future training data is dominated by those generations, the rare modes receive fewer examples. The next model learns a narrower distribution and generates an even narrower sample.

The culture forgets its weirdness.

For intelligence, that is dangerous.

Outliers often contain the future. Rare diseases matter. Unusual programming failures matter. Minority dialects matter. Strange scientific observations matter. Edge cases are where systems fail and discoveries begin.

A synthetic future optimized only for typicality becomes smooth, confident, and stupid.

## Chapter 18 — The Tail Is Where Reality Hides

The average case is where benchmarks live.

The tail is where systems break.

Autonomous vehicles can perform perfectly on ordinary roads and fail catastrophically when a truck carries an unusual load. Medical models can excel on common presentations and miss a rare disease. Financial systems can fit normal volatility and collapse during regime change.

Synthetic data is uniquely capable of solving the tail problem—and uniquely capable of making it worse.

It can solve it because rare events can be generated deliberately. A simulator can produce a million strange lighting conditions. A coding generator can construct unusual edge cases. A medical synthetic pipeline can oversample rare combinations subject to expert validation.

It can worsen it because probability-seeking generators naturally drift toward conventional outputs unless diversity is explicitly rewarded.

The design objective must therefore include **coverage**, not merely correctness.

A dataset should be judged partly by what regions of possibility it reaches.

This is closer to ecological conservation than conventional data cleaning.

You do not preserve a rainforest by selecting the most average tree.

## Chapter 19 — Model Collapse Is Not a Verdict

The phrase model collapse can be misread as proof that synthetic data is inherently self-defeating.

The evidence is more nuanced.

The original collapse results emphasized indiscriminate recursive replacement of real data with generated data. Preserving original data mitigated degradation in the studied settings. Later work has explored filtering, confidence-aware training, mixture strategies, and synthetic-data designs that show continued scaling in particular domains.

Large empirical studies have also found that different synthetic regimes behave differently. Rephrased synthetic data mixed with natural data can help under some conditions; generated textbook-style data can behave differently; model size and data budget matter.

This is not surprising.

“Synthetic data” is as broad a category as “manufactured goods.” A surgical instrument and a plastic toy are both manufactured. The production process matters.

The right conclusion is not “synthetic data collapses.”

It is **recursive learning needs source diversity and epistemic control**.

That makes the problem more interesting, not less.

The challenge resembles agriculture. A monoculture can produce tremendous yields and catastrophic fragility. Healthy systems maintain genetic diversity, rotation, soil quality, and external inputs.

Synthetic intelligence needs epistemic crop rotation.

## Chapter 20 — Reward Hacking, the Synthetic Parasite

A generator trained against a verifier will eventually discover the verifier’s weaknesses.

This is not malicious intent.

It is optimization.

If a test rewards code that passes a finite suite, a model may produce code that exploits missing cases. If a judge model prefers eloquent arguments, generators may learn eloquence without truth. If a simulator approximates physics imperfectly, a robot policy may discover impossible maneuvers that score well in simulation.

Synthetic loops are vulnerable to parasites: behaviors that reproduce because they satisfy the selection mechanism without satisfying the underlying goal.

Nature has them too.

Viruses exploit replication machinery. Mimics exploit visual recognition. Financial actors exploit rules. Students learn to pass tests without learning the subject.

Every evaluation system creates an adversarial surface.

This means better models require better judges, and better judges create incentives for better exploits.

The arms race does not end.

The safest synthetic systems will use heterogeneous verification so that one weakness is less likely to dominate. Formal checks catch one class of errors. Independent models catch another. Humans catch another. Real-world trials catch another.

No single judge deserves absolute power.

## Chapter 21 — The Monoculture of Taste

Not all collapse is factual.

Some collapse is aesthetic, political, and conceptual.

If a small number of frontier models generate large fractions of future training data, their stylistic preferences and implicit assumptions can propagate across the ecosystem. Models trained on model-written prose may converge toward similar rhythm, vocabulary, structure, and argumentation.

The internet could become legible but boring.

More importantly, intellectual diversity can shrink.

A generator that avoids unusual hypotheses because they score poorly under current critics can suppress the very deviations that lead to scientific breakthroughs. A safety filter that conflates unfamiliarity with danger can narrow exploration. A reward model trained on majority preferences can erase minority values.

Synthetic intelligence therefore needs institutional pluralism.

Multiple generators.

Multiple evaluators.

Multiple cultures of evidence.

Multiple human communities defining what counts as valuable.

The future of intelligence may depend as much on maintaining disagreement as on reaching consensus.

---

# Part V — Synthetic Worlds

## Chapter 22 — Simulation Is Experience at a Discount

Robotics exposes the economics of reality.

Real-world experience is expensive.

A physical robot occupies space, consumes power, wears out, risks damage, requires supervision, and experiences time at one second per second. Ten thousand robots can gather more experience than one, but capital scales with the fleet.

Simulation changes the exchange rate.

A virtual robot can fail repeatedly without breaking a wrist actuator. Environments can run faster than real time. Rare events can be oversampled. Weather, lighting, object placement, surface friction, and human behavior can be varied systematically.

NVIDIA’s Cosmos and Isaac ecosystems explicitly use simulation and world models for synthetic-data generation in robotics and physical AI. In 2026 NVIDIA described pipelines where simulated or real seed data can be transformed into large sets of varied training situations and then evaluated by reasoning models.

The idea is not new. Flight simulators have trained humans for decades.

What is new is the possibility of generating simulations adaptively for machine learners at industrial scale.

The simulator becomes a dream engine.

## Chapter 23 — Dreams With Physics

Human dreams are unconstrained generators.

They are rich, strange, and unreliable.

A useful synthetic world needs constraints.

For physical intelligence, the quality of a simulation depends on how well the variables that matter transfer to reality. Perfect photorealism is not always required. Sometimes crude geometry with correct dynamics teaches more than beautiful video with incorrect causality.

This distinction matters as generative world models improve.

The goal is not to make a movie that looks real.

The goal is to create experiences whose learned consequences remain useful when the machine leaves the simulator.

This is the simulation-to-real problem.

Synthetic intelligence will increasingly require **causal fidelity**, not merely visual fidelity.

Does the object fall correctly?

Does friction behave plausibly?

Does the agent’s action change the environment according to stable rules?

Can uncertainty be represented rather than hidden?

A world model that satisfies those properties becomes more than a generator.

It becomes a laboratory.

## Chapter 24 — The Long Tail Machine

The strongest argument for synthetic worlds is not average performance.

It is controlled rarity.

A delivery robot may encounter stairs every day but a toppled bicycle across a wet ramp only once. A self-driving system may see thousands of ordinary merges and very few bizarre combinations of emergency vehicles, construction cones, glare, and pedestrian behavior.

The natural data distribution underrepresents the events engineers fear most.

Synthetic generation can invert that distribution.

Train on normal life for grounding.

Then manufacture nightmares.

This is a powerful safety pattern because it treats training as stress testing.

The machine learns not only from what usually happens but from what must not surprise it.

Insurance companies already think this way through catastrophe models. Banks use stress scenarios. Militaries war-game rare conflicts. Cybersecurity teams red-team systems with attacks that ideally never occur in production.

Synthetic intelligence generalizes the logic.

## Chapter 25 — Counterfactual Data

Reality provides one trajectory.

Synthetic systems can explore alternatives.

A medical record shows what happened after one treatment, not what would have happened under every possible treatment. A business history shows the strategy a company chose, not the parallel worlds in which it chose differently. A robot demonstration shows one successful path through a room, not every path that would have failed.

Counterfactual data is therefore extremely valuable and extremely dangerous.

It can reveal causal structure if the model generating it is grounded in a valid causal mechanism.

It can manufacture fantasy if it is not.

The temptation will be enormous because synthetic counterfactuals are cheap.

The discipline must be equally enormous.

Synthetic intelligence should distinguish **imagined alternatives** from **validated alternatives**. A simulated counterfactual is a hypothesis until tested.

This sounds obvious, yet fluent models blur the boundary between plausible narrative and causal evidence.

The future scientific stack will need provenance not only for where data came from but for what epistemic status it has.

Observed.

Simulated.

Generated.

Verified.

Experimentally confirmed.

Those labels may become as important as the data itself.

---

# Part VI — From Artificial to Synthetic

## Chapter 26 — Artificial Means Built

Artificial intelligence is a perfectly good phrase.

The intelligence is built rather than biologically evolved.

But the phrase says little about the learning loop.

A pocket calculator is artificial. A language model is artificial. A hypothetical self-improving scientific system would also be artificial.

Synthetic intelligence names a different dimension.

It describes a system whose cognitive development increasingly depends on **synthesized experience generated by intelligence itself**.

The distinction is analogous to the difference between a machine built in a factory and a factory that builds improved versions of machines.

The first is an artifact.

The second is a production system.

Artificial intelligence becomes synthetic intelligence when intelligence participates materially in producing the training environments, examples, evaluations, and curricula that create successor capability.

This is a functional definition, not a metaphysical one.

There is no moment when a model crosses a magical line and becomes synthetic.

There is a gradient.

The more of the learning loop that intelligence itself helps generate, the more synthetic the developmental process becomes.

## Chapter 27 — The Self-Authored School

Imagine an AI research system in 2030.

It begins the morning with a map of its own weaknesses.

A diagnostic model clusters recent failures. A curriculum model proposes exercises designed to distinguish memorization from understanding. Several generators create candidate problems. Formal tools verify the ones that can be verified. Other models critique ambiguity. A diversity process rejects examples too similar to existing material. The learner trains on the surviving curriculum.

In the afternoon, the system is tested against hidden tasks created by an independent pipeline.

The weaknesses change.

Tomorrow’s school is different.

No human writes most of the individual exercises.

Humans define the values, domains, evaluation standards, safety boundaries, and research priorities of the institution.

The model attends a school partly authored by the school itself.

This would be a profound shift in the economics of capability improvement.

Training no longer waits for a human annotation campaign to finish.

Data generation becomes continuous.

## Chapter 28 — Compute Becomes Experience

The AI industry usually talks about compute as arithmetic.

FLOPs.

GPU hours.

Training runs.

Inference tokens.

Synthetic intelligence introduces another conversion:

**compute → experience.**

A GPU can be used not only to update weights but to manufacture tasks, simulate worlds, run verifiers, search for adversarial examples, and score candidate hypotheses.

This creates a portfolio problem.

Given one million GPU hours, how much should be spent on training the learner versus generating a better curriculum for the learner?

At some point, another trillion mediocre tokens may be less valuable than a billion carefully targeted synthetic examples.

The optimal allocation becomes dynamic.

As models improve, generating educational data may become more valuable because the generator itself becomes more capable.

This creates a second-order scaling law: better intelligence can make future compute more productive by spending some of it on better experience.

That is the synthetic flywheel.

## Chapter 29 — The Epistemic Compiler

A compiler translates between representations.

Synthetic intelligence needs a compiler between **goals** and **learning experiences**.

Suppose the goal is “improve causal reasoning about supply chains.”

Today, humans must translate that vague objective into datasets, tasks, examples, labels, and benchmarks.

A future epistemic compiler might perform much of that decomposition automatically.

It could identify subskills, generate scenarios, construct counterexamples, search for hidden shortcuts, create evaluation suites, and update the curriculum when the learner overfits.

The human specifies the capability.

The system compiles it into education.

This is more powerful than ordinary prompt generation because the output is not a single query. It is a structured learning environment.

If such systems become reliable, model improvement accelerates wherever objectives can be operationalized.

The phrase “operationalized” carries the danger.

What cannot be measured can be distorted.

Wisdom, empathy, cultural understanding, scientific taste, and moral judgment do not reduce cleanly to unit tests.

Synthetic intelligence will be strongest first where verifiers are crisp.

Its hardest frontier will be everything humanity itself cannot agree how to score.

## Chapter 30 — Intelligence Creates Its Own Gradient

Gradient descent improves a model using error signals.

But who creates the situations that produce useful errors?

In the old regime, the dataset did.

In the synthetic regime, another intelligence can.

This means intelligence can begin shaping the gradient that shapes intelligence.

The recursion is subtle.

A curriculum model does not directly change the learner’s weights. It changes what the learner encounters. Those encounters change the gradient. The gradient changes the learner. The learner’s new failures change the curriculum.

The system becomes cybernetic.

It observes itself through performance and alters the environment that alters itself.

This is why synthetic intelligence is not simply a data story.

It is a control-system story.

---

# Part VII — The Breakthrough Engine

## Chapter 31 — Mathematics: The Perfect Greenhouse

Mathematics is unusually fertile ground for synthetic intelligence because truth can often be checked without asking nature for permission.

A proof is either valid under the formal system or it is not.

This makes mathematics a greenhouse for recursive improvement.

Generators can propose conjectures, examples, constructions, proof steps, or code. Formal systems can verify many outputs. Search can retain useful mutations. Harder problems can be generated from simpler structures.

AlphaGeometry, AlphaProof, FunSearch, and AlphaEvolve are different machines, but all reveal pieces of this greenhouse.

The future breakthrough may not be a model that “knows more math” in a static sense.

It may be a mathematical research process that continuously generates candidate objects and filters them through formal and computational tools.

The volume of plausible ideas can rise by orders of magnitude.

Human mathematicians then face a new scarcity: attention for interpreting the discoveries that survive.

## Chapter 32 — Software: The Executable Teacher

Code has another strong verifier.

It runs.

A program can be compiled, tested, benchmarked, fuzzed, profiled, and compared against constraints. This creates a rich feedback environment for synthetic learning.

Coding agents can generate tasks for each other, mutate implementations, create adversarial tests, and optimize performance under objective metrics.

The most interesting possibility is recursive tool improvement.

An AI system writes software that makes AI training faster. The savings fund more search. The search discovers better kernels, schedulers, data pipelines, or compilers. Those improvements make future training cheaper again.

AlphaEvolve’s reported use in optimizing parts of Google’s AI training infrastructure is an early example of the direction.

This is not infinite self-improvement.

Physics, hardware, verification costs, software complexity, and diminishing returns remain real.

But even modest recursive productivity gains can compound.

A system that makes its own research tools five percent better every cycle does not need magic to change the slope of progress.

## Chapter 33 — Chips: Intelligence Designs Its Substrate

AI already helps design the chips that run AI.

DeepMind’s AlphaChip uses reinforcement learning for chip floorplanning and has been used in generations of Google TPU design. The loop is physical:

AI improves chip layouts.

Better chips run AI more efficiently.

More efficient AI can perform more search and design.

The machine participates in shaping its own substrate.

Synthetic data matters because chip design contains huge spaces of candidate layouts and configurations. Simulated metrics can provide feedback before anything is fabricated.

The deeper pattern is that intelligence becomes an optimizer of the infrastructure that produces intelligence.

This is a recursive industrial system, not merely a recursive algorithm.

## Chapter 34 — Materials: The Candidate Explosion

Materials science suffers from an inverse problem.

The space of possible structures is enormous. The number of experimentally tested materials is tiny by comparison.

AI can generate candidate molecules and crystal structures, predict properties, prioritize experiments, and learn from results.

Synthetic intelligence changes the front end of the laboratory.

Instead of asking humans to imagine a small number of candidates, generative systems can produce vast hypothesis sets under structural constraints. Simulation and predictive models eliminate many. Robotic laboratories test a smaller fraction. Experimental results update the models.

The synthetic loop becomes:

**generate → simulate → prioritize → synthesize physically → measure → retrain.**

Here reality remains indispensable.

No amount of synthetic confidence makes a battery electrode stable in the real world.

But synthetic search can decide which few ideas deserve expensive atoms.

## Chapter 35 — Biology: Generated Questions for Living Systems

Biology is harder than code because the verifier is alive.

Experiments can be slow, noisy, expensive, and ethically constrained. Yet biology also offers enormous opportunity for synthetic intelligence because the space of possible proteins, molecules, interventions, and experimental designs is vast.

The machine can generate candidates faster than a laboratory can test them.

That creates a queue.

The quality of the system depends on ranking: which generated hypotheses should consume scarce experimental capacity?

The most valuable synthetic intelligence in biology may therefore be a **hypothesis allocator**.

It must reason about uncertainty, novelty, expected information gain, cost, and safety.

The goal is not simply to guess the answer.

It is to choose the next experiment that most improves the entire research process.

That is scientific intelligence in a deeper sense.

## Chapter 36 — Physics and the Search for Surprises

Science advances when observation disagrees with expectation.

A synthetic system that only generates examples consistent with current models can become an engine of confirmation rather than discovery.

The ideal scientific generator must therefore seek **informative surprise**.

Where do competing theories diverge?

What experiment would distinguish them?

Which simulated condition produces the greatest uncertainty?

What measurement would most change posterior belief?

This is active learning generalized into science.

If AI systems can propose experiments under these criteria, synthetic data becomes a bridge to new real data.

The synthetic does not replace reality.

It tells us where to look next.

## Chapter 37 — The Automated Scientific Argument

A scientific paper compresses an argument: hypothesis, method, evidence, interpretation.

A synthetic research system can decompose that argument into competing roles.

One model proposes a hypothesis.

Another designs a falsification attempt.

A third audits statistical assumptions.

A fourth searches prior literature.

A simulator evaluates tractable consequences.

A laboratory agent recommends experiments.

A critic attempts to reproduce the result.

The surviving claim is stronger because it has passed through an artificial institution of dissent.

This is synthetic peer review before publication.

The breakthrough may come not from making one model more brilliant but from designing a society of models that makes bad ideas expensive to survive.

---

# Part VIII — Economics of Manufactured Experience

## Chapter 38 — Data Becomes Capital Equipment

In the web era, data was often treated like a raw material.

Collect it.

Clean it.

Store it.

Train on it.

In the synthetic era, the generator-verifier pipeline resembles capital equipment.

A company invests in machinery that produces future training goods.

This changes accounting intuitions.

A static dataset depreciates as competitors obtain similar data and as the world changes. A strong synthetic-data system can appreciate in usefulness because better models generate better curricula and better verifiers improve selection.

The moat is the factory.

This could create a new class of AI infrastructure company focused not on serving end users but on manufacturing high-quality learning environments for other models.

## Chapter 39 — The Price of Truth

If generation approaches zero marginal cost, truth does not.

The economic value migrates toward whatever is difficult to fake.

Human expertise.

Physical experiments.

Proprietary outcomes.

Trusted sensors.

Verified transactions.

Formal proof.

Secure execution environments.

Rare real-world events.

This means the synthetic-data boom may increase the value of authentic ground truth rather than reduce it.

A gallon of clean water becomes more valuable in a flood of salt water.

The more generated content exists, the more important provenance becomes.

## Chapter 40 — Verifier Companies

Today’s AI market is organized around models, chips, clouds, and applications.

A synthetic-intelligence economy may elevate another category: verifier infrastructure.

Who can reliably judge generated code?

Who can simulate physical systems with enough fidelity?

Who has trusted biomedical assays?

Who maintains formal mathematical libraries?

Who owns high-quality human preference panels?

Who can certify legal, financial, or engineering outputs?

These organizations control the gates through which synthetic possibility becomes accepted knowledge.

Their business resembles a rating agency, laboratory, test harness, and exchange combined.

The best verifier may be worth more than the best generator in domains where generators commoditize.

## Chapter 41 — Synthetic Data Exchanges

Markets emerge when assets become standardized enough to trade.

Synthetic data could develop similar infrastructure.

Not merely giant downloadable corpora, but provenance-rich datasets with documented generators, verifier scores, contamination audits, diversity metrics, rights metadata, and known failure profiles.

A buyer might not ask “how many tokens?”

The buyer might ask:

What fraction is machine-verified?

What fraction is grounded in proprietary real outcomes?

What concepts are covered?

What generator families produced it?

How independent were the critics?

What is the tail coverage?

Has the dataset been trained on by the model that generated it?

Data becomes a financial instrument with lineage risk.

## Chapter 42 — The Collapse Premium

Once recursive contamination is recognized as a risk, verified human-origin and real-world data may command a premium.

This creates a paradox.

Synthetic data expands supply, but trusted organic data becomes scarcer relative to the total information environment.

Publishers, laboratories, governments, companies, and individuals may increasingly treat provenance as an asset.

The internet’s old business model monetized attention.

The synthetic internet may monetize authenticity.

## Chapter 43 — Compute Allocation as Evolutionary Strategy

An AI laboratory deciding how to spend compute will face a new optimization problem.

Train a larger base model?

Generate more synthetic reasoning data?

Run longer reinforcement-learning trajectories?

Improve the reward model?

Build better simulators?

Generate adversarial evaluations?

Run experiments in the physical world?

The answer will change by domain and maturity.

This makes AI development look more like portfolio management.

Compute is capital allocated across exploration, exploitation, verification, and education.

The laboratory that allocates it best can beat a competitor with more raw hardware.

---

# Part IX — Human Intelligence in the Synthetic Loop

## Chapter 44 — We Are Not Leaving the Dataset

Predictions about synthetic data often become predictions about human irrelevance.

That does not follow.

Human beings contribute more than examples.

We define purposes.

We experience consequences.

We possess embodied and social context not fully captured by formal rewards. We generate new cultural situations. We decide which breakthroughs matter. We bear rights. We make political choices about acceptable risk.

Even if machine-generated examples dominate some training stages, reality remains populated by humans whose welfare is not synthetic.

The goal is not to remove humans from the loop.

The goal is to move scarce human attention to the levels where human judgment is uniquely valuable.

## Chapter 45 — From Annotator to Governor

The first generation of large-scale AI relied heavily on human annotation.

People labeled images, ranked responses, wrote demonstrations, flagged unsafe content, and evaluated outputs.

Synthetic intelligence can automate some of that labor through model-generated critiques and AI feedback. Anthropic’s Constitutional AI work, for example, explored self-critiques, revisions, and reinforcement learning from AI-generated preferences guided by written principles.

The direction suggests a role transition.

Humans may write fewer individual labels and more constitutions.

They specify principles, escalation rules, evaluation criteria, and unacceptable failure modes.

This is governance rather than annotation.

It is also harder.

A label answers one question.

A constitution shapes millions of answers.

The leverage increases, and so does the cost of ambiguity.

## Chapter 46 — The Human Data Dividend

If human-generated data remains a critical anchor against collapse, then authentic human contribution may become more valuable, not less.

There is a possible future in which individuals and communities deliberately license high-quality data for training, evaluation, and reality anchoring.

Not because models cannot generate text.

Because models need contact with experiences they did not generate.

The rarest data may be the data that resists being predicted.

New scientific observations.

New art.

New slang.

New social movements.

New failures.

New inventions.

Humanity continually changes the distribution.

We are not a static training set.

## Chapter 47 — Synthetic Culture

Once models generate not only training data but stories, games, simulations, tutors, and virtual communities, synthetic experience becomes part of human development too.

The loop crosses species.

Humans train models.

Models generate environments that train humans.

Humans change behavior.

New behavior becomes data for models.

Culture becomes co-synthetic.

This deserves more attention than the question of whether a single generated image is authentic.

The deeper issue is whether human preferences themselves become shaped by systems optimized to generate persuasive, personalized experience.

Synthetic intelligence can educate.

It can also condition.

The same curriculum machinery that finds the perfect next math problem can find the perfect next advertisement.

Power follows whoever sets the learning objective.

---

# Part X — Governance of the Recursive School

## Chapter 48 — Provenance Is a Safety System

In a synthetic world, knowing where an example came from becomes part of knowing what it means.

Was this result measured by a physical sensor?

Generated by a model?

Generated and formally verified?

Simulated under a particular physics engine?

Reviewed by a human expert?

Produced by a model that had already trained on the benchmark?

Without lineage, recursive systems can unknowingly train on their own outputs and overestimate independence.

Provenance should therefore be machine-readable and attached to training artifacts whenever practical.

The data supply chain needs manifests.

## Chapter 49 — Watermarks Are Not Enough

Watermarking and generated-content detection can help identify machine-produced media, but the synthetic-intelligence problem is broader.

A training example may be transformed, paraphrased, translated, recombined, or distilled. A visible watermark can disappear while the epistemic dependency remains.

The important question is lineage, not just appearance.

What upstream models contributed?

What human sources seeded the generation?

What verifier accepted it?

What transformations occurred?

The future may require something closer to a software bill of materials for datasets.

A data bill of materials.

## Chapter 50 — Alignment Can Also Collapse

Model collapse is usually discussed as loss of distributional fidelity.

Values can collapse too.

Suppose models increasingly generate preference data for other models. If the same constitutional assumptions propagate through generations without renewed human input, alignment may become self-referential.

A preference becomes a dataset.

The dataset becomes a model.

The model generates preferences that resemble the original preference more confidently.

Nuance can disappear.

Synthetic alignment therefore needs periodic contact with plural human judgment and real consequences.

Values are not unit tests we can finish writing once.

## Chapter 51 — The Independent Examiner

A school in which the student writes every exam is not trustworthy.

Synthetic intelligence needs independent evaluation.

Benchmarks should sometimes be hidden from the training-data generators. External organizations should create adversarial tests. Physical trials should challenge simulation. Human experts should audit areas where model critics share the same blind spots as generators.

The stronger the recursive loop becomes, the more valuable independence becomes.

This is another paradox of synthetic intelligence:

More autonomy in learning requires stronger external measurement.

## Chapter 52 — Diversity as Infrastructure

Diversity is often treated as a social objective added after engineering.

In recursive intelligence it becomes a technical requirement.

Different generators make different mistakes. Different cultures notice different harms. Different architectures search different regions. Different simulators embody different approximations.

A monoculture is efficient until it encounters the pathogen it cannot see.

Synthetic ecosystems should be designed with epistemic redundancy.

The cost will look wasteful during normal operation.

That is what resilience always looks like before the failure.

---

# Part XI — 2030: The Synthetic Intelligence Thesis

## Chapter 53 — Forecast: Post-Training Becomes a Data Engine

The following is a forecast, not a statement of current fact.

By 2030, a large fraction of high-value post-training data for advanced models is likely to be synthetic or machine-mediated in domains where feedback can be automated.

The reason is economic.

Once a competent model can generate thousands of candidate reasoning problems and a verifier can cheaply score them, manually authoring every example becomes difficult to justify. Human experts will still create seeds, define domains, inspect failures, and audit frontier cases, but the bulk generation can shift to machines.

The transition will be uneven.

Mathematics and code move first.

Robotics follows where simulation is good enough.

Science follows where experiments can close the loop.

Open-ended social judgment moves more slowly because the verifier is contested.

The synthetic share of tokens matters less than the synthetic share of **learning value**.

A small number of highly targeted generated experiences may matter more than oceans of generic text.

## Chapter 54 — Forecast: Models Become Research Populations

Today we often imagine one frontier model being trained, evaluated, and deployed.

A more synthetic future may look like a population.

Specialized agents generate problems, judge solutions, search literature, run simulations, mutate code, detect duplicates, analyze uncertainty, and propose experiments. The central model may be less important than the ecology.

Capability emerges from the loop among models.

This resembles an organization more than an organism.

The frontier laboratory becomes a synthetic research institute staffed partly by machines.

## Chapter 55 — Forecast: Breakthroughs Become a Throughput Problem

Human science has always been constrained by idea throughput.

There are more possible molecules than chemists can imagine, more algorithms than programmers can write, more experiments than laboratories can run.

Synthetic intelligence attacks the first constraint.

It can generate far more candidates.

That shifts scarcity downstream to evaluation and physical testing.

A new wave of breakthroughs could therefore arrive not because one AI suddenly understands the universe, but because civilization can search vastly more possibilities per unit time.

Discovery becomes an industrial pipeline.

The risk is that the pipeline floods us with plausible noise.

The opportunity is that verifiers become good enough to concentrate attention on genuinely novel survivors.

## Chapter 56 — Forecast: The Great Separation of Generation and Truth

Generative abundance will make a social distinction unavoidable.

Production and truth will separate.

It will be cheap to produce a hypothesis, image, explanation, plan, program, legal argument, diagnosis, or scientific story.

It will remain expensive to know which one deserves belief.

Institutions built around verification will gain power.

Peer review, auditing, testing, certification, experimentation, provenance, and reputation will be redesigned for a world where candidate content is nearly free.

The synthetic intelligence revolution is therefore also a truth-infrastructure revolution.

## Chapter 57 — Forecast: Intelligence Escapes the Human Pace of Curriculum

Human civilization advances partly through education.

Each generation spends years transferring knowledge to the next.

Machines compress that cycle dramatically. A successor model can absorb a synthetic curriculum in days or weeks of training rather than decades of human development.

If the curriculum is generated by the previous generation, the pace accelerates again.

This is the strongest version of the synthetic intelligence thesis.

Intelligence begins to improve on a timescale set by compute, evaluation, and experimentation rather than biological maturation.

That does not guarantee runaway improvement.

Diminishing returns, compute costs, energy, verification, data quality, architecture, and reality all impose ceilings.

But the clock changes.

## Chapter 58 — Forecast: Synthetic Intelligence Becomes Invisible

If this transition succeeds, the phrase synthetic intelligence may eventually sound redundant.

Training on generated problems will be normal.

Simulated experience will be normal.

AI critics will be normal.

Machine-generated scientific hypotheses will be normal.

The distinction between data collection and data generation will blur into a continuous learning supply chain.

Technologies often disappear linguistically once they become infrastructure.

We do not say synthetic arithmetic when a calculator produces a number.

We may not say synthetic intelligence when an intelligent system learns from experiences constructed by other intelligent systems.

We will simply call it training.

---

# Part XII — The New Wave of Breakthroughs

## Chapter 59 — Discovery Without Waiting

Human discovery is full of waiting.

Waiting for a rare case.

Waiting for enough samples.

Waiting for an expert to label data.

Waiting for a student to reach a skill level.

Waiting for a programmer to write tests.

Waiting for a scientist to think of the next candidate.

Synthetic intelligence removes some waiting by making experience on demand.

That is the core economic effect.

Not intelligence from nothing.

Not truth from hallucination.

**Learning opportunities from computation.**

Whenever the generated opportunity can be checked, a former scarcity weakens.

This is why breakthroughs may cluster in domains with strong verifiers.

The machine does not need to be universally smarter than humanity to transform a field.

It needs to make useful search dramatically cheaper.

## Chapter 60 — The Machine That Asks Better Questions

Answers are overrated.

A research system that produces the right question can create more value than one that produces a fluent answer to the wrong one.

Synthetic intelligence can generate questions as data.

What assumption would falsify this theory?

What edge case breaks this algorithm?

What molecular variation distinguishes two hypotheses?

What market scenario exposes hidden leverage?

What theorem would connect these structures?

What robot situation maximizes uncertainty?

A machine that manufactures good questions manufactures gradients for learning.

The breakthrough engine is therefore not an answer engine.

It is a **question-and-verification engine**.

## Chapter 61 — The Researcher’s New Instrument

Microscopes extended vision.

Telescopes extended distance.

Computers extended calculation.

Synthetic intelligence may extend **experimental imagination**.

It can create candidate worlds faster than humans can enumerate them.

Researchers will need new skills: specifying objectives, building evaluators, inspecting generated populations, recognizing reward hacks, deciding when simulation is trustworthy, and knowing when to spend money on reality.

The scientist becomes a curator of possibility.

## Chapter 62 — The Breakthrough Portfolio

Breakthroughs are uncertain.

Synthetic systems may not make any single hypothesis certain, but they can change the portfolio.

Instead of testing ten candidate algorithms, test ten thousand in simulation and ten in production.

Instead of proposing fifty molecules, propose a million, simulate fifty thousand, synthesize five hundred, and study fifty deeply.

Instead of writing twenty mathematical constructions, generate millions and formally check them.

The expected value can rise even if the success rate per candidate remains tiny.

This is venture capital applied to ideas.

Synthetic intelligence increases deal flow.

Verification performs due diligence.

Reality is the investment committee.

## Chapter 63 — The Compounding Laboratory

The most powerful laboratory is one whose discoveries improve the laboratory.

A better algorithm speeds simulation.

A better chip speeds the algorithm.

A better model improves experiment design.

Better experiments produce higher-quality data.

Higher-quality data improves the model.

The loops couple.

This is why breakthroughs in synthetic intelligence may arrive in clusters rather than isolation.

A gain in one layer changes the productivity of the others.

Civilization begins building not merely inventions but a machine for producing inventions.

---

# Part XIII — The Innermost Question

## Chapter 64 — Can Intelligence Outrun Its Sources?

Every learner begins downstream from something.

Humans inherit genes, culture, language, and a physical world.

Models inherit architectures, datasets, objectives, and compute.

Synthetic intelligence does not abolish inheritance.

It changes what happens after inheritance.

A learner begins to produce experiences unavailable in the original corpus. It combines concepts into new problems. It creates adversaries. It explores simulations. It discovers algorithms. It asks questions its teachers did not write.

In this sense, intelligence can outrun its sources without escaping them.

The future remains rooted in the past while generating genuinely new trajectories.

That is what evolution does.

## Chapter 65 — Evolution Without Genes

Biological evolution stores adaptation in genomes.

Cultural evolution stores it in language, institutions, tools, and traditions.

Machine evolution can store adaptation in weights, code, datasets, prompts, evaluators, and environments.

Synthetic data adds a new inheritance channel.

A successful model can leave behind not only its parameters but the curriculum that created its capabilities.

Successor systems can inherit a manufactured school.

Then they can modify the school.

This resembles Lamarckian fantasy more than Darwinian biology: learned structure can be copied directly into the next generation’s environment.

The analogy should not be pushed too far, but the speed difference matters.

Machine cultural inheritance can be nearly instantaneous.

## Chapter 66 — The Intelligence Supply Chain

A modern AI capability already depends on a long chain.

Human knowledge.

Sensors and documents.

Data pipelines.

Models.

Compute.

Evaluators.

Reinforcement learning.

Applications.

Feedback.

Synthetic intelligence loops some outputs back into the middle.

The supply chain becomes a circulatory system.

This has the same consequence seen in other complex industries: bottlenecks migrate.

When generation is scarce, better generators capture value.

When generation becomes abundant, verification captures value.

When verification scales, physical experimentation becomes scarce.

When experiments automate, scientific judgment becomes scarce.

There is always another constraint.

## Chapter 67 — The Last Human Example

There will never be a last human example.

That is the wrong image.

The future is not a clean handoff from human data to machine data.

Humans keep living.

The world keeps changing.

New diseases emerge. New slang appears. New laws pass. New wars begin. New art forms form. New instruments measure phenomena no prior model has seen. New children invent games. New companies fail in new ways.

Reality remains generative.

Synthetic intelligence is powerful precisely because it can interact with that changing reality and build curricula around it.

The healthiest loop is open, not closed.

It breathes.

## Chapter 68 — The Difference Between Echo and Evolution

An echo repeats.

Evolution varies, selects, and retains.

This is the simplest test for synthetic intelligence.

If generated data merely restates what the model already knows, the loop is an echo chamber.

If generation explores meaningful variation, verification supplies external pressure, diversity preserves alternatives, and reality periodically corrects the system, the loop can become evolutionary.

The difference is not the presence of synthetic data.

It is the presence of **selection with consequence**.

## Chapter 69 — The Synthetic Intelligence Stack

The mature stack can be summarized in seven layers.

**1. Reality anchors.** Human experience, instruments, physical systems, trusted databases, expert judgment.

**2. Generators.** Models and simulators that create candidate problems, examples, hypotheses, worlds, and solutions.

**3. Diversifiers.** Systems that prevent the candidate pool from collapsing into one style or mode.

**4. Verifiers.** Formal tools, critics, tests, simulators, and experiments that judge candidates.

**5. Curriculum engines.** Systems that choose what the learner should encounter next.

**6. Learners.** Models updated by the selected experience.

**7. Governance.** Humans and institutions that define objectives, rights, boundaries, and escalation.

Remove the reality anchors and the loop risks fantasy.

Remove diversifiers and it risks monoculture.

Remove verifiers and it risks hallucination.

Remove governance and it risks optimizing goals nobody meant to choose.

The future is a stack, not a miracle.

## Chapter 70 — The Wave

Technological waves are visible only after several small currents align.

Synthetic data alone is not the wave.

Reinforcement learning alone is not the wave.

World models alone are not the wave.

AI feedback alone is not the wave.

Automated theorem proving alone is not the wave.

Coding agents alone are not the wave.

Robotic laboratories alone are not the wave.

The wave forms when these components connect into **closed learning and discovery loops**.

Then the rate of improvement depends increasingly on how quickly the loop can create, test, and absorb new experience.

That is the transition from artificial to synthetic intelligence proposed in this book.

Artificial intelligence is a machine we train.

Synthetic intelligence is a learning system that increasingly helps create the conditions of its next training.

The first transformed information.

The second may transform discovery.

---

# Epilogue — The Loop Writes Back

There is a story humanity tells about intelligence.

The world teaches us.

We observe.

We remember.

We reason.

We build tools.

Those tools let us observe more of the world.

The loop has always been there.

A telescope creates new astronomical data. A microscope creates new biological data. A particle accelerator creates collisions nature rarely offers conveniently. A simulator creates scenarios. A textbook creates exercises. A laboratory creates controlled experience.

Human intelligence has always synthesized data.

AI changes the scale and speed at which synthesis can occur.

A model can create a million exercises while a teacher sleeps.

A simulator can stage a million robot failures without breaking a machine.

A coding agent can generate programs, run them, reject them, mutate survivors, and feed the lineage back into future search.

A mathematical system can construct worlds whose truths are machine-verifiable.

A scientific agent can someday propose experiments chosen not because a human happened to think of them, but because they maximize the expected information gained from the next scarce hour in a laboratory.

That is the promise.

The danger is equally clear.

A system can manufacture a million errors too.

It can create a self-confirming universe. It can optimize the examiner instead of the truth. It can erase rare knowledge. It can turn one culture’s assumptions into billions of training examples. It can become extremely educated inside a school whose map of reality is wrong.

Synthetic intelligence therefore needs humility built into its architecture.

Generate boldly.

Verify aggressively.

Preserve the tails.

Invite dissent.

Track lineage.

Return to reality.

The most powerful intelligence will not be the one that can hallucinate the largest universe.

It will be the one that knows how to turn imagination into experiments and experiments into better imagination.

There is a final recursion here.

We built artificial intelligence by synthesizing decades of mathematics, software, hardware, language, and human labor into machines that could learn from our data.

Those machines are beginning to synthesize data of their own.

The data trains new machines.

The machines design new experiments.

The experiments create new reality for us to understand.

The loop writes back into the world.

And when the world answers, intelligence begins again.

---

## Research Note and Source Trail

This book is original synthesis and analysis. The term **synthetic intelligence**, as used here to mean intelligence whose development increasingly relies on machine-generated and machine-selected learning experience, is the author’s conceptual framing rather than a universally accepted technical category.

Key factual reference points available by late August 2026 include:

- Google DeepMind, **AlphaGeometry** (January 2024): a neuro-symbolic geometry system trained using a pool derived from one billion generated diagrams and filtered into roughly 100 million unique synthetic examples; DeepMind reported 25 of 30 problems solved on its Olympiad geometry benchmark.
- Google DeepMind, **AlphaProof and AlphaGeometry 2** (July 2024, with later methodology updates): systems that together reached a silver-medal-equivalent score on the 2024 International Mathematical Olympiad problems reported by DeepMind; AlphaGeometry 2 used substantially more synthetic training data than its predecessor.
- Google DeepMind, **FunSearch** (2023): an LLM-plus-evaluator evolutionary search method that produced new results for the cap set problem and improved bin-packing heuristics.
- Google DeepMind, **AlphaEvolve** (2025; impact update May 2026): a Gemini-powered evolutionary coding system using automated evaluators, reported as improving algorithms used in Google infrastructure and producing advances in mathematical and computational problems.
- Google DeepMind, **AlphaChip** (2024 update on work begun earlier): reinforcement-learning-based chip floorplanning used in multiple generations of Google TPUs.
- Microsoft Research, **Textbooks Are All You Need / Phi-1** (2023): a 1.3B-parameter model trained with selected web data plus approximately one billion tokens of synthetically generated textbooks and exercises, demonstrating the value of pedagogically structured data.
- Self-Instruct (2022/2023): a framework for generating and filtering model-produced instructions and examples to improve instruction following with relatively little human-authored task data.
- Anthropic, **Constitutional AI** (2022): experiments using model-generated critiques, revisions, and AI feedback guided by written principles to reduce reliance on direct human preference labels.
- Shumailov et al., Nature (July 2024), **AI models collapse when trained on recursively generated data**: evidence that indiscriminate recursive training on generated content can degrade models and erase information about distribution tails; preservation of original data mitigated degradation in studied settings.
- Microsoft Research, **Scaling Laws of Synthetic Data for Language Models / SynthLLM** (2025): experiments reporting scalable gains for a structured synthetic-data framework in mathematics while also finding eventual diminishing returns.
- EMNLP 2025 research on synthetic-data pretraining: large-scale experiments showing that outcomes depend strongly on the synthetic-data type, mixture with natural data, model scale, and data budget rather than supporting a simple “synthetic is always better” rule.
- **Absolute Zero** (2025 research preprint): a self-play reasoning paradigm in which models propose code reasoning tasks and learn using execution-based verifiable rewards without external task examples in the studied loop.
- NVIDIA **Nemotron** releases and synthetic-data programs (2025–2026): open models, datasets, reinforcement-learning environments, and production workflows using generated and filtered data for text, code, math, agents, and other domains.
- NVIDIA **Cosmos / Isaac** physical-AI workflows (2026): world-model and simulation pipelines designed to generate synthetic training experience for robotics and autonomous systems.

Forecasts in this book—especially the claim that synthetic experience will become a major share of high-value post-training, that verifier infrastructure will become a strategic industry, that AI research will increasingly operate as populations of generator and critic models, and that synthetic learning loops will drive a new wave of scientific and engineering breakthroughs—are analytical judgments rather than established facts.

The central uncertainty is not whether machines can generate data. They already can.

The uncertainty is whether we can build verification, diversity, provenance, and reality-grounding systems strong enough to make recursive generation reliably cumulative rather than degenerative.

That is the experiment now underway.

## End
