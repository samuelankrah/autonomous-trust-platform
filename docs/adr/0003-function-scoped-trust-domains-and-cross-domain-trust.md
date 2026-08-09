# ADR-0003: Define Function-Scoped Trust Domains and Explicit Cross-Domain Trust

**Status:** Accepted
**Date:** 2026-08-09
**Decision Owner:** Trust Platform — Control Plane
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Scope:** Trust boundaries, trust domains, authorities, federation, and trust-anchor governance

---

## Context

The Autonomous Trust Platform must evaluate identity, authentication, attestation, authorization, delegation, policy, enforcement, provenance, and audit evidence across heterogeneous environments.

These functions do not necessarily share the same:

* Administrative authority
* Identity namespace
* Credential issuer
* Trust anchor
* Policy authority
* Attestation verifier
* Enforcement mechanism
* Deployment environment

Deployment constructs such as clusters, namespaces, cloud accounts, network segments, and organizational units may coincide with meaningful trust boundaries, but topology alone does not establish the security semantics of those boundaries.

External standards also use function-specific trust concepts.

SPIFFE defines a trust domain around workload identity namespaces, issuing authorities, and verification material.

RATS defines Attester, Verifier, and Relying Party relationships for remote attestation.

PKI certification paths depend on explicitly configured trust anchors and governed validation paths.

The platform therefore requires a general trust-domain model that does not silently equate any one technology's boundary with the complete platform trust architecture.

---

## Decision

The Autonomous Trust Platform adopts **function-scoped trust domains**.

A trust domain is defined relative to the security function being relied upon and consists of a coherent set of:

* Authorities
* Trust anchors
* Validation rules
* Governance assumptions
* Accepted namespaces or assertion scopes

The architecture will qualify trust-domain terminology when multiple security functions are involved.

Examples include:

```text
SPIFFE trust domain
identity trust domain
attestation trust domain
authorization domain
policy-administration domain
audit/evidence domain
administrative domain
```

These domains may overlap.

They must not be assumed to be identical.

---

## Trust-Boundary Principle

A trust boundary exists where a security-relevant assumption cannot safely be carried forward without explicit:

```text
validation
translation
policy evaluation
or another governed trust decision
```

Trust boundaries therefore follow changes in security authority and trust assumptions rather than deployment topology alone.

Consequently:

```text
Kubernetes cluster
        ≠
automatically trust domain
```

```text
cloud account
        ≠
automatically trust domain
```

```text
network segment
        ≠
automatically trust domain
```

```text
organizational ownership
        ≠
automatically one trust domain
```

Deployment boundaries remain relevant evidence about administration, isolation, and failure domains, but they do not independently establish trust semantics.

---

## Cross-Domain Trust Principle

Cross-domain trust must be:

* Explicit
* Directional
* Purpose-scoped
* Governed
* Revocable
* Auditable
* Non-transitive by default

If Domain A accepts an assertion from Domain B:

```text
A → accepts defined assertion from → B
```

that does not automatically establish:

```text
B → trusts A
```

or:

```text
A → trusts every assertion from B
```

or:

```text
A → trusts Domain C because B trusts C
```

The exact assertion type and intended purpose must be part of the trust relationship.

---

## Explicit Trust Chaining

The non-transitivity rule does not prohibit deliberately constructed trust chains.

For example, PKI may validate:

```text
Configured Trust Anchor
        │
        ▼
Intermediate Authority
        │
        ▼
End-Entity Credential
```

Such a relationship is accepted because the architecture explicitly defines:

* Trust anchor
* Issuer relationships
* Validation algorithm
* Path constraints
* Credential validity
* Applicable policy
* Revocation behavior

Therefore:

> **Implicit trust transitivity is prohibited; explicitly designed trust chaining must define validation semantics, constraints, and scope.**

---

## Authentication Federation

Authentication federation establishes a controlled mechanism through which one domain can authenticate identities issued by another domain.

For SPIFFE federation, an external trust domain's bundle provides verification material used to authenticate SVIDs issued under that domain.

Therefore:

```text
federated authentication
        ≠
federated authorization
```

Accepting another identity authority means the receiving system can validate defined identity assertions from that authority.

It does not mean those identities receive unrestricted local authority.

---

## Authorization Federation

Authorization federation is a separate architecture decision.

It may involve accepting externally produced:

* Entitlements
* Delegated authority
* Transaction context
* Roles
* Authorization decisions
* Policy-derived claims

These assertions have consequences beyond identification and therefore require independent decisions about:

* Authority
* Semantics
* Scope
* Conflict handling
* Delegation
* Revocation
* Auditability

No authorization-federation protocol is selected by this ADR.

---

## Attestation Across Trust Boundaries

Attestation introduces a separate trust relationship.

Conceptually:

```text
Attester
    │
    │ Evidence
    ▼
Verifier
    │
    │ Attestation Results
    ▼
Relying Party
```

The Relying Party must determine whether the Verifier and its appraisal process are accepted for the intended security purpose.

Therefore:

```text
validly signed Attestation Result
        ≠
automatically trusted result
```

and:

```text
trusted Attestation Result
        ≠
automatically authorized action
```

The trust relationship with the Verifier must itself be governed.

---

## Trust Authority

A **trust authority** is a principal, service, or governance function whose assertions, decisions, registrations, or administrative actions are accepted for a defined security purpose.

Examples may include:

* Identity issuing authority
* Attestation verifier
* Endorsement authority
* Policy authority
* Delegation authority
* Federation authority
* Software-signing authority

Trust in one authority function does not automatically extend to another.

For example:

```text
trusted workload identity issuer
        ≠
trusted authorization-policy authority
```

---

## Trust Anchor

A **trust anchor** is locally accepted root information from which validation of a defined assertion or authority begins.

Examples may include:

* Root CA verification information
* SPIFFE bundle verification keys
* Hardware endorsement roots
* Attestation roots
* Software-signing roots
* Preconfigured verification material

A trust anchor and a trust authority are related but distinct.

```text
trust authority
        ≠
trust anchor
```

Acceptance of the anchor represents a bootstrap decision outside the validation chain that depends upon it.

---

## Trust Governance

For each material trust authority and trust anchor, architecture must identify:

1. What security function it anchors or performs.
2. Who approves its use.
3. Who operates or protects it.
4. Who configures relying systems to accept it.
5. Which namespaces or assertions it may represent.
6. How it is provisioned.
7. How it is rotated.
8. How acceptance is revoked.
9. How compromise is detected and recovered from.
10. Which downstream trust conclusions depend on it.

The architecture distinguishes:

```text
Governance Authority
        ≠
Operational Custodian
        ≠
Consumer Administrator
```

These roles may be combined where justified, but combination must not be assumed.

---

## Trust-Authority Concentration

The platform will evaluate correlated failure introduced by concentrating unrelated trust functions under one control plane or administrative authority.

For example:

```text
Single Authority
├── identity issuance
├── attestation verification
├── policy administration
├── delegation
├── federation
└── audit control
```

creates a materially different failure profile from independent authorities.

The architecture does not mandate a separate product for every function.

It requires separation to be considered where it materially improves:

* Compromise containment
* Administrative separation
* Recovery independence
* Policy integrity
* Evidence integrity
* Federation safety

---

## Boundary-Crossing Contract

Material assertions crossing trust boundaries should have an explicitly defined boundary-crossing contract.

The contract should identify:

```text
producer
subject
assertion type
verifier
trust authority
trust anchor or acceptance basis
namespace / scope
purpose
audience
freshness
revocation
failure behavior
audit requirements
```

This is an architecture requirement.

This ADR does not prescribe a token, protocol, or schema.

---

## Trust Bootstrap

Every material trust relationship eventually reaches a bootstrap assumption.

Examples include:

```text
Why trust the identity issuer?
Why trust the attestation verifier?
Why trust the federation metadata?
Why trust the policy authority?
Why trust the administrator installing the root?
```

The architecture must identify rather than hide these assumptions.

A statement such as:

```text
certificate validation succeeded
```

does not remove the bootstrap question.

It moves the question to:

```text
why was that trust anchor accepted?
```

---

## Revocation

Cross-domain trust relationships must be independently revocable where required.

Examples include:

* Removing a federation relationship
* Removing trust-bundle material
* Revoking a credential
* Removing a Verifier from the accepted set
* Changing local policy
* Revoking delegated authority

Different revocation layers remain distinct.

For example:

```text
credential:
cryptographically valid

federation relationship:
revoked
```

means the receiving domain may no longer accept the otherwise valid credential.

---

## Compromise Propagation

For every material trust authority, the architecture must determine:

> **Which downstream conclusions become unreliable if this authority is compromised?**

Compromise of an identity issuer may invalidate confidence in identities issued by that authority.

It does not necessarily compromise independently governed audit evidence, policy authorities, or attestation systems.

This distinction depends on actual administrative and technical separation.

---

## Failure Propagation

Availability failure is different from authority compromise.

Architecture must separately evaluate conditions such as:

```text
identity authority unavailable
attestation verifier unavailable
policy service unavailable
federation endpoint unavailable
revocation data unavailable
audit destination unavailable
```

Failure behavior is resource- and risk-specific.

The architecture rejects universal `fail-open` or `fail-closed` treatment as a substitute for explicit risk analysis.

---

## Alternatives Considered

### Alternative A — Deployment Topology Defines Trust Domains

Clusters, namespaces, networks, or cloud accounts automatically determine trust domains.

**Rejected.**

Topology may influence isolation or administration but does not establish all identity, attestation, authorization, or governance boundaries.

---

### Alternative B — One Universal Platform Trust Domain

All Autonomous Trust Platform security functions operate under a single trust domain and authority model.

**Rejected.**

Identity, attestation, authorization, policy, audit, and administrative trust may have different authorities and compromise characteristics.

A universal domain would hide those dependencies and increase correlated failure risk.

---

### Alternative C — Technology-Specific Trust Domains Define Platform Architecture

The platform adopts SPIFFE trust-domain semantics as its universal trust model.

**Rejected.**

SPIFFE trust domains provide a strong workload-identity construct, but the Autonomous Trust Platform also requires trust semantics for:

* Authorization
* Attestation
* Delegation
* Policy administration
* Audit
* Provenance

Those functions may not share the SPIFFE identity boundary.

---

### Alternative D — Function-Scoped Trust Domains with Explicit Cross-Domain Relationships

Trust domains are defined by the security function, authorities, anchors, and governance being relied upon.

Cross-domain trust is established explicitly and scoped to the assertion and purpose.

**Accepted.**

---

## Consequences

### Positive

* Deployment architecture no longer silently defines trust architecture.
* SPIFFE trust domains can be used precisely for workload identity.
* Authorization can remain locally controlled after external authentication.
* RATS Verifier relationships can be governed independently.
* Federation can be narrowly scoped.
* Trust-anchor ownership and administration become explicit.
* Compromise propagation becomes analyzable.
* Different trust functions can have independent recovery paths.

### Negative

* Trust architecture becomes more explicit and therefore more complex.
* Security events may cross several domains.
* Federation configuration requires additional governance.
* Audit records may need to preserve domain and authority context.
* Trust-anchor inventories may become necessary.
* Architecture diagrams must distinguish multiple overlapping boundaries.

These costs are accepted because hidden trust dependencies represent greater systemic risk.

---

## Risks

### Excessive Domain Fragmentation

Every component could be assigned its own trust domain.

**Mitigation:** Separate domains only where materially different authorities, trust anchors, policy, governance, or security requirements justify the boundary.

### Accidental Universal Federation

Operators may interpret federation as unrestricted trust.

**Mitigation:** Boundary-crossing relationships must specify assertion type, scope, purpose, and local authorization requirements.

### Administrative Collapse

Several nominally independent trust functions may still share the same administrators.

**Mitigation:** Model administrative authority separately from protocol or cryptographic boundaries.

### Trust-Anchor Replacement

An attacker able to modify the relying party's configured trust material may bypass otherwise strong cryptography.

**Mitigation:** Trust-anchor governance, custody, modification, recovery, and audit must be explicitly designed.

---

## Relationship to Trust Boundary Model

`docs/architecture/trust-boundaries.md` defines the broader conceptual model.

This ADR records its consequential architecture decisions:

> **Trust domains are function-scoped rather than inferred from deployment topology.**

and:

> **Cross-domain trust is explicit, directional, purpose-scoped, governed, revocable, auditable, and non-transitive by default.**

---

## Architecture Decisions Not Made

This ADR does not select:

* SPIFFE/SPIRE deployment topology
* Number of SPIFFE trust domains
* WIMSE
* RATS/EAT implementation
* SCITT implementation
* PKI hierarchy
* Certificate authority
* Authorization federation protocol
* Policy engine
* Trust-store technology
* TEE
* TPM
* Cloud identity provider

Those decisions must be derived from the trust requirements established here.

---

## Reversal Conditions

This decision should be reconsidered if evidence demonstrates that:

1. A deployment-topology boundary reliably represents all required security authorities and trust relationships without hidden coupling.
2. A standards-based abstraction emerges that more precisely captures identity, attestation, authorization, policy, and evidence domains under one interoperable model.
3. Function-scoped domains create materially more security ambiguity than they remove.
4. A future architecture provides equivalent explicit authority, revocation, compromise, and audit semantics through a simpler model.

Any replacement must preserve explicit trust ownership and cross-domain authority constraints.

---

## Related Artifacts

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/trust-standards-landscape.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`

---

## References

SPIFFE, *SPIFFE Trust Domain and Bundle*
https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/

SPIFFE, *SPIFFE Federation*
https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/

IETF, *RFC 5280 — Internet X.509 Public Key Infrastructure Certificate and CRL Profile*
https://www.rfc-editor.org/rfc/rfc5280.html

IETF, *RFC 5914 — Trust Anchor Format*
https://www.rfc-editor.org/rfc/rfc5914.html

IETF, *RFC 6024 — Trust Anchor Management Requirements*
https://www.rfc-editor.org/rfc/rfc6024.html

IETF, *RFC 9334 — Remote ATtestation procedureS (RATS) Architecture*
https://www.rfc-editor.org/rfc/rfc9334.html

---

## Outcome

The Autonomous Trust Platform adopts function-scoped trust domains and explicit cross-domain trust relationships.

Trust architecture will be derived from security authorities, trust anchors, validation semantics, governance, and purpose rather than inferred solely from deployment topology.

Cross-domain trust must be explicit, directional, purpose-scoped, governed, revocable, auditable, and non-transitive by default.

Explicitly constructed validation chains remain permitted where their trust anchors, constraints, validation semantics, and scope are deliberately defined.
