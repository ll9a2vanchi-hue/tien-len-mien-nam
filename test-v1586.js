const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const vge=(a,b)=>{const x=String(a).split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)>(y[i]||0);}return true;};
for(const w of [360,412,461]){const p=await H.open(b,w,800,()=>{let x=0;while(levelInfo(x).level<35)x+=50;PR.xp=x;PR.xu=5e6;saveP();showHome();});
 const r=await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const out={v:APP_V,lv:myLevelNow(PR)};const fs=e=>e?parseFloat(getComputedStyle(e).fontSize):0;
  const ovf=sel=>[...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<-1||r.right>innerWidth+1)}).length;
  const clip=sel=>[...document.querySelectorAll(sel)].filter(e=>e.offsetParent&&e.scrollWidth>e.clientWidth+1).length;
  out.homeLv=fs(document.querySelector('#home .pcard .pt .lvb'));
  const bets=()=>{const pb=document.querySelector('.lvpickbtn');if(pb)pb.click();const bs=[...document.querySelectorAll(pb?'.lvpickgrid button':'.lvbets button')];if(pb)setTimeout(closeModal,0);return {n:bs.length,lk:bs.filter(x=>x.classList.contains('lk')).map(x=>x.textContent).join('|')};};
  const G={};
  openCasino('3cao');await sl(200);G.c3={bets:bets(),ovf:ovf('.lvbets button,.cgbx,.slv'),clip:clip('.lvbets button,.cgbx')};cgBet(150000);G.c3.lockHeld=CG.bet!==150000;cgBet(30000);
  G.c3.bet=CG.bet;G.c3.minBot=Math.min(...CG.seats.filter(s=>!s.me&&!s.dealer).map(s=>CG.bxu[s.name]));G.c3.dealer=CG.bxu['Nhà cái'];G.c3.botFs=fs(document.querySelector('.cgs:not(.me) .cgbx'));G.c3.lvFs=fs(document.querySelector('.cgs:not(.me) .slv .lvb'));closeCasino();
  for(const g of ['domino','xito','poker'])/*v1.58.7: Bầu cua chuyển sang chọn mức bàn — xem test-v1587.js*/{mgOpen(g);await sl(300);const o={bets:bets()};const set={domino:v=>dmSet('bet',v),xito:v=>xtSet('bet',v),poker:v=>pkSet('bet',v),baucua:v=>bcChip(v)}[g];
   set(100000);o.lockHeld=MG.bet!==100000;set(30000);await sl(100);o.bet=MG.bet;const bots=g==='domino'?MG.dmBots:g==='xito'?MG.xtBots:g==='poker'?MG.pkBots:MG.st.bots;o.minBot=Math.min(...bots.map(x=>MG.bxu[x.name]));
   if(g==='baucua')o.dealer=MG.bxu['Nhà cái'];o.ovf=ovf((g==='baucua'?'.lvbets':'.lvbets button')+',.cgbx,.slv,.pkstk');if(g==='baucua'){const c=document.querySelector('#mg .lvbets'),s=c.querySelector('button:not(.alt)').getBoundingClientRect(),cr=c.getBoundingClientRect();o.selVis=s.left>=cr.left-1&&s.right<=cr.right+1;o.oneRow=new Set([...c.children].map(x=>x.offsetTop)).size===1;}o.clip=clip('.lvbets button,.cgbx');o.botFs=fs([...document.querySelectorAll('#mg .mgseat .cgbx')].find(e=>e.offsetParent));o.lvFs=fs(document.querySelector('#mg .slv .lvb'));
   if(g==='poker'){pkDeal();await sl(900);o.stkFs=fs(document.querySelector('#mg .pkstk'));o.ovf+=ovf('.pkstk');}G[g]=o;mgClose(1);await sl(100);}
  out.G=G;out.hi=hiBetReq(20000)===1&&hiBetReq(150000)===6;out.xp=[modeXp('xito',30000),modeXp('xito',200)];return out;});
 if(w===412)console.log(JSON.stringify(r));
 ok(vge(r.v,'1.58.6'),'version');ok(r.lv===35,'lv 35');ok(r.homeLv>=16,'home level badge big '+r.homeLv);ok(r.hi,'TLMN star tiers unchanged');ok(r.xp[0]===r.xp[1],'XP not scaled by bet');
 for(const [g,o] of Object.entries(r.G)){ok(o.bets.n===13&&o.bets.lk==='50k🔒 Lv 45|70k🔒 Lv 60|100k🔒 Lv 80|150k🔒 Lv 100',g+' tiers/locks '+o.bets.lk);ok(o.lockHeld,g+' locked tier not selectable');ok(o.bet===30000,g+' 30k unlocked at Lv35');
  const k=g==='poker'?20:g==='baucua'?2:10;ok(o.minBot>=30000*k,g+' bots funded '+o.minBot);if(o.dealer!=null)ok(o.dealer>=30000*50,g+' dealer funded');
  ok(o.ovf===0&&o.clip===0,g+' fits '+w+' ovf='+o.ovf+' clip='+o.clip);if(g!=='poker')ok(o.botFs>=11.5,g+' bot xu font '+o.botFs);ok(!o.lvFs||o.lvFs>=11.5,g+' lv font '+o.lvFs);if(g==='baucua')ok(o.selVis&&o.oneRow,'baucua chip strip 1 row, selected visible');if(o.stkFs!=null)ok(o.stkFs>=12,'poker stack font '+o.stkFs);}
 await p.close();}
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
