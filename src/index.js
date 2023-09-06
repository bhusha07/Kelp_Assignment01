

const express =  require('express');

var bodyParser = require('body-parser');
const routerUser = require('./Routes/upload');
const app = express();
app.use(express.json());
app.use(bodyParser.json())




app.use('/upload',routerUser);
app.listen(9999,()=>{console.log("Server Started at 9999")})





