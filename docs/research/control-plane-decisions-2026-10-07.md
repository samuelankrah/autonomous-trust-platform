# Control Plane Decisions — Phase A Completion

**Date:** 2026-10-07
**Authority:** Trust Platform — Control Plane
**Scope:** Acceptance of specialist work-package returns (`WP-001` through `WP-004`);
evaluation posture; Phase B authorization.

## D-001: Work-package returns accepted

The returns in `docs/research/wp-001-identity-return.md`,
`docs/research/wp-002-attestation-standards-return.md`,
`docs/research/wp-003-ai-return.md`, and
`docs/research/wp-004-implementation-feasibility-return.md` are accepted as
Research Findings.

Basis: each return carries the five WR-004 sections (requirements traced to
accepted inputs; evidence; tradeoffs; open residuals with missing evidence
identified; explicit non-decisions), is labeled Research Finding, is
vendor-neutral, selects no technology, and keeps deferred decisions open.
Acceptance review found no defects; WP-002's Class C escalation was raised
through the correct procedure (see D-003).

The Task 8 tracking table is updated to Accepted for all four packages.

## D-002: No technology selected

WP-002's scored findings (SPIFFE, RATS/EAT, WIMSE, SCITT, SPICE through the
Task 9 lens) are accepted as indicative findings, explicitly not TE-012
eligibility determinations. No candidate is selected, standardized, or described
as preferred for any platform role.

Rationale: selection without a deployment target would be theater. The Task 9
framework has now been exercised end to end on real candidates and shown usable;
formal selections are recorded if and when components are built for deployment.

## D-003: ADR-0009 reserved — audit reconstructability vs selective disclosure

WP-002 escalated a Class C question: SI-35 (security-relevant actions must
preserve principal context; audit must be reconstructable) is in tension with
selective disclosure in credential presentations. If audit must reconstruct
presentations that holders may partially withhold, the platform needs an explicit
architecture rule.

Decision: `ADR-0009` is reserved for this rule. It must be decided before any
credential profile is selected. No credential profile is selected at this time,
so no further action is required now.

## D-004: Formal evaluations authorized

Candidate-technology evaluations through the Task 9 evaluation framework against
the Task 10 gate are authorized to begin whenever a deployment target exists.
The Task 10 blocking-question register (sections 27 and 28) governs what must be
answered or risk-accepted first.

## D-005: Phase B authorized — demonstration decision service

The WP-004 feasibility return is accepted. Phase B (demonstration build) is
authorized with the following binding constraints from WP-004:

- The demo lives in `labs/decision-service/` and does not modify the Sprint 2
  lab, which remains the unchanged evidence for Task 5.
- Wall-clock time is forbidden in decision paths; the demo uses an injectable
  clock (FR-024 testability).
- Per-run fresh keys, seeded identifiers, and per-run state wipe; rerun-twice
  byte-identical evidence required.
- "Demonstrated" means pre-declared asserted checks mapped to requirement IDs
  (AZ/ENF/CTL/FR), never log narration.
- A `--fast` development mode is explicitly barred from producing evidence.
- Out of scope: hardware-backed attestation, real PKI, cross-domain federation.
  Open WP-001 bootstrap questions remain synthetic placeholders, labeled as such.

## Evidence state

These decisions are Control Plane records. The work-package returns remain
Research Findings. Nothing in this document selects a technology, claims
implementation beyond the existing bounded lab, or asserts production readiness.
