# Scenario Contract v1

Contract version: `scenario-contract-v1`

## Purpose

This contract freezes the observable behavior of the decision-service lab
(`labs/decision-service`) into generated fixtures, so a second
implementation of the same scenarios (the planned browser workshop build)
can be checked against the Python reference engine mechanically instead of
by eyeball comparison.

The reference engine is the Python lab. The fixtures in
`docs/workshop/fixtures/` are its recorded behavior at two seeds (7 and
11) for all seven scenarios declared in `labs/decision-service/scenarios.py`:

1. `happy-path`
2. `identity-no-authority`
3. `revoked-delegation`
4. `stale-attestation`
5. `tampered-decision`
6. `replayed-decision`
7. `bypass-attempt`

Each scenario runs on a fresh seeded service, with the same `open_run` and
`close_run` bookkeeping the CLI uses (`labs/decision-service/cli.py`), so a
fixture describes one isolated scenario run, not a position inside a
walkthrough sequence.

## Fixture files

One file per scenario per seed, plus an index:

- `docs/workshop/fixtures/<scenario>-seed-<seed>.json`, for example
  `happy-path-seed-7.json`
- `docs/workshop/fixtures/index.json`, listing every fixture with its
  scenario, seed, file name, verdict, and the contract version

That is 7 scenarios times 2 seeds: 14 fixture files plus the index.

## Fixture schema, field by field

Top level:

- `contract_version` (string): always `scenario-contract-v1` in this
  generation of fixtures.
- `scenario` (string): the scenario name, exactly as keyed in
  `scenarios.SCENARIOS`.
- `seed` (integer): the seed the service was constructed with.
- `verdict` (string): `PASS` when every asserted check passed, otherwise
  `FAIL`.
- `requirement_ids` (array of strings): the requirement IDs the scenario
  declares before running, in declaration order.
- `checks` (array): the scenario's asserted checks as executed by the
  engine. Each entry has `check_id` (string), `requirement_ids` (array of
  strings), `passed` (boolean), and `detail` (string, the engine's own
  result description). These checks are the stable parity target: a change
  in this list means the scenario's demonstration changed, not just its
  data.
- `inputs` (object): the facts the scenario set up, as observed on the
  engine objects themselves (see below).
- `decision` (object or null): the first decision returned by the
  authorization decision function, or null when the scenario evaluates no
  decision (currently only `bypass-attempt`).
- `decisions` (array): every evaluated decision, in evaluation order.
  `decision` is `decisions[0]` when the array is non-empty.
- `enforcement` (object or null): the outcome of the last enforcement
  invocation, or null when nothing was enforced. For scenarios with one
  invocation this is the only outcome. For `replayed-decision` it is the
  replay rejection, which is the outcome the scenario exists to show.
- `enforcements` (array): every enforcement invocation, in order (see
  below).
- `evidence` (object): the ledger pattern the scenario produced (see
  below).

`inputs` fields:

- `principal`, `resource`, `action`, `workload_path` (strings): the
  scenario constants from `scenarios.py` (`PRINCIPAL`, `RESOURCE`,
  `ACTION`, `WORKLOAD_PATH`).
- `requests` (array): one entry per request the scenario created, in
  creation order, each with `request_id` (string) and `nonce` (string, or
  null for the decision-free bypass request).
- `identity` (object or null): the workload identity the scenario used,
  taken from the identity object's own claims: `spiffe_id`,
  `trust_domain`, `principal`, `issued_at`, `expires_at`, `key_id`, plus
  `signature_present` (boolean). Null when no identity was issued
  (`bypass-attempt`).
- `grant` (object or null): the delegation grant the scenario used, taken
  from the grant object's own claims: `grant_id`, `source`, `delegator`,
  `issuer`, `delegate`, `workload`, `resource`, `action`, `constraints`,
  `issued_at`, `expires_at`, `revocation_basis`, `key_id`, plus
  `provenance` (the structured authority provenance mapping returned by
  the grant object's `provenance()` method) and `signature_present`.
  Null when no grant was issued (`identity-no-authority`,
  `bypass-attempt`).
- `attestation` (object or null): the attestation evidence the scenario
  used, from the evidence object's own claims: `evidence_id`, `workload`,
  `issued_at`, `expires_at`, `claims`, `key_id`, plus
  `signature_present`. Null when no attestation was issued
  (`bypass-attempt`).
- `revoked_grant_ids` (array of strings): grant IDs passed to the
  revocation store's `revoke` method during setup. Non-empty only in
  `revoked-delegation`.
- `clock_advances_seconds` (array of integers): every advance applied to
  the injected manual clock during the scenario, in order. Non-empty only
  in `stale-attestation` (a single 301 second advance).
- `direct_access` (object or null): for `bypass-attempt`, the `resource`,
  `action`, and `principal` passed to the enforcement point's
  `direct_access` method. Null in every other scenario.

Decision objects (in `decision`, `decisions`, and each enforcement entry's
`presented_decision`) carry the decision object's own claims:

- `decision_id`, `request_id` (strings)
- `state` (string): `PERMIT`, `DENY`, or `INDETERMINATE`
- `principal`, `workload`, `resource`, `action` (strings)
- `authority_provenance` (object or null): the structured provenance
  mapping (source, delegator, issuer, grant reference, scope, constraints,
  revocation basis), preserved as structure, never flattened to a role
  string. Null when the decision carries no authority.
- `policy_id`, `policy_version` (strings)
- `freshness` (object): per-input ages in seconds, keyed
  `identity_age_seconds`, `authority_age_seconds`,
  `attestation_age_seconds`; a value is null when that input was absent or
  never appraised.
- `validity_not_before`, `validity_not_after` (strings, ISO timestamps):
  the bounded validity window of the decision.
- `transaction_binding` (object): `request_id` and `nonce` the decision
  is bound to.
- `reason` (string): the engine's reason text for the decision.
- `key_id` (string): identifier of the signing key, never key material.
- `signature_present` (boolean): true when the object carries a
  signature. The signature value itself is never exported (see
  Determinism below).

`enforcements` entries:

- `via` (string): `enforce` for a decision presented to the enforcement
  point, `direct_access` for the decision-free bypass path.
- `request_id` (string), `nonce` (string or null): the request context
  the decision was presented under. In `replayed-decision` the second
  entry's request context differs from the decision's transaction
  binding, which is exactly what the fixture must show.
- `presented_decision` (object or null): the decision object as presented
  to enforcement, in the same shape as `decision`. In
  `tampered-decision` this differs from `decision`: its `resource` is the
  altered value, while `decision` records the decision as evaluated and
  signed. Null for `direct_access`.
- `outcome` (object): `outcome_id`, `decision_id` (null for bypass),
  `request_id`, `result` (one of `ALLOWED`, `DENY`,
  `DENY_INDETERMINATE`, `REJECTED`, `BYPASS_BLOCKED`), `reason`,
  `enforced_at`.
- `operation_result` (object or null): the protected operation's return
  value when it was invoked, null when it was not.

`evidence` fields:

- `event_types` (array of strings): the ordered ledger event types
  appended while the scenario function ran. Run bookkeeping events
  (`lab.run_started`, `lab.run_finished`) are excluded: they belong to
  the harness, not the decision trace.
- `events` (array): one entry per ledger record in the same order, each
  with `type` (string) and `fields` (array of strings): the sorted field
  names present on that record, including the base ledger fields
  (`event_id`, `seq`, `ts`, `type`, `request_id`, `prev_hash`,
  `record_hash`) and the type-specific fields required by the ledger
  schema in `labs/decision-service/ledger.py`. Field values are not
  exported, only field names, so the evidence pattern checks shape and
  order without depending on hash values.

Determinism note: fixtures never contain signature values, key material,
or ledger hash values. Service keys are generated fresh per run
(`service.py` calls `crypto.generate_key()`, which uses
`secrets.token_bytes`), so signatures differ between runs even at the
same seed. Everything a fixture does contain is a pure function of the
seed and the scenario: seeded identifiers, manual clock timestamps,
decision fields, and ledger shape. Regenerating therefore produces
byte-identical files, and the exporter writes JSON with sorted keys and
stable formatting to keep that property.

## Versioning rule

Fixtures are generated from the reference engine by the exporter, never
hand-authored and never hand-edited. A fixture file that disagrees with
the exporter output is a defect, not an edit.

Any change in engine behavior that alters a fixture (decision state or
reason, enforcement result or reason, evidence event types or field
names, asserted checks, or exported inputs) requires regenerating the
fixtures and bumping the contract version (`scenario-contract-v1` to
`scenario-contract-v2`, and so on) in the same change. The version string
lives in the exporter's `CONTRACT_VERSION` constant and is stamped into
every fixture and into `index.json`. An implementation claiming parity
must name the contract version it was checked against.

Editorial changes to this document that alter no fixture and no parity
rule do not require a version bump. Any change to the parity definition
below does.

## Parity definition

A future browser build reaches parity with this contract for a scenario
when, run at the same seed with the same scenario setup, its rendered
decision trace matches the fixture exactly on the compared surface:

- same decision state (`decision.state`), or no decision where the
  fixture has none,
- same decision reason string (`decision.reason`),
- same authority provenance structure on the decision,
- same enforcement result and reason, for every enforcement invocation,
  in order (including the first, legitimate use in `replayed-decision`
  and the altered presented decision in `tampered-decision`),
- same ordered evidence event types (`evidence.event_types`), and the
  same field names on each corresponding evidence event,
- same asserted checks, by `check_id` and requirement IDs, all passing.

Compared surface, stated plainly: decision state, decision reason,
provenance shape, enforcement outcomes, ordered evidence event types and
their field names, and the check list. Identifier values, timestamps,
and ages are compared against the fixture for the same seed, since the
reference makes them a deterministic function of the seed. Signature
values and hash values are outside the compared surface, for the
determinism reason given above: they depend on per-run synthetic keys
and were never part of the recorded behavior.

A mismatch on any compared element is a parity failure. There is no
partial parity per scenario: a scenario either matches its fixture or it
does not.

## How to regenerate

From the repository root:

```sh
python3 labs/decision-service/tools/export_fixtures.py
```

This rewrites all 14 fixtures and `index.json` under
`docs/workshop/fixtures/`. Options: `--seeds 7,11` selects the seed list,
`--out-dir DIR` redirects the output directory. To verify regeneration
is stable, copy the fixtures aside, run the command again, and diff the
two sets: they must be byte-identical. The exporter exits nonzero if any
scenario's checks fail, so a green run also confirms the reference engine
still passes its own assertions.

## Manipulability table

The workshop plan proposes manipulations a learner can apply to a
running scenario (revoke, age, tamper, replay, bypass, rotate, edit, and
others). A manipulation is supported only when the reference engine has
a real mechanism for it today. Each verdict below was checked against
the engine code, with the file and mechanism cited. Manipulations with
no engine mechanism are deferred: building them means extending the
reference engine first, regenerating fixtures, and bumping this
contract, in that order.

### Supported

| Manipulation | Scenario | Engine evidence |
| --- | --- | --- |
| Grant revocation | `revoked-delegation` | `delegation.py`: `RevocationStore` keeps a seeded set of revoked grant IDs; `revoke()` adds to it, and `DelegationValidator.validate()` consults `is_revoked()` before accepting a grant, failing with "grant revoked". The scenario calls `svc.revocation.revoke(grant.grant_id, rid)` between issuance and evaluation, and the decision is `DENY` with the revocation named in the reason. |
| Attestation aging | `stale-attestation` | `attestation.py`: `LAB_SYNTHETIC_FRESHNESS_SECONDS = 300` is the declared freshness threshold, and `AttestationVerifier.appraise()` returns `STALE` when the evidence age exceeds it. The scenario advances the injected manual clock (`clock.py`, `ManualClock.advance`) by 301 seconds after attestation issuance, so only the attestation input is stale; the decision is `INDETERMINATE`. |
| Decision tampering | `tampered-decision` | `enforcement.py`: `EnforcementPoint.enforce()` verifies the decision signature first (`crypto.verify` over the decision claims) and returns `REJECTED` with a reason naming the signature when verification fails. The scenario alters the signed decision with `dataclasses.replace(decision, resource="/admin/root")` after signing, which is precisely the alteration the signature check catches. |
| Decision replay | `replayed-decision` | `enforcement.py`: after the signature check, `enforce()` compares `decision.transaction_binding` against the presented `request_id` and `nonce` and returns `REJECTED` ("decision not bound to this request/nonce") on mismatch. The scenario enforces a valid decision once under its own request (allowed), then presents the same decision under a second request and nonce (rejected). |
| Bypass attempt | `bypass-attempt` | `enforcement.py`: the protected path exists only through `enforce()`, which requires a decision object. The alternate path, `EnforcementPoint.direct_access()`, appends a `resource.bypass_attempt` ledger event and records `BYPASS_BLOCKED` with a null decision ID. No decision, no operation, and the attempt is evidenced. |

### Not supported, deferred

| Manipulation | Why not, with engine evidence |
| --- | --- |
| Credential rotation | No rotation mechanism exists. `identity.py` has issuance and validation only (`IdentityIssuer.issue`, `IdentityValidator.validate`), and `crypto.py` has key generation, sign, verify, and digest only. A search of the lab's Python sources finds no rotation code at all. Keys are minted fresh per run in `service.py`, never rotated within a run, and identities are never re-issued under a new key mid-scenario. |
| Policy editing | Policy is a static input, not a runtime surface. `policy.py` loads `policy.json` once via `load_policy()` when the service is constructed (`service.py`), and the decision function only reads the resulting mapping (policy ID, version, the attestation requirement). No module exposes an edit, reload, or update operation. Changing `policy.json` on disk is a configuration change between runs, not a manipulation of a running scenario. |
| Trust-anchor change | The engine has no trust-anchor concept. No anchor store, anchor configuration, or anchor terminology appears in the lab's Python sources. Trust roots are the per-run synthetic keys generated in `service.py` (`crypto.generate_key()`, fresh every run, never persisted), and the identity trust domain is a module constant (`identity.py`, `TRUST_DOMAIN = "atp-demo"`). There is nothing to swap, re-anchor, or distrust at runtime. |
| Dependency outage | The engine is a single process with no external dependencies to disconnect: standard library only, no network calls (`labs/decision-service/README.md`). Every component is constructed in-process by `service.py`. The one outage-shaped question, revocation state being unreachable, is explicitly out of scope in the README ("disconnected revocation state is out of scope"), and `delegation.py` records the same boundary for its seeded store. Simulating an outage would require a dependency that does not exist. |
