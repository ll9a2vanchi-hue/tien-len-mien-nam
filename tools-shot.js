const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const url='file:///workspace/tienlen/index.html';const errs=[];
for(const [name,w,h] of [['desktop',1280,800],['mobile',390,844]]){
 const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});p.on('pageerror',e=>errs.push(name+': '+e.message));
 await p.goto(url+'#demo');
 // play until it's my turn with history
 for(let i=0;i<40;i++){await p.waitForTimeout(500);const st=await p.evaluate(()=>({t:G.turn,h:G.hist.length,o:G.over}));
  if(st.o){await p.evaluate(()=>newGame());continue;}
  if(st.t===0){if(st.h>=3)break;await p.evaluate(()=>{hint();humanPlay();});}}
 await p.evaluate(()=>hint());await p.waitForTimeout(300);
 await p.screenshot({path:`shots/${name}-game.png`});
 // chop effect
 await p.evaluate(()=>{chopFX('CHẶT HEO!');});await p.waitForTimeout(250);await p.screenshot({path:`shots/${name}-chop.png`});
 await p.waitForTimeout(1200);
 await p.evaluate(()=>winFX('🎉 BẠN VỀ NHẤT!',true));await p.waitForTimeout(700);await p.screenshot({path:`shots/${name}-win.png`});
 await p.evaluate(()=>{G.over=true;render();});await p.screenshot({path:`shots/${name}-reveal.png`});
 await p.evaluate(()=>openBadges());await p.screenshot({path:`shots/${name}-badges.png`});
 const o=await p.evaluate(()=>{const h=document.getElementById('hand').getBoundingClientRect();return {hand:[h.left,h.right],sw:document.documentElement.scrollWidth,vw:innerWidth,sh:document.documentElement.scrollHeight}});
 console.log(name,JSON.stringify(o));}
// reduced motion
const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await p.goto(url+'#demo');await p.waitForTimeout(500);
console.log('RM',await p.evaluate(()=>RM));
console.log('errors',errs);await b.close();})();
