[CmdletBinding()]
param(
    [string]$TaskName = 'Codex Knowledge Base Publisher'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path -LiteralPath (Split-Path -Parent $PSScriptRoot)).Path
$runner = Join-Path $repoRoot 'automation\run-knowledge-task.ps1'
if (-not (Test-Path -LiteralPath $runner -PathType Leaf)) {
    throw "Runner not found: $runner"
}

$powershell = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$arguments = "-NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$runner`""
$action = New-ScheduledTaskAction -Execute $powershell -Argument $arguments -WorkingDirectory $repoRoot
$triggers = @(
    New-ScheduledTaskTrigger -Daily -At '02:00'
    New-ScheduledTaskTrigger -Daily -At '07:00'
    New-ScheduledTaskTrigger -Daily -At '11:00'
    New-ScheduledTaskTrigger -Daily -At '16:00'
    New-ScheduledTaskTrigger -Daily -At '22:00'
)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet `
    -MultipleInstances IgnoreNew `
    -StartWhenAvailable `
    -WakeToRun `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 4)

$task = New-ScheduledTask -Action $action -Trigger $triggers -Principal $principal -Settings $settings -Description 'Randomly generate, validate, publish, and verify one knowledge base through Codex and Cloudflare Pages.'
Register-ScheduledTask -TaskName $TaskName -InputObject $task -Force | Out-Null

$registered = Get-ScheduledTask -TaskName $TaskName
$info = Get-ScheduledTaskInfo -TaskName $TaskName
[pscustomobject]@{
    TaskName = $registered.TaskName
    State = $registered.State
    TriggerTimes = ($registered.Triggers | ForEach-Object { ([datetime]$_.StartBoundary).ToString('HH:mm') }) -join ', '
    NextRunTime = $info.NextRunTime
    UserId = $registered.Principal.UserId
    LogonType = $registered.Principal.LogonType
    Runner = $runner
} | Format-List
