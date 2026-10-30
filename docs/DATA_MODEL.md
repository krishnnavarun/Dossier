# Data model

One MongoDB `Mystery` document represents a generated or seeded case and its guest-session gameplay state.

- Ownership: `ownerSession` is an HMAC derived from the HTTP-only guest cookie.
- Story: original `scenario`, generated `title` and `story`, `difficulty`.
- Suspects: stable ID, name, role, age, description, motive, avatar.
- Clues: stable ID, title, category, summary, detail, location, timestamp, key flag, related suspect IDs.
- Private fields: `hints[]`; `solution` with culprit ID, explanation, motive, method, and reconstructed timeline. Mongoose excludes both from ordinary reads.
- Progress: `discoveredClueIds[]`, `hintsUsed`, `status`.
- Submission: `accusation`, `score`, creation and update timestamps.

A separate `GenerationJob` document persists the submitted scenario, owner session, difficulty, stage, status, safe error, retry eligibility, attempts, and timestamps. Its ID is reused as the Mystery ID once the validated case is ready.

Public responses are explicit allowlists rather than serialized Mongoose documents. The `key` clue flag is withheld until the case is complete. Keep the solution and undisclosed hints out of logs, analytics, and client payloads.
