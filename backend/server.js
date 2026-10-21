const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();


// =========================================
// MIDDLEWARE
// =========================================

const authenticateToken =
    require("./middleware/auth");


// =========================================
// ROUTES
// =========================================

const authRoutes =
    require("./routes/auth");

const employeeRoutes =
    require("./routes/employees");

const jobRoutes =
    require("./routes/jobs");

const candidateRoutes =
    require("./routes/candidates");

const onboardingRoutes =
    require("./routes/onboarding");

const payrollRoutes =
    require("./routes/payroll");

const performanceRoutes =
    require("./routes/performance");

const analyticsRoutes =
    require("./routes/analytics");


// =========================================
// APP
// =========================================

const app = express();

const PORT =
    process.env.PORT || 5000;


// =========================================
// GENERAL MIDDLEWARE
// =========================================

app.use(cors());

app.use(express.json());


// =========================================
// HOME ROUTE
// =========================================

app.get("/", (req, res) => {

    res.json({

        message:
            "HRGenius Backend is running"

    });

});


// =========================================
// AUTHENTICATION ROUTES
// Public routes
// =========================================

app.use(
    "/api/auth",
    authRoutes
);


// =========================================
// PROTECTED API ROUTES
// JWT REQUIRED
// =========================================

app.use(
    "/api/employees",
    authenticateToken,
    employeeRoutes
);


app.use(
    "/api/jobs",
    authenticateToken,
    jobRoutes
);


app.use(
    "/api/candidates",
    authenticateToken,
    candidateRoutes
);


app.use(
    "/api/onboarding",
    authenticateToken,
    onboardingRoutes
);


app.use(
    "/api/payroll",
    authenticateToken,
    payrollRoutes
);


app.use(
    "/api/performance",
    authenticateToken,
    performanceRoutes
);


app.use(
    "/api/analytics",
    authenticateToken,
    analyticsRoutes
);


// =========================================
// MONGODB CONNECTION
// =========================================

mongoose.connect(
    process.env.MONGO_URI,
    {
        family: 4,
        serverSelectionTimeoutMS: 10000,
        tls: true
    }
)
.then(() => {

    console.log(
        "MongoDB connected successfully"
    );

})
.catch((error) => {

    console.error(
        "MongoDB connection failed:",
        error.message
    );

});


// =========================================
// START SERVER
// =========================================

app.listen(
    PORT,
    () => {

        console.log(
            `HRGenius backend running on http://localhost:${PORT}`
        );

    }
);