$ErrorActionPreference = "Stop"

$sourceFile = ".\messages\en.json"
$messagesDir = ".\messages"
$apiUrl = "https://api.openai.com/v1/responses"
$model = "gpt-5.6-luna"

if (-not $env:OPENAI_API_KEY) {
    Write-Host "ERROR: OPENAI_API_KEY is not set." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $sourceFile)) {
    Write-Host "ERROR: en.json not found." -ForegroundColor Red
    exit 1
}

# ============================================================
# REMAINING LANGUAGES
# ASCII ONLY - avoids PowerShell encoding problems
# ============================================================

$languages = @(
    @{ Code="af"; Name="Afrikaans" },
    @{ Code="sq"; Name="Albanian" },
    @{ Code="am"; Name="Amharic" },
    @{ Code="hy"; Name="Armenian" },
    @{ Code="az"; Name="Azerbaijani" },
    @{ Code="be"; Name="Belarusian" },
    @{ Code="bn"; Name="Bengali" },
    @{ Code="bs"; Name="Bosnian" },

    @{ Code="bg"; Name="Bulgarian" },
    @{ Code="ca"; Name="Catalan" },
    @{ Code="hr"; Name="Croatian" },
    @{ Code="cs"; Name="Czech" },
    @{ Code="da"; Name="Danish" },
    @{ Code="et"; Name="Estonian" },
    @{ Code="fi"; Name="Finnish" },
    @{ Code="ka"; Name="Georgian" },

    @{ Code="el"; Name="Greek" },
    @{ Code="ht"; Name="Haitian Creole" },
    @{ Code="he"; Name="Hebrew" },
    @{ Code="hu"; Name="Hungarian" },
    @{ Code="is"; Name="Icelandic" },
    @{ Code="kk"; Name="Kazakh" },
    @{ Code="km"; Name="Khmer" },
    @{ Code="ky"; Name="Kyrgyz" },

    @{ Code="lo"; Name="Lao" },
    @{ Code="lv"; Name="Latvian" },
    @{ Code="lt"; Name="Lithuanian" },
    @{ Code="lb"; Name="Luxembourgish" },
    @{ Code="mk"; Name="Macedonian" },
    @{ Code="mg"; Name="Malagasy" },
    @{ Code="ms"; Name="Malay" },
    @{ Code="mt"; Name="Maltese" },

    @{ Code="mi"; Name="Maori" },
    @{ Code="ne"; Name="Nepali" },
    @{ Code="no"; Name="Norwegian" },
    @{ Code="fa"; Name="Persian" },
    @{ Code="fil"; Name="Filipino" },
    @{ Code="pl"; Name="Polish" },
    @{ Code="ro"; Name="Romanian" },
    @{ Code="si"; Name="Sinhala" },

    @{ Code="sk"; Name="Slovak" },
    @{ Code="sl"; Name="Slovenian" },
    @{ Code="so"; Name="Somali" },
    @{ Code="ga"; Name="Irish" },
    @{ Code="sr"; Name="Serbian" },
    @{ Code="sv"; Name="Swedish" },
    @{ Code="sw"; Name="Swahili" },
    @{ Code="ta"; Name="Tamil" },

    @{ Code="uk"; Name="Ukrainian" },
    @{ Code="ur"; Name="Urdu" },
    @{ Code="uz"; Name="Uzbek" },
    @{ Code="cy"; Name="Welsh" }
)

$batchSize = 8
$maxRetries = 3

# ============================================================
# READ SOURCE AS RAW TEXT
# ============================================================

$sourceText = [System.IO.File]::ReadAllText(
    (Resolve-Path $sourceFile).Path,
    [System.Text.Encoding]::UTF8
)

$sourceText = $sourceText.TrimStart([char]0xFEFF).Trim()

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "KRUPALI TRADERS MULTILINGUAL TRANSLATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Remaining languages: $($languages.Count)"
Write-Host "Batch size: $batchSize"
Write-Host ""

# ============================================================
# NODE JSON VALIDATOR
# ============================================================

function Test-JsonFile {
    param(
        [string]$Path
    )

    node -e @"
const fs = require('fs');

const file = process.argv[1];

try {
    const raw = fs.readFileSync(file, 'utf8');

    if (raw.charCodeAt(0) === 0xFEFF) {
        console.error('UTF-8 BOM detected');
        process.exit(2);
    }

    JSON.parse(raw);

    process.exit(0);
}
catch (e) {
    console.error(e.message);
    process.exit(1);
}
"@ "$Path"

    return ($LASTEXITCODE -eq 0)
}

# ============================================================
# GET RESPONSE TEXT
# ============================================================

function Get-ResponseText {
    param(
        $Response
    )

    if ($Response.output_text) {
        return [string]$Response.output_text
    }

    $parts = @()

    if ($Response.output) {
        foreach ($item in $Response.output) {
            if ($item.content) {
                foreach ($content in $item.content) {
                    if ($content.text) {
                        $parts += [string]$content.text
                    }
                }
            }
        }
    }

    if ($parts.Count -gt 0) {
        return ($parts -join "")
    }

    return ""
}

# ============================================================
# TRANSLATE ONE LANGUAGE
# ============================================================

function Translate-Language {
    param(
        [string]$Code,
        [string]$LanguageName
    )

    $outputFile = Join-Path $messagesDir "$Code.json"
    $tempFile = "$outputFile.tmp"

    Write-Host ""
    Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "Translating: $LanguageName [$Code]" -ForegroundColor Yellow

    for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {

        Write-Host "Attempt $attempt / $maxRetries ..."

        $prompt = @"
Translate the following complete localization JSON for Krupali Traders Private Limited into $LanguageName.

IMPORTANT:

- Return ONLY valid JSON.
- Do not return Markdown.
- Do not use code fences.
- Do not add explanations.
- Preserve the exact JSON structure.
- Preserve every property name exactly.
- Do not add properties.
- Do not remove properties.
- Do not rename properties.
- Translate only string values.
- Preserve placeholders exactly, including:
  {query}
  {title}
  {minutes}
  {category}
- Preserve URLs exactly.
- Preserve email addresses exactly.
- Preserve the company name "Krupali Traders Private Limited".
- Keep international import/export terminology professional and natural.
- Preserve proper nouns where appropriate.
- Do not translate JSON keys.
- Do not add comments.
- Do not add a UTF-8 BOM.
- Keys are case-sensitive.
- Preserve both keys when similar keys exist, such as:
  "abouttag"
  "aboutTag"
- The final response must be directly parseable by Node.js JSON.parse().

SOURCE JSON:

$sourceText
"@

        $bodyObject = @{
            model = $model
            input = $prompt
        }

        $bodyJson = $bodyObject | ConvertTo-Json -Depth 30 -Compress
        $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyJson)

        try {

            $response = Invoke-RestMethod `
                -Uri $apiUrl `
                -Method Post `
                -Headers @{
                    Authorization = "Bearer $env:OPENAI_API_KEY"
                    "Content-Type" = "application/json; charset=utf-8"
                } `
                -Body $bodyBytes

            $translatedText = Get-ResponseText $response

            if ([string]::IsNullOrWhiteSpace($translatedText)) {
                throw "Empty API response."
            }

            $translatedText = $translatedText.Trim()

            # Remove accidental Markdown fences
            $translatedText = $translatedText -replace '^```json\s*', ''
            $translatedText = $translatedText -replace '^```\s*', ''
            $translatedText = $translatedText -replace '\s*```$', ''
            $translatedText = $translatedText.Trim()

            # Find JSON object
            $firstBrace = $translatedText.IndexOf('{')
            $lastBrace = $translatedText.LastIndexOf('}')

            if ($firstBrace -lt 0 -or $lastBrace -le $firstBrace) {
                throw "No complete JSON object found in API response."
            }

            $jsonText = $translatedText.Substring(
                $firstBrace,
                $lastBrace - $firstBrace + 1
            ).Trim()

            # Remove BOM if API returned one
            $jsonText = $jsonText.TrimStart([char]0xFEFF)

            # Write temporary file WITHOUT BOM
            $utf8NoBom = New-Object System.Text.UTF8Encoding($false)

            [System.IO.File]::WriteAllText(
                $tempFile,
                $jsonText,
                $utf8NoBom
            )

            # ------------------------------------------------
            # JSON VALIDATION
            # ------------------------------------------------

            if (-not (Test-JsonFile $tempFile)) {
                Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
                throw "Generated JSON failed Node.js validation."
            }

            # ------------------------------------------------
            # STRUCTURE VALIDATION
            # ------------------------------------------------

            node -e @"
const fs = require('fs');

const sourceFile = process.argv[1];
const targetFile = process.argv[2];

function collectKeys(obj, prefix = '') {
    let result = [];

    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        return result;
    }

    for (const key of Object.keys(obj)) {

        const current =
            prefix ? prefix + '.' + key : key;

        result.push(current);

        if (
            obj[key] !== null &&
            typeof obj[key] === 'object' &&
            !Array.isArray(obj[key])
        ) {
            result = result.concat(
                collectKeys(obj[key], current)
            );
        }
    }

    return result;
}

try {

    const source =
        JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

    const target =
        JSON.parse(fs.readFileSync(targetFile, 'utf8'));

    const sourceKeys =
        new Set(collectKeys(source));

    const targetKeys =
        new Set(collectKeys(target));

    const missing =
        [...sourceKeys].filter(k => !targetKeys.has(k));

    const extra =
        [...targetKeys].filter(k => !sourceKeys.has(k));

    if (missing.length > 0) {
        console.error('MISSING KEYS:');
        console.error(missing.join('\n'));
        process.exit(1);
    }

    if (extra.length > 0) {
        console.error('EXTRA KEYS:');
        console.error(extra.join('\n'));
        process.exit(1);
    }

    process.exit(0);

}
catch (e) {
    console.error(e.message);
    process.exit(1);
}
"@ `
                (Resolve-Path $sourceFile).Path `
                (Resolve-Path $tempFile).Path

            if ($LASTEXITCODE -ne 0) {
                Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
                throw "Translation structure does not match en.json."
            }

            # ------------------------------------------------
            # ONLY NOW replace actual locale file
            # ------------------------------------------------

            Move-Item `
                -Path $tempFile `
                -Destination $outputFile `
                -Force

            Write-Host "SUCCESS: $Code.json" -ForegroundColor Green

            return $true
        }
        catch {

            Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red

            Remove-Item $tempFile -Force -ErrorAction SilentlyContinue

            if ($attempt -lt $maxRetries) {
                Write-Host "Retrying in 3 seconds..." -ForegroundColor Yellow
                Start-Sleep -Seconds 3
            }
        }
    }

    Write-Host "PERMANENT FAILURE: $Code.json" -ForegroundColor Red

    return $false
}

# ============================================================
# BATCH PROCESSING
# ============================================================

$total = $languages.Count
$successful = 0
$failed = 0

for ($start = 0; $start -lt $total; $start += $batchSize) {

    $end = [Math]::Min(
        $start + $batchSize - 1,
        $total - 1
    )

    $batch = $languages[$start..$end]

    $batchNumber =
        [Math]::Floor($start / $batchSize) + 1

    $batchCount =
        [Math]::Ceiling($total / $batchSize)

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "BATCH $batchNumber / $batchCount" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan

    foreach ($lang in $batch) {

        $result = Translate-Language `
            -Code $lang.Code `
            -LanguageName $lang.Name

        if ($result) {
            $successful++
        }
        else {
            $failed++
        }
    }

    Write-Host ""
    Write-Host "Batch $batchNumber complete." -ForegroundColor Cyan
    Write-Host "Successful: $successful"
    Write-Host "Failed: $failed"

    if ($end -lt ($total - 1)) {
        Write-Host "Waiting 5 seconds before next batch..."
        Start-Sleep -Seconds 5
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "TRANSLATION COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Successful: $successful" -ForegroundColor Green
Write-Host "Failed:     $failed" -ForegroundColor Red
Write-Host "Total:      $total"