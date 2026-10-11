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
 if(!can()){if(st.bone.length){h.push(st.bone.pop());sfx('cgSlide');st.msg=`${i===0?'Bạn':st.seats[i].name} bốc nọc`;dmR();return setTimeout(dmStep,i===0?350:420);}
  st.pass++;st.msg=`${i===0?'Bạn':st.seats[i].name} không đi được — qua lượt`;sfx('pass');if(st.pass>=st.seats.length)return dmEnd(dmBlockedWinner(st.hands),true);st.turn=(i+1)%st.seats.length;dmR();return setTimeout(dmStep,700);}
 if(i===0){st.msg='Lượt bạn: chạm quân sáng để đánh';dmR();return;}
 if(st._bt===i)return;st._bt=i;setTimeout(()=>{st._bt=null;if(MG.st!==st||st.turn!==i||st.phase!=='play')return;let pick;if(st.first){pick={k:h.findIndex(t=>t[0]===st.first[0]&&t[1]===st.first[1]),side:'L'};}else pick=dmBotPick(h,st.ends);if(!pick||pick.k<0)return dmStep();dmPlay(i,pick.k,pick.side);},650+Math.random()*350);}
function dmPlay(i,k,side){const st=MG.st;const t=st.hands[i][k];const r=dmPlace(st.ends,t,side);st.hands[i].splice(k,1);st.ends=r.ends;const piece={a:r.placed[0],b:r.placed[1],dbl:t[0]===t[1],fresh:1};
 st.chain.forEach(c=>c.fresh=0);if(side==='L')st.chain.unshift(piece);else st.chain.push(piece);st.first=null;st.pass=0;st.sel=null;sfx('cgThud');setTimeout(()=>sfx('cgSnap'),60);
 st.msg=`${i===0?'Bạn':st.seats[i].name} đánh [${t[0]}|${t[1]}]`;if(!st.hands[i].length)return dmEnd(i,false);st.turn=(i+1)%st.seats.length;dmR();setTimeout(dmStep,500);}
function dmTap(k){const st=MG.st;if(!st||st.phase!=='play'||st.turn!==0)return;const t=st.hands[0][k];
 if(st.first){if(t[0]===st.first[0]&&t[1]===st.first[1])return dmPlay(0,k,'L');return toast('Phải đánh quân ['+st.first.join('|')+'] trước');}
 const f=dmFits(t,st.ends);if(!f.length){sfx('bad');return;}if(f.length===2&&st.ends[0]!==st.ends[1]){st.sel=k;dmR();return;}dmPlay(0,k,f[0]);}
function dmEnd(w,blocked){const st=MG.st;st.phase='done';st.busy=false;const u=dmUnit();const raw=dmSettle(st.hands,w,u);
 // trần: người thua chỉ trả tối đa số xu đang có
 const pay=raw.map((v,i)=>{if(v>=0)return v;const have=i===0?PR.xu:(MG.bxu[st.seats[i].name]||0);return -Math.min(-v,have);});const got=-pay.reduce((a,v,i)=>a+(i===w?0:v),0);pay[w]=got;
 st.res=pay;pay.forEach((v,i)=>{if(i>0)MG.bxu[st.seats[i].name]=Math.max(0,(MG.bxu[st.seats[i].name]||0)+v);});
 st.ledger=w===0?st.seats.slice(1).map((s,i)=>[s.name+' ('+dmPips(st.hands[i+1])+' nút)',-pay[i+1]]):[[st.seats[w].name+' thắng · bạn còn '+dmPips(st.hands[0])+' nút',pay[0]]];
 st.msg=(blocked?'Bí bài! ':'')+(w===0?`🎉 Bạn thắng +${fmt(pay[0])} xu`:`${st.seats[w].name} thắng · bạn ${fmt(pay[0])} xu`);
 const xp=mgEnd(pay[0],{stats:w===0&&blocked?['domBlockWin']:[]});st.msg+=` · +${xp} XP`;dmR();}
function dmR(){const o=$('mg');if(!o)return;const st=MG.st;const n=st?st.seats.length:MG.dmN;const opp=st?st.seats.slice(1):MG.dmBots.slice(0,n-1);
 const oppH=opp.map((b,j)=>{const i=j+1;const h=st?st.hands[i]:[];const up=st&&st.phase==='done';return `<div class="dmo ${st&&st.turn===i&&st.phase==='play'?'turn':''}">${mgSeat(b,st&&st.res?`<i class="mgv ${st.res[i]>0?'pos':st.res[i]<0?'neg':''}">${st.res[i]>0?'+':''}${kxu(st.res[i])}</i>`:'')}<div class="dmoh">${up?h.map(t=>dmTileH(t[0],t[1],true,'sm')).join(''):h.map(()=>'<div class="dmt v sm back"></div>').join('')}</div>${up?`<small>${dmPips(h)} nút</small>`:`<small>${h.length} quân</small>`}</div>`;}).join('');
 const chain=st?st.chain.map(c=>dmTileH(c.a,c.b,c.dbl,c.fresh?'fresh':'')).join(''):'';
 const my=st?st.hands[0].map((t,k)=>{const ok=st.phase==='play'&&st.turn===0&&(st.first?(t[0]===st.first[0]&&t[1]===st.first[1]):dmFits(t,st.ends).length>0);return dmTileH(t[0],t[1],true,(ok?'ok':'')+(st.sel===k?' sel':''),`dmTap(${k})`);}).join(''):'';
 o.innerHTML=mgTop()+`<div class="dmtbl"><div class="dmopp n${n}">${oppH}</div><div class="dmchain">${chain||'<span class="small">Dây domino</span>'}</div>${st?`<div class="dmbone">Nọc: ${st.bone.length}</div>`:''}<div class="cgmsg">${esc(st?st.msg:'Domino đôi sáu · bốc nọc khi không đi được · thắng: người thua trả '+fmt(dmUnit())+' xu mỗi nút còn lại')}</div>
 <div class="dmme ${st&&st.turn===0&&st.phase==='play'?'turn':''}">${my}</div></div><div class="cgctl">${dmCtl()}</div>`;try{svaScan(o);}catch(e){}}
function dmCtl(){const st=MG.st;if(st&&st.sel!=null)return `<div class="cgrow"><button class="cgbig" onclick="dmPlay(0,${st.sel},'L')">◀ Đầu trái (${st.ends[0]})</button><button class="cgbig" onclick="dmPlay(0,${st.sel},'R')">Đầu phải (${st.ends[1]}) ▶</button></div>`;
 if(st&&st.phase==='play')return '';
 return `${st?mgLedger(st.ledger):''}<div class="cgset"><div class="cgn">${[2,3,4].map(k=>`<button class="${k===MG.dmN?'':'alt'}" onclick="dmSet('n',${k})">${k}</button>`).join('')}<span class="small">người</span></div></div>${mgBets(DM_BETS,MG.bet,"dmSet.bind(null,'bet')",b=>b<=PR.xu)}<button class="cgbig" ${PR.xu<MG.bet?'disabled':''} onclick="dmDeal()">${st?'Ván mới':'Chia bài'} · ${fmt(dmUnit())} xu/nút</button>`;}
