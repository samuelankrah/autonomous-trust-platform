// DOM wiring for the eight workshop screens. Outcome DOM for the
// active run is built only after that run prediction is recorded:
// nothing outcome shaped is rendered before the gate opens, and the
// Journey class in state.js is the second line of defense.

import { Journey, MANIPULATION_SCENARIO } from "./state.js";
import { ScreenStack, ResetGate } from "./nav.js";
import {
  COMPONENT_META,
  COMPONENT_ORDER,
  stepFor,
  decisionDisplay,
  enforcementDisplay,
} from "./steps.js";
import { CAST } from "./cast.js";
import { buildRoadMap, setRoadMapState, COMPONENT_NODE, BEAT_NODE } from "./map.js";
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
  "revoke-grant": "Take the letter off the taken-back list",
  "age-attestation": "Bring a fresh inspection",
  "tamper-decision": "Use " + CAST.stewardName + "'s original order, unchanged",
  "replay-decision": "Get a fresh order for the new errand",
  "bypass-attempt": "Come through the gate properly",
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
  "happy-path": CAST.envoy + ", envoy of the Counting House, has come to fetch " + CAST.resourceName + ". His herald's claim checks out. He carries the Sealed Letter. His party's inspection is fresh. Nothing is amiss.",
  "identity-no-authority": CAST.envoy + " has come to fetch " + CAST.resourceName + ". His herald's claim checks out. But he carries no Sealed Letter: nobody gave him permission to take this ledger.",
  "revoked-delegation": CAST.envoy + " has come to fetch " + CAST.resourceName + ". He carries the Sealed Letter, but the lord's proclamation has since taken that letter back.",
  "stale-attestation": CAST.envoy + " has come to fetch " + CAST.resourceName + ". He carries the Sealed Letter. But " + CAST.quartermasterName + "'s inspection of his party is old: it was written a while ago, not just now.",
  "tampered-decision": CAST.envoy + " asked, and " + CAST.stewardName + "'s signed order said yes. Then someone changed the order after it was signed.",
  "replayed-decision": CAST.envoy + " asked, and " + CAST.stewardName + "'s signed order said yes, for that one errand. Now the same order is being shown for a different errand.",
  "bypass-attempt": "Someone does not come to the gate at all. They try to climb the wall and take the Ledger with no order, and the attempt is watched.",
};

// One short phrase per scenario for status lines and buttons.
const SCENARIO_SITUATION = {
  "happy-path": CAST.envoy + "'s normal errand, nothing amiss",
  "identity-no-authority": CAST.envoy + " arrives with no letter",
  "revoked-delegation": "the Taken-Back Letter",
  "stale-attestation": "the Old Inspection",
  "tampered-decision": "the Broken Seal",
  "replayed-decision": "Yesterday's Pass",
  "bypass-attempt": "Over the Wall",
};

// The exact words of the Predict screen options, keyed by the engine
// values they record. Used to echo a prediction back in the same words
// the learner picked.
const DECISION_OPTION = {
  PERMIT: "Let " + CAST.envoy + " take the Ledger",
  DENY: "Turn him away",
  INDETERMINATE: "Say she cannot be sure",
};

const ENFORCEMENT_OPTION = {
  ALLOWED: "The Ledger is handed over",
  DENY: "Nothing happens, he was turned away",
  DENY_INDETERMINATE: "Nothing happens, " + CAST.stewardName + " could not be sure",
  REJECTED: "Nothing happens, the order was thrown out",
  BYPASS_BLOCKED: "Nothing happens, the attempt was blocked",
};

// Learn phase, part 1: meet the parts. One part at a time, plain
// words, one job and one everyday picture each. No system words here;
// the system names live in the inspector and the Architect layer.
const LEARN_PARTS = [
  {
    name: CAST.envoyFull,
    job: "He does the asking: he has come to fetch " + CAST.resourceName + " from " + CAST.vault + ".",
    picture: "Real concept: the workload, the program that makes the request.",
  },
  {
    name: CAST.herald + " and the house colors",
    job: CAST.heraldName + " announces who " + CAST.envoy + " claims to serve, and the house colors back the claim. A claim, nothing more: it says who he says he is, and nothing about what he may do.",
    picture: "Real concept: identity.",
  },
  {
    name: "The Sealed Letter",
    job: CAST.lord + "'s sealed order: this envoy may collect this one ledger, nothing else.",
    picture: "Real concept: the grant, delegated authority. Permission comes from this letter, never from who " + CAST.envoy + " is.",
  },
  {
    name: CAST.quartermaster + "'s inspection",
    job: CAST.quartermasterName + " inspects " + CAST.envoy + "'s party and writes a dated report: gear sound, nothing messed with. It only helps if it is fresh.",
    picture: "Real concept: attestation, the workload's own report about itself.",
  },
  {
    name: CAST.steward,
    job: "The checker. She reads the herald's claim, the Sealed Letter, and the inspection together, then decides: yes, no, or cannot be sure.",
    picture: "Real concept: the decision point.",
  },
  {
    name: CAST.guard + " of the gate",
    job: "He opens the vault door only on " + CAST.stewardName + "'s signed order. An order changed after signing gets thrown out.",
    picture: "Real concept: enforcement, the point that acts on the decision.",
  },
  {
    name: "The Chronicle",
    job: CAST.scribe + " writes every step in order: what was asked, what was checked, what was decided, what happened. Pages are never torn out.",
    picture: "Real concept: the evidence ledger.",
  },
];

// Learn phase, part 2: watch it flow. The normal request moving
// through the parts in order, one sentence per beat. The learner taps
// through at their own pace; nothing advances on its own, and every
// beat is a full sentence in text, so the highlight is never the only
// carrier of the meaning.
const FLOW_BEATS = [
  { part: 0, text: CAST.envoy + " arrives at the gatehouse and asks for " + CAST.resourceName + "." },
  { part: 1, text: CAST.stewardName + " hears the herald's claim: " + CAST.envoy + " serves the Counting House. The claim checks out." },
  { part: 2, text: CAST.stewardName + " reads the Sealed Letter. Collecting this one ledger is allowed, for this envoy." },
  { part: 3, text: CAST.stewardName + " reads " + CAST.quartermasterName + "'s inspection. It is fresh, and nothing has been messed with." },
  { part: 4, text: CAST.stewardName + " decides: yes. Her order is signed and tied to this one errand." },
  { part: 5, text: CAST.guard + " checks the order and opens the vault door." },
  { part: 6, text: CAST.scribe + " writes every step in the Chronicle, in order." },
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

// --- Global navigation (Back and Reset) -----------------------------
// One navigation bar under the page head serves every screen. Back
// walks the stack of visited screens; Reset is shared by the bar and
// the Repair screen through one gate and one perform function.
const navStack = new ScreenStack();
const resetGate = new ResetGate();
// The page loads on the first screen, so the stack starts there:
// Back from the first screen a learner visits lands back on it.
navStack.visit(1);

function showScreen(n, options) {
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
  // Record the screen actually landed on. A Back landing already has
  // its screen on top of the stack; a guard redirect resyncs here.
  if (!(options && options.fromBack) || navStack.current() !== n) navStack.visit(n);
  if (n === 4) renderPredictGate();
  if (n === 7) prepareRepair();
}

// Whether a screen may still be shown right now. Outcome screens (5
// and 6) need a recorded prediction on the active run, the same rule
// the showScreen guard enforces.
function screenStillValid(n) {
  if (n === 5 || n === 6) {
    const run = journey.activeRun();
    return Boolean(run && run.prediction);
  }
  return true;
}

// Back: drop the current screen, then land on the most recent earlier
// screen that is still valid. Stack entries for outcome screens whose
// run has since been replaced are skipped. An empty stack, or nothing
// valid left in it, lands on the first screen. The showScreen guard
// still applies to the landing, so Back never bypasses it.
function goBack() {
  navStack.back();
  let target = navStack.current();
  while (target !== null && !screenStillValid(target)) {
    navStack.back();
    target = navStack.current();
  }
  if (target === null) {
    navStack.visit(1);
    target = 1;
  }
  showScreen(target, { fromBack: true });
}

// One confirmation state for both Reset controls (the navigation bar
// and the Repair screen). Opening or closing moves both confirmation
// blocks together, and both confirm buttons run performReset().
function setResetConfirmVisible(open) {
  if (open) resetGate.open();
  else resetGate.close();
  el("nav-reset-confirm").hidden = !open;
  el("reset-confirm").hidden = !open;
}

// The single reset implementation. It runs only while the shared
// confirmation is open (see ResetGate). Semantics are the Repair
// screen's original ones: the active run is archived into Prior runs,
// run data is cleared, states re-render, and the learner lands on the
// first screen. The navigation stack is cleared as part of the reset.
function performReset() {
  resetGate.confirm(() => {
    journey.reset();
    runData = null;
    navStack.clear();
    setResetConfirmVisible(false);
    renderRunInfo();
    renderComponentStates();
    showScreen(1);
  });
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

// --- Journey progress ribbon ---------------------------------------
// One ribbon per learning-path screen, keyed by the screen's
// data-stage attribute. The ribbon names stages only: it never shows
// outcomes, decisions, or results. Stage state is carried in text
// ("done", "you are here") as well as style.
const RIBBON_STAGES = [
  ["meet", "Meet the court"],
  ["road", "The road"],
  ["counsel", "Your counsel"],
  ["watch", "Watch it happen"],
  ["chronicle", "The Chronicle"],
  ["set-right", "Set it right"],
  ["teach", "Teach it back"],
];

function renderRibbons() {
  document.querySelectorAll(".journey-ribbon").forEach((nav) => {
    const currentIndex = RIBBON_STAGES.findIndex(([id]) => id === nav.dataset.stage);
    const list = make("ol", "ribbon-list");
    RIBBON_STAGES.forEach(([id, label], i) => {
      const item = make("li", "ribbon-stage");
      item.append(document.createTextNode(label));
      if (currentIndex >= 0 && i < currentIndex) {
        item.classList.add("is-done");
        item.append(make("span", "ribbon-state", " ✓ done"));
      } else if (i === currentIndex) {
        item.classList.add("is-current");
        item.setAttribute("aria-current", "step");
        item.append(make("span", "ribbon-state", " you are here"));
      }
      list.append(item);
    });
    nav.replaceChildren(list);
  });
}

// --- Kingdom map instances ------------------------------------------
// Built once from map.js geometry: one for the Learn flow, one for
// the step runner. The textual beat list and step list remain the
// canonical carriers of meaning; the map is a visual echo.
let learnMap = null;
let runnerMap = null;

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
  if (learnMap) {
    const visited = [];
    for (let i = 0; i < beatIndex; i += 1) visited.push(BEAT_NODE[FLOW_BEATS[i].part]);
    setRoadMapState(learnMap, BEAT_NODE[beat.part], visited, "you are here");
  }
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
    SCENARIO_STORY[run.scenario] || (CAST.envoyFull + " has come to fetch " + CAST.resourceName + "."));
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
    workload: run ? "Asking for " + CAST.resourceName : "Ready at the gate",
    identity: "Not yet checked",
    grant: "Not yet checked",
    attestation: "Not yet checked",
    decision: "Not decided yet",
    enforcement: "Waiting for " + CAST.stewardName + "'s order",
    resource: "The King's Ledger. Not handed over yet",
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
    states.ledger = runData.records.length + " entries written so far";
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
      currentText += ". " + CAST.stewardName + " has checked the posted list of taken-back letters. Taken back: " +
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
      currentText = "No inspection was judged in this run. The limit in this lab is 300 seconds, a synthetic lab constant (a lab constant, non-normative).";
    }
  }
  if (component === "decision") { currentText = "Not decided yet"; }
  if (component === "enforcement") { currentText = "Waiting for " + CAST.stewardName + "'s order"; }
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

// A recorded prediction is immutable in the state model: it can never
// be changed or re-recorded for its run, before or after the outcome
// is viewed. So whenever the Predict screen is shown for a run that
// already has a prediction, the gate renders locked: the recorded
// prediction is shown as read back text, the choices, the reason box,
// and the record button are disabled, and a plain note explains why.
// Only a fresh run (which archives the old one) opens a fresh gate.
function renderPredictGate() {
  const run = journey.activeRun();
  const pred = run ? run.prediction : null;
  const locked = Boolean(pred);
  el("predict-locked").hidden = !locked;
  if (locked) {
    text(el("predict-locked-summary"), "Your recorded prediction: " +
      (DECISION_OPTION[pred.decision] || pred.decision) +
      ". At the gate: " + (ENFORCEMENT_OPTION[pred.enforcement] || pred.enforcement) +
      ". Your reason: " + pred.reason);
  }
  document.querySelectorAll("[data-decision], [data-enforcement]").forEach((b) => {
    b.disabled = locked;
  });
  el("pred-reason").disabled = locked;
  if (locked) el("record-prediction").disabled = true;
  else updateGate();
}

function updateGate() {
  const run = journey.activeRun();
  if (run && run.prediction) {
    el("record-prediction").disabled = true;
    return;
  }
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
  if (runnerMap) {
    const visited = [];
    for (let i = 0; i < stepIndex; i += 1) {
      visited.push(COMPONENT_NODE[stepFor(records[i]).component] || "scriptorium");
    }
    setRoadMapState(runnerMap,
      COMPONENT_NODE[step.component] || "scriptorium", visited, "the request is here");
  }
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
  text(el("evidence-request"), "Every entry in the Chronicle from this run, in the order it happened. " +
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
    if (r.type === "resource.bypass_attempt") li.append(make("p", "status-word", "Trial entry: an attempt over the wall, direct access with no order"));
    if (r.type === "lab.clock_fault") li.append(make("p", "status-word", "Trial entry: the lab clock was advanced"));
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
    text(el("repair-note"), "No active run to set right.");
    btn.hidden = true;
    return;
  }
  const wording = REPAIR_WORDING[run.manipulation];
  el("replay-repair-note").hidden = run.manipulation !== "replay-decision";
  if (!wording) {
    text(el("repair-note"), "This run has no trial to set right. It is already the normal errand.");
    btn.hidden = true;
  } else {
    text(el("repair-note"), "This sets right the one trial in this run. It only prepares the fix; the rerun confirms it.");
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
  renderRibbons();
  learnMap = buildRoadMap();
  el("road-map-learn").append(learnMap);
  runnerMap = buildRoadMap();
  el("road-map-runner").append(runnerMap);
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
    // Locked runs never reach setPrediction: the gate renders locked
    // for them, and this guard keeps a stray click from throwing.
    if (run.prediction) { renderPredictGate(); return; }
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
    announce.append(make("p", "", "Paused. Nothing moves until you tap Next step."));
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
  // Global navigation bar: Back walks the visited-screen stack, and
  // both Reset controls share one confirmation and one performReset().
  el("nav-back").addEventListener("click", goBack);
  el("nav-reset").addEventListener("click", () => setResetConfirmVisible(true));
  el("nav-reset-no").addEventListener("click", () => setResetConfirmVisible(false));
  el("nav-reset-yes").addEventListener("click", performReset);
  el("reset-button").addEventListener("click", () => setResetConfirmVisible(true));
  el("reset-confirm-no").addEventListener("click", () => setResetConfirmVisible(false));
  el("reset-confirm-yes").addEventListener("click", performReset);
  el("teach-1").addEventListener("input", updateFinish);
  el("teach-2").addEventListener("input", updateFinish);
  el("finish-journey").addEventListener("click", finishJourney);
  document.querySelectorAll(".export-session").forEach((b) =>
    b.addEventListener("click", exportSession));
}

buildStatic();
renderRunInfo();
