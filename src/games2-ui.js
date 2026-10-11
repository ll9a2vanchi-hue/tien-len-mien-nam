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
function bcBetTxt(b){return Object.entries(b).filter(([,v])=>v).map(([s,v])=>BC_EMO[s]+kxu(v)).join(' ');}
function bcTot(b){return Object.values(b||{}).reduce((a,x)=>a+x,0);}
function bcBotBets(){const st=MG.st;mgRefill(st.bots,500);st.bots.forEach(b=>{b.bets={};if(st.role==='con')return;const k=1+Math.floor(Math.random()*3);for(let i=0;i<k;i++){const s=BC_SYM[Math.floor(Math.random()*6)];const a=[100,200,500,1000][Math.floor(Math.random()*4)];if(bcTot(b.bets)+a<=(MG.bxu[b.name]||0)/2)b.bets[s]=(b.bets[s]||0)+a;}});}
function bcR(){const o=$('mg');const st=MG.st;if(!o||!st)return;const show=st.phase==='open'||st.phase==='done';
 const tile=s=>{const mine=st.bets[s]||0,bots=st.bots.reduce((a,b)=>a+((b.bets||{})[s]||0),0);const hit=show?st.dice.filter(d=>d===s).length:0;
  return `<button class="bct ${hit?'hit':''} ${show&&!hit&&(mine||bots)?'miss':''}" onclick="bcPut('${s}')"><span class="bce">${BC_EMO[s]}</span><b>${BC_NAME[s]}</b>${mine?`<i class="bcm">${kxu(mine)}</i>`:''}${bots?`<i class="bcb">🤖 ${kxu(bots)}</i>`:''}${hit?`<em class="bcx">×${hit}</em>`:''}</button>`;};
 const dealer=st.role==='cai'?{name:'Bạn (cái)',av:myAv(),me:1}:{name:'Nhà cái',av:'🎩'};
 o.innerHTML=mgTop()+`<div class="bctbl"><div class="bcseats">${mgSeat(dealer,'<i class="cgdl">CÁI</i>')}${st.bots.map((b,i)=>mgSeat(b,st.res?`<i class="mgv ${st.res.b[i]>0?'pos':st.res.b[i]<0?'neg':''}">${st.res.b[i]>0?'+':''}${kxu(st.res.b[i])}</i>`:(bcTot(b.bets)?`<i class="mgv">${kxu(bcTot(b.bets))}</i>`:''))).join('')}</div>
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
function bcPut(s){const st=MG.st;if(st.phase==='done')bcNew();if(st.phase!=='bet'||st.role!=='con')return;const tot=bcTot(st.bets);if(tot+st.chip>PR.xu)return toast('Không đủ xu');st.bets[s]=(st.bets[s]||0)+st.chip;sfx('cgChip');bcR();}
function bcClear(){MG.st.bets={};bcR();}
function bcShake(){const st=MG.st;if(st.phase==='done'){st.res=null;st.ledger=null;st.msg='';if(st.role==='con'&&bcTot(st.bets)>PR.xu)st.bets={};if(st.role==='cai')bcBotBets();st.phase='bet';}if(st.role==='con'&&!bcTot(st.bets))return;
 if(st.role==='con')st.bots.forEach(b=>{b.bets={};const k=1+Math.floor(Math.random()*2);for(let i=0;i<k;i++){const s=BC_SYM[Math.floor(Math.random()*6)];const a=[100,200,500][Math.floor(Math.random()*3)];if(bcTot(b.bets)+a<=(MG.bxu[b.name]||0)/2)b.bets[s]=(b.bets[s]||0)+a;}});
 st.dice=bcuaRoll();st.phase='shake';st.busy=true;st.bet=st.role==='con'?bcTot(st.bets):0;bcR();bcRattle();setTimeout(()=>{if(MG.st!==st)return;st.phase='open';st.msg='Bát đã lắc xong — mở bát!';bcR();},RM?300:1400);}
function bcRattle(){const n=RM?4:14;for(let i=0;i<n;i++){const t=i*0.085+Math.random()*0.02;noise(.04,.12,t,1800+Math.random()*1500);tone(900+Math.random()*700,.03,'triangle',.04,t);}noise(.12,.15,n*0.085,500);}
function bcOpen(){const st=MG.st;if(st.phase!=='open')return;st.phase='done';st.busy=false;sfx('cgSnap');noise(.15,.08,0,2500);
 const bv=st.bots.map(b=>bcuaPay(b.bets||{},st.dice));let me;
 if(st.role==='con'){me=bcuaPay(st.bets,st.dice);bv.forEach((v,i)=>{MG.bxu[st.bots[i].name]=Math.max(0,(MG.bxu[st.bots[i].name]||0)+v);});st.ledger=[['Với nhà cái',me]];}
 else{const v=cgCap([0].concat(bv),PR.xu);me=v[0];v.slice(1).forEach((x,i)=>{bv[i]=x;MG.bxu[st.bots[i].name]=Math.max(0,(MG.bxu[st.bots[i].name]||0)+x);});st.ledger=st.bots.map((b,i)=>[b.name,-bv[i]]);}
 st.res={me,b:bv};const triple=st.dice[0]===st.dice[1]&&st.dice[1]===st.dice[2];st.msg=(me>0?`🎉 Bạn thắng +${fmt(me)} xu`:me<0?`Bạn thua ${fmt(me)} xu`:'Hòa')+(triple?' · Bão '+BC_NAME[st.dice[0]]+'!':'');
 const xp=mgEnd(me,{stats:triple&&me>0?['bcuaTriple']:[]});st.msg+=` · +${xp} XP`;bcR();}
