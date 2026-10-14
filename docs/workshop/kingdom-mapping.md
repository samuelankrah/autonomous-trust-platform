# The Gatehouse: Kingdom Mapping

Status: owner-directed 2026-10-13. Mapping authored by Dex's worker for owner review.

Rename revision note (2026-10-14): at owner direction, the cast was renamed so each name echoes its real concept, as a memory aid (the owner suggested Ideon and Atesia; the rest follow his pattern). The old cast was Pell the envoy, an unnamed herald, Lord Aldric, an unnamed Quartermaster, Steward Maren, Captain Tam, and Brother Anselm the scribe. The new cast is Payton the envoy (payments, the workload), Ideon the herald (identity), Lord Grantham (the grant, the authority source), Quartermaster Atesia (attestation), Steward Decia (the decision point), Captain Dorian (enforcement at the gate), and Brother Evidan (the evidence ledger). Concepts, mechanics, trials, and the approved anchor cues and meanings are unchanged. This revision also added the kingdom map and the journey progress ribbon described at the end of this document.

The reskin is presentation only. Engine behavior, the scenario contract, fixtures, parity, recorded values, and session exports are unchanged. Only display text, names, and theme change.

## The cast

- The gatehouse apprentice: the learner, learning the Steward's craft by watching errands, predicting what Steward Decia will decide, and advising her before the decision is revealed (the learner).
- Payton: envoy of the Counting House, who comes to the gate asking to take the King's Ledger (the workload, a payments reporter program).
- Ideon the herald and the house colors: Ideon announces who Payton claims to serve (identity, the claimed identity).
- The Sealed Letter from Lord Grantham: the letter Lord Grantham gave Payton, delegating permission for this errand (the grant, delegated authority). Lord Grantham is the lord who issues letters and proclaims when one is taken back.
- Quartermaster Atesia's inspection: Atesia's check of Payton and his party before the errand, written up as a dated inspection report (attestation, with the surface phrase "inspection report").
- Steward Decia: the checker at the court who reads the claim, the letter, and the inspection, applies the standing rules, and signs her order (the decision point).
- Captain Dorian of the gate: the guard at the gate who checks Decia's order and carries it out or throws it out (the enforcement point).
- The Chronicle, kept by Brother Evidan the scribe: the bound record where every claim, check, decision, and outcome is written in order (the evidence ledger).
- The King's Ledger: the protected report Payton is sent to read, kept inside the vault (the protected report, engine path /reports/quarterly).
- The Ledger Vault: the locked store where the King's Ledger is kept (the protected resource).
- The castle: the place under protection, with the gate, the court, and the vault inside it (the protected system).

## Concept mapping

| Engine concept | Story form |
| --- | --- |
| Workload | Payton, envoy of the Counting House, a payments reporter program sent on an errand |
| Identity (the claimed identity) | Ideon the herald and the house colors, announcing who Payton claims to serve |
| Authentication (checking the evidence for the claimed identity) | Ideon's announcement at his herald post, and the evidence for the claim, checked by Decia before she accepts that the claim is Payton's |
| Grant (delegated authority) | The Sealed Letter from Lord Grantham, delegating permission for the errand |
| Attestation evidence | Quartermaster Atesia's inspection, written up as a dated inspection report about Payton and his party |
| Attestation freshness (the inspection's date against the lab's 300 second synthetic limit) | The date written on the inspection, checked against how old the lab allows an inspection to be (300 seconds, a synthetic lab constant, not a rule for real systems) |
| Policy (the standing rules Decia applies) | The standing rules of the castle that Decia applies to every errand, the same for everyone |
| Decision point | Steward Decia, the checker who decides and signs her order |
| Enforcement point | Captain Dorian at the gate, who checks Decia's order and carries it out or throws it out |
| Protected resource | The Ledger Vault, where the King's Ledger is kept |
| Protected operation (READ on /reports/quarterly) | Payton taking and reading the King's Ledger (READ on /reports/quarterly) |
| Evidence ledger | The Chronicle, kept by Brother Evidan the scribe, written in order and never rewritten |
| Revocation and the revocation list (the posted list of taken-back letters, proclaimed by the lord) | A letter taken back by Lord Grantham, with the taking back posted on the list at the court for Decia to check |
| Decision signing and integrity check (Decia's seal and signature on her order) | Decia's seal and signature on her order, checked by Captain Dorian so any change after signing is caught |
| Request binding (the order names one errand: request identifier and one-time value) | Decia's order naming the one errand it was made for, by its request identifier and its one-time value (nonce), so it cannot be used for another errand |
| Learner (the apprentice, who predicts by advising the Steward) | The gatehouse apprentice, who predicts by advising Steward Decia before her decision is revealed |

## Inspector components

The eight inspector components, in engine order, with their on-screen story labels.

| Engine order | Component | On-screen story label |
| --- | --- | --- |
| 1 | workload | Payton, envoy of the Counting House |
| 2 | identity | Ideon the herald (identity) |
| 3 | grant | The Sealed Letter (the grant) |
| 4 | attestation | Quartermaster Atesia's inspection (attestation) |
| 5 | decision | Steward Decia (the checker) |
| 6 | enforcement | Captain Dorian (enforcement at the gate) |
| 7 | resource | The Ledger Vault (the protected resource) |
| 8 | ledger | The Chronicle (the evidence ledger) |

## Scenarios

| Engine scenario | Story chapter | What happens |
| --- | --- | --- |
| happy-path | Payton's Normal Errand | Payton arrives with a checked claim, a valid Sealed Letter, and a fresh inspection, Decia permits, and Captain Dorian hands over the Ledger. |
| identity-no-authority | No Letter | Payton's claim checks out and his inspection is fresh, but no Sealed Letter was ever given, so Decia turns him away. |
| revoked-delegation | The Taken-Back Letter | Payton carries a Sealed Letter, but Lord Grantham has taken it back and it is on the posted list, so Decia turns him away. |
| stale-attestation | The Old Inspection | Payton's inspection is older than the lab allows, so Decia cannot be sure and the Ledger stays shut. |
| tampered-decision | The Broken Seal | Decia's signed order is changed after signing to point at a different ledger, so Captain Dorian throws the order out. |
| replayed-decision | Yesterday's Pass | A genuine, correctly signed order made for one errand is shown again for a different errand, so Captain Dorian throws it out on the second showing. |
| bypass-attempt | Over the Wall | Payton tries to reach the Ledger Vault without the gate at all, with no claim read, no letter, and no order, and the attempt is blocked and written in the Chronicle. |

## Trials

The five fault manipulations the apprentice can run, with the plain helper line shown for each and the engine outcome in words.

| Manipulation | Trial name | Helper line | Engine outcome in words |
| --- | --- | --- | --- |
| revoke-grant | The Taken-Back Letter | The Sealed Letter still exists, but the lord's proclamation has taken it back, and Decia checks the posted list. | Decision DENY (Turn him away). Gate outcome DENY: Nothing happens, he was turned away. |
| age-attestation | The Old Inspection | Time moves forward, so Atesia's inspection is older than the lab allows. Everything else stays fresh. Only the inspection is too old. | Decision INDETERMINATE (Say she cannot be sure). Gate outcome DENY_INDETERMINATE: Nothing happens, Decia could not be sure. |
| tamper-decision | The Broken Seal | One line in Decia's signed order is changed after signing: it now points at a different ledger. The signature is not redone. | Gate outcome REJECTED: Nothing happens, the order was thrown out. |
| replay-decision | Yesterday's Pass | A real, correctly signed order, made for one errand, is shown again for a different errand. | First showing ALLOWED: The Ledger is handed over. Second showing REJECTED: Nothing happens, the order was thrown out. |
| bypass-attempt | Over the Wall | Payton tries to reach the Ledger without the gate at all: no claim read, no letter, no order. | No decision is made. Gate outcome BYPASS_BLOCKED: Nothing happens, the attempt was blocked. |

## Decision states

What Steward Decia decides, shown to the apprentice in story words, with the engine code kept on every row.

| Engine code | Story label |
| --- | --- |
| PERMIT | Let Payton take the Ledger |
| DENY | Turn him away |
| INDETERMINATE | Say she cannot be sure |

## Gate outcomes

What Captain Dorian does at the gate, shown in story words, with the engine code kept on every row.

| Engine code | Story label |
| --- | --- |
| ALLOWED | The Ledger is handed over |
| DENY | Nothing happens, he was turned away |
| DENY_INDETERMINATE | Nothing happens, Decia could not be sure |
| REJECTED | Nothing happens, the order was thrown out |
| BYPASS_BLOCKED | Nothing happens, the attempt was blocked |

## Guardrails: rules of the game

1. The story never bends the rules: no character ever waves anyone through on trust, friendship, or a hunch; refusals are the drama.
2. Every scene names the real concept: characters and objects carry their concept as a subtitle at introduction and in fine print, and each trial closes with an "In real systems:" line in plain words.
3. Teach-back prompts and transfer tests stay in real vocabulary, never story vocabulary.

## Where the kingdom story stops working

The kingdom is a picture, and the picture has edges. The apprentice is told these limits plainly:

- Real systems have no single wall or gate. Requests arrive from everywhere at once, not one envoy at one gate.
- Identity is proven with cryptographic keys, not faces, voices, or colors. House colors can be copied by anyone who sees them; keys are checked without being shown.
- Many checkers and guards act at the same time in different places. There is no single Decia and no single Dorian.
- No human is doing the judging. Software decides in a blink, by rules, with no pause for advice at the gate.
- A real grant is a data record, not paper, and it can be copied perfectly. That is why binding and integrity checks exist: a perfect copy still has to name the right errand and arrive unchanged.
- Word of a revocation travels at system speed, not a herald's pace, and it can lag or fail in ways the posted list does not show. A checker may not yet have heard, and the story's tidy posted list hides that risk.
- An inspection of a man's gear is a picture for attestation, which in real systems is measured evidence about software, produced and checked by machines. Nobody walks around the program; the program's own measurements are collected and checked by other software.

## The kingdom map and the journey ribbon (added 2026-10-14)

The kingdom map is one hand-built inline SVG diagram (built once in workshop/js/app/map.js and reused, so the two copies cannot drift). It draws the road in engine order: the Counting House (the workload), Ideon's herald post (identity), Atesia's inspection yard (attestation), the Gatehouse (the decision point, Steward Decia), the Gate (enforcement, Captain Dorian), and the Ledger Vault (the protected resource). Grantham's hall sits above the road with a dashed line down to the Gatehouse, labeled as the source of the Sealed Letter; the envoy does not visit the hall during a run, and grant steps highlight the Gatehouse, where the letter is read and checked. Evidan's scriptorium sits below the road with a thin line from every stage, labeled "everything is written in the Chronicle." The map appears in the Learn flow (each beat highlights its node, tagged "you are here") and in the step runner (the current step's component node is highlighted, tagged "the request is here"). Highlighting is never color alone: the active node also gets a heavier outline and its text tag, and passed nodes get a check mark. The textual beat list and step list remain the canonical carriers of meaning; the map is a visual echo, with an aria-label summarizing the road in one sentence.

The journey ribbon appears on each learning-path screen and names the seven stages of the path in plain words: Meet the court, The road, Your counsel (the prediction), Watch it happen, The Chronicle, Set it right, Teach it back. Passed stages are marked "done" in text, the current stage is marked "you are here," and later stages are plain. The ribbon names stages only: it never shows outcomes, decisions, or results.
