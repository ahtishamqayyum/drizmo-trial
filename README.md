# Drizmo - Multi-Tenant Full-Stack Application

A modern, production-ready full-stack application built with NestJS backend and React frontend, featuring multi-tenant architecture, role-based access control, and beautiful UI.

<!-- cSpell:words Drizmo drizmo signup Signup findstr taskkill -->

## 🚀 Features

### Authentication & Authorization

- ✅ **User Authentication** - Secure signup and login with JWT tokens
- ✅ **Role-Based Access Control** - Admin and User roles with different permissions
- ✅ **Multi-Tenant System** - Complete tenant isolation and management
- ✅ **Password Security** - Bcrypt hashing for secure password storage
- ✅ **Protected Routes** - JWT-based route protection

### User Management

- ✅ **Admin Dashboard** - Admins can view all users in their tenant
- ✅ **User Dashboard** - Users can only view their own data
- ✅ **Tenant Selection** - Beautiful dropdown for tenant selection during signup
- ✅ **User Profile** - View and manage user profiles

### Template Management

- ✅ **Create Template** - Create templates with automatic `tenant_id` assignment
- ✅ **List Templates** - View all templates filtered by tenant (soft-deleted templates are excluded)
- ✅ **Update Template** - Update template data with tenant ownership validation
- ✅ **Soft Delete** - Soft delete templates (sets `deletedAt` timestamp)
- ✅ **Tenant Isolation** - All queries filter by `tenant_id` automatically
- ✅ **Multi-Tenant Security** - Complete data separation between tenants

### UI/UX

- ✅ **Modern Design** - Beautiful gradient-based UI with smooth animations
- ✅ **Responsive Layout** - Works seamlessly on all devices
- ✅ **Interactive Forms** - Real-time validation and error handling
- ✅ **Loading States** - Smooth loading indicators
- ✅ **Error Handling** - User-friendly error messages

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: class-validator, class-transformer
- **Language**: TypeScript

### Frontend

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern animations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **Git** (optional, for cloning)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd drizmo-trial
```

### 2. Install Dependencies

Install all dependencies for both backend and frontend:

```bash
npm run install:all
```

Or install separately:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

```sql
CREATE DATABASE drizmo_db;
```

#### Configure Backend Environment

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/drizmo_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
JWT_EXPIRES_IN="7d"
PORT=3001
```

**Important**: Replace `your_password` with your actual PostgreSQL password.

#### Run Database Migrations

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

#### Seed Database (Optional)

Seed the database with initial tenants:

```bash
npm run prisma:seed
```

This will create:

- Tenant A
- Tenant B

**Note**: No dummy users are created. Users are created through the signup process.

## 🚀 Running the Application

### Development Mode

#### Option 1: Run from Root (Recommended)

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

#### Option 2: Run Separately

**Backend:**

```bash
cd backend
npm run start:dev
```

Backend will run on `http://localhost:3001`

**Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Production Mode

**Backend:**

```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

## 📡 API Endpoints

### Authentication Endpoints

#### Signup

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "tenantId": "Tenant A"
}
```

**Response:**

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "tenantId": "tenant-a-id",
    "role": "user"
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "tenantId": "tenant-a-id",
    "role": "user"
  }
}
```

#### Get Profile

```http
POST /auth/profile
Authorization: Bearer <jwt_token>
```

### User Endpoints

#### Get All Users

```http
GET /users
Authorization: Bearer <jwt_token>
```

**Response (Admin):** Returns all users in the tenant
**Response (User):** Returns only the current user's data

#### Get User by ID

```http
GET /users/:id
Authorization: Bearer <jwt_token>
```

#### Get Current User Profile

```http
GET /users/profile/me
Authorization: Bearer <jwt_token>
```

### Template Management Endpoints

Complete CRUD operations for templates with multi-tenant support. All operations are filtered by `tenant_id` automatically.

#### Create Template

```http
POST /templates
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "title": "My Template",
  "items": "{\"item1\": \"value1\", \"item2\": \"value2\"}"
}
```

**Response:**

```json
{
  "id": "template-uuid",
  "title": "My Template",
  "items": "{\"item1\": \"value1\", \"item2\": \"value2\"}",
  "tenantId": "tenant-uuid",
  "createdAt": "2024-11-29T07:00:00.000Z",
  "updatedAt": "2024-11-29T07:00:00.000Z"
}
```

#### List Templates

```http
GET /templates
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "template-uuid-1",
    "title": "Template 1",
    "items": "{}",
    "tenantId": "tenant-uuid",
    "createdAt": "2024-11-29T07:00:00.000Z",
    "updatedAt": "2024-11-29T07:00:00.000Z"
  }
]
```

**Note:** Only returns templates for the authenticated user's tenant. Soft-deleted templates are excluded.

#### Get Single Template

```http
GET /templates/:id
Authorization: Bearer <jwt_token>
```

#### Update Template

```http
PATCH /templates/:id
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "title": "Updated Template Title",
  "items": "{\"item1\": \"updated_value\"}"
}
```

#### Soft Delete Template

```http
DELETE /templates/:id
Authorization: Bearer <jwt_token>
```

**Note:** Template is soft-deleted (sets `deletedAt` timestamp). Users can only access data from their own tenant.
</think>
GET /tenants
Authorization: Bearer <jwt_token>

````

## 🗄️ Database Schema

### Tenant Model

```prisma
model Tenant {
  id        String     @id @default(uuid())
  name      String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  users     User[]
  templates Template[]
}
````

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  tenantId  String
  role      String   @default("user") // "admin" or "user"
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Template Model

```prisma
model Template {
  id        String    @id @default(uuid())
  title     String
  items     String?   // JSON string for template items
  tenantId  String
  tenant    Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  deletedAt DateTime? // Soft delete timestamp
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("templates")
}
```

## 🔐 Role-Based Access Control

### Admin Role

- Can view all users in their tenant
- Can see newly registered users automatically
- Full access to tenant data

### User Role

- Can only view their own data
- Cannot see other users' information
- Limited access based on tenant

### Tenant Isolation

- Users can only access data from their own tenant
- Complete data isolation between tenants
- Admin "A" can only see Tenant A users
- Admin "B" can only see Tenant B users

## 📁 Project Structure

```
drizmo-trial/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── guards/        # JWT and Local auth guards
│   │   │   ├── strategies/    # Passport strategies
│   │   │   └── dto/          # Data transfer objects
│   │   ├── users/            # Users module
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── dto/
│   │   ├── tenants/          # Tenants module
│   │   │   ├── tenants.controller.ts
│   │   │   └── tenants.service.ts
│   │   ├── templates/        # Templates module
│   │   │   ├── templates.controller.ts
│   │   │   ├── templates.service.ts
│   │   │   └── dto/
│   │   ├── prisma/           # Prisma service
│   │   ├── common/           # Common utilities
│   │   │   ├── decorators/   # Custom decorators
│   │   │   ├── interceptors/ # Interceptors
│   │   │   └── middleware/   # Middleware
│   │   ├── app.module.ts     # Root module
│   │   └── main.ts           # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/        # Database migrations
│   │   └── seed.ts           # Database seed file
│   ├── .env                  # Environment variables (create this)
│   ├── env-template.txt       # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx     # Login/Signup page
│   │   │   └── Dashboard.tsx # User dashboard
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Auth context provider
│   │   ├── services/
│   │   │   ├── authService.ts # Auth API service
│   │   │   └── userService.ts # User API service
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   └── package.json
├── package.json              # Root package.json
└── README.md                 # This file
```

## 🎨 UI Features

### Login/Signup Page

- Beautiful gradient background
- Smooth form animations
- Real-time validation
- Custom styled tenant dropdown
- Error and success messages
- Responsive design

### Dashboard

- Modern card-based layout
- User statistics
- Tenant information
- Users list (role-based)
- Logout functionality

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation using class-validator
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Tenant Isolation**: Complete data separation between tenants

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test
npm run test:watch
npm run test:cov
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Template API Testing

#### Using HTML Test Page

1. **Start Backend Server:**

   ```bash
   cd backend
   npm run start:dev
   ```

2. **Open Test Page:**

   - Open `backend/template-api-test.html` in Chrome browser
   - Test all Template APIs with JWT Authentication

3. **Test Page Features:**
   - Login/Signup functionality
   - Create Template API testing
   - List Templates API testing
   - Update Template API testing
   - Soft Delete API testing

#### Using Browser Console

```javascript
// Complete test flow in browser console
// 1. Login to get JWT token
// 2. Test all CRUD operations
// 3. All queries filter by tenant_id
```

**Test File Location:** `backend/template-api-test.html`

**API Documentation:** See `backend/API_ENDPOINTS.md` for complete API testing guide

## 📝 Available Scripts

### Root Scripts

- `npm run install:all` - Install all dependencies
- `npm run dev:backend` - Start backend in dev mode
- `npm run dev:frontend` - Start frontend in dev mode

### Backend Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Backend Issues

**Port Already in Use:**

```bash
# Change PORT in backend/.env or kill the process
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

**Database Connection Error:**

- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` file
- Verify database exists: `CREATE DATABASE drizmo_db;`

**Prisma Issues:**

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### Frontend Issues

**Network Error:**

- Ensure backend is running on port 3001
- Check CORS configuration
- Verify API URL in `authService.ts` and `userService.ts`

**Build Errors:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

Drizmo Development Team

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- React team for the UI library
- Prisma team for the excellent ORM
- All open-source contributors

---

## 📅 Recent Updates (November 2024)

### Template Management System

- ✅ **Complete CRUD Operations** - Create, Read, Update, and Soft Delete templates
- ✅ **Multi-Tenant Support** - All operations automatically filter by `tenant_id`
- ✅ **Tenant Isolation** - Complete data separation between tenants
- ✅ **Soft Delete** - Templates are soft-deleted (not permanently removed)
- ✅ **JWT Authentication** - All endpoints require valid JWT token
- ✅ **API Testing Tools** - HTML test page for easy API testing
- ✅ **Comprehensive Documentation** - Complete API endpoints guide

### Files Added

- `backend/src/templates/` - Complete templates module
- `backend/template-api-test.html` - Interactive API testing page
- `backend/API_ENDPOINTS.md` - Complete API documentation
- `backend/TESTING_GUIDE.md` - Testing guide and troubleshooting

### Database Changes

- Added `Template` model to Prisma schema
- Migration: `20251129071858_add_template_module`
- Added `deleted_at` column for soft delete functionality

---

**Note**: Make sure to change the JWT_SECRET in production and never commit `.env` files to version control.
