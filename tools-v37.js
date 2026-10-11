const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const p=await (await b.newContext({viewport:{width:412,height:915}})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(800);
await p.evaluate(()=>{localStorage.setItem('tlmn_seenv','1.27');PR.stats.games=3;saveP();});await p.reload();await p.waitForTimeout(800);await p.evaluate(()=>closeModal());await p.waitForTimeout(4500);
const r1=await p.evaluate(()=>({modal:modalOpen()&&document.getElementById('modalIn').textContent.slice(0,40),ver:(document.getElementById('verf')||{}).textContent}));await p.screenshot({path:'shots/v37-changelog.png'});
await p.evaluate(()=>{closeModal();renderHome();});await p.waitForTimeout(300);await p.screenshot({path:'shots/v37-home.png'});
// shop avatar + seat svg
await p.evaluate(()=>{PR.xu=99999;PR.xp=999999;const id='sv_thantai';PR.inv[id]=1;PR.equip.avatar=id;applyCosmetics();saveP();openShop&&openShop('avatar');});await p.waitForTimeout(600);await p.screenshot({path:'shots/v38-shop.png'});
const n=await p.evaluate(()=>SHOP.filter(x=>x.svg).length);
await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(3500);await p.evaluate(()=>{AVATARS[1]=['⟦sv_rongvang⟧','#000'];AVATARS[2]=['⟦sv_dothanh⟧','#000'];AVATARS[3]=['⟦sv_nangtho⟧','#000'];render();renderMe();});await p.waitForTimeout(500);
const svgs=await p.evaluate(()=>document.querySelectorAll('.seat svg.sva, #meInfo svg.sva').length);await p.screenshot({path:'shots/v38-table.png'});
// DM UI offline (giả lập nhận)
await p.evaluate(()=>{USER=USER||{id:'me-x'};onDM({payload:{to:USER.id,from:'peer-1',name:'Lan',t:'Chơi ván không? đm'}});});await p.waitForTimeout(400);
const dm=await p.evaluate(()=>({pop:!!document.getElementById('dmPop'),txt:(document.querySelector('#dmPop .dmt')||{}).textContent,unread:dmUnread()}));await p.screenshot({path:'shots/v36-dm.png'});
console.log(JSON.stringify({r1,n,svgs,dm}),errs);await b.close();})();
