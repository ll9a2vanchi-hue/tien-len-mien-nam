const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const p=await H.open(b,412,800,()=>{let x=0;while(levelInfo(x).level<72)x+=100;PR.xp=x;PR.xu=5e6;saveP();localStorage.removeItem('tlmn_bclv');localStorage.setItem('tlmn_bcrole','con');});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
let r=await p.evaluate(async()=>{const O={v:APP_V};const sl=ms=>new Promise(r=>setTimeout(r,ms));const chips=()=>[...document.querySelectorAll('#mg .bcchips button')].map(x=>x.dataset.b+(x.disabled?'d':'')).join(',');
 const wait=async c=>{for(let i=0;i<100&&!c();i++)await sl(100);};
 mgOpen('baucua');await sl(300);bcLvPick();await sl(100);O.lk=[...document.querySelectorAll('.bclvgrid button.lk')].map(x=>x.dataset.l).join(',');closeModal();
 bcSetLv(100000);O.lockHeld=bcLevel()===200;bcSetLv(70000);O.c70=chips();
 MG.bet=30000;bcChip(140000);O.ch=MG.st.chip;O.noLeak=MG.bet===30000;bcSetLv(50000);O.noLeak2=MG.bet===30000;bcSetLv(70000);
 // vòng con: cược, lắc, mở → tiền khớp
 let mgArg;const _me=mgEnd;mgEnd=function(m){mgArg=m;return _me.apply(this,arguments);};const x0=PR.xu;bcPut('cua');bcPut('tom');const bets=Object.assign({},MG.st.bets);bcShake();await wait(()=>MG.st.phase==='open');bcOpen();await sl(100);
 O.payOk=MG.st.res.me===bcuaPay(bets,MG.st.dice);O.xuOk=mgArg===MG.st.res.me&&PR.xu-x0>=MG.st.res.me;mgEnd=_me;O.dx=[PR.xu-x0,MG.st.res.me];O.bets=bcTot(bets);
 // ↺ Lại sau khi đổi mức
 bcSetLv(1000);await sl(100);O.reOk=bcLastOk();bcRebet();O.re=JSON.stringify(MG.st.bets);bcClear();
 // làm cái: ván 1 và ván 2 máy cược theo mức bàn
 bcSetLv(20000);bcRole('cai');await wait(()=>!MG.st.placing&&MG.st.bots.some(b=>bcTot(b.bets)));const amt=()=>MG.st.bots.flatMap(b=>Object.values(b.bets||{}));O.r1=amt();
 bcShake();await wait(()=>MG.st.phase==='open');bcOpen();await sl(100);O.dealerXu=PR.xu;
 bcShake();await wait(()=>MG.st.phase==='open'||MG.st.phase==='shake');O.r2=amt();await wait(()=>MG.st.phase==='open');bcOpen();
 O.neg=[...document.querySelectorAll('#mg .bcs .mgv.neg')].map(x=>x.textContent).join(',');O.saved=localStorage.getItem('tlmn_bclv');
 bcRole('con');mgClose(1);return O;});
ok(r.v>='1.58.8','version '+r.v);ok(r.lk==='100000,150000'&&r.lockHeld,'Lv72: tới 70k mở, 100k/150k khóa '+r.lk);
ok(r.c70==='70000,140000,350000,700000','chip 1/2/5/10× '+r.c70);ok(r.ch===140000&&r.noLeak&&r.noLeak2,'chip Bầu cua không làm đổi MG.bet');
ok(r.payOk&&r.xuOk&&r.bets===140000,'tiền thắng/thua đúng mức cược '+JSON.stringify([r.payOk,r.xuOk,r.bets,r.dx]));ok(r.reOk&&r.re==='{"cua":1000,"tom":1000}','↺ Lại theo mức bàn mới '+r.re);
ok(r.r1.length&&r.r1.every(a=>a%20000===0),'làm cái ván 1: máy cược theo mức '+r.r1);
ok(r.r2.length&&r.r2.every(a=>a%20000===0),'làm cái ván 2: máy cược theo mức '+r.r2);
ok(!r.neg||/^-[\d.,]+[kM]?(,-[\d.,]+[kM]?)*$/.test(r.neg)&&!/\d{5}/.test(r.neg),'tiền âm gọn '+r.neg);
await p.reload();await p.waitForTimeout(1500);
r=await p.evaluate(async()=>{const O={};const sl=ms=>new Promise(r=>setTimeout(r,ms));PR.xu=5e6;mgOpen('baucua');await sl(200);O.lv=bcLevel();mgClose(1);
 localStorage.setItem('tlmn_bclv','70000');PR.xu=40000;mgOpen('baucua');await sl(200);O.low=bcLevel();O.chip0=!document.querySelector('#mg .bcchips button').disabled;O.btn=document.querySelector('.bclvbtn').textContent;O.keep=localStorage.getItem('tlmn_bclv');mgClose(1);
 PR.xu=5e6;mgOpen('baucua');await sl(200);O.back=bcLevel();mgClose(1);
 localStorage.setItem('tlmn_bclv','150000');mgOpen('baucua');await sl(200);O.lockedSaved=bcLevel();mgClose(1);return O;});
ok(r.lv===20000,'nhớ mức bàn sau khi tải lại '+r.lv);ok(r.low===30000&&r.chip0&&/30k/.test(r.btn)&&r.keep==='70000','thiếu xu → tạm hạ mức, chip dùng được');
ok(r.back===70000,'đủ xu → trở lại mức đã chọn');ok(r.lockedSaved===200,'mức lưu bị khóa → 200');
ok(!errs.length,'no errors '+errs);await b.close();console.log(f?'FAILED '+f:'ALL OK');process.exit(f?1:0);})();
