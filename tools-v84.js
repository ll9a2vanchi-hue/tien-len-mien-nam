const H=require('./tools-h.js');const tag=process.argv[2]||'before';
(async()=>{const b=await H.launch();const res=[];
for(const w of [360,412,461])for(const n of [6,3]){const p=await H.open(b,w,780,()=>{PR.xu=4e6;saveP();});
 await p.evaluate(n=>{localStorage.setItem('tlmn_pkn',n);mgOpen('poker');MG.pkN=n;MG.pkBots=mgBots(n-1);pkDeal();},n);await p.waitForTimeout(2500);
 const clean=()=>p.evaluate(()=>{window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();document.querySelectorAll('.toast').forEach(x=>x.remove());});
 await clean();await p.screenshot({path:`shots/v841-${tag}-${w}-n${n}-play.png`});
 await p.evaluate(()=>{const st=MG.st;st.busy=false;pkShow();});await p.waitForTimeout(2500);await clean();
 const m=await p.evaluate(()=>{const o=document.getElementById('mg');const bad=[];o.querySelectorAll('.cgc,.pks,.pkpot,.pkst,.pkraise,.pkboard,button').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&(r.right>innerWidth+1||r.left<-1||r.bottom>innerHeight+1))bad.push(e.className+':'+Math.round(r.left)+'-'+Math.round(r.right)+'/'+Math.round(r.bottom));});
  const cw=s=>{const e=o.querySelector(s);return e?Math.round(e.getBoundingClientRect().width):0};
  return {board:cw('.pkboard .cgc'),me:cw('.pks.me .pkh .cgc'),bot:cw('.pks:not(.me) .pkh .cgc'),win:o.querySelectorAll('.pks.win').length,bad:bad.slice(0,4),sw:o.scrollHeight>o.clientHeight+2};});
 res.push([w,n,JSON.stringify(m)]);await p.screenshot({path:`shots/v841-${tag}-${w}-n${n}-show.png`});await p.close();}
console.log(res.map(r=>r.join(' ')).join('\n'));await b.close();})();
