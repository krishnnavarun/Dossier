import type { Request } from 'express';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SessionRequest = Request & { sessionId: string };
