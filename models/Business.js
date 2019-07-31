const mongoose = require("mongoose"),
passportLocalMongoose = require('passport-local-mongoose')

const BusinessSchema = new mongoose.Schema({
    company_name:String,
    username:String,
    password:String,
    email:String,
    country:String,
    city:String, 
    phone:String,
    emloyees_number:String,
    membership_active: Boolean,
    is_candidate:Boolean,
    is_business:Boolean,
    is_admin:Boolean, 
    premium: Boolean, 
    stripe_number:String,
    createdAt: {type: Date, default: Date.now},
    
});

BusinessSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Business', BusinessSchema)