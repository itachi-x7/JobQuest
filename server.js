// Importing necessary packages and modules

// Swagger-related packages for API documentation
import swaggerUi from "swagger-ui-express";  // Provides the Swagger UI interface
import swaggerDoc from "swagger-jsdoc";      // Generates Swagger documentation from JSDoc comments

// Express framework and related packages
import express from "express";                // Express framework for building the server
import "express-async-errors";               // Allows async error handling in Express
import dotenv from "dotenv";                 // Loads environment variables from a .env file
import colors from "colors";                 // Adds colors to console output for better readability
import cors from "cors";                     // Middleware for handling Cross-Origin Resource Sharing
import morgan from "morgan";                 // HTTP request logger middleware

// Security-related packages
import helmet from "helmet";                 // Helps secure HTTP headers
import xss from "xss-clean";                 // Prevents Cross-Site Scripting (XSS) attacks
import mongoSanitize from "express-mongo-sanitize"; // Prevents NoSQL injection attacks

// Local file imports
import connectDB from "./config/db.js";     // Database connection utility
import testRoutes from "./routes/testRoutes.js";  // Routes related to testing
import authRoutes from "./routes/authRoutes.js";  // Routes related to authentication
import errroMiddelware from "./middelwares/errroMiddleware.js";  // Global error handling middleware
import jobsRoutes from "./routes/jobsRoute.js";  // Routes related to job listings
import userRoutes from "./routes/userRoutes.js";  // Routes related to user management

// Load environment variables from .env file
dotenv.config();

// Establish a connection to MongoDB
connectDB();

// Swagger API Documentation Configuration
// Define options for Swagger
const options = {
  definition: {
    openapi: "3.0.0",  // OpenAPI version
    info: {
      title: "Job Portal Application", // Title of the API documentation
      description: "Node Expressjs Job Portal Application", // Description of the API
    },
    servers: [
      // Define the server URL where the API is hosted
      {
        // Uncomment the following line for local development
        // url: "http://localhost:8080",
        url: "https://nodejs-job-portal-app.onrender.com" // Production server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the files containing Swagger comments
};

// Generate Swagger documentation from the defined options
const spec = swaggerDoc(options);

// Initialize Express application
const app = express();

// Middleware Setup

// Adds security-related HTTP headers
app.use(helmet(``));

// Prevents XSS attacks by sanitizing user input
app.use(xss());

// Sanitizes data to prevent NoSQL injection attacks
app.use(mongoSanitize());

// Parses incoming requests with JSON payloads
app.use(express.json());

// Enables Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Logs HTTP requests to the console for debugging
app.use(morgan("dev"));

// Route Handling

// Define routes for various API endpoints
app.use("/api/v1/test", testRoutes);   // Test-related routes
app.use("/api/v1/auth", authRoutes);   // Authentication-related routes
app.use("/api/v1/user", userRoutes);   // User-related routes
app.use("/api/v1/job", jobsRoutes);    // Job-related routes

// Swagger API Documentation Route
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec)); // Serve Swagger UI at /api-doc

// Global Error Handling Middleware
app.use(errroMiddelware); // Handles errors and sends appropriate responses

// Server Initialization
const PORT = process.env.PORT || 8080; // Define the port to listen on
app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.DEV_MODE} Mode on port no ${PORT}`
      .bgCyan.white // Log server status with colors
  );
});
