const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base='http://localhost:8765/index.html';const errs=[];const R={};const tag=Math.random().toString(36).slice(2,6);
async function mk(uid,vp,nm){const ctx=await b.newContext({viewport:vp,hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(uid+': '+e.message));
 await p.goto(base+'?t=1');await p.waitForTimeout(800);
 await p.evaluate(async([uid,nm,tag])=>{closeModal();await loadSB();await new Promise(r=>setTimeout(r,800));USER={id:uid,email:uid+'@t.invalid'};PR.name=nm;PR.xu=50000;checkBadges(PR);saveP();setInterval(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},150);
  chan=(topic)=>SB.channel(topic.replace('tlmn:','tlmn-uis'+tag+'-'),{config:{broadcast:{self:false},presence:{key:USER.id}}});
  ensurePlayer=async()=>{MYCODE='TEST01';};rtAuth=async()=>{};loadFriendSet=async()=>{};renderFriends=async()=>{};window._hands=0;},[uid,nm,tag]);return p;}
const A=await mk('aaaa-1',{width:412,height:915},'An'),B=await mk('bbbb-2',{width:360,height:800},'Bình');
await A.evaluate(()=>{joinLobby();});await B.evaluate(()=>{joinLobby();});await A.waitForTimeout(2500);
await A.evaluate(()=>{setMode('3cao');openCasino('3cao');cgSetup('n',4);cgSetup('role','cai');CG.bet=200;cgDeal();lobbyTrack();});await A.waitForTimeout(3500);
R.pres=await B.evaluate(()=>{const p=lobbyPres().find(x=>x.uid==='aaaa-1');return p&&{st:plStatus(p),share:p.share};});
await B.evaluate(()=>plTap('aaaa-1'));await B.waitForTimeout(300);R.btn=await B.evaluate(()=>(document.querySelector('.ospx')||{}).textContent);
await B.evaluate(()=>specOff('aaaa-1','An'));await B.waitForTimeout(3000);
R.look=await B.evaluate(()=>OSV.d&&{k:OSV.d.k,phase:OSV.d.phase,cards:OSV.d.seats.map(s=>s.cards)});
R.cnt=await A.evaluate(()=>(document.getElementById('ospCnt')||{}).textContent);
await B.screenshot({path:'shots/v50-ospec-look.png'});
await A.evaluate(()=>bcFlip());await A.waitForTimeout(3500);R.done=await B.evaluate(()=>OSV.d&&{phase:OSV.d.phase,v:OSV.d.seats.map(s=>s.v),open:OSV.d.seats.every(s=>s.cards)});await B.screenshot({path:'shots/v50-ospec-done.png'});
// tiến lên
await A.evaluate(()=>{closeCasino();setMode('mn');startTable(4);});await A.waitForTimeout(5000);
R.tl=await B.evaluate(()=>OSV.d&&{k:OSV.d.k,gm:gmLabel(OSV.d.gm),hidden:OSV.d.seats.every(s=>s.cards===null),cnt:OSV.d.seats.map(s=>s.cnt)});await B.screenshot({path:'shots/v50-ospec-tl.png'});
await A.evaluate(()=>{SHARE=false;lobbyTrack();});await A.waitForTimeout(2500);await B.evaluate(()=>{specOffClose();closeModal();plTap('aaaa-1');});await B.waitForTimeout(300);R.btnOff=await B.evaluate(()=>!!document.querySelector('.ospx'));
console.log(JSON.stringify(R,null,0),errs);await b.close();})();
