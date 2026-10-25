// v1.58.10: bảng Kết quả TLMN / Đếm lá — nút Ván mới/Đổi bàn/Về sảnh/Đóng luôn thấy được (đáy dính), danh sách cuộn bên trong
const {chromium}=require('playwright-core');const URL=process.env.TURL||'http://localhost:8765/index.html';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const SZ=[[360,740],[360,780],[412,780],[461,800]];
const vis=p=>p.evaluate(()=>{const bx=document.getElementById('badgeFX');if(bx)bx.remove();const m=document.getElementById('modalIn');const bs=[...m.querySelectorAll('.resfoot button')];
 const hit=bs.map(bt=>{const q=bt.getBoundingClientRect();if(q.bottom>innerHeight||q.top<0)return bt.textContent.trim()+':off';const c=[.15,.5,.85].map(k=>{const e=document.elementFromPoint(q.x+q.width*k,q.y+q.height/2);return (e&&(e===bt||bt.contains(e)))?'':!e?'null':((e.closest('[id]')||{}).id+'.'+String(e.className).slice(0,20));}).filter(Boolean);return c.length?bt.textContent.trim()+':cov '+c[0]:'';}).filter(Boolean);
 return {n:bs.length,txt:bs.map(x=>x.textContent.trim()).join('|'),hit,sh:m.scrollHeight,ch:m.clientHeight,stray:[...m.children].filter(c=>c.tagName==='BUTTON').length};});
for(const m of ['demla','tlmn']){const p=await b.newPage({viewport:{width:360,height:740},hasTouch:true,isMobile:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(URL+'?t='+Date.now());await p.waitForTimeout(1200);
 await p.evaluate(m=>{closeModal();setMode(m);startTable(4);window._drv=setInterval(()=>{try{if(G&&!G.over&&G.turn===0&&!DEALING)autoMove();}catch(e){}},300);},m);
 ok(await p.waitForFunction(()=>G&&G.over,null,{timeout:150000}).then(()=>1).catch(()=>0),m+': chơi hết ván');await p.waitForTimeout(800);
 for(let i=0;i<25;i++){await p.evaluate(()=>{const x=document.getElementById('badgeFX');if(x)x.remove();const g=document.getElementById('finGo');if(g)g.click();});await p.waitForTimeout(500);if(await p.evaluate(()=>modalOpen()&&/Kết quả/.test(document.getElementById('modalIn').textContent)))break;}
 for(const [w,h] of SZ){await p.setViewportSize({width:w,height:h});await p.evaluate(()=>{closeModal();if(typeof FIN!=="undefined")FIN.called=false;showRes();});await p.waitForTimeout(600);
  let v=await vis(p);ok(v.n===4&&/Ván mới/.test(v.txt)&&/Đóng/.test(v.txt)&&!v.stray,`${m} ${w}x${h}: đủ 4 nút trong đáy (${v.txt})`);ok(!v.hit.length,`${m} ${w}x${h}: nút thấy & bấm được khi mở (${v.hit})`);
  // danh sách dài (thêm hàng giả) → vẫn cuộn bên trong, nút vẫn thấy ở đầu và cuối
  await p.evaluate(()=>{const m=document.getElementById('modalIn');for(let i=0;i<8;i++)m.querySelector('.resfoot').insertAdjacentHTML('beforebegin','<div class="row">hàng thử '+i+'</div>');m.scrollTop=0;});await p.waitForTimeout(150);
  v=await vis(p);ok(v.sh>v.ch&&!v.hit.length,`${m} ${w}x${h}: danh sách dài — cuộn trong (${v.sh}>${v.ch}), nút vẫn thấy ở đầu`);
  await p.evaluate(()=>{const m=document.getElementById('modalIn');m.scrollTop=1e5;});await p.waitForTimeout(150);v=await vis(p);ok(!v.hit.length,`${m} ${w}x${h}: cuộn tới cuối nút vẫn thấy`);
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);ok(!ov,`${m} ${w}: không tràn ngang`);
  await p.evaluate(()=>{closeModal();if(typeof FIN!=="undefined")FIN.called=false;showRes();});await p.waitForTimeout(400);
  if(w===360&&h===740){await p.waitForFunction(()=>!document.body.classList.contains('rewardfx'),null,{timeout:8000}).catch(()=>0);await p.evaluate(()=>{document.getElementById('modalIn').scrollTop=0;});await p.waitForTimeout(200);}if(w===360&&h===740)await p.screenshot({path:`shots/v15810-${m}-360x740.png`});}
 await p.setViewportSize({width:360,height:740});await p.evaluate(()=>{closeModal();if(typeof FIN!=="undefined")FIN.called=false;showRes();});await p.waitForTimeout(500);
 const q=await p.evaluate(()=>{const bx=document.getElementById('badgeFX');if(bx)bx.remove();const bt=[...document.querySelectorAll('#modalIn .resfoot button')].find(x=>/Ván mới/.test(x.textContent));const r=bt.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
 await p.touchscreen.tap(q.x,q.y);let st=0;for(let i=0;i<20&&!st;i++){await p.waitForTimeout(400);st=await p.evaluate(()=>{const s=document.getElementById('startOv');if(s&&s.getClientRects().length){const bt=s.querySelector('.sbig');if(bt)bt.click();}return G&&!G.over&&!modalOpen()?1:0;});}
 ok(st,`${m}: chạm Ván mới ở 360x740 → ván mới bắt đầu`);
 ok(await p.evaluate(()=>{FIN.called=false;showRes();closeModal();return !document.getElementById('modalIn').classList.contains('hasfoot');}),`${m}: đóng bảng bỏ class hasfoot`);
 ok(!errs.length,`${m}: không lỗi JS ${errs}`);await p.close();}
// modal khác không bị ảnh hưởng
{const p=await b.newPage({viewport:{width:360,height:740}});await p.goto(URL+'?t='+Date.now());await p.waitForTimeout(1000);const r=await p.evaluate(()=>{modal('<h3>x</h3><button>a</button>');return !document.querySelector('#modalIn .resfoot');});ok(r,'modal thường không có đáy dính');await p.close();}
await b.close();console.log(f?'FAILED '+f:'ALL OK');process.exit(f?1:0);})();
