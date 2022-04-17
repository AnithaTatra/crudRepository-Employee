const mongoose = require("mongoose");
const crypto = require("crypto");


const organizationSchema = new mongoose.Schema({
    uuid:{type: String, required: false},
    organizationName: {type: String, required: true, trim: true},
    organizationDesc: {type: String, required: false, trim: true},
    ageRestriction :{type:String,enum:['10+','18+','above 40'],required:false},
    userUuid: {type: String, required: true}
    },
    {
        timestamps: true
    
});

// UUID generation
organizationSchema.pre('save', function(next){
    this.uuid = 'ORG-'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});

module.exports=mongoose.model('organization',organizationSchema, 'organization');