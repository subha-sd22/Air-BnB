# Airbnb clone

## Prerequisites

- Node.js 20 or newer
- A MongoDB database (MongoDB Atlas free tier works)

## Setup and run

1. In `backend/backend`, copy `.env.example` to `.env` and set `MONGODB_URL` and `JWT_SECRET`.
2. Open one terminal in `backend/backend`, run `npm install`, then run `npm run dev`.
3. Open another terminal in `frontend`, run `npm install`, then run `npm run dev`.
4. Open the local URL Vite prints, normally `http://localhost:5173`.

The API runs on `http://localhost:6000`. Uploaded listing images are stored locally in `backend/backend/uploads`; they persist while running locally but should be replaced with object storage for production hosting.
