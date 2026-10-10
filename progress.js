// PROGRESS_START
const START_XU=1000,RESCUE_XU=500,BETS=[50,100,200,500,1000];
const LOGIN_REWARDS=[100,150,200,300,400,600,1000];
const PLACE_MULT=[2,0.5,-0.5,-1];
const BADGES=[
 {id:'first_game',icon:'🎴',name:'Nhập môn',desc:'Chơi ván đầu tiên',xu:50,test:s=>s.games>=1},
 {id:'first_win',icon:'🥇',name:'Chiến thắng đầu tiên',desc:'Về nhất 1 ván',xu:100,test:s=>s.wins>=1},
 {id:'win10',icon:'🏆',name:'Cao thủ',desc:'Về nhất 10 ván',xu:500,test:s=>s.wins>=10},
 {id:'win50',icon:'👑',name:'Thần bài',desc:'Về nhất 50 ván',xu:2000,test:s=>s.wins>=50},
 {id:'games50',icon:'🎲',name:'Chăm chỉ',desc:'Chơi 50 ván',xu:500,test:s=>s.games>=50},
 {id:'streak3',icon:'🔥',name:'Chuỗi thắng 3',desc:'Thắng 3 ván liên tiếp',xu:300,test:s=>s.bestStreak>=3},
 {id:'streak5',icon:'⚡',name:'Bất bại',desc:'Thắng 5 ván liên tiếp',xu:1000,test:s=>s.bestStreak>=5},
 {id:'chop1',icon:'🐷',name:'Chặt heo',desc:'Chặt heo (2) lần đầu',xu:200,test:s=>s.chops>=1},
 {id:'chop10',icon:'🔪',name:'Đồ tể',desc:'Chặt heo 10 lần',xu:1000,test:s=>s.chops>=10},
 {id:'quad',icon:'💣',name:'Tứ quý',desc:'Đánh ra tứ quý',xu:200,test:s=>s.quads>=1},
 {id:'pairseq4',icon:'🚂',name:'Tàu hỏa',desc:'Đánh 4 đôi thông',xu:500,test:s=>s.pairseq4>=1},
 {id:'straight8',icon:'🐉',name:'Rồng dài',desc:'Đánh sảnh từ 8 lá',xu:300,test:s=>s.longStraight>=8},
 {id:'instant',icon:'🌟',name:'Tới trắng',desc:'Thắng tới trắng',xu:1000,test:s=>s.instant>=1},
 {id:'rich',icon:'💰',name:'Đại gia',desc:'Có 10.000 xu',xu:1000,test:(s,p)=>p.xu>=10000},
 {id:'login7',icon:'📅',name:'Trung thành',desc:'Điểm danh 7 ngày liên tiếp',xu:500,test:(s,p)=>p.login.streak>=7},
];
const QUEST_POOL=[
 {id:'play3',name:'Chơi 3 ván',ev:'game',goal:3,xu:150},
 {id:'play5',name:'Chơi 5 ván',ev:'game',goal:5,xu:250},
 {id:'win1',name:'Về nhất 1 ván',ev:'win',goal:1,xu:200},
 {id:'win2',name:'Về nhất 2 ván',ev:'win',goal:2,xu:400},
 {id:'top2',name:'Về nhất hoặc nhì 3 ván',ev:'top2',goal:3,xu:300},
 {id:'pairs5',name:'Đánh 5 đôi',ev:'pair',goal:5,xu:150},
 {id:'triple2',name:'Đánh 2 sám cô',ev:'triple',goal:2,xu:200},
 {id:'straight3',name:'Đánh 3 sảnh',ev:'straight',goal:3,xu:200},
 {id:'two3',name:'Đánh ra 3 con heo (2)',ev:'two',goal:3,xu:200},
 {id:'chop1',name:'Chặt 1 heo',ev:'chop',goal:1,xu:400},
];
function dayKey(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dayDiff(a,b){const p=k=>{const[y,m,d]=k.split('-').map(Number);return Date.UTC(y,m-1,d)/864e5;};return p(b)-p(a);}
function newProfile(){return{xu:START_XU,bet:100,rescueDay:null,login:{last:null,streak:0},badges:{},
 xp:0,title:null,stats:{games:0,wins:0,streak:0,bestStreak:0,chops:0,quads:0,pairseq4:0,longStraight:0,instant:0},quests:{day:null,list:[]}};}
function ensureDaily(P,now,rng){rng=rng||Math.random;const k=dayKey(now);
 if(P.quests.day!==k){const pool=QUEST_POOL.slice(),list=[];
  while(list.length<3){const q=pool.splice(Math.floor(rng()*pool.length),1)[0];if(list.some(x=>questDef(x.id).ev===q.ev))continue;list.push({id:q.id,prog:0,claimed:false});}
  P.quests={day:k,list};return true;}return false;}
function questDef(id){return QUEST_POOL.find(q=>q.id===id);}
function questEvent(P,ev,n){P.quests.list.forEach(q=>{const d=questDef(q.id);if(d.ev===ev)q.prog=Math.min(d.goal,q.prog+(n||1));});}
function claimQuest(P,i){const q=P.quests.list[i],d=q&&questDef(q.id);if(!q||q.claimed||q.prog<d.goal)return 0;q.claimed=true;P.xu+=d.xu;P._lastLv=addXp(P,XP_QUEST);return d.xu;}
function loginState(P,now){const k=dayKey(now),l=P.login;if(l.last===k)return{canClaim:false,day:l.streak};
 const next=(l.last&&dayDiff(l.last,k)===1)?(l.streak%7)+1:1;return{canClaim:true,day:next,reward:LOGIN_REWARDS[next-1]};}
function claimLogin(P,now){const s=loginState(P,now);if(!s.canClaim)return 0;P.login={last:dayKey(now),streak:s.day};P.xu+=s.reward;return s.reward;}
function canRescue(P,now){return P.xu<BETS[0]&&P.rescueDay!==dayKey(now);}
function rescue(P,now){if(!canRescue(P,now))return 0;P.rescueDay=dayKey(now);P.xu+=RESCUE_XU;return RESCUE_XU;}
function checkBadges(P){const out=[];let again=true;while(again){again=false;
 for(const b of BADGES)if(!P.badges[b.id]&&b.test(P.stats,P)){P.badges[b.id]=Date.now();P.xu+=b.xu;out.push(b);again=true;}}return out;}
// human played a combo; prev = combo on table before (or null)
function onPlay(P,info,prev){const s=P.stats;
 if(info.type==='pair')questEvent(P,'pair');if(info.type==='triple')questEvent(P,'triple');if(info.type==='straight'){questEvent(P,'straight');s.longStraight=Math.max(s.longStraight,info.len);}
 if(info.type==='quad')s.quads++;if(info.type==='pairseq'&&info.len>=4)s.pairseq4++;
 if((info.top>>2)===12&&(info.type==='single'||info.type==='pair'||info.type==='triple'))questEvent(P,'two',info.len);
 let bonus=0;if(prev&&(prev.top>>2)===12&&info.type!==prev.type){s.chops++;questEvent(P,'chop');bonus=Math.round(P.bet*0.5*(prev.type==='pair'?2:1));P.xu+=bonus;}
 const lv=prev&&(prev.top>>2)===12&&info.type!==prev.type?addXp(P,XP_CHOP):null;
 return{bonus,badges:checkBadges(P),lv};}
// place: 0..3, instant: human won tới trắng
// Bàn n người: hệ số XP và xu theo số người
const TABLE_XP={2:0.5,3:0.75,4:1};
const PLACE_XU={2:[1,-1],3:[1.5,0,-1],4:PLACE_MULT};
const XP_PLACE_N={2:[100,20],3:[100,50,20],4:[100,60,35,20]};
function tableXp(n,place,instant){n=XP_PLACE_N[n]?n:4;return Math.round(((XP_PLACE_N[n][place]||20)+(instant&&place===0?XP_INSTANT:0))*TABLE_XP[n]);}
function tableXu(bet,n,place,instant){n=PLACE_XU[n]?n:4;return Math.round(bet*(instant?(place===0?n-1:-1):(PLACE_XU[n][place]==null?-1:PLACE_XU[n][place])));}
function onGameEnd(P,place,instant,n){n=n||4;const s=P.stats;s.games++;questEvent(P,'game');
 let delta=tableXu(P.bet,n,place,instant);
 if(place===0){s.wins++;s.streak++;s.bestStreak=Math.max(s.bestStreak,s.streak);questEvent(P,'win');}else s.streak=0;
 if(place<=1)questEvent(P,'top2');if(instant&&place===0)s.instant++;
 P.xu=Math.max(0,P.xu+delta);const lv=addXp(P,tableXp(n,place,instant));return{delta,badges:checkBadges(P),lv};}

// ---------- Cấp độ / XP / Danh hiệu ----------
const XP_PLACE=[100,60,35,20],XP_CHOP=20,XP_INSTANT=150,XP_QUEST=50;
function xpNeed(l){return 100+50*(l-1);} // XP để lên từ cấp l -> l+1
function levelInfo(xp){xp=Math.max(0,xp||0);let l=1;while(xp>=xpNeed(l)){xp-=xpNeed(l);l++;}return{level:l,cur:xp,need:xpNeed(l)};}
function levelReward(l){return 50*l;}
const TITLES=[
 {id:'tan_binh',name:'Tân Binh Bài Bạc',min:1,tier:1},{id:'tay_mo',name:'Tay Mơ Chiếu Bạc',min:3,tier:1},
 {id:'kiem_khach',name:'Kiếm Khách Sòng Bài',min:5,tier:2},{id:'hiep_si',name:'Hiệp Sĩ Tiến Lên',min:8,tier:2},
 {id:'cao_thu_an',name:'Cao Thủ Ẩn Danh',min:12,tier:3},{id:'dai_su',name:'Đại Sư Chiếu Bạc',min:16,tier:3},
 {id:'do_hiep',name:'Đổ Hiệp',min:20,tier:4},{id:'do_thanh',name:'Đổ Thánh',min:25,tier:4},
 {id:'than_bai_vd',name:'Thần Bài Vô Địch',min:30,tier:5},{id:'chi_ton',name:'Chí Tôn Bài Thủ',min:36,tier:5},
 {id:'ba_chu',name:'Bá Chủ Sòng Bài',min:43,tier:6},{id:'long_vuong',name:'Long Vương',min:50,tier:6},
 {id:'doc_co',name:'Độc Cô Cầu Bại',min:60,tier:7},
 {id:'do_te_heo',name:'Đồ Tể Sát Heo',badge:'chop10',tier:5},{id:'thien_menh',name:'Thiên Mệnh Tới Trắng',badge:'instant',tier:6},
 {id:'phu_ho',name:'Phú Hộ Kim Tiền',badge:'rich',tier:5},{id:'bat_bai_ct',name:'Bất Bại Chiến Thần',badge:'streak5',tier:6},
];
const TITLE_MIGRATE={tan_thu:'tan_binh',tap_su:'tay_mo',tay_choi:'kiem_khach',lao_lang:'hiep_si',cao_thu:'cao_thu_an',bac_thay:'dai_su',than_bai:'than_bai_vd',huyen_thoai:'chi_ton',do_te:'do_te_heo',vua_toi_trang:'thien_menh',dai_gia:'phu_ho',bat_bai:'bat_bai_ct'};
function migrateTitle(P){if(P&&P.title&&TITLE_MIGRATE[P.title])P.title=TITLE_MIGRATE[P.title];return P;}
function titleForLevel(l){let t=TITLES[0];for(const x of TITLES)if(x.min&&l>=x.min)t=x;return t;}
function titleUnlocked(P,t){return t.min?levelInfo(P.xp).level>=t.min:!!(P.badges&&P.badges[t.badge]);}
function unlockedTitles(P){return TITLES.filter(t=>titleUnlocked(P,t));}
function currentTitle(P){migrateTitle(P);const t=P.title&&TITLES.find(x=>x.id===P.title);return t&&titleUnlocked(P,t)?t:titleForLevel(levelInfo(P.xp).level);}
function setTitle(P,id){const t=TITLES.find(x=>x.id===id);if(!t||!titleUnlocked(P,t))return false;P.title=id;return true;}
function addXp(P,n){const before=levelInfo(P.xp).level;P.xp=(P.xp||0)+n;const after=levelInfo(P.xp).level;const ups=[];let xu=0;
 for(let l=before+1;l<=after;l++){ups.push(l);xu+=levelReward(l);}P.xu+=xu;
 const newTitles=TITLES.filter(t=>t.min&&t.min>before&&t.min<=after);return{xp:n,ups,xu,newTitles};}
// PROGRESS_END
if(typeof module!=='undefined')module.exports={TABLE_XP,PLACE_XU,XP_PLACE_N,tableXp,tableXu,TITLE_MIGRATE,migrateTitle,XP_PLACE,XP_CHOP,XP_INSTANT,XP_QUEST,xpNeed,levelInfo,levelReward,TITLES,titleForLevel,titleUnlocked,unlockedTitles,currentTitle,setTitle,addXp,START_XU,BETS,LOGIN_REWARDS,BADGES,QUEST_POOL,dayKey,newProfile,ensureDaily,questEvent,claimQuest,loginState,claimLogin,canRescue,rescue,checkBadges,onPlay,onGameEnd};
