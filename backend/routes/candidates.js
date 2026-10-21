const express = require("express");
const Candidate = require("../models/Candidate");

const router = express.Router();


// ===============================
// GET ALL CANDIDATES
// ===============================

router.get("/", async (req, res) => {

    try {

        const candidates =
            await Candidate.find();

        res.json(candidates);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch candidates",
            error: error.message
        });

    }

});


// ===============================
// ADD CANDIDATE
// ===============================

router.post("/", async (req, res) => {

    try {

        const candidate =
            new Candidate({

                candidateId:
                    req.body.candidateId,

                name:
                    req.body.name,

                position:
                    req.body.position,

                status:
                    req.body.status

            });


        const savedCandidate =
            await candidate.save();


        res.status(201).json(
            savedCandidate
        );

    } catch (error) {

        res.status(400).json({
            message:
                "Failed to add candidate",

            error:
                error.message
        });

    }

});


// ===============================
// UPDATE CANDIDATE
// ===============================

router.put("/:id", async (req, res) => {

    try {

        const updatedCandidate =
            await Candidate.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );


        if (!updatedCandidate) {

            return res.status(404).json({
                message:
                    "Candidate not found"
            });

        }


        res.json(
            updatedCandidate
        );

    } catch (error) {

        res.status(400).json({
            message:
                "Failed to update candidate",

            error:
                error.message
        });

    }

});


// ===============================
// DELETE CANDIDATE
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const deletedCandidate =
            await Candidate.findByIdAndDelete(
                req.params.id
            );


        if (!deletedCandidate) {

            return res.status(404).json({
                message:
                    "Candidate not found"
            });

        }


        res.json({
            message:
                "Candidate deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to delete candidate",

            error:
                error.message
        });

    }

});


module.exports = router;