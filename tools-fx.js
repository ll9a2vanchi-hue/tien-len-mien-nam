const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const ctx=await b.newContext({viewport:{width:461,height:1024},hasTouch:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(900);await p.evaluate(()=>{closeModal();badgeToasts([BADGES.find(x=>x.id==='win50'),BADGES.find(x=>x.id==='sec_3s')]);});
await p.waitForTimeout(1300);await p.screenshot({path:'shots/v9-badgefx.png'});await p.mouse.click(230,500);await p.waitForTimeout(1600);await p.screenshot({path:'shots/v9-badgefx2.png'});await p.mouse.click(230,500);
await p.evaluate(()=>startTable(4));await p.waitForTimeout(3500);await p.evaluate(()=>{_lastSay=0;CHAT_SET='n';botSay(2,'chopped',1);});await p.waitForTimeout(500);await p.screenshot({path:'shots/v9-chat.png'});
console.log('idle test');await p.waitForTimeout(100);console.log('errors',errs);await b.close();})();
