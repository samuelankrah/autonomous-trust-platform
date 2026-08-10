# ADR-0007: Require Explicit and Bounded Security Failure Semantics

**Status:** Accepted
**Date:** 2026-08-09
**Decision Owner:** Trust Platform — Control Plane
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Scope:** Security-relevant dependency failure, degraded operation, stale and uncertain state, caching, recovery, distributed failure, emergency authority, and return to trustworthy operation

---

## Context

The Autonomous Trust Platform depends on security functions that may become unavailable, stale, inconsistent, delayed, partially failed, or temporarily disconnected.

Examples include:

* Identity authorities
* Credential validation
* Bootstrap authorities
* Attestation verifiers
* Trust-bundle distribution
* Federation peers
* Delegation validation
* Revocation infrastructure
* Policy engines
* Authorization services
* Enforcement points
* Audit infrastructure

The architecture already requires that failure or uncertainty must not silently increase authority.

However, that principle alone does not define what systems may do while security dependencies are degraded.

A universal rule such as:

```text
failure
  ↓
DENY
```

is insufficient.

Likewise:

```text
failure
  ↓
ALLOW
```

is unsafe as a universal architecture rule.

Different resources, actions, authority relationships, and risk classes may legitimately require different degraded behaviors.

The architecture therefore requires explicit failure semantics.

---

## Decision

The Autonomous Trust Platform adopts the following rule:

> **Security-relevant failure behavior must be explicit, resource- and risk-specific, and bounded such that unavailable, stale, uncertain, or degraded trust dependencies do not silently create additional authority or stronger security conclusions than the available evidence supports.**

The platform additionally adopts:

> **Recovery from security-relevant failure is a trust-state transition. Restoration of service availability does not, by itself, prove restoration of trustworthy security state. Dependent security conclusions must be re-established or re-evaluated where their validity may have changed during the failure window.**

---

## Failure Does Not Create Authority

Failure is not an authority source.

Conceptually:

```text
Effective Authority During Failure
        ⊆
Authority legitimately established
before or independently during failure
```

Failure may:

* Reduce usable authority
* Prevent establishment of new authority
* Permit bounded continued use of previously established authority
* Trigger invocation of separately established emergency authority

Failure must not manufacture authority.

---

## Emergency Authority

Emergency or break-glass authority must derive from an independent and explicitly governed authority source.

Therefore:

```text
Dependency Failure
        ≠
Emergency Authority Source
```

The failure condition may trigger access to an emergency path.

It does not itself grant that authority.

Emergency authority must remain appropriately:

* Bounded
* Attributable
* Auditable
* Time constrained
* Revocable
* Governed

---

## Unknown, Valid, and Invalid

The architecture distinguishes:

```text
UNKNOWN
   ≠
VALID
   ≠
INVALID
```

An unavailable security dependency may result in `UNKNOWN`.

`UNKNOWN` must not automatically be reclassified as `VALID`.

Likewise, `UNKNOWN` does not universally require treatment as `INVALID` when an explicit bounded degraded-mode policy permits continued operation.

The security state remains unknown until the required evidence is re-established.

---

## Resource-Specific Failure Policy

Failure policy is attached to security-relevant operations, not merely infrastructure components.

For example:

```text
Policy Engine Unavailable
```

does not determine behavior by itself.

The architecture must consider:

```text
Failed Dependency
        +
Protected Resource
        +
Requested Action
        +
Principal
        +
Existing Authority
        +
Current Evidence
        +
Risk
        =
Failure Behavior
```

Different operations may legitimately have different results.

---

## Permitted Failure Outcomes

Explicit failure policy may select outcomes such as:

* Deny
* Defer
* Retry
* Continue under previously established bounded state
* Restrict available operations
* Quarantine
* Invoke independently governed emergency authority

These outcomes are architecture choices.

They must not emerge accidentally from implementation behavior.

---

## No Universal Fail-Open or Fail-Closed Rule

The platform rejects universal `fail-open` or `fail-closed` semantics as substitutes for security analysis.

A low-risk read operation may tolerate bounded stale state.

A trust-anchor modification may require current authorization, enforcement, and durable audit.

The correct behavior depends on the security requirements of the protected action.

---

## Bounded Cached State

Cached security state may be used only when an explicit architecture defines:

* What was cached
* Which authority produced it
* When it was validated
* Maximum accepted age
* Resource and action scope
* Relevant invalidating events
* Required re-validation
* Behavior after the freshness bound expires

Previously valid state does not become permanently valid merely because fresh validation is unavailable.

---

## Last-Known-Good State

`Last known good` describes provenance.

It is not a standing authorization policy.

Therefore:

```text
Last Known Good
        ≠
Safe Indefinitely
```

Continued reliance requires explicit freshness and risk semantics.

---

## Trusted Time

Time is a security dependency where decisions depend on:

* Expiration
* Freshness
* Cache age
* Delegation validity
* Attestation validity
* Credential lifetime
* Bounded staleness

The architecture must account for:

* Clock skew
* Clock rollback
* Clock jumps
* Time-source failure
* Inconsistent clocks

A time-bounded security object must not automatically be treated as current when the platform cannot establish time within required policy bounds.

This ADR does not select a time-synchronization mechanism.

---

## Revocation Failure

The architecture preserves:

```text
Revocation State UNKNOWN
        ≠
Not Revoked
```

and:

```text
Revocation State UNKNOWN
        ≠
Revoked
```

A disconnected or degraded environment must define explicit revocation semantics including:

* Maximum disconnected duration
* Last-known-state requirements
* Operations permitted
* Operations prohibited
* Reconnection validation
* Treatment of revocations discovered after recovery

Failure of revocation infrastructure does not suspend ordinary expiration semantics unless separately governed architecture explicitly establishes otherwise.

---

## Authorization Failure

An unavailable policy or authorization service does not itself grant authority.

A cached authorization decision remains usable only when its underlying assumptions remain within explicitly permitted bounds.

Relevant assumptions may include:

* Identity
* Delegated authority
* Policy version
* Attestation
* Time
* Revocation
* Resource state
* Environmental context

A cached `ALLOW` must not become a permanent context-free entitlement.

---

## Enforcement Failure

Authorization is not effective if its enforcement path is bypassed or unavailable.

Failure of an enforcement component must not silently expose another ungoverned route to the protected operation.

Absence of a delivered authorization decision must not automatically be interpreted as permission.

---

## Audit Failure

Audit failure requires explicit operational semantics.

Depending on the protected operation, policy may require:

* Stop
* Buffer evidence
* Use alternate storage
* Continue only lower-risk operations
* Escalate

Buffered evidence must not silently become lost evidence.

High-risk operations may require stronger audit availability than low-risk operations.

---

## Attestation Failure

An unavailable verifier or stale Attestation Result does not automatically establish either trustworthiness or untrustworthiness.

Explicit policy may:

* Require fresh verification
* Use bounded cached results
* Restrict operations
* Defer
* Quarantine
* Permit continuation for a limited interval

The architecture must preserve the distinction between authentic evidence and fresh evidence.

---

## Bootstrap Failure

Failure of strong bootstrap evidence must not silently downgrade identity assurance.

Where stronger evidence is unavailable, the architecture may:

* Defer bootstrap
* Use an explicitly approved alternate bootstrap method
* Restrict resulting identity or operation
* Invoke governed recovery

Automatic downgrade is prohibited.

---

## Trust Material and Federation Failure

Failure to retrieve updated trust material does not automatically prove currently installed material invalid.

However, stale trust material must not silently restore an authority that was intentionally removed.

Cross-domain failure must not silently import authorization or shift local authorization sovereignty to an external domain.

---

## Distributed Security State

Security-state changes may propagate asynchronously.

The architecture must not assume simultaneous observation of:

* Revocation
* Policy changes
* Trust-anchor changes
* Delegation state
* Federation state
* Identity state

Propagation delay and disagreement are security-relevant states.

---

## Split-Brain State

Two legitimate components may disagree.

Example:

```text
Node A:
grant valid

Node B:
grant revoked
```

Nominal component availability does not eliminate the security consequence of inconsistent state.

The architecture must define detection, reconciliation, and applicable operation semantics.

---

## Compound Degradation

Individually permitted degraded states must not automatically be combined.

For example:

```text
Cached Policy
      +
Stale Attestation
      +
Unknown Revocation
```

may create materially greater risk than any individual condition.

Therefore:

> **Independent degradation allowances must not be implicitly composed through union.**

A degraded-mode architecture must define:

* Permitted combinations
* More restrictive behavior
* Or conditions under which continued operation is prohibited

---

## Failure Cascades

Failure dependencies must remain traceable.

Example:

```text
Trust Distribution Failure
        ↓
Verifier State Stale
        ↓
Federation Validation Uncertain
        ↓
Authorization Context Incomplete
```

The platform must be able to determine which conclusions depend on degraded components.

---

## Correlated Failure

Logical separation does not prove failure independence.

Security functions may share:

* Control plane
* Administrator
* Cloud account
* Database
* Network
* Key infrastructure
* Recovery authority

Architecture reviews must identify material shared failure dependencies.

---

## Degraded Mode

Degraded mode must have explicit:

* Entry conditions
* Allowed operations
* Forbidden operations
* Maximum duration
* Evidence requirements
* Exit conditions
* Re-validation requirements
* Audit semantics

Temporary degraded operation must not silently become permanent architecture.

---

## Reduced Assurance

Where security-relevant assurance is reduced, that state must remain observable where required for downstream interpretation.

Examples include:

* Stale attestation
* Cached authorization
* Revocation uncertainty
* Federation outage
* Degraded policy evaluation

Downstream systems must not be falsely led to believe normal assurance was present.

---

## Service Recovery Versus Trust Recovery

The platform distinguishes:

```text
Service Availability Restored
        ≠
Trustworthy State Re-Established
```

A component may again be reachable while its security state remains:

* Stale
* Inconsistent
* Incomplete
* Unverified

Availability monitoring alone therefore cannot establish security recovery.

---

## Recovery Validation

Recovery may require validation of:

* Identity
* Configuration
* Trust anchors
* Trust bundles
* Policy
* Reference values
* Revocation
* Pending updates
* Time
* Administrative changes made during the outage

The required validation depends on the security function.

---

## Re-Evaluation After Recovery

Security conclusions established or preserved during degraded operation may require re-evaluation.

Examples include:

* Cached authorization decisions
* Delegation grants
* Attestation Results
* Federation assertions
* Revocation assumptions
* Active sessions

The architecture must identify which conclusions remain valid and which require fresh evaluation.

---

## Deferred State Reconciliation

Recovery must account for security-state changes that occurred while components were disconnected.

This includes:

* Revocations
* Policy changes
* Trust-anchor changes
* Federation changes
* Identity changes
* Delegation changes

The system must not assume that no relevant state changed during the outage.

---

## Recovery Ordering

Recovery of dependent security functions may require ordering.

For example:

```text
Trusted Configuration / Trust Material
        ↓
Identity and Verification
        ↓
Policy
        ↓
Authorization
        ↓
Enforcement
```

The exact ordering depends on architecture dependencies.

A service becoming reachable before its required trust dependencies recover does not necessarily make it authoritative.

---

## Failure Evidence

Security-relevant failure handling should produce evidence sufficient to establish:

* Failed dependency
* Failure classification
* Detection time
* Security decision
* Cache age
* Policy version
* Authority state
* Degraded-mode entry
* Emergency authority use
* Recovery time
* Re-validation
* Reconciliation actions

This supports auditability and post-event analysis.

---

## Verification Requirement

Future implementations must validate applicable failure semantics through:

* Normal-path tests
* Unavailability tests
* Timeout tests
* Stale-state tests
* Partial-dependency tests
* Inconsistent-state tests
* Recovery tests
* Compound-failure tests

Validation must demonstrate security behavior, not merely availability.

---

## Negative Failure Testing

Testing should deliberately attempt to exploit unavailable security infrastructure.

Examples include:

```text
Revocation unavailable
        ↓
Attempt revoked action
```

```text
Policy unavailable
        ↓
Attempt unauthorized action
```

```text
Attestation unavailable
        ↓
Attempt operation requiring fresh attestation
```

```text
Enforcement unavailable
        ↓
Attempt alternate path
```

Expected behavior depends on resource-specific policy while preserving accepted Security Invariants.

---

## Relationship to Security Invariants

This ADR operationalizes several accepted invariants, particularly:

* SI-15 — Compromise Recovery Requires an Independent Trust Basis
* SI-31 — Failure or Uncertainty Must Not Silently Increase Authority
* SI-32 — Compromise and Availability Failure Remain Distinct
* SI-33 — Compromise Dependencies Must Be Traceable
* SI-34 — Security Functions Must Not Hide Correlated Compromise
* SI-38 — Security-Relevant Trust State Changes Must Be Governed

ADR-0006 continues to govern the invariant-conformance requirement.

---

## Relationship to ADR-0003

ADR-0003 establishes function-scoped trust domains and requires resource- and risk-specific failure behavior.

ADR-0007 makes those failure semantics explicit across degraded operation, caching, distributed state, and recovery.

---

## Relationship to ADR-0004

ADR-0004 establishes independent recovery requirements for compromised bootstrap dependencies.

ADR-0007 distinguishes compromise recovery from ordinary availability recovery and defines trustworthy return-to-service semantics.

---

## Relationship to ADR-0005

ADR-0005 establishes explicit delegated authority, revocation semantics, and non-amplification.

ADR-0007 prevents delegation-verification or revocation outages from becoming implicit authority expansion.

---

## Relationship to ADR-0006

ADR-0006 makes accepted Security Invariants technology-independent architecture constraints.

ADR-0007 defines failure semantics that future implementations must preserve when satisfying those invariants.

---

## Consequences

### Positive

* Failure does not silently become an authority source.
* Degraded operation becomes explicit and reviewable.
* `UNKNOWN` remains distinct from `VALID` and `INVALID`.
* Caches gain bounded security semantics.
* Recovery becomes a trust decision rather than merely an uptime event.
* Compound failure becomes analyzable.
* Distributed-state disagreement becomes visible architecture.
* Emergency authority remains separately governed.
* Failure testing gains concrete security expectations.

### Costs

* Resource classes need explicit failure policies.
* Cached state requires freshness governance.
* Recovery may require re-validation and reconciliation.
* Distributed security state requires additional evidence and observability.
* Compound degradation increases policy complexity.
* Some availability-preserving fallbacks may be rejected.
* Failover paths must preserve security semantics.

These costs are accepted because silent changes to trust or authority during failure create greater systemic risk.

---

## Alternatives Considered

### Universal Fail Closed

Rejected as a universal architecture rule.

Some operations may safely continue under bounded previously established state.

### Universal Fail Open

Rejected.

Dependency failure must not create authority.

### Infrastructure-Level Failure Policy Only

Rejected.

The security consequence depends on the protected action and resource, not merely which service failed.

### Treat Service Restart as Recovery

Rejected.

Availability does not prove trustworthy security state.

### Explicit Resource-Specific Failure and Trust-Recovery Semantics

Accepted.

---

## Decisions Not Made

This ADR does not select:

* Cache technology
* Revocation protocol
* Retry system
* Circuit breaker
* Service mesh
* HA technology
* Database consistency mechanism
* Time-synchronization technology
* Policy engine
* Authorization engine
* Audit queue
* Break-glass product
* Disaster-recovery platform
* Monitoring system
* Risk-scoring framework

Those technologies must satisfy the failure semantics established here.

---

## Reversal Conditions

This decision should be reconsidered only if a future architecture provides equivalent or stronger guarantees for:

* No failure-created authority
* Explicit uncertainty handling
* Bounded stale state
* Resource-specific degraded behavior
* Compound degradation
* Distributed-state correctness
* Recovery validation
* Re-evaluation
* Failure evidence
* Security testing

Any replacement must continue to prevent availability mechanisms from silently redefining trust or authority semantics.

---

## Related Artifacts

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/threat-model.md`
* `docs/architecture/security-invariants.md`
* `docs/architecture/failure-model.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`
* `docs/adr/0006-security-invariants-as-architecture-constraints.md`

---

## Outcome

Security-relevant failure now has explicit architecture semantics.

Failure is not authority.

Unknown is not automatically valid or invalid.

Degraded operation is bounded and resource-specific.

Emergency authority remains independently governed.

Cached state requires freshness policy.

Compound degraded states require explicit composition.

Service availability does not prove trust recovery.

Recovery may require validation, reconciliation, and re-evaluation.

Future implementations must demonstrate those properties through failure testing and evidence.
