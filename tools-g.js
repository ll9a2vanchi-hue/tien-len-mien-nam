const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(700);await p.evaluate(()=>{closeModal();openAccount();});await p.waitForTimeout(2500);
await p.screenshot({path:'shots/v17-google.png'});await p.click('.gbtn');await p.waitForTimeout(2500);console.log('msg:',await p.textContent('#aErr'),'url',p.url());
console.log('errors',errs);await b.close();})();
