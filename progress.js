// PROGRESS_START
const START_XU=1000,RESCUE_XU=500,BETS=[50,100,200,500,1000];
const LOGIN_REWARDS=[1000,1500,2000,3000,4000,6000,10000]; // v1.54: ×10
const QUEST_XU_MULT=5; // v1.54: thưởng xu nhiệm vụ ×5
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
 BG('demla_1','🔢','Tay đếm lá','Về nhất 1 ván Đếm lá',200,1,s=>V(s,'demlaWin')>=1,{series:'games',k:'demlaWin',goal:1}),
 BG('demla_2','🧮','Thần đếm lá','Về nhất 20 ván Đếm lá',1500,2,s=>V(s,'demlaWin')>=20,{series:'games',k:'demlaWin',goal:20}),
 BG('demla_3','📟','Máy tính sống','Về nhất 100 ván Đếm lá',5000,3,s=>V(s,'demlaWin')>=100,{series:'games',k:'demlaWin',goal:100}),
 BG('bc_1','🃏','Dân chơi 3 cào','Thắng 1 ván 3 Cào',200,1,s=>V(s,'bcWin')>=1,{series:'games',k:'bcWin',goal:1}),
 BG('bc_2','🎴','Cao thủ 3 cào','Thắng 30 ván 3 Cào',1500,2,s=>V(s,'bcWin')>=30,{series:'games',k:'bcWin',goal:30}),
 BG('bc_3','👑','Vua 3 cào','Thắng 150 ván 3 Cào',5000,3,s=>V(s,'bcWin')>=150,{series:'games',k:'bcWin',goal:150}),
 BG('bc_bacao','🤴','Ba cào!','Có Ba cào (3 lá J/Q/K)',800,2,s=>V(s,'bacao')>=1,{series:'combo',k:'bacao',goal:1}),
 BG('xd_1','🂱','Tay xì dách','Thắng 1 ván Xì dách',200,1,s=>V(s,'xdWin')>=1,{series:'games',k:'xdWin',goal:1}),
 BG('xd_2','🎰','Cao thủ xì dách','Thắng 30 ván Xì dách',1500,2,s=>V(s,'xdWin')>=30,{series:'games',k:'xdWin',goal:30}),
 BG('xd_3','💎','Vua xì dách','Thắng 150 ván Xì dách',5000,3,s=>V(s,'xdWin')>=150,{series:'games',k:'xdWin',goal:150}),
 BG('xd_nl','🖐️','Ngũ linh','Thắng bằng Ngũ linh',800,2,s=>V(s,'ngulinh')>=1,{series:'combo',k:'ngulinh',goal:1}),
 BG('bcua_1','🦀','Tay bầu cua','Thắng 1 ván Bầu cua',200,1,s=>V(s,'bcuaWin')>=1,{series:'games',k:'bcuaWin',goal:1}),
 BG('bcua_2','🎲','Cao thủ bầu cua','Thắng 50 ván Bầu cua',2000,2,s=>V(s,'bcuaWin')>=50,{series:'games',k:'bcuaWin',goal:50}),
 BG('bcua_bao','🌪️','Bão!','Thắng khi 3 xúc xắc cùng mặt',1000,2,s=>V(s,'bcuaTriple')>=1,{series:'combo',k:'bcuaTriple',goal:1}),
 BG('dom_1','🁫','Tay domino','Thắng 1 ván Domino',200,1,s=>V(s,'domWin')>=1,{series:'games',k:'domWin',goal:1}),
 BG('dom_2','🀄','Cao thủ domino','Thắng 50 ván Domino',2000,2,s=>V(s,'domWin')>=50,{series:'games',k:'domWin',goal:50}),
 BG('dom_bi','🧱','Chặn đứng','Thắng khi bàn bí',800,2,s=>V(s,'domBlockWin')>=1,{series:'combo',k:'domBlockWin',goal:1}),
 BG('xt_1','🂡','Tay xì tố','Thắng 1 ván Xì tố',200,1,s=>V(s,'xtWin')>=1,{series:'games',k:'xtWin',goal:1}),
 BG('xt_2','🎩','Cao thủ xì tố','Thắng 50 ván Xì tố',2000,2,s=>V(s,'xtWin')>=50,{series:'games',k:'xtWin',goal:50}),
 BG('xt_big','💣','Tứ quý xì tố','Thắng Xì tố bằng Tứ quý trở lên',1500,3,s=>V(s,'xtBig')>=1,{series:'combo',k:'xtBig',goal:1}),
 BG('sec_xtsf','🌈','Thùng phá sảnh!','Thắng Xì tố bằng Thùng phá sảnh',5000,3,s=>V(s,'xtSF')>=1,{secret:true}),
 BG('pk_1','♠️','Tay poker','Thắng 1 ván Poker',200,1,s=>V(s,'pkWin')>=1,{series:'games',k:'pkWin',goal:1}),
 BG('pk_2','🎰','Cá mập poker','Thắng 50 ván Poker',2000,2,s=>V(s,'pkWin')>=50,{series:'games',k:'pkWin',goal:50}),
 BG('pk_allin','🔥','Tất tay thắng','Thắng ván Poker khi đã tất tay',1000,2,s=>V(s,'pkAllin')>=1,{series:'combo',k:'pkAllin',goal:1}),
 BG('sec_pksf','🌟','Royal!','Thắng Poker bằng Thùng phá sảnh',5000,3,s=>V(s,'pkSF')>=1,{secret:true}),
 BG('sec_xibang','🅰️','Xì bàng!','Thắng bằng hai con Át',3000,3,s=>V(s,'xibang')>=1,{secret:true}),
 BG('sec_chain','⛓️','Chặt chồng','Chặt ngược lại người vừa chặt mình',2500,3,s=>V(s,'chain')>=1,{secret:true}),
 BG('sec_allin','🎲','Tất tay','Thắng ván khi số xu chỉ vừa đủ cược',2500,3,s=>V(s,'allin')>=1,{secret:true}),
 BG('sec_bigthui','🐖','Cả đàn heo','Bắt thúi 3 con heo trong một ván',3000,3,s=>V(s,'bigThui')>=1,{secret:true}),
];

// ---- v1.48: huy hiệu theo từng chế độ (mỗi chế độ 66 huy hiệu như Miền Nam)
const MODE_BADGE_INFO={
 demla:{n:'Đếm lá',ic:'🔢',role:['Hạ Cao thủ','Về nhất khi có máy Cao thủ trong bàn'],bust:['Luộc','Để đối thủ ôm nguyên 13 lá'],sp:[['Tới trắng','Thắng tới trắng','🌟'],['Ôm bài','Thắng khi có đối thủ còn ≥10 lá','🃏'],['Càn quét','Thắng khi mọi đối thủ còn ≥5 lá','🧹']],sec:[['Gom cả chiếu','Thắng khi đối thủ còn tổng ≥30 lá','🧺'],['Không cần heo','Thắng Đếm lá mà không đánh con 2 nào','🙅']]},
 '3cao':{n:'3 Cào',ic:'🃏',role:['Làm cái','Làm cái'],bust:['Vét túi','Làm máy cháy túi (hết xu)'],sp:[['Ba cào','Thắng bằng Ba cào','🤴'],['Chín nút','Thắng bằng 9 nút','9️⃣'],['Cái ăn hết','Làm cái thắng tất cả nhà con','🧲']],sec:[['Cái ba cào','Làm cái có Ba cào','👑'],['Chín vẫn thua','Có 9 nút mà vẫn thua','😵']]},
 xidach:{n:'Xì dách',ic:'🂱',role:['Làm cái','Làm cái'],bust:['Vét túi','Làm máy cháy túi (hết xu)'],sp:[['Xì dách','Thắng bằng Xì dách','🂡'],['Ngũ linh','Thắng bằng Ngũ linh','🖐️'],['Xì bàng','Thắng bằng Xì bàng','🅰️']],sec:[['Ngũ linh 21','Ngũ linh đúng 21 điểm','🎯'],['Cái ăn hết','Làm cái thắng tất cả nhà con','🧲']]},
 baucua:{n:'Bầu cua',ic:'🦀',role:['Làm cái','Làm cái'],bust:['Vét túi','Làm máy cháy túi (hết xu)'],sp:[['Bão','Thắng khi 3 xúc xắc cùng mặt','🌪️'],['Ăn đôi','Một cửa trúng 2 xúc xắc','✌️'],['Ăn gấp','Lãi ≥2 lần tổng tiền đặt','📈']],sec:[['Bão trúng cửa','Cửa mình đặt ra cả 3 xúc xắc','🎆'],['Rải khắp chiếu','Đặt đủ 6 cửa trong một ván','🌈']]},
 domino:{n:'Domino',ic:'🁫',role:['Đi đầu','Thắng ván mình đi trước'],bust:['Vét túi','Làm máy cháy túi (hết xu)'],sp:[['Chặn đứng','Thắng khi bàn bí','🧱'],['Đè nút','Thắng khi đối thủ còn tổng ≥30 nút','⚖️'],['Kết đôi','Thắng bằng quân đôi cuối cùng','🀄']],sec:[['Không bốc','Thắng mà không bốc nọc lần nào','🙌'],['Rắn dài','Thắng khi dây có ≥20 quân','🐍']]},
 xito:{n:'Xì tố',ic:'🂡',role:['Tố tất','Thắng ván đã tố tất'],bust:['Vét túi','Làm máy cháy túi (hết xu)'],sp:[['Thùng/Cù lũ','Thắng bằng Cù lũ trở lên','🏠'],['Thùng','Thắng bằng Thùng trở lên','♦️'],['Tứ quý','Thắng bằng Tứ quý trở lên','💣']],sec:[['Thùng phá sảnh','Thắng bằng Thùng phá sảnh','🌈'],['Không cần lật','Thắng khi mọi người bỏ bài','🙈']]},
 poker:{n:'Poker',ic:'♠️',role:['Tất tay','Thắng ván đã tất tay'],bust:['Vét túi','Làm máy cháy túi (hết xu)'],sp:[['Sảnh','Thắng bằng Sảnh trở lên','📏'],['Cù lũ','Thắng bằng Cù lũ trở lên','🏠'],['Tứ quý','Thắng bằng Tứ quý trở lên','💣']],sec:[['Royal','Thắng bằng Thùng phá sảnh','🌟'],['Bluff','Thắng khi mọi người bỏ bài','🎭']]}};
const MB_SERIES=[['games','Chơi',[1,50,300],'🎴','ván'],['wins','Thắng',[1,10,50,200],'🏆','ván'],['streak','Chuỗi thắng',[3,5,10],'🔥','ván liên tiếp'],['big','Thắng lớn (lãi ≥10× cược)',[1,10,50],'💥','lần'],['earn','Tổng xu thắng',[5000,50000,500000],'💵','xu'],
 ['roleG','',[1,25,150],'🎩','lần'],['roleW','',[1,20,100],'🎖️','lần'],['bust','',[1,10,50],'🍲','lần'],['hi','Thắng cược ≥1.000',[1,10,50],'💎','ván'],['max','Thắng cược ≥5.000',[1,5,25],'🎲','ván'],
 ['full','Chơi bàn đông nhất',[5,50,200],'👥','ván'],['duo','Thắng bàn 2 người',[5,20,100],'⚔️','ván'],['sp1','',[1,5,25],'',''],['sp2','',[1,5,25],'',''],['sp3','',[1,3,10],'',''],
 ['loss','Thua mà không bỏ cuộc',[10,100,500],'🥀','ván'],['comeback','Thắng sau chuỗi thua ≥3',[1,5,20],'🦅','lần'],['night','Chơi lúc 0h–4h',[1,20,100],'🦉','ván'],['days','Số ngày đã chơi',[3,7,30],'📅','ngày'],['huge','Thắng ≥50.000 xu trong một ván',[1,3,10],'🤑','lần']];
const MB_TN=[['Tập sự','Lão luyện','Bậc thầy','Huyền thoại']];
const MB_SEC=[['s4'],['s5'],['day10','Trúng 10 ván trong một ngày','📆'],['x100','Lãi ≥100× tiền cược trong một ván','🚀'],['bust3','Làm 3 máy cháy túi trong một ván','☠️']];
const mk=(m,k)=>'m_'+m+'_'+k;
for(const m in MODE_BADGE_INFO){const I=MODE_BADGE_INFO[m];
 for(const [k,lab,goals,ic,unit] of MB_SERIES){let L=lab,icon=ic,u=unit;if(k==='roleG'){L=I.role[1]+(m==='demla'||m==='domino'||m==='xito'||m==='poker'?'':'');u='lần';}
  if(k==='roleW')L=I.role[0]+' thắng';if(k==='roleG'&&['demla','domino','xito','poker'].includes(m))L=I.role[1];if(k==='roleW'&&['demla','domino','xito','poker'].includes(m))L=I.role[1]+' với lãi ≥3× cược';
  if(k==='bust')L=I.bust[1];const spi=k.startsWith('sp')?I.sp[+k[2]-1]:null;if(spi){L=spi[1];icon=spi[2];u='lần';}
  goals.forEach((g,i)=>{const tier=Math.min(3,i+1),nm=(spi?spi[0]:k==='bust'?I.bust[0]:k==='roleG'?I.role[0]:k==='roleW'?I.role[0]+' thắng lớn':L.split(' (')[0])+' · '+MB_TN[0][i];
   BADGES.push(BG(m+'_'+k+'_'+(i+1),icon,I.n+': '+nm,L+' '+g.toLocaleString('vi-VN')+' '+u+' ('+I.n+')',[150,800,3000,10000][i],tier,s=>V(s,mk(m,k==='streak'?'bestStreak':k))>=g,{series:'m_'+k,mode:m,k:mk(m,k==='streak'?'bestStreak':k),goal:g,legend:i===3}));});}
 MB_SEC.forEach(([k,d,ic],j)=>{const sd=k==='s4'?I.sec[0]:k==='s5'?I.sec[1]:[null,d,ic];BADGES.push(BG(m+'_sec_'+k,sd[2],I.n+': '+(sd[0]||d.split(' ')[0]+' '+(d.split(' ')[1]||'')),sd[1],[3000,3000,4000,5000,5000][j],3,s=>V(s,mk(m,k))>=1,{secret:true,mode:m,k:mk(m,k),goal:1}));});}

// v1.52: thú cưng (1 con đang theo, cộng % EXP) + hạng sao theo chế độ
const PETS=[{id:'pet_meo',name:'Mèo',price:20000,pct:2},{id:'pet_cho',name:'Chó',price:50000,pct:4},{id:'pet_vet',name:'Vẹt',price:150000,pct:7},{id:'pet_cao',name:'Cáo',price:400000,pct:12},{id:'pet_rong',name:'Rồng',price:1000000,pct:20}];
function petDef(id){return PETS.find(x=>x.id===id)||null;}
function petOwned(P,id){return !!(P.pets&&P.pets[id]);}
function petActive(P){const d=petDef(P.pet);return d&&petOwned(P,d.id)?d:null;}
function petBonus(P){const d=petActive(P);return d?d.pct:0;}
function buyPet(P,id){const d=petDef(id);if(!d)return{ok:false,reason:'Không có thú cưng này'};if(petOwned(P,id))return{ok:false,reason:'Đã sở hữu'};if((P.xu||0)<d.price)return{ok:false,reason:'Không đủ xu'};P.xu-=d.price;P.pets=Object.assign({},P.pets,{[id]:1});P.pet=id;return{ok:true,cost:d.price};}
function equipPet(P,id){if(id&&!petOwned(P,id))return false;P.pet=id||null;return true;}
const STAR_MODES=[['tlmn','Miền Nam'],['demla','Đếm lá'],['3cao','3 Cào'],['xidach','Xì dách'],['baucua','Bầu cua'],['domino','Domino'],['xito','Xì tố'],['poker','Poker']];
const STAR_TIERS=[['Đồng',0.4,'#cd7f32'],['Bạc',0.8,'#cfd8dc'],['Vàng',1.2,'#ffd54f'],['Kim cương',2,'#80deea'],['Xanh',2.8,'#42a5f5'],['Đỏ',4,'#ef5350'],['Đen',6,'#9e9e9e']];
const STAR_TOTAL_XP=300*60*41; // ~300 giờ ở ~41 XP/phút
const STAR_STEPS=(()=>{const w=[];for(let i=1;i<=35;i++)w.push(Math.pow(i,1.5));const s=w.reduce((a,b)=>a+b,0);const c=w.map(x=>Math.max(10,Math.round(x*STAR_TOTAL_XP/s/10)*10));return c;})();
const STAR_CUM=STAR_STEPS.reduce((a,c)=>(a.push(a[a.length-1]+c),a),[0]);
function starInfo(xp){xp=xp||0;let step=0;while(step<35&&xp>=STAR_CUM[step+1])step++;const tier=step?Math.floor((step-1)/5):-1,stars=step?((step-1)%5)+1:0;
 return{step,tier,stars,name:step?STAR_TIERS[tier][0]:'Chưa xếp hạng',color:step?STAR_TIERS[tier][2]:'#777',cur:step>=35?STAR_STEPS[34]:xp-STAR_CUM[step],need:step>=35?STAR_STEPS[34]:STAR_STEPS[step],max:step>=35};}
function starStepBonus(step){let b=0;for(let k=1;k<=step;k++)b+=STAR_TIERS[Math.floor((k-1)/5)][1];return Math.round(b*10)/10;}
function modeXpOf(P,m){return (P.mxp&&P.mxp[m])||0;}
function starBonus(P){return Math.round(STAR_MODES.reduce((a,[m])=>a+starStepBonus(starInfo(modeXpOf(P,m)).step),0)*10)/10;}
function addModeXp(P,m,n){if(!m||!(n>0)||!STAR_MODES.some(x=>x[0]===m))return null;P.mxp=Object.assign({},P.mxp);const b=starInfo(P.mxp[m]||0).step;P.mxp[m]=(P.mxp[m]||0)+n;const a=starInfo(P.mxp[m]).step;if(a>b){P._starUp={mode:m,from:b,step:a};return P._starUp;}return null;}
BADGES.push(BG('pet_first','🐾','Bạn đồng hành','Nuôi thú cưng đầu tiên',2000,1,(s,p)=>PETS.some(x=>petOwned(p,x.id)),{series:'asset'}),
 BG('pet_rong','🐉','Chủ nhân của Rồng','Sở hữu Rồng',50000,3,(s,p)=>petOwned(p,'pet_rong'),{series:'asset'}),
 BG('pet_all','🏡','Vườn thú','Sở hữu đủ 5 thú cưng',30000,3,(s,p)=>PETS.every(x=>petOwned(p,x.id)),{series:'asset'}),
 BG('star_first','⭐','Ngôi sao đầu tiên','Đạt 1 sao ở bất kỳ chế độ',1000,1,(s,p)=>STAR_MODES.some(([m])=>starInfo(modeXpOf(p,m)).step>=1),{series:'star'}),
 BG('star_gold','🌟','Hạng Vàng','Đạt hạng Vàng ở một chế độ',10000,2,(s,p)=>STAR_MODES.some(([m])=>starInfo(modeXpOf(p,m)).step>=11),{series:'star'}),
 BG('star_dia','💎','Hạng Kim cương','Đạt hạng Kim cương ở một chế độ',30000,3,(s,p)=>STAR_MODES.some(([m])=>starInfo(modeXpOf(p,m)).step>=16),{series:'star'}),
 BG('star_all8','🎖️','Toàn năng','Có sao ở cả 8 chế độ',20000,2,(s,p)=>STAR_MODES.every(([m])=>starInfo(modeXpOf(p,m)).step>=1),{series:'star'}),
 BG('star_black','🖤','Huyền thoại Đen','Đạt Đen 5 sao ở một chế độ',500000,3,(s,p)=>STAR_MODES.some(([m])=>starInfo(modeXpOf(p,m)).step>=35),{series:'star',legend:true}));
// huy hiệu tài sản (nhóm Chung)
BADGES.push(BG('asset_first','🏪','Khởi nghiệp','Sở hữu tài sản đầu tiên',2000,1,(s,p)=>ASSETS.some(a=>a.cat==='biz'&&assetLv(p,a.id)>0),{series:'asset'}),
 BG('asset_nhamay','🏭','Ông chủ nhà máy','Sở hữu Nhà máy',20000,2,(s,p)=>assetLv(p,'nhamay')>0,{series:'asset'}),
 BG('asset_tapdoan','🏙️','Chủ tịch tập đoàn','Sở hữu Tập đoàn',50000,3,(s,p)=>assetLv(p,'tapdoan')>0,{series:'asset'}),
 BG('asset_all','🗂️','Đế chế kinh doanh','Sở hữu đủ 5 tài sản kinh doanh',80000,3,(s,p)=>ASSETS.filter(a=>a.cat==='biz').every(a=>assetLv(p,a.id)>0),{series:'asset'}),
 BG('asset_max','👑','Tài phiệt tối thượng','Nâng cả 5 tài sản kinh doanh lên cấp 5',300000,3,(s,p)=>ASSETS.filter(a=>a.cat==='biz').every(a=>assetLv(p,a.id)>=ASSET_MAX),{series:'asset',legend:true}),
 BG('veh_all','🛥️','Bộ sưu tập xe','Sở hữu đủ 5 phương tiện',20000,2,(s,p)=>ASSETS.filter(a=>a.cat==='veh').every(a=>assetLv(p,a.id)>0),{series:'asset'}),
 BG('shop_all','🛍️','Tín đồ thời thượng','Mua đủ 12 món Mua sắm',30000,3,(s,p)=>ASSETS.filter(a=>a.cat==='shop').every(a=>assetLv(p,a.id)>0),{series:'asset'}));
// cân số lượng: mỗi chế độ đúng bằng số huy hiệu Miền Nam
{const cnt=m=>BADGES.filter(b=>badgeMode(b)===m).length;const T=cnt('mn');for(const m in MODE_BADGE_INFO){const I=MODE_BADGE_INFO[m];let j=0;const extra=[100,200,365,500];
 while(cnt(m)<T&&j<extra.length){const g=extra[j++];BADGES.push(BG(m+'_days_x'+j,'🗓️',I.n+': Trung thành · '+g+' ngày','Chơi '+I.n+' trong '+g+' ngày khác nhau',5000+j*2000,3,s=>V(s,mk(m,'days'))>=g,{series:'m_days',mode:m,k:mk(m,'days'),goal:g,legend:true}));}
 while(cnt(m)>T){const i=BADGES.findIndex(b=>b.mode===m&&b.series==='m_night'&&b.goal===100)>=0?BADGES.findIndex(b=>b.mode===m&&b.series==='m_night'&&b.goal===100):BADGES.findIndex(b=>b.mode===m&&b.series==='m_huge'&&b.goal===10);if(i<0)break;BADGES.splice(i,1);}}}
// ghi nhận kết quả ván của mọi chế độ (dùng chung)
function modeRecord(P,m,ev,now){now=now||new Date();const s=P.stats=P.stats||{};const inc=(k,v)=>{s[mk(m,k)]=(s[mk(m,k)]||0)+(v==null?1:v);};const g=k=>s[mk(m,k)]||0;
 const bet=Math.max(1,ev.bet||1),net=ev.net||0,win=!!ev.win;inc('games');if(ev.full)inc('full');if(now.getHours()<4)inc('night');const dk=dayKey(now);
 if(s[mk(m,'lastDay')]!==dk){s[mk(m,'lastDay')]=dk;inc('days');s[mk(m,'dWins')]=0;}if(ev.role)inc('roleG');
 if(win){inc('wins');s[mk(m,'dWins')]=(s[mk(m,'dWins')]||0)+1;if(g('dWins')>=10)s[mk(m,'day10')]=1;if(g('lossRun')>=3)inc('comeback');s[mk(m,'lossRun')]=0;s[mk(m,'cur')]=g('cur')+1;s[mk(m,'bestStreak')]=Math.max(g('bestStreak'),g('cur'));
  if(net>0)inc('earn',net);if(net>=10*bet)inc('big');if(net>=100*bet)s[mk(m,'x100')]=1;if(net>=50000)inc('huge');if(bet>=1000)inc('hi');if(bet>=5000)inc('max');if(ev.n===2)inc('duo');if(ev.role&&(ev.dealer||net>=3*bet))inc('roleW');}
 else{s[mk(m,'cur')]=0;if(net<0){inc('loss');s[mk(m,'lossRun')]=g('lossRun')+1;}}
 if(ev.bust){inc('bust',ev.bust);if(ev.bust>=3)s[mk(m,'bust3')]=1;}
 for(const k of ['sp1','sp2','sp3'])if(ev[k])inc(k);for(const k of ['s4','s5'])if(ev[k])s[mk(m,k)]=1;}
function badgeMode(b){if(b.mode)return b.mode;const id=b.id;if(/^demla_/.test(id))return 'demla';if(/^bc_/.test(id))return '3cao';if(/^(xd_|sec_xibang)/.test(id))return 'xidach';if(/^bcua_/.test(id))return 'baucua';if(/^dom_/.test(id))return 'domino';if(/^(xt_|sec_xtsf)/.test(id))return 'xito';if(/^(pk_|sec_pksf)/.test(id))return 'poker';
 const ser=b.series;if(['games','wins','streak','chop','bomb','table','ai','combo','thui','chay','b3','skill','luoc','earn'].includes(ser)||(b.secret&&/^sec_(notwo|3s|bigbet|comeback|luoc3|chain|bigthui|allin)/.test(id)))return 'mn';return 'chung';}
const BADGE_TIER=[null,{name:'Đồng',col:'#cd7f32'},{name:'Bạc',col:'#c0c8d0'},{name:'Vàng',col:'#ffd84d'}];
// Nhiệm vụ: 3 hằng ngày + 3 hằng tuần (thưởng lớn). Giữ id cũ.
const Q=(id,name,ev,goal,xu)=>({id,name,ev,goal,xu:xu*QUEST_XU_MULT});
const QUEST_POOL=[
 Q('play3','Chơi 3 ván','game',3,150),Q('play5','Chơi 5 ván','game',5,250),Q('win1','Về nhất 1 ván','win',1,200),Q('win2','Về nhất 2 ván','win',2,400),
 Q('demla1','Về nhất 1 ván Đếm lá','demlawin',1,300),Q('dom1','Thắng 1 ván Domino','domwin',1,300),Q('xt1','Thắng 1 ván Xì tố','xtwin',1,300),Q('pk1','Thắng 1 ván Poker','pkwin',1,300),Q('bcua1','Thắng 2 ván Bầu cua','bcuawin',2,250),Q('luoc1','Luộc sạch 1 máy','luoc',1,400),Q('top2','Về nhất hoặc nhì 3 ván','top2',3,300),Q('pairs5','Đánh 5 đôi','pair',5,150),Q('triple2','Đánh 2 sám cô','triple',2,200),Q('straight3','Đánh 3 sảnh','straight',3,200),
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
// tổng số trận thắng mọi chế độ (Miền Nam + Đếm lá nằm trong stats.wins; 6 chế độ còn lại tính riêng)
const WIN_MODES=['3cao','xidach','baucua','domino','xito','poker'];
function totalWins(P){const s=(P&&P.stats)||{};return (s.wins|0)+WIN_MODES.reduce((a,m)=>a+(s['m_'+m+'_wins']|0),0);}
// khóa tuần theo giờ Việt Nam (UTC+7) để mọi người cùng mốc reset thứ Hai 00:00
function lbWeekKey(now){const t=new Date((now==null?Date.now():+now)+7*3600e3);const w=(t.getUTCDay()+6)%7;const m=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()-w));return m.getUTCFullYear()+'-'+String(m.getUTCMonth()+1).padStart(2,'0')+'-'+String(m.getUTCDate()).padStart(2,'0');}
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
const PASSIVE_CAP_MS=24*3600*1000;
const ASSETS=[
 {id:'quan',cat:'biz',name:'Quán nước',price:1000000,pct:10,max:5},{id:'taphoa',cat:'biz',name:'Tiệm tạp hóa',price:2000000,pct:25,max:5},{id:'xuongmay',cat:'biz',name:'Xưởng may',price:3500000,pct:45,max:5},{id:'nhamay',cat:'biz',name:'Nhà máy',price:6000000,pct:75,max:5},{id:'tapdoan',cat:'biz',name:'Tập đoàn',price:10000000,pct:120,max:5},
 {id:'xedap',cat:'veh',name:'Xe đạp',price:50000,pct:2,max:5},{id:'xemay',cat:'veh',name:'Xe máy',price:120000,pct:4,max:5},{id:'xega',cat:'veh',name:'Xe tay ga',price:250000,pct:6,max:5},{id:'oto',cat:'veh',name:'Ô tô',price:500000,pct:10,max:5},{id:'duthuyen',cat:'veh',name:'Du thuyền',price:1000000,pct:15,max:5},
 ...[['ao','Quần áo',[['ao1','Áo thun',10000],['ao2','Áo sơ mi lụa',100000],['ao3','Vest hàng hiệu',500000]]],['tt','Trang sức',[['tt1','Nhẫn bạc',30000],['tt2','Dây chuyền vàng',250000],['tt3','Kim cương',1000000]]],
  ['pk','Phụ kiện',[['pk1','Kính râm',20000],['pk2','Đồng hồ',150000],['pk3','Túi hàng hiệu',700000]]],['ps','Vật phong thủy',[['ps1','Cóc ngậm tiền',50000],['ps2','Tỳ hưu',300000],['ps3','Cây tài lộc ngọc',1000000]]]]
  .flatMap(([g,gn,its])=>its.map(([id,name,price],i)=>({id,cat:'shop',grp:g,grpName:gn,name,price,pct:[1,3,6][i],max:1,exp:true})))];
const ASSET_MAX=5;const ASSET_CATS={biz:'Kinh doanh',veh:'Phương tiện',shop:'Mua sắm'};
function assetDef(id){return ASSETS.find(x=>x.id===id);}
function assetLv(P,id){const a=assetDef(id);const v=P.assets&&P.assets[id];return v>0?Math.min(a?a.max:ASSET_MAX,v|0):0;}
function assetBonus(P){return ASSETS.reduce((a,x)=>a+(x.exp?0:x.pct*assetLv(P,x.id)),0);}
function shopExpBonus(P){return ASSETS.reduce((a,x)=>a+(x.exp?x.pct*assetLv(P,x.id):0),0);}
// ---- Thưởng EXP (v1.54): mỗi nguồn cộng dồn, tổng bị chặn ở EXP_CAP ----
const EXP_CAP=300;
let _shopRef=null;function _shopList(){if(typeof SHOP!=='undefined')return SHOP;if(!_shopRef){try{_shopRef=require('./shop.js').SHOP;}catch(e){_shopRef=[];}}return _shopRef;}
function ownedValue(P,avatar){let v=0;for(const it of _shopList()){if(!(it.price>0))continue;if((it.type==='avatar')!==!!avatar)continue;if(P.inv&&P.inv[it.id])v+=it.price;}return v;}
function expBreakdown(P){const rd=x=>Math.round(x*100)/100;const sv=ownedValue(P,false),av=ownedValue(P,true),earned=(P.stats&&P.stats.earned)||0,nb=Object.keys(P.badges||{}).length;
 const rows=[{k:'shop',ic:'🛍️',label:'Vật phẩm cửa hàng',info:fmt0(sv)+' xu · mỗi 1.000.000 xu = +1%',pct:rd(sv/1000000)},
  {k:'avatar',ic:'😎',label:'Avatar sở hữu',info:fmt0(av)+' xu · mỗi 1.000.000 xu = +1%',pct:rd(av/1000000)},
  {k:'earned',ic:'🪙',label:'Tổng xu đã thắng',info:fmt0(earned)+' xu · mỗi 100.000 xu = +1%',pct:rd(earned/100000)},
  {k:'badge',ic:'🏅',label:'Huy hiệu',info:nb+' huy hiệu · mỗi huy hiệu = +0,05%',pct:rd(nb*0.05)},
  {k:'asset',ic:'🏢',label:'Tài sản mua sắm',info:'Quần áo, trang sức, phụ kiện, phong thủy',pct:shopExpBonus(P)},
  {k:'pet',ic:'🐾',label:'Thú cưng',info:'Thú đang theo bạn',pct:typeof petBonus==='function'?petBonus(P):0}];
 const raw=rd(rows.reduce((a,r)=>a+r.pct,0));return{rows,raw,total:Math.min(EXP_CAP,raw),cap:EXP_CAP,capped:raw>EXP_CAP};}
function fmt0(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');}
function expBonus(P){return expBreakdown(P).total;}
function assetCost(id,toLv){const a=assetDef(id);if(!a||toLv<1||toLv>a.max)return null;return toLv===1?a.price:Math.round(a.price*0.25*toLv);}
function bestAsset(P){let b=null;for(const a of ASSETS)if(assetLv(P,a.id)&&(!b||a.price>b.price))b=a;return b;}
function passiveBank(P,now){now=now==null?Date.now():+now;const ps=passiveInit(P,now);if(now<ps.last)return;ps.frac=passivePending(P,now);ps.last=now;}
function buyAsset(P,id,now){const a=assetDef(id);if(!a)return{ok:false,reason:'Không có tài sản này'};const lv=assetLv(P,id);if(lv>=a.max)return{ok:false,reason:a.max===1?'Đã sở hữu':'Đã nâng cấp tối đa'};
 const cost=assetCost(id,lv+1);if((P.xu||0)<cost)return{ok:false,reason:'Không đủ xu'};passiveBank(P,now);P.xu-=cost;P.assets=Object.assign({},P.assets||{});P.assets[id]=lv+1;P.stats=P.stats||{};P.stats.assetSpent=(P.stats.assetSpent||0)+cost;return{ok:true,cost,lv:lv+1};}
function passiveRate(P){return levelInfo(P.xp||0).level/2/100*(1+(assetBonus(P)+starBonus(P))/100);}
function passiveInit(P,now){now=now==null?Date.now():+now;if(!P.passive||typeof P.passive.last!=='number'||!isFinite(P.passive.last))P.passive={last:now,frac:0};return P.passive;}
function passivePending(P,now){now=now==null?Date.now():+now;const ps=passiveInit(P,now);const d=now-ps.last;if(!(d>0))return ps.frac||0;return Math.min(d,PASSIVE_CAP_MS)/1000*passiveRate(P)+(ps.frac||0);}
function passiveClaim(P,now){now=now==null?Date.now():+now;const ps=passiveInit(P,now);if(now<ps.last)return 0;const tot=passivePending(P,now);const got=Math.floor(tot);ps.frac=tot-got;ps.last=now;P.xu+=got;return got;}
const ALLOW_PER_LV=1000;
function allowanceAmt(P){return ALLOW_PER_LV*levelInfo(P.xp||0).level;}
function canAllowance(P,now){return (P.xu|0)===0&&P.allowDay!==dayKey(now);}
function claimAllowance(P,now){if(!canAllowance(P,now))return 0;const a=allowanceAmt(P);P.allowDay=dayKey(now);P.xu+=a;return a;}
function rescue(P,now){if(!canRescue(P,now))return 0;P.rescueDay=dayKey(now);P.xu+=RESCUE_XU;return RESCUE_XU;}
function checkBadges(P){const out=[];let again=true;while(again){again=false;
 for(const b of BADGES)if(!P.badges[b.id]&&b.test(P.stats,P)){P.badges[b.id]=Date.now();P.xu+=b.xu;out.push(b);again=true;}}return out;}
// human played a combo; prev = combo on table before (or null)
function onPlay(P,info,prev){const s=P.stats;
 if(info.type==='pair')questEvent(P,'pair');if(info.type==='single')questEvent(P,'single');if(info.type==='pairseq')questEvent(P,'pairseq');if(info.type==='quad')questEvent(P,'quad');if(info.type==='straight'&&info.len>=5)questEvent(P,'straight5');if(!prev)questEvent(P,'lead');if(info.type==='triple')questEvent(P,'triple');if(info.type==='straight'){questEvent(P,'straight');s.longStraight=Math.max(s.longStraight,info.len);}
 if(info.type==='quad')s.quads++;if(info.type==='pairseq'&&info.len>=4)s.pairseq4++;
 if((info.top>>2)===12&&(info.type==='single'||info.type==='pair'||info.type==='triple'))questEvent(P,'two',info.len);
 let bonus=0;if(prev&&(prev.top>>2)===12&&info.type!==prev.type){s.chops++;questEvent(P,'chop');if(P._tbl===2)questEvent(P,'chop2');}
 const lv=prev&&(prev.top>>2)===12&&info.type!==prev.type?addXp(P,XP_CHOP,P._mode):null;
 return{bonus,badges:checkBadges(P),lv};}
// place: 0..3, instant: human won tới trắng
// Bàn n người: hệ số XP và xu theo số người
const TABLE_XP={2:0.5,3:0.75,4:1};
const PLACE_XU={2:[1,-1],3:[1.5,0,-1],4:PLACE_MULT};
// v1.51: XP tỉ lệ thời gian ván (~41 XP/phút)
const XP_PLACE_N={2:[32,19],3:[46,28,16],4:[100,60,35,20]};
const XP_DEMLA_N={2:[27,16],3:[38,23,13],4:[83,50,29,17]};
const XP_MODE={'3cao':[8,4,3],xidach:[13,7,4],baucua:[24,12,8],domino:[35,17,12],xito:[32,16,10],poker:[30,15,10]};
function modeXp(g,net){const t=XP_MODE[g]||[30,15,10];return net>0?t[0]:net===0?t[1]:t[2];}
function tableXp(n,place,instant,mode){const T=mode==='demla'?XP_DEMLA_N:XP_PLACE_N;n=T[n]?n:4;const row=T[n],last=row[row.length-1];return Math.round((row[place]==null?last:row[place])+(instant&&place===0?XP_INSTANT*row[0]/100:0));}
function tableXu(bet,n,place,instant){n=PLACE_XU[n]?n:4;return Math.round(bet*(instant?(place===0?n-1:-1):(PLACE_XU[n][place]==null?-1:PLACE_XU[n][place])));}
// ctx: {bonus:% thưởng vì về trên máy khó, beatHard, beatMaster, usedTwo, last3s, comeback, online}
function onGameEnd(P,place,instant,n,ctx){n=n||4;ctx=ctx||{};const s=P.stats;s.games++;questEvent(P,'game');if(ctx.online)questEvent(P,'online');
 let delta=ctx.xuDelta!=null?ctx.xuDelta:tableXu(P.bet,n,place,instant);const bonus=Math.max(0,ctx.bonus||0);let bxu=0;if(delta>0&&bonus&&!ctx.noXuBonus){bxu=Math.round(delta*bonus);delta+=bxu;}
 if(place===0){s.wins++;s.streak++;s.bestStreak=Math.max(s.bestStreak,s.streak);questEvent(P,'win');s['win'+n]=(s['win'+n]||0)+1;questEvent(P,'win'+n);
  if(P.bet>=500)questEvent(P,'winbet500');if(P.bet>=5000){questEvent(P,'winbet5k');s.win5k=(s.win5k||0)+1;}
  if(ctx.usedTwo===false&&!instant)s.noTwoWin=(s.noTwoWin||0)+1;if(ctx.last3s)s.last3s=(s.last3s||0)+1;if(ctx.comeback)s.comeback=(s.comeback||0)+1;}else s.streak=0;
 if(place<n-1)questEvent(P,'notlast');
 if(ctx.beatHard){s.beatHard=(s.beatHard||0)+ctx.beatHard;questEvent(P,'beatHard',ctx.beatHard);}if(ctx.beatMaster){s.beatMaster=(s.beatMaster||0)+ctx.beatMaster;questEvent(P,'beatMaster',ctx.beatMaster);}
 if(place<=1)questEvent(P,'top2');if(instant&&place===0)s.instant++;if(delta>0)s.earned=(s.earned||0)+delta;
 const xp0=tableXp(n,place,instant,ctx.mode),bxp=Math.round(xp0*bonus);
 const x0=P.xu;P.xu=Math.max(0,P.xu+delta);const paid=P.xu-x0,x1=P.xu;const lv=addXp(P,xp0+bxp,ctx.mode);const x2=P.xu;const badges=checkBadges(P);
 const ledger={place:paid-(delta>0?bxu:0),bonus:delta>0?bxu:0,level:x2-x1,badges:P.xu-x2};return{delta,bxu,bxp,bonus,badges,lv,ledger};}
// sổ xu ván: parts {place,bonus,chop,thui,chay,b3,level,badges,exit,misc}
const LEDGER_LABELS=[['place','Thứ hạng'],['chop','Tiền chặt heo'],['thui','Thúi heo/hàng'],['chay','Cháy bài'],['b3','3 bích về nhất'],['t3','Thúi 3 bích (bét còn 3♠)'],['bonus','Thưởng thắng máy khó'],['badges','Thưởng huy hiệu'],['level','Thưởng lên cấp'],['luoc','Luộc máy'],['demla','Đếm lá'],['exit','Phạt rời bàn'],['misc','Khác (ném đồ, quà…)']];
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
 {id:'lv2',name:'Học Việc Sòng Bài',min:2,tier:1},{id:'lv4',name:'Tiểu Bài Thủ',min:4,tier:1},{id:'lv6',name:'Lãng Khách Giang Hồ',min:6,tier:2},
 {id:'lv10',name:'Tay Chơi Phố Cổ',min:10,tier:2},{id:'lv14',name:'Cao Thủ Hẻm Nhỏ',min:14,tier:3},{id:'lv18',name:'Quân Sư Bài Bạc',min:18,tier:3},
 {id:'lv22',name:'Đại Hiệp Chiếu Bạc',min:22,tier:4},{id:'lv28',name:'Đổ Vương',min:28,tier:4},{id:'lv33',name:'Thánh Thủ Tiến Lên',min:33,tier:5},
 {id:'lv40',name:'Kỳ Tài Thiên Hạ',min:40,tier:5},{id:'lv46',name:'Thiên Vương Sòng Bạc',min:46,tier:6},{id:'lv55',name:'Hoàng Đế Bài Bạc',min:55,tier:6},
 {id:'lv65',name:'Bài Thánh Vạn Cổ',min:65,tier:8},{id:'lv70',name:'Thần Bài Thượng Cổ',min:70,tier:8},{id:'lv80',name:'Thiên Đế Bài Bạc',min:80,tier:9},
 {id:'lv90',name:'Bất Tử Đổ Tôn',min:90,tier:9},{id:'lv100',name:'Vạn Cổ Chí Tôn',min:100,tier:9},
 {id:'luoc_su',name:'Luộc Sư',badge:'luoc_2',tier:4,cat:'Luộc máy'},{id:'luoc_ton',name:'Luộc Tôn Đại Đế',badge:'luoc_4',tier:8,cat:'Luộc máy'},
 {id:'vua_demla',name:'Vua Đếm Lá',badge:'demla_3',tier:6,cat:'Chế độ chơi'},{id:'thanh_bacao',name:'Thánh Ba Cào',badge:'bc_3',tier:6,cat:'Chế độ chơi'},
 {id:'than_xd',name:'Thần Xì Dách',badge:'xd_3',tier:6,cat:'Chế độ chơi'},{id:'ngu_linh',name:'Ngũ Linh Tướng',badge:'xd_nl',tier:5,cat:'Chế độ chơi'},
 {id:'ba_tay',name:'Tam Tây Chi Vương',badge:'bc_bacao',tier:5,cat:'Chế độ chơi'},{id:'sat_thu_thui',name:'Sát Thủ Thúi Heo',stat:['thuiGive',20],tier:5,cat:'Thành tích'},
 {id:'phong_luu',name:'Phong Lưu Công Tử',stat:['giftSent',30],tier:5,cat:'Xã giao'},{id:'dai_su_tt',name:'Đại Sứ Thân Thiện',stat:['friends',10],tier:5,cat:'Xã giao'},
 {id:'top10',name:'Top 10 Server',badge:'lb10',tier:6,cat:'Xếp hạng'},{id:'top3',name:'Top Server Chí Tôn',badge:'lb3',tier:9,cat:'Xếp hạng'},
 {id:'diet_ct',name:'Diệt Cao Thủ',badge:'master25',tier:6,cat:'Thành tích'},{id:'ty_phu',name:'Tỷ Phú Sòng Bài',badge:'rich200k',tier:8,cat:'Thành tích'},
 {id:'vua_baucua',name:'Vua Bầu Cua',badge:'bcua_2',tier:5,cat:'Chế độ chơi'},
 {id:'than_domino',name:'Thần Domino',badge:'dom_2',tier:5,cat:'Chế độ chơi'},
 {id:'vua_xito',name:'Vua Xì Tố',badge:'xt_2',tier:5,cat:'Chế độ chơi'},
 {id:'than_poker',name:'Thần Poker',badge:'pk_2',tier:6,cat:'Chế độ chơi'},
 {id:'chien_than',name:'Chiến Thần Bất Bại',badge:'streak10',tier:8,cat:'Thành tích'},
];
const TITLE_MIGRATE={tan_thu:'tan_binh',tap_su:'tay_mo',tay_choi:'kiem_khach',lao_lang:'hiep_si',cao_thu:'cao_thu_an',bac_thay:'dai_su',than_bai:'than_bai_vd',huyen_thoai:'chi_ton',do_te:'do_te_heo',vua_toi_trang:'thien_menh',dai_gia:'phu_ho',bat_bai:'bat_bai_ct'};
function migrateTitle(P){if(P&&P.title&&TITLE_MIGRATE[P.title])P.title=TITLE_MIGRATE[P.title];return P;}
function titleForLevel(l){let t=TITLES[0];for(const x of TITLES)if(x.min&&l>=x.min)t=x;return t;}
TITLES.sort((a,b)=>(a.min?0:1)-(b.min?0:1)||(a.min||0)-(b.min||0));
function titleUnlocked(P,t){if(t.min)return levelInfo(P.xp).level>=t.min;if(t.stat)return ((P.stats||{})[t.stat[0]]||0)>=t.stat[1];return !!(P.badges&&P.badges[t.badge]);}
function unlockedTitles(P){return TITLES.filter(t=>titleUnlocked(P,t));}
function currentTitle(P){migrateTitle(P);const t=P.title&&TITLES.find(x=>x.id===P.title);return t&&titleUnlocked(P,t)?t:titleForLevel(levelInfo(P.xp).level);}
function setTitle(P,id){const t=TITLES.find(x=>x.id===id);if(!t||!titleUnlocked(P,t))return false;P.title=id;return true;}
function addXp(P,n,mode){if(n>0){const b=expBonus(P);if(b)n=Math.round(n*(1+b/100));}P._lastXp=n;P._starUp=null;if(mode)addModeXp(P,mode,n);const before=levelInfo(P.xp).level;P.xp=(P.xp||0)+n;const after=levelInfo(P.xp).level;const ups=[];let xu=0;
 for(let l=before+1;l<=after;l++){ups.push(l);xu+=levelReward(l);}P.xu+=xu;
 const newTitles=TITLES.filter(t=>t.min&&t.min>before&&t.min<=after);return{xp:n,ups,xu,newTitles};}
// PROGRESS_END
if(typeof module!=='undefined')module.exports={QUEST_XU_MULT,EXP_CAP,expBreakdown,ownedValue,totalWins,lbWeekKey,WIN_MODES,PETS,petDef,petOwned,petActive,petBonus,buyPet,equipPet,shopExpBonus,STAR_MODES,STAR_TIERS,STAR_TOTAL_XP,STAR_STEPS,STAR_CUM,starInfo,starStepBonus,starBonus,addModeXp,modeXpOf,ASSET_CATS,assetDef,expBonus,bestAsset,ASSETS,ASSET_MAX,assetLv,assetBonus,assetCost,passiveBank,buyAsset,PASSIVE_CAP_MS,passiveRate,passiveInit,passivePending,passiveClaim,MODE_BADGE_INFO,modeRecord,badgeMode,allowanceAmt,canAllowance,claimAllowance,ledgerItems,LEDGER_LABELS,validName,WEEKLY_POOL,BADGE_TIER,weekKey,questDef,TABLE_XP,PLACE_XU,XP_PLACE_N,XP_DEMLA_N,XP_MODE,modeXp,tableXp,tableXu,TITLE_MIGRATE,migrateTitle,XP_PLACE,XP_CHOP,XP_INSTANT,XP_QUEST,xpNeed,levelInfo,levelReward,TITLES,titleForLevel,titleUnlocked,unlockedTitles,currentTitle,setTitle,addXp,START_XU,BETS,LOGIN_REWARDS,BADGES,QUEST_POOL,dayKey,newProfile,ensureDaily,questEvent,claimQuest,loginState,claimLogin,canRescue,rescue,checkBadges,onPlay,onGameEnd};
