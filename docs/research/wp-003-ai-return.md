# WP-003 Specialist Return: Trust Platform, AI

**Package:** WP-003 (Trust Platform: AI)
**Charter:** `docs/sprints/sprint-02-task-08-specialist-work-packages.md`, sections 32-38
**Author:** AI specialist (WP-003)
**Date:** 2026-10-06
**Evidence state of this return:** Research Finding

This document answers the five routed questions from section 33 of the WP-003 charter
in the WR-004 format required by section 36. It is a research finding for architecture
evaluation. It selects no technology, endorses no vendor or protocol, closes no deferred
decision, and makes no claim about implementation, enforcement, or deployment readiness.
It answers what the trust architecture requires of AI-agent participation; mechanism
selection belongs to the Task 9 evaluation gate and the Task 10 component gate.

## Input traceability used by this return

| Binding class (section 35) | Identifiers |
|---|---|
| Accepted artifacts | IN-002 (principal model), IN-005 (delegated authority), IN-009 (system context) |
| ADRs | ADR-0002, ADR-0005 |
| Invariants | SI-02, SI-20, SI-21, SI-25, SI-26, SI-29, SI-35, SI-36 |
| Roles | ROLE-001 (Logical Principal), ROLE-002 (Runtime / Workload), ROLE-007 (Relying Function), ROLE-008, ROLE-009 (Delegator), ROLE-010 (Delegation Issuer), ROLE-012 (Authorization Decision Function), ROLE-015 (Audit / Evidence Function) |
| Interface contracts | EDGE-002 (principal-to-runtime binding), EDGE-005 (delegation grant), EDGE-006 (delegation validation result), EDGE-008 (authorization context), EDGE-013 (audit evidence) |
| Authorization baseline | AZ-003 (authority provenance), AZ-009 (host authority is not actor authority), AZ-010 (tool availability is not delegation), AZ-011 (attestation influences policy, does not replace authorization) |
| Deferred decisions | DD-003 (AI-agent identity protocol), kept open |

Repository references below were verified to exist before writing (2026-10-06):

- `docs/sprints/sprint-02-task-08-specialist-work-packages.md`
- `docs/architecture/principal-model.md`
- `docs/architecture/delegated-authority.md`
- `docs/adr/0002-distinguish-logical-actor-and-workload-identity.md`
- `docs/adr/0005-explicit-bounded-delegated-authority.md`
- `docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md`
- `docs/architecture/security-invariants.md`
- `docs/sprints/sprint-02-task-03-trust-interface-and-evidence-contracts.md`

Web grounding (evaluation context only, not selections): public material on agent
governance practice consistently separates agent identity from tool access control,
enforces per-tool authorization at a mediation layer distinct from the agent runtime,
and narrows authority down delegation chains (for example, multi-hop agent delegation
that preserves the originating principal while nesting each actor, and explicit
spawn-chain provenance). These patterns inform what evidence can look like; none is
selected or endorsed here.

Semantic guardrails applied throughout, per charter section 37: tool access is never
treated as delegated authority (SI-26), host authority is never treated as agent
authority (SI-25), and ambient deputy authority is never treated as requester
authority (SI-29).

---

## 34.1 Logical AI-agent principal model implications

### Requirements

**REQ-34.1.1 (agent as ROLE-001):** An AI agent that must be distinguishable for a
security decision, delegation relationship, or accountable action instantiates
ROLE-001 (Logical Principal) per the principal model: an entity whose independently
distinguishable identity is relevant to security, not merely an entity capable of
causing behavior.
Traces to: IN-002 (principal-model sections 3.3, 3.6, 4.4), ROLE-001, ADR-0002.

**REQ-34.1.2 (distinct from runtime):** The agent principal must be distinguishable
from its hosting workload principal whenever security-relevant properties diverge:
authority, delegator, authorization policy, lifecycle, revocation boundary, audit
attribution, logical ownership, concurrent actor population, or accountability
requirements. Workload authentication alone must not establish which logical agent
caused an action (ADR-0002 Scenario A; PI-02).
Traces to: ADR-0002, SI-02, IN-002 (sections 7, 9), EDGE-002, ROLE-001, ROLE-002.

**REQ-34.1.3 (identity boundary test):** Before assigning an agent an independent
principal identity, the design must apply the Identity Boundary Test: independent
security-relevant action, authority that can differ from the host, materially
different lifecycle, independent audit attribution need, independently applicable
policy, and independent compromise or revocation need. Consistent negative answers
mean identity separation adds complexity without security value (principal-model
section 17; ADR-0002 Alternative D).
Traces to: IN-002 (section 17), ADR-0002, SI-02.

**REQ-34.1.4 (lifecycle):** The agent logical-principal lifecycle (creation,
activation, suspension, retirement, revocation, deletion) must be governed
independently of the agent instance lifecycle (started, active, terminated) and of
the credential lifecycle (issued, valid, expired, revoked, rotated). Credential
expiration is not principal retirement; instance termination is not principal
deletion (principal-model sections 7, 16; PI-03).
Traces to: IN-002 (sections 7, 16), SI-02, ADR-0002.

**REQ-34.1.5 (identity relations):** Agent principal identity must remain
distinguishable from model identity (which model implementation produced the
behavior), deployment identity (which release or configuration is executing), and
operator identity (who operates or owns the agent). These answer different
questions and must not be collapsed into one identifier; a model upgrade, a
deployment change, or an operator change must not silently redefine the logical
agent principal, and none of them establishes authority by itself.
Traces to: IN-002 (sections 6, 11: identity semantics independent of credential
and mechanism), ADR-0002, SI-02.

**REQ-34.1.6 (principal sharing):** Multiple agents may share one logical-principal
identity only when all security-relevant properties coincide: same authority
envelope, same delegator relationships, same lifecycle, same applicable policy,
same revocation boundary, and same audit attribution requirements. Agents must not
share a principal when any of these diverge (for example, one finance agent and
one research agent in one runtime must remain distinct). Sharing must be an
explicit, governed identity decision, not an implementation default.
Traces to: IN-002 (sections 9.1, 9.2, 18 Scenario A), ADR-0002, SI-02.

**REQ-34.1.7 (agent versus tool):** A tool available to an agent is modeled first as
a capability or protected resource, not as an independent principal (PI-05). Tool
identity and tool-implementation workload identity must not be assumed identical
(principal-model section 3.12).
Traces to: IN-002 (sections 3.12, 5), ADR-0002, SI-26.

**REQ-34.1.8 (delegator as role):** Delegator is a role a principal performs, not a
principal category and not an identity type. Human, workload, infrastructure, or
logical-software principals may all perform the delegator role; the role must be
recorded separately from the principal's identity (PI-04).
Traces to: IN-002 (sections 3.10, 5), IN-005 (delegated-authority.md section 7),
ADR-0005.

**REQ-34.1.9 (identity validity independent of authority):** Agent principal
identity validity must remain conceptually and operationally independent of
delegated-authority validity (PI-07). An agent whose delegation expired remains an
identified principal; it simply has no authority for the requested action.
Traces to: IN-002 (PI-07), IN-005 (sections 4, 5), ADR-0005.

### Evidence

What demonstrates a candidate agent design satisfies these requirements:

- For REQ-34.1.1/34.1.2/34.1.3: a documented identity-boundary analysis for each
  agent class showing the six test answers, with at least one class justified as
  an independent principal and at least one class justified as collapsed into the
  workload, plus a negative test: authenticate the hosting workload, then attempt
  to assert an unbound logical agent, and require rejection (the SI-02 negative
  test in `docs/architecture/security-invariants.md`, section 45).
- For REQ-34.1.4: a lifecycle state diagram where credential rotation, instance
  restart, and delegation expiry are each shown leaving the logical-principal
  state unchanged, with tests exercising each transition.
- For REQ-34.1.5: an identifier registry schema in which agent principal ID,
  model version, deployment ID, and operator ID occupy separate fields with no
  derivation rule between them; a test that changes the model version while
  holding the agent principal constant and confirms authorization context still
  resolves the same logical principal.
- For REQ-34.1.6: a sharing decision record per shared-principal deployment
  showing coincidence of all six properties, plus a negative test where two
  agents with different authority envelopes attempt to share a principal and are
  required to be distinguished.
- For REQ-34.1.7: a tool catalog in which tools carry capability/resource
  records and no principal records unless a security requirement is documented;
  a test showing that tool-implementation workload authentication does not
  substitute for agent principal identity.
- For REQ-34.1.9: a test with valid agent identity and expired delegation that
  results in denial with a recorded reason distinguishing "identity valid" from
  "authority absent" (principal-model Scenario F).

### Tradeoffs

- **Attribution granularity versus performance:** per-agent principal identity
  with per-instance correlation enables precise actor attribution but adds
  identity lifecycle, policy evaluation, and evidence volume cost per action.
  Collapsing agents into workload identity is cheaper but loses actor
  distinction exactly when multiple agents share a runtime, which is the case
  where confusion is most dangerous. Granularity should follow security
  consequence, not be uniform (ADR-0002 audit implication).
- **Identity-model richness versus implementation cost:** separating model,
  deployment, operator, and agent identities produces a clean attribution story
  but multiplies the binding assertions the platform must issue, validate, and
  audit. Collapsing them is operationally simpler but makes model upgrades and
  operator changes security-relevant identity events by accident.
- **Sharing economy versus blast radius:** shared principals reduce policy and
  lifecycle overhead, but a shared principal becomes a shared compromise and
  revocation boundary; revoking one agent's authority path then requires care
  not to disturb the others, and audit cannot separate their actions.

### Open residuals

- Canonical namespace for logical AI-agent identity is unresolved
  (principal-model open question 1); without it, cross-domain agent reference
  remains ambiguous. Evidence needed: namespace proposal with collision,
  scoping, and federation analysis.
- Who is authorized to create an agent principal, and what binding evidence
  suffices at creation (principal-model open questions 3 and 4).
- Whether an agent instance may execute simultaneously in multiple workloads
  (principal-model open question 5), which determines whether binding is
  one-to-one or one-to-many.
- Whether every agent instance requires a unique identifier (principal-model
  open question 6); needed to size attribution evidence.
- Global stability versus trust-domain scoping of agent identifiers
  (principal-model open question 2).

### Explicit non-decisions

- No agent framework, model, or identity protocol is selected; DD-003
  (AI-agent identity protocol) stays open and passes to the Task 9 gate.
- No credential or token format (X.509, JWT, SPIFFE/SVID, WIMSE, OAuth, OIDC,
  DIDs, verifiable credentials) is selected or endorsed.
- No canonical namespace syntax is chosen.
- No decision on SPIFFE/SPIRE, WIMSE, or any workload-identity technology.

---

## 34.2 Agent-to-runtime attribution requirements

### Requirements

**REQ-34.2.1 (binding assertion):** Every security-relevant agent action must be
attributable through an explicit principal-to-runtime binding assertion per
EDGE-002 identifying: the logical agent principal, the runtime or workload, the
binding authority, the binding type, start time, end time or revocation semantics,
intended purpose, and trust or administrative domain scope.
Traces to: EDGE-002 (sections 26-28), SI-02, ADR-0002, ROLE-001, ROLE-002, IN-002
(section 14).

**REQ-34.2.2 (attribution versus authentication):** Attribution of an action to a
logical agent through a runtime must be distinguishable from authentication of the
runtime itself. Runtime authentication answers "which workload executed this";
the binding answers "which logical agent acted through it". One must not be
derived from the other without an explicit binding mechanism (EDGE-002 section
33; ADR-0002 risk: actor-to-runtime spoofing).
Traces to: EDGE-002 (sections 31, 33), SI-02, ADR-0002, IN-002 (section 6).

**REQ-34.2.3 (migration):** When a logical agent migrates across runtimes, the
agent's logical identity persists while the binding assertion must be
re-established against the new runtime. Attribution survives migration because it
is anchored to the logical principal, not to the previous runtime (ADR-0002
Scenario H; principal-model section 9.3). A binding scoped to the old runtime
must not be reused to attribute actions on the new runtime.
Traces to: EDGE-002 (sections 29, 32), ADR-0002, IN-002 (sections 9.3, 18
Scenario H).

**REQ-34.2.4 (in-flight authority on runtime change):** Delegated authority held by
the agent is independent of runtime binding (REQ-34.1.9), so a runtime change does
not by itself expire or renew the agent's delegation. However, actions taken after
migration require a valid binding to the new runtime before authorization; the
authorization function must treat "valid delegation, stale or missing binding"
as an incomplete context, not as an authorized action. Binding freshness must be
visible to consumers per EDGE-002 section 29.
Traces to: EDGE-002 (sections 29, 33), SI-02, IN-005 (section 5: authority
validity independent), AZ-009, AZ-013 (freshness per input).

**REQ-34.2.5 (binding producer trust):** The binding assertion must identify the
binding authority, and that authority may differ from the identity authority,
runtime identity issuer, delegator, or authorization decision function
(EDGE-002 section 31). No producer is authoritative merely by being able to
report a binding (EDGE-002 section 24). Local policy determines whether the
binding is recognized (AZ-004).
Traces to: EDGE-002 (sections 24, 31), AZ-004, SI-07.

**REQ-34.2.6 (failure behavior):** Unknown or stale binding state must not silently
establish logical-principal identity from runtime identity. If binding cannot be
validated, the authorization context must carry the uncertainty explicitly
(EDGE-008 section 135: no normalized "trusted=true"), and degraded behavior must
follow the explicit failure policy (SI-31), not expand authority.
Traces to: EDGE-002 (section 33), EDGE-008 (section 135), SI-31, SI-02.

**REQ-34.2.7 (multi-layer context):** Security-relevant events must preserve the
multi-layer principal context (logical actor, actor instance, hosting workload,
workload instance, execution environment, delegator) where those layers differ
materially, with attribution depth proportional to the action's security
consequence (principal-model sections 6, 14, 15; PI-06).
Traces to: IN-002 (sections 6, 14, 15), SI-35, EDGE-008, EDGE-013.

### Evidence

What demonstrates a candidate agent design satisfies these requirements:

- For REQ-34.2.1/34.2.2: a binding assertion schema containing all EDGE-002
  scope fields, plus a spoofing test: a compromised or misbehaving runtime
  attempts to attribute an action to an agent it does not host; the binding
  validation must reject it (ADR-0002 risk mitigation; EDGE-002 section 34
  replay/substitution analysis).
- For REQ-34.2.3: a migration test in which an agent moves runtimes mid-task;
  audit reconstruction before and after must show one continuous logical
  principal with two distinct binding assertions, and an action attempted with
  the old binding after migration must fail attribution.
- For REQ-34.2.4: a test with valid delegation and deliberately stale binding
  that results in denial or explicit deferral with the reason recorded as
  binding-state uncertainty, never as silent authorization.
- For REQ-34.2.6: a binding-service-outage test confirming that authorization
  follows the explicit degraded-mode policy and does not fall back to
  workload identity as agent identity.
- For REQ-34.2.7: a reconstruction drill: given one agent action identifier,
  recover the full multi-layer context (actor, instance, workload, environment,
  delegator) from audit evidence within a defined time bound.

### Tradeoffs

- **Attribution granularity versus performance:** full multi-layer context on
  every action gives complete reconstruction but multiplies per-action evidence
  size and binding-validation latency. Proportional depth (lightweight context
  for low-consequence actions, full context for high-consequence ones) reduces
  cost but requires a defensible consequence classification and risks
  misclassification at the boundary.
- **Binding freshness versus availability:** short binding lifetimes and
  aggressive freshness checks reduce the window for stale-binding abuse but
  make authorization dependent on binding-service availability; longer
  lifetimes are resilient but widen the spoofing window. This is the same
  tension as delegation lifetime versus revocation freshness (EDGE-002
  section 29; EDGE-005 section 80).
- **Explicit binding authority versus bootstrap simplicity:** requiring a
  distinct, trustworthy binding authority adds an issuance and validation path
  beyond runtime authentication; letting the runtime self-assert the binding is
  simpler but collapses the exact distinction SI-02 exists to preserve.

### Open residuals

- What constitutes sufficient evidence to bind an agent to its runtime
  (principal-model open question 4); mechanism design is explicitly deferred.
- Binding freshness thresholds: how quickly runtime reassignment, migration,
  and revocation must become visible to consumers (EDGE-002 section 29
  requires the definition but no values are set).
- Whether an agent instance may span multiple workloads concurrently
  (principal-model open question 5), which determines binding cardinality.
- How binding invalidation propagates when a runtime is terminated abruptly
  versus gracefully (EDGE-002 section 32 lists the triggers, not the
  propagation semantics).

### Explicit non-decisions

- No binding mechanism is selected (attested binding, signed assignment,
  orchestrator-issued binding, or otherwise); DD-003 stays open.
- No trust anchor technology for binding assertions is chosen.
- No freshness values or timeouts are set.
- No agent orchestration framework or migration protocol is selected.

---

## 34.3 Tool invocation versus delegated authority

### Requirements

**REQ-34.3.1 (three distinct relations):** The architecture must keep three
relations explicitly distinct and independently testable for every tool
interaction: (a) tool availability (the tool is exposed or advertised to the
agent), (b) tool invocation capability (the agent can technically call it),
and (c) delegated authority (a governed grant permitting the agent to exercise
authority through the tool for a purpose). The required inequality is:

```text
Tool Availability
        !=
Tool Invocation Capability
        !=
Delegated Authority
```

Availability or invocability must never be treated as a delegation grant.
Traces to: SI-26, AZ-010, ADR-0005 (Tool Invocation), IN-005 (section 48:
tool invocation is not delegation), DA-16.

**REQ-34.3.2 (authority basis per purpose):** For each tool invocation, the
authorization context must establish the authority basis for that purpose:
principal identity, runtime identity, principal-to-runtime binding, resource
(the tool as protected resource), action, purpose, delegated authority with
provenance, applicable policy, revocation state, and attestation input where
policy requires it. Purpose is a first-class authorization input, not a session
attribute carried over implicitly.
Traces to: AZ-010, AZ-003, AZ-011, EDGE-008, EDGE-005 (section 80: purpose in
grant scope), IN-005 (sections 17-21: scope, resource/action/audience/purpose
binding).

**REQ-34.3.3 (tool-scoped authority distinct from access):** Tool-scoped authority
must be represented as a bounded grant (resource, action, audience, purpose,
constraints, validity, per EDGE-005), evaluated by the authorization decision
function (ROLE-012), and must not be conflated with an access-control list entry,
a tool allowlist, or a capability flag on the agent. An allowlist answers "which
tools are visible"; the grant answers "under what authority may this tool be
used for this purpose".
Traces to: SI-26, AZ-010, EDGE-005, EDGE-006, ROLE-012, IN-005 (section 13:
delegation grant contents).

**REQ-34.3.4 (purpose binding enforcement):** A tool authorized for one purpose
must not serve another without a new authorization evaluation. Purpose binding
requires: purpose recorded in the delegation grant or authorization context;
per-invocation purpose evaluation against the requested action; and rejection or
re-authorization when the declared purpose does not match. Purpose drift across
a multi-step workflow (for example, a read tool authorized for invoice
reconciliation later used for payroll exfiltration) must be detectable at the
authorization layer, not merely discouraged by agent instructions.
Traces to: IN-005 (section 21: purpose binding), EDGE-005 (section 80),
AZ-010, SI-26, AZ-003.

**REQ-34.3.5 (no ambient tool authority):** The agent must not acquire tool
authority from ambient context: neither from the hosting workload's broader
permissions (SI-25; delegated-authority.md Scenario E), nor from a deputy's
authority substituting for the requester's (SI-29), nor from attestation of the
runtime (AZ-011: attestation may influence policy, never replaces authorization
or creates delegated authority).
Traces to: SI-25, SI-29, AZ-009, AZ-011, IN-005 (sections 43-45, 54).

**REQ-34.3.6 (agent-to-agent invocation is not redelegation):** One agent invoking
another agent (or a tool that fronts another agent) does not by itself create a
delegation relationship. If the invoked agent is to act under authority derived
from the caller, redelegation must be explicitly permitted in the caller's grant
and must satisfy SI-20 (non-amplification) and SI-21 (deny by default); the
downstream grant must preserve or narrow scope unless an independent authority
source adds authority. Invocation capability is not delegation authority
(delegated-authority.md section 47).
Traces to: SI-20, SI-21, SI-26, ADR-0005 (Redelegation), IN-005 (sections
27-30, 47), DA-06, DA-16.

**REQ-34.3.7 (agent-to-tool chains):** When a tool independently authenticates to
downstream systems, the tool's implementation workload may itself be a principal
with its own authority (principal-model section 3.12). Two architectures must
remain distinguishable: (a) the agent exercises its own authority through the
tool as a capability, preserving agent attribution end to end; (b) the tool acts
as another principal under separately delegated authority, requiring its own
grant chain. They must not be conflated (delegated-authority.md section 48),
and architecture (b) inherits all redelegation constraints of REQ-34.3.6.
Traces to: SI-26, IN-002 (section 3.12), IN-005 (section 48), DA-16, EDGE-005,
EDGE-006.

**REQ-34.3.8 (confused-deputy resistance):** Where requester-specific authority
matters, the authorization context must preserve the requesting principal and
its delegated authority alongside the tool's own authority, so a powerful tool
cannot substitute its authority for authority the requester lacks (SI-29;
delegated-authority.md sections 49-50). The tool's authority must not be treated
as the requester's authority.
Traces to: SI-29, AZ-010, IN-005 (sections 49-50), EDGE-008.

### Evidence

What demonstrates a candidate agent design satisfies these requirements:

- For REQ-34.3.1: a matrix test for one tool across the three relations,
  showing each combination resolved independently: available but not invocable;
  invocable but not authorized for purpose X; authorized for purpose X but not
  purpose Y. In particular, a negative test: an agent with technical ability to
  call a tool but no delegation grant covering the purpose must be denied, with
  the denial reason distinguishing "no authority" from "tool unavailable".
- For REQ-34.3.2/34.3.4: a purpose-drift test: authorize a tool for purpose P1,
  then invoke it in a workflow step whose declared purpose is P2; require fresh
  authorization evaluation and denial (or explicit re-authorization) rather
  than silent carryover.
- For REQ-34.3.3: an inspection showing tool allowlists and delegation grants
  stored and evaluated as separate records, with a test that modifying the
  allowlist does not change any grant's scope and vice versa.
- For REQ-34.3.5: a negative test placing an agent with narrow delegation
  inside a workload with broad infrastructure authority and confirming the
  agent cannot exercise the workload's authority through any tool
  (delegated-authority.md Scenario E; SI-25).
- For REQ-34.3.6: a redelegation test: agent A with no redelegation permission
  invokes agent B with an instruction to perform a privileged action; B must
  not obtain valid derived authority from A's invocation alone
  (delegated-authority.md Scenario D). A positive counterpart: with explicit
  redelegation permission and a narrowed grant, the chain validates.
- For REQ-34.3.7: architecture documentation for each tool stating which of
  the two models applies, with a test that a tool acting as an independent
  principal presents its own grant chain rather than borrowing the agent's.
- For REQ-34.3.8: a confused-deputy test: a requester without authority asks a
  powerful tool to act; the tool must not substitute its own authority, and
  the authorization context must show both principals preserved.

### Tradeoffs

- **Purpose-binding strictness versus agent utility:** strict per-invocation
  purpose evaluation with narrow grants minimizes purpose drift but forces
  agents to obtain fresh authority for each workflow phase, which can stall
  long multi-step tasks and push designers toward over-broad purposes that
  defeat the binding. Looser purpose scoping keeps agents fluid but widens
  the confused-deputy and exfiltration surface. The architecture requires the
  strict end of this spectrum where the resource risk justifies it; the exact
  strictness per tool class is policy, not architecture.
- **Attribution granularity versus performance:** evaluating a full
  authorization context (identity, binding, delegation chain, purpose, policy,
  revocation) per tool call is the only way to keep the three relations
  distinct at decision time, but it adds latency to every tool invocation in
  an agentic loop that may make hundreds of calls. Caching decisions risks
  stale authority; not caching risks unusable agents. Freshness must remain
  input-specific (AZ-013) even under caching.
- **Audit completeness versus evidence volume:** recording the full
  authority basis per tool invocation enables reconstruction but generates
  large evidence volumes for chatty agents; sampling or summarization reduces
  volume but may lose the exact grant evaluated at a contested step.

### Open residuals

- Which tools and actions require purpose binding at all (delegated-authority.md
  open question 5: "Which actions require purpose binding?"); the architecture
  requires the mechanism and the per-purpose evaluation, not the classification.
- Which workload permissions must never become ambient agent authority
  (delegated-authority.md open question 16); needed to set the default-deny
  boundary for REQ-34.3.5.
- Maximum delegation depth for agent chains (delegated-authority.md open
  question 6); affects how deep agent-to-agent and agent-to-tool chains may go.
- How transaction-bound authority grants should be for tool invocations
  (delegated-authority.md open question 18); relevant to per-call versus
  per-workflow grant granularity.
- When an agent may legitimately use host-workload authority at all
  (delegated-authority.md open question 15); the default is never, but the
  explicit-exception conditions are undefined.

### Explicit non-decisions

- No agent framework, tool protocol, or function-calling convention is
  selected or endorsed (no MCP, no A2A, no framework-specific tool schema).
- No policy language or authorization engine is selected (no Cedar, OPA,
  Rego, or Zanzibar-style system).
- No delegation token or capability-token format is selected (no OAuth token
  exchange, JWT, macaroons, or GNAP).
- No per-tool purpose taxonomy is defined.
- DD-003 stays open.

---

## 34.4 Agent authority provenance

### Requirements

**REQ-34.4.1 (provenance fields):** Every authority an agent holds or presents
must carry provenance sufficient to identify: authority source, delegator,
delegate, delegation issuer where applicable, grant identifier, scope (resource,
action, audience, purpose, environment), constraints, validity window, revocation
state, redelegation rights and remaining depth, and the policy reference under
which it is recognized. Provenance must distinguish authority source from
delegator from delegation issuer (SI-23).
Traces to: AZ-003, SI-36, EDGE-005 (section 77), EDGE-006 (sections 96, 104),
SI-23, ADR-0005 (Authority Provenance).

**REQ-34.4.2 (no flattening):** The authorization context presented to the
authorization decision function (ROLE-012) must not flatten provenance into an
unqualified role or permission string (AZ-003: not "role = admin"). The full
provenance chain must reach the decision function so local policy can evaluate
scope, constraints, and redelegation validity itself.
Traces to: AZ-003, EDGE-008 (sections 128, 132), SI-36, ADR-0005.

**REQ-34.4.3 (multi-step preservation):** Across multi-step agent workflows,
provenance must be maintained per step: each step's authority must be
independently valid, attributable to its grant, and non-amplifying relative to
the previous step (SI-20). A workflow correlation identifier must link steps
without merging their authority; step N+1 may not inherit step N's authority
beyond what its own grant permits. Chain truncation or extension must be
detectable (EDGE-006 section 102).
Traces to: SI-20, SI-36, AZ-003, EDGE-006 (sections 100-103), IN-005
(sections 24, 25, 30), ADR-0005 (Non-Amplification, Delegation Chain).

**REQ-34.4.4 (validation versus authority):** Delegation validation (EDGE-006)
produces evidence about bounded authority; it does not create authority. A
validated delegation presented by an agent is an input to authorization, not a
decision. The validation function must not be treated as an authority source
merely because it judged a delegation acceptable (EDGE-006 section 105).
Traces to: EDGE-006 (sections 91, 95, 105), SI-19, ADR-0005.

**REQ-34.4.5 (revocation-aware provenance):** Provenance must carry revocation
state for each link: grant, delegator authority, authority source, issuer, and
signing key (EDGE-006 section 100). A still-valid artifact must not preserve
authority after its sole underlying basis is withdrawn; derived authority must
be re-evaluated (SI-22). Downstream grants must be re-evaluated when an
upstream authority basis changes (delegated-authority.md section 34; ADR-0005
Downstream Revocation).
Traces to: SI-22, SI-36, EDGE-006 (section 100), AZ-003, IN-005 (sections
32-35), ADR-0005.

**REQ-34.4.6 (freshness per input):** Provenance inputs must retain distinct
freshness: delegation freshness, revocation freshness, policy freshness, and
identity freshness must not be collapsed into one request timestamp (AZ-013).
An authorization decision made on stale revocation state must be recognizable
as such in the context.
Traces to: AZ-013, EDGE-008 (section 131), EDGE-006 (section 97).

**REQ-34.4.7 (composition explicit):** Where an agent holds authority from
multiple independent sources, the sources must remain attributable and must not
be implicitly unioned (SI-24). Local policy determines composition (union,
intersection, most restrictive, priority, or resource-specific), and the chosen
composition must be recorded as part of the decision context.
Traces to: SI-24, IN-005 (sections 25, 26), AZ-004, DA-17, EDGE-008.

**REQ-34.4.8 (issuer not source):** The system that issues or materializes a
delegation artifact (ROLE-010) must not be assumed to be the delegator or the
authority source (SI-23). The issuer may represent only grants permitted by the
governing authority and policy; issuance capability must not become
authority-definition capability (delegated-authority.md section 13).
Traces to: SI-23, EDGE-005 (section 88), IN-005 (section 13), ROLE-010,
ADR-0005.

### Evidence

What demonstrates a candidate agent design satisfies these requirements:

- For REQ-34.4.1/34.4.2: a provenance schema containing every listed field,
  plus a test in which the authorization context is inspected before the
  decision: any context that arrives as a flattened role string must be
  rejected or marked insufficient, and a valid context must show
  source/delegator/issuer as three separate values.
- For REQ-34.4.3: a three-step workflow test where step 2 holds a narrowed
  grant and step 3 attempts an action outside it; require denial at step 3
  with the chain showing non-amplification held. A chain-tampering test:
  present a delegation chain with a middle link removed; require rejection
  (EDGE-006 section 102: chain truncation).
- For REQ-34.4.4: a test showing that a successful EDGE-006 validation result
  alone, presented without the authorization decision function's own policy
  evaluation, does not permit the action.
- For REQ-34.4.5: a revocation test: revoke the delegator's underlying
  authority while the delegation artifact remains cryptographically valid;
  subsequent authorization attempts must fail, and audit must show the
  re-evaluation (SI-22 negative test). A downstream test: revoke a mid-chain
  grant and confirm dependent downstream grants are re-evaluated, not silently
  honored.
- For REQ-34.4.6: a staleness test: present delegation validated against a
  revocation state older than the policy's freshness bound; the context must
  expose the staleness and the decision must follow the explicit degraded
  policy.
- For REQ-34.4.7: a two-source test where grants from two delegators overlap;
  the decision record must name the composition rule applied and show both
  sources preserved, not merged.
- For REQ-34.4.8: an issuer-compromise or issuer-misbehavior test: an artifact
  minted by the issuer outside the delegator's permitted scope must fail
  validation because the delegator's delegable authority bounds it
  (GrantedAuthority subset of DelegableAuthority).

### Tradeoffs

- **Attribution granularity versus performance:** carrying full provenance
  (chain, constraints, per-link revocation state) on every authorization
  request gives the decision function everything it needs but enlarges
  contexts and validation work, especially for deep agent chains. References
  (grant IDs resolved against a directory) shrink the context but add lookup
  latency and a new availability dependency.
- **Provenance strictness versus workflow fluidity:** requiring every
  workflow step to present independently valid, non-amplifying authority
  makes long agent plans brittle when any mid-chain grant nears expiry; agents
  must re-acquire authority mid-task. Broader, longer-lived grants smooth the
  workflow but widen the window for misuse and complicate revocation.
- **Audit completeness versus evidence volume:** preserving full historical
  provenance per action (SI-36 requires interpretability even after
  revocation) means evidence accumulates delegation chains indefinitely;
  summarization saves space but risks losing the exact chain a future dispute
  needs.

### Open residuals

- Which authority representations the platform will support
  (delegated-authority.md open question 1); the field list is defined, the
  encoding is not.
- Bearer versus proof-of-possession binding for agent-held delegation
  artifacts (delegated-authority.md open question 2); affects theft and replay
  analysis but not the provenance field requirements.
- How authority composition should work when several delegators contribute
  (delegated-authority.md open question 9); the architecture requires an
  explicit rule per domain, not the rule itself.
- How revocation propagates across delegation chains and to disconnected
  systems (delegated-authority.md open questions 12 and 13).
- How policy changes affect previously issued grants (delegated-authority.md
  open question 23).
- Which delegation events require independently verifiable audit evidence
  (delegated-authority.md open question 14).

### Explicit non-decisions

- No delegation representation, token format, or protocol is selected
  (no JWT, macaroons, OAuth token exchange, GNAP, or WIMSE delegation
  mechanism).
- No bearer versus proof-of-possession choice is made.
- No revocation protocol or distribution mechanism is selected.
- No composition rule (union, intersection, most restrictive) is chosen as
  universal.
- DD-003 stays open; nothing here selects an agent identity protocol.

---

## 34.5 Agent-specific audit reconstruction requirements

### Requirements

**REQ-34.5.1 (per-action evidence):** Each security-relevant agent action must
produce audit evidence sufficient to identify: the logical agent principal, the
actor instance, the hosting runtime and workload instance, the execution
environment where material, the tool or capability invoked with its arguments,
the authority basis relied upon (grant reference with provenance), the
authorization decision and its inputs, the enforcement outcome, and the event
time. Actor, runtime, and delegator must not be collapsed into one ambiguous
identity where they differ (SI-35).
Traces to: SI-35, SI-36, EDGE-013 (section 215), EDGE-008, AZ-003, IN-002
(section 15: attribution chain), IN-005 (section 63: delegation audit
evidence), ROLE-015.

**REQ-34.5.2 (step-to-effect reconstruction):** Audit evidence must support
reconstructing which agent step caused a downstream effect: workflow
correlation identifiers must link the originating request through each agent
step, tool invocation, and resulting state change, preserving the delegation
chain at each hop. Given a downstream effect, an investigator must be able to
walk back to the originating agent step, its authority basis, and its
delegator (SI-36; delegated-authority.md Scenario A).
Traces to: SI-36, EDGE-013, IN-005 (section 63), IN-002 (section 15),
ROLE-015.

**REQ-34.5.3 (historical interpretability):** Historical authority evidence must
remain interpretable even after identities, grants, or keys are revoked or
expire (SI-36; EDGE-013 section 219: later invalidation is additional evidence
affecting interpretation, not erasure). Revocation must not delete the
evidence needed to judge whether a past action was authorized at the time.
Traces to: SI-36, EDGE-013 (section 219), IN-005 (section 36: identity versus
authority revocation).

**REQ-34.5.4 (retention and integrity):** Agent evidence requires defined
retention (what is kept, for how long, under whose governance) and integrity
protection appropriate to its use as accountability evidence: reliable event
time, ordering where material, tamper-evidence (for example hash chaining or
append-only protection), and identified producer trust basis. No specific
mechanism is selected (EDGE-013 sections 216-218).
Traces to: EDGE-013 (sections 216-218), SI-35, SI-36, ROLE-015.

**REQ-34.5.5 (degraded-state recording):** When an agent acts under degraded or
uncertain authority state (unavailable revocation, unverifiable binding,
unknown delegation state, attestation indeterminate), the evidence must record:
what was unknown, which degraded-mode policy applied, what decision resulted,
and which inputs carried stale or uncertain freshness. Uncertainty must be
explicit in the record, never normalized away (EDGE-013 section 220; EDGE-008
section 135; SI-31).
Traces to: SI-31, EDGE-013 (section 220), EDGE-008 (section 135), AZ-013,
SI-32 (compromise versus unavailability distinguished).

**REQ-34.5.6 (failure and recovery evidence):** Audit evidence must cover
security failure states: delegation evaluation failures, binding failures,
authorization denials with reasons, enforcement outcomes, and recovery actions,
each attributable to the relevant principal and authority state
(EDGE-013 section 213: assertion types include security failure state and
recovery action; delegated-authority.md section 59 lists delegation failure
causes).
Traces to: EDGE-013 (section 213), IN-005 (section 59), SI-31, SI-32.

**REQ-34.5.7 (no silent authority expansion in evidence gaps):** Gaps in
evidence (buffer full, delivery delayed, ordering lost) must follow defined
recovery and reconciliation behavior (EDGE-013 section 220) and must not be
treated as proof that actions were authorized. Missing evidence is an explicit
unknown, not an implicit permit.
Traces to: EDGE-013 (section 220), SI-31.

### Evidence

What demonstrates a candidate agent design satisfies these requirements:

- For REQ-34.5.1: a per-action evidence schema test: emit one action and
  verify every required field is present and that actor, runtime, and
  delegator appear as separate values; a negative test collapses two layers
  and requires the evidence validator to flag it insufficient (SI-35).
- For REQ-34.5.2: a reconstruction drill: inject a downstream effect
  (for example, a modified record) and require the investigator, using only
  audit evidence, to identify the originating agent step, the tool and
  arguments used, the grant relied upon, and the delegator, within a defined
  time bound.
- For REQ-34.5.3: a revocation-then-investigate test: revoke the agent's
  grant and the delegator's authority, then reconstruct a past action and
  confirm the evidence still shows the full chain and the validity state as
  of the action time.
- For REQ-34.5.4: an integrity test: tamper with a stored evidence record
  and require detection; a retention test: verify the retention policy states
  duration, governance, and deletion behavior explicitly.
- For REQ-34.5.5: a degraded-mode test: make revocation state unavailable,
  let the agent act under the explicit degraded policy, and verify the
  evidence records the unknown input, the policy applied, and the decision,
  with no field claiming certainty that was not established.
- For REQ-34.5.6/34.5.7: an evidence-outage test (audit service unavailable,
  buffer full): verify defined buffering, reconciliation on recovery, and
  that no action taken during the gap is later treated as authorized by
  default.

### Tradeoffs

- **Audit completeness versus evidence volume:** full per-action evidence
  with complete provenance chains is the only basis for reliable
  reconstruction, but agentic loops are chatty; per-invocation records for
  hundreds of tool calls per task create large, expensive evidence stores.
  Aggregation or sampling reduces volume but breaks step-to-effect
  reconstruction exactly for the routine steps where subtle misuse hides.
  Tiered evidence (full detail for state-changing or high-risk actions,
  summarized for read-only low-risk ones) is the natural compromise, but the
  tiering rule itself becomes a security decision.
- **Integrity strength versus cost:** cryptographic tamper-evidence
  (hash chaining, signatures, trusted time) makes historical evidence
  trustworthy but adds per-event computation and key management; weaker
  integrity is cheaper but leaves accountability evidence disputable.
- **Retention length versus liability and cost:** longer retention supports
  late-discovered compromise analysis (SI-33: compromise of a material
  authority triggers analysis of dependent conclusions) but increases storage
  cost and the sensitivity of the retained corpus itself.

### Open residuals

- Which delegation and binding events require independently verifiable audit
  evidence (delegated-authority.md open question 14).
- Retention durations, governance, and deletion behavior for agent evidence;
  the architecture requires these to be defined, not what the values are.
- How invariant compliance is represented in validation records
  (security-invariants.md open question 12).
- Which invariant violations should automatically stop execution versus
  trigger revocation (security-invariants.md open questions 10 and 11),
  which determines what the audit record must capture at violation time.
- Evidence reconciliation semantics after outage (EDGE-013 section 220
  requires them defined; no values set).

### Explicit non-decisions

- No audit technology, log format, or storage system is selected.
- No integrity mechanism is selected (no hash-chain scheme, signature
  scheme, or trusted-time source endorsed).
- No retention durations are set.
- No agent framework or observability product is selected or endorsed.
- DD-003 stays open.

---

## Global explicit non-decisions (Task 9 gate)

Per charter section 37 and WR-010, this return makes no implementation or
technology selection of any kind. In particular it does not select or endorse:

- Any agent framework, agent protocol, or multi-agent orchestration product
  (including but not limited to MCP, A2A, LangChain, AutoGen, CrewAI, or any
  vendor agent platform).
- Any model, model provider, or model identity scheme.
- Any identity, credential, or token technology (SPIFFE/SPIRE, WIMSE, X.509,
  JWT, OAuth/OIDC, DIDs, verifiable credentials, OAuth token exchange,
  macaroons, GNAP).
- Any policy language, authorization engine, or delegation protocol.
- Any audit, logging, or evidence-storage technology.
- Any attestation technology or verifier.

DD-003 (AI-agent identity protocol) remains open and is the designated
vehicle for the protocol decision at the Task 9 evaluation gate. No finding
in this return may be read as closing it.

## Integration notes for Task 9 and Task 10

- Task 9 (`docs/sprints/sprint-02-task-09-technology-evaluation-framework.md`)
  should evaluate candidate technologies against the requirements above,
  especially: (a) whether the candidate preserves the tool
  availability/invocation/authority distinction (SI-26, AZ-010) at its
  enforcement point; (b) whether it carries unflattened provenance to the
  decision function (AZ-003); (c) whether its agent identity can satisfy
  REQ-34.1.2 through REQ-34.1.6 without collapsing into workload identity;
  (d) whether its audit output supports the REQ-34.5.2 reconstruction drill.
- Task 10
  (`docs/sprints/sprint-02-task-10-component-mapping-and-selection-gate.md`)
  should treat each REQ as mappable to a component responsibility and each
  Evidence item as a future acceptance test; the Open residuals above are
  inputs to component requirements, not blockers to mapping.
- Task 7 (invariant verification matrix) can lift the Evidence negative
  tests directly: SI-02 unbound-agent rejection, SI-20 amplification
  rejection, SI-21 default-deny redelegation, SI-22 post-revocation
  artifact rejection, SI-25 workload-authority non-inheritance, SI-26
  invocation-without-grant denial, SI-29 deputy substitution rejection,
  SI-31 degraded-mode explicitness.

## Acceptance self-check (charter section 38)

- All five routed questions have documented requirements, evidence,
  tradeoffs, residuals, and non-decisions: yes (sections 34.1-34.5 above).
- Every requirement traces to an accepted input from section 35: yes, each
  REQ carries an explicit trace list limited to section-35 identifiers.
- Tool invocation and delegated authority remain explicitly distinct and
  testable: yes (REQ-34.3.1 through REQ-34.3.8 with matrix and negative
  tests).
- Agent authority provenance requirements are explicit enough for Task 7
  test design: yes (REQ-34.4.1 through REQ-34.4.8 with field lists and
  named negative tests).
- Audit reconstruction requirements cover the full agent action chain: yes
  (REQ-34.5.1 through REQ-34.5.7, including degraded state).
- No agent framework or protocol selected or endorsed: yes (global
  non-decisions; vendor-neutral throughout).
- No deferred decision silently closed: DD-003 remains open; all other
  deferred items are listed as open residuals, not decisions.

---

*End of WP-003 return. Evidence state: Research Finding.*
