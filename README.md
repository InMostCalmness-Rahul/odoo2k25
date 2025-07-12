# 🔄 SkillSwap Platform

A MERN-based **Skill Swap Platform** where users can list their skills, request swaps from others, manage interactions, and give feedback. Admins monitor misuse and moderate content.

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
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

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

### Backend
- **Express.js** (API framework)
- **MongoDB + Mongoose** (Database)
- **bcryptjs** (Password hashing)
- **jsonwebtoken** (Authentication)
- **Helmet, CORS, Rate Limiting** (Security)
- **Winston + Morgan** (Logging)

## 🔑 Key Features

### User Features
- ✅ User authentication (JWT + refresh tokens)
- ✅ Profile creation & management
- ✅ Browse & search users by skills
- ✅ Send & manage swap requests
- ✅ Rating & feedback system
- ✅ Profile privacy controls

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
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/update` - Update user profile
- `GET /api/users` - Search public users

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


## 👥 Development Team

| Name         | Role                        | Email / Contact         |
|--------------|-----------------------------|------------------------|
| Dev Owais    | Fullstack Architect         |                        |
| Dev A        | Frontend Builder            |                        |
| Dev B        | Data Integrator             |                        |
| Dev C        | QA + UI Polish + Docs       |                        |

<!-- Add your real names, emails, GitHub links, or other contact info above -->

## 📋 Development Status

### ✅ Completed
- [x] Project structure setup
- [x] Basic React app with routing
- [x] Express server with middleware
- [x] MongoDB models (User, SwapRequest)
- [x] Authentication context
- [x] Basic UI components and pages
- [x] API route placeholders

### 🚧 In Progress
- [ ] Authentication controllers
- [ ] User management
- [ ] Swap request functionality
- [ ] Form validation
- [ ] File upload (Cloudinary)

### 📅 Upcoming
- [ ] Admin panel
- [ ] Real-time notifications
- [ ] Advanced search & filters
- [ ] Mobile responsiveness
- [ ] Testing & deployment

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

1. Follow the role-specific guidelines in `planning & docs/roles/`
2. Use the existing code structure and patterns
3. Ensure all code passes linting (ESLint/Prettier)
4. Test thoroughly before submitting PRs
5. Update documentation for new features

## 📄 License

This project is for educational purposes.
