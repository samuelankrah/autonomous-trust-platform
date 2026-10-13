# Study Lab Extension Proposal: Workshop Records and Data Lifecycle

Status: PROPOSAL ONLY, Phase 0 design document, not implemented and not an implementation authorization. Nothing in the Study Lab (~/workspace/study-lab/) has been changed. Implementation waits on a Phase 1 need and owner approval of this design.

## Purpose in plain words

The Phase 0 ledger check found that the Study Lab ledger can remain the single learning record for the workshop, with one small namespaced extension. This document records the extension's shape and, as the peer review required, its data lifecycle decisions, before any code exists: which fields are append-only, what reset means, where records live, and how the schema migrates.

## Current state (verified in the Phase 0 check)

- `state.json` is a flat map of card keys "0" to "449", each holding only `interval`, `due`, `asked`, `correct`, `streak`.
- The scheduling core is reusable as-is: a fixed interval ladder (1, 2, 5, 12, 25 days), due dates, weakest-topic-first selection.
- Missing for workshop use: scenario attempts, prediction records, hint level, per-attempt recall history, concepts with no deck card, and transfer-test records.
- One hazard, verified in the code: `study_lab.py`'s `score()` iterates every value in `state.json`. Adding any top-level key without narrowing that iteration breaks card scoring.

## Proposed extension (shape only)

- One top-level `workshop` key in the same `state.json`, holding: scenario attempt records, per-concept recall state with per-attempt history, anchor approval status, and transfer-test records. One matching Workshop section in the same `progress.md`.
- The card schema (keys "0" to "449" and their fields) is never altered by this extension.

## Data lifecycle decisions

### Append-only records

These are written once and never edited in place:

- **Scenario attempt records:** scenario, level, the single manipulation applied, contract version, and fixture reference for the run.
- **Prediction records:** the predicted decision, the predicted enforcement result, and the learner's reason, recorded before the run. A prediction is immutable; a changed mind is a new record, never an edit. This is the ledger-side half of the prediction gate.
- **Teach-back records:** the learner's explanation text (or its transcript reference) per journey.
- **Transfer-test records:** the changed scenario used, the concept applied, and the result.
- **Anchor approval status history:** every status change for an anchor (draft, approved, rewritten) is appended with its date; the current status is derived from the latest entry, never overwritten silently.
- **Recall attempt history:** per concept, each attempt records the anchor ID, the anchor wording version used, the recall stage, the hint level shown, and the result. A recall result is always tied to the exact anchor wording in force at the time.

### Mutable state (the only in-place updates)

- **Per-concept recall scheduling state:** the current ladder step and due date. These advance in place, because they are a pointer into the ladder, not a record. Every advance is also visible in the append-only recall attempt history, so no history is lost by the update.
- Nothing else in the workshop namespace is updated in place.

### What reset means

- Resetting a workshop scenario or run **archives** that run: its attempt, prediction, and outcome records stay in the ledger as history, and the active run state is cleared so a new run can start. Reset never deletes ledger records.
- Deleting learner records entirely is an owner-initiated operation performed outside the workshop interface. It is out of scope for Phase 1 and is not a workshop feature.

### Storage

- **Local only.** Workshop records live in the Study Lab state file on the owner's machine. No synchronization, no external service, no accounts. This matches the Phase 1 boundary in AT-08: no external identity provider, database, API, or account is required.

### Schema and version migration

- The `workshop` namespace carries its own `schema_version`, independent of the card schema.
- Changes inside the namespace must be additive (new fields, new record types). A change that cannot be made additively requires a written migration, a backup copy of `state.json` taken before the migration runs, and owner approval, in that order.
- A migration never rewrites append-only history; it may only add derived or restructured views alongside it.

### Mandatory pairing (the score() guard)

- The namespaced `workshop` key and the `score()` iteration guard (restricting card scoring iteration to card keys) **must land in the same change**. The key without the guard crashes card scoring, because `score()` iterates every value in `state.json`. The guard alone is harmless but meaningless. Either half committed separately is a defect.

## Explicitly not decided here

- Implementation timing: only when Phase 1 needs real learning records, and only with owner approval.
- Adaptive recall scheduling: deferred as a Phase 1 design gate (see the memory anchor specification). Phase 1 uses the fixed ladder above; no scheduling rule is claimed to be validated learning science.
- Accounts, synchronization, and any multi-learner use: separate later gates, not part of this proposal.
