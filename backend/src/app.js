const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const path = require("path");
const config = require("./config");
const errorHandler = require("./middleware/errorHandler");
const { swaggerUi, specs } = require("./docs/swagger");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const schemeRoutes = require("./routes/schemeRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const documentRoutes = require("./routes/documentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");
const jobRoutes = require("./routes/jobRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const faqRoutes = require("./routes/faqRoutes");
const trackRoutes = require("./routes/trackRoutes");
const searchRoutes = require("./routes/searchRoutes");
const grievanceRoutes = require("./routes/grievanceRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const walletRoutes = require("./routes/walletRoutes");
const lockerRoutes = require("./routes/lockerRoutes");
const chatRoutes = require("./routes/chatRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", limiter);

// ============================================================================
// COOKIE PARSER
// ============================================================================
app.use(cookieParser());

// ============================================================================
// BODY PARSING
// ============================================================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================================================
// LOGGING
// ============================================================================
if (config.nodeEnv !== "production") {
  app.use(morgan("dev"));
}

// ============================================================================
// STATIC FILES (for uploaded documents)
// ============================================================================
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ============================================================================
// API ROUTES & DOCS
// ============================================================================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api", trackRoutes);
app.use("/api", searchRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/locker", lockerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", publicRoutes);

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GOV E-Services API is running",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ============================================================================
// 404 HANDLER
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ============================================================================
// ERROR HANDLER
// ============================================================================
app.use(errorHandler);

module.exports = app;
