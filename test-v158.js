const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xu=4e6;PR.bcHist=[];saveP();localStorage.setItem('tlmn_bcrole','con');localStorage.setItem('tlmn_bcseats','6');});
 const r=await p.evaluate(async()=>{const wait=ph=>new Promise(r=>{const t=setInterval(()=>{if(MG.st.phase===ph&&!MG.st.placing){clearInterval(t);r();}},50);});const out={};mgOpen('baucua');
  out.noRebet=document.querySelector('#mg .bcxb').disabled;bcPut('bau');bcPut('cua');
  for(let i=0;i<11;i++){bcuaRoll=i===10?()=>['ga','ga','ga']:()=>['cua','bau','tom'];if(i)bcRebet();bcShake();await wait('open');bcOpen();}
  out.hist=PR.bcHist.length;out.first=PR.bcHist[0].join();out.saved=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>/prof|save|tlmn_p/.test(k))||'x')||'{}');out.big=!!document.querySelector('.bcbig.bao');out.pay=document.querySelectorAll('.bcpay').length;
  out.me=MG.st.res.me;out.exp=bcuaPay(MG.st.bets,MG.st.dice);
  PR.xu=300;bcRebet();out.rebetBlocked=bcTot(MG.st.bets)===0;PR.xu=4e6;bcRebet();const t=bcTot(MG.st.bets);bcDouble();out.dbl=bcTot(MG.st.bets)===2*t;PR.xu=bcTot(MG.st.bets)+100;const t2=bcTot(MG.st.bets);bcDouble();out.dblBlocked=bcTot(MG.st.bets)===t2;PR.xu=4e6;
  const tb=document.querySelector('#mg .bctbl');out.scroll=tb.scrollHeight-tb.clientHeight;
  const bad=[...document.querySelectorAll('#mg button,#mg .bchist')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<-.5||r.right>innerWidth+.5)});out.bad=bad.length;return out;});
 ok(r.noRebet,'rebet disabled at start');ok(r.hist===10&&r.first==='ga,ga,ga','history 10, newest first');ok(r.big,'bão overlay');ok(r.me===r.exp,'payout '+r.me);ok(r.rebetBlocked&&r.dbl&&r.dblBlocked,'rebet/x2 respect xu');ok(r.scroll<=0&&r.bad===0,`fits ${w} scroll ${r.scroll}`);
 const s=await p.evaluate(()=>{const raw=Object.values(localStorage).find(v=>/bcHist/.test(v));return !!raw;});ok(s,'history persisted');
 await p.close();}
// reduced motion
const ctx=await b.newContext({reducedMotion:'reduce',viewport:{width:360,height:780}});const p=await ctx.newPage();await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(800);
const e=await p.evaluate(async()=>{try{PR.xu=1e5;mgOpen('baucua');bcRole('con');await new Promise(r=>setTimeout(r,1500));bcPut('bau');bcShake();await new Promise(r=>{const t=setInterval(()=>{if(MG.st.phase==='open'){clearInterval(t);r();}},50);});bcOpen();return 'ok '+document.querySelectorAll('.bcpay').length;}catch(x){return 'err '+x.message;}});ok(/^ok 0/.test(e),'reduced motion '+e);
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
