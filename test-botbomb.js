const R=require('./rules.js');Object.assign(global,R);const A=require('./ai.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const c=(r,s)=>r*4+s;
const hand=[c(0,0),c(0,1),c(1,0),c(1,1),c(2,0),c(2,1),c(4,2),c(6,1),c(8,3),c(9,0),c(10,2),c(11,1),c(12,2)];
const isB=g=>{const i=detect(g);return i&&(i.type==='quad'||(i.type==='pairseq'&&i.len>=3));};
const ctx={played:[],others:[13,13,13]};let bomb=[0,0,0,0];
for(let lv=0;lv<=3;lv++)for(let k=0;k<150;k++){const m=A.aiMove(lv,hand,null,null,ctx,Math.random);if(m&&isB(m))bomb[lv]++;}
console.log('bomb leads per level',bomb);
t('Dễ không mở bằng bộ chặt',bomb[0]===0);t('Thường không mở bằng bộ chặt',bomb[1]===0);t('Khó không mở bằng bộ chặt',bomb[2]===0);t('Cao thủ được phép giữ cách đánh cũ (mở bằng bộ chặt)',bomb[3]>0);
// vẫn đánh được bộ chặt khi chỉ còn bộ chặt (về nhất) và khi chặt heo
const onlyB=hand.slice(0,6);t('chỉ còn bộ chặt thì đánh hết',[0,1,2,3].every(lv=>{const m=A.aiMove(lv,onlyB,null,null,ctx,Math.random);return m&&m.length===6;}));
const chop=A.aiMove(1,hand,{type:'single',top:c(12,3),len:1},null,ctx,Math.random);t('Thường vẫn chặt heo bằng 3 đôi thông',chop&&isB(chop));
process.exit(f?1:0);
