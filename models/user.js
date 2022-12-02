const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        required: true,
        default: "normal"
    },
    emailid: {
        type: String,
        
        
    },
    phone: {
        type: Number,
        
        
    },
    health_report: [{
        unique: false,
        datetime: {
            type: Date,
            unique: false,
            required: false,
        },
        question1: {
            type: String,
            required: true,
        },
        question2: {
            type: String,
            required: true,
        },
        question3: {
            type: String,
            required: true,

        },
        question3_reason: {
            default: "N/A",
            type: String,


        },
        question4: {
            type: String,
            required: true

        },
        question4_reason: {
            type: String,
            default: "N/A"
        },
        question5: {
            type: String,
            required: true

        },
        question6: {
            type: String,
            required: true

        },
        question6_reason: {
            type: String,
            default: "N/A"
        },
        question7: {
            type: String,
            required: true

        },


    }],
    code_no: {
        type: Number,
        unique: true,
        required: true,
    },
    ip_no: {
        type: Number,
        default: null,


    },
    op_no: {
        type: Number,
        default: null,
    },
    DO_admission: {
        type: Date,
        default: null,
    },
    DO_surgery: {
        type: Date,
        default: null,
    },
    DO_followup: {
        type: String,
        default: null,
    },
})


var userdata = mongoose.model('userdata', UserSchema)
module.exports = userdata;