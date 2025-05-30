# Contributing to Helium Device Manager

Thank you for your interest in contributing to the Helium Device Manager! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/helium-device-manager.git
   cd helium-device-manager
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Project

```bash
# Start the development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### Coding Standards

- Follow the TypeScript style guide
- Write tests for new features
- Keep components modular and reusable
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure internationalization support for user-facing text

## Pull Request Process

1. **Update your fork** to include the latest changes from the main repository
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Run the test suite** to make sure everything passes
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your branch**
7. **Open a Pull Request** against the main branch

### Pull Request Guidelines

- Give your PR a descriptive title
- Fill out the PR template completely
- Link any related issues using GitHub's keywords (e.g., "Fixes #123")
- Be responsive to feedback and comments

## Bug Reports and Feature Requests

Please use the issue templates when submitting bugs or feature requests.

### Bug Reports

When reporting a bug, please include:

- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/environment information

### Feature Requests

When requesting a feature, please include:

- Clear description of the proposed feature
- Rationale for adding the feature
- Any relevant use cases
- Mock-ups or wireframes (if applicable)

## Translation Contributions

We support multiple languages (English, Spanish, French, German). If you'd like to contribute translations:

1. Check the `/src/locales` directory for existing translation files
2. Add or modify translations as needed
3. Run `npm run check-translations` to verify consistency

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license.

## Questions?

If you have any questions about contributing, feel free to open an issue or reach out to the maintainers directly.

Thank you for helping make the Helium Device Manager better!
