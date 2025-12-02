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

- ✅ **Create Template** - Create templates with automatic `tenant_id` and `user_id` assignment
- ✅ **List Templates** - Role-based template listing:
  - **Admin Users**: View all templates from their tenant (all users' templates)
  - **Regular Users**: View only their own templates
- ✅ **Update Template** - Update template data with role-based access control
- ✅ **Soft Delete** - Soft delete templates with role-based access control:
  - **Admin Users**: Can delete any template from their tenant
  - **Regular Users**: Can only delete their own templates
- ✅ **Tenant Isolation** - All queries filter by `tenant_id` automatically
- ✅ **User Isolation** - Regular users can only access their own templates
- ✅ **Creator Tracking** - Each template tracks the creator user (email displayed)
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

#### Option 1: Automated Setup (Recommended for Windows)

Run the automated setup script that will configure everything:

```powershell
cd backend
.\setup.ps1
```

This script will:
- ✅ Create `.env` file from template
- ✅ Prompt for PostgreSQL password
- ✅ Install dependencies
- ✅ Create database if needed
- ✅ Generate Prisma Client
- ✅ Run migrations
- ✅ Seed the database

**Note**: Make sure PostgreSQL is installed and running before running the setup script.

#### Option 2: Manual Setup

##### Create PostgreSQL Database

```sql
CREATE DATABASE drizmo_db;
```

##### Configure Backend Environment

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/drizmo_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
JWT_EXPIRES_IN="7d"
PORT=3001
```

**Important**: Replace `your_password` with your actual PostgreSQL password.

##### Run Database Migrations

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

##### Seed Database (Optional)

Seed the database with initial tenants:

```bash
npm run prisma:seed
```

This will create:

- Tenant A
- Tenant B

**Note**: No dummy users are created. Users are created through the signup process.

For detailed troubleshooting, see `backend/SETUP-GUIDE.md`

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
  "userId": "user-uuid",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  },
  "createdAt": "2024-11-29T07:00:00.000Z",
  "updatedAt": "2024-11-29T07:00:00.000Z"
}
```

**Note:** Template is automatically assigned to the authenticated user (`userId` from JWT token).

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
    "userId": "user-uuid",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com"
    },
    "createdAt": "2024-11-29T07:00:00.000Z",
    "updatedAt": "2024-11-29T07:00:00.000Z"
  }
]
```

**Note:**

- **Admin Users**: Returns all templates from their tenant (all users' templates)
- **Regular Users**: Returns only their own templates
- Soft-deleted templates are excluded
- Each template includes creator user information

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

**Note:**

- Template is soft-deleted (sets `deletedAt` timestamp)
- **Admin Users**: Can delete any template from their tenant
- **Regular Users**: Can only delete their own templates
- All operations enforce tenant isolation

### Tenant Endpoints

```http
GET /tenants
Authorization: Bearer <jwt_token>
```

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
```

### User Model

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String
  tenantId  String     @map("tenant_id")
  role      String     @default("user") // "admin" or "user"
  tenant    Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  templates Template[]
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  @@map("users")
}
```

### Template Model

```prisma
model Template {
  id        String    @id @default(uuid())
  title     String
  items     String?   // JSON string for template items
  tenantId  String    @map("tenant_id")
  userId    String    @map("user_id")
  tenant    Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  deletedAt DateTime? @map("deleted_at") // Soft delete timestamp
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  @@map("templates")
}
```

## 🔐 Role-Based Access Control

### Admin Role

- Can view all users in their tenant
- Can see newly registered users automatically
- **Can view all templates from their tenant** (all users' templates)
- **Can edit/delete any template from their tenant**
- Full access to tenant data

### User Role

- Can only view their own data
- Cannot see other users' information
- **Can only view their own templates**
- **Can only edit/delete their own templates**
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
│   │   │   ├── Login.tsx         # Login/Signup page
│   │   │   ├── Dashboard.tsx     # User dashboard
│   │   │   ├── TemplatesList.tsx  # Templates list page
│   │   │   ├── AddTemplate.tsx    # Add template page
│   │   │   └── EditTemplate.tsx  # Edit template page
│   │   ├── context/
│   │   │   └── AuthContext.tsx   # Auth context provider
│   │   ├── services/
│   │   │   ├── authService.ts     # Auth API service
│   │   │   ├── userService.ts     # User API service
│   │   │   └── templateService.ts # Template API service
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point
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
- Navigation to Templates page
- Logout functionality

### Templates Management Pages

- **Templates List** - View all templates with role-based filtering:
  - Admin: See all tenant templates with creator email
  - Regular Users: See only their own templates
- **Add Template** - Create new templates with title and items
- **Edit Template** - Update existing templates (role-based access)
- **Delete Template** - Soft delete templates (role-based access)
- Shows creator email for each template
- Responsive table layout

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

You can test the Template APIs using:

- **Postman** or **Thunder Client** - Import the endpoints and test with JWT tokens
- **Browser Console** - Use fetch API with JWT token from login
- **Frontend UI** - Use the Templates pages in the React application

**Testing Flow:**

1. Login/Signup to get JWT token
2. Use token in Authorization header: `Bearer <token>`
3. Test all CRUD operations
4. All queries filter by `tenant_id` and user role automatically

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
- ✅ **Role-Based Access Control** - Different permissions for Admin and Regular users:
  - **Admin**: Can view/edit/delete all templates from their tenant
  - **Regular Users**: Can only view/edit/delete their own templates
- ✅ **User Tracking** - Each template tracks the creator user (`userId` field)
- ✅ **Creator Display** - Templates list shows creator email for admin users
- ✅ **Multi-Tenant Support** - All operations automatically filter by `tenant_id`
- ✅ **User Isolation** - Regular users can only access their own templates
- ✅ **Tenant Isolation** - Complete data separation between tenants
- ✅ **Soft Delete** - Templates are soft-deleted (not permanently removed)
- ✅ **JWT Authentication** - All endpoints require valid JWT token
- ✅ **Frontend UI** - Complete React UI for template management

### Frontend Pages Added

- `frontend/src/pages/TemplatesList.tsx` - Templates list with role-based filtering
- `frontend/src/pages/AddTemplate.tsx` - Add new template form
- `frontend/src/pages/EditTemplate.tsx` - Edit template form
- `frontend/src/services/templateService.ts` - Template API service

### Backend Files Added

- `backend/src/templates/` - Complete templates module with role-based access

### Database Changes

- Added `Template` model to Prisma schema
- Migration: `20251129071858_add_template_module` - Initial template module
- Migration: `20251130180658_add_user_id_to_templates` - Added `user_id` field
- Added `user_id` column to track template creator
- Added `deleted_at` column for soft delete functionality
- Added User-Template relation for creator tracking

---

**Note**: Make sure to change the JWT_SECRET in production and never commit `.env` files to version control.
