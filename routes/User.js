const express = require('express');
const user_Act = require('../controllers/User');
const { protect, adminOnly } = require('../middleware/auth'); // Import protect and adminOnly middlewares
const router = express.Router();

// Register User (Only admin can do this)
router.post('/registeruser', protect, adminOnly, user_Act.registerUser);

// Login User (returns JWT token)
router.post('/loginuser', user_Act.loginUser);

// Get all users with the role 'normal'
router.get('/getallusers', protect, adminOnly, user_Act.getallusers);

// Get a specific user by ID
router.get('/getuser/:id', protect, user_Act.getpaticularuser);

// Delete a user by ID (Only admin can do this)
router.delete('/:id/delete', protect, adminOnly, user_Act.deleteUser);

// Update user details by ID (Only admin can do this)
router.patch('/:id/updateuser', protect, adminOnly, user_Act.updateuser);

// Add health data to a user's report by ID (Health data can be added by anyone logged in)
router.post('/:id/addhealthdata', protect, user_Act.addhealth_data);

module.exports = router;
