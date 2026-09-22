# Hostel Maintenance Tracker

A full-stack application for reporting and managing hostel maintenance issues. Students can report problems with hostel assets, while admins can add assets and update maintenance request statuses.

## Features

- Student signup and login
- Separate Student Login and Admin Login selection
- JWT-protected API routes
- Admin asset management: add, edit, and delete assets
- Student issue reporting with an asset dropdown
- Student view of their own maintenance requests
- Admin view of all requests and status updates
- MongoDB persistence for users, assets, and maintenance requests

## Tech stack

- Frontend: React, Vite, Axios, React Router
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas or local MongoDB
- Authentication: JSON Web Tokens and bcrypt

## Project structure

```text
Hostel_maintenance_tracker/
├── backend/       # Express API and MongoDB models
├── frontend/      # React application
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database (MongoDB Atlas or local MongoDB)

## Setup

Install dependencies in both folders:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Backend environment variables

Create `backend/.env` with your own MongoDB URI and JWT secret:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/Hostel_maintenance_tracker
JWT_SECRET=use_a_long_random_secret_here
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

For MongoDB Atlas, ensure the cluster is running and allow your current IP address in **Network Access**.

### Frontend environment variables

The default API address is `http://localhost:5000/api`. If needed, create `frontend/.env` from the example file:

```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

## Deployment

Deploy `backend` and `frontend` as separate projects. The backend includes a Vercel serverless configuration; use `backend` as that project's root directory. Deploy the frontend as a Vite static site with `frontend` as its root directory and `npm run build` as its build command.

Set these values in the hosting provider's environment-variable settings (do not rely on local `.env` files):

```env
# Backend
NODE_ENV=production
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=a-long-unique-random-secret
CLIENT_URL=https://your-frontend-domain.example
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com

# Frontend
VITE_API_URL=https://your-backend-domain.example/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

`CLIENT_URL` may contain a comma-separated list of allowed frontend origins when previews are required. Configure a SPA rewrite on any frontend host that does not automatically return `index.html` for React Router URLs.

## Run the app

Run these commands in two separate terminals.

Terminal 1 — backend:

```bash
cd backend
npm run dev
```

Terminal 2 — frontend:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally [http://localhost:5173](http://localhost:5173).

## How to use

1. Sign up to create a student account.
2. An admin must log in and open **Manage Assets**.
3. Add assets such as Fan, Bed, Light, or Chair with an asset code, hostel, and room.
4. A student can open **Report Issue**, select an added asset, and submit the problem description.
5. The submitted request appears under **My Requests** for the student and **Maintenance Requests** for the admin.
6. The admin opens a request and changes its status to Pending, In Progress, or Resolved.

## Admin accounts

Public signup intentionally creates only `student` users. Create an admin securely from the backend folder:

```bash
cd backend
npm run create-admin -- "Admin Name" admin@example.com a-strong-password
```

The command creates the account, or updates an existing account with that email to the `admin` role. Then select **Admin Login** and sign in using those credentials. Admin users can manage assets and update maintenance requests.

## API endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create a student account |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/assets` | Authenticated | List assets |
| POST | `/api/assets` | Admin | Create an asset |
| PATCH | `/api/assets/:id` | Admin | Update an asset |
| DELETE | `/api/assets/:id` | Admin | Delete an asset |
| POST | `/api/maintenance` | Student | Report an issue |
| GET | `/api/maintenance` | Authenticated | List relevant requests |
| GET | `/api/maintenance/:id` | Owner/Admin | Request details |
| PUT | `/api/maintenance/:id` | Admin | Update request status |

## Verification

```bash
npm --prefix frontend run build
npm --prefix frontend run lint
```

## Security notes

- Do not commit `backend/.env` or database passwords.
- Use a long, private `JWT_SECRET` in production.
- Rotate database credentials if they are ever exposed.

## cd ~/Desktop/Hostel_maintenance_tracker/backend
## npm run create-admin -- "Hostel Admin" admin@hostel.com 'Admin@123'
