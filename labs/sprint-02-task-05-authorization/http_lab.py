import json
from http.server import BaseHTTPRequestHandler, HTTPServer

from authorization_lab import (
    AuthorizationDecisionFunction,
    EnforcementPoint,
    EvidenceLedger,
    PaymentsReportResource,
    make_request,
)


class PaymentsHandler(BaseHTTPRequestHandler):
    def send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")

        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path != "/payments/report":
            self.send_json(404, {"error": "not found"})
            return

        request_id = self.headers.get("X-Request-ID")
        if not request_id:
            self.send_json(400, {"error": "X-Request-ID is required"})
            return

        scenario = self.headers.get("X-Lab-Scenario")
        if scenario == "permit":
            request = make_request(request_id=request_id)
        elif scenario == "deny-no-authority":
            request = make_request(request_id=request_id, authority=None)
        else:
            self.send_json(
                400,
                {
                    "error": (
                        "X-Lab-Scenario must be permit or deny-no-authority"
                    )
                },
            )
            return

        ledger = EvidenceLedger()
        decision_function = AuthorizationDecisionFunction(ledger)
        resource = PaymentsReportResource(ledger)
        enforcement_point = EnforcementPoint(ledger, resource)

        decision = decision_function.evaluate(request)
        response = enforcement_point.enforce(request, decision)
        evidence = ledger.for_request(request_id)

        if response is not None:
            self.send_json(
                200,
                {
                    "report": response["report"],
                    "request_id": request_id,
                    "decision": {
                        "id": decision.decision_id,
                        "state": decision.state,
                        "policy_version": decision.policy_version,
                    },
                    "enforcement": "ALLOWED",
                    "evidence": evidence,
                },
            )
            return

        status_code = 403 if decision.state == "DENY" else 503
        self.send_json(
            status_code,
            {
                "request_id": request_id,
                "decision": {
                    "id": decision.decision_id,
                    "state": decision.state,
                    "policy_version": decision.policy_version,
                    "reason": decision.reason,
                },
                "enforcement": "DENIED",
                "evidence": evidence,
            },
        )

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8080), PaymentsHandler)
    print("HTTP lab listening on http://127.0.0.1:8080")
    server.serve_forever()