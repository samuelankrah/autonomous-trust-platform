# Autonomous Trust Platform — Delegated Authority Model

**Status:** Accepted
**Accepted Date:** 2026-08-09
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Artifact Owner:** Trust Platform — Control Plane
**Architecture Domain:** Authority, delegation, redelegation, revocation, authorization context, and accountability

---

## 1. Purpose

This document defines the delegated-authority model for the Autonomous Trust Platform.

Its purpose is to explain how bounded authority may legitimately be granted from one principal to another while preserving:

* Authority provenance
* Scope
* Lifetime
* Constraints
* Revocation
* Delegation depth
* Accountability
* Local authorization control
* Enforcement boundaries

Delegated authority is treated independently from identity, authentication, attestation, credentials, and trust.

No delegation protocol, token format, authorization engine, or vendor technology is selected by this document.

---

## 2. Governing Question

Every delegated action must eventually answer:

> **By what legitimate chain of authority may this principal perform this action, who granted that authority, what was the grantor permitted to delegate, what constraints apply, and can the resulting action be independently revoked and audited?**

The existence of an authenticated principal does not answer this question.

---

## 3. Authority

For this platform:

> **Authority is security-relevant permission or power recognized within a defined authorization context to perform, cause, approve, or further delegate specified actions under defined constraints.**

Authority is always contextual.

Authority may be limited by:

* Principal
* Resource
* Action
* Purpose
* Audience
* Time
* Location
* Environment
* Risk state
* Delegation depth
* Policy
* Trust evidence

Authority must not be treated as an intrinsic universal property of identity.

---

## 4. Identity Is Not Authority

A principal may possess a valid identity while possessing no authority for a requested operation.

Therefore:

```text
valid identity
      ≠
valid authority
```

Likewise:

```text
successful authentication
      ≠
authorization
```

Identity establishes who or what is interacting.

Authority establishes what that principal may legitimately exercise.

---

## 5. Authority Validity Is Independent

Authority may become invalid while identity remains valid.

Example:

```text
Agent identity:
VALID

Delegation:
EXPIRED

Result:
identity remains valid
authority does not
```

Credential renewal must not silently renew delegated authority.

---

## 6. Delegation

For this platform:

> **Delegation is the governed grant of bounded authority by a delegating principal to another principal, derived from authority the delegator is permitted to delegate.**

Delegation is therefore not necessarily a transfer.

The delegator may retain its own authority after delegation.

---

## 7. Delegator

A **delegator** is a role performed by a principal that grants bounded authority to another principal.

Delegator is not a principal category.

Possible delegators include:

* Human principals
* Workload principals
* Infrastructure principals
* Logical software principals
* Governance services

A principal may act as a delegate in one interaction and a delegator in another.

---

## 8. Delegate

A **delegate** is the principal receiving bounded authority through delegation.

Receiving authority does not change the delegate's underlying identity.

Conceptually:

```text
Principal B
   │
   ├── identity: B
   │
   └── delegated authority:
          derived from A
```

The delegate must not be treated as the delegator merely because it acts using delegated authority.

---

## 9. Authority Source

An **authority source** identifies the governance basis from which delegated authority ultimately derives.

Possible authority sources include:

* Resource owner
* Administrative authority
* Policy authority
* Organization
* Service owner
* Contractual authority
* Application governance function

The immediate delegator is not necessarily the ultimate authority source.

---

## 10. Delegation Authority

**Delegation authority** is the authority to grant defined authority to another principal.

This is distinct from authority to personally perform the delegated operation.

Therefore:

```text
may perform action
      ≠
may delegate action
```

and:

```text
may delegate action
      ≠
must personally be able to perform action
```

A governance principal may legitimately be allowed to grant access that it does not itself exercise.

---

## 11. Delegable Authority

**Delegable authority** is the maximum authority a delegator is permitted to grant.

Conceptually:

```text
Authority Granted
        ⊆
Delegable Authority
```

Delegable authority may itself be constrained by:

* Resource
* Action
* Lifetime
* Audience
* Purpose
* Maximum scope
* Maximum delegation depth
* Delegate class
* Assurance requirements

---

## 12. Exercisable Authority Versus Delegable Authority

The architecture distinguishes:

```text
Exercisable Authority
        ≠
Delegable Authority
```

A principal may:

* Exercise but not delegate an authority
* Delegate but not personally exercise an authority
* Both exercise and delegate
* Possess neither

Future policy architecture must be capable of representing these distinctions where required.

---

## 13. Delegation Grant

A **delegation grant** is a security-relevant statement or relationship describing authority granted from a delegator to a delegate.

A grant should be capable of expressing:

* Delegator
* Delegate
* Authority source
* Resource
* Action
* Scope
* Audience
* Purpose
* Conditions
* Issue time
* Expiration
* Redelegation rights
* Delegation depth
* Revocation reference
* Proof-of-possession binding where applicable
* Policy reference
* Unique grant identifier

No representation format is selected by this model.

### Delegation Issuer

A **delegation issuer** is a principal or service that creates, signs, encodes, or otherwise represents a delegation grant in a form consumable by relying systems.

The delegation issuer is not necessarily:

- The delegator
- The authority source
- The resource owner
- The policy authority

For example, a centralized authorization service may issue a credential representing authority granted by another principal.

Therefore:

```text
delegation issuer
        ≠
delegator
        ≠
authority source
```

The ability to issue a delegation artifact must not automatically imply authority to determine arbitrary delegation scope.

The issuer may represent only grants permitted by the governing authority and policy.

---

## 14. Delegated Authority

**Delegated authority** is the bounded authority resulting from a valid delegation grant.

The grant describes the relationship.

Delegated authority is the security property resulting from that valid relationship.

---

## 15. Authority Envelope

An **authority envelope** represents an upper bound on authority available to a principal in a defined context.

It may include authority derived from:

* Direct grants
* Delegated grants
* Organizational roles
* Resource ownership
* Policy
* Other explicitly recognized authority sources

The authority envelope is not itself an authorization decision.

Authorization may permit only a subset of that envelope.

---

## 16. Effective Authorization

Authorization evaluates whether a requested action may occur.

Conceptually:

```text
Principal Identity
        +
Applicable Authority
        +
Resource
        +
Requested Action
        +
Policy
        +
Context
        +
Trust Evidence
        +
Revocation State
        ↓
Authorization Decision
```

Delegated authority is an input.

It is not the authorization decision itself.

---

## 17. Delegation Scope

Delegation must identify the scope of authority granted.

Scope may include:

```text
resource
action
operation
tenant
dataset
account
API
environment
transaction
purpose
```

Broad delegation such as:

```text
all resources
all actions
```

should require explicit justification.

---

## 18. Resource Binding

Delegated authority should identify the resources to which it applies.

Example:

```text
read
resource://finance/invoices
```

must not automatically authorize:

```text
read
resource://hr/payroll
```

even if the same API or infrastructure serves both resources.

---

## 19. Action Binding

Authority must identify permitted actions where the security model requires action-level distinctions.

Examples include:

```text
read
create
update
delete
approve
sign
transfer
delegate
```

Permission to read does not imply permission to modify.

---

## 20. Audience Binding

Delegated authority may be constrained to a particular audience or relying service.

Example:

```text
delegate:
agent://finance

audience:
api://invoice-service
```

must not automatically be reusable against:

```text
api://payroll-service
```

Audience binding helps constrain replay and unintended authority reuse.

---

## 21. Purpose Binding

Some delegations may require an explicit purpose.

Example:

```text
purpose:
reconcile-July-invoices
```

Purpose context does not replace resource or action restrictions.

It adds another constraint.

---

## 22. Temporal Constraints

Delegated authority should have explicit lifetime semantics where practical.

Potential properties include:

* Not-before
* Expiration
* Maximum duration
* Transaction lifetime
* Session lifetime

Expiration is not equivalent to revocation.

---

## 23. Authority Attenuation

**Attenuation** means making authority narrower.

Example:

```text
A may delegate:
read + update
all invoices
24 hours

A delegates to B:
read only
invoice-set-42
2 hours
```

The resulting authority is narrower than the delegable authority.

Attenuation is a desirable property for redelegation.

---

## 24. Non-Amplification

Delegation must not create authority beyond the authority that the delegator is permitted to grant.

Therefore:

```text
GrantedAuthority
        ⊆
DelegableAuthority
```

For redelegation:

```text
A → B → C
```

authority granted by B to C must remain within the portion B is permitted to redelegate.

---

## 25. Multiple Authority Sources

A principal may receive authority from multiple independent sources.

Example:

```text
Agent A
├── Authority from Human H
├── Authority from Service Owner S
└── Direct platform authority
```

These authority sources must remain attributable.

The architecture must not assume that authority from multiple sources is automatically additive.

Local authorization policy determines how overlapping, conflicting, or independent authority sources are interpreted.

---

## 26. Authority Composition

Where several authority grants apply to one request, composition must be explicit.

Possible policies include:

* Union
* Intersection
* Most restrictive
* Priority
* Resource-specific interpretation

This model does not select one universal composition rule.

---

## 27. Redelegation

**Redelegation** occurs when a delegate grants some permitted authority onward to another principal.

Conceptually:

```text
A
│ delegates
▼
B
│ redelegates
▼
C
```

Redelegation must not be presumed.

It must be explicitly permitted.

---

## 28. Redelegation Default

The platform adopts the architectural preference:

> **Redelegation is denied unless explicitly permitted by the applicable delegation relationship or policy.**

This reduces unintended authority propagation.

This remains proposed until accepted through ADR treatment.

---

## 29. Delegation Depth

Delegation relationships may constrain maximum chain depth.

Example:

```text
A → B
```

may permit:

```text
B → C
```

but prohibit:

```text
C → D
```

Depth limits constrain authority propagation and simplify auditability.

---

## 30. Delegation Chain

A **delegation chain** is the ordered sequence of grants linking the authority source to the principal exercising authority.

Example:

```text
Human H
   │
   ▼
Agent A
   │
   ▼
Sub-Agent B
```

Each edge must independently preserve:

* Authority provenance
* Scope
* Validity
* Redelegation permission
* Revocation status

---

## 31. Delegation Is Not Generic Trust Transitivity

Delegation chains do not mean:

```text
A trusts B
B trusts C
therefore A trusts C
```

Instead:

```text
A authorized B
to grant defined authority
within defined scope
to C
```

is a separately governed relationship.

The chain must be validated according to delegation semantics.

---

## 32. Revocation

Delegated authority must be capable of becoming invalid independently from identity where the architecture requires it.

Possible revocation targets include:

* Individual grant
* Delegate
* Delegator
* Delegation chain
* Resource
* Authority source
* Policy
* Federation relationship

---

## 33. Expiration Is Not Revocation

Expiration is predetermined invalidation based on time.

Revocation is an active change to authority state.

Therefore:

```text
short-lived grant
      ≠
revocable grant
```

Short lifetime reduces some exposure but does not replace revocation architecture.

---

## 34. Delegator Revocation

The architecture must determine what happens when the authority of a delegator is revoked.

Potential questions include:

* Are downstream grants immediately invalid?
* Do grants remain valid until expiration?
* Does revocation depend on why the delegator lost authority?
* Can a separate authority preserve downstream grants?

A derived grant must not silently outlive the authority basis from which it was derived.

If the delegator loses the authority that made a downstream grant valid, the downstream grant must become invalid unless:

- The grant was explicitly defined as surviving that change, and
- The applicable authority source permits such survivability, or
- Another independent authority source re-establishes the grant.

Therefore:

```text
revoked authority basis
        ↓
derived authority
must be re-evaluated
```

---

## 35. Authority-Source Revocation

If the ultimate authority source withdraws the underlying authority, grants derived solely from that authority must no longer be treated as valid solely on the basis of their previously issued delegation artifacts.

The affected derived authority must be re-evaluated.

A still-valid signature, token, certificate, or other delegation artifact must not by itself preserve authority after the underlying authority basis has been withdrawn.

Unless another independent authority source establishes a valid basis for the grant, the derived authority becomes invalid.

Conceptually:

```text
Authority Source
      │
      │ withdrawn
      ▼
Derived Grant
      │
      ▼
authority basis no longer valid
```

---

## 36. Identity Revocation Versus Authority Revocation

The architecture distinguishes:

```text
Identity Revocation
        ≠
Authority Revocation
```

A principal identity may remain valid while one authority grant is revoked.

Conversely, an identity may be disabled while audit evidence must preserve the historical authority chain.

---

## 37. Impersonation

**Impersonation** occurs when one principal acts using the identity or security context of another principal in a way that may make the action appear to originate directly from the impersonated principal.

Impersonation and delegation are not equivalent.

Delegation should preserve:

```text
actual actor
+
authority source
```

Impersonation may obscure that distinction if poorly designed.

---

## 38. Delegation Preferred Over Identity Collapse

Where accountability matters, the architecture should prefer preserving:

```text
Actor:
Agent A

Acting under authority from:
Human H
```

rather than representing the event merely as:

```text
Actor:
Human H
```

when Human H did not directly perform the action.

---

## 39. On-Behalf-Of Context

A principal may act **on behalf of** another principal.

This relationship must identify:

* Actual actor
* Represented principal
* Authority source
* Requested action
* Applicable delegation

“On behalf of” must not be treated as an informal synonym for unrestricted impersonation.

---

## 40. Authority Credential

A credential may communicate or prove an authority claim.

Possession of such a credential does not inherently prove:

* Correct delegation policy
* Current revocation status
* Correct resource interpretation
* Authorization for every possible action

Credential validation and authority evaluation remain separate.

---

## 41. Bearer Authority

A bearer-style authority artifact may be usable by whoever possesses it.

This creates security dependence on possession.

The architecture must consider:

* Theft
* Replay
* Audience restriction
* Lifetime
* Secure transport
* Revocation

No bearer-token architecture is selected by this document.

---

## 42. Proof-of-Possession Authority

Authority may instead be cryptographically bound to a principal or key.

Conceptually:

```text
Delegation Grant
      │
      │ bound to
      ▼
Delegate Key
```

Proof of possession can reduce misuse of stolen authority artifacts.

It does not expand the semantic scope of the delegated authority.

---

## 43. Ambient Authority

**Ambient authority** exists when a principal can exercise authority simply because its execution environment already possesses broadly usable credentials or permissions.

Example:

```text
Agent
   │
   ▼
Hosting workload
   │
   └── powerful cloud role
```

If the agent can automatically exercise the workload's entire role, logical actor authority may collapse into runtime authority.

This can violate ADR-0002.

---

## 44. Host Authority Is Not Agent Authority

A hosting workload may possess authority unrelated to the logical principal it executes.

Therefore:

```text
Host Workload Authority
        ≠
Agent Authority
```

unless an explicit architecture decision establishes that equivalence.

The platform should avoid silently inheriting all host authority into a logical agent.

---

## 45. Agent-to-Runtime Binding and Authority

A valid agent-to-runtime identity binding proves the relationship between logical actor and hosting workload.

It does not define the agent's application authority.

Therefore:

```text
Agent bound to workload
        ≠
Agent authorized for workload permissions
```

Authority must still be explicitly established.

---

## 46. Human-to-Agent Delegation

A human principal may delegate bounded authority to an AI agent.

Example:

```text
Human H
   │
   │ grant:
   │ read invoices
   │ tenant X
   │ until 17:00
   ▼
Agent A
```

The system should preserve:

* Human delegator
* Agent delegate
* Grant identifier
* Scope
* Lifetime
* Requested action
* Runtime identity
* Authorization decision

---

## 47. Agent-to-Agent Delegation

An agent may delegate authority to another agent only if redelegation is explicitly permitted.

Example:

```text
Human H
   │
   ▼
Coordinator Agent A
   │
   ▼
Specialist Agent B
```

Agent A must not manufacture authority for B merely because it can invoke B.

Invocation capability is not delegation authority.

---

## 48. Tool Invocation Is Not Delegation

The ability to call a tool does not necessarily mean the tool has received delegated authority.

Possible models include:

```text
Agent directly exercises authority
through tool
```

or:

```text
Tool independently receives
delegated authority
```

These architectures have different accountability and identity semantics.

They must not be conflated.

---

## 49. Confused Deputy

A **confused deputy** occurs when a principal with authority is induced to use that authority for a requester that was not entitled to the resulting action.

Example:

```text
Requester
    │
    ▼
Powerful Service
    │
    ▼
Protected Resource
```

The powerful service may possess legitimate authority while incorrectly exercising it on behalf of an unauthorized requester.

---

## 50. Confused-Deputy Mitigation Principle

Authorization should preserve sufficient context to bind:

```text
requesting principal
+
delegated authority
+
target resource
+
requested action
+
audience
```

The deputy's own authority must not substitute for authority of the requester where the security model requires delegated authority.

---

## 51. Cross-Domain Delegation

Delegated authority may cross trust or authorization domains only through explicitly governed relationships.

Example:

```text
Domain A
    │ delegated authority
    ▼
Domain B
```

Domain B must independently determine whether it accepts:

* Delegation authority from Domain A
* Delegation representation
* Delegator identity
* Scope semantics
* Redelegation semantics
* Revocation model

---

## 52. Authorization Sovereignty

Authentication or delegation federation does not remove local authorization authority.

Therefore:

```text
External delegation accepted
        ≠
requested action automatically allowed
```

The local authorization domain retains control unless a separately governed architecture explicitly delegates that control.

---

## 53. Delegation Federation

Delegation federation introduces authority consequences beyond identity federation and therefore requires separate governance.

Identity federation establishes:

```text
I can authenticate who this is
```

Delegation federation may establish:

```text
I accept that an external authority
may confer some authority
inside my domain
```

This requires explicit governance.

No delegation-federation protocol is selected here.

---

## 54. Attestation and Delegated Authority

Attestation evidence may affect authorization policy.

It must not itself create delegated authority unless an explicit authority policy defines that relationship.

Therefore:

```text
attested runtime
      ≠
delegated authority
```

Attestation describes security-relevant evidence.

Delegation identifies authority provenance.

---

## 55. Trust and Delegated Authority

Trust evaluation may influence whether a delegation claim is accepted.

Trust does not itself determine the delegated scope.

Therefore:

```text
trusted delegator
      ≠
unlimited delegation
```

Authority remains purpose- and scope-specific.

---

## 56. Policy Authority and Delegation Authority

The authority to define delegation policy is distinct from the authority to issue individual delegation grants.

Example:

```text
Policy Authority
   │ defines:
   │ managers may delegate
   │ read-only invoice access
   ▼
Manager
   │ grants:
   ▼
Agent
```

Different compromise implications apply to each role.

---

## 57. Delegation Administration

The platform must identify who may:

* Create delegation policy
* Issue grants
* Modify grants
* Revoke grants
* Approve redelegation
* Change maximum scope
* Change lifetime
* Change delegation depth

These administrative authorities are themselves security-relevant.

---

## 58. Authority Concentration

Concentrating identity issuance, policy administration, delegation issuance, revocation, and enforcement under one administrative authority creates correlated compromise risk.

The platform does not require separate products for every function.

It requires these dependencies to be visible.

---

## 59. Delegation Failure

Delegation evaluation may fail because:

* Delegator cannot be authenticated
* Delegate cannot be authenticated
* Grant expired
* Grant revoked
* Scope mismatch
* Audience mismatch
* Resource mismatch
* Redelegation prohibited
* Delegation depth exceeded
* Authority source invalid
* Policy unavailable
* Revocation state unavailable

Failure behavior must be explicit.

---

## 60. Fail-Open Delegation

The platform must not assume that unavailable delegation verification should automatically permit access.

Example:

```text
revocation service unavailable
        ↓
accept old grant
```

may violate the intended authority boundary.

Failure policy must be risk-specific.

---

## 61. Authority Amplification Failure

A severe failure occurs when a delegation path creates authority that no legitimate authority source granted.

Example:

```text
A may delegate:
read

B receives:
read

B delegates:
admin
```

This is authority amplification.

The architecture must make such escalation detectable and rejectable.

---

## 62. Delegation Replay

A valid delegation artifact may still be misused if replayed outside its intended context.

Potential constraints include:

* Audience
* Purpose
* Nonce
* Transaction identifier
* Lifetime
* Proof-of-possession binding

No replay-prevention mechanism is selected here.

---

## 63. Delegation Audit Evidence

Delegated actions should preserve enough evidence to reconstruct:

* Actual acting principal
* Hosting workload where relevant
* Delegator
* Authority source
* Delegation grant
* Delegation chain
* Resource
* Action
* Scope
* Audience
* Relevant policy
* Revocation state
* Authorization decision
* Enforcement outcome
* Time

---

## 64. Attribution

Audit records should distinguish:

```text
Who acted?
Who authorized the actor?
Which runtime performed the action?
Under what authority?
```

These may represent different principals or contexts.

---

## 65. Scenario A — Human to AI Agent

```text
Human H
   │
   │ delegates
   │ invoice-read
   ▼
Agent A
   │
   │ runs on
   ▼
Workload W
   │
   ▼
Invoice API
```

Required interpretation:

* Human H is delegator.
* Agent A is delegate.
* Workload W is runtime.
* The workload identity authenticates runtime W.
* Agent identity identifies A where separate identity is required.
* Delegation establishes authority from H.
* Authorization determines whether the API request is permitted.

No one layer substitutes for the others.

---

## 66. Scenario B — Valid Identity, Expired Delegation

```text
Agent identity:
VALID

Runtime identity:
VALID

Delegation:
EXPIRED
```

The system must preserve the distinction:

```text
authenticated principal
        ≠
authorized action
```

---

## 67. Scenario C — Valid Delegation, Untrusted Runtime

```text
Agent delegation:
VALID

Runtime attestation:
UNACCEPTABLE
```

Depending on resource policy, authorization may deny the action.

Delegation validity does not override trust-evidence requirements.

---

## 68. Scenario D — Agent Redelegates Without Permission

```text
Human H
    │
    ▼
Agent A
    │
    └── redelegates
        despite prohibition
            ▼
        Agent B
```

Agent B must not obtain valid derived authority solely because Agent A created a downstream assertion.

Redelegation authority must itself be validated.

---

## 69. Scenario E — Workload Has More Authority Than Agent

```text
Workload W:
cloud-admin

Agent A:
invoice-read
```

The architecture must prevent Agent A from automatically inheriting `cloud-admin` solely because it executes inside W.

This is an ambient-authority risk.

---

## 70. Scenario F — External Delegation

```text
Domain A
Human H
   │
   │ delegates
   ▼
Agent A
   │ request
   ▼
Resource in Domain B
```

Domain B must separately evaluate:

* Identity federation
* Delegation federation
* Local policy
* Resource authority
* Revocation

Authentication of H or A does not automatically import H's authority into Domain B.

---

## 71. Scenario G — Confused Deputy

```text
User U
   │ asks
   ▼
Service S
   │ possesses powerful authority
   ▼
Resource R
```

Service S must not use its ambient authority for U unless policy establishes that U is entitled to the requested action.

The authorization context must preserve U where U's authority matters.

---

## 72. Scenario H — Delegator Loses Authority

```text
A delegates to B

later:

A's underlying authority revoked
```

The system must determine whether B's derived authority remains valid.

That dependency cannot be inferred from credential validity alone.

---

## 73. Scenario I — Multiple Delegators

```text
Agent A
├── grant from Finance Owner
└── grant from Compliance Owner
```

If both grants apply to a request, the authorization domain must explicitly define composition behavior.

No implicit union of authority is assumed.

---

## 74. Delegation Invariants

The following model-specific invariants are incorporated into the accepted Sprint 1 Security Invariants architecture.

### DA-01

Identity validity must remain independent from delegated-authority validity.

### DA-02

Authentication of a delegate must not by itself establish delegated authority.

### DA-03

Delegated authority must identify its delegator or authority provenance.

### DA-04

A delegator may grant only authority it is permitted to delegate.

### DA-05

Delegated authority must not amplify across redelegation.

### DA-06

Redelegation is prohibited unless explicitly permitted.

### DA-07

Delegated authority must be bounded by applicable resource, action, audience, purpose, time, and policy constraints where those dimensions are security relevant.

### DA-08

Delegated authority must be revocable independently from identity where architecture requires independent authority lifecycle.

### DA-09

Expiration must not be treated as equivalent to revocation.

### DA-10

A logical agent must not automatically inherit all authority of its hosting workload.

### DA-11

Attestation must not automatically create delegated authority.

### DA-12

Identity federation must not automatically establish delegation federation.

### DA-13

External delegation must remain subject to local authorization policy.

### DA-14

Delegation chains must preserve authority provenance.

### DA-15

Delegated-action audit evidence must distinguish actor, runtime, delegator, and authority source when those distinctions affect security.

### DA-16

Tool invocation must not automatically be interpreted as redelegation.

### DA-17

Authority from multiple sources must not automatically be composed through union.

### DA-18

Failure to verify delegation or revocation state must not silently increase authority.

### DA-19

The system that issues or represents a delegation artifact must not be assumed to be the delegator or underlying authority source.

### DA-20

Derived authority must be re-evaluated when the authority basis from which it was derived becomes invalid.

These model-specific invariants are incorporated into `docs/architecture/security-invariants.md`.
---

## 75. Candidate Architecture Decision

This model produces the following candidate decision:

> **Delegated authority must be explicit, attributable, bounded, non-amplifying, independently revocable where required, and evaluated separately from identity and authentication.**

A second candidate principle is:

> **Redelegation is denied by default and must preserve or reduce authority scope unless an independent authority source explicitly grants additional authority.**

A third candidate principle is:

> **Authorization domains retain final control over protected resources even when accepting externally issued identity or delegation assertions.**

These decisions remain proposed.

---

## 76. Open Questions

1. Which authority representations should the platform support?
2. Should delegation grants be bearer or proof-of-possession bound?
3. What should represent the authority source?
4. Which resources require explicit audience binding?
5. Which actions require purpose binding?
6. What maximum delegation depth should AI-agent chains support?
7. Which authority may permit redelegation?
8. Should human-to-agent delegation require explicit approval for every task or support reusable bounded grants?
9. How should authority composition work when several delegators contribute authority?
10. How should the platform represent non-delegable authority?
11. Which authority changes require immediate revocation?
12. How should revocation propagate across delegation chains?
13. How should disconnected systems evaluate revocation?
14. Which delegation events require independently verifiable audit evidence?
15. When may an agent use host-workload authority?
16. Which workload permissions must never become ambient agent authority?
17. How should external delegation federation be governed?
18. Should authority grants be transaction-bound?
19. When is impersonation ever acceptable?
20. How should break-glass delegation work?
21. How should delegated authority survive or terminate after agent migration?
22. How should delegated authority interact with runtime attestation?
23. How should policy changes affect previously issued grants?
24. How should authority be modeled when the delegator may delegate but not exercise the underlying action?
25. Which systems are permitted to issue delegation assertions?

---

## 77. Architecture Decisions Not Made

This document does not select:

* OAuth
* OAuth Token Exchange
* JWT
* Macaroons
* Capability tokens
* GNAP
* SPIFFE/SPIRE authorization integration
* WIMSE delegation mechanisms
* Cedar
* OPA
* Zanzibar-style authorization
* Relationship-based access control
* Policy engine
* Authorization server
* Token format
* Revocation protocol
* Proof-of-possession protocol
* Delegation database

Those mechanisms must be evaluated against the architecture established here.

---

## 78. Task 5 Exit Criteria

The Delegated Authority Model is ready for acceptance when it can explain:

* Authority
* Authority source
* Delegator
* Delegate
* Delegation authority
* Delegable authority
* Exercisable authority
* Delegation grant
* Delegated authority
* Authority envelope
* Scope
* Resource binding
* Action binding
* Audience
* Purpose
* Lifetime
* Attenuation
* Non-amplification
* Redelegation
* Delegation depth
* Delegation chains
* Revocation
* Expiration
* Identity-independent authority lifecycle
* Impersonation
* On-behalf-of context
* Bearer authority
* Proof of possession
* Ambient authority
* Human-to-agent delegation
* Agent-to-agent delegation
* Tool invocation
* Confused deputy
* Cross-domain delegation
* Delegation federation
* Authorization sovereignty
* Audit attribution
* Authority failure modes

Consequential decisions must be evaluated separately for ADR treatment.

---

## References to Existing Architecture

This model is governed by:

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/trust-standards-landscape.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`

No previous architecture decision is superseded by this proposed model.
