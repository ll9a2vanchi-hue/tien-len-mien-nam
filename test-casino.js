const C=require('./casino.js');const R=(f)=>({3:0,4:1,5:2,6:3,7:4,8:5,9:6,10:7,J:8,Q:9,K:10,A:11,2:12})[f];const c=(f,s=0)=>R(f)*4+s;let bad=0;const t=(b,m)=>{console.log(b?'ok':'FAIL',m);if(!b)bad++;};
// 3 cào
t(C.bcScore([c(5),c(7),c(9)]).score===1,'5+7+9 = 21 -> 1 nút');t(C.bcScore([c('K'),c(10),c('A')]).score===1,'K,10,A -> 1');
t(C.bcScore([c('J'),c('Q'),c('K')]).bacao,'ba cào J Q K');t(!C.bcScore([c('J'),c('Q'),c(10)]).bacao,'có 10 không phải ba cào');
t(C.bcScore([c(4),c(6),c('K')]).score===0,'bù');const bc=C.bcScore([c('J'),c('J',1),c('K')]),n9=C.bcScore([c(4),c(5),c(10)]);
t(C.bcPay(bc,n9,100)===200,'ba cào thắng x2');t(C.bcPay(n9,bc,100)===-200,'thua ba cào -2x');t(C.bcPay(n9,C.bcScore([c(9),c('K'),c(10)]),100)===0,'hòa');
t(C.bcPay(C.bcScore([c(2),c(3),c(4)]),C.bcScore([c(2),c(2,1),c(4)]),100)===100,'9 thắng 8');
// xì dách
t(C.xdTotal([c('A'),c(9)])===20,'A+9=20');t(C.xdTotal([c('A'),c(5),c(6)])===21,'3 lá A=10 -> 21');t(C.xdTotal([c('A'),c(5),c(9)])===15,'3 lá A=1 khi quá');
t(C.xdTotal([c('A'),c(2),c(3),c(4)])===10,'4 lá A=1');
t(C.xdKind([c('A'),c('A',1)]).kind==='xibang','xì bàng');t(C.xdKind([c('A'),c('K')]).kind==='xidach','xì dách');t(C.xdKind([c(2),c(3),c(4),c(5),c(6)]).kind==='ngulinh','ngũ linh');
t(C.xdKind([c('K'),c('Q'),c(5)]).kind==='quac','quắc');t(C.xdKind([c(10),c(5)]).kind==='non','non <16');
const K=h=>C.xdKind(h);
t(C.xdSettle(K([c('A'),c('K')]),K([c(10),c(9)]),100)===200,'xì dách thắng x2');t(C.xdSettle(K([c(10),c(9)]),K([c('A'),c('A',1)]),100)===-300,'thua xì bàng x3');
t(C.xdSettle(K([c(10),c(9)]),K([c(10),c(8)]),100)===100,'19 > 18');t(C.xdSettle(K([c(10),c(8)]),K([c(10),c(8,1)]),100)===0,'hòa');
t(C.xdSettle(K([c('K'),c('Q'),c(5)]),K([c('K'),c('Q'),c(6)]),100)===0,'cùng quắc hòa');t(C.xdSettle(K([c('K'),c('Q'),c(5)]),K([c(10),c(8)]),100)===-100,'quắc thua');
t(C.xdSettle(K([c(10),c(7)]),K([c('K'),c('Q'),c(5)]),100)===100,'cái quắc -> thắng');t(C.xdSettle(K([c(2),c(3),c(4),c(5),c(6)]),K([c(10),c(9)]),100)===200,'ngũ linh x2');
t(C.xdSettle(K([c(10),c(5)]),K([c(10),c(9)]),100)===-100,'non thua');
t(!C.xdDealerShould([c(10),c(5)])&&C.xdDealerShould([c(10),c(4)]),'cái rút tới 15');
console.log(bad?'FAIL':'PASS');process.exit(bad?1:0);
