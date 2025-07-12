# Contributing to SkillSwap Platform

Thank you for your interest in contributing to the SkillSwap Platform! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git
- Code editor (VS Code recommended)

### Setting Up Development Environment
1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install` in both `/client` and `/server` directories
4. Set up environment variables (see `.env.example` files)
5. Start development servers: `npm run dev` from the root directory

## 📋 Development Guidelines

### Code Style and Standards
- **ESLint & Prettier**: All code must pass linting checks
- **Naming Conventions**: 
  - Use camelCase for variables and functions
  - Use PascalCase for React components
  - Use kebab-case for file names
- **Comments**: Add meaningful comments for complex logic
- **Documentation**: Update relevant documentation for new features

### Git Workflow
- **Branch Naming**: 
  - `feature/description` for new features
  - `fix/description` for bug fixes
  - `docs/description` for documentation updates
  - `refactor/description` for code refactoring

- **Commit Messages**: Follow conventional commits format
  ```
  feat: add user profile photo upload
  fix: resolve JWT token refresh issue
  docs: update API documentation
  refactor: improve error handling middleware
  ```

### Testing Requirements
- Write unit tests for new functions and components
- Test API endpoints with various input scenarios
- Ensure responsive design works on mobile devices
- Verify accessibility compliance (WCAG 2.1)

## 🏗️ Architecture Guidelines

### Backend (Express.js + MongoDB)
- **Controllers**: Handle HTTP requests/responses only
- **Services**: Contain business logic
- **Middleware**: For authentication, validation, and error handling
- **Models**: Define MongoDB schemas with validation
- **Utils**: Helper functions and utilities

### Frontend (React + TailwindCSS)
- **Components**: Small, reusable, single-purpose components
- **Pages**: Route-level components
- **Hooks**: Custom hooks for data fetching and state management
- **Context**: For global state (auth, socket, user)
- **Utils**: Helper functions and constants

### Security Best Practices
- Always validate and sanitize user input
- Use parameterized queries to prevent injection attacks
- Implement proper authentication and authorization
- Never expose sensitive data in API responses
- Use HTTPS in production
- Implement rate limiting for API endpoints

## 🔧 Development Workflow

### Before Starting Work
1. Check existing issues and pull requests
2. Create or comment on an issue to discuss your approach
3. Create a new branch from `main`
4. Set up your development environment

### During Development
1. Write clean, readable code
2. Add appropriate comments and documentation
3. Test your changes thoroughly
4. Ensure all linting checks pass
5. Update relevant documentation

### Before Submitting PR
1. Run all tests and ensure they pass
2. Update CHANGELOG.md with your changes
3. Ensure your branch is up to date with `main`
4. Write a clear PR description

## 📝 Pull Request Guidelines

### PR Description Template
```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests passed
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes introduced
```

### Review Process
1. All PRs require at least one review
2. Address all reviewer feedback
3. Ensure CI checks pass
4. Squash commits if requested
5. Maintainer will merge after approval

## 🐛 Bug Reports

### Before Reporting
- Check if the bug is already reported
- Try to reproduce the issue
- Gather relevant information (browser, OS, steps to reproduce)

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 95]
- Version: [e.g., v1.0.0]

**Additional Context**
Screenshots, error logs, etc.
```

## 💡 Feature Requests

### Before Requesting
- Check if the feature is already requested or planned
- Consider if it fits the project scope
- Think about implementation complexity

### Feature Request Template
```markdown
**Feature Description**
Clear description of the desired feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other approaches you've considered

**Additional Context**
Mockups, examples, etc.
```

## 📚 Documentation

### Types of Documentation
- **Code Comments**: Inline documentation for complex logic
- **API Documentation**: Endpoint descriptions and examples
- **User Guide**: How to use the platform
- **Development Setup**: Environment setup instructions
- **Architecture**: System design and patterns

### Documentation Standards
- Use clear, concise language
- Include code examples where helpful
- Keep documentation up to date with code changes
- Use proper markdown formatting

## 🎯 Areas for Contribution

### High Priority
- Performance optimizations
- Accessibility improvements
- Security enhancements
- Test coverage increase
- Documentation improvements

### Medium Priority
- UI/UX enhancements
- Additional admin features
- Email notification system
- Advanced search capabilities
- Analytics improvements

### Future Features
- Mobile app development
- Video call integration
- Multi-language support
- Advanced matching algorithms
- Integration with external services

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas
- **Email**: Contact team members directly for urgent matters

### Team Members
- **Owais**: Fullstack Architect (oaak78692@gmail.com)
- **Sujal**: Frontend Builder (sujalagarwal230104@gmail.com)
- **Rahul**: Data Integrator (singhrahul161104@gmail.com)
- **Sonia**: QA + UI Polish + Docs (rawatsonia2003@gmail.com)

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to the SkillSwap Platform! 🎉
