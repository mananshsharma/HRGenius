// ==========================================
// HRGENIUS - EMPLOYEE MANAGEMENT
// BACKEND + JWT VERSION
// ==========================================

const EMPLOYEES_API =
    "http://localhost:5000/api/employees";

let employees = [];


// ==========================================
// AUTH TOKEN
// ==========================================

function getAuthToken() {

    return (
        localStorage.getItem("hrgeniusToken") ||
        sessionStorage.getItem("hrgeniusToken")
    );

}


// ==========================================
// AUTHENTICATED API REQUEST
// ==========================================

async function apiRequest(url, options = {}) {

    const token = getAuthToken();

    if (!token) {

        window.location.href =
            "index.html";

        throw new Error(
            "Authentication required"
        );
    }

    const headers = {
        ...(options.headers || {}),
        "Content-Type":
            "application/json",
        "Authorization":
            "Bearer " + token
    };

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
        result = await response.json();
    } catch (_) {
    }

    if (response.status === 401) {

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

        window.location.href =
            "index.html";

        throw new Error(
            "Session expired"
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


// ==========================================
// SAVE LOCAL CACHE
// ==========================================

function saveEmployeesCache() {

    localStorage.setItem(
        "hrgeniusEmployees",
        JSON.stringify(employees)
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// ==========================================
// LOAD EMPLOYEES FROM BACKEND
// ==========================================

async function loadEmployees() {

    try {

        const data =
            await apiRequest(
                EMPLOYEES_API
            );

        employees =
            Array.isArray(data)
                ? data.map(function(employee) {

                    return {

                        mongoId:
                            employee._id,

                        id:
                            employee.employeeId,

                        name:
                            employee.name,

                        email:
                            employee.email,

                        department:
                            employee.department,

                        position:
                            employee.position,

                        status:
                            employee.status

                    };

                })
                : [];

        saveEmployeesCache();

        refreshEmployeeList();

    } catch (error) {

        console.error(
            "Employee loading error:",
            error
        );

        const tableBody =
            document.getElementById(
                "employeeTableBody"
            );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="empty-state"
                    >
                        Failed to load employee data.
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// DISPLAY EMPLOYEES
// ==========================================

function displayEmployees(
    list = employees
) {

    const tableBody =
        document.getElementById(
            "employeeTableBody"
        );

    const count =
        document.getElementById(
            "employeeCount"
        );

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    if (count) {

        count.textContent =
            `${list.length} Employees`;

    }

    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-state"
                >
                    No employees found
                </td>
            </tr>
        `;

        return;
    }

    list.forEach(
        function(employee) {

            const row =
                document.createElement(
                    "tr"
                );

            const statusClass =
                String(
                    employee.status || ""
                )
                    .toLowerCase()
                    .replaceAll(
                        " ",
                        "-"
                    );

            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            employee.id
                        )}
                    </strong>
                </td>

                <td>

                    <div class="employee-name">

                        <div class="employee-avatar">

                            ${escapeHTML(
                                employee.name
                                    ? employee.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "?"
                            )}

                        </div>

                        <span>
                            ${escapeHTML(
                                employee.name
                            )}
                        </span>

                    </div>

                </td>

                <td>
                    ${escapeHTML(
                        employee.email
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        employee.department
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        employee.position
                    )}
                </td>

                <td>

                    <span
                        class="status-badge ${statusClass}"
                    >
                        ${escapeHTML(
                            employee.status
                        )}
                    </span>

                </td>

                <td>

                    <div class="table-actions">

                        <button
                            class="icon-btn edit"
                            onclick="
                                editEmployee(
                                    '${employee.id}'
                                )
                            "
                            title="Edit"
                        >
                            ✏️
                        </button>

                        <button
                            class="icon-btn delete"
                            onclick="
                                deleteEmployee(
                                    '${employee.id}'
                                )
                            "
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;

            tableBody.appendChild(row);

        }
    );

}


// ==========================================
// FILTER + SEARCH
// ==========================================

function refreshEmployeeList() {

    const searchInput =
        document.getElementById(
            "employeeSearch"
        );

    const departmentFilter =
        document.getElementById(
            "departmentFilter"
        );

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";

    const department =
        departmentFilter
            ? departmentFilter.value
            : "All";

    const filtered =
        employees.filter(
            function(employee) {

                const name =
                    String(
                        employee.name || ""
                    ).toLowerCase();

                const email =
                    String(
                        employee.email || ""
                    ).toLowerCase();

                const empDepartment =
                    String(
                        employee.department || ""
                    ).toLowerCase();

                const position =
                    String(
                        employee.position || ""
                    ).toLowerCase();

                const employeeId =
                    String(
                        employee.id || ""
                    ).toLowerCase();

                const matchesSearch =
                    name.includes(search) ||
                    email.includes(search) ||
                    empDepartment.includes(search) ||
                    position.includes(search) ||
                    employeeId.includes(search);

                const matchesDepartment =
                    department === "All" ||
                    employee.department === department;

                return (
                    matchesSearch &&
                    matchesDepartment
                );

            }
        );

    displayEmployees(
        filtered
    );

}


// ==========================================
// GENERATE EMPLOYEE ID
// ==========================================

function generateNextEmployeeId() {

    let maxNumber = 0;

    employees.forEach(
        function(employee) {

            const match =
                String(
                    employee.id || ""
                ).match(
                    /^EMP(\d+)$/
                );

            if (match) {

                maxNumber =
                    Math.max(
                        maxNumber,
                        Number(
                            match[1]
                        )
                    );

            }

        }
    );

    return (
        "EMP" +
        String(
            maxNumber + 1
        ).padStart(
            3,
            "0"
        )
    );

}


// ==========================================
// ADD EMPLOYEE
// ==========================================

async function addEmployee() {

    const name =
        document.getElementById(
            "employeeName"
        ).value.trim();

    const email =
        document.getElementById(
            "employeeEmail"
        ).value.trim();

    const department =
        document.getElementById(
            "employeeDepartment"
        ).value;

    const position =
        document.getElementById(
            "employeePosition"
        ).value.trim();

    const status =
        document.getElementById(
            "employeeStatus"
        ).value;

    if (
        !name ||
        !email ||
        !department ||
        !position
    ) {

        alert(
            "Please fill all employee details."
        );

        return;
    }

    const newEmployee = {

        employeeId:
            generateNextEmployeeId(),

        name,

        email,

        department,

        position,

        status

    };

    try {

        const result =
            await apiRequest(
                EMPLOYEES_API,
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            newEmployee
                        )
                }
            );

        employees.push({

            mongoId:
                result._id,

            id:
                result.employeeId,

            name:
                result.name,

            email:
                result.email,

            department:
                result.department,

            position:
                result.position,

            status:
                result.status

        });

        saveEmployeesCache();

        refreshEmployeeList();

        clearEmployeeForm();

        closeEmployeeModal();

        alert(
            "Employee added successfully!"
        );

    } catch (error) {

        console.error(
            "Add employee error:",
            error
        );

        alert(
            "Failed to add employee: " +
            error.message
        );

    }

}


// ==========================================
// DELETE EMPLOYEE
// ==========================================

async function deleteEmployee(id) {

    const employee =
        employees.find(
            function(emp) {

                return emp.id === id;

            }
        );

    if (!employee) {
        return;
    }

    const confirmed =
        confirm(
            `Delete ${employee.name}?`
        );

    if (!confirmed) {
        return;
    }

    if (!employee.mongoId) {

        alert(
            "Employee database ID is missing."
        );

        return;
    }

    try {

        await apiRequest(
            EMPLOYEES_API +
            "/" +
            employee.mongoId,
            {
                method: "DELETE"
            }
        );

        employees =
            employees.filter(
                function(emp) {

                    return emp.id !== id;

                }
            );

        saveEmployeesCache();

        refreshEmployeeList();

        alert(
            "Employee deleted successfully!"
        );

    } catch (error) {

        console.error(
            "Delete employee error:",
            error
        );

        alert(
            "Failed to delete employee: " +
            error.message
        );

    }

}


// ==========================================
// EDIT EMPLOYEE
// ==========================================

async function editEmployee(id) {

    const employee =
        employees.find(
            function(emp) {

                return emp.id === id;

            }
        );

    if (!employee) {
        return;
    }

    const newName =
        prompt(
            "Employee Name:",
            employee.name
        );

    if (newName === null) {
        return;
    }

    const newEmail =
        prompt(
            "Email:",
            employee.email
        );

    if (newEmail === null) {
        return;
    }

    const newDepartment =
        prompt(
            "Department (IT / HR / Finance / Sales / Marketing):",
            employee.department
        );

    if (newDepartment === null) {
        return;
    }

    const newPosition =
        prompt(
            "Position:",
            employee.position
        );

    if (newPosition === null) {
        return;
    }

    const newStatus =
        prompt(
            "Status (Active / On Leave / Inactive):",
            employee.status
        );

    if (newStatus === null) {
        return;
    }

    const updatedData = {

        name:
            newName.trim(),

        email:
            newEmail.trim(),

        department:
            newDepartment.trim(),

        position:
            newPosition.trim(),

        status:
            newStatus.trim()

    };

    if (
        !employee.mongoId
    ) {

        alert(
            "Employee database ID is missing."
        );

        return;
    }

    try {

        const result =
            await apiRequest(
                EMPLOYEES_API +
                "/" +
                employee.mongoId,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            updatedData
                        )
                }
            );

        employee.name =
            result.name;

        employee.email =
            result.email;

        employee.department =
            result.department;

        employee.position =
            result.position;

        employee.status =
            result.status;

        saveEmployeesCache();

        refreshEmployeeList();

        alert(
            "Employee updated successfully!"
        );

    } catch (error) {

        console.error(
            "Edit employee error:",
            error
        );

        alert(
            "Failed to update employee: " +
            error.message
        );

    }

}


// ==========================================
// SEARCH
// ==========================================

function searchEmployees() {

    refreshEmployeeList();

}


// ==========================================
// DEPARTMENT FILTER
// ==========================================

function filterDepartment() {

    refreshEmployeeList();

}


// ==========================================
// OPEN MODAL
// ==========================================

function openEmployeeModal() {

    const modal =
        document.getElementById(
            "employeeModal"
        );

    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeEmployeeModal() {

    const modal =
        document.getElementById(
            "employeeModal"
        );

    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


// ==========================================
// CLEAR FORM
// ==========================================

function clearEmployeeForm() {

    const form =
        document.getElementById(
            "employeeForm"
        );

    if (form) {

        form.reset();

    }

}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        await loadEmployees();

        const search =
            document.getElementById(
                "employeeSearch"
            );

        if (search) {

            search.addEventListener(
                "input",
                searchEmployees
            );

        }

        const filter =
            document.getElementById(
                "departmentFilter"
            );

        if (filter) {

            filter.addEventListener(
                "change",
                filterDepartment
            );

        }

    }
);