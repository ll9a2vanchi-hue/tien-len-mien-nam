const fs=require('fs');const el=()=>({style:{},dataset:{},classList:{add(){},remove(){}},className:'',innerHTML:'',textContent:'',appendChild(){},remove(){},querySelector(){return el()},querySelectorAll(){return []},disabled:0,get lastChild(){return el()},get firstChild(){return el()}});
global.document={getElementById:el,createElement:el,querySelectorAll:()=>[]};global.window={addEventListener(){}};global.navigator={userAgent:'node'};global.location={protocol:'file:',hash:'',href:''};global.localStorage={getItem:()=>null,setItem(){}};
let q=[];global.setTimeout=f=>q.push(f);
const src=(()=>{const h=fs.readFileSync(__dirname+'/index.html','utf8');return h.slice(h.lastIndexOf('<script>')+8,h.lastIndexOf('</script>'));})().replace('newGame();\n','')+`
NAMES.length;let done=0;for(let g=0;g<300;g++){if(PR.xu<1000)PR.xu=1e5;newGame();let n=0;
while(!G.over&&n<2000){n++;if(G.turn===0){const m=botMove(G.hands[0],G.cur,G.first?0:null,[13]);if(m)doPlay(0,m);else if(!G.cur)doPlay(0,[G.hands[0][0]]);else doPass(0);}const f=q;q=[];f.forEach(x=>x());}
if(G.over)done++;}console.log('completed',done,'/300 games, scores',S.pts,'profile games',PR.stats.games,'badges',Object.keys(PR.badges).length,'chops',PR.stats.chops);`;
eval(src);
