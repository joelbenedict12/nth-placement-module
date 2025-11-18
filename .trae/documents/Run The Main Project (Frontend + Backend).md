## Prerequisites
- Install Node.js LTS (v18+ recommended) and ensure `npm -v` works
- In `c:\Users\Lenovo\Documents\Internship\nthplace-skyrocket-main`, run `npm install`

## Environment Setup
- Backend: create/update `api/.env` with required variables (no secrets in chat)
  - `PORT=8083`
  - `FRONTEND_URL=http://localhost:8081`
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `JWT_SECRET`
  - `OPENAI_API_KEY` (for AI parsing)
  - `MAX_FILE_SIZE`, `ALLOWED_FILE_TYPES`, `NODE_ENV`
- Frontend: create/update `.env.local`
  - `VITE_API_URL=http://localhost:8083/api`

## Start Servers (recommended)
- Terminal 1 (Backend): `npm run server:dev`  → serves on `http://localhost:8083`
- Terminal 2 (Frontend): `npm run dev`        → serves on `http://localhost:8081`

## Quick Start (demo-only)
- Single terminal: `npm run dev:full` (starts Vite + `api/server-simple.js`)
- Note: the demo server is mock data; for full features use `api/server.js` via `npm run server:dev`

## Verify Connectivity
- Backend health: open `http://localhost:8083/api/health` → expect `{ status: "OK" }`
- App UI: open `http://localhost:8081/student/resume`
- Upload test: try a PDF resume and watch network calls to `http://localhost:8083/api/resumes/*`

## Port & CORS Alignment
- Frontend dev port: 8081 (configured in `vite.config.ts`)
- Backend CORS allows `http://localhost:8081` (configured via `FRONTEND_URL`)
- Frontend points to backend via `VITE_API_URL=http://localhost:8083/api`

## Common Issues
- Port in use: change `PORT` in `api/.env` or stop conflicting process
- OpenAI quota/key: update `OPENAI_API_KEY` to enable AI resume parsing
- Supabase credentials: ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are valid

## Optional Production Preview
- Build frontend: `npm run build`
- Preview build locally: `npm run preview` (serves the built app)

## Next Step
- If you confirm, I’ll start both servers and verify the resume flow end-to-end for you.