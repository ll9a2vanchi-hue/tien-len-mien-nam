const P=require('./progress.js'),C=require('./cloud.js');let f=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL ')+m);if(!c)f++;};
const H=3600e3,t0=Date.UTC(2026,9,12,0,0,0);const mk=(xp)=>{const p={xu:0,xp:xp||0};P.passiveInit(p,t0);return p;};
let lv20=0;while(P.levelInfo(lv20).level<20)lv20+=50;const p=mk(lv20);ok(Math.abs(P.passiveRate(p)-0.1)<1e-12,'cấp 20 = 0,1 xu/giây');
ok(Math.abs(P.passivePending(p,t0+10e3)-1)<1e-9,'10 giây = 1 xu');ok(P.passiveClaim(p,t0+15e3)===1&&Math.abs(p.passive.frac-0.5)<1e-9,'giữ phần lẻ 0,5');
ok(P.passiveClaim(p,t0+20e3)===1&&Math.abs(p.passive.frac)<1e-9,'phần lẻ cộng dồn lần sau');
const q=mk(lv20);ok(Math.abs(P.passivePending(q,t0+72*H)-8640)<1e-6,'giới hạn 24 giờ khi offline lâu (8.640 xu)');
const r=mk(lv20);ok(P.passivePending(r,t0-5*H)===0&&P.passiveClaim(r,t0-5*H)===0&&r.passive.last===t0,'lùi đồng hồ: không cộng, không đổi mốc');
ok(Math.abs(P.passivePending(r,t0+10e3)-1)<1e-9,'đồng hồ đúng lại thì tiếp tục bình thường');
const s=mk(0);ok(Math.abs(P.passivePending(s,t0+H)-18)<1e-9,'cấp 1 = 18 xu/giờ');
ok(P.passiveClaim(s,t0+H)===18&&P.passiveClaim(s,t0+H)===0,'nhận 2 lần liền không được thêm');
// đồng bộ: bản lưu có mốc nhận mới hơn thắng
const A={profile:{xu:0,xp:5000,passive:{last:t0,frac:0.2}},updatedAt:9},B={profile:{xu:0,xp:0,passive:{last:t0+5*H,frac:0.7}},updatedAt:1};
ok(C.mergeSaves(A,B).profile.passive.last===t0+5*H,'gộp giữ mốc nhận mới nhất');ok(C.mergeSaves(B,A).profile.passive.last===t0+5*H,'gộp chiều ngược lại');
const m=C.mergeSaves(A,B).profile;ok(P.passiveClaim(m,t0+5*H)===0,'máy khác vừa nhận thì không nhận lại được');
const legacy={xu:5,xp:0};ok(P.passivePending(legacy,t0)===0&&legacy.passive.last===t0,'hồ sơ cũ bắt đầu tính từ bây giờ');
// ---- Tài sản
{const p=mk(lv20);p.xu=50e6;ok(P.assetCost('quan',1)===1e6&&P.assetCost('quan',2)===500e3&&P.assetCost('quan',3)===750e3&&P.assetCost('quan',4)===1e6&&P.assetCost('quan',5)===1.25e6,'giá Quán nước: 1tr, 500k, 750k, 1tr, 1,25tr');
 ok(P.assetCost('tapdoan',1)===10e6&&P.assetCost('tapdoan',5)===12.5e6,'giá Tập đoàn');
 let r=P.buyAsset(p,'quan',t0);ok(r.ok&&p.xu===49e6&&P.assetLv(p,'quan')===1&&P.assetBonus(p)===10,'mua Quán nước → cấp 1, +10%');
 ok(Math.abs(P.passiveRate(p)-0.11)<1e-12,'cấp 20 + 10% = 0,11 xu/giây');
 r=P.buyAsset(p,'quan',t0+10e3);ok(r.ok&&r.cost===500e3&&P.assetBonus(p)===20,'nâng cấp 2: 500k, +20%');
 ok(Math.abs(P.passivePending(p,t0+10e3)-1.1)<1e-9,'phần đã tích trước khi nâng cấp được giữ theo tốc độ cũ');
 for(let i=0;i<3;i++)P.buyAsset(p,'quan',t0+10e3);ok(P.assetLv(p,'quan')===5&&P.assetBonus(p)===50,'cấp 5 = 5× (50%)');ok(!P.buyAsset(p,'quan',t0).ok,'không nâng quá cấp 5');
 const poor={xu:10,xp:0};ok(!P.buyAsset(poor,'quan',t0).ok&&poor.xu===10&&!P.assetLv(poor,'quan'),'không đủ xu thì không mua');
 const all=Object.assign(P.newProfile(),{xu:1e9,xp:0});P.passiveInit(all,t0);P.ASSETS.filter(a=>a.cat==='biz').forEach(a=>P.buyAsset(all,a.id,t0));ok(P.assetBonus(all)===275,'đủ 5 tài sản = +275%');
 let b=P.checkBadges(all).map(x=>x.id);ok(['asset_first','asset_nhamay','asset_tapdoan','asset_all'].every(i=>b.includes(i))&&!b.includes('asset_max'),'huy hiệu sở hữu');
 P.ASSETS.filter(a=>a.cat==='biz').forEach(a=>{while(P.assetLv(all,a.id)<5)P.buyAsset(all,a.id,t0);});ok(P.assetBonus(all)===1375,'max cả 5 = +1375%');ok(P.checkBadges(all).some(x=>x.id==='asset_max'),'huy hiệu max tất cả');
 const A={profile:{xu:0,xp:5000,assets:{quan:2,nhamay:1}},updatedAt:9},B={profile:{xu:0,xp:0,assets:{quan:4,tapdoan:1}},updatedAt:1};const m=C.mergeSaves(A,B).profile.assets;ok(m.quan===4&&m.nhamay===1&&m.tapdoan===1,'gộp tài sản lấy cấp cao nhất');}
// ---- Phương tiện + Mua sắm + EXP
{const P2=Object.assign(P.newProfile(),{xu:1e9,xp:0});const veh=P.ASSETS.filter(a=>a.cat==='veh');ok(veh.map(a=>a.price+':'+a.pct).join()==='50000:2,120000:4,250000:6,500000:10,1000000:15','5 phương tiện đúng giá/%');
 ok(P.assetCost('xedap',2)===25000&&P.assetCost('duthuyen',5)===1250000,'giá nâng cấp phương tiện cùng quy tắc');
 veh.forEach(a=>P.buyAsset(P2,a.id,t0));ok(P.assetBonus(P2)===37,'đủ 5 xe cấp 1 = +37% thu nhập');ok(P.checkBadges(P2).some(b=>b.id==='veh_all'),'huy hiệu bộ sưu tập xe');
 const sh=P.ASSETS.filter(a=>a.cat==='shop');ok(sh.length===12&&sh.map(a=>a.price).join()==='10000,100000,500000,30000,250000,1000000,20000,150000,700000,50000,300000,1000000','12 món mua sắm đúng giá');
 ok(P.buyAsset(P2,'ao1',t0).ok&&!P.buyAsset(P2,'ao1',t0).ok&&P.assetLv(P2,'ao1')===1,'mua sắm chỉ mua 1 lần');
 ok(P.expBonus(P2)===1&&P.assetBonus(P2)===37,'EXP% tách riêng khỏi thu nhập%');
 sh.forEach(a=>P.buyAsset(P2,a.id,t0));ok(P.expBonus(P2)===40,'đủ 12 món = +40% EXP');ok(P.checkBadges(P2).some(b=>b.id==='shop_all'),'huy hiệu mua sắm');
 const x0=P2.xp;P.addXp(P2,30);ok(P2.xp-x0===42,'EXP +40%: 30 → 42');
 const big=Object.assign(P.newProfile(),{xu:0,xp:0,assets:{}});sh.forEach(a=>big.assets[a.id]=1);big.assets.extra=1;ok(P.expBonus(big)===40,'không có giới hạn trần nhưng chỉ tính món hợp lệ');
 ok(P.bestAsset(P2).id==='duthuyen'||P.bestAsset(P2).price>=1000000,'tài sản giá trị nhất');
 const A={profile:{xu:0,xp:5000,assets:{xedap:3,ps3:1}},updatedAt:9},B={profile:{xu:0,xp:0,assets:{xedap:5,ao1:1}},updatedAt:1};const m=C.mergeSaves(A,B).profile.assets;ok(m.xedap===5&&m.ps3===1&&m.ao1===1,'gộp: cấp cao hơn thắng, giữ mọi món');}
process.exit(f?1:0);
