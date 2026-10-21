const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
    {
        payrollId: {
            type: String,
            required: true,
            unique: true
        },

        employee: {
            type: String,
            required: true
        },

        month: {
            type: String,
            required: true
        },

        basicSalary: {
            type: Number,
            required: true,
            min: 0
        },

        allowances: {
            type: Number,
            required: true,
            min: 0
        },

        deductions: {
            type: Number,
            required: true,
            min: 0
        },

        netSalary: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Processed"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Payroll",
    payrollSchema
);