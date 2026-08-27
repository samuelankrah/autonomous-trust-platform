# CISSP Alignment and Evidence Map

## Status

Non-normative assurance-and-learning artifact.

## Purpose and Authority

This map uses the current CISSP domain structure as an evaluation lens for learning, assurance reasoning, portfolio explanation, and evidence-gap identification. It maps only existing Autonomous Trust Platform repository artifacts and their stated or executable evidence.

It does not change platform architecture. The Platform Charter and accepted architecture artifacts remain authoritative. This map does not select or standardize a vendor, product, cloud provider, identity system, authorization engine, or runtime platform.

Status meanings:

- **Evidenced** - a bounded artifact includes reviewable or executable evidence for the mapped concern.
- **Partially evidenced** - evidence exists, but is limited in scope, maturity, or operational context.
- **Design only** - the concern is represented in architecture or design material without corresponding implementation evidence.
- **Gap** - no direct project evidence currently demonstrates the mapped concern.

## CISSP Domain Mapping

| CISSP domain | Relevant Trust Platform capability or concern | Existing repository artifact(s) | Evidence type | Current status | Explicit limitation or next evidence needed |
| --- | --- | --- | --- | --- | --- |
| Security and Risk Management | Purpose-scoped, directional trust; explicit treatment of failure and uncertainty; architectural assumptions and threats. | [Platform Charter](../architecture/platform-charter.md); [Threat Model](../architecture/threat-model.md); [Security Invariants](../architecture/security-invariants.md) | Architecture and threat-model documentation | Design only | No operational risk register, control-effectiveness measurement, or exercised risk-treatment evidence is represented by this map. |
| Asset Security | Protected-resource scope and evidence are architectural concerns, but asset ownership, classification, handling, retention, and disposal are not demonstrated as controls. | [Platform Charter](../architecture/platform-charter.md); [Authorization and Enforcement Contract](../sprints/sprint-02-task-05-authorization-and-enforcement-contract.md) | Architectural and bounded contract documentation | Gap | Future evidence would need an explicit, reviewed asset-data classification and handling model plus validation appropriate to its stated scope. |
| Security Architecture and Engineering | Function-scoped trust boundaries; separation among identity, authentication, credentials, attestation, delegation, policy, authorization, enforcement, audit evidence, and lifecycle. | [Platform Charter](../architecture/platform-charter.md); [Principal Model](../architecture/principal-model.md); [Trust Boundaries](../architecture/trust-boundaries.md); [Delegated Authority](../architecture/delegated-authority.md); [Security Invariants](../architecture/security-invariants.md); [Threat Model](../architecture/threat-model.md) | Architecture decisions, constraints, and threat-model documentation | Design only | The documents demonstrate design reasoning, not implementation correctness, deployment isolation, cryptographic assurance, or operational effectiveness. |
| Communication and Network Security | Cross-domain interactions require explicit trust-boundary evaluation; no network-security mechanism is implied by the boundary model. | [Trust Boundaries](../architecture/trust-boundaries.md); [Threat Model](../architecture/threat-model.md) | Architectural boundary and threat-model documentation | Design only | No evidence currently demonstrates network segmentation, protocol configuration, transport protection, traffic inspection, or resilience behavior. |
| Identity and Access Management | Identity is distinct from authority; authentication is distinct from authorization; delegated authority has provenance, scope, lifetime, accountability, and non-amplification constraints; a bounded lab evaluates request-scoped decisions. | [Principal Model](../architecture/principal-model.md); [Delegated Authority](../architecture/delegated-authority.md); [Security Invariants](../architecture/security-invariants.md); [Authorization and Enforcement Contract](../sprints/sprint-02-task-05-authorization-and-enforcement-contract.md); [Authorization Lab](../../labs/sprint-02-task-05-authorization/authorization_lab.py); [Authorization Tests](../../labs/sprint-02-task-05-authorization/tests/test_authorization_lab.py); [HTTP Lab Tests](../../labs/sprint-02-task-05-authorization/tests/test_http_lab.py) | Architecture documentation, contract, source code, and automated tests | Partially evidenced | Sprint 2 is a synthetic, bounded lab. It is not a production identity integration, credential lifecycle, federation implementation, privileged-access control, or broad IAM coverage claim. |
| Security Assessment and Testing | The Sprint 2 vertical slice defines contract expectations and includes automated positive and negative-path tests for decision and HTTP behavior. | [Authorization and Enforcement Contract](../sprints/sprint-02-task-05-authorization-and-enforcement-contract.md); [Authorization Tests](../../labs/sprint-02-task-05-authorization/tests/test_authorization_lab.py); [HTTP Lab Tests](../../labs/sprint-02-task-05-authorization/tests/test_http_lab.py) | Reviewable contract and automated test source | Evidenced | Evidence is limited to stated lab behavior. It does not establish broad platform testing coverage or production operational effectiveness. |
| Security Operations | Request correlation and decision/evidence discussion support an operational-evidence concern; direct resource access is bounded by the lab contract. | [Platform Charter](../architecture/platform-charter.md); [Principal Model](../architecture/principal-model.md); [Authorization and Enforcement Contract](../sprints/sprint-02-task-05-authorization-and-enforcement-contract.md); [HTTP Lab Tests](../../labs/sprint-02-task-05-authorization/tests/test_http_lab.py) | Architecture documentation, contract, and bounded test evidence | Partially evidenced | No operational monitoring, alerting, incident response, evidence-retention process, production logging pipeline, or runbook effectiveness is evidenced. |
| Software Development Security | A small vertical slice has versioned policy/contract behavior, source code, and automated tests. | [Authorization and Enforcement Contract](../sprints/sprint-02-task-05-authorization-and-enforcement-contract.md); [Authorization Lab](../../labs/sprint-02-task-05-authorization/authorization_lab.py); [Authorization Tests](../../labs/sprint-02-task-05-authorization/tests/test_authorization_lab.py); [HTTP Lab Tests](../../labs/sprint-02-task-05-authorization/tests/test_http_lab.py) | Source code and automated tests | Partially evidenced | This does not demonstrate a complete secure-development lifecycle, review controls, supply-chain controls, release controls, or production deployment assurance. |

## Sprint 2 Evidence Boundary

The Sprint 2 authorization/enforcement lab is evidence only for its documented synthetic scenario and automated checks. It supports discussion of request-scoped authorization decisions, enforcement behavior, correlation, and negative-path testing. It must not be represented as a production integration, a general-purpose authorization platform, or evidence of broad CISSP compliance.

## What This Map Does Not Claim

- The project is not CISSP-compliant or CISSP-certified.
- Mapping does not prove operational effectiveness.
- Unimplemented controls remain gaps.
- CISSP does not replace standards, threat modeling, architecture decisions, or empirical validation.

## Use in Future Vertical Slices

Each future lab must identify:

1. Its primary Trust Platform function.
2. Its relevant CISSP domain or domains.
3. Executable or reviewable evidence.
4. Known limitations and negative-test coverage.

This identification is an assurance and learning aid. It does not change the approved roadmap, task sequence, sprint scope, or architecture authority.
