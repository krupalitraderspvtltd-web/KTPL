$files = @(
    "de.json",
    "es.json",
    "fr.json",
    "id.json",
    "it.json",
    "ja.json",
    "ko.json",
    "nl.json",
    "pt.json",
    "ru.json",
    "th.json",
    "tr.json",
    "vi.json",
    "zh-CN.json",
    "zh-TW.json"
)

foreach ($name in $files) {

    $path = Join-Path ".\messages" $name

    if (!(Test-Path $path)) {
        Write-Host "MISSING: $name" -ForegroundColor Red
        continue
    }

    try {
        # Read raw bytes
        $bytes = [System.IO.File]::ReadAllBytes($path)

        # Decode as UTF-8
        $text = [System.Text.Encoding]::UTF8.GetString($bytes)

        # Remove UTF-8 BOM if present
        $text = $text.TrimStart([char]0xFEFF)

        # Remove accidental leading/trailing whitespace
        $text = $text.Trim()

        # Validate JSON
        $null = $text | ConvertFrom-Json

        # Rewrite as clean UTF-8 without BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText(
            $path,
            $text,
            $utf8NoBom
        )

        # Final Node validation
        node -e "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'))" $path

        if ($LASTEXITCODE -eq 0) {
            Write-Host "FIXED: $name" -ForegroundColor Green
        }
        else {
            Write-Host "FAILED NODE VALIDATION: $name" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "INVALID JSON: $name" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
}