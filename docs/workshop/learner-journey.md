# Learner Journey: The Payments Report Request

Status: DRAFT for owner approval, Phase 0 design document, not an implementation authorization.

## Purpose in plain words

This is a one page map of how a learner travels through a single request, from first sight to being able to teach it back. The same request, the same rules, and the same outcomes are used at every level. Only the depth changes.

Primary learner: Samuel, including when he is a beginner in a subdomain (a narrower area inside a larger field). Future public learners are secondary.

## The scenario, grounded in the reference engine

A workload (a running piece of software doing a job) asks to read a protected report, and the system must decide whether to allow it, and then enforce that decision.

Engine grounding, stated exactly as the reference engine performs it:

- Workload path: payments-reporter. Principal (the named actor the workload acts for): the reporting job.
- Protected resource: /reports/quarterly. Action: READ.
- In plain workshop language, this is the payments report request: a workload requests READ on the quarterly reports resource. Any shorthand label such as payments report must map to this exact resource and action, and must not imply a different resource in the engine.
- Conceptual component map (the parts and their roles): workload, identity (proof of who the workload is), grant (permission given by an authority source, here finance-control), attestation evidence (proof about the workload, checked for freshness), decision point (the function that evaluates identity, grant, and attestation together), enforcement point (the gate that acts on the decision before the protected resource), protected resource, evidence ledger (the append-only, hash-chained record, meaning each entry is linked to the previous one so changes are detectable).
- This component map is not the runtime event order. The stage sequence for any run comes from that scenario's fixture (the ordered evidence event types recorded by the reference engine). Setup events such as identity issued and grant given precede the request flow, the decision precedes enforcement, and failure scenarios stop or branch exactly where the engine does, per the fixture.
- Attestation freshness is judged against this lab's own policy setting, the synthetic 300 second lab constant. That setting is a lab policy, and it is not a universal measure of how trustworthy a workload is.
- Attestation evidence is proof about the workload, and it is not identity and it is not authorization.
- Possible decisions: PERMIT (allowed), DENY (not allowed), INDETERMINATE (cannot be decided safely from the evidence available).
- Possible enforcement results in the engine: ALLOWED, DENY, DENY_INDETERMINATE (the enforcement result when the decision is INDETERMINATE), REJECTED, and BYPASS_BLOCKED.
- Freshness threshold for attestation in this lab: 300 seconds, a synthetic lab constant, labeled non-normative (not an official rule for real systems).
- Revocation in this lab: a seeded list (a prepared list of withdrawn grants).
- The happy path: valid identity, valid grant, fresh attestation gives PERMIT, enforcement ALLOWED, and the protected operation runs, with correlated evidence in the ledger.

No level of this journey adds a capability the engine does not perform. In particular, there is no credential rotation (replacing keys or secrets on a schedule), no policy editing (changing the rules inside the journey), and no dependency outage scenario. Those are not in the engine and are not in this journey.

## Mandatory mechanics at every level

These mechanics apply everywhere, at all three levels, with no exceptions:

1. Prediction before disclosure: The learner states a prediction, in words, before any outcome is revealed. The interface must not show the decision or enforcement result first. The recorded prediction is immutable once recorded, and it is bound to the run configuration, namely the scenario, the single manipulation applied, and the scenario contract version. Changing the manipulation after predicting starts a new run with a new prediction, and a prediction from a prior run never carries over.
2. Step-through run with pause-and-inspect: Every run is stepped through one stage at a time, with a pause at each component where the learner can inspect state. Running everything at once without pauses (run-all only) does not satisfy the journey.
3. Teach-back at the end of the journey: The journey ends only when the learner explains the whole request, and at least one failure, in their own words.

## Level 1: Explore

Goal: See the parts, hear the story, touch one thing at a time.

- Plain words first: Every component is introduced by what it does for the request, before any technical name is used. Any shortened technical term is expanded in plain words at first use.
- Automotive analogy (a comparison using a car and a workshop, used to make the parts familiar before the precise terms): The workload is the driver arriving with a job to do. The identity is the driver proving who they are. The grant is the written authorization from the manager, naming what this driver may do. The attestation evidence is a recent inspection note for the vehicle, with a time on it. The decision point is the service desk that checks all three together and issues a signed work order. The enforcement point is the bay gate that checks the work order before letting the vehicle through. The protected resource is the bay and the report inside it. The evidence ledger is the workshop logbook where every check and outcome is written down in order. Limits of this analogy are named as they arise: a car analogy does not capture signing, binding, or revocation checking, and the journey says so rather than stretching it.
- Bridge note on the analogy: The analogy is a memory aid only. In the actual model, the grant is not a simple note from a manager: it carries scoped delegated authority (a bounded permission from an authority source, for this resource and action). The enforcement point does not merely glance at a work order: it checks a cryptographically protected decision that is bound to this specific request.
- Story mode: The happy path is told as a short story, one event at a time, following the happy path's event order from its fixture (the ordered evidence event types recorded by the reference engine for the happy path scenario, not a universal pipeline): identity issued, grant given, identity validated, revocation checked, grant validated, attestation appraised, decision made, protected operation run (only on PERMIT), enforcement outcome recorded.
- One action at a time: The learner advances one step, inspects, and only then advances again. No simultaneous changes.
- Exit condition: The learner can name each component purpose in plain words and predict the happy path outcome before running it.

## Level 2: Operate

Goal: Change things, predict, watch what breaks, find out why, and put it right.

- One fault per run, period: Each run carries exactly one of the five supported manipulations listed below. No run carries more than one.
- Guided manipulation first, then free manipulation: The learner first follows guided faults, one at a time, then moves to free manipulation. Free manipulation means the learner freely chooses which one of the five supported manipulations to apply to a run, never a combination. Combinations are not supported, because the engine and the contract define isolated single-fault scenarios only. In both phases, the available manipulations are limited to the five contract-supported manipulations listed below. Nothing else can be changed.
- The five manipulations, and only these five:
  1. Revoke the grant: Place the grant on the seeded revocation list. Expected engine behavior: decision DENY, reason names revocation, operation not invoked.
  2. Age the attestation: Advance the lab clock past the synthetic 300 second lab threshold so the attestation is stale, with identity and grant fresh. Expected engine behavior: decision INDETERMINATE, enforcement DENY_INDETERMINATE, operation not invoked.
  3. Tamper with a decision: Alter a claim in the signed decision after signing (in the engine scenario, the resource is changed). Expected engine behavior: enforcement REJECTED, reason names the signature, operation not invoked.
  4. Replay a decision: Present a genuine decision, bound to one request, for a different request. Expected engine behavior: first use ALLOWED, replay REJECTED, reason names the binding.
  5. Attempt a bypass: Try to reach the protected resource directly with no decision. Expected engine behavior: BYPASS_BLOCKED, attempt recorded in the ledger, no operation.
- Prediction required before any outcome is revealed: Before each run, the learner states the predicted decision and the predicted enforcement result, in words. The outcome stays hidden until the prediction is recorded. The recorded prediction is immutable once recorded, and it is bound to the run configuration, namely the scenario, the single manipulation applied, and the scenario contract version. Changing the manipulation after predicting starts a new run with a new prediction, and a prediction from a prior run never carries over.
- Break, diagnose, repair cycle: Break means introduce one fault, and only one fault, in a run. Diagnose means pause in the step-through, inspect the component states and the trace, and name the fault and the stage that caught it. Repair is always performed as a new run whose configuration is a reset clone of the happy path baseline with the single fault removed. The failed run is never edited, and its trace and ledger entries are preserved as evidence. Repair is defined per fault as follows:
  - Revoked grant: The new run's grant is absent from the revocation list.
  - Stale attestation: The new run issues attestation fresh (the clock is not advanced).
  - Tampered decision: The new run presents the original untampered decision.
  - Replayed decision: The new run obtains a fresh decision for the second request through the normal decision step and enforces it. The original replay rejection stays preserved as evidence, and re-presenting the old decision is not the repair.
  - Bypass attempt: The new run goes through the normal request path (decision, then enforcement) instead of direct access.
  - Post-repair comparison: The rerun must show the same resource, action, and grant scope (compared as structured values) as the happy path baseline, with no broader authority (without giving the workload any permission it did not have in the happy path).
- Exit condition: The learner has completed break, diagnose, and repair for each of the five fault classes, with a recorded prediction for each.

## Level 3: Architect

Goal: See the contracts, the reasons, and the limits behind the same behavior.

- Contract and requirement identifiers: Each stage and check is labeled with its requirement identifiers (short codes that link a behavior to its written requirement). Examples grounded in the engine: identity without authority exercises AZ-002 (identity is not authorization) and AZ-019 (decision states); revoked delegation exercises AZ-015; stale attestation exercises AZ-011, AZ-012, and AZ-022 (INDETERMINATE never becomes PERMIT); replay exercises ENF-003 and CTL-010 (enforcement and control codes for request binding); tampering exercises ENF-008 and CTL-005 (source validation); bypass exercises ENF-002, ENF-006, CTL-006, and CTL-007. The full mapping lives in the engine scenarios, and this level shows it rather than summarizing it away.
- Evidence ledger inspection: The learner opens the ledger for a request and checks correlation: the same decision identifier links the decision entry and the enforcement outcome entry, entries appear in the engine sequence, and a bypass attempt or a revocation check is visible as its own entry.
- Architecture Decision Record rationale: An Architecture Decision Record (a short written record of a design choice, its context, and its reasons, shortened to ADR after this first use) is shown beside the relevant stage, so the learner can read why the boundary sits where it does. Reading an ADR is never required to start the journey (see Level 1), it is an Architect level depth addition.
- Counterexamples: Each fault is paired with its counterexample from the memory anchor specification: for example, a genuine, fresh, correctly signed decision that still fails on replay, which disproves the idea that genuine alone means usable anywhere.
- Simulation versus reference labels: Every screen and trace at this level carries a visible label distinguishing simulated (modeled in the workshop interface) from reference-tested (produced by the verified reference engine in labs/decision-service). See the acceptance tests for how this labeling is gated. No label may claim production behavior or real enforcement (see the honest labels test).

## Mapping: Journey stages to the 8-step loop

The 8-step loop is: discover, inspect, manipulate, predict, run and observe, break and diagnose, repair, teach back. Every journey stage maps to it as follows:

| Journey stage | Loop steps covered | How |
|---|---|---|
| Explore: component story walk | Discover, Inspect | Parts identified one at a time, each inspected in plain words before moving on |
| Explore: happy path step-through | Predict, Run and observe | Prediction recorded first, then stepped run with pause-and-inspect at each component |
| Operate: guided fault | Manipulate, Predict, Run and observe, Break and diagnose | One of the five manipulations applied, prediction recorded, stepped run, fault named from the trace |
| Operate: free fault choice | Manipulate, Predict, Run and observe, Break and diagnose | Learner chooses any one fault (exactly one of the five, never a combination), same prediction and diagnosis discipline, no new manipulation types |
| Operate: restoration run | Repair | Repair as a new run: a reset clone of the happy path baseline with the single fault removed, failed run preserved as evidence, happy path confirmed, and resource, action, and grant scope matching the baseline with authority not broadened |
| Architect: ledger and contract review | Inspect, Break and diagnose | Ledger correlation and requirement identifiers inspected, counterexamples used to test explanations |
| Journey close | Teach back | Learner explains the request and one failure in own words, including what each memory cue captures and omits |

Note on loop order in practice: Manipulate comes before predict in the loop list, but in this journey the prediction for a given run is always recorded after the manipulation is chosen and before the run reveals any outcome. Prediction before disclosure is the binding rule, and no stage may invert it.

## What this journey does not do

- It does not require any sign-in or infrastructure (outside systems or accounts) for the first learning journey.
- It does not present lab constants, including the synthetic 300 second lab freshness threshold, as real world rules.
- It does not claim production behavior. The engine is a lab instrument with synthetic identities, grants, and evidence, labeled not for production.
