const fs = require('fs')
module.exports = {
    format(mtime){
        let myDate = new Date(mtime)
        let getFullYear = myDate.getFullYear();
        let getMonth = (Number(myDate.getMonth()) + 1).toString().padStart(2, "00");
        let getDate = myDate.getDate().toString().padStart(2, "00");
        let getHours = myDate.getHours().toString().padStart(2, "00");
        let getMinutes = myDate.getMinutes().toString().padStart(2, "00");
        let getSeconds = myDate.getSeconds().toString().padStart(2, "00");
        let dataRate = `${getFullYear}/${getMonth}/${getDate} ${getHours}:${getMinutes}:${getSeconds}`
        return dataRate
    },
    writeJson(filePath,context){
        return new Promise((resolve,reject)=>{
            fs.writeFile(filePath,context,'utf-8',(err,data)=>{
                if(err){
                    console.log(err,'writeJson')
                    reject(err)
                }else{
                   console.log(err,'done')
                   resolve('done')
                }
            })
        })
    }
}
