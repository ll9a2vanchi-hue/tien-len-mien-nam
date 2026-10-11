// ===== v52+: chế độ mới (Bầu cua, Domino, Xì tố, Poker) — khung chung =====
const MG={g:null,bxu:{},bet:200};
const MG_TITLE={baucua:'🦀 Bầu cua',domino:'🁫 Domino',xito:'🂡 Xì tố',poker:'♠️ Poker'};
function mgBot(used){const pool=[...CG_NAMES.keys()].filter(k=>!(used||[]).includes(CG_NAMES[k]));const k=pool[Math.floor(Math.random()*pool.length)]??0;const b={name:CG_NAMES[k],av:CG_AV[k]};if(MG.bxu[b.name]==null)MG.bxu[b.name]=Math.round(MG.bet*(20+Math.random()*40)/100)*100;return b;}
function mgBots(n){const out=[];for(let i=0;i<n;i++)out.push(mgBot(out.map(b=>b.name)));return out;}
function mgRefill(bots,need){const msg=[];bots.forEach((b,i)=>{if((MG.bxu[b.name]||0)<need){const nb=mgBot(bots.map(x=>x.name));msg.push(`${b.name} hết xu, rời bàn · ${nb.name} vào bàn`);delete MG.bxu[b.name];MG.bxu[nb.name]=Math.max(MG.bxu[nb.name],need*20);bots[i]=nb;}});if(msg.length)toast(msg.join(' — '));}
function mgOpen(g){closeModal();MG.g=g;MG.st=null;let o=$('mg');if(!o){o=document.createElement('div');o.id='mg';document.body.appendChild(o);}o.className='mg-'+g;document.body.classList.add('cgon','mgon');sfx('cgChip');MG_MODE[g].open();}
function mgClose(force){const st=MG.st;if(!force&&st&&st.busy){if(!confirm('Đang chơi dở, rời bàn sẽ mất tiền cược. Rời?'))return;if(MG_MODE[MG.g].quit)MG_MODE[MG.g].quit();}const o=$('mg');if(o)o.remove();document.body.classList.remove('cgon','mgon');MG.st=null;MG.g=null;showHome();}
function mgTop(){return `<div class="cgtop"><button class="alt ic" onclick="mgClose()">${I('back')}</button><b>${MG_TITLE[MG.g]}</b><span class="cgxu">${I('coin')} <span id="cgXu">${fmt(PR.xu)}</span></span></div>`;}
function mgSeat(b,extra){return `<div class="mgseat"><span class="av" style="--avc:#3a5">${b.av}</span><b>${esc(b.name)}</b><small class="cgbx">${I('coin')}${kxu(b.me?PR.xu:(MG.bxu[b.name]||0))}</small>${extra||''}</div>`;}
function mgBets(list,cur,on,maxOk){return `<div class="cgbets">${list.map(b=>`<button class="${b===cur?'':'alt'}" ${maxOk&&!maxOk(b)?'disabled':''} onclick="${on}(${b})">${kxu(b)}</button>`).join('')}</div>`;}
// kết thúc ván: cập nhật xu/XP/thống kê/nhiệm vụ
const MG_STAT={baucua:'bcua',domino:'dom',xito:'xt',poker:'pk'};
function mgEnd(net,o){o=o||{};const k=MG_STAT[MG.g];PR.xu=Math.max(0,PR.xu+net);bst(k+'Games');const won=net>0;if(won){bst(k+'Win');questEvent(PR,k+'win');}questEvent(PR,'cgplay');(o.stats||[]).forEach(s=>bst(s));
 const xp=o.xp!=null?o.xp:(won?30:net===0?15:10);const up=addXp(PR,xp);sfx(won?'cgJingle':net<0?'cgLose':'cgChip');
 try{const r=$('cgXu').getBoundingClientRect();floatText(r.left,r.bottom+10,(net>=0?'+':'')+fmt(net)+' xu',net>=0?'gain':'loss');}catch(e){}
 try{levelUpFX(up);}catch(e){}badgeToasts(checkBadges(PR));saveP();const x=$('cgXu');if(x)x.textContent=fmt(PR.xu);return xp;}
function mgLedger(rows){return rows&&rows.length?`<div class="cgled">${rows.map(l=>`<div><span>${esc(l[0])}</span><b class="${l[1]>0?'pos':l[1]<0?'neg':''}">${l[1]>0?'+':''}${fmt(l[1])}</b></div>`).join('')}</div>`:'';}
const MG_MODE={};
// ---- tích hợp màn hình chính / xem bàn / trạng thái
MODES.push(['baucua','Bầu cua','🦀']);
const _ot52=openTables;openTables=function(){if(MG_MODE[MODE])return mgOpen(MODE);return _ot52.apply(this,arguments);};
const _og52=offGame;offGame=function(){try{if(MG.g&&document.body.classList.contains('mgon')){const st=MG.st||{};return{g:MG.g,bet:st.bet||MG.bet,cai:st.role==='cai'};}}catch(e){}return _og52();};
const _gl52=gmLabel;gmLabel=function(o){if(o&&MG_TITLE[o.g])return MG_TITLE[o.g].replace(/^\S+ /,'')+(o.cai?' (làm cái)':'')+(o.bet?' · '+kxu(o.bet):'');return _gl52(o);};
const _snap52=ospSnap;ospSnap=function(){try{if(MG.g&&document.body.classList.contains('mgon')){const m=MG_MODE[MG.g];const o=offGame();const p=m.pub?m.pub():{seats:[],msg:''};return Object.assign({k:'cg',gm:o},p);}}catch(e){}return _snap52();};

// ===================== BẦU CUA =====================
const BC_CHIPS=[100,200,500,1000,2000,5000];
MG_MODE.baucua={
 open(){MG.bxu['Nhà cái']=Math.max(MG.bxu['Nhà cái']||0,500000);const st=MG.st={role:(localStorage.getItem('tlmn_bcrole')==='cai'?'cai':'con'),chip:BC_CHIPS.includes(MG.bet)?MG.bet:200,bets:{},bots:mgBots(3),phase:'bet',dice:bcuaRoll(),res:null,bet:0};bcBotBets();bcR();},
 pub(){const st=MG.st;if(!st)return{seats:[],msg:''};const show=st.phase==='open'||st.phase==='done';return{msg:(show?'Kết quả: '+st.dice.map(d=>BC_EMO[d]).join(' '):st.phase==='shake'?'Đang lắc…':'Đặt cược')+(st.msg?' · '+st.msg:''),seats:[{name:PR.name||'Người chơi',av:myAv(),dealer:st.role==='cai',cards:null,cnt:0,lab:bcBetTxt(st.bets),v:st.res?st.res.me:null}].concat(st.bots.map((b,i)=>({name:b.name,av:b.av,cards:null,cnt:0,lab:bcBetTxt(b.bets||{}),v:st.res?st.res.b[i]:null})))};},
 quit(){const st=MG.st;if(st&&st.role==='con'){const t=Object.values(st.bets).reduce((a,x)=>a+x,0);PR.xu=Math.max(0,PR.xu-t);saveP();}}
};
const BC_COL=['#ffd84d','#4fc3f7','#ff7ab6','#7dff9a'];
function bcChipsOn(s){const st=MG.st;const out=[];if(st.bets[s])out.push({o:0,a:st.bets[s],av:myAv()});st.bots.forEach((b,i)=>{const a=(b.bets||{})[s];if(a)out.push({o:i+1,a,av:b.av});});return out;}
function bcBetTxt(b){return Object.entries(b).filter(([,v])=>v).map(([s,v])=>BC_EMO[s]+kxu(v)).join(' ');}
function bcTot(b){return Object.values(b||{}).reduce((a,x)=>a+x,0);}
function bcPlan(maxK,amts){const st=MG.st;const plan=[];st.bots.forEach((b,i)=>{let tot=0;const k=1+Math.floor(Math.random()*maxK);for(let j=0;j<k;j++){const sy=BC_SYM[Math.floor(Math.random()*6)];const a=amts[Math.floor(Math.random()*amts.length)];if(tot+a<=(MG.bxu[b.name]||0)/2){tot+=a;plan.push([i,sy,a]);}}});
 for(let i=plan.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[plan[i],plan[j]]=[plan[j],plan[i]];}return plan;}
function bcPlay(plan,done){const st=MG.st;st.placing=true;let q=0;const gap=RM?160:380;(function nx(){if(MG.st!==st)return;if(q>=plan.length){st.placing=false;bcR();if(done)done();return;}const [i,sy,a]=plan[q++];const b=st.bots[i];b.bets[sy]=(b.bets[sy]||0)+a;bcR();bcFlyIn(i+1,sy);setTimeout(nx,gap);})();}
function bcBotBets(){const st=MG.st;mgRefill(st.bots,500);st.bots.forEach(b=>b.bets={});if(st.role==='con')return;bcPlay(bcPlan(3,[100,200,500,1000]));}
function bcFlyIn(o,sy){const chip=document.querySelector(`#mg .bct[data-s="${sy}"] .bcc[data-o="${o}"]`);const src=o===0?document.querySelector('#mg .bcleg .av'):document.querySelector(`#mg .bcs[data-o="${o}"] .av`);if(!chip)return;sfx('cgChip');if(!src)return;
 const a=src.getBoundingClientRect(),b=chip.getBoundingClientRect();const f=chip.cloneNode(true);f.classList.add('bcfly');f.style.left=(a.left+a.width/2-b.width/2)+'px';f.style.top=(a.top+a.height/2-b.height/2)+'px';document.body.appendChild(f);chip.style.opacity='0';
 const dx=b.left-(a.left+a.width/2-b.width/2),dy=b.top-(a.top+a.height/2-b.height/2);const dur=RM?220:520;
 const kf=RM?[{opacity:.4,transform:'translate(0,0)'},{opacity:1,transform:`translate(${dx}px,${dy}px)`}]:[{transform:'translate(0,0) scale(.6) rotate(0)'},{transform:`translate(${dx*.5}px,${dy*.5-60}px) scale(1.25) rotate(200deg)`,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(1) rotate(360deg)`}];
 f.animate(kf,{duration:dur,easing:'cubic-bezier(.3,.6,.4,1)',fill:'forwards'}).onfinish=()=>{f.remove();chip.style.opacity='';chip.classList.add('land');setTimeout(()=>sfx('cgChip'),0);};}
function bcR(){const o=$('mg');const st=MG.st;if(!o||!st)return;const show=st.phase==='open'||st.phase==='done';
 const tile=s=>{const hit=show?st.dice.filter(d=>d===s).length:0;const chips=bcChipsOn(s);
  return `<button class="bct ${hit?'hit':''} ${show&&!hit&&chips.length?'miss':''}" data-s="${s}" onclick="bcPut('${s}')"><span class="bce">${BC_EMO[s]}</span><b>${BC_NAME[s]}</b>${hit?`<em class="bcx">×${hit}</em>`:''}<div class="bcch">${chips.map(c=>`<i class="bcc ${c.o===0?'me':''}" data-o="${c.o}" style="--cc:${BC_COL[c.o]}"><span>${c.av}</span>${kxu(c.a)}</i>`).join('')}</div></button>`;};
 const dealer=st.role==='cai'?{name:'Bạn (cái)',av:myAv(),me:1}:{name:'Nhà cái',av:'🎩'};
 o.innerHTML=mgTop()+`<div class="bctbl"><div class="bcseats"><div class="bcs dl" data-o="d" style="--cc:${st.role==='cai'?BC_COL[0]:'#bbb'}">${mgSeat(dealer,'<i class="cgdl">CÁI</i>')}</div>${st.bots.map((b,i)=>`<div class="bcs" data-o="${i+1}" style="--cc:${BC_COL[i+1]}">`+mgSeat(b,st.res?`<i class="mgv ${st.res.b[i]>0?'pos':st.res.b[i]<0?'neg':''}">${st.res.b[i]>0?'+':''}${kxu(st.res.b[i])}</i>`:(bcTot(b.bets)?`<i class="mgv">${kxu(bcTot(b.bets))}</i>`:''))+'</div>').join('')}</div>${st.role==='con'?`<div class="bcleg"><span class="bcs me" data-o="0" style="--cc:${BC_COL[0]}"><span class="av" style="--avc:#3a5">${myAv()}</span><b>Bạn</b>${bcTot(st.bets)?' · '+kxu(bcTot(st.bets)):''}</span></div>`:''}
 <div class="bcplate ${st.phase==='shake'?'shaking':''} ${show?'open':''}"><div class="bcdice">${st.dice.map((d,i)=>`<span class="bcd" style="--i:${i}">${BC_EMO[d]}</span>`).join('')}</div><div class="bcbowl"></div></div>
 <div class="cgmsg">${esc(st.msg||(st.phase==='bet'?(st.role==='con'?'Chọn chip rồi chạm vào ô để đặt (đặt được nhiều ô)':'Các nhà đã đặt. Bạn làm cái — bấm Lắc'):''))}</div>
 <div class="bcboard">${BC_SYM.map(tile).join('')}</div></div><div class="cgctl">${bcCtl()}</div>`;try{svaScan(o);}catch(e){}}
function bcCtl(){const st=MG.st;if(st.phase==='shake')return '<p class="small" style="text-align:center">Đang lắc…</p>';if(st.phase==='open')return `<button class="cgbig" onclick="bcOpen()">Mở bát 🥣</button>`;
 const led=st.phase==='done'?mgLedger(st.ledger):'';const tot=bcTot(st.bets);const need=bcTot(st.bots.reduce((a,b)=>{for(const s in b.bets)a[s]=(a[s]||0)+b.bets[s];return a;},{}))*3;
 return `${led}<div class="cgrole"><button class="${st.role==='con'?'':'alt'}" onclick="bcRole('con')">🙋 Chơi con</button><button class="${st.role==='cai'?'':'alt'}" onclick="bcRole('cai')">🎩 Làm cái</button></div>
 ${st.role==='con'?`${mgBets(BC_CHIPS,st.chip,'bcChip',b=>b<=PR.xu)}<div class="cgrow"><button class="cgbig alt" ${tot?'':'disabled'} onclick="bcClear()">Xóa cược</button><button class="cgbig" ${tot?'':'disabled'} onclick="bcShake()">Lắc · ${kxu(tot)}</button></div>`
 :`<p class="small cgnote">Làm cái: ăn/chung từng nhà. Cần ≥ ${fmt(need)} xu (gấp 3 tổng cược).</p><div class="cgrow"><button class="cgbig alt" onclick="bcNew()">Đổi lượt cược</button><button class="cgbig" ${PR.xu<need?'disabled':''} onclick="bcShake()">Lắc</button></div>`}`;}
function bcChip(b){MG.st.chip=b;MG.bet=b;sfx('tap');bcR();}
function bcRole(r){const st=MG.st;if(st.phase!=='bet'&&st.phase!=='done')return;localStorage.setItem('tlmn_bcrole',r);st.role=r;bcNew();}
function bcNew(){const st=MG.st;st.phase='bet';st.bets={};st.res=null;st.msg='';st.ledger=null;bcBotBets();bcR();}
function bcPut(s){const st=MG.st;if(st.placing)return;if(st.phase==='done')bcNew();if(st.phase!=='bet'||st.role!=='con')return;const tot=bcTot(st.bets);if(tot+st.chip>PR.xu)return toast('Không đủ xu');st.bets[s]=(st.bets[s]||0)+st.chip;bcR();bcFlyIn(0,s);}
function bcClear(){MG.st.bets={};bcR();}
function bcShake(){const st=MG.st;if(st.placing)return;if(st.phase==='done'){st.res=null;st.ledger=null;st.msg='';if(st.role==='con'&&bcTot(st.bets)>PR.xu)st.bets={};if(st.role==='cai'){st.phase='bet';mgRefill(st.bots,500);st.bots.forEach(b=>b.bets={});bcR();return bcPlay(bcPlan(3,[100,200,500,1000]),bcShake2);}st.phase='bet';}if(st.role==='con'&&!bcTot(st.bets))return;
 if(st.placing)return;if(st.role==='con'&&!st._botsIn){st.bots.forEach(b=>b.bets={});st._botsIn=1;return bcPlay(bcPlan(2,[100,200,500]),()=>{st._botsIn=0;bcShake2();});}
 bcShake2();}
function bcShake2(){const st=MG.st; st.dice=bcuaRoll();st.phase='shake';st.busy=true;st.bet=st.role==='con'?bcTot(st.bets):0;bcR();bcRattle();setTimeout(()=>{if(MG.st!==st)return;st.phase='open';st.msg='Bát đã lắc xong — mở bát!';bcR();},RM?300:1400);}
function bcRattle(){const n=RM?4:14;for(let i=0;i<n;i++){const t=i*0.085+Math.random()*0.02;noise(.04,.12,t,1800+Math.random()*1500);tone(900+Math.random()*700,.03,'triangle',.04,t);}noise(.12,.15,n*0.085,500);}
function bcOpen(){const st=MG.st;if(st.phase!=='open')return;st.phase='done';st.busy=false;sfx('cgSnap');noise(.15,.08,0,2500);
 const bv=st.bots.map(b=>bcuaPay(b.bets||{},st.dice));let me;
 if(st.role==='con'){me=bcuaPay(st.bets,st.dice);bv.forEach((v,i)=>{MG.bxu[st.bots[i].name]=Math.max(0,(MG.bxu[st.bots[i].name]||0)+v);});st.ledger=[['Với nhà cái',me]];}
 else{const v=cgCap([0].concat(bv),PR.xu);me=v[0];v.slice(1).forEach((x,i)=>{bv[i]=x;MG.bxu[st.bots[i].name]=Math.max(0,(MG.bxu[st.bots[i].name]||0)+x);});st.ledger=st.bots.map((b,i)=>[b.name,-bv[i]]);}
 st.res={me,b:bv};const triple=st.dice[0]===st.dice[1]&&st.dice[1]===st.dice[2];st.msg=(me>0?`🎉 Bạn thắng +${fmt(me)} xu`:me<0?`Bạn thua ${fmt(me)} xu`:'Hòa')+(triple?' · Bão '+BC_NAME[st.dice[0]]+'!':'');
 const xp=mgEnd(me,{stats:triple&&me>0?['bcuaTriple']:[]});st.msg+=` · +${xp} XP`;bcR();bcFlyChips();}
function bcFlyChips(){const st=MG.st;const dl=document.querySelector('#mg .bcs.dl .av');document.querySelectorAll('#mg .bct .bcc').forEach((c,q)=>{const s=c.closest('.bct').dataset.s;const hit=st.dice.includes(s);const o=c.dataset.o;
  const tgt=hit?(o==='0'?(st.role==='con'?document.querySelector('#mg .bcleg .av'):dl):document.querySelector(`#mg .bcs[data-o="${o}"] .av`)):(st.role==='cai'?dl:document.querySelector('#mg .bcs.dl .av'));if(!tgt)return;
  if(hit)c.classList.add('win');if(RM)return;const a=c.getBoundingClientRect(),b=tgt.getBoundingClientRect();const f=c.cloneNode(true);f.classList.add('bcfly');f.style.left=a.left+'px';f.style.top=a.top+'px';document.body.appendChild(f);
  const dx=b.left+b.width/2-a.left-a.width/2,dy=b.top+b.height/2-a.top-a.height/2;f.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.5}px,${dy*.5-40}px) scale(1.15)`,opacity:1,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.6)`,opacity:.2}],{duration:750,delay:700+q*70,easing:'ease-in',fill:'both'}).onfinish=()=>{f.remove();if(q%2===0)sfx('cgChip');};c.style.transition='opacity .3s';setTimeout(()=>c.style.opacity='.25',700+q*70);});}

// ===================== DOMINO =====================
MODES.push(['domino','Domino','🁫']);
const DM_PIPS={0:[],1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function dmHalf(n){return `<span class="dmh">${[...Array(9).keys()].map(k=>`<i class="${DM_PIPS[n].includes(k)?'on':''}"></i>`).join('')}</span>`;}
function dmTileH(a,b,vert,cls,on){return `<div class="dmt ${vert?'v':''} ${cls||''}" ${on?`onclick="${on}"`:''}>${dmHalf(a)}${dmHalf(b)}</div>`;}
const DM_BETS=[100,200,500,1000,2000,5000];
MG_MODE.domino={
 open(){MG.st=null;MG.dmN=+(localStorage.getItem('tlmn_dmn')||3);if(!DM_BETS.includes(MG.bet))MG.bet=200;MG.dmBots=mgBots(MG.dmN-1);dmR();},
 pub(){const st=MG.st;if(!st)return{seats:[],msg:'Đang chọn bàn'};return{msg:(st.msg||'')+(st.ends?` · Đầu dây ${st.ends[0]} | ${st.ends[1]}`:'')+` · Nọc ${st.bone.length}`,seats:st.seats.map((s,i)=>({name:i===0?(PR.name||'Người chơi'):s.name,av:i===0?myAv():s.av,cards:null,cnt:st.hands[i].length,lab:st.phase==='done'?dmPips(st.hands[i])+' nút':'',v:st.res?st.res[i]:null}))};},
 quit(){const st=MG.st;if(st&&st.busy){PR.xu=Math.max(0,PR.xu-st.bet*2);saveP();}}
};
function dmSet(k,v){if(MG.st&&MG.st.busy)return;if(k==='n'){MG.dmN=v;localStorage.setItem('tlmn_dmn',v);MG.dmBots=mgBots(v-1);}else MG.bet=v;MG.st=MG.st&&MG.st.phase==='done'?MG.st:null;dmR();}
function dmUnit(){return Math.max(1,Math.round(MG.bet/10));}
function dmDeal(){if(PR.xu<MG.bet)return toast('Không đủ xu');mgRefill(MG.dmBots,MG.bet*3);const n=MG.dmN;const t=dmTiles();for(let i=t.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[t[i],t[j]]=[t[j],t[i]];}
 const seats=[{name:'Bạn',av:myAv(),me:1}].concat(MG.dmBots.slice(0,n-1));const hands=seats.map(()=>t.splice(0,7));const s0=dmStarter(hands);
 MG.st={seats,hands,bone:t,chain:[],ends:null,turn:s0.i,first:s0.t,pass:0,phase:'play',busy:true,bet:MG.bet,msg:`${s0.i===0?'Bạn':seats[s0.i].name} đi trước với [${s0.t[0]}|${s0.t[1]}]`,res:null,sel:null};
 sfx('cgRiffle');dmR();setTimeout(dmStep,900);}
function dmStep(){const st=MG.st;if(!st||st.phase!=='play'||MG.g!=='domino')return;const i=st.turn;const h=st.hands[i];
 const can=()=>h.some(t=>st.first?(t[0]===st.first[0]&&t[1]===st.first[1]):dmFits(t,st.ends).length);
 if(!can()&&i===0){st.need=st.bone.length?'draw':'pass';st.msg=st.bone.length?'Không có quân hợp — bấm Bốc':'Không đi được — bấm Bỏ lượt';dmR();return;}
 if(!can()){if(st.bone.length){h.push(st.bone.pop());sfx('cgSlide');st.msg=`${i===0?'Bạn':st.seats[i].name} bốc nọc`;dmR();return setTimeout(dmStep,i===0?350:420);}
  dmPassT(i);return;}
 if(i===0){st.msg='Lượt bạn: chạm quân để chọn rồi bấm Đánh';dmR();return;}
 if(st._bt===i)return;st._bt=i;setTimeout(()=>{st._bt=null;if(MG.st!==st||st.turn!==i||st.phase!=='play')return;let pick;if(st.first){pick={k:h.findIndex(t=>t[0]===st.first[0]&&t[1]===st.first[1]),side:'L'};}else pick=dmBotPick(h,st.ends);if(!pick||pick.k<0)return dmStep();dmPlay(i,pick.k,pick.side);},650+Math.random()*350);}
function dmPassT(i){const st=MG.st;st.pass++;st.need=null;st.msg=`${i===0?'Bạn':st.seats[i].name} không đi được — qua lượt`;sfx('pass');if(st.pass>=st.seats.length)return dmEnd(dmBlockedWinner(st.hands),true);st.turn=(i+1)%st.seats.length;dmR();setTimeout(dmStep,700);}
function dmDraw(){const st=MG.st;if(!st||st.turn!==0||st.need!=='draw')return;st.hands[0].push(st.bone.pop());st.need=null;sfx('cgSlide');st.msg='Bạn bốc nọc';st.sel=null;dmR();setTimeout(dmStep,250);}
function dmPassBtn(){const st=MG.st;if(!st||st.turn!==0||st.need!=='pass')return;dmPassT(0);}
function dmOk(t){const st=MG.st;return st.first?(t[0]===st.first[0]&&t[1]===st.first[1]):dmFits(t,st.ends).length>0;}
function dmGo(side){const st=MG.st;if(!st||st.turn!==0||st.phase!=='play'||st.sel==null)return;const t=st.hands[0][st.sel];if(!dmOk(t))return sfx('bad');
 if(st.first)return dmPlay(0,st.sel,'L');const f=dmFits(t,st.ends);if(side&&f.includes(side))return dmPlay(0,st.sel,side);if(f.length===2&&st.ends[0]!==st.ends[1]){st.choose=true;st.msg='Chọn đầu dây để nối (chạm đầu sáng hoặc nút ◀ ▶)';dmR();return;}dmPlay(0,st.sel,f[0]);}
function dmPlay(i,k,side){const st=MG.st;const t=st.hands[i][k];const r=dmPlace(st.ends,t,side);st.hands[i].splice(k,1);st.ends=r.ends;const piece={a:r.placed[0],b:r.placed[1],dbl:t[0]===t[1],fresh:1};
 st.chain.forEach(c=>c.fresh=0);if(side==='L')st.chain.unshift(piece);else st.chain.push(piece);st.first=null;st.pass=0;st.sel=null;st.choose=false;st.need=null;sfx('cgThud');setTimeout(()=>sfx('cgSnap'),60);
 st.msg=`${i===0?'Bạn':st.seats[i].name} đánh [${t[0]}|${t[1]}]`;if(!st.hands[i].length)return dmEnd(i,false);st.turn=(i+1)%st.seats.length;dmR();setTimeout(dmStep,500);}
function dmTap(k){const st=MG.st;if(!st||st.phase!=='play'||st.turn!==0)return;st.choose=false;st.sel=st.sel===k?null:k;sfx('tap');dmR();}
function dmEnd(w,blocked){const st=MG.st;st.phase='done';st.busy=false;const u=dmUnit();const raw=dmSettle(st.hands,w,u);
 // trần: người thua chỉ trả tối đa số xu đang có
 const pay=raw.map((v,i)=>{if(v>=0)return v;const have=i===0?PR.xu:(MG.bxu[st.seats[i].name]||0);return -Math.min(-v,have);});const got=-pay.reduce((a,v,i)=>a+(i===w?0:v),0);pay[w]=got;
 st.res=pay;pay.forEach((v,i)=>{if(i>0)MG.bxu[st.seats[i].name]=Math.max(0,(MG.bxu[st.seats[i].name]||0)+v);});
 st.ledger=w===0?st.seats.slice(1).map((s,i)=>[s.name+' ('+dmPips(st.hands[i+1])+' nút)',-pay[i+1]]):[[st.seats[w].name+' thắng · bạn còn '+dmPips(st.hands[0])+' nút',pay[0]]];
 st.msg=(blocked?'Bí bài! ':'')+(w===0?`🎉 Bạn thắng +${fmt(pay[0])} xu`:`${st.seats[w].name} thắng · bạn ${fmt(pay[0])} xu`);
 const xp=mgEnd(pay[0],{stats:w===0&&blocked?['domBlockWin']:[]});st.msg+=` · +${xp} XP`;dmR();}
function dmR(){const o=$('mg');if(!o)return;const st=MG.st;const n=st?st.seats.length:MG.dmN;const opp=st?st.seats.slice(1):MG.dmBots.slice(0,n-1);
 const oppH=opp.map((b,j)=>{const i=j+1;const h=st?st.hands[i]:[];const up=st&&st.phase==='done';return `<div class="dmo ${st&&st.turn===i&&st.phase==='play'?'turn':''}">${mgSeat(b,st&&st.res?`<i class="mgv ${st.res[i]>0?'pos':st.res[i]<0?'neg':''}">${st.res[i]>0?'+':''}${kxu(st.res[i])}</i>`:'')}<div class="dmoh">${up?h.map(t=>dmTileH(t[0],t[1],true,'sm')).join(''):h.map(()=>'<div class="dmt v sm back"></div>').join('')}</div>${up?`<small>${dmPips(h)} nút</small>`:`<small>${h.length} quân</small>`}</div>`;}).join('');
 const chain='';
 const my=st?st.hands[0].map((t,k)=>{const my=st.phase==='play'&&st.turn===0;const ok=my&&dmOk(t);return dmTileH(t[0],t[1],true,(my?(ok?'ok':'bad'):'')+(st.sel===k?' sel':''),`dmTap(${k})`);}).join(''):'';
 o.innerHTML=mgTop()+`<div class="dmtbl"><div class="dmopp n${n}">${oppH}</div><div class="dmchain" id="dmChain"></div>${st?`<div class="dmbone">Nọc: ${st.bone.length}</div>`:''}<div class="cgmsg">${esc(st?st.msg:'Domino đôi sáu · bốc nọc khi không đi được · thắng: người thua trả '+fmt(dmUnit())+' xu mỗi nút còn lại')}</div>
 <div class="dmme ${st&&st.turn===0&&st.phase==='play'?'turn':''}">${my}</div></div><div class="cgctl">${dmCtl()}</div>`;try{svaScan(o);}catch(e){}dmSnake();}
function dmCtl(){const st=MG.st;if(st&&st.choose&&st.sel!=null&&st.ends)return `<div class="cgrow"><button class="cgbig" onclick="dmGo('L')">◀ Đầu trái (${st.ends[0]})</button><button class="cgbig" onclick="dmGo('R')">Đầu phải (${st.ends[1]}) ▶</button></div>`;
 if(st&&st.phase==='play'){if(st.turn!==0)return '<p class="small" style="text-align:center">Đang chờ…</p>';if(st.need==='draw')return `<button class="cgbig" onclick="dmDraw()">Bốc nọc (${st.bone.length})</button>`;if(st.need==='pass')return `<button class="cgbig alt" onclick="dmPassBtn()">Bỏ lượt</button>`;
  const t=st.sel!=null?st.hands[0][st.sel]:null;return `<div class="cgrow"><button class="cgbig" ${t&&dmOk(t)?'':'disabled'} onclick="dmGo()">Đánh</button></div>`;}
 return `${st?mgLedger(st.ledger):''}<div class="cgset"><div class="cgn">${[2,3,4].map(k=>`<button class="${k===MG.dmN?'':'alt'}" onclick="dmSet('n',${k})">${k}</button>`).join('')}<span class="small">người</span></div></div>${mgBets(DM_BETS,MG.bet,"dmSet.bind(null,'bet')",b=>b<=PR.xu)}<button class="cgbig" ${PR.xu<MG.bet?'disabled':''} onclick="dmDeal()">${st?'Ván mới':'Chia bài'} · ${fmt(dmUnit())} xu/nút</button>`;}

// ===================== Bộ cược chung (Xì tố & Poker) =====================
function btNew(n,stacks){return{n,stack:stacks.slice(),contrib:Array(n).fill(0),rb:Array(n).fill(0),fold:Array(n).fill(false),allin:Array(n).fill(false),acted:Array(n).fill(false),hi:0,minR:0,raises:0,cur:0};}
function btPay(b,i,x){x=Math.max(0,Math.min(x,b.stack[i]));b.stack[i]-=x;b.contrib[i]+=x;b.rb[i]+=x;if(b.stack[i]===0)b.allin[i]=true;return x;}
function btToCall(b,i){return Math.max(0,b.hi-b.rb[i]);}
function btAct(b,i,a,T){if(a==='fold'){b.fold[i]=true;}else if(a==='check'||a==='call'){btPay(b,i,btToCall(b,i));}
 else{const target=a==='allin'?b.rb[i]+b.stack[i]:Math.min(T,b.rb[i]+b.stack[i]);btPay(b,i,target-b.rb[i]);if(b.rb[i]>b.hi){const inc=b.rb[i]-b.hi;if(inc>=b.minR||a!=='allin'){b.minR=Math.max(b.minR,inc);b.acted=b.acted.map((x,j)=>j===i);b.raises++;}b.hi=b.rb[i];}}
 b.acted[i]=true;}
function btCanAct(b,i){return !b.fold[i]&&!b.allin[i];}
function btLive(b){return b.fold.map((f,i)=>f?-1:i).filter(i=>i>=0);}
function btRoundDone(b){return b.fold.every((f,i)=>f||b.allin[i]||(b.acted[i]&&b.rb[i]===b.hi));}
function btNextFrom(b,i){for(let k=1;k<=b.n;k++){const j=(i+k)%b.n;if(btCanAct(b,j))return j;}return -1;}
function btNewRound(b){b.rb=b.rb.map(()=>0);b.acted=b.acted.map(()=>false);b.hi=0;b.raises=0;}
function btPot(b){return b.contrib.reduce((a,x)=>a+x,0);}
function shuf(d){d=d.slice();for(let i=d.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]];}return d;}
// ước lượng khả năng thắng: biết bài mình + bài ngửa của đối thủ
function xtEq(mine,opps,deck,iters){const used=new Set(mine.concat(...opps));const rest=deck.filter(c=>!used.has(c));let w=0;iters=iters||90;
 for(let t=0;t<iters;t++){const d=shuf(rest);let p=0;const me=mine.concat(d.slice(p,p+=5-mine.length));const ms=eval5(me,'xt');let lose=false;for(const o of opps){const oh=o.concat(d.slice(p,p+=5-o.length));if(cmpSc(eval5(oh,'xt'),ms)>0){lose=true;break;}}if(!lose)w++;}return w/iters;}
function pkEq(hole,board,nOpp,iters){return pkEquity(hole,board,nOpp,iters||100,'pk',DECK52);}
// quyết định của máy theo sức bài + ngẫu nhiên
function botBet(b,i,eq,opt){const tc=btToCall(b,i),pot=btPot(b);const odds=tc/(pot+tc||1);const r=Math.random();const live=btLive(b).length;const adj=eq*(1+0.12*(live-2));
 if(tc>0&&adj<odds*0.9&&r>0.07)return{a:'fold'};
 if((adj>0.68||(r<0.06&&adj>0.3))&&b.raises<(opt.maxR||3)&&b.stack[i]>tc){return{a:'raise',T:b.hi+Math.max(opt.raise(b),b.minR)};}
 return{a:tc?'call':'check'};}
function btSeatLab(b,i){return b.fold[i]?'<i class="pkst f">Bỏ</i>':b.allin[i]?'<i class="pkst a">Tất tay</i>':b.rb[i]?`<i class="pkchip">${kxu(b.rb[i])}</i>`:'';}

function mgFly(src,target,delay,dur,flip){return new Promise(res=>{if(!src||!target){res();return;}target.style.opacity='0';setTimeout(()=>{const sr=src.getBoundingClientRect(),tr=target.getBoundingClientRect();if(!tr.width){target.style.opacity='';res();return;}
 if(RM){target.style.opacity='';sfx('cgSlide');res();return;}const f=document.createElement('div');f.className='card back cgc cgfly';f.style.cssText=`left:${sr.left+sr.width/2-tr.width/2}px;top:${sr.top+sr.height/2-tr.height/2}px;width:${tr.width}px;height:${tr.height}px`;document.body.appendChild(f);
 const dx=tr.left-(sr.left+sr.width/2-tr.width/2),dy=tr.top-(sr.top+sr.height/2-tr.height/2);sfx('cgSlide');
 f.animate([{transform:'translate(0,0) rotate(0) scale(.7)'},{transform:`translate(${dx*.5}px,${dy*.5-40}px) rotate(${dx<0?-200:200}deg) scale(1.05)`,offset:.5},{transform:`translate(${dx}px,${dy}px) rotate(${dx<0?-360:360}deg) scale(1)`}],{duration:dur,easing:'cubic-bezier(.3,.6,.4,1)',fill:'forwards'}).onfinish=()=>{f.remove();target.style.opacity='';sfx('cgThud');if(flip){target.classList.add('cgflip');sfx('cgSnap');}res();};},delay);});}

// ===================== XÌ TỐ =====================
MODES.push(['xito','Xì tố','🂡']);
const XT_BETS=[100,200,500,1000,2000,5000];
MG_MODE.xito={
 open(){MG.st=null;MG.xtN=+(localStorage.getItem('tlmn_xtn')||4);if(!XT_BETS.includes(MG.bet))MG.bet=200;MG.xtBots=mgBots(MG.xtN-1);xtR();},
 pub(){const st=MG.st;if(!st)return{seats:[],msg:'Đang chọn bàn'};const sd=st.phase==='done';return{msg:(st.msg||'')+' · Hũ '+kxu(btPot(st.b)),seats:st.seats.map((s,i)=>({name:i===0?(PR.name||'Người chơi'):s.name,av:i===0?myAv():s.av,cards:sd&&!st.b.fold[i]?st.hands[i].slice():st.hands[i].slice(1),cnt:st.hands[i].length,lab:st.b.fold[i]?'Bỏ':'',v:st.res?st.res[i]:null}))};},
 quit(){const st=MG.st;if(st&&st.busy){PR.xu=Math.max(0,PR.xu-st.b.contrib[0]);saveP();}}
};
function xtSet(k,v){if(MG.st&&MG.st.busy)return;if(k==='n'){MG.xtN=v;localStorage.setItem('tlmn_xtn',v);MG.xtBots=mgBots(v-1);}else MG.bet=v;if(MG.st&&MG.st.phase!=='done')MG.st=null;xtR();}
function xtRaise(st){return st.bet*(st.round>=2?2:1);}
function xtDeal(){if(PR.xu<MG.bet*3)return toast('Cần ít nhất '+fmt(MG.bet*3)+' xu');mgRefill(MG.xtBots,MG.bet*10);const n=MG.xtN;const seats=[{name:'Bạn',av:myAv(),me:1}].concat(MG.xtBots.slice(0,n-1));
 const deck=shuf(DECK32);const hands=seats.map(()=>deck.splice(0,2));const b=btNew(n,seats.map((s,i)=>i===0?PR.xu:(MG.bxu[s.name]||0)));seats.forEach((s,i)=>btPay(b,i,MG.bet));btNewRound(b);
 MG.st={seats,deck,hands,b,round:0,phase:'bet',busy:true,bet:MG.bet,res:null,msg:'Mỗi nhà đặt '+fmt(MG.bet)+' xu tiền xâu. Lá đầu là tẩy (úp)'};b.minR=MG.bet;b.cur=xtFirst();sfx('cgRiffle');sfx('cgChip');xtR();xtAnim([0,1],xtStep);}
function xtAnim(ks,done){const st=MG.st;st.anim=true;const src=document.querySelector('#mg .pkdeck');const order=[];const n=st.seats.length;const s0=Math.max(0,st.b.cur);ks.forEach(k=>{for(let j=0;j<n;j++){const i=(s0+j)%n;if(st.b.fold[i]||st.hands[i].length<=k)continue;order.push([i,k]);}});
 const els=order.map(([i,k])=>document.querySelector(`#mg .pks[data-i="${i}"] .pkh > .cgc:nth-child(${k+1})`));els.forEach(e=>e&&(e.style.opacity='0'));const step=RM?60:Math.min(220,1300/Math.max(1,order.length));
 Promise.all(order.map(([i,k],q)=>mgFly(src,els[q],q*step,RM?0:380,k>0||i===0))).then(()=>{if(MG.st!==st)return;st.anim=false;setTimeout(done,200);});}
function xtFirst(){const st=MG.st,b=st.b;let best=-1,bs=null;st.hands.forEach((h,i)=>{if(!btCanAct(b,i))return;const sc=evalPartial(h.slice(1)).concat([Math.max(...h.slice(1).map(c=>pkV(c)*4+(c&3)))]);if(!bs||cmpSc(sc,bs)>0){bs=sc;best=i;}});return best;}
function xtStep(){const st=MG.st;if(!st||MG.g!=='xito'||st.phase!=='bet'||st.anim)return;const b=st.b;
 if(btLive(b).length===1)return xtShow();
 if(btRoundDone(b)||b.cur<0){if(st.round>=3)return xtShow();st.round++;btNewRound(b);b.minR=xtRaise(st);st.hands.forEach((h,i)=>{if(!b.fold[i])h.push(st.deck.pop());});
  const acts=b.fold.filter((f,i)=>!f&&!b.allin[i]).length;b.cur=xtFirst();st.msg='Chia lá thứ '+(st.round+2);xtR();const k=st.round+1;if(acts<=1){const c=b.cur;b.cur=-1;return xtAnim([k],()=>{btNewRound(b);b.acted=b.acted.map(()=>true);xtStep();});}return xtAnim([k],xtStep);}
 const i=b.cur;if(i===0){st.msg='Lượt bạn';xtR();return;}
 if(st._bt===i)return;st._bt=i;setTimeout(()=>{st._bt=null;if(MG.st!==st||b.cur!==i)return;const opps=st.hands.map((h,j)=>j!==i&&!b.fold[j]?h.slice(1):null).filter(Boolean);
  const eq=xtEq(st.hands[i],opps,DECK32,80);let d=botBet(b,i,eq,{maxR:3,raise:()=>{const ms=eq>0.85?[5,7,10]:eq>0.75?[3,4,5]:[1,2,3];return ms[Math.random()*3|0]*st.bet;}});if(eq>0.88&&Math.random()<0.25&&st.round>=2)d={a:'allin'};if(d.a==='raise'&&d.T-b.rb[i]>=b.stack[i])d={a:'allin'};xtDo(i,d.a,d.T);},420+Math.random()*350);}
function xtDo(i,a,T){const st=MG.st,b=st.b;if(b.cur!==i)return;const tc=btToCall(b,i);if(a==='check'&&tc)a='call';btAct(b,i,a,T);const nm=i===0?'Bạn':st.seats[i].name;
 st.msg=nm+' '+({fold:'úp bỏ',check:'xem',call:tc?'theo '+kxu(tc):'xem',raise:'tố '+kxu(b.hi),allin:'TỐ TẤT '+kxu(b.rb[i])})[a];if(a==='allin'){sfx('cgFan');}sfx(a==='fold'?'pass':a==='raise'||a==='allin'?'cgChip':'tap');if(a==='raise'||a==='allin')setTimeout(()=>sfx('cgChip'),120);
 b.cur=btRoundDone(b)?-1:btNextFrom(b,i);xtR();setTimeout(xtStep,350);}
function xtShow(){const st=MG.st,b=st.b;st.phase='done';st.busy=false;while(st.hands.some((h,i)=>!b.fold[i]&&h.length<5)){st.hands.forEach((h,i)=>{if(!b.fold[i]&&h.length<5)h.push(st.deck.pop());});}
 const scores=st.hands.map((h,i)=>b.fold[i]?null:eval5(h,'xt'));const win=awardPots(sidePots(b.contrib,b.fold),scores);st.res=win.map((w,i)=>w-b.contrib[i]);st.scores=scores;
 st.res.forEach((v,i)=>{if(i>0)MG.bxu[st.seats[i].name]=Math.max(0,(MG.bxu[st.seats[i].name]||0)+v);});const me=st.res[0];
 const wi=st.res.indexOf(Math.max(...st.res));const wn=scores[wi]?handName(scores[wi],'xt'):'';st.msg=(wi===0?'🎉 Bạn thắng':st.seats[wi].name+' thắng')+(wn&&btLive(b).length>1?' · '+wn:'')+` · Bạn ${me>=0?'+':''}${fmt(me)} xu`;
 st.ledger=st.seats.map((s,i)=>[(i===0?'Bạn':s.name)+(scores[i]?' · '+handName(scores[i],'xt'):' · bỏ'),st.res[i]]);
 const stats=[];if(me>0&&scores[0]&&scores[0][0]>=8)stats.push('xtSF');if(me>0&&scores[0]&&scores[0][0]>=7)stats.push('xtBig');const xp=mgEnd(me,{stats});st.msg+=` · +${xp} XP`;sfx('cgSnap');xtR();}
function xtR(){const o=$('mg');if(!o)return;const st=MG.st;const n=st?st.seats.length:MG.xtN;const seats=st?st.seats:[{name:'Bạn',av:myAv(),me:1}].concat(MG.xtBots.slice(0,n-1));const fr=st&&st.fresh;if(st)st.fresh=0;
 const seat=(s,i)=>{const b=st&&st.b;const h=st?st.hands[i]:[];const sd=st&&st.phase==='done';const cards=h.map((c,k)=>cgCard(c,i===0||k>0||(sd&&!b.fold[i]),k,(fr&&k===h.length-1?'cgnew':'')+(k===0&&i===0&&!sd?' tay':''))).join('');
  const lab=st&&(i===0||sd)&&h.length&&!b.fold[i]?`<div class="cgsc">${sd?handName(eval5(h.concat(h.length<5?[]:[]).slice(0,5),'xt'),'xt'):handName(evalPartial(h),'xt')}</div>`:'';
  return `<div class="pks ${i===0?'me':''} ${st&&st.phase==='bet'&&b.cur===i?'turn':''} ${b&&b.fold[i]?'fold':''}" data-i="${i}">${mgSeat(i===0?{name:'Bạn',av:myAv(),me:1}:s,st?(sd?'':btSeatLab(b,i))+(st.res?`<i class="mgv ${st.res[i]>0?'pos':st.res[i]<0?'neg':''}">${st.res[i]>0?'+':''}${kxu(st.res[i])}</i>`:''):'')}<div class="pkh">${cards}</div>${lab}</div>`;};
 o.innerHTML=mgTop()+`<div class="pktbl"><div class="pkopp n${n}">${seats.slice(1).map((s,j)=>seat(s,j+1)).join('')}</div><div class="pkpot"><div class="card back cgc pkdeck"></div>${st?`${I('coin')} Hũ: <b>${fmt(btPot(st.b))}</b>`:''}</div><div class="cgmsg">${esc(st?st.msg:'Xì tố 32 lá (7→A) · 5 lá, lá đầu úp · Thùng phá sảnh > Tứ quý > Thùng > Cù lũ > Sảnh > Sám > Thú > Đôi')}</div>${seat(seats[0],0)}</div><div class="cgctl">${xtCtl()}</div>`;try{svaScan(o);}catch(e){}}
function xtCtl(){const st=MG.st;if(st&&st.phase==='bet'){const b=st.b;if(b.cur!==0||st.anim)return '<p class="small" style="text-align:center">Đang chờ…</p>';const tc=btToCall(b,0),stk=b.stack[0];const canR=b.raises<3&&stk>tc;
  const mult=[1,2,3,4,5,6,7,8,9,10].map(m=>{const T=b.hi+m*st.bet;const ok=canR&&T-b.rb[0]<stk&&m*st.bet>=b.minR;return `<button class="${ok?'':'alt'}" ${ok?'':'disabled'} onclick="xtDo(0,'raise',${T})">x${m}</button>`;}).join('');
  return `<div class="xtmul">${mult}</div><div class="cgrow pkact"><button class="cgbig alt" onclick="xtDo(0,'fold')">Úp</button><button class="cgbig alt" onclick="xtDo(0,'${tc?'call':'check'}')">${tc?(tc>=stk?'Theo (tất)':'Theo '+kxu(tc)):'Xem'}</button><button class="cgbig pkall" ${stk>0?'':'disabled'} onclick="if(confirm('Tố tất ${fmt(stk)} xu?'))xtDo(0,'allin')">Tố tất</button></div><p class="small xtnote">Tố x1–x10 tiền xâu (${fmt(st.bet)})</p>`;}
 return `${st?mgLedger(st.ledger):''}<div class="cgset"><div class="cgn">${[2,3,4,5].map(k=>`<button class="${k===MG.xtN?'':'alt'}" onclick="xtSet('n',${k})">${k}</button>`).join('')}<span class="small">người</span></div></div>${mgBets(XT_BETS,MG.bet,"xtSet.bind(null,'bet')",b=>b*3<=PR.xu)}<button class="cgbig" ${PR.xu<MG.bet*3?'disabled':''} onclick="xtDeal()">${st?'Ván mới':'Chia bài'} · tiền xâu ${fmt(MG.bet)}</button>`;}

// ===================== POKER TEXAS HOLD'EM =====================
MODES.push(['poker','Poker','♠️']);
const PK_BETS=[100,200,500,1000,2000,5000];// = big blind
MG_MODE.poker={
 open(){MG.st=null;MG.pkN=+(localStorage.getItem('tlmn_pkn')||6);if(!PK_BETS.includes(MG.bet))MG.bet=200;MG.pkBots=mgBots(MG.pkN-1);MG.pkBtn=MG.pkBtn||0;pkR();},
 pub(){const st=MG.st;if(!st)return{seats:[],msg:'Đang chọn bàn'};const sd=st.phase==='done';return{msg:(st.msg||'')+' · Bài chung: '+(st.board.length?st.board.map(c=>cName(c)).join(' '):'—')+' · Hũ '+kxu(btPot(st.b)),seats:st.seats.map((s,i)=>({name:i===0?(PR.name||'Người chơi'):s.name,av:i===0?myAv():s.av,cards:sd&&st.shown&&st.shown[i]?st.hands[i].slice():null,cnt:2,lab:st.b.fold[i]?'Bỏ':'',v:st.res?st.res[i]:null}))};},
 quit(){const st=MG.st;if(st&&st.busy){PR.xu=Math.max(0,PR.xu-st.b.contrib[0]);saveP();}}
};
function cName(c){return ['3','4','5','6','7','8','9','10','J','Q','K','A','2'][c>>2]+'♠♣♦♥'[c&3];}
function pkSet(k,v){if(MG.st&&MG.st.busy)return;if(k==='n'){MG.pkN=v;localStorage.setItem('tlmn_pkn',v);MG.pkBots=mgBots(v-1);}else MG.bet=v;if(MG.st&&MG.st.phase!=='done')MG.st=null;pkR();}
function pkDeal(){const bb=MG.bet;if(PR.xu<bb*10)return toast('Cần ít nhất '+fmt(bb*10)+' xu');mgRefill(MG.pkBots,bb*20);const n=MG.pkN;const seats=[{name:'Bạn',av:myAv(),me:1}].concat(MG.pkBots.slice(0,n-1));
 const deck=shuf(DECK52);const hands=seats.map(()=>[deck.pop(),deck.pop()]);const b=btNew(n,seats.map((s,i)=>i===0?Math.min(PR.xu,bb*100):Math.min(MG.bxu[s.name]||0,bb*150)));
 MG.pkBtn=(MG.pkBtn+1)%n;const D=MG.pkBtn;const sb=n===2?D:(D+1)%n,bbi=n===2?(D+1)%n:(D+2)%n;btPay(b,sb,Math.floor(bb/2));btPay(b,bbi,bb);b.hi=bb;b.minR=bb;
 MG.st={seats,deck,hands,b,board:[],street:0,phase:'bet',busy:true,bet:bb,D,sb,bbi,res:null,msg:'Bài tẩy đã chia · mù nhỏ '+fmt(Math.floor(bb/2))+' / mù lớn '+fmt(bb),fresh:1};b.cur=btNextFrom(b,bbi);sfx('cgRiffle');sfx('cgChip');pkR();setTimeout(pkStep,900);}
function pkStep(){const st=MG.st;if(!st||MG.g!=='poker'||st.phase!=='bet')return;const b=st.b;
 if(btLive(b).length===1)return pkShow();
 if(btRoundDone(b)||b.cur<0){if(st.street>=3)return pkShow();st.street++;btNewRound(b);b.minR=st.bet;const k=st.street===1?3:1;for(let j=0;j<k;j++)st.board.push(st.deck.pop());st.fresh=1;for(let j=0;j<k;j++)setTimeout(()=>sfx('cgSlide'),j*140);
  st.msg=['','Lật 3 lá (flop)','Lá thứ 4 (turn)','Lá cuối (river)'][st.street];b.cur=btNextFrom(b,st.D);const acts=b.fold.filter((f,i)=>!f&&!b.allin[i]).length;pkR();
  if(acts<=1){b.cur=-1;b.acted=b.acted.map(()=>true);return setTimeout(pkStep,900);}return setTimeout(pkStep,700);}
 const i=b.cur;if(i===0){st.msg='Lượt bạn';pkR();return;}
 if(st._bt===i)return;st._bt=i;setTimeout(()=>{st._bt=null;if(MG.st!==st||b.cur!==i)return;const nOpp=btLive(b).length-1;const eq=pkEq(st.hands[i],st.board,Math.max(1,nOpp),st.street?80:50);
  const d=botBet(b,i,eq,{maxR:4,raise:bb=>Math.max(st.bet,Math.round(btPot(b)*0.6/st.bet)*st.bet)});pkDo(i,d.a,d.T);},420+Math.random()*380);}
function pkDo(i,a,T){const st=MG.st,b=st.b;if(b.cur!==i)return;const tc=btToCall(b,i);if(a==='check'&&tc)a='call';btAct(b,i,a,T);const nm=i===0?'Bạn':st.seats[i].name;
 st.msg=nm+' '+({fold:'bỏ bài',check:'xem',call:tc?'theo '+kxu(Math.min(tc,b.rb[i])):'xem',raise:'tố lên '+kxu(b.hi),allin:'tất tay '+kxu(b.rb[i])})[a];sfx(a==='fold'?'pass':a==='raise'||a==='allin'?'cgChip':'tap');
 b.cur=btRoundDone(b)?-1:btNextFrom(b,i);pkR();setTimeout(pkStep,350);}
function pkShow(){const st=MG.st,b=st.b;st.phase='done';st.busy=false;const live=btLive(b);if(live.length>1)while(st.board.length<5)st.board.push(st.deck.pop());
 const scores=st.hands.map((h,i)=>b.fold[i]?null:(live.length>1?best5(h.concat(st.board),'pk').sc:[0]));const win=awardPots(sidePots(b.contrib,b.fold),scores);st.res=win.map((w,i)=>w-b.contrib[i]);st.shown=live.length>1?b.fold.map(f=>!f):b.fold.map(()=>false);st.shown[0]=true;
 st.res.forEach((v,i)=>{if(i>0)MG.bxu[st.seats[i].name]=Math.max(0,(MG.bxu[st.seats[i].name]||0)+v);});const me=st.res[0];const wi=st.res.indexOf(Math.max(...st.res));
 st.msg=(wi===0?'🎉 Bạn thắng':st.seats[wi].name+' thắng')+(live.length>1&&scores[wi]?' · '+handName(scores[wi],'pk'):' (mọi người bỏ)')+` · Bạn ${me>=0?'+':''}${fmt(me)}`;
 st.ledger=st.seats.map((s,i)=>[(i===0?'Bạn':s.name)+(scores[i]&&live.length>1?' · '+handName(scores[i],'pk'):b.fold[i]?' · bỏ':''),st.res[i]]).filter(l=>l[1]);
 const stats=[];if(me>0&&scores[0]&&scores[0][0]>=8)stats.push('pkSF');if(me>0&&b.allin[0])stats.push('pkAllin');const xp=mgEnd(me,{stats});st.msg+=` · +${xp} XP`;sfx('cgSnap');pkR();}
function pkR(){const o=$('mg');if(!o)return;const st=MG.st;const n=st?st.seats.length:MG.pkN;const seats=st?st.seats:[{name:'Bạn',av:myAv(),me:1}].concat(MG.pkBots.slice(0,n-1));const fr=st&&st.fresh;if(st)st.fresh=0;const sd=st&&st.phase==='done';
 const seat=(s,i)=>{const b=st&&st.b;const h=st?st.hands[i]:[];const up=i===0||(sd&&st.shown[i]);const cards=h.map((c,k)=>cgCard(c,up,k)).join('');
  const tag=st?(i===st.D?'<i class="pkdb">D</i>':i===st.sb?'<i class="pkdb sb">SB</i>':i===st.bbi?'<i class="pkdb bb">BB</i>':''):'';
  const lab=st&&up&&!b.fold[i]&&(st.board.length||sd)?`<div class="cgsc">${handName(best5(h.concat(st.board),'pk').sc,'pk')}</div>`:'';
  return `<div class="pks ${i===0?'me':''} ${st&&st.phase==='bet'&&b.cur===i?'turn':''} ${b&&b.fold[i]?'fold':''}">${tag}${mgSeat(i===0?{name:'Bạn',av:myAv(),me:1}:s,st?(sd?'':btSeatLab(b,i))+(st.res?`<i class="mgv ${st.res[i]>0?'pos':st.res[i]<0?'neg':''}">${st.res[i]>0?'+':''}${kxu(st.res[i])}</i>`:`<small class="pkstk">${kxu(b.stack[i])}</small>`):'')}<div class="pkh">${cards}</div>${lab}</div>`;};
 const board=st?st.board.map((c,k)=>cgCard(c,true,k,fr&&k>=st.board.length-(st.street===1?3:1)?'cgnew':'')).join('')+'<div class="slot"></div>'.repeat(5-st.board.length):'';
 o.innerHTML=mgTop()+`<div class="pktbl pk"><div class="pkopp n${n}">${seats.slice(1).map((s,j)=>seat(s,j+1)).join('')}</div><div class="pkboard">${board}</div><div class="pkpot">${st?`${I('coin')} Hũ: <b>${fmt(btPot(st.b))}</b>`:''}</div><div class="cgmsg">${esc(st?st.msg:"Texas Hold'em · mù lớn = mức cược · mang vào tối đa 100 mù lớn")}</div>${seat(seats[0],0)}</div><div class="cgctl">${pkCtl()}</div>`;try{svaScan(o);}catch(e){}}
function pkCtl(){const st=MG.st;if(st&&st.phase==='bet'){const b=st.b;if(b.cur!==0)return '<p class="small" style="text-align:center">Đang chờ…</p>';const tc=btToCall(b,0);const st0=b.stack[0];const mn=b.hi+Math.max(b.minR,st.bet);const pot=b.hi+btPot(b)+tc;const canR=b.raises<4&&st0>tc;
  return `<div class="cgrow pkact"><button class="cgbig alt" onclick="pkDo(0,'fold')">Bỏ</button><button class="cgbig alt" onclick="pkDo(0,'${tc?'call':'check'}')">${tc?(tc>=st0?'Tất tay':'Theo '+kxu(tc)):'Xem'}</button></div><div class="cgrow pkact"><button class="cgbig" ${canR&&mn-b.rb[0]<st0?'':'disabled'} onclick="pkDo(0,'raise',${mn})">Tố ${kxu(mn)}</button><button class="cgbig" ${canR&&pot>mn&&pot-b.rb[0]<st0?'':'disabled'} onclick="pkDo(0,'raise',${pot})">Tố hũ ${kxu(pot)}</button><button class="cgbig pkall" ${st0>0?'':'disabled'} onclick="pkDo(0,'allin')">Tất tay</button></div>`;}
 return `${st?mgLedger(st.ledger):''}<div class="cgset"><div class="cgn">${[2,3,4,5,6].map(k=>`<button class="${k===MG.pkN?'':'alt'}" onclick="pkSet('n',${k})">${k}</button>`).join('')}<span class="small">người</span></div></div>${mgBets(PK_BETS,MG.bet,"pkSet.bind(null,'bet')",b=>b*10<=PR.xu)}<button class="cgbig" ${PR.xu<MG.bet*10?'disabled':''} onclick="pkDeal()">${st?'Ván mới':'Chia bài'} · mù ${kxu(MG.bet/2)}/${kxu(MG.bet)}</button>`;}

// dây domino dạng rắn: trái→phải, quay đầu ở mép, phải→trái; đôi đặt dọc; tự co giãn
function dmSnake(){const box=$('dmChain');const st=MG.st;if(!box)return;if(!st||!st.chain.length){box.innerHTML='<span class="small">Dây domino</span>';return;}
 const W=box.clientWidth-8,H=box.clientHeight-8;const ch=st.chain;let lay=null,S=22;
 for(S=22;S>=7;S--){const rows=[];let x=0,dir=1,r=0,cur=[];let ok=true;ch.forEach((c,idx)=>{const w=c.dbl?S:2*S;let nx=dir>0?x+w:x-w;if(dir>0?nx>W:nx<0){rows.push(cur);cur=[];r++;dir=-dir;nx=dir>0?x+w:x-w;if(dir>0?nx>W:nx<0){ok=false;}}cur.push({c,idx,x:dir>0?x:nx,w,dir,r});x=nx;});rows.push(cur);
  const rh=2*S+4;if(ok&&rows.length*rh<=H){lay={rows,rh};break;}}
 if(!lay){S=7;const rows=[];let x=0,dir=1,r=0,cur=[];ch.forEach((c,idx)=>{const w=c.dbl?S:2*S;let nx=dir>0?x+w:x-w;if(dir>0?nx>W:nx<0){rows.push(cur);cur=[];r++;dir=-dir;nx=dir>0?x+w:x-w;}cur.push({c,idx,x:dir>0?x:nx,w,dir,r});x=nx;});rows.push(cur);lay={rows,rh:2*S+4};}
 const all=lay.rows.flat();const minX=Math.min(...all.map(p=>p.x)),maxX=Math.max(...all.map(p=>p.x+p.w));const offX=(W-(maxX-minX))/2-minX+4,offY=Math.max(4,(H-lay.rows.length*lay.rh)/2+4);const u=S/1.7;const last=ch.length-1;
 box.innerHTML=all.map(p=>{const c=p.c;const L=p.dir>0?c.a:c.b,R=p.dir>0?c.b:c.a;const top=offY+p.r*lay.rh+(c.dbl?2:2+S/2);
  // đầu mở: nửa a của quân đầu, nửa b của quân cuối
  const endA=p.idx===0,endB=p.idx===last;const halves=c.dbl?[c.a,c.b]:[L,R];let cls=[];if(!c.dbl){if(endA)cls.push(p.dir>0?'eL':'eR');if(endB)cls.push(p.dir>0?'eR':'eL');}else{if(endA||endB)cls.push('eD');}
  const side=endA&&endB?'':endA?'L':endB?'R':'';const click=st.choose&&side?`onclick="dmGo('${side}')"`:'';
  return `<div class="dmt ${c.dbl?'v':''} ${c.fresh?'fresh':''} ${cls.join(' ')} ${st.choose&&side?'pick':''}" style="position:absolute;left:${offX+p.x}px;top:${top}px;--u:${u}px" ${click}>${dmHalf(halves[0])}${dmHalf(halves[1])}</div>`;}).join('')+
  `<div class="dmends">Đầu mở: <b>${st.ends[0]}</b> · <b>${st.ends[1]}</b></div>`;}
addEventListener('resize',()=>{if(MG.g==='domino')dmSnake();});
