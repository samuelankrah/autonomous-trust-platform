import http.client
import json
import sys
import threading
import unittest
from http.server import HTTPServer
from pathlib import Path

LAB_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(LAB_ROOT))

from http_lab import PaymentsHandler


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

    def get_report(self, request_id, scenario):
        connection = http.client.HTTPConnection(
            self.host,
            self.port,
            timeout=2,
        )
        connection.request(
            "GET",
            "/payments/report",
            headers={
                "X-Request-ID": request_id,
                "X-Lab-Scenario": scenario,
            },
        )
        response = connection.getresponse()
        body = json.loads(response.read().decode("utf-8"))
        connection.close()
        return response.status, body

    def test_permit_is_enforced_and_reaches_resource(self):
        status, body = self.get_report("http-permit-001", "permit")

        self.assertEqual(200, status)
        self.assertEqual("PERMIT", body["decision"]["state"])
        self.assertEqual("ALLOWED", body["enforcement"])

        event_types = [event["event_type"] for event in body["evidence"]]
        self.assertEqual(
            [
                "authorization.decision",
                "enforcement.outcome",
                "resource.operation",
            ],
            event_types,
        )

    def test_missing_authority_is_denied_before_resource_operation(self):
        status, body = self.get_report(
            "http-deny-001",
            "deny-no-authority",
        )

        self.assertEqual(403, status)
        self.assertEqual("DENY", body["decision"]["state"])
        self.assertEqual("DENIED", body["enforcement"])
        self.assertEqual(
            "valid identity has no recognized authority",
            body["decision"]["reason"],
        )

        event_types = [event["event_type"] for event in body["evidence"]]
        self.assertNotIn("resource.operation", event_types)


if __name__ == "__main__":
    unittest.main(verbosity=2)
