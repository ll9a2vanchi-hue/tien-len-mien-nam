const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
for(const W of [360,375,390,412,430,461]){const p=await (await b.newContext({viewport:{width:W,height:W<400?800:915},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(2800);
 const r=await p.evaluate(()=>{let worst=0,over=0;for(let i=0;i<300;i++){const d=[...Array(52).keys()].sort(()=>Math.random()-.5);const n=1+(i%13);G.hands[0]=sortCards(d.slice(0,n));sortMode=i%2?0:0;render();
   const tops=new Set([...document.querySelectorAll('#hand .card')].map(e=>Math.round(e.getBoundingClientRect().top/10)));worst=Math.max(worst,tops.size);
   const hr=$('hand').getBoundingClientRect();[...document.querySelectorAll('#hand .card')].forEach(e=>{const r=e.getBoundingClientRect();if(r.right>innerWidth+1||r.left<-1)over++;});}return {worst,over};});
 t('rows<=2 @'+W+' got '+r.worst,r.worst<=2);t('no overflow @'+W+' '+r.over,r.over===0);
 if(W===461){await p.evaluate(()=>{G.hands[0]=G.hands[0].slice(0,13);});
  await p.evaluate(()=>{G.hands[1]=[];G.hands[2]=[];G.hands[3]=[];G.finished=[1,2,3];G.over=true;endGame(false);render();});await p.waitForTimeout(1500);await p.click('#finGo');await p.waitForTimeout(800);
  t('result shown',await p.evaluate(()=>$('modalIn').textContent.includes('Kết quả')));await p.evaluate(()=>{closeModal();document.getElementById('badgeFX')?.remove();_bShow=false;BQ.length=0;});await p.waitForTimeout(1000);
  t('start overlay',await p.evaluate(()=>!!$('startOv')&&getComputedStyle($('bPlay')).visibility==='hidden'));await p.screenshot({path:'shots/v15-start.png'});
  await p.evaluate(()=>{for(let i=0;i<40;i++){const d=[...Array(52).keys()].sort(()=>Math.random()-.5).slice(0,13);G.hands[0]=sortCards(d);}});
  await p.click('#startOv .sbig');await p.waitForTimeout(300);t('started',await p.evaluate(()=>!$('startOv')&&!G.over));await p.waitForTimeout(2600);await p.screenshot({path:'shots/v15-hand.png'});}}
console.log('pass',ok,'fail',bad,'errors',errs.slice(0,3));await b.close();})();
(async()=>{await new Promise(r=>setTimeout(r,500));})();
