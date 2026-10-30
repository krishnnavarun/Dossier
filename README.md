# Casefile — AI Mystery Room

A responsive detective game where players create a fictional premise, inspect generated evidence, ask for limited hints, and submit one final accusation. The API keeps the canonical solution private until the case is completed.

## Stack

- `client/`: React, TypeScript, Vite, React Router, Axios, Lucide, responsive CSS.
- `server/`: Node.js, Express, TypeScript, MongoDB/Mongoose, Zod, Google Gen AI SDK.
- Guest sessions use an HTTP-only cookie. Cases and game progress are persisted in MongoDB.

## Requirements

- Node.js 20 or newer and npm.
- MongoDB running locally or a MongoDB Atlas connection string.
- Gemini API key for generating new cases. The seeded sample case does not require Gemini.

## Run locally

```powershell
if (!(Test-Path server/.env)) { Copy-Item .env.example server/.env }
# Set GEMINI_API_KEY and SESSION_SECRET in .env. Set MONGODB_URI if needed.
npm install
npm run dev
```

Client: `http://localhost:5173`; API: `http://localhost:5000/api`. The API exits with a clear message if MongoDB is unavailable. Never place Gemini credentials in a `VITE_*` variable or commit `.env`.

## Commands

- `npm run dev` — run client and server.
- `npm run build` — type-check and build both applications.
- `npm test` — run frontend and backend unit tests.

## Main routes

- `/` home and sample-case entry.
- `/create` premise and difficulty form.
- `/case/:id` investigation room.
- `/case/:id/accuse` final accusation.
- `/case/:id/result` completed-case explanation and score.

## Case rules

Difficulty determines exact suspect/clue/hint counts: Easy 3/5/2, Medium 4/7/3, Hard 5/9/3. Correct base points are 100/150/200 by difficulty, each distinct clue adds five, each hint costs ten, and the minimum score is zero. The server owns validation, game state, answer checking, and scoring. See [spec.md](spec.md) for the full contract and [docs/API.md](docs/API.md) for endpoint details.

## Deployment

Deploy the client and API separately or behind one HTTPS origin. Configure `CLIENT_URL`, `MONGODB_URI`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `SESSION_SECRET`, and `PORT` in the server environment. Set the client build's `VITE_API_URL` to the public API origin plus `/api`. Use a strong secret, secure cookies, HTTPS, and an explicit CORS origin. Do not expose secrets in browser build variables.
