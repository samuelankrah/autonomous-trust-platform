# Trust Standards Landscape

Status: Architectural Evaluation  
Decision Status: No technology adoption implied  
Owner: Trust Platform (Control Plane)

## Purpose

This document maps relevant trust, workload identity, attestation,
authorization, credential, and transparency standards into the
Autonomous Trust Platform architecture.

The purpose is to establish conceptual boundaries and track emerging
standards without selecting technologies for implementation.

## Architectural Principle

The Autonomous Trust Platform treats the following as distinct concerns:

- Identity
- Authentication
- Authorization
- Credentials
- Attestation
- Policy
- Trust
- Auditability

No technology or standard should be assumed to provide all of these
functions.

## Trust Architecture Layers

### 1. Execution Root of Trust

Concern:

Establish the underlying environment from which trustworthy evidence
may originate.

Potential mechanisms include:

- Hardware roots of trust
- TPM-based mechanisms
- Trusted Execution Environments
- Platform identity
- Workload and platform attestation mechanisms

No implementation has been selected.

### 2. Attestation and Trust Evidence

Relevant standards:

- RATS
- EAT
- Platform- and workload-attestation mechanisms

Primary concern:

Provide evidence about workload, software, hardware, or execution
environment state and enable that evidence to be appraised.

Attestation is not equivalent to identity or authorization.

### 3. Workload Identity and Logical Actor Binding

Relevant standards and technologies:

- SPIFFE
- SPIRE
- WIMSE

Primary concern:

Establish workload identifiers, trust-domain-scoped identity semantics,
and cryptographically verifiable workload credentials.

Workload identity does not automatically establish the identity of
every logical actor executing inside the workload.

The relationship between a logical actor, including an AI agent, and
its hosting workload is a separate architecture concern governed by
the Principal Model and ADR-0002.

No listed workload-identity standard is assumed by this document to
provide a complete logical AI-agent identity architecture.

### 4. Authentication and Proof of Possession

Relevant mechanisms include:

- SPIFFE SVIDs
- WIMSE workload credentials and tokens
- X.509 authentication
- JWT/CWT-based authentication
- Proof-of-possession mechanisms

Primary concern:

Demonstrate control of credentials associated with an identity.

Authentication does not itself grant authorization.

### 5. Authorization and Federation

Relevant standards and architectural areas:

- OAuth
- OAuth workload identity
- Token exchange
- Policy-driven authorization
- Delegation
- Security-context propagation

Primary concern:

Translate authenticated workload identity and relevant context into
resource-specific authority.

Workload identity is not itself an authorization policy.

### 6. Verifiable Claims and Credentials

Relevant standards:

- SPICE

Primary concern:

Represent and present cryptographically verifiable claims,
credentials, attributes, and proofs beyond fundamental runtime
workload identity.

SPICE is not currently treated as the canonical workload identity
mechanism.

### 7. Transparency, Provenance, and Auditability

Relevant standards:

- SCITT

Primary concern:

Provide cryptographically verifiable registration, provenance, and
auditability for signed statements and associated artifacts.

Transparency proves that a statement was registered or attributable;
it does not establish that the statement itself is true.

## Current Standards Tracking

Standards maturity and Autonomous Trust Platform adoption status are
tracked independently.

| Standard / Area                              | External Maturity / Status                                                                     | Architectural Role                                                                                   | ATP Adoption Status                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| SPIFFE                                       | Published open workload-identity specification                                                 | Workload identity, trust domains, verifiable identity documents                                      | Existing study area; no platform standardization decision |
| SPIRE                                        | Production implementation of SPIFFE APIs                                                       | SPIFFE workload-identity issuance, attestation, and distribution implementation                      | Existing study area; no platform standardization decision |
| WIMSE                                        | Active IETF work; architecture currently an Internet-Draft                                     | Workload identity interoperability, authentication, security context, and related workload protocols | Under architectural evaluation                            |
| RATS                                         | RFC 9334, Informational                                                                        | Remote-attestation architecture, evidence appraisal, verifier and relying-party roles                | Under architectural evaluation                            |
| EAT                                          | RFC 9711, Proposed Standard                                                                    | Attestation-oriented claims representation                                                           | Under architectural evaluation                            |
| OAuth workload identity / authorization work | Multiple standards and active specifications rather than one single workload-identity standard | Authorization, delegation, transaction context, and protocol integration where applicable            | Under architectural evaluation                            |
| SPICE                                        | Active IETF working group with Internet-Drafts                                                 | Digital credential and presentation patterns                                                         | Under architectural evaluation                            |
| SCITT                                        | RFC 9943, Proposed Standard                                                                    | Transparency and verifiable registration/auditing of signed supply-chain statements                  | Under architectural evaluation                            |
| Attestation mechanisms                       | Technology-dependent architecture area                                                         | Generation and protection of platform/workload evidence                                              | Under architectural evaluation                            |

External maturity does not imply platform adoption.

Likewise, a technology remaining under Autonomous Trust Platform
evaluation does not imply that the external specification itself is
immature.


## Dependency Model

Trust dependencies are not assumed to form one universal linear chain.

Different security decisions may consume different combinations of
identity, attestation, provenance, delegation, policy, and contextual
evidence.

Conceptually:

```text
                         Principal
                             |
                             v
                    Identity / Credential
                             |
                             v
                       Authentication
                             |
                             |
        +--------------------+--------------------+
        |                    |                    |
        v                    v                    v
 Attestation /          Provenance /         Environmental
 Runtime Evidence       Supply-Chain         Context
                        Evidence
        |                    |                    |
        +--------------------+--------------------+
                             |
                             v
                      Trust Evaluation
                             |
               +-------------+-------------+
               |                           |
               v                           v
      Delegated Authority             Policy / Context
               |                           |
               +-------------+-------------+
                             |
                             v
                   Authorization Decision
                             |
                             v
                         Enforcement
                             |
                             v
                       Resource Action
                             |
                             v
                  Audit / Transparency Evidence
```

This model is conceptual.

It does not require every interaction to use every evidence source or
architecture layer.

Attestation does not inherently create identity.

Identity does not inherently create authority.

Trust evaluation does not itself constitute authorization.

Delegated authority must not be inferred solely from authenticated
identity or attestation evidence.

Authorization becomes meaningful only when an enforcement mechanism
applies the resulting decision.

## Trust-Anchor Principle

Replacing long-lived shared secrets does not eliminate trust anchors
or trust dependencies.

Different trust functions may depend on different authorities and
anchors.

Examples include:

- Identity issuing authorities
- SPIFFE trust bundles
- Public-key infrastructure roots
- Attestation roots
- Endorsement authorities
- Reference-value authorities
- Verification keys
- Hardware roots of trust
- Software provenance signing authorities
- SCITT transparency-service verification material
- Delegation authorities
- Policy authorities
- Administrative registration systems

The architecture must not assume that one universal root of trust
governs all of these functions.

For every material trust anchor or authority, future architecture must
identify:

1. What assertion or function it anchors
2. Who controls it
3. Which trust domain accepts it
4. How it is initially provisioned
5. How it is authenticated or verified
6. How it is rotated
7. How it is revoked
8. What happens when it is unavailable
9. What happens when it is compromised
10. Which downstream trust relationships are affected by its failure

Trust-anchor ownership is therefore part of the trust architecture,
not merely a cryptographic implementation detail.

## Adoption Status

No adoption decision has been made for:

- WIMSE
- SPICE
- SCITT
- RATS/EAT
- OAuth workload identity profiles
- Any specific hardware or workload attestation mechanism

Architecture selection requires separate research, validation, tradeoff
analysis, and Control Plane approval.

This document is a landscape map, not an Architecture Decision Record.