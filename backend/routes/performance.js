const express = require("express");
const Performance = require("../models/Performance");

const router = express.Router();

// GET all performance reviews
router.get("/", async (req, res) => {
    try {
        const performance = await Performance.find().sort({ createdAt: -1 });
        res.json(performance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET one performance review
router.get("/:id", async (req, res) => {
    try {
        const performance = await Performance.findById(req.params.id);

        if (!performance) {
            return res.status(404).json({ error: "Performance review not found" });
        }

        res.json(performance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADD performance review
router.post("/", async (req, res) => {
    try {
        const performance = new Performance(req.body);
        const savedPerformance = await performance.save();

        res.status(201).json(savedPerformance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE performance review
router.put("/:id", async (req, res) => {
    try {
        const updatedPerformance = await Performance.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPerformance) {
            return res.status(404).json({ error: "Performance review not found" });
        }

        res.json(updatedPerformance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE performance review
router.delete("/:id", async (req, res) => {
    try {
        const deletedPerformance = await Performance.findByIdAndDelete(
            req.params.id
        );

        if (!deletedPerformance) {
            return res.status(404).json({ error: "Performance review not found" });
        }

        res.json({
            message: "Performance review deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;