# Autonomous Trust Platform — Failure Model

**Status:** Accepted
**Accepted Date:** 2026-08-09
**Sprint:** Sprint 1 — Trust Architecture & System Model
**Artifact Owner:** Trust Platform — Control Plane
**Architecture Domain:** Security-relevant failure, degraded operation, stale state, uncertainty, dependency failure, recovery transition, and failure propagation

---

## 1. Purpose

This document defines how the Autonomous Trust Platform reasons about security-relevant system failure.

The model answers:

> **When a trust dependency is unavailable, stale, uncertain, inconsistent, partially failed, recovering, or unable to produce a reliable current answer, which security conclusions remain valid and what behavior may safely continue?**

The Failure Model is not a general availability or disaster-recovery plan.

Its purpose is to ensure that failure of trust infrastructure does not silently alter identity assurance, trust assumptions, delegated authority, authorization semantics, enforcement behavior, or accountability.

---

## 2. Relationship to the Threat Model

The Threat Model asks:

```text
How can a security property be violated?
```

The Failure Model asks:

```text
What must happen when a security dependency
cannot reliably perform its intended function?
```

A failure may occur without malicious activity.

Examples include:

* Service outage
* Timeout
* Network partition
* Stale cache
* Expired evidence
* Incomplete dependency response
* Inconsistent replicas
* Recovery transition
* Capacity exhaustion

Compromise remains a separate condition.

---

## 3. Governing Principle

The governing failure rule is:

> **Failure, uncertainty, timeout, stale state, unavailable validation, unavailable revocation state, or degraded operation must not silently increase authority.**

This does not mandate universal denial.

It requires explicit security semantics for degraded operation.

---

## 4. Fail-Open and Fail-Closed Are Insufficient Architecture

The platform does not adopt a universal rule such as:

```text
failure
  ↓
ALLOW
```

or:

```text
failure
  ↓
DENY
```

Different resources may legitimately require different failure behavior.

For example:

* A public status endpoint
* A payroll read operation
* A production signing operation
* A trust-anchor modification
* An emergency recovery action

may require different degraded-mode responses.

The terms `fail-open` and `fail-closed` may describe behavior but must not substitute for explicit resource-specific risk analysis.

---

## 5. Failure Versus Compromise

The architecture preserves:

```text
Dependency Unavailable
        ≠
Dependency Compromised
```

An unavailable authority may be unable to produce a current decision.

A compromised authority may produce a confident but incorrect decision.

These conditions require different:

* Containment
* Recovery
* Evidence handling
* Trust invalidation
* Re-evaluation
* Governance

Ordinary failure handling must not be used to normalize suspected compromise.

---

## 6. Failure Versus Invalid State

The platform distinguishes:

```text
Unknown
    ≠
Invalid
    ≠
Valid
```

An unavailable revocation service does not prove that authority is valid.

An unavailable attestation verifier does not prove that the workload is untrusted.

A failed identity issuer does not invalidate every previously issued credential merely because new issuance is unavailable.

Failure semantics depend on the security property being evaluated.

---

## 7. Failure-State Vocabulary

The platform defines the following conceptual states.

### Available and Current

The dependency is reachable and provides evidence within accepted freshness and validity requirements.

### Unavailable

The dependency cannot provide the required result.

### Timed Out

A result was not obtained within the required decision window.

### Stale

Evidence or state exists but exceeds the freshness bound established for the operation.

### Bounded-Stale

Evidence exceeds ideal freshness but remains explicitly permitted for limited use under defined policy.

### Incomplete

Some but not all required security inputs are available.

### Inconsistent

Multiple accepted sources disagree about relevant state.

### Recovering

The dependency is transitioning from failure toward normal operation and may not yet be authoritative for all conclusions.

### Unknown

The system cannot establish a required security conclusion from available evidence.

These states must not be collapsed into a single generic `error`.

---

## 8. Security Functions Covered

Failure handling applies independently to:

* Identity issuance
* Identity validation
* Credential renewal
* Attestation verification
* Trust-anchor retrieval
* Trust-bundle distribution
* Federation
* Delegation verification
* Revocation
* Authorization policy
* Authorization decision services
* Enforcement
* Audit
* Recovery infrastructure

Failure of one function does not automatically imply failure of every other function.

---

## 9. Failure Decision Record

Each material security dependency should eventually define:

```text
Dependency
Security Function
Protected Operation / Resource Class
Failure State
Freshness Requirement
Cache Allowed?
Maximum Cache Age
Authority Consequence
Allowed Degraded Behavior
Forbidden Behavior
Enforcement Requirement
Audit Requirement
Re-evaluation Requirement
Recovery Requirement
Emergency Path
```

This record converts generic failure handling into explicit architecture.

---

## 10. Resource and Operation Classification

Failure policy must be attached to protected operations rather than only to infrastructure services.

For example:

```text
Policy Engine unavailable
```

is insufficient by itself to determine behavior.

The architecture must ask:

```text
Policy Engine unavailable
        +
Which resource?
        +
Which action?
        +
Which principal?
        +
Which existing authority?
        +
Which risk class?
        =
Failure decision
```

---

## 11. Failure Outcomes

A degraded operation may result in one of several explicit outcomes.

### Deny

The operation does not proceed.

### Defer

The request waits for the required security dependency to recover.

### Retry

The decision is retried according to bounded policy.

### Continue Under Existing Bounded State

A previously established identity, authority, or authorization state may remain usable when explicit policy permits it.

### Restricted Operation

Only a reduced set of actions remains available.

### Quarantine

The principal or operation is isolated pending re-validation.

### Emergency Authority Path

A separately governed recovery or break-glass authority may be invoked.

These outcomes are not interchangeable.

---

## 12. No Failure-Created Authority

The platform adopts the following proposed failure principle:

> **Failure of a trust dependency must not silently create authority that did not exist before the failure.**

Conceptually:

```text
Effective Authority During Failure
        ⊆
Authority legitimately established
before or independently during failure
```

A failure may reduce usable authority.

A failure may temporarily preserve explicitly approved existing authority.

A failure must not manufacture new authority.

---

## 13. Emergency Authority Is a Separate Authority Source

Emergency or break-glass behavior does not violate the non-expansion rule when it derives from an explicit and independently governed authority source.

Therefore:

```text
Dependency Failure
      ↓
does not itself grant
      ↓
Emergency Authority
```

Instead:

```text
Independent Emergency Authority
        +
Explicit Invocation
        +
Governance
        +
Audit
        +
Expiration / Revocation
        =
Emergency Operation
```

Failure is the trigger for invoking the path, not the source of authority.

---

# Identity Failure

## 14. Identity Issuer Unavailable

An unavailable identity issuer may prevent:

* New identity issuance
* Credential renewal
* Enrollment
* Re-key
* Re-authentication requiring new credentials

It does not automatically prove that previously issued credentials are invalid.

The architecture must determine:

* Whether existing credentials remain valid
* Whether their normal expiration remains authoritative
* Whether independent revocation state is required
* Whether cached identity metadata is acceptable

---

## 15. Credential Renewal Failure

Failure to renew a credential must not silently extend the credential beyond its accepted validity period.

Likewise:

```text
Credential renewal succeeds
        ≠
Delegated authority renewed
```

Identity and authority lifecycles remain independent.

---

## 16. Identity Validation Dependency Unavailable

If identity validation depends on an external service that becomes unavailable, the architecture must define whether:

* Locally verifiable credentials remain usable
* Cached validation metadata may be used
* New sessions are denied
* Existing sessions may continue
* High-risk operations require fresh validation

No universal policy is selected here.

---

# Bootstrap Failure

## 17. Bootstrap Evidence Unavailable

If stronger bootstrap evidence is unavailable:

> **The candidate must not silently receive a weaker identity assurance level merely because stronger evidence cannot be obtained.**

Possible responses include:

* Defer enrollment
* Use an explicitly approved alternate bootstrap method
* Restrict the resulting identity
* Require administrative recovery

Silent downgrade is prohibited.

---

## 18. Bootstrap Authority Unavailable

Failure of a bootstrap authority may prevent new trust establishment without necessarily invalidating existing operational identities.

The architecture must distinguish:

```text
Unable to create new trust
        ≠
Existing trust automatically invalid
```

unless the same authority is required for continued validity.

---

## 19. Recovery Dependency Failure

A recovery authority itself may fail.

Recovery architecture must therefore identify:

* Recovery authority dependencies
* Alternate recovery paths
* Required approvals
* Which recovery paths share failure domains
* Which paths remain independent

A supposedly independent recovery mechanism that shares the same critical dependency may not provide real recovery independence.

---

# Attestation Failure

## 20. Attestation Verifier Unavailable

When a verifier is unavailable, possible explicit behaviors may include:

* Require fresh verification and deny/defer
* Use a bounded cached Attestation Result
* Permit only lower-risk actions
* Quarantine the workload
* Continue an already established session until a defined deadline

The platform does not choose one universal behavior.

---

## 21. Attestation Evidence Stale

Previously valid evidence may no longer describe current state.

Therefore:

```text
Authentic Evidence
        ≠
Fresh Evidence
```

An implementation using cached attestation must define:

* Maximum age
* Relevant claims
* Security context
* Re-validation triggers
* Operations allowed during bounded staleness

---

## 22. Verifier Recovery

A verifier returning to service must not automatically make every cached or pending Attestation Result current.

Recovery may require:

* New Evidence
* Freshness validation
* Re-appraisal
* Re-establishment of trust in reference data
* Re-evaluation of dependent authorization decisions

---

# Trust Material and Federation Failure

## 23. Trust Bundle Stale

A stale trust bundle creates ambiguity about:

* Newly trusted authorities
* Removed authorities
* Rotated keys
* Revoked authorities
* Federation state

The architecture must define acceptable staleness per relationship.

Stale trust material must not silently restore an authority that has been intentionally removed.

---

## 24. Trust Bundle Distribution Unavailable

Failure of distribution does not automatically mean the locally installed trust material is unusable.

The architecture must distinguish:

```text
Unable to obtain latest trust material
        ≠
Current local trust material proven invalid
```

However, continued use may be bounded by freshness and risk requirements.

---

## 25. Federation Peer Unavailable

A federation peer outage may affect:

* New assertion acquisition
* Metadata retrieval
* Key updates
* Revocation information
* Cross-domain authentication

The receiving domain retains local authority over degraded behavior.

Federation availability must not silently change local authorization policy.

---

## 26. Federation Verification Unavailable

A domain that cannot verify an external assertion must not automatically accept the assertion because verification infrastructure is unavailable.

Possible outcomes include:

* Reject
* Defer
* Use bounded locally cached verification state
* Permit only low-risk previously established sessions

The applicable policy must be explicit.

---

# Delegation and Revocation Failure

## 27. Delegation Verification Unavailable

If the system cannot validate a delegation grant:

> **The inability to verify delegation must not silently produce delegated authority.**

A previously validated grant may be eligible for bounded continued use only when explicitly permitted.

---

## 28. Revocation State Unavailable

The architecture preserves:

```text
Revocation State Unknown
        ≠
Not Revoked
```

and:

```text
Revocation State Unknown
        ≠
Revoked
```

The appropriate behavior depends on:

* Resource sensitivity
* Grant age
* Grant lifetime
* Last known revocation state
* Connectivity assumptions
* Existing session state
* Transaction risk

---

## 29. Disconnected Revocation Evaluation

Disconnected operation requires explicit architecture.

A system that cannot contact revocation infrastructure must define:

* Which credentials or grants may continue
* Maximum disconnected duration
* Last-known-good requirements
* Whether high-risk operations stop
* Reconnection re-validation behavior
* Handling of grants revoked during disconnection

Disconnected mode must not be an implicit permanent bypass of revocation.

---

## 30. Expiration During Failure

Expiration remains distinct from revocation.

Failure of revocation infrastructure does not suspend normal expiration unless a separately governed architecture explicitly establishes different semantics.

---

## 31. Revocation Propagation Failure

A revocation may be accepted by one component but not yet visible to another.

This creates a distributed failure condition.

The architecture must eventually define:

* Propagation expectations
* Maximum tolerated lag
* Which operations require immediate revocation awareness
* Reconciliation behavior
* Evidence of propagation

---

# Authorization Failure

## 32. Policy Engine Unavailable

An unavailable policy engine does not itself authorize the request.

Possible policy-specific outcomes include:

* Deny
* Defer
* Use bounded cached decision
* Use locally evaluable policy
* Permit existing session within previously authorized scope
* Restrict operation class

No universal fallback policy is selected.

---

## 33. Cached Authorization Decision

Cached authorization may be valid only when assumptions underlying the original decision remain acceptable.

Relevant inputs may include:

* Principal identity
* Resource
* Action
* Delegated authority
* Policy version
* Attestation state
* Time
* Revocation state
* Environment context

A cached `ALLOW` must not become a context-free standing entitlement.

---

## 34. Authorization Decision Stale

An earlier authorization decision may no longer be correct after:

* Authority revocation
* Policy change
* Identity change
* Resource sensitivity change
* Attestation change
* Trust-anchor change
* Delegation expiry

Freshness requirements must therefore be tied to decision inputs.

---

## 35. Policy Version Divergence

Different authorization components may operate using different policy versions.

The platform must recognize policy-version divergence as a security-relevant failure state.

Where necessary, enforcement evidence should identify the policy version used for a decision.

---

# Enforcement Failure

## 36. Enforcement Point Unavailable

If the intended enforcement point is unavailable, the protected operation must not silently bypass it through another path.

The architecture must determine whether:

* The resource becomes unavailable
* Another equivalent enforcement point takes over
* Restricted functionality remains
* Existing connections remain bounded

---

## 37. Enforcement Decision Delivery Failure

A correct authorization decision may fail to reach enforcement.

For example:

```text
Decision:
DENY

delivery:
failed

application:
?
```

The failure policy must define behavior.

Absence of a received decision must not be silently interpreted as `ALLOW`.

---

## 38. Partial Enforcement Failure

One enforcement path may fail while another remains active.

Example:

```text
API Gateway
    enforces

Direct Internal Endpoint
    bypasses
```

Availability of one correct path does not compensate for an ungoverned alternate path.

---

# Audit Failure

## 39. Audit Destination Unavailable

An unavailable audit destination creates a conflict between:

* Operational availability
* Evidence durability
* Accountability requirements

The architecture must define whether the operation:

* Stops
* Buffers evidence
* Continues only for lower-risk actions
* Uses alternate evidence storage
* Escalates

Different operations may require different behavior.

---

## 40. Audit Buffering

Buffered evidence must eventually preserve:

* Ordering where required
* Actor context
* Authority provenance
* Decision context
* Enforcement result
* Integrity
* Delivery status

Buffering must not silently become evidence loss.

---

## 41. Audit Recovery

When audit infrastructure recovers, queued evidence must have explicit reconciliation behavior.

The system should be able to distinguish:

* Successfully delivered evidence
* Buffered evidence
* Lost evidence
* Duplicate evidence
* Replayed evidence

---

# Distributed and Partial Failure

## 42. Network Partition

A partition can leave different components with different views of:

* Identity state
* Revocation
* Policy
* Trust material
* Delegation
* Audit availability

The platform must not assume that all components observe security-state changes simultaneously.

---

## 43. Split-Brain Security State

Two accepted components may disagree.

Example:

```text
Node A:
grant valid

Node B:
grant revoked
```

The architecture must define how disagreement is detected and resolved for security-relevant state.

Inconsistency must not be hidden behind nominal service availability.

---

## 44. Partial Dependency Failure

A composite trust decision may have:

```text
Identity      VALID
Attestation   VALID
Delegation    UNKNOWN
Revocation    UNAVAILABLE
Policy        AVAILABLE
```

The system must evaluate the missing security property explicitly.

Valid results from other layers must not automatically compensate for the missing property.

---

## 45. Failure Cascades

Failure of one dependency may cause several downstream functions to degrade.

Example:

```text
Trust Bundle Distribution
        ↓
Verifier cannot update trust
        ↓
Federation verification uncertain
        ↓
Authorization context incomplete
```

The platform must model dependency chains so that degraded conclusions remain explainable.

---

## 46. Correlated Failure

Several apparently separate security functions may share:

* Control plane
* Database
* Administrator
* Network
* Cloud account
* Key-management infrastructure
* Recovery authority

A single failure can therefore affect multiple trust functions.

Logical separation alone does not guarantee failure independence.

---

# Recovery and Return to Service

## 47. Recovery Is a Security Transition

Recovery is not merely:

```text
service restarted
Service Availability Restored
        ≠
Trustworthy State Re-Established
The platform distinguishes service recovery from trust recovery.

A component may again be reachable while its security state remains stale, inconsistent, incomplete, or unverified.
```

It is a transition between trust states.

The architecture must establish when a recovered dependency becomes authoritative again.

---

## 48. Recovery Validation

Return to service may require validation of:

* Identity
* Configuration
* Trust anchors
* Policy
* Reference values
* Revocation state
* Queued updates
* Clock / freshness state
* Administrative changes made during outage

Availability alone does not prove trustworthy recovery.

---

## 49. Re-Evaluation After Recovery

Security conclusions made during degraded operation may require re-evaluation.

Examples include:

* Cached Attestation Results
* Delegation grants
* Authorization decisions
* Revocation assumptions
* Federation assertions

The architecture must define which conclusions survive recovery and which require fresh validation.

---

## 50. Deferred Revocation Reconciliation

If revocation could not be observed during a failure window, recovery must define how newly discovered revocations affect:

* Active sessions
* Cached decisions
* Delegation chains
* Audit interpretation
* Pending operations

Recovery must not assume the outage period contained no security-state changes.

---

## 51. Deferred Policy Reconciliation

When policy updates were unavailable during partition or outage, recovery must establish:

* Which version is authoritative
* Whether decisions made under old policy remain acceptable
* Whether active sessions require re-authorization
* Whether evidence must record the old policy version

---

## 52. Recovery Authority

Recovery authority remains a first-class security authority.

A recovery path must identify:

* Who may initiate it
* What may be modified
* Required approvals
* Audit requirements
* Expiration of temporary authority
* Revocation of emergency credentials
* Independent trust basis

---

# Degraded-Mode Governance

## 53. Degraded Mode Must Be Explicit

A system is in degraded mode when one or more normally required security inputs are unavailable but some operation is permitted to continue under a defined alternate policy.

Degraded mode must have:

* Entry condition
* Allowed operation set
* Forbidden operation set
* Maximum duration
* Required evidence
* Exit condition
* Re-validation requirement
* Audit behavior

---

## 54. Degraded Mode Is Not Normal Mode

Temporary degraded behavior must not silently become the permanent operating model.

The platform must avoid:

```text
temporary exception
      ↓
never removed
      ↓
de facto architecture
```

Expiry or governance review must bound exceptional operation.

---

## 55. Reduced Assurance Must Be Visible

When an operation proceeds under reduced assurance, that state must be observable where security relevant.

Examples may include:

* Degraded authorization mode
* Stale attestation
* Cached policy decision
* Revocation uncertainty
* Federation outage

Downstream systems must not be led to believe normal assurance was present when it was not.

---

## 56. Reduced Assurance Does Not Automatically Mean Reduced Identity

A candidate must not automatically be assigned a weaker identity simply because stronger verification infrastructure is unavailable.

Possible degraded behavior may instead include:

* No new identity issued
* Restricted operations
* Delayed activation
* Alternate explicit bootstrap

Identity semantics must remain deliberate.

---

## 57. Bounded Cache Principle

Use of cached security state requires explicit bounds.

A cache policy should define:

```text
What was cached?
When was it validated?
Which authority produced it?
Which resource/action is it valid for?
Maximum age?
Which invalidating events matter?
What happens when the bound expires?
```

### Time and Clock Failure

Freshness, expiration, cache age, delegation validity, attestation validity, and other time-bounded security conclusions depend on trustworthy time assumptions.

The architecture must account for:

- Clock skew
- Clock rollback
- Time-source unavailability
- Inconsistent time across components
- Unexpected clock jumps

A time-bounded credential, grant, assertion, cache entry, or Attestation Result must not automatically be treated as current when the system cannot establish time within the bounds required by the applicable security policy.

Failure handling must define acceptable clock uncertainty where time affects a security decision.

This artifact does not select a time-synchronization technology.

Cached state is not inherently safe merely because it was once valid.

---

## 58. Last-Known-Good State

`Last known good` is a provenance statement, not an authorization policy.

The architecture must not infer:

```text
Last Known Good
        =
Safe Indefinitely
```

Continued use requires an explicit freshness and risk policy.

---

# Failure-Handling Security Properties

## 59. FM-01 — No Silent Authority Increase

Failure, uncertainty, timeout, stale state, unavailable validation, or degraded operation must not silently increase authority.

---

## 60. FM-02 — Unknown Is Not Valid

An unknown security state must not automatically be interpreted as valid.

---

## 61. FM-03 — Unknown May Permit Only Explicitly Governed Continuation

An unknown security state must not be reclassified as valid merely because normal validation is unavailable.

Continued operation under unknown state is permitted only where an explicit bounded degraded-mode policy authorizes use of previously established state or another independently valid authority basis.

The security state remains unknown until the required evidence is re-established.

---

## 62. FM-04 — Failure and Compromise Remain Distinct

Ordinary availability failure and suspected authority compromise require separate security handling.

---

## 63. FM-05 — Failure Policy Is Resource-Specific

Failure behavior must be tied to the protected resource, action, authority, and risk rather than only to the failed infrastructure component.

---

## 64. FM-06 — Stale State Requires Explicit Freshness Bounds

Cached or stale security state may be used only within explicitly defined scope and freshness constraints.

---

## 65. FM-07 — Failure Must Not Cause Silent Assurance Downgrade

Unavailable stronger evidence must not silently produce weaker identity, trust, delegation, or authorization semantics.

---

## 66. FM-08 — Emergency Authority Must Be Independently Governed

Failure itself must not create emergency authority.

Emergency authority requires a separately governed authority source.

---

## 67. FM-09 — Degraded Mode Must Be Observable and Bounded

Degraded operation must have explicit entry, scope, duration, evidence, and exit semantics.

---

## 68. FM-10 — Recovery Requires Re-Establishment of Trustworthy State

Service availability alone must not be treated as proof that a security dependency has recovered trustworthy state.

---

## 69. FM-11 — Recovery May Require Re-Evaluation

Security conclusions made during degraded operation must be re-evaluated when their validity depends on state that may have changed during failure.

---

## 70. FM-12 — Distributed Security State Must Account for Propagation Delay

Revocation, policy, trust material, and other security-state changes must not be assumed instantly visible across all components.

---

## 71. FM-13 — Failure Dependencies Must Remain Traceable

The platform must be able to identify which security conclusions depend on a failed or degraded authority or service.

---

## 72. FM-14 — Independent Security Functions May Fail Independently

Failure of one trust function must not automatically invalidate unrelated functions unless they share a material dependency.

---

## 73. FM-15 — Enforcement Failure Must Not Become Authorization Bypass

Unavailable or failed enforcement must not silently expose an ungoverned path to a protected operation.

---

## 74. FM-16 — Audit Failure Requires Explicit Operational Semantics

Audit unavailability must have explicitly defined behavior based on operation risk and accountability requirements.

These failure-model properties are accepted architecture requirements.

---

## 75. FM-17 — Degraded-State Composition Must Be Explicit

Individually permitted degraded states must not automatically be assumed permissible when combined.

Where multiple security dependencies are simultaneously degraded, the combined state must be evaluated explicitly.

A degraded-mode policy must define either:

- Which combinations are permitted
- Which more restrictive behavior applies
- Or that the operation cannot continue

Independent degradation allowances must not be implicitly composed through union.

# Representative Failure Scenarios

## 76. Scenario A — Revocation Service Outage

```text
Identity:
valid

Delegation:
previously valid

Revocation service:
unavailable
```

Incorrect reasoning:

```text
cannot verify revoked
therefore
not revoked
```

Correct architectural treatment:

```text
revocation state:
unknown
        ↓
resource-specific degraded policy
```

---

## 77. Scenario B — Policy Engine Outage

```text
Policy Engine:
unavailable

Previous decision:
ALLOW
```

The system must not automatically convert the previous decision into standing permanent authority.

Continued use depends on explicit cache and freshness policy.

---

## 78. Scenario C — Attestation Verifier Outage

```text
Workload:
previously attested

Verifier:
unavailable
```

Possible valid architecture:

```text
bounded cached result
        ↓
low-risk operations only
        ↓
fresh attestation required by deadline
```

This is different from both unrestricted continuation and universal shutdown.

---

## 79. Scenario D — Trust Bundle Stale

```text
Local Trust Bundle:
version N

Current Distribution:
unavailable

Remote Authority:
possibly rotated or removed
```

The architecture must determine the maximum acceptable staleness for the relationship.

---

## 80. Scenario E — Audit Destination Unavailable

```text
Authorization:
ALLOW

Enforcement:
available

Audit:
unavailable
```

A low-risk operation might buffer evidence.

A high-risk administrative trust-anchor change might require durable audit availability before proceeding.

The resource policy determines behavior.

---

## 81. Scenario F — Recovery After Network Partition

During partition:

```text
Node A:
grant valid

Node B:
grant revoked
```

After connectivity returns, the platform must reconcile authority state and determine whether active sessions or cached decisions require termination or re-evaluation.

---

## 82. Scenario G — Bootstrap Downgrade Pressure

```text
Hardware-backed bootstrap:
unavailable

Static enrollment token:
available
```

Incorrect:

```text
use weaker method automatically
```

Correct:

```text
explicit alternate bootstrap policy
or
defer enrollment
```

---

## 83. Scenario H — Enforcement Service Failure

```text
Authorization:
DENY

Enforcement interceptor:
unavailable
```

The protected application must not silently expose a direct path simply because enforcement infrastructure failed.

---

## 84. Scenario I — Emergency Recovery

```text
Primary identity authority:
unavailable

Emergency administrator:
invokes break-glass
```

The emergency authority must derive from a separately governed authority source and remain bounded, attributable, auditable, and revocable.

---

## 85. Scenario J — Multiple Simultaneous Failures

```text
Policy:
cached

Revocation:
unavailable

Attestation:
stale

Audit:
buffering
```

The architecture must evaluate the composition of degraded states.

Several individually tolerable degraded conditions may collectively exceed acceptable risk.

---

# Composition and Cascading Degradation

## 86. Multiple Degraded Inputs

A system must not assume that independently acceptable degraded states remain acceptable when combined.

Example:

```text
cached policy
    +
stale attestation
    +
unknown revocation
```

may produce a materially different risk posture than any one condition alone.

---

## 87. Degradation Budget

Future implementations may define a bounded degradation budget describing which combinations of reduced assurance remain permissible for an operation.

No universal scoring mechanism is selected here.

Any such mechanism must preserve applicable Security Invariants.

---

## 88. Failover

Failover infrastructure must preserve the same security semantics as the primary path unless an explicit degraded-mode policy defines otherwise.

Failover must not become:

```text
weaker alternate enforcement
```

merely to preserve availability.

---

## 89. Recovery Ordering

Dependencies may require ordered restoration.

For example:

```text
Trust Material
      ↓
Identity / Verifier Validation
      ↓
Policy
      ↓
Authorization
      ↓
Enforcement
```

The correct order depends on actual dependency relationships.

A component becoming available before its trusted dependencies recover does not necessarily make it authoritative.

---

## 90. Failure Evidence

Security-relevant failure handling should eventually produce evidence such as:

* Failed dependency
* Failure state
* Detection time
* Decision made
* Cache age
* Policy version
* Authority state
* Degraded mode entered
* Emergency authority invoked
* Recovery time
* Re-validation result
* Reconciliation actions

This supports audit, incident investigation, and architecture validation.

---

## 91. Failure Testing

Future implementation validation should test:

### Normal Path

Required dependencies available.

### Dependency Unavailable

Required service unreachable.

### Timeout

Service responds too slowly.

### Stale State

Cached evidence exceeds accepted age.

### Partial State

Some required evidence missing.

### Inconsistent State

Replicas disagree.

### Recovery

Service returns after failure.

### Compound Failure

Multiple security dependencies degrade simultaneously.

Testing must verify security semantics, not merely service uptime.

---

## 92. Negative-Test Principle

Failure tests should attempt to prove that unavailable security infrastructure cannot be exploited to obtain greater authority.

Examples:

```text
Revocation unavailable
    ↓
attempt revoked action
```

```text
Policy unavailable
    ↓
attempt unauthorized action
```

```text
Attestation unavailable
    ↓
attempt high-risk operation requiring fresh attestation
```

```text
Enforcement unavailable
    ↓
attempt alternate path
```

Expected behavior is defined by resource-specific policy, but must preserve applicable Security Invariants.

---

## 93. Relationship to Security Invariants

The Failure Model operationalizes several accepted Security Invariants, especially:

* SI-15 — Compromise Recovery Requires an Independent Trust Basis
* SI-31 — Failure or Uncertainty Must Not Silently Increase Authority
* SI-32 — Compromise and Availability Failure Remain Distinct
* SI-33 — Compromise Dependencies Must Be Traceable
* SI-34 — Security Functions Must Not Hide Correlated Compromise
* SI-38 — Security-Relevant Trust State Changes Must Be Governed

The Failure Model does not supersede these invariants.

It defines how they apply during degraded operation.

---

## 94. Relationship to Delegated Authority

Failure handling must preserve:

```text
Identity
    ≠
Authority
```

and:

```text
Expiration
    ≠
Revocation
```

and:

```text
Unavailable Revocation State
    ≠
Valid Authority
```

A delegation artifact remains subject to its authority basis even when dependent verification services are unavailable.

---

## 95. Relationship to Bootstrap

Bootstrap failure must not silently alter identity-assurance requirements.

Recovery remains a new trust-establishment problem where prior trust can no longer be relied upon.

---

## 96. Relationship to Trust Domains

Each material trust relationship must define its failure and revocation behavior.

Cross-domain failure does not automatically transfer authorization control to the failing external domain.

The receiving authorization domain retains its own failure policy.

---

## 97. Architecture Decisions Not Made

This document does not select:

* Universal fail-open behavior
* Universal fail-closed behavior
* Cache technology
* Revocation protocol
* Policy engine
* Circuit breaker
* Service mesh
* Retry library
* Disaster-recovery platform
* Database consistency mechanism
* Federation protocol
* Audit queue
* Break-glass product
* Monitoring technology
* Risk-scoring framework

Those mechanisms must satisfy the failure semantics defined here.

---

## 98. Architecture Decision

The candidate decision is:

> **Security-relevant failure behavior must be explicit, resource- and risk-specific, and bounded such that unavailable, stale, uncertain, or degraded trust dependencies do not silently create additional authority or stronger security conclusions than the available evidence supports.**

A second candidate decision is:

> **Recovery from security-relevant failure is a trust-state transition. Availability alone does not prove recovery; dependent security conclusions must be re-established or re-evaluated where their validity may have changed during the failure window.**

Whether these require a new ADR will be determined during Task 8 acceptance.

---

## 99. Open Questions

1. Which resource classes may use cached authorization decisions?
2. How should maximum cache age be determined?
3. Which operations require fresh revocation state?
4. Which operations require fresh attestation?
5. Which operations may continue when audit is unavailable?
6. Which operations require synchronous durable audit?
7. What is the maximum disconnected duration for delegation validation?
8. How should revocation propagation objectives be represented?
9. Which trust-state changes require immediate global propagation?
10. Which degraded states may be composed safely?
11. Should compound degraded states have a formal risk budget?
12. Which failures require automatic session termination?
13. Which failures require re-authentication after recovery?
14. Which failures require re-attestation?
15. Which failures require re-authorization?
16. Which failure-state transitions require human approval?
17. Which emergency actions require multi-party authorization?
18. What evidence proves recovery completed correctly?
19. How should split-brain security state be resolved?
20. Which failure semantics must be verified before production use?

---

## 100. Task 8 Exit Criteria

The Failure Model is ready for acceptance when it:

* Separates failure from compromise
* Separates unknown, invalid, and valid state
* Rejects universal fail-open/fail-closed architecture
* Defines explicit degraded-mode semantics
* Covers identity failure
* Covers bootstrap failure
* Covers attestation failure
* Covers trust-material failure
* Covers federation failure
* Covers delegation verification failure
* Covers revocation uncertainty
* Covers authorization failure
* Covers enforcement failure
* Covers audit failure
* Covers stale and cached state
* Covers network partition and inconsistent state
* Covers correlated and cascading failure
* Covers recovery and re-evaluation
* Covers emergency authority
* Preserves Security Invariants
* Supports normal, negative, failure, recovery, and compound-failure testing
* Does not claim implementation or production enforcement
* Identifies unresolved implementation-policy decisions

---

## References to Existing Architecture

* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/threat-model.md`
* `docs/architecture/security-invariants.md`
* `docs/architecture/trust-standards-landscape.md`
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`
* `docs/adr/0006-security-invariants-as-architecture-constraints.md`

This proposed Failure Model refines failure semantics already established by accepted architecture. It does not supersede an accepted ADR.
