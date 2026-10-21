
const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const router = express.Router();

// Allow only the specified roles
function allowRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to perform this action"
            });
        }

        next();
    };
}

// Only accept approved employee fields
function getEmployeeFields(body) {
    const fields = {};

    const allowedFields = [
        "employeeId",
        "name",
        "email",
        "department",
        "position",
        "status"
    ];

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            fields[field] = body[field];
        }
    }

    return fields;
}

// GET: View all employees (HR Executive and Admin)
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        console.error("Failed to fetch employees:", error.message);
        res.status(500).json({ message: "Failed to fetch employees" });
    }
});

// POST: Add an employee (HR Executive and Admin)
router.post("/", async (req, res) => {
    try {
        const fields = getEmployeeFields(req.body);

        if (
            !fields.employeeId ||
            !fields.name ||
            !fields.email
        ) {
            return res.status(400).json({
                message: "Employee ID, name, and email are required"
            });
        }

        const employee = new Employee(fields);
        const savedEmployee = await employee.save();

        res.status(201).json(savedEmployee);
    } catch (error) {
        console.error("Failed to add employee:", error.message);
        res.status(400).json({ message: "Failed to add employee" });
    }
});

// PUT: Update an employee (HR Executive and Admin)
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const fields = getEmployeeFields(req.body);

        if (Object.keys(fields).length === 0) {
            return res.status(400).json({
                message: "No valid employee fields provided"
            });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { $set: fields },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json(updatedEmployee);
    } catch (error) {
        console.error("Failed to update employee:", error.message);
        res.status(400).json({ message: "Failed to update employee" });
    }
});

// DELETE: Only Admin can delete employees
router.delete("/:id", allowRoles("Admin"), async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const deletedEmployee = await Employee.findByIdAndDelete(
            req.params.id
        );

        if (!deletedEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Failed to delete employee:", error.message);
        res.status(500).json({ message: "Failed to delete employee" });
    }
});

module.exports = router;
