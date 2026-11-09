[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][ValidatePattern('^[a-z0-9]+(?:-[a-z0-9]+)*$')][string]$Id,
    [Parameter(Mandatory=$true)][string]$Name,
    [string]$RepositoryRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($RepositoryRoot)) { $RepositoryRoot = Split-Path -Parent $scriptDirectory }
$repoRoot = (Resolve-Path -LiteralPath $RepositoryRoot).Path
$roadmapPath = Join-Path $repoRoot 'data\discipline-roadmap.json'
$roadmap = Get-Content -LiteralPath $roadmapPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($Id -eq $roadmap.current_id -or @($roadmap.disciplines | Where-Object id -eq $Id).Count -gt 0 -or @($roadmap.queue | Where-Object id -eq $Id).Count -gt 0) { throw "Discipline id already exists: $Id" }
$queue = @($roadmap.queue) + [pscustomobject]@{ id=$Id; name=$Name; state='approved' }
$roadmap.queue = @($queue)
[IO.File]::WriteAllText($roadmapPath, (($roadmap | ConvertTo-Json -Depth 12) + "`n"), [Text.UTF8Encoding]::new($false))
Write-Host "Queued user-approved discipline: $Name [$Id]"
