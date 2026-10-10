// ---------- v9: độ khó máy, chọn cược, âm thanh/nhạc nền, nhiệm vụ tuần, huy hiệu bậc ----------
let AI_SET=(()=>{const v=localStorage.getItem('tlmn_ai');return v==null?'r':v;})();
let BOTAI=[null,1,1,1];
const _rb=rollBots;rollBots=function(){_rb();const my=levelInfo(PR.xp).level;[1,2,3].forEach(p=>{const l=AI_SET==='r'?aiPickLevel(my):+AI_SET;BOTAI[p]=l;BOTLV[p]=aiBotLevel(l);});};
// chỉ dùng bài đã đánh ra (thông tin công khai), không nhìn bài chưa chia/bài người khác
function publicPlayed(){return G.played||[];}
const _dp9=doPlay;doPlay=function(p,c){if(G&&!G.online)(G.played=G.played||[]).push(...c);return _dp9(p,c);};
step=function(){if(!G||G.online||G.over||G.turn===0)return;const fast=G.hands[0].length===0;const t0=Date.now();
 setTimeout(()=>{if(G.over||G.online)return;const p=G.turn;if(p===0)return;const ord=[1,2,3].map(k=>(p+k)%4);
  const others=ord.filter(q=>G.hands[q].length).map(q=>G.hands[q].length);
  const table={counts:ord.map(q=>G.hands[q].length),passed:ord.map(q=>G.passed[q]),curBy:G.curBy==null?null:(G.curBy-p+4)%4};
  const lv=BOTAI[p]==null?1:BOTAI[p];
  let m=aiMove(lv,G.hands[p],G.cur,G.first?G.firstCard:null,{played:publicPlayed(),others:others.length?others:[13],table,budget:fast?60:150});
  if(m&&!(detect(m)&&canBeat(detect(m),G.cur)&&m.every(c=>G.hands[p].includes(c))&&(!G.first||m.includes(G.firstCard))))m=botMove(G.hands[p],G.cur,G.first?G.firstCard:null,others);
  if(m)doPlay(p,m);else if(!G.cur)doPlay(p,[G.hands[p][0]]);else doPass(p);},fast?(RM?150:220):(RM?600:(lvDelay())));};
function lvDelay(){return 750+Math.random()*350;}
// chỉ báo độ khó
const AI_COL=['#8bc34a','#90a4ae','#ff9800','#e53935'];
const _r9=render;render=function(){_r9();if(!G)return;[1,2,3].forEach(p=>{const a=document.querySelector('#s'+p+' .av');if(!a||!a.insertAdjacentHTML||G.online)return;const l=BOTAI[p];if(l==null)return;
  a.insertAdjacentHTML('beforeend',`<span class="aitag" style="--ac:${AI_COL[l]}" title="Độ khó: ${AI_NAMES[l]}">${'★'.repeat(l+1)}</span>`);});
 if(G&&!G.over&&G.hands[0].length>=10&&[1,2,3].some(p=>G.hands[p].length&&G.hands[p].length<=2&&(!G.seats||G.seats.includes(p))))G.cb=true;};
// thưởng/ngữ cảnh cuối ván
const _hp9=hookPlay;hookPlay=function(info,prev){if(G&&!G.online){if((info.top>>2)===12&&info.type!=='straight')G.usedTwo=true;
  if(G.hands[0].length===info.len&&info.type==='single'&&info.top===0)G.last3s=true;}PR._tbl=G&&G.n||4;_hp9(info,prev);};
hookEnd=function(place,instant,n){let ctx={};
 if(G&&G.online)ctx={online:true};
 else if(G){const f=G.finished,seats=G.seats||[0,1,2,3],all=[...f,...seats.filter(p=>!f.includes(p))];const below=all.slice(all.indexOf(0)+1).filter(p=>p);
  ctx={bonus:aiBeatBonus(all,0,BOTAI),beatHard:below.filter(p=>BOTAI[p]>=2).length,beatMaster:below.filter(p=>BOTAI[p]===3).length,usedTwo:!!G.usedTwo,last3s:!!G.last3s&&place===0,comeback:!!G.cb&&place===0};}
 const r=onGameEnd(PR,place,instant,n||4,ctx);if(G)G.lastRes=r;
 toast(`${['Nhất','Nhì','Ba','Bét'][place]}: ${r.delta>=0?'+':''}${fmt(r.delta)} xu${r.bxu?` (thưởng máy khó +${fmt(r.bxu)})`:''}`);badgeToasts(r.badges);levelUpFX(r.lv);saveP();
 if(PR.xu<BETS[0])setTimeout(()=>openDaily(),1200);};
const _sr=showResult;showResult=function(rank){_sr(rank);const m=$('modalIn');if(!m||!G)return;
 const rows=m.querySelectorAll('.row');rank.forEach((p,i)=>{if(p&&BOTAI[p]!=null&&rows[i])rows[i].insertAdjacentHTML('beforeend',`<span class="aitag inl" style="--ac:${AI_COL[BOTAI[p]]}">${AI_NAMES[BOTAI[p]]}</span>`);});
 const r=G.lastRes;if(r&&r.bonus>0&&rows.length)rows[rows.length-1].insertAdjacentHTML('afterend',`<div class="row" style="color:#ffd84d"><b style="flex:1">🏅 Thưởng về trên máy khó +${Math.round(r.bonus*100)}%</b><span>+${fmt(r.bxu)} xu · +${r.bxp} XP</span></div>`);};
// ---- Chọn bàn + mức cược
const BETS2=[100,200,500,1000,2000,5000];let pickN=TBL||4;
function suggestBet(){const ok=BETS2.filter(b=>b*8<=PR.xu);return ok.length?ok[ok.length-1]:BETS2[0];}
openTables=function(){if(!BETS2.includes(PR.bet)||PR.bet>PR.xu)PR.bet=Math.min(suggestBet(),PR.xu>=100?suggestBet():100);const sug=suggestBet();
 const opt=n=>{const x=TABLE_XP[n],pl=PLACE_XU[n].map(m=>(m>0?'+':'')+fmt(Math.round(PR.bet*m))).join(' / ');
  return `<button class="alt ${pickN===n?'on':''}" onclick="pickN=${n};openTables()"><span class="seats">${'👤'.repeat(n)}</span><span class="ti"><b>Bàn ${n} người</b><small>Xu: ${pl}</small></span><span class="mul">XP ×${x}</span></button>`;};
 modal(`<h3>${I('bot')} Chơi với máy</h3><p class="small">1. Chọn số người</p><div class="tsel">${opt(2)}${opt(3)}${opt(4)}</div>
 <p class="small" style="margin-top:12px">2. Chọn mức cược · Bạn có ${I('coin')} ${fmt(PR.xu)}</p><div class="betrow">${BETS2.map(b=>`<button class="${b===PR.bet?'':'alt'}" ${b>PR.xu?'disabled':''} onclick="PR.bet=${b};saveP();updHud();openTables()">${fmt(b)}${b===sug?'<small>gợi ý</small>':''}</button>`).join('')}</div>
 <p class="small">Độ khó máy: <b>${AI_SET==='r'?'Ngẫu nhiên (theo cấp của bạn)':AI_NAMES[+AI_SET]}</b> · đổi trong Cài đặt</p>
 <button class="bigbtn" onclick="startTable(pickN)" ${PR.xu<PR.bet?'disabled':''}>${I('bot')} VÀO BÀN ${pickN} NGƯỜI · ${fmt(PR.bet)} xu</button>`);};
// ---- Âm thanh nâng cấp + nhạc nền
let MUSIC=localStorage.getItem('tlmn_music')==='1',MVOL=+(localStorage.getItem('tlmn_mvol')||0.35);
function chord(fs,d,type,vol,delay){fs.forEach((f,i)=>tone(f,d,type,vol,(delay||0)+i*0.01));}
Object.assign(SND,{
 tap:()=>{tone(1200,.035,'triangle',.06);noise(.02,.08,0,4000);},
 play:()=>{noise(.07,.3,0,2500);noise(.05,.2,.03,900);tone(260,.09,'triangle',.12,0,150);},
 deal:()=>{for(let i=0;i<10;i++){noise(.05,.18,i*.06,2200+Math.random()*1500);}tone(180,.25,'sine',.05,0,120);},
 coin:()=>{[1568,2093,2637].forEach((f,i)=>{tone(f,.18,'square',.045,i*.06);tone(f*1.5,.12,'sine',.03,i*.06+.02);});noise(.04,.1,0,6000);},
 chop:()=>{tone(55,.7,'sine',.35,0,30);noise(.5,.55,0);noise(.15,.4,0,3000);tone(140,.35,'sawtooth',.18,.02,50);tone(880,.12,'square',.06,.05,220);},
 win:()=>{[523,659,784,1047].forEach((f,i)=>chord([f,f*1.25],.3,'triangle',.08,i*.12));chord([1047,1319,1568],.7,'sine',.07,.5);},
 fanfare:()=>{const seq=[[392,494,587],[392,494,587],[523,659,784],[587,740,880],[784,988,1175]];seq.forEach((c,i)=>chord(c,i===4?1.0:.22,'sawtooth',.045,i*.18));noise(.8,.2,.72,5000);},
 levelup:()=>{[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.16,'triangle',.08,i*.07));chord([1047,1319,1568,2093],.8,'sine',.05,.45);},
 turn:()=>{tone(784,.1,'sine',.08);tone(1175,.16,'sine',.07,.09);},
});
const _cfx=chopFX;chopFX=function(t){_cfx(t);if(/TỚI TRẮNG/.test(t))setTimeout(()=>sfx('fanfare'),120);};
const _luf=levelUpFX;levelUpFX=function(lv){_luf(lv);if(lv&&lv.ups&&lv.ups.length)setTimeout(()=>sfx('levelup'),900);};
const _ng9=newGame;newGame=function(n){_ng9(n);if(G&&G.started&&!G.over){G.usedTwo=false;G.last3s=false;G.cb=false;sfx('deal');}};
let MUS=null;
function musicStart(){if(!MUSIC||MUS)return;let a;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!AC)AC=new C();a=AC;if(a.state==='suspended')a.resume();}catch(e){return;}
 const g=a.createGain();g.gain.value=MVOL*0.25;const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1400;lp.connect(g).connect(a.destination);
 const sc=[0,2,4,7,9],roots=[220,196,174.6,196];let step=0;
 const tick=()=>{if(!MUS)return;const t=a.currentTime+.05,root=roots[Math.floor(step/16)%4];
  if(step%16===0){[1,1.5,2].forEach(m=>{const o=a.createOscillator(),e=a.createGain();o.type='sine';o.frequency.value=root*m/2;e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(.18,t+.8);e.gain.linearRampToValueAtTime(0,t+3.9);o.connect(e).connect(lp);o.start(t);o.stop(t+4);});}
  if(step%2===0&&Math.random()<.7){const o=a.createOscillator(),e=a.createGain();o.type='triangle';o.frequency.value=root*2*Math.pow(2,sc[Math.floor(Math.random()*5)]/12)*(Math.random()<.3?2:1);
   e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(.12,t+.02);e.gain.exponentialRampToValueAtTime(.001,t+.6);o.connect(e).connect(lp);o.start(t);o.stop(t+.65);}
  step++;};MUS={g,iv:setInterval(tick,250)};}
function musicStop(){if(!MUS)return;clearInterval(MUS.iv);try{MUS.g.disconnect();}catch(e){}MUS=null;}
function setMusic(on){MUSIC=on;localStorage.setItem('tlmn_music',on?'1':'0');on?musicStart():musicStop();}
function setMvol(v){MVOL=v;localStorage.setItem('tlmn_mvol',v);if(MUS)MUS.g.gain.value=v*0.25;}
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('pointerdown',()=>{if(MUSIC&&!MUS)musicStart();},{passive:true});
// ---- Cài đặt
const _os=openSettings;openSettings=function(){_os();const m=$('modalIn');if(!m||!m.querySelector)return;const first=m.querySelector('.row');if(!first)return;
 first.insertAdjacentHTML('beforebegin',`<div class="row"><span style="flex:1">Độ khó máy</span><select onchange="AI_SET=this.value;localStorage.setItem('tlmn_ai',AI_SET)">
  ${[['r','Ngẫu nhiên (mặc định)'],['0','Dễ'],['1','Thường'],['2','Khó'],['3','Cao thủ']].map(([v,t])=>`<option value="${v}" ${AI_SET===v?'selected':''}>${t}</option>`).join('')}</select></div>
  <div class="row"><span style="flex:1">Nhạc nền</span><button class="alt" onclick="setMusic(!MUSIC);openSettings()">${MUSIC?'Đang bật':'Đang tắt'}</button></div>
  <div class="row"><span style="flex:1">Âm lượng nhạc</span><input type="range" min="0" max="1" step="0.05" value="${MVOL}" oninput="setMvol(+this.value)" style="flex:1"></div>`);};
// ---- Sự kiện nhiệm vụ/huy hiệu từ ném đồ, quay, mua, biểu cảm
function evBadge(){badgeToasts(checkBadges(PR));saveP();}
const _st9=sendThrow;sendThrow=function(ls,id){const x0=PR.xu;_st9(ls,id);if(PR.xu<x0){const t=THROWS.find(x=>x.id===id);questEvent(PR,'throw');if(id==='egg')questEvent(PR,'egg');if(t&&t.nice)questEvent(PR,'gift');evBadge();}};
const _sn9=spinNow;spinNow=function(){const n0=(PR.spin&&PR.spin.total)||0;_sn9();if(((PR.spin&&PR.spin.total)||0)>n0){PR.stats.spins=(PR.stats.spins||0)+1;questEvent(PR,'spin');evBadge();}};
const _db9=doBuy;doBuy=function(id){const had=owns(PR,id);_db9(id);if(!had&&owns(PR,id)){PR.stats.buys=(PR.stats.buys||0)+1;questEvent(PR,'buy');evBadge();}};
const _se9=sendEmote;sendEmote=function(e){_se9(e);questEvent(PR,'emote');saveP();};
// ---- Nhiệm vụ ngày + tuần
openQuests=function(){ensureDaily(PR,new Date());const m=new Date();m.setHours(24,0,0,0);const hh=Math.ceil((m-new Date())/36e5);
 const nx=new Date(PR.quests.week.key.replace(/-/g,'/'));nx.setDate(nx.getDate()+7);const dd=Math.ceil((nx-new Date())/864e5);
 const row=(q,i,w)=>{const d=questDef(q.id),done=q.prog>=d.goal;return `<div class="row"><div style="flex:1">${d.name} <small>(${q.prog}/${d.goal})</small><div class="bar"><i style="width:${100*q.prog/d.goal}%"></i></div></div>${q.claimed?I('check'):`<button ${done?'':'disabled'} onclick="doClaimQuest(${i},${w})">+${fmt(d.xu)}</button>`}</div>`;};
 modal(`<h3>${I('quest')} Nhiệm vụ</h3><h4>Hằng ngày <small class="small">· làm mới sau ~${hh} giờ</small></h4>${PR.quests.list.map((q,i)=>row(q,i,0)).join('')}
 <h4>Hằng tuần <small class="small">· còn ${dd} ngày · thưởng lớn</small></h4>${PR.quests.week.list.map((q,i)=>row(q,i,1)).join('')}<p class="small">Mỗi nhiệm vụ hoàn thành tặng thêm 1 lượt vòng quay 🎡</p>`);};
doClaimQuest=function(i,w){const r=claimQuest(PR,i,!!w);if(r){toast(`Hoàn thành nhiệm vụ +${fmt(r)} xu`);ensureSpin(PR,new Date()).extra++;toast('+1 lượt quay may mắn 🎡');}
 const lq=PR._lastLv;delete PR._lastLv;if(lq)levelUpFX(lq);badgeToasts(checkBadges(PR));saveP();openQuests();};
// ---- Huy hiệu theo bậc + bí mật
openBadges=function(){const n=Object.keys(PR.badges).filter(k=>BADGES.find(b=>b.id===k)).length;
 modal(`<h3>${I('medal')} Huy hiệu (${n}/${BADGES.length})</h3><div class="grid">`+BADGES.map(b=>{const u=!!PR.badges[b.id],T=BADGE_TIER[b.tier||1];
  if(b.secret&&!u)return `<div class="badge lock secret"><div class="ic">❓</div><b>???</b><br><small>Huy hiệu bí mật</small></div>`;
  return `<div class="badge ${u?'':'lock'}" style="--tc:${T.col}"><div class="ic">${u?b.icon:I('lock')}</div><span class="tier">${b.secret?'Bí mật':T.name}</span><b>${b.name}</b><br>${b.desc}<br>${I('coin')}${fmt(b.xu)}</div>`;}).join('')+'</div>'+
 `<p style="font-size:13px">Ván: ${PR.stats.games} · Thắng: ${PR.stats.wins} · Chuỗi tốt nhất: ${PR.stats.bestStreak} · Chặt heo: ${PR.stats.chops} · Hạ Cao thủ: ${PR.stats.beatMaster||0}</p>`);};
// ---- Hoạt cảnh chia bài
let DEALING=false,_dealSkip=null;
Object.assign(SND,{shuffle:()=>{for(let i=0;i<14;i++)noise(.035,.16,i*.035,2500+Math.random()*2500);},tick:()=>{noise(.025,.12,0,3500);tone(1800,.02,'triangle',.025);},
 flip:()=>{noise(.06,.2,0,1500);noise(.06,.2,.08,2200);tone(600,.08,'triangle',.05,.05,900);}});
function seatPt(p){const e=p===0?$('hand'):document.querySelector('#s'+p+' .av');const r=e&&e.getBoundingClientRect();return r&&r.width?{x:r.left+r.width/2,y:r.top+r.height/2}:{x:innerWidth/2,y:p===0?innerHeight-80:80};}
function dealAnim(seats,done){const tb=($('table')||document.body).getBoundingClientRect(),cx=tb.left+tb.width/2,cy=tb.top+tb.height/2;
 const ov=document.createElement('div');ov.id='dealFX';document.body.appendChild(ov);const hand=$('hand');if(hand)hand.classList.add('dealhide');
 let ended=false,timers=[];const end=()=>{if(ended)return;ended=true;timers.forEach(clearTimeout);ov.remove();_dealSkip=null;
  if(hand){hand.classList.remove('dealhide');hand.classList.add('dealflip');setTimeout(()=>hand.classList.remove('dealflip'),500);}sfx('flip');done();};
 _dealSkip=end;ov.addEventListener('pointerdown',end);
 const mk=(x,y)=>{const c=document.createElement('div');c.className='back dcard';c.style.left=x+'px';c.style.top=y+'px';ov.appendChild(c);return c;};
 if(RM){mk(cx,cy);sfx('shuffle');timers.push(setTimeout(end,450));return;}
 const deck=[];for(let i=0;i<6;i++){const c=mk(cx,cy);c.style.transform=`translate(-50%,-50%) translateY(${-i}px)`;deck.push(c);}
 sfx('shuffle');deck.forEach((c,i)=>c.animate([{transform:c.style.transform},{transform:`translate(${i%2?-70:30}%,-50%) rotate(${i%2?-8:8}deg)`},{transform:c.style.transform}],{duration:260,iterations:2,delay:i*12}));
 const per=Math.max(16,Math.round(1250/(13*seats.length)));let k=0;const P=Object.fromEntries(seats.map(p=>[p,seatPt(p)]));
 timers.push(setTimeout(()=>{deck.forEach(c=>c.remove());for(let r=0;r<13;r++)for(const p of seats){const i=k++;timers.push(setTimeout(()=>{const c=mk(cx,cy),t=P[p];
   c.animate([{transform:'translate(-50%,-50%) rotate(0)'},{transform:`translate(calc(-50% + ${t.x-cx}px),calc(-50% + ${t.y-cy}px)) rotate(${(i*47)%40-20}deg) scale(.8)`,opacity:.9}],{duration:230,easing:'ease-out',fill:'forwards'});
   if(i%2===0)sfx('tick');setTimeout(()=>c.remove(),240);},i*per));}
  timers.push(setTimeout(end,13*seats.length*per+280));},560));}
const _st10=step;step=function(){if(DEALING)return;return _st10();};
const _hpl=humanPlay;humanPlay=function(){if(DEALING)return;return _hpl();};
const _hps=humanPass;humanPass=function(){if(DEALING)return;return _hps();};
const _ng10=newGame;newGame=function(n){DEALING=true;try{_ng10(n);}catch(e){DEALING=false;throw e;}
 if(!G||G.online||G.over||!G.started){DEALING=false;return;}const seats=G.seats||[0,1,2,3];
 dealAnim(seats,()=>{DEALING=false;render();if(G&&!G.over){if(G.turn===0)sfx('turn');step();}});};
// online: hoạt cảnh khi nhận ván mới (chỉ hình ảnh)
let _lastDealKey=null;const _os10=onlineState;onlineState=function(st,fh){_os10(st,fh);try{if(st&&st.hands&&!st.over&&(!st.hist||!st.hist.length)){const k=JSON.stringify(st.hands.map(h=>h&&h.length))+(st.firstCard)+(st.deal||'')+(st.turn);
  if(k!==_lastDealKey){_lastDealKey=k;if(!$('dealFX'))dealAnim(G&&G.seats||[0,1,2,3],()=>render());}}else if(st&&st.hist&&st.hist.length)_lastDealKey=null;}catch(e){}};
// online: chủ bàn chọn độ khó máy lấp ghế
function setTableAi(v){if(!ONL.host)return;if(ONL.st&&!ONL.st.over)return toast('Chỉ đổi giữa các ván');ONL.host.opt.ai=+v;ONL.host.push();toast('Độ khó máy: '+AI_NAMES[+v]);}
const _rr10=renderRoom;renderRoom=function(){_rr10.apply(this,arguments);try{const sel=[...document.querySelectorAll('select')].find(s=>/setTableBet/.test(s.getAttribute('onchange')||''));
 const lv=(ONL.room&&ONL.room.ai!=null)?ONL.room.ai:1;const row=sel?sel.closest('.row'):null;if(!row||document.getElementById('aiRow'))return;
 row.insertAdjacentHTML('afterend',`<div class="row" id="aiRow"><span style="flex:1">Độ khó máy</span>${ONL.host?`<select onchange="setTableAi(this.value)">${AI_NAMES.map((n,i)=>`<option value="${i}" ${i===lv?'selected':''}>${n}</option>`).join('')}</select>`:`<b>${AI_NAMES[lv]}</b>`}</div>`);}catch(e){}};
// ---- Máy nói chuyện / tính cách
let CHAT_SET=localStorage.getItem('tlmn_chat')||'v';
const LINES={
 uncle:{idle:['Nhanh lên con ơi, chú đợi muốn mọc râu rồi!','Đánh lẹ đi, nồi cơm nhà chú sắp khét!','Thời chú đánh bài, nghĩ có ba giây à!','Ngủ gật rồi hả cháu?','Trời đất, suy nghĩ gì lâu dữ vậy?','Lẹ lẹ cái tay giùm chú cái!'],
  chopped:['Trời ơi heo của tui!','Ác quá vậy trời!','Con heo chú nuôi cả năm đó!','Thôi xong, mất heo rồi!','Đánh vậy ai chơi lại!'],chop:['Ăn nè! Chú còn nghề lắm!','Gừng càng già càng cay nha!','Chặt cái cho biết mùi!','Heo này chú xin nha!'],
  one:['Báo 1 nha, coi chừng đó!','Còn một lá thôi nghe!','Chú sắp về rồi đó!'],pass:['Thôi, bỏ.','Cho qua, cho qua.','Ván này chú nhường.','Đánh gì mà ghê vậy, bỏ!'],
  win:['Hehe, gừng già vẫn cay!','Chú về nhất, ván nữa nào!','Thấy chưa, kinh nghiệm cả đó!'],lose:['Bài xấu quá, ván nữa!','Thua keo này ta bày keo khác!','Tại xào bài không kỹ!'],
  instant:['Trời đất ơi, tới trắng luôn!','Hên dữ thần vậy!'],hit:['Ê ê, ném chú làm chi!','Trời, hư áo chú rồi!','Già rồi tha cho chú đi!'],gift:['Cảm ơn nha, cháu ngoan quá!','Ui, quý hóa quá!']},
 girl:{idle:['Nhanh lên bạn ơi!','Ngủ gật rồi hả?','Ơ kìa, bạn đang nhắn tin cho ai đó?','Đánh lẹ đi, em đợi nãy giờ á!','Suy nghĩ lâu vậy, tính lừa em hả?','Bạn ơi tỉnh dậy đi nè~'],
  chopped:['Huhu heo của em!','Ác ghê á, nhớ mặt nha!','Chặt heo con gái là không đẹp trai đâu!','Á á, sao lại chặt em!'],chop:['Ăn nè! Bất ngờ chưa?','Hihi, heo này của em nha!','Xin lỗi nha, em hông cố ý đâu~','Chặt cái cho vui!'],
  one:['Báo 1 nha!','Em còn đúng một lá thôi á~','Cẩn thận nha, em sắp về!'],pass:['Thôi em bỏ.','Cho bạn đó!','Hông chơi lượt này.','Pass nha~'],
  win:['Yeah! Em về nhất!','Hihi, ván nữa hông?','Dễ quá à~'],lose:['Ván nữa! Phải gỡ!','Hông chịu đâu, chơi lại!','Lần này em nhường thôi đó!'],
  instant:['Wow, tới trắng luôn kìa!','Hên vậy trời!'],hit:['Ơ, ném em hả? Giận á!','Á, dơ đồ em rồi!','Nhớ đó nha!'],gift:['Ui, dễ thương quá!','Cảm ơn nha~ thương thương!']},
 brag:{idle:['Nhanh lên bạn, tui đánh nhanh lắm!','Lâu vậy, sợ tui hả?','Ngủ gật rồi hả bạn?','Suy nghĩ chi, đằng nào cũng thua tui!','Đánh lẹ đi, tui còn đi khoe chiến tích!'],
  chopped:['Trời ơi heo của tui!','Ăn may thôi, đừng vui sớm!','Chiêu này tui cố tình nhường đó!','Ê, chơi vậy ai chơi!'],chop:['Ăn nè! Đẳng cấp là đây!','Thấy trình chưa?','Chặt gọn như chơi!','Tui mà, có gì lạ!'],
  one:['Báo 1 nha, chuẩn bị thua đi!','Một lá cuối, ai cản nổi!','Sắp về nhất rồi nha!'],pass:['Nhường đó, cho cơ hội.','Bỏ, để dành bài mạnh.','Lượt này cho mấy bạn chơi.'],
  win:['Nhất rồi, còn ai nữa không?','Đẳng cấp khác biệt!','Ván nữa, tui chấp luôn!'],lose:['Ván nữa! Lần này tui chơi thật!','Tại tui cho nhường thôi!','Bài xấu chứ trình tui đâu có tệ!'],
  instant:['Tới trắng hả? Hên thôi!','Ghê, nhưng chưa bằng tui!'],hit:['Ném tui hả? Gan đó!','Áo hiệu của tui đó!','Ganh tị với tui à?'],gift:['Biết điều đó!','Fan của tui hả?']},
 master:{idle:['…','Không vội. Nhưng bài không chờ người.','Suy nghĩ lâu chưa chắc đã hay.','Ta đợi.','Gió đã nổi rồi đó.'],
  chopped:['Hừm. Khá lắm.','Một con heo, đổi một bài học.','Ta nhớ nước này.'],chop:['Ăn.','Đúng lúc.','Bài có lúc lên lúc xuống.','Cẩn tắc vô áy náy.'],
  one:['Báo 1.','Còn một.','Sắp kết thúc rồi.'],pass:['Qua.','…','Chưa phải lúc.'],
  win:['Bình thường thôi.','Kiên nhẫn là chiến thắng.','Ván sau sẽ khó hơn.'],lose:['Thắng thua là chuyện thường.','Ván nữa.','Ta đã thấy sơ hở của mình.'],
  instant:['Thiên ý.','Hiếm có.'],hit:['…Vô ích.','Ném đồ không thắng được bài.'],gift:['Đa tạ.','Lòng tốt đáng quý.']}};
function persona(p){if(BOTAI[p]===3)return'master';const n=NAMES[p]||'',av=(AVATARS[p]||[])[0]||'';if(/^(Ông|Chú|Bác|Bà|Dì)/.test(n)||/👴|🧓|👵/.test(av))return'uncle';if(AV_EMO.f.includes(av)||AV_EMO.of.includes(av))return'girl';return'brag';}
let _lastSay=0,_lastLine={};
function botSay(p,ev,prob){if(CHAT_SET==='off'||!G||G.online||!p||!(G.seats||[0,1,2,3]).includes(p))return false;const many=CHAT_SET==='n';
 const now=Date.now(),gap=many?1500:3200;if(now-_lastSay<gap)return false;if(Math.random()>(prob==null?1:prob)*(many?1.4:0.8))return false;
 const pool=(LINES[persona(p)]||LINES.brag)[ev];if(!pool)return false;let l;do{l=pool[Math.floor(Math.random()*pool.length)];}while(pool.length>1&&l===_lastLine[p]);
 _lastLine[p]=l;_lastSay=now;showEmote(p,l);const hb=(p===0?$('meInfo'):$('s'+p));const bb=hb&&hb.querySelector&&[...hb.querySelectorAll('.bubble')].pop();if(bb)bb.classList.add('say');sfx('pop');return true;}
Object.assign(SND,{pop:()=>{tone(520,.06,'sine',.08,0,900);},knock:()=>{[0,.16,.32].forEach(d=>{tone(90,.12,'sine',.35,d,60);noise(.05,.3,d,400);});}});
function botThrow(p,to,nice){if(CHAT_SET==='off'||!G||G.online)return;if(Math.random()>(CHAT_SET==='n'?.3:.15))return;const id=nice?(Math.random()<.5?'flower':'beer'):(Math.random()<.6?'egg':'tomato');
 setTimeout(()=>{try{throwFX(p,to,id);}catch(e){}},700);}
const _dp11=doPlay;doPlay=function(p,cards){const prev=G&&G.cur,prevBy=G&&G.curBy;const r=_dp11(p,cards);try{if(G&&!G.online){const info=detect(cards);
  const chop=prev&&(prev.top>>2)===12&&info&&info.type!==prev.type;
  if(chop){if(p)botSay(p,'chop',1);if(prevBy){setTimeout(()=>{_lastSay=0;botSay(prevBy,'chopped',1);botThrow(prevBy,p,false);},900);}}
  else if(p&&G.hands[p].length===1)botSay(p,'one',.8);}}catch(e){}return r;};
const _dps11=doPass;doPass=function(p){const r=_dps11(p);if(p)botSay(p,'pass',.18);return r;};
const _eg11=endGame;endGame=function(instant){const r=_eg11(instant);try{if(G&&!G.online){const f=G.finished,seats=G.seats||[0,1,2,3],all=[...f,...seats.filter(q=>!f.includes(q))];
  const w=all[0],l=all[all.length-1];setTimeout(()=>{_lastSay=0;if(instant){botSay(seats.find(q=>q&&q!==w)||0,'instant',1);return;}if(w)botSay(w,'win',1);
   setTimeout(()=>{_lastSay=0;if(l&&l!==w)botSay(l,'lose',1);if(w===0&&l)botThrow(l,0,Math.random()<.5);},1400);},600);}}catch(e){}return r;};
const _tf11=throwFX;throwFX=function(from,to,id){const r=_tf11(from,to,id);try{if(to&&from!==to){const t=THROWS.find(x=>x.id===id);setTimeout(()=>{_lastSay=0;botSay(to,t&&t.nice?'gift':'hit',from===0?.9:.6);},900);}}catch(e){}return r;};
// giục khi người chơi lâu
let _idleT0=0,_idleTurn=null,_idleStage=0;
setInterval(()=>{if(!G||G.online||G.over||DEALING||document.body.classList.contains('athome')){_idleTurn=null;return;}const key=G.turn===0?(G.hist.length+':'+G.hands[0].length):null;
 if(key!==_idleTurn){_idleTurn=key;_idleT0=Date.now();_idleStage=0;return;}if(key==null||CHAT_SET==='off')return;const dt=Date.now()-_idleT0;
 if(dt>8000&&_idleStage===0){_idleStage=1;const bs=(G.seats||[1,2,3]).filter(q=>q);_lastSay=0;botSay(bs[Math.floor(Math.random()*bs.length)],'idle',1);}
 else if(dt>15000&&_idleStage===1){_idleStage=2;sfx('knock');const bs=(G.seats||[1,2,3]).filter(q=>q);_lastSay=0;botSay(bs[Math.floor(Math.random()*bs.length)],'idle',1);}},1000);
const _os11=openSettings;openSettings=function(){_os11();const m=$('modalIn');const first=m&&m.querySelector&&m.querySelector('.row');if(!first)return;
 first.insertAdjacentHTML('beforebegin',`<div class="row"><span style="flex:1">Máy nói chuyện</span><select onchange="CHAT_SET=this.value;localStorage.setItem('tlmn_chat',CHAT_SET)">${[['n','Nhiều'],['v','Vừa'],['off','Tắt']].map(([v,t])=>`<option value="${v}" ${CHAT_SET===v?'selected':''}>${t}</option>`).join('')}</select></div>`);};

// ---- Ăn mừng huy hiệu toàn màn hình
const BQ=[];let _bShow=false;
const _bt12=badgeToasts;badgeToasts=function(list){if(!list||!list.length)return;BQ.push(...list);flushBadges();};
function badgeIdle(){return document.body.classList.contains('athome')||!G||G.over||(G.turn===0&&!G.cur&&!DEALING&&false);}
function flushBadges(){if(_bShow||!BQ.length)return;if(!badgeIdle()){return;}const b=BQ.shift();_bShow=true;
 const T=b.secret?{name:'Bí mật',col:'#b388ff'}:BADGE_TIER[b.tier||1];const o=document.createElement('div');o.id='badgeFX';o.className=RM?'rm':'';o.style.setProperty('--tc',T.col);
 const conf=RM?'':Array.from({length:40},(_,i)=>`<i style="left:${(i*37)%100}%;background:${['#ffd84d','#ff6b6b','#4dd0e1','#b388ff','#81c784',T.col][i%6]};animation-delay:${(i%10)*.12}s;animation-duration:${1.8+(i%5)*.3}s"></i>`).join('');
 o.innerHTML=`<div class="rays"></div><div class="conf">${conf}</div><div class="bbox"><div class="btier">Huy hiệu ${T.name}</div><div class="bic">${b.icon}</div><h2>${b.name}</h2><p>${b.desc}</p><div class="bxu">${I('coin')} +<span>0</span> xu</div><button>Tuyệt vời!</button></div>`;
 document.body.appendChild(o);sfx('fanfare');const sp=o.querySelector('.bxu span');const t0=performance.now();
 const tick=t=>{const k=RM?1:Math.min(1,(t-t0)/1100);sp.textContent=fmt(Math.round(b.xu*k));if(k<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);
 const close=()=>{o.remove();_bShow=false;setTimeout(flushBadges,250);};o.addEventListener('click',close);}
setInterval(flushBadges,1000);
// ---- Bảng xếp hạng online
function lbWeek(){const k=weekKey(new Date());if(!PR.wk||PR.wk.key!==k)PR.wk={key:k,wins:0,xp:0};return PR.wk;}
const _he12=hookEnd;hookEnd=function(place,instant,n){const x0=PR.xp;_he12(place,instant,n);const w=lbWeek();w.xp+=Math.max(0,PR.xp-x0);if(place===0)w.wins++;saveP();};
function lbStats(){const w=lbWeek();let ns=null;try{ns=equipped(PR,'name').id;}catch(e){}return{xp:PR.xp|0,xu:PR.xu|0,wins:PR.stats.wins|0,games:PR.stats.games|0,week_key:w.key,week_wins:w.wins|0,week_xp:w.xp|0,frame:equipped(PR,'frame').id,name_style:ns};}
const _cp12=cloudPush;cloudPush=async function(q){const r=await _cp12(q);try{if(USER&&SB)await ensurePlayer();}catch(e){}return r;};
const LB_TABS=[['xp','Cấp độ','xp'],['xu','Giàu nhất','xu'],['wins','Thắng nhiều','wins'],['week','Tuần này','week_wins']];let lbTab='xp';
async function openLeaderboard(tab){if(tab)lbTab=tab;const tabs=`<div class="lbtabs">${LB_TABS.map(([k,n])=>`<button class="${k===lbTab?'':'alt'}" onclick="openLeaderboard('${k}')">${n}</button>`).join('')}</div>`;
 if(typeof USER==='undefined'||!USER||navigator.onLine===false){modal(`<h3>🏆 Bảng xếp hạng</h3>${tabs}<p>${navigator.onLine===false?'Bạn đang ngoại tuyến. Kết nối mạng để xem bảng xếp hạng.':'Hãy <b>đăng nhập</b> để lên bảng xếp hạng cùng mọi người.'}</p>${navigator.onLine===false?'':`<button onclick="openAccount()">${I('user')} Đăng nhập / Đăng ký</button>`}`);return;}
 modal(`<h3>🏆 Bảng xếp hạng</h3>${tabs}<p class="small">Đang tải…</p>`);
 try{await loadSB();await ensurePlayer();const col=LB_TABS.find(t=>t[0]===lbTab)[2],wk=weekKey(new Date());
  let q=SB.from('tlmn_players').select('user_id,name,avatar,level,title,xp,xu,wins,week_wins,week_xp,week_key,frame,name_style').order(col,{ascending:false}).order('xp',{ascending:false}).limit(50);if(lbTab==='week')q=q.eq('week_key',wk);
  const {data,error}=await q;if(error)throw error;const me=data.find(r=>r.user_id===USER.id);let myRank=me?data.indexOf(me)+1:null,myRow=me;
  if(!me){const {data:mr}=await SB.from('tlmn_players').select('user_id,name,avatar,level,title,xp,xu,wins,week_wins,week_key,frame,name_style').eq('user_id',USER.id).maybeSingle();myRow=mr;
   if(mr){let c=SB.from('tlmn_players').select('user_id',{count:'exact',head:true}).gt(col,mr[col]||0);if(lbTab==='week')c=c.eq('week_key',wk);const {count}=await c;myRank=(count||0)+1;}}
  const val=r=>lbTab==='xp'?`Cấp ${r.level} · ${fmt(r.xp)} XP`:lbTab==='xu'?`${I('coin')} ${fmt(r.xu)}`:lbTab==='wins'?`${fmt(r.wins)} thắng`:`${fmt(r.week_wins)} thắng · ${fmt(r.week_xp||0)} XP`;
  const row=(r,i,mine)=>{const a=r.avatar||{};return `<div class="lbrow ${i<3?'pod p'+i:''} ${mine?'mine':''}"><span class="lbn">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><span class="av lbav ${r.frame?'fr-'+r.frame:''}" style="background:${esc(a.bg||'#345')}">${esc(a.av||'🙂')}</span><span class="lbname"><b class="${esc(r.name_style||'')}">${esc(r.name||'Người chơi')}</b><small>${titleHTML?titleHTML({name:esc(r.title||''),tier:((TITLES.find(t=>t.name===r.title)||{}).tier)||1}):esc(r.title||'')}</small></span><span class="lbv">${val(r)}</span></div>`;};
  if(document.querySelector('#modalIn h3')?.textContent.indexOf('xếp hạng')<0)return;
  modal(`<h3>🏆 Bảng xếp hạng</h3>${tabs}${lbTab==='week'?'<p class="small">Làm mới mỗi thứ Hai</p>':''}<div class="lblist">${data.length?data.map((r,i)=>row(r,i,r.user_id===USER.id)).join(''):'<p class="small">Chưa có ai trên bảng.</p>'}</div>
   ${myRow?`<div class="lbme">${row(myRow,(myRank||0)-1,true).replace(/<span class="lbn">[^<]*<\/span>/,`<span class="lbn">#${myRank||'?'}</span>`)}</div>`:''}<p class="small">Số liệu do máy bạn gửi lên khi sao lưu, máy chủ giới hạn mức tăng để chống gian lận.</p>`);
 }catch(e){modal(`<h3>🏆 Bảng xếp hạng</h3>${tabs}<p>Không tải được: ${esc(e.message||String(e))}</p>`);}}
const _rh12=renderHome;renderHome=function(){_rh12();const g=document.querySelector('#home .tiles');if(g&&g.insertAdjacentHTML)g.insertAdjacentHTML('beforeend',`<button class="alt tile" onclick="openLeaderboard()"><span style="font-size:28px;line-height:30px">🏆</span><span>Xếp hạng</span></button>`);};
