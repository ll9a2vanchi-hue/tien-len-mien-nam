const P=require('./progress.js'),C=require('./cloud.js');let ok=0,bad=0;const t=(n,c)=>{c?ok++:(bad++,console.log('FAIL',n));};
t('vi ok',P.validName('  Nguyễn  Văn Tú ').name==='Nguyễn Văn Tú');t('too short',!P.validName('A').ok);t('too long',!P.validName('a'.repeat(17)).ok);
t('16 vi ok',P.validName('Đặng Thị Hồng Hạ').ok);t('symbols',!P.validName('<b>x</b>').ok);t('profanity vi',!P.validName('Đéo sợ').ok);t('profanity en',!P.validName('FuckYou').ok);
t('clean ok "Lan Anh"',P.validName('Lan Anh').ok);t('"Long" ok',P.validName('Long Vương').ok);t('"Cáchu" ok?',P.validName('Hải Đăng').ok);
const a={profile:{xp:10,xu:1,badges:{},stats:{},name:'Cũ',nameAt:1},updatedAt:1},b={profile:{xp:5,xu:1,badges:{},stats:{},name:'Mới',nameAt:2},updatedAt:2};
t('merge newer name',C.mergeSaves(a,b).profile.name==='Mới');console.log('pass',ok,'fail',bad);
