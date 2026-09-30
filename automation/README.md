# Automated knowledge-base publishing

`run-knowledge-task.ps1` selects one unused topic, creates an isolated Git worktree, runs a Codex author pass (including the skill-mandated reader review), enforces deterministic publication gates, commits to `main`, pushes to GitHub, and verifies the Cloudflare Pages URL. If Codex reaches a usage limit only after producing the files, the result is recoverable solely when every hard gate still passes.

Cloudflare verification uses the extensionless canonical page URL because Pages redirects explicit `.html` requests with HTTP 308, which Windows PowerShell 5 does not consistently follow.

The Windows task is installed by `install-knowledge-task.ps1` and runs daily at 02:00, 07:00, 11:00, 16:00, and 22:00. It uses `Interactive` logon so the current user's Codex and Git credentials are available. `StartWhenAvailable` and `WakeToRun` are enabled; overlapping runs are ignored.

Run a non-mutating preflight:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\automation\run-knowledge-task.ps1 -Preflight
```

Install or refresh the task:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\automation\install-knowledge-task.ps1
```

Run once immediately:

```powershell
Start-ScheduledTask -TaskName 'Codex Knowledge Base Publisher'
```

For a manually requested second Codex context, invoke the runner directly with `-IndependentReview`. Scheduled runs leave this off so one publication does not consume two full model sessions; the generated `content-review.json` and the outer validator remain mandatory.

Run artifacts and transcripts are written under `test-results/knowledge-automation/` and are ignored by Git. A failed isolated worktree is retained under the sibling `kb-automation-worktrees` directory for diagnosis; successful worktrees are removed.
