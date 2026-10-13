// Trust artifacts as plain objects, mirroring models.py in the
// reference engine. Every artifact is a signed claim set. The claims
// helpers return every field except the signature, in the same field
// order as the Python dataclasses.

export const SYNTHETIC_BANNER = "synthetic-not-for-production";

export function makeIdentity(fields) {
  return {
    spiffe_id: fields.spiffe_id,
    trust_domain: fields.trust_domain,
    principal: fields.principal,
    issued_at: fields.issued_at,
    expires_at: fields.expires_at,
    key_id: fields.key_id,
    signature: fields.signature !== undefined ? fields.signature : "",
  };
}

export function identityClaims(identity) {
  return {
    spiffe_id: identity.spiffe_id,
    trust_domain: identity.trust_domain,
    principal: identity.principal,
    issued_at: identity.issued_at,
    expires_at: identity.expires_at,
    key_id: identity.key_id,
  };
}

export function makeGrant(fields) {
  return {
    grant_id: fields.grant_id,
    source: fields.source,
    delegator: fields.delegator,
    issuer: fields.issuer,
    delegate: fields.delegate,
    workload: fields.workload,
    resource: fields.resource,
    action: fields.action,
    constraints: fields.constraints !== undefined ? fields.constraints : {},
    issued_at: fields.issued_at !== undefined ? fields.issued_at : "",
    expires_at: fields.expires_at !== undefined ? fields.expires_at : "",
    revocation_basis: fields.revocation_basis !== undefined ? fields.revocation_basis : "",
    key_id: fields.key_id !== undefined ? fields.key_id : "",
    signature: fields.signature !== undefined ? fields.signature : "",
  };
}

export function grantClaims(grant) {
  return {
    grant_id: grant.grant_id,
    source: grant.source,
    delegator: grant.delegator,
    issuer: grant.issuer,
    delegate: grant.delegate,
    workload: grant.workload,
    resource: grant.resource,
    action: grant.action,
    constraints: grant.constraints,
    issued_at: grant.issued_at,
    expires_at: grant.expires_at,
    revocation_basis: grant.revocation_basis,
    key_id: grant.key_id,
  };
}

// Authority provenance, preserved as structure (AZ-003).
export function grantProvenance(grant) {
  return {
    source: grant.source,
    delegator: grant.delegator,
    issuer: grant.issuer,
    grant_id: grant.grant_id,
    scope: { resource: grant.resource, action: grant.action },
    constraints: grant.constraints,
    revocation_basis: grant.revocation_basis,
  };
}

export function makeAttestation(fields) {
  return {
    evidence_id: fields.evidence_id,
    workload: fields.workload,
    issued_at: fields.issued_at,
    expires_at: fields.expires_at,
    claims: fields.claims !== undefined ? fields.claims : {},
    key_id: fields.key_id !== undefined ? fields.key_id : "",
    signature: fields.signature !== undefined ? fields.signature : "",
  };
}

export function attestationClaimsDict(evidence) {
  return {
    evidence_id: evidence.evidence_id,
    workload: evidence.workload,
    issued_at: evidence.issued_at,
    expires_at: evidence.expires_at,
    claims: evidence.claims,
    key_id: evidence.key_id,
  };
}

export function makeDecision(fields) {
  return {
    decision_id: fields.decision_id,
    request_id: fields.request_id,
    state: fields.state,
    principal: fields.principal,
    workload: fields.workload,
    resource: fields.resource,
    action: fields.action,
    authority_provenance: fields.authority_provenance,
    policy_id: fields.policy_id,
    policy_version: fields.policy_version,
    freshness: fields.freshness,
    validity_not_before: fields.validity_not_before,
    validity_not_after: fields.validity_not_after,
    transaction_binding: fields.transaction_binding,
    reason: fields.reason,
    key_id: fields.key_id,
    signature: fields.signature !== undefined ? fields.signature : "",
  };
}

export function decisionClaims(decision) {
  return {
    decision_id: decision.decision_id,
    request_id: decision.request_id,
    state: decision.state,
    principal: decision.principal,
    workload: decision.workload,
    resource: decision.resource,
    action: decision.action,
    authority_provenance: decision.authority_provenance,
    policy_id: decision.policy_id,
    policy_version: decision.policy_version,
    freshness: decision.freshness,
    validity_not_before: decision.validity_not_before,
    validity_not_after: decision.validity_not_after,
    transaction_binding: decision.transaction_binding,
    reason: decision.reason,
    key_id: decision.key_id,
  };
}

export function makeOutcome(fields) {
  return {
    outcome_id: fields.outcome_id,
    decision_id: fields.decision_id,
    request_id: fields.request_id,
    result: fields.result,
    reason: fields.reason,
    enforced_at: fields.enforced_at,
  };
}

export function outcomeClaims(outcome) {
  return {
    outcome_id: outcome.outcome_id,
    decision_id: outcome.decision_id,
    request_id: outcome.request_id,
    result: outcome.result,
    reason: outcome.reason,
    enforced_at: outcome.enforced_at,
  };
}
