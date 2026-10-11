const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const R={};
for(const w of [360,461]){const p=await b.newPage({viewport:{width:w,height:w===360?800:1024}});p.on('pageerror',e=>errs.push(w+': '+e.message));
 await p.goto('http://localhost:8765/index.html?t='+w);await p.waitForTimeout(800);
 await p.evaluate(()=>{closeModal();PR.xu=200000;saveP();setInterval(()=>{document.querySelectorAll('#badgeFX').forEach(e=>e.remove());try{BQ.length=0}catch(e){}},100);setMode('3cao');openCasino('3cao');cgSetup('n',6);cgSetup('role','con');});
 await p.waitForTimeout(300);await p.screenshot({path:`shots/v50-setup-${w}.png`});
 await p.evaluate(()=>cgDeal());await p.waitForTimeout(900);await p.evaluate(()=>bcFlip());await p.waitForTimeout(2200);
 R['bc'+w]=await p.evaluate(()=>({ov:document.documentElement.scrollWidth-innerWidth,ph:CG.st.phase,res:Object.values(CG.st.res).map(r=>r.v),sum:Object.values(CG.st.res).reduce((a,r)=>a+r.v,0),led:CG.st.ledger}));
 await p.screenshot({path:`shots/v50-3cao-con6-${w}.png`});
 // xì dách làm cái 6 người
 const x0=await p.evaluate(()=>{closeCasino();setMode('xidach');openCasino('xidach');cgSetup('n',6);cgSetup('role','cai');CG.bet=500;const x=PR.xu;cgDeal();return x;});
 await p.waitForFunction(()=>CG.st&&(CG.st.phase==='deal'||CG.st.phase==='done'),null,{timeout:15000});
 R['xdcai'+w]=await p.evaluate(()=>{const st=CG.st;if(st.phase==='deal'){while(!xdCanXet()&&st.phase==='deal')xdHit();}return st.phase;});
 if(R['xdcai'+w]==='deal'){await p.evaluate(()=>xdXet(CG.st.seats.findIndex((s,i)=>i>0&&!CG.st.res[i])));await p.waitForTimeout(400);await p.screenshot({path:`shots/v50-xd-cai-xet-${w}.png`});await p.evaluate(()=>xdXetAll());}
 await p.waitForTimeout(800);
 R['xd'+w]=await p.evaluate(x0=>({ov:document.documentElement.scrollWidth-innerWidth,ph:CG.st.phase,me:CG.st.res[0].v,delta:PR.xu-x0,sum:Object.values(CG.st.res).reduce((a,r)=>a+r.v,0),led:CG.st.ledger.length,bx:Object.keys(CG.bxu).length}),x0);
 await p.screenshot({path:`shots/v50-xd-cai6-${w}.png`});
 await p.evaluate(()=>{cgSetup('n',2);cgSetup('role','con');cgDeal();});await p.waitForTimeout(1200);await p.screenshot({path:`shots/v50-xd-con2-${w}.png`});
 R['two'+w]=await p.evaluate(()=>({ov:document.documentElement.scrollWidth-innerWidth,ph:CG.st.phase}));await p.close();}
console.log(JSON.stringify(R),errs);await b.close();})();
