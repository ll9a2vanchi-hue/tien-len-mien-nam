const H=require('./tools-h.js');
const modes=[['tlmn4',()=>{MODE='mn';startTable(4)}],['tlmn3',()=>{MODE='mn';startTable(3)}],['tlmn2',()=>{MODE='mn';startTable(2)}],['demla',()=>{MODE='demla';startTable(4)}],
['3cao',()=>{openCasino('3cao');cgDeal()}],['xidach',()=>{openCasino('xidach');cgDeal()}],['baucua',()=>{mgOpen('baucua')}],['domino',()=>{mgOpen('domino');dmDeal()}],['xito',()=>{mgOpen('xito');xtDeal()}],['poker',()=>{mgOpen('poker');pkDeal()}]];
(async()=>{const b=await H.launch();const sel=process.argv[2];
for(const w of [360,412,461]){for(const [nm,fn] of modes){if(sel&&sel!==nm)continue;const p=await H.open(b,w,740,()=>{PR.xp=2e6;PR.xu=4e6;PR.stats.earned=9e6;PR.mxp={tlmn:STAR_CUM[30],poker:STAR_CUM[20]};PR.title='phu_ho';saveP();renderHome();});
 try{await p.evaluate(fn);await p.waitForTimeout(3200);
 const bad=await p.evaluate(()=>{const out=[];const vw=innerWidth;const els=[...document.querySelectorAll('#table .av,#table .tt,#table .lvb,#mg .av,#mg .tt,#mg .lvb,#cg .av,#cg .tt,#cg .lvb,#table .nm,#table .seatname,#mg .mgname,#cg .cgname,.mgseat *,.cgseat *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>1&&r.height>1&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none'});
  const R=els.map(e=>({e,r:e.getBoundingClientRect()}));R.forEach(({e,r})=>{if(r.right>vw+1||r.left<-1)out.push('OFFSCREEN '+(e.className||e.tagName)+' '+Math.round(r.left)+'-'+Math.round(r.right));});
  const leaf=R.filter(({e})=>e.children.length===0||e.classList.contains('av'));
  for(let i=0;i<leaf.length;i++)for(let j=i+1;j<leaf.length;j++){const a=leaf[i],c=leaf[j];if(a.e.contains(c.e)||c.e.contains(a.e))continue;const ix=Math.min(a.r.right,c.r.right)-Math.max(a.r.left,c.r.left),iy=Math.min(a.r.bottom,c.r.bottom)-Math.max(a.r.top,c.r.top);if(ix>3&&iy>3)out.push('OVERLAP '+(a.e.className||a.e.tagName)+'['+(a.e.textContent||'').slice(0,8)+'] x '+(c.e.className||c.e.tagName)+'['+(c.e.textContent||'').slice(0,8)+'] '+Math.round(ix)+'x'+Math.round(iy));}
  return out.slice(0,12);});
 console.log(w,nm,JSON.stringify(bad),p.errs.length?p.errs:'');await p.screenshot({path:`shots/v80-${nm}-${w}.png`});}catch(e){console.log(w,nm,'ERR',e.message.slice(0,100));}await p.close();}}
await b.close();})();
