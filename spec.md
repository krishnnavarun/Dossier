# AI MYSTERY ROOM
## Product & Technical Specification — Single Source of Truth

**Document:** `SPEC.md`  
**Product:** AI Mystery Room  
**Specification version:** 1.1.0
**Status:** Initial implementation baseline  
**Development methodology:** Specification-Driven Development  
**Frontend:** React + TypeScript  
**Backend:** Node.js + Express + TypeScript  
**Database:** MongoDB  
**AI provider:** Google Gemini API  
**Primary implementation agent:** OpenAI Codex

---

# 1. DOCUMENT AUTHORITY

This document is the authoritative source of truth for building AI Mystery Room.

All developers and AI coding agents must follow this specification when implementing, testing, reviewing, and modifying the application.

## 1.1 Core rules

1. Read this entire specification before modifying the codebase.
2. Follow the documented architecture, data contracts, design system, and acceptance criteria.
3. Do not introduce features that contradict this document.
4. Do not expose secrets, AI credentials, hidden solutions, or private investigation data to the client.
5. Do not use mock data in production paths unless explicitly designated as demo or seed data.
6. All AI-generated investigations must be validated before becoming playable.
7. All interactive functionality must work end to end; visual placeholders are not completed features.
8. Add or update tests whenever behavior, API contracts, database models, or business rules change.
9. Update this specification when an approved product or technical decision changes.
10. If a requirement is ambiguous, prefer the simplest secure implementation consistent with the product goals. Document unresolved decisions rather than silently inventing conflicting behavior.

## 1.2 Requirements precedence

Use this order when resolving conflicts:

1. Security and data privacy requirements.
2. Explicit requirements in this specification.
3. API contracts and data schemas defined here.
4. Established architecture and design-system conventions.
5. Existing implementation, provided it does not violate the above.
6. Agent assumptions.

Never silently change a public API contract or database model to accommodate an implementation shortcut.

---

# 2. PRODUCT VISION

## 2.1 Product summary

AI Mystery Room is an interactive mystery-investigation platform where users turn a short scenario or story into a playable detective challenge.

The user supplies a premise, such as:

"A priceless diamond disappeared from a hotel suite between 9 PM and 10 PM. Three people had access to the room, and each has something to hide."

Gemini transforms the premise into a fictional investigation containing:

- A coherent crime or mystery.
- A cast of suspects.
- A timeline of events.
- Witness statements and interviews.
- Digital evidence, including fictional WhatsApp conversations.
- Security camera records and fictional visual evidence.
- Conflicting claims, misleading clues, and red herrings.
- A hidden, predetermined culprit.
- A defensible explanation of what actually happened.

The user investigates the evidence, develops a theory, selects a culprit, and submits a final accusation.

The application evaluates the accusation against the hidden solution and reveals the complete explanation.

## 2.2 Product promise

**Every mystery is generated from the user's imagination, every clue contributes to a coherent investigation, and every solution can be logically explained.**

## 2.3 Product principles

1. **Deduction over guessing:** The culprit must be discoverable through evidence.
2. **Narrative consistency:** Evidence, timestamps, statements, and the final solution must agree.
3. **Interactive investigation:** Users explore evidence rather than read a static story.
4. **Fair deception:** Red herrings create uncertainty without making the solution arbitrary.
5. **AI creativity, deterministic gameplay:** AI generates the story; the application controls game state, scoring, and answer evaluation.
6. **Privacy by design:** User-generated scenarios and investigation data are handled securely.
7. **Premium presentation:** The interface should feel like a sophisticated detective investigation room.

---

# 3. PRODUCT SCOPE

## 3.1 MVP — mandatory

The first production-ready release must include:

- Responsive landing page.
- Scenario submission interface.
- Mystery generation through Gemini.
- AI-generated suspects and investigation timelines.
- Evidence generation and presentation.
- Evidence categories and detail views.
- Evidence discovery and investigation progress tracking.
- A case notebook for user observations.
- Suspect selection and final accusation.
- Server-side answer evaluation.
- A case resolution screen.
- Score and investigation statistics.
- Loading, error, retry, and empty states.
- Persistence of active and completed cases.
- Input validation, rate limiting, and secure authentication.
- A coherent responsive design system.
- Automated tests for critical behavior.

Authentication must support guest play without requiring account creation. Registered accounts and cloud-synced case history may be implemented as an optional MVP extension.

## 3.2 Explicitly out of scope for MVP

Unless separately approved, do not implement:

- Multiplayer investigations.
- Live human-versus-human gameplay.
- Real WhatsApp, CCTV, email, or social-media integrations.
- Real criminal investigation services.
- Live video surveillance.
- Public user-generated case publishing.
- User-uploaded evidence generation pipelines.
- Payments, subscriptions, or a marketplace.
- Unrestricted conversational AI that can reveal the solution.
- AI-generated video as a mandatory dependency.
- Public leaderboards or competitive ranking systems.

The product must remain fully playable without expensive image or video generation services.

---

# 4. USER EXPERIENCE AND GAMEPLAY

## 4.1 Primary user journey

1. User opens the landing page.
2. User selects "Create a Mystery."
3. User enters a short scenario.
4. User configures optional mystery settings.
5. User submits the scenario.
6. Backend validates the request and creates a generation job.
7. Gemini generates the investigation structure.
8. Backend validates consistency and creates a playable case.
9. User enters the investigation room.
10. User explores suspects, timeline, and evidence.
11. User records observations and builds a theory.
12. User selects a suspect and submits a final accusation.
13. Backend evaluates the answer.
14. The game reveals the outcome, reasoning, timeline, and evidence connections.
15. User can replay the case or create another mystery.

## 4.2 Landing page

Purpose: Communicate the concept immediately and encourage mystery creation.

Required sections:

- Navigation with brand logo and primary CTA.
- Hero headline: "Every Story Hides a Mystery."
- Supporting copy explaining that any scenario can become an AI-generated investigation.
- Primary CTA: "Create Your Mystery."
- Secondary CTA: "Explore a Sample Case."
- A visual representation of an investigation board.
- A three-step explanation: Create, Investigate, Solve.
- Feature highlights.
- Footer containing product information, privacy, and terms links.

The primary CTA must navigate to the scenario creation experience.

The sample case must use a valid, deterministic seeded case rather than trigger a fresh AI generation on every visit.

## 4.3 Mystery creation screen

Required fields:

| Field | Requirement |
|---|---|
| Scenario | Required, 30–2,000 characters |
| Mystery type | Optional selection |
| Difficulty | Optional: Easy, Medium, Hard |
| Setting | Optional text, maximum 120 characters |
| Suspect count | Optional, 3–6 |
| Tone | Optional: Classic Detective, Psychological Thriller, Lighthearted, Noir |
| Evidence richness | Optional: Standard or Detailed |

Default values:

- Difficulty: Medium.
- Suspect count: 4.
- Tone: Classic Detective.
- Evidence richness: Standard.

The form must include:

- Character counter.
- Input validation.
- Clear error messages.
- Generate button.
- Generation progress state.
- Protection against duplicate submissions.
- A warning that generated stories are fictional.

The UI must not promise exact generation times.

## 4.4 Generation experience

Display meaningful progress stages:

1. Constructing the case.
2. Establishing suspects and motives.
3. Building the timeline.
4. Preparing evidence.
5. Checking consistency.
6. Opening the investigation.

These stages are progress indicators, not claims about the exact internal Gemini execution sequence.

The backend must expose the actual job status. The frontend must not simulate successful completion while generation is still running.

If generation fails:

- Preserve the user's scenario.
- Show a readable error.
- Allow a safe retry.
- Avoid creating duplicate playable cases.
- Never expose raw provider errors, API keys, or stack traces.

## 4.5 Investigation room

The investigation room is the core product experience.

Desktop layout:

- **Left sidebar:** Case overview, suspects, timeline, evidence categories.
- **Center workspace:** Selected evidence, image viewer, conversation transcript, or investigation board.
- **Right sidebar:** Case notebook, discoveries, and investigation progress.

Mobile layout:

- Single-column workspace.
- Compact case header.
- Tabbed navigation for Evidence, Suspects, Timeline, and Notebook.
- Evidence detail presented in a drawer, modal, or dedicated screen.
- Primary actions accessible without horizontal scrolling.

Required interface elements:

- Case title and reference.
- Difficulty and status.
- Suspect cards.
- Evidence count and discovery state.
- Evidence filtering and search.
- Timeline.
- Evidence detail viewer.
- Notebook with editable user notes.
- Accusation action.
- Progress indicator.

Evidence details should display source, timestamp, related suspects, and narrative context when available.

The interface must never expose the correct culprit or hidden solution before submission.

## 4.6 Evidence categories

Support the following evidence types:

| Type | Presentation |
|---|---|
| `chat` | Messaging-app-style conversation |
| `image` | Image evidence viewer |
| `camera_log` | Security camera event log or footage representation |
| `statement` | Witness or suspect statement |
| `document` | Report, receipt, letter, or record |
| `timeline_event` | Chronological event |
| `audio_transcript` | Transcript of fictional recorded audio |
| `forensic_report` | Fictional forensic findings |

MVP evidence must be producible with text, structured UI, and generated images where available.

### Messaging evidence

Render fictional conversations with:

- Participant names.
- Message timestamps.
- Message ordering.
- Optional attachment indicators.
- Clear fictional provenance.

Do not imitate a real person's private communications or connect to real messaging accounts.

### Image evidence

Images should support:

- Preview thumbnails.
- Full-size inspection.
- Loading and failure states.
- Evidence description.
- Associated case and evidence metadata.

Use generated images only when a compatible image-generation provider is configured. Gemini text generation alone must not be treated as proof that image-generation capability is available.

If image generation is unavailable, render a designed evidence artifact or a clearly identified textual representation.

### Camera evidence

MVP camera evidence must support:

- Camera identifier.
- Recording interval.
- Timestamped events.
- Recorded observations.
- Visibility limitations.
- Missing footage or blind spots where narratively justified.

Optional generated video may be added later. It must not be required to play or solve a case.

## 4.7 Case notebook

Users can create, edit, and delete personal investigation notes.

Notes must:

- Belong to a case and user session.
- Persist across refreshes for authenticated users.
- Persist during the active guest session.
- Never be visible to other users.
- Remain separate from the generated canonical solution.

Notes are user-authored content and must not alter the investigation's actual facts.

## 4.8 Final accusation

The user must select one suspect and submit a final accusation.

Before submission, display a confirmation screen summarizing the selected suspect.

Rules:

- Exactly one suspect must be selected.
- The server validates that the suspect belongs to the case.
- The accusation is recorded once.
- The same completed case cannot be repeatedly submitted for a better score.
- The final outcome is calculated on the server.
- The correct culprit is revealed only after the server accepts the final submission.

## 4.9 Resolution screen

Display:

- Correct or incorrect result.
- Accused suspect.
- Actual culprit.
- Explanation of the crime.
- Motive, opportunity, and method.
- Reconstructed timeline.
- Key evidence and how it supports the solution.
- Explanation of relevant red herrings.
- Score and performance summary.
- Replay and create-another-mystery actions.

The solution must explain the evidence rather than merely announce the culprit.

---

# 5. GAME DESIGN AND SCORING

## 5.1 Mystery integrity

Every generated case must contain:

- One canonical culprit.
- Three to six suspects.
- A coherent motive.
- A plausible opportunity.
- An explainable method.
- At least five meaningful evidence items.
- At least three evidence items that support the solution.
- At least two competing hypotheses or plausible misleading clues.
- A reconstructable timeline.
- A solution that follows from the established evidence.

At least two clues should meaningfully narrow the suspect set. Red herrings must have an explanation in the final resolution.

The culprit must not be determined by a random choice made after the case is generated.

## 5.2 Difficulty profiles

**Easy**
- Direct clues.
- Clear timeline.
- Fewer misleading clues.
- Explicit links between evidence and suspects.

**Medium**
- Contradictory statements.
- Multiple plausible motives.
- Evidence requiring cross-reference.
- Some red herrings.

**Hard**
- More indirect evidence.
- Subtle contradictions.
- Interdependent clues.
- More ambiguous initial interpretations.

Hard difficulty must increase reasoning complexity, not make the correct answer arbitrary.

## 5.3 Scoring

Define a deterministic score on a 100-point scale:

- Correct accusation: 70 points.
- Key evidence coverage: up to 20 points.
- Efficient investigation: up to 10 points.

For evidence coverage:

`Evidence score = 20 × (key evidence items discovered / total key evidence items)`

For efficiency:

`Efficiency score = max(0, 10 - 2 × additional hint penalties)`

The MVP does not need a hint system. Therefore, the efficiency score can be based on the number of accusation attempts, which is one for a completed case; in that implementation, the default efficiency score is 10.

The total score is:

`Total = correct accusation points + evidence score + efficiency score`

Clamp the final result between 0 and 100.

If the accusation is incorrect, the accusation component is zero.

The server must calculate and persist the score. The client may display it but must never determine it.

---

# 6. VISUAL DESIGN SYSTEM

## 6.1 Design direction

Create a premium digital detective environment.

The experience should feel like a modern investigative workspace, not a generic AI chatbot, admin dashboard, or childish detective game.

Visual references in spirit:

- Cinematic crime-board atmosphere.
- Modern editorial typography.
- Premium dark interfaces.
- Subtle evidence-card textures.
- Restrained investigative accents.
- Clear information hierarchy.

Do not reproduce the exact branding or proprietary interface of another product.

## 6.2 Color tokens

Use centralized design tokens.

| Token | Value | Usage |
|---|---|---|
| Background | `#0B0D10` | Main application background |
| Surface | `#13171D` | Panels and sidebars |
| Elevated surface | `#1B212A` | Cards and dialogs |
| Border | `#2B333E` | Dividers and outlines |
| Primary text | `#F3F5F7` | Main text |
| Secondary text | `#A2ABB8` | Supporting text |
| Primary accent | `#D9A441` | Main CTA and investigation highlights |
| Success | `#43B581` | Correct outcome |
| Error | `#E05D5D` | Errors and incorrect outcomes |
| Info | `#6CA6E8` | Informational states |

Maintain readable contrast. Do not communicate status through color alone.

## 6.3 Typography

Use a clean sans-serif family such as Inter for UI text.

An optional display serif may be used for case titles and editorial elements.

Typography must include:

- Consistent heading scale.
- Comfortable body text.
- Readable evidence transcripts.
- Tabular numerals for timestamps.
- Appropriate line height and text wrapping.

## 6.4 Components

Build reusable components for:

- Navigation.
- Buttons.
- Form fields.
- Select controls.
- Cards.
- Modals and drawers.
- Toast notifications.
- Loading indicators.
- Skeleton states.
- Tabs.
- Badges.
- Evidence cards.
- Suspect cards.
- Timeline entries.
- Chat transcripts.
- Image evidence viewer.
- Notebook.
- Confirmation dialogs.
- Empty and error states.

## 6.5 Interaction quality

- Use subtle transitions, generally 150–250 ms.
- Provide visible hover, focus, disabled, loading, success, and error states.
- Respect reduced-motion preferences.
- Use keyboard-accessible interactions.
- Prevent accidental double submission.
- Maintain consistent spacing and alignment.
- Avoid unnecessary gradients, excessive glow, and distracting animations.
- Ensure mobile layouts remain usable at narrow viewport widths.

---

# 7. TECHNOLOGY STACK

## 7.1 Frontend

- React.
- TypeScript with strict mode.
- Vite.
- React Router.
- Tailwind CSS.
- A reusable accessible component system, preferably shadcn/ui where appropriate.
- TanStack Query for server-state management.
- React Hook Form and Zod for forms and client validation.
- Lucide React for icons.
- Vitest and React Testing Library.

Use stable, mutually compatible package versions. Pin dependencies in the lockfile.

## 7.2 Backend

- Node.js LTS.
- TypeScript with strict mode.
- Express.
- MongoDB.
- Mongoose.
- Zod for request and response validation.
- Official Google Gen AI SDK for Gemini.
- Pino or an equivalent structured logger.
- Vitest or Jest for unit and integration tests.
- Supertest for HTTP API testing.

## 7.3 Infrastructure

- MongoDB Atlas or an equivalent managed MongoDB deployment.
- A Node-compatible hosting platform for the API and frontend.
- Environment-based configuration.
- HTTPS in production.
- Centralized error handling.
- Health-check endpoint.
- CI pipeline for linting, type checking, tests, and builds.

Do not introduce Redis, Kubernetes, microservices, or other infrastructure unless justified by actual requirements.

## 7.4 Repository structure

Use a single repository with separate client and server applications.

```text
ai-mystery-room/
├── SPEC.md
├── README.md
├── .gitignore
├── .env.example
├── package.json
├── client/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── app/
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   ├── evidence/
│       │   ├── suspects/
│       │   └── investigation/
│       ├── features/
│       │   ├── cases/
│       │   ├── generation/
│       │   ├── notebook/
│       │   └── accusations/
│       ├── hooks/
│       ├── lib/
│       ├── routes/
│       ├── services/
│       ├── styles/
│       ├── types/
│       └── main.tsx
├── server/
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── modules/
│       │   ├── auth/
│       │   ├── cases/
│       │   ├── generation/
│       │   ├── evidence/
│       │   ├── notebook/
│       │   └── accusations/
│       ├── services/
│       │   ├── gemini/
│       │   ├── storage/
│       │   └── scoring/
│       ├── models/
│       ├── schemas/
│       ├── prompts/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
├── shared/
│   └── src/
│       ├── contracts/
│       ├── enums/
│       └── types/
├── tests/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
└── docs/
    ├── ARCHITECTURE.md
    ├── API.md
    ├── DATA_MODEL.md
    └── ADR/
```

Keep shared types and API contracts consistent between the frontend and backend. Do not import backend-only secrets or implementation modules into the client.

---

# 8. SYSTEM ARCHITECTURE

## 8.1 High-level architecture

```text
React Application
       |
       | HTTPS / JSON
       v
Express REST API
       |
       +---- Authentication and Authorization
       |
       +---- Case and Game Services
       |
       +---- Investigation and Scoring Services
       |
       +---- Gemini Generation Service
       |           |
       |           v
       |       Gemini API
       |
       +---- Media Storage Adapter
       |
       v
MongoDB
```

## 8.2 Architectural responsibilities

**Frontend**
- Render the interface.
- Collect and validate user input.
- Request and display case data.
- Track local interface state.
- Submit notes and accusations.
- Never contain the Gemini API key.
- Never receive the canonical solution before accusation.

**Backend**
- Authenticate users and identify guest sessions.
- Enforce authorization and case ownership.
- Validate all inputs and outputs.
- Orchestrate Gemini generation.
- Validate investigation consistency.
- Persist case state.
- Calculate scores.
- Reveal the solution only after a valid accusation.
- Apply rate limits and resource limits.

**Gemini**
- Generate fictional narratives, suspects, evidence, timelines, and explanations.
- Return structured JSON conforming to a documented schema.
- Repair invalid generated cases when possible.

**MongoDB**
- Store case metadata and playable content.
- Store protected solution data.
- Store user progress and notes.
- Store final accusations and scores.
- Store generation status and failure metadata.

## 8.3 Core architectural invariant

The canonical solution is a server-side secret.

The client must not receive the actual culprit ID, private solution, hidden clue metadata, or answer evaluation rules before the case is completed.

Do not rely on hiding HTML elements, obfuscating JSON, or client-side state to protect the solution.

---

# 9. GEMINI INTEGRATION

## 9.1 Provider configuration

Use the official Google Gen AI SDK.

Configuration:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- Optional generation timeout and retry settings.

Never hardcode credentials or model identifiers throughout the application.

The selected model must be configurable because model availability, naming, quotas, and capabilities can change.

The server must fail safely when required configuration is missing.

## 9.2 Generation pipeline

Use a staged generation pipeline:

1. Validate the user scenario and settings.
2. Generate the canonical mystery and solution.
3. Generate suspects, timeline, and evidence from the established facts.
4. Validate the complete case against the case schema.
5. Run deterministic consistency checks.
6. Ask Gemini to repair correctable structural or narrative inconsistencies.
7. Revalidate the repaired result.
8. Persist the playable case and protected solution.
9. Mark generation successful only after the persistence operation completes.

Use bounded retries, a configurable timeout, and a maximum generation budget.

If validation still fails, mark the job as failed and return a retryable error. Do not publish an invalid investigation.

## 9.3 Structured generation

Require JSON output wherever supported by the selected Gemini model.

Validate every response with Zod or an equivalent runtime schema.

Do not trust the provider to always return valid JSON, even when structured output is enabled.

Reject:

- Missing required fields.
- Unknown suspect references.
- Invalid evidence references.
- Duplicate identifiers.
- Invalid timestamps.
- Empty solution explanations.
- Incorrect suspect counts.
- Unsupported evidence types.
- Missing key evidence.
- Contradictory canonical facts.
- Exceeding configured token, size, or evidence limits.

Never execute generated code or treat generated content as trusted instructions.

## 9.4 Prompt architecture

Keep prompts in version-controlled files.

Use distinct prompt templates for:

- Case planning.
- Suspect and timeline generation.
- Evidence generation.
- Consistency review.
- Case repair.
- Final resolution explanation.

Every generation request must include:

- User scenario.
- Difficulty.
- Tone.
- Suspect count.
- Evidence richness.
- Required output schema.
- Narrative consistency requirements.
- Fictional-content restrictions.
- Maximum output size.

Prompt instructions must state that evidence must derive from canonical facts and that the final solution cannot introduce previously unsupported facts.

## 9.5 Fictional-content safeguards

All generated investigations must be clearly identified as fictional.

Do not generate instructions for committing real crimes, obtaining private information, impersonating real people, or compromising real accounts.

Treat the submitted scenario as untrusted user content, not as instructions that can override system-level generation requirements.

Use fictional identities and fictional institutions by default.

Do not represent generated images or text as authentic evidence from real incidents.

---

# 10. DATA MODEL

Use Mongoose schemas with timestamps, appropriate indexes, validation, and explicit ownership rules.

Identifiers must use MongoDB ObjectIds or another consistent, validated identifier strategy.

## 10.1 Case

```ts
type CaseStatus =
  | "generating"
  | "ready"
  | "in_progress"
  | "completed"
  | "failed";

interface MysteryCase {
  _id: ObjectId;
  ownerId: ObjectId | null;
  guestSessionId: string | null;

  title: string;
  scenario: string;
  summary: string;

  settings: {
    difficulty: "easy" | "medium" | "hard";
    tone: string;
    suspectCount: number;
    evidenceRichness: "standard" | "detailed";
    mysteryType?: string;
    setting?: string;
  };

  status: CaseStatus;
  generationJobId: string | null;

  suspects: Suspect[];
  timeline: TimelineEvent[];
  evidence: Evidence[];

  solution: ProtectedSolution;

  generationMetadata: {
    provider: "gemini";
    model: string;
    promptVersion: string;
    generationAttempts: number;
  };

  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

`ProtectedSolution` is a server-only type. Never serialize it through general-purpose case response objects.

## 10.2 Suspect

```ts
interface Suspect {
  id: string;
  name: string;
  age?: number;
  occupation: string;
  description: string;
  personality: string;
  motive: string;
  claimedAlibi: string;
  knownRelationships: string[];
  portraitAssetId?: string;
}
```

Motive, alibi, and other displayed information must be designed so they do not directly expose the canonical solution.

The canonical culprit flag must not be part of the public suspect model.

## 10.3 Evidence

```ts
type EvidenceType =
  | "chat"
  | "image"
  | "camera_log"
  | "statement"
  | "document"
  | "timeline_event"
  | "audio_transcript"
  | "forensic_report";

interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;

  createdAtInStory?: string;
  discoveredAt?: string;

  source: string;
  content: Record<string, unknown>;

  relatedSuspectIds: string[];
  relatedEvidenceIds: string[];

  assetId?: string;

  tags: string[];
}
```

All `content` values must be validated against a type-specific schema. Arbitrary unvalidated objects must not be rendered directly in the frontend.

## 10.4 Timeline event

```ts
interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  location?: string;
  suspectIds: string[];
  evidenceIds: string[];
}
```

Use ISO 8601 timestamps or a documented story-time format consistently. If a case uses an explicitly fictional time system, preserve its timezone and formatting rules.

## 10.5 Protected solution

```ts
interface ProtectedSolution {
  culpritId: string;
  motive: string;
  method: string;
  opportunity: string;
  narrativeExplanation: string;

  keyEvidenceIds: string[];
  evidenceReasoning: Array<{
    evidenceId: string;
    explanation: string;
  }>;

  redHerringExplanations: Array<{
    evidenceId: string;
    explanation: string;
  }>;
}
```

This structure must be stored and accessed only through server-side services.

For stronger isolation, the solution can be stored in a separate collection with restricted access. At minimum, enforce explicit response serialization and never return the full Mongoose document.

## 10.6 User and guest session

```ts
interface User {
  _id: ObjectId;
  email: string;
  passwordHash?: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GuestSession {
  sessionId: string;
  expiresAt: Date;
  createdAt: Date;
}
```

Guest session identifiers must be generated securely, stored in an HTTP-only cookie, and protected against session theft and fixation.

Do not trust a session identifier supplied freely in a request body.

## 10.7 Investigation progress

```ts
interface InvestigationProgress {
  _id: ObjectId;
  caseId: ObjectId;
  ownerId: ObjectId | null;
  guestSessionId: string | null;

  discoveredEvidenceIds: string[];
  notes: Array<{
    id: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }>;

  accusedSuspectId?: string;
  score?: number;

  status: "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

Enforce a unique index for the case and owner/session combination to prevent duplicate progress records.

Never use a client-supplied owner ID as proof of authorization.

---

# 11. REST API CONTRACT

Base path: `/api/v1`

All responses must use JSON unless explicitly documented otherwise.

## 11.1 Standard success response

```json
{
  "success": true,
  "data": {}
}
```

## 11.2 Standard error response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data.",
    "details": []
  }
}
```

Do not expose stack traces, credentials, provider payloads, internal solution data, or database internals.

## 11.3 Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/ready` | Dependency readiness |
| POST | `/auth/register` | Register an account |
| POST | `/auth/login` | Authenticate |
| POST | `/auth/logout` | End a session |
| GET | `/auth/me` | Get current user |
| POST | `/cases` | Create a generation job |
| GET | `/cases` | List accessible cases |
| GET | `/cases/:caseId` | Get safe case details |
| GET | `/cases/:caseId/status` | Get generation and game status |
| GET | `/cases/:caseId/evidence` | List evidence |
| GET | `/cases/:caseId/evidence/:evidenceId` | Get evidence details |
| POST | `/cases/:caseId/discoveries` | Record evidence discovery |
| GET | `/cases/:caseId/timeline` | Get the case timeline |
| GET | `/cases/:caseId/progress` | Get investigation progress |
| PATCH | `/cases/:caseId/notes` | Update investigation notes |
| POST | `/cases/:caseId/accusations` | Submit a final accusation |
| GET | `/cases/:caseId/resolution` | Get resolution after completion |
| POST | `/cases/:caseId/retry-generation` | Retry an eligible failed job |
| DELETE | `/cases/:caseId` | Delete an owned case |

## 11.4 Create-case request

`POST /api/v1/cases`

```json
{
  "scenario": "A priceless diamond disappeared from a hotel suite.",
  "settings": {
    "difficulty": "medium",
    "tone": "classic_detective",
    "suspectCount": 4,
    "evidenceRichness": "standard",
    "setting": "A luxury hotel"
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "caseId": "CASE_ID",
    "status": "generating",
    "statusUrl": "/api/v1/cases/CASE_ID/status"
  }
}
```

Use a placeholder ID only in documentation examples. Actual IDs must be generated by the application.

Case creation must return promptly rather than hold the HTTP connection open for the entire AI generation process.

Use polling initially. Server-sent events may be added later if justified.

## 11.5 Case status response

```json
{
  "success": true,
  "data": {
    "caseId": "CASE_ID",
    "status": "generating",
    "stage": "validating",
    "retryable": false,
    "error": null
  }
}
```

Only return fields required by the client. Generation stages must reflect actual backend progress.

## 11.6 Public case response

The case response may include:

- Case ID.
- Title.
- Scenario.
- Summary.
- Public settings.
- Suspects.
- Public timeline.
- Evidence summaries.
- Investigation status.
- Discovery progress.

It must not include:

- Culprit ID.
- Protected solution.
- Hidden evidence reasoning.
- Private generation prompts.
- Provider credentials.
- Internal validation payloads.

## 11.7 Accusation request

`POST /api/v1/cases/:caseId/accusations`

```json
{
  "suspectId": "SUSPECT_ID"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "completed",
    "correct": false,
    "score": 25,
    "resolutionUrl": "/api/v1/cases/CASE_ID/resolution"
  }
}
```

The score and correctness must be computed on the server.

The solution must not be returned in this response unless the API contract is explicitly extended and tested to reveal it only after the completed state has been persisted.

## 11.8 Error codes

Use stable application-level error codes:

- `VALIDATION_ERROR`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CASE_NOT_READY`
- `CASE_ALREADY_COMPLETED`
- `INVALID_SUSPECT`
- `GENERATION_FAILED`
- `GENERATION_TIMEOUT`
- `AI_PROVIDER_UNAVAILABLE`
- `RATE_LIMIT_EXCEEDED`
- `INTERNAL_ERROR`

Map errors to appropriate HTTP status codes.

---

# 12. CASE GENERATION AND VALIDATION

## 12.1 Generation constraints

Enforce configurable limits for:

- Scenario length.
- Number of suspects.
- Number of evidence items.
- Number of timeline events.
- Generated text length.
- Image dimensions and file size.
- Generation duration.
- Retry count.
- Concurrent jobs per session.
- AI provider usage.

Use sensible defaults and centralize the limits in configuration.

## 12.2 Consistency validation

Implement deterministic validation wherever possible.

Examples:

- Every evidence suspect reference must exist.
- Every timeline suspect reference must exist.
- Every related evidence ID must exist.
- The culprit must be a valid suspect.
- Every key evidence ID must exist.
- Every solution explanation must reference existing evidence.
- Required clues must support the canonical solution.
- Timeline events must be chronologically coherent.
- Alibis and camera records must not create impossible contradictions unless explicitly explained.
- No evidence may rely on a fact absent from the established case.
- A red herring must have a plausible explanation.
- Public responses must exclude protected fields.

Use Gemini for semantic consistency review, but never rely on a language model as the only security or schema-validation layer.

## 12.3 Case repair

When validation fails:

1. Identify specific validation failures.
2. Send only the relevant case content and validation feedback to the repair prompt.
3. Request a corrected structured response.
4. Validate the corrected response.
5. Stop after the configured retry limit.

Do not repeatedly regenerate the entire case without limits.

---

# 13. SECURITY AND PRIVACY

Security is a release requirement, not a future enhancement.

## 13.1 API security

- Validate request bodies, parameters, and query strings.
- Apply request-size limits.
- Use Helmet or equivalent security headers.
- Configure CORS with explicit allowed origins.
- Apply rate limits to authentication, case generation, and accusation endpoints.
- Use parameterized database queries and Mongoose validation.
- Avoid constructing database queries directly from untrusted objects.
- Avoid logging passwords, tokens, API keys, or complete private solution payloads.
- Apply timeouts to external requests.
- Handle provider failures safely.

## 13.2 Authentication

If accounts are implemented:

- Hash passwords using Argon2id or an appropriate secure alternative.
- Use secure, HTTP-only, SameSite cookies for sessions.
- Use CSRF protection where required by the cookie and deployment strategy.
- Validate authorization on every protected operation.
- Prevent cross-user access to cases, notes, and progress.
- Rate-limit login and registration attempts.

Guest play must use secure, unguessable session identifiers. A guest session must not grant access to another session's cases.

## 13.3 Solution confidentiality

- Keep the canonical solution on the server.
- Use dedicated response DTOs.
- Never serialize protected solution fields.
- Do not send the solution to the frontend during generation.
- Reveal the solution only after a valid final accusation.
- Test network responses to ensure that hidden fields are absent.
- Treat logs, analytics, caches, and error messages as possible leakage paths.

## 13.4 Generated media

- Store generated assets through a controlled storage adapter.
- Validate file types and sizes.
- Do not trust file extensions alone.
- Avoid serving arbitrary user-supplied HTML or executable files.
- Use short-lived signed URLs when private cloud storage is used.
- Avoid predictable public object names for private case assets.

## 13.5 Data retention

Document guest-session expiration and cleanup policies.

Allow users to delete their cases. Case deletion must remove or schedule cleanup of associated progress and media where applicable.

Use retention policies that are explicit and consistent with the application's privacy notice.

---

# 14. PERFORMANCE AND RELIABILITY

## 14.1 Performance objectives

Initial engineering targets:

- Typical frontend route transitions: under 200 ms after required data is cached.
- Standard API reads: p95 under 500 ms under the agreed test load, excluding external AI calls.
- Case creation: respond promptly with a generation job ID.
- Investigation interactions: avoid unnecessary full-case refetches.
- Images: lazy-load noncritical assets.
- Large evidence collections: paginate if necessary.

These are targets to validate under a defined test environment, not guaranteed production measurements.

## 14.2 Reliability

- Separate generation jobs from ordinary API request handling.
- Persist generation state.
- Handle timeouts and provider rate limits.
- Use bounded retries and backoff.
- Avoid duplicate generation through request deduplication or idempotency keys.
- Prevent duplicate accusations through server-side state checks.
- Make generation retries safe.
- Ensure partially generated cases cannot become playable.
- Provide meaningful error states and retry paths.

For the MVP, a persistent MongoDB-backed job implementation may be sufficient. If a separate queue is introduced later, preserve the same API contracts and state transitions.

---

# 15. TESTING STRATEGY

## 15.1 Unit tests

Test:

- Request and response schemas.
- Scenario validation.
- Case validation.
- Evidence relationship validation.
- Timeline consistency rules.
- Scoring.
- Public/private serialization.
- Authorization helpers.
- Generation-state transitions.

## 15.2 Integration tests

Test:

- Case creation.
- Successful generation using a mocked Gemini provider.
- Generation failure and retry.
- Persistence and retrieval.
- Evidence discovery.
- Notebook updates.
- Invalid suspect submission.
- Correct and incorrect accusations.
- Resolution access before and after completion.
- Cross-user and cross-session access attempts.
- Duplicate accusation prevention.
- Case deletion.

Tests must not depend on live Gemini calls.

## 15.3 End-to-end tests

Use Playwright or an equivalent browser automation framework.

Cover:

1. Landing page loads.
2. User creates a scenario.
3. Generation progresses and succeeds.
4. User opens suspects and evidence.
5. User records a notebook entry.
6. User discovers evidence.
7. User submits an accusation.
8. The resolution is displayed.
9. Reloading the completed case preserves its result.
10. Mobile navigation and evidence viewing work.

## 15.4 AI evaluation fixtures

Maintain a small suite of deterministic mystery fixtures covering:

- Straightforward deduction.
- Conflicting alibis.
- Timestamp-based reasoning.
- Misleading evidence.
- Multiple suspects with plausible motives.
- Invalid generated references.
- Contradictory facts.
- Missing key clues.

The purpose is to test case validity and gameplay integrity, not merely JSON generation.

---

# 16. ACCESSIBILITY

Target WCAG 2.2 AA where practical.

Required:

- Semantic HTML.
- Keyboard navigation.
- Visible focus indicators.
- Accessible labels for controls.
- Dialog focus management.
- Sufficient text contrast.
- Screen-reader-friendly status updates.
- Reduced-motion support.
- Appropriate image alternative text.
- No color-only communication of outcomes.
- Accessible form errors.
- Touch-friendly controls.

The mystery must remain playable without relying exclusively on images, animation, or color distinctions.

---

# 17. OBSERVABILITY

Implement structured logging and basic operational metrics.

Track:

- Generation requests.
- Generation success and failure rates.
- Average and percentile generation duration.
- Validation failures.
- Provider timeout and rate-limit errors.
- API error rates.
- Accusation completion rates.
- Evidence discovery rates.
- AI usage per case.

Avoid collecting unnecessary personal information.

Do not log full secrets, authentication tokens, private notebook content, or hidden solutions.

Include a request or correlation ID in logs so generation and API failures can be investigated.

---

# 18. CONFIGURATION

Provide `.env.example` containing documented placeholders.

```dotenv
NODE_ENV=development

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
PORT=3000

MONGODB_URI=

GEMINI_API_KEY=
GEMINI_MODEL=

SESSION_SECRET=
SESSION_TTL_HOURS=24

GENERATION_TIMEOUT_MS=60000
GENERATION_MAX_RETRIES=2
GENERATION_MAX_CONCURRENT_JOBS=2

MAX_SCENARIO_LENGTH=2000
MIN_SCENARIO_LENGTH=30

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60

MEDIA_STORAGE_PROVIDER=local
MEDIA_STORAGE_BUCKET=

LOG_LEVEL=info
```

These values are development defaults, not universal production limits.

Do not commit real credentials. Validate required environment variables at server startup and fail with actionable configuration errors.

The exact Gemini model and generation settings must be confirmed against the selected model's current API capabilities.

---

# 19. DEVELOPMENT PHASES

## Phase 1 — Foundation

Deliver:

- Repository setup.
- TypeScript configuration.
- Shared schemas and types.
- Design tokens and UI components.
- Express application.
- MongoDB connection.
- Health and readiness endpoints.
- Environment validation.
- Linting, formatting, and test infrastructure.

**Exit criteria:** The client and server run locally, type-check, and pass initial tests.

## Phase 2 — Product interface

Deliver:

- Landing page.
- Scenario form.
- Generation progress interface.
- Investigation room shell.
- Suspect cards.
- Evidence viewers.
- Timeline.
- Notebook.
- Accusation and resolution interfaces.
- Responsive behavior.

Use clearly marked fixtures only during this phase.

**Exit criteria:** Every screen and interaction works against local deterministic data.

## Phase 3 — Backend gameplay

Deliver:

- Case persistence.
- Evidence and timeline APIs.
- Session ownership.
- Discovery tracking.
- Notebook persistence.
- Accusation submission.
- Server-side scoring.
- Resolution access control.

**Exit criteria:** A seeded case can be played end to end without Gemini.

## Phase 4 — Gemini generation

Deliver:

- Gemini client.
- Prompt templates.
- Structured generation.
- Validation pipeline.
- Semantic consistency review.
- Repair attempts.
- Generation job lifecycle.
- Failure handling and retries.

**Exit criteria:** A scenario can reliably produce a valid, playable investigation, and invalid output cannot become a ready case.

## Phase 5 — Production hardening

Deliver:

- Security review.
- Accessibility checks.
- Automated integration and end-to-end tests.
- Rate limiting.
- Error monitoring.
- Media-storage configuration.
- Deployment configuration.
- Documentation.
- Production build verification.

**Exit criteria:** All release-blocking acceptance criteria pass.

---

# 20. DEFINITION OF DONE

A feature is complete only when:

- Its documented behavior is implemented.
- UI states are complete.
- Inputs are validated.
- Authorization is enforced where applicable.
- Loading and failure states work.
- Tests cover important success and failure paths.
- Type checking and linting pass.
- API contracts are documented.
- No secrets or protected data are exposed.
- The feature works at desktop and mobile widths.
- Documentation reflects the implementation.

A visually complete screen with nonfunctional controls does not satisfy the definition of done.

---

# 21. GLOBAL ACCEPTANCE CRITERIA

The application is ready for MVP release when all of the following are true.

### Product

- A user can submit a scenario and create a playable mystery.
- Each ready mystery has one canonical culprit.
- Each mystery contains three to six suspects.
- Each mystery contains at least five meaningful evidence items.
- Users can inspect evidence, suspects, and timelines.
- Users can take notes.
- Users can submit exactly one final accusation per case.
- The server evaluates the accusation correctly.
- The resolution explains the evidence and actual solution.
- Completed cases remain completed after refresh.

### AI

- Gemini-generated output is schema-validated.
- Case consistency is checked before publication.
- Invalid generated content cannot become playable.
- Generation failures are recoverable.
- Provider credentials remain server-side.
- The selected Gemini model is configurable.
- AI generation is not required for seeded demo cases.

### Security

- Hidden solutions never appear in pre-accusation responses.
- Users cannot access another user's private cases.
- Guest sessions cannot access other guest sessions' cases.
- Invalid suspect IDs are rejected.
- Duplicate accusations are prevented.
- Sensitive values are not exposed in logs or error responses.

### Engineering

- TypeScript strict mode passes.
- Linting passes.
- Unit and integration tests pass.
- Critical end-to-end tests pass.
- Production builds succeed.
- Environment configuration is documented.
- No mandatory MVP feature depends on unavailable image or video generation.

### Experience

- All primary navigation works.
- All major actions have visible feedback.
- Empty, loading, error, and success states are implemented.
- The application is responsive.
- Keyboard navigation is supported.
- The investigation interface remains understandable without exposing the culprit.

---

# 22. CODEX IMPLEMENTATION RULES

Codex must follow this specification as an implementation contract.

## Before coding

1. Read `SPEC.md`, `README.md`, and the existing repository structure.
2. Inspect existing files before replacing them.
3. Identify missing requirements and architectural conflicts.
4. Create a concise implementation plan mapped to the phases in this specification.
5. Preserve working code unless a change is required by the specification.

## While coding

1. Implement one coherent feature at a time.
2. Define shared types and validation schemas before wiring dependent layers.
3. Implement API contracts before connecting UI features to them.
4. Build deterministic gameplay before integrating Gemini.
5. Keep the Gemini provider behind a dedicated service interface.
6. Keep protected solution data separate from public response DTOs.
7. Add tests alongside features.
8. Use real persistence and real API integration in completed application flows.
9. Avoid hardcoded demo content in production paths.
10. Never leave primary controls as placeholders.
11. Do not silently omit requirements because they are inconvenient.
12. Update documentation and the specification when approved decisions change.

## Before declaring completion

Run:

- Dependency installation.
- Linting.
- Type checking.
- Unit tests.
- Integration tests.
- Production builds.
- Critical end-to-end tests where configured.

Report the actual results. Never claim a test passed unless it was executed successfully.

If a command cannot run because of missing credentials, unavailable services, or environment limitations, report the limitation explicitly.

---

# 23. REQUIRED PROJECT DELIVERABLES

The completed repository must include:

- `SPEC.md` — authoritative product and implementation specification.
- `README.md` — setup, scripts, configuration, and developer guide.
- `.env.example` — documented configuration placeholders.
- `docs/ARCHITECTURE.md` — architecture and service boundaries.
- `docs/API.md` — endpoint contracts.
- `docs/DATA_MODEL.md` — database schema and access rules.
- `docs/ADR/` — records of significant architectural decisions.
- Client application.
- Backend application.
- Shared API contracts and validation schemas.
- Gemini prompt templates.
- Database models and indexes.
- Unit, integration, and end-to-end tests.
- Seeded sample mystery.
- Local development instructions.
- Production deployment instructions.

All deliverables must be consistent with this specification.

---

# 24. FINAL PRODUCT DEFINITION

AI Mystery Room is not simply a chatbot that writes detective stories.

It is a structured, stateful investigation game in which:

- Users define the premise.
- Gemini constructs a coherent fictional world.
- The backend establishes and protects the canonical truth.
- Evidence provides the interface through which the mystery is explored.
- The user forms and submits a hypothesis.
- Deterministic game logic evaluates the decision.
- The final resolution explains how the evidence fits together.

**The defining architectural principle is simple: AI creates the mystery, the application guarantees the rules, and the user solves the case.**

This specification governs the initial implementation. Any change to scope, behavior, architecture, or data contracts must be reflected in this document before the affected implementation is considered complete.

---

# 25. APPROVED MVP DETAIL — UI, API, AI, AND SCORING

This section records the approved student-project implementation requirements and resolves conflicts with earlier generic MVP language. It takes precedence for page flow, endpoint paths, difficulty counts, hints, and scoring. Security and solution confidentiality requirements in earlier sections remain in force.

## 25.1 Visual direction and page map

Use a premium, warm mid-tone interface. Do not use an extremely light white canvas or the original near-black primary theme. Use warm parchment backgrounds, soft olive/sage and muted amber accents, ink-colored text, and elevated cream panels. Keep borders, shadows, textures, and motion restrained. Use a serif display face for case titles and a clear sans-serif for controls and evidence. Maintain strong contrast and readable evidence text.

| Page | Purpose and required elements | Loading and errors | Navigation and responsive behavior |
|---|---|---|---|
| Home (`/`) | Introduce the game, primary Create a mystery action, sample case, concise three-step explanation, and fictional-content disclosure. | No data dependency. Any remote sample failure is shown on the sample page with a retry path. | Header links to create and sample case. Stack hero art and copy on narrow screens; retain the primary CTA above the fold. |
| Create Mystery (`/create`) | Premise input (30–2,000 characters), character count, Easy/Medium/Hard selector, fictional-content notice, and generate action. | Disable duplicate submission while generating; show an in-button progress state. Preserve entered scenario and show a readable retryable error if the API fails. Do not fabricate successful generation. | Back to Home. At mobile widths stack form and introduction; controls remain full-width and touch-friendly. |
| Investigation Room (`/case/:id`) | Case title/reference, story, difficulty, progress, suspect cards, searchable clue list, clue detail/source/time/location, notebook, hint action, and accusation action. | Show case-opening state. API errors explain that the case could not be opened and provide a home link. Hint/discovery errors appear inline without discarding the case. | Breadcrumb to Home; tabs switch between clues and suspects. On narrow screens use a single column and keep tabs/actions reachable without horizontal scrolling. Notes persist for the active browser session and are private. |
| Accusation (`/case/:id/accuse`) | Exactly one suspect selector, explicit finality warning, and confirmation/submission action. | Disable submission until a suspect is selected and while the request is pending. Preserve selection and display API errors. | Back to the investigation. On mobile use a single-column, full-width suspect list. |
| Results (`/case/:id/result`) | Correct/incorrect verdict, accused and actual culprit, total and score breakdown, solution explanation, motive, method, reconstructed timeline, and key evidence. | Show a resolution loading state. Do not render result data until the server returns a completed case result. Offer retry after fetch failure. | Actions create another mystery or return home. Stack score and verdict sections on mobile. |

All pages must provide visible focus, hover, disabled, success, and error states; semantic labels; keyboard operation; reduced-motion support; and responsive layouts at narrow widths. Use short, restrained transitions (about 150–250 ms). The interface must never reveal the culprit, solution, or which clues are key before a valid accusation has been persisted.

### Page-to-requirement mapping

- Home presents the product journey and routes into the two case entry points.
- Create Mystery captures and validates the scenario and difficulty before calling the case API.
- Investigation Room reads only the public case DTO; clue discovery and hints update persistent server state.
- Accusation sends one suspect ID and does not calculate correctness or score in the browser.
- Results reads the server-authorized resolution after the completed state is stored.

## 25.2 Difficulty content and scoring

| Difficulty | Suspects | Clues | Hints | Correct accusation base |
|---|---:|---:|---:|---:|
| Easy | 3 | 5 | 2 | 100 |
| Medium | 4 | 7 | 3 | 150 |
| Hard | 5 | 9 | 3 | 200 |

Score on the server only:

```text
base = correct ? difficultyBase : 0
score = max(0, base + 5 * distinctDiscoveredClues - 10 * hintsUsed)
```

Each clue can be discovered once. Every requested hint incurs one penalty and consumes one available hint, even if the player later requests another. A completed case accepts no additional hint, discovery, or accusation request. Persist the score and the breakdown. The browser may display the returned values but cannot provide or override them.

## 25.3 API contracts

The project API base path is `/api`. All successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "error": { "code": "...", "message": "..." } }`. Guest ownership is bound to an unguessable, HTTP-only, SameSite session cookie. Enforce ownership on every case operation. Validate body, path parameters, and state transitions. Do not return stack traces, provider messages, secrets, or protected solution fields.

### `POST /api/cases` — generate a case

Request:

```json
{ "scenario": "A painting vanished from a locked gallery during a storm. Four people were inside.", "difficulty": "medium" }
```

`scenario` is a trimmed string of 30–2,000 characters. `difficulty` is `easy`, `medium`, or `hard`; default `medium`. Return promptly with HTTP 202 and `{ "caseId": "...", "status": "generating", "statusUrl": "/api/cases/CASE_ID/status" }`. Persist the generation job and poll its actual state. A ready case is persisted only after structured output passes validation. On provider/configuration failure retain a failed, non-playable job with a safe error and bounded retry. Rate-limit generation.

### `GET /api/cases/:id/status` and `POST /api/cases/:id/retry-generation`

Status returns `{ "caseId": "...", "status": "generating", "stage": "validating", "retryable": false, "error": null }`; terminal states are `ready` and `failed`. The retry endpoint accepts an empty body and starts a bounded retry only for an owned, eligible failed job. A generation job ID becomes the case ID after successful persistence. Job status and ownership survive server restarts; interrupted jobs become failed and eligible for retry.

### `GET /api/cases/:id` — retrieve active case

Return the owned public case DTO. It includes case ID, title, story, difficulty, suspects, clue presentation fields, discovered clue IDs, remaining hints, and status. It excludes culprit ID, solution, hint contents, hidden reasoning, prompt, and the key-clue flags. Return `NOT_FOUND` or `FORBIDDEN` without disclosing another session’s case.

### `POST /api/cases/:id/clues/:clueId/discover` — discover clue

Empty JSON body. Validate case ownership, active status, and clue membership. Record a clue ID once and return the updated public case. Unknown clue: `NOT_FOUND`; completed case: `CASE_ALREADY_COMPLETED`.

### `POST /api/cases/:id/hints` — request next hint

Empty JSON body. Validate ownership, active status, and remaining hints. Return `{ "hint": "A progressively specific nudge.", "mystery": { /* updated public case */ } }`. Return `NO_HINTS_REMAINING` when exhausted. Never return later hints in advance or name the culprit in a hint.

### `POST /api/cases/:id/accuse` — submit final accusation

Request: `{ "suspectId": "suspect-id" }`. Require exactly one existing suspect and an active case. Persist the accusation, completion state, correctness, and score atomically. Return `{ "correct": true, "culprit": { /* suspect */ }, "accusation": { /* suspect */ }, "explanation": "...", "motive": "...", "method": "...", "timeline": ["..."], "score": 160, "breakdown": { "base": 150, "clues": 20, "hints": 10 } }`. This is the first response allowed to reveal solution data. Invalid suspect: `INVALID_SUSPECT`; duplicate submission: `CASE_ALREADY_COMPLETED`.

### `GET /api/cases/:id/result` — retrieve completed result

Require case ownership and completed status. Return the same result fields as accusation response. Before completion return `CASE_NOT_READY` and do not serialize protected fields.

Use HTTP 400 for invalid input, 401/403 for authentication/ownership failures, 404 for missing resources, 409 for invalid game state, 429 for rate limits, and 500/503 for safe internal/provider failures. Keep application error codes stable.

## 25.4 Persistence model

Persist one Mystery record with: owner session identifier; title and original scenario/story; difficulty; generated suspects; generated clues and their suspect references; private hint array; private canonical solution (`culpritId`, explanation, motive, method, reconstructed timeline); discovered clue IDs; hint-use count; active/completed status; submitted suspect ID; score and score breakdown; timestamps. Index ownership and creation time.

Use response DTOs rather than serializing database documents. Mark the canonical solution and undisclosed hints excluded from normal database queries by default. Only the accusation/result service opts into those fields. Do not put the solution, hidden clue flags, or full hint array in frontend state, HTML, generated public assets, or logs.

## 25.5 Gemini output and validation

Request JSON matching this structure (field values are illustrative):

```json
{
  "title": "The Last Light",
  "story": "A concise fictional case setup...",
  "suspects": [{ "id": "mara", "name": "Mara Voss", "role": "Keeper", "age": 42, "description": "...", "motive": "...", "avatar": "M" }],
  "clues": [{ "id": "register", "title": "The register", "category": "Document", "summary": "...", "detail": "...", "location": "Office", "time": "9:20 PM", "key": true, "suspectIds": ["mara"] }],
  "hints": ["Start with the timing..."],
  "solution": { "culpritId": "mara", "explanation": "...", "motive": "...", "method": "...", "timeline": ["..."] }
}
```

The selected difficulty controls exact suspect, clue, and hint counts in §25.2. Default the configurable model to `gemini-3.8-flash`; keep `GEMINI_MODEL` configurable and verify model availability when deploying. Validate the JSON schema, required text lengths, unique IDs, valid suspect references, valid culprit reference, at least two key clues, and clues that make the solution defensible before persistence. Check timeline and narrative consistency deterministically where possible; use semantic review/repair with bounded retries for cross-reference and contradiction checks. Invalid output must not become playable. Hints should become progressively more specific and must not expose the answer. Treat provider output as untrusted input.

## 25.6 Acceptance criteria for this project

- A player can create an Easy, Medium, or Hard mystery; each has the exact counts in §25.2.
- Generation returns valid structured data or a readable recoverable error; invalid output is never playable.
- A deterministic sample case is available without Gemini generation.
- Players can inspect suspects and clues, discover clues, request bounded hints, and submit one final accusation.
- Guest cases are isolated by secure session ownership.
- No pre-accusation response or client payload reveals culprit, solution, hint contents, or key-clue flags.
- Server validates case/suspect membership, state transitions, hint limits, and duplicate submissions.
- Server-calculated score follows §25.2 and is persisted; minimum is zero.
- Results identify the verdict and culprit and explain motive, method, timeline, and supporting evidence.
- Active and completed case data remain available to the same session after refresh; notes remain private to the local active session unless account storage is later implemented.
- All five pages have loading, failure, and narrow-screen states and work with keyboard navigation and reduced motion.
- The deployed website can communicate with the configured API over HTTPS; credentials stay server-side.

## 25.7 Implementation layout and local setup

Use separate `client/` (Vite, React, TypeScript) and `server/` (Express, TypeScript, MongoDB/Mongoose, Zod, Google Gen AI SDK) applications, with shared API types where practical. Copy `.env.example` to `server/.env`; required server settings include `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `CLIENT_URL`, and a strong `SESSION_SECRET`. Never commit `.env` or put Gemini credentials in Vite variables. Start local development with `npm install`, then `npm run dev`; MongoDB and a Gemini key are required for generated cases. The deterministic sample case requires MongoDB but not Gemini.

The frontend page design can be prototyped with Stitch AI, but generated mockups are references: implement every action against the documented API, and ensure the actual accessible, responsive page behavior matches this section.
