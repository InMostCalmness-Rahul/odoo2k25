## 🧱 0. 🔧 Project Overview (Elevator Pitch)

A MERN-based **Skill Swap Platform** where users can list their skills, request swaps from others, manage interactions, and give feedback. Admins monitor misuse and moderate content. The system prioritizes simplicity, transparency, and community growth.

---

## 🧪 1. Tech Stack (Production-Ready)

### Frontend (React)

* **React** (Functional components + Hooks)
* **React Router DOM** (Page navigation)
* **Axios** (API calls)
* **TailwindCSS** (Lightweight, fast UI)
* **React Hook Form + Zod** (Validation)
* **React Toastify** (Notifications)
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

### Frontend

* `App.jsx`, `main.jsx`
* `axios.js` (central API setup)
* `authContext.js` (global user state)
* `ProtectedRoute.jsx` (route guard)
* `components/SwapCard.jsx`
* `pages/Home.jsx`, `Login.jsx`, `Profile.jsx`, `Requests.jsx`

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

## 🔥 8. First Sprint

**Hour 1–2**

* Auth System (Signup/Login)
* Create/Edit Profile
* Seed initial users

**Hour 3**

* Public profile listing (search, filter)
* View full user profile
* Send swap request

**Hour 4**

* Accept/Reject logic
* View requests dashboard

**Hour 5**

* Profile privacy + Ratings/Feedback
* Basic admin (ban, log download)

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

