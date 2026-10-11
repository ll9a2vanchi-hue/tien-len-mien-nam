const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const p=await (await b.newContext({viewport:{width:412,height:915},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();PR.daily&&(PR.daily.last=dk());startTable(2);
 window._ap=setInterval(()=>{try{if(G&&!G.over&&!DEALING&&G.turn===0)autoMove();}catch(e){}},120);});
const out=[];
for(let g=0;g<3;g++){for(let i=0;i<40;i++){await p.waitForTimeout(200);if(await p.evaluate(()=>!DEALING))break;}
 const names=await p.evaluate(()=>NAMES[2]+':'+BXU[NAMES[2]]);
 for(let i=0;i<300;i++){await p.waitForTimeout(250);if(await p.evaluate(()=>G.over&&!!document.getElementById('finGo')))break;}
 await p.waitForTimeout(500);await p.evaluate(()=>endFinal());await p.waitForTimeout(1500);
 const r=await p.evaluate(()=>{const tot=document.querySelector('.ledger .tot b');const lines=[...document.querySelectorAll('.ledger .li')].map(e=>e.textContent);return {tot:tot&&tot.textContent,delta:PR.xu-LEDG.xu0,lines,pn:(document.querySelector('.ledger .pn')||{}).textContent};});
 out.push({names,...r});if(g===0)await p.screenshot({path:'shots/v29-ledger.png'});
 await p.evaluate(()=>{closeModal();});await p.waitForTimeout(500);
 if(g===1)await p.evaluate(()=>{BSESS.bots[2].xu=0;BXU[NAMES[2]]=0;saveBS();});
 await p.evaluate(()=>{document.getElementById('badgeFX')?.remove();_bShow=false;BQ.length=0;hideStartOv&&hideStartOv();newGame();});}
console.log(JSON.stringify(out,null,1),errs);await b.close();})();
