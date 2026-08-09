# Autonomous Trust Platform — Bootstrap Trust and Trust Establishment

**Status:** Accepted
**Accepted Date:** 2026-08-09
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Artifact Owner:** Trust Platform — Control Plane
**Architecture Domain:** Bootstrap trust, enrollment, initial identity binding, roots of trust, recovery, and re-bootstrap

---

## 1. Purpose

This document defines the bootstrap-trust model for the Autonomous Trust Platform.

Its purpose is to explain how a system establishes an initial trust relationship before the principal, component, issuer, verifier, or external domain already possesses a routinely accepted credential or established trust relationship.

Bootstrap is treated as an architecture problem rather than an installation detail.

The model applies to trust establishment involving:

* Workload identity
* Node identity
* Logical software principals
* AI agents
* PKI
* Attestation
* Federation
* Policy authorities
* Provenance authorities
* Trust anchors

No bootstrap implementation is selected by this document.

---

## 2. Governing Question

Every bootstrap process must eventually answer:

> **What evidence makes the first security-relevant binding acceptable, who evaluates that evidence, which prior authority or root is relied upon, and what prevents that temporary bootstrap mechanism from becoming unintended permanent authority?**

A successful routine credential does not answer this question by itself.

Example:

```text
Workload presents valid SVID
        │
        ▼
Who authorized issuance?
        │
        ▼
What made that workload eligible?
        │
        ▼
What evidence established that eligibility?
        │
        ▼
Who trusted the evidence source?
        │
        ▼
Bootstrap dependency
```

---

## 3. Bootstrap Trust

For this project:

> **Bootstrap trust is the process by which a relying system establishes an initial scoped trust relationship or identity binding using evidence, authorities, anchors, policy, or out-of-band assumptions that precede routine trust operation.**

Bootstrap trust is:

* Function-specific
* Purpose-scoped
* Explicit
* Auditable
* Recoverable
* Subject to compromise analysis

Bootstrap trust is not one universal platform event.

Different trust functions may bootstrap independently.

---

## 4. Bootstrap Is Function-Scoped

The platform may require separate bootstrap processes for:

```text
workload identity
node identity
logical-agent identity
PKI trust
attestation verification
policy authority
federation
software provenance
audit verification
```

These bootstrap paths may share dependencies.

They must not be assumed to have the same root of trust or administrative authority.

Therefore:

```text
workload bootstrap
        ≠
attestation bootstrap
        ≠
authorization bootstrap
        ≠
federation bootstrap
```

---

## 5. Root of Trust

A **root of trust** is an inherently relied-upon hardware, firmware, or software component that performs a specific foundational security function.

Roots of trust may provide functions such as:

* Measurement
* Verification
* Secure storage
* Reporting
* Key protection

A root of trust is function-specific.

It must not be interpreted as a universal source of business trust or authorization.

Therefore:

```text
hardware root of trust
        ≠
universal application trust
```

Reference:

[NIST CSRC — Roots of Trust](https://csrc.nist.gov/glossary/term/roots_of_trust)

---

## 6. Root of Trust Versus Trust Anchor

The architecture distinguishes:

```text
root of trust
        ≠
trust anchor
```

A root of trust is a foundational trusted component performing a security function.

A trust anchor is locally accepted root information from which validation of an assertion or authority begins.

Example:

```text
TPM measurement capability
        │
        │ root-of-trust function
        ▼
attestation evidence
```

versus:

```text
configured CA public key
        │
        │ trust anchor
        ▼
certificate path validation
```

The concepts may interact but are not interchangeable.

References:

[NIST CSRC — Roots of Trust](https://csrc.nist.gov/projects/hardware-roots-of-trust)

[IETF RFC 6024 — Trust Anchor Management Requirements](https://www.rfc-editor.org/rfc/rfc6024.html)

---

## 7. Trust Authority Versus Bootstrap Authority

A **trust authority** performs a security function that another system accepts.

A **bootstrap authority** is a principal or governance function authorized to establish or approve the initial trust relationship.

They may be the same entity but need not be.

Example:

```text
Security Governance
       │
       │ approves
       ▼
Identity Authority
       │
       │ issues
       ▼
Workload Identity
```

The identity authority issues the credential.

The governance authority may determine whether the issuer itself is accepted.

---

## 8. Bootstrap Mechanism

A **bootstrap mechanism** is the process or protocol used to establish an initial trust relationship.

Potential mechanisms include:

* Administrative provisioning
* One-time token
* Existing certificate
* Platform identity
* Cloud instance identity
* Hardware-backed identity
* Out-of-band key installation
* Preconfigured trust bundle
* Attestation
* Supply-chain provisioning

The mechanism is not itself the trust relationship.

Its role is to provide sufficient evidence or authority to establish that relationship.

---

## 9. Bootstrap Credential

A **bootstrap credential** is an artifact used primarily to establish initial trust or identity.

Examples may include:

* Enrollment token
* Join token
* Manufacturer-installed certificate
* Cloud instance identity token
* Existing machine certificate

A bootstrap credential should be distinguished from the routine credential issued after successful bootstrap.

Conceptually:

```text
Bootstrap Credential
        │
        ▼
Initial Validation
        │
        ▼
Identity Binding
        │
        ▼
Routine Credential
```

Where practical, bootstrap credentials should have narrower scope and shorter useful lifetime than routine operational authority.

This is an architecture preference, not a universal implementation requirement.

---

## 10. Bootstrap Evidence

**Bootstrap evidence** is evidence used to establish the legitimacy, identity, provenance, or eligibility of an entity during initial trust establishment.

Possible evidence includes:

* Platform instance identity
* Hardware evidence
* Node properties
* Workload properties
* Existing certificate identity
* Provenance information
* Administrative approval

Evidence must be interpreted under policy.

Evidence alone does not define the resulting identity.

---

## 11. Registration

Registration represents a configured relationship describing expected identity or eligibility.

Conceptually:

```text
expected properties
        +
desired identity
        =
registration relationship
```

Registration is not, by itself, proof that a currently executing entity possesses those expected properties.

Therefore:

```text
registered
        ≠
currently verified
```

This distinction is especially important for workload identity.

---

## 12. Eligibility Policy

An **eligibility policy** determines what evidence or properties make a candidate eligible to receive a particular identity or trust relationship.

Conceptually:

```text
Candidate
   │
   ▼
Observed Properties
   │
   ▼
Eligibility Policy
   │
   ▼
Identity Binding
```

Eligibility policy may depend on:

* Administrative registration
* Execution environment
* Workload properties
* Provenance
* Attestation
* Organizational ownership

Identity issuance should not silently substitute for eligibility policy.

---

## 13. Identity Binding

An **identity binding** associates a principal with a defined logical identity.

Bootstrap must establish why the binding is believed to be correct.

Example:

```text
Observed workload
        │
        │ evidence
        ▼
Eligibility evaluation
        │
        ▼
workload://payments-api
```

The critical security property is not simply that a credential was issued.

It is that the credential was issued **to the correct principal under the intended identity**.

---

## 14. Bootstrap Assurance Constraint

A strong operational credential cannot retroactively correct a weak or incorrect initial identity binding.

Conceptually:

```text
Weak / incorrect bootstrap
        │
        ▼
Wrong identity binding
        │
        ▼
Strong cryptographic credential
        │
        ▼
Strongly authenticated wrong identity
```

Therefore:

> **Cryptographic strength after enrollment does not compensate for an incorrectly established identity binding.**

Increasing assurance requires stronger verification or re-binding, not merely stronger keys or credential rotation.

---

## 15. Bootstrap Lifecycle

The generic bootstrap lifecycle is:

```text
1. Trust prerequisites established
        ↓
2. Candidate appears
        ↓
3. Bootstrap evidence collected
        ↓
4. Evidence verified
        ↓
5. Eligibility evaluated
        ↓
6. Identity / trust relationship bound
        ↓
7. Routine credential established
        ↓
8. Bootstrap mechanism retired or constrained
        ↓
9. Routine operation
        ↓
10. Re-validation / recovery when required
```

Not every architecture will use every step.

The model identifies the security functions that must be accounted for.

---

## 16. Bootstrap Prerequisites

Before bootstrap begins, some trust assumptions usually already exist.

Examples include:

* Trusted software configuration
* Issuer keys
* Trust anchors
* Administrative policy
* Registration records
* Cloud-provider trust
* Hardware endorsement roots
* Verifier configuration

Bootstrap therefore does not mean:

```text
trust from nothing
```

It means:

```text
use existing scoped trust
to establish a new scoped trust relationship
```

---

## 17. Administrative Bootstrap

Administrative bootstrap establishes trust through deliberate provisioning or approval by an authorized administrator or governance process.

Examples may include:

* Installing a trust anchor
* Registering a workload
* Approving a federation peer
* Provisioning an initial node
* Approving an identity namespace

Administrative bootstrap introduces a critical dependency:

```text
Who authenticated
and authorized
the administrator?
```

Administrative actions must therefore be included in the trust model.

---

## 18. Administrative Bootstrap Risk

Administrative provisioning can create a stronger technical system on top of a weak administrative process.

Example:

```text
Compromised administrator
        │
        ▼
fraudulent registration
        │
        ▼
valid credential issuance
        │
        ▼
cryptographically authenticated attacker
```

Strong cryptography does not repair fraudulent registration.

Administrative bootstrap therefore requires:

* Authentication
* Authorization
* Change governance
* Audit
* Recovery

---

## 19. Platform Bootstrap

A platform may provide evidence about the execution environment.

Examples may include:

* Cloud instance identity
* Platform metadata
* Node identity
* Service-account identity

This can reduce dependence on manually distributed bootstrap secrets.

It does not eliminate trust.

Instead, trust shifts toward:

* Platform provider
* Platform API
* Metadata service
* Platform signing keys
* Platform account configuration
* Verification implementation

---

## 20. Cloud-Based Bootstrap

Cloud-provided instance identity can serve as bootstrap evidence.

Conceptually:

```text
Cloud Platform
      │
      │ signed instance evidence
      ▼
Candidate Node
      │
      ▼
Verifier
      │
      ▼
Initial Node Identity
```

The receiving system must still determine:

* Which cloud authority is accepted
* Which account or tenant is accepted
* Which instance attributes are relevant
* Which identities may result
* What happens after cloud compromise

SPIRE supports node-attestation mechanisms using cloud instance-identity evidence.

Reference:

[SPIFFE/SPIRE — Configuring SPIRE](https://spiffe.io/docs/latest/deploying/configuring/)

---

## 21. One-Time Bootstrap Tokens

A one-time bootstrap token is a deliberately pre-positioned shared capability used to establish initial identity.

SPIRE join-token node attestation is an example: a server-generated token is provided to the Agent for initial attestation, after which the Agent receives an SVID used for subsequent authentication.

The token does not become the workload's permanent identity.

Reference:

[SPIRE Concepts](https://spiffe.io/docs/latest/spire-about/spire-concepts/)

This illustrates an important transition:

```text
temporary bootstrap capability
        ↓
initial identity establishment
        ↓
routine renewable identity
```

---

## 22. Bootstrap Secret Principle

The platform does not adopt the claim:

```text
secretless
        =
trustless bootstrap
```

Removing a manually stored long-lived secret may reduce one risk class.

The bootstrap relationship may instead depend on:

* Hardware keys
* Cloud identities
* Platform metadata
* Endorsements
* Issuer keys
* Administrative registration

The architecture therefore evaluates **trust dependencies**, not merely whether a plaintext secret exists.

---

## 23. PKI Bootstrap

PKI requires a relying party to begin with accepted trust-anchor information.

Conceptually:

```text
Trust Anchor
      │
      ▼
Certification Path
      │
      ▼
End-Entity Credential
```

Path validation can establish that a credential chains to an accepted authority under defined validation rules.

It does not answer why the relying party initially accepted the trust anchor.

That acceptance is itself a bootstrap decision.

References:

[IETF RFC 5280 — Internet X.509 PKI Certificate and CRL Profile](https://www.rfc-editor.org/rfc/rfc5280.html)

[IETF RFC 6024 — Trust Anchor Management Requirements](https://www.rfc-editor.org/rfc/rfc6024.html)

---

## 24. Hardware-Backed Bootstrap

Hardware roots of trust can provide stronger foundations for specific security assertions.

Potential functions include:

* Measurement
* Verification
* Key protection
* Secure storage
* Reporting

The presence of a hardware root does not automatically establish:

* Workload identity
* Logical-agent identity
* Authorization
* Administrative ownership
* Business intent

Hardware-backed bootstrap still depends on:

* Endorsement authorities
* Provisioning
* Reference values
* Verifier policy
* Trust anchors

References:

[NIST — Roots of Trust](https://csrc.nist.gov/projects/hardware-roots-of-trust)

[Trusted Computing Group — What Is a Root of Trust?](https://trustedcomputinggroup.org/about/what-is-a-root-of-trust-rot/)

---

## 25. Attestation Bootstrap

Remote attestation introduces at least three relevant actors:

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

Bootstrap questions include:

* Why does the Verifier trust the Attester evidence?
* Why does the Relying Party trust the Verifier?
* Which endorsements are accepted?
* Which reference values are trusted?
* Which trust anchors validate the evidence?
* Who controls appraisal policy?

Attestation therefore creates additional trust dependencies rather than removing bootstrap.

Reference:

[IETF RFC 9334 — RATS Architecture](https://www.rfc-editor.org/rfc/rfc9334.html)

---

## 26. Workload Identity Bootstrap

A workload generally cannot prove a platform-recognized workload identity before the workload-identity system has established which identity it should receive.

A generic model is:

```text
Workload starts
       │
       ▼
Environment observes properties
       │
       ▼
Properties verified
       │
       ▼
Registration / eligibility policy matched
       │
       ▼
Logical workload identity selected
       │
       ▼
Credential issued
```

The identity credential is the output of bootstrap.

It must not be treated as the explanation for the bootstrap itself.

---

## 27. SPIRE Workload Bootstrap Example

SPIRE provides a useful reference implementation of the preceding model.

Registration entries associate:

* SPIFFE ID
* Selectors
* Parent identity

with workload eligibility.

The Agent performs workload attestation to obtain selectors describing the connecting workload and can issue identity material when those selectors match an applicable registration entry.

References:

[SPIRE — Registering Workloads](https://spiffe.io/docs/latest/deploying/registering/)

[SPIRE Concepts](https://spiffe.io/docs/latest/spire-about/spire-concepts/)

This illustrates:

```text
registration
        ≠
attestation

attestation
        ≠
identity

registration + observed evidence + policy
        → may establish identity eligibility
```

No SPIRE adoption decision is made by this example.

---

## 28. Node Bootstrap

A workload-identity system may first need to establish trust in the node or local identity agent before trusting workload observations from that environment.

Conceptually:

```text
Node / Agent
      │
      │ node evidence
      ▼
Identity Server
      │
      ▼
Attested Node Identity
      │
      ▼
Local Workload Attestation
```

This creates a dependency chain:

```text
workload identity
      depends partly on
node / agent trust
```

The architecture must make that dependency visible.

---

## 29. Logical Software Principal Bootstrap

A logical software principal—such as an AI agent whose security boundary differs from its hosting workload—may require bootstrap independent from workload identity.

The platform must eventually answer:

```text
Who created the logical principal?

Who approved its identity?

Which workload may host it?

How is the logical actor bound to that workload?

Can that binding change?

Who may revoke the binding?
```

Workload authentication alone does not answer these questions.

ADR-0002 governs when a separate logical actor identity is required.

---

## 30. AI-Agent Registration

AI-agent registration must not be treated as automatic authorization.

Conceptually:

```text
Agent Definition
      │
      ▼
Principal Registration
      │
      ▼
Identity Binding
```

does not imply:

```text
unrestricted authority
```

Delegated authority remains a separate architecture concern.

A registered agent may legitimately possess no resource authority.

---

## 31. Agent-to-Runtime Binding

When logical actor identity is distinct from workload identity, bootstrap must establish a binding such as:

```text
Logical Agent
      │
      │ authorized binding
      ▼
Hosting Workload
```

Future architecture must define:

* Who creates the binding
* What evidence validates it
* Whether it is one-to-one or many-to-many
* How long it lasts
* How it is revoked
* Whether migration requires re-binding

No binding protocol is selected by this document.

---

## 32. Federation Bootstrap

Before two trust domains federate, the first cross-domain acceptance relationship must itself be established.

Conceptually:

```text
Domain A
      │
      │ verified trust material
      ▼
Domain B
```

Bootstrap must determine:

* Who approved the peer
* How peer identity was verified
* How initial trust material was obtained
* Which namespaces are accepted
* Which assertion types are accepted
* What purpose is permitted
* How the relationship is revoked

Federation metadata obtained over a network must not be accepted solely because a URL responded successfully.

---

## 33. Federation Bootstrap and Authorization

Establishing authentication federation does not establish authorization federation.

Bootstrap may establish:

```text
Domain B accepts
identity assertions from Domain A
```

without establishing:

```text
Domain A may define
resource authority in Domain B
```

Authorization remains local unless explicitly federated through a separately governed architecture.

ADR-0003 governs this distinction.

---

## 34. Attestation-Verifier Bootstrap

A Relying Party that consumes Attestation Results must first determine why a particular Verifier is accepted.

Bootstrap questions include:

* Verifier identity
* Verification keys
* Verifier operator
* Appraisal policy
* Accepted evidence types
* Accepted endorsement authorities
* Scope of acceptable results
* Revocation

A signed Attestation Result is useful only after this trust relationship is established.

Reference:

[IETF RFC 9334 — RATS Architecture](https://www.rfc-editor.org/rfc/rfc9334.html)

---

## 35. Provenance Bootstrap

Supply-chain provenance also requires bootstrap.

A consumer must establish why it accepts:

* A signer
* A builder
* A transparency service
* A registration authority
* A provenance format

Example:

```text
signed provenance
      │
      ▼
signature verifies
```

does not establish:

```text
signer was authorized
to make this statement
```

Signer authority and verification material must themselves be bootstrapped.

---

## 36. Policy Bootstrap

Policy systems contain their own bootstrap dependency.

The platform must answer:

```text
Who is permitted to create the first policy?

Who may modify it?

Which policy source is authoritative?

How does the evaluator verify policy integrity?

What happens if policy and identity bootstrap disagree?
```

A securely authenticated principal can still receive incorrect authority if the policy source was improperly bootstrapped.

---

## 37. Bootstrap Scope

Bootstrap authority must be limited to the security function it is intended to establish.

Example:

```text
node enrollment credential
```

should not automatically become:

```text
application authorization credential
```

Likewise:

```text
federation bootstrap
```

should not automatically grant:

```text
cross-domain administrative authority
```

Scope must remain explicit.

---

## 38. Bootstrap Closure

A bootstrap mechanism must have a defined transition into routine operation.

Questions include:

* Is the bootstrap credential destroyed?
* Does it expire?
* Can it be replayed?
* Is it reusable?
* Does routine authentication replace it?
* Must bootstrap be repeated after restart?
* What audit evidence records completion?

A bootstrap pathway that remains silently reusable can become a persistent alternative authentication path.

---

## 39. Continuous Bootstrap Evidence

Some evidence originally used for bootstrap may also be continuously re-evaluated.

Examples could include:

* Platform identity
* Runtime properties
* Attestation
* Device state

The architecture must distinguish:

```text
initial bootstrap evidence
```

from:

```text
continuously evaluated trust evidence
```

The same evidence source may participate in both, but the security purpose differs.

---

## 40. Re-Bootstrap

A principal or trust relationship may need to be bootstrapped again.

Triggers may include:

* Credential loss
* Trust-anchor rotation
* Platform migration
* Node replacement
* Federation change
* Administrative ownership change
* Compromise
* Identity recovery

Re-bootstrap must not automatically inherit all assumptions from the previous relationship.

---

## 41. Re-Binding

Re-binding occurs when a logical principal must be associated with new evidence, execution infrastructure, or identity material.

Example:

```text
Logical Agent
      │
      │ old binding
      ▼
Runtime A

migration

Logical Agent
      │
      │ new binding
      ▼
Runtime B
```

The system must determine what authority permits that re-binding.

Migration alone must not implicitly authorize a new binding.

---

## 42. Compromise Recovery

Bootstrap architecture must include recovery from compromise.

For each bootstrap authority or mechanism, the platform must ask:

```text
If this bootstrap dependency is compromised,
how do we establish trustworthy state again?
```

Recovery may require:

* Revoking credentials
* Removing registrations
* Replacing trust anchors
* Re-establishing federation
* Re-attesting infrastructure
* Re-registering principals
* Restoring policy from trusted state

The exact mechanism is implementation-specific.

---

## 43. Trust-Anchor Recovery

Replacing a compromised trust anchor is itself a bootstrap event.

The architecture must answer:

* Who authorizes the replacement?
* How is the new anchor authenticated?
* How do relying systems receive it?
* How is the old anchor removed?
* How are previously issued credentials handled?
* How is the event audited?

A compromised root cannot securely authenticate its own replacement without another independently trusted recovery mechanism.

---

## 44. Recovery Authority

Recovery authority can become one of the most powerful authorities in the platform.

A recovery actor may be capable of changing:

* Trusted roots
* Identity mappings
* Federation
* Policy
* Registration

Therefore recovery authority must be modeled independently rather than hidden as an operational procedure.

---

## 45. Break-Glass Bootstrap

Emergency recovery may require a break-glass mechanism.

Such a mechanism must not be assumed safe merely because it is rarely used.

Future implementation must consider:

* Strong authorization
* Multiple-party approval where appropriate
* Limited scope
* Audit
* Post-use review
* Credential rotation
* Re-disablement after use

No break-glass mechanism is selected by this document.

---

## 46. Bootstrap Failure

Bootstrap can fail because:

* Evidence cannot be validated
* Authority is unavailable
* Registration is missing
* Trust anchor is unavailable
* Evidence is stale
* Policy conflicts
* External platform is unavailable
* Federation material cannot be verified

Failure behavior must be explicit.

A candidate should not silently receive a weaker identity because stronger bootstrap evidence is unavailable.

---

## 47. Bootstrap Downgrade

The platform should prevent silent downgrade from stronger bootstrap requirements to weaker alternatives.

Example:

```text
hardware-backed enrollment unavailable
        │
        ▼
automatically accept static token
```

may undermine the intended assurance.

Fallback mechanisms must be deliberate policy decisions.

---

## 48. Bootstrap Audit Evidence

Bootstrap events should eventually record enough information to reconstruct:

* Candidate principal
* Resulting identity
* Evidence used
* Bootstrap mechanism
* Verifier
* Eligibility policy
* Registration record
* Trust authority
* Trust anchor
* Administrator or automation involved
* Time
* Outcome
* Resulting credential or relationship identifier

Bootstrap is security-sensitive state change and should be auditable.

---

## 49. Scenario A — First SPIRE Agent

Conceptual sequence:

```text
Candidate Agent
      │
      │ bootstrap evidence
      ▼
SPIRE Server
      │
      │ successful node attestation
      ▼
Agent identity / SVID
      │
      ▼
Routine authenticated relationship
```

SPIRE can use multiple node-attestation mechanisms, including one-use join tokens, existing certificates, platform identity, and hardware-backed methods.

Reference:

[SPIRE — Configuring SPIRE](https://spiffe.io/docs/latest/deploying/configuring/)

Architectural lesson:

> The mechanism changes the initial trust dependency; it does not eliminate bootstrap.

---

## 50. Scenario B — First Workload Identity

```text
New workload
      │
      ▼
Local workload observation
      │
      ▼
Selectors / properties
      │
      ▼
Registration match
      │
      ▼
SPIFFE ID
      │
      ▼
SVID
```

The resulting SVID proves possession of the issued workload identity.

The bootstrap reasoning remains:

```text
Why did these properties
justify this identity?
```

Reference:

[SPIRE — Registering Workloads](https://spiffe.io/docs/latest/deploying/registering/)

---

## 51. Scenario C — First AI-Agent Principal

```text
Agent definition created
      │
      ▼
Principal registration
      │
      ▼
Logical identity established
      │
      ▼
Binding to hosting workload
```

Required questions include:

* Who created the principal?
* Who approved it?
* What makes the hosting workload eligible?
* Can the same agent bind elsewhere?
* How is the binding revoked?

No authorization is implied merely by completing registration.

---

## 52. Scenario D — First Trust Anchor Installation

```text
New relying system
      │
      ▼
Trust anchor installed
      │
      ▼
Credential validation enabled
```

The critical bootstrap event is not the first certificate validation.

It is the decision to install and accept the anchor.

That event must have identifiable governance and recovery authority.

---

## 53. Scenario E — New Federation Partner

```text
Partner Domain
      │
      │ trust metadata
      ▼
Local Domain
      │
      ▼
Federation relationship
```

Before accepting the metadata, the local domain must establish:

* Partner identity
* Source authenticity
* Accepted namespaces
* Scope
* Purpose
* Governance approval

The federation relationship must be independently revocable.

---

## 54. Scenario F — External Attestation Verifier

```text
External Verifier
      │
      │ signed Attestation Results
      ▼
Local Relying Party
```

Before use, the local system must bootstrap trust in:

* Verifier identity
* Verification material
* Appraisal policy
* Accepted claims
* Operational authority

Otherwise valid signatures only prove possession of an untrusted key.

---

## 55. Scenario G — Platform Migration

A workload moves from one execution environment to another.

```text
Environment A
      │
      ▼
Logical Workload
      │
      ▼
Environment B
```

The platform must determine whether:

* Existing identity is portable
* New bootstrap is required
* Old registration remains valid
* New attestation is required
* Existing delegation survives
* Old environment must be revoked

Migration must not silently inherit trust assumptions.

---

## 56. Scenario H — Bootstrap Authority Compromise

Suppose the registration authority is compromised.

An attacker creates a fraudulent workload registration.

```text
Compromised registration authority
       │
       ▼
fraudulent eligibility
       │
       ▼
valid credential issuance
       │
       ▼
attacker authenticates successfully
```

The credential system may operate exactly as designed while the security outcome is wrong.

This demonstrates why registration governance is part of bootstrap trust.

---

## 57. Bootstrap Invariants

The following are proposed Sprint 1 invariants.

### BT-01

Every material trust relationship must have an identifiable bootstrap basis.

### BT-02

Bootstrap mechanisms must be scoped to the trust function they establish.

### BT-03

Registration must not be treated as current proof of runtime identity.

### BT-04

Routine credential strength must not be used to conceal weak or incorrect initial identity binding.

### BT-05

Bootstrap evidence must not automatically become permanent application authorization.

### BT-06

Root of trust, trust anchor, trust authority, bootstrap authority, and bootstrap mechanism must remain architecturally distinguishable.

### BT-07

Bootstrap transitions into routine operation must be explicit.

### BT-08

Bootstrap mechanisms must have defined compromise and recovery behavior.

### BT-09

Cross-domain federation bootstrap must establish scope and purpose independently from local authorization.

### BT-10

Logical-principal-to-runtime binding must have an explicit establishment and revocation mechanism when those identities are separate.

### BT-11

Silent downgrade to weaker bootstrap evidence is prohibited unless explicitly permitted by policy.

### BT-12

Bootstrap and re-bootstrap events must be auditable where they alter security-relevant trust state.

These remain proposed until incorporated into the Sprint 1 Security Invariants artifact.

---

## 58. Candidate Architecture Decision

This model produces a candidate decision:

> **Bootstrap trust must be explicit, function-scoped, auditable, and recoverable, and bootstrap evidence or credentials must not become standing application authority merely because they successfully established an initial identity or trust relationship.**

A second related principle is:

> **The assurance of routine identity depends on the correctness of its initial binding; stronger routine cryptography does not repair an incorrectly established bootstrap relationship.**

These decisions are not yet accepted.

ADR treatment will be evaluated after scenario validation.

---

## 59. Open Questions

1. Which bootstrap mechanisms should the platform support for workload identity?
2. Which bootstrap mechanisms require hardware-backed evidence?
3. What assurance levels should different resources require?
4. Who owns workload registration?
5. Who approves logical AI-agent creation?
6. How is an agent bound to a hosting workload?
7. How should bootstrap evidence expire?
8. When is re-bootstrap mandatory?
9. How should trust-anchor replacement be authenticated after compromise?
10. Which recovery actions require multi-party approval?
11. How should federation trust material be authenticated initially?
12. Can an external attestation verifier participate in initial identity bootstrap?
13. Which bootstrap events require immutable or independently verifiable audit evidence?
14. Which bootstrap mechanisms can operate during control-plane outage?
15. How should bootstrap work across disconnected environments?
16. Should bootstrap authority be administratively separated from routine identity issuance?
17. How should provenance influence workload eligibility?
18. What constitutes sufficient evidence for identity re-binding after migration?

---

## 60. Architecture Decisions Not Made

This document does not select:

* SPIFFE/SPIRE node attestor
* SPIFFE/SPIRE deployment
* Join-token bootstrap
* Cloud instance identity
* TPM
* TEE
* Hardware endorsement hierarchy
* Certificate authority
* Enrollment protocol
* Agent identity protocol
* Federation protocol
* Recovery technology
* Policy engine

Those technologies must be evaluated against the bootstrap requirements defined here.

---

## 61. Task 4 Exit Criteria

The Bootstrap Trust Model is ready for acceptance when it can explain:

* Bootstrap trust
* Root of trust
* Trust anchor
* Trust authority
* Bootstrap authority
* Bootstrap credential
* Bootstrap evidence
* Registration
* Eligibility
* Initial identity binding
* Bootstrap assurance
* Routine-operation transition
* Workload bootstrap
* Node bootstrap
* Logical-agent bootstrap
* Federation bootstrap
* Attestation-verifier bootstrap
* Re-bootstrap
* Trust-anchor recovery
* Compromise recovery
* Failure behavior
* Downgrade prevention
* Bootstrap auditability
* Required validation scenarios

Consequential architecture decisions must be evaluated separately for ADR treatment.

---

## References

NIST, *Roots of Trust*
https://csrc.nist.gov/projects/hardware-roots-of-trust

NIST CSRC, *Roots of Trust Glossary*
https://csrc.nist.gov/glossary/term/roots_of_trust

Trusted Computing Group, *What Is a Root of Trust?*
https://trustedcomputinggroup.org/about/what-is-a-root-of-trust-rot/

SPIFFE/SPIRE, *SPIRE Concepts*
https://spiffe.io/docs/latest/spire-about/spire-concepts/

SPIFFE/SPIRE, *Configuring SPIRE*
https://spiffe.io/docs/latest/deploying/configuring/

SPIFFE/SPIRE, *Registering Workloads*
https://spiffe.io/docs/latest/deploying/registering/

IETF, *RFC 5280 — Internet X.509 Public Key Infrastructure Certificate and CRL Profile*
https://www.rfc-editor.org/rfc/rfc5280.html

IETF, *RFC 6024 — Trust Anchor Management Requirements*
https://www.rfc-editor.org/rfc/rfc6024.html

IETF, *RFC 9334 — Remote ATtestation procedureS (RATS) Architecture*
https://www.rfc-editor.org/rfc/rfc9334.html
