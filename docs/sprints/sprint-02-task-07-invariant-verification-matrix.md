# Sprint 2 Task 7: Invariant-to-Control Verification Matrix

**Project:** Autonomous Trust Platform
**Sprint:** Sprint 2, Trust Control Contracts and Technology Evaluation Gate
**Task:** Task 7, Invariant-to-Control Verification Matrix
**Status:** Accepted
**Task Date:** 2026-10-06
**Accepted Date:** 2026-10-06
**Semantic Review:** PASS
**Owner:** Trust Platform, Control Plane
**Repository Baseline:** `0b603e857e37204e3b4661ecc5bf43778486a50e`
**Roadmap Authority:** `docs/sprints/sprint-02-plan.md`
**Traceability Baseline:** `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
**Role Capability Baseline:** `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
**Interface Contract Baseline:** `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
**Authority / Anchor Baseline:** `docs/sprints/sprint-02-task-04-authority-trust-anchor-and-governance-matrix.md`
**Authorization Baseline:** `docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md`
**Invariant Baseline:** `docs/architecture/security-invariants.md`
**Failure Baseline:** `docs/architecture/failure-model.md`

> **Forward reference note:** Task 7 cites failure requirements as `FR-012` through `FR-053`. These are provisional identifiers for the Task 6 failure, degraded-mode, and recovery control matrix, which is in preparation in parallel. At Task 6 acceptance, the Control Plane must reconcile these identifiers against the accepted Task 6 catalog.

---

## 1. Objective

Convert the accepted Sprint 1 security invariants (`SI-01` through `SI-38`) into implementation-evaluable verification contracts.

The governing question is:

> **For each accepted security invariant, which control must enforce it, where must that control be enforced, which positive test proves the control works, which negative test proves the forbidden state is rejected, which failure test proves the invariant survives degraded operation, and which evidence proves the tests ran and what they showed?**

Task 7 completes the architecture-to-test traceability chain required by the Sprint 2 plan:

```text
Security Invariant
        ↓
Required Control
        ↓
Required Enforcement Point
        ↓
Positive Test
        ↓
Negative Test
        ↓
Failure Test
        ↓
Required Evidence
```

Task 7 does not select:

* Implementation technology
* Product
* Protocol
* Credential format
* Policy language
* Test framework
* Deployment topology

It defines what any conforming implementation must prove.

---

## 2. Why This Task Matters

The invariants artifact states the architecture contract plainly:

```text
An invariant must not be claimed as technically enforced
until implementation and verification evidence demonstrates
the corresponding control and enforcement behavior.
```

Without Task 7, the invariant set is a list of admirable statements with no defined proof obligation. A future implementation could claim conformance while testing only the convenient invariants, testing only the success path, or collapsing the distinction between "the architecture requires it" and "the implementation enforces it."

Task 7 closes those gaps by making three things explicit for every invariant:

1. **Where the invariant is enforced.** An invariant without a required enforcement point is a wish.
2. **How the invariant is attacked.** Each invariant gets at least one negative test designed to produce the forbidden state, per the negative-test principle in the invariants artifact (section 45).
3. **How the invariant behaves when the world breaks.** Each invariant gets failure tests against the Task 6 failure states, because an invariant that holds only during normal operation is not an invariant.

Task 7 also answers the open verification questions from the invariants artifact (section 51) far enough to make them testable: which invariants require cryptographic proof, runtime isolation, continuous verification, transaction binding, or cross-domain evidence, and which are primarily verified by architecture review. Where an invariant is review-verified, Task 7 says so honestly rather than inventing a runtime check that does not exist.

---

## 3. How to Read an Invariant Trace

Each trace in sections 6 through 13 follows the same shape:

| Element | Meaning |
|---|---|
| Invariant | The accepted `SI-###` statement, summarized; the invariants artifact is authoritative for full wording |
| Required Control | The control that must exist for the invariant to hold, expressed implementation-neutrally |
| Required Enforcement Point | The architecture role (`ROLE-###`) where the control must take effect |
| Positive Test | What a conforming implementation must demonstrate on the success path |
| Negative Test | The adversarial attempt that must be rejected or constrained (catalog ID `NT-###`, detailed in section 14) |
| Failure Test | The degraded or failure condition under which the invariant must still hold (references Task 6 `FR-###` forward references) |
| Required Evidence | The artifact that proves the tests ran and what they showed (evidence record shape in section 16) |
| Verification Class | How the invariant is verified: cryptographic proof, runtime isolation, continuous verification, transaction binding, cross-domain evidence, architecture-review evidence, or a combination |

Verification classes are defined in section 4.

---

## 4. Verification Classes

### 4.1 Class Definitions

**Cryptographic proof required.** The invariant's enforcement depends on cryptographic integrity, authenticity, or binding that must be verifiable independently of the component being tested. The test must use independently generated keys, must attempt forgery or substitution, and must record algorithm and key identifiers so crypto-agility review is possible.

**Runtime isolation required.** The invariant's enforcement depends on a runtime boundary (process, container, enclave, privilege separation, or equivalent) that prevents one security principal's authority from becoming another's. The test must demonstrate the boundary from the less-privileged side.

**Continuous verification required.** Point-in-time checks are insufficient. The invariant must be re-evaluated when its underlying state may have changed (revocation, authority withdrawal, policy change, attestation expiry). Tests must include re-evaluation triggers, not only initial checks.

**Transaction binding required.** The invariant must hold per request or per transaction, not per session or per principal. Tests must attempt cross-transaction reuse.

**Cross-domain evidence required.** The invariant governs acceptance of security material from another trust domain. Tests must present valid foreign-domain material and verify the receiving domain applies its own policy.

**Architecture-review evidence.** The invariant is primarily established by design review, configuration review, governance records, or audit of the architecture itself rather than by a single runtime check. Task 7 marks these honestly. Review evidence must still be recorded, versioned, and re-performed when the architecture changes.

### 4.2 Verification Requirements

**Requirement ID:** `IV-001`

Every applicable invariant must have the full seven-element trace recorded before an implementation may claim conformance for that invariant.

**Requirement ID:** `IV-002`

Positive tests must demonstrate the required control behavior at the required enforcement point, not at a convenient substitute.

**Requirement ID:** `IV-003`

Every applicable invariant must have at least one negative test designed to produce the forbidden state. A test suite with only success-path tests is non-conformant for invariant verification.

**Requirement ID:** `IV-004`

Every applicable invariant must have failure tests against the Task 6 failure states relevant to its dependencies (`FR-012` through `FR-053`).

**Requirement ID:** `IV-005`

Verification evidence must preserve the assurance-state distinction (proposed, accepted, implemented, tested, observed, enforced) from the invariants artifact. A test result must not be recorded as enforcement.

**Requirement ID:** `IV-006`

The verification class for each invariant must be recorded with its trace. Classifications must be reviewed when the implementation architecture changes.

**Requirement ID:** `IV-007`

Invariants verified primarily by architecture review must have recorded, versioned review artifacts with named reviewers, review date, scope, and findings. Review is evidence, not a waiver.

**Requirement ID:** `IV-008`

An invariant violation found in testing must be classified by cause (architecture defect, implementation defect, configuration defect, policy defect, compromised authority, administrative misuse, semantic misuse, availability failure, enforcement bypass) per the invariants artifact section 46, and must not be closed by reclassifying the test.

**Requirement ID:** `IV-009`

Composition tests must exercise multiple invariants together where the invariants artifact identifies interaction risk (section 43). Valid components composed incorrectly must still be caught.

**Requirement ID:** `IV-010`

Invariants depending on state that may change during degraded operation must be re-verified after recovery, per `FM-10` and `FM-11`.

**Requirement ID:** `IV-011`

The Control Plane must classify each invariant as release-gating or non-gating before any release claim. Non-gating invariants must still be traced; gating is a release decision, not an exemption from verification.

**Requirement ID:** `IV-012`

Where cryptographic proof is used, the evidence must record algorithm, key identifier, and trust anchor so crypto-agility review can confirm the implementation is not algorithm-locked.

---

## 5. Task 6 Reconciliation

This task was drafted in parallel with Task 6. The failure-test column below cites the Task 6 failure requirements (`FR-xxx`) as defined in the accepted Task 6 artifact (`docs/sprints/sprint-02-task-06-failure-degraded-mode-recovery-matrix.md`). Reconciliation was completed at Task 6 acceptance: the provisional identifiers used during parallel drafting were replaced with the Task 6 definitions below, and no provisional identifier remains.

| Task 6 requirement | Failure dependency class |
|---|---|
| `FR-005` | Identity validation failure |
| `FR-007` | Attestation verification failure |
| `FR-009` | Trust-bundle distribution failure |
| `FR-011` | Delegation verification failure |
| `FR-012` | Revocation state failure |
| `FR-013` | Authorization policy failure |
| `FR-015` | Enforcement point failure |
| `FR-016` | Audit and evidence failure |
| `FR-024` | Clock uncertainty bounded per decision |
| `FR-041` | Degraded states must not auto-compose |
| `FR-046` | Recovery requires validation before authority |
| `FR-053` | Emergency authority requires an independent source |

---

# Invariant Verification Traces

## 6. Identity and Principal Invariants (SI-01 through SI-05)

| SI | Required Control | Required Enforcement Point | Positive Test | Negative Test | Failure Test | Required Evidence | Verification Class |
|---|---|---|---|---|---|---|---|
| SI-01 Credential Is Not Principal | Credential lifecycle operations (issue, renew, revoke, expire) must execute independently of principal lifecycle operations (create, suspend, terminate) | ROLE-003 Identity Authority, ROLE-004 Identity Validation | Revoke a credential while the principal remains active; principal record unchanged and new credential issuable | NT-001: terminate a principal and attempt to use its still-unexpired credential; attempt to treat credential expiry as principal termination | FR-005: identity validation unavailable; cached validation must not merge credential and principal state | Lifecycle event log showing independent credential and principal transitions with separate timestamps and authorities | Architecture-review evidence (lifecycle model), plus runtime tests |
| SI-02 Runtime Authentication Does Not Establish Logical Actor Identity | Principal-to-runtime binding validation must require explicit binding evidence before a logical actor identity is accepted | ROLE-004 Identity Validation (consuming EDGE-002) | Authenticate workload, present valid binding artifact, logical actor identity accepted with binding reference | NT-002: authenticate workload, assert unbound logical agent identity; must be rejected | FR-005: binding validation dependency unavailable; unbound assertions must not be accepted during outage | Binding validation records: workload identity, actor claim, binding evidence digest, verifier, decision | Test; binding mechanism reviewed |
| SI-03 Identity and Authority Lifecycles Independent | Delegated authority validity must be evaluated against its own expiry and revocation state, never derived from credential or identity validity | ROLE-012 Authorization Decision Function (CTL-002) | Renew a credential mid-session; previously granted delegated authority retains its original expiry, not extended | NT-003: renew credential after delegation expired; attempt the delegated action; must be denied | FR-012, FR-011: revocation or delegation verification unavailable; authority must not be assumed from identity validity | Decision records showing independent identity-validity and authority-validity evaluations with separate timestamps | Continuous verification |
| SI-04 Infrastructure Identity Not Workload Identity | An explicit, governed mapping must exist wherever infrastructure identity participates in workload identity decisions | ROLE-003 Identity Authority, ROLE-004 Identity Validation | Node identity presented during workload bootstrap; workload identity issued only per the explicit mapping rule | NT-004: present valid node identity and request workload-scoped authority without the mapping; must be denied | FR-005: mapping source unavailable; no implicit promotion of node identity during outage | Mapping configuration (versioned, governed) plus bootstrap records citing the mapping | Architecture-review evidence (mapping), plus runtime tests |
| SI-05 Principal Boundaries Distinguishable | Identity records and authorization context must carry the distinguishing attributes (authority, lifecycle, revocation scope, accountability owner) for materially different principals | ROLE-003 Identity Authority, ROLE-012 Authorization Decision Function | Two principals differing in revocation scope produce distinguishable identity and context records | NT-005: merge two principals into one ambiguous identifier in authorization context; decision must be rejected as ambiguous or the ambiguity must be detectable in audit | FR-016: audit unavailable; principal distinctions must remain in the decision path even when audit buffering | Schema of identity and context records showing distinguishing fields; sample records | Architecture-review evidence (schema), plus runtime tests |

## 7. Trust and Trust-Domain Invariants (SI-06 through SI-10)

| SI | Required Control | Required Enforcement Point | Positive Test | Negative Test | Failure Test | Required Evidence | Verification Class |
|---|---|---|---|---|---|---|---|
| SI-06 Deployment Topology Does Not Define Trust Semantics | Trust-domain membership must be defined by security function, authorities, anchors, validation rules, and governance, recorded independently of deployment topology | ROLE-017 Trust Coordination / Governance Function | Two workloads on the same cluster placed in different trust domains per function; cross-domain rules apply between them | NT-006: attempt to derive trust-domain membership from cluster or namespace labels alone; review must find no such derivation | FR-009: trust material stale; topology changes during staleness must not redefine domain membership | Trust-domain definition records with function, authorities, anchors, and governance, showing no topology-derived membership | Architecture-review evidence (primary); configuration audit |
| SI-07 Trust Function-Scoped | Each trust relationship must name the security function it covers; acceptance in one function must not imply acceptance in another | ROLE-012 Authorization Decision Function, ROLE-004 Identity Validation | Identity issuer trusted for identity; same issuer's assertion presented for authorization; authorization requires its own authority basis | NT-007: use a valid attestation-verifier trust relationship to justify delegation acceptance; must be rejected | FR-007: verifier unavailable; function-scoped fallback must not borrow trust from another function | Trust relationship registry with per-function scope fields; test records showing scope enforcement | Architecture-review evidence (registry), plus runtime tests |
| SI-08 Trust Not Symmetric or Transitive | Trust relationship records must be directional; validation must not infer reverse or transitive trust | ROLE-004 Identity Validation, ROLE-012 Authorization Decision Function | A trusts B recorded; B's assertion about C evaluated only against A's explicit trust in C or a governed chain | NT-008: A trusts B, B trusts C; present C's assertion to A with no explicit A-to-C relationship; must be rejected | FR-009: trust bundle stale during chain update; stale transitive inference must not occur | Directional trust records; chain validation logs showing explicit hop evaluation | Test, plus review of chain logic |
| SI-09 Cross-Domain Acceptance Explicit | Receiving domain must apply its own acceptance policy (trusted authority, namespace, scope, evidence) to foreign-domain material | ROLE-012 Authorization Decision Function (CTL-012) | Valid foreign-domain credential presented; accepted only after receiving-domain policy evaluation | NT-009: valid foreign credential, no receiving-domain acceptance rule; must be denied | FR-012: foreign revocation state unavailable; receiving-domain degraded policy applies, not the foreign default | Receiving-domain acceptance policy (versioned); decision records citing the applied rule | Cross-domain evidence, test |
| SI-10 Authentication Federation Not Authorization Federation | Federated authentication result must enter authorization as identity context only; local policy must still decide authorization | ROLE-012 Authorization Decision Function (AZ-002, CTL-012) | Federated identity accepted; protected action denied until local policy grants authority | NT-010: federated authentication with no local authorization basis; attempt protected action; must be denied | FR-013: local policy engine unavailable; federated identity alone must not produce permit | Decision records showing federated identity context plus independent local policy evaluation | Test |

## 8. Bootstrap and Recovery Invariants (SI-11 through SI-16)

| SI | Required Control | Required Enforcement Point | Positive Test | Negative Test | Failure Test | Required Evidence | Verification Class |
|---|---|---|---|---|---|---|---|
| SI-11 Registration Not Current Runtime Proof | Registration artifacts must be marked as eligibility evidence; runtime authentication must require fresh proof | ROLE-004 Identity Validation | Registered workload authenticates at runtime with fresh proof; accepted with both registration and runtime evidence recorded | NT-011: present registration record alone as runtime authentication; must be rejected | FR-005: runtime proof mechanism unavailable; registration must not be promoted to runtime proof during outage | Validation records distinguishing registration evidence from runtime evidence | Test |
| SI-12 Strong Credentials Cannot Repair Incorrect Binding | Bootstrap binding ceremony must produce auditable binding evidence independent of subsequent credential strength | ROLE-003 Identity Authority (bootstrap function) | Bootstrap completes with binding evidence; later strong credential issuance references the binding record | NT-012: bootstrap with incorrect principal binding, then issue strong credentials; audit review must be able to detect the binding was wrong from the binding evidence alone | FR-046: recovery re-bootstrap; previous binding must not be inherited without fresh binding evidence | Binding ceremony records: method, witnesses or approvals, principal identifiers, timestamp | Architecture-review evidence (ceremony design and audit), plus negative test |
| SI-13 Bootstrap Authority Remains Bootstrap-Scoped | Bootstrap credentials and capabilities must carry scope markers limiting them to bootstrap functions; routine enforcement must reject them | ROLE-013 Enforcement Point, ROLE-003 Identity Authority | Bootstrap completes; bootstrap credential used for bootstrap steps succeeds, then rejected for application actions | NT-013: use valid bootstrap credential for a standing application action; must be denied | FR-053: emergency use of bootstrap capability; requires separately governed emergency authority, not the bootstrap credential itself | Credential scope markers in issuance records; enforcement logs showing scope rejection | Test; cryptographic proof where scope is cryptographically bound |
| SI-14 Bootstrap Transition Explicit | Bootstrap completion must be a recorded transition naming when bootstrap ends, which artifacts retire, and which routine credential replaces them | ROLE-003 Identity Authority, ROLE-017 Trust Coordination / Governance Function | Bootstrap completes; transition record exists; retired bootstrap artifacts rejected thereafter | NT-014: use a retired bootstrap artifact after transition; must be rejected | FR-046: interrupted bootstrap; no partial bootstrap state may be treated as completed transition | Transition record: end time, retired artifacts, replacement credential reference, authorizing basis | Test, plus review of transition procedure |
| SI-15 Compromise Recovery Requires Independent Trust Basis | Recovery procedures must name an independent trust basis; recovery using only the compromised basis must be structurally impossible or explicitly rejected | ROLE-016 Recovery Authority | Simulate compromised root; recovery executed via independent basis; recovered state validated against the independent basis | NT-015: attempt recovery authenticated solely by the compromised root; must be rejected | FR-046: recovery basis itself degraded; recovery must not proceed on unvalidated basis | Recovery runbook (governed), recovery execution records citing the independent basis | Architecture-review evidence (runbook and basis independence analysis), plus drill records |
| SI-16 Re-Bootstrap Must Not Silently Inherit Previous Trust | Re-bootstrap must require a fresh, explicitly valid basis; migration tooling must not copy trust assumptions automatically | ROLE-003 Identity Authority, ROLE-016 Recovery Authority | Re-enrollment after migration completes with new binding evidence; old trust assumptions listed and explicitly re-justified or dropped | NT-016: re-bootstrap that silently carries over previous trust anchors without re-justification; review must flag it | FR-046: recovery under time pressure; shortcuts in re-justification must still be recorded as exceptions with expiry | Re-bootstrap records: new basis, carried-over assumptions with justification, dropped assumptions | Architecture-review evidence, plus test |

## 9. Attestation Invariants (SI-17, SI-18)

| SI | Required Control | Required Enforcement Point | Positive Test | Negative Test | Failure Test | Required Evidence | Verification Class |
|---|---|---|---|---|---|---|---|
| SI-17 Attestation Semantics Bounded | Authorization must treat Attestation Results as policy-defined inputs, never as identity, delegation, or authorization by themselves | ROLE-012 Authorization Decision Function (AZ-011, AZ-012) | Attestation Result plus valid authority and policy: permit where policy requires attestation as one input | NT-017: valid Attestation Result presented as the sole basis for authorization; must be denied | FR-007: verifier unavailable; missing attestation must not become implicit authorization nor implicit identity | Decision records showing attestation as one input among required inputs; policy clause requiring it | Test |
| SI-18 Attestation Trust Explicit | Each attestation reliance must name the trusted verifier, appraisal policy, reference values, endorsements, and freshness rules | ROLE-006 Attestation Verifier (as governed), ROLE-007 Relying Function | Attestation accepted only when verifier, appraisal policy, and reference values are all explicitly trusted and fresh | NT-018: cryptographically valid evidence with untrusted appraisal policy or stale reference values; must be rejected | FR-007, FR-009: verifier or reference data stale; reliance must follow explicit freshness rules | Attestation trust configuration: verifier identities, appraisal policy versions, reference value versions and freshness | Architecture-review evidence (trust configuration), plus runtime tests |

## 10. Delegated-Authority Invariants (SI-19 through SI-26)

| SI | Required Control | Required Enforcement Point | Positive Test | Negative Test | Failure Test | Required Evidence | Verification Class |
|---|---|---|---|---|---|---|---|
| SI-19 Authentication Does Not Establish Delegated Authority | Authority provenance must be evaluated independently of delegate authentication | ROLE-012 Authorization Decision Function (CTL-002) | Authenticated delegate with valid grant: permit within grant scope | NT-019: authenticated delegate with no grant; attempt delegated action; must be denied | FR-011: delegation verification unavailable; authentication alone must not produce authority | Decision records showing separate authentication evaluation and authority provenance evaluation | Test |
| SI-20 Delegated Authority Must Not Amplify | Delegation validation must check granted authority against delegable authority: `Granted ⊆ Delegable` | ROLE-012 Authorization Decision Function (CTL-002) | Delegator grants read; delegate reads: permit | NT-020: grant read, attempt to delegate admin or exercise admin; must be denied | FR-011: verifier unavailable; previously validated grants usable only under explicit bounded policy, never expanded | Grant records with scope; validation logs showing subset check | Test; cryptographic proof where grant integrity is cryptographically bound |
| SI-21 Redelegation Denied by Default | Delegation grants must carry an explicit redelegation permission; absence means denial | ROLE-012 Authorization Decision Function | Grant with explicit redelegation permission: onward delegation accepted within bounds | NT-021: grant without redelegation permission; attempt onward delegation; must be denied | FR-011: verification unavailable; redelegation attempts must not be assumed permitted | Grant records showing redelegation flag; validation logs | Test |
| SI-22 Delegation Artifact Validity Not Independent Authority | Derived authority must be re-evaluated when its underlying authority basis changes; signature validity alone is insufficient | ROLE-012 Authorization Decision Function, ROLE-011 policy on re-evaluation triggers | Authority basis withdrawn; previously valid artifact presented; re-evaluation denies | NT-022: withdraw the authority basis, present the still-cryptographically-valid artifact; must be denied | FR-012, FR-011: revocation or basis-state unavailable; artifact must not be treated as independently authoritative | Authority-basis change log; re-evaluation records tied to basis changes | Continuous verification; cryptographic proof for artifact integrity |
| SI-23 Issuer Not Automatically Authority Source | Validation must distinguish Authority Source, Delegator, and Delegation Issuer as separate fields | ROLE-012 Authorization Decision Function (AZ-003) | Delegation where issuer differs from source: validated against the source, with all three roles recorded | NT-023: artifact where issuer claims source authority without basis; validation must detect the mismatch | FR-011: source-state unavailable; issuer assertion alone must not substitute for source validation | Validation records with separate source, delegator, and issuer fields | Test, plus review of validation logic |
| SI-24 No Implicit Authority Union | Multiple authority sources must be combined only by the explicit composition rule in policy | ROLE-012 Authorization Decision Function (AZ-007) | Two sources with intersection policy: permit only the intersection | NT-024: two sources each granting part of the needed authority, no explicit union rule; attempt combined authority; must be denied | FR-013: policy unavailable; no implicit union during degraded operation | Policy composition rule (versioned); decision records citing the applied rule | Test; review of composition logic |
| SI-25 Host Workload Authority Not Agent Authority | Authorization context must distinguish workload authority from logical-agent authority; agent requests evaluated on agent authority | ROLE-012 Authorization Decision Function (AZ-009) | Agent with its own grant: permit within agent scope even where host holds broader authority | NT-025: agent with no grant attempts host-privileged action; must be denied | FR-013: policy unavailable; agent must not inherit host authority during degraded operation | Decision records with separate workload-authority and agent-authority fields | Test; runtime isolation where the boundary is a runtime boundary |
| SI-26 Tool Invocation Not Redelegation | Tool invocation capability must be tracked separately from delegation grants; invocation must not create delegation records | ROLE-012 Authorization Decision Function (AZ-010) | Agent invokes tool within its own authority: permit; no delegation artifact created | NT-026: agent invokes a downstream tool and claims the invocation delegated authority to the tool; must be rejected | FR-011: delegation state unavailable; invocation must not be reinterpreted as delegation | Invocation logs vs delegation records kept as separate artifact types | Test |

## 11. Authorization and Enforcement Invariants (SI-27 through SI-30)

| SI | Required Control | Required Enforcement Point | Positive Test | Negative Test | Failure Test | Required Evidence | Verification Class |
|---|---|---|---|---|---|---|---|
| SI-27 Identity Is Not Authorization | Authorization decision must require authority and policy basis beyond identity validity | ROLE-012 Authorization Decision Function (AZ-002) | Valid identity, valid authority, matching policy: permit | NT-027: valid identity with no authority; attempt protected action; must be denied | FR-013: policy unavailable; identity alone must not produce permit | Decision records showing identity evaluation distinct from authorization evaluation | Test |
| SI-28 External Delegation Subject to Local Authorization | Foreign delegation assertions must pass local policy evaluation before any permit | ROLE-012 Authorization Decision Function (CTL-012, AZ-008) | Valid foreign delegation recognized by local policy: permit within locally accepted scope | NT-028: valid foreign delegation with no local acceptance; must be denied | FR-011: foreign validation unavailable; local degraded policy applies | Local acceptance policy; decision records citing local evaluation of foreign material | Cross-domain evidence, test |
| SI-29 No Ambient Deputy Authority Substitution | Authorization context must preserve requester identity and authority; deputy service authority must not replace it where requester authority matters | ROLE-012 Authorization Decision Function, ROLE-013 Enforcement Point | Deputy acts on behalf of requester: decision evaluated on requester authority, deputy identity recorded | NT-029: requester lacks authority, deputy holds broader authority; attempt action; must be denied on requester authority | FR-015: enforcement degraded; requester context must not be dropped from the path | Decision records with both requester and deputy context preserved | Transaction binding; test |
| SI-30 Authorization Requires Effective Enforcement | Every protected operation must have an identified, effective enforcement point; decisions without enforcement are incomplete controls | ROLE-013 Enforcement Point (ENF-001, ENF-002) | Permit decision delivered to the enforcement point on the protected path; operation proceeds with enforcement evidence | NT-030: correct permit decision with enforcement bypassed via alternate path; the bypass must be blocked and evidenced | FR-015: enforcement point unavailable; protected operation must not silently proceed unmediated | Enforcement outcome records correlated to decisions (ENF-010); alternate-path inventory (ENF-006) | Test; runtime isolation of the enforcement path |

## 12. Failure and Compromise Invariants (SI-31 through SI-34)

| SI | Required Control | Required Enforcement Point | Positive Test | Negative Test | Failure Test | Required Evidence | Verification Class |
|---|---|---|---|---|---|---|---|
| SI-31 Failure Must Not Silently Increase Authority | Every material dependency must have explicit resource-specific failure behavior; unknown states must remain distinguishable | ROLE-012 Authorization Decision Function, ROLE-013 Enforcement Point (CTL-011) | Revocation service unavailable for a low-risk read with explicit bounded-continuation policy: operation continues within the documented bound | NT-031: make revocation unavailable, then attempt an action whose policy requires fresh revocation state; must be denied or deferred per policy, never silently permitted | FR-012 through FR-053: each failure requirement exercised; no test may show silent authority expansion | Failure behavior matrix per resource; test records per failure state with observed behavior vs required behavior | Test (failure-test catalog, section 15); continuous verification of freshness bounds |
| SI-32 Compromise and Availability Failure Distinct | Compromise handling and availability handling must be separate procedures with separate evidence and recovery paths | ROLE-016 Recovery Authority, ROLE-017 Trust Coordination / Governance Function | Availability outage: degraded-mode procedure followed, no trust invalidation beyond the outage scope | NT-032: treat a suspected key compromise as a routine outage (or vice versa); review must find the misclassification | FR-046: recovery after suspected compromise must use an independent trust basis, unlike availability recovery | Incident records classified as compromise vs availability; separate runbooks invoked | Architecture-review evidence (separate procedures), plus drill records |
| SI-33 Compromise Dependencies Traceable | A dependency map from each material authority to downstream security conclusions must exist and be queryable | ROLE-017 Trust Coordination / Governance Function, ROLE-015 Audit / Evidence Function | Compromise of a delegation authority simulated; query returns the full downstream conclusion set for analysis | NT-033: compromise an authority and show a downstream conclusion that the map omits; the omission is a finding | FR-046: during recovery, the map must drive re-evaluation scoping | Dependency map (versioned); traceability query records | Architecture-review evidence (map), plus test of query completeness |
| SI-34 Functions Must Not Hide Correlated Compromise | Architecture must document shared compromise paths across co-located functions and administrative concentrations | ROLE-017 Trust Coordination / Governance Function | Shared admin path across identity and policy authorities documented with correlated-compromise analysis and mitigations | NT-034: review finds a shared key-management or admin path with no correlated-compromise analysis; finding recorded | FR-041: correlated failure during degraded operation; composition analysis must account for shared paths | Shared-path analysis document; administrative concentration register | Architecture-review evidence (primary) |

## 13. Audit and Governance Invariants (SI-35 through SI-38)

| SI | Required Control | Required Enforcement Point | Positive Test | Negative Test | Failure Test | Required Evidence | Verification Class |
|---|---|---|---|---|---|---|---|
| SI-35 Actions Preserve Principal Context | Audit records must carry actor, runtime, and delegator as separate fields where security-relevant | ROLE-015 Audit / Evidence Function (ENF-010, AZ-021) | Delegated action executed; audit record shows actor, runtime, and delegator distinctly | NT-035: audit record collapses actor, runtime, and delegator into one ambiguous identity; record rejected by schema validation | FR-016: audit unavailable; buffered records must preserve the full context fields, not a reduced form | Audit schema (versioned); sample records; schema validation results | Test; review of schema |
| SI-36 Delegated Actions Preserve Authority Provenance | Delegation audit trail must remain interpretable after identities or grants are revoked, including source, delegator, delegate, issuer, scope, decision, and enforcement result | ROLE-015 Audit / Evidence Function | Action audited under a grant; grant later revoked; historical record still resolves the full provenance chain | NT-036: revoke the grant, then attempt to make the historical record uninterpretable (e.g., by deleting the grant); the record must remain interpretable | FR-016: audit buffering during outage; provenance fields must survive buffering and recovery | Historical provenance records queried post-revocation; integrity digests | Test; cryptographic proof for record integrity; transaction binding per action |
| SI-37 Authorities Architecturally Distinguishable | Each material authority must have an explicit governance, custody, lifecycle, modification, audit, and compromise-recovery model, even when co-located | ROLE-017 Trust Coordination / Governance Function | Two co-located authorities (e.g., policy and delegation) each have separate governance records and compromise-response plans | NT-037: co-located authorities sharing one undifferentiated governance record; review must flag the missing distinction | FR-046: recovery of one co-located authority must follow its own recovery model, not a shared shortcut | Per-authority governance records; co-location justification with shared-risk analysis | Architecture-review evidence (primary); governance records |
| SI-38 Trust State Changes Governed | Material trust-state changes must pass through an authorized, attributable, auditable governance path; unauthorized changes must be rejected or flagged | ROLE-017 Trust Coordination / Governance Function, ROLE-013 Enforcement Point (ENF-005) | Trust-anchor rotation performed through the governance path: authorized, attributed, audited, reversible per policy | NT-038: modify a trust anchor or policy through an ungoverned path; the change must be rejected or detected and flagged | FR-016: audit unavailable during a trust-state change; high-risk changes must wait for durable audit per resource policy | Change records: authorization, attributor, timestamp, before/after state, reversibility | Test; review of governance path |

---

# Detailed Test Sketches for Non-Obvious Invariants

## 14. Negative-Test Catalog

Each entry is an adversarial sketch in the style of the invariants artifact (section 45). Expected results are required behavior, not observed results.

**NT-001 (SI-01).** Terminate principal P while credential C (issued to P, unexpired) still exists. Present C for authentication. Expected: authentication may validate C's integrity, but authorization finds no active principal and denies; no new principal record is created from C.

**NT-002 (SI-02).** Authenticate workload W. Assert logical agent A with no binding artifact. Expected: A is not established; any action requiring A's identity is denied.

**NT-003 (SI-03).** Let delegation D expire. Renew the delegate's credential. Attempt D's action. Expected: denied; renewal did not touch D's validity.

**NT-004 (SI-04).** Present valid node identity N. Request workload-scoped authority for workload W with no governed node-to-workload mapping. Expected: denied.

**NT-005 (SI-05).** Submit an authorization context that merges two principals into one identifier. Expected: rejected as ambiguous, or accepted only with the ambiguity recorded and policy explicitly permitting it.

**NT-006 (SI-06).** Configure two workloads in one cluster to share a trust domain implicitly via topology labels. Expected: architecture review rejects the configuration; no implicit domain exists.

**NT-007 (SI-07).** Present a valid attestation-verifier trust relationship as justification for accepting a delegation grant. Expected: rejected; function scope mismatch.

**NT-008 (SI-08).** A trusts B; B trusts C. Present C's assertion to A with no A-to-C relationship. Expected: rejected; no transitive inference.

**NT-009 (SI-09).** Present a valid foreign-domain credential where the receiving domain has no acceptance rule for that domain. Expected: denied.

**NT-010 (SI-10).** Authenticate via federation with no local authorization basis. Attempt a protected action. Expected: denied.

**NT-011 (SI-11).** Present a registration record as proof of current runtime identity. Expected: rejected; registration is eligibility evidence only.

**NT-012 (SI-12).** Enroll principal P with wrong binding (records show mismatch on audit). Issue strong credentials to P. Expected: credentials issue (they are strong), but audit review can prove from the binding evidence alone that the binding was wrong; the system must not treat credential strength as binding correctness.

**NT-013 (SI-13).** Use a valid bootstrap credential to invoke a standing application API. Expected: denied; bootstrap scope rejected at enforcement.

**NT-014 (SI-14).** Complete bootstrap, then present a retired bootstrap artifact. Expected: rejected; transition record shows retirement.

**NT-015 (SI-15).** Compromise root R. Attempt recovery of R's replacement using only credentials chaining to R. Expected: rejected; recovery requires the independent basis.

**NT-016 (SI-16).** Run migration tooling that copies trust anchors to the new environment without re-justification records. Expected: review flags missing re-justification; migration not accepted.

**NT-017 (SI-17).** Present valid attestation evidence as the sole basis for a protected action. Expected: denied; attestation is not authorization.

**NT-018 (SI-18).** Present cryptographically valid attestation evidence with an untrusted appraisal policy version. Expected: rejected.

**NT-019 (SI-19).** Authenticate a delegate with no delegation grant. Attempt the delegated action. Expected: denied.

**NT-020 (SI-20).** Grant read. Attempt to exercise admin, or to delegate admin onward. Expected: denied; amplification rejected.

**NT-021 (SI-21).** Hold a grant without redelegation permission. Attempt onward delegation. Expected: denied.

**NT-022 (SI-22).** Withdraw the authority basis for a delegation. Present the still-cryptographically-valid artifact. Expected: denied on re-evaluation.

**NT-023 (SI-23).** Present a delegation artifact whose issuer asserts source authority it does not hold. Expected: validation detects the source/issuer mismatch and rejects.

**NT-024 (SI-24).** Hold partial authority from two sources with no explicit composition rule. Attempt the combined authority. Expected: denied.

**NT-025 (SI-25).** As an agent with no grant, attempt an action the hosting workload is authorized for. Expected: denied on agent authority.

**NT-026 (SI-26).** Invoke a downstream tool, then claim the invocation delegated authority to that tool for a further action. Expected: rejected; no delegation artifact exists.

**NT-027 (SI-27).** Authenticate successfully with no authority. Attempt a protected action. Expected: denied.

**NT-028 (SI-28).** Present a valid foreign delegation with no local acceptance. Attempt the action. Expected: denied.

**NT-029 (SI-29).** As a requester without authority, route through a deputy service that holds broader authority. Attempt the action. Expected: denied on requester authority.

**NT-030 (SI-30).** Obtain a correct permit decision, then reach the resource through an unmediated alternate path. Expected: blocked at the resource or alternate path; enforcement outcome evidence shows the decision was not the enforced path.

**NT-031 (SI-31).** Make revocation state unavailable. Attempt an action whose policy requires fresh revocation state. Expected: denied or deferred per explicit policy; never silently permitted.

**NT-032 (SI-32).** Suspect key compromise. Handle it with the routine availability-outage runbook (no invalidation, no independent-basis recovery). Expected: review classifies this as a procedure violation.

**NT-033 (SI-33).** Compromise an authority. Query the dependency map. Expected: every downstream conclusion is listed; any omission is a map defect.

**NT-034 (SI-34).** Identify a shared administrator or key-management path across two trust functions with no correlated-compromise analysis. Expected: finding recorded; analysis required.

**NT-035 (SI-35).** Submit an audit record collapsing actor, runtime, and delegator into one field. Expected: schema validation rejects it.

**NT-036 (SI-36).** Revoke a grant, then delete or obscure the grant record. Attempt to interpret the historical audit trail. Expected: the trail remains interpretable from preserved provenance.

**NT-037 (SI-37).** Co-locate two authorities under one undifferentiated governance record. Expected: review flags the missing per-authority governance.

**NT-038 (SI-38).** Modify a trust anchor through an ungoverned path. Expected: rejected, or detected and flagged with attribution.

---

## 15. Failure-Test Catalog

Failure tests prove invariants hold under degraded operation. Each entry names the failure condition, the invariants under test, the governing failure properties, and the required behavior.

### 15.1 Revocation state unavailable (`FR-012`)

Invariants: SI-03, SI-09, SI-22, SI-28, SI-31.
Governing: `FM-01`, `FM-03`, `FM-06`.
Required: revocation-unknown must remain distinguishable from not-revoked. Actions requiring fresh revocation state follow the explicit resource policy (deny, defer, or bounded continuation). Delegation artifacts must not be treated as independently authoritative during the outage.

### 15.2 Policy engine unavailable (`FR-013`)

Invariants: SI-07, SI-09, SI-10, SI-24, SI-25, SI-27, SI-28, SI-31.
Governing: `FM-01`, `FM-05`.
Required: no permit may be produced from identity, federation, or cached context alone. Bounded cached decisions permitted only under explicit cache policy (`AZ-014`); otherwise deny or defer.

### 15.3 Attestation verifier unavailable (`FR-007`)

Invariants: SI-07, SI-17, SI-18, SI-31.
Governing: `FM-01`, `FM-06`.
Required: missing attestation must not become implicit authorization or implicit identity. Bounded cached results permitted only within explicit freshness rules; high-risk actions requiring fresh attestation are denied or deferred.

### 15.4 Identity validation unavailable (`FR-005`)

Invariants: SI-01, SI-02, SI-04, SI-11, SI-31.
Governing: `FM-01`, `FM-03`.
Required: locally verifiable credentials may continue within explicit bounds; unbound assertions and registration-as-proof must still be rejected. Credential and principal state must not be merged during the outage.

### 15.5 Delegation verification unavailable (`FR-011`)

Invariants: SI-03, SI-19, SI-20, SI-21, SI-22, SI-23, SI-26, SI-28, SI-31.
Governing: `FM-01`, `FM-03`.
Required: inability to verify delegation must not produce delegated authority. Previously validated grants continue only under explicit bounded policy, never expanded.

### 15.6 Trust material stale (`FR-009`)

Invariants: SI-06, SI-08, SI-18, SI-31.
Governing: `FM-06`, `FM-12`.
Required: stale trust material must not restore removed authorities or create transitive trust. Maximum acceptable staleness per relationship governs continued use.

### 15.7 Audit unavailable (`FR-016`)

Invariants: SI-05, SI-33, SI-35, SI-36, SI-38.
Governing: `FM-16`.
Required: operation continues only per explicit per-operation policy (stop, buffer, restrict, alternate storage). Buffered evidence must preserve full principal context and provenance fields. High-risk trust-state changes wait for durable audit.

### 15.8 Enforcement unavailable (`FR-015`)

Invariants: SI-29, SI-30, SI-31.
Governing: `FM-15`.
Required: the protected operation must not silently proceed through an unmediated path. Requester context must not be dropped from degraded paths.

### 15.9 Recovery transition (`FR-046`)

Invariants: SI-12, SI-14, SI-15, SI-16, SI-32, SI-33, SI-37.
Governing: `FM-10`, `FM-11`.
Required: availability restoration is not trust restoration. Dependent conclusions (cached attestation, grants, decisions, revocation assumptions) must be re-evaluated where the failure window may have changed them. Compromise recovery must use the independent trust basis.

### 15.10 Degraded-state composition (`FR-041`)

Invariants: SI-31, SI-34.
Governing: `FM-17`.
Required: combinations of degraded states (e.g., cached policy plus stale attestation plus unknown revocation) must be evaluated explicitly. Individually permitted degradations must not be implicitly unioned.

### 15.11 Clock and time uncertainty (`FR-024`)

Invariants: SI-03, SI-13, SI-14, SI-18, SI-22, SI-31.
Governing: `FM-06`.
Required: where time cannot be established within policy bounds, time-bounded conclusions (expiry, freshness, cache age, grant validity) must not be treated as current. The system must define acceptable clock uncertainty per decision.

### 15.12 Emergency authority invocation (`FR-053`)

Invariants: SI-13, SI-31.
Governing: `FM-08`.
Required: failure is the trigger, not the source. Emergency actions must derive from the independently governed emergency authority with bounds, attribution, audit, and expiration.

---

## 16. Evidence Requirements

### 16.1 Verification Evidence Record

The evidence shape required by `IV-005`:

Each executed verification test must produce a record containing at least:

```text
Invariant ID (SI-###)
Control ID (new or existing)
Enforcement Point (ROLE-###)
Test type (positive, negative, failure, composition)
Test catalog ID (NT-### or failure-test reference)
Timestamp with trusted time basis
Policy version and configuration version
Input digests (not raw secrets)
Expected behavior
Observed behavior
Verdict (pass, fail, inconclusive)
Tester identity (human or automated harness identity)
```

### 16.2 Review Evidence Record

For invariants verified primarily by architecture review (`IV-007`):

```text
Invariant ID
Review scope and artifact versions reviewed
Reviewer identities
Review date
Findings (including NT-style adversarial review probes)
Disposition of each finding
Re-review trigger (which architecture changes invalidate the review)
```

### 16.3 Evidence Handling Rules

* Evidence must distinguish test execution from enforcement: a passing test proves the control behaved in test, not that the control is enforced in every deployment.
* Negative-test evidence must show the forbidden state was attempted and rejected, not merely that the success path works.
* Failure-test evidence must record the failure state injected, the observed behavior, and the policy clause that required it.
* Evidence records must be integrity-protected where they support audit or compliance claims (`ANCHOR-006`).
* Evidence retention follows the platform's data retention design: what is kept, how long, who can access it, and how it is deleted are defined up front, not after.

---

# Coverage Analysis

## 17. Task 5 Coverage vs Task 7 Closure

Task 5 (authorization and enforcement contract) already traces 18 invariants to `AZ`, `ENF`, and `CTL` controls. Task 7 closes the remainder and adds the test and evidence obligations for all 38. "Covered" below means Task 5 defined control semantics; Task 7 still adds the required tests and evidence for every invariant.

| SI | Task 5 control coverage | Task 7 closure | Verification class |
|---|---|---|---|
| SI-01 | None | New: lifecycle-independence control, tests NT-001, FR-005 | Review + test |
| SI-02 | AZ-002, AZ-009, CTL-001 | Adds: binding validation tests NT-002, FR-005, evidence shape | Test |
| SI-03 | AZ-013, AZ-014, CTL-004, CTL-009 | Adds: lifecycle-independence tests NT-003, FR-012/FR-011, continuous re-evaluation | Continuous verification |
| SI-04 | None | New: explicit mapping control, tests NT-004, FR-005 | Review + test |
| SI-05 | None | New: distinguishability control, tests NT-005, FR-016 | Review + test |
| SI-06 | None | New: topology-independent domain definition, review NT-006, FR-009 | Architecture-review evidence |
| SI-07 | None (implied by role separation) | New: function-scoping control, tests NT-007, FR-013/FR-007 | Review + test |
| SI-08 | AZ-007 (composition explicit) | Adds: directionality tests NT-008, FR-009 | Test + review |
| SI-09 | AZ-004, AZ-006, CTL-012 | Adds: cross-domain acceptance tests NT-009, FR-012/FR-013 | Cross-domain evidence, test |
| SI-10 | AZ-002, CTL-012 | Adds: federation tests NT-010, FR-013 | Test |
| SI-11 | None | New: registration-vs-proof control, tests NT-011, FR-005 | Test |
| SI-12 | None | New: binding-ceremony audit control, review NT-012, FR-046 | Architecture-review evidence + test |
| SI-13 | None | New: bootstrap scoping control, tests NT-013, FR-053 | Test; crypto proof where bound |
| SI-14 | None | New: transition-record control, tests NT-014, FR-046 | Test + review |
| SI-15 | None | New: independent-basis recovery control, review NT-015, FR-046 | Architecture-review evidence + drill |
| SI-16 | None | New: re-justification control, review NT-016, FR-046 | Architecture-review evidence + test |
| SI-17 | AZ-011, AZ-012 | Adds: bounded-semantics tests NT-017, FR-007 | Test |
| SI-18 | None (implied by AZ-012) | New: explicit attestation-trust configuration, tests NT-018, FR-007/FR-009 | Review + test |
| SI-19 | CTL-002 | Adds: provenance-independence tests NT-019, FR-011 | Test |
| SI-20 | AZ-007, AZ-008, CTL-002 | Adds: amplification tests NT-020, FR-011 | Test; crypto proof where bound |
| SI-21 | None (implied by AZ-008) | New: explicit redelegation-permission tests NT-021, FR-011 | Test |
| SI-22 | AZ-015, CTL-004, CTL-009 | Adds: basis-change re-evaluation tests NT-022, FR-012/FR-011 | Continuous verification; crypto proof |
| SI-23 | AZ-003 | Adds: role-distinction tests NT-023, FR-011 | Test + review |
| SI-24 | AZ-007 | Adds: composition-rule tests NT-024, FR-013 | Test + review |
| SI-25 | AZ-009 | Adds: agent-authority tests NT-025, FR-013 | Test; runtime isolation where applicable |
| SI-26 | AZ-010 | Adds: invocation-vs-delegation tests NT-026, FR-011 | Test |
| SI-27 | AZ-002 | Adds: identity-insufficiency tests NT-027, FR-013 | Test |
| SI-28 | AZ-008, CTL-012 | Adds: local-acceptance tests NT-028, FR-011 | Cross-domain evidence, test |
| SI-29 | None | New: requester-context preservation control, tests NT-029, FR-015 | Transaction binding; test |
| SI-30 | ENF-001, ENF-002, ENF-006, CTL-007 | Adds: complete-mediation tests NT-030, FR-015 | Test; runtime isolation of path |
| SI-31 | AZ-019, AZ-022, CTL-011 | Adds: full failure-test catalog (section 15), NT-031 | Test; continuous verification |
| SI-32 | None (FM-04 defined in failure model) | New: procedure-separation tests NT-032, FR-046 | Review + drill |
| SI-33 | None | New: dependency-map query tests NT-033, FR-046 | Review + test |
| SI-34 | Referenced in Task 5 traceability | New: shared-path analysis requirement, review NT-034, FR-041 | Architecture-review evidence |
| SI-35 | AZ-021, ENF-010 | Adds: context-preservation tests NT-035, FR-016 | Test + review |
| SI-36 | AZ-003 (provenance) | Adds: post-revocation interpretability tests NT-036, FR-016 | Test; crypto proof; transaction binding |
| SI-37 | None | New: per-authority governance records, review NT-037, FR-046 | Architecture-review evidence |
| SI-38 | ENF-005, ENF-007, CTL-006 | Adds: governed-change tests NT-038, FR-016 | Test + review |

### 17.1 Invariants Requiring Cryptographic Proof

Per the Sprint 2 plan deliverables: SI-13 (where bootstrap scope is cryptographically bound), SI-20 (delegation grant integrity), SI-22 (artifact signature validity distinguished from authority validity), SI-36 (audit record integrity digests). `IV-012` requires algorithm, key identifier, and trust anchor recorded for each.

### 17.2 Invariants Requiring Runtime Isolation

SI-25 (agent vs host authority boundary where the boundary is a runtime boundary), SI-30 (enforcement path isolation from unmediated paths).

### 17.3 Invariants Requiring Continuous Verification

SI-03 (independent lifecycle re-evaluation), SI-22 (authority-basis change re-evaluation), SI-31 (freshness-bound re-evaluation).

### 17.4 Invariants Requiring Transaction Binding

SI-29 (requester authority preserved per request), SI-36 (provenance recorded per action).

### 17.5 Invariants Requiring Cross-Domain Evidence

SI-09, SI-10, SI-28 (receiving-domain policy evaluation of foreign material).

### 17.6 Invariants Verified Primarily by Architecture Review

SI-06 (topology vs trust semantics), SI-12 (binding ceremony auditability), SI-15 (recovery basis independence), SI-16 (re-justification), SI-34 (correlated compromise analysis), SI-37 (per-authority governance). Each has recorded review artifacts per `IV-007`, plus runtime or drill tests where defined above. Review-verified does not mean unverified.

---

# Acceptance

## 18. Acceptance Criteria

Task 7 passes when:

* Every invariant SI-01 through SI-38 has the full seven-element verification trace.
* Required controls are stated implementation-neutrally; no technology is selected.
* Every applicable invariant has at least one negative test designed to produce the forbidden state.
* Every applicable invariant has failure tests against the relevant Task 6 failure states.
* Verification classes are assigned honestly, including architecture-review evidence where no runtime check exists.
* Invariants requiring cryptographic proof, runtime isolation, continuous verification, transaction binding, or cross-domain evidence are explicitly classified (sections 17.1 through 17.5).
* Evidence requirements define what proves a test ran and what it showed, preserving assurance-state distinctions.
* The coverage matrix shows Task 5 control coverage vs Task 7 closure for all 38 invariants with no unaddressed invariant.
* Forward references to Task 6 (`FR-012` through `FR-053`) are reconciled at Task 6 acceptance.
* No implementation is claimed as tested, observed, or enforced on the basis of this task; these are required tests, not results.
* Mechanical document validation passes (all cited repo paths exist; requirement IDs are unique).
* Semantic architecture review passes.

## 19. Failure Modes

Task 7 fails if:

* Any invariant lacks a trace element (control, enforcement point, positive test, negative test, failure test, or evidence).
* Negative tests are omitted or reduced to success-path assertions.
* Failure tests assume normal operation only.
* An invariant is marked verified by a runtime check that cannot actually observe the property (e.g., claiming a unit test proves SI-06).
* Architecture-review evidence is used as a waiver instead of recorded review with findings and re-review triggers.
* Cryptographic proof is claimed without recorded algorithm, key, and anchor (`IV-012`).
* A technology or product is selected or implied as required.
* Evidence states are conflated (tested recorded as enforced).
* A forward reference to Task 6 is left unreconciled at sprint exit.

## 20. Definition of Done

Task 7 content is ready for acceptance when:

* [x] All 38 invariant traces are defined with control, enforcement point, positive test, negative test, failure test, evidence, and verification class.
* [x] `IV-001` through `IV-012` are defined.
* [x] The negative-test catalog (`NT-001` through `NT-038`) is defined.
* [x] The failure-test catalog (sections 15.1 through 15.12) is defined with `FM-01` through `FM-17` governance.
* [x] Evidence record shapes (verification and review) are defined.
* [x] The coverage matrix maps every SI to Task 5 controls and Task 7 closure.
* [x] Verification-class classifications (17.1 through 17.6) are recorded.
* [x] Task 6 forward references (`FR-012` through `FR-053`) are defined with intended meanings.
* [x] Technology neutrality is preserved (no product, protocol, or vendor selected).
* [x] No claim of tested, observed, or enforced implementation is made.
* [x] Mechanical document validation passes.
* [x] Semantic architecture review passes.

### Repository Closure Gate

Task 7 is not formally **COMPLETE** until:

* The accepted artifact is committed.
* The commit is pushed to `origin/main`.
* `HEAD == origin/main`.
* The working tree is clean.

---

# Proposed Decision

## 21. Task 7 Decision

The proposed Task 7 decision is:

> **Sprint 2 shall treat every accepted security invariant as carrying a mandatory seven-element verification contract: the invariant, the required control, the required enforcement point, a positive test, a negative test designed to produce the forbidden state, a failure test against explicit degraded-operation semantics, and the evidence proving what the tests showed. An implementation shall not claim an invariant is technically enforced until the corresponding verification evidence exists, with assurance states (proposed, accepted, implemented, tested, observed, enforced) preserved distinctly. Invariants that cannot be verified by a runtime check shall be verified by recorded architecture review with findings and re-review triggers, honestly labeled as such.**

This is a derived architecture-to-implementation requirement.

It does not select test tooling, implementation technology, or deployment topology.

## 22. ADR Assessment

The invariants artifact (section 50) left open whether its candidate decisions require a dedicated ADR, to be determined during Task 7 acceptance.

Assessment: Task 7 introduces no materially new cross-platform architecture decision. The seven-element trace operationalizes the verification model already proposed in the invariants artifact (section 44) and the traceability chain required by the Sprint 2 plan. The verification classes answer the invariants artifact's open questions (section 51) as testability classifications, not as new architecture.

No new ADR is proposed by Task 7. If semantic review finds that the verification contract changes the meaning of any accepted invariant or ADR, the Control Plane must stop and record that decision through ADR governance before acceptance.

---

## References

* `docs/sprints/sprint-02-plan.md`
* `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
* `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
* `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
* `docs/sprints/sprint-02-task-04-authority-trust-anchor-and-governance-matrix.md`
* `docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md`
* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/threat-model.md`
* `docs/architecture/security-invariants.md`
* `docs/architecture/failure-model.md`
* `docs/architecture/system-context-architecture.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`
* `docs/adr/0006-security-invariants-as-architecture-constraints.md`
* `docs/adr/0007-explicit-bounded-security-failure-semantics.md`
* `docs/adr/0008-separate-trust-coordination-from-runtime-enforcement-and-authority-ownership.md`
