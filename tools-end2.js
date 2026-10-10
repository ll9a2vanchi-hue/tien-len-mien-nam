const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true})).newPage();
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(800);await p.evaluate(()=>{closeModal();startTable(4);});await p.waitForTimeout(3000);
// 1) treo: bot hết bài nhưng G.over chưa set
await p.evaluate(()=>{G.hands[1]=[];G.hands[2]=[];G.hands[3]=[];G.finished=[1,2,3];G.turn=2;G.over=false;render();});
await p.waitForTimeout(7000);t('watchdog ends + shows result',await p.evaluate(()=>G.over&&$('modalIn').textContent.includes('Kết quả')));
// 2) hookEnd ném lỗi
await p.evaluate(()=>{closeModal();newGame(4);});await p.waitForTimeout(3000);
await p.evaluate(()=>{window._he=hookEnd;hookEnd=()=>{throw new Error('boom')};const h=G.hands;h[1]=[];h[2]=[];G.finished=[1,2];G.turn=3;G.cur=null;G.passed=[0,0,0,0];G.hands[3]=[G.hands[3][0]];doPlay(3,[G.hands[3][0]]);});
await p.waitForTimeout(3500);t('result despite hookEnd error',await p.evaluate(()=>$('modalIn').textContent.includes('Kết quả')));
// 3) chiều cao vùng bài không đổi khi số lá thay đổi
await p.evaluate(()=>{closeModal();hookEnd=window._he;newGame(4);});await p.waitForTimeout(3000);
const hs=[];for(const n of [13,8,7,3,1]){hs.push(await p.evaluate(n=>{G.hands[0]=G.hands[0].slice(0,n);render();const r=$('hand').getBoundingClientRect();return Math.round(r.height)+'@'+Math.round(r.bottom);},n));}
console.log(hs.join(' '));t('hand height fixed',new Set(hs).size===1);t('hand within screen',hs.every(x=>+x.split('@')[1]<=1024));
await p.screenshot({path:'shots/v13-onecard.png'});console.log('pass',ok,'fail',bad);await b.close();process.exit(bad?1:0);})();
