import validator from "validator";

export function normalizeText(value) {
  return String(value || "")
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeMessage(value) {
  return String(value || "")
    .replace(/\0/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

export function escapeHtml(value) {
  return validator.escape(String(value || ""));
}
