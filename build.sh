#!/bin/sh
# Ghép file HTML duy nhất từ src/ + rules.js + progress.js
cd "$(dirname "$0")"
{ cat src/head.html; sed '/module.exports/d' rules.js; sed '/module.exports/d;/PROGRESS_END/d' progress.js; cat src/glue.js src/game.js; echo '</script></body></html>'; } > index.html
cp index.html tien-len-mien-nam.html
