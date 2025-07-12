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
- **TailwindCSS** (Styling)
- **React Hook Form + Zod** (Form validation)
- **React Toastify** (Notifications)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)

### Backend
- **Express.js** (API framework)
- **MongoDB + Mongoose** (Database)
- **bcryptjs** (Password hashing)
- **jsonwebtoken** (Authentication)
- **Cloudinary + Multer** (Profile photo upload & storage)
- **Helmet, CORS, Rate Limiting** (Security)
- **Winston + Morgan** (Logging)

## 🔑 Key Features

### User Features
- ✅ User authentication (JWT + refresh tokens)
- ✅ Profile creation & management with photo uploads (Cloudinary integration)
- ✅ Browse & search users by skills with advanced filtering
- ✅ Send & manage swap requests with intuitive modal interface
- ✅ Rating & feedback system
- ✅ Profile privacy controls
- ✅ Responsive design with mobile support
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Advanced pagination and search
- ✅ Smooth animations and micro-interactions

### Admin Features
- ✅ User management & moderation
- ✅ Content moderation
- ✅ Activity reports
- ✅ System announcements

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
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/user/:id/ban` - Ban/unban user
- `GET /api/admin/reports` - Download reports

## 🔒 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```



## 📋 Development Status

### ✅ Completed
- [x] Project structure setup
- [x] Modern React app with routing and context
- [x] Express server with security middleware
- [x] MongoDB models (User, SwapRequest)
- [x] Authentication context and JWT handling
- [x] Complete UI/UX implementation with professional design
- [x] Responsive components with TailwindCSS
- [x] Form validation with React Hook Form + Zod
- [x] Loading states and error handling
- [x] Toast notification system
- [x] Advanced search, filtering, and pagination
- [x] Smooth animations with Framer Motion
- [x] Modal interfaces for swap requests
- [x] Protected routes and navigation
- [x] Comprehensive component library

### 🚧 Backend Integration Needed
- [ ] Authentication controllers implementation
- [ ] User management API integration
- [ ] Swap request CRUD operations
- [x] File upload (Cloudinary) integration ✅ **COMPLETED** (see above)
- [ ] Real-time notifications backend

### 📅 Additional Features
- [ ] Admin panel backend functionality
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app development
- [ ] Testing suite and deployment

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
