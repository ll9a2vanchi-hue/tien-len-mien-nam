const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const p=await H.open(b,412,800,()=>{});
const r=await p.evaluate(()=>{const ids=SHOP.filter(x=>x.svg).map(x=>x.id);const box=document.createElement('div');document.body.appendChild(box);const hid=document.createElement('div');hid.style.display='none';document.body.prepend(hid);
 hid.textContent=ids.map(i=>'⟦'+i+'⟧').join(' ');svaScan(hid);box.textContent=ids.map(i=>'⟦'+i+'⟧').join(' ');svaScan(box);
 const all=[...document.querySelectorAll('[id]')].map(e=>e.id);const dup=all.length-new Set(all).size;let bad=0;
 box.querySelectorAll('[fill^="url(#"],[stroke^="url(#"]').forEach(x=>{const a=(x.getAttribute('fill')||'').startsWith('url')?x.getAttribute('fill'):x.getAttribute('stroke');const t=document.getElementById(a.slice(5,-1));if(!t||!box.contains(t))bad++;});
 return {n:ids.length,dup,bad};});
ok(r.n>30,'svg avatars '+r.n);ok(r.dup===0,'no duplicate ids');ok(r.bad===0,'gradients resolve inside own svg');
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
