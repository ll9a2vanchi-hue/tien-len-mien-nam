const H=require('./tools-h.js');(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,780,()=>{PR.xu=4e6;saveP();USER={id:'me',email:'me@x.com'};loadSB=async()=>{};
 SB={from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{user_id:'u2',name:'Bé Mận',avatar:{av:'🦊',bg:'#7b3fa0',pf:{p:'pet_meo',a:{quan:2,xedap:3},s:{tlmn:12},b:['streak3','earn5k'],eb:34,ib:20}},level:41,title:'Đỏ Vương',xp:99999,frame:'fr_ruby'}})})})})};
 lobbyPres=()=>[{uid:'u2',name:'Bé Mận',lv:41,title:'Đỏ Vương',xu:5000,room:'ABCD',seats:2,size:4}]});
 await p.evaluate(()=>lbTap('u2'));await p.waitForTimeout(700);await p.screenshot({path:`shots/v82-lb-profile-${w}.png`});
 const ov1=await p.evaluate(()=>{const m=document.getElementById('modalIn');return m.scrollWidth-m.clientWidth});
 await p.evaluate(()=>{closeModal();plTap('u2')});await p.waitForTimeout(700);await p.screenshot({path:`shots/v82-online-profile-${w}.png`});
 const info=await p.evaluate(()=>({h:document.querySelector('#modalIn h3')?.textContent,tabs:document.querySelectorAll('#modalIn .ptabs button').length,act:document.querySelectorAll('#modalIn .placts button').length,ov:document.getElementById('modalIn').scrollWidth-document.getElementById('modalIn').clientWidth}));
 console.log(w,ov1,JSON.stringify(info),p.errs);await p.close();}await b.close();})();
