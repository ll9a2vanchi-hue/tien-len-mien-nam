const H=require('./tools-h.js');const tag=process.argv[2]||'before';
(async()=>{const b=await H.launch();const p=await H.open(b,520,1050,()=>{});
const n=await p.evaluate(()=>{const av=SHOP.filter(x=>x.type==='avatar');const g=document.createElement('div');g.id='avgrid';g.style.cssText='position:fixed;inset:0;z-index:9999;background:#222;display:grid;grid-template-columns:repeat(8,1fr);gap:4px;padding:4px;overflow:auto;font:9px sans-serif;color:#fff';
 g.innerHTML=av.map(x=>`<div style="text-align:center"><span class="av" style="width:52px;height:52px;font-size:30px;display:inline-grid;place-items:center;border-radius:50%;overflow:hidden;background:#3a5">${x.emo}</span><div>${x.id.replace('sv_','')}</div></div>`).join('');document.body.appendChild(g);svaScan(g);return av.length;});
await p.waitForTimeout(800);await p.screenshot({path:`shots/v1581-avgrid-${tag}.png`,fullPage:false});console.log(n);await b.close();})();
