const {chromium,devices}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base=process.argv[2]||'http://localhost:8765/index.html';
for(const rm of ['reduce','no-preference']){const ctx=await b.newContext({viewport:{width:461,height:1024},hasTouch:true,isMobile:true,deviceScaleFactor:2,reducedMotion:rm});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(base);await p.waitForTimeout(900);await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(1500);
const x0=await p.evaluate(()=>PR.xu);await p.tap('#s3 .av');await p.waitForTimeout(300);const open=await p.evaluate(()=>$('modal').style.display);
await p.tap('#modalIn .sitem >> nth=0');await p.waitForTimeout(rm==='reduce'?150:400);
const st=await p.evaluate(()=>({modal:$('modal').style.display,proj:document.querySelectorAll('.proj').length,splat:document.querySelectorAll('.splat').length,toast:($('toast')||{}).innerText}));
await p.screenshot({path:`/workspace/tienlen/shots/throw-${rm}.png`});await p.waitForTimeout(rm==='reduce'?350:500);console.log('splat after',await p.evaluate(()=>document.querySelectorAll('.splat').length));await p.screenshot({path:`/workspace/tienlen/shots/splat-${rm}.png`});
console.log(rm,'menu',open,JSON.stringify(st),'xu',x0-await p.evaluate(()=>PR.xu),'errors',errs);await ctx.close();}await b.close();})();
