# Trading Platform v2

A modern trading platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Secure Authentication**: Login and registration with JWT tokens
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ⚡ **Fast Performance**: Built with Next.js 15 and optimized for speed
- 🔄 **Token Refresh**: Automatic token refresh handling
- 🛡️ **Middleware Protection**: Route protection with Next.js middleware

## Authentication Flow

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "emailOrUsername": "user@example.com",
    "password": "password123",
    "twoFactorCode": null,
    "rememberMe": false
  }
  ```
- **Response**:
  ```json
  {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
  ```

### Register
- **Endpoint**: `POST /api/users/register`
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "phoneNumber": "+1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "hashed_password"
  }
  ```

## Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_URL=https://api.salesvault.dev
```

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx          # Landing page
├── lib/                   # Utility libraries
│   ├── api.ts            # API client functions
│   ├── auth.ts           # Authentication manager
│   └── cookies.ts        # Cookie utilities
└── middleware.ts         # Next.js middleware for route protection
```

## Authentication Manager

The `AuthManager` class provides centralized token management:

- **Token Storage**: Automatically stores access and refresh tokens
- **Token Refresh**: Handles automatic token refresh
- **Cookie Management**: Syncs tokens between localStorage and cookies
- **Authentication Check**: Provides easy authentication status checking

## API Integration

The platform integrates with the SalesVault API at `https://api.salesvault.dev`:

- All API calls include proper error handling
- Bearer token authentication for protected endpoints
- Automatic token refresh on 401 responses
- TypeScript interfaces for type safety

## Security Features

- **JWT Tokens**: Secure token-based authentication
- **Route Protection**: Middleware protects private routes
- **Token Refresh**: Automatic token renewal
- **Secure Storage**: Tokens stored in both localStorage and cookies
- **CSRF Protection**: Built-in Next.js security features

## Development

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first CSS framework
- **Next.js 15**: Latest React framework with App Router

## Deployment

The application is ready for deployment on Vercel, Netlify, or any other Next.js-compatible platform.

## License

This project is proprietary and confidential.
