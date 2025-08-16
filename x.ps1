# recreate-from-text.ps1
$inputFile = "D:\projects web\Private me\Server\z notes\new\chat 1 part1.txt"
$baseOutput = "D:\projects web\Private me\x server"

# Ensure base folder exists
if (-not (Test-Path $baseOutput)) {
    New-Item -Path $baseOutput -ItemType Directory | Out-Null
}

$lines = Get-Content -Path $inputFile -Encoding UTF8
$currentFile = ""
$contentBuffer = @()

foreach ($line in $lines) {
    if ($line -match '^// filepath: (.+)') {
        # Write previous file if exists
        if ($currentFile -ne "") {
            $fullPath = Join-Path $baseOutput $currentFile
            $folder = Split-Path $fullPath -Parent
            if (-not (Test-Path $folder)) { New-Item -Path $folder -ItemType Directory | Out-Null }
            $contentBuffer | Out-File -FilePath $fullPath -Encoding UTF8
        }

        # Start new file
        $currentFile = $Matches[1]
        $contentBuffer = @()
    }
    else {
        $contentBuffer += $line
    }
}

# Write last file
if ($currentFile -ne "") {
    $fullPath = Join-Path $baseOutput $currentFile
    $folder = Split-Path $fullPath -Parent
    if (-not (Test-Path $folder)) { New-Item -Path $folder -ItemType Directory | Out-Null }
    $contentBuffer | Out-File -FilePath $fullPath -Encoding UTF8
}




#powershell -ExecutionPolicy Bypass -File .\x.ps1
