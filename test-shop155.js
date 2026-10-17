const S=require('./shop.js'),X=require('./progress.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const cats=['back','felt','deck','bubble','name','fx','emote'];
for(const c of cats){const it=S.SHOP.filter(x=>x.type===c&&x.price>=100000&&x.price<=1000000);t(c+': 3–5 món cao cấp 100k–1M ('+it.length+')',it.length>=3&&it.length<=5);}
t('giá trong khoảng',S.SHOP.filter(x=>x.price>=100000&&['back','felt','deck','bubble','name','fx','emote'].includes(x.type)).every(x=>x.price<=1000000));
t('id không trùng',new Set(S.SHOP.map(x=>x.id)).size===S.SHOP.length);
t('fx cao cấp có mode',S.SHOP.filter(x=>x.type==='fx'&&x.price>=100000).every(x=>['firework','meteor','storm','phoenix'].includes(x.mode)&&x.parts.length));
t('emote cao cấp có hiệu ứng',S.SHOP.filter(x=>x.type==='emote'&&x.price>=100000).every(x=>x.ea&&x.list.length===6));
t('mặt bàn có f 4 màu',S.SHOP.filter(x=>x.type==='felt'&&x.price>=100000).every(x=>x.f&&x.f.length===4));
t('có độ hiếm',S.SHOP.filter(x=>x.price>=100000).every(x=>x.r>=4));
// mua + tính vào Thưởng EXP
const P=S.ensureInv(X.newProfile());P.xu=5e6;const id='back_diamond';const r=S.buyItem(P,id,1,'2026-10-18');t('mua được (xu đủ)',r.ok||S.dailyDeal('2026-10-18').id===id);
t('xu bị trừ đúng giá',P.xu===5e6-S.priceOf(id,'2026-10-18'));
t('tính vào EXP',X.ownedValue(P,false)===1000000&&X.expBreakdown(P).rows[0].pct===1);
t('mua lần 2 bị từ chối',!S.buyItem(P,id,1,'x').ok);
const P2=S.ensureInv(X.newProfile());P2.xu=1;t('không đủ xu',!S.buyItem(P2,'back_aurora',1,'x').ok);
// ưu đãi mỗi ngày vẫn hoạt động và giảm 30%
let seen=false;for(let d=1;d<=60&&!seen;d++){const day='2026-11-'+d;const dl=S.dailyDeal(day),it=S.shopItem(dl.id);if(it.price>=100000){seen=true;t('deal cao cấp giảm 30%',dl.price===Math.round(it.price*0.7/10)*10&&S.priceOf(dl.id,day)===dl.price);}}
t('ưu đãi luôn chọn món có thật',[...Array(30)].every((_,i)=>S.shopItem(S.dailyDeal('2026-12-'+i).id)));
const P3=S.ensureInv(X.newProfile());S.SHOP.filter(x=>x.price>=100000&&x.type!=='avatar').forEach(x=>P3.inv[x.id]=1);t('sở hữu tất cả = >10% EXP',X.expBreakdown(P3).rows[0].pct>10);
process.exit(f?1:0);
