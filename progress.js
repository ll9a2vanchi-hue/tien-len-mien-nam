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
function onGameEnd(P,place,instant){const s=P.stats;s.games++;questEvent(P,'game');
 let delta=Math.round(P.bet*(instant?(place===0?3:-1):PLACE_MULT[place]));
 if(place===0){s.wins++;s.streak++;s.bestStreak=Math.max(s.bestStreak,s.streak);questEvent(P,'win');}else s.streak=0;
 if(place<=1)questEvent(P,'top2');if(instant&&place===0)s.instant++;
 P.xu=Math.max(0,P.xu+delta);const lv=addXp(P,XP_PLACE[place]+(instant&&place===0?XP_INSTANT:0));return{delta,badges:checkBadges(P),lv};}

// ---------- Cấp độ / XP / Danh hiệu ----------
const XP_PLACE=[100,60,35,20],XP_CHOP=20,XP_INSTANT=150,XP_QUEST=50;
function xpNeed(l){return 100+50*(l-1);} // XP để lên từ cấp l -> l+1
function levelInfo(xp){xp=Math.max(0,xp||0);let l=1;while(xp>=xpNeed(l)){xp-=xpNeed(l);l++;}return{level:l,cur:xp,need:xpNeed(l)};}
function levelReward(l){return 50*l;}
const TITLES=[
 {id:'tan_thu',name:'Tân Thủ',min:1},{id:'tap_su',name:'Tập Sự',min:3},{id:'tay_choi',name:'Tay Chơi',min:6},{id:'lao_lang',name:'Lão Làng',min:10},
 {id:'cao_thu',name:'Cao Thủ',min:15},{id:'bac_thay',name:'Bậc Thầy',min:22},{id:'than_bai',name:'Thần Bài',min:30},{id:'huyen_thoai',name:'Huyền Thoại',min:40},
 {id:'do_te',name:'Đồ Tể',badge:'chop10'},{id:'vua_toi_trang',name:'Vua Tới Trắng',badge:'instant'},{id:'dai_gia',name:'Đại Gia',badge:'rich'},{id:'bat_bai',name:'Bất Bại',badge:'streak5'},
];
function titleForLevel(l){let t=TITLES[0];for(const x of TITLES)if(x.min&&l>=x.min)t=x;return t;}
function titleUnlocked(P,t){return t.min?levelInfo(P.xp).level>=t.min:!!(P.badges&&P.badges[t.badge]);}
function unlockedTitles(P){return TITLES.filter(t=>titleUnlocked(P,t));}
function currentTitle(P){const t=P.title&&TITLES.find(x=>x.id===P.title);return t&&titleUnlocked(P,t)?t:titleForLevel(levelInfo(P.xp).level);}
function setTitle(P,id){const t=TITLES.find(x=>x.id===id);if(!t||!titleUnlocked(P,t))return false;P.title=id;return true;}
function addXp(P,n){const before=levelInfo(P.xp).level;P.xp=(P.xp||0)+n;const after=levelInfo(P.xp).level;const ups=[];let xu=0;
 for(let l=before+1;l<=after;l++){ups.push(l);xu+=levelReward(l);}P.xu+=xu;
 const newTitles=TITLES.filter(t=>t.min&&t.min>before&&t.min<=after);return{xp:n,ups,xu,newTitles};}
// PROGRESS_END
if(typeof module!=='undefined')module.exports={XP_PLACE,XP_CHOP,XP_INSTANT,XP_QUEST,xpNeed,levelInfo,levelReward,TITLES,titleForLevel,titleUnlocked,unlockedTitles,currentTitle,setTitle,addXp,START_XU,BETS,LOGIN_REWARDS,BADGES,QUEST_POOL,dayKey,newProfile,ensureDaily,questEvent,claimQuest,loginState,claimLogin,canRescue,rescue,checkBadges,onPlay,onGameEnd};
