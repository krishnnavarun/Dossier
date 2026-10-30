# Architecture

The Vite client renders the home, case creation, investigation, accusation, and result pages. Axios sends JSON requests to the Express API and includes the guest-session cookie. Express validates inputs and session ownership, while Mongoose persists cases and investigation state.

Gemini is accessed only in `server/src/generation.ts`. The case endpoint creates a MongoDB-backed generation job and returns promptly. The generation worker updates persisted stages, parses the JSON into a Zod schema, and checks exact difficulty counts, unique IDs, valid references, one valid culprit, and supporting evidence before storing a playable case. A sample case in `server/src/sample.ts` follows the same stored schema and works without Gemini.

The Mystery model stores public case content alongside private hints and a canonical solution. `hints` and `solution` are excluded from ordinary queries by default. `publicCase` constructs an allowlisted response DTO and omits the key clue flag until completion. The accusation route is the only active-game endpoint that loads the solution; it persists the completed state and score before returning the verdict. Result access requires ownership and completion.

Guest session IDs are random server-issued HTTP-only cookies. The server stores an HMAC of the cookie value as the owner identifier. Production must use HTTPS, which enables the secure cookie flag. No client-side code contains a correct answer or scoring authority.

## Boundaries

- Client: presentation, input feedback, local notebook, and display of server response data.
- API: request validation, authorization, game state, deduplicated clue tracking, hint limits, accusation, and scoring.
- MongoDB: durable cases and player progress.
- Gemini: fictional content generation only; never trusted for runtime gameplay decisions.
