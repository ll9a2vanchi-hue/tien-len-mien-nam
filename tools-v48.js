const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const R={};const errs=[];
for(const [W,H,rm] of [[360,800,false],[461,1024,false],[360,800,true]]){const p=await (await b.newContext({viewport:{width:W,height:H},reducedMotion:rm?'reduce':'no-preference'})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(2500);await p.evaluate(()=>{setInterval(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},150);closeModal();PR.xu=50000;checkBadges(PR);saveP();openCasino('3cao');CG.bet=500;cgDeal();});await p.waitForTimeout(1200);
const tag=W+(rm?'rm':'');const box=await p.locator('.sq[data-k="0"]').boundingBox();
if(!rm){await p.mouse.move(box.x+box.width/2,box.y+box.height-5);await p.mouse.down();await p.mouse.move(box.x+box.width/2,box.y+box.height*0.45,{steps:6});await p.waitForTimeout(150);await p.screenshot({path:`shots/v48-squeeze-${tag}.png`});
 await p.mouse.move(box.x+box.width/2,box.y-box.height*0.3,{steps:6});await p.mouse.up();}else{await p.mouse.click(box.x+box.width/2,box.y+box.height/2);}
await p.waitForTimeout(300);R[tag]={f0:await p.evaluate(()=>CG.st.flip.slice()),ph:await p.evaluate(()=>CG.st.phase)};
await p.evaluate(()=>bcFlip());await p.waitForTimeout(2200);await p.screenshot({path:`shots/v48-bc-res-${tag}.png`});
R[tag].ov=await p.evaluate(()=>[...document.querySelectorAll('#cg *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).length);R[tag].stamps=await p.evaluate(()=>[...document.querySelectorAll('.cgstamp b')].map(e=>e.textContent));
if(!rm){await p.evaluate(()=>{closeCasino();openCasino('xidach');CG.bet=200;cgDeal();});await p.waitForTimeout(1000);
 for(let i=0;i<6;i++){const ph=await p.evaluate(()=>CG.st.phase);if(ph!=='me')break;await p.evaluate(()=>{xdTotal(CG.st.hands[3])<16?xdHit():xdStand();});await p.waitForTimeout(500);}
 await p.waitForTimeout(5500);await p.screenshot({path:`shots/v48-xd-res-${tag}.png`});R[tag].xd=await p.evaluate(()=>[...document.querySelectorAll('.cgsc')].map(e=>e.textContent));R[tag].xov=await p.evaluate(()=>[...document.querySelectorAll('#cg *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).length);}}
console.log(JSON.stringify(R),errs);await b.close();})();
