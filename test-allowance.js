const P=require('./progress.js'),C=require('./cloud.js');let f=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL ')+m);if(!c)f++;};
const d1=new Date(2026,9,11,10),d1b=new Date(2026,9,11,23,59),d2=new Date(2026,9,12,0,1);
let p={xu:0,xp:0};const lv=P.levelInfo(0).level;ok(P.allowanceAmt(p)===1000*lv,'1000 × cấp');
ok(!P.canAllowance({xu:5,xp:0},d1),'còn xu thì không nhận');ok(!P.canAllowance({xu:1,xp:0},d1),'1 xu cũng không');
ok(P.claimAllowance(p,d1)===1000*lv&&p.xu===1000*lv,'nhận khi đúng 0 xu');p.xu=0;ok(P.claimAllowance(p,d1b)===0,'lần 2 cùng ngày bị chặn');
ok(P.claimAllowance(p,d2)>0,'ngày mới nhận lại được');
const hi={xu:0,xp:1e6};ok(P.allowanceAmt(hi)===1000*P.levelInfo(1e6).level,'cấp cao nhận nhiều hơn');
// đồng bộ: máy khác đã nhận hôm nay -> sau khi gộp không nhận được nữa
const a={profile:{xu:0,xp:0,allowDay:null},updatedAt:1},b={profile:{xu:0,xp:0,allowDay:P.dayKey(d1)},updatedAt:2};const m=C.mergeSaves(a,b).profile;ok(m.allowDay===P.dayKey(d1)&&!P.canAllowance(Object.assign({},m,{xu:0}),d1),'gộp bản lưu giữ allowDay mới nhất');
const m2=C.mergeSaves(b,a).profile;const m3=C.mergeSaves({profile:{xu:500,xp:999999},updatedAt:9},b).profile;ok(m3.allowDay===P.dayKey(d1),'gộp khi bản kia tiến độ cao hơn');ok(m2.allowDay===P.dayKey(d1),'gộp chiều ngược lại');
process.exit(f?1:0);
