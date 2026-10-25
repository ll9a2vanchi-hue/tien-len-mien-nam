// v1.58.9: chơi nhiều ván MỌI trò, bấm nút Ván mới/Chơi tiếp bằng chạm thật (kiểm tra không bị che), không lỗi JS
const {chromium}=require('playwright-core');const URL=process.env.TURL||'http://localhost:8765/index.html';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const page=async(w,h)=>{const p=await b.newPage({viewport:{width:w,height:h},hasTouch:true,isMobile:true});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));p.on('console',m=>{if(/COVER/.test(m.text()))console.log('   '+m.text());});await p.goto(URL+'?t='+Date.now());await p.waitForTimeout(1200);
 await p.evaluate(()=>{closeModal();let x=0;while(levelInfo(x).level<72)x+=100;PR.xp=x;PR.xu=9e6;saveP();localStorage.removeItem('tlmn_bclv');});return p;};
const dismiss=async p=>{for(let i=0;i<8;i++){const has=await p.evaluate(()=>!!document.getElementById('badgeFX'));if(!has)break;await p.touchscreen.tap(20,20);await p.waitForTimeout(400);}};
// tìm nút theo chữ, kiểm tra nút không bị che ở 5 điểm, rồi chạm thật
const tap=async(p,root,re)=>{for(let a=0;a<4;a++){await dismiss(p);await p.waitForTimeout(250);if(!await p.evaluate(()=>!!document.getElementById('badgeFX')))break;}const r=await p.evaluate(([root,re])=>{const R=new RegExp(re);const bt=[...document.querySelectorAll(root+' button')].filter(x=>R.test(x.textContent)&&x.getClientRects().length&&!x.disabled).pop();if(!bt)return null;const q0=bt.getBoundingClientRect();if(q0.bottom>innerHeight||q0.top<0){bt.scrollIntoView({block:'center'});window._scrolled=(window._scrolled||0)+1;}const q=bt.getBoundingClientRect();
  const cv=[.1,.3,.5,.7,.9].map(k=>{const e=document.elementFromPoint(q.x+q.width*k,q.y+q.height/2);return (e&&(e===bt||bt.contains(e)))?'':!e?'offscreen':((e.closest('[id]')||{}).id+'.'+String(e.className).slice(0,25));}).filter(Boolean);const cov=cv.length;if(cov&&cv.every(x=>/badgeFX/.test(x)))return {badge:1};if(cov)console.log('COVER',bt.textContent.slice(0,20),cv.join('|'),JSON.stringify([q.x,q.y,q.width,q.height,innerHeight]));return {x:q.x+q.width*.15,y:q.y+q.height/2,cov,txt:bt.textContent.trim().slice(0,30),inView:q.bottom<=innerHeight+1};},[root,re]);
 if(r&&r.badge)return tap(p,root,re);if(!r)return {miss:1};await p.touchscreen.tap(r.x,r.y);await p.waitForTimeout(350);return r;};
const W=(p,fn,arg,ms=60000)=>p.waitForFunction(fn,arg,{timeout:ms,polling:150}).then(()=>true).catch(()=>false);
if(!process.env.ONLY2){
// ---- 3 Cào / Xì dách: con & cái, 2 và 6 người, 360 & 412
for(const [w,h,g,role,n] of [[360,740,'3cao','con',6],[360,740,'xidach','cai',6],[412,780,'3cao','cai',6],[412,780,'xidach','con',6],[461,800,'3cao','con',2],[461,800,'xidach','con',2]]){const h_=h;const p=await page(w,h);
 await p.evaluate(([g,role,n])=>{openCasino(g);cgSetup('n',n);cgSetup('role',role);cgBet(70000);},[g,role,n]);let good=0,cov=0;
 for(let r=0;r<3;r++){const prev=await p.evaluate(()=>{window._prev=CG.st;return 1;});const t=await tap(p,'#cg .cgctl','Chia bài|Ván mới');if(t.miss)break;cov+=t.cov;
  const started=await W(p,()=>CG.st&&CG.st!==window._prev,null,4000);if(!started)break;
  await p.evaluate(()=>{window._drv=setInterval(()=>{const st=CG.st;if(!st||CG.dealing)return;try{if(st.phase==='look')bcFlip();else if(st.phase==='me'){const k=xdKind(st.hands[st.me],16);(k.total>=16||st.hands[st.me].length>=5)?xdStand():xdHit();}else if(st.phase==='deal'){const k=xdKind(st.hands[0],15);(k.total>=15||st.hands[0].length>=5)?xdXetAll():xdHit();}}catch(e){}},250);});
  const done=await W(p,()=>CG.st&&CG.st.phase==='done',null,40000);await p.evaluate(()=>clearInterval(window._drv));await p.waitForTimeout(1200);if(done)good++;}
 const msg=await p.evaluate(()=>CG.st&&CG.st.msg||'');
 ok(good===3&&cov===0,`${g} ${role} n${n} ${w}: 3 ván, nút Ván mới không bị che (${good}/3, che=${cov})`);ok(!/thua -/.test(msg),`${g} không có "thua -" (${msg.slice(0,40)})`);ok(!p.errs.length,`${g} không lỗi JS ${p.errs}`);await p.close();}
// ---- Domino / Xì tố / Poker
for(const g of ['domino','xito','poker']){const p=await page(412,780);await p.evaluate(g=>{mgOpen(g);const set={domino:dmSet,xito:xtSet,poker:pkSet}[g];set('n',g==='domino'?4:5);set('bet',50000);
  window._drv=setInterval(()=>{const st=MG.st;if(!st)return;try{if(g==='domino'){if(st.phase!=='play'||st.turn!==0)return;if(st.need==='draw')return dmDraw();if(st.need==='pass')return dmPassBtn();if(st.choose)return dmGo('R');const k=st.hands[0].findIndex(t=>dmOk(t));if(k<0)return;if(st.sel!==k)return dmTap(k);dmGo();}
   else{if(st.phase!=='bet'||st.anim||st.busy&&g==='xito'&&false)return;const bb=st.b;if(!bb||bb.cur!==0)return;const tc=btToCall(bb,0);(g==='xito'?xtDo:pkDo)(0,tc?'call':'check');}}catch(e){}},400);},g);
 let good=0,cov=0,bet=0;for(let r=0;r<3;r++){await p.evaluate(()=>{window._prev=MG.st;});const t=await tap(p,'#mg .cgctl','Chia|Ván mới|Bắt đầu');if(t.miss){console.log('  miss',g,await p.evaluate(()=>document.querySelector('#mg .cgctl').innerText.slice(0,120)));break;}cov+=t.cov;
  if(!await W(p,()=>MG.st&&MG.st!==window._prev,null,4000))break;bet=await p.evaluate(()=>MG.st.bet||MG.bet);
  if(await W(p,()=>MG.st&&MG.st.phase==='done',null,90000))good++;await p.waitForTimeout(1500);}
 ok(good===3&&cov===0&&bet===50000,`${g}: 3 ván, nút Ván mới bấm được, cược 50k áp dụng (${good}/3, che=${cov}, bet=${bet})`);ok(!p.errs.length,`${g} không lỗi JS ${p.errs}`);await p.close();}
// ---- Bầu cua: con 3 ván, cái 2 ván
{const p=await page(412,780);await p.evaluate(()=>{localStorage.setItem('tlmn_bcrole','con');mgOpen('baucua');bcSetLv(20000);});let good=0,cov=0;
 for(let r=0;r<3;r++){await p.evaluate(()=>{bcPut('cua');bcPut('ga');});const t=await tap(p,'#mg .cgctl','Lắc');if(t.miss)break;cov+=t.cov;if(!await W(p,()=>MG.st.phase==='open',null,15000))break;
  const t2=await tap(p,'#mg .cgctl','Mở bát');cov+=t2.cov||0;if(await W(p,()=>MG.st.phase==='done',null,5000))good++;await p.waitForTimeout(1500);}
 await p.evaluate(()=>bcRole('cai'));await W(p,()=>!MG.st.placing,null,8000);
 for(let r=0;r<2;r++){const t=await tap(p,'#mg .cgctl','Lắc');if(t.miss)break;cov+=t.cov;if(!await W(p,()=>MG.st.phase==='open',null,20000))break;const t2=await tap(p,'#mg .cgctl','Mở bát');cov+=t2.cov||0;if(await W(p,()=>MG.st.phase==='done',null,5000))good++;await p.waitForTimeout(1500);}
 ok(good===5&&cov===0,`baucua: 3 ván con + 2 ván cái (${good}/5, che=${cov})`);ok(!p.errs.length,`baucua không lỗi JS ${p.errs}`);await p.close();}
}
// ---- TLMN & Đếm lá: chơi hết ván bằng tự đánh, bấm Tiếp tục → kết quả → Ván mới
for(const m of (process.env.MODES?process.env.MODES.split(','):['tlmn','demla'])){const p=await page(412,780);await p.evaluate(m=>{setMode(m);startTable(4);window._drv=setInterval(()=>{try{if(G&&!G.over&&G.turn===0&&!DEALING)autoMove();}catch(e){}},300);},m);let good=0;
 for(let r=0;r<2;r++){if(!await W(p,()=>G&&G.over,null,150000))break;await p.waitForTimeout(800);
  for(let i=0;i<30;i++){await dismiss(p);const st=await p.evaluate(()=>document.getElementById('finGo')?'fin':modalOpen()&&/Kết quả/.test(document.getElementById('modalIn').textContent)?'res':document.getElementById('startOv')?'start':'');
   if(st==='fin'){const tt=await tap(p,'body','Tiếp tục');if(process.env.DBG)console.log('   fin tap',JSON.stringify(tt));}else if(st==='res'){await tap(p,'#modalIn','Ván mới');}else if(st==='start')await tap(p,'#startOv','BẮT ĐẦU');
   if(await p.evaluate(()=>G&&!G.over)){good++;break;}if(process.env.DBG)console.log('  r'+r,st,await p.evaluate(()=>(modalOpen()?document.getElementById('modalIn').textContent.slice(0,60):'')+' badge='+!!document.getElementById('badgeFX')));await p.waitForTimeout(700);}}
 ok(good===2,`${m}: 2 ván, Tiếp tục/Ván mới bấm được (${good}/2)`);ok(!p.errs.length,`${m} không lỗi JS ${p.errs}`);await p.close();}
// ---- hiển thị tiền âm
{const p=await page(412,780);const k=await p.evaluate(()=>[kxu(-70000),kxu(-1500),kxu(-2e6),fmt(-0)]);ok(k.join()==='-70k,-1.5k,-2M,0','kxu âm / -0 → '+k);await p.close();}
await b.close();console.log(f?'FAILED '+f:'ALL OK');process.exit(f?1:0);})();
