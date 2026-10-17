const fs=require('fs');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const src=fs.readFileSync('./src/games2-ui.js','utf8'),v9=fs.readFileSync('./src/v9.js','utf8');
const grab=n=>{const m=src.match(new RegExp('function '+n+'\\([^\\n]*\\n?'));return m[0];};
const kxu=x=>x;const code=['btNew','btToCall','btPay','btAct','btNewRound','btSeatLab'].map(n=>{const i=src.indexOf('function '+n+'(');let d=0,j=src.indexOf('{',i);const s=j;for(;j<src.length;j++){if(src[j]==='{')d++;if(src[j]==='}'){d--;if(!d)break;}}return src.slice(i,j+1);}).join('\n');
const E=new Function('kxu',code+';return {btNew,btAct,btNewRound,btSeatLab,btToCall};')(kxu);
const b=E.btNew(4,[1000,1000,1000,1000]);E.btNewRound(b);
// mô phỏng nhãn như xtDo
t('btNewRound tạo cl',typeof b.cl==='object'&&Object.keys(b.cl).length===0);
b.cl={1:'Theo',2:'Xem'};b.rz={0:'Tố ×3'};b.rzLast=0;b.fold[3]=true;
t('người tố hiện Tố ×N',/Tố ×3/.test(E.btSeatLab(b,0)));
t('người theo hiện Theo',/pkst c[^>]*>Theo/.test(E.btSeatLab(b,1)));
t('người xem hiện Xem',/pkst k[^>]*>Xem/.test(E.btSeatLab(b,2)));
t('người bỏ hiện Bỏ',/>Bỏ</.test(E.btSeatLab(b,3)));
b.allin[1]=true;t('tất tay không hiện Theo',!/Theo/.test(E.btSeatLab(b,1))&&/Tất tay/.test(E.btSeatLab(b,1)));
t('xtDo/pkDo ghi nhãn theo & reset khi có người tố',(src.match(/b\.rz=\{\};b\.cl=\{\};b\.rz\[i\]/g)||[]).length===2&&(src.match(/b\.cl\[i\]=/g)||[]).length>=2);
t('bảng xếp hạng chạm mở hồ sơ',/onclick="lbTap\('/.test(v9)&&/function lbTap/.test(src)&&/openPlayerProfile\(uid,'openLeaderboard\(\)'\)/.test(src));
t('danh sách online chạm mở hồ sơ đầy đủ',/openPlayerProfile\(uid,'openOnline\(\)',plActsHTML\(uid\)\)/.test(src));
t('hồ sơ có nút hành động (kết bạn/mời/vào bàn)',/placts/.test(src)&&/\$\{P\.act\|\|''\}/.test(src));
process.exit(f?1:0);
