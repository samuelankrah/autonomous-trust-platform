// Run state for the workshop journey. This module is DOM free: it never
// touches document or window, so it can be unit tested in Node.
//
// Run state model (from docs/workshop/mobile-wireflow.md):
// - Every run has its own run ID and its own prediction gate.
// - A run outcome is not exposed until that run prediction is recorded.
// - Starting a new run archives the previous one. Archived runs are
//   readable only through priorRuns().
// - Reset archives the active run and clears it.
// - Changing the manipulation or the scenario always creates a new run
//   with a fresh gate, because callers do that through startRun().
//
// This module also accumulates the session export records consumed by
// the Study Lab ingest (workshop_ingest.py). Every export record carries
// a type field and a unique record_id, plus the exact field names the
// ingest requires for that record type.

export const CONTRACT_VERSION = "scenario-contract-v1";

export const MANIPULATION_SCENARIO = {
  "none": "happy-path",
  "revoke-grant": "revoked-delegation",
  "age-attestation": "stale-attestation",
  "tamper-decision": "tampered-decision",
  "replay-decision": "replayed-decision",
  "bypass-attempt": "bypass-attempt",
};

function nowIso() {
  return new Date().toISOString();
}

export class Journey {
  constructor() {
    this._runCounter = 0;
    this._recordCounter = 0;
    this._active = null;
    this._archived = [];
    this._records = [];
    // Outcome data held behind the prediction gate, keyed by run ID.
    this._outcomeData = new Map();
    this._outcomeRecorded = new Set();
  }

  _nextRecordId() {
    this._recordCounter += 1;
    return "rec-" + this._recordCounter;
  }

  _appendRecord(type, fields) {
    const record = Object.assign({ type: type, record_id: this._nextRecordId() }, fields);
    this._records.push(record);
    return record;
  }

  // Starts a new run and archives any previous active run. Returns the
  // new active run object.
  startRun(options) {
    const opts = options || {};
    const scenario = opts.scenario;
    if (!scenario) throw new Error("startRun requires a scenario");
    const seed = opts.seed === undefined ? 7 : opts.seed;
    const level = opts.level || "explore";
    const manipulation = opts.manipulation || "none";
    if (this._active) {
      this._active.status = "archived";
      this._archived.push(this._active);
      this._active = null;
    }
    this._runCounter += 1;
    const run = {
      runId: "run-" + this._runCounter,
      scenario: scenario,
      seed: seed,
      level: level,
      manipulation: manipulation,
      contractVersion: CONTRACT_VERSION,
      fixtureRef: scenario + "-seed-" + seed,
      prediction: null,
      status: "active",
      startedAt: nowIso(),
    };
    this._active = run;
    this._appendRecord("attempt", {
      run_id: run.runId,
      scenario: run.scenario,
      level: run.level,
      manipulation: run.manipulation,
      contract_version: run.contractVersion,
      fixture_ref: run.fixtureRef,
      started_at: run.startedAt,
    });
    return run;
  }

  activeRun() {
    return this._active;
  }

  // Archived runs, oldest first. This is the only way to read them.
  priorRuns() {
    return this._archived.slice();
  }

  _findRun(runId) {
    if (this._active && this._active.runId === runId) return this._active;
    for (const run of this._archived) {
      if (run.runId === runId) return run;
    }
    return null;
  }

  // Records the prediction for a run. A prediction is immutable: a
  // second call for the same run throws.
  setPrediction(runId, prediction) {
    const run = this._findRun(runId);
    if (!run) throw new Error("unknown run: " + runId);
    if (run.prediction) {
      throw new Error("prediction already recorded for " + runId);
    }
    if (!prediction || !prediction.decision || !prediction.enforcement || !prediction.reason) {
      throw new Error("prediction requires a decision, an enforcement choice, and a reason");
    }
    const recorded = {
      decision: prediction.decision,
      enforcement: prediction.enforcement,
      reason: prediction.reason,
      recordedAt: nowIso(),
    };
    run.prediction = recorded;
    this._appendRecord("prediction", {
      run_id: run.runId,
      predicted_decision: recorded.decision,
      predicted_enforcement: recorded.enforcement,
      reason: recorded.reason,
      recorded_at: recorded.recordedAt,
    });
    return recorded;
  }

  // Supplies the outcome data for a run (from an engine run). The data
  // is stored behind the gate: outcome() still returns null until the
  // run prediction exists.
  setOutcomeData(runId, data) {
    const run = this._findRun(runId);
    if (!run) throw new Error("unknown run: " + runId);
    this._outcomeData.set(runId, {
      decisionState: data.decisionState,
      enforcementResult: data.enforcementResult,
    });
  }

  // Returns the outcome for a run, or null until that run prediction
  // has been recorded (and outcome data has been supplied).
  outcome(runId) {
    const run = this._findRun(runId);
    if (!run) return null;
    if (!run.prediction) return null;
    const data = this._outcomeData.get(runId);
    if (!data) return null;
    return {
      decisionState: data.decisionState,
      enforcementResult: data.enforcementResult,
    };
  }

  // Emits the single outcome export record for a run, once, when the
  // run completes its final step. Returns null if the gate is closed
  // or the outcome was already recorded.
  recordOutcome(runId) {
    const data = this.outcome(runId);
    if (!data) return null;
    if (this._outcomeRecorded.has(runId)) return null;
    this._outcomeRecorded.add(runId);
    return this._appendRecord("outcome", {
      run_id: runId,
      decision_state: data.decisionState,
      enforcement_result: data.enforcementResult,
      recorded_at: nowIso(),
    });
  }

  // True once the run outcome has been recorded as viewed (the final
  // step was reached and recordOutcome emitted its record). Read
  // only: it reports a fact the state model already tracks, and it
  // changes nothing about when outcomes are exposed.
  outcomeViewed(runId) {
    return this._outcomeRecorded.has(runId);
  }

  recordDiagnosis(runId, diagnosis) {
    return this._appendRecord("diagnosis", {
      run_id: runId,
      fault_named: diagnosis.faultNamed,
      stage_named: diagnosis.stageNamed,
      text: diagnosis.text,
      recorded_at: nowIso(),
    });
  }

  recordTeachBack(runId, anchorIds, text) {
    return this._appendRecord("teach_back", {
      run_id: runId || "journey",
      anchor_ids: anchorIds || [],
      text: text,
      recorded_at: nowIso(),
    });
  }

  recordRecallAttempt(fields) {
    const result = fields.predictionCorrect && fields.reasonCorrect
      ? "pass"
      : fields.predictionCorrect
        ? "partial"
        : "fail";
    return this._appendRecord("recall_attempt", {
      anchor_id: fields.anchorId,
      anchor_wording_version: "v1-approved",
      stage: fields.stage,
      hint_level: fields.hintLevel,
      prediction_correct: Boolean(fields.predictionCorrect),
      reason_correct: Boolean(fields.reasonCorrect),
      result: result,
      recorded_at: nowIso(),
    });
  }

  recordTransferTest(fields) {
    return this._appendRecord("transfer_test", {
      concept: fields.concept,
      changed_scenario: fields.changedScenario,
      result: fields.result,
      recorded_at: nowIso(),
    });
  }

  // Archives the active run and clears it. The archived run stays
  // reachable only through priorRuns().
  reset() {
    if (this._active) {
      this._active.status = "archived";
      this._archived.push(this._active);
      this._active = null;
    }
  }

  sessionRecords() {
    return this._records.slice();
  }

  buildExport() {
    return {
      export_version: 1,
      kind: "atp-workshop-session",
      contract_version: CONTRACT_VERSION,
      exported_at: nowIso(),
      records: this._records.slice(),
    };
  }
}
