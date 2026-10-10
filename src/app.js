// ---------- PWA: cài đặt + service worker ----------
let deferredPrompt=null;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent||'')||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isStandalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
if('serviceWorker' in navigator&&location.protocol!=='file:'){const hadCtl=!!navigator.serviceWorker.controller;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadCtl){const u=document.getElementById('updBar');if(u)u.className='on';}});
 window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{const chk=()=>reg.update().catch(()=>{});setInterval(chk,30*60*1000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')chk();});}).catch(()=>{}));}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('bInstall').style.display='';});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;$('bInstall').style.display='none';toast(I('check')+' Đã cài đặt ứng dụng!');});
if(isIOS&&!isStandalone&&$('bInstall'))$('bInstall').style.display='';
async function doInstall(){
 if(deferredPrompt){deferredPrompt.prompt();try{await deferredPrompt.userChoice;}catch(e){}deferredPrompt=null;$('bInstall').style.display='none';return;}
 modal(`<h3>${I('install')} Cài đặt ứng dụng</h3>`+(isIOS?
  `<p>Trên iPhone/iPad (Safari):</p><ol><li>Bấm nút <b>Chia sẻ</b> ${I('share')}</li><li>Chọn <b>“Thêm vào Màn hình chính”</b></li><li>Bấm <b>Thêm</b></li></ol><p class="small">Sau khi cài, game chơi được hoàn toàn không cần mạng.</p>`:
  `<p>Mở menu trình duyệt (⋮) và chọn <b>“Cài đặt ứng dụng”</b> hoặc <b>“Thêm vào màn hình chính”</b>.</p>`));}
// ---------- Tài khoản + sao lưu đám mây (Supabase) ----------
const CFG=window.TLMN_CLOUD||{};const CLOUD_ON=!!(CFG.url&&CFG.anonKey);
let SB=null,USER=null,lastSync=localStorage.getItem('tlmn_lastsync');
function localSave(){return{profile:PR,scores:S,updatedAt:+(localStorage.getItem('tlmn_updated')||0)};}
function applySave(d){if(!d||!d.profile)return;PR=d.profile;if(d.scores)S=d.scores;localStorage.setItem('tlmn_profile',JSON.stringify(PR));save();localStorage.setItem('tlmn_updated',String(d.updatedAt||Date.now()));updHud();if(G)render();}
function loadSB(){return new Promise((res,rej)=>{if(!CLOUD_ON)return rej(new Error('Chưa cấu hình máy chủ'));if(SB)return res(SB);
 const go=()=>{try{SB=window.supabase.createClient(CFG.url,CFG.anonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  SB.auth.onAuthStateChange((ev,ses)=>{const was=USER;USER=ses&&ses.user||null;updAcc();if(USER&&!was)cloudPull(true);});res(SB);}catch(e){rej(e);}};
 if(window.supabase)return go();const sc=document.createElement('script');sc.src='vendor/supabase.js';sc.onload=go;sc.onerror=()=>rej(new Error('Không tải được thư viện'));document.head.appendChild(sc);});}
function updAcc(){const d=$('d3');if(d)d.innerHTML=USER?'<span class="dot" style="background:#4caf50"></span>':'';}
async function cloudPull(merge){if(!SB||!USER)return;
 const{data,error}=await SB.from('tlmn_saves').select('data,updated_at').eq('user_id',USER.id).maybeSingle();
 if(error){toast('Lỗi tải bản lưu: '+error.message);return;}
 if(data&&data.data){const m=merge?mergeSaves(localSave(),data.data):data.data;applySave(m);toast(I('cloud')+' Đã đồng bộ từ đám mây');}
 await cloudPush(true);}
async function cloudPush(quiet){if(!SB||!USER){if(!quiet)toast('Hãy đăng nhập để sao lưu');return false;}
 const d=localSave();d.updatedAt=d.updatedAt||Date.now();
 const{error}=await SB.from('tlmn_saves').upsert({user_id:USER.id,data:d,updated_at:new Date().toISOString()});
 if(error){if(!quiet)toast('Lỗi sao lưu: '+error.message);return false;}
 lastSync=new Date().toLocaleString('vi-VN');localStorage.setItem('tlmn_lastsync',lastSync);if(!quiet)toast(I('cloud')+' Đã sao lưu lên đám mây');return true;}
function cloudAutoBackup(){if(USER&&navigator.onLine!==false)cloudPush(true);}
async function cloudRestore(){if(!SB||!USER)return;const{data,error}=await SB.from('tlmn_saves').select('data').eq('user_id',USER.id).maybeSingle();
 if(error)return toast('Lỗi: '+error.message);if(!data)return toast('Chưa có bản sao lưu');applySave(data.data);toast(I('check')+' Đã khôi phục bản sao lưu');openAccount();}
const INSTALL_ROW=()=>isStandalone?'':`<div class="row">${I('install')} <span style="flex:1">Cài game như ứng dụng, chơi offline</span><button class="alt" onclick="doInstall()">Cài đặt</button></div>`;
function openAccount(){
 if(!CLOUD_ON){modal(`<h3>${I('user')} Tài khoản</h3><p>Bạn đang chơi chế độ <b>Khách</b> — mọi tiến độ lưu trên máy này.</p><p class="small">Sao lưu đám mây chưa được bật (chưa cấu hình máy chủ).</p>`+INSTALL_ROW());return;}
 if(navigator.onLine===false){modal(`<h3>${I('user')} Tài khoản</h3><p>Bạn đang offline. Game vẫn chơi bình thường; sao lưu khi có mạng.</p>`);return;}
 modal(`<h3>${I('user')} Tài khoản</h3><p class="small">Đang kết nối…</p>`);
 loadSB().then(()=>SB.auth.getSession()).then(({data})=>{USER=data.session&&data.session.user||null;updAcc();renderAcc();}).catch(e=>modal(`<h3>Tài khoản</h3><p class="err">${e.message}</p>`));}
function renderAcc(m){
 if(USER)modal(`<h3>${I('user')} Tài khoản</h3><p>Đăng nhập: <b>${USER.email}</b></p><p class="small">Lần sao lưu gần nhất: ${lastSync||'chưa có'} · Tự động sao lưu sau mỗi ván.</p>
  <button onclick="cloudPush()">${I('cloud')} Sao lưu</button><button class="alt" onclick="if(confirm('Thay tiến độ trên máy bằng bản sao lưu?'))cloudRestore()">Khôi phục</button><button class="alt" onclick="doLogout()">Đăng xuất</button>`+INSTALL_ROW());
 else modal(`<h3>${I('user')} Đăng nhập / Đăng ký</h3><p class="small">Đăng nhập để sao lưu xu, huy hiệu, nhiệm vụ lên đám mây. Không bắt buộc — chơi khách vẫn đầy đủ.</p>
  <input class="inp" id="aEmail" type="email" placeholder="Email" autocomplete="email"><input class="inp" id="aPass" type="password" placeholder="Mật khẩu (≥ 6 ký tự)" autocomplete="current-password">
  <p class="err" id="aErr">${m||''}</p><button onclick="doAuth('in')">Đăng nhập</button><button class="alt" onclick="doAuth('up')">Đăng ký</button><button class="alt" onclick="doAuth('link')">Gửi link đăng nhập</button>`+INSTALL_ROW());}
async function doAuth(k){const email=$('aEmail').value.trim(),password=$('aPass').value;const err=t=>{$('aErr').textContent=t;};
 if(!/^\S+@\S+\.\S+$/.test(email))return err('Email không hợp lệ');
 try{let r;
  if(k==='link'){r=await SB.auth.signInWithOtp({email,options:{emailRedirectTo:location.href.split('#')[0]}});if(r.error)throw r.error;return err('Đã gửi link đăng nhập, hãy kiểm tra email.');}
  if(password.length<6)return err('Mật khẩu tối thiểu 6 ký tự');
  r=k==='up'?await SB.auth.signUp({email,password}):await SB.auth.signInWithPassword({email,password});if(r.error)throw r.error;
  if(k==='up'&&!r.data.session)return err('Đã đăng ký! Hãy xác nhận email rồi đăng nhập.');
  USER=r.data.user;localStorage.setItem('tlmn_hadlogin','1');updAcc();await cloudPull(true);renderAcc();}catch(e){err(e.message||String(e));}}
async function doLogout(){if(SB)await SB.auth.signOut();USER=null;updAcc();renderAcc();}
if(CLOUD_ON&&navigator.onLine!==false&&(localStorage.getItem('tlmn_hadlogin')||location.hash.includes('access_token')))loadSB().then(()=>SB.auth.getSession()).then(({data})=>{USER=data.session&&data.session.user||null;if(USER){localStorage.setItem('tlmn_hadlogin','1');updAcc();}}).catch(()=>{});
