// E2E sảnh bàn công khai với 2 trình duyệt (USER giả lập, kênh công khai tạm thay kênh private)
const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base=process.argv[2]||'http://localhost:8765/index.html',tag='tlmn-lbtest-'+Date.now()+'-';const errs=[];
async function mk(uid,email,vp){const ctx=await b.newContext({viewport:vp});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(uid+': '+e.message));p.on('dialog',d=>d.accept());
 await p.goto(base+'?t=2');await p.waitForTimeout(800);
 await p.evaluate(async([uid,email,tag])=>{closeModal();await loadSB();await new Promise(r=>setTimeout(r,1000));USER={id:uid,email};PR.xu=20000;
  chan=(topic)=>SB.channel(topic.replace('tlmn:',tag),{config:{broadcast:{self:false},presence:{key:USER.id}}});ensurePlayer=async()=>{MYCODE='TEST01';};rtAuth=async()=>{};},[uid,email,tag]);return p;}
const A=await mk('aaaa-1','an@test.invalid',{width:1280,height:800}),B=await mk('bbbb-2','binh@test.invalid',{width:461,height:1024});
await A.evaluate(()=>openOnline());await B.evaluate(()=>openOnline());await A.waitForTimeout(2500);
await A.evaluate(()=>sitTable(publicTables()[2].code));await A.waitForTimeout(2500);
await B.evaluate(()=>renderLobby());await B.waitForTimeout(500);await B.screenshot({path:'/workspace/tienlen/shots/v4-461-lobby.png'});
const occ=await B.evaluate(()=>{const t=lobbyTables(lobbyPres()).find(x=>x.code===publicTables()[2].code);return{count:t.count,host:t.host,status:t.status};});console.log('B sees table C:',JSON.stringify(occ));
await A.evaluate(()=>setTableBet(500));await A.waitForTimeout(2000);
console.log('B sees bet',await B.evaluate(()=>lobbyTables(lobbyPres()).find(x=>x.code===publicTables()[2].code).bet));
await B.evaluate(()=>sitTable(publicTables()[2].code));await B.waitForTimeout(3000);
console.log('B room bet',await B.evaluate(()=>ONL.room&&ONL.room.bet),'B is host?',await B.evaluate(()=>!!ONL.host),'B can change bet?',await B.evaluate(()=>canChangeBet(lobbyTables(lobbyPres()).find(x=>x.code===ONL.code),USER.id)));
await A.screenshot({path:'/workspace/tienlen/shots/v4-1280-room.png'});
await A.evaluate(()=>hostStart());await A.waitForTimeout(2500);
console.log('lobby status',await B.evaluate(()=>lobbyTables(lobbyPres()).find(x=>x.code===ONL.code).status));
await B.evaluate(()=>sendThrow(1,'flower'));await A.waitForTimeout(300);await A.screenshot({path:'/workspace/tienlen/shots/v4-1280-online-throw.png'});
const xa=await A.evaluate(()=>PR.xu);await A.evaluate(()=>leaveRoom());await B.waitForTimeout(3500);
console.log('A exit penalty',xa-await A.evaluate(()=>PR.xu),'(bet 500)','B now host',await B.evaluate(()=>!!ONL.host),'A seat bot',await B.evaluate(()=>{const s=ONL.st.seats.find(s=>s&&s.uid==='aaaa-1');return s&&s.bot;}));
console.log('errors',errs);await b.close();})();
