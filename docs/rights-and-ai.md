# Rights, copyright, and AI

Bookself separates **software openness** from **publication rights**.

> **Public is a visibility setting. Open is a license. They are not the same thing.**

Bookself is designed so an author can write or publish in public without accidentally open-sourcing the book. The platform software and blank publication starters can be reused under the MIT License. A real manuscript remains the author's copyrighted work unless that author deliberately chooses a different license for that publication.

This document describes Bookself's product defaults and technical signals. It is not legal advice and it cannot replace advice from a qualified lawyer about a particular work, contract, jurisdiction, or dispute.

## The default rights model

Bookself's default for a real publication is deliberately conservative:

| Question | Default |
|---|---|
| Can people read the official public copy? | Yes |
| Is the book open source because the source is visible? | No |
| Is the book Creative Commons by default? | No |
| May someone republish or sell the manuscript merely because it is public? | No license is granted by Bookself |
| May someone make adaptations, translations, synthetic audio, or derivative editions merely because it is public? | No license is granted by Bookself |
| Are AI training rights granted by default? | No; they are expressly reserved |
| Are RAG, grounding, AI summaries, or other generative ingestion rights granted by default? | No; they are expressly reserved |
| Are ordinary search indexing and links allowed? | Yes by the Bookself machine-readable default |

A publication may opt into a Creative Commons, public-domain dedication, open-content, educational, AI, or other license. That is an author decision, not something Bookself infers from repository visibility.

## Copyright exists before publication

For U.S. works, copyright protection generally begins when original authorship is fixed in a tangible medium; registration is not required for copyright to exist. A copyright notice is likewise not required for modern U.S. works, but a clear notice remains useful because it identifies the claimed owner and publication year.

Bookself therefore puts a notice in front matter and a `RIGHTS.md` file in newly created publications by default.

For authors who want stronger U.S. enforcement options, registration can matter. The U.S. Copyright Office explains that registration creates a public record and is required before bringing an infringement action for a U.S. work; timely registration may also affect access to statutory damages, attorney's fees, and evidentiary presumptions. Frequently revised online works require care because later creative revisions are not automatically swept into one earlier registration.

Bookself treats a **release or edition** as the sensible publishing milestone at which an author may consider registration. It does not pretend every Git commit is a new copyright registration.

Official references:

- U.S. Copyright Office, Copyright Basics: https://www.copyright.gov/circs/circ01.pdf
- U.S. Copyright Office, Writers: https://www.copyright.gov/engage/writers/
- U.S. Copyright Office, registration portal: https://www.copyright.gov/registration/

## The per-publication rights file

A newly created Bookself publication should contain `books/<slug>/RIGHTS.md`.

The default notice reserves rights rather than granting them. It is intentionally broader than a software license and deliberately separates AI-related uses into their own category.

An author may replace that file with another license, but should do so deliberately. The publication README should make the choice visible through its `Rights` and `AI use` rows.

If a per-publication `RIGHTS.md` conflicts with the repository-level rights notice, the per-publication file is intended to describe the author's chosen license for that publication. Hosting-provider terms and applicable law remain separate and may grant or preserve rights regardless of either file.

## AI rights are a separate publishing decision

Bookself does not bundle AI rights into the ordinary act of publishing a readable book.

The default publication notice expressly reserves, unless separately licensed:

- model training and fine-tuning;
- creation of model weights or embeddings for generative use;
- retrieval-augmented generation (RAG), grounding, and AI answer systems;
- AI-generated summaries or substitutes for the work;
- synthetic narration, translation, adaptation, or derivative generation;
- inclusion in an AI-specific retrieval or generation index.

This follows the useful contract distinction made by the Authors Guild in its 2026 model clauses, which treats AI training, RAG/summary, synthetic narration/translation, and other AI uses as rights that should be addressed expressly rather than silently assumed.

Reference: https://authorsguild.org/advocacy/artificial-intelligence/ai-model-clauses/

An author who *wants* to license one of these uses can do so separately and can negotiate scope, exclusivity, attribution, reporting, compensation, duration, model family, deletion, and downstream sublicensing rather than granting an undefined bundle.

## Machine-readable signals

Human-readable copyright text is necessary for clarity but machines benefit from explicit signals too. Bookself uses or supports several layers.

### RSL in the Reader

The Bookself Reader carries an inline Really Simple Licensing (RSL) association on the publication surface. The default permits conventional search and prohibits AI-related use categories. RSL 1.0 is an industry specification published in December 2025 and defines machine-readable categories including `search`, `ai-train`, `ai-input`, `ai-index`, and `ai-all`.

Reference: https://rslstandard.org/rsl

RSL is a licensing signal, not encryption or access control. A crawler that ignores the standard can still fetch public bytes unless another technical control blocks it.

### TDM reservation

Bookself documents the W3C Community Group's Text and Data Mining Reservation Protocol (TDMRep) for deployments that control their origin. `tdm-reservation: 1` is a machine-readable reservation of text-and-data-mining rights designed in part for Article 4 of the EU Digital Single Market copyright directive.

Reference: https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240510/

For a site that controls the origin root, the protocol can be expressed at `/.well-known/tdmrep.json`, in HTTP headers, or in HTML metadata. Bookself's Reader can carry HTML-level reservation metadata; origin-level deployment is stronger because it can also cover direct manuscript assets.

### Content Signals and crawler controls

Cloudflare's Content Signals vocabulary distinguishes conventional search from AI input and AI training. A strong Bookself deployment can signal:

```text
search=yes
ai-input=no
ai-train=no
use=reference
```

Reference: https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/

Crawler-specific controls can add another layer. For example, OpenAI documents `GPTBot` as the control for potential training and `OAI-SearchBot` for ChatGPT search. Other providers publish their own crawler identities and policies. These names and behaviors change over time, so Bookself treats them as deployment guidance rather than baking a promise into copyright law.

Reference: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq

## GitHub hosting has a material rights boundary

A copyright notice does not override the terms of the platform on which an author chooses to host content.

As of August 2026, GitHub's personal Terms of Service say users retain ownership of their content, but grant GitHub and its affiliates rights needed to provide, develop, and improve the service, expressly including AI/ML training and development within the scope described by those Terms. GitHub's terms also say that public-repository content is directed to be accessible to everyone, and public repositories carry service-level permissions that support GitHub features such as forking.

Current terms: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service

This means a Bookself `All Rights Reserved` notice can reserve rights **against ungranted third-party uses**, but it cannot truthfully erase permissions the author separately gave the hosting provider by agreeing to its terms.

This is why Bookself distinguishes three questions:

1. **Who owns the copyright?** Usually the author or other named rightsholder.
2. **What license does the author grant readers and third parties?** All Rights Reserved by default in Bookself.
3. **What separate rights did the author grant the hosting provider?** Whatever the applicable hosting agreement says.

Authors who need stronger provider-level restrictions should compare current hosting terms before uploading the manuscript. Options may include a provider governed by a negotiated business agreement, private-source hosting with a separately controlled public delivery layer, a custom origin/CDN with enforceable crawler controls, or another publisher/host whose contract matches the author's requirements.

## GitHub Pages project-site limitation

This matters technically.

The Robots Exclusion Protocol requires `robots.txt` at the **origin root** (`https://example.com/robots.txt`). TDMRep likewise defines its well-known file at `/.well-known/tdmrep.json` on the origin server.

A default GitHub Pages project site is served at:

```text
https://OWNER.github.io/REPOSITORY/
```

A file committed as `REPOSITORY/robots.txt` is therefore served at `/REPOSITORY/robots.txt`, not at the required origin-root `/robots.txt`. The same problem applies to `/.well-known/tdmrep.json`.

Therefore Bookself does **not** claim that a project-repository `robots.txt` protects that project by itself. For full origin-level signals on GitHub Pages, use one of these approaches:

- control the `OWNER.github.io` user/organization site and publish origin-root rules covering each Bookself project path;
- use a custom domain mapped to the Bookself site so the repository can control that domain root;
- place the site behind infrastructure that can set origin-level crawler rules and HTTP headers.

The Reader's inline RSL/TDM metadata remains useful because it travels with the HTML publication surface even when the project repository does not own the `github.io` origin root.

## Search, citation, and quotation are not the same as unrestricted AI reuse

Bookself's default machine posture allows conventional search so a public book can be found and linked. It reserves AI training and generative ingestion by default.

That does not eliminate copyright exceptions. Fair use, quotation rights, library exceptions, research exceptions, and other statutory rules differ by jurisdiction and factual context. The U.S. Copyright Office's current Part 3 report on generative-AI training specifically describes fair-use analysis as fact-specific and does not declare every training use categorically lawful or unlawful.

Reference: https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-3-Generative-AI-Training-Report-Pre-Publication-Version.pdf

Bookself rights notices therefore say **"no license is granted"** and **"rights are reserved"** rather than pretending a repository file can repeal statutory exceptions.

## Creative Commons is opt-in, not the protective default

Creative Commons licenses are excellent when an author wants to grant public reuse rights. That is not the same goal as "let anyone read this while I retain control of copying and adaptation."

A CC license may affirmatively grant rights to reproduce, redistribute, or adapt a work depending on the selected terms. Creative Commons has also cautioned that restrictive CC conditions are not a reliable mechanism for preventing AI training where an applicable copyright exception already permits the activity.

Reference: https://creativecommons.org/2023/08/18/understanding-cc-licenses-and-generative-ai/

Bookself therefore defaults to All Rights Reserved and makes Creative Commons an explicit author choice.

## What the signals cannot promise

No public-web rights stack is a force field.

- Copyright notices do not prevent copying at the network layer.
- `robots.txt` is not access control.
- RSL, TDMRep, and Content Signals depend on recognition, compliance, and applicable law.
- A non-compliant crawler can ignore preference signals.
- A later notice cannot retroactively remove copies or model training that already occurred.
- Public Git history, clones, forks, mirrors, caches, and archives may persist after a file is removed.
- Hosting-provider terms may grant separate rights that the author's public notice cannot revoke while those terms apply.

For confidential writing, use access control and keep the content off public delivery surfaces. Bookself's rights layer is for **public authorship with explicit ownership**, not secrecy.

## Bookself's product promise

The default is intentionally simple:

> **Open tools. Author-owned words. Public reading by choice. Broader reuse only by permission or applicable law.**

A future Bookself feature should not weaken that boundary silently. Any change that grants a new license over manuscript content, enables a new AI use, or sends a private manuscript to a third-party system should require an explicit author decision.