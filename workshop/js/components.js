// Engine components, ported line for line from the reference modules:
// identity.py, delegation.py, attestation.py, policy.py, and
// enforcement.py. Every ledger append, branch order, reason string, and
// return value matches the Python original.

import { isoformat, parseIso } from "./clock.js";
import { sign, verify } from "./crypto.js";
import {
  attestationClaimsDict,
  decisionClaims,
  grantClaims,
  grantProvenance,
  identityClaims,
  makeAttestation,
  makeDecision,
  makeGrant,
  makeIdentity,
  makeOutcome,
} from "./models.js";

// ---------------------------------------------------------------------
// Identity (identity.py)

export const TRUST_DOMAIN = "atp-demo";
export const IDENTITY_TTL_SECONDS = 300;

export function spiffeId(path) {
  return "spiffe://" + TRUST_DOMAIN + "/" + path;
}

export class IdentityIssuer {
  constructor(clock, ids, ledger, key, keyId) {
    this._clock = clock;
    this._ids = ids;
    this._ledger = ledger;
    this._key = key;
    this._key_id = keyId;
  }

  issue(path, principal, requestId = null) {
    const now = this._clock.now();
    const identity = makeIdentity({
      spiffe_id: spiffeId(path),
      trust_domain: TRUST_DOMAIN,
      principal: principal,
      issued_at: isoformat(now),
      expires_at: isoformat(now + IDENTITY_TTL_SECONDS * 1000),
      key_id: this._key_id,
    });
    const signed = { ...identity, signature: sign(identityClaims(identity), this._key) };
    this._ledger.append("identity.issued", requestId, {
      spiffe_id: signed.spiffe_id,
      principal: principal,
      trust_domain: TRUST_DOMAIN,
      expires_at: signed.expires_at,
      key_id: this._key_id,
      placeholder: "WP-001 bootstrap binding rules are synthetic lab configuration",
    });
    return signed;
  }
}

export class IdentityValidator {
  constructor(clock, ledger, key) {
    this._clock = clock;
    this._ledger = ledger;
    this._key = key;
  }

  validate(identity, requestId = null) {
    if (!identity.spiffe_id.startsWith("spiffe://" + TRUST_DOMAIN + "/")) {
      const reason = "trust domain not accepted by local policy";
      this._ledger.append("identity.validation", requestId, {
        spiffe_id: identity.spiffe_id, valid: false, reason: reason,
      });
      return [false, reason];
    }
    if (!verify(identityClaims(identity), identity.signature, this._key)) {
      const reason = "identity signature does not verify";
      this._ledger.append("identity.validation", requestId, {
        spiffe_id: identity.spiffe_id, valid: false, reason: reason,
      });
      return [false, reason];
    }
    if (parseIso(identity.expires_at) <= this._clock.now()) {
      const reason = "identity expired";
      this._ledger.append("identity.validation", requestId, {
        spiffe_id: identity.spiffe_id, valid: false, reason: reason,
      });
      return [false, reason];
    }
    this._ledger.append("identity.validation", requestId, {
      spiffe_id: identity.spiffe_id, valid: true, reason: "ok",
    });
    return [true, "ok"];
  }
}

// ---------------------------------------------------------------------
// Delegation (delegation.py)

export const GRANT_TTL_SECONDS = 600;

export class DelegationIssuer {
  constructor(clock, ids, ledger, key, keyId) {
    this._clock = clock;
    this._ids = ids;
    this._ledger = ledger;
    this._key = key;
    this._key_id = keyId;
  }

  grant(source, delegator, delegate, workload, resource, action, constraints = null, requestId = null) {
    const now = this._clock.now();
    const grant = makeGrant({
      grant_id: this._ids.hex("grant"),
      source: source,
      delegator: delegator,
      issuer: "delegation-issuer/atp-demo",
      delegate: delegate,
      workload: workload,
      resource: resource,
      action: action,
      constraints: constraints || {},
      issued_at: isoformat(now),
      expires_at: isoformat(now + GRANT_TTL_SECONDS * 1000),
      revocation_basis: "revocation-list/atp-demo/" + this._ids.seed,
      key_id: this._key_id,
    });
    const signed = { ...grant, signature: sign(grantClaims(grant), this._key) };
    this._ledger.append("delegation.granted", requestId, {
      grant_id: signed.grant_id,
      source: source,
      delegator: delegator,
      issuer: signed.issuer,
      delegate: delegate,
      scope: { resource: resource, action: action },
      key_id: this._key_id,
    });
    return signed;
  }
}

export class RevocationStore {
  constructor(ledger) {
    this._ledger = ledger;
    this._revoked = new Set();
  }

  revoke(grantId, requestId = null) {
    this._revoked.add(grantId);
    this._ledger.append("delegation.revocation_check", requestId, {
      grant_id: grantId,
      revoked: true,
      basis: "explicit revocation publication (seeded)",
    });
  }

  is_revoked(grantId, requestId = null) {
    const revoked = this._revoked.has(grantId);
    this._ledger.append("delegation.revocation_check", requestId, {
      grant_id: grantId,
      revoked: revoked,
      basis: "seeded revocation list lookup",
    });
    return revoked;
  }

  isRevoked(grantId, requestId = null) {
    return this.is_revoked(grantId, requestId);
  }
}

export class DelegationValidator {
  constructor(clock, ledger, key, revocation, delegableScope) {
    this._clock = clock;
    this._ledger = ledger;
    this._key = key;
    this._revocation = revocation;
    this._delegable_scope = delegableScope;
  }

  validate(grant, delegate, workload, resource, action, requestId = null) {
    const fail = (reason) => {
      this._ledger.append("delegation.validation", requestId, {
        grant_id: grant.grant_id, valid: false, reason: reason,
      });
      return [false, reason];
    };

    if (!verify(grantClaims(grant), grant.signature, this._key)) {
      return fail("grant signature does not verify; unverifiable grants yield no authority");
    }
    if (parseIso(grant.expires_at) <= this._clock.now()) {
      return fail("grant expired");
    }
    if (grant.delegate !== delegate || grant.workload !== workload) {
      return fail("grant not bound to this delegate/workload");
    }
    if (grant.resource !== resource || grant.action !== action) {
      return fail("grant scope does not cover requested resource/action");
    }
    const allowed = this._delegable_scope[grant.delegator] || [];
    if (!allowed.includes(resource + ":" + action)) {
      return fail("grant exceeds delegator's delegable scope (non-amplification)");
    }
    if (this._revocation.is_revoked(grant.grant_id, requestId)) {
      return fail("grant revoked");
    }
    this._ledger.append("delegation.validation", requestId, {
      grant_id: grant.grant_id, valid: true, reason: "ok",
    });
    return [true, "ok"];
  }
}

// ---------------------------------------------------------------------
// Attestation (attestation.py)

export const LAB_SYNTHETIC_FRESHNESS_SECONDS = 300;

export class AttestationIssuer {
  constructor(clock, ids, ledger, key, keyId) {
    this._clock = clock;
    this._ids = ids;
    this._ledger = ledger;
    this._key = key;
    this._key_id = keyId;
  }

  attest(workload, claims = null) {
    const now = this._clock.now();
    const evidence = makeAttestation({
      evidence_id: this._ids.hex("att"),
      workload: workload,
      issued_at: isoformat(now),
      expires_at: isoformat(now + LAB_SYNTHETIC_FRESHNESS_SECONDS * 2 * 1000),
      claims: claims || { runtime_class: "lab-synthetic", config: "baseline" },
      key_id: this._key_id,
    });
    return { ...evidence, signature: sign(attestationClaimsDict(evidence), this._key) };
  }
}

export class AttestationVerifier {
  constructor(clock, ledger, key) {
    this._clock = clock;
    this._ledger = ledger;
    this._key = key;
  }

  appraise(evidence, requestId = null) {
    const age = Math.trunc((this._clock.now() - parseIso(evidence.issued_at)) / 1000);
    let verdict;
    let reason;
    if (!verify(attestationClaimsDict(evidence), evidence.signature, this._key)) {
      verdict = "INVALID";
      reason = "attestation evidence signature does not verify";
    } else if (parseIso(evidence.expires_at) <= this._clock.now()) {
      verdict = "INVALID";
      reason = "attestation evidence expired";
    } else if (age > LAB_SYNTHETIC_FRESHNESS_SECONDS) {
      verdict = "STALE";
      reason =
        "attestation evidence is " + age + "s old, beyond the declared synthetic " +
        "threshold of " + LAB_SYNTHETIC_FRESHNESS_SECONDS + "s (LAB-CONFIG, non-normative)";
    } else {
      verdict = "FRESH";
      reason = "ok";
    }
    this._ledger.append("attestation.appraisal", requestId, {
      evidence_id: evidence.evidence_id,
      workload: evidence.workload,
      verdict: verdict,
      reason: reason,
      freshness_seconds: age,
      threshold_seconds: LAB_SYNTHETIC_FRESHNESS_SECONDS,
    });
    return [verdict, reason, age];
  }
}

// ---------------------------------------------------------------------
// Authorization decision function (policy.py)

export const DECISION_VALIDITY_SECONDS = 120;

export class AuthorizationDecisionFunction {
  constructor(clock, ids, ledger, key, keyId, identityValidator, delegationValidator, attestationVerifier, policy) {
    this._clock = clock;
    this._ids = ids;
    this._ledger = ledger;
    this._key = key;
    this._key_id = keyId;
    this._identity_validator = identityValidator;
    this._delegation_validator = delegationValidator;
    this._attestation_verifier = attestationVerifier;
    this._policy = policy;
  }

  _finish(requestId, state, principal, workload, resource, action, provenance, freshness, reason, nonce) {
    const now = this._clock.now();
    const decision = makeDecision({
      decision_id: this._ids.hex("dec"),
      request_id: requestId,
      state: state,
      principal: principal,
      workload: workload,
      resource: resource,
      action: action,
      authority_provenance: provenance,
      policy_id: this._policy.policy_id,
      policy_version: this._policy.policy_version,
      freshness: freshness,
      validity_not_before: isoformat(now),
      validity_not_after: isoformat(now + DECISION_VALIDITY_SECONDS * 1000),
      transaction_binding: { request_id: requestId, nonce: nonce },
      reason: reason,
      key_id: this._key_id,
    });
    const signed = { ...decision, signature: sign(decisionClaims(decision), this._key) };
    this._ledger.append("authorization.decision", requestId, {
      decision_id: signed.decision_id,
      state: state,
      principal: principal,
      workload: workload,
      resource: resource,
      action: action,
      policy_version: this._policy.policy_version,
      reason: reason,
      key_id: this._key_id,
    });
    return signed;
  }

  evaluate(requestId, principal, workload, resource, action, identity, grant, attestation, nonce) {
    const now = this._clock.now();
    const identityAge = Math.trunc((now - parseIso(identity.issued_at)) / 1000);

    const [validIdentity, identityReason] = this._identity_validator.validate(identity, requestId);
    if (!validIdentity) {
      return this._finish(
        requestId, "DENY", principal, workload, resource, action, null,
        { identity_age_seconds: identityAge, authority_age_seconds: null, attestation_age_seconds: null },
        "identity invalid: " + identityReason, nonce
      );
    }

    if (grant === null || grant === undefined) {
      return this._finish(
        requestId, "DENY", principal, workload, resource, action, null,
        { identity_age_seconds: identityAge, authority_age_seconds: null, attestation_age_seconds: null },
        "valid identity presents no authority; identity is not authorization (AZ-002)", nonce
      );
    }

    const [validGrant, grantReason] = this._delegation_validator.validate(
      grant, principal, workload, resource, action, requestId
    );
    const authorityAge = Math.trunc((now - parseIso(grant.issued_at)) / 1000);
    if (!validGrant) {
      if (grantReason.includes("signature does not verify") || grantReason.includes("unverifiable")) {
        return this._finish(
          requestId, "INDETERMINATE", principal, workload, resource, action, null,
          { identity_age_seconds: identityAge, authority_age_seconds: authorityAge, attestation_age_seconds: null },
          "authority provenance cannot be verified: " + grantReason, nonce
        );
      }
      return this._finish(
        requestId, "DENY", principal, workload, resource, action, null,
        { identity_age_seconds: identityAge, authority_age_seconds: authorityAge, attestation_age_seconds: null },
        "delegated authority not recognized: " + grantReason, nonce
      );
    }

    let attestationAge = null;
    if (this._policy.requires_attestation) {
      if (attestation === null || attestation === undefined) {
        return this._finish(
          requestId, "INDETERMINATE", principal, workload, resource, action, null,
          { identity_age_seconds: identityAge, authority_age_seconds: authorityAge, attestation_age_seconds: null },
          "policy requires attestation evidence; none presented (AZ-011)", nonce
        );
      }
      const [verdict, appraisalReason, appraisedAge] = this._attestation_verifier.appraise(attestation, requestId);
      attestationAge = appraisedAge;
      if (verdict !== "FRESH") {
        return this._finish(
          requestId, "INDETERMINATE", principal, workload, resource, action, null,
          { identity_age_seconds: identityAge, authority_age_seconds: authorityAge, attestation_age_seconds: attestationAge },
          "required attestation evidence is " + verdict + ": " + appraisalReason + " (AZ-022, never permit on unknown)", nonce
        );
      }
    }

    return this._finish(
      requestId, "PERMIT", principal, workload, resource, action, grantProvenance(grant),
      { identity_age_seconds: identityAge, authority_age_seconds: authorityAge, attestation_age_seconds: attestationAge },
      "all required evidence valid within policy bounds", nonce
    );
  }
}

// ---------------------------------------------------------------------
// Enforcement point (enforcement.py)

export class EnforcementPoint {
  constructor(clock, ids, ledger, decisionKey) {
    this._clock = clock;
    this._ids = ids;
    this._ledger = ledger;
    this._decision_key = decisionKey;
  }

  _record(requestId, decisionId, result, reason) {
    const outcome = makeOutcome({
      outcome_id: this._ids.hex("enf"),
      decision_id: decisionId,
      request_id: requestId,
      result: result,
      reason: reason,
      enforced_at: isoformat(this._clock.now()),
    });
    this._ledger.append("enforcement.outcome", requestId, {
      outcome_id: outcome.outcome_id,
      decision_id: decisionId,
      result: result,
      reason: reason,
    });
    return outcome;
  }

  enforce(requestId, nonce, decision, protectedOperation) {
    if (!verify(decisionClaims(decision), decision.signature, this._decision_key)) {
      const outcome = this._record(requestId, decision.decision_id, "REJECTED",
        "decision source signature does not verify (ENF-008)");
      return [outcome, null];
    }
    const binding = decision.transaction_binding;
    if (binding.request_id !== requestId || binding.nonce !== nonce) {
      const outcome = this._record(requestId, decision.decision_id, "REJECTED",
        "decision not bound to this request/nonce (ENF-003)");
      return [outcome, null];
    }
    const now = this._clock.now();
    if (!(parseIso(decision.validity_not_before) <= now && now <= parseIso(decision.validity_not_after))) {
      const outcome = this._record(requestId, decision.decision_id, "REJECTED",
        "decision outside validity window (CTL-004)");
      return [outcome, null];
    }
    if (decision.state === "PERMIT") {
      const resultRecord = protectedOperation();
      this._ledger.append("resource.operation", requestId, {
        resource: decision.resource,
        action: decision.action,
        principal: decision.principal,
      });
      const outcome = this._record(requestId, decision.decision_id, "ALLOWED",
        "permit decision applied to bound request");
      return [outcome, resultRecord];
    }
    if (decision.state === "DENY") {
      const outcome = this._record(requestId, decision.decision_id, "DENY",
        "deny decision applied; protected operation not invoked (AZ-021)");
      return [outcome, null];
    }
    const outcome = this._record(requestId, decision.decision_id, "DENY_INDETERMINATE",
      "indeterminate decision; operation not invoked, never permit on unknown (AZ-022)");
    return [outcome, null];
  }

  direct_access(requestId, resource, action, principal) {
    this._ledger.append("resource.bypass_attempt", requestId, {
      resource: resource,
      action: action,
      reason: "no authorization decision presented for protected path",
    });
    return this._record(requestId, null, "BYPASS_BLOCKED",
      "alternate path blocked; no decision, no operation (ENF-002, ENF-006)");
  }

  directAccess(requestId, resource, action, principal) {
    return this.direct_access(requestId, resource, action, principal);
  }
}
