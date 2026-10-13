// Fixture builder, mirroring tools/export_fixtures.py. The exporter adds
// observation only: it wraps the service components to record the
// objects the engine itself creates, and reads the evidence pattern
// back from the ledger. Each wrapper calls the original method exactly
// once, never appends ledger events, and never draws identifiers.

import { deepClone } from "./canonical.js";
import {
  attestationClaimsDict,
  decisionClaims,
  grantClaims,
  grantProvenance,
  identityClaims,
  outcomeClaims,
} from "./models.js";
import { ACTION, PRINCIPAL, RESOURCE, SCENARIOS, WORKLOAD_PATH } from "./scenarios.js";
import { newService } from "./service.js";

export const CONTRACT_VERSION = "scenario-contract-v1";
export const SCENARIO_NAMES = Object.keys(SCENARIOS);

function identitySummary(identity) {
  const data = deepClone(identityClaims(identity));
  data.signature_present = Boolean(identity.signature);
  return data;
}

function grantSummary(grant) {
  const data = deepClone(grantClaims(grant));
  data.provenance = deepClone(grantProvenance(grant));
  data.signature_present = Boolean(grant.signature);
  return data;
}

function attestationSummary(evidence) {
  const data = deepClone(attestationClaimsDict(evidence));
  data.signature_present = Boolean(evidence.signature);
  return data;
}

function decisionSummary(decision) {
  const data = deepClone(decisionClaims(decision));
  data.signature_present = Boolean(decision.signature);
  return data;
}

function outcomeSummary(outcome) {
  return deepClone(outcomeClaims(outcome));
}

function noteRequest(capture, requestId, nonce) {
  for (const entry of capture.requests) {
    if (entry.request_id === requestId) {
      if (entry.nonce === null && nonce !== null) entry.nonce = nonce;
      return;
    }
  }
  capture.requests.push({ request_id: requestId, nonce: nonce });
}

function instrument(svc, capture) {
  const origIssue = svc.identity_issuer.issue;
  svc.identity_issuer.issue = function (path, principal, requestId = null) {
    const result = origIssue.call(svc.identity_issuer, path, principal, requestId);
    const summary = identitySummary(result);
    capture.identity = summary;
    capture.identities.push(summary);
    return result;
  };

  const origAttest = svc.attestation_issuer.attest;
  svc.attestation_issuer.attest = function (workload, claims = null) {
    const result = origAttest.call(svc.attestation_issuer, workload, claims);
    const summary = attestationSummary(result);
    capture.attestation = summary;
    capture.attestations.push(summary);
    return result;
  };

  const origGrant = svc.delegation_issuer.grant;
  svc.delegation_issuer.grant = function (...args) {
    const result = origGrant.apply(svc.delegation_issuer, args);
    const summary = grantSummary(result);
    capture.grant = summary;
    capture.grants.push(summary);
    return result;
  };

  const origRevoke = svc.revocation.revoke;
  svc.revocation.revoke = function (grantId, requestId = null) {
    capture.revoked_grant_ids.push(grantId);
    return origRevoke.call(svc.revocation, grantId, requestId);
  };

  const origAdvance = svc.clock.advance;
  svc.clock.advance = function (seconds) {
    capture.clock_advances_seconds.push(seconds);
    return origAdvance.call(svc.clock, seconds);
  };

  const origEvaluate = svc.adf.evaluate;
  svc.adf.evaluate = function (requestId, principal, workload, resource, action, identity, grantObj, attestation, nonce) {
    noteRequest(capture, requestId, nonce);
    const result = origEvaluate.call(svc.adf, requestId, principal, workload, resource, action, identity, grantObj, attestation, nonce);
    capture.decisions.push(decisionSummary(result));
    return result;
  };

  const origEnforce = svc.enforcer.enforce;
  svc.enforcer.enforce = function (requestId, nonce, decision, protectedOperation) {
    noteRequest(capture, requestId, nonce);
    const [outcome, result] = origEnforce.call(svc.enforcer, requestId, nonce, decision, protectedOperation);
    capture.enforcements.push({
      via: "enforce",
      request_id: requestId,
      nonce: nonce,
      presented_decision: decisionSummary(decision),
      outcome: outcomeSummary(outcome),
      operation_result: deepClone(result),
    });
    return [outcome, result];
  };

  const origDirectAccess = svc.enforcer.direct_access;
  svc.enforcer.direct_access = function (requestId, resource, action, principal) {
    noteRequest(capture, requestId, null);
    capture.direct_access = { resource: resource, action: action, principal: principal };
    const outcome = origDirectAccess.call(svc.enforcer, requestId, resource, action, principal);
    capture.enforcements.push({
      via: "direct_access",
      request_id: requestId,
      nonce: null,
      presented_decision: null,
      outcome: outcomeSummary(outcome),
      operation_result: null,
    });
    return outcome;
  };
}

function newCapture() {
  return {
    requests: [],
    identity: null,
    identities: [],
    grant: null,
    grants: [],
    attestation: null,
    attestations: [],
    revoked_grant_ids: [],
    clock_advances_seconds: [],
    direct_access: null,
    decisions: [],
    enforcements: [],
  };
}

export function runScenario(name, seed) {
  if (!(name in SCENARIOS)) throw new Error("unknown scenario: " + name);
  const svc = newService(seed);
  const capture = newCapture();
  instrument(svc, capture);
  svc.openRun(name);
  const start = svc.ledger.records().length;
  const result = SCENARIOS[name](svc);
  const records = svc.ledger.records().slice(start);
  const passed = result.checks.filter((c) => c[2]).length;
  const failed = result.checks.length - passed;
  svc.closeRun(name, failed === 0 ? "PASS" : "FAIL", passed, failed);

  const decisions = capture.decisions;
  const enforcements = capture.enforcements;
  const checks = result.checks.map((c) => ({
    check_id: c[0],
    requirement_ids: [...c[1]],
    passed: Boolean(c[2]),
    detail: c[3],
  }));
  const fixture = {
    contract_version: CONTRACT_VERSION,
    scenario: name,
    seed: seed,
    verdict: failed === 0 ? "PASS" : "FAIL",
    requirement_ids: [...result.requirement_ids],
    checks: checks,
    inputs: {
      principal: PRINCIPAL,
      resource: RESOURCE,
      action: ACTION,
      workload_path: WORKLOAD_PATH,
      requests: capture.requests,
      identity: capture.identity,
      grant: capture.grant,
      attestation: capture.attestation,
      revoked_grant_ids: capture.revoked_grant_ids,
      clock_advances_seconds: capture.clock_advances_seconds,
      direct_access: capture.direct_access,
    },
    decision: decisions.length > 0 ? decisions[0] : null,
    decisions: decisions,
    enforcement: enforcements.length > 0 ? enforcements[enforcements.length - 1].outcome : null,
    enforcements: enforcements,
    evidence: {
      event_types: records.map((r) => r.type),
      events: records.map((r) => ({ type: r.type, fields: Object.keys(r).sort() })),
    },
  };
  return { fixture: fixture, records: records, checks: checks };
}
