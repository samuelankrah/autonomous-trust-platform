# Sprint 2 Task 6 - Failure, Degraded-Mode, and Recovery Control Matrix

**Project:** Autonomous Trust Platform
**Sprint:** Sprint 2 - Trust Control Contracts & Technology Evaluation Gate
**Task:** Task 6 - Failure, Degraded-Mode, and Recovery Control Matrix
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

---

## 1. Objective

Translate the accepted Failure Model into implementation-evaluation requirements: for each material trust dependency, state how every security-relevant failure state must be classified, what continuation is permitted, what expansion is forbidden, how recovery is validated, and what evidence is required.

The governing question is:

> **For each trust dependency the platform relies on, what must an implementation do when that dependency is unavailable, stale, inconsistent, degraded, recovering, or compromised, such that failure never silently creates authority, broadens permission, or strengthens a security conclusion beyond what the available evidence supports?**

Task 6 establishes the contract between:

* Failure state
* Material trust dependency
* Protected resource and action
* Allowed degraded behavior
* Forbidden authority expansion
* Recovery and re-validation
* Audit evidence

It does not select:

* Cache technology
* Revocation protocol
* Policy engine
* Circuit breaker
* Service mesh
* Retry library
* Disaster-recovery platform
* Time-synchronization technology
* Monitoring or observability product
* Deployment topology

---

## 2. Why This Task Matters

Task 5 defined what a correct authorization decision requires. Task 6 defines what must happen when the inputs to that decision cannot be trusted to be current, complete, or even present.

Many systems handle failure with one implicit rule:

```text
dependency failed
        ↓
keep working
```

or one implicit rule in the other direction:

```text
dependency failed
        ↓
stop everything
```

Both are architecture by accident. The first manufactures authority out of ignorance. The second is availability theater that operators will bypass with undocumented exceptions the next time it blocks real work, and those exceptions become the de facto architecture.

Task 6 turns failure handling into explicit contracts:

```text
Unknown
        ≠
Valid
```

```text
Unknown
        ≠
Invalid
```

```text
Unavailable
        ≠
Compromised
```

```text
Service Recovered
        ≠
Trust Re-Established
```

```text
Degraded Operation Permitted
        ≠
Degraded Operation Permanent
```

A future implementation cannot claim conformance if its failure behavior silently broadens authority, even if it performs well operationally.

---

## 3. Refinement of Task 5 Requirements

Task 5 (section 80) deferred explicit failure behavior for nine requirements. Task 6 supplies it.

| Task 5 Requirement | What Task 6 Adds |
|---|---|
| AZ-013 (input-specific freshness) | Freshness threshold model (FR-018 through FR-022): per-input bounds, bounded-stale definition, trusted-time dependency |
| AZ-014 (bounded decision caching) | Cached-state semantics (FR-028 through FR-032): cache policy fields, invalidating events, expiry behavior |
| AZ-015 (revocation invalidates decisions) | Revocation-state failure classification (FR-012), disconnected revocation rules, deferred revocation reconciliation (FR-049) |
| AZ-019 (decision states explicit) | Failure-state classification model (FR-001 through FR-003): INDETERMINATE remains distinguishable from DENY under every failure state |
| AZ-022 (indeterminate must not become permit) | Forbidden-expansion rules per dependency (FR-004 through FR-017), degraded-state composition rules (FR-041 through FR-044) |
| ENF-009 (enforcement failure distinct) | Enforcement dependency failure matrix row (FR-015): unavailable enforcement must not expose an ungoverned path |
| CTL-004 (decision freshness control) | Freshness and cache requirements applied to enforcement-time decision validation (FR-018, FR-028 through FR-032) |
| CTL-009 (cached-decision invalidation) | Invalidating events and re-validation triggers (FR-031, FR-051) |
| CTL-011 (unknown-state preservation) | State vocabulary enforcement (FR-001): unknown, stale, unavailable, and inconsistent states remain distinguishable through the decision path and are never collapsed into an unqualified trusted value |

---

# Failure-State Classification Model

## 4. FR-001 - Failure States Must Remain Distinguishable

**Requirement ID:** `FR-001`

For every material trust dependency, the implementation must preserve the following states as distinct values. They must not be collapsed into a single generic error, a boolean, or a scalar trust score.

```text
VALID
INVALID
UNKNOWN
UNAVAILABLE
STALE
INCONSISTENT
DEGRADED
RECOVERING
COMPROMISED
```

State semantics:

* **VALID:** the dependency is reachable and provides evidence within accepted freshness and validity requirements.
* **INVALID:** available evidence positively disproves the security claim (for example, a revocation entry exists, a signature does not verify, an appraisal policy rejects the evidence). INVALID is a determined negative, not a failure of information.
* **UNKNOWN:** the system cannot establish the required security conclusion from available evidence.
* **UNAVAILABLE:** the dependency cannot provide the required result (unreachable, timed out, capacity-exhausted).
* **STALE:** evidence or state exists but exceeds the freshness bound established for the operation.
* **INCONSISTENT:** multiple accepted sources disagree about relevant security state.
* **DEGRADED:** the dependency reports reduced function and the system is operating under an explicit degraded-mode policy.
* **RECOVERING:** the dependency is transitioning from failure toward normal operation and is not yet authoritative for all conclusions.
* **COMPROMISED:** the dependency is suspected or confirmed to produce confident but incorrect security conclusions. This is a security condition, not an availability condition.

The following inequalities hold for every dependency:

```text
Unknown
        ≠
Invalid
        ≠
Valid
```

```text
Dependency Unavailable
        ≠
Dependency Compromised
```

## 5. FR-002 - Compromise Remains Distinct From Availability Failure

**Requirement ID:** `FR-002`

COMPROMISED must never be handled by ordinary degraded-mode or retry policy.

A compromised authority requires:

* Containment (stop accepting its conclusions for new decisions)
* Invalidation (identify which downstream conclusions depended on it, per FM-13 and SI-33)
* An independent trust basis for recovery (SI-15, FM-04)
* Separate governance from availability incident handling

Ordinary failure handling must not be used to normalize suspected compromise. A dependency that returns confident wrong answers is more dangerous than one that returns no answers, and the architecture must treat it as such.

## 6. FR-003 - INDETERMINATE Is the Failure Decision State

**Requirement ID:** `FR-003`

When required authorization inputs are in UNKNOWN, UNAVAILABLE, STALE (beyond bounded-stale policy), INCONSISTENT, or RECOVERING states and no explicit bounded-continuation policy governs, the authorization decision state must be INDETERMINATE (AZ-019), never PERMIT.

```text
INDETERMINATE
        ≠
DENY
        ≠
PERMIT
```

Any bounded continuation under failure is a governed exception to this rule and must satisfy the degraded-mode contract (FR-033 through FR-040).

---

# Per-Dependency Failure Control Matrix

## 7. Material Dependencies

The fourteen material trust dependencies below derive from the Failure Model (section 8), the role model (Task 2), the interface contracts (Task 3), and the authority matrix (Task 4).

FR-004 through FR-017 define, per dependency: required failure classification, forbidden authority expansion, allowed bounded continuation, recovery trigger, re-validation requirement, audit requirement, and resource-specific shutdown condition.

Freshness thresholds (FR-018 through FR-022), trusted-time rules (FR-023 through FR-027), and cached-state semantics (FR-028 through FR-032) apply across all rows and are defined once rather than repeated.

## 8. FR-004 - Identity Issuance Failure

**Requirement ID:** `FR-004`
**Roles:** `ROLE-003` (Identity Authority)
**Edges:** `EDGE-001` (Identity Assertion / Validation)

* **Classification:** UNAVAILABLE issuance classifies as UNKNOWN for new-identity conclusions; existing issued identities are unaffected unless their validity independently depends on the issuer.
* **Forbidden expansion:** an unavailable issuer must not cause previously issued identities to be treated as revoked (that would be INVALID without evidence), nor cause unissued identities to be treated as valid.
* **Allowed bounded continuation:** none for new issuance. Existing credentials remain usable within their normal validity periods.
* **Recovery trigger:** issuer reachable and its authority re-validated against its trust anchor and bootstrap basis (Task 4 matrix).
* **Re-validation:** credentials issued just before or during the outage window must be reconciled against the issuer's authoritative record before being treated as current.
* **Audit:** outage window, affected issuance requests, recovery time, reconciliation result.
* **Shutdown condition:** none at the platform level; enrollment-gated resources deny new enrollments until recovery.

## 9. FR-005 - Identity Validation Failure

**Requirement ID:** `FR-005`
**Roles:** `ROLE-004` (Identity Validation)
**Edges:** `EDGE-001`

* **Classification:** UNAVAILABLE validation classifies the identity conclusion as UNKNOWN, not INVALID.
* **Forbidden expansion:** unknown identity must not become authorized identity (AZ-002, AZ-022).
* **Allowed bounded continuation:** locally verifiable credentials (verifiable without the unavailable service) remain usable; cached validation metadata may be used only within explicit freshness bounds; high-risk operations require fresh validation.
* **Recovery trigger:** validation service reachable and its verification basis confirmed current.
* **Re-validation:** sessions established on cached validation during the outage must be re-validated where resource policy requires it.
* **Audit:** validation outage, which requests used cached validation, cache ages at use time.
* **Shutdown condition:** resources whose policy requires fresh validation deny new sessions until recovery.

## 10. FR-006 - Credential Renewal Failure

**Requirement ID:** `FR-006`
**Roles:** `ROLE-003`, `ROLE-004`
**Edges:** `EDGE-001`

* **Classification:** failed renewal leaves the credential in its existing state; expiry is determined by the credential's own validity period, not by the renewal failure.
* **Forbidden expansion:** renewal failure must not silently extend a credential beyond its accepted validity period. Expiration remains authoritative.
* **Allowed bounded continuation:** none beyond normal validity. A separately governed grace policy may exist but must be explicit, bounded, and audited; it is not implied by the failure.
* **Recovery trigger:** renewal path available.
* **Re-validation:** renewed credentials must chain to a currently trusted anchor; renewal does not renew delegated authority (identity and authority lifecycles remain independent, SI-03).
* **Audit:** failed renewal attempts, credentials that expired during the outage, any grace-policy invocations.
* **Shutdown condition:** none automatic; expired credentials simply stop working, which is correct behavior, not an outage.

## 11. FR-007 - Attestation Verification Failure

**Requirement ID:** `FR-007`
**Roles:** `ROLE-006` (Attestation Verifier)
**Edges:** `EDGE-004` (Attestation Result)

* **Classification:** UNAVAILABLE verifier classifies the Attestation Result as UNKNOWN. STALE evidence remains authentic but not fresh (authentic evidence is not fresh evidence).
* **Forbidden expansion:** an unavailable verifier must not produce a positive Attestation Result; a cached Result must not be treated as fresh.
* **Allowed bounded continuation:** bounded cached Results for lower-risk actions only, with an explicit maximum age and a re-attestation deadline; quarantine or session continuation until a defined deadline where policy permits.
* **Recovery trigger:** verifier reachable, reference values confirmed current, appraisal policy version confirmed.
* **Re-validation:** cached Results used during the outage must be re-verified or replaced; recovery must not automatically make pending Results current.
* **Audit:** verifier outage, cached Results consumed (with ages), re-attestation completions.
* **Shutdown condition:** resources requiring fresh attestation (for example, high-value signing) deny until fresh Results are available.

## 12. FR-008 - Trust-Anchor Retrieval Failure

**Requirement ID:** `FR-008`
**Roles:** `ROLE-017` (Trust Coordination / Governance)
**Edges:** `EDGE-012` (Trust-Anchor Distribution)
**Authority baseline:** Task 4 authority/anchor matrix (`AUTH-*`, `ANCHOR-*`)

* **Classification:** UNAVAILABLE retrieval classifies anchor-dependent conclusions as UNKNOWN. Locally installed trust material is not thereby proven invalid.
* **Forbidden expansion:** inability to fetch current anchors must not silently restore a removed authority or accept an anchor that local policy has distrusted.
* **Allowed bounded continuation:** continued use of locally installed anchors within explicit freshness and risk bounds.
* **Recovery trigger:** retrieval path available and retrieved material verified against the anchor's own integrity and provenance requirements.
* **Re-validation:** confirm no rotation or removal occurred during the outage window; reconcile before treating retrieved material as authoritative.
* **Audit:** retrieval failures, continued-use decisions with anchor versions and ages, reconciliation outcome.
* **Shutdown condition:** trust-anchor changes (rotation, removal, federation onboarding) are suspended until retrieval recovers; they must not proceed on stale material.

## 13. FR-009 - Trust-Bundle Distribution Failure

**Requirement ID:** `FR-009`
**Roles:** `ROLE-017`
**Edges:** `EDGE-012`

* **Classification:** UNAVAILABLE distribution with a locally installed bundle classifies dependent conclusions as DEGRADED (bounded-stale), not UNKNOWN, provided the bundle is within its accepted staleness bound; beyond the bound, UNKNOWN.
* **Forbidden expansion:** stale bundles must not silently restore intentionally removed authorities, and must not extend trust to newly added authorities as if they had been evaluated.
* **Allowed bounded continuation:** use of the installed bundle within the per-relationship maximum staleness defined in the failure decision record.
* **Recovery trigger:** distribution available; bundle version confirmed current or delta applied and verified.
* **Re-validation:** verify no authority removal or rotation was missed during the outage; re-evaluate decisions made on stale material where the missed change is security-relevant.
* **Audit:** distribution outage, bundle version and age at each use, missed-update reconciliation.
* **Shutdown condition:** relationships whose maximum acceptable staleness is exceeded suspend new trust establishment until the bundle is current.

## 14. FR-010 - Federation Failure

**Requirement ID:** `FR-010`
**Roles:** `ROLE-007` (Relying Function), `ROLE-017`
**Edges:** `EDGE-015` (Cross-Domain Assertion)

* **Classification:** UNAVAILABLE federation peer or verification path classifies external assertions as UNKNOWN. The receiving domain retains local authority over degraded behavior.
* **Forbidden expansion:** inability to verify an external assertion must not cause the assertion to be accepted; federation availability must not silently change local authorization policy.
* **Allowed bounded continuation:** bounded locally cached verification state for previously established sessions; low-risk continuations only.
* **Recovery trigger:** peer reachable, metadata and key updates verified, revocation information refreshed.
* **Re-validation:** assertions accepted on cached state during the outage must be re-verified; key rotations missed during the outage must be applied before new assertions are accepted.
* **Audit:** federation outage, assertions evaluated on cached state, missed metadata updates.
* **Shutdown condition:** new cross-domain trust establishment suspends until federation verification recovers.

## 15. FR-011 - Delegation Verification Failure

**Requirement ID:** `FR-011`
**Roles:** `ROLE-008` (Authority Source), `ROLE-012`
**Edges:** `EDGE-006` (Delegation Validation Result)

* **Classification:** inability to verify a delegation grant classifies the delegation conclusion as UNKNOWN.
* **Forbidden expansion:** the inability to verify delegation must not silently produce delegated authority. There is no "probably still valid" delegation.
* **Allowed bounded continuation:** previously validated grants may continue only where an explicit bounded-continuation policy permits, within scope, lifetime, and freshness bounds.
* **Recovery trigger:** verification path available and delegation chain re-validated against the current Authority Source.
* **Re-validation:** grants used during the outage must be re-validated; expired grants are not revived by recovery.
* **Audit:** verification outage, grants continued under bounded policy, re-validation results.
* **Shutdown condition:** delegation-dependent high-risk actions deny until verification recovers, unless a bounded-continuation policy explicitly governs them.

## 16. FR-012 - Revocation State Failure

**Requirement ID:** `FR-012`
**Roles:** `ROLE-008`, `ROLE-012`
**Edges:** `EDGE-011` (Revocation State)

* **Classification:** UNAVAILABLE revocation state classifies authority validity as UNKNOWN. The architecture preserves:

```text
Revocation State Unknown
        ≠
Not Revoked
```

and:

```text
Revocation State Unknown
        ≠
Revoked
```

* **Forbidden expansion:** unknown revocation must not be treated as proof of validity (this is the single most dangerous failure misclassification in the matrix).
* **Allowed bounded continuation:** resource- and risk-specific. Factors: resource sensitivity, grant age, grant lifetime, last known revocation state, existing session state, transaction risk. Disconnected operation requires explicit architecture: which grants may continue, maximum disconnected duration, last-known-good requirements, reconnection re-validation.
* **Recovery trigger:** revocation source reachable and current.
* **Re-validation:** deferred revocation reconciliation (FR-049): revocations that occurred during the outage must be applied to active sessions, cached decisions, and delegation chains; recovery must not assume the outage contained no changes.
* **Audit:** revocation outage window, decisions made under unknown revocation state, reconciliation actions taken.
* **Shutdown condition:** high-sensitivity resources deny or suspend new grants until revocation state is observable; disconnected mode must never become a permanent implicit bypass.

## 17. FR-013 - Authorization Policy Failure

**Requirement ID:** `FR-013`
**Roles:** `ROLE-011` (Policy Authority), `ROLE-012`
**Edges:** `EDGE-007` (Policy Distribution)

* **Classification:** UNAVAILABLE policy engine classifies the decision basis as UNKNOWN. A previous ALLOW decision is evidence of a past decision, not standing authority.
* **Forbidden expansion:** an unavailable policy engine does not authorize the request; a cached ALLOW must not become a context-free standing entitlement.
* **Allowed bounded continuation:** bounded cached decisions within explicit cache policy (AZ-014, FR-028 through FR-032); locally evaluable policy where the architecture explicitly provides it; permit of existing sessions within previously authorized scope where governed.
* **Recovery trigger:** policy engine reachable and policy version confirmed.
* **Re-validation:** policy-version divergence during the outage must be reconciled (FR-050); decisions made under old policy must be identified by version in evidence.
* **Audit:** policy outage, cached decisions used (with policy versions and ages), divergence detected.
* **Shutdown condition:** resources whose policy cannot be evaluated and whose cache policy does not cover the request deny or defer.

## 18. FR-014 - Authorization Decision Service Failure

**Requirement ID:** `FR-014`
**Roles:** `ROLE-012` (Authorization Decision Function)
**Edges:** `EDGE-008` (Authorization Context), `EDGE-009` (Authorization Decision)

* **Classification:** UNAVAILABLE decision service yields no decision; the request state is INDETERMINATE (FR-003).
* **Forbidden expansion:** absence of a decision must not be interpreted as PERMIT at any enforcement point.
* **Allowed bounded continuation:** bounded cached decisions per FR-028 through FR-032; deferral and bounded retry per explicit policy.
* **Recovery trigger:** decision service reachable and its decision basis (policy version, revocation observability) confirmed adequate.
* **Re-validation:** none for the service itself beyond basis checks; downstream cached decisions re-validated per FR-031.
* **Audit:** decision-service outage, requests deferred or decided on cache, recovery time.
* **Shutdown condition:** if no cached or local decision path is governed for the resource, the resource denies until the service recovers. A correct decision that fails to reach enforcement is handled under FR-015.

## 19. FR-015 - Enforcement Point Failure

**Requirement ID:** `FR-015`
**Roles:** `ROLE-013` (Enforcement Point)
**Edges:** `EDGE-009`, `EDGE-010` (Enforcement Outcome)

* **Classification:** UNAVAILABLE enforcement classifies the enforcement outcome as UNKNOWN. The architecture preserves:

```text
Authorization Failure
        ≠
Enforcement Failure
        ≠
Resource Failure
        ≠
Audit Failure
```

* **Forbidden expansion:** failed enforcement must not silently expose an ungoverned path to the protected operation. A DENY decision that never reaches enforcement is not a completed control; an ALLOW decision that never reaches enforcement is not effective authorization.
* **Allowed bounded continuation:** failover to an equivalent enforcement point that preserves the same security semantics; restricted functionality where the remaining path is fully mediated. Failover must not become a weaker alternate path merely to preserve availability.
* **Recovery trigger:** enforcement point reachable and its configuration verified against governed enforcement state (ENF-005).
* **Re-validation:** verify enforcement configuration did not change during the outage; reconcile any decisions that were made but not delivered.
* **Audit:** enforcement outage, failover activations, decisions made but undelivered, configuration verification result.
* **Shutdown condition:** if the protected operation cannot be mediated by an accepted enforcement point, the resource becomes unavailable for that operation. Partial enforcement failure (one path enforced, another ungoverned) is a control failure, not a degraded success.

## 20. FR-016 - Audit and Evidence Failure

**Requirement ID:** `FR-016`
**Roles:** `ROLE-015` (Audit / Evidence Function)
**Edges:** `EDGE-013` (Audit Evidence)

* **Classification:** UNAVAILABLE audit destination is an operational conflict between availability and accountability; the decision is resource-specific, never silent.
* **Forbidden expansion:** audit outage must not disable the authorization or enforcement controls themselves, and must not cause evidence to be silently dropped.
* **Allowed bounded continuation:** buffered evidence with integrity, ordering, actor context, authority provenance, and delivery status preserved; continuation for lower-risk actions only; alternate evidence storage where governed.
* **Recovery trigger:** audit destination reachable; buffered evidence reconciled (delivered, duplicate, replayed, and lost evidence distinguished).
* **Re-validation:** confirm no evidence was lost or reordered in ways that break reconstruction; high-risk actions taken during the outage must have their evidence confirmed delivered.
* **Audit:** the audit outage is itself audited (detection time, buffering behavior, recovery, reconciliation counts). Audit failure handling is recursive: the record of the outage must survive the outage.
* **Shutdown condition:** operations requiring synchronous durable audit (for example, trust-anchor changes, recovery invocations, emergency authority use) stop until durable audit is available.

## 21. FR-017 - Recovery Infrastructure Failure

**Requirement ID:** `FR-017`
**Roles:** `ROLE-016` (Recovery Authority)
**Edges:** `EDGE-014` (Recovery Action)

* **Classification:** a failed recovery authority is itself a security-relevant failure; recovery paths must identify their own dependencies.
* **Forbidden expansion:** failure of primary recovery must not cause an ungoverned actor to assume recovery authority.
* **Allowed bounded continuation:** alternate recovery paths identified in advance, with required approvals and independent trust bases.
* **Recovery trigger:** recovery authority reachable and its own trust basis validated independently of the failed primary (SI-15).
* **Re-validation:** confirm the alternate path did not share the failed dependency (a supposedly independent recovery mechanism sharing the same critical dependency is not independent).
* **Audit:** recovery-authority outage, alternate path invocations, approvals obtained.
* **Shutdown condition:** if no independent recovery path exists for a critical function, that condition must be recorded as an accepted residual risk with explicit governance, not discovered during an incident.

# Freshness Threshold Model

## 22. FR-018 - Freshness Bounds Are Per-Input and Per-Operation

**Requirement ID:** `FR-018`

Freshness requirements must be attached to the protected operation and the specific input, not only to the infrastructure service. The architecture must ask, for each decision:

```text
Which input?
For which resource and action?
Maximum acceptable age?
What happens when the bound is exceeded?
```

The architecture prohibits collapsing all freshness into one request timestamp (AZ-013 refinement). Distinct freshness is required at minimum for: identity, principal-to-runtime binding, delegation, attestation, policy, revocation, environmental context, and the decision itself.

## 23. FR-019 - Bounded-Stale Is an Explicit Policy, Not an Accident

**Requirement ID:** `FR-019`

Evidence that exceeds ideal freshness but remains usable is called bounded-stale only when an explicit policy defines:

* Maximum age
* Which claims or properties the stale evidence may still support
* Which operations it may support
* Re-validation triggers
* What happens when the bound expires

Stale evidence discovered to be in use without such a policy is a control failure, not a degraded state.

## 24. FR-020 - Freshness Bounds Must Be Resource-Specific

**Requirement ID:** `FR-020`

The same input may carry different freshness bounds for different operations. A revocation check fresh enough for a low-risk read may be unacceptably stale for a trust-anchor change. The failure decision record (section 34) captures the bound per protected operation or resource class.

## 25. FR-021 - Authentic Evidence Is Not Fresh Evidence

**Requirement ID:** `FR-021`

Integrity verification (the evidence is genuine and unmodified) and freshness verification (the evidence is current enough for this decision) are separate checks. A system that verifies signatures but not ages has verified only half of what freshness requires. Both checks must be evidenced for time-sensitive inputs.

## 26. FR-022 - Freshness Failure Must Be Observable

**Requirement ID:** `FR-022`

When a decision proceeds on bounded-stale evidence, or is denied or deferred because evidence exceeded its bound, the evidence must record which input was stale, its age at decision time, and the bound that applied. Downstream systems must not be led to believe normal freshness was present when it was not (FM-09 visibility principle applied to freshness).

---

# Trusted-Time Dependency

## 27. FR-023 - Time Is a Security Dependency

**Requirement ID:** `FR-023`

Freshness, expiration, cache age, delegation validity, attestation validity, and every other time-bounded security conclusion depend on trustworthy time. Time-source failure is therefore a security-relevant failure state subject to this matrix, not an operational detail.

The architecture must account for:

* Clock skew between components
* Clock rollback
* Time-source unavailability
* Inconsistent time across components
* Unexpected clock jumps

## 28. FR-024 - Clock Uncertainty Must Be Bounded Per Decision

**Requirement ID:** `FR-024`

Where time affects a security decision, the implementation must define the acceptable clock uncertainty for that decision. A time-bounded credential, grant, assertion, cache entry, or Attestation Result must not automatically be treated as current when the system cannot establish time within the required bounds.

Example: if acceptable uncertainty is 5 minutes and a credential expired 3 minutes ago by local clock, the credential must be treated as expired, because expiry cannot be disproven within the uncertainty bound. Uncertainty resolves against the security conclusion, never for it.

## 29. FR-025 - Clock Rollback Must Not Resurrect Expired Authority

**Requirement ID:** `FR-025`

A backward clock jump must not cause expired credentials, grants, cached decisions, or attestation results to be treated as current. Implementations must defend against rollback resurrection through monotonic time sources, persisted high-water marks, or equivalent mechanisms where the risk justifies it. The required mechanism is resource-specific and recorded in the failure decision record.

## 30. FR-026 - Time-Source Unavailability Has Explicit Semantics

**Requirement ID:** `FR-026`

When the trusted time source is unavailable, the system must define per resource class whether decisions continue on local clock (with what uncertainty bound), defer, or deny. Continued operation on an unvalidated local clock beyond the uncertainty bound is a silent freshness failure and is forbidden.

## 31. FR-027 - No Time Technology Is Selected

**Requirement ID:** `FR-027`

Task 6 defines the required time semantics. It does not select a time-synchronization protocol, time source, or timestamp authority. Candidate technologies are evaluated against FR-023 through FR-026 in Task 9.

---

# Cached-State Semantics

## 32. FR-028 - Cache Policy Must Be Explicit

**Requirement ID:** `FR-028`

Use of cached security state requires an explicit cache policy defining, at minimum:

```text
What was cached?
When was it validated?
Which authority produced it?
Which resource and action is it valid for?
Maximum age?
Which invalidating events matter?
What happens when the bound expires?
```

Cached state is not inherently safe merely because it was once valid (refines AZ-014, CTL-009).

## 33. FR-029 - Cached Decisions Must Not Outlive Their Justification

**Requirement ID:** `FR-029`

A cached authorization decision must not outlive the authority or security evidence required to justify it, unless a specifically governed bounded-continuation policy permits it. The cache policy must define: maximum lifetime, resource scope, action scope, principal scope, transaction reuse rules, policy version binding, revocation dependency, attestation dependency, re-evaluation triggers, and invalidation behavior (AZ-014 refinement).

A cached ALLOW is a previously made decision with a remaining lifetime, not a standing entitlement.

## 34. FR-030 - Last-Known-Good Is Provenance, Not Policy

**Requirement ID:** `FR-030`

"Last known good" describes the provenance of cached state. It is not by itself an authorization to continue using it. The architecture must not infer:

```text
Last Known Good
        =
Safe Indefinitely
```

Continued use requires the explicit freshness and risk policy defined in FR-028 and FR-029.

## 35. FR-031 - Invalidating Events Must Be Defined

**Requirement ID:** `FR-031`

The cache policy must enumerate which events invalidate cached state, at minimum including where applicable:

* Revocation of the underlying grant, credential, or authority
* Policy change affecting the decision
* Authority change (source, delegator, issuer)
* Principal-to-runtime binding change
* Resource sensitivity or classification change
* Attestation freshness expiration
* Trust-anchor change
* Delegation expiry

Invalidation must be effective, not merely recorded: an invalidated cache entry must not continue to authorize.

## 36. FR-032 - Cache Expiry Behavior Must Be Defined

**Requirement ID:** `FR-032`

When cached state reaches its maximum age, the defined behavior (deny, defer, revalidate, or governed degraded continuation) must execute automatically. Expiry must not be silently ignored, and an expired entry must never be treated as valid because no fresher state is available.

# Degraded-Mode Governance Contract

## 37. FR-033 - Degraded Mode Must Be Explicit

**Requirement ID:** `FR-033`

A system is in degraded mode when one or more normally required security inputs are unavailable but some operation is permitted to continue under a defined alternate policy. Degraded mode must define, before it is ever entered:

* Entry condition (which failure states trigger it)
* Allowed operation set
* Forbidden operation set
* Maximum duration
* Required evidence
* Exit condition
* Re-validation requirement
* Audit behavior

An implementation that continues operating on failed inputs without these elements defined is not in degraded mode; it is in an ungoverned failure state.

## 38. FR-034 - Degraded Mode Is Not Normal Mode

**Requirement ID:** `FR-034`

Temporary degraded behavior must not silently become the permanent operating model. The platform must avoid:

```text
temporary exception
      ↓
never removed
      ↓
de facto architecture
```

Every degraded-mode policy must carry a maximum duration and either automatic exit (to deny, defer, or recovered normal operation) or mandatory governance review before extension. An extension is a new governance decision with fresh evidence, not a continuation of the old one.

## 39. FR-035 - Reduced Assurance Must Be Visible

**Requirement ID:** `FR-035`

When an operation proceeds under reduced assurance, that state must be observable wherever it is security-relevant. Examples include degraded authorization mode, stale attestation, cached policy decisions, revocation uncertainty, and federation outage. Evidence must record the degraded condition so that audit, incident response, and downstream systems can distinguish it from normal-assurance operation (FM-09).

## 40. FR-036 - Degraded Mode Must Not Silently Downgrade Identity Assurance

**Requirement ID:** `FR-036`

Unavailability of stronger verification infrastructure must not cause a candidate to be silently assigned a weaker identity. A system under pressure to enroll must either defer enrollment, use an explicitly approved alternate bootstrap method, restrict the resulting identity, or require administrative recovery. The identity semantics stay deliberate even when the infrastructure is not.

## 41. FR-037 - Degraded Entry Must Be Detected, Not Declared by Convenience

**Requirement ID:** `FR-037`

Entry into degraded mode must be triggered by detected failure-state transitions on the dependencies named in the failure decision record, not by operator discretion at request time. Manual invocation of degraded mode (for example, during maintenance) is permitted only as a governed administrative action with its own approval, scope, duration, and audit trail.

## 42. FR-038 - Degraded Mode Has a Defined Operation Set

**Requirement ID:** `FR-038`

The allowed operation set must be enumerated by resource and action, not described as "read-only" or "non-critical" in the abstract. For each allowed operation, the record must state which security inputs are degraded, which compensating bounds apply, and why the residual risk is acceptable. Anything not enumerated is forbidden.

## 43. FR-039 - Degraded Exit Requires Re-Validation

**Requirement ID:** `FR-039`

Exiting degraded mode is a recovery transition subject to section 45 (FR-045 through FR-052). Return of the failed dependency does not by itself end degraded mode; the re-validation requirements of the affected dependencies must be satisfied first, and the exit must be evidenced.

## 44. FR-040 - Degraded Mode Must Be Audited as a Security Event

**Requirement ID:** `FR-040`

Entry into, operation within, extension of, and exit from degraded mode are security-relevant events. The evidence must include: which dependency failed, which failure state was observed, which degraded policy was invoked, which operations were permitted, which were denied, duration, and the re-validation outcome on exit.

---

# Degraded-State Composition Rules

## 45. FR-041 - Degraded States Must Not Auto-Compose

**Requirement ID:** `FR-041`

Individually permitted degraded states must not automatically be assumed permissible when combined (FM-17). A degraded-mode policy must define, for its scope, either which combinations are permitted, which more restrictive behavior applies to combinations, or that the operation cannot continue under combined degradation.

Example of a forbidden implicit composition:

```text
cached policy           (permitted alone)
    +
stale attestation       (permitted alone)
    +
unknown revocation      (permitted alone)
    =
permit                  (NOT permitted by union)
```

Each combination actually relied upon must be explicitly evaluated. Independent degradation allowances must not be implicitly composed through union.

## 46. FR-042 - Compound Degradation Defaults to the More Restrictive Behavior

**Requirement ID:** `FR-042`

Where a degraded-mode policy permits individual degradations but does not explicitly define their combination, the default behavior for a combined degraded state is the most restrictive behavior among the applicable individual policies (typically deny or defer), not the most permissive. Permissive combination is allowed only by explicit definition.

## 47. FR-043 - Degradation Budget Model

**Requirement ID:** `FR-043`

Implementations may define a bounded degradation budget describing which combinations of reduced assurance remain permissible for an operation. Any such model must:

* Be explicit and governed, not emergent
* Preserve all applicable Security Invariants
* Define how the budget is consumed, measured, and reset
* Define what happens when the budget is exhausted

No universal scoring mechanism is selected here. A budget that permits violating an invariant is not a budget; it is a misconfiguration.

## 48. FR-044 - Cascading Degradation Must Remain Traceable

**Requirement ID:** `FR-044`

Failure of one dependency may degrade several downstream functions (for example, trust-bundle distribution failure degrades verifier trust, which degrades federation verification, which degrades authorization context). The implementation must model dependency chains so that every degraded conclusion remains traceable to the failed dependency (FM-13, FM-71 in the Failure Model). A degraded conclusion whose provenance cannot be traced to its cause is not governed.

---

# Recovery as a Trust-State Transition

## 49. FR-045 - Recovery Is a Security Transition, Not a Restart

**Requirement ID:** `FR-045`

Return of a failed dependency is a transition between trust states. The platform distinguishes service recovery from trust recovery:

```text
Service Availability Restored
        ≠
Trustworthy State Re-Established
```

A component may be reachable while its security state remains stale, inconsistent, incomplete, or unverified. Availability alone does not prove recovery (FM-10).

## 50. FR-046 - Recovery Requires Validation Before Authority

**Requirement ID:** `FR-046`

A recovered dependency becomes authoritative for new security conclusions only after defined validation completes. Depending on the dependency, validation may include: identity re-verification, configuration verification, trust-anchor confirmation, policy version confirmation, reference-value confirmation, revocation-state refresh, queued-update processing, clock and freshness-state verification, and review of administrative changes made during the outage.

Until validation completes, the dependency remains in RECOVERING state and its conclusions are not authoritative.

## 51. FR-047 - Recovery Ordering Must Follow Dependencies

**Requirement ID:** `FR-047`

Dependencies may require ordered restoration (for example: trust material, then identity and verifier validation, then policy, then authorization, then enforcement). The correct order follows actual dependency relationships. A component becoming available before its own trusted dependencies have recovered does not thereby become authoritative. The recovery plan must define the order or define how out-of-order recovery is detected and handled.

## 52. FR-048 - Security Conclusions From the Failure Window Must Be Re-Evaluated

**Requirement ID:** `FR-048`

Conclusions made during degraded operation whose validity may have changed during the failure window must be re-evaluated after recovery (FM-11). This includes at minimum: cached Attestation Results, delegation grants used under bounded continuation, authorization decisions made on stale or cached inputs, revocation assumptions, and federation assertions. The re-evaluation requirement is per dependency and recorded in the failure decision record.

## 53. FR-049 - Deferred Revocation Reconciliation Is Mandatory

**Requirement ID:** `FR-049`

If revocation could not be observed during a failure window, recovery must define how newly discovered revocations affect active sessions, cached decisions, delegation chains, audit interpretation, and pending operations. Recovery must not assume the outage period contained no security-state changes. Sessions and grants revoked during the outage must be terminated or re-authorized; audit records from the outage must be annotated with the reconciliation outcome.

## 54. FR-050 - Deferred Policy Reconciliation Is Mandatory

**Requirement ID:** `FR-050`

When policy updates were unavailable during partition or outage, recovery must establish: which policy version is authoritative, whether decisions made under the old policy remain acceptable, whether active sessions require re-authorization, and whether evidence must record the old policy version. Enforcement evidence should identify the policy version used for each decision so divergence is detectable (AZ-016 refinement).

## 55. FR-051 - Split-Brain Security State Must Be Detected and Resolved

**Requirement ID:** `FR-051`

After network partition, components may disagree about security state (for example, one node considers a grant valid while another has observed its revocation). The architecture must define how such disagreement is detected and resolved. Until resolved, the more restrictive interpretation governs new decisions, and the inconsistency itself is a security-relevant event requiring audit and governance attention. Inconsistency must not be hidden behind nominal service availability.

## 56. FR-052 - Recovery Authority Is a First-Class Authority

**Requirement ID:** `FR-052`

Recovery actions are security-relevant and governed. A recovery path must identify: who may initiate it, what may be modified, required approvals, audit requirements, expiration of temporary authority, revocation of emergency credentials, and the independent trust basis for the recovery authority itself (refines FR-017). Recovery performed through an ungoverned path is indistinguishable from compromise response failure.

---

# Emergency Authority Invocation Contract

## 57. FR-053 - Emergency Authority Requires an Independent Source

**Requirement ID:** `FR-053`

Failure of a trust dependency must not silently create authority that did not exist before the failure (FM-01, FM-08). Emergency or break-glass operation is permitted only when it derives from an explicit, independently governed authority source:

```text
Dependency Failure
      ↓
does not itself grant
      ↓
Emergency Authority
```

```text
Independent Emergency Authority
        +
Explicit Invocation
        +
Governance
        +
Audit
        +
Expiration / Revocation
        =
Emergency Operation
```

Failure is the trigger for invoking the path, not the source of the authority.

## 58. FR-054 - Emergency Invocation Must Be Explicit and Bounded

**Requirement ID:** `FR-054`

Each emergency invocation must define: who may invoke it, for which resource and purpose, required approvals (including multi-party requirements where applicable), scope of permitted actions, expiration, and audit evidence. An emergency path without these elements is an undocumented bypass (ENF-007), not a recovery mechanism.

## 59. FR-055 - Emergency Authority Must Be Revocable and Retired

**Requirement ID:** `FR-055`

Emergency credentials and authorities must carry expiration and revocation. After the emergency ends, the recovery process must confirm that emergency credentials are revoked or expired, that actions taken under emergency authority are identified in audit, and that the emergency path itself is retired to its dormant governed state. An emergency authority that persists beyond its justification becomes standing privilege.

## 60. FR-056 - Emergency Use Must Be Audited Durably

**Requirement ID:** `FR-056`

Emergency authority invocation requires durable audit before or concurrent with the action where the risk justifies it (FR-016: operations requiring synchronous durable audit include emergency authority use). The evidence must support after-action review: who invoked, what was done, under whose approval, for what purpose, for how long.

## 61. FR-057 - Emergency Paths Must Not Share the Failed Dependency

**Requirement ID:** `FR-057`

An emergency path that depends on the same failed infrastructure it is meant to bypass is not an emergency path. The failure decision record must identify the trust basis of each emergency path and confirm its independence from the dependencies whose failure would trigger it.

---

# Failure Decision Record

## 62. FR-058 - Every Material Dependency Requires a Completed Failure Decision Record

**Requirement ID:** `FR-058`

For each material dependency, the following record must be completed before an implementation is evaluated as conformant. This template is taken from the accepted Failure Model (section 9) and made evaluable.

| Field | Content Required |
|---|---|
| Dependency | Named trust dependency |
| Security Function | Function the dependency performs |
| Protected Operation / Resource Class | Which operations or resource classes depend on it |
| Failure State | Which of the nine states this row addresses |
| Freshness Requirement | Per-input freshness bound (FR-018 through FR-022) |
| Cache Allowed? | Yes or no, with reference to the cache policy (FR-028) |
| Maximum Cache Age | Explicit bound or "no caching permitted" |
| Authority Consequence | What happens to dependent authority in this state |
| Allowed Degraded Behavior | Explicit permitted continuation, if any |
| Forbidden Behavior | What must never happen in this state |
| Enforcement Requirement | What the enforcement point must do |
| Audit Requirement | What evidence must be produced |
| Re-evaluation Requirement | What must be re-validated after recovery |
| Recovery Requirement | Trigger and validation for return to authority |
| Emergency Path | Governed emergency alternative, if any, with its independent trust basis |

A blank or "to be determined" field is a finding against conformance, not a deferral. Unknowns must be resolved by resource-specific risk analysis before the technology evaluation gate (Task 9), not during an incident.

---

# Negative Failure-Test Catalog

## 63. FR-059 - Failure Tests Must Attempt to Gain Authority Through Failure

**Requirement ID:** `FR-059`

Failure testing must verify security semantics, not merely service uptime. Each test below attempts to prove that unavailable, stale, or compromised security infrastructure can be exploited to obtain greater authority. The expected outcome in every case preserves the applicable Security Invariants; the exact behavior (deny, defer, bounded continuation) is resource-specific, but silent authority expansion is never an acceptable outcome.

## 64. FR-060 - Negative-Test Catalog

**Requirement ID:** `FR-060`

| ID | Failure Injected | Attack Attempt | Required Property |
|---|---|---|---|
| NT-F-01 | Revocation service unavailable | Attempt an action under a revoked grant | Unknown revocation is not validity; action does not proceed on the revoked grant (FR-012) |
| NT-F-02 | Policy engine unavailable | Attempt an unauthorized action | Unavailable policy does not authorize; no permit without an applicable policy basis (FR-013) |
| NT-F-03 | Attestation verifier unavailable | Attempt a high-risk operation requiring fresh attestation | No positive Result from an unavailable verifier; bounded-stale only where explicitly governed (FR-007) |
| NT-F-04 | Enforcement point unavailable | Attempt the protected operation through an alternate path | No ungoverned path becomes available because enforcement failed (FR-015) |
| NT-F-05 | Identity validation unavailable | Present an unknown or unvalidatable credential | Unknown identity does not become authorized identity (FR-005) |
| NT-F-06 | Clock rollback injected | Present an expired credential, grant, or cached decision | Expired authority is not resurrected by a backward clock (FR-025) |
| NT-F-07 | Split-brain revocation state (one node valid, one node revoked) | Attempt the action against the permissive node | Restrictive interpretation governs until the inconsistency is resolved (FR-051) |
| NT-F-08 | Dependency recovered but not re-validated | Attempt an action relying on the recovered dependency's conclusions | RECOVERING dependency is not authoritative until validation completes (FR-046) |
| NT-F-09 | Cached policy plus stale attestation plus unknown revocation simultaneously | Attempt the protected action | Combined degradation is explicitly evaluated, not unioned into a permit (FR-041, FR-042) |
| NT-F-10 | Audit destination unavailable | Perform a high-risk administrative action (for example, trust-anchor change) | Operation stops or follows the governed audit-outage path; evidence is not silently dropped (FR-016) |
| NT-F-11 | Decision source compromised (confident wrong answers) | Attempt to launder the compromised conclusions through normal retry policy | Compromise handling applies: containment and invalidation, not degraded-mode continuation (FR-002) |
| NT-F-12 | Degraded mode maximum duration reached | Continue operating under the degraded policy | Automatic exit executes (deny, defer, or recovered normal operation); degraded mode does not silently persist (FR-034) |

Normal-path, timeout, stale-state, partial-state, inconsistent-state, recovery, and compound-failure test dimensions from the Failure Model (section 91) apply to each catalog entry where relevant.

# Traceability Matrix

## 65. Failure Requirements to Failure-Model Properties

| ID | Requirement | Primary FM Properties |
|---|---|---|
| FR-001 | Failure states distinguishable | FM-02 |
| FR-002 | Compromise distinct from availability failure | FM-04 |
| FR-003 | INDETERMINATE is the failure decision state | FM-01, FM-03 |
| FR-004 | Identity issuance failure | FM-05, FM-14 |
| FR-005 | Identity validation failure | FM-01, FM-03, FM-05 |
| FR-006 | Credential renewal failure | FM-06 |
| FR-007 | Attestation verification failure | FM-05, FM-06 |
| FR-008 | Trust-anchor retrieval failure | FM-05, FM-06 |
| FR-009 | Trust-bundle distribution failure | FM-06, FM-12 |
| FR-010 | Federation failure | FM-05 |
| FR-011 | Delegation verification failure | FM-01, FM-03 |
| FR-012 | Revocation state failure | FM-02, FM-03, FM-12 |
| FR-013 | Authorization policy failure | FM-01, FM-05 |
| FR-014 | Authorization decision service failure | FM-01, FM-05 |
| FR-015 | Enforcement point failure | FM-15 |
| FR-016 | Audit and evidence failure | FM-16 |
| FR-017 | Recovery infrastructure failure | FM-10 |
| FR-018 through FR-022 | Freshness threshold model | FM-06 |
| FR-023 through FR-027 | Trusted-time dependency | FM-06 |
| FR-028 through FR-032 | Cached-state semantics | FM-06 |
| FR-033 through FR-040 | Degraded-mode governance | FM-09 |
| FR-041 through FR-044 | Degraded-state composition | FM-17, FM-13 |
| FR-045 through FR-052 | Recovery as trust-state transition | FM-10, FM-11, FM-12 |
| FR-053 through FR-057 | Emergency authority contract | FM-08 |
| FR-058 | Failure decision record | FM-05, FM-13 |
| FR-059, FR-060 | Negative failure-test catalog | FM-01 |

## 66. Failure Requirements to Task 5 Requirements

| ID | Requirement | Refined Task 5 Requirements |
|---|---|---|
| FR-018 through FR-022 | Freshness threshold model | AZ-013 |
| FR-028 through FR-032 | Cached-state semantics | AZ-014, CTL-004, CTL-009 |
| FR-012, FR-049 | Revocation failure and reconciliation | AZ-015 |
| FR-001, FR-003 | Failure decision states | AZ-019 |
| FR-004 through FR-017, FR-041, FR-042 | Forbidden expansion, composition | AZ-022 |
| FR-015 | Enforcement failure | ENF-009 |
| FR-031, FR-050, FR-051 | Invalidation and re-validation | CTL-009 |
| FR-001 | Unknown-state preservation | CTL-011 |

## 67. Failure Requirements to Architecture Roles and Edges

| Dependency | Primary Roles | Primary Edges |
|---|---|---|
| Identity issuance (FR-004) | ROLE-003 | EDGE-001 |
| Identity validation (FR-005) | ROLE-004 | EDGE-001 |
| Credential renewal (FR-006) | ROLE-003, ROLE-004 | EDGE-001 |
| Attestation verification (FR-007) | ROLE-006 | EDGE-004 |
| Trust-anchor retrieval (FR-008) | ROLE-017 | EDGE-012 |
| Trust-bundle distribution (FR-009) | ROLE-017 | EDGE-012 |
| Federation (FR-010) | ROLE-007, ROLE-017 | EDGE-015 |
| Delegation verification (FR-011) | ROLE-008, ROLE-012 | EDGE-006 |
| Revocation state (FR-012) | ROLE-008, ROLE-012 | EDGE-011 |
| Authorization policy (FR-013) | ROLE-011, ROLE-012 | EDGE-007 |
| Authorization decision service (FR-014) | ROLE-012 | EDGE-008, EDGE-009 |
| Enforcement point (FR-015) | ROLE-013 | EDGE-009, EDGE-010 |
| Audit and evidence (FR-016) | ROLE-015 | EDGE-013 |
| Recovery infrastructure (FR-017) | ROLE-016 | EDGE-014 |
| Degraded-mode governance (FR-033 through FR-040) | ROLE-017, ROLE-012, ROLE-013 | EDGE-008, EDGE-009, EDGE-010 |
| Recovery transition (FR-045 through FR-052) | ROLE-016, ROLE-017 | EDGE-014, EDGE-012 |
| Emergency authority (FR-053 through FR-057) | ROLE-016, ROLE-008 | EDGE-014 |

---

# Invariant Traceability

## 68. Primary Security Invariants

Task 6 operationalizes the Failure Model, which in turn operationalizes the following accepted Security Invariants. Task 6 does not restate or modify them.

* `SI-03` - Identity and authority lifecycles independently governable (FR-006: renewal failure does not extend authority; FR-011: delegation remains subject to its authority basis during verification failure)
* `SI-15` - Compromise recovery requires an independent trust basis (FR-002, FR-017, FR-052, FR-057)
* `SI-17` - Attestation semantics remain bounded (FR-007: no positive Result from an unavailable verifier)
* `SI-20` - Delegated authority must not amplify (FR-011: unverifiable delegation produces no authority)
* `SI-27` - Identity is not authorization (FR-005: unknown identity does not become authorized identity)
* `SI-28` - External delegation remains subject to local authorization (FR-010: federation failure does not transfer authorization control)
* `SI-30` - Authorization requires effective enforcement (FR-015: failed enforcement exposes no ungoverned path)
* `SI-31` - Failure or uncertainty must not silently increase authority (FR-001 through FR-017, FR-059, FR-060: the governing invariant of this entire task)
* `SI-32` - Compromise and availability failure remain distinct (FR-002)
* `SI-33` - Compromise dependencies must be traceable (FR-002, FR-044)
* `SI-34` - Security functions must not hide correlated compromise (FR-044: cascading degradation remains traceable)
* `SI-35` - Security-relevant actions must preserve principal context (FR-040: degraded-mode evidence preserves actor and decision context)
* `SI-36` - Delegated actions must preserve authority provenance (FR-048: re-evaluation preserves provenance of failure-window conclusions)
* `SI-38` - Security-relevant trust-state changes must be governed (FR-033 through FR-040, FR-052 through FR-057)

---

# Relationship to Task 7

## 69. Verification Inputs

Task 7 (invariant-to-control verification matrix) must consume the FR requirements and the NT-F catalog as the failure-test dimension of the invariant verification model:

```text
FR Requirement
        ↓
Enforcement Point
        ↓
Positive Test (normal path)
        ↓
Negative Test (NT-F catalog)
        ↓
Failure Test (failure-state matrix)
        ↓
Evidence (failure decision record fields)
```

In particular, Task 7 must map SI-31 to the NT-F catalog, SI-32 to NT-F-11, FM-09 to degraded-mode evidence requirements (FR-035, FR-040), and FM-10/FM-11 to recovery validation evidence (FR-046, FR-048 through FR-050).

---

# Technology Evaluation Implications

## 70. Mandatory Candidate Questions

Any future trust-infrastructure technology must be evaluated against:

* Can it report the nine failure states distinctly, or does it collapse them into a generic error?
* Can it distinguish compromise signals from availability signals?
* Can it enforce per-input, per-operation freshness bounds?
* Can it bound clock uncertainty and survive clock rollback without resurrecting expired authority?
* Can it implement explicit cache policy with defined invalidating events and automatic expiry behavior?
* Can revocation state be observed, and what does the candidate do when it cannot be?
* Can degraded operation be explicitly entered, bounded in duration, made visible in evidence, and automatically exited?
* Can combined degraded states be evaluated explicitly rather than unioned?
* Does recovery require re-validation before the component becomes authoritative, and is recovery ordering supported?
* Does it support deferred revocation and policy reconciliation after partition?
* Can emergency authority be sourced independently, bounded, audited, and revoked?
* Can it produce the failure decision record fields as evidence?

## 71. Disqualifying Semantic Failures

A candidate should fail the architecture gate if it requires the platform to accept any of the following as unavoidable semantics:

* Unknown revocation treated as valid
* Unavailable policy treated as authorization
* Unavailable verifier producing positive attestation
* Failed enforcement exposing an unmediated path
* Stale trust material silently restoring removed authority
* Clock rollback resurrecting expired credentials
* Cached decisions without invalidation or expiry
* Degraded mode without duration bound or automatic exit
* Recovery by availability alone without re-validation
* Emergency authority derived from the failure itself rather than an independent source
* Compromise handled as an ordinary availability incident

A future architecture change may revisit a requirement only through explicit Control Plane review.

---

# Task 6 Acceptance Gate

## 72. Acceptance Criteria

Task 6 passes when:

* All nine failure states are defined and required to remain distinguishable per dependency.
* COMPROMISED is defined as a distinct security condition with containment, invalidation, and independent-recovery semantics.
* Each of the fourteen material dependencies has a required failure classification, forbidden authority expansion, allowed bounded continuation, recovery trigger, re-validation requirement, audit requirement, and resource-specific shutdown condition.
* Freshness thresholds are per-input and per-operation, with an explicit bounded-stale model.
* Trusted-time dependency is defined: bounded clock uncertainty, rollback resistance, and time-source outage semantics.
* Cached-state semantics are explicit: cache policy fields, invalidating events, and automatic expiry behavior.
* The degraded-mode governance contract is complete: entry, allowed and forbidden operation sets, maximum duration, evidence, exit, re-validation, audit, and the prohibition on silent permanence.
* Degraded-state composition rules forbid implicit union and define the restrictive default.
* Recovery is defined as a trust-state transition with validation, ordering, deferred revocation reconciliation, deferred policy reconciliation, and split-brain resolution.
* The emergency authority contract requires an independent source, explicit bounded invocation, audit, expiration, revocation, and retirement.
* The failure decision record template is defined and required to be complete per dependency.
* The negative failure-test catalog attempts authority gain through each failure class.
* All nine Task 5 requirements deferred to Task 6 (AZ-013, AZ-014, AZ-015, AZ-019, AZ-022, ENF-009, CTL-004, CTL-009, CTL-011) are refined with explicit traceability.
* No technology is selected.

## 73. Failure Modes

Task 6 fails if:

* Any failure state is collapsed into a generic error or boolean.
* COMPROMISED is handled by ordinary degraded-mode policy.
* Unknown revocation can be treated as validity by any conformant implementation.
* An unavailable policy engine or decision service can yield a permit.
* Failed enforcement leaves a reachable ungoverned path.
* Stale trust material can silently restore removed authority.
* Clock rollback can resurrect expired authority.
* Cached decisions lack invalidation or expiry semantics.
* Degraded mode can persist without bound or governance review.
* Combined degraded states are implicitly unioned into permission.
* Recovery is declared on availability alone.
* Emergency authority derives from the failure rather than an independent source.
* The failure decision record can be left incomplete without a conformance finding.
* Any Task 5 requirement deferred to Task 6 remains unrefined.

## 74. Definition of Done

Task 6 content is ready for acceptance when:

* [x] `FR-001` through `FR-003` define the failure-state classification model.
* [x] `FR-004` through `FR-017` define per-dependency failure controls for all fourteen material dependencies.
* [x] `FR-018` through `FR-022` define the freshness threshold model.
* [x] `FR-023` through `FR-027` define trusted-time dependency.
* [x] `FR-028` through `FR-032` define cached-state semantics.
* [x] `FR-033` through `FR-040` define the degraded-mode governance contract.
* [x] `FR-041` through `FR-044` define degraded-state composition rules.
* [x] `FR-045` through `FR-052` define recovery as a trust-state transition.
* [x] `FR-053` through `FR-057` define the emergency authority invocation contract.
* [x] `FR-058` defines the failure decision record template.
* [x] `FR-059` and `FR-060` define the negative failure-test catalog (`NT-F-01` through `NT-F-12`).
* [x] Task 5 refinement traceability is complete for `AZ-013`, `AZ-014`, `AZ-015`, `AZ-019`, `AZ-022`, `ENF-009`, `CTL-004`, `CTL-009`, `CTL-011`.
* [x] Traceability matrices cover FM properties, Task 5 requirements, roles, and edges.
* [x] Invariant traceability is defined.
* [x] Task 7 verification inputs are defined.
* [x] Technology-evaluation implications are defined.
* [x] Mechanical document validation passes.
* [x] Semantic architecture review passes.

### Repository Closure Gate

Task 6 is not formally **COMPLETE** until:

* The accepted artifact is committed.
* The commit is pushed to `origin/main`.
* `HEAD == origin/main`.
* The working tree is clean.

---

# Proposed Decision

## 75. Task 6 Decision

The proposed Task 6 decision is:

> **Sprint 2 shall treat security-relevant failure as an explicit, per-dependency, per-state contract: every material trust dependency must classify VALID, INVALID, UNKNOWN, UNAVAILABLE, STALE, INCONSISTENT, DEGRADED, RECOVERING, and COMPROMISED distinctly, with COMPROMISED handled as a security condition rather than an availability incident. No failure state may silently create authority, broaden permission, or strengthen a security conclusion beyond what the available evidence supports. Degraded operation is permitted only under an explicit, bounded, visible, and automatically expiring governance contract. Recovery is a trust-state transition requiring validation, ordering, and deferred reconciliation before a dependency becomes authoritative again. Emergency authority must derive from an independently governed source, never from the failure itself.**

This is a derived architecture-to-implementation requirement.

It does not select failure-handling technology, cache infrastructure, time synchronization, or deployment topology.

---

## 76. ADR Assessment

No new ADR is proposed by Task 6 at this stage.

The failure, degraded-mode, and recovery matrix derives from the accepted Failure Model and:

* ADR-0006 (security invariants as architecture constraints)
* ADR-0007 (explicit bounded security failure semantics)
* ADR-0008 (separation of trust coordination from runtime enforcement and authority ownership)

The accepted Failure Model records two candidate decisions (explicit bounded failure behavior; recovery as a trust-state transition) and states that whether they require a new ADR will be determined during Task 8 acceptance. Task 6 takes no position in advance of that determination; it records the candidate decisions here so the Task 8 review has them in front of it.

If semantic review identifies a materially new cross-platform failure or recovery decision rather than a derived requirement, the Control Plane must stop and record that decision through ADR governance before acceptance.

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
