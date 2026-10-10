const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(800);await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(3000);
await p.evaluate(()=>{G.hands[0]=sortCards([0,5,10,13,19,24,25,36,51,48,41,42,44]);G.turn=0;G.hands[0]=G.hands[0].filter(c=>c!==51);G.cur=detect([51]);G.curBy=2;G.pile=[51];render();});await p.waitForTimeout(400);console.log(await p.evaluate(()=>[...document.querySelectorAll('#hand .card')].map(e=>e.className.replace('card','').trim()+':'+getComputedStyle(e).marginLeft).join(' | ')));
console.log(await p.evaluate(()=>{const e=document.getElementById('noBeat');return e?getComputedStyle(e).position+' '+e.parentNode.id+' '+e.parentNode.className:'none'}));await p.screenshot({path:'shots/v13-stuck.png'});await p.evaluate(()=>{sortHand();});await p.waitForTimeout(200);await p.screenshot({path:'shots/v13-sort-rank.png'});
console.log('errors',errs);await b.close();})();
