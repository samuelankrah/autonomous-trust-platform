// Step descriptors and component inspector content. This module is
// DOM free. Plain words text in stepFor() is built from the record
// fields themselves (valid, revoked, verdict, state, result and similar
// values), never copied from fixture check text.
//
// Provenance tags used in COMPONENT_META sections are exactly one of:
// "engine-observed", "workshop explanation", "not modeled".
// Where the engine has no such fact for a component, the section text is
// "not applicable in this scenario" and the tag is "not modeled".

function section(text, tag) {
  return { text: text, tag: tag };
}

export const COMPONENT_META = {
  workload: {
    label: "Workload",
    icon: "W",
    purpose: section(
      "The workload is payments-reporter. It asks to read the protected report at /reports/quarterly, action READ.",
      "engine-observed"
    ),
    inputs: section(
      "The job it was given to do: read the quarterly report.",
      "workshop explanation"
    ),
    outputs: section(
      "A request to read /reports/quarterly.",
      "engine-observed"
    ),
    authority: section(
      "The workload has no authority to grant itself access. It can only ask.",
      "workshop explanation"
    ),
    failure: section("not applicable in this scenario", "not modeled"),
  },
  identity: {
    label: "Identity",
    icon: "I",
    purpose: section(
      "The identity proves who the workload is. It carries the name the workload runs under and when that proof runs out.",
      "engine-observed"
    ),
    inputs: section(
      "The workload name and the job it acts for, given when the identity was issued.",
      "engine-observed"
    ),
    outputs: section(
      "An identity for the workload, plus a check result that says whether that identity is valid.",
      "engine-observed"
    ),
    authority: section(
      "The identity proves who the workload is. It grants no permission by itself.",
      "workshop explanation"
    ),
    failure: section(
      "A valid identity with no grant still leads to a DENY decision, in the identity-no-authority run.",
      "engine-observed"
    ),
  },
  grant: {
    label: "Grant",
    icon: "G",
    purpose: section(
      "The grant carries permission from the authority source, finance-control in this lab. It names the resource and the action the permission covers.",
      "engine-observed"
    ),
    inputs: section(
      "Permission given by finance-control for READ on /reports/quarterly.",
      "engine-observed"
    ),
    outputs: section(
      "A grant the decision point can check, plus a revocation check result that says whether the grant was withdrawn.",
      "engine-observed"
    ),
    authority: section(
      "The grant is the only part that carries permission. Its permission is bounded to the resource and action it names.",
      "engine-observed"
    ),
    failure: section(
      "A revoked grant leads the decision point to DENY, with a reason that names revocation.",
      "engine-observed"
    ),
  },
  attestation: {
    label: "Attestation evidence",
    icon: "A",
    purpose: section(
      "Attestation evidence carries recent proof about the workload, with the time it was issued, so the decision point can judge whether the proof is fresh.",
      "engine-observed"
    ),
    inputs: section(
      "Proof about the workload, with an issue time.",
      "engine-observed"
    ),
    outputs: section(
      "A freshness verdict in words, FRESH or STALE, with the age in seconds and the threshold it was judged against.",
      "engine-observed"
    ),
    authority: section(
      "Attestation evidence is proof about the workload. It is not identity and it is not authorization, so it grants no permission by itself.",
      "workshop explanation"
    ),
    failure: section(
      "Stale attestation leads to INDETERMINATE, never a silent PERMIT, and the protected operation does not run.",
      "engine-observed"
    ),
  },
  decision: {
    label: "Decision point",
    icon: "D",
    purpose: section(
      "The decision point evaluates identity, grant, and attestation evidence together and issues a signed decision: PERMIT, DENY, or INDETERMINATE, with a reason.",
      "engine-observed"
    ),
    inputs: section(
      "Identity, grant, attestation evidence, resource, and action.",
      "engine-observed"
    ),
    outputs: section(
      "A signed decision of PERMIT, DENY, or INDETERMINATE, with a reason, bound to one request.",
      "engine-observed"
    ),
    authority: section(
      "The decision point decides. It never invokes the protected resource itself.",
      "engine-observed"
    ),
    failure: section(
      "Missing or bad evidence leads to DENY or INDETERMINATE, never a silent PERMIT.",
      "engine-observed"
    ),
  },
  enforcement: {
    label: "Enforcement point",
    icon: "E",
    purpose: section(
      "The enforcement point checks the decision, its signature and its binding to this request, and acts on it before the protected resource.",
      "engine-observed"
    ),
    inputs: section(
      "A decision, the request it is presented for, and a one-time value for that request.",
      "engine-observed"
    ),
    outputs: section(
      "An enforcement result in words: ALLOWED, DENY, DENY_INDETERMINATE, REJECTED, or BYPASS_BLOCKED.",
      "engine-observed"
    ),
    authority: section(
      "The enforcement point acts on a decision. It does not invent one.",
      "workshop explanation"
    ),
    failure: section(
      "A tampered decision is REJECTED when its signature check fails. A decision presented for the wrong request is REJECTED for binding. Direct access with no decision is BYPASS_BLOCKED and recorded.",
      "engine-observed"
    ),
  },
  resource: {
    label: "Protected resource",
    icon: "R",
    purpose: section(
      "The protected resource holds the report at /reports/quarterly.",
      "engine-observed"
    ),
    inputs: section(
      "A read request that reaches it only when the decision is PERMIT and enforcement returns ALLOWED.",
      "workshop explanation"
    ),
    outputs: section(
      "The protected operation result, only when the operation runs.",
      "engine-observed"
    ),
    authority: section("not applicable in this scenario", "not modeled"),
    failure: section("not applicable in this scenario", "not modeled"),
  },
  ledger: {
    label: "Evidence ledger",
    icon: "L",
    purpose: section(
      "The evidence ledger records each step in order, linked so a decision and its enforcement outcome can be matched to each other.",
      "engine-observed"
    ),
    inputs: section(
      "One entry for each step the engine performs in a run, in the order it performs them.",
      "engine-observed"
    ),
    outputs: section(
      "An ordered list of entries for the run, each with a sequence position.",
      "engine-observed"
    ),
    authority: section("not applicable in this scenario", "not modeled"),
    failure: section(
      "Entries are appended, not rewritten, in this lab model.",
      "workshop explanation"
    ),
  },
};

export const COMPONENT_ORDER = [
  "workload",
  "identity",
  "grant",
  "attestation",
  "decision",
  "enforcement",
  "resource",
  "ledger",
];

function boolWord(value) {
  return value === true ? "yes" : value === false ? "no" : "not recorded";
}

function scopeText(record) {
  if (record.scope && record.scope.resource) {
    return record.scope.resource;
  }
  return record.resource || "/reports/quarterly";
}

// Converts one ledger record into a plain words step descriptor.
// Returns {eventType, component, title, detail}.
export function stepFor(record) {
  const type = record.type || "";
  switch (type) {
    case "identity.issued":
      return {
        eventType: type,
        component: "identity",
        title: "Identity issued",
        detail: "An identity was issued for the workload" +
          (record.spiffe_id ? ", running as " + record.spiffe_id : "") +
          (record.expires_at ? ". It runs out at " + record.expires_at : "") + ".",
      };
    case "delegation.granted":
      return {
        eventType: type,
        component: "grant",
        title: "Grant given",
        detail: "Permission was given" +
          (record.source ? " by " + record.source : "") +
          " for reading " + scopeText(record) + ".",
      };
    case "identity.validation":
      return {
        eventType: type,
        component: "identity",
        title: "Identity checked",
        detail: "The identity was checked. Valid: " + boolWord(record.valid) + ".",
      };
    case "delegation.revocation_check":
      return {
        eventType: type,
        component: "grant",
        title: "Revocation check",
        detail: "The grant was checked against the revocation list. Revoked: " +
          boolWord(record.revoked) + ".",
      };
    case "delegation.validation":
      return {
        eventType: type,
        component: "grant",
        title: "Grant checked",
        detail: "The grant was checked. Valid: " + boolWord(record.valid) + ".",
      };
    case "attestation.appraisal":
      return {
        eventType: type,
        component: "attestation",
        title: "Attestation checked",
        detail: "The proof about the workload was checked. Verdict: " +
          (record.verdict || "not recorded") +
          (typeof record.freshness_seconds === "number"
            ? ". Age: " + record.freshness_seconds + " seconds"
            : "") +
          (typeof record.threshold_seconds === "number"
            ? ". Threshold in this lab: " + record.threshold_seconds +
              " seconds, a synthetic lab constant"
            : "") + ".",
      };
    case "authorization.decision":
      return {
        eventType: type,
        component: "decision",
        title: "Decision made",
        detail: "Decision: " + (record.state || "not recorded") +
          ". The decision covers " + (record.action || "READ") + " on " +
          (record.resource || "/reports/quarterly") + ".",
      };
    case "resource.operation":
      return {
        eventType: type,
        component: "resource",
        title: "Protected report read",
        detail: "The protected operation ran: " + (record.action || "READ") +
          " on " + (record.resource || "/reports/quarterly") + ".",
      };
    case "enforcement.outcome":
      return {
        eventType: type,
        component: "enforcement",
        title: "Enforcement outcome",
        detail: "Enforcement result: " + (record.result || "not recorded") + ".",
      };
    case "resource.bypass_attempt":
      return {
        eventType: type,
        component: "resource",
        title: "Bypass attempt",
        detail: "Someone tried to reach " + (record.resource || "/reports/quarterly") +
          " directly, with no decision at all.",
      };
    case "lab.clock_fault":
      return {
        eventType: type,
        component: "attestation",
        title: "Lab clock advanced",
        detail: "The lab clock was advanced as the fault in this run, so the attestation proof became old.",
      };
    default:
      return {
        eventType: type,
        component: "ledger",
        title: "Ledger entry recorded",
        detail: "An entry of type " + type + " was recorded in order.",
      };
  }
}
