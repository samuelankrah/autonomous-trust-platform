# Autonomous Trust Platform — Trust Boundaries and Trust Domains

**Status:** Accepted
**Accepted Date:** 2026-08-09
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Artifact Owner:** Trust Platform — Control Plane
**Architecture Domain:** Trust boundaries, trust domains, authorities, federation, and trust-anchor ownership

---

## 1. Purpose

This document defines the trust-boundary and trust-domain model for the Autonomous Trust Platform.

Its purpose is to identify where assumptions about identity, evidence, authority, administration, policy, and enforcement cease to be locally valid and must be explicitly evaluated.

The model intentionally avoids treating:

* Network segment
* Kubernetes cluster
* Cloud account
* Namespace
* Organizational department
* Credential issuer
* SPIFFE trust domain

as universally equivalent trust boundaries.

Different security functions may have different authorities and boundaries.

---

## 2. Governing Question

For any assertion crossing a security boundary, the platform must eventually be able to answer:

> **What is being asserted, who produced the assertion, who verifies it, which authority or trust anchor makes that verification meaningful, for what purpose is it accepted, and what must the receiving domain decide for itself?**

Examples of assertions include:

* Identity
* Authentication state
* Attestation results
* Delegated authority
* Software provenance
* Authorization decisions
* Policy metadata
* Audit evidence

---

## 3. Trust Boundary

For the Autonomous Trust Platform:

> **A trust boundary is a point at which a security-relevant assumption cannot safely be carried forward without explicit validation, translation, or policy evaluation.**

A trust boundary may exist because of a change in:

* Administrative control
* Identity authority
* Credential issuer
* Policy authority
* Attestation authority
* Execution environment
* Enforcement authority
* Trust anchor
* Data ownership
* Organizational ownership
* Resource ownership
* Federation relationship

Crossing a network boundary may create a trust boundary.

A trust boundary does not, however, require a network boundary.

Two components on the same machine may occupy different trust boundaries.

Two systems on different networks may participate in the same narrowly defined trust domain.

---

## 4. Trust Domain

For this project:

> **A trust domain is a bounded scope within which a defined security function relies on a coherent set of authorities, trust anchors, validation rules, and governance assumptions.**

A trust domain must always be interpreted in relation to the function being trusted.

Examples include:

* Identity trust domain
* Attestation trust domain
* Authorization domain
* Policy-administration domain
* Audit/evidence domain

The platform does not assume that one universal trust domain governs all security functions.

Therefore:

```text
identity trust domain
        ≠
necessarily authorization domain
        ≠
necessarily attestation domain
        ≠
necessarily administrative domain
```

---

## 5. Qualified Trust-Domain Terminology

The term `trust domain` is overloaded across security architectures.

The Autonomous Trust Platform should therefore qualify the term whenever ambiguity is possible.

Preferred terminology includes:

```text
SPIFFE trust domain
identity trust domain
attestation trust domain
authorization domain
administrative domain
policy authority domain
audit/evidence domain
```

Unqualified use of `trust domain` should be avoided when multiple trust functions are being discussed.

---

## 6. SPIFFE Trust Domain

A SPIFFE trust domain is a specific workload-identity construct.

Conceptually:

```text
SPIFFE Trust Domain
        │
        ├── Identity namespace
        │
        └── Authoritative verification keys
```

Workloads within the domain receive SPIFFE IDs under that namespace and identity documents that can be verified using the domain's bundle.

Example:

```text
spiffe://payments.example/service/api
```

The trust-domain component:

```text
payments.example
```

identifies the SPIFFE trust domain.

The path:

```text
/service/api
```

identifies a workload within that domain according to locally defined semantics.

The Autonomous Trust Platform must not automatically infer that a SPIFFE trust domain is also:

* An authorization domain
* An organizational boundary
* A Kubernetes cluster
* An agent identity namespace
* An attestation authority
* A policy-administration domain

Those relationships require explicit architecture decisions.

---

## 7. Administrative Domain

An **administrative domain** is a scope controlled by a common administrative authority.

Examples may include:

* Platform engineering team
* Cloud account owner
* Kubernetes platform operator
* Security operations team
* External partner
* Software supplier

Administrative control matters because the administrator may influence:

* Registration
* Configuration
* Credentials
* Policy
* Verification
* Deployment
* Trust anchors

Two systems using identical technology but operated by different authorities may therefore occupy different administrative trust boundaries.

---

## 8. Identity Trust Domain

An **identity trust domain** is a scope in which identities are governed under a coherent namespace, issuance authority, and verification model.

Questions include:

```text
Who may create identities?

Who issues identity credentials?

Which namespaces are authoritative?

Which trust anchors verify those credentials?

How is issuer compromise handled?

How is identity revoked?
```

An identity trust domain does not automatically define authorization.

---

## 9. Attestation Trust Domain

An **attestation trust domain** is the scope within which defined attestation authorities, endorsement authorities, reference values, evidence formats, and appraisal rules are accepted.

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

The relying party must determine whether the verifier and resulting appraisal are acceptable for the local use case.

Therefore:

```text
valid attestation result
        ≠
universally trusted assertion
```

Attestation trust may differ by resource and security consequence.

---

## 10. Authorization Domain

An **authorization domain** is a scope governed by a coherent authority for deciding whether principals may perform actions on protected resources.

Its responsibilities may include:

* Resource policy
* Action definitions
* Delegation interpretation
* Context evaluation
* Risk requirements
* Decision semantics

An authorization domain need not issue the identity credential it evaluates.

For example:

```text
Identity Domain A
        │
        │ authenticated identity
        ▼
Authorization Domain B
        │
        │ local policy
        ▼
allow / deny
```

Domain B can accept an authenticated identity from Domain A while retaining complete control over local authorization.

---

## 11. Policy-Administration Domain

The authority capable of defining or modifying policy is itself security relevant.

Therefore:

```text
policy evaluation authority
        ≠
necessarily policy administration authority
```

A policy engine may evaluate rules without possessing authority to author those rules.

This separation can reduce the compromise impact of one component.

---

## 12. Enforcement Domain

An **enforcement domain** is the scope within which an enforcement mechanism can make an authorization decision effective.

Examples may eventually include:

* API gateway
* Application
* Service proxy
* Database
* Operating system
* Cloud control plane

A policy decision outside the enforcement path does not by itself protect a resource.

Therefore:

```text
authorization decision
        ≠
enforced authorization
```

---

## 13. Audit and Evidence Domain

An **audit/evidence domain** is a scope within which evidence about security decisions and resulting actions is recorded, protected, and governed.

Questions include:

* Who can write records?
* Who can alter records?
* Who verifies their integrity?
* Which identifiers are preserved?
* Which policy versions are recorded?
* What retention applies?
* Which authority controls deletion?

Audit infrastructure should not automatically share the same administrative authority as all systems whose actions it records when independent evidence is required.

---

## 14. Deployment Boundary Is Not Automatically a Trust Boundary

The following may represent deployment topology:

```text
Kubernetes cluster
namespace
pod
VM
cloud region
network segment
container
```

Topology alone does not define trust semantics.

Example:

```text
Cluster A
├── Finance Workload
└── Research Workload
```

If Finance and Research have different:

* Identity authorities
* Policy authorities
* Administrative owners
* Data sensitivity
* Attestation requirements

then one shared cluster does not imply one meaningful trust domain.

---

## 15. A Trust Domain May Span Deployment Boundaries

The inverse is also possible.

Example:

```text
Identity Trust Domain A

├── Cluster 1
├── Cluster 2
└── VM Environment
```

If the environments share a deliberately governed identity namespace and acceptable verification authority, they may participate in the same identity trust domain despite different deployment locations.

This does not require them to share the same authorization policy.

---

## 16. Trust Relationships Are Directional

Trust must not be modeled as automatically symmetric.

If:

```text
A trusts identity assertions from B
```

it does not imply:

```text
B trusts identity assertions from A
```

Likewise:

```text
A accepts B's attestation verifier
```

does not imply:

```text
B accepts A's verifier
```

Trust relationships must explicitly identify direction.

---

## 17. Trust Is Non-Transitive by Default

The platform will not assume:

```text
A trusts B
B trusts C

therefore

A trusts C
```

Cross-domain trust must be explicitly established.

If A accepts an assertion from C because B vouched for C, then that delegation or chaining relationship itself requires policy and evidence.

Therefore:

> **Trust transitivity must be demonstrated, not inferred.**

This principle does not prohibit explicitly designed trust chains.

For example, a PKI certification path may allow a relying system to validate an end-entity credential through one or more intermediate authorities to a configured trust anchor.

That relationship is not treated as generic trust transitivity.

It is an explicitly constructed validation model governed by:

* A configured trust anchor
* Defined issuer relationships
* Validation rules
* Scope constraints
* Credential validity
* Revocation behavior
* Applicable policy constraints

Therefore:

```text
A trusts B
B trusts C

≠ automatically

A trusts C
```

while:

```text
Configured Trust Anchor
        │
        ▼
Governed Validation Path
        │
        ▼
Validated Assertion
```

may be accepted where the architecture deliberately defines and validates that chain.

The governing rule is:

> **Implicit trust transitivity is prohibited; explicit trust chaining requires defined validation semantics and scope.**

---

## 18. Trust Relationship

A trust relationship should eventually be modeled as:

```text
Trusting Party
      │
      │ accepts
      ▼
Authority / Assertion
      │
      │ for
      ▼
Defined Purpose
      │
      │ subject to
      ▼
Validation Rules + Scope
```

A useful conceptual representation is:

```text
trust_relationship:
  relying_party:
  authority:
  assertion_type:
  accepted_namespace:
  purpose:
  trust_anchor:
  validation_rules:
  validity:
  revocation:
  failure_behavior:
```

This is an architecture model, not a schema or implementation specification.

---

## 19. Boundary-Crossing Contract

Every material assertion crossing a trust boundary should eventually define a **boundary-crossing contract**.

The contract should answer:

### Producer

Who generated the assertion?

### Subject

What principal or object does the assertion describe?

### Assertion Type

Examples:

* Identity
* Attestation result
* Delegation
* Provenance
* Authorization decision

### Verifier

Who validates the assertion?

### Trust Anchor

Why is the verifier or issuer accepted?

### Namespace

Which identities or claims may be represented?

### Purpose

For what use may the receiving side rely on this assertion?

### Freshness

How old may the assertion be?

### Audience

Which receiving systems may consume it?

### Revocation

How is acceptance withdrawn?

### Failure Behavior

What happens when verification is impossible?

### Audit

What evidence of the crossing must be recorded?

---

## 20. Authentication Federation

Authentication federation establishes a controlled mechanism through which one domain can authenticate identities originating in another domain.

Conceptually:

```text
Identity Domain A
        │
        │ credential
        ▼
Identity Domain B
        │
        │ accepted external issuer
        ▼
Authenticated External Principal
```

The result means:

```text
identity assertion accepted
```

not:

```text
all requested actions authorized
```

---

## 21. SPIFFE Federation

SPIFFE federation permits a trust domain to obtain verification material associated with another SPIFFE trust domain.

Conceptually:

```text
SPIFFE Domain A
     bundle
       │
       ▼
SPIFFE Domain B
```

After the federation relationship is established, Domain B may cryptographically authenticate SVIDs associated with Domain A according to SPIFFE verification rules.

Authorization in Domain B remains a separate local responsibility.

Therefore:

```text
federated authentication
        ≠
federated authorization
```

---

## 22. Authorization Federation

Authorization federation is a different and more consequential architecture problem.

It may involve accepting:

* External roles
* External entitlement assertions
* Delegated authority
* Transaction context
* External policy decisions

The platform must not assume that identity federation implies authorization federation.

Authorization federation requires explicit decisions about:

* Authority
* Semantics
* Scope
* Delegation
* Conflict resolution
* Revocation
* Accountability

No authorization-federation architecture is selected by this document.

---

## 23. Attestation Across Trust Boundaries

Remote attestation introduces its own trust graph.

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

The relying party's trust dependency includes:

* Evidence provenance
* Verifier identity
* Verifier trust anchor
* Appraisal policy
* Endorsements
* Reference values
* Result freshness

The relying party may then incorporate Attestation Results into another decision.

Attestation therefore adds trust dependencies; it does not eliminate them.

---

## 24. Provenance Across Trust Boundaries

Supply-chain evidence creates similar questions.

For example:

```text
Producer
   │
   │ signed statement
   ▼
Transparency / Registration System
   │
   ▼
Consumer
```

The consumer must still determine:

* Who signed the statement?
* Is that signer authorized for this statement type?
* Is the registration service trusted for the intended property?
* Has the statement been revoked or superseded?
* What security conclusion can legitimately be drawn from it?

Transparency improves verifiability.

Transparency does not automatically establish the truth of every registered claim.

---

## 25. Trust Anchor and Trust Authority

The architecture distinguishes a **trust authority** from a **trust anchor**.

### Trust Authority

A **trust authority** is a principal, service, or governance function whose assertions, decisions, registrations, or administrative actions are accepted for a defined security purpose.

Examples may include:

* Identity issuing authority
* Attestation verifier
* Endorsement authority
* Policy authority
* Delegation authority
* Software-signing authority
* Federation authority

Authority is contextual.

An entity trusted to issue workload identities is not automatically trusted to:

* Define authorization policy
* Produce attestation results
* Grant delegated authority
* Modify audit evidence

### Trust Anchor

A **trust anchor** is locally accepted root information from which validation of a defined assertion or authority begins.

Depending on the security architecture, examples may include:

* Root CA public-key information
* SPIFFE bundle verification keys
* Hardware endorsement roots
* Attestation verification roots
* Software-signing roots
* Preconfigured verification keys
* Other verifier-local root material

Acceptance of a trust anchor represents a bootstrap decision made outside the validation chain that depends on it.

Therefore:

```text
trust authority
        ≠
trust anchor
```

although one authority may control cryptographic material represented by a trust anchor.

A successfully validated chain to a trust anchor establishes only the security property defined by that validation model.

It does not automatically establish:

* Authorization
* Business trustworthiness
* Correct behavior
* Accuracy of every claim
* Authority outside the anchor's intended purpose

---

## 26. Trust-Anchor and Authority Governance

Every material trust anchor and trust authority must eventually have an explicit governance model.

The architecture must distinguish at least three responsibilities.

### Governance Authority

Who decides that the authority or anchor is accepted?

This includes decisions such as:

* Permitted purpose
* Accepted scope
* Namespace
* Policy constraints
* Federation relationships
* Risk acceptance

### Operational Custodian

Who technically operates or protects the relevant material or service?

Examples may include:

* HSM operators
* PKI operations
* SPIRE administrators
* Attestation-service operators
* Cloud platform administrators

### Consumer Administrator

Who configures relying systems to accept the authority or anchor?

These responsibilities may belong to the same organization or may be deliberately separated.

For every material trust dependency, future architecture must answer:

1. What security function is being trusted?
2. Which authority performs that function?
3. What locally configured anchor or configuration establishes acceptance?
4. Who approves that acceptance?
5. Who operates or protects the authority?
6. Who distributes or configures the trust material?
7. Who can modify it?
8. How is rotation performed?
9. How is acceptance revoked?
10. How is compromise recovered from?
11. Which relying systems depend on it?
12. Which downstream security conclusions become unreliable after compromise?

The governing question becomes:

```text
Who can cause the system
to trust something new,
stop trusting something old,
or change what trusted evidence means?
```

That authority is itself part of the trust architecture.

---

## 27. Trust-Authority and Trust-Anchor Concentration

Centralizing unrelated trust authorities or trust anchors under one administrative or technical control point creates correlated failure risk.

Example:

```text
Universal Trust Administration
├── workload identity
├── attestation
├── policy
├── delegation
├── federation
└── audit
```

Compromise of that control plane could affect multiple independent trust functions simultaneously.

The architecture should therefore evaluate separation where it meaningfully reduces:

* Compromise blast radius
* Administrative abuse
* Recovery coupling
* Policy manipulation
* Fraudulent identity issuance
* Evidence manipulation
* Unauthorized federation
* Trust-anchor replacement

This does not require a separate product for every function.

Possible separation mechanisms include:

* Independent governance authorities
* Separate administrative roles
* Separate cryptographic roots
* Separate credentials
* Independent approval workflows
* Independent audit paths
* Technical isolation where justified

Separation must be driven by security properties and failure analysis rather than by organizational aesthetics.

---

## 28. Trust Dependency Graph

Trust should be modeled as a graph.

Example:

```text
                Hardware Endorsement
                        │
                        ▼
Attester ────────► Attestation Verifier
                        │
                        ▼
                 Attestation Results
                        │
                        │
Identity Issuer ────────┼──────► Relying Party
                        │
Delegation Authority ───┤
                        │
Policy Authority ───────┤
                        │
                        ▼
                Authorization Decision
                        │
                        ▼
                    Enforcement
```

Each incoming edge represents a different trust dependency.

The platform must not assume all edges terminate in the same trust anchor.

---

## 29. Trust Bootstrap

Every trust relationship eventually reaches a bootstrap assumption.

Examples:

```text
Why trust the identity issuer?
Why trust the attestation verifier?
Why trust the policy repository?
Why trust the federation endpoint?
Why trust the administrator installing the root?
```

Bootstrap assumptions must be explicit.

A statement such as:

```text
the certificate validates
```

only moves the question to:

```text
why is that root trusted?
```

---

## 30. Bootstrap Categories

Potential bootstrap mechanisms may eventually include:

* Administrative provisioning
* Hardware root of trust
* Cloud platform identity
* PKI root
* Preconfigured trust bundle
* Supply-chain provisioning
* Out-of-band verification

No bootstrap mechanism is selected by this document.

---

## 31. Trust Revocation

Different trust relationships require different revocation mechanisms.

Possible examples include:

* Credential revocation
* Trust-bundle removal
* Federation removal
* Policy change
* Delegation revocation
* Verifier removal
* Reference-value replacement

Revoking one layer does not necessarily revoke another.

Example:

```text
Workload credential:
VALID

Federation relationship:
REVOKED
```

The credential may remain cryptographically valid while no longer being accepted by the external domain.

---

## 32. Compromise Propagation

For every authority, Task 3 requires analysis of:

```text
If this authority is compromised,
what downstream security conclusions become unreliable?
```

Example:

```text
Compromised Identity Issuer
          │
          ▼
Fraudulent identities
          │
          ▼
Authentication results unreliable
```

But:

```text
Compromised Identity Issuer
```

does not necessarily compromise:

```text
independently protected audit records
```

unless those systems share the same authority or administrative compromise path.

This is why trust dependencies must be explicit.

---

## 33. Failure Propagation

Availability failures must also be modeled.

Examples:

```text
Identity issuer unavailable
Attestation verifier unavailable
Policy decision service unavailable
Trust bundle stale
Federation endpoint unavailable
Audit service unavailable
Revocation data unavailable
```

Different resources may legitimately require different failure behavior.

A universal `fail-open` or `fail-closed` rule is not sufficient architecture.

---

## 34. Scenario A — Multiple Security Domains in One Cluster

```text
Kubernetes Cluster

├── Finance
└── Research
```

Assume:

* Finance has stricter policy.
* Research has separate administrators.
* Finance requires attestation.
* Research does not.

Conclusion:

```text
one cluster
    ≠
one universal trust domain
```

Deployment topology is insufficient to describe the security boundaries.

---

## 35. Scenario B — One Identity Domain Across Multiple Clusters

```text
SPIFFE Identity Domain

├── Cluster A
├── Cluster B
└── VM Environment
```

If all three deliberately share one SPIFFE trust domain and its identity governance, they may share one identity verification domain.

They may still maintain different:

* Authorization policies
* Data owners
* Administrators
* Attestation requirements

---

## 36. Scenario C — Federated Workload Identity

```text
Domain A                      Domain B

workload-A
    │
    │ SVID
    └──────────────────────────► API-B
```

Domain B possesses verification material allowing it to authenticate the Domain A SVID.

Established:

```text
Domain B can authenticate
the Domain A workload identity
```

Not established:

```text
Domain A workload
may perform every action in Domain B
```

Authorization remains local unless explicit authorization federation is separately established.

---

## 37. Scenario D — External Attestation Verifier

```text
Workload
   │
   │ Evidence
   ▼
External Verifier
   │
   │ Attestation Result
   ▼
Protected API
```

The API must determine:

* whether the verifier is acceptable;
* what appraisal policy was used;
* whether results are fresh;
* what security property the result establishes.

A signed Attestation Result does not become trustworthy solely because it is signed.

The signing authority itself is part of the trust relationship.

---

## 38. Scenario E — AI Agent Crossing a Resource Boundary

```text
Human Delegator
      │
      ▼
Logical Agent
      │
      ▼
Hosting Workload
      │
      ▼
External Protected API
```

The receiving API may need:

* Workload authentication
* Logical-agent identity
* Delegation information
* Local authorization policy
* Runtime or attestation evidence

These may originate from different domains.

The receiving API must not infer them from one workload credential.

---

## 39. Scenario F — Compromised Federation Partner

Suppose Domain A and Domain B federate identity.

Domain A's issuing authority is compromised.

Potential effect:

```text
attacker
   │
   ▼
fraudulent Domain A identity
   │
   ▼
accepted cryptographically by Domain B
```

This illustrates why federation requires:

* Revocation
* Federation removal
* Incident communication
* Namespace restrictions
* Local authorization limits

Strong cryptography cannot compensate for a compromised trusted issuer.

---

## 40. Trust-Boundary Invariants

The following are proposed Sprint 1 invariants.

### TB-01

Deployment topology must not automatically define trust domains.

### TB-02

Trust relationships must identify the function for which trust is granted.

### TB-03

Trust relationships are directional.

### TB-04

Trust is non-transitive unless transitivity is explicitly established and governed.

### TB-05

Authentication federation must not automatically imply authorization federation.

### TB-06

Every material trust authority and trust anchor must have an explicit governance, custody, lifecycle, and compromise-recovery model.

### TB-07

Cross-boundary assertions must identify their producer, verifier, intended purpose, validation basis, and revocation behavior.

### TB-08

Attestation results must not automatically establish identity or authorization.

### TB-09

A credential valid under one trust domain must not automatically be accepted by another domain.

### TB-10

Compromise and availability propagation must be analyzed for material trust authorities.

These remain proposed until incorporated into the Sprint 1 Security Invariants artifact.

---

## 41. Candidate Architecture Decision

This model produces a candidate decision:

> **Trust boundaries and trust domains must be defined from security authority and trust relationships rather than inferred solely from deployment topology.**

A stronger formulation may also be warranted:

> **Cross-domain trust is explicit, directional, purpose-scoped, and non-transitive by default.**

These are not yet accepted decisions.

ADR treatment will be evaluated after scenario validation.

---

## 42. Open Questions

1. Should the platform formally define an `Authority Domain` abstraction?
2. How should identity trust domains map to authorization domains?
3. Which components may administer trust anchors?
4. Must trust-anchor administration require separate human authority?
5. How should federation relationships be represented?
6. How should trust relationships be versioned?
7. How should cross-domain trust be revoked rapidly?
8. Should external attestation verifiers be allowed for high-impact resources?
9. How are conflicting attestation results resolved?
10. Which trust relationships require hardware-backed anchors?
11. How should a logical agent identity cross trust domains?
12. Should delegated authority be federated independently from identity?
13. How should audit systems prove that a previously valid trust relationship existed?
14. What failure behavior applies when federation verification becomes unavailable?
15. How should trust-anchor compromise alter previously recorded audit evidence?
16. Which trust relationships must be isolated from shared administrative control?

---

## 43. Architecture Decisions Not Made

This document does not select:

* SPIFFE/SPIRE
* WIMSE
* RATS/EAT implementation
* SCITT implementation
* Certificate authority
* Federation protocol
* Authorization system
* Policy engine
* TEE
* TPM
* Cloud identity provider
* Audit platform

It establishes the trust-boundary semantics those technologies must later satisfy.

---

## 44. Task 3 Exit Criteria

The Trust Boundary Model is ready for acceptance when it can explain:

* Trust boundary
* Trust domain
* Qualified trust-domain terminology
* Administrative domain
* Identity trust domain
* Attestation trust domain
* Authorization domain
* Enforcement domain
* Audit/evidence domain
* Federation
* Trust directionality
* Trust transitivity
* Boundary-crossing contracts
* Trust-anchor ownership
* Trust bootstrap
* Compromise propagation
* Failure propagation
* All required validation scenarios

Consequential architecture decisions resulting from this model must be evaluated separately for ADR treatment.

---

## References

NIST, *Zero Trust Architecture — SP 800-207*
https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf

SPIFFE, *SPIFFE Trust Domain and Bundle*
https://spiffe.io/docs/latest/spiffe-specs/spiffe_trust_domain_and_bundle/

SPIFFE, *SPIFFE Federation*
https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/

IETF, *RFC 9334 — Remote ATtestation procedureS (RATS) Architecture*
https://www.rfc-editor.org/rfc/rfc9334.html

IETF, *RFC 9711 — The Entity Attestation Token (EAT)*
https://www.rfc-editor.org/rfc/rfc9711.html

IETF, *RFC 9943 — An Architecture for Trustworthy and Transparent Digital Supply Chains*
https://www.rfc-editor.org/rfc/rfc9943.html

NIST NCCoE, *Implementing a Zero Trust Architecture — Glossary*
https://pages.nist.gov/zero-trust-architecture/glossary.html
