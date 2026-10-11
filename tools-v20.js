const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
for(const W of [360,412,461]){const p=await (await b.newContext({viewport:{width:W,height:900},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(3000);
 await p.evaluate(()=>{$('bChat').style.display='';render();});const fit=await p.evaluate(()=>{const r=[...document.querySelectorAll('#ctrl button')].filter(b=>b.offsetParent).map(b=>b.getBoundingClientRect());return r.every(x=>x.right<=innerWidth+0.5&&x.left>=-0.5)&&r.length>=5;});t('ctrl fits '+W,fit);
 if(W===360)await p.screenshot({path:'shots/v20-ctrl-360.png'});
 if(W===461){// timeout test with short timer
  await p.evaluate(()=>{window.step=()=>{};G.turn=0;G.cur=detect([50]);G.curBy=2;G.pile=[50];G.passed=[0,0,0,0];G.first=false;render();});
  await p.waitForTimeout(15800);t('auto pass on timeout',await p.evaluate(()=>G.passed[0]===1||G.turn!==0));
  for(let k=0;k<2;k++){await p.evaluate(()=>{G.turn=0;G.cur=null;G.curBy=null;G.pile=[];G.passed=[0,0,0,0];G.first=false;render();});const n0=await p.evaluate(()=>G.hands[0].length);await p.waitForTimeout(15800);t('auto lead '+k,await p.evaluate(n=>G.hands[0].length===n-1,n0));}
  t('afk on',await p.evaluate(()=>AFK&&!!document.getElementById('afkBar')));await p.screenshot({path:'shots/v20-afk.png'});
  await p.mouse.click(230,300);await p.waitForTimeout(200);t('wake',await p.evaluate(()=>!AFK));}}
console.log('pass',ok,'fail',bad,'errors',errs);await b.close();})();
