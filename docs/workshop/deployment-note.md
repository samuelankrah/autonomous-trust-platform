# Workshop Deployment Note

Date: 2026-10-13
Status: NOT LIVE. The Pages workflow is in place, but the site did not come up. One owner action in the repository Settings is the recorded fallback.

## What was done

- Workflow added: .github/workflows/pages.yml, committed in 592c40a5ce7c556c4add67c3ed2fd821201e7fd4 ("ci: publish workshop to GitHub Pages") and pushed to main.
- The workflow triggers on pushes to main that touch workshop/** or the workflow file itself, and on manual dispatch (workflow_dispatch). It uses actions/checkout@v4, actions/configure-pages@v5 with enablement: true, actions/upload-pages-artifact@v3 with path workshop, and actions/deploy-pages@v4. Permissions: contents read, pages write, id-token write.
- Intended URL: https://samuelankrah.github.io/autonomous-trust-platform/

## Verification, exactly as observed

- The URL was polled with curl (direct egress and via the local proxy; both routes behave the same) repeatedly from about 13:46 UTC to 13:49 UTC on 2026-10-13, and in a parallel check 14 fetches between 09:54 and 09:56 America/New_York also all returned the same result.
- Every fetch of / returned HTTP 404 with the GitHub Pages "Site not found" page.
- Because / never returned 200, the asset checks (css/workshop.css and js/app/main.js under the site URL) could not be performed.
- The Actions run, if any, cannot be inspected from this environment: git access is an SSH deploy key only, and there is no API token. Whether the workflow run failed at the configure-pages enablement step or never triggered is therefore not determinable here.

## Best-supported explanation

GitHub Pages has never been enabled on this repository. The push-triggered workflow token commonly cannot enable Pages by itself, so the configure-pages enablement attempt is the likely failure point. This is an explanation consistent with the observations, not a confirmed run log.

## Fallback (owner, one time)

In the repository on GitHub: Settings, then Pages, then under Build and deployment set Source to "GitHub Actions". After that, the existing workflow should deploy on the next push to main touching workshop/**, or immediately if run manually from the Actions tab (workflow_dispatch). Once the URL returns 200, rerun the asset checks above and update this note.

## Visibility fact

The repository is public. Once the site is live, anyone with the link can reach it. There is no sign-in or access control on GitHub Pages for a public repository.
