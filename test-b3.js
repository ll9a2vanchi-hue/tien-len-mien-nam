const C=require('./chop.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
t('single 3♠',C.isB3Win([0]));t('pair 3♠3♣',!C.isB3Win([0,1]));t('straight 3-4-5',!C.isB3Win([0,4,8]));t('triple 3',!C.isB3Win([0,1,2]));t('single other',!C.isB3Win([1]));t('none',!C.isB3Win(null));
const H=[[],[24],[48],[]],R=[0,1,2,3];
t('settle single pays',C.thuiSettle(H,R,100,[0]).some(x=>x.items.some(i=>i.k==='3 bích về nhất')));
for(const [n,p] of [['pair',[0,1]],['straight',[0,4,8]],['triple',[0,1,2]]])t('settle '+n+' no b3',!C.thuiSettle(H,R,100,p).some(x=>x.items.some(i=>i.k==='3 bích về nhất')));
process.exit(f?1:0);
