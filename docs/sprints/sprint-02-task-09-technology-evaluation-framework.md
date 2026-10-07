# Sprint 2 Task 9: Technology Evaluation Framework

**Project:** Autonomous Trust Platform
**Sprint:** Sprint 2: Trust Control Contracts & Technology Evaluation Gate
**Task:** Task 9: Technology Evaluation Framework
**Status:** Accepted
**Task Date:** 2026-10-06
**Accepted Date:** 2026-10-06
**Semantic Review:** PASS
**Owner:** Trust Platform: Control Plane
**Repository Baseline:** `0b603e857e37204e3b4661ecc5bf43778486a50e`
**Roadmap Authority:** `docs/sprints/sprint-02-plan.md`
**Traceability Baseline:** `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
**Architecture Input Baselines:**
`docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
`docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
`docs/sprints/sprint-02-task-04-authority-trust-anchor-and-governance-matrix.md`
`docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md`
`docs/architecture/security-invariants.md`
`docs/architecture/failure-model.md`

---

## 1. Objective

Define how candidate standards and products will be compared after architecture requirements exist.

The governing question is:

> **By what explicit, repeatable, and evidence-backed method does the platform compare candidate technologies, such that operational strength can never override semantic correctness, and such that no product redefines the accepted architecture?**

Task 9 establishes the evaluation framework that the Task 10 selection gate will apply.

It does not:

* Select a standard
* Select a product
* Rank named candidates
* Endorse a vendor
* Standardize a protocol
* Claim production readiness for any technology

This artifact is a measuring instrument, not a measurement.

---

## 2. Why This Task Matters

Technology evaluation is where architectures most often fail silently.

Common failure patterns include:

```text
Product is widely deployed
        ↓
therefore
        ↓
Product defines correct trust semantics
```

```text
Cryptography validates
        ↓
therefore
        ↓
Authorization is satisfied
```

```text
Demonstration succeeds in the lab
        ↓
therefore
        ↓
Enforcement is effective in deployment
```

```text
Operational metrics are strong
        ↓
therefore
        ↓
Invariant violations are acceptable tradeoffs
```

Each of these collapses a distinction the accepted architecture requires to remain explicit.

Task 9 exists so that a candidate can be admired for its engineering and still be rejected for its semantics.

The framework therefore separates two questions that must never be merged:

```text
Does the candidate satisfy the architecture?
        ≠
How well does the candidate perform?
```

The first question is answered by gates.

The second question is answered by scoring.

A candidate that fails a gate is not scored into acceptability.

---

# Evaluation Principles

## 3. TE-001: Architecture Precedes Evaluation

No candidate is evaluated until the architecture requirements it must satisfy are accepted.

Evaluation criteria derive from:

* Accepted Security Invariants (`SI-01` through `SI-38`)
* Accepted Failure Model properties (`FM-01` through `FM-17`)
* Task 2 architecture-role capabilities
* Task 3 trust-interface and evidence contracts
* Task 4 authority and trust-anchor requirements
* Task 5 authorization and enforcement contracts

A candidate feature is not a requirement merely because the candidate provides it.

## 4. TE-002: Invariant Compliance Is a Gate, Not a Weighted Factor

A candidate that violates an accepted Security Invariant is rejected regardless of its operational score.

Invariant compliance is evaluated before scoring and is not diluted by averaging.

This preserves the Sprint 2 acceptance criterion:

> A candidate technology can be rejected for violating an accepted invariant even if it performs well operationally.

## 5. TE-003: Evidence States Remain Distinct

Evaluation preserves the Sprint 2 evidence-state discipline:

```text
Architecture Requirement
        ≠
Research Finding
        ≠
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
        ≠
Production Ready
```

Completing this framework produces Research Findings and Candidate Technologies.

It does not produce Selected Technologies.

Selection requires the Task 10 gate and a separate decision record.

## 6. TE-004: Vendor Neutrality

The framework must be applicable to any candidate without presuming a vendor, product category, deployment model, or protocol family.

Evaluation records must distinguish:

* Open standard
* Open-source implementation
* Commercial product
* Protocol specification
* Reference architecture

without assigning merit to the category itself.

## 7. TE-005: Semantic Correctness Outranks Operational Convenience

Where a candidate's operational strengths conflict with required trust semantics, the semantics govern.

Operational dimensions (complexity, portability, vendor dependency) carry the lowest rubric weights by design.

## 8. TE-006: Evaluation Is Repeatable

Two independent evaluators applying this framework to the same candidate version should reach the same gate verdicts.

Disagreement must be recorded as a caveat in the evaluation record, not resolved by optimistic scoring.

---

# Evaluation Model

## 9. TE-007: Two-Layer Evaluation

Every candidate passes through two layers in order:

```text
Layer 1: Gates
(Mandatory constraints + Disqualifying conditions)
        ↓ pass
Layer 2: Scoring
(Weighted rubric across 22 dimensions)
        ↓
Eligibility determination
```

Layer 1 is binary: pass or reject.

Layer 2 is comparative: scored only after Layer 1 passes.

A candidate that fails Layer 1 must not be advanced on the strength of a projected Layer 2 score.

## 10. TE-008: One Evaluation Per Candidate, Version, and Role Set

An evaluation record addresses exactly one candidate version against an explicitly stated set of architecture roles.

A new version, a changed role set, or materially new information triggers re-evaluation rather than amendment of the prior record.

## 11. TE-009: Gate Verdicts Require Evidence Citations

Every gate verdict (pass or fail) must cite the evidence examined:

* Specification section
* Documentation page
* Observed behavior
* Test result
* Explicitly recorded absence of required capability

A gate may not be passed on the basis of marketing claims, assumed behavior, or unexamined defaults.

---

# Weighted Evaluation Rubric

## 12. TE-010: Rubric Dimensions and Weights

The rubric covers all 22 evaluation dimensions required by the Sprint 2 plan.

Weights sum to 100. Security-semantics dimensions carry the highest weights. Operational dimensions carry the lowest weights, so operational strength cannot compensate for semantic weakness.

| # | Dimension | Weight | What the dimension assesses |
|---|---|---|---|
| 1 | Standards alignment | 3 | Alignment with relevant open standards for the roles addressed; maturity of the underlying standard; whether required semantics need proprietary extensions |
| 2 | Architecture-role coverage | 6 | How many of the applicable Task 2 architecture roles the candidate can satisfy without redefining them; explicit role-to-capability mapping required |
| 3 | Identity semantics | 8 | Credential versus principal distinction; workload versus logical-actor distinction; infrastructure versus workload distinction; explicit binding mechanisms; lifecycle independence |
| 4 | Authority semantics | 8 | Authority provenance; bounded delegation; non-amplification; explicit composition; redelegation control; issuer versus source distinction |
| 5 | Attestation semantics | 6 | Evidence, verifier, appraisal-policy, reference-value, and freshness explicitness; bounded attestation semantics per `SI-17` and `SI-18` |
| 6 | Authorization semantics | 8 | Local authorization sovereignty; resource and action scoping; `PERMIT` / `DENY` / `INDETERMINATE` distinguishability; input-specific freshness; provenance preservation |
| 7 | Enforcement capability | 7 | Complete mediation demonstrability; decision-to-request binding; enforcement outcome evidence; bypass governance; alternate-path control |
| 8 | Trust-anchor model | 6 | Explicit trust anchors; distribution; custody; rotation; compromise response; anchor lifecycle governance |
| 9 | Bootstrap model | 5 | Explicit bootstrap; identity-binding assurance; bootstrap scoping; no silent downgrade; re-bootstrap semantics |
| 10 | Revocation model | 6 | Revocation support for identity, authority, and delegation; unknown-revocation semantics; propagation expectations; expiration kept distinct from revocation |
| 11 | Failure semantics | 7 | Explicit behavior for required failure states; resource-specific failure policy; degraded-mode boundedness; no silent authority increase |
| 12 | Recovery model | 4 | Recovery treated as trust-state transition; independent trust basis for compromise recovery; re-evaluation requirements |
| 13 | Auditability | 5 | Actor, runtime, decision, and provenance evidence; reconstructability; tamper-evidence; audit-failure semantics |
| 14 | Cross-domain support | 4 | Explicit cross-domain acceptance; purpose scoping; no implicit transitivity or symmetry; local sovereignty preserved |
| 15 | Crypto agility | 4 | Algorithm negotiation and replacement without changing trust semantics; no hardcoded algorithms in authority-bearing protocols |
| 16 | PQC migration posture | 3 | Credible path to post-quantum algorithms; hybrid operation support; migration preserves trust semantics |
| 17 | Operational complexity | 1 | Deployment and operational burden; lower complexity scores higher, but cannot compensate for semantic gaps |
| 18 | Portability | 1 | Behavior preserved across platforms and topologies without trust-semantic change |
| 19 | Vendor dependency | 1 | Degree of lock-in; open specifications score higher than proprietary mechanisms |
| 20 | Observability | 2 | Trust decisions observable; degraded states visible; decision and enforcement evidence exportable |
| 21 | Testability | 3 | Support for positive, negative, and failure testing per the Task 7 verification model; test hooks that do not weaken enforcement |
| 22 | Reproducibility | 2 | Independent parties can reproduce the evaluation; deterministic behavior where applicable |

## 13. TE-011: Scoring Scale

Each dimension is scored 0 through 4:

```text
0: Contradicts or cannot satisfy the dimension; material semantic failure
1: Partial; material gaps requiring compensating architecture
2: Adequate; satisfies the dimension with documented caveats
3: Strong; satisfies the dimension fully with cited evidence
4: Exemplary; satisfies with evidence plus independently verifiable
    assurance (for example, conformance tests, formal analysis,
    interoperable implementations)
```

The weighted score is the sum of (weight times dimension score), with a maximum of 400.

Results are reported as a percentage of 400.

## 14. TE-012: Eligibility Thresholds

A candidate is eligible for selection consideration only if all of the following hold:

* All Layer 1 gates pass.
* Overall weighted score is at least 60 percent (240 of 400).
* Each of the following dimensions scores at least 2: identity semantics, authority semantics, authorization semantics, enforcement capability, failure semantics, revocation model.

These thresholds are proposed contract terms.

The Task 10 gate may raise them for specific role sets but may not lower them without explicit Control Plane review.

## 15. TE-013: Scores Are Comparative, Not Absolute

Rubric scores compare candidates against the architecture.

A high score does not establish production readiness, operational effectiveness, or fitness for any specific deployment.

Those claims require the later evidence states defined in section 27.

---

# Scoring Integrity

## 16. TE-014: No Score Without Cited Evidence

Every dimension score must cite the evidence examined for that dimension.

A dimension scored without cited evidence is recorded as unevaluated, and the candidate is not eligible for selection until the evaluation is complete.

## 17. TE-015: Uncertainty Is Recorded, Not Averaged Away

Where evidence is incomplete or evaluators disagree, the evaluation record must state the uncertainty explicitly.

Uncertainty must not be resolved by choosing the more favorable score.

A dimension with material unresolved uncertainty scores at most 1 until the uncertainty is resolved.

## 18. TE-016: Operational Scores Cannot Rescue Semantic Scores

A score of 0 or 1 on any of the six core security dimensions named in `TE-012` renders the candidate ineligible regardless of the overall percentage.

This rule is structural, not discretionary: the weights alone must not be relied upon to enforce it.

---

# Mandatory Architecture Constraints

## 19. TE-017: Constraints Are Non-Negotiable

The following constraints derive from accepted architecture.

Every candidate must satisfy each applicable constraint.

"Applicable" means the constraint governs a trust function the candidate claims to perform.

A candidate that does not perform a trust function is not required to satisfy that function's constraints, but must not claim the function either.

## 20. TE-018: Credential Is Not Principal

The candidate must preserve the distinction between credential and principal (`SI-01`).

Credential lifecycle operations (issuance, renewal, revocation, expiration) must not silently redefine the underlying principal.

## 21. TE-019: Workload Identity Is Not Logical-Actor Identity

The candidate must not treat authenticated workload identity as automatically establishing logical-actor identity where their lifecycle, authority, policy, revocation, or accountability differ (`SI-02`, `SI-05`).

Where independent logical-actor identity is security relevant, the candidate must provide or integrate with an explicit binding mechanism.

## 22. TE-020: Identity and Authority Lifecycles Are Independent

The candidate must allow identity validity and authority validity to be governed independently (`SI-03`).

Credential renewal must not silently renew delegated authority.

Expiration must not be treated as equivalent to revocation.

## 23. TE-021: Attestation Remains Bounded

The candidate must not treat attestation evidence or Attestation Results as establishing principal identity, delegated authority, or authorization by themselves (`SI-17`).

Reliance on attestation must make explicit the verifier, appraisal policy, reference values, and freshness rules (`SI-18`).

## 24. TE-022: Delegation Is Bounded and Provenance-Preserving

The candidate must enforce non-amplification of delegated authority (`SI-20`), deny redelegation by default (`SI-21`), preserve the authority-source, delegator, and issuer distinction (`SI-23`), and require explicit authority composition rather than implicit union (`SI-24`).

A delegation artifact whose underlying authority basis has been withdrawn must not remain authoritative on cryptographic validity alone (`SI-22`).

## 25. TE-023: Authentication Is Not Authorization

The candidate must keep authentication and authorization as separate decisions (`SI-27`).

Authorization decisions must support at least `PERMIT`, `DENY`, and `INDETERMINATE` as distinguishable states, and `INDETERMINATE` must not be collapsible into permit by configuration or default.

## 26. TE-024: Authorization Requires Effective Enforcement

The candidate must provide a demonstrable enforcement path for each protected action it claims to govern (`SI-30`).

A correct authorization decision without effective enforcement is a security failure, not a completed control.

## 27. TE-025: Failure Must Not Silently Increase Authority

The candidate must define explicit, resource-specific behavior for failure states including unavailable, stale, unknown, inconsistent, degraded, and recovering dependencies (`SI-31`, `FM-01` through `FM-03`, `FM-05`).

The candidate must not impose a single universal fail-open or fail-closed rule across all resources and risk classes.

## 28. TE-026: Compromise Is Distinct From Unavailability

The candidate must distinguish compromised authority from unavailable authority in its failure handling, containment, recovery, and evidence (`SI-32`, `FM-04`).

Ordinary failure handling must not be usable to normalize suspected compromise.

## 29. TE-027: Revocation Semantics Are Explicit

The candidate must define revocation behavior for every authority-bearing artifact it issues or consumes.

Unknown revocation state must not be treated as valid, and must not be treated as revoked, without explicit resource-specific policy (`FM` section on delegation and revocation failure).

Revocation propagation expectations and maximum tolerated lag must be stated.

## 30. TE-028: Audit Preserves Principal Context and Provenance

The candidate must produce or support audit evidence sufficient to reconstruct actor, runtime, delegator, authority provenance, authorization decision, and enforcement outcome where those distinctions are security relevant (`SI-35`, `SI-36`).

Historical authority evidence must remain interpretable after identities or grants are revoked.

## 31. TE-029: Trust-State Changes Are Governed

The candidate must provide a governed, attributable path for security-relevant trust-state changes, including trust anchors, trust bundles, registration state, federation configuration, attestation reference values, policy, revocation state, and enforcement configuration (`SI-38`).

Successful modification of configuration must not itself be treated as proof the change was legitimately authorized.

---

# Disqualifying Conditions

## 32. TE-030: Disqualification Rule

A candidate is disqualified if any disqualifying condition in sections 33 through 37 is triggered and cannot be remediated within the candidate's own documented configuration.

Disqualification is recorded with the specific condition, the evidence, and the invariant violated.

A disqualified candidate may be re-evaluated only after a new version demonstrably removes the condition.

The following conditions generalize the authorization and enforcement disqualifiers established in section 83 of the Task 5 contract across all trust functions.

## 33. Identity Disqualifiers

**TE-031**: The candidate treats credential possession as principal identity in a way that cannot be disabled (`SI-01`).

**TE-032**: The candidate presents authenticated workload identity as logical-actor identity with no explicit binding mechanism available (`SI-02`).

**TE-033**: The candidate treats registration or enrollment as current proof of runtime identity, with no separate runtime authentication or attestation path (`SI-11`).

**TE-034**: The candidate automatically interprets infrastructure identity (node, VM, cluster, cloud instance) as workload identity with no explicit architecture defining the relationship (`SI-04`).

## 34. Attestation Disqualifiers

**TE-035**: The candidate treats a valid Attestation Result as establishing identity, delegated authority, or authorization without further policy evaluation (`SI-17`).

**TE-036**: The candidate provides no explicit trust basis for its verifier, appraisal policy, or reference values, or treats cryptographically valid evidence as sufficient proof that appraisal policy is trustworthy (`SI-18`).

**TE-037**: The candidate conflates evidence authenticity with evidence freshness, providing no freshness semantics for Attestation Results (`SI-18`, `FM-06`).

## 35. Delegation Disqualifiers

**TE-038**: The candidate permits delegated authority to exceed the delegator's delegable authority, or provides no mechanism to enforce delegation bounds (`SI-20`).

**TE-039**: The candidate permits redelegation by default, or treats the ability to receive delegated authority as including permission to delegate onward (`SI-21`).

**TE-040**: The candidate treats a cryptographically valid delegation artifact as authoritative after its underlying authority basis has been withdrawn, with no re-evaluation path (`SI-22`).

**TE-041**: The candidate composes authority from multiple sources through implicit union, with no explicit composition rule available (`SI-24`).

## 36. Authorization and Enforcement Disqualifiers

**TE-042**: The candidate exhibits any of the disqualifying semantic failures established in section 83 of the Task 5 authorization and enforcement contract:

* Authenticated means authorized
* Valid delegation means permit
* Attested means authorized
* Policy distribution equals enforcement
* Authorization decision equals enforcement
* Permit can be reused without required binding
* Unknown revocation means valid
* External authorization automatically governs local resources
* Bypass cannot be identified
* Enforcement outcome cannot be distinguished from decision
* Authority provenance cannot be preserved

Each triggered item is recorded individually with its evidence.

## 37. Federation Disqualifiers

**TE-043**: The candidate treats federated authentication as automatically importing authorization into the receiving domain, with no local authorization policy evaluation (`SI-10`).

**TE-044**: The candidate assumes trust is symmetric or transitive across domains by default, with no explicit, purpose-scoped, directional trust configuration (`SI-08`, `SI-09`).

**TE-045**: The candidate allows federation availability failure to silently change local authorization policy or trust semantics (`FM` section on federation failure).

## 38. Audit and Recovery Disqualifiers

**TE-046**: The candidate cannot produce audit evidence sufficient to reconstruct actor, runtime, authorization decision, and enforcement outcome for the protected actions it claims to govern (`SI-35`, `SI-36`).

**TE-047**: The candidate silently discards audit evidence when the audit destination is unavailable, with no buffering, escalation, or risk-based behavior defined (`FM-16`).

**TE-048**: The candidate's recovery path relies solely on the trust basis whose compromise made recovery necessary, with no independent trust basis available (`SI-15`).

## 39. Failure and Cryptography Disqualifiers

**TE-049**: The candidate applies a single universal fail-open or fail-closed rule across all resources, or allows failure to silently increase authority (`SI-31`, `FM-01`).

**TE-050**: The candidate treats a compromised authority as an ordinary availability failure, applying the same containment and recovery handling to both (`SI-32`, `FM-04`).

**TE-051**: The candidate hardcodes cryptographic algorithms into authority-bearing protocols or trust semantics with no migration path, making crypto agility structurally impossible (Platform Charter crypto-agility principle).

---

# Mandatory Candidate Question Sets

## 40. TE-052: Question Set Obligation

For each trust function the candidate claims to perform, the evaluation record must answer every question in the corresponding set below.

An unanswered question is recorded as a gap, not as a favorable assumption.

Questions are labeled for traceability: `IQ` (identity), `TQ` (attestation), `LQ` (delegation), `FQ` (federation), `RQ` (audit and recovery).

Authorization and enforcement questions are defined in section 44.

## 41. Identity Questions

* **IQ-01**: Which architecture roles from the Task 2 inventory does the candidate satisfy for identity, and which does it not address?
* **IQ-02**: How does the candidate distinguish credential from principal, and where is that distinction enforced?
* **IQ-03**: How does the candidate distinguish workload identity from logical-actor identity, and what explicit binding mechanism exists between them?
* **IQ-04**: How does the candidate relate infrastructure identity to workload identity, and is that relationship explicit architecture or implicit assumption?
* **IQ-05**: Can identity validity and authority validity be governed independently, including independent revocation and expiration?
* **IQ-06**: What is the bootstrap path for first identity binding, and what assurance does it provide against incorrect binding (`SI-12`)?
* **IQ-07**: Which trust anchors does the candidate's identity function depend on, and how are they distributed, rotated, and revoked?
* **IQ-08**: What happens to previously issued identity artifacts when the issuing authority is unavailable?
* **IQ-09**: What happens to previously issued identity artifacts when the issuing authority is compromised?
* **IQ-10**: Which identities does the candidate establish, and just as importantly, which does it not establish?

## 42. Attestation Questions

* **TQ-01**: What exact claims does the candidate's attestation evidence carry, and what does it deliberately not claim?
* **TQ-02**: Which verifier is trusted, and what is the explicit trust basis for the verifier, the appraisal policy, and the reference values?
* **TQ-03**: How is evidence freshness established, and what are the maximum acceptable ages per use?
* **TQ-04**: How is evidence bound to its target (workload, device, measurement) to prevent substitution?
* **TQ-05**: For which authorization or bootstrap decisions may the Attestation Result be consumed as input, and where is that binding defined?
* **TQ-06**: What happens when the verifier is unavailable: deny, defer, bounded cached result, or something else, and for which operations?
* **TQ-07**: What is the recovery path when reference values change (for example, software update), and does it require re-attestation?
* **TQ-08**: Can the candidate's attestation be used, by configuration or by default, as a substitute for identity or authorization?

## 43. Delegation Questions

* **LQ-01**: How are authority source, delegator, and delegation issuer represented, and can they be distinguished in issued artifacts?
* **LQ-02**: How are delegation scope, constraints, lifetime, and audience expressed and enforced?
* **LQ-03**: How does the candidate prevent authority amplification through a delegation chain?
* **LQ-04**: Is redelegation permitted, denied by default, or explicitly granted per delegation, and where is that recorded?
* **LQ-05**: What explicit composition rule applies when authority derives from multiple sources?
* **LQ-06**: How is a delegation revoked, how quickly does revocation propagate, and what happens to decisions made before propagation completes?
* **LQ-07**: When the underlying authority basis is withdrawn, how and when do derived delegation artifacts lose effect?
* **LQ-08**: Does delegation validation preserve provenance (source, delegator, issuer, scope, constraints) through to the authorization decision?

## 44. Authorization and Enforcement Questions

The 17 mandatory candidate questions in section 82 of the Task 5 authorization and enforcement contract form the authorization and enforcement question set for this framework.

They are not repeated here to avoid divergence.

The evaluation record must answer each of the 17 questions and cite the Task 5 section-82 question number alongside the answer.

In addition, the evaluation must answer:

* **EQ-01**: For each protected action the candidate claims to govern, which Enforcement Point mediates the protected path, and what evidence demonstrates complete mediation?
* **EQ-02**: Which alternate paths to each protected resource exist (administrative, break-glass, maintenance, direct), and how is each governed?
* **EQ-03**: How does the candidate validate the authorization decision source at the Enforcement Point?

## 45. Federation Questions

* **FQ-01**: Which external identities, assertions, or delegations does the candidate accept, and under what explicit local policy?
* **FQ-02**: Is accepted trust directional and purpose-scoped, or does acceptance imply broader trust?
* **FQ-03**: Does the candidate assume symmetric or transitive trust anywhere by default?
* **FQ-04**: How are federation metadata, keys, and trust bundles kept current, and what is the maximum acceptable staleness?
* **FQ-05**: What happens to local authorization when a federation peer is unavailable: which behavior applies to which resources?
* **FQ-06**: Can federation configuration changes (new peer, removed peer, key rotation) occur without governed, attributable change control?
* **FQ-07**: Which authority does federation establish, and which authority does it explicitly not establish?

## 46. Audit and Recovery Questions

* **RQ-01**: For a protected action, what exact evidence fields does the candidate produce (actor, runtime, delegator, authority provenance, decision, enforcement outcome)?
* **RQ-02**: Can audit evidence be reconstructed after the relevant identities, grants, or policy versions have changed or been revoked?
* **RQ-03**: What are the candidate's audit-failure semantics: stop, buffer, degrade, or escalate, and for which operation classes?
* **RQ-04**: Who may initiate recovery, what may recovery modify, what approvals are required, and what audit evidence is produced?
* **RQ-05**: Does compromise recovery depend on an independent trust basis, or does it reuse the compromised basis?
* **RQ-06**: After recovery, which security conclusions require re-evaluation (sessions, cached decisions, delegation chains, revocation assumptions)?
* **RQ-07**: Are security-relevant trust-state changes (anchors, bundles, policy, revocation, federation) governed, attributable, and auditable?
* **RQ-08**: What evidence demonstrates that recovery completed correctly rather than merely restoring availability?

---

# Evidence Requirements

## 47. TE-053: Transition Evidence Rule

Each evidence-state transition requires its own evidence.

Evidence sufficient for one transition is not automatically sufficient for the next.

The evaluation record must state the candidate's current evidence state explicitly and must not imply a higher state.

## 48. TE-054: Architecture Requirement to Research Finding

A Research Finding exists when:

* The research template (section 51) is completed through section 9 (candidate question answers).
* Standards, specifications, or primary documentation are cited as sources.
* The candidate is mapped to Task 2 architecture roles.
* Known gaps are recorded explicitly.

A Research Finding makes no claim about the candidate's suitability.

## 49. TE-055: Research Finding to Candidate Technology

A Candidate Technology exists when, in addition to `TE-054`:

* All mandatory architecture constraints (`TE-017` through `TE-029`) are evaluated with pass verdicts and cited evidence.
* All applicable disqualifying conditions (`TE-031` through `TE-051`) are screened with clear verdicts and cited evidence.
* All 22 rubric dimensions are scored with per-dimension evidence citations.
* All applicable candidate question sets are answered.
* Failure and recovery behavior is analyzed against `FM-01` through `FM-17` where applicable.

A Candidate Technology is eligible for selection consideration only if it also meets the `TE-012` thresholds.

## 50. TE-056: Candidate Technology to Selected Technology

A Selected Technology exists only when:

* The candidate meets all `TE-055` requirements.
* A decision record using the section 52 template records selection.
* The Task 10 selection gate is applied and satisfied.
* Control Plane approval is recorded with date and authority.

Selection establishes that the candidate may proceed to implementation planning.

It does not establish implementation, testing, observation, enforcement, or production readiness.

## 51. TE-057: Later Transitions Are Defined But Out of Scope

For completeness, the framework defines what later transitions would require, without authorizing them:

* **Selected Technology to Implemented:** component mapping per Task 10, integration or lab evidence showing the candidate performing its claimed trust functions.
* **Implemented to Tested:** positive, negative, and failure tests per the Task 7 invariant verification model, with archived evidence.
* **Tested to Observed:** runtime telemetry and audit evidence from bounded operation showing the claimed behavior holds outside the lab.
* **Observed to Enforced:** demonstration that enforcement actually constrains the protected path under the Task 5 contract, including alternate-path and bypass analysis.
* **Enforced to Production Ready:** explicitly out of scope for Sprint 2; requires a future production-readiness gate the platform has not yet defined.

No Sprint 2 artifact may claim any of these states.

## 52. TE-058: Re-evaluation Triggers

A completed evaluation must be re-done, not amended, when any of the following occur:

* A new candidate version changes trust-relevant behavior.
* New information reveals a previously undetected disqualifying condition.
* Accepted architecture changes in a way that affects the evaluation (new ADR, revised invariant, revised contract).
* The candidate is proposed for a different architecture role set than originally evaluated.
* A security incident implicates the candidate's trust functions.

The prior evaluation record is preserved as history.

---

# Research Template

## 53. TE-059: Research Template Is the Fixed Format

All specialist research feeding technology evaluation must use the following fixed section structure.

Sections may be marked not applicable with reasoning, but sections may not be omitted or reordered.

```text
1. Candidate identification
   - Name, version or commit, candidate type
     (standard, product, open-source implementation, protocol)
   - Maintaining body or vendor; license where applicable
   - Evaluation date and evaluator

2. Evaluation scope
   - Architecture roles addressed (Task 2 role identifiers)
   - Trust functions claimed
   - Trust functions explicitly not claimed

3. Standards alignment
   - Relevant standards and their maturity
   - Proprietary extensions required for required semantics

4. Architecture mapping
   - Role to candidate-capability mapping
   - Trust interfaces per Task 3 contracts
   - Authority and trust-anchor dependencies per Task 4 matrix

5. Invariant assessment
   - Per applicable SI-01 through SI-38:
     preserved, violated, or not applicable, with reasoning

6. Mandatory constraint verdicts
   - Per TE-017 through TE-029: pass or fail, with evidence citation

7. Disqualifier screen
   - Per applicable TE-031 through TE-051:
     clear or triggered, with evidence citation

8. Rubric scores
   - Per dimension: score 0-4, evidence citation, evaluator notes

9. Candidate question answers
   - Per applicable IQ, TQ, LQ, EQ, FQ, RQ set

10. Failure and recovery analysis
    - Per applicable FM-01 through FM-17

11. Gaps and compensating architecture
    - What the candidate cannot do
    - What surrounding architecture must provide

12. Open questions and re-evaluation triggers

13. Evidence state and eligibility
    - Current evidence state (Research Finding or Candidate Technology)
    - Whether TE-012 thresholds are met
    - No selection recommendation beyond eligibility
```

---

# Decision-Record Template

## 54. TE-060: Decision-Record Template Is the Fixed Format

Every selection or rejection decision must use the following fixed section structure.

```text
1. Decision
   - Select, reject, or defer, with effective date

2. Candidate and version
   - Exact version evaluated; evaluation record reference

3. Evaluation summary
   - Gate verdicts (constraints and disqualifiers)
   - Weighted rubric score and per-dimension scores
   - Eligibility threshold check (TE-012)

4. Rationale
   - Why this candidate, for which roles, under which conditions

5. Conditions and limitations
   - What the decision does not establish
     (implementation, testing, enforcement, production readiness)
   - Compensating architecture required
   - Scope boundaries of the selection

6. Dissent and unresolved concerns
   - Recorded disagreements and open risks

7. Authority
   - Control Plane approval, approver, date

8. Evidence-state transition effected
   - From and to states

9. Re-evaluation triggers
   - Per TE-058 as applicable
```

A rejection record must state the specific disqualifying condition or unmet constraint, with evidence, so that a future version can be evaluated against a clear bar.

---

# Traceability

## 55. Dimension Traceability

| Dimension | Primary Plan / Contract Source |
|---|---|
| Standards alignment | Sprint 2 plan Task 9; `trust-standards-landscape.md` |
| Architecture-role coverage | Sprint 2 plan Task 9; Task 2 role-to-capability model |
| Identity semantics | Sprint 2 plan Task 9; `principal-model.md`; `SI-01` through `SI-05`, `SI-11`, `SI-12` |
| Authority semantics | Sprint 2 plan Task 9; `delegated-authority.md`; `SI-19` through `SI-26` |
| Attestation semantics | Sprint 2 plan Task 9; `SI-17`, `SI-18` |
| Authorization semantics | Sprint 2 plan Task 9; Task 5 contract (`AZ-001` through `AZ-022`) |
| Enforcement capability | Sprint 2 plan Task 9; Task 5 contract (`ENF-001` through `ENF-012`) |
| Trust-anchor model | Sprint 2 plan Task 9; Task 4 authority and trust-anchor matrix |
| Bootstrap model | Sprint 2 plan Task 9; `bootstrap-trust.md`; `SI-11` through `SI-16` |
| Revocation model | Sprint 2 plan Task 9; `SI-03`; Failure Model delegation and revocation failure |
| Failure semantics | Sprint 2 plan Task 9; `failure-model.md` (`FM-01` through `FM-17`); `SI-31`, `SI-32` |
| Recovery model | Sprint 2 plan Task 9; Failure Model recovery; `SI-15`, `SI-16` |
| Auditability | Sprint 2 plan Task 9; `SI-35`, `SI-36` |
| Cross-domain support | Sprint 2 plan Task 9; `trust-boundaries.md`; `SI-06` through `SI-10` |
| Crypto agility | Sprint 2 plan Task 9; Platform Charter crypto-agility principle |
| PQC migration posture | Sprint 2 plan Task 9; Platform Charter crypto-agility principle |
| Operational complexity | Sprint 2 plan Task 9 |
| Portability | Sprint 2 plan Task 9 |
| Vendor dependency | Sprint 2 plan Task 9; Platform Charter vendor-neutral principle |
| Observability | Sprint 2 plan Task 9; Task 5 contract (`ENF-010`, `ENF-011`) |
| Testability | Sprint 2 plan Task 9; Task 7 verification model (invariant to control to test to evidence) |
| Reproducibility | Sprint 2 plan Task 9 |

## 56. Constraint-to-Invariant Traceability

| Constraint | Primary Invariants |
|---|---|
| TE-018 | SI-01 |
| TE-019 | SI-02, SI-05 |
| TE-020 | SI-03 |
| TE-021 | SI-17, SI-18 |
| TE-022 | SI-20, SI-21, SI-22, SI-23, SI-24 |
| TE-023 | SI-27 |
| TE-024 | SI-30 |
| TE-025 | SI-31 |
| TE-026 | SI-32 |
| TE-027 | SI-03, FM delegation and revocation failure |
| TE-028 | SI-35, SI-36 |
| TE-029 | SI-38 |

## 57. Disqualifier Traceability

| Disqualifiers | Primary Invariants |
|---|---|
| TE-031 through TE-034 | SI-01, SI-02, SI-04, SI-11 |
| TE-035 through TE-037 | SI-17, SI-18 |
| TE-038 through TE-041 | SI-20, SI-21, SI-22, SI-24 |
| TE-042 | Task 5 contract section 83 |
| TE-043 through TE-045 | SI-08, SI-09, SI-10 |
| TE-046 through TE-048 | SI-15, SI-35, SI-36, FM-16 |
| TE-049 through TE-051 | SI-31, SI-32, Charter crypto-agility principle |

---

# Relationship to Task 10

## 58. Framework Inputs to the Selection Gate

Task 10 consumes this framework; it does not redefine it.

The selection gate receives, per candidate:

* The completed research template (section 53).
* Gate verdicts for `TE-017` through `TE-051`.
* Weighted rubric scores with evidence citations.
* The `TE-012` eligibility determination.
* Candidate question answers.

Task 10 adds component mapping, trust-interface mapping, authority and anchor mapping, enforcement mapping, failure mapping, and invariant verification mapping, then renders the selection decision through the section 54 decision-record template.

If applying the framework exposes a missing or contradictory requirement, Task 10 must return the issue to Control Plane rather than silently adjusting the framework.

---

# Task 9 Acceptance Gate

## 59. Acceptance Criteria

Task 9 passes when:

* The framework defines how candidates are compared after architecture requirements exist.
* All 22 plan dimensions are covered with explicit weights summing to 100.
* Scoring semantics are explicit, including the 0-4 scale and evidence-per-score rule.
* Invariant compliance is a pre-scoring gate, not a weighted factor.
* Mandatory architecture constraints are explicit and traced to invariants.
* Disqualifying conditions are explicit across identity, attestation, delegation, authorization and enforcement, federation, audit and recovery, failure, and cryptography.
* Candidate question sets exist for each trust function, building on the Task 5 section-82 exemplar without duplicating it.
* Evidence requirements exist for each evidence-state transition through selection, with later transitions defined but marked out of scope.
* A fixed research template and a fixed decision-record template are defined.
* Re-evaluation triggers are explicit.
* Traceability matrices connect dimensions, constraints, and disqualifiers to plan and architecture sources.
* No candidate, product, standard, or vendor is selected, ranked, or endorsed.
* No production-readiness claim is made.

## 60. Failure Modes

Task 9 fails if:

* Any of the 22 plan dimensions is missing from the rubric.
* Weights do not sum to 100 or are left implicit.
* Invariant compliance is folded into weighted scoring where a high operational score can offset a semantic violation.
* A disqualifying condition can be waived by scoring rather than by remediating the condition.
* The framework selects, ranks, or endorses a specific product, standard, or vendor.
* Evidence states are collapsed (for example, a completed evaluation is presented as a selection).
* Candidate question sets duplicate the Task 5 section-82 questions instead of building on them.
* The research or decision-record template permits omitted sections without recorded reasoning.
* A mandatory architecture constraint lacks invariant traceability.
* The framework claims authority over production readiness.

---

## 61. Definition of Done

Task 9 content is ready for acceptance when:

* [x] `TE-001` through `TE-060` are defined.
* [x] All 22 evaluation dimensions have explicit weights summing to 100.
* [x] The 0-4 scoring scale and evidence-per-score rule are defined.
* [x] Eligibility thresholds (`TE-012`) are defined.
* [x] Mandatory architecture constraints (`TE-017` through `TE-029`) are defined and traced to invariants.
* [x] Disqualifying conditions (`TE-030` through `TE-051`) are defined across all trust functions.
* [x] Candidate question sets (`IQ`, `TQ`, `LQ`, `EQ`, `FQ`, `RQ`) are defined.
* [x] Evidence-state transition requirements (`TE-053` through `TE-058`) are defined.
* [x] The research template is defined as a fixed format.
* [x] The decision-record template is defined as a fixed format.
* [x] Traceability matrices are complete.
* [x] The Task 10 relationship is defined.
* [x] No technology is selected, ranked, or endorsed.
* [x] No production-readiness claim is made.
* [x] Mechanical document validation passes.
* [x] Semantic architecture review passes.

### Repository Closure Gate

Task 9 is not formally **COMPLETE** until:

* The accepted artifact is committed.
* The commit is pushed to `origin/main`.
* `HEAD == origin/main`.
* The working tree is clean.

---

# Proposed Decision

## 62. Task 9 Decision

The proposed Task 9 decision is:

> **Sprint 2 shall evaluate candidate trust technologies through a two-layer framework: pre-scoring gates enforcing mandatory architecture constraints and disqualifying conditions derived from accepted invariants, followed by a weighted 22-dimension rubric in which security-semantics dimensions dominate and operational dimensions cannot compensate for semantic failure. Evaluation records shall use fixed research and decision-record templates, preserve evidence-state discipline through selection, and trigger re-evaluation on material change. This framework selects nothing; it defines how selection will later be justified.**

This is a derived architecture-to-implementation requirement.

It does not select a standard, product, protocol, or vendor.

---

## 63. ADR Assessment

No new ADR is proposed by Task 9 at this stage.

The evaluation framework derives from accepted:

* ADR-0002
* ADR-0003
* ADR-0005
* ADR-0006
* ADR-0007
* ADR-0008

Two items are flagged for Control Plane attention during Task 10:

1. If applying this framework to a specific technology class (for example, workload identity protocols) reveals that the accepted architecture under-constrains a cross-platform semantic choice, that choice must be recorded through ADR governance before any selection decision, not smuggled in through a favorable evaluation.
2. The proposed `TE-012` eligibility thresholds (60 percent overall, minimum 2 on six core dimensions) are framework parameters, not architecture decisions; changing them later does not require an ADR, but lowering them for a specific candidate to pass does require explicit Control Plane review.

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
* `docs/architecture/trust-standards-landscape.md`
* `docs/assurance/cissp-alignment-and-evidence-map.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`
* `docs/adr/0006-security-invariants-as-architecture-constraints.md`
* `docs/adr/0007-explicit-bounded-security-failure-semantics.md`
* `docs/adr/0008-separate-trust-coordination-from-runtime-enforcement-and-authority-ownership.md`
