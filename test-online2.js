const R=require('./rules.js');Object.assign(global,R,require('./chop.js'));const O=require('./online-core.js');let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
const tr=()=>{const h={};return{on:(k,f)=>h[k]=f,send:()=>{},h};};
const T=tr(),H=new O.OnlineHost(T,{uid:'a',name:'A'},{fillBots:false,bet:100});H.push=()=>{};H.tick=()=>{};
H.addPlayer({uid:'b',name:'B'});t('2 humans',H.seats.filter(Boolean).length===2);
t('set size 3',H.setSize(3)&&H.room().size===3);t('add bot seat 2',H.setBot(2,true)&&H.seats[2].bot);t('3 seated',H.seats.filter(Boolean).length===3);
t('cannot bot human seat',!H.setBot(0,true));H.addPlayer({uid:'x'});t('size<humans rejected',!H.setSize(2));H.removePlayer('x');H.setBot(2,true);
H.addPlayer({uid:'c',name:'C'});t('human replaces bot when full',H.seats.filter(s=>s&&!s.bot).length===3&&!H.seats.some(s=>s&&s.bot));
t('start',H.start(()=>0.3));t('st has 3 seats',H.st.seats.filter(Boolean).length===3);t('no change mid game',!H.setSize(4));
// settle chain on round end
const st={seats:[{},{},{},{}],hands:[[1],[2],[3],[4]],passed:[0,0,0,0],turn:2,curBy:1,cur:null,pend:{payer:0,receiver:1,amount:150},hist:[],finished:[]};
O.oNext(st);// turn moves to 3
st.turn=0;st.passed=[0,0,1,1];O.oNext(st);t('settled at round end',st.settle&&st.settle.amount===150&&st.settle.receiver===1&&!st.pend);
(async()=>{const T2=tr(),H2=new O.OnlineHost(T2,{uid:'a',name:'A'},{fillBots:false,bet:100,turnMs:15,botDelay:5});H2.push=()=>{};H2.addPlayer({uid:'b',name:'B'});H2.start(Math.random);
 const st=H2.st,p0=st.turn,n0=st.hands[p0].length;await new Promise(r=>setTimeout(r,25));t('timeout auto-played lowest (lead)',st.hands[p0].length===n0-1&&st.to[p0]===1);
 await new Promise(r=>setTimeout(r,200));t('afk after 3 timeouts',st.afk.some(Boolean)||st.over);const who=st.afk.findIndex(Boolean);
 if(who>=0){H2.onIntent({uid:st.seats[who].uid,a:{type:'wake'}});t('wake clears afk',!st.afk[who]&&st.to[who]===0);}
 clearTimeout(H2.timer);H2.st.over=true;console.log('pass',ok,'fail',bad);})();
// cược bàn: room luôn có bet của chủ, state mang bet, người vào sau nhận được
{const sent=[];const T3={on(){},send:(k,m)=>sent.push([k,m])};const H3=new O.OnlineHost(T3,{uid:'h',name:'H'},{bet:2000,fillBots:true});
 H3.addPlayer({uid:'j',name:'J'});const rm=sent.filter(x=>x[0]==='room').pop();console.log(rm&&rm[1].bet===2000?'ok room bet':'FAIL room bet');
 H3.start(Math.random);console.log(H3.st.bet===2000?'ok state bet':'FAIL state bet');const st=sent.filter(x=>x[0]==='state').pop();console.log(st&&st[1].st.bet===2000?'ok broadcast bet':'FAIL broadcast bet');
 const H4=new O.OnlineHost(T3,{uid:'h',name:'H'},{});console.log(H4.room().bet===100?'ok default bet':'FAIL default bet');clearTimeout(H3.timer);H3.st.over=true;}
setTimeout(()=>// chia bài online
{const sent=[];const T={on(){},send:(k,m)=>sent.push([k,m])};const H=new O.OnlineHost(T,{uid:'h',name:'H'},{fillBots:true,dealMs:400,botDelay:10});
 H.addPlayer({uid:'j',name:'J'});H.start(Math.random);const st=H.st;if(st.over){console.log('ok deal skipped (tới trắng)');return;}const ok=(c,m)=>{console.log(c?'ok '+m:'FAIL '+m);if(!c)process.exitCode=1;};
 ok(st.dealId&&st.dealMs===400,'deal id');const t=st.turn,seat=st.seats[t];
 H.onIntent({uid:'h',a:{type:'pass'}});ok(sent.some(x=>x[0]==='reject'&&/chia/.test(x[1].err)),'reject during deal');
 setTimeout(()=>{ok(!H.st.pile.length&&H.st.turn===t,'no move during deal');},250);
 setTimeout(()=>{const botTurn=seat.bot;ok(!botTurn||H.st.pile.length>0,'moves after deal');const p0=sent.filter(x=>x[0]==='reject').length;
  if(!seat.bot){H.onIntent({uid:seat.uid,a:{type:'play',cards:[st.firstCard]}});ok(H.st.pile.length>0,'human accepted after deal '+JSON.stringify(sent.filter(x=>x[0]==='reject').map(x=>x[1].err))+H.st.turn+t);}clearTimeout(H.timer);H.st.over=true;},700);},2500);
// chống nhìn bài + bầu chủ bàn
{const t=(c,m)=>{console.log(c?'ok '+m:'FAIL '+m);if(!c)process.exitCode=1;};
 t(O.electHostAt([{uid:'b',at:200},{uid:'a',at:300},{uid:'c',at:200}])==='b','elect earliest then uid');
 t(O.electHostAt([{uid:'z',at:5},{uid:'y'}])==='z','elect missing at last');
 // mô phỏng vào cùng lúc: mọi máy cùng thấy 1 danh sách presence -> cùng 1 kết quả
 const P=[{uid:'u3',at:1000},{uid:'u1',at:1000},{uid:'u2',at:1000}];const views=[P,P.slice().reverse(),[P[1],P[2],P[0]]].map(v=>O.electHostAt(v));t(views.every(v=>v==='u1'),'simultaneous joins agree');
 const sent=[];const T={on(){},send:(k,m)=>sent.push([k,m])};const H=new O.OnlineHost(T,{uid:'h',name:'H'},{fillBots:true,hideHands:true});let hs=0;H.sendHands=()=>hs++;
 H.addPlayer({uid:'j',name:'J'});H.start(()=>0.37);const st=sent.filter(x=>x[0]==='state').pop()[1].st;
 if(!st.over){t(st.hands.every(h=>h.every(c=>c===-1)),'broadcast hides all hands');t(st.hands.map(h=>h.length).join()===H.st.hands.map(h=>h.length).join(),'counts preserved');t(hs>0,'per-player hands sent');t(H.st.hands[0][0]>=0,'host keeps real hands');
  t(Array.isArray(H.st.ai)&&H.st.ai.length===4,'bot levels in state');}
 H.st.over=true;H.push();t(sent.filter(x=>x[0]==='state').pop()[1].st.hands.some(h=>h.some(c=>c>=0)),'reveal at game end');clearTimeout(H.timer);}
