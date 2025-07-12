# 🔄 SkillSwap Platform

A MERN-based **Skill Swap Platform** where users can list their skills, request swaps from others, manage interactions, and give feedback. Admins monitor misuse and moderate content.


## 👥 Development Team

| Name         | Role                        | Email / Contact                |
|--------------|-----------------------------|------------------------        |
| Owais        | Fullstack Architect         |  oaak78692@gmail.com           |
| Sujal        | Frontend Builder            |  sujalagarwal230104@gmail.com  |
| Rahul        | Data Integrator             |  singhrahul161104@gmail.com    |
| Sonia        | QA + UI Polish + Docs       |  rawatsonia2003@gmail.com      |


## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone & Setup
```bash
git clone <repo-url>
cd odoo2k25
```

### 2. Backend Setup
```bash
cd server
npm install
# Copy .env.example to .env and configure your variables
cp .env.example .env
# Update MongoDB URI and JWT secrets in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/api/health

## 📚 Documentation

- **[Development Setup Guide](./DEVELOPMENT_SETUP.md)** - Complete development environment setup
- **[User Guide](./USER_GUIDE.md)** - How to use the platform as an end user
- **[API Documentation](./server/API_DOCUMENTATION.md)** - Complete API reference
- **[Database Schema](./server/SCHEMA_DOCUMENTATION.md)** - Database design and relationships

## 📁 Project Structure

```
odoo2k25/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/           # Axios setup & API calls
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React contexts (Auth, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route protection
│   │   └── utils/         # Helper functions
│   └── package.json
├── server/                # Express Backend
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth, validation, error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Helper utilities
│   └── package.json
└── planning & docs/      # Project documentation
    ├── plan.md
    └── roles/            # Team role definitions
```

## 🛠️ Tech Stack

### Frontend
- **React** (Functional components + Hooks)
- **React Router DOM** (Navigation)
- **Axios** (API calls)
- **Socket.io Client** (Real-time features)
- **TailwindCSS** (Styling)
- **React Hook Form + Zod** (Form validation)
- **React Toastify** (Notifications)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Date-fns** (Date formatting)

### Backend
- **Express.js** (API framework)
- **MongoDB + Mongoose** (Database)
- **bcryptjs** (Password hashing)
- **jsonwebtoken** (Authentication)
- **Socket.io** (Real-time communications)
- **Cloudinary + Multer** (Profile photo upload & storage)
- **Helmet, CORS, Rate Limiting** (Security)
- **Winston + Morgan** (Logging)

## 🔑 Key Features

### User Features
- ✅ User authentication (JWT + refresh tokens)
- ✅ Profile creation & management with photo uploads (Cloudinary integration)
- ✅ Browse & search users by skills with advanced filtering
- ✅ Send & manage swap requests with intuitive modal interface
- ✅ **Rating & feedback system with real-time notifications**
- ✅ Profile privacy controls
- ✅ Responsive design with mobile support
- ✅ **Real-time notifications via Socket.io**
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Advanced pagination and search
- ✅ Smooth animations and micro-interactions
- ✅ **Comprehensive user profile views with reviews**

### Admin Features
- ✅ **Complete admin dashboard with full functionality**
- ✅ **User management and moderation**
- ✅ **Ban/unban users with reason tracking**
- ✅ **User account deletion with data cleanup**
- ✅ **Platform statistics and analytics**
- ✅ **Activity reports and monitoring**
- ✅ **Swap request oversight and management**
- ✅ **Admin role protection and security**

### Real-time Features
- ✅ **Live notifications for new swap requests**
- ✅ **Real-time status updates for accepted/rejected requests**
- ✅ **Instant feedback notifications**
- ✅ **Online/offline user status indicators**
- ✅ **Typing indicators (ready for chat feature)**

## 🧩 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/upload-photo` - Upload profile photo (see below)
- `DELETE /api/users/me` - Delete user account
- `GET /api/users` - Search public users
- `GET /api/users/:userId` - Get specific user profile
- `POST /api/users/:userId/feedback` - Add user feedback

#### 📸 Profile Photo Upload (Cloudinary)

- **Endpoint:** `POST /api/users/upload-photo`
- **Auth:** Bearer JWT required
- **Request:** `multipart/form-data` with `profilePhoto` field (JPG, PNG, GIF, WEBP, max 5MB)
- **Response:**
  - On success: `{ success: true, message, profilePhoto: <url>, user: { ... } }`
  - On error: `{ success: false, error: <message> }`
- **Features:**
  - Auto-resize to 500x500px, face detection crop
  - Old photo auto-deleted on new upload
  - CDN delivery, auto-optimization
  - See API docs for full details and examples

### Swap Requests
- `POST /api/swap` - Create swap request
- `GET /api/swap` - Get user's swap requests
- `PATCH /api/swap/:id` - Accept/reject request
- `DELETE /api/swap/:id` - Delete request

### Admin (Protected)
- `GET /api/admin/users` - Get all users with filtering
- `GET /api/admin/user/:id` - Get user details (bypass privacy)
- `PATCH /api/admin/user/:id/ban` - Ban/unban user
- `DELETE /api/admin/user/:id` - Delete user account
- `GET /api/admin/swaps` - Get all swap requests
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/reports` - Generate activity reports

## 🔒 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```



## 📋 Development Status

### ✅ Completed Features
- [x] **Project Structure & Setup**
  - [x] Modern React app with TypeScript-ready structure
  - [x] Express.js backend with security middleware
  - [x] MongoDB with Mongoose ODM
  - [x] Environment configuration and documentation

- [x] **Authentication System** 
  - [x] JWT + Refresh token implementation
  - [x] Secure login/signup with bcrypt password hashing
  - [x] HttpOnly cookies for refresh tokens
  - [x] Auth middleware and route protection
  - [x] Token refresh mechanism

- [x] **User Management**
  - [x] Complete user profile system
  - [x] Profile photo upload with Cloudinary integration
  - [x] Skills offered/wanted management
  - [x] Privacy controls (public/private profiles)
  - [x] User search and filtering
  - [x] Account deletion functionality

- [x] **Swap Request System**
  - [x] Create, update, delete swap requests
  - [x] Accept/reject request functionality
  - [x] Status tracking (pending, accepted, rejected, completed)
  - [x] Request filtering and pagination
  - [x] Comprehensive request management

- [x] **Rating & Feedback System**
  - [x] User rating and review system
  - [x] Average rating calculation
  - [x] Feedback display and management
  - [x] Real-time rating updates

- [x] **Real-time Features**
  - [x] Socket.io integration for live notifications
  - [x] Real-time swap request notifications
  - [x] Live status updates for requests
  - [x] Typing indicators (ready for chat)
  - [x] Online/offline user status

- [x] **Admin Dashboard**
  - [x] Complete admin panel implementation
  - [x] User management and moderation
  - [x] Ban/unban user functionality
  - [x] User deletion with data cleanup
  - [x] Platform statistics and analytics
  - [x] Activity reports generation
  - [x] Swap request monitoring

- [x] **Frontend UI/UX**
  - [x] Professional design with TailwindCSS
  - [x] Responsive mobile-first design
  - [x] Form validation with React Hook Form + Zod
  - [x] Loading states and error handling
  - [x] Toast notification system
  - [x] Advanced search, filtering, and pagination
  - [x] Smooth animations with Framer Motion
  - [x] Modal interfaces and components
  - [x] Accessibility compliance (WCAG 2.1)

- [x] **File Upload & Storage**
  - [x] Cloudinary integration for profile photos
  - [x] Auto-resize and optimization
  - [x] Face detection crop
  - [x] Old photo cleanup on new uploads

### � In Progress
- [ ] Enhanced email notification system
- [ ] Advanced analytics dashboard improvements
- [ ] Performance optimizations
- [ ] Comprehensive testing suite

### 📅 Future Enhancements
- [ ] Mobile app development (React Native)
- [ ] Advanced matching algorithms
- [ ] Video call integration
- [ ] Multi-language support
- [ ] Advanced reporting features

## 🔧 Scripts

### Backend
```bash
npm start     # Production server
npm run dev   # Development with nodemon
```

### Frontend
```bash
npm run dev   # Development server
npm run build # Production build
npm run preview # Preview production build
```

## 🤝 Contributing

1. Use the existing code structure and patterns
2. Ensure all code passes linting (ESLint/Prettier)
3. Test thoroughly before submitting PRs
4. Update documentation for new features

## 📄 License

This project is for educational purposes.
