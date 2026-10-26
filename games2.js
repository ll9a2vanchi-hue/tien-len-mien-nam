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
// Xì tố: máy tố nhẹ khi bài mạnh, thỉnh thoảng bluff tất tay (tỉ lệ theo độ khó: Dễ hiếm, Cao thủ ~9%)
const XT_BLUFF=[0.01,0.03,0.06,0.09];
function xtBotDiff(lv){return lv<5?0:lv<12?1:lv<25?2:3;}
function xtBotPlan(eq,round,diff,canBluff,rng){rng=rng||Math.random;diff=Math.max(0,Math.min(3,diff|0));
 if(canBluff&&eq<0.5&&round>=1&&rng()<XT_BLUFF[diff]*(round>=2?1.3:1))return{kind:'bluff'};
 if(eq>0.88&&round>=2&&rng()<0.12)return{kind:'allin'};
 if(eq>0.7){const ms=eq>0.85?[1,2,3]:[1,1,2];return{kind:'raise',mult:ms[Math.floor(rng()*ms.length)]};}
 return{kind:'norm'};}

// ===================== MẬU BINH (Binh sập xám) =====================
// lá: c>>2 = hạng (0='3' … 11='A', 12='2'), c&3 = chất ♠♣♦♥; giá trị so sánh pkV: 2..14 (A cao nhất, 2 thấp nhất)
// chi 1 = 5 lá (cuối, mạnh nhất), chi 2 = 5 lá (giữa), chi 3 = 3 lá (đầu); phải chi1 ≥ chi2 ≥ chi3, sai là binh lủng
const MB_NAMES=['Mậu thầu','Đôi','Thú','Xám chi','Sảnh','Thùng','Cù lũ','Tứ quý','Thùng phá sảnh'];
const MB_LUNG=6;// binh lủng: thua mỗi người 6 chi (như bị sập 3 chi)
// mậu binh trắng: [tên, số chi ăn mỗi người]; chỉ số càng lớn càng mạnh
const MB_TRANG=[null,['Ba sảnh',6],['Ba thùng',6],['Lục phé bôn (6 đôi)',6],['Năm đôi một xám',8],['Đồng màu',12],['Sảnh rồng',24]];
function mbEval3(cs){const v=cs.map(pkV).sort((a,b)=>b-a);if(v[0]===v[2])return[3,v[0]];if(v[0]===v[1])return[1,v[0],v[2]];if(v[1]===v[2])return[1,v[1],v[0]];return[0,...v];}
function mbEval(cs){return cs.length===3?mbEval3(cs):eval5(cs,'pk');}
function mbName(sc){return MB_NAMES[sc[0]];}
function mbScores(a){return a.map(mbEval);}
function mbIsLung(a){const s=mbScores(a);return cmpSc(s[0],s[1])<0||cmpSc(s[1],s[2])<0;}
// điểm thưởng khi THẮNG chi k (0 = chi 1, 1 = chi 2, 2 = chi 3) bằng bộ sc
function mbChiVal(k,sc){if(k===0)return sc[0]===8?5:sc[0]===7?4:1;if(k===1)return sc[0]===8?10:sc[0]===7?8:sc[0]===6?2:1;return sc[0]===3?3:1;}
function mbStraight3(cs){const v=[...new Set(cs.map(pkV))].sort((a,b)=>a-b);if(v.length!==3)return false;return (v[2]-v[0]===2)||v.join()==='2,3,14';}
function mbFlush(cs){return cs.every(c=>(c&3)===(cs[0]&3));}
function mbStraight(cs){if(cs.length===3)return mbStraight3(cs);const k=eval5(cs,'pk')[0];return k===4||k===8;}
function mbCombos(arr,k){const out=[];const rec=(st,pick)=>{if(pick.length===k){out.push(pick.slice());return;}for(let i=st;i<arr.length;i++){if(arr.length-i<k-pick.length)break;pick.push(arr[i]);rec(i+1,pick);pick.pop();}};rec(0,[]);return out;}
// tìm cách chia 13 lá thành 3 chi đều thỏa điều kiện ok(chi)
function mbSplit3(cs,ok){for(const c3 of mbCombos(cs,3)){if(!ok(c3))continue;const rest=cs.filter(c=>!c3.includes(c));const first=rest[0];for(const c2 of mbCombos(rest.slice(1),4)){const a=[first,...c2];if(!ok(a))continue;const b=rest.filter(c=>!a.includes(c));if(ok(b)){const s1=mbEval(a),s2=mbEval(b);return cmpSc(s1,s2)>=0?[a,b,c3]:[b,a,c3];}}}return null;}
// nhận biết mậu binh trắng (13 lá); trả {t,name,pay,arr?} hoặc null
function mbTrang(cs){if(!cs||cs.length!==13)return null;const v=cs.map(pkV);const cnt={};v.forEach(x=>cnt[x]=(cnt[x]||0)+1);const cs_=Object.values(cnt);
 const mk=(t,arr)=>({t,name:MB_TRANG[t][0],pay:MB_TRANG[t][1],arr:arr||null});
 if(cs_.length===13)return mk(6);
 const red=cs.filter(c=>(c&3)>=2).length;if(red===13||red===0)return mk(5);
 if(cs_.filter(n=>n===3).length===1&&cs_.every(n=>n===3||n%2===0))return mk(4);
 if(cs_.reduce((a,n)=>a+Math.floor(n/2),0)>=6)return mk(3);
 const fl=mbSplit3(cs,mbFlush);if(fl)return mk(2,fl);
 const sp=mbSplit3(cs,mbStraight);if(sp)return mk(1,sp);
 return null;}
// ---- xếp binh tự động: duyệt mọi cách chia hợp lệ, chọn cách có kỳ vọng ăn chi cao nhất
const _MBM={};function mbMasks(k){if(_MBM[k])return _MBM[k];const out=[];for(let m=0;m<8192;m++){let b=0,x=m;while(x){b+=x&1;x>>=1;}if(b===k)out.push(m);}return _MBM[k]=out;}
function mbSig(x,m,k){return 1/(1+Math.exp(-(x-m)*k));}
function mbStr(sc,len){const w=(sc[1]-2)/13;return len===3?(sc[0]===3?3+w:sc[0]===1?1+w:w*0.95):sc[0]+w*0.95;}
function mbEV(s1,s2,s3){const p1=mbSig(mbStr(s1,5),2.9,2.2),p2=mbSig(mbStr(s2,5),1.7,2.2),p3=mbSig(mbStr(s3,3),0.95,2.6);
 return p1*(mbChiVal(0,s1)+1)+p2*(mbChiVal(1,s2)+1)+p3*(mbChiVal(2,s3)+1)-3+(p1*p2*p3)*1.5;}
function mbBest(cs,rnd){if(!cs||cs.length!==13)return null;const M5=mbMasks(5),M3=mbMasks(3);const E5=new Map(),E3=new Map();const pick=m=>cs.filter((c,i)=>m>>i&1);
 M5.forEach(m=>E5.set(m,eval5(pick(m),'pk')));M3.forEach(m=>E3.set(m,mbEval3(pick(m))));const FULL=8191;let best=null,bv=-1e9;
 for(const m1 of M5){const s1=E5.get(m1);for(const m2 of M5){if(m1&m2)continue;const s2=E5.get(m2);if(cmpSc(s1,s2)<0)continue;const m3=FULL^m1^m2;const s3=E3.get(m3);if(cmpSc(s2,s3)<0)continue;
  let v=mbEV(s1,s2,s3);if(rnd)v+=(rnd()-0.5)*rnd.amp;if(v>bv){bv=v;best=[m1,m2,m3];}}}
 return best?[pick(best[0]),pick(best[1]),pick(best[2])]:null;}
// ---- tính tiền: arrs[i]=[chi1,chi2,chi3]; trs[i]=mbTrang(...) hoặc null. Đơn vị = chi.
function mbSettle(arrs,trs){const n=arrs.length;trs=trs||arrs.map(()=>null);const sc=arrs.map(mbScores);
 const lung=arrs.map((a,i)=>!trs[i]&&(cmpSc(sc[i][0],sc[i][1])<0||cmpSc(sc[i][1],sc[i][2])<0));
 const Z=()=>Array.from({length:n},()=>Array(n).fill(0));const P=Z(),sap=Z(),kind=Z();const chi=[0,1,2].map(()=>Array(n).fill(0));const wins=Z();
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){let v=0;
  if(trs[i]||trs[j]){const ti=trs[i]?trs[i].t:0,tj=trs[j]?trs[j].t:0;v=ti===tj?0:ti>tj?trs[i].pay:-trs[j].pay;kind[i][j]=kind[j][i]='trang';}
  else if(lung[i]||lung[j]){v=lung[i]&&lung[j]?0:lung[i]?-MB_LUNG:MB_LUNG;kind[i][j]=kind[j][i]='lung';}
  else{let wi=0,wj=0;for(let k=0;k<3;k++){const c=cmpSc(sc[i][k],sc[j][k]);if(c>0){const x=mbChiVal(k,sc[i][k]);v+=x;chi[k][i]+=x;chi[k][j]-=x;wi++;}else if(c<0){const x=mbChiVal(k,sc[j][k]);v-=x;chi[k][i]-=x;chi[k][j]+=x;wj++;}}
   wins[i][j]=wi;wins[j][i]=wj;if(wi===3){v*=2;sap[i][j]=1;}if(wj===3){v*=2;sap[j][i]=1;}kind[i][j]=kind[j][i]='chi';}
  P[i][j]=v;P[j][i]=-v;}
 let sapLang=-1;if(n>=3)for(let i=0;i<n;i++){let all=true;for(let j=0;j<n;j++)if(j!==i&&!sap[i][j])all=false;if(all){sapLang=i;for(let j=0;j<n;j++)if(j!==i){P[i][j]*=2;P[j][i]=-P[i][j];}}}
 const tot=P.map(r=>r.reduce((a,x)=>a+x,0));return{sc,lung,trang:trs,P,sap,sapLang,chi,kind,tot};}
// đổi chi ra xu, người thua không trả quá số xu đang có (chia đều theo tỉ lệ)
function mbPayMat(P,unit,have){const n=P.length;const X=P.map(r=>r.map(v=>v*unit));for(let i=0;i<n;i++){const loss=X[i].reduce((a,v)=>a+(v<0?-v:0),0);const h=Math.max(0,have[i]==null?Infinity:have[i]);
  if(loss>h){const f=h/loss;for(let j=0;j<n;j++)if(X[i][j]<0){X[i][j]=-Math.floor(-X[i][j]*f);X[j][i]=-X[i][j];}}}
 return X;}
function mbPayXu(P,unit,have){return mbPayMat(P,unit,have).map(r=>r.reduce((a,v)=>a+v,0));}
if(typeof module!=='undefined')module.exports={MB_NAMES,MB_LUNG,MB_TRANG,mbEval3,mbEval,mbName,mbScores,mbIsLung,mbChiVal,mbStraight3,mbTrang,mbBest,mbSettle,mbPayXu,mbPayMat,mbMasks,XT_BLUFF,xtBotDiff,xtBotPlan,BC_SYM,bcuaRoll,bcuaPay,dmTiles,dmPips,dmFits,dmPlace,dmStarter,dmSettle,dmBlockedWinner,dmBotPick,pkV,eval5,cmpSc,best5,handName,evalPartial,sidePots,awardPots,pkEquity,DECK52,DECK32};
