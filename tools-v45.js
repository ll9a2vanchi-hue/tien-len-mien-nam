const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const R={};
for(const W of [360,461]){const p=await (await b.newContext({viewport:{width:W,height:W==360?800:1024}})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(2500);await p.evaluate(()=>{setInterval(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},150);closeModal();PR.xu=20000;checkBadges(PR);saveP();setMode('3cao');});
await p.waitForTimeout(300);if(W==360)await p.screenshot({path:'shots/v45-home.png'});
await p.evaluate(()=>playBots());await p.waitForTimeout(400);await p.evaluate(()=>{CG.bet=500;cgDeal();});await p.waitForTimeout(800);await p.screenshot({path:`shots/v45-bc-deal-${W}.png`});
const x0=await p.evaluate(()=>PR.xu);await p.evaluate(()=>bcFlip());await p.waitForTimeout(1800);await p.screenshot({path:`shots/v45-bc-res-${W}.png`});
R[W]=await p.evaluate(x0=>({d:PR.xu-x0,me:CG.st.res[3],msg:CG.st.msg,ov:[...document.querySelectorAll('#cg *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).length}),x0);
// xì dách thử
await p.evaluate(()=>{closeCasino();openCasino('xidach');CG.bet=200;cgDeal();});await p.waitForTimeout(1000);
for(let i=0;i<6;i++){const ph=await p.evaluate(()=>CG.st.phase);if(ph!=='me')break;await p.evaluate(()=>{const t=xdTotal(CG.st.hands[3]);t<16?xdHit():xdStand();});await p.waitForTimeout(500);}
await p.waitForTimeout(5000);await p.screenshot({path:`shots/v46-xd-${W}.png`});R['xd'+W]=await p.evaluate(()=>({ph:CG.st.phase,res:CG.st.res,msg:CG.st.msg,h:CG.st.hands.map(h=>xdTotal(h))}));}
console.log(JSON.stringify(R),errs);await b.close();})();
