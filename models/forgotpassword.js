const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ForgotPasswordSchema = new Schema({
    active:{
        type:Boolean
    },
    expiresby:{
        type:Date
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})


module.exports =  mongoose.model('ForgotPassword',ForgotPasswordSchema);












