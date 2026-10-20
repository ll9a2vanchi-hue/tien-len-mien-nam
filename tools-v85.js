const H=require('./tools-h.js');const tag=process.argv[2]||'before';
(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xu=4e6;saveP();localStorage.setItem('tlmn_bcrole','con');localStorage.setItem('tlmn_bcseats','6');});
 const clean=()=>p.evaluate(()=>{window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();document.querySelectorAll('.toast').forEach(x=>x.remove());});
 await p.evaluate(()=>{mgOpen('baucua');});await p.waitForTimeout(800);
 await p.evaluate(()=>{['bau','cua','ca'].forEach(s=>{if(BC_SYM.includes(s))bcPut(s);});bcPut(BC_SYM[0]);bcPut(BC_SYM[1]);bcPut(BC_SYM[3]);});await p.waitForTimeout(600);await clean();
 await p.screenshot({path:`shots/v852-${tag}-${w}-bet.png`});
 const ov=await p.evaluate(()=>{const o=document.getElementById('mg');const els=[...o.querySelectorAll('.bcs,.bct,.bcboard,.bcsetup,.cgctl,.bcbowl,.bcdl,.bcs.dl,.cgmsg,button,.bcseat-opt')].filter(e=>e.getBoundingClientRect().width);const r=[];
  for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=els[i],c=els[j];if(a.contains(c)||c.contains(a))continue;const A=a.getBoundingClientRect(),B=c.getBoundingClientRect();const x=Math.min(A.right,B.right)-Math.max(A.left,B.left),y=Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top);if(x>0.5&&y>0.5)r.push(a.className.slice(0,20)+' X '+c.className.slice(0,20)+' '+Math.round(x)+'x'+Math.round(y));}
  const out=els.filter(e=>{const R=e.getBoundingClientRect();return R.right>innerWidth+.5||R.left<-.5||R.bottom>innerHeight+.5}).map(e=>e.className.slice(0,20));return {ov:r.slice(0,12),out,sh:document.scrollingElement.scrollHeight>innerHeight};});
 console.log(w,JSON.stringify(ov));
 await p.evaluate(()=>bcShake());await p.waitForTimeout(3200);await clean();await p.screenshot({path:`shots/v852-${tag}-${w}-shake.png`});
 await p.waitForFunction(()=>MG.st.phase==='open',null,{timeout:15000});await p.waitForTimeout(200);await clean();await p.screenshot({path:`shots/v852-${tag}-${w}-open.png`});
 await p.evaluate(()=>bcOpen());await p.waitForTimeout(1000);await p.screenshot({path:`shots/v852-${tag}-${w}-fly.png`});await p.waitForTimeout(2500);await clean();await p.screenshot({path:`shots/v852-${tag}-${w}-done.png`});console.log(w,'done-sc',await p.evaluate(()=>{const t=document.querySelector('#mg .bctbl');return t.scrollHeight-t.clientHeight;}));
 console.log(w,await p.evaluate(()=>JSON.stringify({dice:MG.st.dice,me:MG.st.res.me,bets:MG.st.bets,msg:MG.st.msg})));
 // cai
 await p.evaluate(()=>{bcRole('cai');});await p.waitForFunction(()=>!MG.st.placing,null,{timeout:30000});await p.waitForTimeout(300);await p.evaluate(()=>bcShake());await p.waitForFunction(()=>MG.st.phase==='open',null,{timeout:30000});await p.evaluate(()=>bcOpen());await p.waitForTimeout(3500);await clean();await p.screenshot({path:`shots/v852-${tag}-${w}-cai.png`});
 console.log(w,'cai',await p.evaluate(()=>JSON.stringify({me:MG.st.res.me,b:MG.st.res.b,led:MG.st.ledger})));
 await p.close();}
await b.close();})();
