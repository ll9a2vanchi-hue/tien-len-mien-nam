// Sổ xu: tổng các dòng == thay đổi số dư thật, kể cả khi chạm đáy 0
const X=require('./progress.js'),C=require('./chop.js');let pass=0,fail=0;const t=(n,v)=>{v?pass++:(fail++,console.log('FAIL',n));};
let rs=12345;const rnd=()=>{rs=(rs*1103515245+12345)&0x7fffffff;return rs/0x7fffffff;};
const BETS=[100,200,500,1000,2000,5000];let floors=0;
for(let g=0;g<3000;g++){const P=X.newProfile();P.xu=[0,30,120,700,5000,40000][g%6]+Math.floor(rnd()*300);P.xp=Math.floor(rnd()*20000);P.bet=BETS[Math.floor(rnd()*6)];const n=2+(g%3);
 const xu0=P.xu;let chop=0;
 // chặt heo trong ván (ví người có đáy 0)
 for(let k=0;k<Math.floor(rnd()*3);k++){const payer=rnd()<.5?0:1,recv=payer===0?1:0;const r=C.chopSettle({payer,receiver:recv,amount:Math.round(P.bet*(rnd()<.5?.5:1))},{0:P.xu});if(!r)continue;
  if(r.payer===0){const a=Math.min(r.amount,P.xu);if(a<r.amount)floors++;P.xu-=a;chop-=a;}if(r.receiver===0){P.xu+=r.amount;chop+=r.amount;}}
 // thúi / cháy / 3 bích (người chơi trả hoặc nhận) — cùng công thức chia như UI
 const rank=[...Array(n).keys()].sort(()=>rnd()-.5);const hands=rank.map(()=>{const h=[];const m=rnd()<.15?13:Math.floor(rnd()*6);for(let i=0;i<m;i++)h.push(Math.floor(rnd()*52));return [...new Set(h)];});
 const handsBy=[];rank.forEach((p,i)=>handsBy[p]=i===0?[]:hands[i]);const S=C.thuiSettle(handsBy,rank,P.bet,rnd()<.2?[0]:[5]);const o={thui:0,chay:0,b3:0,t3:0};
 S.forEach(s=>{if(s.payer!==0&&s.receiver!==0)return;let paid=s.amount;if(s.payer===0){paid=Math.min(s.amount,P.xu);if(paid<s.amount)floors++;P.xu-=paid;}else P.xu+=s.amount;
  const sign=s.payer===0?-1:1;let left=paid;s.items.forEach(it=>{const v=Math.min(left,it.v);left-=v;o[it.k==='cháy bài'?'chay':it.k==='3 bích về nhất'?'b3':it.k==='thúi 3 bích'?'t3':'thui']+=sign*v;});});
 const place=rank.indexOf(0);const res=X.onGameEnd(P,place,false,n,{bonus:rnd()<.3?.25:0});
 const L=X.ledgerItems(Object.assign({},res.ledger,o,{chop}));t('ledger==delta g'+g+' '+L.total+' vs '+(P.xu-xu0),L.total===P.xu-xu0);t('no negative balance',P.xu>=0);}
t('floor cases exercised',floors>20);
console.log('pass',pass,'fail',fail,'floors',floors);if(fail)process.exitCode=1;
