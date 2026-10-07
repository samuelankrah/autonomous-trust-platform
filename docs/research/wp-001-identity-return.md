# WP-001 Identity Return: Requirements, Evidence, and Tradeoffs

**Package ID:** `WP-001`
**Owning Specialist Project:** Trust Platform: Identity
**Return Date:** 2026-10-06
**Evidence State (whole return):** Research Finding
**Charter:** `docs/sprints/sprint-02-task-08-specialist-work-packages.md`, sections 18-24

This return answers the five routed identity questions (sections 20.1-20.5 of the
charter), mapped to open questions `OQ-ID-01` through `OQ-ID-05` from
`docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md` (section 10).

No technology, product, protocol, or standard is selected or endorsed in this return.
Standards named below (SPIFFE/SVID, X.509, WIMSE, OIDC/OAuth2, RFC 8693 token
exchange) appear only as evaluation subjects for Control Plane's Task 9 gate, per
`WR-003` and `WR-005`. No deferred decision is closed.

## Evidence-state labels used in this return

* **Research Finding:** the whole return.
* **Architecture Requirement (derived):** a requirement traceable to an accepted
  baseline input only (specialists may establish this per Task 8 section 5).
* **Evaluation subject:** a named standard or capability class under comparison,
  not a selection.
* **Open residual:** an unanswered question with missing evidence identified.

## Escalations

No escalation under `WR-006` was raised during this work. No conflict between
accepted architecture artifacts was encountered that requires ADR review; no
candidate was found that can only satisfy an accepted invariant by weakening it.

## Package-level requirements carried from section 20 (charter scope)

* `WP1-G01`: The return preserves `Logical Principal != Runtime / Workload !=
  Credential` in every requirement, test, and tradeoff. [Trace: ADR-0002]
* `WP1-G02`: `ROLE-001` / `ROLE-002` capability contracts are preserved, not
  redefined. [Trace: ROLE-001, ROLE-002]
* `WP1-G03`: Nothing in this return defines authorization policy (owned by
  Control Plane via Task 5) or failure semantics beyond identity-specific inputs
  to Task 6. [Trace: section 23, non-authority]

---

# Question 1 (OQ-ID-01): Logical-Principal Versus Workload Identity Requirements

*Charter section 20.1: specify what a conforming identity approach must provide so
that `Logical Principal != Runtime / Workload != Credential` remains true in
practice, per ADR-0002.*

## 1.1 Requirements

**WP1-Q1-R01: Logical-principal identity representation.**
A conforming approach must represent a logical principal (ROLE-001) with an
independently distinguishable identity inside a defined identity namespace that
persists across runtime-instance replacement, credential issuance and rotation,
and hosting-environment changes. The representation must carry the metadata
needed for policy application, lifecycle management, revocation, and accountable
audit attribution (actor, instance, delegator, delegation where applicable).
[Trace: ROLE-001, ADR-0002, IN-002 (`principal-model.md`, sections 3.5-3.6),
SI-01, SI-05]

**WP1-Q1-R02: Workload identity representation.**
A conforming approach must represent a runtime/workload principal (ROLE-002)
whose logical identity is stable across process restarts, container replacement,
and credential rotation. Process, container, pod, and ephemeral instance
identifiers must be representable as instance-level attribution only, and must
not automatically create independent workload principals or principal identity
changes. [Trace: ROLE-002, ADR-0002 (Workload Identity section), IN-002
(`principal-model.md`, section 8), SI-01, SI-03]

**WP1-Q1-R03: Identity-boundary rule.**
A conforming approach must apply a security-relevant boundary test (equivalent to
the principal model's Identity Boundary Test, section 17, and ADR-0002's Identity
Boundary Principle) before creating an independent principal identity: an
independent identity is justified only when the entity independently exercises
security-relevant actions, can hold authority different from its host, has a
materially different lifecycle, requires independent audit attribution,
independently applicable policy, or independent compromise containment or
revocation. Labels (agent, bot, service, process) and runtime uniqueness alone
are insufficient. [Trace: ADR-0002, IN-002 (`principal-model.md`, section 17),
SI-05]

**WP1-Q1-R04: Lifecycle independence.**
A conforming approach must keep identity, credential, principal-instance, and
authority lifecycles independently governable: credential expiration or rotation
must not retire the logical principal; revocation of delegated authority must not
require revocation of identity; identity revocation must not be silently
reinterpreted as authority revocation. Expiration must not be treated as
equivalent to revocation. Credential renewal must not silently renew delegated
authority. [Trace: SI-01, SI-03, ROLE-001 (section 10), IN-002
(`principal-model.md`, section 16), IN-005 (`delegated-authority.md`, section 36)]

**WP1-Q1-R05: Security-material distinction conditions.**
The distinction between logical-principal and workload identity is
security-material (and independent identity is required) when the hosted actors
differ from the hosting workload in any of: authority, delegating principal,
authorization policy, lifecycle, revocation boundary, audit attribution, logical
ownership, or concurrent actor population (ADR-0002 decision). It is
administrative convenience only, and the boundary may collapse, when lifecycle,
authority, policy, audit identity, and revocation requirements are identical
between the actor and its host (for example, one agent per workload with fully
shared security properties, `principal-model.md` section 9.1). [Trace: ADR-0002,
IN-002 (`principal-model.md`, sections 9.1-9.3), SI-02, SI-05]

**WP1-Q1-R06: Anti-collapse in multi-actor runtimes.**
Where one runtime hosts multiple logical actors with different security
properties, a conforming approach must keep each actor's identity, authority
provenance, and audit attribution distinguishable, and must not permit the
runtime's authentication state alone to identify which actor caused an action.
[Trace: SI-02, SI-05, ADR-0002 (scenario A/B, Alternative A rejected),
IN-002 (`principal-model.md`, scenario A)]

**WP1-Q1-R07: Credential representation independence.**
Principal identity semantics must exist independently of credential encoding.
Changing a credential format (X.509, JWT, future formats as evaluation subjects)
must not change the underlying logical principal or workload identity, and a
principal must not be defined as "whatever credential happens to represent it".
[Trace: IN-002 (`principal-model.md`, section 11), SI-01, ROLE-003]

## 1.2 Evidence

A candidate approach demonstrates satisfaction of the Q1 requirements when the
following can be shown (evidence sources to be designed in Task 7; what follows
is what the evidence must establish, not the evidence itself):

* **Representation evidence:** the approach documents its logical-principal
  identity model and workload identity model separately, including namespace
  scoping, identity metadata schema, and the identity-boundary rule used to
  decide when a new independent identity is created (addresses R01, R02, R03).
* **Lifecycle-independence evidence:** test scenarios show credential rotation
  and credential expiration leave the logical principal identity unchanged and
  vice versa (addresses R04; cf. principal-model scenario C).
* **Distinction evidence:** a multi-actor-per-workload scenario shows audit and
  authorization records distinguishing the actors through the same authenticated
  runtime, and a single-actor-per-workload scenario shows documented justification
  for collapsing or separating the identities (addresses R05, R06).
* **Spoofing-resistance evidence:** a workload holding valid runtime credentials
  cannot assert a logical-principal identity it was not granted (addresses R06;
  ADR-0002 risk "Actor-to-Runtime Spoofing" requires the binding mechanism in
  Question 2 to close this).
* **Format-independence evidence:** the same logical identity survives a
  credential-format migration (addresses R07).
* **Evaluation-subject mapping (not selection):** SPIFFE IDs and SVIDs are a
  mature evaluation subject for the workload-identity half of the model (the
  principal model itself notes this interaction in section 12); WIMSE drafts
  (workload identifier, workload credentials, still Internet-Drafts as of
  mid-2026) are an evaluation subject for credential-agnostic workload identity;
  OIDC/OAuth2 and RFC 8693 token exchange are evaluation subjects for
  representing identity assertions between systems. None is adopted here.

## 1.3 Tradeoffs

* **Centralized vs federated issuance.** One identity authority for all
  principals simplifies lifecycle management and revocation state but creates
  correlated compromise risk across identity functions (ADR-0003
  trust-authority concentration); federated issuance (per-domain authorities)
  contains compromise but requires federation bootstrap, bundle distribution, and
  cross-domain validation rules (EDGE-001 federation sections; ADR-0003
  cross-domain trust principle).
* **Short-lived vs long-lived credentials.** Short-lived credentials reduce the
  need for revocation infrastructure and bound the blast radius of stolen
  credentials, at the cost of issuance availability dependence and clock
  requirements; long-lived credentials reduce issuance load but demand
  revocation freshness handling (ROLE-003 section 36; ROLE-004 section 50).
  Neither choice affects binding correctness: per SI-12, credential strength or
  lifetime cannot repair an incorrect initial binding.
* **Hardware-backed vs software-backed binding of identity material.** Hardware
  roots improve key custody and bootstrap assurance at higher deployment cost and
  operational complexity; software-backed keys are easier to deploy and rotate
  but depend more heavily on bootstrap correctness and are harder to recover
  after compromise (ADR-0004, bootstrap-trust sections 24 and 60).
* **Fine-grained identity proliferation vs coarse identities.** More independent
  identities improve attribution precision and revocation granularity but
  increase lifecycle-management and policy-complexity costs; the ADR-0002
  boundary rule is the accepted mechanism for deciding, not a fixed granularity.
* **Standard maturity vs architectural fit.** Published specs (SPIFFE, X.509
  PKI, OIDC/OAuth2) are stable but encode their own trust-domain assumptions
  (e.g., SPIFFE trust domains are workload-scoped; ADR-0003 rejected adopting
  them as the universal platform model). Draft-stage work (WIMSE) offers closer
  workload-identity semantics but lacks RFC stability. Evaluation against the Q1
  requirements, not adoption, is the correct next step (Task 9).

## 1.4 Open residuals

* What canonical namespace should represent logical AI-agent identity, and should
  agent identifiers be globally stable or scoped to a trust domain? (carried from
  principal-model section 20, questions 1-2). Missing evidence: a namespace
  governance analysis; cannot be resolved before DD-014 is addressed.
* Who is authorized to create an agent/logical principal, and how is that
  creation itself authorized and audited? (principal-model section 20,
  question 3). Missing evidence: the governance model from Task 4 applied to
  identity creation.
* When should service identity be modeled independently from workload identity,
  and which infrastructure components require independent principal identities?
  (principal-model section 20, questions 7-8). Missing evidence: application of
  the identity-boundary test to concrete service and infrastructure inventories.
* How does logical-principal retirement interact with credential revocation
  (question 10 of principal-model section 20)? This intersects Question 5 below
  and remains open pending bootstrap/recovery architecture.

## 1.5 Explicit non-decisions

* `DD-002` (workload identity implementation) and `DD-003` (AI-agent identity
  protocol) remain open; they resolve only after Task 9.
* No identity namespace, naming scheme, or URI convention is selected here.
* No product or protocol is selected or endorsed; SPIFFE/SVID, X.509, WIMSE,
  OIDC/OAuth2, and RFC 8693 appear strictly as evaluation subjects for Task 9.
* `ROLE-001` and `ROLE-002` are not redefined.

---

# Question 2 (OQ-ID-02): Principal-to-Runtime Binding

*Charter section 20.2: specify how principal-to-runtime binding is proven, per
EDGE-002.*

## 2.1 Requirements

**WP1-Q2-R01: Binding assertion content.**
A conforming binding mechanism must produce assertions that identify the logical
principal, the runtime/workload, the binding authority, the binding type, start
time, end time or revocation semantics, intended purpose, and trust-domain or
administrative scope. The assertion must be bound to enough context to prevent
reuse for a different principal, runtime, time window, trust domain, session, or
execution context. [Trace: EDGE-002 (sections 28, 35), ADR-0004]

**WP1-Q2-R02: Explicit binding authority.**
The binding assertion must identify the authority accepted to establish or
confirm the binding, and that authority may differ from the identity authority,
the runtime identity issuer, the delegator, and the authorization decision
function. No producer is authoritative merely by being able to report a binding.
[Trace: EDGE-002 (sections 24, 31), ADR-0004]

**WP1-Q2-R03: No silent establishment.**
Runtime credentials, attestation results, and co-location must not silently
establish principal-to-runtime binding. An authenticated workload presenting a
valid runtime credential does not thereby prove which logical principal it hosts;
a valid attestation result proves platform properties, not the actor binding.
[Trace: EDGE-002 (section 37), SI-02, SI-17, IN-004 (`bootstrap-trust.md`,
sections 29-31)]

**WP1-Q2-R04: Verification basis.**
Binding verification must draw on an explicit combination of the applicable
bases: registration validation, identity validation (EDGE-001), runtime
authentication, attestation-derived evidence, bootstrap evidence, signed
assignment, or local policy. The chosen basis must be documented for each
binding type. [Trace: EDGE-002 (section 30), ADR-0004]

**WP1-Q2-R05: Freshness and re-binding triggers.**
A conforming mechanism must define how quickly changes become visible to
consumers for: runtime assignment changes, principal lifecycle transitions,
runtime lifecycle transitions, concurrent execution (a principal active on two
runtimes simultaneously), migration, and revocation. Migration of a logical
principal to a new runtime requires re-binding or an explicitly defined
binding-carry rule; the binding must not silently persist across a migration it
was not scoped for. [Trace: EDGE-002 (sections 29, 32), ADR-0004 (re-binding),
IN-004 (`bootstrap-trust.md`, section 41)]

**WP1-Q2-R06: Revocation semantics.**
The binding must be invalidatable when: the principal is no longer permitted on
the runtime, the runtime is terminated, the assignment changes, binding evidence
is compromised, or administrative governance revokes the relationship.
Revocation of the binding must be independent of identity revocation and
authority revocation. [Trace: EDGE-002 (section 32), SI-03, IN-005
(`delegated-authority.md`, section 36)]

**WP1-Q2-R07: Relying-function behavior on defective binding.**
When binding evidence is absent, stale, or inconsistent, a relying function must
not silently derive logical-principal identity from runtime identity. The result
is unknown identity state, and the relying function's response must follow
explicit failure policy (identity-specific input to Task 6): fail to an
unauthorized/unknown state, never to ambient trust. [Trace: EDGE-002 (section
33), SI-31, ROLE-001 (section 11), ROLE-002 (section 24)]

**WP1-Q2-R08: Audit preservation.**
Binding creation, change, migration, reassignment, and revocation must produce
audit evidence identifying the logical principal, runtime, binding authority,
binding basis, time, and consumers relying on the binding where material.
[Trace: EDGE-002 (section 36), SI-35 as carried in EDGE-002 traceability]

## 2.2 Evidence

A candidate binding approach demonstrates satisfaction when:

* **Correctness evidence:** a workload cannot claim to host a logical principal
  it was not bound to, even when the workload itself is validly authenticated
  (addresses R03; counters ADR-0002's actor-to-runtime spoofing risk).
* **Freshness evidence:** binding revocation propagates to relying functions
  within the defined window; a principal migrated to a new runtime is not
  accepted on the old runtime after migration completes (addresses R05).
* **Separation evidence:** revoking the binding invalidates the actor-to-runtime
  claim without revoking either identity (addresses R06).
* **Failure-mode evidence:** with binding evidence withheld, tampered, or
  expired, relying functions produce unknown/invalid identity state and do not
  authorize the action (addresses R07).
* **Evaluation subjects (not selection):** attestation-backed binding (RATS/EAT
  evidence as the bootstrap/verification basis, appraisal by an accepted
  verifier) and registry-backed signed assignment (orchestrator or identity
  management function as binding authority) are both admissible verification
  bases under EDGE-002 section 30; neither is selected.

## 2.3 Tradeoffs

* **Hardware-backed vs software-backed binding.** Attestation-derived binding
  (platform evidence from a trusted execution environment or measured boot)
  raises assurance that the runtime is the claimed one, at the cost of hardware
  dependence, attestation-verifier trust infrastructure, and appraisal freshness
  requirements; software-backed binding (signed assignment from a governed
  orchestrator or registration function) is cheaper and portable but moves
  trust into the binding authority's compromise surface and key custody.
* **Short-lived binding assertions vs durable registration.** Short-lived
  assertions limit replay and stale-binding windows but require a continuously
  available binding authority; durable registration with explicit revocation
  tolerates authority outages but demands revocation-freshness handling at
  every relying function (EDGE-002 sections 29, 32).
* **Binding authority placement.** A dedicated binding authority separates
  concerns (identity issuance vs binding vs authorization) but adds an
  integration and availability dependency; co-locating binding with the identity
  authority or orchestrator simplifies deployment but concentrates trust
  (ADR-0003 trust-authority concentration risk).
* **Migration model.** Strict re-binding on migration gives the cleanest
  semantics (old binding dies, new binding requires fresh evidence) but adds
  latency to failover and scaling; carry-over rules are faster but must be
  explicitly scoped or they silently widen the binding's meaning.

## 2.4 Open residuals

* Who is authorized to create a logical-principal-to-runtime binding, and through
  what governed process (bootstrap-trust section 31's question list)? Missing
  evidence: the Task 4 governance matrix applied to binding creation; this is a
  governance input, not a Task 8 decision.
* Can a principal be concurrently bound to multiple runtimes, and what
  disambiguation do relying functions apply? (principal-model section 20,
  question 5; EDGE-002 section 34 concurrent-runtime ambiguity). Missing
  evidence: an execution-model analysis of concurrent agent instances.
* What is the maximum tolerable binding-freshness window per operation risk
  class? EDGE-002 defers this to the risk model; missing evidence is the Task 5/6
  risk classification of protected operations.

## 2.5 Explicit non-decisions

* No binding protocol, assertion format, or product is selected.
* `DD-003` (AI-agent identity protocol) remains open; agent-to-runtime binding
  for AI agents is constrained by the requirements above but the protocol
  selection waits for Task 9.
* Failure semantics beyond these identity-specific inputs remain with Control
  Plane via Task 6.

---

# Question 3 (OQ-ID-03 + OQ-ID-04): Identity Participation in Authorization

*Charter section 20.3: specify which identities participate directly in
authorization decisions and which exist only for attribution, per OQ-ID-03 and
OQ-ID-04. This return identifies identity participation; authorization policy
itself remains with Control Plane via Task 5.*

## 3.1 Requirements

**WP1-Q3-R01: Participation criteria.**
An identity participates directly in an authorization decision when it is a
required input to that decision: the subject principal, a delegating principal
whose granted authority is exercised, or runtime/environment context the local
security model requires for the protected action (AZ-001, AZ-002, AZ-005). An
identity exists for attribution only when its purpose is audit reconstruction,
telemetry, runtime correlation, or incident investigation without being an
authorization input (for example, actor-instance or workload-instance identifiers
used solely for correlation, principal-model section 3.7). [Trace: EDGE-002
(consumers ROLE-012, ROLE-015), AZ-001, AZ-002, AZ-005, IN-002
(`principal-model.md`, sections 3.7, 15), SI-27]

**WP1-Q3-R02: Authorization-context representation.**
In the authorization context (AZ-001), the classes appear as: logical principal
as the subject or actor; runtime/workload identity as execution context;
principal-to-runtime binding as the binding claim connecting them; delegator and
delegated authority as authority provenance (AZ-003); environment identifiers as
supplementary context. No class may be flattened into an unqualified subject
string where the flattened layer affects security. [Trace: AZ-001, AZ-003,
IN-002 (`principal-model.md`, section 14), SI-36 as carried via AZ-003]

**WP1-Q3-R03: Attribution-only boundaries.**
Instance identifiers (principal instance, workload instance) and environment
identifiers (node, host, execution environment) must default to attribution-only
status. They become authorization-participating only when an explicit security
requirement justifies it (for example, instance-specific revocation of a
compromised execution), and that promotion must be explicit in the authorization
model, never implicit. [Trace: IN-002 (`principal-model.md`, section 3.7),
ADR-0002 (logical principal and instance separation), SI-05]

**WP1-Q3-R04: Prohibited inferences.**
A conforming architecture must prohibit, in design and in evaluation: treating
an attribution-only identity as authority; treating runtime authentication as
establishing any hosted logical actor's authority; treating credential
possession or successful authentication as authorization; treating host workload
authority as agent authority without explicit architecture decision; treating a
valid agent-to-runtime binding as granting the agent the workload's permissions.
[Trace: SI-27, SI-02, AZ-002, IN-005 (`delegated-authority.md`, sections 44-45)]

**WP1-Q3-R05: Identity validity vs authority validity in authorization input.**
Authorization decisions must consume identity validity and authority validity as
separate inputs. A valid identity with expired or absent delegated authority
must be representable and must not authorize (principal-model scenario F). A
revoked authority grant must not require revocation of the identity it was
granted to. [Trace: SI-03, IN-005 (`delegated-authority.md`, sections 4-5),
ROLE-001 (section 10)]

**WP1-Q3-R06: Delegation visibility.**
Where authority is exercised on behalf of another principal, the authorization
context must preserve the actual actor, the represented principal, and the
authority source distinctly, preferring explicit delegation representation over
identity collapse into the delegator (delegated-authority sections 38-39). This
is an identity-representation requirement on the authorization context, not a
policy statement. [Trace: IN-005 (`delegated-authority.md`, sections 38-39),
EDGE-002 (section 27, delegated-authority scoping), SI-05]

## 3.2 Evidence

A candidate design demonstrates satisfaction when:

* **Context-completeness evidence:** for a protected action, the design shows
  which identity classes the authorization decision consumes and which are
  attribution-only, with the promotion rule for attribution-only identities
  documented (addresses R01-R03).
* **Non-inference evidence:** negative test cases show that (a) a workload
  identity alone cannot authorize an action that requires a logical actor;
  (b) a valid binding alone cannot authorize; (c) an expired delegation with
  valid identity does not authorize (addresses R04, R05).
* **Provenance evidence:** the authorization context preserves delegator,
  delegate, scope, and constraints without flattening to an unqualified role
  value (addresses R06; AZ-003).

## 3.3 Tradeoffs

* **Rich authorization context vs evaluation complexity.** Carrying the full
  multi-layer principal context (actor, instance, runtime, environment,
  delegation) gives policy the most precise inputs but increases decision
  latency, context-size, and policy-authoring complexity; minimal contexts are
  faster but risk the identity collapse the architecture forbids.
* **Strict participation rules vs deployment convenience.** Requiring explicit
  promotion of attribution-only identities to authorization inputs is
  operationally heavier (every instance-level authorization needs a documented
  security justification) but prevents ambient instance identity from quietly
  becoming a privilege boundary.
* **Centralized vs federated authorization input validation.** Validating
  identity inputs at a central authorization function simplifies consistent
  prohibited-inference enforcement; distributed validation scales better but
  risks inconsistent treatment of the same identity class across enforcement
  points (relates to DD-019/DD-020, which stay open).

## 3.4 Open residuals

* Which principal identities belong in authorization decisions versus audit-only
  context for each protected-operation class? (principal-model section 20,
  question 12). Missing evidence: the Task 5 protected-operation inventory with
  per-operation identity requirements; OQ-ID-03's resolution path is
  Identity to Control Plane precisely because this needs Task 5's model.
* How should federated (cross-domain) principal identity map into the local
  authorization context without importing external authorization?
  (principal-model section 20, question 9). Missing evidence: the federation
  protocol evaluation (DD-011, Task 9).

## 3.5 Explicit non-decisions

* Authorization policy, policy language, and enforcement placement are not
  defined here (owned by Control Plane via Task 5; DD-007, DD-008 stay open).
* No authorization engine or decision protocol is selected.
* `DD-019` (centralized vs distributed authorization) and `DD-020` (local vs
  remote policy evaluation) remain open.

---

# Question 4 (OQ-ID-05): Identity Trust-Domain Requirements

*Charter section 20.4: specify identity trust-domain requirements consistent
with ADR-0003.*

## 4.1 Requirements

**WP1-Q4-R01: Identity trust-domain definition.**
An identity trust domain is a scope in which identities are governed under a
coherent namespace, issuance authority, and verification model (trust-boundaries
section 8). A conforming architecture must qualify the term whenever multiple
security functions are involved: identity trust domain is not authorization
domain, not attestation trust domain, not administrative domain, and an identity
trust domain does not automatically define authorization. [Trace: ADR-0003,
IN-003 (`trust-boundaries.md`, section 8), SI-06, SI-27]

**WP1-Q4-R02: Minimum representable model.**
The architecture must be able to represent at minimum: (a) a logical-principal
identity domain distinct from a workload identity domain, because ADR-0002
requires the two to be independently distinguishable where their security
properties differ and ADR-0003 requires function-scoped rather than
deployment-scoped domains; and (b) at least one external identity domain whose
assertions are accepted under explicit federation, because cross-domain
acceptance is a required capability (trust-boundaries sections 20, 36; ADR-0003
federation). No fixed total number is set: `DD-014` remains open for later
topology architecture. [Trace: ADR-0002, ADR-0003, IN-003
(`trust-boundaries.md`, sections 8, 20, 36)]

**WP1-Q4-R03: Domain-boundary definition.**
An identity trust-domain boundary exists where any of the following changes:
the authoritative identity namespace, the identity issuing authority, the trust
anchors accepted for verification, or the governance over issuance and
revocation. Deployment constructs (cluster, cloud account, network segment) may
coincide with the boundary but do not define it. [Trace: ADR-0003
(trust-boundary principle), IN-003 (`trust-boundaries.md`, section 14), SI-06]

**WP1-Q4-R04: Cross-domain identity acceptance rules.**
Acceptance of identity assertions from another identity trust domain must be:
explicit, directional, purpose-scoped, governed, revocable, auditable, and
non-transitive by default (ADR-0003). The receiving domain validates defined
identity assertions from the external authority; this is authentication
federation, and it must not be treated as federated authorization: the
authorization domain retains final control and local policy determines whether
the externally validated identity is relevant to the protected resource.
Revocation of the federation relationship must independently invalidate
acceptance even while the external credentials remain cryptographically valid.
[Trace: ADR-0003 (cross-domain trust principle, authentication federation,
authorization federation, revocation), IN-003 (`trust-boundaries.md`, section
20), AZ-004, SI-28, EDGE-001 (federation sections)]

**WP1-Q4-R05: Boundary-crossing contract content.**
Material identity assertions crossing identity trust-domain boundaries must
carry a defined boundary-crossing contract identifying: producer, subject,
assertion type, verifier, trust authority, trust anchor or acceptance basis,
namespace/scope, purpose, audience, freshness, revocation, failure behavior, and
audit requirements. [Trace: ADR-0003 (boundary-crossing contract), EDGE-001
(sections 11-19)]

**WP1-Q4-R06: Trust-anchor implications per domain.**
Each identity trust domain requires its own governed trust anchors distributed
under EDGE-012 (anchor identity, purpose, version, effective period, governing
authority, binding to trust function and domain). Anchor governance must answer
the ten ADR-0003 questions per material anchor (what function it anchors, who
approves, who operates, who configures acceptance, which namespaces it may
represent, provisioning, rotation, revocation of acceptance, compromise
detection and recovery, downstream dependencies). Concentrating identity
issuance, revocation, and anchor custody under one administrative authority must
be evaluated for correlated failure. [Trace: ADR-0003 (trust governance,
trust-authority concentration), EDGE-012, IN-003 (`trust-boundaries.md`,
sections 25-27)]

## 4.2 Evidence

A candidate trust-domain design demonstrates satisfaction when:

* **Boundary evidence:** the design documents each identity trust domain's
  namespace authority, issuing authority, accepted anchors, and governance, and
  shows the boundary test (R03) applied to at least one pair of environments
  that share deployment topology but not trust assumptions (addresses R01-R03).
* **Federation evidence:** an externally issued identity assertion is accepted
  for authentication under an explicit, scoped, revocable federation
  relationship, while the same assertion grants no local authority beyond what
  local policy explicitly recognizes; revoking the federation relationship
  stops acceptance without touching external credential validity (addresses
  R04; counters ADR-0003's "accidental universal federation" risk).
* **Anchor evidence:** per-domain anchor inventories exist with rotation and
  emergency-replacement procedures exercised or documented (addresses R06).
* **Evaluation subjects (not selection):** SPIFFE trust domains and bundles
  (spiffe.io trust-domain and federation specs) are the evaluation subject for
  workload-scoped identity domains; X.509 path validation (RFC 5280) is the
  evaluation subject for hierarchical anchor models; OIDC/OAuth2 federation
  patterns and RFC 8693 token exchange are evaluation subjects for
  cross-domain assertion acceptance. None is adopted.

## 4.3 Tradeoffs

* **Centralized vs federated issuance (domain count).** Fewer, larger identity
  trust domains reduce federation configuration and anchor-inventory overhead
  but concentrate compromise impact and blur governance boundaries; more,
  smaller domains improve containment and governance precision but multiply
  federation relationships, anchor rotation events, and audit complexity. The
  accepted rule (ADR-0003 risk mitigation) is: separate domains only where
  materially different authorities, anchors, policy, governance, or security
  requirements justify the boundary.
* **Hierarchical vs peer anchor models.** Hierarchical anchor models (X.509
  path validation style) give a single governed root per domain with explicit
  path constraints, at the cost of root-compromise blast radius; peer bundle
  exchange (SPIFFE federation style) keeps domains autonomous with no shared
  root, at the cost of pairwise relationship management.
* **Trust-anchor concentration vs separation.** Co-locating anchor custody with
  issuance under one administrative authority simplifies operations but creates
  correlated failure (one compromise undermines issuance, validation, and
  recovery material); separation improves recovery independence at the cost of
  multi-party governance overhead (ADR-0003 trust governance; EDGE-012
  verification basis includes multi-party governance and recovery ceremony).

## 4.4 Open residuals

* The concrete number of identity trust domains (`DD-014`) awaits later
  topology architecture; this return sets only the minimum representable model
  (R02). Missing evidence: deployment and organizational topology analysis plus
  the Task 4 governance matrix.
* How identity trust domains map to authorization domains for each protected
  resource class (trust-boundaries section 34, scenario follow-up question;
  OQ-ID-05's resolution path is Identity to Control Plane). Missing evidence:
  the Task 5 authorization-domain inventory (AZ-006).
* Federation protocol mechanics (DD-011) await Task 9 evaluation.

## 4.5 Explicit non-decisions

* `DD-014` (number of identity trust domains) remains open.
* `DD-011` (federation protocol) remains open.
* No trust-domain topology, anchor hierarchy, CA, or federation product is
  selected or endorsed.
* SPIFFE trust domains are not adopted as the platform's universal trust model
  (ADR-0003 Alternative C was rejected); they are an evaluation subject for the
  workload-identity scope only.

---

# Question 5: Bootstrap Implications for Identity Binding

*Charter section 20.5: specify how bootstrap constraints (ADR-0004) affect
initial identity binding. No dedicated OQ-ID number exists for this question;
it is derived from ADR-0004, IN-004, and the bootstrap-related invariants.*

## 5.1 Requirements

**WP1-Q5-R01: Required bootstrap evidence classes for initial binding.**
Initial identity binding (principal-to-identity, and where required,
logical-principal-to-runtime) must be established from explicit bootstrap
evidence classes drawn from: enrollment or bootstrap credentials, registration
records, hardware evidence (endorsement roots, measured platform state),
platform or orchestrator identities, attestation-verifier trust relationships,
administrative provisioning records, and governed out-of-band assumptions. The
applicable class set is function-scoped: workload identity bootstrap, logical
principal bootstrap, trust-anchor bootstrap, and federation bootstrap may use
different authorities and evidence. [Trace: ADR-0004 (bootstrap trust,
function-scoped bootstrap, identity-binding assurance), IN-004
(`bootstrap-trust.md`, sections 9-13, 26-31), SI-11]

**WP1-Q5-R02: Eligibility-before-issuance.**
Identity issuance must follow an explicit eligibility decision: candidate,
observed evidence, verification, eligibility policy, principal-to-identity
binding, then routine credential. Registration establishes eligibility only; it
is not current proof of runtime identity (SI-11), and the routine credential
proves possession of issued identity material, not that the eligibility or
original binding was correct. [Trace: ADR-0004 (registration, eligibility and
binding), SI-11, ROLE-003 (sections 31, 34)]

**WP1-Q5-R03: Binding-assurance constraint.**
The assurance of a routine identity depends on the correctness of the original
principal-to-identity binding. Stronger operational cryptography (key length,
algorithm strength, hardware protection, shorter lifetimes, rotation) must not
be used as evidence that the original binding was correct. Where binding
correctness is in doubt, remediation requires stronger verification or
re-binding, not stronger keys. [Trace: SI-12, ADR-0004 (identity-binding
assurance), IN-004 (`bootstrap-trust.md`, section 14)]

**WP1-Q5-R04: Downgrade prohibition.**
Silent downgrade from a stronger bootstrap requirement to a weaker alternative
(for example, falling back to a static token when hardware-backed bootstrap is
unavailable) is prohibited unless explicitly authorized by policy. Availability
failure must not silently redefine identity-assurance requirements. Any
authorized fallback must be logged as a bootstrap-assurance change, not as a
routine issuance. [Trace: ADR-0004 (bootstrap downgrade), IN-004
(`bootstrap-trust.md`, section 47), SI-31]

**WP1-Q5-R05: Bootstrap scope separation.**
Bootstrap credentials and evidence establish only the explicitly defined
initial relationship and must not become standing application authority.
Enrollment or bootstrap credentials must remain scoped to their bootstrap
purpose (for example, node enrollment credential is not application
authorization credential; federation bootstrap credential is not cross-domain
administrative authority) unless an explicit architecture decision grants
broader authority. [Trace: SI-13, ADR-0004 (bootstrap credential scope), IN-004
(`bootstrap-trust.md`, sections 9, 37), SI-14]

**WP1-Q5-R06: Bootstrap closure.**
Bootstrap mechanisms must have a defined closure condition: when bootstrap is
complete, what routine credential or relationship replaces it, whether
bootstrap artifacts remain reusable, when they expire, whether replay is
possible, and what evidence records completion. A bootstrap pathway that remains
silently reusable is an alternative trust path and must be analyzed as such.
[Trace: SI-14, ADR-0004 (transition to routine operation), IN-004
(`bootstrap-trust.md`, section 38)]

**WP1-Q5-R07: Re-bootstrap and recovery implications for existing bindings.**
Re-bootstrap (after compromise, migration, trust-anchor replacement, ownership
change, or federation change) must not automatically inherit previous trust
assumptions; the new binding is evaluated against currently applicable bootstrap
requirements. Recovery of a compromised bootstrap or identity authority requires
an independently trusted recovery basis, since a compromised basis cannot
authenticate its own trustworthy replacement. Existing bindings established
under the old basis must be re-validated or re-bound under the new basis;
routine credential reissuance alone does not repair a compromised binding.
[Trace: ADR-0004 (re-bootstrap, recovery), IN-004 (`bootstrap-trust.md`,
sections 40-44), SI-12]

**WP1-Q5-R08: Logical-principal bootstrap independence.**
Where ADR-0002 requires logical-principal identity distinct from workload
identity, bootstrap must establish the logical-principal-to-runtime binding
explicitly, identifying: who is authorized to create the binding, what evidence
supports it, its scope and lifetime, how it is revoked, and whether migration
requires re-binding. Agent registration alone does not imply application
authority. [Trace: ADR-0004 (logical software principals and AI agents), IN-004
(`bootstrap-trust.md`, sections 29-31), SI-02]

**WP1-Q5-R09: Bootstrap auditability.**
Security-relevant bootstrap and re-bootstrap events must be auditable with
evidence sufficient to reconstruct the candidate principal, resulting identity
or trust relationship, bootstrap mechanism, evidence source, verifier,
registration or eligibility basis, trust authority, relevant trust anchor,
administrative actor or automation, decision outcome, and resulting operational
relationship. [Trace: ADR-0004 (auditability), IN-004 (`bootstrap-trust.md`,
section 48), EDGE-002 (section 36)]

## 5.2 Evidence

A candidate bootstrap design demonstrates satisfaction when:

* **Binding-correctness evidence:** the design documents the eligibility
  pipeline (candidate to routine credential) for each bootstrap function and
  shows that a misconfigured registration rule cannot produce a valid routine
  credential for the wrong principal (addresses R01-R03).
* **Downgrade evidence:** with the strong bootstrap path unavailable, the
  system refuses issuance or applies only the explicitly policy-authorized
  fallback, with the assurance change recorded (addresses R04).
* **Scope evidence:** bootstrap credentials presented as application authority
  are rejected by relying functions (addresses R05).
* **Recovery evidence:** after simulated compromise of the identity authority,
  the design shows an independent recovery basis and requires re-binding rather
  than mere credential reissuance (addresses R07; demonstrates the SI-12
  constraint in practice).
* **Closure evidence:** bootstrap artifacts have defined expiry or retirement
  and cannot be replayed after closure (addresses R06).
* **Evaluation subjects (not selection):** SPIRE node attestation plugins,
  TPM/TEE-backed enrollment, cloud instance-identity bootstrap, and PKI
  certificate enrollment protocols are evaluation subjects for bootstrap
  mechanisms; none is selected (ADR-0004's own not-made list is preserved).

## 5.3 Tradeoffs

* **Hardware-backed vs software-backed bootstrap.** Hardware roots
  (endorsement keys, measured boot, confidential-computing attestation) raise
  binding assurance and make key theft harder, at the cost of hardware
  dependence, supply-chain trust in the endorsement hierarchy, verifier
  infrastructure, and harder recovery; software-backed bootstrap (join tokens,
  cloud metadata, orchestrator-issued enrollment credentials) is portable and
  operationally simpler but concentrates trust in the provisioning path and the
  secrecy of enrollment material.
* **Strong bootstrap vs availability.** Strict bootstrap requirements improve
  binding assurance but make enrollment dependent on the availability of
  hardware, verifiers, or administrators; the downgrade prohibition (R04) means
  availability failures surface as enrollment failures rather than silent
  assurance reductions, which is the intended security property at an
  availability cost.
* **Centralized vs distributed bootstrap authority.** A single bootstrap
  authority simplifies governance and audit but is a high-value target whose
  compromise invalidates all bindings it established; distributed bootstrap
  authorities limit blast radius but require each to meet the same evidence and
  audit requirements, multiplying governance cost.
* **Binding durability vs re-verification frequency.** Long-lived bindings
  reduce bootstrap load but extend the window in which a binding established
  under later-invalidated assumptions remains trusted; frequent re-binding
  narrows that window at operational cost. The correct balance is risk-class
  dependent (Task 6 input).

## 5.4 Open residuals

* What concrete evidence classes and verification procedures constitute
  sufficient bootstrap for each deployment environment (cloud, on-premises,
  edge, confidential computing)? Missing evidence: environment-specific
  bootstrap analysis; this is feasibility input for WP-004 and Task 9.
* What is the governed recovery ceremony for a compromised identity authority
  or trust anchor in this platform's deployment? (IN-004 sections 43-45;
  EDGE-012 section 200). Missing evidence: the Task 4 recovery-authority
  design and Task 6 recovery procedures.
* Which bootstrap mechanisms support re-binding without full re-enrollment
  after principal migration, and what assurance do they preserve? Missing
  evidence: protocol-level analysis at Task 9.

## 5.5 Explicit non-decisions

* No bootstrap mechanism, enrollment protocol, CA, TPM/TEE usage, cloud
  bootstrap service, join-token scheme, or recovery platform is selected.
* No break-glass design is defined here (owned by recovery architecture).
* Failure semantics beyond these identity-specific inputs remain with Control
  Plane via Task 6.

---

# Cross-question consistency checks (performed, no Class C found)

* The `Logical Principal != Runtime / Workload != Credential` distinction
  (Q1) is preserved through binding (Q2, which never infers identity from
  runtime credentials), authorization participation (Q3, which prohibits the
  collapsed inferences), trust domains (Q4, which requires the principal and
  workload domains to be separable), and bootstrap (Q5, which binds each layer
  explicitly).
* `ROLE-001` and `ROLE-002` capability contracts are used as stated; no role
  is redefined and no role is collapsed because a candidate technology
  implements both (WR-005).
* SI-02, SI-03, SI-12, SI-27, and SI-31 appear as constraints in every
  question where they apply; no requirement weakens them.
* `DD-002`, `DD-003`, and `DD-014` are referenced only as open; nothing in this
  return closes them or selects the technology that would.

---

# References (all verified to exist in the repository)

* `docs/sprints/sprint-02-task-08-specialist-work-packages.md` (WP-001 charter,
  sections 18-24; routing requirements WR-001-WR-010)
* `docs/sprints/sprint-02-task-01-charter-and-traceability-baseline.md`
  (OQ-ID-01..OQ-ID-05; DD-002, DD-003, DD-014)
* `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md`
  (ROLE-001, ROLE-002, ROLE-003, ROLE-004)
* `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`
  (EDGE-001, EDGE-002, EDGE-012)
* `docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md`
  (AZ-001, AZ-002, AZ-003, AZ-004, AZ-005)
* `docs/architecture/principal-model.md` (IN-002)
* `docs/architecture/trust-boundaries.md` (IN-003)
* `docs/architecture/bootstrap-trust.md` (IN-004)
* `docs/architecture/delegated-authority.md` (IN-005)
* `docs/architecture/security-invariants.md` (SI-01..SI-05, SI-11, SI-12, SI-27)
* `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
* `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md`
* `docs/adr/0004-bootstrap-trust-and-identity-binding-assurance.md`

External standards cited strictly as evaluation subjects (not adopted, not
endorsed): SPIFFE specifications (SPIFFE ID, trust domain and bundle,
federation), X.509/RFC 5280, IETF WIMSE drafts (architecture, workload
identifier, workload credentials; Internet-Draft stage as of mid-2026), OIDC /
OAuth2, RFC 8693 (OAuth 2.0 Token Exchange), RATS/EAT (RFC 9334).
