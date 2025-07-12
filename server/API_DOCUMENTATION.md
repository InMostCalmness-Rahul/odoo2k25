# SkillSwap Platform API Documentation

## Overview
This is a RESTful API for the SkillSwap Platform, built with Express.js, MongoDB, and JWT authentication. The API now includes real-time features via Socket.io for notifications and live updates.

## Base URL
```
http://localhost:5000/api
```

## Real-time Features
The API includes Socket.io integration for real-time notifications:
- **Socket URL**: `http://localhost:5000`
- **Authentication**: JWT token required in socket handshake
- **Events**: New swap requests, status updates, feedback notifications

### Socket.io Events
- `notification` - Real-time notifications
- `user_status_update` - Online/offline status updates  
- `user_typing` / `user_stopped_typing` - Typing indicators

## Authentication
Most endpoints require JWT authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "message": "Optional message",
  "data": "Response data (varies by endpoint)",
  "error": "Error message (only on failures)"
}
```

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",                    // Required: 2-100 characters, letters and spaces only
  "email": "john@example.com",           // Required: Valid email address
  "password": "Password123",             // Required: Min 6 chars, must contain lowercase, uppercase, and number
  "location": "New York, NY",            // Optional: Max 200 characters
  "skillsOffered": ["JavaScript"],       // Optional: Array of strings, max 20 skills, 100 chars each
  "skillsWanted": ["Photography"],       // Optional: Array of strings, max 20 skills, 100 chars each
  "availability": ["weekends"]           // Optional: Array from: weekdays, weekends, evenings, mornings, afternoons, flexible
}
```

**Minimal Request Body (only required fields):**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": { /* user object */ },
  "accessToken": "jwt_token_here"
}
```

### POST /auth/login
Authenticate a user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { /* user object */ },
  "accessToken": "jwt_token_here"
}
```

### POST /auth/logout
Logout the current user (clears refresh token).

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### POST /auth/refresh
Refresh access token using refresh token (sent via HTTP-only cookie).

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "new_jwt_token_here"
}
```

---

## 👤 User Endpoints

### GET /users/me
Get current user's profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "location": "New York, NY",
    "skillsOffered": ["JavaScript", "Guitar"],
    "skillsWanted": ["Photography", "Spanish"],
    "availability": ["weekends", "evenings"],
    "isPublic": true,
    "rating": 4.5,
    "feedbackCount": 10
  }
}
```

### PUT /users/me
Update current user's profile (requires authentication).

**Request Body:**
```json
{
  "name": "John Smith",
  "location": "Los Angeles, CA",
  "skillsOffered": ["React", "Node.js"],
  "skillsWanted": ["Python", "Data Science"],
  "availability": ["weekdays"],
  "isPublic": false
}
```

### POST /users/upload-photo
Upload a profile photo for the authenticated user.

**Authentication:**
Bearer JWT required in `Authorization` header.

**Request:**
- `multipart/form-data` with a single file field:
  - `profilePhoto` (file, required): JPG, JPEG, PNG, GIF, WEBP, max 5MB
  - Will be auto-resized to 500x500px, face detection crop

**Response:**
On success:
```json
{
  "success": true,
  "message": "Profile photo uploaded successfully",
  "profilePhoto": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/skillswap/profiles/profile_userId_timestamp.jpg",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePhoto": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/skillswap/profiles/profile_userId_timestamp.jpg"
    // ... other user fields
  }
}
```
On error:
```json
{
  "success": false,
  "error": "<error message>"
}
```

**Features:**
- Auto-optimization, CDN delivery
- Face detection cropping
- Old photo auto-deleted on new upload
- Previous photo deleted on account deletion

**Usage Example (Axios):**
```js
const formData = new FormData();
formData.append('profilePhoto', file);
const response = await axios.post('/api/users/upload-photo', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

**Usage Example (cURL):**
```bash
curl -X POST \
  http://localhost:5000/api/users/upload-photo \
  -H "Authorization: Bearer <access_token>" \
  -F "profilePhoto=@/path/to/photo.jpg"
```

**Notes:**
- Photos are stored in `skillswap/profiles` on Cloudinary
- All uploads include a timestamp for unique filenames
- The profile photo URL is updated in the user's profile

### DELETE /users/me
Delete user account (soft delete - requires authentication).

### GET /users
Search public users.

**Query Parameters:**
- `skill` - Filter by skill (searches both offered and wanted)
- `location` - Filter by location (partial match)
- `availability` - Filter by availability
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)
- `sort` - Sort order: 'rating', 'newest', 'name' (default: 'rating')

**Response:**
```json
{
  "success": true,
  "users": [
    { /* user objects */ }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /users/:userId
Get public profile of a specific user.

### POST /users/:userId/feedback
Add feedback/rating to a user (requires authentication).

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great teacher, very patient!"
}
```

---

## 🔄 Swap Request Endpoints

### POST /swap
Create a new swap request (requires authentication).

**Request Body:**
```json
{
  "toUser": "target_user_id",
  "offeredSkill": "JavaScript",
  "requestedSkill": "Guitar",
  "message": "Hi! I'd love to learn guitar in exchange for JavaScript tutoring.",
  "scheduledDate": "2024-02-15T14:00:00Z",
  "duration": "2 hours",
  "meetingType": "online",
  "meetingDetails": "We can use Zoom or Google Meet"
}
```

### GET /swap
Get current user's swap requests (requires authentication).

**Query Parameters:**
- `type` - 'sent', 'received', or 'all' (default: 'all')
- `status` - Filter by status: 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

### GET /swap/:requestId
Get specific swap request by ID (requires authentication).

### PATCH /swap/:requestId
Update swap request status (requires authentication).

**Request Body:**
```json
{
  "status": "accepted", // or "rejected", "completed", "cancelled"
  "rejectionReason": "Not available at that time", // optional, for rejected status
  "cancellationReason": "Schedule conflict" // optional, for cancelled status
}
```

### DELETE /swap/:requestId
Delete a swap request (requires authentication, only sender can delete pending/rejected requests).

---

## 👑 Admin Endpoints

All admin endpoints require authentication and admin role.

### GET /admin/users
Get all users with filtering options.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)
- `status` - 'active', 'inactive', or 'all' (default: 'all')
- `role` - 'user', 'admin', or 'all' (default: 'all')
- `search` - Search in name, email, or location

### PATCH /admin/user/:userId/ban
Ban or unban a user.

**Request Body:**
```json
{
  "reason": "Inappropriate behavior" // optional
}
```

### DELETE /admin/user/:userId
Permanently delete a user and all related data.

**Request Body:**
```json
{
  "confirm": true // required for confirmation
}
```

### GET /admin/swaps
Get all swap requests with filtering options.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)
- `status` - Filter by status or 'all' (default: 'all')
- `sort` - 'newest', 'oldest', 'status' (default: 'newest')

### GET /admin/stats
Get platform statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 150,
      "active": 140,
      "public": 120,
      "admins": 2,
      "recent": 15
    },
    "requests": {
      "total": 89,
      "pending": 12,
      "accepted": 35,
      "completed": 25,
      "recent": 8
    },
    "popularSkills": [
      { "skill": "JavaScript", "count": 25 },
      { "skill": "Guitar", "count": 18 }
    ]
  }
}
```

### GET /admin/reports
Generate activity reports.

**Query Parameters:**
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)
- `format` - 'json' (default) or 'csv'

---

## 🔍 Health Check

### GET /health
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Express-validator for all inputs
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Access tokens (15m) + Refresh tokens (7d) in HTTP-only cookies
- **Sanitization**: Input sanitization and MongoDB injection protection

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and update values.

3. **Seed the database:**
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Test the API:**
   The API will be available at `http://localhost:5000/api`

---

## 📝 Sample Accounts (After Seeding)

- **Admin:** admin@skillswap.com / admin123
- **User:** john.smith@email.com / password123
- **More users:** Check the seed script output for additional accounts

---

## 🧪 Testing

Use tools like Postman, Insomnia, or curl to test the endpoints. Remember to:

1. Authenticate first using `/auth/login`
2. Use the returned access token in subsequent requests
3. Check the browser's cookies for refresh tokens (HTTP-only)

---

## 📋 TODO / Future Enhancements

- [ ] Email verification for new accounts
- [ ] Password reset functionality
- [ ] Real-time notifications (Socket.io)
- [ ] File upload to cloud storage (Cloudinary)
- [ ] Advanced search with Elasticsearch
- [ ] API rate limiting per user
- [ ] Comprehensive test suite
- [ ] API versioning
- [ ] Documentation with Swagger/OpenAPI
