const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base='http://localhost:8765/index.html';const errs=[];const R={};const ctxs={};
async function mk(uid,vp){const ctx=await b.newContext({viewport:vp,hasTouch:true});ctxs[uid]=ctx;const p=await ctx.newPage();p.on('pageerror',e=>errs.push(uid+': '+e.message));
 await p.goto(base+'?t=1');await p.waitForTimeout(800);
 await p.evaluate(async([uid])=>{closeModal();await loadSB();await new Promise(r=>setTimeout(r,1000));USER={id:uid,email:uid+'@t.invalid'};PR.name=uid[0]=='a'?'An':'Bình';
  chan=(topic)=>SB.channel(topic.replace('tlmn:','tlmn-uitest-'),{config:{broadcast:{self:false},presence:{key:USER.id}}});
  ensurePlayer=async()=>{MYCODE='TEST01';};rtAuth=async()=>{};},[uid]);return p;}
const A=await mk('aaaa-1',{width:461,height:1024}),B=await mk('bbbb-2',{width:461,height:1024});
const code='RC'+Math.random().toString(36).slice(2,6).toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g,'Q');
await A.evaluate(c=>enterRoom(c,true,true),code);await A.waitForTimeout(1500);await B.evaluate(c=>joinRoom(c),code);await B.waitForTimeout(3000);
await A.evaluate(()=>{ONL.host.opt.turnMs=60000;ONL.host.start(Math.random);});await A.waitForTimeout(3500);
const state=async(p)=>p.evaluate(()=>({host:!!ONL.host,hand:G&&G.hands[0].length,real:G&&G.hands[0].every(c=>c>=0),turn:G&&G.turn,over:G&&G.over,banner:!!document.getElementById('netBan'),pend:!!ONL.pendSt}));
R.before={A:await state(A),B:await state(B)};
// client mất mạng 8s
await ctxs['bbbb-2'].setOffline(true);await B.evaluate(()=>window.dispatchEvent(new Event('offline')));await B.waitForTimeout(8000);
R.clientOff={A:await A.evaluate(()=>{const s=ONL.host.st.seats.find(x=>x&&x.uid==='bbbb-2');return s&&s.bot;}),Bbanner:await B.evaluate(()=>!!document.getElementById('netBan'))};
await ctxs['bbbb-2'].setOffline(false);await B.evaluate(()=>window.dispatchEvent(new Event('online')));await B.waitForTimeout(9000);
R.clientBack={A:await A.evaluate(()=>{const s=ONL.host.st.seats.find(x=>x&&x.uid==='bbbb-2');return {bot:s&&s.bot,afk:ONL.host.st.afk&&ONL.host.st.afk[ONL.host.st.seats.indexOf(s)]};}),B:await state(B)};
// B tự đánh khi tới lượt
const canPlay=async(p)=>{for(let i=0;i<80;i++){const r=await p.evaluate(()=>{if(!G||G.over)return 'over';if(G.turn===0&&!DEALING){const n0=JSON.stringify(ONL.st.pile)+ONL.st.hands.map(h=>h.length).join('/');autoMove();return 'moved:'+n0;}return null;});if(r){await p.waitForTimeout(1500);if(r==='over')return 'over';const n1=await p.evaluate(()=>JSON.stringify(ONL.st.pile)+ONL.st.hands.map(h=>h.length).join('/'));return n1!==r.slice(6)?'ok':'nochange';}await p.waitForTimeout(500);}return 'timeout';};
await A.evaluate(()=>setAuto(true));await B.evaluate(()=>setAuto(true));const p0=await B.evaluate(()=>ONL.st.hands.map(h=>h.length).join('/'));await B.waitForTimeout(10000);R.clientPlays={p0,p1:await B.evaluate(()=>ONL.st.hands.map(h=>h.length).join('/')),hostHist:await A.evaluate(()=>ONL.host.st.hands.map(h=>h.length).join('/')+':t'+ONL.host.st.turn),bLen:await B.evaluate(()=>G.hands[0].length)};await A.evaluate(()=>setAuto(false));await B.evaluate(()=>setAuto(false));
// host mất mạng 8s
await ctxs['aaaa-1'].setOffline(true);await A.evaluate(()=>window.dispatchEvent(new Event('offline')));await A.waitForTimeout(8000);
R.hostOff={B:await B.evaluate(()=>({host:!!ONL.host,banner:!!document.getElementById('netBan'),over:G&&G.over}))};
await ctxs['aaaa-1'].setOffline(false);await A.evaluate(()=>window.dispatchEvent(new Event('online')));await A.waitForTimeout(9000);
R.hostBack={A:await state(A),B:await state(B)};await A.evaluate(()=>setAuto(true));await B.evaluate(()=>setAuto(true));const q0=await B.evaluate(()=>ONL.st.hands.map(h=>h.length).join('/'));await B.waitForTimeout(10000);R.afterHost={q0,q1:await B.evaluate(()=>ONL.st.hands.map(h=>h.length).join('/')),hostHist:await A.evaluate(()=>ONL.host.st.hands.map(h=>h.length).join('/')+':t'+ONL.host.st.turn),over:await B.evaluate(()=>G.over)};await A.evaluate(()=>setAuto(false));await B.evaluate(()=>setAuto(false));
await B.setViewportSize({width:360,height:800});await B.waitForTimeout(400);R.row360=await B.evaluate(()=>[...document.querySelectorAll('#ctrl > *')].filter(b=>b.offsetParent).map(b=>b.id+':'+Math.round(b.getBoundingClientRect().left)+'-'+Math.round(b.getBoundingClientRect().right)));
await B.evaluate(()=>setAuto(true));const h0=await B.evaluate(()=>ONL.st.hands.map(h=>h.length).join('/'));await B.waitForTimeout(12000);R.auto={h0,h1:await B.evaluate(()=>ONL.st.hands.map(h=>h.length).join('/')),myLen:await B.evaluate(()=>G.hands[0].length),ban:await B.evaluate(()=>!!document.getElementById('autoBan'))};await B.screenshot({path:'shots/v34-auto-360.png'});
console.log(JSON.stringify(R,null,1));console.log('errs',errs.slice(0,8));await b.close();})();
