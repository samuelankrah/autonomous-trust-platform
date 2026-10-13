# The Gatehouse: Kingdom Mapping

Status: owner-directed 2026-10-13. Mapping authored by Dex's worker for owner review.

The reskin is presentation only. Engine behavior, the scenario contract, fixtures, parity, recorded values, and session exports are unchanged. Only display text, names, and theme change.

## The cast

- The gatehouse apprentice: the learner, learning the Steward's craft by watching errands, predicting what Steward Maren will decide, and advising her before the decision is revealed (the learner).
- Pell: envoy of the Counting House, who comes to the gate asking to take the King's Ledger (the workload, a payments reporter program).
- Pell's herald and house colors: how Pell announces who he claims to be (identity, the claimed identity).
- The Sealed Letter from Lord Aldric: the letter Lord Aldric gave Pell, delegating permission for this errand (the grant, delegated authority). Lord Aldric is the lord who issues letters and proclaims when one is taken back.
- The Quartermaster's inspection: the Quartermaster's check of Pell and his gear before the errand, written up as an inspection report (attestation, with the surface phrase "inspection report").
- Steward Maren: the checker at the court who reads the claim, the letter, and the inspection, applies the standing rules, and signs her order (the decision point).
- Captain Tam of the gate: the guard at the gate who checks Maren's order and carries it out or throws it out (the enforcement point).
- The Chronicle, kept by Brother Anselm the scribe: the bound record where every claim, check, decision, and outcome is written in order (the evidence ledger).
- The King's Ledger: the protected report Pell is sent to read, kept inside the vault (the protected report, engine path /reports/quarterly).
- The Ledger Vault: the locked store where the King's Ledger is kept (the protected resource).
- The castle: the place under protection, with the gate, the court, and the vault inside it (the protected system).

## Concept mapping

| Engine concept | Story form |
| --- | --- |
| Workload | Pell, envoy of the Counting House, a payments reporter program sent on an errand |
| Identity (the claimed identity) | Pell's herald and house colors, announcing who Pell claims to be |
| Authentication (checking the evidence for the claimed identity) | Checking the herald's announcement and the evidence for the claim before Maren trusts that the claim is Pell's |
| Grant (delegated authority) | The Sealed Letter from Lord Aldric, delegating permission for the errand |
| Attestation evidence | The Quartermaster's inspection, written up as an inspection report about Pell and his gear |
| Attestation freshness (the inspection's date against the lab's 300 second synthetic limit) | The date written on the inspection, checked against how old the lab allows an inspection to be (300 seconds, a synthetic lab constant, not a rule for real systems) |
| Policy (the standing rules Maren applies) | The standing rules of the castle that Maren applies to every errand, the same for everyone |
| Decision point | Steward Maren, the checker who decides and signs her order |
| Enforcement point | Captain Tam at the gate, who checks Maren's order and carries it out or throws it out |
| Protected resource | The Ledger Vault, where the King's Ledger is kept |
| Protected operation (READ on /reports/quarterly) | Pell taking and reading the King's Ledger (READ on /reports/quarterly) |
| Evidence ledger | The Chronicle, kept by Brother Anselm the scribe, written in order and never rewritten |
| Revocation and the revocation list (the posted list of taken-back letters, proclaimed by the lord) | A letter taken back by Lord Aldric, with the taking back posted on the list at the court for Maren to check |
| Decision signing and integrity check (Maren's seal and signature on her order) | Maren's seal and signature on her order, checked by Captain Tam so any change after signing is caught |
| Request binding (the order names one errand: request identifier and one-time value) | Maren's order naming the one errand it was made for, by its request identifier and its one-time value (nonce), so it cannot be used for another errand |
| Learner (the apprentice, who predicts by advising the Steward) | The gatehouse apprentice, who predicts by advising Steward Maren before her decision is revealed |

## Inspector components

The eight inspector components, in engine order, with their on-screen story labels.

| Engine order | Component | On-screen story label |
| --- | --- | --- |
| 1 | workload | Pell, envoy of the Counting House |
| 2 | identity | Herald and house colors (identity) |
| 3 | grant | The Sealed Letter (the grant) |
| 4 | attestation | The Quartermaster's inspection (attestation) |
| 5 | decision | Steward Maren (the checker) |
| 6 | enforcement | Captain Tam (enforcement at the gate) |
| 7 | resource | The Ledger Vault (the protected resource) |
| 8 | ledger | The Chronicle (the evidence ledger) |

## Scenarios

| Engine scenario | Story chapter | What happens |
| --- | --- | --- |
| happy-path | Pell's Normal Errand | Pell arrives with a checked claim, a valid Sealed Letter, and a fresh inspection, Maren permits, and Captain Tam hands over the Ledger. |
| identity-no-authority | No Letter | Pell's claim checks out and his inspection is fresh, but no Sealed Letter was ever given, so Maren turns him away. |
| revoked-delegation | The Taken-Back Letter | Pell carries a Sealed Letter, but Lord Aldric has taken it back and it is on the posted list, so Maren turns him away. |
| stale-attestation | The Old Inspection | Pell's inspection is older than the lab allows, so Maren cannot be sure and the Ledger stays shut. |
| tampered-decision | The Broken Seal | Maren's signed order is changed after signing to point at a different ledger, so Captain Tam throws the order out. |
| replayed-decision | Yesterday's Pass | A genuine, correctly signed order made for one errand is shown again for a different errand, so Captain Tam throws it out on the second showing. |
| bypass-attempt | Over the Wall | Pell tries to reach the Ledger Vault without the gate at all, with no claim read, no letter, and no order, and the attempt is blocked and written in the Chronicle. |

## Trials

The five fault manipulations the apprentice can run, with the plain helper line shown for each and the engine outcome in words.

| Manipulation | Trial name | Helper line | Engine outcome in words |
| --- | --- | --- | --- |
| revoke-grant | The Taken-Back Letter | The Sealed Letter still exists, but the lord's proclamation has taken it back, and Maren checks the posted list. | Decision DENY (Turn him away). Gate outcome DENY: Nothing happens, he was turned away. |
| age-attestation | The Old Inspection | Time moves forward, so the Quartermaster's inspection is older than the lab allows. Everything else stays fresh. Only the inspection is too old. | Decision INDETERMINATE (Say she cannot be sure). Gate outcome DENY_INDETERMINATE: Nothing happens, Maren could not be sure. |
| tamper-decision | The Broken Seal | One line in Maren's signed order is changed after signing: it now points at a different ledger. The signature is not redone. | Gate outcome REJECTED: Nothing happens, the order was thrown out. |
| replay-decision | Yesterday's Pass | A real, correctly signed order, made for one errand, is shown again for a different errand. | First showing ALLOWED: The Ledger is handed over. Second showing REJECTED: Nothing happens, the order was thrown out. |
| bypass-attempt | Over the Wall | Pell tries to reach the Ledger without the gate at all: no claim read, no letter, no order. | No decision is made. Gate outcome BYPASS_BLOCKED: Nothing happens, the attempt was blocked. |

## Decision states

What Steward Maren decides, shown to the apprentice in story words, with the engine code kept on every row.

| Engine code | Story label |
| --- | --- |
| PERMIT | Let Pell take the Ledger |
| DENY | Turn him away |
| INDETERMINATE | Say she cannot be sure |

## Gate outcomes

What Captain Tam does at the gate, shown in story words, with the engine code kept on every row.

| Engine code | Story label |
| --- | --- |
| ALLOWED | The Ledger is handed over |
| DENY | Nothing happens, he was turned away |
| DENY_INDETERMINATE | Nothing happens, Maren could not be sure |
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
- Many checkers and guards act at the same time in different places. There is no single Maren and no single Tam.
- No human is doing the judging. Software decides in a blink, by rules, with no pause for advice at the gate.
- A real grant is a data record, not paper, and it can be copied perfectly. That is why binding and integrity checks exist: a perfect copy still has to name the right errand and arrive unchanged.
- Word of a revocation travels at system speed, not a herald's pace, and it can lag or fail in ways the posted list does not show. A checker may not yet have heard, and the story's tidy posted list hides that risk.
- An inspection of a man's gear is a picture for attestation, which in real systems is measured evidence about software, produced and checked by machines. No quartermaster walks around the program; the program's own measurements are collected and checked by other software.
