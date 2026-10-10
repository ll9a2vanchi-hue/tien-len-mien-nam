function I(n){return `<svg class="i"><use href="#i-${n}"/></svg>`;}
const SEATS=['Bạn','Ghế trái','Ghế trên','Ghế phải'];
const BOT_POOL=[['Tuấn','m'],['Hùng','m'],['Minh','m'],['Nam','m'],['Dũng','m'],['Khoa','m'],['Phúc','m'],['Long','m'],['Quang','m'],['Bảo','m'],['Thắng','m'],['Sơn','m'],['Vinh','m'],['Đức','m'],['Hải','m'],['Ông Tư','o'],['Chú Bảy','o'],
 ['Lan','f'],['Mai','f'],['Hoa','f'],['Linh','f'],['Trang','f'],['Thảo','f'],['Ngọc','f'],['Hương','f'],['Vy','f'],['Yến','f'],['Hạnh','f'],['Thu','f'],['Nhung','f'],['Phương','f'],['Bà Sáu','of'],['Cô Ba','f']];
const AV_EMO={m:['👨','🧔','👨‍🦱','🧑','👦','🧑‍🦱','👨‍🦰'],f:['👩','👧','👩‍🦰','👩‍🦱','👱‍♀️'],o:['👴','🧓'],of:['👵']};
const AV_COL=['#7b3fa0','#b5651d','#c2185b','#00897b','#5d4037','#3949ab','#ef6c00','#6d4c41','#2e7d32','#ad1457'];
let NAMES=['Bạn','Lan','Tuấn','Mai'],AVATARS=[['😎','#2b6cb0'],['👩','#7b3fa0'],['👨','#b5651d'],['👧','#c2185b']],BOTLV=[0,5,12,20];
const pick=a=>a[Math.random()*a.length|0];
function rollBots(){const pool=BOT_POOL.slice().sort(()=>Math.random()-.5).slice(0,3),cols=AV_COL.slice().sort(()=>Math.random()-.5);
 NAMES=['Bạn',...pool.map(x=>x[0])];AVATARS=[[myAv(),PR.avBg],...pool.map((x,i)=>[pick(AV_EMO[x[1]]),cols[i]])];
 const my=levelInfo(PR.xp).level;BOTLV=[0,...[0,1,2].map(()=>Math.max(1,Math.min(60,Math.round(my+(Math.random()*16-6)))))];}
const PTS=[3,1,-1,-3];
const RM=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let G=null,sel=new Set(),sortMode=0;
let S=JSON.parse(localStorage.getItem('tlmn_scores')||'null')||{pts:[0,0,0,0],wins:[0,0,0,0],games:0,lastWinner:null};
function save(){localStorage.setItem('tlmn_scores',JSON.stringify(S));}
const $=id=>document.getElementById(id);
// ---------- Âm thanh (Web Audio, không cần file) ----------
let muted=localStorage.getItem('tlmn_mute')==='1',AC=null;
function ac(){if(muted)return null;try{if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();}if(AC.state==='suspended')AC.resume();return AC;}catch(e){return null;}}
function tone(f,d,type,vol,delay,f2){const a=ac();if(!a)return;const t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();
 o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.2,t+.01);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.02);}
function noise(d,vol,delay,hp){const a=ac();if(!a)return;const t=a.currentTime+(delay||0),b=a.createBuffer(1,a.sampleRate*d|0,a.sampleRate),x=b.getChannelData(0);
 for(let i=0;i<x.length;i++)x[i]=(Math.random()*2-1)*Math.pow(1-i/x.length,2);const s=a.createBufferSource(),g=a.createGain(),fl=a.createBiquadFilter();
 s.buffer=b;fl.type=hp?'highpass':'lowpass';fl.frequency.value=hp||900;g.gain.value=vol||.3;s.connect(fl).connect(g).connect(a.destination);s.start(t);}
const SND={
 tap:()=>tone(880,.05,'triangle',.08),
 play:()=>{noise(.09,.25,0,1800);tone(320,.08,'triangle',.12,0,180);},
 pass:()=>tone(240,.15,'sine',.12,0,160),
 turn:()=>{tone(660,.12,'sine',.1);tone(990,.18,'sine',.08,.1);},
 chop:()=>{noise(.6,.6);tone(110,.5,'sawtooth',.25,0,40);tone(70,.6,'square',.15,.05,30);},
 bad:()=>tone(150,.2,'square',.08),
 win:()=>[523,659,784,1047,1319].forEach((f,i)=>tone(f,.25,'triangle',.15,i*.11)),
 lose:()=>[392,330,262].forEach((f,i)=>tone(f,.3,'sine',.12,i*.18)),
 coin:()=>{tone(1320,.08,'square',.06);tone(1760,.15,'square',.06,.07);},
};
function sfx(n){try{SND[n]&&SND[n]();}catch(e){}}
function toggleMute(){muted=!muted;localStorage.setItem('tlmn_mute',muted?'1':'0');updMute();if(!muted)sfx('tap');}
function updMute(){$('bMute').innerHTML=I(muted?'mute':'sound');}
// ---------- Vẽ lá bài ----------
const PIPS={0:[[50,30],[50,70]],1:[[50,22],[50,50],[50,78]],2:[[33,25],[67,25],[33,75],[67,75]],3:[[33,25],[67,25],[50,50],[33,75],[67,75]],
 4:[[33,25],[67,25],[33,50],[67,50],[33,75],[67,75]],5:[[33,25],[67,25],[50,37],[33,50],[67,50],[33,75],[67,75]],
 6:[[33,22],[67,22],[50,36],[33,50],[67,50],[50,64],[33,78],[67,78]],7:[[33,20],[67,20],[33,40],[67,40],[33,60],[67,60],[33,80],[67,80]],
 8:[[33,20],[67,20],[33,40],[67,40],[50,50],[33,60],[67,60],[33,80],[67,80]],9:[[33,18],[67,18],[50,30],[33,40],[67,40],[33,60],[67,60],[50,70],[33,82],[67,82]]};
// map rank index -> pip count key: 3..10 => counts 3..10; A=1, 2=2
function cardSVG(c){const r=RANKS[rk(c)],s=SUITS[st(c)],R=rk(c);let mid='';
 const n=R<=7?R+3:R===11?1:R===12?2:0;
 if(R>=8&&R<=10){mid=`<rect x="20" y="24" width="60" height="92" rx="6" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/><text x="50" y="84" font-size="44" font-weight="800" text-anchor="middle" fill="currentColor" font-family="Georgia,serif">${r}</text><text x="50" y="106" font-size="18" text-anchor="middle" fill="currentColor">${s}</text><text x="50" y="44" font-size="18" text-anchor="middle" fill="currentColor">${s}</text>`;}
 else if(n===1)mid=`<text x="50" y="92" font-size="56" text-anchor="middle" fill="currentColor">${s}</text>`;
 else{const P={2:[[50,32],[50,108]],3:[[50,30],[50,70],[50,110]]}[n]||(PIPS[n-2]||[]).map(([x,y])=>[x,22+y*0.96]);
  mid=P.map(([x,y])=>`<text x="${x}" y="${y+8}" font-size="${n>7?17:20}" text-anchor="middle" fill="currentColor">${s}</text>`).join('');}
 return `<svg viewBox="0 0 100 140"><g font-family="system-ui,sans-serif"><text x="8" y="24" font-size="${r.length>1?20:24}" font-weight="800" fill="currentColor">${r}</text><text x="9" y="44" font-size="18" fill="currentColor">${s}</text>
 <g transform="rotate(180 50 70)"><text x="8" y="24" font-size="${r.length>1?20:24}" font-weight="800" fill="currentColor">${r}</text><text x="9" y="44" font-size="18" fill="currentColor">${s}</text></g>${mid}</g></svg>`;}
function cardEl(c,click){const d=document.createElement('div');d.className='card'+(st(c)>=2?' red':'')+(sel.has(c)?' sel':'');d.dataset.c=c;d.innerHTML=cardSVG(c);
 if(click)d.onclick=()=>{sel.has(c)?sel.delete(c):sel.add(c);sfx('tap');render();};return d;}
function cname(c){return RANKS[rk(c)]+SUITS[st(c)];}
function chtml(cards){return sortCards(cards).map(c=>`<span class="c${st(c)>=2?' red':''}">${cname(c)}</span>`).join('');}
function typeName(i){return{single:'Rác',pair:'Đôi',triple:'Sám cô',quad:'Tứ quý',straight:'Sảnh '+i.len,pairseq:i.len+' đôi thông'}[i.type];}
// ---------- Hiệu ứng ----------
function fx(html,ms){const f=$('fx');if(!f)return;const d=document.createElement('div');d.innerHTML=html;const n=d.firstChild;f.appendChild(n);setTimeout(()=>n.remove&&n.remove(),ms||1000);}
function chopFX(txt){sfx('chop');if(RM){msg('💥 '+txt);return;}fx('<div class="flash"></div>',500);fx(`<div class="boom">💥 ${txt}</div>`,950);
 const t=$('table');t.classList.remove('shake');void t.offsetWidth;t.classList.add('shake');}
function winFX(txt,me){sfx(me?'win':'lose');fx(`<div class="banner">${txt}</div>`,2400);if(RM||!me)return;
 const cols=['#f4c542','#e53935','#43a047','#1e88e5','#fff','#ab47bc'];for(let i=0;i<70;i++)
  fx(`<div class="conf" style="left:${Math.random()*100}vw;background:${cols[i%6]};animation-duration:${1.6+Math.random()*1.8}s;animation-delay:${Math.random()*.6}s"></div>`,4200);}
function seatRect(p){const e=p===0?$('hand'):$('s'+p);const r=e&&e.getBoundingClientRect?e.getBoundingClientRect():null;return r?{x:r.left+r.width/2,y:r.top+r.height/2}:null;}
function flyIn(p,srcRects){if(RM)return;const els=document.querySelectorAll('#pile .card');const seat=seatRect(p);
 els.forEach((el,i)=>{if(!el.animate||!el.getBoundingClientRect)return;const d=el.getBoundingClientRect(),cx=d.left+d.width/2,cy=d.top+d.height/2;
  const s=(srcRects&&srcRects[el.dataset.c])||seat;if(!s)return;
  el.animate([{transform:`translate(${s.x-cx}px,${s.y-cy}px) rotate(${(i-1)*12}deg) scale(${p===0?1.2:.5})`,opacity:.9},{transform:'none',opacity:1}],{duration:380,easing:'cubic-bezier(.2,.8,.3,1.1)',delay:i*25,fill:'backwards'});});}
// ---------- Ván chơi ----------
const SEATMAP={2:[0,2],3:[0,1,3],4:[0,1,2,3]};
let TBL=+((typeof localStorage!=='undefined'&&localStorage.getItem('tlmn_n'))||4)||4;
function cardName(c){return ['3','4','5','6','7','8','9','10','J','Q','K','A','2'][c>>2]+['♠','♣','♦','♥'][c&3];}
function newGame(n){if(n){TBL=n;try{localStorage.setItem('tlmn_n',n);}catch(e){}}
 closeModal();
 if(PR.xu<PR.bet){const ok=BETS.filter(b=>b<=PR.xu);if(ok.length){PR.bet=ok[ok.length-1];saveP();}else{updHud();msg('Không đủ xu để cược!');openDaily();return;}}
rollBots();
 const d=[...Array(52).keys()];for(let i=51;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]];}
 const seats=SEATMAP[TBL]||SEATMAP[4],hands=[[],[],[],[]];seats.forEach((p,k)=>hands[p]=sortCards(d.slice(k*13,k*13+13)));
 G={hands,seats,n:seats.length,cur:null,curBy:null,passed:[0,0,0,0],finished:[],first:false,firstCard:0,over:false,pile:[],prev:[],under:[],hist:[],started:true};
 sel.clear();
 for(const p of seats){const w=instantWin(G.hands[p]);if(w){G.finished=[p];G.over=true;msg(`${NAMES[p]} TỚI TRẮNG: ${w}!`);render();chopFX('TỚI TRẮNG!');endGame(true);return;}}
 if(S.lastWinner==null||S.lastN!==G.n||!seats.includes(S.lastWinner)){let low=99;for(const p of seats){const m=Math.min(...G.hands[p]);if(m<low){low=m;G.turn=p;}}G.first=true;G.firstCard=low;}else G.turn=S.lastWinner;
 msg(G.first?`${NAMES[G.turn]} giữ ${cardName(G.firstCard)} đánh trước`:`${NAMES[G.turn]} thắng ván trước, đánh trước`);
 render();if(G.turn===0)sfx('turn');step();
}
function msg(t){const m=$('msg');if(m)m.textContent=t;}
function active(){return [0,1,2,3].filter(p=>G.hands[p].length>0);}
function nextTurn(){
 let p=G.turn;for(let k=0;k<4;k++){p=(p+1)%4;if(G.hands[p].length===0&&p!==G.curBy)continue;
  if(p===G.curBy){ // mọi người bỏ lượt: vòng mới
   G.cur=null;G.passed=[0,0,0,0];if(G.hands[p].length===0){let q=p;do{q=(q+1)%4}while(G.hands[q].length===0);G.turn=q;}else G.turn=p;
   G.curBy=null;pushUnder(G.pile);G.prev=G.pile;G.pile=[];G.hist=[{txt:`— Vòng mới: ${NAMES[G.turn]} cầm cái —`,cls:'ps'}];return;}
  if(G.passed[p]||G.hands[p].length===0)continue;G.turn=p;return;}
}
function doPlay(p,cards,srcRects){
 const info=detect(cards);G.hands[p]=G.hands[p].filter(c=>!cards.includes(c));
 const prevCur=G.cur,prevBy=G.curBy,prevCards=G.pile;const chop=!!(G.cur&&info.type!==G.cur.type);
 if(p===0)hookPlay(info,prevCur);
 const heo=chop&&rk(prevCur.top)===12;
 let txt=prevCur?`<b>${NAMES[p]}</b>: ${chtml(cards)} ${chop?'<b>CHẶT</b>':'ăn'} ${chtml(prevCards)} của ${NAMES[prevBy]}`:`<b>${NAMES[p]}</b> đánh ${typeName(info)}: ${chtml(cards)}`;
 G.hist.push({txt,cls:chop?'chop':''});
 pushUnder(prevCards);G.cur=info;G.curBy=p;G.prev=prevCards;G.pile=sortCards(cards);G.first=false;
 msg(`${NAMES[p]}: ${chop?'CHẶT! ':''}${typeName(info)}`);
 const fin=G.hands[p].length===0;
 if(fin){G.finished.push(p);G.hist.push({txt:`🏁 ${NAMES[p]} về ${['nhất','nhì','ba','bét'][G.finished.length-1]}!`,cls:''});}
 const over=fin&&active().length<=1;
 if(!over)nextTurn();
 render();flyIn(p,srcRects);
 if(chop)chopFX(heo?'CHẶT HEO!':info.type==='quad'?'TỨ QUÝ!':'CHẶT!');else sfx('play');
 if(fin&&G.finished.length===1)setTimeout(()=>winFX(p===0?'🎉 BẠN VỀ NHẤT!':`${NAMES[p]} về nhất`,p===0),chop?700:300);
 if(over){G.finished.push(...active());G.over=true;endGame(false);render();return;}
 if(G.turn===0)setTimeout(()=>sfx('turn'),250);
 step();
}
function pushUnder(cards){if(!cards||!cards.length||!G)return;G.under=G.under||[];const k=G.under.length;for(let i=0;i<cards.length;i++){const h=(k*7+i*13)%31;G.under.push({r:((h*37)%50)-25,x:((h*11)%80)-40+i*5,y:((h*17)%40)-20});}if(G.under.length>26)G.under.splice(0,G.under.length-26);}
function doPass(p){G.passed[p]=1;G.hist.push({txt:`${NAMES[p]} bỏ lượt`,cls:'ps'});msg(`${NAMES[p]} bỏ lượt`);sfx('pass');nextTurn();render();if(G.turn===0)sfx('turn');step();}
function step(){if(G.over||G.turn===0)return;setTimeout(()=>{if(G.over)return;const p=G.turn;
 const others=[0,1,2,3].filter(q=>q!==p&&G.hands[q].length).map(q=>G.hands[q].length);
 const m=botMove(G.hands[p],G.cur,G.first?G.firstCard:null,others);
 if(m)doPlay(p,m);else if(!G.cur){doPlay(p,[G.hands[p][0]]);}else doPass(p);},G.hands[0].length===0?(RM?150:220):(RM?600:900));}
function humanPlay(){if(G.over||G.turn!==0)return;const cards=[...sel],info=detect(cards);
 const bad=t=>{sfx('bad');msg(t);};
 if(!info)return bad('Bộ bài không hợp lệ');if(G.first&&!cards.includes(G.firstCard))return bad('Phải đánh kèm '+cardName(G.firstCard));
 if(!canBeat(info,G.cur))return bad('Không chặn được bài trên bàn');
 const src={};document.querySelectorAll('#hand .card.sel').forEach(el=>{if(el.getBoundingClientRect){const r=el.getBoundingClientRect();src[el.dataset.c]={x:r.left+r.width/2,y:r.top+r.height/2};}});
 sel.clear();doPlay(0,cards,src);}
function humanPass(){if(G.over||G.turn!==0)return;if(!G.cur){sfx('bad');return msg('Bạn đang cầm cái, phải đánh');}sel.clear();doPass(0);}
function hint(){if(G.over||G.turn!==0)return;const m=botMove(G.hands[0],G.cur,G.first?G.firstCard:null,[13])||
  (combos(G.hands[0]).find(x=>canBeat(x.info,G.cur)&&(!G.first||x.cards.includes(G.firstCard)))||{}).cards;
 sel=new Set(m||[]);if(!m)msg('Không có bài chặn — hãy bỏ lượt');sfx('tap');render();}
function sortHand(){sortMode^=1;sfx('tap');render();}
function endGame(instant){const f=G.finished,seats=G.seats||[0,1,2,3],all=[...f,...seats.filter(p=>!f.includes(p))];
 if(instant)setTimeout(()=>winFX(f[0]===0?'🌟 BẠN TỚI TRẮNG!':`${NAMES[f[0]]} tới trắng`,f[0]===0),900);
 hookEnd(all.indexOf(0),instant&&f[0]===0,G.n||4);if(typeof cloudAutoBackup==='function')setTimeout(cloudAutoBackup,50);S.games=(S.games||0)+1;S.lastWinner=all[0];S.lastN=G.n||4;save();G.rank=all;
 setTimeout(()=>showResult(all),2200);}
function showResult(rank){modal(`<h3>${I('trophy')} Kết quả · Bàn ${G.n||4} người</h3>`+rank.map((p,i)=>`<div class="row"><b style="width:30px">${['🥇','🥈','🥉','4️⃣'][i]}</b><div class="av" style="--avc:${AVATARS[p][1]};width:36px;height:36px;font-size:20px">${AVATARS[p][0]}</div><div style="flex:1">${NAMES[p]}${p===0?' (bạn)':''}</div></div>`).join('')+
 `<button onclick="newGame()">Ván mới</button><button class="alt" onclick="openTables()">Đổi bàn</button><button class="alt" onclick="goHome()">Về sảnh</button>`);}
function render(){
 [1,2,3].forEach(p=>{const e=$('s'+p),fin=G.finished.indexOf(p),n=G.hands[p].length;
  e.className='seat'+(G.turn===p&&!G.over?' turn':'');if(e.style)e.style.visibility=(G.seats&&!G.seats.includes(p))?'hidden':'';
  const tag=fin>=0?`<span class="tag fin">Về ${['nhất','nhì','ba','bét'][fin]}</span>`:G.passed[p]&&G.cur?'<span class="tag pass">Bỏ lượt</span>':G.turn===p&&!G.over?'<span class="tag">Đang nghĩ…</span>':'<span class="tag" style="opacity:0">.</span>';
  e.innerHTML=`<div class="av" style="--avc:${AVATARS[p][1]};--lp:${(BOTLV[p]*37)%100}">${AVATARS[p][0]}<span class="cnt">${n}</span></div><div class="nm">${NAMES[p]}</div><div class="blv"><span class="lvb">${BOTLV[p]}</span>${titleHTML(titleForLevel(BOTLV[p]))}</div>${tag}<div class="${G.over?'reveal':'fan'}"></div>`;
  const f=e.lastChild;if(G.over)G.hands[p].forEach(c=>f.appendChild(cardEl(c)));else f.innerHTML='<div class="back"></div>'.repeat(Math.min(n,13));});
 const pile=$('pile');pile.innerHTML='';G.pile.forEach(c=>pile.appendChild(cardEl(c)));
 const un=$('under');if(un)un.innerHTML=(G.under||[]).map(u=>`<div class="back" style="transform:translate(${u.x}px,${u.y}px) rotate(${u.r}deg)"></div>`).join('');
 let h=G.hands[0].slice();if(sortMode)h.sort((a,b)=>st(a)-st(b)||a-b);else h=sortCards(h);
 const hd=$('hand');hd.innerHTML='';const W=(typeof innerWidth!=='undefined'?innerWidth:1000),two=W<=700&&h.length>7,k=two?Math.ceil(h.length/2):h.length;
 h.forEach((c,i)=>{if(two&&i===k){const b=document.createElement('div');b.className='brk';hd.appendChild(b);}const e=cardEl(c,true);if(two&&i>=k)e.className+=' r2';hd.appendChild(e);});
 hd.className=two?'two':'';if(hd.style&&hd.style.setProperty){if(W<=700){const n=Math.max(k,1),av=W-28,cw=Math.min(two?Math.min(84,(typeof innerHeight!=='undefined'?innerHeight:900)*0.1):64,av/(1+0.58*(n-1)));const ov=n>1?Math.min(-cw*0.42,(av-n*cw)/(n-1)):0;
  hd.style.setProperty('--cw',cw.toFixed(1)+'px');hd.style.setProperty('--ch',(cw*1.43).toFixed(1)+'px');hd.style.setProperty('--ov',ov.toFixed(1)+'px');}else{['--cw','--ch','--ov'].forEach(v=>hd.style.removeProperty(v));}}
 $('myCnt').textContent=G.hands[0].length;renderMe();
 $('me').className=G.turn===0&&!G.over?'turn':'';
 $('bPlay').disabled=G.over||G.turn!==0;$('bPass').disabled=G.over||G.turn!==0||!G.cur;
}
const DEMO=typeof location!=='undefined'&&location.hash==='#demo';
function boot(){updMute();updHud();if(DEMO){document.body.classList.remove('athome');newGame();}else{showHome();if(loginState(PR,new Date()).canClaim)setTimeout(openDaily,600);}}

function renderMe(){const e=$('meInfo');if(!e)return;const L=levelInfo(PR.xp),t=currentTitle(PR);const a=document.querySelector('#meBar .av');if(a&&a.style)a.style.setProperty&&a.style.setProperty('--lp',Math.round(100*L.cur/L.need));
 e.innerHTML=`<span class="lvb big">${L.level}</span><div class="mi"><div class="mt">${titleHTML(t)} <small>▾</small></div><div class="xpb"><i style="width:${100*L.cur/L.need}%"></i></div><div class="xpt">${L.cur}/${L.need} XP</div></div>`;}
function levelUpFX(lv){if(!lv)return;if(lv.xp)toast(`+${lv.xp} XP`);if(!lv.ups.length){renderMe();return;}
 const top=lv.ups[lv.ups.length-1];renderMe();
 setTimeout(()=>{try{[392,523,659,784,1047].forEach((f,i)=>tone(f,.22,'square',.07,i*.08));tone(1568,.5,'triangle',.12,.42);}catch(e){}
  document.body.classList.add('busy');setTimeout(()=>{document.body.classList.remove('busy');pumpT();},2600);fx(`<div class="lvup"><div class="lvc">${top}</div><div>LÊN CẤP!</div><small>+${fmt(lv.xu)} xu</small></div>`,2600);
  toast(`${I('medal')} Lên cấp ${top}! +${fmt(lv.xu)} xu`);lv.newTitles.forEach(t=>toast(`Mở khóa danh hiệu: ${titleHTML(t)}`));},900);}
function openTitles(){const L=levelInfo(PR.xp),cur=currentTitle(PR);
 modal(`<h3>${I('medal')} Cấp ${L.level} · ${titleHTML(cur)}</h3><div class="xpb"><i style="width:${100*L.cur/L.need}%"></i></div><p class="small">${L.cur}/${L.need} XP đến cấp ${L.level+1} (thưởng ${fmt(levelReward(L.level+1))} xu). XP bàn 4 người: về nhất ${XP_PLACE[0]}, nhì ${XP_PLACE[1]}, ba ${XP_PLACE[2]}, bét ${XP_PLACE[3]} (bàn 3 người ×0.75, bàn 2 người ×0.5), chặt heo +${XP_CHOP}, tới trắng +${XP_INSTANT}, nhiệm vụ +${XP_QUEST}.</p><h4>Danh hiệu</h4>`+
 TITLES.map(t=>{const u=titleUnlocked(PR,t),req=t.min?`Cấp ${t.min}`:'Huy hiệu: '+(BADGES.find(b=>b.id===t.badge)||{}).name;
  return `<div class="row"><div style="flex:1">${titleHTML(t)} <small class="small">${req}</small></div>${t.id===cur.id?I('check'):u?`<button class="alt" onclick="pickTitle('${t.id}')">Chọn</button>`:I('lock')}</div>`;}).join(''));}
function pickTitle(id){if(setTitle(PR,id)){saveP();renderMe();toast('Đã đổi danh hiệu: '+currentTitle(PR).name);}openTitles();}

// ---------- Hàng đợi thông báo (không chồng lên bảng lên cấp) ----------
var TQ=[],TON=0;
function toast(h){TQ.push(h);pumpT();}
function pumpT(){const box=$('toast');if(!box)return;
 while(TQ.length&&TON<(document.body&&document.body.classList&&document.body.classList.contains('mopen')?1:2)&&!(document.body&&document.body.classList&&document.body.classList.contains('busy'))){const d=document.createElement('div');d.className='toast';d.innerHTML=TQ.shift();box.appendChild(d);TON++;
  setTimeout(()=>{d.className='toast out';setTimeout(()=>{d.remove&&d.remove();TON--;pumpT();},RM?0:300);},2400);}}
// ---------- Bộ đếm xu có hiệu ứng ----------
var coinShown=null,coinRaf=0;
function animCoin(v){const e=$('xu');if(!e)return;const from=coinShown==null?v:coinShown;coinShown=v;
 const set=n=>{e.innerHTML=I('coin')+fmt(Math.round(n));};
 if(from===v||RM||typeof requestAnimationFrame!=='function'){set(v);return;}
 if(e.classList){e.classList.remove('bump','up','down');void e.offsetWidth;e.classList.add('bump',v>from?'up':'down');setTimeout(()=>e.classList.remove('up','down','bump'),900);}
 cancelAnimationFrame(coinRaf);const t0=performance.now(),D=700;
 const step=t=>{const k=Math.min(1,(t-t0)/D),q=1-Math.pow(1-k,3);set(from+(v-from)*q);if(k<1)coinRaf=requestAnimationFrame(step);};coinRaf=requestAnimationFrame(step);}

function titleHTML(t){return `<span class="tt t${t.tier||1}">${t.name}</span>`;}
