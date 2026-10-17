const K=require('./chop.js');const {detect}=require('./rules.js');let f=0;const t=(n,c)=>{console.log(c?'ok':'FAIL',n);if(!c)f++;};
const c=(r,s)=>r*4+s,B=1000;
const two=[c(12,0)],seq=[c(0,0),c(0,1),c(1,0),c(1,1),c(2,0),c(2,1)],quad=[c(5,0),c(5,1),c(5,2),c(5,3)];
let pend=K.chopStep(null,detect(two),two,0,detect(seq),2,B);t('đôi thông chặt heo đen = 0.5x',pend&&pend.payer===0&&pend.receiver===2&&pend.amount===500&&pend.chain===1);
pend=K.chopStep(pend,detect(seq),seq,2,detect(quad),3,B);t('tứ quý chặt chồng: gom 500+1000',pend&&pend.payer===2&&pend.receiver===3&&pend.amount===1500&&pend.chain===2);
const r=K.chopSettle(pend,{2:900});t('thanh toán bị giới hạn ví',r.amount===900&&r.receiver===3);
t('không chặt chính mình',K.chopStep(null,detect(two),two,1,detect(seq),1,B)===null);
process.exit(f?1:0);
