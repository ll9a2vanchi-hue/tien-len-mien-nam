const C=require('./casino.js');let f=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL ')+m);if(!c)f++;};
const R=(r,s)=>r*4+(s||0);// hạng: 0='3'..7='10',8=J,9=Q,10=K,11=A,12='2'
const J=8,Q=9,K=10,A=11;
// 3 cào: cái 5 nút (3+2? dùng 3,4,8=10->... ) 
let h0=[R(0),R(1),R(5)];// 3+4+8=15 -> 5 nút
let v=C.cgSettleTable('3cao',[h0,[R(J),R(Q),R(K)],[R(0),R(0,1),R(0,2)],[R(A),R(A,1),R(1)]],100);// ba cào x2 ; 9 nút ; 1+1+4=6
ok(v[1]===200&&v[2]===100&&v[3]===100&&v[0]===-400,'3cao cái chung từng nhà '+v);
v=C.cgSettleTable('3cao',[[R(J),R(Q),R(K)],[R(0),R(1),R(2)],[R(7),R(J),R(Q,1)]],500);ok(v[1]===-1000&&v[2]===-1000&&v[0]===2000,'cái ba cào ăn x2 '+v);
// xì dách
v=C.cgSettleTable('xidach',[[R(A),R(A,1)],[R(7),R(8)],[R(A,2),R(K)]],100);ok(v[1]===-300&&v[2]===-300&&v[0]===600,'cái xì bàng ăn x3 '+v);
v=C.cgSettleTable('xidach',[[R(7),R(4),R(5)],[R(7),R(8)],[R(1),R(3)],[R(2),R(2,1),R(0),R(0,1),R(1)]],100);// cái 10+6+7=23 quắc; 20; non 15 ; ngũ linh
ok(v[1]===100&&v[2]===-100&&v[3]===200&&v[0]===-200,'cái quắc: thắng thường, non thua, ngũ linh x2 '+v);
// trần lỗ của cái
v=C.cgCap([0,300,300,-100],250);ok(v[1]+v[2]<=350&&v[0]>=-250&&v[3]===-100,'cap '+v);
ok(C.cgDealerNeed('xidach',6,100)===1500&&C.cgDealerNeed('3cao',4,200)===1200,'need');
process.exit(f?1:0);
