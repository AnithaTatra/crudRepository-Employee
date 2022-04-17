const router = require('express').Router();
const employeeSchema = require('../model/employee.model');
//const usersSchema = require('../model/users.model');
const organizationSchema = require('../model/organization.model');
//var validationStatus="false";
const Joi = require('joi');
const {authSchema} = require('../model/Validations.js');

//create operation on employee data

router.post('/addNewEmpData',async(req,res)=>{
    try{ 
        //By Anitha T
        const resultBody=await authSchema.validateAsync(req.body)       
        console.log("resutl.......",resultBody);
        let empData = req.body
        console.log(empData);
        const empInfo = new employeeSchema(empData);
        const result = await empInfo.save();
        return res.status(200).json({'status':"success",'message':"Employee Data successfully created","result":result})
    
    }catch(error){
        console.log(error.message)
        return res.status(400).json({'status':"Failure",'message':error.message})
    }
});


//get all employee Details
router.get('/getAllEmployeeDetails',async(req,res)=>{
    try{
        const employeeDetails = await employeeSchema.find().exec();
        if(employeeDetails.length>0){
            return res.status(200).json({'status':"success",'message':"Employee Details Fetched successfully",'result':employeeDetails});
        }else{
            return res.status(400).json({'status':"Failure",'message':"Employee Details not Available"});
        }
    }catch(error){
        console.log(error.message);
        return res.status(400).json({'status':"Failed",'message':error.message})
    }
});


//get individual employee Details
router.get('/getindivEmpDetail' ,async(req,res)=>{
    try{
        const employeeDetails = await employeeSchema.findOne({"uuid":req.query.employee_uuid}).exec();
        
        if(employeeDetails){
            return res.status(200).json({'status':"success",'message':"Single Employee Details Fetched successfully",'result':employeeDetails});
        }else{
            return res.status(400).json({'status':"Failure",'message':"No Employee Detail fetched"});
        }
    }catch(error){
        console.log(error.message);
        return res.status(400).json({'status':"Failed",'message':error.message})
    }
});

//update operation on employee Data 
router.put('/updateEmployeeData',async(req,res)=>{
    try{
        //let testCondition = {uuid:"EMP-32A46D2D1E"}
        //let updateDetails = {$set:{employeeState:"M.p"}};
        let testCondition = {uuid: req.body.uuid}
        let updateDetails = req.body.updateDetails;
        let choice = {new:true};
        const updateData = await employeeSchema.findOneAndUpdate(testCondition,updateDetails,choice).exec();
        return res.status(200).json({'status':"success",'message':"Employee Data updated successfully",'updateData':updateData});
    }catch(error){
        console.log(error.message)
        return res.status(400).json({'status':"Failure",'message':error.message});
    }   
});


// delete operation on employee Data
router.delete('/deleteEmployeeData/:emp_uuid',async(req,res)=>{
    try{
        console.log(req.params.emp_uuid)
        await employeeSchema.findOneAndDelete({uuid:req.params.emp_uuid}).exec();
        return res.status(200).json({'status':'success','message':"Employee Data Deleted successfully"});
    }catch(error){
        console.log(error.message)
        return res.status(400).json({'status':"failure",'message':error.message})
    }
});
 



router.get('/userBasedEmployee',async(req,res)=>{

    console.log("userBasedEmployee.....");
    try{
            let employeeDetails=await organizationSchema.aggregate([

                {
                    $match:{
                        $and:[
                            {"uuid":req.query.uuid},
                            {"userUuid":req.query.userUuid},
                            {"ageRestriction":{$nin:[req.query.ageRestriction]}}
                        ]
                    }
                },
                {
                    '$lookup':{
                        from:'employees',
                        localField:'uuid',
                        foreignField:'organizationuuid',
                        as:'employee_details'

                    }
                },
                {
                    '$lookup':{
                        from:'user',
                        localField:'userUuid',
                        foreignField:'uuid',
                        as:'user_Data'
                    }
                },
              {
                  '$unwind':{
                      path:'$employee_details',
                      preserveNullAndEmptyArrays:true
                  }
              },
              {
                  '$unwind':{
                      path:'$user_Data',
                      preserveNullAndEmptyArrays:true
                  }
              },
              {
                $project: {
                    "_id": 0,
                    "organizationName": 1,
                    "employee_details.employeeName": 1,
                    "user_Data.username":1

                }
            }  
              
            ])
               console.log("employeeDetails..."+employeeDetails)
             if(employeeDetails.length>0){
                 return res.status(200).json({'status':'success',message:"Employee details Fetched Successfully",'result':employeeDetails})
             }else{
                return res.status(400).json({'status':'failure',message: "No matched details"})

             }

    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', message: error.message})
    }
});


router.post('/addOrganization', async(req,res)=>{
    try{
        const data = new organizationSchema(req.body);
        const result = await data.save()
        return res.status(200).json({status: "success", message: 'organization added successfully', result: result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
});

module.exports = router;



// function Validations(req,res){
//     if(req.body.employeeName.search(/^[A-Za-z]+$/)){
//         validationStatus="false";
//         return res.status(400).json({'status':"Failed",'message':"Please enter the  valid EmployeeName "})

//     } 
//     else if(req.body.employeeName=="null" || req.body.employeeName==null){
//         validationStatus="false";
//         return res.status(400).json({'status':"Failed",'message':"Please enter the EmployeeName "})
//     }else if(req.body.employeeId=="null" || req.body.employeeId==0){
//         validationStatus="false";
//         return res.status(400).json({'status':"Failed",'message':"Please enter the EmployeeId"})
//     }else if(req.body.employeeAddress=="null" || req.body.employeeAddress==""){
//         validationStatus="false";
//         return res.status(400).json({'status':"Failed",'message':"Please enter the EmployeeAddress"})
//     }else if(req.body.employeePanNumber=="null"|| req.body.employeePanNumber==""){
//         validationStatus="false";
//         return res.status(400).json({'status':"Failed",'message':"Please enter the EmployeePannumber"})
//     }else if(req.body.employeeAadharNumber.search(/^[0-9]*(?:\.\d{1,2})?$/)){
//         validationStatus="false";
//         return res.status(400).json({'status': "Failed",'message':"Please enter the valid AadharNumber"})
//     }else if(req.body.employeeAadharNumber=="null"|| req.body.employeeAadharNumber=="" ){
//         validationStatus="false";
//         return res.status(400).json({'status':"Failed",'message':"Please enter the EmployeeAadharnumber"})
//     }else if(req.body.employeeState=="null" || req.body.employeeState==""){
//         validationStatus="false";
//         return res.status(400).json({'status':"Failed",'message':"Please enter the EmployeeState"})
//     }else{
//         validationStatus="true";
//     }
// }














