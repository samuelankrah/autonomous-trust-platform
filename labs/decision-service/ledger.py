"""Append-only, hash-chained evidence ledger (LC-09 shaped).

Each record carries the hash of its predecessor, so append-only storage is
verified by re-computation, not asserted. Per-event schema validation keeps
principal, runtime, and delegator as separate fields (SI-35). A closed-sequence
check requires every request_id to terminate in an enforcement outcome event;
an unterminated request is an evidence defect.

Single-process honesty note: the ledger is one component no actor controls
alone only in the modeled sense. The hash chain plus the independent
post-scenario verification step is honest modeling of LC-09 independence, not
real independence, and is labeled as such.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import crypto
from clock import Clock, isoformat
from ids import SeededIds

GENESIS_PREV = "GENESIS"

BASE_FIELDS = {"event_id", "seq", "ts", "type", "request_id", "prev_hash", "record_hash"}

# Required fields beyond the base set, per event type (LAB-SCHEMA-v1).
SCHEMAS: dict[str, set[str]] = {
    "lab.run_started": {"seed", "clock_start", "scenario", "key_ids", "algorithm"},
    "lab.run_finished": {"scenario", "verdict", "checks_passed", "checks_failed"},
    "lab.clock_fault": {"fault", "detail"},
    "identity.issued": {"spiffe_id", "principal", "trust_domain", "expires_at", "key_id", "placeholder"},
    "identity.validation": {"spiffe_id", "valid", "reason"},
    "delegation.granted": {"grant_id", "source", "delegator", "issuer", "delegate", "scope", "key_id"},
    "delegation.revocation_check": {"grant_id", "revoked", "basis"},
    "delegation.validation": {"grant_id", "valid", "reason"},
    "attestation.appraisal": {"evidence_id", "workload", "verdict", "reason", "freshness_seconds", "threshold_seconds"},
    "authorization.decision": {
        "decision_id", "state", "principal", "workload", "resource", "action",
        "policy_version", "reason", "key_id",
    },
    "enforcement.outcome": {"outcome_id", "decision_id", "result", "reason"},
    "resource.operation": {"resource", "action", "principal"},
    "resource.bypass_attempt": {"resource", "action", "reason"},
}


class LedgerError(Exception):
    pass


class Ledger:
    def __init__(self, clock: Clock, ids: SeededIds) -> None:
        self._clock = clock
        self._ids = ids
        self._records: list[dict[str, Any]] = []
        self._prev = GENESIS_PREV

    def append(self, event_type: str, request_id: str | None, **fields: Any) -> dict[str, Any]:
        if event_type not in SCHEMAS:
            raise LedgerError(f"unknown event type: {event_type}")
        missing = SCHEMAS[event_type] - set(fields)
        if missing:
            raise LedgerError(f"event {event_type} missing fields: {sorted(missing)}")
        record: dict[str, Any] = {
            "event_id": self._ids.hex("evt"),
            "seq": len(self._records),
            "ts": isoformat(self._clock.now()),
            "type": event_type,
            "request_id": request_id,
            "prev_hash": self._prev,
        }
        record.update(fields)
        record["record_hash"] = crypto.digest(
            {k: v for k, v in record.items() if k != "record_hash"}
        )
        self._records.append(record)
        self._prev = record["record_hash"]
        return record

    def records(self) -> list[dict[str, Any]]:
        return list(self._records)

    def for_request(self, request_id: str) -> list[dict[str, Any]]:
        return [r for r in self._records if r["request_id"] == request_id]

    def verify_chain(self) -> tuple[bool, str]:
        prev = GENESIS_PREV
        for record in self._records:
            if record["prev_hash"] != prev:
                return False, f"chain break at seq {record['seq']}"
            recomputed = crypto.digest(
                {k: v for k, v in record.items() if k != "record_hash"}
            )
            if recomputed != record["record_hash"]:
                return False, f"hash mismatch at seq {record['seq']}"
            prev = record["record_hash"]
        return True, f"chain ok, {len(self._records)} records"

    def check_closed_sequences(self) -> tuple[bool, list[str]]:
        """Every request_id must terminate in an enforcement.outcome event."""
        problems: list[str] = []
        by_request: dict[str, list[dict[str, Any]]] = {}
        for record in self._records:
            rid = record["request_id"]
            if rid:
                by_request.setdefault(rid, []).append(record)
        for rid, events in by_request.items():
            if not any(e["type"] == "enforcement.outcome" for e in events):
                problems.append(f"request {rid} has no enforcement.outcome")
        return (len(problems) == 0), problems

    def write_jsonl(self, path: Path) -> None:
        with path.open("w", encoding="utf-8") as fh:
            for record in self._records:
                fh.write(json.dumps(record, sort_keys=True) + "\n")

    @staticmethod
    def read_jsonl(path: Path) -> list[dict[str, Any]]:
        with path.open(encoding="utf-8") as fh:
            return [json.loads(line) for line in fh if line.strip()]

    @staticmethod
    def verify_file(path: Path) -> tuple[bool, str]:
        records = Ledger.read_jsonl(path)
        prev = GENESIS_PREV
        for record in records:
            if record["prev_hash"] != prev:
                return False, f"chain break at seq {record.get('seq')}"
            recomputed = crypto.digest(
                {k: v for k, v in record.items() if k != "record_hash"}
            )
            if recomputed != record["record_hash"]:
                return False, f"hash mismatch at seq {record.get('seq')}"
            prev = record["record_hash"]
        return True, f"chain ok, {len(records)} records"
