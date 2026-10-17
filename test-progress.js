const X=require('./progress.js');let pass=0,fail=0;const t=(n,v)=>{v?pass++:(fail++,console.log('FAIL',n));};
const d=(s)=>new Date(s);
let P=X.newProfile();t('start xu',P.xu===1000);
t('quests created',X.ensureDaily(P,d('2026-10-10T08:00'))&&P.quests.list.length===3);
t('distinct ev',new Set(P.quests.list.map(q=>X.QUEST_POOL.find(p=>p.id===q.id).ev)).size===3);
const before=JSON.stringify(P.quests);t('same day no reset',!X.ensureDaily(P,d('2026-10-10T23:59'))&&JSON.stringify(P.quests)===before);
t('midnight reset',X.ensureDaily(P,d('2026-10-11T00:00'))&&P.quests.day==='2026-10-11');
P.quests.list=[{id:'play3',prog:0,claimed:false},{id:'chop1',prog:0,claimed:false},{id:'pairs5',prog:0,claimed:false}];
t('cannot claim early',X.claimQuest(P,0)===0);
for(let i=0;i<4;i++)X.onGameEnd(P,1,false);t('progress capped',P.quests.list[0].prog===3);
let xu=P.xu;t('claim',X.claimQuest(P,0)===750&&P.xu===xu+750+P._lastLv.xu);t('no double claim',X.claimQuest(P,0)===0);
X.onPlay(P,{type:'pair',len:2,top:20},null);t('pair quest',P.quests.list[2].prog===1);
// badges
P=X.newProfile();P.bet=100;let r=X.onGameEnd(P,0,false);
t('first game+win badges',r.badges.map(b=>b.id).sort().join()==='first_game,first_win');
t('payout 1st + badge xu + level-up 2 reward',P.xu===1000+200+50+100+100);
r=X.onPlay(P,{type:'quad',len:4,top:40},{type:'single',len:1,top:51});
t('chop: no free bonus (paid by transfer)',r.bonus===0&&P.stats.chops===1);t('chop+quad badges',r.badges.map(b=>b.id).sort().join()==='chop1,quad');
t('no repeat badge',X.onPlay(P,{type:'quad',len:4,top:44},{type:'single',len:1,top:50}).badges.every(b=>b.id!=='quad'));
X.onGameEnd(P,0,false);X.onGameEnd(P,0,false);t('streak3',!!P.badges.streak3);X.onGameEnd(P,3,false);t('streak reset',P.stats.streak===0&&P.stats.bestStreak===3);
P.xu=9990;X.onGameEnd(P,1,false);t('rich badge',!!P.badges.rich);
r=X.onGameEnd(P,0,true);t('instant 3x',r.delta===300&&!!P.badges.instant);
// login
P=X.newProfile();t('login day1',X.claimLogin(P,d('2026-10-10T09:00'))===1000);t('same day',X.claimLogin(P,d('2026-10-10T22:00'))===0);
t('day2',X.claimLogin(P,d('2026-10-11T01:00'))===1500);t('gap resets',X.claimLogin(P,d('2026-10-13T01:00'))===1000&&P.login.streak===1);
for(let i=14;i<=19;i++)X.claimLogin(P,d(`2026-10-${i}T10:00`));t('day7 reward + badge',P.login.streak===7&&!!X.checkBadges(P).length||!!P.badges.login7);
t('wraps to day1',X.loginState(P,d('2026-10-20T10:00')).day===1);
t('month boundary',(()=>{const Q=X.newProfile();X.claimLogin(Q,d('2026-10-31T10:00'));return X.claimLogin(Q,d('2026-11-01T10:00'))===1500;})());
// rescue
P=X.newProfile();P.xu=10;t('rescue',X.rescue(P,d('2026-10-10T10:00'))===500);P.xu=0;t('once per day',X.rescue(P,d('2026-10-10T20:00'))===0);
t('next day ok',X.rescue(P,d('2026-10-11T00:01'))===500);P=X.newProfile();t('not broke',!X.canRescue(P,d('2026-10-10')));
P=X.newProfile();P.xu=50;P.bet=1000;X.onGameEnd(P,3,false);t('xu not negative (0 + first_game badge 50)',P.xu===50);
console.log(`pass ${pass} fail ${fail}`);
