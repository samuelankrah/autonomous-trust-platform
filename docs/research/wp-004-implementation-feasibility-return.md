# WP-004 Return: Implementation Feasibility

**Package ID:** `WP-004`
**Owning Specialist Project:** Trust Platform: Implementation
**Task Date:** 2026-10-06
**Status:** Returned (submitted for Control Plane semantic review)
**Gating Condition:** Tasks 2 through 7 accepted, recorded as satisfied (per `docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 45)

## Evidence-State Label

**The entire return below carries the evidence state: Research Finding.**

A working lab is not production readiness. Lab success closes no deferred decision (`DD-001`, `DD-008` remain open). Feasibility findings are inputs to the Task 9 evaluation framework and the Task 10 component mapping (as constraints, not selections), per `docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 51.

**Vendor neutrality:** no product, vendor, cloud, or orchestration platform is named, shortlisted, or endorsed anywhere in this return. "SPIFFE-ID-shaped" refers only to the string shape of a workload identifier (a URI of the form `spiffe://trust-domain/path` as described in the demo brief); using the shape models the namespace requirement, it does not adopt or endorse SPIFFE or any implementation, and it does not close `DD-001` or any WP-002 mapping question.

**Demo under assessment (the bounded demo decision-service app):**

An HTTP service that (a) issues short-lived SPIFFE-ID-shaped workload identities, (b) issues bounded delegation grants, (c) produces signed policy decisions with provenance and freshness fields, (d) exposes an enforcement stub that validates those decisions before invoking a protected operation, (e) appends all security-relevant events to an append-only evidence ledger, and (f) ships a CLI scenario walkthrough covering three scenarios: happy path (PERMIT), revoked delegation (DENY), and stale attestation (INDETERMINATE).

**Baseline ground for every feasibility claim:** `labs/sprint-02-task-05-authorization/` (`authorization_lab.py`, `http_lab.py`, `lab_client.py`, `policy.json`, `tests/`). The baseline was executed as evidence for this return: `python3 -m unittest discover -s tests` from that directory, 13 tests, all passing; a live HTTP smoke test of the `permit` scenario returned HTTP 200 with a signed decision artifact and correlated ledger evidence.

---

# 41.1 Candidate Component Feasibility

## Requirements

| ID | Requirement (traced to accepted inputs) |
|---|---|
| FR-WP4-001 | The demo must exercise one or more logical components per material architecture role without collapsing the logical role distinctions required by Task 2 cross-role constraints and Task 5 sections 70-72, per `CM-003` in `docs/sprints/sprint-02-task-10-component-mapping-and-selection-gate.md`, section 5. |
| FR-WP4-002 | Decision semantics in the demo must preserve `PERMIT`, `DENY`, and `INDETERMINATE` as distinct states, per Task 5 `AZ-019` and the Task 10 Q7 exit question (`docs/sprints/sprint-02-task-10-component-mapping-and-selection-gate.md`, section 29). |
| FR-WP4-003 | Delegation artifacts in the demo must be explicitly bounded (source, delegator, scope, constraints, expiration, revocation basis) and must not amplify authority, per `SI-20`, `SI-21`, `SI-22`, `SI-23`, and Task 5 `AZ-010` (see also `docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 53, WP-004 primary invariants). |
| FR-WP4-004 | The demo must not silently increase authority under failure or uncertainty, per `SI-31` and Task 6 `FM-01` (see `docs/architecture/failure-model.md`, section 93, and `docs/sprints/sprint-02-task-10-component-mapping-and-selection-gate.md`, section 23, `FR-xxx` allocation). |
| FR-WP4-005 | Audit evidence in the demo must preserve principal, runtime, and delegator context as separate fields and must correlate decisions to enforcement outcomes, per `SI-35` and Task 5 `CTL-008` (`docs/sprints/sprint-02-task-07-invariant-verification-matrix.md`, section 13, SI-35 trace). |
| FR-WP4-006 | Security-relevant trust-state changes exercised in the demo (key rotation for scenario runs, revocation publication) must pass through an attributable, auditable path, per `SI-38` (`docs/sprints/sprint-02-task-07-invariant-verification-matrix.md`, section 13, SI-38 trace). |
| FR-WP4-007 | The demo must not treat authorization as implemented without effective enforcement, per `SI-30` (Task 10 section 24; Task 7 section 11 SI-30 trace). |

## Evidence

**What already exists and passes (straightforward, demonstrated by execution):**

The baseline `labs/sprint-02-task-05-authorization/` already demonstrates a decision service (`AuthorizationDecisionFunction`) and enforcement stub (`EnforcementPoint`) in a single process HTTP lab, with three distinct decision states and HTTP status mapping (`INDETERMINATE` returns 503, `DENY` returns 403), decision-source validation at the enforcement point (`ENF-008`), decision-to-request binding that rejects replayed decisions, policy-version freshness checks, and complete mediation of an alternate path. Evidence: 13/13 unit tests pass (6 authorization vertical-slice tests in `tests/test_authorization_lab.py`, 7 HTTP enforcement tests in `tests/test_http_lab.py`), plus a live `lab_client.py --scenario permit` smoke test returning HTTP 200 with a signed `decision_artifact` and per-request correlated evidence. Per-role classification for the demo:

* **LC-07 (Policy Administration + Authorization Decision Function) and LC-08 (Enforcement): straightforward.** The baseline already co-locates them in one HTTP process while preserving logical distinction: separate classes, separate ledger event types (`authorization.decision` vs `enforcement.outcome`), separate failure states (ADF `INDETERMINATE` on unavailable dependency vs enforcement `DENIED` on unbound decision). This satisfies `CM-003` and Task 5 sections 70-71 directly. Extending the decision function to consume attestation freshness and revocation state is configuration and small logic, not new mechanism.
* **LC-06 (Delegation Issuance) and LC-05 (Delegation Governance): straightforward as models.** The baseline `Authority` artifact is already a signed, expiring, scope-bound grant (`source`, `delegator`, `delegate`, `workload`, `resource`, `action`, `expires_at`). Adding explicit revocation basis and redelegation restrictions is bounded dataclass work. The non-amplification check (`GrantedAuthority ⊆ DelegableAuthority`) is a field-subset comparison, configuration of existing mechanics.
* **LC-09 (Audit and Evidence): straightforward with one new mechanism.** The baseline `EvidenceLedger` is in-memory and request-correlatable but not append-only or tamper-evident. Making it a hash-chained append-only JSONL store is a small new mechanism (each record carries the hash of its predecessor; a verification step re-computes the chain after each scenario). Required to support `SI-35`/`SI-38` claims in the demo; the design is well within stdlib.
* **LC-02 (Identity Validation): straightforward.** `verify()` on HMAC-signed claims with audience/namespace/freshness checks is demonstrated in `http_lab.py` (401 on unverifiable identity). SPIFFE-ID-shaped strings (`spiffe://atp-lab/payments-reporter`) require only a format rule and a trust-domain match against local acceptance policy; this models the WP-001 namespace requirement without adopting SPIFFE.

**Difficult but feasible within bounded-lab scope (needs new harness mechanics):**

* **LC-01 (Identity Issuance) as SPIFFE-ID-shaped minting: difficult.** The string shape and 5-minute expiry are trivial; the hard parts are architectural, not mechanical. Bootstrap binding assurance (ADR-0004: what evidence justifies initial binding, and downgrade prohibitions) and trust-domain lifecycle rules are open WP-001 questions, and the demo must take its binding rules as declared lab configuration, never as answers. Feasible only if the demo labels those rules as synthetic placeholders with explicit `PLACEHOLDER (WP-001)` markers, so a passing lab does not read as a resolved identity decision. Rating: feasible, difficulty medium-high.
* **LC-03 (Runtime and Attestation Evidence), stale-attestation scenario: difficult.** The baseline lab has no attestation slice (`README.md` "Known limits" lists "attestation as an authorization input" as future). The demo's stale-attestation scenario requires: an attestation evidence artifact with an issuance timestamp, a declared freshness threshold, a trusted-time source, and a decision rule that yields `INDETERMINATE` (not `DENY`) on stale evidence per Task 6 failure semantics (`FR-007` class). The threshold values are open blocking questions (failure-model section 99, questions 4 and 14), so the demo must use declared synthetic thresholds. Additionally, `FR-024` (trusted-time failure: skew, rollback, unavailability) means the clock itself must be injectable to test the freshness logic at all. All of this is buildable in stdlib, but it is the largest new mechanism in the demo (attestation artifact + appraisal stub + injected clock). Rating: feasible, difficulty high, and the highest-cost item.
* **Revoked-delegation scenario: medium difficulty.** Requires an explicit revocation state store seeded deterministically per scenario, plus the `FR-012` rule that revocation state `unknown` is distinct from `not revoked`. The demo can implement this as a scenario-seeded revocation list consumed by the delegation validation path; the baseline already separates artifact validity from authority validity (`Authority` signature check vs grant-match check), so revocation slots into the existing seam. Unknown-state handling (disconnected revocation evaluation) is out of the three-scenario scope and recorded as a residual.

**Infeasible or out of scope for this bounded demo (recorded, not attempted):**

* Genuine hardware-backed attestation or hardware-backed binding (LC-03 real-world form). The lab can model attestation evidence semantics only.
* Cross-domain federation acceptance (LC-11, ADR-0003). Foreign-domain material can be presented in a scenario, but the local acceptance rules that make it meaningful are open WP-001/WP-002 questions.
* LC-04 (Attestation Appraisal) beyond a freshness/timestamp stub; endorsement and reference-value lifecycle belong to WP-002's unresolved territory.
* LC-10 (Recovery) and LC-11 (Trust Coordination); LC-10's FR-046/FR-053 semantics and LC-11's ADR-0008 coordination constraints are separate vertical slices.
* Real PKI key management. The baseline's per-role HMAC keys model key separation (SI-37) but not public-key issuance, crypto-agility (`IV-012`), or key-compromise semantics. The demo inherits this limit honestly.

## Tradeoffs

* **Lab fidelity vs cost:** HMAC-signed artifacts model integrity and binding at near-zero cost, but they do not model asymmetric issuance, key distribution, or compromise semantics. Upgrading to stdlib-supported asymmetric primitives (none in stdlib for signing) would pull in external dependencies and violate the baseline's stdlib-only containment; the honest tradeoff is to keep HMAC and record crypto realism as an explicit fidelity gap rather than spend the containment budget.
* **Three-scenario scope vs Task 6 breadth:** happy-path, revoked-delegation, and stale-attestation scenarios demonstrate the decision/enforcement/evidence spine plus one failure class each for delegation and attestation. They do not cover compound degradation (`FR-041`), enforcement-point failure (`FR-015`), or audit-unavailable (`FR-016`); adding those is linear cost per scenario in the existing harness, but each new scenario needs its own `FR-xxx` trace and pass criteria, so scope should grow only after the spine passes.
* **Synthetic attestation threshold vs blocking-question integrity:** the demo needs a number for "stale" to run at all. Using a declared synthetic threshold labeled `LAB-CONFIG` keeps the lab runnable without answering failure-model section 99 questions; the risk is that a reader mistakes the constant for an architecture answer. Mitigation: name the constant `LAB_SYNTHETIC_FRESHNESS_SECONDS`, document it as non-normative in the scenario manifest.

## Open Residuals

1. What attestation freshness thresholds and re-attestation triggers the architecture requires (failure-model section 99, questions 4 and 14). Missing evidence: accepted answers or a Control Plane deferral per Task 10 section 28.
2. Which operations require fresh revocation state vs tolerate bounded caching (failure-model section 99, questions 3 and 7). The demo models only explicit revoked-list membership for the denied scenario.
3. Whether the Task 9 gate will require asymmetric signatures for the "cryptographic proof" verification class (`IV-012`); the HMAC model satisfies only the bounded-lab evidence shape.
4. Real policy composition: the baseline uses one static `policy.json`; multi-policy, version-divergent, and policy-distribution (`EDGE-007`, `FR-013`) behavior is untested and out of scope.

## Explicit Non-Decisions

* `DD-001` (concrete component mapping) stays open: the demo groups code into LC-shaped modules for illustration only; it does not map any component to a product or technology.
* `DD-008` (enforcement mechanism) stays open: the enforcement stub demonstrates enforcement semantics, not a selected mechanism.
* SPIFFE-ID-shaped identifiers are a namespace-shape model, not adoption of SPIFFE or SPIRE; WP-002's SPIFFE/SPIRE mapping remains the authoritative evaluation input.
* No attestation standard, delegation protocol, or policy language is selected, shortlisted, or recommended.

---

# 41.2 Lab Prerequisites

## Requirements

| ID | Requirement (traced to accepted inputs) |
|---|---|
| FR-WP4-008 | Labs must follow the baseline containment discipline: synthetic keys, explicit non-production scope, automated tests (`docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 41.2). |
| FR-WP4-009 | Trust anchors and key material must be handled so that lab evidence does not create reusable credentials: keys synthetic, labeled, per-role separated, and never persisted outside the lab's ephemeral state, per Task 4 `AUTH-001` through `AUTH-011` custody expectations as referenced in Task 10 section 21, and `SI-37` (security authorities architecturally distinguishable, Task 7 section 13). |
| FR-WP4-010 | Clock and freshness infrastructure must support deterministic evaluation and failure testing of freshness bounds, per Task 6 `FR-024` (trusted-time failure class, Task 10 section 23) and the freshness requirements of Task 3 `EDGE-003`/`EDGE-004`. |
| FR-WP4-011 | Network and dependency controls must confine the lab: loopback-only networking, no outbound traffic, stdlib-only dependencies, per the baseline (`http_lab.py` binds `127.0.0.1:8080`; `README.md` "Standard library only"). |
| FR-WP4-012 | Execution must be deterministic enough to distinguish a reproducible result from an environment accident (see 41.5), which requires seeded randomness and captured configuration. |
| FR-WP4-013 | Evidence collection hooks must emit per-request correlated decision, enforcement, and outcome records sufficient for Task 7 evidence shapes, per Task 5 `CTL-008` and `EVD-xxx` traceability (`docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 42, Task 7 inputs). |

## Evidence

The baseline lab was inspected and partially executed for this return:

* **Keys:** three module-level synthetic byte strings (`AUTHORITY_KEY`, `IDENTITY_KEY`, `DECISION_KEY`) in `authorization_lab.py`, each labeled "lab-...-not-for-production". Per-role key separation is already the discipline `SI-37` needs modeled. Prerequisite for the new demo: generate keys fresh per scenario run via `secrets` (never commit key material to evidence files), record only the key identifier and algorithm in evidence per `IV-012`, and keep the docstring/header banner stating synthetic non-production scope on every lab module.
* **Clock:** baseline uses `datetime.now(UTC)` directly (wall clock). This is the one prerequisite the baseline fails: freshness tests and the stale-attestation scenario cannot be deterministic against wall clock, and `FR-024` failure classes (skew, rollback, unavailability) are untestable without an injectable clock. Prerequisite: a `Clock` abstraction injected into issuance, validation, and decision functions; scenario manifests declare `clock_start` and per-scenario offsets (including a frozen-clock fault for the stale-attestation path). Analysis, not execution: this is a bounded refactor of `now()` call sites.
* **Network/dependencies:** baseline conforms fully (loopback bind, stdlib-only, 13/13 tests pass with no installs). The demo inherits this; the CLI scenario runner must not introduce dependencies beyond stdlib.
* **Determinism:** baseline uses `secrets.token_hex(8)` for request, decision, and authority IDs, which is non-reproducible by design. Prerequisite: a seedable ID generator (e.g., `random.Random(seed)` producing hex IDs, or a counter), with the seed captured in the scenario manifest (see 41.5).
* **Evidence hooks:** baseline `EvidenceLedger` emits `authorization.decision`, `enforcement.outcome`, `resource.operation`, `resource.bypass_attempt`, and HTTP-layer events, with `for_request()` correlation and a `decision_id` shared across events (the `CTL-008` pattern). Prerequisite for the demo: extend hooks to the new seams, revocation checks (`delegation.revocation_check`), attestation appraisal (`attestation.appraisal`), clock-fault injection (`lab.clock_fault`), and make the ledger write append-only JSONL with a per-record hash chain so that "append-only" is verified, not asserted.

## Tradeoffs

* **Injectable clock vs simplicity:** a clock abstraction touches every `now()` call site (issuance, expiry checks, decision `issued_at`, ledger timestamps). Cost is a one-time refactor; the alternative is keeping wall clock and losing both determinism and `FR-024` testability, which would make the stale-attestation scenario evidence worthless. The refactor is required.
* **Fresh key per run vs fixed lab keys:** per-run keys prevent any evidence artifact from doubling as a reusable credential and force the key-identifier discipline `IV-012` requires. Cost is small (keygen at scenario start, key IDs in the manifest). Fixed keys would be simpler but would let lab evidence leak working credentials into stored files.
* **Append-only verification vs ledger simplicity:** hash-chaining every record adds a post-scenario verification step and makes partial writes visible, at the cost of a slightly more complex ledger. An in-memory list (baseline) is simpler but cannot support any `SI-35`/`SI-38` reconstruction claim across runs. The chain is the cheaper way to make "append-only" checkable.

## Open Residuals

1. Whether scenario evidence files may retain HMAC signatures computed with per-run keys (signatures are useless without keys, but policy on retaining them should be stated; missing: a Control Plane lab-evidence handling note).
2. Trusted-time source requirements for the lab remain bounded by `FR-024`; the injected clock models time, not trust in time.

## Explicit Non-Decisions

* No key-management system, HSM class, or PKI product is selected or implied by the per-run key handling; it is lab hygiene, not a Task 9 input.
* No freshness threshold values are set as architecture answers (see 41.1 residual 1); the demo uses declared synthetic constants.

---

# 41.3 Integration Complexity

## Requirements

| ID | Requirement (traced to accepted inputs) |
|---|---|
| FR-WP4-014 | Role co-locations in the demo must preserve the logical distinctions of Task 2 cross-role constraints and Task 5 sections 70-72, per `CM-003` (`docs/sprints/sprint-02-task-10-component-mapping-and-selection-gate.md`, section 5). |
| FR-WP4-015 | Lab-to-lab integration must be possible at defined seams: Task 6 failure injection against the Task 5 authorization slice, per the failure-model testing sections (`docs/architecture/failure-model.md`, sections 91 and 92) and the Task 10 failure allocation (section 23). |
| FR-WP4-016 | Multi-lab scenarios must have an explicit dependency ordering so that evidence from one slice is a valid precondition for the next, per `WR-009` ordering discipline (`docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 9) applied within the demo. |

## Evidence

* **Practical co-locations (verified against baseline structure):** The baseline already co-locates LC-07 (ADF) and LC-08 (EnforcementPoint) in one process and one HTTP handler while keeping them logically distinct, which `CM-003` permits when decision semantics, enforcement semantics, failure states, and audit evidence remain distinguished; inspection of `authorization_lab.py` confirms separate classes, separate decision states (`INDETERMINATE` from the ADF vs `DENIED` from enforcement on unbound decisions), and separate ledger event types. The demo can additionally co-locate LC-01/LC-02 (issuance + validation) and LC-05/LC-06 (governance + issuance) in the same service process provided: separate key material per role (already the baseline pattern), separate ledger event types per role action, and, for LC-05/LC-06, code that keeps Authority Source, Delegator, and Delegation Issuer as distinct named entities (Task 10 section 18, LC-05/LC-06 constraints; `SI-23`). LC-09's ledger must remain the one component no actor controls alone: in a single-process lab this is modeled by the hash-chained append-only store plus an independent post-scenario verification step, which is honest modeling rather than real independence and must be labeled as such.
* **Task 6 failure injection seam (demonstrated pattern exists):** The baseline already implements one failure-injection control, the `X-Lab-Authorization-Dependency: unavailable` header in `http_lab.py`, which forces the ADF into `INDETERMINATE` (the `dependency-unavailable` client scenario). The demo generalizes this into a fault-injection interface: clock freeze/skew for the stale-attestation scenario (`FR-007`/`FR-024` classes), revocation-list seeding for the revoked-delegation scenario (`FR-011`/`FR-012` classes), and dependency-unavailability retained for the decision-service path (`FR-014`). Each fault maps to a Task 6 `FR-xxx` class and to a Task 7 negative test (`NT-031`-style: attempt the action the failure should forbid or defer), so the lab-to-lab integration point is a shared, named seam rather than ad-hoc hacking. Evidence: the baseline header mechanism works today (testable via `lab_client.py --scenario dependency-unavailable`); the generalization is analysis of a proven pattern.
* **Dependency ordering:** identity issuance must precede delegation grant materialization (the grant binds to the workload identity), which must precede decision evaluation, which must precede enforcement; revocation state and attestation reference inputs must be seeded before any scenario runs; the ledger must be initialized before the first event and closed (chain summary written) after the last. This ordering is a scenario-manifest declaration, enforced by the CLI runner, so out-of-order evidence cannot be produced silently.

## Tradeoffs

* **Single-process lab vs multi-service realism:** one process keeps the demo runnable, deterministic, and stdlib-only, but it cannot demonstrate real process-boundary or network-partition failure (`FR-051` split-brain is out of reach). Splitting services would buy partition realism at the cost of determinism, orchestration complexity, and a much larger evidence-correlation problem. For the three-scenario demo, single-process with logically distinguished roles is the right side of this tradeoff; `FR-051`-class questions are recorded as out of scope, not approximated.
* **Co-location honesty:** every co-location in the demo must carry its Task 10 section 18 risk note in the module docstring (e.g., LC-07/LC-08 shared-compromise evaluation is not performed by the lab). The cost is documentation discipline; the alternative is a lab that silently teaches that co-location is free, which `CM-003` forbids.
* **Fault-injection surface vs lab attack surface:** a generalized fault interface is itself a privileged path; in the lab it is acceptable because the lab is synthetic and loopback-bound, but the interface must be documented as lab-only (`X-Lab-` prefix convention) so the pattern is never mistaken for a production control.

## Open Residuals

1. How the demo's fault-injection seam should be versioned so future Task 6 slices (recovery `FR-045..FR-050`, emergency authority `FR-053..FR-057`) can plug in without rewriting the runner. Missing: a Control Plane decision on whether the demo runner becomes a shared lab harness or stays a one-off.
2. Whether LC-09's modeled independence (hash chain + separate verification) is sufficient evidence for Task 7's `SI-35` trace in a single-process lab, or whether a two-process minimum is required. Missing: Task 7 interpretation guidance.

## Explicit Non-Decisions

* No deployment topology is selected; single-process is a lab convenience, not an architecture recommendation (per `IN-002`/Task 2 topology-neutrality and Task 10 Q14).
* No component mapping beyond the demo's illustrative LC-shaped modules (`DD-001` stays open).

---

# 41.4 Observability Requirements

## Requirements

| ID | Requirement (traced to accepted inputs) |
|---|---|
| FR-WP4-017 | The lab must demonstrate decision-to-enforcement-outcome correlation sufficient for Task 7 verification, per Task 5 `CTL-008` (`docs/sprints/sprint-02-task-07-invariant-verification-matrix.md`, section 13; Task 10 section 29 Q12). |
| FR-WP4-018 | Failure states must be observable and distinct: `INDETERMINATE` must not be collapsible into `DENY` or `PERMIT`, per Task 5 `AZ-019`/`AZ-022` and Task 6 `FM-01` (no silent authority increase). |
| FR-WP4-019 | Evidence completeness must be checkable: required fields per event, closed per-request event sequences, and tamper-evident storage, per Task 3 evidence contracts (`EDGE-xxx` audit evidence) and Task 7 section 16 evidence shapes (`docs/sprints/sprint-02-task-07-invariant-verification-matrix.md`, section 5 traceability; IV-005 assurance-state discipline). |
| FR-WP4-020 | "The lab demonstrated the requirement" must be defined as instrumentation: stated pass criteria per scenario, assertions in code, and requirement-ID mapping, per `IV-002` and `IV-003` (positive tests at the required enforcement point; negative tests mandatory). |

## Evidence

* **Correlation (demonstrated):** `tests/test_authorization_lab.py::test_01` asserts the exact event sequence `["authorization.decision", "enforcement.outcome", "resource.operation"]` for one `request_id` and asserts every event carries the same `decision_id`. The demo's CLI runner must promote this from unit-test assertion to scenario-level check: after each scenario, the runner asserts the closed sequence exists and fails the scenario otherwise. The baseline `http_lab.py` additionally returns the evidence array in the HTTP response, which the CLI walkthrough can display as the observable artifact.
* **Failure-state visibility (demonstrated):** the baseline maps `INDETERMINATE` to HTTP 503 and `DENY` to 403, and every ledger event records the `reason` string alongside the state (e.g., "authority provenance cannot be verified"). The stale-attestation scenario's observable contract is therefore: decision state `INDETERMINATE`, reason naming the freshness failure, HTTP 503, enforcement `DENIED` with no `resource.operation` event. That is the full SI-31 observability requirement for one failure class, and the baseline proves the instrumentation pattern works.
* **Completeness checks (partially demonstrated, extended by design):** the baseline checks sequence shape and correlation IDs in tests. The demo adds: (a) per-event schema validation against a declared event schema (required fields per event type, including principal/workload/delegator as separate fields per `SI-35`); (b) closed-sequence enforcement, every `request_id` in the ledger must terminate in an `enforcement.outcome` event, an unterminated request is an evidence defect and fails the scenario; (c) hash-chain re-verification as a post-scenario step, so append-only storage is checked, not claimed.
* **Demonstration bar (defined as instrumentation):** each scenario in the CLI walkthrough declares, before running: the requirement IDs it exercises (e.g., revoked-delegation scenario maps to `AZ-003`-class provenance, `FR-011`/`FR-012`, `NT-031`-style negative test), the expected decision state, the expected enforcement outcome, and the expected evidence shape. The runner executes, asserts, and prints a per-scenario verdict with the mapped IDs. A scenario that passes on eyeball review of logs but has no assertion does not count as demonstration, per `IV-002`/`IV-003`. The CLI walkthrough is therefore a report over asserted checks, not a narration.

## Tradeoffs

* **Observability depth vs complexity:** per-event schema validation and hash-chain verification roughly double the lab's verification code relative to the baseline's test style. The alternative (log-and-eyeball) is cheaper but cannot satisfy `IV-005` (a test result must not be recorded as enforcement) because unasserted logs let any outcome be read as success. The instrumentation cost is the price of honest evidence.
* **HTTP response evidence vs ledger-only evidence:** returning the evidence array in the HTTP response (baseline behavior) makes the walkthrough vivid and debuggable, but it also models an information-exposure choice that a production design would scrutinize. Keep it as lab-only behavior with a docstring note; do not let the demo's convenience become an implicit interface contract.

## Open Residuals

1. The exact required-fields schema per event type is a Task 7 section 16 evidence-shape question; the demo must declare its schema as `LAB-SCHEMA-v1` and note that conformance to the accepted shape is a Control Plane review item, not a lab decision.
2. Negative-test catalog IDs (`NT-xxx`) for the new scenarios do not exist yet in Task 7 section 14; the demo can propose provisional `NT-` mappings but cannot mint accepted IDs.

## Explicit Non-Decisions

* No observability product, log pipeline, or SIEM-style capability is selected; the ledger is a lab instrument.
* The CLI walkthrough's display format is not a user-interface decision for any platform surface.

---

# 41.5 Reproducibility Requirements

## Requirements

| ID | Requirement (traced to accepted inputs) |
|---|---|
| FR-WP4-021 | Lab results must be reproducible: seeds, versions, and configuration captured so a result can be re-derived, per the Task 8 charter for this question (`docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 41.5) and `IV-005` assurance-state discipline (a result recorded without its provenance is not evidence). |
| FR-WP4-022 | Reproducible results must be distinguishable from environment accidents: the lab must have a defined procedure for telling "same cause, same effect" apart from "it worked on this machine once." |
| FR-WP4-023 | Lab evidence must be retained in a form sufficient for Control Plane review and Task 7 verification design, per `EVD-xxx` traceability (`docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 42, Task 7 inputs). |

## Evidence

* **Seeds:** replace the baseline's `secrets.token_hex` ID generation with a seedable generator for the demo (the baseline's nondeterminism is the concrete gap). Each scenario manifest declares `seed`, `clock_start`, and fault parameters (clock offset/freeze, revocation entries). Analysis: with the injected clock (41.2) and seeded IDs, a scenario run is a pure function of its manifest plus code version.
* **Versions:** every evidence file opens with a header recording: repository commit hash, `python3 --version`, `policy.json` version (baseline uses `"version": "2026-08-16.cycle-1"`), scenario manifest version, and the lab module versions. This is the minimum set that lets a reviewer answer "what exactly ran."
* **Configuration capture:** the scenario manifest (JSON) is the complete input declaration: scenario name, seed, clock parameters, fault-injection parameters, expected outcomes, and mapped requirement IDs. The manifest is copied verbatim into the evidence bundle, so the evidence is self-describing.
* **Reproducible vs accident (defined procedure):** (a) rerun-twice check: the same manifest run twice must produce byte-identical evidence except for fields explicitly declared volatile (none should be volatile once clock and IDs are seeded; signatures are deterministic over identical claims); (b) seed-variation check: the same scenario with a different seed must produce identical outcome patterns (`PERMIT`/`DENY`/`INDETERMINATE`, enforcement outcomes, event sequences) with only identifiers and timestamps-shifted-by-clock differing, proving outcomes depend on logic, not luck; (c) environment-accident signals are defined negatively: any dependence on wall clock, on port availability (bind conflicts if a prior run leaked), or on leftover state (state directory is wiped and re-initialized per run, and a pre-run cleanliness check fails loudly if the previous run's artifacts are present).
* **Retention:** per scenario run, retain the manifest, the append-only JSONL evidence with chain summary, the CLI walkthrough output, and the verification summary (pass/fail per asserted check with mapped requirement IDs). Retained under a lab results directory with the run's commit hash in the path. Retention scope is labeled as lab evidence for Control Plane review, not as production audit records.

## Tradeoffs

* **Reproducibility strictness vs iteration speed:** the rerun-twice and seed-variation checks add minutes to each demo run and require the injected clock and seeded IDs to be exactly right; during active development this is friction. The alternative is fast iteration with wall-clock and random IDs, which makes every result anecdotal and unreviewable. The workable compromise is a `--fast` developer mode (random IDs, wall clock) that is explicitly barred from producing evidence bundles: only seeded runs write to the results directory, enforced by the runner.
* **Byte-identical vs outcome-identical:** demanding byte-identical evidence is the strongest accident detector but brittle (any incidental field breaks it); demanding only outcome-identical evidence is robust but weaker. The two-tier procedure above (byte-identical on same seed, outcome-identical on varied seed) gets most of the detection value at acceptable brittleness, with the brittleness confined to same-seed reruns where it belongs.

## Open Residuals

1. Retention duration and storage location for lab evidence are unstated; a Control Plane lab-evidence retention note is missing (also noted in 41.2 residual 1).
2. Whether Control Plane requires the rerun-twice check to run in CI or accepts manual execution records; no lab CI convention exists yet for this repo.

## Explicit Non-Decisions

* No CI system, artifact store, or retention infrastructure is selected.
* Reproducibility mechanics do not select any technology; they constrain how the demo's evidence is produced and judged.

---

# Cross-Cutting Findings

## Feasibility Summary

The bounded demo is feasible within the baseline's containment discipline (synthetic keys, stdlib only, loopback HTTP, automated tests). The spine (LC-01-shaped issuance, LC-02 validation, LC-05/LC-06 delegation, LC-07 decision, LC-08 enforcement stub, LC-09 append-only ledger, CLI walkthrough) is straightforward to medium difficulty. The two cost centers are the injectable clock with seeded determinism (a prerequisite refactor touching every time and ID call site) and the attestation evidence slice with its declared synthetic freshness threshold (the largest new mechanism, and the one most constrained by open architecture questions). Nothing in the demo requires a deferred decision to be closed, provided all synthetic placeholders are labeled as such.

## Gating Condition Record

Per `docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 45, acceptance requires the gating condition (Tasks 2 through 7 accepted) to be recorded as satisfied. Recorded: the Task 10 gate document (`docs/sprints/sprint-02-task-10-component-mapping-and-selection-gate.md`) lists Tasks 1 through 7 as accepted baselines with semantic review PASS, and this return's accepted inputs (section 42 of the Task 8 document) are drawn exclusively from those accepted artifacts.

## Escalations

None. No conflict between accepted architecture artifacts was encountered, no candidate was found that requires weakening an accepted invariant, and no Class C or Class D question arose. The open blocking questions cited (failure-model section 99; invariants section 51) are recorded as residuals with their blocking scope, per the Task 10 section 28 discipline, not as escalations.

## Integration Statement (per WR-008)

This return integrates as follows, subject to Control Plane semantic review:

* Feasibility constraints feed Task 10 component mapping as constraints, not selections (`docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 51).
* Residual open questions feed the Task 10 unresolved-question inventory.
* The lab prerequisite, observability, and reproducibility requirements are candidate inputs to Task 7 verification design for any future lab slice.
* Evidence-state of this return: Research Finding. It establishes no Selected Technology, no Implemented, Tested, Observed, Enforced, or Production Ready claim beyond the explicitly cited baseline executions (13/13 unit tests; one HTTP smoke test), which are lab evidence under the baseline's own non-production scope.

---

## References (all verified to exist in the repository)

* `docs/sprints/sprint-02-task-08-specialist-work-packages.md` (WP-004 charter, sections 39-45; routing requirements WR-001..WR-010)
* `docs/sprints/sprint-02-task-10-component-mapping-and-selection-gate.md` (LC-01..LC-11, CM-001..CM-014, FR/IV allocations, exit questions)
* `docs/sprints/sprint-02-task-07-invariant-verification-matrix.md` (IV-001..IV-012, SI-30/SI-31/SI-35/SI-38 traces)
* `docs/sprints/sprint-02-task-06-failure-degraded-mode-recovery-matrix.md` (FR-xxx normative definitions)
* `docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md` (AZ-xxx, ENF-xxx, CTL-xxx; co-location sections 70-72)
* `docs/architecture/failure-model.md` (FM-01..FM-17; failure testing sections 91-92; open questions section 99)
* `docs/architecture/security-invariants.md` (SI-01..SI-38; open questions section 51)
* `labs/sprint-02-task-05-authorization/` (`authorization_lab.py`, `http_lab.py`, `lab_client.py`, `policy.json`, `tests/test_authorization_lab.py`, `tests/test_http_lab.py`, `README.md`)
