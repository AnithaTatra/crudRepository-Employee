const{use} = require('bcrypt/promises');
const jwt =require('jsonwebtoken');
const abcd =require('../model/users.model');

function authVerification(req,res,next){
    console.log("Functioncall");
     try{
        let authToken = req.header("authToken");
        console.log("Authentication token..",authToken);
        if(!authToken){
            return res.status(401).json({status:'Failure',message:'Unauthorized Access'})
        }
        const decToken = jwt.verify(authToken,process.env.secretKey) 
        console.log(decToken);
        next();
     }catch(error){
         console.log(error.message);
         return res.status(500).json({status:'Failure',message:error.message})
     }finally{
         console.log("Authentication checking code");
     }
}

module.exports = { 
    authVerification:authVerification 
}
    
