[![HRGenius CI](https://github.com/mananshsharma/HRGenius/actions/workflows/ci.yml/badge.svg)](https://github.com/mananshsharma/HRGenius/actions/workflows/ci.yml)

# HRGenius — Human Resource Management System


HRGenius is a web-based Human Resource Management System (HRMS) developed as a college project. It provides a centralized platform for managing employee information, recruitment, onboarding, payroll, performance records, and HR analytics.

The application uses HTML, CSS, and JavaScript for the frontend, Node.js and Express.js for the backend, and MongoDB Atlas for database integration. The source code is maintained on GitHub, GitHub Actions is configured for continuous integration, and Vercel is used for deployment.

## Live Demo

- **Frontend:** https://hrgenius.vercel.app
- **Backend:** https://hrgenius-backend.vercel.app
- **GitHub Repository:** https://github.com/mananshsharma/HRGenius

> Note: The availability of the deployed website does not necessarily guarantee that every API endpoint or application feature is working correctly. Database-dependent operations require a successful MongoDB Atlas connection.

## Features

- **User Authentication:** Login functionality using JSON Web Tokens (JWT).
- **Employee Management:** Create, view, update, and delete employee records.
- **Recruitment Management:** Manage job openings and candidate records.
- **Employee Onboarding:** Organize employee onboarding information.
- **Payroll Management:** Maintain payroll records.
- **Performance Management:** Manage employee performance information.
- **HR Analytics:** Display HR-related statistics and visualizations.
- **Database Integration:** Store application data using MongoDB Atlas.
- **Deployment:** Host the frontend and backend using Vercel.
- **Continuous Integration:** Run automated checks through GitHub Actions.

*Feature availability may depend on the deployment configuration and successful integration of the relevant API endpoints.*

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JSON Web Tokens (JWT) |
| Version Control | Git and GitHub |
| Continuous Integration | GitHub Actions |
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

*This structure shows the main project directories. Individual files may vary.*

## Deployment

### Frontend

The frontend is deployed using Vercel.

**Live URL:** https://hrgenius.vercel.app

The frontend is built with HTML, CSS, and JavaScript. Its API configuration must point to the appropriate backend URL for the selected environment.

### Backend

The backend is deployed using Vercel.

**Backend URL:** https://hrgenius-backend.vercel.app

The backend provides the Express API and requires the appropriate environment variables and a successful MongoDB Atlas connection for database-dependent operations.

### Database

MongoDB Atlas is used to store application data.

Configure the following environment variables in the backend environment:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
```

- `PORT`: Port used by the backend during local development.
- `MONGO_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: Secret used for signing and verifying JWTs.

Configure these variables in your local `.env` file or the deployment platform's environment-variable settings.

**Security note:** Never commit `.env` files, database credentials, or JWT secrets to GitHub.

## Run Locally

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- A MongoDB Atlas account or another supported MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/mananshsharma/HRGenius.git
cd HRGenius
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
```

Replace the placeholder values with your own configuration.

### 4. Start the Backend

```bash
node server.js
```

If the server starts successfully, the local backend should run on port `5000`, unless configured otherwise.

To check the local backend root endpoint, open:

http://localhost:5000/

### 5. Launch the Frontend

Open the `frontend` directory and run its main HTML page using a local development server.

Ensure that the frontend API configuration points to the intended backend:

- **Local development:** `http://localhost:5000`
- **Production deployment:** `https://hrgenius-backend.vercel.app`

Use the appropriate URL for the environment. A production website should not send API requests to `localhost` on the visitor's device.

## Continuous Integration

HRGenius includes a GitHub Actions workflow for automated backend checks when changes are pushed or pull requests are opened.

- **Repository:** https://github.com/mananshsharma/HRGenius
- **GitHub Actions:** https://github.com/mananshsharma/HRGenius/actions
- **Workflow file:** `.github/workflows/ci.yml`

The CI badge at the top of this README displays the workflow status reported by GitHub Actions.

## Security Practices

- Store database connection strings and JWT secrets in environment variables.
- Never commit `.env` files or credentials.
- Use JWT authentication for protected endpoints.
- Validate incoming data on the server.
- Apply appropriate authorization checks to sensitive operations.
- Configure MongoDB Atlas network access carefully.
- Use HTTPS for production API communication.

## Project Status

HRGenius has been developed as a Human Resource Management System college project, with core HR management workflows implemented and tested locally.

The source code is available on GitHub, GitHub Actions is configured for automated checks, and the frontend and backend are deployed using Vercel.

The backend's ability to respond to requests and its ability to complete database-dependent operations are separate checks. Authentication, API endpoints, and database operations should be tested in the deployed environment before being considered fully operational.

## Author

**Manansh Sharma**

- **GitHub:** https://github.com/mananshsharma
- **LinkedIn:** https://www.linkedin.com/in/mananshsharma

