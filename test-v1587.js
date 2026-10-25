const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const vge=(a,b)=>{const x=String(a).split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)>(y[i]||0);}return true;};
for(const [w,h] of [[360,780],[412,800],[461,800],[360,740]]){const p=await H.open(b,w,h,()=>{let x=0;while(levelInfo(x).level<35)x+=50;PR.xp=x;PR.xu=5e6;saveP();localStorage.removeItem('tlmn_bclv');});
 const r=await p.evaluate(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const out={v:APP_V};const chips=()=>[...document.querySelectorAll('#mg .bcchips button')].map(x=>x.dataset.b+(x.classList.contains('alt')?'':'*')+(x.disabled?'d':'')).join(',');
  mgOpen('baucua');await sl(600);out.def=chips();out.btn=(document.querySelector('#mg .bclvbtn')||{}).textContent;out.noStrip=!document.querySelector('#mg .lvbets');
  bcLvPick();await sl(150);const g=[...document.querySelectorAll('.bclvgrid button')];out.n=g.length;out.lk=g.filter(x=>x.classList.contains('lk')).map(x=>x.textContent).join('|');out.modalTop=+getComputedStyle(document.getElementById('modal')).zIndex>40;
  bcSetLv(100000);out.lockHeld=bcLevel()===200;bcSetLv(30000);await sl(200);out.lv=bcLevel();out.saved=localStorage.getItem('tlmn_bclv');out.c30=chips();
  out.minBot=Math.min(...MG.st.bots.map(x=>MG.bxu[x.name]));out.dealer=MG.bxu['Nhà cái'];
  bcChip(150000);out.ch=MG.st.chip;bcChip(5000);out.badChip=MG.st.chip===150000;bcPut('cua');bcPut('tom');out.bets=bcTot(MG.st.bets);
  const t=document.querySelector('#mg .bctbl');out.scroll=t.scrollHeight-t.clientHeight;out.ovf=[...document.querySelectorAll('#mg button')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<-.5||r.right>innerWidth+.5)}).length;
  out.rebet=!!document.querySelector('#mg .bcxb');
  PR.xu=200000;bcR();out.unaff=chips();bcLvPick();await sl(100);out.unaffLv=[...document.querySelectorAll('.bclvgrid button[disabled]')].map(x=>x.dataset.l).join(',');closeModal();PR.xu=5e6;
  mgClose(1);mgOpen('baucua');await sl(500);out.remember=bcLevel()+':'+chips();
  // làm cái: máy cược theo mức bàn
  bcRole('cai');await new Promise(r=>{const i=setInterval(()=>{if(!MG.st.placing){clearInterval(i);r();}},50);});out.botAmts=[...new Set(MG.st.bots.flatMap(x=>Object.values(x.bets||{})))].every(a=>a>=30000);out.caiBtn=!!document.querySelector('#mg .bclvbtn');bcRole('con');
  return out;});
 if(w===412)console.log(JSON.stringify(r));
 ok(vge(r.v,'1.58.7'),'version');ok(r.def==='200*,400,1000,2000'&&/Bàn 200/.test(r.btn)&&r.noStrip,'default level 200, 4 chips, no strip '+r.def);
 ok(r.n===13&&r.lk==='50k🔒 Lv 45|70k🔒 Lv 60|100k🔒 Lv 80|150k🔒 Lv 100','picker 13 levels w/ locks '+r.lk);ok(r.modalTop,'picker above table');ok(r.lockHeld,'locked level not selectable');
 ok(r.lv===30000&&r.saved==='30000'&&r.c30==='30000*,60000,150000,300000','30k level → chips '+r.c30);ok(r.ch===150000&&r.badChip&&r.bets===300000,'chip select + bets');
 ok(r.minBot>=30000*40&&r.dealer>=30000*300,'bots/dealer funded');ok(r.scroll<=0&&r.ovf===0,`fits ${w}x${h} scroll ${r.scroll} ovf ${r.ovf}`);ok(r.rebet,'Lại/×2 kept');
 ok(r.unaff==='30000,60000,150000*,300000d'&&r.unaffLv==='',`unaffordable chips disabled ${r.unaff}`);ok(r.remember==='30000:30000*,60000,150000,300000','remembers level');ok(r.botAmts&&r.caiBtn,'bots bet by level when you are cái');
 await p.close();}
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
