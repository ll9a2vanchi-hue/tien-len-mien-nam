const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(2800);
await p.evaluate(()=>{G.hands[1]=[];G.hands[2]=[];G.hands[3]=[];G.finished=[1,2,3];G.over=true;endGame(false);render();});await p.waitForTimeout(2600);
await p.evaluate(()=>{closeModal();document.getElementById('badgeFX')?.remove();_bShow=false;BQ.length=0;});await p.waitForTimeout(1000);
const vis=()=>p.evaluate(()=>{const o=document.getElementById('startOv');return !!o&&getComputedStyle(o).display!=='none';});t('overlay shown',await vis());
for(const [n,f] of [['tables','openTables()'],['shop',"openShop()"],['quests','openQuests()'],['badges','openBadges()'],['spin','openSpin()'],['settings','openSettings()'],['result','showRes()'],['account','openAccount()']]){
 await p.evaluate(f);await p.waitForTimeout(1500);t('hidden under '+n,!(await vis()));if(n==='tables')await p.screenshot({path:'shots/v16-tables.png'});await p.evaluate(()=>closeModal());await p.waitForTimeout(900);t('back after '+n,await vis());}
await p.evaluate(()=>goHome());await p.waitForTimeout(800);t('hidden at home',!(await vis()));
console.log('pass',ok,'fail',bad,'errors',errs);await b.close();})();
