const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await (await b.newContext({viewport:{width:461,height:1024},hasTouch:true})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(800);
const before=await p.evaluate(()=>{closeModal();USER={id:'me-1',email:'x@t.invalid'};PR.name='An';
 const L=levelInfo(PR.xp);PR.xp+=L.need-L.cur-1; /* sát lên cấp */ PR.stats.games=Math.max(0,(PR.stats.games||0));
 window._q0=JSON.stringify((PR.quests||PR.q||{}));
 Object.assign(ONL,{active:true,code:'TSTAAA',me:{uid:'me-1',name:'An'},room:{bet:100,seats:[]}});
 const tr={on(){},send(){}};ONL.host=new OnlineHost(tr,{uid:'me-1',name:'An'},{fillBots:true,dealMs:2300,botDelay:60,turnMs:400,bet:100});
 ONL.host.onState=(s,r)=>{ONL.room=r;if(s)onlineState(s,true);};
 /* chơi hộ: mỗi lượt của mình đánh nước gợi ý */ 
 return {xp:PR.xp,lv:levelInfo(PR.xp).lv,games:PR.stats.games,badges:(PR.badges||[]).length};});
await p.evaluate(()=>{ONL.host.opt.fillBots=true;ONL.host.start(Math.random);});
// tự động: khi tới lượt mình gửi nước của bot
await p.evaluate(()=>{window._auto=setInterval(()=>{const st=ONL.host.st;if(!st||st.over||DEALING)return;const me=st.seats.findIndex(s=>s&&s.uid==='me-1');if(st.turn===me&&(ONL.host._dealUntil||0)<Date.now()){ONL.host.onIntent({uid:'me-1',a:oBotMove(st,1)});}},150);});
let over=false;for(let i=0;i<120&&!over;i++){await p.waitForTimeout(500);over=await p.evaluate(()=>ONL.host.st.over);}
await p.waitForTimeout(900);const midFin=await p.evaluate(()=>({fin:!!document.getElementById('finFX'),cap:(document.querySelector('.fincap')||{}).textContent,fans:document.querySelectorAll('.finfan').length,modal:modalOpen()}));
await p.screenshot({path:'shots/v23-onl-final.png'});
await p.click('#finGo');await p.waitForTimeout(1500);await p.screenshot({path:'shots/v23-onl-result.png'});
const res=await p.evaluate(()=>({modal:modalOpen(),rewbox:!!document.querySelector('#modalIn .rewbox'),xp:PR.xp,lv:levelInfo(PR.xp).lv,games:PR.stats.games,badges:(PR.badges||[]).length,qchanged:JSON.stringify((PR.quests||PR.q||{}))!==window._q0}));
await p.waitForTimeout(3000);await p.evaluate(()=>closeModal());await p.waitForTimeout(2500);
const after=await p.evaluate(()=>({badgeFX:!!document.getElementById('badgeFX'),lvup:!!document.querySelector('.lvup,#lvUp,.levelup')}));
await p.screenshot({path:'shots/v23-onl-after.png'});
console.log('before',JSON.stringify(before));console.log('over',over,'final hold',JSON.stringify(midFin));console.log('result',JSON.stringify(res));console.log('after close',JSON.stringify(after));console.log('errs',errs);await b.close();})();
