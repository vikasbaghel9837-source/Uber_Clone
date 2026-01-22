const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minLength:[3,'First Name must be atleast 3 characters long']
        },
        lastname:{
            type:String,
            minLength:[3,'Last Name must be atleast 3 characters long']
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String,

    }
})

UserSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id} , process.env.JWT_SECRET)
    return token;
}

UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

UserSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password , 10);
}

module.exports = mongoose.model("User" , UserSchema);