// Append-only, hash-chained evidence ledger, mirroring ledger.py.
// Each record carries the hash of its predecessor. Per-event schema
// validation keeps the required field sets of LAB-SCHEMA-v1.

import { digest } from "./crypto.js";
import { isoformat } from "./clock.js";

export const GENESIS_PREV = "GENESIS";

export const BASE_FIELDS = new Set([
  "event_id", "seq", "ts", "type", "request_id", "prev_hash", "record_hash",
]);

// Required fields beyond the base set, per event type.
export const SCHEMAS = {
  "lab.run_started": new Set(["seed", "clock_start", "scenario", "key_ids", "algorithm"]),
  "lab.run_finished": new Set(["scenario", "verdict", "checks_passed", "checks_failed"]),
  "lab.clock_fault": new Set(["fault", "detail"]),
  "identity.issued": new Set(["spiffe_id", "principal", "trust_domain", "expires_at", "key_id", "placeholder"]),
  "identity.validation": new Set(["spiffe_id", "valid", "reason"]),
  "delegation.granted": new Set(["grant_id", "source", "delegator", "issuer", "delegate", "scope", "key_id"]),
  "delegation.revocation_check": new Set(["grant_id", "revoked", "basis"]),
  "delegation.validation": new Set(["grant_id", "valid", "reason"]),
  "attestation.appraisal": new Set(["evidence_id", "workload", "verdict", "reason", "freshness_seconds", "threshold_seconds"]),
  "authorization.decision": new Set([
    "decision_id", "state", "principal", "workload", "resource", "action",
    "policy_version", "reason", "key_id",
  ]),
  "enforcement.outcome": new Set(["outcome_id", "decision_id", "result", "reason"]),
  "resource.operation": new Set(["resource", "action", "principal"]),
  "resource.bypass_attempt": new Set(["resource", "action", "reason"]),
};

export class LedgerError extends Error {}

export class Ledger {
  constructor(clock, ids) {
    this._clock = clock;
    this._ids = ids;
    this._records = [];
    this._prev = GENESIS_PREV;
  }

  append(eventType, requestId, fields) {
    if (!(eventType in SCHEMAS)) {
      throw new LedgerError("unknown event type: " + eventType);
    }
    const provided = new Set(Object.keys(fields || {}));
    const missing = [...SCHEMAS[eventType]].filter((f) => !provided.has(f)).sort();
    if (missing.length > 0) {
      throw new LedgerError(
        "event " + eventType + " missing fields: " + JSON.stringify(missing)
      );
    }
    const record = {
      event_id: this._ids.hex("evt"),
      seq: this._records.length,
      ts: isoformat(this._clock.now()),
      type: eventType,
      request_id: requestId,
      prev_hash: this._prev,
    };
    Object.assign(record, fields);
    const withoutHash = {};
    for (const key of Object.keys(record)) {
      if (key !== "record_hash") withoutHash[key] = record[key];
    }
    record.record_hash = digest(withoutHash);
    this._records.push(record);
    this._prev = record.record_hash;
    return record;
  }

  records() {
    return [...this._records];
  }

  for_request(requestId) {
    return this._records.filter((r) => r.request_id === requestId);
  }

  forRequest(requestId) {
    return this.for_request(requestId);
  }

  verifyChain() {
    let prev = GENESIS_PREV;
    for (const record of this._records) {
      if (record.prev_hash !== prev) return [false, "chain break at seq " + record.seq];
      const withoutHash = {};
      for (const key of Object.keys(record)) {
        if (key !== "record_hash") withoutHash[key] = record[key];
      }
      if (digest(withoutHash) !== record.record_hash) {
        return [false, "hash mismatch at seq " + record.seq];
      }
      prev = record.record_hash;
    }
    return [true, "chain ok, " + this._records.length + " records"];
  }

  checkClosedSequences() {
    const problems = [];
    const byRequest = new Map();
    for (const record of this._records) {
      const rid = record.request_id;
      if (rid) {
        if (!byRequest.has(rid)) byRequest.set(rid, []);
        byRequest.get(rid).push(record);
      }
    }
    for (const [rid, events] of byRequest) {
      if (!events.some((e) => e.type === "enforcement.outcome")) {
        problems.push("request " + rid + " has no enforcement.outcome");
      }
    }
    return [problems.length === 0, problems];
  }
}
