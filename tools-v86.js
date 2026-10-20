const H=require('./tools-h.js');const tag=process.argv[2]||'after';
(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xu=4e6;PR.bcHist=[['cua','cua','cua'],['nai','ga','ca'],['bau','tom','ga'],['ca','ca','nai'],['tom','bau','cua'],['ga','ga','tom'],['nai','nai','bau'],['cua','ca','tom'],['bau','bau','bau']];saveP();localStorage.setItem('tlmn_bcrole','con');localStorage.setItem('tlmn_bcseats','6');});
 const clean=()=>p.evaluate(()=>{window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();document.querySelectorAll('.toast').forEach(x=>x.remove());});
 const meas=()=>p.evaluate(()=>{const t=document.querySelector('#mg .bctbl');const h=document.querySelector('#mg .bchist');const hr=h&&h.getBoundingClientRect();const c=document.querySelector('#mg .cgctl').getBoundingClientRect();const bad=[...document.querySelectorAll('#mg button,#mg .bchist')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<-.5||r.right>innerWidth+.5||e.scrollWidth>e.clientWidth+1)}).map(e=>e.className+':'+e.textContent.slice(0,10));return {scroll:t.scrollHeight-t.clientHeight,hist:hr?Math.round(hr.left)+'-'+Math.round(hr.right):'none',bad};});
 await p.evaluate(()=>mgOpen('baucua'));await p.waitForTimeout(600);
 await p.evaluate(()=>{bcPut('bau');bcPut('cua');bcPut('cua');});await p.waitForTimeout(500);await clean();console.log(w,'bet',JSON.stringify(await meas()));await p.screenshot({path:`shots/v158-${w}-bet.png`});
 await p.evaluate(()=>{window._roll=bcuaRoll;bcuaRoll=()=>['cua','bau','ga'];bcShake();});await p.waitForFunction(()=>MG.st.phase==='open',null,{timeout:20000});
 await p.evaluate(()=>bcOpen());await p.waitForTimeout(450);await p.screenshot({path:`shots/v158-${w}-bigdice.png`});await p.waitForTimeout(1300);await p.screenshot({path:`shots/v158-${w}-payfly.png`});
 await p.waitForTimeout(2200);await clean();console.log(w,'done',JSON.stringify(await meas()),await p.evaluate(()=>MG.st.res.me+' hist'+PR.bcHist.length));await p.screenshot({path:`shots/v158-${w}-done.png`});
 const rb=await p.evaluate(()=>{bcRebet();const a=JSON.stringify(MG.st.bets);bcDouble();return a+' -> '+JSON.stringify(MG.st.bets)+' last '+JSON.stringify(MG.st.lastBets);});console.log(w,'rebet',rb);await p.waitForTimeout(500);await clean();await p.screenshot({path:`shots/v158-${w}-rebet.png`});
 await p.evaluate(()=>{bcuaRoll=()=>['ga','ga','ga'];bcShake();});await p.waitForFunction(()=>MG.st.phase==='open',null,{timeout:20000});await p.evaluate(()=>bcOpen());await p.waitForTimeout(900);await p.screenshot({path:`shots/v158-${w}-bao.png`});
 await p.waitForTimeout(3500);await clean();console.log(w,'bao-done',JSON.stringify(await meas()));await p.close();}
await b.close();})();
