const {chromium}=require('playwright-core');const tag=process.argv[2]||'after';(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const R={};const errs=[];
const modes=[['tlmn',"MODE='mn';startTable(4)"],['demla',"MODE='demla';startTable(4)"],['3cao',"openCasino('3cao')"],['xidach',"openCasino('xidach')"],['xito',"mgOpen('xito')"],['poker',"mgOpen('poker')"]];
await Promise.all([360,412,461].map(async w=>{R[w]={};for(const [k,js] of modes){const p=await b.newPage({viewport:{width:w,height:w<400?740:860}});p.on('pageerror',e=>errs.push(k+':'+e.message));await p.goto('http://localhost:8765/index.html?t='+Date.now());await p.waitForTimeout(900);
 await p.evaluate(()=>{closeModal();setInterval(()=>{document.querySelectorAll('#badgeFX,.starfx').forEach(e=>e.remove());try{BQ.length=0;_bShow=false}catch(e){}},80);PR.xp=20000;PR.xu=4e6;saveP();});
 await p.evaluate(js=>eval(js),js);await p.waitForTimeout(1200);
 if(k==='tlmn'||k==='demla'){await p.evaluate(()=>{document.querySelectorAll('#startOv button,#startOv .sbig').forEach(x=>{try{x.click()}catch(e){}});});await p.waitForTimeout(4500);
  await p.evaluate(()=>{try{G.pile=G.hands[1].slice(0,3);render();}catch(e){}});await p.waitForTimeout(300);
  await p.evaluate(()=>{const c=document.querySelectorAll('#hand .card');if(c[4])c[4].click();});await p.waitForTimeout(300);}
 else{await p.evaluate(()=>{const bt=[...document.querySelectorAll('#cg button,#mg button')].find(x=>/Chia bài/.test(x.textContent));if(bt)bt.click();});await p.waitForTimeout(3500);}
 R[w][k]=await p.evaluate(()=>{const h=[...document.querySelectorAll('#hand .card')];const r=h.map(e=>e.getBoundingClientRect());const pc=document.querySelector('#pile .card');
  return{ov:document.documentElement.scrollWidth-innerWidth,n:h.length,cw:r[0]?Math.round(r[0].width):0,minL:r.length?Math.round(Math.min(...r.map(x=>x.left))):0,maxR:r.length?Math.round(Math.max(...r.map(x=>x.right))):0,bottom:r.length?Math.round(Math.max(...r.map(x=>x.bottom))):0,vh:innerHeight,pile:pc?Math.round(pc.getBoundingClientRect().width):0};});
 await p.screenshot({path:`shots/v71-${tag}-${k}-${w}.png`});await p.close();}}));
console.log(JSON.stringify(R));console.log(errs);await b.close();})();
