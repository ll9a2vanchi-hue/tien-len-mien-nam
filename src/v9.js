// ---------- v9: độ khó máy, chọn cược, âm thanh/nhạc nền, nhiệm vụ tuần, huy hiệu bậc ----------
const AI_SET='r';try{localStorage.removeItem('tlmn_ai');}catch(e){}
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
const _r9=render;render=function(){_r9();if(!G)return;[1,2,3].forEach(p=>{const a=document.querySelector('#s'+p+' .av');if(!a||!a.insertAdjacentHTML)return;const l=G.online?(ONL.botai||[])[p]:BOTAI[p];if(l==null)return;
  a.insertAdjacentHTML('beforeend',`<span class="aitag" style="--ac:${AI_COL[l]}" title="Độ khó: ${AI_NAMES[l]}">${'★'.repeat(l+1)}</span>`);});
 if(G&&!G.over&&G.hands[0].length>=10&&[1,2,3].some(p=>G.hands[p].length&&G.hands[p].length<=2&&(!G.seats||G.seats.includes(p))))G.cb=true;};
// thưởng/ngữ cảnh cuối ván
const _hp9=hookPlay;hookPlay=function(info,prev){if(G&&G.online&&typeof ONL!=='undefined'&&ONL.st){const id=ONL.st.dealId||'x';if(!ONL._gx||ONL._gx.id!==id)ONL._gx={id};if((info.top>>2)===12&&info.type!=='straight')ONL._gx.usedTwo=true;if(G.hands[0].length===0&&info.type==='single'&&info.top===0)ONL._gx.last3s=true;}
  if(G&&!G.online){if((info.top>>2)===12&&info.type!=='straight')G.usedTwo=true;
  if(G.hands[0].length===info.len&&info.type==='single'&&info.top===0)G.last3s=true;}PR._tbl=G&&G.n||4;_hp9(info,prev);};
hookEnd=function(place,instant,n){let ctx={};
 if(G&&G.online){const gx=(ONL._gx&&ONL.st&&ONL._gx.id===(ONL.st.dealId||'x'))?ONL._gx:{};ctx={online:true,usedTwo:!!gx.usedTwo,last3s:!!gx.last3s&&place===0};}
 else if(G){const f=G.finished,seats=G.seats||[0,1,2,3],all=[...f,...seats.filter(p=>!f.includes(p))];const below=all.slice(all.indexOf(0)+1).filter(p=>p);
  ctx={bonus:aiBeatBonus(all,0,BOTAI),noXuBonus:masterTbl(),beatHard:below.filter(p=>BOTAI[p]>=2).length,beatMaster:below.filter(p=>BOTAI[p]===3).length,usedTwo:!!G.usedTwo,last3s:!!G.last3s&&place===0,comeback:!!G.cb&&place===0};}
 ctx.mode=G&&G.mode==='demla'?'demla':'tlmn';PR._mode=ctx.mode;try{Object.assign(ctx,modeCtx(place,instant));}catch(e){}
 const r=onGameEnd(PR,place,instant,n||4,ctx);if(G)G.lastRes=r;try{LEDG.res=r;}catch(e){}
 toast(`${['Nhất','Nhì','Ba','Bét'][place]}: ${r.delta>=0?'+':''}${fmt(r.delta)} xu${r.bxu?` (thưởng máy khó +${fmt(r.bxu)})`:''}`);badgeToasts(r.badges);levelUpFX(r.lv);saveP();
 if(PR.xu<BETS[0])setTimeout(()=>openDaily(),1200);};
const _sr=showResult;showResult=function(rank){_sr(rank);const m=$('modalIn');if(!m||!G)return;
 const rows=m.querySelectorAll('.row');rank.forEach((p,i)=>{if(p&&BOTAI[p]!=null&&rows[i])rows[i].insertAdjacentHTML('beforeend',`<span class="aitag inl" style="--ac:${AI_COL[BOTAI[p]]}">${AI_NAMES[BOTAI[p]]}</span>`);});
 const r=G.lastRes;if(r&&r.bonus>0&&rows.length)rows[rows.length-1].insertAdjacentHTML('afterend',`<div class="row" style="color:#ffd84d"><b style="flex:1">🏅 Thưởng về trên máy khó +${Math.round(r.bonus*100)}%${r.bxu?'':(G&&G.mode==='demla'?' (chỉ XP · Đếm lá)':' (chỉ XP · bàn 10k)')}</b><span>${r.bxu?'+'+fmt(r.bxu)+' xu · ':''}+${r.bxp} XP</span></div>`);};
// ---- Chọn bàn + mức cược
const BETS2=[100,200,500,1000,2000,5000,10000];const MASTER_BET=10000;function masterTbl(){try{return !(typeof ONL!=='undefined'&&ONL.active)&&(PR.bet||0)>=MASTER_BET;}catch(e){return false;}}
const _apl41=aiPickLevel;aiPickLevel=function(l,r){return masterTbl()?3:_apl41(l,r);};
function setTblBet(b){const was=(PR.bet||0)>=MASTER_BET;PR.bet=b;if(was!==(b>=MASTER_BET)&&typeof newBotsNext==='function')newBotsNext();saveP();updHud();openTables();}let pickN=TBL||4;
function suggestBet(){const ok=BETS2.filter(b=>b<MASTER_BET&&b*8<=PR.xu);return ok.length?ok[ok.length-1]:BETS2[0];}
openTables=function(){if(!BETS2.includes(PR.bet)||PR.bet>PR.xu)PR.bet=Math.min(suggestBet(),PR.xu>=100?suggestBet():100);const sug=suggestBet();
 const opt=n=>{const x=TABLE_XP[n],pl=PLACE_XU[n].map(m=>{const v=Math.round(PR.bet*m);return (v>0?'+':v<0?'−':'')+kxu(Math.abs(v));}).join(' / ');
  return `<button class="alt ${pickN===n?'on':''}" onclick="pickN=${n};openTables()"><span class="seats">${'👤'.repeat(n)}</span><span class="ti"><b>Bàn ${n} người</b><small>Xu: ${pl}</small></span><span class="mul">XP ${((()=>{try{return modeOf()}catch(e){return ''}})()==='demla'?XP_DEMLA_N:XP_PLACE_N)[n].join('/')}</span></button>`;};
 modal(`<h3>${I('bot')} Chơi với máy</h3><p class="small">1. Chọn số người</p><div class="tsel">${opt(2)}${opt(3)}${opt(4)}</div>
 <p class="small" style="margin-top:12px">2. Chọn mức cược · Bạn có ${I('coin')} ${fmt(PR.xu)}</p><div class="betrow">${BETS2.map(b=>`<button ${b>PR.xu?'disabled':''} onclick="setTblBet(${b})" class="${b>=MASTER_BET?'mbet ':''}${b===PR.bet?'':'alt'}">${b>=MASTER_BET?'10k':fmt(b)}${b>=MASTER_BET?'<small>Cao thủ</small>':b===sug?'<small>gợi ý</small>':''}</button>`).join('')}</div>${PR.bet>=MASTER_BET?'<p class="small mnote">🥋 Bàn 10.000: toàn bộ máy là <b>Cao thủ</b>. Thắng máy Cao thủ vẫn được <b>thưởng thêm XP</b>, nhưng không thưởng thêm xu (xu theo thứ hạng như thường).</p>':'<p class="small mnote">Mức 10k: bàn toàn Cao thủ.</p>'}
 <p class="small">Độ khó máy: <b>${PR.bet>=MASTER_BET?"toàn Cao thủ":"ngẫu nhiên theo cấp của bạn"}</b></p>
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
 first.insertAdjacentHTML('beforebegin',`<div class="row"><span style="flex:1">Nhạc nền</span><button class="alt" onclick="setMusic(!MUSIC);openSettings()">${MUSIC?'Đang bật':'Đang tắt'}</button></div>
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
let DEALING=false,_dealSkip=null,_dealRev=99;
function hideUndealt(){const h=$('hand');if(!h)return;[...h.querySelectorAll('.card')].forEach((c,i)=>{if(i>=_dealRev)c.style.visibility='hidden';});}
Object.assign(SND,{shuffle:()=>{for(let i=0;i<14;i++)noise(.035,.16,i*.035,2500+Math.random()*2500);},tick:()=>{noise(.025,.12,0,3500);tone(1800,.02,'triangle',.025);},
 flip:()=>{noise(.06,.2,0,1500);noise(.06,.2,.08,2200);tone(600,.08,'triangle',.05,.05,900);}});
function seatPt(p){const e=p===0?$('hand'):document.querySelector('#s'+p+' .av');const r=e&&e.getBoundingClientRect();return r&&r.width?{x:r.left+r.width/2,y:r.top+r.height/2}:{x:innerWidth/2,y:p===0?innerHeight-80:80};}
function dealAnim(seats,done){const tb=($('table')||document.body).getBoundingClientRect(),cx=tb.left+tb.width/2,cy=tb.top+tb.height/2;
 const ov=document.createElement('div');ov.id='dealFX';document.body.appendChild(ov);_dealRev=0;hideUndealt();const hcs=()=>{const h=$('hand');return h?[...h.querySelectorAll('.card')]:[];};
 const reveal=i=>{_dealRev=Math.max(_dealRev,i+1);const c=hcs()[i];if(c&&c.style.visibility==='hidden'){c.style.visibility='';if(!RM){c.classList.add('dland');setTimeout(()=>c.classList.remove('dland'),400);}}};
 let ended=false,timers=[];const end=()=>{if(ended)return;ended=true;timers.forEach(clearTimeout);ov.remove();_dealSkip=null;
  _dealRev=99;hcs().forEach((c,i)=>reveal(i));sfx('flip');done();};
 _dealSkip=end;ov.addEventListener('pointerdown',end);
 const mk=(x,y)=>{const c=document.createElement('div');c.className='back dcard';c.style.left=x+'px';c.style.top=y+'px';ov.appendChild(c);return c;};
 if(RM){mk(cx,cy);sfx('shuffle');timers.push(setTimeout(end,450));return;}
 const deck=[];for(let i=0;i<6;i++){const c=mk(cx,cy);c.style.transform=`translate(-50%,-50%) translateY(${-i}px)`;deck.push(c);}
 sfx('shuffle');deck.forEach((c,i)=>c.animate([{transform:c.style.transform},{transform:`translate(${i%2?-70:30}%,-50%) rotate(${i%2?-8:8}deg)`},{transform:c.style.transform}],{duration:260,iterations:2,delay:i*12}));
 const per=Math.max(16,Math.round(1250/(13*seats.length)));let k=0;const P=Object.fromEntries(seats.map(p=>[p,seatPt(p)]));
 timers.push(setTimeout(()=>{deck.forEach(c=>c.remove());for(let r=0;r<13;r++)for(const p of seats){const i=k++;timers.push(setTimeout(()=>{const c=mk(cx,cy),t=P[p];
   c.animate([{transform:'translate(-50%,-50%) rotate(0)'},{transform:`translate(calc(-50% + ${t.x-cx}px),calc(-50% + ${t.y-cy}px)) rotate(${(i*47)%40-20}deg) scale(.8)`,opacity:.9}],{duration:230,easing:'ease-out',fill:'forwards'});
   if(i%2===0)sfx('tick');setTimeout(()=>{c.remove();if(p===0)reveal(r);},235);},i*per));}
  timers.push(setTimeout(end,13*seats.length*per+280));},560));}
const _st10=step;step=function(){if(DEALING)return;return _st10();};
const _hpl=humanPlay;humanPlay=function(){if(DEALING)return;return _hpl();};
const _hps=humanPass;humanPass=function(){if(DEALING)return;return _hps();};
const _ng10=newGame;newGame=function(n){DEALING=true;try{_ng10(n);}catch(e){DEALING=false;throw e;}
 if(!G||G.online||G.over||!G.started){DEALING=false;return;}const seats=G.seats||[0,1,2,3];
 dealAnim(seats,()=>{DEALING=false;render();if(G&&!G.over){if(G.turn===0)sfx('turn');step();}});};
// online: hoạt cảnh khi nhận ván mới (chỉ hình ảnh)
let _lastDealKey=null;const _os10=onlineState;onlineState=function(st,fh){const fresh=st&&st.dealId&&st.dealId!==_lastDealKey&&!st.over&&(!st.pile||!st.pile.length)&&(st.hist||[]).length<=1&&!(st.finished||[]).length;
 if(st&&st.dealId&&st.dealId!==_lastDealKey&&!fresh)_lastDealKey=st.dealId;/* vào muộn / kết nối lại: bỏ qua */
 if(fresh){_lastDealKey=st.dealId;DEALING=true;_dealRev=0;}
 _os10(st,fh);if(DEALING&&G&&G.online)hideUndealt();
 try{if(fresh){if(_dealSkip)_dealSkip();DEALING=true;_dealRev=0;dealAnim(G&&G.seats||[0,1,2,3],()=>{DEALING=false;_tKey=null;render();if(G&&!G.over&&G.turn===0)sfx('turn');});}}catch(e){DEALING=false;}};
const _r10=render;render=function(){_r10();if(DEALING)hideUndealt();};
// ---- Ăn mừng huy hiệu toàn màn hình
const BQ=[];let _bShow=false;
const _bt12=badgeToasts;badgeToasts=function(list){if(!list||!list.length)return;BQ.push(...list);flushBadges();};
function badgeIdle(){if(typeof FIN!=='undefined'&&FIN.active)return false;if(typeof _endHold!=='undefined'&&_endHold)return false;if(document.body.classList.contains('rewardfx'))return false;return document.body.classList.contains('athome')||!G||G.over||(G.turn===0&&!G.cur&&!DEALING&&false);}
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
  const {data,error}=await q;if(error)throw error;const me=data.find(r=>r.user_id===USER.id);let myRank=me?data.indexOf(me)+1:null,myRow=me;try{lbRankSeen(myRank)}catch(e){}
  if(!me){const {data:mr}=await SB.from('tlmn_players').select('user_id,name,avatar,level,title,xp,xu,wins,week_wins,week_key,frame,name_style').eq('user_id',USER.id).maybeSingle();myRow=mr;
   if(mr){let c=SB.from('tlmn_players').select('user_id',{count:'exact',head:true}).gt(col,mr[col]||0);if(lbTab==='week')c=c.eq('week_key',wk);const {count}=await c;myRank=(count||0)+1;try{lbRankSeen(myRank)}catch(e){}}}
  const val=r=>lbTab==='xp'?`Cấp ${r.level} · ${fmt(r.xp)} XP`:lbTab==='xu'?`${I('coin')} ${fmt(r.xu)}`:lbTab==='wins'?`${fmt(r.wins)} thắng`:`${fmt(r.week_wins)} thắng · ${fmt(r.week_xp||0)} XP`;
  const row=(r,i,mine)=>{const a=r.avatar||{};return `<div class="lbrow ${i<3?'pod p'+i:''} ${mine?'mine':''}"><span class="lbn">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><span class="av lbav ${r.frame?'fr-'+r.frame:''}" style="background:${esc(a.bg||'#345')}">${esc(a.av||'🙂')}</span><span class="lbname"><b class="${esc(r.name_style||'')}">${esc(r.name||'Người chơi')}</b><small>${titleHTML?titleHTML({name:esc(r.title||''),tier:((TITLES.find(t=>t.name===r.title)||{}).tier)||1}):esc(r.title||'')}</small></span><span class="lbv">${val(r)}</span></div>`;};
  if(document.querySelector('#modalIn h3')?.textContent.indexOf('xếp hạng')<0)return;
  modal(`<h3>🏆 Bảng xếp hạng</h3>${tabs}${lbTab==='week'?'<p class="small">Làm mới mỗi thứ Hai</p>':''}<div class="lblist">${data.length?data.map((r,i)=>row(r,i,r.user_id===USER.id)).join(''):'<p class="small">Chưa có ai trên bảng.</p>'}</div>
   ${myRow?`<div class="lbme">${row(myRow,(myRank||0)-1,true).replace(/<span class="lbn">[^<]*<\/span>/,`<span class="lbn">#${myRank||'?'}</span>`)}</div>`:''}<p class="small">Số liệu do máy bạn gửi lên khi sao lưu, máy chủ giới hạn mức tăng để chống gian lận.</p>`);
 }catch(e){modal(`<h3>🏆 Bảng xếp hạng</h3>${tabs}<p>Không tải được: ${esc(e.message||String(e))}</p>`);}}
const _rh12=renderHome;renderHome=function(){_rh12();const g=document.querySelector('#home .tiles');if(g&&g.insertAdjacentHTML)g.insertAdjacentHTML('beforeend',`<button class="alt tile" onclick="openLeaderboard()"><span style="font-size:28px;line-height:30px">🏆</span><span>Xếp hạng</span></button>`);};

// ---- Không có bài chặn: làm nổi Bỏ lượt
const _r13=render;render=function(){_r13();if(!G)return;const bp=$('bPass'),bl=$('bPlay');if(!bp||!bp.classList)return;
 let stuck=false;try{stuck=!G.over&&!DEALING&&G.turn===0&&!!G.cur&&G.hands[0].length>0&&!combos(G.hands[0]).some(x=>canBeat(x.info,G.cur));}catch(e){}
 bp.classList.toggle('mustpass',stuck);bl.classList.toggle('dimmed',stuck);let h=$('noBeat');
 if(stuck&&!h){h=document.createElement('div');h.id='noBeat';h.textContent='Không có bài chặn được';const par=bp.parentNode;if(par.style&&getComputedStyle(par).position==='static')par.style.position='relative';par.appendChild(h);}else if(!stuck&&h)h.remove();};

// ---- Chống treo cuối ván: luôn kết thúc + hiện bảng kết quả
let _overAt=0;
setInterval(()=>{try{if(!G||G.online||!G.started||DEALING)return;const seats=G.seats||[0,1,2,3];
 if(!G.over){const left=seats.filter(p=>G.hands[p].length>0);if(left.length<=1&&G.finished.length>=seats.length-1){console.warn('watchdog: force end');G.finished.push(...left.filter(p=>!G.finished.includes(p)));G.over=true;try{endGame(false);}catch(e){console.error(e);showResult([...G.finished]);}render();}
  // lượt kẹt vào người đã hết bài
  else if(G.hands[G.turn].length===0){try{nextTurn();render();step();}catch(e){}}return;}
 if(!_overAt)_overAt=Date.now();const shown=($('modalIn')?.textContent||'').includes('Kết quả');
 if(!shown&&!(typeof FIN!=='undefined'&&FIN.active)&&Date.now()-_overAt>4500&&!document.getElementById('badgeFX')&&!G._resShown){const f=G.finished,all=[...f,...seats.filter(p=>!f.includes(p))];G._resShown=true;showResult(all);}}catch(e){}},1500);
const _ng14=newGame;newGame=function(n){_overAt=0;return _ng14(n);};
const _sr14=showResult;showResult=function(r){if(G)G._resShown=true;return _sr14(r);};
// endGame không được phép ném lỗi trước khi hẹn bảng kết quả
const _eg14=endGame;endGame=function(i){try{return _eg14(i);}catch(e){console.error('endGame',e);const seats=G.seats||[0,1,2,3],f=G.finished;setTimeout(()=>showResult([...f,...seats.filter(p=>!f.includes(p))]),1500);}};

// ---- Bàn chờ sau khi đóng kết quả
function tableHost(){return $('table')||document.body;}
function showStartOv(){if(!G||!G.over||document.body.classList.contains('athome'))return;let o=$('startOv');if(o)o.remove();
 document.body.classList.add('tblidle');o=document.createElement('div');o.id='startOv';
 if(G.online){const host=typeof ONL!=='undefined'&&ONL.host;o.innerHTML=host?`<button class="sbig" onclick="hideStartOv();hostStart()">▶ BẮT ĐẦU</button><div class="srow"><button class="alt" onclick="showRes()">Xem kết quả</button></div>`:`<div class="swait">⏳ Chờ chủ bàn bắt đầu…</div><div class="srow"><button class="alt" onclick="showRes()">Xem kết quả</button></div>`;}
 else o.innerHTML=`<button class="sbig" onclick="hideStartOv();newGame()">▶ BẮT ĐẦU</button><div class="srow"><button class="alt" onclick="showRes()">Xem kết quả</button><button class="alt" onclick="openTables()">Đổi bàn</button></div>`;
 tableHost().appendChild(o);}
function hideStartOv(){const o=$('startOv');if(o)o.remove();document.body.classList.remove('tblidle');}
function showRes(){if(!G)return;const seats=G.seats||[0,1,2,3],f=G.rank||G.finished,all=[...f,...seats.filter(p=>!f.includes(p))];showResult(all);}
const _cm15=closeModal;closeModal=function(){_cm15();setTimeout(()=>{if(G&&G.over&&(G._resShown||G.online)&&!modalOpen()&&!$('badgeFX'))showStartOv();},30);};
const _ng15=newGame;newGame=function(n){hideStartOv();return _ng15(n);};
const _gh15=goHome;goHome=function(){hideStartOv();return _gh15.apply(this,arguments);};
function modalOpen(){const m=$('modal');return !!m&&m.style.display!=='none'&&getComputedStyle(m).display!=='none';}
setInterval(()=>{if($('startOv')&&G&&!G.over)hideStartOv();
 else if(G&&G.over&&!(typeof FIN!=='undefined'&&FIN.active)&&(G._resShown||G.online)&&!$('startOv')&&!modalOpen()&&!$('badgeFX')&&!document.body.classList.contains('athome'))showStartOv();},700);

// ---- Làm nổi người đang tới lượt
let _ringKey=null;
function turnRing(){let r=$('turnRing');const on=G&&!G.over&&!DEALING&&!document.body.classList.contains('athome')&&!document.body.classList.contains('tblidle');
 document.body.classList.toggle('playing',!!on);if(!on){if(r)r.remove();_ringKey=null;return;}
 const p=G.turn,el=p===0?(document.querySelector('#meAvM')&&document.querySelector('#meAvM').offsetParent?document.querySelector('#meAvM'):document.querySelector('#meBar .av')&&document.querySelector('#meBar .av').offsetParent?document.querySelector('#meBar .av'):document.querySelector('#meInfo .lvb')):(0)?(document.querySelector('#meBar .av')&&document.querySelector('#meBar .av').offsetParent?document.querySelector('#meBar .av'):document.querySelector('#meInfo .lvb')):document.querySelector('#s'+p+' .av');
 const key=p+':'+(G.hist?G.hist.length:0)+':'+G.hands[p].length;if(!el)return;const b=el.getBoundingClientRect();
 if(!r){r=document.createElement('div');r.id='turnRing';r.innerHTML='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" class="trbg"/><circle cx="50" cy="50" r="46" class="trfg" pathLength="100"/></svg>';document.body.appendChild(r);}
 const sz=Math.max(b.width,b.height)+16;Object.assign(r.style,{left:(b.left+b.width/2-sz/2)+'px',top:(b.top+b.height/2-sz/2)+'px',width:sz+'px',height:sz+'px'});
 if(key!==_ringKey){_ringKey=key;const fg=r.querySelector('.trfg');fg.style.animation='none';void fg.getBoundingClientRect();fg.style.animation='';r.classList.toggle('me',p===0);}}
const _r16=render;render=function(){_r16();try{turnRing();}catch(e){}};
setInterval(()=>{try{turnRing();}catch(e){}},500);
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('resize',()=>{try{turnRing();}catch(e){}});

// ---- Đổi tên người chơi
function myName(){return PR.name||'Bạn';}
const _rb17=rollBots;rollBots=function(){_rb17();NAMES[0]=myName();};
const PENCIL='<svg class="i" viewBox="0 0 24 24" style="width:16px;height:16px"><path fill="currentColor" d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zm17.7-10.2a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
function openRename(then){window._renThen=then||null;modal(`<h3>✏️ Tên của bạn</h3><p class="small">2–16 ký tự, có thể dùng tiếng Việt có dấu. Tên hiện ở bàn chơi, online và bảng xếp hạng.</p>
 <input class="inp" id="nmIn" maxlength="24" value="${esc(PR.name||'')}" placeholder="Nhập tên…" oninput="const r=validName(this.value);$('nmErr').textContent=this.value&&!r.ok?r.err:''"><p class="err" id="nmErr"></p>
 <button onclick="saveName()">Lưu tên</button>${then?'<button class="alt" onclick="closeModal()">Để sau</button>':''}`);setTimeout(()=>{const e=$('nmIn');if(e&&e.focus)e.focus();},50);}
function saveName(){const r=validName($('nmIn').value);if(!r.ok){$('nmErr').textContent=r.err;return;}PR.name=r.name;PR.nameAt=Date.now();if(typeof NAMES!=='undefined')NAMES[0]=PR.name;saveP();toast('Đã đổi tên: '+r.name);
 if(G&&!G.online)render();try{if(USER&&SB)ensurePlayer();}catch(e){}if(typeof cloudAutoBackup==='function')cloudAutoBackup();const t=window._renThen;window._renThen=null;closeModal();if(typeof renderHome==='function'&&document.body.classList.contains('athome'))renderHome();if(t)t();}
const _rh17=renderHome;renderHome=function(){_rh17();const n=document.querySelector('#home .pn');if(n&&n.insertAdjacentHTML){n.insertAdjacentHTML('afterbegin',`<b class="pname">${esc(myName())}</b> <button class="alt pencil" onclick="openRename()" title="Đổi tên">${PENCIL}</button><br>`);}};
const _oa17=openAvatar;openAvatar=function(){_oa17();const h=document.querySelector('#modalIn h3');if(h&&h.insertAdjacentHTML)h.insertAdjacentHTML('afterend',`<div class="row"><span style="flex:1">Tên: <b>${esc(myName())}</b></span><button class="alt pencil" onclick="openRename()">${PENCIL} Đổi tên</button></div>`);};
const _ol17=openLeaderboard;openLeaderboard=function(t){if(!PR.name&&typeof USER!=='undefined'&&USER&&!window._askedName){window._askedName=1;return openRename(()=>_ol17(t));}return _ol17(t);};
const _oo17=openOnline;openOnline=function(){if(!PR.name&&typeof USER!=='undefined'&&USER&&!window._askedName2){window._askedName2=1;const a=arguments;return openRename(()=>_oo17.apply(this,a));}return _oo17.apply(this,arguments);};
// ẩn bàn chờ khi có bất kỳ modal nào
const _md18=modal;modal=function(){document.body.classList.add('mopen2');return _md18.apply(this,arguments);};
const _cm18=closeModal;closeModal=function(){document.body.classList.remove('mopen2');return _cm18.apply(this,arguments);};
// ---- Hiệu ứng nhận thưởng xu / XP (luôn hiển thị, kể cả giảm chuyển động)
let _px=null,_pxp=null,_endHold=null;
function floatText(x,y,txt,cls){const d=document.createElement('div');d.className='ftxt '+(cls||'')+(RM?' rm':'');d.textContent=txt;x=Math.max(70,Math.min(innerWidth-70,x));y=Math.max(40,y);d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),RM?2200:1700);}
function rectOf(sel){const e=typeof sel==='string'?document.querySelector(sel):sel;if(!e)return null;const r=e.getBoundingClientRect();return r.width?r:null;}
function xuAnchor(){return rectOf('#xu')||{left:innerWidth/2-30,top:8,width:60,height:24};}
function xpAnchor(){return rectOf('#meInfo .xpb')||rectOf('#meInfo')||rectOf('#home .pn')||{left:innerWidth/2-40,top:innerHeight-260,width:80,height:10};}
function pulse(sel,cls){const e=document.querySelector(sel);if(!e||!e.classList)return;e.classList.remove(cls);void e.offsetWidth;e.classList.add(cls);setTimeout(()=>e.classList.remove(cls),1200);}
function showXuDelta(d){if(!d)return;const r=xuAnchor();floatText(r.left+r.width/2,r.top+r.height+4,(d>0?'+':'−')+fmt(Math.abs(d))+' xu',d>0?'gain':'loss');pulse('#xu',d>0?'pgain':'ploss');}
function showXpDelta(d){if(!d||d<=0)return;const r=xpAnchor();floatText(r.left+r.width/2,r.top-6,'+'+fmt(d)+' XP','xp');pulse('#meInfo .xpb','pxp');}
function coinFly(from,n){if(RM||!from)return;const to=xuAnchor(),k=Math.min(10,Math.max(4,Math.round(Math.log10(Math.abs(n)+1)*3)));
 for(let i=0;i<k;i++){const c=document.createElement('div');c.className='flycoin';c.innerHTML=I('coin');const x0=from.left+from.width/2+(Math.random()*60-30),y0=from.top+from.height/2;c.style.left=x0+'px';c.style.top=y0+'px';document.body.appendChild(c);
  const dx=to.left+to.width/2-x0,dy=to.top+to.height/2-y0;c.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${dx*0.5}px),calc(-50% + ${dy*0.5-60}px)) scale(1.2)`,opacity:1,offset:.5},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.6)`,opacity:.9}],{duration:650,delay:i*70,easing:'ease-in',fill:'forwards'});
  setTimeout(()=>{c.remove();if(i%2===0)sfx('coin');},650+i*70);}}
// tự phát hiện thay đổi xu/XP mỗi lần lưu (nhiệm vụ, huy hiệu, quay, điểm danh, ném đồ…)
const _sp19=saveP;saveP=function(){_sp19();try{if(_px==null){_px=PR.xu;_pxp=PR.xp;return;}if(_endHold){return;}
 const dx=PR.xu-_px,dp=PR.xp-_pxp;_px=PR.xu;_pxp=PR.xp;if(dx)showXuDelta(dx);if(dp>0)setTimeout(()=>showXpDelta(dp),dx?250:0);}catch(e){}};
// cuối ván: giữ lại để hiện trong bảng kết quả
const _he19=hookEnd;hookEnd=function(place,instant,n){const x0=_px==null?PR.xu:_px,p0=_pxp==null?PR.xp:_pxp;_endHold={x0,p0};_he19(place,instant,n);_endHold={x0,p0,dx:PR.xu-x0,dp:PR.xp-p0};
 const _fw=()=>{if(typeof FIN!=='undefined'&&FIN.active)return setTimeout(_fw,1000);if(_endHold&&!_endHold.shown)finishRewards(null);};setTimeout(_fw,9000);};
function finishRewards(fromRect){const h=_endHold;if(!h||h.done)return;h.done=true;_endHold=null;_px=PR.xu;_pxp=PR.xp;
 document.body.classList.add('rewardfx');coinFly(fromRect,h.dx);setTimeout(()=>{showXuDelta(h.dx);updHud();},RM?0:700);setTimeout(()=>{renderMe();showXpDelta(h.dp);},RM?300:1000);setTimeout(()=>document.body.classList.remove('rewardfx'),2600);}
function rewBox(){const h=_endHold;const m=$('modalIn');if(!h||h.shown||!m)return;h.shown=true;
 const box=document.createElement('div');box.className='rewbox';box.innerHTML=`<div class="rw ${h.dx>=0?'gain':'loss'}">${I('coin')} <b id="rwXu">${h.dx>=0?'+':'−'}0</b> xu</div><div class="rw xp">⭐ <b id="rwXp">+0</b> XP</div>`;
 const btn=m.querySelector('button');if(btn)btn.parentNode.insertBefore(box,btn);else m.appendChild(box);
 const D=RM?0:1100,t0=performance.now();let lastTick=0;const fx=$('rwXu'),fp=$('rwXp');
 const step=t=>{const k=D?Math.min(1,(t-t0)/D):1,q=1-Math.pow(1-k,3);fx.textContent=(h.dx>=0?'+':'−')+fmt(Math.round(Math.abs(h.dx)*q));fp.textContent='+'+fmt(Math.round(h.dp*q));if(t-lastTick>90&&k<1){lastTick=t;sfx('tick');}
  if(k<1)requestAnimationFrame(step);else{sfx(h.dx>=0?'coin':'bad');setTimeout(()=>finishRewards(rectOf(box)),RM?200:350);}};requestAnimationFrame(step);}
const _sr19=showResult;showResult=function(rank){_sr19(rank);rewBox();};
// ---- Tiền chặt heo (chuyển xu thật giữa người chặt và người bị chặt)
function seatCenter(p){const e=p===0?(rectOf('#meAvM')||rectOf('#meBar .av')||rectOf('#meInfo .lvb')||rectOf('#hand')):rectOf('#s'+p+' .av');return e?{x:e.left+e.width/2,y:e.top+e.height/2,r:e}:{x:innerWidth/2,y:p===0?innerHeight-200:120};}
function moneyFX(payer,receiver,amt,label){const a=seatCenter(payer),b=seatCenter(receiver);
 floatText(a.x,a.y-40,'−'+fmt(amt)+' xu','loss big');floatText(b.x,b.y-40,'+'+fmt(amt)+' xu','gain big');sfx('coin');setTimeout(()=>sfx('coin'),250);
 if(!RM)for(let i=0;i<8;i++){const c=document.createElement('div');c.className='flycoin';c.innerHTML=I('coin');c.style.left=a.x+'px';c.style.top=a.y+'px';document.body.appendChild(c);
  c.animate([{transform:'translate(-50%,-50%)'},{transform:`translate(calc(-50% + ${(b.x-a.x)/2}px),calc(-50% + ${(b.y-a.y)/2-50}px)) scale(1.2)`,offset:.5},{transform:`translate(calc(-50% + ${b.x-a.x}px),calc(-50% + ${b.y-a.y}px)) scale(.7)`}],{duration:700,delay:i*60,easing:'ease-in-out',fill:'forwards'});setTimeout(()=>c.remove(),760+i*60);}
 if(label){msg(label);toast(label);}}
function settleChop(){if(!G||!G.pend)return;const r=chopSettle(G.pend,{0:PR.xu});G.pend=null;if(!r||!r.amount)return;
 if(r.payer===0)PR.xu=Math.max(0,PR.xu-r.amount);if(r.receiver===0)PR.xu+=r.amount;G.chopNet=(G.chopNet||0)+(r.receiver===0?r.amount:r.payer===0?-r.amount:0);
 if(r.receiver===0&&r.chain>1){try{bst('chain');}catch(e){}}if(r.payer===0||r.receiver===0)saveP();moneyFX(r.payer,r.receiver,r.amount,`${NAMES[r.receiver]} ${r.chain>1?'chặt chồng':'chặt heo'} ${NAMES[r.payer]}: +${fmt(r.amount)} xu`);}
const _dp20=doPlay;doPlay=function(p,cards,src){if(G&&!G.online){try{G.pend=chopStep(G.pend||null,G.cur,G.pile,G.curBy,detect(cards),p,PR.bet);}catch(e){}}return _dp20(p,cards,src);};
const _nt20=nextTurn;nextTurn=function(){const had=G&&G.cur;_nt20();if(G&&!G.online&&had&&!G.cur&&G.pend)settleChop();};
const _eg20=endGame;endGame=function(i){if(G&&!G.online)try{settleChop();}catch(e){}return _eg20(i);};
const _sr20=showResult;showResult=function(rank){_sr20(rank);if(!G||!G.chopNet)return;const m=$('modalIn');const rb=m&&m.querySelector('.rewbox');const html=`<div class="row" style="color:${G.chopNet>0?'#ffd84d':'#ff6b6b'}"><b style="flex:1">🐷 Tiền chặt heo trong ván</b><span>${G.chopNet>0?'+':'−'}${fmt(Math.abs(G.chopNet))} xu</span></div>`;
 if(rb)rb.insertAdjacentHTML('beforebegin',html);else{const b=m&&m.querySelector('button');if(b)b.insertAdjacentHTML('beforebegin',html);}};
// online: chủ bàn thanh toán, máy khách hiển thị + cộng/trừ xu của mình
const _os20=onlineState;onlineState=function(st,fh){_os20(st,fh);try{if(!st||!st.settle||!st.seats)return;const key=JSON.stringify(st.seats.map(s=>s&&s.uid))+':'+st.settle.id+':'+(st.firstCard)+':'+(st.hands||[]).map(h=>h&&h.length).join('');
  if(ONL._setKey===st.settle.id+'@'+(st.dealId||st.firstCard))return;ONL._setKey=st.settle.id+'@'+(st.dealId||st.firstCard);
  const me=st.seats.findIndex(s=>s&&s.uid===(USER&&USER.id));const L=s=>(s-me+4)%4,r=st.settle;let amt=r.amount;
  if(r.payer===me){amt=Math.min(amt,PR.xu);PR.xu-=amt;}if(r.receiver===me)PR.xu+=amt;if(r.payer===me||r.receiver===me){LEDG.chop=(LEDG.chop||0)+(r.receiver===me?amt:-amt);saveP();}
  const nm=i=>(st.seats[i]&&st.seats[i].name)||'?';moneyFX(L(r.payer),L(r.receiver),amt,`${nm(r.receiver)} ${r.chain>1?'chặt chồng':'chặt heo'} ${nm(r.payer)}: +${fmt(amt)} xu`);}catch(e){}};
// ---- Chủ phòng chỉnh số ghế / thêm bớt máy
function hostSize(n){if(!ONL.host)return;if(!ONL.host.setSize(n))toast('Không đổi được (đang chơi hoặc quá ít ghế)');}
function hostBot(i,on){if(!ONL.host)return;if(!ONL.host.setBot(i,on))toast('Không đổi được lúc này');}
const _rr20=renderRoom;renderRoom=function(){_rr20.apply(this,arguments);try{const r=ONL.room;if(!ONL.active||!r)return;const h4=[...document.querySelectorAll('#home h4')].find(e=>/Người chơi/.test(e.textContent));if(!h4)return;
 const size=r.size||4,seats=r.seats||[],hum=seats.filter(s=>s&&!s.bot).length,bots=seats.filter(s=>s&&s.bot).length;h4.textContent=`Người chơi (${hum} người + ${bots} máy / ${size} ghế)`;
 const amHost=!!ONL.host,playing=r.playing;let html=`<div class="comp">`;
 if(amHost)html+=`<div class="srow2"><span class="small">Số ghế:</span>${[2,3,4].map(n=>`<button class="${n===size?'':'alt'}" ${playing?'disabled':''} onclick="hostSize(${n})">${n}</button>`).join('')}</div>`;
 html+=`<div class="seatgrid">${[0,1,2,3].slice(0,size).map(i=>{const s=seats[i];if(s&&!s.bot)return `<div class="sg hum">👤 ${esc(s.name||'')}</div>`;
  if(s&&s.bot)return `<div class="sg bot">🤖 Máy ${amHost&&!playing?`<button class="x" onclick="hostBot(${i},false)" title="Bỏ máy">✕</button>`:''}</div>`;
  return `<div class="sg empty">${amHost&&!playing?`<button class="alt" onclick="hostBot(${i},true)">+ Thêm máy</button>`:'Ghế trống'}</div>`;}).join('')}</div><p class="small">Máy có độ khó ngẫu nhiên · XP/xu tính theo tổng số ghế có người/máy (${seats.filter(Boolean).length} ghế).</p></div>`;
 h4.insertAdjacentHTML('afterend',html);if(r.cfg){const lab=[...document.querySelectorAll('#home label')].find(l=>/Thêm máy vào ghế trống/.test(l.textContent));if(lab)lab.style.display='none';}}catch(e){}};
// ---- Hết giờ lượt (15s): tự bỏ / tự đánh lá nhỏ nhất; 3 lần liền → treo máy, máy chơi thay
const TURN_MS=15000;let _tKey=null,_tT0=0,_toCount=0,AFK=false;
function myTurnKey(){return G&&!G.over&&G.turn===0&&!DEALING&&!G.online?(G.hist.length+':'+G.hands[0].length+':'+(G.cur?1:0)):null;}
function afkBanner(on){let b=$('afkBar');if(on&&!b){b=document.createElement('div');b.id='afkBar';b.textContent='😴 Bạn đang treo máy — máy chơi thay. Chạm để chơi tiếp';document.body.appendChild(b);}else if(!on&&b)b.remove();}
function wakeUp(){if(!AFK&&!(G&&G.online&&ONL.st&&ONL.st.afk&&ONL.st.afk[myOnlineSeat()]))return;AFK=false;_toCount=0;afkBanner(false);toast('Chào mừng trở lại!');
 if(G&&G.online){const a={uid:USER.id,a:{type:'wake'}};if(ONL.host)ONL.host.onIntent(a);else ONL.tr&&ONL.tr.send('intent',a);}else if(G&&G.turn===0)setTimeout(()=>{_tKey=null;},0);}
function myOnlineSeat(){return ONL.st&&USER?ONL.st.seats.findIndex(s=>s&&s.uid===USER.id):-1;}
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('pointerdown',()=>{try{wakeUp();}catch(e){}},{capture:true,passive:true});
const _hp21=humanPlay;humanPlay=function(){if(!window._autoAct)_toCount=0;return _hp21();};
const _hs21=humanPass;humanPass=function(){if(!window._autoAct)_toCount=0;return _hs21();};
function autoMove(reason){if(!G||G.over||G.turn!==0||G.online)return;window._autoAct=true;try{
 if(AFK){let m=aiMove(1,G.hands[0],G.cur,G.first?G.firstCard:null,{others:[13]});if(m){sel=new Set(m);humanPlay();}else if(G.cur)humanPass();else{sel=new Set([G.first?G.firstCard:Math.min(...G.hands[0])]);humanPlay();}return;}
 if(G.cur){humanPass();toast('Hết giờ, tự bỏ lượt');}else{const c=G.first?G.firstCard:Math.min(...G.hands[0]);sel=new Set([c]);humanPlay();toast('Hết giờ, tự đánh lá nhỏ nhất');}
 _toCount++;if(_toCount>=3){AFK=true;afkBanner(true);}}finally{window._autoAct=false;}}
setInterval(()=>{try{if(DEALING){_tKey=null;return;}const k=myTurnKey();if(k!==_tKey){_tKey=k;_tT0=Date.now();return;}if(!k)return;
 if(AFK){if(Date.now()-_tT0>1000)autoMove();return;}if(Date.now()-_tT0>TURN_MS)autoMove();}catch(e){}},300);
// online: thông báo hết giờ / treo máy
const _os21=onlineState;onlineState=function(st,fh){_os21(st,fh);try{const me=myOnlineSeat();if(me<0)return;
 if(st.ev&&st.ev.timeout&&st.ev.tseat===me){const k=(st.hist||[]).length+':'+st.turn;if(ONL._toK!==k){ONL._toK=k;toast(st.ev.cards||st.cur&&st.curBy===me?'Hết giờ, tự đánh lá nhỏ nhất':'Hết giờ, tự bỏ lượt');}}
 afkBanner(!!(st.afk&&st.afk[me]&&!st.over));}catch(e){}};
// gộp chat vào nút biểu cảm khi online trên màn hình hẹp
const _te21=toggleEmotes;toggleEmotes=function(){_te21();const b=$('emoBar');if(b&&b.className==='on'&&G&&G.online&&!b.querySelector('.emochat'))b.insertAdjacentHTML('afterbegin',`<button class="alt emochat" onclick="$('emoBar').className='';toggleChat()">💬 Trò chuyện</button>`);};
// ---- Online: mức cược do chủ bàn quyết định, thanh trên chỉ hiển thị
const _sb22=setBet;setBet=function(v){if(typeof ONL!=='undefined'&&ONL.active){syncBetSel();return toast(ONL.host?'Đổi mức cược trong phần điều khiển phòng (giữa các ván)':'Mức cược do chủ bàn quyết định');}return _sb22(v);};
function syncBetSel(){const s=$('bet');if(!s||!s.options)return;const on=typeof ONL!=='undefined'&&ONL.active;s.disabled=!!on;s.classList.toggle('ro',!!on);s.title=on?'Mức cược của bàn (chủ bàn chỉnh)':'Mức cược';
 const v=on?tableBet():PR.bet;if(![...s.options].some(o=>+o.value===v)){const o=document.createElement('option');o.value=v;o.textContent=fmt(v);s.appendChild(o);}if(+s.value!==v)s.value=String(v);}
setInterval(()=>{try{syncBetSel();}catch(e){}},800);
// ---- Avatar của mình trên điện thoại (cạnh thanh cấp độ)
const _rm23=renderMe;renderMe=function(){_rm23();const e=$('meInfo');if(!e||!e.insertAdjacentHTML)return;const L=levelInfo(PR.xp);const turn=G&&!G.over&&G.turn===0&&!document.body.classList.contains('athome');
 e.insertAdjacentHTML('afterbegin',`<div id="meAvM" class="av ${frameCls()} ${turn?'myturn':''}" style="--avc:${PR.avBg};--lp:${Math.round(100*L.cur/L.need)}">${myAv()}</div>`);
 const mt=e.querySelector('.mt');if(mt)mt.insertAdjacentHTML('afterbegin',`<b class="myname">${esc(myName())}</b> `);};
const _r23=render;render=function(){_r23();const a=$('meAvM');if(a&&a.classList)a.classList.toggle('myturn',!!(G&&!G.over&&G.turn===0));};
// ---- Kết ván chậm lại: giữ nước bài cuối, ngửa bài còn lại, rồi mới hiện kết quả
const FIN={g:null,active:false,called:false,t:0,fn:null,tm:null};let _holdUntil=0;
function finCaption(txt,ms,big){const o=document.createElement('div');o.className='fincap'+(big?' big':'');o.textContent=txt;const c=$('center')||document.body;c.appendChild(o);setTimeout(()=>o.remove(),ms);return o;}
function revealHands(){const box=document.createElement('div');box.id='finHands';document.body.appendChild(box);
 (G.seats||[0,1,2,3]).forEach(p=>{if(p===0)return;const h=(G.hands[p]||[]).slice().sort((a,b)=>a-b);if(!h.length)return;const a=document.querySelector('#s'+p+' .av');const r=a&&a.getBoundingClientRect();if(!r||!r.width)return;
  const f=document.createElement('div');f.className='finfan';h.forEach(c=>f.appendChild(cardEl(c)));box.appendChild(f);
  const fw=Math.min(innerWidth-8,22*h.length+34);let x=r.left+r.width/2-fw/2;x=Math.max(4,Math.min(innerWidth-fw-4,x));f.style.left=x+'px';f.style.width=fw+'px';
  f.style.top=Math.min(innerHeight-70,r.bottom+(p===2?22:6))+'px';});}
function startFinal(key,winner,fn){if(FIN.active&&FIN.g===key)return;['finFX','finHands'].forEach(i=>{const e=$(i);if(e)e.remove();});clearTimeout(FIN.tm);Object.assign(FIN,{g:key,active:true,called:false,t:Date.now(),fn});
 const pile=$('pile');if(pile&&pile.classList)pile.classList.add('finglow');
 const ov=document.createElement('div');ov.id='finFX';ov.innerHTML='<button id="finGo" onclick="event.stopPropagation();endFinal()">Tiếp tục ▶</button>';document.body.appendChild(ov);
 finCaption(winner===0?'🏆 Bạn về nhất!':`🏆 ${NAMES[winner]} về nhất!`,600000,true);try{revealHands();}catch(e){}sfx('flip');
 }
function endFinal(){if(!FIN.active)return;FIN.active=false;clearTimeout(FIN.tm);['finFX','finHands'].forEach(i=>{const e=$(i);if(e)e.remove();});document.querySelectorAll('.fincap').forEach(e=>e.remove());
 const pile=$('pile');if(pile&&pile.classList)pile.classList.remove('finglow');if(!FIN.called&&FIN.fn){const f=FIN.fn;FIN.fn=null;f();}}
function finGate(key){if(FIN.g!==key)return true;if(FIN.active)return false;if(FIN.called&&Date.now()-FIN.t<8000)return false;FIN.called=true;return true;}
const _srF=showResult;showResult=function(r){if(G&&!G.online&&!finGate(G))return;return _srF(r);};
const _sorF=showOnlineResult;showOnlineResult=function(st){if(!finGate(ONL._finKey))return;const r=_sorF(st);try{rewBox();}catch(e){}return r;};
const _egF=endGame;endGame=function(i){const r=_egF(i);try{if(G&&!G.online&&!i){const g=G;startFinal(g,G.rank?G.rank[0]:G.finished[0],()=>{if(G===g&&!modalOpen())showResult(g.rank);});}}catch(e){}return r;};
const _dpF=doPlay;doPlay=function(p,c,s){try{if(G&&!G.online&&G.hands[p]&&G.hands[p].length===(c||[]).length)_holdUntil=Date.now()+1600;}catch(e){}const r=_dpF(p,c,s);try{if(G&&!G.online&&!G.over&&G.hands[p]&&G.hands[p].length===0){const k=G.finished.length;finCaption((p===0?'Bạn':NAMES[p])+' về '+['nhất','nhì','ba'][k-1]+'!',1900,k===1);_holdUntil=Date.now()+1400;}}catch(e){}return r;};
const _stF=step;step=function(){const w=_holdUntil-Date.now();if(w>0&&G&&!G.online){setTimeout(()=>step(),w);return;}return _stF();};
let _finHist=-1;const _osF=onlineState;onlineState=function(st,fh){_osF(st,fh);try{if(!st||!st.seats)return;const me=st.seats.findIndex(s=>s&&s.uid===USER.id);if(me<0)return;const L=g=>(g-me+4)%4;
 if(st.over&&st.rank&&!st.instant){const key=JSON.stringify(st.rank)+st.hist.length;if(ONL._finKey!==key){ONL._finKey=key;startFinal(key,L(st.rank[0]),()=>showOnlineResult(st));}}
 else if(!st.over&&st.ev&&st.ev.fin&&st.hist.length!==_finHist){_finHist=st.hist.length;const s=st.ev.seat!=null?st.ev.seat:null;const nm=s!=null?(L(s)===0?'Bạn':NAMES[L(s)]):'';finCaption((nm?nm+' ':'')+'về '+['nhất','nhì','ba'][st.ev.fin-1]+'!',1900,st.ev.fin===1);}}catch(e){}};
// ---- Xu của từng người dưới avatar (offline + online)
function kxu(v){v=+v||0;return v>=1e6?(v/1e6).toFixed(v>=1e7?0:1).replace('.0','')+'M':v>=1e4?Math.round(v/1e3)+'k':v>=1e3?(v/1e3).toFixed(1).replace('.0','')+'k':String(v);}
function hashStr(t){let h=2166136261;for(const c of String(t))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
function botXuSeed(name,lv){const h=hashStr(name);return Math.round((800+(lv||5)*260+(h%4000))/10)*10;}
const BXU={};/* offline: tên máy -> xu */
function xuOf(s){if(!s)return 0;if(typeof ONL!=='undefined'&&ONL.xu&&s.uid&&ONL.xu[s.uid]!=null)return ONL.xu[s.uid];if(s.uid===(typeof USER!=='undefined'&&USER&&USER.id))return PR.xu;if(s.xu!=null&&!s.bot)return s.xu;
 const k='o:'+(ONL&&ONL.code||'')+':'+s.name;if(BXU[k]==null)BXU[k]=s.xu!=null?s.xu:botXuSeed(s.name,s.lv);return BXU[k];}
function seatXu(p){if(p===0)return PR.xu;if(G&&G.online&&ONL.st){const me=ONL.st.seats.findIndex(x=>x&&x.uid===USER.id);return xuOf(ONL.st.seats[(p+me)%4]);}
 const nm=NAMES[p];if(BXU[nm]==null)BXU[nm]=botXuSeed(nm,BOTLV&&BOTLV[p]);return BXU[nm];}
function addBotXu(p,d){if(p===0||!d)return;if(G&&G.online&&ONL.st){const me=ONL.st.seats.findIndex(x=>x&&x.uid===USER.id);const s=ONL.st.seats[(p+me)%4];if(!s||(!s.bot&&s.uid))return;const k='o:'+(ONL.code||'')+':'+s.name;BXU[k]=Math.max(0,xuOf(s)+d);return;}
 const nm=NAMES[p];BXU[nm]=Math.max(0,seatXu(p)+d);}
const _shownXu={};
function paintSeatXu(){if(!G)return;(G.seats||[0,1,2,3]).forEach(p=>{if(p===0)return;const e=$('s'+p);if(!e||!e.querySelector)return;let x=e.querySelector('.sxu');
  if(!x){x=document.createElement('div');x.className='sxu';const nm=e.querySelector('.nm');if(nm&&nm.after)nm.after(x);else e.appendChild(x);}
  const v=seatXu(p),key=NAMES[p];x.innerHTML=`<span class="cn"></span>${kxu(v)}`;const old=_shownXu[key];_shownXu[key]=v;
  if(old!=null&&old!==v){const a=e.querySelector('.av');const r=a&&a.getBoundingClientRect();if(r&&r.width)floatText(r.left+r.width/2,r.top-4,(v>old?'+':'−')+fmt(Math.abs(v-old))+' xu',v>old?'gain':'loss');x.classList.remove('pgain','ploss');void x.offsetWidth;x.classList.add(v>old?'pgain':'ploss');}});}
const _r24=render;render=function(){_r24();try{paintSeatXu();}catch(e){}};
const _rm24=renderMe;renderMe=function(){_rm24();try{const e=$('meInfo');const mt=e&&e.querySelector&&e.querySelector('.myname');if(mt&&!e.querySelector('.mxu'))mt.insertAdjacentHTML('afterend',`<span class="mxu">🪙${kxu(PR.xu)}</span> `);}catch(e){}};
// offline: chặt heo + kết quả cập nhật xu máy
const _scX=settleChop;settleChop=function(){const pend=G&&G.pend;let r=null;if(pend&&typeof chopSettle==='function'){try{r=chopSettle(JSON.parse(JSON.stringify(pend)),{0:PR.xu});}catch(e){}}
 _scX();if(r&&r.amount){addBotXu(r.payer,-r.amount);addBotXu(r.receiver,r.amount);render();}};
const _egX=endGame;endGame=function(i){const r=_egX(i);try{if(G&&!G.online&&G.rank){const n=G.n||G.rank.length,bet=curBet();G.rank.forEach((p,pl)=>{if(p!==0)addBotXu(p,G.mode==='demla'&&G.dl?(G.dl[p]||0):tableXu(bet,n,pl,!!i));});render();}}catch(e){}return r;};
// online: phát xu của mình, nhận xu người khác
const _erX=enterRoom;enterRoom=async function(){const r=await _erX.apply(this,arguments);try{ONL.xu=ONL.xu||{};if(ONL.tr&&!ONL._xuHook){ONL._xuHook=ONL.tr;ONL.tr.on('xu',m=>{if(m&&m.uid&&isFinite(m.xu)){ONL.xu[m.uid]=Math.max(0,Math.round(m.xu));render();renderRoom();}});}ONL._xuSent=null;}catch(e){}return r;};
const _miX=meInfo;meInfo=function(){return Object.assign(_miX(),{xu:PR.xu});};
setInterval(()=>{try{if(!ONL.active||!ONL.tr)return;if(ONL._xuHook!==ONL.tr){ONL._xuHook=ONL.tr;ONL.xu=ONL.xu||{};ONL.tr.on('xu',m=>{if(m&&m.uid&&isFinite(m.xu)){ONL.xu[m.uid]=Math.max(0,Math.round(m.xu));render();renderRoom();}});}
 const now=Date.now();if(PR.xu!==ONL._xuSent||now-(ONL._xuAt||0)>15000){ONL._xuSent=PR.xu;ONL._xuAt=now;ONL.tr.send('xu',{uid:USER.id,xu:PR.xu});}}catch(e){}},800);
// online: máy - cập nhật theo tiền chặt (st.settle) và kết quả ván, giống nhau mọi máy khách
const _osX=onlineState;onlineState=function(st,fh){_osX(st,fh);try{if(!st||!st.seats)return;const me=st.seats.findIndex(s=>s&&s.uid===USER.id);if(me<0)return;const L=g=>(g-me+4)%4;
 if(st.settle&&st.settle.id!=null&&ONL._bxS!==st.settle.id+':'+st.dealId){ONL._bxS=st.settle.id+':'+st.dealId;const z=st.settle;if(z.amount){addBotXu(L(z.payer),-z.amount);addBotXu(L(z.receiver),z.amount);}}
 if(st.over&&st.rank){const k=JSON.stringify(st.rank)+st.dealId;if(ONL._bxE!==k){ONL._bxE=k;const n=st.seats.filter(Boolean).length;st.rank.forEach((g,pl)=>addBotXu(L(g),tableXu(st.bet||100,n,pl,!!st.instant)));}}
 paintSeatXu();}catch(e){}};

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
function persona(p){if((G&&G.online?(ONL.botai||[])[p]:BOTAI[p])===3)return'master';const n=NAMES[p]||'',av=(AVATARS[p]||[])[0]||'';if(/^(Ông|Chú|Bác|Bà|Dì)/.test(n)||/👴|🧓|👵/.test(av))return'uncle';if(AV_EMO.f.includes(av)||AV_EMO.of.includes(av))return'girl';return'brag';}
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
// ======== v25: online — giấu bài (mã hoá ECDH), bầu chủ bàn, quà tặng xu thật, máy nói chuyện online ========
const b64=a=>btoa(String.fromCharCode(...new Uint8Array(a))),unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const CRY=(typeof crypto!=='undefined'&&crypto.subtle)?crypto.subtle:null;let KP=null,KPUB=null;const _peerKey={};
async function ensureKp(){if(KP||!CRY)return;try{KP=await CRY.generateKey({name:'ECDH',namedCurve:'P-256'},false,['deriveKey']);KPUB=b64(await CRY.exportKey('raw',KP.publicKey));}catch(e){KP=null;}}
async function aesFor(pk){if(_peerKey[pk])return _peerKey[pk];const pub=await CRY.importKey('raw',unb64(pk),{name:'ECDH',namedCurve:'P-256'},false,[]);
 return _peerKey[pk]=await CRY.deriveKey({name:'ECDH',public:pub},KP.privateKey,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
const _miK=meInfo;meInfo=function(){const m=_miK();if(KPUB)m.pk=KPUB;return m;};
// host: gửi riêng bài cho từng người (mã hoá bằng khoá chung ECDH), chỉ khi bài đổi
function installHostHands(h){if(!h||h._hh)return;h._hh=true;h.opt.hideHands=true;h._handKey={};
 h.sendHands=(st,rev)=>{st.seats.forEach((s,g)=>{if(!s||s.bot||!s.uid||s.uid===USER.id)return;const hand=st.hands[g]||[];const k=st.dealId+':'+hand.join(',');if(h._handKey[s.uid]===k)return;h._handKey[s.uid]=k;
  const pl=(h.players||[]).find(x=>x.uid===s.uid)||{};const body=JSON.stringify({d:st.dealId,h:hand});
  if(pl.pk&&KP&&KPUB){(async()=>{try{const key=await aesFor(pl.pk);const iv=crypto.getRandomValues(new Uint8Array(12));const ct=await CRY.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(body));
    h.tr.send('hand',{to:s.uid,rev,hpk:KPUB,iv:b64(iv),ct:b64(ct)});}catch(e){h._handKey[s.uid]=null;}})();}
  else h.tr.send('hand',{to:s.uid,rev,plain:body});});};
 h.resendHands=uid=>{if(uid)h._handKey[uid]=null;else h._handKey={};};}
// client: ghép bài riêng vào state công khai
ONL.myHand=null;ONL.pendSt=null;
function mergeHidden(st){if(!st||!st.hid||st.over)return st;const me=st.seats.findIndex(s=>s&&s.uid===USER.id);if(me<0)return st;const H=ONL.myHand;
 if(H&&H.d===st.dealId&&H.h.length===st.hands[me].length){const c=Object.assign({},st,{hands:st.hands.slice()});c.hands[me]=H.h.slice();return c;}return null;}
function onHandMsg(m){if(!m||m.to!==USER.id)return;(async()=>{try{let body;if(m.plain)body=m.plain;else{if(!KP)return;const key=await aesFor(m.hpk);body=new TextDecoder().decode(await CRY.decrypt({name:'AES-GCM',iv:unb64(m.iv)},key,unb64(m.ct)));}
  const o=JSON.parse(body);if(!o||!Array.isArray(o.h))return;ONL.myHand={d:o.d,h:o.h.map(Number)};if(ONL.pendSt){const s=mergeHidden(ONL.pendSt);if(s){ONL.pendSt=null;onlineState(s);}}}catch(e){console.warn('hand',e);}})();}
// ---- bầu chủ bàn theo thời điểm vào (presence), dùng cho bàn công khai
function presList(){try{const s=ONL.ch.presenceState();return Object.values(s).map(a=>a&&a[a.length-1]).filter(x=>x&&!x.spec).map(x=>({uid:x.uid,at:x.at}));}catch(e){return[];}}
function becomeHost(bet){if(ONL.host)return;ONL.host=new OnlineHost(ONL.tr,ONL.me,{fillBots:true,dealMs:2300,bet:bet||((BETS2||[]).includes(PR.bet)&&PR.bet<MASTER_BET?PR.bet:100)});ONL.host.onState=(s,r)=>{ONL.room=r;renderRoom();if(s)onlineState(s,true);};installHostHands(ONL.host);ONL.room=ONL.host.room();ONL.host.push();renderRoom();}
// ---- giao thức phụ trên kênh phòng
function hookTr25(){if(!ONL.active||!ONL.tr||ONL._h25===ONL.tr)return;ONL._h25=ONL.tr;const tr=ONL.tr;
 tr.on('hand',onHandMsg);
 tr.on('say',m=>{if(!m||!ONL.st)return;const me=ONL.st.seats.findIndex(s=>s&&s.uid===USER.id);if(me<0)return;if(m.knock){if(CHAT_SET!=='off')sfx('knock');return;}
  if(CHAT_SET==='off')return;if(CHAT_SET!=='n'&&m.lo&&(m.id%2))return;const ls=(m.g-me+4)%4;showEmote(ls,String(m.l||'').slice(0,80));sfx('pop');});
 tr.on('throw',m=>{if(!m||!ONL.st)return;const me=ONL.st.seats.findIndex(s=>s&&s.uid===USER.id);const t=THROWS.find(x=>x.id===m.id);if(!t)return;
  if(/^seat\d$/.test(m.from||'')){const f=(+m.from.slice(4)-me+4)%4;let to=localSeatOf(m.to);if(to<0&&/^seat\d$/.test(m.to||''))to=(+m.to.slice(4)-me+4)%4;if(to>=0){throwFX(f,to,m.id);toast(`${t.emo} ${esc(NAMES[f]||'')} ${throwVerb(t)} ${to===0?'bạn':esc(NAMES[to]||'')}`);}}
  if(m.to===USER.id&&t.nice&&!/^seat/.test(m.from||''))giftIn(t,m.from);
  if(ONL.host&&/^seat\d$/.test(m.to||''))hostBotHit(+m.to.slice(4),t,m.from);});
 if(ONL.host)installHostHands(ONL.host);}
setInterval(()=>{try{hookTr25();if(ONL.host)installHostHands(ONL.host);}catch(e){}},400);
const _er25=enterRoom;enterRoom=async function(code,isHost,bots){await ensureKp();ONL.myHand=null;ONL.pendSt=null;
 if(isHost!=='auto'){const r=await _er25(code,isHost,bots);wrapClient25();hookTr25();if(ONL.host)installHostHands(ONL.host);return r;}
 // bàn công khai: vào như khách, chờ presence ổn định rồi bầu chủ bàn
 ONL.joinAt=Date.now();const r=await _er25(code,false,bots);wrapClient25();hookTr25();ONL.autoBet=ONL.autoBet||null;
 const t0=Date.now();const tryElect=()=>{if(!ONL.active||ONL.code!==code)return;if(ONL.room&&ONL.room.host&&ONL.room.host!==USER.id)return;/* đã có chủ */
  const L=presList();if(!L.find(x=>x.uid===USER.id)&&Date.now()-t0<5000)return setTimeout(tryElect,300);
  const h=electHostAt(L);if(h===USER.id)becomeHost(ONL.autoBet);else if(Date.now()-t0<6000)setTimeout(tryElect,700);};
 setTimeout(tryElect,1300);return r;};
// nếu có 2 chủ bàn (vào cùng lúc): người vào sau nhường
setInterval(()=>{try{if(!ONL.active||!ONL.host||!ONL.client||!ONL.client.room)return;const r=ONL.client.room;if(!r.host||r.host===USER.id)return;
 const h=electHostAt(presList());if(h&&h!==USER.id&&h===r.host){ONL.host.stop&&ONL.host.stop();ONL.host=null;ONL.room=r;toast('Đã có chủ bàn — bạn vào làm khách');ONL.client.hello&&ONL.client.hello();renderRoom();}}catch(e){}},700);
// sitTable: luôn bầu chủ bàn qua presence (không dựa vào số người trong sảnh nữa)
sitTable=async function(code){const T=lobbyTables(lobbyPres()),t=T.find(x=>x.code===code);const c=canSit(t,PR,USER.id);if(!c.ok){sfx('bad');return toast(c.reason);}
 ONL.pubAt=Date.now();ONL.autoBet=t.bet;await enterRoom(code,'auto',true);ONL.pub=true;lobbyTrack();};
// state công khai: ghép bài của mình trước khi vẽ
function wrapClient25(){try{if(ONL.client&&!ONL.client._m25){ONL.client._m25=true;const f=ONL.client.onState;ONL.client.onState=st=>{if(ONL.host)return;/* host dùng state đầy đủ */const s=mergeHidden(st);if(s)f(s);else{ONL.pendSt=st;ONL.st=st;}};}}catch(e){}}
setInterval(wrapClient25,200);
// chuyển chủ khi state bị giấu bài: không tiếp tục được ván -> huỷ ván, về phòng
const _opl25=onPresenceLeave;onPresenceLeave=function(uid){const st=ONL.client&&ONL.client.st;if(!ONL.host&&ONL.room&&uid===ONL.room.host&&st&&st.hid&&!st.over){const left=ONL.presence.filter(k=>k!==uid);
  const L=presList().filter(x=>x.uid!==uid);const nh=electHostAt(L.length?L:[{uid:USER.id,at:0}])||electHost(left);if(nh===USER.id){toast('Chủ phòng rời đi — ván bị huỷ, bạn là chủ phòng mới');
   ONL.host=new OnlineHost(ONL.tr,ONL.me,{fillBots:ONL.room.fillBots,dealMs:2300,bet:tableBet(),size:ONL.room.size||4});ONL.host.onState=(s,r)=>{ONL.room=r;renderRoom();if(s)onlineState(s,true);};installHostHands(ONL.host);
   ONL.host.players=[ONL.me,...(ONL.room.seats||[]).filter(s=>s&&s.uid&&s.uid!==uid&&s.uid!==USER.id&&left.includes(s.uid))];ONL.host.assign&&ONL.host.assign();ONL.st=null;G&&(G.over=true);document.body.classList.add('athome');ONL.host.push();renderRoom();}
  else toast('Chủ phòng rời đi — ván bị huỷ, đang chuyển chủ phòng…');return;}
 return _opl25(uid);};
// khi có người (vào lại) phòng: host gửi lại bài riêng
setInterval(()=>{try{if(!ONL.host||!ONL.ch||ONL.ch._j25)return;ONL.ch._j25=true;ONL.ch.on('presence',{event:'join'},({key})=>{if(ONL.host&&ONL.host.resendHands){ONL.host.resendHands(key);setTimeout(()=>ONL.host&&ONL.host.push(),350);}});}catch(e){}},500);
// ---- quà tặng chuyển xu thật (người nhận tự cộng), giới hạn mỗi ngày
const GIFT_CAP=300;
function giftIn(t,fromUid){const d=dk?dk():new Date().toDateString();PR.giftIn=PR.giftIn&&PR.giftIn.d===d?PR.giftIn:{d,v:0};const amt=Math.max(0,Math.min(t.cost,GIFT_CAP-PR.giftIn.v));
 const s=ONL.st&&ONL.st.seats.find(x=>x&&x.uid===fromUid);const nm=s?s.name:'Bạn bè';if(!amt){toast(`${t.emo} ${esc(nm)} tặng bạn (đã đủ ${GIFT_CAP} xu quà hôm nay)`);return;}
 PR.giftIn.v+=amt;PR.xu+=amt;saveP();updHud&&updHud();toast(`${t.emo} ${esc(nm)} tặng bạn +${amt} xu`);}
// ---- máy nói chuyện online: host chọn câu, phát cho mọi người
let _sayId=0,_hLast=0,_hLine={};
function hostSay(g,ev,prob,lo){if(!ONL.host||!ONL.st||!ONL.tr)return;const st=ONL.host.st;if(!st||!st.seats[g]||!st.seats[g].bot)return;const now=Date.now();if(now-_hLast<1500)return;if(Math.random()>(prob==null?1:prob))return;
 const me=st.seats.findIndex(s=>s&&s.uid===USER.id),ls=(g-me+4)%4;const pool=(LINES[persona(ls)]||LINES.brag)[ev];if(!pool)return;let l;do{l=pool[Math.floor(Math.random()*pool.length)];}while(pool.length>1&&l===_hLine[g]);
 _hLine[g]=l;_hLast=now;const m={g,l,id:++_sayId,lo:lo?1:0};ONL.tr.send('say',m);if(CHAT_SET!=='off'&&!(CHAT_SET!=='n'&&m.lo&&(m.id%2))){showEmote(ls,l);sfx('pop');}}
function hostThrow(g,toG,nice){const st=ONL.host&&ONL.host.st;if(!st||!st.seats[g]||!st.seats[g].bot)return;if(Math.random()>.2)return;const id=nice?(Math.random()<.5?'flower':'beer'):(['egg','tomato','slipper'][Math.floor(Math.random()*3)]);
 const tg=st.seats[toG];if(!tg||!ONL.tr)return;const me=st.seats.findIndex(s=>s&&s.uid===USER.id);setTimeout(()=>{if(!ONL.host)return;ONL.tr.send('throw',{from:'seat'+g,to:tg.uid&&!tg.bot?tg.uid:'seat'+toG,id});throwFX((g-me+4)%4,(toG-me+4)%4,id);},700);}
function hostBotHit(g,t,fromUid){setTimeout(()=>{_hLast=0;hostSay(g,t.nice?'gift':'hit',.9);const st=ONL.host&&ONL.host.st;const f=st&&st.seats.findIndex(s=>s&&s.uid===fromUid);if(f>=0&&!t.nice)hostThrow(g,f,false);},600);}
let _hPrevBy=null,_hKey=null;
const _os25=onlineState;onlineState=function(st,fh){_os25(st,fh);try{if(!st||!st.seats)return;const me=st.seats.findIndex(s=>s&&s.uid===USER.id);
 ONL.botai=[0,1,2,3].map(i=>{const s=st.seats[(i+me)%4];return s&&s.bot&&st.ai?st.ai[(i+me)%4]:null;});
 if(!(ONL.host&&fh))return;const hs=ONL.host.st;if(!hs)return;const key=hs.dealId+':'+hs.hist.length+':'+hs.turn+':'+hs.over;if(key===_hKey)return;_hKey=key;const ev=hs.ev||{};
 if(hs.over&&hs.rank){const w=hs.rank[0],l=hs.rank[hs.rank.length-1];setTimeout(()=>{_hLast=0;if(hs.instant){const o=hs.seats.findIndex((s,i)=>s&&s.bot&&i!==w);if(o>=0)hostSay(o,'instant',1);return;}hostSay(w,'win',1);setTimeout(()=>{_hLast=0;hostSay(l,'lose',1);},1400);},3000);_hPrevBy=null;return;}
 if(ev.kind==='play'){if(ev.chop){hostSay(ev.seat,'chop',1);const pb=_hPrevBy;if(pb!=null&&pb!==ev.seat)setTimeout(()=>{_hLast=0;hostSay(pb,'chopped',1);hostThrow(pb,ev.seat,false);},900);}
  else if(hs.hands[ev.seat]&&hs.hands[ev.seat].length===1)hostSay(ev.seat,'one',.8);_hPrevBy=ev.seat;}
 else if(ev.kind==='pass')hostSay(ev.seat,'pass',.25,1);}catch(e){}};
// giục người chơi chậm (host)
let _hIdleK=null,_hIdleT=0,_hIdleS=0;
setInterval(()=>{try{const h=ONL.host,st=h&&h.st;if(!st||st.over||DEALING){_hIdleK=null;return;}const s=st.seats[st.turn];if(!s||s.bot||(st.afk&&st.afk[st.turn])){_hIdleK=null;return;}
 const k=st.dealId+':'+st.hist.length+':'+st.turn;if(k!==_hIdleK){_hIdleK=k;_hIdleT=Date.now();_hIdleS=0;return;}const dt=Date.now()-_hIdleT,bots=st.seats.map((x,i)=>x&&x.bot?i:-1).filter(i=>i>=0);if(!bots.length)return;
 if(dt>8000&&_hIdleS===0){_hIdleS=1;_hLast=0;hostSay(bots[Math.floor(Math.random()*bots.length)],'idle',1);}
 else if(dt>12500&&_hIdleS===1&&ONL.tr){_hIdleS=2;ONL.tr.send('say',{knock:1});if(CHAT_SET!=='off')sfx('knock');_hLast=0;hostSay(bots[Math.floor(Math.random()*bots.length)],'idle',1);}}catch(e){}},500);
// ---- kết ván: bỏ banner 'về nhất' trùng, dời thông báo +XP/-xu ra sau khoảng dừng
const _wfx25=winFX;winFX=function(t,me){if(/về nhất/i.test(String(t))&&!/tới trắng|bích/i.test(String(t)))return;return _wfx25(t,me);};
const _toast25=toast;let _tq25=[];let _endQ=0;toast=function(){if((typeof FIN!=='undefined'&&FIN.active)||Date.now()<_endQ){_tq25.push([...arguments]);return;}return _toast25.apply(this,arguments);};
const _eg25=endGame;endGame=function(i){if(!i)_endQ=Date.now()+400;return _eg25(i);};
const _osE25=onlineState;onlineState=function(st,fh){if(st&&st.over&&st.rank&&!st.instant){const k=JSON.stringify(st.rank)+st.hist.length;if(ONL._eqk!==k){ONL._eqk=k;_endQ=Date.now()+400;}}return _osE25(st,fh);};
setInterval(()=>{if(_tq25.length&&!(FIN&&FIN.active)&&Date.now()>=_endQ){const q=_tq25;_tq25=[];q.forEach((a,i)=>setTimeout(()=>_toast25.apply(null,a),400+i*250));}},250);
// ======== v26: thanh thông tin của mình + ghế máy gọn trên điện thoại ========
const _rm26=renderMe;renderMe=function(){_rm26();try{const e=$('meInfo');if(!e)return;const L=levelInfo(PR.xp),t=currentTitle(PR);
 const turn=G&&!G.over&&G.turn===0&&!document.body.classList.contains('athome');
 e.innerHTML=`<div id="meAvM" class="av ${frameCls()} ${turn?'myturn':''}" style="--avc:${PR.avBg};--lp:${Math.round(100*L.cur/L.need)}">${myAv()}</div>
 <div class="mi2"><div class="l1"><b class="myname">${esc(myName())}</b><span class="mxu">🪙 ${kxu(PR.xu)}</span><small class="dd">▾</small></div>
 <div class="l2"><span class="lvb">${L.level}</span><span class="tw">${titleHTML(t)}</span></div></div>`;
 e.classList.add('m2');}catch(err){}};
function compactSeats(){if(innerWidth>700||!G)return;[1,2,3].forEach(p=>{const e=$('s'+p);if(!e||!e.querySelector)return;const av=e.querySelector('.av'),nm=e.querySelector('.nm'),xu=e.querySelector('.sxu');
 if(nm&&!nm.parentNode.classList.contains('nmrow')){const r=document.createElement('div');r.className='nmrow';nm.before(r);r.appendChild(nm);}
 const row=e.querySelector('.nmrow');if(row&&xu&&xu.parentNode!==row)row.appendChild(xu);
 e.querySelectorAll(':scope > .tag').forEach(t=>{if(t.style.opacity==='0'){t.remove();return;}if(av){t.classList.add('avtag');av.appendChild(t);}});});}
const _r26=render;render=function(){_r26();try{compactSeats();}catch(e){}};
const _ps26=paintSeatXu;paintSeatXu=function(){_ps26();try{compactSeats();}catch(e){}};

showXpDelta=function(d){if(!d||d<=0)return;const b=document.querySelector('#meInfo .lvb');const r=b&&b.getBoundingClientRect();if(r&&r.width)floatText(r.left+r.width/2+20,r.top-8,'+'+fmt(d)+' XP','xp');else{const a=xpAnchor();floatText(a.left+a.width/2,a.top-6,'+'+fmt(d)+' XP','xp');}pulse('#meInfo .lvb','pxp');};
// ======== v27: thúi heo/hàng, 3 bích về nhất, cháy bài (offline + online, thanh toán lúc dừng cuối ván) ========
let THUI=null;/* {list:[{lp,lr,amount,items,cards,b3,chay}],net} theo ghế cục bộ */
function applyThui(list){let net=0;const out=list.map(s=>{let amt=s.amount;if(s.lp===0){amt=Math.min(amt,PR.xu);PR.xu-=amt;net-=amt;}else addBotXu(s.lp,-amt);
  if(s.lr===0){PR.xu+=amt;net+=amt;}else addBotXu(s.lr,amt);return Object.assign({},s,{paid:amt});});THUI={list:out,net};return THUI;}
function thuiFX(){const T=THUI;if(!T||!T.list.length)return;const n=T.list.length,b3=T.list.some(x=>x.b3);
 
 let t0=600;if(b3){setTimeout(()=>{fx(`<div class="banner b3ban">♠ 3 BÍCH VỀ NHẤT! ♠</div>`,2200);sfx('win');try{SND.fanfare&&sfx('fanfare');}catch(e){}},300);t0=2400;}
 T.list.forEach((s,i)=>setTimeout(()=>{const lab=s.chay?'🔥 CHÁY BÀI!':(s.items.some(x=>/heo/.test(x.k))?'THÚI HEO!':s.items.some(x=>/tứ quý|đôi thông/.test(x.k))?'THÚI HÀNG!':'3 BÍCH!');
  finCaption(`${lab} ${s.lp===0?'Bạn':NAMES[s.lp]} −${fmt(s.paid)} xu`,1700,true);sfx(s.chay?'chop':'coin');if(s.paid)moneyFX(s.lp,s.lr,s.paid,lab);render();},t0+i*900));}
function markThuiCards(){if(!THUI)return;const set={};THUI.list.forEach(s=>{set[s.lp]=new Set(s.cards||[]);});
 document.querySelectorAll('#finHands .finfan').forEach(f=>{});/* fans đánh dấu khi tạo */
 const h=$('hand');if(h&&set[0])h.querySelectorAll('.card').forEach(c=>{if(set[0].has(+c.dataset.c))c.classList.add('thui');});}
const _rvh27=revealHands;revealHands=function(){_rvh27();try{if(!THUI)return;const box=$('finHands');if(!box)return;const fans=[...box.querySelectorAll('.finfan')];let k=0;
 (G.seats||[0,1,2,3]).forEach(p=>{if(p===0)return;const h=(G.hands[p]||[]);if(!h.length)return;const f=fans[k++];if(!f)return;const s=THUI.list.find(x=>x.lp===p);if(!s)return;f.classList.add('thuifan');if(s.chay)f.setAttribute('data-l','CHÁY BÀI');
  f.querySelectorAll('.card').forEach(c=>{if((s.cards||[]).includes(+c.dataset.c))c.classList.add('thui');});});markThuiCards();}catch(e){}};
// offline
const _dp27=doPlay;doPlay=function(p,c,s){try{if(G&&!G.online&&G.hands[p]&&c&&G.hands[p].length===c.length){G.finPlay=G.finPlay||{};G.finPlay[p]=c.slice();}}catch(e){}return _dp27(p,c,s);};
const _eg27=endGame;endGame=function(i){THUI=null;try{if(G&&!G.online&&!i){const seats=G.seats||[0,1,2,3],f=G.finished,rank=[...f,...seats.filter(p=>!f.includes(p))];
  const S=thuiSettle(G.hands,rank,curBet(),(G.finPlay||{})[rank[0]]);if(S.length)applyThui(S.map(x=>Object.assign({},x,{lp:x.payer,lr:x.receiver})));}}catch(e){console.error('thui',e);}
 const r=_eg27(i);if(THUI)setTimeout(thuiFX,100);return r;};
// online (host đã tính st.thui)
const _os27=onlineState;onlineState=function(st,fh){let fresh=false;try{if(st&&st.over&&st.rank&&!st.instant){const k=JSON.stringify(st.rank)+st.hist.length+(st.dealId||'');if(ONL._thk!==k){ONL._thk=k;THUI=null;fresh=true;
  const me=st.seats.findIndex(s=>s&&s.uid===USER.id);if(me>=0&&st.thui&&st.thui.length){const L=g=>(g-me+4)%4;
   /* máy & người khác: chỉ cập nhật xu hiển thị của máy; người thật tự trừ/cộng ở máy của họ */
   let net=0;const list=st.thui.map(s=>{const lp=L(s.payer),lr=L(s.receiver);let amt=s.amount;if(lp===0){amt=Math.min(amt,PR.xu);PR.xu-=amt;net-=amt;}if(lr===0){PR.xu+=s.amount;net+=s.amount;}
    const sp=st.seats[s.payer],sr=st.seats[s.receiver];if(sp&&sp.bot)addBotXu(lp,-s.amount);if(sr&&sr.bot)addBotXu(lr,s.amount);return Object.assign({},s,{lp,lr,paid:lp===0?amt:s.amount});});THUI={list,net};}}}}catch(e){console.error(e);}
 const r=_os27(st,fh);if(fresh&&THUI)setTimeout(thuiFX,100);return r;};
// dòng trong bảng kết quả
function thuiRow(){const T=THUI;const m=$('modalIn');if(!T||!T.list.length||!m||m.querySelector('.thuirow'))return;const mine=T.list.filter(s=>s.lp===0||s.lr===0);
 const txt=T.list.map(s=>`${s.lp===0?'Bạn':esc(NAMES[s.lp])} → ${s.lr===0?'bạn':esc(NAMES[s.lr])}: ${s.items.map(x=>x.k).join(', ')} (${fmt(s.paid)} xu)`).join('<br>');
 const d=document.createElement('div');d.className='thuirow';d.innerHTML=`<b>Thúi / cháy / 3 bích</b> <span class="${T.net>=0?'gain':'loss'}">${T.net>=0?'+':'−'}${fmt(Math.abs(T.net))} xu</span><div class="small">${txt}</div>`;
 const rb=m.querySelector('.rewbox')||m.querySelector('button');if(rb)rb.before(d);else m.appendChild(d);}
const _sr27=showResult;showResult=function(r){const x=_sr27(r);try{thuiRow();}catch(e){}return x;};
const _sor27=showOnlineResult;showOnlineResult=function(st){const x=_sor27(st);try{thuiRow();}catch(e){}return x;};
// ======== v28: online dùng trang trí bàn của chủ phòng (nỉ bàn, mặt sau, kiểu bài, hiệu ứng thắng) ========
let TABLE_COS=null;
const _mi28=meInfo;meInfo=function(){const m=_mi28();try{m.cos={back:equipped(PR,'back').id,felt:equipped(PR,'felt').id,deck:equipped(PR,'deck').id,fx:equipped(PR,'fx').id};}catch(e){}return m;};
function cosOk(id,type){const it=id&&shopItem(id);return it&&it.type===type?id:null;}
const _apc28=applyCosmetics;applyCosmetics=function(){_apc28();try{const b=document.body;if(!b||!b.dataset||!TABLE_COS||!ONL.active)return;['back','felt','deck'].forEach(k=>{const v=cosOk(TABLE_COS[k],k);if(v)b.dataset[k]=v;});}catch(e){}};
const _eq28=equipped;equipped=function(P,type){if(type==='fx'&&P===PR&&TABLE_COS&&typeof ONL!=='undefined'&&ONL.active){const v=cosOk(TABLE_COS.fx,'fx');if(v)return shopItem(v);}return _eq28(P,type);};
function syncTableCos(){try{let c=null;if(ONL.active&&ONL.room){if(ONL.host)c=null;else{const h=(ONL.room.seats||[]).find(s=>s&&s.uid===ONL.room.host);c=h&&h.cos||null;}}
 const k=JSON.stringify(c);if(k!==syncTableCos._k){syncTableCos._k=k;TABLE_COS=c;applyCosmetics();}}catch(e){}}
setInterval(syncTableCos,600);

// ======== v29: sổ xu chi tiết của ván ========
let LEDG={xu0:null,s0:{},chop:0};
function ledgStart(){LEDG={res:null,xu0:PR.xu,s0:{},chop:0,t:Date.now()};setTimeout(()=>{try{(G.seats||[0,1,2,3]).forEach(p=>{LEDG.s0[p]=seatXu(p);});}catch(e){}},50);}
const _ng29=newGame;newGame=function(n){const r=_ng29(n);try{if(G&&!G.online)ledgStart();}catch(e){}return r;};
const _os29=onlineState;onlineState=function(st,fh){try{if(st&&st.dealId&&LEDG.deal!==st.dealId){ledgStart();LEDG.deal=st.dealId;}}catch(e){}const r=_os29(st,fh);
 try{if(st&&!st.over&&LEDG.deal===st.dealId&&!LEDG.snap){LEDG.snap=1;(G.seats||[0,1,2,3]).forEach(p=>{LEDG.s0[p]=seatXu(p);});}}catch(e){}return r;};
function thuiParts(){const o={thui:0,chay:0,b3:0};if(!THUI)return o;THUI.list.forEach(s=>{if(s.lp!==0&&s.lr!==0)return;const sign=s.lp===0?-1:1;let left=s.lp===0?s.paid:s.amount;
  s.items.forEach(it=>{const v=Math.min(left,it.v);left-=v;const k=it.k==='cháy bài'?'chay':it.k==='3 bích về nhất'?'b3':'thui';o[k]+=sign*v;});});return o;}
function ledgerParts(){const r=LEDG.res||(G&&G.lastRes)||{},L=r.ledger||{};const t=thuiParts();const chop=G&&!G.online?(G.chopNet||0):(LEDG.chop||0);
 const parts=Object.assign({},L,t,{chop});const known=ledgerItems(parts).total;const actual=LEDG.xu0==null?known:PR.xu-LEDG.xu0;parts.misc=actual-known;return{parts,actual};}
function ledgerBox(){const m=$('modalIn');if(!m||m.querySelector('.ledger'))return;const {parts,actual}=ledgerParts();const {items,total}=ledgerItems(parts);
 const sg=v=>(v>=0?'+':'−')+fmt(Math.abs(v));const d=document.createElement('div');d.className='ledger';
 let others='';try{others=(G.seats||[0,1,2,3]).map(p=>{const v=p===0?actual:(seatXu(p)-(LEDG.s0[p]!=null?LEDG.s0[p]:seatXu(p)));return `<div class="pnr"><span>${p===0?'Bạn':esc(NAMES[p])}</span><b class="${v>=0?'gain':'loss'}">${sg(v)}</b></div>`;}).join('');}catch(e){}
 d.innerHTML=`<div class="lh">Sổ xu ván này</div>${items.map(x=>`<div class="li"><span>${x.l}</span><b class="${x.v>=0?'gain':'loss'}">${sg(x.v)}</b></div>`).join('')}<div class="li tot"><span>Tổng thay đổi</span><b class="${total>=0?'gain':'loss'}">${sg(total)} xu</b></div><div class="small pn">${others}</div>`;
 const rb=m.querySelector('.rewbox')||m.querySelector('button');if(rb)rb.before(d);else m.appendChild(d);}
thuiRow=function(){};
const _sr29=showResult;showResult=function(r){const x=_sr29(r);try{ledgerBox();}catch(e){console.error(e);}return x;};
const _sor29=showOnlineResult;showOnlineResult=function(st){const x=_sor29(st);try{ledgerBox();}catch(e){console.error(e);}return x;};
// ======== v30: máy ngồi lại bàn qua nhiều ván (offline), xu mang theo ========
let BSESS=(()=>{try{return JSON.parse(localStorage.getItem('tlmn_bots')||'null');}catch(e){return null;}})();let _bNew=!BSESS;
function saveBS(){try{localStorage.setItem('tlmn_bots',JSON.stringify(BSESS));}catch(e){}}
function newBotsNext(){_bNew=true;}
botXuSeed=function(name,lv){const bet=Math.max(100,(typeof curBet==='function'?curBet():PR.bet)||100);const h=hashStr(name+Date.now());return Math.round(bet*(8+(h%28)+(lv||5)/4)/10)*10;};
function snapBots(){const n=TBL||4;BSESS={n,bots:{}};[1,2,3].forEach(p=>{BSESS.bots[p]={name:NAMES[p],av:AVATARS[p],ai:BOTAI[p],lv:BOTLV[p],xu:BXU[NAMES[p]]!=null?BXU[NAMES[p]]:botXuSeed(NAMES[p],BOTLV[p])};BXU[NAMES[p]]=BSESS.bots[p].xu;});saveBS();}
const _rb30=rollBots;rollBots=function(){const n=TBL||4;if(_bNew||!BSESS||BSESS.n!==n||!BSESS.bots){_rb30();_bNew=false;[1,2,3].forEach(q=>{delete BXU[NAMES[q]];});snapBots();return;}
 const keep={NAMES:NAMES.slice(),AV:AVATARS.slice(),AI:BOTAI.slice(),LV:BOTLV.slice()};_rb30();/* bộ mới để thay khi cần */const fresh={NAMES:NAMES.slice(),AV:AVATARS.slice(),AI:BOTAI.slice(),LV:BOTLV.slice()};
 const bet=curBet(),seats=SEATMAP[n]||SEATMAP[4];const msgs=[];
 [1,2,3].forEach(p=>{const b=BSESS.bots[p];if(b&&(b.xu>=bet||!seats.includes(p))){NAMES[p]=b.name;AVATARS[p]=b.av;BOTAI[p]=b.ai;BOTLV[p]=b.lv;BXU[b.name]=b.xu;}
  else{let nm=fresh.NAMES[p];if([1,2,3].some(q=>q!==p&&BSESS.bots[q]&&BSESS.bots[q].name===nm))nm=nm+' ';NAMES[p]=nm;AVATARS[p]=fresh.AV[p];BOTAI[p]=fresh.AI[p];BOTLV[p]=fresh.LV[p];BXU[nm]=botXuSeed(nm,BOTLV[p]);
   if(b&&seats.includes(p))msgs.push(`${b.name} hết xu, rời bàn · ${nm.trim()} vào bàn`);}});
 NAMES[0]=myName();snapBots();msgs.forEach((m,i)=>setTimeout(()=>toast(m),600+i*900));};
function syncBS(){try{if(!BSESS||!G||G.online)return;[1,2,3].forEach(p=>{const b=BSESS.bots[p];if(b&&b.name===NAMES[p])b.xu=seatXu(p);});saveBS();}catch(e){}}
const _eg30=endGame;endGame=function(i){const r=_eg30(i);setTimeout(syncBS,200);return r;};
const _sc30=settleChop;settleChop=function(){_sc30();syncBS();};
const _gh30=goHome;goHome=function(){newBotsNext();return _gh30.apply(this,arguments);};
const _ot30=openTables;openTables=function(){newBotsNext();return _ot30.apply(this,arguments);};
// ---- xu ban đầu của máy theo độ khó: Dễ 3-6×, Thường 6-12×, Khó 12-25×, Cao thủ 25-50× cược
const BOT_XU_RANGE=[[3,6],[6,12],[12,25],[25,50]];
function botAiOf(name){try{if(G&&G.online&&ONL.st&&ONL.st.ai){const g=ONL.st.seats.findIndex(s=>s&&s.name===name);if(g>=0)return ONL.st.ai[g];}const p=NAMES.indexOf(name);if(p>0)return BOTAI[p];}catch(e){}return 1;}
botXuSeed=function(name,lv,ai){const bet=Math.max(100,(typeof curBet==='function'?curBet():PR.bet)||100);ai=ai==null?botAiOf(name):ai;const [a,b]=BOT_XU_RANGE[Math.max(0,Math.min(3,ai|0))]||BOT_XU_RANGE[1];
 return Math.round(bet*(a+Math.random()*(b-a))/10)*10;};
// ======== v32: bong bóng chat/biểu cảm nổi trên lớp riêng (không bị render/overflow xoá) ========
const _bubOf={};
function avBox(p){const sels=p===0?['#meAvM','#meBar .av','#meInfo']:['#s'+p+' .av','#s'+p];for(const q of sels){const e=document.querySelector(q);const r=e&&e.getBoundingClientRect&&e.getBoundingClientRect();if(r&&r.width>0&&r.height>0&&e.offsetParent!==null)return r;}return null;}
showEmote=function(p,e,bub){try{let L=$('bubLayer');if(!L){L=document.createElement('div');L.id='bubLayer';document.body.appendChild(L);}
 const txt=String(e||'');if(!txt)return;const big=[...txt].length<=2;const r=avBox(p)||{left:innerWidth/2-20,top:p===0?innerHeight*.75:innerHeight*.25,width:40,height:40,bottom:(p===0?innerHeight*.75:innerHeight*.25)+40};
 let id=bub;if(p===0&&!id)id=equipped(PR,'bubble').id;if(!id&&G&&G.online&&ONL.st){const me=ONL.st.seats.findIndex(s=>s&&s.uid===USER.id);const s=ONL.st.seats[(p+me)%4];id=s&&s.bub;}
 if(_bubOf[p]&&_bubOf[p].remove)_bubOf[p].remove();const d=document.createElement('div');d.className='bubble fl '+(big?'big':'say')+(id?' '+id:'');d.textContent=txt;
 const below=r.top<70;if(below)d.classList.add('below');d.style.left=(r.left+r.width/2)+'px';d.style.top=(below?r.bottom+6:r.top-6)+'px';L.appendChild(d);_bubOf[p]=d;
 const w=d.getBoundingClientRect().width;const cx=Math.max(w/2+4,Math.min(innerWidth-w/2-4,r.left+r.width/2));d.style.left=cx+'px';d.style.setProperty('--ax',((r.left+r.width/2)-cx)+'px');
 setTimeout(()=>{if(d.remove)d.remove();if(_bubOf[p]===d)delete _bubOf[p];},4000);sfx('tap');}catch(err){console.warn('bubble',err);}};
const _mi32=meInfo;meInfo=function(){const m=_mi32();try{m.bub=equipped(PR,'bubble').id;}catch(e){}return m;};
// ======== v33: kết nối lại online ========
let _rcBusy=false,_netDown=0,_wasDown=false;
function netBanner(on){let b=$('netBan');if(on&&!b&&ONL.active){b=document.createElement('div');b.id='netBan';b.textContent='📡 Mất kết nối… đang kết nối lại';document.body.appendChild(b);}else if(!on&&b)b.remove();}
function wireRoomPresence(ch){ch.on('presence',{event:'sync'},()=>{try{ONL.presence=Object.keys(ch.presenceState());}catch(e){}});
 ch.on('presence',{event:'leave'},({key})=>onPresenceLeave(key));
 ch.on('presence',{event:'join'},({key})=>{if(ONL.host&&key!==USER.id){ONL.host.resendHands&&ONL.host.resendHands(key);setTimeout(()=>ONL.host&&ONL.host.push(),300);}});}
async function reconnectRoom(why){if(!ONL.active||!ONL.tr||_rcBusy)return;_rcBusy=true;_wasDown=true;netBanner(true);
 try{const old=ONL.ch;try{await SB.removeChannel(old);}catch(e){}const ch=chan('tlmn:room:'+ONL.code);ONL.ch=ch;ONL.tr.bind(ch);wireRoomPresence(ch);
  ch.subscribe(async st=>{if(st==='SUBSCRIBED'){try{await ch.track({uid:USER.id,name:ONL.me.name,at:ONL.joinAt||Date.now(),spec:!!ONL.me.spec});}catch(e){}
    if(ONL.host){ONL.host.resendHands&&ONL.host.resendHands();ONL.host.push();}else{ONL.client.hello();try{if(ONL.st&&!ONL.st.over)ONL.client.intent?ONL.client.intent({type:'wake'}):ONL.tr.send('intent',{uid:USER.id,a:{type:'wake'}});}catch(e){}}
    _rcBusy=false;_netDown=0;if(_wasDown){_wasDown=false;netBanner(false);toast('✅ Đã kết nối lại');}}
   else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'||st==='CLOSED'){_rcBusy=false;}});
  setTimeout(()=>{_rcBusy=false;},8000);}catch(e){_rcBusy=false;}}
addEventListener('offline',()=>{if(ONL.active){_wasDown=true;netBanner(true);}});
addEventListener('online',()=>{if(ONL.active)setTimeout(()=>reconnectRoom('online'),600);});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ONL.active&&ONL.ch&&ONL.ch.state!=='joined')reconnectRoom('vis');});
setInterval(()=>{try{if(!ONL.active||!ONL.ch)return;const ok=navigator.onLine!==false&&ONL.ch.state==='joined';if(ok){_netDown=0;if(_wasDown&&!_rcBusy){_wasDown=false;netBanner(false);toast('✅ Đã kết nối lại');}return;}
 _netDown+=2;if(_netDown>=4){netBanner(true);_wasDown=true;}if(navigator.onLine!==false&&_netDown>=6&&!_rcBusy)reconnectRoom('watch');}catch(e){}},2000);
// chủ phòng mất kết nối: chờ 20s trước khi chuyển/huỷ
const _opl33=onPresenceLeave;onPresenceLeave=function(uid){if(ONL.active&&!ONL.host&&ONL.room&&uid===ONL.room.host){if(ONL._hostWait)return;toast('Chủ phòng mất kết nối — chờ 20 giây…');
  ONL._hostWait=setTimeout(()=>{ONL._hostWait=null;let back=false;try{back=Object.keys(ONL.ch.presenceState()).includes(uid);}catch(e){}if(!back&&ONL.active&&ONL.room&&ONL.room.host===uid)_opl33(uid);},20000);return;}
 return _opl33(uid);};
setInterval(()=>{try{if(ONL._hostWait&&ONL.room&&Object.keys(ONL.ch.presenceState()).includes(ONL.room.host)){clearTimeout(ONL._hostWait);ONL._hostWait=null;toast('Chủ phòng đã kết nối lại');}}catch(e){}},1000);
// ======== v34: 'Tự đánh' (chỉ online) — máy Cao thủ đánh thay bằng bài của mình + thông tin công khai ========
let AUTOP=false,_apKey=null;
function autoBtn(){let b=$('bAuto');const c=$('ctrl');if(!b&&c&&c.insertBefore){b=document.createElement('button');b.id='bAuto';b.className='alt ic';b.title='Tự đánh (máy Cao thủ)';b.innerHTML='<svg class="i"><use href="#i-bot"/></svg>';b.onclick=()=>setAuto(!AUTOP);const pass=$('bPass');c.insertBefore(b,pass||null);}
 if(b){b.classList.toggle('on',AUTOP);b.style.display=(typeof ONL!=='undefined'&&ONL.active)?'':'none';}
 let ban=$('autoBan');if(AUTOP&&ONL.active&&!document.body.classList.contains('athome')){if(!ban){ban=document.createElement('div');ban.id='autoBan';ban.textContent='🤖 Máy Cao thủ đang đánh thay — chạm để tắt';ban.onclick=()=>setAuto(false);document.body.appendChild(ban);}}else if(ban)ban.remove();}
function setAuto(on){if(on&&!(typeof ONL!=='undefined'&&ONL.active))on=false;AUTOP=!!on;_apKey=null;autoBtn();if(on)toast('🤖 Bật tự đánh');else toast('Tắt tự đánh');}
function autoPlayTick(){try{autoBtn();if(!AUTOP)return;if(!ONL.active){AUTOP=false;return;}const st=ONL.st;if(!st||st.over||DEALING||!G||G.over||G.turn!==0||(typeof FIN!=='undefined'&&FIN.active))return;
 const hand=G.hands[0];if(!hand.length||hand.some(c=>c<0))return;const k=st.dealId+':'+st.hist.length+':'+st.turn;if(k===_apKey)return;_apKey=k;
 setTimeout(()=>{try{if(!AUTOP||!ONL.st||ONL.st.over||G.turn!==0)return;const s=ONL.st;const played=[];(s.hist||[]).forEach(h=>{if(h&&h.cards)played.push(...h.cards);});
  const me=s.seats.findIndex(x=>x&&x.uid===USER.id);const others=s.seats.map((x,g)=>x&&g!==me&&s.hands[g].length?s.hands[g].length:0).filter(Boolean);const fc=s.first?s.firstCard:null;
  let m=null;try{m=aiMove(3,hand.slice(),s.cur,fc,{played,others:others.length?others:[13],budget:150});}catch(e){}
  if(m&&!(detect(m)&&canBeat(detect(m),s.cur)&&(fc==null||m.includes(fc))))m=botMove(hand.slice(),s.cur,fc,others);
  const a=m&&m.length?{type:'play',cards:m}:(s.cur?{type:'pass'}:{type:'play',cards:[fc!=null?fc:hand[0]]});
  if(ONL.host)ONL.host.onIntent({uid:USER.id,a});else ONL.tr.send('intent',{uid:USER.id,a});}catch(e){console.warn('auto',e);}},650);}catch(e){}}
setInterval(autoPlayTick,300);
const _lr34=leaveRoom;leaveRoom=async function(){AUTOP=false;autoBtn();return _lr34.apply(this,arguments);};
// host: rời phòng chập chờn -> chờ 6s mới cho máy thay; vào lại (presence join) -> trả ghế ngay
const _opl33b=onPresenceLeave;onPresenceLeave=function(uid){if(ONL.active&&ONL.host&&uid!==USER.id){setTimeout(()=>{let back=false;try{back=Object.keys(ONL.ch.presenceState()).includes(uid);}catch(e){}if(!back&&ONL.host)_opl33b(uid);},6000);return;}return _opl33b(uid);};
setInterval(()=>{try{if(!ONL.host||!ONL.ch||!ONL.host.st)return;const pres=Object.keys(ONL.ch.presenceState());const st=ONL.host.st;if(st.over)return;
 st.seats.forEach((s,g)=>{if(s&&s.uid&&s.bot&&s.uid!==USER.id&&pres.includes(s.uid)&&!(st.afk&&st.afk[g])){const pl=(ONL.host.players||[]).find(p=>p.uid===s.uid)||{uid:s.uid,name:s.name};ONL.host.addPlayer(Object.assign({},pl,{gone:false}));}});}catch(e){}},1500);
// ======== v35: danh sách người chơi online ở sảnh ========
const _lm35=lobbyMe;lobbyMe=function(){const m=_lm35();try{const i=meInfo();Object.assign(m,{frame:i.frame,title:i.title,tier:i.tier,xu:PR.xu,room:ONL.active?ONL.code:null,pubT:ONL.active&&ONL.pub?ONL.code:null,inGame:!!(ONL.active&&ONL.st&&!ONL.st.over),seats:ONL.active&&ONL.room?(ONL.room.seats||[]).filter(s=>s&&!s.bot).length:0,size:ONL.active&&ONL.room?(ONL.room.size||4):4});}catch(e){}return m;};
let FRIENDS=new Set();async function loadFriendSet(){try{const {data}=await SB.from('tlmn_friends').select('user_id,friend_id,status');FRIENDS=new Set((data||[]).filter(f=>f.status==='accepted').map(f=>f.user_id===USER.id?f.friend_id:f.user_id));}catch(e){}}
function plStatus(p){if(p.room){const t=(typeof publicTables==='function'?publicTables():[]).find(x=>x.code===p.room);const nm=t?'bàn '+t.id:'phòng riêng';return p.inGame?`đang chơi ${nm}`:`đang chờ ở ${nm}`;}return 'ở sảnh';}
function renderPlayers(){const el=$('plList'),cnt=$('plCnt');if(!el)return;const L=lobbyPres().filter(p=>p&&p.uid);const seen={};const list=L.filter(p=>!seen[p.uid]&&(seen[p.uid]=1));
 list.sort((a,b)=>(b.uid===USER.id)-(a.uid===USER.id)||(FRIENDS.has(b.uid)-FRIENDS.has(a.uid))||((b.lv||0)-(a.lv||0)));if(cnt)cnt.textContent=list.length;
 el.innerHTML=list.map(p=>`<button class="alt plrow" onclick="plTap('${esc(p.uid)}')"><span class="av ${'fr-'+esc(p.frame||'fr_gold')}" style="--avc:${esc(p.bg||'#456')}">${esc(p.av||'🙂')}</span>
  <span class="pli"><b>${esc(p.name||'?')}${p.uid===USER.id?' (bạn)':''}${FRIENDS.has(p.uid)?' <i class="frt">bạn bè</i>':''}</b><small><span class="lvb">${p.lv||1}</span> <span class="tt t${p.tier||1}">${esc(p.title||'')}</span></small><small class="pst">${plStatus(p)}</small></span><span class="plxu">🪙 ${kxu(p.xu||0)}</span></button>`).join('')||'<p class="small">Chưa có ai online</p>';}
function plTap(uid){if(uid===USER.id)return;const p=lobbyPres().find(x=>x.uid===uid);if(!p)return toast('Người chơi đã rời sảnh');const free=p.room&&(p.seats||0)<(p.size||4);
 modal(`<h3>${esc(p.name)}</h3><p class="small">Cấp ${p.lv||1} · ${esc(p.title||'')} · 🪙 ${fmt(p.xu||0)} · ${plStatus(p)}</p>
 ${FRIENDS.has(uid)?'<p class="small">✓ Đã là bạn bè</p>':`<button onclick="addFriendUid('${esc(uid)}')">Kết bạn</button>`}
 ${ONL.active&&ONL.code&&p.room!==ONL.code?`<button class="alt" onclick="inviteFriend('${esc(uid)}');closeModal()">Mời vào bàn</button>`:''}
 ${p.room&&p.room!==(ONL.active&&ONL.code)?`<button class="alt" ${free?'':'disabled'} onclick="closeModal();joinSame('${esc(p.room)}',${p.pubT?1:0})">${free?'Vào cùng bàn':'Bàn đã đủ người'}</button>`:''}
 <button class="alt" onclick="openOnline()">Quay lại</button>`);}
async function addFriendUid(uid){try{const r=await SB.from('tlmn_friends').insert({user_id:USER.id,friend_id:uid});toast(r.error?(r.error.code==='23505'?'Đã gửi lời mời trước đó':'Lỗi: '+r.error.message):'Đã gửi lời mời kết bạn');}catch(e){toast('Lỗi kết nối');}closeModal();}
async function joinSame(code,pub){if(pub&&typeof sitTable==='function'){const t=lobbyTables(lobbyPres()).find(x=>x.code===code);if(t)return sitTable(code);}return joinRoom(code);}
const _oo35=openOnline;openOnline=async function(){await _oo35.apply(this,arguments);try{const m=$('modalIn');if(!m||!$('lobbyList')||$('plList'))return;
 $('lobbyList').insertAdjacentHTML('afterend',`<details class="plbox" open><summary><b>Người chơi online</b> <span id="plCnt" class="cntb">0</span></summary><div id="plList" class="pllist"><p class="small">Đang tải…</p></div></details>`);
 loadFriendSet().then(renderPlayers);renderPlayers();}catch(e){}};
setInterval(()=>{try{if($('plList'))renderPlayers();}catch(e){}},2500);
// ======== v36: tin nhắn riêng (DM) qua kênh sảnh (chỉ người đã đăng nhập) + hiện diện khi chơi với máy ========
const _lm36=lobbyMe;lobbyMe=function(){const m=_lm36();try{m.bot=!ONL.active&&!!G&&!G.over&&!document.body.classList.contains('athome');}catch(e){}return m;};
const _ps36=plStatus;plStatus=function(p){if(!p.room&&p.bot)return 'đang chơi với máy';return _ps36(p);};
// tự vào sảnh khi đã đăng nhập & có mạng (để bạn bè thấy và nhắn tin được)
setInterval(()=>{try{if(typeof USER!=='undefined'&&USER&&CLOUD_ON&&navigator.onLine!==false&&!LOBBY&&typeof SB!=='undefined'&&SB)joinLobby();if(LOBBY)lobbyTrack();}catch(e){}},8000);
let DMS=(()=>{try{return JSON.parse(localStorage.getItem('tlmn_dms')||'{}');}catch(e){return{};}})(),DMU=(()=>{try{return JSON.parse(localStorage.getItem('tlmn_dmu')||'{}');}catch(e){return{};}})();
let BLOCK=new Set((()=>{try{return JSON.parse(localStorage.getItem('tlmn_block')||'[]');}catch(e){return[];}})());
function saveDM(){try{localStorage.setItem('tlmn_dms',JSON.stringify(DMS));localStorage.setItem('tlmn_dmu',JSON.stringify(DMU));localStorage.setItem('tlmn_block',JSON.stringify([...BLOCK]));}catch(e){}dmBadge();}
function cleanMsg(t){t=String(t||'').replace(/\s+/g,' ').trim().slice(0,200);return t.split(' ').map(w=>{const f=foldVi(w).replace(/[^a-z0-9]/g,'');return BAD_WORDS.some(b=>!b.includes(' ')&&f===b.replace(/ /g,''))?'*'.repeat(Math.max(3,[...w].length)):w;}).join(' ');}
function dmPush(peer,msg){(DMS[peer]=DMS[peer]||{name:msg.name||'?',list:[]}).list.push(msg);if(msg.name&&!msg.me)DMS[peer].name=msg.name;DMS[peer].list=DMS[peer].list.slice(-30);DMS[peer].at=Date.now();}
let _dmTimes=[];
function sendDM(to,text){if(!LOBBY||!USER)return toast('Cần đăng nhập và có mạng'),false;const t=cleanMsg(text);if(!t)return false;const now=Date.now();_dmTimes=_dmTimes.filter(x=>now-x<60000);
 if(_dmTimes.length>=20||(_dmTimes.length&&now-_dmTimes[_dmTimes.length-1]<1200)){toast('Gửi chậm lại chút nhé');return false;}_dmTimes.push(now);
 const nm=(typeof myName==='function'?myName():PR.name)||'Người chơi';LOBBY.ch.send({type:'broadcast',event:'dm',payload:{to,from:USER.id,name:nm,t,at:now}});dmPush(to,{me:1,t,at:now,name:(lobbyPres().find(p=>p.uid===to)||{}).name});saveDM();return true;}
function onDM(m){const p=m&&m.payload;if(!p||p.to!==USER.id||!p.from||BLOCK.has(p.from))return;const t=cleanMsg(p.t);if(!t)return;dmPush(p.from,{t,at:Date.now(),name:String(p.name||'?').slice(0,20)});DMU[p.from]=(DMU[p.from]||0)+1;saveDM();sfx('pop');dmPopup(p.from);}
function dmPopup(peer){const c=DMS[peer];if(!c)return;const last=c.list[c.list.length-1];let d=$('dmPop');if(d)d.remove();d=document.createElement('div');d.id='dmPop';
 d.innerHTML=`<div class="dmh"><b>💬 ${esc(c.name)}</b><button class="x" onclick="this.closest('#dmPop').remove()">✕</button></div><div class="dmt">${esc(last.t)}</div><div class="dmr"><input class="inp" maxlength="200" placeholder="Trả lời…" onkeydown="if(event.key==='Enter'){dmQuick('${esc(peer)}',this)}"><button onclick="dmQuick('${esc(peer)}',this.previousElementSibling)">Gửi</button></div><a class="small" onclick="openDM('${esc(peer)}')">Mở hộp thư</a>`;
 document.body.appendChild(d);clearTimeout(dmPopup._t);dmPopup._t=setTimeout(()=>{const x=$('dmPop');if(x&&!x.contains(document.activeElement))x.remove();},9000);}
function dmQuick(peer,inp){if(sendDM(peer,inp.value)){inp.value='';toast('Đã gửi');const x=$('dmPop');if(x)x.remove();}}
function dmUnread(){return Object.keys(DMU).reduce((a,k)=>a+(BLOCK.has(k)?0:DMU[k]||0),0);}
function dmBadge(){let b=$('dmBtn');const logged=typeof USER!=='undefined'&&USER;const n=dmUnread();const home=document.body.classList.contains('athome');
 if(!logged||!home||(typeof CS!=='undefined'&&CS.open)){if(b)b.remove();return;}if(!b){b=document.createElement('button');b.id='dmBtn';b.className='alt';b.onclick=()=>openDM();document.body.appendChild(b);}b.innerHTML=`💬${n?`<i>${n}</i>`:''}`;b.title='Tin nhắn';}
setInterval(dmBadge,1500);
function openDM(peer){const x=$('dmPop');if(x)x.remove();if(!peer){const ks=Object.keys(DMS).filter(k=>!BLOCK.has(k)).sort((a,b)=>(DMS[b].at||0)-(DMS[a].at||0));const on=new Set(lobbyPres().map(p=>p.uid));
  modal(`<h3>💬 Tin nhắn</h3>${ks.map(k=>`<button class="alt plrow" onclick="openDM('${esc(k)}')"><span class="pli"><b>${esc(DMS[k].name)} ${on.has(k)?'<i class="frt">online</i>':''}</b><small>${esc((DMS[k].list.slice(-1)[0]||{}).t||'')}</small></span>${DMU[k]?`<span class="cntb">${DMU[k]}</span>`:''}</button>`).join('')||'<p class="small">Chưa có tin nhắn. Mở Sảnh online → Người chơi online → Nhắn tin.</p>'}
  ${BLOCK.size?`<p class="small">Đã chặn: ${[...BLOCK].map(k=>`${esc((DMS[k]||{}).name||'?')} <a onclick="BLOCK.delete('${esc(k)}');saveDM();openDM()">bỏ chặn</a>`).join(' · ')}</p>`:''}<button class="alt" onclick="closeModal()">Đóng</button>`);return;}
 DMU[peer]=0;saveDM();const c=DMS[peer]||{name:(lobbyPres().find(p=>p.uid===peer)||{}).name||'Người chơi',list:[]};
 modal(`<h3>💬 ${esc(c.name)}</h3><div id="dmLog" class="dmlog">${c.list.map(m=>`<div class="dm ${m.me?'me':''}">${esc(m.t)}</div>`).join('')||'<p class="small">Bắt đầu trò chuyện</p>'}</div>
  <div class="dmr"><input id="dmIn" class="inp" maxlength="200" placeholder="Nhắn tin…" onkeydown="if(event.key==='Enter')dmSendUI('${esc(peer)}')"><button onclick="dmSendUI('${esc(peer)}')">Gửi</button></div>
  <div class="row"><button class="alt" onclick="openDM()">Hộp thư</button><button class="alt" onclick="if(confirm('Chặn người này? Bạn sẽ không nhận tin nhắn của họ.')){BLOCK.add('${esc(peer)}');saveDM();openDM()}">Chặn</button></div>`);
 const L=$('dmLog');if(L)L.scrollTop=1e6;}
function dmSendUI(peer){const i=$('dmIn');if(i&&sendDM(peer,i.value)){i.value='';openDM(peer);setTimeout(()=>{const j=$('dmIn');j&&j.focus();},50);}}
setInterval(()=>{try{if(LOBBY&&LOBBY.ch&&!LOBBY.ch._dm36){LOBBY.ch._dm36=1;LOBBY.ch.on('broadcast',{event:'dm'},onDM);}}catch(e){}},700);
// thêm 'Nhắn tin' vào thẻ người chơi
const _pt36=plTap;plTap=function(uid){_pt36(uid);try{const m=$('modalIn');if(!m||uid===USER.id)return;const btns=[...m.querySelectorAll('button')];const back=btns[btns.length-1];
 const b=document.createElement('button');b.className='alt';b.textContent='💬 Nhắn tin';b.onclick=()=>openDM(uid);back.before(b);
 const k=document.createElement('button');k.className='alt';k.textContent=BLOCK.has(uid)?'Bỏ chặn':'Chặn';k.onclick=()=>{BLOCK.has(uid)?BLOCK.delete(uid):BLOCK.add(uid);saveDM();plTap(uid);};back.before(k);}catch(e){}};
// ======== v37: số phiên bản + Có gì mới ========
const APP_V='1.52.9';
const CHANGELOG=[
 ['1.52.9','13/10',['Bầu Cua: chuyển nút chọn 2–6 người lên ngay dưới hàng avatar, luôn dễ thấy','Làm nổi bật nút đang chọn và khóa đổi người khi đang lắc/mở bát','Không thay đổi luật chơi và số xu khi nâng cấp vị trí nút']],
 ['1.52.8','13/10',['Bầu Cua: chọn 2–6 người chơi ngay trong bàn, gồm nhà cái và người chơi','Tự điều chỉnh số người máy khi chuyển giữa Chơi con và Làm cái','Sắp xếp avatar thành tối đa 2 hàng × 3 cột, chip màu dưới từng người','Cân bằng khoảng trống giữa người chơi, bát và 6 ô cược trên màn hình dài','Đã kiểm tra cú pháp JavaScript và mô phỏng đủ 2–6 vị trí ở cả hai vai trò']],
 ['1.52.7','13/10',['Bầu Cua: bố cục thích ứng màn hình điện thoại, cân đối bàn cược và khu vực điều khiển','Chip màu dưới avatar rõ hơn, phân biệt người đã đặt và chưa đặt','Làm mới ô cược, màu bàn và trạng thái thắng theo cách nhẹ và ổn định','Không thay đổi luật chơi hoặc JavaScript Bầu Cua để hạn chế lỗi đứng màn hình']],
 ['1.52.6','13/10',['Bầu Cua: làm mới giao diện bàn đỏ, ô cược nổi khối và thanh điều khiển','Cân đối khoảng trống trên màn hình dài, giữ toàn bộ nút điều khiển dễ thao tác','Chip người chơi phát sáng nhẹ khi đã cược, loại bỏ số tiền cược hiển thị trùng','Hiệu ứng lắc bát, chip rơi và ô thắng sinh động hơn; tôn trọng chế độ giảm chuyển động']],
 ['1.52.5','13/10',['Bầu Cua: sửa bố cục bị lệch và phần nội dung không vừa màn hình điện thoại','Hiển thị chip màu và số xu đã cược ngay dưới avatar từng người chơi','Chip mờ khi chưa đặt, chip sáng khi đã đặt để dễ phân biệt','Thu gọn bát, bàn cược và nút điều khiển; hỗ trợ cuộn khi màn hình thấp']],
 ['1.52.4','13/10',['Bầu Cua: sửa lỗi mất xu khi thoát bàn trước khi mở bát','Bầu Cua: ngăn đổi lượt cược khi máy đang đặt hoặc đang lắc','Bầu Cua: tối ưu bàn cược và nút bấm trên điện thoại, hiển thị tên người chơi gọn hơn','Hỗ trợ giảm chuyển động trong giao diện Bầu Cua']],
 ['1.52.2','12/10',['Bài to hơn trên điện thoại: bài trên tay xếp 1 hàng hình quạt cong tràn ngang màn hình (như sòng bài), lá to hơn ~10–20%','Bài đánh trên bàn to hơn, tự xếp chồng gọn khi đánh nhiều lá','3 Cào, Xì dách, Poker: bài của bạn to hơn']],
 ['1.52.1','12/10',['Hàng 5 sao hạng chế độ hiện TRÊN avatar ở mọi ghế (bạn và máy) trong cả 8 chế độ, và trên avatar màn chính (chế độ cao nhất)','Luôn hiện đủ 5 ô sao: sao đạt tô màu hạng (Đen có nền sáng + hào quang tím), sao chưa đạt là viền mờ','Máy có hạng sao cố định theo tên']],
 ['1.52','12/10',['Hạng sao theo từng chế độ: 7 hạng × 5 sao (Đồng → Bạc → Vàng → Kim cương → Xanh → Đỏ → Đen) theo XP kiếm ở chế độ đó; sao hiện dưới avatar khi chơi; mỗi sao cộng % thu nhập thụ động (tối đa +86%/chế độ, +688% cả 8 chế độ); màn Hạng sao + hiệu ứng lên sao + huy hiệu','Thú cưng trong Tài sản: Mèo, Chó, Vẹt, Cáo, Rồng (có hoạt ảnh); 1 con đi theo cạnh avatar, cộng % EXP','Bấm bạn bè/người online để xem hồ sơ: tài sản, thú cưng, hạng sao, tổng % thu nhập & EXP; có thể ẩn trong Cài đặt']],
 ['1.51','12/10',['XP tỉ lệ thời gian ván (~41 XP/phút): Miền Nam 4 người 100/60/35/20, 3 người 46/28/16, 2 người 32/19; Đếm lá 83/50/29/17 (3 người 38/23/13, 2 người 27/16); 3 Cào 8/4/3, Xì dách 13/7/4, Bầu cua 24/12/8, Domino 35/17/12, Xì tố 32/16/10, Poker 30/15/10','Bảng XP từng chế độ trong cửa sổ Cấp độ; nhãn XP ở màn chọn bàn']],
 ['1.50','12/10',['Tài sản thành mục riêng ở màn hình chính: Kinh doanh, Phương tiện (Xe đạp → Du thuyền, tăng % thu nhập, nâng cấp 5 cấp) và Mua sắm (12 món Quần áo, Trang sức, Phụ kiện, Vật phong thủy, tăng % EXP ở mọi chế độ, đủ bộ +40%)','Bấm thanh Thu nhập thụ động để xem công thức, số xu mỗi giây/giờ/ngày và thưởng từng tài sản','Tài sản giá trị nhất hiện cạnh avatar; huy hiệu Bộ sưu tập xe, Tín đồ thời thượng']],
 ['1.49','12/10',['Thu nhập thụ động: nhận xu liên tục theo cấp (cấp ÷ 2 ÷ 100 xu mỗi giây, cấp 20 = 360 xu/giờ), tích luỹ cả khi tắt app, tối đa 24 giờ; bộ đếm chạy trực tiếp ở màn hình chính, bấm Nhận để lấy; đồng bộ đám mây chống nhận 2 lần','Cửa hàng › Tài sản: Quán nước, Tiệm tạp hóa, Xưởng may, Nhà máy, Tập đoàn — tăng % thu nhập thụ động, nâng cấp tới cấp 5; huy hiệu Ông chủ nhà máy, Chủ tịch tập đoàn, Đế chế kinh doanh, Tài phiệt tối thượng']],
 ['1.48.4','11/10',['Xì tố: lá bài dùng đúng kiểu bài (mặt bài) đã trang bị; kiểm tra mặt sau, kiểu bài, nỉ bàn ở mọi chế độ']],
 ['1.48.3','11/10',['Xì tố “Tố tất” và Poker “Tất tay”: hiệu ứng hoành tráng — chớp màn hình, chữ lớn rực lửa rung, chip đổ ào vào hũ, rung bàn, trống dồn + tiếng chip + tiếng nổ trầm; ghế tất tay có nhãn ALL-IN và hào quang đến lúc lật bài']],
 ['1.48.2','11/10',['Xì tố: lá bài to hơn nữa, góc số + chất to đậm, chất lớn giữa lá, màu tương phản (♠♣ đen, ♥ đỏ, ♦ cam đỏ), vẽ bằng SVG']],
 ['1.48.1','11/10',['Sửa: khung avatar của bạn hiển thị đúng ở Bầu cua và Domino']],
 ['1.48','11/10',['Huy hiệu riêng cho từng chế độ: Đếm lá, 3 Cào, Xì dách, Bầu cua, Domino, Xì tố, Poker — mỗi chế độ 70 huy hiệu như Miền Nam (số ván, thắng, chuỗi, thắng lớn, làm cái, vét túi máy, cược cao, bài hiếm, bí mật…), có hạng Đồng/Bạc/Vàng/Huyền thoại','Màn Huy hiệu chia tab theo chế độ + lọc Đã mở/Chưa mở/Bí mật','Mọi chế độ hiển thị cấp, danh hiệu và khung avatar của bạn và máy; báo +XP sau mỗi ván','Sửa huy hiệu bí mật “Chặt chồng” không mở được']],
 ['1.47','11/10',['Giao diện màn hình chính gọn hơn: chọn chế độ 4×2, các ô công cụ đều nhau, Gói trợ cấp thành dải ngang riêng với biểu tượng 💰']],
 ['1.46','11/10',['Gói trợ cấp: khi hết sạch xu (đúng 0), nhận 1.000 xu × cấp, 1 lần mỗi ngày — ô mới ở màn hình chính, có đếm ngược, đồng bộ đám mây chống nhận 2 lần','Xì tố: bài to rõ hơn (bài của bạn và bài ngửa của máy)','Poker: bỏ số xu bị hiện trùng ở ghế máy']],
 ['1.45','11/10',['Chế độ mới: Poker Texas Hold’em — 2-6 người, mù nhỏ/mù lớn, flop/turn/river, xem/theo/tố/tố hũ/tất tay, hũ phụ, máy chơi theo sức bài + ngẫu nhiên','Domino: dây nối dạng rắn quay đầu ở mép, đôi đặt dọc, tự co giãn, hai đầu mở phát sáng; chọn quân rồi bấm Đánh, chọn đầu trái/phải, nút Bốc/Bỏ lượt, quân không hợp mờ đi','Xì tố: tố x1–x10 tiền xâu, Úp/Theo/Xem, Tố tất (xác nhận), máy cũng tố tất; chia bài từng vòng có bay bài + lật','Bầu cua: chip bay vòng cung từ người đặt tới ô cược, máy đặt lần lượt','Huy hiệu/nhiệm vụ/danh hiệu Poker']],
 ['1.44','11/10',['Chế độ mới: Xì tố 32 lá (7→A) — 2-5 người, lá tẩy úp, 4 vòng cược Xem/Theo/Tố/Bỏ, tất tay có hũ phụ, máy cược theo sức bài','Bầu cua: mỗi người một màu, chip có avatar trên từng ô, chip thắng bay về chủ, chip thua về nhà cái','Huy hiệu/nhiệm vụ/danh hiệu Xì tố']],
 ['1.43','11/10',['Chế độ mới: Domino đôi sáu — 2-4 người, bốc nọc khi không đi được, bí bài tính người ít nút nhất, người thua trả xu theo số nút còn lại','Huy hiệu/nhiệm vụ/danh hiệu Domino']],
 ['1.42','11/10',['Chế độ mới: Bầu cua tôm cá — đặt chip nhiều ô, lắc bát có âm thanh, mở bát, trả 1 ăn 1 mỗi mặt trùng; chơi con hoặc làm cái','Huy hiệu/nhiệm vụ/danh hiệu Bầu cua; ô chọn chế độ 3 cột']],
 ['1.41','11/10',['3 Cào & Xì dách: hộp bài xào kiểu riffle, chia từng lá theo vòng bay vòng cung có xoay và bóng đổ, lật bài 3D, rút bài trượt từ hộp, nhà cái lật hồi hộp từng lá','Hiệu ứng XÌ DÁCH / XÌ BÀNG / NGŨ LINH / BA CÀO / QUẮC; âm thanh mới: xào bài, lướt bài, chạm nỉ, lật bài, chip, nhạc thắng/thua, kèn xì dách']],
 ['1.40','11/10',['3 Cào & Xì dách: chọn bàn 2–6 người, Chơi con hoặc Làm cái (ăn/chung từng nhà, xét từng nhà ở Xì dách), xu của máy hiện dưới ghế, bảng tiền từng nhà','Danh sách online hiện chế độ + mức cược người đang chơi với máy','Xem bàn người đang chơi với máy (chỉ thấy bài đã lật); tuỳ chọn “Cho người khác xem bàn của tôi” trong Cài đặt']],
 ['1.39','11/10',['Chế độ người xem bàn online: nút Xem ở sảnh, danh sách người online, link ?room=MÃ&xem=1; chat có nhãn 👁; Ngồi vào khi hết ván','32 danh hiệu mới (cấp 2→100, Luộc Sư, Vua Đếm Lá, Thánh Ba Cào, Thần Xì Dách, Ngũ Linh Tướng, Sát Thủ Thúi Heo, Phong Lưu, Đại Sứ Thân Thiện, Top Server…) có hiệu ứng động','21 khung avatar mới (giá tới 500k): Băng, Lửa, Thiên Hà, Nguyệt Quế Vàng, Rồng Ngọc… một số mở bằng cấp/huy hiệu','Bảng danh hiệu chia nhóm, hiện điều kiện mở']],
 ['1.38','11/10',['3 Cào: nặn bài — vuốt từng lá để hé dần, nút Lật hết','Điểm hiển thị nổi bật (N nút / N điểm / Ba cào, Xì bàng, Xì dách, Ngũ linh, Quắc, Non)','Dấu THẮNG / THUA / HÒA đóng lên từng tay bài khi tính tiền']],
 ['1.37','11/10',['Chọn chế độ dạng lưới 2x2 đẹp hơn, không tràn màn hình','Kết quả Đếm lá: danh sách dọc từng người (số lá, phần, xu), tiền từng người theo hàng','3 Cào / Xì dách dùng mặt sau bài bạn đã mua']],
 ['1.36','11/10',['Chế độ mới: Xì dách — đấu nhà cái: Xì bàng x3, Xì dách x2, Ngũ linh x2, non dưới 16, quắc quá 21; nhà cái rút tới 15','Nhiệm vụ + huy hiệu Xì dách']],
 ['1.35','11/10',['Đếm lá: tính theo giá lá (3–10 = 1, J/Q/K = 1,5, A = 2, 2 đen = 3, 2 đỏ = 4 phần cược/5), cháy 13 lá x2','Chế độ mới: 3 Cào — đấu nhà cái, tổng điểm lấy số cuối, Ba cào (3 lá J/Q/K) thắng x2','Bàn 4 người cân đối: avatar của bạn ở giữa cạnh dưới bàn']],
 ['1.34','11/10',['Chế độ mới: Tiến Lên đếm lá — người thua trả người nhất cược/13 mỗi lá còn lại (heo tính 2 lá), không thúi heo','Chọn chế độ chơi ở màn hình chính','Nhiệm vụ + huy hiệu Đếm lá']],
 ['1.33','11/10',['Thúi heo/hàng và cháy bài: trả cho người về ngay trên mình (bét trả ba, ba trả nhì, nhì trả nhất); 3 bích về nhất vẫn trả người nhất','Sửa hưởng sái: giữ bài cuối của người vừa về, bắt bài hiển thị đúng, chữ “X hưởng sái”, nhãn Nhất/Nhì trên ghế']],
 ['1.32','11/10',['Xin vào chơi: vào bàn của người đang chơi với máy, bàn chuyển thành phòng online','Ô “Người online” ở màn hình chính: bạn bè, người đang online, nhắn tin, mời, chặn','Bàn 10k: thắng Cao thủ được thưởng thêm XP (không thêm xu)','Khung chat mới dạng ngăn kéo: tab Bàn / Tin nhắn riêng, bong bóng có avatar + giờ, câu nhanh, emoji, không che bài']],
 ['1.31','11/10',['Mức cược 10.000 khi chơi với máy: cả bàn là Cao thủ, thưởng thêm XP khi thắng (không thưởng thêm xu)']],
 ['1.30','11/10',['6 avatar Tối thượng 500.000 xu: Rồng Vàng Thăng Thiên, Phượng Hoàng Lửa Bất Tử, Thần Tài Kim Cương, Hổ Bạch Kim, Long Vương Đại Dương, Đổ Thánh Vô Song — hào quang, tia sáng xoay, lấp lánh, khung chuyển màu','Giá avatar mới: Hiếm 20k–50k, Sử thi 100k, Huyền thoại 500k (cần cấp 20/35); Tối thượng cần cấp 45','Đồ đã mua giữ nguyên']],
 ['1.29','11/10',['Tăng giá avatar cao cấp: Hiếm 1.500, Sử thi 3.000, Huyền thoại 6.000, Chí tôn 12.000 xu','Avatar Huyền thoại cần cấp 15, Chí tôn cần cấp 50 (đồ đã mua giữ nguyên)']],
 ['1.28','11/10',['Kết nối lại online tự động: mất mạng vẫn về đúng ghế, chủ phòng có 20 giây để quay lại','Nút “Tự đánh” (chỉ online): máy Cao thủ đánh thay','Danh sách người chơi online ở sảnh: kết bạn, mời, vào cùng bàn','Tin nhắn riêng giữa người chơi (kể cả khi đang chơi với máy), chặn/bỏ chặn','30+ avatar vẽ tay cao cấp: Thần Tài, Rồng Vàng, Phượng Hoàng, Đổ Thánh…','Hiện số phiên bản và mục Có gì mới']],
 ['1.27','11/10',['Sửa bong bóng chat/biểu cảm không hiện']],
 ['1.26','11/10',['Xu ban đầu của máy theo độ khó','Chọn bàn không bị tràn chữ ở mọi mức cược']],
 ['1.24','11/10',['Giấu bài online (mã hoá từng người), quà tặng chuyển xu thật','Thúi heo/hàng, cháy bài, 3 bích về nhất','Màn xem lại cuối ván + nút Tiếp tục, sổ xu chi tiết','Máy ngồi lại bàn và giữ xu qua nhiều ván','Trang trí bàn online theo chủ phòng']],
 ['1.23','11/10',['Hoạt cảnh chia bài online','Hiện xu dưới avatar mọi người','Giữ nước bài cuối và ngửa bài khi hết ván']],
 ['1.20','11/10',['Đồng hồ lượt 15 giây, treo máy thì máy đánh thay','Tiền chặt heo chuyển thật, chặt chồng','Hiệu ứng nhận thưởng xu/XP','Đăng nhập Google, quên mật khẩu']],
 ['1.13','11/10',['Xếp bài thông minh theo bộ','Bàn chờ + nút Bắt đầu sau mỗi ván']],
 ['1.10','11/10',['Bảng xếp hạng online','Máy nói chuyện, ăn mừng huy hiệu toàn màn hình']],
 ['1.9','11/10',['4 độ khó máy (Dễ → Cao thủ)','Chọn mức cược, nhạc nền','Nhiệm vụ ngày/tuần, 43 huy hiệu']],
 ['1.8','11/10',['Sảnh bàn online, vòng quay may mắn, ném đồ/tặng quà']],
 ['1.6','11/10',['Chọn bàn 2/3/4 người, danh hiệu mới theo bậc']],
 ['1.4','11/10',['Chơi online với bạn bè: phòng mã 6 ký tự, chat, bạn bè']],
 ['1.3','11/10',['Màn hình chính, cửa hàng vật phẩm, avatar']],
 ['1.2','10/10',['Cấp độ, danh hiệu, giao diện cao cấp','Cài đặt như ứng dụng (PWA), sao lưu đám mây']],
 ['1.0','10/10',['Ra mắt Tiến Lên Miền Nam offline: xu, cược, huy hiệu, quà điểm danh, nhiệm vụ']]];
function newSeen(){return localStorage.getItem('tlmn_seenv')===APP_V;}
function openChangelog(){try{localStorage.setItem('tlmn_seenv',APP_V);}catch(e){}modal(`<h3>✨ Có gì mới · v${APP_V}</h3><div class="clog">${CHANGELOG.map(([v,d,l],i)=>`<details ${i===0?'open':''}><summary><b>v${v}</b> <small class="small">${d}</small></summary><ul>${l.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`).join('')}</div><button onclick="closeModal()">Tuyệt!</button>`);try{renderHome&&document.body.classList.contains('athome')&&renderHome();}catch(e){}}
const _rh37=renderHome;renderHome=function(){_rh37.apply(this,arguments);try{const h=$('home');if(!h||ONL.active)return;let f=$('verf');if(f)f.remove();f=document.createElement('div');f.id='verf';
 f.innerHTML=`<span>Phiên bản v${APP_V}</span> · <a onclick="openChangelog()">Có gì mới${newSeen()?'':'<i class="rdot"></i>'}</a>`;(h.querySelector('.hwrap')||h).appendChild(f);}catch(e){}};
const _os37=openSettings;openSettings=function(){_os37.apply(this,arguments);try{const m=$('modalIn');if(!m)return;const b=[...m.querySelectorAll('button')].pop();const d=document.createElement('div');d.className='row';d.innerHTML=`<span style="flex:1">Phiên bản <b>v${APP_V}</b></span><button class="alt" onclick="openChangelog()">Có gì mới${newSeen()?'':' 🔴'}</button>`;if(b)b.before(d);else m.appendChild(d);}catch(e){}};
setTimeout(()=>{try{if(!newSeen()&&(localStorage.getItem('tlmn_seenv')!=null||((PR.stats&&PR.stats.games)||0)>0)){const go=()=>{if(modalOpen()||!document.body.classList.contains('athome'))return setTimeout(go,2500);openChangelog();};setTimeout(go,2500);}else if(localStorage.getItem('tlmn_seenv')==null){try{localStorage.setItem('tlmn_seenv',APP_V);}catch(e){}}}catch(e){}},1500);
// ======== v39: chỉ số cho huy hiệu mới + Luộc máy ========
function bst(k,n){PR.stats[k]=(PR.stats[k]||0)+(n==null?1:n);}
function avStats(){try{const av=SHOP.filter(x=>x.type==='avatar'&&owns(PR,x.id));PR.stats.avOwn=av.length;PR.stats.avLegend=av.filter(x=>(x.r||0)>=4).length;}catch(e){}}
const _sdm39=sendDM;sendDM=function(to,t){const ok=_sdm39(to,t);if(ok){bst('dms');evBadge();}return ok;};
const _gi39=giftIn;giftIn=function(t,f){const r=_gi39(t,f);bst('giftGot');evBadge();return r;};
const _st39=sendThrow;sendThrow=function(ls,id){const x0=PR.xu;_st39(ls,id);const t=THROWS.find(x=>x.id===id);if(PR.xu<x0&&t&&t.nice){bst('giftSent');evBadge();}};
const _db39=doBuy;doBuy=function(id){const x0=PR.xu;_db39(id);if(PR.xu<x0)bst('spent',x0-PR.xu);avStats();evBadge();};
const _sn39=spinNow;spinNow=function(){const n0=(PR.spin&&PR.spin.total)||0;_sn39();if(((PR.spin&&PR.spin.total)||0)>n0){const d=new Date().toDateString(),y=new Date(Date.now()-864e5).toDateString();if(PR.stats.spinDay!==d){PR.stats.spinRun=PR.stats.spinDay===y?(PR.stats.spinRun||0)+1:1;PR.stats.spinDay=d;PR.stats.spinStreak=Math.max(PR.stats.spinStreak||0,PR.stats.spinRun);}evBadge();}};
const _cq39=claimQuest;claimQuest=function(P,i,w){const r=_cq39(P,i,w);if(r&&P===PR)bst(w?'qWeek':'qDone');return r;};
const _lf39=loadFriendSet;loadFriendSet=async function(){const r=await _lf39.apply(this,arguments);try{PR.stats.friends=Math.max(PR.stats.friends||0,FRIENDS.size);evBadge();}catch(e){}return r;};
function lbRankSeen(r){if(r&&r>0){PR.stats.lbBest=Math.min(PR.stats.lbBest||999,r);evBadge();}}
let _passed39=false;const _hp39=humanPass;humanPass=function(){if(G&&G.turn===0&&!G.over)_passed39=true;return _hp39.apply(this,arguments);};
const _ng39=newGame;newGame=function(){_passed39=false;LUOC.tbl=LUOC.tbl||0;return _ng39.apply(this,arguments);};
const LUOC={tbl:0,xu:0};const LUOC_XP=[30,60,120,250];
const _lp39=ledgerParts;ledgerParts=function(){const r=_lp39();if(LUOC.xu&&LUOC.g===G){r.parts.luoc=LUOC.xu;r.parts.misc-=LUOC.xu;}return r;};
let _gk39=null;
setInterval(()=>{try{if(!G||!G.over||_gk39===G)return;if(!document.querySelector('.rewbox,#resBox')&&!_resShown)return;_gk39=G;
 const {parts}=ledgerParts();const n=G.online?(G.seats||[]).length:(TBL||4);const place=(G.finished||[]).indexOf(G.online&&typeof myOnlineSeat==='function'?myOnlineSeat():0);
 if((parts.thui||0)>0)bst('thuiGive');if((parts.thui||0)<0)bst('thuiGot');if((parts.chay||0)>0)bst('chayCause');if((parts.chay||0)<0)bst('chayGot');if((parts.b3||0)>0)bst('b3win');
 if((parts.thui||0)>=3*((typeof curBet==='function'?curBet():PR.bet)||100)*0.5*1.5)bst('bigThui');
 if(G.online){bst('onlGames');if(place===0)bst('onlWins');}else if(n>=2&&n<=4)bst('play'+n);
 if(place===0&&!_passed39)bst('perfect');const h=new Date().getHours();if(h<4)bst('night');
 if(place===0&&LEDG.xu0!=null&&LEDG.xu0<=((typeof curBet==='function'?curBet():PR.bet)||100))bst('allin');
 if(place===0&&G.cb)bst('comebacks');
 PR.stats.comebacks=Math.max(PR.stats.comebacks||0,0);evBadge();}catch(e){}},700);
// Luộc: sau khi ván kết thúc offline, máy không đủ cược nữa và mình đã ăn xu của nó
const _eg39=endGame;endGame=function(i){const r=_eg39.apply(this,arguments);setTimeout(()=>{try{if(!G||G.online||G._luoc)return;G._luoc=1;const bet=curBet();let tot=0,names=[];
 (SEATMAP[TBL||4]||[0,1,2,3]).forEach(p=>{if(!p)return;const now=seatXu(p),was=LEDG.s0[p];if(now<bet&&was!=null&&was>now&&PR.xu>(LEDG.xu0||0)){const lv=Math.max(0,Math.min(3,+BOTAI[p]||0));const xp=LUOC_XP[lv],xu=Math.round(bet*0.5*(lv+1));
  const up=addXp(PR,xp,PR._mode);PR.xu+=xu;tot+=xu;names.push(NAMES[p]);bst('luoc');if(lv===3)bst('luoc3');LUOC.tbl++;PR.stats.luocTable=Math.max(PR.stats.luocTable||0,LUOC.tbl);questEvent(PR,'luoc');
  setTimeout(()=>{try{sfx('chop');winFX('🍲 LUỘC SẠCH '+NAMES[p].trim().toUpperCase()+'! +'+xp+' XP');toast(`Luộc ${NAMES[p].trim()}: +${fmt(xu)} xu, +${xp} XP`);}catch(e){}},400+names.length*1200);}});
 if(tot){LUOC.xu=tot;LUOC.g=G;saveP();evBadge();}}catch(e){}},350);return r;};
const _nb39=newBotsNext;newBotsNext=function(){LUOC.tbl=0;return _nb39();};
avStats();setTimeout(()=>{try{avStats();evBadge();}catch(e){}},2000);
// ---- Bảng huy hiệu: lọc theo nhóm + tiến độ
const BCAT=[['all','Tất cả'],['play','Ván & thắng',['games','wins','streak','table','skill','misc']],['fight','Chặt & thúi',['chop','bomb','thui','chay','b3','combo','luoc']],['rich','Xu & cửa hàng',['earn','rich','shop','collect','spin']],['social','Online & bạn bè',['online','social','throw']],['quest','Nhiệm vụ',['quest','login','ai']],['secret','Bí mật']];
let bCat='all';
openBadges=function(c){if(c)bCat=c;const cat=BCAT.find(x=>x[0]===bCat)||BCAT[0];const list=BADGES.filter(b=>bCat==='all'||(bCat==='secret'?b.secret:!b.secret&&cat[2]&&cat[2].includes(b.series)));
 const n=Object.keys(PR.badges).filter(k=>BADGES.find(b=>b.id===k)).length;
 modal(`<h3>${I('medal')} Huy hiệu (${n}/${BADGES.length})</h3><div class="lbtabs bcats">${BCAT.map(([k,t])=>`<button class="${k===bCat?'on':'alt'}" onclick="openBadges('${k}')">${t}</button>`).join('')}</div><div class="grid">`+list.map(b=>{const u=!!PR.badges[b.id],T=BADGE_TIER[b.tier||1];
  if(b.secret&&!u)return `<div class="badge lock secret"><div class="ic">❓</div><b>???</b><br><small>Huy hiệu bí mật</small></div>`;
  const pr=!u&&b.k&&b.goal?Math.min(1,(PR.stats[b.k]||0)/b.goal):null;
  return `<div class="badge ${u?'':'lock'}" style="--tc:${T.col}"><div class="ic">${u?b.icon:I('lock')}</div><span class="tier">${b.secret?'Bí mật':b.legend?'Huyền thoại':T.name}</span><b>${b.name}</b><br>${b.desc}<br>${I('coin')}${fmt(b.xu)}${pr!=null?`<div class="bprog"><i style="width:${Math.round(pr*100)}%"></i></div><small>${fmt(Math.min(PR.stats[b.k]||0,b.goal))}/${fmt(b.goal)}</small>`:''}</div>`;}).join('')+'</div>');};
// ======== v42: Xin vào chơi (người đang chơi với máy) ========
const JR={out:{},sent:[],pend:null,acc:null};
function jrSend(uid){if(!LOBBY||!USER)return toast('Cần đăng nhập');const now=Date.now();JR.sent=JR.sent.filter(t=>now-t<60000);
 if(JR.out[uid]&&now-JR.out[uid]<30000)return toast('Đã gửi rồi, chờ trả lời nhé');if(JR.sent.length>=4)return toast('Gửi quá nhiều yêu cầu, thử lại sau');JR.out[uid]=now;JR.sent.push(now);
 const me=lobbyMe();LOBBY.ch.send({type:'broadcast',event:'jreq',payload:{to:uid,from:USER.id,name:me.name||myName(),lv:me.lv||levelInfo(PR.xp).level,av:me.av,bg:me.bg,frame:me.frame,xu:PR.xu,title:me.title,tier:me.tier}});
 closeModal();toast('Đã gửi yêu cầu vào chơi…');setTimeout(()=>{if(JR.out[uid]===now){delete JR.out[uid];toast('Không có phản hồi');}},40000);}
function jrReply(to,ok,extra){try{LOBBY.ch.send({type:'broadcast',event:'jres',payload:Object.assign({to,from:USER.id,name:myName(),ok},extra||{})});}catch(e){}}
function onJreq(m){const p=m&&m.payload;if(!p||p.to!==USER.id||!p.from)return;if(BLOCK.has(p.from))return jrReply(p.from,false,{why:'blocked'});
 const offline=!ONL.active;if(!offline||JR.pend||JR.acc)return jrReply(p.from,false,{why:'busy'});
 JR.pend=p;sfx('turn');let c=$('jrCard');if(c)c.remove();c=document.createElement('div');c.id='jrCard';
 c.innerHTML=`<div class="jrh">🎴 Xin vào chơi</div><div class="jrp"><span class="av fr-${esc(p.frame||'fr_gold')}" style="--avc:${esc(p.bg||'#456')}">${esc(p.av||'🙂')}</span><div><b>${esc(p.name)}</b><br><small><span class="lvb">${+p.lv||1}</span> <span class="tt t${+p.tier||1}">${esc(p.title||'')}</span></small><br><small>🪙 ${fmt(+p.xu||0)}</small></div></div>
 <p class="small">muốn vào bàn của bạn. Bàn sẽ chuyển thành phòng online (bạn làm chủ) sau ván này.</p><div class="row"><button onclick="jrAnswer(true)">Đồng ý</button><button class="alt" onclick="jrAnswer(false)">Từ chối <span id="jrT">30</span>s</button></div>`;
 document.body.appendChild(c);try{svaScan(c);}catch(e){}let t=30;JR.tm=setInterval(()=>{t--;const e=$('jrT');if(e)e.textContent=t;if(t<=0)jrAnswer(false);},1000);}
function jrAnswer(ok){clearInterval(JR.tm);const p=JR.pend;JR.pend=null;const c=$('jrCard');if(c)c.remove();if(!p)return;
 if(!ok){jrReply(p.from,false);return;}const playing=G&&!G.over&&!document.body.classList.contains('athome');JR.acc=p;jrReply(p.from,true,{wait:playing});
 toast(playing?`Sẽ mở phòng cho ${p.name} sau ván này`:'Đang mở phòng…');if(!playing)jrConvert();}
async function jrConvert(){const p=JR.acc;if(!p)return;JR.acc='busy';try{const n=TBL||4,bet=Math.min(PR.bet||100,5000);
 const bots=[1,2,3].filter(q=>(SEATMAP[n]||[0,1,2,3]).includes(q)).map(q=>({name:NAMES[q],av:AVATARS[q]&&AVATARS[q][0]||'🤖',lv:BOTLV[q]||5}));
 PR.bet=BETS2.includes(bet)?bet:5000;closeModal();await enterRoom(roomCode(),true,true);
 if(ONL.host){ONL.host.opt.botInfo=bots.slice(0,n-2);ONL.host.opt.bet=PR.bet;try{ONL.host.setSize(n);for(let i=n-1,k=0;k<n-2&&i>0;i--,k++)ONL.host.setBot(i,true);}catch(e){}ONL.host.push();}
 jrReply(p.from,true,{code:ONL.code});toast(`Đã mở phòng ${ONL.code} · chờ ${p.name} vào`);}catch(e){toast('Không mở được phòng');}JR.acc=null;}
function onJres(m){const p=m&&m.payload;if(!p||p.to!==USER.id)return;delete JR.out[p.from];
 if(!p.ok)return toast(p.why==='busy'?`${p.name} đang bận`:`${p.name} đã từ chối`);
 if(p.code){toast(`${p.name} đồng ý! Đang vào phòng ${p.code}`);setTimeout(()=>joinRoom(p.code),1200);}else toast(`${p.name} đồng ý — vào bàn sau ván này`);}
setInterval(()=>{try{if(LOBBY&&LOBBY.ch&&!LOBBY.ch._jr42){LOBBY.ch._jr42=1;LOBBY.ch.on('broadcast',{event:'jreq'},onJreq);LOBBY.ch.on('broadcast',{event:'jres'},onJres);}
 if(JR.acc&&JR.acc!=='busy'&&(!G||G.over||document.body.classList.contains('athome'))&&!(typeof FIN!=='undefined'&&FIN.active))jrConvert();}catch(e){}},700);
const _pt42=plTap;plTap=function(uid){_pt42(uid);try{const p=lobbyPres().find(x=>x.uid===uid);const m=$('modalIn');if(!p||!m||!p.bot||p.room||ONL.active)return;const b=document.createElement('button');b.textContent='🎴 Xin vào chơi';b.onclick=()=>jrSend(uid);const h=m.querySelector('p');h&&h.after(b);}catch(e){}};
// ======== Người online (ô ở màn hình chính) ========
let pplTab='on';
async function openPeople(t){if(t)pplTab=t;if(!CLOUD_ON||!USER){try{await loadSB();const {data}=await SB.auth.getSession();USER=data.session&&data.session.user||null;}catch(e){}}if(needLogin())return;
 try{await ensurePlayer();joinLobby();}catch(e){}
 modal(`<h3>${I('friends')} Người online</h3><div class="lbtabs bcats"><button class="${pplTab==='on'?'on':'alt'}" onclick="openPeople('on')">Đang online <span class="cntb" id="plCnt">${lobbyPres().length}</span></button><button class="${pplTab==='fr'?'on':'alt'}" onclick="openPeople('fr')">Bạn bè</button><button class="alt" onclick="openChatSheet('dm')">💬 Tin nhắn${dmUnread()?` <span class="cntb">${dmUnread()}</span>`:''}</button></div>
 ${pplTab==='on'?'<div id="plList" class="pllist">Đang tải…</div>':`<p class="small">Mã của bạn: <b style="letter-spacing:2px">${typeof MYCODE!=='undefined'&&MYCODE||'…'}</b></p><div class="dmr"><input class="inp" id="frCode" maxlength="6" placeholder="Nhập mã bạn bè"><button onclick="addFriend()">Kết bạn</button></div><div id="frList" class="small">Đang tải…</div>`}`);
 setTimeout(()=>{try{pplTab==='on'?renderPlayers():renderFriends();}catch(e){}},300);}
setInterval(()=>{try{if($('plList')&&!ONL.active&&document.querySelector('#modalIn h3')&&/Người online/.test(document.querySelector('#modalIn h3').textContent))renderPlayers();const c=$('pplHome');if(c){const n=lobbyPres().length;c.textContent=n;c.style.display=n?'':'none';}}catch(e){}},3000);
const _rh42=renderHome;renderHome=function(){_rh42.apply(this,arguments);try{const t=document.querySelector('#home .tiles');if(t&&!$('pplTile')){t.insertAdjacentHTML('afterbegin',`<button class="alt tile" id="pplTile" onclick="openPeople()">${I('friends')}<span>Người online</span><span class="cntb pplc" id="pplHome" style="display:none">0</span></button>`);}}catch(e){}};
// ======== v42: khung chat mới (bottom sheet: Bàn / Tin nhắn riêng) ========
const CS={tab:'tbl',peer:null,unread:0,open:false};const QCHIPS=['Nhanh lên!','Hay quá!','GG','Ván nữa không?','Hên thôi 😅','Chờ chút nhé'];const QEMO=['😂','😎','😡','😭','👍','🔥','🐷','🙏','❤️','😱'];
function tFmt(at){const d=new Date(at||Date.now());return d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');}
function avOfUid(uid){try{if(uid===USER.id){const a=AVATARS[0]||['🙂','#456'];return{av:a[0],bg:a[1]};}
 const st=ONL.st;if(st){const s=st.seats.find(x=>x&&x.uid===uid);if(s)return{av:s.av||'🙂',bg:s.bg||'#456'};}const p=lobbyPres().find(x=>x.uid===uid);if(p)return{av:p.av||'🙂',bg:p.bg||'#456'};}catch(e){}return{av:'🙂',bg:'#456'};}
function bub(m,mine,name){const a=avOfUid(mine?USER.id:m.uid);return `<div class="cb ${mine?'me':''}">${mine?'':`<span class="av cav" style="--avc:${esc(a.bg)}">${esc(a.av)}</span>`}<div class="cbx"><small class="cbn">${mine?'':esc(name||m.name||'?')+' · '}${tFmt(m.at)}</small><div class="cbt">${esc(m.t)}</div></div></div>`;}
function csBody(){if(CS.tab==='tbl'){if(!ONL.active)return '<p class="small cemp">Chat bàn chỉ có khi chơi online.</p>';return (ONL.chat||[]).map(m=>bub(m,m.uid===USER.id,m.name)).join('')||'<p class="small cemp">Chưa có tin nhắn</p>';}
 if(!CS.peer){const ks=Object.keys(DMS).filter(k=>!BLOCK.has(k)).sort((a,b)=>(DMS[b].at||0)-(DMS[a].at||0));return ks.map(k=>`<button class="alt plrow" onclick="CS.peer='${esc(k)}';DMU['${esc(k)}']=0;saveDM();csRender()"><span class="pli"><b>${esc(DMS[k].name)}</b><small>${esc((DMS[k].list.slice(-1)[0]||{}).t||'')}</small></span>${DMU[k]?`<span class="cntb">${DMU[k]}</span>`:''}</button>`).join('')||'<p class="small cemp">Chưa có tin nhắn riêng. Mở Người online → chọn người → Nhắn tin.</p>';}
 const c=DMS[CS.peer]||{list:[],name:'?'};return c.list.map(m=>bub(Object.assign({uid:CS.peer},m),!!m.me,c.name)).join('')||'<p class="small cemp">Bắt đầu trò chuyện</p>';}
function csRender(){const s=$('chatSheet');if(!s)return;if(CS.tab==='dm'&&CS.peer){const x=$('dmPop');if(x)x.remove();if(DMU[CS.peer]){DMU[CS.peer]=0;saveDM();}}const tu=CS.unread,du=dmUnread();const lim=CS.tab==='tbl'?120:200;const canSend=CS.tab==='tbl'?ONL.active:!!CS.peer;
 s.innerHTML=`<div class="csh" ontouchstart="csTs(event)" ontouchmove="csTm(event)" ontouchend="csTe()"><i class="grab"></i><div class="cstabs"><button class="${CS.tab==='tbl'?'on':''}" onclick="CS.tab='tbl';CS.unread=0;csRender()">Bàn${tu?`<b>${tu}</b>`:''}</button><button class="${CS.tab==='dm'?'on':''}" onclick="CS.tab='dm';csRender()">Tin nhắn riêng${du?`<b>${du}</b>`:''}</button></div>
 ${CS.tab==='dm'&&CS.peer?`<div class="cspeer"><a onclick="CS.peer=null;csRender()">‹</a> <b>${esc((DMS[CS.peer]||{}).name||'')}</b><a class="csblk" onclick="if(confirm('Chặn người này?')){BLOCK.add(CS.peer);CS.peer=null;saveDM();csRender()}">Chặn</a></div>`:''}<button class="csx" onclick="closeChatSheet()">✕</button></div>
 <div class="csl" id="csLog">${csBody()}</div>
 ${canSend?`<div class="cschips">${QCHIPS.map(q=>`<button onclick="csSend('${q}')">${q}</button>`).join('')}</div><div class="csemo">${QEMO.map(e=>`<button onclick="csIns('${e}')">${e}</button>`).join('')}</div>
 <div class="csin"><input id="csIn" class="inp" maxlength="${lim}" placeholder="Nhắn tin…" oninput="$('csCnt').textContent=this.value.length+'/${lim}'" onkeydown="if(event.key==='Enter'){event.preventDefault();csSend()}"><small id="csCnt">0/${lim}</small><button onclick="csSend()">Gửi</button></div>`:''}`;
 const l=$('csLog');if(l)l.scrollTop=1e6;try{svaScan(s);}catch(e){}csPos();}
function csIns(e){const i=$('csIn');if(!i)return;i.value=(i.value+e).slice(0,+i.maxLength);i.dispatchEvent(new Event('input'));i.focus();}
function csSend(q){const i=$('csIn');const t=(q||(i&&i.value)||'').trim();if(!t)return;
 if(CS.tab==='tbl'){if(!ONL.active)return;const m={uid:USER.id,name:ONL.me.name,t:cleanMsg(t).slice(0,120),at:Date.now()};ONL.tr.send('chat',m);addChat(m);}else if(CS.peer){if(!sendDM(CS.peer,t))return;}
 if(i&&!q)i.value='';csRender();setTimeout(()=>{const j=$('csIn');if(j&&!q)j.focus();},30);}
function csPos(){const s=$('chatSheet');if(!s)return;const vv=window.visualViewport;const kb=vv?Math.max(0,innerHeight-vv.height-vv.offsetTop):0;
 let bottom=kb;if(kb<60&&!document.body.classList.contains('athome')){const c=$('ctrl');if(c){const r=c.getBoundingClientRect();if(r.height)bottom=Math.max(0,innerHeight-r.top+4);}}
 s.style.bottom=bottom+'px';s.style.maxHeight=Math.max(220,Math.min(innerHeight*0.55,(vv?vv.height:innerHeight)-bottom+kb-70))+'px';}
if(window.visualViewport){visualViewport.addEventListener('resize',csPos);visualViewport.addEventListener('scroll',csPos);}addEventListener('resize',csPos);
function openChatSheet(tab,peer){closeModal();if(tab)CS.tab=tab;if(peer!==undefined)CS.peer=peer;if(CS.tab==='tbl')CS.unread=0;if(CS.peer){DMU[CS.peer]=0;saveDM();}
 let s=$('chatSheet');if(!s){s=document.createElement('div');s.id='chatSheet';document.body.appendChild(s);const bk=document.createElement('div');bk.id='csBack';bk.onclick=closeChatSheet;document.body.appendChild(bk);}
 CS.open=true;document.body.classList.add('csopen');csRender();const p=$('dmPop');if(p)p.remove();}
function closeChatSheet(){CS.open=false;document.body.classList.remove('csopen');const s=$('chatSheet');if(s)s.remove();const b=$('csBack');if(b)b.remove();}
let _csY=null,_csD=0;function csTs(e){_csY=e.touches[0].clientY;_csD=0;}function csTm(e){if(_csY==null)return;_csD=e.touches[0].clientY-_csY;const s=$('chatSheet');if(s&&_csD>0)s.style.transform=`translateX(-50%) translateY(${_csD}px)`;}function csTe(){const s=$('chatSheet');if(_csD>70)closeChatSheet();else if(s)s.style.transform='';_csY=null;}
// nối vào hệ thống cũ
toggleChat=function(){CS.open?closeChatSheet():openChatSheet('tbl');};
openDM=function(peer){openChatSheet('dm',peer||null);};
const _ac42=addChat;addChat=function(m){_ac42(m);if(!(CS.open&&CS.tab==='tbl')&&m&&m.uid!==USER.id)CS.unread++;if(CS.open)csRender();chatBadge();};
const _od42=onDM;onDM=function(m){_od42(m);if(CS.open&&CS.tab==='dm'){const p=m&&m.payload;if(p&&p.from===CS.peer){DMU[p.from]=0;saveDM();const x=$('dmPop');if(x)x.remove();}csRender();}chatBadge();};
const _dp42=dmPopup;dmPopup=function(peer){if(CS.open&&CS.tab==='dm'&&CS.peer===peer)return;_dp42(peer);const d=$('dmPop');if(d){const t=d.querySelector('.dmt');if(t){t.style.cursor='pointer';t.onclick=()=>openChatSheet('dm',peer);}}};
function chatBadge(){const n=(CS.unread||0)+dmUnread();['bChat','bEmoChat'].forEach(id=>{const b=$(id);if(b){b.dataset.n=n||'';b.classList.toggle('hasn',!!n);}});document.querySelectorAll('.emochat').forEach(b=>{b.dataset.n=n||'';b.classList.toggle('hasn',!!n);});}
setInterval(chatBadge,2000);
// ======== v43: hưởng sái + làm rõ bài cuối của người đã về ========
const _nt43=nextTurn;nextTurn=function(){const r=_nt43.apply(this,arguments);try{if(G&&!G.online&&!G.over&&G.hist&&G.hist[0]&&G.hist[0].sai&&G.hist[0]._shown!==1){G.hist[0]._shown=1;finCaption(`${G.turn===0?'Bạn':NAMES[G.turn]} hưởng sái`,1700,false);sfx('flip');}}catch(e){}return r;};
let _sai43=null;const _os43=onlineState;onlineState=function(st,fh){_os43(st,fh);try{if(st&&!st.over&&st.hist&&st.hist[0]&&st.hist[0].sai){const k=(st.dealId||'')+':'+st.rev+':'+st.turn+':'+st.hist.length;const id=(st.dealId||'')+'|'+(st.prev||[]).join(',');if(_sai43!==id){_sai43=id;const me=st.seats.findIndex(s=>s&&s.uid===USER.id);const nm=st.turn===me?'Bạn':((st.seats[st.turn]||{}).name||'');finCaption(nm+' hưởng sái',1700,false);}}}catch(e){}};
const _r43=render;render=function(){const r=_r43.apply(this,arguments);try{const pl=$('pile');if(pl&&G){const by=G.curBy;const fin=by!=null&&G.hands[by]&&G.hands[by].length===0&&!G.over;pl.classList.toggle('lastfin',!!fin);
 if(fin){const nm=by===0?'Bạn':NAMES[by];pl.dataset.lab='Bài cuối của '+nm+' · '+(['nhất','nhì','ba'][(G.finished||[]).indexOf(by)]?'về '+['nhất','nhì','ba'][(G.finished||[]).indexOf(by)]:'');}else delete pl.dataset.lab;
 // nhãn thứ hạng trên ghế người đã về
 (G.finished||[]).forEach((p,i)=>{const el=p===0?$('meAvM')||document.querySelector('#meInfo'):$('s'+p);if(!el)return;let t=el.querySelector('.fintag');if(!t){t=document.createElement('span');t.className='fintag';el.appendChild(t);}t.textContent=['Nhất','Nhì','Ba','Bét'][i];});
 [0,1,2,3].forEach(p=>{if((G.finished||[]).includes(p))return;const el=p===0?$('meAvM')||document.querySelector('#meInfo'):$('s'+p);const t=el&&el.querySelector('.fintag');if(t)t.remove();});}}catch(e){}return r;};

// ======== v44: chế độ chơi (Miền Nam / Đếm lá) ========
let MODE=localStorage.getItem('tlmn_mode')||'mn';const MODES=[['mn','Miền Nam','🂡'],['demla','Đếm lá','🔢']];
function setMode(m){MODE=m;try{localStorage.setItem('tlmn_mode',m);}catch(e){}renderHome();}
function modeOf(){return (typeof ONL!=='undefined'&&ONL.active)?'mn':MODE;}
function modeCtx(place,instant){if(!G||G.online||G.mode!=='demla')return{};const f=G.finished,seats=G.seats||[0,1,2,3],all=[...f,...seats.filter(p=>!f.includes(p))];
 G.dl=demlaSettle(G.hands,all,curBet());if(all[0]===0){bst('demlaWin');questEvent(PR,'demlawin');}const d=G.dl[0]||0;
 try{const w=all[0]===0,opp=seats.filter(p=>p!==0),lens=opp.map(p=>G.hands[p].length),below=all.slice(all.indexOf(0)+1).filter(p=>p);modeRecord(PR,'demla',{win:w,net:d,bet:curBet(),n:seats.length,full:seats.length>=4,role:w&&below.some(p=>BOTAI[p]===3),dealer:true,bust:lens.filter(l=>l>=13).length,sp1:w&&!!instant,sp2:w&&lens.some(l=>l>=10),sp3:w&&lens.every(l=>l>=5),s4:w&&lens.reduce((a,b)=>a+b,0)>=30,s5:w&&!G.usedTwo});}catch(e){console.warn(e)}return{xuDelta:d<0?-Math.min(-d,PR.xu):d,noXuBonus:true};}
const _ng44=newGame;newGame=function(){const r=_ng44.apply(this,arguments);try{if(G&&!G.online){G.mode=modeOf();if(G.mode==='demla')setTimeout(()=>finCaption('🔢 Đếm lá',1400,false),300);}}catch(e){}return r;};
const _ts44=thuiSettle;thuiSettle=function(){if(G&&!G.online&&G.mode==='demla')return[];return _ts44.apply(this,arguments);};
const _lp44=ledgerParts;ledgerParts=function(){const r=_lp44();if(G&&G.mode==='demla'&&r.parts.place!=null){r.parts.demla=r.parts.place;r.parts.place=0;}return r;};
const _rh44=renderHome;renderHome=function(){_rh44.apply(this,arguments);try{const h=$('home');if(!h)return;let m=$('modePick');if(m)m.remove();const btn=[...h.querySelectorAll('button')].find(b=>/CHƠI VỚI MÁY/i.test(b.textContent));if(!btn)return;
 m=document.createElement('div');m.id='modePick';if(MODES.length>=7)m.className='m3';m.innerHTML=MODES.map(([k,n,ic])=>`<button class="${k===MODE?'on':'alt'}" onclick="setMode('${k}')"><span>${ic}</span>${n}</button>`).join('');btn.before(m);}catch(e){}};
const _ot44=openTables;openTables=function(){_ot44.apply(this,arguments);try{const m=$('modalIn');if(!m)return;const h=m.querySelector('h3');if(h&&MODE==='demla'){{const u=curBet()/5,f=x=>kxu(Math.round(u*x));h.insertAdjacentHTML('afterend',`<div class="small mnote dlt">🔢 <b>Đếm lá</b> — người thua trả người nhất theo lá còn lại:<div class="dlv"><span>3–10 <b>${f(1)}</b></span><span>J Q K <b>${f(1.5)}</b></span><span>A <b>${f(2)}</b></span><span>2♠♣ <b>${f(3)}</b></span><span>2♦♥ <b>${f(4)}</b></span><span>Cháy <b>x2</b></span></div></div>`);}
 m.querySelectorAll('.tsel small').forEach(e=>{if(/Xu:/.test(e.textContent))e.textContent='Xu: thua trả theo số lá';});}}catch(e){}};
// Đếm lá: hết bài là kết thúc ván ngay, xếp hạng theo số lá còn lại
const _dp44=doPlay;doPlay=function(p,c,s){const r=_dp44.apply(this,arguments);try{if(G&&!G.online&&G.mode==='demla'&&!G.over&&G.hands[p]&&G.hands[p].length===0){const seats=G.seats||[0,1,2,3];
 const rest=seats.filter(q=>!G.finished.includes(q)).sort((a,b)=>demlaUnits(G.hands[a])-demlaUnits(G.hands[b]));G.finished=[...G.finished,...rest];G.over=true;endGame(false);}}catch(e){console.error('demla',e);}return r;};

// Đếm lá: chi tiết từng người thua trong bảng kết quả
setInterval(()=>{try{if(!G||G.mode!=='demla'||!G.over||!G.dl||$('dlBrk'))return;const m=$('modalIn');if(!m||!/Sổ xu/.test(m.textContent))return;const box=[...m.querySelectorAll('div')].find(d=>/^Sổ xu/.test(d.textContent.trim()));if(!box)return;
 const u=curBet()/5,w=(G.rank||G.finished)[0];const rows=(G.rank||G.finished).slice(1).map(p=>{const h=G.hands[p]||[];const av=(AVATARS[p]||['🙂','#456']);const chips=h.slice().sort((a,b)=>a-b).map(c=>`<i class="${(c&3)>=2?'r':''}">${RANKS[c>>2]}${SUITS[c&3]}</i>`).join('');return `<div class="dlr"><span class="av dlav" style="--avc:${esc(av[1]||'#456')}">${esc(av[0])}</span><div class="dli"><b>${p===0?'Bạn':esc(NAMES[p])}</b><small>${h.length} lá · ${demlaUnits(h)} phần${h.length===13?' · cháy x2':''}</small><div class="dlc">${chips}</div></div><b class="loss dlx">−${fmt(Math.round(u*demlaUnits(h)))}</b></div>`;}).join('');
 box.insertAdjacentHTML('afterend',`<div id="dlBrk"><div class="dlh">🔢 Đếm lá → ${w===0?'Bạn':esc(NAMES[w])}</div>${rows}</div>`);try{svaScan($('dlBrk'));}catch(e){}}catch(e){}},600);
// ======== v45: avatar của mình ở giữa cạnh dưới bàn (cân đối với ghế trên) ========
function placeMeAv(){try{const t=$('table');if(!t)return;const a=document.querySelector('#meInfo #meAvM');if(innerWidth>700){const o=t.querySelector('.meseat');if(o&&a)o.remove();else if(o){o.classList.remove('meseat');const mi=$('meInfo');mi&&mi.prepend(o);}return;}if(!a)return;
 const old=t.querySelector('.meseat');if(old)old.remove();a.classList.add('meseat');t.appendChild(a);
 const lab=a.querySelector('.msn');if(!lab)a.insertAdjacentHTML('beforeend',`<span class="msn">Bạn</span>`);}catch(e){}}
const _r45=render;render=function(){const r=_r45.apply(this,arguments);placeMeAv();return r;};
const _rm45=renderMe;renderMe=function(){const r=_rm45.apply(this,arguments);placeMeAv();return r;};
// ======== v49: chế độ người xem ========
let SPEC=false;
const _mi49=meInfo;meInfo=function(){const m=_mi49();if(SPEC)m.spec=true;return m;};
const _lm49=lobbyMe;lobbyMe=function(){const m=_lm49();if(SPEC&&ONL.active){m.watch=ONL.code;m.table=null;m.room=null;m.seats=0;}return m;};
const _ps49=plStatus;plStatus=function(p){if(p.watch)return '👁 đang xem bàn '+p.watch;return _ps49(p);};
async function spectate(code){if(!validCode(code))return toast('Mã phòng không hợp lệ');if(needLogin())return;closeModal();SPEC=true;await enterRoom(code,false,true);document.body.classList.add('spec');specBar();toast('👁 Bạn đang xem bàn '+code);}
function specSit(){if(!ONL.active||!ONL.client)return;const r=ONL.room||{};if(r.playing)return toast('Chờ hết ván mới ngồi vào được');const used=(r.seats||[]).filter(s=>s&&!s.bot).length;if(used>=(r.size||4))return toast('Bàn đã đủ người');
 SPEC=false;document.body.classList.remove('spec');ONL.me=meInfo();ONL.client.me=ONL.me;ONL.client.hello();try{ONL.ch.track({uid:USER.id,name:ONL.me.name,at:Date.now(),spec:false});}catch(e){}lobbyTrack();specBar();toast('Đã ngồi vào bàn');}
function specBar(){let b=$('specBar');if(!(SPEC&&ONL.active)){if(b)b.remove();return;}if(!b){b=document.createElement('div');b.id='specBar';document.body.appendChild(b);}
 const r=ONL.room||{};const free=!r.playing&&(r.seats||[]).filter(s=>s&&!s.bot).length<(r.size||4);
 b.innerHTML=`<span>👁 Bạn đang xem</span><button class="alt" onclick="openChatSheet('tbl')">💬</button><button ${free?'':'disabled'} onclick="specSit()">${free?'Ngồi vào':'Chờ hết ván'}</button>`;}
function specCount(){const r=ONL.room||{};const n=(r.specs||[]).length;let e=$('specCnt');if(!ONL.active||!n){if(e)e.remove();return;}if(!e){e=document.createElement('div');e.id='specCnt';(document.getElementById('table')||document.body).appendChild(e);}e.textContent='👁 '+n;e.title=(r.specs||[]).map(s=>s.name).join(', ');}
setInterval(()=>{try{specBar();specCount();if(!ONL.active&&SPEC){SPEC=false;document.body.classList.remove('spec');}}catch(e){}},1000);
// người xem không được đánh
['humanPlay','humanPass','autoMove','hint'].forEach(f=>{const o=window[f];if(typeof o!=='function')return;window[f]=function(){if(SPEC&&ONL.active)return;return o.apply(this,arguments);};});
try{const _hp49=humanPlay;humanPlay=window.humanPlay;humanPass=window.humanPass;autoMove=window.autoMove;}catch(e){}
// chat của người xem có nhãn
const _cs49=csSend;csSend=function(q){if(SPEC&&ONL.active&&CS.tab==='tbl'){const i=$('csIn');const t=(q||(i&&i.value)||'').trim();if(!t)return;const m={uid:USER.id,name:'👁 '+ONL.me.name+' (người xem)',t:cleanMsg(t).slice(0,120),at:Date.now(),spec:1};ONL.tr.send('chat',m);addChat(m);if(i&&!q)i.value='';csRender();return;}return _cs49(q);};
const _sc49=sendChat;sendChat=function(){if(SPEC&&ONL.active){const i=$('chatIn');const t=(i&&i.value||'').trim().slice(0,120);if(!t)return;i.value='';const m={uid:USER.id,name:'👁 '+ONL.me.name+' (người xem)',t,at:Date.now(),spec:1};ONL.tr.send('chat',m);addChat(m);return;}return _sc49();};
// lối vào: thẻ người chơi, bàn ở sảnh, link ?room=CODE&xem=1
const _pt49=plTap;plTap=function(uid){_pt49(uid);try{const p=lobbyPres().find(x=>x.uid===uid);const m=$('modalIn');const code=p&&(p.room||p.table||p.watch);if(!m||!code||(ONL.active&&ONL.code===code))return;const b=document.createElement('button');b.className='alt';b.textContent='👁 Xem bàn';b.onclick=()=>spectate(code);const h=m.querySelector('p');h&&h.after(b);}catch(e){}};
const _rl49=renderLobby;renderLobby=function(){_rl49.apply(this,arguments);try{const T=lobbyTables(lobbyPres()).filter(t=>t.tier===LOBBY_TIERS[lobbyTier]);const W=lobbyPres().filter(p=>p.watch);
 [...document.querySelectorAll('#lobbyList .ltab')].forEach((el,i)=>{const t=T[i];if(!t||!t.count)return;const n=W.filter(p=>p.watch===t.code).length;el.querySelector('.lf').insertAdjacentHTML('beforeend',`<span class="lw" onclick="event.stopPropagation();spectate('${t.code}')">👁${n?' '+n:''} Xem</span>`);});}catch(e){}};
(function(){try{const q=new URLSearchParams(location.search);if(q.get('xem')&&q.get('room')){const c=q.get('room').toUpperCase();const _jr=joinRoom;joinRoom=function(code){joinRoom=_jr;if(code===c)return spectate(c);return _jr.apply(this,arguments);};}}catch(e){}})();
// người xem: dựng góc nhìn như ghế 0 nhưng tuyệt đối không đụng tới tiền/XP/thống kê của mình
const _os49=onlineState;onlineState=function(st,fh){if(!(SPEC&&ONL.active&&st&&st.seats))return _os49.apply(this,arguments);
 const v=Object.assign({},st,{seats:st.seats.map((s,i)=>i===0&&s?Object.assign({},s,{uid:USER.id,_real:s.uid}):(s&&s.uid===USER.id?Object.assign({},s,{uid:'x-'+i}):s))});
 const snap=JSON.stringify(PR);let r;try{r=_os49.call(this,v,fh);}finally{if(JSON.stringify(PR)!==snap){const o=JSON.parse(snap);Object.keys(PR).forEach(k=>{if(!(k in o))delete PR[k];});Object.assign(PR,o);try{saveP();}catch(e){}}}
 ONL.st=st;specSeat0();return r;};
function specSeat0(){try{const st=ONL.st;if(!(SPEC&&ONL.active&&st))return;const s0=st.seats[0];const t=$('table');if(!t)return;let e=$('specSeat');if(!e||e.parentNode!==t){if(e)e.remove();e=document.createElement('div');e.id='specSeat';t.appendChild(e);}const h=s0?`<span class="av" style="--avc:${esc(s0.bg||'#456')}">${esc(s0.av||'🙂')}</span><b>${esc(s0.name)}</b><small>${(st.hands[0]||[]).length} lá</small>`:'';if(e._h!==h){e._h=h;e.innerHTML=h;try{svaScan(e);}catch(_){}}e.classList.toggle('turn',st.turn===0&&!st.over);}catch(e){}}
setInterval(specSeat0,700);
const _wl49=window.showOnlineResult;if(typeof _wl49==='function')window.showOnlineResult=function(){if(SPEC&&ONL.active){toast('Ván kết thúc');return;}return _wl49.apply(this,arguments);};
const _mod49=modal;modal=function(h){if(SPEC&&ONL.active&&/Kết quả/.test(h||''))return;return _mod49.apply(this,arguments);};
// ======== v49: danh hiệu mới + khung mới ========
function stInc(k,n){PR.stats=PR.stats||{};PR.stats[k]=(PR.stats[k]||0)+(n||1);}
function titleReq(t){if(t.min)return 'Đạt cấp '+t.min;if(t.stat){const n={thuiGive:'Bắt thúi heo/hàng',giftSent:'Tặng quà',friends:'Có bạn bè'}[t.stat[0]]||t.stat[0];const v=(PR.stats||{})[t.stat[0]]||0;return `${n} ${Math.min(v,t.stat[1])}/${t.stat[1]}`;}const b=BADGES.find(x=>x.id===t.badge)||{};return 'Huy hiệu «'+(b.name||t.badge)+'»'+(b.desc?' — '+b.desc:'');}
openTitles=function(){const L=levelInfo(PR.xp),cur=currentTitle(PR);
 const cats=[['Cấp độ',TITLES.filter(t=>t.min)]];const g={};TITLES.filter(t=>!t.min).forEach(t=>{const c=t.cat||'Thành tích';(g[c]=g[c]||[]).push(t);});Object.keys(g).forEach(c=>cats.push([c,g[c]]));
 const own=TITLES.filter(t=>titleUnlocked(PR,t)).length;
 modal(`<h3>${I('medal')} Cấp ${L.level} · ${titleHTML(cur)}</h3><div class="xpb"><i style="width:${100*L.cur/L.need}%"></i></div><p class="small">${fmt(L.cur)}/${fmt(L.need)} XP đến cấp ${L.level+1} (thưởng ${fmt(levelReward(L.level+1))} xu). Đã mở ${own}/${TITLES.length} danh hiệu.</p>${xpTableHTML()}`+
 cats.map(([c,arr])=>`<div class="tcat">${c} <small class="small">(${arr.filter(t=>titleUnlocked(PR,t)).length}/${arr.length})</small></div>`+arr.map(t=>{const u=titleUnlocked(PR,t);return `<div class="trow ${u?'':'lk'}"><div style="flex:1;min-width:0">${titleHTML(t)}<small>${titleReq(t)}</small></div>${t.id===cur.id?I('check'):u?`<button class="alt" onclick="pickTitle('${t.id}')">Chọn</button>`:I('lock')}</div>`;}).join('')).join(''));};
const _osh49=openShop;openShop=function(tab){_osh49(tab);try{document.querySelectorAll('#modalIn [onclick^="doBuy("]').forEach(b=>{const id=(b.getAttribute('onclick').match(/doBuy\('([^']+)'/)||[])[1];const it=SHOP.find(x=>x.id===id);if(it&&it.lv&&levelInfo(PR.xp).level<it.lv&&!it.badge){const s=document.createElement('span');s.className='lk';s.innerHTML=I('lock')+' Cấp '+it.lv;b.replaceWith(s);return;}if(it&&it.badge&&!(PR.badges&&PR.badges[it.badge])){const bd=BADGES.find(x=>x.id===it.badge)||{};const s=document.createElement('span');s.className='lk';s.innerHTML=I('lock')+' '+esc(bd.name||'Huy hiệu');s.title='Cần huy hiệu: '+(bd.name||'');b.replaceWith(s);}});}catch(e){}};
// ======== v50: trạng thái chế độ chơi + xem bàn người chơi với máy ========
let SHARE=localStorage.getItem('tlmn_share')!=='0';
function offGame(){try{if(ONL.active)return null;if(document.body.classList.contains('cgon')&&CG.g)return{g:CG.g,bet:CG.bet,cai:CG.role==='cai'};if(G&&!document.body.classList.contains('athome'))return{g:G.mode==='demla'?'demla':'mn',bet:typeof curBet==='function'?curBet():PR.bet};}catch(e){}return null;}
function gmLabel(o){if(!o)return '';const n={mn:'Tiến Lên',demla:'Tiến Lên đếm lá','3cao':'3 Cào',xidach:'Xì dách'}[o.g]||'';return n+(o.cai?' (làm cái)':'')+(o.bet?' · '+kxu(o.bet):'');}
const _lm50=lobbyMe;lobbyMe=function(){const m=_lm50();const o=offGame();if(o){m.bot=true;m.gm=o;m.share=SHARE?1:0;}else{m.gm=null;m.share=0;}return m;};
const _ps50=plStatus;plStatus=function(p){if(!p.room&&p.bot&&p.gm)return 'đang chơi '+gmLabel(p.gm);return _ps50(p);};
// --- phía người chơi: phát trạng thái công khai
const OSP={ch:null,last:'',n:0};
function ospSnap(){const o=offGame();if(!o)return{k:'none'};
 if(o.g==='3cao'||o.g==='xidach'){const st=CG.st;const seats=(st?st.seats:CG.seats)||[];const ME=st?st.me:cgMe();
  return{k:'cg',gm:o,msg:st?String(st.msg||'').replace(/^(🎉 )?Bạn/,'$1'+(PR.name||'Người chơi')):'Đang chọn bàn…',phase:st?st.phase:'bet',seats:seats.map((s,i)=>{const h=st?st.hands[i]:[];const r=st&&st.res&&st.res[i];const up=st&&(st.reveal||(r&&r.done)||(st.open&&st.open[i])||(i===ME&&st.phase==='done'));
   return{name:s.me?(PR.name||'Người chơi'):s.name,av:s.me?myAv():s.av,dealer:!!s.dealer,me:!!s.me,cards:up?h.slice():null,cnt:h.length,lab:up&&h.length?cgScoreLab(h,i):'',v:r&&r.done?r.v:null};})};}
 const g=G;const seats=g.seats||[0,1,2,3];const end=g.over||(typeof FIN!=='undefined'&&FIN.active);
 return{k:'tl',gm:o,pile:g.pile||[],turn:g.turn,over:!!g.over,cap:String((g.hist[g.hist.length-1]||{}).txt||'').replace(/<[^>]+>/g,'').replace(/&[a-z]+;/g,' ').replace(/\bBạn\b/g,PR.name||'Người chơi'),seats:seats.map(i=>({name:i===0?(PR.name||'Người chơi'):NAMES[i],av:i===0?myAv():(AVATARS[i]||['🙂'])[0],cnt:(g.hands[i]||[]).length,fin:g.finished.indexOf(i)+1,turn:g.turn===i,cards:end?(g.hands[i]||[]).slice():null}))};}
function ospTick(){try{const on=SHARE&&USER&&LOBBY&&offGame();if(!on){if(OSP.ch){try{SB.removeChannel(OSP.ch);}catch(e){}OSP.ch=null;OSP.n=0;ospBadge();}return;}
 if(!OSP.ch){const ch=chan('tlmn:spec:'+USER.id);OSP.ch=ch;OSP.last='';ch.on('broadcast',{event:'hi'},()=>{OSP.last='';}).on('presence',{event:'sync'},()=>{try{const s=ch.presenceState();OSP.n=Object.values(s).map(a=>a[0]).filter(x=>x&&x.v&&x.uid!==USER.id).length;}catch(e){}ospBadge();}).subscribe();}
 const s=JSON.stringify(ospSnap());if(s!==OSP.last||Date.now()-(OSP.at||0)>5000){OSP.last=s;OSP.at=Date.now();OSP.ch.send({type:'broadcast',event:'pub',payload:JSON.parse(s)});}}catch(e){}}
setInterval(ospTick,700);
function ospBadge(){let e=$('ospCnt');if(!OSP.n||!OSP.ch){if(e)e.remove();return;}if(!e){e=document.createElement('div');e.id='ospCnt';document.body.appendChild(e);}e.textContent='👁 '+OSP.n+' người đang xem';}
// --- phía người xem
const OSV={ch:null,uid:null};
function specOff(uid,name){if(needLogin())return;closeModal();specOffClose();OSV.uid=uid;let o=document.createElement('div');o.id='ospV';o.innerHTML=`<div class="ovt"><button class="alt ic" onclick="specOffClose()">${I('back')}</button><b>👁 Xem bàn ${esc(name||'')}</b></div><div id="ospB"><p class="small" style="text-align:center;margin-top:40px">Đang kết nối…</p></div>`;document.body.appendChild(o);
 const ch=chan('tlmn:spec:'+uid);OSV.ch=ch;ch.on('broadcast',{event:'pub'},m=>specOffRender(m.payload)).subscribe(async s=>{if(s==='SUBSCRIBED'){try{await ch.track({uid:USER.id,v:1});}catch(e){}ch.send({type:'broadcast',event:'hi',payload:{}});}});}
function specOffClose(){if(OSV.ch){try{SB.removeChannel(OSV.ch);}catch(e){}}OSV.ch=null;const o=$('ospV');if(o)o.remove();}
function specOffRender(d){const b=$('ospB');if(!b||!d)return;OSV.d=d;if(d.k==='none'){b.innerHTML='<p class="small" style="text-align:center;margin-top:40px">Người chơi đã rời bàn.</p>';return;}
 const cards=(arr,cnt)=>arr?arr.map(c=>cgCard(c,true,0)).join(''):Array.from({length:Math.min(cnt,13)},()=>'<div class="card back cgc"></div>').join('');
 const seat=s=>`<div class="osS ${s.turn?'turn':''}"><div class="cgp"><span class="av" style="--avc:#3a5">${esc(s.av||'🙂')}</span><b>${esc(s.name)}${s.dealer?' <i class="cgdl">CÁI</i>':''}</b>${s.fin?`<small>về ${['nhất','nhì','ba','bét'][s.fin-1]}</small>`:`<small>${s.cnt} lá</small>`}</div><div class="osH ${s.cards?'':'bk'}">${cards(s.cards,s.cnt)}</div>${s.lab?`<div class="cgsc">${esc(s.lab)}</div>`:''}${s.v!=null?`<div class="osV ${s.v>0?'pos':s.v<0?'neg':''}">${s.v>0?'+':''}${fmt(s.v)}</div>`:''}</div>`;
 b.innerHTML=`<div class="osM">${esc(gmLabel(d.gm))}</div>${d.k==='tl'?`<div class="osP">${(d.pile||[]).map(c=>cgCard(c,true,0)).join('')||'<span class="small">Bàn trống</span>'}</div><div class="osC">${esc(d.cap||'')}</div>`:`<div class="osC">${esc(d.msg||'')}</div>`}<div class="osG">${d.seats.map(seat).join('')}</div>`;try{svaScan(b);}catch(e){}}
const _pt50=plTap;plTap=function(uid){_pt50(uid);try{const p=lobbyPres().find(x=>x.uid===uid);const m=$('modalIn');if(!m||!p||!p.bot||p.room||!p.share||m.querySelector('.ospx'))return;const bt=document.createElement('button');bt.className='alt ospx';bt.textContent='👁 Xem bàn ('+gmLabel(p.gm)+')';bt.onclick=()=>specOff(uid,p.name);const h=m.querySelector('p');h?h.after(bt):m.appendChild(bt);}catch(e){}};
const _os50=openSettings;openSettings=function(){_os50.apply(this,arguments);try{const m=$('modalIn');const d=document.createElement('div');d.className='row';d.innerHTML=`<span style="flex:1">Cho người khác xem bàn của tôi</span><button class="${SHARE?'':'alt'}" onclick="SHARE=!SHARE;localStorage.setItem('tlmn_share',SHARE?'1':'0');lobbyTrack();openSettings()">${SHARE?'Bật':'Tắt'}</button>`;const r=[...m.querySelectorAll('.row')].pop();r?r.after(d):m.appendChild(d);}catch(e){}};

function xpTableHTML(){const r=(a,b)=>`<tr><td>${a}</td><td>${b}</td></tr>`,j=a=>a.join(' / ');
 return `<details class="xptbl"><summary>XP mỗi ván theo chế độ</summary><p class="small">XP tỉ lệ thời gian ván (~41 XP/phút). Thắng / Hòa / Thua hoặc theo thứ hạng.</p><table>`+
 [2,3,4].map(n=>r('Miền Nam '+n+' người',j(XP_PLACE_N[n]))).join('')+[2,3,4].map(n=>r('Đếm lá '+n+' người',j(XP_DEMLA_N[n]))).join('')+
 [['3cao','3 Cào'],['xidach','Xì dách'],['baucua','Bầu cua'],['domino','Domino'],['xito','Xì tố'],['poker','Poker']].map(([k,l])=>r(l,j(XP_MODE[k]))).join('')+
 `</table><p class="small">Thưởng thêm: chặt heo +${XP_CHOP}, tới trắng +${XP_INSTANT} (theo tỉ lệ bàn), luộc máy, nhiệm vụ +${XP_QUEST}, thắng Cao thủ bàn 10k. Cuối cùng nhân % EXP từ Mua sắm.</p></details>`;}
// v1.52.2: bài to kiểu quạt 1 hàng (mobile) + bài trên bàn to hơn
function bigCards(){try{const W=innerWidth,H=innerHeight;if(W>700)return;const hd=$('hand');if(!hd)return;const cs=[...hd.querySelectorAll('.card')];const n=cs.length;
 hd.classList.remove('two');hd.classList.add('fan');hd.querySelectorAll('.brk').forEach(b=>b.remove());cs.forEach(c=>c.classList.remove('r2'));
 const av=W-44,cw=Math.max(52,Math.min(W*0.22,H*0.118,104)),ch=cw*1.43;const ng=cs.filter(c=>c.classList.contains('gap')).length,gp=ng&&n>1?Math.min(8,Math.max(0,(av-cw-(n-1)*cw*0.3)/ng)):0;
 const st=n>1?Math.min(cw*0.62,(av-cw-ng*gp)/(n-1)):0;const mid=(n-1)/2,rot=Math.min(1.5,18/Math.max(n,1));
 hd.style.setProperty('--cw',cw.toFixed(1)+'px');hd.style.setProperty('--ch',ch.toFixed(1)+'px');hd.style.setProperty('--ov',(st-cw).toFixed(1)+'px');hd.style.setProperty('--gp',gp.toFixed(1)+'px');
 cs.forEach((c,i)=>{const d=i-mid;c.style.setProperty('--ar',(d*rot).toFixed(2)+'deg');c.style.setProperty('--ay',(d*d*0.22).toFixed(1)+'px');});
 hd.style.height=(ch+mid*mid*0.22+30).toFixed(0)+'px';
 const pl=$('pile');if(pl){const pc=[...pl.querySelectorAll('.card')],m=pc.length,pw=Math.max(48,Math.min(W*0.215,H*0.118,98));const ps=m>1?Math.min(pw*0.5,(W-40-pw)/(m-1)):0;
  const pwr=$('pileWrap')||document.documentElement;pwr.style.setProperty('--pw',pw.toFixed(1)+'px');pwr.style.setProperty('--ph',(pw*1.43).toFixed(1)+'px');pc.forEach((c,i)=>{c.style.marginLeft=i?(ps-pw).toFixed(1)+'px':'0';});}}catch(e){console.warn(e)}}
const _r522=render;render=function(){const r=_r522.apply(this,arguments);bigCards();return r;};
addEventListener('resize',()=>{try{if(G)bigCards();}catch(e){}});
const _fp522=fitPile;fitPile=function(){if(innerWidth>700)return _fp522.apply(this,arguments);bigCards();};
const _cgr522=cgRender;cgRender=function(){const r=_cgr522.apply(this,arguments);try{const o=$('cg');if(o)o.dataset.g=CG.g;}catch(e){}return r;};
