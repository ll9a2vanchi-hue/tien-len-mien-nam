const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base='http://localhost:8765/index.html';const errs=[];const R={};
async function mk(uid,vp){const ctx=await b.newContext({viewport:vp,hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(uid+': '+e.message));
 await p.goto(base+'?t=1');await p.waitForTimeout(800);
 await p.evaluate(async([uid])=>{closeModal();await loadSB();await new Promise(r=>setTimeout(r,1000));USER={id:uid,email:uid+'@t.invalid'};PR.name=uid[0]=='a'?'An':'Bình';CHAT_SET='n';
  chan=(topic)=>SB.channel(topic.replace('tlmn:','tlmn-uitest-'),{config:{broadcast:{self:false},presence:{key:USER.id}}});
  ensurePlayer=async()=>{MYCODE='TEST01';};rtAuth=async()=>{};window._says=0;},[uid]);return p;}
const A=await mk('aaaa-1',{width:461,height:1024}),B=await mk('bbbb-2',{width:360,height:800});
const code='PZ'+Math.random().toString(36).slice(2,6).toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g,'Q');
await A.evaluate(()=>{const f=SHOP.find(x=>x.type==='felt'&&x.price>0);PR.inv[f.id]=1;PR.equip.felt=f.id;applyCosmetics();window._felt=f.id;});
// 1) vào cùng lúc
await Promise.all([A.evaluate(c=>enterRoom(c,'auto',true),code),B.evaluate(c=>enterRoom(c,'auto',true),code)]);
await A.waitForTimeout(6000);
const hA=await A.evaluate(()=>({host:!!ONL.host,rh:ONL.room&&ONL.room.host})),hB=await B.evaluate(()=>({host:!!ONL.host,rh:ONL.room&&ONL.room.host}));
R.election={A:hA,B:hB,oneHost:(hA.host?1:0)+(hB.host?1:0)===1,agree:hA.rh===hB.rh};
const H=hA.host?A:B,C=hA.host?B:A;
await H.evaluate(()=>{ONL.host.opt.fillBots=true;});await H.waitForTimeout(500);
await C.evaluate(()=>{ONL.tr.on('say',()=>window._says++);ONL.tr.on('hand',m=>{window._enc=(window._enc||0)+(m.ct&&!m.plain?1:0);});});
await H.evaluate(()=>ONL.host.start(Math.random));await H.waitForTimeout(3500);
R.peek=await C.evaluate(()=>{const raw=ONL.client.st;const me=raw.seats.findIndex(s=>s&&s.uid===USER.id);return{rawOthersHidden:raw.hands.every((h,i)=>i===me||h.every(c=>c===-1)),rawMineHidden:raw.hands[me].every(c=>c===-1),myHandReal:G.hands[0].length>0&&G.hands[0].every(c=>c>=0),handLen:G.hands[0].length,stars:document.querySelectorAll('.aitag').length,botai:ONL.botai};});
const hostView=await H.evaluate(()=>{const st=ONL.host.st;const c=st.seats.findIndex(s=>s&&!s.bot&&s.uid!==USER.id);return st.hands[c].join(',');});
const cView=await C.evaluate(()=>G.hands[0].slice().sort((a,b)=>a-b).join(','));R.peek.matchesHost=hostView.split(',').map(Number).sort((a,b)=>a-b).join(',')===cView;
R.cos=await C.evaluate(()=>document.body.dataset.felt);R.hostFelt=await H.evaluate(()=>document.body.dataset.felt);
// 3) quà
const x0=await C.evaluate(()=>PR.xu);await H.evaluate(()=>{const st=ONL.st,me=st.seats.findIndex(s=>s&&s.uid===USER.id);const c=st.seats.findIndex(s=>s&&!s.bot&&s.uid!==USER.id);PR.xu+=100;sendThrow((c-me+4)%4,'flower');});
await C.waitForTimeout(1500);R.gift={before:x0,after:await C.evaluate(()=>PR.xu)};
// 4) máy nói
await H.evaluate(()=>{const st=ONL.host.st;const g=st.seats.findIndex(s=>s&&s.bot);_hLast=0;hostSay(g,'one',1);});await C.waitForTimeout(1000);R.says=await C.evaluate(()=>window._says);R.encHands=await C.evaluate(()=>window._enc);
await C.screenshot({path:'shots/v25-client.png'});await H.screenshot({path:'shots/v25-host.png'});
console.log(JSON.stringify(R,null,1));console.log('errs',errs);await b.close();})();
