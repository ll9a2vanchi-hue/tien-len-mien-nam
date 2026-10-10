// RULES_START
const RANKS=['3','4','5','6','7','8','9','10','J','Q','K','A','2'];
const SUITS=['♠','♣','♦','♥'];
function cid(r,s){return r*4+s;} // r 0..12, s 0..3
function rk(c){return c>>2;} function st(c){return c&3;}
function sortCards(a){return a.slice().sort((x,y)=>x-y);}
function isConsec(rs){for(let i=1;i<rs.length;i++)if(rs[i]!==rs[i-1]+1)return false;return true;}
function detect(cards){
  const c=sortCards(cards),n=c.length;if(!n)return null;
  const rs=c.map(rk),top=c[n-1],same=rs.every(r=>r===rs[0]);
  if(n===1)return{type:'single',len:1,top};
  if(same&&n===2)return{type:'pair',len:2,top};
  if(same&&n===3)return{type:'triple',len:3,top};
  if(same&&n===4)return{type:'quad',len:4,top};
  if(n>=3&&!rs.includes(12)&&new Set(rs).size===n&&isConsec(rs))return{type:'straight',len:n,top};
  if(n>=6&&n%2===0&&!rs.includes(12)){let ok=true;const pr=[];for(let i=0;i<n;i+=2){if(rs[i]!==rs[i+1])ok=false;pr.push(rs[i]);}
    if(ok&&isConsec(pr))return{type:'pairseq',len:n/2,top};}
  return null;
}
function canBeat(play,cur){
  if(!play)return false;if(!cur)return true;
  if(play.type===cur.type&&play.len===cur.len)return play.top>cur.top;
  const two=rk(cur.top)===12;
  if(cur.type==='single'&&two)return play.type==='quad'||(play.type==='pairseq'&&play.len>=3);
  if(cur.type==='pair'&&two)return play.type==='quad'||(play.type==='pairseq'&&play.len>=4);
  if(cur.type==='pairseq'&&cur.len===3)return play.type==='quad'||(play.type==='pairseq'&&play.len>=4);
  if(cur.type==='quad')return play.type==='pairseq'&&play.len>=4;
  return false;
}
function instantWin(hand){
  const rs=hand.map(rk),cnt=Array(13).fill(0);rs.forEach(r=>cnt[r]++);
  if(cnt.slice(0,12).every(x=>x>=1))return'Sảnh rồng (3→A)';
  if(cnt[12]===4)return'Tứ quý 2';
  let pairs=cnt.reduce((a,x)=>a+Math.floor(x/2),0);if(pairs>=6)return'6 đôi';
  let run=0;for(let r=0;r<12;r++){run=cnt[r]>=2?run+1:0;if(run>=5)return'5 đôi thông';}
  return null;
}
function combos(hand){ // all valid combos from hand
  const h=sortCards(hand),out=[],by={};h.forEach(c=>(by[rk(c)]=by[rk(c)]||[]).push(c));
  h.forEach(c=>out.push([c]));
  for(const r in by){const g=by[r];
    for(let i=0;i<g.length;i++)for(let j=i+1;j<g.length;j++)out.push([g[i],g[j]]);
    if(g.length>=3){for(let k=0;k<g.length;k++)out.push(g.filter((_,i)=>i!==k||g.length===3).slice(0,3));}
    if(g.length===4)out.push(g.slice());}
  for(let s=0;s<12;s++)for(let e=s+2;e<12;e++){let ok=true;for(let r=s;r<=e;r++)if(!by[r]){ok=false;break;}
    if(!ok)break;const base=[];for(let r=s;r<e;r++)base.push(by[r][0]);
    for(const t of by[e])out.push([...base,t]);}
  for(let s=0;s<12;s++)for(let e=s+2;e<12;e++){let ok=true;for(let r=s;r<=e;r++)if(!by[r]||by[r].length<2){ok=false;break;}
    if(!ok)break;const cs=[];for(let r=s;r<=e;r++)cs.push(...by[r].slice(-2));out.push(cs);}
  return out.map(c=>({cards:c,info:detect(c)})).filter(x=>x.info);
}
function isBomb(i){return i.type==='quad'||(i.type==='pairseq'&&i.len>=3);}
function cost(x){const i=x.info;let v=rk(i.top)*2+st(i.top)*0.1;if(rk(i.top)===12)v+=40;if(isBomb(i))v+=60;return v;}
function botMove(hand,cur,mustInclude,others){
  let cs=combos(hand).filter(x=>canBeat(x.info,cur));
  if(mustInclude!=null)cs=cs.filter(x=>x.cards.includes(mustInclude));
  if(!cs.length)return null;
  const fin=cs.find(x=>x.cards.length===hand.length);if(fin)return fin.cards;
  const danger=others.some(n=>n<=2);
  if(!cur){ // lead: prefer dumping many low cards
    cs.sort((a,b)=>(cost(a)-a.cards.length*3)-(cost(b)-b.cards.length*3));
    const nb=cs.filter(x=>!isBomb(x.info)&&rk(x.info.top)!==12);
    return (nb[0]||cs[0]).cards;}
  cs.sort((a,b)=>cost(a)-cost(b));
  const cheap=cs.filter(x=>!isBomb(x.info)&&rk(x.info.top)!==12);
  if(cheap.length)return cheap[0].cards;
  if(danger||hand.length<=5||rk(cur.top)===12)return cs[0].cards;
  return null;
}
// RULES_END
if(typeof module!=='undefined')module.exports={RANKS,SUITS,cid,rk,st,detect,canBeat,instantWin,combos,botMove,sortCards,cost,isBomb};
