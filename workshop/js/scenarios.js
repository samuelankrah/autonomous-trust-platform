// Scenario walkthroughs, ported line for line from scenarios.py.
// Each scenario returns its name, declared requirement IDs, and checks
// as [check_id, requirement_ids, passed, detail] tuples.

export const RESOURCE = "/reports/quarterly";
export const ACTION = "READ";
export const PRINCIPAL = "principal://atp-demo/reporting-job";
export const WORKLOAD_PATH = "payments-reporter";
export const AUTHORITY_SOURCE = "finance-control";
export const DELEGATOR = "finance-control";

// Python repr of a list of strings: single quotes, ", " separators.
export function pyStrListRepr(items) {
  return "[" + items.map((item) => "'" + item + "'").join(", ") + "]";
}

function baseSetup(svc, rid) {
  const identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid);
  const attestation = svc.attestation_issuer.attest("spiffe://atp-demo/" + WORKLOAD_PATH);
  return [identity, attestation];
}

function grantFor(svc, identity, rid) {
  return svc.delegation_issuer.grant(
    AUTHORITY_SOURCE, DELEGATOR, PRINCIPAL,
    identity.spiffe_id, RESOURCE, ACTION,
    { purpose: "quarterly-reporting" }, rid
  );
}

function protectedOp() {
  return { report: "quarterly-figures", rows: 42 };
}

function arrayEquals(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function scenarioHappyPath(svc) {
  const reqIds = ["AZ-001", "AZ-003", "AZ-004", "AZ-005", "AZ-006", "AZ-013", "AZ-016",
    "AZ-017", "AZ-019", "AZ-020", "ENF-001", "ENF-003", "ENF-008",
    "ENF-010", "CTL-001", "CTL-002", "CTL-003", "CTL-004", "CTL-005",
    "CTL-008", "CTL-010", "CTL-012"];
  const rid = svc.ids.hex("req");
  const nonce = svc.ids.nonce();
  const [identity, attestation] = baseSetup(svc, rid);
  const grant = grantFor(svc, identity, rid);
  const decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
    identity, grant, attestation, nonce);
  const [outcome, result] = svc.enforcer.enforce(rid, nonce, decision, protectedOp);
  const events = svc.ledger.for_request(rid);
  const types = events.map((e) => e.type);
  const checks = [
    ["decision-state-permit", ["AZ-019"], decision.state === "PERMIT", "state=" + decision.state],
    ["permit-bounded", ["AZ-020"], Boolean(decision.validity_not_after > decision.validity_not_before), "validity window present"],
    ["transaction-bound", ["AZ-017", "ENF-003", "CTL-010"],
      decision.transaction_binding !== null && typeof decision.transaction_binding === "object" &&
      Object.keys(decision.transaction_binding).length === 2 &&
      decision.transaction_binding.request_id === rid && decision.transaction_binding.nonce === nonce,
      "binding matches request"],
    ["provenance-structured", ["AZ-003", "CTL-001"],
      decision.authority_provenance !== null && typeof decision.authority_provenance === "object" &&
      !Array.isArray(decision.authority_provenance) && decision.authority_provenance.delegator === DELEGATOR,
      "provenance is a mapping, not a role string"],
    ["policy-version-observed", ["AZ-016"], decision.policy_version === svc.policy.policy_version, "policy version recorded"],
    ["freshness-per-input", ["AZ-013"],
      arrayEquals(Object.keys(decision.freshness).sort(),
        ["attestation_age_seconds", "authority_age_seconds", "identity_age_seconds"]),
      "per-input freshness preserved"],
    ["enforcement-allowed", ["ENF-001", "ENF-010"], outcome.result === "ALLOWED" && result !== null, "protected op invoked"],
    ["evidence-correlated", ["CTL-008", "ENF-010"],
      arrayEquals(types, ["identity.issued", "delegation.granted", "identity.validation",
        "delegation.revocation_check", "delegation.validation",
        "attestation.appraisal", "authorization.decision",
        "resource.operation", "enforcement.outcome"]),
      "sequence=" + pyStrListRepr(types)],
    ["decision-outcome-linked", ["CTL-008"],
      events.filter((e) => e.type === "authorization.decision" || e.type === "enforcement.outcome")
        .every((e) => e.decision_id === decision.decision_id),
      "decision_id correlates decision and outcome"],
  ];
  return { name: "happy-path", requirement_ids: reqIds, checks: checks };
}

export function scenarioIdentityNoAuthority(svc) {
  const reqIds = ["AZ-002", "AZ-019", "AZ-021", "ENF-010", "CTL-008"];
  const rid = svc.ids.hex("req");
  const nonce = svc.ids.nonce();
  const [identity, attestation] = baseSetup(svc, rid);
  const decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
    identity, null, attestation, nonce);
  const [outcome, result] = svc.enforcer.enforce(rid, nonce, decision, protectedOp);
  const events = svc.ledger.for_request(rid);
  const checks = [
    ["decision-state-deny", ["AZ-019"], decision.state === "DENY", "state=" + decision.state],
    ["identity-not-authority", ["AZ-002"], decision.authority_provenance === null, "no provenance without authority"],
    ["deny-not-misreported", ["AZ-021"], outcome.result === "DENY" && result === null, "deny applied, op not invoked"],
    ["no-resource-operation", ["ENF-010"], !events.some((e) => e.type === "resource.operation"), "protected path untouched"],
  ];
  return { name: "identity-no-authority", requirement_ids: reqIds, checks: checks };
}

export function scenarioRevokedDelegation(svc) {
  const reqIds = ["AZ-015", "AZ-019", "CTL-009", "FR-011", "FR-012"];
  const rid = svc.ids.hex("req");
  const nonce = svc.ids.nonce();
  const [identity, attestation] = baseSetup(svc, rid);
  const grant = grantFor(svc, identity, rid);
  svc.revocation.revoke(grant.grant_id, rid);
  const decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
    identity, grant, attestation, nonce);
  const [outcome, result] = svc.enforcer.enforce(rid, nonce, decision, protectedOp);
  const checks = [
    ["decision-state-deny", ["AZ-019", "AZ-015"], decision.state === "DENY", "state=" + decision.state],
    ["revocation-recorded", ["AZ-015", "CTL-009"],
      svc.ledger.for_request(rid).some((e) => e.type === "delegation.revocation_check" && e.revoked),
      "revocation check evidenced"],
    ["deny-reason-names-revocation", ["AZ-015"], decision.reason.includes("revoked"), "reason=" + decision.reason],
    ["op-not-invoked", ["AZ-015"], result === null && outcome.result === "DENY", "no protected operation"],
  ];
  return { name: "revoked-delegation", requirement_ids: reqIds, checks: checks };
}

export function scenarioStaleAttestation(svc) {
  const reqIds = ["AZ-011", "AZ-012", "AZ-019", "AZ-022", "ENF-010", "FR-007", "CTL-011"];
  const rid = svc.ids.hex("req");
  const nonce = svc.ids.nonce();
  // Attestation evidence is issued first, then the clock moves past the
  // declared synthetic freshness threshold while identity and authority
  // are (re-)issued fresh, so only the attestation input is stale.
  const attestation = svc.attestation_issuer.attest("spiffe://atp-demo/" + WORKLOAD_PATH);
  svc.clock.advance(301);
  svc.ledger.append("lab.clock_fault", rid, {
    fault: "advance",
    detail: "clock advanced 301s past the declared synthetic attestation threshold; identity and grant issued fresh after the advance",
  });
  const identity = svc.identity_issuer.issue(WORKLOAD_PATH, PRINCIPAL, rid);
  const grant = grantFor(svc, identity, rid);
  const decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
    identity, grant, attestation, nonce);
  const [outcome, result] = svc.enforcer.enforce(rid, nonce, decision, protectedOp);
  const events = svc.ledger.for_request(rid);
  const checks = [
    ["decision-state-indeterminate", ["AZ-019", "AZ-022"], decision.state === "INDETERMINATE", "state=" + decision.state],
    ["indeterminate-not-permit", ["AZ-022"], decision.state !== "PERMIT", "unknown never becomes permit"],
    ["indeterminate-distinct-from-deny", ["AZ-019"], outcome.result === "DENY_INDETERMINATE", "enforcement=" + outcome.result],
    ["attestation-appraised-stale", ["AZ-011", "AZ-012", "FR-007"],
      events.some((e) => e.type === "attestation.appraisal" && e.verdict === "STALE"),
      "stale appraisal evidenced with threshold"],
    ["unknown-preserved", ["CTL-011"], decision.reason.includes("STALE") || decision.reason.includes("stale"), "unknown state named in reason"],
    ["op-not-invoked", ["AZ-022"], result === null, "no protected operation on indeterminate"],
  ];
  return { name: "stale-attestation", requirement_ids: reqIds, checks: checks };
}

export function scenarioTamperedDecision(svc) {
  const reqIds = ["ENF-008", "CTL-005", "ENF-010"];
  const rid = svc.ids.hex("req");
  const nonce = svc.ids.nonce();
  const [identity, attestation] = baseSetup(svc, rid);
  const grant = grantFor(svc, identity, rid);
  const decision = svc.adf.evaluate(rid, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
    identity, grant, attestation, nonce);
  const tampered = { ...decision, resource: "/admin/root" };
  const [outcome, result] = svc.enforcer.enforce(rid, nonce, tampered, protectedOp);
  const checks = [
    ["source-validation-rejects", ["ENF-008", "CTL-005"], outcome.result === "REJECTED" && result === null,
      "enforcement=" + outcome.result],
    ["reason-names-source", ["ENF-008"], outcome.reason.includes("signature"), "reason=" + outcome.reason],
  ];
  return { name: "tampered-decision", requirement_ids: reqIds, checks: checks };
}

export function scenarioReplayedDecision(svc) {
  const reqIds = ["ENF-003", "CTL-010", "AZ-017", "AZ-018"];
  const ridA = svc.ids.hex("req");
  const nonceA = svc.ids.nonce();
  const [identity, attestation] = baseSetup(svc, ridA);
  const grant = grantFor(svc, identity, ridA);
  const decision = svc.adf.evaluate(ridA, PRINCIPAL, identity.spiffe_id, RESOURCE, ACTION,
    identity, grant, attestation, nonceA);
  const [outcomeA, resultA] = svc.enforcer.enforce(ridA, nonceA, decision, protectedOp);
  const ridB = svc.ids.hex("req");
  const nonceB = svc.ids.nonce();
  const [outcome, result] = svc.enforcer.enforce(ridB, nonceB, decision, protectedOp);
  const checks = [
    ["original-use-allowed", ["ENF-001"], outcomeA.result === "ALLOWED" && resultA !== null,
      "legitimate first use succeeds"],
    ["replay-rejected", ["ENF-003", "CTL-010"], outcome.result === "REJECTED" && result === null,
      "enforcement=" + outcome.result],
    ["reason-names-binding", ["ENF-003"], outcome.reason.includes("bound"), "reason=" + outcome.reason],
  ];
  return { name: "replayed-decision", requirement_ids: reqIds, checks: checks };
}

export function scenarioBypassAttempt(svc) {
  const reqIds = ["ENF-001", "ENF-002", "ENF-006", "ENF-007", "CTL-006", "CTL-007"];
  const rid = svc.ids.hex("req");
  const outcome = svc.enforcer.direct_access(rid, RESOURCE, ACTION, PRINCIPAL);
  const events = svc.ledger.for_request(rid);
  const checks = [
    ["bypass-blocked", ["ENF-002", "ENF-006"], outcome.result === "BYPASS_BLOCKED", "enforcement=" + outcome.result],
    ["bypass-evidenced", ["CTL-006", "CTL-007", "ENF-010"],
      events.some((e) => e.type === "resource.bypass_attempt"), "attempt recorded in ledger"],
    ["no-decision-no-operation", ["ENF-001"], outcome.decision_id === null, "nothing to enforce without a decision"],
  ];
  return { name: "bypass-attempt", requirement_ids: reqIds, checks: checks };
}

export const SCENARIOS = {
  "happy-path": scenarioHappyPath,
  "identity-no-authority": scenarioIdentityNoAuthority,
  "revoked-delegation": scenarioRevokedDelegation,
  "stale-attestation": scenarioStaleAttestation,
  "tampered-decision": scenarioTamperedDecision,
  "replayed-decision": scenarioReplayedDecision,
  "bypass-attempt": scenarioBypassAttempt,
};
