const H=require('./tools-h.js');(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xp=40000;PR.xu=4e6;PR.stats.earned=3200000;buyAsset(PR,'xedap');buyPet(PR,'pet_meo');['back_onyx','felt_gold','av_king','fr_ruby'].forEach(i=>PR.inv[i]=1);saveP();renderHome();});await p.waitForTimeout(500);
await p.screenshot({path:`shots/v77-home-${w}.png`});await p.evaluate(()=>document.querySelector('.exchip').click());await p.waitForTimeout(400);
const r=await p.evaluate(()=>{const m=document.getElementById('modalIn');return m.scrollWidth-m.clientWidth});if(r>1)console.log('OVERFLOW',w,r);console.log(w,await p.evaluate(()=>document.querySelector('.extot b').innerText),p.errs);await p.screenshot({path:`shots/v77-exp-${w}.png`});
await p.evaluate(()=>{closeModal();PR.stats.earned=9e7;saveP();openExpBonus()});await p.waitForTimeout(300);await p.screenshot({path:`shots/v77-expcap-${w}.png`});
await p.evaluate(()=>{closeModal();document.querySelector('#home .pcard .av').click()});await p.waitForTimeout(300);await p.screenshot({path:`shots/v77-prof-${w}.png`});await p.close();}await b.close();})();
