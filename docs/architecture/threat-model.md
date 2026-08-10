# Autonomous Trust Platform — Threat Model

**Status:** Accepted
**Accepted Date:** 2026-08-09
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Artifact Owner:** Trust Platform — Control Plane
**Architecture Domain:** Threats to identity, trust, bootstrap, attestation, delegated authority, authorization, enforcement, federation, recovery, and auditability

---

## 1. Purpose

This document defines the architecture-level threat model for the Autonomous Trust Platform.

Its purpose is to identify how malicious actors, compromised authorities, incorrect configuration, failed components, or unsafe composition of otherwise valid security mechanisms could violate the trust properties established by the platform architecture.

The threat model is derived from the accepted architecture rather than from a generic threat checklist.

It evaluates threats against:

* Principals
* Identity
* Authentication
* Credentials
* Bootstrap trust
* Trust anchors
* Trust authorities
* Attestation
* Delegated authority
* Authorization
* Policy
* Enforcement
* Federation
* Recovery
* Audit evidence

No implementation technology is selected by this document.

---

## 2. Scope

This threat model covers architecture established by:

* Platform Charter
* Principal Model
* Trust Boundary Model
* Bootstrap Trust Model
* Delegated Authority Model
* ADR-0002
* ADR-0003
* ADR-0004
* ADR-0005

The model includes threats against future implementations of these concepts.

It does not claim that the described controls are already implemented or enforced.

---

## 3. Governing Question

For every material trust relationship, the platform must be able to ask:

> **How could an attacker, compromised authority, faulty system, or failed dependency cause the platform to accept an incorrect identity, incorrect trust conclusion, excessive authority, unauthorized action, misleading audit record, or unsafe degraded mode?**

The threat model must also answer:

> **Which accepted architecture rule is intended to constrain that threat, what remains unimplemented, and what residual risk survives even if the architecture is followed correctly?**

---

## 4. Threat, Vulnerability, Failure, and Risk

The architecture distinguishes:

```text
Threat
    ≠
Vulnerability
    ≠
Failure
    ≠
Risk
```

A **threat** is a potential circumstance or actor capable of violating a security property.

A **vulnerability** is a weakness that may permit a threat to succeed.

A **failure** is an incorrect or unavailable system condition that may occur without malicious activity.

**Risk** combines the potential impact of an adverse event with its likelihood or plausibility in a particular implementation and environment.

This document primarily identifies threats and failure conditions.

Quantitative risk scoring is deferred until implementation architecture provides enough operational context.

---

## 5. Compromise Versus Availability Failure

Compromise and unavailability must remain separate.

For example:

```text
Identity Issuer Compromised
        ≠
Identity Issuer Unavailable
```

Compromise may produce valid-looking fraudulent identities.

Unavailability may prevent legitimate identity issuance or validation.

Likewise:

```text
Revocation Service Compromised
```

may provide incorrect state, while:

```text
Revocation Service Unavailable
```

creates uncertainty about authority validity.

Different failure classes require different responses.

---

## 6. Security Properties Under Protection

The threat model protects the following architecture properties.

### SP-01 — Principal Integrity

Security-relevant identity must correspond to the intended principal.

### SP-02 — Identity-Binding Integrity

The principal-to-identity relationship must be established through valid bootstrap and eligibility processes.

### SP-03 — Trust-Scope Integrity

Trust must remain limited to its intended authority, evidence type, purpose, and trust domain.

### SP-04 — Authority Provenance

Exercised authority must originate from a legitimate authority source and valid delegation chain.

### SP-05 — Non-Amplification

Delegation and redelegation must not create additional authority without an independent legitimate authority source.

### SP-06 — Authorization Sovereignty

Protected resources remain governed by their intended authorization domain.

### SP-07 — Enforcement Integrity

Authorization decisions must actually constrain actions.

### SP-08 — Recovery Integrity

Compromised trust foundations must be recoverable through an independently trustworthy basis.

### SP-09 — Audit Integrity

Security-relevant actions and authority chains must remain attributable and reconstructable.

### SP-10 — Failure Containment

Failure of one security function must not silently increase authority or compromise unrelated trust functions.

---

## 7. Assets and Security-Relevant Relationships

Threat modeling applies not only to data and credentials but also to security relationships.

Material assets include:

* Principal identities
* Principal-to-runtime bindings
* Registration records
* Eligibility policy
* Credentials
* Issuer keys
* Trust anchors
* Trust bundles
* Attestation evidence
* Attestation Results
* Reference values
* Endorsements
* Delegation grants
* Delegation provenance
* Authorization policy
* Authorization decisions
* Enforcement configuration
* Federation configuration
* Revocation state
* Recovery mechanisms
* Audit evidence

---

## 8. Threat Sources and Adverse Actors

Potential threat actors include:

### External Attacker

An actor without legitimate platform authority attempting to gain access or influence trust decisions.

### Compromised Principal

A legitimate principal whose credential, runtime, or execution context has been compromised.

### Malicious Insider

A human or administrative actor intentionally abusing legitimate access.

### Compromised Trust Authority

An identity issuer, verifier, policy authority, delegation authority, federation authority, or other accepted authority under attacker control.

### Compromised Administrator

An actor able to modify registration, policy, trust anchors, federation, or recovery configuration.

### Malicious Federation Partner

An external domain that intentionally produces fraudulent assertions or exceeds agreed scope.

### Faulty Component

A non-malicious component producing incorrect results because of defect, stale state, or misconfiguration.

### Supply-Chain Adversary

An attacker influencing software, provenance, configuration, keys, or deployment artifacts before runtime.

### Autonomous Principal Acting Incorrectly

A legitimate software principal, including an AI agent, that selects an unsafe action while remaining within its own execution process.

The architecture must constrain the authority of such principals independently of assumptions about model intent or reliability.


### Explicit distinctions

Explicit distinction between intentional adversaries, compromised legitimate components/principals, and non-adversarial failures or unsafe behavior.

A compromised issuer, for example, is a legitimate authority operating under adversarial control; a faulty verifier may simply be wrong without attacker control.

---

## 9. Evidence Status

Every mitigation in this threat model must be classified accurately.

Possible evidence states include:

```text
Architectural Requirement
Implemented
Tested
Observed
Researched
Proposed
Future
```

At this stage, most mitigations are:

> **Architectural Requirement**

They must not be described as implemented controls unless implementation evidence exists.

---

## 10. Threat Record Schema

Each material threat should eventually be represented using:

```text
Threat ID
Threat Family
Event Type
Adversarial
Compromise
Non-Adversarial Failure
Semantic Misuse
Governance / Configuration Failure
Security Property
Target Asset / Relationship
Threat Actor
Preconditions
Attack Path
Trust Boundary Crossed
Violated Architecture Rule
Potential Impact
Existing Architectural Requirement
Implementation Status
Detection / Evidence Requirement
Recovery Requirement
Residual Risk
Future Control Requirement
```

This schema connects threats directly to architecture and future validation.

---

## 11. Trust-Boundary Principle

Threats often become meaningful when assumptions cross security boundaries.

Relevant boundary questions include:

* Which authority produced the assertion?
* Which relying party accepts it?
* Which trust anchor supports validation?
* Which authorization domain makes the final decision?
* Which enforcement component applies it?
* Which administrative authority may alter the relationship?

Deployment topology alone must not define threat boundaries.

---

## 12. Threat Family T1 — Principal and Identity Threats

This family threatens principal integrity and identity-binding integrity.

Primary targets include:

* Logical principal identity
* Workload identity
* Infrastructure identity
* Principal-to-runtime binding
* Credential possession
* Identity namespace

---

## 13. T1-01 — Incorrect Principal-to-Identity Binding

An attacker or faulty registration process causes the system to bind the wrong principal to a legitimate identity.

Example:

```text
Attacker Workload
      ↓
Fraudulent Eligibility
      ↓
payments/processor identity
      ↓
Valid Credential
```

The credential system may operate correctly while the security result is wrong.

### Violated Properties

* SP-01 Principal Integrity
* SP-02 Identity-Binding Integrity

### Existing Architecture Requirement

ADR-0004 requires identity assurance to depend on correctness of the initial principal-to-identity binding.

### Implementation Status

Architectural requirement only.

---

## 14. T1-02 — Credential Theft

An attacker obtains a credential representing a legitimate principal.

Potential consequences include:

* Principal impersonation
* Unauthorized authentication
* Access using stale authority assumptions
* Misleading audit attribution

A stolen credential may still pass cryptographic validation.

### Required Controls

Future implementation may require:

* Short credential lifetime
* Proof of possession
* Key protection
* Revocation
* Runtime binding
* Anomaly detection

No mechanism is selected here.

---

## 15. T1-03 — Actor-to-Runtime Spoofing

A logical software principal is falsely associated with a runtime that is not legitimately hosting it.

Example:

```text
Agent A
   claimed to run on
Workload X

actual runtime:
Workload Y
```

This threatens ADR-0002's distinction between logical principal and hosting workload.

---

## 16. T1-04 — Compromised Identity Issuer

An attacker controls an accepted identity issuer and creates cryptographically valid fraudulent identities.

Conceptually:

```text
Compromised Issuer
      ↓
Valid Signature
      ↓
Fraudulent Credential
```

Strong cryptography cannot compensate for a compromised trusted issuer.

### Required Analysis

The platform must determine:

* Which identities become unreliable
* How issuer trust is revoked
* How affected credentials are identified
* Whether unrelated authorities remain trustworthy

---

## 17. T1-05 — Namespace Collision or Misbinding

Two principals are incorrectly represented under indistinguishable identity semantics.

Potential causes include:

* Namespace reuse
* Ambiguous identity mapping
* Federation configuration error
* Logical actor identity collapsed into workload identity

The principal model requires identity boundaries where authority, lifecycle, policy, revocation, or accountability differ.

---

## 18. Threat Family T2 — Bootstrap and Root-of-Trust Threats

Bootstrap threats attack the basis from which initial trust is established.

Primary targets include:

* Registration
* Enrollment
* Bootstrap credentials
* Trust-anchor installation
* Recovery authority
* Hardware roots of trust
* Cloud platform identity

---

## 19. T2-01 — Fraudulent Registration

A compromised administrator or registration system creates eligibility data for an attacker-controlled principal.

Example:

```text
Compromised Registration Authority
        ↓
Fraudulent Registration
        ↓
Correct Attestation
        ↓
Valid Credential
        ↓
Attacker Authenticates Successfully
```

The failure occurs upstream of routine credential issuance.

---

## 20. T2-02 — Bootstrap Credential Replay

A token, enrollment credential, platform assertion, or other bootstrap artifact is reused outside its intended context.

Threat dimensions include:

* Reuse after enrollment
* Use by a different principal
* Use against another server
* Use after expected expiration

Bootstrap closure must define whether and when such artifacts remain valid.

---

## 21. T2-03 — Trust-Anchor Substitution

Trust-anchor substitution is distinct from compromise of the private signing authority whose public trust material is already trusted.

In the first case, the relying system's configured validation basis has been changed.

In the second case, the configured trust material may remain unchanged while the authority behind it has been compromised.

Both conditions can produce successful cryptographic validation of attacker-controlled artifacts, but they require different detection, containment, and recovery paths.

An attacker replaces trusted verification material.

Example:

```text
Attacker Key
      ↓
installed as trusted root
      ↓
fraudulent credentials validate
```

Cryptographic validation succeeds because the attacker altered the validation basis.

Trust-anchor modification authority is therefore part of the threat surface.

---

## 22. T2-04 — Bootstrap Downgrade

A strong bootstrap mechanism becomes unavailable and the system silently accepts weaker evidence.

Example:

```text
Hardware-Backed Bootstrap
      unavailable
          ↓
Static Token Automatically Accepted
```

ADR-0004 prohibits silent downgrade unless explicitly authorized by policy.

---

## 23. T2-05 — Recovery Authority Compromise

An attacker controls the authority responsible for recovering identity, trust anchors, federation, or registration.

Recovery authority may be more powerful than routine operational authority.

Potential impacts include:

* Replacing trust anchors
* Rebinding identities
* Restoring attacker-controlled registrations
* Re-establishing malicious federation

Recovery authority must remain explicitly governed.

---

## 24. T2-06 — Circular Recovery

A compromised trust basis is used as the sole mechanism to authenticate its own replacement.

Conceptually:

```text
Compromised Root
      ↓
authenticates
      ↓
Replacement Root
```

This does not re-establish trustworthy state.

ADR-0004 requires an independently trusted recovery basis where compromise invalidates the existing basis.

---

## 25. Threat Family T3 — Attestation Threats

Attestation threats affect the correctness or interpretation of evidence about runtime or platform state.

Targets include:

* Evidence
* Endorsements
* Reference values
* Verifier
* Appraisal policy
* Attestation Results

---

## 26. T3-01 — Forged or Manipulated Evidence

An attacker attempts to produce evidence that falsely represents runtime or hardware state.

Future controls may rely on:

* Cryptographic evidence protection
* Hardware-backed keys
* Freshness mechanisms
* Verifier validation

No implementation mechanism is selected here.

---

## 27. T3-02 — Stale or Replayed Evidence

Previously valid evidence is reused after system state has changed.

Example:

```text
Trusted State at T1
      ↓
Evidence Recorded

System Compromised at T2
      ↓
Old Evidence Replayed
```

The relying system may incorrectly conclude that the current state is trustworthy.

---

## 28. T3-03 — Compromised Verifier

A Relying Party trusts Attestation Results produced by a compromised Verifier.

Potential outcomes include:

* Fraudulent appraisal
* Acceptance of invalid evidence
* Suppression of adverse evidence
* Misleading trust conclusions

The Relying Party must govern trust in the Verifier independently.

---

## 29. T3-04 — Malicious or Incorrect Appraisal Policy

Evidence may be valid while appraisal rules are unsafe.

Example:

```text
Evidence:
correct

Verifier Policy:
accept vulnerable configuration
```

Cryptographic validity of evidence does not establish correctness of appraisal policy.

---

## 30. T3-05 — Reference-Value or Endorsement Compromise

An attacker modifies trusted reference values or endorsement data.

The Verifier may then correctly evaluate evidence against an incorrect trusted baseline.

These authorities must therefore be included in trust-anchor and governance analysis.

---

## 31. T3-06 — Attestation Overreach

The system treats valid attestation as establishing properties it does not prove.

Examples:

```text
attestation evidence, by itself
          ≠
principal identity establishment
```

```text
attestation evidence, by itself
          ≠
delegated authority
```

```text
attestation evidence, by itself
          ≠
authorization
```

Attestation evidence may participate in identity bootstrap, identity validation, or authorization policy when an explicit architecture defines that relationship. The threat is assigning attestation conclusions security semantics beyond what the evidence and governing trust relationship actually establish.

---

## 32. Threat Family T4 — Delegated-Authority Threats

This family threatens authority provenance, bounded scope, non-amplification, and revocation.

---

## 33. T4-01 — Authority Amplification

A delegation chain grants more authority than the delegator was permitted to delegate.

Example:

```text
A may delegate:
read

B receives:
read

B grants C:
admin
```

ADR-0005 prohibits authority amplification.

### Implementation Status

Architectural requirement only.

---

## 34. T4-02 — Unauthorized Redelegation

A delegate grants authority onward despite redelegation being prohibited.

ADR-0005 establishes:

> Redelegation is denied by default.

Every delegation edge must validate redelegation permission.

---

## 35. T4-03 — Delegation Issuer Overreach

A token service or delegation issuer creates grants outside the authority permitted by the actual delegator or authority source.

This threat exploits confusion between:

```text
delegation issuer
        ≠
delegator
        ≠
authority source
```

The issuer must not become an implicit universal authority source.

---

## 36. T4-04 — Delegation Replay

A valid delegation artifact is reused outside its intended context.

Potential replay dimensions include:

* Different audience
* Different resource
* Different transaction
* Different principal
* Different time window

Audience binding, proof of possession, lifetime, and transaction context may mitigate replay.

---

## 37. T4-05 — Confused Deputy

A principal with legitimate authority is induced to exercise that authority for a requester lacking entitlement.

Example:

```text
Unauthorized Requester
       ↓
Powerful Service
       ↓
Protected Resource
```

The service's own authority must not silently substitute for requester authority where requester-specific authorization is required.

---

## 38. T4-06 — Ambient Host Authority

A logical agent automatically inherits the entire authority of its hosting workload.

Example:

```text
Workload:
cloud-admin

Agent:
invoice-read
```

If the agent can directly exercise `cloud-admin`, logical authority boundaries collapse into runtime privilege.

ADR-0005 requires Host Workload Authority and Agent Authority to remain distinguishable.

---

## 39. T4-07 — Stale Delegation Artifact

A delegation artifact remains cryptographically valid after its sole underlying authority basis has been withdrawn.

ADR-0005 requires:

```text
valid artifact
      ≠
still-valid underlying authority
```

Derived authority must be re-evaluated.

---

## 40. T4-08 — Unsafe Authority Composition

A principal receives grants from several authority sources and the authorization system automatically unions them.

Example:

```text
Grant A:
read resource X

Grant B:
write resource Y
```

Unsafe composition may produce authority neither source intended to create in combination.

Authority composition must be explicit.

---

## 41. Threat Family T5 — Authorization and Policy Threats

Authorization threats target the decision about whether a requested action is permitted.

---

## 42. T5-01 — Policy-Authority Compromise

An attacker modifies authorization or delegation policy.

Potential results include:

* Unauthorized access
* Excessive delegation
* Disabled constraints
* Expanded redelegation
* Changed failure behavior

Policy administration authority is independently security relevant.

---

## 43. T5-02 — Authorization Bypass

A protected action occurs without the intended authorization decision.

Possible causes include:

* Direct resource path
* Misconfigured enforcement
* Alternate API
* Internal service trust assumption
* Cached authorization state

Correct identity and policy cannot compensate for bypassed authorization.

---

## 44. T5-03 — Stale Authorization Context

Authorization uses outdated:

* Identity state
* Delegation state
* Revocation state
* Attestation state
* Policy
* Resource context

The decision may have been correct for an earlier state but incorrect for the current request.

---

## 45. T5-04 — Identity Treated as Authorization

An authenticated identity is automatically granted resource authority.

This violates the platform rule:

```text
authentication
      ≠
authorization
```

---

## 46. T5-05 — Federation Imports Authority Implicitly

An authenticated identity from an external trust domain is automatically given local resource authority.

ADR-0003 and ADR-0005 require local authorization sovereignty unless authorization authority is explicitly federated.

---

## 47. Threat Family T6 — Trust-Domain and Federation Threats

This family threatens explicit, directional, purpose-scoped cross-domain trust.

---

## 48. T6-01 — Compromised Federation Partner

A trusted external identity issuer or delegation authority becomes compromised.

The receiving domain may observe:

```text
cryptographically valid
but fraudulent
external assertion
```

The platform must determine which locally accepted conclusions depend on that authority.

---

## 49. T6-02 — Federation Metadata Substitution

An attacker replaces federation trust material or metadata.

Potential results include:

* Attacker-controlled keys trusted
* Wrong namespace accepted
* Wrong partner accepted
* Unauthorized assertions validated

Initial federation bootstrap and subsequent updates must both be governed.

---

## 50. T6-03 — Implicit Trust Transitivity

A domain accepts C because trusted partner B trusts C without an explicitly governed chaining relationship.

ADR-0003 requires implicit trust transitivity to be prohibited.

Explicit validation or delegation chains must define their own semantics and scope.

---

## 51. T6-04 — Cross-Domain Scope Expansion

An assertion accepted for one purpose becomes accepted for another.

Example:

```text
External identity accepted
for authentication
      ↓
implicitly trusted
for local administrative authority
```

Trust remains function- and purpose-scoped.

---

## 52. Threat Family T7 — Enforcement Threats

Authorization is meaningful only if an enforcement mechanism makes the decision effective.

---

## 53. T7-01 — Enforcement Bypass

A caller reaches a protected operation without passing through the intended enforcement point.

Potential causes include:

* Alternate network path
* Direct database access
* Internal endpoint
* Administrative API
* Misconfigured proxy
* Local process privilege

Future implementation must identify complete enforcement coverage.

---

## 54. T7-02 — Decision Ignored

The authorization system correctly returns:

```text
DENY
```

but the application or intermediary still performs the action.

This is an enforcement integrity failure.

---

## 55. T7-03 — TOCTOU Between Decision and Action

Authorization is evaluated against one state, but resource or authority conditions change before enforcement.

Example:

```text
T1:
authority valid

T2:
authority revoked

T3:
previous decision enforced
```

Future designs must determine when re-evaluation is required.

---

## 56. T7-04 — Inconsistent Enforcement

Multiple enforcement points interpret the same authorization semantics differently.

Potential outcomes include:

* One path denies
* Another allows
* Different resource mappings
* Different treatment of delegation

Policy consistency alone does not guarantee enforcement consistency.

---

## 57. Threat Family T8 — Audit and Evidence Threats

Auditability protects reconstruction and accountability rather than preventing every action.

---

## 58. T8-01 — Audit Tampering

An attacker modifies or deletes evidence of:

* Principal identity
* Delegator
* Runtime
* Authorization decision
* Enforcement result
* Trust-anchor change
* Recovery action

Audit integrity may require administrative separation or independent evidence protection.

---

## 59. T8-02 — Authority-Provenance Loss

Audit records show:

```text
Agent A performed action
```

but omit:

* Human delegator
* Authority source
* Delegation chain
* Hosting workload

This may make the action impossible to interpret correctly after the fact.

---

## 60. T8-03 — Identity Collapse in Audit

An on-behalf-of action is recorded as if the delegator directly performed it.

Example:

```text
Actual Actor:
Agent A

Recorded Actor:
Human H
```

This hides autonomous or delegated execution.

---

## 61. T8-04 — Correlated Audit Compromise

The same administrative authority controls both:

* Security-relevant system behavior
* Audit evidence describing that behavior

Compromise may allow an attacker to alter both the action and its evidence.

Independent audit administration may be required where evidence independence matters.

---

## 62. Failure Family T9 — Availability and Degraded-Mode Failures

This family covers security-relevant service failure without assuming malicious compromise.

Targets include:

* Identity services
* Verifiers
* Policy engines
* Revocation systems
* Federation
* Audit destinations

---

## 63. T9-01 — Identity Authority Unavailable

New credentials cannot be issued or renewed.

Potential system responses include:

* Deny new access
* Continue existing sessions
* Use cached identity state
* Enter degraded mode

The correct response is resource- and risk-specific.

---

## 64. T9-02 — Revocation State Unavailable

The system cannot determine whether authority has been revoked.

The platform must not silently interpret uncertainty as increased authority.

Example:

```text
revocation unavailable
        ↓
automatically allow
```

may violate intended authority boundaries.

---

## 65. T9-03 — Attestation Verifier Unavailable

The system cannot obtain current trust evidence.

Potential choices may include:

* Deny
* Use bounded cached result
* Allow lower-risk operation
* Enter degraded mode

No universal behavior is selected here.

---

## 66. T9-04 — Policy Engine Unavailable

The system cannot calculate a fresh authorization decision.

Caching or fallback must not silently expand permissions beyond accepted policy.

---

## 67. T9-05 — Audit Destination Unavailable

The action may be authorized but evidence cannot be durably recorded.

The architecture must eventually define whether:

* Action is blocked
* Evidence is buffered
* Reduced-risk operation continues
* Critical actions are prohibited

Audit availability requirements may vary by operation.

---

## 68. Threat Family T10 — Administrative and Authority-Concentration Threats

This family targets the governance layer that controls security configuration.

---

## 69. T10-01 — Excessive Administrative Authority

One administrator can modify:

* Identity issuance
* Registration
* Trust anchors
* Delegation policy
* Authorization policy
* Enforcement configuration
* Audit evidence

This creates a large correlated compromise path.

---

## 70. T10-02 — Authority Concentration

A single technical control plane operates:

```text
Identity
Attestation
Delegation
Policy
Revocation
Audit
```

without independent governance or recovery boundaries.

Compromise of that control plane may invalidate several supposedly independent trust conclusions simultaneously.

---

## 71. T10-03 — Break-Glass Abuse

Emergency authority bypasses normal controls and becomes a persistent or poorly audited alternate access path.

Future implementation must consider:

* Narrow scope
* Strong authorization
* Multi-party approval where justified
* Expiration
* Post-use review
* Credential rotation
* Audit

---

## 72. T10-04 — Unauthorized Security Configuration Change

An actor modifies:

* Trust bundle
* Policy
* Registration
* Federation
* Delegation scope
* Revocation settings

without legitimate governance approval.

Configuration integrity is therefore part of trust architecture.

---

## 73. Cross-Family Threat — Semantic Confusion

Some of the most dangerous failures occur when valid mechanisms are assigned incorrect meaning.

Examples include:

```text
credential valid
therefore authorized
```

```text
attestation valid
therefore identity established automatically
```

```text
identity federated
therefore local authority granted
```

```text
signed delegation artifact valid
therefore authority basis still exists
```

These failures may not involve broken cryptography.

They arise from incorrect architecture composition.

---

## 74. Cross-Family Threat — Authority Concentration Cascade

One compromised authority may trigger several threat families simultaneously.

Example:

```text
Compromised Control Plane
       ├── fraudulent identity
       ├── policy modification
       ├── delegation issuance
       ├── revocation suppression
       └── audit tampering
```

The platform must analyze correlated rather than only isolated failures.

---

## 75. Cross-Family Threat — Stale State

Many trust decisions depend on state that changes over time.

Examples include:

* Credential validity
* Delegation
* Revocation
* Attestation
* Policy
* Federation
* Resource state

A system may validate an authentic but outdated assertion.

Freshness requirements must be defined per security function.

---

## 76. Scenario A — Fraudulent Workload Registration

```text
Attacker
   ↓
Compromised Registration Authority
   ↓
Fraudulent Registration
   ↓
Workload Attestation
   ↓
Valid SVID
   ↓
Successful Authentication
```

### Architectural Finding

The credential system may function correctly.

The violated property is identity-binding integrity.

### Relevant Decisions

* ADR-0002
* ADR-0004

### Implementation Status

Not yet implemented or tested.

---

## 77. Scenario B — Valid Agent Identity, Excessive Host Privilege

```text
Agent A:
invoice-read

Hosting Workload:
cloud-admin
```

The agent exploits ambient runtime authority to perform administrative action.

### Architectural Finding

Host authority must not automatically become agent authority.

### Relevant Decisions

* ADR-0002
* ADR-0005

---

## 78. Scenario C — Compromised Federation Partner

```text
Domain A Issuer
     compromised
         ↓
fraudulent identity assertion
         ↓
Domain B
```

Domain B can still retain local authorization control.

### Architectural Finding

Authentication federation limits some blast radius only if authorization remains independently governed.

### Relevant Decision

ADR-0003.

---

## 79. Scenario D — Delegation Issuer Manufactures Authority

```text
Authority Source:
read only

Delegation Issuer:
compromised

Issuer creates:
admin grant
```

### Architectural Finding

Artifact issuance authority must not become unlimited delegation authority.

### Relevant Decision

ADR-0005.

---

## 80. Scenario E — Stale Delegation After Revocation

```text
Human H
   ↓
Agent A
   ↓
signed grant

Later:
underlying authority revoked

Grant:
signature still valid
```

### Architectural Finding

Cryptographic validity of the artifact does not preserve withdrawn authority.

### Relevant Decision

ADR-0005.

---

## 81. Scenario F — Compromised Recovery Authority

```text
Recovery Authority
      compromised
         ↓
new trust anchor installed
         ↓
attacker-controlled identities trusted
```

### Architectural Finding

Recovery is itself a privileged bootstrap path.

### Relevant Decision

ADR-0004.

---

## 82. Scenario G — Correct Authorization, Broken Enforcement

```text
Authorization:
DENY

Enforcement:
ignored

Action:
executed
```

### Architectural Finding

Authorization without enforcement does not provide an effective security boundary.

### Future Requirement

Implementation must demonstrate that enforcement covers protected operations.

---

## 83. Scenario H — Revocation Service Outage

```text
Delegation:
possibly revoked

Revocation Service:
unavailable
```

### Architectural Finding

Unavailability is not equivalent to valid authority.

Failure behavior must be explicitly selected according to resource risk.

---

## 84. Scenario I — Audit Authority Shares Compromise Path

```text
Application Admin
     │
     ├── modifies authorization
     └── deletes audit evidence
```

### Architectural Finding

Audit evidence may require independent administrative authority where independent evidence is a security objective.

---

## 85. Scenario J — Attestation Overreach

```text
Valid Attestation Result
       ↓
System concludes:
"principal is authorized"
```

### Architectural Finding

Attestation may contribute evidence but does not inherently establish authorization.

---

## 86. Threat Invariants

The following are accepted architecture-level threat-model invariants.

### TM-01

Successful cryptographic validation must not, by itself, be treated as sufficient evidence that the underlying authority basis or principal-to-identity binding is valid.

### TM-02

A compromised trust authority must trigger analysis of every downstream conclusion that depends on that authority.

### TM-03

Availability failure must remain distinct from authority compromise.

### TM-04

Failure or uncertainty in a trust control must not silently increase authority.

### TM-05

Threat analysis must include administrative and recovery authorities, not only runtime principals.

### TM-06

Identity compromise, authority compromise, policy compromise, and enforcement failure must remain distinguishable.

### TM-07

Attestation evidence must not be assigned identity or authorization semantics it does not establish.

### TM-08

Delegation chains must not amplify authority.

### TM-09

A delegation artifact must not become an independent authority source merely by remaining cryptographically valid.

### TM-10

Cross-domain assertions must remain constrained by the receiving domain's accepted trust and authorization semantics.

### TM-11

Hosting workload authority must not automatically become logical-agent authority.

### TM-12

Audit evidence must preserve actor and authority provenance where those distinctions affect accountability.

### TM-13

Recovery mechanisms must not rely solely on a trust basis whose compromise is the reason recovery is required.

### TM-14

Correlated administrative or technical compromise must be analyzed across trust functions.

### TM-15

Authorization decisions must not be treated as effective security controls unless enforcement actually constrains the protected action.

These invariants are accepted as architecture-level threat-model requirements.

### TM-16

Threat records must distinguish malicious compromise, non-adversarial failure, semantic misuse, and governance/configuration failure where those conditions require different containment, recovery, or evidence.

---

## 87. Architecture Gaps Exposed by Threat Modeling

The threat model exposes future design work rather than resolving every issue.

Areas requiring later architecture include:

* Authorization architecture
* Enforcement-point placement
* Revocation propagation
* Freshness policy
* Audit integrity
* Trust-anchor inventory
* Recovery control
* Attestation verifier governance
* Delegation representation
* Federation update mechanisms
* Administrative separation
* Runtime-to-agent authority isolation

These are not implementation decisions yet.

---

## 88. Relationship to STRIDE

STRIDE may be used later as a coverage check.

Examples include:

* Spoofing → identity threats
* Tampering → policy, registration, audit, trust-anchor threats
* Repudiation → audit and attribution threats
* Information Disclosure → future data-protection modeling
* Denial of Service → availability threats
* Elevation of Privilege → authority amplification and authorization bypass

However, STRIDE does not replace the platform-specific trust model.

The primary classification remains based on violated trust and authority properties.

---

## 89. Residual Risk

Even if all architecture requirements are correctly implemented, residual risk remains.

Examples include:

* Trusted authority behaves maliciously within accepted scope
* Unknown software vulnerabilities
* Hardware defects
* Supply-chain compromise
* Incorrect policy design
* Operator error
* Detection latency
* New attack techniques
* Incorrect business assumptions about authority

The platform cannot eliminate all trust.

Its objective is to make trust explicit, bounded, observable, recoverable, and governable.

---

## 90. Open Questions

1. Which security properties require quantitative risk scoring?
2. Which trust authorities require independent administrative control?
3. Which threats require hardware-backed protections?
4. Which resources require proof-of-possession delegation?
5. How quickly must revocation propagate?
6. How should cached authorization behave during outages?
7. How long may attestation evidence remain fresh?
8. Which audit evidence requires independent cryptographic verification?
9. Which actions must stop when audit infrastructure is unavailable?
10. Which authority changes require multi-party approval?
11. How should compromised federation partners be quarantined?
12. How should trust-anchor replacement propagate safely?
13. Which agent actions require human re-approval?
14. How should host runtime authority be isolated from agent authority?
15. Which authorization decisions must be transaction-bound?
16. How should enforcement consistency be validated?
17. What recovery authority is permitted after control-plane compromise?
18. How should policy rollback be authenticated?
19. Which threat events require automatic credential rotation?
20. How should threat severity be represented across different deployment environments?

---

## 91. Architecture Decisions Not Made

This document does not select:

* SIEM
* IDS
* EDR
* Policy engine
* Authorization engine
* SPIFFE/SPIRE deployment
* Attestation implementation
* TPM
* TEE
* HSM
* PKI vendor
* Federation protocol
* OAuth profile
* Delegation token
* Audit database
* Recovery technology
* Risk-scoring framework

Those choices must be evaluated against the threat model.

---

## 92. Task 6 Exit Criteria

The Threat Model is ready for acceptance when it:

* Identifies protected security properties
* Separates malicious compromise from availability failure
* Defines threat actors
* Covers principal and identity threats
* Covers bootstrap threats
* Covers attestation threats
* Covers delegated-authority threats
* Covers authorization and policy threats
* Covers federation threats
* Covers enforcement threats
* Covers audit threats
* Covers degraded-mode threats
* Covers administrative concentration
* Includes correlated compromise
* Includes semantic misuse of valid mechanisms
* Maps material threats to accepted architecture
* Distinguishes architectural requirements from implemented controls
* Identifies residual risk
* Identifies future architecture gaps
* Includes representative attack scenarios
* Produces threat-model invariants

No ADR is required merely because a threat exists.

ADR treatment will be considered only if Task 6 produces a new consequential architecture decision.

---

## References to Existing Architecture

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/trust-standards-landscape.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`

No accepted architecture decision is superseded by this proposed threat model.
