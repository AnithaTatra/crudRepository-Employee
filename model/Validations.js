//By Anitha T
// Joi schema Validations
const joi=require('joi')
const { schema } = require('./organization.model')

const authSchema=joi.object({
        employeeName: joi.string().alphanum().pattern(new RegExp('.*[0-9].*')).required(),
        employeeId: joi.number().integer().required(),
        employeeAddress:joi.string().alphanum().required(),
        employeePanNumber:joi.string().alphanum().required(),
        employeeAadharNumber:joi.number().integer().required(),
        employeeState:joi.string().pattern(new RegExp('^[a-zA-Z]+$')).required(),
        userUuid:joi.string().required(),
        organizationuuid:joi.string().required(),   
})
module.exports={
    authSchema:authSchema
}