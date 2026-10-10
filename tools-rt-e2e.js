// E2E qua Supabase Realtime thật (channel công khai tạm, không cần đăng nhập) để kiểm tra giao thức host/client
const {createClient}=require('@supabase/supabase-js');const R=require('/workspace/tienlen/rules.js');Object.assign(global,R);const O=require('/workspace/tienlen/online-core.js');
const URL='https://xpostdhkuskybbomwiaz.supabase.co',KEY='sb_publishable_3KcISJ4u698ld2ZVrB83jw_I6fZGQGS',topic='tlmn-e2e-'+Date.now();
(async()=>{const WS=require('ws');const mk=()=>createClient(URL,KEY,{auth:{persistSession:false},realtime:{transport:WS}});const A=mk(),B=mk();
 const chA=A.channel(topic,{config:{broadcast:{self:false,ack:false}}}),chB=B.channel(topic,{config:{broadcast:{self:false}}});
 const host=new O.OnlineHost(O.rtTransport(chA),{uid:'a',name:'An'},{fillBots:true,botDelay:150,turnMs:400});
 const cl=new O.OnlineClient(O.rtTransport(chB),{uid:'b',name:'Bình'});let hostSt=null,moves=0,rejects=0;
 host.onState=s=>{hostSt=s;if(s&&!s.over&&s.seats[s.turn]&&s.seats[s.turn].uid==='a'){const a=O.oBotMove(JSON.parse(JSON.stringify(s)));setTimeout(()=>host.onIntent({uid:'a',a}),50);}};
 cl.onState=s=>{const me=cl.mySeat();if(me>=0&&!s.over&&s.turn===me){const a=O.oBotMove(JSON.parse(JSON.stringify(s)));moves++;setTimeout(()=>a.type==='pass'?cl.pass():cl.play(a.cards),50);}};
 cl.onReject=()=>rejects++;
 await new Promise(r=>chA.subscribe(s=>s==='SUBSCRIBED'&&r()));await new Promise(r=>chB.subscribe(s=>s==='SUBSCRIBED'&&r()));
 cl.hello();await new Promise(r=>setTimeout(r,1500));console.log('lobby seats seen by client',cl.room&&cl.room.seats.filter(Boolean).map(s=>s.name));
 host.start();const t0=Date.now();while(!(hostSt&&hostSt.over)&&Date.now()-t0<90000)await new Promise(r=>setTimeout(r,300));
 await new Promise(r=>setTimeout(r,1500));
 console.log('over',hostSt&&hostSt.over,'client moves',moves,'rejects',rejects,'client==host',JSON.stringify(cl.st)===JSON.stringify(hostSt),'rank',hostSt&&hostSt.rank&&hostSt.rank.map(i=>hostSt.seats[i].name));
 host.stop();await A.removeAllChannels();await B.removeAllChannels();process.exit(0);})();
