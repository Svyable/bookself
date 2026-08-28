# Publication rights manifest

Bookself publications can carry `rights.json` next to `README.md` and `RIGHTS.md`.

The manifest exists to keep copyright-management information and permission choices explicit, portable, and versioned with the manuscript. It does not create copyright, replace Copyright Office registration, override applicable law, or override a hosting agreement.

## Why keep a machine manifest?

A Git commit is useful provenance: it can preserve the exact text and metadata that existed at a point in repository history. The rights manifest makes several legally meaningful facts explicit rather than forcing a later reader to infer them from prose:

- work title;
- author;
- copyright owner;
- copyright notice and notice year;
- the named rights policy and human-readable rights file;
- explicit permissions and reservations;
- any Copyright Office registration data the author has deliberately recorded.

Under 17 U.S.C. §1202, copyright-management information can include the title, author, copyright owner, copyright notice, terms and conditions for use, and links or identifiers referring to that information, including when conveyed digitally. Bookself therefore tries to keep those fields attached to Reader and exported copies. Section 1202 has its own knowledge and intent requirements; the existence of metadata does not guarantee a DMCA claim.

## Default manifest

```json
{
  "schemaVersion": 1,
  "policy": "bookself-arr-v1",
  "work": {
    "title": "Your Book Title",
    "author": "Your Name"
  },
  "copyright": {
    "owner": "Your Name",
    "year": 2026,
    "notice": "© 2026 Your Name. All Rights Reserved."
  },
  "license": {
    "id": "ARR",
    "label": "All Rights Reserved",
    "file": "RIGHTS.md"
  },
  "permissions": {
    "publicReading": true,
    "conventionalSearch": true,
    "reproduction": false,
    "distribution": false,
    "derivatives": false,
    "commercialUse": false,
    "aiTraining": false,
    "aiGenerativeUse": false,
    "aiRetrievalGrounding": false,
    "aiIndexing": false,
    "syntheticNarration": false,
    "syntheticTranslation": false
  },
  "registration": {
    "jurisdiction": "US",
    "status": "not-recorded-in-bookself",
    "number": null,
    "effectiveDate": null
  }
}
```

The JSON Schema is `schemas/rights-v1.schema.json`.

## Registration fields are evidence fields, not guesses

`not-recorded-in-bookself` means only that this repository is not asserting registration data. It does **not** mean the work is unregistered.

Change the status to `registered` only when the author has reliable registration information, and then record the certificate's registration number and effective date exactly. For U.S. works, registration is generally required before an infringement action can be instituted; registration timing also affects remedies, and a certificate made before or within five years after first publication has statutory evidentiary significance under 17 U.S.C. §410(c).

Bookself should never manufacture a registration number, effective date, publication date, transfer of ownership, or legal conclusion.

## Published copies and notice year

For a published visually perceptible U.S. work, 17 U.S.C. §401 describes the familiar notice as © (or Copyright/Copr.), the year of first publication, and the copyright owner's name. Bookself's default published-copy notice follows that form.

A private or unpublished Desk draft can still be copyrighted because copyright does not depend on publication. The Shelf release is a publication/edition milestone, not the moment authorship first becomes fixed.
