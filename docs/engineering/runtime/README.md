# ChatGPT Runtime Policies

Version: 1.0

## Purpose

The Autonomous Trust Platform uses two layers of AI project governance:

1. Canonical specifications
2. Compact runtime policies

The canonical specifications live under:

`docs/engineering/prompts/`

They contain the full role definition, governance rationale, editorial standards, examples, and detailed operating rules.

The runtime policies live under:

`docs/engineering/runtime/`

They are compact versions intended for the ChatGPT Project Instructions field.

## Why This Layer Exists

During development, the DevRel canonical prompt exceeded the ChatGPT Project Instructions size limit.

Rather than deleting governance requirements to fit the platform constraint, the project adopted a two-layer model:

Canonical specification
→ Compact runtime policy
→ Runtime validation

This separates the full human-readable governance specification from the smaller policy required by the execution environment.

## Design Principles

Runtime policies must:

- Preserve role identity
- Preserve project scope boundaries
- Preserve cross-project routing
- Preserve evidence and claim constraints
- Preserve critical security distinctions
- Remain below the ChatGPT Project Instructions size limit

Runtime policies should remove:

- Repeated explanation
- Extended examples
- Historical rationale
- Documentation intended primarily for human maintainers

## Source of Truth

The Git repository remains the source of truth.

Project Instructions in ChatGPT should be populated from the corresponding runtime file rather than manually maintained.

## Runtime Policy Registry

| ChatGPT Project | Runtime Policy |
| --- | --- |
| Trust Platform (Control Plane) | `control-plane-runtime.md` |
| Trust Platform - Implementation | `implementation-runtime.md` |
| Trust Platform - Identity | `identity-runtime.md` |
| Trust Platform - AI | `ai-runtime.md` |
| Trust Platform - Research | `research-runtime.md` |
| Trust Platform - Debug/Troubleshooting | `debug-runtime.md` |
| Trust Platform - DevRel | `devrel-runtime.md` |

## Validation Requirement

Compression must not be assumed to preserve governance behavior.

After installing a runtime policy, the project should be regression-tested with an intentionally out-of-scope request.

A runtime policy is considered suitable for development use only after the expected routing behavior is observed.

## Current Status

All seven runtime policies are below the current Project Instructions size limit.

Regression testing has demonstrated preserved scope-routing behavior across the specialist projects tested during this phase.

These policies remain prompt-level governance mechanisms.

They are not:

- Authentication
- Authorization
- Cryptographic enforcement
- Sandboxing
- Isolation boundaries
- Trusted execution controls
