const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
for(const w of [360,412,461])for(const n of [6,3]){const p=await H.open(b,w,780,()=>{PR.xu=4e6;saveP();});
 await p.evaluate(n=>{mgOpen('poker');MG.pkN=n;MG.pkBots=mgBots(n-1);pkDeal();},n);await p.waitForTimeout(1800);await p.evaluate(()=>{if(MG.st.phase!=='done'){MG.st.busy=false;pkShow();}});await p.waitForTimeout(1200);
 const r=await p.evaluate(()=>{const o=document.getElementById('mg'),R=s=>{const e=o.querySelector(s);return e&&e.getBoundingClientRect()};const bd=R('.pkboard'),op=R('.pkopp'),me=R('.pks.me'),t=R('.pktbl');
  const out=[...o.querySelectorAll('.cgc')].some(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1||r.left<-1});
  return {board:R('.pkboard .cgc').width,me:R('.pks.me .pkh .cgc').width,bot:R('.pks:not(.me) .pkh .cgc').width,ov:op.bottom<=bd.top+1&&bd.bottom<=me.top+1&&me.bottom<=t.bottom+1,out,win:!!o.querySelector('.pks.win')||Math.max(...MG.st.res)<=0,err:window.__e};});
 ok(r.board>=45&&r.me>=58&&r.bot>=26,`sizes ${w} n${n} ${Math.round(r.board)}/${Math.round(r.me)}/${Math.round(r.bot)}`);ok(r.ov&&!r.out,`no overlap ${w} n${n}`);ok(r.win,'winner');await p.close();}
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
