const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();openRename();});await p.fill('#nmIn','Đỗ Minh Khôi');await p.screenshot({path:'shots/v15-rename.png'});
await p.evaluate(()=>saveName());await p.waitForTimeout(300);await p.screenshot({path:'shots/v15-home-name.png'});
await p.evaluate(()=>startTable(4));await p.waitForTimeout(1300);console.log('visible hand cards mid-deal',await p.evaluate(()=>[...document.querySelectorAll('#hand .card')].filter(c=>c.style.visibility!=='hidden').length));await p.screenshot({path:'shots/v15-deal-mid.png'});
for(let i=0;i<60;i++){await p.waitForTimeout(200);if(await p.evaluate(()=>!DEALING&&G.turn===0))break;}await p.waitForTimeout(400);await p.screenshot({path:'shots/v15-myturn.png'});
console.log('name in seat',await p.evaluate(()=>NAMES[0]),'ring',await p.evaluate(()=>!!document.getElementById('turnRing')));console.log('errors',errs);await b.close();})();
