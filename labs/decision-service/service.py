"""Decision-service assembly: one seeded, clock-injected run.

Builds the LC-shaped components (identity issuance/validation, delegation
issuance/governance, attestation appraisal, decision function, enforcement
stub, append-only ledger) with per-run fresh keys and a manual clock.

Per-run state wipe: the runner calls wipe_state() before every run, and the
service refuses to start if the state directory is not empty, so leftover
state can never leak silently into evidence (FR-WP4-022 accident detection).
"""
from __future__ import annotations

import shutil
from datetime import UTC, datetime
from pathlib import Path

import crypto
from attestation import AttestationIssuer, AttestationVerifier
from clock import Clock, ManualClock, SystemClock, isoformat, parse_iso
from delegation import DelegationIssuer, DelegationValidator, RevocationStore
from enforcement import EnforcementPoint
from identity import IdentityIssuer, IdentityValidator
from ids import SeededIds
from ledger import Ledger
from policy import AuthorizationDecisionFunction, load_policy

LAB_DIR = Path(__file__).resolve().parent
STATE_DIR = LAB_DIR / "state"
EVIDENCE_DIR = LAB_DIR / "evidence"

CLOCK_START = datetime(2026, 10, 7, 12, 0, 0, tzinfo=UTC)

KEY_IDS = {
    "identity": "identity-key",
    "authority": "authority-key",
    "decision": "decision-key",
    "attestation": "attestation-key",
}


class DirtyStateError(Exception):
    pass


def wipe_state() -> None:
    if STATE_DIR.exists():
        shutil.rmtree(STATE_DIR)
    STATE_DIR.mkdir(parents=True)


class DecisionService:
    def __init__(self, seed: int, clock: Clock, fast: bool = False) -> None:
        if STATE_DIR.exists() and any(STATE_DIR.iterdir()):
            raise DirtyStateError(
                "state directory is not empty; refusing to run on leftover state"
            )
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        self.seed = seed
        self.fast = fast
        self.clock = clock
        self.ids = SeededIds(seed)
        self.ledger = Ledger(clock, self.ids)
        # Run marker: proves which seed owns this state directory. A second
        # direct construction without a wipe fails loudly on the check above.
        (STATE_DIR / "run.json").write_text(
            __import__("json").dumps(
                {"seed": seed, "fast": fast,
                 "clock": "wall-clock" if fast else isoformat(clock.now())},
                sort_keys=True,
            ),
            encoding="utf-8",
        )
        self.keys = {name: crypto.generate_key() for name in KEY_IDS}
        self.key_ids = {name: f"{kid}-run-{seed}" for name, kid in KEY_IDS.items()}
        self.policy = load_policy()

        self.identity_issuer = IdentityIssuer(clock, self.ids, self.ledger, self.keys["identity"], self.key_ids["identity"])
        self.identity_validator = IdentityValidator(clock, self.ledger, self.keys["identity"])
        self.delegation_issuer = DelegationIssuer(clock, self.ids, self.ledger, self.keys["authority"], self.key_ids["authority"])
        self.revocation = RevocationStore(self.ledger)
        self.delegation_validator = DelegationValidator(
            clock, self.ledger, self.keys["authority"], self.revocation,
            delegable_scope={"finance-control": ["/reports/quarterly:READ"]},
        )
        self.attestation_issuer = AttestationIssuer(clock, self.ids, self.ledger, self.keys["attestation"], self.key_ids["attestation"])
        self.attestation_verifier = AttestationVerifier(clock, self.ledger, self.keys["attestation"])
        self.adf = AuthorizationDecisionFunction(
            clock, self.ids, self.ledger, self.keys["decision"], self.key_ids["decision"],
            self.identity_validator, self.delegation_validator, self.attestation_verifier, self.policy,
        )
        self.enforcer = EnforcementPoint(clock, self.ids, self.ledger, self.keys["decision"])

    def open_run(self, scenario: str) -> None:
        self.ledger.append(
            "lab.run_started",
            None,
            seed=self.seed,
            clock_start=isoformat(self.clock.now()) if isinstance(self.clock, ManualClock) else "wall-clock-FAST",
            scenario=scenario,
            key_ids=self.key_ids,
            algorithm=crypto.ALGORITHM,
        )

    def close_run(self, scenario: str, verdict: str, passed: int, failed: int) -> None:
        self.ledger.append(
            "lab.run_finished", None, scenario=scenario, verdict=verdict,
            checks_passed=passed, checks_failed=failed,
        )


def new_service(seed: int, fast: bool = False) -> DecisionService:
    """Seeded evidence runs use ManualClock; --fast uses wall clock and is
    barred from producing evidence by the runner."""
    wipe_state()
    clock: Clock = SystemClock() if fast else ManualClock(CLOCK_START)
    return DecisionService(seed, clock, fast=fast)
