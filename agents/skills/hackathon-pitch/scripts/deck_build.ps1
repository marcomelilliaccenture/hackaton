# Build a working deck by picking template slides, in order, from the Accenture
# FY26 master — driven through the installed PowerPoint, so the result is always
# a file PowerPoint itself wrote.
#
#   powershell -ExecutionPolicy Bypass -File deck_build.ps1 `
#       -Slides "31,60,67,158,143,42" -Out "outputs\working.pptx"
#
# -Slides are 1-based positions in the template (the numbers in
# references/slide-index.md). A position may repeat: the extra occurrences are
# real duplicated slides.
#
# The template is copied first and never modified. Template speaker notes are
# cleared unless -KeepNotes is passed (write your own with deck_text.py).
#
# Hand-editing the package XML instead of going through PowerPoint is a trap:
# the master's slide ids are already at the legal maximum and it carries 29
# PowerPoint sections that reference slides by id, so a hand-built subset opens
# as "corrupted and unreadable".

param(
    [Parameter(Mandatory = $true)][string]$Slides,
    [Parameter(Mandatory = $true)][string]$Out,
    [string]$Template,
    [switch]$KeepNotes
)

$ErrorActionPreference = "Stop"

if (-not $Template) {
    $Template = Join-Path (Split-Path $PSScriptRoot -Parent) "assets\accenture_template.pptx"
}
if (-not (Test-Path $Template)) { throw "template not found: $Template" }

$want = $Slides.Split(",") | Where-Object { $_.Trim() } | ForEach-Object { [int]$_.Trim() }
if ($want.Count -eq 0) { throw "no slides requested" }

$outDir = Split-Path $Out -Parent
if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
$outFull = if ([IO.Path]::IsPathRooted($Out)) { $Out }
           else { [IO.Path]::GetFullPath((Join-Path (Get-Location) $Out)) }

$work = Join-Path $env:TEMP ("deckbuild_" + [guid]::NewGuid().ToString("N") + ".pptx")
Copy-Item $Template $work

$app = New-Object -ComObject PowerPoint.Application
try {
    $pres = $app.Presentations.Open($work, $false, $false, $false)
    $total = $pres.Slides.Count
    foreach ($pos in $want) {
        if ($pos -lt 1 -or $pos -gt $total) { throw "slide $pos outside 1..$total" }
    }

    # 1. materialise duplicates; remember one SlideID per requested occurrence
    $ids = @()
    $seen = @{}
    foreach ($pos in $want) {
        $src = $pres.Slides.Item($pos)
        if ($seen.ContainsKey($pos)) { $ids += $src.Duplicate().Item(1).SlideID }
        else { $seen[$pos] = $true; $ids += $src.SlideID }
    }

    # 2. drop everything not requested
    $keep = @{}
    foreach ($id in $ids) { $keep[$id] = $true }
    for ($i = $pres.Slides.Count; $i -ge 1; $i--) {
        $s = $pres.Slides.Item($i)
        if (-not $keep.ContainsKey($s.SlideID)) { $s.Delete() }
    }

    # 3. put the survivors in the requested order
    for ($i = 0; $i -lt $ids.Count; $i++) {
        $pres.Slides.FindBySlideID($ids[$i]).MoveTo($i + 1)
    }

    # 4. clear the template's own placeholder notes
    if (-not $KeepNotes) {
        foreach ($s in $pres.Slides) {
            foreach ($sh in $s.NotesPage.Shapes) {
                if ($sh.HasTextFrame -and $sh.TextFrame.HasText) { $sh.TextFrame.TextRange.Text = "" }
            }
        }
    }

    if (Test-Path $outFull) { Remove-Item $outFull -Force }
    $pres.SaveAs($outFull)
    Write-Output "$outFull  slides=$($pres.Slides.Count)  from=[$Slides]"
    $pres.Close()
}
finally {
    $app.Quit()
    Remove-Item $work -Force -ErrorAction SilentlyContinue
}
