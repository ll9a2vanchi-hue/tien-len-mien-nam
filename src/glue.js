
let PR=JSON.parse(localStorage.getItem('tlmn_profile')||'null')||newProfile();
function saveP(){if(typeof renderHome==='function'&&document.body&&document.body.classList&&document.body.classList.contains('athome'))setTimeout(renderHome,0);localStorage.setItem('tlmn_profile',JSON.stringify(PR));localStorage.setItem('tlmn_updated',String(Date.now()));updHud();}
function fmt(n){return n.toLocaleString('vi-VN');}
function toast(h){const d=document.createElement('div');d.className='toast';d.innerHTML=h;document.getElementById('toast').appendChild(d);setTimeout(()=>d.remove(),3200);}
function badgeToasts(l){l.forEach(b=>toast(`${b.icon} <b>Huy hiệu mới: ${b.name}</b><br>+${fmt(b.xu)} xu`));}
function updHud(){ensureDaily(PR,new Date());animCoin(PR.xu);
 const sel=document.getElementById('bet');sel.innerHTML=BETS.map(b=>`<option value="${b}" ${b==PR.bet?'selected':''}>${fmt(b)}</option>`).join('');
 document.getElementById('d1').innerHTML=loginState(PR,new Date()).canClaim?'<span class="dot"></span>':'';
 document.getElementById('d2').innerHTML=PR.quests.list.some(q=>!q.claimed&&q.prog>=questDef(q.id).goal)?'<span class="dot"></span>':'';}
function setBet(v){if(G&&!G.over&&G.started)return msg('Đổi mức cược khi ván kết thúc');PR.bet=+v;saveP();}
function closeModal(){document.getElementById('modal').style.display='none';document.body.classList.remove('mopen');}
function modal(h){document.getElementById('modalIn').innerHTML=h+'<div style="text-align:right"><button class="alt" onclick="closeModal()">Đóng</button></div>';document.getElementById('modal').style.display='flex';document.body.classList.add('mopen');}
function openDaily(){const now=new Date(),ls=loginState(PR,now),cur=ls.canClaim?ls.day-1:ls.day;
 let h='<h3>'+I('gift')+' Quà điểm danh</h3><div class="days">'+LOGIN_REWARDS.map((r,i)=>`<div class="day ${i<cur?'done':''} ${ls.canClaim&&i===ls.day-1?'today':''}">Ngày ${i+1}<br>${I("coin")}${r}</div>`).join('')+'</div>';
 h+=ls.canClaim?`<p><button onclick="doClaimLogin()">Nhận ${fmt(ls.reward)} xu</button></p>`:'<p>'+I('check')+' Hôm nay đã nhận. Quay lại ngày mai nhé!</p>';
 if(canRescue(PR,now))h+=`<div class="row">Hết xu? <button onclick="doRescue()">Nhận cứu trợ ${RESCUE_XU} xu</button></div>`;else if(PR.xu<BETS[0])h+='<p>Đã nhận cứu trợ hôm nay.</p>';
 modal(h);}
function doClaimLogin(){const r=claimLogin(PR,new Date());if(r)toast(`Điểm danh +${fmt(r)} xu`);badgeToasts(checkBadges(PR));saveP();openDaily();}
function doRescue(){const r=rescue(PR,new Date());if(r)toast(`Cứu trợ +${r} xu`);saveP();openDaily();}
function openQuests(){ensureDaily(PR,new Date());const m=new Date();m.setHours(24,0,0,0);const hh=Math.ceil((m-new Date())/36e5);
 modal('<h3>'+I('quest')+' Nhiệm vụ hôm nay</h3><p style="font-size:13px">Làm mới sau ~'+hh+' giờ (0h)</p>'+PR.quests.list.map((q,i)=>{const d=questDef(q.id),done=q.prog>=d.goal;
  return `<div class="row"><div style="flex:1">${d.name} <small>(${q.prog}/${d.goal})</small><div class="bar"><i style="width:${100*q.prog/d.goal}%"></i></div></div>${q.claimed?I('check'):`<button ${done?'':'disabled'} onclick="doClaimQuest(${i})">+${d.xu}</button>`}</div>`;}).join(''));}
function doClaimQuest(i){const r=claimQuest(PR,i);if(r)toast(`Hoàn thành nhiệm vụ +${r} xu`);const lq=PR._lastLv;delete PR._lastLv;if(lq)levelUpFX(lq);badgeToasts(checkBadges(PR));saveP();openQuests();}
function openBadges(){const n=Object.keys(PR.badges).length;
 modal(`<h3>${I('medal')} Huy hiệu (${n}/${BADGES.length})</h3><div class="grid">`+BADGES.map(b=>`<div class="badge ${PR.badges[b.id]?'':'lock'}"><div class="ic">${PR.badges[b.id]?b.icon:I('lock')}</div><b>${b.name}</b><br>${b.desc}<br>${I("coin")}${fmt(b.xu)}</div>`).join('')+'</div>'+
 `<p style="font-size:13px">Ván: ${PR.stats.games} · Thắng: ${PR.stats.wins} · Chuỗi tốt nhất: ${PR.stats.bestStreak} · Chặt heo: ${PR.stats.chops}</p>`);}
function hookPlay(info,prev){const r=onPlay(PR,info,prev);if(r.bonus)toast(`Chặt heo! +${fmt(r.bonus)} xu`);badgeToasts(r.badges);if(r.lv)levelUpFX(r.lv);saveP();}
function hookEnd(place,instant,n){const r=onGameEnd(PR,place,instant,n||4);toast(`${['Nhất','Nhì','Ba','Bét'][place]}: ${r.delta>=0?'+':''}${fmt(r.delta)} xu`);badgeToasts(r.badges);levelUpFX(r.lv);saveP();
 if(PR.xu<BETS[0])setTimeout(()=>openDaily(),1200);}
