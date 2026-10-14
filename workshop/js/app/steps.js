// Step descriptors and component inspector content. This module is
// DOM free. Plain words text in stepFor() is built from the record
// fields themselves (valid, revoked, verdict, state, result and similar
// values), never copied from fixture check text.
//
// Provenance tags used in COMPONENT_META sections are exactly one of:
// "engine-observed", "workshop explanation", "not modeled".
// Where the engine has no such fact for a component, the section text is
// "not applicable in this scenario" and the tag is "not modeled".

import { CAST } from "./cast.js";

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
    case "ALLOWED": return "The Ledger was handed over";
    case "DENY": return "Nothing happened, he was turned away";
    case "DENY_INDETERMINATE": return "Nothing happened, " + CAST.stewardName + " could not be sure";
    case "REJECTED": return "Nothing happened, the order was thrown out";
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
    label: CAST.envoyFull,
    icon: "P",
    purpose: section(
      CAST.envoy + " is the envoy (the workload, payments-reporter in the engine). He asks to read " + CAST.resourceName + ", the protected report held in " + CAST.vault + " at /reports/quarterly, action READ.",
      "engine-observed"
    ),
    inputs: section(
      "The errand he was given: fetch " + CAST.resourceName + ".",
      "workshop explanation"
    ),
    outputs: section(
      "A request to read /reports/quarterly.",
      "engine-observed"
    ),
    authority: section(
      CAST.envoy + " has no authority to give himself the Ledger. He can only ask.",
      "workshop explanation"
    ),
    failure: section("not applicable in this scenario", "not modeled"),
  },
  identity: {
    label: CAST.herald + " (identity)",
    icon: "I",
    purpose: section(
      CAST.heraldName + " the herald and the house colors (identity) say who " + CAST.envoy + " claims to serve. The identity carries the name the workload runs under and when that proof runs out.",
      "engine-observed"
    ),
    inputs: section(
      "The workload name and the house it acts for, given when the identity was issued.",
      "engine-observed"
    ),
    outputs: section(
      "An identity for the workload, plus a check result that says whether that identity is valid.",
      "engine-observed"
    ),
    authority: section(
      "The identity says who " + CAST.envoy + " claims to be. It grants no permission by itself.",
      "workshop explanation"
    ),
    failure: section(
      "A valid identity with no Sealed Letter still leads to a refusal (a DENY decision), in the run where " + CAST.envoy + " arrives with no letter.",
      "engine-observed"
    ),
  },
  grant: {
    label: "The Sealed Letter (the grant)",
    icon: "S",
    purpose: section(
      "The Sealed Letter (the grant) carries " + CAST.lord + "'s permission, given through the authority source, finance-control in this lab. It names the one ledger and the one action the permission covers.",
      "engine-observed"
    ),
    inputs: section(
      "Permission given by finance-control for READ on /reports/quarterly.",
      "engine-observed"
    ),
    outputs: section(
      "A Sealed Letter " + CAST.stewardName + " can check, plus a taken-back check result that says whether the letter was withdrawn.",
      "engine-observed"
    ),
    authority: section(
      "The Sealed Letter is the only part that carries permission. Its permission is bounded to the ledger and action it names.",
      "engine-observed"
    ),
    failure: section(
      "A taken-back letter leads " + CAST.stewardName + " to refuse (DENY), with a reason that names the take-back.",
      "engine-observed"
    ),
  },
  attestation: {
    label: CAST.quartermaster + "'s inspection (attestation)",
    icon: "A",
    purpose: section(
      CAST.quartermaster + "'s inspection (attestation evidence) is the report on " + CAST.envoy + "'s party: what it is running and whether it has been messed with, with the time it was made, so " + CAST.stewardName + " can judge whether it is fresh.",
      "engine-observed"
    ),
    inputs: section(
      "The inspection itself, with the time it was made.",
      "engine-observed"
    ),
    outputs: section(
      "A freshness verdict in words, fresh or too old, with the age in seconds and the limit it was judged against.",
      "engine-observed"
    ),
    authority: section(
      "An inspection describes " + CAST.envoy + "'s party. It is not identity and it is not permission, so it grants no permission by itself.",
      "workshop explanation"
    ),
    failure: section(
      "An inspection that is too old leads to 'could not be sure' (INDETERMINATE), never a silent yes (PERMIT), and the Ledger is not handed over.",
      "engine-observed"
    ),
  },
  decision: {
    label: CAST.steward + " (the checker)",
    icon: "D",
    purpose: section(
      CAST.steward + " (the decision point) looks at the identity, the Sealed Letter, and the inspection together and issues a signed order with a reason. The answer is one of three: let him take the Ledger, turn him away, or say she cannot be sure. In the system's own words: PERMIT, DENY, or INDETERMINATE.",
      "engine-observed"
    ),
    inputs: section(
      "Identity, grant, attestation evidence, resource, and action.",
      "engine-observed"
    ),
    outputs: section(
      "A signed order with a reason, tied to one errand only. The answer is let him take the Ledger (PERMIT), turn him away (DENY), or cannot be sure (INDETERMINATE).",
      "engine-observed"
    ),
    authority: section(
      CAST.stewardName + " decides. She never opens " + CAST.vault + " herself.",
      "engine-observed"
    ),
    failure: section(
      "Missing or bad evidence leads to a refusal (DENY) or 'could not be sure' (INDETERMINATE), never a silent yes (PERMIT).",
      "engine-observed"
    ),
  },
  enforcement: {
    label: CAST.guard + " (enforcement at the gate)",
    icon: "G",
    purpose: section(
      CAST.guard + " (the enforcement point) checks " + CAST.stewardName + "'s order, its signature and its binding to this one errand, and acts on it before " + CAST.vault + ".",
      "engine-observed"
    ),
    inputs: section(
      "An order, the errand it is presented for, and a one-time value for that errand.",
      "engine-observed"
    ),
    outputs: section(
      "A result in plain words: the Ledger is handed over, nothing happens because he was turned away, nothing happens because " + CAST.stewardName + " could not be sure, the order is thrown out, or a direct attempt over the wall is blocked. In the system's own words: ALLOWED, DENY, DENY_INDETERMINATE, REJECTED, or BYPASS_BLOCKED.",
      "engine-observed"
    ),
    authority: section(
      CAST.guard + " acts on an order. He does not invent one, and he does not bend one.",
      "workshop explanation"
    ),
    failure: section(
      "An order changed after signing is thrown out (REJECTED) when its signature check fails. An order shown for the wrong errand is thrown out (REJECTED) because it does not match that errand. Trying to reach the Ledger directly, with no order, is blocked (BYPASS_BLOCKED) and written in the Chronicle.",
      "engine-observed"
    ),
  },
  resource: {
    label: "The Ledger Vault (the protected resource)",
    icon: "V",
    purpose: section(
      "The Ledger Vault (the protected resource) holds " + CAST.resourceName + ", the report at /reports/quarterly.",
      "engine-observed"
    ),
    inputs: section(
      "A read request that reaches it only when " + CAST.stewardName + " said yes (PERMIT) and the gate let it through (ALLOWED).",
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
    label: "The Chronicle (the evidence ledger)",
    icon: "C",
    purpose: section(
      "The Chronicle (the evidence ledger), kept by " + CAST.scribe + " the scribe, records each step in order, linked so an order and its outcome at the gate can be matched to each other.",
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
      "Entries are added, never torn out or rewritten, in this lab model.",
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
        title: CAST.envoy + "'s identity is issued",
        detail: "An identity was issued for " + CAST.envoy +
          (record.spiffe_id ? ", running as " + record.spiffe_id : "") +
          (record.expires_at ? ". It runs out at " + record.expires_at : "") + ".",
      };
    case "delegation.granted":
      return {
        eventType: type,
        component: "grant",
        title: "The Sealed Letter is given",
        detail: "The Sealed Letter was given" +
          (record.source ? " by " + record.source : "") +
          " for reading " + scopeText(record) + ".",
      };
    case "identity.validation":
      return {
        eventType: type,
        component: "identity",
        title: CAST.heraldName + "'s claim checked",
        detail: CAST.stewardName + " checked who " + CAST.envoy + " claims to be. Valid: " + boolWord(record.valid) + ".",
      };
    case "delegation.revocation_check":
      return {
        eventType: type,
        component: "grant",
        title: "Taken-back list checked",
        detail: CAST.stewardName + " checked the posted list of taken-back letters. Taken back: " +
          boolWord(record.revoked) + ".",
      };
    case "delegation.validation":
      return {
        eventType: type,
        component: "grant",
        title: "The Sealed Letter checked",
        detail: "The Sealed Letter was checked. Valid: " + boolWord(record.valid) + ".",
      };
    case "attestation.appraisal":
      return {
        eventType: type,
        component: "attestation",
        title: "The inspection checked",
        detail: CAST.quartermasterName + "'s inspection was checked. It was judged " +
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
        title: CAST.stewardName + " decides",
        detail: CAST.stewardName + "'s decision: " + decisionDisplay(record.state) +
          ". It is about reading " +
          (record.resource || "/reports/quarterly") + ".",
      };
    case "resource.operation":
      return {
        eventType: type,
        component: "resource",
        title: "The Ledger is read",
        detail: "The vault door opened and the protected operation ran: " + (record.action || "READ") +
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
        title: "Over the wall",
        detail: "Someone tried to reach " + (record.resource || "/reports/quarterly") +
          " directly, with no order at all.",
      };
    case "lab.clock_fault":
      return {
        eventType: type,
        component: "attestation",
        title: "Time passes",
        detail: "The lab clock was moved forward as the trial in this run, so the inspection became too old.",
      };
    default:
      return {
        eventType: type,
        component: "ledger",
        title: "Chronicle entry recorded",
        detail: "An entry of type " + type + " was recorded in order.",
      };
  }
}
