const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const w of [360,461]){const p=await b.newPage({viewport:{width:w,height:800}});await p.goto('http://localhost:8765/index.html?t='+Date.now());await p.waitForTimeout(900);
await p.evaluate(()=>{closeModal();PR.badges=Object.fromEntries(BADGES.filter(b=>!b.mode).map(b=>[b.id,1]));PR.stats.m_xito_games=0;saveP();});await p.waitForTimeout(300);
await p.evaluate(()=>{modeRecord(PR,'xito',{win:true,net:6000,bet:500,n:2,sp1:1});badgeToasts(checkBadges(PR));});await p.waitForTimeout(1500);
console.log(w,await p.evaluate(()=>{const e=document.getElementById('badgeFX');return e?e.innerText.replace(/\n/g,' | '):null}));await p.screenshot({path:`shots/v62-unlockfx-${w}.png`});
await p.evaluate(()=>{BQ.length=0;document.querySelectorAll('#badgeFX').forEach(e=>e.remove());_bShow=false;openBadges('xito','on');});await p.waitForTimeout(500);await p.screenshot({path:`shots/v62-badges-xito-on-${w}.png`});await p.close();}
await b.close();})();
