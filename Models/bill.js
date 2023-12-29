const mongoose = require('mongoose');
const billSchema = mongoose.Schema({
   billDetails:Array,
   billItems:Array,
   grandTotal:Number,
   shopKeeperId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"users"
   }
},{timestamps:true})

const Bill = mongoose.model("billhistory",billSchema)
module.exports = Bill