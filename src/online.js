// ---------- Chơi online với bạn bè (Supabase Realtime, kênh riêng tư 'tlmn:*') ----------
const ONL={active:false,code:null,ch:null,tr:null,host:null,client:null,me:null,st:null,room:null,lastRev:-1,rewarded:null,lastEvKey:null,presence:[],chat:[]};
let LOBBY=null,MYCODE=null;
function meInfo(){const L=levelInfo(PR.xp);return{uid:USER.id,name:PR.name||(USER.email||'').split('@')[0].slice(0,16)||'Người chơi',av:myAv(),bg:PR.avBg,frame:equipped(PR,'frame').id,lv:L.level,title:currentTitle(PR).name,tier:currentTitle(PR).tier};}
function needLogin(){if(!CLOUD_ON){modal(`<h3>${I('friends')} Chơi với bạn bè</h3><p>Máy chủ online chưa được cấu hình.</p>`);return true;}
 if(navigator.onLine===false){modal(`<h3>${I('friends')} Chơi với bạn bè</h3><p>Bạn đang offline. Hãy kết nối mạng để chơi online.</p>`);return true;}
 if(!USER){modal(`<h3>${I('friends')} Chơi với bạn bè</h3><p>Cần <b>đăng nhập</b> để chơi online, kết bạn và trò chuyện.</p><button onclick="openAccount()">${I('user')} Đăng nhập / Đăng ký</button>`);return true;}return false;}
async function ensurePlayer(){const m=meInfo();let {data}=await SB.from('tlmn_players').select('code').eq('user_id',USER.id).maybeSingle();
 const row={user_id:USER.id,name:m.name,avatar:{av:m.av,bg:m.bg,frame:m.frame},level:m.lv,title:m.title,updated_at:new Date().toISOString(),...(typeof lbStats==='function'?lbStats():{})};
 if(data){MYCODE=data.code;await SB.from('tlmn_players').update(row).eq('user_id',USER.id);return;}
 for(let i=0;i<5;i++){const code=roomCode();const r=await SB.from('tlmn_players').insert(Object.assign({code},row));if(!r.error){MYCODE=code;return;}}}
function chan(topic){return SB.channel(topic,{config:{private:true,broadcast:{self:false},presence:{key:USER.id}}});}
function mkTr(ch){const H={};const tr={_H:H,_ch:ch,send:(e,p)=>tr._ch.send({type:'broadcast',event:e,payload:p}),on:(e,cb)=>(H[e]=H[e]||[]).push(cb),
  bind(c){tr._ch=c;c.on('broadcast',{event:'*'},m=>{(H[m.event]||[]).forEach(cb=>{try{cb(m.payload);}catch(e){console.error(e);}});});}};tr.bind(ch);return tr;}
async function rtAuth(){try{const {data}=await SB.auth.getSession();if(data.session)SB.realtime.setAuth(data.session.access_token);}catch(e){}}
// ----- Sảnh: bạn bè online + lời mời -----
async function joinLobby(){if(LOBBY)return;await rtAuth();const ch=chan('tlmn:lobby');LOBBY={ch,online:{}};
 ch.on('presence',{event:'sync'},()=>{const s=ch.presenceState();LOBBY.online={};Object.keys(s).forEach(k=>LOBBY.online[k]=1);if($('frList'))renderFriends();});
 ch.on('broadcast',{event:'invite'},m=>{const p=m.payload;if(p&&p.to===USER.id&&!ONL.active){sfx('turn');modal(`<h3>${I('friends')} Lời mời chơi</h3><p><b>${esc(p.name)}</b> mời bạn vào phòng <b>${esc(p.code)}</b>.</p><button onclick="closeModal();joinRoom('${esc(p.code)}')">Vào phòng</button><button class="alt" onclick="closeModal()">Để sau</button>`);}});
 ch.subscribe(async s=>{if(s==='SUBSCRIBED')await ch.track({uid:USER.id,t:Date.now()});});}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function openOnline(){if(!CLOUD_ON||!USER){if(CLOUD_ON&&navigator.onLine!==false){try{await loadSB();const {data}=await SB.auth.getSession();USER=data.session&&data.session.user||null;}catch(e){}}}
 if(needLogin())return;modal(`<h3>${I('friends')} Chơi với bạn bè</h3><p class="small">Đang kết nối…</p>`);
 try{await ensurePlayer();joinLobby();}catch(e){}
 modal(`<h3>${I('friends')} Chơi với bạn bè</h3>
 <div class="row" style="flex-direction:column;align-items:stretch"><b>Tạo phòng mới</b><label class="small"><input type="checkbox" id="oBots" checked> Thêm máy vào ghế trống</label><button onclick="createRoom()">${I('friends')} Tạo phòng</button></div>
 <div class="row" style="flex-direction:column;align-items:stretch"><b>Vào phòng bằng mã</b><input class="inp" id="oCode" maxlength="6" placeholder="Mã 6 ký tự" style="text-transform:uppercase;letter-spacing:4px;text-align:center"><button class="alt" onclick="joinRoom(($('oCode').value||'').trim().toUpperCase())">Vào phòng</button></div>
 <h4>Bạn bè <small class="small">· Mã của bạn: <b style="letter-spacing:2px">${MYCODE||'…'}</b></small></h4><div id="frList" class="small">Đang tải…</div>
 <div class="row"><input class="inp" id="frCode" maxlength="6" placeholder="Mã bạn bè" style="flex:1;text-transform:uppercase"><button class="alt" onclick="addFriend()">Kết bạn</button></div>`);
 renderFriends();}
let FR=[];
async function renderFriends(){const el=$('frList');if(!el)return;const {data,error}=await SB.from('tlmn_friends').select('user_id,friend_id,status');if(error){el.textContent='Lỗi: '+error.message;return;}
 const ids=[...new Set((data||[]).map(r=>r.user_id===USER.id?r.friend_id:r.user_id))];let P={};
 if(ids.length){const r=await SB.from('tlmn_players').select('user_id,name,avatar,level,title').in('user_id',ids);(r.data||[]).forEach(p=>P[p.user_id]=p);}
 FR=(data||[]).map(r=>{const other=r.user_id===USER.id?r.friend_id:r.user_id;return{id:other,p:P[other]||{name:'?',avatar:{},level:1},status:r.status,incoming:r.friend_id===USER.id};});
 if(!$('frList'))return;
 $('frList').innerHTML=FR.length?FR.map(f=>{const on=LOBBY&&LOBBY.online[f.id];return `<div class="row"><div class="av" style="--avc:${esc(f.p.avatar.bg||'#456')};width:36px;height:36px;font-size:20px">${esc(f.p.avatar.av||'🙂')}</div><div style="flex:1"><b>${esc(f.p.name)}</b> <span class="lvb">${f.p.level}</span><br><small>${f.status==='pending'?(f.incoming?'Muốn kết bạn':'Đã gửi lời mời'):(on?'<span style="color:#7fe0a8">● Đang online</span>':'Offline')}</small></div>
  ${f.status==='pending'&&f.incoming?`<button onclick="acceptFriend('${f.id}')">Đồng ý</button>`:''}${f.status==='accepted'&&ONL.active&&ONL.code?`<button class="alt" onclick="inviteFriend('${f.id}')">Mời</button>`:''}<button class="alt ic" title="Xóa" onclick="removeFriend('${f.id}')">✕</button></div>`;}).join(''):'Chưa có bạn bè. Gửi mã của bạn cho bạn bè để kết bạn!';}
async function addFriend(){const c=($('frCode').value||'').trim().toUpperCase();if(!validCode(c))return toast('Mã không hợp lệ');
 const {data}=await SB.from('tlmn_players').select('user_id,name').eq('code',c).maybeSingle();if(!data)return toast('Không tìm thấy người chơi');if(data.user_id===USER.id)return toast('Đây là mã của bạn');
 const r=await SB.from('tlmn_friends').insert({user_id:USER.id,friend_id:data.user_id});toast(r.error?(r.error.code==='23505'?'Đã gửi lời mời trước đó':'Lỗi: '+r.error.message):`Đã gửi lời mời kết bạn tới ${esc(data.name)}`);renderFriends();}
async function acceptFriend(id){const r=await SB.from('tlmn_friends').update({status:'accepted'}).eq('user_id',id).eq('friend_id',USER.id);if(r.error)toast('Lỗi: '+r.error.message);renderFriends();}
async function removeFriend(id){if(!confirm('Xóa bạn này?'))return;await SB.from('tlmn_friends').delete().or(`and(user_id.eq.${USER.id},friend_id.eq.${id}),and(user_id.eq.${id},friend_id.eq.${USER.id})`);renderFriends();}
function inviteFriend(id){if(!LOBBY)return;LOBBY.ch.send({type:'broadcast',event:'invite',payload:{to:id,from:USER.id,name:ONL.me.name,code:ONL.code}});toast('Đã gửi lời mời');}
// ----- Phòng -----
function shareLink(){return location.origin+location.pathname+'?room='+ONL.code;}
async function createRoom(){const bots=$('oBots')?$('oBots').checked:true;await enterRoom(roomCode(),true,bots);}
async function joinRoom(code){if(!validCode(code))return toast('Mã phòng không hợp lệ');if(needLogin())return;await enterRoom(code,false,true);}
async function enterRoom(code,isHost,bots){if(ONL.active)await leaveRoom(true);await loadSB();await rtAuth();try{await ensurePlayer();}catch(e){}joinLobby();
 Object.assign(ONL,{active:true,code,me:meInfo(),host:null,client:null,st:null,room:null,lastRev:-1,rewarded:null,lastEvKey:null,presence:[],chat:[]});
 const ch=chan('tlmn:room:'+code),tr=mkTr(ch);ONL.ch=ch;ONL.tr=tr;
 ONL.client=new OnlineClient(tr,ONL.me);ONL.client.onState=s=>onlineState(s);ONL.client.onRoom=r=>{ONL.room=r;renderRoom();};ONL.client.onReject=e=>{sfx('bad');msg(e);};ONL.client.onFull=()=>{toast('Phòng đã đủ 4 người');leaveRoom(true);};
 tr.on('chat',m=>addChat(m));tr.on('emote',m=>{const ls=localSeatOf(m.uid);if(ls>=0)showEmote(ls,String(m.e).slice(0,24));});
 tr.on('bye',m=>onPresenceLeave(m.uid));tr.on('throw',m=>{if(!m||!ONL.st)return;const f=localSeatOf(m.from),me=ONL.st.seats.findIndex(s=>s&&s.uid===USER.id);let to=localSeatOf(m.to);if(to<0&&/^seat\d$/.test(m.to||''))to=(+m.to.slice(4)-me+4)%4;if(f>=0&&to>=0){throwFX(f,to,m.id);const t=THROWS.find(x=>x.id===m.id);if(t)toast(`${t.emo} ${esc(NAMES[f]||'')} ${throwVerb(t)} ${to===0?'bạn':esc(NAMES[to]||'')}`);}});
 if(isHost){ONL.host=new OnlineHost(tr,ONL.me,{fillBots:bots,dealMs:2300,bet:(BETS2||[]).includes(PR.bet)&&(typeof hiBetOk!=='function'||hiBetOk(PR,PR.bet,'tlmn'))?PR.bet:100});ONL.host.onState=(s,r)=>{ONL.room=r;renderRoom();if(s)onlineState(s,true);};}
 ch.on('presence',{event:'sync'},()=>{const s=ch.presenceState();ONL.presence=Object.keys(s);});
 ch.on('presence',{event:'leave'},({key})=>onPresenceLeave(key));
 ch.on('presence',{event:'join'},({key})=>{if(ONL.host&&key!==USER.id)setTimeout(()=>ONL.host&&ONL.host.push(),300);});
 closeModal();document.body.classList.add('athome');$('home').innerHTML=`<div class="hwrap"><h3>Đang vào phòng ${code}…</h3></div>`;
 ch.subscribe(async st=>{if(st==='SUBSCRIBED'){await ch.track({uid:USER.id,name:ONL.me.name,at:ONL.joinAt||Date.now(),spec:!!ONL.me.spec});if(ONL.host){ONL.room=ONL.host.room();ONL.host.push();renderRoom();}else{ONL.client.hello();setTimeout(()=>{if(!ONL.room&&ONL.active){$('home').innerHTML=`<div class="hwrap"><h3>Không tìm thấy phòng ${code}</h3><p class="small">Chủ phòng có thể đã rời đi.</p><button onclick="leaveRoom(true)">Quay lại</button></div>`;}},6000);}}
  else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'){toast('Không kết nối được phòng ('+st+')');}});
 history.replaceState&&history.replaceState(null,'',location.pathname+'?room='+code);}
function onPresenceLeave(uid){if(!ONL.active||!uid||uid===USER.id)return;
 if(ONL.host){ONL.host.removePlayer(uid);return;}
 if(ONL.room&&uid===ONL.room.host){const left=ONL.presence.filter(k=>k!==uid);const nh=electHost(left.length?left:[USER.id]);
  if(nh===USER.id){toast('Chủ phòng rời đi — bạn trở thành chủ phòng');ONL.host=new OnlineHost(ONL.tr,ONL.me,{fillBots:ONL.room.fillBots,dealMs:2300,bet:tableBet(),size:ONL.room.size||4});ONL.host.onState=(s,r)=>{ONL.room=r;renderRoom();if(s)onlineState(s,true);};
   const players=(ONL.room.seats||[]).filter(s=>s&&s.uid&&s.uid!==uid&&left.includes(s.uid));ONL.host.resume(ONL.client.st,players.length?players:[ONL.me],ONL.client.rev);}
  else toast('Chủ phòng rời đi — đang chuyển chủ phòng…');}}
async function leaveRoom(silent){if(!ONL.active)return;if(!silent&&G&&!G.over&&!confirm('Rời phòng? Máy sẽ chơi thay bạn.'))return;
 try{ONL.tr&&ONL.tr.send('bye',{uid:USER.id});}catch(e){}if(ONL.host)ONL.host.stop();try{await SB.removeChannel(ONL.ch);}catch(e){}
 ONL.active=false;ONL.host=null;ONL.client=null;ONL.pub=false;setTimeout(()=>typeof lobbyTrack==='function'&&lobbyTrack(),0);if(G){G.over=true;G.online=false;}history.replaceState&&history.replaceState(null,'',location.pathname);
 [1,2,3].forEach(p=>{const e=$('s'+p);if(e)e.style.visibility='';});$('bChat').style.display='none';document.body.classList.remove('onl');$('chatDraw').className='';showHome();}
function renderRoom(){if(!ONL.active||!document.body.classList.contains('athome'))return;const r=ONL.room;if(!r)return;const amHost=!!ONL.host;
 const seats=(r.seats||[]).map((s,i)=>s?`<div class="row"><div class="av ${'fr-'+esc(s.frame||'fr_gold')}" style="--avc:${esc(s.bg||'#456')};width:44px;height:44px;font-size:24px">${esc(s.av||'🙂')}</div><div style="flex:1"><b>${esc(s.name)}</b>${s.uid===r.host?' <small style="color:#ffd84d">★ Chủ phòng</small>':''}<br><small><span class="lvb">${s.lv||1}</span><span class="tt t${s.tier||1}">${esc(s.title||'')}</span> <span class="sxuR">🪙 ${fmt(xuOf(s))}</span></small></div></div>`:
  `<div class="row" style="opacity:.6"><div class="av" style="width:44px;height:44px;font-size:22px;--avc:#333">${r.fillBots?'🤖':'·'}</div><div style="flex:1">${r.fillBots?'Máy sẽ vào ghế này':'Ghế trống'}</div></div>`).join('');
 const humans=(r.seats||[]).filter(Boolean).length;
 $('home').innerHTML=`<div class="hwrap"><div class="pcard" style="flex-direction:column;align-items:stretch;cursor:default"><div style="text-align:center"><div class="small">MÃ PHÒNG</div><div style="font:700 40px var(--serif);letter-spacing:8px;color:#ffe27a">${ONL.code}</div>
 <button class="alt" onclick="copyLink()">Sao chép link mời</button>${navigator.share?`<button class="alt" onclick="navigator.share({title:'Tiến Lên Miền Nam',text:'Vào chơi Tiến Lên với mình! Mã phòng ${ONL.code}',url:shareLink()}).catch(()=>{})">Chia sẻ</button>`:''}<button class="alt" onclick="openOnline()">Mời bạn bè</button></div>
 <h4>Người chơi (${humans}/4)</h4>${seats}
 ${amHost?`<label class="small"><input type="checkbox" ${r.fillBots?'checked':''} onchange="ONL.host.opt.fillBots=this.checked;ONL.host.push()"> Thêm máy vào ghế trống</label><button class="bigbtn" onclick="hostStart()" ${humans<2&&!r.fillBots?'disabled':''}>${I('bot')} BẮT ĐẦU</button>`:`<p class="small" style="text-align:center">${r.playing?'Ván đang diễn ra…':'Chờ chủ phòng bắt đầu…'}</p>`}
 <div id="chatBox" class="chatbox"></div><div style="display:flex;gap:6px"><input class="inp" id="chatIn" maxlength="120" placeholder="Nhắn tin…" onkeydown="if(event.key==='Enter')sendChat()"><button onclick="sendChat()">${I('chat')}</button></div>
 <button class="alt" onclick="leaveRoom()">${I('back')} Rời phòng</button></div></div>`;renderChat();}
function copyLink(){const l=shareLink();(navigator.clipboard?navigator.clipboard.writeText(l):Promise.reject()).then(()=>toast('Đã sao chép link: '+l)).catch(()=>prompt('Sao chép link mời:',l));}
function hostStart(){if(!ONL.host)return;ONL.rewarded=null;if(!ONL.host.start())toast('Cần ít nhất 2 người (hoặc bật thêm máy)');}
// ----- Đồng bộ trạng thái -> giao diện -----
function localSeatOf(uid){const st=ONL.st;if(!st)return -1;const g=st.seats.findIndex(s=>s&&s.uid===uid),me=st.seats.findIndex(s=>s&&s.uid===USER.id);return g<0||me<0?-1:(g-me+4)%4;}
function onlineState(st,fromHost){if(!ONL.active||!st)return;ONL.st=st;const me=st.seats.findIndex(s=>s&&s.uid===USER.id);if(me<0)return;
 const L=g=>(g-me+4)%4,Gb=g=>(g+me)%4,rot=a=>[0,1,2,3].map(i=>a[Gb(i)]);
 document.body.classList.remove('athome');document.body.classList.add('onl');closeModal();$('bChat').style.display='';
 const gk=JSON.stringify(st.seats.map(x=>x&&x.name))+(st.finished.length===0&&st.hist.length<=1);if(!ONL.under||st.hist.length<=1){ONL.under=[];ONL.lastPile=[];}
 const pk=JSON.stringify(st.pile);if(pk!==JSON.stringify(ONL.lastPile||[])){if(ONL.lastPile&&ONL.lastPile.length){const k=ONL.under.length;ONL.lastPile.forEach((c,i)=>{const h=(k*7+i*13)%31;ONL.under.push({r:((h*37)%50)-25,x:((h*11)%80)-40+i*5,y:((h*17)%40)-20});});if(ONL.under.length>26)ONL.under.splice(0,ONL.under.length-26);}ONL.lastPile=st.pile.slice();}
 G={under:ONL.under,seats:[0,1,2,3].filter(i=>st.seats[(i+me)%4]),n:st.seats.filter(Boolean).length,hands:rot(st.hands),cur:st.cur,curBy:st.curBy==null?null:L(st.curBy),pile:st.pile,prev:st.prev||[],hist:st.hist,passed:rot(st.passed),finished:st.finished.map(L),
  turn:L(st.turn),first:false,over:st.over,started:true,online:true};
 NAMES=rot(st.seats.map(s=>s?s.name+(s.bot&&s.uid?' (máy)':''):''));AVATARS=rot(st.seats.map(s=>s?[s.av||'🤖',s.bg||'#555']:['','#000']));AVATARS[0]=[myAv(),PR.avBg];BOTLV=rot(st.seats.map(s=>s?(s.lv||1):1));
 render();[1,2,3].forEach(p=>{const e=$('s'+p);if(e)e.style.visibility=rot(st.seats)[p]?'':'hidden';});
 const ev=st.ev,key=ev?JSON.stringify([st.hist.length,st.turn,ev.kind,ev.seat,st.pile]):null;
 if(ev&&key!==ONL.lastEvKey){ONL.lastEvKey=key;const ls=L(ev.seat);
  if(ev.kind==='play'){flyIn(ls);if(ev.chop)chopFX(ev.heo?'CHẶT HEO!':ev.info.type==='quad'?'TỨ QUÝ!':'CHẶT!');else sfx('play');msg(`${NAMES[ls]}: ${ev.chop?'CHẶT! ':''}${typeName(ev.info)}`);
   if(ls===0)hookPlay(ev.info,ev.prev);if(ev.fin===1)setTimeout(()=>winFX(ls===0?'🎉 BẠN VỀ NHẤT!':`${NAMES[ls]} về nhất`,ls===0),ev.chop?700:300);}
  else if(ev.kind==='pass'){sfx('pass');msg(`${NAMES[ls]} bỏ lượt`);}
  else if(ev.kind==='instant'){chopFX('TỚI TRẮNG!');msg(`${NAMES[ls]} TỚI TRẮNG: ${ev.why}`);}
  if(!st.over&&G.turn===0)setTimeout(()=>sfx('turn'),250);}
 else if(!ev)msg(G.turn===0?'Tới lượt bạn':`Lượt của ${NAMES[G.turn]}`);
 if(st.over&&st.rank){const gid=JSON.stringify(st.rank)+st.hist.length;if(ONL.rewarded!==gid){ONL.rewarded=gid;const place=st.rank.indexOf(me);const humans=st.seats.filter(s=>s).length;
  hookEnd(Math.min(place,3),!!(st.instant&&st.instant.seat===me),humans);setTimeout(()=>showOnlineResult(st),2200);}}}
function showOnlineResult(st){const me=st.seats.findIndex(s=>s&&s.uid===USER.id);
 modal(`<h3>${I('trophy')} Kết quả</h3>`+st.rank.map((g,i)=>{const s=st.seats[g];return `<div class="row"><b style="width:28px">${['🥇','🥈','🥉','4️⃣'][i]}</b><div class="av" style="--avc:${esc(s.bg||'#555')};width:36px;height:36px;font-size:20px">${esc(s.av||'🤖')}</div><div style="flex:1">${esc(s.name)}${g===me?' (bạn)':''}</div></div>`;}).join('')+
 (ONL.host?`<button onclick="closeModal();hostStart()">Ván tiếp</button>`:'<p class="small">Chờ chủ phòng bắt đầu ván tiếp…</p>')+`<button class="alt" onclick="closeModal();document.body.classList.add('athome');renderRoom()">Về phòng</button>`);}
// ----- Hành động của người chơi khi online -----
const _hp=humanPlay,_hpass=humanPass,_step=step,_goHome=goHome;
humanPlay=function(){if(!ONL.active)return _hp();if(!G||G.over||G.turn!==0)return;const cards=[...sel],info=detect(cards);
 if(!info){sfx('bad');return msg('Bộ bài không hợp lệ');}if(!canBeat(info,G.cur)){sfx('bad');return msg('Không chặn được bài trên bàn');}sel.clear();
 if(ONL.host)ONL.host.onIntent({uid:USER.id,a:{type:'play',cards}});else ONL.client.play(cards);};
humanPass=function(){if(!ONL.active)return _hpass();if(!G||G.over||G.turn!==0)return;if(!G.cur){sfx('bad');return msg('Bạn đang cầm cái, phải đánh');}sel.clear();
 if(ONL.host)ONL.host.onIntent({uid:USER.id,a:{type:'pass'}});else ONL.client.pass();};
step=function(){if(G&&G.online)return;return _step();};
goHome=function(){if(ONL.active)return leaveRoom();return _goHome();};
function onlineEmote(e){if(!ONL.active)return false;ONL.tr.send('emote',{uid:USER.id,e});return true;}
// ----- Trò chuyện -----
function sendChat(){const i=$('chatIn');const t=(i&&i.value||'').trim().slice(0,120);if(!t||!ONL.active)return;i.value='';const m={uid:USER.id,name:ONL.me.name,t,at:Date.now()};ONL.tr.send('chat',m);addChat(m);}
function addChat(m){if(!m||!m.t)return;ONL.chat.push(m);if(ONL.chat.length>60)ONL.chat.shift();renderChat();const ls=localSeatOf(m.uid);if(!document.body.classList.contains('athome')&&ls>=0)showEmote(ls,String(m.t).slice(0,40));if(m.uid!==USER.id)sfx('tap');}
function renderChat(){const b=$('chatBox');if(b){b.innerHTML=ONL.chat.map(m=>`<div><b>${esc(m.name)}:</b> ${esc(m.t)}</div>`).join('')||'<div class="small">Chưa có tin nhắn</div>';b.scrollTop=1e6;}
 const d=$('chatDraw');if(d&&d.classList.contains('on')){const l=$('chatLog');if(l){l.innerHTML=ONL.chat.map(m=>`<div><b>${esc(m.name)}:</b> ${esc(m.t)}</div>`).join('');l.scrollTop=1e6;}}}
function toggleChat(){const d=$('chatDraw');if(d.classList.contains('on')){d.className='';return;}d.className='on';
 d.innerHTML=`<div id="chatLog" class="chatbox"></div><div style="display:flex;gap:6px"><input class="inp" id="chatIn" maxlength="120" placeholder="Nhắn tin…" onkeydown="if(event.key==='Enter')sendChat()"><button onclick="sendChat()">Gửi</button><button class="alt" onclick="toggleChat()">✕</button></div>`;renderChat();setTimeout(()=>$('chatIn')&&$('chatIn').focus(),50);}
// ----- Mở link ?room=CODE -----
(function(){try{const c=new URLSearchParams(location.search).get('room');if(c&&validCode(c.toUpperCase())){setTimeout(async()=>{closeModal();if(CLOUD_ON){try{await loadSB();const {data}=await SB.auth.getSession();USER=data.session&&data.session.user||null;updAcc();}catch(e){}}
 if(needLogin()){const m=$('modalIn');if(m)m.insertAdjacentHTML('afterbegin',`<p class="small">Đăng nhập xong, mở lại link để vào phòng <b>${c.toUpperCase()}</b>.</p>`);return;}joinRoom(c.toUpperCase());},900);}}catch(e){}})();
