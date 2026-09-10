$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../..'))
$manifest = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'manifest.json') -Raw | ConvertFrom-Json
Add-Type -AssemblyName System.Drawing
$encoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = New-Object Drawing.Imaging.EncoderParameters(1)
$parameters.Param[0] = New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality, [long]90)
foreach ($asset in $manifest.images) {
  $sourcePath = Join-Path $projectRoot $asset.output
  if (!(Test-Path -LiteralPath $sourcePath)) { throw "Missing generated image: $sourcePath" }
}
foreach ($asset in $manifest.images) {
  $sourcePath = Join-Path $projectRoot $asset.output
  $image = [Drawing.Image]::FromFile($sourcePath)
  try { $image.Save([IO.Path]::ChangeExtension($sourcePath, '.jpg'), $encoder, $parameters) }
  finally { $image.Dispose() }
}
$parameters.Dispose()
$changed = @()
foreach ($page in Get-ChildItem -LiteralPath $projectRoot -Filter '*.html' -File) {
  $before = [IO.File]::ReadAllText($page.FullName)
  $after = $before
  foreach ($asset in $manifest.images) {
    $newSource = [IO.Path]::ChangeExtension($asset.output, '.jpg').Replace('\', '/')
    $after = [regex]::Replace($after, [regex]::Escape($asset.source), $newSource, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
  }
  if ($after -cne $before) {
    [IO.File]::WriteAllText($page.FullName, $after, (New-Object Text.UTF8Encoding($false)))
    $changed += $page.Name
  }
}
$changed | ConvertTo-Json
