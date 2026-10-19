const X=require('./progress.js'),S=require('./shop.js'),E=require('./extras.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const mk=()=>S.ensureInv(X.newProfile());
let p=mk();let B=X.expBreakdown(p);t('mới chơi: thưởng 0',B.total===0&&B.rows.length===6);
// shop value: 1.000.000 xu = +1%
const SH=S.SHOP.filter(x=>x.type!=='avatar'&&x.price>0),AV=S.SHOP.filter(x=>x.type==='avatar'&&x.price>0);
p=mk();SH.forEach(x=>p.inv[x.id]=1);const sv=SH.reduce((a,x)=>a+x.price,0);t('shop value +% = giá/1e6',Math.abs(X.expBreakdown(p).rows[0].pct-Math.round(sv/1e4)/100)<1e-9);
p=mk();AV.forEach(x=>p.inv[x.id]=1);const av=AV.reduce((a,x)=>a+x.price,0);t('avatar value +% = giá/1e6',Math.abs(X.expBreakdown(p).rows[1].pct-Math.round(av/1e4)/100)<1e-9);
t('avatar không tính vào vật phẩm',X.ownedValue(p,false)===0);
// fake bigger items to hit exact 1M
const fake={id:'zz1',type:'back',name:'z',price:1000000};S.SHOP.push(fake);p=mk();p.inv.zz1=1;t('1.000.000 xu vật phẩm = +1%',X.expBreakdown(p).rows[0].pct===1);
const fa={id:'zz2',type:'avatar',name:'z',emo:'x',price:2000000};S.SHOP.push(fa);p=mk();p.inv.zz2=1;t('2.000.000 xu avatar = +2%',X.expBreakdown(p).rows[1].pct===2);
p=mk();p.stats.earned=3000000;t('3.000.000 xu thắng = +3%',X.expBreakdown(p).rows[2].pct===3);p=mk();p.stats.earned=300000;t('300.000 xu thắng = +0,3%',X.expBreakdown(p).rows[2].pct===0.3);
p=mk();p.badges=Object.fromEntries(X.BADGES.slice(0,4).map(b=>[b.id,1]));t('mỗi huy hiệu +0,05%',X.expBreakdown(p).rows[3].pct===0.2);
// trần 300%
p=mk();p.stats.earned=1e10;B=X.expBreakdown(p);t('trần +300%',B.total===300&&B.capped&&B.raw>300&&X.expBonus(p)===300);
p=mk();p.stats.earned=1e10;const a=X.addXp(p,100);t('addXp nhân theo thưởng (chạm trần ×4)',p._lastXp===400);
p=mk();p.stats.earned=5000000;X.addXp(p,100);t('addXp +5% => 105',p._lastXp===105);
// kinh tế
t('quest ×5',X.questDef('play3').xu===750&&X.questDef('chop1').xu===2000&&X.questDef('w_win15').xu===15000);
t('login ×10',X.LOGIN_REWARDS?X.LOGIN_REWARDS.join()==='1000,1500,2000,3000,4000,6000,10000':true);
t('spin cost ×10',E.SPIN_COST===2000);
t('spin rewards ×10',E.SPIN_PRIZES.find(x=>x.id==='x50').xu===500&&E.SPIN_PRIZES.find(x=>x.id==='x2000').xu===20000&&E.SPIN_PRIZES.find(x=>x.id==='x2000').label==='20K xu');
// tỉ lệ giữ nguyên
t('tỉ lệ vòng quay giữ nguyên',E.SPIN_PRIZES.map(x=>x.w).join()==='22,20,16,12,10,8,7,4,3,1');
const P2=mk(),d=new Date(2026,9,18);const lg=X.loginState(P2,d);t('đăng nhập ngày 1 = 1000',lg.reward===1000&&X.claimLogin(P2,d)===1000);
process.exit(f?1:0);
