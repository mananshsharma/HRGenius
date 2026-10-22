
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
        const { name, email, password } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                error: "User with this email already exists"
            });
        }

        // Public registration cannot choose a privileged role
        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: "HR Executive"
        });

        const savedUser = await user.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        // Handle duplicate email race conditions
        if (error.code === 11000) {
            return res.status(409).json({
                error: "User with this email already exists"
            });
        }

        return res.status(500).json({
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
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                error: "Authentication service is not configured"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
                algorithm: "HS256"
            }
        );

        return res.json({
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
        console.error("Login error:", error.message);

        return res.status(500).json({
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
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Authorization token required or invalid format"
            });
        }

        const token = authHeader.slice(7).trim();

        if (!token) {
            return res.status(401).json({
                error: "Token missing"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");

            return res.status(500).json({
                error: "Authentication service is not configured"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        const user = await User.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.json({ user });

    } catch (error) {
        console.error("Auth verification error:", error.message);

        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
});

// =========================================
// LOGOUT
// POST /api/auth/logout
// =========================================

router.post("/logout", (req, res) => {
    return res.json({
        message: "Logout successful. Remove the token from the client."
    });
});

module.exports = router;
