# Sprint 2 Task 4 — Authority, Trust-Anchor, and Governance Matrix

**Project:** Autonomous Trust Platform
**Sprint:** Sprint 2 — Trust Control Contracts & Technology Evaluation Gate
**Task:** Task 4 — Authority, Trust-Anchor, and Governance Matrix
**Status:** Accepted
**Task Date:** 2026-08-16
**Accepted Date:** 2026-08-16
**Semantic Review:** PASS
**Owner:** Trust Platform — Control Plane
**Repository Baseline:** `d87a2e8f52a71e03a72a15bc5371804898a4c29e`
**Roadmap Authority:** `docs/sprints/sprint-02-plan.md`
**Traceability Baseline:** `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
**Role Capability Baseline:** `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
**Interface Contract Baseline:** `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`

---

## 1. Objective

Define the authority, trust-anchor, custody, governance, administrative, lifecycle, compromise, and recovery relationships that underpin the Autonomous Trust Platform.

The governing question is:

> **For every security-relevant trust function, who or what is permitted to establish the relevant authority, which trust anchor or verification basis is accepted, who governs it, who operates it, who holds custody of the critical material, how is it rotated or revoked, and what happens if that authority or anchor is compromised?**

Task 4 makes these relationships explicit before technologies are evaluated.

It does not select products, protocols, key-management platforms, cloud services, HSMs, PKI vendors, or deployment topology.

---

## 2. Why This Task Matters

Many trust architectures fail by using one ambiguous field such as:

```text
Owner
```

to represent several different security responsibilities.

Task 4 instead preserves:

```text
Authority
        ≠
Governance Authority
        ≠
Technical Operator
        ≠
Custodian
        ≠
Trust Anchor
        ≠
Administrative Domain
        ≠
Recovery Authority
```

These roles may be co-located in a future implementation.

Their semantics must remain independently visible.

---

# Governance Model

## 3. Required Matrix Fields

Every material authority or trust-anchor relationship defined by this task includes:

* Matrix identifier
* Security function
* Architecture role
* Authority being exercised
* Authority Source
* Governance Authority
* Technical Operator
* Custodian
* Accepting trust domain
* Trust Anchor or verification basis
* Bootstrap basis
* Authentication / verification requirement
* Issuance or activation basis
* Rotation requirement
* Revocation requirement
* Compromise response
* Recovery Authority
* Recovery trust basis
* Downstream dependencies
* Administrative-independence requirement
* Multi-party-governance requirement
* Audit requirement
* Primary `EDGE-xxx` mappings
* Primary `SI-xx` / ADR traceability

These are architecture requirements.

They do not claim that any current component already implements them.

### AUTH Identifier Interpretation

An `AUTH-xxx` identifier names an authority-related architecture requirement.

It does not mean that the mapped role is a universal authority, a trust anchor, or an intrinsic source of truth.

The requirement must still identify:

* The legitimate Authority Source
* The Governance Authority
* The Technical Operator
* The Custodian
* The accepting trust domain
* The verification basis
* The recovery authority

where applicable.

---

## 4. Interpretation of Responsibility Fields

### Authority Source

The legitimate basis from which security-relevant authority derives.

### Governance Authority

The function permitted to define or approve policy, lifecycle, scope, or changes for that authority.

### Technical Operator

The function permitted to perform routine technical operation.

Technical operation does not imply governance authority.

### Custodian

The function responsible for possession, protection, or controlled use of security-relevant key material, credentials, recovery material, or trust anchors.

Custody does not by itself create governance or application authority.

### Trust Anchor

The locally accepted root, key, certificate, verification key, root-of-trust value, or equivalent starting point used to validate a defined trust relationship.

### Accepting Trust Domain

The function-scoped domain that locally decides whether the authority or anchor is acceptable for the intended purpose.

### Recovery Authority

The function permitted to establish replacement or emergency trust state under explicit recovery governance.

---

## 5. General Separation Rule

For every material trust function, future component mapping must be able to answer:

```text
Who may define the authority?
Who may approve changes?
Who may operate the mechanism?
Who may hold the key or critical material?
Who may validate the result?
Who may revoke the authority?
Who may recover the trust state?
Who independently audits those actions?
```

If the answer to every question is the same administrative principal, the design must explicitly evaluate correlated compromise.

---

# AUTH-001 — Identity Issuance Authority

## 6. Security Function

Identity credential or assertion issuance.

## 7. Architecture Role

Primary role:

* `ROLE-003` — Identity Authority

## 8. Authority Being Exercised

Authority to issue identity material within a defined identity trust domain.

## 9. Authority Source

Must derive from an approved identity-governance basis, such as:

* Approved principal registration
* Approved workload registration
* Approved namespace assignment
* Approved identity eligibility

Identity issuance authority must not arise merely from possession of a signing key.

## 10. Governance Authority

Must govern:

* Identity namespace
* Eligibility
* Issuance policy
* Credential lifetime
* Revocation
* Trust-anchor lifecycle
* Recovery policy

## 11. Technical Operator

May operate:

* Issuance service
* Registration integration
* Renewal workflow
* Revocation publication
* Trust-bundle distribution

The operator need not be the governance authority.

## 12. Custodian

Custody may include:

* Issuer signing key
* CA key
* Token-signing key
* Workload identity signing material

Custody must be explicitly governed.

## 13. Accepting Trust Domain

The applicable identity trust domain.

Cross-domain acceptance remains local and purpose-scoped.

## 14. Trust Anchor or Verification Basis

May include:

* CA root
* Issuer verification key
* Federation trust anchor
* Workload identity trust bundle

No specific mechanism is selected.

## 15. Bootstrap Basis

Must define how the issuer and its anchor are first trusted.

Bootstrap may rely on:

* Offline ceremony
* Existing root
* Out-of-band validation
* Multi-party governance
* Platform root

## 16. Verification Requirement

Consumers must validate applicable:

* Issuer
* Signature
* Namespace
* Audience
* Intended use
* Validity
* Revocation
* Local acceptance policy

## 17. Rotation

Must define:

* Issuer-key rotation
* Trust-anchor overlap
* Credential transition
* Consumer update
* Rollback constraints

## 18. Revocation

Must support:

* Credential revocation
* Issuer revocation
* Trust-anchor removal
* Namespace invalidation
* Federation withdrawal

## 19. Compromise Response

Issuer compromise may require:

* Stop issuance
* Revoke affected issuer
* Replace trust anchor where required
* Reissue credentials
* Re-register affected principals
* Revalidate dependent trust
* Audit historical issuance

## 20. Recovery Authority

Must be separately identified.

The compromised identity authority must not be assumed sufficient to authenticate its own replacement.

## 21. Recovery Trust Basis

May require:

* Independent recovery root
* Offline root
* Multi-party recovery credential
* Independent governance approval

## 22. Downstream Dependencies

May include:

* `EDGE-001`
* `EDGE-002`
* `EDGE-008`
* `EDGE-015`

## 23. Administrative Independence

Must evaluate whether:

* Identity eligibility approval
* Issuer operation
* Key custody
* Recovery
* Audit

require independent administrative control.

## 24. Multi-Party Governance

Strongly considered for:

* Root creation
* Root replacement
* Namespace transfer
* Recovery
* Emergency revocation

## 25. Audit

Must preserve:

* Registration
* Issuance
* Renewal
* Revocation
* Key rotation
* Trust-anchor changes
* Administrative changes
* Recovery

## 26. Traceability

Primary sources:

* ADR-0004
* SI-01
* SI-03
* SI-11
* SI-12
* SI-15
* SI-16
* SI-37
* SI-38

---

# AUTH-002 — Principal-to-Runtime Binding Authority

## 27. Security Function

Establishing the binding between a logical principal and the runtime through which it acts.

## 28. Architecture Roles

Primary roles:

* `ROLE-001`
* `ROLE-002`

Supporting roles may include:

* Registration function
* Identity function
* Relying Function
* Authorization Decision Function

## 29. Authority Being Exercised

Authority to assert that a named logical principal is legitimately associated with a defined runtime for a bounded purpose or period.

## 30. Authority Source

May derive from:

* Approved scheduling or assignment
* Principal registration
* Application governance
* Controlled deployment
* Bootstrap binding
* Attested assignment where explicitly designed

No one mechanism is selected.

## 31. Governance Authority

Must define:

* Who may assign principals to runtimes
* Which bindings are security-relevant
* Whether multiple runtimes are allowed
* Binding lifetime
* Migration semantics
* Revocation
* Recovery

## 32. Technical Operator

May perform:

* Assignment
* Registration
* Runtime launch
* Binding publication
* Binding invalidation

## 33. Custodian

Where cryptographic binding material exists, custody must identify who controls it.

If the binding is non-cryptographic, the integrity authority for the binding state must still be explicit.

## 34. Accepting Trust Domain

Depends on the consuming function:

* Identity domain
* Authorization domain
* Audit domain

A binding accepted for attribution need not be sufficient for authorization.

## 35. Trust Anchor or Verification Basis

May include:

* Signed assignment
* Registration database integrity
* Runtime identity
* Attestation
* Orchestration control
* Deployment provenance

The binding authority must be explicit.

## 36. Bootstrap Basis

Must define how the first legitimate binding is established.

A runtime credential does not silently bootstrap logical-principal identity.

## 37. Verification Requirement

Must validate as applicable:

* Principal
* Runtime
* Binding authority
* Binding scope
* Time
* Current assignment
* Revocation

## 38. Rotation

May apply to:

* Runtime identity
* Binding credential
* Assignment token
* Registration state

## 39. Revocation

Binding must be invalidated when:

* Runtime terminates
* Principal moves
* Assignment changes
* Runtime compromised
* Principal revoked
* Governance removes the association

## 40. Compromise Response

Must evaluate:

* Runtime compromise
* Assignment-system compromise
* Binding-authority compromise
* Replay of stale binding state

## 41. Recovery Authority

Must identify who may re-establish the principal/runtime relationship after compromise.

## 42. Recovery Trust Basis

Must be independent of compromised binding state when compromise is relevant.

## 43. Downstream Dependencies

Primary:

* `EDGE-002`
* `EDGE-008`
* `EDGE-013`

## 44. Administrative Independence

Must evaluate whether the system that launches the runtime should also control:

* Logical-principal assignment
* Binding approval
* Binding audit

## 45. Multi-Party Governance

May be required for high-risk principal reassignment or recovery.

## 46. Audit

Must preserve:

* Principal
* Runtime
* Assignment
* Binding authority
* Effective time
* Revocation
* Migration
* Recovery

## 47. Traceability

Primary sources:

* ADR-0002
* ADR-0004
* SI-02
* SI-03
* SI-11
* SI-25
* SI-35

---

# AUTH-003 — Attestation Evidence Production Authority

## 48. Security Function

Producing security-relevant Attestation Evidence.

## 49. Architecture Role

Primary:

* `ROLE-005` — Attester

## 50. Authority Being Exercised

The Attester is permitted to produce Attestation Evidence under a defined attestation mechanism and governance scope.

This is evidence-production authority only.

It does not make each claim intrinsically trustworthy, does not establish appraisal authority, and does not grant identity or authorization.

## 51. Authority Source

The legitimacy to act as an accepted Attester must derive from explicit attestation governance, enrollment, registration, endorsement, or another approved eligibility basis.

The cryptographic or hardware trust basis used to authenticate the Evidence is separate from that governance authority.

## 52. Governance Authority

Must govern:

* Which measurements matter
* Which evidence types are accepted
* Attester eligibility
* Endorsements
* Evidence freshness
* Compromise handling

## 53. Technical Operator

May operate the mechanism collecting and presenting Evidence.

## 54. Custodian

May hold:

* Attestation key
* Device key
* TEE key material
* Evidence-signing key

Hardware-protected custody may be required by future technology evaluation.

## 55. Accepting Trust Domain

The attestation trust domain.

Acceptance by one domain does not imply universal acceptance.

## 56. Trust Anchor or Verification Basis

May include:

* Manufacturer root
* Platform root
* Endorsement chain
* Device root
* Evidence-signing key
* Workload-registration or enrollment basis

The trust anchor or verification basis supports authentication and verification of Evidence.

It does not itself define which claims are acceptable or which security decision may rely on them.

## 57. Bootstrap Basis

Must define how the attester trust basis is initially accepted.

## 58. Verification Requirement

Must verify:

* Evidence integrity
* Attester
* Endorsements
* Freshness
* Challenge where applicable
* Evidence scope

## 59. Rotation

Must define applicable lifecycle for:

* Attestation key
* Endorsement
* Device identity
* Platform root

## 60. Revocation

May apply to:

* Attester key
* Endorsement
* Device
* Platform
* Registration

## 61. Compromise Response

Must distinguish:

* Attester compromise
* Runtime compromise
* Verifier compromise
* Unavailability

Compromise may require invalidating prior assumptions.

## 62. Recovery Authority

Must identify who may re-establish accepted attestation state.

## 63. Recovery Trust Basis

Must not rely solely on the compromised evidence source.

## 64. Downstream Dependencies

Primary:

* `EDGE-003`
* `EDGE-004`
* `EDGE-008`
* `EDGE-015`

## 65. Administrative Independence

Must evaluate independence among:

* Evidence producer
* Endorsement authority
* Reference-value governance
* Verifier
* Audit

## 66. Multi-Party Governance

May be required for:

* Reference-value approval
* Root replacement
* Trust-domain changes
* Recovery

## 67. Audit

Must record:

* Attester
* Evidence type
* Evidence generation
* Endorsement
* Key lifecycle
* Revocation
* Recovery

## 68. Traceability

Primary sources:

* SI-17
* SI-18
* SI-31
* SI-32
* SI-34
* SI-37

---

# AUTH-004 — Attestation Appraisal Authority

## 69. Security Function

Appraising Attestation Evidence and producing Attestation Results.

## 70. Architecture Role

Primary:

* `ROLE-006` — Attestation Verifier

## 71. Authority Being Exercised

Authority to appraise Evidence under approved reference values and appraisal policy.

## 72. Authority Source

Must derive from an approved attestation-governance basis.

Possession of a verifier signing key is not itself sufficient authority to define appraisal policy.

## 73. Governance Authority

Must govern:

* Reference values
* Appraisal policy
* Accepted evidence types
* Verifier eligibility
* Result scope
* Freshness
* Recovery

## 74. Technical Operator

May operate the Verifier.

## 75. Custodian

May hold:

* Verifier signing key
* Confidential reference values
* Verification trust material

## 76. Accepting Trust Domain

The local or federated attestation trust domain.

## 77. Trust Anchor or Verification Basis

May include:

* Verifier identity
* Verifier signing key
* Verifier trust anchor
* Appraisal-policy integrity
* Reference-value integrity

## 78. Bootstrap Basis

Must define how the Verifier and appraisal policy become trusted.

## 79. Verification Requirement

Relying Functions must validate:

* Verifier
* Result integrity
* Scope
* Freshness
* Policy reference
* Intended purpose

## 80. Rotation

Must define:

* Verifier-key rotation
* Policy update
* Reference-value update
* Result validity transition

## 81. Revocation

May apply to:

* Verifier
* Verifier key
* Appraisal policy
* Reference value
* Result

## 82. Compromise Response

Verifier compromise may require:

* Reject new results
* Revoke verifier trust
* Review prior results
* Revalidate dependent decisions
* Re-establish verifier trust

## 83. Recovery Authority

Must be identified separately from the compromised Verifier.

## 84. Recovery Trust Basis

May require independent attestation governance or recovery root.

## 85. Downstream Dependencies

Primary:

* `EDGE-004`
* `EDGE-008`
* `EDGE-015`

## 86. Administrative Independence

Must evaluate whether evidence appraisal should be independently governed from:

* Evidence production
* Runtime administration
* Authorization
* Audit

## 87. Multi-Party Governance

May be required for high-impact:

* Reference-value changes
* Appraisal-policy changes
* Verifier trust changes
* Recovery

## 88. Audit

Must preserve:

* Verifier
* Evidence reference
* Reference values
* Appraisal policy
* Result
* Key changes
* Revocation
* Recovery

## 89. Traceability

Primary sources:

* SI-09
* SI-17
* SI-18
* SI-31
* SI-34
* SI-37
* SI-38

---

# AUTH-005 — Delegable Authority Source

## 90. Security Function

Establishing the legitimate source from which delegated authority may derive.

## 91. Architecture Role

Primary:

* `ROLE-008` — Authority Source

## 92. Authority Being Exercised

Authority over a defined resource, action, entitlement, or governance function that may be delegated within explicit bounds.

## 93. Authority Source

This row represents the Authority Source itself.

Its legitimacy may derive from:

* Resource ownership
* Application ownership
* Organizational governance
* Existing entitlement authority
* Platform governance
* Explicit policy

## 94. Governance Authority

Must define:

* Which authority is delegable
* Maximum delegation scope
* Delegation depth
* Redelegation
* Expiration
* Revocation
* Recovery

## 95. Technical Operator

May administer:

* Entitlements
* Delegation configuration
* Grant lifecycle
* Authority registry

## 96. Custodian

May hold:

* Administrative credentials
* Authority-signing material
* Delegation root keys

Custody does not itself make the custodian the Authority Source.

## 97. Accepting Trust Domain

The relevant authorization or resource domain.

## 98. Trust Anchor or Verification Basis

May be governance-backed rather than purely cryptographic.

The source of authority must remain traceable even when represented by a credential or artifact.

## 99. Bootstrap Basis

Must define how the initial resource authority is recognized.

## 100. Verification Requirement

Must verify:

* Authority Source
* Current authority
* Delegability
* Scope
* Applicable policy

## 101. Rotation

May affect:

* Administrative credentials
* Authority-signing keys
* Delegation root keys
* Registry credentials

## 102. Revocation

Must support:

* Authority withdrawal
* Scope reduction
* Delegability removal
* Downstream delegation invalidation

## 103. Compromise Response

Must assess every downstream grant that depended on the compromised Authority Source.

## 104. Recovery Authority

Must identify who may restore legitimate authority-source state.

## 105. Recovery Trust Basis

Must be independently governed where compromise affects the standing authority source.

## 106. Downstream Dependencies

Primary:

* `EDGE-005`
* `EDGE-006`
* `EDGE-008`

## 107. Administrative Independence

Must evaluate separation among:

* Authority Source
* Delegator
* Delegation Issuer
* Authorization Decision Function
* Audit

## 108. Multi-Party Governance

May be required for high-impact authority-source changes.

## 109. Audit

Must preserve:

* Authority origin
* Scope
* Delegability
* Changes
* Revocation
* Downstream grants
* Recovery

## 110. Traceability

Primary sources:

* ADR-0005
* SI-20
* SI-22
* SI-23
* SI-36
* SI-37

---

# AUTH-006 — Delegator Authority

## 111. Security Function

Granting bounded authority to another principal.

## 112. Architecture Role

Primary:

* `ROLE-009` — Delegator

## 113. Authority Being Exercised

Authority to delegate a subset of legitimately held DelegableAuthority.

The invariant remains:

```text
GrantedAuthority
        ⊆
DelegableAuthority
```

## 114. Authority Source

Must trace to `AUTH-005`.

The Delegator cannot create its own source of authority.

## 115. Governance Authority

Must govern:

* Delegation scope
* Delegate eligibility
* Expiration
* Redelegation
* Revocation
* Audience
* Transaction constraints

## 116. Technical Operator

May operate delegation workflow or approval system.

## 117. Custodian

May hold:

* Delegation-signing key
* Administrative delegation credentials

If a separate issuer exists, the Delegator need not hold issuance key material.

## 118. Accepting Trust Domain

The local authorization domain.

External delegation remains subject to local authorization.

## 119. Trust Anchor or Verification Basis

Must validate:

* Delegator identity
* Authority Source
* Delegable authority
* Delegation policy

## 120. Bootstrap Basis

Must define how the Delegator first receives delegable authority.

## 121. Verification Requirement

Consumers must validate:

* Delegator
* Source
* Scope
* Delegate
* Validity
* Revocation
* Redelegation constraints

## 122. Rotation

May apply to:

* Delegator credential
* Signing key
* Issuance key where co-located

## 123. Revocation

Must propagate from:

* Authority Source
* Delegator
* Grant
* Delegate
* Issuer where applicable

## 124. Compromise Response

Must evaluate:

* Unauthorized grants
* Scope amplification
* Downstream redelegation
* Artifact revocation

## 125. Recovery Authority

Must identify who may restore Delegator authority.

## 126. Recovery Trust Basis

Must not derive solely from compromised delegation state.

## 127. Downstream Dependencies

Primary:

* `EDGE-005`
* `EDGE-006`
* `EDGE-008`
* `EDGE-015`

## 128. Administrative Independence

Must preserve:

```text
Authority Source
        ≠
Delegator
        ≠
Delegation Issuer
```

even if one component implements all three.

## 129. Multi-Party Governance

May be required for:

* Broad delegation
* High-impact redelegation
* Emergency delegation
* Recovery

## 130. Audit

Must preserve:

* Source
* Delegator
* Delegate
* Scope
* Grant
* Redelegation
* Revocation
* Recovery

## 131. Traceability

Primary sources:

* ADR-0005
* SI-20
* SI-22
* SI-23
* SI-28
* SI-36

---

# AUTH-007 — Delegation Issuance Authority

## 132. Security Function

Encoding or signing an approved delegation grant.

## 133. Architecture Role

Primary:

* `ROLE-010` — Delegation Issuer

## 134. Authority Being Exercised

Authority to produce a cryptographically or otherwise integrity-protected representation of an existing legitimate grant.

## 135. Authority Source

Must derive from an approved Delegator grant.

Issuance ability does not create underlying authority.

## 136. Governance Authority

Must govern:

* Issuer eligibility
* Artifact format
* Signing policy
* Key lifecycle
* Audience
* Revocation
* Issuance records

## 137. Technical Operator

May operate the delegation-issuance service.

## 138. Custodian

May hold:

* Delegation-artifact signing key
* Token-signing key
* Capability-signing key

## 139. Accepting Trust Domain

The relevant authorization or delegation-validation domain.

## 140. Trust Anchor or Verification Basis

May include:

* Issuer verification key
* Issuer certificate
* Signing trust chain

## 141. Bootstrap Basis

Must define how consumers initially trust the Delegation Issuer.

## 142. Verification Requirement

Consumers must validate:

* Issuer
* Artifact integrity
* Underlying grant
* Delegator
* Authority Source
* Scope
* Validity

## 143. Rotation

Must support signing-key rotation without obscuring the underlying authority provenance.

## 144. Revocation

May apply to:

* Issuer
* Issuer key
* Artifact
* Underlying grant

## 145. Compromise Response

Issuer compromise may invalidate artifact integrity without necessarily changing the Authority Source itself.

The architecture must distinguish those impacts.

## 146. Recovery Authority

Must identify who may authorize a replacement Delegation Issuer.

## 147. Recovery Trust Basis

May rely on governance separate from the issuer key being replaced.

## 148. Downstream Dependencies

Primary:

* `EDGE-005`
* `EDGE-006`

## 149. Administrative Independence

Must evaluate separation from:

* Authority Source
* Delegator
* Authorization Decision Function

## 150. Multi-Party Governance

May be required for:

* Signing-root replacement
* Issuer recovery
* High-impact issuer trust changes

## 151. Audit

Must preserve:

* Grant reference
* Delegator
* Issuer
* Key
* Artifact
* Time
* Revocation
* Recovery

## 152. Traceability

Primary sources:

* ADR-0005
* SI-22
* SI-23
* SI-36
* SI-37

---

# AUTH-008 — Policy Governance Authority

## 153. Security Function

Defining and approving security-relevant policy.

## 154. Architecture Role

Primary:

* `ROLE-011` — Policy Authority

## 155. Authority Being Exercised

Authority to define policy for an explicitly governed scope.

## 156. Authority Source

May derive from:

* Resource ownership
* Security governance
* Application governance
* Trust-domain governance
* Recovery governance

## 157. Governance Authority

This row represents policy governance itself.

It must define:

* Policy scope
* Author
* Approver
* Change process
* Versioning
* Effective time
* Rollback
* Emergency change
* Recovery

## 158. Technical Operator

May operate:

* Policy repository
* Policy administration service
* Distribution system
* Validation pipeline

## 159. Custodian

May hold:

* Policy-signing key
* Repository-administration credential
* Approval credentials

## 160. Accepting Trust Domain

Depends on policy type:

* Identity
* Attestation
* Delegation
* Authorization
* Enforcement
* Recovery
* Federation

Policy acceptance remains function-scoped.

## 161. Trust Anchor or Verification Basis

May include:

* Policy signature
* Approved repository
* Governance workflow
* Version-control integrity
* Distribution trust

## 162. Bootstrap Basis

Must define how the initial Policy Authority is recognized.

## 163. Verification Requirement

Consumers must validate:

* Policy authority
* Version
* Scope
* Effective time
* Integrity
* Approval state

## 164. Rotation

May apply to:

* Policy-signing key
* Administration credentials
* Approval credentials

## 165. Revocation

Must support:

* Policy supersession
* Emergency withdrawal
* Policy-authority revocation
* Signing-key revocation

## 166. Compromise Response

Must evaluate:

* Malicious policy
* Unauthorized rollback
* Forged version
* Hidden stale policy
* Distribution compromise

## 167. Recovery Authority

Must identify who may restore or replace policy governance.

## 168. Recovery Trust Basis

May require:

* Independent governance approval
* Repository recovery
* Separate signing root
* Multi-party control

## 169. Downstream Dependencies

Primary:

* `EDGE-007`
* `EDGE-008`
* `EDGE-009`
* `EDGE-011`
* `EDGE-014`
* `EDGE-015`

## 170. Administrative Independence

Must evaluate whether policy creation, approval, distribution, decision, enforcement, and audit should be administratively separated.

## 171. Multi-Party Governance

Strongly considered for:

* Root policy changes
* Recovery policy
* Trust-anchor policy
* Federation policy
* Emergency degraded-mode policy

## 172. Audit

Must preserve:

* Author
* Approver
* Version
* Scope
* Effective time
* Rollback
* Distribution
* Emergency change
* Recovery

## 173. Traceability

Primary sources:

* ADR-0006
* ADR-0007
* ADR-0008
* SI-30
* SI-31
* SI-38

---

# AUTH-009 — Authorization Decision Authority

## 174. Security Function

Making a local authorization decision.

## 175. Architecture Role

Primary:

* `ROLE-012` — Authorization Decision Function

## 176. Authority Being Exercised

Authority to determine whether a protected action is permitted within a defined authorization domain.

## 177. Authority Source

Must derive from:

* Resource or application governance
* Applicable delegated authority
* Policy Authority
* Local authorization governance

## 178. Governance Authority

Must define:

* Authorization domain
* Decision inputs
* Combining semantics
* Freshness
* Cache policy
* Transaction binding
* Failure behavior
* Evidence requirements

## 179. Technical Operator

May operate the decision service or engine.

## 180. Custodian

May hold:

* Decision-signing key
* Service credential
* Protected policy material

Custody of the decision-service key does not itself grant resource authority.

## 181. Accepting Trust Domain

The local authorization domain governing the protected resource.

## 182. Trust Anchor or Verification Basis

May include:

* Decision-function identity
* Policy trust
* Input-validation trust
* Decision signature
* Local service trust

## 183. Bootstrap Basis

Must define how the Authorization Decision Function becomes trusted by Enforcement Points.

## 184. Verification Requirement

Must validate:

* Principal context
* Authority
* Policy
* Resource
* Action
* Required evidence
* Decision freshness
* Revocation state

## 185. Rotation

May apply to:

* Decision-signing key
* Service credential
* Policy trust
* Input trust anchors

## 186. Revocation

May apply to:

* Decision function
* Service identity
* Signing key
* Policy
* Underlying authority

## 187. Compromise Response

Must evaluate:

* Forged permits
* Unauthorized cache entries
* Policy bypass
* Invalid authority composition
* Downstream enforcement exposure

## 188. Recovery Authority

Must identify who may restore trusted decision service state.

## 189. Recovery Trust Basis

Should be independent where decision infrastructure is compromised.

## 190. Downstream Dependencies

Primary:

* `EDGE-008`
* `EDGE-009`
* `EDGE-010`

## 191. Administrative Independence

Must evaluate separation from:

* Policy Authority
* Enforcement Point
* Resource owner
* Audit

## 192. Multi-Party Governance

May be required for:

* Authorization-domain changes
* Root policy changes
* Decision-root recovery
* Emergency degraded-mode policy

## 193. Audit

Must preserve:

* Decision
* Inputs
* Authority
* Policy
* Resource
* Action
* Time
* Failure state

## 194. Traceability

Primary sources:

* ADR-0005
* ADR-0006
* ADR-0007
* ADR-0008
* SI-27
* SI-28
* SI-30
* SI-31

---

# AUTH-010 — Enforcement Authority

## 195. Security Function

Constraining the protected action.

## 196. Architecture Role

Primary:

* `ROLE-013` — Enforcement Point

## 197. Authority Being Exercised

Technical authority to permit, deny, constrain, or mediate a protected operation.

## 198. Authority Source

Must derive from the governance of the Protected Resource and its authorization domain.

## 199. Governance Authority

Must define:

* Which paths are protected
* Which decisions are accepted
* Bypass policy
* Failure behavior
* Alternate-path coverage
* Enforcement configuration
* Evidence requirements

## 200. Technical Operator

May operate:

* Gateway
* Proxy
* Middleware
* Resource-side enforcement
* Kernel or cloud control

## 201. Custodian

May hold:

* Enforcement service credentials
* Decision-validation key
* Resource integration credentials

## 202. Accepting Trust Domain

The resource's enforcement or authorization domain.

## 203. Trust Anchor or Verification Basis

May include:

* Decision-function trust
* Enforcement configuration trust
* Resource integration trust
* Service identity

## 204. Bootstrap Basis

Must define how the Enforcement Point becomes an authorized mediator of the resource.

## 205. Verification Requirement

Must verify:

* Decision authenticity
* Decision scope
* Resource
* Action
* Request binding
* Validity
* Constraints

## 206. Rotation

May apply to:

* Service credential
* Decision-validation key
* Configuration trust
* Resource integration key

## 207. Revocation

Must support removal of:

* Enforcement service
* Decision trust
* Resource integration
* Bypass authorization
* Emergency configuration

## 208. Compromise Response

Must evaluate:

* Permit bypass
* Deny bypass
* Decision substitution
* Alternate path
* False enforcement evidence

## 209. Recovery Authority

Must identify who may restore trusted enforcement after compromise.

## 210. Recovery Trust Basis

May require independent resource governance or recovery authority.

## 211. Downstream Dependencies

Primary:

* `EDGE-009`
* `EDGE-010`
* `EDGE-013`

## 212. Administrative Independence

Must evaluate separation from:

* Authorization Decision Function
* Resource administration
* Audit

## 213. Multi-Party Governance

May be required for:

* Root enforcement configuration
* Bypass enablement
* Emergency override
* Recovery

## 214. Audit

Must preserve:

* Decision reference
* Enforcement action
* Resource
* Result
* Configuration changes
* Bypass changes
* Recovery

## 215. Traceability

Primary sources:

* ADR-0006
* ADR-0007
* ADR-0008
* SI-30
* SI-31
* SI-34
* SI-35

---

# AUTH-011 — Revocation Authority

## 216. Security Function

Invalidating previously accepted security state.

## 217. Architecture Roles

Function-specific.

Potential roles include:

* `ROLE-003`
* `ROLE-009`
* `ROLE-011`
* `ROLE-016`
* `ROLE-017`

## 218. Authority Being Exercised

Authority to revoke or invalidate a specific object or trust relationship.

## 219. Authority Source

Revocation authority must derive from the same or a legitimately superior governance basis as the object being revoked.

## 220. Governance Authority

Must define who may revoke:

* Credential
* Issuer
* Trust anchor
* Delegation
* Binding
* Attester
* Verifier
* Federation relationship
* Policy
* Recovery credential

## 221. Technical Operator

May operate revocation publication or distribution.

## 222. Custodian

May hold revocation-signing or administration credentials.

## 223. Accepting Trust Domain

The trust domain consuming the revocation state.

## 224. Trust Anchor or Verification Basis

Must validate the authority that issued the revocation state.

## 225. Bootstrap Basis

Must define how revocation authority becomes trusted.

## 226. Verification Requirement

Consumers must validate:

* Revoking authority
* Target
* Effective time
* Scope
* Version
* Integrity

## 227. Rotation

May apply to:

* Revocation-signing key
* Publication credential
* Administration credential

## 228. Revocation

Revocation authority itself must be revocable or replaceable.

## 229. Compromise Response

Must evaluate:

* False revocation
* Suppressed revocation
* Revocation rollback
* Compromised publisher
* Compromised revocation root

## 230. Recovery Authority

Must identify who may restore trusted revocation capability.

## 231. Recovery Trust Basis

Must not depend solely on compromised revocation infrastructure.

## 232. Downstream Dependencies

Primary:

* `EDGE-001`
* `EDGE-003`
* `EDGE-004`
* `EDGE-005`
* `EDGE-006`
* `EDGE-007`
* `EDGE-008`
* `EDGE-009`
* `EDGE-011`
* `EDGE-012`
* `EDGE-015`

## 233. Administrative Independence

High-value revocation infrastructure may require independent administration from the authority it can revoke.

## 234. Multi-Party Governance

May be required for:

* Root revocation
* Trust-anchor removal
* Federation severance
* Emergency revocation

## 235. Audit

Must preserve:

* Authority
* Target
* Reason/class
* Effective time
* Publication
* Consumer observation
* Recovery

## 236. Traceability

Primary sources:

* ADR-0004
* ADR-0005
* ADR-0007
* ADR-0008
* SI-03
* SI-20
* SI-31
* SI-37
* SI-38

---

# ANCHOR-001 — Identity Trust Anchor

## 237. Security Function

Validating identity issuers and credentials.

## 238. Trust Anchor

May be:

* CA root
* Issuer public key
* Trust bundle
* Federation root

## 239. Governance Authority

Must approve:

* Creation
* Scope
* Trust domain
* Distribution
* Rotation
* Removal
* Recovery

## 240. Technical Operator

May distribute anchor state.

## 241. Custodian

Controls the private key corresponding to a root where applicable.

A verifier holding the public anchor is not the custodian of the root private key.

## 242. Accepting Trust Domain

Identity trust domain.

## 243. Bootstrap Basis

Must be explicit and independently verifiable.

## 244. Rotation

Must support:

* Overlap
* Versioning
* Activation
* Retirement
* Consumer transition

## 245. Revocation / Removal

Must define emergency and planned anchor removal.

## 246. Compromise Response

Root compromise may invalidate large portions of downstream identity trust and require:

* New root
* Reissue
* Re-registration
* Revalidation
* Historical review

## 247. Recovery Authority

Must not rely solely on compromised root material.

## 248. Audit

Must preserve every security-relevant lifecycle event.

## 249. Edge Mapping

Primary:

* `EDGE-001`
* `EDGE-012`
* `EDGE-015`

## 250. Traceability

Primary:

* ADR-0003
* ADR-0004
* SI-12
* SI-15
* SI-16
* SI-37
* SI-38

---

# ANCHOR-002 — Attestation Trust Anchor

## 251. Security Function

Validating attestation Evidence, endorsements, or Verifier results.

## 252. Trust Anchor

May include:

* Manufacturer root
* Platform root
* Device root
* Verifier root
* Endorsement root

## 253. Governance Authority

Must approve which attestation roots are acceptable for which purpose.

## 254. Technical Operator

May distribute trusted roots, endorsements, or reference configuration.

## 255. Custodian

Depends on root type.

Hardware/manufacturer roots may be externally controlled.

That external dependency must remain explicit.

## 256. Accepting Trust Domain

Attestation trust domain.

## 257. Bootstrap Basis

Must explicitly define how external or local attestation roots become accepted.

## 258. Rotation

Must account for:

* Manufacturer rotation
* Verifier rotation
* Endorsement lifecycle
* Platform replacement

## 259. Revocation / Removal

Must allow local removal even if external issuer remains active.

## 260. Compromise Response

Must assess:

* Root compromise
* Manufacturer compromise
* Verifier compromise
* Platform compromise
* Reference-value compromise

## 261. Recovery Authority

Must be explicit for locally governed attestation trust.

## 262. Audit

Must preserve changes in accepted roots and external trust relationships.

## 263. Edge Mapping

Primary:

* `EDGE-003`
* `EDGE-004`
* `EDGE-012`
* `EDGE-015`

## 264. Traceability

Primary:

* SI-17
* SI-18
* SI-34
* SI-37
* SI-38

---

# ANCHOR-003 — Delegation Verification Anchor

## 265. Security Function

Validating delegation artifacts and issuers.

## 266. Trust Anchor

May include:

* Delegation issuer public key
* Delegation CA root
* Capability-signing root
* Token-signing trust key

## 267. Governance Authority

Must define which Delegation Issuers are acceptable and for which authority domains.

## 268. Technical Operator

May distribute issuer trust.

## 269. Custodian

Controls issuer private signing material where applicable.

## 270. Accepting Trust Domain

Authorization or delegation-validation domain.

## 271. Bootstrap Basis

Must define how issuer trust is established without confusing issuer trust with Authority Source legitimacy.

## 272. Rotation

Must preserve linkage between old/new issuer material and the underlying delegation authority.

## 273. Revocation / Removal

Must support:

* Issuer removal
* Signing-key revocation
* Domain removal

## 274. Compromise Response

Issuer compromise may invalidate artifacts without itself changing the underlying Authority Source.

## 275. Recovery Authority

Must identify who may authorize replacement issuer trust.

## 276. Audit

Must preserve issuer trust lifecycle and affected artifacts.

## 277. Edge Mapping

Primary:

* `EDGE-005`
* `EDGE-006`
* `EDGE-012`
* `EDGE-015`

## 278. Traceability

Primary:

* ADR-0005
* SI-22
* SI-23
* SI-36
* SI-37

---

# ANCHOR-004 — Policy Integrity Anchor

## 279. Security Function

Validating policy authority, policy integrity, or policy distribution.

## 280. Trust Anchor

May include:

* Policy-signing key
* Repository root
* Governance approval root
* Configuration trust root

## 281. Governance Authority

Must define which policy authorities are accepted for which functions.

## 282. Technical Operator

May distribute policy and trust material.

## 283. Custodian

May hold policy-signing or repository-control keys.

## 284. Accepting Trust Domain

Function-scoped:

* Authorization
* Identity
* Attestation
* Delegation
* Enforcement
* Recovery

## 285. Bootstrap Basis

Must explicitly establish initial policy-authority trust.

## 286. Rotation

Must preserve policy provenance, versioning, and rollback governance.

## 287. Revocation / Removal

Must allow removal of compromised policy authority.

## 288. Compromise Response

Must evaluate unauthorized policy, rollback, or distribution tampering.

## 289. Recovery Authority

Must be independent when the policy root itself is compromised.

## 290. Audit

Must preserve:

* Policy authority
* Root changes
* Versions
* Approval
* Rollback
* Recovery

## 291. Edge Mapping

Primary:

* `EDGE-007`
* `EDGE-008`
* `EDGE-009`
* `EDGE-012`

## 292. Traceability

Primary:

* ADR-0006
* ADR-0007
* ADR-0008
* SI-30
* SI-31
* SI-38

---

# ANCHOR-005 — Authorization Decision Trust Anchor

## 293. Security Function

Validating decisions or the Authorization Decision Function itself.

## 294. Trust Anchor

May include:

* Decision-service identity root
* Decision-signing key
* Service mesh identity root
* Local authorization trust root

## 295. Governance Authority

Must define which Authorization Decision Functions may issue decisions for which resources.

## 296. Technical Operator

May operate the decision service.

## 297. Custodian

May control decision-signing key or service identity key.

## 298. Accepting Trust Domain

The resource's authorization/enforcement domain.

## 299. Bootstrap Basis

Enforcement Points must explicitly bootstrap trust in the decision source.

## 300. Rotation

Must support decision-service key and identity rotation.

## 301. Revocation / Removal

Must support rapid removal of compromised decision sources.

## 302. Compromise Response

Must evaluate potentially forged or invalid prior permits.

## 303. Recovery Authority

Must define how trusted decision issuance is re-established.

## 304. Audit

Must preserve decision-source lifecycle and trust changes.

## 305. Edge Mapping

Primary:

* `EDGE-009`
* `EDGE-010`
* `EDGE-012`

## 306. Traceability

Primary:

* ADR-0006
* ADR-0007
* ADR-0008
* SI-30
* SI-31
* SI-37

---

# ANCHOR-006 — Audit Evidence Integrity Anchor

## 307. Security Function

Validating protected audit evidence or provenance.

## 308. Trust Anchor

May include:

* Evidence-signing root
* Transparency-log root
* Hash-chain root
* Audit-service identity root

## 309. Governance Authority

Must govern:

* Which evidence requires stronger integrity protection
* Retention
* Verification
* Key lifecycle
* Independent custody

## 310. Technical Operator

May operate audit ingestion and evidence protection.

## 311. Custodian

May hold:

* Evidence-signing key
* Integrity root
* Archive key

## 312. Accepting Trust Domain

Audit / evidence trust domain.

## 313. Bootstrap Basis

Must define how evidence integrity trust is established independently from the protected actor where required.

## 314. Rotation

Must preserve historical verification across key changes.

## 315. Revocation / Removal

Must allow evidence keys to be revoked while retaining interpretation of historical evidence.

## 316. Compromise Response

Must evaluate:

* Forged evidence
* Deleted evidence
* Rewritten history
* Broken integrity chain
* Shared-admin compromise

## 317. Recovery Authority

Must define how audit trust is restored without silently rewriting prior evidence.

## 318. Audit

The audit trust system must itself be audited.

## 319. Edge Mapping

Primary:

* `EDGE-010`
* `EDGE-013`
* `EDGE-014`

## 320. Traceability

Primary:

* SI-34
* SI-35
* SI-36
* SI-38

---

# ANCHOR-007 — Recovery Trust Anchor

## 321. Security Function

Establishing trusted recovery authority.

## 322. Trust Anchor

May include a locally accepted verification root or recovery trust basis such as:

* Offline root
* Recovery signing root
* Multi-party recovery verification root
* Independent hardware root
* Other independently governed recovery verification basis

A human or service recovery credential is not automatically a Trust Anchor merely because it is used during recovery.

## 323. Governance Authority

Must define:

* Who may invoke recovery
* Which trust functions may be recovered
* Required approvals
* Emergency scope
* Expiration
* Re-validation
* Retirement

## 324. Technical Operator

May execute recovery procedures but need not hold governance authority.

## 325. Custodian

Recovery material may require:

* Split custody
* Offline custody
* Multi-party control
* Hardware protection

## 326. Accepting Trust Domain

The affected trust domain or governance domain.

## 327. Bootstrap Basis

Recovery trust must be established before the failure it is expected to recover from.

## 328. Rotation

Recovery material must have explicit lifecycle and exercise procedures.

## 329. Revocation / Removal

Emergency or compromised recovery authority must be removable.

## 330. Compromise Response

Recovery-root compromise is a high-impact trust event requiring independent governance.

## 331. Recovery Authority

This anchor supports `ROLE-016`.

The authority and anchor remain distinct.

## 332. Audit

Must preserve:

* Custody
* Exercises
* Access
* Invocation
* Approval
* Recovery event
* Retirement

## 333. Edge Mapping

Primary:

* `EDGE-012`
* `EDGE-014`

## 334. Traceability

Primary:

* ADR-0004
* ADR-0007
* SI-15
* SI-16
* SI-37
* SI-38

---

# Governance Matrix

## 335. Authority Matrix

| Matrix ID | Security Function | Authority Source | Governance Authority | Technical Operator | Custodian | Accepting Domain | Recovery Authority |
|---|---|---|---|---|---|---|---|
| AUTH-001 | Identity issuance | Identity governance / approved registration | Identity governance | Identity service operator | Issuer-key custodian | Identity trust domain | Independent identity recovery authority |
| AUTH-002 | Principal-runtime binding | Approved assignment / binding governance | Binding governance | Runtime / assignment operator | Binding-key or state custodian | Identity / authorization / audit domain | Binding recovery authority |
| AUTH-003 | Attestation Evidence production | Approved Attester eligibility / enrollment governance | Attestation governance | Attester operator | Attestation-key custodian | Attestation trust domain | Attestation recovery authority |
| AUTH-004 | Attestation appraisal | Approved appraisal governance | Attestation governance | Verifier operator | Verifier-key custodian | Attestation trust domain | Verifier recovery authority |
| AUTH-005 | Delegable authority source | Resource / application / governance authority | Resource or authority governance | Entitlement operator | Authority-key custodian if applicable | Authorization domain | Authority-source recovery authority |
| AUTH-006 | Delegation grant | AUTH-005 | Delegation governance | Delegation operator | Delegator credential custodian | Authorization domain | Delegation recovery authority |
| AUTH-007 | Delegation issuance | Approved grant | Delegation-issuer governance | Issuer operator | Signing-key custodian | Delegation / authorization domain | Issuer recovery authority |
| AUTH-008 | Policy governance | Resource / security governance | Policy Authority | Policy operator | Policy-key custodian | Function-scoped | Policy recovery authority |
| AUTH-009 | Authorization decision | Local resource / authorization governance | Authorization governance | Decision-service operator | Decision-key custodian | Authorization domain | Authorization recovery authority |
| AUTH-010 | Enforcement | Resource governance | Enforcement governance | Enforcement operator | Enforcement credential custodian | Resource / enforcement domain | Enforcement recovery authority |
| AUTH-011 | Revocation | Function-specific governing authority | Function-specific revocation governance | Revocation operator | Revocation-key custodian | Function-scoped | Revocation recovery authority |

---

## 336. Trust-Anchor Matrix

| Anchor ID | Purpose | Governing Authority | Technical Operator | Custodian | Accepting Domain | Principal Edge Dependencies |
|---|---|---|---|---|---|---|
| ANCHOR-001 | Identity validation | Identity trust governance | Trust-bundle distributor | Root-key custodian | Identity | EDGE-001, EDGE-012, EDGE-015 |
| ANCHOR-002 | Attestation validation | Attestation governance | Attestation trust distributor | Root / endorsement custodian | Attestation | EDGE-003, EDGE-004, EDGE-012, EDGE-015 |
| ANCHOR-003 | Delegation artifact verification | Delegation governance | Issuer-trust distributor | Issuer-key custodian | Authorization / delegation | EDGE-005, EDGE-006, EDGE-012, EDGE-015 |
| ANCHOR-004 | Policy integrity | Policy governance | Policy distributor | Policy-key custodian | Function-scoped | EDGE-007, EDGE-008, EDGE-009, EDGE-012 |
| ANCHOR-005 | Authorization decision validation | Authorization governance | Decision-service operator | Decision-key custodian | Authorization / enforcement | EDGE-009, EDGE-010, EDGE-012 |
| ANCHOR-006 | Audit evidence integrity | Audit governance | Audit operator | Evidence-integrity custodian | Audit / evidence | EDGE-010, EDGE-013, EDGE-014 |
| ANCHOR-007 | Recovery | Recovery governance | Recovery operator | Recovery-material custodian | Affected trust domain | EDGE-012, EDGE-014 |

---

# Independence and Correlated Compromise

## 337. Independence Is a Requirement, Not a Deployment Assumption

The architecture does not assume independence merely because roles are logically distinct.

For each material authority relationship, later component mapping must assess:

* Same administrative principal
* Same credentials
* Same key-management root
* Same cloud account
* Same host
* Same cluster
* Same CI/CD path
* Same recovery path
* Same audit system
* Same human approver
* Same vendor control plane

Logical separation without independent compromise paths does not establish security independence.

---

## 338. Minimum Independence Questions

For every `AUTH-xxx` and `ANCHOR-xxx`, future design must ask:

1. Can the operator change the governing policy?
2. Can the custodian mint unauthorized authority?
3. Can the governance authority directly access protected key material?
4. Can one administrator alter both enforcement and its audit evidence?
5. Can the compromised authority authorize its own replacement?
6. Can one trust anchor validate multiple functions whose compromise should remain independent?
7. Can one recovery credential replace multiple roots?
8. Can a control-plane administrator bypass local authorization?
9. Can a vendor administrator redefine trust without local approval?
10. Can a dependency compromise multiple supposedly independent domains?

---

## 339. Administrative Independence Classes

Later component mapping should classify independence as:

```text
IND-0
No meaningful independence

IND-1
Logical role separation only

IND-2
Separate application/service administration

IND-3
Separate credentials and approval path

IND-4
Separate trust root or recovery basis

IND-5
Independent administrative and recovery domain
```

This classification is a planning and evaluation aid.

It is not itself a security guarantee.

---

# Multi-Party Governance

## 340. Multi-Party Governance Trigger Classes

Multi-party approval should be evaluated for changes that can redefine large portions of platform trust, including:

* Root trust-anchor creation
* Root trust-anchor replacement
* Recovery-root use
* Broad federation trust
* Namespace transfer
* Global or high-impact policy change
* Emergency degraded-mode policy
* High-impact redelegation
* Audit-retention override
* Enforcement bypass
* Recovery of compromised root authority

Task 4 does not mandate the same approval threshold for every operation.

---

## 341. Multi-Party Governance Must Be Independent of Key Count

Using multi-signature or threshold cryptography does not automatically establish independent governance.

The architecture must still ask:

* Who controls each share?
* Are the custodians independent?
* Are approvals independent?
* Can one administrative plane compel all signers?
* Can one recovery path replace the threshold root?

Cryptographic thresholding and governance separation are related but distinct.

---

# Lifecycle Requirements

## 342. Lifecycle State

Every authority and trust anchor must have explicit lifecycle states.

At minimum, later implementation must be able to represent as applicable:

```text
PROPOSED
APPROVED
ACTIVE
ROTATING
DEGRADED
SUSPENDED
REVOKED
COMPROMISED
RECOVERING
RETIRED
```

Not every technology needs these exact labels.

The semantic states must remain representable.

---

## 343. Rotation

Rotation must define:

* Trigger
* Approver
* Operator
* Custodian
* Old/new overlap
* Consumer migration
* Validation of new material
* Failure rollback
* Retirement of old material
* Audit evidence

Rotation is not merely key replacement.

It is a governed trust-state transition.

---

## 344. Revocation

Revocation must define:

* Revoking Authority
* Target
* Scope
* Effective time
* Distribution
* Consumer reaction
* Cache behavior
* Recovery implication
* Audit evidence

A revoked trust relationship must not remain implicitly active because a dependent service has stale state.

---

## 345. Compromise

Compromise handling must identify:

* Compromised authority or anchor
* Suspected blast radius
* Downstream dependencies
* Credentials or artifacts affected
* Required revocation
* Required revalidation
* Required recovery
* Required evidence preservation

The architecture preserves:

```text
Compromise
        ≠
Unavailability
```

---

## 346. Recovery

Recovery must identify:

* Recovery Authority
* Recovery trust basis
* Required approvals
* Replacement state
* Re-bootstrap requirement
* Revalidation scope
* Emergency authority
* Retirement of emergency authority
* Audit evidence

Recovery does not silently restore prior trust assumptions.

---

# Interface Mapping

## 347. EDGE-to-Authority Mapping

| EDGE | Primary Authority / Anchor Dependencies |
|---|---|
| EDGE-001 | AUTH-001, ANCHOR-001 |
| EDGE-002 | AUTH-002, AUTH-001 where identity participates |
| EDGE-003 | AUTH-003, ANCHOR-002 |
| EDGE-004 | AUTH-004, ANCHOR-002 |
| EDGE-005 | AUTH-005, AUTH-006, AUTH-007, ANCHOR-003 |
| EDGE-006 | AUTH-005, AUTH-006, AUTH-007, ANCHOR-003 |
| EDGE-007 | AUTH-008, ANCHOR-004 |
| EDGE-008 | AUTH-001 / 002 / 004 / 005 / 006 / 008 / 011 as applicable |
| EDGE-009 | AUTH-009, AUTH-008, ANCHOR-005 |
| EDGE-010 | AUTH-010, ANCHOR-005, ANCHOR-006 where evidence integrity applies |
| EDGE-011 | AUTH-011 and function-specific anchors |
| EDGE-012 | Function-specific Governance Authority, ANCHOR-001–ANCHOR-007 as applicable |
| EDGE-013 | ANCHOR-006 and producer-specific authorities |
| EDGE-014 | ROLE-016 Recovery Authority, ANCHOR-007, and the applicable affected-domain authority |
| EDGE-015 | Source-domain authority + local accepting authority + applicable native contract anchor |

### Recovery Authority Note

Task 4 intentionally keeps `ROLE-016` as the architectural Recovery Authority role and `ANCHOR-007` as the Recovery Trust Anchor requirement.

No `AUTH-016` identifier exists.

Future traceability may define a dedicated recovery-authority `AUTH-xxx` requirement only if a later task needs a materially distinct authority requirement; role numbers and authority-requirement numbers must not be coupled merely for symmetry.

---

# Governance Change Control

## 348. Trust-State Change Categories

Security-relevant changes include:

* Trust-anchor addition
* Trust-anchor removal
* Issuer addition
* Issuer removal
* Federation enablement
* Federation disablement
* Identity namespace change
* Delegation root change
* Policy Authority change
* Authorization-domain change
* Enforcement bypass change
* Revocation authority change
* Recovery-root change
* Audit-integrity root change

Each must have:

* Authorized initiator
* Approval path
* Effective time
* Validation
* Rollback or recovery
* Audit evidence

---

## 349. Control Plane Coordination Rule

The future Trust Control Plane may coordinate governance state.

It does not thereby become the source of every authority.

The architecture preserves:

```text
Trust Coordination
        ≠
Authority Ownership
```

and:

```text
Control Plane
        ≠
Universal Trust Anchor
```

and:

```text
Control Plane Administrator
        ≠
Automatic Local Resource Authority
```

---

# Technology Evaluation Implications

## 350. Mandatory Evaluation Questions

A candidate technology must disclose or permit determination of:

* Which `AUTH-xxx` functions it implements
* Which `ANCHOR-xxx` functions it implements
* Which authority it assumes
* Which authority it cannot represent
* Which trust anchors it introduces
* Who controls those anchors
* Who technically operates them
* Who holds key custody
* Which administrator can change trust state
* Whether recovery is independently rooted
* Whether revocation is function-specific
* Whether audit can be independently protected
* Whether co-location creates correlated compromise
* Whether external vendor control changes local trust semantics

---

## 351. Non-Compensable Architecture Constraints

Later weighted technology evaluation must treat accepted security invariants as mandatory gates.

A technology must not receive an acceptable score merely because strengths in one category compensate for violating a security invariant.

The evaluation order is:

```text
Mandatory Architecture / Invariant Gate
        ↓
If PASS
        ↓
Weighted Comparative Evaluation
```

Candidates that cannot satisfy mandatory authority, anchor, enforcement, or recovery requirements must be rejected or require an explicitly reviewed architecture change.

---

# Task 4 Acceptance Gate

## 352. Acceptance Criteria

Task 4 passes when:

* Authority Source is distinguished from Governance Authority.
* Governance Authority is distinguished from Technical Operator.
* Technical Operator is distinguished from Custodian.
* Trust Anchor is distinguished from Trust Authority.
* Recovery Authority is explicit.
* Accepting trust domain is explicit.
* Bootstrap basis is explicit.
* Verification requirement is explicit.
* Rotation is explicit.
* Revocation is explicit.
* Compromise response is explicit.
* Recovery trust basis is explicit.
* Downstream dependencies are explicit.
* Administrative-independence questions are explicit.
* Multi-party-governance triggers are explicit.
* Audit requirements are explicit.
* `EDGE-xxx` dependencies are traceable.
* Technology evaluation cannot hide mandatory invariant failures behind weighted scoring.
* No vendor, product, cloud, or protocol is selected.

---

## 353. Failure Modes

Task 4 fails if:

* One generic `owner` field hides governance, operation, custody, and recovery.
* Signing-key possession is treated as legitimate authority.
* Trust Anchor and Trust Authority are treated as identical.
* Technical Operator is assumed to own policy authority.
* Custodian is assumed to own application authority.
* Recovery depends solely on the compromised root.
* Revocation authority is undefined.
* Control Plane becomes universal authority.
* Co-location is treated as independent security separation.
* Multi-party cryptography is treated as equivalent to independent governance.
* Weighted technology scoring can compensate for violating a security invariant.
* External vendor administration is omitted from trust analysis.

---

## 354. Definition of Done

The Task 4 content acceptance gate is satisfied:

* [x] `AUTH-001` through `AUTH-011` are defined.
* [x] `ANCHOR-001` through `ANCHOR-007` are defined.
* [x] Authority Source is defined.
* [x] Governance Authority is defined.
* [x] Technical Operator is defined.
* [x] Custodian is defined.
* [x] Accepting trust domain is defined.
* [x] Bootstrap basis is defined.
* [x] Verification basis is defined.
* [x] Rotation requirements are defined.
* [x] Revocation requirements are defined.
* [x] Compromise response is defined.
* [x] Recovery Authority is defined.
* [x] Recovery trust basis is defined.
* [x] Downstream dependencies are defined.
* [x] Administrative-independence analysis is defined.
* [x] Multi-party-governance triggers are defined.
* [x] Audit requirements are defined.
* [x] EDGE-to-authority mapping is defined.
* [x] Attestation Evidence production authority is distinguished from appraisal authority and trust-anchor semantics.
* [x] Technology-evaluation implications are defined.
* [x] Mandatory architecture constraints are non-compensable gates.
* [x] Mechanical document validation passes.
* [x] Semantic architecture review passes.

### Repository Closure Gate

Task 4 is not formally **COMPLETE** until repository evidence independently confirms:

* The accepted artifact is committed.
* The commit is pushed to `origin/main`.
* `HEAD == origin/main`.
* The working tree is clean.

The artifact does not predict or embed its own future commit hash.

---

# Accepted Decision

## 355. Task 4 Decision

The accepted Task 4 decision is:

> **Sprint 2 shall model security-relevant authority, governance, operation, custody, trust anchors, accepting trust domains, revocation, compromise response, and recovery as independently visible architectural responsibilities. Co-location may be permitted, but co-location shall not erase authority provenance, administrative-dependency analysis, trust-anchor governance, or recovery independence.**

This is a derived architecture-to-implementation requirement.

It does not select a technology or deployment topology.

---

## 356. ADR Assessment

No new ADR is proposed by Task 4 at this stage.

The matrix derives from accepted:

* ADR-0003
* ADR-0004
* ADR-0005
* ADR-0006
* ADR-0007
* ADR-0008

If semantic review identifies a materially new trust-governance decision rather than a derived requirement, the Control Plane must stop and record that decision through ADR governance before acceptance.

---

## References

* `docs/sprints/sprint-02-plan.md`
* `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
* `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
* `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
* `docs/architecture/platform-charter.md`
* `docs/architecture/principal-model.md`
* `docs/architecture/trust-boundaries.md`
* `docs/architecture/bootstrap-trust.md`
* `docs/architecture/delegated-authority.md`
* `docs/architecture/threat-model.md`
* `docs/architecture/security-invariants.md`
* `docs/architecture/failure-model.md`
* `docs/architecture/system-context-architecture.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`
* `docs/adr/0005-explicit-bounded-delegated-authority.md`
* `docs/adr/0006-security-invariants-as-architecture-constraints.md`
* `docs/adr/0007-explicit-bounded-security-failure-semantics.md`
* `docs/adr/0008-separate-trust-coordination-from-runtime-enforcement-and-authority-ownership.md`
