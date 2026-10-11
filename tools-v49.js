const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base='http://localhost:8765/index.html';const errs=[];const R={};const tag=Math.random().toString(36).slice(2,6);
async function mk(uid,vp,nm){const ctx=await b.newContext({viewport:vp,hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(uid+': '+e.message));
 await p.goto(base+'?t=1');await p.waitForTimeout(800);
 await p.evaluate(async([uid,nm,tag])=>{closeModal();await loadSB();await new Promise(r=>setTimeout(r,800));USER={id:uid,email:uid+'@t.invalid'};PR.name=nm;PR.xu=50000;checkBadges(PR);saveP();setInterval(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},150);
  chan=(topic)=>SB.channel(topic.replace('tlmn:','tlmn-uis'+tag+'-'),{config:{broadcast:{self:false},presence:{key:USER.id}}});
  ensurePlayer=async()=>{MYCODE='TEST01';};rtAuth=async()=>{};loadFriendSet=async()=>{};renderFriends=async()=>{};window._hands=0;},[uid,nm,tag]);return p;}
const A=await mk('aaaa-1',{width:412,height:915},'An'),B=await mk('bbbb-2',{width:412,height:915},'Bình'),C=await mk('cccc-3',{width:360,height:800},'Cúc');
const code='SP'+Math.random().toString(36).slice(2,6).toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g,'Q');
await A.evaluate(c=>enterRoom(c,true,true),code);await A.waitForTimeout(1500);await B.evaluate(c=>joinRoom(c),code);await B.waitForTimeout(2500);
await C.evaluate(c=>{spectate(c);},code);await C.waitForTimeout(3000);
await C.evaluate(()=>{ONL.tr.on&&0;const ch=ONL.ch;ch.on('broadcast',{event:'hand'},m=>{if(m.payload&&m.payload.to===USER.id)window._hands++;});});
await A.evaluate(()=>{ONL.host.opt.turnMs=60000;ONL.host.start(Math.random);});await A.waitForTimeout(4000);
R.room=await A.evaluate(()=>({specs:(ONL.room.specs||[]).map(s=>s.name),seats:ONL.st.seats.map(s=>s&&s.name)}));
R.C=await C.evaluate(()=>({spec:SPEC,body:document.body.classList.contains('spec'),handsMsg:window._hands,myHand:G&&G.hands[0].slice(0,3),allHidden:G&&G.hands.every(h=>h.every(c=>c===-1)),bar:!!document.getElementById('specBar'),cnt:(document.getElementById('specCnt')||{}).textContent}));
R.B=await B.evaluate(()=>({real:G.hands[0].every(c=>c>=0),cnt:(document.getElementById('specCnt')||{}).textContent}));
await C.evaluate(()=>{openChatSheet('tbl');csSend('Hay quá!');});await A.waitForTimeout(1500);R.chatA=await A.evaluate(()=>ONL.chat.map(m=>m.name+': '+m.t));
await C.evaluate(()=>closeChatSheet());await C.screenshot({path:'shots/v49-spec-360.png'});
// C cố đánh
R.cPlay=await C.evaluate(()=>{const h0=JSON.stringify(ONL.st&&ONL.st.hist.length);humanPass();return h0;});
// kết thúc ván -> C ngồi vào
await A.evaluate(()=>{ONL.host.st.over=true;ONL.host.push();});await C.waitForTimeout(2000);await C.evaluate(()=>specSit());await A.waitForTimeout(2500);
R.after=await A.evaluate(()=>({specs:(ONL.room.specs||[]).length,players:ONL.host.players.filter(p=>!p.gone).map(p=>p.name)}));R.Cafter=await C.evaluate(()=>({spec:SPEC,bar:!!document.getElementById('specBar')}));
console.log(JSON.stringify(R,null,1),errs);await b.close();})();
