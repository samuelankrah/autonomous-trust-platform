# Contributing

The Autonomous Trust Platform is an independent architecture lab. Contributions follow
the governance model in `docs/engineering/`:

- Architecture changes go through the Control Plane with an ADR where the existing
  records require one. New cross-platform decisions are recorded before acceptance,
  never after.
- New artifacts keep the evidence-state discipline: architecture requirement,
  research finding, candidate technology, selected technology, implemented, tested,
  observed, enforced, and production ready are distinct states, each needing its
  own evidence.
- No product is standardized without passing the Task 9 evaluation framework and
  the Task 10 gate.
- Lab code stays synthetic and bounded: no production credentials, no real key
  material, no network calls to live infrastructure. Mark synthetic keys and
  artifacts clearly.
- Docs use plain words and define terms before use. No em dashes.
- Before submitting, run the lab tests: `python3 -m unittest discover -s tests`
  from `labs/sprint-02-task-05-authorization/`.
