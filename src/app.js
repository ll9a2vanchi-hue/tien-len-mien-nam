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
  SB.auth.onAuthStateChange((ev,ses)=>{const was=USER;USER=ses&&ses.user||null;updAcc();if(ev==='PASSWORD_RECOVERY'){setTimeout(openRecover,300);return;}if(USER&&!was){cloudPull(true);localStorage.setItem('tlmn_hadlogin','1');if(!PR.name&&typeof openRename==='function')setTimeout(()=>{if(!PR.name){const g=USER.user_metadata&&(USER.user_metadata.full_name||USER.user_metadata.name);openRename();if(g&&$('nmIn')&&!$('nmIn').value)$('nmIn').value=String(g).slice(0,16);}},1800);}});res(SB);}catch(e){rej(e);}};
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
let accMode='in';const RECOVERY_AT_LOAD=typeof location!=='undefined'&&/type=recovery/.test(location.hash);
const EYE=id=>`<button type="button" class="eye" aria-label="Hiện/ẩn mật khẩu" onclick="togglePw('${id}',this)">👁</button>`;
const PW=(id,ph,ac)=>`<div class="pwrap"><input class="inp" id="${id}" type="password" placeholder="${ph}" autocomplete="${ac}" oninput="pwCheck()">${EYE(id)}</div>`;
function togglePw(id,b){const e=$(id);if(!e)return;const show=e.type==='password';e.type=show?'text':'password';b.textContent=show?'🙈':'👁';b.classList.toggle('on',show);}
function pwCheck(){const a=$('aPass'),b=$('aPass2'),m=$('pwMsg');if(!m||!a)return;let t='',ok=true;
 if(a.value&&a.value.length<6){t='Mật khẩu tối thiểu 6 ký tự';ok=false;}else if(b&&b.value&&a.value!==b.value){t='Mật khẩu nhập lại không khớp';ok=false;}else if(b&&b.value&&a.value===b.value)t='✓ Mật khẩu khớp';
 m.textContent=t;m.className='pwmsg '+(ok?'ok':'bad');}
function viErr(e){const m=(e&&(e.message||e.msg||String(e)))||'';const s=(e&&e.status)||0;
 if(/rate limit|too many|over_email_send_rate|429/i.test(m)||s===429)return 'Bạn thao tác quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.';
 if(/invalid.*email|email.*invalid|unable to validate email/i.test(m))return 'Email không hợp lệ';
 if(/invalid login credentials/i.test(m))return 'Sai email hoặc mật khẩu';
 if(/email not confirmed/i.test(m))return 'Email chưa được xác nhận. Hãy mở thư xác nhận trong hộp thư.';
 if(/already registered|already been registered|user already exists/i.test(m))return 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng Quên mật khẩu.';
 if(/password should be at least|weak password/i.test(m))return 'Mật khẩu quá ngắn hoặc quá yếu (tối thiểu 6 ký tự)';
 if(/same.*password|different from the old/i.test(m))return 'Mật khẩu mới phải khác mật khẩu cũ';
 if(/failed to fetch|network/i.test(m))return 'Lỗi kết nối mạng, thử lại sau';
 if(/expired|invalid.*(token|link)|otp/i.test(m))return 'Liên kết đã hết hạn hoặc không hợp lệ. Hãy gửi lại.';
 return 'Có lỗi: '+m;}
function renderAcc(m){
 if(USER)return modal(`<h3>${I('user')} Tài khoản</h3><p>Đăng nhập: <b>${USER.email}</b></p><p class="small">Lần sao lưu gần nhất: ${lastSync||'chưa có'} · Tự động sao lưu sau mỗi ván.</p>
  <button onclick="cloudPush()">${I('cloud')} Sao lưu</button><button class="alt" onclick="if(confirm('Thay tiến độ trên máy bằng bản sao lưu?'))cloudRestore()">Khôi phục</button><button class="alt" onclick="openRecover(true)">Đổi mật khẩu</button><button class="alt" onclick="doLogout()">Đăng xuất</button>`+INSTALL_ROW());
 const up=accMode==='up',em=($('aEmail')&&$('aEmail').value)||'';
 modal(`<h3>${I('user')} ${up?'Đăng ký':'Đăng nhập'}</h3><div class="lbtabs" style="grid-template-columns:1fr 1fr"><button class="${up?'alt':''}" onclick="accMode='in';renderAcc()">Đăng nhập</button><button class="${up?'':'alt'}" onclick="accMode='up';renderAcc()">Đăng ký</button></div>
  <button class="gbtn" onclick="doGoogle()"><svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg><span>${up?'Đăng ký':'Đăng nhập'} bằng Google</span></button><div class="orsep"><span>hoặc dùng email</span></div>
  <p class="small">Đăng nhập để sao lưu xu, huy hiệu, nhiệm vụ lên đám mây, chơi online. Không bắt buộc — chơi khách vẫn đầy đủ.</p>
  <input class="inp" id="aEmail" type="email" placeholder="Email" autocomplete="email" value="${esc(em)}">
  ${PW('aPass',up?'Mật khẩu (≥ 6 ký tự)':'Mật khẩu',up?'new-password':'current-password')}${up?PW('aPass2','Nhập lại mật khẩu','new-password'):''}
  <p class="pwmsg" id="pwMsg"></p><p class="err" id="aErr">${m||''}</p>
  ${up?`<button onclick="doAuth('up')">Tạo tài khoản</button>`:`<button onclick="doAuth('in')">Đăng nhập</button><button class="linkbtn" onclick="doForgot()">Quên mật khẩu?</button><button class="alt" onclick="doAuth('link')">Gửi link đăng nhập qua email</button>`}`+INSTALL_ROW());}
async function doGoogle(){const err=t=>{const e=$('aErr');if(e)e.textContent=t;};err('Đang chuyển tới Google…');
 try{await loadSB();try{const r=await fetch(CFG.url+'/auth/v1/settings',{headers:{apikey:CFG.anonKey}});const j=await r.json();if(j&&j.external&&j.external.google===false)return err('Google chưa được bật cho máy chủ. Hãy dùng email, hoặc nhờ quản trị bật đăng nhập Google.');}catch(e){}
  const r=await SB.auth.signInWithOAuth({provider:'google',options:{redirectTo:gameURL()}});if(r.error)throw r.error;}
 catch(e){const m=(e&&e.message)||'';err(/provider is not enabled|Unsupported provider|validation_failed/i.test(m)?'Google chưa được bật cho máy chủ.':viErr(e));}}
function gameURL(){return location.origin+location.pathname;}
async function doForgot(){const email=$('aEmail').value.trim(),err=t=>{$('aErr').textContent=t;};if(!/^\S+@\S+\.\S+$/.test(email))return err('Nhập email của bạn ở trên rồi bấm Quên mật khẩu');
 err('Đang gửi…');try{const r=await SB.auth.resetPasswordForEmail(email,{redirectTo:gameURL()});if(r.error)throw r.error;err('Đã gửi email đặt lại mật khẩu. Mở thư và bấm vào liên kết để đặt mật khẩu mới.');}catch(e){err(viErr(e));}}
function openRecover(fromAcc){modal(`<h3>${I('user')} Đặt mật khẩu mới</h3><p class="small">${USER?'Tài khoản: <b>'+esc(USER.email)+'</b>':''}</p>${PW('aPass','Mật khẩu mới (≥ 6 ký tự)','new-password')}${PW('aPass2','Nhập lại mật khẩu mới','new-password')}
  <p class="pwmsg" id="pwMsg"></p><p class="err" id="aErr"></p><button onclick="doNewPw()">Lưu mật khẩu mới</button>${fromAcc?'<button class="alt" onclick="renderAcc()">Quay lại</button>':''}`);}
async function doNewPw(){const a=$('aPass').value,b=$('aPass2').value,err=t=>{$('aErr').textContent=t;};if(a.length<6)return err('Mật khẩu tối thiểu 6 ký tự');if(a!==b)return err('Mật khẩu nhập lại không khớp');
 try{const r=await SB.auth.updateUser({password:a});if(r.error)throw r.error;if(location.hash)history.replaceState(null,'',gameURL());toast('Đã đổi mật khẩu');USER=r.data.user||USER;updAcc();renderAcc('Đã cập nhật mật khẩu mới.');}catch(e){err(viErr(e));}}
async function doAuth(k){const email=$('aEmail').value.trim(),password=$('aPass').value;const err=t=>{$('aErr').textContent=t;};
 if(!/^\S+@\S+\.\S+$/.test(email))return err('Email không hợp lệ');
 try{let r;
  if(k==='link'){r=await SB.auth.signInWithOtp({email,options:{emailRedirectTo:gameURL()}});if(r.error)throw r.error;return err('Đã gửi link đăng nhập, hãy kiểm tra email.');}
  if(password.length<6)return err('Mật khẩu tối thiểu 6 ký tự');
  if(k==='up'&&password!==$('aPass2').value)return err('Mật khẩu nhập lại không khớp');
  r=k==='up'?await SB.auth.signUp({email,password,options:{emailRedirectTo:gameURL()}}):await SB.auth.signInWithPassword({email,password});if(r.error)throw r.error;
  if(k==='up'&&!r.data.session)return err('Đã đăng ký! Hãy xác nhận email rồi đăng nhập.');
  USER=r.data.user;localStorage.setItem('tlmn_hadlogin','1');updAcc();await cloudPull(true);renderAcc();}catch(e){err(viErr(e));}}
async function doLogout(){if(SB)await SB.auth.signOut();USER=null;updAcc();renderAcc();}
if(CLOUD_ON&&navigator.onLine!==false&&(localStorage.getItem('tlmn_hadlogin')||location.hash.includes('access_token')||location.hash.includes('type=recovery')||/[?&]code=/.test(location.search)))loadSB().then(()=>SB.auth.getSession()).then(({data})=>{USER=data.session&&data.session.user||null;if(USER){localStorage.setItem('tlmn_hadlogin','1');updAcc();if(RECOVERY_AT_LOAD&&!$('pwMsg'))setTimeout(openRecover,600);}}).catch(()=>{});
