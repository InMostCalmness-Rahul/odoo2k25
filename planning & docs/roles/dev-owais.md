
# 🧠 Dev Owais — Fullstack Architect

## Role
Lead the overall technical architecture and backend development of the Skill Swap Platform. Responsible for designing robust, scalable, and secure server-side systems, and ensuring seamless integration with the frontend. Acts as the technical backbone for authentication, API design, and infrastructure decisions.

## Responsibilities
- **Project Structure:** Establish and maintain a clean, modular folder structure for both client (React) and server (Express) codebases, following MERN best practices.
- **Backend Core Logic:** Architect and implement the Express app, including middleware, error handling, and Mongoose ODM setup for MongoDB.
- **Database Schema Design:** Design well-structured Mongoose schemas for User and SwapRequest, ensuring proper relationships, data types, and validation.
- **Authentication & Security:** Implement secure authentication using JWT (access/refresh tokens), bcrypt for password hashing, and HttpOnly cookies. Apply security best practices (Helmet, CORS, rate limiting, input sanitization).
- **API Development:** Develop RESTful APIs for user, swap, and admin features. Ensure endpoints are modular, well-documented, and follow REST conventions.
- **Initial Data Seeding:** Create scripts or logic to seed initial users and data for development/testing.
- **Documentation:** Maintain up-to-date API documentation and schema diagrams for team reference.
- **Code Quality:** Enforce backend coding standards, run linters, and review PRs for maintainability, performance, and security.
- **Performance Optimization:** Profile and optimize database queries, memory usage, and network efficiency.

## Collaboration
- **API Contracts:** Work closely with frontend (Dev A, Dev B) to define and document API contracts, ensuring smooth integration.
- **Code Reviews:** Review backend and integration PRs, provide feedback, and mentor team members on best practices.
- **Support:** Assist Dev B with API integration and troubleshooting backend-related issues.

# 📝 TODO
[x] Scaffold server/ and client/ folders with clear structure
[x] Set up Express app, connect to MongoDB with Mongoose
[x] Design and document User and SwapRequest schemas (relationships, data types, validation)
[x] Implement authentication (signup, login, JWT, refresh, logout)
[x] Set up middleware (auth, role-based access, error handling)
[x] Build modular user, swap, and admin routes/controllers
[x] Apply security best practices (Helmet, CORS, rate limiting, input sanitization)
[x] Seed initial users and test data
[x] Write and maintain API documentation and schema diagrams
[x] Validate and sanitize all backend inputs (use express-validator or custom logic)
[x] Ensure no hardcoded values (use .env/config files for secrets and constants)
[x] Add comprehensive error handling and fallback messages for all endpoints
[x] Run and fix linter (ESLint) issues; enforce code style
[x] Review backend PRs for code quality, security, and performance
[x] Profile and optimize backend for performance (queries, memory, network)
