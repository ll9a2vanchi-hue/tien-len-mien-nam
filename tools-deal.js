const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
for(const rm of ['no-preference','reduce']){const ctx=await b.newContext({viewport:{width:461,height:1024},hasTouch:true,reducedMotion:rm});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(900);await p.evaluate(()=>{closeModal();startTable(3);});
 await p.waitForTimeout(rm==='reduce'?200:1100);await p.screenshot({path:`shots/v9-deal-${rm}.png`});
 const d=await p.evaluate(()=>({dealing:DEALING,cards:document.querySelectorAll('#dealFX .dcard').length,hist:G.hist.length}));
 await p.waitForTimeout(2500);const a=await p.evaluate(()=>({dealing:DEALING,fx:!!document.getElementById('dealFX')}));console.log(rm,JSON.stringify(d),JSON.stringify(a));
 await p.evaluate(()=>newGame(4));await p.waitForTimeout(300);await p.mouse.click(200,400);await p.waitForTimeout(100);console.log('skip',await p.evaluate(()=>DEALING));await ctx.close();}
console.log('errors',errs);await b.close();})();
