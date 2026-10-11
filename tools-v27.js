const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const p=await (await b.newContext({viewport:{width:412,height:915},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();startTable(2);});
for(let i=0;i<40;i++){await p.waitForTimeout(200);if(await p.evaluate(()=>!DEALING))break;}
const x0=await p.evaluate(()=>{const bs=G.seats.filter(x=>x);G.hands[0]=[0];G.hands[bs[0]]=[4,8,12,16,20,24,28,32,36,40,44,47,51];G.cur=null;G.first=false;G.turn=0;G.passed=G.passed.map(()=>0);render();sel.clear();sel.add(0);return PR.xu;});
await p.evaluate(()=>humanPlay());await p.waitForTimeout(400);
// 3p: bạn về nhất, còn 2 máy -> phải chờ máy chơi tiếp tới khi hết
for(let i=0;i<80;i++){await p.waitForTimeout(250);if(await p.evaluate(()=>G.over))break;}
await p.waitForTimeout(1200);await p.screenshot({path:'shots/v27b-b3.png'});
await p.waitForTimeout(2200);await p.screenshot({path:'shots/v27b-thui.png'});
const r=await p.evaluate(()=>({over:G.over,thui:THUI&&THUI.list.map(s=>[s.lp,s.paid,s.items.map(i=>i.k).join('+')]),net:THUI&&THUI.net}));
await p.click('#finGo');for(let i=0;i<30;i++){await p.waitForTimeout(400);if(await p.evaluate(()=>modalOpen()))break;}await p.waitForTimeout(1500);await p.screenshot({path:'shots/v27b-result.png'});
const r2=await p.evaluate(()=>({row:!!document.querySelector('.thuirow'),txt:(document.querySelector('.thuirow')||{}).textContent,xu:PR.xu}));
console.log(x0,JSON.stringify(r),JSON.stringify(r2),errs);await b.close();})();
