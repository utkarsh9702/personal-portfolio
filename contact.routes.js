import express from "express";
import { submitContact } from "../controllers/contact.controller.js";
import { contactRateLimiter } from "../middleware/rateLimiter.js";
import { validateContactRequest } from "../middleware/validateContact.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const contactRouter = express.Router();

contactRouter.post(
  "/",
  contactRateLimiter,
  validateContactRequest,
  asyncHandler(submitContact)
);
