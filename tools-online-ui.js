// UI e2e online với 2 trình duyệt: giả lập USER (không đăng nhập được do xác nhận email) và dùng kênh công khai tạm thay cho kênh private
const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const base=process.argv[2]||'http://localhost:8765/index.html';const errs=[];
async function mk(uid,email,vp){const ctx=await b.newContext({viewport:vp});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(uid+': '+e.message));
 await p.goto(base+'?t=1');await p.waitForTimeout(800);
 await p.evaluate(async([uid,email])=>{closeModal();await loadSB();await new Promise(r=>setTimeout(r,1000));USER={id:uid,email};
  chan=(topic)=>SB.channel(topic.replace('tlmn:','tlmn-uitest-'),{config:{broadcast:{self:false},presence:{key:USER.id}}});
  ensurePlayer=async()=>{MYCODE='TEST01';};rtAuth=async()=>{};},[uid,email]);return p;}
const A=await mk('aaaa-1','an@test.invalid',{width:1280,height:800}),B=await mk('bbbb-2','binh@test.invalid',{width:390,height:844});
const code=await A.evaluate(async()=>{const c='T'+Math.random().toString(36).slice(2,7).toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g,'Z');await enterRoom(c.padEnd(6,'Z').slice(0,6),true,true);return ONL.code;});
await A.waitForTimeout(1500);await B.evaluate(c=>joinRoom(c),code);await B.waitForTimeout(3000);
console.log('code',code,'A seats',await A.evaluate(()=>ONL.room&&ONL.room.seats.filter(Boolean).map(s=>s.name)),'B sees',await B.evaluate(()=>ONL.room&&ONL.room.seats.filter(Boolean).map(s=>s.name)));
await A.screenshot({path:'/workspace/tienlen/shots/desktop-online-room.png'});await B.screenshot({path:'/workspace/tienlen/shots/mobile-online-room.png'});
await B.evaluate(()=>{$('chatIn').value='Chào cả nhà!';sendChat();});await A.waitForTimeout(1000);console.log('A got chat',await A.evaluate(()=>ONL.chat.map(m=>m.t)));
await A.evaluate(()=>hostStart());await A.waitForTimeout(2500);
// both players auto-play via UI (select hint, press play/pass) until over
const auto=async p=>p.evaluate(()=>{if(G&&G.online&&!G.over&&G.turn===0){hint();if(sel.size)humanPlay();else humanPass();return 1;}return 0;});
let moves=[0,0];const t0=Date.now();let shot=false;
while(Date.now()-t0<120000){moves[0]+=await auto(A);moves[1]+=await auto(B);if(!shot&&moves[1]>=2){await A.evaluate(()=>sendEmote('👍'));await B.waitForTimeout(500);await B.screenshot({path:'/workspace/tienlen/shots/mobile-online-game.png'});await A.screenshot({path:'/workspace/tienlen/shots/desktop-online-game.png'});shot=true;}
 const over=await A.evaluate(()=>!!(ONL.st&&ONL.st.over));if(over)break;await A.waitForTimeout(700);}
await A.waitForTimeout(2500);
const sa=await A.evaluate(()=>JSON.stringify(ONL.st)),sb=await B.evaluate(()=>JSON.stringify(ONL.st));
console.log('over',await A.evaluate(()=>ONL.st.over),'moves',moves,'states equal',sa===sb,'B games',await B.evaluate(()=>PR.stats.games),'A games',await A.evaluate(()=>PR.stats.games));
await B.screenshot({path:'/workspace/tienlen/shots/mobile-online-result.png'});
// host leaves mid next game -> B becomes host
await A.evaluate(()=>{closeModal();hostStart();});await A.waitForTimeout(2000);await A.evaluate(()=>leaveRoom(true));await B.waitForTimeout(4000);
console.log('B is host now',await B.evaluate(()=>!!ONL.host),'A seat bot',await B.evaluate(()=>ONL.st&&ONL.st.seats.find(s=>s&&s.uid==='aaaa-1')&&ONL.st.seats.find(s=>s&&s.uid==='aaaa-1').bot));
const t1=Date.now();while(Date.now()-t1<90000){await auto(B);if(await B.evaluate(()=>ONL.st.over))break;await B.waitForTimeout(600);}
console.log('migrated game over',await B.evaluate(()=>ONL.st.over),'errors',errs);await b.close();})();
