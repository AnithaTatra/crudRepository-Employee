const nodemailer = require('nodemailer')
const ejs = require('ejs')
const{join}= require('path');

const transporter = nodemailer.createTransport({
    service: "gmail",
  // port: 465,
   //host:"smtp.gmail.com",
    auth:{
        user: "pinkyangelqueen123@gmail.com",
        pass: "pinky@123"
    },
    //secure:false,
   
});

async function mailSending(compose){
    console.log("ok")
    try{
        
        const data= await ejs.renderFile(join(__dirname,'../templates/',compose.fileName))
        console.log(__dirname)
        const mailData= {
            from:compose.from,
            to:compose.to,
            subject:compose.subject,
            attachments: compose.attachments,
            html:data
        }
        transporter.sendMail(mailData,(err,data)=>{
           
            if(err){ 
                console.log("err",err.message)
             }else{
                console.log("Mail sent successfully")
                return 1
             }
        })
    }catch(error){
        console.log(error.message)
        process.exit(1);
    }
}
module.exports = {mailSending}