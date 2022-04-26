//const nodemailer = require('nodemailer')
const ejs = require('ejs')
const{join}= require('path');
const sgMail=require("@sendgrid/mail");
sgMail.setApiKey("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");
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//   // port: 465,
//    //host:"smtp.gmail.com",
//     auth:{
//         user: "pinkyangelqueen123@gmail.com",
//         pass: "pinky@123"
//     },
//     //secure:false,
   
// });

async function mailSending(compose){
    console.log("ok")
    try{
        
        const data= await ejs.renderFile(join(__dirname,'../templates/',compose.fileName),compose,compose.details)
        console.log(__dirname)
        const mailData= {
            // to:"anitha.platosys@gmail.com",
            // from:"anitha.platosys@gmail.com",
            // subject:"Sekhar",
            // text:"Sekhar M",
            // html:"Ramu Garu"
            to:compose.to,
            from:compose.from,
            subject:compose.subject,
             html:data
        }
        //sgMail.send(mailData)

        sgMail.send(mailData,(err,data)=>{
           
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