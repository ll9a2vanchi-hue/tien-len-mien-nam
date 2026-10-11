const P=require('./progress.js'),fs=require('fs');let f=0;const ok=(c,m)=>{if(!c){console.log('FAIL '+m);f++;}};
const modes=Object.keys(P.MODE_BADGE_INFO);const cnt=m=>P.BADGES.filter(b=>P.badgeMode(b)===m).length;const T=cnt('mn');
console.log('Miền Nam:',T);for(const m of modes){console.log(m,cnt(m));ok(cnt(m)===T,m+' count '+cnt(m)+' != '+T);}
ok(new Set(P.BADGES.map(b=>b.id)).size===P.BADGES.length,'unique ids');
// mô phỏng: mọi huy hiệu theo chế độ đều mở được qua modeRecord
for(const m of modes){const p=P.newProfile();p.xu=0;let d=new Date(2026,0,1,2,0);
 for(let day=0;day<520;day++){const now=new Date(d.getTime()+day*864e5);
  for(let i=0;i<3;i++)P.modeRecord(p,m,{win:false,net:-100,bet:100,n:6,full:true},now);
  for(let i=0;i<11;i++)P.modeRecord(p,m,{win:true,net:600000,bet:5000,n:i%2?2:6,full:i%2==0,role:true,dealer:m!=='domino',bust:3,sp1:1,sp2:1,sp3:1,s4:1,s5:1},now);}
 P.checkBadges(p);const miss=P.BADGES.filter(b=>b.mode===m&&!p.badges[b.id]);ok(!miss.length,m+' chưa mở: '+miss.map(b=>b.id).join(','));
 // không mở ngay khi mới chơi 1 ván thua
 const q=P.newProfile();P.modeRecord(q,m,{win:false,net:-1,bet:100,n:3},new Date(2026,0,1,12));const early=P.checkBadges(q).filter(b=>b.mode===m).map(b=>b.id);ok(early.length===1&&early[0]===m+'_games_1','chỉ mở huy hiệu chơi ván đầu: '+early);}
// huy hiệu cũ: mỗi chỉ số được dùng phải được ghi nhận ở đâu đó trong mã
const src=fs.readdirSync('src').filter(x=>x.endsWith('.js')).map(x=>fs.readFileSync('src/'+x,'utf8')).join('\n')+['extras.js','chop.js','casino.js','games2.js','cloud.js'].map(x=>fs.existsSync(x)?fs.readFileSync(x,'utf8'):'').join('\n')+fs.readFileSync('progress.js','utf8').replace(/const BADGES=\[[\s\S]*?\n\];/,'');
const keys=new Set();P.BADGES.filter(b=>!b.mode).forEach(b=>{const t=b.test.toString();for(const r of t.matchAll(/V\(s,'(\w+)'/g))keys.add(r[1]);for(const r of t.matchAll(/\bs\.(\w+)/g))keys.add(r[1]);if(b.k)keys.add(b.k);});
for(const k of keys){const re=new RegExp("(bst\\(\\s*'"+k+"'|bst\\(k\\+'"+k.replace(/^(bcua|dom|xt|pk)/,'')+"'|"+(/^play\d$/.test(k)?"'play'\\+n|":"")+"['\"]"+k+"['\"]|\\.\\b"+k+"\\b\\s*(\\+\\+|\\+=|=))");ok(re.test(src),'chỉ số không được ghi nhận: '+k);}
console.log(f?'FAILED '+f:'ALL OK ('+P.BADGES.length+' huy hiệu)');process.exit(f?1:0);
