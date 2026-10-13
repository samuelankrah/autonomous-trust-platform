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

// Plain words first for decisions and gate results. The exact engine
// word stays available in parentheses after the outcome is revealed,
// because from that point on the code itself is teaching content.
export function decisionWord(state) {
  switch (state) {
    case "PERMIT": return "Allowed";
    case "DENY": return "Refused";
    case "INDETERMINATE": return "Could not be sure";
    default: return "No decision was made";
  }
}

export function decisionDisplay(state) {
  if (!state || state === "NONE") return "No decision was made";
  return decisionWord(state) + " (" + state + ")";
}

export function enforcementWord(result) {
  switch (result) {
    case "ALLOWED": return "The report opened";
    case "DENY": return "Nothing happened, it was refused";
    case "DENY_INDETERMINATE": return "Nothing happened, the system could not be sure";
    case "REJECTED": return "Nothing happened, the decision was thrown out";
    case "BYPASS_BLOCKED": return "Nothing happened, the attempt was blocked";
    default: return "Nothing happened";
  }
}

export function enforcementDisplay(result) {
  if (!result || result === "NONE") return "Nothing happened";
  return enforcementWord(result) + " (" + result + ")";
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
      "A valid identity with no grant still leads to a refusal (a DENY decision), in the run with identity but no permission.",
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
      "A taken-back grant leads the checker to refuse (DENY), with a reason that names the take-back.",
      "engine-observed"
    ),
  },
  attestation: {
    label: "Check-up report",
    icon: "A",
    purpose: section(
      "The check-up report (attestation evidence) is the workload's own report about itself: what it is running and whether it has been messed with, with the time it was made, so the checker can judge whether it is fresh.",
      "engine-observed"
    ),
    inputs: section(
      "The check-up report itself, with the time it was made.",
      "engine-observed"
    ),
    outputs: section(
      "A freshness verdict in words, fresh or too old, with the age in seconds and the limit it was judged against.",
      "engine-observed"
    ),
    authority: section(
      "A check-up report describes the workload. It is not identity and it is not permission, so it grants no permission by itself.",
      "workshop explanation"
    ),
    failure: section(
      "A check-up report that is too old leads to 'could not be sure' (INDETERMINATE), never a silent yes (PERMIT), and the report does not open.",
      "engine-observed"
    ),
  },
  decision: {
    label: "Decision point",
    icon: "D",
    purpose: section(
      "The decision point looks at the identity, the grant, and the check-up report together and issues a signed decision with a reason. The decision is one of three answers: let it through, refuse it, or say it cannot be sure. In the system's own words: PERMIT, DENY, or INDETERMINATE.",
      "engine-observed"
    ),
    inputs: section(
      "Identity, grant, attestation evidence, resource, and action.",
      "engine-observed"
    ),
    outputs: section(
      "A signed decision with a reason, tied to one request only. The answer is let it through (PERMIT), refuse it (DENY), or cannot be sure (INDETERMINATE).",
      "engine-observed"
    ),
    authority: section(
      "The decision point decides. It never invokes the protected resource itself.",
      "engine-observed"
    ),
    failure: section(
      "Missing or bad evidence leads to a refusal (DENY) or 'could not be sure' (INDETERMINATE), never a silent yes (PERMIT).",
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
      "A result in plain words: the report opens, nothing happens because it was refused, nothing happens because the system could not be sure, the decision is thrown out, or a direct attempt is blocked. In the system's own words: ALLOWED, DENY, DENY_INDETERMINATE, REJECTED, or BYPASS_BLOCKED.",
      "engine-observed"
    ),
    authority: section(
      "The enforcement point acts on a decision. It does not invent one.",
      "workshop explanation"
    ),
    failure: section(
      "A decision changed after signing is thrown out (REJECTED) when its signature check fails. A decision shown for the wrong request is thrown out (REJECTED) because it does not match that request. Trying to reach the report directly, with no decision, is blocked (BYPASS_BLOCKED) and written down.",
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
      "A read request that reaches it only when the checker said yes (PERMIT) and the gate let it through (ALLOWED).",
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
        title: "Take-back check",
        detail: "The checker looked up whether this permission was taken back. Taken back: " +
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
        title: "Check-up report checked",
        detail: "The check-up report was checked. It was judged " +
          (record.verdict === "STALE" ? "too old" : record.verdict === "FRESH" ? "fresh" : "not recorded") +
          (typeof record.freshness_seconds === "number"
            ? ". It was made " + record.freshness_seconds + " seconds before the check"
            : "") +
          (typeof record.threshold_seconds === "number"
            ? ". The limit in this lab is " + record.threshold_seconds +
              " seconds, a synthetic lab constant"
            : "") + ".",
      };
    case "authorization.decision":
      return {
        eventType: type,
        component: "decision",
        title: "Decision made",
        detail: "The decision: " + decisionDisplay(record.state) +
          ". It is about reading " +
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
        title: "At the gate",
        detail: "At the gate: " + enforcementDisplay(record.result) + ".",
      };
    case "resource.bypass_attempt":
      return {
        eventType: type,
        component: "resource",
        title: "Tried to skip the checker",
        detail: "Someone tried to reach " + (record.resource || "/reports/quarterly") +
          " directly, with no decision at all.",
      };
    case "lab.clock_fault":
      return {
        eventType: type,
        component: "attestation",
        title: "Lab clock advanced",
        detail: "The lab clock was moved forward as the break in this run, so the check-up report became too old.",
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
