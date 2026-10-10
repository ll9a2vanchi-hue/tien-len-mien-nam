#!/bin/sh
# Ghép index.html từ src/ + rules.js + progress.js + cloud.js; tạo sw.js với phiên bản cache mới
cd "$(dirname "$0")"
{ cat src/head.html; sed '/module.exports/d' rules.js; sed '/module.exports/d;/PROGRESS_END/d' progress.js; sed '/module.exports/d' cloud.js; cat src/glue.js src/game.js src/app.js; echo '</script></body></html>'; } > index.html
cp index.html tien-len-mien-nam.html
cp icons/icon.svg favicon.svg
V=$(cat index.html cloud-config.js manifest.webmanifest | sha1sum | cut -c1-10)
sed "s/__VERSION__/$V/" src/sw.template.js > sw.js
