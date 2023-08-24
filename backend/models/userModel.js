const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxLength: [30, "name should not exceed more than 30 characters"],
        minLength: [5, "name should contain atleast 5 characters"]
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
       
    },
    otp: {
        type: String,       
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "User"
    },
    resetPasswordToken : String,
    resetPasswordExpire:Date
 })

// const userSchema = new mongoose.Schema({
//     username:String,
//     email: { type: String, unique: true },
//     password: String
//   });

module.exports = mongoose.model("User",userSchema)
