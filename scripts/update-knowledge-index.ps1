[CmdletBinding()]
param(
    [string]$RepositoryRoot,
    [switch]$Check,
    [switch]$RequireGitTrackedEntries
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) {
    $scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepositoryRoot = Split-Path -Parent $scriptDirectory
}

$repoRoot = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$knowledgeRoot = Join-Path $repoRoot 'knowledge-bases'
$listStart = '<!-- AUTO:KNOWLEDGE_BASE_LIST:START -->'
$listEnd = '<!-- AUTO:KNOWLEDGE_BASE_LIST:END -->'
$script:needsUpdate = $false

if (-not (Test-Path -LiteralPath $knowledgeRoot -PathType Container)) {
    throw "Knowledge-base directory not found: $knowledgeRoot"
}

function Get-FirstMatchValue {
    param(
        [string]$Content,
        [string[]]$Patterns
    )

    foreach ($pattern in $Patterns) {
        $match = [regex]::Match($Content, $pattern)
        if ($match.Success) {
            return [System.Net.WebUtility]::HtmlDecode($match.Groups['value'].Value.Trim())
        }
    }

    return $null
}

function Get-ManifestValue {
    param(
        [object]$Manifest,
        [string]$PropertyName
    )

    if ($null -ne $Manifest -and $Manifest.PSObject.Properties.Name -contains $PropertyName) {
        return $Manifest.$PropertyName
    }

    return $null
}

function Test-GitEntry {
    param([string]$RelativePath)

    & git -C $repoRoot ls-files --error-unmatch -- $RelativePath *> $null
    return $LASTEXITCODE -eq 0
}

function Get-KnowledgeBaseRecord {
    param([System.IO.DirectoryInfo]$Directory)

    $entryName = $null
    foreach ($candidate in @('main.html', 'index.html')) {
        if (Test-Path -LiteralPath (Join-Path $Directory.FullName $candidate) -PathType Leaf) {
            $entryName = $candidate
            break
        }
    }

    if (-not $entryName) {
        Write-Warning "Skipped '$($Directory.Name)': main.html or index.html was not found."
        return $null
    }

    $relativeEntry = "knowledge-bases/$($Directory.Name)/$entryName"
    if ($RequireGitTrackedEntries -and -not (Test-GitEntry -RelativePath $relativeEntry)) {
        throw "Knowledge-base entry is not staged or tracked: $relativeEntry. Stage the knowledge-base files before committing."
    }

    $manifest = $null
    $manifestPath = Join-Path $Directory.FullName 'content-manifest.json'
    if (Test-Path -LiteralPath $manifestPath -PathType Leaf) {
        try {
            $manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
        }
        catch {
            Write-Warning "Could not read '$manifestPath': $($_.Exception.Message)"
        }
    }

    $entryPath = Join-Path $Directory.FullName $entryName
    $html = Get-Content -LiteralPath $entryPath -Raw -Encoding UTF8
    $title = [string](Get-ManifestValue -Manifest $manifest -PropertyName 'topic')
    if ([string]::IsNullOrWhiteSpace($title)) {
        $title = Get-FirstMatchValue -Content $html -Patterns @(
            '(?is)<title\b[^>]*>(?<value>.*?)</title>'
        )
    }
    if ([string]::IsNullOrWhiteSpace($title)) {
        $title = $Directory.Name
    }

    $description = Get-FirstMatchValue -Content $html -Patterns @(
        '(?is)<meta\b[^>]*\bname\s*=\s*["'']description["''][^>]*\bcontent\s*=\s*["''](?<value>.*?)["''][^>]*>',
        '(?is)<meta\b[^>]*\bcontent\s*=\s*["''](?<value>.*?)["''][^>]*\bname\s*=\s*["'']description["''][^>]*>'
    )
    if ([string]::IsNullOrWhiteSpace($description)) {
        $description = "$title 的交互式多页面知识库。"
    }

    $tags = New-Object System.Collections.Generic.List[string]
    $type = [string](Get-ManifestValue -Manifest $manifest -PropertyName 'type')
    $typeLabels = @{
        'single-subject' = '单主题'
        'multi-branch' = '多分支'
        'comparison' = '对比'
    }
    if ($typeLabels.ContainsKey($type)) {
        $tags.Add($typeLabels[$type])
    }

    $depth = [string](Get-ManifestValue -Manifest $manifest -PropertyName 'depthLevel')
    if (-not [string]::IsNullOrWhiteSpace($depth)) {
        $tags.Add($depth)
    }

    $pageCount = $null
    if ($null -ne $manifest -and $manifest.PSObject.Properties.Name -contains 'qualitySummary' -and $null -ne $manifest.qualitySummary) {
        if ($manifest.qualitySummary.PSObject.Properties.Name -contains 'totalPages') {
            $pageCount = $manifest.qualitySummary.totalPages
        }
    }
    if ($null -eq $pageCount -and $null -ne $manifest -and $manifest.PSObject.Properties.Name -contains 'pages') {
        $pageCount = @($manifest.pages).Count
    }
    if ($null -ne $pageCount -and [int]$pageCount -gt 0) {
        $tags.Add("$pageCount 页")
    }
    if ($tags.Count -eq 0) {
        $tags.Add('多页面')
    }

    $createdAt = [string](Get-ManifestValue -Manifest $manifest -PropertyName 'createdAt')

    return [pscustomobject]@{
        Slug = $Directory.Name
        EntryName = $entryName
        Title = $title
        Description = $description
        Tags = @($tags)
        CreatedAt = $createdAt
    }
}

function ConvertTo-CardMarkup {
    param(
        [object]$Record,
        [string]$HrefPrefix
    )

    $slug = [Uri]::EscapeDataString($Record.Slug)
    $entryName = [Uri]::EscapeDataString($Record.EntryName)
    $href = [System.Net.WebUtility]::HtmlEncode("$HrefPrefix$slug/$entryName")
    $title = [System.Net.WebUtility]::HtmlEncode($Record.Title)
    $description = [System.Net.WebUtility]::HtmlEncode($Record.Description)
    $tagMarkup = ($Record.Tags | ForEach-Object {
        '<span class="tag">' + [System.Net.WebUtility]::HtmlEncode($_) + '</span>'
    }) -join ''

    return @"
        <a class="kb-item" href="$href">
          <div class="kb-copy">
            <h3>$title</h3>
            <p>$description</p>
            <div class="tags">$tagMarkup</div>
          </div>
          <span class="availability ready">可读</span>
        </a>
"@.TrimEnd()
}

function Update-IndexFile {
    param(
        [string]$Path,
        [string]$HrefPrefix,
        [object[]]$Records
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw "Index file not found: $Path"
    }

    $content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    if (-not $content.Contains($listStart) -or -not $content.Contains($listEnd)) {
        throw "Managed list markers are missing in: $Path"
    }
    if ($content -notmatch '<strong\s+data-kb-count>\d+</strong>') {
        throw "Managed knowledge-base count is missing in: $Path"
    }

    $cards = ($Records | ForEach-Object {
        ConvertTo-CardMarkup -Record $_ -HrefPrefix $HrefPrefix
    }) -join "`n"
    $replacement = "$listStart`n$cards`n        $listEnd"
    $pattern = [regex]::Escape($listStart) + '.*?' + [regex]::Escape($listEnd)
    $updated = [regex]::Replace(
        $content,
        $pattern,
        [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $replacement },
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )
    $updated = [regex]::Replace(
        $updated,
        '<strong\s+data-kb-count>\d+</strong>',
        '<strong data-kb-count>' + $Records.Count + '</strong>'
    )

    if ($updated -cne $content) {
        $relativePath = $Path.Substring($repoRoot.Length + 1)
        if ($Check) {
            Write-Host "OUTDATED: $relativePath"
            $script:needsUpdate = $true
        }
        else {
            $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
            [System.IO.File]::WriteAllText($Path, $updated, $utf8NoBom)
            Write-Host "UPDATED: $relativePath"
        }
    }
    else {
        Write-Host "CURRENT: $($Path.Substring($repoRoot.Length + 1))"
    }
}

$records = @(Get-ChildItem -LiteralPath $knowledgeRoot -Directory | ForEach-Object {
    Get-KnowledgeBaseRecord -Directory $_
} | Where-Object { $null -ne $_ } | Sort-Object @{ Expression = 'CreatedAt'; Descending = $true }, Slug)

if ($records.Count -eq 0) {
    Write-Warning 'No publishable knowledge bases were found.'
}

Update-IndexFile -Path (Join-Path $repoRoot 'index.html') -HrefPrefix 'knowledge-bases/' -Records $records
Update-IndexFile -Path (Join-Path $knowledgeRoot 'index.html') -HrefPrefix '' -Records $records

Write-Host "Knowledge bases indexed: $($records.Count)"
if ($Check -and $script:needsUpdate) {
    exit 1
}
