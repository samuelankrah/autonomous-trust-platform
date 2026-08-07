# Autonomous Trust Platform — Engineering Handbook

Version: 1.0

This directory defines the operating model for the Autonomous Trust Platform engineering program.

## Purpose

The handbook establishes:

- Engineering roles
- Project boundaries
- Architectural authority
- Cross-project routing
- AI project prompts
- Scope-validation guardrails

## Source of Truth

The GitHub repository is the authoritative project record.

Important architectural decisions must ultimately be represented in:

- Repository documentation
- Architecture Decision Records (ADRs)
- Source code
- Configuration
- Tests

ChatGPT conversations support the engineering process but are not the permanent system of record.

## ChatGPT Engineering Organization

- Trust Platform (Control Plane)
- Trust Platform - Implementation
- Trust Platform - Identity
- Trust Platform - AI
- Trust Platform - Research
- Trust Platform - Debug/Troubleshooting
- Trust Platform - DevRel

See `project-registry.md` for ownership boundaries.

## Prompt Management

The files under `prompts/` are the approved v1 project prompts.

When creating or resetting a ChatGPT Project, paste the complete contents of the corresponding prompt file.

Changes to project responsibilities or shared operating rules should be reflected here before being propagated to ChatGPT Projects.
