# Decision-Service Demo

A bounded, synthetic demonstration of the Sprint 2 authorization, enforcement,
failure, and evidence contracts. This is a lab instrument, not a production
system: all identities, keys, grants, and evidence are synthetic and labeled
not-for-production. Nothing here is a production identity, delegation, policy,
attestation, or key-management system.

## What it demonstrates

A single-process decision service with LC-shaped components: synthetic
workload identity issuance (SPIFFE-ID-shaped strings, a namespace-shape model
only, not an adoption of SPIFFE), bounded delegation grants with structured
authority provenance, an authorization decision function returning signed
`PERMIT` / `DENY` / `INDETERMINATE` decisions, an enforcement stub, and an
append-only hash-chained evidence ledger correlating decisions to enforcement
outcomes.

Requirement IDs exercised (Task 5 contract, Task 6 failure matrix):

- Authorization: AZ-001, AZ-002, AZ-003, AZ-004, AZ-005, AZ-006, AZ-008,
  AZ-011, AZ-012, AZ-013, AZ-015, AZ-016, AZ-017, AZ-018, AZ-019, AZ-020,
  AZ-021, AZ-022
- Enforcement: ENF-001, ENF-002, ENF-003, ENF-006, ENF-007, ENF-008, ENF-010,
  ENF-012
- Controls: CTL-001, CTL-002, CTL-003, CTL-004, CTL-005, CTL-006, CTL-007,
  CTL-008, CTL-009, CTL-010, CTL-011, CTL-012
- Failure: FR-007 (attestation failure), FR-011/FR-012 (delegation and
  revocation failure), FR-024 (trusted-time testability via the injected
  clock)

## Scenarios (CLI walkthrough)

1. `happy-path`: valid identity, valid grant, fresh attestation; `PERMIT`
   reaches the protected operation with correlated evidence.
2. `identity-no-authority`: valid identity, no grant; `DENY` (identity is not
   authorization).
3. `revoked-delegation`: grant revoked in the seeded revocation list; `DENY`.
4. `stale-attestation`: attestation older than the declared synthetic
   threshold; `INDETERMINATE`, never permit, protected operation not invoked.
5. `tampered-decision`: decision claims altered after signing; enforcement
   rejects (source validation).
6. `replayed-decision`: valid decision presented for a different request;
   enforcement rejects (request binding).
7. `bypass-attempt`: direct access with no decision; blocked and evidenced.

## How to run

Standard library only, no dependencies, no network calls. Run from this
directory.

```sh
# Full test suite
python3 -m unittest discover -s tests -v

# Walkthrough with evidence bundle (seeded, deterministic)
python3 cli.py walkthrough --seed 7

# One scenario
python3 cli.py scenario stale-attestation --seed 7

# Rerun-twice determinism check (evidence must be byte-identical)
python3 cli.py repro --seed 7

# Re-verify a stored evidence file
python3 cli.py verify evidence/walkthrough-seed-7/evidence.jsonl

# Fast iteration mode (wall clock, random IDs; barred from evidence)
python3 cli.py walkthrough --seed 7 --fast
```

Every scenario pre-declares its asserted checks mapped to requirement IDs; the
runner executes, asserts, and prints a per-scenario verdict. A scenario that
passes on log inspection but has no assertion does not count as demonstration.

Determinism: seeded identifiers, an injected manual clock, per-run fresh keys,
and per-run state wipe. The same seed run twice produces byte-identical
`evidence.jsonl`. A different seed produces identical outcome patterns with
only identifiers differing.

## Known limits

- HMAC-signed artifacts model integrity and binding only; no asymmetric
  issuance, key distribution, or compromise semantics (fidelity gap, out of
  scope per WP-004).
- Attestation is a freshness/timestamp stub. `LAB_SYNTHETIC_FRESHNESS_SECONDS`
  is a declared lab constant (LAB-CONFIG, non-normative), not an architecture
  answer to the open freshness-threshold questions.
- Bootstrap binding rules are synthetic placeholders labeled `PLACEHOLDER
  (WP-001)`; open WP-001 questions stay open.
- Revocation uses a seeded list; disconnected revocation state (unknown vs not
  revoked under outage) is out of scope.
- The ledger's independence is modeled (hash chain plus independent
  verification), not real process independence.
- Single process: network-partition failure classes are out of reach.
- Out of scope: hardware-backed attestation, real PKI, cross-domain
  federation, recovery and emergency-authority slices.
