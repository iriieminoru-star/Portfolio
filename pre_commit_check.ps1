# =========================================================
# Git Commit Pre-Check + Auto Report
# =========================================================

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportDir = "C:\temp\git_report_$timestamp"

New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

$summaryFile = "$reportDir\summary.txt"
$statusFile = "$reportDir\git_status.txt"
$diffFile = "$reportDir\git_diff.txt"
$dumpFile = "$reportDir\source_dump.txt"

# =========================================================
# Exclude Settings
# =========================================================

$excludePatterns = @(
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "out",
    "coverage",
    ".vscode",
    ".idea",

    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",

    "database.sqlite",
    ".log",

    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",

    ".mp4",
    ".mp3",
    ".zip",
    ".pdf"
    ".backendanswers.json"
    "AGENTS.md"
    "checklist.txt"
    "CLAUDE.md"
    "eslint.config.mjs"
    "localhost-top.png"
)

# =========================================================
# Summary
# =========================================================

"========================================" | Out-File $summaryFile -Encoding utf8
"Git Pre-Commit Report" | Add-Content $summaryFile
"========================================" | Add-Content $summaryFile
"" | Add-Content $summaryFile
"Date: $(Get-Date)" | Add-Content $summaryFile
"Project: $(Get-Location)" | Add-Content $summaryFile
"" | Add-Content $summaryFile

# =========================================================
# Git Status
# =========================================================

Write-Host ""
Write-Host "=== Git Status ==="

git status | Tee-Object -FilePath $statusFile

# =========================================================
# Git Diff
# =========================================================

Write-Host ""
Write-Host "=== Git Diff ==="

git diff | Out-File $diffFile -Encoding utf8

# =========================================================
# Changed Files
# =========================================================

Write-Host ""
Write-Host "=== Changed Files ==="

$changedFiles = @(git diff --name-only)

if ($changedFiles.Count -eq 0) {

    Write-Host "No changed files"

}
else {

    foreach ($file in $changedFiles) {

        Write-Host $file

    }

}

# =========================================================
# Source Dump
# =========================================================

Write-Host ""
Write-Host "=== Source Dump ==="

"" | Out-File $dumpFile -Encoding utf8

$files = Get-ChildItem -Path . -Recurse -File

foreach ($file in $files) {

    $path = $file.FullName

    $skip = $false

    # フォルダ除外
    $excludeDirs = @(
        "node_modules",
        ".git",
        ".next",
        "dist",
        "build",
        "out",
        "coverage",
        ".vscode",
        ".idea"
    )

    foreach ($dir in $excludeDirs) {

        if ($path -like "*\$dir\*") {

            $skip = $true
            break

        }

    }

    # 拡張子除外
    $excludeExtensions = @(
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".webp",
        ".ico",
        ".mp4",
        ".mp3",
        ".zip",
        ".pdf",
        ".sqlite",
        ".log"
    )

    if ($excludeExtensions -contains $file.Extension.ToLower()) {

        $skip = $true

    }

    # ファイル名除外
    $excludeFiles = @(
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml"
    )

    if ($excludeFiles -contains $file.Name) {

        $skip = $true

    }

    if ($skip) {

        continue

    }

    Add-Content $dumpFile ""
    Add-Content $dumpFile "=================================================="
    Add-Content $dumpFile "FILE: $path"
    Add-Content $dumpFile "=================================================="

    try {

      if ($file.Length -gt 5MB) {

          Add-Content $dumpFile "[SKIPPED LARGE FILE]"
      }
      else {

          $content = Get-Content $path -Raw -ErrorAction Stop
          Add-Content $dumpFile $content

      }

    }
    catch {

        Add-Content $dumpFile "[ERROR READING FILE]"

    }

    Add-Content $dumpFile "`n"

}

# =========================================================
# Finish
# =========================================================

Write-Host ""
Write-Host "========================================"
Write-Host "FINISHED"
Write-Host "========================================"

Write-Host ""
Write-Host "Report Directory:"
Write-Host $reportDir

Write-Host ""
Write-Host "Generated Files:"
Write-Host " - summary.txt"
Write-Host " - git_status.txt"
Write-Host " - git_diff.txt"
Write-Host " - source_dump.txt"