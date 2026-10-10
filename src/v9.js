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
