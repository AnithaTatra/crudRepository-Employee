const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const {authVerification} = require('../middleware/auth');
const mailSending = require('../middleware/email');
//Importing userSchema
const userSchema = require('../model/users.model');
//const fs=require('fs');
//const { attachment } = require("express/lib/response");
//api for insert user data
router.post('/userSignUp',async(req,res)=>{
   
    try {

        const username = req.body.username;
        const email = req.body.email;
        const mobileNumber = req.body.mobileNumber;
        
        if(username){
        
            if(username.search(/\d/)==-1){
                return res.json({status:"Failure",message:'username must contain atleast one number'})
        }else if(username.search(/^[A-Za-z0-9]+$/)){
                return res.json({status:"Failure",message:'username must not contain any special character'})
        }else if(username.search(/[a-zA-Z]/)==-1){
                return res.json({status:"Failure",message:'username must contain atleast one alphabet character'})
            }
            let usernameDetail = await userSchema.findOne({'username': username}).exec()
            if(usernameDetail){
                return res.json({status: "failure", message: 'username already exist'})
            }
        }else{
            return res.status(400).json({status: "failure", message: 'Must attach the username'})
        }

        if(mobileNumber){
            let usermobileNumberDetail = await userSchema.findOne({'mobileNumber': mobileNumber}).exec()
            if(usermobileNumberDetail){
                return res.json({status: "failure", message: 'mobileNumber already exist'})
            }
        }else{
            return res.status(400).json({status: "failure", message: 'Must attach the mobileNumber'})
        }

        if(email){
            let useremailDetail = await userSchema.findOne({'email': email}).exec()
            if(useremailDetail){
                return res.json({status: "failure", message: 'email already exist'})
            }
        }else{
            return res.status(400).json({status: "failure", message: 'Must attach the email'})
        }

        let userData = new userSchema(req.body);
        console.log("User Password Before hashing")
        console.log(userData.password);
        if(req.body.password){
            let password = req.body.password;
            let salt = await bcrypt.genSalt(10);
            console.log("____".repeat(4))
            userData.password = bcrypt.hashSync(password, salt);
            console.log("User Password After hashing")
            console.log(userData.password);
        }
        let result = await userData.save();

        return res.status(200).json({status: "success", message: "user details added successfully", data: result})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
});

//api for login
router.post('/userLogin',authVerification,async(req,res)=>{
    try{
        let username = req.body.username;
        let password = req.body.password;
        let userData ;
        let userDetails = await userSchema.findOne({username:username}).select('-id').exec();
        if(username){
            userData = await userSchema.findOne({username:username}).exec()
            if(!userData){
                return res.status(400).json({status:'Failure',message:'Please Signup'})
             }
          }else{
                return res.status(400).json({status:'Failure',message:'Please enter username'})
            }
           if(userData){
               let isMatch = await bcrypt.compare(password,userData.password);
               console.log(isMatch);
               if(userData.firstLoginStatus !== true){
                  await userSchema.findOneAndUpdate({uuid:userData.uuid},{firstLoginStatus:true},{new:true}).exec();
               }
               let payload = {uuid:userData.uuid}

               if(isMatch){
                  var userInfo = userDetails.toObject()
                  let jwttoken = jwt.sign(payload, process.env.secretKey)
                  userInfo.jwttoken = jwttoken;
                  // this.mailSending("Mail Success")

                  return res.status(200).json({status:'success',message:'Login Successfully',data:userInfo})
               }else{
                   return res.status(400).json({status:'Failure',message:'Login Failed'})
               }
        }
    }catch(error){
        console.log(error.message)
        return res.status(500).json({status:'Failure',message:error.message})
    }
});

//logout api
router.post('/userLogout/:uuid',async(req,res)=>{
    try{
        let date = moment().toDate();
        console.log(date);
        await userSchema.findOneAndUpdate({uuid:req.params.uuid},{lastedVisited:date,loginStatus:false},{new:true}).exec();
          return res.status(200).json({status:'success',message:'Logout successfully'})
    }catch(error){
        console.log(error.message);
         return res.status(500).json({status:'Failure',message:error.message})
    }
});

//api for resetPassword
router.post('/resetPassword', async(req,res)=>{
    try{
       let username = req.body.username;
       let usersUpdate = {username:req.body.username}
       let choice = {new:true};
       let updatePassword = req.body.updatePassword;
       let newPassword = updatePassword.password;
       let usersData;
     
         if(username){
            usersData = await userSchema.findOne({username:username}).exec();
            if(usersData!=null){
               console.log("Data exists...");
            }else{
                return res.status(400).json({status:'Failure',message:'Please enter the correct username'})
            }
            if(usersData.username==username){
            
                if(username!=null && newPassword!=null){

                    if(updatePassword.password){
                      let password = updatePassword.password;
                      let salt = await bcrypt.genSalt(10);
                       console.log("____".repeat(4))
                       updatePassword.password = bcrypt.hashSync(password, salt);
                  }
                    const updateData = await userSchema.findOneAndUpdate(usersUpdate,updatePassword,choice).exec();
                    return res.status(200).json({status:'success',message:'Reset password updated successfully',result:updateData})
                }else{
                    return res.status(400).json({status:'Failure',messsage:'Please enter the new Password to reset it'})
                } 
             }   
         }
         else{
             console.log("checking...");
             return res.status(400).json({status:'Failure',message:'Please enter the correct username'})
         }
    }catch(error){
        console.log(error.message);
        return res.status(500).json({status:'Failure',message:error.message})
    }
});

//api for mailSending
router.post('/sendMail',async(req,res)=>{
    try{
        const toMail = req.body.toMail;
        const subject = req.body.subject;
        const text = req.body.text;
        const compose={
            from:"pinkyangelqueen123@gmail.com",
            to:toMail,
            subject:subject,
            fileName:'confirmationemail.ejs',
            attachments:{
                filename:'abcd',
                filePath:'../mailpdf/abcd.pdf'
            }
     
        }

        // fs.readFile('index.html',{encoding:'utf-8'},function(err,html){

        //     if(err){
        //         console.log(err);
        //     }else{
                
        //         composes={
        //             from :"pinkyangelqueen123@gmail.com",
        //             to : toMail,
        //             subject : subject,
        //             html: <h1>This is Heading</h1>
                    
        //         };
                
        //     }
        // });

        let mailData = await mailSending.mailSending(compose)
       // console.log("Mail:...",mailData)
       //if(mailData===1){
        return res.status(200).json({status:'success',message:"mail sent successfully"})
       //}//
    //    }else{
    //        return res.status(400).json({status:'Failure',message:'mail not sent'})
    //    }
    }catch(error){
        console.log(error.message);
        return res.status(500).json({status:'success',message:error.message})
    }
})

module.exports = router;