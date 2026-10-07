"""Bounded delegation issuance, revocation, and validation (LC-05/LC-06 shaped).

Grants are explicitly bounded: source, delegator, issuer, delegate, workload,
resource, action, constraints, expiration, and a revocation basis. Authority
is never flattened to a bare role string. The non-amplification check
(GrantedAuthority is within DelegableAuthority) is a field comparison against
the delegator's declared delegable scope.

The revocation store is seeded deterministically per scenario. Revocation
state unknown is distinct from not revoked (FR-012); in this bounded demo the
seeded store is authoritative, and disconnected-unknown handling is out of
scope and recorded as a residual.
"""
from __future__ import annotations

from dataclasses import replace
from datetime import timedelta
from typing import Any

import crypto
from clock import Clock, isoformat, parse_iso
from ids import SeededIds
from ledger import Ledger
from models import DelegationGrant

GRANT_TTL_SECONDS = 600


class DelegationIssuer:
    """LC-06 shaped: issues bounded delegation grants."""

    def __init__(self, clock: Clock, ids: SeededIds, ledger: Ledger, key: bytes, key_id: str) -> None:
        self._clock = clock
        self._ids = ids
        self._ledger = ledger
        self._key = key
        self._key_id = key_id

    def grant(
        self,
        source: str,
        delegator: str,
        delegate: str,
        workload: str,
        resource: str,
        action: str,
        constraints: dict[str, Any] | None = None,
        request_id: str | None = None,
    ) -> DelegationGrant:
        now = self._clock.now()
        grant = DelegationGrant(
            grant_id=self._ids.hex("grant"),
            source=source,
            delegator=delegator,
            issuer="delegation-issuer/atp-demo",
            delegate=delegate,
            workload=workload,
            resource=resource,
            action=action,
            constraints=constraints or {},
            issued_at=isoformat(now),
            expires_at=isoformat(now + timedelta(seconds=GRANT_TTL_SECONDS)),
            revocation_basis=f"revocation-list/atp-demo/{self._ids.seed}",
            key_id=self._key_id,
        )
        signed = replace(grant, signature=crypto.sign(grant.claims(), self._key))
        self._ledger.append(
            "delegation.granted",
            request_id,
            grant_id=signed.grant_id,
            source=source,
            delegator=delegator,
            issuer=signed.issuer,
            delegate=delegate,
            scope={"resource": resource, "action": action},
            key_id=self._key_id,
        )
        return signed


class RevocationStore:
    """Seeded revocation list. Deterministic per scenario."""

    def __init__(self, ledger: Ledger) -> None:
        self._ledger = ledger
        self._revoked: set[str] = set()

    def revoke(self, grant_id: str, request_id: str | None = None) -> None:
        self._revoked.add(grant_id)
        self._ledger.append(
            "delegation.revocation_check",
            request_id,
            grant_id=grant_id,
            revoked=True,
            basis="explicit revocation publication (seeded)",
        )

    def is_revoked(self, grant_id: str, request_id: str | None = None) -> bool:
        revoked = grant_id in self._revoked
        self._ledger.append(
            "delegation.revocation_check",
            request_id,
            grant_id=grant_id,
            revoked=revoked,
            basis="seeded revocation list lookup",
        )
        return revoked


class DelegationValidator:
    """LC-05 shaped: validates grants without amplifying authority."""

    def __init__(
        self,
        clock: Clock,
        ledger: Ledger,
        key: bytes,
        revocation: RevocationStore,
        delegable_scope: dict[str, list[str]],
    ) -> None:
        self._clock = clock
        self._ledger = ledger
        self._key = key
        self._revocation = revocation
        self._delegable_scope = delegable_scope

    def validate(
        self,
        grant: DelegationGrant,
        delegate: str,
        workload: str,
        resource: str,
        action: str,
        request_id: str | None = None,
    ) -> tuple[bool, str]:
        def fail(reason: str) -> tuple[bool, str]:
            self._ledger.append("delegation.validation", request_id, grant_id=grant.grant_id, valid=False, reason=reason)
            return False, reason

        if not crypto.verify(grant.claims(), grant.signature, self._key):
            return fail("grant signature does not verify; unverifiable grants yield no authority")
        if parse_iso(grant.expires_at) <= self._clock.now():
            return fail("grant expired")
        if grant.delegate != delegate or grant.workload != workload:
            return fail("grant not bound to this delegate/workload")
        if grant.resource != resource or grant.action != action:
            return fail("grant scope does not cover requested resource/action")
        allowed = self._delegable_scope.get(grant.delegator, [])
        if f"{resource}:{action}" not in allowed:
            return fail("grant exceeds delegator's delegable scope (non-amplification)")
        if self._revocation.is_revoked(grant.grant_id, request_id):
            return fail("grant revoked")
        self._ledger.append("delegation.validation", request_id, grant_id=grant.grant_id, valid=True, reason="ok")
        return True, "ok"
