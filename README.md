# SimplifIQ - Automation Prototype

This repository contains a prototype automation workflow that captures prospect leads, enriches company data, generates a personalized PDF audit, archives it, sends the report via email, and logs leads to storage/Google Sheets.

Quick start (local development):

1. Backend

```bash
cd backend
npm install
# Create a .env file or set environment variables as described in backend/.env.example
node server.js
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Important environment variables (see `backend/.env.example`):

- `PORT` (optional)
- `GEMINI_API_KEY` (optional) — API key for Google Gemini (if available). If not provided, the system uses a heuristic fallback engine.
- `GOOGLE_APPLICATION_CREDENTIALS` (optional) — path to GCP service-account JSON for Drive/Sheets access.
- `GOOGLE_DRIVE_FOLDER_ID` (optional) — Drive folder id for archived PDFs.
- `GOOGLE_SPREADSHEET_ID` (optional) — Spreadsheet ID to append leads.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (optional) — SMTP server credentials. If not provided, the system uses Ethereal test inbox.

Deployment note:
- For cloud deployment, prefer `GOOGLE_APPLICATION_CREDENTIALS_JSON` over a local file path.
- If your host supports mounted files, you can use `GOOGLE_APPLICATION_CREDENTIALS` instead.
- Keep the service-account JSON on a single line when storing it as an environment variable.
- The backend also accepts a JSON blob directly in `GOOGLE_APPLICATION_CREDENTIALS` if you cannot use a mounted file.

Gemini notes:
- The backend uses the official Google AI SDK, so you usually only need `GEMINI_API_KEY` in `.env`.
- The app currently calls the Gemini `generateContent` API through the SDK; the endpoint is handled internally by the library.
- If you want to pin a specific model, update `backend/src/services/aiService.js` to the model you want to use, such as `gemini-1.5-flash` or `gemini-1.5-pro` if your project has access.

Notes & recommendations:
- For prototype/demo use, Ethereal + local Drive fallback is acceptable. For production, configure a dedicated cloud storage and SMTP provider.
- Do not commit real credentials to source control. Use secrets manager or environment variables.
- The server serves generated PDFs at `http://localhost:5000/reports/<filename>` when Google Drive archiving is not configured.

Testing the pipeline:
- POST a lead to `http://localhost:5000/api/leads` with JSON body: `{ "name": "Jane Doe", "email": "jane@acme.com", "companyName": "Acme", "website": "acme.com", "challenge": "Increase lead conversions" }`.

Using your provided Google resources

- Spreadsheet: https://docs.google.com/spreadsheets/d/19mOQxqMOKy1mH7F6_-kYsYR5yix7aL1ELgdjbPcwr2M/edit
- Drive folder: https://drive.google.com/drive/folders/1h3Ofa4V9i4icTzd4nVMQzhyBcN2qjJmw

Steps to enable Drive & Sheets archiving:
1. Place your service account JSON locally and set `GOOGLE_APPLICATION_CREDENTIALS` in `.env` to its path.
2. Make sure the Google Drive folder (ID: `1h3Ofa4V9i4icTzd4nVMQzhyBcN2qjJmw`) is inside a Shared Drive, then share that Shared Drive or folder with the service account `client_email` (found inside the JSON) and grant Editor access.
3. Share the Google Sheet (ID: `19mOQxqMOKy1mH7F6_-kYsYR5yix7aL1ELgdjbPcwr2M`) with the same service account and grant Editor access.
4. Restart the backend (`node server.js`) and POST a test lead. Check logs for successful upload and sheet append.

License: Internal prototype. Remove sensitive test credentials before sharing.
