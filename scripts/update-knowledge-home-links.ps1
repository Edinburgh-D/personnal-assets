[CmdletBinding()]
param(
    [string]$RepositoryRoot,
    [switch]$Check
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) {
    $scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepositoryRoot = Split-Path -Parent $scriptDirectory
}

$repoRoot = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$knowledgeRoot = Join-Path $repoRoot 'knowledge-bases'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$missing = New-Object System.Collections.Generic.List[string]
$updatedCount = 0

if (-not (Test-Path -LiteralPath $knowledgeRoot -PathType Container)) {
    throw "Knowledge-base directory not found: $knowledgeRoot"
}

function Add-SiteHomeLink {
    param(
        [string]$Content,
        [string]$RelativePath
    )

    if ($Check) {
        $homeLinks = [regex]::Matches($Content, '(?is)<a\b[^>]*\bdata-site-home\b[^>]*>.*?</a>')
        $validHomeLinks = @($homeLinks | Where-Object {
            $_.Value -match '(?is)\bhref\s*=\s*["'']\.\./\.\./index\.html["'']'
        })
        if ($homeLinks.Count -ne 1 -or $validHomeLinks.Count -ne 1) {
            $missing.Add($RelativePath)
        }
        return $Content
    }

    $homeLinks = [regex]::Matches($Content, '(?is)<a\b[^>]*\bdata-site-home\b[^>]*>.*?</a>')
    $validHomeLinks = @($homeLinks | Where-Object {
        $_.Value -match '(?is)\bhref\s*=\s*["'']\.\./\.\./index\.html["'']'
    })
    $mastheadPresent = $Content -match '(?is)<div\s+class=["'']nav-menu-btn["'']\s*>'
    $archiveLinks = [regex]::Matches($Content, '(?is)<a\b[^>]*\bclass=["''][^"'']*archive-home-link[^"'']*["''][^>]*>.*?</a>')
    if ($homeLinks.Count -eq 1 -and $validHomeLinks.Count -eq 1 -and
        (-not $mastheadPresent -or $archiveLinks.Count -eq 1)) {
        return $Content
    }

    $Content = [regex]::Replace(
        $Content,
        '(?is)\s*<a\b[^>]*\bdata-site-home\b[^>]*>.*?</a>',
        ''
    )
    $Content = [regex]::Replace(
        $Content,
        '(?is)\s*<a\b[^>]*\bclass=["''][^"'']*archive-home-link[^"'']*["''][^>]*>.*?</a>',
        ''
    )

    $mastheadPattern = '(?is)(<div\s+class=["'']nav-menu-btn["'']\s*>)'
    if ([regex]::IsMatch($Content, $mastheadPattern)) {
        $links = @'
$1
        <a href="../../index.html" class="site-home-link" data-site-home>Personal Assets</a>
        <a href="main.html" class="archive-home-link">History Archive</a>
'@
        $mastheadRegex = New-Object System.Text.RegularExpressions.Regex($mastheadPattern)
        return $mastheadRegex.Replace($Content, $links.TrimEnd(), 1)
    }

    $navGroupPattern = '(?is)(<div\s+class=["'']nav-bar-group["'']\s*>)'
    if ([regex]::IsMatch($Content, $navGroupPattern)) {
        $link = '$1' + "`r`n            " + '<a href="../../index.html" class="nav-btn site-home-link" data-site-home>Personal Assets</a>'
        $navGroupRegex = New-Object System.Text.RegularExpressions.Regex($navGroupPattern)
        return $navGroupRegex.Replace($Content, $link, 1)
    }

    $bodyPattern = '(?is)(<body\b[^>]*>)'
    if ([regex]::IsMatch($Content, $bodyPattern)) {
        $link = '$1' + "`r`n  " + '<a href="../../index.html" class="site-home-link" data-site-home>Personal Assets Home</a>'
        $bodyRegex = New-Object System.Text.RegularExpressions.Regex($bodyPattern)
        return $bodyRegex.Replace($Content, $link, 1)
    }

    throw "Could not find a supported navigation or body element in: $RelativePath"
}

$publishableDirectories = @(Get-ChildItem -LiteralPath $knowledgeRoot -Directory | Where-Object {
    (Test-Path -LiteralPath (Join-Path $_.FullName 'main.html') -PathType Leaf) -or
    (Test-Path -LiteralPath (Join-Path $_.FullName 'index.html') -PathType Leaf)
})

foreach ($directory in $publishableDirectories) {
    foreach ($htmlFile in Get-ChildItem -LiteralPath $directory.FullName -File -Filter '*.html') {
        $relativePath = $htmlFile.FullName.Substring($repoRoot.Length + 1).Replace('\', '/')
        $content = Get-Content -LiteralPath $htmlFile.FullName -Raw -Encoding UTF8
        $updated = Add-SiteHomeLink -Content $content -RelativePath $relativePath

        if (-not $Check -and $updated -cne $content) {
            [System.IO.File]::WriteAllText($htmlFile.FullName, $updated, $utf8NoBom)
            Write-Host "UPDATED: $relativePath"
            $updatedCount += 1
        }
    }
}

if ($Check) {
    if ($missing.Count -gt 0) {
        foreach ($path in $missing) {
            Write-Host "MISSING HOME LINK: $path"
        }
        Write-Error "Every knowledge-base HTML page must contain exactly one data-site-home link to ../../index.html."
    }

    Write-Host "Knowledge-base home links verified."
}
else {
    Write-Host "Knowledge-base pages updated: $updatedCount"
}
