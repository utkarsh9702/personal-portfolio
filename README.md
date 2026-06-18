# Utkarsh Kumar Portfolio With Secure Contact API

This project contains a static portfolio frontend and a secure Node.js/Express backend contact form API.

## Structure

```text
portfolio/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
```

## High-Level Flow

1. Visitor submits the contact form.
2. Frontend validates the fields and sends JSON to `POST /api/contact`.
3. Backend rate limits the request.
4. Backend checks the honeypot field.
5. Backend normalizes, validates, and sanitizes request data.
6. Backend sends the owner email through Resend.
7. Backend sends an automatic confirmation email to the visitor.
8. Backend returns a safe success or error response.

## Public GitHub Safety

The Resend API key is never stored in frontend code and never committed. The backend reads secrets only from environment variables. Use `backend/.env.example` as a template, then create a private `backend/.env` locally.

## Local Development

1. Open `backend/`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Fill in real values.
5. Run `npm run dev`.
6. Open `frontend/index.html`.
7. If the frontend runs from `file://`, keep `null` in `FRONTEND_ORIGIN` for local testing only.

## Production Checklist

- Use a verified Resend sending domain.
- Set `RESEND_API_KEY` only in Render environment variables.
- Set `FRONTEND_ORIGIN` to the deployed frontend URL.
- Remove `null` from `FRONTEND_ORIGIN` in production.
- Update `API_BASE_URL` in `frontend/script.js` to your Render backend URL.
- Commit only `.env.example`, never `.env`.
