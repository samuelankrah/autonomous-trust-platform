"""Tests for the decision-service demo. Python stdlib unittest only.

Every test maps to requirement IDs (AZ/ENF/CTL/FR). A test asserts the
security behavior in code; log narration is not demonstration.
"""
import sys
import unittest
from dataclasses import replace
from pathlib import Path

LAB_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(LAB_ROOT))

from attestation import LAB_SYNTHETIC_FRESHNESS_SECONDS  # noqa: E402
from clock import ManualClock, parse_iso  # noqa: E402
from ledger import Ledger, LedgerError  # noqa: E402
from scenarios import RESOURCE, ACTION, PRINCIPAL, WORKLOAD_PATH, SCENARIOS  # noqa: E402
from service import CLOCK_START, new_service  # noqa: E402


def fresh_service(seed=7):
    return new_service(seed)


def all_checks_pass(result):
    failures = [c for c in result["checks"] if not c[2]]
    return failures


class ScenarioTests(unittest.TestCase):
    """Each CLI scenario, asserted end to end."""

    def _run(self, name, seed=7):
        svc = fresh_service(seed)
        result = SCENARIOS[name](svc)
        return svc, result

    def test_01_happy_path_permit(self):
        """AZ-001, AZ-003, AZ-005, AZ-013, AZ-016, AZ-017, AZ-019, AZ-020,
        ENF-001, ENF-003, ENF-008, ENF-010, CTL-001, CTL-002, CTL-003,
        CTL-004, CTL-005, CTL-008, CTL-010, CTL-012."""
        svc, result = self._run("happy-path")
        self.assertEqual(all_checks_pass(result), [])

    def test_02_identity_without_authority_denied(self):
        """AZ-002 (identity is not authorization), AZ-019, AZ-021."""
        svc, result = self._run("identity-no-authority")
        self.assertEqual(all_checks_pass(result), [])

    def test_03_revoked_delegation_denied(self):
        """AZ-015, CTL-009, FR-011, FR-012."""
        svc, result = self._run("revoked-delegation")
        self.assertEqual(all_checks_pass(result), [])

    def test_04_stale_attestation_indeterminate(self):
        """AZ-011, AZ-012, AZ-019, AZ-022, CTL-011, FR-007."""
        svc, result = self._run("stale-attestation")
        self.assertEqual(all_checks_pass(result), [])

    def test_05_tampered_decision_rejected(self):
        """ENF-008, CTL-005."""
        svc, result = self._run("tampered-decision")
        self.assertEqual(all_checks_pass(result), [])

    def test_06_replayed_decision_rejected(self):
        """ENF-003, CTL-010, AZ-017, AZ-018."""
        svc, result = self._run("replayed-decision")
        self.assertEqual(all_checks_pass(result), [])

    def test_07_bypass_attempt_blocked(self):
        """ENF-001, ENF-002, ENF-006, ENF-007, CTL-006, CTL-007."""
        svc, result = self._run("bypass-attempt")
        self.assertEqual(all_checks_pass(result), [])


class NegativeTests(unittest.TestCase):
    """Adversarial cases beyond the walkthrough scenarios."""

    def test_08_expired_identity_denied(self):
        """AZ-013, CTL-004: an expired identity cannot authorize."""
        svc = fresh_service()
        rid = svc.ids.hex("req")
        identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
        svc.clock.advance(301)
        attestation = svc.attestation_issuer.attest("spiffe://atp-demo/" + WORKLOAD_PATH)
        grant = svc.delegation_issuer.grant(
            source="finance-control", delegator="finance-control", delegate=PRINCIPAL,
            workload=identity.spiffe_id, resource=RESOURCE, action=ACTION, request_id=rid)
        decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                   identity, grant, attestation, svc.ids.nonce())
        self.assertEqual(decision.state, "DENY")

    def test_09_grant_wrong_scope_denied(self):
        """CTL-002, AZ-008: a grant for another resource is not authority here."""
        svc = fresh_service()
        rid = svc.ids.hex("req")
        identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
        attestation = svc.attestation_issuer.attest("spiffe://atp-demo/" + WORKLOAD_PATH)
        grant = svc.delegation_issuer.grant(
            source="finance-control", delegator="finance-control", delegate=PRINCIPAL,
            workload=identity.spiffe_id, resource="/admin/root", action="WRITE", request_id=rid)
        decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                   identity, grant, attestation, svc.ids.nonce())
        self.assertEqual(decision.state, "DENY")

    def test_10_decision_outside_validity_window_rejected(self):
        """CTL-004: a stale decision is rejected at enforcement."""
        svc = fresh_service()
        rid = svc.ids.hex("req")
        nonce = svc.ids.nonce()
        identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
        attestation = svc.attestation_issuer.attest("spiffe://atp-demo/" + WORKLOAD_PATH)
        grant = svc.delegation_issuer.grant(
            source="finance-control", delegator="finance-control", delegate=PRINCIPAL,
            workload=identity.spiffe_id, resource=RESOURCE, action=ACTION, request_id=rid)
        decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                    identity, grant, attestation, nonce)
        svc.clock.advance(10_000)
        outcome, result = svc.enforcer.enforce(rid, nonce, decision, lambda: {"x": 1})
        self.assertEqual(outcome.result, "REJECTED")
        self.assertIsNone(result)

    def test_11_tampered_grant_yields_indeterminate_not_permit(self):
        """AZ-022, CTL-011: unverifiable authority is indeterminate, never permit."""
        svc = fresh_service()
        rid = svc.ids.hex("req")
        identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
        attestation = svc.attestation_issuer.attest("spiffe://atp-demo/" + WORKLOAD_PATH)
        grant = svc.delegation_issuer.grant(
            source="finance-control", delegator="finance-control", delegate=PRINCIPAL,
            workload=identity.spiffe_id, resource=RESOURCE, action=ACTION, request_id=rid)
        tampered = replace(grant, action="WRITE")
        decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                    identity, tampered, attestation, svc.ids.nonce())
        self.assertEqual(decision.state, "INDETERMINATE")

    def test_12_wrong_trust_domain_identity_rejected(self):
        """AZ-004, CTL-012: foreign trust domains are not locally recognized."""
        svc = fresh_service()
        rid = svc.ids.hex("req")
        identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
        foreign = replace(identity, spiffe_id="spiffe://other-domain/" + WORKLOAD_PATH,
                          trust_domain="other-domain")
        ok, reason = svc.identity_validator.validate(foreign, rid)
        self.assertFalse(ok)

    def test_13_missing_attestation_indeterminate(self):
        """AZ-011: required attestation evidence absent means indeterminate."""
        svc = fresh_service()
        rid = svc.ids.hex("req")
        identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
        grant = svc.delegation_issuer.grant(
            source="finance-control", delegator="finance-control", delegate=PRINCIPAL,
            workload=identity.spiffe_id, resource=RESOURCE, action=ACTION, request_id=rid)
        decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                    identity, grant, None, svc.ids.nonce())
        self.assertEqual(decision.state, "INDETERMINATE")

    def test_14_amplified_grant_denied(self):
        """SI-20, CTL-002: delegation cannot exceed the delegator's scope."""
        svc = fresh_service()
        rid = svc.ids.hex("req")
        identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
        attestation = svc.attestation_issuer.attest("spiffe://atp-demo/" + WORKLOAD_PATH)
        grant = svc.delegation_issuer.grant(
            source="finance-control", delegator="finance-control", delegate=PRINCIPAL,
            workload=identity.spiffe_id, resource=RESOURCE, action=ACTION, request_id=rid)
        ok, reason = svc.delegation_validator.validate(
            grant, PRINCIPAL, identity.spiffe_id, "/admin/root", "WRITE", rid)
        self.assertFalse(ok)


class LedgerTests(unittest.TestCase):
    """Evidence integrity mechanics."""

    def test_15_chain_verifies(self):
        """CTL-008: the hash chain verifies after a scenario."""
        svc = fresh_service()
        SCENARIOS["happy-path"](svc)
        ok, msg = svc.ledger.verify_chain()
        self.assertTrue(ok, msg)

    def test_16_tamper_detected(self):
        """SI-35/SI-38 modeling: altering a stored record breaks the chain."""
        svc = fresh_service()
        SCENARIOS["happy-path"](svc)
        records = svc.ledger.records()
        records[2]["reason"] = "altered after the fact"
        ledger2 = Ledger(svc.clock, svc.ids)
        ledger2._records = records
        ok, msg = ledger2.verify_chain()
        self.assertFalse(ok)

    def test_17_sequences_close(self):
        """Every request terminates in an enforcement outcome."""
        svc = fresh_service()
        for name in SCENARIOS:
            SCENARIOS[name](svc)
            svc.close_run(name, "PASS", 1, 0)
        ok, problems = svc.ledger.check_closed_sequences()
        self.assertTrue(ok, problems)

    def test_18_schema_enforced(self):
        """LAB-SCHEMA-v1: malformed events are rejected at append time."""
        svc = fresh_service()
        with self.assertRaises(LedgerError):
            svc.ledger.append("authorization.decision", "req-1", state="PERMIT")
        with self.assertRaises(LedgerError):
            svc.ledger.append("not.a.real.type", "req-1")

    def test_19_dirty_state_refused(self):
        """FR-WP4-022: leftover state fails loudly instead of leaking."""
        from clock import ManualClock
        from service import CLOCK_START, DecisionService, DirtyStateError
        fresh_service()  # leaves a run marker in the state directory
        with self.assertRaises(DirtyStateError):
            DecisionService(8, ManualClock(CLOCK_START))

    def test_20_determinism_same_seed(self):
        """FR-WP4-021: same seed, same evidence bytes."""
        import cli
        import tempfile
        from pathlib import Path as P
        with tempfile.TemporaryDirectory() as tmp:
            a, b = P(tmp) / "a", P(tmp) / "b"
            cli.run_all(21, False, a)
            cli.run_all(21, False, b)
            self.assertEqual((a / "evidence.jsonl").read_bytes(), (b / "evidence.jsonl").read_bytes())

    def test_21_seed_variation_same_outcomes(self):
        """FR-WP4-022: different seeds, identical outcome patterns."""
        import cli
        import tempfile
        from pathlib import Path as P
        with tempfile.TemporaryDirectory() as tmp:
            a, b = P(tmp) / "a", P(tmp) / "b"
            ra = cli.run_all(31, False, a)
            rb = cli.run_all(32, False, b)
            pa = [(s["name"], s["verdict"]) for s in ra["scenarios"]]
            pb = [(s["name"], s["verdict"]) for s in rb["scenarios"]]
            self.assertEqual(pa, pb)
            self.assertTrue(all(v == "PASS" for _, v in pa))

    def test_22_attestation_threshold_is_declared(self):
        """The synthetic freshness threshold is a named constant, not magic."""
        self.assertEqual(LAB_SYNTHETIC_FRESHNESS_SECONDS, 300)


if __name__ == "__main__":
    unittest.main()
