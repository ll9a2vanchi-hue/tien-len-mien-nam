// Mô phỏng sức mạnh các cấp AI: 4 máy (mỗi cấp 1 ghế, xoay vòng ghế), dùng engine online-core
const R=require('./rules.js');Object.assign(global,R);const A=require(process.env.AIF||'./ai.js');Object.assign(global,A);const O=require('./online-core.js');
const N=+process.argv[2]||1000;let seed=+(process.env.SEED||12345);const rng=()=>(seed=(seed*16807)%2147483647)/2147483647;Math.random=rng;
const wins=[0,0,0,0],place=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];let maxMs=0,tot=0,calls=0;const mode=process.argv[3]||'all';
for(let g=0;g<N;g++){const lv=mode==='all'?[0,1,2,3]:mode.split(',').map(Number);const rot=g%4;const seatLv=[0,1,2,3].map(i=>lv[(i+rot)%4]);
 const st=O.oDeal([0,1,2,3].map(i=>({uid:'p'+i,name:'P'+i})),null,rng);let n=0;
 while(!st.over&&n<500){n++;const p=st.turn,hand=st.hands[p];const played=[];const inHands=new Set(st.hands.flat());for(let c=0;c<52;c++)if(!inHands.has(c))played.push(c);
  const others=[1,2,3].map(k=>(p+k)%4).filter(q=>st.hands[q].length).map(q=>st.hands[q].length);const table={counts:[1,2,3].map(k=>st.hands[(p+k)%4].length),passed:[1,2,3].map(k=>st.passed[(p+k)%4]),curBy:st.curBy==null?null:(st.curBy-p+4)%4};
  const t=Date.now();let m=aiMove(seatLv[p],hand,st.cur,st.first?st.firstCard:null,{played,others,table,budget:+(process.env.BUD||40)},rng);const dt=Date.now()-t;tot+=dt;calls++;if(dt>maxMs)maxMs=dt;
  let a=m?{type:'play',cards:m}:{type:'pass'};if(!st.cur&&!m)a={type:'play',cards:[hand[0]]};let r=O.oAct(st,p,a);if(!r.ok)r=O.oAct(st,p,O.oBotMove(st));}
 if(st.rank){st.rank.forEach((p,i)=>place[seatLv[p]][i]++);wins[seatLv[st.rank[0]]]++;}}
console.log(`games ${N}, mode ${mode}`);['Dễ','Thường','Khó','Cao_thủ'].forEach((nm,i)=>{const pl=place[i],t=pl.reduce((a,b)=>a+b,0);if(t)console.log(`${nm.padEnd(8)} nhất ${(100*pl[0]/t).toFixed(1)}%  TB hạng ${(pl.reduce((a,v,k)=>a+v*(k+1),0)/t).toFixed(2)}`);});
console.log(`think time avg ${(tot/calls).toFixed(2)}ms max ${maxMs}ms`);
