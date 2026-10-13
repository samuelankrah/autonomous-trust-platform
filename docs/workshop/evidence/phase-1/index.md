# Phase 1 Evidence Index

All machine checks below were rerun fresh on 2026-10-13 from the repository tree at commit 592c40a5ce7c556c4add67c3ed2fd821201e7fd4 (the Pages workflow commit; the workshop/ tree itself is unchanged since 4ffafb091ccbc26f42c7b1bd589b24400e92ab69). The earlier acceptance pass pointed at logs under /tmp/acceptance/, which are ephemeral and were not retained; nothing in this index relies on them. Exit status is recorded per check. Manual items (M-01 to M-05 in the canonical report) have no evidence files here because they are NOT RUN.

| Artifact | Check | Command | Exit |
|---|---|---|---|
| run-context.txt | Tree and runtime the checks ran against | git rev-parse HEAD, git log -1, node --version | 0 |
| parity.log | AT-05 parity, all 14 fixtures, plus byte comparison of the fresh run against the committed workshop/tests/parity-report.txt | node workshop/tests/parity.js | 0 |
| state-tests.mjs, state-tests.log | AT-03 prediction gate machinery and AT-06 export shape, 13 enumerated checks (fresh script written for this pass; the original acceptance script was not retained) | node docs/workshop/evidence/phase-1/state-tests.mjs | 0 |
| at03-grep.log | AT-03 static inspection: outcome words in workshop/index.html, js/app/main.js, js/app/steps.js (choice labels and teaching strings only, no active-run outcome) | grep -n for the decision and enforcement words per file | 0 |
| at02-machinery.log | AT-02 machinery: viewport meta, no pixel font sizes, 2.75rem target rules including the summary rule added by the D-01 fix, native button count, no onclick or anchor controls | grep set recorded in the log | 0 |
| at04-fixtures.log | AT-04 fixture tabulation for all 14 golden fixtures: decision state, reasons, enforcement results, operation results, evidence event types | python3 tabulation recorded in the canonical report | 0 |
| at06-anchors.log | AT-06 anchor approval status lines in docs/workshop/memory-anchor-spec.md | grep -n APPROVED and v1-approved on the spec | 0 |
| scheduler-verification.log | AT-06 scheduler behavior: controlled ingests on a /tmp copy of Study Lab (first pass, repeated passes, fail reset, cue-shown invalidation, dedupe, prediction immutability, card regression, and a card-side control run of study_lab.py score()) | python3 driver against workshop_ingest.py and study_lab.py on copies | 0 |
| at07-claims.log | AT-07 claim search for the six assigned terms in workshop/index.html, workshop/js/app/, and workshop/README.md | grep -rn per term | 0 |
| at08-network.log | AT-08 network reference audit over the whole workshop/ tree | grep counts for fetch(, XMLHttpRequest, WebSocket, http://, https:// | 0 |
| at08-http.log | AT-08 static serving check, 16 workshop paths | python3 -m http.server, curl per path | 0 (all paths HTTP 200) |

Data hygiene: the scheduler log was produced from synthetic test records on copies of Study Lab. It contains workshop namespace results, card counts, and a content digest used only to prove the card entries were unchanged. No card contents and no deck performance lines are included.
