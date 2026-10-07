"""CLI scenario walkthrough: asserted demonstrations, not narration.

Each scenario declares, before running, the requirement IDs it exercises, the
expected decision state, the expected enforcement outcome, and the expected
evidence shape. The runner executes, asserts every check in code, and prints a
per-scenario verdict with the mapped IDs. A scenario that passes on eyeball
review of logs but has no assertion does not count as demonstration
(FR-WP4-020, IV-002, IV-003).
"""
from __future__ import annotations

from dataclasses import replace
from typing import Any, Callable

from service import DecisionService

RESOURCE = "/reports/quarterly"
ACTION = "READ"
PRINCIPAL = "principal://atp-demo/reporting-job"
WORKLOAD_PATH = "payments-reporter"
AUTHORITY_SOURCE = "finance-control"
DELEGATOR = "finance-control"


def _base_setup(svc: DecisionService, rid: str):
    identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
    attestation = svc.attestation_issuer.attest(f"spiffe://atp-demo/{WORKLOAD_PATH}")
    return identity, attestation


def _grant(svc: DecisionService, identity, rid: str):
    return svc.delegation_issuer.grant(
        source=AUTHORITY_SOURCE, delegator=DELEGATOR, delegate=PRINCIPAL,
        workload=identity.spiffe_id, resource=RESOURCE, action=ACTION,
        constraints={"purpose": "quarterly-reporting"}, request_id=rid,
    )


def _protected_op():
    return {"report": "quarterly-figures", "rows": 42}


Check = tuple[str, list[str], bool, str]


def scenario_happy_path(svc: DecisionService) -> dict[str, Any]:
    """PERMIT reaches the protected operation with correlated evidence."""
    req_ids = ["AZ-001", "AZ-003", "AZ-004", "AZ-005", "AZ-006", "AZ-013", "AZ-016",
               "AZ-017", "AZ-019", "AZ-020", "ENF-001", "ENF-003", "ENF-008",
               "ENF-010", "CTL-001", "CTL-002", "CTL-003", "CTL-004", "CTL-005",
               "CTL-008", "CTL-010", "CTL-012"]
    rid = svc.ids.hex("req")
    nonce = svc.ids.nonce()
    identity, attestation = _base_setup(svc, rid)
    grant = _grant(svc, identity, rid)
    decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                identity, grant, attestation, nonce)
    outcome, result = svc.enforcer.enforce(rid, nonce, decision, _protected_op)
    events = svc.ledger.for_request(rid)
    types = [e["type"] for e in events]
    checks: list[Check] = [
        ("decision-state-permit", ["AZ-019"], decision.state == "PERMIT", f"state={decision.state}"),
        ("permit-bounded", ["AZ-020"], bool(decision.validity_not_after > decision.validity_not_before), "validity window present"),
        ("transaction-bound", ["AZ-017", "ENF-003", "CTL-010"],
         decision.transaction_binding == {"request_id": rid, "nonce": nonce}, "binding matches request"),
        ("provenance-structured", ["AZ-003", "CTL-001"],
         isinstance(decision.authority_provenance, dict) and decision.authority_provenance.get("delegator") == DELEGATOR,
         "provenance is a mapping, not a role string"),
        ("policy-version-observed", ["AZ-016"], decision.policy_version == svc.policy["policy_version"], "policy version recorded"),
        ("freshness-per-input", ["AZ-013"],
         set(decision.freshness) == {"identity_age_seconds", "authority_age_seconds", "attestation_age_seconds"},
         "per-input freshness preserved"),
        ("enforcement-allowed", ["ENF-001", "ENF-010"], outcome.result == "ALLOWED" and result is not None, "protected op invoked"),
        ("evidence-correlated", ["CTL-008", "ENF-010"],
         types == ["identity.issued", "delegation.granted", "identity.validation",
                   "delegation.revocation_check", "delegation.validation",
                   "attestation.appraisal", "authorization.decision",
                   "resource.operation", "enforcement.outcome"],
         f"sequence={types}"),
        ("decision-outcome-linked", ["CTL-008"],
         all(e.get("decision_id") == decision.decision_id for e in events if e["type"] in ("authorization.decision", "enforcement.outcome")),
         "decision_id correlates decision and outcome"),
    ]
    return {"name": "happy-path", "requirement_ids": req_ids, "checks": checks}


def scenario_identity_no_authority(svc: DecisionService) -> dict[str, Any]:
    """Valid identity with no authority is denied. Identity is not authorization."""
    req_ids = ["AZ-002", "AZ-019", "AZ-021", "ENF-010", "CTL-008"]
    rid = svc.ids.hex("req")
    nonce = svc.ids.nonce()
    identity, attestation = _base_setup(svc, rid)
    decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                identity, None, attestation, nonce)
    outcome, result = svc.enforcer.enforce(rid, nonce, decision, _protected_op)
    events = svc.ledger.for_request(rid)
    checks: list[Check] = [
        ("decision-state-deny", ["AZ-019"], decision.state == "DENY", f"state={decision.state}"),
        ("identity-not-authority", ["AZ-002"], decision.authority_provenance is None, "no provenance without authority"),
        ("deny-not-misreported", ["AZ-021"], outcome.result == "DENY" and result is None, "deny applied, op not invoked"),
        ("no-resource-operation", ["ENF-010"], not any(e["type"] == "resource.operation" for e in events), "protected path untouched"),
    ]
    return {"name": "identity-no-authority", "requirement_ids": req_ids, "checks": checks}


def scenario_revoked_delegation(svc: DecisionService) -> dict[str, Any]:
    """A revoked grant is denied. Revocation invalidates the decision path."""
    req_ids = ["AZ-015", "AZ-019", "CTL-009", "FR-011", "FR-012"]
    rid = svc.ids.hex("req")
    nonce = svc.ids.nonce()
    identity, attestation = _base_setup(svc, rid)
    grant = _grant(svc, identity, rid)
    svc.revocation.revoke(grant.grant_id, rid)
    decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                identity, grant, attestation, nonce)
    outcome, result = svc.enforcer.enforce(rid, nonce, decision, _protected_op)
    checks: list[Check] = [
        ("decision-state-deny", ["AZ-019", "AZ-015"], decision.state == "DENY", f"state={decision.state}"),
        ("revocation-recorded", ["AZ-015", "CTL-009"],
         any(e["type"] == "delegation.revocation_check" and e["revoked"] for e in svc.ledger.for_request(rid)),
         "revocation check evidenced"),
        ("deny-reason-names-revocation", ["AZ-015"], "revoked" in decision.reason, f"reason={decision.reason}"),
        ("op-not-invoked", ["AZ-015"], result is None and outcome.result == "DENY", "no protected operation"),
    ]
    return {"name": "revoked-delegation", "requirement_ids": req_ids, "checks": checks}


def scenario_stale_attestation(svc: DecisionService) -> dict[str, Any]:
    """Stale required attestation yields INDETERMINATE, never permit."""
    req_ids = ["AZ-011", "AZ-012", "AZ-019", "AZ-022", "ENF-010", "FR-007", "CTL-011"]
    rid = svc.ids.hex("req")
    nonce = svc.ids.nonce()
    # Attestation evidence is issued first, then the clock moves past the
    # declared synthetic freshness threshold while identity and authority are
    # (re-)issued fresh, so only the attestation input is stale.
    attestation = svc.attestation_issuer.attest(f"spiffe://atp-demo/{WORKLOAD_PATH}")
    svc.clock.advance(301)
    svc.ledger.append("lab.clock_fault", rid, fault="advance",
                      detail="clock advanced 301s past the declared synthetic attestation threshold; identity and grant issued fresh after the advance")
    identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid)
    grant = _grant(svc, identity, rid)
    decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                identity, grant, attestation, nonce)
    outcome, result = svc.enforcer.enforce(rid, nonce, decision, _protected_op)
    events = svc.ledger.for_request(rid)
    checks: list[Check] = [
        ("decision-state-indeterminate", ["AZ-019", "AZ-022"], decision.state == "INDETERMINATE", f"state={decision.state}"),
        ("indeterminate-not-permit", ["AZ-022"], decision.state != "PERMIT", "unknown never becomes permit"),
        ("indeterminate-distinct-from-deny", ["AZ-019"], outcome.result == "DENY_INDETERMINATE", f"enforcement={outcome.result}"),
        ("attestation-appraised-stale", ["AZ-011", "AZ-012", "FR-007"],
         any(e["type"] == "attestation.appraisal" and e["verdict"] == "STALE" for e in events),
         "stale appraisal evidenced with threshold"),
        ("unknown-preserved", ["CTL-011"], "STALE" in decision.reason or "stale" in decision.reason, "unknown state named in reason"),
        ("op-not-invoked", ["AZ-022"], result is None, "no protected operation on indeterminate"),
    ]
    return {"name": "stale-attestation", "requirement_ids": req_ids, "checks": checks}


def scenario_tampered_decision(svc: DecisionService) -> dict[str, Any]:
    """A decision whose claims were altered after signing is rejected."""
    req_ids = ["ENF-008", "CTL-005", "ENF-010"]
    rid = svc.ids.hex("req")
    nonce = svc.ids.nonce()
    identity, attestation = _base_setup(svc, rid)
    grant = _grant(svc, identity, rid)
    decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                identity, grant, attestation, nonce)
    tampered = replace(decision, resource="/admin/root")
    outcome, result = svc.enforcer.enforce(rid, nonce, tampered, _protected_op)
    checks: list[Check] = [
        ("source-validation-rejects", ["ENF-008", "CTL-005"], outcome.result == "REJECTED" and result is None,
         f"enforcement={outcome.result}"),
        ("reason-names-source", ["ENF-008"], "signature" in outcome.reason, f"reason={outcome.reason}"),
    ]
    return {"name": "tampered-decision", "requirement_ids": req_ids, "checks": checks}


def scenario_replayed_decision(svc: DecisionService) -> dict[str, Any]:
    """A valid decision presented for a different request is rejected."""
    req_ids = ["ENF-003", "CTL-010", "AZ-017", "AZ-018"]
    rid_a = svc.ids.hex("req")
    nonce_a = svc.ids.nonce()
    identity, attestation = _base_setup(svc, rid_a)
    grant = _grant(svc, identity, rid_a)
    decision = svc.adf.evaluate(rid_a, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
                                identity, grant, attestation, nonce_a)
    outcome_a, result_a = svc.enforcer.enforce(rid_a, nonce_a, decision, _protected_op)
    rid_b = svc.ids.hex("req")
    nonce_b = svc.ids.nonce()
    outcome, result = svc.enforcer.enforce(rid_b, nonce_b, decision, _protected_op)
    checks: list[Check] = [
        ("original-use-allowed", ["ENF-001"], outcome_a.result == "ALLOWED" and result_a is not None,
         "legitimate first use succeeds"),
        ("replay-rejected", ["ENF-003", "CTL-010"], outcome.result == "REJECTED" and result is None,
         f"enforcement={outcome.result}"),
        ("reason-names-binding", ["ENF-003"], "bound" in outcome.reason, f"reason={outcome.reason}"),
    ]
    return {"name": "replayed-decision", "requirement_ids": req_ids, "checks": checks}


def scenario_bypass_attempt(svc: DecisionService) -> dict[str, Any]:
    """Direct access with no decision is blocked and evidenced."""
    req_ids = ["ENF-001", "ENF-002", "ENF-006", "ENF-007", "CTL-006", "CTL-007"]
    rid = svc.ids.hex("req")
    outcome = svc.enforcer.direct_access(rid, RESOURCE, ACTION, PRINCIPAL)
    events = svc.ledger.for_request(rid)
    checks: list[Check] = [
        ("bypass-blocked", ["ENF-002", "ENF-006"], outcome.result == "BYPASS_BLOCKED", f"enforcement={outcome.result}"),
        ("bypass-evidenced", ["CTL-006", "CTL-007", "ENF-010"],
         any(e["type"] == "resource.bypass_attempt" for e in events), "attempt recorded in ledger"),
        ("no-decision-no-operation", ["ENF-001"], outcome.decision_id is None, "nothing to enforce without a decision"),
    ]
    return {"name": "bypass-attempt", "requirement_ids": req_ids, "checks": checks}


SCENARIOS: dict[str, Callable[[DecisionService], dict[str, Any]]] = {
    "happy-path": scenario_happy_path,
    "identity-no-authority": scenario_identity_no_authority,
    "revoked-delegation": scenario_revoked_delegation,
    "stale-attestation": scenario_stale_attestation,
    "tampered-decision": scenario_tampered_decision,
    "replayed-decision": scenario_replayed_decision,
    "bypass-attempt": scenario_bypass_attempt,
}
