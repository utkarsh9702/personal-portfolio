import cors from "cors";
import helmet from "helmet";
import { env } from "../config/env.js";

export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin && env.nodeEnv !== "production") {
      return callback(null, true);
    }

    if (env.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin denied"));
  },
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 204,
  maxAge: 600
});
