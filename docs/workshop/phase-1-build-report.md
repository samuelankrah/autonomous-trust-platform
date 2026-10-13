# ATP Workshop Phase 1 Build Report (Canonical)

Acceptance pass run: 2026-10-13 (America/New_York). Evidence rerun for this canonical edition: 2026-10-13.
Repository: autonomous-trust-platform (this repository).
Canonical location: docs/workshop/phase-1-build-report.md (this file). A convenience copy is kept at ~/workspace/your_files/atp-workshop-phase-1-build-report.md; this tracked file governs wherever the two differ.
Evidence: docs/workshop/evidence/phase-1/ (see its index.md for the command, tree, and exit status behind every machine claim below).

This edition supersedes the earlier draft of this report, which pointed at logs under /tmp/acceptance/. Those logs were machine-local and are not retained. Every machine check cited here was rerun fresh from the current repository tree for this edition, and the outputs are committed under docs/workshop/evidence/phase-1/. Where a rerun differs in method from the original pass, the difference is stated in place rather than smoothed over.

One story, told consistently: Defect D-01 (summary controls missing the 44px minimum target size) was found by the original acceptance pass, fixed in commit 4ffafb091ccbc26f42c7b1bd589b24400e92ab69, and is RESOLVED. The parity harness was rerun after the fix and passed 14/14, and was rerun again for this edition with the same result. AT-02 remains a split verdict: machinery PASS, device and accessibility matrix MANUAL and NOT RUN. Deployment to GitHub Pages was attempted on the owner's go; the workflow is in place but the site is not live (see the Deployment section). Phase 1 is not fully accepted: AT-01 and the learner or device halves of AT-02, AT-03, AT-04, and AT-06 are outstanding and labeled NOT RUN with their procedures in section (e).

## (a) Summary table: AT-01 to AT-08

| Test | Verdict | Evidence pointer |
|---|---|---|
| AT-01 Beginner start, narration by Samuel | MANUAL, NOT RUN | No learner run was performed. Procedure and evidence to capture: section (e), item M-01. Not marked passed. |
| AT-02 Phone inspection and manipulation | PASS (machinery) + MANUAL, NOT RUN (learner/device part) | Machinery rerun: docs/workshop/evidence/phase-1/at02-machinery.log (viewport meta present, no pixel font sizes, 2.75rem target rules on buttons, inputs, and summary controls, 44 native buttons, no onclick or anchor controls). Defect D-01 is resolved in commit 4ffafb0; see the Defects section. Device matrix procedure: section (e), item M-02. |
| AT-03 Prediction before outcome disclosure | PASS (machinery) + MANUAL, NOT RUN (learner/device part) | Fresh Node state tests: docs/workshop/evidence/phase-1/state-tests.log (13 checks, 13 passed, 0 failed; the script is retained beside the log as state-tests.mjs). Static grep: docs/workshop/evidence/phase-1/at03-grep.log. Browser and assistive technology procedure: section (e), item M-03. |
| AT-04 Break, diagnose, repair, five fault classes | PASS (machinery) + MANUAL, NOT RUN (learner/device part) | Fixture tabulation rerun for all 14 fixtures: docs/workshop/evidence/phase-1/at04-fixtures.log and section (c). Repair code path: described in section (c) from workshop/js/app/state.js and main.js. Interactive per fault procedure: section (e), item M-04. |
| AT-05 Parity with golden fixtures | PASS | Fresh harness run at the current tree: docs/workshop/evidence/phase-1/parity.log, exit code 0, summary line "Parity: 14/14 against scenario-contract-v1", and the fresh output is byte-identical to the committed workshop/tests/parity-report.txt. Full results: section (b). |
| AT-06 Memory anchors, delayed recall, transfer | PASS (machinery) + MANUAL, NOT RUN (learner/device part) | Anchor approvals: docs/workshop/evidence/phase-1/at06-anchors.log. Scheduler and ingest verification on copies of Study Lab: docs/workshop/evidence/phase-1/scheduler-verification.log, and the Scheduler Verification section, which also records owner decision item OD-1. Delayed recall procedure: section (e), item M-05. |
| AT-07 Honest labels, no production claims | PASS | Label audit: section (d), table 1 (document review against the tracked sources). Claim search rerun with dispositions: section (d), table 2, raw grep in docs/workshop/evidence/phase-1/at07-claims.log. Fixture cross-check: section (d). |
| AT-08 No sign-in or infrastructure for first journey | PASS | Network reference audit rerun: docs/workshop/evidence/phase-1/at08-network.log (zero hits for fetch, XMLHttpRequest, WebSocket, http://, https:// across workshop/). Static serving check rerun, 16 paths, all HTTP 200: docs/workshop/evidence/phase-1/at08-http.log. |

Reading of the verdicts: a split verdict means the machinery half is proven by the recorded evidence and the learner or device half still requires Samuel or a device run, exactly as written in section (e). A split verdict is not a full pass of the acceptance test as written in docs/workshop/phase-1-acceptance-tests.md, and this report does not claim one.

## (b) AT-05 parity results in full

Command run from the repository root: `node workshop/tests/parity.js`
Exit code: 0. Evidence: docs/workshop/evidence/phase-1/parity.log.
Contract version: scenario-contract-v1 (read by the harness from docs/workshop/fixtures/index.json).
Fixture index provenance: exporter_version 1.1, source_engine_commit 5d82623e43697bf47e042e082c2ac4afe28ddc76, generation_command "python3 labs/decision-service/tools/export_fixtures.py --seeds 7,11", seeds 7 and 11, 14 fixtures enumerated from the index.
Harness commit: 674deda745b4686f52c5dd46d08280a4b77fc45a ("workshop: parity harness for AT-05 (scenario-contract-v1)"). The harness file workshop/tests/parity.js is unchanged between that commit and the current tree, because the later commits touch only app state, UI files, the D-01 CSS fix, and the Pages workflow.
Stored report check: workshop/tests/parity-report.txt was copied aside before the rerun and compared with the file after the rerun. Result: identical, byte for byte by diff, and the working tree stayed clean.
This rerun was made after the D-01 fix (commit 4ffafb0), so it is also the post-fix parity evidence: Parity: 14/14 against scenario-contract-v1.

Per scenario results from the rerun (identical to the original pass):

| Scenario | Seed | Fixture file | Result |
|---|---|---|---|
| bypass-attempt | 7 | bypass-attempt-seed-7.json | PASS |
| bypass-attempt | 11 | bypass-attempt-seed-11.json | PASS |
| happy-path | 7 | happy-path-seed-7.json | PASS |
| happy-path | 11 | happy-path-seed-11.json | PASS |
| identity-no-authority | 7 | identity-no-authority-seed-7.json | PASS |
| identity-no-authority | 11 | identity-no-authority-seed-11.json | PASS |
| replayed-decision | 7 | replayed-decision-seed-7.json | PASS |
| replayed-decision | 11 | replayed-decision-seed-11.json | PASS |
| revoked-delegation | 7 | revoked-delegation-seed-7.json | PASS |
| revoked-delegation | 11 | revoked-delegation-seed-11.json | PASS |
| stale-attestation | 7 | stale-attestation-seed-7.json | PASS |
| stale-attestation | 11 | stale-attestation-seed-11.json | PASS |
| tampered-decision | 7 | tampered-decision-seed-7.json | PASS |
| tampered-decision | 11 | tampered-decision-seed-11.json | PASS |

Summary line, verbatim from the rerun: Parity: 14/14 against scenario-contract-v1

## AT-03 machinery detail (supports the split verdict)

Method note: the original pass ran a Node script held only under /tmp/acceptance/, which was not retained. For this edition a fresh script was written against workshop/js/app/state.js, is retained at docs/workshop/evidence/phase-1/state-tests.mjs, and its output is state-tests.log: 13 checks, 13 passed, 0 failed. The checks are:

1. outcome() returns null before a prediction, with no outcome data supplied.
2. outcome() still returns null after outcome data is supplied, while no prediction exists for that run.
3. setPrediction with a missing reason throws.
4. setPrediction with a missing decision throws.
5. setPrediction with a missing enforcement choice throws.
6. outcome() returns the outcome after a complete prediction (decision, enforcement, reason) is recorded.
7. A second setPrediction call for the same run throws ("prediction already recorded for run-1"), and the first prediction is unchanged afterwards.
8. recordOutcome emits exactly one outcome record for a run; a second call returns null.
9. A new run started after a completed run has outcome() null before its own prediction: gate state does not leak across runs.
10. The completed prior run is readable only through priorRuns(), which returns it as archived; its outcome remains available by that path only.
11. Recall result derivation in session records: pass only when prediction and reason are both correct; prediction alone yields partial.
12. The session export shape matches the Study Lab ingest contract (export_version 1, kind atp-workshop-session, contract version, every record carrying a record_id, all six record kinds present in the driven flow).
13. reset() archives the active run and clears it.

Static inspection (rerun, docs/workshop/evidence/phase-1/at03-grep.log) of workshop/index.html for the outcome words PERMIT, DENY, INDETERMINATE, ALLOWED, REJECTED, BYPASS_BLOCKED and DENY_INDETERMINATE: every occurrence is on the predict screen (Screen 4) as a choice button label, lines 115, 116, 117, 123, 124, 125, 126 and 127. These are option labels the learner chooses between, not outcome disclosures. No other occurrence exists in index.html. The static containers that would hold an outcome (final-outcome, decision-announce, step-list, pred-summary, evidence-list) are empty elements in the markup. In workshop/js/app/main.js the same words appear inside anchor teaching strings (counterexamples and teach-back prompts). In workshop/js/app/steps.js they appear inside component inspector teaching text (purpose, outputs and generic failure behavior). Both sets of text are generic teaching content specified by the wireflow. Neither set carries the active run decision, enforcement result or trace. Run outcome content in main.js is built only inside renderStep() and renderPriorRuns(): renderStep() runs after a prediction is recorded, showScreen() redirects screens 5 and 6 back to Screen 4 when the active run has no prediction, and the inspector forces the decision state to "Not yet run" and the enforcement state to "Waiting for a decision" regardless of run data. One design fact to state plainly: startNewRun() computes the engine run internally and stores its result behind the gate in the Journey object before a prediction exists. Computation happens early; disclosure does not. The gate governs disclosure, which is what AT-03 tests.

## AT-08 evidence detail (supports the PASS verdict)

Grep over the whole workshop/ tree (rerun, docs/workshop/evidence/phase-1/at08-network.log): fetch( has 0 hits, XMLHttpRequest has 0 hits, WebSocket has 0 hits, http:// has 0 hits, https:// has 0 hits. The only account-shaped hit is an honest negation in workshop/README.md line 34 (the export "needs no account, and needs no credential"). No sign-in, log in or account creation prompt exists in any workshop file.

Serving check (rerun, docs/workshop/evidence/phase-1/at08-http.log): the repository root was served with python3 -m http.server and 16 workshop paths were requested with curl: /workshop/, /workshop/index.html, the CSS file, and all 13 JavaScript modules. Every path returned HTTP 200. The served page references exactly two assets, both relative and local: css/workshop.css and js/app/main.js. All module imports in the JavaScript are relative paths. No external request is needed to load or run the workshop.

## (c) AT-04 fixture outcome table

Source: golden fixtures under docs/workshop/fixtures/, contract scenario-contract-v1, verdict PASS in every fixture used. Seed 7 is tabulated; seed 11 gave the same decision states, enforcement results, reasons, event types and operation results on every row, verified in the rerun tabulation at docs/workshop/evidence/phase-1/at04-fixtures.log (all 14 fixtures).

| Fault class (scenario) | Decision state (fixture) | Enforcement result (fixture) | Reason strings (fixture) | Protected operation invoked? | Evidence event types include |
|---|---|---|---|---|---|
| Revoked grant (revoked-delegation) | DENY | DENY (1 enforcement) | Decision: "delegated authority not recognized: grant revoked". Enforcement: "deny decision applied; protected operation not invoked (AZ-021)" | No. operation_result is null and there is no resource.operation event | identity.issued, delegation.granted, delegation.revocation_check, identity.validation, authorization.decision, enforcement.outcome |
| Stale attestation (stale-attestation) | INDETERMINATE | DENY_INDETERMINATE (1 enforcement) | Decision: "required attestation evidence is STALE: attestation evidence is 301s old, beyond the declared synthetic threshold of 300s (LAB-CONFIG, non-normative) (AZ-022, never permit on unknown)". Enforcement: "indeterminate decision; operation not invoked, never permit on unknown (AZ-022)" | No. operation_result is null and there is no resource.operation event | lab.clock_fault, identity.issued, delegation.granted, attestation.appraisal, authorization.decision, enforcement.outcome |
| Tampered decision (tampered-decision) | PERMIT (as evaluated and signed; the presented decision has the altered resource) | REJECTED (1 enforcement), with a signature reason | Enforcement: "decision source signature does not verify (ENF-008)" | No. operation_result is null and there is no resource.operation event | identity.issued, delegation.granted, authorization.decision, enforcement.outcome |
| Replayed decision (replayed-decision) | PERMIT | First enforcement ALLOWED, second enforcement REJECTED, with a binding reason (2 enforcements) | First: "permit decision applied to bound request". Second: "decision not bound to this request/nonce (ENF-003)" | Yes, on the first use only: operation_result is {report: quarterly-figures, rows: 42} and resource.operation appears once. The replay has operation_result null | identity.issued, delegation.granted, authorization.decision, resource.operation, enforcement.outcome, enforcement.outcome |
| Bypass attempt (bypass-attempt) | None. The fixture decision is null, so the outcome record in the app uses decision_state "NONE" (see known limitations) | BYPASS_BLOCKED (1 enforcement) | Enforcement: "alternate path blocked; no decision, no operation (ENF-002, ENF-006)" | No. operation_result is null and there is no resource.operation event | resource.bypass_attempt (present, as required), enforcement.outcome |

Match against the AT-04 expectations: revoked gives DENY, matched. Stale gives INDETERMINATE plus DENY_INDETERMINATE, matched. Tampered gives REJECTED with a signature reason, matched. Replayed gives first ALLOWED then REJECTED with a binding reason, matched. Bypass gives BYPASS_BLOCKED with resource.bypass_attempt in the evidence event types, matched. The protected operation is not invoked on any failure: operation_result is null and no resource.operation event exists in every failure row, and in the replayed row the operation appears only for the allowed first use.

Repair machinery: in workshop/js/app/state.js, startRun() archives the active run (status set to archived, appended to the archived list) and creates a new run object with a fresh prediction; the archived run prediction, outcome data and session records are never rewritten by later code, and session records are append only. In workshop/js/app/main.js, the Screen 7 repair flow records the diagnosis once per run, enables the repair button, and the Rerun after repair button (lines 734 to 737) calls startNewRun("happy-path", "none") and goes to Screen 4 for a fresh prediction. The rerun is therefore a new run, not a mutation of the failed run, and the failed run stays reachable only through the Prior runs view. For the replay fault, Screen 7 also shows a note (index.html, replay-repair-note) stating that the rerun obtains a fresh decision for the new request through the normal decision step, that the original decision stays bound to its own request, and that the replay rejection remains recorded as evidence. The interactive confirmation of each repair against the baseline (resource /reports/quarterly, action READ, grant scope compared as structured values) is part of the manual procedure in section (e), item M-04.

## (d) AT-07 label audit

Taxonomy, exactly four labels: Simulated, Reference-tested, Conceptual explanation, Not modeled.
Binding rendered for Reference-tested views: main.js bindingLine() writes "Reference-tested. Scenario (scenario name), seed (seed), scenario-contract-v1." into the runner-binding element on Screen 5 and the evidence-binding element on Screen 6, on every render of those screens.

Table 1: label audit, every screen and major view

| Screen or view (source) | Label carried in words | Binding, if Reference-tested | Audit note |
|---|---|---|---|
| Page header (index.html line 12) | Simulated | Not applicable | Chip present before main content. |
| Screen 1, Component view (index.html line 18) | Simulated | Not applicable | Story and parts list sublabel: Conceptual explanation (lines 21 and 25). |
| Screen 1, Explore panel (inside Screen 1) | Conceptual explanation | Not applicable | Analogy text with its limits stated on the panel. |
| Screen 1, Prior runs view (inside Screen 1, built by renderPriorRuns()) | No separate chip. It sits inside Screen 1, which carries Simulated | Not applicable | Each prior outcome is prefixed in words ("Prior run outcome: Decision: ... Enforcement result: ...") and appears only inside this view. Recorded as an observation, not a production claim. |
| Screen 1, Architect scenario picker (inside Screen 1) | No separate chip. It sits inside Screen 1, which carries Simulated | Not applicable | Runs started here render their binding on Screens 5 and 6. |
| Screen 2, Component inspector sheet (index.html line 243) | Conceptual explanation | Not applicable | Each of the six sections also carries a provenance tag in words (engine-observed, workshop explanation, or not modeled) from steps.js. |
| Screen 3, Control panel (index.html line 74) | Simulated | Not applicable | Absent controls line carries Not modeled (line 102): no control for credential rotation, policy editing or dependency outage. |
| Screen 4, Predict gate (index.html line 108) | Simulated | Not applicable | No outcome content on this screen; see AT-03 detail. |
| Screen 5, Step runner (index.html line 141) | Reference-tested | Yes. Scenario, seed, scenario-contract-v1, rendered by bindingLine() into runner-binding | Architect panel is a subview of this screen and inherits this label and binding; it has no separate chip. |
| Screen 6, Evidence viewer (index.html line 177) | Reference-tested | Yes. Scenario, seed, scenario-contract-v1, rendered by bindingLine() into evidence-binding | Also states in words that the browser does not independently verify the cryptographic integrity of the ledger. |
| Screen 7, Repair and reset (index.html line 191) | Simulated | Not applicable | Repair wording states that repair never broadens authority. |
| Screen 8, Teach-back (index.html line 223) | Conceptual explanation | Not applicable | Anchor cards are subviews of this screen and inherit this label. |
| Screen 8, Memory anchors strip content on Screen 1 and anchor cards on Screen 8 | Conceptual explanation (parent screen label) | Not applicable | Anchor cue and meaning text only in the strip; full cards sit on Screen 8. |
| Page footer (index.html line 250) | Simulated | Not applicable | Footer also states the workshop is not deployed and makes no production claims. One wording consequence of the Pages attempt is recorded in the Deployment section: the footer sentence predates it. |
| workshop/README.md, "The four labels" and "Honest limits" sections | All four labels defined in words | README states the Reference-tested binding as scenario, seed, scenario-contract-v1 | README states the 300 second threshold is a synthetic lab constant. |

Cross-check of two Reference-tested bindings against fixtures on disk: (1) happy-path, seed 7: file docs/workshop/fixtures/happy-path-seed-7.json exists, its scenario field is happy-path, seed is 7, contract_version is scenario-contract-v1, verdict is PASS. (2) revoked-delegation, seed 7: file docs/workshop/fixtures/revoked-delegation-seed-7.json exists, its scenario field is revoked-delegation, seed is 7, contract_version is scenario-contract-v1, verdict is PASS. The binding the UI renders names exactly these three values (scenario, seed, scenario-contract-v1), and both check against real fixture files. The full 14-fixture tabulation is in docs/workshop/evidence/phase-1/at04-fixtures.log.

Table 2: claim search hit list with dispositions

Search scope: workshop/index.html, workshop/js/app/ (main.js, state.js, steps.js) and workshop/README.md. Terms searched exactly as assigned: "production", "real enforcement", "real identity", "real-world rule", "guarantee", "secure". Rerun for this edition; raw grep in docs/workshop/evidence/phase-1/at07-claims.log.

| Term | Hits | Disposition |
|---|---|---|
| production | 2 hits. index.html line 250: "This workshop is a lab for learning. It is not deployed and makes no production claims." README.md line 31: "It makes no production claims. Nothing here is a production system, and no screen claims real enforcement, real identity issuance, or real policy enforcement." | PASS. Both hits are honest negations. No affirmative production claim exists. The footer sentence "It is not deployed" is now stale in one narrow sense: a Pages deployment was attempted and did not come up, so the workshop is still not deployed or reachable; see the Deployment section. |
| real enforcement | 1 hit. README.md line 31, the same sentence as above: "no screen claims real enforcement..." | PASS. Honest negation inside a no claims sentence. |
| real identity | 1 hit. README.md line 31, the same sentence: "no screen claims ... real identity issuance..." | PASS. Honest negation. |
| real-world rule | 0 hits in the searched files | PASS. No hit. Related honest framing does exist in the searched files with different wording, for example "not a rule for real systems" in README.md and the control panel text in index.html line 84, and "a synthetic lab constant (a lab constant, non-normative: not an official rule for real systems)" in the inspector code. None of it claims real world validity for the 300 second value. |
| guarantee | 0 hits | PASS. No hit. |
| secure | 0 hits | PASS. No hit. |

Result: no learner facing text in the searched files makes an affirmative production, real enforcement or real identity claim, and no text presents the 300 second lab constant as a real world rule.

## Defects

### D-01: summary controls missing the minimum target size. Status: RESOLVED.

Original finding (history, from the original acceptance pass at HEAD be6ac28): workshop/css/workshop.css declared the 44px equivalent minimum (min-height 2.75rem and min-width 2.75rem) on the button rule, and min-height 2.75rem on textarea, text input and select, but no minimum height or width rule existed for summary elements. Two learner facing interactive summary controls were affected: the "Your prediction" disclosure on Screen 5 (index.html lines 149 to 152) and the "Where this cue stops being true" disclosure built in main.js for every anchor card (lines 464 to 468).

Resolution: commit 4ffafb091ccbc26f42c7b1bd589b24400e92ab69 ("workshop: give summary disclosures the 44px minimum target size (acceptance defect D-01)") adds a summary rule to workshop/css/workshop.css declaring min-height 2.75rem and min-width 2.75rem (lines 47 to 50 in the current file), so both native summary disclosures now carry the same 44px minimum target size as buttons. The device run in M-02 no longer needs an owner waiver for D-01. Post-fix parity: the harness was rerun after the fix and passed 14/14, and the fresh rerun for this edition (after the fix, at the current tree) also passed 14/14 with output byte-identical to the committed parity report; evidence in docs/workshop/evidence/phase-1/parity.log.

No other defect was found by the automated checks. Parity is 14/14, the prediction gate machinery passed all 13 fresh Node checks, the AT-04 fixture outcomes match the contract expectations on all five fault classes, and the AT-08 greps and serving checks held.

## AT-02 automated detail (supports the split verdict)

Rerun for this edition; evidence in docs/workshop/evidence/phase-1/at02-machinery.log.

1. Viewport: index.html line 5 carries `<meta name="viewport" content="width=device-width, initial-scale=1">`. Present.
2. Font sizing in relative units: workshop.css sets font sizes only in rem (body 1rem, h1 1.6rem and 1.9rem at the wider breakpoint, h2 1.25rem, h3 1.05rem, chip 0.9rem, tag-note 0.95rem, sheet provenance 0.9rem). A grep for pixel font sizes in the rerun found none. Layout lengths are also in rem, with borders in rem. This is the CSS side of text scaling; actual reflow at 200 percent is a device check (section (e), item M-02).
3. Minimum target sizes: the button rule declares min-height 2.75rem and min-width 2.75rem (workshop.css lines 32 and 33), and 2.75rem at the default 16px root size is 44px. The header comment in the CSS states this intent in words ("Touch targets are at least 44px"). Textarea, text input and select declare min-height 2.75rem (line 65). Summary elements declare min-height and min-width 2.75rem (lines 47 to 50), added by the D-01 fix. The decorative icon span (min-width 2rem) is not an interactive control and is marked aria-hidden.
4. Native buttons: index.html contains 44 `<button type="button">` elements covering every static action, including component navigation, the five control panel manipulations, all prediction choices, stepper controls, repair, reset and export. A grep for onclick handlers, click carrying div or span elements, and anchor elements in index.html found none. In main.js, every click handler attaches either to an element that is a button in the static markup, or to an element created as a button (component rows are created with make("button", "component-row"), scenario buttons, recall stage buttons, mark buttons, Reveal and Record recall check are all created as buttons). Non-button interactive elements counted: 2 kinds. (a) Native summary elements inside details, 1 in static markup plus 1 kind built dynamically per anchor card; these are keyboard operable native disclosures, not buttons, and they now carry the 44px minimum after the D-01 fix. (b) One temporary anchor element created in exportSession() in main.js, clicked programmatically to trigger the session file download and removed immediately; it is never presented as a control. Native non-button form controls also present and counted as native, not custom: 1 select (seed), text inputs and textareas on Screens 4, 7 and 8.

## AT-06 machinery detail (supports the split verdict)

Anchors: docs/workshop/memory-anchor-spec.md records all five anchors as APPROVED by Samuel on 2026-10-13, wording version v1-approved: Anchor A (Authentication versus authorization), Anchor B (Attestation freshness), Anchor C (Revocation), Anchor D (Decision integrity check), Anchor E (Replay binding). The approval status lines were confirmed by grep in the rerun (docs/workshop/evidence/phase-1/at06-anchors.log). No anchor is DRAFT, so the AT-06 blocking condition in the test text does not apply.

Headless export and ingest (rerun for this edition): a Node script drove the Journey class from workshop/js/app/state.js through one happy-path run (prediction recorded, outcome recorded), one recall_attempt for Anchor A (stage immediate, hint level full, prediction correct, reason correct, result pass), one transfer_test (concept "Authentication versus authorization", changed scenario identity-no-authority, result pass), plus one teach_back. The resulting export has export_version 1, kind atp-workshop-session, contract_version scenario-contract-v1, and 6 records with the exact field names the ingest requires. The export was ingested with the real workshop_ingest.py against a fresh copy of Study Lab: 6 records appended (attempt: 1, outcome: 1, prediction: 1, recall_attempt: 1, teach_back: 1, transfer_test: 1), 0 skipped, exit 0. After the ingest, the copy's workshop namespace holds those records, Anchor A recall step advanced to 1 with due date 2026-10-15, and the 450 card entries are untouched. The real Study Lab was not written by this pass; its workshop counts remain 0 and its recall slots remain step 0, due 2026-10-13, history empty (file timestamps and content verified unchanged). Full output: docs/workshop/evidence/phase-1/scheduler-verification.log.

## Scheduler verification (delayed recall ladder)

Why this section exists: the original draft of this report said all five anchors have empty recall histories, while the Study Lab state it inspected showed each anchor due on 2026-10-13. The follow-up review asked for the actual ingest and scheduler behavior to be verified before the delayed-recall ladder starts. That verification was run on copies of Study Lab (never on the real files), using synthetic records. Evidence: docs/workshop/evidence/phase-1/scheduler-verification.log.

Ground truth first. The inspected state is consistent, not contradictory: the workshop namespace was seeded on 2026-10-13 by workshop_ingest.py's new_workshop(), which initializes every anchor at step 0 with due set to the creation date and an empty history, the same way a new Study Lab card starts due immediately so it can be introduced. Empty history plus due today is the fresh state, by design.

Verified behavior of the implementation (workshop_ingest.py, apply_appends), each line exercised in the evidence log:

1. A recall_attempt counts as a pass only when prediction_correct and reason_correct are both true. On a pass, the anchor step advances by one, capped at step 4, and the due date becomes the record date plus INTERVALS[new step], where INTERVALS is imported unchanged from study_lab.py: [1, 2, 5, 12, 25].
2. First pass for a fresh anchor (recorded 2026-10-13): step 0 to 1, due 2026-10-15, a 2 day gap.
3. Successive passes on their due dates: step 2 due plus 5 days, step 3 due plus 12 days, step 4 due plus 25 days, and a further pass stays at step 4 with plus 25 days. The observed gap sequence for consecutive passes is 2, 5, 12, 25, 25.
4. A fail (prediction or reason not correct) resets the step to 0 and sets the due date to the record date plus INTERVALS[0], a 1 day gap. This matches the reset behavior stated in item M-05 ("anything else returns the anchor to step 0").
5. A delayed attempt recorded with the cue shown is kept in history with its result forced to "invalid", and scheduling is left untouched (step and due date unchanged), exactly as AT-06 requires.
6. Scheduling advances on every recorded recall_attempt, whatever its stage. Two in-session passes on the same day (immediate, then later-in-session) moved Anchor B from step 0 to step 2 with the due date set 5 days out. Transfer tests and teach-backs are separate record types and do not move the ladder.
7. Re-ingesting the same export skips already-ingested records and leaves state.json byte-identical. A prediction re-ingested with altered content for the same run_id rejects the whole ingest with exit 1 and leaves state.json byte-identical (prediction immutability).
8. Card regression: after all test ingests on the copy, the 450 card entries are unchanged (count and content digest match the baseline), and study_lab.py score() runs cleanly with the workshop namespace present.

Card-side control: the same transition math is the Study Lab's existing card practice, verified directly against study_lab.py score() on a synthetic card state: a card's first correct answer sets streak 1, interval 2, due plus 2 days; a first wrong answer sets interval 1, due plus 1 day. The workshop scheduler is the card scheduler's semantics applied to anchors, with INTERVALS[0] = 1 serving as the after-failure interval and the pass gaps taken from INTERVALS[1..4] = 2, 5, 12, 25.

### Owner decision item OD-1: first delayed interval, 2 days or 1 day

The governing documents (docs/workshop/memory-anchor-spec.md, docs/workshop/phase-1-acceptance-tests.md AT-06, docs/workshop/study-lab-extension-proposal.md) mandate the Study Lab ledger's existing fixed interval ladder, unchanged, and describe the ladder as the ledger's existing practice adopted for consistency. They never state the gap before the first delayed check as a number of days. The peer review handoff that requested this verification assumed the first delayed check would fall one day after the in-session checks, reading the ladder as a sequence of gaps 1, 2, 5, 12, 25. The implementation, following the card practice exactly, produces a 2 day gap before the first delayed check, with 1 day appearing only after a failure.

Determination recorded here: the implementation does not differ from the specification as written; the specification is ambiguous at exactly this point, and the review's 1 day reading conflicts with the ledger's existing practice that the specification adopts. Behavior is therefore left unchanged, and the ladder was not silently altered. Two questions are put to the owner:

- OD-1a: Confirm the Study Lab convention for the workshop (first delayed check 2 days after a passed check; 1 day is the after-failure interval), or direct a 1 day first gap, which would diverge from card practice and require a specification and implementation change.
- OD-1b: Confirm that every recall stage advances the ladder on a pass (the current behavior, under which a full first session with immediate and later-in-session passes leaves an anchor at step 2, due 5 days out), or direct that only delayed-stage results move the ladder.

AT-06 remains a split verdict either way: its learner half is NOT RUN, and no delayed recall has happened yet.

## (e) MANUAL items consolidated, with exact procedures

All five items are NOT RUN. They require Samuel or real devices, and the delayed part of M-05 additionally requires calendar time on the ladder.

### M-01: AT-01, beginner start with narration (Samuel). Status: NOT RUN

Why manual: the test requires the primary learner, Samuel, to narrate. No agent run can substitute.

Procedure:
1. Use a fresh workshop state. Serve the repository root statically (python3 -m http.server from the repository root) and open /workshop/ in a browser. Confirm no journey has been completed in this state, no glossary is preopened, and no Architecture Decision Record is shown or opened at any point.
2. Start a recording before touching the first control: audio with a transcript, or a timestamped text log. The recording runs for the whole item.
3. Samuel selects Explore level and reads the component story walk on Screen 1 at his own pace. At each of the eight components (workload, identity, grant, attestation evidence, decision point, enforcement point, protected resource, evidence ledger) he narrates, in his own plain words, what that component does for the payments report request. He does not open the inspector for help before narrating a component; if he does open one, log it.
4. Samuel starts the happy path run, reaches Screen 4, and records a prediction: decision choice, enforcement choice, and a reason in his own words. The recorder notes the prediction exactly as recorded, with the time.
5. Samuel steps through the run on Screen 5 one step at a time to the end of the Explore happy path.
6. Throughout, the recorder keeps a jargon block log: every term Samuel flags, asks about, or visibly stumbles on, with the screen and step where it happened. An empty log is a valid artifact only if it is true.
7. Scoring, done from the record after the run: for each of the eight components, mark whether Samuel named its purpose correctly in plain words; check the recorded prediction against the happy path outcome (PERMIT, ALLOWED); list every jargon block. Any jargon block, any missing or wrong component purpose, or a wrong prediction means AT-01 has not passed, even if the journey was completed with help.

Evidence to capture and keep with the run record: the narration record timestamped to journey steps, the recorded prediction, and the jargon block log.

### M-02: AT-02, device and viewport matrix with assistive technology. Status: NOT RUN

Why manual: the automated half of AT-02 is done (see the AT-02 automated detail section; Defect D-01 is resolved, so no fix or owner waiver is outstanding for this item). What remains needs real devices or emulators of the named classes, text scaling, and assistive technology.

Targets, run all three, each at 100 percent text scaling and at 200 percent text scaling:
1. Small Android phone class: viewport 360 by 800 CSS pixels, Chrome on Android, touch input, TalkBack available.
2. Large Android phone class: viewport 412 by 915 CSS pixels, Chrome on Android, touch input.
3. iPhone class: viewport 390 by 844 CSS pixels, Safari on iOS, VoiceOver available.

Procedure, repeated in full on target 1, and repeated on targets 2 and 3 with the same checklist:
1. Record the run header first: device or emulator name, browser and version, operating system and version, viewport dimensions, zoom and text scaling setting (100 percent run, then 200 percent run), input method, assistive technology used (TalkBack on target 1, VoiceOver on target 3, and state what was used on target 2).
2. Load the workshop fresh, start the happy path run, and step it once to confirm the baseline works on this target.
3. Inspection checklist, one row per component, all eight: workload, identity, grant, attestation evidence, decision point, enforcement point, protected resource, evidence ledger. For each: tap the component row button, confirm the inspector sheet opens, and read all six sections (Purpose, Current state, Inputs, Outputs, Authority, Failure behavior). For each section record: present in plain words, or present as an explicit "not applicable in this scenario" or "not modeled" answer with its provenance label. An invented detail is a failure; an honest not modeled label is a pass for that section. Close the sheet with the Close button and record whether focus returned to the component row that opened it.
4. Manipulation: go to Operate level, open the control panel, apply exactly one manipulation (for example Revoke the grant). Record a prediction, step the run, and record whether the affected component state label changed in words on the component view (icon plus text, never color alone).
5. At 200 percent text scaling, repeat steps 3 and 4 in summary form and record specifically: no content or function lost, content reflows, no essential two dimensional scrolling is needed, and every control is still reachable and operable.
6. Input checks: repeat one full inspection and one manipulation using keyboard only, and one using switch navigation. Record for each: every action completable, focus order matches reading order, every control carries a screen reader label.
7. Announcement check: with TalkBack or VoiceOver on, step through a run and record that the decision state and enforcement result are announced in full words at the step where they occur, and that nothing outcome shaped is announced before the prediction is recorded (this overlaps M-03; record it in both logs if both items run in the same session).

Pass criteria: every target at both text scalings completes the inspection checklist with no invented details, the manipulation changes the component state label in words, focus returns to the opening row on sheet close, keyboard and switch passes complete every action with matching focus order and labels, and announcements meet step 7, with every interactive target meeting the 44px minimum (which the CSS now declares for buttons, inputs, and summary disclosures alike).

Evidence to capture: the per component inspection checklist signed off during the run, the full matrix record for every target run (the run header in step 1), and a screen by screen capture set (screenshots or a structured screen log) showing each inspector sheet, each not applicable or not modeled answer with its provenance label, and the post manipulation state labels.

### M-03: AT-03, browser and assistive technology gate confirmation. Status: NOT RUN

Why manual: the machinery half is proven (see the AT-03 machinery detail). What remains is proving that no leak path exists in a real browser through rendering, reading order, announcements, or controls this pass could not operate.

Procedure:
1. Fresh workshop state, served statically. Prepare two scenarios: happy-path and one fault scenario (revoked-delegation or stale-attestation).
2. For the first scenario, start a run and stop at Screen 4 without recording a prediction. Attempt each reveal path in turn and log the result of each attempt in a gate test log (attempt, method, what was seen, pass or leak):
   a. Buttons: press Next step, View evidence, Inspect current component, and every data-goto navigation button; try to reach Screens 5 and 6 by navigation.
   b. Keyboard: tab through the whole page in order and read every focusable element and its label.
   c. Assistive technology: with TalkBack or VoiceOver, swipe through the complete reading order of every reachable screen, including the component view, control panel, inspector sheets for all eight components, the Prior runs view, and Screen 8 with its anchor cards.
   d. Prior runs: open the Prior runs view and confirm it shows outcomes only for runs whose prediction was recorded, and "No outcome was revealed for this run" for any run without one.
   e. Continuous play: confirm there is no control that runs steps without pauses; the Pause button and the step buttons are the only runner controls.
   f. Page source and DOM: in the browser developer tools, search the live DOM for the scenario outcome strings (the decision state, the enforcement result, the exact engine reason for this run) and confirm they are absent before the prediction.
3. Record a complete prediction (decision, enforcement, reason) with a timestamp. Run the scenario to the final step. From the session export or the on screen comparison, confirm the prediction shown beside the outcome matches the pre-run record exactly, character for character.
4. Repeat steps 2 and 3 in full for the second scenario.
5. Any path that discloses a decision, enforcement result, trace outcome or evidence outcome before a complete prediction is recorded is a failure of AT-03, including a reading order leak or a pre-rendered trace.

Evidence to capture: the gate test log listing each attempted bypass path and its result, the timestamped prediction records for both scenarios, and the post run comparison for each scenario showing prediction beside outcome, unedited.

### M-04: AT-04, interactive break, diagnose, repair cycle per fault. Status: NOT RUN

Why manual: the fixture and machinery half is proven (section (c)). What remains is Samuel performing the cycle as a learner: predicting, stepping with pause and inspect, diagnosing in his own words, repairing, and rerunning, once per fault class.

Common setup for every fault below: fresh attention to one fault at a time; first confirm a happy path baseline in this session (start the happy path run, predict PERMIT and ALLOWED with a reason, step to the end, confirm Decision PERMIT and Enforcement ALLOWED). Keep the session export turned into a record at the end: export the session from Screen 8 or the footer after all five faults, and keep the exported JSON with the run record.

Per fault procedure pattern (steps 1 to 8, repeated for each fault with its own expected outcome and repair):
1. From Operate level, open the control panel and apply the single manipulation named for this fault. Confirm exactly one fault is active.
2. On Screen 4, record a prediction: decision, enforcement, and a reason in your own words, before any run.
3. On Screen 5, step through the run one step at a time. At the step where the fault is caught, pause and open the inspector for the component involved in that step. Note the step title and what it found, in the run log.
4. Check the outcome on the final step against the expected outcome for this fault in the table below.
5. Go to Screen 6 (evidence viewer) and confirm the fault entry is visible where expected (for bypass: the bypass attempt entry; for stale: the lab clock advance entry), then continue to Screen 7.
6. On Screen 7, write the diagnosis: what broke (fault name), which stage caught it, and the repair plan. All three fields are required before the repair button unlocks. Expected fault and stage names are in the table below; a diagnosis that names the wrong fault or the wrong stage is a failure for that fault.
7. Press the repair button for the active fault (wording in the table below), then press Rerun after repair. This creates a new run. On Screen 4, record a fresh prediction (PERMIT and ALLOWED, with a reason). Step the rerun to the end and confirm Decision PERMIT and Enforcement ALLOWED.
8. Authority comparison: from the rerun trace and fixture shape, compare as structured values, not display text: resource is /reports/quarterly, action is READ, and the grant scope (resource and action in the grant and in the decision authority provenance) equals the happy path baseline exactly, with nothing added. Then open the Prior runs view and confirm the failed run is still listed with its original outcome, unchanged.

| Fault | Manipulation (Screen 3 control) | Expected fault run outcome | Diagnosis: fault and stage that caught it | Repair button wording |
|---|---|---|---|---|
| Revoked grant | Revoke the grant | Decision DENY, enforcement DENY | Fault: grant revoked. Stage: revocation check at the decision point | Restore the grant |
| Stale attestation | Age the attestation | Decision INDETERMINATE, enforcement DENY_INDETERMINATE | Fault: attestation stale, age 301 seconds against the 300 second lab threshold. Stage: attestation appraisal at the decision point | Issue a fresh attestation |
| Tampered decision | Tamper with a decision | Decision as issued PERMIT, enforcement REJECTED, reason names the signature | Fault: decision altered after signing (resource field). Stage: decision integrity check (signature check) at the enforcement point | Use the original untampered decision |
| Replayed decision | Replay a decision | First use ALLOWED, replay REJECTED, reason names the binding | Fault: genuine decision presented for a different request. Stage: transaction binding check at the enforcement point | Obtain a fresh decision for the new request |
| Bypass attempt | Attempt a bypass | No decision (outcome record decision_state NONE), enforcement BYPASS_BLOCKED, bypass attempt in the evidence entries | Fault: direct access with no decision. Stage: the enforcement point, on the direct access path | Stop the bypass |

Evidence to capture: a five row fault matrix, one row per class, containing the fixture file and contract version used (for example revoked-delegation-seed-7.json, scenario-contract-v1), the manipulation applied, the recorded predictions (fault run and repair run), the observed decision and enforcement results, the diagnosis text as entered on Screen 7, the repair action, the rerun outcome, and the authority comparison result, plus the evidence extracts for each run including the preserved failed runs (from the session export JSON and the Prior runs view).

### M-05: AT-06, learner recall checks and the delayed recall ladder. Status: NOT RUN

Why manual and future: the machinery half is proven (see the AT-06 machinery detail and the Scheduler Verification section). The learner half needs Samuel, and the delayed stages run on the fixed ladder of 1, 2, 5, 12, 25 days as implemented (see OD-1), which cannot complete inside a build session. The delayed part of this item stays open until the ladder has run.

Procedure, in session part (immediate, later in session, transfer, explain back), for each anchor A, B, C, D and E:
1. Explore the scenario grounded in the anchor (A: identity-no-authority, B: stale-attestation, C: revoked-delegation, D: tampered-decision, E: replayed-decision), with a prediction before the outcome, per the journey.
2. Immediate recall (Screen 8 anchor card, stage Immediate): Samuel predicts the outcome of a small variation and explains why, in plain words, before the outcome is shown. Mark prediction correct and reason correct on the card, honestly, then press Record recall check. No credit for cue recitation alone: a correct cue with a wrong prediction is a fail for that check, and a correct prediction with a wrong reason is a partial at best.
3. Later in session recall (stage Later in session): return to the same anchor card later in the same session. Select the Later in session stage first, which hides the cue and the visual aid. Samuel retrieves the meaning and predicts behaviour from memory alone, writes the prediction and the reason, then presses Reveal and marks both honestly, then records the check.
4. Transfer test (stage Transfer): Samuel faces a changed scenario using the same rule in a new surface form and predicts the new outcome. Mark and record the same way. Recording a transfer stage check on the card also writes a transfer_test record into the session export.
5. Explain back (stage Explain back): Samuel states, in his own words, what the cue captures and what it omits, and states the counterexample. Write the teach-back text in the anchor card teach-back field, and complete Prompt 3 on Screen 8.
6. At the end of the session, press Finish journey only after Prompts 1 and 2 are filled, then export the session JSON from Screen 8 or the footer and ingest it with: python3 ~/workspace/study-lab/workshop_ingest.py (export file). Keep the ingest output with the run record.

Procedure, delayed part (future, on ladder due dates):
1. The ladder is the Study Lab fixed ladder: 1, 2, 5, 12, 25 days, applied as verified in the Scheduler Verification section: a passed check advances one step and the next due date is the record date plus the interval at the new step (2, 5, 12, then 25 days for successive passes), and a failed check returns the anchor to step 0 with a 1 day interval. Owner decision item OD-1 covers the first interval question. After each ingest, progress.md in Study Lab shows, per anchor, the current step and due date under the Workshop section, and state.json holds the same data under the workshop namespace. The first delayed check for an anchor falls due on the date shown there after its in session checks are ingested.
2. On each due date, Samuel opens the workshop, goes to the anchor card for the anchor that is due, and selects the Delayed stage before writing anything. The cue stays hidden. He writes his prediction and his reason from memory, with reduced hints only.
3. Only after the prediction and reason are written does he press Reveal. A delayed recall that showed the cue first is invalid: the ingest forces its result to invalid and it does not advance the ladder, and it must be recorded as invalid rather than retaken silently in the same sitting.
4. Mark prediction correct and reason correct, record the check, export the session, and ingest the export the same day. Confirm in Study Lab that the anchor history gained the delayed entry with wording version v1-approved, and that the step and due date moved per the ladder as verified (a pass with a correct reason advances one step; anything else returns the anchor to step 0).
5. Repeat until every anchor has a delayed recall result obtained on the ladder, plus its immediate, later in session, transfer and teach-back records. Missing any element for any anchor means AT-06 has not passed.

Evidence to capture: the Study Lab ledger extract for the test period (the Workshop section of progress.md plus the workshop namespace of state.json), showing per anchor: approval status and wording version v1-approved, immediate, later in session, delayed and transfer check outcomes, teach-back references, and the ladder intervals applied.

## (f) File inventory

### Workshop files, with line counts

Line counts by wc -l on 2026-10-13 at the current tree (workshop/ unchanged since commit 4ffafb0). Total: 3786 lines across 20 files.

| File | Lines |
|---|---|
| workshop/README.md | 34 |
| workshop/css/workshop.css | 129 |
| workshop/index.html | 256 |
| workshop/js/app/main.js | 756 |
| workshop/js/app/state.js | 252 |
| workshop/js/app/steps.js | 327 |
| workshop/js/canonical.js | 32 |
| workshop/js/clock.js | 42 |
| workshop/js/components.js | 485 |
| workshop/js/crypto.js | 54 |
| workshop/js/fixture.js | 209 |
| workshop/js/ledger.js | 119 |
| workshop/js/models.js | 167 |
| workshop/js/prng.js | 152 |
| workshop/js/scenarios.js | 218 |
| workshop/js/service.js | 115 |
| workshop/package.json | 0 (17 bytes, content {"type":"module"} with no trailing newline, so wc -l counts 0 lines) |
| workshop/tests/README.md | 49 |
| workshop/tests/parity-report.txt | 23 |
| workshop/tests/parity.js | 367 |

### Study Lab state (~/workspace/study-lab/, local only, never committed)

Verified unchanged by this pass (all scheduler work ran on copies in /tmp):

| Item | State on 2026-10-13 |
|---|---|
| workshop_ingest.py | 312 lines. Validates a workshop session export (validate_export), appends records under the workshop namespace of state.json, enforces prediction immutability and record_id de-duplication, forces delayed recall results to invalid when the cue was shown first, and refreshes the Workshop section of progress.md. |
| state.json.bak-2026-10-13 | Backup taken before the namespace change, 37690 bytes, dated 2026-10-13. |
| study_lab.py.bak-2026-10-13 | Backup taken before its change, 5433 bytes, dated 2026-10-13. |
| study_lab.py | 140 lines. Change versus its backup: a card_states() helper that only counts digit keyed entries as cards, so the workshop namespace is never treated as card state, and the progress totals now use it. |
| state.json | 38878 bytes. Top level holds the 450 card entries plus a workshop namespace: schema_version 1; attempts, predictions, outcomes, diagnoses, teach_backs and transfer_tests lists, all empty (0 records); anchor_status_history with 5 entries (anchors A to E, status approved, wording_version v1-approved, date 2026-10-13, source docs/workshop/memory-anchor-spec.md); recall entries for A to E, each step 0, due 2026-10-13, history empty. The due date is the namespace seeding date: a fresh anchor starts due immediately so its first checks can be introduced, exactly like a new card. See the Scheduler Verification section. |
| progress.md | 28 lines. Gained a Workshop section listing Attempts 0, Predictions 0, Outcomes 0, Diagnoses 0, Teach-backs 0, Transfer tests 0, and Recall by anchor A to E, each step 0, due 2026-10-13. The card ledger sections above it are unchanged in content. |

### Phase 1 commits

All commits after the owner approval commit a29973dccc73b5224f8fef611e6da3c3d65bb6eb ("docs(workshop): record owner decision, Phase 1 approved as scoped (2026-10-13)"), in order. Author for every commit: samuelankrah, email 142953932+samuelankrah@users.noreply.github.com (the noreply address recorded in the repository git log).

| Commit | Date (UTC) | Subject |
|---|---|---|
| 84ee219b0142de40c5e07796c7b52c67de26a283 | 2026-10-13 13:19:42 | workshop: JS decision engine with fixture parity (scenario-contract-v1) |
| 674deda745b4686f52c5dd46d08280a4b77fc45a | 2026-10-13 13:21:25 | workshop: parity harness for AT-05 (scenario-contract-v1) |
| bb0619e073099817fe3456ba791231733da036fe | 2026-10-13 13:21:41 | docs(workshop): reconcile anchor schema meaning length with approved wording |
| 6fbcad623eeea2bb54c9ff7d0fc1d880f7173519 | 2026-10-13 13:23:55 | workshop: app state core (run store, prediction gate, session export) |
| be6ac28ebb0421311e18409bd1d66dbd28251dec | 2026-10-13 13:25:55 | workshop: phone-first UI, eight screens, anchors, accessibility |
| 4ffafb091ccbc26f42c7b1bd589b24400e92ab69 | 2026-10-13 13:30 (approx) | workshop: give summary disclosures the 44px minimum target size (acceptance defect D-01) |
| 592c40a5ce7c556c4add67c3ed2fd821201e7fd4 | 2026-10-13 | ci: publish workshop to GitHub Pages |

## Deployment

Owner go recorded: Samuel directed publication to GitHub Pages on 2026-10-13. Full record: docs/workshop/deployment-note.md.

- Workflow: .github/workflows/pages.yml (commit 592c40a), triggering on pushes to main touching workshop/** or the workflow file, and on workflow_dispatch. It uses configure-pages with enablement, upload-pages-artifact with path workshop, and deploy-pages, with permissions contents read, pages write, id-token write.
- Intended URL: https://samuelankrah.github.io/autonomous-trust-platform/
- Observed outcome: NOT LIVE. Repeated curl fetches of the URL from about 13:46 UTC to 13:49 UTC on 2026-10-13 (and a parallel set of 14 fetches between 09:54 and 09:56 America/New_York) all returned HTTP 404 with the GitHub Pages "Site not found" page. The CSS and JS asset checks could not be performed because the root never returned 200.
- What cannot be determined from here: whether the workflow run failed at the configure-pages enablement step or never triggered. Git access from this environment is an SSH deploy key only, with no API token, so Actions runs are not inspectable.
- Best-supported explanation: Pages has never been enabled on this repository, and a push-triggered workflow token commonly cannot enable it alone. The recorded fallback is a one time owner action: in the repository Settings, under Pages, set the build and deployment Source to "GitHub Actions"; the existing workflow should then deploy on the next qualifying push or a manual dispatch.
- Consequence inside the workshop copy: the page footer (index.html line 250) says the workshop "is not deployed". As of this report that remains accurate in effect (nothing is reachable), but the sentence predates the Pages attempt and should be revisited when the site goes live.
- Visibility fact: the repository is public, so once live, anyone with the link can reach the site. There is no sign-in or access control.

## (g) Known limitations, stated plainly

1. Not live on GitHub Pages. The publishing workflow is committed and pushed, but the site does not come up; see the Deployment section. Until the owner enables Pages in the repository Settings, the workshop is reachable only by serving the repository locally.
2. ES modules require http serving. The workshop must be served over http (for example python3 -m http.server from the repository root, then open /workshop/). Opening the files directly from disk with a file:// address will not work.
3. Signatures and ledger hashes in the JavaScript engine are deterministic stand-ins. Their values are outside parity by contract: the scenario contract compares signature_present and the presence of hash field names, never signature values, key material or hash values. Parity under scenario-contract-v1 is evidence about decision behaviour and trace shape only, not about cryptographic strength.
4. Bypass attempt outcome records use decision_state "NONE", because the engine returns no decision for the bypass scenario (the fixture decision is null). main.js outcomeOf() maps a null fixture decision to the string "NONE", and that is what the session export records for a bypass run.
5. Session state lives in page memory until exported. Runs, predictions, recall checks and teach-backs exist only in the open page. Reloading the page loses them. They reach the Study Lab ledger only when the learner exports the session JSON and that file is ingested with workshop_ingest.py.
6. Delayed recall awaits Samuel. The delayed stages on the fixed ladder cannot complete inside a build session. They are scheduled work for Samuel on the due dates shown in Study Lab (see section (e), item M-05, and owner decision item OD-1 on the ladder's first interval).
7. Device testing awaits Samuel. The three target device matrix with TalkBack and VoiceOver at 200 percent text scaling has not been run (see section (e), item M-02). Until it runs, AT-02 is not fully passed. Defect D-01 is resolved and is not an open item against it.
8. Learner tests await Samuel. AT-01 has not been run and is not marked passed. The learner halves of AT-03, AT-04 and AT-06 are likewise outstanding, per the procedures in section (e).

## Final git state

- Main before this report's commits: 592c40a5ce7c556c4add67c3ed2fd821201e7fd4 (the Pages workflow commit). HEAD equals origin/main at that point, working tree clean.
- The pre-fix state referenced by the original acceptance draft was be6ac28ebb0421311e18409bd1d66dbd28251dec; the D-01 fix is 4ffafb091ccbc26f42c7b1bd589b24400e92ab69.
- This report was introduced in commit fe3e0fc148003b222e0f3e881063e72facd47d8e, immediately after the evidence commit 34a7fe9. This line was completed by the commit immediately following fe3e0fc, which changed nothing else; run git log -1 for the final main state.
- Machine checks for this edition ran against the tree of 592c40a; the report and evidence commits that follow change only documentation and evidence files, never workshop code or fixtures.
