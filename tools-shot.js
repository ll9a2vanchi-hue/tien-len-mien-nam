// Chụp màn hình + kiểm tra PWA offline. Cần: npm i playwright-core; chạy server tĩnh ở cổng 8765.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const url='http://localhost:8765/index.html';const errs=[];
for(const [name,w,h] of [['desktop',1280,800],['mobile',390,844]]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(name+': '+e.message));
 await p.goto(url+'#demo');
 for(let i=0;i<40;i++){await p.waitForTimeout(500);const st=await p.evaluate(()=>({t:G.turn,h:G.hist.length,o:G.over}));
  if(st.o){await p.evaluate(()=>newGame());continue;}if(st.t===0){if(st.h>=3)break;await p.evaluate(()=>{hint();humanPlay();});}}
 await p.evaluate(()=>hint());await p.waitForTimeout(300);await p.screenshot({path:`shots/${name}-game.png`});
 await p.evaluate(()=>levelUpFX({xp:100,ups:[5],xu:250,newTitles:[TITLES[1]]}));await p.waitForTimeout(1500);await p.screenshot({path:`shots/${name}-levelup.png`});await p.waitForTimeout(2000);
 await p.evaluate(()=>{PR.xp=3000;renderMe();openTitles();});await p.screenshot({path:`shots/${name}-titles.png`});await p.evaluate(()=>closeModal());
 await p.evaluate(()=>chopFX('CHẶT HEO!'));await p.waitForTimeout(250);await p.screenshot({path:`shots/${name}-chop.png`});await p.waitForTimeout(1200);
 await p.evaluate(()=>{G.over=true;render();winFX('🎉 BẠN VỀ NHẤT!',true);});await p.waitForTimeout(700);await p.screenshot({path:`shots/${name}-win-reveal.png`});
 await p.evaluate(()=>openBadges());await p.screenshot({path:`shots/${name}-badges.png`});
 await p.evaluate(()=>doInstall());await p.screenshot({path:`shots/${name}-install.png`});
 await p.evaluate(()=>openAccount());await p.screenshot({path:`shots/${name}-account.png`});
 const o=await p.evaluate(()=>{const t=document.getElementById('top').getBoundingClientRect();return {topH:t.height,sw:document.documentElement.scrollWidth,vw:innerWidth}});console.log(name,JSON.stringify(o));
 if(name==='mobile'){ // PWA offline
  const sw=await p.evaluate(async()=>{const r=await navigator.serviceWorker.ready;return !!r.active;});await p.waitForTimeout(1000);
  await ctx.setOffline(true);await p.reload();await p.waitForTimeout(800);
  console.log('SW active',sw,'offline reload ok',await p.evaluate(()=>typeof newGame==='function'&&document.querySelectorAll('#hand .card').length));
  await ctx.setOffline(false);}
 await ctx.close();}
console.log('errors',errs);await b.close();})();
