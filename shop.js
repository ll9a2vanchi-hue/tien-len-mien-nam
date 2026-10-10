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
];
const AV_BGS=['#2b6cb0','#7b3fa0','#b5651d','#c2185b','#00897b','#3949ab','#ef6c00','#455a64','#8d1c1c','#1b5e20'];
const DEFAULT_EQUIP={back:'back_classic',felt:'felt_green',avatar:'av_cool',frame:'fr_gold'};
function shopItem(id){return SHOP.find(x=>x.id===id);}
function ensureInv(P){P.inv=P.inv||{};P.equip=Object.assign({},DEFAULT_EQUIP,P.equip||{});if(!P.avBg)P.avBg=AV_BGS[0];return P;}
function owns(P,id){const it=shopItem(id);return !!it&&(it.price===0||!!(P.inv&&P.inv[id]));}
function buyItem(P,id,level){ensureInv(P);const it=shopItem(id);if(!it)return{ok:false,reason:'Không có vật phẩm'};
 if(owns(P,id))return{ok:false,reason:'Đã sở hữu'};if(it.lv&&(level||1)<it.lv)return{ok:false,reason:'Cần cấp '+it.lv};
 if(P.xu<it.price)return{ok:false,reason:'Không đủ xu'};P.xu-=it.price;P.inv[id]=Date.now();return{ok:true};}
function equipItem(P,id){ensureInv(P);const it=shopItem(id);if(!it||it.type==='emote'||!owns(P,id))return false;P.equip[it.type]=id;return true;}
function equipped(P,type){ensureInv(P);const id=P.equip[type];return shopItem(owns(P,id)?id:DEFAULT_EQUIP[type]);}
function myEmotes(P){return SHOP.filter(x=>x.type==='emote'&&owns(P,x.id)).flatMap(x=>x.list);}
// SHOP_END
if(typeof module!=='undefined')module.exports={SHOP,AV_BGS,DEFAULT_EQUIP,shopItem,ensureInv,owns,buyItem,equipItem,equipped,myEmotes};
