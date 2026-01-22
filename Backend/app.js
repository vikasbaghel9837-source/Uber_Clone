const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const database = require("./db/db");

database.DBConnect();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}))


app.get('/' , (req,res)=>{
    res.send("HomePage");
})

app.use('/users' , userRoutes);


module.exports = app;