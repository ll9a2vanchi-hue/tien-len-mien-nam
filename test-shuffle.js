// Kiểm tra xáo bài đều (Fisher-Yates) cho Xì tố, Poker, Miền Nam, cược bài; không thiên vị ghế người/máy
const fs=require('fs');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const src=fs.readFileSync('./src/games2-ui.js','utf8');const m=src.match(/function shuf\(d\)\{[^\n]*\}/)[0];const shuf=new Function(m+';return shuf;')();
const online=require('./online-core.js');
const chi=(counts,exp)=>counts.reduce((a,c)=>a+(c-exp)*(c-exp)/exp,0);
const N=60000,D=32;const pos=Array.from({length:D},()=>new Array(D).fill(0));const deck=[...Array(D).keys()];
for(let k=0;k<N;k++){const d=shuf(deck);d.forEach((c,i)=>pos[c][i]++);}
const cs=pos.map(r=>chi(r,N/D));const avg=cs.reduce((a,b)=>a+b,0)/D;t('vị trí mỗi lá đều (chi2 TB≈31): '+avg.toFixed(1),avg>20&&avg<45);
// ghế 0 (người) và ghế 1..3 (máy) nhận tẩy xì tố: phân bố rank đều như nhau
const seat=[0,0,0,0].map(()=>new Array(8).fill(0));const K=80000;
for(let k=0;k<K;k++){const d=shuf(deck);for(let s=0;s<4;s++)seat[s][d[s*2]>>2]++;}
const mean=seat.map(r=>r.reduce((a,x,i)=>a+x*i,0)/K);const spread=Math.max(...mean)-Math.min(...mean);t('rank trung bình tẩy mỗi ghế như nhau (lệch '+spread.toFixed(3)+')',spread<0.05);
// xáo 52 lá của poker/Miền Nam (online-core.shuffleDeck)
const d52=new Array(52).fill(0);for(let k=0;k<K;k++){d52[online.shuffleDeck()[0]]++;}t('lá đầu bộ 52 đều',chi(d52,K/52)<85);
process.exit(f?1:0);
