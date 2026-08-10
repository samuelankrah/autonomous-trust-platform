# ADR-0006: Treat Security Invariants as Technology-Independent Architecture Constraints

**Status:** Accepted
**Date:** 2026-08-09
**Decision Owner:** Trust Platform — Control Plane
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Scope:** Security invariants, architecture conformance, implementation claims, verification evidence, and invariant governance

---

## Context

Sprint 1 established architecture for:

* Principals and identity
* Trust domains and trust boundaries
* Bootstrap trust
* Delegated authority
* Threats and failure conditions

Those models produced recurring security properties that must remain true regardless of implementation technology.

Examples include:

* A credential is not the principal itself.
* Authentication does not automatically establish authorization.
* Attestation evidence does not, by itself, establish identity, delegated authority, or authorization.
* Delegated authority must not amplify.
* Redelegation requires explicit permission.
* Hosting workload authority does not automatically become logical-agent authority.
* External identity or delegation does not automatically import local authorization.
* Failure or uncertainty must not silently increase authority.
* Compromise recovery must not rely solely on the compromised trust basis being replaced.
* Authorization is not an effective security control unless enforcement actually constrains the protected action.

Without a system-wide invariant model, future implementation work could accidentally reinterpret these requirements as technology-specific guidance.

For example, a future implementation might incorrectly reason:

```text
"OAuth works this way,
therefore the architecture must accept it."
```

or:

```text
"SPIRE authenticated the workload,
therefore the agent identity is established."
```

or:

```text
"The token is still cryptographically valid,
therefore the delegated authority remains valid."
```

The architecture requires the opposite direction of reasoning:

```text
Accepted Security Invariant
        ↓
Architecture Requirement
        ↓
Technology Evaluation
        ↓
Implementation
        ↓
Verification Evidence
```

Technologies must satisfy the architecture.

The architecture must not silently change to accommodate technology behavior.

---

## Decision

The Autonomous Trust Platform adopts the following rule:

> **Accepted security invariants are technology-independent architecture constraints. A conforming implementation, protocol, product, federation design, or operational architecture must preserve every applicable invariant.**

If a proposed architecture cannot preserve an accepted invariant:

> **The invariant itself must be explicitly reviewed, revised, superseded, or withdrawn through architecture governance before the conflicting design can be considered conformant.**

An implementation decision must not silently waive an accepted invariant.

---

## Invariant Applicability

Not every invariant necessarily applies to every component.

Applicability depends on the security relationship involved.

Examples:

* A component that performs no delegation does not need to implement delegation-chain validation merely because SI-20 exists.
* A component acting as an enforcement point must satisfy relevant authorization and enforcement invariants.
* A bootstrap authority must satisfy bootstrap and recovery invariants applicable to its role.
* A federation boundary must satisfy applicable cross-domain trust and authorization invariants.

Applicability must be determined from architecture semantics rather than product labels.

---

## Architecture Before Technology

Technology selection must follow:

```text
Security Property
        ↓
Invariant
        ↓
Required Capability
        ↓
Candidate Technology
        ↓
Architecture Evaluation
```

The following reasoning is rejected:

```text
Product Capability
        ↓
Architecture Redefined
        ↓
Security Property Weakened
```

Vendor behavior does not supersede accepted architecture.

---

## Security-Layer Separation

Invariant conformance must preserve distinctions among:

```text
Identity
Authentication
Credentials
Attestation
Trust
Delegated Authority
Authorization
Policy
Enforcement
Auditability
```

Successful behavior in one layer must not automatically be interpreted as satisfying another layer unless an explicit architecture defines that relationship.

---

## Conformance

An implementation is conformant only when:

1. Applicable invariants have been identified.
2. Architecture controls exist to preserve them.
3. Relevant enforcement points have been identified.
4. Validation demonstrates required behavior.
5. Failure behavior has been tested where relevant.
6. Evidence supports any claim of implementation or enforcement.

Documentation alone does not establish technical conformance.

---

## Conflict Handling

When a candidate technology or implementation conflicts with an accepted invariant, the architecture must choose one of the following:

### Reject the Implementation

Use a different design that preserves the invariant.

### Modify the Implementation

Add controls that restore invariant conformance.

### Re-Evaluate the Invariant

Return the issue to architecture governance.

The invariant may then be:

* Revised
* Superseded
* Withdrawn

only when the architecture decision itself changes.

The following is prohibited:

```text
Invariant
    ↓
Implementation conflicts
    ↓
Ignore invariant
```

---

## No Silent Exceptions

An implementation-specific exception must not silently weaken an accepted invariant.

If a supposed exception changes the security property itself, that is an architecture change.

It therefore requires architecture governance rather than implementation discretion.

---

## Invariant Lifecycle

Security invariants may evolve.

A lifecycle may include:

```text
Proposed
    ↓
Accepted
    ↓
Revised
    ↓
Superseded
    or
Withdrawn
```

Changes must preserve decision history.

A removed invariant must not disappear without an attributable architecture record explaining why the security requirement no longer applies or has been replaced.

---

## Evidence and Assurance States

The architecture distinguishes:

```text
Proposed
Accepted
Implemented
Tested
Observed
Enforced
Production Ready
```

These states must not be represented interchangeably.

An accepted invariant establishes an architecture requirement.

It does not establish that the requirement is technically enforced.

---

## Enforcement Claims

The platform adopts a second binding rule:

> **An invariant must not be claimed as technically enforced until implementation and verification evidence demonstrates the corresponding control and enforcement behavior.**

For example:

```text
SI-20:
Delegated authority must not amplify.
```

An accepted document proves only that the architecture requires non-amplification.

A technical enforcement claim requires evidence such as:

```text
Delegation Validation Control
        ↓
Enforcement Point
        ↓
Valid Delegation Test
        ↓
Amplification Attempt
        ↓
Rejected
        ↓
Recorded Evidence
```

Until such evidence exists, the correct status remains an architecture requirement.

---

## Verification Model

Applicable invariants should eventually map to:

```text
Invariant
    ↓
Control
    ↓
Enforcement Point
    ↓
Positive Test
    ↓
Negative Test
    ↓
Failure Test
    ↓
Evidence
```

### Positive Test

Demonstrates legitimate behavior succeeds.

### Negative Test

Demonstrates prohibited behavior is rejected or otherwise constrained.

### Failure Test

Demonstrates unavailable, stale, compromised, or uncertain dependencies do not produce prohibited security behavior.

---

## Example — Workload and Agent Identity

Invariant:

```text
Authentication of a hosting workload
does not automatically establish
logical-agent identity.
```

A future SPIFFE/SPIRE implementation therefore cannot claim:

```text
Valid workload SVID
        =
authenticated logical agent
```

unless an explicit actor-to-runtime identity-binding architecture establishes that relationship.

---

## Example — Attestation

Invariant:

```text
Attestation evidence, by itself
does not establish
identity, delegated authority, or authorization.
```

A future RATS/EAT implementation may use attestation in:

* Bootstrap
* Identity validation
* Authorization policy
* Trust evaluation

but the architecture must define that relationship explicitly.

---

## Example — Delegation

Invariant:

```text
Granted Authority
        ⊆
Delegable Authority
```

A future OAuth, WIMSE, capability-based, or proprietary delegation implementation must preserve non-amplification.

Protocol behavior does not excuse authority expansion.

---

## Example — Failure

Invariant:

```text
Failure or uncertainty
must not silently increase authority.
```

This does not require universal fail-closed behavior.

It requires explicit resource- and risk-specific failure semantics.

A future policy engine outage cannot be treated as implicit permission merely because authorization infrastructure is unavailable.

---

## Example — Enforcement

Invariant:

```text
Authorization Decision
        ≠
Effective Security Control
```

until enforcement actually constrains the protected operation.

A policy engine returning `DENY` is insufficient if another path can still execute the operation.

---

## Governance of Trust-State Changes

Security-relevant trust state must be modified only through an explicitly authorized and attributable governance path.

Relevant state includes:

* Trust anchors
* Trust bundles
* Identity registration
* Eligibility state
* Federation configuration
* Attestation reference values
* Appraisal policy
* Delegation policy
* Authorization policy
* Revocation state
* Recovery configuration
* Enforcement configuration

Successful configuration modification does not itself prove the modification was legitimately authorized.

---

## Architecture Review Requirement

Future architecture reviews must evaluate:

1. Which invariants apply?
2. Which components are responsible for preserving them?
3. Where are the enforcement points?
4. Which trust assumptions support those controls?
5. What happens when dependencies fail?
6. What evidence demonstrates behavior?
7. Which claims remain proposed versus implemented or enforced?

A design should not be considered complete merely because its normal-path workflow functions.

---

## Technology Evaluation Requirement

Technology comparisons must evaluate invariant compatibility.

This includes future evaluation of technologies such as:

* SPIFFE/SPIRE
* OAuth
* WIMSE
* RATS
* EAT
* SCITT
* SPICE
* OPA
* Cedar
* Confidential-computing technologies
* Cloud-native workload identity
* PKI systems
* Delegation mechanisms

Adoption is not implied by inclusion in this list.

---

## Consequences

### Positive

* Architecture requirements remain stable across technology changes.
* Vendor-specific behavior cannot silently redefine security semantics.
* Implementation work gains explicit acceptance criteria.
* Threat-model findings become testable.
* Architecture and implementation evidence remain distinguishable.
* Design reviews can evaluate conformance systematically.
* Negative testing becomes part of security validation.
* Cross-project implementation work receives a clear architecture contract.

### Costs

* Some technologies may require additional controls.
* Some attractive products may be rejected.
* Implementation teams must map controls to invariants.
* Validation evidence must be retained.
* Architecture changes become explicit governance events.
* Invariant revisions require deliberate review.

These costs are accepted because silent erosion of security architecture creates greater systemic risk.

---

## Alternatives Considered

### Treat Invariants as Guidance

Rejected.

Guidance can be ignored without changing architecture, which defeats the purpose of a security invariant.

### Allow Implementation-Specific Waivers

Rejected as a default model.

A waiver that changes the security property is an architecture change and must be governed as such.

### Encode All Invariants in Individual ADRs

Rejected.

Many invariants are cross-cutting properties derived from several architecture models.

Maintaining a consolidated invariant artifact provides a clearer implementation contract.

### Technology-Independent Security Invariants

Accepted.

---

## Relationship to Threat Model

The Threat Model identifies:

```text
How security properties can fail.
```

The Security Invariants artifact defines:

```text
Which properties must remain true.
```

This ADR governs:

```text
How future architecture and implementation
must treat those properties.
```

Together:

```text
Architecture
      ↓
Threat Model
      ↓
Security Invariants
      ↓
Implementation Controls
      ↓
Verification Evidence
```

---

## Relationship to Existing ADRs

### ADR-0002

Defines when logical software actors require identities distinct from hosting workloads.

The invariant layer preserves those identity distinctions across future implementations.

### ADR-0003

Defines function-scoped trust domains and explicit cross-domain trust.

The invariant layer prevents implementation topology or federation technology from silently broadening those relationships.

### ADR-0004

Defines bootstrap trust and identity-binding assurance.

The invariant layer preserves bootstrap scope and independent compromise recovery.

### ADR-0005

Defines explicit, bounded, non-amplifying delegated authority.

The invariant layer makes those authority properties mandatory constraints for future delegation implementations.

---

## Decisions Not Made

This ADR does not:

* Select implementation technologies
* Select a policy engine
* Select an authorization protocol
* Select an identity system
* Define formal verification tooling
* Define CI/CD gates
* Define risk scoring
* Define release-management process
* Claim current technical enforcement
* Claim production readiness

Those decisions belong to later architecture and implementation work.

---

## Reversal Conditions

This decision should be reconsidered only if a future architecture provides a different mechanism that offers equivalent or stronger:

* Technology independence
* Security-property preservation
* Architecture governance
* Implementation conformance
* Verification evidence
* Failure testing
* Auditability

Any replacement must prevent implementation choices from silently redefining accepted security semantics.

---

## Related Artifacts

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/threat-model.md`
* `docs/architecture/security-invariants.md`
* `docs/architecture/trust-standards-landscape.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`

---

## Outcome

The Autonomous Trust Platform now has a technology-independent security contract.

Accepted invariants constrain future architecture and implementation.

Technology choices must preserve applicable invariants.

Implementation decisions cannot silently waive them.

If an invariant cannot be preserved, the conflict returns to architecture governance.

Accepted architecture establishes the requirement.

Implementation creates the control.

Verification provides the evidence.

Enforcement claims require that evidence.
