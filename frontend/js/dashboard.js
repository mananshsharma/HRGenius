/* =================================
   HRGENIUS DASHBOARD.JS
   Complete working version:
   Recruitment + Onboarding + Payroll
   + Performance + Analytics
   + JWT Authentication
   + Live Dashboard Data
================================= */

const EMPLOYEES_API =
    "http://localhost:5000/api/employees";

const JOBS_API =
    "http://localhost:5000/api/jobs";

const CANDIDATES_API =
    "http://localhost:5000/api/candidates";

const ONBOARDING_API =
    "http://localhost:5000/api/onboarding";

const PAYROLL_API =
    "http://localhost:5000/api/payroll";

const PERFORMANCE_API =
    "http://localhost:5000/api/performance";

const ANALYTICS_API =
    "http://localhost:5000/api/analytics";

const AUTH_API =
    "http://localhost:5000/api/auth";


let employees = [];
let jobs = [];
let candidates = [];
let onboarding = [];
let payroll = [];
let performance = [];


/* =================================
   COMMON HELPERS
================================= */

function updateText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


function setWidth(id, percent) {

    const element =
        document.getElementById(id);

    if (element) {

        element.style.width =
            percent + "%";

    }

}


function formatCurrency(value) {

    return "₹" +
        Number(value || 0)
            .toLocaleString("en-IN");

}


function escapeDashboardHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function generateNextId(
    records,
    prefix
) {

    let maxNumber = 0;

    records.forEach(
        function(record) {

            const recordId =
                record.id ||
                record.jobId ||
                record.candidateId ||
                record.onboardingId ||
                record.payrollId ||
                record.performanceId;


            if (!recordId) {

                return;

            }


            const match =
                String(recordId)
                    .match(
                        new RegExp(
                            "^" +
                            prefix +
                            "(\\d+)$"
                        )
                    );


            if (match) {

                maxNumber =
                    Math.max(
                        maxNumber,
                        Number(match[1])
                    );

            }

        }
    );


    return prefix +
        String(
            maxNumber + 1
        ).padStart(
            3,
            "0"
        );

}


/* =================================
   API HELPER WITH JWT
================================= */

async function getJSON(
    url,
    options = {}
) {

    const token =
        localStorage.getItem(
            "hrgeniusToken"
        ) ||
        sessionStorage.getItem(
            "hrgeniusToken"
        );


    const headers = {

        ...(options.headers || {}),

        "Content-Type":
            "application/json"

    };


    // Attach JWT token
    if (token) {

        headers["Authorization"] =
            "Bearer " + token;

    }


    const response =
        await fetch(
            url,
            {
                ...options,
                headers
            }
        );


    let result = {};


    try {

        result =
            await response.json();

    } catch (_) {
    }


    // Unauthorized
    if (response.status === 401) {

        clearAuthData();

        window.location.href =
            "index.html";

        throw new Error(
            "Authentication required"
        );

    }


    if (!response.ok) {

        throw new Error(
            result.error ||
            result.message ||
            "Request failed"
        );

    }


    return result;

}


/* =================================
   LIVE DASHBOARD DATA
================================= */

async function loadDashboardData() {

    try {

        const data =
            await Promise.all([

                getJSON(
                    EMPLOYEES_API
                ),

                getJSON(
                    PAYROLL_API
                )

            ]);


        const employeeData =
            Array.isArray(data[0])
                ? data[0]
                : [];


        const payrollData =
            Array.isArray(data[1])
                ? data[1]
                : [];


        employees =
            employeeData;


        /* =========================
           CURRENT DATE
        ========================= */

        const now =
            new Date();


        const currentYear =
            now.getFullYear();


        const currentMonth =
            now.getMonth();


        const currentMonthKey =
            currentYear +
            "-" +
            String(
                currentMonth + 1
            ).padStart(
                2,
                "0"
            );


        /* =========================
           TOTAL EMPLOYEES
        ========================= */

        const totalEmployees =
            employees.length;


        updateText(
            "dashboardTotalEmployees",
            totalEmployees
        );


        /* =========================
           NEW HIRES
           Created during current month
        ========================= */

        const newHires =
            employees.filter(
                function(employee) {

                    if (!employee.createdAt) {

                        return false;

                    }


                    const createdDate =
                        new Date(
                            employee.createdAt
                        );


                    return (
                        createdDate.getFullYear() ===
                            currentYear &&
                        createdDate.getMonth() ===
                            currentMonth
                    );

                }
            ).length;


        updateText(
            "dashboardNewHires",
            newHires
        );


        const newHireText =
            newHires === 1
                ? "1 new hire this month"
                : newHires +
                    " new hires this month";


        updateText(
            "dashboardNewHiresMeta",
            newHireText
        );


        /* =========================
           MONTHLY PAYROLL
        ========================= */

        const monthlyPayroll =
            payrollData
                .filter(
                    function(record) {

                        return (
                            String(
                                record.month || ""
                            ) ===
                            currentMonthKey
                        );

                    }
                )
                .reduce(
                    function(
                        total,
                        record
                    ) {

                        return total +
                            (
                                Number(
                                    record.netSalary
                                ) || 0
                            );

                    },
                    0
                );


        updateText(
            "dashboardMonthlyPayroll",
            formatCurrency(
                monthlyPayroll
            )
        );


        /* =========================
           ON LEAVE
        ========================= */

        const onLeave =
            employees.filter(
                function(employee) {

                    return (
                        employee.status ===
                        "On Leave"
                    );

                }
            ).length;


        updateText(
            "dashboardOnLeave",
            onLeave
        );


        /* =========================
           DEPARTMENT COUNTS
        ========================= */

        const departmentCounts = {

            IT: 0,
            HR: 0,
            Sales: 0,
            Finance: 0,
            Marketing: 0

        };


        employees.forEach(
            function(employee) {

                const department =
                    employee.department;


                if (
                    Object.prototype.hasOwnProperty.call(
                        departmentCounts,
                        department
                    )
                ) {

                    departmentCounts[
                        department
                    ]++;

                }

            }
        );


        updateText(
            "departmentIT",
            departmentCounts.IT
        );


        updateText(
            "departmentHR",
            departmentCounts.HR
        );


        updateText(
            "departmentSales",
            departmentCounts.Sales
        );


        updateText(
            "departmentFinance",
            departmentCounts.Finance
        );


        updateText(
            "departmentMarketing",
            departmentCounts.Marketing
        );


    } catch (error) {

        console.error(
            "Dashboard data loading error:",
            error
        );

    }

}


/* =================================
   NAVIGATION
================================= */

function hideAllSections() {

    [
        "dashboardContent",
        "recruitmentSection",
        "onboardingSection",
        "payrollSection",
        "performanceSection",
        "analyticsSection"
    ].forEach(
        function(id) {

            const section =
                document.getElementById(
                    id
                );


            if (section) {

                section.style.display =
                    "none";

            }

        }
    );

}


function setActiveNav(activeId) {

    [
        "dashboardNav",
        "recruitmentNav",
        "onboardingNav",
        "payrollNav",
        "performanceNav",
        "analyticsNav"
    ].forEach(
        function(id) {

            const item =
                document.getElementById(id);


            if (item) {

                item.classList.remove(
                    "active"
                );

            }

        }
    );


    const active =
        document.getElementById(
            activeId
        );


    if (active) {

        active.classList.add(
            "active"
        );

    }

}


function showDashboard(event) {

    if (event) {

        event.preventDefault();

    }


    hideAllSections();


    const dashboard =
        document.getElementById(
            "dashboardContent"
        );


    if (dashboard) {

        dashboard.style.display =
            "block";

    }


    setActiveNav(
        "dashboardNav"
    );


    // Load real dashboard data
    loadDashboardData();

}


function addEmployee() {

    window.location.href =
        "employees.html";

}


/* =================================
   RECRUITMENT
================================= */

function showRecruitment(event) {

    if (event) {

        event.preventDefault();

    }


    hideAllSections();


    const section =
        document.getElementById(
            "recruitmentSection"
        );


    if (section) {

        section.style.display =
            "block";

    }


    setActiveNav(
        "recruitmentNav"
    );


    loadRecruitmentFromBackend();

}


async function loadRecruitmentFromBackend() {

    try {

        const data =
            await Promise.all([

                getJSON(
                    JOBS_API
                ),

                getJSON(
                    CANDIDATES_API
                )

            ]);


        jobs =
            data[0].map(
                function(job) {

                    return {

                        mongoId:
                            job._id,

                        id:
                            job.jobId,

                        title:
                            job.title,

                        department:
                            job.department,

                        openings:
                            job.openings,

                        skills:
                            job.skills,

                        status:
                            job.status

                    };

                }
            );


        candidates =
            data[1].map(
                function(candidate) {

                    return {

                        mongoId:
                            candidate._id,

                        id:
                            candidate.candidateId,

                        name:
                            candidate.name,

                        position:
                            candidate.position,

                        status:
                            candidate.status

                    };

                }
            );


        displayRecruitment();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Recruitment loading error:",
            error
        );


        displayRecruitment();

    }

}


function openJobModal() {

    const modal =
        document.getElementById(
            "jobModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

        modal.style.display =
            "flex";

    }

}


function closeJobModal() {

    const modal =
        document.getElementById(
            "jobModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

        modal.style.display =
            "none";

    }


    const form =
        document.getElementById(
            "jobForm"
        );


    if (form) {

        form.reset();

    }

}


async function addJob() {

    const title =
        document.getElementById(
            "jobTitle"
        ).value.trim();


    const department =
        document.getElementById(
            "jobDepartment"
        ).value;


    const openings =
        Number(
            document.getElementById(
                "jobOpenings"
            ).value
        );


    const skills =
        document.getElementById(
            "jobSkills"
        ).value.trim();


    const status =
        document.getElementById(
            "jobStatus"
        ).value;


    if (
        !title ||
        !department ||
        !openings ||
        !skills
    ) {

        alert(
            "Please fill all job details."
        );

        return;

    }


    try {

        const result =
            await getJSON(
                JOBS_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            jobId:
                                generateNextId(
                                    jobs,
                                    "JOB"
                                ),

                            title,

                            department,

                            openings,

                            skills,

                            status

                        })

                }
            );


        jobs.push({

            mongoId:
                result._id,

            id:
                result.jobId,

            title:
                result.title,

            department:
                result.department,

            openings:
                result.openings,

            skills:
                result.skills,

            status:
                result.status

        });


        closeJobModal();

        displayRecruitment();

        displayAnalytics();


        alert(
            "Job added successfully."
        );


    } catch (error) {

        console.error(
            "Add job error:",
            error
        );


        alert(
            "Failed to add job: " +
            error.message
        );

    }

}


function displayRecruitment() {

    const jobList =
        document.getElementById(
            "jobList"
        );


    const candidateList =
        document.getElementById(
            "candidateList"
        );


    if (jobList) {

        if (!jobs.length) {

            jobList.innerHTML =
                '<div class="empty-state">No job openings available.</div>';

        } else {

            jobList.innerHTML =
                "";


            jobs.forEach(
                function(job) {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "recruitment-item";


                    item.innerHTML = `

                        <div class="recruitment-info">

                            <strong>
                                ${escapeDashboardHTML(job.title)}
                            </strong>

                            <p>
                                ${escapeDashboardHTML(job.department)}
                                •
                                ${job.openings}
                                opening(s)
                            </p>

                            <small>
                                Skills:
                                ${escapeDashboardHTML(job.skills)}
                            </small>

                        </div>


                        <div class="recruitment-actions">

                            <span class="status-badge">
                                ${escapeDashboardHTML(job.status)}
                            </span>


                            <button
                                class="delete-btn"
                                onclick="deleteJob('${job.id}')"
                            >
                                Delete
                            </button>

                        </div>

                    `;


                    jobList.appendChild(
                        item
                    );

                }
            );

        }

    }


    if (candidateList) {

        if (!candidates.length) {

            candidateList.innerHTML =
                '<div class="empty-state">No candidates available.</div>';

        } else {

            candidateList.innerHTML =
                "";


            candidates.forEach(
                function(candidate) {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "recruitment-item";


                    item.innerHTML = `

                        <div class="recruitment-info">

                            <strong>
                                ${escapeDashboardHTML(candidate.name)}
                            </strong>

                            <p>
                                ${escapeDashboardHTML(candidate.position)}
                            </p>

                            <small>
                                Candidate ID:
                                ${escapeDashboardHTML(candidate.id)}
                            </small>

                        </div>


                        <div class="recruitment-actions">

                            <select
                                onchange="updateCandidateStatus('${candidate.id}', this.value)"
                            >

                                <option
                                    value="Applied"
                                    ${candidate.status === "Applied" ? "selected" : ""}
                                >
                                    Applied
                                </option>


                                <option
                                    value="Shortlisted"
                                    ${candidate.status === "Shortlisted" ? "selected" : ""}
                                >
                                    Shortlisted
                                </option>


                                <option
                                    value="Interview"
                                    ${candidate.status === "Interview" ? "selected" : ""}
                                >
                                    Interview
                                </option>


                                <option
                                    value="Hired"
                                    ${candidate.status === "Hired" ? "selected" : ""}
                                >
                                    Hired
                                </option>


                                <option
                                    value="Rejected"
                                    ${candidate.status === "Rejected" ? "selected" : ""}
                                >
                                    Rejected
                                </option>

                            </select>


                            <button
                                class="delete-btn"
                                onclick="deleteCandidate('${candidate.id}')"
                            >
                                Delete
                            </button>

                        </div>

                    `;


                    candidateList.appendChild(
                        item
                    );

                }
            );

        }

    }


    updateRecruitmentStats();

}


function updateRecruitmentStats() {

    updateText(
        "openJobsCount",

        jobs.filter(
            function(job) {

                return job.status ===
                    "Open";

            }
        ).length
    );


    updateText(
        "candidateCount",

        candidates.length
    );


    updateText(
        "shortlistedCount",

        candidates.filter(
            function(candidate) {

                return candidate.status ===
                    "Shortlisted";

            }
        ).length
    );


    updateText(
        "hiredCount",

        candidates.filter(
            function(candidate) {

                return candidate.status ===
                    "Hired";

            }
        ).length
    );

}


function openCandidateModal() {

    const modal =
        document.getElementById(
            "candidateModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

        modal.style.display =
            "flex";

    }

}


function closeCandidateModal() {

    const modal =
        document.getElementById(
            "candidateModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

        modal.style.display =
            "none";

    }


    const form =
        document.getElementById(
            "candidateForm"
        );


    if (form) {

        form.reset();

    }

}


async function addCandidate() {

    const name =
        document.getElementById(
            "candidateName"
        ).value.trim();


    const position =
        document.getElementById(
            "candidatePosition"
        ).value.trim();


    const status =
        document.getElementById(
            "candidateStatus"
        ).value;


    if (
        !name ||
        !position
    ) {

        alert(
            "Please fill all candidate details."
        );

        return;

    }


    try {

        const result =
            await getJSON(
                CANDIDATES_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            candidateId:
                                generateNextId(
                                    candidates,
                                    "CAN"
                                ),

                            name,

                            position,

                            status

                        })

                }
            );


        candidates.push({

            mongoId:
                result._id,

            id:
                result.candidateId,

            name:
                result.name,

            position:
                result.position,

            status:
                result.status

        });


        closeCandidateModal();

        displayRecruitment();

        displayAnalytics();


        alert(
            "Candidate added successfully."
        );


    } catch (error) {

        console.error(
            "Add candidate error:",
            error
        );


        alert(
            "Failed to add candidate: " +
            error.message
        );

    }

}


async function updateCandidateStatus(
    id,
    status
) {

    const candidate =
        candidates.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!candidate) {

        return;

    }


    try {

        const result =
            await getJSON(
                CANDIDATES_API +
                "/" +
                candidate.mongoId,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            status
                        })

                }
            );


        candidate.status =
            result.status;


        displayRecruitment();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Candidate update error:",
            error
        );


        alert(
            "Failed to update candidate status: " +
            error.message
        );

    }

}


async function deleteJob(id) {

    if (
        !confirm(
            "Delete this job opening?"
        )
    ) {

        return;

    }


    const job =
        jobs.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!job) {

        return;

    }


    try {

        await getJSON(
            JOBS_API +
            "/" +
            job.mongoId,
            {

                method:
                    "DELETE"

            }
        );


        jobs =
            jobs.filter(
                function(item) {

                    return item.id !== id;

                }
            );


        displayRecruitment();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Delete job error:",
            error
        );


        alert(
            "Failed to delete job: " +
            error.message
        );

    }

}


async function deleteCandidate(id) {

    if (
        !confirm(
            "Delete this candidate?"
        )
    ) {

        return;

    }


    const candidate =
        candidates.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!candidate) {

        return;

    }


    try {

        await getJSON(
            CANDIDATES_API +
            "/" +
            candidate.mongoId,
            {

                method:
                    "DELETE"

            }
        );


        candidates =
            candidates.filter(
                function(item) {

                    return item.id !== id;

                }
            );


        displayRecruitment();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Delete candidate error:",
            error
        );


        alert(
            "Failed to delete candidate: " +
            error.message
        );

    }

}


/* =================================
   ONBOARDING
================================= */

function showOnboarding(event) {

    if (event) {

        event.preventDefault();

    }


    hideAllSections();


    const section =
        document.getElementById(
            "onboardingSection"
        );


    if (section) {

        section.style.display =
            "block";

    }


    setActiveNav(
        "onboardingNav"
    );


    loadOnboardingFromBackend();

}


async function loadOnboardingFromBackend() {

    try {

        const data =
            await getJSON(
                ONBOARDING_API
            );


        onboarding =
            data.map(
                function(item) {

                    return {

                        mongoId:
                            item._id,

                        id:
                            item.onboardingId,

                        employee:
                            item.employee,

                        joiningDate:
                            item.joiningDate
                                ? String(
                                    item.joiningDate
                                ).split("T")[0]
                                : "",

                        department:
                            item.department,

                        documents:
                            item.documents,

                        tasks:
                            item.tasks,

                        status:
                            item.status

                    };

                }
            );


        displayOnboarding();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Onboarding loading error:",
            error
        );


        displayOnboarding();

    }

}


function openOnboardingModal() {

    const modal =
        document.getElementById(
            "onboardingModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

        modal.style.display =
            "flex";

    }

}


function closeOnboardingModal() {

    const modal =
        document.getElementById(
            "onboardingModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

        modal.style.display =
            "none";

    }


    const form =
        document.getElementById(
            "onboardingForm"
        );


    if (form) {

        form.reset();

    }

}


async function addOnboarding() {

    const employee =
        document.getElementById(
            "onboardingEmployee"
        ).value.trim();


    const joiningDate =
        document.getElementById(
            "joiningDate"
        ).value;


    const department =
        document.getElementById(
            "onboardingDepartment"
        ).value;


    const documents =
        document.getElementById(
            "onboardingDocuments"
        ).value.trim();


    const tasks =
        document.getElementById(
            "onboardingTasks"
        ).value.trim();


    const status =
        document.getElementById(
            "onboardingStatus"
        ).value;


    if (
        !employee ||
        !joiningDate ||
        !department ||
        !documents ||
        !tasks
    ) {

        alert(
            "Please fill all onboarding details."
        );

        return;

    }


    try {

        const result =
            await getJSON(
                ONBOARDING_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            onboardingId:
                                generateNextId(
                                    onboarding,
                                    "ONB"
                                ),

                            employee,

                            joiningDate,

                            department,

                            documents,

                            tasks,

                            status

                        })

                }
            );


        onboarding.push({

            mongoId:
                result._id,

            id:
                result.onboardingId,

            employee:
                result.employee,

            joiningDate:
                result.joiningDate
                    ? String(
                        result.joiningDate
                    ).split("T")[0]
                    : "",

            department:
                result.department,

            documents:
                result.documents,

            tasks:
                result.tasks,

            status:
                result.status

        });


        closeOnboardingModal();

        displayOnboarding();

        displayAnalytics();


        alert(
            "Onboarding record added successfully."
        );


    } catch (error) {

        console.error(
            "Add onboarding error:",
            error
        );


        alert(
            "Failed to add onboarding record: " +
            error.message
        );

    }

}


function displayOnboarding() {

    const list =
        document.getElementById(
            "onboardingList"
        );


    if (!list) {

        return;

    }


    if (!onboarding.length) {

        list.innerHTML =
            '<div class="empty-state">No onboarding records available.</div>';

        updateOnboardingStats();

        return;

    }


    list.innerHTML =
        "";


    onboarding.forEach(
        function(item) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "onboarding-item";


            row.innerHTML = `

                <div class="onboarding-info">

                    <strong>
                        ${escapeDashboardHTML(
                            item.employee
                        )}
                    </strong>


                    <p>
                        ${escapeDashboardHTML(
                            item.department
                        )}
                        • Joining:
                        ${escapeDashboardHTML(
                            item.joiningDate
                        )}
                    </p>


                    <small>
                        Documents:
                        ${escapeDashboardHTML(
                            item.documents
                        )}
                    </small>


                    <small>
                        Tasks:
                        ${escapeDashboardHTML(
                            item.tasks
                        )}
                    </small>

                </div>


                <div class="onboarding-actions">

                    <span class="status-badge">
                        ${escapeDashboardHTML(
                            item.status
                        )}
                    </span>


                    <select
                        onchange="updateOnboardingStatus('${item.id}', this.value)"
                    >

                        <option
                            value="Pending"
                            ${item.status === "Pending" ? "selected" : ""}
                        >
                            Pending
                        </option>


                        <option
                            value="In Progress"
                            ${item.status === "In Progress" ? "selected" : ""}
                        >
                            In Progress
                        </option>


                        <option
                            value="Completed"
                            ${item.status === "Completed" ? "selected" : ""}
                        >
                            Completed
                        </option>

                    </select>


                    <button
                        class="delete-btn"
                        onclick="deleteOnboarding('${item.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            list.appendChild(
                row
            );

        }
    );


    updateOnboardingStats();

}


async function updateOnboardingStatus(
    id,
    status
) {

    const record =
        onboarding.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!record) {

        return;

    }


    try {

        const result =
            await getJSON(
                ONBOARDING_API +
                "/" +
                record.mongoId,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            status
                        })

                }
            );


        record.status =
            result.status;


        displayOnboarding();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Onboarding update error:",
            error
        );


        alert(
            "Failed to update onboarding status: " +
            error.message
        );

    }

}


async function deleteOnboarding(id) {

    if (
        !confirm(
            "Delete this onboarding record?"
        )
    ) {

        return;

    }


    const record =
        onboarding.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!record) {

        return;

    }


    try {

        await getJSON(
            ONBOARDING_API +
            "/" +
            record.mongoId,
            {

                method:
                    "DELETE"

            }
        );


        onboarding =
            onboarding.filter(
                function(item) {

                    return item.id !== id;

                }
            );


        displayOnboarding();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Onboarding delete error:",
            error
        );


        alert(
            "Failed to delete onboarding record: " +
            error.message
        );

    }

}


function updateOnboardingStats() {

    updateText(
        "totalOnboardingCount",
        onboarding.length
    );


    updateText(
        "onboardingProgressCount",

        onboarding.filter(
            function(item) {

                return item.status ===
                    "In Progress";

            }
        ).length
    );


    updateText(
        "onboardingCompletedCount",

        onboarding.filter(
            function(item) {

                return item.status ===
                    "Completed";

            }
        ).length
    );


    updateText(
        "onboardingPendingCount",

        onboarding.filter(
            function(item) {

                return item.status ===
                    "Pending";

            }
        ).length
    );

}


/* =================================
   PAYROLL
================================= */

function showPayroll(event) {

    if (event) {

        event.preventDefault();

    }


    hideAllSections();


    const section =
        document.getElementById(
            "payrollSection"
        );


    if (section) {

        section.style.display =
            "block";

    }


    setActiveNav(
        "payrollNav"
    );


    loadPayrollFromBackend();

}


async function loadPayrollFromBackend() {

    try {

        const data =
            await getJSON(
                PAYROLL_API
            );


        payroll =
            data.map(
                function(record) {

                    return {

                        mongoId:
                            record._id,

                        id:
                            record.payrollId,

                        employee:
                            record.employee,

                        month:
                            record.month,

                        basicSalary:
                            record.basicSalary,

                        allowances:
                            record.allowances,

                        deductions:
                            record.deductions,

                        netSalary:
                            record.netSalary,

                        status:
                            record.status

                    };

                }
            );


        displayPayroll();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Payroll loading error:",
            error
        );


        displayPayroll();

    }

}


function openPayrollModal() {

    const modal =
        document.getElementById(
            "payrollModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

        modal.style.display =
            "flex";

    }

}


function closePayrollModal() {

    const modal =
        document.getElementById(
            "payrollModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

        modal.style.display =
            "none";

    }


    const form =
        document.getElementById(
            "payrollForm"
        );


    if (form) {

        form.reset();

    }

}


async function addPayroll() {

    const employee =
        document.getElementById(
            "payrollEmployee"
        ).value.trim();


    const month =
        document.getElementById(
            "payrollMonth"
        ).value;


    const basicSalary =
        Number(
            document.getElementById(
                "basicSalary"
            ).value
        );


    const allowances =
        Number(
            document.getElementById(
                "allowances"
            ).value
        );


    const deductions =
        Number(
            document.getElementById(
                "deductions"
            ).value
        );


    const status =
        document.getElementById(
            "payrollStatus"
        ).value;


    if (
        !employee ||
        !month ||
        basicSalary < 0 ||
        allowances < 0 ||
        deductions < 0
    ) {

        alert(
            "Please enter valid payroll details."
        );

        return;

    }


    const netSalary =
        basicSalary +
        allowances -
        deductions;


    try {

        const result =
            await getJSON(
                PAYROLL_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            payrollId:
                                generateNextId(
                                    payroll,
                                    "PAY"
                                ),

                            employee,

                            month,

                            basicSalary,

                            allowances,

                            deductions,

                            netSalary,

                            status

                        })

                }
            );


        payroll.push({

            mongoId:
                result._id,

            id:
                result.payrollId,

            employee:
                result.employee,

            month:
                result.month,

            basicSalary:
                result.basicSalary,

            allowances:
                result.allowances,

            deductions:
                result.deductions,

            netSalary:
                result.netSalary,

            status:
                result.status

        });


        closePayrollModal();

        displayPayroll();

        displayAnalytics();


        // Refresh Dashboard payroll data
        loadDashboardData();


        alert(
            "Payroll record added successfully."
        );


    } catch (error) {

        console.error(
            "Add payroll error:",
            error
        );


        alert(
            "Failed to add payroll record: " +
            error.message
        );

    }

}


function displayPayroll() {

    const list =
        document.getElementById(
            "payrollList"
        );


    if (!list) {

        return;

    }


    if (!payroll.length) {

        list.innerHTML =
            '<div class="empty-state">No payroll records available.</div>';

        updatePayrollStats();

        return;

    }


    list.innerHTML =
        "";


    payroll.forEach(
        function(record) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "payroll-item";


            row.innerHTML = `

                <div class="payroll-info">

                    <strong>
                        ${escapeDashboardHTML(
                            record.employee
                        )}
                    </strong>


                    <p>
                        ${escapeDashboardHTML(
                            record.month
                        )}
                    </p>


                    <small>
                        Basic:
                        ${formatCurrency(
                            record.basicSalary
                        )}
                    </small>


                    <small>
                        Allowances:
                        ${formatCurrency(
                            record.allowances
                        )}
                    </small>


                    <small>
                        Deductions:
                        ${formatCurrency(
                            record.deductions
                        )}
                    </small>


                    <small>
                        Net:
                        ${formatCurrency(
                            record.netSalary
                        )}
                    </small>

                </div>


                <div class="payroll-actions">

                    <span class="status-badge">
                        ${escapeDashboardHTML(
                            record.status
                        )}
                    </span>


                    <select
                        onchange="updatePayrollStatus('${record.id}', this.value)"
                    >

                        <option
                            value="Pending"
                            ${record.status === "Pending" ? "selected" : ""}
                        >
                            Pending
                        </option>


                        <option
                            value="Processed"
                            ${record.status === "Processed" ? "selected" : ""}
                        >
                            Processed
                        </option>

                    </select>


                    <button
                        class="delete-btn"
                        onclick="deletePayroll('${record.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            list.appendChild(
                row
            );

        }
    );


    updatePayrollStats();

}


async function updatePayrollStatus(
    id,
    status
) {

    const record =
        payroll.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!record) {

        return;

    }


    try {

        const result =
            await getJSON(
                PAYROLL_API +
                "/" +
                record.mongoId,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            status
                        })

                }
            );


        record.status =
            result.status;


        displayPayroll();

        displayAnalytics();

        loadDashboardData();


    } catch (error) {

        console.error(
            "Payroll update error:",
            error
        );


        alert(
            "Failed to update payroll status: " +
            error.message
        );

    }

}


async function deletePayroll(id) {

    if (
        !confirm(
            "Delete this payroll record?"
        )
    ) {

        return;

    }


    const record =
        payroll.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!record) {

        return;

    }


    try {

        await getJSON(
            PAYROLL_API +
            "/" +
            record.mongoId,
            {

                method:
                    "DELETE"

            }
        );


        payroll =
            payroll.filter(
                function(item) {

                    return item.id !== id;

                }
            );


        displayPayroll();

        displayAnalytics();

        loadDashboardData();


    } catch (error) {

        console.error(
            "Payroll delete error:",
            error
        );


        alert(
            "Failed to delete payroll record: " +
            error.message
        );

    }

}


function updatePayrollStats() {

    const total =
        payroll.reduce(
            function(sum, record) {

                return sum +
                    (
                        Number(
                            record.netSalary
                        ) || 0
                    );

            },
            0
        );


    updateText(
        "totalPayrollAmount",
        formatCurrency(total)
    );


    updateText(
        "processedPayrollCount",

        payroll.filter(
            function(record) {

                return record.status ===
                    "Processed";

            }
        ).length
    );


    updateText(
        "pendingPayrollCount",

        payroll.filter(
            function(record) {

                return record.status ===
                    "Pending";

            }
        ).length
    );


    updateText(
        "payrollRecordCount",
        payroll.length
    );

}


/* =================================
   PERFORMANCE
================================= */

function showPerformance(event) {

    if (event) {

        event.preventDefault();

    }


    hideAllSections();


    const section =
        document.getElementById(
            "performanceSection"
        );


    if (section) {

        section.style.display =
            "block";

    }


    setActiveNav(
        "performanceNav"
    );


    loadPerformanceFromBackend();

}


async function loadPerformanceFromBackend() {

    try {

        const data =
            await getJSON(
                PERFORMANCE_API
            );


        performance =
            data.map(
                function(item) {

                    return {

                        mongoId:
                            item._id,

                        id:
                            item.performanceId,

                        employee:
                            item.employee,

                        period:
                            item.period,

                        rating:
                            item.rating,

                        goal:
                            item.goal,

                        progress:
                            item.progress,

                        feedback:
                            item.feedback,

                        status:
                            item.status

                    };

                }
            );


        displayPerformance();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Performance loading error:",
            error
        );


        performance = [];

        displayPerformance();

    }

}


function openPerformanceModal() {

    const modal =
        document.getElementById(
            "performanceModal"
        );


    if (modal) {

        modal.classList.add(
            "active"
        );

        modal.style.display =
            "flex";

    }

}


function closePerformanceModal() {

    const modal =
        document.getElementById(
            "performanceModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

        modal.style.display =
            "none";

    }


    const form =
        document.getElementById(
            "performanceForm"
        );


    if (form) {

        form.reset();

    }

}


async function addPerformanceReview() {

    const employee =
        document.getElementById(
            "performanceEmployee"
        ).value.trim();


    const period =
        document.getElementById(
            "reviewPeriod"
        ).value.trim();


    const rating =
        Number(
            document.getElementById(
                "performanceRating"
            ).value
        );


    const goal =
        document.getElementById(
            "performanceGoal"
        ).value.trim();


    const progress =
        Number(
            document.getElementById(
                "goalProgress"
            ).value
        );


    const feedback =
        document.getElementById(
            "performanceFeedback"
        ).value.trim();


    const status =
        document.getElementById(
            "performanceStatus"
        ).value;


    if (
        !employee ||
        !period ||
        !rating ||
        rating < 1 ||
        rating > 5 ||
        !goal ||
        !feedback ||
        progress < 0 ||
        progress > 100
    ) {

        alert(
            "Please fill all performance details correctly."
        );

        return;

    }


    try {

        const result =
            await getJSON(
                PERFORMANCE_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            performanceId:
                                generateNextId(
                                    performance,
                                    "PERF"
                                ),

                            employee,

                            period,

                            rating,

                            goal,

                            progress,

                            feedback,

                            status

                        })

                }
            );


        performance.push({

            mongoId:
                result._id,

            id:
                result.performanceId,

            employee:
                result.employee,

            period:
                result.period,

            rating:
                result.rating,

            goal:
                result.goal,

            progress:
                result.progress,

            feedback:
                result.feedback,

            status:
                result.status

        });


        closePerformanceModal();

        displayPerformance();

        displayAnalytics();


        alert(
            "Performance review added successfully."
        );


    } catch (error) {

        console.error(
            "Add performance error:",
            error
        );


        alert(
            "Failed to add performance review: " +
            error.message
        );

    }

}


function displayPerformance() {

    const list =
        document.getElementById(
            "performanceList"
        );


    if (!list) {

        return;

    }


    if (!performance.length) {

        list.innerHTML =
            '<div class="empty-state">No performance reviews available.</div>';

        updatePerformanceStats();

        return;

    }


    list.innerHTML =
        "";


    performance.forEach(
        function(review) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "performance-item";


            row.innerHTML = `

                <div class="performance-info">

                    <strong>
                        ${escapeDashboardHTML(
                            review.employee
                        )}
                    </strong>


                    <p>
                        ${escapeDashboardHTML(
                            review.period
                        )}
                    </p>


                    <small>
                        Goal:
                        ${escapeDashboardHTML(
                            review.goal
                        )}
                    </small>


                    <small>
                        Progress:
                        ${Number(
                            review.progress
                        )}%
                    </small>


                    <small>
                        Feedback:
                        ${escapeDashboardHTML(
                            review.feedback
                        )}
                    </small>

                </div>


                <div class="performance-actions">

                    <span class="status-badge">
                        ${escapeDashboardHTML(
                            review.status
                        )}
                    </span>


                    <strong>
                        Rating:
                        ${review.rating}/5
                    </strong>


                    <select
                        onchange="updatePerformanceStatus('${review.id}', this.value)"
                    >

                        <option
                            value="In Progress"
                            ${review.status === "In Progress" ? "selected" : ""}
                        >
                            In Progress
                        </option>


                        <option
                            value="Completed"
                            ${review.status === "Completed" ? "selected" : ""}
                        >
                            Completed
                        </option>

                    </select>


                    <button
                        class="delete-btn"
                        onclick="deletePerformance('${review.id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            list.appendChild(
                row
            );

        }
    );


    updatePerformanceStats();

}


async function updatePerformanceStatus(
    id,
    status
) {

    const review =
        performance.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!review) {

        return;

    }


    try {

        const result =
            await getJSON(
                PERFORMANCE_API +
                "/" +
                review.mongoId,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            status
                        })

                }
            );


        review.status =
            result.status;


        displayPerformance();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Performance update error:",
            error
        );


        alert(
            "Failed to update performance status: " +
            error.message
        );


        displayPerformance();

    }

}


async function deletePerformance(id) {

    if (
        !confirm(
            "Delete this performance review?"
        )
    ) {

        return;

    }


    const review =
        performance.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!review) {

        return;

    }


    try {

        await getJSON(
            PERFORMANCE_API +
            "/" +
            review.mongoId,
            {

                method:
                    "DELETE"

            }
        );


        performance =
            performance.filter(
                function(item) {

                    return item.id !== id;

                }
            );


        displayPerformance();

        displayAnalytics();


    } catch (error) {

        console.error(
            "Performance delete error:",
            error
        );


        alert(
            "Failed to delete performance review: " +
            error.message
        );

    }

}


function updatePerformanceStats() {

    const total =
        performance.length;


    const completed =
        performance.filter(
            function(review) {

                return review.status ===
                    "Completed";

            }
        ).length;


    const progress =
        performance.filter(
            function(review) {

                return review.status ===
                    "In Progress";

            }
        ).length;


    const totalRating =
        performance.reduce(
            function(sum, review) {

                return sum +
                    (
                        Number(
                            review.rating
                        ) || 0
                    );

            },
            0
        );


    const average =
        total
            ? (
                totalRating /
                total
            ).toFixed(1)
            : "0";


    updateText(
        "totalPerformanceReviews",
        total
    );


    updateText(
        "averagePerformanceRating",
        average
    );


    updateText(
        "completedPerformanceGoals",
        completed
    );


    updateText(
        "progressPerformanceGoals",
        progress
    );

}


/* =================================
   ANALYTICS
================================= */

function showAnalytics(event) {

    if (event) {

        event.preventDefault();

    }


    hideAllSections();


    const section =
        document.getElementById(
            "analyticsSection"
        );


    if (section) {

        section.style.display =
            "block";

    }


    setActiveNav(
        "analyticsNav"
    );


    displayAnalytics();

}


async function displayAnalytics() {

    try {

        const data =
            await getJSON(
                ANALYTICS_API
            );


        const employeesData =
            data.employees ||
            {};


        const recruitment =
            data.recruitment ||
            {};


        const onboardingData =
            data.onboarding ||
            {};


        const payrollData =
            data.payroll ||
            {};


        const performanceData =
            data.performance ||
            {};


        const totalEmployees =
            Number(
                employeesData.total
            ) || 0;


        const totalNewHires =
            Number(
                onboardingData.total
            ) || 0;


        const openJobs =
            Number(
                recruitment.openJobs
            ) || 0;


        updateText(
            "analyticsEmployees",
            totalEmployees
        );


        updateText(
            "analyticsNewHires",
            totalNewHires
        );


        updateText(
            "analyticsOpenJobs",
            openJobs
        );


        const totalPayroll =
            Number(
                payrollData.totalNetPayroll
            ) || 0;


        updateText(
            "analyticsPayroll",
            formatCurrency(
                totalPayroll
            )
        );


        updateText(
            "analyticsPayrollRecords",
            Number(
                payrollData.totalRecords
            ) || 0
        );


        updateText(
            "analyticsPayrollProcessed",
            Number(
                payrollData.processed
            ) || 0
        );


        updateText(
            "analyticsPayrollPending",
            Number(
                payrollData.pending
            ) || 0
        );


        updateText(
            "analyticsNetPayroll",
            formatCurrency(
                totalPayroll
            )
        );


        const averageRating =
            Number(
                performanceData.averageRating
            ) || 0;


        const totalReviews =
            Number(
                performanceData.totalReviews
            ) || 0;


        const completedGoals =
            Number(
                performanceData.completedGoals
            ) || 0;


        const progressGoals =
            Number(
                performanceData.inProgressGoals
            ) || 0;


        updateText(
            "analyticsRating",
            averageRating
        );


        updateText(
            "analyticsAvgRating",
            averageRating +
            " / 5"
        );


        updateText(
            "analyticsGoals",
            completedGoals
        );


        updateText(
            "analyticsReviews",
            totalReviews
        );


        updateText(
            "analyticsCompletedGoals",
            completedGoals
        );


        updateText(
            "analyticsProgressGoals",
            progressGoals
        );


        const statuses =
            recruitment.statuses ||
            {};


        updateText(
            "analyticsApplied",
            Number(
                statuses.Applied
            ) || 0
        );


        updateText(
            "analyticsShortlisted",
            Number(
                statuses.Shortlisted
            ) || 0
        );


        updateText(
            "analyticsInterview",
            Number(
                statuses.Interview
            ) || 0
        );


        updateText(
            "analyticsHired",
            Number(
                statuses.Hired
            ) || 0
        );


        updateText(
            "analyticsRejected",
            Number(
                statuses.Rejected
            ) || 0
        );


        const onboardingStatuses =
            onboardingData.statuses ||
            {};


        const completedOnboarding =
            Number(
                onboardingStatuses.Completed
            ) || 0;


        const progressOnboarding =
            Number(
                onboardingStatuses[
                    "In Progress"
                ]
            ) || 0;


        const pendingOnboarding =
            Number(
                onboardingStatuses.Pending
            ) || 0;


        const onboardingTotal =
            Number(
                onboardingData.total
            ) || 0;


        const onboardingBase =
            onboardingTotal || 1;


        updateText(
            "analyticsOnboardingCompleted",
            completedOnboarding
        );


        updateText(
            "analyticsOnboardingProgress",
            progressOnboarding
        );


        updateText(
            "analyticsOnboardingPending",
            pendingOnboarding
        );


        setWidth(
            "onboardingCompletedBar",
            Math.round(
                (
                    completedOnboarding /
                    onboardingBase
                ) * 100
            )
        );


        setWidth(
            "onboardingProgressBar",
            Math.round(
                (
                    progressOnboarding /
                    onboardingBase
                ) * 100
            )
        );


        setWidth(
            "onboardingPendingBar",
            Math.round(
                (
                    pendingOnboarding /
                    onboardingBase
                ) * 100
            )
        );


        const departments =
            employeesData.departments ||
            {};


        displayDepartmentAnalytics(
            departments,
            totalEmployees
        );


        const totalCandidates =
            Number(
                recruitment.totalCandidates
            ) || 0;


        const hiredCandidates =
            Number(
                statuses.Hired
            ) || 0;


        const departmentCount =
            Object.keys(
                departments
            ).length;


        updateText(
            "workforceSummary",

            totalEmployees +
            " employees across " +
            departmentCount +
            " departments."
        );


        updateText(
            "recruitmentSummary",

            hiredCandidates +
            " candidates hired from " +
            totalCandidates +
            " total applicants."
        );


        updateText(
            "payrollSummary",

            formatCurrency(
                totalPayroll
            ) +
            " total recorded net payroll."
        );


        updateText(
            "performanceSummary",

            totalReviews +
            " reviews with an average rating of " +
            averageRating +
            " / 5."
        );


    } catch (error) {

        console.error(
            "Analytics loading error:",
            error
        );

    }

}


function displayDepartmentAnalytics(
    departments,
    totalEmployees
) {

    const container =
        document.getElementById(
            "departmentAnalytics"
        );


    if (!container) {

        return;

    }


    const names =
        Object.keys(
            departments || {}
        );


    if (!names.length) {

        container.innerHTML =
            '<div class="analytics-empty">No employee data available.</div>';

        return;

    }


    const total =
        Number(
            totalEmployees
        ) || 1;


    container.innerHTML =
        "";


    names.forEach(
        function(department) {

            const count =
                Number(
                    departments[
                        department
                    ]
                ) || 0;


            const percentage =
                Math.round(
                    (
                        count /
                        total
                    ) * 100
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "analytics-bar-row";


            row.innerHTML = `

                <div class="analytics-bar-info">

                    <span>
                        ${escapeDashboardHTML(
                            department
                        )}
                    </span>


                    <strong>
                        ${count}
                    </strong>

                </div>


                <div class="analytics-bar-track">

                    <div
                        class="analytics-bar-fill"
                        style="width:${percentage}%"
                    ></div>

                </div>


                <small>
                    ${percentage}%
                </small>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* =================================
   YEAR FILTER
================================= */

function setupYearFilter() {

    const filter =
        document.getElementById(
            "yearFilter"
        );


    if (!filter) {

        return;

    }


    filter.addEventListener(
        "change",
        function() {

            console.log(
                "Dashboard period:",
                filter.value
            );

        }
    );

}


/* =================================
   AUTHENTICATION
================================= */

function getAuthToken() {

    return (
        localStorage.getItem(
            "hrgeniusToken"
        ) ||

        sessionStorage.getItem(
            "hrgeniusToken"
        )
    );

}


function clearAuthData() {

    localStorage.removeItem(
        "hrgeniusToken"
    );


    localStorage.removeItem(
        "hrgeniusUser"
    );


    localStorage.removeItem(
        "hrgeniusLoggedIn"
    );


    sessionStorage.removeItem(
        "hrgeniusToken"
    );


    sessionStorage.removeItem(
        "hrgeniusUser"
    );

}


async function protectDashboard() {

    const token =
        getAuthToken();


    // No token
    if (!token) {

        window.location.href =
            "index.html";

        return false;

    }


    try {

        const response =
            await fetch(
                AUTH_API + "/me",
                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }
            );


        if (!response.ok) {

            clearAuthData();

            window.location.href =
                "index.html";

            return false;

        }


        const data =
            await response.json();


        if (data.user) {

            localStorage.setItem(
                "hrgeniusUser",
                JSON.stringify(
                    data.user
                )
            );

        }


        return true;


    } catch (error) {

        console.error(
            "Dashboard authentication error:",
            error
        );


        clearAuthData();

        window.location.href =
            "index.html";


        return false;

    }

}


/* =================================
   LOGOUT
================================= */

function logout() {

    clearAuthData();

}


/* =================================
   MODAL BACKDROP
================================= */

window.addEventListener(
    "click",
    function(event) {

        [
            "jobModal",
            "candidateModal",
            "onboardingModal",
            "payrollModal",
            "performanceModal"
        ].forEach(
            function(id) {

                const modal =
                    document.getElementById(
                        id
                    );


                if (
                    modal &&
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );


                    modal.style.display =
                        "none";

                }

            }
        );

    }
);


/* =================================
   INITIALIZE
================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        const authenticated =
            await protectDashboard();


        if (!authenticated) {

            return;

        }


        displayPerformance();

        displayAnalytics();

        setupYearFilter();

        loadRecruitmentFromBackend();

        loadOnboardingFromBackend();

        loadPayrollFromBackend();

        loadPerformanceFromBackend();

        showDashboard(null);

    }
);