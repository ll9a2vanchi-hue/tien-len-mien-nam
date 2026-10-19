const H=require('./tools-h.js');(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xp=40000;PR.xu=4e6;PR.stats.earned=150000;delete PR.stats.earnBf;PR.stats.m_poker_earn=80000;PR.stats.m_xito_earn=20000;PR.inv.back_holo=1;PR.inv.av_king=1;BADGES.forEach(b=>{if(/earn/.test(b.id))PR.badges[b.id]=1;});saveP();location.reload();});
 await p.waitForTimeout(1500);const r={};
 r.before=await p.evaluate(()=>({e:PR.stats.earned,bf:PR.stats.earnBf,b:expBonus(PR)}));
 await p.evaluate(()=>renderHome());r.chip0=await p.evaluate(()=>document.querySelector('.exchip').textContent);
 r.after_bf=await p.evaluate(()=>({e:PR.stats.earned,bf:PR.stats.earnBf}));
 // Xì tố thắng 5000 qua mgEnd thật
 await p.evaluate(()=>{mgOpen('xito');MG.st=null;mgEnd(5000);});await p.waitForTimeout(300);r.xito=await p.evaluate(()=>PR.stats.earned);
 await p.evaluate(()=>{mgClose(true);openCasino('3cao');});await p.waitForTimeout(300);
 // TLMN: thua hạng nhưng chặt +900
 await p.evaluate(()=>{document.getElementById('cg')&&document.getElementById('cg').remove();document.body.classList.remove('cgon');MODE='mn';startTable(4);});await p.waitForTimeout(1500);
 r.tl=await p.evaluate(()=>{const e0=PR.stats.earned;G.chopNet=900;const xb=expBonus(PR);hookEnd(2,false,4);return {d:PR.stats.earned-e0,xp:PR._lastXp,bonus:xb,base:tableXp(4,2,false,'tlmn')};});
 await p.evaluate(()=>{closeModal();goHome&&0;showHome();});await p.waitForTimeout(300);r.chip=await p.evaluate(()=>{renderHome();const c=document.querySelector('.exchip');return c&&c.textContent});r.eb=await p.evaluate(()=>expBonus(PR));
 await p.waitForTimeout(2500);await p.evaluate(()=>{try{BQ.length=0}catch(e){}document.querySelectorAll('#badgeFX,#fx > *').forEach(e=>e.remove());openExpBonus();});await p.waitForTimeout(400);r.ui=await p.evaluate(()=>[...document.querySelectorAll('.exrow')].map(e=>e.querySelector('b').textContent+'='+e.querySelector('em').textContent).concat(document.querySelector('.extot b').textContent));
 await p.waitForTimeout(2500);await p.evaluate(()=>{try{BQ.length=0}catch(e){}document.querySelectorAll('#badgeFX,.starfx,#fx > *').forEach(e=>e.remove());openExpBonus();});await p.waitForTimeout(400);await p.screenshot({path:`shots/v83-expbonus-${w}.png`});await p.evaluate(()=>{closeModal();showHome();});await p.waitForTimeout(300);await p.evaluate(()=>{try{BQ.length=0}catch(e){}document.querySelectorAll('#badgeFX,#fx > *').forEach(e=>e.remove())});await p.screenshot({path:`shots/v83-homechip-${w}.png`});console.log(w,JSON.stringify(r),p.errs);await p.close();}await b.close();})();
