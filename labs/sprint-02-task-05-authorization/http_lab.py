import base64
import json
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler, HTTPServer

from authorization_lab import (
    ACTION,
    RESOURCE,
    Authority,
    AuthorizationDecisionFunction,
    EnforcementPoint,
    EvidenceLedger,
    PaymentsReportResource,
    Request,
    WorkloadIdentity,
)


def decode_artifact(header_value, artifact_type):
    padded = header_value + "=" * (-len(header_value) % 4)
    decoded = base64.urlsafe_b64decode(padded.encode("ascii"))
    claims = json.loads(decoded.decode("utf-8"))
    if not isinstance(claims, dict):
        raise ValueError("artifact must be a JSON object")
    return artifact_type(**claims)


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
        identity_header = self.headers.get("X-Workload-Identity")
        authority_header = self.headers.get("X-Authority")

        if not request_id:
            self.send_json(400, {"error": "X-Request-ID is required"})
            return

        if not identity_header:
            self.send_json(400, {"error": "X-Workload-Identity is required"})
            return

        try:
            identity = decode_artifact(identity_header, WorkloadIdentity)
            authority = (
                decode_artifact(authority_header, Authority)
                if authority_header
                else None
            )
        except (ValueError, TypeError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_json(400, {"error": "invalid authorization artifact"})
            return

        request = Request(
            request_id=request_id,
            workload=identity.workload,
            principal=identity.principal,
            resource=RESOURCE,
            action=ACTION,
            identity=identity,
            authority=authority,
        )

        ledger = EvidenceLedger()
        decision = AuthorizationDecisionFunction(ledger).evaluate(request)
        response = EnforcementPoint(
            ledger,
            PaymentsReportResource(ledger),
        ).enforce(request, decision)

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

        self.send_json(
            403 if decision.state == "DENY" else 503,
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