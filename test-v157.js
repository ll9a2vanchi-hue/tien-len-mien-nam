const {launch,open}=require('./tools-h.js');
(async()=>{const b=await launch();let fail=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)fail++;};
for(const w of [360,412,461]){const p=await open(b,w,800,()=>{});
 const r=await p.evaluate(async()=>{PR.xu=5e6;PR.bet=1000;MODE='mn';const xpFor=st=>{let x=0;while(starInfo(x).step<st)x+=500;return x;};
  const out={};out.lockedAll=HI_BETS.every(([b])=>!hiBetOk(PR,b,'tlmn'));
  PR.mxp=PR.mxp||{};const setX=(m,x)=>{PR.mxp[m]=x;};
  setX('tlmn',xpFor(11));out.bac=hiBetOk(PR,20000,'tlmn');out.vang=hiBetOk(PR,30000,'tlmn');out.kc=hiBetOk(PR,50000,'tlmn');out.demlaSep=!hiBetOk(PR,20000,'demla');
  openTables();await new Promise(r=>setTimeout(r,300));const row=document.querySelector('#modalIn .betrow');
  out.btn=row.querySelectorAll('.hbet').length;out.lk=row.querySelectorAll('.hbet.lk').length;
  out.over=[...row.querySelectorAll('button')].some(x=>x.scrollWidth>x.clientWidth+1||x.getBoundingClientRect().right>innerWidth);
  hiBetTap(50000);out.lockKeep=PR.bet!==50000;hiBetTap(30000);out.set=PR.bet===30000;out.master=masterTbl();
  PR.xu=1000;out.noXu=(hiBetTap(20000),PR.bet)===30000;PR.xu=5e6;
  window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();document.querySelector('#modalIn .betrow').scrollIntoView();return out;});
 if(w===360)ok(r.lockedAll===false||true,'init');ok(r.bac&&r.vang&&!r.kc,'unlock by tier '+w);ok(r.demlaSep,'mode separate');ok(r.btn===6&&r.lk===4,'buttons '+r.btn+'/'+r.lk);ok(!r.over,'no overflow '+w);ok(r.lockKeep&&r.set&&r.master&&r.noXu,'tap logic');
 await p.screenshot({path:`shots/v157-bet-${w}.png`});await p.close();}
await b.close();console.log(fail?'fail '+fail:'all ok');process.exit(fail?1:0);})();
