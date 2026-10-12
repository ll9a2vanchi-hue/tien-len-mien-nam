const R=require('./rules.js');Object.assign(global,R);const K=require('./chop.js');let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
const C=(r,s)=>r*4+s,B=100;
const two_s=[C(12,0)],two_h=[C(12,3)],pair2=[C(12,1),C(12,2)];
const ps3=[C(3,0),C(3,1),C(4,0),C(4,1),C(5,0),C(5,1)],quad=[C(7,0),C(7,1),C(7,2),C(7,3)],ps4=[C(8,0),C(8,1),C(9,0),C(9,1),C(10,0),C(10,1),C(11,0),C(11,1)];
t('black 2 = 0.5x',K.chopValue(two_s,detect(two_s),B)===50);t('red 2 = 1x',K.chopValue(two_h,detect(two_h),B)===100);t('pair ♣♦ = 1.5x',K.chopValue(pair2,detect(pair2),B)===150);
t('bomb = 1x',K.chopValue(ps3,detect(ps3),B)===100);
let p=K.chopStep(null,detect(two_h),two_h,0,detect(ps3),1,B);t('A->B 100',p.payer===0&&p.receiver===1&&p.amount===100);
p=K.chopStep(p,detect(ps3),ps3,1,detect(quad),2,B);t('chain B->C 200',p.payer===1&&p.receiver===2&&p.amount===200&&p.chain===2);
p=K.chopStep(p,detect(quad),quad,2,detect(ps4),3,B);t('chain C->D 300',p.payer===2&&p.receiver===3&&p.amount===300);
t('normal beat not chop',K.chopStep(null,detect(two_s),two_s,0,detect(two_h),1,B)===null);
t('non-2 single not chop',K.chopStep(null,detect([C(11,0)]),[C(11,0)],0,detect(quad),1,B)===null);
t('settle clamp to wallet',K.chopSettle({payer:0,receiver:1,amount:300},{0:120}).amount===120);t('settle bot unlimited',K.chopSettle({payer:2,receiver:0,amount:300},{0:5}).amount===300);
t('pair of 2 chopped by quad',K.chopStep(null,detect(pair2),pair2,1,detect(quad),0,B).amount===150);
console.log('pass',ok,'fail',bad);
// thúi heo + 3 bích về nhất
{const C=require('./chop.js');const t=(c,m)=>{console.log(c?'ok '+m:'FAIL '+m);if(!c)process.exitCode=1;};const c=(r,s)=>r*4+s;
 t(C.thuiValue([c(12,0),c(12,3),c(5,1)],100).amount===150,'thúi heo đen+đỏ = 1.5x');
 t(C.thuiValue([c(7,0),c(7,1),c(7,2),c(7,3)],100).amount===100,'thúi tứ quý 1x');
 t(C.thuiValue([c(3,0),c(3,1),c(4,0),c(4,2),c(5,1),c(5,3)],200).amount===200,'thúi 3 đôi thông 1x');
 t(C.thuiValue([c(3,0),c(4,0),c(9,1)],100).amount===0,'không thúi');
 t(C.thuiValue([-1,-1],100).amount===0,'bài ẩn bỏ qua');
 const S=C.thuiSettle([[],[c(12,3)],[c(12,0),c(12,1)],[c(6,0)]],[0,2,1,3],100);t(S.length===2&&S.find(x=>x.payer===2).receiver===0&&S.find(x=>x.payer===1).receiver===2&&S.find(x=>x.payer===1).amount===100&&S.find(x=>x.payer===2).amount===100,'thúi trả người về ngay trên');
 const B=C.thuiSettle([[],[c(6,0)],[c(12,3)],[]],[0,1,2,3],100,[0]);{const tot=q=>B.filter(x=>x.payer===q&&x.receiver===0).reduce((a,x)=>a+x.amount,0);t(tot(1)===100&&tot(2)===100&&tot(3)===100&&B.find(x=>x.payer===2&&x.receiver===1).amount===100,'3 bích: mỗi người +1x cho nhất; thúi trả người trên');}
 t(C.thuiSettle([[],[c(6,0)]],[0,1],100,[5]).length===0,'không 3 bích');}
{const C=require('./chop.js');const t=(c,m)=>{console.log(c?'ok '+m:'FAIL '+m);if(!c)process.exitCode=1;};
 const h13=[1,2,5,9,13,17,21,25,29,33,37,41,45];/* có 2 đỏ? 45=rank11 -> không heo */const S=C.thuiSettle([[],h13,[6]],[0,2,1],100);const x=S.find(z=>z.payer===1);
 t(x&&x.chay&&x.amount===200,'cháy bài 2x cược');t(!S.find(z=>z.payer===2),'không cháy khi đã đánh');
 const h13b=h13.slice(0,12).concat([51]);const y=C.thuiSettle([[],h13b],[0,1],100)[0];t(y.amount===300&&y.chay,'cháy + thúi heo đỏ cộng dồn');}
;{const C=require('./chop.js');const c=(r,s)=>r*4+s;const S=C.thuiSettle([[],[],[c(12,3)],[c(12,0)]],[0,1,2,3],100);
 const ok=S.length===2&&S.find(x=>x.payer===3).receiver===2&&S.find(x=>x.payer===2).receiver===1;console.log(ok?'ok thúi chuỗi 4→3, 3→2':'FAIL chain');if(!ok)process.exitCode=1;}
;{const C=require('./chop.js');const c=(r,s)=>r*4+s;let f=0;const T=(b,m)=>{console.log(b?'ok':'FAIL',m);if(!b)f=1;};
 T(C.demlaUnits([c(0,0),c(9,1),c(11,0),c(12,0),c(12,3)])===1+1.5+2+3+4,'đếm lá: giá từng lá');T(C.demlaUnits([...Array(13).keys()].map(i=>c(i,0)))===(8+4.5+2+3)*2,'đếm lá: cháy x2');
 const d=C.demlaSettle([[],[c(1,0),c(2,0)],[c(12,2),c(3,1),c(8,1),c(11,1)],[c(6,0)]],[0,3,1,2],500);
 T(d[3]===-100&&d[1]===-200&&d[2]===-850&&d[0]===1150,'đếm lá: thua trả nhất theo giá lá');T(Object.values(d).reduce((a,b)=>a+b,0)===0,'đếm lá: tổng 0');if(f)process.exitCode=1;}
