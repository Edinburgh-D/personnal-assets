[CmdletBinding()]
param(
    [switch]$Preflight,
    [string]$TaskName = 'Codex Knowledge Base Publisher'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path -LiteralPath (Split-Path -Parent $PSScriptRoot)).Path
$automationRoot = Join-Path $repoRoot 'automation'
$resultsRoot = Join-Path $repoRoot 'test-results\knowledge-automation'
$worktreeRoot = Join-Path (Split-Path -Parent $repoRoot) 'kb-automation-worktrees'
$poolTool = Join-Path $automationRoot 'topic-pool.js'
$authorTemplate = Join-Path $automationRoot 'knowledge-task-prompt.md'
$reviewTemplate = Join-Path $automationRoot 'knowledge-review-prompt.md'
$taskRunner = 'C:\Users\dang\.codex\skills\codex-task-runner\scripts\run-codex-task.js'
$validator = 'C:\Users\dang\.codex\skills\knowledge-base-generator\scripts\validate-output.ps1'
$remoteUrl = 'https://github.com/Edinburgh-D/personnal-assets.git'
$siteRoot = 'https://personnal-assets.pages.dev'
$runStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$runRoot = Join-Path $resultsRoot $runStamp
$logPath = Join-Path $runRoot 'run.log'
$worktree = Join-Path $worktreeRoot $runStamp
$mutex = New-Object System.Threading.Mutex($false, 'Local\CodexKnowledgeBasePublisher')
$lockTaken = $false
$worktreeCreated = $false
$published = $false

function Write-Step([string]$Message) {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(ValueFromRemainingArguments)][string[]]$Arguments
    )
    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed ($LASTEXITCODE): $FilePath $($Arguments -join ' ')"
    }
}

function Get-ChangedPaths([string]$Path) {
    $lines = & git -C $Path status --porcelain=v1 --untracked-files=all
    if ($LASTEXITCODE -ne 0) { throw 'Could not inspect Git status.' }
    return @($lines | Where-Object { $_.Length -ge 4 } | ForEach-Object { $_.Substring(3).Replace('\', '/') })
}

function Assert-AllowedChanges {
    param(
        [string]$Path,
        [string]$KnowledgeSlug,
        [switch]$AllowTopicPool
    )
    $allowedExact = @('index.html', 'knowledge-bases/index.html')
    if ($AllowTopicPool) { $allowedExact += 'automation/topic-pool.json' }
    $prefix = "knowledge-bases/$KnowledgeSlug/"
    $unexpected = @(Get-ChangedPaths -Path $Path | Where-Object {
        $_ -notin $allowedExact -and -not $_.StartsWith($prefix, [System.StringComparison]::Ordinal)
    })
    if ($unexpected.Count -gt 0) {
        throw "Unexpected changes: $($unexpected -join ', ')"
    }
}

New-Item -ItemType Directory -Path $runRoot -Force | Out-Null
Start-Transcript -LiteralPath $logPath -Force | Out-Null

try {
    $lockTaken = $mutex.WaitOne(0)
    if (-not $lockTaken) {
        Write-Step 'Another knowledge-base run is active; exiting without overlap.'
        exit 0
    }

    Write-Step 'Checking prerequisites.'
    foreach ($file in @($poolTool, $authorTemplate, $reviewTemplate, $taskRunner, $validator)) {
        if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { throw "Required file missing: $file" }
    }
    foreach ($command in @('git', 'node', 'codex.cmd')) {
        if (-not (Get-Command $command -ErrorAction SilentlyContinue)) { throw "Required command missing: $command" }
    }

    $selectionPath = Join-Path $runRoot 'selected-topic.json'
    & node $poolTool select --pool (Join-Path $automationRoot 'topic-pool.json') --output $selectionPath
    if ($LASTEXITCODE -ne 0) { throw 'Topic selection failed.' }
    $selectionJson = Get-Content -LiteralPath $selectionPath -Raw -Encoding UTF8
    $topic = $selectionJson | ConvertFrom-Json
    Write-Step "Selected topic: $($topic.name) [$($topic.domain), $($topic.selectionMode)]"

    if ($Preflight) {
        Write-Step 'Preflight passed; no Codex run or repository change was performed.'
        exit 0
    }

    Write-Step 'Fetching the production branch.'
    Invoke-Checked git -C $repoRoot fetch $remoteUrl 'main:refs/remotes/origin/main'
    New-Item -ItemType Directory -Path $worktreeRoot -Force | Out-Null
    Invoke-Checked git -C $repoRoot worktree add --detach $worktree 'origin/main'
    $worktreeCreated = $true

    $beforeDirectories = @(Get-ChildItem -LiteralPath (Join-Path $worktree 'knowledge-bases') -Directory | ForEach-Object Name)
    $related = if (@($topic.relatedTo).Count -gt 0) { @($topic.relatedTo) -join ', ' } else { 'No specific related library.' }
    $authorPrompt = Get-Content -LiteralPath $authorTemplate -Raw -Encoding UTF8
    $authorPrompt = $authorPrompt.Replace('{{TOPIC_NAME}}', [string]$topic.name)
    $authorPrompt = $authorPrompt.Replace('{{TOPIC_DOMAIN}}', [string]$topic.domain)
    $authorPrompt = $authorPrompt.Replace('{{TOPIC_TYPE}}', [string]$topic.type)
    $authorPrompt = $authorPrompt.Replace('{{COLOR_SCHEME}}', [string]$topic.colorScheme)
    $authorPrompt = $authorPrompt.Replace('{{RELATED_LIBRARIES}}', $related)
    $authorPromptPath = Join-Path $runRoot 'author-prompt.md'
    [System.IO.File]::WriteAllText($authorPromptPath, $authorPrompt, (New-Object System.Text.UTF8Encoding($false)))

    Write-Step 'Starting the author Codex run.'
    & node $taskRunner --prompt-file $authorPromptPath --out-dir (Join-Path $runRoot 'codex-runs') --slug 'author' --sandbox 'workspace-write' --timeout-ms '10800000' --cd $worktree
    if ($LASTEXITCODE -ne 0) { throw "Author Codex run failed with exit code $LASTEXITCODE." }

    $afterDirectories = @(Get-ChildItem -LiteralPath (Join-Path $worktree 'knowledge-bases') -Directory | ForEach-Object Name)
    $newDirectories = @($afterDirectories | Where-Object { $_ -notin $beforeDirectories })
    if ($newDirectories.Count -ne 1) {
        throw "Expected exactly one new knowledge-base directory, found $($newDirectories.Count): $($newDirectories -join ', ')"
    }
    $knowledgeSlug = $newDirectories[0]
    $knowledgePath = Join-Path $worktree "knowledge-bases\$knowledgeSlug"
    Assert-AllowedChanges -Path $worktree -KnowledgeSlug $knowledgeSlug

    $reviewPrompt = Get-Content -LiteralPath $reviewTemplate -Raw -Encoding UTF8
    $reviewPrompt = $reviewPrompt.Replace('{{KNOWLEDGE_PATH}}', "knowledge-bases/$knowledgeSlug")
    $reviewPrompt = $reviewPrompt.Replace('{{TOPIC_NAME}}', [string]$topic.name)
    $reviewPromptPath = Join-Path $runRoot 'review-prompt.md'
    [System.IO.File]::WriteAllText($reviewPromptPath, $reviewPrompt, (New-Object System.Text.UTF8Encoding($false)))

    Write-Step 'Starting the independent reviewer Codex run.'
    & node $taskRunner --prompt-file $reviewPromptPath --out-dir (Join-Path $runRoot 'codex-runs') --slug 'reviewer' --sandbox 'workspace-write' --timeout-ms '7200000' --cd $worktree
    if ($LASTEXITCODE -ne 0) { throw "Reviewer Codex run failed with exit code $LASTEXITCODE." }
    Assert-AllowedChanges -Path $worktree -KnowledgeSlug $knowledgeSlug

    Write-Step 'Running hard publication gates.'
    & $validator -Path $knowledgePath
    if ($LASTEXITCODE -ne 0) { throw 'Knowledge-base output validation failed.' }
    & (Join-Path $worktree 'scripts\update-knowledge-home-links.ps1') -RepositoryRoot $worktree -Check
    if ($LASTEXITCODE -ne 0) { throw 'Knowledge-base home-link validation failed.' }
    & (Join-Path $worktree 'scripts\update-knowledge-index.ps1') -RepositoryRoot $worktree
    if ($LASTEXITCODE -ne 0) { throw 'Knowledge-base index update failed.' }
    & (Join-Path $worktree 'scripts\update-knowledge-index.ps1') -RepositoryRoot $worktree -Check
    if ($LASTEXITCODE -ne 0) { throw 'Knowledge-base index validation failed.' }
    Assert-AllowedChanges -Path $worktree -KnowledgeSlug $knowledgeSlug

    $manifestPath = Join-Path $knowledgePath 'content-manifest.json'
    $manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if ([string]::IsNullOrWhiteSpace([string]$manifest.entry)) { throw 'Manifest entry is missing.' }
    $entryRelative = "knowledge-bases/$knowledgeSlug/$($manifest.entry)"

    Write-Step 'Recording the successful topic in the pool.'
    & node (Join-Path $worktree 'automation\topic-pool.js') complete `
        --pool (Join-Path $worktree 'automation\topic-pool.json') `
        --topic ([string]$topic.name) `
        --domain ([string]$topic.domain) `
        --slug $knowledgeSlug `
        --entry $entryRelative `
        --generated-at (Get-Date -Format 'yyyy-MM-dd')
    if ($LASTEXITCODE -ne 0) { throw 'Could not update the topic pool.' }
    Assert-AllowedChanges -Path $worktree -KnowledgeSlug $knowledgeSlug -AllowTopicPool

    Write-Step 'Staging and committing validated output.'
    Invoke-Checked git -C $worktree add -- "knowledge-bases/$knowledgeSlug" 'index.html' 'knowledge-bases/index.html' 'automation/topic-pool.json'
    Invoke-Checked git -C $worktree diff --cached --check
    Invoke-Checked git -C $worktree commit -m "feat(kb): add $($topic.name) knowledge base"
    Invoke-Checked git -C $worktree push $remoteUrl 'HEAD:main'
    $published = $true

    $liveUrl = "$siteRoot/$entryRelative"
    Write-Step "Waiting for Cloudflare Pages: $liveUrl"
    $deadline = (Get-Date).AddMinutes(15)
    $verified = $false
    do {
        try {
            $response = Invoke-WebRequest -Uri $liveUrl -UseBasicParsing -TimeoutSec 30
            if ($response.StatusCode -eq 200 -and $response.Content -match [regex]::Escape([string]$topic.name)) {
                $verified = $true
                break
            }
        }
        catch {
            Write-Step "Deployment not ready: $($_.Exception.Message)"
        }
        Start-Sleep -Seconds 20
    } while ((Get-Date) -lt $deadline)
    if (-not $verified) { throw "Cloudflare verification timed out: $liveUrl" }

    [pscustomobject]@{
        topic = $topic.name
        domain = $topic.domain
        slug = $knowledgeSlug
        entry = $entryRelative
        liveUrl = $liveUrl
        commit = (& git -C $worktree rev-parse HEAD).Trim()
        completedAt = (Get-Date).ToString('o')
    } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $runRoot 'success.json') -Encoding UTF8

    Write-Step "Published and verified: $liveUrl"
}
catch {
    Write-Error $_
    if ($worktreeCreated -and -not $published) {
        Write-Step "Failed worktree retained for inspection: $worktree"
    }
    exit 1
}
finally {
    if ($lockTaken) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
    try { Stop-Transcript | Out-Null } catch { }
    if ($worktreeCreated -and $published) {
        try { & git -C $repoRoot worktree remove --force $worktree | Out-Null } catch { }
        try { & git -C $repoRoot worktree prune | Out-Null } catch { }
    }
}
