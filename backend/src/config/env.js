require("dotenv").config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

module.exports = {
  PORT: process.env.PORT || 5000,
  DB_HOST: required("DB_HOST"),
  DB_PORT: Number(required("DB_PORT")),
  DB_NAME: required("DB_NAME"),
  DB_USER: required("DB_USER"),
  DB_PASS: String(required("DB_PASS")),
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  IOT_MASTER_KEY: required("IOT_MASTER_KEY"),
  AUTH_DETAILED_ERRORS: process.env.AUTH_DETAILED_ERRORS
    ? String(process.env.AUTH_DETAILED_ERRORS).toLowerCase() === "true"
    : process.env.NODE_ENV !== "production",
  APP_PUBLIC_URL: process.env.APP_PUBLIC_URL || process.env.CORS_ORIGIN || "http://localhost:5173",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  SMTP_SECURE: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "AgriOne <no-reply@agrione.local>",
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || "",
  OPENWEATHER_BASE: process.env.OPENWEATHER_BASE || "https://api.openweathermap.org/data/2.5",
  OPENWEATHER_UNITS: process.env.OPENWEATHER_UNITS || "metric",

  // Fallback location for global weather/recommendations (Romania center by default)
  WEATHER_DEFAULT_LAT: process.env.WEATHER_DEFAULT_LAT ? Number(process.env.WEATHER_DEFAULT_LAT) : 45.9432,
  WEATHER_DEFAULT_LNG: process.env.WEATHER_DEFAULT_LNG ? Number(process.env.WEATHER_DEFAULT_LNG) : 24.9668,
};
