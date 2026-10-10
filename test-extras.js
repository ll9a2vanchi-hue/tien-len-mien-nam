const X=require('./progress.js'),S=require('./shop.js');Object.assign(global,X,S);const E=require('./extras.js');
let pass=0,fail=0;const t=(n,v)=>{v?pass++:(fail++,console.log('FAIL',n));};
let seed=3;const rng=()=>(seed=(seed*16807)%2147483647)/2147483647;
// phạt rời bàn
t('penalty 50%',E.exitPenalty(100)===50&&E.exitPenalty(5000)===2500&&E.exitPenalty(25)===13);
let P=S.ensureInv(X.newProfile());P.bet=500;t('apply penalty',E.applyExitPenalty(P)===250&&P.xu===750&&P.stats.quits===1);
P.xu=10;t('penalty capped at balance',E.applyExitPenalty(P,1000)===10&&P.xu===0);
// vòng quay
P=S.ensureInv(X.newProfile());const d1=new Date(2026,9,11,10),d1b=new Date(2026,9,11,23,59),d2=new Date(2026,9,12,0,1);
t('free spin first',E.spinState(P,d1).free&&E.spinState(P,d1).can);const r1=E.doSpin(P,d1,rng);t('spin gives prize',r1&&r1.prize);
t('no second free same day',!E.spinState(P,d1b).free);const ex=P.spin.extra;t('no spin without extra',ex>0||E.doSpin(P,d1b,rng)===null);
t('reset at midnight',E.spinState(P,d2).free);
const xu0=P.xu;t('buy spin costs',E.buySpin(P,d2)&&P.xu===xu0-E.SPIN_COST&&P.spin.extra>=1);P.xu=0;t('buy spin needs xu',!E.buySpin(P,d2));
{const Q=S.ensureInv(X.newProfile());Q.spin={day:E.dk(d1),used:1,extra:2,total:1};t('extra spin used',E.doSpin(Q,d1,rng)&&Q.spin.extra>=1);}
// phân phối phần thưởng + item
{let c={};for(let i=0;i<5000;i++){const k=E.pickPrize(rng);c[k]=(c[k]||0)+1;}t('common prize more frequent than jackpot',c[0]>c[E.SPIN_PRIZES.length-1]*5);}
{const Q=S.ensureInv(X.newProfile());const it=E.SPIN_PRIZES.findIndex(p=>p.item);let g=null;E.ensureSpin(Q,d1);for(let i=0;i<300&&!g;i++){Q.spin.used=0;Q.spin.day=E.dk(d1);const r=E.doSpin(Q,d1,rng);if(r.prize.item)g=r;}t('item prize grants owned item',g&&S.owns(Q,g.got.item));}
// ném đồ
P=S.ensureInv(X.newProfile());P.xu=12;t('egg costs 2',E.throwItem(P,'egg').ok&&P.xu===10);t('flower 5',E.throwItem(P,'flower').ok&&P.xu===5);
t('premium 10 not enough',!E.throwItem(P,'bomb').ok&&P.xu===5);t('unknown throw',!E.throwItem(P,'zzz').ok);t('prices',E.THROWS.find(x=>x.id==='kiss').cost===10&&E.THROWS.find(x=>x.id==='tomato').cost===2);
// sảnh
const T0=E.publicTables();t('20 public tables valid codes',T0.length===20&&T0.every(x=>/^[A-HJ-NP-Z2-9]{6}$/.test(x.code))&&new Set(T0.map(x=>x.code)).size===20);
const c1=T0[0].code,c2=T0[7].code;
const pres=[{uid:'b',table:c1,at:20},{uid:'a',table:c1,at:10,bet:300,playing:true},{uid:'c',table:c2,at:5},{uid:'d',table:null},{uid:'a',table:c1,at:10}];
let L=E.lobbyTables(pres);const ta=L.find(x=>x.code===c1),tb=L.find(x=>x.code===c2);
t('occupancy',ta.count===2&&tb.count===1&&L.filter(x=>x.count).length===2);t('dedupe uid',ta.players.filter(p=>p.uid==='a').length===1);
t('host earliest',ta.host==='a'&&tb.host==='c');t('host bet applies',ta.bet===300&&tb.bet===T0[7].tier);t('status',ta.status==='đang chơi'&&tb.status==='đang chờ'&&L[1].status==='trống');
t('only host changes bet',E.canChangeBet(ta,'a')&&!E.canChangeBet(ta,'b'));
const full=E.lobbyTables([1,2,3,4,5].map(i=>({uid:'u'+i,table:c1,at:i})))[0];t('max 4 seats',full.count===4&&full.status==='đủ người');
const Q=X.newProfile();Q.xu=50;t('cannot sit full',!E.canSit(full,Q,'z').ok);t('cannot sit poor',!E.canSit(tb,Q,'z').ok);Q.xu=99999;t('can sit',E.canSit(tb,Q,'z').ok);
// cửa hàng mở rộng
t('shop >= 90 items',S.SHOP.length>=90);t('unique ids',new Set(S.SHOP.map(x=>x.id)).size===S.SHOP.length);t('all have rarity',S.SHOP.every(x=>x.r>=1&&x.r<=4));
const dd=S.dailyDeal('2026-10-11');t('daily deal stable & discounted',dd.id===S.dailyDeal('2026-10-11').id&&dd.price<S.shopItem(dd.id).price);
{const R=S.ensureInv(X.newProfile());R.xu=1e6;const b=R.xu;S.buyItem(R,dd.id,99,'2026-10-11');t('buy at deal price',b-R.xu===dd.price);}
t('new types equip',(()=>{const R=S.ensureInv(X.newProfile());R.xu=1e6;S.buyItem(R,'deck_night',99);return S.equipItem(R,'deck_night')&&S.equipped(R,'deck').id==='deck_night'&&S.equipped(R,'fx').id==='fx_confetti';})());
console.log(`pass ${pass} fail ${fail}`);
