const H=require('./tools-h.js');(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,740,()=>{PR.xp=20000;PR.xu=4e6;PR.mxp={baucua:STAR_CUM[12]};saveP();mgOpen('baucua')});await p.waitForTimeout(1500);
const r=await p.evaluate(()=>[...document.querySelectorAll('.avst')].map(e=>{const q=e.getBoundingClientRect();return q.left>=0&&q.right<=innerWidth&&q.top>=0?'ok':'CLIP '+Math.round(q.left)+','+Math.round(q.top)}));console.log(w,r.join(' '));await p.screenshot({path:`shots/v74-baucua-${w}.png`});await p.close();}await b.close();})();
