// v1.59.0: Mậu binh (Binh sập xám) — luật chấm chi, lủng, sập, sập làng, mậu binh trắng, xếp tự động, tính xu + giao diện 360–461
const G=require('./games2.js');let f=0;const ok=(c,m)=>{console.log((c?'ok ':'FAIL ')+m);if(!c)f++;};
const R='3456789TJQKA2',S='scdh';const C=s=>R.indexOf(s[0])*4+S.indexOf(s[1]);const H=s=>s.split(' ').map(C);
const A=(a,b,c)=>[H(a),H(b),H(c)];
const vge=(a,b)=>{const x=a.split('.').map(Number),y=b.split('.').map(Number);for(let i=0;i<3;i++){if((x[i]||0)!==(y[i]||0))return (x[i]||0)>(y[i]||0);}return true;};
const fs=require('fs');const v9=fs.readFileSync('src/v9.js','utf8');const V=(v9.match(/APP_V='([^']+)'/)||[])[1];ok(V&&vge(V,'1.59.0'),'APP_V ≥ 1.59.0 ('+V+')');ok(/\['1\.59\.0','26\/10'/.test(v9),'changelog 1.59.0');
// đánh giá bộ
const E=s=>G.mbEval(H(s))[0];
ok(E('As Ad Ah')===3,'chi 3: xám');ok(E('Ks Kd 5h')===1,'chi 3: đôi');ok(E('9s Td Jh')===0,'chi 3: ba lá liền vẫn là mậu thầu');ok(E('9h Th Jh')===0,'chi 3: ba lá đồng chất vẫn mậu thầu');
ok(E('9h Th Jh Qh Kh')===8,'thùng phá sảnh');ok(E('9h 9s 9d 9c Kh')===7,'tứ quý');ok(E('9h 9s 9d Kc Kh')===6,'cù lũ');ok(E('2h 7h 9h Jh Kh')===5,'thùng');ok(E('9h Ts Jd Qc Kh')===4,'sảnh');ok(E('Ah 2s 3d 4c 5h')===4,'sảnh A-2-3-4-5');
ok(E('9h 9s 9d Kc 3h')===3,'xám chi');ok(E('9h 9s Kd Kc 3h')===2,'thú');ok(E('9h 9s Kd Qc 3h')===1,'đôi');ok(E('9h Ts Kd Qc 3h')===0,'mậu thầu');
ok(G.MB_NAMES.join()==='Mậu thầu,Đôi,Thú,Xám chi,Sảnh,Thùng,Cù lũ,Tứ quý,Thùng phá sảnh','thứ tự tên bộ');
// so sánh
const cmp=(a,b)=>G.cmpSc(G.mbEval(H(a)),G.mbEval(H(b)));
ok(cmp('As Ad 3h','Ks Kd Qh')>0,'đôi A > đôi K');ok(cmp('Ks Kd Qh','Ks Kd Jh')>0,'cùng đôi so lá lẻ');ok(cmp('As Ad 3h','As Ad 3h')===0,'bằng nhau');
ok(cmp('2h 7h 9h Jh Kh','9h Ts Jd Qc Ks')>0,'thùng > sảnh');ok(cmp('9h 9s 9d Kc Kh','2h 7h 9h Jh Kh')>0,'cù lũ > thùng');ok(cmp('Ah 2s 3d 4c 5h','6h 2s 3d 4c 5s')<0,'sảnh A-5 < sảnh 2-6');
ok(G.cmpSc(G.mbEval(H('5s 5d 5h')),G.mbEval(H('9h 9s Kd Kc 3h')))>0,'xám chi 3 > thú chi 2');ok(G.cmpSc(G.mbEval(H('Ks Kd 5h')),G.mbEval(H('Ks Kd 5c 4c 3d')))<=0,'đôi K-5 (3 lá) ≤ đôi K-5-4-3 → không lủng');
// lủng
ok(G.mbIsLung(A('9h 9s Kd Qc 3h','2d 7d 9d Jd Kd','As Ad 4h')),'chi 1 đôi < chi 2 thùng → lủng');
ok(G.mbIsLung(A('2d 7d 9d Jd Kd','9h 9s Kc Qc 3h','As Ad 4h')),'chi 2 đôi 9 < chi 3 đôi A → lủng');
ok(!G.mbIsLung(A('2d 7d 9d Jd Kd','9h 9s Kc Kh 3h','As Ad 4h')),'thùng ≥ thú ≥ đôi → hợp lệ');
// tính chi 2 người
const P=(arrs)=>G.mbSettle(arrs).P;
const w1=A('2d 7d 9d Jd Kd','9h 9s Kc Kh 3h','As Ad 4h'),l1=A('3c 3s 6c 6h Th','5c 5s 8c Jh Qh','4s 6s 7s');
let r=G.mbSettle([w1,l1]);ok(r.P[0][1]===6&&r.P[1][0]===-6&&r.sap[0][1]===1,'thắng cả 3 chi → sập ×2 = 6 chi');
const mix=A('2d 7d 9d Jd Kd','5c 5s 8c Jh Qh','4s 6s 7s'),mix2=A('Tc Ts Qc Qh 3d','9h 9s Kc 5h 3h','8s 8d 4h');
r=G.mbSettle([mix,mix2]);ok(r.P[0][1]===-1&&!r.sap[0][1]&&!r.sap[1][0],'thắng 1 thua 2 → -1 chi, không sập');
const tq=A('9h 9s 9d 9c 3h','5c 5s 8c Jh Qh','4s 6s 7s'),nn=A('2d 7d 9d Jd Kd','Tc Ts Kc Kh 3h','As Ad 4h');
r=G.mbSettle([tq,nn]);ok(r.P[0][1]===4-1-1,'tứ quý chi 1 ăn 4 chi');
const cl=A('Ac As Ah 2c 2h','9h 9s 9d Kc Kh','4s 6s 8s'),c2=A('6c 6s 6d 6h 3c','5c 5s 5d Jh Th','As Ad 4h');
r=G.mbSettle([cl,c2]);ok(r.P[0][1]===-4+2-1,'cù lũ chi 2 ăn 2 chi, thua tứ quý chi 1 mất 4');
const xm=A('2d 7d 9d Jd Kd','6c 7s 8d 9h Th','Ac As Ah'),x2=A('3c 3s 3d 3h 4h','9h 9s 2d 2c 6h','Qs Qd 4h');
r=G.mbSettle([xm,x2]);ok(!r.lung[0]&&!r.lung[1]&&r.P[0][1]===-4+1+3,'xám chi 3 ăn 3 chi');
ok(G.mbChiVal(0,[8])===5&&G.mbChiVal(1,[8])===10&&G.mbChiVal(1,[7])===8,'TPS chi1=5, chi2=10, tứ quý chi2=8');
// lủng trả 6
const lu=A('9h 9s Kd Qc 3h','2d 7d 9d Jd Kd','As Ad 4h');r=G.mbSettle([lu,l1]);ok(r.lung[0]&&r.P[0][1]===-6,'binh lủng thua 6 chi');
r=G.mbSettle([lu,lu.map(x=>x.slice())]);ok(r.P[0][1]===0,'cả hai lủng → hòa');
// sập làng (4 người)
const big=A('Ac As Ah Ad 2c','Kc Ks Kh Kd 2h','Qc Qs Qh'),p1=A('5c 5s 9c Jh 7h','3c 4s 6c 8h Th','4c 6s 7s'),p2=A('5d 5h 9d Jd 7c','3d 4h 6d 8d Td','4d 6h 7d'),p3=A('2s 2d 9s Js 7d','3s 4c 6s 8s Ts','4h 5c 9h');
r=G.mbSettle([big,p1,p2,p3]);ok(!r.lung.some(Boolean)&&r.sapLang===0,'sập làng nhận đúng');ok(r.P[0][1]===(4+8+3)*4,'sập làng: (4+8+3)×2×2 = 60 chi mỗi người ('+r.P[0][1]+')');
ok(r.tot.reduce((a,b)=>a+b,0)===0,'tổng chi = 0');
// mậu binh trắng
const T=s=>G.mbTrang(H(s));
ok(T('3s 4h 5d 6c 7s 8h 9d Tc Js Qh Kd Ac 2s').name==='Sảnh rồng'&&T('3s 4h 5d 6c 7s 8h 9d Tc Js Qh Kd Ac 2s').pay===24,'sảnh rồng 24 chi');
ok(T('3s 3h 5d 5c 7s 7h 9d 9c Js Jh Kd Kc 2s').pay===6&&/6 đôi/.test(T('3s 3h 5d 5c 7s 7h 9d 9c Js Jh Kd Kc 2s').name),'lục phé bôn');
ok(T('3s 3h 3d 5c 5s 7h 7d 9c 9s Jh Jd Kc Ks').pay===8,'năm đôi một xám 8 chi');
ok(T('3h 3d 4h 6d 8h 9h Th Qd Jh Kh Ah 2h 5d').pay===12,'đồng màu 12 chi');
const t3=T('2s 5s 8s Js 3s 3c 6c 9c Qc Ac 4d 7d Td');ok(t3&&t3.name==='Ba thùng'&&t3.arr&&!G.mbIsLung(t3.arr),'ba thùng + cách xếp hợp lệ');
const s3=T('3s 4h 5d 6c 7s 8h 9d Tc Js Qc Qh Kd Ad');ok(s3&&s3.name==='Ba sảnh','ba sảnh');
ok(T('3s 4h 6d 8c Ts Qh Ad 3c 5s 9h Jd Kh 2c')===null,'bài thường không trắng');
r=G.mbSettle([A('3s 4h 5d 6c 7s','8h 9d Tc Js Qh','Kd Ac 2s'),l1],[T('3s 4h 5d 6c 7s 8h 9d Tc Js Qh Kd Ac 2s'),null]);ok(r.P[0][1]===24,'trắng rồng ăn 24 chi với bài thường');
r=G.mbSettle([w1,l1],[t3,s3]);ok(r.P[0][1]===6,'ba thùng > ba sảnh');r=G.mbSettle([w1,l1],[s3,s3]);ok(r.P[0][1]===0,'trắng cùng loại hòa');
// xếp tự động
let bad=0,used=0,t0=Date.now();const D=[...Array(52).keys()];
for(let k=0;k<120;k++){const d=D.slice().sort(()=>Math.random()-.5).slice(0,13);const a=G.mbBest(d,k%2?Object.assign(()=>Math.random(),{amp:.6}):null);if(!a||a[0].length!==5||a[1].length!==5||a[2].length!==3||G.mbIsLung(a))bad++;if([...a[0],...a[1],...a[2]].sort((x,y)=>x-y).join()!==d.slice().sort((x,y)=>x-y).join())used++;}
ok(!bad&&!used,'xếp tự động 120 tay: luôn hợp lệ, đủ 13 lá ('+((Date.now()-t0)/120).toFixed(0)+'ms/tay)');
const bb=G.mbBest(H('Ac As Ah Ad 2c Kc Ks Kh 5d 7d 9s Jh 3c'));ok(G.mbEval(bb[0])[0]>=7,'xếp tự động giữ tứ quý');
// đổi ra xu, giới hạn tiền
let X=G.mbPayMat([[0,6],[-6,0]],10000,[1e9,25000]);ok(X[0][1]===25000&&X[1][0]===-25000,'thua không quá số xu có');
const n4=G.mbSettle([big,p1,p2,p3]);const pay=G.mbPayXu(n4.P,1000,[1e9,1e9,1e9,1e9]);ok(pay[0]===180000&&pay.reduce((a,b)=>a+b,0)===0,'xu: 3×60 chi ×1k = 180k, tổng 0');
X=G.mbPayMat(n4.P,1000,[1e9,5000,1e9,1e9]);ok(X[0][1]===5000&&X.flat().reduce((a,b)=>a+b,0)===0,'giới hạn từng cặp, tổng vẫn 0');
// file nguồn
const ui=fs.readFileSync('src/games2-ui.js','utf8'),pr=fs.readFileSync('progress.js','utf8'),hd=fs.readFileSync('src/head.html','utf8');
ok(/MODES\.push\(\['maubinh'/.test(ui)&&/MG_MODE\.maubinh/.test(ui),'đăng ký chế độ maubinh');ok(/XP_MODE=\{[^}]*maubinh:\[/.test(pr),'EXP maubinh');ok(/\.mbtbl/.test(hd),'CSS maubinh');
// giao diện
const {chromium}=require('playwright-core');const URL=process.env.TURL||'http://localhost:8765/index.html';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const SZ=[[360,740],[360,780],[412,780],[461,800]];
const chk=async(p,tag,w,h)=>{const r=await p.evaluate(()=>{document.querySelectorAll('#badgeFX').forEach(e=>e.remove());const t=document.querySelector('#mg .mbtbl');const bs=[...document.querySelectorAll('#mg .cgctl button')];
 const hit=bs.map(x=>{const q=x.getBoundingClientRect();if(q.bottom>innerHeight+1||q.top<0||q.right>innerWidth+1)return x.textContent.trim()+':off';const e=document.elementFromPoint(q.x+q.width/2,q.y+q.height/2);return e&&(e===x||x.contains(e)||e.closest('.xpfloat,.flt,.fly'))?'':x.textContent.trim()+':cov';}).filter(Boolean);
 return {fit:t.scrollHeight<=t.clientHeight+2,ovx:document.documentElement.scrollWidth>innerWidth+1,hit,txt:bs.map(x=>x.textContent.trim()).join('|')};});
 ok(r.fit&&!r.ovx,`${w}x${h} ${tag}: vừa màn, không tràn`);ok(!r.hit.length,`${w}x${h} ${tag}: nút thấy & bấm được (${r.hit})`);return r;};
for(const [w,h] of SZ){const p=await b.newPage({viewport:{width:w,height:h},hasTouch:true,isMobile:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(URL+'?t='+Date.now());await p.waitForTimeout(1200);
 await p.evaluate(()=>{closeModal();let x=0;while(levelInfo(x).level<72)x+=100;PR.xp=x;PR.xu=5e6;saveP();setInterval(()=>{document.querySelectorAll('#badgeFX').forEach(e=>e.remove());},100);setMode('maubinh');renderHome();});
 await p.waitForTimeout(300);ok(await p.evaluate(()=>!!document.querySelector('[data-m="maubinh"],[onclick*="maubinh"]')||MODES.some(m=>m[0]==='maubinh')),`${w}: có ô Mậu binh ở sảnh`);
 await p.evaluate(()=>openTables());await p.waitForTimeout(400);ok(await p.evaluate(()=>!!document.querySelector('#mg.mg-maubinh')),`${w}: mở bàn Mậu binh`);
 let r=await chk(p,'chờ',w,h);ok(/Ván mới/.test(r.txt)&&/Mức cược|🎚/.test(r.txt),`${w}: có Ván mới + nút mức cược`);
 // mức cược LV
 await p.evaluate(()=>{const bt=[...document.querySelectorAll('#mg .cgctl button')].find(x=>/🎚/.test(x.textContent));bt.click();});await p.waitForTimeout(300);
 ok(await p.evaluate(()=>/10k/.test(document.body.textContent)&&/Lv/.test(document.body.textContent)),`${w}: bảng chọn mức cược có mức LV`);await p.evaluate(()=>{closeModal();mbSet('bet',10000);});
 // ván: bấm Ván mới
 await p.evaluate(()=>{const bt=[...document.querySelectorAll('#mg .cgctl button')].find(x=>/Ván mới/.test(x.textContent));bt.click();});await p.waitForTimeout(500);
 ok(await p.evaluate(()=>MG.st&&MG.st.phase==='arrange'&&MG.st.arr.every(a=>a[0].length+a[1].length+a[2].length===13)),`${w}: chia 13 lá mỗi người`);
 ok(await p.evaluate(()=>MG.st.arr.slice(1).every(a=>!mbIsLung(a))),`${w}: máy xếp hợp lệ`);
 await chk(p,'đang xếp',w,h);
 // chạm 1 lá rồi lá khác → đổi chỗ
 const sw=await p.evaluate(()=>{const a=MG.st.arr[0];const x=a[2][0],y=a[0][0];mbTap(x);const pk=!!document.querySelector('#mg .mbc.pick');mbTap(y);return pk&&MG.st.arr[0][2].includes(y)&&MG.st.arr[0][0].includes(x)&&MG.st.arr[0][2].length===3;});ok(sw,`${w}: chạm 2 lá → đổi chỗ giữa 2 chi`);
 const mv=await p.evaluate(()=>{const a=MG.st.arr[0];const x=a[2][1];mbTap(x);mbToChi(0);return MG.st.arr[0][0].includes(x)&&MG.st.arr[0][0].length===5&&MG.st.arr[0][2].length===3;});ok(mv,`${w}: chạm lá rồi chạm chi → chuyển sang chi đó`);
 // lủng → cảnh báo
 const lw=await p.evaluate(()=>{const st=MG.st;const s=[...st.arr[0][0],...st.arr[0][1],...st.arr[0][2]];const b=mbBest(s);st.arr[0]=[b[2].concat(b[1].slice(0,2)),b[1].slice(2).concat(b[0].slice(0,2)),b[0].slice(2,5)];if(!mbIsLung(st.arr[0]))return 'skip';mbR();return !!document.querySelector('#mg .mbmsg.warn')&&!!document.querySelector('#mg .mbmrow.bad');});
 ok(lw==='skip'||lw===true,`${w}: binh lủng hiện cảnh báo (${lw})`);
 await p.evaluate(()=>{const bt=[...document.querySelectorAll('#mg .cgctl button')].find(x=>/Xếp tự động/.test(x.textContent));bt.click();});await p.waitForTimeout(200);
 ok(await p.evaluate(()=>!mbIsLung(MG.st.arr[0])&&!document.querySelector('#mg .mbmsg.warn')),`${w}: Xếp tự động → hết lủng`);
 if(w===360&&h===740){await p.evaluate(()=>{MG.st.sel=null;mbR();});await p.waitForTimeout(150);await p.screenshot({path:'shots/v1590-arrange-360x740.png'});}
 const x0=await p.evaluate(()=>PR.xu);
 await p.evaluate(()=>{const bt=[...document.querySelectorAll('#mg .cgctl button')].find(x=>/Xong|Mậu binh/.test(x.textContent));bt.click();});await p.waitForTimeout(700);
 ok(await p.evaluate(()=>MG.st.phase==='reveal'||MG.st.phase==='done'),`${w}: Xong → so bài`);await chk(p,'so bài',w,h).catch(()=>0);
 ok(await p.waitForFunction(()=>MG.st.phase==='done',null,{timeout:15000}).then(()=>1).catch(()=>0),`${w}: so xong`);await p.waitForTimeout(500);
 const d=await p.evaluate(x0=>({dx:PR.xu-x0,pay:MG.st.pay[0],R:MG.st.R.P[0].reduce((a,b)=>a+b,0),msg:MG.st.msg,led:MG.st.ledger.reduce((a,l)=>a+l[1],0),txt:document.querySelector('#mg').textContent}),x0);
 ok(d.dx>=d.pay&&d.led===d.pay,`${w}: xu đổi đúng = ${d.pay} (bảng ${d.led}, ví ${d.dx})`);ok(!/[-−]\s*[-−]\s*\d/.test(d.txt),`${w}: không có dấu trừ kép`);
 r=await chk(p,'kết quả',w,h);ok(/Ván mới/.test(r.txt),`${w}: Ván mới ở kết quả`);
 if(w===360&&h===740){await p.waitForTimeout(2600);await p.screenshot({path:'shots/v1590-result-360x740.png'});}
 // Luật
 await p.evaluate(()=>{const bt=[...document.querySelectorAll('#mg .cgctl button')].find(x=>/Luật/.test(x.textContent));bt.click();});await p.waitForTimeout(300);
 ok(await p.evaluate(()=>modalOpen()&&/lủng/i.test(document.getElementById('modalIn').textContent)&&/Sập làng/i.test(document.getElementById('modalIn').textContent)),`${w}: bảng Luật tiếng Việt`);await p.evaluate(()=>closeModal());
 // ván 2 bằng chạm, hết giờ tự xếp
 const q=await p.evaluate(()=>{const bt=[...document.querySelectorAll('#mg .cgctl button')].find(x=>/Ván mới/.test(x.textContent));const r=bt.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
 await p.touchscreen.tap(q.x,q.y);await p.waitForTimeout(500);ok(await p.evaluate(()=>MG.st.phase==='arrange'),`${w}: chạm Ván mới → ván mới`);
 await p.evaluate(()=>{const st=MG.st;const s=[...st.arr[0][0],...st.arr[0][1],...st.arr[0][2]].sort((a,b)=>a-b);st.arr[0]=[s.slice(0,5),s.slice(5,10),s.slice(10)];st.dl=Date.now()-1000;});
 ok(await p.waitForFunction(()=>MG.st.phase!=='arrange',null,{timeout:5000}).then(()=>1).catch(()=>0),`${w}: hết 60s tự so`);
 ok(await p.evaluate(()=>!MG.st.R.lung[0]||!!MG.st.trang[0]),`${w}: hết giờ bài lủng → tự xếp lại`);
 await p.waitForFunction(()=>MG.st.phase==='done',null,{timeout:15000}).catch(()=>0);
 ok(await p.evaluate(()=>(PR.stats.mbGames||0)>=2),`${w}: ghi thống kê mbGames`);
 ok(!errs.length,`${w}: không lỗi JS ${errs}`);await p.close();}
await b.close();console.log(f?'FAILED '+f:'ALL OK');process.exit(f?1:0);})();
