// Decision-service assembly, mirroring service.py: one seeded,
// clock-injected run with per-run stand-in keys and a manual clock.
// There is no filesystem state in this build; the Python state directory
// is not observable in the fixtures and is skipped entirely.

import { AttestationIssuer, AttestationVerifier, AuthorizationDecisionFunction, DelegationIssuer, DelegationValidator, EnforcementPoint, IdentityIssuer, IdentityValidator, RevocationStore } from "./components.js";
import { ManualClock, isoformat } from "./clock.js";
import { ALGORITHM } from "./crypto.js";
import { Ledger } from "./ledger.js";
import { SeededIds } from "./prng.js";

export const CLOCK_START = Date.UTC(2026, 9, 7, 12, 0, 0);
export const CLOCK_START_ISO = "2026-10-07T12:00:00Z";

export const KEY_IDS = {
  identity: "identity-key",
  authority: "authority-key",
  decision: "decision-key",
  attestation: "attestation-key",
};

// Embedded policy, identical to labs/decision-service/policy.json.
export const POLICY = {
  note: "Deliberately small, versioned local policy for the demo. Version is recorded on every decision (AZ-016).",
  policy_id: "atp-demo-policy",
  policy_version: "2026-10-07.demo-1",
  requires_attestation: true,
  resources: {
    "/reports/quarterly": { actions: ["READ"], requires_attestation: true },
  },
};

export function loadPolicy() {
  return JSON.parse(JSON.stringify(POLICY));
}

export class DecisionService {
  constructor(seed, clock) {
    this.seed = seed;
    this.clock = clock;
    this.ids = new SeededIds(seed);
    this.ledger = new Ledger(clock, this.ids);
    this.key_ids = {};
    for (const name of Object.keys(KEY_IDS)) {
      this.key_ids[name] = KEY_IDS[name] + "-run-" + seed;
    }
    this.keyIds = this.key_ids;
    // Per-run stand-in keys: the key_id string itself is the key material.
    this.keys = {
      identity: this.key_ids.identity,
      authority: this.key_ids.authority,
      decision: this.key_ids.decision,
      attestation: this.key_ids.attestation,
    };
    this.policy = loadPolicy();

    this.identity_issuer = new IdentityIssuer(clock, this.ids, this.ledger, this.keys.identity, this.key_ids.identity);
    this.identity_validator = new IdentityValidator(clock, this.ledger, this.keys.identity);
    this.delegation_issuer = new DelegationIssuer(clock, this.ids, this.ledger, this.keys.authority, this.key_ids.authority);
    this.revocation = new RevocationStore(this.ledger);
    this.delegation_validator = new DelegationValidator(
      clock, this.ledger, this.keys.authority, this.revocation,
      { "finance-control": ["/reports/quarterly:READ"] }
    );
    this.attestation_issuer = new AttestationIssuer(clock, this.ids, this.ledger, this.keys.attestation, this.key_ids.attestation);
    this.attestation_verifier = new AttestationVerifier(clock, this.ledger, this.keys.attestation);
    this.adf = new AuthorizationDecisionFunction(
      clock, this.ids, this.ledger, this.keys.decision, this.key_ids.decision,
      this.identity_validator, this.delegation_validator, this.attestation_verifier, this.policy
    );
    this.enforcer = new EnforcementPoint(clock, this.ids, this.ledger, this.keys.decision);

    // Camel-case aliases pointing at the same component objects.
    this.identityIssuer = this.identity_issuer;
    this.identityValidator = this.identity_validator;
    this.delegationIssuer = this.delegation_issuer;
    this.delegationValidator = this.delegation_validator;
    this.attestationIssuer = this.attestation_issuer;
    this.attestationVerifier = this.attestation_verifier;
  }

  openRun(scenario) {
    this.ledger.append("lab.run_started", null, {
      seed: this.seed,
      clock_start: isoformat(this.clock.now()),
      scenario: scenario,
      key_ids: this.key_ids,
      algorithm: ALGORITHM,
    });
  }

  closeRun(scenario, verdict, passed, failed) {
    this.ledger.append("lab.run_finished", null, {
      scenario: scenario,
      verdict: verdict,
      checks_passed: passed,
      checks_failed: failed,
    });
  }

  open_run(scenario) {
    return this.openRun(scenario);
  }

  close_run(scenario, verdict, passed, failed) {
    return this.closeRun(scenario, verdict, passed, failed);
  }
}

export function newService(seed) {
  const clock = new ManualClock(CLOCK_START);
  return new DecisionService(seed, clock);
}

export const createService = newService;
