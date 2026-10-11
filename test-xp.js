const X=require('./progress.js'),{mergeSaves}=require('./cloud.js');let pass=0,fail=0;const t=(n,v)=>{v?pass++:(fail++,console.log('FAIL',n));};
t('lv1 at 0',X.levelInfo(0).level===1&&X.levelInfo(0).need===100);t('lv2 at 100',X.levelInfo(100).level===2&&X.levelInfo(100).cur===0&&X.levelInfo(100).need===150);
t('lv2 at 249',X.levelInfo(249).level===2);t('lv3 at 250',X.levelInfo(250).level===3);t('neg xp',X.levelInfo(-5).level===1);
let s=0;for(let l=1;l<10;l++)s+=X.xpNeed(l);t('lv10 cumulative',X.levelInfo(s).level===10&&X.levelInfo(s-1).level===9);
let P=X.newProfile();t('profile xp',P.xp===0&&X.currentTitle(P).name==='Tân Binh Bài Bạc');
let r=X.addXp(P,99);t('no level up',r.ups.length===0&&r.xu===0);r=X.addXp(P,1);t('level up 2',r.ups.join()==='2'&&r.xu===100&&P.xu===1100);
r=X.addXp(P,1000);t('multi level ups',r.ups.length>=3&&r.ups[0]===3);t('reward sum',r.xu===r.ups.reduce((a,l)=>a+50*l,0));
t('new title Tập Sự',r.newTitles.some(x=>x.name==='Tay Mơ Chiếu Bạc'));
P=X.newProfile();const xu0=P.xu;let g=X.onGameEnd(P,0,false);t('game xp 1st',P.xp===100&&g.lv.ups.join()==='2');
P=X.newProfile();X.onGameEnd(P,3,false);t('game xp last',P.xp===20);
P=X.newProfile();P.bet=100;X.onGameEnd(P,0,true);t('instant xp',P.xp===250);
P=X.newProfile();X.onPlay(P,{type:'quad',len:4,top:40},{type:'single',len:1,top:51});t('chop xp',P.xp===20);
X.onPlay(P,{type:'pair',len:2,top:20},null);t('no xp normal play',P.xp===20);
P=X.newProfile();P.quests={day:'x',list:[{id:'win1',prog:1,claimed:false}]};X.claimQuest(P,0);t('quest xp',P.xp===50);
t('titleForLevel',X.titleForLevel(1).name==='Tân Binh Bài Bạc'&&X.titleForLevel(12).name==='Cao Thủ Ẩn Danh'&&X.titleForLevel(99).name==='Độc Cô Cầu Bại'&&X.titleForLevel(11).name==='Hiệp Sĩ Tiến Lên');
P=X.newProfile();t('cannot pick locked',!X.setTitle(P,'cao_thu_an')&&!X.setTitle(P,'do_te_heo')&&!X.setTitle(P,'nope'));
P.xp=5000;t('pick level title',X.setTitle(P,'kiem_khach')&&X.currentTitle(P).name==='Kiếm Khách Sòng Bài');
P.badges.chop10=1;t('badge title',X.setTitle(P,'do_te_heo')&&X.currentTitle(P).name==='Đồ Tể Sát Heo');
delete P.badges.chop10;t('fallback when lost',X.currentTitle(P).min>0);
t('unlocked list',X.unlockedTitles(X.newProfile()).length===1);
// merge: higher XP wins
const mk=(xp,games,xu,upd)=>{const p=X.newProfile();p.xp=xp;p.stats.games=games;p.xu=xu;return{profile:p,scores:{},updatedAt:upd};};
let m=mergeSaves(mk(500,2,111,1),mk(100,50,999,9));t('merge higher xp wins',m.profile.xp===500&&m.profile.xu===111);
m=mergeSaves(mk(100,50,999,9),mk(500,2,111,1));t('merge symmetric',m.profile.xp===500);
const a=mk(300,1,1,1);a.profile.title='tay_mo';m=mergeSaves(a,mk(10,9,1,5));t('merge keeps title',m.profile.title==='tay_mo');
// bàn 2/3/4 người
t('xp 4p first',X.tableXp(4,0)===100&&X.tableXp(4,3)===20);t('xp 2p half',X.tableXp(2,0)===50&&X.tableXp(2,1)===10);t('xp 3p 75%',X.tableXp(3,0)===75&&X.tableXp(3,2)===15);
t('xp instant scaled',X.tableXp(2,0,true)===125);t('xu 2p',X.tableXu(100,2,0)===100&&X.tableXu(100,2,1)===-100);t('xu 3p',X.tableXu(100,3,0)===150&&X.tableXu(100,3,1)===0&&X.tableXu(100,3,2)===-100);
t('xu 4p unchanged',X.tableXu(100,4,0)===200&&X.tableXu(100,4,3)===-100);t('xu instant 3p',X.tableXu(100,3,0,true)===200&&X.tableXu(100,3,1,true)===-100);
{const q=X.newProfile();const x0=q.xu;X.onGameEnd(q,0,false,2);t('onGameEnd 2p xp',q.xp===50&&q.xu>=x0+100);}
{const q=X.newProfile();q.title='cao_thu';t('migrate old title id',X.currentTitle(q).id==='tan_binh'&&q.title==='cao_thu_an');q.title='do_te';X.migrateTitle(q);t('migrate badge title',q.title==='do_te_heo');}
t('titles have tier',X.TITLES.every(x=>x.tier>=1));
console.log(`pass ${pass} fail ${fail}`);
;(()=>{const P=require('./progress.js');const mk=()=>{const p=P.newProfile?P.newProfile():null;return p;};
 if(!P.onGameEnd||!P.newProfile){console.log('skip noXuBonus');return;}
 const a=P.newProfile(),b=P.newProfile();a.bet=b.bet=10000;a.xu=b.xu=100000;
 const ra=P.onGameEnd(a,0,false,4,{bonus:0.5}),rb=P.onGameEnd(b,0,false,4,{bonus:0.5,noXuBonus:true});
 const ok=ra.bxu>0&&rb.bxu===0&&rb.bxp===ra.bxp&&rb.bxp>0&&rb.ledger.bonus===0;console.log(ok?'PASS noXuBonus':'FAIL noXuBonus',ra.bxu,rb.bxu,ra.bxp,rb.bxp);if(!ok)process.exitCode=1;})();
