# API

Base path: `/api`. The API creates an HTTP-only guest session cookie. All case requests must use the same browser session.

Successful envelope: `{ "success": true, "data": ... }`.
Error envelope: `{ "success": false, "error": { "code": "...", "message": "..." } }`.

| Method and path | Request | Behavior |
|---|---|---|
| `GET /health` | — | Liveness response. |
| `POST /cases` | `{ "scenario": "30–2,000 characters", "difficulty": "easy\|medium\|hard" }` | Return `202` with case ID/status URL; generate and validate asynchronously. |
| `GET /cases/:id/status` | — | Return current job stage, terminal state, and safe retry information. |
| `POST /cases/:id/retry-generation` | Empty object | Safely retry an eligible failed generation job. |
| `GET /cases/sample` | — | Persist a deterministic medium sample case for the current session. |
| `GET /cases/:id` | — | Return public case state; solution, key flags, and hint contents are omitted. |
| `POST /cases/:id/clues/:clueId/discover` | Empty object | Discover a valid clue once and return updated case state. |
| `POST /cases/:id/hints` | Empty object | Consume and return the next hint, with updated state. |
| `POST /cases/:id/accuse` | `{ "suspectId": "..." }` | Persist the one final accusation and server-calculated result. |
| `GET /cases/:id/result` | — | Return result only after completion. |

Generation counts and scoring are defined in §25.2 of the specification. Error codes include `VALIDATION_ERROR`, `NOT_FOUND`, `FORBIDDEN`, `CASE_NOT_READY`, `CASE_ALREADY_COMPLETED`, `INVALID_SUSPECT`, `NO_HINTS_REMAINING`, `RATE_LIMIT_EXCEEDED`, `AI_PROVIDER_UNAVAILABLE`, and `INTERNAL_ERROR`.
