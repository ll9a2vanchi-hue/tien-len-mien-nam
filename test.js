const R=require('./rules.js'),{cid,detect,canBeat,instantWin,botMove}=R;
const P=s=>s.split(' ').map(t=>{const su='scdh'.indexOf(t.slice(-1));return cid(R.RANKS.indexOf(t.slice(0,-1)),su);});
const D=s=>detect(P(s));let pass=0,fail=0;
function t(n,v){if(v)pass++;else{fail++;console.log('FAIL',n);}}
t('single',D('3s').type==='single');t('pair',D('5s 5h').type==='pair');t('bad pair',!D('5s 6h'));
t('triple',D('7s 7c 7d').type==='triple');t('quad',D('9s 9c 9d 9h').type==='quad');
t('straight',D('3s 4c 5d').type==='straight');t('straight long',D('9s 10c Jd Qh Ks Ah').len===6);
t('no 2 in straight',!D('Qs Kc Ad 2h'));t('gap',!D('3s 5c 6d'));
t('3dt',D('3s 3c 4d 4h 5s 5c').type==='pairseq');t('4dt',D('3s 3c 4d 4h 5s 5c 6s 6h').len===4);
t('no 2 in dt',!D('Ks Kc As Ac 2s 2c'));
t('higher single',canBeat(D('3h'),D('3s')));t('lower single',!canBeat(D('3s'),D('3h')));
t('suit beat pair',canBeat(D('8s 8h'),D('8c 8d')));t('straight len mismatch',!canBeat(D('4s 5s 6s 7s'),D('3s 4c 5d')));
t('straight top',canBeat(D('4s 5s 6s'),D('4c 5d 6d'))===false&&canBeat(D('4s 5s 6h'),D('4c 5d 6d')));
t('3dt chops 2',canBeat(D('3s 3c 4d 4h 5s 5c'),D('2s')));t('3dt not pair2',!canBeat(D('3s 3c 4d 4h 5s 5c'),D('2s 2c')));
t('quad chops 2',canBeat(D('9s 9c 9d 9h'),D('2h')));t('quad chops pair2',canBeat(D('9s 9c 9d 9h'),D('2s 2h')));
t('quad chops 3dt',canBeat(D('3s 3c 3d 3h'),D('Js Jc Qd Qh Ks Kc')));
t('4dt chops quad',canBeat(D('3s 3c 4d 4h 5s 5c 6s 6h'),D('As Ac Ad Ah')));
t('4dt chops pair2',canBeat(D('3s 3c 4d 4h 5s 5c 6s 6h'),D('2s 2h')));
t('4dt chops 3dt',canBeat(D('3s 3c 4d 4h 5s 5c 6s 6h'),D('Js Jc Qd Qh Ks Kc')));
t('quad no chop single',!canBeat(D('9s 9c 9d 9h'),D('Ah')));t('quad beats quad',canBeat(D('10s 10c 10d 10h'),D('9s 9c 9d 9h')));
t('quad no chop 4dt',!canBeat(D('As Ac Ad Ah'),D('3s 3c 4d 4h 5s 5c 6s 6h')));
t('dragon',instantWin(P('3s 4s 5s 6s 7s 8s 9s 10s Js Qs Ks As 2h'))!==null);
t('4 twos',instantWin(P('2s 2c 2d 2h 3s 5c 7d 9h Js Kc 4d 6h 8s'))==='Tứ quý 2');
t('6 pairs',instantWin(P('3s 3c 5d 5h 7s 7c 9d 9h Js Jc Ks Kc 4d'))==='6 đôi');
t('none',instantWin(P('3s 4c 6d 8h 9s Jc Kd 2h 5s 7c 10d Qh 2c'))===null);
const h=P('3s 5c 7d 2h');t('bot must include 3s',botMove(h,null,P('3s')[0],[13]).includes(P('3s')[0]));
t('bot saves 2',botMove(P('2h 9s 4c 6d 8h Jc Qd'),D('8s'),null,[10,10])[0]===P('8h')[0]);
t('bot finishes',botMove(P('2h'),D('As'),null,[5]).length===1);
t('bot chops 2',botMove(P('9s 9c 9d 9h'),D('2h'),null,[5]).length===4);
// random fuzz: combos all valid
for(let i=0;i<200;i++){const d=[...Array(52).keys()].sort(()=>Math.random()-.5).slice(0,13);R.combos(d).forEach(c=>{if(!detect(c.cards))fail++;});}
console.log(`pass ${pass} fail ${fail}`);
