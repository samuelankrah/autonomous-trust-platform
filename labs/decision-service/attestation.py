"""Attestation evidence and appraisal stub (LC-03/LC-04 shaped, minimal).

This models attestation evidence semantics only: an evidence artifact with an
issuance timestamp, a declared synthetic freshness threshold, and an appraisal
rule that yields a freshness verdict. Genuine hardware-backed attestation,
endorsement lifecycle, and reference-value management are out of scope per
WP-004.

LAB-CONFIG, NON-NORMATIVE: LAB_SYNTHETIC_FRESHNESS_SECONDS is a declared lab
constant so the scenario can run. It is not an architecture answer to the
failure-model open questions on attestation freshness thresholds. A reader
must not mistake this constant for a required value.
"""
from __future__ import annotations

from dataclasses import replace
from datetime import timedelta
from typing import Any, Literal

import crypto
from clock import Clock, isoformat, parse_iso
from ids import SeededIds
from ledger import Ledger
from models import AttestationEvidence

LAB_SYNTHETIC_FRESHNESS_SECONDS = 300

AppraisalVerdict = Literal["FRESH", "STALE", "INVALID"]


class AttestationIssuer:
    def __init__(self, clock: Clock, ids: SeededIds, ledger: Ledger, key: bytes, key_id: str) -> None:
        self._clock = clock
        self._ids = ids
        self._ledger = ledger
        self._key = key
        self._key_id = key_id

    def attest(self, workload: str, claims: dict[str, Any] | None = None) -> AttestationEvidence:
        now = self._clock.now()
        evidence = AttestationEvidence(
            evidence_id=self._ids.hex("att"),
            workload=workload,
            issued_at=isoformat(now),
            expires_at=isoformat(now + timedelta(seconds=LAB_SYNTHETIC_FRESHNESS_SECONDS * 2)),
            claims=claims or {"runtime_class": "lab-synthetic", "config": "baseline"},
            key_id=self._key_id,
        )
        return replace(evidence, signature=crypto.sign(evidence.claims_dict(), self._key))


class AttestationVerifier:
    """Appraisal stub: signature, expiry, and synthetic freshness threshold."""

    def __init__(self, clock: Clock, ledger: Ledger, key: bytes) -> None:
        self._clock = clock
        self._ledger = ledger
        self._key = key

    def appraise(
        self, evidence: AttestationEvidence, request_id: str | None = None
    ) -> tuple[AppraisalVerdict, str, int]:
        age = int((self._clock.now() - parse_iso(evidence.issued_at)).total_seconds())
        if not crypto.verify(evidence.claims_dict(), evidence.signature, self._key):
            verdict: AppraisalVerdict = "INVALID"
            reason = "attestation evidence signature does not verify"
        elif parse_iso(evidence.expires_at) <= self._clock.now():
            verdict = "INVALID"
            reason = "attestation evidence expired"
        elif age > LAB_SYNTHETIC_FRESHNESS_SECONDS:
            verdict = "STALE"
            reason = (
                f"attestation evidence is {age}s old, beyond the declared synthetic "
                f"threshold of {LAB_SYNTHETIC_FRESHNESS_SECONDS}s (LAB-CONFIG, non-normative)"
            )
        else:
            verdict = "FRESH"
            reason = "ok"
        self._ledger.append(
            "attestation.appraisal",
            request_id,
            evidence_id=evidence.evidence_id,
            workload=evidence.workload,
            verdict=verdict,
            reason=reason,
            freshness_seconds=age,
            threshold_seconds=LAB_SYNTHETIC_FRESHNESS_SECONDS,
        )
        return verdict, reason, age
