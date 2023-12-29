const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    password:String,
    gst:String,
    pan:String,
    mobile:String,
    store:String,
    approved:Boolean,
    address:String
})
const User = mongoose.model("users",userSchema)
module.exports = User