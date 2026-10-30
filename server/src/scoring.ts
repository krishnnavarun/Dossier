import type { Difficulty } from './types.js';
const basePoints:Record<Difficulty,number>={easy:100,medium:150,hard:200};
export function calculateScore(difficulty:Difficulty,correct:boolean,discoveredClueCount:number,hintsUsed:number){const base=correct?basePoints[difficulty]:0;const clues=Math.max(0,discoveredClueCount)*5;const hints=Math.max(0,hintsUsed)*10;return{score:Math.max(0,base+clues-hints),breakdown:{base,clues,hints}};}
