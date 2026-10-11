const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await (await b.newContext({viewport:{width:360,height:800}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(3000);await p.evaluate(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());closeModal();PR.xu=300;saveP();openTables();});await p.waitForTimeout(400);
const dis=await p.evaluate(()=>document.querySelector('.betrow .mbet').disabled);
await p.evaluate(()=>{PR.xu=200000;saveP();openTables();setTblBet(10000);});await p.waitForTimeout(400);
const ov=await p.evaluate(()=>[...document.querySelectorAll('#modalIn *')].some(e=>e.getBoundingClientRect().right>innerWidth+1));await p.screenshot({path:'shots/v41-tables.png'});
await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(3500);
const r=await p.evaluate(()=>({ai:BOTAI.slice(1),xu:[1,2,3].map(seatXu)}));
for(let i=0;i<150;i++){const o=await p.evaluate(()=>{if(G.over)return 1;if(G.turn===0&&typeof autoMove==='function')autoMove();return 0;});if(o)break;await p.waitForTimeout(400);}
await p.waitForTimeout(800);const bonus=await p.evaluate(()=>(G.lastRes||{}).bxu||0);
await p.evaluate(()=>{setTblBet(1000);closeModal();startTable(4);});await p.waitForTimeout(3000);const r2=await p.evaluate(()=>BOTAI.slice(1));
console.log(JSON.stringify({dis,ov,r,bonus,r2}),errs);await b.close();})();
