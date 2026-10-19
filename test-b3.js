const C=require('./chop.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
t('single 3♠',C.isB3Win([0]));t('pair 3♠3♣',!C.isB3Win([0,1]));t('straight 3-4-5',!C.isB3Win([0,4,8]));t('triple 3',!C.isB3Win([0,1,2]));t('single other',!C.isB3Win([1]));t('none',!C.isB3Win(null));
const H=[[],[24],[48],[]],R=[0,1,2,3];
t('settle single pays',C.thuiSettle(H,R,100,[0]).some(x=>x.items.some(i=>i.k==='3 bích về nhất')));
for(const [n,p] of [['pair',[0,1]],['straight',[0,4,8]],['triple',[0,1,2]]])t('settle '+n+' no b3',!C.thuiSettle(H,R,100,p).some(x=>x.items.some(i=>i.k==='3 bích về nhất')));
// thúi 3 bích: bét còn ĐÚNG 1 lá là 3♠ trả gấp đôi cho người ngay trên
{const H2=[[],[8],[12],[0]],R2=[0,1,2,3];const S=C.thuiSettle(H2,R2,100,[5]);const x=S.find(q=>q.payer===3);
t('t3 last pays double to above',x&&x.receiver===2&&x.items.some(i=>i.k==='thúi 3 bích'&&i.v===200)&&x.t3);
t('t3 only last',!S.some(q=>q.payer===2&&q.t3));
const S2=C.thuiSettle([[],[8],[0],[20]],R2,100,[5]);t('3♠ not last: no t3',!S2.some(q=>q.t3));
const S3=C.thuiSettle([[],[8],[12],[0]],R2,100,[0]);const y=S3.find(q=>q.payer===3);t('t3 stacks with b3 win',S3.filter(q=>q.payer===3).reduce((a,q)=>a+q.amount,0)>=300);
t('2p last only 3♠',C.thuiSettle([[],[0]],[0,1],100,[5]).some(q=>q.t3&&q.amount===200));
t('3♠ + lá khác: không thúi 3 bích',!C.thuiSettle([[],[8],[12],[0,20]],R2,100,[5]).some(q=>q.t3));
t('3♠ + lá khác 2 người: không thúi 3 bích',!C.thuiSettle([[],[0,9]],[0,1],100,[5]).some(q=>q.t3));
t('3♠ + heo: chỉ thúi heo thường',(()=>{const r=C.thuiSettle([[],[8],[12],[0,51]],R2,100,[5]).find(q=>q.payer===3);return r&&!r.t3&&!r.items.some(i=>i.k==='thúi 3 bích')&&r.items.length>0;})());}
process.exit(f?1:0);
