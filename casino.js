// ===== Luật 3 cào & Xì dách (lá c = hạng*4+chất; hạng 0='3'..7='10',8=J,9=Q,10=K,11=A,12='2')
function cFace(c){return [3,4,5,6,7,8,9,10,11,12,13,1,2][c>>2];}
// ---- 3 cào: điểm = tổng mod 10 (A=1, 10/J/Q/K = 0); ba cào (3 lá J/Q/K) cao nhất
function bcScore(h){const f=h.map(cFace);if(h.length===3&&f.every(x=>x>=11&&x<=13))return{score:10,bacao:true,label:'Ba cào'};
 const s=f.reduce((a,x)=>a+(x>=10?0:x),0)%10;return{score:s,bacao:false,label:s===0?'Bù (0 nút)':s+' nút'};}
// tiền người chơi nhận (âm = mất) khi so với nhà cái; thắng bằng ba cào x2
function bcPay(p,d,bet){if(p.score>d.score)return p.bacao?2*bet:bet;if(p.score<d.score)return d.bacao?-2*bet:-bet;return 0;}
// ---- Xì dách
function xdVal(c){const f=cFace(c);return f>=10?10:f;}
function xdTotal(h){let t=0,a=0;h.forEach(c=>{const v=xdVal(c);if(v===1)a++;t+=v;});const ex=h.length<=2?[10,9]:h.length===3?[9]:[];
 for(let k=0;k<a;k++)for(const o of ex){if(t+o<=21){t+=o;break;}}return t;}
const XD_RANK={quac:0,non:0.5,thuong:1,ngulinh:2,xidach:3,xibang:4};
const XD_LABEL={quac:'Quắc',non:'Non',thuong:'',ngulinh:'Ngũ linh',xidach:'Xì dách',xibang:'Xì bàng'};
const XD_MUL={thuong:1,ngulinh:2,xidach:2,xibang:3,non:1,quac:1};
function xdKind(h,minStand){const n=h.length,t=xdTotal(h);
 if(n===2&&h.every(c=>cFace(c)===1))return{kind:'xibang',total:21};
 if(n===2&&h.some(c=>cFace(c)===1)&&h.some(c=>xdVal(c)===10))return{kind:'xidach',total:21};
 if(t>21)return{kind:'quac',total:t};if(n===5)return{kind:'ngulinh',total:t};if(t<(minStand||16))return{kind:'non',total:t};return{kind:'thuong',total:t};}
// > 0 người chơi thắng, < 0 thua, 0 hòa (kết quả đã nhân hệ số)
function xdSettle(p,d,bet){
 if(p.kind==='quac')return d.kind==='quac'?0:-bet*(XD_RANK[d.kind]>=2?XD_MUL[d.kind]:1);
 if(d.kind==='quac')return p.kind==='non'?-bet:bet*XD_MUL[p.kind];
 const rp=XD_RANK[p.kind],rd=XD_RANK[d.kind];
 if(rp>rd)return bet*XD_MUL[p.kind];if(rp<rd)return -bet*XD_MUL[d.kind];
 if(p.kind==='thuong'||p.kind==='non')return p.total>d.total?bet:p.total<d.total?-bet:0;
 if(p.kind==='ngulinh')return p.total<d.total?2*bet:p.total>d.total?-2*bet:0;return 0;}
// nhà cái rút tới khi >= 15 (tối đa 5 lá); máy người chơi rút tới >= 16 (Khó liều hơn)
function xdDealerShould(h){const k=xdKind(h,15);return h.length<5&&!['xibang','xidach','quac'].includes(k.kind)&&k.total<15;}
function xdBotShould(h,risk){const k=xdKind(h,16);if(h.length>=5||['xibang','xidach','quac'].includes(k.kind))return false;if(k.total<16)return true;return k.total<=(risk||16)&&h.length<5&&k.total<18&&Math.random()<0.35;}
// ---- bàn nhiều người (ghế 0 = nhà cái). Trả về tiền của từng ghế (ghế 0 = -tổng), có trần lỗ cho nhà cái
function cgPair(g,ph,dh,bet){return g==='3cao'?bcPay(bcScore(ph),bcScore(dh),bet):xdSettle(xdKind(ph,16),xdKind(dh,15),bet);}
function cgCap(v,cap){const out=v.slice();if(cap==null)return out;let pay=0;for(let i=1;i<out.length;i++)if(out[i]>0)pay+=out[i];let win=0;for(let i=1;i<out.length;i++)if(out[i]<0)win-=out[i];
 const room=cap+win;if(pay>room&&pay>0){const k=Math.max(0,room)/pay;for(let i=1;i<out.length;i++)if(out[i]>0)out[i]=Math.floor(out[i]*k);}out[0]=-out.slice(1).reduce((a,x)=>a+(x||0),0);return out;}
function cgSettleTable(g,hands,bet,cap){const v=[0];for(let i=1;i<hands.length;i++)v.push(cgPair(g,hands[i],hands[0],bet));v[0]=-v.slice(1).reduce((a,x)=>a+x,0);return cgCap(v,cap);}
function cgDealerNeed(g,n,bet){return bet*(n-1)*(g==='3cao'?2:3);}
if(typeof module!=='undefined')module.exports={cgPair,cgCap,cgSettleTable,cgDealerNeed,cFace,bcScore,bcPay,xdVal,xdTotal,xdKind,xdSettle,xdDealerShould,xdBotShould,XD_LABEL};
