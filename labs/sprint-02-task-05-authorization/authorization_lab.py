"""Synthetic authorization vertical slice for Sprint 2 Task 5.

This is a contained lab. Its signed artifacts model trust relationships; they
are not a production identity, delegation, policy, or key-management system.
"""
from __future__ import annotations

import hashlib
import hmac
import json
import secrets
from dataclasses import asdict, dataclass
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any, Literal

DecisionState = Literal["PERMIT", "DENY", "INDETERMINATE"]

DECISION_SOURCE = "synthetic-adf-v1"
AUTHORITY_SOURCE = "finance-control"
RESOURCE = "/payments/report"
ACTION = "READ"
ALLOWED_WORKLOAD = "workload://atp-lab/payments-reporter"
ALLOWED_PRINCIPAL = "principal://atp-lab/reporting-job"

# Synthetic lab keys only. Never reuse outside this contained example.
AUTHORITY_KEY = b"lab-authority-key-not-for-production"
IDENTITY_KEY = b"lab-identity-key-not-for-production"
DECISION_KEY = b"lab-decision-key-not-for-production"
POLICY_PATH = Path(__file__).with_name("policy.json")


def canonical(value: dict[str, Any]) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode()


def sign(value: dict[str, Any], key: bytes) -> str:
    return hmac.new(key, canonical(value), hashlib.sha256).hexdigest()


def verify(value: dict[str, Any], signature: str, key: bytes) -> bool:
    return hmac.compare_digest(sign(value, key), signature)


def now() -> datetime:
    return datetime.now(UTC)


def load_policy() -> dict[str, str]:
    """Load the deliberately small, versioned local policy for this lab."""
    with POLICY_PATH.open(encoding="utf-8") as file:
        return json.load(file)


@dataclass(frozen=True)
class WorkloadIdentity:
    workload: str
    principal: str
    expires_at: str
    signature: str

    def claims(self) -> dict[str, Any]:
        data = asdict(self)
        data.pop("signature")
        return data


@dataclass(frozen=True)
class Authority:
    authority_id: str
    source: str
    delegator: str
    delegate: str
    workload: str
    resource: str
    action: str
    expires_at: str
    signature: str

    def claims(self) -> dict[str, Any]:
        data = asdict(self)
        data.pop("signature")
        return data


@dataclass(frozen=True)
class Request:
    request_id: str
    workload: str
    principal: str
    resource: str
    action: str
    identity: WorkloadIdentity
    authority: Authority | None


@dataclass(frozen=True)
class Decision:
    decision_id: str
    source: str
    state: DecisionState
    request_id: str
    workload: str
    principal: str
    resource: str
    action: str
    policy_id: str
    policy_version: str
    reason: str
    issued_at: str
    signature: str

    def claims(self) -> dict[str, Any]:
        data = asdict(self)
        data.pop("signature")
        return data


class EvidenceLedger:
    def __init__(self) -> None:
        self.events: list[dict[str, Any]] = []

    def record(self, event_type: str, **fields: Any) -> None:
        self.events.append(
            {"event_type": event_type, "at": now().isoformat(), **fields}
        )

    def for_request(self, request_id: str) -> list[dict[str, Any]]:
        return [
            event for event in self.events
            if event.get("request_id") == request_id
        ]


def issue_authority(
    *,
    delegate: str = ALLOWED_PRINCIPAL,
    workload: str = ALLOWED_WORKLOAD,
    resource: str = RESOURCE,
    action: str = ACTION,
) -> Authority:
    claims = {
        "authority_id": f"authority-{secrets.token_hex(8)}",
        "source": AUTHORITY_SOURCE,
        "delegator": "principal://atp-lab/finance-control",
        "delegate": delegate,
        "workload": workload,
        "resource": resource,
        "action": action,
        "expires_at": (now() + timedelta(minutes=5)).isoformat(),
    }
    return Authority(**claims, signature=sign(claims, AUTHORITY_KEY))


def issue_workload_identity(
    *,
    workload: str = ALLOWED_WORKLOAD,
    principal: str = ALLOWED_PRINCIPAL,
) -> WorkloadIdentity:
    claims = {
        "workload": workload,
        "principal": principal,
        "expires_at": (now() + timedelta(minutes=5)).isoformat(),
    }
    return WorkloadIdentity(**claims, signature=sign(claims, IDENTITY_KEY))


class AuthorizationDecisionFunction:
    def __init__(self, ledger: EvidenceLedger, available: bool = True) -> None:
        self.ledger = ledger
        self.available = available

    def evaluate(self, request: Request) -> Decision:
        policy = load_policy()

        if not self.available:
            return self._decision(
                request, policy, "INDETERMINATE", "decision service unavailable"
            )

        identity = request.identity
        if not verify(identity.claims(), identity.signature, IDENTITY_KEY):
            return self._decision(
                request, policy, "INDETERMINATE",
                "workload identity cannot be verified"
            )
        if datetime.fromisoformat(identity.expires_at) <= now():
            return self._decision(
                request, policy, "DENY", "workload identity is expired"
            )
        if (identity.workload, identity.principal) != (
            request.workload, request.principal
        ):
            return self._decision(
                request, policy, "INDETERMINATE",
                "workload identity does not bind to request"
            )

        if (
            request.workload != policy["workload"]
            or request.principal != policy["principal"]
        ):
            return self._decision(
                request, policy, "DENY",
                "identity context is not locally recognized"
            )

        if (
            request.resource != policy["resource"]
            or request.action != policy["action"]
        ):
            return self._decision(
                request, policy, "DENY",
                "request is outside policy resource/action scope"
            )

        if request.authority is None:
            return self._decision(
                request, policy, "DENY",
                "valid identity has no recognized authority"
            )

        authority = request.authority
        if not verify(authority.claims(), authority.signature, AUTHORITY_KEY):
            return self._decision(
                request, policy, "INDETERMINATE",
                "authority provenance cannot be verified"
            )

        if datetime.fromisoformat(authority.expires_at) <= now():
            return self._decision(
                request, policy, "DENY", "authority is expired"
            )

        authority_matches_request = (
            authority.source,
            authority.delegate,
            authority.workload,
            authority.resource,
            authority.action,
        ) == (
            AUTHORITY_SOURCE,
            request.principal,
            request.workload,
            request.resource,
            request.action,
        )
        if not authority_matches_request:
            return self._decision(
                request, policy, "DENY",
                "authority is not recognized for this request"
            )

        return self._decision(
            request, policy, "PERMIT",
            "recognized bounded authority satisfies local policy"
        )

    def _decision(
        self,
        request: Request,
        policy: dict[str, str],
        state: DecisionState,
        reason: str,
    ) -> Decision:
        claims = {
            "decision_id": f"decision-{secrets.token_hex(8)}",
            "source": DECISION_SOURCE,
            "state": state,
            "request_id": request.request_id,
            "workload": request.workload,
            "principal": request.principal,
            "resource": request.resource,
            "action": request.action,
            "policy_id": policy["policy_id"],
            "policy_version": policy["version"],
            "reason": reason,
            "issued_at": now().isoformat(),
        }
        decision = Decision(**claims, signature=sign(claims, DECISION_KEY))
        self.ledger.record(
            "authorization.decision",
            request_id=request.request_id,
            decision_id=decision.decision_id,
            state=state,
            policy_version=policy["version"],
            reason=reason,
        )
        return decision


class PaymentsReportResource:
    def __init__(self, ledger: EvidenceLedger) -> None:
        self.ledger = ledger

    def read_after_enforcement(
        self, request: Request, decision_id: str
    ) -> dict[str, str]:
        self.ledger.record(
            "resource.operation",
            request_id=request.request_id,
            decision_id=decision_id,
            outcome="SUCCEEDED",
            resource=RESOURCE,
        )
        return {"report": "synthetic payments report"}

    def direct_read_attempt(self, request: Request) -> None:
        self.ledger.record(
            "resource.bypass_attempt",
            request_id=request.request_id,
            outcome="BLOCKED",
            resource=RESOURCE,
        )
        raise PermissionError("direct resource access is not an authorized path")


class EnforcementPoint:
    def __init__(
        self, ledger: EvidenceLedger, resource: PaymentsReportResource
    ) -> None:
        self.ledger = ledger
        self.resource = resource

    def enforce(
        self, request: Request, decision: Decision
    ) -> dict[str, str] | None:
        reason = None

        if (
            decision.source != DECISION_SOURCE
            or not verify(decision.claims(), decision.signature, DECISION_KEY)
        ):
            reason = "untrusted decision source"
        elif (
            decision.request_id,
            decision.workload,
            decision.principal,
            decision.resource,
            decision.action,
        ) != (
            request.request_id,
            request.workload,
            request.principal,
            request.resource,
            request.action,
        ):
            reason = "decision does not bind to this request"
        elif decision.state != "PERMIT":
            reason = f"decision state is {decision.state}"

        if reason:
            self.ledger.record(
                "enforcement.outcome",
                request_id=request.request_id,
                decision_id=decision.decision_id,
                outcome="DENIED",
                reason=reason,
            )
            return None

        self.ledger.record(
            "enforcement.outcome",
            request_id=request.request_id,
            decision_id=decision.decision_id,
            outcome="ALLOWED",
        )
        return self.resource.read_after_enforcement(
            request, decision.decision_id
        )


def make_request(**overrides: Any) -> Request:
    values: dict[str, Any] = {
        "request_id": f"request-{secrets.token_hex(8)}",
        "workload": ALLOWED_WORKLOAD,
        "principal": ALLOWED_PRINCIPAL,
        "resource": RESOURCE,
        "action": ACTION,
        "identity": issue_workload_identity(),
        "authority": issue_authority(),
    }
    values.update(overrides)
    return Request(**values)
