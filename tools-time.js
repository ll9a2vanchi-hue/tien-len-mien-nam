// đo thời lượng ván: người chơi hành động ngay (thời gian nghĩ cộng sau = 3s × số hành động)
const {chromium}=require('playwright-core');const MODE=process.argv[2],N=+(process.argv[3]||4),NP=+(process.argv[4]||4);
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:412,height:860}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html?t='+Date.now());await p.waitForTimeout(1200);
await p.evaluate(()=>{closeModal();PR.xu=5e6;saveP();setInterval(()=>{document.querySelectorAll('#badgeFX').forEach(e=>e.remove());try{BQ.length=0;_bShow=false}catch(e){}if(modalOpen()&&!document.querySelector('#modalIn .tbl'))closeModal();},100);});
const res=[];
for(let r=0;r<N;r++){
 const t0=Date.now();let acts=0,res0;
 if(MODE==='mn'||MODE==='demla'){await p.evaluate(([m,n])=>{setMode(m);if(typeof G!=='undefined'&&G)G.over=true;startTable(n);},[MODE,NP]);
  for(let i=0;i<3000;i++){const o=await p.evaluate(()=>{if(G&&G.over)return 2;if(G&&G.turn===0&&!DEALING&&!G.over){autoMove();return 1;}return 0;});if(o===2)break;if(o===1)acts++;await p.waitForTimeout(o===1?150:100);}
  res0=await p.evaluate(()=>{const f=G.finished,seats=G.seats||[0,1,2,3];const all=[...f,...seats.filter(x=>!f.includes(x))];return all.indexOf(0);});}
 else if(MODE==='3cao'||MODE==='xidach'){await p.evaluate(([g,n])=>{if(!document.getElementById('cg')){setMode(g);openCasino(g);cgSetup('n',n);cgSetup('role','con');}CG.bet=500;cgDeal();},[MODE,NP]);
  for(let i=0;i<3000;i++){const o=await p.evaluate(()=>{const st=CG.st;if(!st)return 0;if(st.phase==='done')return 2;if(st.phase==='look'&&!st._f){st._f=1;bcFlip();return 1;}if(st.phase==='me'&&!st.busy){const k=xdKind(st.hands[st.me],16);if(k.total<16&&st.hands[st.me].length<5){xdHit();}else xdStand();return 1;}return 0;});if(o===2)break;if(o===1)acts++;await p.waitForTimeout(o===1?400:100);}
  res0=await p.evaluate(()=>{const v=CG.st.res&&CG.st.res[CG.st.me];return v?v.v:0;});}
 else if(MODE==='baucua'){await p.evaluate(()=>{if(!document.getElementById('mg')){setMode('baucua');openTables();bcRole('con');}if(MG.st.phase==='done')bcNew();bcChip(200);bcPut('cua');bcPut('tom');});acts+=3;await p.waitForTimeout(1500);
  await p.evaluate(()=>bcShake());acts++;for(let i=0;i<300;i++){const ph=await p.evaluate(()=>MG.st.phase);if(ph==='open'){await p.evaluate(()=>bcOpen());acts++;}if(ph==='done')break;await p.waitForTimeout(100);}
  res0=await p.evaluate(()=>MG.st.res.me);}
 else{await p.evaluate(([g,n])=>{if(!document.getElementById('mg')){setMode(g);openTables();if(g==='domino')dmSet('n',n);if(g==='xito')xtSet('n',n);if(g==='poker')pkSet('n',n);}g==='domino'?dmDeal():g==='xito'?xtDeal():pkDeal();},[MODE,NP]);
  for(let i=0;i<4000;i++){const o=await p.evaluate(g=>{const st=MG.st;if(!st)return 0;if(st.phase==='done')return 2;
    if(g==='domino'){if(st.phase!=='play'||st.turn!==0||st.busy)return 0;if(st.need==='draw'){dmDraw();return 1;}if(st.need==='pass'){dmPassBtn();return 1;}const k=st.hands[0].findIndex(t=>dmOk(t));if(k<0)return 0;st.sel=k;dmGo(st.first?null:dmFits(st.hands[0][k],st.ends)[0]);if(st.choose)dmGo('L');return 1;}
    if(st.phase==='bet'&&st.b.cur===0&&!st.anim){g==='xito'?xtDo(0,'call'):pkDo(0,'call');return 1;}return 0;},MODE);if(o===2)break;if(o===1)acts++;await p.waitForTimeout(o===1?300:100);}
  res0=await p.evaluate(g=>g==='domino'?MG.st.res[0]:MG.st.res[0],MODE);}
 const wall=(Date.now()-t0)/1000;res.push({wall:+wall.toFixed(1),acts,res:res0});await p.waitForTimeout(800);}
console.log(JSON.stringify({mode:MODE,np:NP,res,errs:errs.slice(0,3)}));await b.close();})();
