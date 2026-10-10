// CLOUD_START
// Gộp 2 bản lưu {profile, scores, updatedAt}: giữ tiến độ cao hơn, gộp huy hiệu, chỉ số lấy max.
function saveProgress(s){if(!s||!s.profile)return -1;const p=s.profile;return (p.xp||0)*1e6+(p.stats&&p.stats.games||0)*1000+Object.keys(p.badges||{}).length;}
function mergeSaves(a,b){
 if(!a||!a.profile)return b?JSON.parse(JSON.stringify(b)):null;if(!b||!b.profile)return JSON.parse(JSON.stringify(a));
 const pa=saveProgress(a),pb=saveProgress(b);
 const [base,other]=(pa>pb||(pa===pb&&(a.updatedAt||0)>=(b.updatedAt||0)))?[a,b]:[b,a];
 const out=JSON.parse(JSON.stringify(base)),P=out.profile,O=other.profile;
 P.badges=Object.assign({},O.badges||{},P.badges||{});
 P.stats=P.stats||{};for(const k in (O.stats||{}))if(k!=='streak')P.stats[k]=Math.max(P.stats[k]||0,O.stats[k]||0);
 if(O.login&&O.login.last&&(!P.login||!P.login.last||O.login.last>P.login.last))P.login=Object.assign({},O.login);
 if(O.rescueDay&&(!P.rescueDay||O.rescueDay>P.rescueDay))P.rescueDay=O.rescueDay;
 if(O.quests&&O.quests.day&&(!P.quests||!P.quests.day||O.quests.day>P.quests.day))P.quests=JSON.parse(JSON.stringify(O.quests));
 else if(O.quests&&P.quests&&O.quests.day===P.quests.day)P.quests.list.forEach((q,i)=>{const o=O.quests.list.find(x=>x.id===q.id);if(o){q.prog=Math.max(q.prog,o.prog);q.claimed=q.claimed||o.claimed;}});
 out.updatedAt=Math.max(a.updatedAt||0,b.updatedAt||0);return out;}
// CLOUD_END
if(typeof module!=='undefined')module.exports={mergeSaves,saveProgress};
