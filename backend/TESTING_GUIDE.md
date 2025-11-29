# Template API Testing Guide

## 🚀 Quick Start

### Option 1: Using Test Server (Recommended - No CORS Issues)

1. **Backend server start karein:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Test server start karein (nayi terminal mein):**
   ```bash
   cd backend
   node test-server.js
   ```

3. **Browser mein kholen:**
   ```
   http://localhost:8080
   ```

### Option 2: Direct HTML File (CORS Fixed)

1. **Backend server start karein:**
   ```bash
   cd backend
   npm run start:dev
   ```

2. **HTML file kholen:**
   ```
   file:///E:/Projects/drizmo-trial/backend/template-api-test.html
   ```

## 📋 Testing Steps

### Step 1: Login / Signup
- Email aur password enter karein
- Agar user nahi hai to "Signup" button click karein
- Agar user hai to "Login" button click karein
- JWT token milne ke baad aage badhen

**Test Credentials (agar seed data hai):**
- Email: `admin@test.com`
- Password: `password123`
- Tenant: `Tenant A`

### Step 2: Create Template
- Title enter karein (e.g., "My Template")
- Items (optional) JSON format mein enter karein
- "Create Template" button click karein
- Template ID automatically copy ho jayega

### Step 3: List Templates
- "Get All Templates" button click karein
- Aapke tenant ke saare templates dikhenge

### Step 4: Update Template
- Template ID enter karein (create ke baad automatically fill ho jayega)
- Title ya items update karein
- "Update Template" button click karein

### Step 5: Soft Delete Template
- Template ID enter karein
- "Soft Delete Template" button click karein
- Template soft delete ho jayega (deletedAt set hoga)

## 🔍 Troubleshooting

### Issue: "Network error" ya "Failed to fetch"
**Solution:**
- Backend server check karein: `http://localhost:3001`
- Browser console mein error check karein (F12)
- CORS error ho to test-server use karein

### Issue: "Tenant ID is required"
**Solution:**
- Pehle login/signup zaroori hai
- JWT token sahi hai ya nahi check karein
- Browser console mein network tab check karein

### Issue: "Template not found"
**Solution:**
- Template ID sahi hai ya nahi check karein
- Template aapke tenant ka hai ya nahi verify karein
- Template pehle soft delete ho chuka hai ya nahi check karein

### Issue: Backend server start nahi ho raha
**Solution:**
```bash
# Port check karein
netstat -ano | findstr :3001

# Database check karein
# PostgreSQL running hai ya nahi verify karein
# .env file mein DATABASE_URL sahi hai ya nahi check karein
```

## 📡 API Endpoints

```
POST   /templates          - Create template
GET    /templates          - List templates (filtered by tenant_id)
GET    /templates/:id      - Get single template
PATCH  /templates/:id      - Update template
DELETE /templates/:id      - Soft delete template
```

## 🔐 Security Features

- ✅ JWT Authentication required
- ✅ Tenant isolation enforced
- ✅ All queries filter by tenant_id
- ✅ Soft delete (deletedAt timestamp)
- ✅ Update/Delete operations verify tenant ownership


