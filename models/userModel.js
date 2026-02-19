const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true,
        unique:true
    },
     password:{
        type:String,
        required:true
    },
     profile:{
        type:String,
        required:false
    },
     role:{
        type:String,
        required:true,
    },
     status:{
        type:String,
        required:true,
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('user',userSchema)