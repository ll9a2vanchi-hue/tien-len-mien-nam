const vm=require('vm'),fs=require('fs');const c={SHOP:[],console};vm.createContext(c);
vm.runInContext(fs.readFileSync('src/avsvg.js','utf8'),c);const sv=c.SHOP.filter(x=>x.svg);let f=0;const ok=(b,m)=>{if(!b){f++;console.log('FAIL',m);}};
const want={2:1500,3:3000,4:6000,5:12000};ok(sv.length>=30,'>=30 svg avatars');
const by={};sv.forEach(x=>{const t=Object.keys(want).find(k=>want[k]===x.price);ok(t,'price tier '+x.id+' '+x.price);by[x.price]=(by[x.price]||0)+1;if(x.price===12000)ok(x.lv===50,'lv50 '+x.id);if(x.price===6000)ok(x.lv===15,'lv15 '+x.id);});
console.log(JSON.stringify(by),f?'FAIL':'OK');process.exit(f?1:0);
