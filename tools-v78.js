const H=require('./tools-h.js');(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xp=40000;PR.xu=9e6;saveP();renderHome();});
 for(const t of ['back','felt','deck','bubble','name','fx','emote']){await p.evaluate(t=>{PR.xu=9e6;openShop(t)},t);await p.waitForTimeout(350);
  const r=await p.evaluate(()=>{const m=document.getElementById('modalIn');return m.scrollWidth-m.clientWidth});if(r>1)console.log('OVERFLOW',w,t,r);
  await p.evaluate(()=>{const g=document.querySelector('#modalIn .sgrid');g&&g.scrollIntoView();document.getElementById('modalIn').scrollTop=110;});await p.waitForTimeout(200);
  await p.screenshot({path:`shots/v78-shop-${t}-${w}.png`});}
 console.log(w,p.errs);await p.close();}await b.close();})();
