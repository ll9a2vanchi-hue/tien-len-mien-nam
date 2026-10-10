// ---------- Màn hình chính, cửa hàng, avatar, cài đặt, biểu cảm ----------
ensureInv(PR);
function myAv(){return equipped(PR,'avatar').emo;}
function frameCls(){return 'fr-'+equipped(PR,'frame').id;}
function applyCosmetics(){const b=document.body;if(!b||!b.dataset)return;b.dataset.back=equipped(PR,'back').id;b.dataset.felt=equipped(PR,'felt').id;
 AVATARS[0]=[myAv(),PR.avBg];const a=document.querySelector('#meBar .av');if(a){a.className='av '+frameCls();a.style.setProperty&&a.style.setProperty('--avc',PR.avBg);if(a.firstChild)a.firstChild.nodeValue=myAv();}}
function inGame(){return G&&G.started&&!G.over;}
function showHome(){document.body.classList.add('athome');renderHome();}
function goHome(){if(inGame()&&!confirm('Rời ván đang chơi? Ván này sẽ bị hủy.'))return;if(G){G.over=true;G.aborted=true;}
 closeModal();$('emoBar').className='';showHome();}
function playBots(){openTables();}
function openTables(){const opt=n=>{const x=TABLE_XP[n],bet=PR.bet,pl=PLACE_XU[n].map(m=>(m>0?'+':'')+fmt(Math.round(bet*m))).join(' / ');
  return `<button class="alt" onclick="startTable(${n})"><span class="seats">${'👤'.repeat(n)}</span><span class="ti"><b>Bàn ${n} người</b><small>Xu (cược ${fmt(bet)}): ${pl}</small></span><span class="mul">XP ×${x}</span></button>`;};
 modal(`<h3>${I('bot')} Chọn bàn chơi với máy</h3><p class="small">Mỗi người 13 lá. Ván đầu: ai giữ lá nhỏ nhất (thường là 3♠) đánh trước.</p><div class="tsel">${opt(2)}${opt(3)}${opt(4)}</div>`);}
function startTable(n){document.body.classList.remove('athome');newGame(n);}
function renderHome(){const L=levelInfo(PR.xp),t=currentTitle(PR),acc=(typeof USER!=='undefined'&&USER)?USER.email.split('@')[0]:'Khách';
 const dq=PR.quests.list.some(q=>!q.claimed&&q.prog>=questDef(q.id).goal),dl=loginState(PR,new Date()).canClaim;
 const tile=(ic,lbl,fn,dot)=>`<button class="alt tile" onclick="${fn}">${I(ic)}<span>${lbl}</span>${dot?'<span class="dot"></span>':''}</button>`;
 $('home').innerHTML=`<div class="hwrap"><div class="hlogo"><img src="icons/icon-192.png" alt=""><h1>Tiến Lên Miền Nam</h1><div class="sub">Sòng bài thượng lưu</div></div>
 <div class="pcard" onclick="openAvatar()"><div class="av ${frameCls()}" style="--avc:${PR.avBg};--lp:${Math.round(100*L.cur/L.need)}">${myAv()}</div>
  <div class="pi"><div class="pn">${acc}</div><div class="pt"><span class="lvb">${L.level}</span>${titleHTML(t)}</div><div class="xpb"><i style="width:${100*L.cur/L.need}%"></i></div>
  <div class="pxu">${I('coin')}${fmt(PR.xu)} xu <small style="opacity:.6;font-weight:400;margin-left:auto">${L.cur}/${L.need} XP</small></div></div></div>
 <button class="bigbtn" onclick="playBots()">${I('bot')} CHƠI VỚI MÁY</button>
 <button class="bigbtn alt" onclick="openOnline()">${I('friends')} CHƠI VỚI BẠN BÈ</button>
 <div class="tiles">${tile('shop','Cửa hàng','openShop()')}${tile('palette','Avatar','openAvatar()')}${tile('quest','Nhiệm vụ','openQuests()',dq)}${tile('medal','Huy hiệu','openBadges()')}
 ${tile('gift','Quà','openDaily()',dl)}${tile('gear','Cài đặt','openSettings()')}${tile('user','Tài khoản','openAccount()')}</div>
 <div class="hfoot">Chơi offline hoàn toàn · Dữ liệu lưu trên máy${typeof CLOUD_ON!=='undefined'&&CLOUD_ON?' · Có sao lưu đám mây':''}</div></div>`;}
// cửa hàng
let shopTab='back';
const TABN={back:'Mặt sau bài',felt:'Mặt bàn',avatar:'Avatar',frame:'Khung',emote:'Biểu cảm'};
function itemPreview(it){if(it.type==='back')return `<div class="pv bk-${it.id}"></div>`;if(it.type==='felt')return `<div class="pv felt" data-f="${it.id}" style="${feltStyle(it.id)}"></div>`;
 if(it.type==='avatar')return `<div class="pv av" style="background:${PR.avBg}">${it.emo}</div>`;if(it.type==='frame')return `<div class="av fr-${it.id}" style="--avc:${PR.avBg};width:46px;height:46px;font-size:24px">${myAv()}</div>`;
 return `<div class="pv" style="width:auto;height:auto;border:0;font-size:${it.list[0].length>2?'12px':'22px'};padding:4px">${it.list.slice(0,3).join(' ')}</div>`;}
function feltStyle(id){const F={felt_green:['#1f8a4f','#0a4425'],felt_royal:['#2f5fb8','#122a5c'],felt_crimson:['#a3283a','#520e19'],felt_purple:['#6d3fb0','#32185a'],felt_onyx:['#3a3a3a','#171717']}[id];return `background:radial-gradient(ellipse,${F[0]},${F[1]})`;}
function openShop(tab){if(tab)shopTab=tab;const lv=levelInfo(PR.xp).level;
 modal(`<h3>${I('shop')} Cửa hàng</h3><div class="row" style="justify-content:space-between"><span>Số dư</span><b>${I('coin')} ${fmt(PR.xu)} xu</b></div>
 <div class="tabs">${Object.keys(TABN).map(k=>`<button class="alt ${k===shopTab?'on':''}" onclick="openShop('${k}')">${TABN[k]}</button>`).join('')}</div>
 <div class="sgrid">${SHOP.filter(x=>x.type===shopTab).map(it=>{const own=owns(PR,it.id),eq=it.type!=='emote'&&PR.equip[it.type]===it.id;
  const act=eq?`<button disabled>Đang dùng</button>`:own?(it.type==='emote'?`<button disabled>Đã có</button>`:`<button class="alt" onclick="doEquip('${it.id}')">Sử dụng</button>`):
   (it.lv&&lv<it.lv?`<span class="lk">${I('lock')} Cấp ${it.lv}</span>`:`<button onclick="doBuy('${it.id}')" ${PR.xu<it.price?'disabled':''}>${I('coin')} ${fmt(it.price)}</button>`);
  return `<div class="sitem ${eq?'eq':''}">${itemPreview(it)}<b>${it.name}</b>${act}</div>`;}).join('')}</div>`);}
function doBuy(id){const it=shopItem(id);if(!confirm(`Mua "${it.name}" với giá ${fmt(it.price)} xu?`))return;const r=buyItem(PR,id,levelInfo(PR.xp).level);
 if(!r.ok){sfx('bad');toast(r.reason);}else{sfx('coin');toast(`${I('check')} Đã mua ${it.name}`);if(it.type!=='emote')equipItem(PR,id);applyCosmetics();saveP();}openShop();}
function doEquip(id){if(equipItem(PR,id)){applyCosmetics();saveP();sfx('tap');}openShop();}
// avatar
function openAvatar(){const own=SHOP.filter(x=>x.type==='avatar'&&owns(PR,x.id)),fr=SHOP.filter(x=>x.type==='frame'&&owns(PR,x.id));
 modal(`<h3>${I('palette')} Avatar của bạn</h3><div style="display:flex;justify-content:center;margin:6px 0 14px"><div class="av ${frameCls()}" style="--avc:${PR.avBg};width:84px;height:84px;font-size:46px">${myAv()}</div></div>
 <h4>Nhân vật</h4><div class="sgrid">${own.map(a=>`<button class="alt sitem ${PR.equip.avatar===a.id?'eq':''}" onclick="doEquipAv('${a.id}')" style="font-size:28px">${a.emo}<small style="font-size:11px">${a.name}</small></button>`).join('')}</div>
 <h4>Màu nền</h4><div>${AV_BGS.map(c=>`<span class="swatch ${PR.avBg===c?'on':''}" style="background:${c}" onclick="setAvBg('${c}')"></span>`).join('')}</div>
 <h4>Khung</h4><div class="sgrid">${fr.map(f=>`<button class="alt sitem ${PR.equip.frame===f.id?'eq':''}" onclick="doEquipAv('${f.id}')"><div class="av fr-${f.id}" style="--avc:${PR.avBg};width:40px;height:40px;font-size:20px">${myAv()}</div><small>${f.name}</small></button>`).join('')}</div>
 <p class="small">Mua thêm nhân vật và khung trong <a href="#" style="color:#ffd84d" onclick="openShop('avatar');return false">Cửa hàng</a>.</p>`);}
function doEquipAv(id){equipItem(PR,id);applyCosmetics();saveP();openAvatar();if(document.body.classList.contains('athome'))renderHome();}
function setAvBg(c){PR.avBg=c;applyCosmetics();saveP();openAvatar();if(document.body.classList.contains('athome'))renderHome();}
// cài đặt
function openSettings(){modal(`<h3>${I('gear')} Cài đặt</h3>
 <div class="row"><span style="flex:1">Âm thanh</span><button class="alt" onclick="toggleMute();openSettings()">${muted?'Đang tắt':'Đang bật'}</button></div>
 <div class="row"><span style="flex:1">Xếp bài mặc định</span><button class="alt" onclick="sortMode^=1;localStorage.setItem('tlmn_sort2',sortMode);openSettings()">${sortMode?'Theo số':'Thông minh (theo bộ)'}</button></div>
 <div class="row"><span style="flex:1">Mặt bàn &amp; mặt sau bài</span><button class="alt" onclick="openShop('felt')">Đổi</button></div>
 <div class="row"><span style="flex:1">Cài ứng dụng</span><button class="alt" onclick="doInstall()">Cài đặt</button></div>
 <div class="row"><span style="flex:1;color:#ffb4a8">Xóa toàn bộ dữ liệu trên máy</span><button class="alt" onclick="if(confirm('Xóa xu, cấp độ, vật phẩm trên máy này? (Bản sao lưu đám mây không bị xóa)')){['tlmn_profile','tlmn_scores','tlmn_updated'].forEach(k=>localStorage.removeItem(k));location.reload();}">Xóa</button></div>
 <p class="small">Phiên bản ${typeof APP_VER!=='undefined'?APP_VER:''} · Chơi offline · Tiến Lên Miền Nam</p>`);}
// biểu cảm
function toggleEmotes(){const b=$('emoBar');if(b.className==='on'){b.className='';return;}
 b.innerHTML=myEmotes(PR).map(e=>`<button class="alt" onclick="sendEmote(this.textContent)">${e}</button>`).join('');b.className='on';}
function sendEmote(e){$('emoBar').className='';showEmote(0,e);if(typeof onlineEmote==='function'&&onlineEmote(e))return;
 if(Math.random()<.5)setTimeout(()=>{const p=1+(Math.random()*3|0);showEmote(p,pick(['😂','😮','👍','😏','Chặt đi!','Run chưa?','🙏','😡']));},700+Math.random()*900);}
function showEmote(p,e){const host=p===0?$('meInfo'):$('s'+p);if(!host||!host.appendChild)return;const d=document.createElement('div');d.className='bubble'+([...e].length<=2?' big':'');d.textContent=e;host.appendChild(d);setTimeout(()=>d.remove&&d.remove(),2600);sfx('tap');}
sortMode=+(localStorage.getItem('tlmn_sort2')||0);
applyCosmetics();
window.addEventListener('resize',()=>{if(G&&G.started&&!document.body.classList.contains('athome'))render();});
