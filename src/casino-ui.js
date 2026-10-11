// ===== Sòng phụ: 3 cào & Xì dách (offline, đấu với nhà cái máy) =====
const CG={g:null,bet:200,st:null};const CG_NAMES=['Anh Tư','Chị Bảy','Chú Năm','Cô Ba','Bác Hai','Anh Sáu','Bé Út','Ông Tám','Dì Chín','Anh Mười'];const CG_AV=['🧔','👩','👨‍🦳','👵','👴','🧑','👱‍♀️','👨','👩‍🦰','🤵'];
const CG_BETS=[100,200,500,1000,2000,5000];
function cgCard(c,up,i,cls){if(!up)return `<div class="card back cgc ${cls||''}" style="--d:${i||0}"></div>`;const d=cardEl(c);d.classList.add('cgc');if(cls)cls.split(' ').forEach(k=>k&&d.classList.add(k));d.style.setProperty('--d',i||0);return d.outerHTML;}
function cgSeats(){const pick=[...CG_NAMES.keys()].sort(()=>Math.random()-0.5);return [{name:'Nhà cái',av:'🎩',dealer:1},{name:CG_NAMES[pick[0]],av:CG_AV[pick[0]]},{name:CG_NAMES[pick[1]],av:CG_AV[pick[1]]},{name:'Bạn',av:(AVATARS[0]||['🙂'])[0],me:1}];}
function openCasino(g){closeModal();CG.g=g;CG.st=null;if(!CG_BETS.includes(CG.bet))CG.bet=200;let o=$('cg');if(!o){o=document.createElement('div');o.id='cg';document.body.appendChild(o);}document.body.classList.add('cgon');cgRender();}
function closeCasino(){if(CG.st&&CG.st.phase!=='done'&&CG.st.phase!=='bet'){if(!confirm('Đang chơi dở, rời bàn sẽ mất tiền cược. Rời?'))return;}const o=$('cg');if(o)o.remove();document.body.classList.remove('cgon');CG.st=null;showHome();}
function cgTitle(){return CG.g==='3cao'?'🃏 3 Cào':'🂱 Xì Dách';}
function cgRender(){const o=$('cg');if(!o)return;const st=CG.st;const seats=st?st.seats:(CG.seats=CG.seats||cgSeats());
 const seatHTML=(s,i)=>{const h=st?st.hands[i]:[];const up=st&&(i===3?st.meUp:st.reveal||(i!==0&&st.phase==='done'));const r=st&&st.res&&st.res[i];
  const sq=st&&i===3&&CG.g==='3cao'&&st.phase==='look';
  const cards=sq?h.map((c,k)=>`<div class="sq ${st.flip[k]?'done':''}" data-k="${k}" style="--d:${k+9}">${cgCard(c,true,k+9,'sqf')}<div class="card back sqb"></div></div>`).join(''):h.map((c,k)=>cgCard(c,up,k+i*3,(st.newCard&&st.newCard[i]===k)?'cgnew':'')).join('');
  const stamp=r&&st.phase==='done'&&i>0?`<div class="cgstamp ${r.v>0?'w':r.v<0?'l':'d'} ${st.stampFresh?'in':''}" style="--sd:${i*120}ms"><b>${r.v>0?'THẮNG':r.v<0?'THUA':'HÒA'}</b>${r.v?`<small>${r.v>0?'+':''}${fmt(r.v)}</small>`:''}</div>`:'';
  const dst=r&&st.phase==='done'&&i===0?`<div class="cgstamp ${r.v>0?'w':r.v<0?'l':'d'} ${st.stampFresh?'in':''}" style="--sd:0ms"><b>${r.v>0?'CÁI ĂN':r.v<0?'CÁI THUA':'HÒA'}</b>${r.v?`<small>${r.v>0?'+':''}${fmt(r.v)}</small>`:''}</div>`:'';
  return `<div class="cgs cgs${i} ${st&&st.turn===i?'turn':''}"><div class="cgp"><span class="av" style="--avc:#3a5">${s.av}</span><b>${esc(s.name)}</b></div>
  <div class="cgh ${sq?'sqh':''}">${cards}${stamp}${dst}</div>${st&&up&&h.length&&!sq?`<div class="cgsc ${cgSpecial(h,i)?'sp':''}">${cgScoreLab(h,i)}</div>`:''}</div>`;};
 o.classList.toggle('cgfresh',!!(st&&st.fresh));if(st)st.fresh=false;const _sf=st&&st.stampFresh;o.innerHTML=`<div class="cgtop"><button class="alt ic" onclick="closeCasino()">${I('back')}</button><b>${cgTitle()}</b><span class="cgxu">${I('coin')} <span id="cgXu">${fmt(PR.xu)}</span></span></div>
 <div class="cgtbl">${seats.map(seatHTML).join('')}<div class="cgmsg" id="cgMsg">${st?st.msg||'':(CG.g==='xidach'?'Xì bàng x3 · Xì dách x2 · Ngũ linh x2 · dưới 16 là non · quá 21 là quắc':'Ba cào (J Q K) x2 · điểm = số cuối của tổng')}</div></div>
 <div class="cgctl">${cgCtl()}</div>`;try{svaScan(o);}catch(e){}if(st&&st.stampFresh){st.stampFresh=false;setTimeout(()=>sfx('thud'),250);}sqWire();}
function cgScoreLab(h,i){if(CG.g==='3cao'){const s=bcScore(h);return s.bacao?'BA CÀO':s.score+' nút';}const k=xdKind(h,i===0?15:16);if(k.kind==='thuong'||(CG.st&&CG.st.early&&k.kind==='non'))return k.total+' điểm';return XD_LABEL[k.kind].toUpperCase()+(k.kind==='quac'||k.kind==='non'||k.kind==='ngulinh'?' · '+k.total:'');}
function cgSpecial(h,i){if(CG.g==='3cao')return bcScore(h).bacao;const k=xdKind(h,i===0?15:16).kind;return ['xibang','xidach','ngulinh'].includes(k)?1:['quac','non'].includes(k)&&!(CG.st&&CG.st.early)?2:0;}
function cgCtl(){const st=CG.st;
 if(!st||st.phase==='done')return `<div class="cgbets">${CG_BETS.map(b=>`<button class="${b===CG.bet?'':'alt'}" ${b>PR.xu?'disabled':''} onclick="CG.bet=${b};cgRender()">${kxu(b)}</button>`).join('')}</div><button class="cgbig" ${PR.xu<CG.bet?'disabled':''} onclick="cgDeal()">${st?'Ván mới':'Chia bài'} · ${fmt(CG.bet)} xu</button>`;
 if(CG.g==='3cao')return st.phase==='look'?`<p class="small sqhint">${RM?'Chạm vào từng lá để lật':'Vuốt lên từng lá để nặn bài'}</p><button class="cgbig" onclick="bcFlip()">Lật hết 🃏</button>`:'';
 if(st.phase==='me'){const k=xdKind(st.hands[3],16);const can=k.total>=16||st.hands[3].length>=5;return `<div class="cgrow"><button class="cgbig" ${st.hands[3].length>=5?'disabled':''} onclick="xdHit()">Rút bài</button><button class="cgbig alt" ${can?'':'disabled'} onclick="xdStand()">Dằn${can?'':' (cần ≥16)'}</button></div>`;}
 return '<p class="small" style="text-align:center">Đang chờ…</p>';}
function cgDeck(){const d=[...Array(52).keys()];for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
function cgDeal(){if(PR.xu<CG.bet)return toast('Không đủ xu');sfx('shuffle');const deck=cgDeck();const seats=CG.seats||cgSeats();const n=CG.g==='3cao'?3:2;
 CG.st={seats,deck,hands:seats.map(()=>deck.splice(0,n)),phase:CG.g==='3cao'?'look':'me',meUp:CG.g!=='3cao',reveal:false,res:null,msg:'',turn:CG.g==='3cao'?-1:3,newCard:null,fresh:true,flip:[false,false,false]};
 for(let i=0;i<n*4;i++)setTimeout(()=>sfx('tick'),i*90);
 if(CG.g==='xidach')setTimeout(xdCheckNatural,700);else CG.st.msg='Nặn bài: vuốt từng lá của bạn';cgRender();}
// ---- 3 cào
function bcFlip(){const st=CG.st;st.meUp=true;sfx('flip');st.phase='wait';st.msg='Nhà cái lật bài…';cgRender();setTimeout(()=>{st.reveal=true;sfx('flip');cgSettle();},1100);}
// ---- Xì dách
function xdCheckNatural(){const st=CG.st;if(!st)return;const kd=xdKind(st.hands[0],15),km=xdKind(st.hands[3],16);
 if(['xibang','xidach'].includes(kd.kind)||['xibang','xidach'].includes(km.kind)){st.reveal=true;st.early=true;st.msg=(['xibang','xidach'].includes(kd.kind)?'Nhà cái '+XD_LABEL[kd.kind]+'!':'Bạn '+XD_LABEL[km.kind]+'!');sfx('fanfare');return cgSettle();}
 st.msg='Lượt bạn: Rút hoặc Dằn (cần ≥16 điểm)';cgRender();}
function xdHit(){const st=CG.st;if(st.phase!=='me')return;st.hands[3].push(st.deck.pop());st.newCard={3:st.hands[3].length-1};sfx('deal');const k=xdKind(st.hands[3],16);
 if(k.kind==='quac'){st.msg='Quắc rồi! ('+k.total+')';sfx('thud');return xdBots();}if(st.hands[3].length>=5){st.msg='Ngũ linh!';sfx('chime');return xdBots();}cgRender();}
function xdStand(){const st=CG.st;if(st.phase!=='me')return;st.msg='Bạn dằn '+xdTotal(st.hands[3]);sfx('tap');xdBots();}
function xdBots(){const st=CG.st;st.phase='bots';st.turn=-1;cgRender();let t=500;
 [1,2].forEach(i=>{while(xdBotShould(st.hands[i],16+(i===2?1:0))){const c=st.deck.pop();st.hands[i].push(c);const k=st.hands[i].length-1;setTimeout(()=>{st.newCard={[i]:k};sfx('deal');cgRender();},t);t+=450;}});
 setTimeout(()=>{st.turn=0;st.reveal=true;st.msg='Nhà cái lật bài…';sfx('flip');cgRender();let t2=700;while(xdDealerShould(st.hands[0])){st.hands[0].push(st.deck.pop());const k=st.hands[0].length-1;setTimeout(()=>{st.newCard={0:k};sfx('deal');cgRender();},t2);t2+=600;}setTimeout(cgSettle,t2+300);},t+200);}
// ---- tính tiền chung
function cgSettle(){const st=CG.st;st.phase='done';st.stampFresh=true;st.turn=-1;st.reveal=true;st.meUp=true;const bet=CG.bet;st.res={};let me=0;
 if(CG.g==='3cao'){const d=bcScore(st.hands[0]);[1,2,3].forEach(i=>{const p=bcScore(st.hands[i]);const v=bcPay(p,d,bet);st.res[i]={v,lab:v>0?'Thắng':v<0?'Thua':'Hòa'};if(i===3){me=v;if(p.bacao){bst('bacao');}}});}
 else{const d=xdKind(st.hands[0],15);[1,2,3].forEach(i=>{const p=xdKind(st.hands[i],16);const v=xdSettle(p,d,bet);st.res[i]={v,lab:(XD_LABEL[p.kind]&&!(st.early&&p.kind==='non')?XD_LABEL[p.kind]+' · ':'')+(v>0?'Thắng':v<0?'Thua':'Hòa')};if(i===3){me=v;if(v>0&&p.kind==='xibang')bst('xibang');if(v>0&&p.kind==='ngulinh')bst('ngulinh');}});}
 const dsum=-Object.values(st.res).reduce((a,r)=>a+r.v,0);st.res[0]={v:dsum,lab:'Nhà cái'};
 const x0=PR.xu;PR.xu=Math.max(0,PR.xu+me);const won=me>0;bst(CG.g==='3cao'?'bcGames':'xdGames');if(won){bst(CG.g==='3cao'?'bcWin':'xdWin');questEvent(PR,CG.g==='3cao'?'bcwin':'xdwin');}questEvent(PR,'cgplay');
 const xp=won?30:me===0?15:10;const up=addXp(PR,xp);st.msg=(me>0?`🎉 Bạn thắng +${fmt(me)} xu`:me<0?`Bạn thua ${fmt(me)} xu`:'Hòa')+` · +${xp} XP`;
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
