const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HealthReportSchema = mongoose.Schema({
    datetime: {
        type: Date,
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
        type: String,
        default: "N/A",
    },
    question4: {
        type: String,
        required: true,
    },
    question4_reason: {
        type: String,
        default: "N/A",
    },
    question5: {
        type: String,
        required: true,
    },
    question6: {
        type: String,
        required: true,
    },
    question6_reason: {
        type: String,
        default: "N/A",
    },
    question7: {
        type: String,
        required: true,
    },
    question7_reason: {
        type: String,
        default: "N/A",
    },
});

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
    admin_role: {
        type: Boolean,
        required: true,
        default: false, // This can be "normal", "admin", etc.
    },
    emailid: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
    phone: {
        type: Number,
        required: false,
    },
    health_reports: [HealthReportSchema], // Embed health reports here
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
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Hash password using bcrypt
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
