const mongoose = require('mongoose');
const crypto = require('crypto');



const employeeSchema = new mongoose.Schema({
    uuid :{type:String,required:false},
    employeeName : {type:String,required:true},
    employeeId : {type:Number,required:true},
    employeeAddress : {type:String,required:true},
    employeePanNumber :{type:String,required:true},
    employeeAadharNumber : {type:String,required:true},
    employeeMaritalStatus : {type:Boolean,required:false},
    employeeState :{type:String,required:true}
},
{
timestamps : true

});
//UUID Generation
employeeSchema.pre('save',function(next){
    this.uuid = 'EMP-'+crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});
module.exports = mongoose.model('employee',employeeSchema);