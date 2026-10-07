"""Synthetic workload identity issuance and validation (LC-01/LC-02 shaped).

Identities are SPIFFE-ID-shaped strings (spiffe://trust-domain/path). The
shape models the WP-001 namespace requirement; it does not adopt or endorse
SPIFFE or any implementation.

PLACEHOLDER (WP-001): bootstrap binding assurance (what evidence justifies the
initial binding of a workload to its SPIFFE ID) is an open architecture
question. This issuer takes binding rules as declared lab configuration and
labels them as synthetic placeholders. A passing lab does not resolve them.
"""
from __future__ import annotations

from dataclasses import replace
from datetime import timedelta

import crypto
from clock import Clock, isoformat, parse_iso
from ids import SeededIds
from ledger import Ledger
from models import WorkloadIdentity

TRUST_DOMAIN = "atp-demo"
IDENTITY_TTL_SECONDS = 300


def spiffe_id(path: str) -> str:
    return f"spiffe://{TRUST_DOMAIN}/{path}"


class IdentityIssuer:
    """LC-01 shaped: mints short-lived workload identities."""

    def __init__(self, clock: Clock, ids: SeededIds, ledger: Ledger, key: bytes, key_id: str) -> None:
        self._clock = clock
        self._ids = ids
        self._ledger = ledger
        self._key = key
        self._key_id = key_id

    def issue(self, path: str, principal: str, request_id: str | None = None) -> WorkloadIdentity:
        now = self._clock.now()
        identity = WorkloadIdentity(
            spiffe_id=spiffe_id(path),
            trust_domain=TRUST_DOMAIN,
            principal=principal,
            issued_at=isoformat(now),
            expires_at=isoformat(now + timedelta(seconds=IDENTITY_TTL_SECONDS)),
            key_id=self._key_id,
        )
        signed = replace(identity, signature=crypto.sign(identity.claims(), self._key))
        self._ledger.append(
            "identity.issued",
            request_id,
            spiffe_id=signed.spiffe_id,
            principal=principal,
            trust_domain=TRUST_DOMAIN,
            expires_at=signed.expires_at,
            key_id=self._key_id,
            placeholder="WP-001 bootstrap binding rules are synthetic lab configuration",
        )
        return signed


class IdentityValidator:
    """LC-02 shaped: validates presented workload identities."""

    def __init__(self, clock: Clock, ledger: Ledger, key: bytes) -> None:
        self._clock = clock
        self._ledger = ledger
        self._key = key

    def validate(self, identity: WorkloadIdentity, request_id: str | None = None) -> tuple[bool, str]:
        if not identity.spiffe_id.startswith(f"spiffe://{TRUST_DOMAIN}/"):
            reason = "trust domain not accepted by local policy"
            self._ledger.append("identity.validation", request_id, spiffe_id=identity.spiffe_id, valid=False, reason=reason)
            return False, reason
        if not crypto.verify(identity.claims(), identity.signature, self._key):
            reason = "identity signature does not verify"
            self._ledger.append("identity.validation", request_id, spiffe_id=identity.spiffe_id, valid=False, reason=reason)
            return False, reason
        if parse_iso(identity.expires_at) <= self._clock.now():
            reason = "identity expired"
            self._ledger.append("identity.validation", request_id, spiffe_id=identity.spiffe_id, valid=False, reason=reason)
            return False, reason
        self._ledger.append("identity.validation", request_id, spiffe_id=identity.spiffe_id, valid=True, reason="ok")
        return True, "ok"
