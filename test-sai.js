const R=require('./rules.js');Object.assign(global,R,require('./chop.js'));const O=require('./online-core.js');let bad=0;const t=(n,c)=>{if(!c){bad++;console.log('FAIL',n);}else console.log('ok',n);};
const c=(r,s)=>r*4+s;
const st={seats:[{name:'A'},{name:'B'},{name:'C'},{name:'D'}],hands:[[c(2,0)],[c(3,0),c(9,0)],[c(0,1),c(1,1)],[c(0,2),c(1,2)]],turn:0,cur:null,curBy:null,pile:[],passed:[0,0,0,0],finished:[],hist:[],first:false,bet:100,afk:[0,0,0,0]};
let r=O.oAct(st,0,{type:'play',cards:[c(2,0)]});t('A đánh lá cuối',r.ok&&st.hands[0].length===0&&st.finished[0]===0);t('lượt sang B',st.turn===1);
r=O.oAct(st,1,{type:'play',cards:[c(3,0)]});t('B bắt bài người đã về',r.ok&&st.curBy===1&&st.pile[0]===c(3,0));
O.oAct(st,2,{type:'pass'});O.oAct(st,3,{type:'pass'});t('mọi người bỏ -> B cầm cái (không phải hưởng sái)',st.turn===1&&!st.cur&&!st.hist[0].sai);
// hưởng sái: A về, mọi người bỏ -> người kế sau A
const s2={seats:[{name:'A'},{name:'B'},{name:'C'},{name:'D'}],hands:[[c(11,0)],[c(3,0),c(9,0)],[c(0,1),c(1,1)],[c(0,2),c(1,2)]],turn:0,cur:null,curBy:null,pile:[],passed:[0,0,0,0],finished:[],hist:[],first:false,bet:100,afk:[0,0,0,0]};
O.oAct(s2,0,{type:'play',cards:[c(11,0)]});O.oAct(s2,1,{type:'pass'});O.oAct(s2,2,{type:'pass'});O.oAct(s2,3,{type:'pass'});
t('hưởng sái: B (kế sau A) cầm cái, bàn trống',s2.turn===1&&!s2.cur&&s2.pile.length===0&&s2.hist[0].sai&&/B hưởng sái/.test(s2.hist[0].txt));
console.log(bad?'FAIL':'PASS');process.exit(bad?1:0);
