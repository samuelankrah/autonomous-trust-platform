# Autonomous Trust Platform — Security Invariants

**Status:** Accepted
**Accepted Date:** 2026-08-09
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Artifact Owner:** Trust Platform — Control Plane
**Architecture Domain:** Cross-cutting security properties that must remain true across implementations

---

## 1. Purpose

This document defines the system-wide security invariants of the Autonomous Trust Platform.

A security invariant is a property that must remain true regardless of:

* Product
* Vendor
* Protocol
* Credential format
* Deployment topology
* Cloud provider
* Runtime
* Policy engine
* Authorization engine
* Attestation technology
* Implementation language

Security mechanisms may change.

These properties must not.

---

## 2. Governing Principle

The Autonomous Trust Platform is built around explicit separation of:

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

Security properties in one layer must not silently become equivalent to properties in another.

The platform therefore treats semantic separation as a security requirement.

---

## 3. What Makes a Statement an Invariant

A statement qualifies as a security invariant when violation would cause one or more of the following:

* Incorrect principal identity
* Incorrect trust conclusion
* Unauthorized authority
* Authority amplification
* Authorization bypass
* Loss of accountability
* Unsafe trust propagation
* Unsafe degraded behavior
* Inability to recover from compromise
* Misleading security evidence

An implementation preference is not an invariant merely because it is desirable.

For example:

```text
Use SPIFFE
```

is not a security invariant.

But:

```text
Authentication of a workload must not automatically
establish the identity of every logical actor within it.
```

is an invariant.

---

## 4. Evidence Status

The invariants in this document are architecture requirements.

They do not imply that corresponding controls have already been:

* Implemented
* Enforced
* Tested
* Observed
* Proven production-ready

Future implementation work must provide verification evidence.

### Assurance-State Accuracy

Architecture and implementation evidence must distinguish:

- Proposed
- Accepted
- Implemented
- Tested
- Observed
- Enforced
- Production Ready

These states must not be represented interchangeably.

An architectural invariant does not become an implemented security guarantee merely because it has been documented.

---

# Identity and Principal Invariants

## 5. SI-01 — Credential Is Not Principal

> **A credential must not be treated as the principal itself.**

A credential represents or proves claims about a principal.

Credential lifecycle and principal lifecycle may differ.

Therefore:

```text
Credential
    ≠
Principal
```

A stolen, renewed, replaced, or expired credential does not automatically redefine the underlying principal.

---

## 6. SI-02 — Runtime Authentication Does Not Automatically Establish Logical Actor Identity

> **Authentication of a hosting workload must not automatically establish the identity of every logical actor executing within that workload.**

Where logical actor and workload identity differ materially:

```text
Authenticated Workload
        ≠
Authenticated Logical Actor
```

An explicit binding mechanism is required when independent logical-actor identity is security relevant.

---

## 7. SI-03 — Identity and Authority Lifecycles Remain Independent

> **Identity validity must remain independently governable from authority validity.**

Therefore:

```text
Valid Identity
    ≠
Valid Authority
```

A principal may:

* Have valid identity and no authority
* Retain identity after delegated authority expires
* Lose identity while historical authority evidence remains relevant

Credential renewal must not silently renew delegated authority.

Expiration must not be treated as equivalent to revocation.

Credential renewal, identity renewal, or re-authentication must not silently renew or restore delegated authority whose independent validity has ended.

---

## 8. SI-04 — Infrastructure Identity Does Not Automatically Become Workload Identity

> **Infrastructure identity must not automatically be interpreted as workload identity.**

Examples include:

* Node identity
* VM identity
* Cluster identity
* Cloud instance identity

These may participate in workload bootstrap or validation, but an explicit architecture must define that relationship.

---

## 9. SI-05 — Security-Relevant Principal Boundaries Must Remain Distinguishable

Where principals differ materially in:

* Authority
* Lifecycle
* Revocation
* Policy
* Delegation
* Accountability
* Ownership

their identities must remain distinguishable.

Implementation-process boundaries alone do not create principal boundaries.

---

# Trust and Trust-Domain Invariants

## 10. SI-06 — Deployment Topology Does Not Define Trust Semantics

> **Deployment topology must not automatically define trust domains.**

Therefore:

```text
Same Cluster
    ≠
Same Trust Domain
```

and:

```text
Different Cluster
    ≠
Different Trust Domain
```

Trust domains are defined by security function, authorities, trust anchors, validation rules, and governance.

---

## 11. SI-07 — Trust Must Remain Function-Scoped

Trust in one security function must not automatically extend to another.

Examples:

```text
Trust Identity Issuer
        ≠
Trust Authorization Authority
```

```text
Trust Attestation Verifier
        ≠
Trust Delegation Authority
```

```text
Trust Audit Authority
        ≠
Trust Policy Authority
```

Explicit architecture must define each relationship.

---

## 12. SI-08 — Trust Is Not Automatically Symmetric or Transitive

> **Trust relationships must not be assumed symmetric or transitively inherited.**

If:

```text
A trusts B
```

it does not inherently follow that:

```text
B trusts A
```

or:

```text
A trusts everyone B trusts
```

Explicit governed validation chains may exist, but generic implicit trust transitivity is prohibited.

---

## 13. SI-09 — Cross-Domain Acceptance Must Be Explicit

> **A credential, assertion, delegation, or evidence object valid in one trust domain must not automatically be accepted by another domain.**

The receiving domain determines:

* Trusted authority
* Accepted namespace
* Accepted scope
* Evidence requirements
* Policy
* Authorization consequences

---

## 14. SI-10 — Authentication Federation Does Not Imply Authorization Federation

> **Federated authentication must not automatically import authorization.**

Therefore:

```text
External Identity Accepted
        ≠
Local Resource Authority Granted
```

Local authorization sovereignty remains unless explicitly delegated through a separately governed architecture.

---

# Bootstrap and Recovery Invariants

## 15. SI-11 — Registration Is Not Current Runtime Proof

> **Registration must not be treated as current proof of runtime identity.**

Registration may establish eligibility.

Runtime authentication or attestation may establish current evidence.

Those are different security functions.

---

## 16. SI-12 — Strong Routine Credentials Cannot Repair Incorrect Bootstrap Binding

> **Routine credential strength must not be used as evidence that the original principal-to-identity binding was correct.**

Therefore:

```text
Strong Cryptography
        ≠
Correct Initial Identity Binding
```

A highly protected credential can faithfully represent the wrong principal.

---

## 17. SI-13 — Bootstrap Authority Must Remain Bootstrap-Scoped

> **Bootstrap evidence, credentials, registrations, and provisioning mechanisms must not automatically become standing application authority.**

Successful bootstrap establishes only the relationship explicitly defined by the bootstrap architecture.

---

## 18. SI-14 — Bootstrap Transition Must Be Explicit

The transition from bootstrap to routine operation must define:

* When bootstrap ends
* Which artifacts remain valid
* Which artifacts become unusable
* What routine credential replaces bootstrap
* What evidence records completion

Temporary bootstrap capability must not silently become permanent authority.

---

## 19. SI-15 — Compromise Recovery Requires an Independent Trust Basis

> **Recovery from compromise must not rely solely on the trust basis whose compromise caused recovery to be necessary.**

Conceptually:

```text
Compromised Root
      ↓
cannot solely authenticate
      ↓
Replacement Root
```

An independently trustworthy recovery basis is required where the existing basis can no longer be relied upon.

---

## 20. SI-16 — Re-Bootstrap Must Not Silently Inherit Previous Trust

Migration, recovery, replacement, or re-enrollment must not automatically inherit all assumptions from the previous trust relationship.

A new binding requires an explicitly valid basis.

---

# Attestation Invariants

## 21. SI-17 — Attestation Semantics Must Remain Bounded

> **Attestation evidence or Attestation Results must not, by themselves, be treated as establishing principal identity, delegated authority, or authorization.**

Attestation may participate in:

* Identity bootstrap
* Identity validation
* Authorization policy
* Trust evaluation

when an explicit architecture defines the relationship.

The invariant prohibits automatic semantic equivalence.

---

## 22. SI-18 — Attestation Trust Must Be Explicit

Reliance on attestation requires explicit trust in relevant:

* Evidence protection
* Verifier
* Appraisal policy
* Reference values
* Endorsements
* Freshness rules

Cryptographically valid evidence does not automatically establish that appraisal policy or reference data is trustworthy.

---

# Delegated-Authority Invariants

## 23. SI-19 — Authentication Does Not Establish Delegated Authority

> **Authentication of a delegate must not, by itself, establish that the principal possesses delegated authority.**

Therefore:

```text
Authenticated Principal
        ≠
Delegated Authority
```

Authority provenance must be evaluated independently.

---

## 24. SI-20 — Delegated Authority Must Not Amplify

> **A delegation must not grant authority beyond what the delegator is permitted to delegate.**

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

authority granted by B to C must remain within B's legitimately redelegable authority unless C receives additional authority from an independent legitimate authority source.

---

## 25. SI-21 — Redelegation Requires Explicit Permission

> **Redelegation is denied by default.**

The ability to receive delegated authority does not automatically include permission to delegate it onward.

---

## 26. SI-22 — Delegation Artifact Validity Does Not Create an Independent Authority Source

> **A delegation artifact must not remain authoritative solely because its cryptographic representation remains valid after its sole underlying authority basis has been withdrawn.**

Therefore:

```text
Valid Signature
        ≠
Valid Underlying Authority
```

Derived authority must be re-evaluated when its authority basis changes.

---

## 27. SI-23 — Delegation Issuer Is Not Automatically the Authority Source

The architecture must preserve the distinction:

```text
Authority Source
      ≠
Delegator
      ≠
Delegation Issuer
```

Those roles may be combined where explicitly justified but must not be assumed identical.

Artifact issuance capability must not become unrestricted authority-definition capability.

---

## 28. SI-24 — Multiple Authority Sources Must Not Be Implicitly Unioned

> **Authority obtained from multiple sources must not automatically be composed through union.**

Composition must be explicit.

Possible models may include:

* Union
* Intersection
* Most restrictive
* Priority
* Resource-specific evaluation

The applicable policy determines composition.

---

## 29. SI-25 — Hosting Workload Authority Does Not Automatically Become Agent Authority

> **A logical agent must not automatically inherit all authority of its hosting workload.**

Therefore:

```text
Host Workload Authority
        ≠
Logical Agent Authority
```

An implementation must explicitly define any authority relationship between them.

---

## 30. SI-26 — Tool Invocation Is Not Automatically Redelegation

> **The ability to invoke another tool, service, or agent must not automatically be interpreted as authority to redelegate.**

Invocation and delegation are distinct security relationships.

---

# Authorization and Enforcement Invariants

## 31. SI-27 — Identity Is Not Authorization

> **Credential possession, successful authentication, and identity validity must not automatically authorize a protected resource operation.**

Authorization remains a separate decision.

---

## 32. SI-28 — External Delegation Remains Subject to Local Authorization

> **Acceptance of an externally issued delegation assertion must not automatically permit the requested action.**

The applicable authorization domain retains final control unless that authority has been explicitly and separately delegated.

---

## 33. SI-29 — Requester Authority Must Not Be Replaced by Ambient Deputy Authority

Where requester-specific authority matters:

> **A service or deputy must not substitute its own broader authority for authority the requester does not possess.**

The authorization context must preserve requester identity and authority where necessary.

---

## 34. SI-30 — Authorization Requires Effective Enforcement

> **An authorization decision must not be treated as an effective security control unless enforcement actually constrains the protected action.**

Therefore:

```text
Correct Authorization Decision
        +
Broken Enforcement
        =
Security Failure
```

Protected operations must remain within the coverage of the intended enforcement architecture.

---

# Failure and Compromise Invariants

## 35. SI-31 — Failure or Uncertainty Must Not Silently Increase Authority

> **Failure, uncertainty, timeout, unavailable validation, unavailable revocation state, or degraded operation must not silently result in broader authority.**

Failure behavior must be explicitly selected according to resource risk.

This does not require universal fail-closed behavior.

It requires deliberate behavior.

---

## 36. SI-32 — Compromise and Availability Failure Remain Distinct

The architecture must distinguish:

```text
Authority Compromised
        ≠
Authority Unavailable
```

Compromise may invalidate security conclusions.

Unavailability creates a degraded-state decision.

Containment and recovery requirements differ.

---

## 37. SI-33 — Compromise Dependencies Must Be Traceable

> **Compromise of a material authority must trigger analysis of every downstream security conclusion that depends on that authority.**

Examples include compromise of:

* Identity authority
* Trust anchor
* Attestation verifier
* Policy authority
* Delegation authority
* Recovery authority

Unrelated trust functions must not automatically be assumed compromised unless they share the same trust or administrative dependency.

---

## 38. SI-34 — Security Functions Must Not Hide Correlated Compromise

Combining multiple trust functions under one control plane or administrative authority must not be treated as equivalent to independent security boundaries.

Architecture must account for shared compromise paths.

---

# Audit and Accountability Invariants

## 39. SI-35 — Security-Relevant Actions Must Preserve Principal Context

> **Audit evidence must preserve enough principal context to reconstruct actor, runtime, and delegator where those distinctions affect security.**

The platform must not collapse:

```text
Actor
Runtime
Delegator
```

into a single ambiguous identity when they are security-relevant distinctions.

---

## 40. SI-36 — Delegated Actions Must Preserve Authority Provenance

Audit evidence for delegated actions must preserve sufficient information to determine, where applicable:

* Actor
* Hosting runtime
* Authority source
* Delegator
* Delegate
* Delegation issuer
* Grant
* Relevant scope
* Authorization decision
* Enforcement result

Historical authority evidence must remain interpretable even after current identities or grants are revoked.

---

# Governance Invariants

## 41. SI-37 — Security Authorities Must Remain Architecturally Distinguishable

The following roles must remain conceptually distinguishable:

```text
Root of Trust
Trust Anchor
Trust Authority
Bootstrap Authority
Identity Authority
Attestation Authority
Policy Authority
Delegation Authority
Authorization Authority
Enforcement Authority
Audit Authority
Recovery Authority
```

They may be implemented together where justified.

Implementation co-location must not erase their different security responsibilities.

Each material trust authority and trust anchor must have an explicit governance, custody, lifecycle, modification, audit, and compromise-recovery model.

Co-location of authority functions does not eliminate these responsibilities and must not conceal shared compromise paths.

---

## 42. SI-38 — Security-Relevant Trust State Changes Must Be Governed

> **Security-relevant trust state must not be modified without an explicitly authorized and attributable governance path.**

This includes material changes to:

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

Where security relevant, changes must be:

* Authorized
* Attributable
* Auditable
* Recoverable or reversible according to the governing architecture

Successful modification of configuration does not itself prove that the change was legitimately authorized.


## 43. Invariant Interaction

Security failures often occur when several individually valid components are composed incorrectly.

Example:

```text
Valid Credential
      +
Valid Attestation
      +
Valid Delegation Artifact
      +
Incorrect Authorization Semantics
      =
Unauthorized Action
```

The invariants therefore constrain not only individual mechanisms but their composition.

---

## 44. Invariant Verification Model

Every future implementation should map applicable invariants to:

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

Example:

```text
SI-20
Delegated authority must not amplify
        ↓
Delegation validation control
        ↓
Authorization service
        ↓
Grant read → delegate read
        ↓
Grant read → attempt delegate admin → denied
        ↓
Delegation verifier unavailable
        ↓
Recorded validation evidence
```

An invariant is not considered technically enforced until appropriate implementation and verification evidence exists.

---

## 45. Negative-Test Principle

Each invariant should eventually have at least one test designed to prove that the forbidden state is rejected or otherwise constrained.

Examples:

### SI-02

Authenticate workload successfully.

Attempt to assert an unbound logical agent.

Expected:

```text
Agent identity is not automatically established.
```

### SI-17

Provide valid attestation evidence.

Attempt to use it as sole proof of application authorization.

Expected:

```text
Attestation alone does not authorize the action.
```

### SI-20

Delegate `read`.

Attempt redelegation of `admin`.

Expected:

```text
Authority amplification is rejected.
```

### SI-31

Make revocation validation unavailable.

Expected:

```text
System follows explicitly defined degraded-mode policy
rather than silently expanding authority.
```

---

## 46. Violation Classification

A security invariant violation may originate from:

* Architecture defect
* Implementation defect
* Configuration defect
* Policy defect
* Compromised authority
* Administrative misuse
* Semantic misuse
* Availability failure
* Enforcement bypass

The invariant remains the same regardless of cause.

---

## 47. Relationship to the Threat Model

The Threat Model asks:

> How can a security property be violated?

The Security Invariants artifact asks:

> Which properties must never be silently violated?

Conceptually:

```text
Architecture Model
      ↓
Threat Model
      ↓
Security Invariants
      ↓
Implementation Controls
      ↓
Verification Evidence
```

Task 7 therefore forms the contract between Sprint 1 architecture and later implementation.

---

## 48. Relationship to Local Model Invariants

Earlier Sprint 1 artifacts contain model-specific candidate invariants.

Those statements remain valuable as supporting architecture.

This artifact consolidates their cross-cutting security properties into the system-wide invariant set.

Where future wording appears inconsistent, the accepted ADRs and accepted system-wide invariants must be evaluated together rather than assuming that a later implementation detail silently supersedes an accepted architecture decision.

---

## 49. Architecture Decisions Not Made

This artifact does not select:

* SPIFFE
* SPIRE
* OAuth
* WIMSE
* RATS
* EAT
* SCITT
* SPICE
* OPA
* Cedar
* Kubernetes
* Vault
* HSM
* TPM
* TEE
* Cloud provider
* Authorization protocol
* Delegation format
* Audit technology
* Revocation mechanism

A future technology may be adopted only if the resulting architecture preserves applicable invariants.

---

## 50. Architecture Decision

The candidate system-wide decision is:

> **The Autonomous Trust Platform shall treat accepted security invariants as technology-independent architecture constraints. A conforming implementation, protocol, product, or federation design must preserve every applicable invariant. If an architecture cannot preserve an accepted invariant, the invariant itself must be explicitly reviewed, revised, superseded, or withdrawn through architecture governance before the conflicting design can be considered conformant. An implementation decision must not silently waive an accepted invariant.**

A second candidate decision is:

> **An invariant must not be claimed as technically enforced until implementation and verification evidence demonstrates the corresponding control and enforcement behavior.**

Whether these require a dedicated ADR will be determined during Task 7 acceptance.

---

## 51. Open Questions

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

---

## 52. Task 7 Exit Criteria

The Security Invariants artifact is ready for acceptance when it:

* Consolidates identity invariants
* Consolidates trust-domain invariants
* Consolidates bootstrap invariants
* Consolidates attestation invariants
* Consolidates delegated-authority invariants
* Consolidates authorization invariants
* Includes enforcement integrity
* Includes degraded-mode behavior
* Includes compromise propagation
* Includes recovery integrity
* Includes audit provenance
* Includes administrative concentration
* Distinguishes architecture requirements from implemented controls
* Is technology independent
* Supports positive, negative, and failure testing
* Does not contradict accepted ADRs
* Does not silently convert implementation preferences into architecture requirements
* Defines how future implementations are evaluated against the invariant set

---

## References to Existing Architecture

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/threat-model.md`
* `docs/architecture/trust-standards-landscape.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`

This artifact consolidates previously established architecture. It does not supersede an accepted ADR.
