const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];const R=[];
for(const [w,n] of [[360,6],[461,2],[461,4]]){const p=await b.newPage({viewport:{width:w,height:w===360?800:1024}});p.on('pageerror',e=>errs.push(w+': '+e.message));
 await p.goto('http://localhost:8765/index.html?t=55'+w);await p.waitForTimeout(800);
 await p.evaluate((n)=>{closeModal();PR.xu=100000;saveP();setInterval(()=>document.querySelectorAll('#badgeFX').forEach(e=>e.remove()),100);setMode('poker');openTables();pkSet('n',n);pkSet('bet',500);
  window._hands=0;window._bad=[];setInterval(()=>{const st=MG.st;if(!st)return;if(st.phase==='bet'&&st.b.cur===0){if(window._hold)return;const r=Math.random();pkDo(0,r<0.1?'raise':r<0.13?'allin':'call',st.b.hi+1000);}if(st.phase==='done'&&!st._c){st._c=1;window._hands++;const s=st.res.reduce((a,x)=>a+x,0);if(s!==0)window._bad.push(s);if(window._hands<4)setTimeout(pkDeal,300);}},250);pkDeal();},n);
 await p.waitForTimeout(4000);await p.screenshot({path:`shots/v55-pk-mid-${w}-${n}.png`});
 await p.waitForFunction(()=>window._hands>=4,null,{timeout:90000}).catch(()=>{});await p.waitForTimeout(400);
 R.push(await p.evaluate(()=>({h:window._hands,bad:window._bad,ov:document.documentElement.scrollWidth-innerWidth,msg:MG.st.msg})));await p.screenshot({path:`shots/v55-pk-end-${w}-${n}.png`});await p.close();}
console.log(JSON.stringify(R),errs);await b.close();})();
