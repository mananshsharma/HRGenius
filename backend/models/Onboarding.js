const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema(
    {
        onboardingId: {
            type: String,
            required: true,
            unique: true
        },

        employee: {
            type: String,
            required: true
        },

        joiningDate: {
            type: Date,
            required: true
        },

        department: {
            type: String,
            required: true
        },

        documents: {
            type: String,
            required: true
        },

        tasks: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Completed"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Onboarding",
    onboardingSchema
);