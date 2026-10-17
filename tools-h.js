// helper cho kiểm thử giao diện: mở trang, dọn popup huy hiệu, đặt hồ sơ
const {chromium}=require('playwright-core');
exports.launch=()=>chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
exports.open=async(b,w,h,setup)=>{const p=await b.newPage({viewport:{width:w,height:h||760}});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto('http://localhost:8765/index.html?t='+Date.now());await p.waitForTimeout(900);
 await p.evaluate(()=>{closeModal();setInterval(()=>{document.querySelectorAll('#badgeFX,.starfx').forEach(e=>e.remove());try{BQ.length=0;_bShow=false}catch(e){}},80);});
 if(setup)await p.evaluate(setup);return p;};
