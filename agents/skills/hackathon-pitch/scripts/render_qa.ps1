# Render a .pptx to PNG (one file per slide) for visual QA, using the installed
# PowerPoint. Opening the deck here is itself the validation: if PowerPoint
# refuses the file, the build is broken.
#
#   powershell -File render_qa.ps1 -Pptx outputs\deck.pptx -OutDir temp\qa
#   powershell -File render_qa.ps1 -Pptx outputs\deck.pptx -OutDir temp\qa -Pdf
#
# Requires Microsoft PowerPoint (checked at C:\Program Files\Microsoft Office).

param(
    [Parameter(Mandatory = $true)][string]$Pptx,
    [string]$OutDir = "temp\qa",
    [int]$Width = 1600,
    [int]$Height = 900,
    [switch]$Pdf
)

$ErrorActionPreference = "Stop"
$src = (Resolve-Path $Pptx).Path
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }
$dst = (Resolve-Path $OutDir).Path

$app = New-Object -ComObject PowerPoint.Application
try {
    # ReadOnly, no window: the template is never touched by the render pass.
    $pres = $app.Presentations.Open($src, $true, $false, $false)
    try {
        if ($Pdf) {
            $pdfPath = Join-Path $dst ([IO.Path]::GetFileNameWithoutExtension($src) + ".pdf")
            $pres.SaveAs($pdfPath, 32)   # ppSaveAsPDF
            Write-Output "pdf: $pdfPath"
        }
        $pres.Export($dst, "PNG", $Width, $Height)
        $pngs = Get-ChildItem -Path $dst -Filter *.PNG
        Write-Output "slides: $($pres.Slides.Count)  png: $($pngs.Count)  ->  $dst"
    }
    finally { $pres.Close() }
}
finally {
    $app.Quit()
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($app)
}
