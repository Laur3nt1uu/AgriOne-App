const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // allow inline scripts for development
  crossOriginEmbedderPolicy: false,
}));
// Support comma-separated CORS origins (e.g. "http://localhost:5173,https://agrione.ro")
const corsOrigins = (env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

const iotLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth endpoints (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again later.", code: "AUTH_RATE_LIMIT" },
});

app.use("/api/iot", iotLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/google", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));


const authRoutes = require("./modules/auth/auth.routes");
app.use("/api/auth", authRoutes);

const landsRoutes = require("./modules/lands/lands.routes");
app.use("/api/lands", landsRoutes);

const sensorsRoutes = require("./modules/sensors/sensors.routes");
const readingsRoutes = require("./modules/readings/readings.routes");
const iotRoutes = require("./modules/iot/iot.routes");

app.use("/api/sensors", sensorsRoutes);
app.use("/api/readings", readingsRoutes);
app.use("/api/iot", iotRoutes);


const alertsRoutes = require("./modules/alerts/alerts.routes");
app.use("/api/alerts", alertsRoutes);

const economicsRoutes = require("./modules/economics/economics.routes");
app.use("/api/economics", economicsRoutes);

const analyticsRoutes = require("./modules/analytics/analytics.routes");
app.use("/api/analytics", analyticsRoutes);


const recommendationsRoutes = require("./modules/recommendations/recommendations.routes");
const weatherRoutes = require("./modules/weather/weather.routes");

app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/weather", weatherRoutes);

const exportsRoutes = require("./modules/exports/exports.routes");
app.use("/api/exports", exportsRoutes);

const adminRoutes = require("./modules/admin/admin.routes");
app.use("/api/admin", adminRoutes);

const apiaRoutes = require("./modules/apia/apia.routes");
app.use("/api/apia", apiaRoutes);

const newsletterRoutes = require("./modules/newsletter/newsletter.routes");
app.use("/api/newsletter", newsletterRoutes);

const blogsRoutes = require("./modules/blogs/blogs.routes");
app.use("/api/blogs", blogsRoutes);

const paymentsRoutes = require("./modules/payments/payments.routes");
app.use("/api/payments", paymentsRoutes);

const aiRoutes = require("./modules/ai/ai.routes");
app.use("/api/ai", aiRoutes);

const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const devRoutes = require("./modules/dev/dev.routes");
app.use("/api/dev", devRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
