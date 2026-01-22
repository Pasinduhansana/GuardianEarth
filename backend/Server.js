import express from "express";
import dotenv, { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import Dbcon from "./Config/db.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import { protect } from "./Middleware/authMiddleware.js";
import cloudinary from "cloudinary";
import cloudinaryRoutes from "./Utils/Cloudinary.js";

// Routes
import PaymentRoutes from "./Routes/PaymentRoutes.js";
import EmailRoutes from "./Routes/EmailRoutes.js";
import Datasetrouter from "./Routes/datasetRoutes.js";
import DisasterRouters from "./Routes/disasterRoutes.js";
import PostRouters from "./Routes/postsRoutes.js";
import floodRoutes from "./Routes/floodRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Stripe Initialization

// Database Connection
Dbcon();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5000",
      process.env.FRONTEND_URL,
      process.env.CLIENT_URL,
    ].filter(Boolean); // Remove undefined values

    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("netlify.app") || origin.includes("vercel.app")) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(null, true); // Allow all origins for now, change to false for production
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// Routes
app.use("/api/payment", PaymentRoutes); // Payment-related endpoints
app.use("/api/email", EmailRoutes);
app.use("/api/dashboard", Datasetrouter);
app.use("/api/disaster", DisasterRouters);
app.use("/api/posts", PostRouters);
app.use("/api/auth", authRoutes);
app.use("/api/user", protect, userRoutes);
app.use("/api", cloudinaryRoutes);

// JWT Secret Keys
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Configuration
cloudinary.config({
  cloud_name: "dmmwhbmkq",
  api_key: "412359435453984",
  api_secret: process.env.CLOUDINARY_API_KEY,
});

// Flood prediction API
app.use("/api/flood", floodRoutes); // Flood prediction API
