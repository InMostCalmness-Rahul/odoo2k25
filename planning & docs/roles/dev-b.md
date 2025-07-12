
# 🧩 Dev B — Data Integrator

## Role
Bridge the gap between frontend and backend by managing all data flow, API integration, and state management. Responsible for setting up robust API communication, handling authentication tokens, and ensuring data consistency and error handling across the app.

## Responsibilities
- **API Layer:** Set up Axios base instance and modular API functions for all backend endpoints (auth, user, swap, admin). Ensure all requests are DRY and reusable.
- **State Management:** Implement and maintain AuthContext, UserContext, and custom hooks to manage global and local state efficiently.
- **Token Handling:** Manage JWT and refresh token logic securely, ensuring tokens are stored and refreshed according to best practices (HttpOnly cookies, no sensitive data in localStorage).
- **Error Handling:** Implement comprehensive error handling and user notifications (React Toastify), providing fallback messages for network/system errors.
- **Data Validation:** Validate all data before sending to backend, and sanitize/format responses for frontend use.
- **Performance:** Optimize network calls (caching, minimal requests, batching where possible) to improve app speed and reduce server load.
- **Code Quality:** Avoid hardcoded values; use constants/config files. Run and fix linter issues (ESLint). Document integration patterns and utilities.

## Collaboration
- **UI Integration:** Work closely with Dev A to ensure UI components receive and display data correctly, and that API errors are handled gracefully in the UI.
- **API Contracts:** Sync with Dev Owais to clarify backend API contracts, suggest improvements, and report integration issues.
- **Knowledge Sharing:** Share custom hooks, utilities, and integration patterns with the team for consistency and reusability.

# 📝 TODO
[ ] Create src/api and utils folders with clear structure
[ ] Set up Axios base instance for API calls
[ ] Implement modular API functions for all endpoints (auth, user, swap, admin)
[ ] Build and document AuthContext, UserContext for global state
[ ] Handle JWT/refresh token logic securely (HttpOnly cookies, refresh flow)
[ ] Add comprehensive error handling and user notifications (React Toastify)
[ ] Write custom hooks for data fetching, mutation, and caching
[ ] Validate and sanitize all data before sending to backend
[ ] Avoid hardcoded values (use constants/config files)
[ ] Run and fix linter (ESLint) issues; enforce code style
[ ] Optimize network calls (caching, batching, minimal requests)
[ ] Document integration patterns, hooks, and utilities for team use
