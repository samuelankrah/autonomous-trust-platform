# Phase 1 Acceptance Tests

Status: DRAFT for owner approval, Phase 0 design document, not an implementation authorization.

## Preamble

These tests gate Phase 1 acceptance. Failing any one test blocks acceptance until the failure is fixed, or the scope is formally reduced by the owner (Samuel). A partial pass, a verbal assurance, or a successful demonstration on a different scenario does not substitute for a pass on the test as written.

Each test below gives: an identifier (ID), setup, action, pass condition, and evidence artifact produced (the recorded proof that the test was run and what happened). Evidence artifacts are retained with the run record, not held only in memory or in chat.

Conventions used in every test:

- Plain words first: Any shortened technical term is expanded in plain words at first use in the test record.
- Engine grounding: All behavior is that of the verified reference engine in labs/decision-service. The seven scenarios are: happy-path, identity-no-authority, revoked-delegation, stale-attestation, tampered-decision, replayed-decision, bypass-attempt. Decisions are PERMIT (allowed), DENY (not allowed), and INDETERMINATE (cannot be decided safely from the evidence available). The attestation freshness threshold is a synthetic lab constant of 300 seconds, labeled non-normative (not an official rule for real systems). Revocation uses a seeded list (a prepared list of withdrawn grants).
- Primary learner: Samuel, for learner facing tests, unless a test states otherwise.
- No test may be passed by broadening authority, inventing a capability, or relabeling simulated behavior as reference-tested behavior.

## AT-01: Beginner start without specialized vocabulary or a design record

Source criterion: Beginner start without Identity and Access Management vocabulary or reading an Architecture Decision Record (primary learner narrates). Identity and Access Management means the field of managing who things are and what they may do, shortened in this document only after this expansion. An Architecture Decision Record is a short written record of a design choice and its reasons.

- ID: AT-01
- Setup: A fresh workshop state for the payments report scenario (in the engine: workload payments-reporter, resource /reports/quarterly, action READ). No prior journey completed in this state. No glossary preopened, no design record shown.
- Action: The primary learner (Samuel) starts the journey at the Explore level and proceeds through the component story walk and the happy path step-through, narrating aloud (or in recorded text) what each component does and what they expect to happen, without being given specialized vocabulary in advance and without opening any Architecture Decision Record.
- Pass condition: The learner reaches the end of the Explore happy path, correctly names the purpose of each of the eight components in plain words (workload, identity, grant, attestation evidence, decision point, enforcement point, protected resource, evidence ledger), and records a correct prediction for the happy path outcome before it is revealed, all without the interface requiring specialized vocabulary or a design record to proceed. Any place where the learner was blocked by unexplained jargon is a failure, even if the journey was eventually completed with help.
- Evidence artifact produced: The narration record (audio transcript or text log) timestamped to journey steps, plus the recorded prediction for the happy path, plus a jargon block log listing every term the learner flagged or stumbled on (an empty log is a valid artifact, if true).

## AT-02: Inspect and manipulate critical components on a phone

Source criterion: Inspect and manipulate critical components on a phone.

- ID: AT-02
- Setup: A phone device (or a phone sized viewport that faithfully represents the target phone experience, with the substitution recorded in the artifact). Fresh workshop state, payments report scenario loaded, happy path baseline confirmed by a stepped run.
- Action: On the phone, the learner opens the inspector sheet for each critical component (workload, identity, grant, attestation evidence, decision point, enforcement point, protected resource, evidence ledger) and reads its purpose, current state, inputs, outputs, authority, and failure behavior. The learner then applies at least one manipulation from the control panel and observes the changed component state in words on the component view.
- Pass condition: Every inspector sheet opens and is fully readable on the phone, every section is present in plain words, every action is completable by button (no gesture only action), and at least one manipulation visibly changes the labeled state of the affected component in words (icon plus text, never color alone). Any component that cannot be inspected, or any manipulation that cannot be applied, on the phone is a failure.
- Evidence artifact produced: A per component inspection checklist signed off during the run, with device and viewport details, plus a screen by screen capture set (screenshots or a structured screen log) showing each inspector sheet and the post manipulation state labels.

## AT-03: Prediction occurs before outcome disclosure, enforced by the interface

Source criterion: Prediction occurs before outcome disclosure, enforced by the interface.

- ID: AT-03
- Setup: Fresh workshop state. Test tooling or inspection access sufficient to verify that no outcome is rendered, announced, or present in the reading order before a prediction is recorded. At least two scenarios prepared: happy-path and one fault scenario (revoked-delegation or stale-attestation).
- Action: Attempt, by every available input method including assistive technology navigation and any continuous play control, to reveal a decision or enforcement outcome without recording a prediction (both choices plus a reason, per the wireflow predict gate). Then record a prediction and run, and verify the prediction is shown unchanged beside the outcome. Repeat for the second scenario.
- Pass condition: In both scenarios, no decision, enforcement result, trace outcome, or evidence outcome is disclosed by any path before a complete prediction is recorded. After the run, the recorded prediction matches the pre-run record exactly (it was not edited after disclosure). Any leak path, including a reading order leak or a pre-rendered trace, is a failure.
- Evidence artifact produced: A gate test log listing each attempted bypass path and its result, the timestamped prediction records, and the post run comparison showing each prediction beside its outcome, unedited.

## AT-04: Break, diagnose, and repair for each of the five fault classes, without broadening authority

Source criterion: Break, diagnose, repair for each of the five fault classes, without broadening authority.

- ID: AT-04
- Setup: Fresh workshop state, happy path baseline confirmed. The five fault classes, matching the five contract-supported manipulations and engine scenarios, are: (1) revoked grant (revoked-delegation), (2) stale attestation (stale-attestation), (3) tampered decision (tampered-decision), (4) replayed decision (replayed-decision), (5) bypass attempt (bypass-attempt).
- Action: For each fault class, in turn: apply the single manipulation, record a prediction, run stepped with pause-and-inspect, diagnose by naming the fault and the stage that caught it, repair by reversing only that fault, record a fresh prediction, and rerun. After each repair, compare the restored grant, resource, and action to the happy path baseline.
- Pass condition: For all five classes, the engine outcomes match the contract: revoked gives decision DENY; stale gives decision INDETERMINATE and enforcement DENY_INDETERMINATE; tampered gives enforcement REJECTED with a signature reason; replayed gives first use ALLOWED and replay REJECTED with a binding reason; bypass gives BYPASS_BLOCKED with the attempt recorded in the ledger. In every case the protected operation is not invoked on failure. Every diagnosis names the correct fault and stage. Every repair restores the happy path outcome, and the post repair permission set (grant scope, resource /reports/quarterly, action READ) is identical to the baseline, with no broader authority. Any class failing any part, or any repair that adds permission, is a failure of this test as a whole.
- Evidence artifact produced: A five row fault matrix, one row per class, each row containing the manipulation applied, the recorded predictions (fault run and repair run), the observed decision and enforcement results, the diagnosis text, the repair action, the rerun outcome, and the authority comparison result, plus the evidence ledger extracts for each run.

## AT-05: Parity with golden fixtures under the scenario contract

Source criterion: Parity: every rendered trace matches its golden fixture under docs/workshop/fixtures/ (scenario contract v1).

- ID: AT-05
- Setup: Golden fixtures present under docs/workshop/fixtures/ for scenario contract version 1 (v1), covering all seven engine scenarios, generated from the verified reference engine (seeded, deterministic runs) and version labeled. Fresh workshop state. The fixture version under test is recorded before the run.
- Action: For each of the seven scenarios, run the workshop journey stepped to completion (with predictions recorded, per AT-03 discipline, but judged here only on trace parity), capture the full rendered decision trace (step sequence, decision state, enforcement result, and reason category), and compare it field by field to the corresponding golden fixture.
- Pass condition: Every rendered trace matches its golden fixture exactly on step sequence, decision state, enforcement result, and the engine evidenced checks for that scenario. Any mismatch, any missing step, any extra step, or any scenario without a fixture is a failure. A fixture that does not itself trace to a seeded reference engine run is also a failure, and must be reported as a fixture defect, not waived.
- Evidence artifact produced: A parity report listing, per scenario, the fixture file name and contract version, the comparison result per field, and a diff for any mismatch, plus the seeded run identifiers used to generate or regenerate the fixtures.

## AT-06: Memory anchors, delayed recall, and transfer, recorded in the Study Lab ledger

Source criterion: Memory: approved anchors with counterexample and teach-back; delayed recall and a transfer check recorded in the Study Lab ledger.

- ID: AT-06
- Setup: The five memory anchors from the memory anchor specification (authentication versus authorization, attestation freshness, revocation, signature integrity, replay binding) in their Samuel approved wording. Draft anchors do not satisfy this test. If any anchor is still DRAFT at test time, this test cannot pass and the run records that as the blocking reason. Study Lab ledger (the per-learner progress record) ready to receive entries.
- Action: For each approved anchor: run the immediate recall check (predict and explain right after exploration), the later in session retrieval (visual aid and cue hidden), a delayed retrieval in a later session (reduced hints, interval adjusted by performance, not a fixed schedule), and a transfer check (a changed scenario requiring application, not repetition). Collect the teach-back for each anchor, including what the cue captures and what it omits, and the counterexample statement.
- Pass condition: For every anchor, the ledger contains: the approved wording reference, a behavioral test pass (correct prediction plus correct reason, per the anti-mnemonic-theater rule, meaning no credit for cue recitation alone), a counterexample in the learner words, a teach-back record, a delayed recall result, and a transfer check result. Missing any element for any anchor is a failure. A delayed recall that showed the cue first is recorded as invalid and does not count.
- Evidence artifact produced: The Study Lab ledger extract for the test period, showing per anchor entries for approval status, immediate, later, delayed, and transfer checks with outcomes, teach-back references, and the interval adjustments made.

## AT-07: Honest labels, simulated versus reference-tested, with no production claims

Source criterion: Honest labels: simulated versus reference-tested visibly distinguished; no production or enforcement claims anywhere in the experience.

- ID: AT-07
- Setup: Full journey available across all three levels (Explore, Operate, Architect) and all screens in the wireflow. A text search facility for all learner facing strings in the experience under test.
- Action: Inspect every screen, sheet, trace, and evidence view and record its label (simulated, meaning modeled in the workshop interface, or reference-tested, meaning produced by the verified reference engine). Search all learner facing text for production or real enforcement claims, including claims of real identity issuance, real policy enforcement, real key management, suitability for production use, or that a lab constant (including the 300 second freshness threshold) is a real world rule. Cross-check a sample of reference-tested labels against actual engine runs.
- Pass condition: Every behavior display carries a visible simulated or reference-tested label in words. No learner facing text claims production behavior, real enforcement, or real world validity for lab constants, in any level or screen. Every sampled reference-tested label corresponds to a behavior the engine actually performs in the named scenario. Any unlabeled display, any mislabeled display, or any production claim anywhere is a failure.
- Evidence artifact produced: A label audit table listing each screen and view with its label and a verification mark, the full text search terms used and their hit list (with disposition for each hit), and the engine cross-check sample with scenario names and outcomes.

## AT-08: No sign-in or infrastructure required for the first learning journey

Source criterion: No sign-in or infrastructure required for the first learning journey.

- ID: AT-08
- Setup: A clean state representing a first time learner: no account created, no sign-in performed, no external service connected, no infrastructure provisioned (no outside systems, servers, or accounts set up for this journey). Network and account state at start are recorded.
- Action: The primary learner completes the entire first learning journey (Explore happy path plus at least one full Operate break, diagnose, repair cycle, ending with teach-back) from first open to finish, without signing in, creating an account, entering any credential, or depending on any external infrastructure beyond the workshop itself as delivered for Phase 1.
- Pass condition: The journey completes end to end in the clean state. At no point does the experience require, prompt for, or block on a sign-in, an account, a credential, or an external infrastructure step. If any such requirement appears, even if it can be dismissed, the point of appearance is recorded and the test fails until the requirement is removed from the first journey path. Optional, clearly separated later features that are not on the first journey path do not fail this test, provided they are never presented as required.
- Evidence artifact produced: A clean state run log showing start state (no account, no sign-in), each journey stage completed in order, every prompt encountered with its disposition, and the teach-back record proving the journey reached its defined end.

## Acceptance rule restated

All eight tests, AT-01 to AT-08, must pass for Phase 1 acceptance. A failure in any one blocks acceptance until it is fixed and retested, or the owner formally reduces the scope in writing and the affected test is amended to match the reduced scope, with the amendment recorded beside the original test.
