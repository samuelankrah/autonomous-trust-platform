# Sprint 2 Task 2 — Architecture Role-to-Capability Model

**Project:** Autonomous Trust Platform
**Sprint:** Sprint 2 — Trust Control Contracts & Technology Evaluation Gate
**Task:** Task 2 — Architecture Role-to-Capability Model
**Status:** Accepted
**Task Date:** 2026-08-16
**Accepted Date:** 2026-08-16
**Semantic Review:** PASS
**Owner:** Trust Platform — Control Plane
**Repository Baseline:** `b84527b43b750f0f2e51a14bc269fd8ea9193c69`
**Roadmap Authority:** `docs/sprints/sprint-02-plan.md`
**Traceability Baseline:** `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`

---

## 1. Objective

Translate the accepted logical architecture roles into implementation-neutral capability requirements.

The governing question is:

> **What must each logical role be capable of doing, what inputs and outputs does it require, what authority does it hold or explicitly not hold, what trust dependencies does it rely upon, and what failure and audit semantics must a conforming implementation preserve?**

Task 2 creates capability contracts for architecture roles.

It does not map those roles to products.

---

## 2. Why This Task Matters

Sprint 1 established logical architecture roles.

Task 1 established stable identifiers and traceability.

Task 2 now prevents later technology evaluation from redefining those roles around product features.

Without this task, a product could appear to satisfy multiple architectural functions merely because it exposes related APIs.

The platform instead evaluates technologies against pre-existing role semantics.

The architecture therefore preserves:

```text
Architecture Role
        ≠
Product
        ≠
Deployment Unit
        ≠
Administrative Domain
        ≠
Trust Domain
```

A single component may implement multiple roles.

Multiple components may implement one role.

Neither case erases the logical distinctions defined here.

---

# Role Capability Contract

## 3. Required Capability Fields

Each logical role is described using the following fields:

* Purpose
* Required inputs
* Required outputs
* Authority held
* Authority explicitly not held
* Trust authorities or anchors relied upon
* Freshness requirements
* Revocation requirements
* Failure semantics
* Audit obligations
* Candidate capability classes
* Allowed co-location
* Co-location risks
* Primary accepted-source traceability

These fields define evaluation requirements.

They do not claim current implementation.

### Interpretation of Capability Fields

`Authority held` describes the authority a correctly instantiated role may legitimately exercise within its explicitly governed scope.

It does not assert that a current implementation, credential, service, or deployment already possesses that authority.

`Trust dependencies` identify relationships whose trust basis must be made explicit. Listing a dependency does not itself establish that the dependency is trusted.

`Candidate capability classes` are implementation-neutral categories for later evaluation. They are not product selections.

---

# ROLE-001 — Logical Principal

## 4. Purpose

A Logical Principal is the security-relevant actor whose actions, authority, policy scope, and accountability may need to persist independently from a particular runtime instance or credential.

Examples may include:

* Service
* Automated workflow
* AI agent
* Software actor

## 5. Required Inputs

A Logical Principal context may require:

* Principal identity or attribution
* Runtime binding
* Delegated authority
* Policy context
* Requested resource
* Requested action
* Environmental context
* Attestation-derived context where applicable

## 6. Required Outputs

The role must support representation of:

* Principal context used by authorization
* Accountable actor identity or attribution
* Authority provenance
* Requested action
* Runtime association where applicable

## 7. Authority Held

A Logical Principal may hold:

* Directly assigned authority
* Bounded delegated authority
* Resource-specific authority
* Policy-constrained authority

Authority must be independently governable from credential lifecycle.

## 8. Authority Explicitly Not Held

The Logical Principal does not gain authority merely because:

* It possesses a valid credential
* Its runtime is authenticated
* Its runtime is attested
* It can invoke a tool
* It executes within a privileged workload
* It is coordinated by the Trust Control Plane

## 9. Trust Dependencies

May depend on:

* Identity Authority
* Principal-to-runtime binding
* Delegation Authority or Delegator
* Policy Authority
* Authorization Domain
* Attestation Result where explicitly applicable

## 10. Freshness and Revocation

The architecture must permit independent lifecycle handling for:

* Identity
* Runtime binding
* Delegated authority
* Session or request context

Revoking one relationship must not require silently redefining the others.

## 11. Failure Semantics

Failure of identity validation, delegation validation, runtime binding, or required trust evidence must not create additional authority.

Unknown identity or authority state must not be silently interpreted as valid.

## 12. Audit Obligations

Audit evidence should be able to attribute:

* Logical principal
* Runtime
* Identity context
* Authority source
* Delegation where applicable
* Resource
* Action
* Decision
* Enforcement result

## 13. Candidate Capability Classes

Future technologies may provide:

* Logical-principal identity representation
* Principal metadata
* Principal lifecycle management
* Delegated-authority representation
* Principal-to-runtime association

No product is selected here.

## 14. Allowed Co-location

May be represented within:

* Application metadata
* Identity system
* Authorization context
* Agent framework
* Workload metadata

## 15. Co-location Risks

Co-location with runtime identity may cause:

* Workload identity to be mistaken for logical-principal identity
* Host authority to be mistaken for actor authority
* Runtime compromise to obscure actor attribution

## 16. Traceability

Role ID: `ROLE-001`

Primary accepted sources:
* IN-002
* IN-005
* IN-009
* ADR-0002
* ADR-0005
* SI-02
* SI-25
* SI-27

---

# ROLE-002 — Runtime / Workload

## 17. Purpose

A Runtime / Workload is the execution context through which a logical principal operates.

It may possess an independently verifiable runtime identity.

## 18. Required Inputs

May consume:

* Bootstrap material
* Runtime identity configuration
* Workload registration
* Trust anchors
* Policy
* Principal binding
* Attestation configuration

## 19. Required Outputs

May produce or present:

* Runtime identity
* Authentication evidence
* Attestation Evidence
* Runtime metadata
* Principal binding context
* Request context

## 20. Authority Held

A runtime may hold:

* Infrastructure permissions
* Workload-specific authority
* Delegable authority explicitly assigned to that workload

## 21. Authority Explicitly Not Held

Runtime authentication does not establish:

* Every hosted logical principal's identity
* Every hosted actor's authority
* Application authorization
* Delegation authority unless explicitly granted

## 22. Trust Dependencies

May depend on:

* Bootstrap authority
* Identity Authority
* Runtime attestation
* Trust anchors
* Orchestration or registration state
* Principal-binding mechanism

## 23. Freshness and Revocation

Must support lifecycle semantics for:

* Runtime identity
* Credential renewal
* Runtime registration
* Binding changes
* Revocation
* Attestation freshness where required

## 24. Failure Semantics

Expired, stale, unavailable, or invalid runtime identity must not be silently replaced by ambient infrastructure trust.

Loss of attestation availability must follow explicit resource- and risk-specific failure policy.

## 25. Audit Obligations

Audit should distinguish:

* Runtime identity
* Runtime instance
* Logical principal
* Credential
* Attestation state
* Requested action

## 26. Candidate Capability Classes

May eventually map to:

* Workload identity systems
* Runtime identity mechanisms
* Orchestrator identity
* Host identity
* Execution-environment metadata

## 27. Allowed Co-location

Runtime identity and attestation mechanisms may be co-located.

Logical identity may also be represented nearby.

## 28. Co-location Risks

Co-location may encourage:

* Identity collapse
* Shared compromise
* Over-broad trust in host metadata
* Hidden dependency on orchestration control

## 29. Traceability

Role ID: `ROLE-002`

Primary accepted sources:
* IN-002
* IN-004
* IN-007
* IN-009
* ADR-0002
* ADR-0004
* SI-02
* SI-11
* SI-17
* SI-25

---

# ROLE-003 — Identity Authority

## 30. Purpose

An Identity Authority establishes or issues verifiable identity material within a defined identity trust domain.

## 31. Required Inputs

May require:

* Approved principal registration
* Principal-to-identity binding
* Bootstrap evidence
* Eligibility decision
* Issuance policy
* Trust-anchor configuration
* Revocation state
* Trusted time

## 32. Required Outputs

May produce:

* Identity credential
* Renewal
* Revocation or invalidation state
* Validation metadata
* Issuer metadata
* Trust information

## 33. Authority Held

Holds authority to:

* Issue identity material within its defined scope
* Bind approved identity claims to credentials
* Revoke or invalidate issued identity material

## 34. Authority Explicitly Not Held

The Identity Authority does not automatically have authority to:

* Authorize application actions
* Delegate application authority
* Act as Policy Authority
* Act as Enforcement Point
* Approve identity eligibility unless that governance role is explicitly co-located
* Define all trust domains

## 35. Trust Dependencies

May depend on:

* Bootstrap Authority
* Registration governance
* Identity eligibility governance
* Root of trust
* Issuer trust anchors
* Key custody
* Trusted time
* Revocation infrastructure

## 36. Freshness and Revocation

Must support:

* Credential validity period
* Renewal
* Revocation or invalidation semantics
* Trust-anchor rotation
* Issuer key rotation
* Namespace lifecycle

## 37. Failure Semantics

Issuer unavailability must not imply previously invalid credentials become valid.

Loss of revocation state must be explicitly classified.

Compromise of issuer authority may require re-bootstrap, reissuance, or trust-anchor replacement.

## 38. Audit Obligations

Audit should record:

* Issuance
* Renewal
* Revocation
* Binding changes
* Issuer changes
* Trust-anchor changes
* Administrative actions

## 39. Candidate Capability Classes

May eventually map to:

* PKI issuer
* Workload identity issuer
* Token issuer
* Identity registration service
* Certificate authority

## 40. Allowed Co-location

May be co-located with:

* Registration
* Eligibility governance
* Credential lifecycle service

## 41. Co-location Risks

Risks include:

* Eligibility approval and credential issuance sharing one compromise path
* Issuer compromise becoming governance compromise
* Trust-anchor and issuer-key custody collapsing independence

## 42. Traceability

Role ID: `ROLE-003`

Primary accepted sources:
* IN-002
* IN-004
* IN-009
* ADR-0004
* SI-01
* SI-03
* SI-11
* SI-12
* SI-37

---

# ROLE-004 — Identity Validation

## 43. Purpose

Identity Validation determines whether presented identity evidence is acceptable under a defined identity trust relationship.

## 44. Required Inputs

Requires as applicable:

* Credential or identity assertion
* Issuer
* Trust anchor
* Validation rules
* Intended namespace
* Intended audience
* Freshness
* Trusted time
* Revocation state
* Local acceptance policy

## 45. Required Outputs

Produces:

* Valid identity context
* Invalid result
* Unknown or indeterminate result
* Validation metadata
* Failure reason
* Freshness state

## 46. Authority Held

Identity Validation may establish:

* Whether identity evidence is cryptographically and semantically acceptable for the intended identity purpose

## 47. Authority Explicitly Not Held

Identity Validation does not automatically:

* Grant application authorization
* Establish delegated authority
* Establish attestation state
* Enforce protected actions
* Import external authorization

## 48. Trust Dependencies

Depends on:

* Identity Authority
* Trust anchors
* Validation policy
* Revocation state
* Trusted time
* Namespace interpretation

## 49. Freshness and Revocation

Must evaluate:

* Credential lifetime
* Revocation freshness
* Issuer validity
* Trust-anchor validity
* Intended-use constraints

## 50. Failure Semantics

Must distinguish:

```text
VALID
≠
INVALID
≠
UNKNOWN
```

Unavailable revocation or trust state must not automatically convert to valid.

## 51. Audit Obligations

Audit should support reconstruction of:

* Presented identity evidence
* Issuer
* Trust anchor
* Validation result
* Time
* Revocation state
* Acceptance policy

## 52. Candidate Capability Classes

May eventually map to:

* Certificate validation
* Token validation
* Federation validation
* Workload identity validation

## 53. Allowed Co-location

May be co-located with:

* Authorization Decision Function
* Enforcement Point
* Gateway
* Application service

## 54. Co-location Risks

Co-location may obscure:

* Identity validation versus authorization decision
* External identity acceptance versus local authority
* Validation failure versus enforcement failure

## 55. Traceability

Role ID: `ROLE-004`

Primary accepted sources:
* IN-002
* IN-003
* IN-008
* IN-009
* ADR-0003
* ADR-0007
* SI-10
* SI-27
* SI-31

---

# ROLE-005 — Attester

## 56. Purpose

An Attester produces Evidence about security-relevant properties of an entity, workload, platform, or runtime.

## 57. Required Inputs

May require:

* Runtime state
* Platform measurements
* Configuration state
* Hardware state
* Software state
* Endorsements
* Nonce or freshness challenge
* Evidence request

## 58. Required Outputs

Produces:

* Attestation Evidence
* Evidence metadata
* Freshness information
* Measurement or configuration claims

## 59. Authority Held

The Attester is the source of Attestation Evidence under the defined attestation mechanism.

That source role does not make every claim intrinsically trustworthy.

Trustworthiness depends on the applicable evidence protection, endorsements, verification, appraisal policy, reference values, freshness rules, and relying-function acceptance.

## 60. Authority Explicitly Not Held

The Attester does not automatically:

* Establish principal identity
* Grant delegated authority
* Decide application authorization
* Define verifier appraisal policy
* Enforce application access

## 61. Trust Dependencies

May depend on:

* Hardware root of trust
* Platform root of trust
* Device or workload key
* Endorsement authority
* Trusted measurement path
* Trusted time or challenge freshness

## 62. Freshness and Revocation

Attestation evidence must have explicit:

* Freshness semantics
* Replay resistance where required
* Key lifecycle
* Endorsement lifecycle
* Revocation handling

## 63. Failure Semantics

Missing or stale evidence is not equivalent to valid evidence.

Attester unavailability is not proof of compromise, and compromise is not merely unavailability.

## 64. Audit Obligations

Audit should support:

* Evidence origin
* Evidence generation time
* Attester identity or trust basis
* Measurement context
* Evidence request context

## 65. Candidate Capability Classes

May eventually map to:

* TPM-based attestation
* TEE attestation
* Workload attestation
* Platform attestation
* RATS-compatible Attester

## 66. Allowed Co-location

May be co-located with runtime or host.

## 67. Co-location Risks

Risks include:

* Attester compromise with runtime compromise
* False independence assumptions
* Host-controlled evidence paths
* Evidence interpreted beyond intended scope

## 68. Traceability

Role ID: `ROLE-005`

Primary accepted sources:
* IN-006
* IN-007
* IN-009
* SI-17
* SI-18
* SI-32
* SI-34

---

# ROLE-006 — Attestation Verifier

## 69. Purpose

An Attestation Verifier appraises Evidence according to defined rules and produces an Attestation Result.

## 70. Required Inputs

May require:

* Attestation Evidence
* Reference values
* Endorsements
* Appraisal policy
* Trust anchors
* Trusted time
* Freshness context
* Verifier configuration

## 71. Required Outputs

Produces:

* Attestation Result
* Appraisal result
* Claims accepted or rejected
* Freshness state
* Failure state
* Provenance metadata

## 72. Authority Held

May hold authority to:

* Appraise evidence under an attestation trust relationship
* State whether evidence satisfies defined appraisal policy

## 73. Authority Explicitly Not Held

The Verifier does not automatically:

* Establish workload or logical-principal identity
* Grant application authority
* Perform local authorization
* Act as universal trust authority
* Enforce protected actions

## 74. Trust Dependencies

Depends on:

* Attester trust basis
* Endorsements
* Reference values
* Appraisal policy
* Trust anchors
* Trusted time
* Verifier integrity

## 75. Freshness and Revocation

Must support:

* Evidence freshness
* Reference-value lifecycle
* Endorsement revocation
* Verifier key or trust-anchor rotation
* Result validity period where applicable

## 76. Failure Semantics

Must preserve:

```text
VALID
≠
INVALID
≠
UNKNOWN
```

Conflicting or stale evidence requires explicit treatment.

## 77. Audit Obligations

Audit should record:

* Evidence reference
* Appraisal policy
* Verifier
* Result
* Time
* Reference values
* Trust basis

## 78. Candidate Capability Classes

May eventually map to:

* RATS Verifier
* TEE verification service
* Platform attestation verifier
* Workload-attestation service

## 79. Allowed Co-location

May be co-located with:

* Identity validation
* Authorization service
* Trust coordination component

## 80. Co-location Risks

Risks include:

* Attestation result being treated as authorization
* Shared administrator controlling evidence and appraisal
* Verifier compromise affecting multiple relying domains

## 81. Traceability

Role ID: `ROLE-006`

Primary accepted sources:
* IN-006
* IN-007
* IN-009
* SI-17
* SI-18
* SI-31
* SI-34
* ADR-0007

---

# ROLE-007 — Relying Function

## 82. Purpose

A Relying Function consumes validated security evidence for a defined local security purpose.

It is an architectural role, not necessarily a standalone service.

## 83. Required Inputs

May consume:

* Identity validation result
* Attestation Result
* Delegation validation
* Trust metadata
* Policy
* Resource context
* Request context

## 84. Required Outputs

Produces a local interpretation such as:

* Evidence accepted
* Evidence rejected
* Evidence insufficient
* Evidence mapped into authorization context
* Bootstrap eligibility input
* Identity-validation input

## 85. Authority Held

Authority depends on the local relying purpose.

The role may have authority to accept or reject evidence for that purpose.

## 86. Authority Explicitly Not Held

A Relying Function does not inherit:

* Issuer authority
* Verifier authority
* Delegator authority
* Universal authorization authority

merely by consuming their outputs.

## 87. Trust Dependencies

Depends on:

* Accepted evidence producer
* Accepted trust anchor or authority
* Local policy
* Intended purpose
* Freshness
* Scope

## 88. Freshness and Revocation

Must apply freshness and revocation appropriate to the local security decision.

## 89. Failure Semantics

Evidence unavailable or unknown must follow explicit local policy.

Evidence acceptance for one purpose must not silently imply acceptance for another.

## 90. Audit Obligations

Audit should identify:

* Evidence consumed
* Local purpose
* Acceptance basis
* Result
* Policy
* Time

## 91. Candidate Capability Classes

May be embodied by:

* Bootstrap evaluator
* Identity validator
* Authorization function
* Registration service
* Application security decision

## 92. Allowed Co-location

May be co-located with almost any local security decision function.

## 93. Co-location Risks

Primary risk is semantic collapse:

* Evidence validation mistaken for local authorization
* Attestation acceptance mistaken for identity
* Cross-domain evidence mistaken for imported authority

## 94. Traceability

Role ID: `ROLE-007`

Primary accepted sources:
* IN-003
* IN-009
* ADR-0003
* SI-09
* SI-10
* SI-17
* SI-28

---

# ROLE-008 — Authority Source

## 95. Purpose

An Authority Source is the security or governance basis from which authority ultimately derives.

## 96. Required Inputs

May depend on:

* Organizational governance
* Human authority
* Existing resource authority
* Platform governance
* Application ownership
* Policy

## 97. Required Outputs

Produces or establishes:

* Delegable authority
* Authority provenance
* Scope
* Constraints
* Expiration
* Revocation basis

## 98. Authority Held

Holds original or recognized authority for a defined resource, action, or governance function.

## 99. Authority Explicitly Not Held

An Authority Source is not automatically:

* Credential issuer
* Delegation artifact issuer
* Identity Authority
* Enforcement Point
* Trust anchor

## 100. Trust Dependencies

Depends on:

* Governance legitimacy
* Resource ownership
* Policy
* Administrative integrity
* Auditability

## 101. Freshness and Revocation

Must support:

* Authority lifecycle
* Authority withdrawal
* Scope change
* Delegation eligibility change

## 102. Failure Semantics

Loss of access to an Authority Source does not create replacement authority.

Compromise of authority provenance may invalidate downstream delegations.

## 103. Audit Obligations

Audit should preserve:

* Authority origin
* Scope
* Delegability
* Changes
* Revocation
* Downstream grants

## 104. Candidate Capability Classes

May eventually map to:

* Resource owner
* Governance authority
* Entitlement authority
* Application owner
* Existing workload authority

## 105. Allowed Co-location

May be co-located with Delegator or Policy Authority.

## 106. Co-location Risks

Risks include:

* Source, delegator, and issuer being treated as indistinguishable
* Authority provenance disappearing
* Excessive centralization

## 107. Traceability

Role ID: `ROLE-008`

Primary accepted sources:
* IN-005
* IN-007
* IN-009
* ADR-0005
* SI-22
* SI-23
* SI-36

---

# ROLE-009 — Delegator

## 108. Purpose

A Delegator grants bounded authority to another principal.

## 109. Required Inputs

Requires:

* Delegable authority
* Delegate identity
* Scope
* Constraints
* Expiration
* Redelegation policy
* Revocation policy
* Intended audience or resource

## 110. Required Outputs

Produces:

* Delegation grant
* Authority provenance
* Scope
* Constraints
* Validity period
* Redelegation condition
* Revocation reference

## 111. Authority Held

May exercise only authority it legitimately possesses and is permitted to delegate.

## 112. Authority Explicitly Not Held

A Delegator does not gain authority merely because:

* It can issue a signed artifact
* It has a valid credential
* It has tool access
* It hosts the delegate

## 113. Trust Dependencies

Depends on:

* Authority Source
* Delegable-authority rules
* Delegate identity
* Policy
* Trusted time
* Revocation infrastructure

## 114. Freshness and Revocation

Delegation must support:

* Expiration
* Revocation
* Scope reduction
* Redelegation restrictions
* Authority-source changes

## 115. Failure Semantics

Delegation validation failure must not increase authority.

Unavailable revocation state requires explicit policy.

## 116. Audit Obligations

Audit should preserve:

* Authority Source
* Delegator
* Delegate
* Grant
* Scope
* Time
* Redelegation
* Revocation

## 117. Candidate Capability Classes

May eventually map to:

* Human delegation service
* Workload delegation service
* Authorization server
* Capability-grant mechanism
* Token-mediated delegation

## 118. Allowed Co-location

May be co-located with Delegation Issuer or Policy Authority.

## 119. Co-location Risks

Co-location can obscure:

```text
Authority Source
        ≠
Delegator
        ≠
Delegation Issuer
```

## 120. Traceability

Role ID: `ROLE-009`

Primary accepted sources:
* IN-005
* IN-009
* ADR-0005
* SI-20
* SI-22
* SI-23
* SI-28

---

# ROLE-010 — Delegation Issuer

## 121. Purpose

A Delegation Issuer encodes, signs, materializes, or transmits a delegation grant.

## 122. Required Inputs

Requires:

* Approved delegation grant
* Delegator identity
* Delegate identity
* Scope
* Constraints
* Validity
* Signing authority
* Representation format

## 123. Required Outputs

Produces:

* Delegation artifact
* Signature or integrity protection
* Issuer metadata
* Validity information

## 124. Authority Held

May hold authority to issue a representation of an already legitimate delegation grant.

## 125. Authority Explicitly Not Held

The Delegation Issuer is not automatically:

* Authority Source
* Delegator
* Authorization Decision Function
* Identity Authority

A cryptographically valid artifact does not create underlying authority.

## 126. Trust Dependencies

Depends on:

* Legitimate grant
* Delegator validation
* Signing key
* Issuer trust
* Representation semantics
* Revocation mechanism

## 127. Freshness and Revocation

Must support:

* Artifact expiration
* Signing-key rotation
* Issuer revocation
* Underlying grant revocation
* Audience or purpose constraints

## 128. Failure Semantics

Issuer failure cannot create or broaden delegation.

Compromise may require invalidation of artifacts independently from authority-source state.

## 129. Audit Obligations

Audit should record:

* Grant reference
* Delegator
* Delegate
* Issuer
* Artifact
* Signing key
* Time
* Revocation state

## 130. Candidate Capability Classes

May eventually map to:

* Token issuer
* Capability issuer
* Delegation service
* Credential-signing component

## 131. Allowed Co-location

May be co-located with Delegator or Authorization server.

## 132. Co-location Risks

Risks include treating:

* Artifact validity as authority validity
* Issuer identity as delegator identity
* Signing capability as authority source

## 133. Traceability

Role ID: `ROLE-010`

Primary accepted sources:
* IN-005
* IN-009
* ADR-0005
* SI-22
* SI-23
* SI-36

---

# ROLE-011 — Policy Authority

## 134. Purpose

A Policy Authority governs policy used in security-relevant decisions.

## 135. Required Inputs

May require:

* Governance decisions
* Resource ownership
* Security requirements
* Trust relationships
* Risk policy
* Degraded-mode policy
* Revocation policy

## 136. Required Outputs

Produces:

* Policy
* Policy version
* Effective time
* Scope
* Decision constraints
* Failure behavior
* Governance metadata

## 137. Authority Held

May hold authority to define policy within an explicitly governed scope.

## 138. Authority Explicitly Not Held

Policy Authority does not automatically:

* Perform authorization evaluation
* Enforce policy
* Issue identity
* Delegate application authority
* Become Trust Anchor

## 139. Trust Dependencies

Depends on:

* Governance legitimacy
* Policy integrity
* Policy distribution
* Trusted versioning
* Administrative controls
* Auditability

## 140. Freshness and Revocation

Must support:

* Policy versioning
* Effective time
* Rollback governance
* Revocation or supersession
* Distribution freshness

## 141. Failure Semantics

Unavailable central policy does not automatically mean allow or deny.

Local behavior must follow explicit resource- and risk-specific failure semantics.

## 142. Audit Obligations

Audit should record:

* Policy change
* Author
* Approver
* Version
* Scope
* Effective time
* Distribution state

## 143. Candidate Capability Classes

May eventually map to:

* Policy repository
* Policy administration point
* Governance workflow
* Configuration authority

## 144. Allowed Co-location

May be co-located with Authorization Decision Function or Trust Coordination Plane.

## 145. Co-location Risks

Risks include:

* Policy creation and evaluation sharing one compromise path
* Policy distribution being mistaken for enforcement
* Control-plane policy ownership becoming universal authority

## 146. Traceability

Role ID: `ROLE-011`

Primary accepted sources:
* IN-007
* IN-008
* IN-009
* ADR-0006
* ADR-0007
* ADR-0008
* SI-30
* SI-31
* SI-38

---

# ROLE-012 — Authorization Decision Function

## 147. Purpose

The Authorization Decision Function determines whether a requested action is permitted under applicable local authority and policy.

## 148. Required Inputs

May require:

* Principal identity
* Runtime identity
* Resource
* Action
* Delegated authority
* Authority provenance
* Attestation Result
* Policy
* Revocation state
* Trusted time
* Environmental context
* Cross-domain assertions
* Degraded-mode state

## 149. Required Outputs

Produces:

* Permit
* Deny
* Indeterminate
* Constraints
* Obligations
* Decision metadata
* Policy version
* Evidence references

## 150. Authority Held

May hold authority to make an authorization decision within its defined authorization domain.

## 151. Authority Explicitly Not Held

Authorization Decision Function does not automatically:

* Establish identity
* Create delegated authority
* Perform attestation
* Enforce the action
* Import external authorization wholesale

## 152. Trust Dependencies

Depends on:

* Identity validation
* Delegation validation
* Policy Authority
* Resource ownership
* Attestation evidence where required
* Trusted time
* Revocation state
* Local authorization governance

## 153. Freshness and Revocation

Must define:

* Decision freshness
* Policy freshness
* Credential freshness
* Revocation freshness
* Cached-decision bounds
* Transaction binding where required

## 154. Failure Semantics

Must explicitly classify:

* Invalid inputs
* Unknown inputs
* Unavailable dependencies
* Stale policy
* Stale revocation
* Degraded control-plane state

Failure must not silently broaden authority.

## 155. Audit Obligations

Audit should record:

* Principal
* Runtime
* Resource
* Action
* Authority
* Evidence
* Policy
* Decision
* Time
* Failure state
* Decision constraints

## 156. Candidate Capability Classes

May eventually map to:

* Policy decision point
* Authorization service
* Local application authorization
* Distributed decision engine

## 157. Allowed Co-location

May be co-located with:

* Application
* Gateway
* Enforcement Point
* Policy service
* Trust coordination component

## 158. Co-location Risks

Risks include:

* Decision mistaken for enforcement
* External identity treated as authority
* Cached decision scope becoming unclear
* Shared compromise with Policy Authority

## 159. Traceability

Role ID: `ROLE-012`

Primary accepted sources:
* IN-005
* IN-007
* IN-008
* IN-009
* ADR-0005
* ADR-0006
* ADR-0007
* ADR-0008
* SI-27
* SI-28
* SI-30
* SI-31

---

# ROLE-013 — Enforcement Point

## 160. Purpose

An Enforcement Point constrains the protected operation and makes an authorization decision effective.

## 161. Required Inputs

Requires:

* Authorization decision
* Resource
* Action
* Decision constraints
* Binding between decision and request
* Policy or enforcement configuration where applicable

## 162. Required Outputs

Produces:

* Allowed operation
* Denied operation
* Enforcement result
* Failure result
* Audit evidence

## 163. Authority Held

May hold technical authority to permit, deny, constrain, or mediate a protected operation.

## 164. Authority Explicitly Not Held

Enforcement does not automatically:

* Establish identity
* Establish delegated authority
* Define authorization policy
* Own resource governance
* Become universal authorization authority

## 165. Trust Dependencies

Depends on:

* Authorization decision
* Decision authenticity
* Decision/request binding
* Enforcement configuration
* Protected-resource path integrity
* Local runtime integrity

## 166. Freshness and Revocation

Must support enforcement of:

* Decision validity
* Transaction binding
* Revoked authority
* Expired credentials where relevant
* Updated policy where required

## 167. Failure Semantics

Enforcement failure is distinct from authorization failure.

A permit decision that is not effectively constrained is not an enforced security control.

Bypass paths must be explicitly analyzed.

## 168. Audit Obligations

Audit should record:

* Decision reference
* Requested action
* Enforcement result
* Protected resource
* Time
* Failure
* Bypass or alternate-path evidence where relevant

## 169. Candidate Capability Classes

May eventually map to:

* API gateway
* Service proxy
* Application middleware
* Resource server
* Sidecar
* Kernel control
* Cloud enforcement mechanism

## 170. Allowed Co-location

May be co-located with:

* Authorization Decision Function
* Protected Resource
* Gateway

## 171. Co-location Risks

Risks include:

* Decision and enforcement failure being indistinguishable
* Alternate paths bypassing the control
* Enforcement configuration controlled by same authority as audit evidence

## 172. Traceability

Role ID: `ROLE-013`

Primary accepted sources:
* IN-007
* IN-009
* ADR-0006
* ADR-0008
* SI-30
* SI-31

---

# ROLE-014 — Protected Resource

## 173. Purpose

A Protected Resource is the security-relevant target of an operation.

## 174. Required Inputs

Receives, as applicable:

* Authorized or otherwise constrained operation
* Request or transaction context
* Resource state
* Resource-local policy context
* Resource ownership context

An enforcement outcome is recorded as evidence; it is not assumed to be a data input consumed by the resource itself.

## 175. Required Outputs

Produces:

* Resource result
* Resource-side audit evidence
* Security-relevant state change
* Failure or rejection where applicable

## 176. Authority Held

The Protected Resource role itself carries no implied identity, delegation, or policy authority merely by being the target of an operation.

The authorization domain governing the resource retains final local access authority unless that authority has itself been explicitly delegated.

## 177. Authority Explicitly Not Held

Resource existence does not itself establish:

* Caller identity
* Caller authority
* Delegation legitimacy
* Attestation validity

## 178. Trust Dependencies

May depend on:

* Local authorization domain
* Enforcement Point
* Resource ownership
* Policy Authority
* Audit function

## 179. Freshness and Revocation

Must respect applicable:

* Authorization freshness
* Revocation
* Transaction state
* Resource state
* Policy version

## 180. Failure Semantics

Resource behavior under unavailable authorization or enforcement must be resource- and risk-specific.

## 181. Audit Obligations

Audit should support:

* Resource
* Action
* Actor
* Authorization decision
* Enforcement result
* Resulting state

## 182. Candidate Capability Classes

May include:

* API
* Secret
* Cryptographic key
* Certificate service
* Database
* Cloud resource
* Agent tool
* Trust configuration
* Signing service

## 183. Allowed Co-location

May contain its own authorization and enforcement functions.

## 184. Co-location Risks

Risks include:

* Resource implementation bypassing external enforcement
* Resource owner implicitly redefining platform trust semantics
* Local audit evidence being fully controlled by the protected system

## 185. Traceability

Role ID: `ROLE-014`

Primary accepted sources:
* IN-003
* IN-009
* ADR-0003
* ADR-0008
* SI-28
* SI-30

---

# ROLE-015 — Audit / Evidence Function

## 186. Purpose

The Audit / Evidence Function records and protects evidence needed to reconstruct security-relevant decisions, trust changes, and resulting actions.

## 187. Required Inputs

May receive evidence from:

* Identity validation
* Attestation
* Delegation
* Authorization
* Enforcement
* Federation
* Governance
* Recovery
* Protected resources

## 188. Required Outputs

Produces:

* Durable evidence record
* Provenance
* Time
* Correlation
* Integrity metadata
* Retention state
* Reconstruction data

## 189. Authority Held

May hold authority to:

* Accept and preserve audit evidence
* Protect evidence integrity
* Enforce retention or evidence-access policy within its domain

## 190. Authority Explicitly Not Held

Audit evidence does not automatically:

* Authorize actions
* Establish identity
* Create delegation
* Enforce runtime policy

## 191. Trust Dependencies

Depends on:

* Evidence producers
* Integrity protection
* Trusted time
* Storage durability
* Administrative governance
* Access control
* Independent custody where required

## 192. Freshness and Revocation

Audit evidence is generally append-oriented rather than revoked.

Corrections, supersession, key rotation, and evidence invalidation must remain attributable.

## 193. Failure Semantics

Audit unavailability must have explicit buffering, loss, reconciliation, or resource-failure semantics.

Operational recovery does not imply evidence integrity has been restored.

## 194. Audit Obligations

The role is itself subject to audit for:

* Evidence ingestion
* Administrative change
* Access
* Deletion
* Retention modification
* Integrity failure
* Recovery

## 195. Candidate Capability Classes

May eventually map to:

* Security log platform
* Append-only ledger
* Transparency system
* SIEM
* Tamper-evident evidence store
* Provenance system

## 196. Allowed Co-location

May be co-located with operational telemetry.

## 197. Co-location Risks

Risks include:

* Protected actor controlling all evidence of its own actions
* Shared administrator enabling evidence modification
* Operational compromise destroying independent auditability

## 198. Traceability

Role ID: `ROLE-015`

Primary accepted sources:
* IN-006
* IN-007
* IN-008
* IN-009
* SI-35
* SI-36
* SI-38

---

# ROLE-016 — Recovery Authority

## 199. Purpose

Recovery Authority governs re-establishment of security-relevant trust state after compromise, loss, failure, or administrative recovery.

## 200. Required Inputs

May require:

* Recovery policy
* Independent recovery credentials
* Multi-party approval
* Evidence of failure or compromise
* Trusted recovery state
* Replacement trust anchors
* Re-registration
* Re-bootstrap evidence

## 201. Required Outputs

May produce:

* Re-established trust state
* Replaced trust anchor
* Rebound principal
* Restored federation
* Emergency trust action
* Recovery evidence
* Re-validation requirement

## 202. Authority Held

Holds privileged authority to perform explicitly governed trust-state recovery actions.

## 203. Authority Explicitly Not Held

Recovery Authority does not automatically become:

* Standing application authority
* Routine authorization authority
* Delegation authority
* Universal administrator

## 204. Trust Dependencies

Depends on:

* Independent trust basis where required
* Recovery governance
* Multi-party control where required
* Trusted time
* Audit evidence
* Replacement anchors or credentials

## 205. Freshness and Revocation

Must support:

* Emergency credential lifecycle
* Recovery authority expiration
* Replacement trust-anchor activation
* Retirement of emergency authority
* Re-validation of restored state

## 206. Failure Semantics

```text
Service Availability Restored
        ≠
Trustworthy State Re-Established
```

Recovery must be treated as a trust-state transition.

## 207. Audit Obligations

Audit should record:

* Recovery initiator
* Approvers
* Authority used
* Trust state changed
* Time
* Replacement anchors
* Re-validation
* Emergency authority retirement

## 208. Candidate Capability Classes

May eventually map to:

* Break-glass system
* Root recovery
* Trust-anchor recovery
* Credential re-bootstrap
* Disaster-recovery trust service

## 209. Allowed Co-location

May share infrastructure with governance components.

## 210. Co-location Risks

Risks include:

* Routine administrator becoming recovery authority
* Compromised trust basis authenticating its own replacement
* Emergency authority persisting indefinitely
* Recovery and audit sharing one compromise path

## 211. Traceability

Role ID: `ROLE-016`

Primary accepted sources:
* IN-004
* IN-008
* IN-009
* ADR-0004
* ADR-0007
* SI-15
* SI-16
* SI-31
* SI-37
* SI-38

---

# ROLE-017 — Trust Coordination / Governance Function

## 212. Purpose

The Trust Coordination / Governance Function coordinates security-relevant trust state and governance across independently distinguishable trust functions.

It is the logical foundation of the future Trust Control Plane.

## 213. Required Inputs

May consume:

* Trust-domain configuration
* Trust-anchor state
* Registration state
* Identity eligibility
* Attestation policy
* Delegation policy
* Authorization policy
* Federation relationships
* Revocation policy
* Recovery policy
* Degraded-mode policy
* Evidence requirements
* Architecture-conformance state

## 214. Required Outputs

May coordinate or distribute:

* Governance state
* Trust relationships
* Policy
* Registration
* Federation state
* Revocation configuration
* Recovery configuration
* Evidence requirements
* Trust-anchor configuration

## 215. Authority Held

May hold explicitly assigned governance or coordination authority.

Specific authority must be named.

## 216. Authority Explicitly Not Held

The Trust Coordination / Governance Function does not automatically become:

* Universal Identity Authority
* Universal Attestation Authority
* Universal Delegation Authority
* Universal Policy Authority
* Universal Authorization Authority
* Universal Enforcement Authority
* Universal Recovery Authority
* Universal Trust Anchor
* Universal Authority Source
* Universal Trust Domain

## 217. Trust Dependencies

May depend on multiple function-scoped trust domains and governance authorities.

Its own administrative and security dependencies must be explicit.

## 218. Freshness and Revocation

Must support lifecycle semantics for:

* Distributed policy
* Trust-anchor state
* Federation state
* Registration
* Revocation
* Degraded-mode policy
* Recovery configuration

Runtime dependency on fresh control-plane state must be explicit per function.

## 219. Failure Semantics

The architecture preserves:

```text
Control Plane Unavailable
        ≠
Authority Granted
```

and:

```text
Control Plane Unavailable
        ≠
Universal Runtime Shutdown
```

Failure behavior remains resource- and risk-specific.

## 220. Audit Obligations

Audit should record security-relevant changes to:

* Trust anchors
* Registration
* Federation
* Identity eligibility
* Attestation policy
* Delegation policy
* Authorization policy
* Revocation
* Degraded-mode behavior
* Recovery configuration
* Enforcement configuration where governed

## 221. Candidate Capability Classes

Future implementation may include combinations of:

* Governance service
* Trust configuration service
* Policy administration
* Registration authority
* Federation configuration
* Trust-anchor management
* Revocation coordination
* Recovery coordination
* Evidence requirement coordination

No product is selected here.

## 222. Allowed Co-location

May be physically or logically co-located with multiple trust functions.

## 223. Co-location Risks

Primary risks include:

* Control plane becoming universal authority
* Common administration creating correlated compromise
* Logical separation being mistaken for compromise independence
* Policy distribution being mistaken for enforcement
* Control-plane participation being mistaken for one trust domain

## 224. Traceability

Role ID: `ROLE-017`

Primary accepted sources:
* IN-003
* IN-007
* IN-008
* IN-009
* ADR-0003
* ADR-0006
* ADR-0007
* ADR-0008
* SI-06
* SI-07
* SI-30
* SI-31
* SI-34
* SI-33
* SI-37
* SI-38

---

# Cross-Role Constraints

## 225. Authority Must Remain Explicit

For every future concrete component:

```text
Component
    ↓
Which ROLE-xxx functions does it implement?
    ↓
Which authority does each role hold?
    ↓
Which authority does it explicitly not hold?
```

A component must not gain implied authority merely because multiple roles are co-located.

---

## 226. Trust Dependencies Must Be Named

Every concrete mapping must identify:

* Trust authority
* Trust anchor
* Accepted namespace
* Validation basis
* Policy source
* Revocation dependency
* Freshness dependency
* Trusted-time dependency
* Recovery dependency

Hidden trust assumptions are non-conformant with this model.

---

## 227. Co-location Does Not Erase Role Boundaries

The architecture preserves:

```text
Same Process
        ≠
Same Architecture Role
```

```text
Same Product
        ≠
Same Authority
```

```text
Same Administrative Domain
        ≠
Same Trust Domain
```

```text
Same Control Plane
        ≠
Universal Trust
```

---

## 228. Freshness Is Function-Specific

Different trust functions may have different freshness requirements.

For example:

* Identity credential validity
* Revocation freshness
* Attestation freshness
* Delegation validity
* Policy version
* Authorization decision validity
* Trust-anchor state
* Recovery state

Task 2 does not impose one universal freshness interval.

---

## 229. Revocation Is Function-Specific

Revocation may apply independently to:

* Identity credential
* Issuer
* Trust anchor
* Delegation grant
* Authority source
* Attestation endorsement
* Attestation result
* Federation relationship
* Policy
* Recovery credential

One revocation mechanism is not assumed to govern all functions.

---

## 230. Failure Semantics Are Role-Specific

Role failure must distinguish as applicable:

* INVALID
* UNKNOWN
* UNAVAILABLE
* STALE
* INCONSISTENT
* DEGRADED
* RECOVERING
* COMPROMISED

No role may silently reinterpret uncertainty as authority.

---

## 231. Auditability Is Cross-Cutting

Audit must preserve enough evidence to reconstruct:

```text
Who or what acted?
Through which runtime?
Using which identity context?
Under whose authority?
Using which delegation?
Using which trust evidence?
Under which policy?
With what authorization decision?
At which enforcement point?
With what enforcement result?
Against which resource?
During which failure or recovery state?
```

Not every action requires every field.

The applicable security model determines the required evidence.

---

# Capability Evaluation Model

## 232. Technology Evaluation Rule

A future technology may be evaluated against one or more `ROLE-xxx` capability contracts.

The evaluation must state:

* Which role is being mapped
* Which capabilities are fully supported
* Which capabilities are partially supported
* Which capabilities are absent
* Which role boundaries the technology tends to collapse
* Which trust anchors it introduces
* Which authorities it introduces
* Which failure semantics it provides
* Which audit evidence it produces
* Which external dependencies it requires

---

## 233. Multi-Role Technology Rule

If one technology implements several roles:

```text
Technology
    ├── ROLE-A
    ├── ROLE-B
    └── ROLE-C
```

the evaluation must still separately analyze:

* Authority held by ROLE-A
* Authority held by ROLE-B
* Authority held by ROLE-C
* Shared compromise paths
* Shared administrative control
* Shared key material
* Shared recovery mechanism
* Shared audit dependencies

Feature consolidation is not automatically architecture simplification.

---

## 234. Missing-Capability Rule

A candidate technology must not be marked conformant merely because missing capabilities could theoretically be supplied later.

The evaluation must distinguish:

```text
Native Capability
        ≠
External Dependency
        ≠
Custom Integration
        ≠
Unsupported Requirement
```

---

# Task 2 Acceptance Gate

## 235. Acceptance Criteria

Task 2 passes when:

* ROLE-001 through ROLE-017 have implementation-neutral capability contracts.
* Each role defines inputs and outputs.
* Each role identifies authority held.
* Each role identifies authority explicitly not held.
* Each role identifies trust dependencies.
* Freshness and revocation semantics are represented.
* Failure semantics are represented.
* Audit obligations are represented.
* Candidate capability classes remain vendor-neutral.
* Co-location is permitted without semantic collapse.
* Co-location risk is explicitly represented.
* Future technology evaluation can map a candidate to roles without redefining those roles.

---

## 236. Failure Modes

Task 2 fails if:

* A role is defined around a selected product.
* Identity and authorization collapse.
* Workload and logical-principal identity collapse.
* Attestation becomes identity or authorization by implication.
* Delegation artifact validity becomes authority validity.
* Policy becomes enforcement.
* Authorization decision becomes enforcement outcome.
* Control-plane participation becomes one universal trust domain.
* Co-location hides shared compromise.
* Failure semantics are omitted.
* Auditability is treated as operational logging only.

---

## 237. Definition of Done

The Task 2 content acceptance gate is satisfied:

* [x] ROLE-001 through ROLE-017 are defined
* [x] Input contracts are defined
* [x] Output contracts are defined
* [x] Authority-held fields are defined
* [x] Authority-not-held fields are defined
* [x] Trust dependencies are defined
* [x] Freshness semantics are defined
* [x] Revocation semantics are defined
* [x] Failure semantics are defined
* [x] Audit obligations are defined
* [x] Candidate capability classes are vendor-neutral
* [x] Co-location semantics are defined
* [x] Co-location risks are defined
* [x] Cross-role constraints are defined
* [x] Technology-evaluation mapping rules are defined
* [x] Mechanical document validation passes
* [x] Semantic architecture review passes

### Repository Closure Gate

Task 2 is not formally **COMPLETE** until repository evidence independently confirms:

* The accepted artifact is committed.
* The commit is pushed to `origin/main`.
* `HEAD == origin/main`.
* The working tree is clean.

The artifact does not predict or embed its own future commit hash.

---

# Accepted Decision

## 238. Task 2 Decision

The accepted Task 2 decision is:

> **Sprint 2 shall treat the accepted logical architecture roles as implementation-neutral capability contracts. Concrete technologies may implement one or more roles, but product boundaries, deployment boundaries, administrative boundaries, and feature consolidation shall not redefine role semantics, authority ownership, trust-domain scope, enforcement responsibility, failure behavior, or audit obligations.**

This is a derived architecture-to-implementation requirement.

It does not select a technology.

---

## 239. ADR Assessment

No new ADR is proposed by Task 2 at this stage.

The role-to-capability model derives from:

* ADR-0002
* ADR-0003
* ADR-0004
* ADR-0005
* ADR-0006
* ADR-0007
* ADR-0008

If semantic review identifies a new cross-platform architecture decision rather than a derived requirement, the Control Plane must stop and create or amend an ADR before acceptance.

---

## References

* `docs/sprints/sprint-02-plan.md`
* `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
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
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`
* `docs/adr/0006-security-invariants-as-architecture-constraints.md`
* `docs/adr/0007-explicit-bounded-security-failure-semantics.md`
* `docs/adr/0008-separate-trust-coordination-from-runtime-enforcement-and-authority-ownership.md`
