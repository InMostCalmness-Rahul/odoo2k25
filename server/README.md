# SkillSwap Platform Backend

## 🚀 Overview
A robust Node.js/Express backend for the SkillSwap Platform - a MERN-based application where users can exchange skills, create swap requests, and build a learning community.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh tokens)
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **Logging**: Winston + Morgan
- **File Upload**: Multer + Cloudinary
- **Validation**: Express-validator
- **Password Hashing**: bcryptjs

## 📋 Features
- 🔐 **Secure Authentication** - JWT with refresh token rotation
- 👤 **User Management** - Profile creation, updates, privacy controls
- 🔍 **Skill Discovery** - Search and filter users by skills
- 🔄 **Swap Requests** - Create, manage, and track skill exchanges
- ⭐ **Rating System** - User feedback and ratings
- 👑 **Admin Panel** - User management, statistics, reports
- 🛡️ **Security** - Rate limiting, input validation, XSS protection
- 📊 **Logging** - Comprehensive logging for monitoring and debugging

## 🏗 Project Structure
```
server/
├── controllers/          # Request handlers and business logic
│   ├── authController.js      # Authentication (signup, login, logout, refresh)
│   ├── userController.js      # User profile management
│   ├── swapController.js      # Swap request operations
│   └── adminController.js     # Admin panel functionality
├── middleware/           # Custom middleware
│   ├── auth.js               # JWT authentication & authorization
│   ├── validation.js         # Input validation rules
│   └── errorHandler.js       # Global error handling
├── models/              # Mongoose schemas
│   ├── User.js               # User schema with feedback system
│   └── SwapRequest.js        # Swap request schema
├── routes/              # API route definitions
│   ├── authRoutes.js         # Authentication endpoints
│   ├── userRoutes.js         # User management endpoints
│   ├── swapRoutes.js         # Swap request endpoints
│   └── adminRoutes.js        # Admin panel endpoints
├── utils/               # Utility functions
│   └── logger.js             # Winston logger configuration
├── .env                 # Environment variables
├── app.js               # Express app configuration
├── server.js            # Server entry point
├── seed.js              # Database seeding script
└── package.json         # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   NODE_ENV=development
   PORT=5000
   
   MONGODB_URI=your_mongodb_connection_string
   
   JWT_SECRET=your_jwt_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   CLIENT_URL=http://localhost:5173
   
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token

### User Management
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile
- `DELETE /users/me` - Delete user account
- `GET /users` - Search public users
- `GET /users/:userId` - Get specific user profile
- `POST /users/:userId/feedback` - Add user feedback
- `POST /users/upload-photo` - Upload profile photo

### Swap Requests
- `POST /swap` - Create swap request
- `GET /swap` - Get user's swap requests
- `GET /swap/:requestId` - Get specific swap request
- `PATCH /swap/:requestId` - Update swap request status
- `DELETE /swap/:requestId` - Delete swap request

### Admin Panel
- `GET /admin/users` - Get all users
- `PATCH /admin/user/:userId/ban` - Ban/unban user
- `DELETE /admin/user/:userId` - Delete user
- `GET /admin/swaps` - Get all swap requests
- `GET /admin/stats` - Get platform statistics
- `GET /admin/reports` - Generate activity reports

### Health Check
- `GET /health` - API health status

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🗄 Database Schema

### User Model
- Personal information (name, email, location)
- Skills offered and wanted
- Availability and preferences
- Rating and feedback system
- Profile privacy settings

### SwapRequest Model
- Users involved (from/to)
- Skills being exchanged
- Request status and scheduling
- Meeting preferences
- Completion tracking

For detailed schema information, see [SCHEMA_DOCUMENTATION.md](./SCHEMA_DOCUMENTATION.md)

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (user, admin)
- Secure password hashing with bcrypt
- HTTP-only cookies for refresh tokens

### Input Validation & Sanitization
- Comprehensive input validation using express-validator
- XSS protection and data sanitization
- MongoDB injection prevention
- File upload restrictions and validation

### Security Headers & Rate Limiting
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Rate limiting to prevent abuse
- Request size limits

## 📊 Logging & Monitoring

### Logger Configuration
- Winston for structured logging
- Morgan for HTTP request logging
- Different log levels for development/production
- Error tracking and monitoring

### Log Files
- `error.log` - Error-level logs
- `combined.log` - All logs
- Console output in development

## 🧪 Development

### Available Scripts
```bash
npm start         # Start production server
npm run dev       # Start development server with nodemon
npm run seed      # Seed database with sample data
npm run lint      # Run ESLint
npm run lint:fix  # Fix ESLint issues automatically
```

### Code Quality
- ESLint configuration for consistent code style
- Pre-commit hooks for code quality
- Comprehensive error handling
- Input validation on all endpoints

### Testing
```bash
# Test API endpoints
npm test          # Run test suite (when implemented)

# Manual testing
npm run seed      # Create test data
# Use Postman/Insomnia with provided collection
```

## 🔧 Configuration

### Environment Variables
All configuration is handled through environment variables in `.env`:

- **Server**: PORT, NODE_ENV
- **Database**: MONGODB_URI
- **Authentication**: JWT secrets and expiration times
- **File Upload**: Cloudinary credentials
- **Security**: Rate limiting, CORS settings

### Middleware Configuration
- **Authentication**: JWT verification for protected routes
- **Validation**: Request validation using express-validator
- **Error Handling**: Global error handler with appropriate responses
- **Logging**: Request/response logging in development

## 📈 Performance

### Database Optimization
- Strategic indexing on frequently queried fields
- Query optimization with proper selection and population
- Pagination for large result sets

### Caching
- Mongoose query caching (ready for implementation)
- Redis caching layer (ready for implementation)

### Monitoring
- Performance metrics logging
- Database query performance tracking
- Error rate monitoring

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB URI
- [ ] Set secure JWT secrets
- [ ] Configure CORS for production domain
- [ ] Set up proper logging
- [ ] Configure file upload limits
- [ ] Set up monitoring and alerts

### Docker Support (Future)
```dockerfile
# Dockerfile ready for containerization
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make changes following the coding standards
4. Run tests and linting
5. Submit a pull request

### Coding Standards
- ESLint configuration enforced
- Consistent error handling patterns
- Comprehensive input validation
- Proper logging and monitoring

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Schema Documentation](./SCHEMA_DOCUMENTATION.md) - Database schema details
- [Postman Collection](./postman_collection.json) - API testing collection

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB connection string
# Ensure MongoDB is running (local) or accessible (Atlas)
# Verify network access and credentials
```

**JWT Token Issues**
```bash
# Check JWT secrets in .env
# Verify token expiration times
# Clear browser cookies and localStorage
```

**File Upload Errors**
```bash
# Check Cloudinary credentials
# Verify file size limits
# Ensure proper multer configuration
```

### Getting Help
- Check the logs for detailed error messages
- Verify environment variable configuration
- Ensure database connectivity
- Review API documentation for proper request format

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Acknowledgments
- Express.js team for the excellent framework
- Mongoose team for the ODM
- All open-source contributors whose packages make this possible
