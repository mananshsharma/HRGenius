const express = require("express");

const Employee = require("../models/Employee");
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");
const Onboarding = require("../models/Onboarding");
const Payroll = require("../models/Payroll");
const Performance = require("../models/Performance");

const router = express.Router();


// =================================
// GET ANALYTICS SUMMARY
// =================================

router.get("/", async (req, res) => {

    try {

        // -----------------------------
        // EMPLOYEES
        // -----------------------------

        const employees =
            await Employee.find().sort({ createdAt: -1 });

        const totalEmployees =
            employees.length;


        const departmentCounts = {};

        employees.forEach(function(employee) {

            const department =
                employee.department || "Other";

            if (!departmentCounts[department]) {
                departmentCounts[department] = 0;
            }

            departmentCounts[department]++;

        });


        // -----------------------------
        // RECRUITMENT
        // -----------------------------

        const jobs =
            await Job.find().sort({ createdAt: -1 });

        const candidates =
            await Candidate.find().sort({ createdAt: -1 });


        const openJobs =
            jobs.filter(function(job) {
                return job.status === "Open";
            }).length;


        const candidateStatusCounts = {

            Applied: 0,
            Shortlisted: 0,
            Interview: 0,
            Hired: 0,
            Rejected: 0

        };


        candidates.forEach(function(candidate) {

            if (
                candidateStatusCounts[
                    candidate.status
                ] !== undefined
            ) {

                candidateStatusCounts[
                    candidate.status
                ]++;

            }

        });


        // -----------------------------
        // ONBOARDING
        // -----------------------------

        const onboarding =
            await Onboarding.find()
                .sort({ createdAt: -1 });


        const onboardingStatusCounts = {

            Pending: 0,
            "In Progress": 0,
            Completed: 0

        };


        onboarding.forEach(function(item) {

            if (
                onboardingStatusCounts[
                    item.status
                ] !== undefined
            ) {

                onboardingStatusCounts[
                    item.status
                ]++;

            }

        });


        const totalOnboarding =
            onboarding.length;


        const onboardingCompletionPercentage =
            totalOnboarding > 0
                ? Number(
                    (
                        (
                            onboardingStatusCounts.Completed /
                            totalOnboarding
                        ) * 100
                    ).toFixed(1)
                )
                : 0;


        // -----------------------------
        // PAYROLL
        // -----------------------------

        const payroll =
            await Payroll.find()
                .sort({ createdAt: -1 });


        let totalPayroll = 0;


        payroll.forEach(function(record) {

            totalPayroll +=
                Number(record.netSalary) || 0;

        });


        const processedPayroll =
            payroll.filter(function(record) {

                return record.status === "Processed";

            }).length;


        const pendingPayroll =
            payroll.filter(function(record) {

                return record.status === "Pending";

            }).length;


        // -----------------------------
        // PERFORMANCE
        // -----------------------------

        const performance =
            await Performance.find()
                .sort({ createdAt: -1 });


        let totalRating = 0;


        performance.forEach(function(review) {

            totalRating +=
                Number(review.rating) || 0;

        });


        const averageRating =
            performance.length > 0

                ? Number(
                    (
                        totalRating /
                        performance.length
                    ).toFixed(1)
                )

                : 0;


        const completedGoals =
            performance.filter(function(review) {

                return review.status === "Completed";

            }).length;


        const progressGoals =
            performance.filter(function(review) {

                return review.status === "In Progress";

            }).length;


        // -----------------------------
        // RESPONSE
        // -----------------------------

        res.json({

            employees: {

                total: totalEmployees,

                departments:
                    departmentCounts

            },


            recruitment: {

                totalJobs:
                    jobs.length,

                openJobs:
                    openJobs,

                totalCandidates:
                    candidates.length,

                statuses:
                    candidateStatusCounts

            },


            onboarding: {

                total:
                    totalOnboarding,

                statuses:
                    onboardingStatusCounts,

                completionPercentage:
                    onboardingCompletionPercentage

            },


            payroll: {

                totalRecords:
                    payroll.length,

                totalNetPayroll:
                    totalPayroll,

                processed:
                    processedPayroll,

                pending:
                    pendingPayroll

            },


            performance: {

                totalReviews:
                    performance.length,

                averageRating:
                    averageRating,

                completedGoals:
                    completedGoals,

                inProgressGoals:
                    progressGoals

            }

        });

    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );

        res.status(500).json({

            error:
                "Failed to generate analytics",

            details:
                error.message

        });

    }

});


module.exports = router;