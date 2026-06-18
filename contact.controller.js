import { env } from "../config/env.js";
import { resend } from "../config/resend.js";
import { escapeHtml } from "../utils/sanitize.js";

function buildOwnerEmail(contact) {
  const submittedAt = new Date().toISOString();
  const safeName = escapeHtml(contact.name);
  const safeEmail = escapeHtml(contact.email);
  const safeSubject = escapeHtml(contact.subject);
  const safeMessage = escapeHtml(contact.message).replace(/\n/g, "<br>");

  return {
    to: env.ownerEmail,
    subject: `Portfolio Contact: ${contact.subject}`,
    html: `
      <h2>New portfolio contact message</h2>
      <p><strong>Sender Name:</strong> ${safeName}</p>
      <p><strong>Sender Email:</strong> ${safeEmail}</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <p><strong>Submission Time:</strong> ${submittedAt}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
    text: [
      "New portfolio contact message",
      `Sender Name: ${contact.name}`,
      `Sender Email: ${contact.email}`,
      `Subject: ${contact.subject}`,
      `Submission Time: ${submittedAt}`,
      "",
      "Message:",
      contact.message
    ].join("\n")
  };
}

function buildAutoReplyEmail(contact) {
  const safeName = escapeHtml(contact.name);

  return {
    to: contact.email,
    subject: "Thanks for contacting Utkarsh Kumar",
    html: `
      <p>Hi ${safeName},</p>
      <p>Thank you for reaching out through my portfolio website.</p>
      <p>I have received your message and will respond as soon as possible.</p>
      <p>Regards,<br>Utkarsh Kumar</p>
    `,
    text: [
      `Hi ${contact.name},`,
      "",
      "Thank you for reaching out through my portfolio website.",
      "I have received your message and will respond as soon as possible.",
      "",
      "Regards,",
      "Utkarsh Kumar"
    ].join("\n")
  };
}

export async function submitContact(req, res) {
  const contact = req.validatedContact;
  const ownerEmail = buildOwnerEmail(contact);
  const autoReplyEmail = buildAutoReplyEmail(contact);

  const [ownerResult, autoReplyResult] = await Promise.all([
    resend.emails.send({
      from: env.resendFromEmail,
      to: ownerEmail.to,
      replyTo: contact.email,
      subject: ownerEmail.subject,
      html: ownerEmail.html,
      text: ownerEmail.text
    }),
    resend.emails.send({
      from: env.resendFromEmail,
      to: autoReplyEmail.to,
      subject: autoReplyEmail.subject,
      html: autoReplyEmail.html,
      text: autoReplyEmail.text
    })
  ]);

  if (ownerResult.error || autoReplyResult.error) {
    const error = new Error("Email delivery failed.");
    error.statusCode = 502;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Message sent successfully."
  });
}
