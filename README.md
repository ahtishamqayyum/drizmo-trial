# Drizmo Full-Stack Application

A modern full-stack application with NestJS backend, PostgreSQL database, Prisma ORM, and React + TypeScript frontend.

## Features

- ✅ User authentication (Signup & Login) with JWT
- ✅ PostgreSQL database with Prisma ORM
- ✅ User model with email, hashed password, and tenant_id
- ✅ Modern, attractive UI with gradient colors
- ✅ Login page with image section and form
- ✅ Beautiful dashboard with modern design

## Tech Stack

### Backend
- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/drizmo_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
```

4. Update the DATABASE_URL with your PostgreSQL credentials.

5. Generate Prisma Client:
```bash
npm run prisma:generate
```

6. Run database migrations:
```bash
npm run prisma:migrate
```

7. Start the backend server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Quick Start (All at once)

From the root directory, run:
```bash
npm run install:all
```

Then start backend and frontend in separate terminals:
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create a new user account
  - Body: `{ email, password, tenantId }`
- `POST /auth/login` - Login user
  - Body: `{ email, password }`
- `POST /auth/profile` - Get user profile (requires JWT token)

## Database Schema

### User Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `tenant_id` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## Project Structure

```
drizmo-trial/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   ├── prisma/        # Prisma service
│   │   └── main.ts        # Application entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── context/       # Auth context
│   │   ├── services/      # API services
│   │   └── App.tsx        # Main app component
│   └── package.json
└── README.md
```

## Default Credentials

After setup, you can create a new account through the signup page.

## Notes

- Make sure PostgreSQL is running before starting the backend
- Update the `.env` file with your actual database credentials
- The JWT secret should be changed in production
- CORS is configured to allow requests from `http://localhost:5173`

