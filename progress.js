// PROGRESS_START
const START_XU=1000,RESCUE_XU=500,BETS=[50,100,200,500,1000];
const LOGIN_REWARDS=[100,150,200,300,400,600,1000];
const PLACE_MULT=[2,0.5,-0.5,-1];
// Huy hiệu: chuỗi đồng/bạc/vàng (tier 1/2/3) + bí mật (secret). Giữ nguyên id cũ để chuyển tiến độ.
const BG=(id,icon,name,desc,xu,tier,test,o)=>Object.assign({id,icon,name,desc,xu,tier,test},o||{});
const V=(s,k,d=0)=>s[k]!=null?s[k]:d;
const BADGES=[
 BG('first_game','🎴','Nhập môn','Chơi ván đầu tiên',50,1,s=>s.games>=1,{series:'games'}),
 BG('games50','🎲','Chăm chỉ','Chơi 50 ván',500,2,s=>s.games>=50,{series:'games'}),
 BG('games300','🎰','Con nghiện chiếu bạc','Chơi 300 ván',3000,3,s=>s.games>=300,{series:'games'}),
 BG('first_win','🥇','Chiến thắng đầu tiên','Về nhất 1 ván',100,1,s=>s.wins>=1,{series:'wins'}),
 BG('win10','🏆','Cao thủ','Về nhất 10 ván',500,2,s=>s.wins>=10,{series:'wins'}),
 BG('win50','👑','Thần bài','Về nhất 50 ván',2000,3,s=>s.wins>=50,{series:'wins'}),
 BG('win200','💎','Huyền thoại sòng bài','Về nhất 200 ván',8000,3,s=>s.wins>=200,{series:'wins'}),
 BG('streak3','🔥','Chuỗi thắng 3','Thắng 3 ván liên tiếp',300,1,s=>s.bestStreak>=3,{series:'streak'}),
 BG('streak5','⚡','Bất bại','Thắng 5 ván liên tiếp',1000,2,s=>s.bestStreak>=5,{series:'streak'}),
 BG('streak10','🌪️','Không thể cản phá','Thắng 10 ván liên tiếp',5000,3,s=>s.bestStreak>=10,{series:'streak'}),
 BG('chop1','🐷','Chặt heo','Chặt heo (2) lần đầu',200,1,s=>s.chops>=1,{series:'chop'}),
 BG('chop10','🔪','Đồ tể','Chặt heo 10 lần',1000,2,s=>s.chops>=10,{series:'chop'}),
 BG('chop50','🪓','Sát thủ lò mổ','Chặt heo 50 lần',4000,3,s=>s.chops>=50,{series:'chop'}),
 BG('quad','💣','Tứ quý','Đánh ra tứ quý',200,1,s=>s.quads>=1,{series:'bomb'}),
 BG('quad5','🧨','Chuyên gia bom','Đánh 5 tứ quý',1000,2,s=>s.quads>=5,{series:'bomb'}),
 BG('pairseq4','🚂','Tàu hỏa','Đánh 4 đôi thông',500,3,s=>s.pairseq4>=1,{series:'bomb'}),
 BG('earn5k','🪙','Kiếm chác','Thắng tổng 5.000 xu',300,1,s=>V(s,'earned')>=5000,{series:'earn'}),
 BG('earn50k','💵','Làm giàu','Thắng tổng 50.000 xu',2000,2,s=>V(s,'earned')>=50000,{series:'earn'}),
 BG('earn500k','🏦','Tỷ phú bài bạc','Thắng tổng 500.000 xu',10000,3,s=>V(s,'earned')>=500000,{series:'earn'}),
 BG('rich','💰','Đại gia','Có 10.000 xu',1000,1,(s,p)=>p.xu>=10000,{series:'rich'}),
 BG('rich50k','🤑','Phú hộ','Có 50.000 xu',3000,2,(s,p)=>p.xu>=50000,{series:'rich'}),
 BG('rich200k','👛','Trùm tài phiệt','Có 200.000 xu',8000,3,(s,p)=>p.xu>=200000,{series:'rich'}),
 BG('tbl2','⚔️','Tay đôi','Thắng 5 ván bàn 2 người',300,1,s=>V(s,'win2')>=5,{series:'table'}),
 BG('tbl3','🔺','Tam quốc','Thắng 5 ván bàn 3 người',500,2,s=>V(s,'win3')>=5,{series:'table'}),
 BG('tblall','🎯','Toàn năng','Thắng 20 ván ở mỗi loại bàn',3000,3,s=>V(s,'win2')>=20&&V(s,'win3')>=20&&V(s,'win4')>=20,{series:'table'}),
 BG('hard1','🧠','Hạ gục cao nhân','Về trên một máy Khó',300,1,s=>V(s,'beatHard')>=1,{series:'ai'}),
 BG('master1','🥋','Đả bại Cao thủ','Về trên một máy Cao thủ',800,2,s=>V(s,'beatMaster')>=1,{series:'ai'}),
 BG('master25','🐲','Kẻ diệt Cao thủ','Về trên máy Cao thủ 25 lần',5000,3,s=>V(s,'beatMaster')>=25,{series:'ai'}),
 BG('buy1','🛍️','Khách hàng mới','Mua 1 vật phẩm',100,1,s=>V(s,'buys')>=1,{series:'shop'}),
 BG('buy10','🎁','Tín đồ mua sắm','Mua 10 vật phẩm',800,2,s=>V(s,'buys')>=10,{series:'shop'}),
 BG('buy30','🏬','Nhà sưu tầm','Mua 30 vật phẩm',3000,3,s=>V(s,'buys')>=30,{series:'shop'}),
 BG('throw10','🥚','Tay ném','Ném/tặng 10 lần',100,1,s=>V(s,'throws')>=10,{series:'throw'}),
 BG('throw100','🍅','Xạ thủ cà chua','Ném/tặng 100 lần',800,2,s=>V(s,'throws')>=100,{series:'throw'}),
 BG('throw500','🎯','Pháo thủ','Ném/tặng 500 lần',3000,3,s=>V(s,'throws')>=500,{series:'throw'}),
 BG('spin5','🎡','Thử vận may','Quay 5 lần',100,1,s=>V(s,'spins')>=5,{series:'spin'}),
 BG('spin50','🍀','Người may mắn','Quay 50 lần',1000,2,s=>V(s,'spins')>=50,{series:'spin'}),
 BG('login7','📅','Trung thành','Điểm danh 7 ngày liên tiếp',500,2,(s,p)=>p.login.streak>=7,{series:'login'}),
 BG('straight8','🐉','Rồng dài','Đánh sảnh từ 8 lá',300,2,s=>s.longStraight>=8,{series:'combo'}),
 BG('instant','🌟','Tới trắng','Thắng tới trắng',1000,3,s=>s.instant>=1,{series:'combo'}),
 BG('sec_notwo','🙅','Không cần heo','Về nhất mà không đánh con 2 nào',1500,3,s=>V(s,'noTwoWin')>=1,{secret:true}),
 BG('sec_3s','🃏','Cái kết khiêm tốn','Về nhất với lá cuối là 3♠',2000,3,s=>V(s,'last3s')>=1,{secret:true}),
 BG('sec_bigbet','🎲','Liều ăn nhiều','Về nhất ván cược 5.000 xu',2000,3,s=>V(s,'win5k')>=1,{secret:true}),
 BG('sec_comeback','🦅','Lội ngược dòng','Về nhất khi từng còn ≥10 lá lúc đối thủ chỉ còn 2',2500,3,s=>V(s,'comeback')>=1,{secret:true}),
 // ---- v39: +44 huy hiệu
 ...[['thuiGive','🐽','thui','Cho thúi heo',['Bắt thúi','Kẻ đi săn heo','Lò mổ di động'],'Bắt đối thủ thúi heo/hàng',[1,10,50]],
  ['thuiGot','🥀','thui','Thúi heo',['Ôm heo','Thúi quen rồi','Vua thúi heo'],'Bị thúi heo/hàng',[1,10,40]],
  ['chayCause','🔥','chay','Đốt bài',['Đốt bài','Hỏa diệm sơn','Thần lửa'],'Làm đối thủ cháy bài',[1,5,25]],
  ['chayGot','🧯','chay','Cháy bài',['Bị cháy','Cháy thành than','Phượng hoàng tro tàn'],'Bị cháy bài (13 lá)',[1,5,20]],
  ['b3win','♠️','b3','3 bích',['Bích nhỏ có võ','Ba bích thần chưởng','Thánh 3 bích'],'Về nhất bằng 3♠',[1,3,10]],
  ['onlGames','🌐','online','Online',['Lên mạng','Dân chơi online','Cư dân sòng mạng'],'Chơi ván online',[1,25,150]],
  ['onlWins','🏅','online','Thắng online',['Hạ người thật','Cao thủ mạng','Bá chủ online'],'Về nhất ván online',[1,15,80]],
  ['giftSent','💐','social','Tặng quà',['Hào phóng','Mạnh thường quân','Đại gia tặng quà'],'Tặng quà cho người khác',[1,20,100]],
  ['giftGot','🎀','social','Nhận quà',['Được yêu mến','Người được tặng','Ngôi sao sòng bài'],'Nhận quà từ người chơi',[1,10,50]],
  ['dms','💬','social','Nhắn tin',['Bắt chuyện','Hoạt ngôn','Ông hoàng tán gẫu'],'Gửi tin nhắn riêng',[1,50,300]],
  ['friends','🤝','social','Bạn bè',['Có bạn','Hội anh em','Giang hồ rộng'],'Số bạn bè',[1,5,20]],
  ['avOwn','🖼️','collect','Sưu tập avatar',['Thêm gương mặt','Tủ avatar','Bảo tàng avatar'],'Sở hữu avatar',[5,15,35]],
  ['spent','💸','shop','Tiêu xu',['Tiêu vặt','Vung tay','Đốt tiền như rác'],'Tiêu xu ở cửa hàng',[2000,30000,200000]],
  ['spinStreak','🗓️','spin','Quay liên tục',['Quay đều','Tín đồ vòng quay','Không bỏ ngày nào'],'Quay vòng quay nhiều ngày liên tiếp',[3,7,30]],
  ['qDone','📜','quest','Nhiệm vụ',['Làm nhiệm vụ','Siêng năng','Thợ cày nhiệm vụ'],'Hoàn thành nhiệm vụ ngày',[5,50,300]],
  ['qWeek','📆','quest','Nhiệm vụ tuần',['Tuần chăm chỉ','Bền bỉ','Không ngừng nghỉ'],'Hoàn thành nhiệm vụ tuần',[1,10,50]],
  ['play2','2️⃣','table','Bàn 2 người',['Tay đôi tập sự','Song đấu','Kiếm khách'],'Chơi ván bàn 2 người',[5,50,200]],
  ['play3','3️⃣','table','Bàn 3 người',['Ba người một chiếu','Thế chân vạc','Tam anh'],'Chơi ván bàn 3 người',[5,50,200]],
  ['play4','4️⃣','table','Bàn 4 người',['Đủ bốn','Chiếu đông','Tứ hải'],'Chơi ván bàn 4 người',[5,50,200]],
  ['perfect','✨','skill','Ván hoàn hảo',['Không lùi bước','Một mạch','Thần tốc bất bại'],'Về nhất mà không bỏ lượt lần nào',[1,10,50]],
  ['comebacks','🦅','skill','Lội ngược',['Không bỏ cuộc','Phục hận','Vua lội ngược dòng'],'Về nhất khi bị dẫn sâu',[2,10,30]],
  ['night','🦉','misc','Cú đêm',['Thức khuya','Cú đêm','Ma sòng bài'],'Chơi ván từ 0h đến 4h sáng',[1,20,100]],
  ].flatMap(([k,ic,ser,_n,names,desc,goals])=>goals.map((g,i)=>BG(k+'_'+(i+1),ic,names[i],desc+' '+g.toLocaleString('vi-VN')+(k==='spent'?' xu':k==='spinStreak'?' ngày':' lần'),[200,1000,4000][i],i+1,s=>V(s,k)>=g,{series:ser,k,goal:g}))),
 BG('legend_av','🐉','Chủ nhân huyền thoại','Sở hữu một avatar Huyền thoại',3000,3,s=>V(s,'avLegend')>=1,{series:'collect',k:'avLegend',goal:1}),
 BG('lb10','📈','Top 10','Lọt top 10 bảng xếp hạng',2000,2,s=>V(s,'lbBest',999)<=10,{series:'online'}),
 BG('lb3','🏆','Bục vinh quang','Lọt top 3 bảng xếp hạng',6000,3,s=>V(s,'lbBest',999)<=3,{series:'online'}),
 BG('luoc_1','🍲','Luộc máy','Luộc sạch 1 máy',300,1,s=>V(s,'luoc')>=1,{series:'luoc',k:'luoc',goal:1}),
 BG('luoc_2','🥘','Bếp trưởng','Luộc sạch 10 máy',1500,2,s=>V(s,'luoc')>=10,{series:'luoc',k:'luoc',goal:10}),
 BG('luoc_3','♨️','Lò luộc','Luộc sạch 50 máy',5000,3,s=>V(s,'luoc')>=50,{series:'luoc',k:'luoc',goal:50}),
 BG('luoc_4','🌋','Luộc huyền thoại','Luộc sạch 200 máy',15000,3,s=>V(s,'luoc')>=200,{series:'luoc',k:'luoc',goal:200,legend:true}),
 BG('luoc_m','🥋','Luộc Cao thủ','Luộc sạch một máy Cao thủ',3000,3,s=>V(s,'luoc3')>=1,{series:'luoc',k:'luoc3',goal:1}),
 BG('sec_luoc3','🍜','Nồi lẩu thập cẩm','Luộc 3 máy trong cùng một bàn',5000,3,s=>V(s,'luocTable')>=3,{secret:true}),
 BG('sec_chain','⛓️','Chặt chồng','Chặt ngược lại người vừa chặt mình',2500,3,s=>V(s,'chain')>=1,{secret:true}),
 BG('sec_allin','🎲','Tất tay','Thắng ván khi số xu chỉ vừa đủ cược',2500,3,s=>V(s,'allin')>=1,{secret:true}),
 BG('sec_bigthui','🐖','Cả đàn heo','Bắt thúi 3 con heo trong một ván',3000,3,s=>V(s,'bigThui')>=1,{secret:true}),
];
const BADGE_TIER=[null,{name:'Đồng',col:'#cd7f32'},{name:'Bạc',col:'#c0c8d0'},{name:'Vàng',col:'#ffd84d'}];
// Nhiệm vụ: 3 hằng ngày + 3 hằng tuần (thưởng lớn). Giữ id cũ.
const Q=(id,name,ev,goal,xu)=>({id,name,ev,goal,xu});
const QUEST_POOL=[
 Q('play3','Chơi 3 ván','game',3,150),Q('play5','Chơi 5 ván','game',5,250),Q('win1','Về nhất 1 ván','win',1,200),Q('win2','Về nhất 2 ván','win',2,400),
 Q('luoc1','Luộc sạch 1 máy','luoc',1,400),Q('top2','Về nhất hoặc nhì 3 ván','top2',3,300),Q('pairs5','Đánh 5 đôi','pair',5,150),Q('triple2','Đánh 2 sám cô','triple',2,200),Q('straight3','Đánh 3 sảnh','straight',3,200),
 Q('two3','Đánh ra 3 con heo (2)','two',3,200),Q('chop1','Chặt 1 heo','chop',1,400),
 Q('pairs10','Đánh 10 đôi','pair',10,300),Q('straight5l','Đánh 1 sảnh từ 5 lá','straight5',1,250),Q('pairseq1','Đánh 1 đôi thông','pairseq',1,350),
 Q('quad1','Đánh 1 tứ quý','quad',1,500),Q('win2p','Thắng 1 ván bàn 2 người','win2',1,200),Q('win3p','Thắng 1 ván bàn 3 người','win3',1,250),Q('win4p','Thắng 1 ván bàn 4 người','win4',1,300),
 Q('beathard1','Về trên 1 máy Khó','beatHard',1,300),Q('egg3','Ném 3 quả trứng','egg',3,100),Q('gift2','Tặng hoa/quà 2 lần','gift',2,120),Q('throw5','Ném/tặng 5 lần','throw',5,150),
 Q('spin1','Quay vòng may mắn 1 lần','spin',1,100),Q('emote3','Gửi 3 biểu cảm','emote',3,100),Q('buy1q','Mua 1 vật phẩm','buy',1,200),Q('bet500','Thắng 1 ván cược từ 500','winbet500',1,400),
 Q('notlast3','Không về bét 3 ván','notlast',3,250),Q('lead5','Cầm cái mở 5 vòng','lead',5,150),Q('single10','Đánh 10 lá lẻ','single',10,120),Q('play8','Chơi 8 ván','game',8,450),Q('online1','Chơi 1 ván online','online',1,400),
];
const WEEKLY_POOL=[
 Q('w_win15','Về nhất 15 ván','win',15,3000),Q('w_play40','Chơi 40 ván','game',40,2500),Q('w_master','Hạ 1 máy Cao thủ','beatMaster',1,2000),Q('w_master5','Về trên máy Cao thủ 5 lần','beatMaster',5,5000),
 Q('w_luoc5','Luộc sạch 5 máy','luoc',5,4000),Q('w_chop2p','Chặt heo ở bàn 2 người','chop2',1,1500),Q('w_egg5','Ném 5 quả trứng','egg',5,800),Q('w_spin3','Quay vòng may mắn 3 lần','spin',3,1000),Q('w_bet5k','Thắng 1 ván cược 5.000','winbet5k',1,6000),
 Q('w_chop5','Chặt heo 5 lần','chop',5,2500),Q('w_quad3','Đánh 3 tứ quý','quad',3,3000),Q('w_online5','Chơi 5 ván online','online',5,3000),Q('w_buy3','Mua 3 vật phẩm','buy',3,1500),
];
// Tên người chơi: 2-16 ký tự, có dấu tiếng Việt, lọc từ tục cơ bản
const BAD_WORDS=['dit','du ma','dm','dmm','dcm','vcl','vkl','lon','cac','buoi','deo','dji','di me','cave','fuck','shit','bitch','dick','pussy','cunt','nigger','sex','porn'];
function foldVi(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();}
function validName(raw){const n=String(raw||'').replace(/\s+/g,' ').trim();const L=[...n].length;
 if(L<2)return{ok:false,err:'Tên phải có ít nhất 2 ký tự'};if(L>16)return{ok:false,err:'Tên tối đa 16 ký tự'};
 if(!/^[\p{L}\p{N} ._\-]+$/u.test(n))return{ok:false,err:'Chỉ dùng chữ, số, khoảng trắng và . _ -'};
 const f=foldVi(n),words=f.split(/[^a-z0-9]+/).filter(Boolean),joined=words.join('');
 for(const b of BAD_WORDS){const bw=b.split(' ');if(bw.length>1){if(f.replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').includes(b)||joined.includes(bw.join('')))return{ok:false,err:'Tên chứa từ không phù hợp'};}
  else if(words.includes(b)||(b.length>=4&&joined.includes(b)))return{ok:false,err:'Tên chứa từ không phù hợp'};}
 return{ok:true,name:n};}
function dayKey(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dayDiff(a,b){const p=k=>{const[y,m,d]=k.split('-').map(Number);return Date.UTC(y,m-1,d)/864e5;};return p(b)-p(a);}
function newProfile(){return{xu:START_XU,bet:100,rescueDay:null,login:{last:null,streak:0},badges:{},
 xp:0,title:null,stats:{games:0,wins:0,streak:0,bestStreak:0,chops:0,quads:0,pairseq4:0,longStraight:0,instant:0},quests:{day:null,list:[]}};}
function weekKey(d){d=new Date(d||new Date());const w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);return dayKey(d);}
function pickQuests(pool,rng){pool=pool.slice();const list=[];while(list.length<3&&pool.length){const q=pool.splice(Math.floor(rng()*pool.length),1)[0];if(list.some(x=>questDef(x.id).ev===q.ev))continue;list.push({id:q.id,prog:0,claimed:false});}return list;}
function ensureDaily(P,now,rng){rng=rng||Math.random;const k=dayKey(now),wk=weekKey(now);let ch=false;
 if(P.quests.day!==k){P.quests={day:k,list:pickQuests(QUEST_POOL,rng),week:P.quests.week};ch=true;}
 if(!P.quests.week||P.quests.week.key!==wk){P.quests.week={key:wk,list:pickQuests(WEEKLY_POOL,rng)};ch=true;}return ch;}
function questDef(id){return QUEST_POOL.find(q=>q.id===id)||WEEKLY_POOL.find(q=>q.id===id)||{goal:1,xu:0,ev:'?',name:id};}
function questEvent(P,ev,n){const all=P.quests.list.concat(P.quests.week?P.quests.week.list:[]);all.forEach(q=>{const d=questDef(q.id);if(d.ev===ev)q.prog=Math.min(d.goal,q.prog+(n||1));});}
function claimQuest(P,i,weekly){const q=(weekly?(P.quests.week||{list:[]}).list:P.quests.list)[i],d=q&&questDef(q.id);if(!q||q.claimed||q.prog<d.goal)return 0;q.claimed=true;P.xu+=d.xu;P._lastLv=addXp(P,weekly?XP_QUEST*4:XP_QUEST);return d.xu;}
function loginState(P,now){const k=dayKey(now),l=P.login;if(l.last===k)return{canClaim:false,day:l.streak};
 const next=(l.last&&dayDiff(l.last,k)===1)?(l.streak%7)+1:1;return{canClaim:true,day:next,reward:LOGIN_REWARDS[next-1]};}
function claimLogin(P,now){const s=loginState(P,now);if(!s.canClaim)return 0;P.login={last:dayKey(now),streak:s.day};P.xu+=s.reward;return s.reward;}
function canRescue(P,now){return P.xu<BETS[0]&&P.rescueDay!==dayKey(now);}
function rescue(P,now){if(!canRescue(P,now))return 0;P.rescueDay=dayKey(now);P.xu+=RESCUE_XU;return RESCUE_XU;}
function checkBadges(P){const out=[];let again=true;while(again){again=false;
 for(const b of BADGES)if(!P.badges[b.id]&&b.test(P.stats,P)){P.badges[b.id]=Date.now();P.xu+=b.xu;out.push(b);again=true;}}return out;}
// human played a combo; prev = combo on table before (or null)
function onPlay(P,info,prev){const s=P.stats;
 if(info.type==='pair')questEvent(P,'pair');if(info.type==='single')questEvent(P,'single');if(info.type==='pairseq')questEvent(P,'pairseq');if(info.type==='quad')questEvent(P,'quad');if(info.type==='straight'&&info.len>=5)questEvent(P,'straight5');if(!prev)questEvent(P,'lead');if(info.type==='triple')questEvent(P,'triple');if(info.type==='straight'){questEvent(P,'straight');s.longStraight=Math.max(s.longStraight,info.len);}
 if(info.type==='quad')s.quads++;if(info.type==='pairseq'&&info.len>=4)s.pairseq4++;
 if((info.top>>2)===12&&(info.type==='single'||info.type==='pair'||info.type==='triple'))questEvent(P,'two',info.len);
 let bonus=0;if(prev&&(prev.top>>2)===12&&info.type!==prev.type){s.chops++;questEvent(P,'chop');if(P._tbl===2)questEvent(P,'chop2');}
 const lv=prev&&(prev.top>>2)===12&&info.type!==prev.type?addXp(P,XP_CHOP):null;
 return{bonus,badges:checkBadges(P),lv};}
// place: 0..3, instant: human won tới trắng
// Bàn n người: hệ số XP và xu theo số người
const TABLE_XP={2:0.5,3:0.75,4:1};
const PLACE_XU={2:[1,-1],3:[1.5,0,-1],4:PLACE_MULT};
const XP_PLACE_N={2:[100,20],3:[100,50,20],4:[100,60,35,20]};
function tableXp(n,place,instant){n=XP_PLACE_N[n]?n:4;return Math.round(((XP_PLACE_N[n][place]||20)+(instant&&place===0?XP_INSTANT:0))*TABLE_XP[n]);}
function tableXu(bet,n,place,instant){n=PLACE_XU[n]?n:4;return Math.round(bet*(instant?(place===0?n-1:-1):(PLACE_XU[n][place]==null?-1:PLACE_XU[n][place])));}
// ctx: {bonus:% thưởng vì về trên máy khó, beatHard, beatMaster, usedTwo, last3s, comeback, online}
function onGameEnd(P,place,instant,n,ctx){n=n||4;ctx=ctx||{};const s=P.stats;s.games++;questEvent(P,'game');if(ctx.online)questEvent(P,'online');
 let delta=tableXu(P.bet,n,place,instant);const bonus=Math.max(0,ctx.bonus||0);let bxu=0;if(delta>0&&bonus&&!ctx.noXuBonus){bxu=Math.round(delta*bonus);delta+=bxu;}
 if(place===0){s.wins++;s.streak++;s.bestStreak=Math.max(s.bestStreak,s.streak);questEvent(P,'win');s['win'+n]=(s['win'+n]||0)+1;questEvent(P,'win'+n);
  if(P.bet>=500)questEvent(P,'winbet500');if(P.bet>=5000){questEvent(P,'winbet5k');s.win5k=(s.win5k||0)+1;}
  if(ctx.usedTwo===false&&!instant)s.noTwoWin=(s.noTwoWin||0)+1;if(ctx.last3s)s.last3s=(s.last3s||0)+1;if(ctx.comeback)s.comeback=(s.comeback||0)+1;}else s.streak=0;
 if(place<n-1)questEvent(P,'notlast');
 if(ctx.beatHard){s.beatHard=(s.beatHard||0)+ctx.beatHard;questEvent(P,'beatHard',ctx.beatHard);}if(ctx.beatMaster){s.beatMaster=(s.beatMaster||0)+ctx.beatMaster;questEvent(P,'beatMaster',ctx.beatMaster);}
 if(place<=1)questEvent(P,'top2');if(instant&&place===0)s.instant++;if(delta>0)s.earned=(s.earned||0)+delta;
 const xp0=tableXp(n,place,instant),bxp=Math.round(xp0*bonus);
 const x0=P.xu;P.xu=Math.max(0,P.xu+delta);const paid=P.xu-x0,x1=P.xu;const lv=addXp(P,xp0+bxp);const x2=P.xu;const badges=checkBadges(P);
 const ledger={place:paid-(delta>0?bxu:0),bonus:delta>0?bxu:0,level:x2-x1,badges:P.xu-x2};return{delta,bxu,bxp,bonus,badges,lv,ledger};}
// sổ xu ván: parts {place,bonus,chop,thui,chay,b3,level,badges,exit,misc}
const LEDGER_LABELS=[['place','Thứ hạng'],['chop','Tiền chặt heo'],['thui','Thúi heo/hàng'],['chay','Cháy bài'],['b3','3 bích về nhất'],['bonus','Thưởng thắng máy khó'],['badges','Thưởng huy hiệu'],['level','Thưởng lên cấp'],['luoc','Luộc máy'],['exit','Phạt rời bàn'],['misc','Khác (ném đồ, quà…)']];
function ledgerItems(parts){const items=LEDGER_LABELS.map(([k,l])=>({k,l,v:Math.round(parts[k]||0)})).filter(x=>x.v);return{items,total:items.reduce((a,x)=>a+x.v,0)};}

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
if(typeof module!=='undefined')module.exports={ledgerItems,LEDGER_LABELS,validName,WEEKLY_POOL,BADGE_TIER,weekKey,questDef,TABLE_XP,PLACE_XU,XP_PLACE_N,tableXp,tableXu,TITLE_MIGRATE,migrateTitle,XP_PLACE,XP_CHOP,XP_INSTANT,XP_QUEST,xpNeed,levelInfo,levelReward,TITLES,titleForLevel,titleUnlocked,unlockedTitles,currentTitle,setTitle,addXp,START_XU,BETS,LOGIN_REWARDS,BADGES,QUEST_POOL,dayKey,newProfile,ensureDaily,questEvent,claimQuest,loginState,claimLogin,canRescue,rescue,checkBadges,onPlay,onGameEnd};
