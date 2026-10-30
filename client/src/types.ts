export type Difficulty = 'easy' | 'medium' | 'hard';
export type Suspect = { id: string; name: string; role: string; age: number; description: string; motive: string; avatar: string };
export type Clue = { id: string; title: string; category: string; summary: string; detail: string; location: string; time: string; key?: boolean; suspectIds?: string[] };
export type Mystery = { id: string; title: string; story: string; difficulty: Difficulty; suspects: Suspect[]; clues: Clue[]; discoveredClueIds: string[]; hintsUsed: number; hintsRemaining: number; status: 'active' | 'completed'; score?: number; accusation?: string };
export type Result = { correct: boolean; culprit: Suspect; accusation: Suspect; explanation: string; motive?: string; method?: string; timeline?: string[]; score: number; breakdown: { base: number; clues: number; hints: number } };
export type CaseHistoryItem = { id: string; title: string; difficulty: Difficulty; status: 'active' | 'completed'; score?: number; createdAt?: string };
