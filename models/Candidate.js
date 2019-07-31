const mongoose = require("mongoose"),
passportLocalMongoose = require('passport-local-mongoose')

const CandidateSchema = new mongoose.Schema({
    username: String,
    fname:String,
    lname:String,
    refnumber:Number,
    email:String,
    password:String,
    country:String,
    city:String, 
    coffee:String,
    bean: String,
    tool: String,
    award:String,
    phone:String, 
    position:String,
    experience: String, 
    description: String, 
    membership_active: Boolean, 
    is_candidate:Boolean,
    is_business:Boolean,
    is_admin:Boolean, 
    stripe_number:String,
    createdAt: {type: Date, default: Date.now},
    video_path:String, 
    display_path:String, 
    verified: Boolean,
    premium: Boolean

    
});

CandidateSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Candidate', CandidateSchema)