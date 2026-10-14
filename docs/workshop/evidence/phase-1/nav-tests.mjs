// Navigation smoke tests for the global Back and Reset controls.
// The navigation rules live in DOM free modules on purpose (nav.js and
// state.js), so this script exercises those layers directly, the same
// way state-tests.mjs exercises state.js, and asserts the shipped
// markup in index.html carries the controls. Run from the repository
// root:
//   node docs/workshop/evidence/phase-1/nav-tests.mjs
import { readFileSync } from "node:fs";
import { ScreenStack, ResetGate } from "../../../../workshop/js/app/nav.js";
import { Journey } from "../../../../workshop/js/app/state.js";

let passed = 0, failed = 0;
function check(name, fn) {
  try { fn(); passed += 1; console.log("PASS " + name); }
  catch (e) { failed += 1; console.log("FAIL " + name + ": " + e.message); }
}
function eq(a, b, what) { if (a !== b) throw new Error(what + ": got " + JSON.stringify(a) + ", want " + JSON.stringify(b)); }
function ok(cond, what) { if (!cond) throw new Error(what); }
function throws(fn, part) {
  try { fn(); } catch (e) { if (part && !e.message.includes(part)) throw new Error("wrong error: " + e.message); return; }
  throw new Error("expected a throw, none happened");
}

const html = readFileSync(new URL("../../../../workshop/index.html", import.meta.url), "utf8");
const mainJs = readFileSync(new URL("../../../../workshop/js/app/main.js", import.meta.url), "utf8");

check("1 the global navigation bar sits under the page head, before main, so it is present on every screen", () => {
  const navAt = html.indexOf('<nav class="global-nav"');
  ok(navAt > html.indexOf("</header>"), "nav bar after the page head");
  ok(navAt < html.indexOf("<main>"), "nav bar before main");
});
check("2 the bar carries buttons labeled exactly Back and Reset, and the reset confirmation offers Reset and Keep my progress", () => {
  const navBlock = html.slice(html.indexOf('<nav class="global-nav"'), html.indexOf("</nav>"));
  ok(navBlock.includes('<button type="button" id="nav-back">Back</button>'), "Back button");
  ok(navBlock.includes('<button type="button" id="nav-reset">Reset</button>'), "Reset button");
  ok(navBlock.includes('id="nav-reset-confirm"'), "reset confirmation block");
  ok(navBlock.includes('<button type="button" id="nav-reset-yes">Reset</button>'), "confirm Reset choice");
  ok(navBlock.includes('<button type="button" id="nav-reset-no">Keep my progress</button>'), "confirm Keep my progress choice");
});
check("3 the Predict screen carries the locked prediction note, word for word", () => {
  ok(html.includes("This prediction is recorded. Start a new run to predict again."), "locked note text");
});
check("4 main.js wires the bar through the shared stack and gate", () => {
  for (const needle of ["ScreenStack", "ResetGate", 'el("nav-back")', 'el("nav-reset")', "performReset", "goBack"])
    ok(mainJs.includes(needle), "main.js missing " + needle);
});

const stack = new ScreenStack();
stack.visit(1); stack.visit(9); stack.visit(10); stack.visit(4);
check("5 visit records screens in order and ignores a consecutive duplicate", () => {
  stack.visit(4);
  eq(stack.size(), 4, "stack size after duplicate visit");
  eq(stack.current(), 4, "current screen");
});
check("6 back pops the stack in order and runs out to null", () => {
  eq(stack.back(), 10, "first back");
  eq(stack.back(), 9, "second back");
  eq(stack.back(), 1, "third back");
  eq(stack.back(), null, "back past the start");
});
check("7 clear empties the stack", () => {
  stack.visit(1); stack.visit(5);
  stack.clear();
  eq(stack.current(), null, "current after clear");
  eq(stack.size(), 0, "size after clear");
});

const gate = new ResetGate();
const rstack = new ScreenStack();
rstack.visit(1); rstack.visit(7);
let resets = 0;
const doReset = () => { resets += 1; rstack.clear(); };
check("8 reset confirm while the confirmation was never opened runs nothing", () => {
  eq(gate.confirm(doReset), false, "confirm without open");
  eq(resets, 0, "resets run");
  eq(rstack.size(), 2, "stack untouched");
});
check("9 open then confirm runs the reset once and clears the stack", () => {
  gate.open();
  eq(gate.confirm(doReset), true, "confirm while open");
  eq(resets, 1, "resets run");
  eq(rstack.size(), 0, "stack cleared by the reset");
  eq(gate.isOpen, false, "gate closed after confirm");
  eq(gate.confirm(doReset), false, "second confirm without reopening");
  eq(resets, 1, "resets still one");
});
check("10 closing the confirmation cancels: a later confirm runs nothing", () => {
  gate.open();
  gate.close();
  eq(gate.confirm(doReset), false, "confirm after close");
  eq(resets, 1, "resets still one");
});

const j = new Journey();
const run = j.startRun({ scenario: "happy-path", seed: 7, level: "explore", manipulation: "none" });
j.setOutcomeData(run.runId, { decisionState: "PERMIT", enforcementResult: "ALLOWED" });
j.setPrediction(run.runId, { decision: "PERMIT", enforcement: "ALLOWED", reason: "all checks pass" });
check("11 a recorded prediction alone is not outcome viewing yet", () => {
  eq(j.outcomeViewed(run.runId), false, "outcomeViewed before the final step");
});
j.recordOutcome(run.runId);
check("12 after the outcome is viewed, re-recording a prediction throws and the first prediction stands", () => {
  eq(j.outcomeViewed(run.runId), true, "outcomeViewed after recordOutcome");
  throws(() => j.setPrediction(run.runId, { decision: "DENY", enforcement: "DENY", reason: "changed my mind" }), "prediction already recorded");
  eq(j.activeRun().prediction.decision, "PERMIT", "first prediction decision");
  eq(j.activeRun().prediction.reason, "all checks pass", "first prediction reason");
});

console.log("Navigation tests: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
