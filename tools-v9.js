const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
for(const [nm,w,h] of [['m',461,1024],['d',1280,800]]){const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:nm==='m'});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(nm+e.message));
 await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(1000);await p.evaluate(()=>{closeModal();PR.xu=3000;PR.xp=8000;saveP();openTables();});await p.waitForTimeout(300);await p.screenshot({path:`shots/v9-${nm}-tables.png`});
 await p.evaluate(()=>{closeModal();openSettings();});await p.waitForTimeout(300);await p.screenshot({path:`shots/v9-${nm}-settings.png`});
 await p.evaluate(()=>{closeModal();ensureDaily(PR,new Date());questEvent(PR,'game',2);openQuests();});await p.waitForTimeout(300);await p.screenshot({path:`shots/v9-${nm}-quests.png`});
 await p.evaluate(()=>{closeModal();openBadges();});await p.waitForTimeout(300);await p.screenshot({path:`shots/v9-${nm}-badges.png`});
 await p.evaluate(()=>{closeModal();startTable(4);});
 for(let i=0;i<300;i++){await p.waitForTimeout(200);const s=await p.evaluate(()=>({t:G.turn,o:G.over}));if(s.o)break;if(s.t===0)await p.evaluate(()=>{hint();if(sel.size)humanPlay();else humanPass();});if(i==8)await p.screenshot({path:`shots/v9-${nm}-game.png`});}
 await p.waitForTimeout(1500);await p.screenshot({path:`shots/v9-${nm}-result.png`});console.log(nm,await p.evaluate(()=>JSON.stringify({ai:BOTAI,res:G.lastRes&&{d:G.lastRes.delta,b:G.lastRes.bonus},q:PR.quests.week.list.length})));await ctx.close();}
console.log('errors',errs);await b.close();})();
