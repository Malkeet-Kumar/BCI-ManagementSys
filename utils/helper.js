const fs = require('fs')
const path = require('path')

function createArray(file){
    const rawData = fs.readFileSync(file,"utf-8").split("\r\n")
    let processedData=[];
    for(let i=0;i<rawData.length-1;i++){

        const a = rawData[i].split(",")
        const ob = {
            name:a[0],
            hsn:a[1],
            stock:a[2],
            unit:a[3],
            price:a[4],
            gst:a[5]
        }
        processedData.push(ob)
    }
    return processedData
}

module.exports = {createArray}
