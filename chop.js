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
if(typeof module!=='undefined')module.exports={isTwoCombo,isBombInfo,chopValue,chopStep,chopSettle};
