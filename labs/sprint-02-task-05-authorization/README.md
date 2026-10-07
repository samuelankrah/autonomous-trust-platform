# Sprint 2 Task 5 Lab: Authorization and Enforcement Vertical Slice

A bounded, synthetic lab demonstrating the authorization and enforcement contract in
`docs/sprints/sprint-02-task-05-authorization-and-enforcement-contract.md`.

This lab models trust relationships with HMAC-signed artifacts. It is not a production
identity, delegation, policy, or key-management system. All keys are synthetic and labeled
not for production.

## Run the tests

Standard library only. No dependencies to install.

```sh
python3 -m unittest discover -s tests -v
```

Expected: 13 tests pass (6 authorization vertical-slice tests, 7 HTTP enforcement tests).

## What the lab demonstrates

- Identity is not authority: a valid identity with no authority is denied (`AZ-002`).
- Authority provenance must verify: tampered authority yields `INDETERMINATE`, never enforced (`AZ-003`).
- Decision-to-request binding: replayed decisions are rejected with request-scoped replay checks (`ENF-003`).
- Decision freshness via policy version (`AZ-016`).
- Decision-source validation at the enforcement point (`ENF-008`).
- Complete mediation: the alternate `/internal` path is blocked and evidenced (`ENF-002`, `ENF-006`).
- Decision states `PERMIT`, `DENY`, `INDETERMINATE`, with `INDETERMINATE` returned as HTTP 503, never a permit (`AZ-019`, `AZ-022`).
- Decision and enforcement evidence correlation in the ledger (`CTL-008`).

## Run the scenario client

```sh
python3 lab_client.py
```

## Known limits

The lab does not cover cached-decision semantics, multi-authority composition, attestation
as an authorization input, or resource-side corroboration. Those remain contract-level
requirements for future vertical slices.
