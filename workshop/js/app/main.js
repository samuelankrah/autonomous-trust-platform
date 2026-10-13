// DOM wiring for the eight workshop screens. Outcome DOM for the
// active run is built only after that run prediction is recorded:
// nothing outcome shaped is rendered before the gate opens, and the
// Journey class in state.js is the second line of defense.

import { Journey, MANIPULATION_SCENARIO } from "./state.js";
import {
  COMPONENT_META,
  COMPONENT_ORDER,
  stepFor,
  decisionDisplay,
  enforcementDisplay,
} from "./steps.js";
import { runScenario, SCENARIO_NAMES } from "../fixture.js";

const LABELS = ["Simulated", "Reference-tested", "Conceptual explanation", "Not modeled"];

// Anchor wording is APPROVED version v1-approved. Cue (field 2) and
// plain language meaning (field 1) below are verbatim from
// docs/workshop/memory-anchor-spec.md.
const ANCHORS = [
  {
    id: "A",
    title: "Authentication versus authorization",
    meaning: "Three separate questions. Proving who you are gives you zero permission; permission comes only from a grant.",
    cue: "Who is it? Did they prove it? What are they allowed to do?",
    counterexample: "The cue breaks down if the learner treats identity as worthless, or treats authentication as the same thing as identity. Identity and authentication still matter: the decision point checks the evidence presented for the claimed identity, and a grant is tied to a specific identity and workload. The point is narrower: a claimed identity whose evidence passes authentication carries no permission by itself. In the engine, a decision made with no grant records no authority provenance.",
    teachPrompt: "Explain, in your own words, why an actor whose identity evidence passes authentication can still be denied, name what authentication checks, and name what authorization separately decides.",
  },
  {
    id: "B",
    title: "Attestation freshness",
    meaning: "If the health proof is too old, the answer is 'can't be sure,' and the door stays shut. Not a no, an honest 'don't know.'",
    cue: "Not sure never means yes.",
    counterexample: "The cue breaks down if the learner treats freshness as a universal property of proof, rather than a policy setting applied to a type of evidence. It also breaks down if stale is treated as the same as false, or the same as denied for bad behavior: stale evidence yields INDETERMINATE, not DENY. It also breaks down if the synthetic 300 second value is treated as a real world rule. That value is a synthetic lab constant, not a rule for real systems.",
    teachPrompt: "Explain why stale evidence produces INDETERMINATE rather than DENY, and explain why the system must never turn that uncertainty into a silent PERMIT.",
  },
  {
    id: "C",
    title: "Revocation",
    meaning: "If the permission was withdrawn and the checker can see it, the answer is no, even though the permission slip still exists.",
    cue: "Taken back means taken back.",
    counterexample: "The cue breaks down if the learner pictures revocation as deleting or shredding the grant. In the engine, nothing is deleted: the grant is presented, a revocation check is performed and recorded in the evidence ledger, and the check result is what changes the decision to DENY. The cue also does not cover how a real system learns about revocations when disconnected.",
    teachPrompt: "Explain, in your own words, the difference between a grant that never existed and a grant that exists but has been revoked, and say what evidence in the ledger distinguishes the two cases.",
  },
  {
    id: "D",
    title: "Decision integrity check",
    meaning: "If anyone alters a decision after it was signed, the checker catches it and throws it out.",
    cue: "Changed after signing, rejected.",
    counterexample: "The cue breaks down if the learner thinks the integrity check makes the decision correct, or thinks a valid check proves who created the decision. A valid check shows only that the decision was not altered by a party without the key. Because the key is shared, it does not establish unique authorship among key holders, and it demonstrates no public-key verification and no key distribution. A decision that passes its integrity check can still be DENY.",
    teachPrompt: "Explain what the decision integrity check proves and what it does not prove, using the tampered decision as your example, and name the enforcement result in words.",
  },
  {
    id: "E",
    title: "Replay binding",
    meaning: "A decision works only for the exact request it was made for. Present it for a different one and it is rejected, even if it is genuine.",
    cue: "One decision, one request.",
    counterexample: "The cue breaks down if the learner thinks this check is about the decision being old, or about it being fake. The replayed decision in the engine is genuine and correctly signed. It is rejected only because it is presented for a request it was not bound to. Freshness and integrity can both pass while binding fails.",
    teachPrompt: "Explain why a decision can be genuine, fresh, and correctly signed, and still be rejected when presented for a different request, and say what two presented values enforcement checks against the decision's transaction binding in this lab.",
  },
];

const REPAIR_WORDING = {
  "revoke-grant": "Restore the grant",
  "age-attestation": "Issue a fresh attestation",
  "tamper-decision": "Use the original untampered decision",
  "replay-decision": "Obtain a fresh decision for the new request",
  "bypass-attempt": "Stop the bypass",
};

const SCENARIO_MANIPULATION = {
  "happy-path": "none",
  "identity-no-authority": "none",
  "revoked-delegation": "revoke-grant",
  "stale-attestation": "age-attestation",
  "tampered-decision": "tamper-decision",
  "replayed-decision": "replay-decision",
  "bypass-attempt": "bypass-attempt",
};

// The setup of each scenario, told as a short story in plain words.
// Shown on the Predict screen before the question. Setup only: a story
// never names the outcome.
const SCENARIO_STORY = {
  "happy-path": "Payments Reporter, a program, wants to read the quarterly report. Its identity checks out. It has permission. It recently passed a check-up. Nothing is broken.",
  "identity-no-authority": "Payments Reporter, a program, wants to read the quarterly report. Its identity checks out. But nobody gave it permission to read this report.",
  "revoked-delegation": "Payments Reporter, a program, wants to read the quarterly report. It was given permission, but that permission has since been taken back.",
  "stale-attestation": "Payments Reporter, a program, wants to read the quarterly report. It has permission. But its check-up report is old: it was written a while ago, not just now.",
  "tampered-decision": "Payments Reporter asked, and a signed decision said yes. Then someone changed the decision after it was signed.",
  "replayed-decision": "Payments Reporter asked, and a signed decision said yes, for that one request. Now the same decision is being shown for a different request.",
  "bypass-attempt": "Payments Reporter does not ask at all. It skips the checker entirely and tries to open the report directly, with no decision.",
};

// One short phrase per scenario for status lines and buttons.
const SCENARIO_SITUATION = {
  "happy-path": "the normal request, nothing broken",
  "identity-no-authority": "identity, but no permission given",
  "revoked-delegation": "permission taken back",
  "stale-attestation": "check-up report too old",
  "tampered-decision": "decision changed after it was signed",
  "replayed-decision": "decision reused for a different request",
  "bypass-attempt": "checker skipped entirely",
};

// The exact words of the Predict screen options, keyed by the engine
// values they record. Used to echo a prediction back in the same words
// the learner picked.
const DECISION_OPTION = {
  PERMIT: "Let it read the report",
  DENY: "Refuse it",
  INDETERMINATE: "Say it cannot be sure",
};

const ENFORCEMENT_OPTION = {
  ALLOWED: "The report opens",
  DENY: "Nothing happens, it was refused",
  DENY_INDETERMINATE: "Nothing happens, the system could not be sure",
  REJECTED: "Nothing happens, the decision was thrown out",
  BYPASS_BLOCKED: "Nothing happens, the attempt was blocked",
};

// Learn phase, part 1: meet the parts. One part at a time, plain
// words, one job and one everyday picture each. No system words here;
// the system names live in the inspector and the Architect layer.
const LEARN_PARTS = [
  {
    name: "The program",
    job: "Payments Reporter. It does the asking: it wants to read the quarterly report.",
    picture: "Everyday picture: a courier sent to collect a package.",
  },
  {
    name: "Its ID",
    job: "Proof of who the program claims to be.",
    picture: "Everyday picture: a driver's license. It says who you are. It says nothing about what you may do.",
  },
  {
    name: "Its permission slip",
    job: "Says exactly what the program is allowed to do, and who allowed it.",
    picture: "Everyday picture: a signed note from the manager: this courier may collect this one package.",
  },
  {
    name: "Its check-up report",
    job: "The program's own report about itself: what it is running, whether it has been messed with, and when the report was written.",
    picture: "Everyday picture: a recent health check. It only helps if it is fresh.",
  },
  {
    name: "The checker",
    job: "Examines the ID, the permission slip, and the check-up report together, then decides: yes, no, or cannot be sure.",
    picture: "Everyday picture: the service desk that reads everything before stamping the work order.",
  },
  {
    name: "The door guard",
    job: "Acts on the decision at the door. The report opens only on a yes. A decision that was changed after signing gets thrown out.",
    picture: "Everyday picture: the guard at the bay door, checking the stamped work order before opening the door.",
  },
  {
    name: "The notebook",
    job: "Every step is written down here, in order: what was asked, what was checked, what was decided, what happened.",
    picture: "Everyday picture: the workshop logbook. Pages are added, never torn out.",
  },
];

// Learn phase, part 2: watch it flow. The normal request moving
// through the parts in order, one sentence per beat. The learner taps
// through at their own pace; nothing advances on its own, and every
// beat is a full sentence in text, so the highlight is never the only
// carrier of the meaning.
const FLOW_BEATS = [
  { part: 0, text: "Payments Reporter asks to read the quarterly report." },
  { part: 1, text: "The checker examines its ID. The name checks out." },
  { part: 2, text: "The checker reads the permission slip. Reading this report is allowed." },
  { part: 3, text: "The checker reads the check-up report. It is fresh, and nothing has been messed with." },
  { part: 4, text: "The checker decides: yes. The decision is signed and tied to this one request." },
  { part: 5, text: "The door guard checks the decision and opens the report." },
  { part: 6, text: "Every step is written in the notebook, in order." },
];

const journey = new Journey();
let level = "explore";
let seed = 7;
let runData = null;
let stepIndex = 0;
let selectedDecision = null;
let selectedEnforcement = null;
let repairPrepared = false;
let diagnosisRecordedFor = null;
let lastInvoker = null;
let partIndex = 0;
let beatIndex = 0;
// Whether the learner has finished or skipped the Learn intro in
// this session. Remembered in sessionStorage so repeat runs in the
// same session can go straight to Predict, as the owner directed.
let introSeen = false;
try {
  introSeen = window.sessionStorage.getItem("atp-workshop-intro-seen") === "1";
} catch (err) {
  introSeen = false;
}

function markIntroSeen() {
  introSeen = true;
  try {
    window.sessionStorage.setItem("atp-workshop-intro-seen", "1");
  } catch (err) {
    // In-memory flag still applies for this page view.
  }
}

function el(id) { return document.getElementById(id); }
function text(node, value) { node.textContent = value; return node; }
function make(tag, cls, value) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (value !== undefined) node.textContent = value;
  return node;
}

function showScreen(n) {
  if ((n === 5 || n === 6) && !(journey.activeRun() && journey.activeRun().prediction)) {
    n = journey.activeRun() ? 4 : 1;
  }
  for (let i = 1; i <= 10; i += 1) {
    if (i === 2) continue;
    const section = el("screen-" + i);
    if (section) section.hidden = i !== n;
  }
  const heading = document.querySelector("#screen-" + n + " h1");
  if (heading) heading.focus();
  window.scrollTo(0, 0);
  if (n === 7) prepareRepair();
}

// --- Run lifecycle -------------------------------------------------

function outcomeOf(data) {
  const enforcements = data.fixture.enforcements || [];
  const last = enforcements.length ? enforcements[enforcements.length - 1].outcome : null;
  return {
    decisionState: data.fixture.decision ? data.fixture.decision.state : "NONE",
    enforcementResult: last ? last.result : "NONE",
  };
}

function startNewRun(scenario, manipulation) {
  const run = journey.startRun({
    scenario: scenario,
    seed: seed,
    level: level,
    manipulation: manipulation || SCENARIO_MANIPULATION[scenario] || "none",
  });
  runData = runScenario(scenario, seed);
  journey.setOutcomeData(run.runId, outcomeOf(runData));
  stepIndex = 0;
  repairPrepared = false;
  diagnosisRecordedFor = null;
  selectedDecision = null;
  selectedEnforcement = null;
  el("pred-reason").value = "";
  document.querySelectorAll("[data-decision], [data-enforcement]").forEach((b) => {
    b.setAttribute("aria-pressed", "false");
  });
  el("record-prediction").disabled = true;
  el("final-outcome").replaceChildren();
  el("decision-announce").replaceChildren();
  renderRunInfo();
  renderComponentStates();
  return run;
}

// --- Learn phase (Screens 9 and 10) --------------------------------

function beginLearn() {
  partIndex = 0;
  beatIndex = 0;
  renderPart();
  showScreen(9);
}

// Where a learner goes when the intro ends or is skipped: to the
// Predict screen when a run is waiting for its prediction, otherwise
// back to the first screen.
function afterLearn() {
  markIntroSeen();
  const run = journey.activeRun();
  if (run && !run.prediction) showScreen(4);
  else showScreen(1);
}

function renderPart() {
  const part = LEARN_PARTS[partIndex];
  text(el("learn-progress"), "Part " + (partIndex + 1) + " of " + LEARN_PARTS.length);
  text(el("learn-part-name"), part.name);
  text(el("learn-part-job"), part.job);
  text(el("learn-part-picture"), part.picture);
  el("learn-prev").disabled = partIndex === 0;
  text(el("learn-next"), partIndex === LEARN_PARTS.length - 1 ? "Watch it flow" : "Next part");
}

function renderBeat() {
  const beat = FLOW_BEATS[beatIndex];
  text(el("flow-progress"), "Beat " + (beatIndex + 1) + " of " + FLOW_BEATS.length);
  text(el("flow-beat"), beat.text);
  el("flow-parts").querySelectorAll("li").forEach((li, i) => {
    const active = i === beat.part;
    li.classList.toggle("flow-active", active);
    if (active) li.setAttribute("aria-current", "step");
    else li.removeAttribute("aria-current");
  });
  el("flow-prev").disabled = beatIndex === 0;
  const last = beatIndex === FLOW_BEATS.length - 1;
  const run = journey.activeRun();
  text(el("flow-next"), last
    ? (run && !run.prediction ? "Continue to your prediction" : "Back to the first screen")
    : "Next");
}

function renderRunInfo() {
  const run = journey.activeRun();
  if (!run) {
    text(el("run-info"), "No run started yet.");
    text(el("predict-run-summary"), "No run started yet. Start a run from the first screen or the control panel.");
    return;
  }
  text(el("run-info"),
    "This run: " + (SCENARIO_SITUATION[run.scenario] || run.scenario) + ".");
  text(el("predict-run-summary"),
    SCENARIO_STORY[run.scenario] || "Payments Reporter, a program, wants to read the quarterly report.");
}

function appraisalRecord() {
  if (!runData) return null;
  return runData.records.find((r) => r.type === "attestation.appraisal") || null;
}

function componentStates() {
  const run = journey.activeRun();
  const inputs = runData ? runData.fixture.inputs : null;
  const appraisal = appraisalRecord();
  const states = {
    workload: run ? "Asking to read the report" : "Ready",
    identity: "Not yet checked",
    grant: "Not yet checked",
    attestation: "Not yet checked",
    decision: "Not yet run",
    enforcement: "Waiting for a decision",
    resource: "The quarterly report. Not opened yet",
    ledger: "No entries yet",
  };
  if (run && inputs) {
    states.identity = inputs.identity ? "Present and valid" : "Missing";
    states.grant = !inputs.grant
      ? "Missing"
      : run.manipulation === "revoke-grant" ? "Taken back" : "Present";
    states.attestation = !inputs.attestation
      ? "Missing"
      : appraisal && appraisal.verdict === "STALE"
        ? "Too old, made " + appraisal.freshness_seconds + " seconds ago"
        : "Fresh" + (appraisal ? ", made " + appraisal.freshness_seconds + " seconds ago" : "");
    states.ledger = runData.records.length + " entries so far";
  }
  return states;
}

function renderComponentStates() {
  const states = componentStates();
  document.querySelectorAll(".component-row").forEach((row) => {
    const span = row.querySelector(".state");
    if (span) text(span, states[row.dataset.component] || "");
  });
}

function renderPriorRuns() {
  const list = el("prior-list");
  list.replaceChildren();
  const priors = journey.priorRuns();
  if (!priors.length) {
    list.append(make("p", "", "No prior runs yet."));
    return;
  }
  for (const run of priors) {
    const card = make("div", "card");
    card.append(make("p", "", "Earlier run: " +
      (SCENARIO_SITUATION[run.scenario] || run.scenario) + "."));
    const outcome = journey.outcome(run.runId);
    if (outcome) {
      card.append(make("p", "status-word", "What happened: decision " +
        decisionDisplay(outcome.decisionState) + ". At the gate: " +
        enforcementDisplay(outcome.enforcementResult) + "."));
    } else {
      card.append(make("p", "", "No outcome was shown for this run."));
    }
    list.append(card);
  }
}

// --- Inspector (Screen 2) ------------------------------------------

function openInspector(component, invoker) {
  lastInvoker = invoker || document.activeElement;
  const meta = COMPONENT_META[component];
  if (!meta) return;
  text(el("inspector-title"), meta.label);
  const states = componentStates();
  const stateByComponent = {
    workload: states.workload, identity: states.identity, grant: states.grant,
    attestation: states.attestation, decision: states.decision,
    enforcement: states.enforcement, resource: states.resource, ledger: states.ledger,
  };
  let currentText = stateByComponent[component] || "";
  let currentTag = "engine-observed";
  if (component === "grant" && runData) {
    const check = runData.records.find((r) => r.type === "delegation.revocation_check");
    if (check) {
      currentText += ". The checker has looked up whether this permission was taken back. Taken back: " +
        (check.revoked ? "yes" : "no") + ".";
    }
  }
  if (component === "attestation") {
    const appraisal = appraisalRecord();
    if (runData && appraisal) {
      currentText = "Judged " + (appraisal.verdict === "STALE" ? "too old" : "fresh") +
        ", made " + appraisal.freshness_seconds +
        " seconds before the check. The limit in this lab is 300 seconds, a synthetic lab constant (a lab constant, non-normative: not an official rule for real systems).";
    } else if (runData) {
      currentText = "No check-up report was judged in this run. The limit in this lab is 300 seconds, a synthetic lab constant (a lab constant, non-normative).";
    }
  }
  if (component === "decision") { currentText = "Not yet run"; }
  if (component === "enforcement") { currentText = "Waiting for a decision"; }
  const sections = [
    ["Purpose", meta.purpose],
    ["Current state", { text: currentText, tag: currentTag }],
    ["Inputs", meta.inputs],
    ["Outputs", meta.outputs],
    ["Authority", meta.authority],
    ["Failure behavior", meta.failure],
  ];
  const wrap = el("inspector-sections");
  wrap.replaceChildren();
  for (const [name, sec] of sections) {
    const box = make("div", "");
    box.append(make("h3", "", name));
    box.append(make("p", "", sec.text));
    box.append(make("p", "prov", "Provenance: " + sec.tag));
    wrap.append(box);
  }
  el("inspector").hidden = false;
  el("inspector-title").focus();
}

function closeInspector() {
  el("inspector").hidden = true;
  if (lastInvoker) lastInvoker.focus();
}

// --- Predict gate (Screen 4) ----------------------------------------

function updateGate() {
  el("record-prediction").disabled = !(
    selectedDecision && selectedEnforcement && el("pred-reason").value.trim().length > 0
  );
}

// --- Step runner (Screen 5) ------------------------------------------

function bindingLine(run) {
  return "Reference-tested. Scenario " + run.scenario + ", seed " + run.seed + ", scenario-contract-v1.";
}

function nestedList(value) {
  const ul = document.createElement("ul");
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      const li = make("li", "", key + ": ");
      if (value[key] && typeof value[key] === "object") li.append(nestedList(value[key]));
      else li.append(document.createTextNode(String(value[key])));
      ul.append(li);
    }
  } else {
    ul.append(make("li", "", String(value)));
  }
  return ul;
}

function renderStep() {
  const run = journey.activeRun();
  if (!run || !runData) return;
  const records = runData.records;
  const record = records[stepIndex];
  const step = stepFor(record);
  text(el("runner-binding"), bindingLine(run));
  text(el("step-indicator"), "Step " + (stepIndex + 1) + " of " + records.length + ": " + step.title);
  text(el("step-title"), step.title);
  text(el("step-detail"), step.detail);
  const list = el("step-list");
  list.replaceChildren();
  records.forEach((r, i) => {
    const s = stepFor(r);
    const li = make("li", "", (i === stepIndex ? "[current] " : "") + s.title);
    list.append(li);
  });
  const announce = el("decision-announce");
  announce.replaceChildren();
  if (record.type === "authorization.decision" || record.type === "enforcement.outcome") {
    announce.append(make("p", "", step.detail));
  }
  const pred = run.prediction;
  text(el("pred-summary"), "You predicted: " + (DECISION_OPTION[pred.decision] || pred.decision) +
    ". At the gate: " + (ENFORCEMENT_OPTION[pred.enforcement] || pred.enforcement) +
    ". Your reason: " + pred.reason);
  el("pred-details").open = stepIndex === records.length - 1;
  el("prev-step").disabled = stepIndex === 0;
  el("next-step").disabled = stepIndex === records.length - 1;
  if (level === "architect") renderArchitect(record);
  const finalBox = el("final-outcome");
  finalBox.replaceChildren();
  if (stepIndex === records.length - 1) {
    const outcome = journey.outcome(run.runId);
    if (outcome) {
      journey.recordOutcome(run.runId);
      const box = make("div", "card");
      box.append(make("h2", "", "What happened, next to your prediction"));
      box.append(make("p", "", "Your prediction: " + (DECISION_OPTION[pred.decision] || pred.decision) +
        ". At the gate: " + (ENFORCEMENT_OPTION[pred.enforcement] || pred.enforcement) +
        ". Your reason: " + pred.reason));
      box.append(make("p", "status-word", "What happened: decision " + decisionDisplay(outcome.decisionState) +
        ". At the gate: " + enforcementDisplay(outcome.enforcementResult) + "."));
      finalBox.append(box);
    }
  }
}

function renderArchitect(currentRecord) {
  const fixture = runData.fixture;
  text(el("req-ids"), (fixture.requirement_ids || []).join(", "));
  const list = el("checks-list");
  list.replaceChildren();
  for (const check of runData.checks) {
    list.append(make("li", "", (check.passed ? "PASS: " : "FAIL: ") + check.check_id +
      " (" + check.requirement_ids.join(", ") + ") " + check.detail));
  }
  text(el("exact-reason"),
    typeof currentRecord.reason === "string" ? currentRecord.reason : "No reason field on this step record.");
  const prov = el("provenance-view");
  prov.replaceChildren();
  if (fixture.decision && fixture.decision.authority_provenance) {
    prov.append(nestedList(fixture.decision.authority_provenance));
  } else {
    prov.append(make("p", "", "No authority provenance on the decision in this scenario."));
  }
}

// --- Evidence viewer (Screen 6) --------------------------------------

function buildEvidence() {
  const run = journey.activeRun();
  if (!run || !runData) return;
  text(el("evidence-binding"), bindingLine(run));
  const first = runData.records[0];
  text(el("evidence-request"), "Every entry from this run, in the order it happened. " +
    "Fine print: this run's request number is " + (first ? first.request_id : "none") +
    ". Label: " + LABELS[1] + ".");
  const decisionIds = new Set();
  const decisionSeen = new Set();
  const outcomeSeen = new Set();
  for (const r of runData.records) {
    if (!r.decision_id) continue;
    if (r.type === "authorization.decision") decisionSeen.add(r.decision_id);
    if (r.type === "enforcement.outcome") outcomeSeen.add(r.decision_id);
  }
  decisionSeen.forEach((id) => { if (outcomeSeen.has(id)) decisionIds.add(id); });
  const list = el("evidence-list");
  list.replaceChildren();
  runData.records.forEach((r, i) => {
    const step = stepFor(r);
    const li = make("li", "");
    li.append(make("p", "", "Entry " + (r.seq !== undefined ? r.seq : i + 1) + ": " + step.title));
    li.append(make("p", "", step.detail));
    if (r.decision_id && decisionIds.has(r.decision_id)) li.append(make("p", "status-word", "Same decision"));
    if (r.type === "resource.bypass_attempt") li.append(make("p", "status-word", "Fault entry: a bypass attempt, direct access with no decision"));
    if (r.type === "lab.clock_fault") li.append(make("p", "status-word", "Fault entry: the lab clock was advanced"));
    list.append(li);
  });
}

// --- Repair and reset (Screen 7) -------------------------------------

function diagnosisComplete() {
  return el("diag-fault").value.trim() && el("diag-stage").value.trim() && el("diag-text").value.trim();
}

function prepareRepair() {
  const run = journey.activeRun();
  const btn = el("repair-button");
  if (!run) {
    text(el("repair-note"), "No active run to repair.");
    btn.hidden = true;
    return;
  }
  const wording = REPAIR_WORDING[run.manipulation];
  el("replay-repair-note").hidden = run.manipulation !== "replay-decision";
  if (!wording) {
    text(el("repair-note"), "This run has nothing broken to repair. It is already the normal request.");
    btn.hidden = true;
  } else {
    text(el("repair-note"), "This repairs the one break in this run. It only prepares the repair; the rerun confirms it.");
    btn.hidden = false;
    text(btn, wording);
  }
  btn.disabled = !diagnosisComplete() || repairPrepared;
  el("rerun-repair").disabled = !repairPrepared;
}

// --- Teach-back and anchors (Screen 8) -------------------------------

const STAGES = [
  ["immediate", "Immediate"],
  ["later-in-session", "Later in session"],
  ["delayed", "Delayed"],
  ["transfer", "Transfer"],
  ["explain-back", "Explain back"],
];

function buildAnchorCard(anchor, target) {
  const card = make("div", "anchor-card");
  card.dataset.anchor = anchor.id;
  const recall = { stage: "immediate", revealed: false, hintLevel: "full", predCorrect: null, reasonCorrect: null };
  card.append(make("h3", "", "Anchor " + anchor.id + ": " + anchor.title));
  const cueWrap = make("div", "");
  cueWrap.dataset.cue = "true";
  cueWrap.append(make("p", "cue", anchor.cue));
  cueWrap.append(make("p", "", anchor.meaning));
  card.append(cueWrap);
  const details = make("details", "");
  const summary = make("summary", "", "Where this cue stops being true");
  details.append(summary);
  details.append(make("p", "", anchor.counterexample));
  card.append(details);
  card.append(make("p", "", "Teach-back prompt: " + anchor.teachPrompt));
  const teachLabel = make("label", "", "Your teach-back for anchor " + anchor.id);
  teachLabel.htmlFor = "teach-anchor-" + anchor.id;
  const teachInput = document.createElement("textarea");
  teachInput.id = "teach-anchor-" + anchor.id;
  teachInput.rows = 3;
  card.append(teachLabel, teachInput);

  const recallBox = make("div", "card");
  recallBox.append(make("h4", "", "Recall check for anchor " + anchor.id));
  const stageRow = make("div", "");
  for (const [stageId, stageLabel] of STAGES) {
    const b = make("button", "", stageLabel);
    b.type = "button";
    b.setAttribute("aria-pressed", stageId === "immediate" ? "true" : "false");
    b.addEventListener("click", () => {
      recall.stage = stageId;
      recall.revealed = false;
      stageRow.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      const hiddenStage = stageId === "later-in-session" || stageId === "delayed";
      card.classList.toggle("hidden-cue", hiddenStage);
      cueWrap.hidden = hiddenStage;
    });
    stageRow.append(b);
  }
  recallBox.append(stageRow);
  const predLabel = make("label", "", "Predicted behavior, from memory");
  predLabel.htmlFor = "recall-pred-" + anchor.id;
  const predInput = document.createElement("textarea");
  predInput.id = "recall-pred-" + anchor.id;
  predInput.rows = 2;
  const reasonLabel = make("label", "", "Your reason");
  reasonLabel.htmlFor = "recall-reason-" + anchor.id;
  const reasonInput = document.createElement("textarea");
  reasonInput.id = "recall-reason-" + anchor.id;
  reasonInput.rows = 2;
  recallBox.append(predLabel, predInput, reasonLabel, reasonInput);
  const revealBtn = make("button", "", "Reveal");
  revealBtn.type = "button";
  revealBtn.addEventListener("click", () => {
    recall.revealed = true;
    cueWrap.hidden = false;
    card.classList.remove("hidden-cue");
    if (recall.stage === "delayed" && !predInput.value.trim()) recall.hintLevel = "cue-shown";
    else if (recall.stage === "later-in-session" || recall.stage === "delayed") recall.hintLevel = "none";
    else if (recall.stage === "transfer") recall.hintLevel = "reduced";
    else recall.hintLevel = "full";
  });
  recallBox.append(revealBtn);
  const markRow = make("div", "");
  function markButtons(labelText, key) {
    const wrap = make("div", "");
    wrap.append(make("p", "", labelText));
    for (const [val, lab] of [[true, "Yes"], [false, "No"]]) {
      const b = make("button", "", lab);
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => {
        recall[key] = val;
        wrap.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
      });
      wrap.append(b);
    }
    return wrap;
  }
  markRow.append(markButtons("Was your prediction correct?", "predCorrect"));
  markRow.append(markButtons("Was your reason correct?", "reasonCorrect"));
  recallBox.append(markRow);
  const recordBtn = make("button", "", "Record recall check");
  recordBtn.type = "button";
  const done = make("p", "status-word", "");
  recordBtn.addEventListener("click", () => {
    if (recall.predCorrect === null || recall.reasonCorrect === null) {
      text(done, "Mark prediction correct and reason correct first.");
      return;
    }
    const rec = journey.recordRecallAttempt({
      anchorId: anchor.id,
      stage: recall.stage,
      hintLevel: recall.hintLevel,
      predictionCorrect: recall.predCorrect,
      reasonCorrect: recall.reasonCorrect,
    });
    if (recall.stage === "transfer") {
      const active = journey.activeRun();
      const lastPrior = journey.priorRuns();
      const scenario = active ? active.scenario
        : lastPrior.length ? lastPrior[lastPrior.length - 1].scenario : "happy-path";
      journey.recordTransferTest({
        concept: anchor.title,
        changedScenario: scenario,
        result: rec.result,
      });
    }
    text(done, "Recall check recorded: " + rec.result + ".");
  });
  recallBox.append(recordBtn, done);
  card.append(recallBox);
  target.append(card);
}

function updateFinish() {
  el("finish-journey").disabled = !(el("teach-1").value.trim() && el("teach-2").value.trim());
}

function finishJourney() {
  const run = journey.activeRun();
  const priors = journey.priorRuns();
  const runId = run ? run.runId : priors.length ? priors[priors.length - 1].runId : "journey";
  journey.recordTeachBack(runId, [], el("teach-1").value.trim());
  journey.recordTeachBack(runId, [], el("teach-2").value.trim());
  for (const anchor of ANCHORS) {
    const input = el("teach-anchor-" + anchor.id);
    if (input && input.value.trim()) {
      journey.recordTeachBack(runId, [anchor.id], input.value.trim());
    }
  }
  text(el("journey-status"), "Journey status: complete. Teach-back recorded for review. " +
    "Prompt 1 and Prompt 2 are recorded, plus any anchor teach-back you entered.");
  showScreen(1);
}

function exportSession() {
  const data = JSON.stringify(journey.buildExport(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "atp-workshop-session.json";
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- Wiring ------------------------------------------------------------

function buildStatic() {
  const list = el("component-list");
  for (const key of COMPONENT_ORDER) {
    const meta = COMPONENT_META[key];
    const row = make("button", "component-row");
    row.type = "button";
    row.dataset.component = key;
    const icon = make("span", "icon", meta.icon);
    icon.setAttribute("aria-hidden", "true");
    row.append(icon, document.createTextNode(meta.label + " "));
    row.append(make("span", "state", ""));
    row.addEventListener("click", () => openInspector(key, row));
    list.append(row);
  }
  renderComponentStates();

  const strip = el("anchors-strip");
  const cards = el("anchor-cards");
  for (const anchor of ANCHORS) {
    const mini = make("div", "card");
    mini.append(make("p", "", "Anchor " + anchor.id + ": " + anchor.title));
    mini.append(make("p", "cue", anchor.cue));
    mini.append(make("p", "", anchor.meaning));
    strip.append(mini);
    buildAnchorCard(anchor, cards);
  }

  const scenariosBox = el("scenario-buttons");
  for (const name of SCENARIO_NAMES) {
    const situation = SCENARIO_SITUATION[name] || name;
    const b = make("button", "", "Run: " + situation.charAt(0).toUpperCase() +
      situation.slice(1) + " (" + name + ")");
    b.type = "button";
    b.addEventListener("click", () => { startNewRun(name); showScreen(4); });
    scenariosBox.append(b);
  }

  document.querySelectorAll("[data-goto]").forEach((b) => {
    b.addEventListener("click", () => showScreen(Number(b.dataset.goto)));
  });
  document.querySelectorAll("[data-level]").forEach((b) => {
    b.addEventListener("click", () => {
      level = b.dataset.level;
      document.querySelectorAll("[data-level]").forEach((x) =>
        x.setAttribute("aria-selected", x === b ? "true" : "false"));
      el("open-control").hidden = level === "explore";
      el("explore-panel").hidden = level !== "explore";
      el("architect-scenarios").hidden = level !== "architect";
      el("architect-panel").hidden = level !== "architect";
      const active = journey.activeRun();
      if (runData && active && active.prediction) renderStep();
    });
  });
  el("seed-select").addEventListener("change", () => { seed = Number(el("seed-select").value); });
  el("open-control").addEventListener("click", () => showScreen(3));
  // On the Explore path, a fresh session learns before it predicts:
  // teach first, then test. Operate and Architect go straight to the
  // Predict screen.
  function startFromExplore(scenario) {
    startNewRun(scenario, "none");
    if (level === "explore" && !introSeen) beginLearn();
    else showScreen(4);
  }
  el("start-happy").addEventListener("click", () => startFromExplore("happy-path"));
  el("start-no-authority").addEventListener("click", () => startFromExplore("identity-no-authority"));
  el("open-learn").addEventListener("click", () => beginLearn());
  const flowList = el("flow-parts");
  for (const part of LEARN_PARTS) {
    flowList.append(make("li", "", part.name));
  }
  el("learn-prev").addEventListener("click", () => {
    if (partIndex > 0) { partIndex -= 1; renderPart(); }
  });
  el("learn-next").addEventListener("click", () => {
    if (partIndex < LEARN_PARTS.length - 1) { partIndex += 1; renderPart(); }
    else { beatIndex = 0; renderBeat(); showScreen(10); }
  });
  el("flow-prev").addEventListener("click", () => {
    if (beatIndex > 0) { beatIndex -= 1; renderBeat(); }
  });
  el("flow-next").addEventListener("click", () => {
    if (beatIndex < FLOW_BEATS.length - 1) { beatIndex += 1; renderBeat(); }
    else afterLearn();
  });
  document.querySelectorAll(".skip-learn").forEach((b) =>
    b.addEventListener("click", afterLearn));
  el("show-prior").addEventListener("click", () => {
    renderPriorRuns();
    el("prior-view").hidden = !el("prior-view").hidden;
  });
  el("inspector-close").addEventListener("click", closeInspector);
  document.querySelectorAll("[data-manip]").forEach((b) => {
    b.addEventListener("click", () => {
      startNewRun(MANIPULATION_SCENARIO[b.dataset.manip], b.dataset.manip);
      showScreen(4);
    });
  });
  el("clear-faults").addEventListener("click", () => { startNewRun("happy-path", "none"); showScreen(1); });
  document.querySelectorAll("[data-decision]").forEach((b) => {
    b.addEventListener("click", () => {
      selectedDecision = b.dataset.decision;
      document.querySelectorAll("[data-decision]").forEach((x) =>
        x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      updateGate();
    });
  });
  document.querySelectorAll("[data-enforcement]").forEach((b) => {
    b.addEventListener("click", () => {
      selectedEnforcement = b.dataset.enforcement;
      document.querySelectorAll("[data-enforcement]").forEach((x) =>
        x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      updateGate();
    });
  });
  el("pred-reason").addEventListener("input", updateGate);
  el("record-prediction").addEventListener("click", () => {
    const run = journey.activeRun();
    if (!run) { showScreen(1); return; }
    journey.setPrediction(run.runId, {
      decision: selectedDecision,
      enforcement: selectedEnforcement,
      reason: el("pred-reason").value.trim(),
    });
    stepIndex = 0;
    renderStep();
    showScreen(5);
  });
  el("prev-step").addEventListener("click", () => { if (stepIndex > 0) { stepIndex -= 1; renderStep(); } });
  el("next-step").addEventListener("click", () => {
    if (runData && stepIndex < runData.records.length - 1) { stepIndex += 1; renderStep(); }
  });
  el("pause-run").addEventListener("click", () => {
    const announce = el("decision-announce");
    announce.replaceChildren();
    announce.append(make("p", "", "Paused. The runner waits between steps. Use Next step to continue."));
  });
  el("inspect-current").addEventListener("click", (event) => {
    if (!runData) return;
    openInspector(stepFor(runData.records[stepIndex]).component, event.currentTarget);
  });
  el("view-evidence").addEventListener("click", () => { buildEvidence(); showScreen(6); });
  ["diag-fault", "diag-stage", "diag-text"].forEach((id) =>
    el(id).addEventListener("input", prepareRepair));
  el("repair-button").addEventListener("click", () => {
    const run = journey.activeRun();
    if (!run || !diagnosisComplete()) return;
    if (diagnosisRecordedFor !== run.runId) {
      journey.recordDiagnosis(run.runId, {
        faultNamed: el("diag-fault").value.trim(),
        stageNamed: el("diag-stage").value.trim(),
        text: el("diag-text").value.trim(),
      });
      diagnosisRecordedFor = run.runId;
    }
    repairPrepared = true;
    prepareRepair();
  });
  el("rerun-repair").addEventListener("click", () => {
    startNewRun("happy-path", "none");
    showScreen(4);
  });
  el("reset-button").addEventListener("click", () => { el("reset-confirm").hidden = false; });
  el("reset-confirm-no").addEventListener("click", () => { el("reset-confirm").hidden = true; });
  el("reset-confirm-yes").addEventListener("click", () => {
    journey.reset();
    runData = null;
    el("reset-confirm").hidden = true;
    renderRunInfo();
    renderComponentStates();
    showScreen(1);
  });
  el("teach-1").addEventListener("input", updateFinish);
  el("teach-2").addEventListener("input", updateFinish);
  el("finish-journey").addEventListener("click", finishJourney);
  document.querySelectorAll(".export-session").forEach((b) =>
    b.addEventListener("click", exportSession));
}

buildStatic();
renderRunInfo();
