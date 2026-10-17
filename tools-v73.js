const H=require('./tools-h.js');(async()=>{const b=await H.launch();const R={};
await Promise.all([360,412,461].map(async w=>{const p=await H.open(b,w,740,()=>{PR.xp=2e6;PR.xu=4e6;saveP();renderHome();});await p.waitForTimeout(500);
await p.evaluate(()=>{MODE='mn';startTable(4)});await p.waitForTimeout(2500);R[w]=await p.evaluate(()=>[...document.querySelectorAll('.tt')].map(t=>[t.textContent,!!t.querySelector('.mqa')]));await p.screenshot({path:`shots/v73-game-${w}.png`});console.log(p.errs);await p.close();}));console.log(JSON.stringify(R));await b.close();})();
