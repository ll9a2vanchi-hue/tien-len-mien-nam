const X=require('./progress.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const p=X.newProfile();p.stats.wins=10;p.stats.m_poker_wins=3;p.stats.m_xito_wins=2;p.stats.m_3cao_wins=1;p.stats.m_demla_wins=99;
t('total wins counts new modes, not demla twice',X.totalWins(p)===16);
// tuần theo giờ VN: Chủ nhật 23:59 UTC+7 vẫn tuần cũ, Thứ hai 00:00 UTC+7 sang tuần mới
const sun=Date.UTC(2026,9,18,16,59),mon=Date.UTC(2026,9,18,17,0);
t('week key sunday',X.lbWeekKey(sun)==='2026-10-12');t('week resets monday 00:00 VN',X.lbWeekKey(mon)==='2026-10-19');
t('week key stable across tz',X.lbWeekKey(Date.UTC(2026,9,14,3,0))==='2026-10-12');
process.exit(f?1:0);
