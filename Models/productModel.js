const mongoose = require('mongoose');
const productScheme = mongoose.Schema({
    name:String,
    hsn:String,
    price:Number,
    unit:String,
    gst:Number,
    stock:Number,
    shopKeeperId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{timestamps:true});
const Product = mongoose.model("inventories",productScheme);
module.exports = Product;