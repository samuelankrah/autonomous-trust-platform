# Sprint 2 Task 5 — Authorization and Enforcement Contract

**Project:** Autonomous Trust Platform
**Sprint:** Sprint 2 — Trust Control Contracts & Technology Evaluation Gate
**Task:** Task 5 — Authorization and Enforcement Contract
**Status:** Accepted
**Task Date:** 2026-08-16
**Accepted Date:** 2026-10-06
**Semantic Review:** PASS
**Owner:** Trust Platform — Control Plane
**Repository Baseline:** `6adddd6b2d1565166543a0aa81b54223b02c04e7`
**Roadmap Authority:** `docs/sprints/sprint-02-plan.md`
**Traceability Baseline:** `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
**Role Capability Baseline:** `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
**Interface Contract Baseline:** `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
**Authority / Anchor Baseline:** `docs/sprints/sprint-02-task-04-authority-trust-anchor-and-governance-matrix.md`

---

## 1. Objective

Define implementation-neutral authorization and enforcement contracts for protected actions in the Autonomous Trust Platform.

The governing question is:

> **What information may influence a local authorization decision, which authority is actually recognized, how is that decision scoped and bound to the protected request, where must enforcement occur, how are alternate paths handled, and what evidence demonstrates that the decision became effective?**

Task 5 establishes the architecture contract between:

* Authorization context
* Local policy
* Recognized authority
* Authorization decision
* Enforcement point
* Protected resource
* Enforcement evidence

It does not select:

* Authorization product
* Policy language
* Policy engine
* Gateway
* Sidecar
* Service mesh
* API management platform
* Cloud IAM service
* Agent framework
* Deployment topology

---

## 2. Why This Task Matters

Many architectures collapse several security functions into a single statement:

```text
User / Workload is authenticated
        ↓
Policy says allow
        ↓
Access happens
```

That is insufficient.

A trustworthy authorization path must distinguish:

```text
Identity Context
        ≠
Authority
```

```text
Policy
        ≠
Authorization Decision
```

```text
Authorization Decision
        ≠
Enforcement
```

```text
Enforcement Configuration
        ≠
Effective Enforcement
```

```text
Permit Decision
        ≠
Observed Protected Action
```

Task 5 turns these boundaries into explicit contracts.

---

# Authorization Model

## 3. Authorization Principle

Authorization determines whether a defined protected action is permitted within a local authorization domain.

A valid identity alone is insufficient.

A valid credential alone is insufficient.

A valid delegation artifact alone is insufficient.

A valid Attestation Result alone is insufficient.

The Authorization Decision Function must evaluate the security-relevant context required by local policy.

---

## 4. Local Authorization Sovereignty

The architecture preserves:

```text
External Authentication
        ≠
Local Authorization
```

and:

```text
External Delegation
        ≠
Automatic Local Access
```

and:

```text
External Attestation Result
        ≠
Local Authorization
```

The authorization domain protecting a resource retains local decision authority unless that authority has itself been explicitly delegated.

---

## 5. No Authority Amplification

Any authority recognized for a request must remain bounded by legitimately established authority.

The architecture preserves:

```text
RecognizedAuthority
        ⊆
LegitimatelyEstablishedAuthority
```

and:

```text
GrantedAuthority
        ⊆
DelegableAuthority
```

and:

```text
DecisionScope
        ⊆
RecognizedAuthority
```

A policy engine, decision service, credential issuer, Delegation Issuer, or Enforcement Point must not create new application authority merely because it can technically produce or consume an artifact.

---

## 6. Authorization Decision Function

Primary architecture role:

* `ROLE-012` — Authorization Decision Function

The function determines a local authorization result.

It may be:

* Centralized
* Distributed
* Embedded
* Remote
* Local to the resource
* Co-located with enforcement

Task 5 does not choose among these deployment models.

---

## 7. Enforcement Point

Primary architecture role:

* `ROLE-013` — Enforcement Point

The Enforcement Point is the function that makes the authorization decision effective on the protected path.

A decision without effective enforcement is not a completed authorization control.

---

## 8. Protected Resource

Primary architecture role:

* `ROLE-014` — Protected Resource

The Protected Resource is the target whose operations are governed.

The resource's authorization domain remains explicit even when authorization and enforcement are delegated to supporting components.

---

# Authorization Context Contract

## 9. AZ-001 — Required Authorization Context

**Requirement ID:** `AZ-001`

A local authorization decision must be based on explicit context sufficient for the protected action.

Applicable context may include:

* Logical Principal
* Runtime / Workload
* Principal-to-runtime binding
* Requested resource
* Requested action
* Delegated authority
* Authority Source
* Delegator
* Delegation constraints
* Attestation Result
* Environmental context
* Time
* Session
* Transaction
* Local policy
* Revocation state
* Cross-domain assertion
* Degraded-mode state

Not every action requires every input.

Required inputs are determined by the local security model and risk.

---

## 10. AZ-002 — Identity Context Is Not Authority

**Requirement ID:** `AZ-002`

Identity context may establish:

* Who or what is acting
* Which namespace is asserted
* Which runtime is involved
* Which logical principal is bound to the runtime
* Which trust domain validated the identity

Identity context does not by itself establish:

* Permission
* Delegation
* Resource authority
* Redelegation
* Policy eligibility

The Authorization Decision Function must not translate:

```text
Authenticated
```

into:

```text
Authorized
```

without an explicit authority and policy basis.

---

## 11. AZ-003 — Authority Provenance Must Be Preserved

**Requirement ID:** `AZ-003`

Where delegated or externally sourced authority influences the decision, the authorization context must retain sufficient provenance to identify:

* Authority Source
* Delegator
* Delegate
* Delegation Issuer where applicable
* Scope
* Constraints
* Validity
* Revocation state
* Redelegation chain where applicable

The final decision must not flatten authority provenance into an unqualified:

```text
role = admin
```

or equivalent context value when provenance affects security.

---

## 12. AZ-004 — Local Policy Governs Recognition

**Requirement ID:** `AZ-004`

Local policy determines whether otherwise valid identity, delegation, attestation, or external assertions are relevant to the protected resource.

The architecture preserves:

```text
Valid Evidence
        ≠
Locally Recognized Security Context
```

and:

```text
Locally Recognized Security Context
        ≠
Permit
```

Policy must be scoped to the authorization domain.

---

## 13. AZ-005 — Resource and Action Must Be Explicit

**Requirement ID:** `AZ-005`

Authorization must evaluate the exact protected operation.

At minimum, decision context must be capable of identifying:

```text
Principal
+
Resource
+
Action
```

Additional binding may include:

```text
Runtime
+
Transaction
+
Session
+
Environment
+
Authority
```

where required.

Broad identity-level authorization without resource/action context is non-conformant for operations whose security depends on that distinction.

---

## 14. AZ-006 — Authorization Domain Must Be Explicit

**Requirement ID:** `AZ-006`

Every protected resource must map to an authorization domain.

The domain must identify:

* Governance authority
* Policy Authority
* Authorization Decision Function
* Accepted identity contexts
* Accepted authority sources
* Accepted delegation mechanisms
* Required attestation where applicable
* Enforcement responsibility
* Failure behavior
* Audit requirements

A resource may participate in more than one domain only if the composition semantics are explicit.

---

# Authority Composition

## 15. AZ-007 — Multiple Authority Sources Require Explicit Composition

**Requirement ID:** `AZ-007`

If more than one authority source participates in a decision, the combining rule must be explicit.

Possible models include:

* Intersection
* Union
* Priority
* Hierarchical constraint
* Resource-specific override
* Transaction-specific combination

Task 5 does not select one universal combining algorithm.

The architecture prohibits implicit authority union.

---

## 16. AZ-008 — Delegated Authority Is Locally Constrained

**Requirement ID:** `AZ-008`

A valid delegation must still be evaluated against:

* Local policy
* Resource scope
* Action
* Delegate identity
* Current Authority Source
* Revocation
* Delegation depth
* Transaction or audience constraints
* Required security evidence

The architecture preserves:

```text
Valid Delegation
        ≠
Automatic Permit
```

---

## 17. AZ-009 — Host Authority Is Not Logical-Principal Authority

**Requirement ID:** `AZ-009`

A runtime or workload may hold infrastructure authority.

That authority must not silently become authority for every logical principal hosted within that runtime.

The authorization context must distinguish where material:

```text
Workload Authority
        ≠
Logical Principal Authority
```

---

## 18. AZ-010 — Tool Availability Is Not Delegation

**Requirement ID:** `AZ-010`

An agent, workflow, or software actor having technical access to a tool does not establish authority to use that tool for every purpose.

The authorization model must distinguish:

* Tool availability
* Tool invocation capability
* Delegated authority
* Resource authorization
* Action-specific permission

---

# Attestation in Authorization

## 19. AZ-011 — Attestation May Influence Policy, Not Replace Authorization

**Requirement ID:** `AZ-011`

An Attestation Result may be used as authorization context where local policy explicitly requires it.

Examples may include:

* Approved runtime class
* Approved software state
* Required TEE
* Required configuration
* Approved workload state

However:

```text
Attestation Result
        ≠
Identity
```

```text
Attestation Result
        ≠
Delegated Authority
```

```text
Attestation Result
        ≠
Authorization Decision
```

The Attestation Result is one possible input to the decision.

---

## 20. AZ-012 — Attestation Purpose Must Be Bound

**Requirement ID:** `AZ-012`

Where attestation affects authorization, the decision must identify:

* Which property matters
* Which Verifier is accepted
* Which appraisal policy is accepted
* Required freshness
* Required target binding
* Which resource/action requires it
* What happens if the Result is unavailable or indeterminate

A generic `attested=true` value is insufficient when security depends on specific attested properties.

---

# Freshness and Caching

## 21. AZ-013 — Freshness Is Input-Specific

**Requirement ID:** `AZ-013`

Authorization context must preserve distinct freshness for:

* Identity
* Principal-to-runtime binding
* Delegation
* Attestation
* Policy
* Revocation
* Environmental context
* Decision

The architecture prohibits collapsing all freshness into one request timestamp.

### Evidence Evaluation Clarification

Authorization evaluates decision-relevant evidence as distinct, policy-scoped inputs rather than as a universal scalar trust score for a principal.

Where local policy establishes a mandatory requirement, that requirement is non-compensable. Positive evidence in another dimension must not offset expired or revoked authority, a required evidence failure, or another failed mandatory policy gate.

This clarification does not create a new authority source, authorization result, policy engine, risk engine, or continuous-monitoring requirement. It refines the interpretation of existing Task 5 requirements, including `AZ-001`, `AZ-011` through `AZ-016`, `AZ-019` through `AZ-022`, and `CTL-001` through `CTL-012`.

---

## 22. AZ-014 — Cached Decisions Must Be Bounded

**Requirement ID:** `AZ-014`

Authorization decisions may be cached only where explicitly governed.

Cache policy must define:

* Maximum lifetime
* Resource scope
* Action scope
* Principal scope
* Transaction reuse
* Policy version
* Revocation dependency
* Attestation dependency
* Re-evaluation triggers
* Invalidation behavior

Cached decisions must not outlive the authority or security evidence required to justify them unless a specifically governed bounded-continuation policy permits it.

---

## 23. AZ-015 — Revocation Must Invalidate Relevant Decisions

**Requirement ID:** `AZ-015`

The system must define which revocation events invalidate:

* Existing sessions
* Cached decisions
* Delegation context
* Identity context
* Resource access
* In-flight transactions

Revocation semantics must be resource- and authority-specific.

---

## 24. AZ-016 — Policy Version Must Be Observable

**Requirement ID:** `AZ-016`

An authorization decision should identify the policy version or equivalent policy state used.

This enables:

* Audit reconstruction
* Re-evaluation
* Incident analysis
* Rollback detection
* Stale-policy detection

---

# Transaction Binding

## 25. AZ-017 — High-Risk Decisions May Require Transaction Binding

**Requirement ID:** `AZ-017`

Where reuse of a permit across requests would materially change security, the authorization decision must be bound to the specific transaction or request.

Potential binding dimensions include:

* Principal
* Runtime
* Resource
* Action
* Parameters
* Amount
* Destination
* Tool
* Data classification
* Session
* Request identifier
* Nonce
* Time window

Task 5 does not require transaction binding for every action.

---

## 26. AZ-018 — Parameter-Sensitive Authorization Must Preserve Parameters

**Requirement ID:** `AZ-018`

If authorization depends on request parameters, the decision and enforcement path must preserve those parameters.

Examples may include:

* Which secret
* Which key
* Which certificate
* Which database row
* Which API operation
* Which tool arguments
* Which transaction amount
* Which destination

A decision for one parameter set must not be reusable for a materially different parameter set.

---

# Authorization Outcomes

## 27. AZ-019 — Decision States

**Requirement ID:** `AZ-019`

Authorization must support at least:

```text
PERMIT
DENY
INDETERMINATE
```

Additional states may exist.

`INDETERMINATE` must remain distinguishable from `DENY`.

Failure behavior is further refined in Task 6.

---

## 28. AZ-020 — Permit Must Be Bounded

**Requirement ID:** `AZ-020`

A permit decision must specify enough context to prevent uncontrolled reuse.

It may include:

* Principal
* Resource
* Action
* Conditions
* Obligations
* Validity
* Transaction
* Decision identifier
* Policy version

---

## 29. AZ-021 — Deny Must Not Be Misreported as Enforcement

**Requirement ID:** `AZ-021`

A deny decision establishes that the Authorization Decision Function decided against the action.

It does not prove:

* The protected path was reached
* The Enforcement Point received the decision
* The resource was actually blocked
* An alternate path did not exist

Audit must preserve the distinction.

---

## 30. AZ-022 — Indeterminate Must Not Become Permit by Accident

**Requirement ID:** `AZ-022`

Unknown, unavailable, inconsistent, or incomplete authorization state must not silently become permit.

Any bounded continuation must be explicitly governed by Task 6 failure semantics.

---

# Enforcement Contract

## 31. ENF-001 — Effective Enforcement Is Required

**Requirement ID:** `ENF-001`

Protected actions must pass through an effective Enforcement Point where authorization is intended to constrain them.

The architecture preserves:

```text
Authorization Decision
        ≠
Effective Enforcement
```

---

## 32. ENF-002 — Complete Mediation Must Be Demonstrable

**Requirement ID:** `ENF-002`

For each protected operation, the architecture must identify:

* Intended Enforcement Point
* Protected path
* Alternate paths
* Administrative path
* Break-glass path
* Maintenance path
* Direct-resource path
* Internal service path

A control cannot be called effectively enforced if a materially equivalent ungoverned path exists.

---

## 33. ENF-003 — Decision-to-Request Binding

**Requirement ID:** `ENF-003`

The Enforcement Point must verify that the authorization decision applies to the exact request being enforced.

Where applicable, it must bind:

```text
Decision
+
Principal
+
Resource
+
Action
+
Request / Transaction
+
Validity
```

---

## 34. ENF-004 — Enforcement Must Honor Decision Constraints

**Requirement ID:** `ENF-004`

If the Authorization Decision Function returns constraints or obligations, the Enforcement Point must either:

* Enforce them
* Reject the operation
* Route to an explicitly defined compensating control

Ignoring a required constraint invalidates the intended authorization semantics.

---

## 35. ENF-005 — Enforcement Configuration Is Security-Relevant State

**Requirement ID:** `ENF-005`

Security-relevant enforcement configuration must be governed and auditable.

Examples include:

* Protected routes
* Policy-to-resource mapping
* Bypass configuration
* Decision-source trust
* Failover configuration
* Administrative override
* Emergency mode

Configuration state must not be treated as operational trivia.

---

## 36. ENF-006 — Alternate Paths Must Be Identified

**Requirement ID:** `ENF-006`

Architecture review must identify alternate paths capable of reaching the Protected Resource.

Potential alternate paths include:

* Direct network route
* Internal API
* Admin interface
* Batch interface
* Database connection
* Break-glass account
* Orchestrator control
* Cloud console
* Maintenance port
* Side channel
* Agent tool integration

Each path must be:

* Governed
* Explicitly excluded from the protected action
* Or demonstrated to be impossible

---

## 37. ENF-007 — Enforcement Bypass Is Explicit Authority

**Requirement ID:** `ENF-007`

Any capability to bypass normal enforcement is security-relevant authority.

Bypass must identify:

* Who may invoke it
* For which resource
* For which purpose
* Required approvals
* Expiration
* Audit evidence
* Recovery / retirement

Bypass must not exist as an undocumented operator convenience.

---

## 38. ENF-008 — Enforcement Must Validate Decision Source

**Requirement ID:** `ENF-008`

The Enforcement Point must validate that the decision came from an accepted Authorization Decision Function.

Validation may require:

* Service identity
* Signature
* Decision key
* Local trust anchor
* Channel authentication
* Decision identifier

Task 5 does not select the mechanism.

---

## 39. ENF-009 — Enforcement Failure Is Distinct

**Requirement ID:** `ENF-009`

The architecture preserves:

```text
Authorization Failure
        ≠
Enforcement Failure
        ≠
Resource Failure
        ≠
Audit Failure
```

Task 6 defines detailed degraded-mode behavior.

---

## 40. ENF-010 — Enforcement Outcome Must Be Observable

**Requirement ID:** `ENF-010`

The system must be able to produce evidence of what the Enforcement Point actually did.

Possible outcomes include:

* Allowed
* Denied
* Constrained
* Failed
* Bypassed
* Indeterminate
* Request not observed

Missing outcome evidence must not automatically be interpreted as successful enforcement.

---

## 41. ENF-011 — Resource-Side Corroboration May Be Required

**Requirement ID:** `ENF-011`

For high-value operations, evidence from the Enforcement Point alone may be insufficient.

The architecture may require corroborating evidence from:

* Protected Resource
* Independent audit path
* Transaction ledger
* Downstream system

The need for independent corroboration is risk-specific.

---

## 42. ENF-012 — Enforcement Must Not Redefine Policy

**Requirement ID:** `ENF-012`

The Enforcement Point may apply a decision and its constraints.

It must not silently redefine policy semantics unless it is explicitly also performing the Policy Authority or Authorization Decision Function role.

If roles are co-located, the logical distinction remains.

---

# Control Requirements

## 43. CTL-001 — Authorization Input Provenance

**Control ID:** `CTL-001`

Every security-relevant authorization input must retain enough provenance to identify:

* Producer
* Validation basis
* Trust authority or anchor
* Freshness
* Revocation
* Scope

where material.

---

## 44. CTL-002 — Authority Bound Check

**Control ID:** `CTL-002`

The Authorization Decision Function must reject authority that exceeds the legitimate source or delegation scope.

Required check:

```text
RequestedAuthority
        ⊆
RecognizedAuthority
        ⊆
LegitimatelyEstablishedAuthority
```

---

## 45. CTL-003 — Resource / Action Binding

**Control ID:** `CTL-003`

Authorization decisions and enforcement must remain bound to the intended resource and action.

---

## 46. CTL-004 — Decision Freshness Control

**Control ID:** `CTL-004`

The Enforcement Point must reject or revalidate stale authorization decisions according to resource-specific policy.

---

## 47. CTL-005 — Decision Source Validation

**Control ID:** `CTL-005`

The Enforcement Point must validate the Authorization Decision Function or decision artifact before acting on it.

---

## 48. CTL-006 — Bypass Governance

**Control ID:** `CTL-006`

Any bypass or alternate enforcement path must be explicitly governed, bounded, auditable, and revocable.

---

## 49. CTL-007 — Complete-Mediation Verification

**Control ID:** `CTL-007`

The architecture must support verification that all intended protected paths are mediated by an accepted Enforcement Point.

---

## 50. CTL-008 — Enforcement Outcome Evidence

**Control ID:** `CTL-008`

The Enforcement Point must produce or support evidence sufficient to distinguish permit decision from effective enforcement outcome.

---

## 51. CTL-009 — Cached-Decision Invalidation

**Control ID:** `CTL-009`

Cached decisions must be invalidated or re-evaluated upon applicable:

* Revocation
* Policy change
* Authority change
* Principal binding change
* Resource state change
* Attestation freshness expiration

---

## 52. CTL-010 — Transaction Substitution Resistance

**Control ID:** `CTL-010`

Where transaction binding is required, the authorization and enforcement path must prevent reuse of a valid decision for a materially different request.

---

## 53. CTL-011 — Unknown-State Preservation

**Control ID:** `CTL-011`

Unknown, stale, unavailable, or inconsistent inputs must remain distinguishable through the decision path.

The system must not collapse them into an unqualified `trusted=true`.

---

## 54. CTL-012 — Local Authorization Sovereignty

**Control ID:** `CTL-012`

Cross-domain identity, delegation, attestation, or policy inputs must be evaluated under local authorization policy before access is permitted.

---

# Decision Contract

## 55. Authorization Decision Record

A material authorization decision should be representable as:

```text
Decision ID
Principal
Runtime
Principal-to-Runtime Binding
Resource
Action
Recognized Authority
Authority Provenance
Applicable Delegation
Attestation Context
Policy Version
Environmental Context
Revocation State
Freshness State
Decision
Constraints / Obligations
Decision Validity
Transaction Binding
Failure State
```

Not every decision requires every field.

The applicable security model determines required content.

---

## 56. Decision Authenticity

Where the Authorization Decision Function is remote from the Enforcement Point, the decision must have sufficient integrity and origin assurance.

Possible mechanisms may include:

* Authenticated channel
* Signed decision
* Service identity
* Token
* Protected local IPC
* Trusted runtime boundary

Task 5 selects none.

---

## 57. Decision Minimality

A decision should contain only the security context required by the Enforcement Point.

The architecture should avoid exposing:

* Raw credentials
* Full Attestation Evidence
* Sensitive policy internals
* Unnecessary identity attributes

unless required.

Audit references or digests may preserve provenance without copying all source material.

---

# Resource Mapping

## 58. Resource Inventory Requirement

Before implementation, protected resources must be inventoried sufficiently to identify:

* Resource class
* Resource owner
* Authorization domain
* Protected actions
* Decision function
* Enforcement point
* Alternate paths
* Failure requirements
* Audit evidence

Task 5 defines the required model.

It does not create the final deployment inventory.

---

## 59. Resource Classes

Potential classes may include:

* API
* Secret
* Cryptographic key
* Signing operation
* Certificate issuance
* Database
* Agent tool
* Cloud resource
* Policy change
* Trust-anchor change
* Recovery action
* Federation change

These examples are non-exhaustive.

---

## 60. Administrative Actions Are Protected Actions

Security-relevant administration must be modeled as protected actions where appropriate.

Examples include:

* Changing trust anchors
* Changing policy
* Enabling federation
* Changing delegation roots
* Enabling bypass
* Changing audit retention
* Invoking recovery

Administrative APIs must not be excluded merely because they are not application data-plane requests.

---

# Local Sovereignty and Federation

## 61. Cross-Domain Identity

An external identity may establish authenticated subject context.

Local policy still decides whether that identity is relevant to the protected action.

---

## 62. Cross-Domain Delegation

An external delegation may establish bounded external authority.

Local policy decides whether that authority is recognized and under what constraints.

---

## 63. Cross-Domain Attestation

An external Attestation Result may establish an accepted appraisal conclusion.

Local policy decides whether the result is required, sufficient as one input, or irrelevant.

---

## 64. Federation Does Not Import Enforcement

A remote system's authorization or enforcement does not automatically satisfy local enforcement requirements.

The local Protected Resource must still have an effective enforcement path.

---

# Failure Boundary

## 65. Task 5 Failure Scope

Task 5 establishes the authorization/enforcement boundary.

Detailed behavior for:

* Unavailable decision service
* Stale policy
* Stale revocation
* Unknown identity
* Unknown delegation
* Unknown attestation
* Failed Enforcement Point
* Audit outage
* Recovery

is defined in Task 6.

Task 5 requires those states to remain distinguishable.

---

## 66. No Universal Fail-Open or Fail-Closed Rule

The architecture does not define one universal response for every failure.

Resource- and risk-specific policy must determine whether a failed dependency results in:

* Denial
* Bounded continuation
* Read-only behavior
* Reduced function
* Alternate governed path
* Resource shutdown

Task 6 will make those semantics explicit.

---

# Audit and Evidence

## 67. Authorization Audit Evidence

Audit should be able to reconstruct:

* Principal
* Runtime
* Resource
* Action
* Recognized authority
* Authority provenance
* Delegation
* Attestation context where relevant
* Policy
* Decision
* Decision time
* Failure state

---

## 68. Enforcement Audit Evidence

Audit should separately capture:

* Decision reference
* Enforcement Point
* Protected path
* Outcome
* Constraint enforcement
* Failure
* Bypass
* Alternate path
* Resource-side result where applicable

---

## 69. Decision and Outcome Correlation

The architecture should support:

```text
Authorization Decision
        ↔
Enforcement Outcome
```

using a stable correlation mechanism.

Without correlation, a permit decision cannot be reliably tied to the action that occurred.

---

# Co-location Rules

## 70. Decision and Enforcement May Be Co-Located

A single component may perform both:

* `ROLE-012`
* `ROLE-013`

This is permitted.

The architecture must still distinguish:

* Decision semantics
* Enforcement semantics
* Failure states
* Audit evidence

---

## 71. Policy, Decision, and Enforcement May Be Co-Located

A single product may implement:

* `ROLE-011`
* `ROLE-012`
* `ROLE-013`

This does not eliminate:

```text
Policy Authority
        ≠
Authorization Decision Function
        ≠
Enforcement Point
```

The design must evaluate shared compromise and administrative control.

---

## 72. Resource-Embedded Enforcement Is Permitted

A Protected Resource may enforce its own authorization.

The resource must still demonstrate:

* Complete mediation
* Decision correctness
* Alternate-path control
* Auditability
* Failure handling

---

# Verification Preparation

## 73. Positive Verification

Later Task 7 testing should be able to demonstrate:

* Legitimate authority is recognized
* Correct resource/action is permitted
* Required constraints are enforced
* Decision reaches the intended Enforcement Point
* Resource operation succeeds
* Evidence correlates decision and outcome

---

## 74. Negative Verification

Later Task 7 testing should be able to demonstrate rejection of:

* Valid identity without authority
* Valid delegation outside scope
* Revoked delegation
* Wrong resource
* Wrong action
* Wrong principal
* Wrong runtime binding
* Stale decision
* Replayed decision
* Missing required attestation
* External assertion lacking local acceptance
* Untrusted decision source

---

## 75. Failure Verification

Later Task 7 testing should be able to demonstrate behavior under:

* Decision service unavailable
* Revocation unavailable
* Policy stale
* Enforcement unavailable
* Audit unavailable
* Partial control-plane outage
* Compromised decision source
* Bypass attempted

Task 6 supplies the expected outcomes.

---

# Traceability Matrix

## 76. Authorization Requirements

| ID | Requirement | Primary Roles | Primary EDGE Dependencies |
|---|---|---|---|
| AZ-001 | Required authorization context | ROLE-012 | EDGE-008 |
| AZ-002 | Identity is not authority | ROLE-004, ROLE-012 | EDGE-001, EDGE-008 |
| AZ-003 | Preserve authority provenance | ROLE-008–010, ROLE-012 | EDGE-005, EDGE-006, EDGE-008 |
| AZ-004 | Local policy governs recognition | ROLE-011, ROLE-012 | EDGE-007, EDGE-008 |
| AZ-005 | Resource/action explicit | ROLE-012, ROLE-014 | EDGE-008, EDGE-009 |
| AZ-006 | Authorization domain explicit | ROLE-012, ROLE-014 | EDGE-008, EDGE-009 |
| AZ-007 | Explicit authority composition | ROLE-008, ROLE-012 | EDGE-006, EDGE-008 |
| AZ-008 | Delegation locally constrained | ROLE-012 | EDGE-006, EDGE-008 |
| AZ-009 | Host authority != actor authority | ROLE-001, ROLE-002, ROLE-012 | EDGE-002, EDGE-008 |
| AZ-010 | Tool availability != delegation | ROLE-001, ROLE-012 | EDGE-005, EDGE-008 |
| AZ-011 | Attestation is decision input | ROLE-006, ROLE-012 | EDGE-004, EDGE-008 |
| AZ-012 | Attestation purpose binding | ROLE-006, ROLE-007, ROLE-012 | EDGE-004, EDGE-008 |
| AZ-013 | Input-specific freshness | ROLE-012 | EDGE-008 |
| AZ-014 | Bounded decision caching | ROLE-012, ROLE-013 | EDGE-009 |
| AZ-015 | Revocation invalidates relevant decisions | ROLE-012, ROLE-013 | EDGE-011 |
| AZ-016 | Policy version observable | ROLE-011, ROLE-012 | EDGE-007, EDGE-009 |
| AZ-017 | Transaction binding where required | ROLE-012, ROLE-013 | EDGE-009 |
| AZ-018 | Parameter-sensitive authorization | ROLE-012, ROLE-013 | EDGE-008, EDGE-009 |
| AZ-019 | Decision states explicit | ROLE-012 | EDGE-009 |
| AZ-020 | Permit bounded | ROLE-012 | EDGE-009 |
| AZ-021 | Deny != enforcement | ROLE-012, ROLE-013 | EDGE-009, EDGE-010 |
| AZ-022 | Indeterminate not accidental permit | ROLE-012 | EDGE-009 |

---

## 77. Enforcement Requirements

| ID | Requirement | Primary Roles | Primary EDGE Dependencies |
|---|---|---|---|
| ENF-001 | Effective enforcement required | ROLE-013 | EDGE-009, EDGE-010 |
| ENF-002 | Complete mediation demonstrable | ROLE-013, ROLE-014 | EDGE-010 |
| ENF-003 | Decision-request binding | ROLE-012, ROLE-013 | EDGE-009 |
| ENF-004 | Constraints enforced | ROLE-013 | EDGE-009, EDGE-010 |
| ENF-005 | Enforcement configuration governed | ROLE-013, ROLE-017 | EDGE-007, EDGE-013 |
| ENF-006 | Alternate paths identified | ROLE-013, ROLE-014 | EDGE-010 |
| ENF-007 | Bypass is explicit authority | ROLE-013, ROLE-016 | EDGE-014 |
| ENF-008 | Decision source validated | ROLE-012, ROLE-013 | EDGE-009 |
| ENF-009 | Enforcement failure distinct | ROLE-013 | EDGE-010 |
| ENF-010 | Enforcement outcome observable | ROLE-013, ROLE-015 | EDGE-010, EDGE-013 |
| ENF-011 | Resource corroboration where required | ROLE-014, ROLE-015 | EDGE-010, EDGE-013 |
| ENF-012 | Enforcement does not redefine policy | ROLE-011, ROLE-012, ROLE-013 | EDGE-007, EDGE-009 |

---

## 78. Control Mapping

| Control | Primary Requirement Coverage |
|---|---|
| CTL-001 | AZ-001, AZ-003, AZ-013 |
| CTL-002 | AZ-007, AZ-008, AZ-020 |
| CTL-003 | AZ-005, AZ-017, AZ-018, ENF-003 |
| CTL-004 | AZ-014, AZ-015 |
| CTL-005 | ENF-008 |
| CTL-006 | ENF-006, ENF-007 |
| CTL-007 | ENF-001, ENF-002 |
| CTL-008 | AZ-021, ENF-010, ENF-011 |
| CTL-009 | AZ-014, AZ-015, AZ-016 |
| CTL-010 | AZ-017, AZ-018, ENF-003 |
| CTL-011 | AZ-013, AZ-019, AZ-022 |
| CTL-012 | AZ-004, AZ-006, AZ-008 |

---

# Invariant Traceability

## 79. Primary Security Invariants

Task 5 derives principally from:

* `SI-02` — Workload authentication does not establish every logical actor
* `SI-03` — Identity and authority lifecycles independently governable
* `SI-08` — No automatic symmetry or transitivity
* `SI-09` — Cross-domain trust purpose-scoped
* `SI-10` — Authentication federation != authorization federation
* `SI-17` — Attestation alone != identity, delegation, or authorization
* `SI-20` — No authority amplification
* `SI-22` — Delegation artifact is not independent Authority Source
* `SI-23` — Authority Source != Delegator != Delegation Issuer
* `SI-25` — Host workload authority != logical-agent authority
* `SI-27` — Identity/authentication/credential possession != authorization
* `SI-28` — External delegation remains local-authorization governed
* `SI-30` — Authorization requires effective enforcement
* `SI-31` — Failure/unknown must not silently broaden authority
* `SI-34` — Logical separation does not hide correlated compromise
* `SI-35` — Audit actor, runtime, and decision
* `SI-36` — Preserve authority provenance
* `SI-38` — Govern security-relevant trust-state changes

---

# Relationship to Task 6

## 80. Failure and Degraded-Mode Inputs

Task 6 must refine the behavior of:

* `AZ-013`
* `AZ-014`
* `AZ-015`
* `AZ-019`
* `AZ-022`
* `ENF-009`
* `CTL-004`
* `CTL-009`
* `CTL-011`

for explicit states including:

* VALID
* INVALID
* UNKNOWN
* UNAVAILABLE
* STALE
* INCONSISTENT
* DEGRADED
* RECOVERING

and must keep:

```text
COMPROMISED
```

as a distinct security condition rather than treating it as equivalent to ordinary availability failure.

---

# Relationship to Task 7

## 81. Verification Inputs

Task 7 must map:

```text
AZ / ENF Requirement
        ↓
CTL Control
        ↓
Enforcement Point
        ↓
Positive Test
        ↓
Negative Test
        ↓
Failure Test
        ↓
Evidence
```

Task 5 therefore defines the authorization/enforcement semantics that later verification must prove.

---

# Technology Evaluation Implications

## 82. Mandatory Candidate Questions

Any future authorization or enforcement technology must be evaluated against:

* Can it distinguish identity from authority?
* Can it represent authority provenance?
* Can it represent local authorization domains?
* Can it scope decisions to resource/action?
* Can it consume validated delegation without treating it as automatic permit?
* Can it use attestation as context without turning it into identity?
* Can it preserve input-specific freshness?
* Can it invalidate cached decisions?
* Can it bind decisions to requests or transactions?
* Can it express `PERMIT`, `DENY`, and `INDETERMINATE`?
* Can it preserve local policy sovereignty?
* Can enforcement validate decision source?
* Can enforcement prove complete mediation?
* Can alternate paths be identified and governed?
* Can bypass be explicitly controlled?
* Can enforcement outcomes be evidenced?
* Can policy, decision, and enforcement remain logically distinguishable even if co-located?

---

## 83. Disqualifying Semantic Failures

A candidate should fail the architecture gate if it requires the platform to accept any of the following as unavoidable semantics:

* Authenticated means authorized
* Valid delegation means permit
* Attested means authorized
* Policy distribution equals enforcement
* Authorization decision equals enforcement
* Permit can be reused without required binding
* Unknown revocation means valid
* External authorization automatically governs local resources
* Bypass cannot be identified
* Enforcement outcome cannot be distinguished from decision
* Authority provenance cannot be preserved

A future architecture change may revisit a requirement only through explicit Control Plane review.

---

# Task 5 Acceptance Gate

## 84. Acceptance Criteria

Task 5 passes when:

* Authorization context is explicitly defined.
* Identity and authority remain distinct.
* Authority provenance is preserved.
* Local authorization sovereignty is explicit.
* Resource and action are explicit decision dimensions.
* Authorization domains are explicit.
* Multiple authority sources require explicit composition.
* Delegation remains locally constrained.
* Host workload authority does not become logical-principal authority.
* Tool availability does not become delegation.
* Attestation remains decision input rather than authorization.
* Freshness is input-specific.
* Cached decisions are bounded.
* Revocation affects relevant decisions.
* Transaction binding exists where required.
* Decision states are explicit.
* Permit, deny, and indeterminate semantics are distinguishable.
* Effective enforcement is required.
* Complete mediation is demonstrable.
* Alternate paths and bypass are explicit.
* Enforcement verifies decision source.
* Enforcement outcome is observable.
* Resource-side corroboration may be required where risk justifies it.
* Policy, decision, and enforcement remain separate architecture roles.
* Control mappings are explicit.
* No technology is selected.

---

## 85. Failure Modes

Task 5 fails if:

* Identity is treated as authority.
* Credential possession is treated as permission.
* Delegation artifact is treated as independent Authority Source.
* Attestation Result is treated as authorization.
* Host workload authority is inherited by every logical actor.
* Tool access is treated as delegated authority.
* External authentication or delegation bypasses local policy.
* Resource/action scope is missing.
* Cached authorization is unbounded.
* Policy version is not observable.
* Transaction-sensitive decisions can be replayed across transactions.
* Authorization decision is called enforcement without a protected path.
* Alternate resource paths are ignored.
* Enforcement bypass is undocumented.
* Enforcement outcome cannot be distinguished from decision.
* One co-located product causes policy, authorization, and enforcement semantics to collapse.
* Unknown state silently becomes permit.

---

## 86. Definition of Done

Task 5 content is ready for acceptance when:

* [x] `AZ-001` through `AZ-022` are defined.
* [x] `ENF-001` through `ENF-012` are defined.
* [x] `CTL-001` through `CTL-012` are defined.
* [x] Authorization context contract is defined.
* [x] Authority composition is defined.
* [x] Delegation consumption semantics are defined.
* [x] Attestation-in-authorization semantics are defined.
* [x] Freshness and caching semantics are defined.
* [x] Transaction binding semantics are defined.
* [x] Decision states are defined.
* [x] Effective enforcement semantics are defined.
* [x] Complete mediation requirement is defined.
* [x] Alternate-path and bypass requirements are defined.
* [x] Enforcement outcome evidence is defined.
* [x] Local authorization sovereignty is defined.
* [x] Co-location rules are defined.
* [x] Verification preparation is defined.
* [x] Invariant traceability is defined.
* [x] Task 6 dependencies are defined.
* [x] Task 7 verification dependencies are defined.
* [x] Technology-evaluation implications are defined.
* [x] Mechanical document validation passes.
* [x] Semantic architecture review passes.

### Repository Closure Gate

Task 5 is not formally **COMPLETE** until:

* The accepted artifact is committed.
* The commit is pushed to `origin/main`.
* `HEAD == origin/main`.
* The working tree is clean.

---

# Proposed Decision

## 87. Task 5 Decision

The proposed Task 5 decision is:

> **Sprint 2 shall treat authorization as a local, resource-scoped decision over explicitly validated identity context, legitimately established authority, policy, resource/action context, required trust evidence, freshness, and revocation state. Authorization decisions shall be bounded and, where necessary, request- or transaction-bound. Effective security requires a separately identifiable Enforcement Point that mediates the protected path, validates the decision, applies required constraints, governs bypass, and produces evidence of the enforcement outcome.**

This is a derived architecture-to-implementation requirement.

It does not select an authorization engine, policy language, enforcement technology, or deployment topology.

---

## 88. ADR Assessment

No new ADR is proposed by Task 5 at this stage.

The authorization and enforcement contract derives from accepted:

* ADR-0002
* ADR-0003
* ADR-0005
* ADR-0006
* ADR-0007
* ADR-0008

If semantic review identifies a materially new cross-platform authorization or enforcement decision rather than a derived requirement, the Control Plane must stop and record that decision through ADR governance before acceptance.

---

## References

* `docs/sprints/sprint-02-plan.md`
* `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
* `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
* `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
* `docs/sprints/sprint-02-task-04-authority-trust-anchor-and-governance-matrix.md`
* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/threat-model.md`
* `docs/architecture/security-invariants.md`
* `docs/architecture/failure-model.md`
* `docs/architecture/system-context-architecture.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`
* `docs/adr/0006-security-invariants-as-architecture-constraints.md`
* `docs/adr/0007-explicit-bounded-security-failure-semantics.md`
* `docs/adr/0008-separate-trust-coordination-from-runtime-enforcement-and-authority-ownership.md`
