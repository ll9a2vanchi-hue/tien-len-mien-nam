// ONLINE_START
// Lõi chơi online (không phụ thuộc DOM). Host giữ trạng thái chuẩn; client gửi ý định (intent).
// transport: {send(event,payload), on(event,cb)}  — với Supabase là broadcast trên channel 'tlmn:room:CODE'.
const ROOM_CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function roomCode(rng){rng=rng||Math.random;let s='';for(let i=0;i<6;i++)s+=ROOM_CHARS[Math.floor(rng()*ROOM_CHARS.length)];return s;}
function validCode(c){return typeof c==='string'&&/^[A-HJ-NP-Z2-9]{6}$/.test(c);}
const OBOTS=['Tuấn','Lan','Hùng','Mai','Minh','Ngọc','Phúc','Thảo'];
function shuffleDeck(rng){rng=rng||Math.random;const d=[...Array(52).keys()];for(let i=51;i>0;i--){const j=Math.floor(rng()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
function seatName(st,i){const s=st.seats[i];return s?s.name+(s.bot&&s.uid?' (máy)':''):'?';}
function cardTxt(cards){const R=['3','4','5','6','7','8','9','10','J','Q','K','A','2'],S=['♠','♣','♦','♥'];return sortCards(cards).map(c=>R[c>>2]+S[c&3]).join(' ');}
// Tạo ván mới. seats: [{uid,name,...,bot}] dài 4 (null = trống → bỏ qua ghế)
function oDeal(seats,lastWinnerUid,rng){const deck=shuffleDeck(rng),act=seats.map((s,i)=>s?i:-1).filter(i=>i>=0);
 const hands=[[],[],[],[]];act.forEach((p,k)=>hands[p]=sortCards(deck.slice(k*13,k*13+13)));
 const st={v:1,seats,hands,cur:null,curBy:null,pile:[],prev:[],hist:[],passed:[0,0,0,0],finished:[],turn:0,first:false,over:false,started:true,ev:null,rank:null,instant:null};
 for(const p of act){const w=instantWin(hands[p]);if(w){st.over=true;st.instant={seat:p,why:w};st.rank=[p,...act.filter(x=>x!==p)];st.ev={kind:'instant',seat:p,why:w};return st;}}
 const lw=lastWinnerUid!=null?act.find(p=>seats[p].uid===lastWinnerUid):undefined;
 if(lw!==undefined)st.turn=lw;else{let low=99,who=act[0];for(const p of act){const m=Math.min(...hands[p]);if(m<low){low=m;who=p;}}st.turn=who;st.first=true;st.firstCard=low;}
 st.hist.push({txt:`${seatName(st,st.turn)} đánh trước`,cls:'ps'});return st;}
function oActive(st){return [0,1,2,3].filter(p=>st.seats[p]&&st.hands[p].length>0);}
function oNext(st){let p=st.turn;for(let k=0;k<4;k++){p=(p+1)%4;if(!st.seats[p])continue;if(st.hands[p].length===0&&p!==st.curBy)continue;
  if(p===st.curBy){st.cur=null;st.passed=[0,0,0,0];if(st.hands[p].length===0){let q=p;do{q=(q+1)%4}while(!st.seats[q]||st.hands[q].length===0);st.turn=q;}else st.turn=p;
   st.curBy=null;st.prev=st.pile;st.pile=[];st.hist=[{txt:`— Vòng mới: ${seatName(st,st.turn)} cầm cái —`,cls:'ps'}];return;}
  if(st.passed[p]||st.hands[p].length===0)continue;st.turn=p;return;}}
// Áp dụng hành động của ghế `seat`. Trả {ok,err}
function oAct(st,seat,a){if(!st||st.over)return{ok:false,err:'Ván đã kết thúc'};if(seat!==st.turn)return{ok:false,err:'Chưa tới lượt'};
 if(a.type==='pass'){if(!st.cur)return{ok:false,err:'Bạn đang cầm cái, phải đánh'};st.passed[seat]=1;st.hist.push({txt:`${seatName(st,seat)} bỏ lượt`,cls:'ps'});st.ev={kind:'pass',seat};oNext(st);return{ok:true};}
 const cards=(a.cards||[]).map(Number);if(!cards.length||new Set(cards).size!==cards.length||!cards.every(c=>st.hands[seat].includes(c)))return{ok:false,err:'Bài không hợp lệ'};
 const info=detect(cards);if(!info)return{ok:false,err:'Bộ bài không hợp lệ'};if(st.first&&!cards.includes(st.firstCard))return{ok:false,err:'Phải đánh kèm lá nhỏ nhất'};
 if(!canBeat(info,st.cur))return{ok:false,err:'Không chặn được bài trên bàn'};
 const prev=st.cur,prevBy=st.curBy,prevCards=st.pile,chop=!!(prev&&info.type!==prev.type),heo=chop&&(prev.top>>2)===12;
 st.hands[seat]=st.hands[seat].filter(c=>!cards.includes(c));
 st.hist.push({txt:prev?`<b>${seatName(st,seat)}</b>: ${cardTxt(cards)} ${chop?'<b>CHẶT</b>':'ăn'} ${cardTxt(prevCards)} của ${seatName(st,prevBy)}`:`<b>${seatName(st,seat)}</b> đánh: ${cardTxt(cards)}`,cls:chop?'chop':''});
 st.cur=info;st.curBy=seat;st.prev=prevCards;st.pile=sortCards(cards);st.first=false;st.ev={kind:'play',seat,info,prev,chop,heo,cards};
 if(st.hands[seat].length===0){st.finished.push(seat);st.hist.push({txt:`🏁 ${seatName(st,seat)} về ${['nhất','nhì','ba','bét'][st.finished.length-1]}!`,cls:''});st.ev.fin=st.finished.length;}
 const act=oActive(st);if(st.hands[seat].length===0&&act.length<=1){st.finished.push(...act);st.over=true;st.rank=st.finished.slice();return{ok:true};}
 oNext(st);return{ok:true};}
function oBotMove(st){const p=st.turn,others=oActive(st).filter(q=>q!==p).map(q=>st.hands[q].length);
 const m=botMove(st.hands[p],st.cur,st.first?st.firstCard:null,others);if(m)return{type:'play',cards:m};if(!st.cur)return{type:'play',cards:[st.hands[p][0]]};return{type:'pass'};}
// ---- Host ----
class OnlineHost{
 constructor(tr,me,opt){this.tr=tr;this.me=me;this.opt=Object.assign({fillBots:true,botDelay:900,turnMs:30000},opt||{});this.players=[me];this.seats=[null,null,null,null];this.st=null;this.lastWinner=null;this.timer=null;this.rev=0;
  tr.on('intent',m=>this.onIntent(m));tr.on('hello',m=>this.addPlayer(m));this.assign();}
 addPlayer(p){if(!p||!p.uid)return;const i=this.players.findIndex(x=>x.uid===p.uid);if(i>=0)this.players[i]=Object.assign(this.players[i],p,{gone:false});else{if(this.players.filter(x=>!x.gone).length>=4)return this.tr.send('full',{uid:p.uid});this.players.push(p);}
  if(this.st&&!this.st.over){const s=this.st.seats.findIndex(x=>x&&x.uid===p.uid);if(s>=0){this.st.seats[s]=Object.assign({},this.st.seats[s],{bot:false});this.push();return;}}
  this.assign();this.push();}
 removePlayer(uid){const p=this.players.find(x=>x.uid===uid);if(!p)return;p.gone=true;
  if(this.st&&!this.st.over){const s=this.st.seats.findIndex(x=>x&&x.uid===uid);if(s>=0){this.st.seats[s]=Object.assign({},this.st.seats[s],{bot:true});this.st.hist.push({txt:`${this.st.seats[s].name} mất kết nối — máy chơi thay`,cls:'ps'});this.push();this.tick();}}
  else{this.players=this.players.filter(x=>x.uid!==uid);this.assign();this.push();}}
 assign(){const ps=this.players.filter(x=>!x.gone);this.seats=[0,1,2,3].map(i=>ps[i]?Object.assign({},ps[i],{bot:false}):null);}
 room(){return{bet:this.opt.bet||null,host:this.me.uid,seats:this.seats,fillBots:this.opt.fillBots,playing:!!(this.st&&!this.st.over)};}
 start(rng){if(this.st&&!this.st.over)return false;this.assign();const humans=this.seats.filter(Boolean).length;if(humans<2&&!this.opt.fillBots)return false;
  const seats=this.seats.slice();if(this.opt.fillBots){let k=0;for(let i=0;i<4;i++)if(!seats[i]){seats[i]={uid:null,name:OBOTS[(k++ +humans)%OBOTS.length],bot:true,av:'🤖',lv:5};}}
  if(seats.filter(Boolean).length<2)return false;this.st=oDeal(seats,this.lastWinner,rng);if(this.st.over)this.finish();this.push();this.tick();return true;}
 onIntent(m){if(!this.st||!m)return;const seat=this.st.seats.findIndex(s=>s&&s.uid===m.uid);if(seat<0)return;const r=oAct(this.st,seat,m.a||{});
  if(!r.ok){this.tr.send('reject',{uid:m.uid,err:r.err});return;}if(this.st.over)this.finish();this.push();this.tick();}
 finish(){const w=this.st.rank&&this.st.seats[this.st.rank[0]];this.lastWinner=w?w.uid:null;clearTimeout(this.timer);}
 tick(){clearTimeout(this.timer);const st=this.st;if(!st||st.over)return;const s=st.seats[st.turn];const auto=()=>{if(this.st!==st||st.over)return;oAct(st,st.turn,oBotMove(st));if(st.over)this.finish();this.push();this.tick();};
  this.timer=setTimeout(auto,s&&s.bot?this.opt.botDelay:this.opt.turnMs);}
 push(){this.rev++;this.tr.send('room',Object.assign(this.room(),{rev:this.rev}));if(this.st)this.tr.send('state',{rev:this.rev,st:this.st});if(this.onState)this.onState(this.st,this.room());}
 stop(){clearTimeout(this.timer);}
 resume(st,players,rev){this.st=st;this.rev=(rev||0)+1;this.players=players.slice();if(!this.players.find(x=>x.uid===this.me.uid))this.players.unshift(this.me);
  if(st&&!st.over){st.seats.forEach((x,i)=>{if(x&&x.uid&&!this.players.find(p=>p.uid===x.uid&&!p.gone))st.seats[i]=Object.assign({},x,{bot:true});});}this.push();this.tick();}
}
// ---- Client ----
class OnlineClient{
 constructor(tr,me){this.tr=tr;this.me=me;this.st=null;this.room=null;this.rev=0;
  tr.on('state',m=>{if(m&&m.rev>=this.rev){this.rev=m.rev;this.st=m.st;this.onState&&this.onState(this.st);}});
  tr.on('room',m=>{if(m){this.room=m;this.onRoom&&this.onRoom(m);}});
  tr.on('reject',m=>{if(m&&m.uid===me.uid&&this.onReject)this.onReject(m.err);});
  tr.on('full',m=>{if(m&&m.uid===me.uid&&this.onFull)this.onFull();});}
 hello(){this.tr.send('hello',this.me);}
 mySeat(){return this.st?this.st.seats.findIndex(s=>s&&s.uid===this.me.uid):-1;}
 play(cards){this.tr.send('intent',{uid:this.me.uid,a:{type:'play',cards}});}
 pass(){this.tr.send('intent',{uid:this.me.uid,a:{type:'pass'}});}
}
// Khi host rời: chọn host mới = người thật còn lại có uid nhỏ nhất (mọi client tính giống nhau)
function electHost(uids){return uids.filter(Boolean).slice().sort()[0]||null;}
// Bộ chuyển Supabase Realtime channel -> transport (gọi on() trước subscribe())
function rtTransport(ch){return{send:(e,p)=>ch.send({type:'broadcast',event:e,payload:p}),on:(e,cb)=>ch.on('broadcast',{event:e},m=>cb(m.payload))};}
// ONLINE_END
if(typeof module!=='undefined')module.exports={rtTransport,roomCode,validCode,oDeal,oAct,oNext,oActive,oBotMove,OnlineHost,OnlineClient,electHost,shuffleDeck};
