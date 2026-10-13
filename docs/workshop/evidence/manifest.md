# Reproducibility Manifest: Phase 0 Validation Runs

This manifest makes the Phase 0 validation claims independently repeatable. The Phase 0 runs themselves were manual runs, and until this manifest and its logs were retained they were correctly labeled **reported and reproducible**. The logs in this directory are retained artifacts from a re-run of every suite at the revision commit below, after the peer-review revisions were committed. Any reader can repeat the same commands at the same commit and compare.

## Repository and commits

- Repository: https://github.com/samuelankrah/autonomous-trust-platform
- Baseline commit (HEAD at the start of Phase 0): `ae6f33008ee5b876560ce56c0c2b885feaec9007`
- Phase 0 final commit (design drafts): `5d82623e43697bf47e042e082c2ac4afe28ddc76`
- Revision commit (peer-review revisions; the evidence runs below were executed at this HEAD): `90bfd1209d5d33fee8dd0abb777bc08192a1ecf9`
- The evidence files in this directory, the tracked Phase 0 report, and the Study Lab extension proposal are committed on top of the revision commit. That final commit is verified equal to `origin/main` at delivery; the retained `head-vs-origin.log` records the same check at the revision commit.

## Runtime and platform

- Python: 3.12.3
- Platform: Linux 7.0.0-39-generic x86_64
- Test runner: Python standard library `unittest` only (pytest is not installed on this machine). No network access is used by any suite.

## Commands, results, and artifacts

Run from the repository root unless a working directory is stated.

| Check | Exact command | Exit | Result | Log |
| --- | --- | --- | --- | --- |
| Decision-service tests | `python3 -m unittest discover -s tests` (working directory: labs/decision-service) | 0 | 22 tests, OK | decision-service-tests.log |
| Sprint 2 lab tests | `python3 -m unittest discover -s tests` (working directory: labs/sprint-02-task-05-authorization) | 0 | 13 tests, OK | sprint-02-lab-tests.log |
| Walkthrough, seed 7 | `python3 cli.py walkthrough` (working directory: labs/decision-service) | 0 | 31 checks passed, 0 failed, OVERALL PASS, all 7 scenarios PASS | walkthrough-seed-7.log |
| Determinism, rerun twice | `python3 cli.py repro --seed 7` (working directory: labs/decision-service) | 0 | Run A PASS, run B PASS, evidence 31,544 bytes each, byte-identical: True | determinism-repro-seed-7.log |
| Evidence chain verification | `python3 cli.py verify evidence/walkthrough-seed-7/evidence.jsonl` (working directory: labs/decision-service) | 0 | chain ok, 64 records; closed sequences ok | evidence-chain-verify.log |
| Fixture regeneration | `python3 labs/decision-service/tools/export_fixtures.py --out-dir /tmp/fix-final`, then `diff -r /tmp/fix-final docs/workshop/fixtures` | exporter 0, diff 1 (expected, see log) | 14 fixture files byte-identical; index.json differs only in the `source_engine_commit` provenance field, explained in the log | fixture-regeneration-diff.log |
| Working tree state | `git status --porcelain` at the revision commit | 0 | No tracked file modified or staged; the only untracked entry is this evidence directory itself | git-status-clean.log |
| HEAD versus origin | `git rev-parse HEAD` and `git rev-parse origin/main` at the revision commit | 0 | Identical: `90bfd1209d5d33fee8dd0abb777bc08192a1ecf9` | head-vs-origin.log |

Notes on the Sprint 2 invocation: a bare `python3 -m unittest discover` in the Sprint 2 lab directory runs 0 tests, because the tests live in a `tests/` subdirectory. The `-s tests` form above is required; the decision-service suite uses the same form.

## What varies between runs, stated plainly

- Test timing lines (`Ran 22 tests in 0.069s` and similar) vary on every run. They carry no claim.
- The walkthrough output stamps the short HEAD of the checked-out commit on its first line (`code=90bfd12` in the retained log). Re-running at a different commit changes that stamp and nothing else in the result.
- Signature values and ledger hash values are generated from per-run fresh keys and are not reproducible at any seed. No log or fixture in this directory contains them or claims them; fixtures record signature presence and seeded key ID labels only.
- Fixture regeneration is byte-identical at a fixed HEAD. Across HEADs, only the index `source_engine_commit` provenance field changes, as documented in fixture-regeneration-diff.log.
