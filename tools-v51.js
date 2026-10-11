const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const R={};
for(const rm of ['no-preference','reduce']){const ctx=await b.newContext({viewport:{width:360,height:800},reducedMotion:rm});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/index.html?t=51');await p.waitForTimeout(800);
 await p.evaluate(()=>{closeModal();PR.xu=200000;saveP();setInterval(()=>document.querySelectorAll('#badgeFX').forEach(e=>e.remove()),100);setMode('xidach');openCasino('xidach');cgSetup('n',6);cgSetup('role','con');window._t0=performance.now();cgDeal();
  (function w(){if(!CG.dealing&&performance.now()-_t0>100){window._dt=performance.now()-_t0;return;}requestAnimationFrame(w);})();});
 await p.waitForTimeout(rm==='reduce'?250:1250);await p.screenshot({path:`shots/v51-deal-${rm}.png`});await p.waitForTimeout(2500);
 R[rm]=await p.evaluate(()=>({dt:Math.round(window._dt),ph:CG.st.phase,hidden:[...document.querySelectorAll('#cg .cgh .cgc')].filter(e=>e.style.opacity==='0').length,fly:document.querySelectorAll('.cgfly').length}));
 if(rm!=='reduce'){await p.evaluate(()=>xdHit());await p.waitForTimeout(150);await p.screenshot({path:'shots/v51-draw.png'});await p.waitForTimeout(500);await p.evaluate(()=>{if(CG.st.phase==='me'){CG.st.hands[CG.st.me]=[44,40];xdStand();}});await p.waitForTimeout(5000);
  R.end=await p.evaluate(()=>({ph:CG.st.phase,fx:[...document.querySelectorAll('.cgfx')].map(e=>e.textContent)}));await p.screenshot({path:'shots/v51-settle.png'});}
 await ctx.close();}
console.log(JSON.stringify(R),errs);await b.close();})();
