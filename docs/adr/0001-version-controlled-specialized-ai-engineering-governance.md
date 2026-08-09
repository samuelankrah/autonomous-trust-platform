# ADR-0001: Adopt Version-Controlled Specialized AI Engineering Governance

**Status:** Accepted
**Date:** 2026-08-09
**Decision Owner:** Trust Platform — Control Plane
**Scope:** Autonomous Trust Platform engineering governance

---

## Context

The Autonomous Trust Platform spans multiple technical domains with materially different engineering responsibilities, including:

* Platform architecture
* Platform implementation
* Machine and workload identity
* AI-agent engineering
* Standards and research
* Troubleshooting
* Public technical communication

A single undifferentiated AI engineering context would allow architecture, implementation, research, troubleshooting, and communication responsibilities to blend together.

This creates several risks:

* Architecture being redesigned during implementation
* Research conclusions being represented as approved architecture
* Troubleshooting sessions making strategic platform decisions
* AI-agent engineering assuming identity architecture
* Public communication overstating implementation evidence
* Project behavior changing without a durable record
* Chat history becoming an implicit source of architectural authority

The project also encountered a practical constraint: canonical project instructions may need to be compressed into smaller runtime policies.

Compression introduces the additional risk that important scope or governance behavior could be weakened or lost.

---

## Decision

The Autonomous Trust Platform will use a **version-controlled specialized AI engineering organization**.

Seven engineering projects are defined:

1. Trust Platform — Control Plane
2. Trust Platform — Implementation
3. Trust Platform — Identity
4. Trust Platform — AI
5. Trust Platform — Research
6. Trust Platform — Debug/Troubleshooting
7. Trust Platform — DevRel

Each project has:

* Explicit ownership
* Explicit exclusions
* Cross-project routing requirements
* A canonical version-controlled specification
* A compact runtime policy when required

GitHub is the authoritative engineering record.

ChatGPT conversations support engineering work but do not constitute durable architectural authority.

---

## Governance Model

The project uses the following hierarchy:

```text
GitHub source of truth
        │
        ▼
Canonical project specification
        │
        ▼
Compact runtime policy
        │
        ▼
Runtime project behavior
        │
        ▼
Validation tests
        │
        ▼
Recorded evidence
```

Changes to project responsibilities or shared governance must first be represented in the repository before they are treated as authoritative project state.

---

## Ownership Model

### Control Plane

Owns:

* Architecture
* Roadmap
* Sprint planning
* Major technology decisions
* Cross-domain trade-offs
* ADR governance
* Technical direction

### Implementation

Owns:

* Infrastructure implementation
* Automation
* Infrastructure as Code
* Platform deployment
* Approved architecture execution

It does not independently redesign platform architecture.

### Identity

Owns deep identity architecture including:

* PKI
* SPIFFE/SPIRE
* Workload identity
* Non-human identity
* Certificates
* Authentication protocols
* Identity lifecycle

### AI

Owns AI-agent engineering, including agent runtimes and agent-specific execution models.

It does not independently redefine platform-wide identity or authorization architecture.

### Research

Owns:

* Standards
* RFCs
* Academic and security research
* Technology comparison
* Emerging architecture analysis

Research findings are evidence inputs, not automatically architecture decisions.

### Debug/Troubleshooting

Owns runtime failure diagnosis.

Troubleshooting does not make strategic architecture decisions.

### DevRel

Owns public communication based on engineering evidence.

DevRel does not invent implementation evidence, security guarantees, employer deployment, or architectural maturity.

---

## Scope Routing

Projects must validate whether a request falls within their ownership before performing substantial work.

When another project clearly owns the request, the current project must reject or route the request rather than silently crossing ownership boundaries.

Routing is an engineering-governance mechanism.

It is not treated as a security boundary.

---

## Canonical and Runtime Policies

Canonical project specifications are maintained in:

`docs/engineering/prompts/`

Compact execution policies are maintained in:

`docs/engineering/runtime/`

Runtime policies are derived from canonical specifications but are not assumed to be semantically equivalent merely because they were derived from them.

Representative runtime behavior must be regression-tested.

---

## Validation

Governance behavior is evaluated using documented routing and boundary tests.

Testing distinguishes:

* Intended policy
* Observed model behavior
* Security enforcement

Observed compliance with project routing does not establish deterministic enforcement.

---

## Security Boundary

This architecture explicitly does **not** claim that prompt-defined project boundaries provide:

* Authentication
* Authorization
* Cryptographic isolation
* Process isolation
* Tool isolation
* Network isolation
* Hardware isolation
* Trusted execution
* Programmatic enforcement

The governance organization limits engineering ambiguity and provides accountability.

It does not technically constrain authority.

The distinction between **logical responsibility boundaries** and **technically enforceable authority boundaries** is intentionally preserved.

Future Autonomous Trust Platform architecture may explore how identity, delegated authorization, policy, attestation, short-lived credentials, trusted execution, and verifiable audit evidence can establish stronger enforcement properties.

Such capabilities are future architecture until implemented and verified.

---

## Alternatives Considered

### Alternative A — Single General-Purpose AI Engineering Project

All architecture, implementation, research, debugging, identity, AI, and communication work would occur in one project.

**Rejected because:**

* Ownership boundaries become implicit.
* Architecture can drift during implementation.
* Troubleshooting and research can silently become decision-making processes.
* Public communication can lose proximity to evidence classification.
* Context becomes increasingly difficult to govern as the project grows.

### Alternative B — Specialized Projects Without Version-Controlled Governance

Separate ChatGPT projects could exist while their operating instructions remain only in ChatGPT.

**Rejected because:**

* Chat history becomes an undocumented source of authority.
* Changes are difficult to review.
* Historical governance cannot be reproduced reliably.
* Project configuration can diverge from repository documentation.

### Alternative C — Canonical Policies Only

Full canonical project specifications could be copied directly into every runtime environment without compact policies.

**Rejected as the only model because:**

* Runtime instruction-size constraints may exist.
* Canonical governance and runtime execution concerns are different.
* Compression may be operationally necessary.

Canonical specifications remain authoritative even when compact runtime policies are used.

### Alternative D — Compact Policies Without Regression Validation

Compact policies could be assumed to preserve canonical behavior.

**Rejected because:**

* Compression can remove meaningful constraints.
* Equivalent wording does not guarantee equivalent observed behavior.
* Governance changes require behavioral evidence.

---

## Consequences

### Positive

* Engineering authority is explicit.
* Architectural ownership is preserved.
* Research, implementation, and troubleshooting are separated.
* Governance changes become reviewable in Git.
* Runtime compression becomes testable.
* Public communication remains tied to engineering evidence.
* Cross-project conflicts have an escalation path.
* The repository can reconstruct why the engineering organization operates as it does.

### Negative

* Maintaining seven projects adds governance overhead.
* Canonical and runtime policies can drift.
* Regression tests require maintenance.
* Routing introduces friction for requests spanning multiple domains.
* Prompt-based compliance remains probabilistic.

These costs are accepted because the platform is intended to model enterprise-grade architectural discipline rather than maximize conversational convenience.

---

## Risks

### Policy Drift

Canonical and runtime policies may diverge.

**Mitigation:** Version control and regression validation.

### Boundary Ambiguity

Some requests naturally span multiple projects.

**Mitigation:** Control Plane arbitrates cross-domain architectural ownership.

### False Security Confidence

Successful routing behavior could be incorrectly interpreted as enforcement.

**Mitigation:** Explicit documentation that prompt governance is not a security boundary.

### Governance Complexity

The project could spend disproportionate effort governing its engineering organization rather than building the trust platform.

**Mitigation:** Sprint 0 closes governance foundation work. Future governance enhancements must be justified by demonstrated need.

---

## Reversal Conditions

This decision should be reconsidered if evidence demonstrates that:

1. The seven-project structure creates more architectural inconsistency than it prevents.
2. A substantially better mechanism provides durable ownership, routing, evidence classification, and architecture governance with materially lower complexity.
3. Future platform tooling provides technically enforceable agent authority boundaries that make parts of the prompt-routing organization redundant.
4. Regression evidence repeatedly shows that compressed runtime policies cannot preserve required governance behavior.
5. Project scope changes enough that the current ownership domains no longer represent meaningful engineering boundaries.

Reconsideration does not automatically imply returning to a single general-purpose engineering context.

---

## Evidence

Related project records include:

* `docs/engineering/README.md`
* `docs/engineering/project-registry.md`
* `docs/engineering/shared-context.md`
* `docs/engineering/prompts/`
* `docs/engineering/runtime/`
* `docs/engineering/governance/project-routing.md`
* `docs/engineering/governance/scope-guardrails.md`
* `docs/engineering/governance/validation-tests.md`
* `docs/sprints/sprint-00-exit-review.md`

---

## Outcome

The specialized, version-controlled AI engineering organization is adopted as the governance architecture for development of the Autonomous Trust Platform.

Its purpose is to establish responsibility, traceability, reproducibility, and engineering discipline.

It is explicitly **not** considered a technical security enforcement architecture.
