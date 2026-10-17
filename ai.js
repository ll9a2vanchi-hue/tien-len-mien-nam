// AI_START
// 4 cấp độ máy: 0 Dễ, 1 Thường, 2 Khó, 3 Cao thủ. Chỉ dùng thông tin công khai:
// bài của mình, bài đã ra (ctx.played), số lá của đối thủ (ctx.others: theo thứ tự đánh sau mình), bài trên bàn.
const AI_NAMES=['Dễ','Thường','Khó','Cao thủ'];
function aiUnknown(hand,played){const s=new Set(hand);(played||[]).forEach(c=>s.add(c));const u=[];for(let c=0;c<52;c++)if(!s.has(c))u.push(c);return u;}
function rankCounts(cards){const n=new Array(13).fill(0);cards.forEach(c=>n[c>>2]++);return n;}
// nhóm g (info) có bị bài chưa biết chặn được không?
function aiBeatable(info,U,uc,maxOther){if(maxOther<info.len)return false;const r=info.top>>2;
 switch(info.type){
  case 'single':return U.some(c=>c>info.top)||(r===12&&(uc.some(x=>x===4)||aiPairseqPossible(uc,3)));
  case 'pair':for(let q=r;q<13;q++){const m=U.filter(c=>(c>>2)===q&&(q>r||c>info.top));if(q===r?m.length>=1&&uc[q]>=2:uc[q]>=2)return true;}return r===12&&(uc.some(x=>x===4)||aiPairseqPossible(uc,4));
  case 'triple':for(let q=r+1;q<13;q++)if(uc[q]>=3)return true;return false;
  case 'quad':for(let q=r+1;q<13;q++)if(uc[q]>=4)return true;return aiPairseqPossible(uc,4);
  case 'straight':{const L=info.len;for(let top=r;top<=11;top++){let ok=true;for(let q=top-L+1;q<=top;q++)if(q<0||uc[q]<1||(q===top&&top===r&&!U.some(c=>(c>>2)===r&&c>info.top))){ok=false;break;}if(ok)return true;}return false;}
  case 'pairseq':{const L=info.len;for(let top=r+1;top<=11;top++){let ok=true;for(let q=top-L+1;q<=top;q++)if(q<0||uc[q]<2){ok=false;break;}if(ok)return true;}return info.len===3&&uc.some(x=>x===4);}
 }return true;}
function aiPairseqPossible(uc,L){for(let top=L-1;top<=11;top++){let ok=true;for(let q=top-L+1;q<=top;q++)if(uc[q]<2){ok=false;break;}if(ok)return true;}return false;}
// Ứng viên nhóm chứa lá thấp nhất c (rút gọn chất để tìm kiếm nhanh)
function aiGroupsWith(hand,c){const r=c>>2,by=[];for(let q=0;q<13;q++)by.push([]);hand.forEach(x=>by[x>>2].push(x));const out=[[c]];const same=by[r].filter(x=>x!==c);
 for(let k=1;k<=same.length;k++)out.push([c,...same.slice(0,k)]);
 if(r<12){let s=[c];for(let q=r+1;q<12&&by[q].length;q++){s=s.concat([by[q][0]]);if(s.length>=3)out.push(s.slice());}}
 if(r<12&&same.length){let s=[c,same[0]];for(let q=r+1;q<12&&by[q].length>=2;q++){s=s.concat(by[q].slice(0,2));if(s.length>=6)out.push(s.slice());}}
 return out;}
// Chia bài tối ưu: tối thiểu "chi phí" (số lượt cần, trừ đi nhóm kiểm soát)
function aiSplit(hand,K,memo,budget){const key=hand.join(',');if(memo.has(key))return memo.get(key);if(!hand.length)return{cost:0,groups:[]};
 if(budget.n--<=0){const g=hand.map(c=>[c]);return{cost:g.reduce((a,x)=>a+aiGroupCost(x,K),0),groups:g};}
 const c=hand[0];let best=null;
 for(const g of aiGroupsWith(hand,c)){const rest=hand.filter(x=>!g.includes(x));const sub=aiSplit(rest,K,memo,budget);const cost=aiGroupCost(g,K)+sub.cost;if(!best||cost<best.cost)best={cost,groups:[g,...sub.groups]};}
 memo.set(key,best);return best;}
function aiGroupCost(g,K){const info=detect(g);if(!info)return 9;let v=1;const r=info.top>>2;
 if(!aiBeatable(info,K.U,K.uc,K.maxOther))v-=K.ctl; // nhóm kiểm soát: gần như chắc thắng vòng
 if(info.type==='single')v+=0.25*(11-Math.min(r,11))/11;if(info.type==='pair')v+=0.1*(11-Math.min(r,11))/11;
 if(info.type==='quad'||(info.type==='pairseq'&&info.len>=3))v-=0.4;return v;}
function aiCtx(hand,ctx,level){const U=aiUnknown(hand,ctx&&ctx.played);const others=(ctx&&ctx.others)||[13];return{U,uc:rankCounts(U),maxOther:Math.max(0,...others),minOther:Math.min(...others),others,ctl:level>=3?0.85:0.7};}
// v1.53: bộ chặt (3 đôi thông trở lên, tứ quý) để dành chặt heo; chỉ Cao thủ mới dám mở ván bằng bộ chặt
let AI_LV=0;
function aiIsBombCards(g){const i=detect(g);return !!i&&(i.type==='quad'||(i.type==='pairseq'&&i.len>=3));}
function aiMove(level,hand,cur,mustInclude,ctx,rng){rng=rng||Math.random;const others=(ctx&&ctx.others)||[13];
 if(level<=0){let cs=combos(hand).filter(x=>canBeat(x.info,cur));if(mustInclude!=null)cs=cs.filter(x=>x.cards.includes(mustInclude));if(!cs.length)return null;
  const fin=cs.find(x=>x.cards.length===hand.length);if(fin)return fin.cards;if(cur&&rng()<0.3)return null;if(rng()<0.45){let pool=cs;if(!cur){const nb=cs.filter(x=>!aiIsBombCards(x.cards));if(nb.length)pool=nb;}return pool[Math.floor(rng()*pool.length)].cards;}return botMove(hand,cur,mustInclude,others);}
 if(level===1)return botMove(hand,cur,mustInclude,others);
 AI_LV=level;const k=aiSmart(2,hand,cur,mustInclude,ctx,rng);if(level>=3&&!(ctx&&ctx.noSearch)&&(hand.length<=9||Math.min(...((ctx&&ctx.others)||[13]))<=6))return aiSearch(hand,cur,mustInclude,ctx,rng,k);return k;}
function aiSmart(level,hand,cur,mustInclude,ctx,rng){const K=aiCtx(hand,ctx,level),t0=Date.now(),memo=new Map(),budget={n:level>=3?6000:2500};
 let cs=combos(hand).filter(x=>canBeat(x.info,cur));if(mustInclude!=null)cs=cs.filter(x=>x.cards.includes(mustInclude));if(!cs.length)return null;
 const fin=cs.find(x=>x.cards.length===hand.length);if(fin)return fin.cards;
 const threat=K.minOther<=2,next=K.others[0];
 const split=h=>aiSplit(h,K,memo,budget);const beat=g=>aiBeatable(detect(g),K.U,K.uc,K.maxOther);
 if(!cur){const S=split(hand);let gs=S.groups;if(AI_LV<3){const nbg=gs.filter(g=>!aiIsBombCards(g));if(nbg.length)gs=nbg;}const ctl=gs.filter(g=>!beat(g)),weak=gs.filter(g=>beat(g));
  if(mustInclude!=null){const g=gs.find(g=>g.includes(mustInclude));if(g)return g;}
  // Có thể về liền: đánh nhóm kiểm soát trước, nhóm yếu cuối cùng
  if(weak.length<=1&&ctl.length){return ctl.sort((a,b)=>b.length-a.length)[0];}
  if(level>=3&&weak.length===2&&ctl.length){ // Cao thủ: thử đánh nhóm yếu "khó bị chặn" để giữ quyền
   const w=weak.slice().sort((a,b)=>aiThreatScore(b,K)-aiThreatScore(a,K))[0];if(aiThreatScore(w,K)>0.6)return w;}
  let cand=weak.length?weak:gs;
  if(next===1||threat){const ns=cand.filter(g=>g.length>1);if(ns.length)cand=ns;else{const sg=cand.slice().sort((a,b)=>b[0]-a[0]);return sg[0];}}
  cand=cand.slice().sort((a,b)=>aiLeadKey(a)-aiLeadKey(b));return cand[0];}
 // Theo bài
 const base=split(hand).cost,curTwo=(cur.top>>2)===12;let best=null;
 for(const x of cs){if(Date.now()-t0>(level>=3?220:120))break;const rest=hand.filter(c=>!x.cards.includes(c));let sc=split(rest).cost-base;
  const info=x.info,bomb=info.type==='quad'||(info.type==='pairseq'&&info.len>=3),two=(info.top>>2)===12;
  if(bomb)sc+=curTwo?-1.2:(threat?0.2:1.5);
  if(two&&!curTwo)sc+=threat||rest.length<=4?0.1:0.7;
  if(!beat(x.cards))sc-=level>=3?0.45:0.3; // thắng vòng -> được ra bài
  if(threat)sc-=0.6;
  if(level>=3&&rest.length){const S2=split(rest);if(!beat(x.cards)&&S2.groups.filter(g=>beat(g)).length<=1)sc-=2;} // chuỗi kết thúc chắc thắng
  sc+=0.02*(info.top>>2);
  if(!best||sc<best.sc)best={sc,cards:x.cards};}
 if(!best)return null;
 const passTol=threat?0.9:(hand.length<=4?0.6:0.25);
 return best.sc<=passTol?best.cards:null;}
function aiLeadKey(g){const info=detect(g);return (info.top>>2)*1-g.length*0.8+(info.type==='single'?0:-0.5);}
function aiThreatScore(g,K){const info=detect(g);return info.len>K.maxOther?1:(info.type==='straight'?0.7:info.type==='pair'&&(info.top>>2)>=9?0.65:0.3);}
var ROLL_SMART=false;
// Cao thủ: tìm kiếm Monte Carlo có xác định hóa (chia ngẫu nhiên bài chưa biết theo số lá đối thủ), mô phỏng tới hết ván
function aiCands(hand,cur,mustInclude,ctx,rng,k){let cs=combos(hand).filter(x=>canBeat(x.info,cur));if(mustInclude!=null)cs=cs.filter(x=>x.cards.includes(mustInclude));
 const out=[];const add=m=>{const key=m?m.slice().sort((a,b)=>a-b).join(','):'pass';if(!out.find(o=>o.key===key))out.push({key,m});};add(k);if(cur)add(null);
 cs.sort((a,b)=>cost(a)-cost(b));for(const x of cs){if(out.length>=6)break;add(x.cards);}
 if(!cur){const K=aiCtx(hand,ctx,3);const S=aiSplit(hand,K,new Map(),{n:2500});S.groups.forEach(g=>{if(out.length<8&&(mustInclude==null||g.includes(mustInclude)))add(g);});}
 return out;}
function aiSearch(hand,cur,mustInclude,ctx,rng,k){const t0=Date.now(),BUD=(ctx&&ctx.budget)||150;const T=ctx&&ctx.table;const others=T?T.counts:((ctx&&ctx.others)||[13]);
 const C=aiCands(hand,cur,mustInclude,ctx,rng,k);if(C.length<=1)return k;
 const U=aiUnknown(hand,ctx&&ctx.played);C.forEach(c=>{c.s=0;c.n=0;});if(typeof AI_STATS!=='undefined')AI_STATS.calls++;let it=0;
 while(Date.now()-t0<BUD&&it<600){const c=C[it%C.length];it++;
  const u=U.slice();for(let i=u.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[u[i],u[j]]=[u[j],u[i]];}
  let off=0;const hs=[hand.slice()];others.forEach(n=>{hs.push(sortCards(u.slice(off,off+n)));off+=n;});
  const cb=T&&T.curBy!=null?T.curBy:(cur?others.length:0),pas=[0].concat(T?T.passed:others.map(()=>0));
  c.s+=aiRollout(hs,cur,cb,pas,c.m,rng);c.n++;}
 let best=C[0];C.forEach(c=>{if(c.n&&c.s/c.n>best.s/(best.n||1)+1e-9)best=c;});
 if(C[0].n&&best.s/best.n<C[0].s/C[0].n+0.04)best=C[0]; // chỉ đổi khi rõ ràng tốt hơn
 return best.m;}
// mô phỏng: người 0 = mình (đã chọn nước m), người khác dùng AI Khó (không tìm kiếm). Trả điểm 1 (nhất)..0 (bét)
function aiRollout(hs,cur,curBy,passed,m,rng){const n=hs.length,fin=[];let turn=0,steps=0;passed=passed.slice();
 const play=(p,cards)=>{const info=detect(cards);hs[p]=hs[p].filter(c=>!cards.includes(c));cur=info;curBy=p;if(!hs[p].length)fin.push(p);};
 const next=()=>{let p=turn;for(let k=0;k<n;k++){p=(p+1)%n;if(p===curBy){cur=null;passed=passed.map(()=>0);if(!hs[p].length){let q=p;let g=0;do{q=(q+1)%n;g++;}while(!hs[q].length&&g<n);turn=q;}else turn=p;curBy=null;return;}
   if(passed[p]||!hs[p].length)continue;turn=p;return;}};
 if(m)play(0,m);else passed[0]=1;if(fin.includes(0))return 1;next();
 const playedBase=[];
 while(fin.length<n-1&&steps<200){steps++;const p=turn;if(!hs[p].length){next();continue;}
  const oth=[];for(let k=1;k<n;k++){const q=(p+k)%n;if(hs[q].length)oth.push(hs[q].length);}
  const known=new Set(hs.flat());const played=[];for(let c=0;c<52;c++)if(!known.has(c))played.push(c);
  let mv=(ROLL_SMART?aiSmart(2,hs[p],cur,null,{played,others:oth.length?oth:[13]},rng):botMove(hs[p],cur,null,oth.length?oth:[13]));if(!mv&&!cur)mv=[hs[p][0]];
  if(mv)play(p,mv);else passed[p]=1;if(fin.includes(0))break;if(fin.length>=n-1)break;next();}
 const pos=fin.indexOf(0);const place=pos>=0?pos:fin.length;return [1,0.35,0.12,0][Math.min(3,Math.round(place*3/(n-1)))];}
// Chọn cấp độ ngẫu nhiên theo cấp người chơi
function aiPickLevel(playerLv,rng){rng=rng||Math.random;const L=playerLv||1;const w=[Math.max(4,35-1.5*L),40,8+1.5*L,Math.max(1,2*L-8)];const tot=w.reduce((a,b)=>a+b,0);let r=rng()*tot;for(let i=0;i<4;i++){r-=w[i];if(r<0)return i;}return 1;}
function aiBotLevel(diff,rng){rng=rng||Math.random;const R=[[1,5],[4,12],[12,25],[25,45]][diff];return R[0]+Math.floor(rng()*(R[1]-R[0]+1));}
// thưởng % theo số máy khó mà mình về trên
const AI_BONUS=[0,0.1,0.25,0.5];
function aiBeatBonus(rank,me,levels){const pos=rank.indexOf(me);let b=0;rank.slice(pos+1).forEach(p=>{if(levels[p]!=null)b+=AI_BONUS[levels[p]]||0;});return Math.min(1.5,b);}
// AI_END

// Xếp bài thông minh: chia tay bài thành bộ ít lá lẻ nhất. Trả về mảng nhóm theo thứ tự hiển thị.
function smartGroups(hand){const h=hand.slice().sort((a,b)=>a-b),memo=new Map();
 const R=c=>c>>2,W={single:10,pair:3,triple:2,straight:1,quad:0,pairseq:0};
 function best(cards){if(!cards.length)return{c:0,g:[]};const key=cards.join(',');if(memo.has(key))return memo.get(key);
  const c0=cards[0],r0=R(c0),opts=[];const same=cards.filter(c=>R(c)===r0);
  opts.push([c0]);for(let k=2;k<=same.length;k++)opts.push(same.slice(0,k));
  if(r0<12){for(let pick of [1,2]){const g=[];let r=r0;while(r<12){const rc=cards.filter(c=>R(c)===r);if(rc.length<pick)break;g.push(...rc.slice(0,pick));r++;
    const len=r-r0;if((pick===1&&len>=3)||(pick===2&&len>=3))opts.push(g.slice());}}}
  let b=null;for(const g of opts){const rest=cards.filter(c=>!g.includes(c));const sub=best(rest);const t=g.length===1?(R(g[0])===12?1:W.single):(g.length===same.length&&g.length===4&&g.every(c=>R(c)===r0)?0:(new Set(g.map(R)).size===1?(g.length===2?W.pair:W.triple):(g.length===new Set(g.map(R)).size?W.straight:W.pairseq)));
   const cost=t+sub.c;if(!b||cost<b.c)b={c:cost,g:[g,...sub.g]};}
  memo.set(key,b);return b;}
 const gs=best(h).g;const cat=g=>{const rs=new Set(g.map(R));if(rs.has(12)&&rs.size===1)return 0;if(g.length===4&&rs.size===1)return 0;if(rs.size>=3&&g.length===rs.size*2)return 0;if(rs.size>=3)return 1;if(g.length>=2)return 2;return 3;};
 return gs.sort((a,b)=>cat(a)-cat(b)||(cat(a)===1?b.length-a.length:0)||a[0]-b[0]);}
if(typeof module!=='undefined')module.exports={smartGroups,AI_NAMES,AI_BONUS,aiMove,aiPickLevel,aiBotLevel,aiBeatBonus,aiSplit,aiBeatable,aiUnknown,rankCounts};
