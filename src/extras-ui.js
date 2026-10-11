// ---------- Mỹ phẩm mở rộng, phạt rời bàn, vòng quay, ném đồ, sảnh bàn ----------
// CSS sinh từ dữ liệu cửa hàng
(function(){if(typeof document==='undefined'||!document.createElement)return;let c='';
 SHOP.forEach(it=>{if(it.type==='back'&&it.css)c+=`body[data-back=${it.id}] .back,.bk-${it.id}{background:${it.css}!important}`;
  if(it.type==='felt'&&it.f)c+=`body[data-felt=${it.id}]{--f1:${it.f[0]};--f2:${it.f[1]};--f3:${it.f[2]};--f4:${it.f[3]}}`;
  if(it.type==='deck'&&it.css)c+=`body[data-deck=${it.id}] .card:not(.back),.dk-${it.id}{${it.css}}`;
  if(it.type==='bubble'&&it.css)c+=`.bubble.${it.id}{${it.css}}.bubble.${it.id}::after{border-top-color:transparent}`;
  if(it.type==='name'&&it.css)c+=`.${it.id}{${it.css}}`;});
 const s=document.createElement('style');s.textContent=c;document.head&&document.head.appendChild&&document.head.appendChild(s);})();
const _apc=applyCosmetics;applyCosmetics=function(){_apc();const b=document.body;if(b&&b.dataset)b.dataset.deck=equipped(PR,'deck').id;};
function nameCls(){return equipped(PR,'name').id;}
// hiệu ứng thắng theo vật phẩm
const _wfx=winFX;winFX=function(txt,me){const ef=equipped(PR,'fx');if(!me||!ef.parts||RM)return _wfx(txt,me);sfx('win');fx_banner(txt);
 for(let i=0;i<46;i++)fx(`<div class="conf emo" style="left:${Math.random()*100}vw;animation-duration:${1.8+Math.random()*1.8}s;animation-delay:${Math.random()*.7}s">${ef.parts[i%ef.parts.length]}</div>`,4400);};
function fx_banner(t){fx(`<div class="banner">${t}</div>`,2400);}
// bong bóng chat của mình
const _se=showEmote;showEmote=function(p,e,bub){_se(p,e);const host=p===0?$('meInfo'):$('s'+p);const b=host&&host.lastChild;const id=p===0?equipped(PR,'bubble').id:bub;if(b&&id&&b.classList)b.classList.add(id);};
// ---- Thứ tự nút: Đánh trái — biểu tượng giữa — Bỏ lượt phải
(function(){const c=$('ctrl'),pass=$('bPass');if(c&&pass&&c.appendChild)c.appendChild(pass);})();
// ---- Kích thước bài trên bàn theo bàn
function fitPile(){const pw=$('pileWrap'),t=$('table');if(!pw||!pw.style||!pw.style.setProperty||!t||!t.getBoundingClientRect)return;const r=t.getBoundingClientRect();const n=Math.max(1,(G&&G.pile||[]).length);
 const base=Math.min(r.width*0.2,r.height*0.2,110),w=Math.min(base,(r.width*0.62)/(1+0.58*(n-1)));pw.style.setProperty('--pw',w.toFixed(1)+'px');pw.style.setProperty('--ph',(w*1.42).toFixed(1)+'px');}
// ---- Phạt rời bàn
function confirmExit(what){const pen=exitPenalty(curBet());return confirm(`${what}\n\nRời bàn giữa ván sẽ bị phạt 50% mức cược: -${fmt(pen)} xu.${ONL.active?' Máy sẽ chơi thay bạn.':''}`);}
function tableBet(){return (ONL.st&&ONL.st.bet)||(ONL.room&&ONL.room.bet)||PR.bet;}
function curBet(){return ONL.active?tableBet():PR.bet;}
function payExit(){const n=applyExitPenalty(PR,curBet());saveP();updHud();toast(`Phạt rời bàn: -${fmt(n)} xu`);sfx('bad');}
goHome=function(){if(ONL.active)return leaveRoom();if(inGame()){if(!confirmExit('Rời bàn và về sảnh?'))return;payExit();}
 if(G){G.over=true;G.aborted=true;}closeModal();$('emoBar').className='';showHome();};
function newGameBtn(){if(ONL.active){if(ONL.host)hostStart();return;}if(inGame()){if(!confirmExit('Bỏ ván này và chia ván mới?'))return;payExit();G.over=true;}newGame();}
const _lr=leaveRoom;leaveRoom=async function(silent){if(!ONL.active)return;if(!silent&&G&&G.online&&!G.over){if(!confirmExit('Rời phòng?'))return;payExit();}return _lr(true);};
// ---- Vòng quay may mắn
let spinning=false;
function wheelSVG(){const n=SPIN_PRIZES.length,R=130;let s='';SPIN_PRIZES.forEach((p,i)=>{const a0=(i/n)*2*Math.PI-Math.PI/2,a1=((i+1)/n)*2*Math.PI-Math.PI/2,am=(a0+a1)/2;
 s+=`<path d="M0 0L${(R*Math.cos(a0)).toFixed(1)} ${(R*Math.sin(a0)).toFixed(1)}A${R} ${R} 0 0 1 ${(R*Math.cos(a1)).toFixed(1)} ${(R*Math.sin(a1)).toFixed(1)}Z" fill="${p.col}" stroke="#e9c45a" stroke-width="2"/>`+
 `<text x="${(R*.6*Math.cos(am)).toFixed(1)}" y="${(R*.6*Math.sin(am)).toFixed(1)}" fill="#fff" font-size="12" font-weight="800" text-anchor="middle" dominant-baseline="middle" transform="rotate(${(am*180/Math.PI).toFixed(1)} ${(R*.6*Math.cos(am)).toFixed(1)} ${(R*.6*Math.sin(am)).toFixed(1)})">${p.label}</text>`;});
 return `<svg viewBox="-140 -140 280 280" class="wheel" id="wheel"><circle r="138" fill="#3a2500" stroke="url(#gGold)" stroke-width="6"/>${s}<circle r="20" fill="url(#gGold)" stroke="#6b4a00" stroke-width="2"/></svg>`;}
let wheelRot=0;
function openSpin(){const st=spinState(PR,new Date());
 modal(`<h3>${I('gift')} Vòng quay may mắn</h3><div class="wwrap"><div class="wptr"></div>${wheelSVG()}</div>
 <p class="small" style="text-align:center">${st.free?'Bạn có <b>1 lượt miễn phí</b> hôm nay!':'Đã dùng lượt miễn phí hôm nay — quay lại sau 0h.'} Lượt thêm: <b>${st.extra}</b> (nhận thêm khi hoàn thành nhiệm vụ)</p>
 <button class="bigbtn" id="bSpin" onclick="spinNow()" ${st.can?'':'disabled'}>QUAY${st.free?' MIỄN PHÍ':st.extra?' (còn '+st.extra+')':''}</button>
 <button class="alt" onclick="if(buySpin(PR,new Date())){saveP();updHud();sfx('coin');openSpin();}else toast('Không đủ xu')">Mua 1 lượt: ${I('coin')} ${SPIN_COST}</button>`);
 const w=$('wheel');if(w&&w.style)w.style.transform=`rotate(${wheelRot}deg)`;}
function spinNow(){if(spinning)return;const r=doSpin(PR,new Date(),Math.random,levelInfo(PR.xp).level);if(!r){toast('Hết lượt quay');return;}spinning=true;saveP();
 const n=SPIN_PRIZES.length,seg=360/n,target=360-(r.idx*seg+seg/2)+(Math.random()-.5)*seg*.6;wheelRot=wheelRot-(wheelRot%360)+360*6+target;
 const w=$('wheel'),b=$('bSpin');if(b)b.disabled=true;if(w&&w.style){w.style.transition=RM?'none':'transform 4.2s cubic-bezier(.12,.6,.1,1)';w.style.transform=`rotate(${wheelRot}deg)`;}
 let k=0;const tk=setInterval(()=>{tone(900+(k++%2)*200,.03,'square',.05);},RM?999:120);setTimeout(()=>clearInterval(tk),RM?50:3600);
 setTimeout(()=>{spinning=false;const g=r.got;sfx('win');let t=`🎉 Trúng: <b>${r.prize.label}</b>`;if(g.item){const it=shopItem(g.item);t=`🎁 Trúng vật phẩm: <b>${it.name}</b> (${RARITY[it.r].name})`;}
  toast(t);if(g.lv)levelUpFX(g.lv);updHud();saveP();openSpin();if(document.body.classList.contains('athome'))renderHome();},RM?300:4400);}
const _dcq=doClaimQuest;doClaimQuest=function(i){const before=PR.quests.list[i]&&PR.quests.list[i].claimed;_dcq(i);if(!before&&PR.quests.list[i]&&PR.quests.list[i].claimed){ensureSpin(PR,new Date()).extra++;saveP();toast('+1 lượt quay may mắn 🎡');}};
// ---- Ném đồ / tặng quà
function avRect(ls){const sels=ls===0?['#meAvM','#meBar .av','#meInfo .lvb','#meInfo','#hand']:['#s'+ls+' .av','#s'+ls];
 for(const q of sels){const e=document.querySelector(q);const r=e&&e.getBoundingClientRect?e.getBoundingClientRect():null;if(r&&r.width>0&&r.height>0)return{x:r.left+r.width/2,y:r.top+r.height/2};}
 return{x:(typeof innerWidth!=='undefined'?innerWidth:400)/2,y:(typeof innerHeight!=='undefined'?innerHeight:800)*(ls===0?.8:.3)};}
function throwVerb(t){return /^(Ném|Tặng|Tạt|Mời|Hun)/.test(t.name)?t.name.toLowerCase():'ném '+t.name.toLowerCase();}
function openThrow(ls){if(!G||!G.started)return;const nm=NAMES[ls]||'';
 modal(`<h3>Ném / tặng cho ${esc(nm)}</h3><div class="sgrid">${THROWS.map(t=>`<button class="alt sitem ${t.prem?'prem':''}" onclick="closeModal();sendThrow(${ls},'${t.id}')" ${PR.xu<t.cost?'disabled':''}><span style="font-size:30px">${t.emo}</span><b>${t.name}</b><small>${I('coin')} ${t.cost} xu</small></button>`).join('')}</div>`);}
function sendThrow(ls,id){closeModal();const r=throwItem(PR,id);if(!r.ok){sfx('bad');return toast(r.reason);}saveP();updHud();throwFX(0,ls,id);toast(`${r.t.emo} Bạn ${throwVerb(r.t)} ${esc(NAMES[ls]||'')} -${r.t.cost} xu`);
 if(ONL.active){const st=ONL.st,me=st?st.seats.findIndex(s=>s&&s.uid===USER.id):-1;const tg=st&&st.seats[(ls+me)%4];if(tg)ONL.tr.send('throw',{from:USER.id,to:tg.uid||('seat'+((ls+me)%4)),id});}
 else if(Math.random()<.4)setTimeout(()=>{if(!G||G.over&&!G.rank)return;const back=pick(THROWS.filter(x=>!x.prem));const bid=THROWS.find(x=>x.id===id).nice?'flower':back.id,bt=THROWS.find(x=>x.id===bid);throwFX(ls,0,bid);toast(`${bt.emo} ${esc(NAMES[ls]||'')} ${throwVerb(bt)} bạn!`);},1300+Math.random()*900);}
function throwFX(from,to,id){const t=THROWS.find(x=>x.id===id);if(!t)return;const a=avRect(from),b=avRect(to);if(!document.body||!document.body.appendChild)return;
 const d=document.createElement('div');d.className='proj';d.textContent=t.emo;document.body.appendChild(d);
 const done=()=>{d.remove&&d.remove();splat(b,t);};
 if(RM||!d.animate){d.style.transform=`translate(${b.x}px,${b.y}px)`;setTimeout(done,350);sfx('throw');return;}const mx=(a.x+b.x)/2,my=Math.min(a.y,b.y)-120;
 const an=d.animate([{transform:`translate(${a.x}px,${a.y}px) rotate(0) scale(.7)`},{transform:`translate(${mx}px,${my}px) rotate(360deg) scale(1.25)`},{transform:`translate(${b.x}px,${b.y}px) rotate(720deg) scale(1)`}],{duration:750,easing:'cubic-bezier(.3,.1,.5,1)'});
 an.onfinish=done;sfx('throw');}
function splat(p,t){const d=document.createElement('div');d.className='splat';d.style.left=p.x+'px';d.style.top=p.y+'px';d.textContent=t.splat;if(RM)d.classList.add('rm');document.body.appendChild(d);setTimeout(()=>d.remove&&d.remove(),RM?1600:1400);
 for(let i=0;i<8&&!RM;i++){const q=document.createElement('div');q.className='spk';q.textContent=t.nice?'✨':'•';q.style.left=p.x+'px';q.style.top=p.y+'px';q.style.setProperty('--dx',(Math.cos(i/8*6.28)*50)+'px');q.style.setProperty('--dy',(Math.sin(i/8*6.28)*50)+'px');q.style.color=t.nice?'#ffd84d':'#ffe0b2';document.body.appendChild(q);setTimeout(()=>q.remove&&q.remove(),800);}
 sfx(t.snd);}
Object.assign(SND,{throw:()=>tone(500,.25,'sine',.06,0,1200),splat:()=>{tone(180,.15,'sawtooth',.12);tone(90,.2,'square',.08,.03);},thud:()=>tone(110,.18,'triangle',.18),
 chime:()=>[1047,1319,1568].forEach((f,i)=>tone(f,.25,'sine',.08,i*.07)),boom:()=>{tone(80,.5,'sawtooth',.2,0,30);tone(160,.3,'square',.1,.02,40);}});
const _render=render;render=function(){_render();fitPile();[1,2,3].forEach(p=>{const a=document.querySelector('#s'+p+' .av');if(a)a.onclick=()=>openThrow(p);});};
// ---- Sảnh bàn công khai (presence trên tlmn:lobby)
let lobbyTier=0;
function lobbyMe(){const m=meInfo();return{uid:USER.id,name:m.name,av:m.av,bg:m.bg,lv:m.lv,xu:PR.xu,table:ONL.active&&ONL.pub?ONL.code:null,at:ONL.pubAt||0,bet:ONL.host&&ONL.pub?(ONL.host.opt.bet||null):null,playing:!!(ONL.host&&ONL.st&&!ONL.st.over)};}
let _ltT=0,_ltLast='';function lobbyTrack(){clearTimeout(_ltT);_ltT=setTimeout(()=>{if(!LOBBY||!LOBBY.ready||typeof USER==='undefined'||!USER)return;const m=lobbyMe(),k=JSON.stringify(m);if(k===_ltLast)return;_ltLast=k;LOBBY.ch.track(m).catch(()=>{_ltLast='';});},500);}
function lobbyPres(){if(!LOBBY)return[];const s=LOBBY.ch.presenceState();return Object.keys(s).map(k=>s[k][s[k].length-1]).filter(Boolean);}
joinLobby=async function(){if(LOBBY)return;await rtAuth();const ch=chan('tlmn:lobby');LOBBY={ch,online:{},ready:false};
 ch.on('presence',{event:'sync'},()=>{const s=ch.presenceState();LOBBY.online={};Object.keys(s).forEach(k=>LOBBY.online[k]=1);if($('frList'))renderFriends();if($('lobbyList'))renderLobby();});
 ch.on('broadcast',{event:'invite'},m=>{const p=m.payload;if(p&&p.to===USER.id&&!ONL.active){sfx('turn');modal(`<h3>${I('friends')} Lời mời chơi</h3><p><b>${esc(p.name)}</b> mời bạn vào phòng <b>${esc(p.code)}</b>.</p><button onclick="closeModal();joinRoom('${esc(p.code)}')">Vào phòng</button><button class="alt" onclick="closeModal()">Để sau</button>`);}});
 ch.subscribe(async s=>{if(s==='SUBSCRIBED'){LOBBY.ready=true;_ltLast=JSON.stringify(lobbyMe());await ch.track(lobbyMe());}});};
function renderLobby(){const el=$('lobbyList');if(!el)return;const T=lobbyTables(lobbyPres()).filter(t=>t.tier===LOBBY_TIERS[lobbyTier]);
 el.innerHTML=T.map(t=>`<button class="alt ltab ${t.count?'busy':''}" onclick="sitTable('${t.code}')"><div class="lh"><b>Bàn ${t.id}</b><span>${I('coin')} ${fmt(t.bet)}</span></div>
  <div class="lseats">${[0,1,2,3].map(i=>{const p=t.players[i];return p?`<span class="av" style="--avc:${esc(p.bg||'#456')}" title="${esc(p.name)} · ${fmt(p.xu||0)} xu">${esc(p.av||'🙂')}<i class="lxu">${kxu(p.xu||0)}</i></span>`:'<span class="av empty">+</span>';}).join('')}</div>
  <div class="lf"><span>${t.count}/4</span><span class="st ${t.status==='đang chơi'?'pl':t.count?'wt':''}">${t.status}</span></div></button>`).join('');}
async function sitTable(code){const T=lobbyTables(lobbyPres()),t=T.find(x=>x.code===code);const c=canSit(t,PR,USER.id);if(!c.ok){sfx('bad');return toast(c.reason);}
 ONL.pubAt=Date.now();await enterRoom(code,t.count===0,true);ONL.pub=true;ONL.pubAt=ONL.pubAt;if(ONL.host)ONL.host.opt.bet=t.bet;lobbyTrack();}
openOnline=async function(){if(!CLOUD_ON||!USER){if(CLOUD_ON&&navigator.onLine!==false){try{await loadSB();const {data}=await SB.auth.getSession();USER=data.session&&data.session.user||null;}catch(e){}}}
 if(needLogin())return;modal(`<h3>${I('friends')} Sảnh online</h3><p class="small">Đang kết nối…</p>`);try{await ensurePlayer();}catch(e){}await joinLobby();
 modal(`<h3>${I('friends')} Sảnh online</h3><div class="tabs">${LOBBY_TIERS.map((b,i)=>`<button class="alt ${i===lobbyTier?'on':''}" onclick="lobbyTier=${i};openOnline()">${I('coin')} ${fmt(b)}</button>`).join('')}</div>
 <div id="lobbyList" class="lgrid"><p class="small">Đang tải bàn…</p></div>
 <details style="margin-top:10px"><summary><b>Phòng riêng &amp; bạn bè</b></summary>
 <div class="row" style="flex-direction:column;align-items:stretch"><label class="small"><input type="checkbox" id="oBots" checked> Thêm máy vào ghế trống</label><button onclick="createRoom()">Tạo phòng riêng</button></div>
 <div class="row" style="flex-direction:column;align-items:stretch"><input class="inp" id="oCode" maxlength="6" placeholder="Mã phòng 6 ký tự" style="text-transform:uppercase;letter-spacing:4px;text-align:center"><button class="alt" onclick="joinRoom(($('oCode').value||'').trim().toUpperCase())">Vào phòng</button></div>
 <h4>Bạn bè <small class="small">· Mã của bạn: <b style="letter-spacing:2px">${MYCODE||'…'}</b></small></h4><div id="frList" class="small">Đang tải…</div>
 <div class="row"><input class="inp" id="frCode" maxlength="6" placeholder="Mã bạn bè" style="flex:1;text-transform:uppercase"><button class="alt" onclick="addFriend()">Kết bạn</button></div></details>`);
 renderLobby();renderFriends();};
function setTableBet(b){if(!ONL.host)return;if(ONL.st&&!ONL.st.over)return toast('Chỉ đổi cược giữa các ván');ONL.host.opt.bet=b;ONL.host.push();lobbyTrack();toast('Đã đổi mức cược: '+fmt(b));}
const _rr=renderRoom;renderRoom=function(){_rr();if(!ONL.active||!ONL.room)return;const box=document.querySelector('#home .pcard');if(!box||!box.insertAdjacentHTML)return;
 const bet=ONL.room.bet||PR.bet;const ctl=ONL.host?`<div class="row"><span style="flex:1">Mức cược bàn</span><select onchange="setTableBet(+this.value)">${[100,200,500,1000,2000,5000,10000].map(b=>`<option ${b===bet?'selected':''} value="${b}">${fmt(b)}</option>`).join('')}</select></div>`:`<div class="row"><span style="flex:1">Mức cược bàn</span><b>${I('coin')} ${fmt(bet)}</b> <small class="small">(chủ bàn chỉnh)</small></div>`;
 box.insertAdjacentHTML('afterbegin',ctl);lobbyTrack();};
const _ost=onlineState;onlineState=function(st,fh){const ob=PR.bet;PR.bet=(st&&st.bet)||(ONL.room&&ONL.room.bet)||PR.bet;try{_ost(st,fh);}finally{PR.bet=ob;}if(ONL.host)lobbyTrack();};

// ---- Cửa hàng mở rộng
Object.assign(TABN,{deck:'Bộ bài',fx:'Hiệu ứng thắng',bubble:'Bong bóng chat',name:'Màu tên'});
const _ip=itemPreview;itemPreview=function(it){if(it.type==='deck')return `<div class="pv dk dk-${it.id}">A<span style="font-size:14px">♥</span></div>`;
 if(it.type==='fx')return `<div class="pv" style="width:auto;height:auto;border:0;font-size:24px">${(it.parts||['🎊','🎉','✨']).join('')}</div>`;
 if(it.type==='bubble')return `<div class="pv" style="width:auto;height:auto;border:0"><span class="bubble ${it.id}" style="position:static;transform:none;animation:none;display:inline-block">Chào!</span></div>`;
 if(it.type==='name')return `<div class="pv" style="width:auto;height:auto;border:0;font:700 17px var(--serif)"><span class="${it.id}">${esc((typeof USER!=='undefined'&&USER?USER.email.split('@')[0]:'Bạn'))}</span></div>`;
 if(it.type==='felt'&&it.f)return `<div class="pv felt" style="background:radial-gradient(ellipse,${it.f[0]},${it.f[2]})"></div>`;return _ip(it);};
openShop=function(tab){if(tab)shopTab=tab;const lv=levelInfo(PR.xp).level,day=dk(),deal=dailyDeal(day),di=shopItem(deal.id);
 const card=it=>{const own=owns(PR,it.id),eq=it.type!=='emote'&&PR.equip[it.type]===it.id,pr=priceOf(it.id,day),R=RARITY[it.r];
  const act=eq?`<button disabled>Đang dùng</button>`:own?(it.type==='emote'?`<button disabled>Đã có</button>`:`<button class="alt" onclick="doEquip('${it.id}')">Sử dụng</button>`):
   (it.lv&&lv<it.lv?`<span class="lk">${I('lock')} Cấp ${it.lv}</span>`:`<button onclick="doBuy('${it.id}')" ${PR.xu<pr?'disabled':''}>${I('coin')} ${fmt(pr)}</button>`);
  return `<div class="sitem ${eq?'eq':''} ${it.r>=5?'ultra':''}" style="border-color:${R.col}88;box-shadow:inset 0 -3px 0 ${R.col}66${eq?',0 0 0 2px #ffd84d inset':''}">${it.tag?`<span class="tg ${it.tag}">${it.tag==='new'?'MỚI':'HOT'}</span>`:''}${itemPreview(it)}<b>${it.name}</b><span class="rar" style="color:${R.col}">${R.name}</span>${pr<it.price&&!own?`<span class="old">${fmt(it.price)}</span>`:''}${act}</div>`;};
 modal(`<h3>${I('shop')} Cửa hàng</h3><div class="row" style="justify-content:space-between"><span>Số dư</span><b>${I('coin')} ${fmt(PR.xu)} xu</b></div>
 <div class="deal"><span style="font-size:26px">🔥</span><div style="flex:1"><b>Ưu đãi hôm nay -${deal.off}%</b><br><small>${di.name} · ${TABN[di.type]} · ${RARITY[di.r].name}</small></div><button class="alt" onclick="openShop('${di.type}')">Xem</button></div>
 <div class="tabs">${Object.keys(TABN).map(k=>`<button class="alt ${k===shopTab?'on':''}" onclick="openShop('${k}')">${TABN[k]}</button>`).join('')}</div>
 <div class="sgrid">${SHOP.filter(x=>x.type===shopTab).sort((a,b)=>(a.r-b.r)||(a.price-b.price)).map(card).join('')}</div>`);};
doBuy=function(id){const it=shopItem(id),pr=priceOf(id,dk());if(!confirm(`Mua "${it.name}" (${RARITY[it.r].name}) với giá ${fmt(pr)} xu?`))return;const r=buyItem(PR,id,levelInfo(PR.xp).level,dk());
 if(!r.ok){sfx('bad');toast(r.reason);}else{sfx('coin');toast(`${I('check')} Đã mua ${it.name}`);if(it.type!=='emote')equipItem(PR,id);applyCosmetics();saveP();updHud();}openShop();};
// ---- Trang chủ: thêm vòng quay + màu tên
const _rh=renderHome;renderHome=function(){_rh();const g=document.querySelector('#home .tiles');const st=spinState(PR,new Date());
 if(g&&g.insertAdjacentHTML)g.insertAdjacentHTML('afterbegin',`<button class="alt tile" onclick="openSpin()"><span style="font-size:28px;line-height:30px">🎡</span><span>Vòng quay</span>${st.can?'<span class="dot"></span>':''}</button>`);
 const n=document.querySelector('#home .pn');if(n&&n.classList)n.classList.add(nameCls());};
