// Kiểm thử giao thức online với "bus" giả lập (giống Supabase broadcast: không gửi lại cho chính mình)
const R=require('./rules.js');Object.assign(global,R);const O=require('./online-core.js');
let pass=0,fail=0;const t=(n,v)=>{v?pass++:(fail++,console.log('FAIL',n));};
function mkBus(){const subs=[];return{join(id){const h={};subs.push({id,h});return{send:(e,p)=>subs.forEach(s=>{if(s.id!==id&&s.h[e])s.h[e].forEach(cb=>cb(JSON.parse(JSON.stringify(p))));}),on:(e,cb)=>(h[e]=h[e]||[]).push(cb),leave:()=>{const i=subs.findIndex(s=>s.id===id);if(i>=0)subs.splice(i,1);}};}};}
// timers chạy đồng bộ có kiểm soát
let Q=[];global.setTimeout=(f,ms)=>{const o={f,ms,dead:false};Q.push(o);return o;};global.clearTimeout=o=>{if(o)o.dead=true;};
function flush(max){let n=0;while(Q.length&&n<(max||100000)){const o=Q.shift();if(!o.dead){o.f();n++;}}return n;}
let seed=7;const rng=()=>(seed=(seed*16807)%2147483647)/2147483647;
t('room code',O.validCode(O.roomCode(rng))&&!O.validCode('abc')&&!O.validCode('ABCDE0'));
t('elect host',O.electHost(['b','a',null,'c'])==='a'&&O.electHost([])===null);
// deal
let st=O.oDeal([{uid:'a',name:'A'},{uid:'b',name:'B'},null,null],null,rng);
t('2-player deal 13 each',st.hands[0].length===13&&st.hands[1].length===13&&st.hands[2].length===0);
t('first leader has lowest',st.over||Math.min(...st.hands[st.turn])===st.firstCard);
t('wrong turn rejected',st.over||!O.oAct(st,(st.turn+1)%2,{type:'pass'}).ok);
t('lead cannot pass',st.over||O.oAct(st,st.turn,{type:'pass'}).err==='Bạn đang cầm cái, phải đánh');
t('card not in hand rejected',st.over||!O.oAct(st,st.turn,{type:'play',cards:[st.hands[(st.turn+1)%2][0]]}).ok);
t('must include lowest',st.over||!O.oAct(st,st.turn,{type:'play',cards:[st.hands[st.turn].find(c=>c!==st.firstCard)]}).ok);
t('duplicate cards rejected',st.over||!O.oAct(st,st.turn,{type:'play',cards:[st.firstCard,st.firstCard]}).ok);
// full games over bus: host A + clients B, C; 1 bot fills
let games=0,consistent=true,maxSteps=0;
for(let g=0;g<40;g++){const bus=mkBus();const ta=bus.join('a'),tb=bus.join('b'),tc=bus.join('c');
 const host=new O.OnlineHost(ta,{uid:'a',name:'An'},{fillBots:true,botDelay:1,turnMs:5});
 const cb=new O.OnlineClient(tb,{uid:'b',name:'Bình'}),cc=new O.OnlineClient(tc,{uid:'c',name:'Chi'});
 let hostSt=null;host.onState=s=>hostSt=s;
 const autoplay=(cl)=>{cl.onState=s=>{const me=cl.mySeat();if(me>=0&&!s.over&&s.turn===me&&!s.seats[me].bot){const a=O.oBotMove(JSON.parse(JSON.stringify(s)));setTimeout(()=>a.type==='pass'?cl.pass():cl.play(a.cards),0);}};};
 autoplay(cb);autoplay(cc);
 // host plays its own seat directly (loopback)
 host.onState=s=>{hostSt=s;if(s&&!s.over&&s.seats[s.turn]&&s.seats[s.turn].uid==='a'){const a=O.oBotMove(JSON.parse(JSON.stringify(s)));setTimeout(()=>host.onIntent({uid:'a',a}),0);}};
 cb.hello();cc.hello();
 if(g===0)t('lobby seats',host.room().seats.filter(Boolean).length===3&&cb.room&&cb.room.seats[1].uid==='b');
 host.start(rng);const n=flush(20000);maxSteps=Math.max(maxSteps,n);
 if(hostSt.over)games++;
 if(JSON.stringify(cb.st)!==JSON.stringify(hostSt)||JSON.stringify(cc.st)!==JSON.stringify(hostSt))consistent=false;
 if(g===0){t('4 seats incl bot',hostSt.seats.filter(Boolean).length===4&&hostSt.seats[3].bot);t('rank has 4',hostSt.rank&&hostSt.rank.length===4);}
}
t('40 online games finish',games===40);t('clients state == host state',consistent);
// invalid intent from client gets reject only to that client
{const bus=mkBus();const ta=bus.join('a'),tb=bus.join('b');const host=new O.OnlineHost(ta,{uid:'a',name:'A'},{fillBots:false,botDelay:1,turnMs:1e9});const cb=new O.OnlineClient(tb,{uid:'b',name:'B'});
 let rej=null;cb.onReject=e=>rej=e;cb.hello();t('start needs 2 humans w/o bots',(()=>{const h2=new O.OnlineHost(mkBus().join('x'),{uid:'x',name:'X'},{fillBots:false});return !h2.start(rng);})());
 host.start(rng);flush(10);const s=host.st;if(!s.over){const other=s.turn===1?0:1;
  if(s.turn!==1){cb.pass();t('reject not your turn',rej==='Chưa tới lượt');}else{cb.play([s.hands[0][0]]);t('reject foreign card',rej==='Bài không hợp lệ');}
  // disconnect: B leaves -> bot takes over and game continues to end
  host.removePlayer('b');t('bot takeover',host.st.seats[1].bot===true&&host.st.seats[1].uid==='b');
  host.onState=st=>{if(!st.over&&st.turn===0){const a=O.oBotMove(JSON.parse(JSON.stringify(st)));setTimeout(()=>host.onIntent({uid:'a',a}),0);}};host.push();host.opt.turnMs=1;flush(20000);
  t('game ends after disconnect',host.st.over);
  // rejoin before next game restores seat
  cb.hello();t('rejoin clears bot',host.seats[1]&&host.seats[1].uid==='b');}}
// host migration: client resumes as host from last state
{const bus=mkBus();const ta=bus.join('a'),tb=bus.join('b');const host=new O.OnlineHost(ta,{uid:'a',name:'A'},{fillBots:true,botDelay:1,turnMs:1e9});const cb=new O.OnlineClient(tb,{uid:'b',name:'B'});cb.hello();
 host.start(rng);flush(5);const snap=JSON.parse(JSON.stringify(cb.st)),rev=cb.rev;host.stop();ta.leave();
 const nh=new O.OnlineHost(tb,{uid:'b',name:'B'},{fillBots:true,botDelay:1,turnMs:1});
 nh.onState=st=>{};nh.resume(snap,[{uid:'b',name:'B'}],rev);
 t('migrated: old host seat becomes bot',snap.over||nh.st.seats[0].bot===true);flush(20000);t('migrated game finishes',nh.st.over);}
console.log(`pass ${pass} fail ${fail} (max steps ${maxSteps})`);
