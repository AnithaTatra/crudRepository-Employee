const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const employeeRouter = require('./route/employee.route');


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
val.use('/api/v1/employee/',employeeRouter);
    

val.listen(port,()=>{
    console.log("Server started at 6000 port number");
});

