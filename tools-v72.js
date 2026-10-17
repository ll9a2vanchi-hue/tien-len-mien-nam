const {chromium}=require('playwright-core');const tag=process.argv[2]||'a';(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const R={},errs=[];
await Promise.all([360,412,461].map(async w=>{const p=await b.newPage({viewport:{width:w,height:760}});p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/index.html?t='+Date.now());await p.waitForTimeout(900);
await p.evaluate(()=>{closeModal();PR.xp=20000;PR.xu=4e6;saveP();});
for(const [k,js] of [['tbl-tlmn',"MODE='mn';openTables()"],['tbl-demla',"MODE='demla';openTables()"]]){await p.evaluate(js=>eval(js),js);await p.waitForTimeout(400);
 R[w+k]=await p.evaluate(()=>{const m=document.getElementById('modalIn');const r=m.getBoundingClientRect();const bad=[...m.querySelectorAll('*')].filter(e=>{const q=e.getBoundingClientRect();return q.width>0&&(q.right>r.right+1||q.left<r.left-1)}).map(e=>e.className||e.tagName).slice(0,5);return{ov:document.documentElement.scrollWidth-innerWidth,mw:Math.round(r.width),sw:m.scrollWidth-m.clientWidth,bad}});
 await p.screenshot({path:`shots/v72-${tag}-${k}-${w}.png`});}
await p.close();}));console.log(JSON.stringify(R));console.log(errs);await b.close();})();
