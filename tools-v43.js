const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await (await b.newContext({viewport:{width:412,height:915}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(2500);await p.evaluate(()=>{setInterval(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},150);closeModal();startTable(4);});
await p.waitForFunction(()=>G&&G.turn===0&&!DEALING,null,{timeout:20000}).catch(()=>{});
// người chơi: chỉ còn 1 lá 5♠ ; máy 1 có lá 6, máy 2,3 không chặn được
const snap=async(n)=>{const r=await p.evaluate(()=>({turn:G.turn,curBy:G.curBy,pile:G.pile.slice(),pileDom:[...document.querySelectorAll('#pile .card,#center .pile .card')].length,caps:[...document.querySelectorAll('.fincap')].map(e=>e.textContent),hist:(G.hist||[]).map(h=>h.txt).slice(-2),ring:[...document.querySelectorAll('.seat.turn,.seat.active,#me.turn')].map(e=>e.id),tags:[...document.querySelectorAll('.seat .place,.seat .ptag,.ptag')].map(e=>e.textContent),fin:G.finished.slice()}));await p.screenshot({path:'shots/v43-'+n+'.png'});return r;};
await p.evaluate(()=>{const c=(r,s)=>r*4+s;G.first=false;G.cur=null;G.curBy=null;G.pile=[];G.passed=[0,0,0,0];G.turn=0;G.hands[0]=[c(2,0)];G.hands[1]=[c(3,0),c(5,1),c(7,2)];G.hands[2]=[c(0,1),c(1,1),c(9,3),c(10,3)];G.hands[3]=[c(0,2),c(1,2),c(9,2)];G.hands[2]=[c(0,1),c(1,1)];render();sel.clear?sel.clear()||sel.add(c(2,0)):(sel=[c(2,0)]);});
await p.evaluate(()=>{humanPlay();});await p.waitForTimeout(300);const s1=await snap('a-out');await p.waitForTimeout(900);s1.at1200=await p.evaluate(()=>G.pile.slice());
await p.waitForTimeout(3500);const s2=await snap('b-beaten');
await p.waitForTimeout(6000);const s3=await snap('c-later');
console.log(JSON.stringify({s1,s2,s3},null,0),errs);await b.close();})();
