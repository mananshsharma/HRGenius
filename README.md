
[![HRGenius CI](https://github.com/mananshsharma/HRGenius/actions/workflows/ci.yml/badge.svg)](https://github.com/mananshsharma/HRGenius/actions/workflows/ci.yml)

# HRGenius — Human Resource Management System

HRGenius is a web-based Human Resource Management System (HRMS) developed as a college project. It provides a centralized platform for managing employee information, recruitment, onboarding, payroll, performance records, and HR analytics.

The project uses a web frontend, a Node.js and Express backend, and MongoDB Atlas for database integration. The source code is maintained on GitHub, with GitHub Actions configured for continuous integration and Vercel used for deployment.

## Features

- **User Authentication:** Login and authentication using JSON Web Tokens (JWT).
- **Employee Management:** Manage employee records and information.
- **Recruitment Management:** Manage job openings and candidate records.
- **Employee Onboarding:** Organize employee onboarding information.
- **Payroll Management:** Maintain payroll records.
- **Performance Management:** Manage employee performance information.
- **HR Analytics:** Display HR-related statistics and visualizations.
- **Database Integration:** Connect the backend to MongoDB Atlas.
- **Deployment:** Deploy the web application components using Vercel.
- **Continuous Integration:** Run automated checks through GitHub Actions.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JSON Web Tokens (JWT) |
| Version Control | Git and GitHub |
| CI/CD Checks | GitHub Actions |
| Hosting | Vercel |

## Project Structure

```text
HRGenius/
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

*The structure above shows the main project directories. Individual files may vary.*

## Deployment

### Backend

The HRGenius backend has been deployed to Vercel.

**Backend URL:** https://hrgenius-backend.vercel.app

The backend provides the Express API and requires the appropriate environment variables and a successful MongoDB Atlas connection for database-dependent operations.

### Database

MongoDB Atlas is used to store application data. The backend requires the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
```

Configure these variables in the local environment or the deployment platform's environment-variable settings. Never publish database credentials or JWT secrets.

### Frontend

The frontend is built with HTML, CSS, and JavaScript. It should be served using a local development server or the configured hosting platform, with its API configuration pointing to the appropriate backend URL.

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/mananshsharma/HRGenius.git
cd HRGenius
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` directory and add your MongoDB connection string and a strong JWT secret.

### 4. Start the backend

```bash
node server.js
```

If the application starts successfully, the local backend runs on port `5000` by default.

Open the following URL to check the backend root endpoint:

http://localhost:5000/

### 5. Launch the frontend

Open the `frontend` directory and run its main HTML page using a local development server. Make sure the frontend's API configuration points to the backend you intend to use.

## Continuous Integration

HRGenius includes a GitHub Actions workflow for automated backend checks when changes are pushed or pull requests are opened.

- **Repository:** https://github.com/mananshsharma/HRGenius
- **GitHub Actions:** https://github.com/mananshsharma/HRGenius/actions

## Security Practices

- Keep database connection strings and JWT secrets in environment variables.
- Never commit `.env` files or other credentials.
- Use JWT authentication for protected endpoints.
- Validate incoming data and apply suitable authorization checks to sensitive operations.
- Configure database network access carefully.

## Project Status

HRGenius has been developed as a functional HRMS college project, with its core HR management workflows implemented and tested locally. The source code is available on GitHub, GitHub Actions is configured for automated checks, and the backend has been deployed to Vercel.

Database-dependent functionality on the deployed backend requires a successful connection to MongoDB Atlas. Deployment and database connectivity are separate checks, so live API functionality should be verified independently.

## Author

**Manansh Sharma**

- **GitHub:** https://github.com/mananshsharma
- **LinkedIn:** https://www.linkedin.com/in/mananshsharma


