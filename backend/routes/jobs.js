const express = require("express");
const Job = require("../models/Job");

const router = express.Router();


// ===============================
// GET ALL JOBS
// ===============================

router.get("/", async (req, res) => {

    try {

        const jobs = await Job.find();

        res.json(jobs);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });

    }

});


// ===============================
// ADD JOB
// ===============================

router.post("/", async (req, res) => {

    try {

        const job = new Job({
            jobId: req.body.jobId,
            title: req.body.title,
            department: req.body.department,
            openings: req.body.openings,
            skills: req.body.skills,
            status: req.body.status
        });

        const savedJob = await job.save();

        res.status(201).json(savedJob);

    } catch (error) {

        res.status(400).json({
            message: "Failed to add job",
            error: error.message
        });

    }

});


// ===============================
// UPDATE JOB
// ===============================

router.put("/:id", async (req, res) => {

    try {

        const updatedJob =
            await Job.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedJob) {

            return res.status(404).json({
                message: "Job not found"
            });

        }

        res.json(updatedJob);

    } catch (error) {

        res.status(400).json({
            message: "Failed to update job",
            error: error.message
        });

    }

});


// ===============================
// DELETE JOB
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const deletedJob =
            await Job.findByIdAndDelete(
                req.params.id
            );

        if (!deletedJob) {

            return res.status(404).json({
                message: "Job not found"
            });

        }

        res.json({
            message: "Job deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete job",
            error: error.message
        });

    }

});


module.exports = router;