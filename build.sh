#!/bin/sh
# Ghép index.html từ src/ + các module; tạo sw.js với phiên bản cache mới
cd "$(dirname "$0")"
V=$(cat src/* rules.js progress.js cloud.js shop.js online-core.js extras.js ai.js chop.js casino.js games2.js cloud-config.js manifest.webmanifest 2>/dev/null | sha1sum | cut -c1-10)
{ sed '/<\/style>/ { r src/baucua-mobile.css\n}' src/head.html; echo "const APP_VER='$V';"; sed '/module.exports/d' rules.js; sed '/module.exports/d;/PROGRESS_END/d' progress.js; sed '/module.exports/d' cloud.js; sed '/module.exports/d' shop.js; sed '/module.exports/d' online-core.js; sed '/module.exports/d' extras.js; sed '/module.exports/d' ai.js; sed '/module.exports/d' chop.js; sed '/module.exports/d' casino.js; sed '/module.exports/d' games2.js; cat src/avsvg.js src/glue.js src/game.js src/app.js src/home.js src/online.js src/extras-ui.js src/v9.js src/casino-ui.js src/games2-ui.js; echo 'boot();'; echo '</script></body></html>'; } > index.html
cp index.html tien-len-mien-nam.html
cp icons/icon.svg favicon.svg
sed "s/__VERSION__/$V/" src/sw.template.js > sw.js
