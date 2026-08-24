import argparse
import base64
import http.client
import json
from dataclasses import asdict, replace

from authorization_lab import issue_authority, issue_workload_identity


def encode_artifact(artifact):
    payload = json.dumps(
        asdict(artifact),
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--scenario",
        choices=(
            "permit",
            "deny-no-authority",
            "wrong-workload",
            "invalid-identity",
            "dependency-unavailable",
            "bypass",
        ),
        required=True,
    )
    parser.add_argument("--request-id", required=True)
    parser.add_argument("--decision-artifact")
    args = parser.parse_args()

    identity = issue_workload_identity()
    if args.scenario == "wrong-workload":
        identity = issue_workload_identity(
            workload="workload://atp-lab/unrecognized"
        )
    elif args.scenario == "invalid-identity":
        identity = replace(
            identity,
            workload="workload://atp-lab/tampered",
        )

    headers = {
        "X-Request-ID": args.request_id,
        "X-Workload-Identity": encode_artifact(identity),
    }

    if args.scenario in (
        "permit",
        "wrong-workload",
        "invalid-identity",
        "dependency-unavailable",
    ):
        headers["X-Authority"] = encode_artifact(
            issue_authority(
                workload=identity.workload,
            )
        )

    if args.scenario == "dependency-unavailable":
        headers["X-Lab-Authorization-Dependency"] = "unavailable"

    if args.decision_artifact:
        headers["X-Authorization-Decision"] = args.decision_artifact

    path = (
        "/internal/payments/report"
        if args.scenario == "bypass"
        else "/payments/report"
    )

    connection = http.client.HTTPConnection("127.0.0.1", 8080, timeout=5)
    connection.request("GET", path, headers=headers)
    response = connection.getresponse()
    body = json.loads(response.read().decode("utf-8"))
    connection.close()

    print(f"HTTP {response.status}")
    print(json.dumps(body, indent=2))


if __name__ == "__main__":
    main()