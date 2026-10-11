const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await (await b.newContext({viewport:{width:360,height:800}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(2500);await p.evaluate(()=>{setInterval(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},150);closeModal();PR.xu=20000;checkBadges(PR);saveP();setMode('demla');});
await p.waitForTimeout(400);await p.screenshot({path:'shots/v44-home.png'});
await p.evaluate(()=>{PR.bet=1300;openTables();});await p.waitForTimeout(400);await p.screenshot({path:'shots/v44-tables.png'});
const out=[];for(let g=0;g<3;g++){await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(3000);
 for(let i=0;i<200;i++){const o=await p.evaluate(()=>{if(G.over)return 1;if(G.turn===0&&!DEALING)autoMove();return 0;});if(o)break;await p.waitForTimeout(300);}
 await p.waitForTimeout(1500);try{await p.evaluate(()=>endFinal());}catch(e){}await p.waitForTimeout(3500);
 out.push(await p.evaluate(()=>({mode:G.mode,rank:[...G.finished],dl:G.dl,parts:ledgerParts().parts,thui:(typeof THUI!=='undefined'&&THUI)?THUI.list.length:0})));
 if(g===0)await p.screenshot({path:'shots/v44-result.png'});await p.evaluate(()=>closeModal());}
console.log(JSON.stringify(out),errs);await b.close();})();
