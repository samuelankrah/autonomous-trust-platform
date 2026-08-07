# Scope Guardrails

Version: 1.0

## Purpose

The Autonomous Trust Platform uses specialized ChatGPT Projects with explicit responsibility boundaries.

These boundaries are intended to reduce:

- Context pollution
- Conflicting recommendations
- Architecture drift
- Accidental role overlap
- Troubleshooting mixed with redesign
- Research being mistaken for approved architecture

## Scope Validation

Before answering a request, each project should first determine:

1. Does this request belong to this project's charter?
2. Does another project own the work?
3. Does the request require an architectural decision?
4. Is required context missing?
5. Would answering create an assumption that has not been verified?

If the request clearly belongs elsewhere, the project should stop before answering the underlying question.

## Expected Routing Response

A scope mismatch should identify:

- That the request is out of scope
- The correct destination project
- Why that project owns the request

The project may provide a transfer prompt or summary, but should not silently solve the misplaced request.

## Fail-Closed Behavior

The preferred behavior is fail-closed:

When scope is uncertain, do not casually cross project boundaries.

This is especially important for:

- Architecture decisions
- Security controls
- Identity design
- AI authorization
- Troubleshooting
- Public claims

## Prompt Guardrails Are Not Security Boundaries

These controls are governance mechanisms.

They are not equivalent to:

- Authentication
- Authorization
- Sandboxing
- Hardware isolation
- Cryptographic enforcement
- Policy-engine enforcement

A language model may still partially answer, leak reasoning, or cross a boundary.

Therefore, prompt-based routing must not be treated as a security control for production autonomous agents.

## Why This Matters to the Autonomous Trust Platform

The ChatGPT project structure is an early governance prototype.

Later platform phases will explore how similar boundaries can be enforced through:

- Workload identity
- SPIFFE/SPIRE
- Policy engines
- Delegated authorization
- Short-lived credentials
- Attestation
- Audit logs
- Trusted execution environments

The long-term goal is to move from:

Prompt-defined responsibility

to:

Cryptographically and programmatically enforced authority.

## Design Principle

Identity does not equal authority.

A component can prove what it is without automatically being permitted to perform every action.

This principle applies equally to:

- Humans
- Workloads
- Services
- Devices
- AI agents
