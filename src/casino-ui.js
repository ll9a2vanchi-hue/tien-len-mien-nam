// ===== Sòng phụ: 3 cào & Xì dách (offline, đấu với nhà cái máy) =====
const CG={g:null,bet:200,st:null};const CG_NAMES=['Anh Tư','Chị Bảy','Chú Năm','Cô Ba','Bác Hai','Anh Sáu','Bé Út','Ông Tám','Dì Chín','Anh Mười'];const CG_AV=['🧔','👩','👨‍🦳','👵','👴','🧑','👱‍♀️','👨','👩‍🦰','🤵'];
const CG_BETS=[100,200,500,1000,2000,5000];
function cgCard(c,up,i,cls){if(!up)return `<div class="card back cgc ${cls||''}" style="--d:${i||0}"></div>`;const d=cardEl(c);d.classList.add('cgc');if(cls)cls.split(' ').forEach(k=>k&&d.classList.add(k));d.style.setProperty('--d',i||0);return d.outerHTML;}
let _cgcfg={};try{_cgcfg=JSON.parse(localStorage.getItem('tlmn_cgcfg')||'{}');}catch(e){}
CG.n=Math.min(6,Math.max(2,_cgcfg.n||4));CG.role=_cgcfg.role==='cai'?'cai':'con';CG.bxu={};
function cgSaveCfg(){try{localStorage.setItem('tlmn_cgcfg',JSON.stringify({n:CG.n,role:CG.role}));}catch(e){}}
function cgMe(){return CG.role==='cai'?0:CG.n-1;}
function cgBotXu(){return Math.round(CG.bet*(15+Math.random()*35)/100)*100;}
function cgNewBot(used){const pool=[...CG_NAMES.keys()].filter(k=>!used.includes(CG_NAMES[k]));const k=pool[Math.floor(Math.random()*pool.length)]??0;const b={name:CG_NAMES[k],av:CG_AV[k]};CG.bxu[b.name]=cgBotXu();return b;}
function cgSeats(){const n=CG.n,me=cgMe();const out=[];const used=[];for(let i=0;i<n;i++){if(i===me){out.push({name:'Bạn',av:(AVATARS[0]||['🙂'])[0],me:1,dealer:i===0?1:0});continue;}
 if(i===0&&CG.role==='con'){out.push({name:'Nhà cái',av:'🎩',dealer:1});CG.bxu['Nhà cái']=CG.bxu['Nhà cái']||CG.bet*100;continue;}const b=cgNewBot(used);used.push(b.name);out.push(b);}return out;}
function cgSetup(k,v){if(CG.st&&CG.st.phase!=='done')return;CG[k]=v;CG.seats=null;CG.st=null;cgSaveCfg();cgRender();}
function openCasino(g){closeModal();CG.g=g;CG.st=null;CG.seats=null;if(!CG_BETS.includes(CG.bet))CG.bet=200;let o=$('cg');if(!o){o=document.createElement('div');o.id='cg';document.body.appendChild(o);}document.body.classList.add('cgon');cgRender();}
function closeCasino(){if(CG.st&&CG.st.phase!=='done'){if(!confirm('Đang chơi dở, rời bàn sẽ mất tiền cược. Rời?'))return;}const o=$('cg');if(o)o.remove();document.body.classList.remove('cgon');CG.st=null;CG.seats=null;showHome();}
function cgTitle(){return CG.g==='3cao'?'🃏 3 Cào':'🂱 Xì Dách';}
function cgXuOf(s){return s.me?PR.xu:(CG.bxu[s.name]||0);}
function cgRender(){const o=$('cg');if(!o)return;const st=CG.st;const seats=st?st.seats:(CG.seats=CG.seats||cgSeats());const ME=st?st.me:cgMe();const n=seats.length;
 const seatHTML=(s,i)=>{const h=st?st.hands[i]:[];const r=st&&st.res&&st.res[i];const up=st&&(i===ME?st.meUp:(st.reveal||(r&&r.done)||(st.open&&st.open[i])));
  const sq=st&&i===ME&&CG.g==='3cao'&&st.phase==='look';
  const cards=sq?h.map((c,k)=>`<div class="sq ${st.flip[k]?'done':''}" data-k="${k}" style="--d:${k+9}">${cgCard(c,true,k+9,'sqf')}<div class="card back sqb"></div></div>`).join(''):h.map((c,k)=>cgCard(c,up,k+i*3,(st.newCard&&st.newCard[i]===k)?'cgnew':'')).join('');
  const show=r&&r.done&&(i>0||st.phase==='done');const lab=i===0?(r&&r.v>0?'CÁI ĂN':r&&r.v<0?'CÁI THUA':'HÒA'):(r&&r.v>0?'THẮNG':r&&r.v<0?'THUA':'HÒA');
  const stamp=show?`<div class="cgstamp ${r.v>0?'w':r.v<0?'l':'d'} ${r.fresh?'in':''}" style="--sd:${(r.fresh?i:0)*120}ms"><b>${lab}</b>${r.v?`<small>${r.v>0?'+':''}${fmt(r.v)}</small>`:''}</div>`:'';if(r)r.fresh=false;
  const canX=st&&st.phase==='deal'&&i!==0&&!(r&&r.done);
  return `<div class="cgs ${i===ME?'me':i===0?'top':'mid'} ${st&&st.turn===i?'turn':''} ${canX?'xet':''}" data-i="${i}" ${canX?`onclick="xdXet(${i})"`:''}><div class="cgp"><span class="av ${s.me?frameCls():''}" style="--avc:#3a5">${s.me?myAv():s.av}</span><b>${esc(s.name)}${s.dealer?' <i class="cgdl">CÁI</i>':''}</b>${seatLv(s)}<small class="cgbx">${I('coin')}${kxu(cgXuOf(s))}</small></div>
  <div class="cgh ${sq?'sqh':''}">${cards}${stamp}</div>${st&&up&&h.length&&!sq?`<div class="cgsc ${cgSpecial(h,i)?'sp':''}">${cgScoreLab(h,i)}</div>`:''}${canX?'<em class="cgxet">Chạm để xét</em>':''}</div>`;};
 const top=seats.map((s,i)=>i===0&&i!==ME?seatHTML(s,i):'').join('');const mids=seats.map((s,i)=>i!==0&&i!==ME?seatHTML(s,i):'').filter(Boolean);
 o.classList.toggle('cgfresh',!!(st&&st.fresh));if(st)st.fresh=false;
 o.innerHTML=`<div class="cgtop"><button class="alt ic" onclick="closeCasino()">${I('back')}</button><b>${cgTitle()}</b><span class="cgxu">${I('coin')} <span id="cgXu">${fmt(PR.xu)}</span></span></div>
 <div class="cgtbl n${n} ${ME===0?'mecai':''}">${top}<div class="cgmid m${mids.length}">${mids.join('')}</div><div class="cgmsg" id="cgMsg">${st?st.msg||'':cgRuleNote()}</div>${seatHTML(seats[ME],ME)}</div>
 <div class="cgctl">${cgCtl()}</div>`;try{svaScan(o);}catch(e){}if(st&&st.stampFresh){st.stampFresh=false;setTimeout(()=>sfx('thud'),250);}sqWire();}
function cgRuleNote(){return CG.g==='xidach'?'Xì bàng x3 · Xì dách x2 · Ngũ linh x2 · dưới 16 là non · quá 21 là quắc':'Ba cào (J Q K) x2 · điểm = số cuối của tổng';}
function cgScoreLab(h,i){if(CG.g==='3cao'){const s=bcScore(h);return s.bacao?'BA CÀO':s.score+' nút';}const k=xdKind(h,i===0?15:16);if(k.kind==='thuong'||(CG.st&&CG.st.early&&k.kind==='non'))return k.total+' điểm';return XD_LABEL[k.kind].toUpperCase()+(k.kind==='quac'||k.kind==='non'||k.kind==='ngulinh'?' · '+k.total:'');}
function cgSpecial(h,i){if(CG.g==='3cao')return bcScore(h).bacao;const k=xdKind(h,i===0?15:16).kind;return ['xibang','xidach','ngulinh'].includes(k)?1:['quac','non'].includes(k)&&!(CG.st&&CG.st.early)?2:0;}
function cgNeed(){return CG.role==='cai'?cgDealerNeed(CG.g,CG.n,CG.bet):CG.bet;}
function cgCtl(){const st=CG.st;
 if(!st||st.phase==='done'){const need=cgNeed();const led=st&&st.ledger?`<div class="cgled">${st.ledger.map(l=>`<div><span>${esc(l[0])}</span><b class="${l[1]>0?'pos':l[1]<0?'neg':''}">${l[1]>0?'+':''}${fmt(l[1])}</b></div>`).join('')}</div>`:'';
  return `${led}<div class="cgset"><div class="cgn">${[2,3,4,5,6].map(k=>`<button class="${k===CG.n?'':'alt'}" onclick="cgSetup('n',${k})">${k}</button>`).join('')}<span class="small">người</span></div>
  <div class="cgrole"><button class="${CG.role==='con'?'':'alt'}" onclick="cgSetup('role','con')">🙋 Chơi con</button><button class="${CG.role==='cai'?'':'alt'}" onclick="cgSetup('role','cai')">🎩 Làm cái</button></div></div>
  <div class="cgbets">${CG_BETS.map(b=>`<button class="${b===CG.bet?'':'alt'}" ${(CG.role==='cai'?cgDealerNeed(CG.g,CG.n,b):b)>PR.xu?'disabled':''} onclick="CG.bet=${b};cgRender()">${kxu(b)}</button>`).join('')}</div>
  ${CG.role==='cai'?`<p class="small cgnote">Làm cái: ăn/chung từng nhà (${CG.n-1} con × ${fmt(CG.bet)} xu). Cần ≥ ${fmt(need)} xu.</p>`:''}
  <button class="cgbig" ${PR.xu<need?'disabled':''} onclick="cgDeal()">${st?'Ván mới':'Chia bài'} · ${fmt(CG.bet)} xu${CG.role==='cai'?' / nhà':''}</button>`;}
 const ME=st.me;
 if(CG.g==='3cao')return st.phase==='look'?`<p class="small sqhint">${RM?'Chạm vào từng lá để lật':'Vuốt lên từng lá để nặn bài'}</p><button class="cgbig" onclick="bcFlip()">Lật hết 🃏</button>`:'';
 if(st.phase==='me'){const k=xdKind(st.hands[ME],16);const can=k.total>=16||st.hands[ME].length>=5;return `<div class="cgrow"><button class="cgbig" ${st.hands[ME].length>=5?'disabled':''} onclick="xdHit()">Rút bài</button><button class="cgbig alt" ${can?'':'disabled'} onclick="xdStand()">Dằn${can?'':' (cần ≥16)'}</button></div>`;}
 if(st.phase==='deal'){const h=st.hands[0],k=xdKind(h,15);const can=k.total>=15||h.length>=5;return `<p class="small cgnote">${can?'Chạm vào từng nhà để xét, hoặc Lật hết':'Nhà cái cần ≥15 điểm mới được xét'}</p><div class="cgrow"><button class="cgbig" ${h.length>=5?'disabled':''} onclick="xdHit()">Rút bài</button><button class="cgbig alt" ${can?'':'disabled'} onclick="xdXetAll()">Lật hết</button></div>`;}
 return '<p class="small" style="text-align:center">Đang chờ…</p>';}
function cgDeck(){const d=[...Array(52).keys()];for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
// thay máy hết xu
function cgRefill(){const seats=CG.seats;const msgs=[];seats.forEach((s,i)=>{if(s.me)return;if((CG.bxu[s.name]||0)<CG.bet*(s.dealer?3:1)){if(s.dealer){CG.bxu[s.name]=CG.bet*100;msgs.push('Nhà cái nạp thêm xu');return;}const b=cgNewBot(seats.map(x=>x.name));msgs.push(`${s.name} hết xu, rời bàn · ${b.name} vào bàn`);delete CG.bxu[s.name];seats[i]=b;}});if(msgs.length)toast(msgs.join(' — '));}
function cgDeal(){const need=cgNeed();if(PR.xu<need)return toast('Không đủ xu');const deck=cgDeck();CG.seats=CG.seats||cgSeats();if(CG.st)cgRefill();const seats=CG.seats;const nc=CG.g==='3cao'?3:2;const me=cgMe();
 CG.st={seats,me,deck,hands:seats.map(()=>deck.splice(0,nc)),phase:CG.g==='3cao'?'look':'wait',meUp:CG.g!=='3cao',reveal:false,res:{},open:{},msg:'',turn:-1,newCard:null,fresh:false,flip:[false,false,false],bet:CG.bet};
 if(CG.g==='xidach')setTimeout(xdCheckNatural,700);else CG.st.msg='Nặn bài: vuốt từng lá của bạn';cgRender();}
// ---- 3 cào
function bcFlip(){const st=CG.st;st.meUp=true;sfx('flip');st.phase='wait';st.msg=st.me===0?'Lật bài các nhà…':'Nhà cái lật bài…';cgRender();setTimeout(()=>{st.reveal=true;sfx('flip');cgSettle();},1100);}
// ---- Xì dách
const isNat=k=>k==='xibang'||k==='xidach';
function xdCheckNatural(){const st=CG.st;if(!st)return;const kd=xdKind(st.hands[0],15);
 if(isNat(kd.kind)){st.reveal=true;st.early=true;st.msg=(st.me===0?'Bạn ':'Nhà cái ')+XD_LABEL[kd.kind]+'!';sfx('fanfare');return cgSettle();}
 // nhà con có xì bàng/xì dách: lật và tính ngay
 let nat=false;st.seats.forEach((s,i)=>{if(i===0)return;const k=xdKind(st.hands[i],16);if(isNat(k.kind)){st.open[i]=true;st.res[i]={v:cgPair('xidach',st.hands[i],st.hands[0],st.bet),done:true,fresh:true};nat=true;}});
 if(nat){sfx('fanfare');}
 if(st.me!==0){if(st.res[st.me]){st.msg='Bạn '+XD_LABEL[xdKind(st.hands[st.me],16).kind]+'!';cgRender();return setTimeout(xdBots,900);}st.phase='me';st.turn=st.me;st.msg='Lượt bạn: Rút hoặc Dằn (cần ≥16 điểm)';cgRender();}
 else{cgRender();setTimeout(xdBots,nat?900:300);}}
function xdHit(){const st=CG.st;const i=st.phase==='me'?st.me:st.phase==='deal'?0:-1;if(i<0)return;st.hands[i].push(st.deck.pop());st.newCard={[i]:st.hands[i].length-1};sfx('deal');
 const k=xdKind(st.hands[i],i===0?15:16);
 if(st.phase==='me'){if(k.kind==='quac'){st.msg='Quắc rồi! ('+k.total+')';sfx('thud');return xdBots();}if(st.hands[i].length>=5){st.msg='Ngũ linh!';sfx('chime');return xdBots();}}
 else{if(k.kind==='quac'){st.msg='Bạn quắc ('+k.total+')!';sfx('thud');return cgSettle();}if(st.hands[i].length>=5){st.msg='Ngũ linh!';sfx('chime');return cgSettle();}}
 cgRender();}
function xdStand(){const st=CG.st;if(st.phase!=='me')return;st.msg='Bạn dằn '+xdTotal(st.hands[st.me]);sfx('tap');xdBots();}
function xdBots(){const st=CG.st;st.phase='bots';st.turn=-1;cgRender();let t=500;
 st.seats.forEach((s,i)=>{if(i===0||i===st.me||st.res[i])return;while(xdBotShould(st.hands[i],16+(i%2))){const c=st.deck.pop();st.hands[i].push(c);const k=st.hands[i].length-1;setTimeout(()=>{st.newCard={[i]:k};sfx('deal');cgRender();},t);t+=420;}});
 if(st.me===0){setTimeout(()=>{st.phase='deal';st.turn=0;st.msg='Lượt nhà cái (bạn): rút tới ≥15 rồi xét';cgRender();},t+200);return;}
 setTimeout(()=>{st.turn=0;st.reveal=true;st.msg='Nhà cái lật bài…';sfx('flip');cgRender();let t2=700;while(xdDealerShould(st.hands[0])){st.hands[0].push(st.deck.pop());const k=st.hands[0].length-1;setTimeout(()=>{st.newCard={0:k};sfx('deal');cgRender();},t2);t2+=600;}setTimeout(cgSettle,t2+300);},t+200);}
function xdCanXet(){const h=CG.st.hands[0];const k=xdKind(h,15);return k.total>=15||h.length>=5;}
function xdXet(i){const st=CG.st;if(!st||st.phase!=='deal'||i===0||st.res[i])return;if(!xdCanXet())return toast('Cần ≥15 điểm mới được xét');
 st.open[i]=true;const v=cgPair('xidach',st.hands[i],st.hands[0],st.bet);st.res[i]={v,done:true,fresh:true};sfx('flip');setTimeout(()=>sfx(v<0?'coin':'thud'),200);
 st.msg=`Xét ${st.seats[i].name}: ${v<0?'cái ăn +'+fmt(-v):v>0?'cái chung '+fmt(v):'hòa'}`;if(st.seats.every((s,j)=>j===0||st.res[j]))return cgSettle();cgRender();}
function xdXetAll(){if(!xdCanXet())return;cgSettle();}
// ---- tính tiền chung
function cgSettle(){const st=CG.st;if(st.phase==='done')return;st.phase='done';st.stampFresh=true;st.turn=-1;st.reveal=true;st.meUp=true;const bet=st.bet;const n=st.seats.length;
 const v=[0];for(let i=1;i<n;i++){if(st.res[i]&&st.res[i].done)v.push(st.res[i].v);else v.push(cgPair(CG.g,st.hands[i],st.hands[0],bet));}v[0]=-v.slice(1).reduce((a,x)=>a+x,0);
 const cap=st.me===0?PR.xu:(CG.bxu[st.seats[0].name]||0);const fin=cgCap(v,cap);
 const ledger=[];for(let i=0;i<n;i++){const old=st.res[i];st.res[i]={v:fin[i],done:true,fresh:!(old&&old.done&&old.v===fin[i]&&i>0)||!!(old&&old.fresh)};}
 for(let i=1;i<n;i++){const s=st.seats[i];if(!s.me){CG.bxu[s.name]=Math.max(0,(CG.bxu[s.name]||0)+fin[i]);}if(st.me===0&&i>0)ledger.push([s.name,-fin[i]]);}
 if(st.me!==0){const s0=st.seats[0];CG.bxu[s0.name]=Math.max(0,(CG.bxu[s0.name]||0)+fin[0]);ledger.push(['Với nhà cái',fin[st.me]]);}
 const me=fin[st.me];st.ledger=ledger;
 const mh=st.hands[st.me];if(CG.g==='3cao'){if(bcScore(mh).bacao&&me>0)bst('bacao');}else{const k=xdKind(mh,st.me===0?15:16).kind;if(me>0&&k==='xibang')bst('xibang');if(me>0&&k==='ngulinh')bst('ngulinh');}
 PR.xu=Math.max(0,PR.xu+me);const won=me>0;bst(CG.g==='3cao'?'bcGames':'xdGames');if(st.me===0)bst('cgDealer');if(won){bst(CG.g==='3cao'?'bcWin':'xdWin');questEvent(PR,CG.g==='3cao'?'bcwin':'xdwin');}questEvent(PR,'cgplay');
 try{const n=st.seats.length,deal=st.me===0,bots=st.seats.filter(x=>!x.me&&x.name);const bust=st.seats.reduce((a,x,i)=>a+(i!==st.me&&!x.me&&fin[i]<0&&(CG.bxu[x.name]||0)<=0?1:0),0);const allLost=deal&&fin.slice(1).every(v=>v<0);const ev={win:won,net:me,bet:CG.bet,n,full:n>=6,role:deal,dealer:true,bust,s5:false};
  if(CG.g==='3cao'){const sc=bcScore(mh);Object.assign(ev,{sp1:won&&sc.bacao,sp2:won&&!sc.bacao&&sc.score===9,sp3:allLost&&n>1,s4:deal&&sc.bacao,s5:!sc.bacao&&sc.score===9&&me<0});}
  else{const kd=xdKind(mh,st.me===0?15:16);Object.assign(ev,{sp1:won&&kd.kind==='xidach',sp2:won&&kd.kind==='ngulinh',sp3:won&&kd.kind==='xibang',s4:kd.kind==='ngulinh'&&kd.total===21,s5:allLost&&n>1});}
  modeRecord(PR,CG.g,ev);}catch(e){console.warn(e)}
 const xp=won?30:me===0?15:10;const up=addXp(PR,xp);xpFloat(xp,up);st.msg=(me>0?`🎉 Bạn ${st.me===0?'(cái) ':''}thắng +${fmt(me)} xu`:me<0?`Bạn ${st.me===0?'(cái) ':''}thua ${fmt(me)} xu`:'Hòa')+` · +${xp} XP`;
 sfx(me>0?'win':me<0?'thud':'tap');if(me>0)sfx('coin');cgRender();try{const r=$('cgXu').getBoundingClientRect();floatText(r.left,r.bottom+10,(me>=0?'+':'')+fmt(me)+' xu',me>=0?'gain':'loss');}catch(e){}
 try{levelUpFX(up);}catch(e){}badgeToasts(checkBadges(PR));saveP();const x=$('cgXu');if(x)x.textContent=fmt(PR.xu);}
// ---- vào từ màn hình chính
MODES.push(['3cao','3 Cào','🃏'],['xidach','Xì dách','🂱']);
const _ot45=openTables;openTables=function(){if(MODE==='3cao'||MODE==='xidach')return openCasino(MODE);return _ot45.apply(this,arguments);};

// ---- nặn bài (3 cào): kéo lớp mặt sau để lộ dần lá bài
function sqSet(el,p){const b=el.querySelector('.sqb');if(!b)return;p=Math.max(0,Math.min(1,p));const y=100-p*130;b.style.clipPath=`polygon(0 0,100% 0,100% ${Math.max(-30,y)}%,0 ${Math.max(-30,y+30)}%)`;b.style.setProperty('--p',p);el.classList.toggle('peeling',p>0&&p<1);}
function sqDone(k){const st=CG.st;if(!st||st.phase!=='look')return;st.flip[k]=true;const el=document.querySelector(`.sq[data-k="${k}"]`);if(el){el.classList.add('done');sqSet(el,1);}sfx('flip');if(st.flip.every(Boolean))setTimeout(()=>{if(CG.st===st&&st.phase==='look')bcFlip();},500);}
function sqWire(){document.querySelectorAll('.sq:not(.done)').forEach(el=>{if(el._w)return;el._w=1;const k=+el.dataset.k;let y0=null,x0=0,moved=false,last=0;
 el.addEventListener('pointerdown',e=>{y0=e.clientY;x0=e.clientX;moved=false;try{el.setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();});
 el.addEventListener('pointermove',e=>{if(y0==null||CG.st.flip[k]||RM)return;const d=Math.max(y0-e.clientY,(x0-e.clientX)*0.8,0);const h=el.getBoundingClientRect().height;const p=d/(h*0.9);if(d>4)moved=true;sqSet(el,p);if(p-last>0.12){last=p;sfx('tick');}if(p>=0.9){y0=null;sqDone(k);}});
 const up=()=>{if(y0==null)return;y0=null;if(!moved||RM){sqDone(k);return;}if(!CG.st.flip[k]){sqSet(el,0);last=0;}};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);});}
const _bf46=bcFlip;bcFlip=function(){const st=CG.st;if(!st||st.phase!=='look')return;st.flip=[true,true,true];_bf46();};

// ======== v51: chia bài từ hộp bài (shoe), bay vòng cung, lật 3D, âm thanh sòng ========
Object.assign(SND,{
 cgRiffle:()=>{for(let i=0;i<26;i++){const t=i*0.024+Math.random()*0.008;noise(.022,.07+.05*Math.sin(i/26*Math.PI),t,2600+Math.random()*1800);}noise(.09,.12,.66,600);tone(140,.06,'sine',.06,.68);},
 cgSlide:()=>{noise(.11,.07,0,3200);noise(.07,.05,.02,1400);},
 cgThud:()=>{noise(.05,.16,0);tone(95,.07,'sine',.07,0,60);},
 cgSnap:()=>{noise(.025,.14,0,3500);tone(1500,.03,'triangle',.04,0,900);},
 cgChip:()=>{tone(2350,.07,'square',.035);tone(3150,.09,'square',.03,.04);tone(2700,.08,'triangle',.03,.09);},
 cgJingle:()=>{[784,988,1175,1568].forEach((f,i)=>tone(f,.22,'triangle',.11,i*.09));SND.cgChip();setTimeout(()=>{try{SND.cgChip();}catch(e){}},260);},
 cgLose:()=>{tone(330,.28,'sine',.1,0,247);tone(247,.4,'sine',.09,.22,185);},
 cgFan:()=>{[[523,659,784],[659,784,988],[784,988,1175,1568]].forEach((c,i)=>c.forEach(f=>tone(f,i===2?.6:.18,'sawtooth',.045,i*.16)));noise(.4,.06,.3,4000);},
 cgBust:()=>{noise(.25,.25,0);tone(180,.35,'square',.06,0,60);}
});
function cgShoeRect(){const e=document.querySelector('#cg .cgshoe');return e?e.getBoundingClientRect():null;}
function cgEnsureShoe(){const t=document.querySelector('#cg .cgtbl');if(!t||t.querySelector('.cgshoe'))return;const d=document.createElement('div');d.className='cgshoe';d.innerHTML='<div class="card back cgc"></div><div class="card back cgc"></div><div class="card back cgc"></div><i></i>';t.appendChild(d);}
function cgFly(target,delay,dur,opt){return new Promise(res=>{const sr=cgShoeRect();if(!sr||!target){res();return;}setTimeout(()=>{const tr=target.getBoundingClientRect();if(!tr.width){res();return;}
 const f=document.createElement('div');f.className='card back cgc cgfly';f.style.cssText=`left:${sr.left+sr.width/2-tr.width/2}px;top:${sr.top+sr.height/2-tr.height/2}px;width:${tr.width}px;height:${tr.height}px`;document.body.appendChild(f);
 const dx=tr.left-(sr.left+sr.width/2-tr.width/2),dy=tr.top-(sr.top+sr.height/2-tr.height/2);const rot=(Math.random()*10-5);const arc=-Math.min(90,40+Math.abs(dx)*.2);const spin=(dx<0?-1:1)*(360+Math.random()*90);
 sfx('cgSlide');const an=f.animate([{transform:'translate(0,0) rotate(0) scale(.7)',boxShadow:'0 2px 4px #0006'},{transform:`translate(${dx*.5}px,${dy*.5+arc}px) rotate(${spin*.6}deg) scale(1.05)`,boxShadow:'0 18px 22px #0007',offset:.5},{transform:`translate(${dx}px,${dy}px) rotate(${spin+rot}deg) scale(1)`,boxShadow:'0 3px 6px #0008'}],{duration:dur,easing:'cubic-bezier(.3,.6,.4,1)',fill:'forwards'});
 an.onfinish=()=>{f.remove();target.style.opacity='';target.style.setProperty('--lr',rot.toFixed(1)+'deg');target.classList.add('cgland');sfx('cgThud');if(opt&&opt.flip){setTimeout(()=>{target.classList.add('cgflip');sfx('cgSnap');},opt.flipDelay||0);}res();};},delay);});}
function cgCardsOf(i){return [...document.querySelectorAll(`#cg .cgs[data-i="${i}"] .cgh > .cgc, #cg .cgs[data-i="${i}"] .cgh > .sq`)];}
async function cgDealAnim(){const st=CG.st;if(!st)return;const o=$('cg');cgEnsureShoe();const n=st.seats.length,nc=st.hands[0].length;
 const order=[];for(let k=0;k<nc;k++)for(let j=1;j<=n;j++){const i=j%n;const el=cgCardsOf(i)[k];if(el)order.push([i,el]);}
 order.forEach(([,el])=>el.style.opacity='0');o.classList.add('cgdealing');CG.dealing=true;
 if(RM){order.forEach(([,el],q)=>setTimeout(()=>{el.style.opacity='';if(q%3===0)sfx('tick');},q*25));await new Promise(r=>setTimeout(r,order.length*25+150));}
 else{const sh=o.querySelector('.cgshoe');sh&&sh.classList.add('riffle');sfx('cgRiffle');await new Promise(r=>setTimeout(r,420));sh&&sh.classList.remove('riffle');
  const step=Math.min(140,1250/order.length),dur=Math.max(300,Math.min(420,step*3));const ps=order.map(([i,el],q)=>cgFly(el,q*step,dur,{flip:i===st.me&&st.meUp,flipDelay:(order.length-q)*step*0.15}));await Promise.all(ps);}
 if(CG.st!==st)return;o.classList.remove('cgdealing');CG.dealing=false;sfx('cgChip');}
const _cgd51=cgDeal;cgDeal=function(){if(CG.dealing)return;const prev=CG.st;_cgd51.apply(this,arguments);if(CG.st&&CG.st!==prev){sfx('cgChip');cgDealAnim();}};
const _xcn51=xdCheckNatural;xdCheckNatural=function(){if(CG.dealing)return setTimeout(xdCheckNatural,120);return _xcn51.apply(this,arguments);};
// rút bài / lật bài: theo dõi sau mỗi lần vẽ
const _cgr51=cgRender;cgRender=function(){const st=CG.st;const prevUp=st?(st._up||{}):{};_cgr51.apply(this,arguments);cgEnsureShoe();if(!st||CG.dealing)return;
 const up={};st.seats.forEach((s,i)=>{const r=st.res&&st.res[i];up[i]=!!(i===st.me?st.meUp:(st.reveal||(r&&r.done)||(st.open&&st.open[i])));});
 if(st.newCard){const key=JSON.stringify(st.newCard)+st.hands.map(h=>h.length).join();if(st._nk!==key){st._nk=key;const i=+Object.keys(st.newCard)[0],k=st.newCard[i];const el=cgCardsOf(i)[k];if(el){el.classList.remove('cgnew');if(RM){sfx('cgSlide');}else{el.style.opacity='0';cgFly(el,0,360,{flip:up[i]});}}}}
 // lật mới (nhà cái lật bài có hồi hộp)
 st.seats.forEach((s,i)=>{if(up[i]&&prevUp[i]===false&&!(st.phase==='look')){cgCardsOf(i).forEach((el,k)=>{el.style.setProperty('--fd',(i===0?k*260+200:k*90)+'ms');el.classList.add('cgflip');setTimeout(()=>sfx('cgSnap'),i===0?k*260+200:k*90);});}});
 st._up=up;};
// hiệu ứng đặc biệt khi tính tiền
const _cgs51=cgSettle;cgSettle=function(){const st=CG.st;const was=st&&st.phase;_cgs51.apply(this,arguments);if(!st||was==='done')return;
 let meSp=null;st.seats.forEach((s,i)=>{let k=null;if(CG.g==='xidach'){const kd=xdKind(st.hands[i],i===0?15:16).kind;k={xibang:'XÌ BÀNG!',xidach:'XÌ DÁCH!',ngulinh:'NGŨ LINH!',quac:'QUẮC!'}[kd]||null;}else if(bcScore(st.hands[i]).bacao)k='BA CÀO!';
  if(!k)return;const seat=document.querySelector(`#cg .cgs[data-i="${i}"]`);if(seat){const f=document.createElement('div');f.className='cgfx '+(k==='QUẮC!'?'bust':'gold');f.textContent=k;f.style.setProperty('--sd',(i*120+300)+'ms');seat.appendChild(f);if(k==='QUẮC!')seat.classList.add('cgshake');}if(i===st.me)meSp=k;});
 const me=st.res[st.me].v;setTimeout(()=>{if(meSp&&meSp!=='QUẮC!')sfx('cgFan');else if(meSp==='QUẮC!')sfx('cgBust');if(me>0)sfx('cgJingle');else if(me<0)sfx('cgLose');else sfx('cgChip');},420);};
