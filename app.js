const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const employeeRouter = require('./route/employee.route');
const usersRouter = require('./route/users.route');


const val = express();
val.use(cors());
const port = process.env.PORT||6000;

val.get("/apiCheck", async(req,res)=>{
    console.log("Welcome JavaScript");
    res.send({status:'success'})
})

    mongoose.connect(process.env.dbUrl,{
        useNewUrlParser :true,
        useUnifiedTopology : true
        
    }).then(data =>{
        console.log("Database connected");
    }).catch(err=>{
        console.log(err.message);
        process.exit(1);
    })
     
val.use(express.json());
val.set('view engine','ejs');  
val.use('/api/v1/employee/',employeeRouter);
val.use('/api/v2/users/',usersRouter); 


val.listen(port,()=>{
    console.log("Server started at 6000 port number");
});

