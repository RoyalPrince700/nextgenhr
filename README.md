# NextGen HR Lab

Full-stack MERN application (MongoDB · Express · React · Node) built with **Vite** and **TypeScript**, based on the institutional profile HTML design.

## Project structure

```
nextgenhrlab/
├── frontend/        # Vite + React + TypeScript
├── backend/         # Express + TypeScript + MongoDB API
└── package.json     # Root scripts to run both apps
```

## Prerequisites

- Node.js 20+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

1. Install dependencies (run each from the project root):

```powershell
npm install --prefix backend
npm install --prefix frontend
```

2. Configure environment files:

`backend/.env`

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nextgenhrlab
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=nextgenhrlab-dev-secret-change-me
NODE_ENV=development
```

`frontend/.env`

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NextGen HR Lab
```

3. Start MongoDB, then run both apps from the project root:

```powershell
npm run dev
```

Or in two terminals:

```powershell
npm run dev:backend
npm run dev:frontend
```

- Frontend: http://localhost:5173
- API: http://localhost:5000
- Health check: http://localhost:5000/api/health

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/enquiries` | Submit an admissions enquiry |
| `GET` | `/api/enquiries` | List recent enquiries |

Enquiry body:

```json
{
  "fullName": "Jane Doe",
  "email": "jane@company.com",
  "currentRole": "HR Manager",
  "programmeInterest": "New Managers Accelerator",
  "growthGoal": "Build stronger people leadership skills"
}
```

## Auth API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Set new password with token |
| `GET` | `/api/auth/me` | Current user (Bearer token) |
| `PATCH` | `/api/auth/settings` | Update profile / password |

Frontend auth pages: `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/settings`.

In development, forgot-password returns a `resetUrl` and also logs it in the backend console (email provider not wired yet).
