const H=require('./tools-h.js');(async()=>{const b=await H.launch();const R={};
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xp=20000;PR.xu=4e6;saveP();mgOpen('xito')});await p.waitForTimeout(800);
await p.evaluate(()=>xtDeal());let shot=false;
for(let t=0;t<120;t++){await p.waitForTimeout(600);const s=await p.evaluate(()=>{const st=MG.st,b=st.b;if(st.phase==='done')return 'done';if(b.cur===0&&!st.anim){if(!window._r1){window._r1=1;const T=b.hi+3*st.bet;xtDo(0,'raise',T);return 'raised'}xtDo(0,b.hi>b.rb[0]?'call':'check');return 'act'}return 'w'+(b.rz?JSON.stringify(b.rz):'')});
 if(!shot&&/Tố/.test(s)){shot=true;await p.waitForTimeout(700);await p.screenshot({path:`shots/v75-xito-raise-${w}.png`});}
 if(s==='done'){await p.waitForTimeout(1200);await p.screenshot({path:`shots/v75-xito-win-${w}.png`});R[w]=await p.evaluate(()=>({win:document.querySelectorAll('.pks.win').length,res:MG.st.res,ov:document.documentElement.scrollWidth-innerWidth}));break;}}
console.log(w,JSON.stringify(R[w]),p.errs);await p.close();}await b.close();})();
