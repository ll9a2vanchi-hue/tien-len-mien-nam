const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const R={};const errs=[];
for(const w of [360,412,461]){const p=await b.newPage({viewport:{width:w,height:860}});p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/index.html?t='+Date.now());await p.waitForTimeout(900);
 await p.evaluate(()=>{closeModal();setInterval(()=>{document.querySelectorAll('#badgeFX').forEach(e=>e.remove());try{BQ.length=0;_bShow=false}catch(e){}},80);PR.xp=20000;PR.xu=40e6;PR.assets={};PR.passive={last:Date.now()-3600e3,frac:0};saveP();renderHome();});await p.waitForTimeout(500);
 const chk=()=>p.evaluate(()=>({ov:document.documentElement.scrollWidth-innerWidth,clip:[...document.querySelectorAll('#modalIn .aitem,#asTile,#pasTile')].filter(e=>e.scrollWidth>e.clientWidth+1).length}));
 R[w]={};await p.evaluate(()=>$('asTile').scrollIntoView({block:'center'}));await p.screenshot({path:`shots/v68-home-empty-${w}.png`});
 for(const c of ['biz','veh','shop']){await p.evaluate(c=>openAssets(c),c);await p.waitForTimeout(300);R[w][c]=await chk();await p.screenshot({path:`shots/v68-assets-${c}-${w}.png`});}
 await p.evaluate(()=>askAsset('xedap'));await p.waitForTimeout(300);await p.screenshot({path:`shots/v68-confirm-veh-${w}.png`});await p.evaluate(()=>$('aOk').click());await p.waitForTimeout(300);
 await p.evaluate(()=>askAsset('ps3'));await p.waitForTimeout(300);await p.screenshot({path:`shots/v68-confirm-shop-${w}.png`});await p.evaluate(()=>$('aOk').click());await p.waitForTimeout(300);
 R[w].bought=await p.evaluate(()=>({xedap:assetLv(PR,'xedap'),ps3:assetLv(PR,'ps3'),inc:assetBonus(PR),exp:expBonus(PR)}));
 await p.evaluate(()=>{ASSETS.forEach(a=>{if(a.cat!=='biz')buyAsset(PR,a.id);});['quan','taphoa','nhamay'].forEach(id=>buyAsset(PR,id));badgeToasts(checkBadges(PR));saveP();openAssets('shop');});await p.waitForTimeout(300);await p.screenshot({path:`shots/v68-assets-shop-owned-${w}.png`});
 const x0=await p.evaluate(()=>PR.xp);await p.evaluate(()=>addXp(PR,30));R[w].xp30=await p.evaluate(x=>PR.xp-x,x0);
 await p.evaluate(()=>{closeModal();renderHome();window.scrollTo(0,0);});await p.waitForTimeout(400);await p.screenshot({path:`shots/v68-home-owned-${w}.png`});
 R[w].home=await p.evaluate(()=>({as:$('asTile').innerText.replace(/\n/g,' | '),pas:$('pasTile').innerText.replace(/\n/g,' | '),best:!!document.querySelector('#home .pcard .bestas'),ov:document.documentElement.scrollWidth-innerWidth,clip:[...document.querySelectorAll('#asTile>*,#pasTile .pasm>*')].filter(e=>e.scrollWidth>e.clientWidth+1).length,badges:['veh_all','shop_all'].filter(k=>PR.badges[k])}));
 await p.evaluate(()=>$('asTile').scrollIntoView({block:'center'}));await p.screenshot({path:`shots/v68-home-bars-${w}.png`});
 await p.evaluate(()=>$('pasTile').click());await p.waitForTimeout(300);R[w].detail=await p.evaluate(()=>document.getElementById('modalIn').innerText.slice(0,260).replace(/\n/g,' | '));await p.screenshot({path:`shots/v68-passive-detail-${w}.png`});
 await p.evaluate(()=>{closeModal();openShop();});await p.waitForTimeout(300);R[w].shopHasAsset=await p.evaluate(()=>!!document.querySelector('#modalIn .atab'));await p.close();}
console.log(JSON.stringify(R,null,1));console.log(errs);await b.close();})();
