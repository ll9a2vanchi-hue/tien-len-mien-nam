const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xu=4e6;delete PR.xtAllin;saveP();});
 const pr=p.evaluate(async(w)=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const C=(v,s)=>{for(let c=0;c<52;c++)if(pkV(c)===v&&(c&3)===s)return c;};
  const play=async(o)=>{mgOpen('xito');xtDeal();await sl(300);const st=MG.st,b=st.b,ante=st.bet||MG.bet;const amt=o.amt*ante;
   st.hands[0]=[C(14,0),C(14,1),C(14,2),C(14,3),C(2,0)];st.hands[1]=[C(3,0),C(5,1),C(7,2),C(9,3),C(11,0)];if(o.lose)[st.hands[0],st.hands[1]]=[st.hands[1],st.hands[0]];
   b.contrib=b.contrib.map((_,i)=>i<2?amt:0);b.fold=b.fold.map((_,i)=>i>=2);b.allin[0]=!!o.allin;b.fold[0]=!!o.fold;const xp0=PR.xp;const x=xtShow();await sl(50);return {res:st.res[0],dxp:PR.xp-xp0,n:(PR.xtAllin||{}).n||0};};
  const base=await play({amt:10,allin:false});const out={};
  out.small=await play({amt:5,allin:true});out.win=await play({amt:10,allin:true});out.lose=await play({amt:10,allin:true,lose:true});out.fold=await play({amt:10,allin:true,fold:true});
  PR.xtAllin.n=2;await play({amt:12,allin:true});let t;for(let k=0;k<300&&!t;k++){await sl(100);t=[...document.querySelectorAll('.toast')].map(e=>{const r=e.getBoundingClientRect();return {txt:e.textContent,l:r.left,r:r.right}}).find(x=>/3\/10/.test(x.txt));}
  window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();
  out.toast=t;out.fit=t&&t.l>=0&&t.r<=innerWidth;window.__shot=1;await new Promise(r=>{window.__go=r;});
  PR.xtAllin.n=10;out.cap=await play({amt:10,allin:true});PR.xtAllin={d:'2000-01-01',n:10};out.reset=await play({amt:10,allin:true});out.base=base;return out;},w);await p.waitForFunction(()=>window.__shot,null,{timeout:60000});await p.waitForTimeout(450);await p.screenshot({path:`shots/v1582-toast-${w}.png`});await p.evaluate(()=>window.__go());const r=await pr;
 if(w===360)console.log(JSON.stringify(r));
 ok(r.win.n===1&&r.small.n===0,'bonus only for big all-in win');ok(r.lose.n===1&&r.fold.n===1,'no bonus on loss/fold');ok(r.cap.n===10,'cap 10/day');ok(r.reset.n===1,'resets on new day');
 await p.waitForTimeout(10);ok(r.toast&&/🔥 Tố tất thắng \+\d+ EXP \(3\/10 hôm nay\)/.test(r.toast.txt)&&r.fit,'toast '+(r.toast&&r.toast.txt));
 await p.close();}
// unit: bonus = 50% base before multiplier
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
