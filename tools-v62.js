const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const R={};const errs=[];
const page=async w=>{const p=await b.newPage({viewport:{width:w,height:w===360?800:900}});p.on('pageerror',e=>errs.push(w+': '+e.message));await p.goto('http://localhost:8765/index.html?t='+Date.now());await p.waitForTimeout(900);
 await p.evaluate(()=>{closeModal();PR.xu=200000;PR.xp=8000;saveP();window._rec=[];const o=modeRecord;modeRecord=function(P,m,ev){window._rec.push([m,JSON.stringify(ev)]);return o.apply(this,arguments);};window._kill=setInterval(()=>{document.querySelectorAll('#badgeFX').forEach(e=>e.remove());try{BQ.length=0}catch(e){}},80);});return p;};
const ov=p=>p.evaluate(()=>({ov:document.documentElement.scrollWidth-innerWidth,slv:[...document.querySelectorAll('.slv')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1||r.left<-1}).length,nslv:document.querySelectorAll('.slv').length,frame:!!document.querySelector('.mgseat .av[class*="fr-"],#cg .av[class*="fr-"]')}));
for(const w of [+process.argv[2]]){
 // 3 Cào + Xì dách
 for(const g of ['3cao','xidach']){const p=await page(w);await p.evaluate(g=>{setMode(g);openCasino(g);cgSetup('n',6);cgSetup('role','con');CG.bet=500;cgDeal();},g);
  for(let i=0;i<80;i++){const d=await p.evaluate(()=>{const st=CG.st;if(!st)return 0;if(st.phase==='done')return 1;try{if(st.phase==='me'){if(CG.g==='xidach')xdStand();}if(st.phase==='look')bcFlip();}catch(e){}return 0;});if(d)break;await p.waitForTimeout(400);}
  await p.waitForTimeout(1500);R[g+w]=Object.assign(await ov(p),{rec:await p.evaluate(()=>_rec.length),ph:await p.evaluate(()=>CG.st&&CG.st.phase)});await p.screenshot({path:`shots/v62-${g}-${w}.png`});await p.close();}
 // Bầu cua
 {const p=await page(w);await p.evaluate(()=>{setMode('baucua');openTables();bcRole('con');bcChip(500);bcPut('cua');bcPut('tom');});await p.waitForTimeout(1500);await p.evaluate(()=>bcShake());await p.waitForTimeout(4500);await p.evaluate(()=>{try{bcOpen()}catch(e){}});await p.waitForTimeout(2500);
  R['baucua'+w]=Object.assign(await ov(p),{rec:await p.evaluate(()=>_rec.length)});await p.screenshot({path:`shots/v62-baucua-${w}.png`});await p.close();}
 // Domino
 {const p=await page(w);await p.evaluate(()=>{setMode('domino');openTables();dmSet('n',4);dmSet('bet',500);dmDeal();setInterval(()=>{const st=MG.st;if(!st||st.phase!=='play'||st.turn!==0)return;if(st.need==='draw')return dmDraw();if(st.need==='pass')return dmPassBtn();const k=st.hands[0].findIndex(t=>dmOk(t));if(k<0)return;st.sel=k;dmGo(st.first?null:dmFits(st.hands[0][k],st.ends)[0]);},500);});
  await p.waitForTimeout(5000);await p.screenshot({path:`shots/v62-domino-${w}.png`});await p.waitForFunction(()=>MG.st&&MG.st.phase==='done',null,{timeout:60000}).catch(()=>{});await p.waitForTimeout(800);
  R['domino'+w]=Object.assign(await ov(p),{rec:await p.evaluate(()=>_rec.length)});await p.screenshot({path:`shots/v62-domino-end-${w}.png`});await p.close();}
 // Xì tố + Poker
 for(const g of ['xito','poker']){const p=await page(w);await p.evaluate(g=>{setMode(g);openTables();if(g==='xito'){xtSet('n',5);xtSet('bet',500);}else{pkSet('n',6);pkSet('bet',500);}
   setInterval(()=>{const st=MG.st;if(!st||!st.b)return;if(st.phase==='bet'&&st.b.cur===0&&!st.anim){g==='xito'?xtDo(0,'call'):pkDo(0,'call');}},400);g==='xito'?xtDeal():pkDeal();},g);
  await p.waitForTimeout(5000);await p.screenshot({path:`shots/v62-${g}-${w}.png`});await p.waitForFunction(()=>MG.st&&MG.st.phase==='done',null,{timeout:60000}).catch(()=>{});await p.waitForTimeout(800);
  R[g+w]=Object.assign(await ov(p),{rec:await p.evaluate(()=>_rec.length)});await p.screenshot({path:`shots/v62-${g}-end-${w}.png`});await p.close();}
 // Đếm lá
 {const p=await page(w);await p.evaluate(()=>{setMode('demla');openTables();closeModal();startTable(4);});await p.waitForTimeout(3000);await p.screenshot({path:`shots/v62-demla-${w}.png`});
  for(let i=0;i<250;i++){const o=await p.evaluate(()=>{if(G.over)return 1;if(G.turn===0&&!DEALING)autoMove();return 0;});if(o)break;await p.waitForTimeout(250);}await p.waitForTimeout(1500);
  R['demla'+w]=Object.assign(await ov(p),{rec:await p.evaluate(()=>_rec.map(r=>r[0]).join(','))});await p.screenshot({path:`shots/v62-demla-end-${w}.png`});await p.close();}
 // Huy hiệu
 {const p=await page(w);await p.evaluate(()=>{PR.stats.m_poker_games=0;Object.keys(PR.badges).forEach(k=>{if(/^poker_games_1$/.test(k))delete PR.badges[k];});});
  for(const t of ['mn','poker','baucua']){await p.evaluate(t=>{closeModal();openBadges(t,'all');},t);await p.waitForTimeout(500);R['bg'+t+w]=await p.evaluate(()=>({ov:document.documentElement.scrollWidth-innerWidth,tabsOv:(()=>{const e=document.getElementById('bgTabs');return e.getBoundingClientRect().right>innerWidth+1})(),n:document.querySelectorAll('.bggrid .badge').length}));await p.screenshot({path:`shots/v62-badges-${t}-${w}.png`});}
  await p.evaluate(()=>{clearInterval(_kill);try{BQ.length=0}catch(e){}document.querySelectorAll('#badgeFX').forEach(e=>e.remove());closeModal();modeRecord(PR,'poker',{win:true,net:600,bet:500,n:2});badgeToasts(checkBadges(PR));});await p.waitForTimeout(900);R['fx'+w]=await p.evaluate(()=>!!document.getElementById('badgeFX'));await p.screenshot({path:`shots/v62-unlockfx-${w}.png`});await p.close();}
}
console.log(JSON.stringify(R,null,0));console.log(errs);await b.close();})();
