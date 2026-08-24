import base64
import json
from dataclasses import asdict
from http.server import BaseHTTPRequestHandler, HTTPServer

from authorization_lab import (
    ACTION,
    RESOURCE,
    Authority,
    AuthorizationDecisionFunction,
    Decision,
    EnforcementPoint,
    EvidenceLedger,
    IDENTITY_KEY,
    PaymentsReportResource,
    Request,
    WorkloadIdentity,
    verify,
)


def encode_artifact(artifact):
    payload = json.dumps(asdict(artifact), sort_keys=True, separators=(",", ":"))
    return base64.urlsafe_b64encode(payload.encode()).decode().rstrip("=")


def decode_artifact(header_value, artifact_type):
    padded = header_value + "=" * (-len(header_value) % 4)
    claims = json.loads(base64.urlsafe_b64decode(padded).decode())
    if not isinstance(claims, dict):
        raise ValueError("artifact must be a JSON object")
    return artifact_type(**claims)


class PaymentsHandler(BaseHTTPRequestHandler):
    def send_json(self, status_code, payload):
        body = json.dumps(payload).encode()
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        request_id = self.headers.get("X-Request-ID")

        if self.path == "/internal/payments/report":
            self.send_json(
                403,
                {
                    "request_id": request_id,
                    "enforcement": "BYPASS_BLOCKED",
                    "evidence": [{
                        "event_type": "enforcement.bypass_attempt",
                        "request_id": request_id,
                        "outcome": "BLOCKED",
                    }],
                },
            )
            return

        if self.path != "/payments/report":
            self.send_json(404, {"error": "not found"})
            return

        identity_header = self.headers.get("X-Workload-Identity")
        authority_header = self.headers.get("X-Authority")
        decision_header = self.headers.get("X-Authorization-Decision")

        if not request_id or not identity_header:
            self.send_json(400, {"error": "request ID and workload identity are required"})
            return

        try:
            identity = decode_artifact(identity_header, WorkloadIdentity)
            authority = decode_artifact(authority_header, Authority) if authority_header else None
        except (ValueError, TypeError, UnicodeDecodeError, json.JSONDecodeError):
            self.send_json(400, {"error": "invalid authorization artifact"})
            return

        if not verify(identity.claims(), identity.signature, IDENTITY_KEY):
            self.send_json(
                401,
                {
                    "request_id": request_id,
                    "authentication": "FAILED",
                    "reason": "workload identity cannot be verified",
                    "evidence": [{
                        "event_type": "authentication.failure",
                        "request_id": request_id,
                        "outcome": "FAILED",
                    }],
                },
            )
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

        if decision_header:
            try:
                decision = decode_artifact(decision_header, Decision)
            except (ValueError, TypeError, UnicodeDecodeError, json.JSONDecodeError):
                self.send_json(400, {"error": "invalid authorization decision"})
                return
            ledger.record(
                "authorization.decision.presented",
                request_id=request_id,
                decision_id=decision.decision_id,
                original_request_id=decision.request_id,
            )
        else:
            available = self.headers.get("X-Lab-Authorization-Dependency") != "unavailable"
            decision = AuthorizationDecisionFunction(ledger, available=available).evaluate(request)

        response = EnforcementPoint(ledger, PaymentsReportResource(ledger)).enforce(request, decision)
        evidence = ledger.for_request(request_id)

        if response is not None:
            self.send_json(200, {
                "report": response["report"],
                "request_id": request_id,
                "decision": {"id": decision.decision_id, "state": decision.state,
                             "policy_version": decision.policy_version},
                "decision_artifact": encode_artifact(decision),
                "enforcement": "ALLOWED",
                "evidence": evidence,
            })
            return

        self.send_json(
            503 if decision.state == "INDETERMINATE" else 403,
            {
                "request_id": request_id,
                "decision": {"id": decision.decision_id, "state": decision.state,
                             "policy_version": decision.policy_version,
                             "reason": decision.reason},
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