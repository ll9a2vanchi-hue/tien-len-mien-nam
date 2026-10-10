const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('c:'+m.text())});
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(800);await p.evaluate(()=>{closeModal();window.lvDelay=()=>60;startTable(4);});
let games=0,stalls=0,last='',same=0;
for(let i=0;i<4000&&games<6;i++){await p.waitForTimeout(80);const s=await p.evaluate(()=>({o:G.over,t:G.turn,m:!!document.querySelector('#modal.show, #modal:not([hidden]) #modalIn h3'),h:G.hands.map(x=>x.length).join(','),f:G.finished.join(','),cur:!!G.cur,d:DEALING,mt:document.getElementById('modalIn')?.textContent.slice(0,20)}));
 const k=JSON.stringify(s);if(k===last)same++;else{same=0;last=k;}
 if(same>60){stalls++;console.log('STALL',k);await p.screenshot({path:'shots/v13-stall-'+stalls+'.png'});await p.evaluate(()=>{closeModal();newGame(4)});same=0;continue;}
 if(s.o){if(s.mt&&s.mt.includes('Kết quả')){games++;console.log('end ok',s.h,s.f);await p.evaluate(()=>{closeModal();newGame(4);});}continue;}
 if(s.t===0&&!s.d){const h0=await p.evaluate(()=>G.hands[0].length);const hh=s.h.split(',').map(Number);
  // human tries to stay last: pass when possible, else play one card
  await p.evaluate(()=>{if(G.cur)humanPass();else{sel.clear();sel.add(G.first?G.firstCard:G.hands[0][0]);humanPlay();}});}}
await p.evaluate(()=>{G.hands[0]=G.hands[0].slice(0,1);render();});await p.waitForTimeout(300);await p.screenshot({path:'shots/v13-onecard.png'});
console.log('games',games,'stalls',stalls,'errors',errs.slice(0,5));await b.close();})();
