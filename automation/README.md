# Automated knowledge-base publishing

`run-knowledge-task.ps1` selects one unused topic, creates an isolated Git worktree, runs an author Codex pass and an independent reviewer pass, enforces the knowledge-base publication gates, commits to `main`, pushes to GitHub, and verifies the Cloudflare Pages URL.

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

Run artifacts and transcripts are written under `test-results/knowledge-automation/` and are ignored by Git. A failed isolated worktree is retained under the sibling `kb-automation-worktrees` directory for diagnosis; successful worktrees are removed.
