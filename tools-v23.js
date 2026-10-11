const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base='http://localhost:8765/index.html';const errs=[];
async function mk(uid,email,vp){const ctx=await b.newContext({viewport:vp,hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(uid+': '+e.message));
 await p.goto(base+'?t=1');await p.waitForTimeout(800);
 await p.evaluate(async([uid,email])=>{closeModal();await loadSB();await new Promise(r=>setTimeout(r,1000));USER={id:uid,email};PR.name=uid[0]=='a'?'An':'Bình';
  chan=(topic)=>SB.channel(topic.replace('tlmn:','tlmn-uitest-'),{config:{broadcast:{self:false},presence:{key:USER.id}}});
  ensurePlayer=async()=>{MYCODE='TEST01';};rtAuth=async()=>{};},[uid,email]);return p;}
const A=await mk('aaaa-1','an@test.invalid',{width:461,height:1024}),B=await mk('bbbb-2','binh@test.invalid',{width:360,height:800});
const code=await A.evaluate(async()=>{const c='T'+Math.random().toString(36).slice(2,7).toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g,'Z');await enterRoom(c.padEnd(6,'Z').slice(0,6),true,true);return ONL.code;});
await A.waitForTimeout(1500);await B.evaluate(c=>joinRoom(c),code);await B.waitForTimeout(3000);
await A.evaluate(()=>ONL.host.start(Math.random));
await A.waitForTimeout(600);
const probe=p=>p.evaluate(()=>({dealing:DEALING,fx:!!document.getElementById('dealFX'),hidden:[...document.querySelectorAll('#hand .card')].filter(c=>c.style.visibility==='hidden').length,hist:ONL.st&&ONL.st.hist.length,pile:ONL.st&&ONL.st.pile.length}));
const a1=await probe(A),b1=await probe(B);await A.screenshot({path:'shots/v23-deal-A.png'});await B.screenshot({path:'shots/v23-deal-B.png'});
await A.waitForTimeout(2600);const a2=await probe(A),b2=await probe(B);
console.log('during deal A',JSON.stringify(a1),'B',JSON.stringify(b1));console.log('after deal A',JSON.stringify(a2),'B',JSON.stringify(b2));
// người vào muộn: trang mới của B nhận state giữa ván -> không chia lại
await A.waitForTimeout(2500);
// kết ván online: ép host kết thúc bằng cách để 1 người còn 1 lá
const endInfo=await A.evaluate(async()=>{const st=ONL.host.st;for(let k=0;k<60&&!st.over;k++){await new Promise(r=>setTimeout(r,250));const t=st.turn;if(!st.seats[t].bot&&!st.cur){/*để timer tự đánh*/}}return st.over;});
console.log('online game over (via bots/timeouts?)',endInfo);
await A.close();await B.close();
// offline: kết ván
const ctx=await b.newContext({viewport:{width:461,height:1024},hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push('off: '+e.message));
await p.goto(base);await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();startTable(2);});
for(let i=0;i<40;i++){await p.waitForTimeout(200);if(await p.evaluate(()=>!DEALING))break;}
await p.evaluate(()=>{const b=G.seats.find(x=>x!==0);G.hands[b]=[51];G.cur=null;G.passed=G.passed.map(()=>0);G.first=false;G.turn=b;render();step();});
await p.waitForTimeout(2200);await p.screenshot({path:'shots/v23-final.png'});
const o1=await p.evaluate(()=>({over:G.over,fin:!!document.getElementById('finFX'),fans:document.querySelectorAll('.finfan').length,cap:(document.querySelector('.fincap')||{}).textContent,modal:modalOpen()}));
await p.waitForTimeout(2500);const o2=await p.evaluate(()=>({fin:!!document.getElementById('finFX'),modal:modalOpen()}));
console.log('offline final',JSON.stringify(o1),'later',JSON.stringify(o2));
// mid-game finisher caption
await p.evaluate(()=>{closeModal();startTable(4);});for(let i=0;i<40;i++){await p.waitForTimeout(200);if(await p.evaluate(()=>!DEALING))break;}
await p.evaluate(()=>{const b=G.seats.find(x=>x!==0);G.hands[b]=[51];G.cur=null;G.passed=G.passed.map(()=>0);G.first=false;G.turn=b;render();step();});
await p.waitForTimeout(1500);await p.screenshot({path:'shots/v23-mid.png'});console.log('mid caption',await p.evaluate(()=>[(document.querySelector('.fincap')||{}).textContent,G.over]));
console.log('errors',errs);await b.close();})();
