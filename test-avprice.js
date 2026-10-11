const vm=require('vm'),fs=require('fs');const c={SHOP:[],console};vm.createContext(c);
vm.runInContext(fs.readFileSync('src/avsvg.js','utf8'),c);const sv=c.SHOP.filter(x=>x.svg);let f=0;const ok=(b,m)=>{if(!b){f++;console.log('FAIL',m);}};
ok(sv.length>=36,'>=36 svg avatars');const R={2:[],3:[],4:[],5:[]};sv.forEach(x=>R[x.r].push(x));
R[2].forEach(x=>ok(x.price>=20000&&x.price<=50000,'hiem '+x.id+x.price));R[3].forEach(x=>ok(x.price===100000,'suthi '+x.id));R[4].forEach(x=>ok(x.price===500000&&x.lv>=20,'ht '+x.id));
ok(R[5].length===6,'6 ultra');R[5].forEach(x=>{ok(x.price===500000&&x.lv===45,'ultra '+x.id);const h=c.svaHTML(x.id);ok(h.includes('urays')&&h.includes('usp')&&h.includes('ufrm'),'ultra fx '+x.id);});
console.log(JSON.stringify(Object.fromEntries(Object.entries(R).map(([k,v])=>[k,v.map(x=>x.price)]))),f?'FAIL':'OK');process.exit(f?1:0);
