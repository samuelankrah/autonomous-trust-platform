"""Trust artifacts for the decision-service demo.

Every artifact is a signed claim set. Authority provenance is carried as a
structured mapping (source, delegator, issuer, grant reference, scope,
constraints), never flattened to a bare role string (AZ-003).

All artifacts are synthetic and labeled not-for-production. They model trust
relationships; they are not a production identity, delegation, policy, or
key-management system.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Literal

DecisionState = Literal["PERMIT", "DENY", "INDETERMINATE"]
EnforcementResult = Literal["ALLOWED", "DENY", "DENY_INDETERMINATE", "REJECTED", "BYPASS_BLOCKED"]

SYNTHETIC_BANNER = "synthetic-not-for-production"


@dataclass(frozen=True)
class WorkloadIdentity:
    spiffe_id: str
    trust_domain: str
    principal: str
    issued_at: str
    expires_at: str
    key_id: str
    signature: str = ""

    def claims(self) -> dict[str, Any]:
        data = asdict(self)
        data.pop("signature")
        return data


@dataclass(frozen=True)
class DelegationGrant:
    grant_id: str
    source: str
    delegator: str
    issuer: str
    delegate: str
    workload: str
    resource: str
    action: str
    constraints: dict[str, Any] = field(default_factory=dict)
    issued_at: str = ""
    expires_at: str = ""
    revocation_basis: str = ""
    key_id: str = ""
    signature: str = ""

    def claims(self) -> dict[str, Any]:
        data = asdict(self)
        data.pop("signature")
        return data

    def provenance(self) -> dict[str, Any]:
        """Authority provenance, preserved as structure (AZ-003)."""
        return {
            "source": self.source,
            "delegator": self.delegator,
            "issuer": self.issuer,
            "grant_id": self.grant_id,
            "scope": {"resource": self.resource, "action": self.action},
            "constraints": self.constraints,
            "revocation_basis": self.revocation_basis,
        }


@dataclass(frozen=True)
class AttestationEvidence:
    evidence_id: str
    workload: str
    issued_at: str
    expires_at: str
    claims: dict[str, Any] = field(default_factory=dict)
    key_id: str = ""
    signature: str = ""

    def claims_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data.pop("signature")
        return data


@dataclass(frozen=True)
class AuthorizationDecision:
    decision_id: str
    request_id: str
    state: DecisionState
    principal: str
    workload: str
    resource: str
    action: str
    authority_provenance: dict[str, Any] | None
    policy_id: str
    policy_version: str
    freshness: dict[str, Any]
    validity_not_before: str
    validity_not_after: str
    transaction_binding: dict[str, Any]
    reason: str
    key_id: str
    signature: str = ""

    def claims(self) -> dict[str, Any]:
        data = asdict(self)
        data.pop("signature")
        return data


@dataclass(frozen=True)
class EnforcementOutcome:
    outcome_id: str
    decision_id: str | None
    request_id: str
    result: EnforcementResult
    reason: str
    enforced_at: str
