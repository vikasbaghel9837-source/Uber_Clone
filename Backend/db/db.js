const mongoose = require("mongoose");
require("dotenv").config();

exports.DBConnect = ()=>{
    mongoose.connect(process.env.DB_URL )
    .then(()=>(console.log("DB Connected Successfully")))
    .catch((err)=>{
        console.error(err);
        console.log(err);
        process.exit(1);
    })
}