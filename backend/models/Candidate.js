const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
    {
        candidateId: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        position: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Shortlisted",
                "Interview",
                "Hired",
                "Rejected"
            ],
            default: "Applied"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Candidate",
    candidateSchema
);