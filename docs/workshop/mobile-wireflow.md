# Mobile Wireflow: Payments Report Scenario

Status: DRAFT for owner approval, Phase 0 design document, not an implementation authorization.

## Purpose in plain words

This document describes, in text only, the sequence of phone screens for learning one request. It is a wireflow, meaning a step by step map of screens and what each screen does, not a visual design and not code.

Primary learner: Samuel, using a phone first. Future public learners are secondary. Every screen is designed to work on a narrow phone screen before it is adapted anywhere else.

Scenario grounding: The same payments report request as the learner journey. In the reference engine, the workload path is payments-reporter, the protected resource is /reports/quarterly, and the action is READ. Components: workload, identity, grant, attestation evidence (proof about the workload, checked for freshness), decision point, enforcement point, protected resource, evidence ledger (the append-only record of what happened). Decisions: PERMIT (allowed), DENY (not allowed), INDETERMINATE (cannot be decided safely from the evidence available). Freshness threshold in this lab: 300 seconds, a synthetic lab constant, labeled non-normative (not an official rule for real systems). Revocation uses a seeded list (a prepared list of withdrawn grants).

Labels on every screen: Each screen that shows behavior carries a visible label stating whether what is shown is simulated (modeled in the workshop interface) or reference-tested (produced by the verified reference engine). No screen claims production behavior or real enforcement.

## Screen sequence overview

Screen 1: Component view
Screen 2: Component inspector sheet
Screen 3: Control panel
Screen 4: Predict gate
Screen 5: Step runner with decision trace
Screen 6: Evidence viewer
Screen 7: Repair and reset
Screen 8: Teach-back

The learner moves forward in this order for a guided run. Backward navigation is always available, except that the predict gate rule (Screen 4) cannot be bypassed once a run has started: no outcome is shown before a prediction is recorded.

## Screen 1: Component view

Purpose: Show the whole request as a set of parts, in plain words, one glanceable list or stack suited to a phone.

Contents, top to bottom:

- Title in plain words: The payments report request.
- One sentence story: A workload asks to read a protected report. The system checks who it is, what it is allowed to do, and whether its proof is fresh, then decides and enforces the decision.
- Component stack, each row tappable, each row showing an icon plus a text label plus a short state in words (never color alone):
  1. Workload: payments-reporter, state in words (for example: Ready, or Requesting READ).
  2. Identity: state in words (for example: Present and valid, or Missing).
  3. Grant: state in words (for example: Present, or Revoked, or Missing).
  4. Attestation evidence: state in words plus age in seconds (for example: Fresh, age 12 seconds, or Stale, age 301 seconds).
  5. Decision point: state in words (for example: Not yet run, or Decision: PERMIT).
  6. Enforcement point: state in words (for example: Waiting for a decision, or Result: ALLOWED).
  7. Protected resource: /reports/quarterly, state in words (for example: Not accessed, or Read).
  8. Evidence ledger: entry count in words and numbers (for example: 9 entries recorded).
- Button: Inspect a component (opens Screen 2 for the selected component). Every component row is itself a button, so tapping and button use are the same action with two presentations.
- Button: Open control panel (goes to Screen 3).
- Label: Simulated or reference-tested, in words, at the top of the screen.

Interaction notes: No gesture is required on this screen. Scrolling is standard. Nothing depends on animation to be understood.

## Screen 2: Component inspector sheet

Purpose: When the learner taps a component, show what that component is, what state it is in, and how it can fail, in plain words first.

Behavior: Tapping any component in Screen 1 opens a sheet (a panel that slides over the lower part of the screen, with a Close button and a standard close gesture, both available) for that component. The sheet has the same six sections for every component, in this order:

1. Purpose: What this component does for the request, in one or two plain sentences, before any technical term. Any shortened technical term is expanded in plain words at first use on the sheet.
2. Current state: The component state in words, with an icon plus a text label, never color alone. For attestation evidence, the age in seconds and the 300 second lab threshold are both shown as numbers and words.
3. Inputs: What this component receives, listed in plain words (for example, for the decision point: identity, grant, attestation evidence, resource, action).
4. Outputs: What this component produces, listed in plain words (for example, for the decision point: a signed decision of PERMIT, DENY, or INDETERMINATE, with a reason).
5. Authority: What this component is and is not allowed to do. For example, the enforcement point acts on a decision, it does not invent one. The identity proves who the workload is, it grants no permission by itself.
6. Failure behavior: What happens when this component fails or its input is bad, grounded only in engine behavior. Examples: a revoked grant leads the decision point to DENY with a reason naming revocation; stale attestation leads to INDETERMINATE, never a silent PERMIT; a tampered decision fails signature validation at the enforcement point and is REJECTED; a decision presented for the wrong request is REJECTED for binding; direct access with no decision is BYPASS_BLOCKED and recorded.

Per component notes:

- Workload: Purpose is to request READ on /reports/quarterly. It has no authority to grant itself access.
- Identity: Purpose is to prove who the workload is. Failure behavior: a valid identity with no grant still leads to DENY (scenario identity-no-authority).
- Grant: Purpose is to carry permission from the authority source (finance-control in the engine). Its sheet shows whether a revocation check has been performed and its result. Failure behavior: revoked leads to DENY.
- Attestation evidence: Purpose is to carry recent proof about the workload. Its sheet shows issue time, age, and the freshness verdict in words (FRESH or STALE).
- Decision point: Purpose is to evaluate identity, grant, and attestation together and issue a signed decision. It never invokes the protected resource itself.
- Enforcement point: Purpose is to check the decision (signature and request binding) and act on it before the protected resource. Failure behavior covers REJECTED for tampered, REJECTED for replayed, and BYPASS_BLOCKED for no decision.
- Protected resource: Purpose is to hold the report. It is invoked only when the decision is PERMIT and enforcement returns ALLOWED.
- Evidence ledger: Purpose is to record each step in order, linked so a decision and its enforcement outcome can be correlated. Its sheet explains in plain words that entries are appended, not rewritten, in this lab model.

Close behavior: A Close button is always visible. The sheet also closes by the standard dismiss gesture, but the button alone is sufficient, so no learner is required to use the gesture.

## Screen 3: Control panel

Purpose: Let the learner change exactly one fault at a time, from a closed list. Nothing outside this list can be changed.

The panel is limited to the five contract-supported manipulations only. Each control is a labeled button plus a short line stating what it changes, in plain words:

1. Revoke the grant. What it changes: Adds the current grant to the seeded revocation list. The grant document still exists. Expected decision change is not shown here, it is predicted on Screen 4.
2. Age the attestation. What it changes: Advances the lab clock so the attestation age exceeds 300 seconds (the scenario uses 301 seconds), while identity and grant are issued fresh. Only the attestation becomes stale.
3. Tamper with a decision. What it changes: Alters one claim in the signed decision after signing (the resource field, as in the engine scenario). It changes the decision text, not the signature.
4. Replay a decision. What it changes: Takes a genuine decision bound to a first request and presents it for a second, different request, with a new request identifier and a new one-time value.
5. Attempt a bypass. What it changes: Tries to reach the protected resource directly, with no decision at all.

Also on this screen:

- Button: Clear all faults (returns every control to the happy path state, ahead of Screen 7 repair in a guided run, the learner repairs one fault at a time rather than clearing blindly).
- Text: One fault at a time for guided runs. In free Operate runs, the panel still allows only these five manipulations, singly or in combinations the engine scenarios support, and states plainly when a combination has no engine scenario behind it.
- No other controls exist on this panel. In particular, there is no control for credential rotation, no control for editing policy, and no control for a dependency outage, because the engine performs none of those.

## Screen 4: Predict gate

Purpose: Record the learner prediction before any outcome exists on screen. This gate is mandatory, not optional.

Contents:

- Prompt in plain words: Before you run this, what do you predict?
- Choice, decision: PERMIT, DENY, or INDETERMINATE. Each option is a button with the word plus a one line plain meaning.
- Choice, enforcement result: ALLOWED, DENY, DENY_INDETERMINATE, REJECTED, or BYPASS_BLOCKED. Each option is a button with the word plus a one line plain meaning. The full list is shown so the learner chooses, not guesses from a narrowed list designed to hint.
- Field: Reason in your own words (short text input). A reason is required. A prediction without a reason does not open the gate.
- Button: Record prediction and continue. Until this button is pressed with both choices and a reason present, the Run button on Screen 5 is unavailable, and no trace, decision, or outcome is rendered anywhere.
- Text: Your prediction will be shown next to the actual outcome after the run, unchanged.

Behavior rule: Once a prediction is recorded for a run, it cannot be edited after the outcome is revealed. Starting a new run creates a new prediction.

## Screen 5: Step runner with decision trace

Purpose: Run the request one step at a time, pausing so the learner can inspect, instead of showing only a final result.

Contents:

- Step indicator in words and numbers (for example: Step 3 of 9: Revocation check).
- Current step description in plain words, stating what is being checked and what was found, in words (for example: The grant was found on the revocation list).
- Decision trace: A vertical list of steps in engine order for the happy path: identity issued, grant given, identity validated, revocation checked, grant validated, attestation appraised, decision made, protected operation (only when applicable), enforcement outcome. For fault scenarios, the trace shows the steps the engine actually performs for that scenario, and stops or branches exactly where the engine does. Each trace row has an icon plus a text label, never color alone.
- Decision states announced in words: When the decision step is reached, the decision is stated as a full sentence (for example: Decision: DENY. Reason: the grant has been revoked). The same sentence is available to assistive technology as a live announcement (a spoken or read aloud update, where the device supports it), and is always visible as text, so it never depends on sound or animation.
- Buttons: Next step, Previous step, Inspect current component (opens Screen 2 for the component involved in the current step), Pause (the runner is paused by default between steps, this button returns to a paused state after any continuous play, if continuous play is offered at all).
- Button: View evidence (goes to Screen 6) available at the end of the run, and at any pause for entries recorded so far.
- Prediction reminder: The recorded prediction from Screen 4 is shown, collapsed by default until the final step, then shown beside the actual outcome in full.

Interaction notes: Stepping is by buttons. Swipe gestures, if offered, are additions only, never the sole way to advance. The trace is fully readable with animation disabled: each step appears as text, and no meaning is carried by motion, timing, or color.

## Screen 6: Evidence viewer

Purpose: Show the recorded proof of what happened, so the learner can check the trace against the record.

Contents:

- Request identifier in words and text, and the list of ledger entries for this request, in order, each entry showing: type in plain words, time or sequence position, and the key fact in words (for example: Revocation check: revoked, true).
- Correlation highlight, by text label not color alone: entries that share the decision identifier are labeled Same decision, so the learner can link the decision entry to the enforcement outcome entry.
- For fault runs: the fault entry is visible where the engine records it (for example, a bypass attempt entry, or a lab clock advance entry in the stale attestation scenario), labeled in plain words.
- Button: Back to step runner. Button: Continue to repair (goes to Screen 7).
- Label: Whether these entries are simulated or reference-tested, in words, matching the label carried from earlier screens.

## Screen 7: Repair and reset

Purpose: Put the fault right, one fault at a time, and prove the repair by rerunning.

Contents:

- Diagnosis prompt in plain words: What broke, which stage caught it, and what will you change to repair it? A short text answer is recorded before repair controls unlock, mirroring the predict gate discipline at a smaller scale.
- Repair controls, one per active fault, each a button labeled with what it reverses, in plain words:
  1. Restore the grant (remove it from the revocation list).
  2. Issue a fresh attestation (reset its age below the 300 second threshold).
  3. Use the original untampered decision (discard the altered decision).
  4. Use the decision only for its own request (present a new decision for the new request, obtained through the normal decision step, not by reusing the old one).
  5. Stop the bypass (request a decision through the normal path instead of direct access).
- Rule stated on screen: Repair never broadens authority. A repair restores the happy path permissions exactly, it never adds a new permission, a wider resource, or a different action.
- Button: Rerun after repair (returns to Screen 4 for a fresh prediction, then Screen 5). A repair is not confirmed until the rerun shows the happy path outcome with a new recorded prediction.
- Button: Reset scenario (clears all faults, predictions, and trace for this scenario, and returns to Screen 1). Reset is a button, never a gesture only action, and asks for confirmation in words before clearing.

## Screen 8: Teach-back

Purpose: Close the journey by having the learner explain, not just recognize.

Contents:

- Prompt 1: Explain this request in your own words, from workload to protected resource, naming what each part contributed.
- Prompt 2: Explain one fault you broke and repaired: what you changed, what you predicted, what actually happened, and which stage caught it.
- Prompt 3: For each memory anchor used in this journey: say what the cue captures and what it omits. (Anchors are drafts until Samuel approves them, and are labeled DRAFT on this screen until approved.)
- Input: Text or voice to text, at the learner choice. No answer is auto-graded by keyword matching alone in this design: teach-back is recorded for review and for the Study Lab ledger (the per-learner progress record).
- Button: Finish journey (records teach-back, prediction history, and repair history as the journey evidence, and returns to Screen 1).
- Text in plain words: Finishing requires a teach-back entry. Skipping teach-back leaves the journey marked incomplete.

## Accessibility requirements (apply to every screen)

These are requirements, not preferences. A screen that fails any of them is not done.

1. Every gesture has a button alternative: Tapping, swiping, long pressing, dragging, or dismissing by gesture is never the only way to perform an action. Inspecting, stepping, closing a sheet, advancing, repairing, and resetting are all available as visible buttons with text labels.
2. Status is never conveyed by color alone: Every state (component state, decision state, enforcement result, trace step outcome) is shown with an icon plus a text label, and where relevant a full sentence. A learner who cannot distinguish any colors loses no information.
3. Decision states are announced in words: PERMIT, DENY, and INDETERMINATE, and every enforcement result, are written out in full words on screen at the moment they occur, and provided as a text announcement for assistive technology. No decision is conveyed only by sound, color, icon, or animation.
4. Readable without relying on animation: All meaning survives with animation off. Steps appear as text, state changes are labeled in words, and no information is carried only by movement, flashing, timing, or transitions.
5. Text legibility on a phone: Plain language headings, sufficient contrast by design target (to be verified in implementation, not claimed here), and no essential information placed only inside an image.
6. Predict gate integrity under assistive technology: The gate on Screen 4 must hold for every input method. No outcome text exists in the reading order before a prediction is recorded.

## What this wireflow does not do

- It is not a visual design, not code, and not an implementation authorization.
- It introduces no manipulation beyond the five listed on Screen 3.
- It makes no production or real enforcement claim on any screen.
