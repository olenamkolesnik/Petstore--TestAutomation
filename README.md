# Petstore Test Automation

![Playwright](https://img.shields.io/badge/Playwright-Next-46B582?logo=microsoft&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-yellow)

A comprehensive test automation suite for the **Petstore API** using **Playwright** and **TypeScript**. This project includes API testing for user management endpoints with extensive test coverage, schema validation, retry mechanisms, and structured logging.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Test Organization](#test-organization)
- [API Client](#api-client)
- [Utilities & Helpers](#utilities--helpers)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Comprehensive API Testing**: Full test coverage for user management endpoints (create, read, update, delete, login, logout)
- **TypeScript**: Type-safe test code with full IDE support
- **Playwright**: Fast, reliable browser/API automation framework
- **Schema Validation**: JSON schema validation for API responses using AJV
- **Retry Mechanism**: Built-in retry logic for flaky tests
- **Structured Logging**: Configurable logging with multiple log levels
- **HTML Reports**: Detailed HTML test reports with traces
- **Environment Management**: Easy environment configuration with dotenv
- **Organized Test Structure**: Logically grouped tests by functionality and scenario type

## 📦 Prerequisites

- **Node.js**: v18 or higher (LTS recommended)
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **Petstore API Access**: Tests run against the Swagger Petstore API at `https://petstore.swagger.io`

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Petstore-TestAutomation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   API_USERNAME=your_username
   API_PASSWORD=your_password
   LOG_LEVEL=INFO
   ```

4. **Verify installation**
   ```bash
   npm run lint
   ```

## ⚙️ Configuration

### Environment Variables

The following environment variables can be configured in your `.env` file:

| Variable | Default | Description |
|----------|---------|-------------|
| `API_USERNAME` | - | Username for API authentication |
| `API_PASSWORD` | - | Password for API authentication |
| `LOG_LEVEL` | `INFO` | Logging level (DEBUG, INFO, WARN, ERROR) |
| `CI` | - | Set by CI/CD to enable CI-specific behavior |

### Playwright Configuration

Configuration is defined in `playwright.config.ts`:

- **Base URL**: `https://petstore.swagger.io`
- **Parallel Execution**: Enabled by default
- **Reporting**: HTML report generation
- **Trace Collection**: On first retry for failed tests
- **Retries**: 2 retries on CI, 0 in local environment

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Positive Tests Only
Tests tagged with `@positive`:
```bash
npm run test:positive
```

### Run Tests in Debug Mode
Open Playwright Inspector for step-by-step debugging:
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npx playwright test tests/user/create/create-positive.spec.ts
```

### Run Tests Matching a Pattern
```bash
npx playwright test --grep "login"
```

### View HTML Report
```bash
npx playwright show-report
```

## 📂 Project Structure

```
Petstore-TestAutomation/
├── tests/                          # Test specifications
│   └── user/
│       ├── create/                 # User creation tests
│       │   ├── create-positive.spec.ts
│       │   ├── create-negative-business.spec.ts
│       │   └── create-negative-protocol.spec.ts
│       ├── delete/                 # User deletion tests
│       ├── get/                    # User retrieval tests
│       ├── login/                  # Login tests
│       ├── logout/                 # Logout tests
│       └── update/                 # User update tests
├── src/                            # Source code (API client, utilities)
│   └── api/
│       ├── clients/
│       │   └── userClient.ts       # API client for user endpoints
│       ├── constants/
│       │   ├── constants.ts        # Application constants
│       │   └── endpoints.ts        # API endpoint definitions
│       ├── fixtures/
│       │   └── loginFixture.ts     # Test fixtures and setup
│       ├── models/
│       │   ├── APIResponse.ts      # API response model
│       │   ├── ApiResponseWrapper.ts
│       │   ├── UserDefaults.ts     # Default user values
│       │   ├── UserModel.ts        # User data model
│       │   ├── factories/
│       │   │   └── createUserPayload.ts  # Test data factory
│       │   └── schemas/
│       │       ├── responseSchema.ts     # JSON schema for responses
│       │       └── userSchema.ts        # JSON schema for user model
│       └── utils/
│           ├── env.ts              # Environment variable management
│           ├── logger.ts           # Logging utility
│           ├── responseWrapper.ts  # Response wrapping and validation
│           ├── retry.ts            # Retry mechanism
│           └── schemaValidator.ts  # JSON schema validation
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Project dependencies and scripts
├── playwright-report/              # Generated HTML reports
└── README.md                       # This file
```

## 🧬 Test Organization

### Test Structure by Category

**Positive Tests** (`@positive` tag):
- Happy path scenarios
- Valid input validation
- Expected success responses

**Negative Tests** (`@negative` tag):
- Invalid business logic scenarios
- Boundary condition tests
- Resource not found scenarios
- Invalid request formats
- Missing required fields
- Malformed data

### Test Coverage

- **User Creation**: Positive and negative scenarios
- **User Retrieval**: Get user by username
- **User Updates**: Modify existing user data
- **User Deletion**: Remove users
- **Authentication**: Login and logout flows

## 🔌 API Client

The `UserClient` class provides a type-safe interface to the Petstore API:

```typescript
import UserClient from './src/api/clients/userClient';

// In your test:
const client = new UserClient(request);

// Login
const loginResponse = await client.login('username', 'password');

// Create user
const createResponse = await client.createUser(userPayload);

// Get user
const getResponse = await client.getUser('username');

// Update user
const updateResponse = await client.updateUser('username', updatedPayload);

// Delete user
const deleteResponse = await client.deleteUser('username');

// Logout
const logoutResponse = await client.logout();
```

### Features

- **Automatic Retry**: Built-in retry mechanism for transient failures
- **Response Wrapping**: Automatic response validation and wrapping
- **Schema Validation**: JSON schema validation for all responses
- **Structured Logging**: Detailed logs for debugging and audit trails

## 🛠️ Utilities & Helpers

### Logger (`logger.ts`)
Provides structured logging with configurable log levels:
```typescript
import { logger } from './src/api/utils/logger';

logger.debug('Debug message', { context: 'data' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### Retry (`retry.ts`)
Automatic retry mechanism for handling transient failures:
```typescript
import { retry } from './src/api/utils/retry';

const result = await retry(async () => {
  return await someAsyncOperation();
});
```

### Schema Validation (`schemaValidator.ts`)
Validates API responses against JSON schemas using AJV:
```typescript
import { validateSchema } from './src/api/utils/schemaValidator';

const isValid = validateSchema(data, schema);
```

### Response Wrapper (`responseWrapper.ts`)
Wraps API responses with validation and error handling:
```typescript
import { wrapResponse } from './src/api/utils/responseWrapper';

const response = await wrapResponse(apiResponse, schema);
```

### Environment Management (`env.ts`)
Centralized environment variable management:
```typescript
import { env, requireEnv } from './src/api/utils/env';

const username = env.username;
const password = requireEnv('API_PASSWORD', env.password);
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow the code style**: Use existing patterns for new tests
3. **Add tests**: Include positive and negative test scenarios
4. **Update documentation**: Keep README and comments current
5. **Submit a pull request** with a clear description of changes

### Code Style

- Use TypeScript with strict mode enabled
- Follow naming conventions: camelCase for variables, PascalCase for classes
- Add JSDoc comments to public methods
- Keep tests focused and descriptive

## 📝 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

**Questions or Issues?** Open an issue on GitHub or contact the project maintainers.
