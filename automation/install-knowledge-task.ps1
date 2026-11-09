[CmdletBinding()]
param(
    [string]$DisciplineId = 'semiconductor',
    [string]$TaskPrefix = 'Codex Discipline',
    [string]$LegacyTaskName = 'Codex Knowledge Base Publisher'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path -LiteralPath (Split-Path -Parent $PSScriptRoot)).Path
$runner = Join-Path $repoRoot 'automation\run-knowledge-task.ps1'
if (-not (Test-Path -LiteralPath $runner -PathType Leaf)) { throw "Runner not found: $runner" }

$powershell = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet `
    -MultipleInstances IgnoreNew `
    -StartWhenAvailable `
    -WakeToRun `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 4)

$definitions = @(
    [pscustomobject]@{ Suffix='01 Gatekeeper'; Time='07:00'; Role='gatekeeper'; Description='Claim validation and repair tasks from the discipline task ledger.' },
    [pscustomobject]@{ Suffix='02 Researcher'; Time='07:15'; Role='researcher'; Description='Claim source-verification tasks from the discipline task ledger.' },
    [pscustomobject]@{ Suffix='03 Architect'; Time='07:30'; Role='architect'; Description='Claim coverage and knowledge-tree expansion tasks from the discipline task ledger.' },
    [pscustomobject]@{ Suffix='04 Auditor'; Time='07:45'; Role='auditor'; Description='Claim freshness checks and completion audits from the discipline task ledger.' },
    [pscustomobject]@{ Suffix='05 Transition'; Time='08:00'; Role='transition'; Description='Claim next-discipline bootstrap tasks only after current completion gates unlock them.' }
)

if (Get-ScheduledTask -TaskName $LegacyTaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $LegacyTaskName -Confirm:$false
}

$installed = foreach ($definition in $definitions) {
    $taskName = "$TaskPrefix $($definition.Suffix)"
    $arguments = "-NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$runner`" -WorkerRole `"$($definition.Role)`""
    $action = New-ScheduledTaskAction -Execute $powershell -Argument $arguments -WorkingDirectory $repoRoot
    $timeParts = $definition.Time.Split(':')
    $triggerAt = (Get-Date).Date.AddHours([int]$timeParts[0]).AddMinutes([int]$timeParts[1])
    $trigger = New-ScheduledTaskTrigger -Daily -At $triggerAt
    $task = New-ScheduledTask -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description $definition.Description
    Register-ScheduledTask -TaskName $taskName -InputObject $task -Force | Out-Null
    $registered = Get-ScheduledTask -TaskName $taskName
    $info = Get-ScheduledTaskInfo -TaskName $taskName
    [pscustomobject]@{
        TaskName = $taskName
        Role = $definition.Role
        State = $registered.State
        Trigger = ([datetime]$registered.Triggers[0].StartBoundary).ToString('HH:mm')
        NextRunTime = $info.NextRunTime
    }
}

$installed | Format-Table -AutoSize
