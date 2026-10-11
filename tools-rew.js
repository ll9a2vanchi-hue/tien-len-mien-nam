const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
for(const rm of ['no-preference','reduce']){const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true,reducedMotion:rm})).newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(2800);
 await p.evaluate(()=>{G.hands[2]=[];G.hands[3]=[];G.hands[0]=[];G.finished=[0,2,3];G.over=true;endGame(false);render();});
 await p.waitForTimeout(2200+700);t(rm+' rewbox',await p.evaluate(()=>!!document.querySelector('.rewbox')));await p.screenshot({path:`shots/v18-rew-count-${rm}.png`});
 let seen=false;for(let i=0;i<20;i++){await p.waitForTimeout(100);if(await p.evaluate(()=>!!document.querySelector('.ftxt.gain'))){seen=true;break;}}
 t(rm+' float +xu',seen);await p.screenshot({path:`shots/v18-rew-fly-${rm}.png`});await p.waitForTimeout(400);t(rm+' float xp',await p.evaluate(()=>!!document.querySelector('.ftxt.xp')));
 // lose
 await p.evaluate(()=>{closeModal();document.getElementById('badgeFX')?.remove();_bShow=false;BQ.length=0;newGame(4);});await p.waitForTimeout(3000);
 await p.evaluate(()=>{G.hands[1]=[];G.hands[2]=[];G.hands[3]=[];G.finished=[1,2,3];G.over=true;endGame(false);render();});await p.waitForTimeout(2200);
 let ls=false;for(let i=0;i<40;i++){await p.waitForTimeout(100);if(await p.evaluate(()=>!!document.querySelector('.ftxt.loss'))){ls=true;break;}}t(rm+' loss red',ls);if(rm==='reduce')await p.screenshot({path:'shots/v18-rew-loss.png'});
 // quest-like reward
 await p.evaluate(()=>{closeModal();PR.xu+=150;saveP();});await p.waitForTimeout(150);t(rm+' generic float',await p.evaluate(()=>!!document.querySelector('.ftxt.gain')));}
console.log('pass',ok,'fail',bad,'errors',errs);await b.close();})();
