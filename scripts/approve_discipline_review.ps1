[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$DisciplineId,
    [string]$RepositoryRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) { $RepositoryRoot = Split-Path -Parent $scriptDirectory }
$repoRoot = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$samplePath = Join-Path $repoRoot "docs\review\$DisciplineId-sample.md"
if (-not (Test-Path -LiteralPath $samplePath -PathType Leaf)) { throw "Review sample not found: $samplePath" }
$roadmapPath = Join-Path $repoRoot 'data\discipline-roadmap.json'
$roadmap = Get-Content -LiteralPath $roadmapPath -Raw -Encoding UTF8 | ConvertFrom-Json
$entry = @($roadmap.disciplines | Where-Object id -eq $DisciplineId | Select-Object -First 1)
if ($entry.Count -eq 0) { throw "Roadmap entry not found: $DisciplineId" }
$entry[0].review_status = 'approved'
$entry[0] | Add-Member -NotePropertyName review_approved_at -NotePropertyValue (Get-Date -Format 'yyyy-MM-dd') -Force
[IO.File]::WriteAllText($roadmapPath, (($roadmap | ConvertTo-Json -Depth 12) + "`n"), [Text.UTF8Encoding]::new($false))
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'scripts\plan_discipline_tasks.ps1') -RepositoryRoot $repoRoot -DisciplineId $DisciplineId
Write-Host "Source-sample review approved for $DisciplineId."
