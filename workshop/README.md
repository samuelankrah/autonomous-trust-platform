# ATP Workshop

A phone-first learning workshop built around one request: a workload asks to read a protected report, and the system checks who it is, what it is allowed to do, and whether its proof is fresh, then decides and enforces the decision.

The learner walks the parts of the request, predicts an outcome before seeing it, steps through a run one stage at a time, inspects the recorded evidence, breaks and repairs one fault at a time, and teaches the journey back in their own words. Five approved memory anchors support recall checks inside the workshop.

On a first visit, the Explore path teaches before it tests. Meet the parts introduces the seven parts one at a time in plain words, and Watch it flow steps through the normal request beat by beat, tapped through at the learner's pace. Only after that does the first prediction appear. The intro can be skipped with a clear control, and the skip is remembered for the session, so repeat runs can go straight to predicting.

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
