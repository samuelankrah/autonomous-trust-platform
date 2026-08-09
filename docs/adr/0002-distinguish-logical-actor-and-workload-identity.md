# ADR-0002: Distinguish Logical Actor Identity from Hosting Workload Identity When Security Boundaries Differ

**Status:** Accepted
**Date:** 2026-08-09
**Decision Owner:** Trust Platform — Control Plane
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Scope:** Principal and identity architecture

---

## Context

The Autonomous Trust Platform must identify actors involved in security-relevant actions without collapsing logical identity, runtime identity, credentials, authority, and execution environment into one concept.

A workload may provide the execution environment for one or more logical actors.

For example:

```text
Authenticated Workload
        │
        ├── Agent A
        └── Agent B
```

If Agent A and Agent B have different:

* Authority
* Delegators
* Policies
* Lifecycles
* Revocation requirements
* Audit requirements
* Logical ownership

then authenticating only the hosting workload does not provide sufficient information to distinguish which logical actor initiated a security-relevant action.

The inverse is also important.

Creating an independent identity for every process, agent, tool, instance, or software component would create unnecessary identity proliferation and operational complexity.

The architecture therefore requires a security-driven rule for determining when identities must remain distinct.

---

## Decision

The Autonomous Trust Platform will distinguish a **logical actor identity** from its **hosting workload identity** whenever differences between those entities create a security-relevant boundary.

A distinct logical actor identity is required when one or more of the following must differ independently from the hosting workload:

* Authority
* Delegating principal
* Authorization policy
* Lifecycle
* Revocation boundary
* Audit attribution
* Logical ownership
* Concurrent actor population
* Security policy
* Accountability requirements

Therefore:

```text
logical actor
      ≠
automatically hosting workload
```

But also:

```text
AI agent
      ≠
automatically separate principal
```

Identity separation is determined by security requirements rather than implementation labels.

---

## Identity Boundary Principle

The governing principle is:

> **Identity boundaries follow security-relevant distinctions, not implementation-process boundaries.**

An independently named process, container, agent, bot, service, or runtime does not automatically require an independent principal identity.

Before introducing an independent principal identity, the architecture should determine whether the entity:

1. Independently exercises security-relevant actions.
2. Can possess authority different from its hosting entity.
3. Has a materially different lifecycle.
4. Requires independent audit attribution.
5. Requires independently applicable policy.
6. Requires independent compromise containment or revocation.

Where these distinctions do not exist, identity separation may add complexity without providing a meaningful security property.

---

## Logical Principal and Instance Separation

The architecture also distinguishes:

```text
logical principal
        ≠
runtime instance
```

A principal instance may have a unique identifier for:

* Runtime correlation
* Telemetry
* Incident investigation
* Audit attribution
* Instance-specific revocation

without becoming an independently authenticated or authorized principal.

Therefore:

```text
uniquely identifiable instance
        ≠
independent security principal
```

Independent instance identity requires its own security justification.

---

## Workload Identity

A workload principal represents logical software executing for a defined purpose.

The logical workload may have:

* Multiple concurrent instances
* Sequential replacement instances
* Multiple credentials over its lifetime
* Different execution environments over time

Therefore:

```text
workload identity
      ≠
process identifier
      ≠
container identifier
      ≠
credential
```

Credential rotation or runtime restart does not necessarily change the logical workload principal.

---

## AI-Agent Implication

AI agents are an important motivating case but do not receive a special exemption from the general identity-boundary principle.

### Separate agent identity is justified when:

```text
Workload
├── Agent A — Finance authority
└── Agent B — Research authority
```

because authorization and accountability must distinguish the logical actors.

### Separate agent identity may not be necessary when:

```text
Workload A
└── Agent A
```

and:

* Their lifecycle is identical.
* Their authority is identical.
* Their security policy is identical.
* Their audit identity is identical.
* No independent revocation boundary exists.

The architecture therefore rejects a universal rule that every AI agent must receive an independent identity.

---

## Delegation Implication

Hosting identity and delegated authority must remain distinguishable.

For example:

```text
Human Principal
       │
       │ delegates
       ▼
Logical Agent
       │
       │ executes within
       ▼
Workload
```

The workload identity establishes execution context.

The logical agent identity establishes which actor is acting.

The delegating-principal relationship identifies the source of authority.

None of those relationships automatically substitutes for the others.

---

## Authorization Implication

Future authorization architecture must be capable of evaluating the identity layer relevant to the requested action.

A security decision may require context such as:

```text
actor:
    logical principal

runtime:
    workload principal

delegation:
    delegating principal

environment:
    execution evidence
```

This ADR does not define:

* Authorization protocol
* Policy language
* Token format
* Credential format
* API schema

Those decisions remain future architecture work.

---

## Audit Implication

Where actor and workload identity differ materially, audit evidence must preserve enough context to reconstruct both.

Conceptually:

```text
Delegator
    │
    ▼
Logical Actor
    │
    ▼
Actor Instance
    │
    ▼
Hosting Workload
    │
    ▼
Execution Environment
    │
    ▼
Action / Resource
```

Not every interaction requires every identity layer.

Required attribution depth should correspond to the security consequence and accountability requirements of the action.

---

## Alternatives Considered

### Alternative A — Treat Workload Identity as the Universal Actor Identity

Every actor hosted inside an authenticated workload would inherit the workload identity.

**Rejected because:**

* Multiple logical actors may share a workload.
* Different actors may possess different authority.
* Delegation may differ between actors.
* Audit attribution becomes ambiguous.
* Independent actor revocation becomes difficult.
* Runtime topology would dictate security identity semantics.

---

### Alternative B — Give Every AI Agent a Separate Identity

Every entity described as an AI agent would receive its own principal identity.

**Rejected because:**

* “AI agent” is an implementation and behavioral description rather than sufficient evidence of a security boundary.
* Some agents and their hosting workload may share identical lifecycle, authority, policy, and accountability boundaries.
* Universal identity separation creates unnecessary lifecycle and policy complexity.

---

### Alternative C — Give Every Runtime Instance an Independent Principal Identity

Each process, container, pod, or agent instance would become an independently authenticated principal.

**Rejected because:**

* Runtime instances are frequently ephemeral.
* Logical principals may persist across many instances.
* Attribution requirements do not always imply authorization requirements.
* This model would create excessive identity churn.

Instance identifiers may still be retained for telemetry, audit, and incident response.

---

### Alternative D — Determine Identity Boundaries from Security Requirements

Separate identities are created only where authority, lifecycle, policy, revocation, accountability, or other security properties differ.

**Accepted.**

This establishes identity boundaries based on security semantics rather than runtime topology.

---

## Consequences

### Positive

* Authorization can distinguish logical actors sharing infrastructure.
* Audit evidence can preserve actor attribution.
* Runtime topology does not dictate logical identity.
* AI agents are treated through reusable identity principles rather than special-case architecture.
* Identity proliferation is constrained.
* Workload identity technologies can remain focused on workload identity.
* Delegation and runtime identity can evolve independently.

### Negative

* Some security events may require multiple identity layers.
* Authorization context may become more complex.
* Audit schemas may need to preserve actor and workload attribution separately.
* Agent-to-runtime binding becomes an additional trust relationship.
* Lifecycle management becomes more complex where logical actor and workload identities diverge.

These costs are accepted where independent security boundaries justify them.

---

## Risks

### Incorrect Identity Collapse

Distinct actors may be represented as one workload principal even when their authority differs.

**Mitigation:** Apply the Identity Boundary Test defined in the Principal Model.

### Unnecessary Identity Proliferation

Implementations may interpret this ADR as requiring identities for every runtime component.

**Mitigation:** Independent identity requires a security-relevant boundary; labels and runtime uniqueness alone are insufficient.

### Actor-to-Runtime Spoofing

A workload may claim that an action originated from a particular logical actor without sufficient evidence.

**Mitigation:** Future architecture must define how logical actors are bound to authenticated workloads or runtime evidence.

This ADR does not claim that such binding currently exists.

### Authorization Context Confusion

Applications may incorrectly authorize solely from workload identity despite requiring logical-actor distinctions.

**Mitigation:** Future authorization architecture must define which identity layers are mandatory for each protected interaction.

---

## Relationship to Platform Charter H-02

The Platform Charter states:

> AI-agent identity may need to be distinct from the identity of its hosting workload.

The Principal Model evaluated this hypothesis.

### Finding

**Supported, but not universally required.**

ADR-0002 accepts the more general principle:

> Logical actor identity must be independently distinguishable from hosting workload identity whenever differences in authority, delegation, policy, lifecycle, revocation, audit, or other security properties create a security-relevant boundary.

H-02 is therefore resolved through a broader security principle rather than an AI-specific universal rule.

---

## Architecture Decisions Not Made

This ADR does not select:

* SPIFFE/SPIRE
* WIMSE
* X.509
* JWT
* OAuth
* OIDC
* Agent identity token formats
* Kubernetes identity mechanisms
* Cloud workload identity
* Policy engines
* Delegation protocols

Those technologies will be evaluated against this identity model in later architecture work.

---

## Reversal Conditions

This decision should be reconsidered if evidence demonstrates that:

1. A single workload identity can preserve actor-specific authority, delegation, revocation, and attribution without ambiguity.
2. Separate logical-actor identity introduces disproportionate complexity without measurable security benefit.
3. An accepted external identity standard provides a stronger general abstraction that preserves the security properties required by this decision.
4. Future execution architectures guarantee a one-to-one relationship between logical actor and workload such that separate identity no longer provides meaningful distinction.

Reconsideration must preserve the underlying requirement for unambiguous authorization and accountability.

---

## Related Artifacts

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-standards-landscape.md`
* `docs/adr/0001-version-controlled-specialized-ai-engineering-governance.md`

---

## Outcome

The Autonomous Trust Platform adopts security-relevant identity boundaries rather than implementation-defined identity boundaries.

Logical actors and hosting workloads must be independently distinguishable when their authority, delegation, lifecycle, policy, revocation, accountability, or audit requirements differ.

This decision establishes identity semantics.

It does not yet define the mechanisms used to authenticate, bind, authorize, or credential those identities.
