const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check if there's a token in the request header (Authorization header)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get the token from the Authorization header (e.g., Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Log the decoded JWT to check its content
            console.log('Decoded JWT:', decoded);  // This should contain the admin_role field

            // Attach the decoded user info (id and admin_role) to the request object
            req.user = decoded;

            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            console.error('JWT Verification Error:', err);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If there's no token
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
// Middleware to check if the user has an admin role (admin_role is a boolean)
const adminOnly = (req, res, next) => {
    // Ensure the user has the 'admin_role' set to true
    if (req.user && req.user.admin_role === true) {
        next();  // Allow the request to proceed
    } else {
        return res.status(403).json({ message: 'Not authorized as admin',
            user: req.user,
            "admin_role": req.user.admin_role,

         });  // Forbidden error
    }
};

module.exports = { protect, adminOnly };
