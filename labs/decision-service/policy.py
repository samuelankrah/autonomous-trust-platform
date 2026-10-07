"""Authorization decision function (LC-07 shaped).

Evaluates an authorization request over explicitly validated identity context,
legitimately established authority, local policy, resource/action context,
required trust evidence, freshness, and revocation state. Returns a signed
decision bound to the request.

Decision logic preserves the Task 5 contract:
- valid identity alone is never authority (AZ-002),
- authority provenance is preserved as structure (AZ-003),
- attestation is an input, never a decision (AZ-011, AZ-012),
- freshness is input-specific (AZ-013),
- states are PERMIT, DENY, INDETERMINATE, kept distinct (AZ-019),
- unknown or stale required evidence yields INDETERMINATE, never permit
  (AZ-022, FR-007 class),
- permits are bounded and transaction-bound (AZ-020, AZ-017, ENF-003).
"""
from __future__ import annotations

from dataclasses import replace
from datetime import timedelta
from pathlib import Path
from typing import Any
import json

import crypto
from attestation import AttestationVerifier
from clock import Clock, isoformat, parse_iso
from delegation import DelegationValidator
from identity import IdentityValidator
from ids import SeededIds
from ledger import Ledger
from models import (
    AttestationEvidence,
    AuthorizationDecision,
    DelegationGrant,
    WorkloadIdentity,
)

POLICY_PATH = Path(__file__).with_name("policy.json")
DECISION_VALIDITY_SECONDS = 120


def load_policy() -> dict[str, Any]:
    with POLICY_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)


class AuthorizationDecisionFunction:
    def __init__(
        self,
        clock: Clock,
        ids: SeededIds,
        ledger: Ledger,
        key: bytes,
        key_id: str,
        identity_validator: IdentityValidator,
        delegation_validator: DelegationValidator,
        attestation_verifier: AttestationVerifier,
        policy: dict[str, Any],
    ) -> None:
        self._clock = clock
        self._ids = ids
        self._ledger = ledger
        self._key = key
        self._key_id = key_id
        self._identity_validator = identity_validator
        self._delegation_validator = delegation_validator
        self._attestation_verifier = attestation_verifier
        self._policy = policy

    def _finish(
        self,
        request_id: str,
        state: str,
        principal: str,
        workload: str,
        resource: str,
        action: str,
        provenance: dict[str, Any] | None,
        freshness: dict[str, Any],
        reason: str,
        nonce: str,
    ) -> AuthorizationDecision:
        now = self._clock.now()
        decision = AuthorizationDecision(
            decision_id=self._ids.hex("dec"),
            request_id=request_id,
            state=state,  # type: ignore[arg-type]
            principal=principal,
            workload=workload,
            resource=resource,
            action=action,
            authority_provenance=provenance,
            policy_id=self._policy["policy_id"],
            policy_version=self._policy["policy_version"],
            freshness=freshness,
            validity_not_before=isoformat(now),
            validity_not_after=isoformat(now + timedelta(seconds=DECISION_VALIDITY_SECONDS)),
            transaction_binding={"request_id": request_id, "nonce": nonce},
            reason=reason,
            key_id=self._key_id,
        )
        signed = replace(decision, signature=crypto.sign(decision.claims(), self._key))
        self._ledger.append(
            "authorization.decision",
            request_id,
            decision_id=signed.decision_id,
            state=state,
            principal=principal,
            workload=workload,
            resource=resource,
            action=action,
            policy_version=self._policy["policy_version"],
            reason=reason,
            key_id=self._key_id,
        )
        return signed

    def evaluate(
        self,
        request_id: str,
        principal: str,
        workload: str,
        resource: str,
        action: str,
        identity: WorkloadIdentity,
        grant: DelegationGrant | None,
        attestation: AttestationEvidence | None,
        nonce: str,
    ) -> AuthorizationDecision:
        now = self._clock.now()
        identity_age = int((now - parse_iso(identity.issued_at)).total_seconds())

        valid_identity, identity_reason = self._identity_validator.validate(identity, request_id)
        if not valid_identity:
            return self._finish(
                request_id, "DENY", principal, workload, resource, action, None,
                {"identity_age_seconds": identity_age, "authority_age_seconds": None, "attestation_age_seconds": None},
                f"identity invalid: {identity_reason}", nonce,
            )

        if grant is None:
            return self._finish(
                request_id, "DENY", principal, workload, resource, action, None,
                {"identity_age_seconds": identity_age, "authority_age_seconds": None, "attestation_age_seconds": None},
                "valid identity presents no authority; identity is not authorization (AZ-002)", nonce,
            )

        valid_grant, grant_reason = self._delegation_validator.validate(
            grant, principal, workload, resource, action, request_id
        )
        authority_age = int((now - parse_iso(grant.issued_at)).total_seconds())
        if not valid_grant:
            if "signature does not verify" in grant_reason or "unverifiable" in grant_reason:
                return self._finish(
                    request_id, "INDETERMINATE", principal, workload, resource, action, None,
                    {"identity_age_seconds": identity_age, "authority_age_seconds": authority_age, "attestation_age_seconds": None},
                    f"authority provenance cannot be verified: {grant_reason}", nonce,
                )
            return self._finish(
                request_id, "DENY", principal, workload, resource, action, None,
                {"identity_age_seconds": identity_age, "authority_age_seconds": authority_age, "attestation_age_seconds": None},
                f"delegated authority not recognized: {grant_reason}", nonce,
            )

        attestation_age: int | None = None
        if self._policy.get("requires_attestation"):
            if attestation is None:
                return self._finish(
                    request_id, "INDETERMINATE", principal, workload, resource, action, None,
                    {"identity_age_seconds": identity_age, "authority_age_seconds": authority_age, "attestation_age_seconds": None},
                    "policy requires attestation evidence; none presented (AZ-011)", nonce,
                )
            verdict, appraisal_reason, attestation_age = self._attestation_verifier.appraise(attestation, request_id)
            if verdict != "FRESH":
                return self._finish(
                    request_id, "INDETERMINATE", principal, workload, resource, action, None,
                    {"identity_age_seconds": identity_age, "authority_age_seconds": authority_age, "attestation_age_seconds": attestation_age},
                    f"required attestation evidence is {verdict}: {appraisal_reason} (AZ-022, never permit on unknown)", nonce,
                )

        return self._finish(
            request_id, "PERMIT", principal, workload, resource, action, grant.provenance(),
            {"identity_age_seconds": identity_age, "authority_age_seconds": authority_age, "attestation_age_seconds": attestation_age},
            "all required evidence valid within policy bounds", nonce,
        )
