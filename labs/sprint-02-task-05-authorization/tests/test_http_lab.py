import base64
import http.client
import json
import sys
import threading
import unittest
from dataclasses import asdict, replace
from http.server import HTTPServer
from pathlib import Path

LAB_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(LAB_ROOT))

from authorization_lab import issue_authority, issue_workload_identity
from http_lab import PaymentsHandler


def encode_artifact(artifact):
    payload = json.dumps(
        asdict(artifact),
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")


class HttpAuthorizationEnforcementTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = HTTPServer(("127.0.0.1", 0), PaymentsHandler)
        cls.host, cls.port = cls.server.server_address
        cls.thread = threading.Thread(
            target=cls.server.serve_forever,
            daemon=True,
        )
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def request(
        self,
        request_id,
        identity=None,
        authority=None,
        decision_artifact=None,
        dependency_unavailable=False,
        path="/payments/report",
    ):
        headers = {"X-Request-ID": request_id}
        if identity is not None:
            headers["X-Workload-Identity"] = encode_artifact(identity)
        if authority is not None:
            headers["X-Authority"] = encode_artifact(authority)
        if decision_artifact is not None:
            headers["X-Authorization-Decision"] = decision_artifact
        if dependency_unavailable:
            headers["X-Lab-Authorization-Dependency"] = "unavailable"

        connection = http.client.HTTPConnection(self.host, self.port, timeout=2)
        connection.request("GET", path, headers=headers)
        response = connection.getresponse()
        body = json.loads(response.read().decode("utf-8"))
        connection.close()
        return response.status, body

    def assert_resource_not_reached(self, body):
        self.assertNotIn(
            "resource.operation",
            [event["event_type"] for event in body["evidence"]],
        )

    def test_01_permit_reaches_protected_resource(self):
        status, body = self.request(
            "permit-001",
            issue_workload_identity(),
            issue_authority(),
        )

        self.assertEqual(200, status)
        self.assertEqual("PERMIT", body["decision"]["state"])
        self.assertEqual("ALLOWED", body["enforcement"])
        self.assertIn("decision_artifact", body)
        self.assertIn(
            "resource.operation",
            [event["event_type"] for event in body["evidence"]],
        )

    def test_02_missing_authority_is_denied(self):
        status, body = self.request(
            "deny-001",
            issue_workload_identity(),
        )

        self.assertEqual(403, status)
        self.assertEqual("DENY", body["decision"]["state"])
        self.assertEqual("DENIED", body["enforcement"])
        self.assert_resource_not_reached(body)

    def test_03_wrong_workload_is_denied(self):
        identity = issue_workload_identity(
            workload="workload://atp-lab/unrecognized"
        )
        authority = issue_authority(workload=identity.workload)

        status, body = self.request("wrong-workload-001", identity, authority)

        self.assertEqual(403, status)
        self.assertEqual("DENY", body["decision"]["state"])
        self.assert_resource_not_reached(body)

    def test_04_invalid_identity_is_authentication_failure(self):
        invalid_identity = replace(
            issue_workload_identity(),
            workload="workload://atp-lab/tampered",
        )

        status, body = self.request("invalid-identity-001", invalid_identity)

        self.assertEqual(401, status)
        self.assertEqual("FAILED", body["authentication"])
        self.assertEqual("authentication.failure", body["evidence"][0]["event_type"])

    def test_05_dependency_failure_is_indeterminate(self):
        status, body = self.request(
            "dependency-failure-001",
            issue_workload_identity(),
            issue_authority(),
            dependency_unavailable=True,
        )

        self.assertEqual(503, status)
        self.assertEqual("INDETERMINATE", body["decision"]["state"])
        self.assert_resource_not_reached(body)

    def test_06_replayed_decision_is_rejected_by_enforcement(self):
        identity = issue_workload_identity()
        authority = issue_authority()

        status, original = self.request("original-001", identity, authority)
        self.assertEqual(200, status)

        status, replay = self.request(
            "replay-002",
            identity,
            authority,
            decision_artifact=original["decision_artifact"],
        )

        self.assertEqual(403, status)
        self.assertEqual("PERMIT", replay["decision"]["state"])
        self.assertEqual("DENIED", replay["enforcement"])
        self.assert_resource_not_reached(replay)
        self.assertEqual(
            "authorization.decision.presented",
            replay["evidence"][0]["event_type"],
        )
        self.assertEqual(
            "decision does not bind to this request",
            replay["evidence"][1]["reason"],
        )

    def test_07_bypass_attempt_is_blocked(self):
        status, body = self.request(
            "bypass-001",
            path="/internal/payments/report",
        )

        self.assertEqual(403, status)
        self.assertEqual("BYPASS_BLOCKED", body["enforcement"])
        self.assertEqual(
            "enforcement.bypass_attempt",
            body["evidence"][0]["event_type"],
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)