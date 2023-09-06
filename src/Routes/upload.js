const express =  require('express');
const uploadRouter = express.Router();
const mysql = require('mysql');
const { convertor }= require('./convertor');
//connection with mysql database
var connection = mysql.createConnection({
 host : process.env.HOST_NAME,
 user : process.env.DB_USER,
 password :process.env.DB_PASSWORD,
 database : process.env.DB_NAME

});

//get JSON data and call function CallAPI in which post request will sent  to th db
// which insert records in db

  convertor().then((data)=> {
    //console.log('Data From Csv', data);
    callApi(data)
  }).catch((error)=> {
    console.error('Error: ',error)
  });
function callApi(data){
    uploadRouter.post("/",(request ,response)=>{

        var {name ,age ,address ,additional_info}=request.body;
        var query=`INSERT INTO users (name ,age ,address ,additional_info) VALUES(?, ?, ?, ?)`;
        data.map((jdata)=>{
            name=jdata.name.firstname + " " + jdata.name.lastname;
            //console.log(name);
            age = jdata.age;
            //console.log(age);
            
            let temp = "";
            for (const x in jdata.address) {
                temp += jdata.address[x] + ", ";
              }
             address=JSON.stringify({"address":temp});
        //console.log(address);
            let add ={};
            
            for (var key in jdata) {
              if(key === "name"  || key ==="age" || key==="address"){
                  continue;
                  }else{
                    add[key] = jdata[key];
                  }
              
          }
            additional_info = JSON.stringify({"additional_info":add});
            //console.log(additional_info);
            
            connection.query(query,[name ,age ,address ,additional_info],(error,result)=>{
                if(error==null)
                {
                     var data = JSON.stringify(result);
                     response.write(data); 
                } 
                else
                {
                     console.log(error);
                    response.setHeader("Content-Type","application/json");
                    response.write(error);
               }
            }) 
        })

      //get age wise distribution 
        var query = "select age from users";
        let count_lessthan20 =0;
        let count_bwt2040=0;
        let count_bwt4060=0;
        let count_above60=0;
        let Total =0;
        connection.query(query, (error, result)=>{
                    if(error==null)
                    {
                         
                        result.forEach(element => {
                            if(element.age<20){
                                count_lessthan20=count_lessthan20+1;
                            }else if(element.age>=20 && element.age<40){
                                count_bwt2040 = count_bwt2040+1;
                            }else if(element.age>=40 && element.age<60){
                                count_bwt4060 = count_bwt4060+1;
                            }else{
                                count_above60 =count_above60+1;
                            }
                       });
                       Total = count_lessthan20 + count_bwt2040 + count_bwt4060 + count_above60;
                            
                            console.log(" % age distribution below 20:", ((count_lessthan20/Total)*100),"%");
                            console.log("% age distribution between 20 to 40",((count_bwt2040/Total)*100),"%");
                            console.log("% age distribution between 40 to 60",((count_bwt4060/Total)*100),"%");
                            console.log("% age distribution above 60",((count_above60/Total)*100),"%");
                      var data = JSON.stringify(result);
                       response.write(data); 
                    } 
                    else
                    {
                        console.log(error); 
                    }
                   
        })
        response.end();
        
        })
}

module.exports =uploadRouter;