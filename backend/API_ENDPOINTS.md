# 🔗 Template API Endpoints - Chrome Testing Guide

## Base URL
```
http://localhost:3001
```

---

## 📋 Step 1: Login / Signup (JWT Token Lene Ke Liye)

### Login API
```http
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@test.com",
    "tenantId": "tenant-uuid-here",
    "role": "admin"
  }
}
```

### Signup API
```http
POST http://localhost:3001/auth/signup
Content-Type: application/json

{
  "email": "newuser@test.com",
  "password": "password123",
  "tenantId": "Tenant A"
}
```

**Response:** Same as login response

---

## 📝 Step 2: Template APIs (JWT Token Required)

**Important:** Har API call mein `Authorization` header mein JWT token bhejna zaroori hai!

### 1️⃣ CREATE Template

```http
POST http://localhost:3001/templates
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE

{
  "title": "My First Template",
  "items": "{\"item1\": \"value1\", \"item2\": \"value2\"}"
}
```

**Response:**
```json
{
  "id": "template-uuid-here",
  "title": "My First Template",
  "items": "{\"item1\": \"value1\", \"item2\": \"value2\"}",
  "tenantId": "tenant-uuid-here",
  "createdAt": "2024-11-29T07:00:00.000Z",
  "updatedAt": "2024-11-29T07:00:00.000Z"
}
```

---

### 2️⃣ LIST All Templates

```http
GET http://localhost:3001/templates
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response:**
```json
[
  {
    "id": "template-uuid-1",
    "title": "Template 1",
    "items": "{}",
    "tenantId": "tenant-uuid-here",
    "createdAt": "2024-11-29T07:00:00.000Z",
    "updatedAt": "2024-11-29T07:00:00.000Z"
  },
  {
    "id": "template-uuid-2",
    "title": "Template 2",
    "items": "{\"key\": \"value\"}",
    "tenantId": "tenant-uuid-here",
    "createdAt": "2024-11-29T08:00:00.000Z",
    "updatedAt": "2024-11-29T08:00:00.000Z"
  }
]
```

---

### 3️⃣ GET Single Template

```http
GET http://localhost:3001/templates/TEMPLATE_ID_HERE
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response:**
```json
{
  "id": "template-uuid-here",
  "title": "My Template",
  "items": "{\"item1\": \"value1\"}",
  "tenantId": "tenant-uuid-here",
  "createdAt": "2024-11-29T07:00:00.000Z",
  "updatedAt": "2024-11-29T07:00:00.000Z"
}
```

---

### 4️⃣ UPDATE Template

```http
PATCH http://localhost:3001/templates/TEMPLATE_ID_HERE
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE

{
  "title": "Updated Template Title",
  "items": "{\"item1\": \"updated_value\"}"
}
```

**Note:** Title ya items dono optional hain. Jo update karna ho wo bhejo.

**Response:**
```json
{
  "id": "template-uuid-here",
  "title": "Updated Template Title",
  "items": "{\"item1\": \"updated_value\"}",
  "tenantId": "tenant-uuid-here",
  "createdAt": "2024-11-29T07:00:00.000Z",
  "updatedAt": "2024-11-29T09:00:00.000Z"
}
```

---

### 5️⃣ SOFT DELETE Template

```http
DELETE http://localhost:3001/templates/TEMPLATE_ID_HERE
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Response:**
```json
{
  "id": "template-uuid-here",
  "title": "My Template",
  "items": "{}",
  "tenantId": "tenant-uuid-here",
  "deletedAt": "2024-11-29T10:00:00.000Z",
  "createdAt": "2024-11-29T07:00:00.000Z",
  "updatedAt": "2024-11-29T10:00:00.000Z"
}
```

---

## 🌐 Chrome Browser Mein Kaise Test Karein

### Method 1: Browser Console (F12)

1. Chrome mein koi bhi page kholen
2. **F12** press karein (Developer Tools)
3. **Console** tab mein jayein
4. Ye code paste karein:

```javascript
// Step 1: Login
fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Login Response:', data);
  const token = data.access_token;
  
  // Step 2: Create Template
  fetch('http://localhost:3001/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Test Template',
      items: '{}'
    })
  })
  .then(res => res.json())
  .then(data => console.log('Create Template:', data));
  
  // Step 3: List Templates
  fetch('http://localhost:3001/templates', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => console.log('List Templates:', data));
});
```

---

### Method 2: Postman / Thunder Client (VS Code Extension)

1. **Postman** install karein ya VS Code mein **Thunder Client** extension
2. Collection banayein:
   - Login request
   - Template CRUD requests
3. JWT token ko variable mein save karein
4. Har request mein `Authorization: Bearer {{token}}` use karein

---

### Method 3: curl Command (Terminal)

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Create Template (TOKEN ko replace karein)
curl -X POST http://localhost:3001/templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My Template","items":"{}"}'

# List Templates
curl -X GET http://localhost:3001/templates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔐 Important Notes

1. **JWT Token Required:** Har template API call mein `Authorization: Bearer TOKEN` header zaroori hai
2. **Tenant Isolation:** Har tenant ko sirf apne templates dikhenge
3. **Soft Delete:** Delete karne se record permanently delete nahi hota, sirf `deletedAt` set hota hai
4. **Tenant ID:** Automatically JWT token se extract hota hai, manually bhejne ki zaroorat nahi

---

## 🐛 Common Errors

### Error: "Tenant ID is required"
**Solution:** JWT token sahi hai ya nahi check karein. Pehle login karein.

### Error: "Template not found"
**Solution:** 
- Template ID sahi hai ya nahi check karein
- Template aapke tenant ka hai ya nahi verify karein
- Template pehle soft delete ho chuka hai ya nahi check karein

### Error: "Network error" / CORS error
**Solution:** 
- Backend server chal raha hai ya nahi check karein: `http://localhost:3001`
- CORS settings check karein

---

## 📊 Complete API Flow Example

```javascript
// Complete flow example
async function testTemplates() {
  // 1. Login
  const loginRes = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@test.com',
      password: 'password123'
    })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('Token:', token);
  
  // 2. Create Template
  const createRes = await fetch('http://localhost:3001/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'My Test Template',
      items: '{"key": "value"}'
    })
  });
  const created = await createRes.json();
  console.log('Created:', created);
  const templateId = created.id;
  
  // 3. List Templates
  const listRes = await fetch('http://localhost:3001/templates', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const templates = await listRes.json();
  console.log('All Templates:', templates);
  
  // 4. Get Single Template
  const getRes = await fetch(`http://localhost:3001/templates/${templateId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const template = await getRes.json();
  console.log('Single Template:', template);
  
  // 5. Update Template
  const updateRes = await fetch(`http://localhost:3001/templates/${templateId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Updated Title'
    })
  });
  const updated = await updateRes.json();
  console.log('Updated:', updated);
  
  // 6. Soft Delete Template
  const deleteRes = await fetch(`http://localhost:3001/templates/${templateId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const deleted = await deleteRes.json();
  console.log('Deleted:', deleted);
}

// Run function
testTemplates();
```

---

## 🎯 Quick Test URLs (Copy-Paste Ready)

### Login
```
POST http://localhost:3001/auth/login
Body: {"email":"admin@test.com","password":"password123"}
```

### Create Template
```
POST http://localhost:3001/templates
Headers: Authorization: Bearer YOUR_TOKEN
Body: {"title":"Test Template","items":"{}"}
```

### List Templates
```
GET http://localhost:3001/templates
Headers: Authorization: Bearer YOUR_TOKEN
```

### Update Template
```
PATCH http://localhost:3001/templates/TEMPLATE_ID
Headers: Authorization: Bearer YOUR_TOKEN
Body: {"title":"Updated Title"}
```

### Delete Template
```
DELETE http://localhost:3001/templates/TEMPLATE_ID
Headers: Authorization: Bearer YOUR_TOKEN
```


