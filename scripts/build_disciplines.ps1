[CmdletBinding()]
param(
    [string]$RepositoryRoot,
    [string]$DisciplineId,
    [switch]$Check
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) { $RepositoryRoot = Split-Path -Parent $scriptDirectory }
$repoRoot = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$dataRoot = Join-Path $repoRoot 'data\disciplines'
$outputRoot = Join-Path $repoRoot 'disciplines'
$utf8 = [Text.UTF8Encoding]::new($false)
$stale = [Collections.Generic.List[string]]::new()

function Html([object]$value) { return [Net.WebUtility]::HtmlEncode([string]$value) }
function Sync-File([string]$path, [string]$content) {
    $wanted = (($content -replace "`r`n", "`n").TrimEnd() + "`n")
    $current = if (Test-Path -LiteralPath $path -PathType Leaf) { ((Get-Content -LiteralPath $path -Raw -Encoding UTF8) -replace "`r`n", "`n").TrimEnd() + "`n" } else { $null }
    if ($current -ceq $wanted) { return }
    if ($Check) { $stale.Add($path.Substring($repoRoot.Length).TrimStart('\')); return }
    [IO.Directory]::CreateDirectory((Split-Path -Parent $path)) | Out-Null
    [IO.File]::WriteAllText($path, $wanted, $utf8)
    Write-Host "UPDATED: $($path.Substring($repoRoot.Length).TrimStart('\'))"
}
function Trunk-Order([object[]]$nodes) {
    $trunks = @($nodes | Where-Object dimension -eq 'trunk')
    if ($trunks.Count -eq 0) { return @() }
    $ordered = [Collections.Generic.List[object]]::new()
    $cursor = @($trunks | Where-Object { [string]::IsNullOrWhiteSpace([string]$_.parent) })[0]
    while ($null -ne $cursor) {
        $ordered.Add($cursor)
        $child = @($trunks | Where-Object { [string]$_.parent -eq [string]$cursor.id })
        $cursor = if ($child.Count -eq 1) { $child[0] } else { $null }
    }
    return @($ordered)
}
function Published-Nodes([object[]]$nodes) {
    $byId = @{}; foreach ($node in $nodes) { $byId[[string]$node.id] = $node }
    $result = [Collections.Generic.List[object]]::new()
    foreach ($node in $nodes) {
        if ($node.status -ne 'verified') { continue }
        $cursor = $node; $safe = $true
        while (-not [string]::IsNullOrWhiteSpace([string]$cursor.parent)) {
            if (-not $byId.ContainsKey([string]$cursor.parent) -or $byId[[string]$cursor.parent].status -ne 'verified') { $safe = $false; break }
            $cursor = $byId[[string]$cursor.parent]
        }
        if ($safe) { $result.Add($node) }
    }
    return @($result)
}
function Mini-Map([object[]]$trunks, [string]$activeId, [string]$prefix) {
    $items = foreach ($node in $trunks) {
        $active = if ([string]$node.id -eq $activeId) { ' is-current' } else { '' }
        $aria = if ($active) { ' aria-current="location"' } else { '' }
        "<li><a class=`"mini-node$active`" href=`"$prefix$([uri]::EscapeDataString([string]$node.id)).html`" title=`"$(Html $node.title)`"$aria><span>$(Html $node.title)</span></a></li>"
    }
    return "<ol class=`"mini-map`">$($items -join '')</ol>"
}

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'scripts\validate_discipline.ps1') -RepositoryRoot $repoRoot $(if ($DisciplineId) { @('-DisciplineId', $DisciplineId) } else { @() })
if ($LASTEXITCODE -ne 0) { throw 'Discipline validation failed; generation stopped.' }

$files = if ($DisciplineId) { @(Get-Item -LiteralPath (Join-Path $dataRoot "$DisciplineId.json")) } else { @(Get-ChildItem -LiteralPath $dataRoot -Filter '*.json' -File | Sort-Object Name) }
$dimensionLabels = [ordered]@{ theory_method='理论与方法'; tools_standards='工具与标准'; process_product='工艺与产品'; boundary_open='边界与未解问题' }
$gradeLabels = @{ textbook='教科书'; review='综述'; standard='标准'; primary='一手资料'; other='机构资料' }

foreach ($file in $files) {
    $data = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    $nodes = Published-Nodes @($data.nodes)
    $trunks = Trunk-Order $nodes
    $disciplineRoot = Join-Path $outputRoot $data.id
    $nodeRoot = Join-Path $disciplineRoot 'nodes'

    $trunkCards = for ($i = 0; $i -lt $trunks.Count; $i++) {
        $node = $trunks[$i]
        "<li><a href=`"nodes/$($node.id).html`"><span class=`"step`">$('{0:D2}' -f ($i + 1))</span><strong>$(Html $node.title)</strong><span>$(Html $node.summary)</span></a></li>"
    }
    $branchBlocks = foreach ($dimension in $dimensionLabels.Keys) {
        $members = @($nodes | Where-Object dimension -eq $dimension)
        $body = if ($members.Count -eq 0) {
            '<p class="pending">待补全</p>'
        } else {
            $rows = foreach ($node in $members) { "<li><a href=`"nodes/$($node.id).html`"><strong>$(Html $node.title)</strong><span>$(Html $node.summary)</span></a></li>" }
            "<ul>$($rows -join '')</ul>"
        }
        "<section class=`"branch-block`"><h2>$(Html $dimensionLabels[$dimension])</h2>$body</section>"
    }
    $neighbors = @(foreach ($neighbor in @($data.neighbors)) { "<a href=`"../../$($neighbor.link)`">$(Html $neighbor.name)</a>" })
    $overview = @"
<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>$(Html $data.name)专业全貌 · Personal Archive</title><meta name="description" content="$(Html $data.core_problem)"><link rel="stylesheet" href="../styles.css"></head>
<body class="overview-page"><header class="site-nav"><a class="brand" href="../../index.html">Personal Archive</a><span>专业全貌 / $(Html $data.name)</span></header>
<main><header class="discipline-intro"><p class="eyebrow">DISCIPLINE MAP · $(Html $data.id)</p><h1>$(Html $data.name)</h1><p class="core-problem">$(Html $data.core_problem)</p></header>
<section class="trunk-section" aria-labelledby="trunk-title"><div class="section-heading"><h2 id="trunk-title">问题演进主干</h2><p>从根本问题到当前工程前沿</p></div><ol class="trunk-map">$($trunkCards -join '')</ol></section>
<div class="branch-grid">$($branchBlocks -join '')</div>
</main><footer class="site-footer"><p>相邻专业：$(if ($neighbors.Count) { $neighbors -join ' · ' } else { '暂无' })</p><a href="../../index.html">返回 Personal Archive 首页</a></footer></body></html>
"@
    Sync-File (Join-Path $disciplineRoot 'index.html') $overview

    foreach ($node in $nodes) {
        $trunkFacts = if ($node.dimension -eq 'trunk') { @"
<section class="trunk-facts"><div><h2>此前做法</h2><p>$(Html $node.old_approach)</p></div><div><h2>卡点</h2><p>$(Html $node.bottleneck)</p></div><div><h2>引出的概念</h2><p>$(Html $node.new_concept)</p></div></section>
"@ } else { '' }
        $deepLink = if (-not [string]::IsNullOrWhiteSpace([string]$node.detail_page)) { "<p class=`"deep-link`"><a href=`"../../../$($node.detail_page)`">深入阅读现有知识库 <span aria-hidden=`"true`">→</span></a></p>" } else { '' }
        $sourceRows = foreach ($source in @($node.sources)) {
            "<li><a href=`"$(Html $source.url)`" rel=`"noreferrer`">$(Html $source.title)</a><span class=`"source-grade`">$(Html $gradeLabels[[string]$source.grade])</span><p>$(Html $source.supports)</p></li>"
        }
        $detail = @"
<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>$(Html $node.title) · $(Html $data.name)专业全貌</title><meta name="description" content="$(Html $node.summary)"><link rel="stylesheet" href="../../styles.css"></head>
<body class="node-page"><header class="site-nav"><a class="brand" href="../../../index.html">Personal Archive</a><a href="../index.html">$(Html $data.name)全貌</a></header>
<main><nav class="position-map" aria-label="在专业主干中的位置"><p>你在全貌中的位置</p>$(Mini-Map $trunks ([string]$node.id) '')</nav>
<article class="node-article"><header><p class="eyebrow">$(Html $dimensionLabels[[string]$node.dimension])$(if ($node.dimension -eq 'trunk') { '问题演进主干' }) · $(Html $node.type)</p><h1>$(Html $node.title)</h1><p class="node-summary">$(Html $node.summary)</p></header>$trunkFacts$deepLink
<section class="sources"><div class="section-heading"><h2>来源与核查</h2><p>最后核查：$(Html $node.last_checked)</p></div><ol>$($sourceRows -join '')</ol></section></article></main>
<footer class="site-footer"><a href="../index.html">返回 $(Html $data.name)全貌</a><a href="../../../index.html">返回 Personal Archive 首页</a></footer></body></html>
"@
        Sync-File (Join-Path $nodeRoot "$($node.id).html") $detail
    }

    if (Test-Path -LiteralPath $nodeRoot) {
        $expected = @{}; foreach ($node in $nodes) { $expected["$($node.id).html"] = $true }
        foreach ($old in @(Get-ChildItem -LiteralPath $nodeRoot -Filter '*.html' -File)) {
            if (-not $expected.ContainsKey($old.Name)) {
                if ($Check) { $stale.Add($old.FullName.Substring($repoRoot.Length).TrimStart('\')) }
                else { Remove-Item -LiteralPath $old.FullName -Force; Write-Host "REMOVED stale generated page: $($old.Name)" }
            }
        }
    }
}

$homepagePath = Join-Path $repoRoot 'index.html'
$homepageContent = Get-Content -LiteralPath $homepagePath -Raw -Encoding UTF8
$startMarker = '<!-- AUTO:DISCIPLINE_LIST:START -->'
$endMarker = '<!-- AUTO:DISCIPLINE_LIST:END -->'
if (-not $homepageContent.Contains($startMarker) -or -not $homepageContent.Contains($endMarker)) { throw 'Homepage discipline-list markers are missing.' }
$homeEntries = [Collections.Generic.List[string]]::new()
foreach ($disciplineFile in @(Get-ChildItem -LiteralPath $dataRoot -Filter '*.json' -File | Sort-Object Name)) {
    $discipline = Get-Content -LiteralPath $disciplineFile.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    if (@($discipline.nodes | Where-Object status -eq 'verified').Count -eq 0) { continue }
    $homeEntries.Add("        <a class=`"discipline-entry`" href=`"disciplines/$($discipline.id)/`">")
    $homeEntries.Add("          <h3>$(Html $discipline.name)</h3>")
    $homeEntries.Add("          <p>$(Html $discipline.core_problem)</p>")
    $homeEntries.Add('          <span class="entry-action">打开全貌图谱 →</span>')
    $homeEntries.Add('        </a>')
}
$managed = "$startMarker`n$($homeEntries -join "`n")`n        $endMarker"
$pattern = [regex]::Escape($startMarker) + '.*?' + [regex]::Escape($endMarker)
$updatedHomepage = [regex]::Replace($homepageContent, $pattern, $managed, [Text.RegularExpressions.RegexOptions]::Singleline)
Sync-File $homepagePath $updatedHomepage

if ($Check -and $stale.Count -gt 0) {
    Write-Host 'Generated discipline pages are stale:' -ForegroundColor Red
    foreach ($path in $stale) { Write-Host "  - $path" -ForegroundColor Red }
    exit 1
}
Write-Host "Discipline pages $($(if ($Check) { 'are current' } else { 'generated' }))." -ForegroundColor Green
