
[![HRGenius CI](https://github.com/mananshsharma/HRGenius/actions/workflows/ci.yml/badge.svg)](https://github.com/mananshsharma/HRGenius/actions/workflows/ci.yml)

# HRGenius — Human Resource Management System

HRGenius is a web-based Human Resource Management System (HRMS) developed as a college project. It aims to simplify common HR activities through a centralized interface.

## Features

- User authentication
- Employee management
- Recruitment and candidate management
- Employee onboarding
- Payroll management
- Performance management
- HR analytics and reporting

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Version Control:** Git and GitHub

## Project Structure

```text
HrGenius/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB Atlas account or MongoDB connection
- Git

### Run the Backend

1. Open a terminal in the `backend` directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the required environment variables in a local `.env` file, using the variable names expected by the backend code.
4. Start the server using the start command defined in `backend/package.json`.

### Run the Frontend

Open the frontend's main HTML page using a local development server or the setup configured for the project.

## Security

- Do not commit `.env` files, database credentials, tokens, or passwords.
- Keep secrets in environment variables.
- Never publish real credentials in the repository.

## Project Status

This project is under development. The backend currently requires local configuration to connect to the database and serve API requests.

## Author

**Manansh Sharma**

- LinkedIn: [Manansh Sharma](https://www.linkedin.com/in/mananshsharma)
