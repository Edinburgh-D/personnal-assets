[CmdletBinding()]
param(
    [string]$DisciplineId,
    [string]$RepositoryRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) { $RepositoryRoot = Split-Path -Parent $scriptDirectory }
$repoRoot = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$roadmapPath = Join-Path $repoRoot 'data\discipline-roadmap.json'
$roadmap = Get-Content -LiteralPath $roadmapPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($DisciplineId)) { $DisciplineId = [string]$roadmap.current_id }
$dataPath = Join-Path $repoRoot "data\disciplines\$DisciplineId.json"
$data = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json
$taskRoot = Join-Path $repoRoot 'data\discipline-tasks'
$taskPath = Join-Path $taskRoot "$DisciplineId.json"
$existing = if (Test-Path -LiteralPath $taskPath -PathType Leaf) { Get-Content -LiteralPath $taskPath -Raw -Encoding UTF8 | ConvertFrom-Json } else { $null }
$tasks = [Collections.Generic.List[object]]::new()
if ($null -ne $existing) { foreach ($task in @($existing.tasks)) { $tasks.Add($task) } }

function Find-Task([string]$id) { return @($tasks | Where-Object id -eq $id | Select-Object -First 1) }
function Ensure-Task([string]$id, [string]$title, [string]$kind, [string]$role, [int]$priority, [int]$maxNodes, [object]$target, [string[]]$depends, [string]$acceptance, [string]$defaultStatus) {
    $found = @(Find-Task $id)
    if ($found.Count) { return $found[0] }
    $task = [pscustomobject]@{
        id=$id; title=$title; kind=$kind; role=$role; priority=$priority; max_nodes=$maxNodes
        target=$target; depends_on=@($depends); acceptance=$acceptance; status=$defaultStatus
        completed_at=$null; evidence=$null; blocked_reason=$null
    }
    $tasks.Add($task)
    return $task
}
function Mark-Done($task, [string]$evidence) {
    if ($task.status -ne 'done') {
        $task.status = 'done'; $task.completed_at = (Get-Date -Format 'yyyy-MM-dd'); $task.evidence = $evidence; $task.blocked_reason = $null
    }
}

$validator = Join-Path $repoRoot 'scripts\validate_discipline.ps1'
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $validator -RepositoryRoot $repoRoot -DisciplineId $DisciplineId | Out-Host
$valid = $LASTEXITCODE -eq 0
$validationTask = Ensure-Task 'validate-structure' 'Pass the discipline schema and link validator' 'validation' 'gatekeeper' 10 3 ([pscustomobject]@{ discipline=$DisciplineId }) @() 'Validator exits zero.' $(if ($valid) { 'done' } else { 'todo' })
if ($valid) { Mark-Done $validationTask 'validate_discipline.ps1 passed' } elseif ($validationTask.status -eq 'done') { $validationTask.status='todo'; $validationTask.completed_at=$null; $validationTask.evidence=$null }

$allCoverageIds = [Collections.Generic.List[string]]::new()
$dimensions = @('trunk','theory_method','tools_standards','process_product','boundary_open')
foreach ($dimension in $dimensions) {
    $required = [int]$roadmap.completion_policy.minimum_verified_nodes.$dimension
    $count = @($data.nodes | Where-Object { $_.dimension -eq $dimension -and $_.status -eq 'verified' }).Count
    for ($slot=1; $slot -le $required; $slot++) {
        $id = "coverage-$($dimension.Replace('_','-'))-$('{0:D2}' -f $slot)"
        $allCoverageIds.Add($id)
        $depends = if ($slot -eq 1) { @('validate-structure') } else { @("coverage-$($dimension.Replace('_','-'))-$('{0:D2}' -f ($slot-1))") }
        $task = Ensure-Task $id "Reach verified $dimension coverage slot $slot of $required" 'coverage' 'architect' (30 + $slot) 1 ([pscustomobject]@{ dimension=$dimension; ordinal=$slot }) $depends "The dimension contains at least $slot verified node(s)." $(if ($count -ge $slot) { 'done' } else { 'todo' })
        if ($count -ge $slot) { Mark-Done $task "Existing verified count is $count" }
    }
}

$verificationIds = [Collections.Generic.List[string]]::new()
foreach ($node in @($data.nodes | Where-Object status -eq 'unverified' | Sort-Object last_checked,id)) {
    $id = "verify-$($node.id)"; $verificationIds.Add($id)
    [void](Ensure-Task $id "Verify sources for $($node.id)" 'verification' 'researcher' 20 1 ([pscustomobject]@{ node_id=$node.id }) @('validate-structure') 'Node is verified and every supports statement matches an opened source.' 'todo')
}

$cutoff = (Get-Date).Date.AddDays(-[int]$roadmap.completion_policy.max_check_age_days)
$recheckIds = [Collections.Generic.List[string]]::new()
foreach ($node in @($data.nodes | Where-Object status -eq 'verified')) {
    $checked = [datetime]::MinValue
    $parsed = [datetime]::TryParseExact([string]$node.last_checked, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::None, [ref]$checked)
    if (-not $parsed -or $checked -lt $cutoff) {
        $id = "recheck-$($node.id)-$(Get-Date -Format 'yyyyMMdd')"; $recheckIds.Add($id)
        [void](Ensure-Task $id "Recheck stale sources for $($node.id)" 'recheck' 'auditor' 50 1 ([pscustomobject]@{ node_id=$node.id }) @('validate-structure') 'Sources still resolve, claims remain accurate, and last_checked is current.' 'todo')
    }
}

$reviewEntry = @($roadmap.disciplines | Where-Object id -eq $DisciplineId | Select-Object -First 1)
$reviewApproved = $reviewEntry.Count -gt 0 -and $reviewEntry[0].review_status -eq 'approved'
$reviewDeps = @($allCoverageIds) + @($verificationIds) + @($recheckIds)
$reviewTask = Ensure-Task 'approve-source-sample' 'Human approval of the random source sample' 'manual-review' 'human' 80 0 ([pscustomobject]@{ sample="docs/review/$DisciplineId-sample.md" }) $reviewDeps 'The owner records approval after checking that sampled sources support their claims.' $(if ($reviewApproved) { 'done' } else { 'todo' })
if ($reviewApproved) { Mark-Done $reviewTask 'roadmap review_status is approved' }
elseif ($reviewTask.status -eq 'done') { $reviewTask.status='todo'; $reviewTask.completed_at=$null; $reviewTask.evidence=$null }

$auditTask = Ensure-Task 'final-completion-audit' 'Run the final completion audit' 'completion-audit' 'auditor' 90 0 ([pscustomobject]@{ discipline=$DisciplineId }) @('approve-source-sample') 'Validator, generated-page check, coverage policy, freshness, and review approval all pass.' 'todo'
$queue = @($roadmap.queue | Where-Object state -in @('approved','bootstrapping') | Select-Object -First 1)
if ($queue.Count) {
    $previous = 'final-completion-audit'
    for ($batch=1; $batch -le 3; $batch++) {
        $bootstrapId = "bootstrap-$($queue[0].id)-trunk-$('{0:D2}' -f $batch)"
        [void](Ensure-Task $bootstrapId "Build sourced trunk batch $batch for $($queue[0].id)" 'bootstrap' 'transition' (100+$batch) 3 ([pscustomobject]@{ next_id=$queue[0].id; next_name=$queue[0].name; batch=$batch }) @($previous) 'Add exactly three verified trunk nodes to the approved draft without publishing it.' 'todo')
        $previous = $bootstrapId
    }
    $transition = Ensure-Task 'transition-next-discipline' 'Promote the completed next-discipline trunk' 'transition' 'transition' 110 0 ([pscustomobject]@{ next_id=$queue[0].id; next_name=$queue[0].name }) @($previous) 'The 9-node verified trunk passes the full validator, becomes current, and receives generated pages.' 'todo'
    if ($transition.status -eq 'blocked') { $transition.status='todo'; $transition.blocked_reason=$null }
    $transition.target.next_id=$queue[0].id; $transition.target.next_name=$queue[0].name; $transition.depends_on=@($previous)
}
else {
    $transition = Ensure-Task 'transition-next-discipline' 'Promote the next user-approved discipline' 'transition' 'transition' 110 0 ([pscustomobject]@{ next_id=$null; next_name=$null }) @('final-completion-audit') 'A user-approved next discipline is promoted only after its sourced trunk is complete.' 'blocked'
    $transition.status='blocked'; $transition.blocked_reason='No user-approved next discipline is queued.'
}

$ledger = [ordered]@{
    discipline_id=$DisciplineId; generated_at=(Get-Date).ToString('o'); policy_source='data/discipline-roadmap.json'
    tasks=@($tasks | Sort-Object priority,id)
}
[IO.Directory]::CreateDirectory($taskRoot) | Out-Null
[IO.File]::WriteAllText($taskPath, (($ledger | ConvertTo-Json -Depth 14) + "`n"), [Text.UTF8Encoding]::new($false))
Write-Host "Task ledger planned: $taskPath ($($tasks.Count) tasks)"
