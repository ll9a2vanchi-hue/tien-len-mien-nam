// ===== Luật 4 chế độ mới: Bầu cua, Domino, Xì tố, Poker (lá c = hạng*4+chất; hạng 0='3'..11=A,12='2'; chất ♠♣♦♥)
// ---- Bầu cua tôm cá
const BC_SYM=['nai','bau','ga','ca','cua','tom'],BC_EMO={nai:'🦌',bau:'🍐',ga:'🐓',ca:'🐟',cua:'🦀',tom:'🦐'},BC_NAME={nai:'Nai',bau:'Bầu',ga:'Gà',ca:'Cá',cua:'Cua',tom:'Tôm'};
function bcuaRoll(rng){rng=rng||Math.random;return [0,1,2].map(()=>BC_SYM[Math.floor(rng()*6)]);}
// tiền thắng/thua của 1 người đặt (so với nhà cái): trúng k mặt -> +cược*k, trượt -> -cược
function bcuaPay(bets,dice){let v=0;for(const s in bets){const a=bets[s]||0;if(!a)continue;const k=dice.filter(d=>d===s).length;v+=k?a*k:-a;}return v;}
// ---- Domino đôi sáu
function dmTiles(){const t=[];for(let a=0;a<=6;a++)for(let b=a;b<=6;b++)t.push([a,b]);return t;}
function dmPips(h){return h.reduce((s,t)=>s+t[0]+t[1],0);}
function dmFits(t,ends){if(!ends)return['L'];const o=[];if(t[0]===ends[0]||t[1]===ends[0])o.push('L');if(t[0]===ends[1]||t[1]===ends[1])o.push('R');return o;}
// đặt quân vào dây; trả về {ends, placed:[a,b] theo hướng}
function dmPlace(ends,t,side){if(!ends)return{ends:[t[0],t[1]],placed:[t[0],t[1]]};if(side==='L'){const p=t[1]===ends[0]?[t[0],t[1]]:[t[1],t[0]];return{ends:[p[0],ends[1]],placed:p};}
 const p=t[0]===ends[1]?[t[0],t[1]]:[t[1],t[0]];return{ends:[ends[0],p[1]],placed:p};}
// người đi trước: đôi lớn nhất, không có thì quân nặng nhất
function dmStarter(hands){let best=null;hands.forEach((h,i)=>h.forEach(t=>{const sc=(t[0]===t[1]?100:0)+t[0]+t[1];if(!best||sc>best.sc)best={i,t,sc};}));return best;}
// kết thúc: người hết bài thắng; bí (cả bàn không đi được) -> ít điểm nhất thắng. Mỗi người thua trả winner theo số nút còn lại * đơn vị
function dmSettle(hands,winner,unit){const v=hands.map(()=>0);hands.forEach((h,i)=>{if(i===winner)return;const p=dmPips(h)*unit;v[i]-=p;v[winner]+=p;});return v;}
function dmBlockedWinner(hands){let w=0;hands.forEach((h,i)=>{const a=dmPips(h),b=dmPips(hands[w]);if(a<b||(a===b&&h.length<hands[w].length))w=i;});return w;}
function dmBotPick(hand,ends){let best=null;hand.forEach((t,k)=>dmFits(t,ends).forEach(s=>{const sc=(t[0]===t[1]?6:0)+t[0]+t[1];if(!best||sc>best.sc)best={k,side:s,sc};}));return best;}
// ---- Bộ đánh giá bài 5 lá (poker / xì tố)
function pkV(c){const r=c>>2;return r===12?2:r+3;}// 2..14
const PK_NAMES=['Mậu thầu','Đôi','Thú','Sám cô','Sảnh','Thùng','Cù lũ','Tứ quý','Thùng phá sảnh'];
const XT_NAMES=['Mậu thầu','Đôi','Thú','Sám cô','Sảnh','Cù lũ','Thùng','Tứ quý','Thùng phá sảnh'];
// trả về mảng điểm so sánh từ trái qua; mode 'xt' = xì tố 32 lá (thùng > cù lũ, sảnh thấp A-7-8-9-10, hòa xét chất lá cao nhất)
function eval5(cs,mode){const v=cs.map(pkV).sort((a,b)=>b-a);const su=cs.map(c=>c&3);const fl=su.every(s=>s===su[0]);
 const cnt={};v.forEach(x=>cnt[x]=(cnt[x]||0)+1);const grp=Object.entries(cnt).map(([k,n])=>[n,+k]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]);
 const uniq=[...new Set(v)];let st=0;if(uniq.length===5){if(v[0]-v[4]===4)st=v[0];else if(mode==='xt'&&v.join()==='14,10,9,8,7')st=10;else if(mode!=='xt'&&v.join()==='14,5,4,3,2')st=5;}
 let cat,tb;if(st&&fl){cat=8;tb=[st];}else if(grp[0][0]===4){cat=7;tb=[grp[0][1],grp[1][1]];}else if(grp[0][0]===3&&grp[1][0]===2){cat=mode==='xt'?5:6;tb=[grp[0][1],grp[1][1]];}
 else if(fl){cat=mode==='xt'?6:5;tb=v;}else if(st){cat=4;tb=[st];}else if(grp[0][0]===3){cat=3;tb=grp.map(g=>g[1]);}else if(grp[0][0]===2&&grp[1][0]===2){cat=2;tb=grp.map(g=>g[1]);}else if(grp[0][0]===2){cat=1;tb=grp.map(g=>g[1]);}else{cat=0;tb=v;}
 const sc=[cat,...tb];if(mode==='xt'){const top=Math.max(...cs.map(c=>pkV(c)*4+(c&3)));sc.push(top);}return sc;}
function cmpSc(a,b){for(let i=0;i<Math.max(a.length,b.length);i++){const d=(a[i]||0)-(b[i]||0);if(d)return d;}return 0;}
function best5(cs,mode){if(cs.length<=5)return{sc:eval5(cs,mode),cards:cs};let best=null;const n=cs.length;
 const rec=(st,pick)=>{if(pick.length===5){const sc=eval5(pick,mode);if(!best||cmpSc(sc,best.sc)>0)best={sc,cards:pick.slice()};return;}for(let i=st;i<n;i++){if(n-i<5-pick.length)break;pick.push(cs[i]);rec(i+1,pick);pick.pop();}};rec(0,[]);return best;}
function handName(sc,mode){return (mode==='xt'?XT_NAMES:PK_NAMES)[sc[0]];}
// đánh giá phần bài chưa đủ 5 lá (xì tố đang chia): chỉ xét đôi/sám/tứ + lá cao
function evalPartial(cs){if(cs.length>=5)return eval5(cs.slice(0,5),'xt');const v=cs.map(pkV).sort((a,b)=>b-a);const cnt={};v.forEach(x=>cnt[x]=(cnt[x]||0)+1);const g=Object.entries(cnt).map(([k,n])=>[n,+k]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]);
 const cat=g[0][0]===4?7:g[0][0]===3?3:g[0][0]===2&&g[1]&&g[1][0]===2?2:g[0][0]===2?1:0;return [cat,...g.map(x=>x[1])];}
// ---- chia tiền nhiều hũ (side pot)
function sidePots(contrib,folded){const lv=[...new Set(contrib.filter(x=>x>0))].sort((a,b)=>a-b);const pots=[];let prev=0;
 for(const L of lv){let amt=0;const elig=[];contrib.forEach((c,i)=>{amt+=Math.max(0,Math.min(c,L)-prev);if(c>=L&&!folded[i])elig.push(i);});if(amt>0){if(elig.length)pots.push({amt,elig});else if(pots.length)pots[pots.length-1].amt+=amt;}prev=L;}return pots;}
// scores[i] = mảng điểm (null nếu bỏ bài). Trả về tiền mỗi người nhận
function awardPots(pots,scores){const win=scores.map(()=>0);pots.forEach(p=>{let best=null,ws=[];p.elig.forEach(i=>{if(!scores[i])return;const d=best?cmpSc(scores[i],best):1;if(d>0){best=scores[i];ws=[i];}else if(d===0)ws.push(i);});
 if(!ws.length)ws=p.elig.slice(0,1);const share=Math.floor(p.amt/ws.length);ws.forEach(i=>win[i]+=share);win[ws[0]]+=p.amt-share*ws.length;});return win;}
// xác suất thắng ước lượng (Monte Carlo) cho máy
function pkEquity(hole,board,nOpp,iters,mode,deckAll){const used=new Set(hole.concat(board));const deck=deckAll.filter(c=>!used.has(c));let w=0;iters=iters||120;const need=(mode==='xt'?5-hole.length-board.length:5-board.length);
 for(let it=0;it<iters;it++){const d=deck.slice();for(let i=d.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]];}let p=0;const bd=board.concat(mode==='xt'?[]:d.slice(p,p+=Math.max(0,need)));
  const mine=mode==='xt'?best5(hole.concat(d.slice(p,p+=Math.max(0,need))),'xt').sc:best5(hole.concat(bd),'pk').sc;let lose=false,tie=0;
  for(let o=0;o<nOpp;o++){const oh=d.slice(p,p+=(mode==='xt'?5:2));const os=mode==='xt'?eval5(oh,'xt'):best5(oh.concat(bd),'pk').sc;const c=cmpSc(os,mine);if(c>0){lose=true;break;}if(c===0)tie++;}
  if(!lose)w+=tie?1/(tie+1):1;}return w/iters;}
const DECK52=[...Array(52).keys()],DECK32=[...Array(52).keys()].filter(c=>{const r=c>>2;return r>=4&&r<=11;});
if(typeof module!=='undefined')module.exports={BC_SYM,bcuaRoll,bcuaPay,dmTiles,dmPips,dmFits,dmPlace,dmStarter,dmSettle,dmBlockedWinner,dmBotPick,pkV,eval5,cmpSc,best5,handName,evalPartial,sidePots,awardPots,pkEquity,DECK52,DECK32};
