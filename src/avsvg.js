// ======== Avatar SVG cao cấp (vẽ bằng SVG nội tuyến, chạy offline) ========
const SVA={};
function _g(id,a,b){return `<radialGradient id="${id}" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;}
function _lg(id,a,b){return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;}
// người: o={bg:[a,b],skin,hair,hs:'short|long|bun|spiky|bald|side',hat,eyes:'dot|happy|cool|wink|fierce',mouth:'smile|grin|smirk|o',beard,glasses,extra,blush}
function personSVG(id,o){const P='p'+id;const sk=o.skin||'#f5c9a0',hr=o.hair||'#2b1b12';let d=`<defs>${_g(P+'b',o.bg[0],o.bg[1])}${_g(P+'s',sk,o.skin2||'#d99a6c')}${_lg(P+'h',o.hair2||hr,hr)}</defs><circle cx="50" cy="50" r="50" fill="url(#${P}b)"/>`;
 d+=`<path d="M22 100 Q24 76 50 74 Q76 76 78 100Z" fill="${o.shirt||'#c62828'}"/>${o.collar?`<path d="M40 76 L50 88 L60 76" fill="none" stroke="${o.collar}" stroke-width="3"/>`:''}`;
 if(o.hs==='long')d+=`<path d="M24 52 Q22 86 34 92 L66 92 Q78 86 76 52 Z" fill="url(#${P}h)"/>`;
 d+=`<rect x="43" y="62" width="14" height="14" rx="5" fill="url(#${P}s)"/><ellipse cx="50" cy="48" rx="21" ry="23" fill="url(#${P}s)"/><ellipse cx="29" cy="50" rx="3.5" ry="5" fill="${sk}"/><ellipse cx="71" cy="50" rx="3.5" ry="5" fill="${sk}"/>`;
 const H={short:`<path d="M28 44 Q28 22 50 22 Q72 22 72 44 Q66 32 50 33 Q36 32 28 44Z" fill="url(#${P}h)"/>`,long:`<path d="M27 50 Q25 20 50 20 Q75 20 73 50 Q70 32 50 31 Q32 32 27 50Z" fill="url(#${P}h)"/>`,
  bun:`<circle cx="50" cy="18" r="9" fill="url(#${P}h)"/><path d="M28 46 Q28 22 50 23 Q72 22 72 46 Q66 31 50 32 Q34 31 28 46Z" fill="url(#${P}h)"/>`,
  spiky:`<path d="M27 44 L30 26 L37 32 L42 18 L48 29 L55 16 L60 29 L67 21 L69 33 L74 30 L73 44 Q64 33 50 34 Q36 33 27 44Z" fill="url(#${P}h)"/>`,
  side:`<path d="M28 46 Q26 22 52 21 Q74 22 73 40 Q60 26 38 34 Q32 38 28 46Z" fill="url(#${P}h)"/>`,bald:''};
 d+=H[o.hs||'short']||'';
 const E={dot:`<circle cx="42" cy="48" r="2.6" fill="#222"/><circle cx="58" cy="48" r="2.6" fill="#222"/>`,happy:`<path d="M38 49 Q42 44 46 49M54 49 Q58 44 62 49" stroke="#222" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  wink:`<circle cx="42" cy="48" r="2.6" fill="#222"/><path d="M54 49 Q58 45 62 49" stroke="#222" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  fierce:`<path d="M37 44 L46 47M63 44 L54 47" stroke="#222" stroke-width="2.4" stroke-linecap="round"/><circle cx="42" cy="50" r="2.4" fill="#222"/><circle cx="58" cy="50" r="2.4" fill="#222"/>`,
  cool:`<rect x="34" y="44" width="14" height="8" rx="3" fill="#111"/><rect x="52" y="44" width="14" height="8" rx="3" fill="#111"/><path d="M48 47 H52" stroke="#111" stroke-width="2"/><path d="M36 46 l4 0" stroke="#fff8" stroke-width="1.5"/>`};
 d+=E[o.eyes||'dot']||'';if(o.glasses)d+=`<circle cx="42" cy="48" r="6" fill="none" stroke="${o.glasses}" stroke-width="1.8"/><circle cx="58" cy="48" r="6" fill="none" stroke="${o.glasses}" stroke-width="1.8"/><path d="M48 48 H52" stroke="${o.glasses}" stroke-width="1.8"/>`;
 if(o.blush)d+=`<ellipse cx="36" cy="56" rx="4" ry="2.2" fill="#ff8a9a88"/><ellipse cx="64" cy="56" rx="4" ry="2.2" fill="#ff8a9a88"/>`;
 const M={smile:`<path d="M43 59 Q50 65 57 59" stroke="#7a2e1d" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,grin:`<path d="M42 58 Q50 68 58 58Z" fill="#7a2e1d"/><path d="M44 59 H56" stroke="#fff" stroke-width="2"/>`,
  smirk:`<path d="M44 60 Q52 62 57 57" stroke="#7a2e1d" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,o:`<ellipse cx="50" cy="60" rx="3" ry="3.6" fill="#7a2e1d"/>`};d+=M[o.mouth||'smile']||'';
 if(o.beard==='mustache')d+=`<path d="M40 56 Q45 52 50 55 Q55 52 60 56 Q55 58 50 57 Q45 58 40 56Z" fill="${o.beardC||hr}"/>`;
 if(o.beard==='full')d+=`<path d="M30 52 Q32 76 50 78 Q68 76 70 52 Q66 66 50 66 Q34 66 30 52Z" fill="${o.beardC||hr}"/><path d="M41 57 Q50 53 59 57" stroke="${o.beardC||hr}" stroke-width="3" fill="none"/>`;
 if(o.beard==='long')d+=`<path d="M38 60 Q50 96 62 60 Q56 66 50 66 Q44 66 38 60Z" fill="${o.beardC||'#eee'}"/><path d="M40 56 Q45 52 50 55 Q55 52 60 56" stroke="${o.beardC||'#eee'}" stroke-width="3" fill="none"/>`;
 const T={crown:`<path d="M31 30 L35 12 L43 24 L50 8 L57 24 L65 12 L69 30Z" fill="#ffd54f" stroke="#b8860b" stroke-width="1.5"/><circle cx="50" cy="20" r="2.6" fill="#e53935"/><circle cx="38" cy="24" r="2" fill="#42a5f5"/><circle cx="62" cy="24" r="2" fill="#43a047"/>`,
  nonla:`<path d="M14 34 L50 6 L86 34 Q50 40 14 34Z" fill="#e8d18a" stroke="#a88a3a" stroke-width="1.5"/><path d="M32 25 L68 25M24 30 L76 30" stroke="#c9ad5c" stroke-width="1"/>`,
  thantai:`<path d="M26 32 Q26 10 50 10 Q74 10 74 32Z" fill="#c62828"/><rect x="22" y="30" width="56" height="7" rx="3" fill="#ffd54f"/><circle cx="50" cy="20" r="5" fill="#ffd54f"/><path d="M20 30 Q8 24 10 16M80 30 Q92 24 90 16" stroke="#c62828" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  cap:`<path d="M28 34 Q28 16 50 16 Q72 16 72 34Z" fill="${o.hatC||'#1e88e5'}"/><path d="M50 32 Q76 30 84 36 Q66 38 50 36Z" fill="${o.hatC2||'#1565c0'}"/>`,
  fedora:`<path d="M30 30 Q32 12 50 12 Q68 12 70 30Z" fill="#212121"/><ellipse cx="50" cy="31" rx="30" ry="5" fill="#111"/><rect x="31" y="25" width="38" height="4" fill="#b71c1c"/>`,
  khan:`<path d="M27 38 Q26 18 50 18 Q74 18 73 38 Q62 30 50 31 Q38 30 27 38Z" fill="${o.hatC||'#6a1b9a'}"/><path d="M27 38 Q50 26 73 38" stroke="#ffd54f" stroke-width="2" fill="none"/>`,
  hoa:`<circle cx="68" cy="26" r="7" fill="#ff80ab"/><circle cx="68" cy="26" r="3" fill="#ffd54f"/><circle cx="60" cy="22" r="4" fill="#f48fb1"/>`,
  halo:`<ellipse cx="50" cy="12" rx="18" ry="5" fill="none" stroke="#fff59d" stroke-width="3"/>`,
  antenna:`<path d="M50 24 V10" stroke="#90a4ae" stroke-width="3"/><circle cx="50" cy="9" r="4" fill="#ff5252"/>`};
 if(o.hat)d+=T[o.hat]||'';if(o.extra)d+=o.extra;return d;}
// thú / linh vật
function beastSVG(id,kind,o){const P='b'+id;let d=`<defs>${_g(P+'b',o.bg[0],o.bg[1])}${_g(P+'f',o.c1,o.c2)}</defs><circle cx="50" cy="50" r="50" fill="url(#${P}b)"/>`;
 if(kind==='tiger'){d+=`<circle cx="26" cy="28" r="10" fill="url(#${P}f)"/><circle cx="74" cy="28" r="10" fill="url(#${P}f)"/><circle cx="26" cy="28" r="5" fill="#3e2723"/><circle cx="74" cy="28" r="5" fill="#3e2723"/><ellipse cx="50" cy="54" rx="30" ry="28" fill="url(#${P}f)"/>
  <path d="M50 28 V40M40 30 L44 40M60 30 L56 40M22 50 L32 52M22 60 L32 58M78 50 L68 52M78 60 L68 58" stroke="#3e2723" stroke-width="3" stroke-linecap="round"/><ellipse cx="50" cy="66" rx="14" ry="10" fill="#fff8e1"/>
  <path d="M38 48 Q42 44 46 48" stroke="#1b5e20" stroke-width="3" fill="#c6ff00"/><path d="M54 48 Q58 44 62 48" stroke="#1b5e20" stroke-width="3" fill="#c6ff00"/><path d="M46 60 L54 60 L50 65Z" fill="#3e2723"/><path d="M44 68 Q50 72 56 68" stroke="#3e2723" stroke-width="2" fill="none"/>`;}
 if(kind==='dragon'){d+=`<path d="M30 30 Q20 10 34 14 Q30 22 38 28Z" fill="${o.c3||'#ffca28'}"/><path d="M70 30 Q80 10 66 14 Q70 22 62 28Z" fill="${o.c3||'#ffca28'}"/><path d="M22 52 Q22 26 50 26 Q78 26 78 52 Q78 70 64 78 L36 78 Q22 70 22 52Z" fill="url(#${P}f)"/>
  <path d="M30 70 Q50 92 70 70 Q66 84 50 86 Q34 84 30 70Z" fill="${o.c2}"/><circle cx="40" cy="46" r="6" fill="#fff"/><circle cx="60" cy="46" r="6" fill="#fff"/><circle cx="41" cy="47" r="3" fill="#b71c1c"/><circle cx="61" cy="47" r="3" fill="#b71c1c"/>
  <ellipse cx="44" cy="64" rx="3" ry="2" fill="#1b1b1b"/><ellipse cx="56" cy="64" rx="3" ry="2" fill="#1b1b1b"/><path d="M36 64 Q20 66 14 58M64 64 Q80 66 86 58" stroke="${o.c3||'#ffca28'}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M38 38 L46 41M62 38 L54 41" stroke="#3e2723" stroke-width="2.5"/>
  <path d="M42 30 L46 22 L50 30 L54 22 L58 30" fill="${o.c3||'#ffca28'}"/>`;}
 if(kind==='phoenix'){d+=`<path d="M50 14 Q60 4 70 10 Q60 14 58 22Z" fill="#ffeb3b"/><path d="M50 14 Q40 4 30 10 Q40 14 42 22Z" fill="#ff9800"/><path d="M14 70 Q20 40 44 46 Q30 56 30 74Z" fill="#ff7043"/><path d="M86 70 Q80 40 56 46 Q70 56 70 74Z" fill="#ff7043"/>
  <ellipse cx="50" cy="50" rx="18" ry="26" fill="url(#${P}f)"/><circle cx="44" cy="42" r="3" fill="#212121"/><circle cx="56" cy="42" r="3" fill="#212121"/><path d="M46 50 L54 50 L50 58Z" fill="#ffd54f"/><path d="M40 76 Q50 98 60 76" fill="#ffca28"/>`;}
 if(kind==='cat'){d+=`<path d="M24 40 L28 14 L44 30Z M76 40 L72 14 L56 30Z" fill="url(#${P}f)"/><ellipse cx="50" cy="54" rx="28" ry="26" fill="url(#${P}f)"/><ellipse cx="40" cy="50" rx="4" ry="6" fill="#2e7d32"/><ellipse cx="60" cy="50" rx="4" ry="6" fill="#2e7d32"/>
  <path d="M47 60 L53 60 L50 63Z" fill="#e91e63"/><path d="M50 63 Q46 68 42 66M50 63 Q54 68 58 66M28 58 L40 60M28 64 L40 63M72 58 L60 60M72 64 L60 63" stroke="#4e342e" stroke-width="1.6" fill="none"/><path d="M14 18 L22 26M86 18 L78 26" stroke="#ffd54f" stroke-width="3"/><circle cx="72" cy="78" r="9" fill="#ffd54f" stroke="#b8860b"/><text x="72" y="82" font-size="10" text-anchor="middle" fill="#b8860b">福</text>`;}
 if(kind==='buffalo'){d+=`<path d="M20 34 Q4 30 10 14 Q16 28 30 30Z M80 34 Q96 30 90 14 Q84 28 70 30Z" fill="#eceff1"/><ellipse cx="50" cy="52" rx="26" ry="28" fill="url(#${P}f)"/><ellipse cx="50" cy="68" rx="16" ry="11" fill="#90a4ae"/><circle cx="44" cy="68" r="2.4" fill="#263238"/><circle cx="56" cy="68" r="2.4" fill="#263238"/><circle cx="40" cy="46" r="3" fill="#111"/><circle cx="60" cy="46" r="3" fill="#111"/>`;}
 if(kind==='koi'){d+=`<path d="M20 50 Q40 20 70 40 Q86 50 70 60 Q40 80 20 50Z" fill="url(#${P}f)"/><path d="M70 50 L92 34 L88 50 L92 66Z" fill="${o.c3||'#ff7043'}"/><circle cx="30" cy="48" r="3" fill="#111"/><path d="M40 40 Q48 46 44 56M54 38 Q62 46 58 60" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`;}
 if(kind==='robot'){d+=`<path d="M50 20 V10" stroke="#90a4ae" stroke-width="3"/><circle cx="50" cy="9" r="4" fill="#ff5252"/><rect x="24" y="22" width="52" height="46" rx="12" fill="url(#${P}f)"/><rect x="31" y="34" width="38" height="18" rx="9" fill="#0d1b2a"/><circle cx="42" cy="43" r="5" fill="${o.c3||'#00e5ff'}"/><circle cx="58" cy="43" r="5" fill="${o.c3||'#00e5ff'}"/><rect x="38" y="57" width="24" height="5" rx="2" fill="#0d1b2a"/><rect x="34" y="70" width="32" height="22" rx="6" fill="url(#${P}f)"/><circle cx="50" cy="80" r="4" fill="${o.c3||'#00e5ff'}"/>`;}
 if(kind==='ghost'){d+=`<path d="M26 86 V46 Q26 20 50 20 Q74 20 74 46 V86 L66 78 L58 86 L50 78 L42 86 L34 78Z" fill="url(#${P}f)"/><ellipse cx="42" cy="46" rx="4" ry="6" fill="#311b92"/><ellipse cx="58" cy="46" rx="4" ry="6" fill="#311b92"/><ellipse cx="50" cy="60" rx="5" ry="4" fill="#311b92"/>`;}
 return d;}
const SVA_LIST=[
 // Hiếm (x2 = 600)
 ['sv_cauam','Cậu Ấm',2,()=>personSVG('cauam',{bg:['#4fc3f7','#01579b'],hs:'side',hair:'#3e2723',eyes:'happy',mouth:'smile',shirt:'#ffffff',collar:'#1565c0',blush:1})],
 ['sv_nangtho','Nàng Thơ',2,()=>personSVG('nangtho',{bg:['#f8bbd0','#ad1457'],hs:'long',hair:'#1b0f0a',eyes:'happy',mouth:'smile',shirt:'#fff3e0',hat:'hoa',blush:1})],
 ['sv_nongdan','Lão Nông',2,()=>personSVG('nongdan',{bg:['#c5e1a5','#33691e'],hs:'short',hair:'#5d4037',eyes:'dot',mouth:'grin',shirt:'#6d4c41',hat:'nonla',beard:'mustache',skin:'#e0a77a'})],
 ['sv_hocsinh','Học Bá',2,()=>personSVG('hocsinh',{bg:['#fff59d','#f9a825'],hs:'short',hair:'#212121',eyes:'dot',mouth:'smile',shirt:'#fafafa',collar:'#d32f2f',glasses:'#263238'})],
 ['sv_sportboy','Cầu Thủ',2,()=>personSVG('sport',{bg:['#a5d6a7','#1b5e20'],hs:'spiky',hair:'#4e342e',eyes:'wink',mouth:'grin',shirt:'#d32f2f',hat:'cap',hatC:'#d32f2f',hatC2:'#b71c1c'})],
 ['sv_meomay','Mèo Thần Tài',2,()=>beastSVG('meo','cat',{bg:['#ffe082','#ef6c00'],c1:'#fffde7',c2:'#ffcc80'})],
 ['sv_trau','Trâu Vàng',2,()=>beastSVG('trau','buffalo',{bg:['#b0bec5','#37474f'],c1:'#78909c',c2:'#455a64'})],
 ['sv_ca','Cá Chép',2,()=>beastSVG('ca','koi',{bg:['#80deea','#006064'],c1:'#ffab91',c2:'#e64a19'})],
 ['sv_ma','Ma Lém Lỉnh',2,()=>beastSVG('ma','ghost',{bg:['#b39ddb','#311b92'],c1:'#ffffff',c2:'#d1c4e9'})],
 ['sv_coba','Cô Ba Sài Gòn',2,()=>personSVG('coba',{bg:['#ffccbc','#bf360c'],hs:'bun',hair:'#120a06',eyes:'wink',mouth:'smile',shirt:'#c62828',collar:'#ffd54f',blush:1})],
 // Sử thi (x5 = 1500)
 ['sv_gangster','Đại Ca Chợ Lớn',3,()=>personSVG('gang',{bg:['#616161','#111'],hs:'side',hair:'#000',eyes:'cool',mouth:'smirk',shirt:'#212121',collar:'#fafafa',hat:'fedora',beard:'mustache'})],
 ['sv_hiephi','Hiệp Sĩ Bài',3,()=>personSVG('hiep',{bg:['#90caf9','#0d47a1'],hs:'long',hair:'#263238',eyes:'fierce',mouth:'smirk',shirt:'#37474f',hat:'khan',hatC:'#0d47a1'})],
 ['sv_daigia','Đại Gia',3,()=>personSVG('daigia',{bg:['#ffe082','#ff6f00'],hs:'side',hair:'#212121',eyes:'cool',mouth:'grin',shirt:'#1a237e',collar:'#ffd54f',extra:'<path d="M40 86 Q50 92 60 86" stroke="#ffd54f" stroke-width="4" fill="none"/>'})],
 ['sv_tieuthu','Tiểu Thư',3,()=>personSVG('tieuthu',{bg:['#f48fb1','#880e4f'],hs:'long',hair:'#4e342e',hair2:'#8d6e63',eyes:'happy',mouth:'smile',shirt:'#f8bbd0',hat:'crown',blush:1})],
 ['sv_daosi','Đạo Sĩ',3,()=>personSVG('daosi',{bg:['#ce93d8','#4a148c'],hs:'bun',hair:'#eeeeee',eyes:'happy',mouth:'smile',shirt:'#6a1b9a',beard:'long',skin:'#f1c9a5'})],
 ['sv_nguoimay','Người Máy X',3,()=>beastSVG('robot','robot',{bg:['#80cbc4','#004d40'],c1:'#cfd8dc',c2:'#78909c',c3:'#00e5ff'})],
 ['sv_hosu','Hổ Sư',3,()=>beastSVG('ho','tiger',{bg:['#ffb74d','#bf360c'],c1:'#ffa726',c2:'#ef6c00'})],
 ['sv_chuthuyen','Thuyền Trưởng',3,()=>personSVG('ct',{bg:['#81d4fa','#01579b'],hs:'short',hair:'#fafafa',eyes:'wink',mouth:'smile',shirt:'#0d47a1',beard:'full',beardC:'#eeeeee',hat:'cap',hatC:'#fafafa',hatC2:'#0d47a1'})],
 ['sv_dj','DJ Bài Bạc',3,()=>personSVG('dj',{bg:['#ea80fc','#4a148c'],hs:'spiky',hair:'#00e5ff',hair2:'#d500f9',eyes:'cool',mouth:'grin',shirt:'#212121',extra:'<path d="M26 44 Q26 20 50 20 Q74 20 74 44" stroke="#333" stroke-width="5" fill="none"/><rect x="20" y="42" width="10" height="16" rx="4" fill="#e91e63"/><rect x="70" y="42" width="10" height="16" rx="4" fill="#e91e63"/>'})],
 ['sv_ninja','Ninja Bóng Đêm',3,()=>personSVG('ninja',{bg:['#455a64','#000'],hs:'bald',eyes:'fierce',mouth:'o',shirt:'#111',skin:'#e8b88f',extra:'<path d="M28 40 Q28 20 50 20 Q72 20 72 40 L72 70 Q50 78 28 70Z M30 42 H70 V54 H30Z" fill="#212121" fill-rule="evenodd"/><path d="M70 34 L88 28 L84 36" fill="#c62828"/>'})],
 // Huyền thoại (x10 = 3000)
 ['sv_thantai','Ông Thần Tài',4,()=>personSVG('tt',{bg:['#fff176','#e65100'],hs:'bald',eyes:'happy',mouth:'grin',shirt:'#c62828',collar:'#ffd54f',beard:'long',beardC:'#212121',hat:'thantai',blush:1,extra:'<circle cx="74" cy="80" r="10" fill="#ffd54f" stroke="#b8860b" stroke-width="2"/><rect x="71" y="77" width="6" height="6" fill="#b8860b"/>'})],
 ['sv_rongvang','Rồng Vàng',4,()=>beastSVG('rong','dragon',{bg:['#ffe082','#e65100'],c1:'#ffd54f',c2:'#f57f17',c3:'#ff3d00'})],
 ['sv_phuong','Phượng Hoàng Lửa',4,()=>beastSVG('phuong','phoenix',{bg:['#ff8a65','#b71c1c'],c1:'#ffeb3b',c2:'#ff5722'})],
 ['sv_bachho','Bạch Hổ',4,()=>beastSVG('bachho','tiger',{bg:['#e1f5fe','#0277bd'],c1:'#fafafa',c2:'#cfd8dc'})],
 ['sv_vua','Vua Bài',4,()=>personSVG('vua',{bg:['#ffd54f','#6d4c41'],hs:'short',hair:'#5d4037',eyes:'cool',mouth:'smirk',shirt:'#4a148c',collar:'#ffd54f',hat:'crown',beard:'full',beardC:'#5d4037'})],
 ['sv_nuhoang','Nữ Hoàng',4,()=>personSVG('nuhoang',{bg:['#e1bee7','#4a148c'],hs:'long',hair:'#ffd54f',hair2:'#fff59d',eyes:'wink',mouth:'smile',shirt:'#7b1fa2',collar:'#ffd54f',hat:'crown',blush:1})],
 ['sv_rongxanh','Thanh Long',4,()=>beastSVG('rongx','dragon',{bg:['#a7ffeb','#004d40'],c1:'#26a69a',c2:'#00695c',c3:'#ffd54f'})],
 // Tối thượng (khoá cấp)
 ['sv_dothanh','Đổ Thánh',5,()=>personSVG('dothanh',{bg:['#212121','#000'],hs:'side',hair:'#111',eyes:'cool',mouth:'smirk',shirt:'#fafafa',collar:'#212121',hat:'fedora',extra:'<g transform="translate(66 64) rotate(15)"><rect width="16" height="22" rx="2" fill="#fff" stroke="#c62828"/><text x="8" y="15" font-size="11" text-anchor="middle" fill="#c62828">A</text></g>'})],
 ['sv_kimlong','Kim Long Chí Tôn',5,()=>beastSVG('kimlong','dragon',{bg:['#fff8e1','#ff6f00'],c1:'#fff176',c2:'#ffa000',c3:'#d50000'})],
 ['sv_tienong','Tiên Ông',5,()=>personSVG('tienong',{bg:['#e0f7fa','#4dd0e1'],hs:'bun',hair:'#fafafa',eyes:'happy',mouth:'smile',shirt:'#fafafa',beard:'long',beardC:'#fafafa',hat:'halo'})],
 ['sv_chuaphuong','Phượng Hoàng Chí Tôn',5,()=>beastSVG('cphuong','phoenix',{bg:['#fff59d','#d50000'],c1:'#ffffff',c2:'#ffab00'})],
];
// ---- Tối thượng (500k): hào quang, tia sáng xoay, lấp lánh, khung gradient chuyển động, nhịp thở
function ultraSVG(id,inner,o){const P='u'+id;const rays=Array.from({length:12},(_,i)=>`<path d="M50 50 L${50+60*Math.cos((i*30-4)*Math.PI/180)} ${50+60*Math.sin((i*30-4)*Math.PI/180)} L${50+60*Math.cos((i*30+4)*Math.PI/180)} ${50+60*Math.sin((i*30+4)*Math.PI/180)}Z"/>`).join('');
 const sp=[[18,22,0],[82,20,.6],[86,70,1.2],[14,74,1.8],[50,9,.9],[30,88,1.5],[72,90,.3]].map(([x,y,d])=>`<path class="usp" style="animation-delay:${d}s" d="M${x} ${y-4}L${x+1.2} ${y-1.2}L${x+4} ${y}L${x+1.2} ${y+1.2}L${x} ${y+4}L${x-1.2} ${y+1.2}L${x-4} ${y}L${x-1.2} ${y-1.2}Z" fill="#fff"/>`).join('');
 return `<defs><radialGradient id="${P}a"><stop offset="0" stop-color="${o.aura}" stop-opacity=".95"/><stop offset=".6" stop-color="${o.aura}" stop-opacity=".35"/><stop offset="1" stop-color="${o.aura}" stop-opacity="0"/></radialGradient>
 <linearGradient id="${P}f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${o.f[0]}"/><stop offset=".35" stop-color="#fff"/><stop offset=".5" stop-color="${o.f[1]}"/><stop offset=".75" stop-color="#fff8"/><stop offset="1" stop-color="${o.f[0]}"/></linearGradient>
 <clipPath id="${P}c"><circle cx="50" cy="50" r="41"/></clipPath></defs>
 <circle cx="50" cy="50" r="50" fill="${o.bg}"/><g class="urays" fill="${o.ray}" opacity=".55">${rays}</g><circle class="uaura" cx="50" cy="50" r="46" fill="url(#${P}a)"/>
 <g clip-path="url(#${P}c)"><g class="ubob" transform="translate(50 52) scale(.86) translate(-50 -50)">${inner}</g></g>
 <circle class="ufrm" cx="50" cy="50" r="44" fill="none" stroke="url(#${P}f)" stroke-width="5"/><circle cx="50" cy="50" r="41.2" fill="none" stroke="#0008" stroke-width="1"/>
 <path d="M38 8 L44 2 L50 7 L56 2 L62 8 L58 12 H42Z" fill="url(#${P}f)" stroke="#0006" stroke-width=".6"/>${sp}`;}
SVA_LIST.push(
 ['sv_u_rong','Rồng Vàng Thăng Thiên',6,()=>ultraSVG('rong',beastSVG('urong','dragon',{bg:['#fff59d','#ff8f00'],c1:'#ffe082',c2:'#ff6f00',c3:'#d50000'}),{bg:'#3e1600',aura:'#ffd54f',ray:'#ffe082',f:['#ffb300','#fff176']})],
 ['sv_u_phuong','Phượng Hoàng Lửa Bất Tử',6,()=>ultraSVG('phuong',beastSVG('uphg','phoenix',{bg:['#ff8a65','#880e4f'],c1:'#fff176',c2:'#ff3d00'}),{bg:'#3b0010',aura:'#ff6e40',ray:'#ffab40',f:['#ff1744','#ffd740']})],
 ['sv_u_thantai','Thần Tài Kim Cương',6,()=>ultraSVG('thantai',personSVG('uthantai',{bg:['#e0f7fa','#00838f'],hs:'bun',hair:'#212121',eyes:'happy',mouth:'smile',shirt:'#c62828',collar:'#ffd54f',hat:'crown',beard:'long',beardC:'#212121',blush:1,extra:'<path d="M42 82 L50 72 L58 82 L50 92Z" fill="#b2ebf2" stroke="#fff" stroke-width="1.5"/>'}),{bg:'#002b36',aura:'#80deea',ray:'#e0f7fa',f:['#4dd0e1','#ffffff']})],
 ['sv_u_ho','Hổ Bạch Kim',6,()=>ultraSVG('ho',beastSVG('uho','tiger',{bg:['#eceff1','#455a64'],c1:'#ffffff',c2:'#b0bec5'}),{bg:'#1c262b',aura:'#e1f5fe',ray:'#cfd8dc',f:['#90a4ae','#ffffff']})],
 ['sv_u_longvuong','Long Vương Đại Dương',6,()=>ultraSVG('lv',beastSVG('ulv','dragon',{bg:['#80d8ff','#01579b'],c1:'#40c4ff',c2:'#0d47a1',c3:'#ffd740'}),{bg:'#001a33',aura:'#40c4ff',ray:'#b3e5fc',f:['#2979ff','#ffd740']})],
 ['sv_u_dothanh','Đổ Thánh Vô Song',6,()=>ultraSVG('dt',personSVG('udt',{bg:['#424242','#000'],hs:'side',hair:'#111',eyes:'cool',mouth:'smirk',shirt:'#fafafa',collar:'#d50000',hat:'fedora',extra:'<g transform="translate(64 62) rotate(14)"><rect width="16" height="22" rx="2" fill="#fff" stroke="#ffd740" stroke-width="1.5"/><text x="8" y="15" font-size="11" text-anchor="middle" fill="#d50000">A</text></g>'}),{bg:'#120400',aura:'#ffd740',ray:'#ff5252',f:['#d50000','#ffd740']})]);
// giá: Hiếm 20k–50k, Sử thi 100k, Huyền thoại & Tối thượng 500k
const SVA_PRICE={2:20000,3:100000,4:500000,5:500000,6:500000},SVA_LV={4:20,5:35,6:45};
const SVA_HIEM=[20000,25000,30000,35000,40000,45000,50000];
SVA_LIST.forEach(([id,name,tier,fn])=>{SVA[id]=fn;});
function svaHTML(id){const f=SVA[id];if(!f)return '';const t=(SVA_LIST.find(x=>x[0]===id)||[])[2]||2;return `<svg class="sva t${t}" viewBox="0 0 100 100" aria-hidden="true">${f()}</svg>`;}
// đăng ký vào cửa hàng: emo là mã đánh dấu ⟦id⟧, được thay bằng SVG khi hiển thị
(function(){if(typeof SHOP==='undefined')return;SVA_LIST.forEach(([id,name,tier])=>{if(SHOP.find(x=>x.id===id))return;const r=tier>=6?5:Math.min(4,tier);let hi=0;
 SHOP.push(Object.assign({id,type:'avatar',name,emo:'⟦'+id+'⟧',price:tier===2?SVA_HIEM[(SVA_LIST.filter(x=>x[2]===2).findIndex(x=>x[0]===id))%SVA_HIEM.length]:SVA_PRICE[tier],r,svg:1},SVA_LV[tier]?{lv:SVA_LV[tier]}:{},tier>=4?{tag:'new'}:{}));});})();
// thay mã ⟦id⟧ bằng SVG ở mọi nơi trên trang
const SVA_RE=/⟦(sv_[a-z0-9_]+)⟧/;
function svaScan(root){try{const w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>SVA_RE.test(n.nodeValue)?1:3});const L=[];let n;while(n=w.nextNode())L.push(n);
 L.forEach(t=>{const m=t.nodeValue.match(SVA_RE);if(!m||!t.parentNode)return;const before=t.nodeValue.slice(0,m.index),after=t.nodeValue.slice(m.index+m[0].length);const span=document.createElement('span');span.className='svaw';span.innerHTML=svaHTML(m[1]);
  const p=t.parentNode;if(before)p.insertBefore(document.createTextNode(before),t);p.insertBefore(span,t);if(after)p.insertBefore(document.createTextNode(after),t);p.removeChild(t);});}catch(e){}}
let _svaQ=false;if(typeof MutationObserver!=='undefined'&&typeof document!=='undefined')new MutationObserver(()=>{if(_svaQ)return;_svaQ=true;requestAnimationFrame(()=>{_svaQ=false;svaScan(document.body);});}).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
(function(){if(typeof SHOP==='undefined')return;const idx=[],av=[];SHOP.forEach((x,i)=>{if(x.type==='avatar'){idx.push(i);av.push(x);}});av.sort((a,b)=>(a.r-b.r)||(a.price-b.price));idx.forEach((i,k)=>SHOP[i]=av[k]);})();
