$base = "public/pdfs/vs"

$topics = @(
  "zaklady_matematiky",
  "diferencialni_pocet_i",
  "linearni_algebra",
  "analyticka_geometrie",
  "diferencialni_pocet_ii",
  "integralni_pocet",
  "obycejne_diferencialni_rovnice"
)

foreach ($t in $topics) {
  New-Item -ItemType Directory -Force -Path "$base/$t" | Out-Null
}

Write-Host "Created/ensured $($topics.Count) VS topic folders."