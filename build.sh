#!/bin/sh
# Ghép index.html từ src/ + các module; tạo sw.js với phiên bản cache mới
cd "$(dirname "$0")"
V=$(cat src/* rules.js progress.js cloud.js shop.js online-core.js extras.js cloud-config.js manifest.webmanifest 2>/dev/null | sha1sum | cut -c1-10)
{ cat src/head.html; echo "const APP_VER='$V';"; sed '/module.exports/d' rules.js; sed '/module.exports/d;/PROGRESS_END/d' progress.js; sed '/module.exports/d' cloud.js; sed '/module.exports/d' shop.js; sed '/module.exports/d' online-core.js; sed '/module.exports/d' extras.js; cat src/glue.js src/game.js src/app.js src/home.js src/online.js src/extras-ui.js; echo 'boot();'; echo '</script></body></html>'; } > index.html
cp index.html tien-len-mien-nam.html
cp icons/icon.svg favicon.svg
sed "s/__VERSION__/$V/" src/sw.template.js > sw.js
