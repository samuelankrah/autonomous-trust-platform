# Sprint 2 Task 10: Component Mapping and Technology-Selection Gate

**Project:** Autonomous Trust Platform
**Sprint:** Sprint 2: Trust Control Contracts & Technology Evaluation Gate
**Task:** Task 10: Component Mapping and Technology-Selection Gate
**Status:** Accepted
**Task Date:** 2026-10-06
**Accepted Date:** 2026-10-06
**Semantic Review:** PASS
**Owner:** Trust Platform - Control Plane
**Repository Baseline:** `0b603e857e37204e3b4661ecc5bf43778486a50e`
**Roadmap Authority:** `docs/sprints/sprint-02-plan.md`
**Traceability Baseline:** `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
**Role Capability Baseline:** `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
**Interface Contract Baseline:** `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
**Authority / Anchor Baseline:** `docs/sprints/sprint-02-task-04-authority-trust-anchor-and-governance-matrix.md`
**Authorization / Enforcement Baseline:** `docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md`
**Forward References:** `docs/sprints/sprint-02-task-06-failure-degraded-mode-recovery-matrix.md`, `docs/sprints/sprint-02-task-07-invariant-verification-matrix.md`, `docs/sprints/sprint-02-task-08-specialist-work-packages.md`, `docs/sprints/sprint-02-task-09-technology-evaluation-framework.md`

---

## 1. Objective

Determine whether the accepted Sprint 2 architecture is sufficiently specified to begin formal candidate-technology evaluations, and define the gate that every evaluation must pass through.

The governing question is:

> **Can a candidate technology now be mapped to logical components, evaluated against explicit contracts, and accepted or rejected without redefining the architecture, and if not, which questions still block evaluation?**

Task 10 integrates the contract stack produced by Tasks 1 through 9 into:

* A logical component map derived from the Task 2 role inventory
* A required capability map per component
* A trust interface map per component boundary
* An authority and trust-anchor matrix reference
* An enforcement map
* A failure matrix reference
* An invariant verification map reference
* An approved specialist research backlog
* An explicit list of unresolved blocking questions
* The exit decision criteria for the Sprint 2 gate itself

Task 10 does not select a technology.

No product has been standardized by Sprint 2.

---

## 2. Why This Task Matters

Sprint 2 converted accepted architecture into testable contracts.

Without Task 10, those contracts remain a collection of documents with no defined point of entry for technology evaluation.

The gate exists to prevent the failure mode the Sprint 2 plan was written to avoid:

```text
Interesting product
        ↓
Retroactive architecture justification
        ↓
Product features redefine requirements
```

Task 10 therefore answers the plan's Task 10 exit questions with pointers to the exact artifacts that answer them, names the questions that remain unanswered, and states the conditions under which evaluation may begin.

The architecture preserves:

```text
Logical Component
        ≠
Product
        ≠
Deployment Unit
        ≠
Vendor
```

A logical component is an implementation-neutral grouping of architecture roles used to organize evaluation.

It is not a purchase decision, a deployment topology, or a vendor shortlist.

---

# Gate Requirements

## 3. CM-001: Component Map Completeness

**Requirement ID:** `CM-001`

Every accepted architecture role (`ROLE-001` through `ROLE-017`) must map to exactly one primary logical component or be explicitly designated as cross-cutting with named embodying components.

No role may be unmapped.

No role may be mapped to a product.

## 4. CM-002: No Technology Selection

**Requirement ID:** `CM-002`

The component map, capability map, interface map, authority matrix, enforcement map, failure matrix, and verification map must not select, shortlist, recommend, or disqualify any specific product, vendor, or protocol.

Candidate capability classes remain implementation-neutral categories as defined in Task 2.

Any sentence in a Sprint 2 artifact that names a specific product must be read as an example of a capability class, never as a selection.

## 5. CM-003: Co-location Preserves Role Boundaries

**Requirement ID:** `CM-003`

Where a logical component implements more than one role, the component must preserve the logical distinctions required by:

* Task 2 cross-role constraints (sections 225 through 227)
* Task 5 co-location rules (sections 70 through 72)

In particular:

* `ROLE-011`, `ROLE-012`, and `ROLE-013` may be co-located only if Policy Authority, Authorization Decision Function, and Enforcement Point remain logically distinguishable with separate failure states and audit evidence.
* `ROLE-012` and `ROLE-013` may be co-located only if decision semantics, enforcement semantics, failure states, and audit evidence remain distinguished.
* Resource-embedded enforcement (`ROLE-013` within `ROLE-014`) is permitted only with demonstrated complete mediation, decision correctness, alternate-path control, auditability, and failure handling.

```text
Same Component
        ≠
Same Architecture Role
```

```text
Same Component
        ≠
Same Authority
```

## 6. CM-004: Capability Map Per Component

**Requirement ID:** `CM-004`

Each logical component must state the required capabilities derived from the Task 2 capability contracts of the roles it implements.

Capabilities are stated as evaluation requirements, not as current implementation claims.

## 7. CM-005: Interface Map Per Component Boundary

**Requirement ID:** `CM-005`

Each logical component boundary must state which Task 3 `EDGE-xxx` contracts it produces or consumes.

A component boundary with an uncontracted trust-relevant flow is non-conformant.

## 8. CM-006: Authority and Anchor Reference Per Component

**Requirement ID:** `CM-006`

Each logical component must reference the Task 4 `AUTH-xxx` authorities it exercises and the trust anchors or verification bases it relies upon.

A component that cannot name its authority basis is not evaluable.

## 9. CM-007: Enforcement Map

**Requirement ID:** `CM-007`

The gate must identify which logical components host enforcement points (`ROLE-013`), which protected operations each enforcement point mediates, and which Task 5 `ENF-xxx` requirements apply.

## 10. CM-008: Failure Matrix Reference

**Requirement ID:** `CM-008`

Each logical component must reference the applicable Task 6 failure requirements (`FR-xxx`, defined normatively in `docs/sprints/sprint-02-task-06-failure-degraded-mode-recovery-matrix.md`).

A component whose failure behavior is undefined cannot enter technology evaluation.

## 11. CM-009: Invariant Verification Reference

**Requirement ID:** `CM-009`

Each logical component must reference the applicable Task 7 invariant verification traces (per-invariant rows in sections 6 through 13 of `docs/sprints/sprint-02-task-07-invariant-verification-matrix.md`).

A component that cannot state how its invariants will be verified cannot enter technology evaluation.

## 12. CM-010: Specialist Backlog Approval

**Requirement ID:** `CM-010`

The gate approves the specialist research backlog (`WP-001` through `WP-004`, defined normatively in `docs/sprints/sprint-02-task-08-specialist-work-packages.md`) as the only authorized route for the deep-domain questions listed in section 34.

No specialist output may standardize a technology or redefine architecture; all outputs return to Control Plane as requirements, evidence, and tradeoffs.

## 13. CM-011: Blocking Questions Answered or Explicitly Deferred

**Requirement ID:** `CM-011`

The unresolved blocking questions in section 35 must be answered, or explicitly deferred with a recorded Control Plane decision stating what evaluation may proceed without the answer and what risk the deferral accepts, before the corresponding technology evaluation begins.

Silent deferral is non-conformant.

## 14. CM-012: Evaluation Entry Criteria

**Requirement ID:** `CM-012`

A candidate technology may enter formal evaluation only when the evaluator can answer all 14 exit questions in section 36 with pointers to accepted artifacts.

If any exit question cannot be answered from accepted architecture, the evaluation is premature and must wait for the blocking artifact or decision.

## 15. CM-013: No Standardization Without the Gate

**Requirement ID:** `CM-013`

No technology may be described as selected, standardized, approved, or preferred for the platform until it has passed the Task 9 evaluation framework and this Task 10 gate.

The evidence states defined in the Sprint 2 plan remain distinct:

```text
Candidate Technology
        ≠
Selected Technology
        ≠
Implemented
        ≠
Tested
        ≠
Observed
        ≠
Enforced
```

## 16. CM-014: Exit Decision Rule

**Requirement ID:** `CM-014`

The Sprint 2 exit decision is governed by the criteria in section 37.

A PASS records that the platform has an implementation-neutral, testable evaluation contract suitable for disciplined technology selection.

A PASS does not select any technology and does not claim implementation, enforcement, or production readiness.

# Logical Component Map

## 17. Component Allocation

The following logical components group the Task 2 role inventory for evaluation purposes.

Each component is implementation-neutral.

Two roles are cross-cutting and are embodied within named components rather than standing alone.

| Component | Roles Implemented | Basis |
|---|---|---|
| LC-01 Identity Issuance | ROLE-003 | Single-authority component; issuance scope must remain bounded |
| LC-02 Identity Validation | ROLE-004 | Validation is separate from issuance (SI-01, SI-27) |
| LC-03 Runtime and Attestation Evidence | ROLE-002, ROLE-005 | Co-location permitted by Task 2 section 66; risks explicitly carried |
| LC-04 Attestation Appraisal | ROLE-006 | Verifier is separate from Attester (SI-17, SI-18) |
| LC-05 Delegation Governance | ROLE-008, ROLE-009 | Co-location permitted by Task 2 section 105; Source, Delegator, Issuer remain distinguishable (SI-23) |
| LC-06 Delegation Issuance | ROLE-010 | Kept separate from LC-05 so artifact validity cannot be mistaken for authority validity (SI-22, SI-23) |
| LC-07 Policy Administration and Authorization Decision | ROLE-011, ROLE-012 | Co-location permitted by Task 5 section 71; logical distinction and shared-compromise evaluation required |
| LC-08 Enforcement | ROLE-013, ROLE-014 (governed target) | Enforcement point with its protected resource scope; resource-embedded enforcement permitted per Task 5 section 72 with complete-mediation proof |
| LC-09 Audit and Evidence | ROLE-015 | Independent evidence custody; protected actor must not control all evidence of its own actions |
| LC-10 Recovery | ROLE-016 | Privileged recovery authority with independent trust basis (SI-15) |
| LC-11 Trust Coordination | ROLE-017 | Coordinates trust state; explicitly not a universal authority (ADR-0008) |
| Cross-cutting CC-01 | ROLE-001 Logical Principal | Embodied in LC-02, LC-03, LC-05, LC-07 wherever principal context is represented |
| Cross-cutting CC-02 | ROLE-007 Relying Function | Embodied in LC-01 (bootstrap evaluator), LC-02, LC-04 consumers, LC-07 wherever evidence is consumed for a local purpose |

Role coverage check: `ROLE-001` through `ROLE-017` are all mapped.

No role is mapped to more than one primary component.

No role is mapped to a product.

## 18. Co-location Constraints Carried Into Evaluation

The following constraints from the accepted contract stack bind every component mapping and every future technology evaluation:

* LC-03 carries the Task 2 section 66 co-location risks: Attester compromise may coincide with runtime compromise; host-controlled evidence paths must not be treated as independent; evidence must not be interpreted beyond its intended scope.
* LC-05 carries the Task 2 section 119 constraint: co-location must not obscure `Authority Source ≠ Delegator ≠ Delegation Issuer`.
* LC-06 exists as a separate component precisely to keep that distinction evaluable: a compromised or failed issuer must be analyzable independently from the authority source and the delegator.
* LC-07 carries the Task 5 section 71 constraint: a single product implementing `ROLE-011`, `ROLE-012`, and `ROLE-013` does not eliminate the logical distinction; shared compromise and shared administrative control must be evaluated.
* LC-08 carries the Task 5 section 70 constraint: where decision and enforcement are co-located, decision semantics, enforcement semantics, failure states, and audit evidence must remain distinguished.
* LC-11 carries the ADR-0008 constraint: coordination of trust state must never be evaluated as ownership of identity, policy, delegation, authorization, enforcement, recovery, or trust-anchor authority.

# Required Capability Map

## 19. Per-Component Required Capabilities

Capabilities are derived from the Task 2 capability contracts of the implemented roles.

They are evaluation requirements, not implementation claims.

| Component | Required Capabilities |
|---|---|
| LC-01 | Issue identity material within defined scope; bind approved identity claims to credentials; renew credentials; revoke or invalidate issued material; rotate issuer keys and trust anchors; govern namespace lifecycle; record issuance, renewal, revocation, binding changes, and administrative actions for audit |
| LC-02 | Validate presented identity evidence against issuer, trust anchor, validation rules, namespace, audience, freshness, and revocation state; produce distinguishable `VALID`, `INVALID`, `UNKNOWN` results; apply local acceptance policy; preserve validation metadata for audit reconstruction |
| LC-03 | Present verifiable runtime identity; produce Attestation Evidence with freshness and replay resistance; maintain principal-to-runtime binding context; support runtime identity lifecycle including renewal, binding changes, and revocation; distinguish runtime identity from logical-principal identity in all outputs |
| LC-04 | Appraise Attestation Evidence against reference values, endorsements, and appraisal policy; produce Attestation Result with accepted or rejected claims, freshness state, failure state, and provenance; support endorsement revocation and reference-value lifecycle |
| LC-05 | Represent delegable authority with provenance, scope, constraints, expiration, and revocation basis; produce bounded delegation grants within legitimately held delegable authority; enforce non-amplification (`GrantedAuthority ⊆ DelegableAuthority`); support grant expiration, revocation, scope reduction, and redelegation restrictions |
| LC-06 | Materialize approved delegation grants as integrity-protected artifacts with issuer metadata and validity information; rotate signing keys; support artifact invalidation independent of authority-source state; never create authority by issuance alone |
| LC-07 | Govern policy within explicit scope with versioning, effective time, and distribution state; evaluate authorization context to `PERMIT`, `DENY`, or `INDETERMINATE`; preserve authority provenance; enforce input-specific freshness; bound cached decisions; bind decisions to transactions where required; identify policy version in decisions |
| LC-08 | Mediate every protected path for its resource scope; validate decision source and decision-to-request binding; apply decision constraints or reject; govern bypass as explicit authority; produce observable enforcement outcomes correlated to decisions; demonstrate complete mediation including alternate paths |
| LC-09 | Accept, integrity-protect, and durably preserve audit evidence from all components; support correlation of decisions to enforcement outcomes; enforce retention and evidence-access policy; remain independently custodial from the actors it records |
| LC-10 | Execute explicitly governed recovery actions from an independent trust basis; require named initiators, approvals, and audit; support emergency credential lifecycle, replacement trust-anchor activation, and retirement of emergency authority; trigger re-validation of restored state |
| LC-11 | Coordinate trust-domain configuration, trust-anchor state, policy distribution, federation relationships, revocation configuration, and degraded-mode policy; distribute trust material without becoming the authority behind it; record all security-relevant trust-state changes |

# Trust Interface Map

## 20. Component Boundary Interfaces

Each boundary states the Task 3 `EDGE-xxx` contracts the component produces (P) or consumes (C).

| Component | Produces | Consumes |
|---|---|---|
| LC-01 Identity Issuance | EDGE-001 (identity assertion) | EDGE-011 (revocation state), EDGE-012 (trust-anchor distribution), EDGE-013 (audit evidence), EDGE-014 (recovery action) |
| LC-02 Identity Validation | EDGE-001 (validation result), EDGE-013 | EDGE-001 (presented assertion), EDGE-011, EDGE-012, EDGE-015 (cross-domain assertion) |
| LC-03 Runtime and Attestation Evidence | EDGE-002 (principal-to-runtime binding), EDGE-003 (attestation evidence) | EDGE-012, EDGE-014 |
| LC-04 Attestation Appraisal | EDGE-004 (attestation result), EDGE-013 | EDGE-003, EDGE-012 |
| LC-05 Delegation Governance | EDGE-005 (delegation grant) | EDGE-011, EDGE-013, EDGE-014 |
| LC-06 Delegation Issuance | EDGE-005 (materialized artifact), EDGE-013 | EDGE-005 (approved grant from LC-05) |
| LC-07 Policy Administration and Authorization Decision | EDGE-006 (delegation validation result, where ADF performs local validation), EDGE-009 (authorization decision), EDGE-013 | EDGE-001 (validation result), EDGE-004, EDGE-005, EDGE-006, EDGE-007 (policy distribution), EDGE-008 (authorization context), EDGE-011, EDGE-015 |
| LC-08 Enforcement | EDGE-010 (enforcement outcome), EDGE-013 | EDGE-007 (enforcement configuration), EDGE-009 |
| LC-09 Audit and Evidence | EDGE-013 | EDGE-001, EDGE-002, EDGE-003, EDGE-004, EDGE-005, EDGE-006, EDGE-008, EDGE-009, EDGE-010, EDGE-011, EDGE-012, EDGE-014, EDGE-015 (evidence from all producers) |
| LC-10 Recovery | EDGE-014, EDGE-013 | EDGE-012, EDGE-013 |
| LC-11 Trust Coordination | EDGE-007 (distribution), EDGE-012, EDGE-015 | EDGE-013, EDGE-014 |

A component boundary carrying a trust-relevant flow not covered by a listed `EDGE-xxx` contract is a gap that must be closed before evaluation, either by extending the Task 3 contract set through Control Plane review or by demonstrating the flow is not trust-relevant.

# Authority and Trust-Anchor Matrix Reference

## 21. Component Authority References

Each component references the Task 4 `AUTH-xxx` authorities it exercises.

The Task 4 matrix remains normative for lifecycle, custody, rotation, revocation, compromise response, and governance requirements.

| Component | AUTH References | Authority Notes |
|---|---|---|
| LC-01 | AUTH-001 | Exercises identity issuance authority within its defined scope; does not authorize application actions |
| LC-02 | (validates under AUTH-001 trust basis) | Holds no issuance authority; validation acceptance is purpose-scoped |
| LC-03 | AUTH-002, AUTH-003 | Binding authority and attestation evidence production; binding changes are security-relevant trust-state changes |
| LC-04 | AUTH-004 | Attestation appraisal authority; appraisal policy is not authorization policy |
| LC-05 | AUTH-005, AUTH-006 | Delegable authority source and delegator authority; grant scope bounded by legitimately held authority |
| LC-06 | AUTH-007 | Issuance authority for representations only; artifact validity never creates underlying authority |
| LC-07 | AUTH-008, AUTH-009 | Policy governance and authorization decision authority within explicit authorization domains |
| LC-08 | AUTH-010 | Enforcement authority: technical power to permit, deny, constrain, or mediate protected operations |
| LC-09 | (evidence custody under ROLE-015) | Holds evidence preservation authority; explicitly holds no authorization, identity, or delegation authority |
| LC-10 | (recovery aspects of AUTH-001 through AUTH-011) | Exercises recovery authority per each authority's Task 4 recovery fields; requires independent trust basis |
| LC-11 | (coordination aspects; no AUTH ownership) | Coordinates trust-anchor and policy state; coordination is not ownership of any `AUTH-xxx` authority |

AUTH-011 (Revocation Authority) is exercised in a function-scoped manner by LC-01 (identity material), LC-05 and LC-06 (delegation grants), LC-07 (policy supersession), and LC-11 (revocation configuration coordination), consistent with Task 2 section 229.

# Enforcement Map

## 22. Enforcement Points by Component

| Enforcement Host | Roles | Protected Scope | Applicable ENF Requirements |
|---|---|---|---|
| LC-08 Enforcement | ROLE-013 | All protected operations within its resource scope, per the Task 5 protected-resource mapping model (section 58) | ENF-001 through ENF-012 |
| LC-07 (co-located, conditional) | ROLE-012 + ROLE-013 | Only where a conforming implementation demonstrates distinguished decision semantics, enforcement semantics, failure states, and audit evidence per Task 5 section 70 | ENF-001 through ENF-012, plus CTL-008 correlation |
| LC-08 resource-embedded (conditional) | ROLE-013 within ROLE-014 | Only where the resource demonstrates complete mediation, decision correctness, alternate-path control, auditability, and failure handling per Task 5 section 72 | ENF-001, ENF-002, ENF-006, ENF-010, ENF-011 |

Administrative actions are protected actions per Task 5 section 60.

The following must appear in the enforcement map before evaluation and must each name their enforcement point:

* Trust-anchor changes (LC-11 coordinated, LC-01 and LC-10 executed)
* Policy changes (LC-07)
* Federation enablement and changes (LC-11)
* Delegation root changes (LC-05)
* Bypass enablement (LC-08, governed per ENF-007)
* Audit retention changes (LC-09)
* Recovery invocation (LC-10)

An evaluation that cannot name the enforcement point for a protected administrative action is incomplete.

# Failure Matrix Reference

## 23. Failure Requirement Allocation

The Task 6 artifact (`docs/sprints/sprint-02-task-06-failure-degraded-mode-recovery-matrix.md`) is normative for all `FR-xxx` requirements.

Each `FR-xxx` must define, per the Sprint 2 plan Task 6 deliverables: required failure classification, allowed bounded continuation, forbidden authority expansion, freshness threshold, trusted-time dependency, cached-state semantics, recovery trigger, re-validation requirement, audit requirement, and resource-specific shutdown condition.

The following allocation binds failure requirements to components for evaluation:

| FR ID | Failure Dependency Class | Primary Components |
|---|---|---|
| FR-004, FR-005 | Identity issuance and validation failure (issuer unavailable, validation dependency unavailable) | LC-01, LC-02 |
| FR-005 | Principal-to-runtime binding failure (binding unknown, stale, or inconsistent) | LC-03, LC-02, LC-07 |
| FR-007 | Attestation evidence and verifier failure (attester unavailable, evidence stale, verifier unavailable) | LC-03, LC-04, LC-07 |
| FR-008, FR-009 | Trust-anchor and trust-bundle failure (stale bundle, distribution unavailable, anchor rotation in flight) | LC-11, LC-01, LC-02, LC-04, LC-10 |
| FR-010 | Federation and cross-domain assertion failure (peer unavailable, verification unavailable) | LC-11, LC-02, LC-07 |
| FR-011 | Delegation validation failure (grant unverifiable, issuer unavailable) | LC-05, LC-06, LC-07 |
| FR-012 | Revocation state failure (`unknown ≠ not revoked`; disconnected revocation evaluation) | LC-01, LC-02, LC-05, LC-07, LC-11 |
| FR-013 | Policy distribution and policy engine failure (engine unavailable, version divergence) | LC-11, LC-07 |
| FR-014 | Authorization decision service failure (decision unavailable, timed out, indeterminate) | LC-07, LC-08 |
| FR-015 | Enforcement point failure (enforcement unavailable, decision delivery failure, partial enforcement) | LC-08 |
| FR-016 | Audit destination failure (buffering, loss, reconciliation) | LC-09, all producers |
| FR-017 | Recovery infrastructure failure (recovery authority unavailable, shared failure domains) | LC-10 |
| FR-023, FR-024, FR-025, FR-026 | Trusted-time failure (clock skew, rollback, time-source unavailability, cross-component inconsistency) | All components |
| FR-051 | Network partition and inconsistent security state (split-brain revocation, policy, trust material) | LC-11, LC-07, LC-02 |
| FR-044 | Correlated and cascading failure (shared control plane, database, administrator, key management) | LC-11, LC-09 |
| FR-041, FR-042 | Compound degraded-state composition (multiple simultaneous degradations evaluated jointly) | LC-07, LC-08 |
| FR-045, FR-046, FR-047, FR-048, FR-049, FR-050 | Recovery and return to service (re-validation, deferred revocation and policy reconciliation, ordered restoration) | LC-10, LC-11, all components |
| FR-053, FR-054, FR-055, FR-056, FR-057 | Emergency authority invocation (break-glass trigger, governance, expiration, retirement) | LC-10, LC-08 |

A candidate technology evaluation must state, for each `FR-xxx` applicable to the component under evaluation, the technology's failure classification behavior and demonstrate that no failure mode silently increases authority (FM-01).

`COMPROMISED` remains a distinct condition from availability failure in every `FR-xxx` (FM-04).

# Invariant Verification Map Reference

## 24. Invariant Verification Allocation

The Task 7 artifact (`docs/sprints/sprint-02-task-07-invariant-verification-matrix.md`) is normative for the verification trace of each invariant.

Each trace maps one accepted security invariant to its required control, enforcement point, positive test, negative test, failure test, and required evidence, per the Sprint 2 plan Task 7 deliverables. (Task 7 also defines standalone verification requirements `IV-001` through `IV-012`; those requirement IDs are distinct from the per-invariant rows in this table.)

| IV ID | Invariant | Short Title | Primary Components |
|---|---|---|---|
| Invariant | Task 7 Trace | Short Title | Primary Components |
|---|---|---|---|
| SI-02 | Section 6 | Runtime authentication does not establish logical actor identity | LC-03, LC-02, LC-07 |
| SI-03 | Section 6 | Identity and authority lifecycles independent | LC-01, LC-05, LC-07 |
| SI-04 | Section 6 | Infrastructure identity does not become workload identity | LC-03 |
| SI-05 | Section 6 | Principal boundaries remain distinguishable | LC-03, LC-07 |
| SI-06 | Section 7 | Deployment topology does not define trust semantics | LC-11, LC-08 |
| SI-07 | Section 7 | Trust remains function-scoped | LC-11 |
| SI-08 | Section 7 | Trust not automatically symmetric or transitive | LC-11, LC-02 |
| SI-09 | Section 7 | Cross-domain acceptance explicit | LC-11, LC-02, LC-07 |
| SI-10 | Section 7 | Authentication federation does not imply authorization federation | LC-02, LC-07 |
| SI-11 | Section 8 | Registration is not current runtime proof | LC-01, LC-03 |
| SI-12 | Section 8 | Strong routine credentials cannot repair incorrect bootstrap binding | LC-01, LC-03, LC-10 |
| SI-13 | Section 8 | Bootstrap authority remains bootstrap-scoped | LC-01, LC-10 |
| SI-14 | Section 8 | Bootstrap transition explicit | LC-01, LC-10 |
| SI-15 | Section 8 | Compromise recovery requires independent trust basis | LC-10 |
| SI-16 | Section 8 | Re-bootstrap must not silently inherit previous trust | LC-01, LC-10 |
| SI-17 | Section 9 | Attestation semantics remain bounded | LC-03, LC-04, LC-07 |
| SI-18 | Section 9 | Attestation trust explicit | LC-04 |
| SI-19 | Section 10 | Authentication does not establish delegated authority | LC-02, LC-05, LC-07 |
| SI-20 | Section 10 | Delegated authority must not amplify | LC-05, LC-06, LC-07 |
| SI-21 | Section 10 | Redelegation requires explicit permission | LC-05, LC-06 |
| SI-22 | Section 10 | Delegation artifact validity does not create independent authority source | LC-06, LC-07 |
| SI-23 | Section 10 | Delegation issuer is not automatically the authority source | LC-05, LC-06 |
| SI-24 | Section 10 | Multiple authority sources must not be implicitly unioned | LC-07 |
| SI-25 | Section 10 | Hosting workload authority does not become agent authority | LC-03, LC-07 |
| SI-26 | Section 10 | Tool invocation is not automatically redelegation | LC-07, LC-08 |
| SI-27 | Section 11 | Identity is not authorization | LC-02, LC-07 |
| SI-28 | Section 11 | External delegation remains subject to local authorization | LC-07, LC-11 |
| SI-29 | Section 11 | Requester authority not replaced by ambient deputy authority | LC-07, LC-08 |
| SI-30 | Section 11 | Authorization requires effective enforcement | LC-07, LC-08 |
| SI-31 | Section 12 | Failure or uncertainty must not silently increase authority | All components (via FR-001 through FR-018) |
| SI-32 | Section 12 | Compromise and availability failure remain distinct | LC-10, LC-09 |
| SI-33 | Section 12 | Compromise dependencies traceable | LC-09, LC-11 |
| SI-34 | Section 12 | Security functions must not hide correlated compromise | LC-09, LC-11 |
| SI-35 | Section 13 | Security-relevant actions preserve principal context | LC-07, LC-08, LC-09 |
| SI-36 | Section 13 | Delegated actions preserve authority provenance | LC-05, LC-06, LC-07, LC-09 |
| SI-37 | Section 13 | Security authorities remain architecturally distinguishable | All components |
| SI-38 | Section 13 | Security-relevant trust-state changes governed | LC-11, LC-09, LC-10 |

A candidate technology that cannot be mapped to the invariant rows for its component is not evaluable for that component.

# Approved Specialist Research Backlog

## 25. Work Package Approval

The gate approves the following specialist work packages as the only authorized route for the deep-domain questions below.

Definitions are normative in `docs/sprints/sprint-02-task-08-specialist-work-packages.md`.

Specialist outputs return requirements, evidence, and tradeoffs to Control Plane.

No specialist project may standardize a technology or make a cross-platform architecture decision independently.

### WP-001: Identity Work Package

Routed to: Trust Platform: Identity.

Questions:

* Logical-principal versus workload identity requirements
* Principal-to-runtime binding
* Identity participation in authorization
* Identity trust-domain requirements
* Bootstrap implications for identity binding

Primary components affected: LC-01, LC-02, LC-03.

### WP-002: Attestation and Standards Work Package

Routed to: Trust Platform: Research for standards comparison; Trust Platform: Identity for identity-specific integration.

Questions:

* RATS / EAT role mapping
* WIMSE role mapping
* SPIFFE / SPIRE role mapping
* SPICE role mapping
* SCITT role mapping
* Attestation verifier trust requirements
* Evidence freshness and replay considerations

Primary components affected: LC-03, LC-04, LC-11.

### WP-003: AI Work Package

Routed to: Trust Platform: AI.

Questions:

* Logical AI-agent principal model implications
* Agent-to-runtime attribution requirements
* Tool invocation versus delegated authority
* Agent authority provenance
* Agent-specific audit reconstruction requirements

Primary components affected: LC-03, LC-05, LC-07, LC-08, LC-09.

### WP-004: Implementation Feasibility Work Package

Routed to: Trust Platform: Implementation, only after architecture requirements are stable.

Questions:

* Candidate component feasibility
* Lab prerequisites
* Integration complexity
* Observability requirements
* Reproducibility requirements

Primary components affected: all.

## 26. Work Package Integration Rule

A specialist output is integrated only when Control Plane records:

* Which architecture question it answers
* Which requirement, evidence, or tradeoff it returns
* Which component map, contract, or matrix it affects
* Whether it requires an ADR before acceptance

Unintegrated specialist output does not change the evaluation contract.

# Unresolved Blocking Questions

## 27. Status of Open Questions

The following questions are accepted as open by the architecture.

Per `CM-011`, each must be answered, or explicitly deferred with a recorded Control Plane decision, before the technology evaluation it blocks may begin.

Deferral must state what evaluation may proceed without the answer and what risk the deferral accepts.

### From the Failure Model (section 99)

Source: `docs/architecture/failure-model.md`, section 99.

1. Which resource classes may use cached authorization decisions?
2. How should maximum cache age be determined?
3. Which operations require fresh revocation state?
4. Which operations require fresh attestation?
5. Which operations may continue when audit is unavailable?
6. Which operations require synchronous durable audit?
7. What is the maximum disconnected duration for delegation validation?
8. How should revocation propagation objectives be represented?
9. Which trust-state changes require immediate global propagation?
10. Which degraded states may be composed safely?
11. Should compound degraded states have a formal risk budget?
12. Which failures require automatic session termination?
13. Which failures require re-authentication after recovery?
14. Which failures require re-attestation?
15. Which failures require re-authorization?
16. Which failure-state transitions require human approval?
17. Which emergency actions require multi-party authorization?
18. What evidence proves recovery completed correctly?
19. How should split-brain security state be resolved?
20. Which failure semantics must be verified before production use?

These questions block evaluation of any component whose `FR-xxx` requirements depend on them, principally LC-07 (questions 1 through 4, 12 through 15), LC-08 (questions 1, 5, 6, 12), LC-09 (questions 5, 6, 18), LC-10 (questions 16 through 18), and LC-11 (questions 8, 9, 19).

### From the Security Invariants (section 51)

Source: `docs/architecture/security-invariants.md`, section 51.

1. Which invariants require independent technical enforcement rather than policy convention?
2. Which invariants require cryptographic proof?
3. Which invariants require runtime isolation?
4. Which invariants require continuous rather than point-in-time verification?
5. Which invariants must hold during disaster recovery?
6. Which invariants must hold during offline operation?
7. Which invariants require transaction binding?
8. Which invariants require cross-domain evidence?
9. Which invariants require independent audit verification?
10. Which invariant violations should automatically stop execution?
11. Which invariant violations should trigger credential or authority revocation?
12. How should invariant compliance be represented in validation records?
13. How should implementations demonstrate that all applicable enforcement paths are covered?
14. Which invariants require formal methods or machine-verifiable policy?
15. Which invariants should become release-gating controls?

These questions block the Task 7 verification traces that depend on them, principally `SI-30` (questions 1, 3, 10, 13), `SI-31` (questions 1, 10, 11, 15), `SI-15` (question 5), `SI-17` and `SI-18` (question 2), and `SI-35` (question 9).

## 28. Blocking Question Discipline

A blocking question is resolved by one of:

* An accepted architecture answer recorded in the relevant artifact
* A Task 8 specialist output integrated per section 26
* A Control Plane decision that explicitly defers the question, names the evaluation permitted to proceed, and records the accepted risk

A blocking question is never resolved by a candidate technology's documentation asserting an answer.

The vendor does not answer architecture questions; the architecture answers them and the vendor is evaluated against the answers.

# Exit Questions Answered

## 29. The 14 Exit Questions

Each question from the Sprint 2 plan Task 10 section is answered with a pointer to the exact artifact and section that answers it.

**Q1. What architecture role is the technology being considered for?**

Answered by: `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md` (ROLE-001 through ROLE-017, sections 4 through 224); this document section 17 maps roles to logical components for evaluation scoping.

**Q2. Which accepted requirements apply?**

Answered by: Task 2 role capability contracts; `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md` (EDGE-001 through EDGE-015); `docs/sprints/sprint-02-task-04-authority-trust-anchor-and-governance-matrix.md` (AUTH-001 through AUTH-011); `docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md` (AZ-001 through AZ-022, ENF-001 through ENF-012, CTL-001 through CTL-012); this document sections 19 through 24 consolidate the applicable requirements per component.

**Q3. Which trust anchors and authorities does it introduce?**

Answered by: Task 4 matrix (AUTH-001 through AUTH-011, each with trust anchor, custody, rotation, and revocation fields); this document section 21 binds authorities and anchors to components. A candidate must additionally declare any new anchor or authority it introduces so Control Plane can assess it against Task 4 governance requirements.

**Q4. Which identities does it establish?**

Answered by: `docs/architecture/principal-model.md`; Task 2 ROLE-001 through ROLE-004 capability contracts; this document LC-01, LC-02, and LC-03 mappings. The evaluation must distinguish logical-principal identity from workload identity per ADR-0002.

**Q5. Which authority does it not establish?**

Answered by: Task 2 "Authority Explicitly Not Held" fields for each role; Task 5 AZ-002 and AZ-010; this document section 21 authority notes. A candidate evaluation is incomplete if it lists only granted authority.

**Q6. Which evidence does it produce or consume?**

Answered by: Task 3 EDGE contracts (each defines producer, consumer, assertion type, and audit evidence); this document section 20 per-component interface map.

**Q7. Which decisions can it make?**

Answered by: Task 2 ROLE-012 (authorization decision), ROLE-006 (attestation appraisal), ROLE-004 (identity validation result); Task 5 AZ-019 (decision states `PERMIT`, `DENY`, `INDETERMINATE`). A candidate must state its decision vocabulary and demonstrate it preserves `INDETERMINATE ≠ DENY ≠ PERMIT`.

**Q8. Which actions can it actually enforce?**

Answered by: Task 5 ENF-001 through ENF-012; this document section 22 enforcement map. A decision the candidate cannot effectively enforce is not a completed control (ENF-001).

**Q9. What happens when it is unavailable?**

Answered by: `docs/architecture/failure-model.md` (FM-01 through FM-17); `docs/sprints/sprint-02-task-06-failure-degraded-mode-recovery-matrix.md` (FR-001 through FR-060, normative). The evaluation must classify the candidate's behavior per the applicable `FR-xxx` and prove no silent authority increase.

**Q10. What happens when it is compromised?**

Answered by: `docs/architecture/failure-model.md` section 5 (failure versus compromise); FM-04, FM-15; SI-15, SI-32, SI-33, SI-34; Task 6 compromise handling within each applicable `FR-xxx`. Compromise handling must be distinct from availability-failure handling.

**Q11. What must be tested?**

Answered by: `docs/sprints/sprint-02-task-07-invariant-verification-matrix.md` (per-invariant traces in sections 6 through 13, normative: positive, negative, and failure tests per invariant); Task 5 sections 73 through 75 (authorization and enforcement verification preparation); `docs/architecture/failure-model.md` sections 91 and 92 (failure and negative testing).

**Q12. What evidence would justify acceptance?**

Answered by: Task 7 evidence requirements per invariant trace; Task 3 evidence contracts per `EDGE-xxx`; Task 5 sections 67 through 69 (authorization, enforcement, and correlation evidence). Evidence must be sufficient to reconstruct principal, runtime, resource, action, authority, provenance, policy, decision, enforcement outcome, and failure state.

**Q13. Which accepted invariants could it violate?**

Answered by: `docs/architecture/security-invariants.md` (SI-01 through SI-38); Task 5 section 79 (primary invariant traceability); this document section 24 (invariant allocation per component). Per the Task 9 framework, a candidate may be rejected for violating an accepted invariant even if it performs well operationally.

**Q14. Which vendor or topology dependencies would it introduce?**

Answered by: Task 2 sections 232 through 234 (technology evaluation and multi-role rules, including the native versus external versus custom versus unsupported distinction); `docs/sprints/sprint-02-task-09-technology-evaluation-framework.md` (disqualifying conditions, normative). Hidden trust dependencies are non-conformant with the Task 2 model (section 226).

# Exit Decision Criteria

## 30. Sprint 2 Gate PASS

The Sprint 2 exit decision is PASS when all of the following hold:

* The Sprint 2 plan Definition of Done items are satisfied: charter and traceability baseline accepted; roles mapped to capabilities; material trust interfaces contracted; authorities and trust anchors governed; authorization and enforcement semantics evaluable; failure semantics translated to control requirements; invariants mapped to controls, tests, and evidence; specialist work packages routed; evaluation criteria accepted; component mapping complete without redefining architecture; no product standardized without the gate; exit review recorded.
* Every `ROLE-001` through `ROLE-017` maps to the component map in section 17.
* Every component boundary satisfies `CM-005` (contracted interfaces) or the gap is recorded with a Control Plane remediation decision.
* Every component references its authorities (`CM-006`), enforcement points (`CM-007`), failure requirements (`CM-008`), and invariant verification rows (`CM-009`).
* The specialist backlog (section 25) is approved with routing intact.
* Blocking questions (section 27) are answered or explicitly deferred per section 28.
* The 14 exit questions (section 29) are answerable from accepted artifacts.

## 31. Sprint 2 Gate FAIL

The exit decision is FAIL if any of the following hold:

* A technology has been standardized, selected, or described as preferred without passing the Task 9 framework and this gate.
* Any accepted invariant is treated as violable without a new ADR and Control Plane acceptance.
* Any failure semantic permits silent authority increase (violates FM-01 or SI-31).
* The component map redefines an architecture role around a product feature or deployment convenience.
* `COMPROMISED` is treated as equivalent to ordinary availability failure in any evaluation input.
* Evidence states are conflated: architecture described as implemented, tested, enforced, or production-ready without the separate evidence each transition requires.
* A blocking question is silently deferred or answered by vendor documentation.

## 32. Conditional Pass

A conditional pass is permitted only when every remaining item is a non-blocking documentation refinement with a named owner and a committed date, and no blocking question, invariant mapping, failure requirement, or enforcement identification remains open.

The conditions and their owners are recorded in the Sprint 2 Exit Review.

A conditional pass never authorizes technology standardization; it authorizes only the named refinements.

## 33. Post-Gate Discipline

After a PASS:

* Candidate evaluations begin exclusively through the Task 9 framework against this Task 10 gate.
* The first evaluation target should be the component with the smallest trust footprint and the most complete blocking-question answers, so the evaluation process itself is validated before high-authority components (LC-01, LC-05, LC-07, LC-10) are assessed.
* No evaluation may proceed for a component whose blocking questions remain unresolved except under an explicit, risk-recorded deferral per section 28.

---

# Traceability Matrix

## 34. Gate Requirements to Sprint 2 Plan

| ID | Requirement | Plan Task 10 Deliverable | Primary Source Artifacts |
|---|---|---|---|
| CM-001 | Component map completeness | Logical component map | Task 2 (ROLE-001..017) |
| CM-002 | No technology selection | (gate discipline) | Plan Task 10 exit decision; Task 2 section 2 |
| CM-003 | Co-location preserves role boundaries | Logical component map | Task 2 sections 225..227; Task 5 sections 70..72 |
| CM-004 | Capability map per component | Required capability map | Task 2 capability contracts |
| CM-005 | Interface map per component boundary | Trust interface map | Task 3 (EDGE-001..015) |
| CM-006 | Authority and anchor reference per component | Authority / anchor matrix | Task 4 (AUTH-001..011) |
| CM-007 | Enforcement map | Enforcement map | Task 5 (ENF-001..012) |
| CM-008 | Failure matrix reference | Failure matrix | Task 6 (per-dependency FR requirements as allocated in section 23); failure model (FM-01..17) |
| CM-009 | Invariant verification reference | Invariant verification map | Task 7 (per-invariant traces, sections 6..13); invariants (SI-01..38) |
| CM-010 | Specialist backlog approval | Approved specialist research backlog | Task 8 (WP-001..004); plan Task 8 |
| CM-011 | Blocking questions answered or deferred | Unresolved blocking questions | Failure model section 99; invariants section 51 |
| CM-012 | Evaluation entry criteria | (gate discipline) | Section 29 (14 exit questions) |
| CM-013 | No standardization without the gate | (gate discipline) | Plan evidence states; Task 9 framework |
| CM-014 | Exit decision rule | Sprint 2 Exit Review | Sections 30..32 |

## 35. Component to Requirement Coverage

| Component | Roles | EDGE | AUTH | ENF | FR | IV |
|---|---|---|---|---|---|---|
| LC-01 | ROLE-003 | 001, 011, 012, 013, 014 | 001, 011 | (none) | 001, 004, 007, 013, 017 | 001, 003, 011, 012, 013, 014, 016, 031, 037 |
| LC-02 | ROLE-004 | 001, 011, 012, 013, 015 | (validates under 001) | (none) | 001, 002, 004, 005, 007, 013, 014, 017 | 001, 002, 004, 008, 009, 010, 019, 027, 031, 037 |
| LC-03 | ROLE-002, ROLE-005 | 002, 003, 012, 014 | 002, 003 | (none) | 002, 003, 004, 013, 017 | 002, 004, 005, 011, 017, 025, 031, 037 |
| LC-04 | ROLE-006 | 003, 004, 012, 013 | 004 | (none) | 003, 004, 013, 017 | 017, 018, 031, 037 |
| LC-05 | ROLE-008, ROLE-009 | 005, 011, 013, 014 | 005, 006, 011 | (none) | 006, 007, 013, 017 | 003, 019, 020, 021, 023, 031, 036, 037 |
| LC-06 | ROLE-010 | 005, 013 | 007, 011 | (none) | 006, 007, 013, 017 | 020, 021, 022, 023, 031, 036, 037 |
| LC-07 | ROLE-011, ROLE-012 | 001, 004, 005, 006, 007, 008, 009, 011, 013, 015 | 008, 009, 011 | (co-located, conditional) | 002, 003, 005, 006, 007, 008, 009, 013, 014, 016, 017 | 001, 002, 003, 005, 009, 010, 017, 019, 020, 024, 025, 026, 027, 028, 029, 030, 031, 035, 036, 037 |
| LC-08 | ROLE-013, ROLE-014 | 007, 009, 010, 013 | 010 | 001..012 | 009, 010, 013, 016, 017 | 006, 026, 029, 030, 031, 035, 037 |
| LC-09 | ROLE-015 | all (evidence) | (custody) | (none) | 011, 013, 015, 017 | 031, 032, 033, 034, 035, 036, 037, 038 |
| LC-10 | ROLE-016 | 012, 013, 014 | (recovery aspects of 001..011) | (none) | 004, 012, 013, 017, 018 | 012, 013, 014, 015, 016, 031, 032, 037, 038 |
| LC-11 | ROLE-017 | 007, 012, 013, 014, 015 | (coordination; no ownership) | (none) | 004, 005, 008, 013, 014, 015, 017 | 006, 007, 008, 009, 028, 031, 033, 034, 037, 038 |

# Task 10 Acceptance Gate

## 36. Acceptance Criteria

Task 10 passes when:

* Every `ROLE-001` through `ROLE-017` is mapped to a logical component or designated cross-cutting with named embodying components.
* No product, vendor, or protocol is selected, shortlisted, or recommended.
* Co-location constraints from Task 2 and Task 5 are carried into the component map.
* Required capabilities are stated per component from Task 2 contracts.
* Every component boundary states its `EDGE-xxx` interfaces.
* Every component references its `AUTH-xxx` authorities and trust anchors.
* Enforcement points are identified per component with applicable `ENF-xxx` requirements, including protected administrative actions.
* The Task 6 failure requirements cited in the section 23 allocation table are normative for their definitions; this gate allocates them to components.
* The Task 7 per-invariant verification traces (sections 6 through 13) are normative for their definitions; this gate allocates them to components.
* The specialist backlog `WP-001` through `WP-004` is approved with routing intact.
* Blocking questions are listed honestly with per-question blocking scope, and the deferral discipline is defined.
* All 14 exit questions are answered with artifact and section pointers.
* Exit decision criteria for PASS, FAIL, and conditional pass are explicit.
* No technology is standardized.

## 37. Failure Modes

Task 10 fails if:

* A role is unmapped or mapped to a product.
* A component redefines a role around a product feature.
* Co-location collapses logical role distinctions.
* A trust-relevant component boundary has no contracted interface.
* A component cannot name its authority basis.
* Enforcement points are unnamed for protected administrative actions.
* Failure behavior is left undefined for an evaluable component.
* An invariant has no verification row for an applicable component.
* A specialist work package is allowed to standardize a technology.
* A blocking question is hand-waved, silently deferred, or answered by vendor documentation.
* An exit question cannot be answered from accepted artifacts and the gap is not recorded.
* Any product is standardized through this document.

## 38. Definition of Done

Task 10 content is ready for acceptance when:

* [x] `CM-001` through `CM-014` are defined.
* [x] Logical component map is complete (all 17 roles mapped, no products).
* [x] Required capability map is defined per component.
* [x] Trust interface map is defined per component boundary.
* [x] Authority and trust-anchor references are defined per component.
* [x] Enforcement map is defined, including protected administrative actions.
* [x] Failure matrix reference is defined (Task 6 FR requirements allocated per section 23).
* [x] Invariant verification map reference is defined (`SI-01` through `SI-38` allocated per section 24).
* [x] Specialist research backlog is approved (`WP-001` through `WP-004`).
* [x] Unresolved blocking questions are listed with blocking scope.
* [x] The 14 exit questions are answered with artifact and section pointers.
* [x] Exit decision criteria (PASS, FAIL, conditional) are explicit.
* [x] No product has been standardized.
* [x] Mechanical document validation passes.
* [x] Semantic architecture review passes.

### Repository Closure Gate

Task 10 is not formally **COMPLETE** until:

* The accepted artifact is committed.
* The commit is pushed to `origin/main`.
* `HEAD == origin/main`.
* The working tree is clean.

---

# Proposed Decision

## 39. Task 10 Decision

The proposed Task 10 decision is:

> **Sprint 2 shall close its architecture-to-evaluation translation with an implementation-neutral component map (LC-01 through LC-11 plus cross-cutting principal and relying-function concerns), per-component capability, interface, authority, enforcement, failure, and invariant-verification references, an approved specialist research backlog, and an explicit blocking-question register. Formal candidate-technology evaluation may begin only through the Task 9 evaluation framework against this gate, only when the 14 exit questions are answerable from accepted artifacts, and only for components whose blocking questions are answered or explicitly deferred with recorded risk. No product has been standardized by Sprint 2.**

This is a derived architecture-to-implementation requirement.

It does not select an authorization engine, policy language, enforcement technology, identity system, attestation mechanism, delegation protocol, audit platform, recovery mechanism, or deployment topology.

---

## 40. ADR Assessment

No new ADR is proposed by Task 10 at this stage.

The component map and gate derive from accepted:

* ADR-0002
* ADR-0003
* ADR-0004
* ADR-0005
* ADR-0006
* ADR-0007
* ADR-0008

Two items are flagged for Control Plane attention during Task 8 acceptance, per `docs/architecture/failure-model.md` section 98:

* Whether "recovery from security-relevant failure is a trust-state transition, with availability alone insufficient to prove recovery" requires a new ADR or remains a derived refinement of ADR-0007.
* Whether "failure of a trust dependency must not silently create authority beyond legitimately established authority" requires a new ADR or remains a derived refinement of ADR-0006 and ADR-007.

If semantic review identifies any other materially new cross-platform decision rather than a derived requirement, the Control Plane must stop and record that decision through ADR governance before acceptance.

---

## References

* `docs/sprints/sprint-02-plan.md`
* `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
* `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
* `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
* `docs/sprints/sprint-02-task-04-authority-trust-anchor-and-governance-matrix.md`
* `docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md`
* `docs/sprints/sprint-02-task-06-failure-degraded-mode-recovery-matrix.md`
* `docs/sprints/sprint-02-task-07-invariant-verification-matrix.md`
* `docs/sprints/sprint-02-task-08-specialist-work-packages.md`
* `docs/sprints/sprint-02-task-09-technology-evaluation-framework.md`
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
