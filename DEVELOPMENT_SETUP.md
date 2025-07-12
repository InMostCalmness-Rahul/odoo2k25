# 🛠️ SkillSwap Platform Development Setup Guide

This comprehensive guide will help you set up the SkillSwap Platform development environment on your local machine.

## 📋 Prerequisites

### Required Software
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### Recommended Tools
- **MongoDB Compass** - GUI for MongoDB management
- **Postman** - API testing tool
- **Chrome DevTools** - Browser debugging

## 🚀 Quick Start (5 minutes)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillswap-platform
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cd ../server
   cp .env.example .env
   
   cd ../client
   cp .env.example .env
   ```

4. **Start MongoDB**
   ```bash
   # Start MongoDB service (varies by OS)
   # Windows: MongoDB service should start automatically
   # macOS: brew services start mongodb/brew/mongodb-community
   # Linux: sudo systemctl start mongod
   ```

5. **Start the development servers**
   ```bash
   # From project root, start both frontend and backend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 📁 Project Structure Overview

```
skillswap-platform/
├── client/                    # React Frontend Application
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── api/             # API integration layer
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route configuration
│   │   └── utils/           # Utility functions
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
├── server/                   # Express Backend Application
│   ├── config/              # Configuration files
│   ├── controllers/         # Route handler logic
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions
│   ├── package.json         # Backend dependencies
│   └── server.js            # Server entry point
│
├── planning & docs/         # Project documentation
├── package.json             # Root package.json for scripts
└── README.md               # Project overview
```

## 🔧 Detailed Setup Instructions

### 1. Backend Setup

#### Environment Configuration
Create a `.env` file in the `server/` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/skillswap

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Frontend URL
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

#### Generate JWT Secrets
```bash
# Generate random secrets for JWT
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Database Setup
```bash
# Start MongoDB
# Windows (if not running as service)
mongod --dbpath "C:\data\db"

# Create database and seed data
cd server
npm run seed
```

#### Install and Start Backend
```bash
cd server
npm install
npm run dev
```

### 2. Frontend Setup

#### Environment Configuration
Create a `.env` file in the `client/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Socket.io Configuration
VITE_SOCKET_URL=http://localhost:5000
```

#### Install and Start Frontend
```bash
cd client
npm install
npm run dev
```

### 3. Full Stack Development

#### Concurrent Development
From the project root, you can run both frontend and backend simultaneously:

```bash
# Install concurrently if not already installed
npm install -g concurrently

# Start both servers
npm run dev
```

## 🗄️ Database Setup and Management

### MongoDB Installation

#### Windows
1. Download MongoDB Community Server
2. Run the installer with default settings
3. MongoDB will start as a Windows service automatically

#### macOS (with Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### Ubuntu/Debian
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Database Seeding
```bash
# From the server directory
cd server
npm run seed

# This will create:
# - Sample users with various skills
# - Example swap requests
# - Test feedback and ratings
```

### Database Management
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use skillswap database
use skillswap

# Show collections
show collections

# Find all users
db.users.find().pretty()

# Find all swap requests
db.swaprequests.find().pretty()
```

## 🔌 API Development and Testing

### Using Postman
1. Import the Postman collection (if available)
2. Set up environment variables:
   - `baseURL`: http://localhost:5000/api
   - `accessToken`: Your JWT token after login

### Manual API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### WebSocket Testing
```javascript
// Test Socket.io connection in browser console
const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_token_here' }
});

socket.on('connect', () => console.log('Connected!'));
socket.on('notification', (data) => console.log('Notification:', data));
```

## 🎨 Frontend Development

### Adding New Components
```bash
# Create a new component
touch client/src/components/MyNewComponent.jsx

# Follow the existing patterns:
# - Use functional components with hooks
# - Include PropTypes for type checking
# - Add proper accessibility attributes
# - Use TailwindCSS for styling
```

### Component Structure Template
```jsx
import React, { useState, useEffect } from 'react';
import { SomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic here
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-white rounded-lg shadow"
    >
      {/* Component content */}
    </motion.div>
  );
};

export default MyComponent;
```

### Styling Guidelines
- Use TailwindCSS utility classes
- Follow the existing color scheme (blue/green/gray)
- Ensure mobile responsiveness
- Add hover and focus states
- Use consistent spacing (4, 8, 16, 24, 32px)

## 🔧 Backend Development

### Adding New API Endpoints

1. **Create the route**
   ```javascript
   // server/routes/myRoutes.js
   const express = require('express');
   const router = express.Router();
   const myController = require('../controllers/myController');
   const { auth } = require('../middleware/auth');

   router.get('/my-endpoint', auth, myController.getMyData);
   router.post('/my-endpoint', auth, myController.createMyData);

   module.exports = router;
   ```

2. **Create the controller**
   ```javascript
   // server/controllers/myController.js
   const MyModel = require('../models/MyModel');
   const logger = require('../utils/logger');

   const getMyData = async (req, res) => {
     try {
       const data = await MyModel.find();
       res.json({ success: true, data });
     } catch (error) {
       logger.error('Error:', error);
       res.status(500).json({ success: false, error: 'Server error' });
     }
   };

   module.exports = { getMyData };
   ```

3. **Add the route to app.js**
   ```javascript
   // server/app.js
   const myRoutes = require('./routes/myRoutes');
   app.use('/api/my-resource', myRoutes);
   ```

### Database Models
```javascript
// server/models/MyModel.js
const mongoose = require('mongoose');

const mySchema = new mongoose.Schema({
  field1: { type: String, required: true },
  field2: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('MyModel', mySchema);
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# End-to-end tests
npm run test:e2e
```

### Writing Tests
```javascript
// Example backend test
describe('Auth Controller', () => {
  test('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap
# ... other production configs
```

### Build for Production
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔍 Debugging and Troubleshooting

### Common Issues

#### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Database connection issues
```bash
# Check MongoDB status
# Windows: services.msc → MongoDB Server
# macOS: brew services list
# Linux: sudo systemctl status mongod
```

#### Port already in use
```bash
# Find and kill process using port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -ti:5000 | xargs kill
```

### Debugging Tools
- **VS Code Debugger**: Set breakpoints and debug Node.js
- **React DevTools**: Browser extension for React debugging
- **MongoDB Compass**: Visual database explorer
- **Network Tab**: Monitor API requests in browser DevTools

### Logging
```bash
# View server logs
tail -f server/logs/combined.log

# View error logs only
tail -f server/logs/error.log
```

## 🤝 Contributing Guidelines

### Code Style
- Use ESLint and Prettier for consistent formatting
- Follow existing naming conventions
- Write descriptive commit messages
- Add comments for complex logic

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Make changes and commit
git add .
git commit -m "Add new feature: description"

# Push and create pull request
git push origin feature/my-new-feature
```

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit pull request with description

## 📚 Additional Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Learning Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/learn)
- [MongoDB University](https://university.mongodb.com/)

### Community
- GitHub Issues for bug reports
- Discussions for feature requests
- Stack Overflow for general questions

---

🎉 **You're all set!** The SkillSwap Platform should now be running locally. Happy coding!
