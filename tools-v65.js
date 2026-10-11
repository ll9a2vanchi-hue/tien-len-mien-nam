const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const R={};const errs=[];
for(const w of [360,461])for(const g of ['xito','poker'])for(const rm of [false,true]){if(rm&&w===461)continue;const ctx=await b.newContext({viewport:{width:w,height:800},reducedMotion:rm?'reduce':'no-preference'});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/index.html?t='+Date.now());await p.waitForTimeout(900);
 await p.evaluate(g=>{closeModal();PR.xu=100000;saveP();setInterval(()=>{document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},60);setMode(g);openTables();if(g==='xito'){xtSet('n',4);xtSet('bet',500);xtDeal();}else{pkSet('n',4);pkSet('bet',500);pkDeal();}},g);
 // chờ tới lượt bot đầu tiên rồi cho bot tố tất
 await p.waitForFunction(()=>{const st=MG.st;return st&&st.phase==='bet'&&!st.anim&&st.b.cur>0;},null,{timeout:20000}).catch(()=>{});
 await p.evaluate(g=>{const st=MG.st;window._bi=st.b.cur;window._stop=1;(g==='xito'?xtDo:pkDo)(st.b.cur,'allin');},g);
 const tag=`${g}-${w}${rm?'-rm':''}`;await p.waitForTimeout(300);await p.screenshot({path:`shots/v65-${tag}-bot-a.png`});await p.waitForTimeout(650);await p.screenshot({path:`shots/v65-${tag}-bot-b.png`});
 R[tag+'-bot']=await p.evaluate(()=>({fx:!!document.querySelector('.aifx'),chips:document.querySelectorAll('.aichip').length,rm:RM}));
 await p.waitForFunction(()=>{const st=MG.st;return st&&st.phase==='bet'&&!st.anim&&st.b.cur===0;},null,{timeout:20000}).catch(()=>{});
 await p.evaluate(g=>{(g==='xito'?xtDo:pkDo)(0,'allin');},g);await p.waitForTimeout(450);await p.screenshot({path:`shots/v65-${tag}-me-a.png`});await p.waitForTimeout(500);await p.screenshot({path:`shots/v65-${tag}-me-b.png`});
 await p.waitForTimeout(1500);R[tag+'-after']=await p.evaluate(()=>({fx:!!document.querySelector('.aifx'),allinSeats:document.querySelectorAll('.pks.allin').length,ph:MG.st.phase,ov:document.documentElement.scrollWidth-innerWidth}));await p.screenshot({path:`shots/v65-${tag}-badge.png`});
 await p.waitForFunction(()=>MG.st.phase==='done',null,{timeout:30000}).catch(()=>{});R[tag+'-done']=await p.evaluate(()=>({ph:MG.st.phase,allinSeats:document.querySelectorAll('.pks.allin').length}));await ctx.close();}
console.log(JSON.stringify(R));console.log(errs);await b.close();})();
