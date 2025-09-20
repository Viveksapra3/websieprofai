# Start Class Integration (Vite app -> Next.js app)

This document describes the changes made to integrate a "Start Class" flow from the Vite app to the Next.js app (`r3f-ai-language-teacher`) running on a different port, while preserving the authenticated session.

## Summary of Changes

- **Vite app (`client/src/pages/course.tsx`)**
  - "Start Class" button in the course header.
  - Button reads `VITE_AVI_URL` and navigates to: `VITE_AVI_URL/?courseId=[id]&return=[currentUrl]`.
  - If `VITE_AVI_URL` is missing, the button shows an alert.

- **Express server (`server/index.ts`)**
  - Added minimal CORS middleware to allow credentialed requests from configured origins (`ALLOWED_ORIGINS`).
  - Keeps existing session configuration (via `express-session` + `connect-pg-simple`).

- **Next.js app (`r3f-ai-language-teacher`)**
  - Home page: `src/app/page.js` updated to be session-aware.
    - Reads `courseId` and `return` query params.
    - Verifies session via `GET {NEXT_PUBLIC_API_BASE}/api/session` with `credentials: 'include'` using a shared `useSession()` hook.
    - Displays a floating session panel with "Continue to Class" when `courseId` is present.
  - Class page: `src/app/class/[courseId]/page.js` uses `useSession()` to require an authenticated session.
  - Optional landing: `src/app/api/page.js` can serve as a session-aware landing, but the default flow now lands on `/`.

## Files Changed or Added

- Modified: `client/src/pages/course.tsx`
  - Added `AVI_BASE` from `import.meta.env.VITE_AVI_URL`.
  - Added `handleStartClass()` and the header button UI.
  - Start Class navigates to `VITE_AVI_URL/?courseId=[id]&return=[currentUrl]`.

- Modified: `server/index.ts`
  - Inserted a small CORS middleware block after the body parsers and before session/routes.
  - CORS allows credentials and restricts origins to those listed in `ALLOWED_ORIGINS`.

- Added/Updated: `r3f-ai-language-teacher/src/app/class/[courseId]/page.js`
  - Uses `useSession()` to validate session and render the class area.
- Updated: `r3f-ai-language-teacher/src/app/page.js`
  - Session-aware home that can continue to the class route when launched with parameters.
- Added (optional): `r3f-ai-language-teacher/src/app/api/page.js`
  - Session-aware landing alternative for deep linking.

- Added: `docs/START_CLASS_INTEGRATION.md` (this document)

## Environment Variables

Main project (`.env` in the repo root):

- `VITE_AVI_URL` (required)
  - Base URL of the Next.js app to open when starting a class.
  - Example: `VITE_AVI_URL=http://localhost:3000`

- `ALLOWED_ORIGINS` (recommended)
  - Comma-separated list of allowed origins for CORS (so the Next.js app can call the Express API with credentials).
  - Example: `ALLOWED_ORIGINS=http://localhost:3000`

- Session-related (already present, adjust if needed):
  - `SESSION_NAME` (default: `sid`)
  - `SESSION_SECRET` (set a strong secret)
  - `COOKIE_SAMESITE` (default: `lax`)
  - `COOKIE_SECURE` (default: `false`)
  - `COOKIE_DOMAIN` (optional)

Next.js project (`r3f-ai-language-teacher/.env.local`):

- `NEXT_PUBLIC_API_BASE` (required)
  - Base URL of the Express API for session checks.
  - Example: `NEXT_PUBLIC_API_BASE=http://localhost:5000`

## Session Sharing Notes

- For session cookies to be sent, ensure the two apps share the same **host** (e.g., both on `localhost`) and **scheme** (http in dev). Different ports are OK.
- If you mix `localhost` and `127.0.0.1`, the browser treats them as different sites; prefer a consistent host like `localhost` for both apps.
- With `SameSite=lax` (default), cookies are sent on same-site requests. Our Next.js page performs a fetch to `NEXT_PUBLIC_API_BASE` with `credentials: 'include'` so cookies will be sent if the site is considered same-site.
- If you need to use different hosts (e.g., cross-domain), you will need `SameSite=None; Secure` (which requires HTTPS), and you must update `COOKIE_SAMESITE=None` and `COOKIE_SECURE=true`. This is generally more complex in local development.

## How to Run

1. Install dependencies and run the main app (Express + Vite client):
   - Terminal 1:
     - `npm install`
     - `npm run dev` (starts the Express server with Vite middleware)
   - Ensure `.env` includes:
     - `VITE_AVI_URL=http://localhost:3000`
     - `ALLOWED_ORIGINS=http://localhost:3000`

2. Install and run the Next.js app:
   - Terminal 2:
     - `cd r3f-ai-language-teacher`
     - `npm install` or `yarn install`
     - Create `.env.local` with `NEXT_PUBLIC_API_BASE=http://localhost:5000`
     - `npm run dev` or `yarn dev` (starts on `http://localhost:3000` by default)

3. Use the flow:
  - Log in on the main app so a session cookie is set by the Express server.
  - Navigate to a course page: `/course/<courseId>`.
  - Click "Start Class". It will redirect to `http://localhost:3000/?courseId=<id>&return=[url]`.
  - The Next.js home verifies the session and shows a floating panel.
  - Click "Continue to Class" to open `/class/<courseId>?return=[url]`.

## Troubleshooting

- If the class page says you are not authenticated:
  - Make sure both apps use the same host (e.g., both `localhost`).
  - Confirm `ALLOWED_ORIGINS` includes the Next.js origin (e.g., `http://localhost:3000`).
  - Verify the browser devtools Network tab shows cookies sent in the request to `/api/session` from the Next.js origin.
  - Ensure `NEXT_PUBLIC_API_BASE` matches the actual URL where the Express server is running.

- If you need cross-domain in dev:
  - Use HTTPS for both apps (self-signed certs) and set `COOKIE_SAMESITE=None` and `COOKIE_SECURE=true`.
  - Update `ALLOWED_ORIGINS` accordingly.

## Next Steps

- Replace the placeholder UI in `r3f-ai-language-teacher/src/app/class/[courseId]/page.js` with your actual class/scene.
- Optionally, add a signed token or CSRF layer if you need additional integrity between the two apps.
