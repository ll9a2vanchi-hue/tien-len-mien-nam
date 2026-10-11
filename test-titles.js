const P=require('./progress.js'),S=require('./shop.js');let f=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL ')+m);if(!c)f++;};
const T=P.TITLES;ok(T.length>=49,'titles '+T.length);ok(new Set(T.map(t=>t.id)).size===T.length,'unique ids');
const p={xp:0,badges:{},stats:{}};ok(P.titleUnlocked(Object.assign({},p,{stats:{giftSent:30}}),T.find(t=>t.id==='phong_luu')),'stat title');
ok(!P.titleUnlocked(p,T.find(t=>t.id==='luoc_su')),'badge locked');ok(P.titleUnlocked({xp:0,badges:{luoc_2:1}},T.find(t=>t.id==='luoc_su')),'badge unlock');
const fr=S.SHOP.filter(x=>x.type==='frame');ok(fr.length>=28,'frames '+fr.length);ok(Math.max(...fr.map(x=>x.price))===500000,'max 500k');
const Q={xu:1e6,badges:{},stats:{}};ok(!S.buyItem(Q,'fr_top',99).ok,'badge frame locked');Q.badges.lb3=1;ok(S.buyItem(Q,'fr_top',99).ok,'badge frame buy');
ok(!S.buyItem({xu:1e6},'fr_cosmos',10).ok,'level lock');process.exit(f?1:0);
