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
console.log('pass',ok,'fail',bad);
