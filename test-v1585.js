const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.stats.earned=5e8;saveP();});
 const r=await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const B=expBreakdown(PR);openExpBonus();await sl(300);const m=document.querySelector('.modal')||document.body;const t=m.textContent;
  const x0=PR.xp;addXp(PR,100);const got=PR.xp-x0;
  const bad=[...document.querySelectorAll('.extot,.exrow')].filter(e=>{const r=e.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).length;
  return {total:B.total,raw:B.raw,capped:B.capped,got,noCapTxt:/Không giới hạn trần/.test(t),oldTxt:/Trần \+300|chạm trần/.test(t),bar:!!document.querySelector('.excap'),bad,v:APP_V};});
 if(w===412)console.log(JSON.stringify(r));
 ok(r.total>300&&r.total===r.raw&&!r.capped,'bonus uncapped '+r.total);ok(r.got===Math.round(100*(1+r.total/100)),'addXp uses full bonus '+r.got);
 ok(r.noCapTxt&&!r.oldTxt&&!r.bar,'UI text updated');ok(r.bad===0,'fits '+w);ok(/^1\.5[89]\./.test(r.v)&&r.v>='1.58.5','version');
 await p.evaluate(()=>{window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();});await p.screenshot({path:`shots/v1585-expbonus-${w}.png`});await p.close();}
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
