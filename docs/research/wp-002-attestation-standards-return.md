# WP-002 Attestation / Standards Specialist Return

**Package ID:** `WP-002`
**Owning Specialist Project:** Trust Platform: Research (identity-specific integration noted for Trust Platform: Identity)
**Owner:** Trust Platform: Research
**Date:** 2026-10-06
**Status:** Returned (awaiting Control Plane semantic review per `WR-008`)

---

## Evidence State of This Return

**This entire return is a Research Finding.**

No claim in this document constitutes:

* Architecture Requirement beyond what is derived from accepted baseline inputs
* Candidate Technology (no `TE-055` evaluation is completed here)
* Selected Technology
* Implemented, Tested, Observed, Enforced, or Production Ready

Where rubric scores appear, they are **scored findings only**: indicative, per-dimension assessments produced through the Task 9 lens (gates, disqualifiers, rubric dimensions) to feed Control Plane evaluation. They are not eligibility determinations under `TE-012`, they are not recommendations, and selection remains with Control Plane.

---

## Package Charter Traceability

Routed questions (from `docs/sprints/sprint-02-task-08-specialist-work-packages.md`, section 27): 27.1 RATS / EAT role mapping; 27.2 WIMSE role mapping; 27.3 SPIFFE / SPIRE role mapping; 27.4 SPICE role mapping; 27.5 SCITT role mapping; 27.6 attestation verifier trust requirements; 27.7 evidence freshness and replay considerations. These correspond to Task 1 open questions `OQ-AT-01` through `OQ-AT-05`.

Accepted inputs binding this package (section 28): `IN-006` (threat model), `IN-007` (invariants), `IN-009` (system context), `IN-010` (trust standards landscape); ADR-0002, ADR-0003, ADR-0006; SI-17, SI-18, SI-31, SI-32, SI-34; ROLE-005, ROLE-006, ROLE-007, ROLE-015; EDGE-003, EDGE-004, EDGE-013, EDGE-015; OQ-AT-01 through OQ-AT-05; DD-004, DD-011.

**Non-authority (section 30, binding):** this return does not adopt, endorse, or recommend any standard as the platform choice; does not upgrade `IN-010` status; does not treat mapping completeness as selection justification; does not redefine ROLE-005, ROLE-006, or ROLE-007 around any standard's terminology; does not allow attestation to become identity, delegated authority, or authorization by implication (SI-17); does not close DD-004 or DD-011.

**`IN-010` status preserved:** every standard examined below remains "under architectural evaluation" in `docs/architecture/trust-standards-landscape.md`. Nothing in this return changes that status.

---

# 27.1 RATS / EAT Role Mapping

## Requirements

Every mapping below derives from the accepted inputs in section 28. Attestation stays bounded as evidence per SI-17 and SI-18.

| ID | Requirement | Traced to |
|---|---|---|
| REQ-27.1-1 | The Attester role must produce evidence only; it must not be positioned as establishing principal identity, delegated authority, or authorization | ROLE-005 (authority explicitly not held); SI-17; EDGE-003 section 54 |
| REQ-27.1-2 | The Verifier role must appraise evidence under explicit appraisal rules and emit an Attestation Result distinct from the evidence itself | ROLE-006; EDGE-003 section 44 ("Evidence does not itself constitute the appraisal result"); EDGE-004 section 60 |
| REQ-27.1-3 | The Relying Function role must consume the Attestation Result for a defined local security purpose; consumption must not transfer verifier or issuer authority | ROLE-007 section 86; EDGE-004 section 65 (local relying-function acceptance policy) |
| REQ-27.1-4 | Endorsement and reference-value authorities must be identified as explicit trust dependencies, never folded silently into the verifier or relying function | SI-18; ROLE-006 section 74 (trust dependencies); EDGE-003 sections 47, 48 |
| REQ-27.1-5 | The verifier must preserve a three-way distinction: VALID ≠ INVALID ≠ UNKNOWN, and a relying function must not silently reinterpret unknown as acceptable | ROLE-006 section 76; EDGE-004 section 67; SI-31 |
| REQ-27.1-6 | Conflicting Attestation Results must receive explicit treatment per OQ-AT-05, consistent with Task 6 failure semantics | ROLE-006 section 76 ("Conflicting or stale evidence requires explicit treatment"); SI-31; IN-006 threat family T3 |

## RATS Role Mapping (RFC 9334)

RATS defines five roles plus two owner roles. Mapping to ATP roles:

| RATS role (RFC 9334) | ATP counterpart | Fit |
|---|---|---|
| **Attester** (produces Evidence about itself, assumed to need verification) | ROLE-005: Attester | **Direct.** Both produce evidence about a target; both are explicitly not self-certifying. RATS treats the Attester as the untrusted party whose claims are appraised, which aligns with ROLE-005 ("that source role does not make every claim intrinsically trustworthy"). |
| **Verifier** (appraises Evidence against Endorsements, Reference Values, and appraisal policy; emits Attestation Results) | ROLE-006: Attestation Verifier | **Direct, with one partial element.** Appraisal under defined rules matches ROLE-006 sections 69-76. Partial: RFC 9334 allows Verifier and Relying Party to be co-located (the "background-check" and "passport" topologies permit different placements, and RFC 9334 explicitly contemplates combining them). ATP separates ROLE-006 from ROLE-007 as distinct roles with distinct failure semantics and co-location risks (ROLE-006 sections 79-80: "Attestation result being treated as authorization" is a named co-location risk). Co-location of Verifier and Relying Party in a candidate must therefore be recorded as compensating-architecture territory, not as architecture-equivalence. |
| **Relying Party** (consumes Attestation Results to make a decision, for example admitting a node or releasing a key) | ROLE-007: Relying Function | **Direct, with a strain.** RATS language ("consumes results to make a decision") matches ROLE-007. Strain: RATS examples frame the Relying Party decision as often authorization-adjacent (key release, admission), while ATP constrains ROLE-007 to local, purpose-scoped interpretation and explicitly denies inherited verifier/issuer authority (section 86). A RATS passport-model Result carried by an untrusted intermediary and presented to a Relying Function is evidence, not a decision; the decision still occurs locally under EDGE-004 section 65 acceptance policy. |
| **Endorser** (vouches for the Attester's capabilities; in practice silicon vendor certificate infrastructure) | No direct ATP role | **No counterpart (supporting trust basis).** The Endorser maps to trust-anchor and authority governance territory: EDGE-003 section 48 ("Endorsement authority"), EDGE-012 (Trust-Anchor Distribution), and the Task 4 ANCHOR matrix. This matters because endorsements are a distinct trust dependency with their own provisioning, rotation, and compromise path (the IN-010 trust-anchor principle items 4-10), and folding them into "the verifier handles it" would hide correlated compromise (SI-34). |
| **Reference Value Provider** (publishes known-good values, measurements, minimum versions) | No direct ATP role | **No counterpart (supporting authority).** Maps to ROLE-006 trust dependencies ("reference values") and EDGE-003 section 49 / EDGE-004 section 66 (reference-value invalidation, change recovery). Security-material because a compromised or attacker-supplied reference value makes any verifier pass malicious code; this is the IN-006 T3 target set ("reference values") and the rationale for explicit trust basis under SI-18. |
| **Verifier Owner** (sets evidence-appraisal policy) | No direct ATP role (governance territory) | **No counterpart.** Policy governance belongs to Control Plane / Task 4 governance functions. A standard that merges Verifier and Verifier Owner into one product concept must not cause ATP to merge appraisal execution with appraisal-policy authority. |
| **Relying Party Owner** (sets result-acceptance and enforcement policy) | No direct ATP role (governance territory) | **No counterpart.** Acceptance policy belongs to the local domain's governance (EDGE-004 section 65; EDGE-015 section 248 intended purpose). |

EAT (RFC 9711, Proposed Standard) maps to the **representation** of EDGE-003 evidence, not to a role: it standardizes attestation-oriented claims encoding (CWT/CBOR-based Entity Attestation Tokens). IN-010 correctly lists EAT under "Attestation-oriented claims representation." EAR (Entity Attestation Result, IETF draft stage) would correspond to EDGE-004 representation. Representation standardization does not satisfy the appraisal-policy, trust-basis, or freshness requirements; those are architecture requirements (SI-18, EDGE-003 sections 46-48), not encoding choices.

## Partial-Fit and Gap Analysis

1. RATS has no native concept of **attestation trust domain scoping** as ADR-0003 defines it (function-scoped: identity trust domain, attestation trust domain, authorization domain as qualified terms). RATS reference-value and endorsement trust is implicit in deployment topology; ATP requires explicit domain qualification. Any candidate adopting RATS roles must add explicit attestation trust-domain scoping; this is a mapping gap, not a refutation.
2. RATS defines message flow, not **replay binding semantics**; freshness requirements live in profiles (for example, EAT nonce/challenge claims). ATP's EDGE-003 section 46 and section 27.7 below impose them as requirements. A RATS-conformant product without profile-level freshness binding does not satisfy REQ-27.1-5 by itself.
3. RATS Verifier independence from the attested runtime is deployment-dependent, not architecture-guaranteed; see 27.6 and SI-34.

## Scored Findings (Task 9 Lens)

Indicative only. Layer 1 gate-screen against key constraints and disqualifiers first; rubric scores second. Not an eligibility determination; selection stays with Control Plane.

Layer 1 (key gates):
- TE-021 / TE-035 (SI-17): PASS for the architecture as specified (RFC 9334 explicitly separates Evidence, Attestation Result, and Relying Party decision). Deployment caveat: products that merge Verifier and Relying Party into one authorization decision would trigger TE-035 and must be evaluated per-product, not per-architecture.
- TE-036 (SI-18): CONDITIONAL PASS. RATS names endorsements, reference values, and appraisal policy as explicit inputs; the architecture does not specify their trust basis, governance, or lifecycle, so per TE-009 and TE-015 the trust-anchor-model dimension carries unresolved uncertainty and scores at most 1 until a concrete profile is evaluated.

Rubric (assessed dimensions only; others not assessed in this research pass):

| Dimension (weight) | Score | Evidence |
|---|---|---|
| Standards alignment (3) | 3 | RFC 9334 (Informational, Jan 2023); EAT RFC 9711 (Proposed Standard). Open specifications, no proprietary extension required for role semantics. |
| Architecture-role coverage (6) | 3 | Direct mapping for Attester, Verifier, Relying Party; Endorser and Reference Value Provider correctly fall outside role space into trust-basis governance. |
| Attestation semantics (6) | 3 | Evidence / appraisal / result / decision separation is native to the architecture; verifier trust explicitness is required by SI-18 and named by RATS but not specified. |
| Authorization semantics (8) | 2 | RATS keeps the Relying Party decision local, which aligns; but authorization-adjacent RATS examples plus co-location permissiveness create documented caveats requiring compensating architecture. |
| Trust-anchor model (6) | 1 | Per TE-015: endorsement and reference-value trust basis is named but unspecified; material unresolved uncertainty. |
| Cross-domain support (4) | 2 | Passport and background-check models support cross-domain flows; no explicit purpose-scoping or non-transitivity semantics in the architecture (ATP requires EDGE-015 acceptance contract). |
| Testability (3) | 2 | Conformance test suites exist in the ecosystem; negative/failure testing per Task 7 would be profile-specific. |

Indicative weighted subtotal over assessed dimensions: 60 of 124 (48 percent). This is not a TE-012 eligibility figure; only seven of 22 dimensions were assessed, and no selection inference is drawn.

## Tradeoffs

- RATS maturity (RFC-published architecture, broad industry decomposition) versus architectural incompleteness (trust basis for endorsers and reference values is deployment-defined; freshness is profile-defined).
- Passport model (result travels with the attester; scalable, but result replay and purpose-misuse analysis required per EDGE-004 section 68) versus background-check model (relying party forwards evidence to its own verifier; tighter local control, but requires verifier reachability and changes failure semantics under Task 6).
- EAT standardization (interoperable evidence encoding) versus the risk that a well-formed token is mistaken for appraised evidence (SI-18: cryptographic validity of evidence does not establish appraisal-policy trustworthiness).

## Open Residuals

- OQ-AT-01 (RATS role mapping) is answered for the five RATS roles; the **owner roles** (Verifier Owner, Relying Party Owner) remain unmapped to accepted governance roles and need Task 4 ANCHOR/AUTH-role evidence.
- Which RATS topology (passport vs background-check) the platform prefers for which relying purpose is unresolved; Task 10 component mapping needs the decision, and it affects Task 6 failure semantics.
- EAR is still an IETF draft; EDGE-004 representation choice awaits the Task 9 gate.

## Explicit Non-Decisions

- No adoption of RATS, EAT, or EAR as the platform attestation standard; that decision belongs to the Task 9 evaluation gate and Task 10 selection gate. DD-004 (attestation implementation) stays open. IN-010 status for RATS/EAT is unchanged ("under architectural evaluation").

---

# 27.2 WIMSE Role Mapping

## Requirements

| ID | Requirement | Traced to |
|---|---|---|
| REQ-27.2-1 | Any WIMSE-derived workload identity must be presented and consumed as workload identity only; it must not be presented as logical-principal identity without explicit justification and an explicit binding mechanism | ADR-0002 (the decision names SPIFFE/WIMSE-class workload identity as a non-decision while requiring the logical-actor/workload distinction); SI-02 |
| REQ-27.2-2 | WIMSE trust domains must be qualified per ADR-0003 as function-scoped identity trust domains, not treated as universal trust roots | ADR-0003; SI-08, SI-09 (no implicit transitivity or symmetry) |
| REQ-27.2-3 | Workload credentials must bind the key material to the identity (proof of possession), and presentation must demonstrate possession; bearer-style reuse of identity tokens must be prohibited by policy | EDGE-001 (identity assertion); SI-01 (credential is not principal); IN-010 layer 4 (authentication and proof of possession) |
| REQ-27.2-4 | Cross-domain acceptance of WIMSE assertions must follow the EDGE-015 contract: explicit local purpose, directional and purpose-scoped acceptance, no automatic authorization import | EDGE-015 sections 244-249; SI-10 |
| REQ-27.2-5 | WIMSE identifier and credential formats are Internet-Drafts; the mapping must not treat draft wire formats as stable architecture contracts | IN-010 (WIMSE: "active IETF work; architecture currently an Internet-Draft"); TE-058 (re-evaluation on new version) |

## WIMSE Concept Mapping

WIMSE (IETF Workload Identity in Multi System Environments working group) defines, in active Internet-Drafts: an architecture (draft-ietf-wimse-arch), a workload identifier (draft-ietf-wimse-identifier), workload credentials (draft-ietf-wimse-workload-creds), and protocol bindings. Maturity: **Internet-Draft stage; no RFCs published.** IN-010 lists WIMSE as "Active IETF work; architecture currently an Internet-Draft" and "Under architectural evaluation"; that status is preserved.

| WIMSE concept | ATP counterpart | Fit |
|---|---|---|
| **Workload** (charter: a running software instance executing for a specific purpose) | ROLE-002 (Workload) aspect: runtime/workload identity | **Direct as a workload concept.** Maps to the workload side of ADR-0002. Must not be presented as ROLE-001 (Logical Principal); see REQ-27.2-1. |
| **Trust Domain** (identified by FQDN; workloads sharing security policy) | Identity trust domain, qualified per ADR-0003 | **Partial.** WIMSE trust domains are identity-scoped; ADR-0003 requires function-scoped qualification (identity trust domain vs attestation trust domain vs authorization domain). A WIMSE trust domain maps to exactly one qualified kind: the identity trust domain. Treating it as the attestation or authorization trust domain would collapse function scoping. |
| **Workload Identifier** (URI uniquely identifying a workload within a trust domain; SPIFFE-ID-compatible format) | EDGE-001 (Identity Assertion) subject naming; namespace governance | **Direct for naming.** Identifier format is a representation choice; acceptance of the identifier still requires the EDGE-001 assertion contract and EDGE-012 trust-anchor distribution. |
| **Workload Identity Token (WIT)** (JWT binding workload identity to a public key via `cnf`) | EDGE-001 identity assertion (credential class) | **Direct with constraint.** The credential binds identity to key material; per REQ-27.2-3, the platform must require proof-of-possession presentation. The WIMSE S2S design itself requires this: WIT must not be used as a bearer token and must be accompanied by a Workload Proof Token (WPT) or HTTP Message Signatures. |
| **Workload Identity Certificate (WIC)** (X.509 binding workload identity to a public key; transport-layer use) | EDGE-001 identity assertion (credential class) | **Direct.** X.509 workload certificates are a credential representation; identity vs principal distinction (SI-01) still applies. |
| **Workload Proof Token (WPT)** / HTTP Message Signatures | Proof-of-possession mechanism under EDGE-001 verification basis | **Direct.** These are the presentation bindings that make the credential more than a bearer token. |
| **Security-context / transaction-token propagation** (carrying original-caller context along workload chains) | EDGE-008 (Authorization Context) input class; ADR-0005 delegation territory | **Strained.** Context propagation is useful evidence for authorization context, but under ADR-0005 and SI-19 through SI-26, propagated context is not delegation and does not establish authority. WIMSE drafts that discuss delegation/impersonation through token services and OAuth token exchange (draft-ietf-wimse-arch) must be read as **protocol mechanisms**, not as architecture delegation grants. A candidate that treats a propagated security context as delegated authority triggers TE-042 ("valid delegation means permit" class failure). |
| **Attestation** (listed in WIMSE material as the mitigation ensuring only legitimate workloads obtain identities) | EDGE-003 evidence; ROLE-005/ROLE-006 | **Partial.** WIMSE invokes attestation as a prerequisite for issuance, but the architecture does not specify the attestation trust relationship; that is ATP territory (SI-17, SI-18, section 27.6). Workload attestation for identity issuance must not be confused with the attestation evidence the workload later produces. |
| **AI-agent delegation drafts** (2026 individual/related drafts: attenuated delegation for agent chains, credential delegation across systems, authorization-evidence records) | ADR-0005 delegation model | **Not architecture.** These are individual drafts, not WG-adopted normative standards, and several carry explicit disclaimers of IETF standing. They are research inputs only; mapping them to ATP delegation roles now would be premature standardization of unstable concepts. |

## ADR-0002 Preservation

WIMSE identifies **workloads** (running software instances). ADR-0002 requires that logical-actor identity remain independently distinguishable from hosting workload identity whenever security properties differ. The mapping therefore records: a WIT or WIC identifying a workload establishes, at most, workload identity. If an AI agent or other logical actor runs inside that workload and its authority, delegation, policy, lifecycle, revocation, or audit attribution differs, the WIMSE credential does not identify the agent; an explicit binding mechanism is required (WP-001 and WP-003 territory). WIMSE's own charter scope (workload identity in multi-system environments) supports this reading; it does not claim logical-actor identity.

## Scored Findings (Task 9 Lens)

Indicative only; not an eligibility determination; selection stays with Control Plane.

Layer 1 (key gates):
- TE-019 / TE-032 (SI-02): CONDITIONAL PASS. The architecture distinguishes workload identity as its subject; the risk is in deployment reading (presenting WIT as agent identity), which is an integration constraint (REQ-27.2-1), not an architecture violation.
- TE-020 (SI-03): UNRESOLVED. Short-lived, auto-rotated credentials are the design intent (minutes to hours), but independent governance of identity validity versus authority validity is not specified in the drafts reviewed; per TE-015 this caps related dimensions until specified.

Rubric (assessed dimensions only):

| Dimension (weight) | Score | Evidence |
|---|---|---|
| Standards alignment (3) | 1 | Active IETF WG but Internet-Draft stage, no RFCs; wire formats unstable; per TE-015, unresolved maturity uncertainty caps the score. |
| Architecture-role coverage (6) | 2 | Covers workload identity assertion (ROLE-002/ROLE-003-adjacent); does not address logical-principal identity (correctly out of scope, but the gap must be filled elsewhere). |
| Identity semantics (8) | 2 | Credential-to-key binding and PoP are specified; workload vs logical-actor distinction depends on deployment discipline (ADR-0002) rather than protocol enforcement. |
| Trust-anchor model (6) | 1 | Identity Server trust basis named; distribution, rotation, compromise response unspecified in drafts reviewed; per TE-015, unresolved. |
| Cross-domain support (4) | 2 | Cross-domain token conversion is a design goal; explicit purpose-scoping and non-transitivity per EDGE-015/SI-08/SI-09 are not in the architecture. |
| Crypto agility (4) | 2 | JOSE-based tokens permit algorithm agility in principle; no hardcoded-algorithm evidence found, but no migration path specified either. |

Indicative weighted subtotal over assessed dimensions: 50 of 124 (40 percent). Not a TE-012 eligibility figure; six of 22 dimensions assessed; no selection inference.

## Tradeoffs

- WIMSE's explicit proof-of-possession requirement (WIT never bearer; WPT or signatures required) versus operational complexity of per-request proofs in high-throughput workload meshes.
- Draft-stage flexibility (the platform can still influence or track changes) versus draft-stage instability (wire-format churn, TE-058 re-evaluation triggers, no normative base to build lasting contracts on).
- Interoperability ambition (cross-system, cross-cloud workload identity) versus trust-anchor complexity: every accepted trust domain multiplies the ANCHOR governance surface (IN-010 trust-anchor principle).

## Open Residuals

- OQ-AT-02 (WIMSE role mapping) answered at architecture level; **draft maturity is the blocking residual**: no RFC exists, so this mapping must be re-done (not amended) per TE-058 when drafts advance or change.
- How WIMSE trust-domain acceptance interacts with federation protocol selection is unresolved and feeds DD-011; the mapping records the EDGE-015 requirement but no protocol satisfies it yet at this maturity.
- The relationship between WIMSE transaction/security-context tokens and ATP delegation (ADR-0005) needs joint review with WP-003; the current position (context is evidence, not delegation) is a research finding, not a settled interface contract.

## Explicit Non-Decisions

- No adoption of WIMSE as the platform workload-identity standard; that decision belongs to the Task 9 gate and Task 10 selection. DD-002 (workload identity implementation) and DD-011 (federation protocol) stay open. IN-010 status unchanged.

---

# 27.3 SPIFFE / SPIRE Role Mapping

## Requirements

| ID | Requirement | Traced to |
|---|---|---|
| REQ-27.3-1 | SPIFFE concepts (trust domain, trust bundle, SVID) must be mapped as specification concepts; SPIRE characteristics (server/agent deployment, registration entries, CA operation) must be mapped as implementation characteristics, never as architecture requirements | WR-003 (vendor-neutral); Task 8 section 27.3 (explicit charter instruction) |
| REQ-27.3-2 | A SPIFFE ID / SVID identifies a workload; it must not be presented as logical-principal identity where ADR-0002 requires the distinction | ADR-0002; SI-02; SI-05 |
| REQ-27.3-3 | SPIFFE trust domains must be qualified per ADR-0003 as identity trust domains; federation between SPIFFE trust domains must satisfy EDGE-015 cross-domain acceptance | ADR-0003; EDGE-015; SI-08, SI-09 |
| REQ-27.3-4 | Trust bundles (the set of trusted CA roots for a domain) must be distributed, rotated, and revoked under explicit governance consistent with EDGE-012 | EDGE-012 (Trust-Anchor Distribution); SI-38; IN-010 trust-anchor principle |
| REQ-27.3-5 | Attestation-based issuance (workload attestation before SVID issuance) must be treated as an issuance-time control with its own trust basis, not as standing proof of workload state | SI-17, SI-18; EDGE-003 (attestation evidence is time-bound and purpose-bound) |
| REQ-27.3-6 | JWT-SVID bearer semantics must be handled as bearer-token risk: short lifetime, audience restriction, and replay analysis per 27.7 | EDGE-001 verification basis; 27.7; IN-006 T3-02 (stale or replayed evidence) |

## SPIFFE Specification Mapping

SPIFFE is a published open workload-identity specification (CNCF). Core concepts:

| SPIFFE spec concept | ATP counterpart | Fit |
|---|---|---|
| **Trust Domain** (e.g., `spiffe://trust-domain/path`; the domain is the trust boundary for identity issuance) | Identity trust domain, qualified per ADR-0003 | **Direct, with qualification.** SPIFFE trust domains are identity-scoped by definition; ATP requires the "identity" qualifier whenever multiple functions are in play (ADR-0003 examples explicitly include "SPIFFE trust domain" as one qualified kind). |
| **Trust Bundle** (set of CA public keys / roots a workload trusts to validate SVIDs) | EDGE-012 (Trust-Anchor Distribution) state | **Direct.** The bundle is trust-anchor distribution state; its lifecycle (distribution, rotation, revocation, compromise response) is governed by EDGE-012 and SI-38, not by the SPIFFE spec. |
| **SVID** (SPIFFE Verifiable Identity Document: X.509-SVID or JWT-SVID binding a SPIFFE ID to key material) | EDGE-001 identity assertion (credential) | **Direct as credential.** X.509-SVIDs enable mutual authentication with proof of possession; JWT-SVIDs are bearer tokens with the replay and lifetime constraints of REQ-27.3-6. Neither is a principal (SI-01). |
| **Attestation-based issuance** (identity derived from observed workload properties at issuance time; no long-lived provisioned secret) | ROLE-003 (Identity Authority) issuance control | **Direct as issuance control.** Strengthens the binding assurance question (SI-12) at issuance. It does not convert the resulting credential into attestation evidence about current state (REQ-27.3-5). |
| **Workload API** (local API through which a workload obtains its SVID) | Issuance interface (implementation-adjacent) | **Partial.** The API is a mechanism; ATP cares about the issuance trust relationship and binding proof, which the API facilitates but does not define. |
| **Federation** (exchange of trust bundles between trust domains) | EDGE-015 cross-domain assertion (trust-anchor exchange class) | **Partial.** SPIFFE federation exchanges bundles; ATP additionally requires explicit local acceptance policy, purpose scoping, and directional trust (EDGE-015 sections 248-249; SI-08, SI-09). Bundle exchange alone does not satisfy EDGE-015. |

## SPIRE Implementation Mapping (kept distinct from the specification)

SPIRE is the CNCF open-source implementation of the SPIFFE specification (production deployment per IN-010's tracking row; the row lists SPIRE separately as "Production implementation of SPIFFE APIs"). Implementation characteristics observed:

- SPIRE Server: trust-domain CA, registration-entry policy store (attestation selectors mapped to SPIFFE IDs), bundle management, federation endpoint operation.
- SPIRE Agent: per-node daemon performing node attestation (platform evidence) and workload attestation (process selectors), exposing the Workload API, caching and rotating SVIDs.
- Attestation plugins: node attestation (cloud instance identity, TPM, Kubernetes) and workload attestation (Unix, Kubernetes, Docker selectors) are **plugin-defined and deployment-chosen**; the SPIFFE specification does not standardize them.

Per REQ-27.3-1 and the Task 8 charter, none of the following are architecture requirements: server/agent topology, registration-entry schema, plugin selection, CA backend (including HSM/KMS protection of CA keys), SVID TTL defaults, or HA deployment shape. They are candidate implementation evidence for Task 9/Task 10, not requirements. Presenting "SPIRE Server holds the domain CA" as an architecture requirement would violate WR-005 (no silent standardization) and TE-004 (vendor neutrality).

## ADR-0002 Preservation

A SPIFFE ID names a workload (service, job, or process class within a trust domain). Where an AI agent or other logical actor executes inside a workload and its authority, delegation, policy, lifecycle, revocation, or audit properties differ from the workload's, the workload's SVID does not identify the agent (ADR-0002 decision rule). The mapping records the SVID as workload-identity evidence consumable under EDGE-001; logical-actor binding remains WP-001/WP-003 territory. This is consistent with IN-010 layer 3: "Workload identity does not automatically establish the identity of every logical actor executing inside the workload."

## Scored Findings (Task 9 Lens)

Indicative only; not an eligibility determination; selection stays with Control Plane. Scored against the **SPIFFE specification**; SPIRE scored only where implementation characteristics are inseparable from the question, and labeled as such.

Layer 1 (key gates):
- TE-019 / TE-032 (SI-02): PASS for the specification (it defines workload identity and does not claim logical-actor identity). Deployment integrations that present SVIDs as agent identity would be evaluated as integration failures, not spec failures.
- TE-018 (SI-01): PASS (SVID lifecycle is credential lifecycle; the spec does not redefine the principal).
- TE-021 / TE-035 (SI-17): PASS for the specification; attestation appears only as an issuance-time input. Product deployments that treat SVID possession as authorization would trigger TE-042 and must be screened per product.

Rubric (assessed dimensions only):

| Dimension (weight) | Score | Evidence |
|---|---|---|
| Standards alignment (3) | 3 | Published open specification; CNCF-backed; multiple interoperable implementations exist. |
| Architecture-role coverage (6) | 3 | Workload identity issuance and validation roles map cleanly; logical-principal identity correctly out of scope. |
| Identity semantics (8) | 3 | Credential/principal, workload/logical-actor, and issuance/identity distinctions are spec-native; binding is attestation-based at issuance. |
| Trust-anchor model (6) | 2 | Trust bundles are an explicit, distributable anchor set; rotation and compromise response are implementation-defined (SPIRE: documented operational practice; not architecture). |
| Bootstrap model (5) | 2 | Attestation-based issuance gives a defined first-binding path; trust in the attestation plugins and initial bundle provisioning is deployment-defined (SI-12 assurance varies by plugin). |
| Revocation model (6) | 2 | Short-lived SVIDs bound revocation exposure to TTL; explicit revocation (as distinct from expiration) is limited; TE-027's "unknown revocation state" handling is deployment policy. |
| Cross-domain support (4) | 2 | Federation is specified; purpose-scoping and non-transitivity per EDGE-015 are not spec-native. |
| Operational complexity (1) | 2 | (SPIRE implementation characteristic) Agent-per-node plus server topology is real operational burden; scored low weight by design per TE-005. |
| Vendor dependency (1) | 3 | Open specification; multiple implementations; no lock-in at spec level. |

Indicative weighted subtotal over assessed dimensions: 84 of 148 (57 percent). Not a TE-012 eligibility figure; nine of 22 dimensions assessed; no selection inference.

## Tradeoffs

- Specification maturity and implementation availability (SPIFFE/SPIRE are the most deployed workload-identity option in the set) versus the temptation to let the implementation define the architecture (the exact failure Task 9 exists to prevent: "Product is widely deployed, therefore product defines correct trust semantics").
- Short-lived SVIDs (revocation exposure bounded by TTL; aligns with TE-027's expiration/revocation distinction) versus reliance on expiration as the primary revocation mechanism, which is weaker than explicit revocation for compromise scenarios (SI-32: compromise is not unavailability; a compromised workload's SVID remains valid until TTL expiry).
- Attestation-based issuance (no long-lived provisioned secrets; strong SI-12 binding at issuance) versus plugin-defined attestation strength: the security of the binding is only as strong as the weakest enabled attestation plugin, and plugin selection is a deployment decision with architecture consequences that must be governed (SI-38).

## Open Residuals

- OQ-AT-03 (SPIFFE/SPIRE mapping) answered at spec level; **per-product evaluation** (a specific SPIRE version against TE-017 through TE-051) is Task 9 work and is not done here.
- Whether JWT-SVIDs are acceptable for any ATP purpose given bearer semantics, or whether only X.509-SVIDs (proof-of-possession at the transport layer) satisfy REQ-27.3-6, is unresolved and affects EDGE-001 verification-basis requirements.
- SPIFFE federation's interaction with DD-011 (federation protocol) is open; bundle exchange is necessary but not sufficient for EDGE-015.

## Explicit Non-Decisions

- No adoption of SPIFFE or SPIRE; the Task 9 gate and Task 10 selection decide. DD-002 (workload identity implementation) stays open. The spec/implementation distinction is preserved as a standing evaluation rule, not just a documentation note. IN-010 status unchanged.

---

# 27.4 SPICE Role Mapping

## Requirements

| ID | Requirement | Traced to |
|---|---|---|
| REQ-27.4-1 | SPICE credential patterns must be mapped as verifiable-claims representations; issuance maps to ROLE-003, presentation validation maps to ROLE-004, and neither maps to delegated authority | ROLE-003 (Identity Authority), ROLE-004 (Identity Validation); IN-010 layer 6 ("Represent and present cryptographically verifiable claims... beyond fundamental runtime workload identity"; "SPICE is not currently treated as the canonical workload identity mechanism") |
| REQ-27.4-2 | A credential presentation must never be presented as delegated authority without explicit analysis; presentation proves claims about a subject, not authority to act | ADR-0005 (delegation is the governed grant of bounded authority by one principal to another); SI-19; Task 8 section 27.4 charter ("must not be presented as delegated authority without explicit analysis") |
| REQ-27.4-3 | Selective disclosure and unlinkability properties must be evaluated against audit reconstructability (SI-35): data minimization in presentation must not destroy the provenance the audit function requires | SI-35; ROLE-015 (Audit / Evidence Function); EDGE-013 |
| REQ-27.4-4 | Key binding in credentials (holder proof of possession at presentation) must be required wherever a presentation is consumed as an identity assertion | EDGE-001 verification basis; SI-01 |
| REQ-27.4-5 | SPICE artifacts are Internet-Drafts; mapping must not treat draft credential profiles as stable contracts | IN-010 (SPICE: "Active IETF working group with Internet-Drafts"; "Under architectural evaluation") |

## SPICE Concept Mapping

SPICE (IETF Secure Patterns for Internet CrEdentials working group; active; charter covers digital credential profiles for issuance and presentation). Program of work includes an informational architecture, SD-CWT (selective disclosure for CWT, a profile of CWT inspired by SD-JWT), and metadata/capability discovery. Maturity: **active WG, Internet-Draft stage; no RFCs.**

| SPICE concept | ATP counterpart | Fit |
|---|---|---|
| **Issuer** (constructs and secures a digital credential for a holder) | ROLE-003 (Identity Authority) for identity credentials; credential-issuer role for attribute credentials | **Direct for the issuance function.** Note IN-010: SPICE credentials go "beyond fundamental runtime workload identity," so the issuer here is not necessarily the workload identity authority; issuer trust basis must be identified per credential class (SI-18 pattern applies by analogy). |
| **Holder** (carries credentials and key material, e.g., in a wallet; produces presentations) | Credential presenter (EDGE-001 presenter/producer distinction, Task 3 section on producer vs presenter) | **Direct.** Task 3 distinguishes producer from presenter; the holder-as-presenter pattern fits that distinction. |
| **Verifier** (appraises a presentation) | ROLE-004 (Identity Validation) for identity assertions; ROLE-006-adjacent appraisal for attestation-flavored claims | **Partial.** SPICE "verifier" terminology collides with ATP's Attestation Verifier (ROLE-006). The mapping must qualify: a SPICE presentation verifier performs claim validation (ROLE-004-like), not attestation appraisal, unless the credential carries attestation evidence. Terminology collision is a documented strain; see below. |
| **Credential** (claims about a subject, cryptographically bound to keys) | EDGE-001 identity/attribute assertion (representation class) | **Direct as representation.** |
| **Presentation** (holder-disclosed credentials, attributes, or proofs to a verifier) | EDGE-001 presentation flow | **Direct.** Selective disclosure (SD-CWT: disclosing a subset of claims while proving the credential's integrity) is a presentation property, not a trust property. |
| **Selective disclosure / unlinkability** | Presentation privacy properties | **No direct ATP role; cross-cutting property.** Must be reconciled with SI-35 audit reconstructability (REQ-27.4-3): a presentation that withholds claims the audit function needs creates an evidence gap. Data minimization and audit completeness are in tension; the architecture must decide per purpose which prevails, not assume both. |
| **Authorization-evidence / delegation-adjacent drafts** (2026 related drafts on verifiable attenuated delegation, credential delegation for AI agents) | ADR-0005 delegation model; EDGE-005/EDGE-006 delegation contracts | **Strained; separation required.** Per REQ-27.4-2 and ADR-0005, a credential that carries "delegation-like" claims is evidence about a claimed grant, not the grant itself. The grant exists only where the ATP delegation contracts (EDGE-005 grant, EDGE-006 validation) are satisfied: explicit delegator, bounded scope, non-amplification (SI-20), no redelegation by default (SI-21), provenance preservation (SI-23, SI-24). A SPICE credential *representing* a delegation claim must be validated as delegation evidence under EDGE-006; it does not bypass it. |

## Delegation Separation Analysis (per ADR-0005, as chartered)

ADR-0005 defines delegation as the governed grant of bounded authority by one principal to another, derived from authority the delegator is permitted to delegate, evaluated separately from identity and authentication. Applied to SPICE patterns:

1. **Presentation is not a grant.** A holder presenting a credential proves possession of claims; it does not prove the presenter holds authority derived from those claims. Consuming a presentation as authorization input requires the authorization function (Task 5 AZ contracts) to define the relationship explicitly (SI-17 pattern: no automatic semantic equivalence).
2. **Issuer is not delegator.** A credential issuer vouches for claims; a delegator grants authority. Conflating them would let any claim-issuer mint authority, violating SI-20 (non-amplification) at the architecture level.
3. **Attenuation claims are constraints on paper until enforced.** Drafts describing "attenuated delegation" describe credential constraints; attenuation is real only where the authorization decision function enforces the constraint (SI-30: authorization requires effective enforcement).
4. **Holder binding is not principal binding.** Key binding proves the presenter holds the key; under SI-01 and SI-02 it does not establish which logical principal the presenter acts for.

## Scored Findings (Task 9 Lens)

Indicative only; not an eligibility determination; selection stays with Control Plane.

Layer 1 (key gates):
- TE-022 / TE-038 through TE-041 (delegation): NOT TRIGGERED at the architecture level, because SPICE as mapped here claims only credential representation, not delegation semantics. Any candidate profile that claims delegation semantics would be screened against TE-038 (amplification), TE-039 (redelegation default), TE-040 (withdrawn basis), TE-041 (implicit union) at that time. The mapping's delegation-separation analysis above is the pre-screening position.
- TE-018 (SI-01): PASS (credential/holder/key structure preserves credential-vs-principal distinction).

Rubric (assessed dimensions only):

| Dimension (weight) | Score | Evidence |
|---|---|---|
| Standards alignment (3) | 1 | Active IETF WG, Internet-Draft stage; no RFCs; per TE-015, maturity uncertainty caps the score. |
| Architecture-role coverage (6) | 2 | Issuance and validation functions map; no workload-identity or attestation-appraisal role coverage (correctly out of scope per IN-010). |
| Identity semantics (8) | 2 | Issuer/holder/verifier and key-binding structure is sound; selective disclosure creates the SI-35 tension noted in REQ-27.4-3, unresolved. |
| Authority semantics (8) | 1 | The architecture is silent on authority semantics; authority claims would come from profiles/drafts not yet stable. Per TE-015, unresolved uncertainty caps at 1; a delegation-claiming profile would need full TE-022 screening. |
| Auditability (5) | 1 | Selective disclosure vs reconstructability tension is unresolved; no profile specifies what the audit function receives. Per TE-015, capped. |
| Crypto agility (4) | 2 | COSE/JOSE substrate permits agility in principle; migration path unspecified. |

Indicative weighted subtotal over assessed dimensions: 42 of 136 (31 percent). Not a TE-012 eligibility figure; six of 22 dimensions assessed; no selection inference. The low figure reflects draft-stage immaturity, not a semantic rejection; re-evaluation per TE-058 is expected as drafts advance.

## Tradeoffs

- Selective disclosure and unlinkability (privacy, data minimization, holder agency) versus audit reconstructability (SI-35) and provenance preservation (SI-36): the architecture cannot maximize both for the same presentation; per-purpose policy must decide.
- Draft-stage influence opportunity versus the cost of tracking churn: mapping now is cheap and reversible; building contracts on draft profiles now would create migration debt.
- SPICE's credential generality (any claims about any subject) versus the ATP need for narrow, purpose-bound assertions: generality increases the misuse surface (a credential minted for one purpose presented for another; EDGE-001 purpose binding must constrain it).

## Open Residuals

- OQ-AT-04-adjacent: which SPICE credential classes, if any, the platform will accept for identity-adjacent purposes is unresolved; needs stable profiles plus Task 9 evaluation.
- The SI-35 vs selective-disclosure tension has no architecture position yet; this is a candidate Class C question (new cross-platform semantic choice) and is **escalated** per WR-006 rather than resolved here: if audit must reconstruct presentations that holders may partially withhold, the platform needs an explicit rule before any credential profile is selected.
- Terminology collision (SPICE "verifier" vs ROLE-006 "Attestation Verifier") needs a naming decision before Task 10 to prevent role confusion in component mapping.

## Explicit Non-Decisions

- No adoption of SPICE or any SPICE profile; Task 9 gate and Task 10 selection decide. DD-004 stays open. No delegation semantics are granted to credential presentations. IN-010 status unchanged.

---

# 27.5 SCITT Role Mapping

## Requirements

| ID | Requirement | Traced to |
|---|---|---|
| REQ-27.5-1 | SCITT transparency must be mapped as registration and provenance evidence for the audit/evidence function; it must not be positioned as establishing the truth of registered statements | ROLE-015 (Audit / Evidence Function); EDGE-013 (Audit Evidence Contract); IN-010 layer 7 ("Transparency proves that a statement was registered or attributable; it does not establish that the statement itself is true") |
| REQ-27.5-2 | The transparency service must be treated as a distinct trust function with its own trust basis (service identity, registration policy, receipt verification material), subject to the IN-010 trust-anchor principle | SI-34 (correlated compromise); IN-010 trust-anchor principle (items 1-10 per anchor) |
| REQ-27.5-3 | SCITT receipts must be consumable as tamper-evidence for audit records without making the transparency service a universal trust root | ROLE-015 (authority explicitly not held: audit evidence does not authorize, establish identity, or create delegation); SI-34 |
| REQ-27.5-4 | Supply-chain evidence aspects must trace to the threat model: transparency addresses statement registration and provenance, not the underlying supply-chain compromise | IN-006 (threat model; supply-chain adversary; T-family supply-chain aspects); SI-33 (compromise dependencies traceable) |

## SCITT Concept Mapping

SCITT (Supply Chain Integrity, Transparency, and Trust): RFC 9943, Proposed Standard (published June 2026 per ecosystem tracking; IN-010 lists SCITT as "RFC 9943, Proposed Standard" and "Under architectural evaluation"; status preserved). Core concepts: Signed Statements (COSE-signed payloads from issuers), Transparency Service (applies a registration policy, appends statements to an append-only log), Receipts (COSE Merkle-tree proofs that a statement was registered).

| SCITT concept | ATP counterpart | Fit |
|---|---|---|
| **Signed Statement** (issuer-signed claim set, e.g., software provenance, attestation result registration) | EDGE-013 audit-evidence payload class (one producer type among many) | **Direct as evidence payload.** The statement is evidence; its evidentiary weight depends on the issuer's trust basis, not on registration. |
| **Transparency Service** (registration policy enforcement, append-only log operation) | ROLE-015 supporting service (integrity-protection function) | **Partial.** The service provides tamper-evidence and non-equivocation for the audit function, but ROLE-015's full scope (ingestion, correlation, retention, reconstruction, access governance) exceeds SCITT. SCITT is a component-class candidate for the integrity-protection sub-function, not a ROLE-015 implementation. |
| **Registration Policy** (what the service accepts for registration) | ROLE-015 ingestion policy; governance territory | **Partial.** Registration policy governs log admission, not statement truth. Confusing admission with endorsement would violate REQ-27.5-1. |
| **Receipt** (verifiable proof of registration, offline-verifiable) | EDGE-013 integrity metadata; audit-evidence freshness/provenance input | **Direct as tamper-evidence.** A receipt lets a relying function verify registration without trusting the service at verification time; this is a genuine trust-anchor-complexity reduction, but the receipt still chains to the service's verification material (REQ-27.5-2). |
| **Issuer** (signer of the statement) | EDGE-013 evidence producer (one of the listed producer classes) | **Direct.** Issuer trust basis is independent of the transparency service; see "does not prove" below. |

## What Transparency Proves and Does Not Prove

**Proves** (given the transparency service's verification material is trusted):
- That a specific signed statement was registered (non-fabrication of registration).
- When it was registered relative to the log's ordering (append-only sequencing; supports "was statement X registered before event Y" reasoning).
- That the service has not equivocated about the log's contents to different observers holding consistent receipts (non-equivocation within the receipt-verification model).
- Attribution of the statement to the key that signed it (issuer attribution, not issuer authority).

**Does not prove:**
- That the statement's claims are true (IN-010 layer 7 states this explicitly; a signed lie registers as faithfully as a signed truth).
- That the issuer was authorized to make the claim (issuer authority is a separate trust question; cf. REQ-27.4-2's issuer/delegator distinction).
- That the statement is complete (absence of a statement proves nothing; the log is append-only, not exhaustive).
- That the transparency service's registration policy was wise (policy governance is separate; a permissive policy admits junk transparently).
- That downstream consumers interpreted the statement correctly (T3-06 attestation overreach applies to transparent statements exactly as to opaque ones).

## Supply-Chain Evidence Aspects (IN-006)

The threat model includes supply-chain adversaries (influencing software, provenance, configuration, keys, or deployment artifacts before runtime) and attestation/provenance evidence as affected targets. SCITT addresses the **provenance-recording** slice: it gives the audit function a tamper-evident, attributable record of what was claimed about an artifact and when. It does not address the underlying compromise (a compromised build pipeline produces compromised artifacts whose provenance statements register transparently). Under SI-33, compromise of the statement issuer invalidates conclusions drawn from its statements; the transparency log then becomes the record of what the compromised issuer claimed, which is forensically valuable but not exculpatory. Under SI-32, compromise of the transparency service itself is distinct from its unavailability and has different containment requirements (receipts already issued remain verifiable against the service's keys; new registrations are suspect).

## Scored Findings (Task 9 Lens)

Indicative only; not an eligibility determination; selection stays with Control Plane.

Layer 1 (key gates):
- TE-021 / TE-035 (SI-17): PASS for the architecture as mapped (SCITT claims registration, not identity/authority/authorization; the "does not prove" list above is the compliance evidence).
- TE-036-adjacent: the transparency service's own trust basis must be explicit; no disqualifier triggered at architecture level, but per TE-015 the trust-anchor dimension carries uncertainty until a concrete service profile is evaluated.

Rubric (assessed dimensions only):

| Dimension (weight) | Score | Evidence |
|---|---|---|
| Standards alignment (3) | 3 | RFC 9943, Proposed Standard; open specification. |
| Architecture-role coverage (6) | 2 | Covers the integrity-protection sub-function of ROLE-015; does not cover ingestion, correlation, retention governance, or reconstruction. |
| Auditability (5) | 3 | Append-only, attributable, receipt-verifiable records directly serve SI-35/SI-36 reconstructability for the registration slice. |
| Trust-anchor model (6) | 2 | Service verification material is an explicit anchor; full lifecycle (rotation, compromise response, multi-service trust) is deployment-defined. |
| Failure semantics (7) | 2 | Unavailability vs compromise distinction is analyzable (SI-32) but service-specific behavior is not in the RFC; per TE-015, partial uncertainty. |
| Cross-domain support (4) | 2 | Receipts are offline-verifiable across domains, which aids EDGE-015 evidence acceptance; issuer trust across domains still needs local policy. |

Indicative weighted subtotal over assessed dimensions: 66 of 132 (50 percent). Not a TE-012 eligibility figure; six of 22 dimensions assessed; no selection inference.

## Tradeoffs

- Transparency benefits (tamper-evidence, non-equivocation, offline-verifiable receipts, forensic value after issuer compromise) versus trust-anchor complexity: the transparency service is a new high-value target and a new anchor to govern (provisioning, rotation, revocation, compromise response per the IN-010 trust-anchor principle's ten items). SI-34 applies: co-locating the transparency service under the same administrative authority as the statement issuers must not be treated as an independent security boundary.
- Append-only strength (history cannot be rewritten, aligning with audit append-orientation in ROLE-015 section 192) versus the inability to correct: erroneous or compromised-issuer statements persist; correction is by superseding statement, which requires consumers to process supersession (EDGE-013 revocation/supersession semantics).
- Standard maturity (RFC-published) versus ecosystem youth: RFC 9943 is recent (June 2026); implementation and operational experience are limited, which affects the operational dimensions not scored here.

## Open Residuals

- OQ-AT-05-adjacent: how conflicting transparent statements (two issuers, contradictory claims about one artifact) are treated by relying functions is unresolved; transparency records the conflict faithfully but does not resolve it.
- Whether the platform operates its own transparency service, federates with external ones, or both, and the resulting anchor-governance model, is a Task 10 component-mapping question, not answered here.
- Receipt verification material distribution and rotation at platform scale is unspecified; EDGE-012-class governance needed before selection.

## Explicit Non-Decisions

- No adoption of SCITT; Task 9 gate and Task 10 selection decide. DD-004 stays open (SCITT is evidence infrastructure, not attestation implementation, but the decision is still the gate's). IN-010 status unchanged.

---

# 27.6 Attestation Verifier Trust Requirements

## Requirements

| ID | Requirement | Traced to |
|---|---|---|
| REQ-27.6-1 | Every verifier trusted by the platform must have an explicit trust basis covering: the verifier's own integrity, the appraisal policy it enforces, the reference values it compares against, the endorsements it accepts, and the freshness rules it applies | SI-18 (explicit list: evidence protection, verifier, appraisal policy, reference values, endorsements, freshness rules); ROLE-006 section 74 |
| REQ-27.6-2 | Cryptographic validity of evidence must never be treated as establishing the trustworthiness of the appraisal policy or reference data | SI-18 ("Cryptographically valid evidence does not automatically establish that appraisal policy or reference data is trustworthy"); IN-006 T3-03 (compromised verifier) |
| REQ-27.6-3 | The verifier must be independent from the attested runtime: it must not share fate with the thing it appraises, and combining verifier with attester administration must be analyzed as correlated compromise | SI-34; ROLE-006 sections 79-80 (co-location risks: shared administrator controlling evidence and appraisal); IN-006 T3-03 |
| REQ-27.6-4 | The verifier must preserve VALID ≠ INVALID ≠ UNKNOWN and emit explicit failure states; conflicting Attestation Results must receive explicit treatment, never silent resolution | ROLE-006 section 76; EDGE-004 section 67; SI-31; OQ-AT-05 |
| REQ-27.6-5 | Acceptance of external verifiers must be governed per operation: which operations may accept external verifiers, under what local acceptance policy, with purpose scoping per EDGE-015 | OQ-AT-04; EDGE-004 section 65 (local relying-function acceptance policy); EDGE-015 sections 248-249 |
| REQ-27.6-6 | Verifier compromise must be handled as compromise (SI-32), not as unavailability: results issued by a compromised verifier are suspect and trigger downstream conclusion analysis | SI-32; SI-33 (compromise of attestation verifier is a named example triggering downstream analysis); IN-006 T3-03 |

## Verifier Trust Basis (per SI-18)

A conforming attestation trust relationship must make each of the following explicit, with an identified authority and lifecycle:

1. **Evidence protection:** how evidence integrity and attester-key binding are assured in transit and at rest (EDGE-003 sections 47-48).
2. **Verifier identity and integrity:** how the verifier is identified, how its own integrity is assured, and how verifier key rotation and revocation work (ROLE-006 section 75).
3. **Appraisal policy:** the rules mapping evidence claims to conclusions, who authors and approves the policy, how policy versions are identified, and how policy change invalidates or supersedes prior results (EDGE-004 section 66: appraisal policy change; ROLE-006 section 77: audit records appraisal policy).
4. **Reference values:** who publishes them, how they are distributed and versioned, maximum acceptable staleness, and the recovery path when they change (EDGE-004 sections 63, 66; 27.7 below).
5. **Endorsements:** which endorsement authorities are accepted, how endorsement revocation is observed (EDGE-003 section 49).
6. **Freshness rules:** per 27.7; part of the trust basis, not an operational detail (SI-18 names freshness rules explicitly).

## Appraisal Policy Governance

Appraisal policy is a security-relevant trust-state change surface: changing what "acceptable" means changes every downstream conclusion without any key compromise. Therefore appraisal-policy changes require governed, attributable change control (SI-38), versioned policy identity in every Attestation Result (EDGE-004 section 64: appraisal-policy reference), and audit recording of the policy version used per appraisal (ROLE-006 section 77). A verifier that silently updates its appraisal policy is indistinguishable from a compromised verifier to its relying functions.

## Verifier Independence from the Attested Runtime

SI-34 forbids treating combined trust functions under one administrative authority as independent security boundaries. Applied to attestation:

- A verifier operated by the same administrator as the attested workload's platform shares a compromise path with the attester; appraisal by such a verifier provides defense-in-depth at most, not independent assurance. The architecture must record the shared path explicitly.
- ROLE-006 sections 79-80 name the concrete co-location risks: attestation result treated as authorization, shared administrator controlling evidence and appraisal, verifier compromise affecting multiple relying domains. Any candidate co-locating verifier with attester infrastructure, or verifier with relying/authorization functions, must carry these as documented risks with compensating controls, evaluated under TE-016 (they cannot be scored away).
- **Verifier Owner separation** (from the RATS mapping in 27.1): the authority that sets appraisal policy should be separable from the service that executes appraisal, so that a compromised execution environment cannot silently rewrite what it is asked to appraise.

## Conflicting Attestation Results (OQ-AT-05)

When two verifiers (or two appraisals) produce conflicting results about the same target:

1. The conflict itself is evidence and must be recorded (ROLE-015; EDGE-004 section 70 audit requirements).
2. No silent precedence: the relying function must apply an explicit conflict policy (e.g., most-restrictive-wins, quorum, defer-to-human, fail-closed for the operation's risk class). The policy is per-operation risk class (Task 6: failure behavior explicitly selected according to resource risk, SI-31).
3. A conflict between a fresh INVALID and a stale VALID must not resolve to the stale VALID (27.7: staleness bounds; Task 6 bounded-stale rules).
4. Suspected verifier compromise underlying a conflict triggers SI-32/SI-33 handling, not ordinary failure handling.

## External Verifiers (OQ-AT-04)

Which operations may accept external verifiers is a per-operation governance decision, not a platform default. Requirements for any operation that does:

- The external verifier's result arrives under EDGE-015 (cross-domain assertion) layered on EDGE-004: the result is still an Attestation Result, but acceptance additionally requires the EDGE-015 contract (producer, source domain, intended purpose, local accepting domain, validity; sections 245-249).
- Local acceptance policy (EDGE-004 section 65) must name the accepted external verifiers, the purposes for which each is accepted, and the freshness and revocation terms; acceptance for one purpose never implies acceptance for another (EDGE-015 section 248).
- The external verifier's trust basis (REQ-27.6-1 items 1-6) must be established to the same explicitness standard as a local verifier's; "external" is not a weaker tier, it is a differently-governed tier with explicit scope.
- Federation protocol choice for verifier-result exchange is DD-011 territory and stays open.

## Tradeoffs

- Explicit trust basis per verifier (six items above, each with lifecycle governance) versus operational burden: the rigor SI-18 demands multiplies with every verifier, which argues for few, well-governed verifiers rather than many ad hoc ones.
- Verifier independence (separate administration, separate failure fate) versus latency, cost, and availability: remote independent verifiers add round trips and a new availability dependency (Task 6: verifier unavailability needs explicit per-operation behavior).
- Most-restrictive conflict resolution (safe) versus availability (a single faulty verifier can deny service): the tradeoff is per-operation risk class, not platform-global.

## Open Residuals

- OQ-AT-04 (which operations may accept external verifiers) is **not answered** here: the requirement structure is specified, but the per-operation allowlist is a Control Plane governance decision requiring Task 5 authorization-context input.
- OQ-AT-05 (conflicting result handling) has requirement-level treatment above; the concrete conflict policies per operation risk class belong to Task 6 failure-semantics elaboration.
- Quantitative bounds (how many verifiers, which independence distance counts as "independent") need implementation evidence; not set here.

## Explicit Non-Decisions

- No verifier product, service, or protocol is selected or endorsed. No per-operation external-verifier allowlist is established. DD-004 and DD-011 stay open. Verifier trust requirements feed Task 7 verification design (per Task 8 section 51) and Task 9 attestation evaluation criteria; they do not pre-select any candidate.

---

# 27.7 Evidence Freshness and Replay Considerations

## Requirements

| ID | Requirement | Traced to |
|---|---|---|
| REQ-27.7-1 | Attestation Evidence must carry freshness bindings appropriate to its mechanism: nonce, challenge, timestamp, sequence, session binding, or maximum evidence age (EDGE-003 section 46); the relying contract must define which are required per purpose | EDGE-003 sections 46, 51, 52; SI-18 (freshness rules are part of the trust basis) |
| REQ-27.7-2 | Attestation Results must define evidence age, result issuance time, result validity period, and reference-value freshness (EDGE-004 section 63); results must not outlive the freshness of the evidence and reference values they were appraised against | EDGE-004 sections 63, 66; ROLE-006 section 75 |
| REQ-27.7-3 | Integrity verification and freshness verification are separate checks; both must be evidenced for time-sensitive inputs | Task 6 freshness model (section 459-491: "A system that verifies signatures but not ages has verified only half of what freshness requires"); SI-18 |
| REQ-27.7-4 | Freshness bounds are per input and per operation risk class: the same evidence may be fresh enough for a low-risk read and unacceptably stale for a trust-anchor change; one global timestamp is prohibited | Task 6 (AZ-013 refinement: distinct freshness required at minimum for identity, binding, delegation, attestation, policy, revocation, environmental context, and the decision itself); SI-31 |
| REQ-27.7-5 | Replay resistance: evidence and results must be bound to challenge/session/target/purpose so that captured artifacts cannot be replayed into a different session, against a different target, or for a different purpose | EDGE-003 sections 51-52 (replay/substitution analysis; binding requirements); EDGE-004 sections 68-69; IN-006 T3-02 (stale or replayed evidence) |
| REQ-27.7-6 | Relying functions must treat stale or replayed evidence per explicit local policy: reject, defer, or bounded-continue only where an explicit bounded-stale policy permits, with the staleness recorded so downstream systems are not misled | Task 6 (bounded-stale definition; FM-09 visibility principle applied to freshness); SI-31; EDGE-004 section 67 (no silent reinterpretation of unknown as acceptable) |
| REQ-27.7-7 | Trusted time is a trust dependency: when the time source is unavailable, per-resource-class policy governs whether decisions continue on local clock (with uncertainty bound), defer, or deny; unvalidated local-clock operation beyond the uncertainty bound is forbidden | Task 6 trusted-time dependency (FR-023 through FR-027); ROLE-006 section 74 (trusted time as trust dependency) |

## Freshness Properties: Evidence vs Result

**Attestation Evidence (EDGE-003)** freshness is about *when the measurement was taken and for which challenge*. Required properties per mechanism: a nonce or challenge binding the evidence to a specific appraisal request (prevents replay of old evidence into a new session); a timestamp or sequence establishing measurement recency; session binding where the evidence is consumed inside a session; and a maximum evidence age beyond which the evidence is stale regardless of signature validity. Evidence generated without a challenge (e.g., background-collected measurements) has weaker replay resistance and must carry explicit age bounds and a narrower set of acceptable purposes.

**Attestation Result (EDGE-004)** freshness is about *when the appraisal happened and how long the conclusion stands*. Required: evidence age at appraisal time, result issuance time, result validity period, and reference-value freshness at appraisal time. A result is only as fresh as the stalest of: the evidence, the reference values, and the appraisal policy version. Reference-value change (e.g., software update changing expected measurements) invalidates prior results appraised against the old values; the recovery path is re-attestation, and the invalidation must propagate to relying functions holding cached results (EDGE-004 section 66; ROLE-006 section 75: reference-value lifecycle).

## Replay-Resistance Requirements

Replay attacks against attestation take four shapes, each requiring a binding (EDGE-003 section 51; EDGE-004 section 68):

1. **Same evidence, new session:** defeated by challenge/nonce binding (the verifier issues an unpredictable challenge per appraisal; evidence bound to a different challenge is rejected).
2. **Same evidence, different target:** defeated by target binding (evidence bound to attester identity, workload, or platform identity; substitution across targets rejected). This is the "evidence from another runtime / another platform" case.
3. **Same result, different purpose:** defeated by purpose/audience binding in the result (EDGE-004 section 69: binding to relying function, session, transaction, protected action). A passport-model result presented for a purpose outside its validity scope is rejected.
4. **Same result, after policy or reference-value change:** defeated by policy-version and reference-value-version binding in the result plus invalidation propagation (EDGE-004 section 66).

Bearer-style artifacts (notably JWT-SVIDs in 27.3, and any bearer presentation token) have inherently weaker replay resistance: possession equals presentability within the validity window. For such artifacts the architecture compensates with short lifetimes, audience restriction, and single-purpose scoping, and records the residual risk explicitly rather than assuming challenge-response strength they do not have.

## What Relying Functions Must Do with Stale or Replayed Evidence

Per Task 6 failure semantics and SI-31, the behavior is explicit and per operation risk class; there is no platform-global fail-open or fail-closed:

- **Stale evidence** (exceeds the freshness bound): the relying function must reject, defer, or continue under an explicit bounded-stale policy. Bounded continuation requires the policy to define the bound, the permitted operations, and the recording obligation: which input was stale, its age at decision time, and the bound applied (Task 6 FM-09 visibility). High-risk operations require fresh validation; bounded-stale is never the default.
- **Replayed evidence** (valid signature, wrong challenge/session/target/purpose): reject. Replay detection failure is a verification failure, not a freshness judgment call.
- **Evidence of unknown freshness** (no trustworthy time, missing timestamp): treated as UNKNOWN under EDGE-004 section 67; must not be silently reinterpreted as acceptable. Per REQ-27.7-7, if the time source itself is unavailable, the per-resource-class clock policy applies.
- **Missing or unverifiable evidence:** "must not be treated as valid Evidence" (EDGE-003 section 50); attester unavailability is not by itself proof of compromise (same section), so the response is degraded-mode handling per Task 6, not compromise handling per SI-32.

## Freshness by Operation Risk Class

Consistent with Task 6 (FR-018 through FR-022 freshness threshold model; AZ-013 input-specific freshness):

- **Bootstrap and trust-anchor operations** (highest risk): fresh challenge-response evidence required; no bounded-stale continuation; reference values must be current; failure to obtain fresh evidence defers the operation.
- **Authorization decisions on protected actions:** per-input freshness bounds (identity, binding, delegation, attestation, policy, revocation, context, decision each carry their own bound); bounded-stale permitted only where explicitly allowed for the resource class, with recording.
- **Low-risk reads and telemetry:** longer bounds permissible; still explicit, still recorded when exceeded.
- **Audit recording:** freshness of the *recorded event time* matters (trusted time dependency); late-arriving evidence is recorded with its event time and receipt time distinguished, never backdated silently.

## Consistency with Task 6 Failure Semantics

This section is consistent with, and does not redefine, the Task 6 failure-degraded-mode-recovery matrix:

- Failure states VALID / STALE / UNKNOWN-style handling follows the Task 6 dependency-state model (valid, stale, unknown) and the explicit per-resource-class behavior selection SI-31 requires.
- The prohibition on collapsing all freshness into one request timestamp, the integrity/freshness separation, the bounded-stale recording rule, and the trusted-time unavailability rule are Task 6 requirements restated as attestation-specific obligations, not new requirements.
- Attestation verification failure maps to the Task 6 failure records FR-007 (attestation verification failure: FM-05, FM-06); freshness-threshold and trusted-time behavior maps to FR-018 through FR-032 (FM-06). No FM identifier is redefined here.

## Tradeoffs

- Freshness strictness (short bounds, mandatory challenge-response) versus availability and latency: strict freshness makes the verifier and time source availability-critical; relaxed freshness widens the replay window. The tradeoff is settled per operation risk class, not globally.
- Challenge-response replay resistance versus protocol complexity: interactive freshness requires verifier reachability at evidence-generation time, which conflicts with offline or store-and-forward evidence flows; those flows accept weaker freshness and narrower purposes.
- Short-lived artifacts (natural replay containment) versus issuance load and clock-sensitivity: short TTLs amplify dependence on trusted time (REQ-27.7-7) and on issuance availability.

## Open Residuals

- OQ-AT-03-adjacent: concrete freshness bounds (maximum evidence ages, result validity periods) are **not set** in this return; they are per-operation parameters for Control Plane / Task 6 elaboration with implementation evidence.
- How reference-value invalidation propagates to relying functions holding cached results at platform scale (push vs pull, maximum lag) is unresolved; Task 6 cached-state semantics (FR-028 through FR-032) govern, but attestation-specific propagation bounds are open.
- Nonce/challenge entropy and verifier-challenge lifecycle requirements are mechanism-specific and deferred to Task 9 candidate evaluation.

## Explicit Non-Decisions

- No freshness bound values are set; no replay-resistance mechanism is selected; no trusted-time implementation is chosen. DD-004 stays open. Task 6 remains the authoritative source for failure semantics; this section adds no new failure requirement.

---

# Cross-Question Traceability Summary

| Question | Standards / subjects | Primary roles | Primary edges | Key invariants | Scored finding (indicative, not eligibility) |
|---|---|---|---|---|---|
| 27.1 | RATS (RFC 9334), EAT (RFC 9711) | ROLE-005, ROLE-006, ROLE-007 | EDGE-003, EDGE-004 | SI-17, SI-18, SI-31, SI-34 | 60/124 over 7 dims |
| 27.2 | WIMSE (IETF drafts) | ROLE-002 aspects, ROLE-003-adjacent | EDGE-001, EDGE-015 | SI-02, SI-08, SI-09, SI-10 | 50/124 over 6 dims |
| 27.3 | SPIFFE (spec), SPIRE (implementation) | ROLE-002, ROLE-003 | EDGE-001, EDGE-012 | SI-01, SI-02, SI-17 | 84/148 over 9 dims |
| 27.4 | SPICE (IETF drafts) | ROLE-003, ROLE-004 | EDGE-001 | SI-01, SI-19, SI-35 | 42/136 over 6 dims |
| 27.5 | SCITT (RFC 9943) | ROLE-015 | EDGE-013 | SI-32, SI-33, SI-34 | 66/132 over 6 dims |
| 27.6 | Verifier trust requirements | ROLE-006 | EDGE-004, EDGE-015 | SI-18, SI-31, SI-32, SI-33, SI-34 | Requirements only |
| 27.7 | Freshness and replay | ROLE-006, ROLE-007 | EDGE-003, EDGE-004 | SI-18, SI-31 | Requirements only |

All scored findings are Research Finding state per TE-053/TE-054. None constitutes a Candidate Technology (TE-055 not satisfied: constraints, disqualifiers, full rubric, and question sets are not completely evaluated for any candidate). No TE-012 eligibility determination is made. No selection, ranking, or endorsement is expressed or implied.

---

# Escalations

One escalation is raised per WR-006 (question requiring a Class C architecture decision):

- **SI-35 vs selective disclosure (27.4):** if the platform adopts credential-presentation patterns with selective disclosure, and audit must reconstruct actor/provenance evidence that holders may withhold, the platform needs an explicit architecture rule deciding which prevails per purpose before any credential profile is selected. This is a new cross-platform semantic choice, not a derived requirement. Escalated to Control Plane; not resolved here.

No other Class C or Class D questions were resolved locally. No conflict with accepted architecture was found; where standards were silent or strained relative to accepted architecture (RATS owner roles, WIMSE delegation-adjacent drafts, SPICE delegation drafts), the accepted architecture governs and the gap is recorded as an open residual.

---

# Acceptance Self-Check (against Task 8, section 31)

- [x] All five standards have documented role mappings with partial-fit and gap analysis (27.1-27.5)
- [x] Verifier trust requirements are explicit and traceable (27.6)
- [x] Freshness and replay requirements are explicit and consistent with Task 6 (27.7)
- [x] Every mapping claim cites evidence (specification references with maturity notes) and carries the Research Finding evidence-state label
- [x] No standard has been adopted, endorsed, or recommended as the platform choice
- [x] Attestation remains bounded as evidence per SI-17 and SI-18 throughout (never identity, authority, or authorization)
- [x] No deferred decision has been silently closed (DD-004, DD-011 explicitly open; DD-002 noted open where touched)
- [x] IN-010 "under architectural evaluation" status preserved for all standards
- [x] Required output format per WR-004 present for each question: Requirements, Evidence, Tradeoffs, Open residuals, Explicit non-decisions
- [x] No production-readiness claims; no implementation claims
- [x] Every internal repo link verified to exist before writing (see verification record below)

---

# References

Internal (all verified to exist via `ls` before writing):

- `docs/sprints/sprint-02-task-08-specialist-work-packages.md` (package charter, sections 25-31)
- `docs/architecture/trust-standards-landscape.md` (IN-010; status preserved)
- `docs/sprints/sprint-02-task-09-technology-evaluation-framework.md` (evaluation lens: gates, disqualifiers, rubric)
- `docs/architecture/security-invariants.md` (SI-17, SI-18, SI-31, SI-32, SI-34)
- `docs/architecture/threat-model.md` (IN-006: threat families T3, T3-02, T3-03, T3-06; supply-chain adversary)
- `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md` (EDGE-003, EDGE-004, EDGE-013, EDGE-015)
- `docs/sprints/sprint-02-task-02-architecture-role-to-capability-model.md` (ROLE-003, ROLE-004, ROLE-005, ROLE-006, ROLE-007, ROLE-015)
- `docs/sprints/sprint-02-task-06-failure-degraded-mode-recovery-matrix.md` (Task 6: freshness model FR-018-FR-032, FM-06, bounded-stale, trusted time)
- `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md` (ADR-0002)
- `docs/adr/0003-function-scoped-trust-domains-and-cross-domain-trust.md` (ADR-0003)
- `docs/adr/0005-explicit-bounded-delegated-authority.md` (ADR-0005)
- `docs/adr/0006-security-invariants-as-architecture-constraints.md` (ADR-0006)
- `docs/architecture/delegated-authority.md`
- `docs/sprints/sprint-02-task-10-component-mapping-and-selection-gate.md` (integration target for residuals)

External (specification references; maturity as of research date 2026-10-06):

- RATS architecture: RFC 9334 (Informational, January 2023); roles Attester, Verifier, Relying Party, Endorser, Reference Value Provider; passport and background-check models.
- EAT: RFC 9711 (Proposed Standard); attestation-oriented claims representation. EAR: IETF draft stage.
- WIMSE: IETF working group; draft-ietf-wimse-arch, draft-ietf-wimse-identifier, draft-ietf-wimse-workload-creds (WIT/WIC), draft-ietf-wimse-wpt, draft-ietf-wimse-http-signature, draft-ietf-wimse-mutual-tls; all Internet-Draft stage, no RFCs.
- SPIFFE: published open workload-identity specification (CNCF); trust domains, trust bundles, SPIFFE IDs, X.509/JWT SVIDs, attestation-based issuance, federation.
- SPIRE: CNCF open-source implementation of SPIFFE (server/agent, attestation plugins, registration entries); implementation characteristics kept distinct from specification requirements throughout.
- SPICE: IETF working group (Secure Patterns for Internet CrEdentials); active; program of work includes architecture, SD-CWT, metadata/capability discovery; Internet-Draft stage, no RFCs.
- SCITT: RFC 9943 (Proposed Standard, June 2026); Signed Statements, Transparency Service, registration policy, receipts.

---

*End of WP-002 return. Submitted to Control Plane for semantic review per WR-008. No commit performed (per task instruction: do not commit).*
