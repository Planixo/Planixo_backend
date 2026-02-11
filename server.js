import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";


// ==================
// DATABASE
// ==================
connectDB();


// ==================
// CORS CONFIG
// ==================
const allowedOrigins = [
  "http://localhost:5173",
  "https://planixo-frontend.vercel.app",
  "https://planixo-frontend-hgunlqw0a-planixos-projects.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow Postman

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


// ==================
// MIDDLEWARE
// ==================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(compression());

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// ==================
// ROUTES
// ==================

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Planixo Server Running",
  });
});

// Auth routes
app.use("/api/v1/auth", authRoutes);

// ✅ User routes (IMPORTANT)
userRoutes(app);


// ==================
// 404 HANDLER
// ==================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});


// ==================
// GLOBAL ERROR HANDLER
// ==================
app.use(errorHandler);


// ==================
// START SERVER
// ==================
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
