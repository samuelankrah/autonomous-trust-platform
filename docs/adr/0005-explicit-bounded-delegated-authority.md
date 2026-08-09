# ADR-0005: Require Explicit, Bounded, and Non-Amplifying Delegated Authority

**Status:** Accepted
**Date:** 2026-08-09
**Decision Owner:** Trust Platform — Control Plane
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Scope:** Delegated authority, redelegation, authority provenance, revocation, cross-domain delegation, and authorization sovereignty

---

## Context

The Autonomous Trust Platform distinguishes identity from authority.

A principal may be correctly identified and successfully authenticated while possessing no authority for a requested action.

Likewise, valid workload identity, logical-agent identity, attestation evidence, or credential possession does not establish that another principal legitimately authorized the requested action.

This distinction becomes especially important for autonomous software and AI agents because:

* A human may delegate bounded authority to an agent.
* An agent may execute inside a workload possessing broader infrastructure authority.
* One agent may invoke another agent or tool.
* Delegation may cross authorization or trust domains.
* Delegated authority may expire or be revoked independently from identity.
* A delegation artifact may remain cryptographically valid after the authority basis it represents has been withdrawn.

The platform therefore requires an explicit delegated-authority model.

---

## Decision

The Autonomous Trust Platform adopts the following rule:

> **Delegated authority must be explicit, attributable, bounded, non-amplifying, independently revocable where required, and evaluated separately from identity and authentication.**

Delegation is defined as:

> **The governed grant of bounded authority by one principal to another principal, derived from authority the delegator is permitted to delegate.**

Delegation is not necessarily a transfer.

The delegator may retain its own authority after granting bounded authority to another principal.

---

## Identity and Authority

The architecture preserves:

```text
identity
    ≠
authority
```

and:

```text
authentication
    ≠
authorization
```

A valid identity identifies the principal.

Delegated authority establishes a governed authority relationship.

Authorization evaluates whether the requested action may actually occur.

These lifecycles remain independently controllable.

---

## Exercisable and Delegable Authority

The architecture distinguishes:

```text
Exercisable Authority
        ≠
Delegable Authority
```

A principal may:

* Exercise authority without permission to delegate it.
* Delegate authority without personally exercising it.
* Possess both.
* Possess neither.

Therefore, the platform rejects the simplistic rule that a principal may delegate something only if it personally performs that action.

The relevant requirement is whether the principal possesses legitimate **delegation authority**.

---

## Non-Amplification

A delegator may grant only authority that it is permitted to delegate.

Conceptually:

```text
Granted Authority
        ⊆
Delegable Authority
```

For redelegation:

```text
A → B → C
```

authority granted from B to C must remain within the authority B is permitted to redelegate.

A delegation chain must not manufacture additional authority.

---

## Redelegation

Redelegation is denied by default.

It must be explicitly authorized by the applicable delegation relationship or policy.

Where redelegation is permitted, derived authority must preserve or reduce the applicable authority scope unless another independent authority source explicitly provides additional authority.

Delegation depth may be constrained independently.

---

## Authority Provenance

Delegated authority must preserve sufficient provenance to determine:

* Authority source
* Delegator
* Delegate
* Delegation issuer where applicable
* Grant identifier
* Scope
* Constraints
* Redelegation rights
* Validity
* Revocation state

The platform distinguishes:

```text
authority source
        ≠
delegator
        ≠
delegation issuer
```

These roles may be performed by the same system, but the architecture must not assume they are identical.

---

## Delegation Issuer

A delegation issuer may encode, sign, or otherwise represent a grant on behalf of the governing authority relationship.

The ability to issue a delegation artifact does not inherently grant authority to define arbitrary delegation scope.

An issuer may represent only grants permitted by the applicable authority and policy.

This distinction prevents token-issuing infrastructure from silently becoming the underlying source of authority.

---

## Delegation Artifacts

A token, certificate, signed assertion, or other delegation artifact represents authority.

It does not independently become the source of that authority merely because its cryptographic validation continues to succeed.

Therefore:

> **A still-valid delegation artifact must not by itself preserve authority after the sole authority basis from which it was derived has been withdrawn.**

The affected authority must be re-evaluated.

If another independent authority source establishes a valid basis, authority may continue under that independent basis.

---

## Revocation

Authority validity must remain independently controllable from identity validity.

The architecture distinguishes:

```text
Identity Revocation
        ≠
Authority Revocation
```

and:

```text
Expiration
        ≠
Revocation
```

Short-lived delegation reduces some exposure but does not replace explicit revocation semantics where revocation is required.

---

## Downstream Revocation

A derived grant must not silently outlive the authority basis from which it derives.

When a delegator loses authority that supported a downstream grant, that downstream authority must be re-evaluated.

Where the ultimate and sole authority source withdraws the underlying authority, derived grants must no longer be accepted solely because previously issued delegation artifacts remain valid.

The architecture must preserve sufficient provenance to identify affected descendants.

---

## Authority Composition

A principal may receive authority from multiple independent sources.

The platform does not assume those grants combine automatically through union.

Authorization policy must explicitly determine how applicable authority is composed.

Possible models may include:

* Union
* Intersection
* Most restrictive
* Priority
* Resource-specific evaluation

No universal composition model is selected by this ADR.

---

## Host and Logical-Agent Authority

Hosting workload authority and logical-agent authority remain distinguishable.

Therefore:

```text
Host Workload Authority
        ≠
Agent Authority
```

A logical agent must not automatically inherit the complete authority of the workload in which it executes unless an explicit architecture decision establishes that relationship.

This is consistent with ADR-0002.

---

## Tool Invocation

The ability to invoke a tool does not automatically establish a delegation relationship.

A tool may:

* Merely expose a capability through which the caller exercises its own authority, or
* Independently act as another principal under separately delegated authority.

Those architectures have different identity and accountability implications and must remain distinguishable.

---

## Attestation

Attestation evidence may influence authorization policy.

It does not inherently create delegated authority.

Therefore:

```text
attested runtime
        ≠
delegated authority
```

Attestation addresses evidence about the execution environment or other security properties.

Delegation addresses authority provenance.

---

## Cross-Domain Delegation

Delegation crossing trust or authorization domains requires explicit governance.

The receiving authorization domain must independently decide whether it accepts:

* External authority source
* Delegator identity
* Delegation issuer
* Delegation representation
* Scope semantics
* Redelegation semantics
* Revocation semantics

Identity federation does not automatically establish delegation federation.

---

## Authorization Sovereignty

Acceptance of an external delegation assertion does not automatically authorize a requested action.

Therefore:

```text
External Delegation Accepted
        ≠
Requested Action Allowed
```

The resource's authorization domain retains final control unless that authority has itself been explicitly and separately delegated.

This preserves local authorization sovereignty.

---

## Confused Deputy

A principal possessing powerful authority must not substitute its own authority for the authority of a requester where the security model requires requester-specific authorization.

Authorization context should preserve sufficient binding between:

* Requesting principal
* Delegated authority
* Resource
* Action
* Audience
* Relevant policy

This reduces confused-deputy risk.

---

## Auditability

Delegated actions must preserve sufficient evidence to reconstruct the relevant authority chain.

Where security-relevant, audit context should distinguish:

```text
Who acted?

Which runtime executed the action?

Who delegated authority?

What was the authority source?

What grant was used?

What authorization decision was made?

What enforcement result occurred?
```

Actor, runtime, delegator, and authority source may be different entities.

---

## Consequences

### Positive

* Authentication no longer becomes an implicit authorization mechanism.
* AI agents can retain identity independently from delegated authority lifecycle.
* Delegation chains become analyzable.
* Authority amplification can be detected.
* Host workload privileges need not become ambient agent authority.
* Delegation artifacts remain representations rather than hidden authority roots.
* Revocation can propagate based on authority provenance.
* Cross-domain authorization remains locally governed.
* Audit evidence can reconstruct authority provenance.

### Costs

* Authorization context becomes richer.
* Delegation systems must preserve provenance and constraints.
* Revocation may require dependency tracking.
* Multi-hop agent delegation becomes more complex.
* Cross-domain delegation requires governance beyond identity federation.
* Authority composition requires explicit policy.

These costs are accepted because implicit authority propagation presents greater systemic risk.

---

## Alternatives Considered

### Identity Implies Authority

Rejected.

Identity establishes who or what a principal is, not what every resource permits it to do.

### Hosting Workload Authority Automatically Applies to Agent

Rejected as a universal model.

It can collapse logical-agent authority boundaries into runtime permissions and undermine ADR-0002.

### Delegation Artifacts Become Independent Authority Once Issued

Rejected.

A still-valid artifact cannot resurrect authority whose sole underlying basis has been withdrawn.

### Redelegation Allowed Unless Prohibited

Rejected.

This increases accidental authority propagation and weakens reasoning about delegation depth.

### Explicit, Bounded, Non-Amplifying Delegation

Accepted.

---

## Architecture Decisions Not Made

This ADR does not select:

* OAuth
* OAuth Token Exchange
* JWT
* Macaroons
* Capability-token format
* GNAP
* WIMSE delegation mechanism
* SPIFFE/SPIRE authorization integration
* Cedar
* OPA
* Zanzibar-style authorization
* Relationship-based access control
* Authorization server
* Revocation protocol
* Proof-of-possession protocol

Those technologies must satisfy the authority semantics established here.

---

## Relationship to Existing Decisions

ADR-0002 defines when logical software principals must be independently distinguishable from hosting workloads.

ADR-0003 defines function-scoped trust domains and explicit cross-domain trust.

ADR-0004 defines how initial trust and principal-to-identity bindings are established.

This ADR defines how bounded authority may subsequently be granted and exercised.

Conceptually:

```text
ADR-0002
Who is acting?
        ↓
ADR-0003
Where does trust change?
        ↓
ADR-0004
How is initial trust established?
        ↓
ADR-0005
Under whose authority may the principal act?
```

---

## Reversal Conditions

This decision should be reconsidered if a future architecture can provide equivalent:

* Authority provenance
* Scope control
* Non-amplification
* Revocation
* Delegation-chain validation
* Local authorization sovereignty
* Auditability

through a simpler model.

Any replacement must continue to prevent authenticated identity, cryptographic artifact validity, or runtime privilege from silently becoming unrestricted delegated authority.

---

## Related Artifacts

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/trust-standards-landscape.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`

---

## Outcome

The Autonomous Trust Platform requires delegated authority to remain explicit, bounded, attributable, non-amplifying, and independently governable from identity.

Redelegation is denied by default.

Delegation artifacts represent authority but do not become independent authority sources.

Cross-domain delegation remains subject to local authorization control.

Authentication establishes the principal.

Delegation establishes the authority provenance.

Authorization decides whether that authority permits the requested action.

Enforcement makes that decision effective.
