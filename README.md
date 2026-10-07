# Autonomous Trust Platform

## Vision

Build a production-inspired reference architecture demonstrating modern trust systems for autonomous workloads, AI agents, APIs, machines, and humans.

## Mission

Design and validate an end-to-end trust platform centered on cryptographically verifiable identity, policy-driven authorization, confidential-computing considerations, and post-quantum cryptography.

## Core Domains

- Machine Identity
- Human Identity
- AI Identity
- Workload Identity
- Policy as Code
- Zero Trust
- PKI
- Confidential Computing
- Post-Quantum Cryptography
- Observability

## Current Status

**v1.0 - Evaluated and Demonstrated**

The repository currently contains:

- Foundational architecture, trust boundaries, principal modeling, delegated-authority constraints, security invariants, and threat-model artifacts.
- Complete Sprint 2 trust control contracts: authorization and enforcement, failure and degraded-mode behavior, invariant-to-control verification, specialist work packages, a technology evaluation framework, and a component mapping gate.
- Accepted specialist research returns (identity, attestation and standards, AI agents, implementation feasibility), each labeled Research Finding.
- Two bounded, synthetic demonstration labs with reviewable contracts, source code, and automated tests: the Sprint 2 authorization and enforcement vertical slice, and the decision-service demonstration (injectable clock, SPIFFE-ID-shaped workload identities, bounded delegation, signed policy decisions, enforcement stub, append-only evidence ledger, deterministic reruns).
- A non-normative CISSP assurance-and-learning map that identifies existing evidence, partial evidence, design-only areas, and gaps.

This repository does not claim production readiness, operational effectiveness, or CISSP compliance/certification.

## Guiding Principles

- Identity does not imply trust or authority.
- Authentication and authorization are separate concerns.
- Attestation evidence is not identity by itself.
- Delegated authority must not amplify.
- Policy is evaluated separately from enforcement.
- Failure or uncertainty must not silently increase authority.
- Vendor-neutral architecture.
- Short-lived credentials where appropriate.
- Crypto agility over algorithm dependence.
- Trust decisions must be observable and auditable.

## Documentation and Evidence

### Architecture

- [Platform Charter](docs/architecture/platform-charter.md)
- [Principal Model](docs/architecture/principal-model.md)
- [Trust Boundaries](docs/architecture/trust-boundaries.md)
- [Trust Standards Landscape](docs/architecture/trust-standards-landscape.md)
- [Bootstrap Trust](docs/architecture/bootstrap-trust.md)
- [Delegated Authority](docs/architecture/delegated-authority.md)
- [Security Invariants](docs/architecture/security-invariants.md)
- [Threat Model](docs/architecture/threat-model.md)
- [Failure Model](docs/architecture/failure-model.md)
- [System Context Architecture](docs/architecture/system-context-architecture.md)

### Bounded Implementation Evidence

- [Sprint 2 Authorization and Enforcement Contract](docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md)
- [Authorization and Enforcement Lab](labs/sprint-02-task-05-authorization/)
- [Decision-Service Demonstration](labs/decision-service/)
- [Specialist Research Returns](docs/research/)

### Assurance and Learning

- [CISSP Alignment and Evidence Map](docs/assurance/cissp-alignment-and-evidence-map.md)

The CISSP map is an evaluation lens for learning, assurance reasoning, portfolio explanation, and gap identification. It does not redefine platform architecture or establish a compliance claim.

## Platform Capability Targets

The platform is intended to demonstrate, through bounded and verifiable increments:

- Human, machine, workload, and AI-agent identity concepts
- Dynamic credential and certificate-lifecycle concepts
- Policy-driven authorization and explicit enforcement
- Delegated authority with provenance, scope, lifetime, and accountability
- Attestation as input to bootstrap or validation decisions
- Confidential-computing and post-quantum-cryptography considerations
- Observable and auditable trust decisions

## Architecture

> Architecture diagrams and implementation evidence will evolve through validated project increments.

The authoritative architecture is maintained in the [Platform Charter](docs/architecture/platform-charter.md) and its linked architecture artifacts.

## Success Criteria

The project is successful when it demonstrates verifiable, evidence-backed trust behavior across appropriately bounded increments, including:

- Cryptographically verifiable machine and workload identity
- Policy-driven authorization with explicit enforcement
- AI agents operating under constrained delegated authority
- Attestation-informed validation or bootstrap decisions
- Crypto-agile PKI considerations
- Observable and auditable trust decisions
- A production-inspired reference architecture with documented limitations
