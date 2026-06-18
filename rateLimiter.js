import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const contactRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many contact attempts. Please try again later."
  }
});
