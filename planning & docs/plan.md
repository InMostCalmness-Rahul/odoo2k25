## 🧱 0. 🔧 Project Overview (Elevator Pitch)

A MERN-based **Skill Swap Platform** where users can list their skills, request swaps from others, manage interactions, and give feedback. Admins monitor misuse and moderate content. The system prioritizes simplicity, transparency, and community growth.

---

## 🧪 1. Tech Stack (Production-Ready)

### Frontend (React) ✅ **COMPLETED**

* **React** (Functional components + Hooks)
* **React Router DOM** (Page navigation)
* **Axios** (API calls)
* **TailwindCSS** (Lightweight, fast UI)
* **React Hook Form + Zod** (Validation)
* **React Toastify** (Notifications)
* **Framer Motion** (Animations)
* **Lucide React** (Icons)
* **JWT handling with HttpOnly cookies**

### Backend (Node.js + Express)

* **Express.js** (API framework)
* **MongoDB + Mongoose** (Schema modeling)
* **bcrypt** (Password hashing)
* **jsonwebtoken** (Auth with refresh tokens)
* **Cloudinary** (Image hosting)
* **Multer** (Image upload middleware)
* **Winston + Morgan** (Logging)
* **Helmet, CORS, Express-Rate-Limit** (Security)

---

## 🏗️ 2. Folder Structure (MERN Best Practice)

### 🌐 `client/` (React App)

```
client/
│
├── public/
│
├── src/
│   ├── api/                 # Axios instances & API functions
│   ├── assets/              # Static files
│   ├── components/          # Reusable UI components
│   ├── context/             # Global state (AuthContext, UserContext)
│   ├── hooks/               # Custom hooks (useAuth, useForm, etc.)
│   ├── pages/               # Page components (Home, Profile, etc.)
│   ├── routes/              # React Router pages
│   ├── styles/              # Tailwind config or CSS modules
│   ├── utils/               # Token management, validators
│   └── App.jsx
│   └── main.jsx
│
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

### 🔙 `server/` (Express Backend)

```
server/
│
├── controllers/        # Logic for routes
├── middleware/         # Auth, error, role checks
├── models/             # Mongoose schemas
├── routes/             # API routes (modular)
├── services/           # Business logic, token generation
├── utils/              # Validators, sanitizers
│
├── .env                # Secrets
├── app.js              # Express app config
├── server.js           # Entry point
├── package.json
```

---

## 📋 3. Features (Modular & Prioritized)

### 🧑‍💻 User Features

| Feature                 | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| 👤 **User Auth**        | Signup/Login (JWT + Refresh Token)                                                      |
| 📝 **Profile Creation** | Name, location, availability, profile pic, skills offered/wanted, public/private toggle |
| 🔍 **Browse/Search**    | Filter users by skill, availability                                                     |
| 🔁 **Request Swap**     | Choose own skill, request other's, send message                                         |
| 📥 **View Requests**    | View incoming/outgoing requests (Pending/Accepted/Rejected)                             |
| ⚖️ **Accept/Reject**    | Accept/reject swap request                                                              |
| ⭐ **Ratings/Feedback**  | After swap completion                                                                   |
| 🔒 **Profile Privacy**  | Only public profiles visible in search                                                  |
| 🧹 **Delete Requests**  | If request not accepted                                                                 |

---

### 🛡️ Admin Features

| Feature                      | Description                                 |
| ---------------------------- | ------------------------------------------- |
| ❌ **Ban User**               | Soft ban on abuse/spam                      |
| 🔎 **Moderate Descriptions** | Reject inappropriate skill listings         |
| 📊 **Reports**               | Download logs of user activity, feedback    |
| 📢 **Broadcast Messages**    | Site-wide announcements (downtime, updates) |
| 🧾 **View Swap Stats**       | List of active/cancelled swaps              |

---

## 🧩 4. Key Backend Models (Mongoose)

### User Model

```js
{
  name: String,
  email: String,
  password: String (hashed),
  location: String,
  skillsOffered: [String],
  skillsWanted: [String],
  availability: [String], // ["weekends", "evenings"]
  profilePhoto: String,
  isPublic: Boolean,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  rating: Number, // avg from feedbacks
  feedbacks: [{ from: ObjectId, rating: Number, comment: String }],
  createdAt: Date,
}
```

---

### SwapRequest Model

```js
{
  fromUser: ObjectId,
  toUser: ObjectId,
  offeredSkill: String,
  requestedSkill: String,
  message: String,
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: Date,
}
```

---

## 🔐 5. Auth Flow 

* **Signup** → Store hashed password (bcrypt), send refresh + access tokens
* **Login** → Issue tokens, set refresh token in HttpOnly cookie
* **Auth Middleware** → Validates JWT for protected routes
* **Logout** → Clear cookie
* **Refresh Token Route** → Refreshes access token on expiry

---

## 📁 6. Must-Have Files 

### Frontend ✅ **FULLY IMPLEMENTED**

* `App.jsx`, `main.jsx` ✅
* `axios.js` (central API setup) ✅
* `authContext.js` (global user state) ✅
* `ProtectedRoute.jsx` (route guard) ✅
* `components/SwapCard.jsx` ✅
* `components/Button.jsx` (enhanced with animations) ✅
* `components/LoadingSpinner.jsx` (skeleton loaders) ✅
* `components/Card.jsx` (reusable with variants) ✅
* `components/SwapRequestModal.jsx` ✅
* `pages/Home.jsx` (advanced search/filtering) ✅
* `pages/Login.jsx` (professional form validation) ✅
* `pages/Profile.jsx` (complete management interface) ✅
* `pages/Requests.jsx` (tab-based with status tracking) ✅
* `utils/toast.js` (notification helpers) ✅

### Backend

* `app.js` (middleware, routes setup)
* `server.js` (entry)
* `routes/authRoutes.js`, `userRoutes.js`, `swapRoutes.js`, `adminRoutes.js`
* `controllers/authController.js`, etc.
* `middleware/auth.js`, `middleware/roleCheck.js`
* `.env` for secrets

---

## ⚙️ 7. API Endpoint Plan (RESTful)

### User

| Method | Route                | Description      |
| ------ | -------------------- | ---------------- |
| `POST` | `/api/auth/signup`   | Register         |
| `POST` | `/api/auth/login`    | Login            |
| `POST` | `/api/auth/logout`   | Logout           |
| `GET`  | `/api/user/me`       | Get self profile |
| `PUT`  | `/api/user/update`   | Edit profile     |
| `GET`  | `/api/users?skill=x` | Public search    |

### Swap

\| `POST` | `/api/swap` | Request a swap |
\| `GET` | `/api/swap` | View all requests (auth user) |
\| `PATCH` | `/api/swap/:id` | Accept/Reject |
\| `DELETE` | `/api/swap/:id` | Delete |

### Admin

\| `GET` | `/api/admin/reports` | Download activity logs |
\| `PATCH` | `/api/admin/user/:id/ban` | Ban a user |
\| `GET` | `/api/admin/swaps` | View all swaps |

---

## 🔥 8. Implementation Status

### ✅ **COMPLETED - Frontend/UI Layer**

**Phase 1: Core UI/UX (100% Complete)**
* ✅ Modern React app with TypeScript-ready structure
* ✅ Complete authentication flow UI with validation
* ✅ Professional user profile management interface
* ✅ Advanced search and filtering for user discovery
* ✅ Responsive design with mobile-first approach
* ✅ Toast notification system for user feedback
* ✅ Loading states and error handling throughout
* ✅ Smooth animations and micro-interactions
* ✅ Accessibility compliance (WCAG 2.1)
* ✅ Modal interfaces for swap requests
* ✅ Tab-based request management system
* ✅ Protected routes and navigation guards

**Phase 2: Enhanced Components**
* ✅ Reusable Button component with variants and animations
* ✅ Card components with hover effects and variants
* ✅ Loading spinners and skeleton loaders
* ✅ Form validation with real-time feedback
* ✅ Advanced pagination controls
* ✅ Search debouncing and filter management
* ✅ Responsive grid layouts

### 🚧 **IN PROGRESS - Backend Integration**

**Phase 3: API Integration (Backend Developer)**
* [ ] Connect authentication flow to backend
* [ ] User profile CRUD operations
* [ ] Swap request functionality
* [ ] File upload integration (Cloudinary)
* [ ] Real-time notifications

**Phase 4: Admin Features (Backend Developer)**
* [ ] Admin dashboard functionality
* [ ] User management and moderation
* [ ] Content moderation tools
* [ ] Analytics and reporting

### 📅 **UPCOMING - Additional Features**

**Phase 5: Advanced Features**
* [ ] Real-time notifications with Socket.io
* [ ] Advanced matching algorithms
* [ ] Email notification system
* [ ] Mobile app development
* [ ] Performance optimization
* [ ] Testing suite and deployment

---

## 📉 9. Stretch Goals (Post MVP)

* Real-time notifications with Socket.io
* Skill-matching algorithm
* Email confirmations
* Trust score per user (based on past swaps)
* Leaderboard of top-rated users
* Mobile-first PWA

---

## 💡 10. Key Points

* Prioritize modularity: write small, testable functions.
* Protect every API with proper validation and role checks.
* Don't hard-code anything — configs in `.env`, UI in reusable components.
* Log everything (Winston), but don’t expose to client.
* Test often. Break early. Fail fast.

