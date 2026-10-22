const H=require('./tools-h.js');(async()=>{const b=await H.launch();let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const C=`(v,s)=>{for(let c=0;c<52;c++)if(pkV(c)===v&&(c&3)===s)return c;}`;
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xu=4e6;saveP();});
 // Xì tố: bạn all-in ngắn tay bài mạnh nhất, Chị B thắng hũ phụ
 const x=await p.evaluate(async(Cs)=>{const C=eval(Cs);const sl=ms=>new Promise(r=>setTimeout(r,ms));localStorage.setItem('tlmn_xtn','4');mgOpen('xito');MG.xtN=4;MG.xtBots=mgBots(3);xtDeal();await sl(300);const st=MG.st,b=st.b;
  st.hands[0]=[C(14,0),C(14,1),C(14,2),C(14,3),C(8,0)];st.hands[1]=[C(13,0),C(13,1),C(9,2),C(9,3),C(7,0)];st.hands[2]=[C(12,0),C(11,1),C(9,0),C(8,3),C(7,2)];st.hands[3]=[C(10,0),C(10,1),C(12,2),C(11,3),C(7,1)];
  b.contrib=[700,1600,1600,300];b.fold=[false,false,false,true];b.allin[0]=true;xtShow();await sl(300);
  const tags=[...document.querySelectorAll('#mg .pks.pwin')].map(e=>e.dataset.i+':'+e.dataset.wt);const pots=document.querySelector('#mg .cgpots');
  const bad=[...document.querySelectorAll('#mg .pks.pwin,#mg .cgpots,#mg .cgmsg')].filter(e=>{const r=e.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1}).length;
  return {tags,pots:pots&&pots.textContent,msg:st.msg,res:st.res,bad};},C);
 if(w===412)console.log(JSON.stringify(x));
 ok(x.tags.includes('0:👑 Thắng hũ chính')&&x.tags.some(t=>/^1:Thắng hũ phụ \+/.test(t)),'xt tags '+w);ok(/Hũ chính.*Bạn.*Hũ phụ.*/.test(x.msg),'xt msg names both');ok(x.pots&&/Hũ chính 2\.?\dk?.*Hũ phụ/.test(x.pots),'pots list '+(x.pots||''));ok(x.bad===0,'fits '+w);
 await p.evaluate(()=>{window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();});await p.screenshot({path:`shots/v1584-xt-sidepot-${w}.png`});
 // Poker: chia hũ — board là sảnh, mọi người chơi board
 const k=await p.evaluate(async(Cs)=>{const C=eval(Cs);const sl=ms=>new Promise(r=>setTimeout(r,ms));mgOpen('poker');MG.pkN=3;MG.pkBots=mgBots(2);pkDeal();await sl(300);const st=MG.st,b=st.b;
  st.board=[C(10,0),C(11,1),C(12,2),C(13,3),C(14,0)];st.hands=[[C(2,0),C(3,1)],[C(2,2),C(4,3)],[C(5,0),C(6,1)]];b.contrib=[400,400,400];b.fold=[false,false,false];if(st.phase==='done')return {skip:1};st.busy=false;pkShow();await sl(300);
  const tags=[...document.querySelectorAll('#mg .pks.pwin')].map(e=>e.dataset.i+':'+e.dataset.wt);return {tags,msg:st.msg,res:st.res,pots:document.querySelector('#mg .cgpots')?.textContent};},C);
 if(w===412)console.log(JSON.stringify(k));
 ok(k.skip||k.tags.filter(t=>/Chia hũ/.test(t)).length===3&&/chia/.test(k.msg),'poker split '+w);
 await p.evaluate(()=>{window.BQ&&(BQ.length=0);document.getElementById('badgeFX')?.remove();});await p.screenshot({path:`shots/v1584-pk-split-${w}.png`});await p.close();}
await b.close();console.log(f?'fail '+f:'all ok');process.exit(f?1:0);})();
