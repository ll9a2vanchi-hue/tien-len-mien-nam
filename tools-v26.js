const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
for(const [W,H] of [[360,800],[412,915],[461,1024]]){const p=await (await b.newContext({viewport:{width:W,height:H},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(W+': '+e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);
await p.evaluate(()=>{closeModal();PR.name='THAIVANNGUYEN';PR.xu=20000;PR.xp=5000;startTable(4);});await p.waitForTimeout(3500);
await p.screenshot({path:`shots/v26-play-${W}.png`});
await p.evaluate(()=>{G.finished=[2,3,1];G.hands[1]=[];G.hands[2]=[];G.hands[3]=[];G.over=true;G.rank=[2,3,1,0];render();renderMe();});await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const over=[...document.querySelectorAll('#meInfo *, .seat *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.right>innerWidth+1||r.left<-1);}).map(e=>e.className||e.tagName).slice(0,6);
 const mi=document.getElementById('meInfo').getBoundingClientRect(),xb=(document.querySelector('#meInfo .tw')||document.body).getBoundingClientRect();const seats=[1,2,3].map(p=>Math.round(document.getElementById('s'+p).getBoundingClientRect().height));
 return {docOverflow:document.documentElement.scrollWidth>innerWidth,over,mi:[mi.left,mi.right].map(Math.round),xpb:[xb.left,xb.right,xb.width].map(Math.round),seats};});
await p.screenshot({path:`shots/v26-end-${W}.png`});console.log(W,JSON.stringify(r));}
console.log('errs',errs);await b.close();})();
