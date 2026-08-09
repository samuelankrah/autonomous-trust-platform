# ADR-0004: Define Explicit Bootstrap Trust and Identity-Binding Assurance

**Status:** Accepted
**Date:** 2026-08-09
**Decision Owner:** Trust Platform — Control Plane
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Scope:** Bootstrap trust, enrollment, initial identity binding, recovery, re-bootstrap, and bootstrap authority

---

## Context

Every material trust relationship in the Autonomous Trust Platform eventually depends on an initial establishment step.

Before a workload receives a routine identity, before a trust anchor is accepted, before an attestation verifier is trusted, or before two domains federate, the system must rely on some existing authority, evidence, root of trust, policy, registration, or out-of-band assumption.

Routine cryptographic validation does not remove this dependency.

It can only operate after the relevant trust relationship has already been established.

The architecture therefore requires bootstrap trust to be modeled explicitly.

---

## Decision

The Autonomous Trust Platform adopts the following rule:

> **Bootstrap trust must be explicit, function-scoped, auditable, recoverable, and constrained to the security relationship it is intended to establish.**

Bootstrap evidence, enrollment credentials, registration records, hardware evidence, platform identities, or administrative provisioning must not become standing application authority merely because they successfully established an initial trust relationship.

Bootstrap establishes eligibility or trust state.

Authorization remains a separate security decision.

---

## Identity-Binding Assurance

The platform also adopts:

> **The assurance of a routine identity depends on the correctness of the original principal-to-identity binding. Stronger operational cryptography cannot repair an incorrectly established binding.**

Conceptually:

```text
weak or compromised bootstrap
        ↓
incorrect principal-to-identity binding
        ↓
valid short-lived credential
        ↓
successful strong authentication
        ↓
wrong principal strongly authenticated
```

Credential strength and binding correctness are therefore separate properties.

Key length, certificate lifetime, hardware protection, cryptographic algorithm strength, or credential rotation must not be used as evidence that the original identity binding was correct.

---

## Bootstrap Trust

Bootstrap trust is the process through which an initial scoped trust relationship or identity binding is established using evidence, authorities, anchors, policy, or out-of-band assumptions that precede routine trust operation.

Bootstrap does not mean trust from nothing.

It means existing scoped trust is used to establish new scoped trust.

---

## Function-Scoped Bootstrap

Bootstrap is defined relative to the security function being established.

Workload identity bootstrap, node bootstrap, logical-principal bootstrap, PKI trust-anchor bootstrap, attestation-verifier bootstrap, federation bootstrap, policy-authority bootstrap, and provenance bootstrap may rely on different authorities and recovery paths.

The architecture must not assume a single universal bootstrap event or universal root of trust.

---

## Architectural Distinctions

The architecture preserves the following distinction:

```text
root of trust
        ≠
trust anchor
        ≠
trust authority
        ≠
bootstrap authority
        ≠
bootstrap mechanism
        ≠
bootstrap evidence
        ≠
routine credential
```

A root of trust performs a foundational security function.

A trust anchor is locally accepted root information used to begin validation.

A trust authority performs an accepted security function.

A bootstrap authority establishes or approves initial trust.

A bootstrap mechanism performs the establishment process.

Bootstrap evidence supports the establishment decision.

A routine credential is an operational result after successful establishment.

These concepts may interact but must not be collapsed into a single notion of trust.

---

## Registration

Registration describes an expected relationship between properties, eligibility, and identity.

It is not current proof that a running entity possesses those properties.

Therefore:

```text
registered
        ≠
currently verified
```

Identity systems must distinguish configured eligibility from observed runtime evidence.

---

## Eligibility and Binding

Identity issuance must follow an explicit eligibility decision.

Conceptually:

```text
candidate
    ↓
observed evidence
    ↓
verification
    ↓
eligibility policy
    ↓
principal-to-identity binding
    ↓
routine credential
```

The routine credential proves possession of the issued identity material.

It does not independently prove that the eligibility policy, registration, or initial binding was correct.

---

## Bootstrap Credential Scope

Credentials used for enrollment or bootstrap must remain scoped to their bootstrap purpose unless an explicit architecture decision grants broader authority.

For example:

```text
node enrollment credential
        ≠
application authorization credential
```

and:

```text
federation bootstrap credential
        ≠
cross-domain administrative authority
```

Successful enrollment must not silently transform temporary bootstrap capability into standing resource authority.

---

## Transition to Routine Operation

Bootstrap mechanisms must have a defined closure condition.

The architecture must determine when bootstrap is complete, what routine credential or relationship replaces it, whether bootstrap artifacts remain reusable, when they expire, whether replay is possible, and what evidence records completion.

A bootstrap pathway that remains silently reusable constitutes an alternative trust path and must be analyzed as such.

---

## Re-Bootstrap

Re-bootstrap may be required after compromise, platform migration, trust-anchor replacement, credential loss, ownership change, federation change, or identity recovery.

Re-bootstrap must not automatically inherit all previous trust assumptions.

The new relationship must be evaluated against the currently applicable bootstrap requirements.

---

## Recovery

Recovery is itself a bootstrap problem.

A compromised trust anchor, registration authority, identity authority, or bootstrap authority cannot necessarily authenticate its own trustworthy replacement.

The architecture therefore requires an independently trusted recovery basis where compromise of the existing bootstrap dependency would invalidate reliance on that dependency.

Conceptually:

```text
compromised trust basis
        ↓
cannot establish trustworthy replacement
using only that same compromised basis
```

Recovery authority must be modeled as a first-class security authority.

---

## Bootstrap Downgrade

The platform prohibits silent downgrade from stronger bootstrap requirements to weaker alternatives.

For example:

```text
hardware-backed bootstrap unavailable
        ↓
automatically accept weaker static token
```

is not acceptable unless such fallback is explicitly authorized by policy.

Availability failure must not silently redefine identity-assurance requirements.

---

## Federation Bootstrap

Cross-domain trust requires its own bootstrap relationship.

The receiving domain must establish the peer identity, initial trust material, accepted namespaces, accepted assertion types, scope, purpose, governance approval, and revocation model.

Authentication federation does not establish authorization federation.

This decision is consistent with ADR-0003.

---

## Attestation Bootstrap

Attestation evidence does not eliminate bootstrap.

The relying party must first determine why it accepts the Verifier, verification material, appraisal policy, endorsement authorities, and applicable reference values.

A validly signed attestation result is useful only after the relevant verifier trust relationship has been established.

---

## Logical Software Principals and AI Agents

Where ADR-0002 requires logical software identity to be distinct from hosting workload identity, bootstrap must establish the logical-principal-to-runtime binding explicitly.

That binding must identify who is authorized to create it, what evidence supports it, its scope, its lifetime, and how it is revoked or re-established after migration.

Agent registration alone does not imply application authority.

---

## Auditability

Security-relevant bootstrap and re-bootstrap events must be auditable.

Evidence should permit later reconstruction of the candidate principal, resulting identity or trust relationship, bootstrap mechanism, evidence source, verifier, registration or eligibility basis, trust authority, relevant trust anchor, administrative actor or automation, decision outcome, and resulting operational relationship.

Auditability does not itself establish correctness, but it is required for investigation and recovery.

---

## Consequences

This decision makes first trust visible rather than allowing it to remain hidden behind later credential validation.

It also requires future technology evaluations to consider enrollment and recovery architecture, not only operational authentication strength.

Technologies claiming to remove secrets must still identify the trust dependency that replaces the secret.

Hardware-backed identity, cloud instance identity, SPIFFE/SPIRE, PKI, attestation, federation, and provenance systems must therefore be evaluated by both their routine trust properties and their bootstrap properties.

The model introduces additional architecture work because bootstrap authorities, recovery paths, and identity-binding assurance must be explicitly documented.

That complexity is accepted because hidden bootstrap assumptions represent systemic trust risk.

---

## Alternatives Considered

### Treat Successful Credential Issuance as Sufficient Identity Assurance

Rejected.

Credential issuance proves that the issuance process executed successfully. It does not independently prove that the configured eligibility rule or original principal-to-identity binding was correct.

### Treat Bootstrap as an Implementation Detail

Rejected.

Bootstrap determines who or what gains initial entry into a trust system and can therefore influence every later security decision.

### Use a Single Universal Root of Trust

Rejected.

Different trust functions may depend on different roots, authorities, administrators, and recovery mechanisms.

### Explicit Function-Scoped Bootstrap with Independent Recovery

Accepted.

This makes bootstrap dependencies, authority, scope, transition, and compromise recovery analyzable.

---

## Architecture Decisions Not Made

This ADR does not select a SPIRE node-attestation plugin, TPM, TEE, cloud-provider bootstrap mechanism, join token, certificate enrollment protocol, certificate authority, federation protocol, agent-registration protocol, policy engine, recovery technology, or break-glass mechanism.

Those technologies must satisfy the architecture defined here.

---

## Relationship to Existing Decisions

ADR-0002 defines when logical software identity should be distinct from workload identity.

ADR-0003 defines function-scoped trust domains and explicit cross-domain trust.

This ADR defines how initial trust relationships and identity bindings are established within or across those domains.

Together:

```text
ADR-0002
Who requires distinct identity?
        ↓
ADR-0003
Where do trust assumptions change?
        ↓
ADR-0004
How is first trust established?
```

---

## Reversal Conditions

This decision should be reconsidered only if a future architecture can establish identity and trust relationships without an initial authority, evidence source, anchor, root, registration, policy, or external assumption while preserving equivalent identity-binding assurance, compromise recovery, and auditability.

Any replacement must still distinguish correct credential validation from correct principal-to-identity binding.

---

## Related Artifacts

`docs/architecture/platform-charter.md`

`docs/architecture/principal-model.md`

`docs/architecture/trust-boundaries.md`

`docs/architecture/bootstrap-trust.md`

`docs/architecture/trust-standards-landscape.md`

`docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`

`docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`

---

## Outcome

The Autonomous Trust Platform requires bootstrap trust to be explicit, function-scoped, constrained, auditable, and recoverable.

Bootstrap credentials and evidence establish narrowly defined initial relationships and do not inherently grant standing application authority.

The assurance of a routine identity depends on the correctness of the original identity binding, and stronger operational cryptography cannot compensate for an incorrectly established bootstrap relationship.
