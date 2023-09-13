const dotenv = require('dotenv');
dotenv.config({path:'../config.env'});
const fs = require('fs');

const filepath = process.env.PATH_TO_CSVFILE;
console.log(filepath);
var data= [];
csv_File = fs.readFileSync(".."+filepath);

var csvData = csv_File.toString().split("\n");
//console.log(csvData);

var headers = csvData[0].split(",");
//console.log(headers);
//console.log(headers[0].length);
//console.log(headers.length);
for(let i =0;i<headers.length;i++){
    headers[i] = headers[i].split(".");
}
//console.log(headers[0][0].trim());
//console.log(headers);



function jsonObject(csvEnty,index,leftBound ,rightBound){
  let l =leftBound;
  var headerObj = {};
  while(l<=rightBound){
    if(index>=headers[l].length){
        l++;
    }else{
        let r =l;
        while( r <=rightBound && index <headers[r].length && 
            headers[l][index].trim() == headers[r][index].trim()){
                r++;
            }
            if(r-l == 1){
                var data = csvEnty[l].trim();
                console.log(data);
                if(isNaN(data)){
                   headerObj[headers[l][index].trim()] = data;
                }
                else {
                    headerObj[headers[l][index].trim()]=parseInt(data);
                }
            }
            else{
               headerObj[headers[l][index].trim()]=jsonObject(csvEnty,index+1,l,r-1); 
            }
            l=r;
    }
  }
  //console.log(headerObj);
  return headerObj;
}
function convertor(){
return new Promise((resolve,reject)=>{
    for (let i = 1; i < csvData.length -1; i++) {
        var jsonEntry = csvData[i].split(",");
        //console.log(jsonEntry);
        var m = jsonEntry.length;
        var object = jsonObject(jsonEntry, 0, 0, m- 1);
        data.push(object);
      }
      resolve(data);
  })
}
module.exports = {convertor};





