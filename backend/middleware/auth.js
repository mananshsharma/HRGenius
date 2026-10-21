const jwt = require("jsonwebtoken");


// =========================================
// AUTHENTICATION MIDDLEWARE
// =========================================

function authenticateToken(req, res, next) {

    const authHeader =
        req.headers.authorization;


    // Check Authorization header
    if (!authHeader) {

        return res.status(401).json({
            error: "Authorization token required"
        });

    }


    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            error: "Invalid authorization format"
        });

    }


    const token =
        authHeader.split(" ")[1];


    if (!token) {

        return res.status(401).json({
            error: "Token missing"
        });

    }


    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Store logged-in user information
        req.user = decoded;


        next();


    } catch (error) {

        return res.status(401).json({
            error: "Invalid or expired token"
        });

    }

}


module.exports =
    authenticateToken;