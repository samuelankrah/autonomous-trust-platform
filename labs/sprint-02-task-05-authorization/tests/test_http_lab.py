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

    def get_report(self, request_id, identity, authority=None):
        headers = {
            "X-Request-ID": request_id,
            "X-Workload-Identity": encode_artifact(identity),
        }
        if authority is not None:
            headers["X-Authority"] = encode_artifact(authority)

        connection = http.client.HTTPConnection(
            self.host,
            self.port,
            timeout=2,
        )
        connection.request("GET", "/payments/report", headers=headers)
        response = connection.getresponse()
        body = json.loads(response.read().decode("utf-8"))
        connection.close()
        return response.status, body

    def test_permit_reaches_protected_resource(self):
        status, body = self.get_report(
            "http-artifact-permit-001",
            issue_workload_identity(),
            issue_authority(),
        )

        self.assertEqual(200, status)
        self.assertEqual("PERMIT", body["decision"]["state"])
        self.assertEqual("ALLOWED", body["enforcement"])
        self.assertEqual(
            [
                "authorization.decision",
                "enforcement.outcome",
                "resource.operation",
            ],
            [event["event_type"] for event in body["evidence"]],
        )

    def test_missing_authority_is_denied_before_resource_operation(self):
        status, body = self.get_report(
            "http-artifact-deny-001",
            issue_workload_identity(),
        )

        self.assertEqual(403, status)
        self.assertEqual("DENY", body["decision"]["state"])
        self.assertEqual("DENIED", body["enforcement"])
        self.assertNotIn(
            "resource.operation",
            [event["event_type"] for event in body["evidence"]],
        )

    def test_tampered_authority_is_indeterminate(self):
        tampered_authority = replace(
            issue_authority(),
            resource="/payments/other",
        )
        status, body = self.get_report(
            "http-artifact-tamper-001",
            issue_workload_identity(),
            tampered_authority,
        )

        self.assertEqual(503, status)
        self.assertEqual("INDETERMINATE", body["decision"]["state"])
        self.assertEqual("DENIED", body["enforcement"])
        self.assertNotIn(
            "resource.operation",
            [event["event_type"] for event in body["evidence"]],
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)