# CafeZero Backend

CafeZero is a modern, feature-rich backend for an online food-ordering application. Built with Node.js, Express, and MongoDB, it provides a secure and scalable foundation for managing users, authentication, and food orders.

## 🚀 Features

- **Robust Authentication**:
  - Email/Password Signup and Login.
  - Social Login via Google OAuth 2.0 (Passport.js).
  - Secure JSON Web Token (JWT) based authentication.
  - Password Reset functionality with email verification.
- **User Management**:
  - User profiles and role-based access control (User/Admin).
- **Order Management**:
  - API endpoints for placing and managing food orders.
- **Security**:
  - Password hashing with `bcryptjs`.
  - Secure cookie handling.
  - CORS configuration for frontend integration.
- **Error Handling**:
  - Centralized global error handler with environment-specific responses.
  - Custom error classes for operational errors.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: Passport.js, JWT, Bcryptjs
- **Utils**: Nodemailer (Email), Validator, Lodash

## 📁 Project Structure

```text
server/
├── Controllers/      # Business logic & request handling
├── Middlewares/      # Custom authentication & role middlewares
├── Models/           # Mongoose schemas & data models
├── Routers/          # Route definitions
├── Utils/            # Helper functions, Passport config, & Error classes
├── app.js            # Express application configuration
├── server.js         # Entry point & DB connection
└── config.env        # Environment variables (Sensitive)
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `config.env` file in the root directory with the following variables:
   ```env
   PORT=8080
   LOCAL_DB_URL=mongodb://localhost:27017/cafezero
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=90d
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   ```

4. **Run the application**:
   ```bash
   # Development mode (with nodemon)
   npm start
   ```

## 🛣️ API Endpoints Summary

### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/google` - Initiate Google OAuth
- `POST /api/v1/auth/forgotPassword` - Request password reset

### User
- `GET /api/v1/user/profile` - Get current user profile | Protected route
- `PATCH /api/v1/user/profile` - Update user profile | Protected route
- `PATCH /api/v1/user/update-password` - Update user password | Protected route
- `PATCH /api/v1/user/delete-account` - Delete user account | Protected route

### Orders  
- `POST /api/v1/order` - Place a new order | Protected route
- `GET /api/v1/order` - Get all orders (for the logged-in user) | Protected route

---
Developed by Simply_
