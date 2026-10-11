const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const R={};
for(const [w,n] of [[360,4],[461,2],[461,3],[360,2]]){const p=await b.newPage({viewport:{width:w,height:w===360?800:1024},hasTouch:true});p.on('pageerror',e=>errs.push(w+': '+e.message));
 await p.goto('http://localhost:8765/index.html?t=53'+w+n);await p.waitForTimeout(800);
 await p.evaluate((n)=>{closeModal();PR.xu=100000;saveP();setInterval(()=>document.querySelectorAll('#badgeFX').forEach(e=>e.remove()),100);setMode('domino');openTables();dmSet('n',n);dmSet('bet',500);dmDeal();window._log={draw:0,pass:0,choose:0};
  setInterval(()=>{const st=MG.st;if(!st||st.phase!=='play'||st.turn!==0||window._hold)return;if(st.need==='draw'){_log.draw++;return dmDraw();}if(st.need==='pass'){_log.pass++;return dmPassBtn();}
   if(st.choose){_log.choose++;if(!window._chs){window._chs=1;window._hold=1;return;}return dmGo('R');}const k=st.hands[0].findIndex(t=>dmOk(t));if(k<0)return;if(st.sel!==k)return dmTap(k);dmGo();},350);},n);
 // chụp lúc chọn đầu (nếu có) hoặc giữa ván
 await p.waitForFunction(()=>window._hold||(MG.st&&MG.st.chain.length>=12)||(MG.st&&MG.st.phase==='done'),null,{timeout:60000}).catch(()=>{});await p.screenshot({path:`shots/v56-dom-${w}-${n}-mid.png`});
 R[w+'-'+n+'-geom']=await p.evaluate(()=>{const box=document.getElementById('dmChain').getBoundingClientRect();const ts=[...document.querySelectorAll('#dmChain .dmt')].map(e=>e.getBoundingClientRect());return{tiles:ts.length,out:ts.filter(r=>r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1).length,ends:document.querySelectorAll('#dmChain .eL,#dmChain .eR,#dmChain .eD').length};});
 await p.evaluate(()=>{window._hold=0;});
 await p.waitForFunction(()=>MG.st&&MG.st.phase==='done',null,{timeout:90000}).catch(()=>{});await p.waitForTimeout(300);
 R[w+'-'+n]=await p.evaluate(()=>{const st=MG.st;const pips=st.hands.map(h=>h.reduce((a,t)=>a+t[0]+t[1],0));
  // kiểm tra dây: hai đầu kề nhau khớp
  let okc=true;for(let i=1;i<st.chain.length;i++)if(st.chain[i-1].b!==st.chain[i].a)okc=false;const tiles=st.chain.length+st.hands.reduce((a,h)=>a+h.length,0)+st.bone.length;
  return{ph:st.phase,res:st.res,sum:st.res.reduce((a,x)=>a+x,0),pips,chainOk:okc,ends:[st.chain[0].a,st.chain[st.chain.length-1].b].join()===st.ends.join(),tiles,log:window._log,ov:document.documentElement.scrollWidth-innerWidth};});
 await p.screenshot({path:`shots/v56-dom-${w}-${n}-end.png`});await p.close();}
console.log(JSON.stringify(R),errs);await b.close();})();
