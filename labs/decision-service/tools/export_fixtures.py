"""Fixture exporter for the decision-service lab.

Runs every scenario in scenarios.SCENARIOS on a fresh seeded service, using
the same open_run and close_run bookkeeping as cli.py, and writes one JSON
fixture per scenario per seed plus a combined index. The exporter adds
observation only: it wraps the service components to record the objects the
engine itself creates (identity, grant, attestation, decision, enforcement
outcome) and reads the evidence pattern back from the ledger. It contains
no decision, validation, or enforcement logic of its own.

Determinism: fixtures exclude every value that depends on the per-run
synthetic keys. Keys are generated fresh per run in service.py via
crypto.generate_key, so signatures differ between runs even at the same
seed. Fixtures record signature_present and key_id instead of signature
values. Everything retained (seeded identifiers from ids.SeededIds, manual
clock timestamps, decision fields, ledger event types and field names) is
a pure function of the seed and the scenario, so running the exporter
twice produces byte-identical files.

Usage, from the repository root:

    python3 labs/decision-service/tools/export_fixtures.py

Options: --out-dir DIR (default docs/workshop/fixtures under the repo
root), --seeds 7,11 (comma separated seed list).

The index now records provenance: it carries the exporter version, the
source engine commit, and the generation command alongside the seed
list, so any fixture set can be traced to the code that produced it.
"""
from __future__ import annotations

import argparse
import copy
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

LAB_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_OUT_DIR = REPO_ROOT / "docs" / "workshop" / "fixtures"
CONTRACT_VERSION = "scenario-contract-v1"
EXPORTER_VERSION = "1.1"


def _source_engine_commit() -> str:
    """Return the full git HEAD commit of the repository, or "unknown"."""
    try:
        result = subprocess.run(
            ["git", "-C", str(REPO_ROOT), "rev-parse", "HEAD"],
            capture_output=True,
            text=True,
            check=True,
            timeout=10,
        )
        commit = result.stdout.strip()
        return commit if commit else "unknown"
    except Exception:
        return "unknown"

if str(LAB_DIR) not in sys.path:
    sys.path.insert(0, str(LAB_DIR))

import scenarios as scenarios_module  # noqa: E402
from service import new_service  # noqa: E402


def _identity_summary(identity: Any) -> dict[str, Any]:
    data = copy.deepcopy(identity.claims())
    data["signature_present"] = bool(identity.signature)
    return data


def _grant_summary(grant: Any) -> dict[str, Any]:
    data = copy.deepcopy(grant.claims())
    data["provenance"] = copy.deepcopy(grant.provenance())
    data["signature_present"] = bool(grant.signature)
    return data


def _attestation_summary(evidence: Any) -> dict[str, Any]:
    data = copy.deepcopy(evidence.claims_dict())
    data["signature_present"] = bool(evidence.signature)
    return data


def _decision_summary(decision: Any) -> dict[str, Any]:
    data = copy.deepcopy(decision.claims())
    data["signature_present"] = bool(decision.signature)
    return data


def _outcome_summary(outcome: Any) -> dict[str, Any]:
    return {
        "outcome_id": outcome.outcome_id,
        "decision_id": outcome.decision_id,
        "request_id": outcome.request_id,
        "result": outcome.result,
        "reason": outcome.reason,
        "enforced_at": outcome.enforced_at,
    }


def _note_request(capture: dict[str, Any], request_id: str, nonce: str | None) -> None:
    for entry in capture["requests"]:
        if entry["request_id"] == request_id:
            if entry["nonce"] is None and nonce is not None:
                entry["nonce"] = nonce
            return
    capture["requests"].append({"request_id": request_id, "nonce": nonce})


def _instrument(svc: Any, capture: dict[str, Any]) -> None:
    """Wrap the service components to observe the objects they produce.

    Each wrapper calls the original bound method exactly once with the
    original arguments and returns its result unchanged. Wrappers never
    append ledger events and never draw identifiers, so the seeded run is
    identical to an unwrapped run.
    """
    orig_issue = svc.identity_issuer.issue

    def issue(path: str, principal: str, request_id: str | None = None) -> Any:
        result = orig_issue(path, principal, request_id)
        summary = _identity_summary(result)
        capture["identity"] = summary
        capture["identities"].append(summary)
        return result

    svc.identity_issuer.issue = issue

    orig_attest = svc.attestation_issuer.attest

    def attest(workload: str, claims: dict[str, Any] | None = None) -> Any:
        result = orig_attest(workload, claims)
        summary = _attestation_summary(result)
        capture["attestation"] = summary
        capture["attestations"].append(summary)
        return result

    svc.attestation_issuer.attest = attest

    orig_grant = svc.delegation_issuer.grant

    def grant(*args: Any, **kwargs: Any) -> Any:
        result = orig_grant(*args, **kwargs)
        summary = _grant_summary(result)
        capture["grant"] = summary
        capture["grants"].append(summary)
        return result

    svc.delegation_issuer.grant = grant

    orig_revoke = svc.revocation.revoke

    def revoke(grant_id: str, request_id: str | None = None) -> Any:
        capture["revoked_grant_ids"].append(grant_id)
        return orig_revoke(grant_id, request_id)

    svc.revocation.revoke = revoke

    orig_advance = svc.clock.advance

    def advance(seconds: int) -> Any:
        capture["clock_advances_seconds"].append(seconds)
        return orig_advance(seconds)

    svc.clock.advance = advance

    orig_evaluate = svc.adf.evaluate

    def evaluate(request_id: str, principal: str, workload: str, resource: str,
                 action: str, identity: Any, grant_obj: Any, attestation: Any,
                 nonce: str) -> Any:
        _note_request(capture, request_id, nonce)
        result = orig_evaluate(request_id, principal, workload, resource,
                                action, identity, grant_obj, attestation, nonce)
        capture["decisions"].append(_decision_summary(result))
        return result

    svc.adf.evaluate = evaluate

    orig_enforce = svc.enforcer.enforce

    def enforce(request_id: str, nonce: str, decision: Any,
                protected_operation: Any) -> Any:
        _note_request(capture, request_id, nonce)
        outcome, result = orig_enforce(request_id, nonce, decision,
                                       protected_operation)
        capture["enforcements"].append({
            "via": "enforce",
            "request_id": request_id,
            "nonce": nonce,
            "presented_decision": _decision_summary(decision),
            "outcome": _outcome_summary(outcome),
            "operation_result": copy.deepcopy(result),
        })
        return outcome, result

    svc.enforcer.enforce = enforce

    orig_direct_access = svc.enforcer.direct_access

    def direct_access(request_id: str, resource: str, action: str,
                      principal: str) -> Any:
        _note_request(capture, request_id, None)
        capture["direct_access"] = {
            "resource": resource, "action": action, "principal": principal,
        }
        outcome = orig_direct_access(request_id, resource, action, principal)
        capture["enforcements"].append({
            "via": "direct_access",
            "request_id": request_id,
            "nonce": None,
            "presented_decision": None,
            "outcome": _outcome_summary(outcome),
            "operation_result": None,
        })
        return outcome

    svc.enforcer.direct_access = direct_access


def _new_capture() -> dict[str, Any]:
    return {
        "requests": [],
        "identity": None,
        "identities": [],
        "grant": None,
        "grants": [],
        "attestation": None,
        "attestations": [],
        "revoked_grant_ids": [],
        "clock_advances_seconds": [],
        "direct_access": None,
        "decisions": [],
        "enforcements": [],
    }


def run_scenario_fixture(name: str, seed: int) -> dict[str, Any]:
    """Run one scenario on a fresh seeded service and build its fixture."""
    svc = new_service(seed, fast=False)
    capture = _new_capture()
    _instrument(svc, capture)
    svc.open_run(name)
    start = len(svc.ledger.records())
    result = scenarios_module.SCENARIOS[name](svc)
    records = svc.ledger.records()[start:]
    passed = sum(1 for c in result["checks"] if c[2])
    failed = len(result["checks"]) - passed
    svc.close_run(name, "PASS" if failed == 0 else "FAIL", passed, failed)

    decisions = capture["decisions"]
    enforcements = capture["enforcements"]
    fixture: dict[str, Any] = {
        "contract_version": CONTRACT_VERSION,
        "scenario": name,
        "seed": seed,
        "verdict": "PASS" if failed == 0 else "FAIL",
        "requirement_ids": list(result["requirement_ids"]),
        "checks": [
            {
                "check_id": c[0],
                "requirement_ids": list(c[1]),
                "passed": bool(c[2]),
                "detail": c[3],
            }
            for c in result["checks"]
        ],
        "inputs": {
            "principal": scenarios_module.PRINCIPAL,
            "resource": scenarios_module.RESOURCE,
            "action": scenarios_module.ACTION,
            "workload_path": scenarios_module.WORKLOAD_PATH,
            "requests": capture["requests"],
            "identity": capture["identity"],
            "grant": capture["grant"],
            "attestation": capture["attestation"],
            "revoked_grant_ids": capture["revoked_grant_ids"],
            "clock_advances_seconds": capture["clock_advances_seconds"],
            "direct_access": capture["direct_access"],
        },
        "decision": decisions[0] if decisions else None,
        "decisions": decisions,
        "enforcement": enforcements[-1]["outcome"] if enforcements else None,
        "enforcements": enforcements,
        "evidence": {
            "event_types": [r["type"] for r in records],
            "events": [
                {"type": r["type"], "fields": sorted(r.keys())}
                for r in records
            ],
        },
    }
    return fixture


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n",
                    encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="export_fixtures")
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR)
    parser.add_argument("--seeds", default="7,11",
                        help="comma separated seed list (default 7,11)")
    args = parser.parse_args(argv)
    seeds = [int(s) for s in args.seeds.split(",") if s.strip()]

    args.out_dir.mkdir(parents=True, exist_ok=True)
    entries: list[dict[str, Any]] = []
    failures = 0
    for seed in seeds:
        for name in scenarios_module.SCENARIOS:
            fixture = run_scenario_fixture(name, seed)
            filename = f"{name}-seed-{seed}.json"
            _write_json(args.out_dir / filename, fixture)
            entries.append({
                "scenario": name,
                "seed": seed,
                "file": filename,
                "verdict": fixture["verdict"],
            })
            if fixture["verdict"] != "PASS":
                failures += 1
            print(f"{fixture['verdict']} {filename}")
    entries.sort(key=lambda e: (e["scenario"], e["seed"]))
    index = {
        "contract_version": CONTRACT_VERSION,
        "exporter_version": EXPORTER_VERSION,
        "source_engine_commit": _source_engine_commit(),
        "generation_command": (
            "python3 labs/decision-service/tools/export_fixtures.py "
            f"--seeds {args.seeds}"
        ),
        "generated_by": "labs/decision-service/tools/export_fixtures.py",
        "seeds": seeds,
        "scenarios": list(scenarios_module.SCENARIOS),
        "fixtures": entries,
    }
    _write_json(args.out_dir / "index.json", index)
    print(f"wrote {len(entries)} fixtures and index.json to {args.out_dir}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
