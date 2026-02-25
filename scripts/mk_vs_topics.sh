#!/usr/bin/env bash
set -euo pipefail

BASE="public/pdfs/vs"

topics=(
  zaklady_matematiky
  diferencialni_pocet_i
  linearni_algebra
  analyticka_geometrie
  diferencialni_pocet_ii
  integralni_pocet
  obycejne_diferencialni_rovnice
)

mkdir -p "$BASE"

for t in "${topics[@]}"; do
  mkdir -p "$BASE/$t"
done

echo "✅ Created/ensured ${#topics[@]} VS topic folders under $BASE:"
printf " - %s\n" "${topics[@]}"