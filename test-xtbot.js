const G=require('./games2.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const rate=(diff,eq,round)=>{let n=0;const N=40000;for(let i=0;i<N;i++)if(G.xtBotPlan(eq,round,diff,true,Math.random).kind==='bluff')n++;return n/N;};
const r=[0,1,2,3].map(d=>rate(d,0.3,2));console.log('bluff rates',r.map(x=>x.toFixed(3)));
t('Dễ hiếm (<2%)',r[0]<0.02);t('tăng theo độ khó',r[0]<r[1]&&r[1]<r[2]&&r[2]<r[3]);t('Cao thủ ~8-12% (vòng 3+)',r[3]>0.08&&r[3]<0.14);
t('không bluff khi bài mạnh',rate(3,0.8,2)===0);t('không bluff vòng đầu',rate(3,0.3,0)===0);
t('không bluff khi không đủ tiền',(()=>{for(let i=0;i<2000;i++)if(G.xtBotPlan(0.2,2,3,false,Math.random).kind==='bluff')return false;return true;})());
const raises=[];for(let i=0;i<4000;i++){const p=G.xtBotPlan(0.9,1,1,true,Math.random);if(p.kind==='raise')raises.push(p.mult);}
t('bài mạnh tố nhẹ (1-3 lần cược)',raises.length>3000&&Math.max(...raises)<=3);
t('độ khó theo cấp',G.xtBotDiff(3)===0&&G.xtBotDiff(8)===1&&G.xtBotDiff(20)===2&&G.xtBotDiff(40)===3);
process.exit(f?1:0);
