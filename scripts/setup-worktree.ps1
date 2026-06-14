<#
.SYNOPSIS
    Configures isolated dev ports for a git worktree.
.DESCRIPTION
    Generates the two gitignored local config files (environment.local.ts and
    local.settings.json) with port offsets so multiple worktrees can run
    simultaneously without port conflicts.
.PARAMETER Offset
    Port offset from the defaults (4200/7071). Default is 1.
    Offset 1 → Angular 4201 / Functions 7072
    Offset 2 → Angular 4202 / Functions 7073
.EXAMPLE
    .\scripts\setup-worktree.ps1 -Offset 1
#>
param([int]$Offset = 1)

$root = Split-Path -Parent $PSScriptRoot
$angularPort = 4200 + $Offset
$functionsPort = 7071 + $Offset

# --- environment.local.ts ---
$envFile = Join-Path $root "hoops.ui/src/environments/environment.local.ts"
@"
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001',
  functionsUrl: 'http://localhost:$functionsPort',
  environment: 'local',
  showGameAdmin: true,
  securityEnabled: false,
  featureFlagPath: '/assets/feature-flags.local.json',
};
"@ | Set-Content $envFile -Encoding utf8
Write-Host "  Wrote $envFile (functionsUrl → port $functionsPort)"

# --- local.settings.json ---
$exampleFile = Join-Path $root "src/Hoops.Functions/local.settings.json.example"
$settingsFile = Join-Path $root "src/Hoops.Functions/local.settings.json"

if (-not (Test-Path $settingsFile)) {
    if (Test-Path $exampleFile) {
        Copy-Item $exampleFile $settingsFile
        Write-Host "  Copied example → $settingsFile"
    } else {
        Write-Error "Cannot find $exampleFile. Run from repo root."
        exit 1
    }
}

$settings = Get-Content $settingsFile -Raw | ConvertFrom-Json
$settings.Host = [pscustomobject]@{
    LocalHttpPort   = $functionsPort
    CORS            = "http://localhost:$angularPort,https://localhost:$angularPort"
    CORSCredentials = $true
}
$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsFile -Encoding utf8
Write-Host "  Updated $settingsFile (LocalHttpPort → $functionsPort, CORS → $angularPort)"

Write-Host ""
Write-Host "Done. Angular=$angularPort  Functions=$functionsPort"
Write-Host "In VS Code: Terminal > Run Task > 'Start App (Worktree $Offset)'"
