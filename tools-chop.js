const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
for(const rm of ['no-preference','reduce']){const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true,reducedMotion:rm})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();PR.xu=1000;PR.bet=100;saveP();startTable(4);});await p.waitForTimeout(3000);
const r=await p.evaluate(()=>{window.step=()=>{};const x0=PR.xu;
 G.hands[0]=[51,0,1];G.hands[1]=[28,29,30,31,4,5];G.hands[2]=[8,9,10];G.hands[3]=[12,13,14];G.turn=0;G.cur=null;G.curBy=null;G.pile=[];G.passed=[0,0,0,0];G.first=false;
 doPlay(0,[51]);G.turn=1;doPlay(1,[28,29,30,31]);// tứ quý chặt heo ♥ → Bạn trả 100
 const pend=JSON.stringify(G.pend);G.turn=2;doPass(2);G.turn=3;doPass(3);G.turn=0;doPass(0);return {x0,x1:PR.xu,pend,net:G.chopNet,pendAfter:G.pend};});
console.log(rm,JSON.stringify(r));t(rm+' paid 100',r.x0-r.x1===100&&r.net===-100&&!r.pendAfter);
await p.waitForTimeout(rm==='reduce'?200:350);await p.screenshot({path:`shots/v19-chop-${rm}.png`});}
console.log('pass',ok,'fail',bad,'errors',errs);await b.close();})();
