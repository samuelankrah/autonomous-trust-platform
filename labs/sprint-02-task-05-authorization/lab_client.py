import argparse
import base64
import http.client
import json
from dataclasses import asdict

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
        choices=("permit", "deny-no-authority"),
        required=True,
    )
    parser.add_argument("--request-id", required=True)
    args = parser.parse_args()

    headers = {
        "X-Request-ID": args.request_id,
        "X-Workload-Identity": encode_artifact(
            issue_workload_identity()
        ),
    }

    if args.scenario == "permit":
        headers["X-Authority"] = encode_artifact(issue_authority())

    connection = http.client.HTTPConnection("127.0.0.1", 8080, timeout=5)
    connection.request("GET", "/payments/report", headers=headers)
    response = connection.getresponse()
    body = json.loads(response.read().decode("utf-8"))
    connection.close()

    print(f"HTTP {response.status}")
    print(json.dumps(body, indent=2))


if __name__ == "__main__":
    main()
