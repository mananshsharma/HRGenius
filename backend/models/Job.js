const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            required: true,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true
        },

        openings: {
            type: Number,
            required: true,
            min: 1
        },

        skills: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);