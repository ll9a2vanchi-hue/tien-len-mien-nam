const H=require('./tools-h.js');const tag=process.argv[2]||'pre';const W=(process.argv[3]||'412').split(',').map(Number);
(async()=>{const b=await H.launch();for(const w of W){const sh=async(p,n)=>{await p.evaluate(()=>{window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();});await p.waitForTimeout(250);await p.screenshot({path:`shots/v87-${tag}-${n}-${w}.png`});};
 const setup=()=>{PR.xp=Math.max(PR.xp,levelXp?0:0);PR.xu=3e6;saveP();};
 let p=await H.open(b,w,800,new Function(`let x=0;const T=${process.env.LV||126};while(levelInfo(x).level<T)x+=50;PR.xp=x;PR.xu=3e6;saveP();showHome&&showHome();`));await sh(p,'home');
 await p.evaluate(()=>{hideStartOv&&hideStartOv();newGame(4);});await p.waitForTimeout(1500);await sh(p,'tlmn');
 await p.evaluate(()=>{try{G.over=true}catch(e){};showHome();openCasino('3cao');});await p.waitForTimeout(500);await sh(p,'3cao');
 await p.evaluate(()=>{closeCasino();mgOpen('xito');xtDeal();});await p.waitForTimeout(1500);await sh(p,'xito');
 await p.evaluate(()=>{mgClose(1);mgOpen('poker');});await p.waitForTimeout(600);await sh(p,'poker');
 await p.evaluate(()=>{mgClose(1);mgOpen('baucua');});await p.waitForTimeout(1500);await sh(p,'baucua');
 await p.evaluate(()=>{mgClose(1);mgOpen('domino');});await p.waitForTimeout(600);await sh(p,'domino');
 if(p.errs.length)console.log('errs',p.errs);await p.close();}
await b.close();})();
