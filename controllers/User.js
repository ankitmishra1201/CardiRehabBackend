const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
require("dotenv").config();

// Register User
const registerUser = async (req, res, next) => {
    const { name, password, admin_role, code_no, emailid } = req.body;

    // Ensure the logged-in user is an admin
    if (req.user.admin_role !== true) {
        return res.status(403).json({ message: 'Only admin can register users' });
    }

    // Ensure all required fields are provided
    if (!name || !password || !admin_role || !code_no || !emailid) {
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!password) missingFields.push('password');
        if (!admin_role) missingFields.push('admin_role');
        if (!code_no) missingFields.push('code_no');
        if (!emailid) missingFields.push('emailid');
        return res.status(400).json({ message: `Missing fields: ${missingFields.join(', ')}` });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ code_no });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this code number already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            code_no,
            name,
            emailid,
            password: hashedPassword,
            admin_role,
            health_report: [],
        });

        res.status(200).json({
            message: 'User created successfully',
            user: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const jwt = require('jsonwebtoken');

// Login User
const loginUser = async (req, res, next) => {
    const { code_no, emailid, password } = req.body;

    // Ensure password and either code_no or emailid are provided
    if (!password || (!code_no && !emailid)) {
        return res.status(400).json({ message: 'Password and either code number or email ID must be provided' });
    }

    try {
        // Find the user by code_no or emailid
        const user = await User.findOne({ $or: [{ code_no }, { emailid }] });
        if (!user) {
            return res.status(400).json({ message: 'Invalid code number/email ID or password' });
        }

        // Compare the password
        const isMatch = bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Password Is Incorrect',"ismatch": isMatch });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid code number/email ID' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, admin_role: user.admin_role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                name: user.name,
                code_no: user.code_no,
                admin_role: user.admin_role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get all normal users
const getallusers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'normal' });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a particular user by ID
const getpaticularuser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User fetched successfully',
            user: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};


// Add health data for a user
const addhealth_data = async (req, res, next) => {
    const { id } = req.params;
    const {
        datetime, question1, question2, question3, question4, 
        question3_reason, question4_reason, question5, question6, 
        question7, question6_reason, question7_reason 
    } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the health report data to the user's health_reports array
        user.health_report.push({
            datetime,
            question1,
            question2,
            question3,
            question4,
            question5,
            question6,
            question7,
            question3_reason,
            question4_reason,
            question6_reason,
            question7_reason,
        });

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: 'Health data added successfully',
            health_report: user.health_report,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Ensure the logged-in user is an admin
    if (req.user.admin_role !== true) {
        return res.status(403).json({ message: 'Only admin can delete users' });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

// Update user information
const updateuser = async (req, res) => {
    const { id } = req.params;
    const { name, emailid, phone, ip_no, op_no, DO_admission, DO_surgery, DO_followup } = req.body;

    // Ensure the logged-in user is an admin
    if (req.user.admin_role !== true) {
        return res.status(403).json({ message: 'Only admin can update user information' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, {
            name, emailid, phone, ip_no, op_no, DO_admission, DO_surgery, DO_followup,
        }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};



    
module.exports.registerUser=registerUser
module.exports.loginUser=loginUser
module.exports.getallusers=getallusers
module.exports.getpaticularuser=getpaticularuser
module.exports.deleteUser=deleteUser
module.exports.updateuser=updateuser


module.exports.addhealth_data=addhealth_data



