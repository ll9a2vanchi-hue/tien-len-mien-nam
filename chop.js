// CHOP_START — Tiền chặt heo / chặt chồng
// Heo đen (♠♣) = 0.5× cược, heo đỏ (♦♥) = 1×; đôi heo = cộng; chặt hàng (đôi thông / tứ quý) = 1×.
// Chặt chồng: người chặt sau cùng thu toàn bộ số tích lũy từ người vừa bị chặt. Thanh toán khi hết vòng (không ai chặt tiếp) hoặc hết ván.
function isTwoCombo(info){return !!info&&(info.top>>2)===12&&(info.type==='single'||info.type==='pair'||info.type==='triple');}
function isBombInfo(info){return !!info&&(info.type==='quad'||(info.type==='pairseq'&&info.len>=3));}
function chopValue(prevCards,prevInfo,bet){if(isTwoCombo(prevInfo))return prevCards.reduce((a,c)=>a+((c&3)>=2?1:0.5),0)*bet;if(isBombInfo(prevInfo))return bet;return 0;}
// pend: {payer,receiver,amount}|null. Trả pend mới (hoặc null nếu không phải chặt)
function chopStep(pend,prevInfo,prevCards,prevBy,info,by,bet){if(!prevInfo||prevBy==null||prevBy===by)return pend;
 if(!(isTwoCombo(prevInfo)||isBombInfo(prevInfo))||!isBombInfo(info))return pend;
 const carry=pend&&pend.receiver===prevBy?pend.amount:0;return{payer:prevBy,receiver:by,amount:Math.round(carry+chopValue(prevCards,prevInfo,bet)),chain:(pend&&pend.receiver===prevBy?(pend.chain||1)+1:1)};}
// thanh toán: humanSeat có ví hữu hạn (xu), máy không giới hạn. Trả {payer,receiver,amount(đã giới hạn)}
function chopSettle(pend,wallet){if(!pend||!pend.amount)return null;let amt=pend.amount;if(wallet&&wallet[pend.payer]!=null)amt=Math.min(amt,Math.max(0,wallet[pend.payer]));return{payer:pend.payer,receiver:pend.receiver,amount:amt,chain:pend.chain||1};}
// CHOP_END
// THÚI HEO — cuối ván, người chưa về nhất còn giữ heo/hàng phải trả người về nhất
// heo đen 0.5×, heo đỏ 1×; tứ quý (không phải 2) 1×; 3 đôi thông (không dùng 2) 1× mỗi bộ.
function thuiValue(hand,bet){hand=(hand||[]).filter(c=>c>=0);const out={amount:0,cards:[],items:[]};
 hand.filter(c=>(c>>2)===12).forEach(c=>{const v=((c&3)>=2?1:0.5)*bet;out.amount+=v;out.cards.push(c);out.items.push({k:(c&3)>=2?'heo đỏ':'heo đen',v});});
 const by={};hand.forEach(c=>{const r=c>>2;if(r<12)(by[r]=by[r]||[]).push(c);});const used=new Set();
 Object.keys(by).forEach(r=>{if(by[r].length===4){out.amount+=bet;by[r].forEach(c=>{out.cards.push(c);used.add(c);});out.items.push({k:'tứ quý',v:bet});}});
 for(let r=0;r<=9;r++){const ok=[r,r+1,r+2].every(x=>by[x]&&by[x].filter(c=>!used.has(c)).length>=2);if(ok){[r,r+1,r+2].forEach(x=>by[x].filter(c=>!used.has(c)).slice(0,2).forEach(c=>{used.add(c);out.cards.push(c);}));out.amount+=bet;out.items.push({k:'3 đôi thông',v:bet});r+=2;}}
 out.amount=Math.round(out.amount);return out;}
// hands: mảng theo ghế; rank: thứ tự về; trả [{payer,receiver,amount,cards,items}]
// 3 bích về nhất: CHỈ khi nước cuối là 1 lá đơn 3♠ (đôi/sám/sảnh có 3♠ không tính)
function isB3Win(p){return !!(p&&p.length===1&&Number(p[0])===0);}
// thúi/cháy: trả cho người về ngay trên mình; 3 bích về nhất: trả cho người nhất
function thuiSettle(hands,rank,bet,winPlay){if(!rank||!rank.length)return[];const w=rank[0],b3=isB3Win(winPlay);const out=[];
 rank.slice(1).forEach((p,j)=>{const above=rank[j];const v=thuiValue(hands[p],bet);const chay=(hands[p]||[]).length===13;if(chay){v.amount+=2*bet;v.items.push({k:'cháy bài',v:2*bet});}
  if(j===rank.length-2&&(hands[p]||[]).length===1&&Number(hands[p][0])===0){v.amount+=2*bet;v.items.push({k:'thúi 3 bích',v:2*bet});}
  if(b3&&above===w){v.amount+=bet;v.items.push({k:'3 bích về nhất',v:bet});}
  if(v.amount)out.push({payer:p,receiver:above,amount:v.amount,cards:v.cards,items:v.items,b3:b3&&above===w,t3:v.items.some(i=>i.k==='thúi 3 bích'),chay});
  if(b3&&above!==w)out.push({payer:p,receiver:w,amount:bet,cards:[],items:[{k:'3 bích về nhất',v:bet}],b3:true,chay:false});});return out;}
// ---- Tiến Lên đếm lá: mỗi người thua trả người nhất bet/5 × số lá còn lại (heo tính 2 lá)
// giá mỗi lá (đơn vị = cược/5): 3-10 = 1, J/Q/K = 1.5, A = 2, 2 đen = 3, 2 đỏ = 4; cháy (còn 13 lá) x2
function demlaCard(c){const r=c>>2;return r<=7?1:r<=10?1.5:r===11?2:((c&3)>=2?4:3);}
function demlaUnits(hand){const u=(hand||[]).reduce((a,c)=>a+demlaCard(c),0);return (hand||[]).length===13?u*2:u;}
function demlaSettle(hands,rank,bet){const d={};rank.forEach(p=>d[p]=0);if(!rank.length)return d;const w=rank[0];
 rank.slice(1).forEach(p=>{const a=Math.round(bet/5*demlaUnits(hands[p]));d[p]-=a;d[w]+=a;});return d;}
if(typeof module!=='undefined')module.exports={isB3Win,demlaCard,demlaUnits,demlaSettle,thuiValue,thuiSettle,isTwoCombo,isBombInfo,chopValue,chopStep,chopSettle};
