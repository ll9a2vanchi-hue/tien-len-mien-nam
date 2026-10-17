// EXTRAS_START
// ---- Phạt rời bàn ----
function exitPenalty(bet){return Math.ceil(bet||0);}
function applyExitPenalty(P,bet){const n=Math.min(P.xu,exitPenalty(bet==null?P.bet:bet));P.xu-=n;P.stats&&(P.stats.quits=(P.stats.quits||0)+1);return n;}
// ---- Vòng quay may mắn ----
const SPIN_COST=200;
const SPIN_PRIZES=[
 {id:'x50',label:'50 xu',xu:50,w:22,col:'#2e7d32'},{id:'x100',label:'100 xu',xu:100,w:20,col:'#1565c0'},{id:'xp50',label:'50 XP',xp:50,w:16,col:'#6a1b9a'},
 {id:'x200',label:'200 xu',xu:200,w:12,col:'#ef6c00'},{id:'item',label:'Vật phẩm',item:true,w:10,col:'#ad1457'},{id:'spin',label:'+1 lượt',spin:1,w:8,col:'#00838f'},
 {id:'xp150',label:'150 XP',xp:150,w:7,col:'#4527a0'},{id:'x500',label:'500 xu',xu:500,w:4,col:'#c62828'},{id:'emo',label:'Biểu cảm',emote:true,w:3,col:'#558b2f'},{id:'x2000',label:'2K xu',xu:2000,w:1,col:'#b8860b'}];
function dk(d){d=d||new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function ensureSpin(P,now){P.spin=P.spin||{day:null,used:0,extra:0,total:0};if(P.spin.day!==dk(now)){P.spin.day=dk(now);P.spin.used=0;}return P.spin;}
function spinState(P,now){const s=ensureSpin(P,now);return{free:s.used<1,extra:s.extra,can:s.used<1||s.extra>0};}
function buySpin(P,now){ensureSpin(P,now);if(P.xu<SPIN_COST)return false;P.xu-=SPIN_COST;P.spin.extra++;return true;}
function pickPrize(rng){const tot=SPIN_PRIZES.reduce((a,p)=>a+p.w,0);let r=(rng||Math.random)()*tot;for(let i=0;i<SPIN_PRIZES.length;i++){r-=SPIN_PRIZES[i].w;if(r<0)return i;}return 0;}
// Trả {idx,prize,got:{xu,xp,item,spin}} hoặc null nếu hết lượt. Vật phẩm: chọn món chưa có (Thường/Hiếm); đã có hết -> 300 xu
function doSpin(P,now,rng,level){const s=ensureSpin(P,now);if(s.used<1)s.used=1;else if(s.extra>0)s.extra--;else return null;s.total=(s.total||0)+1;
 const idx=pickPrize(rng),pz=SPIN_PRIZES[idx],got={};
 if(pz.xu){P.xu+=pz.xu;got.xu=pz.xu;}if(pz.xp){got.xp=pz.xp;got.lv=typeof addXp==='function'?addXp(P,pz.xp):null;}if(pz.spin){s.extra+=pz.spin;got.spin=pz.spin;}
 if(pz.item||pz.emote){const pool=SHOP.filter(x=>x.price>0&&!owns(P,x.id)&&(pz.emote?x.type==='emote':(x.type!=='emote'&&(x.r||1)<=2&&x.price<=5000)));
  if(pool.length){const it=pool[Math.floor((rng||Math.random)()*pool.length)];ensureInv(P);P.inv[it.id]=Date.now();got.item=it.id;}else{P.xu+=300;got.xu=300;}}
 return{idx,prize:pz,got};}
// ---- Ném đồ / tặng quà ----
const THROWS=[
 {id:'egg',name:'Ném trứng',emo:'🥚',splat:'🍳',cost:2,snd:'splat'},{id:'tomato',name:'Cà chua',emo:'🍅',splat:'💥',cost:2,snd:'splat'},
 {id:'slipper',name:'Ném dép',emo:'🩴',splat:'💫',cost:3,snd:'thud'},{id:'water',name:'Tạt nước',emo:'💧',splat:'💦',cost:3,snd:'splat'},
 {id:'durian',name:'Sầu riêng',emo:'🍈',splat:'🤢',cost:4,snd:'thud'},{id:'chili',name:'Ớt cay',emo:'🌶️',splat:'🔥',cost:4,snd:'splat'},
 {id:'flower',name:'Tặng hoa',emo:'🌹',splat:'💐',cost:5,snd:'chime',nice:true},{id:'beer',name:'Mời bia',emo:'🍺',splat:'🍻',cost:5,snd:'chime',nice:true},
 {id:'kiss',name:'Hun một cái',emo:'💋',splat:'😘',cost:10,snd:'chime',nice:true,prem:true},{id:'cake',name:'Bánh kem',emo:'🎂',splat:'🥳',cost:10,snd:'splat',prem:true},
 {id:'firework',name:'Pháo hoa',emo:'🎆',splat:'🎇',cost:10,snd:'boom',nice:true,prem:true},{id:'bomb',name:'Quả bom',emo:'💣',splat:'💥',cost:10,snd:'boom',prem:true},
 {id:'ring',name:'Nhẫn kim cương',emo:'💍',splat:'💎',cost:20,snd:'chime',nice:true,prem:true}];
function throwItem(P,id){const t=THROWS.find(x=>x.id===id);if(!t)return{ok:false,reason:'Không có'};if(P.xu<t.cost)return{ok:false,reason:'Không đủ xu'};P.xu-=t.cost;P.stats&&(P.stats.throws=(P.stats.throws||0)+1);return{ok:true,t};}
// ---- Sảnh bàn công khai (từ presence) ----
const LOBBY_TIERS=[100,500,1000,5000],TABLES_PER_TIER=5;
function publicTables(){const L=[];LOBBY_TIERS.forEach((b,t)=>{for(let i=0;i<TABLES_PER_TIER;i++)L.push({id:'ABCD'[t]+(i+1),code:'PUB'+'ABCD'[t]+'23456789'[i]+'Z',tier:b});});return L;}
// pres: [{uid,name,av,bg,lv,table,at,bet,playing}] -> danh sách bàn có người ngồi, host = người vào sớm nhất (hòa: uid nhỏ)
function lobbyTables(pres){const T=publicTables().map(t=>Object.assign({},t,{players:[],host:null,bet:t.tier,status:'trống'}));
 (pres||[]).forEach(p=>{const t=T.find(x=>x.code===p.table);if(t&&!t.players.find(q=>q.uid===p.uid))t.players.push(p);});
 T.forEach(t=>{t.players.sort((a,b)=>(a.at||0)-(b.at||0)||(a.uid<b.uid?-1:1));t.players=t.players.slice(0,4);t.host=t.players[0]?t.players[0].uid:null;
  const h=t.players[0];if(h&&h.bet)t.bet=h.bet;t.count=t.players.length;t.status=!t.count?'trống':(h.playing?'đang chơi':(t.count>=4?'đủ người':'đang chờ'));});return T;}
function canChangeBet(table,uid){return !!table&&table.host===uid;}
function canSit(table,P,uid){if(!table)return{ok:false,reason:'Không có bàn'};if(table.players.find(p=>p.uid===uid))return{ok:true};if(table.count>=4)return{ok:false,reason:'Bàn đã đủ 4 người'};if(P.xu<table.bet)return{ok:false,reason:'Không đủ xu cho mức cược '+table.bet};return{ok:true};}
// EXTRAS_END
if(typeof module!=='undefined')module.exports={exitPenalty,applyExitPenalty,SPIN_COST,SPIN_PRIZES,ensureSpin,spinState,buySpin,pickPrize,doSpin,THROWS,throwItem,LOBBY_TIERS,publicTables,lobbyTables,canChangeBet,canSit,dk};
