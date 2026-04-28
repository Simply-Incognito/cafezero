const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const globalErrorHandler = require(`${__dirname}/Controllers/globalErrorHandler`);
const CustomError = require(`${__dirname}/Utils/CustomError`);

const app = express();

// CORS configuration - allows frontend from different origin to make requests with credentials
app.use(cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Session middleware (must be before passport)
app.use(session({
    secret: process.env.SESSION_SECRET || "simplyASecretKeyForSessionManagement",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // Prevents JavaScript from accessing the cookie
        secure: false, // Set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport strategies
require(`${__dirname}/Utils/passport`);

// Routers
const authRouter = require(`${__dirname}/Routers/authRoute`);
const userRouter = require(`${__dirname}/Routers/userRoute`);
const orderRouter = require(`${__dirname}/Routers/orderRoute`);
const foodRouter = require(`${__dirname}/Routers/foodRoute`);


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/food', foodRouter);

// Default routes
app.use((req, res, next) => {
    const error = new CustomError("How did you get here?", 404);
    next(error);
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;