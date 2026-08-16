# ADR-0008: Separate Trust Coordination from Runtime Enforcement and Authority Ownership

**Status:** Accepted
**Date:** 2026-08-16
**Decision Owner:** Trust Platform — Control Plane
**Scope:** Trust coordination, governance, authority ownership, runtime dependency, trust domains, authorization, enforcement, degraded operation, and control-plane compromise boundaries

---

## Context

The Autonomous Trust Platform requires a control-plane concept capable of coordinating security-relevant trust state across identity, attestation, delegation, authorization, enforcement, audit, federation, recovery, and governance.

A control plane is useful because these functions have relationships that must be governed consistently.

However, treating the control plane as the technical owner of every trust function would create several architectural errors.

It could collapse:

* Trust coordination into authority ownership
* Policy distribution into authorization
* Authorization into enforcement
* Platform participation into membership in one universal trust domain
* Logical architecture into deployment topology
* Administrative centralization into a security boundary
* Control-plane availability into runtime permission
* Control-plane availability into universal runtime availability

The accepted architecture already requires:

* Function-scoped trust domains
* Explicit trust authorities and trust anchors
* Separation of identity from authorization
* Separation of attestation from identity and authority
* Explicit and bounded delegated authority
* Effective enforcement on the protected action path
* Explicit failure semantics
* No authority amplification during failure
* Analysis of correlated compromise

The initial system-context architecture therefore requires an explicit decision defining what the Trust Coordination and Governance Plane is, what it is not, and how runtime systems may depend on it.

---

## Decision

The Autonomous Trust Platform shall separate **trust coordination and governance** from **runtime enforcement and authority ownership**.

The Trust Coordination and Governance Plane is a logical responsibility grouping that may coordinate security-relevant trust state and governance across independently distinguishable trust functions.

It does not automatically become the authority that owns or performs those functions.

The architecture therefore preserves:

```text
Trust Coordination
        ≠
Authority Ownership
```

and:

```text
Policy Coordination
        ≠
Authorization Decision
        ≠
Enforcement
```

and:

```text
Participation in Trust Control Plane
        ≠
Membership in One Universal Trust Domain
```

---

## Trust Coordination Responsibilities

The Trust Coordination and Governance Plane may coordinate or govern:

* Trust relationships
* Trust-domain configuration
* Registration
* Identity eligibility
* Trust-anchor governance
* Attestation policy
* Delegation policy
* Authorization policy
* Federation relationships
* Revocation policy
* Recovery governance
* Degraded-mode policy
* Evidence requirements
* Architecture-conformance state

These are logical responsibilities.

A future implementation may distribute them across multiple components, authorities, administrative domains, or deployment locations.

---

## Authority Ownership Remains Explicit

Coordination does not automatically make the control plane:

* Universal Identity Authority
* Universal Attestation Authority
* Universal Delegation Authority
* Universal Policy Authority
* Universal Authorization Authority
* Universal Enforcement Authority
* Universal Recovery Authority
* Universal Trust Anchor
* Universal Authority Source

Each material authority must remain identifiable by purpose.

Where multiple authority roles are intentionally co-located, the architecture must still distinguish their responsibilities and analyze the resulting compromise dependency.

---

## Function-Scoped Trust Domains Remain Independent

The control plane may coordinate multiple trust domains.

Its existence does not merge:

* Identity trust domains
* Attestation trust domains
* Authorization domains
* Enforcement domains
* Audit and evidence domains
* Administrative domains

The architecture therefore rejects:

```text
Coordinated by One Platform
        therefore
One Trust Domain
```

Cross-domain relationships remain explicit, directional, purpose-scoped, governed, revocable, auditable, and non-transitive by default where those properties are required by the applicable architecture.

---

## Logical Plane Is Not Deployment Topology

The Trust Coordination and Governance Plane is a logical architecture construct.

It does not inherently define:

* A process boundary
* A host boundary
* A network boundary
* A Kubernetes namespace
* A cloud account
* An administrative domain
* A trust domain
* A cryptographic boundary
* An independent security boundary

The architecture preserves:

```text
Logical Plane
        ≠
Deployment Boundary
        ≠
Trust Domain
        ≠
Independent Security Boundary
```

Physical separation may contribute to isolation.

It does not prove independent security authority or compromise independence.

---

## Runtime Dependency Must Be Explicit

A protected runtime operation must identify which control-plane functions, if any, are required synchronously.

The architecture must not assume that every protected request requires a synchronous round trip to a centralized control plane.

Future implementations may use combinations of:

* Locally distributed policy
* Locally verifiable credentials
* Locally available trust bundles
* Bounded cached state
* Local authorization decision functions
* Centralized authorization decision services
* Distributed revocation information
* Transaction-specific remote decisions

The selected mechanism must preserve the accepted trust and failure semantics.

---

## Control-Plane Unavailability

Control-plane unavailability is an availability condition.

It is not an authority source.

The architecture preserves:

```text
Control Plane Unavailable
        ≠
Authority Granted
```

The architecture also does not require a universal shutdown rule:

```text
Control Plane Unavailable
        ≠
Universal Runtime Shutdown
```

Required behavior is resource- and risk-specific.

A future implementation may permit bounded continuation only where the applicable policy and failure model explicitly allow it and where the required trust assumptions remain valid.

---

## No Failure-Created Authority

A control-plane outage must not create authority that was not otherwise legitimately established.

The applicable invariant remains:

```text
Effective Authority During Failure
        ⊆
Authority legitimately established
before or independently during failure
```

Cached policy, credentials, trust material, or authorization state may be usable only within explicitly governed freshness, revocation, context, and risk bounds.

Unknown state must not silently be interpreted as valid state.

---

## Authorization and Enforcement

The control plane may coordinate policy or authorization state.

That coordination is not itself enforcement.

For a protected action:

```text
Authorization Decision
        │
        ▼
Effective Enforcement Point
        │
        ▼
Protected Operation
```

The enforcement point must exist on or within an effective path to the protected action.

A control plane that distributes policy but cannot constrain the protected action is not, by that fact alone, the enforcement boundary.

---

## Local Authorization Sovereignty

A resource's authorization domain retains final control over local access unless that authority has itself been explicitly delegated.

Therefore:

```text
External Identity Accepted
        ≠
Local Authorization Granted
```

and:

```text
External Delegation Accepted
        ≠
Automatic Local Access
```

The Trust Coordination and Governance Plane may coordinate federation or delegation relationships without overriding this principle.

---

## Correlated Compromise

Central coordination can create material shared compromise paths.

The architecture must analyze whether a control-plane compromise could affect:

* Identity issuance
* Trust-anchor configuration
* Attestation appraisal
* Delegation issuance
* Authorization policy
* Revocation
* Enforcement configuration
* Recovery
* Audit integrity

Logical service separation is insufficient evidence of compromise independence.

Shared administrators, root credentials, cloud accounts, CI/CD systems, databases, signing keys, recovery mechanisms, or infrastructure may create correlated compromise.

---

## Governance and Auditability

Security-relevant control-plane changes must be attributable and auditable.

Examples include:

* Trust-anchor changes
* Registration changes
* Federation changes
* Identity eligibility changes
* Attestation policy changes
* Delegation policy changes
* Authorization policy changes
* Revocation changes
* Degraded-mode changes
* Recovery configuration changes
* Enforcement configuration changes

The evidence model should permit later reconstruction of:

* Who or what changed trust state
* Under which authority
* Which policy governed the change
* Which trust domains were affected
* Which downstream conclusions became invalid or changed
* Which enforcement or runtime behavior was affected

---

## Security Consequences

### Positive

This decision:

* Prevents the control plane from becoming an undefined synonym for trust
* Preserves function-scoped trust domains
* Keeps authority ownership explicit
* Keeps authorization separate from enforcement
* Supports local or distributed runtime authorization
* Makes control-plane outage semantics analyzable
* Makes correlated compromise visible
* Preserves vendor and topology independence
* Enables future component mapping without prematurely selecting products

### Costs

This decision increases architectural discipline.

Future implementations must explicitly map:

* Which component owns each authority
* Which component coordinates each function
* Which trust domain applies
* Which runtime dependencies are synchronous
* Which state may be cached
* Which freshness and revocation assumptions apply
* Which enforcement point constrains the protected action
* Which failures permit bounded continuation
* Which administrative dependencies create correlated compromise

A simpler architecture that centralizes all functions under one service may be easier to deploy but would hide distinctions this platform considers security-relevant.

---

## Alternatives Considered

### Alternative A — Universal Trust Service

Model one central platform service as the identity, policy, authorization, delegation, enforcement, recovery, and trust authority.

**Rejected.**

This would collapse distinct security functions and create a large correlated compromise domain.

It would also make future standards and components difficult to evaluate independently.

### Alternative B — Central Control Plane on Every Runtime Request

Require every protected action to synchronously consult one centralized control-plane service.

**Rejected as an architectural requirement.**

Some future resources may legitimately require centralized fresh decisions.

Others may safely use locally verifiable and bounded state.

The architecture should define required semantics rather than mandate one topology.

### Alternative C — Fully Independent Trust Functions With No Coordination Plane

Treat every security function as unrelated and provide no common governance or coordination model.

**Rejected.**

This would make cross-function trust state, recovery, federation, evidence, and architecture conformance difficult to govern coherently.

### Alternative D — Deployment Boundaries Define Trust Boundaries

Treat physical separation, namespaces, processes, clusters, or accounts as the primary definition of trust domains.

**Rejected.**

Deployment topology may support isolation but does not establish the semantic trust relationship, authority, or acceptance policy.

---

## Technology Implications

This ADR does not select:

* SPIFFE or SPIRE
* WIMSE
* SPICE
* SCITT
* RATS or EAT implementation technology
* Vault
* Kubernetes
* Nomad
* OPA
* Cedar
* Zanzibar-style authorization
* OAuth
* A cloud-provider identity service
* A specific policy engine
* A specific enforcement mechanism
* A specific audit platform

Future technology decisions must map concrete components to the logical roles defined by the accepted architecture.

A product marketed as a "control plane" does not satisfy this ADR merely because of its product category or deployment model.

---

## Verification Requirements

A future implementation claiming conformance with this ADR should provide evidence that:

1. Trust coordination responsibilities are mapped to concrete components.
2. Authority ownership is explicitly identified.
3. Function-scoped trust domains are documented.
4. Runtime dependencies on control-plane functions are identified.
5. Synchronous and asynchronous dependencies are distinguished.
6. Bounded cached-state semantics are defined where used.
7. Control-plane outage does not create new authority.
8. Failure behavior is resource- and risk-specific.
9. Authorization decisions are mapped to effective enforcement points.
10. Alternate paths that bypass required enforcement are tested.
11. Cross-domain relationships preserve local authorization sovereignty.
12. Correlated administrative and infrastructure dependencies are documented.
13. Security-relevant trust-state changes are auditable.
14. Claims of enforcement are supported by implementation and verification evidence.

Architecture acceptance does not establish that any of these properties are currently implemented or enforced.

---

## Relationship to Existing Decisions

This ADR builds on and does not supersede:

* ADR-0002 — Distinguish Logical Actor and Workload Identity
* ADR-0003 — Function-Scoped Trust Domains and Cross-Domain Trust
* ADR-0004 — Bootstrap Trust and Identity-Binding Assurance
* ADR-0005 — Explicit, Bounded, and Non-Amplifying Delegated Authority
* ADR-0006 — Security Invariants as Architecture Constraints
* ADR-0007 — Explicit, Bounded Security Failure Semantics

It records the additional system-context decision that trust coordination, runtime enforcement, and authority ownership must remain architecturally distinguishable.

---

## Reconsideration Criteria

Reconsider this decision if a future architecture can demonstrate a simpler control-plane model that preserves equivalent:

* Explicit authority ownership
* Function-scoped trust semantics
* Local authorization sovereignty
* Effective enforcement
* Failure-bounded authority
* Correlated-compromise analysis
* Recovery semantics
* Auditability
* Vendor independence

Any replacement must preserve those security properties even if the logical decomposition changes.

---

## Decision Summary

> **The Autonomous Trust Platform will use a Trust Coordination and Governance Plane to coordinate security-relevant trust state without treating that plane as a universal trust domain, universal authority, or universal runtime enforcement point. Runtime dependencies must be explicit, enforcement must remain effective on the protected action path, and control-plane failure must neither create authority nor imply a universal shutdown policy.**
