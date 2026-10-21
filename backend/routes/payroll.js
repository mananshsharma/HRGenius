const express = require("express");
const Payroll = require("../models/Payroll");

const router = express.Router();


// ===============================
// GET ALL PAYROLL RECORDS
// ===============================

router.get("/", async (req, res) => {

    try {

        const payroll =
            await Payroll.find();

        res.json(payroll);

    } catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch payroll records",

            error:
                error.message

        });

    }

});


// ===============================
// ADD PAYROLL RECORD
// ===============================

router.post("/", async (req, res) => {

    try {

        const payroll =
            new Payroll({

                payrollId:
                    req.body.payrollId,

                employee:
                    req.body.employee,

                month:
                    req.body.month,

                basicSalary:
                    req.body.basicSalary,

                allowances:
                    req.body.allowances,

                deductions:
                    req.body.deductions,

                netSalary:
                    req.body.netSalary,

                status:
                    req.body.status

            });


        const savedPayroll =
            await payroll.save();


        res.status(201).json(
            savedPayroll
        );

    } catch (error) {

        res.status(400).json({

            message:
                "Failed to add payroll record",

            error:
                error.message

        });

    }

});


// ===============================
// UPDATE PAYROLL
// ===============================

router.put("/:id", async (req, res) => {

    try {

        const updatedPayroll =
            await Payroll.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedPayroll) {

            return res.status(404).json({

                message:
                    "Payroll record not found"

            });

        }


        res.json(
            updatedPayroll
        );

    } catch (error) {

        res.status(400).json({

            message:
                "Failed to update payroll record",

            error:
                error.message

        });

    }

});


// ===============================
// DELETE PAYROLL
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const deletedPayroll =
            await Payroll.findByIdAndDelete(
                req.params.id
            );


        if (!deletedPayroll) {

            return res.status(404).json({

                message:
                    "Payroll record not found"

            });

        }


        res.json({

            message:
                "Payroll record deleted successfully"

        });

    } catch (error) {

        res.status(500).json({

            message:
                "Failed to delete payroll record",

            error:
                error.message

        });

    }

});


module.exports = router;