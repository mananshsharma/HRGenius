const express = require("express");
const Onboarding = require("../models/Onboarding");

const router = express.Router();


// ===============================
// GET ALL ONBOARDING RECORDS
// ===============================

router.get("/", async (req, res) => {

    try {

        const onboarding =
            await Onboarding.find();

        res.json(onboarding);

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to fetch onboarding records",

            error:
                error.message
        });

    }

});


// ===============================
// ADD ONBOARDING RECORD
// ===============================

router.post("/", async (req, res) => {

    try {

        const onboarding =
            new Onboarding({

                onboardingId:
                    req.body.onboardingId,

                employee:
                    req.body.employee,

                joiningDate:
                    req.body.joiningDate,

                department:
                    req.body.department,

                documents:
                    req.body.documents,

                tasks:
                    req.body.tasks,

                status:
                    req.body.status

            });


        const savedOnboarding =
            await onboarding.save();


        res.status(201).json(
            savedOnboarding
        );

    } catch (error) {

        res.status(400).json({

            message:
                "Failed to add onboarding record",

            error:
                error.message

        });

    }

});


// ===============================
// UPDATE ONBOARDING
// ===============================

router.put("/:id", async (req, res) => {

    try {

        const updatedOnboarding =
            await Onboarding.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedOnboarding) {

            return res.status(404).json({

                message:
                    "Onboarding record not found"

            });

        }


        res.json(
            updatedOnboarding
        );

    } catch (error) {

        res.status(400).json({

            message:
                "Failed to update onboarding record",

            error:
                error.message

        });

    }

});


// ===============================
// DELETE ONBOARDING
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const deletedOnboarding =
            await Onboarding.findByIdAndDelete(
                req.params.id
            );


        if (!deletedOnboarding) {

            return res.status(404).json({

                message:
                    "Onboarding record not found"

            });

        }


        res.json({

            message:
                "Onboarding record deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message:
                "Failed to delete onboarding record",

            error:
                error.message

        });

    }

});


module.exports = router;