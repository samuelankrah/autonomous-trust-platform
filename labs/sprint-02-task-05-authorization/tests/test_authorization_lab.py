import sys
import unittest
from dataclasses import replace
from pathlib import Path

LAB_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(LAB_ROOT))

from authorization_lab import (
    AuthorizationDecisionFunction,
    EnforcementPoint,
    EvidenceLedger,
    PaymentsReportResource,
    issue_workload_identity,
    make_request,
)


class AuthorizationVerticalSliceTests(unittest.TestCase):
    def setUp(self):
        self.ledger = EvidenceLedger()
        self.adf = AuthorizationDecisionFunction(self.ledger)
        self.resource = PaymentsReportResource(self.ledger)
        self.enforcer = EnforcementPoint(self.ledger, self.resource)

    def test_01_permit_reaches_protected_api_with_correlated_evidence(self):
        request = make_request()
        decision = self.adf.evaluate(request)
        response = self.enforcer.enforce(request, decision)

        self.assertEqual("PERMIT", decision.state)
        self.assertEqual({"report": "synthetic payments report"}, response)

        events = self.ledger.for_request(request.request_id)
        self.assertEqual(
            [
                "authorization.decision",
                "enforcement.outcome",
                "resource.operation",
            ],
            [event["event_type"] for event in events],
        )
        self.assertTrue(
            all(event.get("decision_id") == decision.decision_id for event in events)
        )

    def test_02_authenticated_identity_without_authority_is_denied(self):
        request = make_request(authority=None)
        decision = self.adf.evaluate(request)

        self.assertEqual("DENY", decision.state)
        self.assertIsNone(self.enforcer.enforce(request, decision))

        event_types = [
            event["event_type"]
            for event in self.ledger.for_request(request.request_id)
        ]
        self.assertNotIn("resource.operation", event_types)

    def test_03_wrong_workload_is_denied_even_with_authority(self):
        workload = "workload://atp-lab/unrecognized"
        request = make_request(
            workload=workload,
            identity=issue_workload_identity(workload=workload),
        )
        decision = self.adf.evaluate(request)

        self.assertEqual("DENY", decision.state)
        self.assertIsNone(self.enforcer.enforce(request, decision))

    def test_04_tampered_authority_is_indeterminate_and_not_enforced(self):
        request = make_request()
        tampered_authority = replace(
            request.authority,
            resource="/payments/other",
        )
        request = replace(request, authority=tampered_authority)
        decision = self.adf.evaluate(request)

        self.assertEqual("INDETERMINATE", decision.state)
        self.assertIsNone(self.enforcer.enforce(request, decision))

    def test_05_replayed_decision_is_rejected_by_request_binding(self):
        original_request = make_request()
        decision = self.adf.evaluate(original_request)
        replay_request = make_request()

        self.assertIsNone(self.enforcer.enforce(replay_request, decision))

        events = self.ledger.for_request(replay_request.request_id)
        self.assertEqual("DENIED", events[-1]["outcome"])
        self.assertEqual(
            "decision does not bind to this request",
            events[-1]["reason"],
        )

    def test_06_direct_resource_bypass_is_blocked_and_evidenced(self):
        request = make_request()

        with self.assertRaises(PermissionError):
            self.resource.direct_read_attempt(request)

        events = self.ledger.for_request(request.request_id)
        self.assertEqual("resource.bypass_attempt", events[-1]["event_type"])
        self.assertEqual("BLOCKED", events[-1]["outcome"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
