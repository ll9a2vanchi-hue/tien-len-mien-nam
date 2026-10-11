// SHOP_START
const SHOP=[
 {id:'back_classic',type:'back',name:'Đỏ Hoàng Gia',price:0},{id:'back_navy',type:'back',name:'Xanh Đêm',price:300},{id:'back_emerald',type:'back',name:'Ngọc Lục Bảo',price:500},
 {id:'back_onyx',type:'back',name:'Hắc Kim',price:1200},{id:'back_dragon',type:'back',name:'Long Phụng',price:2000,lv:8},
 {id:'felt_green',type:'felt',name:'Nỉ Xanh Cổ Điển',price:0},{id:'felt_royal',type:'felt',name:'Xanh Hoàng Gia',price:800},{id:'felt_crimson',type:'felt',name:'Đỏ Rượu Vang',price:800},
 {id:'felt_purple',type:'felt',name:'Tím Thượng Lưu',price:1500},{id:'felt_onyx',type:'felt',name:'Đen Huyền Bí',price:2500,lv:10},
 {id:'av_cool',type:'avatar',name:'Ngầu',emo:'😎',price:0},{id:'av_smile',type:'avatar',name:'Vui vẻ',emo:'😄',price:0},{id:'av_cat',type:'avatar',name:'Mèo',emo:'😺',price:300},
 {id:'av_cowboy',type:'avatar',name:'Cao bồi',emo:'🤠',price:200},{id:'av_fox',type:'avatar',name:'Cáo',emo:'🦊',price:400},{id:'av_panda',type:'avatar',name:'Gấu trúc',emo:'🐼',price:500},
 {id:'av_tiger',type:'avatar',name:'Hổ',emo:'🐯',price:600},{id:'av_robot',type:'avatar',name:'Rô-bốt',emo:'🤖',price:700},{id:'av_wizard',type:'avatar',name:'Phù thủy',emo:'🧙',price:800},
 {id:'av_ninja',type:'avatar',name:'Ninja',emo:'🥷',price:1000},{id:'av_dragon',type:'avatar',name:'Rồng',emo:'🐉',price:1500,lv:10},{id:'av_king',type:'avatar',name:'Vua bài',emo:'👑',price:3000,lv:15},
 {id:'fr_gold',type:'frame',name:'Viền Vàng',price:0},{id:'fr_silver',type:'frame',name:'Viền Bạc',price:300},{id:'fr_jade',type:'frame',name:'Viền Ngọc Bích',price:800},
 {id:'fr_ruby',type:'frame',name:'Viền Hồng Ngọc',price:1200},{id:'fr_diamond',type:'frame',name:'Viền Kim Cương',price:3000,lv:12},
 {id:'em_basic',type:'emote',name:'Biểu cảm cơ bản',list:['👍','😂','😮','😡','❤️','👏'],price:0},
 {id:'em_tease',type:'emote',name:'Cà khịa',list:['🤣','😏','🙏','💤','🤡','🔥'],price:500},
 {id:'em_talk',type:'emote',name:'Câu nói Tiến Lên',list:['Chặt nè!','Run chưa?','Hết bài chưa?','Đỉnh quá!','Nhanh lên nào!','Ván nữa không?'],price:800},
 {id:'fr_bronze',type:'frame',name:'Viền Đồng Cổ',price:2000,r:2,tag:'new'},{id:'fr_pearl',type:'frame',name:'Viền Ngọc Trai',price:3500,r:2,tag:'new'},{id:'fr_lotus',type:'frame',name:'Viền Sen Hồng',price:5000,r:2,tag:'new'},{id:'fr_bamboo',type:'frame',name:'Viền Trúc Xanh',price:6000,r:2,tag:'new'},{id:'fr_amethyst',type:'frame',name:'Viền Thạch Anh Tím',price:8000,r:2,tag:'new'},{id:'fr_ice',type:'frame',name:'Viền Băng Giá',price:20000,r:3,tag:'new'},{id:'fr_storm',type:'frame',name:'Viền Sấm Sét',price:30000,r:3,tag:'new'},{id:'fr_sunset',type:'frame',name:'Viền Hoàng Hôn',price:40000,r:3,tag:'new'},{id:'fr_emerald',type:'frame',name:'Viền Lục Bảo',price:50000,r:3,tag:'new',lv:15},{id:'fr_inferno',type:'frame',name:'Viền Hỏa Ngục',price:80000,r:3,tag:'new',lv:20},{id:'fr_laurel',type:'frame',name:'Vòng Nguyệt Quế Vàng',price:120000,r:4,tag:'new',lv:25},{id:'fr_galaxy',type:'frame',name:'Viền Thiên Hà',price:150000,r:4,tag:'new',lv:30},{id:'fr_phoenix',type:'frame',name:'Viền Phượng Hoàng',price:200000,r:4,tag:'new',lv:35},{id:'fr_jadedragon',type:'frame',name:'Viền Rồng Ngọc',price:250000,r:4,tag:'new',lv:40},{id:'fr_imperial',type:'frame',name:'Viền Hoàng Đế',price:350000,r:5,tag:'new',lv:45},{id:'fr_cosmos',type:'frame',name:'Viền Vũ Trụ Vô Cực',price:500000,r:5,tag:'new',lv:55},{id:'fr_godgold',type:'frame',name:'Viền Thần Bài Kim Long',price:500000,r:5,tag:'new',lv:60},{id:'fr_luoc',type:'frame',name:'Viền Nồi Luộc Thần',price:30000,r:3,tag:'new',badge:'luoc_3'},{id:'fr_master',type:'frame',name:'Viền Cao Thủ',price:60000,r:4,tag:'new',badge:'master25'},{id:'fr_top',type:'frame',name:'Viền Top Server',price:100000,r:5,tag:'new',badge:'lb3'},{id:'fr_xd',type:'frame',name:'Viền Ngũ Linh',price:40000,r:3,tag:'new',badge:'xd_nl'},
];
// ---- Mở rộng cửa hàng: độ hiếm r (1 Thường, 2 Hiếm, 3 Sử thi, 4 Huyền thoại), tag 'new'/'hot', css cho mặt sau/mặt bàn
const BK=(id,name,price,r,css,o)=>Object.assign({id,type:'back',name,price,r,css},o||{});
const FT=(id,name,price,r,f,o)=>Object.assign({id,type:'felt',name,price,r,f},o||{});
const AV=(id,name,emo,price,r,o)=>Object.assign({id,type:'avatar',name,emo,price,r},o||{});
SHOP.push(
 BK('back_sakura','Hoa Anh Đào',400,1,'radial-gradient(circle at 30% 30%,#fff5 0 3px,transparent 4px) 0 0/10px 10px,linear-gradient(160deg,#f48fb1,#ad1457)'),
 BK('back_ocean','Đại Dương',400,1,'repeating-radial-gradient(circle at 50% 120%,#ffffff22 0 3px,transparent 3px 8px),linear-gradient(180deg,#0288d1,#01579b)'),
 BK('back_carbon','Sợi Carbon',600,2,'repeating-linear-gradient(45deg,#333 0 3px,#1a1a1a 3px 6px)',{tag:'hot'}),
 BK('back_lotus','Sen Hồng',700,2,'radial-gradient(circle,#ffd6e8 0 18%,#ec407a 19% 30%,transparent 31%),linear-gradient(160deg,#2e7d32,#1b5e20)',{tag:'new'}),
 BK('back_aodai','Áo Dài',900,2,'repeating-linear-gradient(90deg,#ffeb3b33 0 2px,transparent 2px 9px),linear-gradient(160deg,#d32f2f,#7f0000)'),
 BK('back_galaxy','Thiên Hà',1500,3,'radial-gradient(circle at 20% 30%,#fff 0 1px,transparent 2px),radial-gradient(circle at 70% 60%,#fff 0 1px,transparent 2px),radial-gradient(circle at 40% 80%,#fff8 0 1px,transparent 2px),radial-gradient(ellipse at 50% 50%,#7c4dff,#1a0b3d 70%)',{tag:'hot'}),
 BK('back_neon','Neon Sài Gòn',1800,3,'repeating-linear-gradient(0deg,transparent 0 6px,#00e5ff55 6px 7px),repeating-linear-gradient(90deg,transparent 0 6px,#ff40ff55 6px 7px),#120022',{tag:'new'}),
 BK('back_jade','Ngọc Bích Hoàng Cung',2600,3,'radial-gradient(circle,#e9c45a 0 10%,transparent 11%),repeating-conic-gradient(#00695c 0 15deg,#004d40 15deg 30deg)'),
 BK('back_phoenix','Phượng Hoàng Lửa',4000,4,'radial-gradient(circle at 50% 45%,#fff59d 0 10%,#ff9800 20%,#d84315 45%,#3e0a00 80%)',{lv:15,tag:'hot'}),
 BK('back_emperor','Hoàng Đế',6000,4,'radial-gradient(circle,#fff3b0 0 8%,transparent 9%),repeating-conic-gradient(#b8860b 0 10deg,#5d4300 10deg 20deg)',{lv:20}),
 FT('felt_teal','Ngọc Lam',600,1,['#1fa39a','#137168','#0a4440','#062a27']),FT('felt_brown','Gỗ Sồi',600,1,['#8d6e63','#6d4c41','#4e342e','#2b1b16']),
 FT('felt_sky','Bầu Trời',900,2,['#4fc3f7','#0288d1','#01579b','#002f5e'],{tag:'new'}),FT('felt_rose','Hồng Phấn',900,2,['#f06292','#c2185b','#880e4f','#4a0429']),
 FT('felt_olive','Ô Liu Pháp',1200,2,['#9e9d24','#827717','#524c0f','#2c2906']),FT('felt_midnight','Nửa Đêm',2000,3,['#3949ab','#1a237e','#0d1240','#05081e'],{tag:'hot'}),
 FT('felt_lava','Dung Nham',3000,3,['#ff7043','#bf360c','#5d1600','#2a0a00']),FT('felt_gold','Sòng Vàng Macau',5000,4,['#d4af37','#9c7a1c','#5e4a10','#2e2408'],{lv:18,tag:'hot'}),
 AV('av_monkey','Khỉ con','🐵',300,1),AV('av_bear','Gấu nâu','🐻',300,1),AV('av_frog','Ếch xanh','🐸',300,1),AV('av_pig','Heo hồng','🐷',300,1,{tag:'hot'}),
 AV('av_chick','Gà con','🐥',300,1),AV('av_unicorn','Kỳ lân','🦄',900,2,{tag:'new'}),AV('av_alien','Người ngoài hành tinh','👽',900,2),AV('av_ghost','Bóng ma','👻',900,2),
 AV('av_clown','Chú hề','🤡',700,2),AV('av_vampire','Ma cà rồng','🧛',1200,3),AV('av_genie','Thần đèn','🧞',1500,3),AV('av_mermaid','Tiên cá','🧜',1500,3,{tag:'new'}),
 AV('av_astro','Phi hành gia','🧑‍🚀',1800,3),AV('av_lion','Sư tử','🦁',2000,3,{tag:'hot'}),AV('av_eagle','Đại bàng','🦅',2500,3),AV('av_phoenix','Phượng hoàng','🐦‍🔥',5000,4,{lv:20}),
 {id:'fr_wood',type:'frame',name:'Viền Gỗ',price:200,r:1},{id:'fr_sakura',type:'frame',name:'Viền Hoa',price:900,r:2,tag:'new'},{id:'fr_neon',type:'frame',name:'Viền Neon',price:1500,r:3},
 {id:'fr_fire',type:'frame',name:'Viền Lửa',price:2500,r:3,tag:'hot'},{id:'fr_dragon',type:'frame',name:'Viền Rồng Vàng',price:5000,r:4,lv:20},
 {id:'em_love',type:'emote',name:'Tình yêu',list:['😍','🥰','💕','😘','🌹','💌'],price:400,r:1},{id:'em_animal',type:'emote',name:'Thú cưng',list:['🐶','🐱','🐷','🐸','🐵','🐔'],price:500,r:1},
 {id:'em_rage',type:'emote',name:'Nổi giận',list:['🤬','😤','💢','👊','😭','🥶'],price:600,r:2},{id:'em_vn',type:'emote',name:'Nói kiểu Việt',list:['Hên thôi!','Xui quá trời','Đánh lẹ đi','Chơi đẹp nha','Gà quá!','Phục rồi đó'],price:900,r:2,tag:'new'},
 {id:'em_party',type:'emote',name:'Ăn mừng',list:['🎉','🥳','🍾','🎊','💃','🕺'],price:1200,r:3},{id:'em_boss',type:'emote',name:'Đại ca',list:['Thua đi cưng','Ai chơi lại?','Ván này của tui','Bài đẹp vậy đó','Nể chưa?','Ngồi im xem'],price:2000,r:3,tag:'hot'},
 {id:'deck_classic',type:'deck',name:'Bộ Cổ Điển',price:0,r:1},{id:'deck_vintage',type:'deck',name:'Giấy Cổ',price:800,r:2,css:'background:linear-gradient(160deg,#f6e7c1,#e0c48f)!important;filter:sepia(.25)'},
 {id:'deck_mint',type:'deck',name:'Bạc Hà',price:800,r:2,css:'background:linear-gradient(160deg,#eafff5,#bff0d9)!important'},
 {id:'deck_night',type:'deck',name:'Bóng Đêm',price:1800,r:3,css:'filter:invert(.92) hue-rotate(180deg)',tag:'new'},
 {id:'deck_royal',type:'deck',name:'Hoàng Gia Viền Vàng',price:3500,r:4,css:'background:linear-gradient(160deg,#fffdf3,#f5e6b8)!important;box-shadow:0 0 0 2px #c9962e inset,0 0 0 1px #6b4a00,0 3px 8px #000a!important',lv:12,tag:'hot'},
 {id:'fx_confetti',type:'fx',name:'Pháo Giấy',price:0,r:1,parts:null},{id:'fx_money',type:'fx',name:'Mưa Tiền',price:1200,r:2,parts:['💵','💰','🪙'],tag:'hot'},
 {id:'fx_hearts',type:'fx',name:'Mưa Tim',price:1000,r:2,parts:['❤️','💖','💕']},{id:'fx_stars',type:'fx',name:'Sao Băng',price:1600,r:3,parts:['⭐','🌟','✨']},
 {id:'fx_dragon',type:'fx',name:'Rồng Vàng Thăng Thiên',price:4500,r:4,parts:['🐉','🔥','🧧','✨'],lv:15,tag:'new'},
 {id:'bub_white',type:'bubble',name:'Bong Bóng Trắng',price:0,r:1,css:''},{id:'bub_gold',type:'bubble',name:'Bong Bóng Vàng',price:600,r:2,css:'background:linear-gradient(#fff3b0,#e9c45a);color:#3a2500'},
 {id:'bub_pink',type:'bubble',name:'Bong Bóng Hồng',price:500,r:1,css:'background:#ffd1e3;color:#880e4f'},{id:'bub_neon',type:'bubble',name:'Bong Bóng Neon',price:1400,r:3,css:'background:#120022;color:#7cf9ff;box-shadow:0 0 12px #ff40ff,0 0 0 2px #00e5ff'},
 {id:'bub_fire',type:'bubble',name:'Bong Bóng Lửa',price:2500,r:4,css:'background:linear-gradient(#ffcc80,#ff5722);color:#3e0a00;box-shadow:0 0 16px #ff5722'},
 {id:'nc_white',type:'name',name:'Tên Trắng',price:0,r:1,css:'color:#fff7dc'},{id:'nc_gold',type:'name',name:'Tên Vàng Kim',price:800,r:2,css:'color:#ffd84d;text-shadow:0 0 6px #ffb30088'},
 {id:'nc_cyan',type:'name',name:'Tên Băng Lam',price:800,r:2,css:'color:#7cf9ff;text-shadow:0 0 6px #00e5ff88'},{id:'nc_red',type:'name',name:'Tên Hỏa Long',price:1500,r:3,css:'background:linear-gradient(90deg,#ff5722,#ffd84d);-webkit-background-clip:text;background-clip:text;color:transparent'},
 {id:'nc_rainbow',type:'name',name:'Tên Cầu Vồng',price:3000,r:4,css:'background:linear-gradient(90deg,#ff5252,#ffd740,#69f0ae,#40c4ff,#e040fb);-webkit-background-clip:text;background-clip:text;color:transparent',tag:'hot'}
);
SHOP.forEach(x=>{if(!x.r)x.r=x.price===0?1:x.price>=2500?4:x.price>=1200?3:x.price>=500?2:1;});
const RARITY=[null,{name:'Thường',col:'#b0bec5'},{name:'Hiếm',col:'#42a5f5'},{name:'Sử thi',col:'#ab47bc'},{name:'Huyền thoại',col:'#ffb300'},{name:'Tối thượng',col:'#ff4081'}];
// Ưu đãi mỗi ngày: 1 món giảm 30% (xác định theo ngày)
function dailyDeal(day){const pool=SHOP.filter(x=>x.price>=300);let h=0;for(const c of String(day))h=(h*31+c.charCodeAt(0))>>>0;const it=pool[h%pool.length];return{id:it.id,price:Math.round(it.price*0.7/10)*10,off:30};}
function priceOf(id,day){const it=shopItem(id);if(!it)return null;const d=day!=null?dailyDeal(day):null;return d&&d.id===id?d.price:it.price;}
const AV_BGS=['#2b6cb0','#7b3fa0','#b5651d','#c2185b','#00897b','#3949ab','#ef6c00','#455a64','#8d1c1c','#1b5e20'];
const DEFAULT_EQUIP={back:'back_classic',felt:'felt_green',avatar:'av_cool',frame:'fr_gold',deck:'deck_classic',fx:'fx_confetti',bubble:'bub_white',name:'nc_white'};
function shopItem(id){return SHOP.find(x=>x.id===id);}
function ensureInv(P){P.inv=P.inv||{};P.equip=Object.assign({},DEFAULT_EQUIP,P.equip||{});if(!P.avBg)P.avBg=AV_BGS[0];return P;}
function owns(P,id){const it=shopItem(id);return !!it&&(it.price===0||!!(P.inv&&P.inv[id]));}
function buyItem(P,id,level,day){ensureInv(P);const it=shopItem(id);if(!it)return{ok:false,reason:'Không có vật phẩm'};
 if(owns(P,id))return{ok:false,reason:'Đã sở hữu'};if(it.lv&&(level||1)<it.lv)return{ok:false,reason:'Cần cấp '+it.lv};if(it.badge&&!(P.badges&&P.badges[it.badge]))return{ok:false,reason:'Cần huy hiệu'};
 const pr=priceOf(id,day);if(P.xu<pr)return{ok:false,reason:'Không đủ xu'};P.xu-=pr;P.inv[id]=Date.now();return{ok:true};}
function equipItem(P,id){ensureInv(P);const it=shopItem(id);if(!it||it.type==='emote'||!owns(P,id))return false;P.equip[it.type]=id;return true;}
function equipped(P,type){ensureInv(P);const id=P.equip[type];return shopItem(owns(P,id)?id:DEFAULT_EQUIP[type]);}
function myEmotes(P){return SHOP.filter(x=>x.type==='emote'&&owns(P,x.id)).flatMap(x=>x.list);}
// SHOP_END
if(typeof module!=='undefined')module.exports={RARITY,dailyDeal,priceOf,SHOP,AV_BGS,DEFAULT_EQUIP,shopItem,ensureInv,owns,buyItem,equipItem,equipped,myEmotes};
