// DOM wiring for the eight workshop screens. Outcome DOM for the
// active run is built only after that run prediction is recorded:
// nothing outcome shaped is rendered before the gate opens, and the
// Journey class in state.js is the second line of defense.

import { Journey, MANIPULATION_SCENARIO } from "./state.js";
import { COMPONENT_META, COMPONENT_ORDER, stepFor } from "./steps.js";
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
  for (let i = 1; i <= 8; i += 1) {
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

function renderRunInfo() {
  const run = journey.activeRun();
  if (!run) {
    text(el("run-info"), "No run started yet.");
    text(el("predict-run-summary"), "No run started yet. Start a run from the component view or the control panel.");
    return;
  }
  text(el("run-info"),
    "Active run: " + run.runId + ", scenario " + run.scenario + ", seed " + run.seed +
    ", manipulation " + run.manipulation + ", level " + run.level + ".");
  text(el("predict-run-summary"),
    "Run " + run.runId + ": scenario " + run.scenario + ", seed " + run.seed +
    ", one fault for this run: " + run.manipulation + ". No outcome is shown until you record a prediction.");
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
    workload: run ? "[status] Requesting READ" : "[status] Ready",
    identity: "[status] Not yet checked",
    grant: "[status] Not yet checked",
    attestation: "[status] Not yet checked",
    decision: "[status] Not yet run",
    enforcement: "[status] Waiting for a decision",
    resource: "[status] /reports/quarterly, Not accessed",
    ledger: "[status] No entries yet",
  };
  if (run && inputs) {
    states.identity = inputs.identity ? "[status] Present and valid" : "[status] Missing";
    states.grant = !inputs.grant
      ? "[status] Missing"
      : run.manipulation === "revoke-grant" ? "[status] Revoked" : "[status] Present";
    states.attestation = !inputs.attestation
      ? "[status] Missing"
      : appraisal && appraisal.verdict === "STALE"
        ? "[status] Stale, age " + appraisal.freshness_seconds + " seconds"
        : "[status] Fresh" + (appraisal ? ", age " + appraisal.freshness_seconds + " seconds" : "");
    states.ledger = "[status] " + runData.records.length + " entries recorded";
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
    card.append(make("p", "", "Prior run " + run.runId + ": scenario " + run.scenario +
      ", seed " + run.seed + ", manipulation " + run.manipulation + "."));
    const outcome = journey.outcome(run.runId);
    if (outcome) {
      card.append(make("p", "status-word", "Prior run outcome: Decision: " + outcome.decisionState +
        ". Enforcement result: " + outcome.enforcementResult + "."));
    } else {
      card.append(make("p", "", "No outcome was revealed for this run."));
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
      currentText += ". A revocation check has been performed for this run. Revoked: " +
        (check.revoked ? "yes" : "no") + ".";
    }
  }
  if (component === "attestation") {
    const appraisal = appraisalRecord();
    if (runData && appraisal) {
      currentText = "[status] Verdict " + appraisal.verdict + ", age " + appraisal.freshness_seconds +
        " seconds. The freshness threshold in this lab is 300 seconds, a synthetic lab constant (a lab constant, non-normative: not an official rule for real systems).";
    } else if (runData) {
      currentText = "[status] No attestation appraisal in this run. The freshness threshold in this lab is 300 seconds, a synthetic lab constant (a lab constant, non-normative).";
    }
  }
  if (component === "decision") { currentText = "[status] Not yet run"; }
  if (component === "enforcement") { currentText = "[status] Waiting for a decision"; }
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
  if (record.type === "authorization.decision") {
    announce.append(make("p", "", "Decision: " + record.state + ". " + step.detail));
  } else if (record.type === "enforcement.outcome") {
    announce.append(make("p", "", "Enforcement result: " + record.result + ". " + step.detail));
  }
  const pred = run.prediction;
  text(el("pred-summary"), "You predicted decision " + pred.decision +
    " and enforcement " + pred.enforcement + ". Your reason: " + pred.reason);
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
      box.append(make("h2", "", "Outcome, beside your prediction"));
      box.append(make("p", "", "Your prediction: decision " + pred.decision +
        ", enforcement " + pred.enforcement + ". Reason: " + pred.reason));
      box.append(make("p", "status-word", "Actual outcome: Decision: " + outcome.decisionState +
        ". Enforcement result: " + outcome.enforcementResult + "."));
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
  text(el("evidence-request"), "Request identifier: " + (first ? first.request_id : "none") +
    ". Entries for this run, in order. Label: " + LABELS[1] + ".");
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
    text(el("repair-note"), "This run has no fault to repair. It is already the happy path.");
    btn.hidden = true;
  } else {
    text(el("repair-note"), "Repair control for the active fault only. It prepares the repair. Only the rerun confirms it.");
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
    const b = make("button", "", "Run " + name);
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
  el("start-happy").addEventListener("click", () => { startNewRun("happy-path", "none"); showScreen(4); });
  el("start-no-authority").addEventListener("click", () => { startNewRun("identity-no-authority", "none"); showScreen(4); });
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
