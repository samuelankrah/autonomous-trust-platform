# Workshop Deployment Note

Date: 2026-10-13
Status: LIVE (resolved 2026-10-13). The owner enabled Pages in the repository Settings (Source: GitHub Actions), the fallback below. A trigger commit (85167e5) then deployed successfully: workflow run for head SHA 85167e5 completed with conclusion success, and the site and its assets were verified live by direct fetch. Live URL: https://samuelankrah.github.io/autonomous-trust-platform/ (index title "ATP Workshop: The payments report request"; css/workshop.css, js/app/main.js, js/service.js, js/scenarios.js, js/app/state.js all returned HTTP 200). The sections below are the pre-resolution record, kept as history.

## What was done

- Workflow added: .github/workflows/pages.yml, committed in 592c40a5ce7c556c4add67c3ed2fd821201e7fd4 ("ci: publish workshop to GitHub Pages") and pushed to main.
- The workflow triggers on pushes to main that touch workshop/** or the workflow file itself, and on manual dispatch (workflow_dispatch). It uses actions/checkout@v4, actions/configure-pages@v5 with enablement: true, actions/upload-pages-artifact@v3 with path workshop, and actions/deploy-pages@v4. Permissions: contents read, pages write, id-token write.
- Intended URL: https://samuelankrah.github.io/autonomous-trust-platform/

## Verification, exactly as observed

- The URL was polled with curl every 30 to 32 seconds for 16 attempts, from 2026-10-13T13:45:22Z to about 13:53 UTC on 2026-10-13. Every attempt returned HTTP 404. A parallel check in the same window (14 fetches between 09:54 and 09:56 America/New_York) also returned the same result.
- Both curl routes worked and behaved the same: direct HTTPS egress returned a real HTTP response on every attempt, and the proxy route (curl -x http://198.19.0.1:3128) returned the same codes. The successful route for the record is direct, with the proxy confirming it.
- Every fetch of / returned HTTP 404 with the GitHub Pages "Site not found" page (title: "Site not found", 9115 bytes). The workshop index content (title "ATP Workshop: The payments report request") was never served.
- Asset checks under the site URL, direct and proxy: css/workshop.css returned HTTP 404, and js/app/main.js returned HTTP 404. Relative assets therefore do not resolve, because the site itself is not published.
- The Actions run was inspected without any API token, using the unauthenticated public GitHub API for this public repository (git access itself is an SSH deploy key only, and no token was used or invented). Run 38407558597, "Deploy workshop to GitHub Pages", head SHA 592c40a5ce7c556c4add67c3ed2fd821201e7fd4, created 2026-10-13T13:45:21Z, status completed, conclusion failure, updated 2026-10-13T13:45:33Z. Its single job, deploy (job 115331046436), concluded failure: Checkout succeeded, the Setup Pages step (actions/configure-pages@v5) failed, and Upload artifact and Deploy to GitHub Pages were skipped.
- The exact Setup Pages log text could not be retrieved: downloading run logs without a token returned HTTP 403, "Must have admin rights to Repository."
- The GitHub Pages API endpoint for this repository (GET /repos/samuelankrah/autonomous-trust-platform/pages, unauthenticated) returned HTTP 404, "Not Found", confirming no Pages site is configured.

## Best-supported explanation

GitHub Pages has never been enabled on this repository, and the configure-pages enablement attempt failed in the Setup Pages step: that is the step the public jobs API records as failed, with every later step skipped, and the Pages API still returns 404 for the repository. The exact log line behind that step failure is unavailable without admin access (see the 403 above), so the token-rights cause for the enablement failure is the best-supported explanation, not a quoted log.

## Fallback (owner, one time)

In the repository on GitHub: Settings, then Pages, then under Build and deployment set Source to "GitHub Actions". After that, the existing workflow should deploy on the next push to main touching workshop/**, or immediately if run manually from the Actions tab (workflow_dispatch). Once the URL returns 200, rerun the asset checks above and update this note.

## Visibility fact

The repository is public. Once the site is live, anyone with the link can reach it. There is no sign-in or access control on GitHub Pages for a public repository.
