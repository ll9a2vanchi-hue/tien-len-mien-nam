const R=require('./rules.js');Object.assign(global,R,require('./chop.js'));const O=require('./online-core.js');let bad=0;const t=(c,n)=>{console.log(c?'ok':'FAIL',n);if(!c)bad++;};
const sent=[];const tr={on:()=>{},send:(k,m)=>sent.push([k,m])};const H=new O.OnlineHost(tr,{uid:'a',name:'A'},{fillBots:true,bet:100});H.tick=()=>{};
H.addPlayer({uid:'b',name:'B'});H.addPlayer({uid:'s',name:'S',spec:true});
t(H.room().specs.length===1&&H.room().specs[0].uid==='s','người xem được ghi nhận');t(!H.players.find(p=>p.uid==='s'),'người xem không có ghế');
H.opt.hideHands=true;const got=[];H.sendHands=(st)=>{st.seats.forEach(x=>x&&x.uid&&got.push(x.uid));};H.start(Math.random);
t(!H.st.seats.some(x=>x&&x.uid==='s'),'không chia bài cho người xem');t(!got.includes('s'),'không gửi bài cho người xem');
const st=sent.filter(x=>x[0]==='state').pop()[1].st;t(st.hands.every(h=>h.every(c=>c===-1)),'trạng thái công khai không lộ bài');
H.addPlayer({uid:'s',name:'S'});t(H.specs.s===undefined,'ngồi vào: rời danh sách xem');t(sent.some(x=>x[0]==='specwait'),'đang chơi -> chờ ván sau');
H.removePlayer('x');console.log(bad?'FAIL':'PASS');process.exit(bad?1:0);
