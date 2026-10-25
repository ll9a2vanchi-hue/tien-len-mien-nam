const X=require('./progress.js'),S=require('./shop.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const mk=()=>S.ensureInv(X.newProfile());
// (a) tổng xu thắng
let P=mk();X.expBreakdown(P);X.onGameEnd(P,0,false,4,{xuDelta:500,earnExtra:300});t('TLMN: tính cả chặt/thúi (net cả ván)',P.stats.earned===800);
X.onGameEnd(P,3,false,4,{xuDelta:-300,earnExtra:200});t('ván lỗ ròng không cộng',P.stats.earned===800);
X.onGameEnd(P,3,false,4,{xuDelta:-100,earnExtra:400});t('thua hạng nhưng thắng chặt → cộng phần lãi ròng',P.stats.earned===1100);
for(const m of ['3cao','xidach','baucua','domino','xito','poker']){const Q=mk();X.expBreakdown(Q);X.modeRecord(Q,m,{win:true,net:1000,bet:100,n:4});X.modeRecord(Q,m,{win:false,net:-500,bet:100,n:4});t(m+': cộng khi thắng, không trừ khi thua',Q.stats.earned===1000);}
{const Q=mk();X.expBreakdown(Q);X.modeRecord(Q,'demla',{win:true,net:900,bet:100,n:4});t('Đếm lá không cộng 2 lần qua modeRecord',(Q.stats.earned||0)===0);}
{const Q=mk();const x0=Q.stats.earned||0;X.claimLogin(Q,new Date(2026,9,19));Q.quests.list.forEach((q,i)=>{q.prog=99;X.claimQuest(Q,i);});t('quà/nhiệm vụ không tính vào xu thắng',(Q.stats.earned||0)===x0);}
// backfill
{const Q=mk();Q.stats.earned=5000;Q.stats.m_poker_earn=20000;Q.stats.m_xito_earn=10000;Q.stats.m_demla_earn=999;const B=X.expBreakdown(Q);t('cộng bù lịch sử các chế độ (1 lần)',Q.stats.earned===35000&&B.rows[2].pct===0.04);X.expBreakdown(Q);t('không cộng bù 2 lần',Q.stats.earned===35000);}
// (b)(c) giá trị vật phẩm
{const Q=mk();['av_cool','av_smile'].forEach(i=>Q.inv[i]=1);t('avatar miễn phí = 0',X.ownedValue(Q,true)===0);Q.inv.av_king=1;t('avatar tính giá niêm yết',X.ownedValue(Q,true)===3000);
 Q.inv.back_diamond=1;Q.inv.back_diamond=2;Q.inv.felt_vault=1;Q.inv.bogus_id=1;t('vật phẩm: không trùng, bỏ id lạ, gồm cao cấp',X.ownedValue(Q,false)===1800000);
 Q.inv.em_ultra=1;Q.inv.fx_phoenix=1;Q.inv.nc_diamond=1;Q.inv.bub_diamond=1;Q.inv.deck_holo2=1;Q.inv.fr_diamond=1;t('gồm emote/fx/tên/bong bóng/bộ bài/khung',X.ownedValue(Q,false)===1800000+1000000+1000000+900000+700000+900000+3000);}
{const Q=mk();Q.xu=1e7;const d='2026-10-19',dl=S.dailyDeal(d);S.buyItem(Q,dl.id,99,d);const it=S.shopItem(dl.id);t('mua giảm giá vẫn tính giá niêm yết',X.ownedValue(Q,it.type==='avatar')===it.price);}
// (d) huy hiệu
{const Q=mk();Q.badges={[X.BADGES[0].id]:1,[X.BADGES[1].id]:1,old_removed:1,x2:0};t('đếm đúng huy hiệu hợp lệ',X.expBreakdown(Q).rows[3].pct===0.1);}
// (e) pet: chỉ pet đang theo
{const Q=mk();Q.xu=1e8;const ids=X.PETS.map(p=>p.id);ids.forEach(id=>X.buyPet(Q,id));const a=X.petActive(Q);t('pet: chỉ tính pet đang theo',X.expBreakdown(Q).rows[5].pct===(a?a.pct:0));}
// (f) mua sắm
{const Q=mk();Q.xu=1e8;X.buyAsset(Q,'ao1');X.buyAsset(Q,'tt3');t('Mua sắm = tổng pct',X.expBreakdown(Q).rows[4].pct===7);}
// (g) trần & áp dụng 1 lần
{const Q=mk();Q.stats.earned=5e9;X.expBreakdown(Q);const qb=X.expBonus(Q);X.addXp(Q,100,'poker');const qx=Math.round(100*(1+qb/100));t('không trần → nhân đúng 1 lần',qb>300&&Q._lastXp===qx&&Q.mxp.poker===qx);
 const Q2=mk();Q2.stats.earned=2000000;X.expBreakdown(Q2);const r=X.onGameEnd(Q2,0,false,4,{mode:'tlmn',xuDelta:300});const base=X.tableXp(4,0,false,'tlmn');t('onGameEnd áp dụng thưởng 1 lần (+2%)',Q2._lastXp===Math.round(base*1.02));}
// (h) UI = áp dụng
{const Q=mk();Q.stats.earned=123456;Q.inv.back_holo=1;Q.badges={[X.BADGES[2].id]:1};X.expBreakdown(Q);const B=X.expBreakdown(Q);t('tổng UI = tổng các dòng = expBonus',Math.abs(B.total-B.rows.reduce((a,r)=>a+r.pct,0))<1e-9&&X.expBonus(Q)===B.total);X.addXp(Q,1000);t('XP thực nhận khớp UI',Q._lastXp===Math.round(1000*(1+B.total/100)));}
process.exit(f?1:0);
