[CmdletBinding()]
param(
    [string]$RepositoryRoot,
    [string]$DisciplineId
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) { $RepositoryRoot = Split-Path -Parent $scriptDirectory }
$repoRoot = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$dataRoot = Join-Path $repoRoot 'data\disciplines'
$errors = [Collections.Generic.List[string]]::new()
$warnings = [Collections.Generic.List[string]]::new()

function Error-At([string]$file, [string]$message) { $errors.Add("$file`: $message") }
function Warn-At([string]$file, [string]$message) { $warnings.Add("$file`: $message") }
function Has-Text($value) { return $null -ne $value -and -not [string]::IsNullOrWhiteSpace([string]$value) }
function Has-Property($object, [string]$name) { return $null -ne $object -and $null -ne $object.PSObject.Properties[$name] }

$files = if (Has-Text $DisciplineId) {
    $target = Join-Path $dataRoot "$DisciplineId.json"
    if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
        Write-Error "Discipline data not found: $target"
        exit 1
    }
    @(Get-Item -LiteralPath $target)
} else {
    @(Get-ChildItem -LiteralPath $dataRoot -Filter '*.json' -File | Sort-Object Name)
}
$files = @($files)

if ($files.Count -eq 0) {
    Write-Error "No discipline JSON found in $dataRoot"
    exit 1
}

$topFields = @('id','name','core_problem','blank_dimensions','neighbors','nodes')
$nodeFields = @('id','dimension','type','parent','title','summary','old_approach','bottleneck','new_concept','detail_page','sources','last_checked','status')
$dimensions = @('trunk','theory_method','tools_standards','process_product','boundary_open')
$branchDimensions = @('theory_method','tools_standards','process_product','boundary_open')
$types = @('问题','理论','方法','工具','标准','工艺','产品','组织制度','边界','未解问题')
$statuses = @('draft','verified','unverified')
$grades = @('textbook','review','standard','primary','other')

foreach ($file in $files) {
    $label = $file.Name
    try { $data = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8 | ConvertFrom-Json }
    catch { Error-At $label "invalid JSON: $($_.Exception.Message)"; continue }

    foreach ($field in $topFields) {
        if (-not (Has-Property $data $field)) { Error-At $label "missing top-level field '$field'" }
    }
    if (-not (Has-Property $data 'nodes')) { continue }
    if (-not (Has-Text $data.id) -or $data.id -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') { Error-At $label 'id must be kebab-case' }
    if (-not (Has-Text $data.name)) { Error-At $label 'name must not be empty' }
    if (-not (Has-Text $data.core_problem)) { Error-At $label 'core_problem must not be empty' }
    elseif (([string]$data.core_problem).Length -gt 40) { Error-At $label 'core_problem exceeds 40 characters' }

    $blank = if (Has-Property $data 'blank_dimensions') { @($data.blank_dimensions) } else { @() }
    foreach ($dimension in $blank) {
        if ($dimension -notin $branchDimensions) { Error-At $label "invalid blank dimension '$dimension'" }
    }

    $nodes = @($data.nodes)
    $byId = @{}
    foreach ($node in $nodes) {
        $nodeLabel = if (Has-Property $node 'id' -and (Has-Text $node.id)) { [string]$node.id } else { '<missing-id>' }
        foreach ($field in $nodeFields) {
            if (-not (Has-Property $node $field)) { Error-At $label "node '$nodeLabel' missing field '$field'" }
        }
        if ($nodeLabel -eq '<missing-id>') { continue }
        if ($nodeLabel -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') { Error-At $label "node '$nodeLabel' id is not kebab-case" }
        if ($byId.ContainsKey($nodeLabel)) { Error-At $label "duplicate node id '$nodeLabel'" } else { $byId[$nodeLabel] = $node }
        if ($node.dimension -notin $dimensions) { Error-At $label "node '$nodeLabel' has invalid dimension '$($node.dimension)'" }
        if ($node.type -notin $types) { Error-At $label "node '$nodeLabel' has invalid type '$($node.type)'" }
        if (-not (Has-Text $node.title)) { Error-At $label "node '$nodeLabel' title is empty" }
        if (-not (Has-Text $node.summary)) { Error-At $label "node '$nodeLabel' summary is empty" }
        elseif (([string]$node.summary).Length -gt 40) { Error-At $label "node '$nodeLabel' summary exceeds 40 characters" }
        if ($node.status -notin $statuses) { Error-At $label "node '$nodeLabel' has invalid status '$($node.status)'" }
        elseif ($node.status -eq 'unverified') { Warn-At $label "node '$nodeLabel' is unverified and will not be published" }
        if (-not (Has-Text $node.last_checked) -or $node.last_checked -notmatch '^\d{4}-\d{2}-\d{2}$') { Error-At $label "node '$nodeLabel' needs last_checked in YYYY-MM-DD format" }

        if ($node.dimension -eq 'trunk') {
            foreach ($field in @('old_approach','bottleneck','new_concept')) {
                if (-not (Has-Text $node.$field)) { Error-At $label "trunk node '$nodeLabel' requires '$field'" }
            }
        }

        $sources = @(if (Has-Property $node 'sources') { @($node.sources) } else { @() })
        if ($sources.Count -lt 1) { Error-At $label "node '$nodeLabel' must have at least one source" }
        foreach ($source in $sources) {
            if (-not (Has-Text $source.title)) { Error-At $label "node '$nodeLabel' has a source without title" }
            $uri = $null
            if (-not (Has-Text $source.url) -or -not [Uri]::TryCreate([string]$source.url, [UriKind]::Absolute, [ref]$uri) -or $uri.Scheme -notin @('http','https')) { Error-At $label "node '$nodeLabel' has an invalid source URL" }
            if (-not (Has-Text $source.supports)) { Error-At $label "node '$nodeLabel' has a source without supports" }
            if (-not (Has-Text $source.grade) -or $source.grade -notin $grades) { Error-At $label "node '$nodeLabel' has an invalid source grade" }
        }

        if (Has-Text $node.detail_page) {
            $detailPath = Join-Path $repoRoot ([string]$node.detail_page -replace '/', '\')
            if (-not (Test-Path -LiteralPath $detailPath -PathType Leaf)) { Error-At $label "node '$nodeLabel' detail_page does not exist: $($node.detail_page)" }
        }
    }

    $trunks = @($nodes | Where-Object { $_.dimension -eq 'trunk' })
    if ($trunks.Count -lt 6 -or $trunks.Count -gt 10) { Error-At $label "trunk node count must be 6-10; found $($trunks.Count)" }
    foreach ($dimension in $branchDimensions) {
        $count = @($nodes | Where-Object { $_.dimension -eq $dimension }).Count
        if ($count -eq 0 -and $dimension -notin $blank) { Error-At $label "dimension '$dimension' is empty and not declared in blank_dimensions" }
        if ($count -gt 0 -and $dimension -in $blank) { Error-At $label "dimension '$dimension' has nodes and cannot be blank" }
    }

    $rootNodes = @($nodes | Where-Object { -not (Has-Text $_.parent) })
    $trunkRoots = @($trunks | Where-Object { -not (Has-Text $_.parent) })
    if ($rootNodes.Count -ne 1 -or $trunkRoots.Count -ne 1) { Error-At $label 'exactly one node may have null parent, and it must be a trunk node' }
    foreach ($node in $nodes) {
        if ((Has-Text $node.parent) -and -not $byId.ContainsKey([string]$node.parent)) { Error-At $label "node '$($node.id)' parent '$($node.parent)' does not exist" }
    }

    foreach ($node in $nodes) {
        $seen = @{}
        $cursor = $node
        while ($null -ne $cursor -and (Has-Text $cursor.parent)) {
            if ($seen.ContainsKey([string]$cursor.id)) { Error-At $label "cycle detected from node '$($node.id)'"; break }
            $seen[[string]$cursor.id] = $true
            if (-not $byId.ContainsKey([string]$cursor.parent)) { break }
            $cursor = $byId[[string]$cursor.parent]
        }
    }

    if ($trunkRoots.Count -eq 1) {
        $trunkIds = @{}; foreach ($t in $trunks) { $trunkIds[[string]$t.id] = $true }
        $cursor = $trunkRoots[0]; $chain = @{}
        while ($null -ne $cursor) {
            $chain[[string]$cursor.id] = $true
            $children = @($trunks | Where-Object { [string]$_.parent -eq [string]$cursor.id })
            if ($children.Count -gt 1) { Error-At $label "trunk forks after '$($cursor.id)'"; break }
            $cursor = if ($children.Count -eq 1) { $children[0] } else { $null }
        }
        if ($chain.Count -ne $trunks.Count) { Error-At $label 'trunk nodes must form one complete chain' }
    }
}

foreach ($warning in $warnings) { Write-Warning $warning }
if ($errors.Count -gt 0) {
    Write-Host "Discipline validation failed ($($errors.Count) issue(s)):" -ForegroundColor Red
    foreach ($problem in $errors) { Write-Host "  - $problem" -ForegroundColor Red }
    exit 1
}
Write-Host "Discipline validation passed: $($files.Count) file(s), $($warnings.Count) warning(s)." -ForegroundColor Green
exit 0
