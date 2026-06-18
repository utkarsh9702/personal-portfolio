import validator from "validator";
import { normalizeMessage, normalizeText } from "../utils/sanitize.js";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 120;
const MAX_SUBJECT_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 2000;

export function validateContactRequest(req, res, next) {
  const payload = {
    name: normalizeText(req.body.name),
    email: normalizeText(req.body.email).toLowerCase(),
    subject: normalizeText(req.body.subject),
    message: normalizeMessage(req.body.message),
    website: normalizeText(req.body.website)
  };

  if (payload.website) {
    return res.status(200).json({
      success: true,
      message: "Message received."
    });
  }

  const errors = [];

  if (!validator.isLength(payload.name, { min: 2, max: MAX_NAME_LENGTH })) {
    errors.push("Name must be 2-80 characters.");
  }

  if (!validator.isEmail(payload.email) || payload.email.length > MAX_EMAIL_LENGTH) {
    errors.push("Email address is invalid.");
  }

  if (!validator.isLength(payload.subject, { min: 3, max: MAX_SUBJECT_LENGTH })) {
    errors.push("Subject must be 3-120 characters.");
  }

  if (!validator.isLength(payload.message, { min: 10, max: MAX_MESSAGE_LENGTH })) {
    errors.push("Message must be 10-2000 characters.");
  }

  if (/(https?:\/\/|www\.)/i.test(payload.name + " " + payload.subject)) {
    errors.push("Links are not allowed in name or subject.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please fix the highlighted fields.",
      errors
    });
  }

  req.validatedContact = payload;
  return next();
}
