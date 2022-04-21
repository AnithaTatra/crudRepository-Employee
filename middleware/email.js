const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "Gmail",
     port: 465,
     host:"smtp.gmail.com",
     secure:true,
    auth:{
        Username: "pinkyAngelQueen@gmail.com",
        Password: "pinky@123"
    },
   
   
});

async function mailSending(compose){
    //console.log("ok")
    try{
        transporter.sendMail(compose,function(err){
           
            if(err){ 
                console.log("err",err.message)
             }else{
                console.log("Mail sent successfully")
                return true
             }
        })
    }catch(error){
        console.log(error.message)
        process.exit[1];
    }
}
module.exports = {mailSending}