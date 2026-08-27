#!/bin/sh
# Regenerates cfg.cssEntry. Run before every package-build.mjs — see NOTES.md.
set -e
cd "$(dirname "$0")/.."
npx tailwindcss -c .design-sync/tailwind.sync.cjs -i src/index.css \
  -o .design-sync/.cache/tw.css --minify
cat .design-sync/.cache/tw.css .design-sync/surface.css > .design-sync/.cache/recompos.css
echo "css: $(wc -c < .design-sync/.cache/recompos.css) bytes"
