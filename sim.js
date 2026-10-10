const fs=require('fs');const el=()=>({style:{},className:'',innerHTML:'',textContent:'',appendChild(){},querySelector(){return el()},disabled:0});
global.document={getElementById:el,createElement:el};global.localStorage={getItem:()=>null,setItem(){}};
let q=[];global.setTimeout=f=>q.push(f);
const src=fs.readFileSync('/tmp/x.js','utf8').replace('newGame();\n','')+`
NAMES.length;let done=0;for(let g=0;g<300;g++){newGame();let n=0;
while(!G.over&&n<2000){n++;if(G.turn===0){const m=botMove(G.hands[0],G.cur,G.first?0:null,[13]);if(m)doPlay(0,m);else if(!G.cur)doPlay(0,[G.hands[0][0]]);else doPass(0);}const f=q;q=[];f.forEach(x=>x());}
if(G.over)done++;}console.log('completed',done,'/300 games, scores',S.pts);`;
eval(src);
