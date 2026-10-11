const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const R={};
for(const w of [360,461]){const p=await b.newPage({viewport:{width:w,height:w===360?800:1024}});p.on('pageerror',e=>errs.push(w+': '+e.message));
 await p.goto('http://localhost:8765/index.html?t=52'+w);await p.waitForTimeout(800);
 await p.evaluate(()=>{closeModal();PR.xu=100000;saveP();setInterval(()=>document.querySelectorAll('#badgeFX').forEach(e=>e.remove()),100);renderHome();});await p.waitForTimeout(300);
 R['home'+w]=await p.evaluate(()=>({ov:document.documentElement.scrollWidth-innerWidth,n:document.querySelectorAll('#modePick button').length}));await p.screenshot({path:`shots/v52-home-${w}.png`});
 await p.evaluate(()=>{setMode('baucua');openTables();bcRole('con');bcChip(500);bcPut('cua');bcPut('cua');bcChip(200);bcPut('tom');bcShake();});await p.waitForTimeout(700);await p.screenshot({path:`shots/v52-bc-shake-${w}.png`});await p.waitForTimeout(1000);
 const x0=await p.evaluate(()=>{const x=PR.xu;bcOpen();return x;});await p.waitForTimeout(600);
 R['con'+w]=await p.evaluate(x0=>({d:MG.st.dice,me:MG.st.res.me,exp:bcuaPay(MG.st.bets,MG.st.dice),ov:document.documentElement.scrollWidth-innerWidth}),x0);await p.screenshot({path:`shots/v52-bc-open-${w}.png`});
 await p.evaluate(()=>{bcRole('cai');bcShake();});await p.waitForTimeout(1600);await p.evaluate(()=>bcOpen());await p.waitForTimeout(400);
 R['cai'+w]=await p.evaluate(()=>({me:MG.st.res.me,sum:MG.st.res.me+MG.st.res.b.reduce((a,x)=>a+x,0),led:MG.st.ledger.length}));await p.screenshot({path:`shots/v52-bc-cai-${w}.png`});await p.close();}
console.log(JSON.stringify(R),errs);await b.close();})();
