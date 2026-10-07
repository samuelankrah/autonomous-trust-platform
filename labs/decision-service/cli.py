"""CLI for the decision-service demo.

Commands:
  walkthrough --seed N [--fast]   Run all scenarios, assert checks, write evidence
  scenario NAME --seed N [--fast] Run one scenario
  repro --seed N                   Run the walkthrough twice; evidence must be byte-identical
  verify EVIDENCE_JSONL            Re-verify a stored evidence file (chain + closed sequences)

--fast uses wall clock and random IDs for iteration speed. It is explicitly
barred from producing evidence: the runner refuses to write an evidence
bundle in fast mode.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import scenarios
from ledger import Ledger
from service import EVIDENCE_DIR, new_service

LAB_DIR = Path(__file__).resolve().parent


def _code_version() -> str:
    try:
        out = subprocess.run(
            ["git", "-C", str(LAB_DIR), "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True, timeout=10,
        )
        return out.stdout.strip() or "unknown"
    except Exception:
        return "unknown"


def run_all(seed: int, fast: bool, out_dir: Path | None) -> dict:
    if fast and out_dir is not None:
        raise SystemExit("--fast is barred from producing evidence")
    if out_dir is not None:
        if out_dir.exists():
            shutil.rmtree(out_dir)
        out_dir.mkdir(parents=True)

    svc = new_service(seed, fast=fast)
    report: dict = {
        "seed": seed,
        "fast": fast,
        "code_version": _code_version(),
        "clock_start": "wall-clock" if fast else "2026-10-07T12:00:00Z",
        "scenarios": [],
    }
    total_passed = total_failed = 0
    for name, fn in scenarios.SCENARIOS.items():
        svc.open_run(name)
        result = fn(svc)
        passed = sum(1 for c in result["checks"] if c[2])
        failed = len(result["checks"]) - passed
        total_passed += passed
        total_failed += failed
        svc.close_run(name, "PASS" if failed == 0 else "FAIL", passed, failed)
        report["scenarios"].append({
            "name": name,
            "requirement_ids": result["requirement_ids"],
            "verdict": "PASS" if failed == 0 else "FAIL",
            "checks": [
                {"check_id": c[0], "requirement_ids": c[1], "passed": c[2], "detail": c[3]}
                for c in result["checks"]
            ],
        })

    chain_ok, chain_msg = svc.ledger.verify_chain()
    closed_ok, closed_problems = svc.ledger.check_closed_sequences()
    report["ledger"] = {
        "chain": {"ok": chain_ok, "detail": chain_msg},
        "closed_sequences": {"ok": closed_ok, "problems": closed_problems},
    }
    report["totals"] = {"passed": total_passed, "failed": total_failed}
    report["verdict"] = "PASS" if (total_failed == 0 and chain_ok and closed_ok) else "FAIL"

    if out_dir is not None:
        svc.ledger.write_jsonl(out_dir / "evidence.jsonl")
        (out_dir / "checks.json").write_text(json.dumps(report, indent=2, sort_keys=True), encoding="utf-8")
    return report


def print_report(report: dict) -> None:
    print(f"seed={report['seed']} fast={report['fast']} code={report['code_version']}")
    for sc in report["scenarios"]:
        print(f"\n[{sc['verdict']}] {sc['name']}  ({', '.join(sc['requirement_ids'])})")
        for ch in sc["checks"]:
            mark = "ok" if ch["passed"] else "FAIL"
            print(f"  [{mark}] {ch['check_id']}: {ch['detail']}")
    print(f"\nledger chain: {report['ledger']['chain']['detail']}")
    print(f"closed sequences: {'ok' if report['ledger']['closed_sequences']['ok'] else report['ledger']['closed_sequences']['problems']}")
    print(f"checks: {report['totals']['passed']} passed, {report['totals']['failed']} failed")
    print(f"OVERALL: {report['verdict']}")


def cmd_walkthrough(args: argparse.Namespace) -> int:
    out_dir = None if args.fast else (EVIDENCE_DIR / f"walkthrough-seed-{args.seed}")
    report = run_all(args.seed, args.fast, out_dir)
    print_report(report)
    if args.fast:
        print("\nFAST MODE: no evidence produced (barred by runner).")
    else:
        print(f"\nevidence written to {out_dir}")
    return 0 if report["verdict"] == "PASS" else 1


def cmd_scenario(args: argparse.Namespace) -> int:
    if args.name not in scenarios.SCENARIOS:
        raise SystemExit(f"unknown scenario: {args.name}")
    out_dir = None if args.fast else (EVIDENCE_DIR / f"scenario-{args.name}-seed-{args.seed}")
    svc = new_service(args.seed, fast=args.fast)
    svc.open_run(args.name)
    result = scenarios.SCENARIOS[args.name](svc)
    passed = sum(1 for c in result["checks"] if c[2])
    failed = len(result["checks"]) - passed
    svc.close_run(args.name, "PASS" if failed == 0 else "FAIL", passed, failed)
    for c in result["checks"]:
        print(f"[{'ok' if c[2] else 'FAIL'}] {c[0]} ({', '.join(c[1])}): {c[3]}")
    if out_dir is not None:
        if out_dir.exists():
            shutil.rmtree(out_dir)
        out_dir.mkdir(parents=True)
        svc.ledger.write_jsonl(out_dir / "evidence.jsonl")
        print(f"evidence written to {out_dir}")
    return 0 if failed == 0 else 1


def cmd_repro(args: argparse.Namespace) -> int:
    with tempfile.TemporaryDirectory() as tmp:
        dir_a = Path(tmp) / "run-a"
        dir_b = Path(tmp) / "run-b"
        report_a = run_all(args.seed, False, dir_a)
        report_b = run_all(args.seed, False, dir_b)
        a = (dir_a / "evidence.jsonl").read_bytes()
        b = (dir_b / "evidence.jsonl").read_bytes()
        identical = a == b
        print(f"run A verdict: {report_a['verdict']}, run B verdict: {report_b['verdict']}")
        print(f"evidence bytes A: {len(a)}, B: {len(b)}")
        print(f"rerun-twice byte-identical: {identical}")
        return 0 if (identical and report_a["verdict"] == "PASS") else 1


def cmd_verify(args: argparse.Namespace) -> int:
    path = Path(args.path)
    if not path.exists():
        raise SystemExit(f"not found: {path}")
    ok, msg = Ledger.verify_file(path)
    print(f"chain: {msg}")
    records = Ledger.read_jsonl(path)
    by_request: dict[str, list] = {}
    for r in records:
        if r["request_id"]:
            by_request.setdefault(r["request_id"], []).append(r["type"])
    unterminated = [rid for rid, types in by_request.items() if "enforcement.outcome" not in types]
    print(f"closed sequences: {'ok' if not unterminated else unterminated}")
    return 0 if (ok and not unterminated) else 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="decision-service demo")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("walkthrough")
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--fast", action="store_true")
    p.set_defaults(func=cmd_walkthrough)

    p = sub.add_parser("scenario")
    p.add_argument("name")
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--fast", action="store_true")
    p.set_defaults(func=cmd_scenario)

    p = sub.add_parser("repro")
    p.add_argument("--seed", type=int, default=7)
    p.set_defaults(func=cmd_repro)

    p = sub.add_parser("verify")
    p.add_argument("path")
    p.set_defaults(func=cmd_verify)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
