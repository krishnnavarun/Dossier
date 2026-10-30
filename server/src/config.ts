import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({ NODE_ENV: z.string().default('development'), PORT: z.coerce.number().default(5000), CLIENT_URL: z.string().url().default('http://localhost:5173'), MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/ai-mystery-room'), GEMINI_API_KEY: z.string().optional(), GEMINI_MODEL: z.string().default('gemini-3.8-flash'), SESSION_SECRET: z.string().min(24).default('local-development-session-secret-change-me'), GENERATION_TIMEOUT_MS: z.coerce.number().default(60000), GENERATION_MAX_RETRIES: z.coerce.number().default(2) });
export const config = envSchema.parse(process.env);
if(config.NODE_ENV==='production'&&(!process.env.SESSION_SECRET||!process.env.MONGODB_URI||!process.env.GEMINI_API_KEY))throw new Error('Production requires SESSION_SECRET, MONGODB_URI, and GEMINI_API_KEY to be configured.');
