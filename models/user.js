const mongoose = require('mongoose');

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    role:{
        type:String,
        required:true,
        default:"normal"
    },
    emailid:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    health_report:[{
        unique:false,
        datetime:{
            type:Date,
            unique:false,
            required:false,
        },
        question1:{
            type:String,
            required:true,
        },
        question2:{
            type:String,
            required:true,
        },
        question3:{
            type:String,
            required:true,
            
        },
        question3_reason:{
            default:"N/A",
            type:String,


        },
        question4:{
            type:String,
            required:true

        },
        question4_reason:{
            type:String,
            default:"N/A"
        }
        
    }]
})


var userdata=mongoose.model('userdata',UserSchema)
module.exports=userdata;