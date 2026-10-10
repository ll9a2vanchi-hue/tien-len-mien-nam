const R=require('./rules.js');Object.assign(global,R);const A=require('./ai.js');let pass=0,fail=0;const t=(n,c)=>{c?pass++:(fail++,console.log('FAIL',n));};
const C=(r,s)=>r*4+s;// r:0=3..11=A,12=2
const flat=g=>g.flat().sort((a,b)=>a-b).join();
let h=[C(0,0),C(1,1),C(2,2),C(3,0),C(4,3),C(6,0),C(6,1),C(9,2),C(12,3),C(12,0),C(10,1),C(10,2),C(11,0)];
let g=A.smartGroups(h);t('keeps all cards',flat(g)===h.slice().sort((a,b)=>a-b).join());
t('2s first',g[0].every(c=>c>>2===12));t('straight 3-7 kept',g.some(x=>x.length===5&&x.every((c,i)=>c>>2===i)));
t('pair 9s',g.some(x=>x.length===2&&x[0]>>2===6));
h=[C(2,0),C(2,1),C(3,0),C(3,1),C(4,0),C(4,1),C(8,0),C(8,1),C(8,2),C(8,3),C(0,0)];g=A.smartGroups(h);
t('pairseq grouped first',g.some(x=>x.length===6)&&g.findIndex(x=>x.length===6)<=1);t('quad grouped',g.some(x=>x.length===4&&new Set(x.map(c=>c>>2)).size===1));
h=[C(0,0),C(0,1),C(1,0),C(2,0),C(3,0)];g=A.smartGroups(h);t('no leftover singles (pair+straight)',g.every(x=>x.length>1));h=[C(0,0),C(1,0),C(2,0),C(3,0),C(4,0),C(4,1),C(5,0)];g=A.smartGroups(h);t('long straight kept',g.some(x=>x.length===6));
for(let k=0;k<200;k++){const d=[...Array(52).keys()].sort(()=>Math.random()-.5).slice(0,13);const t0=Date.now();const gg=A.smartGroups(d);if(Date.now()-t0>200){t('fast',false);break;}
 if(flat(gg)!==d.slice().sort((a,b)=>a-b).join()){t('random partition complete',false);break;}if(!gg.every(x=>detect(x))){t('valid groups',false);break;}}
t('random ok',true);console.log('pass',pass,'fail',fail);
