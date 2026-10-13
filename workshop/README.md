# The Gatehouse (ATP Workshop)

The Gatehouse is a phone-first kingdom game built over one request: Pell, envoy of the Counting House, comes to the castle gate to take the King's Ledger, and the court checks who he is, what he is allowed to do, and whether his inspection is fresh, then decides and enforces the decision. The learner plays the gatehouse apprentice, learning the Steward's craft under Steward Maren.

The apprentice first meets the court, then watches the road to the gate, then advises the Steward by predicting each decision before it is revealed. The apprentice steps through a run one stage at a time, runs trials (the five faults), reads the Chronicle kept by Brother Anselm, sets things right, and teaches the journey back in real system words. Five approved memory anchors support recall checks inside the workshop.

On a first visit, the Learn phase reads as the prologue and teaches before it tests. Meet the court introduces the court one part at a time in plain words, and Watch the road to the gate steps through Pell's normal errand beat by beat, tapped through at the learner's pace. Only after that does the first prediction appear. The prologue can be skipped with a clear control, and the skip is remembered for the session, so repeat runs can go straight to predicting.

The story is a frame over the unchanged reference engine: engine behavior, the scenario contract, fixtures, and recorded values are the same as before the reskin. The full concept-to-story mapping lives in docs/workshop/kingdom-mapping.md, and every scene names its real concept, so the kingdom words never hide the system words.

## How to open it

Serve the repository statically, then open the workshop path. For example, from the repository root:

```sh
python3 -m http.server 8000
```

Then open `/workshop/` on that local server in a browser.

The workshop uses ES modules, which need http serving. Opening the files directly from disk will not work.

## The four labels

Every screen carries one of these labels in words:

- Simulated: modeled in the workshop interface.
- Reference-tested: produced by the verified reference engine, bound to a named scenario, a seed, and scenario-contract-v1.
- Conceptual explanation: teaching copy or analogy, not behavior.
- Not modeled: a capability or fact the engine does not have.

## Honest limits

- This workshop is published on GitHub Pages for the owner's study (see docs/workshop/deployment-note.md). Publication is not production deployment.
- It makes no production claims. Nothing here is a production system, and no screen claims real enforcement, real identity issuance, or real policy enforcement.
- The 300 second freshness threshold is a synthetic lab constant, not a rule for real systems.
- The browser does not independently verify the cryptographic integrity of the ledger. Evidence views display event shape, order, and correlation only.
- A session can be exported as a JSON file from the teach-back screen or the page footer. The export is a download only: the workshop makes no network calls, needs no account, and needs no credential.
