# Zymbly Upload Portal (fezymb)

TypeScript React frontend with guided CSV and PDF upload workflows, plus a local Express API stub for real multipart uploads.

## Stack

| Package | Tech |
|---------|------|
| `client/` | React 18, react-router, styled-components, webpack 5 |
| `server/` | Express, multer, CORS |

## Quick start

```bash
npm install
npm run dev
```

- **App:** http://localhost:3000
- **API:** http://localhost:3001 (`GET /api/health`)

Uploaded files are stored under `server/uploads/` (gitignored).

## Routes

| Path | Description |
|------|-------------|
| `/` | Home with feature tiles |
| `/upload/csv` | 4-step guided CSV upload |
| `/upload/pdf` | 4-step guided PDF batch upload |

## Architecture

```
Browser (webpack :3000)
  └── /api/* proxied to Express (:3001)
        ├── POST /api/uploads/csv   (field: file)
        └── POST /api/uploads/pdf   (field: files[])
```

Client uploads always go through `client/src/services/uploadService.ts`, which builds `FormData` and reports progress via `XMLHttpRequest`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Client + server (concurrently) |
| `npm run build` | Production client build → `client/dist/` |
| `npm run start:server` | API only |

## Swapping to production

1. **Server:** Replace `multer` disk storage with S3/GCS (or your pipeline). Add auth middleware before upload routes.
2. **Client:** Keep `uploadCsv` / `uploadPdf` signatures. Change request URL if the API is on another host (env-based base URL or webpack proxy in production).
3. **Metadata:** `datasetType` and `docCategory` are already sent as form fields—extend as needed.

## Cursor rules

Project conventions live in `.cursor/rules/`:

- `project.mdc` — monorepo layout (always on)
- `ui-styling.mdc` — theme and component patterns
- `uploads.mdc` — FormData fields and API contract
