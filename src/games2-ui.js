// ===== v52+: chế độ mới (Bầu cua, Domino, Xì tố, Poker) — khung chung =====
const MG={g:null,bxu:{},bet:200};
const MG_TITLE={baucua:'🦀 Bầu cua',domino:'🁫 Domino',xito:'🂡 Xì tố',poker:'♠️ Poker'};
function mgBot(used){const pool=[...CG_NAMES.keys()].filter(k=>!(used||[]).includes(CG_NAMES[k]));const k=pool[Math.floor(Math.random()*pool.length)]??0;const b={name:CG_NAMES[k],av:CG_AV[k]};if(MG.bxu[b.name]==null)MG.bxu[b.name]=Math.round(MG.bet*(20+Math.random()*40)/100)*100;return b;}
function mgBots(n){const out=[];for(let i=0;i<n;i++)out.push(mgBot(out.map(b=>b.name)));return out;}
function mgRefill(bots,need){const msg=[];bots.forEach((b,i)=>{if((MG.bxu[b.name]||0)<need){const nb=mgBot(bots.map(x=>x.name));msg.push(`${b.name} hết xu, rời bàn · ${nb.name} vào bàn`);delete MG.bxu[b.name];MG.bxu[nb.name]=Math.max(MG.bxu[nb.name],need*20);bots[i]=nb;}});if(msg.length)toast(msg.join(' — '));}
function mgOpen(g){closeModal();MG.g=g;MG.st=null;let o=$('mg');if(!o){o=document.createElement('div');o.id='mg';document.body.appendChild(o);}o.className='mg-'+g;document.body.classList.add('cgon','mgon');sfx('cgChip');MG_MODE[g].open();}
function mgClose(force){const st=MG.st;if(!force&&st&&st.busy){if(!confirm('Đang chơi dở, rời bàn sẽ mất tiền cược. Rời?'))return;if(MG_MODE[MG.g].quit)MG_MODE[MG.g].quit();}const o=$('mg');if(o)o.remove();document.body.classList.remove('cgon','mgon');MG.st=null;MG.g=null;showHome();}
function mgTop(){return `<div class="cgtop"><button class="alt ic" onclick="mgClose()">${I('back')}</button><b>${MG_TITLE[MG.g]}</b><span class="cgxu">${I('coin')} <span id="cgXu">${fmt(PR.xu)}</span></span></div>`;}
function mgSeat(b,extra){return `<div class="mgseat"><span class="av ${b.me?frameCls():''}" style="--avc:#3a5">${b.me?myAv():b.av}</span><b>${esc(b.name)}</b>${seatLv(b)}<small class="cgbx">${I('coin')}${kxu(b.me?PR.xu:(MG.bxu[b.name]||0))}</small>${extra||''}</div>`;}
function mgBets(list,cur,on,maxOk){return `<div class="cgbets">${list.map(b=>`<button class="${b===cur?'':'alt'}" ${maxOk&&!maxOk(b)?'disabled':''} onclick="${on}(${b})">${kxu(b)}</button>`).join('')}</div>`;}
// kết thúc ván: cập nhật xu/XP/thống kê/nhiệm vụ
const MG_STAT={baucua:'bcua',domino:'dom',xito:'xt',poker:'pk'};
function mgEnd(net,o){o=o||{};const k=MG_STAT[MG.g];PR.xu=Math.max(0,PR.xu+net);bst(k+'Games');const won=net>0;if(won){bst(k+'Win');questEvent(PR,k+'win');}questEvent(PR,'cgplay');(o.stats||[]).forEach(s=>bst(s));try{const st=MG.st||{};const tbl=(st.bots||(st.seats||[]).slice(1)).map(b=>b.name);const n=tbl.length+1;const bust=tbl.filter(nm=>nm!=='Nhà cái'&&(MG.bxu[nm]||0)<=0).length;modeRecord(PR,MG.g,Object.assign({win:won,net,bet:MG.bet,n,full:n>=(MG.g==='domino'?4:6),bust},o.ev||{}));}catch(e){console.warn(e)}
 const xp0=o.xp!=null?o.xp:modeXp(MG.g,net);const up=addXp(PR,xp0,MG.g);const xp=PR._lastXp;xpFloat(xp,up);sfx(won?'cgJingle':net<0?'cgLose':'cgChip');
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
 quit(){/* Cược chỉ là dự kiến đến khi bcOpen() quyết toán; thoát trước khi mở bát không trừ xu. */}
};
const BC_COL=['#ffd84d','#4fc3f7','#ff7ab6','#7dff9a'];
function bcSeatChip(html,o,total){const marker='<span class="bc-seat-chip '+(total?'active':'idle')+'" style="--cc:'+BC_COL[o]+'" title="'+(total?'Đã đặt '+fmt(total)+' xu':'Chưa đặt cược')+'"><span class="bc-seat-chip-dot"></span>'+(total?kxu(total):'—')+'</span>';return html.replace('</span><b>', '</span>'+marker+'<b>');}
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
 o.innerHTML=mgTop()+`<div class="bctbl"><div class="bcseats"><div class="bcs dl" data-o="d" style="--cc:${st.role==='cai'?BC_COL[0]:'#bbb'}">${mgSeat(dealer,'<i class="cgdl">CÁI</i>')}</div>${st.bots.map((b,i)=>`<div class="bcs" data-o="${i+1}" style="--cc:${BC_COL[i+1]}">`+bcSeatChip(mgSeat(b,st.res?`<i class="mgv ${st.res.b[i]>0?'pos':st.res.b[i]<0?'neg':''}">${st.res.b[i]>0?'+':''}${kxu(st.res.b[i])}</i>`:''),i+1,bcTot(b.bets))+'</div>').join('')}</div>${st.role==='con'?`<div class="bcleg"><span class="bcs me" data-o="0" style="--cc:${BC_COL[0]}"><span class="av ${frameCls()}" style="--avc:#3a5">${myAv()}</span><span class="bc-seat-chip ${bcTot(st.bets)?'active':'idle'}" style="--cc:${BC_COL[0]}"><span class="bc-seat-chip-dot"></span>${bcTot(st.bets)?kxu(bcTot(st.bets)):'—'}</span><b>Bạn</b>${seatLv({me:1})}</span></div>`:''}
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
function bcNew(){const st=MG.st;if(!st||st.placing||st.phase==='shake'||st.phase==='open')return;st.phase='bet';st.bets={};st.res=null;st.msg='';st.ledger=null;bcBotBets();bcR();}
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
 const _tb=bcTot(st.bets),_cnt=k=>st.dice.filter(d=>d==k).length;const xp=mgEnd(me,{stats:triple&&me>0?['bcuaTriple']:[],ev:st.role==='cai'?{role:true,dealer:true,sp1:triple&&me>0}:{sp1:triple&&me>0,sp2:Object.keys(st.bets).some(k=>st.bets[k]>0&&_cnt(k)>=2),sp3:_tb>0&&me>=2*_tb,s4:triple&&st.bets[st.dice[0]]>0,s5:Object.keys(st.bets).filter(k=>st.bets[k]>0).length>=6}});st.msg+=` · +${xp} XP`;bcR();bcFlyChips();}
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
 MG.st={seats,hands,bone:t,chain:[],ends:null,starter:s0.i,turn:s0.i,first:s0.t,pass:0,phase:'play',busy:true,bet:MG.bet,msg:`${s0.i===0?'Bạn':seats[s0.i].name} đi trước với [${s0.t[0]}|${s0.t[1]}]`,res:null,sel:null};
 sfx('cgRiffle');dmR();setTimeout(dmStep,900);}
function dmStep(){const st=MG.st;if(!st||st.phase!=='play'||MG.g!=='domino')return;const i=st.turn;const h=st.hands[i];
 const can=()=>h.some(t=>st.first?(t[0]===st.first[0]&&t[1]===st.first[1]):dmFits(t,st.ends).length);
 if(!can()&&i===0){st.need=st.bone.length?'draw':'pass';st.msg=st.bone.length?'Không có quân hợp — bấm Bốc':'Không đi được — bấm Bỏ lượt';dmR();return;}
 if(!can()){if(st.bone.length){h.push(st.bone.pop());sfx('cgSlide');st.msg=`${i===0?'Bạn':st.seats[i].name} bốc nọc`;dmR();return setTimeout(dmStep,i===0?350:420);}
  dmPassT(i);return;}
 if(i===0){st.msg='Lượt bạn: chạm quân để chọn rồi bấm Đánh';dmR();return;}
 if(st._bt===i)return;st._bt=i;setTimeout(()=>{st._bt=null;if(MG.st!==st||st.turn!==i||st.phase!=='play')return;let pick;if(st.first){pick={k:h.findIndex(t=>t[0]===st.first[0]&&t[1]===st.first[1]),side:'L'};}else pick=dmBotPick(h,st.ends);if(!pick||pick.k<0)return dmStep();dmPlay(i,pick.k,pick.side);},650+Math.random()*350);}
function dmPassT(i){const st=MG.st;st.pass++;st.need=null;st.msg=`${i===0?'Bạn':st.seats[i].name} không đi được — qua lượt`;sfx('pass');if(st.pass>=st.seats.length)return dmEnd(dmBlockedWinner(st.hands),true);st.turn=(i+1)%st.seats.length;dmR();setTimeout(dmStep,700);}
function dmDraw(){const st=MG.st;if(!st||st.turn!==0||st.need!=='draw')return;st.hands[0].push(st.bone.pop());st.drew0=1;st.need=null;sfx('cgSlide');st.msg='Bạn bốc nọc';st.sel=null;dmR();setTimeout(dmStep,250);}
function dmPassBtn(){const st=MG.st;if(!st||st.turn!==0||st.need!=='pass')return;dmPassT(0);}
function dmOk(t){const st=MG.st;return st.first?(t[0]===st.first[0]&&t[1]===st.first[1]):dmFits(t,st.ends).length>0;}
function dmGo(side){const st=MG.st;if(!st||st.turn!==0||st.phase!=='play'||st.sel==null)return;const t=st.hands[0][st.sel];if(!dmOk(t))return sfx('bad');
 if(st.first)return dmPlay(0,st.sel,'L');const f=dmFits(t,st.ends);if(side&&f.includes(side))return dmPlay(0,st.sel,side);if(f.length===2&&st.ends[0]!==st.ends[1]){st.choose=true;st.msg='Chọn đầu dây để nối (chạm đầu sáng hoặc nút ◀ ▶)';dmR();return;}dmPlay(0,st.sel,f[0]);}
function dmPlay(i,k,side){const st=MG.st;const t=st.hands[i][k];const r=dmPlace(st.ends,t,side);st.hands[i].splice(k,1);st.ends=r.ends;const piece={a:r.placed[0],b:r.placed[1],dbl:t[0]===t[1],fresh:1};if(i===0)st.lastDbl0=piece.dbl;
 st.chain.forEach(c=>c.fresh=0);if(side==='L')st.chain.unshift(piece);else st.chain.push(piece);st.first=null;st.pass=0;st.sel=null;st.choose=false;st.need=null;sfx('cgThud');setTimeout(()=>sfx('cgSnap'),60);
 st.msg=`${i===0?'Bạn':st.seats[i].name} đánh [${t[0]}|${t[1]}]`;if(!st.hands[i].length)return dmEnd(i,false);st.turn=(i+1)%st.seats.length;dmR();setTimeout(dmStep,500);}
function dmTap(k){const st=MG.st;if(!st||st.phase!=='play'||st.turn!==0)return;st.choose=false;st.sel=st.sel===k?null:k;sfx('tap');dmR();}
function dmEnd(w,blocked){const st=MG.st;st.phase='done';st.busy=false;const u=dmUnit();const raw=dmSettle(st.hands,w,u);
 // trần: người thua chỉ trả tối đa số xu đang có
 const pay=raw.map((v,i)=>{if(v>=0)return v;const have=i===0?PR.xu:(MG.bxu[st.seats[i].name]||0);return -Math.min(-v,have);});const got=-pay.reduce((a,v,i)=>a+(i===w?0:v),0);pay[w]=got;
 st.res=pay;pay.forEach((v,i)=>{if(i>0)MG.bxu[st.seats[i].name]=Math.max(0,(MG.bxu[st.seats[i].name]||0)+v);});
 st.ledger=w===0?st.seats.slice(1).map((s,i)=>[s.name+' ('+dmPips(st.hands[i+1])+' nút)',-pay[i+1]]):[[st.seats[w].name+' thắng · bạn còn '+dmPips(st.hands[0])+' nút',pay[0]]];
 st.msg=(blocked?'Bí bài! ':'')+(w===0?`🎉 Bạn thắng +${fmt(pay[0])} xu`:`${st.seats[w].name} thắng · bạn ${fmt(pay[0])} xu`);
 const _op=st.hands.slice(1).reduce((a,h)=>a+dmPips(h),0);const xp=mgEnd(pay[0],{stats:w===0&&blocked?['domBlockWin']:[],ev:w===0?{role:st.starter===0,sp1:blocked,sp2:_op>=30,sp3:!blocked&&!!st.lastDbl0,s4:!st.drew0,s5:st.chain.length>=20}:{}});st.msg+=` · +${xp} XP`;dmR();}
function dmR(){const o=$('mg');if(!o)return;const st=MG.st;const n=st?st.seats.length:MG.dmN;const opp=st?st.seats.slice(1):MG.dmBots.slice(0,n-1);
 const oppH=opp.map((b,j)=>{const i=j+1;const h=st?st.hands[i]:[];const up=st&&st.phase==='done';return `<div class="dmo ${st&&st.turn===i&&st.phase==='play'?'turn':''}">${mgSeat(b,st&&st.res?`<i class="mgv ${st.res[i]>0?'pos':st.res[i]<0?'neg':''}">${st.res[i]>0?'+':''}${kxu(st.res[i])}</i>`:'')}<div class="dmoh">${up?h.map(t=>dmTileH(t[0],t[1],true,'sm')).join(''):h.map(()=>'<div class="dmt v sm back"></div>').join('')}</div>${up?`<small>${dmPips(h)} nút</small>`:`<small>${h.length} quân</small>`}</div>`;}).join('');
 const chain='';
 const my=st?st.hands[0].map((t,k)=>{const my=st.phase==='play'&&st.turn===0;const ok=my&&dmOk(t);return dmTileH(t[0],t[1],true,(my?(ok?'ok':'bad'):'')+(st.sel===k?' sel':''),`dmTap(${k})`);}).join(''):'';
 o.innerHTML=mgTop()+`<div class="dmtbl"><div class="dmopp n${n}">${oppH}</div><div class="dmchain" id="dmChain"></div><div class="dmme"><span class="av ${frameCls()}" style="--avc:#3a5">${myAv()}</span><b>Bạn</b>${seatLv({me:1})}<small class="cgbx">${I('coin')}${kxu(PR.xu)}</small>${st?`<span class="dmbone">Nọc: ${st.bone.length}</span>`:''}</div><div class="cgmsg">${esc(st?st.msg:'Domino đôi sáu · bốc nọc khi không đi được · thắng: người thua trả '+fmt(dmUnit())+' xu mỗi nút còn lại')}</div>
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
function xtDo(i,a,T){const st=MG.st,b=st.b;if(b.cur!==i)return;const tc=btToCall(b,i);if(a==='check'&&tc)a='call';const _wa=b.allin[i];btAct(b,i,a,T);if(!_wa&&b.allin[i]&&!b.fold[i])setTimeout(()=>allinFX(i),40);const nm=i===0?'Bạn':st.seats[i].name;
 st.msg=nm+' '+({fold:'úp bỏ',check:'xem',call:tc?'theo '+kxu(tc):'xem',raise:'tố '+kxu(b.hi),allin:'TỐ TẤT '+kxu(b.rb[i])})[a];if(a==='allin'){sfx('cgFan');}sfx(a==='fold'?'pass':a==='raise'||a==='allin'?'cgChip':'tap');if(a==='raise'||a==='allin')setTimeout(()=>sfx('cgChip'),120);
 b.cur=btRoundDone(b)?-1:btNextFrom(b,i);xtR();setTimeout(xtStep,350);}
function xtShow(){const st=MG.st,b=st.b;st.phase='done';st.busy=false;while(st.hands.some((h,i)=>!b.fold[i]&&h.length<5)){st.hands.forEach((h,i)=>{if(!b.fold[i]&&h.length<5)h.push(st.deck.pop());});}
 const scores=st.hands.map((h,i)=>b.fold[i]?null:eval5(h,'xt'));const win=awardPots(sidePots(b.contrib,b.fold),scores);st.res=win.map((w,i)=>w-b.contrib[i]);st.scores=scores;
 st.res.forEach((v,i)=>{if(i>0)MG.bxu[st.seats[i].name]=Math.max(0,(MG.bxu[st.seats[i].name]||0)+v);});const me=st.res[0];
 const wi=st.res.indexOf(Math.max(...st.res));const wn=scores[wi]?handName(scores[wi],'xt'):'';st.msg=(wi===0?'🎉 Bạn thắng':st.seats[wi].name+' thắng')+(wn&&btLive(b).length>1?' · '+wn:'')+` · Bạn ${me>=0?'+':''}${fmt(me)} xu`;
 st.ledger=st.seats.map((s,i)=>[(i===0?'Bạn':s.name)+(scores[i]?' · '+handName(scores[i],'xt'):' · bỏ'),st.res[i]]);
 const stats=[];const _r=me>0&&scores[0]?scores[0][0]:-1,_solo=btLive(b).length<=1;const ev={role:me>0&&!!b.allin[0],sp1:_r>=5,sp2:_r>=6,sp3:_r>=7,s4:_r>=8,s5:me>0&&_solo};if(me>0&&scores[0]&&scores[0][0]>=8)stats.push('xtSF');if(me>0&&scores[0]&&scores[0][0]>=7)stats.push('xtBig');const xp=mgEnd(me,{stats,ev});st.msg+=` · +${xp} XP`;sfx('cgSnap');xtR();}
function xtR(){const o=$('mg');if(!o)return;const st=MG.st;const n=st?st.seats.length:MG.xtN;const seats=st?st.seats:[{name:'Bạn',av:myAv(),me:1}].concat(MG.xtBots.slice(0,n-1));const fr=st&&st.fresh;if(st)st.fresh=0;
 const seat=(s,i)=>{const b=st&&st.b;const h=st?st.hands[i]:[];const sd=st&&st.phase==='done';const cards=h.map((c,k)=>xtCard(c,i===0||k>0||(sd&&!b.fold[i]),k,(fr&&k===h.length-1?'cgnew':'')+(k===0&&i===0&&!sd?' tay':''))).join('');
  const lab=st&&(i===0||sd)&&h.length&&!b.fold[i]?`<div class="cgsc">${sd?handName(eval5(h.concat(h.length<5?[]:[]).slice(0,5),'xt'),'xt'):handName(evalPartial(h),'xt')}</div>`:'';
  return `<div class="pks ${i===0?'me':''} ${st&&st.phase==='bet'&&b.cur===i?'turn':''} ${b&&b.fold[i]?'fold':''} ${b&&b.allin[i]&&!b.fold[i]&&!sd?'allin':''}" data-i="${i}">${mgSeat(i===0?{name:'Bạn',av:myAv(),me:1}:s,st?(sd?'':btSeatLab(b,i))+(st.res?`<i class="mgv ${st.res[i]>0?'pos':st.res[i]<0?'neg':''}">${st.res[i]>0?'+':''}${kxu(st.res[i])}</i>`:''):'')}<div class="pkh">${cards}</div>${lab}</div>`;};
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
function pkDo(i,a,T){const st=MG.st,b=st.b;if(b.cur!==i)return;const tc=btToCall(b,i);if(a==='check'&&tc)a='call';const _wa=b.allin[i];btAct(b,i,a,T);if(!_wa&&b.allin[i]&&!b.fold[i])setTimeout(()=>allinFX(i),40);const nm=i===0?'Bạn':st.seats[i].name;
 st.msg=nm+' '+({fold:'bỏ bài',check:'xem',call:tc?'theo '+kxu(Math.min(tc,b.rb[i])):'xem',raise:'tố lên '+kxu(b.hi),allin:'tất tay '+kxu(b.rb[i])})[a];sfx(a==='fold'?'pass':a==='raise'||a==='allin'?'cgChip':'tap');
 b.cur=btRoundDone(b)?-1:btNextFrom(b,i);pkR();setTimeout(pkStep,350);}
function pkShow(){const st=MG.st,b=st.b;st.phase='done';st.busy=false;const live=btLive(b);if(live.length>1)while(st.board.length<5)st.board.push(st.deck.pop());
 const scores=st.hands.map((h,i)=>b.fold[i]?null:(live.length>1?best5(h.concat(st.board),'pk').sc:[0]));const win=awardPots(sidePots(b.contrib,b.fold),scores);st.res=win.map((w,i)=>w-b.contrib[i]);st.shown=live.length>1?b.fold.map(f=>!f):b.fold.map(()=>false);st.shown[0]=true;
 st.res.forEach((v,i)=>{if(i>0)MG.bxu[st.seats[i].name]=Math.max(0,(MG.bxu[st.seats[i].name]||0)+v);});const me=st.res[0];const wi=st.res.indexOf(Math.max(...st.res));
 st.msg=(wi===0?'🎉 Bạn thắng':st.seats[wi].name+' thắng')+(live.length>1&&scores[wi]?' · '+handName(scores[wi],'pk'):' (mọi người bỏ)')+` · Bạn ${me>=0?'+':''}${fmt(me)}`;
 st.ledger=st.seats.map((s,i)=>[(i===0?'Bạn':s.name)+(scores[i]&&live.length>1?' · '+handName(scores[i],'pk'):b.fold[i]?' · bỏ':''),st.res[i]]).filter(l=>l[1]);
 const stats=[];const _r=me>0&&scores[0]&&live.length>1?scores[0][0]:-1;const ev={role:me>0&&!!b.allin[0],sp1:_r>=4,sp2:_r>=6,sp3:_r>=7,s4:_r>=8,s5:me>0&&live.length<=1};if(me>0&&scores[0]&&scores[0][0]>=8)stats.push('pkSF');if(me>0&&b.allin[0])stats.push('pkAllin');const xp=mgEnd(me,{stats,ev});st.msg+=` · +${xp} XP`;sfx('cgSnap');pkR();}
function pkR(){const o=$('mg');if(!o)return;const st=MG.st;const n=st?st.seats.length:MG.pkN;const seats=st?st.seats:[{name:'Bạn',av:myAv(),me:1}].concat(MG.pkBots.slice(0,n-1));const fr=st&&st.fresh;if(st)st.fresh=0;const sd=st&&st.phase==='done';
 const seat=(s,i)=>{const b=st&&st.b;const h=st?st.hands[i]:[];const up=i===0||(sd&&st.shown[i]);const cards=h.map((c,k)=>cgCard(c,up,k)).join('');
  const tag=st?(i===st.D?'<i class="pkdb">D</i>':i===st.sb?'<i class="pkdb sb">SB</i>':i===st.bbi?'<i class="pkdb bb">BB</i>':''):'';
  const lab=st&&up&&!b.fold[i]&&(st.board.length||sd)?`<div class="cgsc">${handName(best5(h.concat(st.board),'pk').sc,'pk')}</div>`:'';
  return `<div class="pks ${i===0?'me':''} ${st&&st.phase==='bet'&&b.cur===i?'turn':''} ${b&&b.fold[i]?'fold':''} ${b&&b.allin[i]&&!b.fold[i]&&!sd?'allin':''}" data-i="${i}">${tag}${mgSeat(i===0?{name:'Bạn',av:myAv(),me:1}:s,st?(sd?'':btSeatLab(b,i))+(st.res?`<i class="mgv ${st.res[i]>0?'pos':st.res[i]<0?'neg':''}">${st.res[i]>0?'+':''}${kxu(st.res[i])}</i>`:`<small class="pkstk">${I('coin')}${kxu(b.stack[i])}</small>`):'')}<div class="pkh">${cards}</div>${lab}</div>`;};
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

// ===================== Gói trợ cấp (chỉ khi hết xu, 1 lần/ngày, 1000 × cấp) =====================
function allowLeft(){const d=new Date();const n=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);const s=Math.max(0,Math.floor((n-d)/1000));return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s%3600/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function allowState(){if(PR.allowDay===dayKey())return 'done';if((PR.xu|0)!==0)return 'lock';return 'ok';}
function allowTileHTML(){const s=allowState();return `<span class="alic">💰</span><span>Gói trợ cấp</span><small class="altl">${s==='ok'?'+'+kxu(allowanceAmt(PR))+' xu':s==='done'?'Làm mới sau '+allowLeft():'Chỉ nhận khi hết xu'}</small>`;}
const _rh60=renderHome;renderHome=function(){_rh60.apply(this,arguments);try{const t=document.querySelector('#home .tiles');if(!t)return;let b=$('allowTile');if(!b){b=document.createElement('button');b.id='allowTile';b.onclick=()=>openAllowance();t.appendChild(b);}b.className='alt tile allow '+allowState();b.innerHTML=allowTileHTML();}catch(e){}};
setInterval(()=>{const b=$('allowTile');if(b&&document.body.classList.contains('athome')){b.className='alt tile allow '+allowState();b.innerHTML=allowTileHTML();}},1000);
function openAllowance(){const s=allowState();const amt=allowanceAmt(PR);
 modal(`<h3>💰 Gói trợ cấp</h3><div class="alwbig">${I('coin')} ${fmt(amt)} xu</div><p class="small" style="text-align:center">1.000 xu × cấp ${levelInfo(PR.xp).level}. Chỉ nhận được khi số dư <b>đúng 0 xu</b>, tối đa 1 lần mỗi ngày.</p>
 ${s==='ok'?`<button class="cgbig" id="alwGo" onclick="doAllowance()">Nhận ${fmt(amt)} xu</button>`:s==='done'?`<p style="text-align:center">Hôm nay bạn đã nhận rồi.<br>Làm mới sau <b id="alwCd">${allowLeft()}</b></p>`:`<p style="text-align:center">🔒 Chỉ nhận khi hết xu (hiện có ${fmt(PR.xu)} xu)</p>`}`);
 if(s==='done'){const iv=setInterval(()=>{const e=$('alwCd');if(!e)return clearInterval(iv);e.textContent=allowLeft();},1000);}}
let _alwBusy=false;
async function doAllowance(){if(_alwBusy)return;_alwBusy=true;const btn=$('alwGo');if(btn){btn.disabled=true;btn.textContent='Đang kiểm tra…';}
 try{// chống nhận 2 lần trên nhiều máy: đọc bản lưu đám mây trước
  if(typeof SB!=='undefined'&&SB&&typeof USER!=='undefined'&&USER&&navigator.onLine!==false){try{const{data}=await SB.from('tlmn_saves').select('data').eq('user_id',USER.id).maybeSingle();const cd=data&&data.data;if(cd&&cd.allowDay&&(!PR.allowDay||cd.allowDay>PR.allowDay))PR.allowDay=cd.allowDay;}catch(e){}}
  const got=claimAllowance(PR);if(!got){saveP();closeModal();toast(PR.allowDay===dayKey()?'Hôm nay bạn đã nhận trợ cấp rồi':'Chỉ nhận khi hết xu');return;}
  saveP();try{if(typeof cloudPush==='function'&&USER)await cloudPush(true);}catch(e){}
  const from=btn?btn.getBoundingClientRect():null;closeModal();sfx('cgJingle');try{coinFly(from||{left:innerWidth/2-40,top:innerHeight/2,width:80,height:40},got);}catch(e){}
  try{const r=xuAnchor();floatText(r.left,r.top+r.height+10,'+'+fmt(got)+' xu','gain');}catch(e){}try{animCoin&&animCoin(got);}catch(e){}toast(`💰 Nhận gói trợ cấp +${fmt(got)} xu`);try{renderHome();}catch(e){}
 }finally{_alwBusy=false;}}
// nhắc khi vừa hết xu sau ván
let _alwAsked='';
const _sp60=saveP;saveP=function(){const r=_sp60.apply(this,arguments);try{if(canAllowance(PR)&&_alwAsked!==dayKey()){_alwAsked=dayKey();let n=0;const t=setInterval(()=>{n++;if(n>60)return clearInterval(t);if(modalOpen()||document.getElementById('badgeFX')||(typeof FIN!=='undefined'&&FIN.active))return;if(G&&!G.over&&!document.body.classList.contains('athome')&&!document.body.classList.contains('cgon'))return;if(MG.st&&MG.st.busy)return;clearInterval(t);if(canAllowance(PR))openAllowance();},1000);}}catch(e){}return r;};

// ===================== v1.48.2: lá bài Xì tố lớn, góc to, chất SVG
const XT_SUIT={0:'M30 6C22 18 8 26 8 38c0 8 9 12 16 6-1 6-4 10-8 12h28c-4-2-7-6-8-12 7 6 16 2 16-6C52 26 38 18 30 6z',1:'M30 6a10 10 0 0 0-9 15 10 10 0 1 0 6 18c-1 6-4 9-8 11h22c-4-2-7-5-8-11a10 10 0 1 0 6-18 10 10 0 0 0-9-15z',2:'M30 4L50 30 30 56 10 30z',3:'M30 54C14 40 6 32 6 21 6 12 13 6 20 6c5 0 8 3 10 7 2-4 5-7 10-7 7 0 14 6 14 15 0 11-8 19-24 33z'};
const XT_COL=['#111','#111','#e04a00','#d0102a'];
function xtSuit(si,x,y,sz){return `<path d="${XT_SUIT[si]}" fill="${XT_COL[si]}" transform="translate(${x},${y}) scale(${sz/60})"/>`;}
function xtCard(c,up,k,cls){if(!up)return cgCard(c,false,k,cls);const r=RANKS[rk(c)],si=st(c),col=XT_COL[si];const fs=r==='10'?17:21;
 return `<div class="card cgc xtc ${si>=2?'red':''} ${cls||''}" data-c="${c}" style="--d:${k||0}"><svg viewBox="0 0 60 84" preserveAspectRatio="none"><rect x="0.5" y="0.5" width="59" height="83" rx="5" fill="none" stroke="#0003"/>
 <text x="${r==='10'?3:5}" y="20" font-size="${fs}" font-weight="900" font-family="Arial,Helvetica,sans-serif" fill="${col}" letter-spacing="${r==='10'?-1.5:0}">${r}</text>${xtSuit(si,4,23,15)}${xtSuit(si,17,30,36)}
 <g transform="rotate(180 30 42)"><text x="${r==='10'?3:5}" y="20" font-size="${fs*0.8}" font-weight="900" font-family="Arial,Helvetica,sans-serif" fill="${col}">${r}</text></g></svg></div>`;}
// ===================== v1.48: cấp/danh hiệu/khung trên ghế mọi chế độ
function botLvFor(n){let h=0;for(const c of String(n||''))h=(h*31+c.charCodeAt(0))>>>0;return 3+h%43;}
function seatLv(s){if(!s||(!s.me&&(s.name==='Nhà cái'||!s.name)))return '';if(s.me){const L=levelInfo(PR.xp||0);let t;try{t=currentTitle(PR);}catch(e){t=titleForLevel(L.level);}
 return `<span class="slv me"><span class="lvb">${L.level}</span>${titleHTML(t)}</span><span class="sxp"><i style="width:${Math.round(100*L.cur/L.need)}%"></i></span>`;}
 const lv=s.lv||botLvFor(s.name);return `<span class="slv"><span class="lvb">${lv}</span>${titleHTML(titleForLevel(lv))}</span>`;}
function xpFloat(xp,up){try{const L=levelInfo(PR.xp);toast(`⭐ +${xp} XP · Cấp ${L.level} (${L.cur}/${L.need})`+(up&&up.length?' · Lên cấp!':''));}catch(e){}}
// ===================== v1.48: Huy hiệu theo chế độ =====================
const BG_TABS=[['mn','Miền Nam','🂡'],['demla','Đếm lá','🔢'],['3cao','3 Cào','🃏'],['xidach','Xì dách','🂱'],['baucua','Bầu cua','🦀'],['domino','Domino','🁫'],['xito','Xì tố','🂡'],['poker','Poker','♠️'],['chung','Chung','⭐']];
let bgTab=null,bgFil='all';
openBadges=function(t,f){if(t)bgTab=t;if(f)bgFil=f;if(!bgTab){const mm={mn:'mn',demla:'demla','3cao':'3cao',xidach:'xidach',baucua:'baucua',domino:'domino',xito:'xito',poker:'poker'};bgTab=mm[typeof MODE!=='undefined'?MODE:'mn']||'mn';}
 const inTab=BADGES.filter(b=>badgeMode(b)===bgTab);const has=b=>!!PR.badges[b.id];
 const list=inTab.filter(b=>bgFil==='all'||(bgFil==='on'?has(b):bgFil==='off'?!has(b)&&!b.secret:b.secret)).sort((a,b)=>(has(b)-has(a))||((a.secret?1:0)-(b.secret?1:0)));
 const n=Object.keys(PR.badges).filter(k=>BADGES.find(b=>b.id===k)).length,tn=inTab.filter(has).length;
 const cnt=k=>{const l=BADGES.filter(b=>badgeMode(b)===k);return l.filter(has).length+'/'+l.length;};
 modal(`<h3>${I('medal')} Huy hiệu (${n}/${BADGES.length})</h3><div class="bgtabs" id="bgTabs">${BG_TABS.map(([k,t,ic])=>`<button class="${k===bgTab?'on':''}" onclick="openBadges('${k}')"><span>${ic}</span>${t}<small>${cnt(k)}</small></button>`).join('')}</div>
 <div class="bgfil">${[['all','Tất cả'],['on','Đã mở'],['off','Chưa mở'],['sec','Bí mật']].map(([k,t])=>`<button class="${k===bgFil?'on':''}" onclick="openBadges(null,'${k}')">${t}</button>`).join('')}<span class="bgsum">${tn}/${inTab.length}</span></div><div class="grid bggrid">`+(list.length?list.map(b=>{const u=has(b),T=BADGE_TIER[b.tier||1];
  if(b.secret&&!u)return `<div class="badge lock secret"><div class="ic">❓</div><span class="tier">Bí mật</span><b>???</b><br><small>Huy hiệu bí mật</small></div>`;
  const pr=!u&&b.k&&b.goal?Math.min(1,(PR.stats[b.k]||0)/b.goal):null;
  return `<div class="badge ${u?'':'lock'} t${b.legend?4:b.tier||1}" style="--tc:${b.legend?'#ff7ae0':T.col}"><div class="ic">${u?b.icon:I('lock')}</div><span class="tier">${b.secret?'Bí mật':b.legend?'Huyền thoại':T.name}</span><b>${esc(b.name.replace(/^[^:]+: /,''))}</b><br>${esc(b.desc)}<br>${I('coin')}${fmt(b.xu)}${pr!=null?`<div class="bprog"><i style="width:${Math.round(pr*100)}%"></i></div><small>${fmt(Math.min(PR.stats[b.k]||0,b.goal))}/${fmt(b.goal)}</small>`:''}</div>`;}).join(''):'<p class="small">Chưa có huy hiệu nào ở mục này</p>')+'</div>');
 setTimeout(()=>{const o=document.querySelector('#bgTabs .on');if(o)o.scrollIntoView({inline:'center',block:'nearest'});},0);};

// ===================== v1.48.3: hiệu ứng TỐ TẤT / TẤT TAY =====================
function allinSnd(){try{const a=ac();if(!a)return;for(let k=0;k<16;k++){const t=0.7*(1-Math.pow(1-k/16,1.6));noise(.06,.12+.25*k/16,t,180);}
 noise(.35,.9,.72,0);tone(70,.9,'sine',.55,.72,28);tone(110,.5,'triangle',.25,.72,50);
 for(let k=0;k<26;k++)noise(.03,.18+Math.random()*.12,.8+k*.022+Math.random()*.012,3000+Math.random()*3000);tone(2400,.08,'square',.05,.85);tone(3100,.08,'square',.05,1.05);}catch(e){}}
function allinFX(i){const st=MG.st;if(!st)return;const mg=$('mg');if(!mg)return;const xt=MG.g==='xito';const nm=i===0?'Bạn':st.seats[i].name;
 const seat=mg.querySelector(`.pks[data-i="${i}"]`),pot=mg.querySelector('.pkpot');const tb=(mg.querySelector('.pktbl')||mg).getBoundingClientRect();
 allinSnd();const fx=document.createElement('div');fx.className='aifx'+(RM?' rm':'');fx.innerHTML=`<div class="aidim"></div><div class="aiban" style="top:${Math.round(tb.top+tb.height*0.42)}px"><b>${xt?'TỐ TẤT!':'TẤT TAY!'}</b><small>${esc(nm)}</small></div>`;document.body.appendChild(fx);setTimeout(()=>fx.remove(),1900);
 if(!RM)try{mg.animate([{transform:'translate(0,0)'},{transform:'translate(-6px,3px)'},{transform:'translate(5px,-4px)'},{transform:'translate(-4px,-2px)'},{transform:'translate(3px,4px)'},{transform:'translate(0,0)'}],{duration:420,delay:700,easing:'ease-out'});}catch(e){}
 if(seat&&pot){const a=seat.getBoundingClientRect(),z=pot.getBoundingClientRect();const n=RM?6:22;for(let k=0;k<n;k++){const c=document.createElement('span');c.className='aichip';c.innerHTML=I('coin');const x0=a.left+a.width/2+(Math.random()*40-20),y0=a.top+a.height/2+(Math.random()*20-10),x1=z.left+z.width/2+(Math.random()*36-18),y1=z.top+z.height/2+(Math.random()*14-7);
  c.style.left=x0+'px';c.style.top=y0+'px';document.body.appendChild(c);const dx=x1-x0,dy=y1-y0;const an=c.animate(RM?[{opacity:0},{opacity:1,offset:.3},{transform:`translate(${dx}px,${dy}px)`,opacity:1}]:[{transform:'translate(0,0) scale(.6)',opacity:0},{transform:`translate(${dx*.5}px,${dy*.5-70-Math.random()*40}px) scale(1.15) rotate(${Math.random()*360}deg)`,opacity:1,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(.8) rotate(${Math.random()*720}deg)`,opacity:1}],{duration:RM?400:620,delay:(RM?650:760)+k*(RM?40:28),easing:'cubic-bezier(.3,.6,.4,1)',fill:'forwards'});an.onfinish=()=>c.remove();setTimeout(()=>c.remove(),2600);}}
 setTimeout(()=>{const p=mg.querySelector('.pkpot');if(p&&!RM)try{p.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:350});}catch(e){}},1150);}

// ===================== v1.49: Thu nhập thụ động =====================
function pasRateH(){return passiveRate(PR)*3600;}
function pasFmt(v){return v.toLocaleString('vi-VN',{minimumFractionDigits:3,maximumFractionDigits:3});}
function pasCapped(){const ps=passiveInit(PR);return Date.now()-ps.last>=PASSIVE_CAP_MS;}
function pasHTML(){const v=passivePending(PR);return `<span class="alic">⏳</span><span class="pasm"><span>Thu nhập thụ động</span><small><i class="pasr">+${fmt(Math.round(pasRateH()*100)/100)} xu/giờ</i> · <i id="pasNote">${pasCapped()?'Đã đầy 24 giờ — nhận ngay!':'<span class="tail">cả khi tắt app, </span>tối đa 24 giờ'}</i></small></span><b class="pasv" id="pasVal">${pasFmt(v)}</b><button class="pasgo" id="pasGo" ${v<1?'disabled':''} onclick="event.stopPropagation();doPassive()">Nhận</button>`;}
const _rh49=renderHome;renderHome=function(){_rh49.apply(this,arguments);try{if(!PR.passive){passiveInit(PR);saveP();}const t=document.querySelector('#home .tiles');if(!t)return;let b=$('pasTile');if(!b){b=document.createElement('div');b.id='pasTile';t.appendChild(b);}b.className='alt tile pas'+(pasCapped()?' full':'')+(assetBonus(PR)?' hasa':'');b.innerHTML=pasHTML();}catch(e){}};
setInterval(()=>{try{const v=$('pasVal');if(!v)return;const x=passivePending(PR);v.textContent=pasFmt(x);const g=$('pasGo');if(g)g.disabled=x<1||_pasBusy;const n=$('pasNote');const c=pasCapped();if(n)n.innerHTML=c?'Đã đầy 24 giờ — nhận ngay!':'<span class="tail">cả khi tắt app, </span>tối đa 24 giờ';const t=$('pasTile');if(t)t.classList.toggle('full',c);}catch(e){}},200);
let _pasBusy=false;
async function doPassive(){if(_pasBusy)return;_pasBusy=true;const btn=$('pasGo');if(btn){btn.disabled=true;btn.textContent='…';}
 try{if(typeof SB!=='undefined'&&SB&&typeof USER!=='undefined'&&USER&&navigator.onLine!==false){try{const{data}=await SB.from('tlmn_saves').select('data').eq('user_id',USER.id).maybeSingle();const cp=data&&data.data&&data.data.profile&&data.data.profile.passive;passiveInit(PR);if(cp&&typeof cp.last==='number'&&cp.last>PR.passive.last)PR.passive=Object.assign({},cp);}catch(e){}}
  const from=btn?btn.getBoundingClientRect():null;const got=passiveClaim(PR);saveP();
  if(got>0){sfx('cgChip');try{coinFly(from||{left:innerWidth/2-40,top:innerHeight/2,width:80,height:40},got);}catch(e){}try{const r=xuAnchor();floatText(r.left,r.top+r.height+10,'+'+fmt(got)+' xu','gain');}catch(e){}try{animCoin&&animCoin(got);}catch(e){}toast(`⏳ Nhận thu nhập thụ động +${fmt(got)} xu`);}
  else toast('Chưa đủ 1 xu để nhận');
  try{if(typeof cloudPush==='function'&&USER)cloudPush(true);}catch(e){}
 }finally{_pasBusy=false;try{renderHome();}catch(e){}}}

// ===================== v1.49: Tài sản (tăng thu nhập thụ động) =====================
const ASSET_SVG={
 quan:`<svg viewBox="0 0 64 64"><defs><linearGradient id="aq1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a65"/><stop offset="1" stop-color="#d84315"/></linearGradient></defs><rect x="10" y="30" width="44" height="26" rx="3" fill="#8d6e63"/><path d="M6 30h52l-6-12H12z" fill="url(#aq1)"/><path d="M6 30h52" stroke="#fff8" stroke-width="2" stroke-dasharray="6 4"/><rect x="16" y="36" width="14" height="20" fill="#5d4037"/><rect x="34" y="36" width="14" height="10" rx="1" fill="#b3e5fc"/><circle cx="46" cy="52" r="4" fill="#fff"/><path d="M43 50h6v4a3 3 0 0 1-6 0z" fill="#6d4c41"/><path d="M45 44q2-3 0-6M48 44q2-3 0-6" stroke="#fff" stroke-width="1.2" fill="none" opacity=".8"/></svg>`,
 taphoa:`<svg viewBox="0 0 64 64"><defs><linearGradient id="at1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#66bb6a"/><stop offset="1" stop-color="#2e7d32"/></linearGradient></defs><rect x="8" y="22" width="48" height="34" rx="3" fill="#ffe0b2"/><rect x="6" y="14" width="52" height="10" rx="2" fill="url(#at1)"/><text x="32" y="22" font-size="7" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">TẠP HÓA</text><path d="M8 24h48v6c-4 3-8 3-12 0-4 3-8 3-12 0-4 3-8 3-12 0-4 3-8 3-12 0z" fill="#ef5350"/><rect x="13" y="34" width="18" height="14" fill="#90caf9"/><rect x="15" y="40" width="4" height="8" fill="#ffca28"/><rect x="21" y="38" width="4" height="10" fill="#ef5350"/><rect x="27" y="42" width="3" height="6" fill="#66bb6a"/><rect x="36" y="34" width="14" height="22" fill="#795548"/><circle cx="47" cy="45" r="1.3" fill="#ffd54f"/></svg>`,
 xuongmay:`<svg viewBox="0 0 64 64"><defs><linearGradient id="ax1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ba68c8"/><stop offset="1" stop-color="#6a1b9a"/></linearGradient></defs><path d="M6 56V28l12-8v8l12-8v8l12-8v8l16-8v36z" fill="url(#ax1)"/><rect x="10" y="38" width="8" height="8" fill="#e1bee7"/><rect x="22" y="38" width="8" height="8" fill="#e1bee7"/><rect x="34" y="38" width="8" height="8" fill="#e1bee7"/><rect x="46" y="38" width="8" height="8" fill="#e1bee7"/><path d="M40 8l6 0 3 4 6 2-2 8-4-1v9H39v-9l-4 1-2-8 6-2z" fill="#ffca28" stroke="#f57f17" stroke-width="1"/><circle cx="20" cy="52" r="3" fill="#ffd54f"/><path d="M20 52l10-6" stroke="#ffd54f" stroke-width="1.5"/></svg>`,
 nhamay:`<svg viewBox="0 0 64 64"><defs><linearGradient id="an1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#78909c"/><stop offset="1" stop-color="#37474f"/></linearGradient></defs><circle cx="16" cy="8" r="4" fill="#cfd8dc" opacity=".8"/><circle cx="22" cy="5" r="3" fill="#eceff1" opacity=".7"/><circle cx="34" cy="10" r="3.5" fill="#cfd8dc" opacity=".7"/><rect x="12" y="12" width="7" height="22" fill="#b71c1c"/><rect x="12" y="16" width="7" height="3" fill="#fff"/><rect x="30" y="16" width="7" height="18" fill="#b71c1c"/><rect x="30" y="20" width="7" height="3" fill="#fff"/><path d="M4 58V32l14 8v-8l14 8v-8l14 8v-8l14 8v18z" fill="url(#an1)"/><rect x="10" y="44" width="8" height="6" fill="#ffd54f"/><rect x="24" y="44" width="8" height="6" fill="#ffd54f"/><rect x="38" y="44" width="8" height="6" fill="#ffd54f"/><rect x="50" y="46" width="6" height="12" fill="#263238"/></svg>`,
 tapdoan:`<svg viewBox="0 0 64 64"><defs><linearGradient id="ad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4fc3f7"/><stop offset="1" stop-color="#0d47a1"/></linearGradient><linearGradient id="ad2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe082"/><stop offset="1" stop-color="#ff8f00"/></linearGradient></defs><rect x="6" y="30" width="14" height="28" fill="#455a64"/><rect x="44" y="24" width="14" height="34" fill="#546e7a"/><path d="M22 58V14l10-8 10 8v44z" fill="url(#ad1)"/><path d="M32 6v52" stroke="#ffffff55"/><g fill="#e1f5fe" opacity=".85"><rect x="25" y="18" width="4" height="4"/><rect x="35" y="18" width="4" height="4"/><rect x="25" y="26" width="4" height="4"/><rect x="35" y="26" width="4" height="4"/><rect x="25" y="34" width="4" height="4"/><rect x="35" y="34" width="4" height="4"/><rect x="25" y="42" width="4" height="4"/><rect x="35" y="42" width="4" height="4"/></g><rect x="28" y="50" width="8" height="8" fill="#263238"/><circle cx="32" cy="12" r="3" fill="url(#ad2)"/><path d="M32 2v4" stroke="#ff8f00" stroke-width="1.5"/><g fill="#cfd8dc"><rect x="9" y="34" width="3" height="3"/><rect x="14" y="34" width="3" height="3"/><rect x="9" y="40" width="3" height="3"/><rect x="14" y="40" width="3" height="3"/><rect x="47" y="28" width="3" height="3"/><rect x="52" y="28" width="3" height="3"/><rect x="47" y="34" width="3" height="3"/><rect x="52" y="34" width="3" height="3"/></g></svg>`};

// --- icon phương tiện & mua sắm
const _sv=(b)=>`<svg viewBox="0 0 64 64">${b}</svg>`;
Object.assign(ASSET_SVG,{
 xedap:_sv(`<circle cx="16" cy="42" r="11" fill="none" stroke="#263238" stroke-width="4"/><circle cx="48" cy="42" r="11" fill="none" stroke="#263238" stroke-width="4"/><circle cx="16" cy="42" r="2" fill="#90a4ae"/><circle cx="48" cy="42" r="2" fill="#90a4ae"/><path d="M16 42l10-16h16l6 16M26 26l6 16h10M32 42l-4-22h-6M40 18h6l-4 8" stroke="#e53935" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
 xemay:_sv(`<circle cx="15" cy="44" r="9" fill="#263238"/><circle cx="49" cy="44" r="9" fill="#263238"/><circle cx="15" cy="44" r="3.5" fill="#b0bec5"/><circle cx="49" cy="44" r="3.5" fill="#b0bec5"/><path d="M15 44l10-14h14l10 14" stroke="#455a64" stroke-width="3" fill="none"/><path d="M22 30h22c3 0 5 2 5 5v3H24z" fill="#1e88e5"/><rect x="24" y="24" width="14" height="5" rx="2.5" fill="#263238"/><path d="M44 26l6-6h4" stroke="#455a64" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="53" cy="28" r="2.5" fill="#ffee58"/>`),
 xega:_sv(`<circle cx="16" cy="46" r="8" fill="#263238"/><circle cx="48" cy="46" r="8" fill="#263238"/><circle cx="16" cy="46" r="3" fill="#cfd8dc"/><circle cx="48" cy="46" r="3" fill="#cfd8dc"/><path d="M8 44c0-8 6-12 14-12h14l4-14h6l-3 14c6 2 10 6 10 12z" fill="#ec407a"/><path d="M20 30h16l-2-6H22z" fill="#5d4037"/><path d="M40 18h8" stroke="#455a64" stroke-width="3" stroke-linecap="round"/><path d="M12 40h20" stroke="#fff6" stroke-width="2"/>`),
 oto:_sv(`<path d="M6 44v-8c0-3 2-5 5-5l7-9c2-2 4-3 7-3h14c3 0 5 1 7 3l7 9c3 0 5 2 5 5v8z" fill="#fbc02d"/><path d="M20 24h10v8H14zM34 24h9l6 8H34z" fill="#b3e5fc"/><circle cx="18" cy="46" r="7" fill="#263238"/><circle cx="46" cy="46" r="7" fill="#263238"/><circle cx="18" cy="46" r="2.8" fill="#cfd8dc"/><circle cx="46" cy="46" r="2.8" fill="#cfd8dc"/><rect x="52" y="36" width="5" height="3" rx="1" fill="#fff59d"/><rect x="7" y="36" width="4" height="3" rx="1" fill="#e53935"/>`),
 duthuyen:_sv(`<path d="M4 44h56l-8 10H12z" fill="#eceff1" stroke="#90a4ae"/><path d="M12 44l6-10h24l8 10z" fill="#fff"/><path d="M20 34l4-8h12l4 8z" fill="#e3f2fd"/><g fill="#1565c0"><rect x="22" y="38" width="4" height="3" rx="1"/><rect x="29" y="38" width="4" height="3" rx="1"/><rect x="36" y="38" width="4" height="3" rx="1"/></g><path d="M30 26V12" stroke="#78909c" stroke-width="2"/><path d="M30 13l10 4-10 3z" fill="#e53935"/><path d="M2 58q8-4 15 0t15 0 15 0 15 0" stroke="#4fc3f7" stroke-width="3" fill="none"/>`),
 ao1:_sv(`<path d="M22 10l-14 8 6 10 6-3v29h24V25l6 3 6-10-14-8c-2 5-6 7-10 7s-8-2-10-7z" fill="#42a5f5"/><circle cx="32" cy="36" r="5" fill="#fff9"/>`),
 ao2:_sv(`<path d="M22 10l-14 8 6 10 6-3v29h24V25l6 3 6-10-14-8-10 10z" fill="#f8bbd0"/><path d="M32 20v34" stroke="#ad1457" stroke-width="1"/><g fill="#ad1457"><circle cx="32" cy="28" r="1.3"/><circle cx="32" cy="36" r="1.3"/><circle cx="32" cy="44" r="1.3"/></g><path d="M22 10l10 10 10-10" fill="none" stroke="#fff" stroke-width="2"/>`),
 ao3:_sv(`<path d="M22 8l-14 10 4 36h40l4-36-14-10-10 14z" fill="#263238"/><path d="M26 10l6 12 6-12" fill="#fff"/><path d="M30 22l2-4 2 4-2 14z" fill="#c62828"/><path d="M22 8l10 26M42 8L32 34" stroke="#455a64" stroke-width="2" fill="none"/><rect x="40" y="38" width="6" height="2" fill="#ffd54f"/>`),
 tt1:_sv(`<circle cx="32" cy="38" r="15" fill="none" stroke="#cfd8dc" stroke-width="6"/><circle cx="32" cy="38" r="15" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 8"/><path d="M26 18l6-8 6 8-6 6z" fill="#80deea" stroke="#fff"/>`),
 tt2:_sv(`<path d="M12 10q20 40 40 0" fill="none" stroke="#ffca28" stroke-width="3" stroke-dasharray="3 1.5"/><path d="M32 30l8 10-8 14-8-14z" fill="#ffb300" stroke="#fff59d" stroke-width="1.5"/><circle cx="32" cy="42" r="3" fill="#e53935"/>`),
 tt3:_sv(`<path d="M14 22l8-10h20l8 10-18 30z" fill="#b2ebf2" stroke="#fff" stroke-width="1.5"/><path d="M14 22h36M22 12l4 10 6-10 6 10 4-10M26 22l6 30 6-30" stroke="#4dd0e1" stroke-width="1.2" fill="none"/><path d="M50 8l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="#fff"/>`),
 pk1:_sv(`<path d="M6 26h52" stroke="#212121" stroke-width="3"/><path d="M8 26c0 10 4 14 11 14s11-6 11-14zM34 26c0 8 4 14 11 14s11-4 11-14z" fill="#37474f"/><path d="M12 29l6 6M38 29l6 6" stroke="#fff5" stroke-width="2"/>`),
 pk2:_sv(`<rect x="24" y="4" width="16" height="14" rx="3" fill="#8d6e63"/><rect x="24" y="46" width="16" height="14" rx="3" fill="#8d6e63"/><circle cx="32" cy="32" r="16" fill="#ffd54f" stroke="#ff8f00" stroke-width="3"/><circle cx="32" cy="32" r="12" fill="#fffde7"/><path d="M32 22v10l7 4" stroke="#263238" stroke-width="2.5" stroke-linecap="round" fill="none"/>`),
 pk3:_sv(`<path d="M22 22q0-12 10-12t10 12" fill="none" stroke="#5d4037" stroke-width="3"/><path d="M12 22h40l-4 32H16z" fill="#a1887f"/><path d="M12 22h40l-1 8H13z" fill="#6d4c41"/><rect x="28" y="32" width="8" height="6" rx="1" fill="#ffd54f"/><g fill="#ffe0b2" opacity=".6"><circle cx="20" cy="44" r="1.5"/><circle cx="44" cy="44" r="1.5"/><circle cx="32" cy="48" r="1.5"/></g>`),
 ps1:_sv(`<ellipse cx="32" cy="42" rx="22" ry="14" fill="#c8a24a"/><ellipse cx="32" cy="34" rx="18" ry="12" fill="#e0b84f"/><circle cx="22" cy="26" r="5" fill="#e0b84f"/><circle cx="42" cy="26" r="5" fill="#e0b84f"/><circle cx="22" cy="25" r="2" fill="#263238"/><circle cx="42" cy="25" r="2" fill="#263238"/><circle cx="32" cy="40" r="6" fill="#ffd54f" stroke="#b8860b" stroke-width="1.5"/><rect x="30" y="38" width="4" height="4" fill="#b8860b"/>`),
 ps2:_sv(`<path d="M10 46c0-14 10-24 24-24 8 0 14 4 18 10l6-2-2 8c0 8-6 14-14 14H16z" fill="#2e7d32"/><path d="M34 22l4-10 4 10" fill="#43a047"/><circle cx="46" cy="34" r="2" fill="#ffd54f"/><path d="M12 52h40" stroke="#1b5e20" stroke-width="3"/><path d="M18 38q8-6 18 0" stroke="#a5d6a7" stroke-width="2" fill="none"/><circle cx="30" cy="54" r="5" fill="#ffd54f" stroke="#b8860b"/>`),
 ps3:_sv(`<path d="M22 50h20l-3 10H25z" fill="#8d6e63"/><path d="M32 50V24" stroke="#5d4037" stroke-width="3"/><g fill="#66bb6a" stroke="#2e7d32" stroke-width="1"><ellipse cx="22" cy="22" rx="8" ry="5" transform="rotate(-30 22 22)"/><ellipse cx="42" cy="22" rx="8" ry="5" transform="rotate(30 42 22)"/><ellipse cx="32" cy="12" rx="5" ry="8"/><ellipse cx="22" cy="36" rx="7" ry="4" transform="rotate(-20 22 36)"/><ellipse cx="42" cy="36" rx="7" ry="4" transform="rotate(20 42 36)"/></g><g fill="#ffd54f" stroke="#b8860b" stroke-width=".8"><circle cx="26" cy="28" r="2.5"/><circle cx="38" cy="30" r="2.5"/><circle cx="32" cy="20" r="2.5"/></g>`)});
// --- màn Tài sản (tab Kinh doanh / Phương tiện / Mua sắm)
const _osh149=openShop;openShop=function(tab){if(tab==='asset')return openAssets('biz');return _osh149(tab);};
let asCat='biz';
function assetRowHTML(a){const lv=assetLv(PR,a.id),nx=lv<a.max?assetCost(a.id,lv+1):null,unit=a.exp?'EXP':'thu nhập';
 return `<div class="aitem ${lv?'own':''} ${lv>=a.max?'max':''}"><div class="aic">${ASSET_SVG[a.id]||'🏢'}</div><div class="ainm"><b>${esc(a.name)}</b><small>+${a.pct}% ${unit}${a.max>1?'/cấp':''}${a.max>1?` · ${lv?`đang +${a.pct*lv}%`:'chưa có'}`:''}</small>${a.max>1?`<span class="alv">${[1,2,3,4,5].map(k=>`<i class="${k<=lv?'on':''}"></i>`).join('')}</span>`:''}</div>${nx==null?`<span class="amax">${a.max===1?'ĐÃ CÓ':'TỐI ĐA'}</span>`:`<button onclick="askAsset('${a.id}')" ${PR.xu<nx?'disabled':''}>${lv?'Nâng cấp '+(lv+1):'Mua'}<br><small>${I('coin')}${kxu(nx)}</small></button>`}</div>`;}
function openAssets(cat){if(cat)asCat=cat;const list=ASSETS.filter(a=>a.cat===asCat);const own=list.filter(a=>assetLv(PR,a.id)).length;
 const info=asCat==='shop'?`Món đồ tăng <b>% EXP</b> nhận được ở mọi chế độ (mua 1 lần, không giới hạn trần). Vật phong thủy chỉ tăng EXP, không ảnh hưởng ván bài.`:`Tăng <b>% thu nhập thụ động</b>. Nâng tối đa cấp 5 (mỗi cấp +% gốc).`;
 let body;if(asCat==='shop'){const gs=[...new Set(list.map(a=>a.grp))];body=gs.map(g=>{const its=list.filter(a=>a.grp===g);return `<div class="agrp">${esc(its[0].grpName)}</div>`+its.map(assetRowHTML).join('');}).join('');}else body=list.map(assetRowHTML).join('');
 modal(`<h3>🏢 Tài sản</h3><div class="asum"><span>Thu nhập <b class="pos">+${fmt(assetBonus(PR))}%</b></span><span>EXP <b class="expc">+${fmt(expBonus(PR))}%</b></span><span>${I('coin')} ${fmt(PR.xu)}</span></div>
 <div class="atabs">${Object.entries(ASSET_CATS).map(([k,t])=>{const l=ASSETS.filter(a=>a.cat===k);return `<button class="${k===asCat?'on':''}" onclick="openAssets('${k}')">${t}<small>${l.filter(a=>assetLv(PR,a.id)).length}/${l.length}</small></button>`;}).join('')}</div>
 <div class="ainfo">${info} <span class="acnt">${own}/${list.length}</span></div><div class="agrid">${body}</div>`);}
function askAsset(id){const a=assetDef(id),lv=assetLv(PR,id),cost=assetCost(id,lv+1);if(cost==null)return;const P2=Object.assign({},PR,{assets:Object.assign({},PR.assets||{},{[id]:lv+1})});
 const line=a.exp?`EXP nhận được: <b>+${expBonus(PR)}%</b> → <b class="expc">+${expBonus(P2)}%</b>`:`Thu nhập: <b>${fmt(Math.round(passiveRate(PR)*3600))}</b> → <b class="pos">${fmt(Math.round(passiveRate(P2)*3600))} xu/giờ</b>`;
 modal(`<h3>🏢 ${lv?'Nâng cấp':'Mua'} ${esc(a.name)}</h3><div class="aconf"><div class="aic big">${ASSET_SVG[id]||''}</div><p>${a.max===1?'Mua 1 lần':lv?`Cấp ${lv} → <b>cấp ${lv+1}</b>`:'Sở hữu <b>cấp 1</b>'} · <b class="${a.exp?'expc':'pos'}">+${a.pct}% ${a.exp?'EXP':'thu nhập thụ động'}</b></p><p>${line}</p><p class="acost">Giá: ${I('coin')} <b>${fmt(cost)}</b> xu<br><small>Số dư sau khi mua: ${fmt(PR.xu-cost)} xu</small></p></div>
 <div class="row" style="gap:8px"><button class="alt" style="flex:1" onclick="openAssets()">Hủy</button><button style="flex:1" id="aOk" onclick="doAsset('${id}')" ${PR.xu<cost?'disabled':''}>Xác nhận mua</button></div>`);}
function doAsset(id){const r=buyAsset(PR,id);if(!r.ok){sfx('bad');toast(r.reason);return openAssets();}const a=assetDef(id);sfx('coin');toast(`🏢 ${a.name}${a.max>1?' cấp '+r.lv:''} · ${a.exp?'EXP +'+fmt(expBonus(PR))+'%':'thu nhập +'+fmt(assetBonus(PR))+'%'}`);
 try{updHud();}catch(e){}badgeToasts(checkBadges(PR));saveP();try{if(typeof cloudPush==='function'&&USER)cloudPush(true);}catch(e){}openAssets();}
// --- chi tiết thu nhập thụ động
function openPassive(){const lv=levelInfo(PR.xp||0).level,base=lv/2/100,bon=assetBonus(PR),r=passiveRate(PR);const rows=ASSETS.filter(a=>!a.exp&&assetLv(PR,a.id)).map(a=>`<div><span>${ASSET_SVG[a.id]?`<i class="pdi">${ASSET_SVG[a.id]}</i>`:''}${esc(a.name)}${a.max>1?' · cấp '+assetLv(PR,a.id):''}</span><b class="pos">+${a.pct*assetLv(PR,a.id)}%</b></div>`).join('');
 const f=v=>v.toLocaleString('vi-VN',{maximumFractionDigits:3});
 modal(`<h3>⏳ Thu nhập thụ động</h3><div class="pformula">cấp ÷ 2 ÷ 100 xu/giây × (1 + % tài sản)</div><div class="pformula sm">${lv} ÷ 2 ÷ 100 = ${f(base)} × (1 + ${bon}%) = <b>${f(r)} xu/giây</b></div>
 <div class="prates"><div><small>Mỗi giây</small><b>${f(r)}</b></div><div><small>Mỗi giờ</small><b>${fmt(Math.round(r*3600))}</b></div><div><small>Mỗi ngày</small><b>${fmt(Math.round(r*86400))}</b></div></div>
 <div class="pbrk"><div><span>Cơ bản (cấp ${lv})</span><b>${f(base)} xu/giây</b></div>${rows||'<div><span>Chưa có tài sản tăng thu nhập</span><b>+0%</b></div>'}<div><span><b>Tổng thưởng tài sản</b></span><b class="pos">+${bon}%</b></div></div>
 <p class="small" style="text-align:center">Cộng dồn cả khi tắt app, tối đa 24 giờ chưa nhận. Hiện có ${pasFmt(passivePending(PR))} xu.</p><div class="row" style="gap:8px"><button class="alt" style="flex:1" onclick="openAssets('biz')">🏢 Tài sản</button><button style="flex:1" onclick="closeModal();doPassive()">Nhận</button></div>`);}
// thanh thu nhập: % tài sản + bấm xem chi tiết; thanh Tài sản riêng; tài sản giá trị nhất cạnh avatar
const _ph149=pasHTML;pasHTML=function(){let h=_ph149();const b=assetBonus(PR);if(b)h=h.replace('<span>Thu nhập thụ động</span>',`<span>Thu nhập thụ động <i class="pasa">+${fmt(b)}% từ tài sản</i></span>`);return h;};
const _rh149=renderHome;renderHome=function(){_rh149.apply(this,arguments);try{const t=document.querySelector('#home .tiles');if(!t)return;const pt=$('pasTile');if(pt){pt.onclick=()=>openPassive();pt.style.cursor='pointer';}
 let a=$('asTile');if(!a){a=document.createElement('button');a.id='asTile';a.onclick=()=>openAssets();t.appendChild(a);}a.className='alt tile astile';const bA=bestAsset(PR);
 a.innerHTML=`<span class="alic asic">${bA&&ASSET_SVG[bA.id]?ASSET_SVG[bA.id]:'🏢'}</span><span class="pasm"><span>Tài sản</span><small>${ASSETS.filter(x=>assetLv(PR,x.id)).length}/${ASSETS.length} món · bấm để mua sắm</small></span><span class="aspc"><b class="pos">+${fmt(assetBonus(PR))}%</b><small>thu nhập</small></span><span class="aspc"><b class="expc">+${fmt(expBonus(PR))}%</b><small>EXP</small></span>`;
 const old=$('pcAssets');if(old)old.remove();const av=document.querySelector('#home .pcard .av');if(av){let bd=av.querySelector('.bestas');if(bA&&ASSET_SVG[bA.id]){if(!bd){bd=document.createElement('span');bd.className='bestas';av.appendChild(bd);}bd.innerHTML=ASSET_SVG[bA.id];bd.title=bA.name;}else if(bd)bd.remove();}}catch(e){console.warn(e)}};
// XP thực nhận (đã cộng % EXP)
const _xpf149=xpFloat;xpFloat=function(xp,up){return _xpf149(PR._lastXp||xp,up);};

// ===== v1.52: thú cưng, hạng sao theo chế độ, hồ sơ người chơi =====
const PET_SVG={
 pet_meo:_sv(`<path d="M14 26l4-16 10 10h8l10-10 4 16v12c0 12-9 18-18 18s-18-6-18-18z" fill="#ffb74d"/><path d="M18 14l4 8M46 14l-4 8" stroke="#f57c00" stroke-width="2"/><circle cx="24" cy="34" r="3" fill="#3e2723"/><circle cx="40" cy="34" r="3" fill="#3e2723"/><path d="M29 41l3 3 3-3z" fill="#e91e63"/><path d="M8 40h12M8 46h12M44 40h12M44 46h12" stroke="#5d4037" stroke-width="1.2"/>`),
 pet_cho:_sv(`<ellipse cx="32" cy="36" rx="18" ry="18" fill="#a1887f"/><ellipse cx="13" cy="30" rx="7" ry="14" fill="#5d4037"/><ellipse cx="51" cy="30" rx="7" ry="14" fill="#5d4037"/><ellipse cx="32" cy="44" rx="9" ry="7" fill="#efebe9"/><circle cx="25" cy="32" r="3" fill="#212121"/><circle cx="39" cy="32" r="3" fill="#212121"/><ellipse cx="32" cy="41" rx="4" ry="3" fill="#212121"/><path d="M30 48q2 5 4 0" fill="#e57373"/>`),
 pet_vet:_sv(`<path d="M22 30c0-12 8-20 16-20s12 8 12 16l-6 4 2 8c0 10-8 20-18 20-8 0-10-8-6-14z" fill="#43a047"/><path d="M30 34c-8 2-14 10-16 22 8-2 14-6 18-12z" fill="#1e88e5"/><path d="M50 22l8 4-8 6z" fill="#fdd835"/><circle cx="41" cy="20" r="3.5" fill="#fff"/><circle cx="42" cy="20" r="2" fill="#000"/><path d="M28 12q2-8 8-6" stroke="#e53935" stroke-width="3" fill="none"/><path d="M26 54l-4 8M30 54l0 8" stroke="#e53935" stroke-width="3"/>`),
 pet_cao:_sv(`<path d="M8 10l14 14h20l14-14-4 24-20 22-20-22z" fill="#ff7043"/><path d="M20 38l12 18 12-18-12 4z" fill="#fff"/><path d="M8 10l10 18M56 10L46 28" stroke="#bf360c" stroke-width="2"/><path d="M22 32l6 2M42 32l-6 2" stroke="#212121" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="50" r="2.5" fill="#212121"/>`),
 pet_rong:_sv(`<defs><linearGradient id="rgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5252"/><stop offset="1" stop-color="#ffab00"/></linearGradient></defs><path class="rwing" d="M30 26L6 10l6 20-6 4 16 4z" fill="#ffca28" opacity=".9"/><path d="M14 52c4-14 10-22 20-26l6-12 4 8 8 2-4 6c4 6 4 16-2 22-6 4-14 4-20 2l-8 4z" fill="url(#rgG)"/><circle cx="44" cy="22" r="2.5" fill="#fff"/><circle cx="44.5" cy="22" r="1.2" fill="#000"/><path d="M52 26l8 2-6 3 6 3-8 1" fill="#ff6d00" class="rfire"/><path d="M24 40l4 4 4-4 4 4 4-4" stroke="#b71c1c" stroke-width="1.5" fill="none"/>`)};
function petIcon(id,cls){return id&&PET_SVG[id]?`<span class="petic ${id} ${cls||''}">${PET_SVG[id]}</span>`:'';}
function starsHTML(step,sm){const s=starInfo(STAR_CUM[Math.min(35,step||0)]);if(!s.step)return `<span class="srk none ${sm?'sm':''}">☆ Chưa xếp hạng</span>`;
 return `<span class="srk t${s.tier} ${sm?'sm':''}" style="--sc:${s.color}" title="${s.name} ${s.stars} sao"><b>${s.name}</b>${[1,2,3,4,5].map(k=>`<i class="${k<=s.stars?'on':''}">★</i>`).join('')}</span>`;}
function curStarMode(){if($('cg')&&CG.g)return CG.g;if($('mg')&&MG.g)return MG.g;try{return G&&G.mode==='demla'?'demla':'tlmn';}catch(e){return 'tlmn';}}
function myStarHTML(m){return starsHTML(starInfo(modeXpOf(PR,m||curStarMode())).step,true);}
// sao + thú cưng dưới avatar khi chơi
const _slv152=seatLv;seatLv=function(s){const h=_slv152(s);if(!s||!s.me)return h;return h+(petActive(PR)?`<span class="seatst">${petIcon(PR.pet,'sm')}</span>`:'');};
const _rm152=renderMe;renderMe=function(){const r=_rm152.apply(this,arguments);try{const e=$('meInfo');if(e&&!$('cg')&&!$('mg')){let d=e.querySelector('.seatst');if(!d){d=document.createElement('span');d.className='seatst';e.appendChild(d);}d.innerHTML=petIcon(petActive(PR)&&PR.pet,'sm');}}catch(x){}return r;};
// chúc mừng lên sao
const _ax152=addXp;addXp=function(P,n,m){const r=_ax152(P,n,m);try{if(P===PR&&P._starUp){const u=P._starUp;P._starUp=null;setTimeout(()=>starUpFX(u),900);}}catch(e){}return r;};
function starUpFX(u){try{const s=starInfo(STAR_CUM[u.step]),nm=(STAR_MODES.find(x=>x[0]===u.mode)||[0,''])[1],tierUp=u.from===0||Math.floor((u.from-1)/5)!==s.tier;
 const d=document.createElement('div');d.className='starfx'+(tierUp?' big':'');d.style.setProperty('--sc',s.color);
 d.innerHTML=`<div class="sfx-in"><div class="sfx-stars">${[1,2,3,4,5].map(k=>`<i class="${k<=s.stars?'on':''} ${k===s.stars?'new':''}">★</i>`).join('')}</div><b>${tierUp?'LÊN HẠNG ':'LÊN SAO · '}${s.name.toUpperCase()} ${s.stars}★</b><small>${esc(nm)} · thu nhập thụ động +${starStepBonus(u.step)}% từ chế độ này</small></div>`;
 document.body.appendChild(d);try{sfx('win');}catch(e){}d.onclick=()=>d.remove();setTimeout(()=>d.remove(),3200);badgeToasts(checkBadges(PR));saveP();}catch(e){console.warn(e)}}
// màn Hạng sao
function openStars(){const tot=starBonus(PR);
 modal(`<h3>⭐ Hạng sao</h3><div class="asum"><span>Thưởng thu nhập <b class="pos">+${fmt(tot)}%</b></span><span>Tối đa <b>+688%</b></span></div>
 <p class="small">Mỗi chế độ có 7 hạng × 5 sao (Đồng → Bạc → Vàng → Kim cương → Xanh → Đỏ → Đen), tính theo XP kiếm được ở chế độ đó. Mỗi sao cộng % thu nhập thụ động: ${STAR_TIERS.map(t=>`<b style="color:${t[2]}">${t[0]}</b> +${t[1]}%`).join(', ')}.</p>
 <div class="stlist">${STAR_MODES.map(([m,n])=>{const x=modeXpOf(PR,m),s=starInfo(x);return `<div class="strow"><div class="stn"><b>${n}</b>${starsHTML(s.step)}</div><div class="xpb"><i style="width:${s.max?100:Math.round(100*s.cur/s.need)}%;background:${s.color}"></i></div><small>${s.max?'Tối đa · ':`${fmt(s.cur)}/${fmt(s.need)} XP đến sao kế · `}${fmt(x)} XP · <b class="pos">+${starStepBonus(s.step)}%</b></small></div>`;}).join('')}</div>`);}
// thú cưng: tab trong Tài sản
const _oa152=openAssets;openAssets=function(cat){if(cat)asCat=cat;const pet=asCat==='pet';_oa152(pet?'biz':asCat);if(pet)asCat='pet';try{const tabs=document.querySelector('.atabs');if(!tabs)return;
 const own=PETS.filter(x=>petOwned(PR,x.id)).length;const b=document.createElement('button');b.className=pet?'on':'';b.innerHTML=`Thú cưng<small>${own}/${PETS.length}</small>`;b.onclick=()=>openAssets('pet');tabs.appendChild(b);
 if(!pet)return;tabs.querySelectorAll('button').forEach(x=>{if(x!==b)x.classList.remove('on');});
 document.querySelector('.ainfo').innerHTML=`Thú cưng đi theo bạn, cạnh avatar. <b>Chỉ con đang theo</b> được cộng % EXP (cộng thêm vào % Mua sắm). <span class="acnt">${own}/${PETS.length}</span>`;
 document.querySelector('.agrid').innerHTML=PETS.map(d=>{const o=petOwned(PR,d.id),on=PR.pet===d.id&&o;return `<div class="aitem ${o?'own':''}"><div class="aic">${petIcon(d.id)}</div><div class="ainm"><b>${d.name}</b><small>+${d.pct}% EXP khi đang theo${on?' · <b class="expc">đang theo</b>':''}</small></div>${o?(on?`<button class="alt" onclick="setPet(null)">Cất</button>`:`<button onclick="setPet('${d.id}')">Cho theo</button>`):`<button onclick="askPet('${d.id}')" ${PR.xu<d.price?'disabled':''}>Mua<br><small>${I('coin')}${kxu(d.price)}</small></button>`}</div>`;}).join('');}catch(e){console.warn(e)}};
function askPet(id){const d=petDef(id);const P2=Object.assign({},PR,{pets:Object.assign({},PR.pets,{[id]:1}),pet:id});
 modal(`<h3>🐾 Mua ${d.name}</h3><div class="aconf"><div class="aic big">${petIcon(id)}</div><p><b class="expc">+${d.pct}% EXP</b> khi đang theo</p><p>EXP nhận được: <b>+${expBonus(PR)}%</b> → <b class="expc">+${expBonus(P2)}%</b></p><p class="acost">Giá: ${I('coin')} <b>${fmt(d.price)}</b> xu<br><small>Số dư sau khi mua: ${fmt(PR.xu-d.price)} xu</small></p></div>
 <div class="row" style="gap:8px"><button class="alt" style="flex:1" onclick="openAssets('pet')">Hủy</button><button style="flex:1" id="aOk" onclick="doPet('${id}')" ${PR.xu<d.price?'disabled':''}>Xác nhận mua</button></div>`);}
function doPet(id){const r=buyPet(PR,id);if(!r.ok){sfx('bad');toast(r.reason);return openAssets('pet');}sfx('coin');toast(`🐾 ${petDef(id).name} đang theo bạn · EXP +${fmt(expBonus(PR))}%`);petSaved();}
function setPet(id){equipPet(PR,id);toast(id?`🐾 ${petDef(id).name} đang theo bạn`:'Đã cất thú cưng');petSaved();}
function petSaved(){try{updHud();}catch(e){}badgeToasts(checkBadges(PR));saveP();try{if(typeof cloudPush==='function'&&USER)cloudPush(true);}catch(e){}openAssets('pet');}
// thu nhập thụ động: thêm % sao
openPassive=function(){const lv=levelInfo(PR.xp||0).level,base=lv/2/100,bon=assetBonus(PR),sb=starBonus(PR),r=passiveRate(PR);const f=v=>v.toLocaleString('vi-VN',{maximumFractionDigits:3});
 const rows=ASSETS.filter(a=>!a.exp&&assetLv(PR,a.id)).map(a=>`<div><span>${ASSET_SVG[a.id]?`<i class="pdi">${ASSET_SVG[a.id]}</i>`:''}${esc(a.name)}${a.max>1?' · cấp '+assetLv(PR,a.id):''}</span><b class="pos">+${a.pct*assetLv(PR,a.id)}%</b></div>`).join('');
 const srows=STAR_MODES.map(([m,n])=>{const s=starInfo(modeXpOf(PR,m));return s.step?`<div><span>⭐ ${n} · ${s.name} ${s.stars}★</span><b class="pos">+${starStepBonus(s.step)}%</b></div>`:'';}).join('');
 modal(`<h3>⏳ Thu nhập thụ động</h3><div class="pformula">cấp ÷ 2 ÷ 100 xu/giây × (1 + % tài sản + % sao)</div><div class="pformula sm">${lv} ÷ 2 ÷ 100 = ${f(base)} × (1 + ${fmt(bon)}% + ${fmt(sb)}%) = <b>${f(r)} xu/giây</b></div>
 <div class="prates"><div><small>Mỗi giây</small><b>${f(r)}</b></div><div><small>Mỗi giờ</small><b>${fmt(Math.round(r*3600))}</b></div><div><small>Mỗi ngày</small><b>${fmt(Math.round(r*86400))}</b></div></div>
 <div class="pbrk"><div><span>Cơ bản (cấp ${lv})</span><b>${f(base)} xu/giây</b></div>${rows||'<div><span>Chưa có tài sản tăng thu nhập</span><b>+0%</b></div>'}<div><span><b>Tổng thưởng tài sản</b></span><b class="pos">+${fmt(bon)}%</b></div>${srows||'<div><span>⭐ Chưa có sao nào</span><b>+0%</b></div>'}<div><span><b>Tổng thưởng hạng sao</b></span><b class="pos">+${fmt(sb)}%</b></div></div>
 <p class="small" style="text-align:center">Cộng dồn cả khi tắt app, tối đa 24 giờ chưa nhận. Hiện có ${pasFmt(passivePending(PR))} xu.</p><div class="row" style="gap:8px"><button class="alt" style="flex:1" onclick="openAssets('biz')">🏢 Tài sản</button><button class="alt" style="flex:1" onclick="openStars()">⭐ Sao</button><button style="flex:1" onclick="closeModal();doPassive()">Nhận</button></div>`);};
// thanh Hạng sao ở màn chính + thú cưng cạnh avatar
const _rh152=renderHome;renderHome=function(){_rh152.apply(this,arguments);try{const t=document.querySelector('#home .tiles');if(!t)return;let a=$('stTile');if(!a){a=document.createElement('button');a.id='stTile';a.onclick=()=>openStars();t.appendChild(a);}a.className='alt tile astile sttile';
 let best=null;STAR_MODES.forEach(([m,n])=>{const s=starInfo(modeXpOf(PR,m));if(!best||s.step>best.s.step)best={n,s};});const tot=STAR_MODES.reduce((x,[m])=>x+starInfo(modeXpOf(PR,m)).step,0);
 a.innerHTML=`<span class="alic asic">⭐</span><span class="pasm"><span>Hạng sao</span><small>${best&&best.s.step?esc(best.n)+' · '+best.s.name+' '+best.s.stars+'★':'Chơi để nhận sao'} · ${tot}/280</small></span><span class="aspc"><b class="pos">+${fmt(starBonus(PR))}%</b><small>thu nhập</small></span>`;
 const as=$('asTile');if(as){const sp=as.querySelector('.aspc b.pos');if(sp&&!as._v152){}}
 const av=document.querySelector('#home .pcard .av');if(av){let pb=av.querySelector('.petb');const pa=petActive(PR);if(pa){if(!pb){pb=document.createElement('span');pb.className='petb';av.appendChild(pb);}pb.innerHTML=petIcon(pa.id);pb.title=pa.name;}else if(pb)pb.remove();}}catch(e){console.warn(e)}};
// hồ sơ công khai (lưu trong tlmn_players.avatar.pf, có thể tắt trong Cài đặt)
function pubProfile(){const a={};ASSETS.forEach(x=>{const l=assetLv(PR,x.id);if(l)a[x.id]=l;});const m={};STAR_MODES.forEach(([k])=>{const s=starInfo(modeXpOf(PR,k)).step;if(s)m[k]=s;});
 return{a,p:petActive(PR)?PR.pet:null,ps:PETS.filter(x=>petOwned(PR,x.id)).map(x=>x.id),m,ib:assetBonus(PR),eb:expBonus(PR),sb:starBonus(PR)};}
const _lbs152=lbStats;lbStats=function(){const r=_lbs152();try{r.avatar={av:myAv(),bg:PR.avBg,frame:equipped(PR,'frame').id};if(!PR.privAssets)r.avatar.pf=pubProfile();else r.avatar.pf={hide:1};}catch(e){}return r;};
function profileBody(pf){if(!pf)return '<p class="small">Người chơi chưa cập nhật hồ sơ tài sản (cần mở phiên bản mới).</p>';if(pf.hide)return '<p class="small">🔒 Người chơi đã ẩn tài sản.</p>';
 const sec=(t,items)=>`<div class="agrp">${t}</div>`+(items||'<p class="small">Chưa có</p>');
 const asList=c=>ASSETS.filter(x=>x.cat===c&&pf.a&&pf.a[x.id]).map(x=>`<span class="ppit" title="${esc(x.name)}"><i>${ASSET_SVG[x.id]||''}</i><small>${esc(x.name)}${x.max>1?' · '+pf.a[x.id]:''}</small></span>`).join('');
 const pets=(pf.ps||[]).map(id=>{const d=petDef(id);return d?`<span class="ppit ${pf.p===id?'on':''}"><i>${petIcon(id)}</i><small>${d.name}${pf.p===id?' · theo':''}</small></span>`:'';}).join('');
 const stars=STAR_MODES.map(([m,n])=>`<div class="ppst"><span>${n}</span>${starsHTML((pf.m||{})[m]||0,true)}</div>`).join('');
 return `<div class="asum"><span>Thu nhập <b class="pos">+${fmt((pf.ib||0)+(pf.sb||0))}%</b></span><span>EXP <b class="expc">+${fmt(pf.eb||0)}%</b></span></div><p class="small" style="text-align:center;margin:2px 0 6px">Tài sản +${fmt(pf.ib||0)}% · Hạng sao +${fmt(pf.sb||0)}%</p>
 ${sec('⭐ Hạng sao',`<div class="ppstars">${stars}</div>`)}${sec('🏢 Kinh doanh',asList('biz')?`<div class="ppg">${asList('biz')}</div>`:'')}${sec('🚗 Phương tiện',asList('veh')?`<div class="ppg">${asList('veh')}</div>`:'')}${sec('🛍️ Mua sắm',asList('shop')?`<div class="ppg">${asList('shop')}</div>`:'')}${sec('🐾 Thú cưng',pets?`<div class="ppg">${pets}</div>`:'')}`;}
async function openPlayerProfile(uid,back){modal(`<h3>👤 Hồ sơ</h3><p class="small">Đang tải…</p>`);try{await loadSB();const {data}=await SB.from('tlmn_players').select('user_id,name,avatar,level,title,xp,frame').eq('user_id',uid).maybeSingle();
 if(!data){modal(`<h3>👤 Hồ sơ</h3><p class="small">Không có dữ liệu hồ sơ.</p><button class="alt" onclick="${back||'closeModal()'}">Quay lại</button>`);return;}const av=data.avatar||{},pf=av.pf;
 modal(`<div class="pphd"><span class="av fr-${esc(data.frame||av.frame||'fr_gold')}" style="--avc:${esc(av.bg||'#456')}">${esc(av.av||'🙂')}${pf&&pf.p&&!pf.hide?`<span class="petb">${petIcon(pf.p)}</span>`:''}</span><div><h3 style="margin:0">${esc(data.name||'?')}</h3><small><span class="lvb">${data.level||1}</span> ${esc(data.title||'')}</small></div></div>${profileBody(pf)}<button class="alt" onclick="${back||'closeModal()'}">Quay lại</button>`);}catch(e){modal(`<h3>👤 Hồ sơ</h3><p class="small">Lỗi tải hồ sơ.</p><button class="alt" onclick="closeModal()">Đóng</button>`);}}
const _pt152=plTap;plTap=function(uid){_pt152(uid);try{const m=$('modalIn');if(!m||uid===USER.id||m.querySelector('.ppbtn'))return;const p=lobbyPres().find(x=>x.uid===uid);if(!p||p.bot)return;const b=document.createElement('button');b.className='ppbtn';b.innerHTML='👤 Xem hồ sơ &amp; tài sản';b.onclick=()=>openPlayerProfile(uid,`plTap('${uid}')`);const h=m.querySelector('h3');h.insertAdjacentElement('afterend',b);}catch(e){}};
const _rf152=renderFriends;renderFriends=async function(){const r=await _rf152.apply(this,arguments);try{const rows=[...document.querySelectorAll('#frList > .row')];rows.forEach((row,i)=>{const f=FR[i];if(!f)return;[row.children[0],row.children[1]].forEach(c=>{if(!c)return;c.style.cursor='pointer';c.onclick=()=>openPlayerProfile(f.id,'openOnline()');});});}catch(e){}return r;};
const _ost152=openSettings;openSettings=function(){_ost152.apply(this,arguments);try{const m=$('modalIn');const rows=m&&m.querySelectorAll('.row');if(!rows||!rows.length)return;const d=document.createElement('div');d.className='row';
 d.innerHTML=`<span style="flex:1">Công khai tài sản, thú cưng &amp; hạng sao trên hồ sơ</span><button class="alt" id="privBtn">${PR.privAssets?'Đang ẩn':'Đang hiện'}</button>`;rows[rows.length-1].insertAdjacentElement('beforebegin',d);
 d.querySelector('button').onclick=()=>{PR.privAssets=!PR.privAssets;saveP();try{if(USER&&SB)ensurePlayer();}catch(e){}openSettings();};}catch(e){}};

// ===== v1.52.1: hàng 5 sao TRÊN avatar ở mọi ghế (người + máy) và avatar màn chính =====
function botStarStep(name,m){let h=7;for(const c of String(name||'')+'|'+m)h=(h*131+c.charCodeAt(0))>>>0;const lv=botLvFor(name);return Math.max(0,Math.min(35,Math.round(lv*0.55)+(h%9)-3));}
function avStarRow(step){const s=step?starInfo(STAR_CUM[step]):{tier:-1,stars:0,name:'Chưa xếp hạng',color:'#9e9e9e'};
 return `<span class="avst tr${s.tier}" style="--sc:${s.color}" title="${s.step?s.name+' '+s.stars+' sao':'Chưa có sao'}">${[1,2,3,4,5].map(k=>`<i class="${k<=s.stars?'on':''}">★</i>`).join('')}</span>`;}
function bestStarStep(){return Math.max(0,...STAR_MODES.map(([m])=>starInfo(modeXpOf(PR,m)).step));}
function avStarTargets(){const out=[],m=curStarMode(),me=()=>starInfo(modeXpOf(PR,m)).step;
 const hm=document.querySelector('#home .pcard .av');if(hm&&document.body.contains(hm))out.push([hm,bestStarStep()]);
 const root=$('cg')||$('mg');
 if(root){root.querySelectorAll('.av').forEach(a=>{if(a.closest('.modal,#modalIn'))return;const isMe=[...a.classList].some(c=>c.startsWith('fr-'))||!!a.closest('.cgs.me,.dmme');
   let nm='';const b=a.parentNode&&a.parentNode.querySelector('b');if(b)nm=(b.childNodes[0]&&b.childNodes[0].textContent||'').trim();out.push([a,isMe?me():botStarStep(nm,m)]);});return out;}
 const t=$('table');if(t&&!document.body.classList.contains('athome')){t.querySelectorAll('.seat .av').forEach(a=>{const s=a.closest('.seat'),n=s&&s.querySelector('.nm');out.push([a,botStarStep(n?n.textContent.trim():'',m)]);});
  const ma=$('meAvM');if(ma)out.push([ma,me()]);}
 return out;}
function decorateStars(){try{avStarTargets().forEach(([a,step])=>{const k=String(step);let r=a.querySelector(':scope > .avst');if(r&&r.dataset.k===k)return;if(r)r.remove();a.classList.add('hasst');a.insertAdjacentHTML('beforeend',avStarRow(step));a.lastElementChild.dataset.k=k;});}catch(e){}}
let _dsq=0;new MutationObserver(()=>{if(_dsq)return;_dsq=requestAnimationFrame(()=>{_dsq=0;decorateStars();});}).observe(document.documentElement,{childList:true,subtree:true});
