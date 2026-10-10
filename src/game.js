function I(n){return `<svg class="i"><use href="#i-${n}"/></svg>`;}
const NAMES=['Bạn','Máy Trái','Máy Trên','Máy Phải'];
const AVATARS=[['😎','#2b6cb0'],['🤖','#7b3fa0'],['🧔','#b5651d'],['👩','#c2185b']];
const PTS=[3,1,-1,-3];
const RM=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let G,sel=new Set(),sortMode=0;
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
function newGame(){
 closeModal();$('score').style.display='none';
 if(PR.xu<PR.bet){const ok=BETS.filter(b=>b<=PR.xu);if(ok.length){PR.bet=ok[ok.length-1];saveP();}else{updHud();msg('Không đủ xu để cược!');openDaily();return;}}
 const d=[...Array(52).keys()];for(let i=51;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]];}
 G={hands:[0,1,2,3].map(p=>sortCards(d.slice(p*13,p*13+13))),cur:null,curBy:null,passed:[0,0,0,0],finished:[],first:false,over:false,pile:[],prev:[],hist:[],started:true};
 sel.clear();
 for(let p=0;p<4;p++){const w=instantWin(G.hands[p]);if(w){G.finished=[p];G.over=true;msg(`${NAMES[p]} TỚI TRẮNG: ${w}!`);render();chopFX('TỚI TRẮNG!');endGame(true);return;}}
 if(S.lastWinner==null){G.turn=G.hands.findIndex(h=>h.includes(0));G.first=true;}else G.turn=S.lastWinner;
 msg(G.first?`${NAMES[G.turn]} giữ 3♠ đánh trước`:`${NAMES[G.turn]} thắng ván trước, đánh trước`);
 render();if(G.turn===0)sfx('turn');step();
}
function msg(t){const m=$('msg');if(m)m.textContent=t;}
function active(){return [0,1,2,3].filter(p=>G.hands[p].length>0);}
function nextTurn(){
 let p=G.turn;for(let k=0;k<4;k++){p=(p+1)%4;if(G.hands[p].length===0&&p!==G.curBy)continue;
  if(p===G.curBy){ // mọi người bỏ lượt: vòng mới
   G.cur=null;G.passed=[0,0,0,0];if(G.hands[p].length===0){let q=p;do{q=(q+1)%4}while(G.hands[q].length===0);G.turn=q;}else G.turn=p;
   G.curBy=null;G.prev=G.pile;G.pile=[];G.hist=[{txt:`— Vòng mới: ${NAMES[G.turn]} cầm cái —`,cls:'ps'}];return;}
  if(G.passed[p]||G.hands[p].length===0)continue;G.turn=p;return;}
}
function doPlay(p,cards,srcRects){
 const info=detect(cards);G.hands[p]=G.hands[p].filter(c=>!cards.includes(c));
 const prevCur=G.cur,prevBy=G.curBy,prevCards=G.pile;const chop=!!(G.cur&&info.type!==G.cur.type);
 if(p===0)hookPlay(info,prevCur);
 const heo=chop&&rk(prevCur.top)===12;
 let txt=prevCur?`<b>${NAMES[p]}</b>: ${chtml(cards)} ${chop?'<b>CHẶT</b>':'ăn'} ${chtml(prevCards)} của ${NAMES[prevBy]}`:`<b>${NAMES[p]}</b> đánh ${typeName(info)}: ${chtml(cards)}`;
 G.hist.push({txt,cls:chop?'chop':''});
 G.cur=info;G.curBy=p;G.prev=prevCards;G.pile=sortCards(cards);G.first=false;
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
function doPass(p){G.passed[p]=1;G.hist.push({txt:`${NAMES[p]} bỏ lượt`,cls:'ps'});msg(`${NAMES[p]} bỏ lượt`);sfx('pass');nextTurn();render();if(G.turn===0)sfx('turn');step();}
function step(){if(G.over||G.turn===0)return;setTimeout(()=>{if(G.over)return;const p=G.turn;
 const others=[0,1,2,3].filter(q=>q!==p&&G.hands[q].length).map(q=>G.hands[q].length);
 const m=botMove(G.hands[p],G.cur,G.first?0:null,others);
 if(m)doPlay(p,m);else if(!G.cur){doPlay(p,[G.hands[p][0]]);}else doPass(p);},RM?600:900);}
function humanPlay(){if(G.over||G.turn!==0)return;const cards=[...sel],info=detect(cards);
 const bad=t=>{sfx('bad');msg(t);};
 if(!info)return bad('Bộ bài không hợp lệ');if(G.first&&!cards.includes(0))return bad('Phải đánh kèm 3♠');
 if(!canBeat(info,G.cur))return bad('Không chặn được bài trên bàn');
 const src={};document.querySelectorAll('#hand .card.sel').forEach(el=>{if(el.getBoundingClientRect){const r=el.getBoundingClientRect();src[el.dataset.c]={x:r.left+r.width/2,y:r.top+r.height/2};}});
 sel.clear();doPlay(0,cards,src);}
function humanPass(){if(G.over||G.turn!==0)return;if(!G.cur){sfx('bad');return msg('Bạn đang cầm cái, phải đánh');}sel.clear();doPass(0);}
function hint(){if(G.over||G.turn!==0)return;const m=botMove(G.hands[0],G.cur,G.first?0:null,[13])||
  (combos(G.hands[0]).find(x=>canBeat(x.info,G.cur)&&(!G.first||x.cards.includes(0)))||{}).cards;
 sel=new Set(m||[]);if(!m)msg('Không có bài chặn — hãy bỏ lượt');sfx('tap');render();}
function sortHand(){sortMode^=1;sfx('tap');render();}
function endGame(instant){const f=G.finished,all=[...f,...[0,1,2,3].filter(p=>!f.includes(p))];
 if(instant){S.pts[f[0]]+=6;[0,1,2,3].forEach(p=>{if(p!==f[0])S.pts[p]-=2;});setTimeout(()=>winFX(f[0]===0?'🌟 BẠN TỚI TRẮNG!':`${NAMES[f[0]]} tới trắng`,f[0]===0),900);}
 else all.forEach((p,i)=>S.pts[p]+=PTS[i]);
 hookEnd(all.indexOf(0),instant&&f[0]===0);if(typeof cloudAutoBackup==='function')setTimeout(cloudAutoBackup,50);S.wins[all[0]]++;S.games++;S.lastWinner=all[0];save();G.rank=all;
 setTimeout(()=>showScore(all),2200);}
function showScore(rank){let h='<h3>'+I('trophy')+' Bảng điểm</h3>';
 if(Array.isArray(rank))h+='<p>Thứ tự về: '+rank.map((p,i)=>`${['🥇','🥈','🥉','4️⃣'][i]} ${NAMES[p]}`).join(' · ')+'</p>';
 h+='<table><tr><th>Người</th><th>Điểm</th><th>Thắng</th></tr>'+[0,1,2,3].map(p=>`<tr><td>${AVATARS[p][0]} ${NAMES[p]}</td><td>${S.pts[p]}</td><td>${S.wins[p]}</td></tr>`).join('')+`</table><p>Số ván: ${S.games}</p><button onclick="event.stopPropagation();resetScore()" class="alt">Xóa điểm</button><button onclick="newGame()">Ván mới</button>`;
 $('scoreIn').innerHTML=h;$('score').style.display='flex';}
function resetScore(){S={pts:[0,0,0,0],wins:[0,0,0,0],games:0,lastWinner:null};save();showScore();}
function render(){
 [1,2,3].forEach(p=>{const e=$('s'+p),fin=G.finished.indexOf(p),n=G.hands[p].length;
  e.className='seat'+(G.turn===p&&!G.over?' turn':'');
  const tag=fin>=0?`<span class="tag fin">Về ${['nhất','nhì','ba','bét'][fin]}</span>`:G.passed[p]&&G.cur?'<span class="tag pass">Bỏ lượt</span>':G.turn===p&&!G.over?'<span class="tag">Đang nghĩ…</span>':'<span class="tag" style="opacity:0">.</span>';
  e.innerHTML=`<div class="av" style="--avc:${AVATARS[p][1]}">${AVATARS[p][0]}<span class="cnt">${n}</span></div><div class="nm">${NAMES[p]}</div>${tag}<div class="${G.over?'reveal':'fan'}"></div>`;
  const f=e.lastChild;if(G.over)G.hands[p].forEach(c=>f.appendChild(cardEl(c)));else f.innerHTML='<div class="back"></div>'.repeat(Math.min(n,13));});
 const pile=$('pile');pile.innerHTML='';G.pile.forEach(c=>pile.appendChild(cardEl(c)));
 const pv=$('prev');pv.innerHTML='';(G.prev||[]).forEach(c=>pv.appendChild(cardEl(c)));
 const hs=$('hist');hs.innerHTML=G.hist.map(h=>`<div class="${h.cls}">${h.txt}</div>`).join('');hs.scrollTop=1e6;
 let h=G.hands[0].slice();if(sortMode)h.sort((a,b)=>st(a)-st(b)||a-b);else h=sortCards(h);
 const hd=$('hand');hd.innerHTML='';h.forEach(c=>hd.appendChild(cardEl(c,true)));
 $('myCnt').textContent=G.hands[0].length;
 $('me').className=G.turn===0&&!G.over?'turn':'';
 $('bPlay').disabled=G.over||G.turn!==0;$('bPass').disabled=G.over||G.turn!==0||!G.cur;
}
updMute();updHud();newGame();const DEMO=typeof location!=='undefined'&&location.hash==='#demo';
if(!DEMO&&loginState(PR,new Date()).canClaim)setTimeout(openDaily,500);
