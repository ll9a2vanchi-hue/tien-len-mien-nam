const H=require('./tools-h.js');const tag=process.argv[2]||'before';
const screens=[['home',()=>{renderHome()}],['avatar',()=>openAvatar()],['shop',()=>openShop()],['profile',()=>openMyProfile()],['lb',()=>openLeaderboard()],['people',()=>openPeople()],['game',()=>startTable(4)],['baucua',()=>mgOpen('baucua')],['poker',()=>{mgOpen('poker');pkDeal()}],['3cao',()=>{openCasino('3cao');cgDeal()}]];
(async()=>{const b=await H.launch();const issues=[];
for(const w of [360,412,461])for(const [nm,fn] of screens){const p=await H.open(b,w,800,()=>{PR.xu=4e6;PR.inv.sv_u_dothanh=1;equipItem(PR,'sv_u_dothanh');saveP();});
 try{await p.evaluate(fn.toString().replace(/^\(\)=>/,'')).catch(e=>issues.push(w+' '+nm+' ERR '+e.message.slice(0,80)));}catch(e){}
 await p.waitForTimeout(1500);await p.evaluate(()=>{window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();});
 const r=await p.evaluate(()=>{const out=[];const vis=e=>!!(e.offsetWidth||e.getClientRects().length);
  document.querySelectorAll('svg.sva').forEach(s=>{if(!vis(s))return;const sr=s.getBoundingClientRect();const av=s.closest('.av,[class*="av"]');const ar=av&&av.getBoundingClientRect();
   if(sr.width<4)out.push('tiny '+sr.width);
   if(ar&&(Math.abs(sr.width-ar.width)>3||Math.abs(sr.left-ar.left)>3||Math.abs(sr.top-ar.top)>3))out.push(`misfit ${av.className.slice(0,20)} svg ${Math.round(sr.left)},${Math.round(sr.top)},${Math.round(sr.width)} av ${Math.round(ar.left)},${Math.round(ar.top)},${Math.round(ar.width)}`);
   s.querySelectorAll('[fill^="url(#"]').forEach(x=>{const id=x.getAttribute('fill').slice(5,-1);const t=document.getElementById(id);if(!t||!vis(t.closest('svg')))out.push('badref '+id);});});
  return [...new Set(out)].slice(0,5);});
 if(r.length)issues.push(w+' '+nm+' '+r.join(' | '));await p.screenshot({path:`shots/v1581-${tag}-${nm}-${w}.png`});await p.close();}
console.log(issues.join('\n')||'no issues');await b.close();})();
