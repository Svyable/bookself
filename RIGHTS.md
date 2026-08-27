# Rights boundary

**Open tools. Author-owned words.**

This repository contains two fundamentally different kinds of material. Do not infer a manuscript license from the fact that Bookself's software is open source.

## Bookself framework and blank starters

Bookself framework code, documentation, shared Reader/Desk software, scripts, and underscore-prefixed blank publication starters are available under the MIT License as described in [LICENSE](LICENSE).

## Real publications

A real publication under `books/<slug>/` is **not MIT licensed merely because its source is visible**.

Unless that publication's own `RIGHTS.md` or other explicit license says otherwise, its manuscript, illustrations, photographs, cover art, audio, and other publication content are copyright their respective rightsholders and **All Rights Reserved**.

Ordinary access to an official public copy is permitted for reading. No broader copyright license is granted by Bookself merely because the work is public, indexed, linkable, clonable at the network level, or stored in Git.

In particular, unless separately licensed, the default reserves rights concerning reproduction, republication, distribution, sale, adaptation, translation, synthetic narration, derivative editions, model training or fine-tuning, generative-AI ingestion, retrieval-augmented generation (RAG), grounding, AI summaries, AI-specific indexing, and sublicensing.

Nothing in this notice is intended to restrict uses independently permitted by applicable law, including any applicable fair-use, quotation, library, research, accessibility, or other statutory exception.

## Per-publication rights control

A publication may choose a different license. When `books/<slug>/RIGHTS.md` expressly grants rights for that work, read that file as the publication-specific author choice. A Creative Commons or other open-content license is therefore opt-in rather than inferred from public visibility.

## Hosting-provider terms are separate

The copyright holder's notice is not the only agreement that can matter. Uploading content to a hosting provider may grant that provider separate rights under its terms of service.

As of August 2026, GitHub's personal Terms of Service state that users retain ownership while granting GitHub and its affiliates certain licenses over uploaded content, including AI/ML development and training rights within the scope stated by those Terms. Public repositories also carry service-level permissions associated with public access and GitHub functionality such as forking.

Current GitHub terms: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service

An author who needs stricter provider-level limits should review the governing hosting agreement before uploading a manuscript. A Bookself rights notice cannot retroactively cancel rights separately granted to the host.

## Machine-readable reservation

Bookself's Reader carries machine-readable publication signals that reserve AI-related uses by default while permitting conventional search. Deployments that control their origin can add origin-root `robots.txt`, RSL, Content Signals, and TDMRep controls as described in [Rights, copyright, and AI](docs/rights-and-ai.md).

These signals communicate rights and preferences; they are not encryption, authentication, or a guarantee that every crawler will comply.

## Confidential writing

If material must remain secret, do not rely on copyright text, `robots.txt`, an unlisted URL, or a client-side password. Use actual access control and keep the material off public delivery surfaces.

For the complete Bookself policy and implementation guidance, see [docs/rights-and-ai.md](docs/rights-and-ai.md).