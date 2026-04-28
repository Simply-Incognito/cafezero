# CafeZero - Project Code Flow Analysis

This document provides a detailed breakdown of the CafeZero backend architecture, connecting the various components and explaining how data flows through the system.

## 1. Application Entry Point (`server.js`)
The execution starts here.
- **Environment Configuration**: It first loads environment variables from `config.env` using `dotenv`. This ensures that sensitive information like database URLs and secrets are available throughout the app.
- **Database Connection**: It establishes a connection to MongoDB via Mongoose using the `LOCAL_DB_URL` defined in the environment variables.
- **Server Initialization**: It imports the configured Express app from `app.js` and starts the server on a specified port (defaulting to 8080).

## 2. Express Application Configuration (`app.js`)
This file is the "brain" of the Express application where middlewares and routes are integrated.
- **Middlewares**:
    - `cors`: Handles Cross-Origin Resource Sharing, allowing the frontend (likely on port 3000) to communicate with the backend.
    - `express.json()`: Parses incoming JSON payloads.
    - `cookieParser()`: Parses cookies from the request headers.
    - `session()`: Manages user sessions, which is crucial for the Passport.js authentication flow.
    - `passport.initialize()` & `passport.session()`: Initializes Passport for authentication.
- **Route Mounting**: It mounts the major routers under the `/api/v1` prefix:
    - `/api/v1/auth` -> `authRouter`
    - `/api/v1/user` -> `userRouter`
    - `/api/v1/order` -> `orderRouter`
- **Error Handling**: It defines a catch-all route for 404 errors and uses a `globalErrorHandler` to manage all application errors in one place.

## 3. Routing Layer (`Routers/`)
Routers define the available endpoints and map them to specific controller functions.
- `authRoute.js`: Handles authentication-related endpoints (Signup, Login, Google OAuth, Password Reset).
- `userRoute.js`: Handles user profile management and administrative tasks.
- `orderRoute.js`: Handles order placement and retrieval.

## 4. Business Logic Layer (`Controllers/`)
Controllers contain the actual logic for processing requests.
- `authController.js`: Contains logic for creating users, validating credentials, generating JWTs, and handling Google OAuth callbacks.
- `userController.js`: Manages user data, updates, and deletions.
- `orderController.js`: Manages the lifecycle of a food order.
- `globalErrorHandler.js`: A centralized controller that formats and sends error responses to the client based on the environment (Development vs. Production).

## 5. Data Models (`Models/`)
Mongoose models define the schema and structure of the data stored in MongoDB.
- `userModel.js`: Defines the user schema, including fields for name, email, password (hashed), role, and OAuth IDs. It also contains middleware for password hashing and verification.
- `orderModel.js`: Defines the schema for food orders, linking them to specific users.

## 6. Authentication & Security (`Middlewares/` & `Utils/`)
- `authMiddleware.js`: Contains functions to protect routes (ensuring a user is logged in) and restrict access based on user roles (e.g., admin vs. user).
- `passport.js`: Configures Passport strategies, specifically the Google OAuth 2.0 strategy for social login.
- **JWT (JSON Web Tokens)**: Used for stateless authentication. After a successful login, a token is generated and sent to the client (often via cookies).

## 7. Utilities & Error Handling (`Utils/`)
- `CustomError.js`: A custom class extending the native `Error` class to include operational properties like `statusCode`.
- `asyncErrorHandler.js`: A wrapper function used in controllers to catch asynchronous errors without repetitive try-catch blocks, passing them to the global error handler.
- `email.js`: A utility using `nodemailer` to send emails (e.g., for password resets).

## 8. Summary of Request Flow
1. **Request** hits `server.js` -> `app.js`.
2. **Middlewares** process the request (CORS, JSON parsing, Session/Passport).
3. **Router** identifies the endpoint and calls the corresponding **Controller**.
4. **Middleware (Optional)**: If the route is protected, `authMiddleware` verifies the JWT or Session.
5. **Controller** interacts with the **Model** to perform CRUD operations on the database.
6. **Response** is sent back to the client.
7. **Error**: If anything goes wrong, the `asyncErrorHandler` catches it and forwards it to the `globalErrorHandler`, which sends a structured error response.
