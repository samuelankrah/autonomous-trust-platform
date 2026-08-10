# Autonomous Trust Platform — Principal Model

**Status:** Accepted
**Accepted Date:** 2026-08-09
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Artifact Owner:** Trust Platform — Control Plane
**Architecture Domain:** Principal, identity, instance, and attribution model

---

## 1. Purpose

This document defines the principal model for the Autonomous Trust Platform.

Its purpose is to establish which entities require security-relevant identities and how those identities relate to:

* Logical actors
* Runtime instances
* Workloads
* Execution environments
* Credentials
* Delegators
* Capabilities
* Resources
* Requests
* Audit attribution

The model intentionally separates identity from authentication, attestation, authorization, delegated authority, and policy.

Those concepts interact with principals but are not interchangeable with principal identity.

---

## 2. Governing Question

For any security-relevant action, the platform must eventually be able to answer:

> **Which principal caused this action, through which execution context, using which identity evidence, and on whose behalf?**

This is intentionally different from:

> Is the action authorized?

Authorization is a subsequent architecture concern.

---

## 3. Core Definitions

### 3.1 Entity

An **entity** is anything represented in the system model.

Examples include:

* Human
* Application
* Workload
* Agent
* Server
* Tool
* API
* Database
* Credential
* Policy
* Resource

Being an entity does not imply possessing identity or authority.

---

### 3.2 Actor

An **actor** is an entity capable of causing or initiating behavior relevant to the system.

Examples may include:

* Human
* Workload
* Automation process
* AI agent

An actor does not automatically qualify as an independently identified principal.

---

### 3.3 Principal

For the Autonomous Trust Platform:

> **A principal is an entity whose independently distinguishable identity is relevant to a security decision, delegation relationship, or accountable action.**

A principal must have a meaningful identity boundary.

A principal does not necessarily possess authority.

Therefore:

```text
principal
    ≠
authorized principal
```

---

### 3.4 Subject

A **subject** is the principal whose requested action is being evaluated in a specific security interaction.

Subject is therefore a contextual role.

Example:

```text
Principal:
    agent://research-agent

Request:
    read resource://security-paper

Subject for this request:
    agent://research-agent
```

The same principal may participate in another interaction as a delegator, resource owner, caller, or service.

---

### 3.5 Identity

An **identity** is a representation used to distinguish a principal within a defined identity namespace and context.

Identity answers:

```text
Which principal is this?
```

It does not answer:

```text
What is this principal permitted to do?
```

---

### 3.6 Logical Identity

A **logical identity** represents a principal independently of a particular runtime instance.

Example:

```text
agent://security-researcher
```

may refer to a persistent logical agent whose execution instances change over time.

Likewise:

```text
workload://payments-api
```

may identify the logical workload even though individual processes or containers are replaced.

---

### 3.7 Principal Instance

A **principal instance** is a specific runtime instantiation of a logical principal.

Example:

```text
Logical principal:
agent://security-researcher

Observed instances:
instance://9d718...
instance://17a25...
```

Instances may be:

* Concurrent
* Sequential
* Short lived
* Restarted
* Relocated across execution environments

A change in instance does not necessarily imply a change in logical identity.

An instance identifier does not automatically establish an independent principal identity.

Instance identifiers may exist solely to support:

* Runtime correlation
* Telemetry
* Incident investigation
* Audit attribution
* Revocation of a particular execution instance

A principal instance should become independently authenticated or independently subject to authorization policy only when a security requirement justifies that boundary.

Therefore:

```text
uniquely identifiable instance
        ≠
independent security principal
```

The Identity Boundary Test in this document determines when that distinction becomes security relevant.

---

### 3.8 Credential

A **credential** is an artifact used to communicate or prove an identity or authority claim.

A credential is not itself the principal.

Therefore:

```text
principal
    ≠
credential
```

and:

```text
credential expiration
    ≠
principal deletion
```

A logical principal may possess different credentials during its lifetime.

---

### 3.9 Execution Environment

An **execution environment** is the infrastructure context in which a principal or principal instance executes.

Examples may eventually include:

* Physical host
* Virtual machine
* Container
* Kubernetes node
* Pod
* Confidential-computing environment
* Serverless runtime

Execution environment identity may contribute security evidence without becoming the logical identity of the hosted principal.

---

### 3.10 Delegator

A **delegator** is a role performed by a principal that grants bounded authority to another principal.

Delegator is therefore not a separate principal type.

For example:

```text
human://operator
```

may be:

```text
Principal type:
Human

Current role:
Delegator
```

Likewise a workload or service principal might act as a delegator in another architecture scenario.

---

### 3.11 Resource

A **resource** is the target of an action.

Examples:

* API endpoint
* Database
* File
* Secret
* Key
* Model
* Compute operation
* Policy object

A resource is not automatically a principal.

An entity can, however, be a resource in one interaction and a principal in another.

Example:

```text
Service A calls Service B
```

For that interaction:

```text
Service A → subject/principal
Service B → protected resource
```

If Service B later calls Service C:

```text
Service B → subject/principal
Service C → protected resource
```

Role is contextual.

---

### 3.12 Capability / Tool

A **capability** is an operation exposed for invocation.

A tool available to an AI agent is normally modeled first as a capability or protected resource rather than automatically as an independent principal.

Example:

```text
tool://send-email
```

may represent a callable capability.

If the implementation behind that capability independently authenticates to downstream systems, the underlying workload may also possess a principal identity.

Therefore:

```text
tool identity
```

and:

```text
tool implementation workload identity
```

must not be assumed to be identical.

---

## 4. Principal Categories

The platform will initially recognize four fundamental principal categories.

These categories describe the nature of the independently identified actor rather than every role it may perform.

---

### 4.1 Human Principal

A natural person whose identity is relevant to a security interaction.

Examples:

```text
human://alice
human://administrator-42
```

Human identity architecture itself is not defined by this document.

---

### 4.2 Infrastructure Principal

A computing environment whose identity is independently relevant to security.

Examples may include:

* Device
* Physical host
* Virtual host
* Compute node
* Trusted execution environment

Infrastructure identity is particularly relevant when environmental properties contribute evidence about a hosted workload.

Infrastructure identity does not automatically become workload identity.

---

### 4.3 Workload Principal

A logical software workload executing for a defined purpose.

A workload may comprise one or more runtime instances.

Examples may eventually include:

```text
workload://payments-api
workload://certificate-rotator
workload://deployment-controller
```

The workload is distinct from:

* The host
* The process instance
* The credential
* The human that deployed it
* Any AI agent hosted inside it

unless the architecture explicitly decides to collapse one of those boundaries.

---

### 4.4 Logical Software Principal

A **logical software principal** is a software actor whose independently distinguishable identity is security relevant beyond the identity of the workload or execution environment hosting it.

An AI agent is the initial motivating example.

Example:

```text
agent://security-researcher
```

A distinct logical software principal is not required merely because software is described as an agent, autonomous process, bot, or automation.

Independent identity is justified when security-relevant properties differ from the hosting workload, including:

* Authority
* Delegator
* Policy
* Lifecycle
* Audit attribution
* Logical ownership
* Revocation boundary
* Concurrent actor population

Therefore:

```text
logical software principal
        ≠
automatically every software process
```

and:

```text
AI agent
        ≠
automatically independent principal
```

This category exists to model security boundaries rather than implementation labels or behavioral descriptions.

AI agents are the first use case evaluated by this architecture, but the abstraction is intentionally broader than AI.

---

## 5. Roles That Are Not Principal Types

The following terms must not automatically become principal categories:

| Term                 | Model                                                       |
| -------------------- | ----------------------------------------------------------- |
| Delegator            | Role performed by a principal                               |
| Service              | Logical system role; may be a resource and/or principal     |
| Tool                 | Capability/resource unless independent identity is required |
| API                  | Interface/resource, not inherently a principal              |
| Resource owner       | Role performed by a principal                               |
| Administrator        | Privileged role of a principal                              |
| Issuer               | Authority role performed by a principal/system              |
| Verifier             | Security role performed by a principal/system               |
| Policy administrator | Governance role                                             |
| Auditor              | Role performed by a human or workload principal             |

This prevents role taxonomy from becoming identity taxonomy.

---

## 6. Multi-Layer Identity Model

A security event may contain several distinct identity layers.

Example:

```text
Human Delegator
      │
      ▼
Logical Agent
      │
      ▼
Agent Instance
      │
      ▼
Hosting Workload
      │
      ▼
Workload Instance
      │
      ▼
Execution Environment
```

These identities answer different questions.

---

### 6.1 Delegating Identity

```text
Who granted authority?
```

Example:

```text
human://samuel
```

---

### 6.2 Logical Actor Identity

```text
Which persistent logical actor is acting?
```

Example:

```text
agent://research-agent
```

---

### 6.3 Actor Instance Identity

```text
Which specific runtime incarnation of that actor performed the action?
```

The term `identity` in this layer does not imply that every actor instance is an independently authenticated principal. In many cases, an instance identifier exists only for attribution and runtime correlation. Independent principal status requires a security boundary justified by the Identity Boundary Test.

Example:

```text
agent-instance://4f890...
```

---

### 6.4 Workload Identity

```text
Which software workload hosted or transmitted the action?
```

Example:

```text
spiffe://trust.example/agents/runtime
```

---

### 6.5 Workload Instance Identity

```text
Which specific workload execution instance handled the request?
```

Examples could eventually include:

* Process identifier
* Container identifier
* Pod identity
* Runtime-generated instance identifier

Instance identifiers may be evidence rather than globally meaningful identities.

---

### 6.6 Environment Identity

```text
Where did the workload execute?
```

Possible examples:

```text
node://cluster-a/node-17
device://server-54
tee://instance-91
```

Whether these become independent principals depends on the security architecture.

---

## 7. Identity Is Not a Hierarchy of Trust

The identity layers must not be interpreted as:

```text
human
  ↓ more trusted
agent
  ↓
workload
  ↓
host
```

Nor:

```text
attested host
      ↓
therefore trusted workload
      ↓
therefore trusted agent
      ↓
therefore authorized action
```

Each relationship requires its own evidence and policy interpretation.

A verified host identity may contribute evidence about a workload.

A verified workload may provide execution context for an agent.

Neither automatically establishes the authority of the next layer.

---

## 8. Workload Versus Instance

A logical workload should not normally be identified solely by an ephemeral process or container instance.

Model:

```text
Logical workload
payments-api
     │
     ├── instance-1
     ├── instance-2
     └── instance-3
```

Security implications:

* Scaling should not create unrelated logical identities unless required.
* Restarting a process should not automatically create a new logical workload.
* Compromising one instance may require revoking that instance without necessarily deleting the logical workload identity.
* Audit records should distinguish logical identity from execution instance where material.

The exact credential lifecycle remains outside this document.

---

## 9. AI Agent Versus Workload

The platform will not assume that:

```text
AI agent identity
        =
hosting workload identity
```

They may be identical in simple deployments.

They must be distinguishable when their security properties diverge.

---

### 9.1 Case: One Agent Per Workload

```text
Workload A
    │
    └── Agent A
```

If:

* exactly one logical agent is hosted,
* their lifecycle is identical,
* their authority is identical,
* their audit identity is identical,

then a separate agent principal might add no security value.

This model may permit identity collapse.

---

### 9.2 Case: Multiple Agents Per Workload

```text
             Workload Runtime
             /             \
            /               \
       Agent A             Agent B
       Finance             Research
```

If the agents possess different:

* Authority
* Delegators
* Goals
* Tools
* Resource access
* Lifecycles
* Audit requirements

then workload authentication alone cannot uniquely establish which logical agent caused an action.

A distinct logical agent identity becomes security relevant.

---

### 9.3 Case: One Agent Across Multiple Runtimes

```text
             Logical Agent
             /           \
            /             \
      Runtime A          Runtime B
```

If a logical agent can migrate, scale, or execute concurrently across multiple workloads, its logical identity cannot be defined solely by one hosting workload credential.

---

## 10. H-02 Evaluation

Platform Charter hypothesis H-02 states:

> AI-agent identity may need to be distinct from the identity of its hosting workload.

### Current finding

**Supported, but not universally required.**

The principal model finds that distinct agent identity is justified when at least one of the following differs from the hosting workload:

* Authority
* Delegator
* Lifecycle
* Audit identity
* Security policy
* Logical ownership
* Concurrent actor population

Therefore the emerging architecture rule is:

> **Identity boundaries should follow security-relevant distinctions, not implementation-process boundaries.**

This finding is not yet an ADR decision.

---

## 11. Principal Identity Versus Authentication Mechanism

The principal model must not depend on a specific credential technology.

For example:

```text
Logical workload
        │
        ├── X.509 credential
        ├── JWT credential
        └── future credential format
```

Changing credential format should not necessarily change the underlying logical principal.

Similarly:

```text
agent://research-agent
```

must not be defined as:

```text
whatever JWT happens to represent the agent
```

Identity semantics should exist independently of credential encoding.

---

## 12. SPIFFE Interaction

SPIFFE may eventually provide cryptographically verifiable workload identity.

Conceptually:

```text
Logical workload principal
          │
          ▼
       SPIFFE ID
          │
          ▼
         SVID
```

The SPIFFE ID represents workload identity.

The SVID communicates that identity in a verifiable credential.

The Autonomous Trust Platform must not infer that the SPIFFE ID necessarily identifies:

* Human delegator
* Logical AI agent
* Agent instance
* Authorization scope
* Purpose
* Requested action

unless those relationships are explicitly modeled elsewhere.

SPIFFE adoption remains subject to future architecture decisions.

---

## 13. WIMSE Interaction

The emerging WIMSE architecture treats workload identity independently from the specific credential carrying that identity.

That model is compatible with this project's distinction between:

```text
logical workload identity
```

and:

```text
credential representation
```

WIMSE is currently IETF work in progress.

No WIMSE adoption decision is made by this principal model.

---

## 14. Principal Context

A future trust decision should be capable of carrying a structured principal context rather than collapsing everything into a single `subject` string.

Conceptual example:

```text
principal_context:

  actor:
    logical_id: agent://security-researcher
    instance_id: agent-instance://a183

  runtime:
    workload_id: spiffe://trust.example/agent-runtime
    instance_id: runtime-instance://8751

  environment:
    node_id: node://cluster-a/worker-7

  delegation:
    delegator: human://samuel
```

This is an architecture model only.

It does not define:

* Token format
* API schema
* Credential format
* Authorization protocol

Those remain future work.

---

## 15. Attribution Chain

For autonomous actions, audit evidence should eventually support reconstruction of:

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
Capability Invoked
    │
    ▼
Resource Affected
```

Not every action will require every layer.

The required attribution depth should be proportional to the security consequence of the action.

---

## 16. Principal Lifecycle

Each principal type may have different lifecycle characteristics.

### Logical Principal Lifecycle

Possible states:

```text
created
active
suspended
retired
revoked
deleted
```

### Principal Instance Lifecycle

Possible states:

```text
started
active
terminated
```

### Credential Lifecycle

Possible states:

```text
issued
valid
expired
revoked
rotated
```

These lifecycles must remain distinguishable.

Example:

```text
credential expired
```

does not necessarily mean:

```text
logical principal retired
```

---

## 17. Identity Boundary Test

Before assigning an independent principal identity to an entity, the architecture should ask:

### Question 1

Does the entity independently exercise actions relevant to security?

### Question 2

Can its authority differ from the entity hosting or creating it?

### Question 3

Does its lifecycle differ materially from the hosting entity?

### Question 4

Must audit evidence distinguish it independently?

### Question 5

Can policy apply independently to it?

### Question 6

Would compromise or revocation need to affect it independently?

If the answers are consistently no, a separate principal identity may create complexity without meaningful security benefit.

---

## 18. Scenario Validation

### Scenario A — Two AI Agents in One Runtime

```text
Runtime R
├── Agent A
└── Agent B
```

If Agent A and Agent B possess different authority:

**Required identities**

* Runtime workload identity
* Agent A logical identity
* Agent B logical identity

**Conclusion**

Runtime identity alone is insufficient for actor attribution.

---

### Scenario B — Agent Restart

```text
Agent A
   │
instance-1
   │ terminates
   ▼
instance-2
```

**Required distinction**

```text
logical agent identity
        ≠
agent instance identity
```

**Conclusion**

Restart should not automatically create a new logical principal.

---

### Scenario C — Workload Credential Rotation

```text
payments-api
     │
 credential-1 expires
     │
 credential-2 issued
```

**Conclusion**

Credential lifecycle is independent from logical workload identity.

---

### Scenario D — CI Runner Acting for Developer

```text
Human Developer
       │
       ▼
    CI Runner
       │
       ▼
Deployment API
```

Relevant identities may include:

* Human initiating principal
* CI workload principal
* Deployment target

The CI runner's workload identity does not by itself represent the human's authority.

Delegation architecture is required later.

---

### Scenario E — Agent Tool Invocation

```text
Agent
  │
  ▼
Tool
  │
  ▼
Protected API
```

The tool is initially modeled as a capability.

If the tool implementation authenticates independently to the protected API, its runtime may also possess a workload principal.

The capability itself does not automatically require a principal identity.

---

### Scenario F — Valid Workload, Expired Agent Delegation

```text
Workload credential:
VALID

Agent identity:
VALID

Delegated authority:
EXPIRED
```

**Conclusion**

Principal identity remains valid while authority may independently become invalid.

This document does not define the resulting authorization decision, but the model preserves the information needed for that decision.

---

### Scenario G — Stolen Runtime Credential

An attacker obtains a credential representing the hosting workload.

The credential may permit impersonation of the workload depending on the authentication architecture.

It must not automatically establish which logical agent legitimately originated a historical or current action.

**Conclusion**

Credential possession, runtime identity, and logical actor attribution must remain distinguishable.

---

### Scenario H — One Agent Across Multiple Runtimes

```text
Agent A
├── Runtime 1
└── Runtime 2
```

**Conclusion**

Where the logical agent persists across runtime boundaries, workload identity cannot serve as its complete logical identity.

---

## 19. Security Invariants Emerging From This Model

The following model-specific invariants are incorporated into the accepted Sprint 1 Security Invariants architecture:

### PI-01

A credential must not be treated as the principal itself.

### PI-02

Authentication of a hosting workload must not automatically establish the identity of every logical actor hosted within it.

### PI-03

Logical principal identity must remain distinguishable from ephemeral runtime instance identity where their lifecycles differ.

### PI-04

Delegator is a role and authority relationship, not a principal category.

### PI-05

Tools and resources must not receive independent principal identities unless a security requirement justifies them.

### PI-06

Audit evidence for autonomous actions must preserve sufficient principal context to distinguish actor, runtime, and delegator where those boundaries affect security.

### PI-07

Identity validity must remain conceptually independent of authority validity.

These model-specific invariants are incorporated into `docs/architecture/security-invariants.md`.

---

## 20. Open Questions

The following questions remain unresolved:

1. What canonical namespace should represent logical AI-agent identity?
2. Should agent identifiers be globally stable or scoped to a trust domain?
3. Who is authorized to create an agent principal?
4. What constitutes sufficient evidence to bind an agent to its runtime?
5. Can an agent instance execute simultaneously in multiple workloads?
6. Must every agent instance receive a unique identifier?
7. When should service identity be modeled independently from workload identity?
8. Which infrastructure components require independent principal identities?
9. How should federated principal identity map across trust domains?
10. How should logical principal retirement interact with credential revocation?
11. How should an agent's principal identity be bound to delegated authority?
12. Which principal identities belong in authorization decisions versus audit-only context?

---

## 21. Architecture Decisions Not Made

This document does not select:

* SPIFFE/SPIRE
* WIMSE
* OAuth
* OIDC
* X.509
* JWT
* Kubernetes identities
* Cloud workload identity
* Agent-token formats
* Authorization engines
* Delegation protocols

It establishes the principal semantics against which those technologies may later be evaluated.

---

## 22. Task 2 Exit Criteria

The Principal Model is ready for acceptance when it can explain:

* What constitutes a principal
* Difference between actor and principal
* Difference between principal and subject
* Difference between logical identity and instance identity
* Difference between identity and credential
* Workload versus runtime identity
* Agent versus workload identity
* Delegator as role rather than type
* Tool/resource treatment
* Multi-layer attribution
* All required validation scenarios

Any consequential architecture decision resulting from this model must then be evaluated for ADR treatment.

---

## References

National Institute of Standards and Technology, *Zero Trust Architecture — NIST SP 800-207*
https://nvlpubs.nist.gov/nistpubs/specialpublications/NIST.SP.800-207.pdf

SPIFFE, *SPIFFE Identity and Verifiable Identity Document Specification*
https://spiffe.io/docs/latest/spiffe-specs/spiffe-id/

IETF WIMSE Working Group, *Workload Identity in a Multi System Environment (WIMSE) Architecture — draft-ietf-wimse-arch-08*
https://datatracker.ietf.org/doc/draft-ietf-wimse-arch/

IETF WIMSE Working Group, *Workload Identifier — draft-ietf-wimse-identifier-03*
https://datatracker.ietf.org/doc/draft-ietf-wimse-identifier/

IETF OAuth Working Group, *Transaction Tokens — draft-ietf-oauth-transaction-tokens-11*
https://datatracker.ietf.org/doc/draft-ietf-oauth-transaction-tokens/
