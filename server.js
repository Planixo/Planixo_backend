import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ==================
// CORS (THIS IS ENOUGH)
// ==================
const allowedOrigins = [
  "http://localhost:5173",
  "https://planixo.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ==================
// MIDDLEWARE
// ==================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ==================
// DB
// ==================
connectDB();

// ==================
// ROUTES
// ==================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server running",
  });
});

app.use("/api/v1/auth", authRoutes);

// ==================
// ERROR HANDLER
// ==================
app.use(errorHandler);

// ==================
// START
// ==================
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});