const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const R={};
for(const [w,n] of [[360,4],[461,2],[360,3]]){const p=await b.newPage({viewport:{width:w,height:w===360?800:1024}});p.on('pageerror',e=>errs.push(w+': '+e.message));
 await p.goto('http://localhost:8765/index.html?t=53'+w);await p.waitForTimeout(800);
 await p.evaluate((n)=>{closeModal();PR.xu=100000;saveP();setInterval(()=>document.querySelectorAll('#badgeFX').forEach(e=>e.remove()),100);setMode('domino');openTables();dmSet('n',n);dmSet('bet',500);dmDeal();
  setInterval(()=>{const st=MG.st;if(st&&st.phase==='play'&&st.turn===0&&st.sel==null){const k=st.hands[0].findIndex(t=>st.first?(t[0]===st.first[0]&&t[1]===st.first[1]):dmFits(t,st.ends).length);if(k>=0){if(window._shot===undefined&&st.chain.length>=5){window._shot=1;return;}dmTap(k);if(MG.st.sel!=null)dmPlay(0,MG.st.sel,'L');}}},300);},n);
 await p.waitForFunction(()=>window._shot||(MG.st&&MG.st.phase==='done'),null,{timeout:30000}).catch(()=>{});await p.screenshot({path:`shots/v53-dom-mid-${w}-${n}.png`});await p.evaluate(()=>window._shot=2);
 await p.waitForFunction(()=>MG.st&&MG.st.phase==='done',null,{timeout:40000}).catch(()=>{});await p.waitForTimeout(300);
 R[w+'-'+n]=await p.evaluate(()=>({ph:MG.st.phase,res:MG.st.res,sum:MG.st.res&&MG.st.res.reduce((a,x)=>a+x,0),chain:MG.st.chain.length,ov:document.documentElement.scrollWidth-innerWidth}));await p.screenshot({path:`shots/v53-dom-end-${w}-${n}.png`});await p.close();}
console.log(JSON.stringify(R),errs);await b.close();})();
