const dotenv = require('dotenv');
dotenv.config({path:'../config.env'});
const csv = require('csvtojson')


function convertor(){

    //get the file path from env config and convert it to JSON
    const filepath = process.env.PATH_TO_CSVFILE;
    console.log(process.env.PATH_TO_CSVFILE);
    const csvFilePath='..' +filepath;
    return new Promise((resolve,reject)=>{
    csv({delimiter:','})
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        const data = jsonObj;
        
        resolve(data);
        
    })
    .catch((err)=> {
        console.error('File NOt Found');
        reject(err);
    });
});  
}

module.exports = { convertor };