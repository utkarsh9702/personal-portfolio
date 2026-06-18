import { logger } from "../utils/logger.js";

export function errorHandler(error, req, res, next) {
  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;

  logger.error({
    err: error,
    requestId: req.id,
    method: req.method,
    path: req.originalUrl
  }, "Request failed");

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500
      ? "Something went wrong. Please try again later."
      : error.message || "Request failed."
  });
}
