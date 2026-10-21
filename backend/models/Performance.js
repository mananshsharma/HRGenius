const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
    {
        performanceId: {
            type: String,
            required: true,
            unique: true
        },

        employee: {
            type: String,
            required: true
        },

        period: {
            type: String,
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        goal: {
            type: String,
            required: true
        },

        progress: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        feedback: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["In Progress", "Completed"],
            default: "In Progress"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Performance", performanceSchema);