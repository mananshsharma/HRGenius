const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// =========================================
// REGISTER USER
// POST /api/auth/register
// =========================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        // Validate required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                error: "Name, email and password are required"
            });

        }


        // Validate password length
        if (password.length < 6) {

            return res.status(400).json({
                error: "Password must be at least 6 characters"
            });

        }


        const normalizedEmail =
            email.toLowerCase().trim();


        // Check existing user
        const existingUser =
            await User.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(409).json({
                error: "User with this email already exists"
            });

        }


        // Create user
        const user = new User({

            name: name.trim(),

            email: normalizedEmail,

            password,

            role: role || "Admin"

        });


        const savedUser =
            await user.save();


        res.status(201).json({

            message: "User registered successfully",

            user: {

                id: savedUser._id,

                name: savedUser.name,

                email: savedUser.email,

                role: savedUser.role

            }

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            error: "Failed to register user"
        });

    }

});



// =========================================
// LOGIN USER
// POST /api/auth/login
// =========================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validate fields
        if (!email || !password) {

            return res.status(400).json({
                error: "Email and password are required"
            });

        }


        const normalizedEmail =
            email.toLowerCase().trim();


        // Find user
        const user =
            await User.findOne({
                email: normalizedEmail
            });


        if (!user) {

            return res.status(401).json({
                error: "Invalid email or password"
            });

        }


        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                error: "Invalid email or password"
            });

        }


        // Check JWT secret
        if (!process.env.JWT_SECRET) {

            return res.status(500).json({
                error: "JWT_SECRET is not configured"
            });

        }


        // Create JWT token
        const token =
            jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );


        res.json({

            message: "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            error: "Login failed"
        });

    }

});



// =========================================
// GET CURRENT USER
// GET /api/auth/me
// =========================================

router.get("/me", async (req, res) => {

    try {

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                error: "Authorization token required"
            });

        }


        // Expected format:
        // Authorization: Bearer TOKEN

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


        // Verify token
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Find user
        const user =
            await User
                .findById(decoded.userId)
                .select("-password");


        if (!user) {

            return res.status(404).json({
                error: "User not found"
            });

        }


        res.json({

            user

        });

    } catch (error) {

        console.error(
            "Auth verification error:",
            error.message
        );

        res.status(401).json({
            error: "Invalid or expired token"
        });

    }

});



// =========================================
// LOGOUT
// POST /api/auth/logout
// =========================================

router.post("/logout", (req, res) => {

    res.json({

        message:
            "Logout successful. Remove the token from the client."

    });

});



module.exports = router;