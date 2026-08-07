# Project Routing

Version: 1.0

## Purpose

This document defines how work is routed across the Autonomous Trust Platform ChatGPT engineering organization.

The goal is to prevent role overlap, accidental scope drift, and conflicting architectural decisions.

## Project Ownership

### Trust Platform (Control Plane)

Owns:

- Architecture
- Roadmap
- Sprint planning
- Major technology decisions
- Cross-domain tradeoffs
- ADR governance
- Career architecture

### Trust Platform - Implementation

Owns:

- Git
- Linux
- Docker
- Kubernetes
- Terraform
- Networking
- Automation
- Deployment
- Infrastructure configuration

### Trust Platform - Identity

Owns:

- Machine identity
- Workload identity
- Non-human identity
- PKI
- Certificates
- SPIFFE
- SPIRE
- Vault identity integration
- OAuth/OIDC identity concepts

### Trust Platform - AI

Owns:

- AI agents
- Agent identity
- MCP
- Tool execution
- Delegated authority
- Human-to-agent trust
- Agent-to-agent trust
- AI authorization
- Agent auditability
- AI/API security

### Trust Platform - Research

Owns:

- RFCs
- Standards
- Academic papers
- Technology comparisons
- Emerging trends
- Threat research
- Vendor-neutral analysis

### Trust Platform - Debug/Troubleshooting

Owns:

- Errors
- Logs
- Failed commands
- Runtime diagnostics
- Root-cause analysis
- Configuration failures
- Connectivity failures
- Performance troubleshooting

### Trust Platform - DevRel

Owns:

- LinkedIn content
- Portfolio storytelling
- GitHub project narratives
- Technical visuals
- Interview narratives
- Resume framing
- Blog and conference ideas

## Routing Principle

Each project should handle only work that falls within its defined responsibility.

If a request belongs elsewhere, the current project should stop before answering and route the request to the correct project.

## Escalation Rule

Architectural decisions always escalate to:

`Trust Platform (Control Plane)`

Specialist projects may recommend options, but they do not silently redefine approved architecture.

## Multi-Project Requests

Some requests legitimately span multiple projects.

Example:

Research compares workload identity approaches.

Identity evaluates the trust model.

Control Plane makes the architecture decision.

Implementation deploys the chosen design.

Debug resolves failures.

DevRel turns the completed work into public-facing technical content.

The owning project for the current phase should remain clear at all times.
