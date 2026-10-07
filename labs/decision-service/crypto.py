"""Synthetic cryptography for the decision-service demo.

HMAC-SHA256 over canonical JSON models integrity and binding at near-zero
cost. It does not model asymmetric issuance, key distribution, or compromise
semantics; that fidelity gap is recorded in the README and is out of scope
per WP-004.

All keys are synthetic, generated fresh per run, labeled not-for-production,
and never written to evidence files. Evidence records key identifiers and the
algorithm only (IV-012 discipline).
"""
from __future__ import annotations

import hashlib
import hmac
import json
import secrets
from typing import Any

ALGORITHM = "HMAC-SHA256"
KEY_LABEL = "synthetic-not-for-production"


def canonical_json(value: dict[str, Any]) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode()


def digest(value: dict[str, Any]) -> str:
    return hashlib.sha256(canonical_json(value)).hexdigest()


def sign(claims: dict[str, Any], key: bytes) -> str:
    return hmac.new(key, canonical_json(claims), hashlib.sha256).hexdigest()


def verify(claims: dict[str, Any], signature: str, key: bytes) -> bool:
    return hmac.compare_digest(sign(claims, key), signature)


def fingerprint(value: dict[str, Any]) -> str:
    return digest(value)


def generate_key() -> bytes:
    """Fresh per-run synthetic key material. Never persisted."""
    return secrets.token_bytes(32)
