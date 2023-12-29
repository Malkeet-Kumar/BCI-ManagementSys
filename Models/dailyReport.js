const mongoose = require('mongoose');
const dailyReportSchema = mongoose.Schema({
    year:String,
    month:String,
    date:String,
    stockDetails:[
        {
            _id:mongoose.Schema.Types.ObjectId,
            date:String,
            name:String,
            consignor:String,
            consignee:String,
            dispatchState:String,
            invNo:String,
            inwardStock:Number,
            boxes:Number,
            outwardStock:Number,
            stockBalance:Number,
            sales:Number,
            transactType:String,
        }
    ],
    shopKeeperId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{timestamps:true});
const DailyReport = mongoose.model("reports",dailyReportSchema);
module.exports = DailyReport;