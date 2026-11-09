# Automated discipline-map maintenance

`run-knowledge-task.ps1` no longer generates standalone topic knowledge bases. A planner first materializes an auditable task ledger in `data/discipline-tasks/<id>.json`. Five role-specific scheduled workers claim only ready tasks assigned to their role, execute the task, pass the publication gates, and mark it `done` with evidence. A local daily claim file ensures that at most one task can publish on a given day, so the combined total remains at most three changed nodes.

The runner follows this order: repair validator failures; verify the oldest unverified nodes; fill an explicitly blank dimension; extend the smallest dimension; otherwise recheck the oldest verified node. It then regenerates the discipline pages, reruns both validation and the generated-file check, appends `docs/daily-log.md`, makes one `daily(<id>): ...` commit, pushes `main`, and verifies the Cloudflare Pages URL.

Any failed gate discards the isolated worktree, so the day's repository changes are rolled back. The reason and transcript remain under `test-results/knowledge-automation/<timestamp>/`. The runner's allowlist prevents any scheduled edit under `knowledge-bases/`.

The Windows tasks are installed by `install-knowledge-task.ps1`:

| Time | Task | Mode |
|---|---|---|
| 07:00 | `Codex Discipline 01 Gatekeeper` | Validation and repair tasks |
| 07:15 | `Codex Discipline 02 Researcher` | Source-verification tasks |
| 07:30 | `Codex Discipline 03 Architect` | Coverage and knowledge-tree tasks |
| 07:45 | `Codex Discipline 04 Auditor` | Freshness checks and completion audits |
| 08:00 | `Codex Discipline 05 Transition` | Approved next-discipline bootstrap tasks |

Each worker checks task dependencies before claiming anything. The live claim is recorded under `test-results/knowledge-automation/daily-state/`; after one task pushes successfully, the remaining workers skip. The committed ledger records the checkmark, completion date, and evidence. `StartWhenAvailable` and `WakeToRun` are enabled; overlapping runs are ignored by a shared mutex.

Non-mutating preflight:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\automation\run-knowledge-task.ps1 -Preflight -DisciplineId semiconductor
```

Install or refresh the task:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\automation\install-knowledge-task.ps1
```

Run one stage immediately (this may commit and push if that stage is eligible and every gate passes):

```powershell
Start-ScheduledTask -TaskName 'Codex Discipline 01 Gatekeeper'
```

To maintain a future discipline manually, pass its user-approved ID to the runner. The daily task must not invent a new discipline.
