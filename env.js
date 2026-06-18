import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "OWNER_EMAIL",
  "FRONTEND_ORIGIN"
];

const missingVariables = requiredVariables.filter((key) => !process.env[key]);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseNumber(process.env.PORT, 5000),
  allowedOrigins: process.env.FRONTEND_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL,
  ownerEmail: process.env.OWNER_EMAIL,
  rateLimitWindowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: parseNumber(process.env.RATE_LIMIT_MAX, 5),
  maxJsonBodySize: process.env.MAX_JSON_BODY_SIZE || "10kb"
};
