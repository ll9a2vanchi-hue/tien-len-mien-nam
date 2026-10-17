const H=require('./tools-h.js');(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xp=20000;PR.xu=4e6;saveP();mgOpen('xito')});await p.waitForTimeout(800);let got=0;
for(let g=0;g<6&&got<2;g++){await p.evaluate(()=>{if(MG.st&&MG.st.phase!=='done')return;if(MG.st)MG.st=null;xtDeal()});
 for(let t=0;t<80;t++){await p.waitForTimeout(500);const s=await p.evaluate(()=>{const st=MG.st;if(!st)return {d:1};if(st.phase==='done')return {d:1};const b=st.b;const k=[...document.querySelectorAll('#mg .pkraise,#mg .pkst')].map(e=>e.textContent.trim());
  if(b.cur===0&&!st.anim){if(b.hi>b.rb[0]&&b.hi===b.rb[0]+0&&0){}const r=Math.random();if(!window._rz){window._rz=1;xtDo(0,'raise',b.hi+2*st.bet);}else xtDo(0,b.hi>b.rb[0]?(r<.8?'call':'fold'):'check');}return {k}});
  if(s.d)break;const ks=s.k||[];const raise=ks.some(x=>/Tố/.test(x)),call=ks.some(x=>x==='Theo'),other=ks.some(x=>x==='Xem'||x==='Bỏ');
  if(raise&&call&&other||(got===0&&raise&&call)){await p.waitForTimeout(250);await p.screenshot({path:`shots/v81-xito-labels-${w}-${got}.png`});console.log(w,ks.join('|'),await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth));got++;break;}}
 }
console.log(w,'got',got,p.errs);await p.close();}await b.close();})();
