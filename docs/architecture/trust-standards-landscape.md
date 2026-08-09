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

### 3. Workload and Agent Identity

Relevant standards and technologies:

- SPIFFE
- SPIRE
- WIMSE

Primary concern:

Establish stable workload identifiers, trust domains, and
cryptographically verifiable workload credentials.

SPIFFE and WIMSE have overlapping concerns but are not currently
treated as competing architecture selections.

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

| Standard / Area | Architectural Role | Current Status |
|---|---|---|
| SPIFFE / SPIRE | Workload identity and credentialing | Existing study area |
| WIMSE | Workload identity interoperability, authentication, context, and delegation | Emerging standard under evaluation |
| RATS | Attestation architecture and trust appraisal | Under architectural evaluation |
| EAT | Attestation-oriented claims representation | Under architectural evaluation |
| OAuth workload identity | Authorization and federation bridge | Under architectural evaluation |
| SPICE | Verifiable credentials and claim presentation | Emerging standard under evaluation |
| SCITT | Transparency, provenance, and accountability | Under architectural evaluation |
| Attestation mechanisms | Generation of platform/workload trust evidence | Architecture area under evaluation |

## Dependency Model

The conceptual trust flow is:

Execution root of trust

→ Attestation evidence

→ Evidence appraisal

→ Workload identity bootstrap or validation

→ Authentication / proof of possession

→ Authorization / policy evaluation

→ Resource action

→ Auditable and potentially transparent evidence

This flow is conceptual. It does not imply that every implementation
must use every layer or listed standard.

## Trust-Anchor Principle

Replacing long-lived shared secrets does not eliminate trust anchors.

Future architectures may still depend on:

- Private keys
- Credential issuers
- Trust bundles
- Attestation roots
- Reference values
- Endorsements
- Verification keys
- Policy authorities
- Key rotation
- Revocation
- Compromise recovery

These dependencies must be made explicit in future architecture
decisions.

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