# Memory Anchor Specification

Status: DRAFT for owner approval, Phase 0 design document, not an implementation authorization.

## Purpose in plain words

A memory anchor is a small, honest handle for one idea. It helps the learner remember what the idea means, predict what the system will do, and notice where the handle stops being accurate. It is not a slogan to repeat. It is a tool for thinking.

Primary learner: Samuel, including when he is a beginner in a subdomain (a narrower area inside a larger field). Future public learners are secondary.

Grounding note: Every behavior described in this document comes from the verified reference engine in labs/decision-service and its accepted contracts. The engine has seven scenarios: happy-path, identity-no-authority, revoked-delegation, stale-attestation, tampered-decision, replayed-decision, and bypass-attempt. Decisions are PERMIT (allowed), DENY (not allowed), and INDETERMINATE (cannot be decided safely from the evidence available). Nothing in this document adds a capability the engine does not perform.

## The anchor schema

Every anchor, without exception, has all seven fields below. An anchor missing any field is incomplete and cannot be approved.

1. Plain-language meaning (one sentence): What the idea means, stated in ordinary words, in a single sentence, with no jargon doing the work.
2. Mnemonic or retrieval cue (a memory prompt that helps recall): A short cue that is semantically accurate, meaning it points at the real cause and effect, not just at a rhyme or a catchy phrase.
3. Visual or physical association: A workshop component the learner can see, tap, or picture, or an action the learner performs, that the cue is tied to. Example components: workload, identity, grant, attestation evidence (proof about the workload, checked for freshness), decision point, enforcement point, protected resource, evidence ledger (the append-only record of what happened).
4. Counterexample: Where the analogy or cue breaks down. This field states the limit plainly, and gives a case where following the cue alone would lead the learner astray.
5. Behavioral test: A prediction plus a manipulation (a change the learner makes inside the workshop). The learner states what will happen before running it, then makes the change and observes the actual decision and enforcement outcome. Passing means the prediction matched the behavior for the stated reason.
6. Teach-back prompt: A prompt that asks the learner to explain the idea in their own words, including what the cue captures and what it omits.
7. Delayed retrieval rule: How the idea returns later, without showing the cue first. The learner must retrieve the meaning and predict behavior from memory, with reduced hints. See the recall loop below for interval handling.

## The recall loop

The loop has five stages. The order matters. Skipping prediction or teach-back breaks the loop.

Stage 1, Immediate (predict and explain right after exploration): Straight after exploring a scenario, the learner predicts the outcome of a small variation and explains why, in plain words, before the outcome is shown.

Stage 2, Later in session (retrieve with visual aid hidden): Later in the same session, the same idea returns with its visual aid and cue hidden. The learner retrieves the meaning and predicts behavior from memory alone.

Stage 3, Delayed (reduced hints, fixed interval ladder): In a later session, the idea returns with fewer hints. Scheduling follows the Study Lab ledger's existing fixed interval ladder (1, 2, 5, 12, 25 days) unchanged. Reduced hints at later stages still apply, but interval timing is the fixed ladder, not a performance-adjusted rule. Adaptive scheduling is deferred as a Phase 1 design gate.

No scheduling rule in this document is claimed to be validated learning science. The ladder is the ledger's existing practice, adopted for consistency. Any performance-based adjustment rule must be designed, specified, and approved before it becomes an acceptance criterion.

Stage 4, Transfer test (changed scenario, apply rather than repeat): The learner faces a changed scenario that uses the same underlying rule in a new surface form. Success is applying the rule to predict the new outcome, not repeating the original wording.

Stage 5, Explain-back (say what the cue captures and what it omits): The learner states, in their own words, what the cue gets right and what it leaves out or oversimplifies. This stage closes the loop for that anchor in that cycle.

## The anti-mnemonic-theater rule

Mnemonic theater means performing memory without understanding: reciting a cue fluently while being unable to predict or explain real behavior.

Rule: No credit is given for reciting a cue without predicting or explaining real behavior.

In practice:

- A correct cue with a wrong prediction is a fail for that check. The learner revisits the scenario, not just the wording.
- A correct prediction with a wrong reason is a partial pass at best. The reason is the learning.
- Prefer causally meaningful cues (cues that name the cause and the effect) over catchy but misleading slogans. If a cue is memorable but points at the wrong cause, it is rejected or rewritten, however good it sounds.
- Counterexamples are not optional decoration. An anchor the learner cannot bound is an anchor the learner does not yet hold.

## Samuel approval gate

Every anchor is a draft until Samuel approves or rewrites it. No anchor is normative, meaning no anchor counts as an official definition of a security idea, and no anchor may be presented to any other learner as settled until Samuel has approved the exact wording.

- Status of each anchor below: proposed, DRAFT, pending Samuel approval.
- Samuel may approve, rewrite, or reject any field, including the cue itself.
- If Samuel rewrites a cue, the rewritten version replaces the draft in full, and the behavioral test and counterexample are rechecked against the new wording.
- Approved anchors are recorded as approved, with date, in the Study Lab ledger. Unapproved anchors stay visibly labeled DRAFT wherever they appear.
- Draft-anchor display rule: Only owner-approved anchors participate in learner recall. Draft anchors appear only in an owner review flow, visibly marked DRAFT, or are omitted entirely.
- The anchor wording version must be recorded with Study Lab ledger entries, so a recall result is always tied to the exact wording used.

Approval-status record:

- Anchor A, Authentication versus authorization: DRAFT pending Samuel, wording version v0-draft.
- Anchor B, Attestation freshness: DRAFT pending Samuel, wording version v0-draft.
- Anchor C, Revocation: DRAFT pending Samuel, wording version v0-draft.
- Anchor D, Decision integrity check: DRAFT pending Samuel, wording version v0-draft.
- Anchor E, Replay binding: DRAFT pending Samuel, wording version v0-draft.

## DRAFT anchors

Each anchor below is headed DRAFT, is labeled proposed and not a normative security definition, and is grounded in its matching engine scenario.

### DRAFT Anchor A: Authentication versus authorization

Status: Proposed, DRAFT, pending Samuel approval. Not a normative security definition.

Grounded scenario: identity-no-authority. In the engine, a workload presents a valid identity and fresh attestation evidence, but no grant. The decision is DENY, and the protected operation is not invoked.

Grounding note on identity validation: The lab validates the identity object's signed claims and expiry in-process. It does not perform real-world credential proof of possession, external identity provider verification, or an authentication ceremony, so this anchor teaches the distinction between identity, authentication, and authorization at lab fidelity only.

1. Plain-language meaning: Identity is the claimed identity of the actor, authentication checks the evidence presented for that claimed identity, and authorization evaluates whether the identified actor may perform a specific action on a specific resource, and passing authentication grants nothing by itself.
2. Mnemonic or retrieval cue: Who you claim to be, whether your evidence checks out, and what you may do are three separate questions.
3. Visual or physical association: In the workshop, the identity component lights up as present and valid, while the grant slot beside it stays empty. The learner taps the empty grant slot and sees that there is nothing for the decision point to rely on as permission.
4. Counterexample: The cue breaks down if the learner treats identity as worthless, or treats authentication as the same thing as identity. Identity and authentication still matter: the decision point checks the evidence presented for the claimed identity, and a grant is tied to a specific identity and workload. The point is narrower: a claimed identity whose evidence passes authentication carries no permission by itself. In the engine, a decision made with no grant records no authority provenance (no structured record of who granted what, and on what basis).
5. Behavioral test: Prediction: if the workload keeps its valid identity, and its identity evidence still passes authentication, but the grant is removed, the decision will be DENY, not PERMIT. Manipulation: remove the grant in the identity-no-authority scenario and run step by step. Pass condition: the learner predicted DENY before running, and explained that the missing grant, not a failed authentication, caused it.
6. Teach-back prompt: Explain, in your own words, why an actor whose identity evidence passes authentication can still be denied, name what authentication checks, and name what authorization separately decides.
7. Delayed retrieval rule: Return later without showing the cue first, following the Study Lab ledger's existing fixed interval ladder (1, 2, 5, 12, 25 days) unchanged, with reduced hints. Present a valid identity with no grant in a changed surface form, hide the visual aid, and require a prediction plus a reason before any outcome is shown.

### DRAFT Anchor B: Attestation freshness

Status: Proposed, DRAFT, pending Samuel approval. Not a normative security definition.

Grounded scenario: stale-attestation. In the engine, attestation evidence (proof about the workload, with a time it was issued) is older than the declared synthetic threshold. The decision is INDETERMINATE, never PERMIT, and the protected operation is not invoked. The freshness threshold in this lab is a synthetic lab constant of 300 seconds (a synthetic lab constant, not a rule for real systems). It is a lab setting, labeled non-normative (not an official rule for real systems), chosen so the behavior can be tested.

1. Plain-language meaning: When this policy requires fresh attestation, evidence older than its configured limit cannot support a permit in this lab.
2. Mnemonic or retrieval cue: Evidence has a shelf life. In this lab, the shelf life for attestation is a limit set by policy, not a property of all proof.
3. Visual or physical association: In the workshop, the attestation evidence component carries an age readout. The learner watches the age pass the synthetic 300 second lab threshold (a synthetic lab constant, not a rule for real systems), and the component state changes to stale, shown with an icon plus the text label STALE, never by color alone.
4. Counterexample: The shelf life cue breaks down if the learner treats freshness as a universal property of proof, rather than a policy setting applied to a type of evidence. The limit here is configured by policy for attestation in this lab. The cue also breaks down if the learner treats stale as the same as false, or the same as denied for bad behavior. Stale evidence in the engine yields INDETERMINATE, not DENY: the system is saying it does not know enough to permit, not that the requester did something forbidden. The cue also breaks down if the learner treats the synthetic 300 second value (a synthetic lab constant, not a rule for real systems) as a real world rule.
5. Behavioral test: Prediction: if only the attestation is aged past the synthetic 300 second limit (a synthetic lab constant, not a rule for real systems), while identity and grant are issued fresh, the decision will be INDETERMINATE, not DENY and not PERMIT. Manipulation: age the attestation (advance the lab clock by 301 seconds in the stale-attestation scenario, with identity and grant issued fresh after the advance) and run step by step. Pass condition: the learner predicted INDETERMINATE before running, named stale attestation as the cause, and stated that the protected operation would not run.
6. Teach-back prompt: Explain why stale evidence produces INDETERMINATE rather than DENY, and explain why the system must never turn that uncertainty into a silent PERMIT.
7. Delayed retrieval rule: Return later without showing the shelf life cue first, following the Study Lab ledger's existing fixed interval ladder (1, 2, 5, 12, 25 days) unchanged, with reduced hints. Present aged evidence, and require the learner to name the decision state and the enforcement result in words before disclosure.

### DRAFT Anchor C: Revocation

Status: Proposed, DRAFT, pending Samuel approval. Not a normative security definition.

Grounded scenario: revoked-delegation. In the engine, a grant exists, but its identifier is on the seeded revocation list (a prepared list of withdrawn grants used by the lab). The decision is DENY, the decision reason names revocation, and the protected operation is not invoked.

1. Plain-language meaning: When the decision service can observe that a grant is revoked, it denies that grant in this lab.
2. Mnemonic or retrieval cue: A grant the checker can see is revoked stops working here, even though the grant document still exists.
3. Visual or physical association: In the workshop, the grant component remains visible on screen after revocation, but its state label changes to REVOKED, with an icon plus text. The learner taps the grant and sees both facts at once: the grant record exists, and the revocation check has marked it withdrawn.
4. Counterexample: The cue breaks down if the learner pictures revocation as deleting or shredding the grant. In the engine, nothing is deleted: the grant is presented, a revocation check is performed and recorded in the evidence ledger, and the check result is what changes the decision to DENY. The cue also does not cover how a real system learns about revocations when disconnected. That case is out of scope for this lab, and the anchor does not claim it.
5. Behavioral test: Prediction: if a valid grant is placed on the revocation list before the decision, the decision will be DENY, and the reason will name revocation. Manipulation: revoke the grant in the revoked-delegation scenario and run step by step, pausing at the revocation check. Pass condition: the learner predicted DENY before running, located the revocation check in the trace, and explained why the still existing grant did not permit access.
6. Teach-back prompt: Explain, in your own words, the difference between a grant that never existed and a grant that exists but has been revoked, and say what evidence in the ledger distinguishes the two cases.
7. Delayed retrieval rule: Return later without showing the cue first, following the Study Lab ledger's existing fixed interval ladder (1, 2, 5, 12, 25 days) unchanged, with reduced hints. Present a grant that exists and is revoked, with the revocation label initially hidden, and require a prediction plus the name of the check that decides the outcome.

### DRAFT Anchor D: Decision integrity check

Status: Proposed, DRAFT, pending Samuel approval. Not a normative security definition.

Grounded scenario: tampered-decision. In the engine, a decision is issued and signed, then its claims are altered after signing (in the scenario, the resource is changed). The enforcement point performs source validation, the signature check fails, and enforcement returns REJECTED. The protected operation is not invoked.

Note on fidelity: In this lab, the engine signs with HMAC-SHA256 over a shared secret (labs/decision-service/crypto.py). A valid check shows the decision was not altered by a party without the key. Because the key is shared, it does not establish unique authorship among key holders. It demonstrates no public-key verification and no key distribution, and the anchor must not claim otherwise.

1. Plain-language meaning: If a decision is changed after it was signed, the decision integrity check detects the change, and the changed decision is not trusted in this lab.
2. Mnemonic or retrieval cue: If the decision changed after signing, the integrity check fails at enforcement.
3. Visual or physical association: In the workshop, the decision component shows its signed contents. The learner uses the tamper control to change one field, and the enforcement point component shows the integrity validation step failing, labeled with an icon plus the text REJECTED, and a reason that names the signature.
4. Counterexample: The cue breaks down if the learner thinks the integrity check makes the decision correct, or thinks a valid check proves who created the decision. A valid check shows only that the decision was not altered by a party without the key. Because the key is shared, it does not establish unique authorship among key holders, and it demonstrates no public-key verification and no key distribution. A decision that passes its integrity check can still be DENY, and a decision that passes its integrity check but rests on stale evidence would still not permit. Integrity is about tampering, not about wisdom.
5. Behavioral test: Prediction: if any claim in a PERMIT decision is altered after signing, enforcement will return REJECTED, not ALLOWED, even though the altered text still reads PERMIT. Manipulation: tamper with a decision in the tampered-decision scenario (change the resource field) and present it at enforcement, step by step. Pass condition: the learner predicted REJECTED before running, and named the decision integrity check at the enforcement point as the step that caught it.
6. Teach-back prompt: Explain what the decision integrity check proves and what it does not prove, using the tampered decision as your example, and name the enforcement result in words.
7. Delayed retrieval rule: Return later without showing the cue first, following the Study Lab ledger's existing fixed interval ladder (1, 2, 5, 12, 25 days) unchanged, with reduced hints. Present an altered decision and require the learner to predict the enforcement result and the validation step responsible, before any trace is shown.

### DRAFT Anchor E: Replay binding

Status: Proposed, DRAFT, pending Samuel approval. Not a normative security definition.

Grounded scenario: replayed-decision. In the engine, a valid decision is issued for one request, bound to that request by its request identifier and a nonce. Enforcement checks the presented request identifier and nonce against the decision's transaction binding. The first presentation under the decision's own request is ALLOWED. The same decision is then presented for a different request, the presented values do not match the binding, and enforcement returns REJECTED, with the reason naming the binding.

1. Plain-language meaning: A decision is bound to one specific request, and enforcement checks the presented request identifier and nonce against that binding, so presenting the decision for a different request does not work.
2. Mnemonic or retrieval cue: A real decision presented for the wrong request is rejected, because the presented request identifier and nonce do not match the decision's binding.
3. Visual or physical association: In the workshop, the decision component shows the request it is bound to. The learner carries the same decision card to a second, different request in the replay scenario, and the enforcement point shows the binding mismatch, labeled with an icon plus the text REJECTED.
4. Counterexample: The cue breaks down if the learner thinks this check is about the decision being old, or about it being fake. The replayed decision in the engine is genuine and correctly signed. It is rejected only because it is presented for a request it was not bound to. Freshness and integrity can both pass while binding fails. The lab does not demonstrate re-presentation under the identical request and nonce, so no claim is made about duplicate protection under identical context.
5. Behavioral test: Prediction: a genuine PERMIT decision that already succeeded for its own request will be REJECTED when presented for a different request. Manipulation: replay a decision in the replayed-decision scenario (present the first request decision under a new request identifier and a new nonce) and run step by step. Pass condition: the learner predicted REJECTED before the second presentation, confirmed the first presentation was ALLOWED as a description of the scenario sequence, and named the mismatch against the decision's transaction binding as the cause.
6. Teach-back prompt: Explain why a decision can be genuine, fresh, and correctly signed, and still be rejected when presented for a different request, and say what two presented values enforcement checks against the decision's transaction binding in this lab.
7. Delayed retrieval rule: Return later without showing the cue first, following the Study Lab ledger's existing fixed interval ladder (1, 2, 5, 12, 25 days) unchanged, with reduced hints. Present a genuine decision offered for a mismatched request, and require a prediction plus a binding explanation before disclosure.

## What this document does not do

- It does not authorize building any anchor into an interface. Approval of wording comes first, implementation comes later, if at all.
- It does not introduce any behavior beyond the seven engine scenarios listed above.
- It does not present any lab constant, including the synthetic 300 second freshness threshold (a synthetic lab constant, not a rule for real systems), as a rule for real systems.
