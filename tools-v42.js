const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base='http://localhost:8765/index.html';const errs=[];const R={};
const tag=Math.random().toString(36).slice(2,6);
async function mk(uid,vp,nm){const ctx=await b.newContext({viewport:vp,hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(uid+': '+e.message));
 await p.goto(base+'?t=1');await p.waitForTimeout(800);
 await p.evaluate(async([uid,nm,tag])=>{closeModal();BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());await loadSB();await new Promise(r=>setTimeout(r,800));USER={id:uid,email:uid+'@t.invalid'};PR.name=nm;PR.xu=50000;checkBadges(PR);saveP();setInterval(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},150);
  chan=(topic)=>SB.channel(topic.replace('tlmn:','tlmn-uit'+tag+'-'),{config:{broadcast:{self:false},presence:{key:USER.id}}});
  ensurePlayer=async()=>{MYCODE='TEST01';};rtAuth=async()=>{};loadFriendSet=async()=>{};renderFriends=async()=>{};},[uid,nm,tag]);return p;}
const A=await mk('aaaa-1',{width:412,height:915},'An'),B=await mk('bbbb-2',{width:360,height:800},'Bình');
await A.evaluate(()=>{PR.bet=1000;startTable(3);joinLobby();});await B.evaluate(()=>{showHome();joinLobby();});await A.waitForTimeout(4000);await A.evaluate(()=>lobbyTrack());await B.waitForTimeout(3000);
await B.evaluate(()=>{renderHome();openPeople('on');});await B.waitForTimeout(1500);await B.screenshot({path:'shots/v42-people.png'});
R.seen=await B.evaluate(()=>lobbyPres().map(p=>p.name+':'+plStatus(p)));
await B.evaluate(()=>plTap('aaaa-1'));await B.waitForTimeout(400);R.btn=await B.evaluate(()=>[...document.querySelectorAll('#modalIn button')].map(x=>x.textContent).join('|'));
await B.evaluate(()=>jrSend('aaaa-1'));await A.waitForTimeout(1500);await A.screenshot({path:'shots/v42-request.png'});R.card=await A.evaluate(()=>!!document.getElementById('jrCard'));
const bots=await A.evaluate(()=>[NAMES[1],NAMES[3],NAMES[2]]);
await A.evaluate(()=>jrAnswer(true));await A.waitForTimeout(800);R.waitConv=await A.evaluate(()=>!ONL.active);
await A.evaluate(()=>{G.over=true;});await A.waitForTimeout(5000);
R.room=await A.evaluate(()=>({active:ONL.active,code:ONL.code,host:!!ONL.host,size:ONL.host&&ONL.host.opt.size,bet:ONL.host&&ONL.host.opt.bet}));
await B.waitForTimeout(5000);R.bIn=await B.evaluate(()=>({active:ONL.active,code:ONL.code}));
await A.evaluate(()=>{ONL.host.start(Math.random);});await A.waitForTimeout(3500);
R.seats=await A.evaluate(()=>ONL.st&&ONL.st.seats.map(s=>s&&(s.name+(s.bot?'(bot)':''))));R.botsWere=bots;
// chat
await B.evaluate(()=>{openChatSheet('tbl');csSend('Chào An!');});await A.waitForTimeout(1200);await A.evaluate(()=>{toggleChat();csSend('GG');csSend('Ván nữa không?');});await B.waitForTimeout(1500);
await B.evaluate(()=>csRender());await B.screenshot({path:'shots/v42-chat360.png'});
R.chatB=await B.evaluate(()=>[...document.querySelectorAll('#csLog .cb')].map(e=>(e.classList.contains('me')?'>':'<')+e.querySelector('.cbt').textContent));
R.ov=await B.evaluate(()=>[...document.querySelectorAll('#chatSheet *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&!e.closest('.cschips,.csemo')).length);
R.hand=await B.evaluate(()=>{const s=document.getElementById('chatSheet').getBoundingClientRect(),h=document.getElementById('hand').getBoundingClientRect();return [Math.round(s.bottom),Math.round(h.top)];});
// DM tab
await A.evaluate(()=>sendDM('bbbb-2','Xin chào riêng'));await B.waitForTimeout(1500);await B.evaluate(()=>{CS.tab='dm';CS.peer='aaaa-1';csRender();});await B.waitForTimeout(300);await B.screenshot({path:'shots/v42-dm360.png'});
// decline path
const C=await mk('cccc-3',{width:412,height:915},'Cúc');await C.evaluate(()=>{startTable(2);joinLobby();});await C.waitForTimeout(4000);
await B.evaluate(()=>{JR.out={};JR.sent=[];jrSend('cccc-3');});await C.waitForTimeout(1500);await C.evaluate(()=>jrAnswer(false));await B.waitForTimeout(1500);
R.declTs=await B.evaluate(()=>document.getElementById('toast').textContent);
console.log(JSON.stringify(R,null,1),errs);await b.close();})();
