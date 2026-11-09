[CmdletBinding()]
param(
    [switch]$Preflight,
    [string]$DisciplineId,
    [ValidateSet('auto','gatekeeper','researcher','architect','auditor','transition')]
    [string]$WorkerRole = 'auto'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path -LiteralPath (Split-Path -Parent $PSScriptRoot)).Path
$disciplineWasExplicit = -not [string]::IsNullOrWhiteSpace($DisciplineId)
$roadmapPath = Join-Path $repoRoot 'data\discipline-roadmap.json'
$roadmap = Get-Content -LiteralPath $roadmapPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($DisciplineId)) { $DisciplineId = [string]$roadmap.current_id }
$automationRoot = Join-Path $repoRoot 'automation'
$resultsRoot = Join-Path $repoRoot 'test-results\knowledge-automation'
$worktreeRoot = Join-Path (Split-Path -Parent $repoRoot) 'kb-automation-worktrees'
$promptTemplate = Join-Path $automationRoot 'knowledge-task-prompt.md'
$bootstrapTemplate = Join-Path $automationRoot 'discipline-bootstrap-prompt.md'
$taskRunner = 'C:\Users\dang\.codex\skills\codex-task-runner\scripts\run-codex-task.js'
$remoteUrl = 'https://github.com/Edinburgh-D/personnal-assets.git'
$siteRoot = 'https://personnal-assets.pages.dev'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$runRoot = Join-Path $resultsRoot $stamp
$logPath = Join-Path $runRoot 'run.log'
$worktree = Join-Path $worktreeRoot "$DisciplineId-$stamp"
$dailyStateRoot = Join-Path $resultsRoot 'daily-state'
$dailyStatePath = Join-Path $dailyStateRoot "$(Get-Date -Format 'yyyy-MM-dd')-$DisciplineId.json"
$mutex = [Threading.Mutex]::new($false, 'Local\CodexDisciplinePublisher')
$lockTaken = $false
$worktreeCreated = $false
$published = $false

function Step([string]$message) { Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $message" }
function Checked([string]$filePath, [Parameter(ValueFromRemainingArguments)][string[]]$arguments) {
    & $filePath @arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed ($LASTEXITCODE): $filePath $($arguments -join ' ')" }
}
function Changed-Paths([string]$path) {
    $lines = & git -C $path status --porcelain=v1 --untracked-files=all
    if ($LASTEXITCODE -ne 0) { throw 'Could not inspect Git status.' }
    return @($lines | Where-Object Length -ge 4 | ForEach-Object { $_.Substring(3).Replace('\','/') })
}
function Assert-AgentChanges([string]$path, [string]$id, [string]$nextId) {
    $allowed = @("data/disciplines/$id.json", "data/discipline-tasks/$id.json", "docs/review/$id-todo.md")
    if (-not [string]::IsNullOrWhiteSpace($nextId)) { $allowed += "data/discipline-drafts/$nextId.json" }
    $bad = @(Changed-Paths $path | Where-Object { $_ -notin $allowed })
    if ($bad.Count -gt 0) { throw "Codex changed files outside the maintenance scope: $($bad -join ', ')" }
}
function Assert-FinalChanges([string]$path, [string]$id, [string]$nextId) {
    $exact = @("data/disciplines/$id.json", "data/discipline-tasks/$id.json", 'data/discipline-roadmap.json', "docs/review/$id-todo.md", "docs/review/$id-sample.md", "docs/review/$id-completion.md", 'docs/daily-log.md', 'index.html')
    $prefixes = @("disciplines/$id/")
    if (-not [string]::IsNullOrWhiteSpace($nextId)) {
        $exact += @("data/discipline-drafts/$nextId.json", "data/disciplines/$nextId.json")
        $prefixes += "disciplines/$nextId/"
    }
    $bad = @(Changed-Paths $path | Where-Object {
        $candidate = $_
        $underPrefix = @($prefixes | Where-Object { $candidate.StartsWith($_, [StringComparison]::Ordinal) }).Count -gt 0
        $candidate -notin $exact -and -not $underPrefix
    })
    if ($bad.Count -gt 0) { throw "Unexpected final changes: $($bad -join ', ')" }
}
function Node-Map($data) {
    $map = @{}
    foreach ($node in @($data.nodes)) { $map[[string]$node.id] = ($node | ConvertTo-Json -Depth 20 -Compress) }
    return $map
}
function Changed-NodeIds($before, $after) {
    $old = Node-Map $before; $new = Node-Map $after
    $removed = @($old.Keys | Where-Object { -not $new.ContainsKey($_) })
    if ($removed.Count -gt 0) { throw "Nodes may not be deleted by the daily task: $($removed -join ', ')" }
    return @($new.Keys | Where-Object { -not $old.ContainsKey($_) -or $old[$_] -cne $new[$_] } | Sort-Object)
}
[IO.Directory]::CreateDirectory($runRoot) | Out-Null
Start-Transcript -LiteralPath $logPath -Force | Out-Null
try {
    $lockTaken = $mutex.WaitOne(0)
    if (-not $lockTaken) { Step 'Another discipline run is active; exiting.'; exit 0 }
    Step 'Checking discipline automation prerequisites.'
    $required = @($promptTemplate, $bootstrapTemplate, $taskRunner, (Join-Path $repoRoot 'scripts\validate_discipline.ps1'), (Join-Path $repoRoot 'scripts\build_disciplines.ps1'), (Join-Path $repoRoot 'scripts\plan_discipline_tasks.ps1'), (Join-Path $repoRoot "data\disciplines\$DisciplineId.json"))
    foreach ($file in $required) { if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { throw "Required file missing: $file" } }
    foreach ($command in @('git','node','codex.cmd','powershell.exe')) { if (-not (Get-Command $command -ErrorAction SilentlyContinue)) { throw "Required command missing: $command" } }

    if ($Preflight) {
        Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' (Join-Path $repoRoot 'scripts\validate_discipline.ps1') '-RepositoryRoot' $repoRoot '-DisciplineId' $DisciplineId
        Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' (Join-Path $repoRoot 'scripts\build_disciplines.ps1') '-RepositoryRoot' $repoRoot '-DisciplineId' $DisciplineId '-Check'
        Step 'Preflight passed; no Codex run, commit, or push was performed.'
        exit 0
    }

    Step 'Fetching origin/main and creating an isolated worktree.'
    Checked git '-C' $repoRoot 'fetch' $remoteUrl 'main:refs/remotes/origin/main'
    [IO.Directory]::CreateDirectory($worktreeRoot) | Out-Null
    Checked git '-C' $repoRoot 'worktree' 'add' '--detach' $worktree 'origin/main'
    $worktreeCreated = $true
    if (-not $disciplineWasExplicit) {
        $remoteRoadmap = Get-Content -LiteralPath (Join-Path $worktree 'data\discipline-roadmap.json') -Raw -Encoding UTF8 | ConvertFrom-Json
        $DisciplineId = [string]$remoteRoadmap.current_id
        $dailyStatePath = Join-Path $dailyStateRoot "$(Get-Date -Format 'yyyy-MM-dd')-$DisciplineId.json"
    }
    if (Test-Path -LiteralPath $dailyStatePath -PathType Leaf) {
        $claimed = Get-Content -LiteralPath $dailyStatePath -Raw -Encoding UTF8 | ConvertFrom-Json
        Step "Today's maintenance slot is already claimed by task=$($claimed.task_id), commit=$($claimed.commit); this worker will skip."
        exit 0
    }
    $dataPath = Join-Path $worktree "data\disciplines\$DisciplineId.json"
    $validator = Join-Path $worktree 'scripts\validate_discipline.ps1'
    $builder = Join-Path $worktree 'scripts\build_disciplines.ps1'
    $planner = Join-Path $worktree 'scripts\plan_discipline_tasks.ps1'
    $ledgerPath = Join-Path $worktree "data\discipline-tasks\$DisciplineId.json"
    $before = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json

    Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' $planner '-RepositoryRoot' $worktree '-DisciplineId' $DisciplineId
    $ledger = Get-Content -LiteralPath $ledgerPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $doneIds = @{}; foreach ($task in @($ledger.tasks | Where-Object status -eq 'done')) { $doneIds[[string]$task.id] = $true }
    $candidateTasks = @($ledger.tasks | Where-Object {
        $_.status -eq 'todo' -and $_.role -ne 'human' -and ($WorkerRole -eq 'auto' -or $_.role -eq $WorkerRole)
    } | Sort-Object priority,id)
    $selectedTask = $null
    foreach ($candidate in $candidateTasks) {
        $dependenciesReady = $true
        foreach ($dependency in @($candidate.depends_on)) { if (-not $doneIds.ContainsKey([string]$dependency)) { $dependenciesReady = $false; break } }
        if ($dependenciesReady) { $selectedTask = $candidate; break }
    }
    if ($null -eq $selectedTask) {
        Step "Worker role=$WorkerRole found no claimable task; it will skip without claiming the day."
        exit 0
    }
    $auditOnly = $false
    $bootstrapMode = $false
    $promoteMode = $false
    $nextId = $null
    switch ([string]$selectedTask.kind) {
        'validation' { $work = [pscustomobject]@{ Mode='repair-validation'; Targets=@('validator-errors'); Limit=[int]$selectedTask.max_nodes } }
        'verification' { $work = [pscustomobject]@{ Mode='verify'; Targets=@([string]$selectedTask.target.node_id); Limit=[int]$selectedTask.max_nodes } }
        'coverage' { $work = [pscustomobject]@{ Mode='expand-smallest'; Targets=@([string]$selectedTask.target.dimension); Limit=[int]$selectedTask.max_nodes } }
        'recheck' { $work = [pscustomobject]@{ Mode='recheck'; Targets=@([string]$selectedTask.target.node_id); Limit=[int]$selectedTask.max_nodes } }
        'completion-audit' { $work = [pscustomobject]@{ Mode='completion-audit'; Targets=@($DisciplineId); Limit=0 }; $auditOnly = $true }
        'bootstrap' { $nextId=[string]$selectedTask.target.next_id; $work=[pscustomobject]@{ Mode='bootstrap-next'; Targets=@($nextId); Limit=[int]$selectedTask.max_nodes }; $bootstrapMode=$true }
        'transition' { $nextId=[string]$selectedTask.target.next_id; $work=[pscustomobject]@{ Mode='promote-next'; Targets=@($nextId); Limit=0 }; $promoteMode=$true; $auditOnly=$true }
        default { throw "Unsupported task kind: $($selectedTask.kind)" }
    }
    $draftPath = if ($nextId) { Join-Path $worktree "data\discipline-drafts\$nextId.json" } else { $null }
    $beforeDraft = if ($bootstrapMode -and (Test-Path -LiteralPath $draftPath -PathType Leaf)) { Get-Content -LiteralPath $draftPath -Raw -Encoding UTF8 | ConvertFrom-Json } else { [pscustomobject]@{ nodes=@() } }
    [IO.Directory]::CreateDirectory($dailyStateRoot) | Out-Null
    $claimPath = Join-Path $dailyStateRoot "claim-$(Get-Date -Format 'yyyy-MM-dd')-$DisciplineId-$($selectedTask.id).json"
    [pscustomobject]@{ status='claimed'; task_id=$selectedTask.id; role=$WorkerRole; claimed_at=(Get-Date).ToString('o'); expires_at=(Get-Date).AddHours(4).ToString('o') } | ConvertTo-Json | Set-Content -LiteralPath $claimPath -Encoding UTF8
    Step "Claimed task=$($selectedTask.id), mode=$($work.Mode), targets=$($work.Targets -join ','), node limit=$($work.Limit)."

    if (-not $auditOnly) {
        if ($bootstrapMode) {
            $prompt = Get-Content -LiteralPath (Join-Path $worktree 'automation\discipline-bootstrap-prompt.md') -Raw -Encoding UTF8
            $prompt = $prompt.Replace('{{NEXT_ID}}', $nextId).Replace('{{NEXT_NAME}}', [string]$selectedTask.target.next_name).Replace('{{BATCH}}', [string]$selectedTask.target.batch).Replace('{{TODAY}}', (Get-Date -Format 'yyyy-MM-dd'))
        }
        else {
            $prompt = Get-Content -LiteralPath $promptTemplate -Raw -Encoding UTF8
            $prompt = $prompt.Replace('{{DISCIPLINE_ID}}', $DisciplineId).Replace('{{MODE}}', [string]$work.Mode).Replace('{{TARGETS}}', ($work.Targets -join ', ')).Replace('{{MAX_CHANGES}}', [string]$work.Limit).Replace('{{TODAY}}', (Get-Date -Format 'yyyy-MM-dd'))
        }
        $promptPath = Join-Path $runRoot 'maintenance-prompt.md'
        [IO.File]::WriteAllText($promptPath, $prompt, [Text.UTF8Encoding]::new($false))
        Step 'Starting the discipline maintenance Codex run.'
        & node $taskRunner --prompt-file $promptPath --out-dir (Join-Path $runRoot 'codex-runs') --slug "daily-$DisciplineId-$($selectedTask.id)" --sandbox 'workspace-write' --timeout-ms '10800000' --cd $worktree
        if ($LASTEXITCODE -ne 0) { throw "Codex maintenance failed with exit code $LASTEXITCODE." }
        Assert-AgentChanges $worktree $DisciplineId $nextId
    }

    if ($bootstrapMode) {
        if (-not (Test-Path -LiteralPath $draftPath -PathType Leaf)) { throw "Bootstrap draft was not created: $draftPath" }
        $afterDraft = Get-Content -LiteralPath $draftPath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ([string]$afterDraft.id -ne $nextId -or [string]$afterDraft.name -ne [string]$selectedTask.target.next_name) { throw 'Bootstrap draft id or name does not match the approved queue entry.' }
        $changedIds = @(Changed-NodeIds $beforeDraft $afterDraft)
        if ($changedIds.Count -ne 3) { throw "A bootstrap batch must add or change exactly three nodes; found $($changedIds.Count)." }
        if (@($afterDraft.nodes).Count -gt 9) { throw 'Bootstrap draft may not exceed nine trunk nodes.' }
        if (@($afterDraft.nodes | Where-Object { $_.dimension -ne 'trunk' -or $_.status -ne 'verified' }).Count -gt 0) { throw 'Bootstrap draft nodes must all be verified trunk nodes.' }
        foreach ($draftNode in @($afterDraft.nodes)) {
            if (@($draftNode.sources).Count -lt 1 -or [string]::IsNullOrWhiteSpace([string]$draftNode.old_approach) -or [string]::IsNullOrWhiteSpace([string]$draftNode.bottleneck) -or [string]::IsNullOrWhiteSpace([string]$draftNode.new_concept)) { throw "Bootstrap node is incomplete: $($draftNode.id)" }
            foreach ($source in @($draftNode.sources)) { $uri=$null; if (-not [Uri]::TryCreate([string]$source.url,[UriKind]::Absolute,[ref]$uri) -or $uri.Scheme -notin @('http','https') -or [string]::IsNullOrWhiteSpace([string]$source.supports)) { throw "Bootstrap node has an invalid source: $($draftNode.id)" } }
        }
        $after = $before
    }
    elseif ($promoteMode) {
        if (-not (Test-Path -LiteralPath $draftPath -PathType Leaf)) { throw "Completed draft not found: $draftPath" }
        $draft = Get-Content -LiteralPath $draftPath -Raw -Encoding UTF8 | ConvertFrom-Json
        if (@($draft.nodes).Count -ne 9) { throw "Promotion requires exactly nine verified trunk nodes; found $(@($draft.nodes).Count)." }
        $newDataPath = Join-Path $worktree "data\disciplines\$nextId.json"
        if (Test-Path -LiteralPath $newDataPath) { throw "Target discipline already exists: $newDataPath" }
        Move-Item -LiteralPath $draftPath -Destination $newDataPath
        $worktreeRoadmapPath = Join-Path $worktree 'data\discipline-roadmap.json'
        $worktreeRoadmap = Get-Content -LiteralPath $worktreeRoadmapPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $currentEntry = @($worktreeRoadmap.disciplines | Where-Object id -eq $DisciplineId | Select-Object -First 1)
        if ($currentEntry.Count) { $currentEntry[0].state='complete' }
        $worktreeRoadmap.disciplines = @($worktreeRoadmap.disciplines) + [pscustomobject]@{ id=$nextId; name=$selectedTask.target.next_name; state='active'; review_status='pending' }
        $worktreeRoadmap.queue = @($worktreeRoadmap.queue | Where-Object id -ne $nextId)
        $worktreeRoadmap.current_id = $nextId
        [IO.File]::WriteAllText($worktreeRoadmapPath, (($worktreeRoadmap | ConvertTo-Json -Depth 12) + "`n"), [Text.UTF8Encoding]::new($false))
        $changedIds = @()
        $after = $before
    }
    else {
        $after = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $changedIds = @(Changed-NodeIds $before $after)
    }
    if ($changedIds.Count -gt 3 -or $changedIds.Count -gt [int]$work.Limit) { throw "Daily node limit exceeded: $($changedIds -join ', ')" }
    Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' $validator '-RepositoryRoot' $worktree '-DisciplineId' $DisciplineId
    Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' $builder '-RepositoryRoot' $worktree '-DisciplineId' $DisciplineId
    Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' $builder '-RepositoryRoot' $worktree '-DisciplineId' $DisciplineId '-Check'
    if ($promoteMode) {
        Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' $validator '-RepositoryRoot' $worktree '-DisciplineId' $nextId
        Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' $builder '-RepositoryRoot' $worktree '-DisciplineId' $nextId
        Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' $builder '-RepositoryRoot' $worktree '-DisciplineId' $nextId '-Check'
    }

    if ($changedIds.Count -gt 0 -and -not $bootstrapMode) {
        $worktreeRoadmapPath = Join-Path $worktree 'data\discipline-roadmap.json'
        $worktreeRoadmap = Get-Content -LiteralPath $worktreeRoadmapPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $reviewEntry = @($worktreeRoadmap.disciplines | Where-Object id -eq $DisciplineId | Select-Object -First 1)
        if ($reviewEntry.Count) { $reviewEntry[0].review_status = 'pending' }
        [IO.File]::WriteAllText($worktreeRoadmapPath, (($worktreeRoadmap | ConvertTo-Json -Depth 12) + "`n"), [Text.UTF8Encoding]::new($false))
        Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' (Join-Path $worktree 'scripts\sample_sources.ps1') '-RepositoryRoot' $worktree '-DisciplineId' $DisciplineId
    }
    if ($auditOnly) {
        $completionJson = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $worktree 'scripts\evaluate_discipline.ps1') -RepositoryRoot $worktree -DisciplineId $DisciplineId -Json
        if ($LASTEXITCODE -ne 0) { throw 'Completion evaluation failed.' }
        $completion = $completionJson | ConvertFrom-Json
        if (-not $completion.ready_for_next) { throw "Completion audit is not ready: $completionJson" }
        Checked powershell.exe '-NoProfile' '-ExecutionPolicy' 'Bypass' '-File' (Join-Path $worktree 'scripts\evaluate_discipline.ps1') '-RepositoryRoot' $worktree '-DisciplineId' $DisciplineId '-WriteReport'
    }

    $ledger = Get-Content -LiteralPath $ledgerPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $completedTask = @($ledger.tasks | Where-Object id -eq $selectedTask.id | Select-Object -First 1)
    if ($completedTask.Count -ne 1) { throw "Claimed task disappeared from ledger: $($selectedTask.id)" }
    $completedTask[0].status = 'done'; $completedTask[0].completed_at = (Get-Date -Format 'yyyy-MM-dd'); $completedTask[0].evidence = "Validator and generated-page gates passed; changed nodes: $($changedIds -join ', ')"; $completedTask[0].blocked_reason = $null
    [IO.File]::WriteAllText($ledgerPath, (($ledger | ConvertTo-Json -Depth 14) + "`n"), [Text.UTF8Encoding]::new($false))

    $remaining = @($after.nodes | Where-Object status -eq 'unverified').Count
    $changedText = if ($changedIds.Count) { $changedIds -join ', ' } else { '(no node content changed)' }
    $daily = Join-Path $worktree 'docs\daily-log.md'
    $entry = "`n## $(Get-Date -Format 'yyyy-MM-dd') · $DisciplineId`n`n- Task: $($selectedTask.id)`n- Mode: $($work.Mode)`n- Nodes: $changedText`n- Verification: validator and generated-page check passed`n- Remaining: $remaining unverified node(s)`n"
    [IO.File]::AppendAllText($daily, $entry, [Text.UTF8Encoding]::new($false))
    Assert-FinalChanges $worktree $DisciplineId $nextId

    $paths = @(Changed-Paths $worktree)
    if ($paths.Count -eq 0) { throw 'No changes to publish.' }
    Checked git '-C' $worktree 'add' '--' @paths
    Checked git '-C' $worktree 'diff' '--cached' '--check'
    $summary = if ($changedIds.Count) { "complete $($selectedTask.id)" } else { "complete $($selectedTask.id)" }
    $commitDisciplineId = if ($bootstrapMode -or $promoteMode) { $nextId } else { $DisciplineId }
    Checked git '-C' $worktree 'commit' '-m' "daily($commitDisciplineId): $summary"
    Checked git '-C' $worktree 'push' $remoteUrl 'HEAD:main'
    $published = $true
    [IO.Directory]::CreateDirectory($dailyStateRoot) | Out-Null
    [pscustomobject]@{
        date = (Get-Date -Format 'yyyy-MM-dd')
        discipline = $DisciplineId
        mode = $work.Mode
        task_id = $selectedTask.id
        nodes = @($changedIds)
        commit = (& git -C $worktree rev-parse HEAD).Trim()
        claimedAt = (Get-Date).ToString('o')
    } | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $dailyStatePath -Encoding UTF8
    [pscustomobject]@{ status='done'; task_id=$selectedTask.id; commit=(& git -C $worktree rev-parse HEAD).Trim(); completed_at=(Get-Date).ToString('o') } | ConvertTo-Json | Set-Content -LiteralPath $claimPath -Encoding UTF8

    $liveDisciplineId = if ($promoteMode) { $nextId } else { $DisciplineId }
    $liveName = if ($promoteMode) { [string]$selectedTask.target.next_name } else { [string]$after.name }
    $liveUrl = "$siteRoot/disciplines/$liveDisciplineId/"
    Step "Waiting for Cloudflare Pages: $liveUrl"
    $deadline = (Get-Date).AddMinutes(15); $verified = $false
    do {
        try { $response = Invoke-WebRequest -Uri $liveUrl -UseBasicParsing -TimeoutSec 30; if ($response.StatusCode -eq 200 -and $response.Content -match [regex]::Escape($liveName)) { $verified=$true; break } } catch { Step "Deployment not ready: $($_.Exception.Message)" }
        Start-Sleep -Seconds 20
    } while ((Get-Date) -lt $deadline)
    if (-not $verified) { throw "Cloudflare verification timed out: $liveUrl" }
    Step "Published and verified: $liveUrl"
}
catch {
    [IO.File]::WriteAllText((Join-Path $runRoot 'failure.txt'), "$(Get-Date -Format o)`n$($_ | Out-String)", [Text.UTF8Encoding]::new($false))
    Write-Error $_
    exit 1
}
finally {
    if ($lockTaken) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
    try { Stop-Transcript | Out-Null } catch { }
    if ($worktreeCreated) {
        try { & git -C $repoRoot worktree remove --force $worktree | Out-Null } catch { }
        try { & git -C $repoRoot worktree prune | Out-Null } catch { }
    }
}
