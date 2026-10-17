const H=require('./tools-h.js');(async()=>{const b=await H.launch();
for(const w of [360,412,461]){const p=await H.open(b,w,740,()=>{PR.xp=2e6;PR.xu=4e6;saveP();renderHome();});await p.waitForTimeout(400);
 const set=async(o)=>p.evaluate(o=>{ensureInv(PR);Object.values(o).forEach(id=>{PR.inv[id]=1;equipItem(PR,id)});applyCosmetics();},o);
 const sets={a:{back:'back_inferno',felt:'felt_galaxy',deck:'deck_neon2',bubble:'bub_galaxy',name:'nc_lava',fx:'fx_firework'},b:{back:'back_diamond',felt:'felt_petal',deck:'deck_goldleaf',bubble:'bub_diamond',name:'nc_diamond',fx:'fx_phoenix'}};
 await set(sets.a);await p.evaluate(()=>{MODE='mn';startTable(4)});await p.waitForTimeout(2600);
 await p.evaluate(()=>{showEmote(0,'Chào!');});await p.waitForTimeout(500);await p.screenshot({path:`shots/v79-game-a-${w}.png`});
 await p.evaluate(()=>{winFX('🎉 BẠN VỀ NHẤT!',true)});await p.waitForTimeout(900);await p.screenshot({path:`shots/v79-fx-firework-${w}.png`});await p.waitForTimeout(3500);
 for(const [id,nm] of [['fx_meteor','meteor'],['fx_goldstorm','storm'],['fx_phoenix','phoenix']]){await p.evaluate(id=>{PR.inv[id]=1;equipItem(PR,id);winFX('🎉 BẠN VỀ NHẤT!',true)},id);await p.waitForTimeout(1300);await p.screenshot({path:`shots/v79-fx-${nm}-${w}.png`});await p.waitForTimeout(3600);}
 await p.evaluate(()=>{PR.inv.em_cosmic=1;PR.inv.em_ultra=1;showEmote(0,'🛸');});await p.waitForTimeout(400);await p.screenshot({path:`shots/v79-emote-cosmic-${w}.png`});
 await p.evaluate(()=>{showEmote(0,'🎆');});await p.waitForTimeout(400);await p.screenshot({path:`shots/v79-emote-ultra-${w}.png`});
 console.log(w,p.errs);await p.close();}await b.close();})();
