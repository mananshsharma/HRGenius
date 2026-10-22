
[![HRGenius CI](https://github.com/mananshsharma/HRGenius/actions/workflows/ci.yml/badge.svg)](https://github.com/mananshsharma/HRGenius/actions/workflows/ci.yml)

# HRGenius — Human Resource Management System

HRGenius is a web-based Human Resource Management System (HRMS) developed as a college project. It provides a centralized interface for managing common human resource activities, helping simplify employee administration and recruitment workflows.

## Features

- **User Authentication:** Secure login using JSON Web Tokens (JWT).
- **Employee Management:** Manage employee records and information.
- **Recruitment Management:** Manage job openings and candidate records.
- **Employee Onboarding:** Organize employee onboarding information.
- **Payroll Management:** Manage payroll records.
- **Performance Management:** Maintain employee performance information.
- **HR Analytics:** Display HR-related statistics and visualizations.

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT)
- **Version Control:** Git and GitHub
- **Continuous Integration:** GitHub Actions
- **Frontend Hosting:** Vercel

## Project Structure

```text
HrGenius/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
└── README.md
```

*Note: The folders and files shown above represent the main project structure; individual files may vary.*

## Prerequisites

Before running HRGenius locally, install:

- [Node.js and npm](https://nodejs.org/)
- A MongoDB Atlas account and database
- [Git](https://git-scm.com/) (optional if downloading the repository as a ZIP)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mananshsharma/HRGenius.git
cd HRGenius
```

### 2. Configure the Backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and configure the environment variables required by the application:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
```

Replace the example values with your own configuration. Never commit your actual `.env` file or credentials.

### 3. Start the Backend

From the `backend` directory, run the start command configured in `backend/package.json`. If no start script exists, you can start the server with:

```bash
node server.js
```

The backend uses port `5000` by default unless another port is configured. When running locally, the root endpoint can be checked at:

`http://localhost:5000/`

### 4. Run the Frontend

Open the `frontend` directory and launch the main HTML page using a local development server or the method configured for the project.

Ensure the frontend API configuration points to the backend URL that is actually running. A deployed frontend cannot reach a backend running only on your personal computer when that computer or server is unavailable.

## Security

- Store database credentials and JWT secrets in environment variables.
- Do not commit `.env` files, access tokens, passwords, or other secrets.
- Protected API endpoints require valid JWT authentication.
- Validate user input and apply appropriate access permissions to sensitive operations.

## Continuous Integration

HRGenius uses GitHub Actions to install backend dependencies and check JavaScript syntax when changes are pushed to the main branch or a pull request targets it.

[View GitHub Actions](https://github.com/mananshsharma/HRGenius/actions)

## Project Status

HRGenius is a college project with its core HR management workflows implemented and tested by the developer. The frontend is deployed on Vercel, while the backend currently requires local configuration and a running database connection.

## Author

**Manansh Sharma**

- GitHub: [mananshsharma](https://github.com/mananshsharma)
- LinkedIn: [Manansh Sharma](https://www.linkedin.com/in/mananshsharma)

