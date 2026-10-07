"""Enforcement point stub (LC-08 shaped).

Makes authorization decisions effective on the protected path. A decision
without effective enforcement is not a completed control (ENF-001).

The stub validates, in order:
1. decision source signature (ENF-008, CTL-005),
2. decision-to-request binding, request_id and nonce (ENF-003, CTL-010),
3. validity window against the injected clock (CTL-004).

Alternate paths that bypass the decision are blocked and evidenced
(ENF-002, ENF-006, CTL-006, CTL-007). Enforcement never redefines policy
(ENF-012): it applies the decision or refuses the operation.

Co-location note (CM-003): in this single-process lab the ADF and the
enforcement stub share a process, but decision semantics, enforcement
semantics, failure states, and audit event types remain distinguished.
Shared-compromise evaluation is not performed by the lab.
"""
from __future__ import annotations

from dataclasses import replace
from typing import Any, Callable

import crypto
from clock import Clock, isoformat, parse_iso
from ids import SeededIds
from ledger import Ledger
from models import AuthorizationDecision, EnforcementOutcome


class EnforcementPoint:
    def __init__(
        self,
        clock: Clock,
        ids: SeededIds,
        ledger: Ledger,
        decision_key: bytes,
    ) -> None:
        self._clock = clock
        self._ids = ids
        self._ledger = ledger
        self._decision_key = decision_key

    def _record(
        self,
        request_id: str,
        decision_id: str | None,
        result: str,
        reason: str,
    ) -> EnforcementOutcome:
        outcome = EnforcementOutcome(
            outcome_id=self._ids.hex("enf"),
            decision_id=decision_id,
            request_id=request_id,
            result=result,  # type: ignore[arg-type]
            reason=reason,
            enforced_at=isoformat(self._clock.now()),
        )
        self._ledger.append(
            "enforcement.outcome",
            request_id,
            outcome_id=outcome.outcome_id,
            decision_id=decision_id,
            result=result,
            reason=reason,
        )
        return outcome

    def enforce(
        self,
        request_id: str,
        nonce: str,
        decision: AuthorizationDecision,
        protected_operation: Callable[[], dict[str, Any]],
    ) -> tuple[EnforcementOutcome, dict[str, Any] | None]:
        if not crypto.verify(decision.claims(), decision.signature, self._decision_key):
            outcome = self._record(request_id, decision.decision_id, "REJECTED",
                                   "decision source signature does not verify (ENF-008)")
            return outcome, None
        binding = decision.transaction_binding
        if binding.get("request_id") != request_id or binding.get("nonce") != nonce:
            outcome = self._record(request_id, decision.decision_id, "REJECTED",
                                   "decision not bound to this request/nonce (ENF-003)")
            return outcome, None
        now = self._clock.now()
        if not (parse_iso(decision.validity_not_before) <= now <= parse_iso(decision.validity_not_after)):
            outcome = self._record(request_id, decision.decision_id, "REJECTED",
                                   "decision outside validity window (CTL-004)")
            return outcome, None
        if decision.state == "PERMIT":
            result_record = protected_operation()
            self._ledger.append(
                "resource.operation",
                request_id,
                resource=decision.resource,
                action=decision.action,
                principal=decision.principal,
            )
            outcome = self._record(request_id, decision.decision_id, "ALLOWED",
                                   "permit decision applied to bound request")
            return outcome, result_record
        if decision.state == "DENY":
            outcome = self._record(request_id, decision.decision_id, "DENY",
                                   "deny decision applied; protected operation not invoked (AZ-021)")
            return outcome, None
        outcome = self._record(request_id, decision.decision_id, "DENY_INDETERMINATE",
                               "indeterminate decision; operation not invoked, never permit on unknown (AZ-022)")
        return outcome, None

    def direct_access(self, request_id: str, resource: str, action: str, principal: str) -> EnforcementOutcome:
        """Alternate path with no decision: blocked and evidenced."""
        self._ledger.append(
            "resource.bypass_attempt",
            request_id,
            resource=resource,
            action=action,
            reason="no authorization decision presented for protected path",
        )
        return self._record(request_id, None, "BYPASS_BLOCKED",
                            "alternate path blocked; no decision, no operation (ENF-002, ENF-006)")
