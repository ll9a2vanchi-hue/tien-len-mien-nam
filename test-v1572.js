const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const p=await H.open(b,461,780,()=>{PR.xu=4e6;saveP();});
const r=await p.evaluate(()=>{const C=(v,s)=>{for(let c=0;c<52;c++)if(pkV(c)===v&&(c&3)===s)return c;};const cs=[C(14,0),C(2,1),C(3,2),C(4,3),C(5,0),C(9,1),C(13,2)];return pkHandTxt(best5(cs,'pk'));});
ok(/^Sảnh A-2-3-4-5$/.test(r)||/A-2-3-4-5/.test(r),'wheel text '+r);
for(const [w,h] of [[360,780],[412,780],[461,700],[461,900]]){await p.setViewportSize({width:w,height:h});
 await p.evaluate(()=>{mgOpen('poker');MG.pkN=6;MG.pkBots=mgBots(5);pkDeal();});await p.waitForTimeout(1600);await p.evaluate(()=>{if(MG.st.phase!=='done'){MG.st.busy=false;pkShow();}});await p.waitForTimeout(800);
 const q=await p.evaluate(()=>{const R=s=>document.querySelector(s).getBoundingClientRect();const bd=R('.pkboard');const hb=Math.max(...[...document.querySelectorAll('.pkopp .pkh')].map(e=>e.getBoundingClientRect().bottom));const st=MG.st;const live=btLive(st.b).length;window.__d=JSON.stringify({res:st.res,ph:st.phase,led:st.ledger,n:document.querySelectorAll('.cgc.pkw').length,live});return {d:window.__d,ok:hb<=bd.top+1,hl:live<2||document.querySelectorAll('.cgc.pkw').length>=5,led:live<2||st.ledger.some(l=>/·.*[♠♣♦♥]|Sảnh/.test(l[0]))};});
 ok(q.ok,`hole cards above board ${w}x${h}`);ok(q.hl,'5 winning cards highlighted'+(q.hl?'':' '+q.d));ok(q.led,'ledger shows cards');}
// bầu cua
await p.setViewportSize({width:360,height:780});
const bc=await p.evaluate(async()=>{localStorage.setItem('tlmn_bcrole','con');mgOpen('baucua');MG.st.bets={};bcPut(BC_SYM[0]);bcPut(BC_SYM[1]);bcShake();await new Promise(r=>{const t=setInterval(()=>{if(MG.st.phase==='open'){clearInterval(t);r();}},100);});
 const x0=PR.xu;bcOpen();const d=[...document.querySelectorAll('#mg .bcdelta')].length;const exp=bcuaPay(MG.st.bets,MG.st.dice);return {d,me:MG.st.res.me,exp,neg:/thua -/.test(MG.st.msg)};});
ok(bc.d>=2,'baucua deltas '+bc.d);ok(bc.me===bc.exp,'baucua payout');ok(!bc.neg,'no double minus');
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
