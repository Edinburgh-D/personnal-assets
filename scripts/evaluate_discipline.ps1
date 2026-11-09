[CmdletBinding()]
param(
    [string]$DisciplineId,
    [string]$RepositoryRoot,
    [switch]$WriteReport,
    [switch]$Json
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
if (-not (Test-Path -LiteralPath $dataPath -PathType Leaf)) { throw "Discipline not found: $dataPath" }
$data = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json

$validator = Join-Path $repoRoot 'scripts\validate_discipline.ps1'
$validatorOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $validator -RepositoryRoot $repoRoot -DisciplineId $DisciplineId 2>&1
$validatorPassed = $LASTEXITCODE -eq 0
$policy = $roadmap.completion_policy
$minimums = $policy.minimum_verified_nodes
$counts = [ordered]@{}
$deficits = [Collections.Generic.List[string]]::new()
foreach ($dimension in @('trunk','theory_method','tools_standards','process_product','boundary_open')) {
    $count = @($data.nodes | Where-Object { $_.dimension -eq $dimension -and $_.status -eq 'verified' }).Count
    $required = [int]$minimums.$dimension
    $counts[$dimension] = $count
    if ($count -lt $required) { $deficits.Add("${dimension}:$count/$required") }
}
$unverified = @($data.nodes | Where-Object status -eq 'unverified' | ForEach-Object id)
$draft = @($data.nodes | Where-Object status -eq 'draft' | ForEach-Object id)
$cutoff = (Get-Date).Date.AddDays(-[int]$policy.max_check_age_days)
$stale = @($data.nodes | Where-Object {
    $parsed = [datetime]::MinValue
    -not [datetime]::TryParseExact([string]$_.last_checked, 'yyyy-MM-dd', [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::None, [ref]$parsed) -or $parsed -lt $cutoff
} | ForEach-Object id)
$entry = @($roadmap.disciplines | Where-Object id -eq $DisciplineId | Select-Object -First 1)
$reviewStatus = if ($entry.Count) { [string]$entry[0].review_status } else { 'missing' }
$reviewPassed = -not [bool]$policy.require_review_approval -or $reviewStatus -eq 'approved'
$ledgerPath = Join-Path $repoRoot "data\discipline-tasks\$DisciplineId.json"
$openRequiredTasks = @()
if (Test-Path -LiteralPath $ledgerPath -PathType Leaf) {
    $ledger = Get-Content -LiteralPath $ledgerPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $openRequiredTasks = @($ledger.tasks | Where-Object { [int]$_.priority -lt 90 -and $_.status -ne 'done' } | ForEach-Object id)
}
else { $openRequiredTasks = @('task-ledger-missing') }
$ready = $validatorPassed -and $deficits.Count -eq 0 -and $unverified.Count -eq 0 -and $draft.Count -eq 0 -and $stale.Count -eq 0 -and $reviewPassed -and $openRequiredTasks.Count -eq 0

$result = [pscustomobject]@{
    discipline_id = $DisciplineId
    name = $data.name
    ready_for_next = $ready
    validator_passed = $validatorPassed
    verified_counts = [pscustomobject]$counts
    density_deficits = @($deficits)
    unverified_nodes = @($unverified)
    draft_nodes = @($draft)
    stale_nodes = @($stale)
    review_status = $reviewStatus
    open_required_tasks = @($openRequiredTasks)
    max_check_age_days = [int]$policy.max_check_age_days
}

if ($WriteReport) {
    $reportPath = Join-Path $repoRoot "docs\review\$DisciplineId-completion.md"
    $lines = @(
        "# $($data.name)专业全貌完成度",
        '',
        "更新时间：$(Get-Date -Format 'yyyy-MM-dd')",
        '',
        "结论：$(if ($ready) { '已达到切换下一专业的门槛' } else { '尚未达到切换门槛' })",
        '',
        '## 自动门禁',
        '',
        "- 结构校验：$(if ($validatorPassed) { '通过' } else { '失败' })",
        "- 覆盖密度：$(if ($deficits.Count -eq 0) { '通过' } else { '缺口 ' + ($deficits -join '，') })",
        "- 未核实节点：$($unverified.Count)",
        "- 草稿节点：$($draft.Count)",
        "- 超过 $($policy.max_check_age_days) 天未核查：$($stale.Count)",
        "- 人工来源抽样：$reviewStatus",
        "- 未完成的必需任务：$($openRequiredTasks.Count)",
        '',
        '只有以上门禁全部通过，自动任务才允许从批准队列启动下一个专业。'
    )
    [IO.File]::WriteAllText($reportPath, (($lines -join "`n") + "`n"), [Text.UTF8Encoding]::new($false))
}

if ($Json) { $result | ConvertTo-Json -Depth 8 -Compress }
else {
    $validatorOutput | ForEach-Object { Write-Host $_ }
    $result | Format-List
}
