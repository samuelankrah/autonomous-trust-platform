// Fresh AT-03/AT-06 machinery state tests for the Phase 1 evidence pass.
// Written for this pass because the original /tmp acceptance script was
// not retained. Every check below is enumerated; the count is whatever
// this script actually runs. Run from the repository root:
//   node docs/workshop/evidence/phase-1/state-tests.mjs
import { Journey, CONTRACT_VERSION } from "../../../../workshop/js/app/state.js";

let passed = 0, failed = 0;
function check(name, fn) {
  try { fn(); passed += 1; console.log("PASS " + name); }
  catch (e) { failed += 1; console.log("FAIL " + name + ": " + e.message); }
}
function eq(a, b, what) { if (a !== b) throw new Error(what + ": got " + JSON.stringify(a) + ", want " + JSON.stringify(b)); }
function throws(fn, part) {
  try { fn(); } catch (e) { if (part && !e.message.includes(part)) throw new Error("wrong error: " + e.message); return; }
  throw new Error("expected a throw, none happened");
}

const j = new Journey();
const run1 = j.startRun({ scenario: "happy-path", seed: 7, level: "explore", manipulation: "none" });

check("1 outcome() is null before a prediction, with no outcome data supplied", () => {
  eq(j.outcome(run1.runId), null, "outcome before prediction");
});
j.setOutcomeData(run1.runId, { decisionState: "PERMIT", enforcementResult: "ALLOWED" });
check("2 outcome() is still null after outcome data is supplied, while no prediction exists", () => {
  eq(j.outcome(run1.runId), null, "outcome with data but no prediction");
});
check("3 setPrediction with a missing reason throws", () => {
  throws(() => j.setPrediction(run1.runId, { decision: "PERMIT", enforcement: "ALLOWED" }), "reason");
});
check("4 setPrediction with a missing decision throws", () => {
  throws(() => j.setPrediction(run1.runId, { enforcement: "ALLOWED", reason: "r" }), "decision");
});
check("5 setPrediction with a missing enforcement choice throws", () => {
  throws(() => j.setPrediction(run1.runId, { decision: "PERMIT", reason: "r" }), "enforcement");
});
j.setPrediction(run1.runId, { decision: "PERMIT", enforcement: "ALLOWED", reason: "all checks pass" });
check("6 outcome() returns the outcome after a complete prediction is recorded", () => {
  const o = j.outcome(run1.runId);
  eq(o.decisionState, "PERMIT", "decisionState"); eq(o.enforcementResult, "ALLOWED", "enforcementResult");
});
check("7 a second setPrediction for the same run throws and the first prediction is unchanged", () => {
  throws(() => j.setPrediction(run1.runId, { decision: "DENY", enforcement: "DENY", reason: "changed" }), "prediction already recorded");
  eq(j.activeRun().prediction.decision, "PERMIT", "first prediction decision");
  eq(j.activeRun().prediction.reason, "all checks pass", "first prediction reason");
});
check("8 recordOutcome emits exactly one outcome record for the run", () => {
  const rec = j.recordOutcome(run1.runId);
  if (!rec) throw new Error("no outcome record emitted");
  eq(rec.decision_state, "PERMIT", "outcome record decision_state");
  eq(j.recordOutcome(run1.runId), null, "second recordOutcome");
});
const run2 = j.startRun({ scenario: "revoked-delegation", seed: 7, level: "operate", manipulation: "revoke-grant" });
check("9 a new run has outcome() null before its own prediction (gate does not leak across runs)", () => {
  eq(j.outcome(run2.runId), null, "new run outcome");
});
check("10 the completed prior run is archived and readable only through priorRuns()", () => {
  const priors = j.priorRuns();
  eq(priors.length, 1, "prior run count"); eq(priors[0].runId, run1.runId, "prior run id");
  eq(priors[0].status, "archived", "prior run status");
  const o = j.outcome(run1.runId);
  eq(o.decisionState, "PERMIT", "archived run outcome via the recorded path");
});
j.recordRecallAttempt({ anchorId: "A", stage: "immediate", hintLevel: "full", predictionCorrect: true, reasonCorrect: true });
j.recordRecallAttempt({ anchorId: "B", stage: "immediate", hintLevel: "full", predictionCorrect: true, reasonCorrect: false });
j.recordTransferTest({ concept: "Authentication versus authorization", changedScenario: "identity-no-authority", result: "pass" });
j.recordTeachBack(run2.runId, ["A"], "teach-back text");
check("11 recall result derivation: pass only when prediction and reason are both correct", () => {
  const recs = j.sessionRecords().filter(r => r.type === "recall_attempt");
  eq(recs[0].result, "pass", "both correct"); eq(recs[1].result, "partial", "prediction only");
});
check("12 session export shape matches the Study Lab ingest contract", () => {
  const ex = j.buildExport();
  eq(ex.export_version, 1, "export_version"); eq(ex.kind, "atp-workshop-session", "kind");
  eq(ex.contract_version, CONTRACT_VERSION, "contract_version");
  const types = ex.records.map(r => r.type);
  for (const t of ["attempt", "prediction", "outcome", "recall_attempt", "transfer_test", "teach_back"])
    if (!types.includes(t)) throw new Error("export missing record type " + t);
  for (const r of ex.records) if (!r.record_id) throw new Error("record without record_id: " + r.type);
  console.log("export records: " + ex.records.length + " (" + types.join(", ") + ")");
});
check("13 reset() archives the active run and clears it", () => {
  j.reset();
  eq(j.activeRun(), null, "active run after reset");
  eq(j.priorRuns().length, 2, "archived count after reset");
});

console.log("State tests: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
