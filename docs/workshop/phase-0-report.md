# ATP Workshop: Phase 0 Report (Validation and Design)

**Date:** 2026-10-13
**Prepared by:** Dex (Muse), Phase 0 coordinator, for Samuel Agyapong Ankrah
**Status:** Phase 0 technical work complete. Phase 1 AUTHORIZED as scoped by the owner record at the end of this document (Samuel, 2026-10-13).
**Scope honored:** validation and design only. No JavaScript, no UI code, no deployment, no accounts, no changes to accepted contracts, sprint docs, or ADRs. Nothing Avallo was referenced, reused, or touched. Supabase was not touched.

**Tracked-copy revision note (2026-10-13):** This copy lives in docs/workshop/ as the tracked audit artifact. It is the Phase 0 report with the peer-review revisions applied: parity wording aligned to the normative projection in the scenario contract, the manual test evidence retained under docs/workshop/evidence/ with a reproducibility manifest, the Study Lab data lifecycle decisions recorded, and the owner decision record appended. The Phase 0 findings and numbers are unchanged.

## 1. Baseline reproduction: no substantive discrepancies

All previously reported numbers were treated as claims and independently reproduced from a FRESH clone of the GitHub repo into /tmp/atp-baseline (the working repo was not used for the baseline runs). Every claim matched:

| Claim | Observed | Verdict |
|---|---|---|
| HEAD at start of Phase 0 | ae6f330 ("docs: add MIT license") | Recorded |
| Python version | 3.12.3 | Recorded |
| Decision-service size | 1,569 lines across 15 files in labs/decision-service | Matches |
| Sprint 2 lab tests | 13/13 pass (6 authorization slice, 7 HTTP enforcement) | Matches |
| Decision-service tests | 22/22 pass | Matches |
| Walkthrough (seed 7) | 31 passed, 0 failed, OVERALL PASS, all 7 scenarios PASS | Matches |
| Evidence chain | "chain ok, 64 records", closed sequences ok, stored evidence file verifies | Matches |
| Determinism (cli.py repro) | Run A and run B both PASS, evidence 31,544 bytes each, byte-identical: True | Matches |

Evidence status: the Phase 0 runs were manual runs and are labeled **reported and reproducible**. Exact commands for every suite, the fixture regeneration, the determinism comparison, and the chain verification are recorded in docs/workshop/evidence/manifest.md, and retained run logs from a re-run at the revision commit are kept alongside it in docs/workshop/evidence/.

Two nuances, neither a claim failure:

1. **Test invocation matters.** A bare `python3 -m unittest discover` in the Sprint 2 lab directory runs 0 tests and exits nonzero, because the tests live in a tests/ subdirectory. The correct invocation is `python3 -m unittest discover -s tests`. Anyone reproducing the baseline must use the -s form or they will falsely conclude the suite is empty.
2. **One honesty detail about determinism.** Identifiers, timestamps, and ledger shape are seed-deterministic, but service signing keys are generated from fresh randomness per run (crypto.generate_key). Signature and hash values are therefore NOT reproducible per seed. The golden fixtures record signature presence and key ID only, never signature values. Parity in Phase 1 is the normative projection defined in docs/workshop/scenario-contract-v1.md: decision state and exact reason, authority provenance structure, every enforcement invocation with its result and reason in order, ordered evidence event types and per-event field names, asserted checks including detail strings, and deterministic identifiers, timestamps, and attestation ages. Cryptographic values are outside that surface, and the contract says so explicitly.

## 2. What was committed

Three commits, authored as samuelankrah (142953932+samuelankrah@users.noreply.github.com, verified in the log), pushed to origin/main. Final HEAD 5d82623, verified equal to origin/main, working tree clean.

| Commit | Contents |
|---|---|
| d5f7a9e | labs/decision-service/tools/export_fixtures.py, the additive fixture exporter |
| 6cb65d7 | docs/workshop/scenario-contract-v1.md and docs/workshop/fixtures/ (14 fixtures plus index.json) |
| 5d82623 | docs/workshop/ design drafts: memory-anchor-spec.md, learner-journey.md, mobile-wireflow.md, phase-1-acceptance-tests.md |

After all additions, both suites were re-run in the working repo: decision service 22/22 OK, Sprint 2 lab 13/13 OK. No regression. All new files follow the owner's standing style rule (no em dashes or en dashes in anything written, a standing instruction since 2026-10-01) and were machine-checked against that rule.

Revision commits (2026-10-13, after the peer review): six further commits applied the accepted review revisions to the exporter and the five workshop documents, and this report, the evidence directory, and the Study Lab extension proposal were committed on top. The revision commit at which the retained evidence logs were captured is recorded in docs/workshop/evidence/manifest.md, together with the HEAD versus origin comparison.

## 3. Scenario contract v1 and golden fixtures

- Exporter: labs/decision-service/tools/export_fixtures.py. It reuses the engine's own code paths (fresh service construction, the same scenario functions the CLI runs, wrapper-only observation that never alters results), so fixtures describe real engine behavior rather than a reimplementation.
- Fixtures: docs/workshop/fixtures/, one JSON per scenario per seed (7 scenarios x seeds 7 and 11 = 14 files) plus index.json, all stamped scenario-contract-v1. Each fixture captures inputs, the decision (state, reason, provenance fields), enforcement outcomes (full ordered arrays, since replay and tamper scenarios involve two decisions), the ordered evidence event types with field names, and the engine's own asserted checks with requirement IDs. All 14 scenario verdicts are PASS. The index also records provenance: the exporter version, the source engine commit, and the generation command.
- Regeneration is proven deterministic: the exporter was run twice and the output directory diffed byte-identical. Regeneration command, documented in the contract: `python3 labs/decision-service/tools/export_fixtures.py` from the repo root. (At a later HEAD, only the index source_engine_commit provenance field changes; the retained diff in docs/workshop/evidence/ shows this.)
- Contract: docs/workshop/scenario-contract-v1.md. Core rules: fixtures are generated from the reference engine, never hand-authored; any engine behavior change requires regenerating the fixtures and bumping the contract version; parity means a future browser build's structured trace matches the fixture on the contract's normative parity projection (decision state and exact reason string, authority provenance structure, every enforcement invocation with result and reason in order including the replay first use and the altered presented decision in tampering, ordered evidence event types and per-event field names, asserted checks by check ID and requirement IDs with per-row passed booleans and detail strings compared byte for byte, and deterministic identifiers, timestamps, and attestation ages), with signature values and hash values explicitly outside the compared surface. There is no partial parity.

## 4. Manipulability table (summary; full table with file-level evidence is in the contract doc)

SUPPORTED by the verified engine (these five, and only these, may appear in the Phase 1 control panel):

| Manipulation | Engine mechanism |
|---|---|
| Revoke the grant | Seeded revocation store in delegation.py, consulted at validation; decision DENY naming the revocation |
| Age the attestation | Injected manual clock advanced 301 seconds past the 300-second synthetic freshness threshold; decision INDETERMINATE, never a silent permit |
| Tamper with a decision | Enforcement verifies the decision signature first; altered decision REJECTED with the signature named |
| Replay a decision | Enforcement checks the decision's request and nonce binding; first use allowed, replay REJECTED |
| Attempt a bypass | The protected path exists only through enforcement with a decision; a direct attempt is blocked and itself recorded as evidence (BYPASS_BLOCKED) |

NOT SUPPORTED, deferred to future ADR and contract work (must not be simulated in Phase 1): credential rotation (no rotation code exists anywhere in the lab), policy editing (policy is a static file loaded once at startup; no editing surface), trust-anchor change (no trust-anchor concept exists; keys are per-run synthetic), dependency outage (single-process engine with no external dependency to disconnect; disconnected revocation state is explicitly out of scope in the lab README).

## 5. Study Lab ledger findings

Verdict: the Study Lab ledger can remain the single learning record, but not as-is. One small, namespaced, additive extension covers everything; no competing system is needed. Nothing was built; this is a description for a later decision.

- Current state: state.json is a flat map of card keys "0" to "449", each holding only interval, due, asked, correct, streak. Session records are printed, not stored, and progress.md is narrative only (its running totals block is already drifting from state.json, a pre-existing inconsistency).
- Scenario attempts: needs extension (no scenario, level, or manipulation fields exist).
- Prediction correctness: needs extension (only aggregate asked/correct per card; predicted vs actual is unrecoverable, and forcing predictions through card scoring would corrupt card intervals).
- Delayed recall: the scheduling core fits as-is and is reusable (interval ladder 1, 2, 5, 12, 25 days; due dates; weakest-topic-first selection). Missing: hint level, concepts with no deck card, and per-attempt history.
- Transfer tests: needs extension (no variant-of link or concept-applied field).
- Proposed minimal extension, when Phase 1 needs it: one top-level "workshop" key in the same state.json holding attempts, per-concept recall with history, and transfer tests, plus a Workshop section in the same progress.md. One implementation warning, verified in the code: score() iterates every value in state.json, so adding the key without restricting that iteration to card keys would crash scoring. The extension and the guard must land together.

Data lifecycle decisions (recorded in full in docs/workshop/study-lab-extension-proposal.md): workshop attempt, prediction, teach-back, transfer, and recall-history records are append-only, and prediction records are immutable once recorded; the only in-place updates are the per-concept ladder step and due date; a workshop reset archives a run's records and clears active run state, and never deletes ledger records; storage is local only, with no synchronization, external service, or accounts; the workshop namespace carries its own schema version, changes inside it must be additive, and a non-additive change requires a written migration, a prior backup of state.json, and owner approval; and the namespaced "workshop" key and the score() iteration guard are a mandatory pair that must land in the same change.

## 6. Design drafts (all under docs/workshop/, all marked DRAFT for owner approval)

- memory-anchor-spec.md: the seven-field anchor schema, the five-stage recall loop, the anti-mnemonic-theater rule, Samuel's approval gate, and DRAFT anchors for authentication vs authorization, attestation freshness, revocation, decision integrity check (renamed from signature integrity in the 2026-10-13 revision, because the lab check is a shared-secret HMAC and establishes no unique authorship), and replay binding, each grounded in its matching engine scenario and labeled proposed, never normative.
- learner-journey.md: the payments-report journey across Explore, Operate, and Architect, with prediction before disclosure, mandatory pause-and-inspect step-through, teach-back, and a mapping to the 8-step workshop loop. One correction applied during drafting: the governing documents used the shorthand "GET /payments/report", but the engine's actual scenario is the workload payments-reporter performing READ on /reports/quarterly. The journey is grounded in the engine truth, with the shorthand explicitly mapped so it cannot imply a different resource.
- mobile-wireflow.md: an 8-screen phone-first wireflow (component view, inspector sheet, control panel limited to the five supported manipulations, prediction gate, step runner with decision trace, evidence viewer, repair and reset, teach-back), with accessibility requirements: a button alternative for every gesture, status never carried by color alone, decision states announced in words.
- phase-1-acceptance-tests.md: the 8 acceptance criteria converted to AT-01 through AT-08, each with setup, action, pass condition, and evidence artifact, under a preamble that failing any one blocks Phase 1 acceptance until fixed or the scope is formally reduced by the owner.

## 7. Open items for Samuel

1. **Memory Anchor approvals.** Five draft anchors wait on your approval or rewrite, per the gate you set. Nothing in the workshop teaches from an unapproved anchor.
2. **Stop/go decision.** Phase 0 is complete against its plan. The gate question is whether Phase 1 (one scenario, phone-first workbench, no accounts) is approved to build, modified, or stopped. Record it in the owner decision record below.
3. **Ledger extension timing.** The Study Lab extension is described and deliberately unbuilt. It is only needed when Phase 1 starts recording real learning data; approving the description now costs nothing and building it can wait for the Phase 1 go decision.
4. **Standing reminders, unchanged.** No naming decision has been made or is needed yet (Avallo remains excluded). Public release, accounts, and deployment remain separate gates beyond Phase 1.

## Owner decision record

**Phase 1: AUTHORIZED as scoped (owner record below, 2026-10-13).**

- Decision (mark one):
  - [x] Approve Phase 1 as scoped
  - [ ] Approve with changes
  - [ ] Stop
- Owner decision: Approve Phase 1 as scoped (Samuel Agyapong Ankrah, given in chat)
- Date: 2026-10-13
- Scope changes (if any): None
