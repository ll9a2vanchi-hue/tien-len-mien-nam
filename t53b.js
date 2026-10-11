const {chromium}=require('playwright-core');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const errs=[];
const p=await b.newPage({viewport:{width:360,height:800}});p.on('pageerror',e=>errs.push(e.stack.slice(0,500)));
await p.goto('http://localhost:8765/index.html?t=x'+Date.now());await p.waitForTimeout(800);
for(let g=0;g<4;g++){await p.evaluate(()=>{closeModal();PR.xu=100000;if(!MG.g){setMode('domino');openTables();dmSet('n',2);}dmDeal();if(!window._iv)window._iv=setInterval(()=>{const st=MG.st;if(!st||st.phase!=='play'||st.turn!==0)return;if(st.need==='draw')return dmDraw();if(st.need==='pass')return dmPassBtn();if(st.choose)return dmGo('R');const k=st.hands[0].findIndex(t=>dmOk(t));if(k<0)return;if(st.sel!==k)return dmTap(k);dmGo();},200);});
 await p.waitForFunction(()=>MG.st&&MG.st.phase==='done',null,{timeout:40000}).catch(()=>{});
 console.log(await p.evaluate(()=>{const st=MG.st;return JSON.stringify({ph:st.phase,turn:st.turn,need:st.need,sel:st.sel,choose:st.choose,first:st.first,ends:st.ends,h:st.hands,bone:st.bone.length,pass:st.pass,msg:st.msg,bt:st._bt});}));}
console.log(errs);await b.close();})();
