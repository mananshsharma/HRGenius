const express = require("express");
const Employee = require("../models/Employee");

const router = express.Router();


// ===============================
// GET ALL EMPLOYEES
// ===============================

router.get("/", async (req, res) => {

    try {

        const employees = await Employee.find();

        res.json(employees);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch employees",
            error: error.message
        });

    }

});


// ===============================
// ADD EMPLOYEE
// ===============================

router.post("/", async (req, res) => {

    try {

        const employee = new Employee({
            employeeId: req.body.employeeId,
            name: req.body.name,
            email: req.body.email,
            department: req.body.department,
            position: req.body.position,
            status: req.body.status
        });

        const savedEmployee =
            await employee.save();

        res.status(201).json(savedEmployee);

    } catch (error) {

        res.status(400).json({
            message: "Failed to add employee",
            error: error.message
        });

    }

});


// ===============================
// UPDATE EMPLOYEE
// ===============================

router.put("/:id", async (req, res) => {

    try {

        const updatedEmployee =
            await Employee.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedEmployee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        res.json(updatedEmployee);

    } catch (error) {

        res.status(400).json({
            message: "Failed to update employee",
            error: error.message
        });

    }

});


// ===============================
// DELETE EMPLOYEE
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const deletedEmployee =
            await Employee.findByIdAndDelete(
                req.params.id
            );

        if (!deletedEmployee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete employee",
            error: error.message
        });

    }

});


module.exports = router;