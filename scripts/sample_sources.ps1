[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$DisciplineId,
    [string]$RepositoryRoot,
    [int]$Count = 10
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) { $RepositoryRoot = Split-Path -Parent $scriptDirectory }
$repoRoot = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$dataPath = Join-Path $repoRoot "data\disciplines\$DisciplineId.json"
if (-not (Test-Path -LiteralPath $dataPath -PathType Leaf)) { throw "Discipline not found: $dataPath" }
$data = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8 | ConvertFrom-Json

$rows = foreach ($node in @($data.nodes)) {
    foreach ($source in @($node.sources)) {
        [pscustomobject]@{ NodeId = $node.id; NodeTitle = $node.title; Supports = $source.supports; SourceTitle = $source.title; Url = $source.url; Grade = $source.grade }
    }
}
$sample = @($rows | Get-Random -Count ([Math]::Min($Count, @($rows).Count)))
function Escape-Cell([object]$value) { return ([string]$value).Replace('|', '\|').Replace("`r", ' ').Replace("`n", ' ') }

$lines = [Collections.Generic.List[string]]::new()
$lines.Add("# $($data.name)来源抽样复核")
$lines.Add('')
$lines.Add("生成时间：$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')。以下条目仅供人工判断来源是否真正支持对应陈述。")
$lines.Add('')
$lines.Add('| 节点 | 来源等级 | 来源 | supports | 人工结论 |')
$lines.Add('|---|---|---|---|---|')
foreach ($row in $sample) {
    $node = "``$($row.NodeId)`` · $(Escape-Cell $row.NodeTitle)"
    $source = "[$(Escape-Cell $row.SourceTitle)]($($row.Url))"
    $lines.Add("| $node | ``$($row.Grade)`` | $source | $(Escape-Cell $row.Supports) | 待核对 |")
}

$reviewRoot = Join-Path $repoRoot 'docs\review'
[IO.Directory]::CreateDirectory($reviewRoot) | Out-Null
$outputPath = Join-Path $reviewRoot "$DisciplineId-sample.md"
[IO.File]::WriteAllText($outputPath, (($lines -join "`n") + "`n"), [Text.UTF8Encoding]::new($false))
Write-Host "Source sample written: $outputPath ($($sample.Count) row(s))"
